# The standing path's first publication — 2026-11-09

Until November 9, 2026, every approval in this program had been
carried by hand: a person approved a text in one place, an agent
published it in another, and the connection between the two existed
only in the record the lanes kept between themselves. The gate-1
note of October 28 ("Six wallets, one human") ran that way, and so
did devlog post 2 on November 2. The standing path — a Visto
approval of the exact publication payload before anything executes,
and a Signet seal carrying that approval after — had been designed
to replace the hand-carrying, and on November 9 it carried a real
publication end to end for the first time: devlog post 3, in both
editions, under a single approval record.

## Where the path stood on November 2

Post 2's publication is the baseline this work replaced. The
approval was real (the operator approved the exact text on
November 1) but it lived in a chat, and the publication pass ran on
that say-so: a one-shot scheduled job re-checked the numbers,
published the site page from a clean worktree (commit `2c37b82`),
flipped the dev.to draft public, and reported the result. Nothing
in the published artifact pointed at an approval, and nothing in
the approval pointed at the artifact, except the lanes' own notes.

Three pieces of the standing path were unfinished that day:

- The seal side could not yet carry an approval. Signet's
  `createSeal` accepted content and a signer, nothing else.
- The public confirmation endpoint, `/api/approval-confirm`, was
  wired into the verify page by site PR #24 (`e5fe606`) the same
  day, but it answered `not-rechecked` for every record, because
  the re-confirmation route it was designed against had been ruled
  out (below).
- The approver enrolment on the Visto service dated from the
  gate-1 ramp (October 28) and had never been exercised against
  the finished service.

## The seal half and the confirmation endpoint

Signet PR #1 (`f80083b`, November 2) taught `createSeal` to accept
a validated approval claim alongside the content: a new module
(`src/visto-approval.js`) checks the record hash under RFC 8785
canonicalization and the issuer's signature against a pinned trust
entry, and the resulting seal embeds the approval it validated.
The suite stood at 80 of 80 after the change. A seal-time helper
(`~/w3-sealing/approval.mjs`, held by the sealing lane) fetches and
validates the claim at seal time, so the sealing lane never has to
trust a hash it was handed in a message.

The confirmation endpoint's route in is documented in
`docs/narrative/2026-11-06-approval-confirm-projections.md` and is
not repeated here. The short version: no inbound path to the
tailnet-only approval service would be opened for public reads, so
the service pushes signed projections out to a public Blob store
instead, and site PR #25 (`0e09b8f`, November 6) pointed the
endpoint at them, with a ten-minute freshness bound on the
projection's `as_of`, a canary check against the gate-1 record, and
a kill switch (`VISTO_PROJECTION_BASE=off`) back to
not-rechecked. The issuer is `https://approvals.niclydon.io`, key
`visto-service-1`.

## The approver problem was a phone

The rehearsal failures of November 5 (runs 0002 and 0003) were
initially read as service faults. They were not. The enrolment
singleton on the service still held the approval session created
on October 28, and that session lived on the operator's previous
phone; the operator had moved to a new phone on November 4. Two
aggravating factors hid the cause: the MCP client driving the
approval polls kills a call at sixty seconds, so long approval
waits died silently and looked like the approver's silence, and
run 0004, which was approved cleanly, lost its driver before the
record was reserved and had to be reconciled as abandoned. Run
0005 expired unapproved.

The repair, on November 7, had three parts. The pinned approver
value for the confirmation path was set to the hash of the
approver's human identifier as derived estate-side through the
sealing wallet (`VISTO_APPROVER_HUMAN_ID_HASH`,
sha256:7bf4573c…; the raw identifier was resolved in-process only
and never printed). The stale enrolment singleton was deleted —
the service has no enrolment-replacement flow, deliberately — and
a fresh enrolment was taken from the operator's current phone at
16:10 ET. With those two changes the same flow that had failed for
two days settled a proof in about ninety seconds.

## The dress rehearsal and the defect it caught

Run 0006, the dress rehearsal of November 7, produced record
sha256:983fdaac…, reserved and consumed, with the public
projection confirming valid. It also produced the run's most
valuable finding: the execute step could not complete from the
agent surface alone. The executor recomputes the action hash over
the service's canonical stored payload, and that payload carries
service-owned fields (`created_for`, `action_class`,
`schema_version`, `requesting_agent`) which the requesting agent
never submits and, at the time, could not read back. The
rehearsal's execute leg was finished with the payload fetched from
the principal view — an operator-held step in a path whose entire
point is that no step is operator-held. The fix (Visto PR #13,
deployed November 8) lets the executor resolve the payload from
the service read, and the November 9 run below is its first real
use: the reserve and execute completed agent-only.

The rehearsal relay was torn down afterward. One piece of debris
remains on the record: an empty, unconnected Blob store
(`visto-record-projections`) from an early wiring attempt, which
no connector available to the estate can delete; it waits on a
dashboard action at leisure.

## Writing post 3 against the path's own deadline

Post 3, "The standing path: approved before, sealed after," was
drafted on November 8, the day the execute fix deployed; nothing
about it could be staged before the path it describes existed.
Its facts were re-read live that day: the public seal index stood
at 7 records; the npm versions it cites (`@fiador/verify` 0.3.1,
`@fiador/verify-mcp` 0.2.1) were unchanged; the three AgentBook
registry submissions (pull requests #3, #4, #5 against the
upstream registry) were still open, and the post says so rather
than implying a listing; both prior approval records (gate-1 and
the rehearsal) confirmed valid and consumed through the public
endpoint. The dev.to edition was staged the same day as an
unpublished draft (article 4999584) with its canonical URL set to
the site page.

The operator approved the exact text on November 9 at 10:16 ET.
The approved body — 7,532 characters of markdown — was frozen at
that moment; its sha256 is
c8126d47aef5feeda41354a90a94f3910b0f5b7404507072ce7465de4542306e,
recorded so that any later drift is a detectable event rather than
an editing accident. The approval the Visto request binds is over
that payload: an edit after approval changes the hash, and
execution against a changed payload refuses.

## The first window expired; the second did not

The first Tier 2 request (d97fb8b2) was raised within minutes of
the text approval, with the approval relay live. Its window
closed at 10:50 ET unproven. Nothing was reserved and nothing was
published; the path's answer to an unproven window is to stop,
which it did. The W2 lane re-raised the request over the identical
payload (hash re-verified in the create step) as request
e47fbcd5, window to 12:39 ET.

The operator's proof landed at 12:14 ET (approved_at
2026-11-09T17:14:29Z, performed tier 2, proof kind
uniqueness_per_action). Record
sha256:fd662a4a7c5bcf70d99f060f1f678432596caf8023f2f34f33b5db9a48903917
was reserved and consumed agent-only, the payload resolved from
the service read. Before shipping anything, the publication lane
read the record back through the public confirmation endpoint:
`{"status":"valid","consumed":true}`. That read is the moment the
two halves met in public: the same endpoint any reader can call
confirmed the approval that the publication was about to cite.

## Publication mechanics

The site side had been prepared the same morning as the text
approval, in the pattern post 2 established: the approved body was
ingested into the site builder as a new post page
(`devlog/2026-11-09-standing-path/`), a card was added to the
devlog index, and five facts entries were staged for `facts.json`
(the seal count, the standing path's state, the AgentBook
submission status, and the two prior approval records). A
ship-flavor build (no preview ribbon, post status published)
diffed against the live devlog index with the new card as the only
content change.

Publication ran from a clean detached worktree at origin/main —
never from the shared Furnace checkout, which still carries
another lane's in-flight restructure — as commit `435131d`. The
facts file was merged surgically rather than overwritten, so the
fleet lane's entries survived, as in every publication since
post 2. The deployment was verified on the live page rather than
inferred from the push.

The dev.to edition followed: its cover was set (next section), and
publication flipped only the front-matter `published` flag on the
staged draft — no wording changed — producing
https://dev.to/niclydon/the-standing-path-approved-before-sealed-after-5d5d
at 2026-11-09T17:17:45Z. The outcome (both URLs, the record hash)
was reported to the W2 lane, which closes the approval record
against it.

## The overwrite incident, and the rule it produced

The publication commit's diff was wider than the post it shipped,
and reading it before reporting caught a regression this lane
caused. The builder's output sync had overwritten five files that
other lanes have advanced beyond the builder since October:

- `devlog/2026-10-26-founding/index.html` and
  `devlog/2026-11-02-shipping/index.html` each lost the Signet
  live seal-badge block the sealing lane added when it sealed
  them (29 lines each).
- `verify/index.html` reverted to the builder's older copy; the
  current wording (merged as `a0c2eb9`, recorded in CHANGES.md on
  October 27) was replaced by the text it superseded.
- `assets/verify-client.js` reverted to the builder's stale
  bundle copy.
- `snapshots/index.html` lost a lane-added snapshot card and
  reverted its introduction copy.

All five were restored byte-for-byte from the pre-ship commit in
commit `305cbcd`, and the restorations were verified live (badge
blocks present in the served pages, current verify copy serving)
before the dev.to edition was flipped public. Net lasting change
from the publication: the post page, its index card, the facts
entries, and one cover asset.

The cause is structural, and it is the same one this repository
has met before in milder form: the builder is a snapshot
generator, while the repository is now edited directly by several
lanes between builds, so any file a lane owns will silently be
newer in the repository than in the builder. Post 2's publication
did not hit this because the badge blocks and the verify rewrite
landed after it. The rule adopted, recorded here so it binds the
next publication: build-output syncs exclude, permanently, every
published devlog post directory, `verify/index.html`,
`assets/verify-client.js`, and `snapshots/index.html`. Those
surfaces are lane-owned; the builder's copies of them are stale
by definition. A future reconciliation that wants them back under
the builder must port the lanes' changes into the builder first
and prove the port with a no-op diff.

## The cover decision

The operator asked, mid-run, whether the dev.to editions were
getting cover and inline images in his usual dev.to style. They
were not, and the check that followed is worth keeping: post 1's
dev.to edition carries a cover and an inline image (both hosted
under this site's `assets/`), his other recent dev.to articles
carry covers and one to two inline images each, and post 2's
edition had gone out with neither — a style regression introduced
by this lane's staging, not a dev.to limitation.

His ruling: covers on post 3 and retroactively on post 2; inline
images return as a drafting standard from post 4 onward. Post 3
could not take inline images in any case: they live inside the
body, the body was the frozen approved payload, and adding them
would have changed the hash the approval binds. The cover is
article metadata, outside the body and outside the seal, so it
could be added without touching anything approved or sealed.

Both covers were generated in the production plate family (dark
brushed steel, the gold O and steel-blue V as separate
letterforms, the engraved microline) at 2000 by 840, matching the
founding cover, and are hosted on this site:
`assets/devlog-shipping-cover.png` (an etched anchor and a seal
impression joined by a dotted route line) and
`assets/devlog-standing-path-cover.png` (an engraved receipt with
blank lines and a single check mark, beside a seal impression).
The first generation of the post 3 cover was rejected before use:
its checklist carried wording ("identity match," "biometric
confirm") that overstates the program's one claim, which is
verification as a unique human; the regenerated cover is symbolic
only. Post 2's cover shipped as commit `0597c20` and was set on
its article the same morning; the article's body was verified
byte-identical to its sealed form afterward (sha256 b9c9f20c…),
so the retrofit did not disturb the seal.

The dev.to mechanics, for the next lane that needs them: the
legacy image-upload endpoint (`POST /api/image_uploads`) is gone
(404). The working route is the article update's `main_image`
field set to a URL hosted here; dev.to then proxies it through its
own image CDN, which is why cover URLs read back as `media2.dev.to`
wrappers. Assignment is asynchronous — dev.to fetches and
validates the image after the update returns — so an immediate
read-back can show no cover while the assignment is in flight;
verify after a wait. Drafts are invisible to the public by-id
read (404); read them through `/api/articles/me/unpublished`.

## What is still open

- The sealing lane seals both post 3 editions with the approval
  embedded in each seal — the first seals to carry one. The
  public index stands at 7 records until then.
- Inline images join the devlog drafting standard from post 4;
  they must be designed into the draft before approval, because
  after approval the body is frozen.
- The program-level record of this arc (the internal design
  document's next section) is deliberately not part of this
  commit; it lands with the program record's own pass.
- The first live proof on `/verify/` is still outstanding. It was
  outstanding before this arc and remains the operator's step:
  a proof is a person proving.

See `CHANGES.md` for the chronological diff summary.

> Executed by Nova, the Showcase lane seat (model: Muse Wonder), 2026-11-09.
