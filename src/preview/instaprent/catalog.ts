/* Generated from instaprent-design/harvest (her iprent.is catalogue, 2026-09-23). Do not hand-edit prices. */
export type Attr = { name: string; kind: "buttons" | "swatch"; options: string[]; swatches: Record<string, string | null> | null }
export type Img = { src: string; w: number; h: number; fit: "cover" | "contain" }
export type Product = { slug: string; name: string; cats: string[]; price: number; priceMax: number; desc: string; notes: { title: string; text: string }[]; attrs: Attr[]; variations: { attrs: Record<string, string>; price: number }[]; personalize: null | { photo: null | { min: number; max: number; required: boolean }; texts: { label: string; required: boolean; max: number; hint: string }[]; require: string }; framkollun: string | null; imgs: Img[] }
export const PRODUCTS: Product[] = [
 {
  "slug": "framkollun-10x15",
  "name": "Framköllun 10×15",
  "cats": [
   "framkollun"
  ],
  "price": 60,
  "priceMax": 60,
  "desc": "Hleyptu myndunum þínum í dagsljósið. Myndir prentaðar á hágæða ljósmyndapappír. Stærð 10x15 cm. 1-10 stk. - 600 kr. 11-100 stk. - 60 kr. stk 101 eða fleiri - 55 kr. stk",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": null,
  "framkollun": "10x15",
  "imgs": [
   {
    "src": "p-framkollun-1015-1",
    "w": 1400,
    "h": 1120,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "staekkanir",
  "name": "Stækkanir",
  "cats": [
   "framkollun"
  ],
  "price": 600,
  "priceMax": 1320,
  "desc": "Hleyptu myndunum þínum í dagsljósið. Myndir prentaðar á hágæða ljósmyndapappír. Stærð á prentun eftir þínum óskum.",
  "notes": [],
  "attrs": [
   {
    "name": "Stærð",
    "kind": "buttons",
    "options": [
     "10x15  = 1-9 stk",
     "13x18",
     "15x20",
     "18x24",
     "20x25",
     "20x30",
     "21x30",
     "15x15",
     "20x20"
    ],
    "swatches": null
   }
  ],
  "variations": [
   {
    "attrs": {
     "Stærð": "10x15  = 1-9 stk"
    },
    "price": 600
   },
   {
    "attrs": {
     "Stærð": "13x18"
    },
    "price": 600
   },
   {
    "attrs": {
     "Stærð": "15x20"
    },
    "price": 660
   },
   {
    "attrs": {
     "Stærð": "18x24"
    },
    "price": 760
   },
   {
    "attrs": {
     "Stærð": "20x25"
    },
    "price": 1100
   },
   {
    "attrs": {
     "Stærð": "20x30"
    },
    "price": 1310
   },
   {
    "attrs": {
     "Stærð": "21x30"
    },
    "price": 1320
   },
   {
    "attrs": {
     "Stærð": "15x15"
    },
    "price": 650
   },
   {
    "attrs": {
     "Stærð": "20x20"
    },
    "price": 1050
   }
  ],
  "personalize": null,
  "framkollun": "13x18",
  "imgs": [
   {
    "src": "p-staekkanir-1",
    "w": 380,
    "h": 378,
    "fit": "cover"
   },
   {
    "src": "p-staekkanir-2",
    "w": 1400,
    "h": 1120,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "instagram-myndir-10x10",
  "name": "Instagram myndir 10×10",
  "cats": [
   "framkollun"
  ],
  "price": 90,
  "priceMax": 90,
  "desc": "Hleyptu myndunum þínum í dagsljósið. Myndir prentaðar á hágæða ljósmyndapappír. Stærð 10x10 cm. 1-10 stk. kr. 90 stk 11-50 stk. kr. 85stk 51 eða fleiri kr. 80stk",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": null,
  "framkollun": "10x10",
  "imgs": [
   {
    "src": "p-instagram-myndir-1010-1",
    "w": 1200,
    "h": 627,
    "fit": "cover"
   },
   {
    "src": "p-instagram-myndir-1010-2",
    "w": 1400,
    "h": 1591,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "polaroid-myndir",
  "name": "Polaroid myndir",
  "cats": [
   "framkollun"
  ],
  "price": 90,
  "priceMax": 90,
  "desc": "Hleyptu myndunum þínum í dagsljósið. Myndir prentaðar á hágæða ljósmyndapappír. Polaroid útlit. Þú getur svo skrifað þinn texta á hvíta flötinn undir myndinni með þartilgerðum penna.",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": null,
  "framkollun": "polaroid",
  "imgs": [
   {
    "src": "p-polaroid-myndir-1",
    "w": 340,
    "h": 162,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "samsettar-myndir-30x30",
  "name": "Samsettar myndir 30×30",
  "cats": [
   "framkollun",
   "thin-honnun"
  ],
  "price": 2400,
  "priceMax": 2400,
  "desc": "Hágæða myndaprentun 20x20 cm 4 eða 9 myndir á. Hægt er að kaupa ramma með, sjá Instagram ramma á síðunni. Þú sendir okkur myndirnar í þínum bestu gæðum í gegnum flipann mynd já takk.",
  "notes": [],
  "attrs": [
   {
    "name": "Fjöldi mynda",
    "kind": "buttons",
    "options": [
     "4 myndir",
     "9 myndir"
    ],
    "swatches": null
   }
  ],
  "variations": [
   {
    "attrs": {
     "Fjöldi mynda": "4 myndir"
    },
    "price": 2400
   },
   {
    "attrs": {
     "Fjöldi mynda": "9 myndir"
    },
    "price": 2400
   }
  ],
  "personalize": {
   "photo": {
    "min": 4,
    "max": 9,
    "required": true
   },
   "texts": [],
   "require": "photo"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-samsettar-myndir-3030-1",
    "w": 500,
    "h": 500,
    "fit": "contain"
   },
   {
    "src": "p-samsettar-myndir-3030-2",
    "w": 500,
    "h": 500,
    "fit": "contain"
   }
  ]
 },
 {
  "slug": "kanna-med-thinni-mynd-og-texta",
  "name": "Kanna með þinni mynd og texta",
  "cats": [
   "thin-honnun",
   "jolin"
  ],
  "price": 4600,
  "priceMax": 4600,
  "desc": "Hvít kanna - prentað öðru megin eða báðu megin. 325 ml",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": {
   "photo": {
    "min": 1,
    "max": 1,
    "required": true
   },
   "texts": [
    {
     "label": "Þinn texti",
     "required": false,
     "max": 500,
     "hint": ""
    }
   ],
   "require": "photo"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-kanna-med-thinni-mynd-og-texta-1",
    "w": 1170,
    "h": 1152,
    "fit": "cover"
   },
   {
    "src": "p-kanna-med-thinni-mynd-og-texta-2",
    "w": 1400,
    "h": 1176,
    "fit": "cover"
   },
   {
    "src": "p-kanna-med-thinni-mynd-og-texta-3",
    "w": 1400,
    "h": 1066,
    "fit": "cover"
   },
   {
    "src": "p-kanna-med-thinni-mynd-og-texta-4",
    "w": 1170,
    "h": 605,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "plastbolli-med-thinni-honnun",
  "name": "Plastbolli með þinni hönnun",
  "cats": [
   "thin-honnun"
  ],
  "price": 4600,
  "priceMax": 4600,
  "desc": "Plast kanna er 9 cm há og tekur um 325 ml.",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": {
   "photo": {
    "min": 1,
    "max": 1,
    "required": false
   },
   "texts": [
    {
     "label": "Texti",
     "required": false,
     "max": 500,
     "hint": ""
    }
   ],
   "require": "either"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-plastbolli-med-thinni-honnun-1",
    "w": 1400,
    "h": 1400,
    "fit": "cover"
   },
   {
    "src": "p-plastbolli-med-thinni-honnun-2",
    "w": 1400,
    "h": 1400,
    "fit": "cover"
   },
   {
    "src": "p-plastbolli-med-thinni-honnun-3",
    "w": 1400,
    "h": 980,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "pudi-med-thinni-honnun-hor",
  "name": "Púði með þinni hönnun, hör",
  "cats": [
   "thin-honnun"
  ],
  "price": 8990,
  "priceMax": 8990,
  "desc": "Þín mynd og/eða texti á púða sem er 45 x 45 cm.",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": {
   "photo": {
    "min": 1,
    "max": 1,
    "required": false
   },
   "texts": [
    {
     "label": "Texti á vöru",
     "required": false,
     "max": 500,
     "hint": ""
    }
   ],
   "require": "either"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-pudi-med-thinni-honnun-hor-1",
    "w": 1400,
    "h": 1400,
    "fit": "cover"
   },
   {
    "src": "p-pudi-med-thinni-honnun-hor-2",
    "w": 1000,
    "h": 1000,
    "fit": "contain"
   },
   {
    "src": "p-pudi-med-thinni-honnun-hor-3",
    "w": 500,
    "h": 500,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "samfella-med-thinni-honnun",
  "name": "Samfella með þinni hönnun",
  "cats": [
   "thin-honnun"
  ],
  "price": 5190,
  "priceMax": 5190,
  "desc": "Hannaðu þína eigin samfellu með þínum texta og eða mynd. Hægt er að hafa hönnun bæði framan og/eða aftan. Veldu stærð Veldu lit Skrifaður þinn texta og/eða sendu mynd",
  "notes": [],
  "attrs": [
   {
    "name": "Litur",
    "kind": "swatch",
    "options": [
     "Hvítur",
     "Blá",
     "Bleik",
     "Grá",
     "Drapplitað",
     "Svart"
    ],
    "swatches": {
     "Hvítur": "#ffffff",
     "Blá": "#a9bfd6",
     "Bleik": "#efc9d0",
     "Grá": "#bfc0bf",
     "Drapplitað": "#dccdb2",
     "Svart": "#151515"
    }
   },
   {
    "name": "Stærð",
    "kind": "buttons",
    "options": [
     "Nýbura",
     "0-3 mán",
     "3-6mán",
     "6-12 mán",
     "12-18 mán"
    ],
    "swatches": null
   }
  ],
  "variations": [
   {
    "attrs": {
     "Litur": "Hvítur",
     "Stærð": "Nýbura"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Hvítur",
     "Stærð": "0-3 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Hvítur",
     "Stærð": "3-6mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Hvítur",
     "Stærð": "6-12 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Hvítur",
     "Stærð": "12-18 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Blá",
     "Stærð": "Nýbura"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Blá",
     "Stærð": "0-3 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Blá",
     "Stærð": "3-6mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Blá",
     "Stærð": "6-12 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Blá",
     "Stærð": "12-18 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Bleik",
     "Stærð": "Nýbura"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Bleik",
     "Stærð": "0-3 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Bleik",
     "Stærð": "3-6mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Bleik",
     "Stærð": "6-12 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Bleik",
     "Stærð": "12-18 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Grá",
     "Stærð": "Nýbura"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Grá",
     "Stærð": "0-3 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Grá",
     "Stærð": "3-6mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Grá",
     "Stærð": "6-12 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Grá",
     "Stærð": "12-18 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Drapplitað",
     "Stærð": "Nýbura"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Drapplitað",
     "Stærð": "0-3 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Drapplitað",
     "Stærð": "3-6mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Drapplitað",
     "Stærð": "6-12 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Drapplitað",
     "Stærð": "12-18 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Svart",
     "Stærð": "Nýbura"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Svart",
     "Stærð": "0-3 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Svart",
     "Stærð": "3-6mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Svart",
     "Stærð": "6-12 mán"
    },
    "price": 5190
   },
   {
    "attrs": {
     "Litur": "Svart",
     "Stærð": "12-18 mán"
    },
    "price": 5190
   }
  ],
  "personalize": {
   "photo": {
    "min": 1,
    "max": 1,
    "required": false
   },
   "texts": [
    {
     "label": "Texti",
     "required": false,
     "max": 500,
     "hint": ""
    }
   ],
   "require": "either"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-samfella-med-thinni-honnun-1",
    "w": 1400,
    "h": 1750,
    "fit": "cover"
   },
   {
    "src": "p-samfella-med-thinni-honnun-2",
    "w": 1000,
    "h": 1000,
    "fit": "cover"
   },
   {
    "src": "p-samfella-med-thinni-honnun-3",
    "w": 1000,
    "h": 1000,
    "fit": "cover"
   },
   {
    "src": "p-samfella-med-thinni-honnun-4",
    "w": 1000,
    "h": 1000,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "bangsi-i-peysu-med-nafni-eda-mynd",
  "name": "Bangsi í peysu með nafni eða mynd",
  "cats": [
   "thin-honnun",
   "jolin"
  ],
  "price": 5800,
  "priceMax": 5800,
  "desc": "Bangsi með nafni, texta eða mynd allt eftir þinni hugmynd",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": {
   "photo": {
    "min": 1,
    "max": 1,
    "required": false
   },
   "texts": [
    {
     "label": "Texti á vöru",
     "required": false,
     "max": 500,
     "hint": ""
    }
   ],
   "require": "either"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-bangsi-i-peysu-med-nafni-eda-mynd-1",
    "w": 1400,
    "h": 1867,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "pusluspil-ur-vid",
  "name": "Púsluspil úr við",
  "cats": [
   "thin-honnun",
   "jolin"
  ],
  "price": 5900,
  "priceMax": 8600,
  "desc": "Þín mynd og texti á virkilega vandað Púsluspil úr við. MDF púsluspil. - margar stærðir og fjölsi púsla. Mjög barnvænt Þú sendir okkur myndina/myndirnar í þínum bestu gæðum á hallo@instaprent.is",
  "notes": [],
  "attrs": [
   {
    "name": "Útgáfa",
    "kind": "buttons",
    "options": [
     "21x15 cm - 24 púsl",
     "24 x 17 - 30 púsl",
     "24x17 cm - 60 púsl",
     "25x18 cm - 47 púsl Love",
     "35x25 cm - 96 púsl",
     "35.5 x 25 cm - 221 púsl"
    ],
    "swatches": null
   }
  ],
  "variations": [
   {
    "attrs": {
     "Útgáfa": "21x15 cm - 24 púsl"
    },
    "price": 5900
   },
   {
    "attrs": {
     "Útgáfa": "24 x 17 - 30 púsl"
    },
    "price": 6200
   },
   {
    "attrs": {
     "Útgáfa": "24x17 cm - 60 púsl"
    },
    "price": 6500
   },
   {
    "attrs": {
     "Útgáfa": "25x18 cm - 47 púsl Love"
    },
    "price": 6600
   },
   {
    "attrs": {
     "Útgáfa": "35x25 cm - 96 púsl"
    },
    "price": 7900
   },
   {
    "attrs": {
     "Útgáfa": "35.5 x 25 cm - 221 púsl"
    },
    "price": 8600
   }
  ],
  "personalize": {
   "photo": {
    "min": 1,
    "max": 1,
    "required": true
   },
   "texts": [],
   "require": "photo"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-pusluspil-ur-vid-1",
    "w": 1400,
    "h": 1988,
    "fit": "cover"
   },
   {
    "src": "p-pusluspil-ur-vid-2",
    "w": 1400,
    "h": 1727,
    "fit": "cover"
   },
   {
    "src": "p-pusluspil-ur-vid-3",
    "w": 750,
    "h": 750,
    "fit": "cover"
   },
   {
    "src": "p-pusluspil-ur-vid-4",
    "w": 750,
    "h": 750,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "oroi-med-thinni-mynd",
  "name": "Órói með þinni mynd",
  "cats": [
   "thin-honnun",
   "jolin"
  ],
  "price": 7500,
  "priceMax": 7500,
  "desc": "Þín mynd á óróa.",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": {
   "photo": {
    "min": 1,
    "max": 1,
    "required": false
   },
   "texts": [
    {
     "label": "Texti",
     "required": false,
     "max": 500,
     "hint": ""
    }
   ],
   "require": "either"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-oroi-med-thinni-mynd-1",
    "w": 1400,
    "h": 1473,
    "fit": "cover"
   },
   {
    "src": "p-oroi-med-thinni-mynd-2",
    "w": 800,
    "h": 800,
    "fit": "cover"
   },
   {
    "src": "p-oroi-med-thinni-mynd-3",
    "w": 800,
    "h": 800,
    "fit": "cover"
   },
   {
    "src": "p-oroi-med-thinni-mynd-4",
    "w": 800,
    "h": 800,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "fjolskyldurammi",
  "name": "Fjölskyldurammi",
  "cats": [
   "thin-honnun",
   "jolin"
  ],
  "price": 6900,
  "priceMax": 6900,
  "desc": "Þín mynd á med platta merktur: mamma, pabbi, fjölskylda eða ást Uppáhalds ljósmynd þinn texti Ljóðið þitt eða bara það sem ykkur dettur í hug.",
  "notes": [],
  "attrs": [
   {
    "name": "Merking",
    "kind": "buttons",
    "options": [
     "Mamma",
     "Pabbi",
     "Fjölskylda",
     "Ást",
     "Amma",
     "Afi"
    ],
    "swatches": null
   }
  ],
  "variations": [
   {
    "attrs": {
     "Merking": "Mamma"
    },
    "price": 6900
   },
   {
    "attrs": {
     "Merking": "Pabbi"
    },
    "price": 6900
   },
   {
    "attrs": {
     "Merking": "Fjölskylda"
    },
    "price": 6900
   },
   {
    "attrs": {
     "Merking": "Ást"
    },
    "price": 6900
   },
   {
    "attrs": {
     "Merking": "Amma"
    },
    "price": 6900
   },
   {
    "attrs": {
     "Merking": "Afi"
    },
    "price": 6900
   }
  ],
  "personalize": {
   "photo": {
    "min": 1,
    "max": 1,
    "required": false
   },
   "texts": [
    {
     "label": "Texti",
     "required": false,
     "max": 500,
     "hint": ""
    }
   ],
   "require": "either"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-fjolskyldurammi-1",
    "w": 1400,
    "h": 1867,
    "fit": "cover"
   },
   {
    "src": "p-fjolskyldurammi-2",
    "w": 1400,
    "h": 788,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "hjarta-kristall",
  "name": "Hjarta kristall",
  "cats": [
   "thin-honnun"
  ],
  "price": 6100,
  "priceMax": 6100,
  "desc": "Hjarta kristal með þinni mynd",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": {
   "photo": {
    "min": 1,
    "max": 1,
    "required": false
   },
   "texts": [
    {
     "label": "Texti",
     "required": false,
     "max": 500,
     "hint": ""
    }
   ],
   "require": "either"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-hjarta-kristall-1",
    "w": 1400,
    "h": 1400,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "glerplatti-med-ljosi",
  "name": "Glerplatti með ljósi",
  "cats": [
   "thin-honnun"
  ],
  "price": 8900,
  "priceMax": 8900,
  "desc": "Þín mynd eða þin texti sett á glerplatta. Uppáhalds ljósmynd Samúðarkveðja Ljóðið þitt eða bara það sem ykkur dettur í hug.",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": {
   "photo": {
    "min": 1,
    "max": 1,
    "required": false
   },
   "texts": [
    {
     "label": "Texti",
     "required": false,
     "max": 500,
     "hint": ""
    }
   ],
   "require": "either"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-glerplatti-med-ljosi-1",
    "w": 1400,
    "h": 1400,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "ast-er-samvera-med-mommu",
  "name": "Ást er... samvera með mömmu",
  "cats": [
   "okkar-honnun"
  ],
  "price": 3900,
  "priceMax": 3900,
  "desc": "Keramik kanna 11 cm há og tekur um 11 oz. Könnurnar má þvo í uppþvottavél og setja í örbylgjuofn.",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": {
   "photo": null,
   "texts": [],
   "require": "none"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-ast-er-samvera-med-mommu-1",
    "w": 1400,
    "h": 980,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "ast-er-ad-eldast-saman",
  "name": "Ást er... að eldast saman",
  "cats": [
   "okkar-honnun"
  ],
  "price": 3900,
  "priceMax": 3900,
  "desc": "Keramik kanna er 11 cm há og tekur um 11 oz. Könnurnar má þvo í uppþvottavél og setja í örbylgjuofn.",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": {
   "photo": null,
   "texts": [],
   "require": "none"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-ast-er-ad-eldast-saman-1",
    "w": 1400,
    "h": 980,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "heimsins-besta-amma",
  "name": "Heimsins besta amma",
  "cats": [
   "okkar-honnun"
  ],
  "price": 3900,
  "priceMax": 3900,
  "desc": "Keramik kanna er 9 cm há og tekur um 11 oz. Könnurnar má þvo í uppþvottavél og setja í örbylgjuofn.",
  "notes": [],
  "attrs": [
   {
    "name": "Útgáfa",
    "kind": "buttons",
    "options": [
     "Blóm",
     "Draumafangari"
    ],
    "swatches": null
   }
  ],
  "variations": [
   {
    "attrs": {
     "Útgáfa": "Blóm"
    },
    "price": 3900
   },
   {
    "attrs": {
     "Útgáfa": "Draumafangari"
    },
    "price": 3900
   }
  ],
  "personalize": {
   "photo": null,
   "texts": [],
   "require": "none"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-heimsins-besta-amma-1",
    "w": 1400,
    "h": 980,
    "fit": "cover"
   },
   {
    "src": "p-heimsins-besta-amma-2",
    "w": 1400,
    "h": 980,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "meyjan",
  "name": "Meyjan 23.08–22.09",
  "cats": [
   "okkar-honnun"
  ],
  "price": 3900,
  "priceMax": 3900,
  "desc": "Kanna með stjörnumerkjamynd af stelpu sem er táknið fyrir stjörnumerkið. Myndin af stelpunni er á báðum hliðum og texti sem er lýsandi fyrir fólk sem fætt er í viðkomandi merki er framan á könnunni. Kannan er um 9 cm há og tekur um 11 oz, hana má þvo í uppþvottavél og setja í örbylgjuofn.",
  "notes": [],
  "attrs": [],
  "variations": [],
  "personalize": {
   "photo": null,
   "texts": [
    {
     "label": "Nafn á könnuna",
     "required": false,
     "max": 40,
     "hint": "Ef þú vilt nafn, annars autt"
    }
   ],
   "require": "none"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-meyjan-23-0822-09-1",
    "w": 1400,
    "h": 1120,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "seglar-lifsspeki",
  "name": "Seglar, lífsspeki",
  "cats": [
   "okkar-honnun"
  ],
  "price": 1990,
  "priceMax": 1990,
  "desc": "Seglarnir eru 9 x 9 cm að stærð. Með virkilega fallegri hönnun frá Rösk vinnustofu sem við vorum að taka yfir.",
  "notes": [],
  "attrs": [
   {
    "name": "Útgáfa",
    "kind": "buttons",
    "options": [
     "Draumar geta ræst",
     "hamingjan er hér",
     "Engin getur allt",
     "Góðir hlutir gerast hægt",
     "Það er ókeypis að brosa",
     "í dag er góður dagur fyrir góðan dag",
     "Engin getur allt en allir geta",
     "Þú getur ekki farið til baka og..."
    ],
    "swatches": null
   }
  ],
  "variations": [
   {
    "attrs": {
     "Útgáfa": "Draumar geta ræst"
    },
    "price": 1990
   },
   {
    "attrs": {
     "Útgáfa": "hamingjan er hér"
    },
    "price": 1990
   },
   {
    "attrs": {
     "Útgáfa": "Engin getur allt"
    },
    "price": 1990
   },
   {
    "attrs": {
     "Útgáfa": "Góðir hlutir gerast hægt"
    },
    "price": 1990
   },
   {
    "attrs": {
     "Útgáfa": "Það er ókeypis að brosa"
    },
    "price": 1990
   },
   {
    "attrs": {
     "Útgáfa": "í dag er góður dagur fyrir góðan dag"
    },
    "price": 1990
   },
   {
    "attrs": {
     "Útgáfa": "Engin getur allt en allir geta"
    },
    "price": 1990
   },
   {
    "attrs": {
     "Útgáfa": "Þú getur ekki farið til baka og..."
    },
    "price": 1990
   }
  ],
  "personalize": {
   "photo": null,
   "texts": [],
   "require": "none"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-seglar-lifsspeki-1",
    "w": 1400,
    "h": 1400,
    "fit": "cover"
   },
   {
    "src": "p-seglar-lifsspeki-2",
    "w": 1400,
    "h": 1400,
    "fit": "cover"
   },
   {
    "src": "p-seglar-lifsspeki-3",
    "w": 1400,
    "h": 1400,
    "fit": "contain"
   },
   {
    "src": "p-seglar-lifsspeki-4",
    "w": 1400,
    "h": 1400,
    "fit": "contain"
   }
  ]
 },
 {
  "slug": "glasamottur-ast-er",
  "name": "Glasamottur, Ást er...",
  "cats": [
   "okkar-honnun"
  ],
  "price": 1500,
  "priceMax": 1500,
  "desc": "Korkur, stærð 9 x 9 cm - Prentað öðrumegin",
  "notes": [],
  "attrs": [
   {
    "name": "Útgáfa",
    "kind": "buttons",
    "options": [
     "...að eiga bestu vinkonu í heimi",
     "að skíða saman",
     "samvera meö pabba",
     "að eiga besta afa í heimi",
     "að eiga bestu systur í heimi",
     "að eiga yndislega ömmu og afa",
     "að eiga bestu ömmu í heimi",
     "að eldast saman"
    ],
    "swatches": null
   }
  ],
  "variations": [
   {
    "attrs": {
     "Útgáfa": "...að eiga bestu vinkonu í heimi"
    },
    "price": 1500
   },
   {
    "attrs": {
     "Útgáfa": "að skíða saman"
    },
    "price": 1500
   },
   {
    "attrs": {
     "Útgáfa": "samvera meö pabba"
    },
    "price": 1500
   },
   {
    "attrs": {
     "Útgáfa": "að eiga besta afa í heimi"
    },
    "price": 1500
   },
   {
    "attrs": {
     "Útgáfa": "að eiga bestu systur í heimi"
    },
    "price": 1500
   },
   {
    "attrs": {
     "Útgáfa": "að eiga yndislega ömmu og afa"
    },
    "price": 1500
   },
   {
    "attrs": {
     "Útgáfa": "að eiga bestu ömmu í heimi"
    },
    "price": 1500
   },
   {
    "attrs": {
     "Útgáfa": "að eldast saman"
    },
    "price": 1500
   }
  ],
  "personalize": {
   "photo": null,
   "texts": [],
   "require": "none"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-glasamottur-ast-er-1",
    "w": 1400,
    "h": 1400,
    "fit": "cover"
   },
   {
    "src": "p-glasamottur-ast-er-2",
    "w": 1400,
    "h": 1120,
    "fit": "contain"
   },
   {
    "src": "p-glasamottur-ast-er-3",
    "w": 1400,
    "h": 1120,
    "fit": "contain"
   },
   {
    "src": "p-glasamottur-ast-er-4",
    "w": 1400,
    "h": 1120,
    "fit": "contain"
   }
  ]
 },
 {
  "slug": "pudi-med-fyllingu",
  "name": "Púði með fyllingu",
  "cats": [
   "okkar-honnun"
  ],
  "price": 7490,
  "priceMax": 7790,
  "desc": "Lín koddaver og fylling 40 x 40 cm",
  "notes": [
   {
    "title": "Áríðandi varðandi hönnun.",
    "text": ""
   }
  ],
  "attrs": [
   {
    "name": "Útgáfa",
    "kind": "buttons",
    "options": [
     "Amma",
     "Afi",
     "Í dag er",
     "Fjölskylda á mörgum tungumálum",
     "Fjölskylda er hópur af",
     "Brostu",
     "Guð gaf mér",
     "Liverpool",
     "Manchester",
     "Heima er best",
     "Chelsea",
     "Umfa"
    ],
    "swatches": null
   },
   {
    "name": "Litur",
    "kind": "swatch",
    "options": [
     "Hvítur",
     "Drapplitaður"
    ],
    "swatches": {
     "Hvítur": "#ffffff",
     "Drapplitaður": "#ede9e1"
    }
   }
  ],
  "variations": [
   {
    "attrs": {
     "Útgáfa": "Amma",
     "Litur": "Hvítur"
    },
    "price": 7490
   },
   {
    "attrs": {
     "Útgáfa": "Amma",
     "Litur": "Drapplitaður"
    },
    "price": 7790
   },
   {
    "attrs": {
     "Útgáfa": "Afi",
     "Litur": "Hvítur"
    },
    "price": 7490
   },
   {
    "attrs": {
     "Útgáfa": "Afi",
     "Litur": "Drapplitaður"
    },
    "price": 7790
   },
   {
    "attrs": {
     "Útgáfa": "Í dag er",
     "Litur": "Hvítur"
    },
    "price": 7490
   },
   {
    "attrs": {
     "Útgáfa": "Í dag er",
     "Litur": "Drapplitaður"
    },
    "price": 7790
   },
   {
    "attrs": {
     "Útgáfa": "Fjölskylda á mörgum tungumálum",
     "Litur": "Hvítur"
    },
    "price": 7490
   },
   {
    "attrs": {
     "Útgáfa": "Fjölskylda á mörgum tungumálum",
     "Litur": "Drapplitaður"
    },
    "price": 7790
   },
   {
    "attrs": {
     "Útgáfa": "Fjölskylda er hópur af",
     "Litur": "Hvítur"
    },
    "price": 7490
   },
   {
    "attrs": {
     "Útgáfa": "Fjölskylda er hópur af",
     "Litur": "Drapplitaður"
    },
    "price": 7790
   },
   {
    "attrs": {
     "Útgáfa": "Brostu",
     "Litur": "Hvítur"
    },
    "price": 7490
   },
   {
    "attrs": {
     "Útgáfa": "Brostu",
     "Litur": "Drapplitaður"
    },
    "price": 7790
   },
   {
    "attrs": {
     "Útgáfa": "Guð gaf mér",
     "Litur": "Hvítur"
    },
    "price": 7490
   },
   {
    "attrs": {
     "Útgáfa": "Guð gaf mér",
     "Litur": "Drapplitaður"
    },
    "price": 7790
   },
   {
    "attrs": {
     "Útgáfa": "Liverpool",
     "Litur": "Hvítur"
    },
    "price": 7490
   },
   {
    "attrs": {
     "Útgáfa": "Liverpool",
     "Litur": "Drapplitaður"
    },
    "price": 7790
   },
   {
    "attrs": {
     "Útgáfa": "Manchester",
     "Litur": "Hvítur"
    },
    "price": 7490
   },
   {
    "attrs": {
     "Útgáfa": "Manchester",
     "Litur": "Drapplitaður"
    },
    "price": 7790
   },
   {
    "attrs": {
     "Útgáfa": "Heima er best",
     "Litur": "Hvítur"
    },
    "price": 7490
   },
   {
    "attrs": {
     "Útgáfa": "Heima er best",
     "Litur": "Drapplitaður"
    },
    "price": 7790
   },
   {
    "attrs": {
     "Útgáfa": "Chelsea",
     "Litur": "Hvítur"
    },
    "price": 7490
   },
   {
    "attrs": {
     "Útgáfa": "Chelsea",
     "Litur": "Drapplitaður"
    },
    "price": 7790
   },
   {
    "attrs": {
     "Útgáfa": "Umfa",
     "Litur": "Hvítur"
    },
    "price": 7490
   },
   {
    "attrs": {
     "Útgáfa": "Umfa",
     "Litur": "Drapplitaður"
    },
    "price": 7790
   }
  ],
  "personalize": {
   "photo": null,
   "texts": [],
   "require": "none"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-pudi-med-fyllingu-1",
    "w": 1400,
    "h": 1400,
    "fit": "cover"
   },
   {
    "src": "p-pudi-med-fyllingu-2",
    "w": 960,
    "h": 822,
    "fit": "cover"
   },
   {
    "src": "p-pudi-med-fyllingu-3",
    "w": 1400,
    "h": 1400,
    "fit": "cover"
   },
   {
    "src": "p-pudi-med-fyllingu-4",
    "w": 1400,
    "h": 1400,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "faedingarspjald-nr-5",
  "name": "Fæðingarspjald nr. 5",
  "cats": [
   "barnaherbergid",
   "thin-honnun"
  ],
  "price": 3900,
  "priceMax": 8500,
  "desc": "Fæðingarspjald með staf barnsins, Nafni eða án nafns Fæðingardagur. Þyngd barns Lengd barns Tími fæðingu Stjörnumerki",
  "notes": [],
  "attrs": [
   {
    "name": "Stærð",
    "kind": "buttons",
    "options": [
     "21x30",
     "30x40"
    ],
    "swatches": null
   },
   {
    "name": "Rammi",
    "kind": "buttons",
    "options": [
     "Enginn rammi",
     "Hvítur zoom rammi",
     "Svartur zoom rammi"
    ],
    "swatches": null
   }
  ],
  "variations": [
   {
    "attrs": {
     "Stærð": "21x30",
     "Rammi": "Enginn rammi"
    },
    "price": 3900
   },
   {
    "attrs": {
     "Stærð": "21x30",
     "Rammi": "Hvítur zoom rammi"
    },
    "price": 6500
   },
   {
    "attrs": {
     "Stærð": "21x30",
     "Rammi": "Svartur zoom rammi"
    },
    "price": 6500
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Rammi": "Enginn rammi"
    },
    "price": 4900
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Rammi": "Hvítur zoom rammi"
    },
    "price": 8500
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Rammi": "Svartur zoom rammi"
    },
    "price": 8500
   }
  ],
  "personalize": {
   "photo": null,
   "texts": [
    {
     "label": "Upplýsingar um barnið",
     "required": true,
     "max": 300,
     "hint": "Nafn, fæðingardagur, tími, þyngd og lengd"
    }
   ],
   "require": "text"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-faedingarspjald-nr-5-1",
    "w": 1400,
    "h": 1861,
    "fit": "contain"
   }
  ]
 },
 {
  "slug": "faedingarspjald-nr-4",
  "name": "Fæðingarspjald nr. 4",
  "cats": [
   "barnaherbergid",
   "thin-honnun"
  ],
  "price": 3900,
  "priceMax": 8500,
  "desc": "Fæðingarspjald með staf barnsins, Nafni eða án nafns Fæðingardagur. Þyngd barns Lengd barns Tími fæðingu Stjörnumerki",
  "notes": [],
  "attrs": [
   {
    "name": "Stærð",
    "kind": "buttons",
    "options": [
     "21x30",
     "30x40"
    ],
    "swatches": null
   },
   {
    "name": "Rammi",
    "kind": "buttons",
    "options": [
     "Enginn rammi",
     "Hvítur zoom rammi",
     "Svartur zoom rammi"
    ],
    "swatches": null
   }
  ],
  "variations": [
   {
    "attrs": {
     "Stærð": "21x30",
     "Rammi": "Enginn rammi"
    },
    "price": 3900
   },
   {
    "attrs": {
     "Stærð": "21x30",
     "Rammi": "Hvítur zoom rammi"
    },
    "price": 6500
   },
   {
    "attrs": {
     "Stærð": "21x30",
     "Rammi": "Svartur zoom rammi"
    },
    "price": 6500
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Rammi": "Enginn rammi"
    },
    "price": 4900
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Rammi": "Hvítur zoom rammi"
    },
    "price": 8500
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Rammi": "Svartur zoom rammi"
    },
    "price": 8500
   }
  ],
  "personalize": {
   "photo": null,
   "texts": [
    {
     "label": "Upplýsingar um barnið",
     "required": true,
     "max": 300,
     "hint": "Nafn, fæðingardagur, tími, þyngd og lengd"
    }
   ],
   "require": "text"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-faedingarspjald-nr-4-1",
    "w": 1400,
    "h": 1867,
    "fit": "contain"
   }
  ]
 },
 {
  "slug": "giraffi",
  "name": "Gíraffi",
  "cats": [
   "barnaherbergid"
  ],
  "price": 1900,
  "priceMax": 7300,
  "desc": "Falleg mynd í barnaherbergi. 21 x 30 cm eða 30 x 40 cm Með eða án ramma",
  "notes": [],
  "attrs": [
   {
    "name": "Stærð",
    "kind": "buttons",
    "options": [
     "21x30",
     "30x40"
    ],
    "swatches": null
   },
   {
    "name": "Rammi",
    "kind": "buttons",
    "options": [
     "Enginn rammi",
     "Hvítur zoom rammi",
     "Svartur zoom rammi"
    ],
    "swatches": null
   }
  ],
  "variations": [
   {
    "attrs": {
     "Stærð": "21x30",
     "Rammi": "Enginn rammi"
    },
    "price": 1900
   },
   {
    "attrs": {
     "Stærð": "21x30",
     "Rammi": "Hvítur zoom rammi"
    },
    "price": 5100
   },
   {
    "attrs": {
     "Stærð": "21x30",
     "Rammi": "Svartur zoom rammi"
    },
    "price": 5100
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Rammi": "Enginn rammi"
    },
    "price": 2900
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Rammi": "Hvítur zoom rammi"
    },
    "price": 7300
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Rammi": "Svartur zoom rammi"
    },
    "price": 7300
   }
  ],
  "personalize": {
   "photo": null,
   "texts": [],
   "require": "none"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-giraffi-1",
    "w": 771,
    "h": 1024,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "fill",
  "name": "Fíll",
  "cats": [
   "barnaherbergid"
  ],
  "price": 1900,
  "priceMax": 7300,
  "desc": "Falleg mynd í barnaherbergi. 21 x 30 cm eða 30 x 40 cm Með eða án ramma",
  "notes": [],
  "attrs": [
   {
    "name": "Stærð",
    "kind": "buttons",
    "options": [
     "21x30",
     "30x40"
    ],
    "swatches": null
   },
   {
    "name": "Rammi",
    "kind": "buttons",
    "options": [
     "Enginn rammi",
     "Hvítur zoom rammi",
     "Svartur zoom rammi"
    ],
    "swatches": null
   }
  ],
  "variations": [
   {
    "attrs": {
     "Stærð": "21x30",
     "Rammi": "Enginn rammi"
    },
    "price": 1900
   },
   {
    "attrs": {
     "Stærð": "21x30",
     "Rammi": "Hvítur zoom rammi"
    },
    "price": 5100
   },
   {
    "attrs": {
     "Stærð": "21x30",
     "Rammi": "Svartur zoom rammi"
    },
    "price": 5100
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Rammi": "Enginn rammi"
    },
    "price": 2900
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Rammi": "Hvítur zoom rammi"
    },
    "price": 7300
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Rammi": "Svartur zoom rammi"
    },
    "price": 7300
   }
  ],
  "personalize": {
   "photo": null,
   "texts": [],
   "require": "none"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-fill-1",
    "w": 769,
    "h": 1024,
    "fit": "cover"
   }
  ]
 },
 {
  "slug": "quadrum-rammi",
  "name": "Quadrum rammi",
  "cats": [
   "rammar"
  ],
  "price": 5690,
  "priceMax": 10100,
  "desc": "Quadrum viðar rammar í mörgum stærðum",
  "notes": [],
  "attrs": [
   {
    "name": "Stærð",
    "kind": "buttons",
    "options": [
     "13x18",
     "15x20",
     "18x24",
     "24x30",
     "30x40",
     "A4-21x29.7",
     "A3 - 29.7x42",
     "20x20",
     "30x30",
     "40x40"
    ],
    "swatches": null
   },
   {
    "name": "Litur",
    "kind": "swatch",
    "options": [
     "Svartur",
     "Hvítur"
    ],
    "swatches": {
     "Svartur": "#151515",
     "Hvítur": "#ffffff"
    }
   }
  ],
  "variations": [
   {
    "attrs": {
     "Stærð": "13x18",
     "Litur": "Svartur"
    },
    "price": 5690
   },
   {
    "attrs": {
     "Stærð": "13x18",
     "Litur": "Hvítur"
    },
    "price": 5690
   },
   {
    "attrs": {
     "Stærð": "15x20",
     "Litur": "Svartur"
    },
    "price": 6300
   },
   {
    "attrs": {
     "Stærð": "15x20",
     "Litur": "Hvítur"
    },
    "price": 6300
   },
   {
    "attrs": {
     "Stærð": "18x24",
     "Litur": "Svartur"
    },
    "price": 6400
   },
   {
    "attrs": {
     "Stærð": "18x24",
     "Litur": "Hvítur"
    },
    "price": 6400
   },
   {
    "attrs": {
     "Stærð": "24x30",
     "Litur": "Svartur"
    },
    "price": 7800
   },
   {
    "attrs": {
     "Stærð": "24x30",
     "Litur": "Hvítur"
    },
    "price": 7800
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Litur": "Svartur"
    },
    "price": 8800
   },
   {
    "attrs": {
     "Stærð": "30x40",
     "Litur": "Hvítur"
    },
    "price": 8800
   },
   {
    "attrs": {
     "Stærð": "A4-21x29.7",
     "Litur": "Svartur"
    },
    "price": 7600
   },
   {
    "attrs": {
     "Stærð": "A4-21x29.7",
     "Litur": "Hvítur"
    },
    "price": 7600
   },
   {
    "attrs": {
     "Stærð": "A3 - 29.7x42",
     "Litur": "Svartur"
    },
    "price": 9350
   },
   {
    "attrs": {
     "Stærð": "A3 - 29.7x42",
     "Litur": "Hvítur"
    },
    "price": 9350
   },
   {
    "attrs": {
     "Stærð": "20x20",
     "Litur": "Svartur"
    },
    "price": 6550
   },
   {
    "attrs": {
     "Stærð": "20x20",
     "Litur": "Hvítur"
    },
    "price": 6550
   },
   {
    "attrs": {
     "Stærð": "30x30",
     "Litur": "Svartur"
    },
    "price": 8750
   },
   {
    "attrs": {
     "Stærð": "30x30",
     "Litur": "Hvítur"
    },
    "price": 8750
   },
   {
    "attrs": {
     "Stærð": "40x40",
     "Litur": "Svartur"
    },
    "price": 10100
   },
   {
    "attrs": {
     "Stærð": "40x40",
     "Litur": "Hvítur"
    },
    "price": 10100
   }
  ],
  "personalize": {
   "photo": null,
   "texts": [],
   "require": "none"
  },
  "framkollun": null,
  "imgs": [
   {
    "src": "p-quadrum-rammi-1",
    "w": 1400,
    "h": 1070,
    "fit": "cover"
   },
   {
    "src": "p-quadrum-rammi-2",
    "w": 1400,
    "h": 1138,
    "fit": "cover"
   }
  ]
 }
]
export const CATS = [
 {
  "slug": "framkollun",
  "name": "Framköllun",
  "intro": "Myndirnar þínar á ljósmyndapappír, í þeirri stærð sem þú velur."
 },
 {
  "slug": "thin-honnun",
  "name": "Þín hönnun",
  "intro": "Þín mynd og þinn texti á vöru sem við prentum hér í Mosfellsbæ."
 },
 {
  "slug": "okkar-honnun",
  "name": "Okkar hönnun",
  "intro": "Tilbúnar gjafir með okkar eigin hönnun."
 },
 {
  "slug": "barnaherbergid",
  "name": "Barnaherbergið",
  "intro": "Fæðingarspjöld og myndir í barnaherbergið, með eða án ramma."
 },
 {
  "slug": "rammar",
  "name": "Rammar",
  "intro": "Rammar í mörgum stærðum fyrir myndirnar þínar."
 },
 {
  "slug": "jolin",
  "name": "Jólin",
  "intro": "Persónulegar jólagjafir."
 }
] as const
export const BIZ = {
 "name": "Instaprent",
 "legal": "Myndó ljósmyndastofa ehf",
 "kt": "460607-1670",
 "vsk": "94612",
 "street": "Háholt 14",
 "street_note": "Bjarkarholt 2, Háholt 14 húsið",
 "postcode": "270",
 "city": "Mosfellsbær",
 "phone": "898-1744",
 "phone_href": "+3548981744",
 "email": "hallo@instaprent.is",
 "hours": [
  [
   "Virka daga",
   "12–17"
  ],
  [
   "Laugardaga",
   "12–15"
  ]
 ],
 "shipping_days": "5–7 virkir dagar",
 "myndo_url": "https://myndo.is",
 "passamyndir": "Panta passamyndatökur"
}
