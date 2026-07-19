/* ──────────────────────────────────────────────────────────────────────────
 * Setberg Guesthouse — "Bærinn undir fjallinu"
 * The farm's first-ever self-introduction: every fact below comes from the
 * verified brief/dossier (ja.is, ferdalag.is, Booking.com mirrors, fetched
 * 2026-07-18). No founding year, no "for generations", no fixed room count,
 * no guaranteed price — all deliberately hedged per the honesty guardrails.
 * Photography is representative Icelandic farm/highland imagery (Unsplash,
 * free tier), never presented as the property itself; the closing section
 * carries the explicit disclaimer.
 * ────────────────────────────────────────────────────────────────────────── */

export const PHONE = '859 8109'
export const PHONE_HREF = 'tel:+3548598109'
export const EMAIL = 'setberg1@gmail.com'
export const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('Fyrirspurn um gistingu á Setbergi')}`
export const ADDRESS = 'Setbergi, 781 Höfn í Hornafirði'
export const MAPS_HREF = 'https://www.google.com/maps/search/?api=1&query=Setberg+Guesthouse+H%C3%B6fn'

export const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const srcSet = (id: string) =>
  `${u(id, 828)} 828w, ${u(id, 1280)} 1280w, ${u(id, 2000)} 2000w`

/* Vetted manifest (brief section B) — all images.unsplash.com free tier. */
export const IMG = {
  hero: 'photo-1581094987116-97a1b02c36d4', // green valley, road toward mountains, no landmark
  mountain: 'photo-1733003084617-67176cf38378', // grass + snow-capped mountain, generic highland
  sheepMound: 'photo-1532623314721-cedde8730d26', // two sheep on rocky mound
  sheepPen: 'photo-1506959724576-d5385aabd507', // single sheep in fenced pen, moody sky
  goldenField: 'photo-1506007755315-fb55c03b02ca', // golden-hour field, two sheep
  collie: 'photo-1611468983256-8374e2460484', // border collie running on grass
  room1: 'photo-1773423389979-b28b469967f8', // wood-paneled bedroom, wood stove
  room2: 'photo-1773423391716-04e278b07b1b', // wood-paneled bedroom, single bed, morning light
  kitchen: 'photo-1754415266974-404a215e6c62', // rustic country kitchen
  sheepRoad: 'photo-1581390742031-c8eb2cdfa7d6', // sheep crossing gravel road, East Iceland
  aurora: 'photo-1488703480497-dfcccd4894d1', // northern lights over a valley, no structures
} as const

export type ImgKey = keyof typeof IMG

/* ── Hero ── */
export const HERO = {
  wordmark: 'SETBERG',
  sub: 'GUESTHOUSE · NESJUM · 781 HÖFN Í HORNAFIRÐI',
  conceptLine: 'Bærinn kynnir sig sjálfur, í fyrsta sinn.',
  tagline: 'Bóndabær undir fjöllunum við Höfn. Opið allt árið.',
  photoAlt:
    'Grænn dalur og vegur sem liggur að fjallgarði á Íslandi (svipmynd af landslagi, ekki mynd af Setbergi sjálfu)',
}

/* ── 2. Fyrsta kynning — the farm's own voice ── */
export const INTRO = {
  heading: 'Loksins í okkar eigin orðum',
  body: [
    'Ef þú leitar að Setbergi á netinu finnurðu bókunarsíður og ferðavefi. Þær segja allar frá okkur, en engin þeirra er okkar. Þessi síða er sú fyrsta sem bærinn á sjálfur.',
    'Hér segjum við sjálf frá herbergjunum, fjöllunum og hundinum. Stefán tekur á móti gestum og síminn er alltaf sá sami. Velkomin heim að Setbergi.',
  ],
}

/* ── 3. Farm heritage ── */
export const HERITAGE = {
  heading: 'Fjárbú undir fjallinu í Nesjum',
  body: 'Setberg er hefðbundinn íslenskur sveitabær í Nesjum, rétt utan við Höfn í Hornafirði. Hér var áður rekið fjárbú og bærinn stendur enn undir fjallshlíðinni, um fjórtán mínútna akstur frá sjávarþorpinu. Þeir sem vilja sjá fjöllin nær ganga einfaldlega af stað frá bænum.',
  imageA: {
    img: 'sheepMound' as ImgKey,
    alt: 'Tvær kindur á klettahól með græn fjöll í bakgrunni (dæmigert sauðfé í íslenskri sveit)',
    caption: 'Dæmigert sauðfé í nágrenninu',
  },
  imageB: {
    img: 'sheepPen' as ImgKey,
    alt: 'Kind í grasgirðingu undir dimmum himni (svipmynd úr íslenskri sveit)',
    caption: 'Sveitin eins og hún er',
  },
}

/* ── 4. Rooms & rates — hedged per conflicting sources ── */
export const ROOMS_LEDE =
  'Nokkur einföld og hlý herbergi með viðargólfi, flest með aðgangi að sameiginlegu eldhúsi og baði, auk stærri íbúðar með fjallasýn.'

export interface Room {
  id: string
  name: string
  size: string
  desc: string
  img: ImgKey
  imgAlt: string
  imgCaption: string
}

export const ROOMS: Room[] = [
  {
    id: 'tvibyli',
    name: 'Lítið tvíbýli',
    size: 'u.þ.b. 9 m²',
    desc: 'Tvö rúm, viðargólf og góður hiti. Sameiginlegt bað og eldhús.',
    img: 'room2',
    imgAlt: 'Viðarklætt svefnherbergi með rúmi í morgunbirtu (svipmynd í þessum anda, ekki herbergi á Setbergi)',
    imgCaption: 'Einfalt og hlýtt, í þessum anda',
  },
  {
    id: 'tveggja',
    name: 'Tveggja manna herbergi',
    size: 'u.þ.b. 12 m²',
    desc: 'Herbergi fyrir tvo með sameiginlegu baði.',
    img: 'room1',
    imgAlt: 'Hlýlegt viðarklætt herbergi með litlum kamínuofni (svipmynd í þessum anda, ekki herbergi á Setbergi)',
    imgCaption: 'Viðargólf og hlýja, í þessum anda',
  },
  {
    id: 'ibud',
    name: 'Íbúð með fjallasýn',
    size: 'u.þ.b. 100 m²',
    desc: 'Rúmgóð eining með fjallasýn fyrir fjölskyldur eða hópa sem vilja meira pláss.',
    img: 'kitchen',
    imgAlt: 'Sveitalegt eldhús með viðarskáp og borði (svipmynd af íslensku sveitaeldhúsi, ekki frá Setbergi)',
    imgCaption: 'Íslenskt sveitaeldhús, í þessum anda',
  },
]

export const PRICE = {
  from: 'Frá u.þ.b. 20.000 kr. á nótt',
  note: 'Leiðbeinandi verð af bókunarsíðum. Breytist eftir árstíð, herbergi og vikudegi.',
  kitchen: 'Gestir hafa aðgang að sameiginlegu eldhúsi. „Great kitchen facilities“ skrifaði einn gestanna.',
}

/* ── 5. Skolie ── */
export const SKOLIE = {
  heading: 'Skolie tekur á móti þér',
  body: 'Á bænum býr Border Collie-hundurinn Skolie. Gestir nefna hann aftur og aftur í umsögnum sínum og börnin muna oft best eftir honum þegar heim er komið.',
  imgAlt: 'Border Collie hundur á hlaupum á grænu túni (svipmynd af tegundinni, ekki mynd af Skolie sjálfum)',
  imgCaption: 'Border Collie eins og Skolie. Ljósmyndin er til viðmiðunar.',
}

/* ── Guest quotes — real, dated, attributed (Booking.com data via mirror).
 * Kept in English as originally posted; the reviews section says so. ── */
export interface Quote {
  name: string
  score: string
  date: string
  text: string
}

export const DOG_QUOTES: Quote[] = [
  {
    name: 'Eve ML',
    score: '10/10',
    date: '23.11.2024',
    text: 'Lovely owner and dog we enjoyed our stay here so much. Great kitchen facilities',
  },
  {
    name: 'Roxana',
    score: '10/10',
    date: '20.08.2024',
    text: 'My kids had a great time with the dog',
  },
]

export const REVIEW_QUOTES: Quote[] = [
  {
    name: 'Fani',
    score: '10/10',
    date: '09.08.2025',
    text: 'Very nice apartement, Quiet area and nice location',
  },
  {
    name: 'James',
    score: '9/10',
    date: '18.08.2024',
    text: 'Beautiful views with a nice hot tub',
  },
]

export const REVIEWS = {
  heading: 'Það sem gestir segja',
  scoreRange: '9,4',
  scoreOutOf: '/10',
  countLine: '279 staðfestar umsagnir á Booking.com',
  breakdown: 'Þrifnaður 9,8 · Þægindi 9,8 · Starfsfólk 9,8',
  languageNote: 'Umsagnirnar birtast á ensku, eins og gestirnir skrifuðu þær.',
}

/* ── 6. At the foot of the mountain ── */
export const MOUNTAIN = {
  heading: 'Undir fjallinu',
  body: 'Útsýnið til fjallanna nær inn um herbergisgluggana. Þeir sem vilja komast nær ganga af stað beint frá bænum.',
  imgAlt: 'Grasi vaxið land og snævi þakið fjall á Íslandi (svipmynd af landslagi af sama tagi og við Setberg)',
}

/* ── 7. The journey ── */
export const JOURNEY = {
  heading: 'Leiðin heim að bæ',
  body: 'Setberg stendur í Nesjum, um fjórtán mínútna akstur frá miðbæ Hafnar, um 15 km. Í sveitinni deila kindur stundum veginum með þér.',
  imgAlt: 'Þrjár kindur ganga yfir malarveg á Austurlandi (svipmynd af svæðinu, ekki heimreiðin að Setbergi)',
  imgCaption: 'Kindur á ferð yfir malarveg á Austurlandi',
}

/* ── Golden field divider band ── */
export const BAND = {
  line: 'Kvöldsól yfir haganum',
  imgAlt: 'Gyllt kvöldsól yfir túni með tveimur kindum (svipmynd úr íslenskri sveit)',
}

/* ── 9. Nearby ── */
export const NEARBY = {
  heading: 'Í nágrenninu',
  items: [
    { name: 'Vatnajökulsþjóðgarður', info: 'Í næsta nágrenni' },
    { name: 'Jökulsárlón', info: 'Um 65 km' },
    { name: 'Skaftafell', info: 'Um 120 km' },
    { name: 'Heitu pottarnir við Hoffell', info: 'Um 15 mín frá Höfn · opnir allt árið' },
  ],
  auroraAlt: 'Norðurljós yfir kyrrlátum dal (svipmynd frá Þórsmörk, ekki frá Setbergi)',
  auroraLine: 'Kyrrlát sveit að kvöldi',
}

/* ── 10. Practical ── */
export const PRACTICAL = {
  heading: 'Hafðu samband',
  openLine: 'Opið allt árið',
  host: 'Lítið gistiheimili á sveitabæ',
}

/* ── 11. Closing ── */
export const CLOSING = {
  line: 'Núna veistu hver við erum.',
  sub: 'Hlökkum til að taka á móti þér.',
  photoDisclaimer:
    'Ljósmyndirnar á síðunni sýna íslenska sveit, sauðfé, herbergi og landslag af sama tagi og á Setbergi, ekki bæinn sjálfan. Aðgengilegt myndasafn af Setbergi var ekki til staðar þegar frumgerðin var unnin. Verð eru leiðbeinandi og umsagnir eru fengnar frá Booking.com.',
}

export const NAV = [
  { id: 'herbergi', label: 'Herbergi' },
  { id: 'umsagnir', label: 'Umsagnir' },
  { id: 'samband', label: 'Hafa samband' },
] as const
