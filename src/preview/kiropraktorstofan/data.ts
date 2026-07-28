/**
 * KÍRÓPRAKTORSTOFA TRYGGVA JÓNASSONAR — "Fyrsta leyfið" (v2)
 * ---------------------------------------------------------------------------
 * Chiropractic clinic, Háaleitisbraut 66 (við Grensáskirkju), 103 Reykjavík.
 * Redesign concept, batch 13 REDO. v1 (light-paper, four MR/1971-split
 * chapters) was rejected as generic AI slop; v2 is a dark chaptered case
 * history in exactly the four chapters the redo brief specifies: 1977 (the
 * licence), Meðferðin, Verðskráin, Stofan. All facts below carry over
 * unchanged from the fact-checked v1 build; only CHAPTERS and the
 * companyEntry presentation fields (accent/dark/thumb/photoCredit/audit/
 * outreach) were updated for the new direction.
 *
 * SOURCES (fetched 2026-07-28 over plain HTTP with a desktop UA, their HTTPS
 * certificate is issued to plesk-web-11.vist.is and does not match their own
 * domain, verified directly with an openssl handshake during this build):
 *   /                                      hero teaser, nav, COVID banner, footer
 *   /upplysingar-og-verd/                  the 2026 taxti (prices), address, sími
 *   /boka-tima/                            booking form fields, real opening hours
 *   /english/                              English hours (cross-check), fees
 *   /ferilskra-tryggva-jonassonar/         full CV: MR 1971, AECC, Denmark, 1977,
 *                                          landlæknir/Alþingi/Matthías Bjarnason,
 *                                          17.000+ patients, board/teaching record
 *   /um-kiropraktorstofuna/                "Viðvaningurinn og bakið", same licence
 *                                          claim verbatim, posted 2017 (updated 2018)
 *   /hvad-er-kiropraktor/                  examination + adjustment methodology
 *   generator meta tag + theme stylesheet  WordPress 4.8.25 on EightMedi Lite,
 *                                          verified directly in the fetched HTML
 *   ?page_id=583 ("Staðsetning" nav link)  returns their own 404 page, verified
 *   Google Maps listing (checked 2026-07-28) unclaimed, zero reviews; competitor
 *                                          "Kírópraktorstofa Íslands" shows 5.0
 *                                          from 112 reviews, see public/.../real/HARVEST.md
 *
 * HONESTY: the "fyrsta opinbera starfsleyfi kírópraktors á Norðurlöndunum" claim
 * is printed on this page attributed to the practice's own account ("að sögn
 * stofunnar sjálfrar"), never asserted as independently verified history. The
 * 257-visitors-in-2025 statistic from their news blog is deliberately NOT used
 * anywhere on this page. No staff besides Tryggvi, no reviews, no ratings are
 * invented; none exist publicly to cite.
 */

export const asset = (p: string) => `${import.meta.env.BASE_URL}kiropraktorstofan/${p}`

export const IMG = {
  /** Generated period stand-ins (no real archival photography exists, see
   *  public/kiropraktorstofan/real/HARVEST.md). Treated with the D1 grade so
   *  they sit consistently against the one real photograph below. */
  doorway1977: asset('1977-kyrralif.jpg'),
  document: asset('leyfid-monument.jpg'),
  hendur: asset('hendur-medferd.jpg'),
  /** The one real, usable photograph found anywhere for this practice: the
   *  clinic's own uploaded interior shot, Canon EOS M10, 2017-09-05. */
  stofanReal: asset('real/stofan-2017-09-05.jpg'),
  logo: asset('real/logo-main-100x100.png'),
}

/* ── identity ─────────────────────────────────────────────────────────── */

export const PHONE_DISPLAY = '896 3004'
export const PHONE_HREF = 'tel:+3548963004'
export const EMAIL = 'tryggvi@kiropraktorstofan.is'
export const EMAIL_HREF = `mailto:${EMAIL}`
export const PRACTICE_NAME = 'Kírópraktorstofa Tryggva Jónassonar'
export const ADDRESS_LINE1 = 'Háaleitisbraut 66'
export const ADDRESS_LINE2 = '103 Reykjavík'
export const ADDRESS_NOTE = 'Við Grensáskirkju, norðurendi hússins, sér inngangur.'
export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=H%C3%A1aleitisbraut+66+103+Reykjav%C3%ADk'

/* ── real, published opening hours ───────────────────────────────────────
 * Verified on TWO separate pages (/boka-tima/ and /english/), word for word
 * consistent: "Móttakan er opin á mánudögum, miðvikudögum og föstudögum frá
 * 9-12 og 13.16. Þriðju- og fimmtudaga er móttakan opin frá 9-12 og 14-17."
 * No weekend hours are published anywhere on the site, so none are printed
 * here (see the shared brief's rule 11: omit rather than assume). */
export interface HourSpan {
  days: string
  span: string
}
export const HOURS: HourSpan[] = [
  { days: 'Mánudaga, miðvikudaga og föstudaga', span: '9.00-12.00 og 13.00-16.00' },
  { days: 'Þriðjudaga og fimmtudaga', span: '9.00-12.00 og 14.00-17.00' },
]

/* ── real, published 2026 taxti (verified on /upplysingar-og-verd/ and
 * cross-checked against the amounts on /english/, identical) ────────────── */
export interface PriceRow {
  item: string
  price: string
}
export const PRICES: PriceRow[] = [
  { item: 'Komugjald og meðferð', price: '6.800 kr.' },
  { item: 'Komugjald, viðtal, skoðun og fyrsta meðferð', price: '12.500 kr.' },
  { item: 'Skoðun eftir 24 mánuði', price: '9.200 kr.' },
  { item: 'Teygjubæklingur og kennsla æfinga', price: '1.100 kr.' },
]
export const PRICE_VALID = 'Taxtinn tók gildi 1. janúar 2026 og gildir árið út.'
export const PRICE_NOTE =
  'Komugjald er alltaf greitt, hvort sem meðferð er framkvæmd eða ekki. Sé forföllum ekki skilað með dags fyrirvara er greiddur sérstakur skróptaxti, 2.300 kr.'

/* ── the licence facts (KAFLI 01 spec row) ──────────────────────────────── */
export const LEYFID_FACTS = [
  { n: '01', label: 'Stúdent', value: 'MR, 1971' },
  { n: '02', label: 'Nám', value: 'AECC, Englandi, 1971-1976' },
  { n: '03', label: 'Embætti', value: 'Landlæknir og Alþingi' },
  { n: '04', label: 'Undirskrift', value: 'Matthías Bjarnason, ráðherra' },
]

/* ── the examination method (KAFLI 02 spec row), condensed honestly from
 * their own /hvad-er-kiropraktor/ page ──────────────────────────────────── */
export const EXAM_FACTS = [
  {
    n: '01',
    label: 'Hreyfiskoðun',
    body: 'Hreyfing hryggjarins er mæld svæði fyrir svæði. Frávik í hreyfingu benda á hvar vandinn liggur.',
  },
  {
    n: '02',
    label: 'Vöðvaskoðun',
    body: 'Lengd og styrkur vöðva eru skoðuð í leit að festumeinum eða vöðvabólgu.',
  },
  {
    n: '03',
    label: 'Beina og tauga',
    body: 'Liðamót hryggjarins eru skoðuð fyrir bólgu, og taugastarfsemi ef saga er um það.',
  },
  {
    n: '04',
    label: 'Líkamsstaða',
    body: 'Skekkja og fótleggjalengd eru mældar með tæki sem Tryggvi hannaði sjálfur snemma á ferlinum.',
  },
]

export const SPINE_FACT =
  'Hryggurinn hefur 24 hryggjarliði og spjaldhrygg, og um 107 liðamót samtals þegar rifbeinin eru talin með. Tryggvi hefur skráð hrygglengd hvers gests sem til hans hefur komið, áratugum saman.'

export const TREATMENT_LENGTH_NOTE =
  'Ferlitími meðferðar er í grunninn um einn mánuður, frá fyrstu skoðun til loka meðferðar.'

export const XRAY_NOTE =
  'Tryggvi hefur aldrei átt eða rekið röntgentæki. Þegar þörf er á myndgreiningu koma læknar að þeim rannsóknum.'

export const PATIENT_COUNT_NOTE =
  'Að eigin sögn hafa fleiri en 17.000 manns leitað til Tryggva frá því að stofan opnaði.'

/* ── nav ──────────────────────────────────────────────────────────────── */

export const NAV = [
  { href: '#leyfid', label: 'Leyfið' },
  { href: '#medferdin', label: 'Meðferðin' },
  { href: '#verd', label: 'Verðskrá' },
  { href: '#stadsetning', label: 'Staðsetning' },
  { href: '#bokun', label: 'Bóka tíma' },
]

/** Rail metadata only (D5 chapter progress rail) — the titles, abstracts and
 *  ghost words for each chapter head are hardcoded per-chapter in Page.tsx,
 *  same convention as v1. */
export const CHAPTERS = [
  { n: '01', short: '1977' },
  { n: '02', short: 'Meðferðin' },
  { n: '03', short: 'Verðskrá' },
  { n: '04', short: 'Stofan' },
]

/* ── JSON-LD ──────────────────────────────────────────────────────────── */

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: PRACTICE_NAME,
  description:
    'Kírópraktorstofa í Reykjavík, starfrækt af Tryggva Jónassyni síðan 1977. Hann hlaut fyrsta opinbera starfsleyfi kírópraktors á Íslandi.',
  telephone: '+354 896 3004',
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS_LINE1,
    postalCode: '103',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Wednesday', 'Friday'],
      opens: '09:00',
      closes: '16:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Thursday'],
      opens: '09:00',
      closes: '17:00',
    },
  ],
  founder: {
    '@type': 'Person',
    name: 'Tryggvi Jónasson',
  },
  foundingDate: '1977',
}

/* ── companyEntry — for the lead to merge into src/preview/companies.ts ─── */

export interface AuditList {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
}

export const companyEntry = {
  slug: 'kiropraktorstofan',
  route: '/preview/kiropraktorstofan',
  name: PRACTICE_NAME,
  sector: 'Kírópraktík',
  location: 'Háaleitisbraut 66, 103 Reykjavík',
  region: 'Reykjavík',
  established: 'Frá 1977',
  currentUrl: 'http://www.kiropraktorstofan.is',
  ownerEmail: EMAIL,
  concept: 'Fyrsta leyfið',
  conceptTagline:
    'A dark, bound case history in four chapters: 1977 and the licence itself, the treatment, the price list, the practice today, ending at a working booking request. Full-bleed period stand-in photography and the one real clinic photo that exists, one oxblood accent, condensed display type, no dark+gold+serif reflex.',
  accent: '#9A2B34',
  dark: true,
  status: 'Concept ready' as const,
  thumb: asset('real/stofan-2017-09-05.jpg'),
  photoCredit:
    'Ein mynd á síðunni er raunveruleg ljósmynd af stofunni og Tryggva sjálfum, fengin af heimasíðu stofunnar (2017). Aðrar myndir eru skapaðar, abstrakt myndir sem vísa til sögunnar (skjal, hurð, hendur), ekki raunverulegar myndir af herbergjum stofunnar eða starfsfólki.',
  audit: {
    strengths: [
      'A genuinely rare, richly documented origin story in Tryggvi’s own words: MR 1971, AECC (Anglo-European College of Chiropractic) 1971 to 1976, a Danish internship, the 1977 opening, and the landlæknir/Alþingi licence process, all published on their own ferilskrá page',
      'A real, current, dated price list: a 2026 taxti explicitly stated to take effect 1 January 2026, with four listed services and a clearly stated no-show fee',
      'Real, working opening hours published consistently on two separate pages, plus a real booking channel (phone, SMS, email, and a contact form)',
    ],
    weaknesses: [
      'Runs WordPress 4.8.25 on the free "EightMedi Lite" theme, a 2017-era build, confirmed directly via the page’s own generator meta tag and theme stylesheet links',
      'HTTPS is broken: the SSL certificate is issued to plesk-web-11.vist.is, not kiropraktorstofan.is, verified with a direct TLS handshake, so every visitor’s browser shows a security warning',
      'A COVID-19 information banner still runs across the top of every page in 2026',
      'The practice’s own name is misspelled repeatedly across the homepage and footer as "Kíróprkatorstofa" / "Kíróprkatorstofunnar" instead of "Kírópraktorstofa", verified directly in the page HTML',
      'The "Staðsetning" link in the main navigation is dead: it points to page_id=583, which returns the site’s own 404 page, verified directly',
      'The real, current 2026 price list sits three clicks deep on a page most visitors never find, while stale lines from 2021 and 2023 ("Veturinn 2023 er stofan opin eins og venjulega", a reference to a Mannlíf article from June 2021) are still presented as if current',
      'Tryggvi’s own remarkable origin story, a genuine first-in-Scandinavia chiropractic licence won through an Alþingi act, is buried in a small blog post dated October 2025 with no visibility from the homepage',
      'The practice has no claimed Google Business profile: zero reviews are visible and the listing is unclaimed (checked 2026-07-28), while the competing practice Kírópraktorstofa Íslands shows a 5.0 rating from 112 reviews on the same search',
    ],
    opportunities: [
      'Tell the licence story as the whole page: MR to AECC to the 1977 opening to the landlæknir/Alþingi fight, ending at a working booking request',
      'Put the real, current 2026 price list above the fold instead of three clicks deep',
      'Fix the basics a 2017 WordPress theme cannot: working HTTPS, a correct practice name, no stale COVID banner, a working location link',
      'Claim the Google Business profile and start collecting reviews, to close the visible gap against a competitor sitting at 5.0 from 112',
    ],
  } as AuditList,
  positioning:
    'Kírópraktorstofa Tryggva Jónassonar holds a genuinely rare credential, Iceland’s first official chiropractor licence, won through a real fight with landlæknir and a real Alþingi act signed by a named minister, all recounted in Tryggvi’s own words. All of that sits behind a 2017 WordPress theme with broken HTTPS, a permanent COVID-19 banner, a dead location link, an unclaimed Google Business profile with zero reviews against a competitor at 5.0 from 112, and the practice’s own name misspelled on its own homepage. The redesign turns the licence itself into the page’s spine: a dark, bound case history in four chapters, from the 1977 licence to the treatment to the real 2026 price list to the practice today, with one working way to ask for a time.',
  outreach: {
    subject: 'Hugmynd að nýrri heimasíðu fyrir kírópraktorstofuna',
    body: `Góðan dag Tryggvi,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég rakst á heimasíðu stofunnar ykkar og las mér til um söguna, hvernig þú fórst í nám við AECC árið 1971, opnaðir stofu haustið 1977 og fékkst að lokum fyrsta opinbera starfsleyfið sem kírópraktor hér á landi eftir að hafa átt í útistöðum við landlækni og Alþingi. Þetta er merkileg saga sem á skilið meira en gamalt vefumsjónarkerfi frá 2017 getur sýnt. Núverandi síða er til dæmis enn með upplýsingum um COVID-19 efst, öryggisvottorðið er ekki lengur í lagi svo vafrar vara við henni, og nafn stofunnar er ranglega stafsett á nokkrum stöðum á forsíðunni. Ég tók líka eftir að Google-færsla stofunnar er óstaðfest og engar umsagnir sýnilegar, á meðan samkeppnisaðili í sömu leit er með 5,0 í einkunn úr 112 umsögnum.

Mér datt í hug að hanna frumgerð að nýrri síðu sem segir söguna ykkar almennilega, frá MR og AECC til leyfisins sjálfs, með verðskránni ykkar sýnilegri og einfaldri leið fyrir fólk til að biðja um tíma. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðin er hér: [HLEKKUR Á FRUMGERÐ]

Endilega látið mig vita ef ykkur líst vel á þetta.

Bestu kveðjur, Sindri
sindrimar02@gmail.com`,
  },
}
