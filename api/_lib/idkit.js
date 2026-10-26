// Shared helpers for the site's IDKit verify path (NOT the OIDC
// sign-in in worldid.js; a different mechanism on a different portal).
//
// The visitor runs a one-off World ID proof-of-human check in the
// browser (IDKit), this library signs the relying-party context with
// the site RP's signing key and forwards completed proof results to
// World's verify endpoint. The signing key comes from the environment
// (WORLD_SITE_SIGNING_KEY) and never leaves the server. Nothing is
// stored: no session, no account, and the raw nullifier is never
// returned to the browser (only a truncated hash of it, as a receipt).
const crypto = require("crypto");

const APP_ID = "app_e53f4895f78c10c5e7e36f4cdd35f6f6";
const RP_ID = "rp_001153d67279a097";
const ACTION = "operator-verified-check";
const VERIFY_URL = `https://developer.world.org/api/v4/verify/${RP_ID}`;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const CONTEXT_TTL_SECONDS = 300;

function config() {
  const signingKey = process.env.WORLD_SITE_SIGNING_KEY || "";
  return {
    appId: APP_ID,
    rpId: RP_ID,
    action: ACTION,
    signingKey,
    // Dark gate: the whole verify path stays inert until the signing
    // key is placed in the environment.
    enabled: typeof signingKey === "string" && signingKey.length >= 64,
  };
}

async function signContext(cfg) {
  const { signRequest } = await import("@worldcoin/idkit-core/signing");
  const sig = signRequest({
    signingKeyHex: cfg.signingKey,
    action: cfg.action,
    ttl: CONTEXT_TTL_SECONDS,
  });
  return {
    rp_id: cfg.rpId,
    nonce: sig.nonce,
    created_at: sig.createdAt,
    expires_at: sig.expiresAt,
    signature: sig.sig,
  };
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return {};
  return JSON.parse(text);
}

async function verifyWithWorld(result) {
  const resp = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": UA },
    body: JSON.stringify(result),
  });
  const body = await resp.json().catch(() => ({}));
  return { ok: resp.ok && body.success !== false, status: resp.status, body };
}

function firstNullifier(result) {
  if (Array.isArray(result.responses)) {
    for (const r of result.responses) {
      if (typeof r.nullifier === "string" && r.nullifier) return r.nullifier;
      if (Array.isArray(r.session_nullifier) && r.session_nullifier[0]) return String(r.session_nullifier[0]);
      if (typeof r.session_nullifier === "string" && r.session_nullifier) return r.session_nullifier;
    }
  }
  if (typeof result.nullifier === "string" && result.nullifier) return result.nullifier;
  return null;
}

function receiptFor(result) {
  const n = firstNullifier(result);
  if (!n) return null;
  return crypto.createHash("sha256").update(n).digest("hex").slice(0, 16);
}

function identifiersOf(result) {
  if (!Array.isArray(result.responses)) return [];
  const seen = [];
  for (const r of result.responses) {
    if (r.identifier && !seen.includes(r.identifier)) seen.push(r.identifier);
  }
  return seen;
}

function sendJson(res, statusCode, obj) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

module.exports = {
  config,
  signContext,
  readJsonBody,
  verifyWithWorld,
  receiptFor,
  identifiersOf,
  sendJson,
};
