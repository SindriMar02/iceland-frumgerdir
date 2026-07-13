/* Prentverk Selfoss — YFIRPRENT — all copy and verified facts.
 *
 * Facts verified 2026-07 against já.is, 1819.is, finna.is, Skatturinn and the
 * Wayback snapshot of the old pvs.is (2025-03-07):
 * — Prentverk Selfoss ehf, kt. 470909-0990, registered 01.09.2009, Árborg.
 * — Gunnar Óðinn Gunnarsson, stjórnarmaður per the company registry.
 * — pvs@pvs.is · 898 3877 · Mon–Fri 08:00–17:00 (1819.is).
 * — Address: já.is currently lists Gagnheiði 43, 800 Selfoss (1819.is/finna.is
 *   still say Fossnes A — já.is preferred per research note).
 * — Old-site asset bundle proves real showcased jobs: nafnspjald, jólakort,
 *   flugeldablaðið (rescue-squad fireworks brochure), a Lions club piece,
 *   Litli Bergþór (local magazine). Brand red #D1232A, ink #231F20 sampled
 *   from their recovered logo.
 */

export const PHONE_DISPLAY = '898 3877'
export const PHONE_HREF = 'tel:+3548983877'
export const EMAIL = 'pvs@pvs.is'
export const ADDRESS = 'Gagnheiði 43, 800 Selfoss'
export const HOURS = 'Mánudaga til föstudaga 08:00 til 17:00'
export const HOURS_SHORT = 'Mán til fös 08:00 – 17:00'

export const META = {
  title: 'Prentverk Selfoss — Prentþjónusta á Suðurlandi',
  description:
    'Prentverk Selfoss er prentsmiðja á Selfossi sem þjónar Suðurlandi öllu. Nafnspjöld, jólakort, bæklingar og félagsblöð síðan 2009. Sími 898 3877.',
}

/**
 * Photography. logo/husid are real (harvested logo + já.is street view of
 * their building). Their old site only carries 261×93 thumbnails, so the
 * press/paper photos are vetted Unsplash: hero QRykXu51r_0 (offset press,
 * ink rollers) · inkhand Y47w3a8uR94 (hand inking a plate) · newspapers
 * H6eaxcGNQbU · paperstack tp0BLGIv4dU. None depict their actual shop floor,
 * so no caption claims they do — captions describe the craft generically.
 */
export const IMG = {
  logo: 'preview/prentverk/logo.webp',
  husid: 'preview/prentverk/husid.webp',
  hero: 'preview/prentverk/hero.webp',
  inkhand: 'preview/prentverk/inkhand.webp',
  newspapers: 'preview/prentverk/newspapers.webp',
  paperstack: 'preview/prentverk/paperstack.webp',
}

export const NAV = [
  { label: 'Þjónusta', href: '#thjonusta' },
  { label: 'Verkefni', href: '#verkefni' },
  { label: 'Ferlið', href: '#ferlid' },
  { label: 'Um okkur', href: '#um-okkur' },
]

export const HERO = {
  linja1: 'Prentverk',
  linja2: 'Selfoss',
  promise: 'Prentun fyrir fyrirtæki og félög á Suðurlandi síðan 2009.',
  sub: 'Nafnspjöld, jólakort, bæklingar og félagsblöð. Þú hringir, við prentum.',
  specLine: 'TVEIR LITIR · RAUÐUR D1232A · SVARTUR 231F20 · PAPPÍR FAFAF7',
}

export const SERVICES_HEADING = 'Það sem við prentum'
export const SERVICES_INTRO =
  'Engin verðskrá með stjörnum og smáletri. Hvert verk er verðlagt eftir stærð, upplagi og pappír, svo einfaldast er að lýsa verkinu og fá verð beint.'

export const SERVICES: { name: string; desc: string }[] = [
  {
    name: 'Nafnspjöld',
    desc: 'Fyrstu kynni fyrirtækisins, snyrtilega sett og prentuð á góðan pappír.',
  },
  {
    name: 'Jólakort og tækifæriskort',
    desc: 'Kort fyrir jólin og önnur tilefni, með þínum texta og þínu merki.',
  },
  {
    name: 'Bæklingar og blöð',
    desc: 'Kynningarefni, dagskrár og annað lesefni fyrir fyrirtæki og viðburði.',
  },
  {
    name: 'Félagsblöð',
    desc: 'Blöð fyrir félögin á svæðinu, frá handriti að fullbúnu eintaki.',
  },
  {
    name: 'Plaköt og prentgripir',
    desc: 'Plaköt og aðrir prentgripir sem þurfa að komast á vegg eða í hendur fólks.',
  },
]

export const PORTFOLIO_HEADING = 'Úr prentsalnum'
export const PORTFOLIO_INTRO =
  'Meðal verkefna í gegnum árin eru nafnspjöld og jólakort, félagsblöð á borð við Litla Bergþór og flugeldablað björgunarsveitarinnar. Hér eru verkgerðirnar í réttum stærðarhlutföllum.'

/** Typographic specimens at true relative paper sizes — no fake photos. */
export const SPECIMENS = {
  felagsblad: {
    caption: 'Félagsblað',
    format: 'A4 · 210 × 297 mm',
    desc: 'Staðarblöð og félagsblöð fyrir félög á Suðurlandi.',
  },
  flugeldablad: {
    caption: 'Flugeldablaðið',
    format: 'A5 · 210 × 148 mm',
    desc: 'Árlegt flugeldablað björgunarsveitarinnar.',
  },
  jolakort: {
    caption: 'Jólakort',
    format: 'A6 · 105 × 148 mm',
    desc: 'Kort fyrirtækja og félaga fyrir hátíðirnar.',
  },
  nafnspjald: {
    caption: 'Nafnspjald',
    format: '85 × 55 mm',
    desc: 'Okkar eigið spjald, sett í húslitunum tveimur.',
  },
}

export const WHY_HEADING_A = 'Þú talar beint'
export const WHY_HEADING_B = 'við prentarann'
export const WHY_INTRO =
  'Prentverk Selfoss er lítil prentsmiðja í heimabyggð. Það þýðir stuttar boðleiðir og verk sem er fylgt eftir frá fyrsta símtali að afhendingu.'

export const WHY_POINTS: { title: string; body: string }[] = [
  {
    title: 'Stutt boðleið',
    body: 'Ekkert þjónustuver og engin bið í símkerfi. Sá sem svarar í 898 3877 er sá sem prentar verkið.',
  },
  {
    title: 'Persónuleg þjónusta',
    body: 'Verkin eru unnin í samtali við þig. Ef eitthvað má fara betur er það lagað áður en prentað er.',
  },
  {
    title: 'Heimavöllur',
    body: 'Verkstæðið stendur á Selfossi og hefur unnið fyrir fyrirtæki og félög á Suðurlandi frá 2009.',
  },
]

export const PROCESS_HEADING = 'Frá skjali að prentgrip'
export const PROCESS_INTRO =
  'Ferlið er einfalt og þú sérð alltaf próförk áður en nokkuð fer í prentun.'

export const PROCESS: { step: string; title: string; body: string }[] = [
  {
    step: 'Fyrirspurn',
    title: 'Þú lýsir verkinu',
    body: 'Sendu línu á pvs@pvs.is eða hringdu í 898 3877 og segðu frá verkinu og upplaginu.',
  },
  {
    step: 'Próförk',
    title: 'Þú samþykkir próförk',
    body: 'Þú færð próförk til yfirlestrar. Ekkert er prentað fyrr en hún hefur verið samþykkt.',
  },
  {
    step: 'Prentun',
    title: 'Verkið fer í vélarnar',
    body: 'Verkið er prentað í réttum litum og gengið snyrtilega frá því.',
  },
  {
    step: 'Afhending',
    title: 'Tilbúið á Selfossi',
    body: 'Þú sækir fullbúið verk á Gagnheiði 43 eða við semjum um afhendingu sem hentar.',
  },
]

export const ABOUT_HEADING = 'Prentsmiðja síðan 2009'
export const ABOUT_BODY = [
  'Prentverk Selfoss var stofnað haustið 2009 og hefur síðan prentað fyrir fyrirtæki, félög og einstaklinga á Suðurlandi. Fyrir rekstrinum fer Gunnar Óðinn Gunnarsson.',
  'Verkstæðið er lítið og það er styrkurinn. Sama manneskjan tekur við fyrirspurninni, gerir próförkina og fylgir verkinu alla leið út úr húsi.',
]
export const ABOUT_FACTS = [
  'STOFNAÐ 01.09.2009',
  'KT. 470909-0990',
  'GAGNHEIÐI 43, 800 SELFOSS',
]

export const AREA_LINE_A = 'Selfoss og',
  AREA_LINE_B = 'Suðurland allt'
export const AREA_BODY =
  'Verkstæðið stendur við Gagnheiði á Selfossi og þjónar fyrirtækjum og félögum um allt Suðurland.'

export const FAQ_HEADING = 'Spurt og svarað'
export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Hvernig skila ég skjölum í prentun?',
    a: 'PDF-skjal er besta formið en við tökum við flestum algengum skjölum og aðstoðum við frágang ef á þarf að halda.',
  },
  {
    q: 'Fæ ég próförk áður en prentað er?',
    a: 'Já, alltaf. Þú færð próförk til samþykktar og ekkert fer í prentun fyrr en þú hefur gefið grænt ljós.',
  },
  {
    q: 'Hvað tekur verkið langan tíma?',
    a: 'Það fer eftir stærð og umfangi verksins. Hringdu í 898 3877 og við finnum saman tímaramma sem heldur.',
  },
  {
    q: 'Hvað kostar prentunin?',
    a: 'Hvert verk er verðlagt eftir stærð, upplagi og pappír. Sendu fyrirspurn á pvs@pvs.is og þú færð verð án skuldbindingar.',
  },
]

export const CONTACT_HEADING_A = 'Hafðu',
  CONTACT_HEADING_B = 'samband'
export const CONTACT_SUB =
  'Segðu frá verkinu og þú færð svar frá manneskju, ekki sjálfvirku kerfi.'
export const CONTACT_PHOTO_CAPTION = 'Verkstæðið við Gagnheiði 43 á Selfossi'

export const CLOSING_LINE = 'Prentum það'
export const CLOSING_SUB = 'Opið mánudaga til föstudaga 08:00 til 17:00.'

export const FOOTER_CREDIT = 'Frumgerð — SNDR Studio'

/** LocalBusiness JSON-LD (SEO baseline for the prototype). */
export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Prentverk Selfoss',
  legalName: 'Prentverk Selfoss ehf',
  description: META.description,
  telephone: '+354-898-3877',
  email: EMAIL,
  foundingDate: '2009-09-01',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Gagnheiði 43',
    postalCode: '800',
    addressLocality: 'Selfoss',
    addressCountry: 'IS',
  },
  areaServed: 'Suðurland, Iceland',
  openingHours: 'Mo-Fr 08:00-17:00',
}
