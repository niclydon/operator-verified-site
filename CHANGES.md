# CHANGES.md

Chronological record of landed changes to this repository. The
long-form record lives in `docs/narrative/`; entries here point
at it.

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
