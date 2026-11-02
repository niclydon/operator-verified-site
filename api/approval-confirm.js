// GET /api/approval-confirm - re-confirm a seal's human-approval
// record against the Visto approval service (W2), for the public
// verify page. The seal stores only the approval record's hash
// (proof_hash); this endpoint asks the approval service whether
// that record still stands, through its unprivileged
// re-confirmation route (W2 SPEC 8.5), and reports the status.
//
//   /api/approval-confirm?proof_hash=sha256:...
//
// Responses (JSON, never cached: a confirmation is a statement
// about now):
//   { status: "valid", consumed, record_hash, checked_at }
//   { status: "revoked" | "unknown", checked_at }
//   { status: "not-rechecked", checked_at } when no approval
//     service is configured on this deployment: the verify page
//     then shows the approval as claimed but not re-checked,
//     which is the W3 SPEC 5.2 degraded state, never a pass.
//   502 { status: "unreachable", checked_at } when the approval
//     service is configured but cannot be reached.
//
// Configuration: VISTO_RECONFIRM_BASE is the approval service's
// base URL as reachable from this deployment. The service is
// tailnet-only today, so the variable stays unset in production
// until W2 exposes the re-confirmation route publicly; setting it
// lights this endpoint up with no code change.
//
// Read-only: this endpoint creates, modifies, and reserves
// nothing; re-confirmation is a status read by design.

const HASH_REF = /^sha256:[a-f0-9]{64}$/;

module.exports = async (req, res) => {
  const send = (code, obj) => {
    res.statusCode = code;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify(obj));
  };
  const checked_at = new Date().toISOString();
  if (req.method !== "GET") return send(405, { status: "method-not-allowed", checked_at });
  const q = new URL(req.url, "https://operatorverified.org").searchParams;
  const proofHash = q.get("proof_hash") ?? "";
  if (!HASH_REF.test(proofHash)) return send(400, { status: "bad-proof-hash", checked_at });

  const base = (process.env.VISTO_RECONFIRM_BASE ?? "").replace(/\/$/, "");
  if (!base) return send(200, { status: "not-rechecked", checked_at });

  try {
    const upstream = await fetch(`${base}/v1/records/${proofHash}/reconfirm`, {
      signal: AbortSignal.timeout(8000),
    });
    if (upstream.status !== 200) return send(502, { status: "unreachable", checked_at });
    const body = await upstream.json();
    if (body?.status === "valid") {
      return send(200, { status: "valid", consumed: body.consumed ?? null, record_hash: proofHash, checked_at });
    }
    if (body?.status === "revoked" || body?.status === "unknown") {
      return send(200, { status: body.status, checked_at });
    }
    return send(502, { status: "unreachable", checked_at });
  } catch {
    return send(502, { status: "unreachable", checked_at });
  }
};
