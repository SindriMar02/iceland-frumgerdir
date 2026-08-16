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

/**
 * THE OVERVIEW — real named projects from across her four categories, each
 * with its own photograph harvested from that project's own page. This is
 * the page's spine: breadth of work, not one house.
 */
const V = (file: string, alt: string): KiPhoto => ({
  src: `${BASE}katrinisfeld/${file}-1920.jpg`,
  alt,
  ratio: '4 / 3',
})

export const PROJECTS: Array<{ name: string; flokkur: string; photo: KiPhoto }> = [
  { name: 'Nýbyggt hús í Súluhöfða', flokkur: 'Innanhússhönnun', photo: { src: `${BASE}katrinisfeld/s-eyja-1920.jpg`, alt: 'Vínrauð eldhúseyja með svörtum blöndunartækjum og koparljósum', ratio: '4 / 3' } },
  { name: 'Eldhúsrými í Skuggahverfi', flokkur: 'Innanhússhönnun', photo: V('p-skuggahverfi-0', 'Dökkt eldhús með eyju, viðarinnréttingum og innfelldri lýsingu') },
  { name: 'Eldhúsrými í skandinavískum stíl', flokkur: 'Innanhússhönnun', photo: V('p-skandinaviskt-0', 'Ljóst eldhús með eyju, viðarborði og hangandi ljósum') },
  { name: 'Eldhúsrými', flokkur: 'Innanhússhönnun', photo: V('p-eldhusrymi-0', 'Opið eldhús og borðstofa með kringlóttu borði') },
  { name: 'Sumarhús í Fljótshlíð', flokkur: 'Innanhússhönnun', photo: { src: `${BASE}katrinisfeld/f-eldhus-1920.jpg`, alt: 'Eldhús sumarhússins með barstólum og mjúku dagsljósi', ratio: '4 / 3' } },
  { name: 'Álfheimar', flokkur: 'Innanhússhönnun', photo: V('p-alfheimar-0', 'Stofa með dökkum sófa og stóru listaverki á vegg') },
  { name: 'Hús í Garðabæ', flokkur: 'Innanhússhönnun', photo: V('p-gardabaer-0', 'Stofa með kringlóttum spegli, dökkum sófa og leðurstól') },
  { name: 'Baðherbergi', flokkur: 'Innanhússhönnun', photo: V('p-badherbergi-0', 'Baðherbergi með sporöskjulaga spegli og dökkri innréttingu') },
  { name: 'Barnaherbergi', flokkur: 'Innanhússhönnun', photo: V('p-barnaherbergi-0', 'Barnaherbergi með bláum veggjum, rúmi og röndóttu teppi') },
  { name: 'Hönnunarstúdíó', flokkur: 'Innanhússhönnun', photo: V('p-studio-1', 'Dökk marmaraborðplata í sýningarrými stúdíósins') },
  { name: 'Freyja gistiheimili', flokkur: 'Gistiheimili og hótel', photo: V('p-freyja-0', 'Gestaherbergi með bláum vegg og ljósum gluggatjöldum') },
  { name: 'Freyja lúxusíbúð', flokkur: 'Gistiheimili og hótel', photo: V('p-freyjalux-0', 'Svefnherbergi með gráu rúmi og innbyggðum hillum') },
  { name: 'Svala Apartments', flokkur: 'Gistiheimili og hótel', photo: V('p-svala-0', 'Gestaherbergi með grænum vegg og listaverki af hesti') },
  { name: 'Sólvallagata', flokkur: 'Gistiheimili og hótel', photo: V('p-solvallagata-1', 'Hvítur stigagangur með viðarhandriði') },
  { name: 'Old Charm Apt', flokkur: 'Gistiheimili og hótel', photo: V('p-oldcharm-1', 'Svefnherbergi undir timburbitum') },
  { name: 'Skrifstofurými', flokkur: 'Atvinnuhúsnæði', photo: V('p-skrifstofa-0', 'Skrifstofurými með gráum sófa og rauðum stól') },
  { name: 'Tannlæknastofa', flokkur: 'Atvinnuhúsnæði', photo: V('p-tannlaeknar-0', 'Móttaka tannlæknastofu með ljósum afgreiðsluborði') },
]

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
  knowsAbout: ['Innanhússhönnun', 'Innanhússarkitektúr', 'Gistiheimili og hótel', 'Atvinnuhúsnæði', 'Ítalskar innréttingar'],
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
  concept: 'Í heild',
  conceptTagline:
    'Hún hannar innanhús frá grunni, ekki eitt horn í einu. Vefurinn gerir það sama: hvert verkefni fær sinn eigin litheim og forsíðan ber þá alla.',
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
  /* Observation paragraph re-measured on katrinisfeld.is 2026-08-16: 0 h1/h2/h3,
     238 characters of front-page text, 30 CSS-background images against 2 real
     ones, and a meta description that ends on the slider's Previous and Next. */
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Katrínu Ísfeld',
    body:
      'Sæl Katrín,\n\n' +
      'Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki. Ég skoðaði katrinisfeld.is og það sem sat eftir var breiddin: 23 verk í fjórum flokkum, allt frá eldhúsum og baðherbergjum upp í gistiheimili og hótel, og ljósmyndunin á þeim er samræmd og sterk.\n\n' +
      'Eitt rakst ég þó á. Forsíðan hefur engar fyrirsagnir og 238 stafi af texta, myndirnar eru nær allar settar inn sem bakgrunnur í stað raunverulegra mynda, og lýsingin sem birtist í Google endar á orðunum Previous og Next, sem eru hnappar úr myndasleðanum. Verkin þín eru því nánast ósýnileg í leit.\n\n' +
      'Ég setti saman frumgerð þar sem verkefnaskráin þín öll ber síðuna og hvert verk fær sína eigin mynd í fullri upplausn. Allar myndir á síðunni eru þínar eigin.\n\n' +
      'Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.\n\n' +
      'Hana má skoða hér hvenær sem er, og hún virkar vel í síma:\n[HLEKKUR Á FRUMGERÐ]\n\n' +
      'Ef þér líst á er ég til í að heyra frá þér, en ef ekki er það að sjálfsögðu allt í lagi.\n\n' +
      'Bestu kveðjur,\nSindri Már\n845 1758\nsndr-studio.pages.dev',
  },
}
