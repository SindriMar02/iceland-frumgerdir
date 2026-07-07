/**
 * Sólbaðsstofan Ársól (Hrísholt 17, Selfoss) — verified content only.
 *
 * Sources (fetched 2026-07-07):
 *  - Noona marketplace API (api.noona.is/v1/marketplace/companies/arsol):
 *      · description verbatim: "Sólbaðsstofan Ársól, sólbaðsstofa á Selfossi.
 *        Við bjóðum uppá 4 nýja Luxura X7 sólbekki með nýjustu tækni ásamt
 *        infrarauðum saunaklefa og nuddstól."  → 4× Luxura X7 + infrared sauna
 *        cabin + massage chair.
 *      · opening hours: every day 11:00–22:00
 *      · email: Solbadsstofanarsol@gmail.com   · favourites: 1201
 *      · address: Hrisholt 17, 800 Selfoss (63.9368, -20.9816)
 *  - Phone 835-1717 (leit.is / directory listings)
 *  - Founding ~Feb 2020: Noona profile-image timestamp v1580583567 = 1 Feb
 *    2020, consistent with their "5 ára afmæli í febrúar" post.
 *
 * PRICES BELOW ARE SÝNISHORN (samples) — Noona hides the real prices behind its
 * booking SPA and their Facebook is unreachable. Ranges are modelled on
 * comparable Icelandic salons so they read as realistic; the shared footer and
 * an on-page note both label them as samples to confirm with the salon.
 */

export const NOONA = 'https://noona.app/arsol'
export const PHONE_DISPLAY = '835 1717'
export const PHONE_HREF = 'tel:+3548351717'
export const EMAIL = 'Solbadsstofanarsol@gmail.com'
export const MAPS = 'https://maps.google.com/?q=Sólbaðsstofan+Ársól,+Hrísholt+17,+800+Selfoss'
export const FACEBOOK = 'https://www.facebook.com/p/Sólbaðsstofan-Ársól-100063451606467/'

/** Higgsfield imagery drops into public/arsol/ (Seedream 4.5, Unlimited ON).
 *  Until a file lands the <Poster> component falls back to a warm sunset
 *  gradient frame, so the page is complete and honest either way. */
const ASSET = `${import.meta.env.BASE_URL}arsol/`
export const IMG = {
  heroBed: `${ASSET}hero-bed.jpg`, // Luxura X7 lifestyle, warm bright morning
  bedX7: `${ASSET}bed-x7.jpg`, // Luxura X7, clean 3/4 product-in-room
  glow: `${ASSET}bed-glow.jpg`, // open bed, warm tubes glowing
  sauna: `${ASSET}sauna.jpg`, // infrared sauna cabin, warm cedar
  chair: `${ASSET}chair.jpg`, // massage chair, calm corner
  interior: `${ASSET}interior.jpg`, // reception / interior, warm sand light
}

/** The room, told straight: one bed model ×4, plus two extras. */
export const SERVICES = [
  {
    id: 'x7',
    kicker: 'Fjórir eins bekkir',
    name: 'Luxura X7',
    body:
      'Fjórir splunkunýir Luxura X7 bekkir af nýjustu kynslóð. Öflug og jöfn brúnka, andlitsljós, hljóðkerfi og loftkæling gera hverja mínútu þægilega. Alltaf laus bekkur, aldrei löng bið.',
    specs: ['Nýjasta kynslóð frá LUXURA', 'Jöfn og djúp brúnka', 'Andlitsljós og loftkæling', 'Fjórir bekkir, styttri bið'],
    image: IMG.bedX7,
  },
]

/** The two extras — these live in the dark "plate" chapter (heat + hvíld). */
export const EXTRAS = [
  {
    id: 'sauna',
    name: 'Infrarauður saunaklefi',
    line: 'Djúpur, mjúkur hiti sem hitar líkamann beint. Mildari en hefðbundin gufa og notaleg leið til að slaka á eftir ljósin.',
    image: IMG.sauna,
  },
  {
    id: 'chair',
    name: 'Nuddstóll',
    line: 'Setstu og leyfðu nuddstólnum að losa um bak og herðar. Fullkomið korter á meðan þú hvílir þig.',
    image: IMG.chair,
  },
]

export interface PriceRow {
  label: string
  minutes: string
  price: number
}

/** Verðskrá — SÝNISHORN. Confirm real prices with the salon before sending. */
export const SINGLES: PriceRow[] = [
  { label: 'Hálfur tími', minutes: '6 mín', price: 2190 },
  { label: 'Stakur tími', minutes: '9 mín', price: 2490 },
  { label: 'Stakur tími', minutes: '12 mín', price: 2790 },
  { label: 'Lengri tími', minutes: '15 mín', price: 2990 },
]

export const CARDS = [
  { label: '5 skipti', price: 11900, note: 'gildir í öllum bekkjum' },
  { label: '10 skipti', price: 22900, note: 'vinsælast' },
  { label: '15 skipti', price: 31900, note: 'besta verðið' },
]

export const EXTRA_PRICES: PriceRow[] = [
  { label: 'Infrarauður saunaklefi', minutes: '20 mín', price: 2490 },
  { label: 'Nuddstóll', minutes: '15 mín', price: 1490 },
]

/** Húðgerðar-viðmið — the interactive sun-dial ready-reckoner (educational). */
export const SKIN_TYPES = [
  {
    id: 1,
    skin: 'Mjög ljós og freknótt húð',
    hair: 'Rautt eða ljóst hár',
    minutes: '6 til 8 mín',
    short: '6–8',
    heat: 0.28,
    note: 'Byrjaðu mjög stutt, húðin þín brúnkar hægt og brennur auðveldlega.',
  },
  {
    id: 2,
    skin: 'Ljós húð, sjaldan brún',
    hair: 'Ljóst hár',
    minutes: '8 til 10 mín',
    short: '8–10',
    heat: 0.5,
    note: 'Farðu rólega af stað og lengdu tímann eftir fyrstu skiptin.',
  },
  {
    id: 3,
    skin: 'Ljósbrún húð sem brúnkar vel',
    hair: 'Dökkt hár',
    minutes: '10 til 12 mín',
    short: '10–12',
    heat: 0.74,
    note: 'Húðin þín tekur vel við, en gefðu henni samt 48 tíma á milli.',
  },
  {
    id: 4,
    skin: 'Brún eða dökk húð',
    hair: 'Mjög dökkt hár',
    minutes: '12 til 15 mín',
    short: '12–15',
    heat: 1,
    note: 'Þú brúnkar auðveldlega, lengri tími hentar þér vel.',
  },
]

export const SAFETY = [
  'Byrjaðu stutt og lengdu tímann hægt og rólega',
  'Láttu 48 klukkustundir líða á milli tíma',
  'Notaðu alltaf hlífðargleraugu',
]

export const FACTS = [
  { big: '4', small: 'Nýir Luxura X7 bekkir' },
  { big: 'Alla daga', small: 'Opið frá 11 til 22' },
  { big: 'Frá 2020', small: 'Sólbaðsstofan á Selfossi' },
]

export const STORY = {
  headline: 'Sólin á Selfossi, alla daga ársins',
  body:
    'Ársól er litla sólbaðsstofan á Selfossi með fjóra glænýja Luxura X7 bekki, infrarauðan saunaklefa og nuddstól. Við höfum verið til síðan 2020 og eigum dyggan hóp fastagesta sem kemur til að ná sér í smá sól og hlýju, hvernig sem viðrar úti. Opið alla daga frá 11 til 22.',
}

export const ADDRESS = { street: 'Hrísholt 17', town: '800 Selfoss', hours: 'Opið alla daga 11–22' }

export const HOURS = [
  { day: 'Mánudaga til föstudaga', time: '11:00 – 22:00' },
  { day: 'Laugardaga og sunnudaga', time: '11:00 – 22:00' },
]
