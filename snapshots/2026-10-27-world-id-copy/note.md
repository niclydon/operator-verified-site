# World ID check wording — 2026-10-27

Commit `a0c2eb9dc0bd60241da7307ae3090fd1ec2c0c00` published the
approved shorter `/verify/` explanation. Vercel reported the
production deployment READY. On October 27, the live page,
`assets/verify-client.js`, and `facts.json` returned HTTP 200 and
matched that commit byte for byte. No completed World App interaction
was tested.

This snapshot captures the release's public pages and assets alongside
this history entry. Its archived `/verify/` page adds a notice and
removes the button, QR code, and loader. The retained browser file is
not loaded there. The manifest records both page hashes. Fact values
and earlier snapshots are unchanged. The snapshot does not include
server function source.
