/* Húðflúrstofa Norðurlands · "Blek á húð" (2026-09-29 rebuild)

   Facts, each checked on the studio's own Facebook page on 2026-09-29
   (facebook.com/hudflurstofanordurlands, About + Intro + photo posts):
   - Tattoo and piercing shop, Gránufélagsgata 4, 600 Akureyri
   - Mobile 866 5757, hudflur@hudflur.net
   - 86% recommend (255 reviews), 5.2K followers
   - Intro, verbatim: "Stofan hefur verið opin síðan 10. maí 2011 og mun vera það áfram um ókomna tíð ;)"
   - English name used in their own posts: "Northern Tattoo Studio"
   - Every work photo is watermarked JO.HELGASON TATTOO; hashtags name the styles
     (black and grey, realism, lettering, flowers, traditional/old school, anime)
   - Guest artists: Bruno (@no_tilusse_tattoo, watercolour, France) in March 2024 and 2025,
     Jón Þór Ísberg in June 2024
   - Gift cards: their own post of 21 Nov 2024 (quoted verbatim below)
   Hours Mon-Sat 13-18 come from a business-directory mirror of the FB listing (glartent.com),
   found on the first build; Facebook itself only shows "Open now" to a logged-out visitor.

   Photos: 27 of the studio's own posts (1440px originals), harvest + manifest in
   _docs/hudflur-harvest-2026-09-29/. A title in quotes is their own caption; the others are
   our plain descriptions and are marked `own: false`. */

const BASE = import.meta.env.BASE_URL
export const work = (f: string, w: 480 | 960 | 1440) => `${BASE}hudflur/work/${f}-${w}.webp`
export const workSet = (f: string) => `${work(f, 480)} 480w, ${work(f, 960)} 960w, ${work(f, 1440)} 1440w`
export const LOGO = `${BASE}hudflur/brand/logo.png`

export const META = {
  title: 'Húðflúrstofa Norðurlands | Húðflúr og götun á Akureyri síðan 2011',
  description:
    'Húðflúrstofa Norðurlands, Gránufélagsgata 4 á Akureyri. Húðflúr og götun síðan 10. maí 2011: svart og grátt raunsæi, letur, dýr, blóm og old school. Sími 866 5757.',
}

export const EMAIL = 'hudflur@hudflur.net'
export const PHONE = { display: '866 5757', href: 'tel:+3548665757' }
export const FACEBOOK = 'https://www.facebook.com/hudflurstofanordurlands/'
export const MAP = `https://maps.google.com/?q=${encodeURIComponent('Gránufélagsgata 4, 600 Akureyri')}`
export const BOOK_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent('Fyrirspurn um tíma')}`

export const NAV = [
  { label: 'Verk', href: '#verk' },
  { label: 'Stofan', href: '#stofan' },
  { label: 'Ferlið', href: '#ferlid' },
  { label: 'Hafa samband', href: '#samband' },
] as const

export const HERO = {
  line: 'Húðflúr og götun á Akureyri síðan 10.\u00a0maí\u00a02011.',
  cta: 'Bóka tíma',
  ctaAlt: 'Skoða verkin',
  address: 'Gránufélagsgata 4, Akureyri',
}

/* the blackletter wall: two of their own phrases, repeated like a lettering sleeve */
export const WALL = {
  rows: ['Um ókomna tíð', 'Síðan 2011', 'Um ókomna tíð', 'Síðan 2011'],
  photo: 'w54-medusa',
  alt: 'Medúsa í svörtu og gráu á framhandlegg, verk frá stofunni',
  caption: 'Blek á húð, Akureyri.',
}

export type Tag = 'dyr' | 'figurur' | 'letur' | 'blom'
export const TAGS: { key: 'allt' | Tag; label: string; note: string }[] = [
  { key: 'allt', label: 'Allt', note: 'Nýleg verk af stofunni, beint af Facebook-síðunni.' },
  { key: 'dyr', label: 'Dýr', note: 'Tígrisdýr, kettir, hundar og górilla í svörtu og gráu.' },
  { key: 'figurur', label: 'Fígúrur', note: 'Andlit, hauskúpur, anime og tölvuleikir.' },
  { key: 'letur', label: 'Letur', note: 'Nöfn, bænir og tákn, unnin í höndunum.' },
  { key: 'blom', label: 'Blóm og litir', note: 'Bóndarósir, koi og old school í lit.' },
]

export type Work = { f: string; w: number; h: number; tag: Tag; title: string; own: boolean; date: string; alt: string }
export const WORKS: Work[] = [
  { f: 'w02-tigur', w: 1440, h: 1440, tag: 'dyr', title: 'Toight, Toight like a Toiger!', own: true, date: 'Ágúst 2026', alt: 'Tígrisdýr á göngu niður upphandlegg' },
  { f: 'w22-jesus', w: 1440, h: 1800, tag: 'figurur', title: 'Jesús Kristur! (bókstaflega)', own: true, date: 'Febrúar 2025', alt: 'Raunsæ andlitsmynd af Kristi með þyrnikórónu' },
  { f: 'w04-sjomannabaen', w: 1440, h: 1440, tag: 'letur', title: 'Sjómannabæn', own: true, date: 'Júní 2026', alt: 'Sjómannabæn í skrautletri á síðu' },
  { f: 'w00-blom', w: 1440, h: 1440, tag: 'blom', title: 'Ljónynja og bóndarósir', own: false, date: 'September 2026', alt: 'Ljónynja umvafin bóndarósum á læri' },
  { f: 'w08-colossus', w: 1440, h: 1440, tag: 'figurur', title: 'Shadow of the colossus', own: true, date: 'Mars 2026', alt: 'Risinn úr Shadow of the Colossus og riddari á upphandlegg' },
  { f: 'w39-tigur2', w: 1440, h: 1440, tag: 'dyr', title: 'Tígrisdýr', own: false, date: 'Maí 2024', alt: 'Raunsætt tígrisdýrsandlit á upphandlegg' },
  { f: 'w16-hals', w: 1440, h: 1440, tag: 'letur', title: 'Faith', own: false, date: 'Maí 2025', alt: 'Orðið Faith í gotnesku letri aftan á hálsi' },
  { f: 'w34-rosir', w: 1440, h: 1800, tag: 'blom', title: 'Rósir á framhandlegg', own: false, date: 'Ágúst 2024', alt: 'Rósir og lauf í svörtu og gráu niður framhandlegg' },
  { f: 'w49-meow2', w: 1440, h: 1440, tag: 'dyr', title: 'Meow!', own: true, date: 'Mars 2024', alt: 'Hvæsandi köttur og loppufar á upphandlegg' },
  { f: 'w01-anime', w: 1440, h: 1440, tag: 'figurur', title: 'Anime-rammi', own: false, date: 'September 2026', alt: 'Anime-teikning í ramma á framhandlegg' },
  { f: 'w05-fodurnafn', w: 1440, h: 1440, tag: 'letur', title: 'Föðurnafn', own: true, date: 'Júní 2026', alt: 'Föðurnafn í skrautletri með rós á framhandlegg' },
  { f: 'w50-gorilla', w: 1440, h: 1440, tag: 'dyr', title: 'Jungle sleeve in progress', own: true, date: 'Febrúar 2024', alt: 'Öskrandi górilla, hluti af frumskógarermi' },
  { f: 'w12-hauskupa', w: 1440, h: 1800, tag: 'figurur', title: 'Hauskúpuermi', own: false, date: 'Júlí 2025', alt: 'Ermi með hauskúpu og skrauti í svörtu og gráu' },
  { f: 'w15-dreki', w: 1440, h: 1800, tag: 'blom', title: 'Koi', own: false, date: 'Maí 2025', alt: 'Tveir koi-fiskar og stjörnumerki á framhandlegg' },
  { f: 'w24-tyson', w: 1440, h: 1440, tag: 'dyr', title: 'Tyson', own: true, date: 'Desember 2024', alt: 'Raunsæ mynd af hundi á upphandlegg' },
  { f: 'w31-sol', w: 1440, h: 1440, tag: 'letur', title: 'Sól og auga', own: false, date: 'September 2024', alt: 'Sól með auga í miðjunni á bringu' },
  { f: 'w13-bak', w: 1440, h: 1440, tag: 'figurur', title: 'Klukka og hauskúpa', own: false, date: 'Júní 2025', alt: 'Klukka, hauskúpa og tunglfasar niður bakið' },
  { f: 'w51-svala', w: 1440, h: 1442, tag: 'blom', title: 'Old school job stopper', own: true, date: 'Febrúar 2024', alt: 'Svala og blóm í lit á handarbaki, old school' },
  { f: 'w07-pride', w: 1080, h: 1440, tag: 'dyr', title: 'Pride', own: true, date: 'Júní 2026', alt: 'Ljón og hvolpar með blómagrein á upphandlegg' },
  { f: 'w29-hauskupa2', w: 1440, h: 1442, tag: 'figurur', title: 'Hauskúpa', own: false, date: 'Október 2024', alt: 'Hauskúpa með glóandi augu á kálfa' },
  { f: 'w43-kross', w: 1440, h: 1440, tag: 'letur', title: 'Kross og rósir', own: false, date: 'Apríl 2024', alt: 'Skreyttur kross með rósum á upphandlegg' },
  { f: 'w09-hrutur', w: 1440, h: 1440, tag: 'dyr', title: 'Hrútshauskúpa', own: false, date: 'Nóvember 2025', alt: 'Hrútshauskúpa með hornum á upphandlegg' },
  { f: 'w36-blom2', w: 1440, h: 1440, tag: 'blom', title: 'Blómagrein', own: false, date: 'Júní 2024', alt: 'Fíngerð blómagrein á síðu' },
  { f: 'w14-meow', w: 1440, h: 1800, tag: 'dyr', title: 'Meow.', own: true, date: 'Júní 2025', alt: 'Köttur með nornahatt á bókastafla' },
  { f: 'w27-oldschool', w: 1440, h: 1440, tag: 'blom', title: 'Old School Stuff', own: true, date: 'Nóvember 2024', alt: 'Konuandlit í old school stíl, í lit á framhandlegg' },
  { f: 'w48-bangsi', w: 1440, h: 1440, tag: 'dyr', title: 'Bangsi', own: true, date: 'Mars 2024', alt: 'Hundur með borða sem á stendur Bangsi' },
]

export const STUDIO = {
  heading: ['Opin síðan', '10. maí 2011'],
  quote: 'Stofan hefur verið opin síðan 10. maí 2011 og mun vera það áfram um ókomna tíð ;)',
  quoteBy: 'Húðflúrstofa Norðurlands, á Facebook',
  body: 'Svart og grátt raunsæi er rauði þráðurinn, en líka letur, blóm, dýr, anime og old school í lit. Á stofunni er líka boðið upp á götun.',
  guests: 'Gestalistamenn koma reglulega í heimsókn, síðast Bruno frá Frakklandi, sem sérhæfir sig í vatnslitaflúri.',
  stats: [
    { value: '15', label: 'ár á Gránufélagsgötu' },
    { value: '86%', label: 'mæla með stofunni, 255 umsagnir' },
    { value: '5.200', label: 'fylgjendur á Facebook' },
  ],
  photos: ['w08-colossus', 'w48-bangsi'] as const,
}

export const PROCESS = {
  heading: 'Ferlið',
  steps: [
    { title: 'Hugmynd', body: 'Sendu hugmynd, tilvísun eða bara stærð og staðsetningu, í tölvupósti, á Facebook eða í síma.' },
    { title: 'Hönnun', body: 'Hönnunin er unnin í samráði við þig áður en tími er bókaður, þar til hún er tilbúin fyrir húðina.' },
    { title: 'Tíminn', body: 'Unnið er í rólegu og hreinlegu umhverfi. Hvert verk fær þann tíma sem það þarf.' },
    { title: 'Gróandi', body: 'Þú ferð heim með skýrar leiðbeiningar um umhirðu svo verkið grói vel.' },
  ],
  careTitle: 'Umhirða eftir tímann',
  care: [
    'Hafðu umbúðirnar á eins lengi og mælt er með.',
    'Þvoðu svæðið varlega með ilmlausri sápu og volgu vatni.',
    'Berðu þunnt lag af ilmlausu kremi á nokkrum sinnum á dag.',
    'Forðastu sund, heita potta og sól þar til verkið er gróið.',
    'Ekki klóra í hrúðrið, leyfðu því að losna af sjálfu sér.',
  ],
}

export const GIFT = {
  heading: 'Gjafabréf',
  quote: 'Ef þú vilt vera uppáhald allra í fjölskyldunni og/eða vinahópnum, þá gefurðu gjafabréf í húðflúr í jólagjöf #truestory',
  quoteBy: 'Af Facebook-síðu stofunnar',
  cta: 'Spyrja um gjafabréf',
  href: `mailto:${EMAIL}?subject=${encodeURIComponent('Gjafabréf')}`,
  photo: 'w25-gjafabref',
  alt: 'Hrafn, hauskúpa og gjafabréf stofunnar á borði',
}

export const CONTACT = {
  heading: 'Bóka tíma',
  lead: 'Engin bókunarvél. Sendu línu með hugmyndinni og fáðu svar beint frá stofunni.',
  address: ['Gránufélagsgata 4', '600 Akureyri'],
  hours: 'Mán.-lau. 13:00-18:00',
  copy: 'Afrita netfang',
  copied: 'Afritað!',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'TattooParlor',
  name: 'Húðflúrstofa Norðurlands',
  alternateName: 'Northern Tattoo Studio',
  foundingDate: '2011-05-10',
  email: EMAIL,
  telephone: '+354 866 5757',
  address: { '@type': 'PostalAddress', streetAddress: 'Gránufélagsgata 4', addressLocality: 'Akureyri', postalCode: '600', addressCountry: 'IS' },
  areaServed: 'Norðurland',
  priceRange: '££',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '13:00', closes: '18:00' },
  ],
  sameAs: [FACEBOOK],
}
