// Shared helpers for the Operator Verified site's Sign in with World ID
// integration (N1 track). Dependency-free: Node crypto + fetch only.
//
// Endpoints and capabilities are taken from the issuer's discovery
// document, https://auth.world.org/.well-known/openid-configuration,
// read on 2026-10-26: authorization_endpoint, token_endpoint and
// jwks_uri below; response type "code" only; PKCE S256 required;
// token endpoint auth client_secret_basic (the registered method).

const crypto = require("crypto");

const ISSUER = "https://auth.world.org";
const AUTHORIZE_URL = "https://auth.world.org/api/v1/authorize";
const TOKEN_URL = "https://auth.world.org/api/v1/token";
const JWKS_URL = "https://auth.world.org/.well-known/jwks.json";
// The registered redirect URI. Exact-match at the issuer; never build
// this from request headers.
const REDIRECT_URI = "https://operatorverified.org/api/auth/callback";

const SESSION_COOKIE = "ov_session";
const FLOW_COOKIE = "ov_flow";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const FLOW_TTL_SECONDS = 10 * 60;

function config() {
  const clientId = process.env.WORLD_ID_CLIENT_ID || "";
  const clientSecret = process.env.WORLD_ID_CLIENT_SECRET || "";
  const sessionSecret = process.env.SESSION_SECRET || "";
  return {
    clientId,
    clientSecret,
    sessionSecret,
    enabled: Boolean(clientId && clientSecret && sessionSecret.length >= 32),
  };
}

function b64urlEncode(buf) {
  return Buffer.from(buf).toString("base64url");
}

function b64urlDecode(str) {
  return Buffer.from(str, "base64url");
}

function randomToken(bytes) {
  return b64urlEncode(crypto.randomBytes(bytes));
}

// Signed opaque value: base64url(JSON) + "." + base64url(HMAC-SHA256).
function signValue(payload, secret) {
  const body = b64urlEncode(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", secret).update(body).digest();
  return body + "." + b64urlEncode(sig);
}

function verifyValue(value, secret) {
  if (!value || typeof value !== "string") return null;
  const dot = value.lastIndexOf(".");
  if (dot < 1) return null;
  const body = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = crypto.createHmac("sha256", secret).update(body).digest();
  let actual;
  try {
    actual = b64urlDecode(sig);
  } catch (e) {
    return null;
  }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    return null;
  }
  try {
    const payload = JSON.parse(b64urlDecode(body).toString("utf8"));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

function parseCookies(req) {
  const header = (req.headers && req.headers.cookie) || "";
  const out = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx > 0) out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

function cookieHeader(name, value, maxAgeSeconds) {
  const attrs = [
    name + "=" + encodeURIComponent(value),
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=" + maxAgeSeconds,
  ];
  return attrs.join("; ");
}

function clearCookieHeader(name) {
  return name + "=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0";
}

// PKCE (S256, required by the issuer's OIDC guide).
function pkcePair() {
  const verifier = randomToken(48); // 64 chars, within the 43-128 range
  const challenge = b64urlEncode(crypto.createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

// JWKS fetch with a short in-memory cache (per warm function instance).
let jwksCache = { keys: null, fetchedAt: 0 };
async function getJwks() {
  const now = Date.now();
  if (jwksCache.keys && now - jwksCache.fetchedAt < 10 * 60 * 1000) return jwksCache.keys;
  const res = await fetch(JWKS_URL, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("jwks fetch failed: " + res.status);
  const doc = await res.json();
  jwksCache = { keys: doc.keys || [], fetchedAt: now };
  return jwksCache.keys;
}

// Full ID token validation per the issuer's id-token guide: RS256
// signature against the JWKS, exact issuer, audience = this client,
// expiry, and the nonce sent with the authorization request.
async function validateIdToken(idToken, cfg, expectedNonce) {
  const parts = String(idToken || "").split(".");
  if (parts.length !== 3) throw new Error("malformed id_token");
  const header = JSON.parse(b64urlDecode(parts[0]).toString("utf8"));
  const payload = JSON.parse(b64urlDecode(parts[1]).toString("utf8"));
  if (header.alg !== "RS256") throw new Error("unexpected alg");
  const keys = await getJwks();
  const jwk = keys.find((k) => k.kid === header.kid) || keys[0];
  if (!jwk) throw new Error("no signing key");
  const publicKey = crypto.createPublicKey({ key: jwk, format: "jwk" });
  const signingInput = Buffer.from(parts[0] + "." + parts[1], "utf8");
  const signature = b64urlDecode(parts[2]);
  const ok = crypto.verify("RSA-SHA256", signingInput, publicKey, signature);
  if (!ok) throw new Error("signature invalid");
  const now = Math.floor(Date.now() / 1000);
  if (payload.iss !== ISSUER) throw new Error("issuer mismatch");
  if (payload.aud !== cfg.clientId) throw new Error("audience mismatch");
  if (!payload.exp || now > payload.exp + 60) throw new Error("token expired");
  if (payload.iat && payload.iat > now + 300) throw new Error("token issued in future");
  if (expectedNonce && payload.nonce !== expectedNonce) throw new Error("nonce mismatch");
  if (!payload.sub) throw new Error("missing sub");
  return payload;
}

module.exports = {
  ISSUER,
  AUTHORIZE_URL,
  TOKEN_URL,
  REDIRECT_URI,
  SESSION_COOKIE,
  FLOW_COOKIE,
  SESSION_TTL_SECONDS,
  FLOW_TTL_SECONDS,
  config,
  randomToken,
  signValue,
  verifyValue,
  parseCookies,
  cookieHeader,
  clearCookieHeader,
  pkcePair,
  validateIdToken,
};
