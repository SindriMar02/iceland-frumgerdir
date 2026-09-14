/* DOCX for the 2026-09-14 audit. Findings live in .ki-audit-0914-data.cjs. */
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer,
        AlignmentType, HeadingLevel, BorderStyle, WidthType, VerticalAlign, PageNumber, PageBreak } = require('docx')
const fs = require('fs')
const D = require('./.ki-audit-0914-data.cjs')

const NAVY = '1B2A4A', BLUE = '2563EB', GREEN = '16A34A', AMBER = 'D97706', RED = 'DC2626',
  GRAYBG = 'F8F9FA', BORDER = 'E2E8F0', INK = '1E293B', LIGHTBLUE = 'EFF6FF', ORANGE = 'EA580C'
const F = 'Arial'
const { SEO, GEO, AEO } = D.SCORES
const col = (s) => s >= 8 ? GREEN : s >= 5 ? AMBER : RED
const status = (s) => s >= 8 ? 'Strong' : s >= 5 ? 'On Track' : 'Needs Work'
const P = (text, o = {}) => new Paragraph({ alignment: o.align, spacing: { before: o.before || 0, after: o.after === undefined ? 120 : o.after },
  shading: o.shade ? { type: 'clear', fill: o.shade } : undefined, heading: o.heading,
  children: [new TextRun({ text, font: F, size: (o.size || 11) * 2, bold: o.bold, italics: o.italic, color: o.color || INK })] })
const line = { style: BorderStyle.SINGLE, size: 2, color: BORDER }, none = { style: BorderStyle.NONE }
const cell = (children, o = {}) => new TableCell({ children, shading: o.fill ? { type: 'clear', fill: o.fill } : undefined,
  width: o.w ? { size: o.w, type: WidthType.DXA } : undefined, verticalAlign: VerticalAlign.CENTER,
  margins: { top: o.pad || 80, bottom: o.pad || 80, left: 110, right: 110 },
  borders: o.noBorder ? { top: none, bottom: none, left: none, right: none } : { top: line, bottom: line, left: line, right: line } })
const tbl = (rows) => new Table({ rows, width: { size: 9360, type: WidthType.DXA },
  borders: { top: line, bottom: line, left: line, right: line, insideHorizontal: line, insideVertical: line } })
const head = (labels, widths) => new TableRow({ tableHeader: true, children: labels.map((l, i) => cell([P(l, { bold: true, size: 10, color: 'FFFFFF' })], { fill: NAVY, w: widths[i] })) })
const row = (cells, widths, i, fills) => new TableRow({ children: cells.map((c, j) =>
  cell([P(c, { size: 10, color: fills && fills[j] ? 'FFFFFF' : INK, bold: !!(fills && fills[j]) })], { fill: (fills && fills[j]) || (i % 2 ? GRAYBG : undefined), w: widths[j] })) })
const stFill = (s) => s === 'Good' ? GREEN : s === 'Missing' ? RED : AMBER
const findings = (rows, widths = [2400, 5100, 1860]) => tbl([head(['Signal', 'Finding', 'Status'], widths),
  ...rows.map((r, i) => row(r, widths, i, [null, null, stFill(r[2])]))])

const scoreCell = (label, s) => cell([
  P(label, { align: AlignmentType.CENTER, size: 10, bold: true, color: 'FFFFFF', after: 40 }),
  P(String(s), { align: AlignmentType.CENTER, size: 36, bold: true, color: 'FFFFFF', after: 40 }),
  P(status(s), { align: AlignmentType.CENTER, size: 9, italic: true, color: 'FFFFFF' }),
], { fill: col(s), w: 3120, pad: 260, noBorder: true })
const cover = [
  P('', { after: 1800 }),
  P('katrinisfeld.is', { align: AlignmentType.CENTER, size: 36, bold: true, color: 'FFFFFF', after: 160 }),
  P('SEO / GEO / AEO Audit Report', { align: AlignmentType.CENTER, size: 18, color: '93C5FD', after: 160 }),
  P('FULL AUDIT', { align: AlignmentType.CENTER, size: 11, color: 'FFFFFF', after: 400 }),
  new Table({ rows: [new TableRow({ children: [scoreCell('SEO', SEO), scoreCell('GEO', GEO), scoreCell('AEO', AEO)] })],
    width: { size: 9360, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none } }),
  P('', { after: 1800 }),
  P(D.DATE, { align: AlignmentType.CENTER, size: 9, color: '94A3B8', after: 40 }),
  P('Claude Skill and Plugin by Alex Labat', { align: AlignmentType.CENTER, size: 9, color: '94A3B8' }),
]

const body = []
const H1 = (t) => body.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 180 }, children: [new TextRun({ text: t, font: F, size: 48, bold: true, color: NAVY })] }))
const H2 = (t) => body.push(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 140 }, children: [new TextRun({ text: t, font: F, size: 36, bold: true, color: BLUE })] }))
const p = (t, o) => body.push(P(t, o))
const br = () => body.push(new Paragraph({ children: [new PageBreak()] }))

H1('Executive Summary')
body.push(new Table({ rows: [new TableRow({ children: [cell([P(D.SUMMARY, { size: 11 })], { fill: LIGHTBLUE, w: 9360, pad: 200, noBorder: true })] })],
  width: { size: 9360, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none } }))
p('', { after: 200 })
const sw = [1900, 1300, 1700, 4460]
body.push(tbl([head(['Dimension', 'Score', 'Status', 'Key Takeaway'], sw),
  ...[['SEO', SEO], ['GEO', GEO], ['AEO', AEO]].map(([k, s], i) => new TableRow({ children: [
    cell([P(k, { size: 10 })], { w: sw[0], fill: i % 2 ? GRAYBG : undefined }),
    cell([P(`${s}/10`, { size: 10, bold: true, color: 'FFFFFF' })], { fill: col(s), w: sw[1] }),
    cell([P(status(s), { size: 10 })], { w: sw[2], fill: i % 2 ? GRAYBG : undefined }),
    cell([P(D.TAKEAWAY[k], { size: 10 })], { w: sw[3], fill: i % 2 ? GRAYBG : undefined })] })),
  new TableRow({ children: [cell([P('Combined', { size: 10, bold: true })], { fill: GRAYBG, w: sw[0] }), cell([P(`${SEO + GEO + AEO}/30`, { size: 10, bold: true })], { fill: GRAYBG, w: sw[1] }),
    cell([P('Up from 21/30 on 7 September', { size: 10, italic: true })], { fill: GRAYBG, w: sw[2] }), cell([P('', { size: 10 })], { fill: GRAYBG, w: sw[3] })] }),
]))

br(); H1('Pages Audited')
p('All 33 routes plus the 404 shell were read from the launch build compiled with KATRIN_SITE_URL=https://katrinisfeld.is, the exact HTML that will be served once the domain moves. The public preview at katrin-isfeld.pages.dev is deliberately noindex; auditing it would report intended settings as failures.', { size: 10, after: 200 })
const pw = [3500, 1600, 4260]
body.push(tbl([head(['URL', 'Page Type', 'Notes'], pw), ...D.A.map((x, i) => row([x.route, D.kind(x.route), D.note(x)], pw, i))]))

br(); H1('SEO Analysis'); p(`Score: ${SEO}/10 — ${status(SEO)}`, { bold: true, color: col(SEO), size: 12, after: 200 })
H2('Technical On-Page'); body.push(findings(D.SEO_TECH))
H2('Content Quality'); body.push(findings(D.SEO_CONTENT))
H2('Structured Data'); body.push(findings(D.SEO_SCHEMA))

br(); H1('GEO Analysis'); p(`Score: ${GEO}/10 — ${status(GEO)}`, { bold: true, color: col(GEO), size: 12, after: 200 })
H2('E-E-A-T Assessment'); body.push(findings(D.GEO_EEAT))
H2('Content for AI Synthesis'); body.push(findings(D.GEO_SYNTH))
H2('Technical GEO'); body.push(findings(D.GEO_TECH))

br(); H1('AEO Analysis'); p(`Score: ${AEO}/10 — ${status(AEO)}`, { bold: true, color: col(AEO), size: 12, after: 200 })
H2('Featured Snippet Eligibility'); body.push(findings(D.AEO_SNIPPET))
H2('Structured Answer Formats'); body.push(findings(D.AEO_FORMATS))
H2('Voice Search Readiness'); body.push(findings(D.AEO_VOICE))

br(); H1('Priority Recommendations')
const rw = [1400, 4200, 1260, 1200, 1300]
const prFill = (x) => x === 'Critical' ? RED : x === 'High' ? ORANGE : x === 'Medium' ? AMBER : GREEN
body.push(tbl([head(['Priority', 'Issue', 'Dimension', 'Effort', 'Impact'], rw), ...D.PR.map((r, i) => row(r, rw, i, [prFill(r[0]), null, null, null, null]))]))

br(); H1("What's Working Well")
const ww = [2600, 6760]
body.push(tbl([head(['Strength', 'Evidence from the crawl'], ww),
  ...D.WW.map((r) => new TableRow({ children: [cell([P(r[0], { size: 10, bold: true })], { fill: 'F0FDF4', w: ww[0] }), cell([P(r[1], { size: 10 })], { fill: 'F0FDF4', w: ww[1] })] }))]))

br(); H1('Glossary')
p('SEO — Search Engine Optimization. Ranking in a conventional results list: titles, descriptions, headings, links, crawlability and content depth.', { size: 10 })
p('GEO — Generative Engine Optimization. Being cited by AI answer engines such as ChatGPT Search, Perplexity, Gemini and Google AI Overviews. These reward clear entities, verifiable facts, authority signals and HTML that renders without JavaScript.', { size: 10 })
p('AEO — Answer Engine Optimization. Being chosen as the direct answer in featured snippets, People Also Ask boxes and voice assistants. This rewards question-phrased headings, short factual answers directly beneath them, and FAQ or HowTo markup.', { size: 10 })
p('Not assessable from HTML: live Core Web Vitals and backlink profile. Run pagespeed.web.dev once the domain is live, and Ahrefs or Semrush for backlinks.', { size: 10, italic: true })

const page = { size: { width: 12240, height: 15840 }, margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
const doc = new Document({
  styles: { default: { document: { run: { font: F, size: 22, color: INK } } } },
  background: { color: 'FFFFFF' },
  sections: [
    /* the navy ground lives in one full-width cell: Word has no portable
       per-section page colour, and white type on a white page is invisible */
    { properties: { page }, children: [new Table({
      rows: [new TableRow({ height: { value: 12600, rule: 'atLeast' }, children: [cell(cover, { fill: NAVY, w: 9360, pad: 400, noBorder: true })] })],
      width: { size: 9360, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none } })] },
    { properties: { page },
      headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY } }, tabStops: [{ type: 'right', position: 9360 }],
        children: [new TextRun({ text: 'katrinisfeld.is', font: F, size: 18, color: NAVY }), new TextRun({ text: '\tSEO / GEO / AEO Audit Report', font: F, size: 18, color: NAVY })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 6, color: BORDER } }, tabStops: [{ type: 'right', position: 9360 }],
        children: [new TextRun({ text: 'Claude Skill and Plugin by Alex Labat', font: F, size: 18, color: '94A3B8' }), new TextRun({ text: '\t', font: F, size: 18 }), new TextRun({ children: [PageNumber.CURRENT], font: F, size: 18, color: '94A3B8' })] })] }) },
      children: body },
  ],
})
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(D.OUT + '.docx', b); console.log('DOCX written:', D.OUT + '.docx', (b.length / 1024).toFixed(0) + 'KB') })
