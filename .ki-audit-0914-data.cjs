/* Findings for the 2026-09-14 SEO/GEO/AEO audit of katrinisfeld.is, shared by
   the DOCX (.ki-report-0914.cjs) and PDF (.ki-pdf-0914.mjs) generators so the
   two documents cannot drift apart. Measured from the launch build
   (KATRIN_SITE_URL set) with .ki-audit3.mjs -> /tmp/ki-audit3.json. */
const A = require('/tmp/ki-audit3.json')

const SCORES = { SEO: 8, GEO: 8, AEO: 7 }
const DATE = '14 September 2026'
const OUT = process.env.HOME + '/Downloads/seo-audit-katrinisfeld-is-2026-09-14'

const SUMMARY =
  'katrinisfeld.is is ready to launch technically, and it has closed most of the answer-engine gap found a week ago: FAQ markup now runs on six pages instead of one, question headings rose from 5 to 13, the design process carries HowTo markup, and the press page is machine-readable. Every one of the 34 pages still ships complete prerendered HTML, unique metadata and a single H1, and all 314 images carry alt text. The most urgent issue is new and self-inflicted: the redesign\'s animated buttons repeat every label letter by letter inside the HTML, so a crawler reading "Hafa samband" sees "Hafa samband H a f a s a m b a n d H a f a s a m b a n d" on all 33 pages, and two sentences on the site now describe design elements that were removed. The largest remaining opportunity is trust that only Katrín can supply: there are no client reviews anywhere, and AI answers about local professionals lean heavily on exactly that.'

const TAKEAWAY = {
  SEO: 'Clean metadata everywhere; hidden duplicate button text, a keyword-less homepage H1 and a homepage-shaped 404 are the defects.',
  GEO: 'Deep entity graph and press markup; no reviews, and two statements that are no longer true.',
  AEO: 'FAQ on 6 pages and HowTo in place; four answers run short and the homepage answers nothing.',
}

const kind = (r) => r === '/' ? 'Homepage' : r === '/404' ? '404 shell' : r === '/verkefni' ? 'Work index'
  : /^\/verkefni\/(innanhusshonnun|gistiheimili-og-hotel|atvinnuhusnaedi)$/.test(r) ? 'Category'
  : r.startsWith('/verkefni/') ? 'Project' : r === '/en' ? 'English' : 'Standalone'

const note = (x) => {
  if (x.route === '/404') return 'noindex; own title; body renders the full homepage (688 words, H1 "Katrín Ísfeld")'
  if (x.route === '/') return `${x.mainWords} words · ${x.schema.length} schema types · H1 is the name only, no service term`
  const bits = []
  if (x.mainWords < 200) bits.push(`Thin: ${x.mainWords} words of main content`)
  else bits.push(`${x.mainWords} words`)
  if (x.faqQ) bits.push(`FAQ ${x.faqQ}`)
  if (x.howToSteps) bits.push(`HowTo ${x.howToSteps} steps`)
  if (kind(x.route) === 'Project') bits.push('only H2 is the closing call to action')
  bits.push(`${x.imgs} images, all with alt`)
  return bits.join(' · ')
}

/* [signal, finding, status] — status: Good | Needs Attention | Missing */
const SEO_TECH = [
  ['Title tags', 'All 34 unique, 33–59 characters. The four titles over 60 characters found on 7 September are fixed; none truncates now.', 'Good'],
  ['Meta descriptions', 'All 34 present and unique. The 33 real routes run 138–155 characters; the 404 has its own at 117.', 'Good'],
  ['Heading hierarchy', 'Exactly one H1 on every page. The homepage H1 is "Katrín Ísfeld" alone: "innanhússarkitekt" sits in a paragraph beneath it, so the most important heading on the site carries no service term.', 'Needs Attention'],
  ['Project page subheadings', 'On all 23 project pages the only H2 is the closing call to action "Segðu Katrínu frá rýminu þínu." The project copy itself has no subheadings for a crawler to segment.', 'Needs Attention'],
  ['Canonical tags', 'Self-referencing on all 33 routes at https://katrinisfeld.is; correctly stripped from the 404.', 'Good'],
  ['Robots meta', 'index, follow, max-image-preview:large, max-snippet:-1 on all 33 routes; noindex, follow on the 404.', 'Good'],
  ['URL structure', 'Clean, readable Icelandic slugs with no parameters, e.g. /verkefni/nybyggt-hus-i-suluhofda.', 'Good'],
  ['Image alt text', '314 images, none missing alt. 38 carry alt="" and are genuinely decorative repeats (card hover photos, neighbour thumbnails).', 'Good'],
  ['Open Graph / Twitter', 'og:title, og:description, og:image, og:type, og:url and og:locale plus a Twitter card on all 33 routes.', 'Good'],
  ['hreflang', 'is, en and x-default declared on the homepage and the English page.', 'Good'],
  ['Legacy redirects', '62 redirect rules keep every URL her WordPress site published alive, with slash-only loops ruled out.', 'Good'],
  ['404 handling', 'The 404 now has its own title, a short description and noindex, but its body renders the entire homepage. A visitor on a broken link gets the homepage with no sign the page is missing.', 'Needs Attention'],
  ['XML sitemap', '33 URLs, exactly matching the routes, but no <lastmod> dates and no image entries.', 'Needs Attention'],
]
const SEO_CONTENT = [
  ['Hidden duplicate text', 'The hover animation on text links renders each label three times in the HTML, the second and third copies letter by letter, and the pill buttons render theirs twice. Crawlers and text extractors read "Hafa samband H a f a s a m b a n d H a f a s a m b a n d" and "Senda fyrirspurn Senda fyrirspurn" on every page.', 'Missing'],
  ['Word count', 'Main content runs 151–733 words. Thinnest: /fjolmidlar (151), /verkefni (164), /verkefni/gistiheimili-og-hotel (186), /verkefni/innanhusshonnun (195), /verkefni/barnaherbergi (199).', 'Needs Attention'],
  ['Keyword signals', 'Strong and specific: innanhússarkitekt, innanhússhönnun, named suppliers (Arrital, Altamarea, Egill Árnason) and named places (Súluhöfði, Fljótshlíð, Skuggahverfi, Garðatorg).', 'Good'],
  ['Accuracy after the redesign', 'Two sentences describe elements that were removed. The homepage says the colours on the page are taken from the projects; the footer says the homepage "Efnisreinarnar ... eru myndgerðar efnisstúdíur". Neither is true of the current design.', 'Needs Attention'],
  ['Content freshness', 'One dated item on the whole site (a Morgunblaðið clipping, 8 May 2016). No project carries a year.', 'Needs Attention'],
  ['Readability', 'Short paragraphs, fact lists on every project page, a four-step process in numbered form.', 'Good'],
]
const SEO_SCHEMA = [
  ['Coverage', '31 distinct schema types across the site; 0 invalid JSON-LD blocks.', 'Good'],
  ['Business entity', 'ProfessionalService + LocalBusiness with PostalAddress (Katrínartún 4), GeoCoordinates, OpeningHoursSpecification and an OfferCatalog of services.', 'Good'],
  ['Person entity', 'Person with EducationalOccupationalCredential (BSc) and CollegeOrUniversity, plus FHI membership.', 'Good'],
  ['Press page', 'CollectionPage whose parts are NewsArticle or CreativeWork, with NewsMediaOrganization named only where the clipping proves the outlet. Fixed since the last audit.', 'Good'],
  ['Photographer credit', 'ImageObject.creator carries Rakel Ósk Sigurðardóttir and Eggert Jóhannesson. Fixed since the last audit.', 'Good'],
]

const GEO_EEAT = [
  ['Named expertise', 'Katrín Ísfeld named consistently, with a BSc from the Art Institute of Fort Lauderdale, graduation with honours and second place in a design competition.', 'Good'],
  ['Professional membership', 'FHI, Félag húsgagna- og innanhússarkitekta, stated in text and in schema.', 'Good'],
  ['Prior experience', 'Named practices in Fort Lauderdale and with Margreed Van der Hooven in the Netherlands.', 'Good'],
  ['Contact information', 'Name, Katrínartún 4, 105 Reykjavík, 663 3414 and email on the homepage, the contact page and in schema.', 'Good'],
  ['Press validation', 'Twelve clippings published as readable headlines with article markup; Morgunblaðið named where the clipping shows it.', 'Good'],
  ['Reviews and testimonials', 'None anywhere on the site and none marked up. For "innanhússarkitekt í Reykjavík" style questions, AI answers lean on review evidence, and this is the one input only Katrín can supply.', 'Missing'],
  ['Consistency of dates', 'The studio page says she has run her own studio since 2018; the press page says the studio has been covered since 2016. Both can be true, but side by side they read as a contradiction.', 'Needs Attention'],
]
const GEO_SYNTH = [
  ['Factual density', 'High: 23 projects, 6 hospitality projects, named suppliers and tile maker, named photographers, Arrital founded 1979 in Fontanafredda.', 'Good'],
  ['Entity clarity', 'Katrín Ísfeld and Katrín Ísfeld Hönnunar Studio named identically in text, schema and sameAs.', 'Good'],
  ['Clear claims', 'Every project opens with a one-line lead and a fact list (Hlutverk, Gerð, Staðsetning).', 'Good'],
  ['Buying questions', 'Cost, small jobs, Arrital in Iceland and work outside Reykjavík are answered. Cost is answered by process rather than a figure; a starting price would be far more citable, and only she can give it.', 'Needs Attention'],
  ['External citation', 'Links to arrital.com and altamareabath.it. No link to FHI or to the publications that covered her.', 'Needs Attention'],
  ['Extraction noise', 'The letter-by-letter button labels sit in the same HTML text AI extractors read, adding junk tokens to every page.', 'Needs Attention'],
]
const GEO_TECH = [
  ['JavaScript independence', 'All 33 routes prerendered: crawlers that execute no JavaScript, which is most AI crawlers, receive the full page.', 'Good'],
  ['sameAs graph', 'Five profiles, including Instagram, Facebook and LinkedIn.', 'Good'],
  ['HTTPS', 'Enforced by the host.', 'Good'],
  ['Crawlability', 'robots.txt allows all and points to the sitemap; sitemap and routes match exactly.', 'Good'],
  ['llms.txt', 'Shipped, and advertised in a robots.txt comment. No major engine has confirmed reading llms.txt and Google says it does not; it is harmless but costs upkeep for no measured benefit.', 'Needs Attention'],
  ['Speakable', 'No SpeakableSpecification anywhere.', 'Missing'],
]

const AEO_SNIPPET = [
  ['Question-phrased headings', '13 across 6 pages, up from 5. Three of them are the call to action "Ertu með rými af þessu tagi?", which nobody searches for and which dilutes the real questions.', 'Needs Attention'],
  ['Direct answer length', '10 real answers of 29–52 words. Four fall short of the 40–60 word snippet shape: "Hvað er Altamarea?" (29), "Af hverju skiptir hönnun máli í atvinnuhúsnæði?" (34), "Hvar er stúdíóið og get ég komið við?" (37), "Hvar fæ ég Arrital eldhús á Íslandi?" (38).', 'Needs Attention'],
  ['Definition pattern', '"Innanhússarkitekt er hönnuður sem teiknar rýmið sjálft sem eina heild ..." on /studioid. Added since the last audit.', 'Good'],
  ['List content', 'The design process appears as four numbered steps on /studioid and /hafa-samband.', 'Good'],
  ['Table content', 'No tables anywhere; nothing is eligible for a table snippet.', 'Missing'],
]
const AEO_FORMATS = [
  ['FAQPage schema', 'Six pages: /studioid (8), /hafa-samband (4), /italskar-innrettingar (3) and one on each category page. Up from one page.', 'Good'],
  ['HowTo schema', 'Four steps on /studioid, matching the visible process.', 'Good'],
  ['Homepage answers', 'The page most people land on answers no question and carries no FAQ.', 'Needs Attention'],
  ['Speakable', 'None.', 'Missing'],
]
const AEO_VOICE = [
  ['Local signals', 'Complete NAP, geo coordinates and opening hours in schema and text.', 'Good'],
  ['Conversational language', 'The Icelandic reads naturally and addresses the reader directly.', 'Good'],
  ['Long-tail coverage', 'Covered: cost, small jobs, whether you need to know what you want, Arrital in Iceland, work outside the capital. Not covered: how long a project takes, and how an innanhússarkitekt differs from an innanhússhönnuður.', 'Needs Attention'],
]

/* [priority, issue, dimension, effort, impact] */
const PR = [
  ['High', 'Stop the animated buttons writing their labels into the HTML two and three times: prerender the plain label and add the animation layers only in the browser.', 'SEO / GEO', 'Low', 'High'],
  ['High', 'Correct the two statements the redesign made untrue: the homepage colour sentence and the footer line about material strips.', 'GEO', 'Low', 'High'],
  ['High', 'Collect real client reviews on her Google Business Profile and add a few named testimonials to the site. Only Katrín can provide these.', 'GEO', 'Medium', 'High'],
  ['High', 'Put the service term into the homepage H1, "Katrín Ísfeld innanhússarkitekt", without changing how it looks.', 'SEO', 'Low', 'High'],
  ['Medium', 'Give the 404 a real not-found body with links to the projects and contact page instead of the whole homepage.', 'SEO', 'Low', 'Medium'],
  ['Medium', 'Add one or two descriptive H2s to the body of each project page.', 'SEO / AEO', 'Low', 'Medium'],
  ['Medium', 'Bring the four short answers up to 40–60 words and turn the "Ertu með rými af þessu tagi?" heading into a statement.', 'AEO', 'Low', 'Medium'],
  ['Medium', 'Deepen /fjolmidlar, /verkefni and the category pages past ~250 words of real content.', 'SEO / GEO', 'Medium', 'Medium'],
  ['Quick Win', 'Add <lastmod> to every sitemap entry.', 'SEO', 'Low', 'Low'],
  ['Quick Win', 'Drop llms.txt and its robots.txt pointer.', 'GEO', 'Low', 'Low'],
  ['Quick Win', 'Reconcile "covered since 2016" with "own studio since 2018" in one clause.', 'GEO', 'Low', 'Low'],
]

const WW = [
  ['Prerendered HTML', 'All 33 routes ship complete server-rendered markup, so crawlers that run no JavaScript see every word and photograph.'],
  ['Zero metadata defects', '34 unique titles, all at or under 60 characters, 34 unique descriptions, self-referencing canonicals, exactly one H1 per page.'],
  ['Complete alt coverage', '314 images and not one missing an alt attribute.'],
  ['Answer layer built in a week', 'FAQPage on 1 page became 6, question headings rose from 5 to 13, HowTo markup and a definition sentence added.'],
  ['Machine-readable press', 'Twelve clippings as NewsArticle and CreativeWork, outlets named only where the clipping proves them.'],
  ['Deep entity graph', '31 schema types including credentials, opening hours and a service catalogue, with five sameAs profiles.'],
  ['Legacy URL preservation', '62 redirect rules so no WordPress URL loses its ranking at launch.'],
  ['Phone performance', 'Measured locally as a phone at 4x CPU: no long tasks on load or scroll, zero layout shift. Confirm Core Web Vitals at pagespeed.web.dev once the domain is live.'],
]

module.exports = { A, SCORES, DATE, OUT, SUMMARY, TAKEAWAY, kind, note,
  SEO_TECH, SEO_CONTENT, SEO_SCHEMA, GEO_EEAT, GEO_SYNTH, GEO_TECH, AEO_SNIPPET, AEO_FORMATS, AEO_VOICE, PR, WW }
