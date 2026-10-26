// GET /api/auth/login — starts the Sign in with World ID flow.
// Dark until configured: without the client credentials and a session
// secret in the environment, this returns 503 and starts nothing.
const {
  AUTHORIZE_URL,
  REDIRECT_URI,
  FLOW_COOKIE,
  FLOW_TTL_SECONDS,
  config,
  randomToken,
  signValue,
  cookieHeader,
  pkcePair,
} = require("../_lib/worldid");

module.exports = async (req, res) => {
  const cfg = config();
  if (!cfg.enabled) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Sign-in with World ID is not enabled on this site yet.");
    return;
  }
  const state = randomToken(24);
  const nonce = randomToken(24);
  const { verifier, challenge } = pkcePair();
  const flow = signValue(
    { state, nonce, verifier, exp: Math.floor(Date.now() / 1000) + FLOW_TTL_SECONDS },
    cfg.sessionSecret
  );
  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid",
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  res.statusCode = 302;
  res.setHeader("Set-Cookie", cookieHeader(FLOW_COOKIE, flow, FLOW_TTL_SECONDS));
  res.setHeader("Location", AUTHORIZE_URL + "?" + params.toString());
  res.end();
};
