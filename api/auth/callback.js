// GET /api/auth/callback — the registered redirect URI.
// Validates state and the iss parameter before redeeming the code,
// exchanges the code with client_secret_basic, validates the ID token,
// and sets this site's own session cookie. Only the claims the account
// page presents are kept (sub, acr, amr, auth_time); tokens are never
// stored. Every failure lands on /account/ with a plain error code.
const {
  ISSUER,
  TOKEN_URL,
  REDIRECT_URI,
  SESSION_COOKIE,
  FLOW_COOKIE,
  SESSION_TTL_SECONDS,
  config,
  signValue,
  verifyValue,
  parseCookies,
  cookieHeader,
  clearCookieHeader,
  validateIdToken,
} = require("../_lib/worldid");

function fail(res, code) {
  res.statusCode = 302;
  res.setHeader("Set-Cookie", clearCookieHeader(FLOW_COOKIE));
  res.setHeader("Location", "/account/?error=" + code);
  res.end();
}

module.exports = async (req, res) => {
  const cfg = config();
  if (!cfg.enabled) {
    res.statusCode = 302;
    res.setHeader("Location", "/account/?error=not_enabled");
    res.end();
    return;
  }
  const url = new URL(req.url, "https://operatorverified.org");
  const q = url.searchParams;

  if (q.get("error")) {
    fail(res, q.get("error") === "access_denied" ? "denied" : "idp_error");
    return;
  }
  // The issuer includes iss on success and error responses; require an
  // exact match before redeeming anything (per the OIDC guide).
  if (q.get("iss") !== ISSUER) {
    fail(res, "state");
    return;
  }
  const cookies = parseCookies(req);
  const flow = verifyValue(cookies[FLOW_COOKIE], cfg.sessionSecret);
  if (!flow || !q.get("state") || q.get("state") !== flow.state) {
    fail(res, "state");
    return;
  }
  const code = q.get("code");
  if (!code) {
    fail(res, "idp_error");
    return;
  }

  // Code exchange. Codes are single-use and expire after five minutes.
  let tokenResponse;
  try {
    const basic = Buffer.from(
      encodeURIComponent(cfg.clientId) + ":" + encodeURIComponent(cfg.clientSecret),
      "utf8"
    ).toString("base64");
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: flow.verifier,
    });
    const r = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + basic,
      },
      body: body.toString(),
    });
    if (!r.ok) throw new Error("token endpoint " + r.status);
    tokenResponse = await r.json();
  } catch (e) {
    fail(res, "exchange");
    return;
  }

  let claims;
  try {
    claims = await validateIdToken(tokenResponse.id_token, cfg, flow.nonce);
  } catch (e) {
    fail(res, "validation");
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  const session = signValue(
    {
      v: 1,
      sub: claims.sub,
      acr: claims.acr || "",
      amr: claims.amr || [],
      auth_time: claims.auth_time || null,
      iat: now,
      exp: now + SESSION_TTL_SECONDS,
    },
    cfg.sessionSecret
  );
  res.statusCode = 302;
  res.setHeader("Set-Cookie", [
    clearCookieHeader(FLOW_COOKIE),
    cookieHeader(SESSION_COOKIE, session, SESSION_TTL_SECONDS),
  ]);
  res.setHeader("Location", "/account/");
  res.end();
};
