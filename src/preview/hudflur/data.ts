/* ── Húðflúrstofa Norðurlands · „Fine Line" ───────────────────────────────────
   Verified facts only (per brief): est. 2011 (15 years by 2026), Gránufélagsgata 4,
   Akureyri, 256 Facebook reviews at 88% recommend, ~2,300 Instagram followers,
   NO current website (Facebook/Instagram only), contact hudflur@hudflur.net.
   No phone number, no artist names, no specific tattoo styles were supplied —
   none are invented here. No opening hours are posted anywhere today, so the
   visit section says so honestly instead of fabricating a schedule.          */

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
  fineLine: {
    src: u('photo-1598816639574-47ef99da24fd', 1200),
    alt: 'Svarthvít nærmynd af fíngerðu línuverki á húð',
  },
} as const

export const META = {
  title: 'Húðflúrstofa Norðurlands | Húðflúr og húðgötun á Akureyri',
  description:
    'Húðflúrstofa Norðurlands hefur starfað á Akureyri frá 2011. Húðflúr eftir pöntun og húðgötun, byggt á fimmtán ára reynslu og trausti viðskiptavina — 88% mæla með stofunni.',
}

export const NAV = [
  { label: 'Um okkur', href: '#um' },
  { label: 'Þjónusta', href: '#thjonusta' },
  { label: 'Umsagnir', href: '#umsagnir' },
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
} as const

export const VISIT = {
  heading: 'Heimsókn',
  name: 'Húðflúrstofa Norðurlands',
  address: 'Gránufélagsgata 4, 600 Akureyri',
  hoursNote:
    'Enginn fastur opnunartími er birtur opinberlega í dag — pantaðu tíma með skilaboðum á Facebook/Instagram eða í tölvupósti, og fáðu svar milliliðalaust.',
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
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Gránufélagsgata 4',
    addressLocality: 'Akureyri',
    postalCode: '600',
    addressCountry: 'IS',
  },
  areaServed: 'Akureyri',
  sameAs: ['https://www.facebook.com/hudflurstofanordurlands/'],
}
