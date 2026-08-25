/**
 * Nýpugarðar — turn the raw review harvest into the file the page ships.
 *
 *   node tools/nypugardar-reviews-build.mjs <raw.json>
 *   → src/preview/nypugardar/reviews.json
 *
 * WHAT SHIPS AND WHAT DOES NOT. Every review Booking lists is harvested, but
 * only the ones with WRITTEN WORDS can be shown — on this listing roughly 840
 * of them are a score and nothing else, and a card with no sentence in it is a
 * blank card, not a review. The score-only ones are already represented on the
 * page: they are inside the 8.8 and inside the review count above the rotator.
 * So this writes out every review that has text, and records how many were
 * score-only so the page can say so rather than quietly rounding the number
 * down.
 *
 * ONLY WHAT THE GUEST LIKED IS WRITTEN OUT. Sindri's call, 2026-08-25, and the
 * right one: the rotator runs on Bogga's own homepage, and a card that is
 * nothing but a complaint is not a testimonial. The "what could be better"
 * note each guest wrote is NOT written out at all. Carrying 807 unused strings
 * to a browser cost 40 KB gzipped on a chunk every reader of that section
 * downloads, to serve a code path nothing calls. Set KEEP_CRITICISM below and
 * re-run to bring it back; the harvest itself already captured it.
 *
 * The consequence to be honest about: reviews where the guest wrote ONLY a
 * criticism cannot be shown at all, because there is nothing left of them once
 * the criticism is hidden. Those are dropped here rather than shipped as blank
 * cards, and counted, so the line under the rotator can describe what it is
 * actually showing instead of quietly overstating it. The full unedited text,
 * criticism and all, is one click away on Booking, which the page links.
 *
 * Trivial "Nothing"-type answers are dropped from the criticism field, because
 * "Nothing" is a guest declining to complain and storing it as a complaint
 * would misrepresent them.
 *
 * FIELD NAMES ARE ONE LETTER ON PURPOSE. This is ~1,100 records shipped to a
 * browser; `t/n/c/d/s/g` over `text/name/country/date/score/gripe` is about
 * 40 KB of the payload.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'src/preview/nypugardar/reviews.json')
const RAW = process.argv[2]

if (!RAW) {
  console.error('usage: node tools/nypugardar-reviews-build.mjs <raw.json>')
  process.exit(1)
}

/** "Nothing", "N/A", "-" — a guest declining to complain, not a complaint. */
const TRIVIAL =
  /^(nothing|none|nothing really|nothing at all|nothing!|nothing\.|no|nope|na|n\/a|-|\.|nothing to complain( about)?|nothing to complain!|all good|nothing i can think of|nothing negative|no complaints|everything was (great|fine|good|perfect))[.!]*$/i

const has = (s) => typeof s === 'string' && s.trim().length > 1

/** Ship each guest's "what could be better" note. Off — see the note above. */
const KEEP_CRITICISM = false

const raw = JSON.parse(readFileSync(RAW, 'utf8'))

let scoreOnly = 0
let criticismOnly = 0
let hadCriticism = 0
const out = []
for (const r of raw) {
  const pos = has(r.pos) ? r.pos.trim() : ''
  const negRaw = has(r.neg) ? r.neg.trim() : ''
  const neg = negRaw && !TRIVIAL.test(negRaw) ? negRaw : ''
  if (!pos && !neg) {
    scoreOnly += 1
    continue
  }
  if (!pos) {
    /* Nothing to show once the criticism is hidden. Counted, not shipped. */
    criticismOnly += 1
    continue
  }
  if (neg) hadCriticism += 1
  out.push({
    t: pos,
    ...(KEEP_CRITICISM && neg ? { g: neg } : {}),
    n: r.name || '',
    c: r.country || '',
    d: r.date || '',
    s: r.score ?? null,
  })
}

const payload = {
  /** Distinct reviews on the listing after deduping repeated cards. */
  listed: raw.length,
  /** Reviews the rotator can show: the guest wrote something they liked. */
  written: out.length,
  /** A score and nothing else — no words to show. */
  scoreOnly,
  /** Wrote only a criticism, so nothing remains once criticism is hidden. */
  criticismOnly,
  /** How many of the shipped reviews also carried a criticism, whether or not
   *  it was written out — the honest denominator for that decision. */
  withCriticism: hadCriticism,
  harvested: '2026-08-25',
  reviews: out,
}

const json = JSON.stringify(payload)
writeFileSync(OUT, json + '\n')

console.log(`[nypugardar-reviews-build] ${OUT}`)
console.log(`  harvested        ${raw.length}`)
console.log(`  written reviews  ${out.length}`)
console.log(`  score only       ${scoreOnly}`)
console.log(`  criticism only   ${criticismOnly} (cannot render, not shipped)`)
console.log(`  with criticism   ${payload.withCriticism}`)
console.log(`  payload          ${(json.length / 1024).toFixed(0)} KB raw · ${(gzipSync(json).length / 1024).toFixed(0)} KB gzipped`)
