# Production verification guard record — 2026-10-27

The IDKit proof check was added to the site in commit `8452486` on
October 26. The site's signing key was later placed in its production
environment, and the check became enabled. Commit
`5a8b8557919bb52adb6541b014377d5560460db0` published server-side
checks that require an explicit successful proof-of-human result from
World and a matching proof type and nullifier. World may encode the
nullifier as hexadecimal or decimal; the guard compares its value. Its
production deployment reached READY.

Commit `b6a1e2ea9e5d933c3aeaff5bddb1ab8bf52d1daa` then published
the separately approved artwork record and its snapshot. That
deployment also reached READY. The artwork itself first went live in
commit `7532bc8` on October 26, before the AgentBook privacy correction
was separately published in commit `5abbf32`. The artwork record did
not roll out a second set of images.

After the second deployment, a public fetch of `/verify/` returned
HTTP 200 with bytes matching the current source. The status endpoint
reported that the check was enabled. A synthetic request with the wrong
credential was rejected before a call to World. Those observations and
the local handler tests support the narrower server-side behavior;
they do not establish that a completed World App proof has succeeded.
No such proof has been observed, and a valid submitted proof can be
replayed, so a positive response would not establish who is present
at the page. This check grants no account or access.

The new `2026-10-27-verify-guard` snapshot freezes pages and assets
served from the second deployment, alongside its new history entry.
Its archived verification page deliberately differs from the served
HTML: a direct-page warning labels the old claims as historical, and
the proof button and loader are removed. The original browser bundle
is retained but is not loaded by the archived page. The manifest
records both verification-page hashes and this intentional difference.
The snapshot does not archive the serverless function source.

The historical wording overstates the present-visitor inference and
says the full nullifier never left the proof. That wording is being
corrected in a separate change. The archive preserves the wording
without offering an outdated proof interaction, so a later correction
is visible in the history. The facts file's generation time advanced
from the artwork snapshot; its fact values did not change. Older
snapshots remain byte-for-byte intact.
