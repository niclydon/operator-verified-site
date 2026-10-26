// GET /api/verify/status — whether the live World ID check is enabled.
// The verify page probes this and only offers the check when enabled.
const { config, sendJson } = require("../_lib/idkit");

module.exports = async (req, res) => {
  const cfg = config();
  sendJson(res, 200, { enabled: cfg.enabled });
};
