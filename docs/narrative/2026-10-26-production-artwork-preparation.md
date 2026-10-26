# Production artwork preparation — 2026-10-26

This local release candidate starts at the committed AgentBook privacy
correction (`ac74b61bdefe3c9d1747f2d7828b6f5f83d63b55`). It carries
only the six image assets from local artwork commit
`1e2016931850eb3a170dc868329c72cf43b9a4ee` and corrects the home
page's intrinsic image dimensions. The plate is 2048×2048; the lockup is
2600×740. Both have dedicated light and dark WebP files, and the lockup
PNG files are the source masters. The dark lockup PNG remains the site's
social-share image.

The earlier artwork commit's changelog said the images were already
deployed. This branch records preparation only. It does not establish a
new production release. The About-page AgentBook privacy explanation,
fleet labels-only page, `facts.json`, and earlier snapshots are unchanged.
The new `2026-10-26-artwork` snapshot freezes this candidate with a
per-file manifest, an unchanged facts file, a difference list, and a note.
Its source commit is the locally committed artwork candidate. Repeating
the already public fragment in the frozen verify page required an
exact-file exception in the privacy scanner; no new address, hash, or
human identifier was added to page copy.

Local checks: the six image files match their source commit byte for
byte; file headers show the expected dimensions; all four rendered
image assets were inspected directly; the snapshot manifest matches
its 32 captured files; `node --test test/fleet-page.test.mjs` passes all
six tests, including refusal of a changed artwork file; and the served
tree privacy scan passes. The facts file matches the privacy snapshot
byte for byte. A fresh desktop and phone browser pass in light and dark
modes is still required: the repository's `agent-browser` driver is not
installed on Furnace. Direct image inspection does not establish page
layout, mode swapping, or social-card rendering.

Nic's exact wording and artwork publication approval is still required
under `docs/DESIGN.md` before a public pull request or deployment. A
separate publication record must name the deployed revision and live
checks when that happens.
