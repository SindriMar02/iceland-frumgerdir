#!/usr/bin/env node
/* mobile-gate — the iOS checks that keep getting re-learned by hand.
 *
 * Every rule here comes from a bug Sindri reported from his phone, on a build
 * that had already passed a desktop review. Prose memory did not stop any of
 * them recurring, so they live here as an assertion instead.
 *
 *   node tools/mobile-gate.mjs               # every preview
 *   node tools/mobile-gate.mjs mirrorsuite   # one slug
 *
 * Exit 1 if any FAIL.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'src/preview'
const only = process.argv.slice(2).filter(a => !a.startsWith('-'))

/* Each rule: { id, why, test(src) -> null | 'reason' }  */
const RULES = [
  {
    id: 'no-smooth-scroll-lib',
    why: 'iOS Safari only minimises its bottom toolbar to the floating pill for a NATIVELY scrolled document. A JS scroll surface (Lenis/locomotive) keeps the tall opaque toolbar and the page never runs under it. Reported on mirrorsuite 2026-08-19; reynir, which Sindri approved on-device, has no such library.',
    test: s => /^\s*import\s+.*\bfrom\s+['"](lenis|locomotive-scroll|@studio-freight)/m.test(s)
      ? 'imports a smooth-scroll library' : null,
  },
  {
    id: 'edge-tint-source',
    why: 'Safari 26 samples html/body background-color for the status/home-indicator strips when no fixed element qualifies at that edge. Painting the page colour on an inner wrapper only leaves those strips on the browser default.',
    test: s => /html\s*,\s*body\s*\{[^}]*background-color/.test(s)
      || /html:has\([^)]*\)\s*,\s*body:has\([^)]*\)\s*\{[^}]*background-color/.test(s)
      ? null : 'no html/body background-color rule',
  },
  {
    id: 'safe-area-top-chrome',
    why: 'A position:fixed top bar slides under the status bar / notch on iOS unless it adds env(safe-area-inset-top).',
    test: s => /position:\s*fixed[^}]*inset:\s*0 0 auto 0|position:\s*fixed[^}]*top:\s*0/.test(s)
      && !/env\(\s*safe-area-inset-top/.test(s)
      ? 'has a fixed top bar but never uses env(safe-area-inset-top)' : null,
  },
  {
    id: 'native-date-control',
    why: 'An iOS <input type="date"> is a native control whose shadow DOM keeps its own intrinsic width. minmax(0,1fr) on the track and min-width:0 on the item are NOT enough — the two date fields still collided and ran off the right edge on a 430pt iPhone (mirrorsuite, reported 2026-08-19). No headless browser on this Mac reproduces it, because none of them render that control. So the rule is structural: drop the native appearance, and never place two of them side by side on a phone.',
    test: s => {
      if (!/type=["']date["']/.test(s)) return null
      const missing = []
      if (!/input\[type=["']date["']\][^{]*\{[^}]*appearance:\s*none/.test(s)) missing.push('no appearance:none')
      /* a 2-track row must collapse to one column somewhere under 640px */
      const stacks = /@media[^{]*max-width:\s*(?:[0-5]?\d{1,2}|6[0-4]\d)px[^{]*\{[\s\S]*?grid-template-columns:\s*1fr\s*[;}]/.test(s)
      if (/grid-template-columns:\s*(?:minmax\(0,\s*1fr\)|1fr)\s+(?:minmax\(0,\s*1fr\)|1fr)/.test(s) && !stacks)
        missing.push('two-track field row never collapses to one column on phones')
      return missing.length ? missing.join('; ') : null
    },
  },
  {
    id: 'svh-not-vh',
    why: 'In-app browsers (Instagram/Facebook WKWebView) collapse their chrome on scroll, so 100vh resizes mid-scroll and bottom-anchored hero content snaps. 100svh is stable.',
    test: s => {
      const bad = [...s.matchAll(/(?:min-)?height:\s*100vh(?!\s*;\s*(?:min-)?height:\s*100svh)/g)]
      return bad.length ? `${bad.length} use(s) of 100vh with no 100svh follow-up` : null
    },
  },
]

const slugs = (only.length ? only : readdirSync(ROOT, { withFileTypes: true })
  .filter(d => d.isDirectory()).map(d => d.name)).sort()

let failed = 0
const rows = []
for (const slug of slugs) {
  const dir = join(ROOT, slug)
  if (!existsSync(dir)) { console.error(`no such preview: ${slug}`); process.exitCode = 1; continue }
  const src = readdirSync(dir).filter(f => /\.(tsx|ts)$/.test(f))
    .map(f => readFileSync(join(dir, f), 'utf8')).join('\n')
  if (!src.trim()) continue
  for (const r of RULES) {
    const reason = r.test(src)
    if (reason) { rows.push({ slug, id: r.id, reason }); failed++ }
  }
}

if (!rows.length) { console.log(`mobile-gate: PASS (${slugs.length} preview(s))`); process.exit(0) }

const byRule = new Map()
for (const r of rows) { if (!byRule.has(r.id)) byRule.set(r.id, []); byRule.get(r.id).push(r) }
for (const [id, list] of byRule) {
  const rule = RULES.find(r => r.id === id)
  console.log(`\n── ${id} — ${list.length} build(s)`)
  console.log(`   why: ${rule.why}`)
  for (const r of list) console.log(`   FAIL  ${r.slug.padEnd(24)} ${r.reason}`)
}
console.log(`\nmobile-gate: ${failed} finding(s) across ${slugs.length} preview(s)`)
process.exit(1)
