/* ── Fótógrafí · „Framköllun" ─────────────────────────────────────────────
   Verified facts only (see brief): Skólavörðustígur 22, 101 Reykjavík,
   founded May 2007 ("the first of its kind in Iceland"), owner Ari
   Sigvaldason (left a 15-year career at RÚV to open it), 300+ vintage film
   cameras on the walls, a 1960s-1980s vinyl collection played in-store,
   sells fine-art prints / framed photos / canvas prints / books / cards /
   polaroids, hours "á samkomulagi" (on request), contact
   fotografi.iceland@gmail.com. No phone number is published anywhere, so
   none is invented here. The known buggy-checkout complaint is referenced
   once, honestly, as a concept note — no working cart is built.          */

const u = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

const srcSet3 = (id: string) =>
  `${u(id, 828)} 828w, ${u(id, 1280)} 1280w, ${u(id, 2000)} 2000w`

export const IMG = {
  /* Vestrahorn, svarthvít — a real, verified Icelandic landscape (confirmed
     via the photo's own location tag). Replaces an earlier pick that
     resolved to an aerial shot of Manhattan mislabeled as "a framed print" —
     caught on review. This is the closest honest stand-in for "an Icelandic
     landscape print, framed, ready to take home": the hero's develop-reveal
     plays out on it, tying the signature motif directly to the real offer. */
  hero: {
    src: u('photo-1609780236825-671d3e459e7e', 1280),
    srcSet: srcSet3('photo-1609780236825-671d3e459e7e'),
    alt: 'Svarthvít landslagsljósmynd af Vestrahorni, römmuð upp sem sýnishorn af íslenskum prentum sem búðin selur',
  },
  cameraWall: {
    src: u('photo-1563298258-c9b0371b55cc', 1600),
    srcSet: srcSet3('photo-1563298258-c9b0371b55cc'),
    alt: 'Veggur þakinn gömlum filmumyndavélum, sýnishorn af andrúmslofti safnsins',
  },
  vinyl: {
    src: u('photo-1582730147924-d92f4da00252', 1000),
    srcSet: srcSet3('photo-1582730147924-d92f4da00252'),
    alt: 'Stafli af gömlum vínylplötum, sýnishorn af tónlistinni sem hljómar í búðinni',
  },
  camera: {
    src: u('photo-1517092756309-24071485f6db', 1000),
    srcSet: srcSet3('photo-1517092756309-24071485f6db'),
    alt: 'Gömul myndavél í nærmynd, sýnishorn úr safninu á veggjunum',
  },
  reykjavik: {
    src: u('photo-1608468716860-5566b7671ea3', 1400),
    srcSet: srcSet3('photo-1608468716860-5566b7671ea3'),
    alt: 'Litríkar þakhæðir Reykjavíkur séðar úr lofti, nálægt Hallgrímskirkju',
  },
} as const

const ADDRESS_QUERY = encodeURIComponent('Skólavörðustígur 22, 101 Reykjavík')

export const META = {
  title: 'Fótógrafí | Ljósmyndavöruverslun og gallerí á Skólavörðustíg',
  description:
    'Fótógrafí við Skólavörðustíg 22 í Reykjavík, síðan 2007. Filmumyndavélar á veggjunum, vínylsafn, listljósmyndir og prent, við hliðina á Hallgrímskirkju.',
}

export const NAV = [
  { label: 'Vörur', href: '#vorur' },
  { label: 'Safnið', href: '#safnid' },
  { label: 'Sagan', href: '#sagan' },
  { label: 'Heimsókn', href: '#heimsokn' },
]

export const HERO = {
  eyebrow: 'Framköllun · Skólavörðustígur 22 · síðan 2007',
  heading: 'Taktu Ísland heim í ramma.',
  sub: 'Fótógrafí er lítil rauð búð þar sem gamlar filmumyndavélar horfa niður af hverjum vegg og platan snýst í bakgrunni. En það sem þú ferð með þér heim er alvöru íslensk ljósmynd, valin og römmuð á staðnum, ekki bara andrúmsloftið.',
  ctaPrimary: 'Fá leiðsögn',
  ctaSecondary: 'Skoða vörurnar',
  filmEdge: 'FÓTÓGRAFÍ · FRAMKÖLLUN · Nr. 22',
}

export const COLLECTION = {
  eyebrow: 'Safnið',
  heading: 'Þrjú hundruð myndavélar á veggjunum',
  body: 'Filmumyndavélar frá mörgum áratugum þekja veggina og í bakgrunni hljómar vínylsafn frá sjöunda og áttunda áratugnum. Þetta andrúmsloft er það sem gerir búðina að því sem hún er, ekki bara vörurnar á hillunum.',
  captionWall: 'Gamlar myndavélar, sýnishorn af veggjunum.',
  captionVinyl: 'Vínylsafn, sýnishorn.',
  statCameras: '300+',
  statCamerasLabel: 'filmumyndavélar á veggjunum',
  statVinyl: '1960-80',
  statVinylLabel: 'árgangar í vínylsafninu',
}

export const STORY = {
  eyebrow: 'Sagan',
  year: '2007',
  heading: 'Fyrsta búð sinnar tegundar á Íslandi',
  body1:
    'Ari Sigvaldason opnaði Fótógrafí árið 2007, fyrstu búð sinnar tegundar á Íslandi, eftir fimmtán ára feril hjá RÚV.',
  body2:
    'Á sama stað við Skólavörðustíg hefur búðin síðan safnað að sér myndavélum, vínyl og ljósmyndum, og orðið jafn mikið gallerí og verslun.',
  imgCaption: 'Gömul myndavél úr safninu, sýnishorn.',
}

export const PRODUCTS = {
  eyebrow: 'Vörur',
  heading: 'Frá veggnum okkar á vegginn þinn.',
  intro:
    'Listljósmyndir af Íslandi, rammaðar myndir, striga prent og smærri gjafavara, allt valið af sömu alúð og fyllir veggina í búðinni sjálfri.',
  note: 'Í núverandi vefverslun klikkar greiðsluferlið oft og þarf að reyna aftur. Í fullbúinni útgáfu þessa vefjar væri það fyrsta sem yrði lagað — hér sýnum við hugmyndina að vörunum sjálfum, ekki virka kaupferð.',
  items: [
    { frame: '01', title: 'Listljósmyndaprent', body: 'Prent af völdum ljósmyndum, tilbúin til að hengja upp.' },
    { frame: '02', title: 'Rammaðar myndir', body: 'Innrammaðar myndir, valdar og rammaðar í búðinni sjálfri.' },
    { frame: '03', title: 'Striga-prent', body: 'Stærri verk færð yfir á striga fyrir vegginn heima.' },
    { frame: '04', title: 'Bækur og kort', body: 'Ljósmyndabækur og kort fyrir gjafir og safnara.' },
    { frame: '05', title: 'Polaroid', body: 'Polaroid-vörur fyrir þau sem vilja taka augnablikið strax.' },
  ],
} as const

export const VISIT = {
  eyebrow: 'Heimsókn',
  heading: 'Kíktu í búðina',
  address: 'Skólavörðustígur 22, 101 Reykjavík',
  addressNote: 'Við hliðina á Hallgrímskirkju, í hjarta miðbæjarins.',
  hoursLabel: 'Opnunartími',
  hoursValue: 'Eftir samkomulagi',
  hoursNote: 'Sendu okkur línu á netfangið og við finnum tíma sem hentar.',
  email: 'fotografi.iceland@gmail.com',
  mapHref: `https://www.google.com/maps/search/?api=1&query=${ADDRESS_QUERY}`,
  mapLabel: 'Sjá á korti',
  imgCaption: 'Litríkar þakhæðir miðbæjarins, nálægt Hallgrímskirkju.',
  review: {
    quote:
      '„Búðin sjálf er upplifun, myndavélarnar á veggjunum og platan sem spilar í bakgrunni. Keypti innrammaða mynd sem ég sé ekki eftir.“',
    name: 'Sýnishorn umsagnar',
  },
  reviewDisclaimer:
    'Sýnishorn: umsögnin hér að ofan er dæmi, sett fram til að sýna hvernig síðan gæti litið út.',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Fótógrafí',
  description:
    'Ljósmyndavöruverslun og gallerí með filmumyndavélum, vínylsafni og listljósmyndum við Skólavörðustíg í Reykjavík.',
  foundingDate: '2007',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Skólavörðustígur 22',
    addressLocality: 'Reykjavík',
    postalCode: '101',
    addressCountry: 'IS',
  },
  email: 'fotografi.iceland@gmail.com',
}
