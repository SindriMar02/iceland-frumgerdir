import type { PreviewCompany } from '../companies'

/**
 * Katrín Ísfeld, innanhússarkitekt — katrinisfeld.is (WP/Elementor).
 * Facts read off her own rendered site + ja.is 2026-08-14/15:
 * katrin@katrinisfeld.is · 663 3414 · Bankastræti 10, 101 Reykjavík (ja.is).
 * The register below is her OWN published project index: 23 project pages in
 * four named categories, titles verbatim from her URL slugs/pages. Photos are
 * her own portfolio photography, harvested at the full-resolution originals
 * behind the 768px Elementor derivatives. Her career line (architecture
 * studios in the Netherlands and Florida) is from her own Stúdíóið page.
 */

const BASE = import.meta.env.BASE_URL

export interface KiPhoto { src: string; alt: string; ratio: string }

const P = (name: string, alt: string, ratio = '4 / 3'): KiPhoto => ({
  src: `${BASE}katrinisfeld/${name}-1920.jpg`,
  alt,
  ratio,
})

export const srcSet = (src: string) =>
  `${src.replace('-1920.jpg', '-960.jpg')} 900w, ${src} 1500w`

export const PHOTO = {
  eldhusVitt: P('s-eldhus-vitt', 'Eldhús í Súluhöfða: vínrauð eyja, koparljós og útsýni yfir voginn'),
  eyja: P('s-eyja', 'Vínrauð eldhúseyja með svörtum blöndunartækjum og koparljósum'),
  skapur: P('s-skapur', 'Innbyggður glerskápur með lýsingu og dökkum viðaráferðum'),
  arinn: P('s-arinn', 'Arinveggur úr ljósum steini með eldiviðarhólfum og huldu ljósi', '4 / 3.05'),
  fot: P('s-fot', 'Fataherbergi með lýstum slám og ljósum innréttingum', '4 / 3.1'),
  bad: P('s-bad', 'Baðherbergi með bogadregnum lýstum spegli og steinvaski'),
  sturta: P('s-sturta', 'Sturturými með dökkum steinvegg og grænni plöntu'),
  fStofa: P('f-stofa', 'Sumarhús í Fljótshlíð: hörgardínur, hangandi ljós og leðurstóll', '3 / 4'),
  fEldhus: P('f-eldhus', 'Eldhús sumarhússins með barstólum og mjúku dagsljósi'),
  fEyja: P('f-eyja', 'Dökk eldhúseyja sumarhússins með blómum'),
  fKrokur: P('f-krokur', 'Borðkrókur með bogalampa og útsýni'),
  fBitar: P('f-bitar', 'Borðstofa undir timburbitum með kúpulljósi', '3 / 4'),
}

/** Her own published register: 23 verk í 4 flokkum (af katrinisfeld.is). */
export const REGISTER: Array<{ flokkur: string; verk: string[] }> = [
  {
    flokkur: 'Innanhússhönnun',
    verk: [
      'Nýbyggt hús í Súluhöfða', 'Sumarhús í Fljótshlíð', 'Eldhúsrými',
      'Eldhúsrými í skandinavískum stíl', 'Eldhúsrými í Skuggahverfi',
      'Fjallalind', 'Hönnunarstúdíó', 'Hús í Kópavogi', 'Álfheimar',
      'Barnaherbergi', 'Hús í Garðabæ', 'Baðherbergi', 'Laugalækur',
    ],
  },
  {
    flokkur: 'Gistiheimili og hótel',
    verk: [
      'Freyja gistiheimili', 'Freyja lúxusíbúð', 'Sólvallagata',
      'Svala Apartments', 'Old Charm Apt', 'Hótel Hekla',
    ],
  },
  { flokkur: 'Atvinnuhúsnæði', verk: ['Skrifstofurými', 'Tannlæknastofa'] },
  { flokkur: 'Ýmislegt', verk: ['Fjölmiðlar', 'Stemning'] },
]

export const REGISTER_COUNT = REGISTER.reduce((n, f) => n + f.verk.length, 0)

export const CONTACT = {
  phone: '663 3414',
  phoneHref: 'tel:+3546633414',
  email: 'katrin@katrinisfeld.is',
  address: 'Bankastræti 10, 101 Reykjavík',
} as const

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Katrín Ísfeld innanhússarkitekt',
  telephone: '+354 663 3414',
  email: 'katrin@katrinisfeld.is',
  url: 'https://katrinisfeld.is',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bankastræti 10',
    postalCode: '101',
    addressLocality: 'Reykjavík',
    addressCountry: 'IS',
  },
  knowsAbout: ['Innanhússhönnun', 'Innanhússarkitektúr', 'Gistiheimili og hótel', 'Ítalskar innréttingar'],
}

export const companyEntry: PreviewCompany = {
  slug: 'katrinisfeld',
  route: '/preview/katrinisfeld',
  name: 'Katrín Ísfeld innanhússarkitekt',
  sector: 'Innanhússhönnun',
  location: 'Bankastræti 10, 101 Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Sjálfstætt starfandi innanhússarkitekt',
  currentUrl: 'https://katrinisfeld.is',
  ownerEmail: 'katrin@katrinisfeld.is',
  concept: 'Rýmið man',
  conceptTagline:
    'Hún hannar rými sem muna hver á þau. Vefurinn hennar á að gera það sama: hvert verkefni fær sinn eigin litheim og forsíðan ber þá alla.',
  accent: '#8C3A34',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}katrinisfeld/s-eldhus-vitt-960.jpg`,
  ownPhotography: true,
  photoCredit:
    'Allar myndir eru raunveruleg verkefni af vef Katrínar (katrinisfeld.is), sóttar í fullri upplausn í ágúst 2026.',
  audit: {
    strengths: [
      '23 birt verkefni í fjórum flokkum, þar af sex fyrir gistiheimili og hótel',
      'Ljósmyndun verkefnanna er sterk og samræmd (Súluhöfða, Fljótshlíð)',
      'Skýr sérstaða: ítalskar innréttingar og heildarhönnun frá grunni',
    ],
    weaknesses: [
      'Forsíðan hefur engar fyrirsagnir (0 h1/h2/h3) og aðeins 238 stafi af texta',
      'Hver einasta ljósmynd er CSS-bakgrunnur í Elementor: ekkert indexanlegt myndefni',
      'Meta-lýsingin er slitur úr myndasleða („…Previous Next“) og lang-merkið er en-US',
    ],
    opportunities: [
      'Verkefnaskráin sjálf er burðarvirkið: 23 verk sem forsíðan ber í stað þess að fela',
      'Litheimur hvers verkefnis (vínrautt og kopar í Súluhöfða, hör og birta í Fljótshlíð) getur litað síðuna sjálfa',
    ],
  },
  positioning:
    'Katrín Ísfeld hannar innanhús frá grunni fyrir heimili, gistiheimili og hótel. Vefurinn er byggður eins og hún hannar: gesturinn kemur inn í eitt rými í einu, hvert með sínum litheimi, og verkefnaskráin öll stendur opin eins og teikningaskápur.',
  outreach: {
    subject: 'Hugmynd að nýjum vef fyrir stúdíóið',
    body:
      'Sæl Katrín,\n\nÉg heiti Sindri og hanna vefsíður. Verkefnin þín á katrinisfeld.is eru sterk, en síðan sjálf heldur þeim frá Google: hver einasta ljósmynd er CSS-bakgrunnur, forsíðan er án fyrirsagna og lýsingin sem birtist í leitarniðurstöðum er slitur úr myndasleða.\n\nÉg setti saman frumgerð þar sem verkefnaskráin þín öll, 23 verk í fjórum flokkum, ber síðuna, og litheimur verkefnanna sjálfra litar hana. Allt á síðunni eru þínar eigin myndir.\n\nÞetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.\n\nBestu kveðjur,\nSindri',
  },
}
