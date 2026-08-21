/**
 * BOFS news sync.
 *
 * Pulls the agency's own newsroom from island.is and regenerates
 * src/preview/bofs/news.generated.ts. Run by .github/workflows/news-sync.yml
 * on a daily cron, so the deployed site keeps itself current without anyone
 * touching it; also runnable by hand with `npm run news:sync`.
 *
 * Source of truth is the __NEXT_DATA__ blob island.is server-renders on
 * /s/bofs/frett. It carries title, date, slug, intro and image as structured
 * fields, so nothing here depends on parsing markup. island.is publishes no
 * RSS feed (checked: /rss, /frett/rss and /frett.rss all 404).
 *
 * Three things this script must keep doing, in order of how badly they bite:
 *
 *  1. STRIP EN AND EM DASHES. island.is writes ranges as "2022–2025". The
 *     site's copy rule forbids both dash characters in visible text, in both
 *     languages. Numeric ranges become "2022 til 2025"; any other dash
 *     becomes a comma and is logged loudly, because a comma is a guess about
 *     someone else's sentence and deserves a human look.
 *  2. CARRY THE OVERRIDES. Anything we have corrected or translated by hand
 *     lives in OVERRIDES keyed by slug and survives every resync. Without it
 *     each run would silently undo those fixes.
 *  3. KEEP THE EXTERNAL ITEMS. GEV, Stjórnarráðið and Vísir are not in the
 *     BOFS feed, so they stay hand-maintained in EXTERNAL below.
 *
 * Images: BOFS and Stjórnarráðið only, by decision. Both are bodies
 * republishing their own photographs of their own work, and every item links
 * back to the original article. Vísir items carry a watercolour instead,
 * because those are third-party commercial press photographs.
 */

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '..', 'src', 'preview', 'bofs', 'news.generated.ts')
const FEED = 'https://island.is/s/bofs/frett'
const ARTICLE = (slug) => `https://island.is/s/bofs/frett/${slug}`

/*
 * Sources beyond the agency's own newsroom.
 *
 * BOFS publishes rarely (weeks can pass), so a page fed only by them looks
 * abandoned even when the sync is working perfectly. These four carry the
 * rest of the picture, and every one of them is a body the agency actually
 * answers to, is overseen by, or works alongside.
 *
 * Deliberately NOT included, having been fetched and read:
 *  - Felags-og-fjolskyldumal.rss: two items, about nursing homes and
 *    marriage law. Wrong department.
 *  - Ursk.-velf.-Barnaverndarmal.rss: real, but every title is of the form
 *    "Mál nr. 640/2025-Úrskurður" and the newest is from January. Opaque
 *    filler that would push real news down the page.
 */
const GEV_FEED = 'https://island.is/s/gev/frett'
const GEV_ARTICLE = (slug) => `https://island.is/s/gev/frett/${slug}`
const RSS_SOURCES = [
  {
    source: 'Stjórnarráðið',
    url: 'https://www.stjornarradid.is/extensions/news/rss/Mennta-og-barnamalaraduneytid.rss',
    max: 4,
  },
  {
    source: 'Umboðsmaður barna',
    url: 'https://www.barn.is/frettir/rss.xml',
    max: 4,
  },
]

/*
 * A relevance gate, because these feeds are not about this agency.
 *
 * FIRST ATTEMPT MATCHED TOO MUCH, and the failure is worth recording: it
 * scanned title AND description for broad words like "barn" and "foreldri".
 * But an ombudsman FOR CHILDREN and an education ministry mention children in
 * practically everything they publish, so the gate passed a school grading
 * change, a maths curriculum survey, summer opening hours and a science
 * school. The grading item then sorted to the top and became the lead story
 * on a child protection newsroom.
 *
 * So: remit-specific terms, matched against the HEADLINE only. On a page like
 * this a false positive is far more damaging than a false negative. One
 * irrelevant item makes the whole page look unconsidered, whereas a missed
 * item is merely a missed item.
 */
const RELEVANT = [
  'barnavernd', 'barnahús', 'barnahus', 'fóstur', 'fósturforeldr', 'farsæld',
  'meðferðarheimil', 'meðferðarúrræð', 'stuðla', 'vanræksl', 'ofbeldi',
  'útivistartím', 'barnasáttmál', 'réttindi barna', 'bið barna',
  'samþætting', 'áhættuhegðun', 'neyðarvistun', 'umsjá barna',
]
/* Headline only. Passing the description in is what broke it before. */
const isRelevant = (title) => {
  const hay = (title || '').toLowerCase()
  return RELEVANT.some((k) => hay.includes(k))
}

/* ── Copy hygiene ─────────────────────────────────────────────────────── */

const warnings = []

/** No en or em dashes may reach the page. See rule 1 in the header. */
function undash(text, where) {
  if (!text) return text
  let out = text.replace(/(\d)\s*[–—]\s*(\d)/g, '$1 til $2')
  if (/[–—]/.test(out)) {
    warnings.push(`non-numeric dash rewritten to a comma in ${where}: ${JSON.stringify(text)}`)
    out = out.replace(/\s*[–—]\s*/g, ', ')
  }
  return out.replace(/\s{2,}/g, ' ').replace(/,\s*,/g, ',').trim()
}

/** 2026-07-24 → 24.07.2026, the format the UI renders. */
const isoToDots = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}.${m}.${y}`
}

/**
 * Topic, inferred from the headline. Checked most specific first: a Barnahús
 * item is a Barnahús item even when it also says "meðferð".
 */
function inferTopic(title, intro = '') {
  const s = `${title} ${intro}`.toLowerCase()
  if (/barnahús|barnahus/.test(s)) return 'barnahus'
  if (/meðferð|lækjarbakk|gunnarsholt|úrræði|vistun|stuðlar|esjan|bjargey/.test(s)) return 'medferd'
  if (/barnavernd|tilkynning|fóstur|samþætting|skráning/.test(s)) return 'barnavernd'
  return 'samstarf'
}

/*
 * No images are synced, by decision.
 *
 * The feed does carry an image per item and we did wire it up. Most of them
 * turned out to be generic clip art, pie charts and bar charts on white,
 * which look like cheap stock next to this site's watercolours and add
 * nothing to a headline. The list is typographic instead, so no news content
 * is fetched from a third-party host.
 */

/* ── Hand-held corrections that must survive every resync ─────────────── */

const OVERRIDES = {
  // island.is has an uncorrected typo in its own headline: "farsælda barna".
  'mottaka-menntun-og-farsaelda-barna-med-flottabakgrunn': {
    is: 'Móttaka, menntun og farsæld barna með flóttabakgrunn',
    en: 'Reception, education and wellbeing of children with a refugee background',
  },
  'samantekt-um-urraedi-og-umsoknir-um-thjonustu-a-arunum-2022-2025': {
    en: 'Overview of services and applications 2022 to 2025',
    featured: true,
    // Richer than the feed's one-line intro; read off the article body and
    // verified 27 July 2026. Every figure appears verbatim in the source.
    summaryIs:
      'Barna- og fjölskyldustofa hefur birt samantekt um úrræði og umsóknir um þjónustu á árunum 2022 til 2025. Þar kemur meðal annars fram að vistunardagar á grundvelli 100. greinar laga um meðferð sakamála voru fleiri árin 2024 og 2025 en samanlagt á árunum 2015 til 2023.',
    summaryEn:
      'Barna- og fjölskyldustofa has published an overview of services and applications for the years 2022 to 2025. Among other findings, placement days under article 100 of the criminal procedure act were higher across 2024 and 2025 combined than across all of 2015 to 2023.',
    stats: [
      { value: '173', label: { is: 'umsóknir í meðferðarúrræði 2024', en: 'applications for treatment in 2024' } },
      { value: '170', label: { is: 'umsóknir í meðferðarúrræði 2025', en: 'applications for treatment in 2025' } },
    ],
  },
  'skraningar-a-fjoelda-mala-i-samthaettingu-thjonustu': {
    en: 'Case registrations in integrated services',
    summaryIs:
      'Alls voru 6.112 mál í samþættingu þjónustu fyrstu fjóra mánuði ársins 2026, samanborið við 4.669 mál á sama tíma árið 2025. Flest málin eru hjá tengiliðum í grunnskólum, eða 46 prósent, og hjá málstjórum í félagsþjónustu, 27 prósent.',
    summaryEn:
      'A total of 6,112 cases were in integrated services over the first four months of 2026, compared with 4,669 in the same period of 2025. Most sit with contacts in compulsory schools, 46 percent, and with case managers in social services, 27 percent.',
  },
  'tilkynningum-til-barnaverndar-faekkar': {
    en: 'Reports to child protection are decreasing',
    summaryIs:
      'Tilkynningum til barnaverndar fækkaði um 4,1 prósent fyrstu þrjá mánuði ársins 2026, úr 5.020 í 4.812. Vanræksla lá að baki um 38 prósentum tilkynninga og áhættuhegðun barns um 35 prósentum.',
    summaryEn:
      'Reports to child protection fell by 4.1 percent over the first three months of 2026, from 5,020 to 4,812. Neglect lay behind about 38 percent of reports and a child’s own risk behaviour about 35 percent.',
  },
  'ses-radstefnan-2026-er-nu-adgengileg-her-a-vefnum': { en: 'The SES conference 2026 is now available online' },
  'starfsfolk-barnahuss-heimsaekir-barnahus-a-irlandi': { en: 'Barnahús staff visit the Barnahus in Ireland' },
  'fundur-barnahuss-og-ofbeldismottoeku-barna-a-landspitala': {
    en: 'Barnahús meets the child abuse response team at Landspítali',
    summaryIs:
      'Fulltrúar Barnahúss og framkvæmdastjóri meðferðarsviðs funduðu með teymi ofbeldismóttöku barna á Landspítala 22. apríl 2026. Á fundinum var lögð áhersla á öflugt og samræmt samstarf og skýra ferla fyrir börn sem hafa orðið fyrir ofbeldi.',
    summaryEn:
      'Representatives of Barnahús and the director of the treatment division met the child abuse response team at Landspítali on 22 April 2026. The meeting focused on strong, coordinated cooperation and clear procedures for children who have suffered violence.',
  },
  'heimsokn-umbodsmanns-barna-i-barnahus': { en: 'The Ombudsman for Children visits Barnahús' },
  'brada-og-vidbragdsteymid-pulsinn-tekur-til-starfa-gegn-ofbeldi-medal-barna': {
    en: 'The Púlsinn rapid response team begins work against violence among children',
    summaryIs:
      'Púlsinn er nýtt bráða- og viðbragðsteymi gegn ofbeldi meðal barna, samstarfsverkefni sveitarfélaganna á höfuðborgarsvæðinu, lögreglu og Barna- og fjölskyldustofu. Níu sérfræðingar starfa í teyminu, og skólar, félagsmiðstöðvar, lögregla og þjónustuaðilar geta kallað það til þegar áhyggjur vakna.',
    summaryEn:
      'Púlsinn is a new rapid response team against violence among children, run jointly by the capital area municipalities, the police and Barna- og fjölskyldustofa. Nine specialists staff the team, and schools, youth centres, police and service providers can call on it when concerns arise.',
  },
  'nytt-medferdarheimili-i-gunnarsholti-hefur-stoerf': {
    en: 'The new treatment home at Gunnarsholt begins work',
    summaryIs:
      'Meðferðarheimilið Lækjarbakki hóf störf í nýju húsnæði í Gunnarsholti og tók á móti sínu fyrsta barni. Heimilið veitir framhaldsmeðferð fyrir börn með vímuefnavanda.',
    summaryEn:
      'The Lækjarbakki treatment home began operating in its new premises at Gunnarsholt and received its first child. The home provides follow-on treatment for children with substance problems.',
  },
}

/* ── Items that are not in the BOFS feed ──────────────────────────────── */

const EXTERNAL = [
  {
    date: '14.07.2026',
    source: 'GEV',
    topic: 'barnavernd',
    title: { is: 'Frumkvæðisathugun á eftirliti með börnum í fóstri', en: 'Review of oversight of children in foster care' },
    href: 'https://island.is/s/gev/frett/frumkvaedisathugun-gev-a-eftirlitsskyldum-barnaverndarthjonusta-vegna-barna-i-fostri',
  },
  {
    date: '08.05.2026',
    source: 'Stjórnarráðið',
    topic: 'medferd',
    title: {
      is: 'Meðferðarheimilið Lækjarbakki formlega opnað í Gunnarsholti',
      en: 'The Lækjarbakki treatment home formally opened at Gunnarsholt',
    },
    summary: {
      is: 'Inga Sæland ráðherra opnaði meðferðarheimilið Lækjarbakka formlega í Gunnarsholti 8. maí 2026. Heimilið veitir framhaldsmeðferð og þar eru sex pláss.',
      en: 'Minister Inga Sæland formally opened the Lækjarbakki treatment home at Gunnarsholt on 8 May 2026. The home provides follow-on treatment and has six places.',
    },
    href: 'https://www.stjornarradid.is/efst-a-baugi/frettir/stok-frett/2026/05/08/Medferdarheimilid-Laekjarbakki-formlega-opnad-i-Gunnarsholti',
  },
  {
    date: '08.05.2026',
    source: 'Vísir',
    topic: 'medferd',
    title: { is: 'Engin bið eftir plássi á meðferðarheimilum ungmenna', en: 'No waiting list for places at youth treatment homes' },
    href: 'https://www.visir.is/g/20262880648d/engin-bid-eftir-plassi-a-medferdarheimilum-ungmenna',
  },
]

/* ── Fetch and build ──────────────────────────────────────────────────── */

async function fetchFeed(url = FEED) {
  const res = await fetch(url, { headers: { 'user-agent': 'bofs-concept-news-sync' } })
  if (!res.ok) throw new Error(`feed ${res.status}`)
  const html = await res.text()
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)
  if (!m) throw new Error('no __NEXT_DATA__ on the feed page; island.is markup changed')
  const data = JSON.parse(m[1])

  // Walk to the news array rather than hard-coding the prop path, which has
  // nested itself deeper than once before on island.is. Two guards matter:
  // prefer a property actually called newsList, and among shape-matches take
  // the LONGEST. The page also carries short "related items" arrays of the
  // same shape, and a depth-first first-match grabs one of those instead,
  // silently publishing four items where there are ten.
  const candidates = []
  ;(function walk(node, key, depth) {
    if (!node || typeof node !== 'object' || depth > 14) return
    if (Array.isArray(node)) {
      if (node.length && node[0] && typeof node[0] === 'object' && 'slug' in node[0] && 'date' in node[0] && 'intro' in node[0]) {
        candidates.push({ key, list: node })
      }
      node.forEach((v) => walk(v, key, depth + 1))
      return
    }
    for (const k of Object.keys(node)) walk(node[k], k, depth + 1)
  })(data, '', 0)

  if (!candidates.length) throw new Error('no news array found in __NEXT_DATA__; island.is shape changed')
  const named = candidates.filter((c) => c.key === 'newsList')
  const pool = named.length ? named : candidates
  const best = pool.reduce((a, b) => (b.list.length > a.list.length ? b : a))
  if (!named.length) console.warn(`  ! no "newsList" key; fell back to the longest matching array (${best.list.length})`)
  return best.list
}

const feed = await fetchFeed()
console.log(`feed: ${feed.length} items from ${FEED}`)

const fromFeed = feed.map((n) => {
  const o = OVERRIDES[n.slug] ?? {}
  const titleIs = o.is ?? undash(n.title, `title/${n.slug}`)
  const intro = undash(n.intro, `intro/${n.slug}`)
  const item = {
    date: isoToDots(n.date),
    source: 'BOFS',
    topic: inferTopic(titleIs, intro),
    title: { is: titleIs, en: o.en ?? titleIs },
    href: ARTICLE(n.slug),
  }
  // The English site falls back to the Icelandic headline when no hand
  // translation exists. Flagged so the UI can say so rather than pretend.
  if (!o.en) item.untranslated = true
  // A hand-written summary read off the article body beats the feed's
  // one-line intro, so an override wins; anything new falls back to the
  // agency's own intro text, which is always at least authoritative.
  const sumIs = o.summaryIs ?? intro
  const sumEn = o.summaryEn ?? sumIs
  if (sumIs) {
    item.summary = { is: sumIs, en: sumEn }
    if (!o.summaryEn) item.summaryUntranslated = true
  }
  if (o.featured) item.featured = true
  if (o.stats) item.stats = o.stats
  return item
})

/* ── GEV, same island.is machinery, different newsroom ────────────────── */

let fromGev = []
try {
  const gev = await fetchFeed(GEV_FEED)
  fromGev = gev
    .filter((n) => isRelevant(n.title))
    .slice(0, 4)
    .map((n) => {
      const titleIs = undash(n.title, `gev-title/${n.slug}`)
      const intro = undash(n.intro, `gev-intro/${n.slug}`)
      const item = {
        date: isoToDots(n.date),
        source: 'GEV',
        topic: inferTopic(titleIs, intro),
        title: { is: titleIs, en: titleIs },
        href: GEV_ARTICLE(n.slug),
        untranslated: true,
      }
      if (intro) {
        item.summary = { is: intro, en: intro }
        item.summaryUntranslated = true
      }
      return item
    })
  console.log(`gev:  ${fromGev.length} relevant of ${gev.length} from ${GEV_FEED}`)
} catch (err) {
  // A third-party newsroom going down must never fail the whole sync and
  // leave the page stale; the agency's own feed is what matters.
  warnings.push(`GEV feed unavailable, skipped: ${err.message}`)
}

/* ── RSS sources ──────────────────────────────────────────────────────── */

/*
 * A deliberately small XML reader rather than a dependency. These two feeds
 * are plain RSS 2.0 and the fields we need are flat.
 */
const unescapeXml = (t = '') =>
  t
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tag = (block, name) => {
  const m = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`).exec(block)
  return m ? unescapeXml(m[1]) : ''
}

async function fetchRss({ source, url, max }) {
  const res = await fetch(url, { headers: { 'user-agent': 'bofs-concept-news-sync' } })
  if (!res.ok) throw new Error(`${source} rss ${res.status}`)
  const xml = await res.text()
  const blocks = xml.split(/<item[\s>]/).slice(1)
  const out = []
  let seen = 0
  for (const b of blocks) {
    const title = tag(b, 'title')
    const link = tag(b, 'link')
    const desc = tag(b, 'description')
    const pub = tag(b, 'pubDate')
    if (!title || !link || !pub) continue
    seen++
    if (!isRelevant(title)) continue
    const d = new Date(pub)
    if (Number.isNaN(d.getTime())) continue
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const titleIs = undash(title, `rss-title/${source}`)
    /* The ombudsman's descriptions run to full paragraphs; trim to a lead
       rather than reprinting somebody else's article on our page. */
    let sum = undash(desc, `rss-desc/${source}`)
    if (sum.length > 260) sum = sum.slice(0, 257).replace(/\s+\S*$/, '') + '...'
    const item = {
      date: `${dd}.${mm}.${d.getFullYear()}`,
      source,
      topic: inferTopic(titleIs, sum),
      title: { is: titleIs, en: titleIs },
      href: link,
      untranslated: true,
    }
    if (sum && sum !== titleIs) {
      item.summary = { is: sum, en: sum }
      item.summaryUntranslated = true
    }
    out.push(item)
    if (out.length >= max) break
  }
  console.log(`rss:  ${out.length} relevant of ${seen} from ${source}`)
  return out
}

const fromRss = []
for (const src of RSS_SOURCES) {
  try {
    fromRss.push(...(await fetchRss(src)))
  } catch (err) {
    warnings.push(`${src.source} feed unavailable, skipped: ${err.message}`)
  }
}

const toDate = (d) => {
  const [dd, mm, yy] = d.split('.')
  return new Date(`${yy}-${mm}-${dd}`)
}

/*
 * The agency's own feed wins every collision: the hand-maintained EXTERNAL
 * entries carry verified figures and real translations, and two of the feeds
 * can now surface the same article they were written for.
 */
const seenHref = new Set()
const items = [...fromFeed, ...EXTERNAL, ...fromGev, ...fromRss]
  .filter((n) => {
    const key = n.href.replace(/\/$/, '').toLowerCase()
    if (seenHref.has(key)) return false
    seenHref.add(key)
    return true
  })
  .sort((a, b) => toDate(b.date) - toDate(a.date))

/**
 * Confirm every article link still resolves before it is written.
 *
 * This runs unattended on a cron, so a slug that 404s would otherwise ship a
 * dead link to a live page nobody is watching. A failure is warned about
 * rather than dropped: a headline whose link broke is still a fact that
 * happened, and silently deleting it would hide the breakage.
 */
async function verifyLinks(list) {
  await Promise.all(
    list.map(async (i) => {
      try {
        let res = await fetch(i.href, { method: 'HEAD', redirect: 'follow' })
        if (!res.ok) res = await fetch(i.href, { headers: { range: 'bytes=0-256' } })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } catch (err) {
        warnings.push(`dead link on "${i.title.is.slice(0, 44)}": ${err.message}`)
      }
    }),
  )
}

await verifyLinks(items)

// If nothing carries the featured flag (the pinned item aged out of the
// feed), the newest item leads. The page must never render without a lead.
if (!items.some((i) => i.featured) && items.length) items[0].featured = true

const stamp = new Date()
const isStamp = `${stamp.getDate()}. ${['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'][stamp.getMonth()]} ${stamp.getFullYear()}`
const enStamp = stamp.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

const banner = `/**
 * GENERATED FILE. Do not edit by hand.
 *
 * Written by scripts/bofs-news-sync.mjs from island.is/s/bofs/frett plus the
 * hand-maintained external items in that script. To change an item's English
 * translation, its pinned status or its figures, edit OVERRIDES there, not
 * this file: the next sync overwrites everything here.
 *
 * Last synced: ${stamp.toISOString()}
 */

import type { NewsItem } from './data'

export const SYNCED_AT = { is: 'Uppfært ${isStamp}', en: 'Updated ${enStamp}' }

export const SYNCED_NEWS: NewsItem[] = ${JSON.stringify(items, null, 2)}
`

writeFileSync(OUT, banner)

console.log(`wrote ${items.length} items to ${OUT}`)
console.log(`  ${fromFeed.length} synced from BOFS, ${EXTERNAL.length} external`)
console.log(`  ${items.filter((i) => i.summary).length} with a summary`)
console.log(`  ${items.filter((i) => i.untranslated).length} awaiting an English headline`)
if (warnings.length) {
  console.log('\nreview these, a comma was substituted into someone else\'s sentence:')
  for (const w of warnings) console.log(`  ! ${w}`)
}
