// The shared gate scans TS/TSX only. This standalone preview keeps styles in CSS.
// Run its unchanged rules with CSS included, without changing the shared tool.
import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const source=await readFile(new URL('../mobile-gate.mjs',import.meta.url),'utf8')
const inputFilter='filter(f => /\\.(tsx|ts)$/.test(f))'
assert.ok(source.includes(inputFilter),'Shared gate input filter changed; review adapter')
const adapted=source.replace(inputFilter,'filter(f => /\\.(tsx|ts|css)$/.test(f))')
await import('data:text/javascript;base64,'+Buffer.from(adapted).toString('base64'))
