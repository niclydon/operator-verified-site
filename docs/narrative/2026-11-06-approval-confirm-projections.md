# Approval confirmation reads the published projections — 2026-11-06

The `/api/approval-confirm` endpoint went live on November 2 with
the verify page wired to it, but it could not confirm anything: it
was built to proxy the Visto approval service's re-confirmation
route, the service is tailnet-only by design, and the endpoint
answered `not-rechecked` for every record. That is the honest
degraded state the seal specification allows (an approval claimed
in a seal, not re-checked at read time), but it left the public
half of the approval story permanently unproven.

The route in was ruled out on November 2: no tunnel or other
inbound path to the approval service would be opened for public
reads, on attack-surface grounds, and the service's hostname
remains an issuer identity, never a read address. The approval
service was redesigned to push copies out instead. On November 5
its projector began publishing one signed object per record to a
public Vercel Blob store (`records/<bare-hex>.json` on the
`visto-projections` store), reconciled every 60 seconds, each
object carrying the signed record, its confirmation state, an
`as_of` timestamp, and the issuer's Ed25519 signature over the
canonical form of the confirmation contents.

This change points the endpoint at those projections. It fetches
the object for the requested proof hash, verifies the envelope
signature against the pinned issuer key (`visto-service-1`, the
same key the records themselves are signed under) with the
requested hash bound into the signed contents, and only then
reports `valid` or `revoked`. A store 404 reports `unknown`. A
store failure, a malformed object, or a signature that does not
verify reports 502 `unreachable`, which the verify page renders
as not re-checked at this time: never a pass, never a rejection.
The reported `checked_at` is the projection's `as_of`, the moment
the service last attested the state, not the moment of the read.
An adversarial review (two lenses, cryptographic and
operational) was folded in before merge. Its findings: a
freshness bound (a projection older than ten minutes, against a
60-second reconcile cycle, fails closed as unreachable instead
of confirming stale state after a revocation); a canary object
(the gate-1 record's own projection) that a 404 is checked
against, so a dead or wrong store reads as an outage instead of
an empty one (verified live against the orphaned first store,
which fails closed); a configuration kill switch returning the
endpoint to not-rechecked; reason-coded logging on every
failure path; redirect refusal and a body-size cap on the store
read; and an explicit statement of the semantics contract in
the endpoint header: `valid` means issued and not revoked, in
the service's own re-confirmation terms, with expiry and
consumption reported as fields because they gate execution, not
confirmation. The header also records that the projection's
carried record object is not authenticated by this endpoint and
nothing is read from it. The signature core itself survived
both lenses unbroken: the canonical form is exact for this
value domain, and a confirmation cannot be transplanted between
records.

Local proof before deployment, against the live store: the
gate-1 publish record (`84e45296…36bf`, approved October 28)
confirms `valid` with `consumed: true`; an all-zero hash confirms
`unknown`; a malformed hash is refused 400; and two forged
objects (a flipped `consumed` flag and a forged `revoked` status,
both unsigned-by-the-issuer) fail closed at 502 instead of
confirming or rejecting anything.

What this does not do: the endpoint returns confirmation state
only, never the record itself, and it creates, reserves, and
modifies nothing. The first seal that can carry a live-confirmed
approval is still a future publication: an approval obtained
before publication through the standing publish path, sealed
after, in that order.

See `CHANGES.md` for the chronological diff summary.
