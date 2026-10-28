import type { PreviewCompany } from '../company-types'

/*
 * Íslyft — harvest snapshot 28.10.2026, not a live availability feed.
 * Sources: _docs/islyft-harvest-2026-10-28/{CONTENT.md, company.json,
 * brands.json, categories.json, models.json, stock.json, asset-manifest.json}.
 * Source URLs / raw evidence are preserved there. Asset output/source mapping:
 * _docs/islyft-build-2026-10-28/asset-manifest.json (original cards) and
 * slice-3-picks.json / build-slice-3-assets.py (final slot picks).
 * Unknown facts remain null/empty; editorial labels and compatibility fields
 * are identified below. No emergency, finance, rental or warranty claim added.
 * Page.tsx and chat.ts use the same Íslyft harvest snapshot.
 */
const BASE = import.meta.env.BASE_URL
export const A = (name: string) => `${BASE}islyft/${name}`
export type Photo = { src: string; srcSet: string; alt: string; w: number; h: number }
const photo = (name: string, widths: number[], w: number, h: number, alt: string): Photo => ({
  src: A(`${name}-${widths[widths.length - 1]}.webp`),
  srcSet: widths.map((x) => `${A(`${name}-${x}.webp`)} ${x}w`).join(', '), alt, w, h,
})

// company.json.CONTACT; unknown string fields are empty for existing consumers.
export const CONTACT = {
  "legal": "Íslyft ehf.",
  "kt": "411173-0469",
  "vsk": "",
  "street": "Vesturvör 32",
  "town": "200 Kópavogi",
  "phone": "514 1600",
  "tel": "+3545141600",
  "email": "islyft@islyft.is",
  "emergency": "",
  "emergencyTel": "",
  "facebook": "https://www.facebook.com/%C3%8Dslyft-ehf-921579091239808/",
  "slogan": "",
  "addresses": [
    "Vesturvör 32, 200 Kópavogi",
    "Lækjarvellir 6, 604 Akureyri"
  ]
}

// CONTENT.md / brands.json / homepage links; map queries derive only from CONTACT.addresses.
// Empty legacy URLs mean unsupported: hide their controls in slice 2.
export const LINKS = {
  "linde": "https://www.islyft.is/product-category/linde/",
  "manitou": "https://www.islyft.is/product-category/manitou/",
  "newCars": "https://www.islyft.is/lyftarar/",
  "thjonusta": "https://www.islyft.is/um-okkur-2/",
  "varahlutir": "https://www.islyft.is/varahlutir-3/",
  "um": "https://www.islyft.is/um-okkur-2/",
  "used": "https://solutorgislyft.azurewebsites.net/Pages/SolulyftararGerdLyftarar.aspx",
  "map": "https://www.google.com/maps/search/?api=1&query=Vesturv%C3%B6r%2032%2C%20200%20K%C3%B3pavogi",
  "mapAkureyri": "https://www.google.com/maps/search/?api=1&query=L%C3%A6kjarvellir%206%2C%20604%20Akureyri",
  "jeep": "https://www.islyft.is/product-category/linde/",
  "ram": "https://www.islyft.is/product-category/linde/",
  "leapmotor": "https://www.islyft.is/product-category/manitou/",
  "breytingar": "",
  "ramBreytingar": "",
  "grandBreyting": "",
  "neyd": "",
  "abyrgd": "",
  "bilalan": "",
  "rafbilastyrkur": "",
  "rekstrarleiga": "",
  "aukahlutir": "",
  "mapService": "",
  "mapUsed": ""
}

type Span = { d: number[]; from: number; to: number }
export type Dept = { key: string; name: string; street: string; phone: string; tel: string; email: string; hours: { label: string; time: string }[]; spans: Span[]; map: string; note?: string }
// company.json.DEPTS. Keep sales first, workshop third, parts fourth while
// the inherited consumer uses indexes. There is NO separate stock department.
// No address/email inferred from the main company or a named staff member.
export const DEPTS: Dept[] = [
  {
    "key": "sala",
    "name": "Söludeild",
    "street": "",
    "phone": "514 1610",
    "tel": "+3545141610",
    "email": "solumenn@islyft.is",
    "hours": [],
    "spans": [],
    "map": ""
  },
  {
    "key": "skrifstofa",
    "name": "Skrifstofa",
    "street": "",
    "phone": "514 1605",
    "tel": "+3545141605",
    "email": "",
    "hours": [],
    "spans": [],
    "map": ""
  },
  {
    "key": "verkstaedi",
    "name": "Verkstæði",
    "street": "",
    "phone": "514 1650",
    "tel": "+3545141650",
    "email": "",
    "hours": [],
    "spans": [],
    "map": ""
  },
  {
    "key": "varahlutir",
    "name": "Varahlutir",
    "street": "",
    "phone": "514 1620",
    "tel": "+3545141620",
    "email": "varahlutir@islyft.is",
    "hours": [],
    "spans": [],
    "map": ""
  },
  {
    "key": "akureyri",
    "name": "Akureyri",
    "street": "Lækjarvellir 6, 604 Akureyri",
    "phone": "514 1600",
    "tel": "+3545141600",
    "email": "",
    "hours": [],
    "spans": [],
    "map": "https://www.google.com/maps/search/?api=1&query=L%C3%A6kjarvellir%206%2C%20604%20Akureyri"
  }
]

// Unknown is neither open nor closed. Slice 2 must guard badges with known,
// remove the timer and replace menu hours[0].time with a phone action.
export function openState(_dept: Dept, _now = new Date()): { known: false; open: null; text: string } {
  return { known: false, open: null, text: '' }
}
// No source offer. Blank compatibility values must never be presented as offers.
export const EMERGENCY = { available: false, weekdays: '', weekends: '', fee: '' }
// No published financing offer; the loan strip is removed in slice 2.
export const LOANS: { name: string; monthly: string; ahk: string }[] = []
export const MODS = {
  available: false, ram: '', wrangler: '',
  grand: [] as { size: string; items: string; price: string }[],
  wrangler37: { name: '', price: '' },
}

// brands.json[].name: only the twelve published agencies.
export type Brand = "EvoQuip" | "Dinos" | "Linde" | "Manitou" | "John Deere" | "Avant" | "Combilift" | "SAMI" | "Goupil" | "Dulevo" | "Konecranes" | "Sennebogen"
export type Model = {
  key: string; brand: Brand; name: string; kind: string
  power?: string
  price: string | null
  note?: string; facts: string[]; href: string; img: Photo; studio?: boolean
  category?: string; categoryKeys?: string[]; capacityKg?: number
  specs?: { published: Record<string, string>; publishedTables: string[][][] }
  brochures?: string[]; imageOrigin?: string
}
export const fullName = (m: Pick<Model, 'brand' | 'name'>) => (m.name.startsWith(m.brand) ? m.name : `${m.brand} ${m.name}`)
// All factual model fields copied from models.json[key]; full published table
// retained verbatim (including ambiguous units). capacityKg only if numeric.
export const MODELS: Model[] = [
  {
  "key": "linde-e16-20-evo",
  "brand": "Linde",
  "name": "Linde E16-20 EVO",
  "kind": "Rafmagnslyftari",
  "category": "Linde - Rafmagnslyftarar",
  "price": null,
  "facts": [
    "Lengd: 3 095",
    "Breidd: 1 172",
    "Vél: Rafmagn 48V",
    "Hámarkshraði: 20 km/h",
    "Lyftihæð: 3 150"
  ],
  "href": "https://www.islyft.is/product/linde-e16-20-evo/",
  "power": "Rafmagn",
  "categoryKeys": [
    "linde",
    "linde-rafmagnslyftarar"
  ],
  "specs": {
    "published": {
      "Lengd": "3 095",
      "Breidd": "1 172",
      "Vél": "Rafmagn 48V",
      "Hámarkshraði": "20 km/h",
      "Lyftihæð": "3 150"
    },
    "publishedTables": [
      [
        [
          "Lengd",
          "3 095"
        ],
        [
          "Breidd",
          "1 172"
        ],
        [
          "Vél",
          "Rafmagn 48V"
        ],
        [
          "Hámarkshraði",
          "20 km/h"
        ],
        [
          "Lyftihæð",
          "3 150"
        ]
      ]
    ]
  },
  "brochures": [
    "https://www.linde-mh.com/media/Brochures/EN_e_trucks_brochure.pdf"
  ],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-linde-e16-20-evo", [800, 1600], 1650, 1238, "Linde E16–20 EVO — mynd úr vörulista"),
},
  {
  "key": "linde-h14-20-evo",
  "brand": "Linde",
  "name": "Linde H14-20 EVO",
  "kind": "Dísillyftari",
  "category": "Linde - Dísellyftarar",
  "price": null,
  "facts": [
    "Lengd: 3 231",
    "Breidd: 1 152",
    "Vél: CNG 30 kW",
    "Hámarkshraði: 20 km/h",
    "Lyftihæð: 3 150"
  ],
  "href": "https://www.islyft.is/product/linde-h14-20-evo/",
  "power": "Dísil",
  "categoryKeys": [
    "linde",
    "linde-disellyftarar-linde"
  ],
  "specs": {
    "published": {
      "Lengd": "3 231",
      "Breidd": "1 152",
      "Vél": "CNG 30 kW",
      "Hámarkshraði": "20 km/h",
      "Lyftihæð": "3 150"
    },
    "publishedTables": [
      [
        [
          "Lengd",
          "3 231"
        ],
        [
          "Breidd",
          "1 152"
        ],
        [
          "Vél",
          "CNG 30 kW"
        ],
        [
          "Hámarkshraði",
          "20 km/h"
        ],
        [
          "Lyftihæð",
          "3 150"
        ]
      ]
    ]
  },
  "brochures": [
    "https://www.linde-mh.com/media/Brochures/p_h14_80_en_b_0217.pdf"
  ],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-linde-h14-20-evo", [
  800,
  1600
], 1650, 1238, "Linde H14-20 EVO — mynd úr vörulista"),
},
  {
  "key": "linde-l14-20",
  "brand": "Linde",
  "name": "Linde L14-20",
  "kind": "Staflari",
  "category": "Linde - Rafmagnsstaflarar",
  "price": null,
  "facts": [
    "Lengd: 2 068",
    "Breidd: 810",
    "Vél: Rafmagn 24V",
    "Hámarkshraði: 6 km/h",
    "Lyftihæð: 2 684"
  ],
  "href": "https://www.islyft.is/product/linde-l14-20/",
  "power": "Rafmagn",
  "categoryKeys": [
    "linde",
    "linde-rafmagnsstaflarar"
  ],
  "specs": {
    "published": {
      "Lengd": "2 068",
      "Breidd": "810",
      "Vél": "Rafmagn 24V",
      "Hámarkshraði": "6 km/h",
      "Lyftihæð": "2 684"
    },
    "publishedTables": [
      [
        [
          "Lengd",
          "2 068"
        ],
        [
          "Breidd",
          "810"
        ],
        [
          "Vél",
          "Rafmagn 24V"
        ],
        [
          "Hámarkshraði",
          "6 km/h"
        ],
        [
          "Lyftihæð",
          "2 684"
        ]
      ]
    ]
  },
  "brochures": [
    "https://www.linde-mh.com/media/Datasheets/EN_ds_1173_l14_20_0315_ind_b.pdf"
  ],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-linde-l14-20", [
  800,
  1600
], 1650, 1238, "Linde L14-20 — mynd úr vörulista"),
},
  {
  "key": "linde-r14-20g",
  "brand": "Linde",
  "name": "Linde R14-20G",
  "kind": "Hályftari",
  "category": "Linde - Hillulyftarar",
  "price": null,
  "facts": [
    "Lengd: 2 478",
    "Breidd: 1270-1458",
    "Vél: Rafmagn 48V",
    "Hámarkshraði: 14 km/h",
    "Lyftihæð: 4910-7710"
  ],
  "href": "https://www.islyft.is/product/linde-r14-20g/",
  "power": "Rafmagn",
  "categoryKeys": [
    "linde",
    "linde-hillulyftarar"
  ],
  "specs": {
    "published": {
      "Lengd": "2 478",
      "Breidd": "1270-1458",
      "Vél": "Rafmagn 48V",
      "Hámarkshraði": "14 km/h",
      "Lyftihæð": "4910-7710"
    },
    "publishedTables": [
      [
        [
          "Lengd",
          "2 478"
        ],
        [
          "Breidd",
          "1270-1458"
        ],
        [
          "Vél",
          "Rafmagn 48V"
        ],
        [
          "Hámarkshraði",
          "14 km/h"
        ],
        [
          "Lyftihæð",
          "4910-7710"
        ]
      ]
    ]
  },
  "brochures": [
    "https://www.linde-mh.com/media/Datasheets/EN_ds_r14_r20g_1120_en_e_1020.pdf"
  ],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-linde-r14-20g", [
  800,
  1600
], 1650, 1238, "Linde R14-20G — mynd úr vörulista"),
},
  {
  "key": "manitou-mt-625-ha-st5",
  "brand": "Manitou",
  "name": "Manitou MT 625 HA ST5",
  "kind": "Skotbómulyftari",
  "category": "Manitou - Byggingaiðnaður",
  "price": null,
  "facts": [
    "Lyftigeta (kg): 2500",
    "Gírkassi: Hydrostatic",
    "Vél: Kubota Stage V"
  ],
  "href": "https://www.islyft.is/product/manitou-mt-625-ha-st5/",
  "categoryKeys": [
    "manitou",
    "manitou-byggingaidnadur-manitou"
  ],
  "capacityKg": 2500,
  "specs": {
    "published": {
      "Lyftigeta (kg)": "2500",
      "Gírkassi": "Hydrostatic",
      "Vél": "Kubota Stage V"
    },
    "publishedTables": [
      [
        [
          "Lyftigeta (kg)",
          "2500"
        ],
        [
          "Gírkassi",
          "Hydrostatic"
        ],
        [
          "Vél",
          "Kubota Stage V"
        ]
      ]
    ]
  },
  "brochures": [],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-manitou-mt-625-ha-st5", [
  768
], 768, 576, "Manitou MT 625 HA ST5 — mynd úr vörulista"),
},
  {
  "key": "manitou-mlt-737-130-ps",
  "brand": "Manitou",
  "name": "Manitou MLT 737-130 PS+",
  "kind": "Skotbómulyftari",
  "category": "Manitou - Landbúnaður / Sjávarútvegur",
  "price": null,
  "facts": [
    "Lyftigeta (kg): 3700",
    "Gírkassi: Torque Converter with Powershuttle",
    "Vél: Deutz Stage V"
  ],
  "href": "https://www.islyft.is/product/manitou-mlt-737-130-ps/",
  "categoryKeys": [
    "manitou",
    "manitou-landbunadur-sjavarutvegur"
  ],
  "capacityKg": 3700,
  "specs": {
    "published": {
      "Lyftigeta (kg)": "3700",
      "Gírkassi": "Torque Converter with Powershuttle",
      "Vél": "Deutz Stage V"
    },
    "publishedTables": [
      [
        [
          "Lyftigeta (kg)",
          "3700"
        ],
        [
          "Gírkassi",
          "Torque Converter with Powershuttle"
        ],
        [
          "Vél",
          "Deutz Stage V"
        ]
      ]
    ]
  },
  "brochures": [],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-manitou-mlt-737-130-ps", [
  768
], 768, 576, "Manitou MLT 737-130 PS+ — mynd úr vörulista"),
},
  {
  "key": "manitou-170-aetj-l-bi",
  "brand": "Manitou",
  "name": "Manitou 170 AETJ-L BI",
  "kind": "Vinnulyfta",
  "category": "Manitou - Vinnulyftur",
  "price": null,
  "facts": [
    "Stærð á vinnupalli: 6990 x 1910",
    "Lyftihæð: 17 030"
  ],
  "href": "https://www.islyft.is/product/manitou-170-aetj-l-bi/",
  "categoryKeys": [
    "manitou",
    "manitou-vinnulyftur"
  ],
  "specs": {
    "published": {
      "Stærð á vinnupalli": "6990 x 1910",
      "Lyftihæð": "17 030"
    },
    "publishedTables": [
      [
        [
          "Stærð á vinnupalli",
          "6990 x 1910"
        ],
        [
          "Lyftihæð",
          "17 030"
        ]
      ]
    ]
  },
  "brochures": [],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-manitou-170-aetj-l-bi", [
  800,
  1600
], 2000, 1500, "Manitou 170 AETJ-L BI — mynd úr vörulista"),
},
  {
  "key": "john-deere-5115m",
  "brand": "John Deere",
  "name": "John Deere 5115M",
  "kind": "Dráttarvél",
  "category": "John Deere - 5M",
  "price": null,
  "facts": [
    "Weight: 3600-3900 kg",
    "Vél: 4.5 l engine with 4 cylinders",
    "Hjólhaf: 2,30",
    "Hestöfl (með IPM): 115"
  ],
  "href": "https://www.islyft.is/product/john-deere-5115m/",
  "categoryKeys": [
    "john-deere",
    "john-deere-5m-john-deere"
  ],
  "specs": {
    "published": {
      "Weight": "3600-3900 kg",
      "Vél": "4.5 l engine with 4 cylinders",
      "Hjólhaf": "2,30",
      "Hestöfl (með IPM)": "115"
    },
    "publishedTables": [
      [
        [
          "Weight",
          "3600-3900 kg"
        ],
        [
          "Vél",
          "4.5 l engine with 4 cylinders"
        ],
        [
          "Hjólhaf",
          "2,30"
        ],
        [
          "Hestöfl (með IPM)",
          "115"
        ]
      ]
    ]
  },
  "brochures": [],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-john-deere-5115m", [
  800,
  1366
], 1366, 1024, "John Deere 5115M — mynd úr vörulista"),
},
  {
  "key": "john-deere-8r-340",
  "brand": "John Deere",
  "name": "John Deere 8R 340",
  "kind": "Dráttarvél",
  "category": "John Deere - 8R",
  "price": null,
  "facts": [
    "Weight: 14000 kg",
    "Vél: 9.0 l engine with 6 cylinders",
    "Hjólhaf: 3,05",
    "Hestöfl (með IPM): 388 (285)"
  ],
  "href": "https://www.islyft.is/product/john-deere-8r-340/",
  "categoryKeys": [
    "john-deere",
    "john-deere-8r-john-deere"
  ],
  "specs": {
    "published": {
      "Weight": "14000 kg",
      "Vél": "9.0 l engine with 6 cylinders",
      "Hjólhaf": "3,05",
      "Hestöfl (með IPM)": "388 (285)"
    },
    "publishedTables": [
      [
        [
          "Weight",
          "14000 kg"
        ],
        [
          "Vél",
          "9.0 l engine with 6 cylinders"
        ],
        [
          "Hjólhaf",
          "3,05"
        ],
        [
          "Hestöfl (með IPM)",
          "388 (285)"
        ]
      ]
    ]
  },
  "brochures": [],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-john-deere-8r-340", [
  800,
  1366
], 1366, 1024, "John Deere 8R 340 — mynd úr vörulista"),
},
  {
  "key": "avant-800-series",
  "brand": "Avant",
  "name": "Avant 800 Series",
  "kind": "Liðléttingur",
  "category": "Avant - 800 Series",
  "price": null,
  "facts": [
    "Gírkassi: Hydrostatic",
    "Vél: Kohler Stage V"
  ],
  "href": "https://www.islyft.is/product/avant-800-series/",
  "categoryKeys": [
    "avant",
    "avant-800-series-avant"
  ],
  "specs": {
    "published": {
      "Gírkassi": "Hydrostatic",
      "Vél": "Kohler Stage V"
    },
    "publishedTables": [
      [
        [
          "Gírkassi",
          "Hydrostatic"
        ],
        [
          "Vél",
          "Kohler Stage V"
        ]
      ]
    ]
  },
  "brochures": [],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-avant-800-series", [
  800
], 867, 650, "Avant 800 Series — mynd úr vörulista"),
},
  {
  "key": "combilift-aisle-master-order-picker",
  "brand": "Combilift",
  "name": "Combilift AISLE MASTER ORDER PICKER",
  "kind": "Lyftari",
  "category": "Combilift Aisle Master",
  "price": null,
  "facts": [
    "Breidd: 1 400",
    "Vél: Electric 48V",
    "Lyftihæð: Eftir pöntun"
  ],
  "href": "https://www.islyft.is/product/combilift-aisle-master-order-picker/",
  "power": "Rafmagn",
  "categoryKeys": [
    "combilift",
    "combilift-aisle-master"
  ],
  "specs": {
    "published": {
      "Breidd": "1 400",
      "Vél": "Electric 48V",
      "Lyftihæð": "Eftir pöntun"
    },
    "publishedTables": [
      [
        [
          "Breidd",
          "1 400"
        ],
        [
          "Vél",
          "Electric 48V"
        ],
        [
          "Lyftihæð",
          "Eftir pöntun"
        ]
      ]
    ]
  },
  "brochures": [
    "https://www.aisle-master.com/Test/wp-content/uploads/2021/02/AisleMaster-Stand-on-Electric-Technical-UK-2020-rev-3.1.pdf"
  ],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-combilift-aisle-master-order-picker", [
  800,
  1440
], 1440, 1080, "Combilift AISLE MASTER ORDER PICKER — mynd úr vörulista"),
},
  {
  "key": "dino-120tb",
  "brand": "Dinos",
  "name": "DINO 120TB",
  "kind": "Vinnulyfta",
  "category": "DINO Telescopic",
  "price": null,
  "facts": [
    "Max. working height: 12.00 m",
    "Max. outreach: 7.90 m",
    "Weight: 1360 kg",
    "Primary power source: Battery 24VDC",
    "Petrol generator: Optional"
  ],
  "href": "https://www.islyft.is/product/dino-120tb/",
  "power": "Rafmagn",
  "categoryKeys": [
    "dino-telescopic"
  ],
  "specs": {
    "published": {
      "Max. working height": "12.00 m",
      "Max. outreach": "7.90 m",
      "Weight": "1360 kg",
      "Primary power source": "Battery 24VDC",
      "Petrol generator": "Optional"
    },
    "publishedTables": [
      [
        [
          "Max. working height",
          "12.00 m"
        ],
        [
          "Max. outreach",
          "7.90 m"
        ],
        [
          "Weight",
          "1360 kg"
        ],
        [
          "Primary power source",
          "Battery 24VDC"
        ],
        [
          "Petrol generator",
          "Optional"
        ]
      ]
    ]
  },
  "brochures": [
    "https://www.islyft.is/wp-content/uploads/2025/06/DINO120TB_Product_information_sheet_2017_print.pdf"
  ],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-dino-120tb", [
  709
], 1596, 1197, "DINO 120TB — mynd úr vörulista"),
},
  {
  "key": "dulevo-100",
  "brand": "Dulevo",
  "name": "Dulevo 100",
  "kind": "Sópur",
  "category": "Dulevo - Sópar",
  "price": null,
  "facts": [
    "Lengd: 2 315",
    "Breidd: 1 410",
    "Vél: Electric 36V, Petrol/LPG og Diesel",
    "Breidd á sóp minnst: 1000",
    "Breidd á sóp mest: 2000",
    "Stærð á tanki (ltr): 400",
    "Afköst (m2/klst): 14000-22000"
  ],
  "href": "https://www.islyft.is/product/dulevo-100/",
  "power": "Rafmagn / Dísil / LPG",
  "categoryKeys": [
    "dulevo",
    "dulevo-sopar"
  ],
  "specs": {
    "published": {
      "Lengd": "2 315",
      "Breidd": "1 410",
      "Vél": "Electric 36V, Petrol/LPG og Diesel",
      "Breidd á sóp minnst": "1000",
      "Breidd á sóp mest": "2000",
      "Stærð á tanki (ltr)": "400",
      "Afköst (m2/klst)": "14000-22000"
    },
    "publishedTables": [
      [
        [
          "Lengd",
          "2 315"
        ],
        [
          "Breidd",
          "1 410"
        ],
        [
          "Vél",
          "Electric 36V, Petrol/LPG og Diesel"
        ],
        [
          "Breidd á sóp minnst",
          "1000"
        ],
        [
          "Breidd á sóp mest",
          "2000"
        ],
        [
          "Stærð á tanki (ltr)",
          "400"
        ],
        [
          "Afköst (m2/klst)",
          "14000-22000"
        ]
      ]
    ]
  },
  "brochures": [],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-dulevo-100", [
  800,
  1600
], 1920, 1440, "Dulevo 100 — mynd úr vörulista"),
},
  {
  "key": "bison-120",
  "brand": "EvoQuip",
  "name": "Bison 120",
  "kind": "Brjótur",
  "category": "Bison Jaw Crushers",
  "price": null,
  "facts": [
    "Transport Length: 18 ft 4 in",
    "Transport Width: 7 ft 6 in",
    "Transport Height: 9 ft",
    "Jaw Inlet: 27\" x 16\" / 680mm x 400mm"
  ],
  "href": "https://www.islyft.is/product/bison-120/",
  "categoryKeys": [
    "bison-jaw-crushers",
    "crushing"
  ],
  "specs": {
    "published": {
      "Transport Length": "18 ft 4 in",
      "Transport Width": "7 ft 6 in",
      "Transport Height": "9 ft",
      "Jaw Inlet": "27\" x 16\" / 680mm x 400mm"
    },
    "publishedTables": [
      [
        [
          "Transport Length",
          "18 ft 4 in"
        ],
        [
          "Transport Width",
          "7 ft 6 in"
        ],
        [
          "Transport Height",
          "9 ft"
        ],
        [
          "Jaw Inlet",
          "27\" x 16\" / 680mm x 400mm"
        ]
      ]
    ]
  },
  "brochures": [
    "https://www.islyft.is/wp-content/uploads/2025/06/evoquip-product-catalogue-may-2024-en.pdf"
  ],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-bison-120", [
  768
], 768, 576, "Bison 120 — mynd úr vörulista"),
},
  {
  "key": "goupil-g6",
  "brand": "Goupil",
  "name": "Goupil G6",
  "kind": "Rafknúið nytjatæki",
  "category": "Goupil - Rafmagnsbíll",
  "price": null,
  "facts": [
    "Breidd: 1 704",
    "Vél: Rafmagn lithium",
    "Burðargeta: 1150 kg"
  ],
  "href": "https://www.islyft.is/product/goupil-g6/",
  "power": "Rafmagn",
  "categoryKeys": [
    "goupil",
    "goupil-rafmagnsbill"
  ],
  "specs": {
    "published": {
      "Breidd": "1 704",
      "Vél": "Rafmagn lithium",
      "Burðargeta": "1150 kg"
    },
    "publishedTables": [
      [
        [
          "Breidd",
          "1 704"
        ],
        [
          "Vél",
          "Rafmagn lithium"
        ],
        [
          "Burðargeta",
          "1150 kg"
        ]
      ]
    ]
  },
  "brochures": [
    "https://www.islyft.is/wp-content/uploads/2021/07/Brochure-G6.pdf"
  ],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-goupil-g6", [
  700
], 700, 525, "Goupil G6 — mynd úr vörulista"),
},
  {
  "key": "konecranes-smv-2216-tc3",
  "brand": "Konecranes",
  "name": "Konecranes SMV 2216 TC3",
  "kind": "Gámalyftari",
  "category": "Konecranes - 22-16-6 t",
  "price": null,
  "facts": [
    "Hjólhaf: 5,5",
    "Lyftihæð: 3 gámahæðir í fremstu röð"
  ],
  "href": "https://www.islyft.is/product/konecranes-smv-2216-tc3/",
  "categoryKeys": [
    "konecranes",
    "konecranes-22-16-6-t"
  ],
  "specs": {
    "published": {
      "Hjólhaf": "5,5",
      "Lyftihæð": "3 gámahæðir í fremstu röð"
    },
    "publishedTables": [
      [
        [
          "Hjólhaf",
          "5,5"
        ],
        [
          "Lyftihæð",
          "3 gámahæðir í fremstu röð"
        ]
      ]
    ]
  },
  "brochures": [],
  "imageOrigin": "presumed manufacturer catalogue photography; authorship unverified",
  img: photo("m-konecranes-smv-2216-tc3", [
  800,
  1600
], 2705, 2029, "Konecranes SMV 2216 TC3 — mynd úr vörulista"),
},
]

// Legacy property names retain the existing component contract; refer to SECTION-MAP.
export const IMG = {
  hero: photo("s3-hero", [800, 1600, 1650], 1650, 1100, "Linde E35–50 EVO í vöruhúsi"),
  splitJeep: photo("s3-splitJeep", [800, 1600, 1650], 1650, 1100, "Linde lyftari í vöruhúsi"),
  splitLeap: photo("s3-splitLeap", [800, 940], 940, 627, "Manitou skotbómulyftari við byggingu"),
  drive: photo("s3-drive", [800, 1600, 1650], 1650, 1100, "Linde R10-16B"),
  statement: photo("s3-statement", [640, 1030], 1030, 687, "Vinnuvélar við húsnæði, mynd af vef Íslyft"),
  kerra: photo("s3-kerra", [640, 690], 690, 460, "Manitou skotbómulyftari með skóflu"),
  dekk: photo("s3-dekk", [640, 1024], 1024, 658, "Húsnæði Íslyft og Steinbock þjónustunnar"),
  ljos: photo("s3-ljos", [640, 1280], 1650, 1100, "Linde N16 LI"),
  hus: photo("s3-hus", [640, 1280], 1650, 1100, "Linde H14-20 EVO"),
  leap: photo("s3-leap", [640, 1280], 1366, 768, "John Deere dráttarvél í ræktun"),
  ramhd: photo("s3-ramhd", [640, 800], 800, 531, "Avant 400 Series"),
  grand: photo("s3-grand", [640, 1280], 1440, 960, "Combilift AISLE MASTER ORDER PICKER"),
  ram37: photo("s3-ram37", [640, 1280], 1650, 1100, "Linde E35-50 EVO"),
}

// Five harvested machinery families + stock, in the existing six-card rail.
// UI labels normalized to clean Icelandic; exact source categoryKeys stay on models.
export const CATEGORIES = [
  { key: "linde-rafmagnslyftarar", label: "Rafmagnslyftarar", href: "#urval", img: photo("s3-category-1", [640, 1280], 1650, 1100, "Linde E20-35 Roadster"), pos: "50% 50%" },
  { key: "linde-disellyftarar-linde", label: "Dísillyftarar", href: "#urval", img: photo("s3-category-2", [640, 1280], 1650, 1100, "Linde H40-50 EVO"), pos: "50% 50%" },
  { key: "manitou-skotbomulyftarar", label: "Skotbómulyftarar", href: "#urval", img: photo("s3-category-3", [640, 800], 800, 600, "Manitou MLT 635-130 PS+ / 635-140 V"), pos: "50% 50%" },
  { key: "manitou-vinnulyftur", label: "Vinnulyftur", href: "#urval", img: photo("s3-category-4", [640, 1280], 2400, 1599, "DINO 185XTC II"), pos: "50% 50%" },
  { key: "john-deere", label: "Dráttarvélar", href: "#urval", img: photo("s3-category-5", [640, 1280], 1366, 768, "John Deere dráttarvél í akri"), pos: "50% 50%" },
  { key: "notadir", label: "Sölutorg", href: "#notadir", img: photo("s3-category-6", [640, 1280], 1650, 1100, "Linde N16 LI"), pos: "50% 50%" },
] as const

// stock.json: ten units with real local photos, HTTPS source category URLs (no
// invented detail route). Hours render as vinnustundir; km stays empty only
// for legacy compatibility. No missing-photo substitutes in the stock rail.
export const USED = [
  {
  "key": "u-14166",
  "name": "Linde E14",
  "year": "2019",
  "fuel": "Rafmagn",
  "price": "2.400.000 kr. án vsk.",
  "href": "https://solutorgislyft.azurewebsites.net/Pages/Solulyftarar.aspx?FlokkurLyftara=1",
  "hours": null,
  "category": "Rafmagnslyftari",
  "description": "Hliðarfærsla",
  "km": "",
  "imageMissing": false,
  img: photo("u-14166", [
  600
], 1000, 800, "Linde E14, 2019 — Sölutorg"),
},
  {
  "key": "u-14537",
  "name": "Linde E16PH",
  "year": "2011",
  "fuel": "Rafmagn",
  "price": "3.300.000 kr. án vsk.",
  "href": "https://solutorgislyft.azurewebsites.net/Pages/Solulyftarar.aspx?FlokkurLyftara=1",
  "hours": null,
  "category": "Rafmagnslyftari",
  "description": "Ný innflutt tæki - ökumannshús með miðstöð og útvarpi - gaffalfærsla - 2 vökvaúrtök - þrefalt mastur - lyftihæð 4625 mm - Nýr geymir",
  "km": "",
  "imageMissing": false,
  img: photo("u-14537", [
  600
], 1000, 800, "Linde E16PH, 2011 — Sölutorg"),
},
  {
  "key": "u-11401",
  "name": "Linde E18PH - 386",
  "year": "2008",
  "fuel": "Rafmagn",
  "price": "1.990.000 kr. án vsk.",
  "href": "https://solutorgislyft.azurewebsites.net/Pages/Solulyftarar.aspx?FlokkurLyftara=1",
  "hours": 12500,
  "category": "Rafmagnslyftari",
  "description": "Mikil lyftihæð 5475 mm - hliðarfærsla - þrefalt mastur - ökumannshús með miðstöð   keyrsla 12500 klst",
  "km": "",
  "imageMissing": false,
  img: photo("u-11401", [
  600
], 1000, 800, "Linde E18PH - 386, 2008 — Sölutorg"),
},
  {
  "key": "u-13482",
  "name": "Linde E20PH-386",
  "year": "2022",
  "fuel": "Rafmagn",
  "price": "3.990.000 kr. án vsk.",
  "href": "https://solutorgislyft.azurewebsites.net/Pages/Solulyftarar.aspx?FlokkurLyftara=1",
  "hours": 3745,
  "category": "Rafmagnslyftari",
  "description": "Verð miðast við yfirfarið tæki- málaður- Snúningur- ekin3745 tíma-- 3 mánaða ábyrð - skoðað af Vinnueftirliti",
  "km": "",
  "imageMissing": false,
  img: photo("u-13482", [
  600
], 1000, 800, "Linde E20PH-386, 2022 — Sölutorg"),
},
  {
  "key": "u-10001",
  "name": "Linde E25L-387",
  "year": "2017",
  "fuel": "Rafmagn",
  "price": "4.400.000 kr. án vsk.",
  "href": "https://solutorgislyft.azurewebsites.net/Pages/Solulyftarar.aspx?FlokkurLyftara=1",
  "hours": null,
  "category": "Rafmagnslyftari",
  "description": "Góður lyftari - tvöfalt mastur - nýr geymir síðan 2023 - Ökumannshús með miðstöð og útvarpi",
  "km": "",
  "imageMissing": false,
  img: photo("u-10001", [
  600
], 1000, 800, "Linde E25L-387, 2017 — Sölutorg"),
},
  {
  "key": "u-8390",
  "name": "Linde H20 - 392",
  "year": "2012",
  "fuel": "Dísil",
  "price": "1.700.000 kr. án vsk.",
  "href": "https://solutorgislyft.azurewebsites.net/Pages/Solulyftarar.aspx?FlokkurLyftara=2",
  "hours": 13000,
  "category": "Dísellyftari",
  "description": "Tvöfalt mastur - keyrslu 13000 klst - verð miðað við yfirfarið tæki og nýmálað",
  "km": "",
  "imageMissing": false,
  img: photo("u-8390", [
  600
], 1000, 800, "Linde H20 - 392, 2012 — Sölutorg"),
},
  {
  "key": "u-10660",
  "name": "Linde L14AP",
  "year": "2017",
  "fuel": "Rafmagn",
  "price": "1.900.000 kr. án vsk.",
  "href": "https://solutorgislyft.azurewebsites.net/Pages/Solulyftarar.aspx?FlokkurLyftara=11",
  "hours": null,
  "category": "Hillulyftari",
  "description": "Ónotað tæki - árg. 2017 með lithium rafgeymi - Tvöfalt amstur 3324 mm -   lægsta hæð 2115 mm  frílyfting 1579",
  "km": "",
  "imageMissing": false,
  img: photo("u-10660", [
  600
], 1000, 800, "Linde L14AP, 2017 — Sölutorg"),
},
  {
  "key": "u-10217",
  "name": "Linde  R16 - 1120",
  "year": "2017",
  "fuel": null,
  "price": "3.200.000 kr. án vsk.",
  "href": "https://solutorgislyft.azurewebsites.net/Pages/Solulyftarar.aspx?FlokkurLyftara=11",
  "hours": 118,
  "category": "Hillulyftari",
  "description": "Mjög lítið notað tæki - keyrslutími 118 klst",
  "km": "",
  "imageMissing": false,
  img: photo("u-10217", [
  600
], 1000, 800, "Linde  R16 - 1120, 2017 — Sölutorg"),
},
  {
  "key": "u-5386",
  "name": "Caterpillar NR25KH",
  "year": "2004",
  "fuel": null,
  "price": "1.700.000 kr. án vsk.",
  "href": "https://solutorgislyft.azurewebsites.net/Pages/Solulyftarar.aspx?FlokkurLyftara=11",
  "hours": 1900,
  "category": "Hillulyftari",
  "description": "Lítið notað tæki keyrslutími 1900 klst - mikil lyftihæð",
  "km": "",
  "imageMissing": false,
  img: photo("u-5386", [
  640,
  768
], 1280, 1024, "Caterpillar NR25KH, 2004 — Sölutorg"),
},
  {
  "key": "u-14025",
  "name": "BT LPE240",
  "year": "2013",
  "fuel": "Rafmagn",
  "price": "490.000 kr. án vsk.",
  "href": "https://solutorgislyft.azurewebsites.net/Pages/Solulyftarar.aspx?FlokkurLyftara=12",
  "hours": null,
  "category": "Keyrsluvagn",
  "description": "Gott tæki - ágætur rafgeymir",
  "km": "",
  "imageMissing": false,
  img: photo("u-14025", [
  600
], 1000, 800, "BT LPE240, 2013 — Sölutorg"),
},
]

// CONTENT.md: About / history and Service and parts. 1972 is Steinbock, NOT Íslyft.
export const SAGA = [
  {
    "y": "1972",
    "t": "Steinbock þjónustan stofnuð; Guðlaugur Gíslason var stærsti hluthafi."
  },
  {
    "y": "Síðar",
    "t": "Íslyft hf stofnað utan um innflutning á nýjum lyfturum og öðrum tækjum."
  },
  {
    "y": "2017",
    "t": "Íslyft tók við umboði fyrir John Deere dráttavélar."
  }
]

// company.json / brands.json. No unsupported foundingDate or opening hours.
export const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Íslyft",
  "legalName": "Íslyft ehf.",
  "telephone": "+3545141600",
  "email": "islyft@islyft.is",
  "url": "https://www.islyft.is/",
  "brand": [
    {
      "@type": "Brand",
      "name": "EvoQuip"
    },
    {
      "@type": "Brand",
      "name": "Dinos"
    },
    {
      "@type": "Brand",
      "name": "Linde"
    },
    {
      "@type": "Brand",
      "name": "Manitou"
    },
    {
      "@type": "Brand",
      "name": "John Deere"
    },
    {
      "@type": "Brand",
      "name": "Avant"
    },
    {
      "@type": "Brand",
      "name": "Combilift"
    },
    {
      "@type": "Brand",
      "name": "Goupil"
    },
    {
      "@type": "Brand",
      "name": "Dulevo"
    },
    {
      "@type": "Brand",
      "name": "Konecranes"
    }
  ],
  "address": [
    {
      "@type": "PostalAddress",
      "streetAddress": "Vesturvör 32",
      "postalCode": "200",
      "addressLocality": "Kópavogur",
      "addressCountry": "IS"
    },
    {
      "@type": "PostalAddress",
      "streetAddress": "Lækjarvellir 6",
      "postalCode": "604",
      "addressLocality": "Akureyri",
      "addressCountry": "IS"
    }
  ]
}

// CONTENT.md / company.json / brands.json; editorial preview metadata only.
// No defect/pitch copy or outreach invented in this slice.
export const companyEntry: PreviewCompany = {
  "slug": "islyft",
  "route": "/preview/islyft",
  "name": "Íslyft",
  "sector": "Lyftarar og vinnuvélar",
  "location": "Vesturvör 32, 200 Kópavogi",
  "region": "Kópavogur og Akureyri",
  "established": "Steinbock þjónustan stofnuð 1972; Íslyft stofnað síðar.",
  "currentUrl": "https://www.islyft.is/",
  "ownerEmail": "islyft@islyft.is",
  "concept": "Lyftarar og önnur tæki",
  "conceptTagline": "Úrval lyftara, dráttavéla, liðléttinga og götusópa.",
  "accent": "#00538D",
  "dark": true,
  "status": "In build",
  "ownPhotography": false,
  "photoCredit": "Myndir af islyft.is og Sölutorgi, sóttar 28. október 2026. Vörulistamyndir eru taldar frá framleiðendum; ljósmyndarar og eignarhald eru óstaðfest.",
  "audit": {
    "strengths": [],
    "weaknesses": [],
    "opportunities": []
  },
  "positioning": "Lyftarar, dráttarvélar, liðléttingar, götusópar og varahlutir.",
  "outreach": {
    "subject": "",
    "body": ""
  },
  thumb: A("hero-800.webp"),
}
