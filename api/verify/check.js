// POST /api/verify/check — verify one completed IDKit result with
// World and return the verdict. Body: { result } where result is the
// complete IDKit result object from the browser. The result is
// forwarded unchanged to World's verify endpoint; the verdict is
// World's, and the only derived value returned is a truncated hash
// of the proof's nullifier, as the visitor's receipt. Portal error
// detail is never reflected to the browser.
const {
  config,
  readJsonBody,
  verifyWithWorld,
  receiptFor,
  identifiersOf,
  sendJson,
} = require("../_lib/idkit");

module.exports = async (req, res) => {
  const cfg = config();
  if (!cfg.enabled) {
    sendJson(res, 503, { enabled: false });
    return;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { verified: false, error: "bad_json" });
    return;
  }
  const result = body ? body.result : null;
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    sendJson(res, 400, { verified: false, error: "missing_result" });
    return;
  }
  if (result.environment && result.environment !== "production") {
    sendJson(res, 200, { verified: false, error: "environment_mismatch" });
    return;
  }
  if (result.action && result.action !== cfg.action) {
    sendJson(res, 200, { verified: false, error: "action_mismatch" });
    return;
  }
  let outcome;
  try {
    outcome = await verifyWithWorld(result);
  } catch {
    sendJson(res, 200, { verified: false, error: "verify_unreachable" });
    return;
  }
  if (!outcome.ok) {
    sendJson(res, 200, { verified: false, error: "portal_rejected" });
    return;
  }
  sendJson(res, 200, {
    verified: true,
    receipt: receiptFor(result),
    identifiers: identifiersOf(result),
    user_presence_completed: outcome.body?.user_presence_completed === true,
  });
};
