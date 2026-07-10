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
]

export function getPreviewCompany(slug: string): PreviewCompany {
  const c = PREVIEW_COMPANIES.find((x) => x.slug === slug)
  if (!c) throw new Error(`Unknown preview slug: ${slug}`)
  return c
}
