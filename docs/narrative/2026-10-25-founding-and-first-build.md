# Founding and first build of the Operator Verified site

The World Program was founded on October 25, 2026 with a public
record as part of the point: nine workstreams in three waves,
building in the open, with a quality bar that treats dated
verification evidence as the substance and everything else as
scaffolding. That posture needed a home — a site that is itself
built the way the program claims to build, and a devlog whose
posts are drafted from verified material and published only with
the author's approval. This narrative records how the site was
designed, how its identity survived three rounds of visual
redirect, and what its first build contains. It also records,
plainly, what has not happened yet: at the time of writing the
production domain is not attached and the site is not announced
anywhere. What shipped in this arc is the repository, the design
record, and a preview deployment that serves as the author's
approval surface.

## Why a separate property

The operator already publishes three showcase pages under
www.niclydon.io (Nexus, ARIA, Gadgets). The World Program's site
was deliberately not made a fourth page there. The program is a
public effort with its own name, its own claim discipline, and
repos that link back to an umbrella; folding it under the
personal domain would have blurred exactly the line the program
draws between the person and the program. A dedicated public
repository (`operator-verified-site`) and a dedicated domain
(`operatorverified.org`, registered October 25, 2026 via
Cloudflare Registrar, with the hyphenated pair held defensively,
to redirect once DNS is configured) keep the boundary structural rather than
rhetorical. Hosting is Vercel, the operator's existing platform,
as its own project.

## The design pass

The design (docs/DESIGN.md in this repo, 1,700+ lines across five
revisions in one day) studied four bodies of prior work before
drawing anything: the sibling showcases and their Oct 15, 2026
design system and facts.json pattern; the program's whitespace
research report, which supplies the site's central dated fact
(the AgentBook registry linked from the official ecosystem page
listed exactly five services when checked live on October 25,
2026, and no public implementation was found for messaging
attestation, email trust, telephony, content provenance, or
agent-to-agent trust); the founding repository's documents, whose
claim wording the site is forbidden to soften or strengthen; and
mosvera.io, whose information architecture (promise, artifact,
three verbs, boundary stated on the page) the home page borrows
structurally.

Decisions that survived every revision:

- Every number on the site renders from `facts.json`, and each
  fact carries its source and verification date. Numbers are
  never hand-typed into copy.
- Claim discipline is a hard rule, not a style preference. The
  claim is always "verified as a unique human." The phrases
  "identity verified" and "verified identity" are banned
  everywhere, including alt text and social cards, because the
  proof establishes that a unique human backs the operator,
  never who that human is.
- The humanId rule: the full human identifier is never
  published anywhere in this program. Public material carries a
  hash of it only, plus a truncated wallet address where an
  address is needed.
- The devlog publishes nothing without the author's approval of
  the exact text. Drafts are visibly drafts.
- The commercial narrative rule: the site and devlog never
  discuss monetization, commercial intent, or any two-track
  model. The devlog narrates the public building only. The
  no-token statement is the single exception, and it is a trust
  position, not monetization talk: "This program has no token."
- The descriptor rule: project names never appear naked on
  first use. Fiador travels with "human-backed attestation for
  Discord bots"; Operator Verified travels with "verified as a
  unique human."

## The naming arc

The site began design under the founding project's first name.
Within hours, a clearance pass found HumanBacked
(humanbacked.com), an operating company selling verified-human
trust certification to enterprises — the same spoken name in an
adjacent market. The project was renamed the same night to
Fiador (Spanish/Portuguese: the guarantor who stands surety for
another), and the umbrella took the name Operator Verified, a
label chosen knowing it is slightly less literal than the claim
it carries; the claim sentence everywhere does the literal work.
Four clearance rounds covered domains (.com/.org/.io/.dev/.ai
unregistered at check time), npm, PyPI, and the GitHub
organization namespace. A formal USPTO search remains
outstanding and the design records the label as unverified until
it runs; nothing on the site presents the name as
trademark-cleared.

## Three rounds of visual direction

Round 1 was flat vector work in the house style: six monogram
concepts, three lockups, and a conflicts note that outlived the
round — the stacked overlapping OV arrangement is held by
Outdoor Voices (US Reg. 4831382) and ruled out; "OV" already
means Organization Validation in the certificate world, which is
precisely the claim this program must not make; no filled
blue/green seal (the most crowded mark in tech); no orb or globe
(World's own Human Badge territory).

Round 2 moved to material treatments — a brushed-steel
credential plate, liquid glass, an engraved seal, a monolith —
and was delivered in full before the operator redirected it:
"not bad," but he wanted real depth. Round 2's durable
contribution is the small-icon cores: separate, legible O and V
letterforms that survive at 16 pixels.

Round 3 built a real 3D scene (Blender, Cycles): a brushed-steel
plate mounted proud of a wall on spacer posts, Torx corner
screws, extruded letterforms casting real shadows, clearcoat
over the brushed metal for the liquid-glass depth. The lead,
picked by the operator and refined to his four corrections
(letters fill the plate, camera straight on, liquid-glass steel,
colour inside the guardrail), is the filled plate with the
overlaid OV: the O in metallic gold spanning most of the face,
the V in deep steel blue laid over it, and the microline
VERIFIED AS A UNIQUE HUMAN engraved along the base. The audit
that came with it is part of the identity, not a footnote: the
overlay fails at 16/32 pixels (the letters merge), so it is
hero-only forever, and small sizes use the round-2 separate-
letter cores. Light mode carries an honest caveat — the gold
flattens toward tan under the brighter key — recorded in the
design rather than corrected in CSS. The bright cyan family
(#00AFF0 and kin) is banned as a dominant accent across all
rounds, for resemblance reasons the inventory documents.

## The build

The first build is a static site: plain HTML and CSS, no build
framework, generated by a single builder script from the design's
page specifications, with facts.json alongside. Nine pages:
home (lockup and plate hero, the dated gap fact, the claim and
its limits, the wave map, projects, the log, three ways in);
project index; the Fiador page (proves / does not prove in the
repo's words, the evidence block keeping the private prototype
record and the dedicated program wallet's record separate);
a /verify/ explainer that teaches the check and performs none;
resources (official material only, linked descriptively);
devlog index and post 1, the latter included as a flagged draft
because it has not yet received the author's publication
approval; about (name stamp, the no-token paragraph, the
accuracy note, the extended independence disclaimer naming
World, Worldcoin, Tools for Humanity, Okta, and Vercel);
snapshots (empty until launch).

Mode behavior follows the design: system preference on first
visit, a persistent manual toggle after, mode-matched artwork
for every visual, and the small-icon core (never a downscaled
plate) in the top bar and favicon.

## Pre-publication gates, run for this arc

Per the design's §7.3, in order:

1. Secret and boundary scan over the full tree: patterns for
   private keys, tokens, full wallet addresses, full human
   identifiers, internal addresses and hostnames, personal
   data, internal chat identifiers, private filesystem paths,
   and embedded metadata in image binaries. The first pass
   (text patterns only) reported zero hits, and the adversarial
   review below then demonstrated that pass was incomplete:
   it had missed embedded PNG metadata, chat identifiers, and
   private paths inside the design record. Those findings were
   fixed (image metadata stripped at build time; the design
   record published as a redacted public edition) and the scan
   re-run over the corrected tree with the wider pattern set:
   zero hits. The re-review then caught the subtler failure:
   the fixes sat on top of a draft founding commit whose
   history still contained the unredacted material, and this
   repository had not yet been pushed — so it was re-founded
   as a single clean commit, and the scan run over the founding
   commit as a whole. That sequence (scan, review, fix,
   re-review, re-found) is the gate working as designed, and it
   is recorded rather than tidied away. The one deliberate exception class is the public
   sibling URLs (www.niclydon.io/nexus, /aria, /gadgets) linked
   from the footer as "More by Nic Lydon" — public pages,
   linked on purpose. The lesson is recorded in CHANGES.md:
   a scan that cannot see a class of content is not evidence
   about that class.
2. Privacy read of README and all page copy against the design's
   prohibitions: completed by the author workstream against the
   checklist (no full identifiers, no internal infrastructure
   detail, no other people's information, no commercial
   narrative).
3. Claim read: every identity claim on the home, Fiador, and
   /verify/ pages checked against the owning project's README
   wording; claim and descriptor rules verified mechanically
   (first body use of each name travels with its descriptor on
   every page). An adversarial review of the public surface —
   three independent lenses: claim accuracy, privacy/boundary,
   correctness — ran against the founding commit before the
   first push; it returned two blockers, nine majors, and a
   tail of minors and nits, every one triaged in CHANGES.md.
   The blockers and majors were fixed and the corrected tree
   re-reviewed on the privacy lens before the push.
4. Author approvals: the /ship invocation of October 25, 2026
   approved the commit, push, and preview deployment of this
   build. Approval of the exact launch text and of devlog post 1
   remains a separate, outstanding gate by the design's own
   terms, which is why this arc ends at a preview deployment.
5. Both-modes check: completed for structure, tokens, and
   artwork presence in the local build; a real-browser visual
   pass remains owed before announcement (headless Chrome was
   unavailable in the build environment, recorded here rather
   than smoothed over). Watchdog registration happens at launch,
   with the production domain.

## What is not done, stated plainly

The production domain (operatorverified.org) is not attached;
the deployed preview answers on its Vercel URL only. Devlog
post 1 is a draft and is published nowhere. No outward post
about the site exists; each remains its own approval. The
program wallet's AgentBook registration is prepared and not yet
executed, and the Fiador page says so in those words. The
2048px production rebuild of the plate renders, and the
light-mode tuning pass the audit recommends, are future arcs in
the visual workstream, not this one.

See `CHANGES.md` for the chronological diff summary.
