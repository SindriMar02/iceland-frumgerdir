#!/usr/bin/env node
/* Turns a markdown outreach draft into a Mail payload, and refuses to emit one
   that LOOKS generated. Content rules live in memory [[outreach-email-guide]];
   these are the SHAPE rules from [[feedback-outreach-email-layout-tell]], which
   a copy re-read cannot catch.

   Usage:
     node outreach-draft-gate.mjs <draft.md> [payload.json]
   Then:
     node open-outreach-mail.mjs <payload.json>

   THE UNWRAP IS THE POINT. A draft written as a markdown file is hard-wrapped
   at ~80 columns, and mailto: preserves every one of those newlines literally,
   so Mail renders a narrow ragged column that breaks mid-sentence. Nobody
   typing an email at a desk produces that. A real message is ONE line per
   paragraph, wrapped by the reader's client to the reader's window. */

import { readFileSync, writeFileSync } from 'node:fs'

const draftPath = process.argv[2]
if (!draftPath) { console.error('usage: outreach-draft-gate.mjs <draft.md> [payload.json]'); process.exit(1) }
const outPath = process.argv[3] || draftPath.replace(/\.md$/, '') + '.payload.json'
const src = readFileSync(draftPath, 'utf8')

const to = (src.match(/\*\*To:\*\*\s*(.+)/) || [, ''])[1].trim()
const subject = (src.match(/\*\*Subject:\*\*\s*(.+)/) || [])[1]?.trim()
const greetingRe = /^(Sæl og blessuð|Sæl|Sæll|Góðan dag|Komdu sæl)/m
const gm = src.match(greetingRe)
if (!subject || !gm) { console.error('FAIL  draft needs a **Subject:** line and a greeting'); process.exit(1) }

// everything from the greeting to the end of the sign-off block
let raw = src.slice(src.indexOf(gm[0]))
raw = raw.split(/\n---/)[0].replace(/\s+$/, '')

/* Unwrap: inside a paragraph, a lone newline is a typesetting artifact of the
   markdown file and becomes a space. Blank lines stay as paragraph breaks. The
   sign-off is exempt — name, phone and URL are genuinely separate lines. */
const signIdx = raw.search(/^Bestu kveðjur,/m)
const prose = signIdx === -1 ? raw : raw.slice(0, signIdx)
const sign = signIdx === -1 ? '' : raw.slice(signIdx)
const paras = prose.split(/\n\s*\n/).map(p => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean)
const body = paras.join('\n\n') + (sign ? '\n\n' + sign.trim() : '')

// ── the shape checks ────────────────────────────────────────────────────────
const bodyParas = body.split(/\n\s*\n/).map(s => s.trim()).filter(p => /\p{L}/u.test(p))
const proseParas = bodyParas.filter(p => !/^Bestu kveðjur,/.test(p))
const linkOnly = proseParas.filter(p => /^https?:\/\/\S+$/.test(p))
const hardWrapped = proseParas.filter(p => p.includes('\n'))
/* The greeting and the closing line are SUPPOSED to be one line each — that is
   how a person opens and closes a letter. The tell is the middle being chopped
   into cards, so only the middle is judged. */
const middle = proseParas.slice(1, -1)
const fragments = middle.filter(p => p.split(/[.!?]\s/).length < 2)
const dashes = (body.match(/[—–]/g) || []).length
const words = prose.split(/\s+/).filter(Boolean).length

let bad = 0
const check = (ok, name, detail = '') => {
  console.log(`${ok ? 'pass' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
  if (!ok) bad++
}
check(hardWrapped.length === 0, 'paragraphs are single lines, wrapped by the reader\'s client',
  hardWrapped.length ? `${hardWrapped.length} still carry hard line breaks` : '')
check(linkOnly.length === 0, 'link is folded into a sentence, not set apart as a CTA',
  linkOnly.length ? `${linkOnly.length} link-only paragraph(s)` : '')
check(middle.length >= 2 && middle.length <= 4, 'reads as continuous prose, not scannable cards',
  `${middle.length} body paragraphs between greeting and close (want 2-4)`)
check(fragments.length === 0, 'no one-line fragments in the body',
  fragments.length ? `${fragments.length} found` : '')
check(dashes === 0, 'no em/en dashes', dashes ? `${dashes} found` : '')
check(/https?:\/\//.test(body), 'the preview link is present')
check(words >= 120 && words <= 300, 'length is warmth, not terseness', `${words} words`)
check(!/(gera við hana|megið eiga|ykkar eign|frítt að nota)/i.test(body),
  'no clause handing the prototype over')
check(!/\d[\d.]*\s*(kr|ISK)\b|verðskrá|áskrift á|á mánuði/i.test(body),
  'no pricing in the body')
check(/^Bestu kveðjur,\nSindri Már\n845 1758\nsndr-studio\.pages\.dev$/m.test(body.trim()),
  'sign-off is the canonical four lines')

if (bad) { console.error(`\n${bad} problem(s). No payload written.`); process.exit(1) }
writeFileSync(outPath, JSON.stringify({ to, subject, body, revealBanner: false }, null, 2))
console.log(`\nDraft is clean. Payload: ${outPath}`)
console.log(`Longest paragraph: ${Math.max(...proseParas.map(p => p.length))} chars on ONE line.`)
