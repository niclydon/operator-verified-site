# AgentBook privacy correction — 2026-10-26

The launch About page said public material carried only a hash of the
human identifier. That described what our pages printed, but it left a
misleading impression of privacy. AgentBook registration events are
public on World Chain. A wallet address or published human hash can be
matched to those events, exposing the identifier and other wallets
registered to it. The labels-only fleet page limits what this site adds;
it cannot make earlier on-chain registrations unlinkable.

The current About page and README now state this plainly. Revision 5 of
the public design records the same limit. No fleet roster, full wallet
address, human identifier, or comparison hash was added. Fiador's
published hash and the program-wallet fragment in the frozen launch
snapshot are existing disclosures, not erased by this correction.
Historical snapshots remain byte-for-byte unchanged.

The `2026-10-26-privacy-correction` snapshot was prepared as an append-only
copy of the corrected site, with its facts file, a file-hash
manifest, and a generated list of differences from the fleet snapshot.
It does not represent a fresh AgentBook lookup. The fleet facts retain
their October 26 build-time check and the same private-roster limit.

At preparation time this correction was local only. The exact public
wording required the operator's approval before a public pull request
or deployment. A separate publication record should state the deployed
revision and live check.
