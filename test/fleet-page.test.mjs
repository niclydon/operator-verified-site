import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
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
    const guardSnapshot = path.join(site, 'snapshots', '2026-10-27-verify-guard')
    await cp(fileURLToPath(new URL('../snapshots/2026-10-27-verify-guard/', import.meta.url)), guardSnapshot, { recursive: true })
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
    for (const name of ['2026-10-26-fleet', '2026-10-26-privacy-correction', '2026-10-26-artwork', '2026-10-27-verify-guard']) {
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
    for (const name of ['2026-10-26-fleet', '2026-10-26-privacy-correction', '2026-10-26-artwork', '2026-10-27-verify-guard']) {
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

test('a changed verification guard snapshot is refused', async () => {
  const site = await mkdtemp(path.join(tmpdir(), 'ov-guard-snapshot-'))
  try {
    await mkdir(path.join(site, 'snapshots'))
    for (const name of ['2026-10-26-fleet', '2026-10-26-privacy-correction', '2026-10-26-artwork', '2026-10-27-verify-guard']) {
      await cp(fileURLToPath(new URL(`../snapshots/${name}/`, import.meta.url)),
        path.join(site, 'snapshots', name), { recursive: true })
    }
    assert.equal(await scanServedTree(site, [], []), null)
    const capturedPage = path.join(site, 'snapshots', '2026-10-27-verify-guard', 'verify', 'index.html')
    await writeFile(capturedPage, (await readFile(capturedPage, 'utf8')) + '\n')
    assert.equal(await scanServedTree(site, [], []), '2026-10-27-verify-guard snapshot file changed')
  } finally {
    await rm(site, { recursive: true, force: true })
  }
})

test('the archived verification page cannot start a proof check', async () => {
  const snapshot = fileURLToPath(new URL('../snapshots/2026-10-27-verify-guard/', import.meta.url))
  const archived = await readFile(path.join(snapshot, 'verify', 'index.html'), 'utf8')
  const archivedBundle = await readFile(path.join(snapshot, 'assets', 'verify-client.js'))
  const manifest = JSON.parse(await readFile(path.join(snapshot, 'snapshot.json'), 'utf8'))
  const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
  // Reviewed production bytes from source commit b6a1e2e stay fixed when live copy changes.
  const sourcePageHash = '51bdfeb4a3f15ff62f7640fba07b058a8cafa2cff471ac683c91e7922ad9b337'
  const sourceBundleHash = 'c8c94a727f74a9b768d258f8384f72af5aa3b6879309a9729a81244e82efe0fe'
  assert.match(archived, /Archived page — proof check disabled/)
  assert.match(archived, /historical text below/)
  assert.doesNotMatch(archived, /\/api\/verify\/|ovc-start|verify-client\.js/)
  assert.equal(manifest.archival_view.source_sha256, sourcePageHash)
  assert.equal(manifest.archival_view.archived_sha256, sha256(archived))
  assert.notEqual(manifest.archival_view.source_sha256, manifest.archival_view.archived_sha256)
  assert.equal(sha256(archivedBundle), sourceBundleHash)
  assert.equal(manifest.files['assets/verify-client.js'], sourceBundleHash)
})

test('changed verification guard provenance is refused', async () => {
  const site = await mkdtemp(path.join(tmpdir(), 'ov-guard-provenance-'))
  try {
    await mkdir(path.join(site, 'snapshots'))
    for (const name of ['2026-10-26-fleet', '2026-10-26-privacy-correction', '2026-10-26-artwork', '2026-10-27-verify-guard']) {
      await cp(fileURLToPath(new URL(`../snapshots/${name}/`, import.meta.url)),
        path.join(site, 'snapshots', name), { recursive: true })
    }
    assert.equal(await scanServedTree(site, [], []), null)
    const manifestPath = path.join(site, 'snapshots', '2026-10-27-verify-guard', 'snapshot.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    manifest.source_commit = '0'.repeat(40)
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
    assert.equal(await scanServedTree(site, [], []), '2026-10-27-verify-guard snapshot provenance changed')
  } finally {
    await rm(site, { recursive: true, force: true })
  }
})
