const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const {
  isProofOfHumanResult,
  isVerifiedProofOfHuman,
} = require("../api/_lib/idkit");
const check = require("../api/verify/check");

const ACTION = "operator-verified-check";
const NULLIFIER = "0x" + "a".repeat(64);
const DECIMAL_NULLIFIER = BigInt(NULLIFIER).toString(10);
const proof = {
  protocol_version: "4.0",
  nonce: "0xabc123",
  action: ACTION,
  environment: "production",
  responses: [{
    identifier: "proof_of_human",
    issuer_schema_id: 1,
    nullifier: NULLIFIER,
    expires_at_min: 49012345,
    proof: ["0x1", "0x2", "0x3", "0x4", "0x5"],
  }],
};
const decimalProof = {
  ...proof,
  responses: [{ ...proof.responses[0], nullifier: DECIMAL_NULLIFIER }],
};
const success = {
  success: true,
  action: ACTION,
  environment: "production",
  results: [{ identifier: "proof_of_human", success: true, nullifier: NULLIFIER }],
};

function response() {
  return {
    statusCode: 0,
    headers: {},
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    end(body) { this.body = JSON.parse(body); },
  };
}

test("only a single action-bound proof-of-human credential is eligible", () => {
  assert.equal(isProofOfHumanResult(proof, ACTION), true);
  assert.equal(isProofOfHumanResult(decimalProof, ACTION), true);
  const legacy = {
    ...proof,
    protocol_version: "3.0",
    responses: [{ ...proof.responses[0], identifier: "orb" }],
  };
  assert.equal(isProofOfHumanResult(legacy, ACTION), true);
  const refused = [
    { ...proof, action: undefined },
    { ...proof, action: "other-action" },
    { ...proof, session_id: "session_fake" },
    { ...proof, environment: "staging" },
    { ...proof, responses: [...proof.responses, proof.responses[0]] },
    { ...proof, responses: [{ ...proof.responses[0], identifier: "selfie", issuer_schema_id: 11 }] },
    { ...proof, responses: [{ ...proof.responses[0], issuer_schema_id: 9303 }] },
    { ...proof, responses: [{ ...proof.responses[0], nullifier: "not-a-field" }] },
  ];
  for (const candidate of refused) {
    assert.equal(isProofOfHumanResult(candidate, ACTION), false);
  }
});

test("World must confirm the submitted credential and nullifier", () => {
  assert.equal(isVerifiedProofOfHuman({ ok: true, body: success }, proof, ACTION), true);
  assert.equal(isVerifiedProofOfHuman({ ok: true, body: success }, decimalProof, ACTION), true);
  assert.equal(isVerifiedProofOfHuman({ ok: true, body: { ...success, nullifier: NULLIFIER } }, decimalProof, ACTION), true);
  const refused = [
    {},
    { success: true },
    { ...success, results: [{ ...success.results[0], success: false }] },
    { ...success, results: [success.results[0], success.results[0]] },
    { ...success, action: "other-action" },
    { ...success, environment: "staging" },
    { ...success, results: [{ ...success.results[0], identifier: "selfie" }] },
    { ...success, results: [{ ...success.results[0], nullifier: "0xother" }] },
    { ...success, nullifier: "0xother" },
  ];
  for (const body of refused) {
    assert.equal(isVerifiedProofOfHuman({ ok: true, body }, proof, ACTION), false);
  }
  assert.equal(isVerifiedProofOfHuman({ ok: true, body: {
    ...success,
    results: [{ ...success.results[0], nullifier: "0xb" }],
  } }, decimalProof, ACTION), false);
});

test("check endpoint forwards the complete proof but returns only a verified receipt", async () => {
  const oldFetch = global.fetch;
  const oldKey = process.env.WORLD_SITE_SIGNING_KEY;
  process.env.WORLD_SITE_SIGNING_KEY = "a".repeat(64);
  let forwarded;
  global.fetch = async (_url, options) => {
    forwarded = JSON.parse(options.body);
    return { ok: true, status: 200, json: async () => success };
  };
  try {
    const res = response();
    await check({ method: "POST", body: { result: decimalProof } }, res);
    assert.deepEqual(forwarded, decimalProof);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.verified, true);
    assert.equal(res.body.receipt, crypto.createHash("sha256").update(DECIMAL_NULLIFIER).digest("hex").slice(0, 16));
    assert.equal(JSON.stringify(res.body).includes(NULLIFIER), false);

    global.fetch = async () => ({ ok: true, status: 200, json: async () => ({}) });
    const incomplete = response();
    await check({ method: "POST", body: { result: decimalProof } }, incomplete);
    assert.deepEqual(incomplete.body, { verified: false, error: "portal_rejected" });

    let called = false;
    global.fetch = async () => { called = true; throw new Error("should not call World"); };
    const wrongCredential = response();
    const selfie = { ...proof, responses: [{ ...proof.responses[0], identifier: "selfie", issuer_schema_id: 11 }] };
    await check({ method: "POST", body: { result: selfie } }, wrongCredential);
    assert.deepEqual(wrongCredential.body, { verified: false, error: "proof_type_mismatch" });
    assert.equal(called, false);
  } finally {
    global.fetch = oldFetch;
    if (oldKey === undefined) delete process.env.WORLD_SITE_SIGNING_KEY;
    else process.env.WORLD_SITE_SIGNING_KEY = oldKey;
  }
});
