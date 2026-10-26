# Operator Verified — umbrella site and public devlog — DESIGN

> **Public edition.** This design record is published with the site it
> describes. Internal coordination detail (private file paths, chat
> identifiers, infrastructure codenames, and secret-store locations)
> has been removed; the decisions, rules, and specifications are
> unchanged. The full internal edition is a private program document.

Status note for the public edition: the text below is the design
record as written on Oct 25, 2026, when its status was "design
only" and this repository did not yet exist. The site was built
the same night and this repo is its home; the design text,
including its revision blocks, stands as the historical record
and is not rewritten to pretend otherwise.

Original status, Oct 25, 2026: DESIGN ONLY; REVISED the same night
for the Operator Verified reframe (see Revision 2 directly below).
This document is the design deliverable for the Showcase Site and
Devlog support workstream, now the Operator Verified web property.

Governing doc: `(private working file)` (read in
full for this design). Where this design and the portfolio disagree,
the portfolio wins.

Owner: the showcase workstream. Coordinator: the World Program coordinator. All decisions in §9 go to
Nic through the coordinator's queue, not directly.

---

## Revision 2 — the Operator Verified reframe (Oct 25, 2026, late)

This design was first written when the site was a "human-backed"
showcase. That framing is retired. What changed, and where the
record lives:

- Naming is PER PROJECT, no forced umbrella brand (PORTFOLIO.md
  tracked item T2, resolved Oct 25, 2026 late, after four naming
  rounds). The Discord project (W1) is FIADOR, the Spanish /
  Portuguese legal word for the guarantor who stands surety for
  another. Its repo was renamed on GitHub the same night:
  `github.com/niclydon/fiador` (public, rename verified live; the
  old human-backed URL redirects). `fiador.org`, npm `fiador`,
  and PyPI `fiador` were all checked free Oct 25, 2026;
  `fiador.com` is parked since 2002, which costs nothing at the
  .org anchor.
- Why the old name died: `humanbacked.com` is registered and is an
  OPERATING COMPANY, "HumanBacked," selling verified-human trust
  certification for enterprises, in an adjacent trust space with
  the same spoken name. Confusion risk was high; the rename was
  cheap before launch and would have been expensive after.
  "human-backed" survives only as descriptive prose where it is
  plainly generic (the claim the protocols make, the Discord role
  label in Fiador). It is never this site's name, a project name,
  a badge brand, or a domain element again.
- OPERATOR VERIFIED is the light umbrella label Nic picked for
  the program: the site and devlog the repos link from, not a
  brand stamped on each repo. Repos carry their own project
  names under Nic's account. Clearance as checked Oct 25, 2026:
  operatorverified was a clean sweep at check time (.com/.org/
  .io/.dev/.ai unregistered, npm and PyPI free, GitHub org name
  free, web search finds the phrase used only descriptively).
  One honest gap stays on the record: a formal USPTO database
  search is still outstanding, so the label is "unverified until
  run" and this design does not call the umbrella settled beyond
  Nic's adoption of it.
- Domains are REGISTERED (Nic's go, executed via the Cloudflare
  Registrar API, verified in his account afterward):
  operatorverified.com ($10.46/yr), operatorverified.org ($8.50
  year one, renews $11.20), operator-verified.com ($10.46/yr),
  operator-verified.org ($8.50, renews $11.20). Total $37.92 year
  one, $43.32/yr steady state, auto-renew on, all expiring
  2027-10-26. The .io pair was deliberately NOT bought (Nic:
  maybe later; .io renews at $50/yr each). Primary home:
  operatorverified.org (§6.3 as revised).
- Hosting is DECIDED: Vercel (Nic's call). §6.2 is revised from a
  recommendation to a decision with its implementation notes.
  Deploying and pointing DNS are still later steps the
  coordinator brings to Nic when the design and marks are ready;
  this design authorizes neither.
- CLAIM DISCIPLINE (the accuracy note recorded with the domains,
  binding on every word this site publishes): "Operator
  Verified" is slightly less literal than the retired name. The
  proof is that a unique human backs the operator; it is not
  identity or KYC verification of who the operator is. Umbrella
  copy must always phrase the claim as "verified as a unique
  human," NEVER "identity verified." The Visual Assets lockups
  already bake this in: their tagline reads VERIFIED AS A UNIQUE
  HUMAN. §0.1 below states the rule in full.
- Dedicated program wallet (tracked item T1, refreshed from the
  W0 chat): a NEW wallet was generated for this program only,
  its key is held in the operator's secret store and is never published. Public truncated
  form: `0x21BD…A14Bc`. Live baseline at generation:
  `registered: false`. Its AgentBook registration steps are
  prepared in `(private working file)`
  and NOT executed; registration needs Nic's World App approval
  tap. From now on, ALL public demos, the founding attestation,
  and registry listings use this program wallet. The original
  playground / fleet wallet (the one the Oct 25 acceptance pass
  ran on) is not for public material, and this site never
  presents that prototype run as the program wallet's record.
- Fiador rename pass (refreshed from the program record): the founding
  tree's rename is prepared in the working tree, UNCOMMITTED,
  awaiting Nic's go (32 changed paths). In it: README and SPEC
  titles to Fiador, badge pill label now reads "fiador", badge
  files renamed `fiador-{pill,icon}-*`, banner and icon renamed
  `fiador-banner.webp` / `fiador-server-icon.webp` (the banner art
  carries no text, so no regeneration was needed), and the
  attestation canonical prefix is now
  `fiador-discord-attestation:v1` (safe only because no
  attestation has been signed yet). The Discord role name stays
  "Human-backed" as descriptive label copy. Until that commit
  lands, the live repo's in-repo text and badges still say
  human-backed; this site's copy must describe the repo as
  renamed and its founding documents as mid-rename-pass, never
  pretend the pass has landed.
- Verify substrate (refreshed from the program record): the verify core
  lives inside the Fiador repo as `packages/verify-ts/`, with the
  badge service as a top-level application beside it, designed
  for extraction when a second project consumes it. Public
  outputs carry a `PublicVerifyResult` projection only (status,
  truncated address, `humanHash`, failures, evidence); the hash
  construction is `sha256("w0-human-v1:" + humanId)` over the
  canonical text form. The badge service API carries
  `theme=auto|dark|light`, default `auto`. This site's /verify/
  page (§2.3) is designed against those shapes.
- Wave 1 spec states (refreshed from the program record): all
  three specs are written. W2 (presence approval inbox) carries
  the ETHOnline correction: ETHOnline 2026 ran September 4-16,
  2026 and is OVER; its prizes are a design reference, not a live
  deadline, anywhere this site mentions funding routes. W3's own
  `/verify/<hash>` page belongs to the provenance seal surface,
  not to this site (route collision avoided in §2). W4's
  per-task verification pages (`/v/<slug>`) belong to Cole's
  surface; this site explains that pattern in prose and hosts no
  task pages.
- Cadence (refreshed): the coordinator's program digest now runs
  TWICE a week, Mondays full and Thursdays a shorter
  blockers-first sweep. The public devlog stays weekly at
  minimum, aligned to the Monday digest (§4).
- Visual assets (refreshed from the Visual Assets chat and its
  folder): the workstream is producing the OV system in
  `(private working file)`. At
  Revision 2 time the folder held round 1 of concepts only (six
  OV treatments A-F in dark and light SVG, lockups for A, D, E);
  its INVENTORY.md has since landed with the full brand-needs
  table and conflicts note, and the whole direction has since
  been redirected to a material language (Revision 3, which
  governs; the pending round is round 3 per Revision 4 point 5).
  §5 designs against placeholder slots sized to the
  inventory's specs, and this site invents no marks of its own.

---

## Revision 3 — visual direction redirected (Oct 25, 2026, night)

Nic has redirected the brand aesthetic in the Visual Assets
workstream. Recorded here from the coordinator's note; the
direction note itself will land in
`(private working file)`
and, when it does, it governs §5.

- Round 1's flat Nova Glass marks are SUPERSEDED as the brand
  direction. The round-1 concepts (A-F), lockups, and the
  INVENTORY's frontrunner read (E) are history and feasibility
  evidence, not candidates this site designs toward.
- The new direction is a modern MATERIAL language: matte brushed
  steel, machined credential-plate detailing with corner screws,
  liquid glass, Apple/OpenAI-grade futurism. The feeling it must
  carry: secure, verified, factual, real human.
- For this site, effective immediately: structure and content
  design continue exactly as specified in §§2-4 and 6-10. The
  VISUAL STYLING LAYER IS PENDING ROUND 2. No palette, surface
  treatment, or geometry signature from round 1 / the inherited
  Nova Glass token tables is locked by this design; §5.1's tables
  are reclassified as a provisional development palette (safe to
  build scaffolding against, guaranteed to be revisited), and
  §5.2's slots are reclassified as positions and sizes only.
- What does NOT change: light and dark are still both designed
  natively (a brushed-steel plate and its light-mode counterpart
  are two designs, not a filter); system preference plus manual
  toggle still governs; claim discipline (§0.1) is untouched;
  Fiador's own badge artwork is Fiador's, not the umbrella's, and
  is unaffected by the umbrella's material change.
- Adoption mechanics: when the round-2 direction note lands in
  INVENTORY.md, this design adopts it as the site's material
  language in a Revision 4 pass over §5 (tokens, surface
  treatments, hero treatment, specimen presentation), recorded
  as a dated design update. Until then, any local build uses the
  provisional palette and marks its pages as styling-pending in
  its own working notes, never in public copy.
- One round-1 finding survives the redirection because it is a
  constraint, not a style: the INVENTORY's conflicts note
  (checked Oct 25, 2026). In security contexts "OV" already means
  Organization Validation, which is precisely the claim this
  program must not make; so site copy expands "Operator
  Verified" on first use on any security-facing page, the
  monogram never appears beside a bare "OV verified" claim, and
  lockups always carry the full subline. The stacked,
  overlapping OV arrangement is also ruled out (an existing
  registered OV mark in another field uses it). These bind
  round 2's mark design and this site's copy regardless of
  material.

---

## Revision 4 — program direction applied to the site (Oct 25, 2026, night)

Source: PORTFOLIO.md, "Program direction (set Oct 25, 2026, Nic:
'make it so throughout the program')" — five points; the
coordinator's note to this workstream named three site changes,
and the other two are recorded here at the weight they actually
bear on a website.

1. NO-TOKEN POSITION, stated on purpose (direction point 4).
   The program has no token, wants no token, and says so in its
   public positioning as a deliberate trust signal aimed at the
   enterprise-adjacent audience. For this site it is woven in,
   never sloganized:
   - About carries the statement as a short plain paragraph
     (§2.6 as revised): "This program has no token. Nothing here
     is for sale as a token, no token is planned, and anything
     offered under these names as a token is not ours. The
     projects are open source under Apache-2.0; the site asks
     for no wallet, no purchase, and no sign-up to read or
     verify anything."
   - Every project page's footer block gains one line beside the
     licence line: "Part of Operator Verified, an open-source
     program with no token." Nothing louder anywhere.
   - The home page carries it exactly once, inside 02 / WHAT A
     PROOF PROVES, as a limit card among the other limits: a
     thing the program does not do, in the same flat tone as the
     things its proofs do not prove.
   - The devlog states it when it is news (post 1's founding
     decisions) and otherwise leaves it alone; it is not a
     per-post banner.
   - It is a ruling fact in `facts.json`, so changing it one day
     is visible history.
   The position is a trust signal precisely because it is stated
   once, plainly, and then not campaigned on. Copy that repeats
   it defensively reads as marketing and fails this section.

2. W2 GRAVITY (direction point 2). The presence approval inbox
   and its canonical approval record are the program's
   product-shaped center; Fiador is the public wedge and working
   demo. Presentation weighting, applied WHEN REAL CONTENT
   REPLACES PLACEHOLDERS (the coordinator's condition), not at
   launch scaffolding:
   - Fiador remains the launch lead and the only project page at
     launch: it is what exists, it is live, and the site does not
     pretend W2 has public material before it does.
   - When W2 produces public material (its own repo/spec made
     public through the coordinator), the home page's 04 /
     PROJECTS section re-weights: the lead feature slot goes to
     the approval record story (what an approval record is, its
     canonical shape, why an evidentiary record is the
     substantive center), and Fiador presents under it as "the
     working demo" — live demo link, verify explainer link, its
     state chip unchanged. The project index mirrors this: a
     featured section for the approval record at top, Fiador
     first in the project list as the demo.
   - The /verify/ explainer gains a short closing section at the
     same moment: how an approval record differs from an
     attestation check (a record of a specific human approving a
     specific action, versus a standing registration fact),
     linking W2's page. One section, added when there is
     something public to link; until then its absence is not a
     gap to fill with speculation.
   - The trigger and the re-weighting are recorded as a held
     item in §10 so the change happens by design when W2 goes
     public, not by someone remembering this paragraph.
   Wording care: nothing here makes W2 "the product" in site
   copy today; the weighting is presentation order and emphasis,
   and W2's own claim limits govern its page when it exists.

3. SHIP ORDER OVER POLISH ORDER (direction point 3), binding on
   this site's build arc. A good-enough live site with the
   Fiador demo linked beats a perfect site later. Concretely:
   - The first-deploy gate is the short list in §7.3 (secret
     scan, privacy read, claim read with adversarial review,
     Nic's approval of launch text, both modes functional and
     checked, watchdog). Nothing else gates deploy.
   - Explicitly NOT deploy-gating, flagged here so no design
     work quietly becomes a delay: the round-3 material styling
     (the site may launch in the provisional palette if Nic
     gives the deploy go before round 3 lands; the Revision 4
     visual pass then ships as a dated site change with its own
     snapshot); production OG artwork (required before any
     ANNOUNCEMENT post about the site, not before deploy —
     §5.2 as amended); sibling footer reciprocity; the
     machine-readable digest file; exact light-token values;
     stacked/mono lockups; the W2 re-weighting in point 2.
   - The rule for this workstream, stated for future work:
     flag any design work that would delay a first deploy once
     Nic gives the go, in the report that proposes it, rather
     than letting it become schedule by accretion.

4. The direction's other two points, at their real weight here.
   Commercial end state (point 1): governed for this site by
   the COMMERCIAL NARRATIVE RULE, added to the portfolio the
   same night and applied in §0.2 — the site and the devlog
   never discuss monetization, commercial intent, or the
   two-track model, in any form. Point 1 therefore has no
   public-copy expression at all here; it is recorded in this
   internal paragraph only so a future builder does not mistake
   the absence for an oversight. Community presence (point 5):
   presence is
   Nic's, under his handle at his timing; this workstream's part
   is preparing the artifacts that make it land (the live site,
   the demo link, listing-ready project summaries in the devlog),
   all under the outward-post approval gate that already binds.

5. Terminology fix carried with this revision: the coordinator's
   note names the governing material round as ROUND 3 (research
   plus round-2 concepts preceded it in that workstream).
   Revision 3's references to the pending round as "round 2"
   should be read as the same pending direction note; §5 and
   §10 now say round 3.

---

## Revision 5 — round 3 adopted as the governing material language (Oct 25, 2026, late)

The visual pass this design was holding for has landed. Source:
the Visual Assets workstream's INVENTORY.md round-3 section and
the coordinator's kickoff to build. §5 is rewritten under this
revision; the provisional palette is retired.

- LEAD IDENTITY: the straight-on, filled steel plate with the
  overlaid OV. A machined credential plate (brushed steel,
  clearcoat liquid-glass depth carried by light, bevel, recess,
  and cast shadow, never camera tilt), Torx corner screws, the
  overlaid OV filling the face: the O in metallic gold (house
  eye-gold family), the V in deep steel blue laid over it, and
  the microline VERIFIED AS A UNIQUE HUMAN engraved along the
  base. Files: `operator-verified-assets/round3/renders/plate-lead-{dark,light}.png`
  (1000x1000; dark is the reference render) and the lead lockups
  `round3/lockups/lead-lockup-{dark,light}.png` (1960x560,
  wordmark in the machined register, "Verified" in steel blue,
  letterspaced claim subline). Nic's verdict settled this: he
  liked the overlaid logo arrangement itself; the refinement
  (fill the plate, straight-on, liquid-glass steel, colour
  inside the guardrail) is his correction set, applied by the
  assets workstream.
- HERO-ONLY, by audit: the overlay fails at 16/32px (letters
  merge into a single emblem). It is never downscaled into an
  icon, favicon, badge, or chip. SMALL SIZES USE THE
  SEPARATE-LETTER CORES, permanently: the round-2 G-plate
  small-icon cores (`round2/cores/ov2-small-icon-g-plate-{dark,light}.svg`)
  carry O and V as separate legible letterforms at 16px. The
  audit's other kills stand (Negative and Highlight overlay
  treatments are dead; the Blend overlay is a hero-only 2D
  fallback if ever needed).
- PALETTE (round 3): brushed steel fields, metallic gold,
  deep steel blue (the #6C96B8 family for lit faces and label
  use; the plate's V renders deeper in shadow). The bright cyan
  family (#00AFF0 and kin) stays BANNED as a dominant accent;
  round 1's label cyan #8ABAD3 stays retired as an OV accent.
  Web tokens sampled and derived from the renders are tabulated
  in §5.1 as revised; they are the site's tokens until the
  production rebuild (2048px+) lands on Nic's go, at which point
  any retune is a dated design update.
- LIGHT MODE IS A REAL DESIGN, with one honest caveat carried
  from the audit: under the brighter key, the gold flattens
  toward tan and the V lightens. The assets workstream names a
  light-mode tuning pass (deeper gold, darker V) as the first
  refinement candidate. The site uses the light render as-is
  (no local recoloring, per §5.2's mode rule) and records the
  caveat here so nobody "fixes" it in CSS.
- The flat-color-only brand rule from the Oct 15 sibling system
  does NOT bind this property's material surfaces: depth here
  is real light and shadow by design. The site's UI chrome stays
  disciplined (hairlines, restrained shadow, plate objects
  reserved for identity moments: hero, lockups, project lead
  art), so the plate reads as an object on the page, not as the
  page's texture everywhere.
- BUILD AUTHORIZATION (coordinator kickoff, Oct 25 late): with
  the lead identity settled enough to build against, this
  workstream proceeds to a LOCAL BUILD of the site against
  §§2-4 as designed and this material language, in
  `(private working file)`. Deploy and DNS
  remain gated on Nic's go through the coordinator. The build
  reports back here when it is ready to show.

---

## 0. Settled decisions this design inherits (not re-opened here)

From PORTFOLIO.md and the coordinator kickoff:

- Credit model: name stamp plus house visual style, NO product
  brands. Every public surface carries "Created by Nic Lydon",
  Copyright 2026 Nic Lydon, Apache-2.0 LICENSE + NOTICE in its repo.
  Being the named author of the software is separate from publicly
  linking Nic's name to his humanId. That link is NOT made by
  default, and this site does not make it (see §7).
- THE HUMANID RULE: the full humanId never appears on any public
  surface. Hash only. No exception for screenshots, fixtures, badge
  URLs, log excerpts, OG images, source comments, or git history.
  Truncated wallet address plus humanId hash is the only public
  form. Demo material that needs a wallet uses a dedicated or
  synthetic wallet, never the fleet's operational keys.
- Trademark: no World marks in any repo, product, service, site, or
  domain name. Descriptive prose only: "works with World ID",
  "built on AgentKit", "checked against AgentBook". Attribution
  stays factual and never implies endorsement by any maker named
  on the page. Every page carries the independence disclaimer in
  its extended umbrella form, stated in full in §0.1 (World,
  Worldcoin, Tools for Humanity, Okta, and Vercel all named).
- Light AND dark: both modes are designed and checked, neither is
  a recolor. Pages follow the visitor's system preference on first
  visit and offer a manual toggle that persists. Badges and served
  images ship in both variants.
- Devlog: weekly at minimum, more often when a launch warrants it.
  Drafted only from verified program material. NOTHING publishes
  without Nic's approval of the exact text. That includes the site
  copy itself on first launch, not just devlog posts.
- Quality bar (portfolio § Quality bar) applies to this site as a
  program prototype: spec first, threat / claim limits stated in
  the same words the public page will use, live verification
  evidence recorded with dates, adversarial review before any
  public identity claim, retest on change, narrative entry at arc
  close in the site's own repo under `docs/narrative/` plus a
  `CHANGES.md` entry once the repo exists.
- Licence default for the program: Apache-2.0.

### 0.1 Claim language (binding on all site copy)

- The claim, in the umbrella's words, is: the operator was
  "verified as a unique human." Approved variants name the
  mechanism descriptively: "a unique, verified human stands
  behind this agent", "checked against AgentBook at <time>".
- Banned, everywhere, in every mode, including alt text, OG
  cards, and devlog prose: "identity verified", "verified
  identity", "ID-verified operator", and any phrasing that reads
  as KYC, name verification, or endorsement by any platform.
- The name "Operator Verified" itself is a label, not a claim
  sentence; body copy never leans on the name to imply more than
  the sentence above. Where the name and the claim appear
  together (the lockups), the tagline is the claim sentence:
  VERIFIED AS A UNIQUE HUMAN.
- Project-level claim limits are inherited verbatim in substance
  from each project's README (§2.2). A claim change on any page
  is a wording change that triggers the adversarial-review gate
  (§7.3), exactly as in Revision 1 of this design.
- Non-affiliation, extended for the umbrella (Nic's brief,
  Oct 25, 2026 late): the disclaimer now names World, Okta, and
  Vercel alongside Worldcoin and Tools for Humanity. Full text:
  "Operator Verified is an independent project by Nic Lydon. It
  is not affiliated with or endorsed by World, Worldcoin, Tools
  for Humanity, Okta, or Vercel; 'World ID' and 'AgentKit' are
  used descriptively to name the systems this software
  interoperates with, and the projects in this program also build
  on, or integrate with, systems from other makers, named the
  same descriptive way." Rationale, stated once here so future
  editors do not trim the list as clutter: the research record
  shows Okta's Human Principal is a planned product in this exact
  space and Vercel's Workflow human-in-the-loop is a live
  integration in it; a reader meeting this umbrella next to those
  names needs the non-affiliation explicit, not implied.

DESCRIPTOR RULE (Nic, Oct 25, 2026, binding on site and devlog
copy): project names never appear naked on first use. Fiador
always travels with its descriptor on first use in a page or
post — "human-backed attestation for Discord bots" — and
Operator Verified always travels with its descriptor on first
use — "verified as a unique human" (as a naming appositive:
named for its claim, that an operator was verified as a unique
human). The rule binds the first body-copy use per page or post;
later uses may be bare. Fixed chrome is handled as the design
already handles it: the lockup carries the claim subline in the
artwork itself, and the footer's fixed lines (the no-token line,
the disclaimer) are labels, not first uses — the body's first
use on the same page still binds. Applied to the local build
the same night it was issued, and recorded in the devlog style
notes (§2.5) so every future post is drafted under it.

---

### 0.2 Commercial narrative rule (binding on all site copy)

COMMERCIAL NARRATIVE RULE (Nic-direct Oct 25, 2026, PORTFOLIO.md
boundary section, binding on every workstream; applied to this
site by the coordinator the same night):

- The public site and the devlog NEVER discuss monetization,
  commercial intent, pricing, business shapes, or the two-track
  (open-source / commercial) model. Not as plans, not as
  possibilities, not as denials-with-details. The devlog
  narrates the public building only: what was built, the design
  decisions about the public artifact, the evidence.
- The no-token statement (Revision 4 point 1) is NOT
  monetization talk and stays: it is a public trust position,
  stated in its fixed wording, and it is the only place the
  site touches the subject of money at all.
- Consequences for copy, stated so future editors do not have
  to re-derive them: no "hosted tier", "paid plan", "enterprise
  offering", "waitlist", "coming soon for teams", or equivalent
  phrasing on any page, project page, resource caption, OG card,
  or post; no roadmap item whose justification is commercial;
  design choices made so a future separate product could stand
  on the open-source work stay invisible in public copy, exactly
  as the portfolio requires. A future consumer or commercial
  product is a separate repo and a separate launch decision,
  never a section of this site or of a project's narrative.
- Enforcement in this design's machinery: the §4 boundary pass
  gains a commercial-narrative check by name, the §2.5 post
  format carries the exclusion, and the §7.1 devlog prohibition
  list names it. A draft that violates it fails the boundary
  pass like a private-zone leak, and is rewritten, not trimmed:
  trimming leaves the shape of the discussion in place.
- This rule binds public copy. This internal design document
  may name the rule and its source (as here) so the site's
  builders can enforce it; the rule is recorded in the
  portfolio, which is a private surface, and nothing about the
  commercial track itself is recorded in this design beyond the
  rule.

## 1. What was studied before designing

### 1.1 The existing showcase set (the siblings)

Live pages watched daily by the showcase watchdog
(reports failures only, to an internal operations channel):

- `https://www.niclydon.io/nexus`
- `https://www.niclydon.io/aria`
- `https://www.niclydon.io/gadgets`

Sibling sources studied:

- Nexus: `(private working file)` (`index.html`,
  `facts.json`, `live.json`, `data.json`, hero media, `snapshots/`)
- ARIA: `(private working file)` (`evolution.html`
  is the living page of a frozen exhibit, `facts.json`, `errata.json`,
  `brand/`, `snapshots/`)
- Gadgets: `(private working file)`
  (`gadgets-article-showcase.html`, `facts.json`, `snapshots/`,
  README: "Source repo for the Gadgets showcase at
  www.niclydon.io/gadgets")
- Shared design spec: `(private working file)`
  (Oct 15, 2026) and `design/evolution-system-design.md` (the
  facts-and-snapshots system design)

Patterns this site must reuse, because they are the house pattern
and because the watchdog and tooling already assume them:

1. Look and feel (Oct 15 design system, one language across all
   three): graphite `#1C1C1E` base, panel `#242428`, raised
   `#2A2A2F`, hairline `#38383E`, text `#F4F4F1`, muted `#A9A9A4`;
   amber gold `#C9933A` as primary accent, cerulean family
   `#4A7FA5` / `#8ABAD3` / `#2B6CB0` as the data accent; Inter for
   UI and headings, JetBrains Mono for labels, data, and stamps;
   30/45-degree chamfer language (one cut corner, 14px on cards,
   6px on chips, no border-radius over 4px elsewhere); FLAT COLOR
   ONLY, no gradients; max content width 1160px; section labels in
   JetBrains Mono 11px uppercase, letterspaced, prefixed with an
   amber index ("01 / SYSTEM").
2. Shared chrome: a fixed top bar (graphite at 92% + backdrop blur,
   mono `niclydon.io` wordmark with amber diamond on the left,
   sibling links in the middle/right with the current site in
   amber, a hairline divider, then "Snapshot history") and a
   matching footer (hairline top border, facts-verified stamp on
   the left where the site has one, a short mono provenance line
   on the right). This site adds itself as the fourth sibling in
   that nav and, when it launches, the other three top bars gain
   the new link at their next snapshot cut. It does not fork the
   chrome.
3. Snapshot / facts pattern (the load-bearing idea): every
   load-bearing number or claim on a page comes from a per-site
   `facts.json`, where each fact carries `id`, `label`, `value`,
   `kind` (`machine` / `ruling` / `historical`), a reproducible
   `source` (`type` + `ref` + `detail`), `verified_at`,
   `verified_by`, and `publish`. Pages render facts at deploy
   time, never hand-type them into prose. Dated snapshots under
   `snapshots/<YYYY-MM-DD>-<slug>/` freeze the whole site plus its
   `facts.json`, a `snapshot.json` manifest (date, reason,
   deployment, source commit, per-file hashes), a generated
   what-changed record, and a short hand-written `note.md`.
   Snapshots are append-only; the deploy tooling refuses to upload
   a tree in which an existing snapshot's hashes differ from its
   manifest. History index at `snapshots/index.html` (watchdog
   check: the text "note pending" must appear zero times there).
   Staleness is shown, not hidden: machine facts re-verify on a
   weekly cadence, drift is reported and reviewed, never silently
   updated; ruling facts change only on a new ruling; historical
   facts change only as visible errata (the ARIA model).
4. Hero media treatment: a framed, web-optimized hero visual
   beside or behind the hero copy, never a raw master. Nexus uses
   a generated still (`hero-graph.jpg`) as the poster for a muted,
   looping, lazy-loaded web transcode, with a canvas backdrop that
   pauses offscreen. Gadgets leads with a face-concept loop the
   same way. Rules carried over verbatim: web transcodes only,
   muted + loop + lazy, poster frame under
   `prefers-reduced-motion`, no-JS and crawler renders stay
   complete (reveal-on-scroll sets its hidden start state from JS,
   elements are visible by default), and count-up animation only
   interpolates toward the `facts.json` value, it never invents
   one.
5. How they link repos: in prose and in package / project cards,
   by canonical repo URL, next to the thing the repo is (Nexus
   links its platform repos in its service descriptions; Mosvera
   does the same, §1.2). A repo link is a fact: it goes in
   `facts.json` (`kind: machine`, source = the repo's own public
   page, re-verified on the weekly pass), so a renamed or
   made-private repo shows up as drift instead of a dead link
   rotting in HTML.
6. Watchdog contract: the live site must serve, at stable URLs,
   the page (200), `facts.json` (generated_at 16 days old or
   less), a hero media spot-check file (200), and
   `snapshots/index.html` with zero "note pending". This site is
   designed to be added to that watchdog on launch day, with its
   own four checks named in the launch narrative. A site that
   cannot pass the existing family's checks does not launch.

Where the siblings differ, and what this site picks:

- Nexus is a living platform page (frequent snapshots), ARIA is a
  frozen exhibit (historical facts, errata only), Gadgets is a
  single long article (its light theme and reading progress bar
  are its own). This site is a living program page, closest to
  Nexus: frequent snapshots, machine + ruling facts, no frozen
  pages at v1.
- The live Nexus `index.html` still carries an older hero type
  pairing (Instrument Serif / Outfit) under the Oct 15 system
  layer. This site follows the Oct 15 design system directly
  (Inter + JetBrains Mono) rather than copying the older layer.

### 1.2 Mosvera.io (the finished public-product reference)

`https://mosvera.io/` — "Aesthetic Infrastructure for AI-Native
Tools", read Oct 25, 2026. What to learn from it, and what not to
copy blindly:

- It is a single-product site that explains itself in one screen:
  a plain one-sentence promise, a visual of the actual artifact,
  then a three-verb structure (Declare / Resolve / Compile), then
  "What is Mosvera?", then the open-source surface (spec repo,
  runtimes on npm/PyPI, portable packs), then a 10-minute
  quickstart, then a package map. The program home borrows that
  spine: promise, artifact, three steps, what-it-is, open surface,
  start-here. See §2.1.
- It consumes the idea it explains: the site itself is rendered
  from a resolved Mosvera aesthetic, and it says so, with the
  composition and compiled tokens viewable. The equivalent move
  here: the program home renders its own workstream status and
  registry-count claims from its `facts.json`, and says so, with
  the facts file linked. A showcase for verified claims should
  visibly run on verified claims.
- It is honest about its boundary in public, on the page: no
  hosted runtime dependency, production usage runs in your own
  tools, this domain hosts docs and examples only. The program
  home needs the same move for its trust claims: what the proofs
  do, what they do not do, and that demos run on dedicated wallets,
  stated on the home page, not buried in a spec.
- It offers an agent-readable entry (an LLM-readable index and an
  install router). Cheap to mirror later (a `/llms.txt` once the
  site is stable); explicitly out of v1 scope so v1 stays a human
  site with clean semantics.
- It does NOT set this site's visual tokens. Mosvera has its own
  public aesthetic (warm tessera workspace art). This site stays
  Nova Glass / the Oct 15 showcase system so it reads as a sibling
  of Nexus / ARIA / Gadgets first. Mosvera is the reference for
  structure and finish, not for palette.

### 1.3 Program material already public or ready to reuse

- Fiador, live now: `https://github.com/niclydon/fiador`
  (public; founded Oct 25, 2026 as human-backed, founding commit
  `ed7f840`, renamed on GitHub the same night, old URL redirects;
  docs-only founding tree: README, `docs/SPEC.md`, 12 badge SVGs
  in light and dark, banner and icon, Apache-2.0 LICENSE / NOTICE
  with Nic's name stamp, `CHANGES.md`,
  `docs/narrative/2026-10-25-founding.md`; founding
  pre-publication scan recorded clean). The in-repo founding text
  still says human-backed pending the uncommitted rename pass
  (Revision 2). Local staging copy:
  `(private working file)` (folder name predates the
  rename). Its README is the voice model for project pages: it
  states the one thing the proof proves, states the limits in the
  same breath, and carries the independence disclaimer.
- Operator Verified visual work in progress:
  `(private working file)`
  (its INVENTORY.md has landed in round-1 form: brand-needs
  table, conflicts note, six concepts; the material redirection
  in Revision 3 supersedes its style direction, and its
  round-2 update is the document §5 waits on). See §5.
- Visual batch 1: `(private working file)` (`INVENTORY.md`,
  `README.md`, `badges/`, `generated/`). See §5.
- Whitespace research: `(private working file)`
  (Oct 25, 2026). The finding the home page cites: the
  AgentBook registry linked from World's official documentation
  contained exactly five services when checked live on
  Oct 25, 2026 (AgentVid, InstaClaw, Newsworthy, Code Canvas,
  Carbon & Cashmere), and no public implementation was found for
  messaging attestation, email trust, telephony, agent content
  provenance, or cross-human agent-to-agent trust. On the site
  this is a dated, sourced fact (in `facts.json`), never an
  evergreen boast: the registry will grow, and the page must be
  able to say when the count was last true.

---

## 2. Site map

Site name: Operator Verified, the umbrella label (Revision 2).
Canonical home: `https://operatorverified.org/`. The byline is
"An independent open-source program by Nic Lydon". The umbrella
is a label for this site and the devlog; project pages lead with
the project's own name, and repos are never rebranded to the
umbrella. Copy follows §0.1 everywhere, starting with the name's
own tagline: VERIFIED AS A UNIQUE HUMAN.

```
/                                   Program home (operatorverified.org)
/projects/                          Project index (cards for all workstreams)
/projects/fiador/                   Project page: Fiador (live at launch)
/projects/presence-approval/        Stub page; W2 spec is written, page waits for public material
/projects/provenance-seal/          Stub page; W3 spec is written, page waits for public material
/projects/callback-verified-ea/     Stub page; W4 spec is written, page waits for public material
/projects/verify-core/              Stub page, appears when the W0/W1 verify package is public
/verify/                            Verify explainer: how checking works (new in Revision 2, §2.3)
/resources/                         Resources: official material, descriptively linked
/devlog/                            Devlog index
/devlog/2026-10-27-founding/        Post page (slug: <YYYY-MM-DD>-<slug>)
/devlog/feed.xml                    RSS/Atom for the devlog (same content, no extra claims)
/about/                             About, credit, licence, independence, contact route
/facts.json                         This site's facts file (public, as on the siblings)
/snapshots/                         Snapshot history index
/snapshots/<YYYY-MM-DD>-<slug>/     Frozen snapshot, append-only
```

Route collisions, settled here so the build does not have to:
this site's `/verify/` is an EXPLAINER. It performs no check.
Fiador's static verify page and served-badge endpoints are tool
surfaces owned by W1/W0 and live with that project (linked, not
hosted here, in v1). W3's `/verify/<hash>` belongs to the
provenance seal's own surface and is linked as that project's
tool when it exists. W4's per-task `/v/<slug>` pages belong to
Cole's surface. One word, four jobs; the explainer page exists
precisely to teach a reader which surface does which job.

Rules for the map:

- A project gets a stub page only when there is public material
  to link (a public spec or repo). A workstream that exists only
  inside the estate gets a row on the project index marked
  "in design, nothing public yet" with no page and no claims.
  No placeholder pages with invented dates.
- Wave 2 and Wave 3 workstreams (W5–W9 in the portfolio) appear
  on the project index as a single "Later waves" section naming
  the idea areas in one line each, taken from the portfolio's
  public-safe wording. They get pages only when the coordinator
  stands their wave up and they produce public material.
- Every page carries: a top bar in the shared chrome's shape and
  behavior (fixed, glass, hairline, mono section links, snapshot
  history link, light/dark toggle per §5.3), but carrying THIS
  property's identity: the `ov-monogram` slot (§5.2) and the
  Operator Verified wordmark on the left, and this site's own
  sections (Projects, Verify, Resources, Devlog, About) as its
  nav. Revision 1 had this site joining the niclydon.io sibling
  nav as a fourth showcase; the reframe supersedes that, because
  the site now lives on its own domain under its own umbrella.
  The sibling relationship is kept in the footer instead: a
  "More by Nic Lydon" line linking the Nexus, ARIA, and Gadgets
  showcases at their www.niclydon.io homes, beside this site's
  facts-verified stamp. If the siblings' top bars ever link here,
  that is their snapshot decision, not a dependency of this
  design. The independence disclaimer appears in full on About,
  on every project page, and on /verify/; a one-line version
  linked to About sits in the footer of the other content pages.
- No page requires JavaScript, an account, or a wallet to read.
  Any future interactive check (for example Fiador's static
  verify form) is a separate, clearly labelled tool page,
  designed by its owning workstream, not part of this site's v1.
  The /verify/ explainer must never grow a form by accretion; a
  tool moving onto this domain is a new design note through the
  coordinator.

### 2.1 Program home (`/`)

Purpose: in one visit, a stranger understands what the program
is, why the space was empty, exactly what is and is not being
claimed, and where the code and the log live.

Sections, in order, using the Oct 15 section-label pattern:

- Hero. The OV lockup slot (§5.2) at the top, then the promise
  in plain words. Working copy, for Nic's approval, not yet
  public text: "Agents are starting to act for people in public.
  Operator Verified is a small open-source program building, in
  the open, the pieces that let anyone check that the operator
  behind an agent was verified as a unique human." The second
  sentence is the claim in its §0.1 form on purpose; the hero is
  the first place the discipline shows. Under it, two actions
  only: "Read the first project" (to `/projects/fiador/`) and
  "How verification works" (to `/verify/`); the devlog is one
  scroll away in section 05. Right: the hero media treatment in
  §5.2 (the OV banner slot in both modes; Fiador's own banner
  art belongs on Fiador's page, not the umbrella hero). No stats
  in the hero that are not in `facts.json`.
- `01 / THE GAP` — the whitespace finding, honestly framed.
  Three short paragraphs plus a dated fact card: the registry
  count (value, source, `verified_at` rendered from `facts.json`),
  the categories with no public implementation found (messaging
  attestation, email trust, telephony, content provenance,
  agent-to-agent trust between different people's agents), and
  the method note ("searched Oct 25, 2026; absence here means
  nothing public was found, not that nothing exists anywhere").
  This section must age gracefully: when the registry count
  changes, the weekly facts pass updates the card and the
  snapshot records it.
- `02 / WHAT A PROOF PROVES` — the honest claims section. One
  card per claim level used anywhere in the program, in the same
  words the project READMEs use. For Fiador, verbatim in
  substance: it proves a unique human registered the wallet that
  signed the attestation; it does not prove the human wrote any
  particular message, endorses any particular output, or controls
  the bot at this moment. A second card states the program-wide
  limits: proofs are checked live at verification time, marks can
  expire and visibly decay, and no page in this program presents
  a proof as granting privileges. This section is the site's
  threat-model surface; any wording change here is a claim change
  and triggers the adversarial-review gate (§7.3).
- `03 / THE PROGRAM` — the wave map as a simple list, not a
  roadmap graphic with dates: Wave 0/1 (verify core inside
  Fiador, Discord attestation as Fiador, presence approval
  inbox, provenance seal, callback-verified assistant), Wave 2 and
  Wave 3 named in one line each. Each entry carries its current
  state from `facts.json` (`spec` / `building` / `tested` /
  `proven`, with the date that state was recorded) — the same
  vocabulary as the coordinator's weekly digest, so the public
  page and the internal digest cannot quietly diverge.
- `04 / PROJECTS` — the project cards (same component as the
  project index, §2.2), Fiador first and live, the rest at
  their real state (W2, W3, W4: spec written, nothing public yet
  beyond what their pages will link when the coordinator rules
  the material public).
- `05 / THE LOG` — the three newest devlog posts (title, date,
  one-line summary, reading link), plus the rule stated in one
  sentence: "Posted weekly. Every post is drafted from work that
  was verified that week, and published only after the author
  approves the text." That sentence is a public commitment; the
  workflow in §4 is how it is kept.
- `06 / START HERE` — the Mosvera lesson: a short, concrete path
  for three readers. Builders: the Fiador spec and repo.
  Server admins: what the verifier will ask of them (one install,
  one role), labelled as design-stage until W1 ships it.
  Curious readers of the underlying system: the Resources page.
  No quickstart is promised before the code it describes exists.
- Footer: facts-verified stamp (newest `verified_at` among facts
  used on the page), snapshot history link, "Created by Nic
  Lydon. Copyright 2026 Nic Lydon, Apache-2.0." and the one-line
  independence note.

### 2.2 Project index (`/projects/`) and project pages

Project card component (index and home share it): project mark
or badge art, name, one-sentence description, state chip
(chamfered, per the design system: proven in amber, building in
cerulean outline, spec in muted outline), the date the state was
recorded, and links (page, repo when public, latest narrative or
devlog entry when one exists). All state and dates render from
`facts.json`.

Project page template, in order:

- Header: name, one-sentence description, state chip + date,
  primary links (repo, spec, latest verification evidence).
- "What it proves / what it does not prove": the project's own
  two lists, in the project's README words. Nothing on the site
  may soften or strengthen this language relative to the repo.
- "How it works": at most three steps, matching the repo README.
- "Status and evidence": what exists today, what does not exist
  yet (named as plainly as Fiador's README names it), and
  the dated verification record (runs, results, timestamps) with
  links into the repo's `docs/narrative/` and `CHANGES.md`.
- Artwork: the project's own assets (for Fiador, the badge
  set in both modes and all three states, shown as specimens with
  captions explaining that a served badge reflects a live check
  and a static copy proves nothing).
- Footer block: author stamp, licence, the one-line no-token
  line from Revision 4 point 1, independence disclaimer in full.

#### The Fiador page (the only project page at launch)

- Links: repo `https://github.com/niclydon/fiador`, spec at
  `docs/SPEC.md` in that repo, founding narrative at
  `docs/narrative/2026-10-25-founding.md` in that repo, badge
  assets under `assets/` in that repo, founding design at
  `docs/DESIGN.md` in that repo when its rename-pass commit lands.
- Naming note, carried on the page itself in one sentence: the
  repo was founded as human-backed on Oct 25, 2026 and renamed
  to Fiador the same day; its founding documents are being
  updated in a rename pass. That sentence stays until the pass
  commits, then shortens to the historical note in the founding
  narrative. The old repo URL redirects; the page links only the
  Fiador URL.
- Content source: the founding README and founding narrative,
  condensed, not rewritten into new claims, and updated for the
  rename only where the rename pass itself updates them. The
  page's "what exists today / what does not exist yet" mirrors
  the README's Status section (spec and badges exist; verifier
  bot, static verify page, and registry do not yet), plus one
  line the founding README predates: the verify package
  (`packages/verify-ts/`) is designed to live in this repo.
- Verification evidence block, with the T1 distinction kept
  sharp: (a) the substrate prototype record, Oct 25, 2026, in
  public-safe form (a gated endpoint loop proven end to end
  against a real AgentBook registration; the free trial
  exhausted after three granted uses and the fourth was denied,
  as designed), labelled as a private prototype run on the
  playground wallet, which is not used in public material; and
  (b) the program wallet record: dedicated wallet generated for
  this program, truncated `0x21BD…A14Bc`, registration prepared
  and not yet executed at design time, state rendered from
  `facts.json` so the page updates when registration lands. No
  full wallet address anywhere, no humanId in any form except a
  hash if the repo itself publishes one, no guild internals
  beyond what a demo strictly needs.
- The page is marked, via `facts.json`, as the launch project;
  its state chip reads from the portfolio status table as
  maintained by the coordinator, re-verified weekly.

### 2.3 Verify explainer (`/verify/`)

New in Revision 2, from the coordinator's brief: a page that
teaches checking, performs none. A reader who lands here from a
badge, a Discord role, or a devlog post should leave able to
answer three questions: what was checked, against what, and what
the result does and does not mean.

Sections:

- "The one claim": Fiador's story in the umbrella's disciplined
  words. An operator registers an agent wallet in AgentBook with
  their verified World ID; the operator signs an attestation
  binding that wallet to a Discord application; a checker
  verifies the signature, checks expiry, and resolves the wallet
  live in AgentBook. The result, stated exactly: the operator
  was verified as a unique human. Then the limits in the same
  breath, in Fiador's README words: it does not prove the human
  wrote any particular message, endorses any particular output,
  or controls the bot at this moment.
- "How a check runs, step by step": the W0/W1 verification order
  as a numbered list an admin can follow (signature recovers to
  the wallet; attestation not expired; live AgentBook lookup
  resolves; the public result shows status, a truncated wallet
  address, the humanId hash, and the check time). Two states are
  taught as distinct and never merged: "not registered" (the
  lookup resolved and found nothing) and "could not be checked"
  (the lookup itself failed). The W0 spec separates them because
  the playground code did not; this page is where a reader learns
  why the separation matters. Public-shape note in plain words:
  the full identifier is resolved privately inside the check and
  never displayed; what a public page may show is its hash.
- "Three ways to check": (1) the static verify page (no install;
  Fiador's own tool surface, linked when W1 ships it, labelled
  design-stage until then); (2) the self-hosted verifier bot (a
  server admin runs it under their own bot token; it grants or
  removes the server's "Human-backed" role at join time and on
  sync; no central hosted bot exists in v1, and the page says so
  so nobody waits for an invite link that is not coming); (3) the
  served badge (an image rendered from a live check at request
  time, carrying its check time, decaying visibly when a
  registration lapses; a copied static badge is a picture, not a
  proof, and the page says that too).
- "Reading a result": a specimen panel built from SYNTHETIC data
  only (invented application id, invented truncated wallet, a
  labelled synthetic hash), showing the verified, expired, and
  not-verified renderings side by side in both modes, each
  captioned with what a checker actually observed and when. No
  real attestation, including Nic's, is used as the specimen in
  v1; if a real one is ever shown, it is the program wallet's,
  published by Fiador itself first, and linked rather than copied.
- "What about the other verify pages?": the disambiguation the
  route collision needs (see the site-map note): the provenance
  seal's hash page and Cole's per-task pages each check a
  different thing, in one line each, linking their project pages.
  This keeps "verify" from becoming a word that means four
  things with no map.
- Footer block: the claim sentence and the independence
  disclaimer in full, because this is the page most likely to be
  linked from outside the program, where no other page's context
  travels with it.

Claim gate for this page: it makes the program's central
identity claim, so its text gets the adversarial review in
§7.3 as a named item, and any later wording change re-triggers
it. Its facts (verification order, states, hash construction in
plain words) render from `facts.json` entries sourced to the W0
spec and the Fiador repo, so a substrate change shows up as
drift here instead of a stale explainer.

### 2.4 Resources (`/resources/`)

Purpose: one page of official material, linked descriptively, so
a reader can check every underlying claim at the source. No
mirrored or paraphrased documentation; summaries are one line,
factual, and name the publisher. No World logos are reproduced;
links are text links. Each entry was verified live during the
Oct 25, 2026 research pass or in this design pass; the weekly
facts pass re-checks that each URL still resolves.

- World ID — the identity system this program's projects
  interoperate with:
  - Developer documentation home: `https://docs.world.org/`
  - IDKit and credentials (Proof of Human, Proof of Presence,
    Proof of Attributes): `https://docs.world.org/world-id/idkit/credentials`
  - Developer Portal (create an app, manage credentials):
    `https://developer.world.org/`
  - IDKit design guidelines, including the Verified Human Badge
    rules this program's badge design was checked against:
    `https://docs.world.org/world-id/idkit/design-guidelines`
- AgentKit and AgentBook — the agent delegation toolkit and the
  on-chain registry this program's verify work reads from.
  Descriptively: "World's AgentKit" on first mention where
  confusion with other products of the same name is possible:
  - AgentKit announcement (World blog, Mar 17, 2026, updated
    since): `https://world.org/blog/announcements/now-available-agentkit-proof-of-human-for-the-agentic-web`
  - AgentKit documentation: `https://docs.world.org/agents/agent-kit`
  - AgentKit SDK reference: `https://docs.world.org/agents/agent-kit/sdk-reference`
  - Places that accept AgentKit, and how to list one:
    `https://docs.world.org/agents/agent-kit/ecosystem`
  - The AgentBook registry linked from that ecosystem page
    (a community registry repository; five services listed when
    checked live on Oct 25, 2026 — the count itself lives in
    `facts.json`, not in this link's caption):
    `https://github.com/andy-t-wang/agentbook`
- World Chain — the network AgentBook lives on:
  - `https://docs.world.org/world-chain/index`
- Building in public with World — programs and directories named
  in the research report, each labelled with its status as of
  Oct 25, 2026 (rolling grants, hackathon prizes, ecosystem
  directory). Entries carry dates and are re-checked before any
  devlog post cites them; ended programs (the 2025 rewards pilot
  and retro fund) are not listed as opportunities.
  - World ecosystem directory: `https://world.org/ecosystem`
  - World for developers: `https://world.org/developers`
- This program's own sources, for contrast and provenance:
  the whitespace research summary as published in devlog post 1
  (the full internal report is not a public link; the post cites
  its method and dates).

Trademark pass for this page: product names appear only inside
descriptive sentences and link captions naming the publisher's
own material; the page title is "Resources"; the page never calls
anything on it "ours", never places the program's marks beside
World's names in a way that reads as a combined brand, and
carries the independence disclaimer in full.

### 2.5 Devlog index (`/devlog/`) and post format

Index: reverse-chronological list; each entry shows date, title,
one-line summary, tags (workstream, kind: launch / build notes /
verification record / correction), and an "approved and published
<date>" stamp. Corrections to a published post are never silent:
the post gains a dated correction note at the top and the index
entry gains a "corrected" tag, mirroring the siblings' errata
ethos.

Post format (every post, same skeleton):

- Front matter in the source file: `title`, `date`, `slug`,
  `workstreams`, `kind`, `summary` (one line, reused by the index,
  the feed, and the OG card), `facts_used` (the `facts.json` ids
  the post's numbers rest on), `approved_by: Nic`, `approved_on`,
  `syndicated_to` (for example dev.to, with its URL once live).
- Body sections: What happened this week (only verified
  material, with dates); Evidence (commands or checks in summary
  form, results, timestamps; identifiers truncated per §7);
  What did not work (failures are part of the record, per the
  Fiador founding narrative's commitment); What is next
  (no dates promised unless the coordinator's digest already
  carries them); Links (repos, specs, resources).
- Claim discipline: any sentence that states what a proof proves
  must match the owning project's README wording. Any number
  must trace to `facts_used`. Any "first" or "only" claim must
  cite the search that supports it and its date, in the post.
- Style note, descriptor rule (§0.1, Nic Oct 25, 2026): names
  never appear naked on first use in a post. Fiador's first
  mention carries "human-backed attestation for Discord bots";
  Operator Verified's first mention carries "verified as a
  unique human" as its naming appositive. Drafts are checked
  for this at the boundary pass with the claim check.
- Topic exclusion, absolute (the §0.2 commercial narrative rule
  in template form): a post never discusses monetization,
  commercial intent, pricing, business shapes, future hosted or
  paid anything, or a two-track model, and never frames a public
  design decision as made "so that" a commercial thing could
  follow. The devlog narrates the public building only. The
  no-token statement is the single exception, in its fixed
  wording, and only where Revision 4 point 1 places it.
- Media: at most one hero image per post, drawn from the
  project's own public assets or a fresh Nova Glass graphic made
  for the post; screenshots pass the §7 scan before they are
  attached (no full humanId, no tokens, no internal hostnames,
  no other people's data).
- Length guide: readable in about five minutes. A week with
  little verified material produces a short post that says so,
  not a padded one. A week with nothing verified produces the
  one-line entry the portfolio already requires of silent
  workstreams, published as that week's post only with Nic's
  approval like any other.

First post (already scoped by the portfolio, updated for the
reframe): the verification (the Oct 25, 2026 Orb verification
and end-to-end prototype loop, in public-safe form, with the
program wallet's separate status stated honestly), the
whitespace finding (dated, sourced, method noted), the founding
design decisions (hash-only publication, self-hosted verifier,
name-stamp credit, light and dark from day one), and the naming
story told straight: the first name collided with an operating
company, the project became Fiador, the umbrella became
Operator Verified, and the domains were registered. A launch
post that skips the rename teaches readers the wrong names;
telling it is also the cheapest public proof that the program
corrects itself in the open. Drafted under §4 like every other
post; nothing about it is exempt from approval.

### 2.6 About (`/about/`)

Author block ("Created by Nic Lydon"), what the program is in
three sentences, the credit and licence model, a short "No
token" paragraph in the exact plain wording set in Revision 4
point 1 (no token, none planned, anything offered under these
names as a token is not ours; no wallet, purchase, or sign-up
needed to read or verify), the independence
disclaimer in its extended form in full (§0.1: World, Worldcoin,
Tools for Humanity, Okta, and Vercel all named), a short "Why
'Operator Verified'" note carrying the accuracy discipline in
public (the label names the event, an operator checked as a
unique human; it does not claim anyone's identity was verified),
the privacy commitments in plain words (hash-only publication,
synthetic demo data, no analytics that identify visitors — see
§6.3), and the contact route Nic chooses (§9, D5 as revised;
until he chooses, the page links the public repos' issue
trackers and nothing else). No personal biography beyond the
name stamp, no location, no fleet or homelab detail.

---

## 3. The facts and snapshots layer for this site

Adopted wholesale from the siblings' system (§1.1, pattern 3):

- `facts.json` at the site root, generated, never hand-edited
  except through a `facts.manual.json` for ruling facts (program
  decisions: licence, credit model, cadence), merged at
  generation time. A pre-deploy check fails if the shipped
  `facts.json` differs from what the generator produces.
- Fact classes at v1:
  - `machine`: registry service count and check date; each
    workstream's state and state date (source: PORTFOLIO.md
    status table as maintained by the coordinator); each public
    repo's existence, default-branch commit short hash, and
    licence (source: the repo's public page / `gh` read via the operator's normal GitHub route);
    each Resources URL resolving (200) and its check date;
    devlog post count and latest post date (source: this repo's
    devlog index).
  - `ruling`: licence default, credit model, devlog cadence and
    approval rule, hash-only rule, the no-token position
    (Revision 4 point 1), project and umbrella names
    with their T2 record, registered domains and the primary
    (source: PORTFOLIO.md decisions log and tracked item T2,
    with dates). The USPTO status of the umbrella label is a
    ruling fact too, valued "search outstanding" until a formal
    check replaces it; the site never renders the label as
    trademark-cleared.
  - `machine` additions for Revision 2: the program wallet's
    registration state and its truncated public form (source:
    the status check named in the private wallet runbook, re-run on the weekly
    pass; full address is never a fact value, in any file, at
    any publish flag); canonical-domain DNS resolving to the
    Vercel deployment once launched (source: the registrar /
    DNS record itself); each project's repo URL under its
    current name, so a future rename surfaces as drift.
  - `historical`: the Oct 25, 2026 founding and verification
    dates, the founding registry count of five (kept as a
    historical fact even after the live count moves).
- Deploy-time rendering: pages reference facts by id; the build
  stamps the footer facts-verified date from the newest
  `verified_at` among facts the page uses; a missing id fails
  the build.
- Snapshots: cut on every production deploy whose tree hash
  differs from the last snapshot, and on any published-fact value
  change; stored in the site repo under `snapshots/`, deployed
  with the site, append-only, with `snapshot.json`, a generated
  what-changed record, and a hand-written `note.md` (a snapshot
  with "note pending" in its history index fails the watchdog,
  so the note is part of the cut, not an afterthought).
- Weekly re-verification aligns with the coordinator's Monday
  digest and the devlog draft (§4): one pass refreshes facts,
  flags drift for review, and supplies the devlog's evidence.
  Drift is never auto-published; a changed number is reviewed
  like a changed claim.

---

## 4. The devlog workflow

Cadence: weekly at minimum (aligned to the coordinator's Monday
program digest), more often when a launch warrants it (a repo
going public, a verification milestone, a registry submission).
Extra posts follow the same gates; a launch does not waive
approval.

Pipeline, with owners:

1. Collect (Showcase workstream, Monday, after the coordinator
   sweep; the coordinator now also sweeps Thursdays, and a
   Thursday blocker or launch can start an extra post under the
   same gates): gather the week's verified material from the sources
   of record only: the coordinator's weekly digest, workstream
   repos' `docs/narrative/` entries and `CHANGES.md` lines added
   that week, `facts.json` changes and drift reports, and live
   verification records the workstreams filed. Material that
   exists only as a chat claim is not eligible until the owning
   workstream records it in its repo or the digest verifies it.
2. Boundary pass (Showcase workstream): run the §7 checklist over
   the collected material before drafting, including the
   commercial narrative check by name (§0.2: no monetization,
   commercial intent, or two-track discussion in any form).
   Anything private is cut at this stage, not paraphrased
   around. The draft's evidence section is built only from what
   survives.
3. Draft (Showcase workstream): write the post in the §2.5
   format. Drafts live, before approval, in the site repo's
   working tree under `devlog/drafts/<YYYY-MM-DD>-<slug>.md`
   once the repo exists; until then, in
   `(private working file)` beside this
   design. Drafts are never in the deployed tree and never in a
   public branch before approval; the staging location is
   private by default (the local workspace now, a private branch
   or the coordinator's review surface later — mechanism is an
   implementation detail of the build arc, the rule is not:
   unapproved text is not public).
4. Approval (Nic, through the coordinator): the coordinator puts
   the draft text in front of Nic as that week's one decision
   item where possible. Nic approves the exact text, edits it, or
   kills the post. Approval is recorded in the post's front
   matter (`approved_by`, `approved_on`) and in the coordinator's
   digest. Silence is not approval; an unapproved weekly post
   slips, and the next post notes the gap honestly.
5. Publish (Showcase workstream, only after step 4): move the
   post into the site tree, run the pre-publication scan (§7.3)
   over the full post and any media, cut the site snapshot that
   includes it, deploy, and verify live (page 200, feed updated,
   OG card renders, both modes checked). Then syndicate: the
   same approved text to dev.to (the portfolio names dev.to plus
   Nic's own site), with the site as canonical (`rel="canonical"`
   pointing at the site post) and the dev.to version linking back.
   Any platform-specific edit after approval (formatting only)
   is allowed; a wording change is a new approval.
6. Record: the publish is entered in the site repo's
   `CHANGES.md`, the narrative entry for the arc is updated if
   the post closes one, `facts.json` gains the new post count
   and date, and the coordinator's next digest lists what shipped
   publicly, per the portfolio cadence section.

Failure handling: if a published post is later found to contain
an error or a boundary breach, the breach wins: the post is
corrected or withdrawn the same day, a dated correction note is
added (or, for a privacy breach, the content is removed first
and the note explains the removal in general terms), and the
incident is recorded in the site repo's narrative. The
pre-publication scan is a gate, not a guarantee, and the design
says so in the launch narrative.

---

## 5. Visual approach

### 5.1 Tokens: round 3 material language (governing)

Governing tokens per Revision 5, sampled from the lead renders
and the lockup, with text-grade deepenings where the render's
lit face would fail contrast as small text. Dark (reference
mode): page field #101214; panel steel #1D1E21; raised #26282C;
plate field #3A3C41; hairline #3F4247; text #F2F5F7; muted steel
#A9ADB3; faint #75787D; metallic gold (display / fills) #D4A55D
with #C9933A as its flatter fill form; deep steel blue for the
V, labels, and links #6C96B8, with the shadowed V depth at
~#1E5A74 reserved to artwork. Light: page field #EDEEF0; panel
#FFFFFF; raised #F4F5F6; hairline #D8DADC; text
#1C1C1E; muted #5C6066; gold text-grade #9C6B1E (display gold
from the render, ~#C8A75C, is fills only); steel-blue text-grade
#2F6488 (the render's lit V, ~#346E89, for fills and large
labels). Banned as a dominant accent on this property: the
bright cyan family (#00AFF0 and kin); retired with round 1:
label cyan #8ABAD3 as an OV accent. Material treatment: plate
objects carry soft cast/contact shadow and a clearcoat top
highlight; ordinary cards stay near-flat with hairlines, so the
plate is the only "object" on a page. Both modes designed
separately and contrast-checked per page type; the mode
behavior is §5.3. The token tables that follow in this
subsection's older text (round-1 Nova Glass values) are retained
below ONLY where they describe the shared sibling chrome
vocabulary the site borrows for type and rhythm; where they
conflict with this paragraph, this paragraph governs.

Base system: the Oct 15 showcase design system (§1.1), which is
itself the recorded Nova Glass system (graphite `#1C1C1E`, glass
`rgba(28,28,30,.78)` + blur 14px, cerulean borders `#4A7FA5`,
label cyan `#8ABAD3`, gold-amber `#C9933A` heads, flat color, no
gradients, error `#D96A5A`), plus the canonical character-palette
anchors used by the badge batch (Starfield Black `#0A0B13`,
Eye Gold `#D4A55D`, Glow Gold `#FDE1A0`).

Dark mode (the siblings' native mode, specified first because
the tokens already exist):

- Surfaces: base `#1C1C1E`, panel `#242428`, raised `#2A2A2F`,
  deep field (hero / footer bands) `#0A0B13`
- Hairline `#38383E`; text `#F4F4F1`; muted `#A9A9A4`; faint `#6E6E68`
- Accents: amber `#C9933A` (primary, state: proven), eye gold
  `#D4A55D` (the ring-and-core mark, verified state), cerulean
  `#4A7FA5` border / `#8ABAD3` label / `#2B6CB0` deep (data,
  links, state: building), error / expired `#D96A5A` used
  sparingly and always paired with a text label
- Glass: panels at `rgba(28,28,30,.78)` with 14px backdrop blur
  over the deep field, cerulean hairline borders

Light mode (designed, not inverted; derived from the badge
batch's light variants, which are the program's existing
light-mode precedent: white surface, graphite ink):

- Surfaces: base `#F7F6F3` (warm paper, matching the badge light
  pill's white), panel `#FFFFFF`, raised `#FFFFFF` with hairline
  definition doing the work shadows do elsewhere, deep field
  bands in graphite `#1C1C1E` used deliberately for the hero
  footer band so the banner art keeps its native ground in both
  modes
- Hairline `#D8D5CE`; text `#1C1C1E`; muted `#5C5C57`; faint `#8A8A84`
- Accents: amber deepens to `#A97A24` for text-grade contrast on
  light (amber `#C9933A` is kept for fills and the diamond mark,
  never for small text on white), eye gold deepens similarly for
  the mark's ring when it sits on a light surface (the badge
  generator's light-verified values are the source of truth),
  cerulean `#2B6CB0` for links and labels on light, `#4A7FA5`
  for borders and fills, error `#B4432F` for text, always paired
  with a label
- Glass: panels at `rgba(255,255,255,.82)` with the same 14px
  blur over the light field, cerulean hairline borders

Both modes are checked, per page type, before launch and at
every snapshot that changes CSS or artwork: contrast of body
text and label text against its actual background, state chips
legible in both, badge specimens shown in their matching mode
variant (a dark badge on a light page is displayed on its own
dark tile, as a specimen, and captioned as the dark variant —
the same picture-element pattern the Fiador README uses).
Flat color only in both modes; depth from hairlines and flat
tints, never shadows over 8px, per the brand rule.

Type and geometry carry over unchanged: Inter + JetBrains Mono,
1160px max width, 96px section rhythm, amber-indexed mono
section labels, chamfered cards and chips.

### 5.2 Marks, hero, and banner treatment (placeholder slots)

This site invents NO marks. The OV system belongs to the Visual
Assets workstream (`(private working file)`,
workstream). Design against their
inventory as it lands; until it lands, design against the slots
below, sized from the brief the workstream was given and from
the round-1 files that already exist. When their INVENTORY.md
appears, the build arc reconciles this table against it and
records any size change as a design-note update, not a redesign.

State of that folder (checked directly, updated at Revision
3): its INVENTORY.md has landed, with the brand-needs table
(specs used for the slots below: OG 1200x630, GitHub social
preview 1280x640, X banner 1500x500, site/devlog banner
2240x1120 class, Apple touch icon 180x180, app icon 1024 master
plus the standard sizes, server icon 512x512, backgrounds
2560x1440 desktop and 1170x2532 mobile, favicons SVG + 16/32/48
+ .ico), a conflicts note whose constraints Revision 3 carries
into this design, and production still gated on a direction
pick. Round 1's six concepts and three lockups exist but are
superseded as direction (Revision 3); round 2 (material
concepts plus a research pass) is in progress in that
workstream. Slot SIZES below follow the inventory; slot ART
will be round-2 material work, and no round-1 file is a
placeholder this site may ship.

Placeholder slots (name, size / ratio, mode rule, used on):

- `ov-monogram` — the chosen OV mark, SVG, 64x64 viewBox family
  (round-1 files are exactly this); top bar, footer, devlog
  index header. Always the mode-matched variant; never recolored
  locally.
- `ov-lockup` — wordmark + tagline lockup, 372x72 family
  (~5.2:1); home hero header and About. Mode-matched variant.
  The tagline text is part of the artwork and is never retyped
  in HTML next to it (one source for the claim sentence).
- `ov-og` — OG / social image, 1200x630 (plus GitHub social
  preview at 1280x640 sharing its composition), from their
  production set when it lands. Until then the OG slot is
  EMPTY by design: no temporary card is rendered, because a
  temporary flat card would either be replaced silently (a
  history violation) or linger as off-direction branding. The
  scaffold ships with the slot's meta tags wired and no image.
  Production OG is required before any public ANNOUNCEMENT post
  about the site; per Revision 4's ship-order rule it does not
  gate the deploy itself. OG has no visitor mode; the dark
  variant is the default when both exist.
- `ov-favicon` — SVG + 16/32/48 PNG + .ico, from their set;
  `ov-touch-icon` — Apple touch / app icon, 1024 master family.
- `ov-banner` — wide banner for the home hero's visual frame and
  the devlog index header; ratio from their production set
  (design the frame to accept 2240x1120, the batch-1 banner
  ratio, and re-check when the inventory lands).
- `ov-background` — light and dark background fields (desktop +
  mobile) for hero and footer bands, used the way the siblings
  use the graphite texture: under content, never behind body
  text at less than checked contrast.
- Stickers and emoji-scale marks are their deliverables for
  community surfaces; this site uses at most the emoji-scale
  mark inline in devlog posts, and only after production lands.

Treatment rules, following the siblings' hero rules (§1.1,
pattern 4) and the reframe:

- The umbrella hero uses OV art only. Fiador's own art
  (`fiador-banner.webp`, 2240x1120, starfield field with the
  gold-ringed iris orb, no text; `fiador-server-icon.webp`,
  1600x1600; sources in `(private working file)`
  under their renamed working copies, originals beside them)
  belongs on the Fiador project page, where its banner is the
  framed visual in dark mode and sits in the graphite band in
  light mode, exactly as Revision 1 specified for it there. The
  umbrella never borrows a project's banner as its own hero; that
  was the old showcase design and it is retired with the name.
- v1 hero is static (poster only). A motion version, if the
  visual workstream ever produces one, follows the Nexus pattern
  exactly (web transcode, muted, loop, lazy, poster under
  reduced motion). No approved OV motion asset exists.
- Project pages without their own production art use a token
  field with the project's initial in the sibling type treatment,
  never a stock or AI image of people, eyes, or Orbs (which
  would court both the trademark line and a false implication),
  and never the OV monogram as a substitute project mark: the
  umbrella mark on a project card means "part of this program",
  shown small beside the project's own name, not as its logo.
- Mode rule for artwork: every slot has a designed dark variant
  and a designed light variant from the visual workstream.
  This site does not produce a light variant by filtering a dark
  asset, or the reverse. If a slot's second mode has not landed
  when the build needs it, the build waits for that slot or
  ships the page without that artwork; a one-mode page is
  unfinished by the standing rule.
- Material rule (Revision 3): surface treatments in mock or
  scaffold form (plate, screws, brushed texture, liquid glass)
  are never improvised by this site to "preview" the direction.
  A CSS approximation of someone else's unfinished brand is a
  second, wrong brand. Scaffolding stays in the provisional
  palette, plainly, until the real assets and tokens land.

### 5.3 Mode behavior

- First visit: `prefers-color-scheme` decides. A manual toggle in
  the top bar (sun/moon as text-free SVG glyphs drawn for this
  site, labelled for assistive tech) persists in local storage
  and overrides. No flash of the wrong mode: the mode is resolved
  by a small inline script before first paint, and the no-JS
  render defaults to the system preference via media queries in
  CSS alone.
- Badges, marks, and specimens use `<picture>` with
  `media="(prefers-color-scheme: dark)"` sources plus the
  toggle's explicit mode, matching the pattern already shipped
  in the Fiador README.
- Both modes are screenshot-checked at launch for every page
  type in §2, and the checks are recorded in the launch
  narrative (the batch-1 badges were approved the same way).

### 5.4 How the badge artwork carries across

- Fiador's 12-SVG badge set (pill + icon, dark + light, verified /
  expired / unverified; pill label now reads "fiador" in the
  rename pass) is that project's specimen artwork: shown on the
  Fiador page as specimens (§2.2), used as state-chip inspiration
  (not copied literally; chips are text + token color), and
  never used by this site as a live claim about anything. The
  site itself displays no served badge until W0/W1 ship the
  dynamic badge service, at which point the Fiador page may
  embed its own project's served badge with its check time
  shown, exactly as the badge spec (`badges/README.md`) and the
  W0 theme API (`theme=auto|dark|light`) require.
- The generators are the source: Fiador badges from
  `badges/generate_badges.py` in the visual-assets tree, OV marks
  from the Visual Assets workstream's own sources. Colors and
  labels change there and outputs are regenerated; SVGs are
  never hand-edited, on this site or anywhere else.
- World's official Human Badge is not recreated, traced, or
  shipped by this site. If a page ever needs it (only where it
  refers to a human's own verification, per World's guidelines),
  it is used unmodified from World's own source, in its allowed
  light/dark adaptation, and the design for that page comes back
  through the coordinator first.

---

## 6. Hosting and repo

### 6.1 Repo options

The site gets its own public repo when Nic approves (portfolio:
repo creation, naming, and first public push are Nic's per-repo
go). Options:

- R1 (recommended): a dedicated public repo under `niclydon`,
  Apache-2.0, name-stamp credit, containing the static site
  source, `facts.json` + generator, snapshot tooling config,
  devlog sources (published posts only; drafts stay out of the
  public tree per §4 step 3), `docs/narrative/`, and `CHANGES.md`.
  Name: follow the domain, not the old showcase naming — working
  candidate `operator-verified-site` or `operatorverified-site`,
  Nic's pick at creation time (D4 as revised); any name implying
  a World connection is excluded. One repo per workstream is the
  program's structure; the showcase is a support workstream and
  gets its own, rather than squatting in Fiador's repo (which
  would blur that repo's single-project clarity) or in the main
  niclydon.io site repo (which is not a program repo and carries
  non-program pages).
- R2: a folder in the existing niclydon.io site project (the
  siblings' home). Faster to first deploy, reuses the existing
  rewrites, but mixes a public program repo's obligations
  (narrative, changelog, pre-publication scans recorded in-repo)
  into a general site tree, and the repo would either go public
  wholesale (wrong) or the site would have no public source
  (against the build-in-public posture). Not recommended.
- R3: a section inside the Fiador repo. Rejected for the
  reason in R1, and because Wave 1 alone will outgrow it.

Repo mechanics, whichever option Nic picks: the build host-side `gh` /
`git` over SSH for all GitHub work (standing estate convention;
never the Muse GitHub connector), private until the
pre-publication gate (§7.3) passes and Nic gives the go, founding
commit docs-first in the Fiador founding pattern (README,
LICENSE, NOTICE, CHANGES, narrative) with the scan result
recorded.

### 6.2 Hosting: Vercel, decided

DECIDED Oct 25, 2026 (Nic's call, via the coordinator): Vercel.
The alternatives from Revision 1 (GitHub Pages, Cloudflare
Pages) are closed and stay in git history, not in this section.

Implementation shape, in the siblings' pattern:

- Its own Vercel project (not folded into the niclydon.io
  project), static tree, deploy script in the site repo,
  snapshot-aware like the siblings' tooling. Preview deployments
  are the approval surface for launch text: Nic approves the
  exact text on the preview, production follows.
- The watchdog's four checks (page, `facts.json`, media,
  snapshot index) map onto this host directly (§1.1).
- Custom domain per §6.3 as revised: operatorverified.org is the
  project's primary domain; the other three registered domains
  redirect to it at the host / registrar level (a launch-step
  detail, configured when the coordinator brings deployment to
  Nic, not before).
- Nothing is deployed, no Vercel project is created, and no DNS
  is touched under this design. The coordinator brings that step
  to Nic when the design and the marks are ready. Local build in
  this workspace is the current ceiling: the scaffold may be
  built and previewed locally so the design can be checked
  against real pages, and it stays on this machine.

### 6.3 Domains: registered (primary operatorverified.org)

REGISTERED Oct 25, 2026 (Nic's go, Cloudflare Registrar API,
verified in his account; PORTFOLIO.md T2 carries the full
record): operatorverified.com, operatorverified.org,
operator-verified.com, operator-verified.org. Auto-renew on;
all expire 2027-10-26; $37.92 year one, $43.32/yr steady state.
The .io pair was deliberately not bought. No niclydon.io
subdomain is part of this property's plan; Revision 1's
candidate list (including the retired-name subdomain) is closed.

- Primary / canonical: `https://operatorverified.org/`. Every
  link the program publishes, every OG URL, the devlog feed, and
  each repo's website field use this host and no other.
- Redirects: operatorverified.com and both hyphenated spellings
  redirect to the canonical .org, path-preserving. The
  hyphenated pair are defensive spellings; they are never
  linked, printed, or put on artwork.
- Subdomains: none at v1. If a tool surface ever needs one (a
  badge service endpoint is the plausible case), it is proposed
  through the coordinator as its own decision; the design
  assumes `operatorverified.org` paths only.
- DNS and domain configuration are launch steps. Registrar DNS
  lives at Cloudflare; pointing it at Vercel happens only when
  the coordinator brings deployment to Nic. Until then the
  domains resolve as registered-and-parked, and no page copy
  links the bare domain as if a site were live.
- The choice and the prices are recorded as ruling facts in
  `facts.json`, so a later change (buying the .io pair, moving
  the primary to .com) is visible history, not a silent edit.

Analytics: v1 ships with no third-party analytics and no
cookies beyond the mode preference in local storage. If Nic
later wants counts, the privacy-preserving option already in
the estate's orbit (the host's built-in anonymized metrics) is
the ceiling, and adding it is a dated site change with a
snapshot, not a silent tag. The About page's privacy wording
(§2.6) must match whatever is actually true at launch.

---

## 7. Privacy pass

Checked against the portfolio boundary (public zone / private
zone / gates) and the badge privacy rule. Every page type, every
asset class.

### 7.1 Page-by-page check

- Program home: public-zone material only (program description,
  dated registry fact, claim-limit cards, wave map, project
  cards, devlog teasers). Risks watched: the gap section's
  registry count must carry its check date (a stale "only five"
  is a false claim, not a privacy breach, and is handled by the
  facts layer); the wave map must not name internal chats,
  seats, hostnames, or the internal digest's contents; hero and
  OG art contain no text and no identifiers (verified for batch
  1 at creation). PASS with those controls.
- Project index: states and dates from `facts.json` only. No
  workstream appears with more detail than its own public repo
  or spec carries. PASS.
- Project page, Fiador: content condensed from the
  already-public repo; the pre-publication scan for that repo
  already covered this material. Site-specific risks: specimen
  badges are static files (they claim nothing; captions say so);
  the evidence block uses truncated forms only; no link on the
  page points at an internal system. PASS.
- Project stub pages (future): each is gated on its workstream
  producing public material and passes this same check at the
  time, recorded in that workstream's narrative. NOT PASSED IN
  ADVANCE; the template (§2.2) is the checklist.
- Resources: outbound links to publisher material only. No
  embedded third-party widgets, no World logo files hosted, no
  screenshots of developer-portal or wallet screens (a common
  leak path for account identifiers). Link captions are
  descriptive and carry no endorsement language. PASS.
- Devlog index and posts: the highest-risk surface, because it
  is prose written weekly under time pressure. Controls are the
  workflow itself (§4 steps 2 and 5): boundary pass before
  drafting, scan before publishing, Nic's approval of the exact
  text. Specific prohibitions for posts: no full humanId (hash
  only, and only when the hash is load-bearing); no wallet
  private material or seed material in any form; wallet addresses
  truncated (first 6 + last 4 at most) unless the address is a
  dedicated public demo address a workstream has explicitly
  designated for publication in its own repo; no Discord tokens,
  guild internals beyond what a demo strictly needs, or other
  members' names, messages, or data; no Nexus data, calendar,
  comms, or health content; no monetization, commercial-intent,
  pricing, or two-track discussion (§0.2); no homelab hostnames,
  IPs, tailnet
  details, internal URLs, or internal chat ids (including this
  program's own chat registry, which is internal coordination
  detail, not public material); no information about other
  people from Nic's private corpus, in any workstream's story.
  Screenshots and terminal output are treated as prose: scanned
  line by line, cropped or re-created with synthetic data when
  in doubt. PASS under the workflow controls; a post that cannot
  pass does not publish.
- Verify explainer: teaches the check from public material only.
  Its specimen panel is synthetic by construction (§2.3); it
  embeds no live attestation, no real application id, and no
  real hash. It links Fiador's tool surfaces rather than hosting
  a check, so it holds no visitor-supplied identifier to leak.
  PASS by construction, re-checked at the claim gate because it
  states the central claim.
- About: name stamp only, per §2.6. No biography, location,
  employer, or contact detail beyond the route Nic approves.
  PASS.
- `facts.json`, snapshots, feed: facts sources are cited by
  public ref (a public repo, a public docs URL, a portfolio
  ruling paraphrased without internal identifiers); internal
  source refs (file paths on estate machines, chat ids, SQL
  against private tables) are never valid `source.ref` values
  for this site's publishable facts — a fact whose only source
  is private is either re-sourced publicly or not published.
  Snapshots freeze only what the live page already showed.
  The feed carries the same approved text as the posts. PASS
  with the source-ref rule.
- Error and utility pages (404, etc.): no debug output, no
  path or host disclosure beyond the public domain. PASS by
  construction on a static host.

### 7.2 Asset and data rules (apply everywhere)

- Demo material: synthetic or redacted only. Example
  attestations, addresses, and Discord ids in any figure or
  code block on the site are generated for publication and
  labelled synthetic, following the Fiador repo's rule
  ("Demo material uses synthetic identifiers only").
- Images: batch-1 assets were created for publication and
  scanned at creation; any new image passes the same read
  (no embedded metadata carrying identifiers — strip EXIF on
  export; generated art carries its pipeline JSON in the
  workspace, which is not published).
- Code and config in the site repo: no secrets, no tokens, no
  internal hostnames in comments, examples, or deploy scripts;
  deploy tooling reads any credential from the operator's secret store
  by name at run time and never prints it, per the portfolio.
- Git history is a public surface: the pre-publication scan
  (§7.3) runs over the full history of the site repo before its
  first public push, exactly as it did for Fiador's founding, and
  the result is recorded in the launch narrative.

### 7.3 Pre-publication gates for this site

In order, all recorded:

1. Secret scan over the full tree and history (patterns for
   private keys, tokens, full human identifiers, personal data,
   internal infrastructure details), result recorded in the
   launch narrative in `docs/narrative/`.
2. Privacy read of README, all page copy, devlog post 1, and
   fixtures, by the coordinator, against §7.1.
3. Claim read: every identity claim on the home, Fiador, and
   /verify/ pages checked against the owning project's
   README wording; adversarial review before launch, per the
   portfolio quality bar, because the site makes identity claims.
4. Nic's approval of the launch text and of devlog post 1,
   through the coordinator. Repo creation / first push is his
   separate decision (§9); the domain and hosting are already
   decided (Revision 2), only their launch configuration waits.
5. Both-modes check (§5.3) and watchdog registration (§1.1,
   pattern 6) completed before the launch is announced anywhere.

No outward post (dev.to, Discord showcase, social) about the
site happens under this design; each is its own Nic approval
under the portfolio gates.

---

## 8. Build order (for the build arc, once Nic says go)

Design only here; this order is a proposal for the coordinator
to schedule, not an authorization. It is read under Revision 4
point 3 (ship order over polish order): steps 0-2 and the §7.3
gates are the deploy path; artwork finalization, the visual
pass, and every other held item in §10 are post-launch work
unless Nic directs otherwise, and any step that grows to delay
a first deploy after his go gets flagged to the coordinator
rather than silently extending the schedule:

0. Local build only (current authorization ceiling): scaffold
   in this workspace, placeholder mark slots per §5.2, checked
   locally in both modes. Nothing deploys.
1. Repo founding (docs-first commit, scan, Nic's go to go public).
2. Static scaffold: shared chrome, tokens both modes, home,
   project index, Fiador page, verify explainer, resources,
   about; facts layer wired; snapshot tooling configured; OV
   production assets dropped into their slots when the Visual
   Assets inventory lands and a direction is chosen.
3. Devlog machinery: index, post template, feed, draft folder
   excluded from deploys; post 1 drafted under §4.
4. Preview deploy for Nic's text approval (Vercel preview URL),
   both-modes screenshot check, adversarial review of
   identity-claim wording including the /verify/ page.
5. Production deploy on operatorverified.org (domain and
   redirect configuration as the launch step), watchdog checks
   added, launch snapshot cut with its note, `CHANGES.md` and
   narrative entries landed.
6. Syndication of post 1 (dev.to) after the site is verified
   live; the sibling showcases are linked from the footer per §2, and any reciprocal link from them is their own snapshot decision.

Out of scope for v1: any interactive verification tool, any
hosted badge service (W0/W1 own those), comments, newsletter
signup, analytics, search, i18n. Each would be its own design
note through the coordinator.

---

## 9. Decisions: settled, and still needed

Settled in Revision 2 (recorded here so the queue does not
re-ask them): hosting is Vercel (Nic's call); the domains are
registered with operatorverified.org primary (Nic's go,
executed); the umbrella label is Operator Verified with the
§0.1 claim discipline (Nic picked it; the formal USPTO search
remains outstanding and is the coordinator's record to close,
not a launch blocker this design imposes); the Discord project
is Fiador and links from the umbrella without being rebranded
by it.

Still needed, for the coordinator's queue, as single
questions in the order Nic should meet them:

- D4, Site repo: approve creating the dedicated public repo for
  this site (R1, §6.1), Apache-2.0, and pick its name:
  `operator-verified-site` (recommended, it reads as what it is
  and matches the hyphenated defensive spelling without
  depending on it) or `operatorverified-site`? Creation and
  first push remain his per-repo go even after the shape is
  approved.
- D5, Contact route for About: repos' issue trackers only
  (recommended for v1), or a named public contact of his choice?
- D6, Devlog syndication: dev.to with this site as canonical is
  already the portfolio's stated shape ("dev.to plus his own
  site"); the remaining choice is sequencing at launch: post 1
  goes to dev.to the same day the site launches (recommended,
  with the canonical link set), or after a short site-only
  window? Each post's text still needs his approval individually.
- D7, Watchdog: approve adding operatorverified.org to the
  the showcase watchdog daily checks at launch, on the
  same four-check pattern as the siblings, probing the canonical
  .org URLs? Recommendation: yes; a public site in this family
  that is not watched is an exception that should not exist.
- D8, OV visual direction: NOT this site's question to put, and
  listed only so the dependency is visible: the material
  direction (Revision 3) is Nic's, already given in the Visual
  Assets workstream; what this site waits on is that
  workstream's round-2 direction note in its INVENTORY.md and
  the production set that follows (OG, favicons, app icons,
  backgrounds) for §5.2's slots. This site's structure and
  content do not block on it; its final styling does, by design.

## 10. Open questions held for the build arc (not for Nic yet)

- Whether the coordinator's Monday digest can emit a
  machine-readable weekly material file for §4 step 1, or the
  Showcase workstream assembles it by reading the digest and the
  repos each week. Either works; the former is less error-prone.
- Whether the siblings ever link back here from their footers,
  and by what mechanism. Not a dependency of this site (see the
  §2 chrome note); if it happens, the siblings' hard contracts
  (no id or script changes on Nexus, no frozen-page touches on
  ARIA) govern it on their side.
- The visual pass (next revision): when the round-3 direction
  note lands in the Visual Assets INVENTORY.md, rewrite §5.1
  and the treatment
  rules in §5.2/§5.4 around the material language, reconcile
  slot sizes against the production table, and record the pass
  in the site repo's design note. Held here, not scheduled,
  because it depends entirely on that note landing.
- W2 gravity trigger (Revision 4 point 2): when W2 produces
  public material through the coordinator, re-weight the home
  04 / PROJECTS lead slot and the project index featured section
  to the approval record, present Fiador as the working demo,
  and add the /verify/ explainer's closing section on approval
  record vs attestation. A designed change with a snapshot, done
  in the same site arc that adds W2's project page, not before.
- W2/W3/W4 public-material timing: their specs are written, but
  which parts (if any) become public, and when, is each
  workstream's call through the coordinator. The project index
  copy must not pre-announce their specs as public documents.
- Exact light-mode token values for text-grade amber and gold
  (§5.1 names the badge generator as source of truth): to be
  lifted from `generate_badges.py` at build time and recorded in
  the site repo's design note, with contrast checks, rather than
  invented in this document.
