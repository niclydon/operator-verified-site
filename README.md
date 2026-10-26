# Operator Verified — site and devlog

The public website and devlog for Operator Verified, an independent
open-source program building small pieces of trust infrastructure for
the agent era: ways to check that the operator behind an agent was
verified as a unique human.

Operator Verified is the program's umbrella — this site and its
weekly log — not a brand stamped on each project. Each project
carries its own name and repository:

- **Fiador** — human-backed attestation for Discord bots.
  Spec, badges, and the verify package live in
  [github.com/niclydon/fiador](https://github.com/niclydon/fiador).
- A **presence approval inbox** and a **provenance seal** are in
  design; their pages appear here when they produce public material.
- The **callback-verified executive assistant** has a written design
  but is parked; no build is underway.

## The claim, stated exactly

A proof in this program establishes that the operator was
**verified as a unique human**. It does not prove the human wrote
any particular message, endorses any particular output, or controls
the agent at this moment. It is not identity verification: it
establishes that a unique human backs the operator, never who that
human is.

Public material from this program carries a hash of the human
identifier only — never the identifier itself.

## This program has no token

Nothing here is for sale as a token, no token is planned, and
anything offered under these names as a token is not ours.

## This repository

A static site (plain HTML/CSS, no build framework, no analytics,
no cookies beyond a light/dark preference stored on the reader's
own device), live at [operatorverified.org](https://operatorverified.org/)
and deployed on Vercel. Numbers on the site render from
`facts.json`; each fact carries its source and the date it was
verified. Frozen copies of the site at each launch state live under
`snapshots/` on the site itself, starting at launch.

The `/fleet/` page reports build-time AgentBook checks by fleet label.
Its roster and comparison hash are private, so the exact lookup cannot
be reproduced from the published site. The dated page describes which
RPC sources were used and what each result means.

- Design record: `docs/DESIGN.md`
- Founding narrative: `docs/narrative/2026-10-25-founding-and-first-build.md`
- Changelog: `CHANGES.md`

## Independence

Operator Verified is an independent project by Nic Lydon. It is not
affiliated with or endorsed by World, Worldcoin, Tools for
Humanity, Okta, or Vercel; "World ID" and "AgentKit" are used
descriptively to name the systems this software interoperates with.

## Licence

Copyright 2026 Nic Lydon. Apache-2.0 — see `LICENSE` and `NOTICE`.

Created by Nic Lydon.
