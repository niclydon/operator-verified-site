# The IDKit verify path — 2026-10-26

The site's Sign in with World ID build (OIDC against
auth.world.org) is complete on the site side and dark, gated on a
World-side developer-portal eligibility grant that has not landed.
On October 26 the operator asked whether any World ID
authentication was possible on the website without that account.
For the OIDC flow the answer is no, and the one apparent bypass
had already been investigated and ruled out in the program's IdP
research. But a different door exists: IDKit proof verification
through the older Developer Portal, where the program's team and
access already work — the same pattern the Fiador founding proof
and the Fathom gate ran that day. The operator directed the build.

What was built, in order:

1. Portal resources, created through the program's Developer
   Portal connector. A new app, "Operator Verified Site," with a
   managed World ID 4.0 relying party registered on-chain in
   production and staging. The RP signing key was captured at
   generation, inside the same Furnace-side run, directly into
   the secrets vault; it has never been printed. One action,
   "operator-verified-check," registered on production.
2. Site backend: three Vercel functions (status, context, check)
   over a shared library. The context function signs the RP
   context server side; the check function forwards a completed
   IDKit result unchanged to World's verify endpoint and returns
   World's verdict plus a truncated hash of the proof's
   nullifier as the visitor's receipt. All three stay dark until
   the signing key exists in the environment.
3. The page: /verify/ gained a "Check yourself" section that runs
   the proof-of-human check in the browser (QR code or World App
   link, lazy-loaded client bundle) and renders the verdict. The
   page's opening line was corrected: it no longer claims to
   perform no checks. The copy was approved by the operator
   before shipping.

Verification evidence: 18 of 18 local handler tests pass,
including the dark-state responses, the signing shape produced
with the real key, the validation mapping, and the portal
forwarding with a stubbed verdict. The built page was rendered
in a real browser at phone and desktop widths in both modes;
that pass caught and fixed a stylesheet defect (a button class
overriding the hidden attribute) before deploy.

State at the close of the arc: shipped and dark. Activation is
one operator step (place the signing key in the site's Vercel
environment), followed by the first live proof with his World
App. The OIDC sign-in remains staged behind World's grant,
untouched; if it lands, it arrives as its own change with its
own announcement.
