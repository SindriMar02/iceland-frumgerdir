/**
 * Combined showcase — the single source of truth for the public overview hub (/).
 *
 * It merges the two earlier showcases (the tourism gallery + the second-batch
 * dashboard) into one ordered, grouped portfolio of every redesign EXCEPT Weider
 * (deliberately excluded — it is pitched separately and never listed publicly).
 *
 * Each prototype still lives at its own route; this file only describes how the
 * overview presents and links to them. Add new redesigns here (and their route in
 * App.tsx + the postbuild list) to grow the hub — it scales by appending items.
 */

export interface ShowcaseItem {
  /** in-app route of the live prototype */
  route: string
  name: string
  /** short Icelandic sector label, e.g. "Hestaferðir" */
  sector: string
  /** Icelandic location */
  location: string
  /** one-line Icelandic description of what the redesign focuses on (respectful) */
  blurb: string
  image: string
  /** brand accent used for the card's hover treatment */
  accent: string
}

export interface ShowcaseGroup {
  id: string
  title: string
  /** short Icelandic intro for the group */
  blurb: string
  items: ShowcaseItem[]
}

const img = (id: string) => `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`

export const SHOWCASE: ShowcaseGroup[] = [
  {
    id: 'ferdir',
    title: 'Ferðir & upplifun',
    blurb: 'Leiðangrar, ferðir, böð og söfn þar sem fyrsta sýn og einfalt bókunar- eða heimsóknarferli skipta öllu.',
    items: [
      {
        route: '/gj-travel',
        name: 'GJ Travel',
        sector: 'Ferðaskrifstofa',
        location: 'Kópavogur',
        blurb: 'Elsta ferðaskrifstofa landsins sögð sem lifandi kort, frá 1931 til dagsins í dag.',
        image: img('photo-1486870591958-9b9d0d1dda99'),
        accent: '#2547d0',
      },
      {
        route: '/eldhestar',
        name: 'Eldhestar',
        sector: 'Hestaferðir',
        location: 'Hveragerði',
        blurb: 'Íslenski hesturinn og sagan í forgrunni, með einföldu og skýru bókunarflæði.',
        image: img('photo-1553284965-83fd3e82fa5a'),
        accent: '#c2410c',
      },
      {
        route: '/ice-tourism',
        name: 'Ice Tourism',
        sector: 'Jöklaferðir & afþreying',
        location: 'Reykjavík',
        blurb: 'Leiðangrar settir fram á kvikmyndalegan hátt með skýrri leið að bókun.',
        image: img('photo-1519681393784-d120267933ba'),
        accent: '#0e7490',
      },
      {
        route: '/preview/seakayak',
        name: 'Sea Kayak Iceland',
        sector: 'Kajakferðir',
        location: 'Stokkseyri',
        blurb: 'Þrjátíu ára reynsla og öryggi í forgrunni, með bókun í örfáum skrefum.',
        image: img('photo-1572125675722-238a4f1f4ea2'),
        accent: '#1f93b0',
      },
      {
        route: '/preview/lysulaugar',
        name: 'Lýsulaugar',
        sector: 'Náttúrulaug',
        location: 'Snæfellsnes',
        blurb: 'Sjaldgæft grænt steinefnavatn undir jökli, sett fram á rólegan hátt með skýrri heimsóknarleið.',
        image: img('photo-1508869184489-1b42faa950b0'),
        accent: '#2f8f63',
      },
      {
        route: '/preview/galdrasyning',
        name: 'Galdrasýning á Ströndum',
        sector: 'Galdrasafn',
        location: 'Hólmavík, Strandir',
        blurb: 'Dulúð og saga galdramanna á Ströndum, sögð í kertaljósi með skýrri leið að miðum.',
        image: img('photo-1487621167305-5d248087c724'),
        accent: '#b08a34',
      },
    ],
  },
  {
    id: 'gisting',
    title: 'Gisting & sveit',
    blurb: 'Gistiheimili og sveitaupplifanir þar sem bein bókun og hlý framsetning skila sér.',
    items: [
      {
        route: '/guesthouse-carina',
        name: 'Guesthouse Carina',
        sector: 'Gisting',
        location: 'Vík í Mýrdal',
        blurb: 'Vandað gistiheimili steinsnar frá svörtu ströndinni, hannað fyrir beina bókun.',
        image: img('photo-1618773928121-c32242e63f39'),
        accent: '#0d9488',
      },
      {
        route: '/daeli-farm',
        name: 'Dæli Farm',
        sector: 'Sveitagisting & upplifun',
        location: 'Víðidalur',
        blurb: 'Fjölskyldubýli sagt eins og hlý saga, þar sem dalurinn finnst áður en bókað er.',
        image: img('photo-1598208083114-991498347e6d'),
        accent: '#b45309',
      },
    ],
  },
  {
    id: 'veitingar',
    title: 'Veitingar & drykkur',
    blurb: 'Veitingastaðir, kaffihús og brugghús þar sem stemningin og varan fá að njóta sín.',
    items: [
      {
        route: '/preview/tjoruhusid',
        name: 'Tjöruhúsið',
        sector: 'Fiskveitingahús',
        location: 'Ísafjörður',
        blurb: 'Stemning gamla hússins og fiskhlaðborðið fönguð, með einföldu borðabókunarflæði.',
        image: img('photo-1559339352-11d035aa65de'),
        accent: '#d98a3d',
      },
      {
        route: '/preview/kaffihornid',
        name: 'Kaffi Hornið',
        sector: 'Kaffihús & veitingar',
        location: 'Höfn í Hornafirði',
        blurb: 'Hlýtt horn í humarhöfuðborginni, hannað fyrir símann og hraða borðabókun.',
        image: img('photo-1414235077428-338989a2e8c0'),
        accent: '#c5612f',
      },
      {
        route: '/preview/austri',
        name: 'Austri Brugghús',
        sector: 'Brugghús',
        location: 'Egilsstaðir',
        blurb: 'Austfirskur handverksbjór, nefndur eftir fjöllunum, með lifandi kranalista.',
        image: img('photo-1546622891-02c72c1537b6'),
        accent: '#c8772b',
      },
    ],
  },
  {
    id: 'matur',
    title: 'Matur, handverk & vörur',
    blurb: 'Matvælaframleiðsla og handverk þar sem sagan, hráefnið og varan eru í forgrunni.',
    items: [
      {
        route: '/preview/ektafiskur',
        name: 'Ektafiskur',
        sector: 'Matvæli & Baccalá Bar',
        location: 'Hauganes',
        blurb: 'Áttatíu ára saltfisksaga og vefverslun sett fram af metnaði og skýrleika.',
        image: img('photo-1498654200943-1088dd4438ae'),
        accent: '#1f5673',
      },
      {
        route: '/preview/erpsstadir',
        name: 'Rjómabúið Erpsstaðir',
        sector: 'Rjómabú',
        location: 'Dalir',
        blurb: 'Handgerður ís og býlið að baki, með opnunartímum og korti í forgrunni.',
        image: img('photo-1488900128323-21503983a07e'),
        accent: '#e0a43a',
      },
      {
        route: '/preview/reykkofinn',
        name: 'Reykkofinn',
        sector: 'Reykhús & sveitabúð',
        location: 'Mývatnssveit',
        blurb: 'Reykt sveitaafurðir úr hrauninu við Mývatn, með sögu hráefnisins og einfaldri pöntun.',
        image: img('photo-1763062550082-2c9f94096abb'),
        accent: '#b5651d',
      },
      {
        route: '/preview/hespa',
        name: 'Hespa',
        sector: 'Jurtalituð ull',
        location: 'Ölfus',
        blurb: 'Jurtalituð íslensk ull þar sem litirnir koma úr náttúrunni, með eigin vefverslun.',
        image: img('photo-1777929746858-45bbe0134e88'),
        accent: '#a8492c',
      },
    ],
  },
]

/** Flat, ordered list of every showcased redesign (Weider excluded by construction). */
export const SHOWCASE_ITEMS: ShowcaseItem[] = SHOWCASE.flatMap((g) => g.items)
