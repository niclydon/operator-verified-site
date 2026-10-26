// GET /api/auth/me — session status for the account page.
// Returns status only: whether sign-in is enabled, whether a valid
// session exists, and the verified-status claims the page presents.
// The pairwise subject (sub) is never returned to the browser.
const { SESSION_COOKIE, config, verifyValue, parseCookies } = require("../_lib/worldid");

module.exports = async (req, res) => {
  const cfg = config();
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  if (!cfg.enabled) {
    res.statusCode = 200;
    res.end(JSON.stringify({ enabled: false, signed_in: false }));
    return;
  }
  const cookies = parseCookies(req);
  const session = verifyValue(cookies[SESSION_COOKIE], cfg.sessionSecret);
  if (!session || session.v !== 1) {
    res.statusCode = 200;
    res.end(JSON.stringify({ enabled: true, signed_in: false }));
    return;
  }
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      enabled: true,
      signed_in: true,
      acr: session.acr,
      amr: session.amr,
      auth_time: session.auth_time,
      session_iat: session.iat,
    })
  );
};
