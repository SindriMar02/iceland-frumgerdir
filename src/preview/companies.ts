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
  /**
   * True when `currentUrl` is a third-party OTA/aggregator listing rather than
   * a site the company actually owns/controls (e.g. a Booking.com hotel page).
   * Changes the shared footer's wording so it never calls that link the
   * company's "current website" — see [[feedback-fact-check-before-drafting]].
   */
  noOwnSite?: boolean
  /**
   * Set when this page's photos are the company's own real photography
   * (not Unsplash stock) — suppresses the generic "Myndir frá Unsplash"
   * footer line in favor of the page's own accurate photo-source disclosure.
   */
  ownPhotography?: boolean
  /**
   * Overrides the noun-phrase the footer uses for `currentUrl` when
   * `noOwnSite` is set. Defaults to "Núverandi bókunarsíða (ekki í eigu
   * fyrirtækisins)" — correct for an OTA listing (Booking.com), but wrong
   * for e.g. a business's own Facebook page. See [[feedback-fact-check-before-drafting]].
   */
  currentLabel?: string
  /**
   * Overrides the footer's photo-provenance sentence entirely, for the rare
   * page whose real mix (news photos, Wikimedia, etc.) matches neither the
   * generic Unsplash line nor `ownPhotography`.
   */
  photoCredit?: string
}

const SIGN = `Bestu kveðjur,
Sindri Már
845 1758`

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
  {
    slug: 'weider',
    route: '/preview/weider',
    name: 'Weider',
    sector: 'Sports nutrition e-commerce',
    location: 'Kópavogur (Aura ehf)',
    region: 'Capital region',
    established: 'Weider síðan 1936',
    currentUrl: 'https://www.weider.is',
    ownerEmail: 'weidervorur@gmail.com',
    concept: 'The Engine Room',
    conceptTagline:
      'Heritage performance-nutrition storefront — Weider black-and-red, engineered for trust and conversion.',
    accent: '#e11d48',
    dark: true,
    status: 'Concept ready',
    thumb:
      'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Strong global brand (Weider, “síðan 1936”) with real heritage and trust',
        'Broad range of genuine Weider Germany products, in Icelandic and ISK',
        'Clear audience: gym-goers and health-minded Icelanders, growing market',
      ],
      weaknesses: [
        'Default Shopify “Dawn” theme with a “Powered by Shopify” footer — looks templated',
        'No brand story; the /um-okkur page 404s and the homepage is just the tagline',
        'Weak trust: no reviews, a buried Gmail contact, mixed German/English product data',
      ],
      opportunities: [
        'Build instant trust with heritage, reviews and a clear shipping promise',
        'Guide buyers to the right product by goal (muscle, energy, recovery, health)',
        'A premium storefront that turns browsing into checkout',
      ],
    },
    positioning:
      'Iceland’s home of Weider — heritage performance nutrition since 1936. The site should build instant trust, make the range effortless to navigate by goal, and turn browsers into buyers.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Weider',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Weider er sterkt vörumerki með langa sögu og frábærar vörur, og mér fannst núverandi vefverslun ekki gera því nógu hátt undir höfði. Hún byggir á stöðluðu sniðmáti og nær hvorki að segja sögu vörumerkisins né leiða viðskiptavini á einfaldan hátt að réttu vörunni.

Ég settist því niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að byggja strax upp traust, gera vöruflokkana skýra og leiða fólk hratt að réttu vörunni eftir markmiði. Ef ykkur líst vel á stefnuna gæti ég klárað vefinn í heild, en annars vona ég samt að þetta veiti ykkur smá innblástur.

${SIGN}`,
    },
  },

  /* ── Batch 3 — five new redesigns (combined-showcase build) ──────────────
   * Diversified across five sectors and five regions. Each is real, active,
   * owner-run, has a genuinely weak/dated/absent website, and strong visual
   * potential. Weider stays excluded from the public showcase. */

  {
    // WHY: East Iceland craft brewery with NO website at all (pure greenfield) —
    // the clearest possible before/after. OPPORTUNITY: tell the place-and-product
    // story; every beer is named after an Austurland landmark. CUSTOMER: locals,
    // beer travellers and visitors looking to taste or find Austri on tap.
    slug: 'austri',
    route: '/preview/austri',
    name: 'Austri Brugghús',
    sector: 'Craft brewery',
    location: 'Egilsstaðir, East Iceland',
    region: 'East',
    established: 'Síðan 2015',
    currentUrl: 'https://www.instagram.com/austribrugghus',
    ownerEmail: '',
    concept: 'Fjallabjór',
    conceptTagline: 'East Iceland in a glass — beers named after the peaks, a tap list that paints the page.',
    accent: '#c8772b',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1546622891-02c72c1537b6?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A genuine East Iceland craft brewery with a strong local following',
        'Every beer named after an Austurland landmark — a ready-made story',
        'On tap locally (Askur taproom, Vök Baths); local ingredients (Vallanes barley)',
      ],
      weaknesses: [
        'No website at all — only a third-party directory listing and social pages',
        'Nowhere online to learn the story, see the beers, or find where to taste them',
        'The whole brand identity lives on other platforms it does not control',
      ],
      opportunities: [
        'A first real home for the brand — story, beer list and where-to-find',
        'Turn “beers named after the mountains” into the signature experience',
        'Point visitors to the taproom and stockists; build the East Iceland identity',
      ],
    },
    positioning:
      'East Iceland’s brewery, with no website to tell any of it. The site should make the place-and-beer story unmissable and send people to where they can taste it.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Austra Brugghús',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Mér finnst frábært það sem þið eruð að gera á Austurlandi, ekki síst að nefna bjórana eftir fjöllunum og kennileitunum í kring. Það eina sem ég fann ekki var vefsíða þar sem hægt er að kynnast sögunni, sjá bjórana og finna hvar má smakka þá.

Ég settist því niður og hannaði frumgerð að forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að gefa Austra loksins almennilegt heimili á netinu, segja söguna á bak við hvern bjór og vísa fólki á kranann. Ef ykkur líst vel á þetta heyri ég glaður meira, en annars vona ég að þetta veiti ykkur innblástur.

${SIGN}`,
    },
  },

  {
    // WHY: a small geothermal bath with rare naturally GREEN carbonated mineral
    // water, on a farm under Snæfellsjökull; dated WordPress, no booking.
    // OPPORTUNITY: the "green healing spring" story + a clear plan-a-visit flow.
    // CUSTOMER: Snæfellsnes travellers and wellness-seekers planning a stop.
    slug: 'lysulaugar',
    route: '/preview/lysulaugar',
    name: 'Lýsulaugar',
    sector: 'Geothermal nature bath',
    location: 'Lýsuhóll, Snæfellsnes',
    region: 'West',
    established: 'Laug síðan 1981',
    currentUrl: 'https://lysulaugar.is',
    ownerEmail: 'lysulaugar@snb.is',
    concept: 'Græna lindin',
    conceptTagline: 'The rare green mineral spring under Snæfellsjökull — calm, healing, slow.',
    accent: '#2f8f63',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1508869184489-1b42faa950b0?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A genuinely rare hook: naturally carbonated, green mineral/algae water',
        'On a working farm under Snæfellsjökull — strong Snæfellsnes location',
        'Long history and a loyal following among travellers seeking quieter baths',
      ],
      weaknesses: [
        'Dated mid-2010s site, cluttered hierarchy, weak on mobile',
        'No online booking and the opening season/hours are easy to miss',
        'The remarkable green water is never really conveyed',
      ],
      opportunities: [
        'Lead with the green mineral water — the thing nowhere else has',
        'Make the season, hours and how-to-find effortless to read',
        'A calm, wellness-led visit page that converts passing Snæfellsnes traffic',
      ],
    },
    positioning:
      'The calm, green alternative to Iceland’s crowded baths — mineral water on a farm under the glacier. The site should feel restorative and make a visit easy to plan.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Lýsulaugar',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Lýsulaugar eru sérstakar, enda er græna steinefnavatnið ykkar eitthvað sem finnst varla annars staðar. Mér fannst núverandi vefsíða ekki ná að fanga þá upplifun, og opnunartímann og leiðina til ykkar mætti gera skýrari.

Ég ákvað því að hanna frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Áherslan er á að láta vatnið og umhverfið njóta sín og gera gestum auðvelt að sjá hvenær er opið og hvernig á að finna ykkur. Ef ykkur líst vel á þetta væri gaman að heyra í ykkur, en annars er það að sjálfsögðu allt í lagi.

${SIGN}`,
    },
  },

  {
    // WHY: botanist/natural-dyer making plant-dyed Icelandic wool; thin WP site
    // that pushes sales out to Etsy. OPPORTUNITY: a colour-led brand where the
    // palette IS the natural dyes, plus a proper webshop. CUSTOMER: knitters and
    // craft buyers (incl. abroad) and visitors to the studio.
    slug: 'hespa',
    route: '/preview/hespa',
    name: 'Hespa',
    sector: 'Plant-dyed Icelandic wool',
    location: 'Ölfus, South Iceland',
    region: 'South',
    established: 'Jurtalituð íslensk ull',
    currentUrl: 'https://hespa.is',
    ownerEmail: 'hespa@hespa.is',
    concept: 'Litir landsins',
    conceptTagline: 'Plant-dyed Icelandic wool — the palette comes from the land itself.',
    accent: '#a8492c',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1777929746858-45bbe0134e88?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A named maker with real authority (botanist and natural dyer)',
        'A beautiful, photogenic product — yarn dyed with Icelandic plants',
        'An open studio and a following among knitters at home and abroad',
      ],
      weaknesses: [
        'Thin WordPress site; the rich craft story is barely told',
        'Sales pushed out to an external Etsy shop — no real on-site webshop',
        'The colours, the heart of the brand, are not given centre stage',
      ],
      opportunities: [
        'Build the brand around the natural-dye colour palette itself',
        'A proper Icelandic webshop so buying does not leave the site',
        'Tell the dyeing story and invite visitors to the studio',
      ],
    },
    positioning:
      'Icelandic wool whose colours come straight from the land — a maker’s brand, not a marketplace listing. The site should sell the colour and the craft and keep the sale on-site.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Hespu',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki og handverksfólk.

Jurtalitaða ullin ykkar er einstaklega falleg og litirnir úr íslenskri náttúru eru saga út af fyrir sig. Mér fannst núverandi vefsíða ekki gera þeim nógu hátt undir höfði, og það er synd að salan fari fram annars staðar en á ykkar eigin síðu.

Ég settist því niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að byggja útlitið í kringum litina sjálfa, segja söguna á bak við litunina og gera fólki auðvelt að versla beint hjá ykkur. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur innblástur.

${SIGN}`,
    },
  },

  {
    // WHY: a lava-field smokehouse and farm shop at Mývatn with an early-2000s
    // site (the weakest found) and a wonderful farm-to-table story. OPPORTUNITY:
    // the smoke/lava/lake story + simple ordering. CUSTOMER: Mývatn-area visitors
    // and Icelanders ordering smoked produce.
    slug: 'reykkofinn',
    route: '/preview/reykkofinn',
    name: 'Reykkofinn',
    sector: 'Smokehouse & farm shop',
    location: 'Hella, Mývatnssveit',
    region: 'North',
    established: 'Reykt sveitaafurðir',
    currentUrl: 'https://www.hangikjot.is',
    ownerEmail: 'hella@hangikjot.is',
    concept: 'Reykur úr hrauninu',
    conceptTagline: 'A lava-field smokehouse — wild Mývatn char, birch smoke, a farm shop.',
    accent: '#b5651d',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1763062550082-2c9f94096abb?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A real farm smokehouse in the lava by Lake Mývatn — strong provenance',
        'Wild Arctic char and traditional birch smoking; a working farm shop',
        'Sits in one of Iceland’s most-visited regions (Mývatn)',
      ],
      weaknesses: [
        'Early-2000s, table-based site with a single low-quality photo',
        'No mobile layout; the farm-to-table story is not told at all',
        'Ordering is a bare link rather than a real shop experience',
      ],
      opportunities: [
        'Tell the smoke-and-lava story with proper photography',
        'A simple ordering/visit flow for the farm shop',
        'Capture Mývatn route traffic with a clear, modern page',
      ],
    },
    positioning:
      'A lava-field smokehouse with a story most producers would envy — and a site that tells none of it. The redesign should make the provenance mouth-watering and the visit or order simple.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Reykkofann',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk matvælafyrirtæki og sveitabúðir.

Sagan ykkar er frábær, reykkofi í hrauninu og silungur úr Mývatni er einmitt það sem fólk vill heyra. Mér fannst núverandi vefsíða ekki ná að segja þá sögu, enda er hún orðin nokkuð gömul og virkar illa í síma.

Ég ákvað því að hanna frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að láta hráefnið og reykinn njóta sín og gera fólki auðvelt að panta eða koma við í sveitabúðinni. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars er það líka allt í lagi.

${SIGN}`,
    },
  },

  {
    // WHY: a beloved Westfjords folklore/witchcraft museum (runic staves, witch-
    // trial history) with a dated site and no online ticketing. OPPORTUNITY: dark,
    // cinematic heritage storytelling + a clear visit/ticket path. CUSTOMER:
    // travellers in the Westfjords and folklore/culture enthusiasts.
    slug: 'galdrasyning',
    route: '/preview/galdrasyning',
    name: 'Galdrasýning á Ströndum',
    sector: 'Folklore museum',
    location: 'Hólmavík, Strandir',
    region: 'Westfjords',
    established: 'Síðan 2000',
    currentUrl: 'https://www.galdrasyning.is',
    ownerEmail: 'galdrasyning@holmavik.is',
    concept: 'Galdrastafir',
    conceptTagline: 'Strandir folk-magic told in candlelight and carved staves.',
    accent: '#b08a34',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A genuinely unique subject — Strandir folk magic and witch-trial history',
        'An established destination with strong reviews and guidebook coverage',
        'A café (Kaffi Galdur) and bookshop alongside the exhibition',
      ],
      weaknesses: [
        'Dated early-2010s site; mobile is an afterthought',
        'No online ticketing — conversion is left on the table for a remote stop',
        'The atmosphere that makes it special is missing from the site',
      ],
      opportunities: [
        'Lean into the dark, atmospheric folklore — a mood the subject deserves',
        'Make opening hours, the two sites and tickets effortless to find',
        'Turn a quirky museum into a must-stop on the Strandir route',
      ],
    },
    positioning:
      'The keeper of Strandir’s folk-magic story — a museum whose atmosphere never reaches its website. The redesign should feel like stepping into the dark, and make the visit easy to plan.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Galdrasýningu á Ströndum',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk söfn og ferðaþjónustu.

Galdrasýningin er einstök, enda á sér fátt sinn líka í íslenskri sögu og þjóðtrú. Mér fannst núverandi vefsíða ekki fanga þá stemningu sem býr í sýningunni, og það vantaði einfalda leið til að sjá opnunartíma og kaupa miða.

Ég settist því niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að láta dulúðina og söguna njóta sín og gera gestum auðvelt að finna ykkur og skipuleggja heimsókn. Ef ykkur líst vel á þetta væri gaman að heyra í ykkur, en annars er engin pressa.

${SIGN}`,
    },
  },

  /* ----------------------------------------------------------------- */
  /* Batch 4 — five new independent redesigns (each its own direction). */
  /* ----------------------------------------------------------------- */
  {
    slug: 'saudarkroksbakari',
    route: '/preview/saudarkroksbakari',
    name: 'Sauðárkróksbakarí',
    sector: 'Heritage bakery',
    location: 'Sauðárkrókur, Skagafjörður',
    region: 'North',
    established: 'Síðan 1880',
    currentUrl: 'https://www.saudarkroksbakari.net',
    ownerEmail: 'saudarkroksbakari@gmail.com',
    concept: 'Bakað síðan 1880',
    conceptTagline: 'A 140-year town bakery as a warm dawn-to-day broadsheet — the ovens are still lit.',
    accent: '#b06a2c',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Eitt elsta bakarí landsins, bakað á sama stað við Aðalgötu síðan 1880',
        'Sterkar umsagnir og Travelers’ Choice á Tripadvisor (4,7 stjörnur)',
        'Hjarta gamla bæjarins á Sauðárkróki og fast stopp ferðafólks',
      ],
      weaknesses: [
        'Lénið saudarkroksbakari.net er útrunnið og vísar nú á erlenda sölusíðu',
        'Engin virk vefsíða: enginn matseðill, opnunartími, kort eða sími sem virkar',
        '140 ára sagan og sterku umsagnirnar hvergi kynntar',
      ],
      opportunities: [
        'Ná aftur sýnileika með opnunartíma, korti og síma sem hægt er að ýta á',
        'Segja 140 ára söguna sem enginn stórmarkaður á',
        'Hröð forsíða í síma fyrir ferðafólk í Skagafirði',
      ],
    },
    positioning:
      'Eitt elsta bakarí Íslands, nánast ósýnilegt á netinu eftir að lénið rann út. Frumgerðin á að koma því aftur á kortið og láta 140 ára söguna njóta sín.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Sauðárkróksbakarí',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Sauðárkróksbakarí er eitt elsta bakarí landsins og sú saga á sér fáa líka. Þegar ég ætlaði að skoða vefsíðuna ykkar tók ég eftir að lénið saudarkroksbakari.net er ekki lengur virkt, svo gestir sem leita að ykkur eða smella á hlekk frá Tripadvisor lenda á annarri síðu. Það getur kostað ykkur heimsóknir á hverjum degi.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu sem sýnir söguna, opnunartíma, vörurnar og hvar ykkur er að finna. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta getum við spjallað og fundið sanngjarnt verð. Ef ekki er ekkert mál, og ég vona að þetta veiti ykkur smá innblástur.

${SIGN}`,
    },
  },
  {
    slug: 'reykjavikdistillery',
    route: '/preview/reykjavikdistillery',
    name: '64° Reykjavik Distillery',
    sector: 'Craft distillery',
    location: 'Hafnarfjörður',
    region: 'Capital',
    established: 'Síðan 2009',
    currentUrl: 'https://reykjavikdistillery.is',
    ownerEmail: 'info@reykjavikdistillery.is',
    concept: 'Frá villtu í glas',
    conceptTagline: 'A dark, cinematic spirits-house: a Lenis scroll descends from wild Icelandic highland through the copper still into the real bottles.',
    accent: '#c8881e',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1514218953589-2d7d37efd2dc?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Fjölskyldurekið örbrugghús frá 2009, fyrsta sinnar tegundar á Íslandi',
        'Sterk saga: jurtir tíndar í íslenskri náttúru, frá villtu í glas',
        'Selt á 60+ stöðum, í Fríhöfninni og um borð hjá Icelandair og Play',
      ],
      weaknesses: [
        'Engin verð og engin bein leið til að kaupa vörurnar',
        'Tæknilega úrelt (PHP 7.0), enginn H1, engin lýsigögn, læstur aðdráttur í síma',
        'Bragðlýsingar, styrkur og flöskustærðir vantar á vörurnar',
      ],
      opportunities: [
        'Setja vörurnar, bragðið og verðið í forgrunn með skýrri kaupleið',
        'Segja jurtasöguna (64° = breiddargráða Reykjavíkur) sem fáir keppa við',
        'Opna á heimsóknir og smakk í brugghúsinu í Hafnarfirði',
      ],
    },
    positioning:
      'Verðlaunavert íslenskt handverk sem felur sína bestu sögu. Frumgerðin er kvikmyndaleg ferð frá villtri náttúru í glas sem setur eimingarnar, bragðið og kaupin í forgrunn.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir 64° Reykjavik Distillery',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Það sem þið gerið hjá 64° Reykjavik Distillery er fallegt handverk, íslenskar jurtir tíndar í náttúrunni og settar í flösku. Þegar ég skoðaði vefsíðuna tók ég eftir að hvergi sjást verð á vörunum og engin bein leið er til að kaupa þær, sem getur orðið til þess að áhugasamir gestir hætta við áður en þeir komast lengra.

Mér fannst sagan og vörurnar eiga skilið betri umgjörð, svo ég hannaði frumgerð að nýrri vefsíðu sem setur jurtirnar og bragðið í forgrunn. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  },
  {
    slug: 'beffatours',
    route: '/preview/beffatours',
    name: 'Beffa Tours',
    sector: 'Whale watching',
    location: 'Bíldudalur, Arnarfjörður',
    region: 'Westfjords',
    established: 'Síðan 2018',
    currentUrl: 'https://beffatours.is',
    ownerEmail: 'info@harbourinn.is',
    concept: 'Sjö sæti á Arnarfirði',
    conceptTagline: 'Just seven guests on a 9-metre boat under the Westfjords Alps — stillness as the product.',
    accent: '#2c6b80',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Náin upplifun: einn 9 metra bátur, mest sjö gestir í einu',
        'Arnarfjörður undir Vestfjarðaölpunum, hnúfubakar algengastir',
        'Fjölskyldurekið frá 2018, heimamenn sem þekkja fjörðinn',
      ],
      weaknesses: [
        'Engin netbókun og engin verð, aðeins tölvupóstur',
        'Tölvupóstur fer á annað fyrirtæki (harbourinn.is) og einkanetfang',
        'Tvítekinn titill, ekkert sitemap og lítið efni fyrir leitarvélar',
      ],
      opportunities: [
        'Bein bókun með dagsetningu og sætum sýndum (sjö sæti = eftirsókn)',
        'Segja söguna um nándina sem stóru bátarnir geta ekki boðið',
        'Skýr verð, brottfarir og hvað fylgir, fyrir farsímann',
      ],
    },
    positioning:
      'Sjaldgæf, náin hvalaskoðun sem tapar bókunum í tölvupóstshlekk. Frumgerðin selur kyrrðina og gerir bókun á sæti einfalda.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Beffa Tours',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska ferðaþjónustu.

Beffa Tours býður upp á eitthvað sjaldgæft, hvalaskoðun á Arnarfirði með aðeins sjö gestum í einu. Þegar ég skoðaði vefsíðuna tók ég eftir að ekki er hægt að bóka ferð beint og verð koma hvergi fram, svo gestir sem vilja bóka utan opnunartíma eða erlendis frá leita oft annað þar sem svarið fæst strax.

Mér fannst upplifunin eiga skilið sterkari umgjörð, svo ég hannaði frumgerð að nýrri vefsíðu sem kynnir ferðina og gerir bókun einfalda. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta getum við talað um sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  },
  {
    slug: 'kogga',
    route: '/preview/kogga',
    name: 'Kogga',
    sector: 'Ceramic studio & gallery',
    location: 'Vesturgata 5, Reykjavík',
    region: 'Capital',
    established: 'Í 40 ár',
    currentUrl: 'https://www.kogga.is',
    ownerEmail: 'kogga@kogga.is',
    concept: 'Innlegg',
    conceptTagline: 'A 40-year studio built on inlaid porcelain — fragments that assemble into form.',
    accent: '#8f3b2e',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Kolbrún Björgólfsdóttir, fjörutíu ára ferill og eigin innlagstækni',
        'Rauða húsið við Vesturgötu 5, vinnustofa og galarí undir sama þaki',
        'Einstök verk sem sameina postulín og steinleir, innblásin af landinu',
      ],
      weaknesses: [
        'Engin verð sjást þegar flett er verkunum, engin stærð eða saga',
        'Engir opnunartímar, ekkert kort og engin lýsigögn',
        'Útlit óbreytt frá 2016, stendur ekki undir gæðum verkanna',
      ],
      opportunities: [
        'Sýna verkin eins og á safni, með verði, stærð og sögu hvers stykkis',
        'Bjóða heimsókn í vinnustofuna með opnunartíma og korti',
        'Segja söguna á bak við innlagstæknina sem fólk man eftir',
      ],
    },
    positioning:
      'Keramík í safngæðaflokki seld á síðu sem felur verðið og söguna. Frumgerðin setur verkin á stall og gerir bæði kaup og heimsókn einföld.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Koggu',
      body: `Sæl Kolbrún,

Ég heiti Sindri og hanna vefsíður fyrir íslenskt handverk og listafólk.

Keramíkverkin þín og innlagstæknin sem þú hefur þróað í fjörutíu ár eru einstök, og rauða húsið við Vesturgötu er staður sem fólk man eftir. Þegar ég skoðaði vefsíðuna tók ég eftir að gestir sjá ekki verð þegar þeir fletta verkunum og opnunartímar koma hvergi fram, sem getur valdið því að áhugasamir kaupendur og gestir gefist upp.

Mér fannst verkin eiga skilið umgjörð í sínum gæðaflokki, svo ég hannaði frumgerð að nýrri vefsíðu þar sem verkin og sagan fá að njóta sín. Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef þér líst vel á þetta getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  },
  {
    slug: 'haafell',
    route: '/preview/haafell',
    name: 'Háafell Geitfjársetur',
    sector: 'Goat farm & conservation',
    location: 'Hvítársíða, Borgarfjörður',
    region: 'West',
    established: 'Síðan 1989',
    currentUrl: 'https://www.geitur.is',
    ownerEmail: 'geitur@geitur.is',
    concept: 'Síðasta hjörðin',
    conceptTagline: 'The only Icelandic goat farm, telling a 1,100-year breed back from the brink.',
    accent: '#5f7138',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Eina geitfjársetrið á Íslandi, lykilbýli í björgun íslensku geitarinnar',
        'Sterk saga: forn stofn frá landnámi sem stóð frammi fyrir útrýmingu',
        'Heimsóknir, geitaafurðir og einlæg saga sem fólk tengir við',
      ],
      weaknesses: [
        'Aðeins á íslensku, engin enska fyrir erlenda gesti',
        'Pöntunarhlekkur á vörur virkar ekki, enginn H1 og engin lýsigögn',
        'Þrjár tómar síður í sitemap og rangur bær í titli (Borgarnes)',
      ],
      opportunities: [
        'Tvítyngd síða (íslenska og enska) fyrir ferðafólk á Vesturlandi',
        'Segja verndunarsöguna sterkt og sýna opnunartíma, verð og kort',
        'Eigin vöruhluti í stað brotins pöntunarhlekks',
      ],
    },
    positioning:
      'Ótrúleg verndunarsaga sem síðan kemur ekki til skila. Frumgerðin segir söguna á tveimur tungumálum og gerir heimsókn og kaup auðveld.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Háafell Geitfjársetur',
      body: `Sæl Jóhanna,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki og ferðamannastaði.

Háafell er einstakur staður, eina geitfjársetrið á landinu og saga íslensku geitarinnar sem þið hafið bjargað frá útrýmingu. Þegar ég skoðaði vefsíðuna tók ég eftir að hún er aðeins á íslensku og að hlekkurinn til að panta vörur virkar ekki, svo erlendir gestir og þeir sem vilja versla komast ekki alla leið.

Mér fannst sagan ykkar eiga skilið að heyrast, svo ég hannaði frumgerð að nýrri vefsíðu á íslensku og ensku sem segir söguna, sýnir opnunartíma og verð og gerir heimsókn auðvelda. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta getum við talað um sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  },
  {
    slug: 'polarhestar',
    route: '/preview/polarhestar',
    name: 'Pólar Hestar',
    sector: 'Horse-riding tours',
    location: 'Grenivík, Eyjafjörður',
    region: 'North',
    established: 'Síðan 1985',
    currentUrl: 'https://www.polarhestar.is',
    ownerEmail: 'polarhestar@polarhestar.is',
    concept: 'Þar sem hestar og álfar hittast',
    conceptTagline:
      'A luminous North-Iceland riding world along the longest fjord — folklore, the herd, and the changing northern light, with booking made simple.',
    accent: '#a9572f',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1575137224377-9af9b69676cb?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Fjölskyldurekið í 40 ár, um 160 íslensk hross og ferðir fyrir öll getustig',
        'Frábært orðspor: 4,9 stjörnur og Travelers’ Choice á Tripadvisor (263 umsagnir)',
        'Einstök staðsetning á Grýtubakka við Eyjafjörð, lengsta fjörð landsins',
      ],
      weaknesses: [
        'Engin netbókun, aðeins tölvupóstur og sími',
        'Tvö ólík símanúmer á síðunni og verð hvergi sýnd',
        'Gamalt útlit (Stefna Moya) með skjámyndum í stað alvöru ljósmynda',
      ],
      opportunities: [
        'Bein bókun á reiðtúr með dagsetningu, fjölda knapa og verði',
        'Sýna 40 ára söguna og norðlensku birtuna með alvöru myndum',
        'Eitt rétt símanúmer og skýr verð, hannað fyrir farsímann',
      ],
    },
    positioning:
      'Rótgróin hestaferðaþjónusta með frábært orðspor sem tapar bókunum því hvorki er hægt að bóka né sjá verð á netinu. Frumgerðin selur kyrrðina og norðlensku birtuna og gerir bókun á reiðtúr einfalda.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Pólar Hesta',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska ferðaþjónustu.

Þið hafið boðið upp á hestaferðir á Grýtubakka í fjörutíu ár og orðsporið er frábært, enda skína umsagnirnar á Tripadvisor. Þegar ég skoðaði vefsíðuna tók ég samt eftir að ekki er hægt að bóka ferð beint og verð koma hvergi fram, svo gestir sem vilja bóka strax eða erlendis frá leita oft annað.

Mér fannst upplifunin og staðurinn eiga skilið sterkari umgjörð, svo ég hannaði frumgerð að nýrri vefsíðu sem sýnir ferðirnar, norðlensku birtuna og gerir bókun einfalda. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  },
  {
    slug: 'eyjatours',
    route: '/preview/eyjatours',
    name: 'Eyjatours',
    sector: 'Puffin & volcano boat tours',
    location: 'Heimaey, Vestmannaeyjar',
    region: 'South',
    established: 'Est. ~2012',
    currentUrl: 'https://www.eyjatours.com',
    ownerEmail: 'eyjatours@eyjatours.is',
    concept: 'Puffins & Fire',
    conceptTagline:
      'A cinematic island world — the world’s great puffin colony, the volcano that nearly won in 1973, and one local guide.',
    accent: '#E5573E',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1612564148954-59545876eaa0?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Top-rated puffin and volcano tours, a charismatic local guide (Ebbi)',
        'A genuinely world-class story: a million puffins and the 1973 Eldfell eruption',
        'A short ferry from the mainland, in easy reach of the south-coast route',
      ],
      weaknesses: [
        'No real online booking, only a static "Book Now" link and email',
        'Duplicated navigation and a broken footer year, with no prices anywhere',
        'Low-resolution graphics and grunge overlays undercut a stunning subject',
      ],
      opportunities: [
        'A clean booking request flow (tour, date, guests, live price) on the page',
        'Let the puffins, the eruption and the archipelago carry the design',
        'One coherent brand built around their own puffin logo, fast on mobile',
      ],
    },
    positioning:
      'The number-one tour on one of the world’s great puffin islands, held back by a cluttered, booking-less site. The redesign turns the island’s story into an experience and makes booking with Ebbi effortless.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Eyjatours',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska ferðaþjónustu.

Ég kynnti mér Eyjatours og ferðirnar ykkar í Vestmannaeyjum og var virkilega hrifinn. Lundabyggðin, sagan af gosinu 1973 og þekkingin ykkar á eyjunni er nokkuð sem fáir geta boðið upp á. Þegar ég skoðaði vefsíðuna fannst mér hún samt ekki gera þessu nógu góð skil. Það er erfitt að bóka ferð beint, verð koma hvergi fram og útlitið er orðið svolítið gamaldags. Erlendir gestir sem vilja bóka strax gefast stundum upp og leita annað.

Mér fannst það synd, svo ég settist niður og gerði litla frumgerð að nýrri forsíðu, bara handa ykkur til að skoða. Þetta kostar ekki neitt og því fylgir engin skuldbinding.

Á henni er hægt að velja ferð, dagsetningu og fjölda og senda bókunarbeiðni í örfáum skrefum. Verð eru sýnileg, sagan af lundanum og gosinu er í forgrunni, það fylgir kort af eyjunum og síðan virkar vel í síma.

Hana má skoða hér hvenær sem er:
[HLEKKUR Á FRUMGERÐ]

Þetta er aðeins hugmynd og sýnishorn, en ef ykkur líst vel á gæti ég klárað vefinn í heild. Ef ekki er það að sjálfsögðu allt í lagi og engin pressa. Mér þætti samt vænt um að heyra hvað ykkur finnst.

${SIGN}`,
    },
  },
  {
    slug: 'fischersetur',
    route: '/preview/fischersetur',
    name: 'Bobby Fischer Center',
    sector: 'Chess museum',
    location: 'Selfoss, South Iceland',
    region: 'South',
    established: 'Opened 2013',
    currentUrl: 'https://www.fischersetur.is',
    ownerEmail: 'fischersetur@gmail.com',
    concept: 'Match of the Century',
    conceptTagline: 'The board is the interface — scroll-replay the 1972 Reykjavík championship in ink and bone, no stock photos.',
    accent: '#3FA7D6',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1633365087123-b3f2c305769a?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'World-famous subject — the 1972 Fischer and Spassky “Match of the Century” in Reykjavík',
        'The first chess museum in the Nordic countries',
        'Fischer is buried minutes away at Laugardælir — a real reason to stop',
      ],
      weaknesses: [
        'A free 2013 template with no mobile viewport — barely usable on a phone',
        'Live placeholder lorem-ipsum text and broken character encoding',
        'No real story, hours or map a visitor can act on',
      ],
      opportunities: [
        'Turn the 1972 match into an interactive, scrollable centrepiece',
        'Mobile-first hours, admission and map for Ring Road travellers',
        'A reverent, distinctive identity worthy of the subject',
      ],
    },
    positioning:
      'The world remembers the 1972 match; the museum that keeps it deserves a site visitors can play through. Make the chessboard the interface and the practical visit effortless.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Fischersetur',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki og söfn.

Ég hef lengi haft mikinn áhuga á sögu einvígisins 1972 og fannst frábært að sjá að það á sitt eigið safn á Selfossi. Það eina sem ég staldraði við var vefsíðan, því eins og hún er í dag opnast hún illa í síma og erfitt er að sjá opnunartíma, verð og hvar safnið er.

Mér fannst það synd fyrir svona merkilegt efni, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þar er einvígið sjálft gert að upplifun sem fólk getur spilað sig í gegnum. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta er aðeins hugmynd og sýnishorn af nokkrum köflum, en ef ykkur líst vel á gæti ég klárað vefinn í heild. Ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    slug: 'edinborg',
    route: '/preview/edinborg',
    name: 'Edinborg Bistró',
    sector: 'Harbour bistro',
    location: 'Ísafjörður, Westfjords',
    region: 'Westfjords',
    established: 'House from 1907',
    currentUrl: 'https://edinborgbistro.is',
    ownerEmail: 'bistro@edinborgbistro.is',
    concept: 'A Bistro Told in Courses',
    conceptTagline: 'The menu as the hero — a self-setting letterpress bill of fare in the 1907 harbour house; slate, ecru and oxblood.',
    accent: '#6E1F2B',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1687706418918-1c95d829b478?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Lands in the landmark 1907 Edinborg house on the Ísafjörður harbour',
        'Strong reviews across platforms (RestaurantGuru around 4.7)',
        'A real destination in the Westfjords hub',
      ],
      weaknesses: [
        'No working website at all — the domain shows a blank placeholder',
        'A visitor who finds them online gets no menu, hours or location',
        'Everything lives on Facebook, invisible to a quick search',
      ],
      opportunities: [
        'Put a real, beautiful menu on the domain they already own',
        'Clear hours, map and contact for travellers in town',
        'Tell the Edinborg-house heritage that makes the room unique',
      ],
    },
    positioning:
      'A beloved harbour bistro with no website is leaving travellers at a blank page. Give the 1907 house one elegant page where the menu itself is the experience.',
    outreach: {
      subject: 'Hugmynd að vefsíðu fyrir Edinborg Bistró',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í veitingum og ferðaþjónustu.

Ég er mikill aðdáandi þess sem þið gerið í Edinborgarhúsinu og heyri eingöngu gott af staðnum. Það eina sem ég fann ekki var vefsíða, því þegar maður leitar að ykkur á netinu birtist auð síða og hvorki matseðill, opnunartími né staðsetning.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að vefsíðu fyrir ykkur þar sem matseðillinn sjálfur er aðalatriðið og sagan af húsinu fær að njóta sín. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta er aðeins hugmynd og sýnishorn, en ef ykkur líst vel á gæti ég klárað vefinn í heild og sett hann inn á lénið sem þið eigið nú þegar.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    slug: 'brunastadir',
    route: '/preview/brunastadir',
    name: 'Brúnastaðir',
    sector: 'Farmhouse cheese',
    location: 'Fljót, Skagafjörður',
    region: 'North',
    established: 'Verðlaunabú 2025',
    currentUrl: 'https://brunastadir.is',
    ownerEmail: 'brunastadir@brunastadir.is',
    concept: 'The Rind Library',
    conceptTagline: 'Iceland’s only farm-made cheese, shown like a terroir archive — Brúnó on the plate, the closed loop as proof.',
    accent: '#8A4B22',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1654184729393-e9d3b8c589c5?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'The only farm in Iceland making cheese on its own land',
        'Won the Icelandic Agricultural Award 2025; Embla Nordic nomination',
        'A genuinely unique closed-loop product — Brúnó, washed in local IPA',
      ],
      weaknesses: [
        'Stock WordPress with tiny, compressed product thumbnails',
        'No storytelling for a one-of-a-kind product',
        'Awards and the farm story are buried or absent',
      ],
      opportunities: [
        'Present each cheese like a labelled specimen with real photography',
        'Tell the pasture-to-wheel closed loop no supermarket can',
        'Surface the awards and bring farm-shop visitors in',
      ],
    },
    positioning:
      'A national-award farmhouse cheese deserves more than thumbnail soup. Treat the cheese as the hero and the provenance as the proof.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Brúnastaði',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í matvælaframleiðslu.

Ég kolféll fyrir því sem þið gerið á Brúnastöðum, eina býlinu á Íslandi sem framleiðir ost á eigin landi, og óska ykkur til hamingju með Búnaðarverðlaunin. Það eina sem ég staldraði við var vefsíðan, því myndirnar af ostunum eru mjög smáar og sagan á bak við vöruna kemst ekki til skila.

Mér fannst það synd fyrir svona einstaka vöru, svo ég settist niður og hannaði frumgerð að nýrri forsíðu þar sem hver ostur fær að njóta sín og leiðin frá haga til hjóls er sögð. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta er aðeins hugmynd og sýnishorn, en ef ykkur líst vel á gæti ég klárað vefinn í heild. Ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    slug: 'glacierparadise',
    route: '/preview/glacierparadise',
    name: 'Glacier Paradise',
    sector: 'Glacier tours',
    location: 'Arnarstapi, Snæfellsnes',
    region: 'West',
    established: 'Síðan 2022',
    currentUrl: 'https://glacierparadise.is',
    ownerEmail: '',
    concept: 'The Ascent',
    conceptTagline: 'Scrolling is ascending — a living altimeter climbs Snæfellsjökull to a booking where the price is finally visible.',
    accent: '#7FC8E8',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1576635862964-c1a01be402ff?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Snow-cat tours up Snæfellsjökull — Jules Verne’s legendary glacier',
        'Third-generation family guides with 20+ years on the ice',
        'Entirely reliant on online discovery — a strong site moves the needle',
      ],
      weaknesses: [
        'The homepage has no booking button and no email anywhere',
        'Prices are buried on inner pages',
        'No clear contact path for a remote, no-walk-up operator',
      ],
      opportunities: [
        'Make the ascent the experience and end it on an obvious booking',
        'Put the price and a clear reserve action above the fold',
        'Add a real contact block and credible trust signals',
      ],
    },
    positioning:
      'A remote glacier operator that lives entirely on online discovery cannot afford a homepage with no way to book. Turn the climb into the story and the booking into the destination.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Glacier Paradise',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Mér líst virkilega vel á ferðirnar ykkar upp á Snæfellsjökul og þá fjölskyldusögu sem býr að baki. Það eina sem ég staldraði við var vefsíðan, því á forsíðunni er hvorki bókunarhnappur, verð né netfang, og ég held að þið séuð að missa af bókunum þess vegna.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu þar sem öll ferðin upp á jökulinn verður að upplifun og endar á skýrri bókun með sýnilegu verði. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta er aðeins hugmynd og sýnishorn, en ef ykkur líst vel á gæti ég klárað vefinn í heild.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    slug: 'sireksstadir',
    route: '/preview/sireksstadir',
    name: 'Síreksstaðir',
    sector: 'Farm-stay & cottages',
    location: 'Vopnafjörður, East Iceland',
    region: 'East',
    established: 'Fjölskyldubú',
    currentUrl: 'https://sireksstadir.is',
    ownerEmail: 'sirek@sireksstadir.is',
    concept: 'Stillness in Sunnudalur',
    conceptTagline: 'Arrival into stillness — the glen as interface, honest prices, and a request to stay that reads like a note to the family.',
    accent: '#A6593C',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1765871319901-0aaafe3f1a2a?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A genuinely remote, quiet East-Iceland farm-stay with its own restaurant',
        'Booking.com 8.3 with standout staff scores',
        'Real, repeat guests who rely on online discovery',
      ],
      weaknesses: [
        'A broken hero carousel with overlapping, unreadable slides',
        'The cottages page has no photos and two identical, copy-pasted descriptions',
        'No prices anywhere and no real booking path',
      ],
      opportunities: [
        'Replace the broken carousel with one calm, oriented arrival',
        'Give each cottage real photos, distinct copy and a clear price',
        'Add a simple request-to-book that carries the chosen unit through',
      ],
    },
    positioning:
      'A calm, remote farm-stay is being sold by a broken carousel and a photo-less cottages page. Let the glen’s stillness be the design and make staying effortless.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Síreksstaði',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu og gistingu.

Mér líst virkilega vel á staðinn ykkar inn af Sunnudal og þá kyrrð sem þið bjóðið gestum. Það eina sem ég staldraði við var vefsíðan, því forsíðan birtist brotin, myndir af sumarhúsunum vantar og hvergi er hægt að sjá verð eða bóka.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu þar sem kyrrðin í dalnum fær að ráða, hvert hús fær sínar eigin myndir og verð, og einföld bókunarbeiðni kemur í stað brotinnar síðu. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Þetta er aðeins hugmynd og sýnishorn, en ef ykkur líst vel á gæti ég klárað vefinn í heild.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },

  {
    // WHY: an extraordinary subject (twelve man-made caves with carved crosses,
    // possibly older than the settlement) on a generic Wix template with almost
    // no imagery and booking buried in a menu. OPPORTUNITY: a cinematic, immersive
    // "descent" with timed-tour booking first. CUSTOMER: self-driving tourists on
    // the South Coast — the caves sit on the Ring Road, an hour from Reykjavík.
    slug: 'cavesofhella',
    route: '/preview/cavesofhella',
    name: 'Caves of Hella',
    sector: 'Hellaferðir',
    location: 'Ægissíða, Hella',
    region: 'South',
    established: 'Manngerðir hellar',
    currentUrl: 'https://cavesofhella.is',
    ownerEmail: 'info@cavesofhella.is',
    concept: 'Niður í myrkrið',
    conceptTagline:
      'Iceland’s hidden underworld — a cinematic scroll-descent into man-made caves that may predate the settlement.',
    accent: '#9a5b1e',
    dark: true,
    status: 'Concept ready',
    thumb: import.meta.env.BASE_URL + 'cavesofhella/hero.jpg',
    audit: {
      strengths: [
        'A genuinely rare subject — twelve man-made caves with crosses and carvings, possibly pre-settlement',
        'Right on the Ring Road, an hour from Reykjavík, with daily guided tours in English',
        'Clear pricing and a real booking system already in place',
      ],
      weaknesses: [
        'A generic Wix template that conveys none of the mystery or atmosphere',
        'Almost no photography for what is, fundamentally, a visual attraction',
        'Booking and tour times are buried in a menu rather than front and centre',
      ],
      opportunities: [
        'Make the visitor feel the descent into the underworld before they arrive',
        'Showcase each named cave (Fjóshellir, Kirkjuhellir, Hlöðuhellir, Lambhellir)',
        'Put “pick a time and book” one tap away',
      ],
    },
    positioning:
      'Iceland’s oldest standing archaeological mystery deserves a site that feels like stepping underground. The redesign trades a flat template for a cinematic descent — candlelight, carved stone, the named caves — with timed-tour booking as the hero.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Caves of Hella',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Við vorum nokkur á leið í útilegu í sumar þegar ég fór að skoða hellana ykkar á netinu og heillaðist strax af sögunni. Manngerðir hellar sem gætu verið eldri en sjálft landnámið, með krossum og útskurði í veggjunum, eru saga sem fólk vill upplifa. Það eina sem ég staldraði við var sjálf vefsíðan, því mér fannst hún ekki ná að fanga þessa dulúð. Myndirnar eru fáar og það er ekki alveg augljóst hvernig maður bókar ferð.

Mér fannst það synd, svo ég settist niður í frítímanum mínum og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að gestir finni strax fyrir leyndardómnum sem býr í hellunum, sjái þá með eigin augum og geti bókað ferð á örfáum sekúndum. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },

  {
    // WHY: a wonderful farm-to-table story (own free-range beef, an old cowshed
    // under Eyjafjallajökull, since 1999, the Eldfjallasúpa) lost on a cluttered,
    // dated template with duplicate menus, a price typo and weak imagery.
    // CUSTOMER: travellers on the South Coast and Icelanders who make the trip.
    slug: 'gamlafjosid',
    route: '/preview/gamlafjosid',
    name: 'Gamla Fjósið',
    sector: 'Veitingahús',
    location: 'Hvassafell, undir Eyjafjöllum',
    region: 'South',
    established: 'Síðan 1999',
    currentUrl: 'https://gamlafjosid.is',
    ownerEmail: 'info@gamlafjosid.is',
    concept: 'Eldur, gras og nautakjöt',
    conceptTagline:
      'The Old Cowshed — own-farm beef under a volcano, a farm-to-plate story told warm and whole.',
    accent: '#9a3f12',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1507807823252-1870c299a391?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'An enviable story — their own free-range beef, garden vegetables and daily bread',
        'A working farm in a converted cowshed right under Eyjafjallajökull, since 1999',
        'A signature people remember (the Eldfjallasúpa / Volcano Soup)',
      ],
      weaknesses: [
        'A dated template with duplicate menus and navigation repeated down the page',
        'A real price typo (Kr. 1.1.210) and weak, placeholder-feeling imagery',
        'Seasonal closing and table booking are buried and slightly contradictory',
      ],
      opportunities: [
        'Lead with the farm-to-plate provenance and the volcano setting',
        'A single, photographed, scannable menu with the Volcano Soup featured',
        'Clear hours and season, and an easy table booking',
      ],
    },
    positioning:
      'The food and the farm are the story; the current site hides both. The redesign leads with own-farm beef under Eyjafjallajökull, a warm photographed menu around the Eldfjallasúpa, and clear hours and booking.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Gamla fjósið',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús og ferðaþjónustu.

Sagan ykkar í Gamla fjósinu er einmitt það sem fólk fellur fyrir. Eigið nautakjöt beint af bænum, gamalt fjós undir Eyjafjöllum og Eldfjallasúpa sem fólk talar um. Mér fannst þó núverandi vefsíða ekki gera þessari sögu nógu hátt undir höfði. Matseðillinn endurtekur sig nokkrum sinnum á síðunni, myndirnar eru fáar og litlar, og það er ekki alveg einfalt að sjá hvenær er opið eða hvernig maður bókar borð.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur, þar sem ég reyndi að laga einmitt þessi atriði. Sagan og hráefnið fá að njóta sín efst, matseðillinn er einn og skýr með flipum eftir flokkum, stórar myndir gera réttina girnilega og Eldfjallasúpan fær sitt eigið pláss. Svo eru opnunartímar á hreinu og einfalt að bóka borð. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },

  {
    // WHY: a beloved roadside bakery (fresh cinnamon rolls hourly, real espresso,
    // a clear view of Eyjafjallajökull) with NO website at all — designed from
    // scratch. CUSTOMER: self-driving tourists on the Ring Road between Hvolsvöllur
    // and Vík. Contact is Instagram @faxi_bakery_ / phone (no public email found).
    slug: 'faxibakery',
    route: '/preview/faxibakery',
    name: 'Faxi Bakery',
    sector: 'Bakarí & kaffihús',
    location: 'Undir Eyjafjöllum, þjóðvegur 1',
    region: 'South',
    established: 'Bakarí og kaffihús',
    currentUrl: 'https://www.instagram.com/faxi_bakery_',
    ownerEmail: '',
    concept: 'Nýbakað, með útsýni',
    conceptTagline:
      'Fresh-baked, with a view — a roadside bakery brand built from scratch around the hourly cinnamon roll and the volcano on the horizon.',
    accent: '#b23a48',
    dark: false,
    status: 'Concept ready',
    thumb: import.meta.env.BASE_URL + 'faxibakery/hero.jpg',
    audit: {
      strengths: [
        'A signature ritual people love — fresh cinnamon rolls baked every hour',
        'A postcard setting right on the Ring Road, looking at Eyjafjallajökull',
        'Real espresso, gluten-free options and an open kitchen you can watch',
      ],
      weaknesses: [
        'No website at all — passing travellers cannot find hours, menu or a reason to stop',
        'Discovery lives only on third-party review sites and Instagram',
        'No way to see the offering before driving past',
      ],
      opportunities: [
        'Build a real brand and first impression from the ground up',
        'Make the hourly cinnamon roll and the volcano view the hook',
        'Put hours, menu and location where road-trippers will actually look',
      ],
    },
    positioning:
      'A bakery this good with no website is invisible to the travellers driving past it. Built from scratch, the brand turns the hourly cinnamon roll and the Eyjafjallajökull view into a reason to stop — with hours, menu and location front and centre.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Faxi Bakery',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk bakarí og kaffihús.

Ég kom auga á Faxi Bakery og heillaðist strax. Nýbakaðir snúðar á hverjum klukkutíma, alvöru kaffi og útsýni yfir Eyjafjallajökul er nákvæmlega svona stopp sem ferðafólk elskar á leiðinni austur. Það eina sem ég fann ekki var vefsíða, svo fólk sem keyrir framhjá hefur enga leið til að sjá opnunartíma, hvað er í boði eða af hverju það ætti að stoppa.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að forsíðu fyrir ykkur frá grunni. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að ferðafólk finni ykkur áður en það keyrir framhjá, fái vatn í munninn og viti hvenær er opið. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    // GK Bakarí — Selfoss, South Iceland. Founded late 2019 by two friends,
    // Guðmundur Helgi Harðarson (ex Brauð & Co, Reykjavík) and Kjartan Ásbjörnsson
    // (ex IKEA bakery), opened Jan 2020 in Kjartan's hometown. RestaurantGuru
    // 4.7/5 across 438 reviews, but NO website at all — only Facebook, Instagram
    // and third-party aggregators/Wolt delivery. Reuses the Faxi Bakery Café
    // design system verbatim (Faxi's own outreach went unanswered).
    slug: 'gkbakari',
    route: '/preview/gkbakari',
    name: 'GK Bakarí',
    sector: 'Bakarí & kaffihús',
    location: 'Selfoss, Suðurland',
    region: 'South',
    established: 'Est. 2019',
    currentUrl: 'https://www.facebook.com/gkbakari',
    ownerEmail: 'gkbakari@simnet.is',
    concept: 'Bakað af tveimur vinum',
    conceptTagline:
      'A neighborhood bakery brand built around its real story — two friends, real Selfoss ingredients, and the daily rhythm of who’s open right now.',
    accent: '#C2773A',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1686207855146-c3ffe2166d40?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Two real, named bakers (ex Brauð & Co, ex an IKEA bakery) running their own place since Jan 2020',
        '4.7★ on RestaurantGuru across 438 reviews — genuinely well-loved locally',
        'A real Wolt delivery menu with real prices, not just a social feed',
      ],
      weaknesses: [
        'No website at all — only Facebook, Instagram and third-party delivery/review aggregators',
        'Passing Golden Circle and Ring Road traffic has no way to discover them online',
        'Their own founding story is invisible outside word of mouth',
      ],
      opportunities: [
        'Build a real home for the brand from the ground up',
        'Surface real hours, menu and prices somewhere travelers and locals will actually find them',
        'Tell the founders’ story instead of leaving it to Facebook captions',
      ],
    },
    positioning:
      'A well-loved young bakery with a 4.7★ rating and zero web presence outside Facebook and delivery apps. Built from scratch, the brand turns the founders’ own story, real menu and daily open/closed rhythm into the reason to stop by.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir GK Bakarí',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk bakarí og kaffihús.

Ég rakst á GK Bakarí og varð hissa að sjá hvað þið standið ykkur vel, 4,7 í einkunn og fullt af frábærum umsögnum, en samt eruð þið hvergi að finna nema á Facebook, Instagram og í gegnum Wolt. Fólk sem er að leita að góðu bakaríi á Selfossi hefur því enga alvöru síðu til að skoða áður en það kemur við.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri vefsíðu fyrir ykkur. Hún segir söguna ykkar, tveggja vina sem opnuðu bakarí í heimabæ Kjartans, og sýnir matseðilinn og opnunartímann skýrt. Þið getið ekki bara skoðað hana heldur líka prófað hana sjálf, til dæmis notað pöntunarhnappinn sem fer beint inn á Wolt. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða og prófa hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    slug: 'kirkjubaer',
    route: '/preview/kirkjubaer',
    name: 'Tjaldsvæðið Kirkjubær II',
    sector: 'Tjaldsvæði og sumarhús',
    location: 'Kirkjubæjarklaustur, Suðurland',
    region: 'South',
    established: 'Opið mars til nóvember',
    currentUrl: 'https://kirkjubaer.com',
    ownerEmail: 'kirkjubaer@simnet.is',
    concept: 'Friðsæl bækistöð',
    conceptTagline:
      'A peaceful base camp under the South Coast sky — warm, earthy and editorial, with the campsite’s own land doing the talking and the season status alive on the page.',
    accent: '#c2693f',
    dark: false,
    status: 'Concept ready',
    thumb: import.meta.env.BASE_URL + 'kirkjubaer/hero-glacier.jpg',
    audit: {
      strengths: [
        'Frábær staðsetning við Kirkjubæjarklaustur á þjóðvegi 1, miðja vegu á Suðurströndinni',
        'Bæði tjaldsvæði (fyrstur kemur, fyrstur fær) og sjö sumarhús fyrir fjóra',
        'Sterkir dómar á TripAdvisor og bókun sumarhúsa þegar komin í gegnum Airbnb',
      ],
      weaknesses: [
        'Vefsíðan er gömul (WordPress og Elementor) og virkar úrelt í dag',
        'Litlar myndir og veikt tungumálaval þar sem aðeins fánar skipta milli íslensku og ensku',
        'Ekkert innfellt kort og verð ásamt opnunartímum hvergi á einum skýrum stað',
      ],
      opportunities: [
        'Láta staðinn njóta sín með stórum myndum og hlýrri, jarðbundinni hönnun',
        'Skýrt verð, opnunartímar, kort og bein leið í bókun á sumarhúsum',
        'Almennileg tvítyngd síða á íslensku og ensku sem virkar fullkomlega í síma',
      ],
    },
    positioning:
      'Eitt best staðsetta tjaldsvæði Suðurlands á skilið vefsíðu sem stendur undir staðnum. Hlý, jarðbundin og ritstýrð hönnun lætur landið tala, sýnir lifandi opnunarstöðu eftir árstíma, og setur verð, kort og bókun þangað sem ferðafólk leitar raunverulega, bæði á íslensku og ensku.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Tjaldsvæðið Kirkjubæ II',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Ég er einmitt gestur hjá ykkur á tjaldsvæðinu þessa dagana og er alveg heillaður. Friðsælt, hreint og dásamlega staðsett rétt hjá Kirkjubæjarklaustri, með allt Suðurlandið í seilingarfjarlægð. Það eina sem mér fannst ekki gera staðnum nógu góð skil var vefsíðan. Hún er orðin nokkuð gömul, myndirnar litlar, og það vantar bæði almennilegt kort og skýrar upplýsingar um opnunartíma og verð á einum stað.

Mér fannst það synd, svo á meðan ég dvel hér settist ég niður og hannaði frumgerð að nýrri vefsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að ferðafólk finni ykkur, sjái hversu fallegur staðurinn er, viti strax hvenær er opið og hvað hlutirnir kosta, og rati til ykkar áreynslulaust. Síðan er bæði á íslensku og ensku. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },

  {
    // WHY: a genuinely well-reviewed riverside farm guesthouse (Tripadvisor 4.3/177,
    // Booking.com 8.1/659) with three real ways to stay (rooms, a cottage, camping
    // pods), but the current site gives visitors nothing — no real photos, no clear
    // way to see the rooms vs the cottage vs the pods separately. OPPORTUNITY: a calm,
    // photo-forward one-pager that finally shows the place, split cleanly by unit.
    // CUSTOMER: Ring Road self-drivers passing Egilsstaðir, East Iceland's hub town.
    slug: 'vinland',
    route: '/preview/vinland',
    name: 'Vínland Guesthouse',
    sector: 'Farm guesthouse & cottage',
    location: 'Fellabær, Egilsstaðir',
    region: 'East',
    established: 'Fjölskyldurekið frá 2018',
    currentUrl: 'https://vinlandguesthouse.is',
    ownerEmail: 'info@vinlandhotel.is',
    concept: 'The Crossing at Lagarfljót',
    conceptTagline:
      'A riverside farm guesthouse right off the Ring Road, told plainly through its three real ways to stay — rooms, a cottage, and camping pods — with an oversized wordmark as the one bold signature.',
    accent: '#B8431C',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://res.cloudinary.com/itb-database/image/upload/s--FQ0s_J7Q--/c_fill,dpr_auto,f_auto,q_auto:eco,w_1470/v1/ServiceProviders/ef7865232160a4a74bec5af6b384d49c',
    audit: {
      strengths: [
        'A genuinely well-reviewed riverside guesthouse right off the Ring Road (Tripadvisor 4.3/5 · 177 reviews, Booking.com 8.1/10 · 659 reviews)',
        'Three real ways to stay — six ensuite rooms, a private cottage, and camping pods — each with its own character',
        'Minutes from the Reindeer Park, Vök Baths and Hallormsstaður Forest, with free airport transfer',
      ],
      weaknesses: [
        'No real photos of the property reach visitors before they book elsewhere',
        'Rooms, the cottage and the camping pods are never shown or explained separately',
        'Nothing on the current site makes the riverside setting or nearby sights the reason to stop',
      ],
      opportunities: [
        'A clean, secure one-page home built around real photography',
        'Give the rooms, the cottage and the pods their own honest presentation and specs',
        'Make the crossing at Lagarfljót and what surrounds it the reason travellers choose to stay',
      ],
    },
    positioning:
      'A well-reviewed riverside guesthouse with three genuinely different ways to stay is being let down by a site that shows none of it. Let the crossing at Lagarfljót, the rooms, the cottage and the pods each tell their own honest story.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Vínland Guesthouse',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu og gistingu.

Ég rakst á Vínland þegar ég var að skoða gistingu rétt hjá Egilsstöðum og sá að þið eruð með virkilega góða dóma, bæði á Tripadvisor og Booking.com. Það kom mér því á óvart hvað núverandi vefsíða sýnir lítið af staðnum sjálfum. Hvergi sést hvernig herbergin líta út, hvað kofinn hefur upp á að bjóða eða hvernig tjaldskálarnir eru frábrugðnir hvort öðru.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu þar sem hver gistimöguleiki, herbergin, kofinn og skálarnir, fær sína eigin kynningu. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að ferðafólk sjái strax hvað þið bjóðið og velji Vínland með sjálfstrausti, í stað þess að halda áfram að leita. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },

  {
    // WHY: a real, reviewed farm guesthouse under the dramatic Pétursey cliff (9 rooms
    // + two cottages, sheep/horses/poultry on-site, minutes from Sólheimajökull and
    // Reynisfjara), but the ONLY website is a bare, free Google Sites page with no
    // photos, no prices, no way to request a room. OPPORTUNITY: a real, warm one-pager
    // that finally gives it a presence to match its setting. CUSTOMER: self-drivers
    // researching where to stay near Vík on the South Coast.
    slug: 'vellir',
    route: '/preview/vellir',
    name: 'Guesthouse Vellir',
    sector: 'Farm guesthouse & cottages',
    location: 'Mýrdalur, near Vík',
    region: 'South',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://sites.google.com/view/Vellir',
    ownerEmail: 'f-vellir@islandia.is',
    concept: 'Between Glacier and Sea',
    conceptTagline:
      'A farm guesthouse under the cliffs of Pétursey, told through its own real photography — rooms, cottages and the mountain that watches over them — with a cooler, editorial signature distinct from its sibling build.',
    accent: '#3D5A6C',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://www.heyiceland.is/asset/1940/1-7.-8-og-9.-juli-2009-221s.jpg',
    audit: {
      strengths: [
        'A real, reviewed farm guesthouse under the dramatic Pétursey cliff, minutes off the Ring Road',
        '9 rooms across three types plus two private cottages, with real farm character — sheep, horses, poultry',
        'Genuinely close to Sólheimajökull, Dyrhólaey, Skógafoss and Reynisfjara',
      ],
      weaknesses: [
        'The only website is a bare, free Google Sites page',
        'No photos, no prices, and no way to actually request a room online',
        'Visitors researching where to stay near Vík have nothing real to compare it against',
      ],
      opportunities: [
        'Give it a real one-page home built on its own property photography',
        'Show the three room types and the two cottages clearly, side by side',
        'Make Pétursey mountain and the working farm the reason to stay here rather than in Vík itself',
      ],
    },
    positioning:
      'A real farm guesthouse under one of the South Coast’s most striking cliffs currently has no real website at all, just a bare Google Sites page. Let the mountain, the farm and the rooms speak for themselves.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Vellir',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu og gistingu.

Ég var að skoða gistimöguleika í Mýrdalnum og fann Vellir, alveg undir Pétursey. Staðsetningin er einstök og sauðfé, hestar og hænsn á bænum gera staðinn ekta. Það kom mér því á óvart að núverandi vefsíða er einföld Google Sites síða, án mynda, verðs eða leiðar til að senda fyrirspurn.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri vefsíðu sem sýnir herbergin þrjú, kofana tvo og fjallið sjálft eins og staðurinn á skilið. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að ferðafólk sem er að leita að gistingu nálægt Vík sjái strax hvað Vellir hefur upp á að bjóða, í stað þess að halda áfram að leita annað. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },

  {
    // WHY: Iceland's best-known hot tub / sauna store (Fiskikóngurinn ehf., Kristján
    // Berg, domain since 2004). Sells 300k to 6M ISK products (Arctic Spas tubs,
    // hitaveituskeljar, saunahús named Alþingi / Bessastaðir / Þingvellir) plus real
    // discounts, yet runs on a stock Shopify "Reformation" template with Photoroom
    // cutouts, no storytelling and no address on the site. OPPORTUNITY: a dark
    // photographic showroom built from their OWN imagery and REAL prices, section
    // architecture that maps 1:1 to a custom Shopify Liquid theme (Path 1).
    slug: 'heitirpottar',
    route: '/preview/heitirpottar',
    name: 'Heitirpottar.is',
    sector: 'Hot tub & sauna e-commerce',
    location: 'Reykjavík',
    region: 'Capital',
    established: 'Est. 2004',
    currentUrl: 'https://heitirpottar.is',
    ownerEmail: 'kristjan@heitirpottar.is',
    concept: 'Gufa',
    conceptTagline:
      'A basalt-black digital showroom at dusk: a full-bleed timed product slideshow with real prices and discounts, their own night photography finally doing the selling, one ember accent. Every section maps 1:1 to a Shopify Liquid section.',
    accent: '#F07B3C',
    dark: true,
    status: 'Concept ready',
    thumb:
      'https://heitirpottar.is/cdn/shop/files/njota_2_b375b88f-08b1-43d6-9224-9b94551decee.jpg?width=1200',
    audit: {
      strengths: [
        'Strong catalog with real personality: saunahús named Alþingi, Bessastaðir and Þingvellir, uniquely Icelandic hitaveitupottar',
        'Genuinely premium supplier photography (night shots of glowing saunas in snow) already in their CDN',
        'Open every day, three phone lines, active on four social platforms, real discounts running',
      ],
      weaknesses: [
        'Stock Shopify "Reformation" template presents 3M ISK tubs like small accessories',
        'Best imagery is buried; homepage is a generic slideshow plus white product-card grids',
        'No founder story, no address, no kennitala on the site despite the owner being a well-known merchant',
      ],
      opportunities: [
        'A dark showroom experience built from their own photography and live prices',
        'Lead with Góðir dílar: real discounts (up to 44%) deserve hero placement, not a nav link',
        'Custom Liquid theme migration keeps their admin, checkout and inventory untouched',
      ],
    },
    positioning:
      'The best-known pottar store in Iceland sells showroom-class products through a stock template. Give the store a digital showroom at dusk, built from its own night photography and real prices, architected so every section drops straight into their existing Shopify as a custom Liquid theme.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Heitirpottar.is',
      body: `Sæll Kristján,

Ég heiti Sindri og hanna vefsíður fyrir íslenskar verslanir og þjónustufyrirtæki.

Það er margt sem þið gerið mjög vel á Heitirpottar.is. Vöruúrvalið er sterkt, saunahús með nöfn eins og Alþingi og Bessastaðir eru frábær hugmynd og næturmyndirnar ykkar af upplýstum saunahúsum í snjó eru með þeim flottustu sem sjást hjá íslenskri verslun. Vefurinn sjálfur er hins vegar staðlað Shopify sniðmát, og þegar pottur upp á þrjár milljónir er settur fram eins og smávara þá endurspeglar upplifunin ekki gæðin.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Hún er hugsuð eins og sýningarsalur, byggð á ykkar eigin myndum og alvöru verðum af vefnum ykkar, og hún er teiknuð þannig að hún færist beint yfir í Shopify kerfið sem þið notið nú þegar. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sem er að velta fyrir sér potti eða saunahúsi finni strax sömu gæðatilfinningu á vefnum og það fær hjá ykkur í versluninni, og að góðu dílarnir ykkar blasi við. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    slug: 'sportsol',
    route: '/preview/sportsol',
    name: 'Sportsól',
    sector: 'Sólbaðsstofa',
    location: 'Kópavogur og Grafarvogur',
    region: 'Capital',
    established: 'Sportsól ehf, stofnað 2012',
    currentUrl: 'https://sportsol.is',
    ownerEmail: 'sportsol@sportsol.is',
    concept: 'Komdu í ljós',
    conceptTagline:
      'The landing page is the UV room: tubes strike and hum like the real thing, the neon-fuchsia logo leads the palette, and the time-of-day pricing makes sense at a glance.',
    accent: '#B500AE',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Splunkunýjar stofur: Hverafold opnaði 2024 og Hamraborg í janúar 2026, með Luxura og American M7 bekkjum',
        'Alvöru netbókun á Noona og öll verð birt á vefnum',
        'Virk á Instagram og TikTok, lifandi opnunartímar í haus',
      ],
      weaknesses: [
        'Öll tilboð eru innbakaðar auglýsingamyndir í ólíkum stílum, ólesanlegar í síma og ósýnilegar Google',
        'Eina H1 forsíðunnar er „Opnunartímar", titillinn nefnir hvorki sólbaðsstofu né staðsetningu og engin skipulögð gögn',
        'Enskir gestir fá blandaða ensk-íslenska síðu og útlitið tengist ekki bleika pálmamerkinu',
      ],
      opportunities: [
        'Eitt heildstætt sólarútlit í kringum bleika merkið í stað ósamstæðra borða',
        'Verðskráin sem hönnuð tafla með morgun- og dagverði og bókun við hverja línu',
        'LocalBusiness gögn fyrir báðar stofur svo þær finnist á Google',
      ],
    },
    positioning:
      'Ný og metnaðarfull sólbaðsstofukeðja með glæný tæki en vef sem lítur út eins og ljósritað dreifiblað. Frumgerðin selur birtuna og vellíðanina, gerir tímaskipt verð skiljanlegt á augabragði og setur Noona bókunina í öndvegi.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Sportsól',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Þið hafið byggt upp flotta aðstöðu á methraða, splunkunýir bekkir í Hverafold og nú Hamraborg, netbókun á Noona og öll verð sýnileg. Þegar ég skoðaði vefsíðuna tók ég samt eftir að tilboðin eru myndir með innbökuðum texta sem sjást illa í síma og finnast ekki á Google, og útlitið endurspeglar ekki hvað stofurnar eru nýjar og flottar.

Ég hannaði því frumgerð að nýjum vef þar sem ljósið fylgir deginum: verðskráin sýnir morgun- og dagverð á augabragði, áskriftin og Frelsi fá almennilega umgjörð og bókunin á Noona er alltaf innan seilingar. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  },
  {
    slug: 'saelan',
    route: '/preview/saelan',
    name: 'Sælan',
    sector: 'Sólbaðsstofa og spraytan',
    location: 'Faxafen 10, Reykjavík',
    region: 'Capital',
    established: 'Sólbaðsstofa ehf, opnaði aftur í Faxafeni 1. október 2025 (saga frá 2002)',
    currentUrl: 'https://saelan.is',
    ownerEmail: 'saelan@saelan.is',
    concept: 'Sólplakat',
    conceptTagline:
      'A silkscreened solarium poster: the page is drenched in the logo sun yellow with red and ink as print colors, Tanker slab type, a draggable sun-path price dial and punch-card timakort.',
    accent: '#C9301C',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://saelan.is/wp-content/uploads/2025/09/saelanmynd11.png',
    audit: {
      strengths: [
        'Glænýir bekkir, KBL K11 Air Loft ALL LED og Ergoline Prestige 1400, plús eina sjálfvirka spraytanið á Íslandi (VersaSpa PRO)',
        'Netbókun á Noona og áskrift gegnum Repeat, öll verð birt á vefnum',
        'Flottar alvöru ljósmyndir til, bekkirnir í hlýrri lýsingu og skiltið í glugganum',
      ],
      weaknesses: [
        'Titillinn er bara „Sælan", engin lýsing, ekkert schema, lang="en-US" og engin H1 á forsíðunni, eina H1 vefsins er ensk „coming soon" síða',
        'Elementor sniðmát með óviðkomandi myndabankamyndum (fætur á strönd, jógakona) og skilmálasíðan er með hliðarstiku sem vísar á ástralska húsgagnaverslun',
        '50 skriftur og 45 stílblöð á forsíðunni, um 2 MB af óþjöppuðum myndum, og pinch-zoom er læst',
      ],
      opportunities: [
        'Eitt heildstætt gyllt útlit byggt á þeirra eigin myndum í stað sniðmátsmynda',
        'Sagan frá 2002 og endurkoman í Faxafenið sögð upphátt, það byggir upp traust eftir lokanirnar',
        'Verðskráin og áskriftarskilmálarnir settir fram heiðarlega, traustið er söluvaran eftir endurkomuna',
      ],
    },
    positioning:
      'Rótgróið vörumerki með yfir 20 ára sögu sem opnaði aftur í Faxafeni með flottustu tæki landsins en vef á sniðmáti með myndabankamyndum. Frumgerðin fangar gullnu stundina: dökkur hlýr heimur, alvöru myndir af bekkjunum, áfangastaðavalið úr K11 sem wow-augnablik og heiðarleg verðskrá og áskrift í öndvegi.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Sæluna',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Til hamingju með endurkomuna í Faxafenið, bekkirnir eru greinilega á heimsmælikvarða og spraytanklefinn er sá eini sinnar tegundar á landinu. Þegar ég skoðaði vefsíðuna tók ég samt eftir því að hún stendur tækjunum langt að baki: titillinn er bara eitt orð svo Google veit varla af ykkur, myndirnar eru að mestu úr erlendu sniðmáti frekar en ykkar eigin, og síðan er þung í síma.

Ég settist því niður og hannaði frumgerð að nýjum vef í kringum ykkar eigin myndir og alvöru verð. Bekkirnir ykkar fá að vera stjarnan, verðskráin er loksins læsileg á augabragði og bókunin á Noona er alltaf innan seilingar. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á hana getum við fundið sanngjarnt verð. Ef ekki, þá er það ekkert mál.

${SIGN}`,
    },
  },
  {
    slug: 'stjornusol',
    route: '/preview/stjornusol',
    name: 'Stjörnusól',
    sector: 'Sólbaðsstofa',
    location: 'Fjarðargata 17, Hafnarfjörður',
    region: 'Capital',
    established: 'Síðan 1979',
    currentUrl: 'https://solbadsstofa.is',
    ownerEmail: '',
    concept: 'Vélin vaknar',
    conceptTagline:
      'The K11 render is the hero film: its LED panels wake in sequence and hum on the page. Obsidian room, champagne metal, violet light, and the brand magenta star.',
    accent: '#C2185F',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1519677584237-752f8853252e?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Rótgróin stofa í hjarta Hafnarfjarðar, starfandi síðan 1979',
        'Nýjasti bekkurinn, K11 Air Loft frá KBL, ALL LED með áfangastaðaprógrömmum',
        'Netbókun á Noona og tímaskipt verðskrá sem verðlaunar morgungesti',
      ],
      weaknesses: [
        'WordPress vefur með litla hönnun, verðskráin flöt tafla og K11 síðan enn merkt „kemur í janúar 2025"',
        'Enginn opnunartími sýnilegur á vefnum og engin verðsaga á forsíðu',
        'Ekkert netfang birt og bókunarhnappurinn týnist í valmyndinni',
      ],
      opportunities: [
        'Láta ljósin sjálf segja söguna: verðið kviknar eins og perurnar í bekknum',
        'Morgunverð og dagverð sem lifandi samanburður með sparnaði á hverri línu',
        'K11 Air Loft sem stjarna vefsins með sínum raunverulegu áfangastöðum',
      ],
    },
    positioning:
      'Elsta sólbaðsstofa Hafnarfjarðar með splunkunýjan flaggskipsbekk en vef sem segir hvorki verð né opnunartíma. Frumgerðin gerir ljósið að aðalatriðinu og tímaskipta verðið að leik.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Stjörnusól',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Stjörnusól hefur verið til síðan 1979 og er nú með einn flottasta bekk landsins, K11 Air Loft. Þegar ég skoðaði vefsíðuna ykkar tók ég eftir að hún endurspeglar það ekki: verðskráin er flöt tafla, opnunartíminn kemur hvergi fram og K11 síðan segir enn að bekkurinn sé væntanlegur í janúar 2025.

Ég hannaði því frumgerð að nýjum vef þar sem ljósin sjálf segja söguna: verðið kviknar á skjánum eins og perur í bekk, morgunverð og dagverð skiptast með einum smelli og K11 Air Loft fær sviðið sem hann á skilið. Bókunin á Noona er alltaf innan seilingar. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  },
  {
    // Passion Reykjavík — family-run artisan bakery, Álfheimar 6, Reykjavík
    // + bollur counter at Fjarðarkaup, Hafnarfjörður. Owner/baker Styrmir Már
    // Sigmundsson (veitingageirinn.is). TripAdvisor 4.8/57 (#6 of 19 Rvk
    // bakeries), Google ~4.8. Their real site passionreykjavik.is has shown an
    // "under construction" placeholder since at least Apr 2024 (Wayback digest
    // unchanged Apr 2024 → Jul 2026) while /bollur is a live order page.
    // Prototype re-skins the GK skeleton in Passion's OWN brand (logo, #111
    // ground, gold + burgundy from the logo, Lusitana + Source Serif — the
    // fonts their own build preloads). English-first with IS toggle. Only ONE
    // photo (the existing repo cinnamon-roll plate as their Cinnabon); all
    // other image slots are labelled HD-photography placeholder frames.
    slug: 'passion',
    route: '/preview/passion',
    name: 'Passion Reykjavík',
    sector: 'Bakarí & kaffihús',
    location: 'Álfheimar 6, Reykjavík',
    region: 'Capital',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.passionreykjavik.is',
    ownerEmail: 'passionreykjavik@simnet.is',
    concept: 'PASSION',
    conceptTagline:
      'Their own gold-serif identity, finally given a home: a dark, elegant, English-first page where the flagship Cinnabon turns slowly under the NÝBAKAÐ headline as you scroll.',
    accent: '#C8A877',
    dark: true,
    status: 'Concept ready',
    thumb: import.meta.env.BASE_URL + 'passion/cinnabon.jpg',
    audit: {
      strengths: [
        'TripAdvisor 4,8 af 5 (57 umsagnir), #6 af 19 bakaríum í Reykjavík, og virk Wolt heimsending',
        'Sterk sérstaða: rómað vegan úrval, Cinnabon menning og 15 tegundir af bollum fyrir bolludag',
        'Alvöru vörumerki nú þegar: gyllt serif merki með vínrauðri pensilstroku sem á skilið að sjást',
      ],
      weaknesses: [
        'Forsíðan á passionreykjavik.is hefur sagt "vefsíðan er í vinnslu" að minnsta kosti síðan í apríl 2024',
        'Engar vörur, verð eða myndir á vefnum, allt umtalið býr á TripAdvisor og samfélagsmiðlum',
        'Ferðafólk sem finnur 4,8 stjörnu bakarí á netinu lendir á tómri síðu',
      ],
      opportunities: [
        'Nota þeirra eigið merki og liti í fullbúna forsíðu í stað placeholder síðunnar',
        'Enska fyrst fyrir ferðafólk með íslensku í einum smelli',
        'Sýna raunveruleg verð af Wolt, bollumenninguna og vegan úrvalið sem gestir lofa mest',
      ],
    },
    positioning:
      'A 4.8-star family bakery whose only web presence has been a "coming soon" page for over two years. The prototype gives their existing gold-and-burgundy identity a real home: dark, elegant, English-first for the tourists already reviewing them, with real Wolt prices and marked frames where their HD photography will land.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Passion Reykjavík',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk bakarí og kaffihús.

Ég rakst á Passion Reykjavík um daginn og heillaðist af því sem þið gerið. Þið eruð með frábært orðspor, 4,8 í einkunn á TripAdvisor, og fólk talar sérstaklega vel um vegan bakkelsið og Cinnabon snúðana ykkar. Þegar ég ætlaði svo að skoða vefsíðuna ykkar fann ég hins vegar hvergi almennilega síðu með upplýsingum, því passionreykjavik.is sýnir aðeins skilaboð um að vefurinn sé í vinnslu.

Mér fannst það synd fyrir svona gott bakarí, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Síðan notar merkið ykkar og litina úr því. Hún er á ensku fyrir ferðafólk með íslensku í einum smelli, og sýnir matseðilinn, verðin eins og þau birtast á Wolt, bollurnar og vegan úrvalið. Það eina sem vantar eru ljósmyndir af vörunum ykkar, og ég merkti staðina þar sem þær gætu farið.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur. Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    // Reynir bakari — family craft bakery in Kópavogur since 1994 (Dalvegur 4 +
    // Hamraborg 14). Founder Reynir (Carl) Þorleifsson; passed 2019; sons
    // Þorleifur Karl + Henry Þór took over. Google 4,5/63, Facebook 92% recommend.
    // Current site: dated Wix, "© 2020 by Undireins", no menu/prices online.
    // Prototype CLONES the Passion design + palette per Sindri's brief, re-skinned
    // with their real gold script logo, heritage dough photo, aha.is prices, story.
    slug: 'reynir',
    route: '/preview/reynir',
    name: 'Reynir bakari',
    sector: 'Bakarí & kaffihús',
    location: 'Dalvegur 4, Kópavogur',
    region: 'Capital',
    established: 'Síðan 1994',
    currentUrl: 'https://www.reynirbakari.is',
    ownerEmail: 'reynirbakari@reynirbakari.is',
    concept: 'HANDGERT',
    conceptTagline:
      'A 30-year family craft bakery given the same dark, gold, editorial treatment as Passion, re-skinned to Reynir: their real script logo in gold, their heritage dough photo, and their 1994 story.',
    accent: '#C8A877',
    dark: true,
    status: 'Concept ready',
    thumb: import.meta.env.BASE_URL + 'reynir/hero-dough.jpg',
    audit: {
      strengths: [
        'Rótgróið fjölskyldubakarí í Kópavogi síðan 1994, allt bakað á staðnum frá grunni',
        '4,5 í einkunn á Google úr 63 umsögnum og 92% mæla með þeim á Facebook',
        'Tveir staðir (Dalvegur og Hamraborg), rómuð vínarbrauð og hefðbundin súrdeigsbrauð',
      ],
      weaknesses: [
        'Vefsíðan er gömul Wix síða, merkt "© 2020 by Undireins", og virkar úrelt',
        'Enginn matseðill og engin verð á vefnum, allt umtalið býr annars staðar',
        'Sagan þeirra, frá 1994 og fjölskyldunni, kemur hvergi fram á vefnum',
      ],
      opportunities: [
        'Nútímaleg, hlý og fáguð síða sem stendur undir 30 ára sögu bakarísins',
        'Skýr matseðill og raunveruleg verð, ásamt lifandi opnunartíma',
        'Segja söguna: Reynir, fjölskyldan og synirnir sem tóku við ofnunum',
      ],
    },
    positioning:
      'A beloved 30-year Kópavogur family bakery on a tired 2020 Wix with no menu, prices or story online. The prototype reuses the Passion dark-gold editorial design, re-skinned entirely to Reynir: their own script logo in gold, their real heritage dough photo, real aha.is prices, a live open/closed clock, and the 1994 family story.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Reynir bakara',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk bakarí og kaffihús.

Ég rakst á Reynir bakara og heillaðist af sögunni ykkar. Fjölskyldubakarí í Kópavogi síðan 1994, allt bakað á staðnum frá grunni, með 4,5 í einkunn á Google og fólk sem talar sérstaklega vel um vínarbrauðin og pistasíusnúðana. Þegar ég ætlaði svo að skoða vefsíðuna ykkar fann ég hins vegar bara gamla síðu frá 2020, án matseðils, verða eða sögunnar ykkar.

Mér fannst það synd fyrir svona rótgróið bakarí, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Síðan notar merkið ykkar, sýnir matseðilinn og verðin, segir söguna frá 1994 og bendir á báða staðina, Dalveg og Hamraborg. Hún er á ensku fyrir ferðafólk með íslensku í einum smelli.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég að þetta veiti ykkur smá innblástur. Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    // Rakarastofa Björns og Kjartans — Austurvegur 4, Selfoss. Family barbershop
    // founded 1948 by Gísli Sigurðsson. 6 named barbers, Noona booking, ~2.500 FB
    // likes. Current site = a single-page free WordPress.com page (one paragraph,
    // one vintage photo, a WP.com comment form). Sindri's own build (Sindri took
    // over the design after an earlier agent's version was scrapped). Concept
    // "Klippt síðan 1948": warm bone paper, barber-red + pole-navy, engraved Zina
    // display, the real 1948-era archival photo, and a spinning barber pole as the
    // signature. PRICES are sýnishorn (none published anywhere).
    slug: 'rakarastofa',
    route: '/preview/rakarastofa',
    name: 'Rakarastofa Björns og Kjartans',
    sector: 'Rakarastofa',
    location: 'Austurvegur 4, Selfoss',
    region: 'South',
    established: 'Rakarastofa Björns og Kjartans, stofnuð 1948',
    currentUrl: 'https://rakarastofan.is',
    ownerEmail: 'rakarastofa@gmail.com',
    concept: 'Klippt síðan 1948',
    conceptTagline:
      'A dark, cinematic, modern barbershop: warm charcoal and off-white with one muted barber-red, Fraunces display, full-bleed photography carrying the hero, and the real 1948 archival photo as the heritage anchor. Motion is a slow ken-burns, gentle parallax and smooth reveals.',
    accent: '#C24B36',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://rakarastofan.is/wp-content/uploads/2023/03/39086604_2526530124027605_8273819462801555456_n.jpg',
    audit: {
      strengths: [
        'Rótgróin rakarastofa á Selfossi, stofnuð 1948, með dyggan hóp fastagesta og sterka Facebook nærveru',
        'Sex rakarar og netbókun á Noona þegar til staðar',
        'Ekta saga og gömul ljósmynd úr stofunni sem enginn keppinautur á',
      ],
      weaknesses: [
        'Vefurinn er ein síða á ókeypis WordPress.com, ein málsgrein, ein mynd og athugasemdareitur sem á ekki heima á rakarastofu',
        'Engin verðskrá, engin þjónustulýsing og ekkert kort',
        'Ekkert skipulagt gagnamerki, illfinnanleg á Google fyrir klippingu á Selfossi',
      ],
      opportunities: [
        'Gera 1948 arfleifðina að aðalatriðinu með gömlu myndinni og sögunni',
        'Læsileg verðskrá og skýr Noona bókun í stað einnar málsgreinar',
        'LocalBusiness gögn svo stofan finnist þegar fólk leitar að rakara á Suðurlandi',
      ],
    },
    positioning:
      'Ein elsta rakarastofa Suðurlands með ósvikna sögu frá 1948 en vef sem er ein málsgrein á ókeypis WordPress síðu. Frumgerðin gerir arfleifðina að aðalatriðinu, sýnir verðskrána skýrt og setur Noona bókunina í öndvegi, með snúandi rakarastaur sem einkennismerki. Öll verð eru sýnishorn.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Rakarastofu Björns og Kjartans',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Þið eruð með eina elstu rakarastofu Suðurlands, klippt á Selfossi allt frá 1948, og eigið ykkur dyggan hóp fastagesta. Þegar ég skoðaði vefsíðuna ykkar fannst mér hún samt ekki gera sögunni skil, hún er ein málsgrein á einfaldri WordPress síðu, engin verðskrá og engin leið að sjá hvað þið bjóðið.

Ég hannaði því frumgerð að nýjum vef þar sem arfleifðin frá 1948 fær sviðið, gamla myndin og sagan, læsileg verðskrá og Noona bókunin alltaf innan seilingar. Verðin á frumgerðinni eru sýnishorn sem þið staðfestið. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  },
  {
    // Sólbaðsstofan Ársól — Hrísholt 17, Selfoss. 4× Luxura X7 + infrared sauna
    // + massage chair (verified from their Noona profile). Open daily 11–22.
    // No website (Facebook + Noona only). Prices are sýnishorn.
    slug: 'arsol',
    route: '/preview/arsol',
    name: 'Sólbaðsstofan Ársól',
    sector: 'Sólbaðsstofa',
    location: 'Hrísholt 17, Selfoss',
    region: 'South',
    established: 'Sólbaðsstofan Ársól, á Selfossi frá 2020',
    currentUrl: 'https://noona.app/arsol',
    ownerEmail: 'Solbadsstofanarsol@gmail.com',
    concept: 'Ársól',
    conceptTagline:
      'A silkscreen sun-poster for Selfoss in the Sælan magazine language but its own sunset-to-UV colourway: four Luxura X7 beds as numbered plates and a printed skin-type sun-dial that tells you your minutes.',
    accent: '#E0672A',
    dark: false,
    status: 'Concept ready',
    thumb:
      'https://res.cloudinary.com/timatal-ehf/image/upload/v1719837848/companyCoverImages/ajtjvlu5xbk2hhkbe2nz.jpg',
    audit: {
      strengths: [
        'Fjórir nýir Luxura X7 bekkir með nýjustu tækni, infrarauður saunaklefi og nuddstóll',
        'Opið alla daga frá 11 til 22 og netbókun á Noona',
        'Rótgróin á Selfossi með dyggan hóp fastagesta, yfir 1.200 fylgjendur á Noona',
      ],
      weaknesses: [
        'Engin eiginleg vefsíða til, aðeins Facebook síða og bókunarsíða á Noona',
        'Hvergi hægt að sjá bekki, verð eða opnunartíma án þess að fara inn í bókunarferlið',
        'Ósýnileg á Google þegar fólk á Suðurlandi leitar að ljósum og sólbekk',
      ],
      opportunities: [
        'Fyrsta alvöru vefsíðan: bekkirnir, verð og opnunartími á augabragði',
        'Verðskrá og húðgerðar-leiðbeiningar sem hönnuð sólarplaköt í stað falinna Noona lista',
        'LocalBusiness gögn svo Ársól finnist á Google fyrir Selfoss og nágrenni',
      ],
    },
    positioning:
      'Rótgróin sólbaðsstofa á Selfossi með fjóra glænýja Luxura X7 bekki en enga vefsíðu, bara Facebook og Noona. Frumgerðin er sólarplakat sem sýnir bekkina, gerir verðskrána læsilega og setur húðgerðar-leiðbeiningarnar og Noona bókunina í öndvegi. Öll verð eru sýnishorn sem staðfest yrðu með stofunni.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Ársól',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Þið eruð með fjóra glænýja Luxura X7 bekki, infrarauðan saunaklefa og nuddstól, opið alla daga og dyggan hóp fastagesta. Þegar ég leitaði að Ársól á netinu fann ég samt bara Facebook síðu og bókun á Noona, enga eiginlega vefsíðu þar sem sést hvað þið bjóðið, hvað það kostar eða hvenær er opið.

Ég hannaði því frumgerð að nýjum vef í anda sólarplakats: bekkirnir fá sviðið, verðskráin verður læsileg og einföld, húðgerðar-leiðbeiningar hjálpa fólki að velja réttan tíma og bókunin á Noona er alltaf innan seilingar. Verðin á frumgerðinni eru sýnishorn sem þið staðfestið. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  },
  {
    // Strýtan Dive Center — Hjalteyri, Eyjafjörður. Since 2010, Erlendur Bogason.
    // Geothermal hydrothermal-chimney diving. Concept "Niður að strýtunni": a
    // scroll-driven WebGL descent + a request-a-dive mailto flow (no online booking).
    slug: 'strytan',
    route: '/preview/strytan',
    name: 'Strýtan Dive Center',
    sector: 'Köfun og upplifun',
    location: 'Hjalteyri, Eyjafjörður',
    region: 'North',
    established: 'Strýtan Dive Center, frá 2010',
    currentUrl: 'https://strytan.is',
    ownerEmail: 'strytan@strytan.is',
    concept: 'Niður að strýtunni',
    conceptTagline:
      'A scroll-driven descent into Eyjafjörður: the page sinks from the silver surface down through the blue to the glowing hydrothermal chimney, an original animated world built around their real teal-chimney logo.',
    accent: '#2CA6B7',
    dark: true,
    status: 'Concept ready',
    thumb: import.meta.env.BASE_URL + 'strytan/thumb.jpg',
    audit: {
      strengths: [
        'Einstök upplifun á heimsvísu: köfun við jarðhitastrýtur sem finnast hvergi annars staðar í boði fyrir sportkafara',
        'Erlendur Bogason, frumkvöðull og rannsóknarkafari, hefur kafað strýturnar frá 2010 og átti þátt í friðlýsingu þeirra',
        'Framúrskarandi umsagnir á TripAdvisor og samstarf við Háskólann á Akureyri og Íslenskar orkurannsóknir',
      ],
      weaknesses: [
        'Vefurinn er frá miðjum síðasta áratug, engin netbókun og hvergi verð',
        'Neðansjávarmyndirnar, sem eru sjálf söluvaran, birtast varla og engin sterk myndræn frásögn er til staðar',
        'Ekkert skipulagt gagnamerki og enskur ferðamaður fær litla leiðsögn um hvernig eigi að bóka',
      ],
      opportunities: [
        'Gera sjálfa niðurköfunina að upplifun á vefnum: síðan sekkur niður að glóandi strýtunni',
        'Skýrt bókunarferli fyrir hverja köfun og hvert námskeið í stað almenns netfangs',
        'Segja rannsóknar- og friðlýsingarsöguna sem enginn keppinautur á',
      ],
    },
    positioning:
      'Heimsþekkt köfun við jarðhitastrýtur en vefur sem sýnir hvorki upplifunina né verð. Frumgerðin gerir sjálfa niðurköfunina að hreyfingu á vefnum, frá silfruðu yfirborði niður í bláma að glóandi strýtunni, og gefur gestum skýra leið til að óska eftir köfun.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Strýtuna',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Köfunin ykkar við jarðhitastrýturnar í Eyjafirði er einstök á heimsvísu og umsagnirnar tala sínu máli. Þegar ég skoðaði vefinn ykkar fannst mér hann samt ekki gera upplifuninni skil: neðansjávarmyndirnar sjást varla, hvergi er hægt að sjá verð og ferðamaður sem vill bóka fær bara almennt netfang.

Mér fannst þetta svo spennandi að ég hannaði frumgerð að nýjum vef þar sem sjálf niðurköfunin verður upplifun: síðan sekkur með þér frá yfirborðinu niður í bláma að glóandi strýtunni, sagan um rannsóknirnar og friðlýsinguna fær pláss og gestir geta óskað eftir köfun með nokkrum smellum. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðina má skoða hér:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  },
  {
    // Seiðkarlinn — Faxafen 14, Reykjavík. Shopify store, 100+ SKUs: the
    // "galdur" herbal tea line, raw honey, Cordyfresh mushroom tinctures,
    // freeze-dried fruit, CBD skincare, supplements. Owner email confirmed
    // on their Facebook About page (not published on-site). Prices are real
    // list prices at research time, sýnishorn per shared footer.
    slug: 'seidkarlinn',
    route: '/preview/seidkarlinn',
    name: 'Seiðkarlinn',
    sector: 'Náttúruvörur',
    location: 'Faxafen 14, Reykjavík',
    region: 'Capital',
    established: 'Seiðkarlinn ehf., starfrækt frá 2023',
    currentUrl: 'https://seidkarlinn.is',
    ownerEmail: 'seidkarlinn@seidkarlinn.is',
    concept: 'Galdraskráin',
    conceptTagline:
      "The sorcerer's price-sheet as a printed broadside, built from THEIR OWN assets: the boxed wordmark as the masthead, their real product photography as multiply-blend cutouts on paper, Oranienbaum display + Space Mono ledger labels, one stamp red. Motion identity is inscription — rules draw themselves, hand-drawn stave chapter marks self-inscribe on scroll, add-to-cart thumps a stamp. Numbered ledger rows with dotted leaders, a five-bag specimen plate for the galdur teas, an ink page for the Cordyfresh tinctures, a perforated order-slip cart.",
    accent: '#9E2B20',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://cdn.shopify.com/s/files/1/0657/8264/4910/files/villibloma_1kg_v2.jpg?width=600',
    audit: {
      strengths: [
        'Alvöru vöruúrval á Shopify: hrátt hunang, sveppatinktúrur, frostþurrkaðir ávextir, jurtate og fleira — allt á lager með rauntímaverði',
        'Nafnið sjálft (Seiðkarlinn) og "galdur"-vörulínan (Kvennagaldur, Svefngaldur, Draumagaldur o.fl.) eru þegar til sem einstakt eignarmerki',
        'Alvöru verslun í Faxafeni 14 með sækja-í-verslun valkosti, ekki eingöngu netverslun',
      ],
      weaknesses: [
        'Sjálfgefið Shopify-þema (Dawn): engin forsíðumynd, beint í vörulista, svart og hvítt',
        '"Um okkur" er níutíu orð af almennum frösum — engin saga, engin mynd, ekkert sem útskýrir nafnið',
        'Ekkert samband milli nafnsins/galdra-vörulínunnar og hönnunarinnar sjálfrar; ekkert netfang sýnilegt á vefnum sjálfum (aðeins tengiliðaform)',
      ],
      opportunities: [
        'Gera vöruúrvalið sjálft að upplifun: lífræn form og hreyfing, te-línan þeirra sem ritstýrður miðpunktur og hunangið sem sjónrænt hjarta',
        'Hunangið, sveppatinktúrurnar og frostþurrkaði ávöxturinn gefa sterkt sjónrænt tungumál (hunangsseimur, gler, kraft-pappír) sem núverandi þemað hunsar með öllu',
        'Faxafen-verslunin er ónýtt traust — engin mynd, ekkert kort, engin hvatning til að koma við',
      ],
    },
    positioning:
      'Ung náttúruvöruverslun með óvenju sterkt nafn og vöruúrval (heilsusveppir, hrátt hunang, frostþurrkaðir ávextir, jurtate nefnt eftir göldrum) falið á bak við sjálfgefið, sögulaust Shopify-þema. Frumgerðin er byggð á þeirra eigin vörumyndum og merki: prentuð verðskrá með galdrastöfum sem rista sig sjálfir, númeruðum vörulínum, stimplum og alvöru körfu. Öll verð eru sýnishorn frá rannsóknartíma.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Seiðkarlinn',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Þið eruð með einstaklega skemmtilegt nafn og vöruúrval, hrátt hunang, sveppatinktúrur, frostþurrkaða ávexti og heila te-línu sem heitir í höfuðið á göldrum, Svefngaldur, Draumagaldur og fleiri. Þegar ég skoðaði vefsíðuna ykkar fannst mér hún samt ekki nýta þetta neitt, hún er sjálfgefið verslunarþema, svarthvít, án myndar og án sögu.

Ég hannaði því frumgerð að nýjum vef sem er byggð á ykkar eigin vörumyndum og merki, sett upp eins og prentuð verðskrá með körfu, vöruflokkum og sérstökum kafla um te-línuna ykkar. Allt efni og verð á frumgerðinni eru sýnishorn sem þið staðfestið.

Frumgerðina má skoða hér, hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  },
  {
    slug: 'bilageirinn',
    route: '/preview/bilageirinn',
    name: 'Bílageirinn',
    sector: 'Auto body & service shop',
    location: 'Reykjanesbær',
    region: 'Reykjanes',
    established: 'Est. 2003',
    currentUrl: 'https://www.bilageirinn.is',
    ownerEmail: 'bilageirinn@bilageirinn.is',
    concept: 'True Line',
    conceptTagline:
      'Aviation-trained precision for everyday cars. Night-shift workshop cinema: one amber line drawn back into place.',
    accent: '#E8A23D',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Founder is a certified master aircraft mechanic — a rare, ownable precision story',
        'Purpose-built 810 m² facility (2007), Toyota + Kia authorized service',
        'CABAS assessment + partnerships with every Icelandic insurer, loaner car during repairs',
      ],
      weaknesses: [
        'Homepage hero is a dead Adobe Flash slider — visitors see an install prompt',
        'Zero responsive design: no viewport meta, no media queries, fixed 960px on black',
        'Misspelled <title>, empty meta description, a primary nav page with no content',
      ],
      opportunities: [
        'Tell the aircraft-tolerances story the current site buries on a staff list',
        'Turn the CABAS insurance-claim flow + loaner car into a clear customer journey',
        'Trivially beat the SEO baseline (empty meta, 2010-era WordPress theme)',
      ],
    },
    positioning:
      'A manufacturer-certified body shop whose entire value is precision — served today by a site that literally asks for Flash Player. The redesign translates real aviation-grade rigor into a calibration-instrument visual language.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Bílageirann',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég rakst á söguna ykkar og heillaðist alveg. Björn Steinar er meistari í flugvélavirkjun og byggði verkstæðið upp frá grunni, alla leið upp í sérhannað 810 fermetra húsnæði í Grófinni. Þið eruð með viðurkennda þjónustu fyrir Toyota og Kia og vinnið með öllum tryggingafélögum landsins. Svona bakgrunn og natni sér maður ekki oft.

Því miður finnst mér núverandi vefsíða ekki alveg gera þessari sögu skil. Forsíðan biður gesti enn um að setja upp Flash Player, sem hefur ekki virkað í neinum vafra síðan 2020, og hún virkar illa í síma.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sem lendir í tjóni finni ykkur fljótt, sjái strax hvað þið standið fyrir og geti haft samband án fyrirhafnar. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    slug: 'prentverk',
    route: '/preview/prentverk',
    name: 'Prentverk Selfoss',
    sector: 'Print shop',
    location: 'Selfoss, South Iceland',
    region: 'South',
    established: 'Est. 2009',
    currentUrl: 'https://www.pvs.is',
    ownerEmail: 'pvs@pvs.is',
    concept: 'Yfirprent',
    conceptTagline:
      'A two-colour print house on paper. Spot red over ink black, real local jobs, proof-sheet order.',
    accent: '#D1232A',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Active, registered company (statements filed through 2025) with a real local client base',
        'The old site showcased genuine community work: club papers, event brochures, cards',
        'A real two-colour brand already exists: print red #D1232A + ink black #231F20',
      ],
      weaknesses: [
        'pvs.is is now an empty default WordPress install — a "Hello world!" post since January',
        'The whole portfolio, services and contact story vanished with the old site',
        'Zero search presence: no description, no services, nothing for Google to index',
      ],
      opportunities: [
        'Restore the portfolio the Wayback archive proves they had, properly staged',
        'Own "prentun Selfoss / Suðurland" search — the local field is wide open',
        'A simple quote-request flow for the jobs they already do daily',
      ],
    },
    positioning:
      'A working South-Iceland print shop whose website is literally a blank sheet — the redesign puts their real, community-rooted jobs back on paper with the confidence of their own red-and-black mark.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Prentverk Selfoss',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég kynnti mér verkin ykkar í gegnum árin og hreifst af þeim. Félagsblöð eins og Litli Bergþór, flugeldablaðið fyrir björgunarsveitina, nafnspjöld og jólakort fyrir fyrirtæki og félög um allt Suðurland. Svona samstarf við heimabyggðina í yfir áratug er ekki sjálfgefið.

Því miður rakst ég á að núverandi vefsíða, pvs.is, sýnir þessa sögu ekki lengur. Þar tekur nú á móti manni sjálfgefin WordPress uppsetning með einni færslu frá því í janúar, og allt sem áður sýndi verkin ykkar er horfið.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fyrirtæki og félög á Suðurlandi finni ykkur á Google, sjái hvað þið prentið og geti sent fyrirspurn beint. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    slug: 'geisli',
    route: '/preview/geisli',
    name: 'Gleraugnasalan Geisli',
    sector: 'Optician',
    location: 'Akureyri',
    region: 'North',
    established: 'Est. 1967',
    currentUrl: 'https://gleraugu.is',
    // gleraugu@internet.is is from the 2019 archived site footer (site now dead) — may
    // bounce; verified phones: 462 1555 (Kaupangur). A "463 1455 Glerártorg" (2019 archive)
    // and "569 1100" (directory) exist but are unverified — not used anywhere.
    ownerEmail: 'gleraugu@internet.is',
    concept: 'Gleraugu eru skart',
    conceptTagline:
      'Their own old tagline taken seriously: frames presented like jewelry, and the page performs the moment sight snaps into focus.',
    accent: '#1F5C4D',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1540162875225-3f6b56d69fe8?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Family-run on Akureyri since 1967 — third generation, rare local trust',
        'Two locations (Kaupangur and Glerártorg) with a real optometry service',
        'A charming vintage logo and their own memorable tagline: Gleraugu eru skart',
      ],
      weaknesses: [
        'gleraugu.is is down entirely (HTTP 500) — customers find nothing at all',
        'The site was last maintained around 2016; no booking, no hours, no frames online',
        'Only findable contact is a phone number buried in directories',
      ],
      opportunities: [
        'A working site with hours, locations and panta-tíma is an instant leap from zero',
        'Frames-as-jewelry presentation nobody in the region does',
        'The 60-year, three-generation story is unused emotional gold',
      ],
    },
    positioning:
      'A beloved 59-year-old family optician whose website literally does not load. The redesign takes their own old tagline — Gleraugu eru skart — seriously: eyewear presented like jewelry, wrapped in the story of three generations helping Akureyri see clearly.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Geisla',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég kynnti mér söguna ykkar og fannst hún einstök. Gleraugnasala í fjölskyldunni á Akureyri síðan 1967, komin á þriðju kynslóð, með verslanir bæði í Kaupangi og á Glerártorgi. Svona rótgróið traust í heimabyggð er sjaldgæft.

Því miður rakst ég á að vefsíðan ykkar, gleraugu.is, opnast ekki lengur. Þar birtist bara villa, þannig að fólk sem leitar að ykkur á netinu finnur hvorki opnunartíma né getur pantað tíma í sjónmælingu.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk finni ykkur á netinu, sjái hvenær er opið og geti pantað tíma án fyrirhafnar, og að umgjarðirnar fái að njóta sín eins og skartið sem þær eru. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    slug: 'pipulagnir',
    route: '/preview/pipulagnir',
    name: 'Pípulagnir Suðurlands',
    sector: 'Plumbing',
    location: 'Selfoss, South Iceland',
    region: 'South',
    established: 'Est. 2000',
    currentUrl: 'https://psud.is',
    ownerEmail: 'psud@psud.is',
    concept: 'Heitt og kalt',
    conceptTagline:
      'The red and blue tap markers every Icelandic household knows become the design system: warm and cool alternating like hot and cold water through a house.',
    accent: '#921B1E',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1584774354932-62ceb99e6053?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        '26 years in business (VAT-registered June 2000), owner-led since founding',
        'Creditinfo framúrskarandi rating — provable financial soundness',
        'Real breadth: gólfhiti, úðakerfi, matvælaiðnaður, loftræsting, viðhald',
      ],
      weaknesses: [
        'No opening hours, no contact form — a service business you cannot reach online',
        'News section frozen at a single post from February 2023',
        'One work photo on the whole site; the 26-year track record is invisible',
      ],
      opportunities: [
        'A quote-request flow for the jobs they already do daily',
        'Show the craft: floor heating and industrial piping as a visual story',
        'Own "pípulagnir Selfoss / Suðurland" search — the field is open',
      ],
    },
    positioning:
      'A 26-year South-Iceland plumbing firm with provable financial soundness and real industrial capability, served by a site with one photo and no way to ask for a quote. The redesign turns the hot-and-cold duality of their daily work into a design system built on their own red and green mark.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Pípulagnir Suðurlands',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég kynnti mér fyrirtækið ykkar og það vakti athygli mína. Pípulagnir í 26 ár á Selfossi, allt frá gólfhita og úðakerfum upp í lagnir fyrir matvælaiðnað, og framúrskarandi einkunn hjá Creditinfo. Það segir sína sögu um traust og vönduð vinnubrögð.

Því miður finnst mér vefsíðan ykkar ekki endurspegla þetta. Þar er hvorki hægt að sjá opnunartíma né senda fyrirspurn, aðeins ein mynd af verki, og nýjasta fréttin er frá því snemma árs 2023.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk á Suðurlandi finni ykkur, sjái strax hvað þið gerið og geti sent fyrirspurn um verk á augabragði. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  },
  {
    slug: 'smariholm',
    route: '/preview/smariholm',
    name: 'Prolan Bílaryðvörn Hjá Smára Hólm',
    sector: 'Vehicle rust protection',
    location: 'Hafnarfjörður',
    region: 'Capital Region',
    established: 'kt. 640815-0270',
    currentUrl: 'https://www.smariholm.com',
    ownerEmail: 'prolan@prolan.is',
    concept: 'Brynja',
    conceptTagline:
      'An invisible armor against Icelandic weather — warm paper instead of another dark page, rust-red for the threat, wax-amber for the cure, a drag scrubber across the real 10-year warranty.',
    accent: '#A8371B',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1723099971299-3789db53604c?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Real, well-reviewed local business — 14 Google reviews, genuine repeat-customer quotes',
        'A genuinely differentiated product: flexible lanolin membrane vs. rigid coatings that crack',
        'A strong, concrete claim already on the site — up to 10 years tested protection',
      ],
      weaknesses: [
        'Every image on the site is AI-generated ("ChatGPT Image ..." filenames), including the hero that looks photoreal at a glance',
        'A leftover, unrelated "PROLAN Bílamarkaður" graphic sits in the footer with unverified-looking NSF/ISO badges',
        'No pricing, no real photography of the actual hands-on work, generic Wix template chrome',
      ],
      opportunities: [
        'Replace every AI image with honest photography of real workshop/rust-prevention work',
        'Put the 10-year warranty claim and the 5x-corrosion stat front and center as the trust anchor',
        'Surface the real Google reviews, which the current site barely shows',
      ],
    },
    positioning:
      'A real, well-reviewed rust-protection specialist whose current site is a generic Wix template filled entirely with AI-generated imagery — undermining a business whose whole pitch is authenticity and craftsmanship. The redesign is built around Prolan\'s own real differentiator (a flexible lanolin membrane, not a rigid shell) and its real 10-year tested-protection claim.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Prolan Bílaryðvörn',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég rakst á Prolan og tók eftir góðum umsögnum viðskiptavina og því að lanólín-vörnin ykkar er í grunninn öðruvísi en hefðbundnar ryðvarnir, sveigjanleg frekar en stíf. Það er saga sem má nýta mun betur.

Því miður finnst mér núverandi vefsíða ekki gera henni skil. Myndirnar á síðunni, meira að segja sú sem lítur út fyrir að vera af verkstæðinu ykkar, eru allar tölvugerðar, og niðri í síðufæti er meira að segja óskyld auglýsing með óstaðfestum vottunum sem tengist ekki starfseminni ykkar.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái strax af hverju bíllinn þeirra þarf ryðvörn hér á landi, kynnist tíu ára prófaðri vernd ykkar og geti hringt eða sent línu án fyrirhafnar. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'samverk',
    route: '/preview/samverk',
    name: 'Glerverksmiðjan Samverk',
    sector: 'Glass manufacturing',
    location: 'Kópavogur / Hella',
    region: 'Capital Region / South',
    established: 'Est. 1969',
    currentUrl: 'https://www.samverk.is',
    ownerEmail: 'samverk@samverk.is',
    concept: 'Ljósbrot',
    conceptTagline:
      'Light refraction as the whole design language — every real photo shown as a square glass "pane" with a hover glint, an interactive product index instead of a static grid.',
    accent: '#27639C',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://www.samverk.is/wp-content/uploads/2019/03/glerveggur5.jpg',
    audit: {
      strengths: [
        'Real, genuinely excellent installation photography already exists (mirrors, shower glass, office glass walls, railings) — just buried and underused',
        'A real, strong story: founded 1969, both the oldest AND the largest glass workshop in Iceland',
        'Real logo is clean and usable as-is; CE-certified production, two facilities (Hella factory + Kópavogur showroom)',
      ],
      weaknesses: [
        'The homepage hero is a generic stock photo, despite far better real photography sitting further down the page',
        'One AI-generated image is mixed in with the real product photos',
        'A "Starfsfólk" (staff) heading on the About page has no content behind it at all',
      ],
      opportunities: [
        'Put the real installation photography front and center instead of stock imagery',
        'Make "founded 1969, oldest + largest in Iceland" the headline trust story instead of a buried paragraph',
        'Turn the flat product list into something that actually shows each product',
      ],
    },
    positioning:
      'Iceland\'s oldest and largest glass manufacturer, sitting on genuinely excellent real installation photography that its own site barely uses — leading with a stock hero image instead. The redesign puts Samverk\'s real photography, real 1969 founding story, and real logo at the center, with an interactive product index standing in for the static, repetitive category list.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Samverk',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég rakst á auglýsingu frá ykkur og ákvað í kjölfarið að skoða vefsíðuna ykkar. Þar komst ég að því að þið eruð bæði elsta og stærsta starfandi glerverksmiðja landsins, stofnuð 1969 af átta heimamönnum í Rangárþingi, og eigið margar mjög fínar myndir af ykkar eigin verkum, speglum, sturtugleri, glerveggjum og handriðum.

Mér fannst samt eins og núverandi vefsíða gerði þessu ekki alveg nógu góð skil. Forsíðumyndin er stök birtingamynd sem tengist ekki verksmiðjunni sjálfri, á meðan þessar fínu myndir af ykkar eigin vinnu liggja neðar á síðunni og fá minni athygli en þær eiga skilið.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur, byggða á ykkar eigin myndum og lógói. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Helsti munurinn er sá að myndirnar af ykkar eigin verkum fá að njóta sín strax í upphafi í stað þess að liggja neðarlega á síðunni, sagan frá 1969 er sögð strax í fyrstu andránni, og vöruúrvalið er sett upp þannig að hægt er að smella á hverja vöru og sjá hana beint í stað þess að lesa bara upptalningu.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'hudflur',
    route: '/preview/hudflur',
    name: 'Húðflúrstofa Norðurlands',
    sector: 'Húðflúrstofa',
    location: 'Gránufélagsgata 4, Akureyri',
    region: 'North',
    established: 'Frá 2011',
    currentUrl: 'https://www.facebook.com/hudflurstofanordurlands/',
    ownerEmail: 'hudflur@hudflur.net',
    concept: 'Fine Line',
    conceptTagline:
      'Fifteen years of steady hands in Akureyri, told as one continuous ink line drawn the length of the page.',
    accent: '#C22A2E',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        '15 years operating in Akureyri with a loyal following',
        '256 Facebook reviews at 88% recommend, an unusually strong track record for a single studio',
        'Active, engaged Instagram (2,300+ followers)',
      ],
      weaknesses: [
        'No website at all — everything lives on Facebook/Instagram',
        'No way to see the studio, browse styles or request a booking without DMing',
        'Zero presence in Google search for "tattoo Akureyri"',
      ],
      opportunities: [
        'A clean, modern one-page site that finally gives 15 years of reputation a proper home',
        'A simple style/service overview so people arrive knowing what to ask for',
        'A direct booking-request path instead of cold DMs',
      ],
    },
    positioning:
      'Fifteen years of real work and an 88% recommend rate deserve more than a Facebook wall. The site should feel as considered and modern as the studio itself: dark, confident, understated.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Húðflúrstofu Norðurlands',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég rakst á Húðflúrstofu Norðurlands og sá að þið hafið verið starfandi á Akureyri í hátt í fimmtán ár, með frábærar umsagnir og virkan hóp fylgjenda á samfélagsmiðlum. Því miður fann ég enga vefsíðu, aðeins Facebook og Instagram, sem þýðir að fólk sem leitar að húðflúrstofu á Akureyri gæti auðveldlega misst af ykkur.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að vefsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk finni ykkur á netinu, sjái hvað þið bjóðið upp á og geti haft samband án fyrirhafnar. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'una',
    route: '/preview/una',
    name: 'UNA Local Store',
    sector: 'Handverks- og gjafavöruverslun',
    location: 'Austurvegur 4, Hvolsvöllur',
    region: 'South',
    established: 'Frá 2015',
    currentUrl: 'https://una-local-product.business.site',
    ownerEmail: 'info@unalocalstore.com',
    concept: 'Litla rauða húsið',
    conceptTagline:
      'One small red Nissen hut on the Ring Road, packed with everything a hundred local hands have made.',
    accent: '#A5352B',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A genuinely distinctive landmark: a red Nissen hut on the Ring Road since 2015',
        'Family-run (Magnús & Rebekka) with strong local sourcing: over 100 local knitters',
        '92% recommend on Facebook, well-reviewed on TripAdvisor',
      ],
      weaknesses: [
        'No real website, just a bare, unstyled Google Business page',
        'No sense of what is actually inside before visiting — the range of wool, food, jewelry and gifts is invisible online',
        'An owner reply on TripAdvisor mentions wanting a proper website; it never arrived',
      ],
      opportunities: [
        'Show the range (wool, food, jewelry, skincare) so travellers plan a stop, not a drive-by',
        'Use the hut itself as the visual identity — it is genuinely memorable',
        'A simple hours + map + "what is in the hut" page fixes almost everything',
      ],
    },
    positioning:
      'A real family shop inside a landmark red hut on the Golden Circle route, selling work from a hundred local hands, and none of it visible online. The site should make the hut itself the hero.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir UNA Local Store',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég kynnti mér búðina ykkar í rauða skálanum á Hvolsvelli og fannst hún einstök. Handverk frá yfir hundrað prjónakonum, íslensk matvara og gjafavara, allt í einu litlu og eftirminnilegu húsi við þjóðveginn. Því miður er núverandi vefsíða bara ómótuð Google síða, þannig að ferðafólk sem er að skipuleggja stopp á leiðinni sér ekkert af þessu fyrirfram.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái hvað leynist í rauða húsinu áður en það keyrir framhjá, og að skálinn sjálfur fái að vera aðalsöguhetjan. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'fotografi',
    route: '/preview/fotografi',
    name: 'Fótógrafí',
    sector: 'Ljósmyndavöruverslun og gallerí',
    location: 'Skólavörðustígur 22, Reykjavík',
    region: 'Capital',
    established: 'Frá 2007',
    currentUrl: 'https://www.fotografi.is',
    ownerEmail: 'fotografi.iceland@gmail.com',
    concept: 'Framköllun',
    conceptTagline:
      'A tiny red shop of vintage cameras and vinyl, told the way a photograph reveals itself in the developer tray.',
    accent: '#B23327',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1563298258-c9b0371b55cc?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        '19 years in the same spot near Hallgrímskirkja, "the first of its kind in Iceland"',
        'A genuinely unique inventory: 300+ vintage cameras on the walls, a 1960s-80s vinyl collection, fine-art prints',
        'Owner-run by Ari Sigvaldason, a well-known independent story (left a 15-year career at RÚV to open it)',
      ],
      weaknesses: [
        'Dated Squarespace-era template that undersells a genuinely one-of-a-kind shop',
        'Reviewers report a buggy checkout that fails and needs retrying, a direct, quantifiable loss of print sales',
        'No real sense of the 300-camera wall or the atmosphere before visiting',
      ],
      opportunities: [
        "Let the shop's own atmosphere (cameras, vinyl, red walls) carry the design instead of a generic template",
        'Fix the actual thing costing them money: a smooth, working print-checkout flow',
        "Tell Ari's story, it is a strong, human reason to visit",
      ],
    },
    positioning:
      "One of Reykjavík's most singular little shops, undersold by a template site with a broken checkout. The site should feel like the shop itself: a print slowly resolving out of the developer tray.",
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Fótógrafí',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég kynnti mér Fótógrafí og fannst búðin einstök, gömlu myndavélarnar á veggjunum, vínylsafnið og prentin sem þið seljið. Þið hafið verið á sama stað við Skólavörðustíg í tæp tuttugu ár, sem er sjaldgæft og verðskuldar meira en núverandi vefsíða sýnir. Sumir sem hafa reynt að kaupa prent í gegnum síðuna segja að greiðsluferlið klikki og þurfi að reyna aftur, sem þýðir að þið eruð líklega að missa af sölu án þess að vita af því.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að búðin sjálf, andrúmsloftið og sagan þín, fái að vera í forgrunni, og að fólk geti keypt prent án vandræða. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'seljavellir',
    route: '/preview/seljavellir',
    name: 'Guesthouse Seljavellir',
    sector: 'Guesthouse & farm dining',
    location: 'Seljavellir, Höfn í Hornafirði',
    region: 'East',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://seljavellir.com',
    ownerEmail: 'reynirasg@gmail.com',
    concept: 'Einn dagur á Seljavöllum',
    conceptTagline:
      'A full day at a working Hornafjörður farm guesthouse, from blue hour quiet to aurora over Vestrahorn, with the glacier view rooms and breakfast times a dead website could never show.',
    accent: '#E8A33D',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1759675739458-6e5a4a60a117?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Real, working farm guesthouse with mountain and glacier view rooms, 8 minutes from Höfn and 72 km from Jökulsárlón',
        'Strong reputation: 8.6 "Fabulous" on Booking.com from over 2,000 reviews, ranked #3 of 21 B&Bs/inns in Höfn on Tripadvisor',
        'Genuinely photogenic real assets: golden hour farmland panoramas, mountain view rooms, an active Facebook page with real guest photos',
      ],
      weaknesses: [
        'seljavellir.com returns a live 404 on both http and https, with an expired SSL certificate and a derelict 2015 WordPress install underneath',
        'Every booking runs through Booking.com, Expedia and Airbnb, so the guesthouse pays OTA commission on every reservation instead of taking direct bookings itself',
        'Public contact is a personal Gmail address, and two different phone and email sets are floating around online with no owned site to state the facts once, clearly',
      ],
      opportunities: [
        "Replace the dead domain with a photo led site that finally answers guests' practical questions on breakfast, check in and rooms in one place",
        'Add a direct booking path to start pulling reservations back from OTA commission',
        'Turn the real farm setting and glacier view rooms into the visual identity instead of leaving guests to piece it together from Booking.com',
      ],
    },
    positioning:
      'Guesthouse Seljavellir is a real, multi room family guesthouse on a working farm outside Höfn, eight minutes from town and seventy two kilometres from Jökulsárlón, with an 8.6 rating across more than two thousand Booking.com reviews. Its own domain has been a dead 404 for years since its old WordPress site lapsed, so every guest who searches for it lands on Booking.com or Expedia instead. The redesign gives the farm a real home online built around its own light, from blue hour to the aurora over Vestrahorn, with breakfast times, room rates and a direct booking path finally in one place.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Guesthouse Seljavellir',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Ég kynnti mér gistiheimilið ykkar á Seljavöllum og fannst staðurinn einstakur, alvöru sveitabær rétt við þjóðveginn með útsýni yfir fjöll og jökla, aðeins 72 kílómetra frá Jökulsárlóni. Vissuð þið að seljavellir.com skilar núna bara 404 villu? Hver einasti gestur sem gúglar ykkur endar því hjá Booking.com og borgar þeim þóknun sem ætti að vera ykkar.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að gestir sjái fjöllin, jöklana og bóndabæinn áður en þeir bóka, og geti pantað beint hjá ykkur í stað þess að fara alltaf í gegnum Booking.com. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'langaholt',
    route: '/preview/langaholt',
    name: 'Hotel Langaholt',
    sector: 'Countryside hotel & restaurant',
    location: 'Ytri-Görðum, Staðarsveit, Snæfellsnes',
    region: 'West',
    established: 'Frá 1978',
    currentUrl: 'https://langaholt.is',
    ownerEmail: 'langaholt@langaholt.is',
    concept: 'Sjóndeildarhringurinn',
    conceptTagline:
      "A single unbroken Snæfellsnes horizon line runs the whole page, sky carrying the family's story since 1978 while the shore below carries real rooms, the daily catch and a nine hole links course.",
    accent: '#C9A468',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://langaholt.is/wp-content/uploads/2019/01/Velkomion-1024x768.jpg',
    audit: {
      strengths: [
        '48 year family run hotel, roughly 40 en suite rooms plus a 60 seat restaurant, bar and two lounges, ranked #1 hotel in Snæfellsbær on Tripadvisor',
        'A genuine coastal setting with its own 9 hole links golf course built in 1997, a five minute walk to the beach and real seal watching nearby at Ytri Tunga',
        'Kitchen sources fish straight from local Snæfellsnes fishermen, so the restaurant already has a strong, true story to tell',
      ],
      weaknesses: [
        'langaholt.is still shows the footer copyright frozen at 2019, seven years out of date',
        "Room and testimonial photos are broken, showing gray placeholder boxes instead of the hotel's own rooms",
        'Booking is pushed entirely off the domain to a third party godo.is widget, so the hotel has no native booking flow of its own',
      ],
      opportunities: [
        "Replace the broken photo boxes with the hotel's real, already photographed rooms and let guests actually see what they are booking",
        "Bring booking back onto the hotel's own site instead of handing every guest off to a separate widget",
        'Tell the real 48 year family story and the golf course and restaurant sourcing, assets almost no competitor in the area has',
      ],
    },
    positioning:
      "Hotel Langaholt is a genuine, 48 year old family run hotel on the Snæfellsnes coast, with roughly 40 en suite rooms, a 60 seat restaurant sourcing fish from local fishermen, and its own 9 hole links golf course, already rated the best hotel in Snæfellsbær. Its website has been frozen since 2019, with broken placeholder images where real room photos should be and booking pushed entirely off the domain to a third party widget. The redesign turns the coastline itself into the site's spine, an unbroken horizon line carrying the family's story above and the real rooms, kitchen and golf course below.",
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Hótel Langaholt',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Ég kynnti mér Hótel Langaholt og fannst frábært að þið hafið rekið staðinn í næstum fimmtíu ár, með eigin golfvelli og eldhúsi sem kaupir fiskinn beint af sjómönnum á Snæfellsnesi. Á langaholt.is stendur enn © 2019 og herbergin á besta hóteli Snæfellsbæjar birtast sem gráir kassar, á meðan Booking tekur þóknun af hverri einustu bókun.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að gestir sjái alvöru herbergin, ströndina og golfvöllinn áður en þeir bóka, og að fleiri bóki beint hjá ykkur í stað þess að borga Booking þóknun af hverri nóttu. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'fiskkompani',
    route: '/preview/fiskkompani',
    name: 'Fisk Kompaní',
    sector: 'Fish & deli retail, two shops',
    location: 'Kjarnagata 2 & Glerártorg, Akureyri',
    region: 'North',
    established: 'Frá 2013',
    currentUrl: 'https://www.fiskkompani.is',
    ownerEmail: 'fiskkompani@fiskkompani.is',
    concept: 'Dagsins afli, loksins á netinu',
    conceptTagline:
      'The real fish counter in Akureyri, its own five year old "opening soon" placeholder finally paid off with a working shop, and the new Ólafsfjörður smokehouse story told in drifting smoke.',
    accent: '#D9552B',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://veitingageirinn.is/wp-content/uploads/2023/02/opnun-fisk-kompani.jpg',
    audit: {
      strengths: [
        'A real, growing business: two staffed shops in Akureyri plus an April 2026 acquisition of an Ólafsfjörður salmon and Arctic char smokehouse',
        'Founded in 2013 by four local partners, over a decade of trading with roughly 8,400 Facebook followers and a loyal fresh fish and deli following',
        'Genuinely photogenic counter and product displays, real opening day and press photography already exists to build from',
      ],
      weaknesses: [
        'fiskkompani.is redirects to a password gated Shopify placeholder that has read "Opnum vefverslunina fljótlega" for years, with no products, photos or store info',
        'The second location at Glerártorg is not represented anywhere on the domain at all',
        'No online ordering exists despite the placeholder literally promising a web store',
      ],
      opportunities: [
        'Finally deliver the web store the placeholder has promised for years, built around the real counter and both real shop locations',
        'Tell the Ólafsfjörður smokehouse acquisition as a fresh, active growth story',
        'Turn thousands of Facebook followers into a proper site people can actually shop from',
      ],
    },
    positioning:
      "Fisk Kompaní is a real, growing fish and deli retailer with two staffed shops in Akureyri and a fresh 2026 acquisition of a salmon and Arctic char smokehouse in Ólafsfjörður, built on over a decade of trading since 2013. Its own domain has redirected for years to a password gated Shopify placeholder promising an online store that never arrived, with no products, photos or even a mention of the second shop. The redesign finally finishes that promise: a real photo led shop built around the counter, both locations and the new smokehouse story.",
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Fisk Kompaní',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk matvælafyrirtæki.

Ég kynnti mér Fisk Kompaní á Akureyri og sá að þið hafið vaxið jafnt og þétt síðan 2013, núna með tveimur verslunum og nýkeyptu reykhúsi á Ólafsfirði. Í dag tekur lykilorðssíða á móti þeim sem heimsækja fiskkompani.is, en vefverslunin er á leiðinni í loftið.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu með vefverslun fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk geti verslað hjá ykkur á netinu frá fyrsta degi, séð báðar búðirnar og kynnst nýja reykhúsinu á Ólafsfirði. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'naustid',
    route: '/preview/naustid',
    name: 'Naustið',
    sector: 'Seafood restaurant',
    location: 'Ásgarðsvegur 1, Húsavík',
    region: 'North',
    established: 'Síðan um 2011',
    currentUrl: 'https://www.facebook.com/naustid/',
    ownerEmail: 'naustidfood@gmail.com',
    concept: 'Gula húsið við höfnina',
    conceptTagline:
      "Húsavík's number one rated seafood restaurant approached the way every guest already finds it, across the harbour toward the bright yellow house, with the signature soup on the table by the time you arrive.",
    accent: '#F0B429',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://visit-husavik.payload.is/api/media/file/Exterior%20PNG-2000x1125.png',
    audit: {
      strengths: [
        'Ranked #1 of 13 restaurants in Húsavík on Tripadvisor with thousands of reviews, plus a 4.8 rating on Restaurant Guru',
        'A genuinely distinctive, photogenic home: a bright yellow 1931 harbourside house called Sel, run by two sisters in law for over a decade',
        'A real signature dish, the seafood soup, repeatedly named by reviewers as the reason people stop',
      ],
      weaknesses: [
        "No independent website at all, já.is lists their official 'website' as literally a link to their Facebook page",
        'No online menu, so a top rated destination restaurant has nowhere to show its own dish list or price range',
        'No booking path beyond phone or walk in, despite being a stop on the busy Diamond Circle tourist route',
      ],
      opportunities: [
        "Give Húsavík's #1 rated restaurant an actual home online, built around the real yellow house and the signature soup",
        'Publish the real menu and hours once, on a page the owners control instead of Facebook',
        'Add a simple reservation request path for the travellers already driving the Diamond Circle to find them',
      ],
    },
    positioning:
      "Naustið is Húsavík's top rated restaurant, run by two sisters in law for over a decade out of a bright yellow 1931 harbourside house, with a seafood soup that reviewers name again and again as the reason to stop. Their entire web presence today is a Facebook page, and já.is even lists it as their official website. The redesign gives them a real home online: the same walk every guest already takes across the harbour toward the yellow house, ending at a real menu, hours and a place to request a table.",
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Naustið',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús.

Ég kynnti mér Naustið á Húsavík og sá að þið eruð í 1. sæti af 13 veitingastöðum á staðnum með yfir 2.500 umsagnir, sem er magnaður árangur. Samt er eina „vefsíðan" ykkar samkvæmt já.is einfaldlega hlekkur á Facebook.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái gula húsið, matseðilinn og fiskisúpuna sem allir tala um, og geti sent inn borðapöntun beint til ykkar. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'alfacafe',
    route: '/preview/alfacafe',
    name: 'Álfacafé',
    sector: 'Seasonal café',
    location: 'Bakkagerði, Borgarfjörður eystri',
    region: 'East',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.facebook.com/alfacafe/',
    ownerEmail: 'alfacafe@simnet.is',
    concept: 'Á mörkum heima',
    conceptTagline:
      "A seasonal café standing at the literal threshold between the village of Bakkagerði and Álfaborg, home of Iceland's elf queen, finally telling visitors in one glance whether the door is open today.",
    accent: '#C97A2E',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://img02.restaurantguru.com/cefc-ALFACAFE-Borgarfjor-ur-Eystri-dishes.jpg',
    audit: {
      strengths: [
        'A beloved, top rated destination: 4.8 out of 5 from 422 Google reviews, ranked #1 restaurant in Borgarfjörður eystri',
        "A genuinely distinctive setting, right beside Álfaborg, the hill of Icelandic elf folklore, and a short drive from the Hafnarhólmi puffin colony",
        'A real signature dish, the fish soup, named specifically in review after review as the reason to make the long drive out',
      ],
      weaknesses: [
        'No owned website exists at all, just a Facebook page and scattered directory listings',
        'Opening hours conflict across sources, one lists a summer season and another lists year round hours, risking a wasted trip for a remote village hours from Reykjavík',
        'Phone numbers differ across several directory listings with no single canonical source to trust',
      ],
      opportunities: [
        "Give visitors one clear, always current answer to whether it is open today before they drive hours out",
        'Let the real fish soup, waffles and elf folklore setting carry the page instead of scattered third party listings',
        'Replace the conflicting phone numbers with one clear, correct contact',
      ],
    },
    positioning:
      "Álfacafé is a beloved seasonal café in the tiny village of Bakkagerði, sitting right beside Álfaborg, the hill where Icelandic folklore places the home of the elf queen, and rated 4.8 out of 5 across more than 400 Google reviews for its fish soup. It has no owned website at all, only a Facebook page and directory listings that openly disagree on its hours and phone number, a real risk for visitors driving hours each way. The redesign gives it one clear, honest home online: real hours, a real phone number, and the elf lore and puffins next door woven into the same page as the soup and the drive out.",
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Álfacafé',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús.

Ég kynnti mér Álfacafé og sá að þið eruð með 4,8 stjörnur af 422 umsögnum á Google, sem er frábær árangur fyrir stað svona langt úti á landi. Á netinu stangast þó opnunartímarnir ykkar á milli síðna, og gestir sem keyra alla þessa leið enda stundum í óvissu um hvort opið sé.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að hver sem gúglar ykkur sjái strax hvort opið sé í dag, og kynnist fiskisúpunni, Álfaborg og lundunum í leiðinni. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'setberg',
    route: '/preview/setberg',
    name: 'Setberg Guesthouse',
    sector: 'Farm guesthouse',
    location: 'Setbergi, Nesjum, 781 Höfn í Hornafirði',
    region: 'East',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.booking.com/hotel/is/setberg-guesthouse.html',
    noOwnSite: true,
    ownerEmail: 'setberg1@gmail.com',
    concept: 'Bærinn undir fjallinu',
    conceptTagline:
      'A 9.4-rated farm guesthouse under the East Iceland mountains, finally getting to introduce itself in its own voice instead of being spoken for by booking agents every time someone searches its name.',
    accent: '#C97B45',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1581094987116-97a1b02c36d4?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        '9.4/10 on Booking.com across 280 verified reviews, with cleanliness, comfort and staff all scoring 9.8',
        'A genuinely distinctive setting, a former sheep farm at the foot of the mountains near Höfn, run by host Stefán',
        'A registered, active company (Setberg 1 ehf) with no bankruptcy or closure history found',
      ],
      weaknesses: [
        'No real homepage of their own, only a generic third-party booking-widget microsite and OTA listings speak for them',
        'Completely dependent on OTA commission, Booking.com, Airbnb, Expedia and Hotels.com all list the property with no direct-booking channel',
        'Only public contact is a personal Gmail address, not a business email tied to any domain',
      ],
      opportunities: [
        'Give the farm its first real chance to speak for itself online, instead of being described secondhand by booking agents',
        'Capture direct bookings currently lost entirely to OTA commission',
        'Own the search results for a Höfn farm guesthouse, a term every top result today sends to a third party',
      ],
    },
    positioning:
      'Setberg is a 9.4-rated farm guesthouse at the foot of the mountains near Höfn, with 280 reviews praising its cleanliness, comfort and staff, yet it has no real homepage speaking in its own voice, only a generic booking-widget microsite and OTA listings. Every search result today leads to a booking agent speaking on the farm’s behalf, and every stay pays a commission to a third party. The redesign gives Setberg its first real home online, a quiet, honest introduction in the farm’s own voice, with a direct path to book a room without the middleman.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Setberg',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Ég kynnti mér Setberg og sá að þið eruð með 9,4 í einkunn á Booking.com eftir 279 umsagnir, sem er frábær árangur. Samt á Setberg enga heimasíðu sem talar í eigin röddu, aðeins bókunarsíður sem tala fyrir ykkar hönd og taka þóknun af hverri bókun.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að Setberg fái loksins að kynna sig sjálft, í eigin röddu, í stað þess að bókunarsíður tali fyrir ykkur, og að gestir geti bókað beint hjá ykkur. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'nypugardar',
    route: '/preview/nypugardar',
    name: 'Nýpugarðar',
    sector: 'Farm guesthouse & dinner buffet',
    location: 'Nýpugörðum, Mýrar, Hornafjörður',
    region: 'East',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.facebook.com/nypugardar/',
    ownerEmail: 'nypu@simnet.is',
    concept: 'Kvöldverðurinn á Mýrum',
    conceptTagline:
      'One evening at a working sheep and horse farm between Höfn and the glacier lagoon, arriving among the animals, watching the light fall on the ice, then sitting down to the lamb dinner buffet guests keep raving about.',
    accent: '#D97D3D',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/10523864.jpg?k=2e21596f72fdae8178942f8e63817dfaa86ab9c4c383b883323636aad39aa600&o=',
    audit: {
      strengths: [
        '8.8/10 on Booking.com across roughly 2,200 reviews, with the lamb dinner buffet named again and again as the reason to stop',
        'A real working farm setting, about 600 sheep and 20 horses, with glacier and fjord views on the property',
        'A registered, active company (Nýpugarðar ehf) with no adverse history found',
      ],
      weaknesses: [
        'No website of their own at all, not even a weak one, just a Facebook page',
        'Every booking runs through third-party OTAs, Booking.com, Guide to Iceland and Expedia, with no direct contact path of their own',
        'Their only real presence, a Facebook page, shows no menu, photos or dinner buffet details to visitors',
      ],
      opportunities: [
        'Turn thousands of glowing reviews and an 8.8 rating into an actual bookable, discoverable website',
        'Let the lamb dinner buffet and the farm’s sheep, horses and glacier views carry the page instead of a bare Facebook post',
        'Move guests from OTA-only bookings toward a direct path that keeps more of every stay on the farm',
      ],
    },
    positioning:
      'Nýpugarðar is a working sheep and horse farm between Höfn and Jökulsárlón, rated 8.8 on Booking.com across roughly 2,200 reviews, with guests repeatedly singling out the farm dinner buffet and lamb as the highlight of their stay. They have no website of their own at all, and their only real presence is a sparse Facebook page, so every booking runs through a third-party OTA. The redesign gives the farm a real home online built around one evening there, arriving among the animals, watching the glacier catch the light, then sitting down to the dinner guests already cannot stop talking about.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Nýpugarða',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu og matvælaframleiðslu.

Ég kynnti mér Nýpugarða og sá að gestir hæla lambahlaðborðinu ykkar sérstaklega í umsögnum, enda eruð þið með 8,8 í einkunn á Booking.com eftir rúmlega 2.200 umsagnir. Samt er eina vefsvæðið ykkar í dag Facebook síða, og allar bókanir fara í gegnum Booking sem tekur þóknun af hverri þeirra.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að gestir upplifi kvöldið hjá ykkur áður en þeir mæta, sauðféð og hestana, jökulinn í kvöldsólinni og svo sjálft hlaðborðið, og geti bókað beint hjá ykkur í stað þess að fara í gegnum Booking. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'litlahof',
    route: '/preview/litlahof',
    name: 'Litla-Hof',
    sector: 'Farm guesthouse',
    location: 'Hof í Öræfum, near Skaftafell',
    region: 'East',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.facebook.com/p/Litla-Hof-Guesthouse-100070911662749/',
    ownPhotography: true,
    ownerEmail: 'litlahof@simnet.is',
    concept: 'Hjá torfkirkjunni',
    conceptTagline:
      'The same slow drive up to a small horse and sheep farm beside Iceland’s youngest turf church, under the shadow of Öræfajökull, that five star guests already describe in their reviews, told properly for the first time.',
    accent: '#8B3A2B',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/316584266.jpg?k=63cca7a1c701066d6ee93caeee99a35f25b31682705f65747bbdc50d630ec39d&o=',
    audit: {
      strengths: [
        '5 out of 5 on Tripadvisor, ranked #2 of 3 B&Bs in Hof, with guests calling the stay the favourite of their whole trip',
        'A genuinely rare setting, a working horse and sheep farm beside Iceland’s youngest turf church, in the shadow of Öræfajökull',
        'A registered, active company (Litla Hof ehf) with no adverse history found, and a confirmed horse breeding line carrying the farm’s name',
      ],
      weaknesses: [
        'No owned website at all, entirely dependent on OTA middlemen, Booking.com, Agoda and heyiceland, for discovery and booking',
        'Only contact path is a dated simnet.is email address and a phone number, no booking form of any kind',
        'Nothing online conveys the working farm, the turf church next door or the mountain setting that guests keep mentioning',
      ],
      opportunities: [
        'Turn a 5-star, "favourite of the trip" guesthouse into one that finally has its own home online',
        'Tell the story no OTA listing tells, the turf church, the horse breeding line, the farm under Iceland’s highest peak',
        'Add a direct booking path that keeps the margin OTAs currently take on every stay',
      ],
    },
    positioning:
      'Litla-Hof is a small working horse and sheep farm beside one of Iceland’s last turf churches, in the shadow of Öræfajökull, rated 5 out of 5 on Tripadvisor with guests calling it the favourite stop of their whole trip. It has no website of its own, only OTA listings and a thin Facebook page, and a dated simnet.is email address is the only way to reach them directly. The redesign turns the slow drive up to the farm that guests already describe in their reviews into a real page, the turf church, the horses, the mountain, and one clear way to book a stay.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Litla-Hof',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki í ferðaþjónustu.

Ég kynnti mér Litla-Hof og sá að gestir gefa ykkur 5 stjörnur á Tripadvisor og kalla dvölina hápunkt ferðarinnar. Samt finnst Litla-Hof hvergi á netinu nema á bókunarsíðum annarra, því þið eigið enga eigin vefsíðu.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái sömu rólegu leiðina heim að bænum sem gestir lýsa í umsögnum sínum, torfkirkjuna, hestana og fjallið, og geti spurst fyrir um gistingu beint hjá ykkur. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'sagakayak',
    route: '/preview/sagakayak',
    name: 'Saga Kayak',
    sector: 'Kayak & fishing tours',
    location: 'Lónabraut 5, Vopnafjörður',
    region: 'East',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.instagram.com/sagakayak/',
    ownerEmail: 'contact@sagakayak.is',
    concept: 'Róið inn fjörðinn',
    conceptTagline:
      'A family-run kayak outfit on Vopnafjörður fjord, where the page itself follows the same paddle route out, from the dock to open water, that a real trip with them takes.',
    accent: '#E8734F',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1724865054227-6a5f2449f856?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'An active, well-run Instagram presence, 326 followers and 64 posts, covering kayak, fishing and northern-lights trips across multiple seasons',
        'A distinctive fjord setting in Vopnafjörður, with real photos of the owners and the boat launch already in hand',
        'Still listed as a current operator on Visit Austurland’s official regional tourism site',
      ],
      weaknesses: [
        'Their own domain, sagakayak.is, is a dead, password-protected placeholder that has never launched',
        'No online booking system at all, trips are booked only by direct message, email or phone',
        'The only pricing information anywhere is a photo of a hand-written price list on Instagram',
      ],
      opportunities: [
        'Replace the dead placeholder domain with a real, bookable website built around the fjord and the family story',
        'Turn the hand-written price list into clear, structured pricing for kayak, fishing and aurora trips',
        'Capture travellers who plan and book online before they arrive, rather than relying on a chance direct message',
      ],
    },
    positioning:
      'Saga Kayak is a small, family-run kayak and fishing tour operator on Vopnafjörður fjord in East Iceland, active on Instagram across multiple seasons but with no real website of their own, their own domain is a password-protected placeholder that never launched. Every trip today is booked by direct message, email or phone, and the only pricing anywhere is a photo of a hand-written list. The redesign turns their real fjord setting and family story into a proper page, the same paddle out from the dock to open water that a real trip with them follows, ending at a clear way to book.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Saga Kayak',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Ég kynnti mér Saga Kayak og sá að ferðirnar ykkar bókast í dag í gegnum skilaboð og síma. Ferðafólk sem skipuleggur fyrirfram á netinu bókar oftast hjá þeim sem sýna ferðir og verð beint á vefsíðu, og eigin lén ykkar, sagakayak.is, er ennþá óopnuð biðsíða.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái fjörðinn, ferðirnar þrjár og verðin á augabragði, og geti sent inn bókunarbeiðni beint til ykkar. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'saudakofinn',
    route: '/preview/saudakofinn',
    name: 'Sauðakofinn á Fossnesi',
    sector: 'Smokehouse & farm tourism',
    location: 'Fossnes, 804 Selfoss',
    region: 'South',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.fossnes.is/saudakofinn/',
    ownerEmail: 'sigrunfossnes@gmail.com',
    concept: 'Reykurinn í kofanum',
    conceptTagline:
      'The old smoke shed and its slow, twice-smoked ritual set the whole page’s rhythm, opening on the meat and its price list within the first screen before the farm’s other real chapters, the guesthouse, the horses, the river, clear into view underneath.',
    accent: '#A8481A',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://www.fossnes.is/wp-content/uploads/2013/02/Haust-2012-252.jpg',
    audit: {
      strengths: [
        'A genuinely rare product, tvíreykt sauðakjöt (double-smoked wether meat), actively priced and updated for autumn 2025',
        'A diversified real farm business, smokehouse, guesthouse, horses and fishing, all run from the same family farm',
        'A registered member of the Icelandic Sheep Farmers Association (SSFM) with a confirmed kennitala and no adverse history',
      ],
      weaknesses: [
        'The site is an early-2000s WordPress template, with the newest photos on the page still dated 2013',
        'No online ordering of any kind, meat, guesthouse stays and fishing trips are all phone or email only',
        'The whole multi-part farm business is spread across thin, sparsely written sub-pages with no mobile-friendly layout',
      ],
      opportunities: [
        'Let the rare double-smoked product and its price list be seen clearly on a phone, not buried in a 2000s-era layout',
        'Surface the farm’s other real assets, the guesthouse, the horses, the fishing, as one cohesive rural brand',
        'Replace phone-and-email-only ordering with a simple way to see what is available and ask to buy or book',
      ],
    },
    positioning:
      'Sauðakofinn is a small family farm at Fossnes producing tvíreykt sauðakjöt, a rare double-smoked wether meat, alongside a guesthouse, horses and fishing, all confirmed still active with autumn 2025 pricing. Their entire online presence is a handful of thin pages on an early-2000s WordPress template, with no online ordering and photos dating back to 2013. The redesign puts the smoking ritual and the meat itself in the first screen, then slowly reveals the farm’s other chapters underneath, the same way real smoke clears to show what is there.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Sauðakofann á Fossnesi',
      body: `Góðan dag Sigrún,

Ég heiti Sindri og hanna vefsíður fyrir íslensk matvælafyrirtæki og ferðaþjónustu.

Ég kynnti mér Sauðakofann og sá að tvíreykta sauðahangikjötið ykkar á sér fastan aðdáendahóp. Samt er vefsíðan ykkar í dag gömul sniðmátssíða þar sem nýjustu myndirnar sem ég finn eru frá 2013, og erfitt er að sjá vörurnar, verðin og hvernig maður pantar.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að kjötið og verðskráin sjáist strax, og að hitt sem þið gerið á Fossnesi, gistingin, hestarnir og veiðin, fái sinn stað á sömu síðu. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'ljomalind',
    route: '/preview/ljomalind',
    name: 'Ljómalind Local Market',
    sector: 'Farmers & artisan co-op market',
    location: 'Brúartorg 4, 310 Borgarnes',
    region: 'West',
    established: 'Síðan 2013',
    currentUrl: 'https://www.ljomalind.is',
    ownerEmail: 'ljomalind@ljomalind.is',
    concept: 'Beint frá héraðinu',
    conceptTagline:
      'Every shelf on the market floor becomes a small map back to the farm or workshop that made it, wool, cheese, honey and pottery from real West Iceland producers, replacing a domain that today loads nothing but a bare hosting placeholder.',
    accent: '#C4472A',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1595279521754-4b0f9a6bb10b?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'A 13-year-old market, opened 17 May 2013, run as a genuine co-op of around 70 local West Iceland producers selling wool, cheese, honey, pottery and preserves',
        'A 4.0 out of 5 rating on TripAdvisor from 40 reviews, with dated 2025 visitor reviews still praising the real local products',
        'Confirmed active today on West Iceland’s own tourism directories, west.is and ferdalag.is, and on já.is, all showing matching daily 10:00 to 18:00 hours',
      ],
      weaknesses: [
        'Their own domain, ljomalind.is, loads nothing but a bare hosting-provider placeholder, and the older /en/ path now returns a 404',
        'No product or vendor showcase anywhere online despite around 70 real producers selling inside the market',
        'No booking or contact form on the owned domain, so all the real traffic value from TripAdvisor and the tourism boards dead-ends at a page with no content',
      ],
      opportunities: [
        'Replace the placeholder with a warm, photo-led site that shows the market’s real shelves and the producers behind them',
        'Turn the wall of hand-dyed wool, the Alrún capes and the jars of jam into a proper, browsable product index',
        'Capture the tourist traffic already pointed at Ljómalind by west.is and TripAdvisor with a real destination instead of a dead end',
      ],
    },
    positioning:
      'Ljómalind is a 13-year-old co-op market in Borgarnes where around 70 West Iceland producers sell wool, cheese, honey, pottery and preserves under one roof, rated 4.0 on TripAdvisor and still listed as active on every regional tourism directory. Its own domain, ljomalind.is, currently loads nothing but a generic hosting placeholder, so none of that real activity is visible anywhere the business actually controls. The redesign turns the market’s real shelves into a living index of its producers, the same wall of wool and jam a visitor sees walking through the door, so the market finally has a front door of its own online.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Ljómalind',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenskar verslanir og ferðaþjónustu.

Ég kynnti mér Ljómalind og sá að þið seljið vörur frá tugum framleiðenda í héraðinu, ull, osta, hunang, leirmuni og sultur, og eruð með 4,0 í einkunn á TripAdvisor. Samt er heimasíðan ykkar, ljomalind.is, í dag aðeins auð biðsíða frá hýsingaraðila, þannig að ekkert af þessu sést á ykkar eigin vef.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái hillurnar ykkar eins og þær eru í alvörunni, fullar af vörum frá alvöru framleiðendum, og viti strax hverjir standa á bak við þær. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'bjarkalundur',
    route: '/preview/bjarkalundur',
    name: 'Hótel Bjarkalundur',
    sector: 'Historic hotel, restaurant & campsite',
    location: 'Bjarkalundi, 381 Reykhólahreppur',
    region: 'Westfjords',
    established: 'Síðan 1947',
    currentUrl: 'https://www.hotelbjarkalundur.is',
    ownerEmail: 'info.hotelbjarkalundur@gmail.com',
    concept: 'Hliðið að Vestfjörðum',
    conceptTagline:
      'The twin peaks of Vaðalfjöll and the hotel’s real forest-green lounges carry the arrival from road to gate to table, telling both the 1947 heritage and the fresh 2026 reopening as one continuous story instead of a Wix icon list.',
    accent: '#B08A3E',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://static.wixstatic.com/media/3d6816_9fcd9dd021f5427fa264407d12d5094a~mv2.jpg',
    ownPhotography: true,
    audit: {
      strengths: [
        'Iceland’s oldest continuously built summer hotel, raised 1945 to 1947 at the foot of Vaðalfjöll, corroborated by Vísir (2016), mbl.is (2025) and the hotel’s own history page',
        'A genuine 2026 relaunch, reopened 1 April 2026 under new owner Sigurður Friðriksson, confirmed by regional press and current 2026 pricing across Booking.com, Klook, Hotels.com and Expedia',
        '128 reviews on Booking.com and a full set of amenities already running, restaurant, bar, café, garden, campsite and EV charger',
      ],
      weaknesses: [
        'A mid-2010s Wix template with plain icon lists and a stacked photo gallery, the footer still shows a static, unmaintained “©2026 by Hotel Bjarkalundur” placeholder string',
        'No room pricing or availability shown on the hotel’s own site, booking is handed off entirely to a separate portal, property.godo.is, with no visual continuity',
        'Public contact is a personal Gmail address, info.hotelbjarkalundur@gmail.com, not a business-domain email, for a hotel with this much heritage',
      ],
      opportunities: [
        'Tell the two-part story a Wix template cannot, the 1947 heritage and the fresh 2026 reopening, through real Westfjords photography instead of icon lists',
        'Give the hotel a proper booking flow, or at least a designed handoff to the booking portal, instead of a bare external link',
        'Rebuild search visibility from scratch under the new ownership with a business-domain email and a site that actually represents the property',
      ],
    },
    positioning:
      'Hótel Bjarkalundur is Iceland’s oldest continuously built summer hotel, raised at the foot of Vaðalfjöll in the Westfjords between 1945 and 1947, and freshly reopened on 1 April 2026 under new owner Sigurður Friðriksson. The hotel is genuinely and currently operating, bookable today across Booking.com, Klook, Hotels.com and Expedia, but its own site is a mid-2010s Wix template with no room pricing, an external booking handoff, and a personal Gmail contact address. The redesign carries the arrival from road to gate to table as one continuous story, the twin peaks outside, the forest-green lounges inside, telling both the 1947 heritage and the 2026 fresh start honestly.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Hótel Bjarkalund',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk hótel og ferðaþjónustu.

Ég kynnti mér Hótel Bjarkalund og sá að þið rekið eitt elsta starfandi sumarhótel landsins, byggt á árunum 1945 til 1947 við rætur Vaðalfjalla, og opnuðuð það aftur í apríl á þessu ári. Núverandi vefur nær samt hvorki að segja þessa sögu né að sýna herbergin og veitingastaðinn eins og þau eiga skilið, öll bókun fer í gegnum utanaðkomandi kerfi og engin verð sjást á síðunni sjálfri.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að fólk sjái fjöllin, herbergin og salinn eins og þau eru í alvörunni, og finni strax leiðina að því að bóka. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'kauptun',
    route: '/preview/kauptun',
    name: 'Kauptún',
    sector: 'Grocery & general store',
    location: 'Hafnarbyggð 4, 690 Vopnafjörður',
    region: 'East',
    established: 'Síðan 1988',
    currentUrl: 'https://www.facebook.com/Kauptun/',
    noOwnSite: true,
    currentLabel: 'Það er aðeins með Facebook-síðu',
    photoCredit:
      'Ljósmyndir eru fréttamyndir af versluninni og eigendum, myndir af Vopnafirði af Wikimedia Commons, og tvær sýnishornsmyndir frá Unsplash.',
    ownerEmail: 'kauptun@kauptun.net',
    concept: 'Hjartað í þorpinu',
    conceptTagline:
      'The one shop holding a 650-person fjord village together gets a real front door online, hours, fresh bakery and the everything’s-here feeling of walking through its actual doors, replacing a domain that has never resolved.',
    accent: '#B8432A',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://austurfrett.is/images/allar_frettir/frettir/kaupt%C3%BAn.jpg',
    audit: {
      strengths: [
        'The town’s only grocery store for around 650 residents in Vopnafjörður, confirmed active with current hours on the municipality’s own services page',
        'A real rescue story, new owners Berghildur Fanney Oddsson Hauksdóttir and Eyjólfur Sigurðsson bought the store in 2020 to keep it open, backed by a 5.2 million ISK rural-store grant in 2021',
        'Listed as an active Landsbankinn Aukakrónur rewards partner and confirmed active in both company registries, with no bankruptcy or closure history found',
      ],
      weaknesses: [
        'No website exists at all, kauptun.net does not even resolve, it is only used as an email suffix',
        'The only public digital footprint is directory listings on já.is and 1819.is, showing phone and fax as the most current contact channels',
        'Instagram has a single post and 15 followers since the account was created, with no way anywhere to see hours, products or the bakery',
      ],
      opportunities: [
        'Give the town’s only grocery store its first real front door online, hours, the in-house bakery, and how to reach it',
        'Tell the 2020 rescue story honestly, a store that has to exist because the alternative is a 150 km drive for milk',
        'Replace directory listings and a dormant Instagram with one warm, photo-led page for both locals and visitors passing through',
      ],
    },
    positioning:
      'Kauptún is the only grocery store serving roughly 650 residents in Vopnafjörður, in continuous operation since 1988 and kept open by a 2020 ownership rescue and a 2021 rural-store grant. The business has no website at all, kauptun.net does not even resolve, and its entire public footprint is a handful of directory listings and a nearly dormant Instagram account. The redesign gives the village’s one essential shop a real digital front door, hours, the in-house bakery, and the everything’s-here feeling of walking through its actual doors.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Kauptún',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenskar verslanir og fyrirtæki á landsbyggðinni.

Ég kynnti mér Kauptún og sá að þið eruð verslunin sem heldur Vopnafirði gangandi, eina búðin í þorpinu. Samt finnst nánast ekkert um ykkur á netinu, hvorki opnunartími, bakkelsið né hvað er til hverju sinni, aðeins gamlar skráningar í símaskrá.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að hver sem er, hvort sem hann býr á Vopnafirði eða er á leiðinni þangað, sjái strax hvort opið sé og hvað er í búðinni. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'issi',
    route: '/preview/issi',
    name: 'Issi Fish & Chips',
    sector: 'Fish & chips restaurant',
    location: 'Fitjar 3, Njarðvík, Reykjanesbær',
    region: 'Reykjanes',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://issi.is',
    ownerEmail: 'issi@issi.is',
    concept: 'Beint af bátnum',
    conceptTagline:
      'The real order window at dusk, the glow of the fryer and Þorbjörn’s boat rocking in the swell an hour up the coast carry the whole page, replacing a layout that leaves half the screen blank on desktop and overlaps text on phones.',
    accent: '#E0B004',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://issi.is/wp-content/uploads/2021/04/issi_fitjar_snjor.jpg',
    ownPhotography: true,
    audit: {
      strengths: [
        'Named a 2026 finalist in the UK National Fish and Chip Awards’ International category, confirmed by Iceland Review, RÚV and fishfocus.co.uk in February and March 2026',
        '1,183 reviews at 4.9 out of 5 on RestaurantGuru and 4.7 on Tripadvisor, ranked number 1 of 3 in Njarðvík, with continuing 2026 review activity',
        'Real, characterful owner photography already in hand, the bearded chef, the glowing shop at night, fish mid-fry in the pan',
      ],
      weaknesses: [
        'The site is fixed-width, not truly responsive, a 1600px desktop screen crams everything into a roughly 1000px column with a large blank dead zone beside it',
        'On a real phone screen the same fixed-width container still does not reflow, and the tagline visually overlaps the logo and the menu icon',
        'No phone number visible on the homepage itself, and no online ordering path beyond a single email for catering and events',
      ],
      opportunities: [
        'Fix the responsive break properly so the site actually works on the phones most customers are using',
        'Lead with the real photography and the 2026 award credibility instead of burying it in a broken layout',
        'Add simple, self-editable menu and hours management across both locations',
      ],
    },
    positioning:
      'Issi Fish & Chips is a real, owner-operated fish and chips business in Njarðvík and Selfoss, a 2026 finalist in the UK National Fish and Chip Awards’ International category and rated 4.9 out of 5 across more than a thousand reviews. Their own site, issi.is, is fixed-width rather than responsive, leaving a large blank dead zone on desktop and overlapping text on phones, with no phone number on the homepage. The redesign leads with their real photography, the bearded owner at the order window, the glow of the fryer at dusk, and fixes the layout so the site works as well on a phone as the food does at the counter.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Issi Fish & Chips',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk veitingahús.

Ég kynnti mér Issi Fish & Chips og sá að þið komust í úrslit í alþjóðlegum flokki bresku fish and chips verðlaunanna 2026 og eruð með 4,9 í einkunn á Google. Vefurinn ykkar heldur samt ekki í við matinn, í símanum leggst textinn á forsíðunni yfir merkið ykkar og símanúmerið sést hvergi á síðunni.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að myndirnar ykkar og matseðillinn fái loksins að njóta sín, og að fólk finni strax símanúmerið, opnunartímann og staðsetninguna í símanum. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
  {
    slug: 'hunabud',
    route: '/preview/hunabud',
    name: 'Húnabúð',
    sector: 'Café, flower shop & gift shop',
    location: 'Norðurlandsvegur 4, 540 Blönduós',
    region: 'North',
    established: 'Fjölskyldurekið',
    currentUrl: 'https://www.facebook.com/hunabudin/',
    ownerEmail: 'hunabud@hunabud.net',
    concept: 'Þrennt undir einu þaki',
    conceptTagline:
      'The building’s own three-part signage, coffee, flowers and gifts under one roof, becomes the whole page structure, replacing a dead domain and a thin Facebook page with no way to see hours or what is inside.',
    accent: '#B5432E',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://itin-dev.wanderlogstatic.com/freeImage/6PM4N3opXL7Kl4i3YSOn8N8UXWHGteoK',
    audit: {
      strengths: [
        'A genuinely rare three-in-one business, café, flower shop and gift shop, all under one roof in Blönduós, with all three services visible on the building’s own real signage',
        'Confirmed operating into 2026, listed among the open venues at the Prjónagleðin knitting festival in June 2026, plus a 5-star Google review dated July 2025',
        'A distinctive Ring Road stop with real, photogenic material already in hand, the storefront, the pastry case, the lopapeysur rack outside',
      ],
      weaknesses: [
        'No website exists at all, the referenced domain hunabud.net is fully dead with no DNS record',
        'The only presence is a Facebook page with essentially no scrapable content, no menu, no hours, no way to see what is inside',
        'Some aggregators mislabel the listing “permanently closed”, with no owned web presence anywhere to correct that false signal',
      ],
      opportunities: [
        'Give travellers on Route 1 a real way to confirm hours and see what is inside before they stop',
        'Correct the false “permanently closed” signal with a real, current site the business actually controls',
        'Show the three-in-one story, coffee, flowers and gifts, exactly as the building’s own signage already tells it',
      ],
    },
    positioning:
      'Húnabúð is a genuine three-in-one roadside stop in Blönduós, a café, flower shop and gift shop confirmed operating into 2026, most recently listed among the open venues at the June 2026 Prjónagleðin knitting festival. The business has no website at all, its referenced domain hunabud.net has no DNS record, and its only presence is a thin Facebook page, which has let some aggregators wrongly mark the listing as permanently closed. The redesign turns the building’s own signage, coffee and delicacies, flowers, gifts, into the whole page structure, giving Route 1 travellers a real way to see what is inside before they stop.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Húnabúð',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk kaffihús og verslanir.

Ég kynnti mér Húnabúð og sá að þið sameinið kaffihús, blómabúð og gjafavöru undir einu þaki á Blönduósi, nákvæmlega eins og skiltin á húsinu segja. Á netinu er samt hvergi hægt að sjá opnunartímann ykkar, matseðilinn eða það sem er í boði hverju sinni.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að ferðafólk á þjóðveginum sjái strax að hjá ykkur er kaffi, blóm og gjafir undir sama þaki, og viti hvenær er opið. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  },
]

export function getPreviewCompany(slug: string): PreviewCompany {
  const c = PREVIEW_COMPANIES.find((x) => x.slug === slug)
  if (!c) throw new Error(`Unknown preview slug: ${slug}`)
  return c
}

const BILAS: PreviewCompany = {
  slug: 'bilas',
  route: '/preview/bilas',
  name: 'Bílasalan Bílás',
  sector: 'Bílasala',
  location: 'Akranes',
  region: 'Vesturland',
  established: 'Est. 2007',
  currentUrl: 'https://bilas.is',
  ownerEmail: 'alexander@bilas.is',
  concept: 'Á staðnum',
  conceptTagline:
    'The lot itself is the website — every one of the 24 real cars on the Akranes lot, with the dealer’s own photos, live prices and km, browsable with filters. Night-asphalt ground, xenon-blue accent, odometer-style inventory counter as you scroll.',
  accent: '#8FC6FF',
  dark: true,
  status: 'Concept ready',
  thumb: 'https://bilasolur.is/CarImage.aspx?s=31&c=623788&p=4328403&w=784',
  audit: {
    strengths: [
      'Real inventory data is fully published — every car has price, km, fuel, transmission and ~10 photos of the actual vehicle on the lot',
      'Genuine trust signals already exist: published sölulaun price schedule, BL sales agency, named staff with direct emails, 20-min test drive policy',
      'Their own car photography is honest and atmospheric — Icelandic sky, mountains and the real premises visible in the shots',
    ],
    weaknesses: [
      'The site is a generic bilasolur.is ASP.NET template — identical to dozens of other Icelandic dealers, nothing says Bílás',
      'Dated early-2000s visual language: dense filter sidebars, tiny thumbnails, no mobile-first layout',
      'The homepage buries the actual selling point (real cars, on the lot, priced) under portal chrome',
    ],
    opportunities: [
      'Lead with the inventory itself — big photography, honest prices, instant fuel-type filtering',
      'Turn "Á staðnum" (their own nav label) into the brand promise: everything you see is physically on the lot',
      'Surface the transparency they already practice (verðskrá, test drive policy) as a trust story no portal template can tell',
    ],
  },
  positioning:
    'A real, working dealership with fully honest inventory data trapped inside a portal template that makes it look like every other car site in Iceland. The redesign gives Bílás its own face: the actual lot, the actual cars, the actual prices, presented like a premium showroom instead of a database listing.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Bílás',
    body: `Góðan dag Alexander,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég skoðaði bilas.is og sá að þið birtið allt sem skiptir máli, verð, akstur og fjölda mynda af hverjum bíl, og meira að segja verðskrána ykkar fyrir sölulaun. Sá heiðarleiki er sjaldgæfur í bransanum. En vefurinn sjálfur er staðlað bílasölukerfi sem lítur eins út og tugir annarra bílasala, þannig að þessi sérstaða sést hvergi.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Hún notar ykkar eigin myndir og alvöru bílana sem eru á planinu núna, með verði og akstri á öllum, og leyfir fólki að sía eftir eldsneyti og verði á augabragði. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Frumgerðin er hér: [PREVIEW_URL]

Ef ykkur líst vel á þetta væri gaman að heyra í ykkur, en annars vona ég að þetta veiti ykkur innblástur.

${SIGN}`,
  },
}

PREVIEW_COMPANIES.push(BILAS)
