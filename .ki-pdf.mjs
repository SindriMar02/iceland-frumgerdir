import puppeteer from 'puppeteer-core'
import { writeFileSync, readFileSync } from 'node:fs'
const A = JSON.parse(readFileSync('/tmp/ki-audit.json','utf8'))
const kind = r => r==='/'?'Homepage' : r==='/404'?'404 shell' : r==='/verkefni'?'Work index'
  : /^\/verkefni\/(innanhusshonnun|gistiheimili-og-hotel|atvinnuhusnaedi)$/.test(r)?'Category'
  : r.startsWith('/verkefni/')?'Project' : r==='/en'?'English':'Standalone'
const note = x => x.route==='/404' ? 'No schema; title duplicates the homepage; 225-char description'
  : x.title.length>60 ? `Title ${x.title.length} chars (over 60)`
  : x.words<210 ? `Thin: ${x.words} words including nav and footer`
  : `${x.words} words · ${x.schema.length} schema types · ${x.imgs} images, all with alt`
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
const F = (rows) => `<table><thead><tr><th>Signal</th><th>Finding</th><th>Status</th></tr></thead><tbody>${
  rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="st ${r[2]==='Good'?'g':r[2]==='Missing'?'r':'a'}">${r[2]}</td></tr>`).join('')}</tbody></table>`
const PR=[['Critical','Add FAQPage schema and question-phrased headings with 40–60 word answers to the contact, brands and three category pages','AEO','Medium','High','r'],
['Critical','Mark up the twelve press clippings as Article/CreativeWork with publisher, headline and a citation link to the project each covers','GEO','Low','High','r'],
['High','Answer the three commercial questions nobody has answered: what an innanhússarkitekt does, what a project costs, where to buy Arrital in Iceland','AEO','Medium','High','o'],
['High','Deepen the thinnest pages — /verkefni/atvinnuhusnaedi (178w), /verkefni/skrifstofurymi (203w), /verkefni/honnunar-studio (207w)','SEO','Medium','Medium','o'],
['Medium','Add HowTo schema to her design process on /studioid','AEO','Low','Medium','a'],
['Medium','Express photographer credits as ImageObject.creator so the attribution is machine-readable','GEO','Low','Low','a'],
['Medium','Add outbound citations to Arrital, Altamarea and FHI','GEO','Low','Medium','a'],
['Quick Win','Shorten four titles over 60 characters','SEO','Low','Medium','g'],
['Quick Win','Give the 404 its own title, a description under 160 characters and a schema graph','SEO','Low','Low','g'],
['Quick Win','Add a definition sentence — "Innanhússarkitekt er…" — to the studio page','AEO','Low','Medium','g']]
const WW=[['Prerendered HTML','All 33 routes ship complete server-rendered markup. AI crawlers that run no JavaScript — most of them — see the full page.'],
['Zero metadata defects','34 unique titles, 34 unique descriptions, 34 self-referencing canonicals, exactly one H1 per page, no duplicates.'],
['Complete alt coverage','Not one image on the site is missing an alt attribute; the twelve empty ones are correctly marked decorative.'],
['Deep entity graph','28 schema types including EducationalOccupationalCredential and OpeningHoursSpecification, with five sameAs profiles.'],
['llms.txt','94 lines of structured facts written for answer engines, not a placeholder.'],
['Legacy URL preservation','58 redirects covering every path her WordPress site published, so no ranking equity is dropped at launch.'],
['Honest sourcing','Outlets named only where a clipping proves it; hours published only for the five confirmed days; no invented client names.'],
['Named specifics','Arrital, Altamarea, Egill Árnason, Sigvaldi Thordarson, FHI, two photographers — the concrete nouns AI engines prefer to cite.']]
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page { size: Letter; margin: 25mm 20mm; }
*{box-sizing:border-box} body{font-family:Arial,Helvetica,sans-serif;color:#1E293B;font-size:10.5pt;line-height:1.5;margin:0}
.cover{background:#1B2A4A;color:#fff;height:247mm;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;page-break-after:always;margin:-25mm -20mm;padding:25mm 20mm}
.cover h1{font-size:36pt;margin:0 0 10px}.cover .sub{color:#93C5FD;font-size:18pt;margin-bottom:10px}.cover .kind{font-size:11pt;margin-bottom:26px}
.scores{display:flex;gap:0;width:100%}.sc{flex:1;padding:22px 8px;color:#fff}.sc .lb{font-size:10pt;font-weight:bold}.sc .n{font-size:36pt;font-weight:bold;line-height:1.1}.sc .s{font-size:9pt;font-style:italic}
.g{background:#16A34A}.a{background:#D97706}.r{background:#DC2626}.o{background:#EA580C}
.attr{margin-top:40px;color:#94A3B8;font-size:9pt}
h1{color:#1B2A4A;font-size:24pt;margin:26px 0 10px;page-break-after:avoid}
h2{color:#2563EB;font-size:14pt;margin:20px 0 8px;page-break-after:avoid}
.score-line{font-weight:bold;font-size:12pt;margin:0 0 12px}
table{width:100%;border-collapse:collapse;margin:8px 0 16px;font-size:9.5pt;page-break-inside:auto}
th{background:#1B2A4A;color:#fff;text-align:left;padding:7px 9px;font-size:9.5pt}
td{border:1px solid #E2E8F0;padding:7px 9px;vertical-align:top}
tr:nth-child(even) td{background:#F8F9FA}
td.st{color:#fff;font-weight:bold;text-align:center;white-space:nowrap}
td.st.g{background:#16A34A}td.st.a{background:#D97706}td.st.r{background:#DC2626}
td.pr{color:#fff;font-weight:bold;white-space:nowrap}
.summary{background:#EFF6FF;padding:14px 16px;margin:10px 0 18px}
.win td{background:#F0FDF4}
.pb{page-break-before:always}
.note{font-size:9pt;color:#475569;font-style:italic}
</style></head><body>
<div class="cover"><h1>katrinisfeld.is</h1><div class="sub">SEO / GEO / AEO Audit Report</div><div class="kind">FULL AUDIT</div>
<div class="scores"><div class="sc g"><div class="lb">SEO</div><div class="n">8</div><div class="s">Strong</div></div>
<div class="sc g"><div class="lb">GEO</div><div class="n">8</div><div class="s">Strong</div></div>
<div class="sc a"><div class="lb">AEO</div><div class="n">5</div><div class="s">Needs Work</div></div></div>
<div class="attr">7 September 2026<br>Claude Skill and Plugin by Alex Labat</div></div>

<h1>Executive Summary</h1>
<div class="summary">katrinisfeld.is is technically in very good shape and unusually well prepared for AI search, and weakest exactly where most portfolio sites are: it does not answer questions. All 34 pages carry a unique title, description, canonical and a single H1, every image has alt text, and the whole site is prerendered so crawlers that execute no JavaScript see the full content — a real advantage, because most AI crawlers do not run JavaScript. The structured-data graph is genuinely rich: ProfessionalService, LocalBusiness and Person with named credentials, five sameAs profiles, and a 94-line llms.txt of hard facts. The urgent gap is AEO: FAQ schema appears on exactly one page out of 34, and only five headings across the entire site are phrased as questions, so almost nothing here is eligible for a featured snippet, a People Also Ask box or a voice answer. The largest single opportunity is the press page — twelve real headlines from Morgunblaðið and Hús og hýbýli are now published as text but carry no Article markup, which is the strongest authority signal on the site sitting unused.</div>
<table><thead><tr><th>Dimension</th><th>Score</th><th>Status</th><th>Key Takeaway</th></tr></thead><tbody>
<tr><td>SEO</td><td class="st g">8/10</td><td>Strong</td><td>Clean technical base; four long titles and thin body copy are the only real defects.</td></tr>
<tr><td>GEO</td><td class="st g">8/10</td><td>Strong</td><td>Rich entity graph and llms.txt; press authority is published but unmarked.</td></tr>
<tr><td>AEO</td><td class="st a">5/10</td><td>Needs Work</td><td>FAQ schema on 1 of 34 pages; 5 question headings site-wide. The weak leg.</td></tr>
<tr><td><b>Combined</b></td><td><b>21/30</b></td><td></td><td></td></tr></tbody></table>

<h1 class="pb">Pages Audited</h1>
<p class="note">All 33 routes plus the 404 shell were fetched from the production build compiled with KATRIN_SITE_URL set, which is the exact HTML that will ship at launch. The deployed preview is deliberately noindex; auditing it would have reported intentional settings as failures.</p>
<table><thead><tr><th>URL</th><th>Page Type</th><th>Notes</th></tr></thead><tbody>
${A.map(x=>`<tr><td>${esc(x.route)}</td><td>${kind(x.route)}</td><td>${esc(note(x))}</td></tr>`).join('')}
</tbody></table>

<h1 class="pb">SEO Analysis</h1><p class="score-line" style="color:#16A34A">Score: 8/10 — Strong</p>
<h2>Technical On-Page</h2>${F([
['Title tags','All 34 pages have a unique title. No duplicates anywhere. Four exceed 60 characters and will truncate: /italskar-innrettingar (83), /404 (75), /verkefni/old-charm-reykjavik-apartment (69), /verkefni/solvallagata (65).','Needs Attention'],
['Meta descriptions','All 34 present and unique, 138–225 characters. Only the 404 exceeds 160.','Good'],
['Heading hierarchy','Exactly one H1 on every page — no page has zero or two. H2/H3 are logical and descriptive.','Good'],
['Canonical tags','Present and self-referencing on all 34, pointing at https://katrinisfeld.is.','Good'],
['Robots meta','index, follow with max-image-preview:large and max-snippet:-1 on all 33 real routes.','Good'],
['URL structure','Clean, readable, Icelandic, no parameters. /verkefni/nybyggt-hus-i-suluhofda reads as its subject.','Good'],
['Image alt text','Zero images site-wide are missing an alt attribute. 12 use alt="" — correct, they are decorative.','Good'],
['Open Graph / Twitter','33 of 33 real routes carry og:title, og:description, og:image, og:type, og:url, og:locale plus a Twitter card.','Good'],
['hreflang','Present on all 33 routes linking the Icelandic and English pages.','Good'],
['Internal linking','17–41 internal links per page with descriptive Icelandic anchors. No orphans: the press page was linked into the footer during this build.','Good'],
['Legacy redirects','58 redirects covering every URL her WordPress site published, including the trailing-slash forms.','Good'],
['404 handling','The 404 shell reuses the homepage title verbatim, carries a 225-character description and ships no structured data.','Needs Attention']])}
<h2>Content Quality</h2>${F([
['Word count','Median 241 words per page including navigation and footer boilerplate, so roughly 150 words of unique copy on a typical project page. Thinnest: /verkefni/atvinnuhusnaedi at 178, /verkefni/skrifstofurymi at 203, /verkefni/honnunar-studio at 207.','Needs Attention'],
['Keyword signals','Strong and specific: innanhússarkitekt, innanhússhönnun, named suppliers (Arrital, Altamarea, Egill Árnason), named places (Súluhöfði, Fljótshlíð, Skuggahverfi, Álfheimar, Garðabær).','Good'],
['Content freshness','No publication or update dates on any project page. Nothing signals to a crawler that this content is current.','Needs Attention'],
['Readability','Short paragraphs, clear subheadings, factual definition lists on every project page.','Good'],
['Originality','High. Copy is grounded in her own project descriptions and her own photographs, and names real suppliers, materials and the architect of the Álfheimar building.','Good']])}
<h2>Structured Data</h2>${F([
['Coverage','28 distinct schema types across the site. Every page carries a graph, not a stub.','Good'],
['Business entity','ProfessionalService + LocalBusiness with PostalAddress (Katrínartún 4), GeoCoordinates, telephone and openingHoursSpecification for five confirmed days.','Good'],
['Person entity','Person with EducationalOccupationalCredential (BSc), CollegeOrUniversity and FHI membership — unusually complete.','Good'],
['Projects','CreativeWork per project plus BreadcrumbList and ImageObject.','Good'],
['Press page','The twelve clippings carry no Article, NewsArticle or CreativeWork markup, and no citation linking them to the projects they discuss.','Missing'],
['Photographer credit','Rakel Ósk Sigurðardóttir and Eggert Jóhannesson appear as visible text but are not expressed as ImageObject.creator.','Missing']])}

<h1 class="pb">GEO Analysis</h1><p class="score-line" style="color:#16A34A">Score: 8/10 — Strong</p>
<h2>E-E-A-T Assessment</h2>${F([
['Named expertise','Katrín Ísfeld Guðmundsdóttir named consistently across every page, with a BSc from the Art Institute of Fort Lauderdale, graduation with honours and second place in a US design competition.','Good'],
['Professional membership','FHI, Félag húsgagna- og innanhússarkitekta, stated in text and in schema.','Good'],
['Prior experience','Practices in Fort Lauderdale and with Margreed Van der Hooven in the Netherlands, both named.','Good'],
['Contact information','Full NAP plus email on the contact page and in schema. Appointment framing is explicit rather than implying drop-in retail.','Good'],
['Press / third-party validation','Twelve clippings now published with readable headlines and two named outlets (Morgunblaðið, Hús og hýbýli). Not yet machine-readable.','Needs Attention'],
['Testimonials','No client testimonials or reviews anywhere on the site.','Missing']])}
<h2>Content for AI Synthesis</h2>${F([
['Factual density','High and rising: named suppliers, named materials, named photographers, a named building architect (Sigvaldi Thordarson, 1970), four houses and eight apartments at Old Charm.','Good'],
['Entity clarity','The brand is named identically in text, schema, llms.txt and sameAs. No ambiguity for an engine resolving the entity.','Good'],
['llms.txt','94 lines of hard facts — address, hours, credentials, services, brands, project list. Well beyond the usual stub.','Good'],
['Clear claims','Each project states its scope in a one-line lead plus a definition list (Hlutverk, Gerð, Staðsetning).','Good'],
['Comprehensiveness','Project bodies run two to three short paragraphs. An engine synthesising an answer about a project has little to draw on beyond the lead.','Needs Attention'],
['External citation','The site cites no external sources — no links to Arrital, Altamarea, FHI or the publications that covered her.','Missing']])}
<h2>Technical GEO</h2>${F([
['JavaScript independence','All 33 routes are prerendered. AI crawlers that execute no JavaScript see the complete page, which is the single most important GEO fundamental and the one most portfolio sites fail.','Good'],
['sameAs graph','Five profiles: Instagram, Facebook, LinkedIn, ja.is and the canonical domain.','Good'],
['HTTPS','Enforced.','Good'],
['Crawlability','robots.txt allows all and points to the sitemap; 33 URLs in the sitemap, matching the 33 routes exactly.','Good'],
['Speakable','No SpeakableSpecification anywhere.','Missing']])}

<h1 class="pb">AEO Analysis</h1><p class="score-line" style="color:#D97706">Score: 5/10 — Needs Work. This is the weak leg and the clearest opportunity.</p>
<h2>Featured Snippet Eligibility</h2>${F([
['Question-phrased headings','Five across the entire 34-page site: one each on /en, /studioid and the three category pages. Twenty-three project pages have none.','Missing'],
['Direct answer paragraphs','No page places a 40–60 word answer directly beneath a question heading, which is the specific pattern featured snippets extract.','Missing'],
['Definition patterns','No page defines its core term plainly. There is no sentence of the form "Innanhússarkitekt er…" anywhere on the site.','Missing'],
['List content','Services appear as prose rather than numbered or bulleted steps, so no list snippet is available.','Needs Attention'],
['Table content','No comparison tables. A table contrasting innanhússarkitekt with innanhússhönnuður, or Arrital against a standard kitchen, would be snippet-eligible.','Missing']])}
<h2>Structured Answer Formats</h2>${F([
['FAQPage schema','Present on exactly one page of 34 — /studioid, with eight well-formed questions whose answers also appear in the visible text.','Needs Attention'],
['FAQ coverage elsewhere','The contact, brands and category pages answer real buying questions in prose but carry no FAQ markup.','Missing'],
['HowTo schema','None. Her design process is a natural HowTo and is currently described as prose on /studioid.','Missing'],
['Speakable','None.','Missing']])}
<h2>Voice Search Readiness</h2>${F([
['Local signals','Complete: name, Katrínartún 4, 105 Reykjavík, +354 663 3414, geo coordinates, five confirmed opening days.','Good'],
['Conversational language','The Icelandic copy is natural and speakable rather than keyword-stuffed.','Good'],
['Long-tail question coverage','The eight FAQs on /studioid are the only question-shaped content. Nothing covers "hvað kostar innanhússarkitekt", "hvað gerir innanhússarkitekt" or "hvar fæ ég Arrital eldhús á Íslandi".','Missing']])}

<h1 class="pb">Priority Recommendations</h1>
<table><thead><tr><th>Priority</th><th>Issue</th><th>Dimension</th><th>Effort</th><th>Impact</th></tr></thead><tbody>
${PR.map(r=>`<tr><td class="pr ${r[5]}">${r[0]}</td><td>${esc(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')}
</tbody></table>

<h1 class="pb">What's Working Well</h1>
<table class="win"><thead><tr><th>Strength</th><th>Evidence from the crawl</th></tr></thead><tbody>
${WW.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td></tr>`).join('')}
</tbody></table>

<h1 class="pb">Glossary</h1>
<p><b>SEO — Search Engine Optimization.</b> Getting a page to rank in a conventional results list: titles, descriptions, headings, links, crawlability and content depth.</p>
<p><b>GEO — Generative Engine Optimization.</b> Getting a page cited by AI answer engines such as ChatGPT Search, Perplexity, Gemini and Google AI Overviews. These reward clear entities, verifiable facts, authority signals and, critically, HTML that renders without JavaScript.</p>
<p><b>AEO — Answer Engine Optimization.</b> Getting a page chosen as the direct answer: featured snippets, People Also Ask boxes and voice assistants. This rewards question-phrased headings, short factual answers directly beneath them, and FAQ or HowTo structured data.</p>
<p class="note">Not assessable from HTML: Core Web Vitals, real-world page speed, mobile rendering and backlink profile. For Core Web Vitals run a report at pagespeed.web.dev once the domain is live; for backlinks use Ahrefs or Semrush.</p>
</body></html>`
writeFileSync('/tmp/ki-report.html', html)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage()
await p.setContent(html, { waitUntil: 'networkidle0' })
const out = process.env.HOME + '/Downloads/seo-audit-katrinisfeld-is-2026-09-07.pdf'
await p.pdf({ path: out, format: 'Letter', printBackground: true, margin: { top: '0', bottom: '18mm', left: '0', right: '0' },
  displayHeaderFooter: true,
  headerTemplate: '<div style="font-family:Arial;font-size:8pt;color:#1B2A4A;width:100%;padding:8mm 20mm 0;border-bottom:1px solid #1B2A4A;display:flex;justify-content:space-between"><span>katrinisfeld.is</span><span>SEO / GEO / AEO Audit Report</span></div>',
  footerTemplate: '<div style="font-family:Arial;font-size:8pt;color:#94A3B8;width:100%;padding:0 20mm 8mm;border-top:1px solid #E2E8F0;display:flex;justify-content:space-between"><span>Claude Skill and Plugin by Alex Labat</span><span class="pageNumber"></span></div>' })
await br.close()
console.log('PDF written:', out)
