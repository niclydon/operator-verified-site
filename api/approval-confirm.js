// GET /api/approval-confirm - re-confirm a seal's human-approval
// record for the public verify page. The seal stores only the
// approval record's hash (proof_hash); this endpoint reports
// whether that record still stands, reading the signed record
// projections the Visto approval service (W2) publishes outward
// to public storage (push-copies-out: the service pushes signed
// copies out; nothing inbound reaches it for confirmation reads,
// and its own hostname is an issuer identity, never a read
// address).
//
//   /api/approval-confirm?proof_hash=sha256:...
//
// Each projection lives at <base>/records/<bare-hex>.json and
// carries the signed record, its confirmation state
// ({ status, consumed, expires_at }), an as_of timestamp, and
// the issuer's Ed25519 signature over the JCS-canonical form of
// { record_hash, status, consumed, expires_at, as_of }. This
// endpoint verifies that signature against the pinned issuer
// key before reporting anything, and binds the check to the
// requested proof_hash, so a confirmation cannot be transplanted
// from one record to another and an unsigned or tampered object
// in the store confirms nothing.
//
// Responses (JSON, never cached: a confirmation is a statement
// about now):
//   { status: "valid", consumed, record_hash, checked_at }
//     checked_at is the projection's as_of: the moment the
//     service last attested this state, not the moment of this
//     read. The verify page shows it as the last confirmed time.
//     "valid" carries the approval service's own re-confirmation
//     semantics: the record was issued and has not been revoked.
//     Expiry and consumption are execution gates (a record can
//     no longer be reserved once expired or consumed), reported
//     here as fields, not as confirmation states; a record that
//     was consumed by its one gated execution and later expires
//     still re-confirms valid, which is the fact a seal's
//     approval claim needs. Freshness is enforced below: a
//     projection whose as_of is stale or implausible fails
//     closed as unreachable rather than confirming old state.
//   { status: "revoked" | "unknown", checked_at }
//     "unknown" is a store 404 for a record the service never
//     projected, confirmed against a canary object (below) so a
//     dead or wrong store cannot masquerade as an empty one.
//   { status: "not-rechecked", checked_at } when the projection
//     read is disabled by configuration (below): the verify page
//     then shows the approval as claimed but not re-checked,
//     which is the W3 SPEC 5.2 degraded state, never a pass.
//   502 { status: "unreachable", checked_at } when the store
//     cannot be reached, answers non-JSON or an oversized body,
//     the projection's signature does not verify, or its as_of
//     is stale: the verify page reports the approval as not
//     re-checked at this time, never as a pass and never as a
//     rejection. Every 502 path logs a reason code, because
//     these responses are otherwise indistinguishable in
//     production and a silent signature failure after an issuer
//     redeploy must not look like a network blip.
//
// Canary: the gate-1 publish record below is a permanent
// production record the reconciler republishes every cycle. On
// a 404 for any other hash, the endpoint reads the canary's
// projection: if the canary is present, verifiable, and fresh,
// the store is alive and the requested record genuinely has no
// projection ("unknown"); if the canary is missing or bad, the
// store itself is gone, empty, or wrong, which is an outage
// (502), not a negative verdict on the requested approval.
//
// Configuration: VISTO_PROJECTION_BASE overrides the projection
// store's public base URL; the default is the production store
// the approval service reconciles into every 60 seconds. The
// value "off" is the kill switch: the endpoint returns to the
// not-rechecked state with no code change. (The predecessor
// variable VISTO_RECONFIRM_BASE is read by nothing; the route
// it named was ruled out and never existed publicly.)
//
// The projection status vocabulary is pinned by the approval
// service's own Confirmation type: "valid" and "revoked" are
// the only statuses ever projected ("unknown" records are not
// projected at all). A signed object carrying any other status
// is a contract break, reported here as unreachable and logged.
//
// The projection's carried record object is NOT authenticated
// by this endpoint: the envelope signature authenticates the
// confirmation tuple bound to the requested hash, and nothing
// in the response is read from the record object. Never read
// fields from it here without first verifying the record's own
// signature and recomputing its hash.
//
// Read-only: this endpoint creates, modifies, and reserves
// nothing; confirmation is a status read by design.

const { createPublicKey, verify } = require("node:crypto");

const HASH_REF = /^sha256:[a-f0-9]{64}$/;
const DEFAULT_PROJECTION_BASE =
  "https://3vt5gaof1obgb9ja.public.blob.vercel-storage.com";
// Pinned Visto issuer trust: the same key the approval records
// themselves are signed under (public key; safe to publish).
const ISSUER = "https://approvals.niclydon.io";
const ISSUER_KEY_ID = "visto-service-1";
const ISSUER_JWK = { kty: "OKP", crv: "Ed25519", x: "EsF9yYa6ZZsO5jBQDKsXP9agoaJN9S_q_rMoXOmisLE" };
// Freshness bound for a projection's as_of. The service
// reconciles every 60 seconds; ten minutes of slack absorbs a
// missed cycle or two and clock drift, and anything older is a
// dead reconciler or a replayed object, not a confirmation.
const MAX_PROJECTION_AGE_MS = 10 * 60 * 1000;
const MAX_PROJECTION_SKEW_MS = 2 * 60 * 1000;
// The gate-1 publish record (approved 2026-10-28, consumed by
// its gated publication): the canary described in the header.
const CANARY_HEX = "84e45296d415c957e8dcb133e3c517b6ad4557b6a8119681f14ebe30a42436bf";
const MAX_BODY_BYTES = 256 * 1024;

// JCS (RFC 8785) canonical form of the flat signed contents:
// keys sorted, no whitespace. Every value here is a string or a
// boolean, for which JSON.stringify is exactly the JCS form.
function canonicalContents({ record_hash, status, consumed, expires_at, as_of }) {
  const fields = { as_of, consumed, expires_at, record_hash, status };
  return "{" + Object.keys(fields).sort()
    .map((k) => `${JSON.stringify(k)}:${JSON.stringify(fields[k])}`).join(",") + "}";
}

function projectionConfirms(projection, proofHash) {
  if (!projection || typeof projection !== "object" || Array.isArray(projection)) return false;
  const { record, confirmation, as_of, signature } = projection;
  if (!record || typeof record !== "object") return false;
  if (record.issuer !== ISSUER) return false;
  if (!confirmation || (confirmation.status !== "valid" && confirmation.status !== "revoked")) return false;
  if (typeof confirmation.consumed !== "boolean" || typeof confirmation.expires_at !== "string") return false;
  if (typeof as_of !== "string") return false;
  if (!signature || signature.alg !== "ed25519" || signature.key_id !== ISSUER_KEY_ID) return false;
  if (typeof signature.value !== "string") return false;
  try {
    const key = createPublicKey({ key: ISSUER_JWK, format: "jwk" });
    const contents = canonicalContents({
      record_hash: proofHash,
      status: confirmation.status,
      consumed: confirmation.consumed,
      expires_at: confirmation.expires_at,
      as_of,
    });
    return verify(null, Buffer.from(contents, "utf8"), key, Buffer.from(signature.value, "base64url"));
  } catch {
    return false;
  }
}

function projectionFresh(as_of, nowIso) {
  const asOfMs = Date.parse(as_of);
  if (!Number.isFinite(asOfMs)) return false;
  const ageMs = Date.parse(nowIso) - asOfMs;
  return ageMs <= MAX_PROJECTION_AGE_MS && ageMs >= -MAX_PROJECTION_SKEW_MS;
}

// One store read, classified. Kinds: "found" (parsed JSON body),
// "missing" (404), "error" (anything else; reason is logged).
async function fetchProjection(base, hex, reasonPrefix, log) {
  let upstream;
  try {
    upstream = await fetch(`${base}/records/${hex}.json`, {
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    log(`${reasonPrefix}-fetch-failed`);
    return { kind: "error" };
  }
  if (upstream.status === 404) return { kind: "missing" };
  if (upstream.status !== 200) {
    log(`${reasonPrefix}-http-${upstream.status}`);
    return { kind: "error" };
  }
  let text;
  try {
    const buf = await upstream.arrayBuffer();
    if (buf.byteLength > MAX_BODY_BYTES) {
      log(`${reasonPrefix}-body-too-large`);
      return { kind: "error" };
    }
    text = new TextDecoder().decode(buf);
  } catch {
    log(`${reasonPrefix}-body-read-failed`);
    return { kind: "error" };
  }
  try {
    return { kind: "found", projection: JSON.parse(text) };
  } catch {
    log(`${reasonPrefix}-bad-json`);
    return { kind: "error" };
  }
}

module.exports = async (req, res) => {
  const send = (code, obj) => {
    res.statusCode = code;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify(obj));
  };
  const log = (reason) => console.error(`approval-confirm: ${reason}`);
  const now = new Date().toISOString();
  if (req.method !== "GET") return send(405, { status: "method-not-allowed", checked_at: now });
  const q = new URL(req.url, "https://operatorverified.org").searchParams;
  const proofHash = q.get("proof_hash") ?? "";
  if (!HASH_REF.test(proofHash)) return send(400, { status: "bad-proof-hash", checked_at: now });

  const configured = (process.env.VISTO_PROJECTION_BASE || "").trim();
  if (configured === "off") return send(200, { status: "not-rechecked", checked_at: now });
  const base = (configured || DEFAULT_PROJECTION_BASE).replace(/\/$/, "");
  const hex = proofHash.slice("sha256:".length);

  const main = await fetchProjection(base, hex, "store", log);
  if (main.kind === "error") return send(502, { status: "unreachable", checked_at: now });
  if (main.kind === "missing") {
    if (hex === CANARY_HEX) {
      log("canary-missing");
      return send(502, { status: "unreachable", checked_at: now });
    }
    const canary = await fetchProjection(base, CANARY_HEX, "canary", log);
    const canaryOk = canary.kind === "found"
      && projectionConfirms(canary.projection, `sha256:${CANARY_HEX}`)
      && projectionFresh(canary.projection.as_of, now);
    if (!canaryOk) {
      log("store-identity-unconfirmed");
      return send(502, { status: "unreachable", checked_at: now });
    }
    return send(200, { status: "unknown", checked_at: now });
  }

  const projection = main.projection;
  if (!projectionConfirms(projection, proofHash)) {
    log("projection-unverifiable");
    return send(502, { status: "unreachable", checked_at: now });
  }
  const { confirmation, as_of } = projection;
  if (!projectionFresh(as_of, now)) {
    log("projection-stale");
    return send(502, { status: "unreachable", checked_at: now });
  }
  if (confirmation.status === "valid") {
    return send(200, {
      status: "valid",
      consumed: confirmation.consumed,
      record_hash: proofHash,
      expires_at: confirmation.expires_at,
      checked_at: as_of,
    });
  }
  return send(200, { status: "revoked", checked_at: as_of });
};
