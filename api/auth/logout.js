// GET /api/auth/logout — clears this site's session cookie.
// This ends the session on this site only; it does not sign the
// visitor out of World ID itself.
const { SESSION_COOKIE, clearCookieHeader } = require("../_lib/worldid");

module.exports = async (req, res) => {
  res.statusCode = 302;
  res.setHeader("Set-Cookie", clearCookieHeader(SESSION_COOKIE));
  res.setHeader("Location", "/account/");
  res.end();
};
