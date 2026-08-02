/* ── Westfjords Adventures · „Sex leiðir vestur" ──────────────────────────
   Patreksfjörður, Vestfirðir. Independent tour operator, no chain. All facts
   below were verified 2026-08-01 against westfjordsadventures.com (wa.is
   redirects there) and are used AS GIVEN, with no invented prices, tour
   durations, departure times, group sizes or review scores anywhere on the
   page (see rule 4 of the build brief).

   info@wa.is · 456-5006. SIX distinct service lines: bus tours, super-jeep
   tours, hiking, biking, multi-day excursions, plus bike and car rental and
   accommodation. Booking runs on Bókun (bokun.io), a real experience-calendar
   widget embedded on their tour pages - this page hands off to that, it does
   not fake a booking engine.

   THE WEDGE (measured, not editorialised): their WINTER office hours are
   Monday to Friday, 09:00 to 11:00 only, and they publish no FAQ anywhere.
   That scope word "winter" matters - today is August, so these are NOT
   necessarily today's hours, only the verified fact from their current site.
   The page labels them as winter hours throughout rather than implying they
   are the hours right now.

   CURRENT SITE AUDIT (verified 2026-08-01, cited here for the record - not
   repeated as marketing copy on the page itself, since a live audit stat has
   no place in a tourism company's own voice):
     - WordPress, 155 KB, no <h1> anywhere
     - 21 of 22 images ship with NO alt text at all (a hard WCAG failure)
     - zero webp, no lazy loading
     - lang="en-US" with no hreflang
     - a 335-character meta description with trailing whitespace
   This rebuild's answer: every image below carries real, specific Icelandic
   alt text (rule 5), the hero renders a real <h1>, and META.description below
   is written to a sane length on purpose.

   CAUTION - image provenance: several of the 2026/01 files were originally
   titled in stock-agency comma format (e.g. "A,Beautiful,Morning,Beach,In,
   Tálknafirði,Iceland" style names), which means they are very likely
   LICENSED STOCK the client bought, not their own photography. They are
   already published live on the client's own site, so they are fine to use
   in a prototype, but this is NOT presented as the client's own photography
   anywhere in the copy, and PHOTO_CREDIT below flags it so the handoff
   confirms licensing before anything launches. */

import type { PreviewCompany } from '../companies'

/* ── real media library - the ONLY 12 URLs given, referenced remotely,
      nothing downloaded, nothing invented ── */
export const IMG = {
  dynjandi: {
    src: 'https://westfjordsadventures.com/wp-content/uploads/2025/03/Dynjandi-scaled.jpg',
    alt: 'Dynjandifoss, stærsti foss Vestfjarða, með manneskju í rauðum jakka til hliðsjónar um stærðina',
  },
  raudasandurLoft: {
    src: 'https://westfjordsadventures.com/wp-content/uploads/2025/03/Raudasandur-scaled.jpg',
    alt: 'Loftmynd af rauðgullinni fjörunni á Rauðasandi',
  },
  osvor: {
    src: 'https://westfjordsadventures.com/wp-content/uploads/2025/03/Osvor-scaled.jpg',
    alt: 'Torfbæirnir í sjóminjasafninu Ósvör í kvöldsól',
  },
  dyrafjordur: {
    src: 'https://westfjordsadventures.com/wp-content/uploads/2025/03/Dyrafjordur-scaled.jpg',
    alt: 'Útsýni yfir Dýrafjörð af Sandafelli',
  },
  talknafjordur: {
    src: 'https://westfjordsadventures.com/wp-content/uploads/2025/03/Talknafjordur-scaled.jpg',
    alt: 'Fjaran í Tálknafirði í fyrstu birtu dagsins',
  },
  selur: {
    src: 'https://westfjordsadventures.com/wp-content/uploads/2025/02/selur-scaled.jpg',
    alt: 'Selur liggjandi á þangi við ströndina',
  },
  gamliBaerinn: {
    src: 'https://westfjordsadventures.com/wp-content/uploads/2025/03/A-hus-Arnarfjordur-scaled.jpg',
    alt: 'Yfirgefið hús í Arnarfirði í þungbúnu skýjafari',
  },
  sjodrangar: {
    src: 'https://westfjordsadventures.com/wp-content/uploads/2025/02/Fjord-Wandering1-1-scaled.jpg',
    alt: 'Sjávardrangar úti fyrir strönd Vestfjarða',
  },
  klettabrunGestir: {
    src: 'https://westfjordsadventures.com/wp-content/uploads/2025/02/The-Grand-West2-1-scaled.png',
    alt: 'Tveir gestir sitja á klettabrún við Látrabjarg',
  },
  rutan: {
    src: 'https://westfjordsadventures.com/wp-content/uploads/2021/09/bus-tours3-scaled-1.jpg',
    alt: 'Rúta Westfjords Adventures við Dynjandifoss',
  },
  raudasandurGangandi: {
    src: 'https://westfjordsadventures.com/wp-content/uploads/2021/09/51faf19386423-Rauasandi-SP-JBW-scaled-1.jpg',
    alt: 'Gestur gengur eftir fjörunni á Rauðasandi',
  },
  latrabjargGestur: {
    src: 'https://westfjordsadventures.com/wp-content/uploads/2021/09/20080719-IMG_8836-scaled-1.jpg',
    alt: 'Gestur stendur á klettabrún við Látrabjarg',
  },
} as const

export type ImgKey = keyof typeof IMG

/* ── the six ways - the centrepiece collection. Order matches the brief's
      own listing: bus, jeep, hiking, biking, multi-day, then rental+stay as
      the sixth, combined line (see the file-level comment above). No prices,
      durations, departure times or group sizes anywhere - those live only in
      the real Bókun widget on the real tour pages. ── */
export interface Tour {
  id: string
  num: string
  title: string
  desc: string
  img: (typeof IMG)[ImgKey]
}

export const TOURS: Tour[] = [
  {
    id: 'rutuferdir',
    num: '01',
    title: 'Rútuferðir',
    desc: 'Þægilegar hópferðir um helstu náttúruperlur Vestfjarða í fylgd leiðsögumanns.',
    img: IMG.rutan,
  },
  {
    id: 'jeppaferdir',
    num: '02',
    title: 'Jeppaferðir',
    desc: 'Farið er um vegleysur og hálendisslóðir á öflugum breyttum jeppum.',
    img: IMG.sjodrangar,
  },
  {
    id: 'gonguferdir',
    num: '03',
    title: 'Gönguferðir',
    desc: 'Frá léttum fjallstígum til krefjandi óbyggðagöngu.',
    img: IMG.klettabrunGestir,
  },
  {
    id: 'hjolaferdir',
    num: '04',
    title: 'Hjólaferðir',
    desc: 'Hjólað er um kyrrláta firði og malarvegi, fjarri mestu umferðinni.',
    img: IMG.dyrafjordur,
  },
  {
    id: 'margra-daga-ferdir',
    num: '05',
    title: 'Margra daga ferðir',
    desc: 'Samfelldar ferðir sem sýna svæðið þvert og endilangt á nokkrum dögum.',
    img: IMG.raudasandurLoft,
  },
  {
    id: 'leiga-og-gisting',
    num: '06',
    title: 'Leiga og gisting',
    desc: 'Hjóla- og bílaleiga, auk gistingar fyrir þá sem vilja dvelja lengur.',
    img: IMG.osvor,
  },
]

/* ── images-cloud selection: an asymmetric scatter, distinct from the six
      tour photos above so the block reads as its own thing, not a repeat. ── */
export const CLOUD_IMAGES: { img: (typeof IMG)[ImgKey]; caption: string }[] = [
  { img: IMG.talknafjordur, caption: 'Tálknafjörður' },
  { img: IMG.raudasandurGangandi, caption: 'Rauðasandur' },
  { img: IMG.latrabjargGestur, caption: 'Látrabjarg' },
  { img: IMG.selur, caption: 'Selalátur' },
]

/* ── images-marquee: the full 12-image library on loop, so this block alone
      gives a sense of the whole of Vestfirðir. The array is duplicated once
      in Page.tsx to build a seamless CSS-transform loop, not here. ── */
export const MARQUEE_IMAGES = Object.values(IMG)

/* ── contact - real, verified facts only ── */
export const CONTACT = {
  phoneDisplay: '456 5006',
  phoneHref: 'tel:+3544565006',
  email: 'info@wa.is',
  emailHref: 'mailto:info@wa.is',
  location: 'Patreksfjörður, Vestfirðir',
  website: 'https://westfjordsadventures.com',
  websiteDisplay: 'westfjordsadventures.com',
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Westfjords Adventures, Patreksfjörður, Ísland'),
}

/* Winter office hours only - the wedge, stated plainly and scoped honestly.
   Bókun and email are genuinely always-on channels (that is simply what an
   email address and an online booking widget are), so pairing them here is
   an honest inference, not an invented operating fact. */
export const HOURS = {
  days: 'Mánudaga til föstudaga',
  time: '09:00-11:00',
  note: 'Vetraropnun skrifstofunnar, samkvæmt núverandi vef fyrirtækisins. Utan þessa glugga er tölvupóstur öruggasta leiðin, og bein bókun í gegnum Bókun er alltaf opin.',
}

/* ── the eclipse - every claim kept to what is verified. No viewing times,
      durations, prices, tour availability or booking capacity are invented;
      Page.tsx computes a live day-countdown from this date at render time
      instead of hardcoding a number that would go stale. ── */
export const ECLIPSE = {
  isoDate: '2026-08-12T00:00:00',
  dateLabel: '12. ágúst 2026',
  weekday: 'Miðvikudagur',
  heading: 'Almyrkvi á sólu',
  body: 'Miðvikudaginn 12. ágúst 2026 verður almyrkvi á sólu. Alskugginn gengur yfir Ísland, þar á meðal Vestfirði. Westfjords Adventures mun staðfesta tíma og skipulag þegar nær dregur.',
  /* CAUTION: the brief states the client's own media library already holds
     two eclipse photographs, but no URL for either was supplied in the
     verified asset list above, and inventing one would risk shipping a
     broken image (explicitly forbidden). This block therefore reuses
     gamliBaerinn (the storm-lit Arnarfjörður barn, from the verified list)
     as an atmospheric, darkened-sky backdrop - it is NOT presented as a
     photo of the eclipse itself. TODO: swap in the real eclipse photograph
     once its URL is sourced from the client's media library. */
  bgImg: IMG.gamliBaerinn,
}

export const META = {
  title: 'Westfjords Adventures | Sex leiðir um Vestfirði frá Patreksfirði',
  description:
    'Westfjords Adventures skipuleggur rútuferðir, jeppaferðir, göngu- og hjólaferðir, margra daga ferðir og leigu og gistingu um Vestfirði frá Patreksfirði. Bókaðu beint í gegnum Bókun.',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Westfjords Adventures',
  telephone: '+354 456 5006',
  email: 'info@wa.is',
  url: 'https://westfjordsadventures.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Patreksfjörður',
    addressCountry: 'IS',
  },
  areaServed: 'Vestfirðir, Ísland',
}

/* ── Dashboard entry ─────────────────────────────────────────────────────
   Exported as `companyEntry` per the shared PreviewCompany contract. Not
   wired into companies.ts here - someone else imports and registers it. ── */
export const companyEntry: PreviewCompany = {
  slug: 'westfjords',
  route: '/preview/westfjords',
  name: 'Westfjords Adventures',
  sector: 'Ferðaþjónusta · sex leiðir um Vestfirði',
  location: 'Patreksfjörður',
  region: 'Vestfirðir',
  established: 'Óháð, engin keðja',
  currentUrl: 'https://westfjordsadventures.com',
  ownerEmail: 'info@wa.is',
  concept: 'Sex leiðir vestur',
  conceptTagline:
    'Sex ólíkar leiðir inn í sömu firðina, hver sem sinn eigin safnhlutur frekar en hluti af einni langri síðu. Byggt á einingasafni Tengile MalaMala: nafngreindar, endurnýtanlegar blokkir í stað einnar heildstæðrar síðu, keyrt á hreinni CSS, engu hreyfimyndasafni.',
  accent: '#5C6E21',
  dark: false,
  status: 'Concept ready',
  thumb: IMG.dynjandi.src,
  ownPhotography: false,
  photoCredit:
    'Myndir eru af núverandi vef Westfjords Adventures. Nokkrar þeirra bera upprunaleg skráarheiti sem benda til keypts myndefnis (stock) frekar en eigin ljósmyndunar fyrirtækisins, svo staðfesta þarf myndaréttindi áður en vefurinn fer í loftið.',
  audit: {
    strengths: [
      'Sex raunverulega ólíkar þjónustulínur (rútur, jeppar, göngu- og hjólaferðir, margra daga ferðir, leiga og gisting) undir einu óháðu fyrirtæki, ekki keðju',
      'Bókunarkerfið Bókun er þegar til staðar og virkar á ferðasíðunum, ekkert þarf að finna upp',
      'Sterkt raunverulegt myndefni af helstu kennileitum: Dynjanda, Rauðasandi, Látrabjargi, Ósvör',
      'Almyrkvi á sólu 12. ágúst 2026 gengur yfir Vestfirði, tímabært og einstakt tilefni sem enginn keppinautur getur endurtekið',
    ],
    weaknesses: [
      'WordPress-síðan er 155 KB, með engri fyrirsögn (h1) sem leitarvélar geta lesið',
      '21 af 22 myndum á síðunni eru alveg án myndlýsingar, sem er hreint WCAG-brot fyrir skjálesara',
      'Ekkert webp, engin sein-hleðsla (lazy loading), lang="en-US" án hreflang fyrir íslensku',
      'Meta-lýsingin er 335 stafir með eftirfarandi bili, langt yfir það sem leitarvélar sýna',
      'Skrifstofan er aðeins opin tvo tíma á dag, 9-11 að morgni, virka daga á veturna, og engin FAQ-síða er birt til að brúa bilið',
    ],
    opportunities: [
      'Setja sex leiðirnar fram sem safn frekar en flettilista, í anda þeirra eigin vöruframboðs',
      'Laga aðgengi og sýnileika í leit með réttri fyrirsögn, myndlýsingum og hóflegri meta-lýsingu',
      'Gera Bókun sýnilega og milliliðalausa í stað þess að fela hana bak við undirsíður',
      'Nýta almyrkvann 12. ágúst sem tímabundið, heiðarlegt tilefni til að fá fólk á síðuna núna',
    ],
  },
  positioning:
    'Westfjords Adventures er óháð fyrirtæki á Patreksfirði með sex raunverulega ólíkar leiðir um Vestfirði og bókunarkerfi sem þegar virkar. Núverandi vefur sýnir þetta allt í einum hrærigraut, án fyrirsagnar, með myndlýsingu á aðeins einni af tuttugu og tveimur myndum og skrifstofu sem er opin tvo tíma á dag. Endurhönnunin setur leiðirnar sex fram sem safn, hverja með sinni eigin mynd, og gerir Bókun sýnilegt frá byrjun í stað þess að vera falið.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Westfjords Adventures',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Westfjords Adventures býður upp á sex ólíkar leiðir um Vestfirði, rútuferðir, jeppaferðir, göngu- og hjólaferðir, margra daga ferðir og leigu og gistingu, sem er óvenju breitt vöruframboð fyrir eitt fyrirtæki. Núverandi vefsíða sýnir þetta hins vegar allt í einum hrærigraut, án fyrirsagnar sem leitarvélar geta lesið og með myndlýsingu á aðeins einni af tuttugu og tveimur myndum, sem gerir vefinn illa aðgengilegan og illa sýnilegan í leit.

Ég tók líka eftir að skrifstofan er aðeins opin tvo tíma á dag yfir vetrarmánuðina, frá 9 til 11 á morgnana. Það er stuttur gluggi fyrir erlenda gesti í öðrum tímabeltum að ná sambandi símleiðis.

Mér fannst efniviðurinn eiga betra skilið, svo ég hannaði frumgerð að nýrri forsíðu sem setur ferðirnar sex fram sem safn, hverja með sinni eigin mynd og lýsingu, og gerir bókunina í gegnum Bókun kerfið ykkar sýnilega frá byrjun. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta getum við spjallað og fundið sanngjarnt verð. Ef ekki er ekkert mál, og ég vona að þetta veiti ykkur smá innblástur.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}

/* Phone data budget. WordPress already generates sized variants of every one of
   these files and they were each verified with a real request, not guessed:
   Dynjandi alone is 13.7 MB at source and 152 KB at 1024w. Serving the full-size
   file to a phone is the single biggest performance defect a build like this can
   ship. Images with no entry here have no generated variants and are already
   small enough to serve whole. */
export const SRCSET: Record<string, string> = {
  'https://westfjordsadventures.com/wp-content/uploads/2025/03/Dynjandi-scaled.jpg':
    'https://westfjordsadventures.com/wp-content/uploads/2025/03/Dynjandi-768x512.jpg 768w, https://westfjordsadventures.com/wp-content/uploads/2025/03/Dynjandi-1024x683.jpg 1024w, https://westfjordsadventures.com/wp-content/uploads/2025/03/Dynjandi-1536x1024.jpg 1536w',
  'https://westfjordsadventures.com/wp-content/uploads/2025/03/Raudasandur-scaled.jpg':
    'https://westfjordsadventures.com/wp-content/uploads/2025/03/Raudasandur-768x512.jpg 768w, https://westfjordsadventures.com/wp-content/uploads/2025/03/Raudasandur-1024x683.jpg 1024w, https://westfjordsadventures.com/wp-content/uploads/2025/03/Raudasandur-1536x1024.jpg 1536w',
  'https://westfjordsadventures.com/wp-content/uploads/2025/03/Dyrafjordur-scaled.jpg':
    'https://westfjordsadventures.com/wp-content/uploads/2025/03/Dyrafjordur-1024x683.jpg 1024w',
  'https://westfjordsadventures.com/wp-content/uploads/2025/03/Talknafjordur-scaled.jpg':
    'https://westfjordsadventures.com/wp-content/uploads/2025/03/Talknafjordur-600x800.jpg 600w, https://westfjordsadventures.com/wp-content/uploads/2025/03/Talknafjordur-768x1024.jpg 768w, https://westfjordsadventures.com/wp-content/uploads/2025/03/Talknafjordur-1536x2048.jpg 1536w',
  'https://westfjordsadventures.com/wp-content/uploads/2025/02/selur-scaled.jpg':
    'https://westfjordsadventures.com/wp-content/uploads/2025/02/selur-768x512.jpg 768w, https://westfjordsadventures.com/wp-content/uploads/2025/02/selur-1024x683.jpg 1024w, https://westfjordsadventures.com/wp-content/uploads/2025/02/selur-1536x1024.jpg 1536w',
  'https://westfjordsadventures.com/wp-content/uploads/2025/03/A-hus-Arnarfjordur-scaled.jpg':
    'https://westfjordsadventures.com/wp-content/uploads/2025/03/A-hus-Arnarfjordur-768x512.jpg 768w, https://westfjordsadventures.com/wp-content/uploads/2025/03/A-hus-Arnarfjordur-1024x683.jpg 1024w, https://westfjordsadventures.com/wp-content/uploads/2025/03/A-hus-Arnarfjordur-1536x1024.jpg 1536w',
  'https://westfjordsadventures.com/wp-content/uploads/2025/02/Fjord-Wandering1-1-scaled.jpg':
    'https://westfjordsadventures.com/wp-content/uploads/2025/02/Fjord-Wandering1-1-768x512.jpg 768w, https://westfjordsadventures.com/wp-content/uploads/2025/02/Fjord-Wandering1-1-1024x683.jpg 1024w, https://westfjordsadventures.com/wp-content/uploads/2025/02/Fjord-Wandering1-1-1536x1024.jpg 1536w',
  'https://westfjordsadventures.com/wp-content/uploads/2025/02/The-Grand-West2-1-scaled.png':
    'https://westfjordsadventures.com/wp-content/uploads/2025/02/The-Grand-West2-1-768x576.png 768w, https://westfjordsadventures.com/wp-content/uploads/2025/02/The-Grand-West2-1-800x600.png 800w, https://westfjordsadventures.com/wp-content/uploads/2025/02/The-Grand-West2-1-1024x768.png 1024w',
  'https://westfjordsadventures.com/wp-content/uploads/2021/09/bus-tours3-scaled-1.jpg':
    'https://westfjordsadventures.com/wp-content/uploads/2021/09/bus-tours3-scaled-1-768x576.jpg 768w, https://westfjordsadventures.com/wp-content/uploads/2021/09/bus-tours3-scaled-1-800x600.jpg 800w, https://westfjordsadventures.com/wp-content/uploads/2021/09/bus-tours3-scaled-1-1024x768.jpg 1024w',
  'https://westfjordsadventures.com/wp-content/uploads/2021/09/51faf19386423-Rauasandi-SP-JBW-scaled-1.jpg':
    'https://westfjordsadventures.com/wp-content/uploads/2021/09/51faf19386423-Rauasandi-SP-JBW-scaled-1-768x512.jpg 768w, https://westfjordsadventures.com/wp-content/uploads/2021/09/51faf19386423-Rauasandi-SP-JBW-scaled-1-1024x683.jpg 1024w, https://westfjordsadventures.com/wp-content/uploads/2021/09/51faf19386423-Rauasandi-SP-JBW-scaled-1-1536x1024.jpg 1536w',
  'https://westfjordsadventures.com/wp-content/uploads/2021/09/20080719-IMG_8836-scaled-1.jpg':
    'https://westfjordsadventures.com/wp-content/uploads/2021/09/20080719-IMG_8836-scaled-1-768x512.jpg 768w, https://westfjordsadventures.com/wp-content/uploads/2021/09/20080719-IMG_8836-scaled-1-1024x683.jpg 1024w, https://westfjordsadventures.com/wp-content/uploads/2021/09/20080719-IMG_8836-scaled-1-1536x1024.jpg 1536w',
}

/** Most images here sit full-bleed on a phone and about half-width on desktop. */
export const SIZES = '(max-width: 900px) 100vw, 50vw'
