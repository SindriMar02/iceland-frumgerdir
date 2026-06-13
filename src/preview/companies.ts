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
      subject: 'Rjómabúið Erpsstaðir — frumgerð að nýrri vefsíðu',
      body: `Góðan dag,

Sindri heiti ég og hanna vefsíður fyrir íslensk matvæla- og ferðaþjónustufyrirtæki.

Ég er mikill aðdáandi þess sem þið gerið á Erpsstöðum — ekta býli, alvöru ís og „Kjaftæði“ sem fólk keyrir út af leiðinni fyrir. Það eina sem vantar er vefur sem gerir vörunni og staðnum sömu skil; eins og er er aðeins stutt myndbandsforsíða og engar upplýsingar um opnun, verð eða hvað er í boði hverju sinni.

Ég tók mig því til og hannaði frumgerð að nýrri forsíðu — ykkur að kostnaðarlausu og án skuldbindingar.

Hún er hér og virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld: að ferðafólk finni ykkur, viti hvenær er opið og fái vatn í munninn áður en það kemur. Ef ykkur líst vel á gæti ég klárað vefinn í heild. Ef ekki, vona ég samt að þetta veiti smá innblástur.

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
      subject: 'Tjöruhúsið — frumgerð að nýrri vefsíðu',
      body: `Góðan dag,

Sindri heiti ég og hanna vefsíður fyrir íslensk veitinga- og ferðaþjónustufyrirtæki.

Ég verð að viðurkenna að ég er hrifinn af Tjöruhúsinu — andrúmsloftið í gamla húsinu og fiskhlaðborðið eru í sérflokki, og umsagnirnar tala sínu máli. Núverandi vefsíða nær hins vegar ekki að miðla neinu af þessu; hún er bara ein textasíða. Ég skil vel að markaðssetning sé ekki ástríða ykkar — þess vegna gerði ég þetta sjálfur.

Ég hannaði frumgerð að nýrri forsíðu, ykkur að kostnaðarlausu og án nokkurrar skuldbindingar.

Hún er hér og virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Markmiðið er að gestir finni stemninguna áður en þeir koma — og eigi auðvelt með að bóka borð. Ef ykkur líst vel væri gaman að heyra í ykkur. Ef ekki er það að sjálfsögðu allt í lagi.

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
      subject: 'Ektafiskur — frumgerð að nýrri vefsíðu',
      body: `Góðan dag,

Sindri heiti ég og hanna vefsíður fyrir íslensk matvæla- og ferðaþjónustufyrirtæki.

Saga Ektafisks frá 1940 er nokkuð sem fá fyrirtæki geta státað af — handsaltaður fiskur, vefverslun og Baccalá Bar á sama stað. Mér fannst núverandi vefsíða ekki gera þessari arfleifð né vörunni nógu hátt undir höfði; hún er heldur þung og dagsett, og vefverslunin mætti vera einfaldari.

Ég hannaði því frumgerð að nýrri forsíðu, ykkur að kostnaðarlausu og án skuldbindingar.

Hún er hér og virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að láta 80 ára söguna njóta sín, gera vefverslunina lipra og kynna Baccalá Bar betur. Ef ykkur líst vel á stefnuna gæti ég klárað vefinn. Ef ekki er það að sjálfsögðu í góðu.

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
      subject: 'Kaffi Hornið — frumgerð að nýrri vefsíðu',
      body: `Góðan dag,

Sindri heiti ég og hanna vefsíður fyrir íslensk veitinga- og ferðaþjónustufyrirtæki.

Kaffi Hornið hefur verið fastur punktur á Höfn frá 1999 og humarinn ykkar er rómaður — en núverandi vefsíða er því miður dagsett (enn merkt 2018) og virkar illa í síma, þar sem flestir ferðamenn fletta ykkur upp á leiðinni.

Ég tók mig til og hannaði frumgerð að nýrri forsíðu, ykkur að kostnaðarlausu og án skuldbindingar.

Hún er hér og virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Áherslan er á einfaldan, hraðan vef sem sýnir matseðilinn, opnunartíma og humarinn — og gerir gestum auðvelt að finna ykkur og bóka borð. Ef ykkur líst vel væri gaman að heyra í ykkur. Annars, engin pressa.

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
      subject: 'Sea Kayak Iceland — frumgerð að nýrri vefsíðu',
      body: `Góðan dag,

Sindri heiti ég og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Þið hafið boðið upp á kajakferðir frá Stokkseyri í þrjá áratugi og umsagnirnar eru frábærar — en núverandi vefsíða nýtir hvorki reynsluna né traustið sem þið hafið áunnið ykkur, og bókunarferlið mætti vera mun einfaldara.

Ég hannaði frumgerð að nýrri forsíðu, ykkur að kostnaðarlausu og án nokkurrar skuldbindingar.

Hún er hér og virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Áherslan er á að byggja traust strax (30 ár, öryggi) og gera gestum auðvelt að bóka ferð á örfáum sekúndum — sérstaklega þeim sem eru á leið um Suðurströndina. Ef ykkur líst vel á gæti ég klárað vefinn. Annars er það líka allt í lagi.

${SIGN}`,
    },
  },
]

export function getPreviewCompany(slug: string): PreviewCompany {
  const c = PREVIEW_COMPANIES.find((x) => x.slug === slug)
  if (!c) throw new Error(`Unknown preview slug: ${slug}`)
  return c
}
