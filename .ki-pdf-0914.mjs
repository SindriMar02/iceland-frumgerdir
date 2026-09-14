/* PDF for the 2026-09-14 audit, rendered by Chrome from the same findings as
   the DOCX (.ki-audit-0914-data.cjs). LibreOffice is not installed here, so
   the PDF is built from HTML rather than converted from the DOCX. */
import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const D = require('./.ki-audit-0914-data.cjs')
const { SEO, GEO, AEO } = D.SCORES
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const cls = (s) => s >= 8 ? 'g' : s >= 5 ? 'a' : 'r'
const status = (s) => s >= 8 ? 'Strong' : s >= 5 ? 'On Track' : 'Needs Work'
const F = (rows) => `<table class="f"><thead><tr><th>Signal</th><th>Finding</th><th>Status</th></tr></thead><tbody>${
  rows.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td class="st ${r[2] === 'Good' ? 'g' : r[2] === 'Missing' ? 'r' : 'a'}">${r[2]}</td></tr>`).join('')}</tbody></table>`
const prc = (x) => x === 'Critical' ? 'r' : x === 'High' ? 'o' : x === 'Medium' ? 'a' : 'g'

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page { size: Letter; margin: 22mm 20mm 20mm; }
@page :first { margin: 0; }
* { box-sizing: border-box; }
body { font-family: Arial, Helvetica, sans-serif; color: #1E293B; font-size: 10.5pt; line-height: 1.45; margin: 0; }
.cover { height: 279.4mm; background: #1B2A4A; color: #fff; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0 20mm; page-break-after: always; text-align: center; }
.cover h1 { font-size: 36pt; margin: 0 0 10px; }
.cover .sub { color: #93C5FD; font-size: 18pt; margin: 0 0 8px; }
.cover .kind { font-size: 11pt; letter-spacing: .12em; margin: 0 0 34px; }
.scores { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; width: 100%; max-width: 165mm; }
.scores div { padding: 22px 8px; }
.scores .l { font-size: 10pt; font-weight: bold; } .scores .n { font-size: 36pt; font-weight: bold; line-height: 1.1; } .scores .s { font-size: 9pt; font-style: italic; }
.foot { color: #94A3B8; font-size: 9pt; margin-top: 60px; line-height: 1.6; }
.g { background: #16A34A; } .a { background: #D97706; } .r { background: #DC2626; } .o { background: #EA580C; }
h1.h { color: #1B2A4A; font-size: 24pt; margin: 0 0 14px; }
h1.pb { page-break-before: always; }
h2 { color: #2563EB; font-size: 15pt; margin: 22px 0 10px; }
.summary { background: #EFF6FF; padding: 16px 18px; margin: 0 0 18px; font-size: 11pt; }
.score-line { font-weight: bold; font-size: 12pt; margin: 0 0 12px; }
table { width: 100%; border-collapse: collapse; margin: 0 0 10px; font-size: 9.5pt; page-break-inside: auto; }
tr { page-break-inside: avoid; }
th { background: #1B2A4A; color: #fff; text-align: left; padding: 7px 8px; }
td { border: 1px solid #E2E8F0; padding: 7px 8px; vertical-align: top; }
tbody tr:nth-child(even) td { background: #F8F9FA; }
td.st, td.pr { color: #fff; font-weight: bold; white-space: nowrap; }
td.st.g, td.pr.g { background: #16A34A !important; } td.st.a, td.pr.a { background: #D97706 !important; } td.st.r, td.pr.r { background: #DC2626 !important; } td.pr.o { background: #EA580C !important; }
table.f td:first-child { width: 26%; } table.f td:last-child { width: 17%; }
table.win td { background: #F0FDF4 !important; }
.note { font-size: 9.5pt; color: #475569; margin: 0 0 12px; }
</style></head><body>
<section class="cover">
  <h1>katrinisfeld.is</h1><p class="sub">SEO / GEO / AEO Audit Report</p><p class="kind">FULL AUDIT</p>
  <div class="scores">${[['SEO', SEO], ['GEO', GEO], ['AEO', AEO]].map(([k, s]) => `<div class="${cls(s)}"><div class="l">${k}</div><div class="n">${s}</div><div class="s">${status(s)}</div></div>`).join('')}</div>
  <div class="foot">${D.DATE}<br>Claude Skill and Plugin by Alex Labat</div>
</section>

<h1 class="h">Executive Summary</h1>
<div class="summary">${esc(D.SUMMARY)}</div>
<table><thead><tr><th>Dimension</th><th>Score</th><th>Status</th><th>Key Takeaway</th></tr></thead><tbody>
${[['SEO', SEO], ['GEO', GEO], ['AEO', AEO]].map(([k, s]) => `<tr><td>${k}</td><td class="st ${cls(s)}">${s}/10</td><td>${status(s)}</td><td>${esc(D.TAKEAWAY[k])}</td></tr>`).join('')}
<tr><td><b>Combined</b></td><td><b>${SEO + GEO + AEO}/30</b></td><td colspan="2"><i>Up from 21/30 on 7 September</i></td></tr></tbody></table>

<h1 class="h pb">Pages Audited</h1>
<p class="note">All 33 routes plus the 404 shell were read from the launch build compiled with KATRIN_SITE_URL=https://katrinisfeld.is, the exact HTML that will be served once the domain moves. The public preview is deliberately noindex; auditing it would report intended settings as failures.</p>
<table><thead><tr><th>URL</th><th>Page Type</th><th>Notes</th></tr></thead><tbody>
${D.A.map((x) => `<tr><td>${esc(x.route)}</td><td>${D.kind(x.route)}</td><td>${esc(D.note(x))}</td></tr>`).join('')}
</tbody></table>

<h1 class="h pb">SEO Analysis</h1><p class="score-line" style="color:#16A34A">Score: ${SEO}/10 — ${status(SEO)}</p>
<h2>Technical On-Page</h2>${F(D.SEO_TECH)}<h2>Content Quality</h2>${F(D.SEO_CONTENT)}<h2>Structured Data</h2>${F(D.SEO_SCHEMA)}

<h1 class="h pb">GEO Analysis</h1><p class="score-line" style="color:#16A34A">Score: ${GEO}/10 — ${status(GEO)}</p>
<h2>E-E-A-T Assessment</h2>${F(D.GEO_EEAT)}<h2>Content for AI Synthesis</h2>${F(D.GEO_SYNTH)}<h2>Technical GEO</h2>${F(D.GEO_TECH)}

<h1 class="h pb">AEO Analysis</h1><p class="score-line" style="color:#D97706">Score: ${AEO}/10 — ${status(AEO)}</p>
<h2>Featured Snippet Eligibility</h2>${F(D.AEO_SNIPPET)}<h2>Structured Answer Formats</h2>${F(D.AEO_FORMATS)}<h2>Voice Search Readiness</h2>${F(D.AEO_VOICE)}

<h1 class="h pb">Priority Recommendations</h1>
<table><thead><tr><th>Priority</th><th>Issue</th><th>Dimension</th><th>Effort</th><th>Impact</th></tr></thead><tbody>
${D.PR.map((r) => `<tr><td class="pr ${prc(r[0])}">${r[0]}</td><td>${esc(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')}
</tbody></table>

<h1 class="h pb">What's Working Well</h1>
<table class="win"><thead><tr><th>Strength</th><th>Evidence from the crawl</th></tr></thead><tbody>
${D.WW.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td></tr>`).join('')}
</tbody></table>

<h1 class="h pb">Glossary</h1>
<p><b>SEO — Search Engine Optimization.</b> Ranking in a conventional results list: titles, descriptions, headings, links, crawlability and content depth.</p>
<p><b>GEO — Generative Engine Optimization.</b> Being cited by AI answer engines such as ChatGPT Search, Perplexity, Gemini and Google AI Overviews. These reward clear entities, verifiable facts, authority signals and HTML that renders without JavaScript.</p>
<p><b>AEO — Answer Engine Optimization.</b> Being chosen as the direct answer in featured snippets, People Also Ask boxes and voice assistants. This rewards question-phrased headings, short factual answers directly beneath them, and FAQ or HowTo markup.</p>
<p class="note">Not assessable from HTML: live Core Web Vitals and backlink profile. Run pagespeed.web.dev once the domain is live, and Ahrefs or Semrush for backlinks.</p>
</body></html>`

writeFileSync('/tmp/ki-report-0914.html', html)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage()
await p.setContent(html, { waitUntil: 'networkidle0' })
await p.pdf({ path: D.OUT + '.pdf', format: 'Letter', printBackground: true, preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: '<div style="font-family:Arial;font-size:8pt;color:#1B2A4A;width:100%;margin:0 20mm;padding-top:6mm;border-bottom:1px solid #1B2A4A;display:flex;justify-content:space-between"><span>katrinisfeld.is</span><span>SEO / GEO / AEO Audit Report</span></div>',
  footerTemplate: '<div style="font-family:Arial;font-size:8pt;color:#94A3B8;width:100%;margin:0 20mm;padding-bottom:5mm;border-top:1px solid #E2E8F0;display:flex;justify-content:space-between"><span>Claude Skill and Plugin by Alex Labat</span><span class="pageNumber"></span></div>' })
await br.close()
console.log('PDF written:', D.OUT + '.pdf')
