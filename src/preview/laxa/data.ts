/* ── Hótel Laxá ehf. · „Birtan við vatnið" ────────────────────────────────
   Codename: BIRTAN VIÐ VATNIÐ (the light on the lake). One sentence for the
   owner: the page drifts through the light of one Mývatn day, and the food
   is what it lights.

   VERIFIED FACTS (2026-08-01). Hótel Laxá, Mývatn, north Iceland. 80 rooms
   plus the on-site restaurant ELDEY. Opened 2014. Hótel Laxá ehf.,
   kt. 570713-0190. Independent, no chain. hotellaxa@hotellaxa.is, 464-1900.
   Current site: WordPress, 230 KB of HTML, 31 stylesheets, jQuery, no h1
   anywhere, 33 jpg/png and zero webp, only 12 of 35 images lazy-loaded.
   Bilingual (hreflang is/en).

   BOOKING — verified 2026-08-01, corrected after a first pass that assumed
   Reserva ran room availability. It does not: reserva.is/hotellaxa 404s.
   Hótel Laxá's own /boka-nuna page links straight to the GODO engine:
     https://property.godo.is/booking.php?propid=118355&referer=BookingLink&lang=is
   GODO is a Reserva company, but on THIS property Reserva is the GIFT CARD
   layer only, at gjafabref.reserva.is/hotellaxa — a separate hosted page,
   link-out only. Room booking = GODO (propid 118355). Gift cards = Reserva.
   Both verified 2026-08-01. Do not build a fake purchase flow for either.

   REFERENCE TRANSPLANTED: Palazzo Sogni (palazzosogni.com) — one uppercase
   weight-300 face at 1.74 leading, colour-washed chapters, centred stacked
   nav over full-bleed media. See Page.tsx for the token/section build-out.

   ASSETS: their own media library only (verified 2026-08-01). Food/plated
   dishes are professional, 2048x1365, shot March 2026 — the strongest asset
   or property owns, so ELDEY carries the page. Place photography is
   1205x1600 portrait and genuinely small; it is used in constrained frames,
   never blown up full-bleed. No literal guest-room photograph exists in the
   library, so the rooms section is honest: it shows the hotel's real shared
   interiors (lobby, lounge, bar) in a labelled gallery, not staged bedrooms.
   ── */

import type { PreviewCompany } from '../companies'

/* ── Booking engines ───────────────────────────────────────────────────── */
export const BOOKING = {
  /** Live room-availability engine (GODO), property id 118355. */
  godoUrl: 'https://property.godo.is/booking.php?propid=118355&referer=BookingLink&lang=is',
  /** Gift cards only — hosted by Reserva, plain link-out, not embeddable. */
  giftCardUrl: 'https://gjafabref.reserva.is/hotellaxa',
}

/* ── Contact & legal ───────────────────────────────────────────────────── */
export const CONTACT = {
  phoneDisplay: '464 1900',
  phoneHref: 'tel:+3544641900',
  email: 'hotellaxa@hotellaxa.is',
  region: 'Mývatn, Norðurland',
  maps: 'https://maps.google.com/?q=' + encodeURIComponent('Hótel Laxá, Mývatn'),
  kennitala: '570713-0190',
  founded: 2014,
  rooms: 80,
}

/* ── Real photography — ONLY these URLs, their own media library ────────── */

export type FoodImage = { src: string; dish: string; alt: string }

/** Restaurant / plated dishes, 2048x1365, professional, March 2026. */
export const FOOD_IMAGES: FoodImage[] = [
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09807.jpeg', dish: 'Blálanga', alt: 'Blálanga borin fram á Eldey, borðstofan í baksýn' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09796.jpeg', dish: 'Blálanga', alt: 'Blálanga, nærmynd af réttinum á Eldey' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09791.jpeg', dish: 'Ravíólí', alt: 'Heimagert pasta ravíólí á Eldey' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09775.jpeg', dish: 'Blómkálsvængir', alt: 'Steiktir blómkálsvængir á Eldey' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09760.jpeg', dish: 'Carpaccio af lambakjöti', alt: 'Carpaccio af lambakjöti, forréttur á Eldey' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09750.jpeg', dish: 'Reyktur silungur', alt: 'Reyktur silungur, forréttur á Eldey' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09717.jpeg', dish: 'Saltfiskkrókettur', alt: 'Saltfiskkrókettur á Eldey' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09648.jpeg', dish: 'Reyktur silungur', alt: 'Reyktur silungur, framreiddur á Eldey' },
]

/** The dining room itself — wide ambience shot, pairs with the plated dishes. */
export const RESTAURANT_ROOM = {
  src: 'https://hotellaxa.is/wp-content/uploads/2026/03/restaurant-1.jpg',
  label: 'Borðstofan',
  alt: 'Borðstofa veitingastaðarins Eldeyjar á Hótel Laxá',
}

export type PlaceImage = { src: string; label: string; alt: string }

/** Shared interiors, 1205x1600 portrait — genuinely small. Constrained frames only. */
export const PLACE_IMAGES: PlaceImage[] = [
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/lobby-1.jpg', label: 'Anddyrið', alt: 'Anddyri Hótel Laxár' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/lounge.jpg', label: 'Setustofan', alt: 'Setustofa Hótel Laxár' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/lounge2.jpg', label: 'Setustofan', alt: 'Setustofa Hótel Laxár, annað sjónarhorn' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/bar-1.jpg', label: 'Barinn', alt: 'Barinn á Hótel Laxá' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/bar2.jpg', label: 'Barinn', alt: 'Barinn á Hótel Laxá, annað sjónarhorn' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/shop.jpg', label: 'Verslunin', alt: 'Lítil verslun í anddyri Hótel Laxár' },
  { src: 'https://hotellaxa.is/wp-content/uploads/2026/03/downstairs.jpg', label: 'Neðri hæðin', alt: 'Sameiginlegt rými á neðri hæð Hótel Laxár' },
]

/** Exterior, 4080x3072 — the hero. Snowy building at dusk. */
export const HERO_IMAGE = {
  src: 'https://hotellaxa.is/wp-content/uploads/2026/03/front-1.jpg',
  alt: 'Hótel Laxá í snjó við rökkur',
}

/* ── Meta / structured data ───────────────────────────────────────────── */
export const META = {
  title: 'Hótel Laxá | Sjálfstætt hótel við Mývatn',
  description:
    'Hótel Laxá er sjálfstætt starfrækt hótel við Mývatn á Norðurlandi með 80 herbergjum og veitingastaðnum Eldey. Opnað 2014. Sími 464 1900.',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: 'Hótel Laxá',
  legalName: 'Hótel Laxá ehf.',
  telephone: '+354 464 1900',
  email: 'hotellaxa@hotellaxa.is',
  foundingDate: '2014',
  numberOfRooms: 80,
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Norðurland',
    addressCountry: 'IS',
  },
  image: HERO_IMAGE.src,
  url: 'https://hotellaxa.is',
  amenityFeature: [{ '@type': 'LocationFeatureSpecification', name: 'Eldey Restaurant' }],
}

/* ── Dashboard entry ──────────────────────────────────────────────────── */
export const companyEntry: PreviewCompany = {
  slug: 'laxa',
  route: '/preview/laxa',
  name: 'Hótel Laxá',
  sector: 'Hótel',
  location: 'Mývatn, Norðurland',
  region: 'Norðurland',
  established: 'Opnað 2014',
  currentUrl: 'https://hotellaxa.is',
  ownerEmail: 'hotellaxa@hotellaxa.is',
  concept: 'Birtan við vatnið',
  conceptTagline:
    'Síðan líður í gegnum ljós eins Mývatnsdags, fjórir litahamir sem renna hver inn í annan eftir einu skrunggildi (nótt, norðurljós, dagsbirta, kvöldgull), og maturinn er það sem birtan lýsir upp. Ein flöt, upphástöfuð leturgerð í 1,74 línubili, borin uppi af eigin veislumyndum Eldeyjar frá mars 2026.',
  accent: '#C8792F',
  dark: true,
  status: 'Concept ready',
  thumb: HERO_IMAGE.src,
  ownPhotography: true,
  photoCredit:
    'Ljósmyndir af mat eru eigin veislumyndir Eldeyjar frá mars 2026. Aðrar innanhússmyndir eru raunverulegar myndir hótelsins í upprunalegri, fremur lítilli upplausn og eru sýndar í samræmi við það, ekki stækkaðar upp.',
  audit: {
    strengths: [
      'Óháð hótel við Mývatn með 80 herbergjum og eigin veitingastað, Eldey, á staðnum síðan 2014',
      'Faglegar veislumyndir af mat frá mars 2026, í hárri upplausn, sem núverandi vefur nýtir illa',
      'Bókunarkerfi sem virkar nú þegar í gegnum Godo, auk gjafabréfa í gegnum Reserva',
      'Tvítyngdur vefur (íslenska og enska), sem sýnir að erlendir gestir eru þegar í huga',
    ],
    weaknesses: [
      'WordPress-vefur með 31 stílblaði og jQuery, samtals um 230 KB af HTML á forsíðu einni',
      'Enginn h1-titill finnst á síðunni, sem veikir bæði leitarvélabestun og aðgengi',
      'Engin af 33 myndum vefsins er í webp-sniði, og aðeins 12 af 35 myndum eru löt-hlaðnar (lazy-loaded)',
      'Framúrskarandi matarljósmyndir frá mars 2026 fá enga sérstaka umgjörð á forsíðunni',
    ],
    opportunities: [
      'Láta matarljósmyndirnar bera síðuna sem miðpunkt, í stað þess að týnast í almennri myndaröð',
      'Hreint, hraðvirkt WordPress-uppgjör: einn h1, webp-sambærileg þjöppun, löt hleðsla á öllum myndum',
      'Skýr og virðuleg afhending yfir í Godo-bókunarkerfið í stað þess að reyna að endurgera það',
      'Nota hina einu birtu Mývatns sem sjónrænt einkenni sem enginn keppinautur á',
    ],
  },
  positioning:
    'Hótel Laxá er óháð hótel við Mývatn með 80 herbergjum og eigin veitingastað, Eldey, en núverandi vefur er þungur WordPress-vefur með 31 stílblaði, engum h1-titli og engum myndum í nútímasniði. Um leið á hótelið faglegar veislumyndir af mat frá mars 2026 sem núverandi vefur nýtir varla. Endurhönnunin lætur síðuna líða í gegnum ljós eins Mývatnsdags, frá nótt til gulls, og setur matinn fram sem það sem sú birta lýsir upp, með virðulegri, boxaðri afhendingu yfir í Godo-bókunarkerfið sem þegar virkar.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Hótel Laxá',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk hótel og ferðaþjónustu.

Ég var að skoða hotellaxa.is og tók eftir tvennu. Annars vegar keyrir síðan á gömlu WordPress-uppsetningu með 31 stílblaði og hvergi finnst h1-titill, sem gerir henni erfiðara fyrir í leitarvélum. Hins vegar fann ég veislumyndir af matnum ykkar frá því í mars, faglega teknar og í góðri upplausn, sem núverandi vefur nýtir alls ekki eins og þær eiga skilið.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur, byggða á ykkar eigin myndum. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að láta síðuna líða í gegnum ljós eins dags við Mývatn, frá nóttinni til norðurljósanna og loks gullins kvöldsins, og setja matinn frá Eldey fram sem það sem sú birta lýsir upp. Bókunin sjálf er óbreytt: hún fer beint í gegnum Godo-kerfið sem þið notið nú þegar, aðeins betur umgjörðuð.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

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
  'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09807.jpeg':
    'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09807-768x512.jpeg 768w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09807-1024x683.jpeg 1024w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09807-1536x1024.jpeg 1536w',
  'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09796.jpeg':
    'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09796-768x512.jpeg 768w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09796-1024x683.jpeg 1024w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09796-1536x1024.jpeg 1536w',
  'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09791.jpeg':
    'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09791-768x512.jpeg 768w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09791-1024x683.jpeg 1024w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09791-1536x1024.jpeg 1536w',
  'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09775.jpeg':
    'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09775-768x512.jpeg 768w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09775-1024x683.jpeg 1024w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09775-1536x1024.jpeg 1536w',
  'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09760.jpeg':
    'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09760-768x512.jpeg 768w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09760-1024x683.jpeg 1024w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09760-1536x1024.jpeg 1536w',
  'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09750.jpeg':
    'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09750-768x512.jpeg 768w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09750-1024x683.jpeg 1024w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09750-1536x1024.jpeg 1536w',
  'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09717.jpeg':
    'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09717-768x512.jpeg 768w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09717-1024x683.jpeg 1024w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09717-1536x1024.jpeg 1536w',
  'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09648.jpeg':
    'https://hotellaxa.is/wp-content/uploads/2026/03/DSC09648-768x512.jpeg 768w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09648-1024x683.jpeg 1024w, https://hotellaxa.is/wp-content/uploads/2026/03/DSC09648-1536x1024.jpeg 1536w',
}

/** Most images here sit full-bleed on a phone and about half-width on desktop. */
export const SIZES = '(max-width: 900px) 100vw, 50vw'
