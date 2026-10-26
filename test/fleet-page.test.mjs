import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { assertSiteFleetCopy, renderProofClaim, replaceRegion, scanServedTree } from '../scripts/fleet-check.mjs'

const page = await readFile(fileURLToPath(new URL('../fleet/index.html', import.meta.url)), 'utf8')
const approved = [
  { id: 'program', label: 'Program wallet', role: 'The program wallet.' },
  { id: 'nova', label: 'Nova', role: 'The Nova fleet agent.' },
  { id: 'aria', label: 'ARIA', role: 'The ARIA fleet agent.' },
  { id: 'cole', label: 'Cole', role: 'The Cole fleet agent.' },
]

test('the fixed four-wallet copy refuses a missing, renamed, or extra roster entry', () => {
  assert.doesNotThrow(() => assertSiteFleetCopy(approved))
  for (const candidate of [
    approved.slice(0, 3),
    approved.map((wallet, index) => index === 2 ? { ...wallet, label: 'Other' } : wallet),
    [...approved, { id: 'other', label: 'Other', role: 'Other.' }],
  ]) {
    assert.throws(() => assertSiteFleetCopy(candidate), /approved four-wallet page copy/)
  }
})

test('a degraded build removes the all-four positive claim and retains its caveats', () => {
  const green = approved.map(() => ({ status: 'verified' }))
  const degraded = green.map((result, index) => index === 2 ? { status: 'unknown' } : result)
  const greenPage = replaceRegion(page, 'proof-claim', renderProofClaim(green))
  const degradedPage = replaceRegion(page, 'proof-claim', renderProofClaim(degraded))
  assert.match(greenPage, /This check says that four wallets/)
  assert.doesNotMatch(degradedPage, /This check says that four wallets/)
  assert.match(degradedPage, /AgentBook registration alone does not/)
})

test('the fleet heading and cards remain one build-time HTML snapshot', () => {
  assert.doesNotMatch(page, /fetch\(/)
  assert.doesNotMatch(page, /data-fact="fleet\.summary"/)
})

test('a changed captured page is refused even if the manifest itself still parses', async () => {
  const site = await mkdtemp(path.join(tmpdir(), 'ov-fleet-snapshot-'))
  try {
    await mkdir(path.join(site, 'snapshots'))
    const snapshot = path.join(site, 'snapshots', '2026-10-26-fleet')
    await cp(fileURLToPath(new URL('../snapshots/2026-10-26-fleet/', import.meta.url)), snapshot, { recursive: true })
    const privacySnapshot = path.join(site, 'snapshots', '2026-10-26-privacy-correction')
    await cp(fileURLToPath(new URL('../snapshots/2026-10-26-privacy-correction/', import.meta.url)), privacySnapshot, { recursive: true })
    const artworkSnapshot = path.join(site, 'snapshots', '2026-10-26-artwork')
    await cp(fileURLToPath(new URL('../snapshots/2026-10-26-artwork/', import.meta.url)), artworkSnapshot, { recursive: true })
    assert.equal(await scanServedTree(site, [], []), null)
    const capturedPage = path.join(snapshot, 'fleet', 'index.html')
    await writeFile(capturedPage, (await readFile(capturedPage, 'utf8')) + '\n')
    assert.equal(await scanServedTree(site, [], []), '2026-10-26-fleet snapshot file changed')
  } finally {
    await rm(site, { recursive: true, force: true })
  }
})

test('a changed privacy-correction snapshot is refused', async () => {
  const site = await mkdtemp(path.join(tmpdir(), 'ov-privacy-snapshot-'))
  try {
    await mkdir(path.join(site, 'snapshots'))
    for (const name of ['2026-10-26-fleet', '2026-10-26-privacy-correction', '2026-10-26-artwork']) {
      await cp(fileURLToPath(new URL(`../snapshots/${name}/`, import.meta.url)),
        path.join(site, 'snapshots', name), { recursive: true })
    }
    assert.equal(await scanServedTree(site, [], []), null)
    const capturedPage = path.join(site, 'snapshots', '2026-10-26-privacy-correction', 'about', 'index.html')
    await writeFile(capturedPage, (await readFile(capturedPage, 'utf8')) + '\n')
    assert.equal(await scanServedTree(site, [], []), '2026-10-26-privacy-correction snapshot file changed')
  } finally {
    await rm(site, { recursive: true, force: true })
  }
})

test('a changed production artwork snapshot is refused', async () => {
  const site = await mkdtemp(path.join(tmpdir(), 'ov-artwork-snapshot-'))
  try {
    await mkdir(path.join(site, 'snapshots'))
    for (const name of ['2026-10-26-fleet', '2026-10-26-privacy-correction', '2026-10-26-artwork']) {
      await cp(fileURLToPath(new URL(`../snapshots/${name}/`, import.meta.url)),
        path.join(site, 'snapshots', name), { recursive: true })
    }
    assert.equal(await scanServedTree(site, [], []), null)
    const capturedArt = path.join(site, 'snapshots', '2026-10-26-artwork', 'assets', 'lead-lockup-dark.webp')
    await writeFile(capturedArt, Buffer.concat([await readFile(capturedArt), Buffer.from([0])]))
    assert.equal(await scanServedTree(site, [], []), '2026-10-26-artwork snapshot file changed')
  } finally {
    await rm(site, { recursive: true, force: true })
  }
})
