// seal/badge.js: the live seal badge for owned surfaces.
//
// Embedded as a placeholder div plus this module script (and the
// import map the seal library needs). Unlike the /api/seal-badge
// picture, which is drawn from the seal record and can never see
// the page, this badge runs the check itself, in the reader's
// browser, at read time: it fetches the current seal record, fetches
// the page's own text from its canonical address, recomputes the
// fingerprint, and verifies the signature, using the same library
// the verify page ships. It renders the two checks that are pure
// local computation (content and signature) and says so on its
// face; the full six-check report stays one tap away on /seal/.
//
// Honesty rules, inherited from the verify page: a check that
// cannot run renders CHECK INCOMPLETE, never a guessed verdict,
// and every render names the time it was checked.
import { verifySeal } from "/seal/lib/verify.js";

const INDEX_URL = "/_seals/index.json";

const CSS = `
.seal-live-badge { display:inline-block; text-align:left; }
.slb { display:inline-flex; align-items:center; gap:16px; max-width:92vw;
  background:#101214; border:1px solid rgba(122,162,190,.55);
  clip-path:polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
  padding:11px 20px; text-decoration:none; font-family:Verdana, Geneva, sans-serif; }
.slb-mark { font-size:20px; line-height:1; color:#C9933A; }
.slb-mark.bad { color:#C05B3C; }
.slb-label { font-size:11px; letter-spacing:2.5px; color:#8ABAD3; white-space:nowrap; }
.slb-status { font-size:14px; font-weight:bold; color:#F2F3F5; white-space:nowrap; }
.slb-sub { font-size:11px; color:#9AA3AB; white-space:nowrap; }
@media (max-width:640px){ .slb{ gap:10px; padding:10px 14px; } .slb-sub{ display:none; } }
`;

function shortHash(h) {
  const hex = String(h || "").replace(/^sha256:/, "");
  return hex.length > 12 ? hex.slice(0, 8) + "\u2026" + hex.slice(-4) : hex;
}
function hhmm(d) {
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}
function render(el, view) {
  el.innerHTML =
    '<a class="slb" href="/seal/?id=' + encodeURIComponent(el.getAttribute("data-seal-id")) + '"' +
    ' role="img" aria-label="Operator Verified seal status: ' + view.status + '">' +
    '<span class="slb-mark' + (view.bad ? " bad" : "") + '">' + view.mark + "</span>" +
    '<span class="slb-label">OPERATOR VERIFIED</span>' +
    '<span class="slb-status">' + view.status + "</span>" +
    '<span class="slb-sub">' + view.sub + "</span></a>";
}

async function run(el) {
  render(el, { mark: "\u2026", status: "CHECKING", sub: "verifying this page in your browser" });
  try {
    const idx = await (await fetch(INDEX_URL, { cache: "no-cache" })).json();
    const entry = idx && idx.seals && idx.seals[el.getAttribute("data-seal-id")];
    if (!entry) {
      return render(el, { mark: "\u2014", bad: true, status: "NO SEAL FOUND", sub: "nothing signed for this content" });
    }
    const seal = await (await fetch("/" + entry.seal_file, { cache: "no-cache" })).json();
    const content = await (await fetch(seal.content.canonical_url, { cache: "no-cache" })).text();
    const r = await verifySeal(seal, { content });
    const when = "checked " + hhmm(new Date());
    if (r.checks.content.status !== "pass") {
      return render(el, { mark: "\u2715", bad: true, status: "CONTENT CHANGED", sub: "does not match seal " + shortHash(seal.content_hash) + " \u00B7 " + when });
    }
    if (r.checks.signature.status !== "pass") {
      return render(el, { mark: "\u2715", bad: true, status: "SIGNATURE INVALID", sub: "seal " + shortHash(seal.content_hash) + " \u00B7 " + when });
    }
    return render(el, { mark: "\u2713", status: "VERIFIED \u00B7 " + shortHash(seal.content_hash), sub: "content + signature \u00B7 " + when + " \u00B7 full report" });
  } catch (err) {
    render(el, { mark: "\u2026", status: "CHECK INCOMPLETE", sub: "the check could not run just now" });
  }
}

if (!document.getElementById("slb-style")) {
  const s = document.createElement("style");
  s.id = "slb-style";
  s.textContent = CSS;
  document.head.appendChild(s);
}
document.querySelectorAll(".seal-live-badge").forEach((el) => { run(el); });
