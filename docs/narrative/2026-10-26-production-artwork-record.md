# Production artwork record — 2026-10-26

The approved production artwork was committed directly to the site's main
branch as `7532bc8a692094a5ce8d67ad3ea75cb7a26d3039` on October 26,
before the AgentBook privacy correction. That commit changed six image files
and the home page's intrinsic image dimensions. The plate is 2048×2048 and
the lockup is 2600×740. Each has a light and dark WebP edition; the PNG
lockups are source masters, and the dark lockup PNG is the social-share image.

A production fetch later that day found the new home-page dimensions and
matched the light lockup WebP to the committed image. That check establishes
those observed production bytes, not a full production browser pass or a
social-card unfurl. Separately, a local Chromium check of the later
privacy-corrected site copy loaded the home page at desktop and phone widths
in light and dark modes without broken images, page errors, or horizontal
overflow. The About, Fleet, and snapshot-index pages also loaded at phone
width.

This branch follows the separately published AgentBook privacy correction. Its six
current image assets match the deployed artwork commit byte for byte, so it
does not roll out a second artwork set. The new `2026-10-26-artwork` snapshot
freezes the later privacy-corrected site copy, including those images,
an unchanged facts file, a per-file manifest, a difference list, and this
record's note. The privacy correction was not included in the earlier
artwork deployment. The corrected copy was published separately in site
commit `5abbf323e8e09bcef56d679be45fe637faf75f2b` and verified live.
Earlier snapshots remain frozen.

The snapshot and current site tree pass the local privacy scan, and
`node --test test/fleet-page.test.mjs` checks the captured files. These
checks do not establish a new production release for this record.
