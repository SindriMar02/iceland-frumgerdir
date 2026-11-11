import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { analyticsShell, firstControl } from './polarhestar-build-safety.mjs'
const shell = readFileSync(new URL('../polarhestar.html', import.meta.url), 'utf8')

test('staging removes both trackers even when a production token is present', () => {
  const html = analyticsShell(shell, { token: 'production-token', noindex: true })
  assert(!/<script[^>]+(?:cloudflareinsights|sndr-pulse)/.test(html))
  assert(!html.includes('__CF_ANALYTICS_TOKEN__'))
  assert(!html.includes('production-token'))
})

test('production keeps Pulse with no CF token, and arms CF only with a token', () => {
  const without = analyticsShell(shell, { noindex: false })
  assert(without.includes('data-site="polarhestar"'))
  assert(!/<script[^>]+cloudflareinsights/.test(without))
  const withToken = analyticsShell(shell, { token: 'test-token', noindex: false })
  assert(withToken.includes('"token":"test-token"'))
  assert(withToken.includes('data-site="polarhestar"'))
})

test('all forbidden C0 bytes fail, ordinary Unicode and allowed whitespace pass', () => {
  assert.equal(firstControl(Buffer.from('Íslenska\tDeutsch\r\nEnglish')), -1)
  for (let byte = 0; byte < 32; byte++) {
    if ([9, 10, 13].includes(byte)) continue
    assert.equal(firstControl(Buffer.from([65, byte, 66])), 1, `byte ${byte}`)
  }
})
