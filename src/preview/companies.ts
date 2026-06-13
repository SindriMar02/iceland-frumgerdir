/**
 * Five independent redesign projects — one standalone client engagement each.
 * No shared design language: every page under src/preview/<slug>/ owns its
 * creative direction. This file holds the per-project brief (audit, strategy,
 * creative direction) for the internal dashboard, plus the personalized
 * Icelandic outreach email surfaced in the (gated) preview tooling.
 *
 * Real, unconsented businesses: facts are public; the redesigns are concepts;
 * all sample prices/reviews are disclaimed in each page footer.
 */

export interface AuditList {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
}

export interface PreviewCompany {
  slug: string
  route: string
  name: string
  sector: string
  location: string
  region: string
  established: string
  currentUrl: string
  ownerEmail: string
  /** Creative-direction codename + one-line essence */
  concept: string
  conceptTagline: string
  /** Primary brand accent for this project (dashboard chips, footer) */
  accent: string
  /** Is the page background dark? (drives shared chrome contrast) */
  dark: boolean
  status: 'Concept ready'
  thumb: string
  audit: AuditList
  /** One-paragraph positioning the redesign is built on */
  positioning: string
  outreach: { subject: string; body: string }
}

const SIGN = `Bestu kveðjur,
Sindri
sindrimar02@gmail.com`

export const PREVIEW_COMPANIES: PreviewCompany[] = [
  {
    slug: 'erpsstadir',
    route: '/preview/erpsstadir',
    name: 'Rjómabúið Erpsstaðir',
    sector: 'Artisan creamery',
    location: 'Dalir, West Iceland',
    region: 'West',
    established: 'Est. 2009',
    currentUrl: 'https://erpsstadir.is',
    ownerEmail: 'erpur@simnet.is',
    concept: 'The Tasting Room',
    conceptTagline: 'A farm dairy you can almost taste — cream paper, scoop-of-the-day, the herd behind every flavour.',
    accent: '#e0a43a',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Genuine farm-to-cone product with a named brand ("Kjaftæði")',
        'A fixed stop on the Route 60 run toward the Westfjords',
        'Strong social following and word-of-mouth',
      ],
      weaknesses: [
        'Effectively no website — a single autoplaying video splash',
        'No products, opening hours, map, prices or pre-order',
        'Invisible to search; everything lives on third-party platforms',
      ],
      opportunities: [
        'Capture route traffic with hours + a map + “what’s churning today”',
        'A simple farm-shop pre-order to smooth the summer rush',
        'Tell the herd-to-cone story no supermarket tub can',
      ],
    },
    positioning:
      'Iceland’s most characterful small-batch creamery — the reason to pull off Route 60. The site should make the product mouth-watering and the visit effortless.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Rjómabúið Erpsstaðir',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu og matvælaframleiðslu.

Ég er mikill aðdáandi þess sem þið gerið á Erpsstöðum. Ekta býli, alvöru ís og Kjaftæðið sem fólk keyrir út af leiðinni fyrir. Það eina sem mig vantaði að sjá var vefsíða sem stendur undir vörunni, því eins og staðan er í dag er aðeins stutt myndbandsforsíða og engar upplýsingar um opnunartíma, verð eða hvað er í boði hverju sinni.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að ferðafólk finni ykkur, viti hvenær er opið og fái vatn í munninn áður en það kemur við. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    slug: 'tjoruhusid',
    route: '/preview/tjoruhusid',
    name: 'Tjöruhúsið',
    sector: 'Seafood restaurant',
    location: 'Ísafjörður, Westfjords',
    region: 'Westfjords',
    established: '20+ years',
    currentUrl: 'https://www.tjoruhusid.is',
    ownerEmail: 'tjoruhusid@gmail.com',
    concept: 'The Catch & The Room',
    conceptTagline: 'Candlelit timber, the pan still sizzling — a single-evening ritual told in near-darkness.',
    accent: '#d98a3d',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        '#1-ranked restaurant in Ísafjörður — a genuine destination',
        'Unrepeatable setting: a 300-year-old former tar house',
        'A fixed-price, catch-of-the-day buffet with a cult following',
      ],
      weaknesses: [
        'One barebones text-only page — no images, menu, hours or booking',
        'Reputation travels only by word of mouth; nothing online conveys the room',
        'No reservation path for travellers planning the Westfjords in advance',
      ],
      opportunities: [
        'Sell the ritual: the room, the pans, the season, the why-fixed-price',
        'A simple reservation/season notice to manage the tiny dining room',
        'Become the thing every Westfjords trip is booked around',
      ],
    },
    positioning:
      'Not a restaurant you find — one you make a pilgrimage to. The site should feel like stepping into the candlelit room, and make booking the only thing left to do.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Tjöruhúsið',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús og ferðaþjónustu.

Ég verð að viðurkenna að ég er mikill aðdáandi Tjöruhússins. Stemningin í gamla húsinu og fiskhlaðborðið eru í sérflokki, og umsagnirnar tala sínu máli. Núverandi vefsíða nær hins vegar engan veginn að fanga þetta, enda er hún bara ein textasíða. Ég skil vel að markaðssetning sé ekki það sem brennur á ykkur, og þess vegna ákvað ég að gera þetta sjálfur.

Ég hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Markmiðið er að gestir finni stemninguna áður en þeir koma, og eigi auðvelt með að bóka borð. Ef ykkur líst vel á þetta væri gaman að heyra í ykkur, en annars er það að sjálfsögðu allt í lagi.

${SIGN}`,
    },
  },
  {
    slug: 'ektafiskur',
    route: '/preview/ektafiskur',
    name: 'Ektafiskur',
    sector: 'Artisan saltfish & Baccalá Bar',
    location: 'Hauganes, North Iceland',
    region: 'North',
    established: 'Since 1940',
    currentUrl: 'https://www.ektafiskur.is',
    ownerEmail: 'elvar@ektafiskur.is',
    concept: 'The Salt House',
    conceptTagline: 'Eighty years of provenance, clean as Nordic salt — a premium label that finally ships.',
    accent: '#1f5673',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Rare 1940 provenance — eight decades of hand-salted bacalao',
        'Three revenue lines under one roof: retail, export webshop, Baccalá Bar',
        'A real product story with genuine international demand',
      ],
      weaknesses: [
        'Early-2000s desktop-first site; thumbnail images, weak hierarchy',
        'Webshop is clunky and inconsistent across languages',
        'Heritage — the brand’s biggest asset — is barely visible',
      ],
      opportunities: [
        'A premium bilingual label that makes the webshop actually convert',
        'Position the Baccalá Bar as a north-coast destination',
        'Lead with “since 1940” — provenance as the moat',
      ],
    },
    positioning:
      'A heritage Icelandic seafood house, not a fish stall — provenance, craft and export. The site should look as considered as the product and sell in two clicks.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Ektafisk',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk matvælafyrirtæki og ferðaþjónustu.

Saga Ektafisks frá 1940 er eitthvað sem fá fyrirtæki geta státað af. Handsaltaður fiskur, vefverslun og Baccalá Bar á sama stað. Mér fannst núverandi vefsíða ekki gera þessari arfleifð eða vörunni nógu hátt undir höfði, enda er hún orðin nokkuð þung og gamaldags, og vefverslunin mætti vera mun einfaldari.

Ég settist því niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að láta áttatíu ára söguna njóta sín, gera vefverslunina lipra og kynna Baccalá Bar betur fyrir ferðafólki. Ef ykkur líst vel á stefnuna gæti ég klárað vefinn í heild, en ef ekki er það að sjálfsögðu í góðu.

${SIGN}`,
    },
  },
  {
    slug: 'kaffihornid',
    route: '/preview/kaffihornid',
    name: 'Kaffi Hornið',
    sector: 'Café · bar · restaurant',
    location: 'Höfn í Hornafirði, SE Iceland',
    region: 'Southeast',
    established: 'Since 1999',
    currentUrl: 'https://kaffihornid.is',
    ownerEmail: 'info@kaffihornid.is',
    concept: 'The Warm Corner',
    conceptTagline: 'The harbour table in langoustine country — daylight warmth, glacier on the horizon.',
    accent: '#c5612f',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        '27-year institution in Iceland’s langoustine capital',
        'Single warm location with steady, repeat custom',
        'On a busy tourist route below Vatnajökull',
      ],
      weaknesses: [
        'Site frozen at “© 2018” — repeated broken logos, no mobile layout',
        'Most diners arrive by phone; the current site fails on one',
        'No menu, reservations or langoustine story up front',
      ],
      opportunities: [
        'A mobile-first table that loads in a thumb on the road',
        'Own the Höfn-langoustine association on the menu and hero',
        'Reservations + hours that capture passing trade',
      ],
    },
    positioning:
      'The dependable, warm corner of Höfn — langoustine, coffee and a glacier view. The site should be the easiest table to find and book from the road.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Kaffi Hornið',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús og ferðaþjónustu.

Kaffi Hornið hefur verið fastur punktur á Höfn frá 1999 og humarinn ykkar er rómaður. Núverandi vefsíða er hins vegar orðin nokkuð gömul, hún er enn merkt árinu 2018 og virkar illa í síma, en það er einmitt þar sem flestir ferðamenn fletta ykkur upp á leiðinni.

Ég ákvað því að hanna frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Áherslan er á einfaldan og hraðan vef sem sýnir matseðilinn, opnunartíma og humarinn, og gerir gestum auðvelt að finna ykkur og bóka borð. Ef ykkur líst vel á þetta væri gaman að heyra í ykkur, en annars er engin pressa.

${SIGN}`,
    },
  },
  {
    slug: 'seakayak',
    route: '/preview/seakayak',
    name: 'Sea Kayak Iceland',
    sector: 'Sea-kayaking tours',
    location: 'Stokkseyri, South Iceland',
    region: 'South',
    established: 'Since 1995',
    currentUrl: 'https://www.kajak.is',
    ownerEmail: 'kayakferdir@gmail.com',
    concept: 'Still Water',
    conceptTagline: 'Thirty years on glassy water, minutes from Reykjavík — calm, capable, booked in two taps.',
    accent: '#1f93b0',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1572125675722-238a4f1f4ea2?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        '30 years operating; #1 activity in Stokkseyri (TripAdvisor 4.8)',
        'Minutes from Reykjavík and the south-coast corridor',
        'A calm-water experience suited to first-timers and families',
      ],
      weaknesses: [
        'Dated, desktop-oriented WordPress template',
        'Weak booking flow; a Gmail contact despite owning the domain',
        'Trips and safety record under-sold; little conversion focus',
      ],
      opportunities: [
        'A conversion-first site: trips, real availability, instant booking',
        'Lead with 30 years + safety to win nervous first-timers',
        'Position as the easy half-day add-on to any south-coast plan',
      ],
    },
    positioning:
      'The calm, expert way onto Icelandic water — thirty years of it, a short drive from the capital. The site should build trust fast and make booking frictionless.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Kayakferðir',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Þið hafið boðið upp á kajakferðir frá Stokkseyri í þrjá áratugi og umsagnirnar eru frábærar. Núverandi vefsíða nýtir hins vegar hvorki alla þá reynslu né traustið sem þið hafið áunnið ykkur, og bókunarferlið mætti vera mun einfaldara.

Ég hannaði því frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Áherslan er á að byggja traust strax, með þrjátíu ára reynslu og öryggi í forgrunni, og að gera gestum auðvelt að bóka ferð á örfáum sekúndum. Það á sérstaklega við um þá sem eru á leið um Suðurströndina. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars er það líka allt í lagi.

${SIGN}`,
    },
  },
]

export function getPreviewCompany(slug: string): PreviewCompany {
  const c = PREVIEW_COMPANIES.find((x) => x.slug === slug)
  if (!c) throw new Error(`Unknown preview slug: ${slug}`)
  return c
}
