// Browser client for the /verify/ page's live World ID check.
// Bundled with esbuild into assets/verify-client.js:
//   npx esbuild client-src/verify-client.js --bundle --platform=browser \
//     --format=iife --minify --outfile=assets/verify-client.js
// Exposes window.OVCheck.start(); the page's inline boot script loads
// this bundle on demand, only after /api/verify/status says the
// check is enabled and the visitor presses the button.
//
// The flow: fetch a signed RP context from the site's backend, build
// an IDKit proof-of-human request, show the connector URI as a QR
// code and a link, poll for completion, then send the complete
// result to the backend, which verifies it with World. Raw results
// live in page memory only; nothing is stored by this page.
import { IDKit, proofOfHuman } from "@worldcoin/idkit-core";
import QRCode from "qrcode";

function el(id) {
  return document.getElementById(id);
}

function setStatus(text) {
  const node = el("ovc-log");
  if (node) node.textContent = text || "";
}

async function api(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `http_${response.status}`);
  return data;
}

function showVerdict(html) {
  const box = el("ovc-verdict");
  if (!box) return;
  box.innerHTML = html;
  box.hidden = false;
}

async function start() {
  const startBtn = el("ovc-start");
  const qrWrap = el("ovc-qr-wrap");
  const verdict = el("ovc-verdict");
  if (verdict) verdict.hidden = true;
  if (startBtn) startBtn.disabled = true;
  let stage = "preparing";
  try {
    setStatus("Preparing the check…");
    const ctx = await api("/api/verify/context");
    const signal = crypto.randomUUID();
    const request = await IDKit.request({
      app_id: ctx.app_id,
      action: ctx.action,
      rp_context: ctx.rp_context,
      allow_legacy_proofs: true,
      action_description: "Verify as a unique human on operatorverified.org",
    }).preset(proofOfHuman({ signal }));

    const qrImg = el("ovc-qr");
    if (qrImg) {
      qrImg.src = await QRCode.toDataURL(request.connectorURI, { width: 264, margin: 1 });
    }
    const openLink = el("ovc-open");
    if (openLink) openLink.href = request.connectorURI;
    if (qrWrap) qrWrap.hidden = false;
    stage = "waiting";
    setStatus("Waiting for World App. Scan the code, or open the link on the device that holds your World App.");

    const completion = await request.pollUntilCompletion({ pollInterval: 2000, timeout: 360000 });
    if (!completion.success) {
      const code = String(completion.error || "");
      if (/reject|cancel|declin/i.test(code)) {
        setStatus("Cancelled in World App. This site received no completed response.");
      } else if (/timeout|timed_out/i.test(code)) {
        setStatus("The check timed out before World App answered. You can run it again.");
      } else {
        setStatus("World App did not complete the check. You can run it again.");
      }
      if (qrWrap) qrWrap.hidden = true;
      return;
    }

    stage = "checking";
    setStatus("Checking the response with World…");
    const verdictData = await api("/api/verify/check", { result: completion.result });
    if (qrWrap) qrWrap.hidden = true;
    if (verdictData.verified) {
      setStatus("");
      showVerdict(
        `<h3>World accepted the response</h3>` +
          `<p>World confirmed a valid World ID credential for one unique human. This result cannot tell who submitted the response or whether that person is here now. No account or access was created.</p>`
      );
    } else if (verdictData.error === "portal_rejected") {
      setStatus("This response did not pass the check.");
    } else {
      setStatus("We could not confirm the result. No result is shown.");
    }
  } catch (err) {
    setStatus(stage === "checking"
      ? "We could not confirm the result. No result is shown."
      : stage === "waiting"
        ? "This page did not receive a completed response from World App. No result is shown."
        : "The check could not start. Please try again.");
    if (qrWrap) qrWrap.hidden = true;
  } finally {
    if (startBtn) startBtn.disabled = false;
  }
}

window.OVCheck = { start };
