# AgentBook privacy correction publication — 2026-10-26

Nic approved production publication of the reviewed AgentBook privacy
correction. Pull request #3 merged as site commit
`5abbf323e8e09bcef56d679be45fe637faf75f2b`. The Vercel production
deployment for that commit reached READY.

At about 23:22 UTC, public requests to the About page, snapshot history,
privacy snapshot manifest, and Fleet page all returned HTTP 200. The
responses matched the reviewed source bytes. This verifies the observed
pages at that time. It does not redo the fleet's earlier build-time chain
check or remove linkability from public AgentBook registration events.

The privacy snapshot remains frozen with its preparation provenance.
This later record documents the production release without editing that
historical snapshot.
