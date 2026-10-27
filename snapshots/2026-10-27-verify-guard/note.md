# Verification guard production state — 2026-10-27

The server-side World ID proof check was tightened in site commit
`5a8b855`, then the separately approved artwork record was published in
commit `b6a1e2e`. This snapshot captures pages and assets served from
the latter commit, alongside its new history entry. The artwork itself
first went live in `7532bc8` on October 26;
the AgentBook privacy correction was published separately in
`5abbf32`.

The production `/verify/` page matched this source on October 27, and
the guarded endpoint rejected a synthetic wrong-credential request.
No completed World App proof has been observed. Those checks do not
establish that the full phone flow succeeds or who submitted a valid
proof.

The archived verification page deliberately differs from the served
HTML: it adds a direct warning and removes the proof button and loader.
The original browser bundle remains in this snapshot but is not loaded
by the archived page. The manifest records both page hashes. The
historical wording overstates what the result establishes and says the
full nullifier never left the proof. A correction is being prepared as
a separate, visible change. The facts file only refreshed its
generation time; the fact values are unchanged from the artwork
snapshot. Earlier snapshots remain frozen.
