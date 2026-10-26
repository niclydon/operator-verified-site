#!/usr/bin/env node
// scripts/fleet-check.mjs
//
// Build-time AgentBook check for the /fleet/ page of operatorverified.org.
//
// Reads a private roster outside the site tree, asks World Chain whether each
// wallet is registered in AgentBook, compares every registration against the
// operator's pinned human-hash, and writes the results into facts.json and
// into the marked regions of fleet/index.html.
//
// Zero dependencies: Node 20 or later (global fetch, node:crypto). The one
// chain read that decides a wallet's status is a single eth_call of
// AgentBook.lookupHuman(address). Keccak-256 is implemented below only so the
// script can checksum addresses and self-check its two ABI constants.
//
// Fails closed. A wallet whose check did not complete renders "not verified"
// with no check time. Nothing is cached between runs, so a failed build can
// never show an earlier green.
//
// THE HUMANID RULE. The raw value lookupHuman returns exists only in this
// process's memory for the length of one check. It is never logged and never
// written; every output is scanned for it before anything touches disk.
//
// Exit codes:
//   0  every wallet verified; outputs written
//   1  completed, at least one wallet not verified; outputs written (fail closed)
//   2  configuration error (roster, placeholder, draft copy, schema, missing
//      markers); nothing written
//   3  the self-scan refused the outputs (a raw value or a forbidden
//      identifier would have been written); nothing written
//
// Usage:
//   node scripts/fleet-check.mjs --roster PRIVATE_FILE [--site DIR] [--rpc URL --rpc URL]...
//        [--log-index URL|none] [--timeout-ms N] [--now ISO]
//        [--dry-run] [--bootstrap --bootstrap-output PRIVATE_FILE]
//        [--allow-draft] [--allow-degraded]
//        [--evidence NEW_PRIVATE_FILE]
// Evidence is create-only and stays outside the served site tree.
//
// Environment (flags win): FLEET_RPC_URLS (comma separated), FLEET_LOG_INDEX_URL.

import { readFile, readdir, realpath, rename, rm, writeFile } from 'node:fs/promises'
import { createHash, randomBytes } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// ---------------------------------------------------------------------------
// Facts this script rests on. Each was re-read on 2026-10-26; re-verify at
// every build arc (W0 SPEC section 2 treats them as dated facts).
// ---------------------------------------------------------------------------

// AgentBook on World Chain: canonical address from @worldcoin/agentkit-core
// 0.2.1 (AGENT_BOOK_ADDRESS) and from the verified source on the World Chain
// Blockscout explorer (contract AgentBook, verified 2026-03-22).
export const AGENTBOOK = '0xA23aB2712eA7BBa896930544C7d6636a96b944dA'
export const AGENTBOOK_DEPLOY_BLOCK = 27053063
export const CHAIN_ID_HEX = '0x1e0' // 480, CAIP-2 eip155:480
// keccak256("lookupHuman(address)")[0:4]; self-checked at start.
export const LOOKUP_SELECTOR = '0x451a02f4'
// keccak256("AgentRegistered(address,uint256)"); self-checked at start.
export const REGISTERED_TOPIC = '0xd1b844701695237443dd884ed7193d9c8788f3befd35adc0910472eb166f3306'
// The SDK's default public RPC for World Chain (viem chains.worldchain).
export const DEFAULT_RPC = 'https://worldchain-mainnet.g.alchemy.com/public'
export const DEFAULT_RPCS = [DEFAULT_RPC, 'https://worldchain-mainnet.gateway.tenderly.co']
// Public explorer log index, used ONLY as a pointer to the registration
// transaction; the transaction itself is always confirmed over RPC.
export const DEFAULT_LOG_INDEX = 'https://worldchain-mainnet.explorer.alchemy.com/api'
// Read at (lowest head across RPCs) minus this many blocks, so every RPC
// answers about the same block.
export const CONFIRMATIONS = 5
export const DEFAULT_TIMEOUT_MS = 5000

// The one program-wide human-hash (W0 SPEC 3.5, W1 DESIGN 3.3):
//   sha256( utf8( "w0-human-v1:" + humanId ) ), 64 lowercase hex.
// Input form: W1 DESIGN 3.3 states the canonical text form as the 0x-prefixed
// lowercase 64-hex string. @worldcoin/agentkit-core 0.2.1 returns
// viem toHex(uint256), which is NOT zero-padded. The two forms agree unless the
// humanId's top nibble is zero. HUMAN_ID_FORM selects the form; changing it is
// a program-level change (W0 SPEC 3.5) and goes through the coordinator.
export const HUMAN_HASH_DOMAIN = 'w0-human-v1:'
export const HUMAN_ID_FORM = 'padded64' // or 'sdk-unpadded'

const SCHEMA = 'ov-fleet-roster:v1'
const GUARD = /PLACEHOLDER|DRAFT:/
const SITE_FLEET_COPY = [
  ['program', 'Program wallet', 'The program wallet.'],
  ['nova', 'Nova', 'The Nova fleet agent.'],
  ['aria', 'ARIA', 'The ARIA fleet agent.'],
  ['cole', 'Cole', 'The Cole fleet agent.'],
]

// ---------------------------------------------------------------------------
// Keccak-256 (original Keccak padding, as Ethereum uses). Small and slow by
// design; it runs a few dozen times per build.
// ---------------------------------------------------------------------------

const MASK64 = (1n << 64n) - 1n
const KECCAK_RC = (() => {
  const rc = []
  let r = 1
  const bit = () => {
    const out = r & 1
    r = (r << 1) ^ (r & 0x80 ? 0x171 : 0)
    r &= 0xff
    return out
  }
  for (let round = 0; round < 24; round++) {
    let c = 0n
    for (let j = 0; j < 7; j++) if (bit()) c |= 1n << BigInt((1 << j) - 1)
    rc.push(c)
  }
  return rc
})()
const KECCAK_ROT = (() => {
  const rot = new Array(25).fill(0)
  let x = 1
  let y = 0
  for (let t = 0; t < 24; t++) {
    rot[x + 5 * y] = (((t + 1) * (t + 2)) / 2) % 64
    ;[x, y] = [y, (2 * x + 3 * y) % 5]
  }
  return rot
})()
const rotl = (v, n) => (n === 0 ? v : ((v << BigInt(n)) | (v >> BigInt(64 - n))) & MASK64)

function keccakF(s) {
  for (let round = 0; round < 24; round++) {
    const C = []
    for (let x = 0; x < 5; x++) C[x] = s[x] ^ s[x + 5] ^ s[x + 10] ^ s[x + 15] ^ s[x + 20]
    for (let x = 0; x < 5; x++) {
      const D = C[(x + 4) % 5] ^ rotl(C[(x + 1) % 5], 1)
      for (let y = 0; y < 25; y += 5) s[x + y] ^= D
    }
    const B = new Array(25)
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) B[y + 5 * ((2 * x + 3 * y) % 5)] = rotl(s[x + 5 * y], KECCAK_ROT[x + 5 * y])
    }
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        s[x + 5 * y] = B[x + 5 * y] ^ (~B[((x + 1) % 5) + 5 * y] & MASK64 & B[((x + 2) % 5) + 5 * y])
      }
    }
    s[0] ^= KECCAK_RC[round]
  }
}

export function keccak256Hex(input) {
  const bytes = typeof input === 'string' ? Buffer.from(input, 'utf8') : Buffer.from(input)
  const rate = 136
  const padLen = rate - (bytes.length % rate)
  const msg = Buffer.concat([bytes, Buffer.alloc(padLen)])
  msg[bytes.length] ^= 0x01
  msg[msg.length - 1] ^= 0x80
  const s = new Array(25).fill(0n)
  for (let off = 0; off < msg.length; off += rate) {
    for (let i = 0; i < rate / 8; i++) s[i] ^= msg.readBigUInt64LE(off + i * 8)
    keccakF(s)
  }
  const out = Buffer.alloc(32)
  for (let i = 0; i < 4; i++) out.writeBigUInt64LE(s[i], i * 8)
  return out.toString('hex')
}

export function selfCheck() {
  const empty = keccak256Hex('')
  if (empty !== 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470') {
    throw new Error('keccak self-check failed')
  }
  if ('0x' + keccak256Hex('lookupHuman(address)').slice(0, 8) !== LOOKUP_SELECTOR) {
    throw new Error('lookupHuman selector self-check failed')
  }
  if ('0x' + keccak256Hex('AgentRegistered(address,uint256)') !== REGISTERED_TOPIC) {
    throw new Error('AgentRegistered topic self-check failed')
  }
}

// ---------------------------------------------------------------------------
// Address helpers (W0 SPEC 3.6 truncation: first 6, an ellipsis, last 5).
// ---------------------------------------------------------------------------

export function toChecksumAddress(address) {
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return null
  const lower = address.slice(2).toLowerCase()
  const hash = keccak256Hex(lower)
  let out = '0x'
  for (let i = 0; i < 40; i++) out += parseInt(hash[i], 16) >= 8 ? lower[i].toUpperCase() : lower[i]
  return out
}

export function checksumIsValid(address) {
  const body = address.slice(2)
  const mixed = body !== body.toLowerCase() && body !== body.toUpperCase()
  return !mixed || toChecksumAddress(address) === address
}

export const truncateAddress = (checksummed) => `${checksummed.slice(0, 6)}…${checksummed.slice(-5)}`
const pad32 = (hexNo0x) => hexNo0x.toLowerCase().padStart(64, '0')
const addressTopic = (address) => '0x' + pad32(address.slice(2))

export function humanHashFromWord(word) {
  const body = word.slice(2).toLowerCase()
  const humanId = HUMAN_ID_FORM === 'padded64' ? '0x' + body : '0x' + BigInt(word).toString(16)
  return 'sha256:' + createHash('sha256').update(HUMAN_HASH_DOMAIN + humanId, 'utf8').digest('hex')
}

// Every textual form the raw value could take, for the self-scan.
function rawForms(word) {
  const body = word.slice(2).toLowerCase()
  const unpadded = BigInt(word).toString(16)
  return [body, unpadded, BigInt(word).toString(10)].filter((f) => f.length >= 16)
}

// ---------------------------------------------------------------------------
// JSON-RPC and HTTP, with a hard deadline on every request.
// ---------------------------------------------------------------------------

class LookupError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

async function rpc(url, method, params, timeoutMs) {
  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      signal: AbortSignal.timeout(timeoutMs),
      redirect: 'error',
    })
  } catch (e) {
    const timeout = e && (e.name === 'TimeoutError' || e.name === 'AbortError')
    throw new LookupError(timeout ? 'lookup_timeout' : 'lookup_failed', `${method}: transport failure`)
  }
  if (!res.ok) throw new LookupError('lookup_failed', `${method}: HTTP ${res.status}`)
  let body
  try {
    body = await res.json()
  } catch {
    throw new LookupError('lookup_failed', `${method}: response was not JSON`)
  }
  if (!body || body.error || !('result' in body)) throw new LookupError('lookup_failed', `${method}: RPC error`)
  return body.result
}

async function getJson(url, timeoutMs) {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), redirect: 'error' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ---------------------------------------------------------------------------
// Roster
// ---------------------------------------------------------------------------

class ConfigError extends Error {}

export function validateRoster(roster, { bootstrap = false, allowDraft = false } = {}) {
  const fail = (m) => {
    throw new ConfigError(m)
  }
  if (!roster || roster.schema !== SCHEMA) fail(`roster schema must be "${SCHEMA}"`)
  const guardHit = (value) => typeof value === 'string' && GUARD.test(value)
  const check = (value, where) => {
    if (!guardHit(value)) return
    if (/PLACEHOLDER/.test(value)) {
      if (bootstrap && where === 'expected_human_hash') return
      fail(`${where} still holds a PLACEHOLDER value`)
    }
    if (/DRAFT:/.test(value) && !allowDraft) fail(`${where} is DRAFT copy awaiting the author's approval`)
  }
  check(roster.expected_human_hash, 'expected_human_hash')
  if (!bootstrap && !/^sha256:[0-9a-f]{64}$/.test(roster.expected_human_hash || '')) {
    fail('expected_human_hash must be "sha256:" plus 64 lowercase hex')
  }
  if (roster.publish_full_addresses !== false) fail('publish_full_addresses must be false; the public site uses a private roster')
  if (!roster.agentbook || roster.agentbook.network !== 'eip155:480' || String(roster.agentbook.contract).toLowerCase() !== AGENTBOOK.toLowerCase()) {
    fail('agentbook must name eip155:480 and the canonical AgentBook contract this script checks')
  }
  if (!Array.isArray(roster.wallets) || roster.wallets.length === 0) fail('wallets must be a non-empty array')
  const ids = new Set()
  const addrs = new Set()
  return {
    ...roster,
    wallets: roster.wallets.map((w, i) => {
      const at = `wallets[${i}]`
      for (const k of ['id', 'label', 'role', 'address']) {
        if (typeof w[k] !== 'string' || !w[k]) fail(`${at}.${k} is required`)
        check(w[k], `${at}.${k}`)
      }
      for (const k of ['label', 'role']) {
        // The SDK may return a human ID without leading zeroes. Public copy
        // has no reason to contain hex pointers or long identifier-like runs.
        if (/0x[0-9a-f]+|[0-9a-f]{16,}/i.test(w[k])) {
          fail(`${at}.${k} contains a private long identifier`)
        }
      }
      if (!/^[a-z0-9][a-z0-9-]{0,31}$/.test(w.id)) fail(`${at}.id must be lowercase letters, digits, hyphens`)
      if (ids.has(w.id)) fail(`${at}.id duplicates another wallet`)
      ids.add(w.id)
      if (!/^0x[0-9a-fA-F]{40}$/.test(w.address)) fail(`${at}.address is not a 20-byte hex address`)
      if (!checksumIsValid(w.address)) fail(`${at}.address has a mixed-case checksum that does not verify`)
      const checksummed = toChecksumAddress(w.address)
      if (addrs.has(checksummed)) fail(`${at}.address duplicates another wallet`)
      addrs.add(checksummed)
      let tx = null
      if (w.registration_tx != null) {
        check(w.registration_tx, `${at}.registration_tx`)
        if (!/^0x[0-9a-fA-F]{64}$/.test(w.registration_tx)) fail(`${at}.registration_tx must be a 32-byte hex hash or null`)
        tx = w.registration_tx.toLowerCase()
      }
      return { ...w, address: checksummed, registration_tx: tx }
    }),
  }
}

export function assertSiteFleetCopy(wallets) {
  if (wallets.length !== SITE_FLEET_COPY.length ||
      wallets.some((wallet, index) =>
        [wallet.id, wallet.label, wallet.role].some((value, field) => value !== SITE_FLEET_COPY[index][field]))) {
    throw new ConfigError('fleet roster does not match the approved four-wallet page copy')
  }
}

// ---------------------------------------------------------------------------
// The check
// ---------------------------------------------------------------------------

async function preflight(rpcs, timeoutMs) {
  const heads = []
  for (const url of rpcs) {
    const chain = await rpc(url, 'eth_chainId', [], timeoutMs)
    if (String(chain).toLowerCase() !== CHAIN_ID_HEX) throw new LookupError('wrong_chain', 'RPC is not World Chain')
    const code = await rpc(url, 'eth_getCode', [AGENTBOOK, 'latest'], timeoutMs)
    if (typeof code !== 'string' || code.length <= 2) throw new LookupError('no_contract', 'AgentBook has no code at this RPC')
    const head = await rpc(url, 'eth_blockNumber', [], timeoutMs)
    heads.push(Number(BigInt(head)))
  }
  return Math.max(AGENTBOOK_DEPLOY_BLOCK, Math.min(...heads) - CONFIRMATIONS)
}

async function lookupWord(url, address, blockTag, timeoutMs) {
  const data = LOOKUP_SELECTOR + pad32(address.slice(2))
  const word = await rpc(url, 'eth_call', [{ to: AGENTBOOK, data }, blockTag], timeoutMs)
  if (typeof word !== 'string' || !/^0x[0-9a-fA-F]{64}$/.test(word)) {
    throw new LookupError('malformed_rpc_response', 'lookupHuman did not return one 32-byte word')
  }
  return word.toLowerCase()
}

async function findRegistration({ wallet, word, rpcs, logIndex, timeoutMs }) {
  // Pointer: the roster's recorded transaction, else the explorer's log index.
  let tx = wallet.registration_tx
  if (!tx && logIndex) {
    const q = new URLSearchParams({
      module: 'logs',
      action: 'getLogs',
      address: AGENTBOOK,
      fromBlock: String(AGENTBOOK_DEPLOY_BLOCK),
      toBlock: 'latest',
      topic0: REGISTERED_TOPIC,
      topic1: addressTopic(wallet.address),
      topic0_1_opr: 'and',
    })
    try {
      const body = await getJson(`${logIndex}?${q}`, timeoutMs)
      const logs = Array.isArray(body && body.result) ? body.result : []
      const matching = logs
        .filter((l) => Array.isArray(l.topics) && String(l.topics[2] || '').toLowerCase() === word)
        .sort((a, b) => Number(BigInt(b.blockNumber) - BigInt(a.blockNumber)) || Number(BigInt(b.logIndex) - BigInt(a.logIndex)))
      if (matching[0] && /^0x[0-9a-fA-F]{64}$/.test(matching[0].transactionHash)) tx = matching[0].transactionHash.toLowerCase()
    } catch {
      tx = null
    }
  }
  if (!tx) return { registered_at: null, block: null, tx: null, note: 'registration_date_unavailable' }
  // Confirmation: the receipt, read over the trusted RPC, must carry an
  // AgentRegistered log for this agent and this exact human.
  try {
    const receipt = await rpc(rpcs[0], 'eth_getTransactionReceipt', [tx], timeoutMs)
    if (!receipt || receipt.status !== '0x1' || !Array.isArray(receipt.logs)) throw new Error('no receipt')
    const hit = receipt.logs.find(
      (l) =>
        String(l.address).toLowerCase() === AGENTBOOK.toLowerCase() &&
        Array.isArray(l.topics) &&
        String(l.topics[0]).toLowerCase() === REGISTERED_TOPIC &&
        String(l.topics[1]).toLowerCase() === addressTopic(wallet.address) &&
        String(l.topics[2]).toLowerCase() === word,
    )
    if (!hit) throw new Error('receipt does not register this agent to this human')
    const block = await rpc(rpcs[0], 'eth_getBlockByNumber', [receipt.blockNumber, false], timeoutMs)
    const ts = Number(BigInt(block.timestamp))
    return {
      registered_at: new Date(ts * 1000).toISOString().replace('.000Z', 'Z'),
      block: Number(BigInt(receipt.blockNumber)),
      tx,
      note: null,
    }
  } catch {
    return { registered_at: null, block: null, tx: null, note: 'registration_date_unavailable' }
  }
}

export async function runCheck(roster, { rpcs, logIndex, timeoutMs, now }) {
  const attemptedAt = now.toISOString().replace(/\.\d{3}Z$/, 'Z')
  const secrets = [] // raw forms, held in memory only, for the self-scan
  const results = roster.wallets.map((w) => ({
    id: w.id,
    label: w.label,
    role: w.role,
    address: w.address,
    status: 'unknown',
    failures: [],
    observed_hash: null, // bootstrap display only; never written
    registered_at: null,
    registration_block: null,
    registration_tx: null,
    checked_at: null,
  }))
  let blockNumber = null
  try {
    blockNumber = await preflight(rpcs, timeoutMs)
  } catch (e) {
    const code = e instanceof LookupError ? e.code : 'lookup_failed'
    for (const r of results) r.failures.push('rpc_preflight_failed', code)
    return { attemptedAt, blockNumber: null, results, secrets }
  }
  const blockTag = '0x' + blockNumber.toString(16)
  for (const [i, w] of roster.wallets.entries()) {
    const r = results[i]
    let words
    try {
      words = []
      for (const url of rpcs) words.push(await lookupWord(url, w.address, blockTag, timeoutMs))
    } catch (e) {
      r.failures.push(e instanceof LookupError ? e.code : 'lookup_failed')
      continue
    }
    if (new Set(words).size !== 1) {
      r.failures.push('rpc_disagreement')
      continue
    }
    const word = words[0]
    if (BigInt(word) === 0n) {
      r.status = 'unregistered'
      r.failures.push('not_registered')
      r.checked_at = now.toISOString().replace(/\.\d{3}Z$/, 'Z')
      continue
    }
    secrets.push(...rawForms(word))
    const hash = humanHashFromWord(word)
    r.observed_hash = hash
    r.checked_at = now.toISOString().replace(/\.\d{3}Z$/, 'Z')
    if (roster.expected_human_hash && hash !== roster.expected_human_hash) {
      // Registered, but to a different human: AgentBook's register() does not
      // require the agent wallet's consent, so any verified human can register
      // (or overwrite) any address. Not backed by the operator; the other
      // human's hash is never published.
      r.status = 'different_human'
      r.failures.push('human_mismatch')
      continue
    }
    r.status = 'verified'
    const reg = await findRegistration({ wallet: w, word, rpcs, logIndex, timeoutMs })
    r.registered_at = reg.registered_at
    r.registration_block = reg.block
    r.registration_tx = reg.tx
    if (reg.note) r.failures.push(reg.note) // informational; status stays verified
  }
  return { attemptedAt, blockNumber, results, secrets }
}

// ---------------------------------------------------------------------------
// Rendering (public shape only)
// ---------------------------------------------------------------------------

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const word = (n) => WORDS[n] ?? String(n)
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const utcStamp = (iso) => iso.replace('T', ' ').replace(/:\d{2}Z$/, ' UTC')

export function summarize(results) {
  const n = results.length
  const v = results.filter((r) => r.status === 'verified').length
  if (v === n) return `${cap(word(n))} wallets, one verified unique human.`
  const groups = [
    ['unregistered', (k) => (k === 1 ? 'is not registered' : 'are not registered')],
    ['different_human', (k) => (k === 1 ? 'is registered to a different human' : 'are registered to a different human')],
    ['unknown', () => 'could not be checked'],
  ]
  const parts = []
  for (const [status, verb] of groups) {
    const k = results.filter((r) => r.status === status).length
    if (k) parts.push(`${word(k)} ${verb(k)}`)
  }
  if (v === 0 && results.every((r) => r.status === 'unknown')) {
    return `None of the ${word(n)} wallets could be checked at this build.`
  }
  if (v === 0) return `No wallet resolves to the operator's verified unique human at this build; ${parts.join('; ')}.`
  const head = v === 1 ? `One of ${word(n)} wallets resolves` : `${cap(word(v))} of ${word(n)} wallets resolve`
  return `${head} to one verified unique human; ${parts.join('; ')}.`
}

const REASON = {
  unregistered: 'Not registered in AgentBook at this build.',
  different_human:
    'Registered in AgentBook, but to a different human than the operator. Not backed by the operator at this build.',
  unknown: 'Could not be checked at this build: the chain read did not complete. This says nothing about the wallet.',
}

function badge(ok) {
  if (ok) {
    return (
      '<span class="fleet-badge ok">' +
      '<img class="only-light" src="../assets/ov-core-light.svg" width="18" height="18" alt="">' +
      '<img class="only-dark" src="../assets/ov-core-dark.svg" width="18" height="18" alt="">' +
      'Backed by a verified unique human</span>'
    )
  }
  return '<span class="fleet-badge no">Not verified</span>'
}

export function renderCards(results) {
  return results
    .map((r) => {
      const ok = r.status === 'verified'
      const rows = [
        r.checked_at
          ? `<tr><th>Checked</th><td>${esc(utcStamp(r.checked_at))}, at build</td></tr>`
          : '<tr><th>Checked</th><td>no completed check at this build</td></tr>',
      ]
      return [
        `<div class="card fleet-card" data-status="${esc(r.status)}">`,
        `  <div class="fleet-head"><h3>${esc(r.label)}</h3>${badge(ok)}</div>`,
        `  <p>${esc(r.role)}</p>`,
        ok ? '' : `  <p class="fleet-reason">${esc(REASON[r.status])}</p>`,
        `  <table class="facts fleet-facts">${rows.join('')}</table>`,
        '</div>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')
}

export function renderSummary(results, blockNumber, rpcs = []) {
  const checked = results.find((r) => r.checked_at)
  const lines = [`<h2>The fleet. <span>${esc(summarize(results))}</span></h2>`]
  if (checked) {
    const hosts = new Set(rpcs.map((url) => new URL(url).hostname.toLowerCase()))
    const source = hosts.size === 2 &&
      hosts.has('worldchain-mainnet.g.alchemy.com') &&
      hosts.has('worldchain-mainnet.gateway.tenderly.co')
      ? 'using Alchemy and Tenderly'
      : `using ${hosts.size} configured RPC hostnames; provider independence was not established`
    lines.push(
      `<p class="fleet-when">Checked at build, ${esc(utcStamp(checked.checked_at))}, against World Chain block ${blockNumber}, ${esc(source)}. ` +
        'This result is a build-time snapshot.</p>',
    )
  } else {
    lines.push('<p class="fleet-when">No check completed at this build.</p>')
  }
  return lines.join('\n')
}

export function renderProofClaim(results) {
  return results.every((result) => result.status === 'verified')
    ? "This check says that four wallets in the operator's private roster resolved to the same registered, verified unique human when the site was built."
    : ''
}

export function buildFacts(run, roster) {
  const { results, attemptedAt, blockNumber } = run
  const chainSource = {
    type: 'chain-read',
    ref: 'AgentBook lookupHuman on World Chain (eip155:480)',
    detail:
      blockNumber == null
        ? 'Build-time check by scripts/fleet-check.mjs; no check completed'
        : `Build-time check by scripts/fleet-check.mjs at block ${blockNumber}; not a live check`,
  }
  const facts = results.map((r) => {
    const ok = r.status === 'verified'
    // Public fleet facts contain labels and outcomes, never wallet identifiers,
    // human hashes, or transaction pointers that can resolve private wallets.
    return {
      id: `fleet.${r.id}`,
      label: `${r.label}: AgentBook backing`,
      value: ok ? 'verified' : 'not verified',
      kind: 'machine',
      status: r.status,
      failures: r.failures,
      checked_at: ok || r.status === 'unregistered' || r.status === 'different_human' ? r.checked_at : null,
      attempted_at: attemptedAt,
      source: chainSource,
      verified_at: ok ? r.checked_at.slice(0, 10) : null,
      verified_by: 'the build check (scripts/fleet-check.mjs)',
      publish: true,
    }
  })
  const allOk = results.every((r) => r.status === 'verified')
  facts.push({
    id: 'fleet.summary',
    label: 'Fleet page summary line',
    value: summarize(results),
    kind: 'machine',
    status: allOk ? 'verified' : 'degraded',
    attempted_at: attemptedAt,
    source: chainSource,
    verified_at: allOk ? results[0].checked_at.slice(0, 10) : null,
    verified_by: 'the build check (scripts/fleet-check.mjs)',
    publish: true,
  })
  return facts
}

// Facts rule (site DESIGN section 3): no entry without a source and a date.
export function factsRule(facts) {
  for (const f of facts) {
    if (!f.source || !f.source.type || !f.source.ref) throw new ConfigError(`${f.id} has no source`)
    if (!f.attempted_at && !f.verified_at) throw new ConfigError(`${f.id} has no date`)
    if (f.value === 'verified' && !f.verified_at) throw new ConfigError(`${f.id} is verified without verified_at`)
  }
}

export function replaceRegion(html, name, inner) {
  const begin = `<!-- fleet-check:begin ${name} -->`
  const end = `<!-- fleet-check:end ${name} -->`
  const a = html.indexOf(begin)
  const b = html.indexOf(end)
  if (a < 0 || b < a || html.indexOf(begin, a + 1) >= 0) throw new ConfigError(`fleet/index.html: region "${name}" markers missing or repeated`)
  return html.slice(0, a + begin.length) + '\n' + inner + '\n' + html.slice(b)
}

export function selfScan(texts, secrets, forbiddenIdentifiers, { generic = true, allowedGeneric = {} } = {}) {
  const hay = texts.join('\n').toLowerCase()
  for (const s of secrets) if (hay.includes(s.toLowerCase())) return 'raw human identifier'
  for (const identifier of forbiddenIdentifiers) {
    const value = identifier.toLowerCase()
    if (hay.includes(value) || (value.startsWith('0x') && hay.includes(value.slice(2)))) {
      return 'private identifier in public output'
    }
  }
  if (!generic) return null
  const remaining = { ...allowedGeneric }
  for (const finding of genericFindings(hay)) {
    if (remaining[finding.digest] > 0) remaining[finding.digest]--
    else return finding.reason
  }
  return null
}

const WALLET_FRAGMENT_PATTERN = /0x[0-9a-f]{4,10}(?:…|\.\.\.|&hellip;|&#8230;|&#x2026;)[0-9a-f]{4,10}/g
const GENERIC_PATTERNS = [
  ['humanId key', /"humanid"\s*:/g],
  ['wallet-like address', /\b0x[0-9a-f]{40}\b/g],
  ['wallet-like fragment', WALLET_FRAGMENT_PATTERN],
  ['human-hash-like value', /sha256:[0-9a-f]{64}/g],
]

// Hash each public, pre-existing match and its line rather than embedding the
// address in the checker. The line binds the exception to its original copy;
// counts prevent adding another copy of the same line.
export function genericFindings(text) {
  const hay = text.toLowerCase()
  return GENERIC_PATTERNS.flatMap(([reason, pattern]) => [...hay.matchAll(pattern)].map((found) => {
    const [match] = found
    const lineStart = hay.lastIndexOf('\n', found.index - 1) + 1
    const lineEnd = hay.indexOf('\n', found.index)
    const line = hay.slice(lineStart, lineEnd < 0 ? undefined : lineEnd)
    return { reason, digest: createHash('sha256').update(`${reason}\0${match}\0${line}`).digest('hex') }
  }))
}

// Existing public fragments are a known disclosure, not a reason to publish
// another copy. Mask only their exact audited occurrence for the private-value
// scan. The original bytes still go through the generic count check below.
function maskAuditedFragments(text, allowed = {}, wholeFilePinned = false) {
  const hay = text.toLowerCase()
  const remaining = { ...allowed }
  return hay.replace(WALLET_FRAGMENT_PATTERN, (match, offset) => {
    const lineStart = hay.lastIndexOf('\n', offset - 1) + 1
    const lineEnd = hay.indexOf('\n', offset)
    const line = hay.slice(lineStart, lineEnd < 0 ? undefined : lineEnd)
    const digest = sha256(`wallet-like fragment\0${match}\0${line}`)
    if (wholeFilePinned || remaining[digest] > 0) {
      if (!wholeFilePinned) remaining[digest]--
      return ' '.repeat(match.length)
    }
    return match
  })
}

// Baseline taken from niclydon/operator-verified-site on 2026-10-26. These
// are only public fragments already on that site. Re-pin after a privacy read
// if the builder changes their spelling or count. A new fragment is refused.
const EXISTING_PUBLIC_FRAGMENTS = Object.freeze({
  'docs/DESIGN.md': {
    '8c012fe92d2bb92e678caee256867881bd99c3d64d6f5d18bb186da47c2f30af': 1,
    '66fdfda5a695bdbe0e6b87092f45f37e8616fbfaeb743211e076185d3f6e2823': 1,
  },
  'verify/index.html': { 'b8c96004dab24b15a828566e68966395faa6f9c8cdfaf245929cc61ba1a91ac6': 1 },
  'snapshots/2026-10-26-fleet/verify/index.html': { 'b8c96004dab24b15a828566e68966395faa6f9c8cdfaf245929cc61ba1a91ac6': 1 },
  'snapshots/2026-10-26-privacy-correction/verify/index.html': { 'b8c96004dab24b15a828566e68966395faa6f9c8cdfaf245929cc61ba1a91ac6': 1 },
})

// A private roster value may match a fragment already published on the site.
// Its exception is narrower than the generic fragment baseline: the entire
// active file must still match the reviewed bytes. Any site copy edit needs a
// fresh privacy review before a private roster can be checked against it.
const EXISTING_ACTIVE_PRIVATE_FRAGMENT_FILES = Object.freeze({
  'docs/DESIGN.md': '3e86bfb66b6011fe71e632ed919d3f03556507ecf7f8b3faa673666bcd45fd65',
})

// Historical snapshots are append-only. The checker never rewrites them, and
// a changed address-bearing snapshot must not acquire a fragment exception.
const EXISTING_SNAPSHOT_FILES = Object.freeze({
  'snapshots/2026-10-26-launch/facts.json': '4473c026fa26146321dae8479abcce5374d8135ee32d207481f2e31fbe9a8db3',
  'snapshots/2026-10-26-launch/projects/fiador/index.html': 'a5987006727f187e5d1a267926f2bc62a079fc576f90ddc5d6acbf513582f30d',
  'snapshots/2026-10-26-launch/verify/index.html': 'a46537feab117f97f3ccbc30f20afc450182e5a72cca331c4af98d373af24bfb',
})
// Deployment metadata may be added later, but the captured file bytes in
// either reviewed snapshot must stay fixed.
const SNAPSHOT_CONTENT_HASHES = Object.freeze({
  '2026-10-26-fleet': 'b355f12579d8e9d72db22626ce18029f50c8b75229318628830032d0f3bf0d8e',
  '2026-10-26-privacy-correction': '01d571495a423fe03d4cda6c7db6bcb5ba28d5d6efb99f7a97c832aa613de23a',
})

// The checker appends fleet.* facts to the existing public facts. The old
// non-fleet document may keep its existing public fragment only at this exact
// canonical hash; new fleet facts are scanned without exceptions.
const EXISTING_NON_FLEET_FACTS_SHA256 = '92de184ecaaf0c2fc27ffb2123d814062083e06b073164cc430478bb20c45616'
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')

export function nonFleetFactsMatch(doc, expectedHash = EXISTING_NON_FLEET_FACTS_SHA256) {
  if (!doc || !Array.isArray(doc.facts)) return false
  const nonFleet = { ...doc, facts: doc.facts.filter((f) => !String(f?.id).startsWith('fleet.')) }
  return sha256(JSON.stringify(nonFleet, null, 2)) === expectedHash
}

export function scanProposedFacts(doc, fleetFacts, secrets, forbiddenIdentifiers,
  expectedHash = EXISTING_NON_FLEET_FACTS_SHA256) {
  const existingFactsPinned = nonFleetFactsMatch(doc, expectedHash)
  const nonFleet = doc.facts.filter((f) => !String(f?.id).startsWith('fleet.'))
  const factsText = JSON.stringify({ ...doc, facts: nonFleet.concat(fleetFacts) }, null, 2)
  const privateScanText = existingFactsPinned
    ? maskAuditedFragments(JSON.stringify({ ...doc, facts: nonFleet }, null, 2), {}, true) + JSON.stringify(fleetFacts)
    : factsText
  const refusal = selfScan([privateScanText], secrets, forbiddenIdentifiers, { generic: false }) ||
    selfScan([existingFactsPinned ? JSON.stringify(fleetFacts) : factsText], [], [])
  return { factsText, refusal }
}

function identifierForms(identifiers) {
  const forms = new Set(identifiers)
  for (const identifier of identifiers) {
    if (/^0x[0-9a-f]{40}$/i.test(identifier) || /^0x[0-9a-f]{64}$/i.test(identifier)) {
      const body = identifier.slice(2)
      for (const prefix of [4, 6, 8]) for (const suffix of [4, 5, 6]) {
        for (const separator of ['…', '...', '&hellip;', '&#8230;', '&#x2026;']) {
          forms.add(`0x${body.slice(0, prefix)}${separator}${body.slice(-suffix)}`)
        }
      }
    } else if (/^sha256:[0-9a-f]{64}$/i.test(identifier)) {
      forms.add(identifier.slice(7))
    }
  }
  return [...forms]
}

function isRosterShape(value) {
  return value && typeof value === 'object' && !Array.isArray(value) &&
    (value.schema === SCHEMA || (Array.isArray(value.wallets) &&
      ('expected_human_hash' in value || 'publish_full_addresses' in value)))
}

// This directory is handed to the static publisher. Source files may contain
// literal examples and regular expressions, so apply broad pattern matching
// only to content/data files. Known private values are checked in every file.
export async function scanServedTree(site, secrets, forbiddenIdentifiers, {
  publicFragments = EXISTING_PUBLIC_FRAGMENTS,
  activePrivateFragmentFiles = EXISTING_ACTIVE_PRIVATE_FRAGMENT_FILES,
  snapshotFiles = EXISTING_SNAPSHOT_FILES,
  nonFleetFactsHash = EXISTING_NON_FLEET_FACTS_SHA256,
} = {}) {
  async function checkSnapshot(name, expectedContentHash) {
    const snapshot = path.join(site, 'snapshots', name)
    let manifest
    try { manifest = JSON.parse(await readFile(path.join(snapshot, 'snapshot.json'), 'utf8')) } catch {
      return `${name} snapshot manifest missing or invalid`
    }
    if (manifest.snapshot !== name || !manifest.files ||
        typeof manifest.files !== 'object' || Array.isArray(manifest.files) ||
        sha256(JSON.stringify(manifest.files)) !== expectedContentHash) {
      return `${name} snapshot file list differs from the reviewed content set`
    }
    const captured = new Set()
    async function walkSnapshot(dir) {
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name)
        if (entry.isSymbolicLink()) return `symbolic link in ${name} snapshot`
        if (entry.isDirectory()) {
          const refusal = await walkSnapshot(file)
          if (refusal) return refusal
        } else if (entry.isFile()) {
          const relative = path.relative(snapshot, file).split(path.sep).join('/')
          if (relative === 'snapshot.json') continue
          if (!Object.hasOwn(manifest.files, relative)) return `unlisted file in ${name} snapshot`
          if (sha256(await readFile(file)) !== manifest.files[relative]) return `${name} snapshot file changed`
          captured.add(relative)
        } else return `non-file entry in ${name} snapshot`
      }
      return null
    }
    const refusal = await walkSnapshot(snapshot)
    if (refusal) return refusal
    if (captured.size !== Object.keys(manifest.files).length) return `${name} snapshot file missing`
    return null
  }
  for (const [name, expectedContentHash] of Object.entries(SNAPSHOT_CONTENT_HASHES)) {
    const refusal = await checkSnapshot(name, expectedContentHash)
    if (refusal) return refusal
  }
  const contentExtensions = new Set(['.html', '.htm', '.json', '.jsonl', '.md', '.txt', '.csv', '.xml', '.svg', '.webmanifest', '.map'])
  const browserCodeExtensions = new Set(['.js', '.mjs', '.css'])
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name)
      if (entry.isSymbolicLink()) return 'symbolic link in public site tree'
      if (entry.isDirectory()) {
        const refusal = await walk(file)
        if (refusal) return refusal
        continue
      }
      if (!entry.isFile()) return 'non-file entry in public site tree'
      const bytes = await readFile(file)
      const body = bytes.toString('utf8')
      const relative = path.relative(site, file).split(path.sep).join('/')
      let parsed
      try {
        parsed = JSON.parse(body)
        if (isRosterShape(parsed)) return 'private roster-shaped file in public site tree'
      } catch { /* most public assets are not JSON */ }
      if (Object.hasOwn(snapshotFiles, relative)) {
        if (sha256(bytes) !== snapshotFiles[relative]) return 'pinned historical snapshot changed'
        const privateRefusal = selfScan([maskAuditedFragments(body, {}, true)], secrets, forbiddenIdentifiers, { generic: false })
        if (privateRefusal) return privateRefusal
        continue
      }
      if (relative === 'facts.json' && nonFleetFactsMatch(parsed, nonFleetFactsHash)) {
        // Existing non-fleet facts match exact audited bytes. The old fleet
        // entries, if any, still have to pass the broad generic scan.
        const fleet = parsed.facts.filter((f) => String(f?.id).startsWith('fleet.'))
        const privateScanText = maskAuditedFragments(JSON.stringify({ ...parsed, facts: parsed.facts.filter((f) => !String(f?.id).startsWith('fleet.')) }), {}, true) + JSON.stringify(fleet)
        const privateRefusal = selfScan([privateScanText], secrets, forbiddenIdentifiers, { generic: false })
        if (privateRefusal) return privateRefusal
        const refusal = selfScan([JSON.stringify(fleet)], [], [])
        if (refusal) return refusal
        continue
      }
      const auditedFragments = sha256(bytes) === activePrivateFragmentFiles[relative]
        ? publicFragments[relative] ?? {}
        : {}
      const privateRefusal = selfScan([maskAuditedFragments(body, auditedFragments)], secrets, forbiddenIdentifiers, { generic: false })
      if (privateRefusal) return privateRefusal
      const refusal = selfScan([body], [], [], {
        generic: contentExtensions.has(path.extname(file).toLowerCase()) ||
          (browserCodeExtensions.has(path.extname(file).toLowerCase()) &&
            !/^(?:scripts|test|api)\//.test(relative)),
        allowedGeneric: publicFragments[relative] ?? {},
      })
      if (refusal) return refusal
    }
    return null
  }
  return walk(site)
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const o = { rpcs: [], flags: new Set() }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const val = () => {
      if (i + 1 >= argv.length) throw new ConfigError(`${a} needs a value`)
      return argv[++i]
    }
    if (a === '--site') o.site = val()
    else if (a === '--roster') o.roster = val()
    else if (a === '--rpc') o.rpcs.push(val())
    else if (a === '--log-index') o.logIndex = val()
    else if (a === '--timeout-ms') o.timeoutMs = Number(val())
    else if (a === '--now') o.now = val()
    else if (a === '--evidence') o.evidence = val()
    else if (a === '--bootstrap-output') o.bootstrapOutput = val()
    else if (['--dry-run', '--bootstrap', '--allow-draft', '--allow-degraded'].includes(a)) o.flags.add(a.slice(2))
    else throw new ConfigError(`unknown argument ${a}`)
  }
  return o
}

async function main() {
  selfCheck()
  const args = parseArgs(process.argv.slice(2))
  const here = path.dirname(fileURLToPath(import.meta.url))
  const site = path.resolve(args.site || path.join(here, '..'))
  if (!args.roster) throw new ConfigError('--roster must name a private file outside the site tree')
  const rosterPath = path.resolve(args.roster)
  const rpcs = args.rpcs.length
    ? args.rpcs
    : (process.env.FLEET_RPC_URLS || DEFAULT_RPCS.join(',')).split(',').map((s) => s.trim()).filter(Boolean)
  let rpcHosts
  try {
    rpcHosts = rpcs.map((url) => new URL(url).hostname.toLowerCase())
  } catch {
    throw new ConfigError('RPC URLs must be valid URLs')
  }
  if (rpcs.length < 2 || new Set(rpcHosts).size < 2) {
    throw new ConfigError('at least two RPC URLs with distinct provider hostnames are required')
  }
  const logIndexRaw = args.logIndex ?? process.env.FLEET_LOG_INDEX_URL ?? DEFAULT_LOG_INDEX
  const logIndex = logIndexRaw === 'none' ? null : logIndexRaw
  const timeoutMs = args.timeoutMs || DEFAULT_TIMEOUT_MS
  const now = args.now ? new Date(args.now) : new Date()
  if (Number.isNaN(now.getTime())) throw new ConfigError('--now is not a valid timestamp')
  const bootstrap = args.flags.has('bootstrap')
  if (bootstrap && !args.bootstrapOutput) throw new ConfigError('--bootstrap requires --bootstrap-output outside the site tree')
  if (!bootstrap && args.bootstrapOutput) throw new ConfigError('--bootstrap-output requires --bootstrap')

  let roster
  try {
    roster = JSON.parse(await readFile(rosterPath, 'utf8'))
  } catch {
    throw new ConfigError('cannot read private roster')
  }
  roster = validateRoster(roster, { bootstrap, allowDraft: args.flags.has('allow-draft') })
  assertSiteFleetCopy(roster.wallets)
  // Check both the path placed in the public tree and its symlink target.
  // Either location could expose a private roster to a static publisher.
  const actualSite = await realpath(site)
  const actualRoster = await realpath(rosterPath)
  if (rosterPath.startsWith(site + path.sep) || actualRoster.startsWith(actualSite + path.sep)) {
    throw new ConfigError('private roster sits inside the site tree; move it out and pass --roster')
  }
  let bootstrapOutputPath = null
  if (bootstrap) {
    bootstrapOutputPath = path.resolve(args.bootstrapOutput)
    let actualOutputParent
    try {
      actualOutputParent = await realpath(path.dirname(bootstrapOutputPath))
    } catch {
      throw new ConfigError('private bootstrap output parent does not exist')
    }
    if (bootstrapOutputPath.startsWith(site + path.sep) || actualOutputParent === actualSite || actualOutputParent.startsWith(actualSite + path.sep)) {
      throw new ConfigError('private bootstrap output sits inside the site tree')
    }
  }
  if (bootstrap) roster.expected_human_hash = null

  const run = await runCheck(roster, { rpcs, logIndex, timeoutMs, now })

  if (bootstrap) {
    const hashes = new Set(run.results.map((r) => r.observed_hash).filter(Boolean))
    const privateReport = {
      attempted_at: run.attemptedAt,
      results: run.results.map(({ id, status, observed_hash, failures }) => ({ id, status, observed_hash, failures })),
      distinct_human_hashes: hashes.size,
    }
    try {
      await writeFile(bootstrapOutputPath, JSON.stringify(privateReport, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
    } catch {
      throw new ConfigError('cannot create private bootstrap report; choose a new path outside the site tree')
    }
    console.log('fleet-check: private bootstrap report written; confirm the candidate hash against the trusted registration record before pinning')
    return run.results.every((r) => r.observed_hash) && hashes.size === 1 ? 0 : 1
  }

  const facts = buildFacts(run, roster)
  factsRule(facts)
  const pagePath = path.join(site, 'fleet', 'index.html')
  const factsPath = path.join(site, 'facts.json')
  let page, factsDoc, factsOriginal
  try {
    page = await readFile(pagePath, 'utf8')
    factsOriginal = await readFile(factsPath, 'utf8')
    factsDoc = JSON.parse(factsOriginal)
  } catch {
    throw new ConfigError('cannot read fleet/index.html or facts.json under the site directory')
  }
  if (!Array.isArray(factsDoc.facts)) throw new ConfigError('facts.json has no facts array')
  page = replaceRegion(page, 'summary', renderSummary(run.results, run.blockNumber, rpcs))
  page = replaceRegion(page, 'cards', renderCards(run.results))
  page = replaceRegion(page, 'proof-claim', renderProofClaim(run.results))
  const evidence = {
    record: 'fleet-check',
    attempted_at: run.attemptedAt,
    block: run.blockNumber,
    rpc_count: rpcs.length,
    hash_construction: `sha256(utf8("${HUMAN_HASH_DOMAIN}" + humanId)), humanId form ${HUMAN_ID_FORM}`,
    results: facts.filter((f) => f.id !== 'fleet.summary').map(({ id, status, failures, checked_at }) => ({ id, status, failures, checked_at })),
    summary: facts.find((f) => f.id === 'fleet.summary').value,
  }
  const evidenceText = JSON.stringify(evidence, null, 2)

  const forbiddenIdentifiers = identifierForms([
    ...roster.wallets.map((w) => w.address),
    ...roster.wallets.map((w) => w.registration_tx).filter(Boolean),
    ...run.results.map((r) => r.registration_tx).filter(Boolean),
    roster.expected_human_hash,
    ...run.results.map((r) => r.observed_hash).filter(Boolean),
  ].filter(Boolean))
  const { factsText, refusal: factsRefusal } = scanProposedFacts(factsDoc, facts, run.secrets, forbiddenIdentifiers)
  const refusal = selfScan([page, evidenceText], run.secrets, forbiddenIdentifiers) ||
    factsRefusal ||
    await scanServedTree(site, run.secrets, forbiddenIdentifiers)
  if (refusal) {
    console.error(`fleet-check: self-scan refused the outputs (${refusal}); nothing written`)
    return 3
  }

  if (!args.flags.has('dry-run')) {
    const evidencePath = args.evidence ? path.resolve(args.evidence) : null
    if (evidencePath) {
      let parent
      try { parent = await realpath(path.dirname(evidencePath)) } catch {
        throw new ConfigError('evidence parent directory does not exist; nothing written')
      }
      const resolvedEvidence = path.join(parent, path.basename(evidencePath))
      if (resolvedEvidence === actualSite || resolvedEvidence.startsWith(actualSite + path.sep)) {
        throw new ConfigError('evidence output must stay outside the public site tree; nothing written')
      }
    }
    const suffix = randomBytes(12).toString('hex')
    const pageStage = path.join(path.dirname(pagePath), `.${path.basename(pagePath)}.${suffix}.tmp`)
    const factsStage = path.join(path.dirname(factsPath), `.${path.basename(factsPath)}.${suffix}.tmp`)
    const originalPage = await readFile(pagePath, 'utf8')
    let evidenceWritten = false
    let pageReplaced = false
    try {
      await writeFile(pageStage, page, { flag: 'wx', mode: 0o600 })
      await writeFile(factsStage, factsText, { flag: 'wx', mode: 0o600 })
      if (evidencePath) {
        await writeFile(evidencePath, evidenceText + '\n', { flag: 'wx', mode: 0o600 })
        evidenceWritten = true
      }
      await rename(pageStage, pagePath)
      pageReplaced = true
      await rename(factsStage, factsPath)
    } catch {
      if (pageReplaced) {
        try { await writeFile(pagePath, originalPage) } catch { /* report possible partial output below */ }
      }
      if (evidenceWritten) {
        try { await rm(evidencePath) } catch { /* report possible partial output below */ }
      }
      throw new ConfigError('publication failed; partial output may remain, do not deploy this build')
    } finally {
      await rm(pageStage, { force: true })
      await rm(factsStage, { force: true })
    }
  }
  console.log(evidenceText)
  const allOk = run.results.every((r) => r.status === 'verified')
  if (!allOk) console.error(`fleet-check: not every wallet verified (${evidence.summary})`)
  return allOk || args.flags.has('allow-degraded') ? 0 : 1
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  main().then(
    (code) => process.exit(code),
    (e) => {
      if (e instanceof ConfigError) {
        console.error(`fleet-check: configuration error: ${e.message}`)
        process.exit(2)
      }
      console.error(`fleet-check: internal error: ${e && e.message}; partial output may remain, do not deploy this build`)
      process.exit(2)
    },
  )
}
