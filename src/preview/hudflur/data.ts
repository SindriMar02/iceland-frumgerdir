/* ── Húðflúrstofa Norðurlands · „Fine Line" ───────────────────────────────────
   Verified facts only: est. 2011 (15 years by 2026), Gránufélagsgata 4,
   Akureyri, 256 Facebook reviews at 88% recommend, ~2,300 Instagram followers,
   phone +354 866 5757, contact hudflur@hudflur.net. Hours Mon-Sat 13:00-18:00,
   sourced from glartent.com's business-directory mirror of their Facebook
   listing (a second independent source, not their own site — they have none).
   No artist names or specific tattoo styles were supplied — none invented.
   Real logo (a chrome/silver heraldic shield-and-eagle mark) recovered from
   their Facebook profile photo via the public graph.facebook.com/<id>/picture
   endpoint, at public/hudflur/brand/logo.png (background keyed transparent).
   Ferlið (process) and Umhirða (aftercare) are standard, generic tattoo-
   industry practice, not studio-specific claims.                            */

const u = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const IMG = {
  /* hero — hands with a tattoo machine mid-line. Ambient/mood stock, not this
     studio's own work (see honesty rule in PreviewFooter + captions below). */
  hero: {
    src: u('photo-1568515045052-f9a854d70bfd', 1280),
    srcSet: `${u('photo-1568515045052-f9a854d70bfd', 828)} 828w, ${u('photo-1568515045052-f9a854d70bfd', 1280)} 1280w, ${u('photo-1568515045052-f9a854d70bfd', 2000)} 2000w`,
    alt: 'Hendur halda á húðflúrvél og teikna línu á húð, svipmynd',
  },
  inkCaps: {
    src: u('photo-1777160422885-2c9ba49b700d', 1000),
    alt: 'Nærmynd af litabökkum og áhöldum sem notuð eru við húðflúrun',
  },
  studio: {
    src: u('photo-1760877611905-0f885a3ce551', 1600),
    srcSet: `${u('photo-1760877611905-0f885a3ce551', 828)} 828w, ${u('photo-1760877611905-0f885a3ce551', 1280)} 1280w, ${u('photo-1760877611905-0f885a3ce551', 2000)} 2000w`,
    alt: 'Dimm og stílhrein vinnustofa með húðflúrstól',
  },
  sketch: {
    src: u('photo-1635183783375-98e857771351', 1200),
    srcSet: `${u('photo-1635183783375-98e857771351', 828)} 828w, ${u('photo-1635183783375-98e857771351', 1200)} 1200w, ${u('photo-1635183783375-98e857771351', 2000)} 2000w`,
    alt: 'Tattúveruð hönd teiknar hugmyndir í skissubók við skrifborð, svipmynd',
  },
  aftercare: {
    src: u('photo-1712168044214-f5a272c23a5b', 1000),
    alt: 'Ómerkt krem, sýnishorn af umhirðuvöru eftir húðflúr',
  },
  lounge: {
    src: u('photo-1781925856343-c97d0d44f94c', 1400),
    srcSet: `${u('photo-1781925856343-c97d0d44f94c', 828)} 828w, ${u('photo-1781925856343-c97d0d44f94c', 1400)} 1400w, ${u('photo-1781925856343-c97d0d44f94c', 2000)} 2000w`,
    alt: 'Dimm og notaleg setustofa með sófa og römmuðum myndum á vegg, svipmynd',
  },
  fineLine: {
    src: u('photo-1598816639574-47ef99da24fd', 1200),
    alt: 'Svarthvít nærmynd af fíngerðu línuverki á húð',
  },
} as const

export const LOGO = 'hudflur/brand/logo.png'

export const META = {
  title: 'Húðflúrstofa Norðurlands | Húðflúr og húðgötun á Akureyri',
  description:
    'Húðflúrstofa Norðurlands hefur starfað á Akureyri frá 2011. Húðflúr eftir pöntun og húðgötun, byggt á fimmtán ára reynslu og trausti viðskiptavina — 88% mæla með stofunni. Opið mán.-lau. 13-18.',
}

export const NAV = [
  { label: 'Þjónusta', href: '#thjonusta' },
  { label: 'Ferlið', href: '#ferlid' },
  { label: 'Umhirða', href: '#umhirda' },
  { label: 'Um okkur', href: '#um' },
  { label: 'Heimsókn', href: '#heimsokn' },
]

export const HERO = {
  eyebrow: 'Húðflúrstofa Norðurlands · Akureyri',
  line1: 'Hvert húðflúr byrjar',
  line2: 'á einni línu.',
  sub: 'Í fimmtán ár hefur Húðflúrstofa Norðurlands byggt upp orðspor á Akureyri í kyrrþey — og fær nú loksins eigin heimasíðu.',
  ctaPrimary: 'Senda skilaboð á Facebook',
  ctaSecondary: 'Senda tölvupóst',
}

export const TRUST = [
  { value: '15', label: 'ár í rekstri á Akureyri' },
  { value: '88%', label: 'mæla með stofunni · 256 umsagnir á Facebook' },
  { value: '2.300+', label: 'fylgjendur á Instagram' },
] as const

export const ABOUT = {
  heading: 'Um stofuna',
  body1:
    'Húðflúrstofa Norðurlands hefur verið starfrækt á Akureyri frá árinu 2011. Í fimmtán ár hefur stofan byggt upp nafn sem margir þekkja — ekki í gegnum auglýsingar, heldur í gegnum orðspor sem gengur mann fram af manni.',
  body2:
    '256 umsagnir á Facebook og 88% meðmæli tala sínu máli: þetta er stofa sem fólk kemur aftur til, og bendir vinum og fjölskyldu á.',
  caption: 'Svipmynd — andrúmsloft vinnustofu (ekki mynd af stofunni sjálfri)',
}

export const SERVICES = {
  heading: 'Þjónusta',
  intro: 'Tvær megingreinar, unnar af nákvæmni og alúð.',
  items: [
    {
      title: 'Húðflúr eftir pöntun',
      body: 'Hvert verk er unnið í samráði við viðskiptavin, frá fyrstu hugmynd að lokahandbragði.',
    },
    {
      title: 'Húðgötun',
      body: 'Fagleg húðgötun í öruggu og hreinlegu umhverfi.',
    },
  ],
  caption: 'Svipmynd — litabakkar og áhöld',
} as const

export const PROCESS = {
  eyebrow: 'Ferlið',
  heading: 'Fjögur skref, engin pressa',
  steps: [
    {
      n: '01',
      title: 'Hugmynd',
      body: 'Þú sendir hugmynd, tilvísun eða bara stærð og staðsetningu sem þú hefur í huga, á Facebook, Instagram eða í tölvupósti.',
    },
    {
      n: '02',
      title: 'Hönnun',
      body: 'Áður en tími er bókaður er hönnunin unnin í samráði við þig, þangað til hún er tilbúin fyrir húðina.',
    },
    {
      n: '03',
      title: 'Tíminn sjálfur',
      body: 'Unnið er í rólegu og hreinlegu umhverfi. Hvert verk fær þann tíma sem það þarf, ekkert flýtt.',
    },
    {
      n: '04',
      title: 'Gróandi',
      body: 'Að lokinni vinnu færðu skýrar leiðbeiningar um umhirðu, svo verkið grói vel og haldi lit.',
    },
  ],
  caption: 'Svipmynd — hugmynd tekur á sig mynd á blaði',
} as const

export const CARE = {
  eyebrow: 'Umhirða',
  heading: 'Eftir tímann',
  intro: 'Almennar leiðbeiningar sem fylgja hverju verki, svo það grói vel.',
  items: [
    'Hafðu umbúðirnar á í þann tíma sem mælt er með eftir tímann.',
    'Þvoðu svæðið varlega með ilmlausri sápu og volgu vatni.',
    'Berðu þunnt lag af ilmlausu rakakremi á, nokkrum sinnum á dag.',
    'Forðastu sund, heita potta og beint sólarljós þar til verkið er alveg gróið.',
    'Ekki klóra eða krukka í hreistrið, láttu það losna af sjálfu sér.',
  ],
  caption: 'Svipmynd — ilmlaust rakakrem',
} as const

export const REVIEWS = {
  heading: 'Umsagnir',
  disclaimer:
    'Sýnishorn: umsagnirnar hér að neðan eru dæmi, sett fram til að sýna hvernig síðan gæti litið út — ekki orðréttar tilvitnanir af Facebook.',
  items: [
    {
      quote: '„Búið að fara nokkrum sinnum og alltaf sama fagmennskan og hlýja viðmótið.“',
      name: 'Sýnishorn umsagnar',
    },
    {
      quote: '„Nákvæmni og natni sem skilar sér í lokaverkinu. Mæli hiklaust með.“',
      name: 'Sýnishorn umsagnar',
    },
  ],
  caption: 'Svipmynd — andrúmsloft setustofu',
} as const

export const VISIT = {
  heading: 'Heimsókn',
  name: 'Húðflúrstofa Norðurlands',
  address: 'Gránufélagsgata 4, 600 Akureyri',
  hoursLabel: 'Opnunartími',
  hoursValue: 'Mán.-lau. 13:00-18:00',
  hoursNote: 'Pantaðu tíma með skilaboðum á Facebook/Instagram, í tölvupósti eða síma, og fáðu svar milliliðalaust.',
  phoneDisplay: '866 5757',
  phoneHref: 'tel:+3548665757',
  mapHref: `https://maps.google.com/?q=${encodeURIComponent('Gránufélagsgata 4, Akureyri')}`,
  closing: {
    heading: 'Tilbúin/n að panta tíma?',
    body: 'Engin bókunarvél, engin bið — sendu línu og fáðu svar milliliðalaust.',
  },
  caption: 'Svipmynd — fíngert línuverk',
}

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Húðflúrstofa Norðurlands',
  foundingDate: '2011',
  email: 'hudflur@hudflur.net',
  telephone: '+354 866 5757',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Gránufélagsgata 4',
    addressLocality: 'Akureyri',
    postalCode: '600',
    addressCountry: 'IS',
  },
  areaServed: 'Akureyri',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '13:00',
      closes: '18:00',
    },
  ],
  sameAs: ['https://www.facebook.com/hudflurstofanordurlands/'],
}
