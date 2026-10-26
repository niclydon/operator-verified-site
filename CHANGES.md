# CHANGES.md

Chronological record of landed changes to this repository. The
long-form record lives in `docs/narrative/`; entries here point
at it.

## 2026-10-26 — Privacy correction: AgentBook linkage

The current About page and README now state the limit of the earlier
"hash only" privacy language. AgentBook registration events are public
on World Chain; a disclosed wallet or published hash can be linked to
the underlying human identifier and other wallets registered to it.
The fleet page still shows labels only and keeps its roster private.
This correction does not retract Fiador's previously published hash or
the program-wallet fragment preserved in historical snapshots. It
records what the existing on-chain and published evidence can reveal.
The new append-only privacy-correction snapshot freezes the corrected
site copy. This entry records its preparation; production publication
and its live check belong in a separate publication record.

## 2026-10-26 — Production artwork deployed

The site now serves the approved production set: the plate
rendered at 2048×2048 and the lockup at 2600×740 replace the
interim 1000×1000 and 1960×560 renders, and the social-share image
is the production lockup. Hero WebP editions are regenerated from
the new masters (plate 141 KB dark, 99 KB light). Verified before
deploy in a real browser at phone and desktop widths in both
modes: no distortion, mode swap correct, gold reads as metallic
gold in light mode.

## 2026-10-26 — Labels-only fleet page

The new `/fleet/` page shows a dated build-time AgentBook check for the
program wallet, Nova, ARIA, and Cole. The four addresses, fragments,
shared human hash, and transaction pointers stay out of the new page
and facts. The operator confirmed his World App approval of the program
wallet registration. A private Alchemy and Tenderly check returned four
verified results. Readers cannot reproduce the exact lookup without
the private roster; the page says so. The current Fiador page and fact
no longer repeat the program wallet's older public fragment, although
the original launch snapshot remains frozen. The new snapshot records
the page and this correction.

## 2026-10-26 — Correction: Fiador page, what does not exist yet

The section's opening sentence named the verifier bot and the static
verify page as not existing. Both have existed since this morning:
the verification path ran end to end through the verification bot in
a live Discord server, and the verify explainer page is live on this
site. The sentence now names only what is still missing, the
packaged verifier bot running in a public guild and a registry
listing, and records the end-to-end run. Wording approved by the
operator as exact text before publication.

## 2026-10-26 — Sign in with World ID: machinery built, dark

The site side of Sign in with World ID (issuer auth.world.org)
is built and deployed but deliberately dark and unlinked: an
account page at /account/ that no navigation points to, and
serverless auth endpoints (login, callback, logout, session
status) that stay inert until the program's OIDC client
registration exists and its credentials are configured. The
flow is authorization code with PKCE (S256), client_secret_basic,
scope "openid" only — no email, no name, and no raw World
identifier is ever requested or received; the account page
presents the authentication class World ID reports (Orb class
means the operator was verified as a unique human) together
with the authentication time, so an account's verified status
is never dressed up as a fresh presence proof. Nothing about
the visible site changed.

## 2026-10-26 — Fix: image aspect distortion (screenshot pass)

A real-browser screenshot pass at desktop and phone widths
found that every raster image carrying width/height attributes
(the home lockup and plate, the Fiador banner) was rendering
at its full attribute height regardless of display width: the
square plate measured 454x1000 on desktop and 342x1000 at
390px; the Fiador banner 342x1120 at phone width. Cause: the
polish pass added the dimension attributes to prevent layout
shift, but the stylesheet set only max-width, so the height
attribute acted as a fixed height. Fix: `height:auto` on the
image rule; the attributes now supply the aspect ratio, as
intended. SVG marks and badges were unaffected. The pass also
reconciled the builder with the approved founding-post edit
(ff5bd37): the Fiador status paragraph is now in the builder's
post text (the rebuild reproduces the approved page exactly),
and the shared footer's no-JS fallback date matches the
current facts generation date on every page.

## 2026-10-26 — Correction: program wallet registration state

The program wallet's AgentBook registration was executed in
the World App and confirmed live (registered: true) on
October 26, 2026, in the same hours as this site's launch.
The launch build still carried the earlier state, "prepared,
not yet executed," so the site misstated the fact for its
first hours. The fact
now reads "registered (confirmed live)" (verified October 26,
2026), in `facts.json` and in the Fiador page's program-wallet
paragraph. The launch narrative's statement of the earlier
state stands as the record of what was true when it was
written; this entry is the correction, per the rule that
corrections arrive as new entries, never as silent edits.

## 2026-10-26 — Polish pass (post-launch)

A professional-finish pass over the launched site, prompted by
the author's read of it on a phone:

- The mode toggle is a real control now: it reads "☾ Dark" /
  "☀ Light" for the mode a tap selects, capitalized, and stays
  in sync with the active mode.
- Hero art weight: the plate and lockup images ship as WebP
  (the PNGs remain the archival masters; the dark lockup PNG
  still serves as the OG image). The two variants of each hero
  image became one image whose source follows the mode, so a
  visit no longer downloads both. Hero art per visit drops from
  roughly 2.3 MB to roughly 65 KB.
- Every page gained Open Graph and Twitter card meta and a
  theme-color per color scheme; a purpose-built OG card render
  remains the pre-announcement item it always was.
- A designed 404 page in the site's own chrome replaces the
  platform default.
- Small craft items: keyboard focus outlines, a selection
  tint in the brand gold, hover states on the buttons, tighter
  header spacing at tablet widths, calmer type and spacing at
  phone widths, and width/height on the large images so pages
  no longer shift as art loads.
- No copy, claim, or fact changed in this pass; `facts.json`
  is byte-identical to the launch build.

## 2026-10-26 — Mobile header fix (post-launch)

Minutes after launch, the author loaded the site on a phone and
the header showed its desktop assumption: on narrow screens the
navigation wrapped into the brand's row and overlapped the
wordmark. The pre-launch visual pass had checked desktop widths
only. Fix, in `assets/style.css` only: under 700px the header
stacks — brand on its own row, navigation on a full-width row
beneath it. No other file changed; the launch snapshot stays as
frozen, per the append-only rule, and this fix is recorded here
rather than folded into it.

## 2026-10-26 — Launch

The site went live at operatorverified.org on the author's
approval, in one pass:

- Preview banner removed from every page (the builder now emits
  the banner only when one is configured; local builds keep their
  local-preview banner by default).
- Devlog post 1, "Verified, renamed, and founded in the open,"
  published: draft flag cleared, listed as published in the devlog
  index, and moved to its publication-date path
  (`devlog/2026-10-26-founding/`).
- First snapshot cut: `snapshots/2026-10-26-launch/` freezes the
  launched tree with a `snapshot.json` manifest of file hashes;
  the snapshots index lists it with its reason.
- `facts.json`: the canonical-domain fact updated to its launched
  state (pointed at this deployment; verified October 26, 2026);
  facts generation date moved to launch day. No other fact
  changed; the program-wallet registration fact still reads
  "prepared, not yet executed," because it still is.
- Domain: operatorverified.org attached to the Vercel project as
  canonical; operatorverified.com, operator-verified.com, and
  operator-verified.org redirect to it.
- Before the banner came off, the deployed preview passed a
  visual check in both color modes and the launch tree passed
  the same boundary scan as the founding tree (identifiers,
  private paths, internal codenames: zero hits).

## 2026-10-25 — Founding: design record and first build

The Operator Verified site was designed, identity-settled, and
built in one day, and this repository is its founding commit.

- `docs/DESIGN.md`: the full design record (five revisions) —
  site map, facts layer, devlog workflow, the round-3 material
  language, privacy pass, build order, and the decisions log.
- The static site itself: home, projects index, Fiador page,
  /verify/ explainer, resources, devlog (post 1 as an approved-
  pending draft, flagged as such), about, snapshots; `facts.json`
  carrying every number the pages render, each with source and
  verification date.
- Identity as built: round-3 lead plate (gold O, deep steel blue
  V, brushed steel, straight-on) as hero art in both modes;
  round-2 separate-letter cores for favicon and top bar, per the
  small-size audit (the overlay is hero-only).
- Rules carried in copy, verified mechanically before commit:
  claim phrased only as "verified as a unique human"; descriptor
  rule on first use of Fiador and Operator Verified on every
  page; no-token statement in About and as the footer line on
  project pages; no monetization or commercial-intent discussion
  anywhere (commercial narrative rule); no full human identifier
  or full wallet address anywhere (secret scan: zero hits).
- Narrative: `docs/narrative/2026-10-25-founding-and-first-build.md`.

Pending at founding, by design: the author's approval of the
exact launch text and of devlog post 1; attachment of the
production domain operatorverified.org; announcement posts (each
separately approved); watchdog registration at launch.

## 2026-10-25 — Adversarial review of the founding commit, triage

Three independent reviewers (claim accuracy, privacy/boundary,
correctness) were asked to break the founding commit before its
first push. They returned 2 blockers, 9 majors, and 14 minors
and nits. All blockers and majors were fixed; every minor and
nit was fixed except one, declined below with its reason.

Blockers, fixed:
- Hero PNGs carried a Blender text chunk embedding a private
  filesystem path. The builder now strips embedded chunks from
  every PNG it ships, and the scan covers binary metadata.
- The founding narrative asserted an adversarial review had run
  and a clean scan before either was complete. Both records
  were rewritten to state what actually ran, in what order, and
  what it found (see the narrative's gate section).

Majors, fixed:
- Home meta description overclaimed ("proving a verified unique
  human"); rewritten to the hero lede's wording. All other pages
  gained real meta descriptions.
- Fiador was called a "working demo" with no demo in existence;
  now "its demo is in build."
- The /verify/ explainer described three non-existent tools in
  the present tense; re-tensed to design language wherever it described
  not-yet-existing tools as usable today, including the
  Fiador page's checker step and the other-verify
  section.
- README stated deployment as accomplished fact; now "preview
  pending launch approval."
- docs/DESIGN.md, published raw, contained internal chat ids,
  private paths, infrastructure codenames, and the program
  wallet's key-storage location. It now publishes as a redacted
  public edition (internal edition stays private), and
  .vercelignore keeps docs/ out of the deployed web root.
- facts.json credited verification to an internal codename;
  now "the author."
- CSS: the hero's dark plate rendered stacked under the light
  plate in light mode (equal-specificity ordering bug); the
  mode rules are now scoped and ordered correctly.
- Facts wiring garbled the Fiador evidence sentence under JS
  (case-mismatched substitution); fact value aligned to the
  inline fragment.

Minors and nits, fixed: guarantor metaphor tied to the
attestation; hyphenated domains no longer described as already
redirecting; "ships" re-tensed on the home start-here card;
devlog cadence qualified "once launched"; About's
demonstrations re-tensed as a commitment, and its storage
wording corrected (local storage, not cookies); favicon now
ships light and dark variants by media query; README snapshot
tense corrected; CHANGES wording "approval-pending."

Declined (1): stripping the Fiador WebP banner/icon XMP. It
contains only AI-generation provenance disclosure (source type
and publisher), no identifiers; removing it would delete a
disclosure the design elsewhere values. Recorded here as a
conscious keep.

History note (same date): the founding commit was never pushed.
The re-review caught that the corrected files still sat on top of
a draft founding commit whose history contained the unredacted
material, so the repository was re-founded as a single clean
commit before its first push, and the boundary scan was re-run
over the founding commit's full contents. Nothing public ever
carried the leaks; the record of what they were stays here and in
the narrative, because a program that publishes its evidence does
not quietly drop its near-misses.
