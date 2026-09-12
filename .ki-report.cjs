const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer,
        AlignmentType, HeadingLevel, BorderStyle, WidthType, VerticalAlign, PageNumber, PageBreak } = require('docx')
const fs = require('fs')
const A = JSON.parse(fs.readFileSync('/tmp/ki-audit.json', 'utf8'))

const NAVY='1B2A4A', BLUE='2563EB', GREEN='16A34A', AMBER='D97706', RED='DC2626',
      GRAYBG='F8F9FA', BORDER='E2E8F0', INK='1E293B', LIGHTBLUE='EFF6FF', ORANGE='EA580C'
const F='Arial'
const col = s => s>=8?GREEN : s>=5?AMBER : RED
const status = s => s>=8?'Strong' : s>=5?'On Track' : 'Needs Work'
const P = (text,o={}) => new Paragraph({ alignment:o.align, spacing:{before:o.before||0,after:o.after===undefined?120:o.after},
  shading:o.shade?{type:'clear',fill:o.shade}:undefined, heading:o.heading,
  children:[new TextRun({ text, font:F, size:(o.size||11)*2, bold:o.bold, italics:o.italic, color:o.color||INK })] })
const cell = (children,o={}) => new TableCell({ children, shading:o.fill?{type:'clear',fill:o.fill}:undefined,
  width:o.w?{size:o.w,type:WidthType.DXA}:undefined, verticalAlign:VerticalAlign.CENTER,
  margins:{top:o.pad||80,bottom:o.pad||80,left:110,right:110},
  columnSpan:o.span,
  borders:o.noBorder?{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}
    :{top:{style:BorderStyle.SINGLE,size:2,color:BORDER},bottom:{style:BorderStyle.SINGLE,size:2,color:BORDER},
      left:{style:BorderStyle.SINGLE,size:2,color:BORDER},right:{style:BorderStyle.SINGLE,size:2,color:BORDER}} })
const tbl = rows => new Table({ rows, width:{size:9360,type:WidthType.DXA},
  borders:{top:{style:BorderStyle.SINGLE,size:2,color:BORDER},bottom:{style:BorderStyle.SINGLE,size:2,color:BORDER},
           left:{style:BorderStyle.SINGLE,size:2,color:BORDER},right:{style:BorderStyle.SINGLE,size:2,color:BORDER},
           insideHorizontal:{style:BorderStyle.SINGLE,size:2,color:BORDER},insideVertical:{style:BorderStyle.SINGLE,size:2,color:BORDER}} })
const head = (labels,widths) => new TableRow({ tableHeader:true, children: labels.map((l,i)=>
  cell([P(l,{bold:true,size:10,color:'FFFFFF'})],{fill:NAVY,w:widths[i]})) })
const row = (cells,widths,i,fills) => new TableRow({ children: cells.map((c,j)=>
  cell([P(c,{size:10,color:fills&&fills[j]?'FFFFFF':INK,bold:!!(fills&&fills[j])})],
       {fill:(fills&&fills[j])||(i%2?GRAYBG:undefined),w:widths[j]}) ) })

const SEO=8, GEO=8, AEO=5
const findings = (rows,widths=[2600,4900,1860]) => tbl([head(['Signal','Finding','Status'],widths),
  ...rows.map((r,i)=>row([r[0],r[1],r[2]],widths,i,[null,null,r[2]==='Good'?GREEN:r[2]==='Missing'?RED:AMBER]))])

/* ---------- cover ---------- */
const scoreCell = (label,s) => cell([
  P(label,{align:AlignmentType.CENTER,size:10,bold:true,color:'FFFFFF',after:40}),
  P(String(s),{align:AlignmentType.CENTER,size:36,bold:true,color:'FFFFFF',after:40}),
  P(status(s),{align:AlignmentType.CENTER,size:9,italic:true,color:'FFFFFF'}),
],{fill:col(s),w:3120,pad:260,noBorder:true})

const cover = [
  P('',{after:1800,shade:NAVY}),
  P('katrinisfeld.is',{align:AlignmentType.CENTER,size:36,bold:true,color:'FFFFFF',after:160}),
  P('SEO / GEO / AEO Audit Report',{align:AlignmentType.CENTER,size:18,color:'93C5FD',after:160}),
  P('FULL AUDIT',{align:AlignmentType.CENTER,size:11,color:'FFFFFF',after:400}),
  new Table({ rows:[new TableRow({children:[scoreCell('SEO',SEO),scoreCell('GEO',GEO),scoreCell('AEO',AEO)]})],
    width:{size:9360,type:WidthType.DXA},
    borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE},
             insideHorizontal:{style:BorderStyle.NONE},insideVertical:{style:BorderStyle.NONE}} }),
  P('',{after:1800}),
  P('7 September 2026',{align:AlignmentType.CENTER,size:9,color:'94A3B8',after:40}),
  P('Claude Skill and Plugin by Alex Labat',{align:AlignmentType.CENTER,size:9,color:'94A3B8'}),
]

/* ---------- body ---------- */
const body = []
const H1 = t => body.push(new Paragraph({ heading:HeadingLevel.HEADING_1, spacing:{before:360,after:180},
  children:[new TextRun({text:t,font:F,size:48,bold:true,color:NAVY})] }))
const H2 = t => body.push(new Paragraph({ heading:HeadingLevel.HEADING_2, spacing:{before:280,after:140},
  children:[new TextRun({text:t,font:F,size:36,bold:true,color:BLUE})] }))
const p = (t,o) => body.push(P(t,o))

H1('Executive Summary')
body.push(new Table({ rows:[new TableRow({children:[cell([
  P('katrinisfeld.is is technically in very good shape and unusually well prepared for AI search, and weakest exactly where most portfolio sites are: it does not answer questions. All 34 pages carry a unique title, description, canonical and a single H1, every image has alt text, and the whole site is prerendered so crawlers that execute no JavaScript see the full content — a real advantage, because most AI crawlers do not run JavaScript. The structured-data graph is genuinely rich: ProfessionalService, LocalBusiness and Person with named credentials, five sameAs profiles, and a 94-line llms.txt of hard facts. The urgent gap is AEO: FAQ schema appears on exactly one page out of 34, and only five headings across the entire site are phrased as questions, so almost nothing here is eligible for a featured snippet, a People Also Ask box or a voice answer. The largest single opportunity is the press page — twelve real headlines from Morgunblaðið and Hús og hýbýli are now published as text but carry no Article markup, which is the strongest authority signal on the site sitting unused.',
  {size:11})],{fill:LIGHTBLUE,w:9360,pad:200})]})],
  width:{size:9360,type:WidthType.DXA},
  borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}} }))
p('',{after:200})

const sw=[1900,1300,1700,4460]
body.push(tbl([ head(['Dimension','Score','Status','Key Takeaway'],sw),
  new TableRow({children:[cell([P('SEO',{size:10})],{w:sw[0]}),cell([P('8/10',{size:10,bold:true,color:'FFFFFF'})],{fill:col(SEO),w:sw[1]}),cell([P(status(SEO),{size:10})],{w:sw[2]}),cell([P('Clean technical base; four long titles and thin body copy are the only real defects.',{size:10})],{w:sw[3]})]}),
  new TableRow({children:[cell([P('GEO',{size:10})],{fill:GRAYBG,w:sw[0]}),cell([P('8/10',{size:10,bold:true,color:'FFFFFF'})],{fill:col(GEO),w:sw[1]}),cell([P(status(GEO),{size:10})],{fill:GRAYBG,w:sw[2]}),cell([P('Rich entity graph and llms.txt; press authority is published but unmarked.',{size:10})],{fill:GRAYBG,w:sw[3]})]}),
  new TableRow({children:[cell([P('AEO',{size:10})],{w:sw[0]}),cell([P('5/10',{size:10,bold:true,color:'FFFFFF'})],{fill:col(AEO),w:sw[1]}),cell([P(status(AEO),{size:10})],{w:sw[2]}),cell([P('FAQ schema on 1 of 34 pages; 5 question headings site-wide. The weak leg.',{size:10})],{w:sw[3]})]}),
  new TableRow({children:[cell([P('Combined',{size:10,bold:true})],{fill:GRAYBG,w:sw[0]}),cell([P('21/30',{size:10,bold:true})],{fill:GRAYBG,w:sw[1]}),cell([P('',{size:10})],{fill:GRAYBG,w:sw[2]}),cell([P('',{size:10})],{fill:GRAYBG,w:sw[3]})]}),
]))

body.push(new Paragraph({children:[new PageBreak()]}))
H1('Pages Audited')
p('All 33 routes plus the 404 shell were fetched from the production build compiled with KATRIN_SITE_URL set, which is the exact HTML that will ship at launch. The deployed preview is deliberately noindex; auditing it would have reported intentional settings as failures.',{size:10,after:200})
const pw=[3700,1900,3760]
const kind = r => r==='/'?'Homepage' : r==='/404'?'404 shell' : r==='/verkefni'?'Work index'
  : /^\/verkefni\/(innanhusshonnun|gistiheimili-og-hotel|atvinnuhusnaedi)$/.test(r)?'Category'
  : r.startsWith('/verkefni/')?'Project' : r==='/en'?'English':'Standalone'
body.push(tbl([head(['URL','Page Type','Notes'],pw), ...A.map((x,i)=>row([
  x.route, kind(x.route),
  x.route==='/404' ? 'No schema; title duplicates the homepage; 225-char description'
  : x.title.length>60 ? `Title ${x.title.length} chars (over 60)`
  : x.words<210 ? `Thin: ${x.words} words including nav and footer`
  : `${x.words} words · ${x.schema.length} schema types · ${x.imgs} images, all with alt`
],pw,i))]))

body.push(new Paragraph({children:[new PageBreak()]}))
H1('SEO Analysis')
p('Score: 8/10 — Strong',{bold:true,color:col(SEO),size:12,after:200})
H2('Technical On-Page')
body.push(findings([
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
  ['404 handling','The 404 shell reuses the homepage title verbatim, carries a 225-character description and ships no structured data.','Needs Attention'],
]))
H2('Content Quality')
body.push(findings([
  ['Word count','Median 241 words per page including navigation and footer boilerplate, so roughly 150 words of unique copy on a typical project page. Thinnest: /verkefni/atvinnuhusnaedi at 178, /verkefni/skrifstofurymi at 203, /verkefni/honnunar-studio at 207.','Needs Attention'],
  ['Keyword signals','Strong and specific: "innanhússarkitekt", "innanhússhönnun", named suppliers (Arrital, Altamarea, Egill Árnason), named places (Súluhöfði, Fljótshlíð, Skuggahverfi, Álfheimar, Garðabær).','Good'],
  ['Content freshness','No publication or update dates on any project page. Nothing signals to a crawler that this content is current.','Needs Attention'],
  ['Readability','Short paragraphs, clear subheadings, factual definition lists on every project page.','Good'],
  ['Originality','High. Copy is grounded in her own project descriptions and her own photographs, and names real suppliers, materials and the architect of the Álfheimar building.','Good'],
]))
H2('Structured Data')
body.push(findings([
  ['Coverage','28 distinct schema types across the site. Every page carries a graph, not a stub.','Good'],
  ['Business entity','ProfessionalService + LocalBusiness with PostalAddress (Katrínartún 4), GeoCoordinates, telephone and openingHoursSpecification for five confirmed days.','Good'],
  ['Person entity','Person with EducationalOccupationalCredential (BSc), CollegeOrUniversity and FHI membership — unusually complete.','Good'],
  ['Projects','CreativeWork per project plus BreadcrumbList and ImageObject.','Good'],
  ['Press page','The twelve clippings carry no Article, NewsArticle or CreativeWork markup, and no citation linking them to the projects they discuss.','Missing'],
  ['Photographer credit','Rakel Ósk Sigurðardóttir and Eggert Jóhannesson appear as visible text but are not expressed as ImageObject.creator.','Missing'],
]))

body.push(new Paragraph({children:[new PageBreak()]}))
H1('GEO Analysis')
p('Score: 8/10 — Strong',{bold:true,color:col(GEO),size:12,after:200})
H2('E-E-A-T Assessment')
body.push(findings([
  ['Named expertise','Katrín Ísfeld Guðmundsdóttir named consistently across every page, with a BSc from the Art Institute of Fort Lauderdale, graduation with honours and second place in a US design competition.','Good'],
  ['Professional membership','FHI, Félag húsgagna- og innanhússarkitekta, stated in text and in schema.','Good'],
  ['Prior experience','Practices in Fort Lauderdale and with Margreed Van der Hooven in the Netherlands, both named.','Good'],
  ['Contact information','Full NAP plus email on the contact page and in schema. Appointment framing is explicit rather than implying drop-in retail.','Good'],
  ['Press / third-party validation','Twelve clippings now published with readable headlines and two named outlets (Morgunblaðið, Hús og hýbýli). Not yet machine-readable.','Needs Attention'],
  ['Testimonials','No client testimonials or reviews anywhere on the site.','Missing'],
]))
H2('Content for AI Synthesis')
body.push(findings([
  ['Factual density','High and rising: named suppliers, named materials, named photographers, a named building architect (Sigvaldi Thordarson, 1970), four houses and eight apartments at Old Charm.','Good'],
  ['Entity clarity','The brand is named identically in text, schema, llms.txt and sameAs. No ambiguity for an engine resolving the entity.','Good'],
  ['llms.txt','94 lines of hard facts — address, hours, credentials, services, brands, project list. Well beyond the usual stub.','Good'],
  ['Clear claims','Each project states its scope in a one-line lead plus a definition list (Hlutverk, Gerð, Staðsetning).','Good'],
  ['Comprehensiveness','Project bodies run two to three short paragraphs. An engine synthesising an answer about a project has little to draw on beyond the lead.','Needs Attention'],
  ['External citation','The site cites no external sources — no links to Arrital, Altamarea, FHI or the publications that covered her.','Missing'],
]))
H2('Technical GEO')
body.push(findings([
  ['JavaScript independence','All 33 routes are prerendered. AI crawlers that execute no JavaScript see the complete page, which is the single most important GEO fundamental and the one most portfolio sites fail.','Good'],
  ['sameAs graph','Five profiles: Instagram, Facebook, LinkedIn, ja.is and the canonical domain.','Good'],
  ['HTTPS','Enforced.','Good'],
  ['Crawlability','robots.txt allows all and points to the sitemap; 33 URLs in the sitemap, matching the 33 routes exactly.','Good'],
  ['Speakable','No SpeakableSpecification anywhere.','Missing'],
]))

body.push(new Paragraph({children:[new PageBreak()]}))
H1('AEO Analysis')
p('Score: 5/10 — Needs Work. This is the weak leg and the clearest opportunity.',{bold:true,color:col(AEO),size:12,after:200})
H2('Featured Snippet Eligibility')
body.push(findings([
  ['Question-phrased headings','Five across the entire 34-page site: one each on /en, /studioid and the three category pages. Twenty-three project pages have none.','Missing'],
  ['Direct answer paragraphs','No page places a 40–60 word answer directly beneath a question heading, which is the specific pattern featured snippets extract.','Missing'],
  ['Definition patterns','No page defines its core term plainly. There is no sentence of the form "Innanhússarkitekt er…" anywhere on the site.','Missing'],
  ['List content','Services appear as prose rather than numbered or bulleted steps, so no list snippet is available.','Needs Attention'],
  ['Table content','No comparison tables. A table contrasting innanhússarkitekt with innanhússhönnuður, or Arrital against a standard kitchen, would be snippet-eligible.','Missing'],
]))
H2('Structured Answer Formats')
body.push(findings([
  ['FAQPage schema','Present on exactly one page of 34 — /studioid, with eight well-formed questions whose answers also appear in the visible text.','Needs Attention'],
  ['FAQ coverage elsewhere','The contact, brands and category pages answer real buying questions in prose but carry no FAQ markup.','Missing'],
  ['HowTo schema','None. Her design process is a natural HowTo and is currently described as prose on /studioid.','Missing'],
  ['Speakable','None.','Missing'],
]))
H2('Voice Search Readiness')
body.push(findings([
  ['Local signals','Complete: name, Katrínartún 4, 105 Reykjavík, +354 663 3414, geo coordinates, five confirmed opening days.','Good'],
  ['Conversational language','The Icelandic copy is natural and speakable rather than keyword-stuffed.','Good'],
  ['Long-tail question coverage','The eight FAQs on /studioid are the only question-shaped content. Nothing covers "hvað kostar innanhússarkitekt", "hvað gerir innanhússarkitekt" or "hvar fæ ég Arrital eldhús á Íslandi".','Missing'],
]))

body.push(new Paragraph({children:[new PageBreak()]}))
H1('Priority Recommendations')
const rw=[1500,3800,1200,1300,1560]
const PR=[
  ['Critical','Add FAQPage schema and question-phrased headings with 40–60 word answers to the contact, brands and three category pages','AEO','Medium','High',RED],
  ['Critical','Mark up the twelve press clippings as Article/CreativeWork with publisher, headline and a citation link to the project each covers','GEO','Low','High',RED],
  ['High','Answer the three commercial questions nobody has answered: what an innanhússarkitekt does, what a project costs, where to buy Arrital in Iceland','AEO','Medium','High',ORANGE],
  ['High','Deepen the thinnest pages — /verkefni/atvinnuhusnaedi (178w), /verkefni/skrifstofurymi (203w), /verkefni/honnunar-studio (207w)','SEO','Medium','Medium',ORANGE],
  ['Medium','Add HowTo schema to her design process on /studioid','AEO','Low','Medium',AMBER],
  ['Medium','Express photographer credits as ImageObject.creator so the attribution is machine-readable','GEO','Low','Low',AMBER],
  ['Medium','Add outbound citations to Arrital, Altamarea and FHI','GEO','Low','Medium',AMBER],
  ['Quick Win','Shorten four titles over 60 characters','SEO','Low','Medium',GREEN],
  ['Quick Win','Give the 404 its own title, a description under 160 characters and a schema graph','SEO','Low','Low',GREEN],
  ['Quick Win','Add a definition sentence — "Innanhússarkitekt er…" — to the studio page','AEO','Low','Medium',GREEN],
]
body.push(tbl([head(['Priority','Issue','Dimension','Effort','Impact'],rw),
  ...PR.map((r,i)=>row([r[0],r[1],r[2],r[3],r[4]],rw,i,[r[5],null,null,null,null]))]))

body.push(new Paragraph({children:[new PageBreak()]}))
H1("What's Working Well")
const ww=[2600,6760]
body.push(new Table({ rows:[head(['Strength','Evidence from the crawl'],ww),
  ...[['Prerendered HTML','All 33 routes ship complete server-rendered markup. AI crawlers that run no JavaScript — most of them — see the full page.'],
      ['Zero metadata defects','34 unique titles, 34 unique descriptions, 34 self-referencing canonicals, exactly one H1 per page, no duplicates.'],
      ['Complete alt coverage','Not one image on the site is missing an alt attribute; the twelve empty ones are correctly marked decorative.'],
      ['Deep entity graph','28 schema types including EducationalOccupationalCredential and OpeningHoursSpecification, with five sameAs profiles.'],
      ['llms.txt','94 lines of structured facts written for answer engines, not a placeholder.'],
      ['Legacy URL preservation','58 redirects covering every path her WordPress site published, so no ranking equity is dropped at launch.'],
      ['Honest sourcing','Outlets named only where a clipping proves it; hours published only for the five confirmed days; no invented client names.'],
      ['Named specifics','Arrital, Altamarea, Egill Árnason, Sigvaldi Thordarson, FHI, two photographers — the concrete nouns AI engines prefer to cite.'],
     ].map((r,i)=>new TableRow({children:[cell([P(r[0],{size:10,bold:true})],{fill:'F0FDF4',w:ww[0]}),cell([P(r[1],{size:10})],{fill:'F0FDF4',w:ww[1]})]}))],
  width:{size:9360,type:WidthType.DXA},
  borders:{top:{style:BorderStyle.SINGLE,size:2,color:BORDER},bottom:{style:BorderStyle.SINGLE,size:2,color:BORDER},
           left:{style:BorderStyle.SINGLE,size:2,color:BORDER},right:{style:BorderStyle.SINGLE,size:2,color:BORDER},
           insideHorizontal:{style:BorderStyle.SINGLE,size:2,color:BORDER},insideVertical:{style:BorderStyle.SINGLE,size:2,color:BORDER}} }))

body.push(new Paragraph({children:[new PageBreak()]}))
H1('Glossary')
p('SEO — Search Engine Optimization. Getting a page to rank in a conventional results list: titles, descriptions, headings, links, crawlability and content depth.',{size:10})
p('GEO — Generative Engine Optimization. Getting a page cited by AI answer engines such as ChatGPT Search, Perplexity, Gemini and Google AI Overviews. These reward clear entities, verifiable facts, authority signals and, critically, HTML that renders without JavaScript.',{size:10})
p('AEO — Answer Engine Optimization. Getting a page chosen as the direct answer: featured snippets, People Also Ask boxes and voice assistants. This rewards question-phrased headings, short factual answers directly beneath them, and FAQ or HowTo structured data.',{size:10})
p('Not assessable from HTML: Core Web Vitals, real-world page speed, mobile rendering and backlink profile. For Core Web Vitals run a report at pagespeed.web.dev once the domain is live; for backlinks use Ahrefs or Semrush.',{size:10,italic:true})

const doc = new Document({ styles:{default:{document:{run:{font:F,size:22,color:INK}}}}, sections:[
  { properties:{ page:{ size:{width:12240,height:15840}, margins:{top:1440,right:1440,bottom:1440,left:1440} } },
    children: cover },
  { properties:{ page:{ size:{width:12240,height:15840}, margins:{top:1440,right:1440,bottom:1440,left:1440} } },
    headers:{ default:new Header({children:[new Paragraph({ border:{bottom:{style:BorderStyle.SINGLE,size:8,color:NAVY}},
      tabStops:[{type:'right',position:9360}],
      children:[new TextRun({text:'katrinisfeld.is',font:F,size:18,color:NAVY}),
                new TextRun({text:'\tSEO / GEO / AEO Audit Report',font:F,size:18,color:NAVY})] })] }) },
    footers:{ default:new Footer({children:[new Paragraph({ border:{top:{style:BorderStyle.SINGLE,size:6,color:BORDER}},
      tabStops:[{type:'right',position:9360}],
      children:[new TextRun({text:'Claude Skill and Plugin by Alex Labat',font:F,size:18,color:'94A3B8'}),
                new TextRun({text:'\t',font:F,size:18}), new TextRun({children:[PageNumber.CURRENT],font:F,size:18,color:'94A3B8'})] })] }) },
    children: body },
]})
const OUT = process.env.HOME + '/Downloads/seo-audit-katrinisfeld-is-2026-09-07.docx'
Packer.toBuffer(doc).then(b => { fs.writeFileSync(OUT, b); console.log('DOCX written:', OUT, (b.length/1024).toFixed(0)+'KB') })
