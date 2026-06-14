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

export const SHOWCASE: ShowcaseGroup[] = [
  {
    id: 'ferdir',
    title: 'Ferðir & upplifun',
    blurb: 'Leiðangrar, ferðir og afþreying þar sem fyrsta sýn og einfalt bókunarferli skipta öllu.',
    items: [
      {
        route: '/gj-travel',
        name: 'GJ Travel',
        sector: 'Ferðaskrifstofa',
        location: 'Kópavogur',
        blurb: 'Elsta ferðaskrifstofa landsins sögð sem lifandi kort, frá 1931 til dagsins í dag.',
        image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200&auto=format&fit=crop',
        accent: '#2547d0',
      },
      {
        route: '/eldhestar',
        name: 'Eldhestar',
        sector: 'Hestaferðir',
        location: 'Hveragerði',
        blurb: 'Íslenski hesturinn og sagan í forgrunni, með einföldu og skýru bókunarflæði.',
        image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1200&auto=format&fit=crop',
        accent: '#c2410c',
      },
      {
        route: '/ice-tourism',
        name: 'Ice Tourism',
        sector: 'Jöklaferðir & afþreying',
        location: 'Reykjavík',
        blurb: 'Leiðangrar settir fram á kvikmyndalegan hátt með skýrri leið að bókun.',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
        accent: '#0e7490',
      },
      {
        route: '/preview/seakayak',
        name: 'Sea Kayak Iceland',
        sector: 'Kajakferðir',
        location: 'Stokkseyri',
        blurb: 'Þrjátíu ára reynsla og öryggi í forgrunni, með bókun í örfáum skrefum.',
        image: 'https://images.unsplash.com/photo-1572125675722-238a4f1f4ea2?q=80&w=1200&auto=format&fit=crop',
        accent: '#1f93b0',
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
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop',
        accent: '#0d9488',
      },
      {
        route: '/daeli-farm',
        name: 'Dæli Farm',
        sector: 'Sveitagisting & upplifun',
        location: 'Víðidalur',
        blurb: 'Fjölskyldubýli sagt eins og hlý saga, þar sem dalurinn finnst áður en bókað er.',
        image: 'https://images.unsplash.com/photo-1598208083114-991498347e6d?q=80&w=1200&auto=format&fit=crop',
        accent: '#b45309',
      },
    ],
  },
  {
    id: 'veitingar',
    title: 'Veitingar & matur',
    blurb: 'Veitingastaðir, kaffihús og matvælaframleiðsla þar sem sagan og varan fá að njóta sín.',
    items: [
      {
        route: '/preview/tjoruhusid',
        name: 'Tjöruhúsið',
        sector: 'Fiskveitingahús',
        location: 'Ísafjörður',
        blurb: 'Stemning gamla hússins og fiskhlaðborðið fönguð, með einföldu borðabókunarflæði.',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop',
        accent: '#d98a3d',
      },
      {
        route: '/preview/kaffihornid',
        name: 'Kaffi Hornið',
        sector: 'Kaffihús & veitingar',
        location: 'Höfn í Hornafirði',
        blurb: 'Hlýtt horn í humarhöfuðborginni, hannað fyrir símann og hraða borðabókun.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
        accent: '#c5612f',
      },
      {
        route: '/preview/ektafiskur',
        name: 'Ektafiskur',
        sector: 'Matvæli & Baccalá Bar',
        location: 'Hauganes',
        blurb: 'Áttatíu ára saltfisksaga og vefverslun sett fram af metnaði og skýrleika.',
        image: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1200&auto=format&fit=crop',
        accent: '#1f5673',
      },
      {
        route: '/preview/erpsstadir',
        name: 'Rjómabúið Erpsstaðir',
        sector: 'Rjómabú',
        location: 'Dalir',
        blurb: 'Handgerður ís og býlið að baki, með opnunartímum og korti í forgrunni.',
        image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?q=80&w=1200&auto=format&fit=crop',
        accent: '#e0a43a',
      },
    ],
  },
]

/** Flat, ordered list of every showcased redesign (Weider excluded by construction). */
export const SHOWCASE_ITEMS: ShowcaseItem[] = SHOWCASE.flatMap((g) => g.items)
