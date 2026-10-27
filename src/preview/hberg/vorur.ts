export const BASE=import.meta.env.BASE_URL
// cache-buster: changes every build so replaced images show at once (Pages caches 10 min)
declare const __HB_V__:string
export const V=`?v=${__HB_V__}`
export const ROUTE='/'
export type Lang='is'|'en'
export type Tag=string
export type Allergen=string
export interface Product { slug:string; brand:string; name:{is:string;en:string};desc:{is:string;en:string};ingredients:string;nutrition:string;nutritionRows:string[][]; tags:string[];tint:string;ink?:string;weight?:string;allergens:string[]|null;unverified:string[];labels:{ing?:boolean;nfEu?:boolean;nfUs?:boolean};hasPack:boolean;hasOpen:boolean;macros:number;source:string;imageUrls:string[];season?:string;madeToOrder?:boolean;isNew?:boolean }
export const PRODUCTS:Product[]=[
  {
    "slug": "karamelluklattar-med-jardhnetum-og-sjavarsalti",
    "brand": "hberg",
    "name": {
      "is": "Karamelluklattar með jarðhnetum og sjávarsalti",
      "en": "Karamelluklattar með jarðhnetum og sjávarsalti"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Karamellusúkkulaði (55,2%) (sykur, kakósmjör, MJÓLKURDUFT , ýruefni (E322 úr SOJA ), karamellubragðefni, náttúrúleg vanillubragðefni, paprikukrydd), JARÐHNETUR (44%), sjávarsalt (0,8%)",
    "nutrition": "Næringargildi í 100 g: Orka 2377kJ/572 kkal Fita 40 g -Þar af mettuð 15 g Kolvetni 37 g -Þar af sykurtegundir 33 g Trefjar 3,8 g Prótein 14 g Salt 0,93 g",
    "nutritionRows": [
      [
        "Orka",
        "2377kJ/572 kkal"
      ],
      [
        "Fita",
        "40 g"
      ],
      [
        "-Þar af mettuð",
        "15 g"
      ],
      [
        "Kolvetni",
        "37 g"
      ],
      [
        "-Þar af sykurtegundir",
        "33 g"
      ],
      [
        "Trefjar",
        "3,8 g"
      ],
      [
        "Prótein",
        "14 g"
      ],
      [
        "Salt",
        "0,93 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "peanut",
      "milk",
      "soy"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/karamelluklattar-med-jardhnetum-og-sjavarsalti/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2021/10/karamelluklattar-jardhn-sjavarsalti.jpg",
      "https://hberg.is/wp-content/uploads/2021/10/karamelluklattar-jardhn-sjavarsalti-1.jpg"
    ]
  },
  {
    "slug": "kokosflogur-med-karamellu-sjavarsalti",
    "brand": "hberg",
    "name": {
      "is": "Kókosflögur með Karamellu & Sjávarsalti",
      "en": "Kókosflögur með Karamellu & Sjávarsalti"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Kókosflögur, kókospálmasykur, sjávarsalt",
    "nutrition": "Næringargildi í 100 g: Orka 2705/652 kkal Fita 50 g -Þar af mettuð 47 g Kolvetni 42 g -Þar af sykurtegundir 32 g Trefjar 7,0 g Prótein 5,0 g Salt 0,63 g",
    "nutritionRows": [
      [
        "Orka",
        "2705/652 kkal"
      ],
      [
        "Fita",
        "50 g"
      ],
      [
        "-Þar af mettuð",
        "47 g"
      ],
      [
        "Kolvetni",
        "42 g"
      ],
      [
        "-Þar af sykurtegundir",
        "32 g"
      ],
      [
        "Trefjar",
        "7,0 g"
      ],
      [
        "Prótein",
        "5,0 g"
      ],
      [
        "Salt",
        "0,63 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/kokosflogur-med-karamellu-sjavarsalti/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/08/kokosflogur-1.jpg",
      "https://hberg.is/wp-content/uploads/2020/08/kokosflogur-2.jpg"
    ]
  },
  {
    "slug": "fuglafodur",
    "brand": "hberg",
    "name": {
      "is": "Fuglafóður",
      "en": "Fuglafóður"
    },
    "desc": {
      "is": "Annað",
      "en": "Annað"
    },
    "ingredients": "Innihald: Sólblómafræ",
    "nutrition": "",
    "nutritionRows": [],
    "tags": [
      "annad"
    ],
    "tint": "#A7B9BD",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/fuglafodur/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/08/fuglafodur-1.jpg"
    ]
  },
  {
    "slug": "linsubaunir-raudar",
    "brand": "hberg",
    "name": {
      "is": "Linsubaunir rauðar",
      "en": "Linsubaunir rauðar"
    },
    "desc": {
      "is": "Bökunarvörur",
      "en": "Bökunarvörur"
    },
    "ingredients": "Innihald: Rauðar linsubaunir",
    "nutrition": "Næringargildi í 100 g: Orka 573/136 kkal Fita 0,4 g -Þar af mettuð 0,1 g Kolvetni 20 g -Þar af sykurtegundir 1,8 g Trefjar 7,9 g Prótein 9,0 g Salt 0 g",
    "nutritionRows": [
      [
        "Orka",
        "573/136 kkal"
      ],
      [
        "Fita",
        "0,4 g"
      ],
      [
        "-Þar af mettuð",
        "0,1 g"
      ],
      [
        "Kolvetni",
        "20 g"
      ],
      [
        "-Þar af sykurtegundir",
        "1,8 g"
      ],
      [
        "Trefjar",
        "7,9 g"
      ],
      [
        "Prótein",
        "9,0 g"
      ],
      [
        "Salt",
        "0 g"
      ]
    ],
    "tags": [
      "bakstur"
    ],
    "tint": "#D6C7A4",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/linsubaunir-raudar/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/08/raudar-linsubaunir-1.jpg",
      "https://hberg.is/wp-content/uploads/2020/08/raudar-linsubaunir-2.jpg"
    ]
  },
  {
    "slug": "hnetusmjor-1kg",
    "brand": "hberg",
    "name": {
      "is": "Hnetusmjör 1Kg",
      "en": "Hnetusmjör 1Kg"
    },
    "desc": {
      "is": "Hnetusmjör",
      "en": "Hnetusmjör"
    },
    "ingredients": "Innihald: JARÐHNETUR (97,5%), salt (1,5%), sólblómaolía. Hnetusmjör Uppskriftir & fróðleikur Fróðleikur Hnetusmjör til manneldis má rekja alla leið til Inka og Aztekeka í Suður-Ameríku en sú tegund af hnetusmjör var auðvitað mjög frábrugðið þeim framleiðsluvörum sem við þekkjum í dag. Nútíma saga hnetusmjörs byrjaði í Kanada og í raun ekki fyrr en undir í lok 19. aldar þegar efna & lyfjafræðingurinn Marcellus Gilmore Edson var veitt einkaleyfi á hnetusmjöri. Hnetusmjör er fyrst og fremst próteinríkt var í fyrstu ætlað þeim sem ættu í erfiðleikum með að tyggja mat en slíkt var algengt á þessum tíma. Næringarrík fæða Í hnetusmjöri má finna ríka uppsprettu (20% eða meira af daglegu gildi) trefja, E-vítamíni, pantóþensýru, fólati, níasíni og B6 vítamíni. Einnig má finna steinefni eins og mangan, magnesíum, fosfór, sink, kopar og natríum (bætt við sem salt við framleiðslu) ásamt þíamíni, ríbóflavíni, járni og kalíum. Uppskriftir Geggjað Boost og klárlega okkar uppáhalds skál Við sitjum ekki á gullinu og viljum því deila með ykkur boost uppskrift sem sló heldur betur í gegn hjá starfsfólki okkar og fjölskyldu. Lýsing: Ferskleiki með næringaríkri fylling sem skilar þér aukinni orku og vellíðan. Grunnur: Grísk jógúrt, banani, döðlur, mangó, jarðarber og hnetusmjör. Toppur: Granóla, kókoskaramell, hnetusmjör og jarðarber og banani Skammtið eftir smekk ♥",
    "nutrition": "Næringargildi í 100 g: Orka 2604 kJ/626 kkal Fita 51 g -Þar af mettuð 7,4 g Kolvetni 13 g -Þar af sykurtegundir 4,7 g Trefjar 6,6 g Prótein 25 g Salt 1,5 g",
    "nutritionRows": [
      [
        "Orka",
        "2604 kJ/626 kkal"
      ],
      [
        "Fita",
        "51 g"
      ],
      [
        "-Þar af mettuð",
        "7,4 g"
      ],
      [
        "Kolvetni",
        "13 g"
      ],
      [
        "-Þar af sykurtegundir",
        "4,7 g"
      ],
      [
        "Trefjar",
        "6,6 g"
      ],
      [
        "Prótein",
        "25 g"
      ],
      [
        "Salt",
        "1,5 g"
      ]
    ],
    "tags": [
      "smjor"
    ],
    "tint": "#D7B45D",
    "allergens": [
      "peanut"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/hnetusmjor-1kg/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/07/hnetusmjör-1-kg-mynd.png",
      "https://hberg.is/wp-content/uploads/2020/07/hnetusmjör-1-kg-mynd.png"
    ],
    "weight": "1Kg"
  },
  {
    "slug": "orkustykki",
    "brand": "hberg",
    "name": {
      "is": "Orkustykki",
      "en": "Orkustykki"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Döðlur (68%), kókos, kakó.",
    "nutrition": "Næringargildi í 100 g: Orka 1698 kJ/406 kkal Fita 18 g -Þar af mettuð 15 g Kolvetni 61 g -Þar af sykurtegundir 45 g Trefjar 10 g Prótein 5,0 g Salt 0,04 g",
    "nutritionRows": [
      [
        "Orka",
        "1698 kJ/406 kkal"
      ],
      [
        "Fita",
        "18 g"
      ],
      [
        "-Þar af mettuð",
        "15 g"
      ],
      [
        "Kolvetni",
        "61 g"
      ],
      [
        "-Þar af sykurtegundir",
        "45 g"
      ],
      [
        "Trefjar",
        "10 g"
      ],
      [
        "Prótein",
        "5,0 g"
      ],
      [
        "Salt",
        "0,04 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/orkustykki/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/06/orkustykki-dod-kokos-kako-50gr-5.jpg",
      "https://hberg.is/wp-content/uploads/2020/06/orkustykki-dod-kokos-kako-50gr-2.jpg"
    ]
  },
  {
    "slug": "strasaet-erytritol",
    "brand": "hberg",
    "name": {
      "is": "Strásæt Erýtrítól",
      "en": "Strásæt Erýtrítól"
    },
    "desc": {
      "is": "Bökunarvörur",
      "en": "Bökunarvörur"
    },
    "ingredients": "Innihald: Erýthritól strásæta",
    "nutrition": "Næringargildi í 100 g: Orka 0 kJ/0 kkal Fita 0 g -Þar af mettuð 0 g Kolvetni 0 g -Þar af sykurtegundir 0 g , Þar af Erýtritól 100 g Trefjar 0 g Prótein 0 g Salt 0 g",
    "nutritionRows": [
      [
        "Orka",
        "0 kJ/0 kkal"
      ],
      [
        "Fita",
        "0 g"
      ],
      [
        "-Þar af mettuð",
        "0 g"
      ],
      [
        "Kolvetni",
        "0 g"
      ],
      [
        "-Þar af sykurtegundir",
        "0 g"
      ],
      [
        ", Þar af Erýtritól",
        "100 g"
      ],
      [
        "Trefjar",
        "0 g"
      ],
      [
        "Prótein",
        "0 g"
      ],
      [
        "Salt",
        "0 g"
      ]
    ],
    "tags": [
      "bakstur"
    ],
    "tint": "#D6C7A4",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/strasaet-erytritol/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/05/strasaeta-2.jpg",
      "https://hberg.is/wp-content/uploads/2020/05/strasaeta.jpg"
    ]
  },
  {
    "slug": "karamellu-mondlur-med-sukkuladi-sjavarsalti",
    "brand": "hberg",
    "name": {
      "is": "Karamellu-Möndlur með Súkkulaði & Sjávarsalti",
      "en": "Karamellu-Möndlur með Súkkulaði & Sjávarsalti"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Súkkulaði með karamellubragði (68%) (sykur, kakósmjör, MJÓLKURDUFT , kakómassi, ýruefni (E322 úr SOJA ), karamellubragðefni, krydd, náttúrulegt vanillu bragðefni), MÖNDLUR (30%), glúkósasíróp, húðunarefni (E414, E904), salt",
    "nutrition": "Næringargildi í 100 g: Orka 2358 kJ/566kkal Fita 39 g -Þar af mettuð 15 g Kolvetni 43 g -Þar af sykurtegundir 40 g Trefjar 3,4 g Prótein 11 g Salt 0,45 g",
    "nutritionRows": [
      [
        "Orka",
        "2358 kJ/566kkal"
      ],
      [
        "Fita",
        "39 g"
      ],
      [
        "-Þar af mettuð",
        "15 g"
      ],
      [
        "Kolvetni",
        "43 g"
      ],
      [
        "-Þar af sykurtegundir",
        "40 g"
      ],
      [
        "Trefjar",
        "3,4 g"
      ],
      [
        "Prótein",
        "11 g"
      ],
      [
        "Salt",
        "0,45 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "nuts",
      "milk",
      "soy"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/karamellu-mondlur-med-sukkuladi-sjavarsalti/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/05/karamellu-mondlur_sukk-salt-2.jpg",
      "https://hberg.is/wp-content/uploads/2020/05/karamellu-mondlur_sukk-salt.jpg"
    ]
  },
  {
    "slug": "heslihnetur-med-sukkuladi-afrit",
    "brand": "hberg",
    "name": {
      "is": "Heslihnetur með súkkulaði",
      "en": "Heslihnetur með súkkulaði"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Súkkulaði (78%) (sykur, MJÓLKURDUFT , kakómassi, kakósmjör, MYSUDUFT , ýruefni (E322 úr SOJA ), náttúrulegt bragðefni), HESLIHNETUR (20%), glúkósasíróp, húðunarefni (E414, E904)",
    "nutrition": "Heslihnetur með súkkulaði Næringargildi í 100 g: Orka 2264 kJ/543kkal Fita 34 g -Þar af mettuð 14 g Kolvetni 50 g -Þar af sykurtegundir 48 g Trefjar 3,8 g Prótein 8,0 g Salt 0,22 g",
    "nutritionRows": [
      [
        "Orka",
        "2264 kJ/543kkal"
      ],
      [
        "Fita",
        "34 g"
      ],
      [
        "-Þar af mettuð",
        "14 g"
      ],
      [
        "Kolvetni",
        "50 g"
      ],
      [
        "-Þar af sykurtegundir",
        "48 g"
      ],
      [
        "Trefjar",
        "3,8 g"
      ],
      [
        "Prótein",
        "8,0 g"
      ],
      [
        "Salt",
        "0,22 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "nuts",
      "milk",
      "soy"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/heslihnetur-med-sukkuladi-afrit/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/heslihnetur-med-sukkuladi-2.jpg"
    ]
  },
  {
    "slug": "wasabi-hnetur",
    "brand": "hberg",
    "name": {
      "is": "Wasabi hnetur",
      "en": "Wasabi hnetur"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: JARÐHNETUR (27,5%), HVEITI (22,1%), sykur, maíssterkja, maísmjöl, pálmaolía (vottuð), salt, sojasósa ( HVEITI , SOJABAUNIR , dextrín, vatn, salt, kojirækt, litarefni (E150c)), krydd (dextrín, þykkingarefni (E414), sinnepsbragðefni, pálmaolía, andoxunarefni (E392)), lyftiefni (E500), kartöflusterkja, bragðaukandi efni (E635), sítrónusýra (E330), litarefni (E141), wasabi (0,003%)",
    "nutrition": "Wasabi hnetur Næringargildi í 100 g: Orka 1921 kJ/458 kkal Fita 19,3 g -Þar af mettuð 4,4 g Kolvetni 59,6 g -Þar af sykurtegundir 23,4 g Trefjar 2,8 g Prótein 10 g Salt 1,0 g",
    "nutritionRows": [
      [
        "Orka",
        "1921 kJ/458 kkal"
      ],
      [
        "Fita",
        "19,3 g"
      ],
      [
        "-Þar af mettuð",
        "4,4 g"
      ],
      [
        "Kolvetni",
        "59,6 g"
      ],
      [
        "-Þar af sykurtegundir",
        "23,4 g"
      ],
      [
        "Trefjar",
        "2,8 g"
      ],
      [
        "Prótein",
        "10 g"
      ],
      [
        "Salt",
        "1,0 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "peanut",
      "gluten",
      "soy"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/wasabi-hnetur/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/wasabi-hnetur-2.jpg"
    ]
  },
  {
    "slug": "heslihnetur-med-irish-coffee-sukkuladi",
    "brand": "hberg",
    "name": {
      "is": "Heslihnetur með Irish Coffee súkkulaði",
      "en": "Heslihnetur með Irish Coffee súkkulaði"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Hvítt súkkulaði (77%) (sykur, kakósmjör, MJÓLKURDUFT , MYSUDUFT , ýruefni (E322 úr SOJA ), náttúrulegt bragðefni), HESLIHNETUR (20%), glúkósasíróp, dökkt súkkulaði (1%) (sykur, kakómassi, kakósmjör, ýruefni (E322 úr SOJA ), náttúrulegt bragðefni), húðunarefni (E414, E904), irish coffee bragðefni (0,3%)",
    "nutrition": "Heslihnetur með Irish Coffee súkkulaði Næringargildi í 100 g: Orka 2351 kJ/564 kkal Fita 37 g -Þar af mettuð 15 g Kolvetni 51 g -Þar af sykurtegundir 50 g Trefjar 1,7 g Prótein 6,4 g Salt 0,29 g",
    "nutritionRows": [
      [
        "Orka",
        "2351 kJ/564 kkal"
      ],
      [
        "Fita",
        "37 g"
      ],
      [
        "-Þar af mettuð",
        "15 g"
      ],
      [
        "Kolvetni",
        "51 g"
      ],
      [
        "-Þar af sykurtegundir",
        "50 g"
      ],
      [
        "Trefjar",
        "1,7 g"
      ],
      [
        "Prótein",
        "6,4 g"
      ],
      [
        "Salt",
        "0,29 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "nuts",
      "milk",
      "soy"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/heslihnetur-med-irish-coffee-sukkuladi/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/heslihnetur-irish.jpg"
    ]
  },
  {
    "slug": "piparmondlur",
    "brand": "hberg",
    "name": {
      "is": "Piparmöndlur",
      "en": "Piparmöndlur"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Súkkulaði (65%) (sykur, MJÓLKURDUFT , kakómassi, kakósmjör, MYSUDUFT , ýruefni (E322 úr SOJA ), náttúrulegt bragðefni), MÖNDLUR, salmíakduft (4%) (sýrustillir (E510), lakkr\u00edsrót, pálmolía (vottuð)), kakósmjör.",
    "nutrition": "Piparmöndlur Næringargildi í 100 g: Orka 2240 kJ/538 kkal Fita 35 g -Þar af mettuð 12 g Kolvetni 42 g -Þar af sykurtegundir 40 g Trefjar 5,1 g Prótein 10,8 g Salt 0,20 g",
    "nutritionRows": [
      [
        "Orka",
        "2240 kJ/538 kkal"
      ],
      [
        "Fita",
        "35 g"
      ],
      [
        "-Þar af mettuð",
        "12 g"
      ],
      [
        "Kolvetni",
        "42 g"
      ],
      [
        "-Þar af sykurtegundir",
        "40 g"
      ],
      [
        "Trefjar",
        "5,1 g"
      ],
      [
        "Prótein",
        "10,8 g"
      ],
      [
        "Salt",
        "0,20 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "nuts",
      "milk",
      "soy"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/piparmondlur/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/pipar-mondlur.jpg"
    ]
  },
  {
    "slug": "kasjusmjor-2",
    "brand": "hberg",
    "name": {
      "is": "Kasjúsmjör",
      "en": "Kasjúsmjör"
    },
    "desc": {
      "is": "Hnetusmjör",
      "en": "Hnetusmjör"
    },
    "ingredients": "Innihald: KASJÚHNETUR (99,2%), sjávarsalt (0,8%)",
    "nutrition": "Næringargildi í 100 g: Orka 2416 kJ/582 kkal Fita 44 g -Þar af mettuð 7,8 g Kolvetni 27 g -Þar af sykurtegundir 5,9 g Trefjar 3,3 g Prótein 18 g Salt 0,8 g",
    "nutritionRows": [
      [
        "Orka",
        "2416 kJ/582 kkal"
      ],
      [
        "Fita",
        "44 g"
      ],
      [
        "-Þar af mettuð",
        "7,8 g"
      ],
      [
        "Kolvetni",
        "27 g"
      ],
      [
        "-Þar af sykurtegundir",
        "5,9 g"
      ],
      [
        "Trefjar",
        "3,3 g"
      ],
      [
        "Prótein",
        "18 g"
      ],
      [
        "Salt",
        "0,8 g"
      ]
    ],
    "tags": [
      "smjor"
    ],
    "tint": "#D7B45D",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/kasjusmjor-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/04/kasjusmjor.jpg"
    ]
  },
  {
    "slug": "kasjusmjor",
    "brand": "hberg",
    "name": {
      "is": "Möndlusmjör",
      "en": "Möndlusmjör"
    },
    "desc": {
      "is": "Hnetusmjör",
      "en": "Hnetusmjör"
    },
    "ingredients": "Innihald: MÖNDLUR , sjávarsalt (0,8%)",
    "nutrition": "Næringargildi í 100 g: Orka 2623 kJ/663 kkal Fita 49 g -Þar af mettuð 4,0 g Kolvetni 21 g -Þar af sykurtegundir 4,5 g Trefjar 12 g Prótein 21 g Salt 0,8 g",
    "nutritionRows": [
      [
        "Orka",
        "2623 kJ/663 kkal"
      ],
      [
        "Fita",
        "49 g"
      ],
      [
        "-Þar af mettuð",
        "4,0 g"
      ],
      [
        "Kolvetni",
        "21 g"
      ],
      [
        "-Þar af sykurtegundir",
        "4,5 g"
      ],
      [
        "Trefjar",
        "12 g"
      ],
      [
        "Prótein",
        "21 g"
      ],
      [
        "Salt",
        "0,8 g"
      ]
    ],
    "tags": [
      "smjor"
    ],
    "tint": "#D7B45D",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/kasjusmjor/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/04/mondlusmjor.jpg"
    ]
  },
  {
    "slug": "hnetusmjor",
    "brand": "hberg",
    "name": {
      "is": "Hnetusmjör 340g",
      "en": "Hnetusmjör 340g"
    },
    "desc": {
      "is": "Hnetusmjör",
      "en": "Hnetusmjör"
    },
    "ingredients": "Innihald: JARÐHNETUR (97,5%), salt (1,5%), sólblómaolía.",
    "nutrition": "Næringargildi í 100 g: Orka 2604 kJ/626 kkal Fita 51 g -Þar af mettuð 7,4 g Kolvetni 13 g -Þar af sykurtegundir 4,7 g Trefjar 6,6 g Prótein 25 g Salt 1,5 g",
    "nutritionRows": [
      [
        "Orka",
        "2604 kJ/626 kkal"
      ],
      [
        "Fita",
        "51 g"
      ],
      [
        "-Þar af mettuð",
        "7,4 g"
      ],
      [
        "Kolvetni",
        "13 g"
      ],
      [
        "-Þar af sykurtegundir",
        "4,7 g"
      ],
      [
        "Trefjar",
        "6,6 g"
      ],
      [
        "Prótein",
        "25 g"
      ],
      [
        "Salt",
        "1,5 g"
      ]
    ],
    "tags": [
      "smjor"
    ],
    "tint": "#D7B45D",
    "allergens": [
      "peanut"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/hnetusmjor/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/04/Hnetusmjör340_Hberg.png",
      "https://hberg.is/wp-content/uploads/2020/04/Hnetusmjör340_Hberg.png"
    ],
    "weight": "340g"
  },
  {
    "slug": "granola-med-tronuberjum",
    "brand": "hberg",
    "name": {
      "is": "Granóla með Trönuberjum",
      "en": "Granóla með Trönuberjum"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Granóla (95%) (heilkornaflögur (61,5%) ( HAFRAR, HVEITI ), sykur, sólblómaolía, stökkt korn (hrísmjöl, HVEITI , sykur, maltað BYGG , salt), glúkósasíróp, hunang, lyftiefni (E500), kanill, karamellaður sykur, bragðefni, þrávarnarefni (E306)), trönuber (5%) (trönuber, hásykur, sólblómaolía)",
    "nutrition": "Næringargildi í 100 g: Orka 1805 kJ/429 kkal Fita 13 g -Þar af mettuð 1,3 g Kolvetni 67 g -Þar af sykurtegundir 19 g Trefjar 5,9 g Prótein 8,8 g Salt 0,10 g",
    "nutritionRows": [
      [
        "Orka",
        "1805 kJ/429 kkal"
      ],
      [
        "Fita",
        "13 g"
      ],
      [
        "-Þar af mettuð",
        "1,3 g"
      ],
      [
        "Kolvetni",
        "67 g"
      ],
      [
        "-Þar af sykurtegundir",
        "19 g"
      ],
      [
        "Trefjar",
        "5,9 g"
      ],
      [
        "Prótein",
        "8,8 g"
      ],
      [
        "Salt",
        "0,10 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "gluten"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/granola-med-tronuberjum/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/04/granola-med-tronuberjum-2.jpg"
    ]
  },
  {
    "slug": "kajuhnetur-bortnar",
    "brand": "hberg",
    "name": {
      "is": "Kasjúhnetur brotnar",
      "en": "Kasjúhnetur brotnar"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: KASJÚHNETUR",
    "nutrition": "Kasjúhnetur brotnar Næringargildi í 100 g: Orka 2416 kJ/582 kkal Fita 44  g -Þar af mettuð 7,8 g Kolvetni 27 g -Þar af sykurtegundir 5,9 g Trefjar 3,3 g Prótein 18 g Salt 0,03 g",
    "nutritionRows": [
      [
        "Orka",
        "2416 kJ/582 kkal"
      ],
      [
        "Fita",
        "44  g"
      ],
      [
        "-Þar af mettuð",
        "7,8 g"
      ],
      [
        "Kolvetni",
        "27 g"
      ],
      [
        "-Þar af sykurtegundir",
        "5,9 g"
      ],
      [
        "Trefjar",
        "3,3 g"
      ],
      [
        "Prótein",
        "18 g"
      ],
      [
        "Salt",
        "0,03 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/kajuhnetur-bortnar/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/kashuhnetur-brotnar-oristad-2.jpg"
    ]
  },
  {
    "slug": "mondlur-med-dokku-sukkuladi",
    "brand": "hberg",
    "name": {
      "is": "Möndlur með dökku súkkulaði",
      "en": "Möndlur með dökku súkkulaði"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Dökkt súkkulaði (68%) (sykur, kakómassi, kakósmjör, ýruefni (E322 úr SOJA ), náttúrulegt bragðefni), MÖNDLUR (29%), glúkósasíróp, pálmaolía, húðunarefni (E414, E904)",
    "nutrition": "Möndlur með dökku súkkulaði Næringargildi í 100 g: Orka 2268 kJ/546 kkal Fita 38 g -Þar af mettuð 15 g Kolvetni 37 g -Þar af sykurtegundir 34 g Trefjar 8,1 g Prótein 9,0 g Salt 0,01 g",
    "nutritionRows": [
      [
        "Orka",
        "2268 kJ/546 kkal"
      ],
      [
        "Fita",
        "38 g"
      ],
      [
        "-Þar af mettuð",
        "15 g"
      ],
      [
        "Kolvetni",
        "37 g"
      ],
      [
        "-Þar af sykurtegundir",
        "34 g"
      ],
      [
        "Trefjar",
        "8,1 g"
      ],
      [
        "Prótein",
        "9,0 g"
      ],
      [
        "Salt",
        "0,01 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "nuts",
      "soy"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/mondlur-med-dokku-sukkuladi/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/mondlur-med-dokku-sukkuladi-2.jpg"
    ]
  },
  {
    "slug": "kasjuhentur-med-sukkuladi",
    "brand": "hberg",
    "name": {
      "is": "Kasjúhentur með súkkulaði",
      "en": "Kasjúhentur með súkkulaði"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Súkkulaði (63%) (sykur, MJÓLKURDUFT , kakómassi, kakósmjör, MYSUDUFT , ýruefni (E322 úr SOJA ), náttúrulegt bragðefni), KASJÚHNETUR (34%), glúkósasíróp, pálmaolía, húðunarefni (E414, E904)",
    "nutrition": "Kasjúhnetur með súkkulaði Næringargildi í 100 g: Orka 2268 kJ/544kkal Fita 34 g -Þar af mettuð 13 g Kolvetni 48 g -Þar af sykurtegundir 39 g Trefjar 3,0 g Prótein 10 g Salt 0,18 g",
    "nutritionRows": [
      [
        "Orka",
        "2268 kJ/544kkal"
      ],
      [
        "Fita",
        "34 g"
      ],
      [
        "-Þar af mettuð",
        "13 g"
      ],
      [
        "Kolvetni",
        "48 g"
      ],
      [
        "-Þar af sykurtegundir",
        "39 g"
      ],
      [
        "Trefjar",
        "3,0 g"
      ],
      [
        "Prótein",
        "10 g"
      ],
      [
        "Salt",
        "0,18 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "nuts",
      "milk",
      "soy"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/kasjuhentur-med-sukkuladi/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/kasjuhnetur-med-sukkuladi-2.jpg",
      "https://hberg.is/wp-content/uploads/2020/03/kasjuhnetur-med-sukkuladi.jpg"
    ]
  },
  {
    "slug": "valhnetukjarnar",
    "brand": "hberg",
    "name": {
      "is": "Valhnetukjarnar",
      "en": "Valhnetukjarnar"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: VALHNETUR",
    "nutrition": "Valhnetukjarnar Næringargildi í 100 g: Orka 2584 kJ/618kkal Fita 59 g -Þar af mettuð 3,4 g Kolvetni 9,9 g -Þar af sykurtegundir 1,1 g Trefjar 6,8 g Prótein 24 g Salt 0 g",
    "nutritionRows": [
      [
        "Orka",
        "2584 kJ/618kkal"
      ],
      [
        "Fita",
        "59 g"
      ],
      [
        "-Þar af mettuð",
        "3,4 g"
      ],
      [
        "Kolvetni",
        "9,9 g"
      ],
      [
        "-Þar af sykurtegundir",
        "1,1 g"
      ],
      [
        "Trefjar",
        "6,8 g"
      ],
      [
        "Prótein",
        "24 g"
      ],
      [
        "Salt",
        "0 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/valhnetukjarnar/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/valhnetukjarnar-2.jpg"
    ]
  },
  {
    "slug": "tronuber-2",
    "brand": "hberg",
    "name": {
      "is": "Trönuber",
      "en": "Trönuber"
    },
    "desc": {
      "is": "Þurrkaðir ávextir",
      "en": "Þurrkaðir ávextir"
    },
    "ingredients": "Innihald: Trönuber (60%), hrásykur (39%), sólblómaolía (<1%)",
    "nutrition": "Trönuber Næringargildi í 100 g: Orka 1305 kJ/308 kkal Fita 1,5 g -Þar af mettuð 0,2 g Kolvetni 71 g -Þar af sykurtegundir 65 g Trefjar 5,1 g Prótein 0,11 g Salt 0,01 g",
    "nutritionRows": [
      [
        "Orka",
        "1305 kJ/308 kkal"
      ],
      [
        "Fita",
        "1,5 g"
      ],
      [
        "-Þar af mettuð",
        "0,2 g"
      ],
      [
        "Kolvetni",
        "71 g"
      ],
      [
        "-Þar af sykurtegundir",
        "65 g"
      ],
      [
        "Trefjar",
        "5,1 g"
      ],
      [
        "Prótein",
        "0,11 g"
      ],
      [
        "Salt",
        "0,01 g"
      ]
    ],
    "tags": [
      "avextir"
    ],
    "tint": "#DE935E",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/tronuber-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/tronuber.jpg"
    ]
  },
  {
    "slug": "sveskjur",
    "brand": "hberg",
    "name": {
      "is": "Sveskjur",
      "en": "Sveskjur"
    },
    "desc": {
      "is": "Þurrkaðir ávextir",
      "en": "Þurrkaðir ávextir"
    },
    "ingredients": "Innihald: Sveskjur, rotvarnarefni (E202) (<1%), jurtaolía (<1%)",
    "nutrition": "Sveskjur Næringargildi í 100 g: Orka 1076 kJ/254 kkal Fita 0,2 g -Þar af mettuð 0,1 g Kolvetni 56,8 g -Þar af sykurtegundir 38,1 g Trefjar 7,1 g Prótein 2,7 g Salt 0 g",
    "nutritionRows": [
      [
        "Orka",
        "1076 kJ/254 kkal"
      ],
      [
        "Fita",
        "0,2 g"
      ],
      [
        "-Þar af mettuð",
        "0,1 g"
      ],
      [
        "Kolvetni",
        "56,8 g"
      ],
      [
        "-Þar af sykurtegundir",
        "38,1 g"
      ],
      [
        "Trefjar",
        "7,1 g"
      ],
      [
        "Prótein",
        "2,7 g"
      ],
      [
        "Salt",
        "0 g"
      ]
    ],
    "tags": [
      "avextir"
    ],
    "tint": "#DE935E",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/sveskjur/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/sveskjur-400grIMG_0754-2-of-2.jpg",
      "https://hberg.is/wp-content/uploads/2020/03/sveskjur-400grIMG_0752-1-of-2.jpg"
    ]
  },
  {
    "slug": "salthnetur",
    "brand": "hberg",
    "name": {
      "is": "Salthnetur",
      "en": "Salthnetur"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: JARÐHNETUR , sólblómaolía, salt",
    "nutrition": "Salthnetur Næringargildi í 100 g: Orka 2593 kJ/626 kkal Fita 50,6 g -Þar af mettuð 7,5 g Kolvetni 14,2 g -Þar af sykurtegundir 5,3 g Trefjar 6,8 g Prótein 20,9 g Salt 1,50 g",
    "nutritionRows": [
      [
        "Orka",
        "2593 kJ/626 kkal"
      ],
      [
        "Fita",
        "50,6 g"
      ],
      [
        "-Þar af mettuð",
        "7,5 g"
      ],
      [
        "Kolvetni",
        "14,2 g"
      ],
      [
        "-Þar af sykurtegundir",
        "5,3 g"
      ],
      [
        "Trefjar",
        "6,8 g"
      ],
      [
        "Prótein",
        "20,9 g"
      ],
      [
        "Salt",
        "1,50 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [
      "peanut"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/salthnetur/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/salthnetur.jpg"
    ]
  },
  {
    "slug": "pistasiur",
    "brand": "hberg",
    "name": {
      "is": "Pistasíur",
      "en": "Pistasíur"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: PISTASÍURKJARNAR",
    "nutrition": "Pistasíur Næringargildi í 100 g: Orka 2387 kJ/576 kkal Fita 45 g -Þar af mettuð 5,9 g Kolvetni 17 g -Þar af sykurtegundir 7,7 g Trefjar 11 g Prótein 20 g Salt 0,03 g",
    "nutritionRows": [
      [
        "Orka",
        "2387 kJ/576 kkal"
      ],
      [
        "Fita",
        "45 g"
      ],
      [
        "-Þar af mettuð",
        "5,9 g"
      ],
      [
        "Kolvetni",
        "17 g"
      ],
      [
        "-Þar af sykurtegundir",
        "7,7 g"
      ],
      [
        "Trefjar",
        "11 g"
      ],
      [
        "Prótein",
        "20 g"
      ],
      [
        "Salt",
        "0,03 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/pistasiur/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/pistasiur-2.jpg"
    ]
  },
  {
    "slug": "pekan-hnetur",
    "brand": "hberg",
    "name": {
      "is": "Pekan hnetur",
      "en": "Pekan hnetur"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: PEKANHNETUR",
    "nutrition": "Pekanhnetur Næringargildi í 100 g: Orka 2933 kJ/698 kkal Fita 69,8 g -Þar af mettuð 6,3 g Kolvetni 6,2 g -Þar af sykurtegundir 4,5 g Trefjar 9,4 g Prótein 10 g Salt 0,003 g",
    "nutritionRows": [
      [
        "Orka",
        "2933 kJ/698 kkal"
      ],
      [
        "Fita",
        "69,8 g"
      ],
      [
        "-Þar af mettuð",
        "6,3 g"
      ],
      [
        "Kolvetni",
        "6,2 g"
      ],
      [
        "-Þar af sykurtegundir",
        "4,5 g"
      ],
      [
        "Trefjar",
        "9,4 g"
      ],
      [
        "Prótein",
        "10 g"
      ],
      [
        "Salt",
        "0,003 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/pekan-hnetur/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/pekanhnetur-2.jpg"
    ]
  },
  {
    "slug": "orkupokinn",
    "brand": "hberg",
    "name": {
      "is": "Orkupokinn",
      "en": "Orkupokinn"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Ristaðar hnetur ( JARÐHNETUR ( JARÐHNETUOLÍA , salt), KASJÚHNETUR , MÖNDLUR ), rúsínur (sólblómaolía, rotvarnarefni ( BRENNISTEINSDÍOXÍÐ )), trönuber (hrásykur, sólblómaolía)",
    "nutrition": "Orkupokinn Næringargildi í 100 g: Orka 2145 kJ/515 kkal Fita 33 g -Þar af mettuð 4,5 g Kolvetni 36 g -Þar af sykurtegundir 22 g Trefjar 6,3 g Prótein 16 g Salt 0,64 g",
    "nutritionRows": [
      [
        "Orka",
        "2145 kJ/515 kkal"
      ],
      [
        "Fita",
        "33 g"
      ],
      [
        "-Þar af mettuð",
        "4,5 g"
      ],
      [
        "Kolvetni",
        "36 g"
      ],
      [
        "-Þar af sykurtegundir",
        "22 g"
      ],
      [
        "Trefjar",
        "6,3 g"
      ],
      [
        "Prótein",
        "16 g"
      ],
      [
        "Salt",
        "0,64 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "nuts",
      "peanut",
      "sulphites"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/orkupokinn/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/orku-pokinn-2.jpg"
    ]
  },
  {
    "slug": "party-pokinn",
    "brand": "hberg",
    "name": {
      "is": "Partý pokinn",
      "en": "Partý pokinn"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Kryddhjúpaðar jarðhnetur ( JARÐHNETUR , HVEITI , kartöflusterkja, kryddblanda (krydd, brauðraspur ( HVEITI , salt, lyftiefni (E503), paprika, kekkjavarnarefni (E551), rotvarnarefni (E306), turmerik), sólblómaolía, salt, sykur, hvítlaukur, lyftiefni (E500), náttúruleg bragðefni ( HVEITI )), JARÐHNETUR (sólblómaolía, salt (1%)), ristaðar MÖNDLUR , ristuð graskersfræ (pálmolía).",
    "nutrition": "Partý pokinn Næringargildi í 100 g: Orka 2122 kJ/507 kkal Fita 30 g -Þar af mettuð 8,5 g Kolvetni 38 g -Þar af sykurtegundir 2,8 g Trefjar 9,6 g Prótein 17 g Salt 1,8 g",
    "nutritionRows": [
      [
        "Orka",
        "2122 kJ/507 kkal"
      ],
      [
        "Fita",
        "30 g"
      ],
      [
        "-Þar af mettuð",
        "8,5 g"
      ],
      [
        "Kolvetni",
        "38 g"
      ],
      [
        "-Þar af sykurtegundir",
        "2,8 g"
      ],
      [
        "Trefjar",
        "9,6 g"
      ],
      [
        "Prótein",
        "17 g"
      ],
      [
        "Salt",
        "1,8 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "nuts",
      "peanut",
      "gluten"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/party-pokinn/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/party-pokinn-2-1.jpg"
    ]
  },
  {
    "slug": "mondlur",
    "brand": "hberg",
    "name": {
      "is": "Möndlur",
      "en": "Möndlur"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: MÖNDLUR",
    "nutrition": "Möndlur heilar með hýði Næringargildi í 100 g: Orka 2623 kJ/633 kkal Fita 49 g -Þar af mettuð 4,0 g Kolvetni 21 g -Þar af sykurtegundir 4,5 g Trefjar 12 g Prótein 21 g Salt 0 g",
    "nutritionRows": [
      [
        "Orka",
        "2623 kJ/633 kkal"
      ],
      [
        "Fita",
        "49 g"
      ],
      [
        "-Þar af mettuð",
        "4,0 g"
      ],
      [
        "Kolvetni",
        "21 g"
      ],
      [
        "-Þar af sykurtegundir",
        "4,5 g"
      ],
      [
        "Trefjar",
        "12 g"
      ],
      [
        "Prótein",
        "21 g"
      ],
      [
        "Salt",
        "0 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/mondlur/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/mondlur.jpg"
    ]
  },
  {
    "slug": "mondlur-sneiddar",
    "brand": "hberg",
    "name": {
      "is": "Möndlur sneiddar",
      "en": "Möndlur sneiddar"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: MÖNDLUR",
    "nutrition": "Möndlur sneiddar Næringargildi í 100 g: Orka 2703kJ/653 kkal Fita 52 g -Þar af mettuð 3,95 g Kolvetni 18,7 g -Þar af sykurtegundir 4,6 g Trefjar 9,9 g Prótein 21,4 g Salt 0,05 g",
    "nutritionRows": [
      [
        "Orka",
        "2703kJ/653 kkal"
      ],
      [
        "Fita",
        "52 g"
      ],
      [
        "-Þar af mettuð",
        "3,95 g"
      ],
      [
        "Kolvetni",
        "18,7 g"
      ],
      [
        "-Þar af sykurtegundir",
        "4,6 g"
      ],
      [
        "Trefjar",
        "9,9 g"
      ],
      [
        "Prótein",
        "21,4 g"
      ],
      [
        "Salt",
        "0,05 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/mondlur-sneiddar/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/möndlur-sneiddar.jpg"
    ]
  },
  {
    "slug": "mondlur-afhyddar",
    "brand": "hberg",
    "name": {
      "is": "Möndlur afhýddar",
      "en": "Möndlur afhýddar"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: MÖNDLUR",
    "nutrition": "Möndlur afhýddar Næringargildi í 100 g: Orka 2703kJ/653 kkal Fita 52 g -Þar af mettuð 3,95 g Kolvetni 18,7 g -Þar af sykurtegundir 4,6 g Trefjar 9,9 g Prótein 21,4 g Salt 0,05 g",
    "nutritionRows": [
      [
        "Orka",
        "2703kJ/653 kkal"
      ],
      [
        "Fita",
        "52 g"
      ],
      [
        "-Þar af mettuð",
        "3,95 g"
      ],
      [
        "Kolvetni",
        "18,7 g"
      ],
      [
        "-Þar af sykurtegundir",
        "4,6 g"
      ],
      [
        "Trefjar",
        "9,9 g"
      ],
      [
        "Prótein",
        "21,4 g"
      ],
      [
        "Salt",
        "0,05 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/mondlur-afhyddar/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/mondlur-afhyddar-2.jpg"
    ]
  },
  {
    "slug": "mondlur-hakkadar",
    "brand": "hberg",
    "name": {
      "is": "Möndlur hakkaðar",
      "en": "Möndlur hakkaðar"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: MÖNDLUR",
    "nutrition": "Möndlur hakkaðar Næringargildi í 100 g: Orka 2703kJ/653 kkal Fita 52 g -Þar af mettuð 3,95 g Kolvetni 18,7 g -Þar af sykurtegundir 4,6 g Trefjar 9,9 g Prótein 21,4 g Salt 0,05 g",
    "nutritionRows": [
      [
        "Orka",
        "2703kJ/653 kkal"
      ],
      [
        "Fita",
        "52 g"
      ],
      [
        "-Þar af mettuð",
        "3,95 g"
      ],
      [
        "Kolvetni",
        "18,7 g"
      ],
      [
        "-Þar af sykurtegundir",
        "4,6 g"
      ],
      [
        "Trefjar",
        "9,9 g"
      ],
      [
        "Prótein",
        "21,4 g"
      ],
      [
        "Salt",
        "0,05 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/mondlur-hakkadar/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/mondlur-hakkadar-2.jpg"
    ]
  },
  {
    "slug": "kokosolia-lifraen-og-lyktarlaus",
    "brand": "hberg",
    "name": {
      "is": "Kókosolía, lífræn og lyktarlaus",
      "en": "Kókosolía, lífræn og lyktarlaus"
    },
    "desc": {
      "is": "Bökunarvörur",
      "en": "Bökunarvörur"
    },
    "ingredients": "Innihald: Lífræn kókoshnetuolía",
    "nutrition": "Kókosolía, lífræn og lyktarlaus 500mL Næringargildi í 100 g: Orka 3700 kJ/900 kkal Fita 100  g -Þar af mettuð 91 g Kolvetni 0 g -Þar af sykurtegundir 0 g Trefjar 0 g Prótein 0 g Salt 0,01 g",
    "nutritionRows": [
      [
        "Orka",
        "3700 kJ/900 kkal"
      ],
      [
        "Fita",
        "100  g"
      ],
      [
        "-Þar af mettuð",
        "91 g"
      ],
      [
        "Kolvetni",
        "0 g"
      ],
      [
        "-Þar af sykurtegundir",
        "0 g"
      ],
      [
        "Trefjar",
        "0 g"
      ],
      [
        "Prótein",
        "0 g"
      ],
      [
        "Salt",
        "0,01 g"
      ]
    ],
    "tags": [
      "bakstur"
    ],
    "tint": "#D6C7A4",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/kokosolia-lifraen-og-lyktarlaus/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/kokosolia-lifraen-lyktarlaus.jpg"
    ]
  },
  {
    "slug": "kokosmjol",
    "brand": "hberg",
    "name": {
      "is": "Kókosmjöl",
      "en": "Kókosmjöl"
    },
    "desc": {
      "is": "Bökunarvörur",
      "en": "Bökunarvörur"
    },
    "ingredients": "Innihald: Kókosmjöl",
    "nutrition": "Kókosmjöl Næringargildi í 100 g: Orka 2451 kJ/595 kkal Fita 56  g -Þar af mettuð 53,3 g Kolvetni 8 g -Þar af sykurtegundir 6,3 g Trefjar 17 g Prótein 6,3 g Salt 0,07 g",
    "nutritionRows": [
      [
        "Orka",
        "2451 kJ/595 kkal"
      ],
      [
        "Fita",
        "56  g"
      ],
      [
        "-Þar af mettuð",
        "53,3 g"
      ],
      [
        "Kolvetni",
        "8 g"
      ],
      [
        "-Þar af sykurtegundir",
        "6,3 g"
      ],
      [
        "Trefjar",
        "17 g"
      ],
      [
        "Prótein",
        "6,3 g"
      ],
      [
        "Salt",
        "0,07 g"
      ]
    ],
    "tags": [
      "bakstur"
    ],
    "tint": "#D6C7A4",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/kokosmjol/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/kokosmjol-2-of-2.jpg"
    ]
  },
  {
    "slug": "kokosflogur-2",
    "brand": "hberg",
    "name": {
      "is": "Kókosflögur",
      "en": "Kókosflögur"
    },
    "desc": {
      "is": "Bökunarvörur",
      "en": "Bökunarvörur"
    },
    "ingredients": "Innihald: Kókosflögur",
    "nutrition": "Kókosflögur Næringargildi í 100 g: Orka 3055 kJ/740 kkal Fita 66  g -Þar af mettuð 56 g Kolvetni 7 g -Þar af sykurtegundir 7 g Trefjar 15 g Prótein 7 g Salt 0,02 g",
    "nutritionRows": [
      [
        "Orka",
        "3055 kJ/740 kkal"
      ],
      [
        "Fita",
        "66  g"
      ],
      [
        "-Þar af mettuð",
        "56 g"
      ],
      [
        "Kolvetni",
        "7 g"
      ],
      [
        "-Þar af sykurtegundir",
        "7 g"
      ],
      [
        "Trefjar",
        "15 g"
      ],
      [
        "Prótein",
        "7 g"
      ],
      [
        "Salt",
        "0,02 g"
      ]
    ],
    "tags": [
      "bakstur"
    ],
    "tint": "#D6C7A4",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/kokosflogur-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/kokosflogur-2.jpg"
    ]
  },
  {
    "slug": "kinoafrae",
    "brand": "hberg",
    "name": {
      "is": "Kínóafræ",
      "en": "Kínóafræ"
    },
    "desc": {
      "is": "Fræ",
      "en": "Fræ"
    },
    "ingredients": "Innihald: Kínóafræ",
    "nutrition": "Kínóafræ Næringargildi í 100 g: Orka 1698 kJ/402 kkal Fita 6  g -Þar af mettuð 0 g Kolvetni 70 g -Þar af sykurtegundir 0 g Trefjar 6 g Prótein 14 g Salt 0 g",
    "nutritionRows": [
      [
        "Orka",
        "1698 kJ/402 kkal"
      ],
      [
        "Fita",
        "6  g"
      ],
      [
        "-Þar af mettuð",
        "0 g"
      ],
      [
        "Kolvetni",
        "70 g"
      ],
      [
        "-Þar af sykurtegundir",
        "0 g"
      ],
      [
        "Trefjar",
        "6 g"
      ],
      [
        "Prótein",
        "14 g"
      ],
      [
        "Salt",
        "0 g"
      ]
    ],
    "tags": [
      "frae"
    ],
    "tint": "#A8B77D",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/kinoafrae/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/kinofrae-2.jpg"
    ]
  },
  {
    "slug": "kajuhnetur-heilarristadar",
    "brand": "hberg",
    "name": {
      "is": "Kasjúhnetur heilar & ristaðar",
      "en": "Kasjúhnetur heilar & ristaðar"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: KASJÚHNETUR",
    "nutrition": "Kasjúhnetur heilar og ristaðar Næringargildi í 100 g: Orka 2416 kJ/582 kkal Fita 44  g -Þar af mettuð 7,8 g Kolvetni 27 g -Þar af sykurtegundir 5,9 g Trefjar 3,3 g Prótein 18 g Salt 0,03 g",
    "nutritionRows": [
      [
        "Orka",
        "2416 kJ/582 kkal"
      ],
      [
        "Fita",
        "44  g"
      ],
      [
        "-Þar af mettuð",
        "7,8 g"
      ],
      [
        "Kolvetni",
        "27 g"
      ],
      [
        "-Þar af sykurtegundir",
        "5,9 g"
      ],
      [
        "Trefjar",
        "3,3 g"
      ],
      [
        "Prótein",
        "18 g"
      ],
      [
        "Salt",
        "0,03 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/kajuhnetur-heilarristadar/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/kasjuhnetur-250gr-2-of-2.jpg",
      "https://hberg.is/wp-content/uploads/2020/03/kasjuhnetur-250gr-1-of-2.jpg"
    ]
  },
  {
    "slug": "hampfrae-3",
    "brand": "hberg",
    "name": {
      "is": "Hampfræ",
      "en": "Hampfræ"
    },
    "desc": {
      "is": "Fræ",
      "en": "Fræ"
    },
    "ingredients": "Innihald: Hampfræ",
    "nutrition": "Hampfræ Næringargildi í 100 g: Orka 2455kJ/592 kkal Fita 48  g -Þar af mettuð 5,2 g Kolvetni 3,1 g -Þar af sykurtegundir 2,6 g Trefjar 6,0 g Prótein 34 g Salt 0,03 g",
    "nutritionRows": [
      [
        "Orka",
        "2455kJ/592 kkal"
      ],
      [
        "Fita",
        "48  g"
      ],
      [
        "-Þar af mettuð",
        "5,2 g"
      ],
      [
        "Kolvetni",
        "3,1 g"
      ],
      [
        "-Þar af sykurtegundir",
        "2,6 g"
      ],
      [
        "Trefjar",
        "6,0 g"
      ],
      [
        "Prótein",
        "34 g"
      ],
      [
        "Salt",
        "0,03 g"
      ]
    ],
    "tags": [
      "frae"
    ],
    "tint": "#A8B77D",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/hampfrae-3/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/hampfrae-2.jpg"
    ]
  },
  {
    "slug": "heslihnetur-hakkadar-2",
    "brand": "hberg",
    "name": {
      "is": "Heslihnetur hakkaðar",
      "en": "Heslihnetur hakkaðar"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: HESLIHNETUR",
    "nutrition": "Heslihnetur hakkaðar og ristaðar Næringargildi í 100 g: Orka 2939 kJ/711 kkal Fita 62,4 g -Þar af mettuð 4,5 g Kolvetni 17,6 g -Þar af sykurtegundir 4,9 g Trefjar 9,4 g Prótein 15 g Salt 0 g",
    "nutritionRows": [
      [
        "Orka",
        "2939 kJ/711 kkal"
      ],
      [
        "Fita",
        "62,4 g"
      ],
      [
        "-Þar af mettuð",
        "4,5 g"
      ],
      [
        "Kolvetni",
        "17,6 g"
      ],
      [
        "-Þar af sykurtegundir",
        "4,9 g"
      ],
      [
        "Trefjar",
        "9,4 g"
      ],
      [
        "Prótein",
        "15 g"
      ],
      [
        "Salt",
        "0 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/heslihnetur-hakkadar-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/heslihnetur-2.jpg",
      "https://hberg.is/wp-content/uploads/2020/03/heslihnetur-1.jpg"
    ]
  },
  {
    "slug": "heslihnetur-heilar",
    "brand": "hberg",
    "name": {
      "is": "Heslihnetur heilar",
      "en": "Heslihnetur heilar"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: HESLIHNETUR",
    "nutrition": "Næringargildi í 100 g: Orka 2700 kJ/654 kkal Fita 61 g -Þar af mettuð 4,5 g Kolvetni 7,0 g -Þar af sykurtegundir 4,3 g Trefjar 9,7 g Prótein 15 g Salt 0 g",
    "nutritionRows": [
      [
        "Orka",
        "2700 kJ/654 kkal"
      ],
      [
        "Fita",
        "61 g"
      ],
      [
        "-Þar af mettuð",
        "4,5 g"
      ],
      [
        "Kolvetni",
        "7,0 g"
      ],
      [
        "-Þar af sykurtegundir",
        "4,3 g"
      ],
      [
        "Trefjar",
        "9,7 g"
      ],
      [
        "Prótein",
        "15 g"
      ],
      [
        "Salt",
        "0 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/heslihnetur-heilar/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/Heslihnetur-100gr-1-of-1.jpg",
      "https://hberg.is/wp-content/uploads/2020/03/Heslihnetur-100gr-2.jpg"
    ]
  },
  {
    "slug": "avaxta-og-hnetublanda-2",
    "brand": "hberg",
    "name": {
      "is": "Ávaxta & hnetublanda",
      "en": "Ávaxta & hnetublanda"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Súkkulaði (sykur, MJÓLKURDUFT , kakómassi, kakósmjör, MYSUDUFT , ýruefni (E322 úr SOJA ), bragðefni), rúsínur, ananas, bananar, JARÐHNETUR , KASJÚHNETUR, MÖNDLUR , glúkósasýróp, kókosolía, JÓGÚRTDUFT , jógúrtbragðefni, húðunarefni (E414, E904), pálmaolía, sólblómaolía, rotvarnarefni ( BRENNISTEINSDÍOXÍÐ )",
    "nutrition": "Ávaxta & hnetublanda Næringargildi í 100 g: Orka 2035 kJ/486 kkal Fita 24 g -Þar af mettuð 12 g Kolvetni 60 g -Þar af sykurtegundir 55 g Prótein 6,4 g Salt 0,29 g",
    "nutritionRows": [
      [
        "Orka",
        "2035 kJ/486 kkal"
      ],
      [
        "Fita",
        "24 g"
      ],
      [
        "-Þar af mettuð",
        "12 g"
      ],
      [
        "Kolvetni",
        "60 g"
      ],
      [
        "-Þar af sykurtegundir",
        "55 g"
      ],
      [
        "Prótein",
        "6,4 g"
      ],
      [
        "Salt",
        "0,29 g"
      ],
      [
        "",
        ""
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "nuts",
      "peanut",
      "milk",
      "soy",
      "sulphites"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/avaxta-og-hnetublanda-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/avaxta-og-hnetublanda-2.jpg",
      "https://hberg.is/wp-content/uploads/2020/03/avaxta-og-hnetublanda.jpg"
    ]
  },
  {
    "slug": "hampfrae-2",
    "brand": "hberg",
    "name": {
      "is": "Stórar rúsínur",
      "en": "Stórar rúsínur"
    },
    "desc": {
      "is": "Þurrkaðir ávextir",
      "en": "Þurrkaðir ávextir"
    },
    "ingredients": "Innihald: Rúsínur, sólblómaolía (<0,75%)",
    "nutrition": "Stórar Rúsínur Næringargildi í 100 g: Orka 1377 kJ/324 kkal Fita 0 g -Þar af mettuð 0 g Kolvetni 78 g -Þar af sykurtegundir 61,2 g Trefjar 1 g Prótein 2,5 g Salt 0,06 g",
    "nutritionRows": [
      [
        "Orka",
        "1377 kJ/324 kkal"
      ],
      [
        "Fita",
        "0 g"
      ],
      [
        "-Þar af mettuð",
        "0 g"
      ],
      [
        "Kolvetni",
        "78 g"
      ],
      [
        "-Þar af sykurtegundir",
        "61,2 g"
      ],
      [
        "Trefjar",
        "1 g"
      ],
      [
        "Prótein",
        "2,5 g"
      ],
      [
        "Salt",
        "0,06 g"
      ]
    ],
    "tags": [
      "avextir"
    ],
    "tint": "#DE935E",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/hampfrae-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/Rúsínur-stórar.jpg"
    ]
  },
  {
    "slug": "granola-an-vidbaetts-sykurs-med-frostthurrkudum-jardarberjum",
    "brand": "hberg",
    "name": {
      "is": "Granóla án viðbætts sykurs , með frostþurrkuðum jarðarberjum",
      "en": "Granóla án viðbætts sykurs , með frostþurrkuðum jarðarberjum"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: HAFRAFLÖGUR (51%), trefjar úr síkóríurót (22,3%), HVEITI , repjuolía, stökkt maís- HVEITI (kurlaður maís, HVEITI , kurlað hveiti, maísmjöl) pressað maís- HVEITI (maís, HVEITI , salt) kókosmjöl (2%), frostþurrkuð jarðaber (1,5%), náttúruleg bragðefni, þráavarnarefni (E304, E306)",
    "nutrition": "Granóla án viðbætts sykurs , með frostþurrkuðum jarðarberjum Næringargildi í 100 g: Orka 1770kJ/422 kkal Fita 11 g -Þar af mettuð 1,9 g Kolvetni 67 g -Þar af sykurtegundir 6,6 g Trefjar 4,8 g Prótein 11 g Salt 0,02 g",
    "nutritionRows": [
      [
        "Orka",
        "1770kJ/422 kkal"
      ],
      [
        "Fita",
        "11 g"
      ],
      [
        "-Þar af mettuð",
        "1,9 g"
      ],
      [
        "Kolvetni",
        "67 g"
      ],
      [
        "-Þar af sykurtegundir",
        "6,6 g"
      ],
      [
        "Trefjar",
        "4,8 g"
      ],
      [
        "Prótein",
        "11 g"
      ],
      [
        "Salt",
        "0,02 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "gluten"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/granola-an-vidbaetts-sykurs-med-frostthurrkudum-jardarberjum/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/sykurlaust-granola-jardaber-2.jpg",
      "https://hberg.is/wp-content/uploads/2020/03/sykurlaust-granola-jardaber-1.jpg"
    ]
  },
  {
    "slug": "goji-ber-2",
    "brand": "hberg",
    "name": {
      "is": "Goji ber",
      "en": "Goji ber"
    },
    "desc": {
      "is": "Þurrkaðir ávextir",
      "en": "Þurrkaðir ávextir"
    },
    "ingredients": "Innihald: Goji ber",
    "nutrition": "Næringargildi í 100 g: Orka 1258kJ/298 kkal Fita 1,5 g -Þar af mettuð 0,3 g Kolvetni 55 g -Þar af sykurtegundir 50 g Trefjar 10 g Prótein 11 g Salt 0,78 g",
    "nutritionRows": [
      [
        "Orka",
        "1258kJ/298 kkal"
      ],
      [
        "Fita",
        "1,5 g"
      ],
      [
        "-Þar af mettuð",
        "0,3 g"
      ],
      [
        "Kolvetni",
        "55 g"
      ],
      [
        "-Þar af sykurtegundir",
        "50 g"
      ],
      [
        "Trefjar",
        "10 g"
      ],
      [
        "Prótein",
        "11 g"
      ],
      [
        "Salt",
        "0,78 g"
      ]
    ],
    "tags": [
      "avextir"
    ],
    "tint": "#DE935E",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/goji-ber-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/goji-ber-2.jpg"
    ]
  },
  {
    "slug": "furuhnetur-2",
    "brand": "hberg",
    "name": {
      "is": "Furuhnetur",
      "en": "Furuhnetur"
    },
    "desc": {
      "is": "Hnetur",
      "en": "Hnetur"
    },
    "ingredients": "Innihald: Furuhnetur",
    "nutrition": "Furuhnetur Næringargildi í 100 g: Orka 3016 kJ/730 kkal Fita 68,4 g -Þar af mettuð 4,9 g Kolvetni 13,1 g -Þar af sykurtegundir 3,6 g Trefjar 3,7 g Prótein 13,7 g Salt 0,01 g",
    "nutritionRows": [
      [
        "Orka",
        "3016 kJ/730 kkal"
      ],
      [
        "Fita",
        "68,4 g"
      ],
      [
        "-Þar af mettuð",
        "4,9 g"
      ],
      [
        "Kolvetni",
        "13,1 g"
      ],
      [
        "-Þar af sykurtegundir",
        "3,6 g"
      ],
      [
        "Trefjar",
        "3,7 g"
      ],
      [
        "Prótein",
        "13,7 g"
      ],
      [
        "Salt",
        "0,01 g"
      ]
    ],
    "tags": [
      "hnetur"
    ],
    "tint": "#B98B60",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/furuhnetur-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/furuhnetur-2.jpg"
    ]
  },
  {
    "slug": "fikjur-2",
    "brand": "hberg",
    "name": {
      "is": "Fíkjur",
      "en": "Fíkjur"
    },
    "desc": {
      "is": "Þurrkaðir ávextir",
      "en": "Þurrkaðir ávextir"
    },
    "ingredients": "Innihald: Fíkjur, hrísmjöl (<3%)",
    "nutrition": "Fíkjur Næringargildi í 100 g: Orka 1088 kJ/257 kkal Fita 0,93 g -Þar af mettuð 0,14 g Kolvetni 54,1 g -Þar af sykurtegundir 47,9 g Trefjar 9,8 g Prótein 3,3 g Salt 0,03 g",
    "nutritionRows": [
      [
        "Orka",
        "1088 kJ/257 kkal"
      ],
      [
        "Fita",
        "0,93 g"
      ],
      [
        "-Þar af mettuð",
        "0,14 g"
      ],
      [
        "Kolvetni",
        "54,1 g"
      ],
      [
        "-Þar af sykurtegundir",
        "47,9 g"
      ],
      [
        "Trefjar",
        "9,8 g"
      ],
      [
        "Prótein",
        "3,3 g"
      ],
      [
        "Salt",
        "0,03 g"
      ]
    ],
    "tags": [
      "avextir"
    ],
    "tint": "#DE935E",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/fikjur-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/fikjur-2.jpg"
    ]
  },
  {
    "slug": "dodlur-2",
    "brand": "hberg",
    "name": {
      "is": "Döðlur",
      "en": "Döðlur"
    },
    "desc": {
      "is": "Þurrkaðir ávextir",
      "en": "Þurrkaðir ávextir"
    },
    "ingredients": "Innihald: Döðlur, sólblómaolía (<0,2%)",
    "nutrition": "Döðlu heilar og steinlausar Næringargildi í 100 g: Orka 1252 kJ/295 kkal Fita 0,2 g -Þar af mettuð 0,1 g Kolvetni 68 g -Þar af sykurtegundir 66 g Trefjar 4 g Prótein 3,3 g Salt 0,03 g",
    "nutritionRows": [
      [
        "Orka",
        "1252 kJ/295 kkal"
      ],
      [
        "Fita",
        "0,2 g"
      ],
      [
        "-Þar af mettuð",
        "0,1 g"
      ],
      [
        "Kolvetni",
        "68 g"
      ],
      [
        "-Þar af sykurtegundir",
        "66 g"
      ],
      [
        "Trefjar",
        "4 g"
      ],
      [
        "Prótein",
        "3,3 g"
      ],
      [
        "Salt",
        "0,03 g"
      ]
    ],
    "tags": [
      "avextir"
    ],
    "tint": "#DE935E",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/dodlur-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/dodlur-2.jpg"
    ]
  },
  {
    "slug": "dodlur-saxadar-2",
    "brand": "hberg",
    "name": {
      "is": "Döðlur saxaðar",
      "en": "Döðlur saxaðar"
    },
    "desc": {
      "is": "Þurrkaðir ávextir",
      "en": "Þurrkaðir ávextir"
    },
    "ingredients": "Innihald: Döðlur, hrísmjöl (<3%)",
    "nutrition": "Döðlu saxaðar Næringargildi í 100 g: Orka 1320 kJ/311 kkal Fita 0,2 g -Þar af mettuð 0,1 g Kolvetni 72 g -Þar af sykurtegundir 68 g Trefjar 4 g Prótein 3,3 g Salt 0,03 g",
    "nutritionRows": [
      [
        "Orka",
        "1320 kJ/311 kkal"
      ],
      [
        "Fita",
        "0,2 g"
      ],
      [
        "-Þar af mettuð",
        "0,1 g"
      ],
      [
        "Kolvetni",
        "72 g"
      ],
      [
        "-Þar af sykurtegundir",
        "68 g"
      ],
      [
        "Trefjar",
        "4 g"
      ],
      [
        "Prótein",
        "3,3 g"
      ],
      [
        "Salt",
        "0,03 g"
      ]
    ],
    "tags": [
      "avextir"
    ],
    "tint": "#DE935E",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/dodlur-saxadar-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/dodlur-saxadar-2.jpg"
    ]
  },
  {
    "slug": "dodlusirop-2",
    "brand": "hberg",
    "name": {
      "is": "Döðlusíróp",
      "en": "Döðlusíróp"
    },
    "desc": {
      "is": "Bökunarvörur",
      "en": "Bökunarvörur"
    },
    "ingredients": "Innihald: Döðlur (100%)",
    "nutrition": "Döðlusíróp Næringargildi í 100 g: Orka 1371 kJ/324 kkal Fita 0,1 g -Þar af mettuð 0 g Kolvetni 75 g -Þar af sykurtegundir 62 g Trefjar 7,8 g Prótein 2,0 g Salt 0,11 g",
    "nutritionRows": [
      [
        "Orka",
        "1371 kJ/324 kkal"
      ],
      [
        "Fita",
        "0,1 g"
      ],
      [
        "-Þar af mettuð",
        "0 g"
      ],
      [
        "Kolvetni",
        "75 g"
      ],
      [
        "-Þar af sykurtegundir",
        "62 g"
      ],
      [
        "Trefjar",
        "7,8 g"
      ],
      [
        "Prótein",
        "2,0 g"
      ],
      [
        "Salt",
        "0,11 g"
      ]
    ],
    "tags": [
      "bakstur"
    ],
    "tint": "#D6C7A4",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/dodlusirop-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/dodlusyrop-1.jpg"
    ]
  },
  {
    "slug": "chilli-hriskokur",
    "brand": "hberg",
    "name": {
      "is": "Chilli hrískökur",
      "en": "Chilli hrískökur"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Hrísmjöl, pálmaolía (vottuð), sykur, tapíókasterkja, maltódextrín, salt, litarefni (E160c, E150c), paprikuþykkni, chili, sojasósa ( SOJABAUNIR , HVEITI , vatn, salt)",
    "nutrition": "Apríkósur Næringargildi í 100 g: Orka 2297kJ/550 kkal Fita 33,3 g -Þar af mettuð 16,3 g Kolvetni 58 g -Þar af sykurtegundir 11,1 g Trefjar 1,5 g Prótein 3,9 g Salt 2,1 g",
    "nutritionRows": [
      [
        "Orka",
        "2297kJ/550 kkal"
      ],
      [
        "Fita",
        "33,3 g"
      ],
      [
        "-Þar af mettuð",
        "16,3 g"
      ],
      [
        "Kolvetni",
        "58 g"
      ],
      [
        "-Þar af sykurtegundir",
        "11,1 g"
      ],
      [
        "Trefjar",
        "1,5 g"
      ],
      [
        "Prótein",
        "3,9 g"
      ],
      [
        "Salt",
        "2,1 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "gluten",
      "soy"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/chilli-hriskokur/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/chili-hriskokur.jpg"
    ]
  },
  {
    "slug": "aprikosur-2",
    "brand": "hberg",
    "name": {
      "is": "Apríkósur",
      "en": "Apríkósur"
    },
    "desc": {
      "is": "Þurrkaðir ávextir",
      "en": "Þurrkaðir ávextir"
    },
    "ingredients": "Innihald: Apríkósur, rotvarnarefni (<0,2%)( BRENNISTEINSDÍOXÍÐ )",
    "nutrition": "Apríkósur Næringargildi í 100 g: Orka 1076 kJ/254 kkal Fita 0,51 g -Þar af mettuð 0,02 g Kolvetni 55 g -Þar af sykurtegundir 53 g Trefjar 7,3 g Prótein 3,4 g Salt 0,03 g",
    "nutritionRows": [
      [
        "Orka",
        "1076 kJ/254 kkal"
      ],
      [
        "Fita",
        "0,51 g"
      ],
      [
        "-Þar af mettuð",
        "0,02 g"
      ],
      [
        "Kolvetni",
        "55 g"
      ],
      [
        "-Þar af sykurtegundir",
        "53 g"
      ],
      [
        "Trefjar",
        "7,3 g"
      ],
      [
        "Prótein",
        "3,4 g"
      ],
      [
        "Salt",
        "0,03 g"
      ]
    ],
    "tags": [
      "avextir"
    ],
    "tint": "#DE935E",
    "allergens": [
      "sulphites"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/aprikosur-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/aprikosur-2.jpg"
    ]
  },
  {
    "slug": "husk",
    "brand": "hberg",
    "name": {
      "is": "Husk",
      "en": "Husk"
    },
    "desc": {
      "is": "Bökunarvörur",
      "en": "Bökunarvörur"
    },
    "ingredients": "Innihald: Psyllium husk trefjar",
    "nutrition": "Huskið er einstkalega trefjaríkt og gott fyrir meltinguna Næringargildi í 100 g: Orka 776kJ/194 kkal Fita 2 g -Þar af mettuð 0,2 g Kolvetni 2,5 g -Þar af sykurtegundir 0 g Trefjar 87,5 g Prótein 1,4 g Salt 0,33 g",
    "nutritionRows": [
      [
        "Orka",
        "776kJ/194 kkal"
      ],
      [
        "Fita",
        "2 g"
      ],
      [
        "-Þar af mettuð",
        "0,2 g"
      ],
      [
        "Kolvetni",
        "2,5 g"
      ],
      [
        "-Þar af sykurtegundir",
        "0 g"
      ],
      [
        "Trefjar",
        "87,5 g"
      ],
      [
        "Prótein",
        "1,4 g"
      ],
      [
        "Salt",
        "0,33 g"
      ]
    ],
    "tags": [
      "bakstur"
    ],
    "tint": "#D6C7A4",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/husk/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/husk-trefjar-2.jpg",
      "https://hberg.is/wp-content/uploads/2020/03/husk-trefjar.jpg"
    ]
  },
  {
    "slug": "kokospalmasykur-2",
    "brand": "hberg",
    "name": {
      "is": "Kókospálmasykur",
      "en": "Kókospálmasykur"
    },
    "desc": {
      "is": "Bökunarvörur",
      "en": "Bökunarvörur"
    },
    "ingredients": "Innihald: Kókospálmasykur",
    "nutrition": "Kókospálmasykur Næringargildi í 100 g: Orka 1634 kJ/385 kkal Fita 0 g -Þar af mettuð 0 g Kolvetni 94 g -Þar af sykurtegundir 83 g Trefjar 2,1 g Prótein 1,1 g Salt 0,17g",
    "nutritionRows": [
      [
        "Orka",
        "1634 kJ/385 kkal"
      ],
      [
        "Fita",
        "0 g"
      ],
      [
        "-Þar af mettuð",
        "0 g"
      ],
      [
        "Kolvetni",
        "94 g"
      ],
      [
        "-Þar af sykurtegundir",
        "83 g"
      ],
      [
        "Trefjar",
        "2,1 g"
      ],
      [
        "Prótein",
        "1,1 g"
      ],
      [
        "Salt",
        "0,17g"
      ]
    ],
    "tags": [
      "bakstur"
    ],
    "tint": "#D6C7A4",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/kokospalmasykur-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/kokos-palmasykur-2.jpg"
    ]
  },
  {
    "slug": "chia-frae-2",
    "brand": "hberg",
    "name": {
      "is": "Chia fræ",
      "en": "Chia fræ"
    },
    "desc": {
      "is": "Fræ",
      "en": "Fræ"
    },
    "ingredients": "Innihald: Chia fræ",
    "nutrition": "Chia fræ Næringargildi í 100 g: Orka 2156 kJ/519 kkal Fita 28,6 g -Þar af mettuð 3,2 g Kolvetni 4,4 g -Þar af sykurtegundir 0 g Trefjar 37,7 g Prótein 15,6 g Salt 0,05 g",
    "nutritionRows": [
      [
        "Orka",
        "2156 kJ/519 kkal"
      ],
      [
        "Fita",
        "28,6 g"
      ],
      [
        "-Þar af mettuð",
        "3,2 g"
      ],
      [
        "Kolvetni",
        "4,4 g"
      ],
      [
        "-Þar af sykurtegundir",
        "0 g"
      ],
      [
        "Trefjar",
        "37,7 g"
      ],
      [
        "Prótein",
        "15,6 g"
      ],
      [
        "Salt",
        "0,05 g"
      ]
    ],
    "tags": [
      "frae"
    ],
    "tint": "#A8B77D",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/chia-frae-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/chia-frae-2.jpg",
      "https://hberg.is/wp-content/uploads/2020/03/chia-frae.jpg"
    ]
  },
  {
    "slug": "mondlumjol-2",
    "brand": "hberg",
    "name": {
      "is": "Möndlumjöl",
      "en": "Möndlumjöl"
    },
    "desc": {
      "is": "Bökunarvörur",
      "en": "Bökunarvörur"
    },
    "ingredients": "Innihald: MÖNDLUMJÖL",
    "nutrition": "Möndlumjölið er tilvalið í bakstur. Næringargildi í 100 g: Orka 2689kJ/650 kkal Fita 55 g -Þar af mettuð 4,3 g Kolvetni 7,2 g -Þar af sykurtegundir 3,8 g Trefjar 10 g Prótein 26,7 g Salt 0,07 g",
    "nutritionRows": [
      [
        "Orka",
        "2689kJ/650 kkal"
      ],
      [
        "Fita",
        "55 g"
      ],
      [
        "-Þar af mettuð",
        "4,3 g"
      ],
      [
        "Kolvetni",
        "7,2 g"
      ],
      [
        "-Þar af sykurtegundir",
        "3,8 g"
      ],
      [
        "Trefjar",
        "10 g"
      ],
      [
        "Prótein",
        "26,7 g"
      ],
      [
        "Salt",
        "0,07 g"
      ]
    ],
    "tags": [
      "bakstur"
    ],
    "tint": "#D6C7A4",
    "allergens": [
      "nuts"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/mondlumjol-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/mondlumjol-2.jpg"
    ]
  },
  {
    "slug": "mexikano-snakk-2",
    "brand": "hberg",
    "name": {
      "is": "Mexikano snakk",
      "en": "Mexikano snakk"
    },
    "desc": {
      "is": "Súkkulaði og snakk",
      "en": "Súkkulaði og snakk"
    },
    "ingredients": "Innihald: Maísmjöl, maíssterkja, ostakrydd ( MJÓLK ), salt, tómatduft, sykur, chiliduft, ger, laukduft, litarefni (E160c), kekkjavarnarefni (E551)), pálmaolía (vottuð), salt",
    "nutrition": "Bragðmikið og brakandi stökkt snakk, tilvalið til fyrir spilakvöldið, saumaklúbbinn eða jafvel á nammibarinn í veislunni. Næringargildi í 100 g: Orka 1562kJ/369 kkal Fita 5,3 g -Þar af mettuð 1,9 g Kolvetni 73,4 g -Þar af sykurtegundir 6,9 g Trefjar 2,9 g Prótein 5,6 g Salt 0,69 g",
    "nutritionRows": [
      [
        "Orka",
        "1562kJ/369 kkal"
      ],
      [
        "Fita",
        "5,3 g"
      ],
      [
        "-Þar af mettuð",
        "1,9 g"
      ],
      [
        "Kolvetni",
        "73,4 g"
      ],
      [
        "-Þar af sykurtegundir",
        "6,9 g"
      ],
      [
        "Trefjar",
        "2,9 g"
      ],
      [
        "Prótein",
        "5,6 g"
      ],
      [
        "Salt",
        "0,69 g"
      ]
    ],
    "tags": [
      "snakk"
    ],
    "tint": "#CF9B89",
    "allergens": [
      "milk"
    ],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/mexikano-snakk-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/mexico-snakk-2.jpg"
    ]
  },
  {
    "slug": "solblomafrae-2",
    "brand": "hberg",
    "name": {
      "is": "Sólblómafræ",
      "en": "Sólblómafræ"
    },
    "desc": {
      "is": "Fræ",
      "en": "Fræ"
    },
    "ingredients": "Innihald: Sólblómafræ",
    "nutrition": "Sólblómafræ eru einföld í bragi en einstaklega rík af E og B vítamínum, próteinrík og innihalda góðar olíur. Mikið notuð í brauðgerð og út á salöt, og ekki er verra hvað þau eru ódýr í innkaupum. Næringargildi í 100 g: Orka 2639kJ/637kkal Fita 51 g -Þar af mettuð 6,4 g Kolvetni 20 g -Þar af sykurtegundir 2,0 g Trefjar 9 g Prótein 20 g Salt 0,004 g",
    "nutritionRows": [
      [
        "Orka",
        "2639kJ/637kkal"
      ],
      [
        "Fita",
        "51 g"
      ],
      [
        "-Þar af mettuð",
        "6,4 g"
      ],
      [
        "Kolvetni",
        "20 g"
      ],
      [
        "-Þar af sykurtegundir",
        "2,0 g"
      ],
      [
        "Trefjar",
        "9 g"
      ],
      [
        "Prótein",
        "20 g"
      ],
      [
        "Salt",
        "0,004 g"
      ]
    ],
    "tags": [
      "frae"
    ],
    "tint": "#A8B77D",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/solblomafrae-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/solblomafrae-2.jpg"
    ]
  },
  {
    "slug": "graskersfrae-2",
    "brand": "hberg",
    "name": {
      "is": "Graskersfræ",
      "en": "Graskersfræ"
    },
    "desc": {
      "is": "Fræ",
      "en": "Fræ"
    },
    "ingredients": "Innihald: Graskersfræ",
    "nutrition": "Graskerafræ eru bragðmikil fræ með keim af hnetu og sætu. Þau eru góð uppspretta næringa- og steinefna, próteinrík, veita fosfór, kalíum, magnesíum, járn og zink. Graskersfræ hafa verið vinsæl í ýmsar uppskriftir, svo sem í salöt og brauðgerð. Næringargildi í 100 g: Orka 2300kJ/550 kkal Fita 34,1 g -Þar af mettuð 0,5 g Kolvetni 5,0 g -Þar af sykurtegundir 1,0 g Trefjar 7,8 g Prótein 32 g Salt 0,02 g",
    "nutritionRows": [
      [
        "Orka",
        "2300kJ/550 kkal"
      ],
      [
        "Fita",
        "34,1 g"
      ],
      [
        "-Þar af mettuð",
        "0,5 g"
      ],
      [
        "Kolvetni",
        "5,0 g"
      ],
      [
        "-Þar af sykurtegundir",
        "1,0 g"
      ],
      [
        "Trefjar",
        "7,8 g"
      ],
      [
        "Prótein",
        "32 g"
      ],
      [
        "Salt",
        "0,02 g"
      ]
    ],
    "tags": [
      "frae"
    ],
    "tint": "#A8B77D",
    "allergens": [],
    "unverified": [],
    "labels": {},
    "hasPack": true,
    "hasOpen": false,
    "macros": 0,
    "source": "https://hberg.is/vorur/graskersfrae-2/",
    "imageUrls": [
      "https://hberg.is/wp-content/uploads/2020/03/graskersfrae-2.jpg"
    ]
  }
]
export const ALLERGENS=[{"id": "nuts", "is": "Hnetur", "en": "Hnetur"}, {"id": "peanut", "is": "Jarðhnetur", "en": "Jarðhnetur"}, {"id": "milk", "is": "Mjólk", "en": "Mjólk"}, {"id": "gluten", "is": "Glúten", "en": "Glúten"}, {"id": "soy", "is": "Soja", "en": "Soja"}, {"id": "sesame", "is": "Sesam", "en": "Sesam"}, {"id": "sulphites", "is": "Súlfít", "en": "Súlfít"}]
export const CONTACT={"name": "H-Berg ehf.", "email": "hberg@hberg.is", "emailOrders": "pantanir@hberg.is", "emailFundraise": "pantanir@hberg.is", "phone": "565 6500", "phoneHref": "tel:+3545656500", "address": "Grandatröð 12", "postcode": "220 Hafnarfjörður", "kt": "", "mapHref": "https://www.google.com/maps/search/?api=1&query=Grandatröð+12+Hafnarfjörður"}
export const SHOPS=[{"name": "10-11", "href": "https://www.10-11.is", "note": {"is": "", "en": ""}}, {"name": "Albína", "href": "https://hberg.is/soluadilar/", "note": {"is": "Aðalstræti 91, 450 Patreksfjörður", "en": "Aðalstræti 91, 450 Patreksfjörður"}}, {"name": "Bónus", "href": "https://www.bonus.is", "note": {"is": "", "en": ""}}, {"name": "Fjarðarkaup", "href": "https://www.fjardarkaup.is", "note": {"is": "Hólshraun 1, 220 Hafnarfjörður", "en": "Hólshraun 1, 220 Hafnarfjörður"}}, {"name": "Fjölval", "href": "https://hberg.is/soluadilar/", "note": {"is": "Þórsgata 10, 450 Patreksfjörður", "en": "Þórsgata 10, 450 Patreksfjörður"}}, {"name": "Hagkaup", "href": "https://www.hagkaup.is", "note": {"is": "", "en": ""}}, {"name": "Hlíðarkaup", "href": "https://hberg.is/soluadilar/", "note": {"is": "Akurhlíð 1, 550 Sauðárkróki", "en": "Akurhlíð 1, 550 Sauðárkróki"}}, {"name": "Iceland", "href": "https://www.iceland.is", "note": {"is": "", "en": ""}}, {"name": "Kaupfélag Skagfirðinga", "href": "https://www.ks.is", "note": {"is": "Ártorgi 1, 550 Sauðárkrókur", "en": "Ártorgi 1, 550 Sauðárkrókur"}}, {"name": "Kaupfélag Steingrímsfjarðar", "href": "https://www.ksholm.is", "note": {"is": "Höfðatúni 4, 510 Hólmavík", "en": "Höfðatúni 4, 510 Hólmavík"}}, {"name": "Kaupfélag Vestur Húnvetninga", "href": "https://www.kvh.is", "note": {"is": "Strandgötu 1, 530 Hvammstanga", "en": "Strandgötu 1, 530 Hvammstanga"}}, {"name": "Krónan", "href": "https://www.kronan.is", "note": {"is": "", "en": ""}}, {"name": "Melabúðin", "href": "https://hberg.is/soluadilar/", "note": {"is": "Hagamel 39, 107 Reykjavík", "en": "Hagamel 39, 107 Reykjavík"}}, {"name": "N1", "href": "https://www.n1.is", "note": {"is": "", "en": ""}}, {"name": "Nettó", "href": "https://www.netto.is", "note": {"is": "", "en": ""}}, {"name": "Olís", "href": "https://www.olis.is", "note": {"is": "", "en": ""}}, {"name": "Samkaup", "href": "https://www.samkaup.is", "note": {"is": "", "en": ""}}, {"name": "Skeljungur", "href": "https://www.skeljungur.is", "note": {"is": "", "en": ""}}, {"name": "Vöruval Vestmannaeyjum", "href": "https://hberg.is/soluadilar/", "note": {"is": "Vesturvegur 8, 902 Vestmannaeyjar", "en": "Vesturvegur 8, 902 Vestmannaeyjar"}}]
export const productBySlug=(s:string)=>PRODUCTS.find(p=>p.slug===s)
export const PK=(slug:string,_kind:'pack'|'open'='pack',size:'s'|'m'|'b'='m')=>`${BASE}hberg/p/${slug}/${size==='s'?400:size==='m'?800:1200}.webp${V}`
export const img=(slug:string,f:string)=>`${BASE}hberg/p/${slug}/${f}${V}`
export const FEATURED=PRODUCTS.slice(0,6).map(p=>p.slug)
