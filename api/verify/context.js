// POST /api/verify/context — a fresh signed RP context for one check.
// The browser builds its IDKit request from this; the context is
// signed server side because it carries the RP's signature.
const { config, signContext, sendJson } = require("../_lib/idkit");

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
  try {
    const rp_context = await signContext(cfg);
    sendJson(res, 200, { app_id: cfg.appId, action: cfg.action, rp_context });
  } catch {
    sendJson(res, 500, { error: "signing_failed" });
  }
};
