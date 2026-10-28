// GET /api/seal-badge — a dynamic provenance-seal badge.
//
// The badge is generated at request time from the seal records
// this site publicly serves under /_seals/: the request names a
// piece of content (a content_id from the seals index, or the
// dev.to shortcut below), the handler looks up that content's
// CURRENT seal, and draws the badge from the record's facts.
// Nothing is generated per signature ahead of time; when a seal
// is superseded, the same badge address starts showing the new
// seal's facts on the next fetch.
//
//   /api/seal-badge?id=dev.to/articles/4930794
//   /api/seal-badge?surface=dev.to&article=4930794
//   /api/seal-badge?id=devlog/2026-10-26-founding/index.html
//   &theme=light   (default dark, the Nova Glass house style)
//
// Read-only by design: this endpoint never creates, signs, or
// modifies a seal. Unknown content gets an honest "no seal"
// badge with a 404 status, never a broken image.

const ORIGIN = "https://operatorverified.org";

const fs = require("node:fs");
const path = require("node:path");
// The serverless runtime ships no fonts the rasteriser can use, and
// an SVG badge rendered there loses every glyph. Bundle DejaVu Sans
// (freely licensed) beside the handler and hand it to the rasteriser
// explicitly. Present since the PNG fix; see the badge commit.
const FONT_FILES = ["DejaVuSans.ttf", "DejaVuSans-Bold.ttf"].map((f) =>
  path.join(__dirname, "_fonts", f),
);

let cache = { at: 0, index: null, records: new Map() };
const CACHE_MS = 60_000;

async function fetchJson(path) {
  const res = await fetch(ORIGIN + path, { headers: { accept: "application/json" } });
  if (!res.ok) return null;
  return res.json();
}

async function loadIndex() {
  const now = Date.now();
  if (cache.index && now - cache.at < CACHE_MS) return cache.index;
  const index = await fetchJson("/_seals/index.json");
  cache = { at: now, index, records: new Map() };
  return index;
}

async function loadRecord(sealFile) {
  if (cache.records.has(sealFile)) return cache.records.get(sealFile);
  const record = await fetchJson("/" + sealFile.replace(/^\/+/, ""));
  cache.records.set(sealFile, record);
  return record;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shortHash(hash) {
  const hex = String(hash ?? "").replace(/^sha256:/, "");
  return hex.length > 12 ? `${hex.slice(0, 8)}…${hex.slice(-4)}` : hex;
}

function anchorDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

const THEMES = {
  dark: { bg: "#1C1C1E", border: "#4A7FA5", label: "#8ABAD3", main: "#F2F5F7", sub: "#9AA7B0", hash: "#C9D4DC", mark: "#C9933A" },
  light: { bg: "#F4F6F7", border: "#4A7FA5", label: "#33617F", main: "#1C1C1E", sub: "#5A6B75", hash: "#33505F", mark: "#A8742A" },
};

function badgeSvg({ theme, title, line1, line2, line2strip, layout }) {
  const t = THEMES[theme] ?? THEMES.dark;
  if (layout === "strip") {
    // Wide single-line strip for article footers: hosts like dev.to
    // stretch article images to the text column, so a footer mark
    // earns its place by aspect ratio, wide and short.
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="88" viewBox="0 0 1240 88" role="img" aria-label="${esc(title)}">
  <defs>
    <clipPath id="cut"><polygon points="12,0 1228,0 1240,12 1240,76 1228,88 12,88 0,76 0,12"/></clipPath>
  </defs>
  <g clip-path="url(#cut)">
    <rect width="1240" height="88" fill="${t.bg}"/>
    <rect width="1240" height="88" fill="none" stroke="${t.border}" stroke-width="3"/>
    <path d="M30 26 L42 38 L60 18" fill="none" stroke="${t.mark}" stroke-width="6" stroke-linecap="square" transform="translate(0,8)"/>
    <text x="82" y="54" font-family="Verdana, Geneva, sans-serif" font-size="21" letter-spacing="3" fill="${t.label}">OPERATOR VERIFIED</text>
    <text x="468" y="55" font-family="Verdana, Geneva, sans-serif" font-size="25" font-weight="bold" fill="${t.main}">${esc(line1)}</text>
    <text x="892" y="54" font-family="Verdana, Geneva, sans-serif" font-size="20" fill="${t.sub}">${esc(line2strip ?? line2)}</text>
  </g>
</svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="96" viewBox="0 0 560 96" role="img" aria-label="${esc(title)}">
  <defs>
    <clipPath id="cut"><polygon points="14,0 546,0 560,14 560,82 546,96 14,96 0,82 0,14"/></clipPath>
  </defs>
  <g clip-path="url(#cut)">
    <rect width="560" height="96" fill="${t.bg}"/>
    <rect width="560" height="96" fill="none" stroke="${t.border}" stroke-width="3"/>
    <path d="M28 30 L40 42 L58 22" fill="none" stroke="${t.mark}" stroke-width="6" stroke-linecap="square"/>
    <text x="76" y="30" font-family="Verdana, Geneva, sans-serif" font-size="11" letter-spacing="3" fill="${t.label}">OPERATOR VERIFIED</text>
    <text x="76" y="58" font-family="Verdana, Geneva, sans-serif" font-size="19" font-weight="bold" fill="${t.main}">${esc(line1)}</text>
    <text x="76" y="80" font-family="Verdana, Geneva, sans-serif" font-size="12" fill="${t.sub}">${esc(line2)}</text>
  </g>
</svg>`;
}

module.exports = async (req, res) => {
  const url = new URL(req.url, ORIGIN);
  const q = url.searchParams;
  const theme = q.get("theme") === "light" ? "light" : "dark";
  let contentId = q.get("id");
  if (!contentId && q.get("article")) {
    const surface = q.get("surface") ?? "dev.to";
    contentId = `${surface}/articles/${q.get("article")}`;
  }

  const send = async (status, svg) => {
    res.setHeader("Cache-Control", "public, max-age=120, s-maxage=300, stale-while-revalidate=86400");
    // Default to PNG: image proxies (dev.to's in particular) cannot
    // rasterise SVG reliably, and a badge that renders as a broken
    // image is worse than no badge. ?format=svg returns the vector
    // for surfaces that embed it directly.
    if (q.get("format") !== "svg") {
      try {
        const { Resvg } = await import("@resvg/resvg-js");
        const png = new Resvg(svg, {
          fitTo: { mode: "width", value: 1120 },
          font: {
            fontFiles: FONT_FILES.filter((f) => fs.existsSync(f)),
            loadSystemFonts: false,
            defaultFontFamily: "DejaVu Sans",
            sansSerifFamily: "DejaVu Sans",
          },
        }).render().asPng();
        res.statusCode = status;
        res.setHeader("Content-Type", "image/png");
        res.end(png);
        return;
      } catch {
        // Rasteriser unavailable: fall through to the vector rather
        // than failing the badge outright.
      }
    }
    res.statusCode = status;
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.end(svg);
  };

  if (!contentId) {
    await send(400, badgeSvg({ theme, title: "No content named", line1: "NO SEAL", line2: "Name a sealed item to draw its badge" }));
    return;
  }
  const index = await loadIndex();
  const entry = index?.seals?.[contentId];
  if (!entry) {
    await send(404, badgeSvg({ theme, title: "No seal found for this content", line1: "NO SEAL FOUND", line2: "This content carries no provenance seal" }));
    return;
  }
  const record = await loadRecord(entry.seal_file);
  if (!record) {
    await send(502, badgeSvg({ theme, title: "Seal record unavailable", line1: "SEAL UNREADABLE", line2: "The seal record could not be read just now" }));
    return;
  }
  const anchor = record.timestamps?.anchor ?? null;
  const when = anchorDate(anchor?.block_timestamp ?? record.timestamps?.sealed_at);
  const line1 = `SEALED  ·  ${shortHash(record.content_hash)}`;
  const line2 = anchor
    ? `Anchored on World Chain${when ? ` · ${when}` : ""}`
    : "Sealed · anchor pending";
  const line2strip = anchor
    ? `World Chain${when ? ` · ${when}` : ""}`
    : line2;
  await send(200, badgeSvg({ theme, title: `Provenance seal: ${line1}. ${line2}`, line1, line2, line2strip, layout: q.get("layout") === "strip" ? "strip" : "pill" }));
};
