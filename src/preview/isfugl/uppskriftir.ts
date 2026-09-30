/* 79 uppskriftir af isfugl.is (kjúklinga- og kalkúnauppskriftir, 2014 til 2018). Texti
   hráefna og aðferðar er þeirra eigin, orð fyrir orð. Leiðréttingar á augljósum innsláttarvillum
   eru taldar upp í _docs/ISFUGL-BUILD-2026-09-30.md. Hópun (hopur) er okkar, út frá flokkum
   þeirra og fyrirsögnum. Myndir: sjá public/isfugl/r (sviðsettar, ekki ljósmyndir Ísfugls). */
export type Fugl = 'kjuklingur' | 'kalkunn'
export type HopurId = 'bringur' | 'heill' | 'leggir' | 'hakk' | 'grill' | 'salat' | 'bitar'
export type Hluti = { h: string | null; efni: string[]; adferd: string[] }
export type Uppskrift = { id: number; t: string; fyrir: string; fugl: Fugl; hopur: HopurId; h: Hluti[] }
export const UPPSKRIFTIR: Uppskrift[] = [
 {
  "id": 486,
  "t": "Afskaplega fljótlegir og auðveldir kalkúnatrommarar",
  "fyrir": "4",
  "fugl": "kalkunn",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "u.þ.b. 1250 g kalkúnaleggir",
     "2 bollar uppáhalds BBQ-sósan þín"
    ],
    "adferd": [
     "Forhitið ofninn í 160°C.",
     "Penslið leggina með BBQ-sósunni og setjið þá í eldfast mót eða ofnskúffu.",
     "Eldið í u.þ.b. 1 klst., eða þangað til leggirnir eru tilbúnir (*kjöthitamælir á að sýna 80°C þegar honum er stungið í þykkasta hlutann, en gætið þess að mælirinn snerti ekki beinið).",
     "Berið fram með hrísgrjónum eða frönskum kartöflum og hafið ferskt salat með."
    ]
   }
  ]
 },
 {
  "id": 1628,
  "t": "Appelsínukjúklingur og ofnsteiktar kartöflur",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "heill",
  "h": [
   {
    "h": null,
    "efni": [
     "1 heill kjúklingur",
     "2 hvítlauksgeirar smátt saxaður",
     "1 appelsína skorinn í bita",
     "1 stk rauður chili smátt saxaður",
     "1/2 dl olía",
     "1 msk rosmaryn þurrkað",
     "1 tsk chilliduft",
     "Salt og pipar"
    ],
    "adferd": [
     "þerrið kjúklinginn vel og hrærið saman hvítlauk, chilli og appelsínur og 1/2 msk af rosmaryn troðið inn í kjúklinginn. Makið olíunni á kjúklinginn og kryddið með restinni af rósmaríninu, chillidufti, salti og pipar. Setjið ofninnn á 175°C og bakið í 70- 80 mínútur eða þar til kjúklingurinn er gegneldaður."
    ]
   },
   {
    "h": "Sósa",
    "efni": [
     "1 dl vatn",
     "1 dl appelsínusafi",
     "2 msk appelsínumarmelaði",
     "Soðið af kjúklingnum",
     "Kjúklingakraftur eftir smekk",
     "Sósujafnari"
    ],
    "adferd": [
     "Sjóðið saman vatn, appelsínusafa, appelsínumarmelaði og soðið af kjúklingnum. Bragðbætið með kjúklingakrafti og þykkið með sósujafnara."
    ]
   },
   {
    "h": "Ofnsteiktar kartöflur",
    "efni": [
     "12 stk meðalstórar kartöflur",
     "1/2 dl olía",
     "2 hvítlauksgeirar saxaðir",
     "1 msk þurrkuð steinselja",
     "salt og pipar"
    ],
    "adferd": [
     "Skerið kartöflur í bita og veltið upp úr olíunni hrærið saman við hvítlauknum og steinseljunni. Að lokum kryddið með salti og pipar. Bakið við 175°C í 40 mínútur."
    ]
   }
  ]
 },
 {
  "id": 474,
  "t": "Austurlenskur kalkúnn með salthnetum",
  "fyrir": "2-3",
  "fugl": "kalkunn",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "500 g kalkúnabringur, skornar í 1-1 ½ cm strimla",
     "2 bollar sellerí, skorið í bita",
     "1 stór rauð paprika, skorin í strimla",
     "1 hvítlauksgeiri, saxaður mjög smátt",
     "2 msk. matarolía",
     "½ bolli salatdressing",
     "3 msk. hnetusmjör",
     "1 msk. sojasósa",
     "½ tsk. engifer",
     "2 msk. salthnetur, skornar í bita",
     "3 bollar salat, rifið niður"
    ],
    "adferd": [
     "Látið sellerí, papriku og hvítlauk malla í 1 msk. af olíunni í 3-4 mín. í potti við meðalháan hita.",
     "Takið grænmetið af pönnunni og setjið afganginn af olíunni og brúnið kalkúnastrimlana þangað til þeir eru farnir að dökkna og harðna aðeins (5 mín.)",
     "Takið pönnuna af hellunni og bætið grænmetinu á hana.",
     "Blandið saman í skál salatdressing, hnetusmjöri, sojasósu og engifer. Hellið þessu svo á pönnuna saman við kalkúninn og grænmetið (en ekki setja pönnuna á hita aftur).",
     "Berið fram á diskum ofan á salatblöðum og stráið salthnetum yfir."
    ]
   }
  ]
 },
 {
  "id": 404,
  "t": "Bakaður kjúklingur með kartöfluflögum",
  "fyrir": "6-8",
  "fugl": "kjuklingur",
  "hopur": "bitar",
  "h": [
   {
    "h": null,
    "efni": [
     "3 stk. heilir kjúklingar í smærri kantinum, skornir í 4 bita hver",
     "1 bolli sítrónusafi",
     "1 tsk. salt",
     "1 tsk. svartur pipar",
     "1-1½ bolli þurrt hvítvín",
     "6 hvítlauksgeirar, pressaðir",
     "1 tsk. þurrkað basilikum",
     "1 bolli bráðið smjör",
     "3 bollar kartöfluflögur, muldar"
    ],
    "adferd": [
     "Blandið saman í stóra skál sítrónusafanum, salti, pipar, hvítvíni, hvítlauk og basilikum.",
     "Bætið kjúklingabitunum út í, látið marinerast í 3-4 klukkutíma í ísskáp og snúið þeim við af og til.",
     "Hitið ofninn í 190°C.",
     "Takið kjúklinginn úr leginum og þerrið.",
     "Dýfið hverjum bita í bráðið smjör og rúllið upp úr muldu kartöfluflögunum.",
     "Setjið í smurða ofnskúffu eða stórt eldfast mót og steikið í 1 klst. við 190° C."
    ]
   }
  ]
 },
 {
  "id": 406,
  "t": "Bakaður Parmesankjúklingur",
  "fyrir": "4-5",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "8 stk. kjúklingalæri",
     "5 msk. bráðið smjör, helst ósaltað",
     "1 msk. dijonsinnep",
     "¾ bolli brauðrasp",
     "½ bolli ferskur parmesanostur, rifinn",
     "2 msk. söxuð fersk steinselja",
     "1 tsk. þurrt basilikum"
    ],
    "adferd": [
     "Hitið ofninn í 200°C og smyrjið eldfast mót.",
     "Blandið saman í skál bræddu smjörinu og sinnepinu.",
     "Í annarri skál er blandað saman brauðraspi, osti, steinselju og basilikum.",
     "Dýfið kjúklingalærunum fyrst í smjör-/sinnepsblönduna, síðan í raspblönduna.",
     "Raðið í mótið og bakið í u.þ.b. 45 mín."
    ]
   }
  ]
 },
 {
  "id": 1936,
  "t": "BBQ Kalkúnabuff",
  "fyrir": "",
  "fugl": "kalkunn",
  "hopur": "hakk",
  "h": [
   {
    "h": null,
    "efni": [
     "800 g kalkúnahakk",
     "½ tsk salt",
     "1 tsk svartur pipar grófmalaður",
     "½ tsk chilliduft",
     "1 tsk reykt parika",
     "50 g BBQ sósa",
     "30 g brauðraspur"
    ],
    "adferd": [
     "Hrærið saman kalkúnahakk, BBQ sósu og kryddi. Bætið í brauðraspi. Lagið buff og brúnið í smjöri á pönnu bakið við 180°C í 15-20 mínútur eftir stærð buffanna."
    ]
   }
  ]
 },
 {
  "id": 360,
  "t": "BBQ-vængir með sesam- og gráðaostasósu",
  "fyrir": "4-6",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "20 stk. kjúklingavængir",
     "1 dl BBQ-sósa",
     "2 msk. sesamfræ"
    ],
    "adferd": [
     "Hitið ofninn í 180°C og bakið vængina í 20 mín.",
     "Penslið vængina þá með BBQ-sósunni og dreifið sesamfræjunum yfir þá.",
     "Bakið í 5 mín. til viðbótar og berið fram með sósunni.",
     "Gráðaostasósa",
     "1 dós sýrður rjómi (18%)",
     "1-2 msk. gráðaostur",
     "hvítur pipar, nýmalaður",
     "Þeytið sýrða rjómann og gráðaostinn vel saman.",
     "Kryddið með pipar eftir smekk."
    ]
   }
  ]
 },
 {
  "id": 362,
  "t": "Bombay-kjúklingavængir með jógúrtídýfu",
  "fyrir": "6-8",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "24 stk. kjúklingavængir",
     "1 tsk. karrý",
     "½ tsk. túrmerik",
     "2 msk. sojasósa",
     "2 msk. matarolía",
     "2 hvítlauksrif, söxuð",
     "1/8 tsk. svartur pipar",
     "steinselja til skreytingar"
    ],
    "adferd": [
     "Blandið saman í stóra skál öllu nema kjúklingavængjunum.",
     "Bætið vængjunum út í.",
     "Setjið plastfilmu yfir og geymið í ísskáp í u.þ.b. 1 klst.",
     "Látið leka af vængjunum og raðið í ofnskúffu eða eldfast mót.",
     "Eldið í ofni í 25 mín. á 165°C, eða þangað til vængirnir eru gullinbrúnir.",
     "Skreytið með steinselju.",
     "Jógúrtídýfa",
     "½ bolli hrein jógúrt",
     "3 msk. mangó, smátt skorinn",
     "1 msk. steinselja, söxuð",
     "1 lítill laukur, smátt skorinn",
     "¼ tsk. Tabascosósa (má sleppa)",
     "1/8 tsk. salt",
     "Blandið öllu saman í skál.",
     "Geymið sósuna í ísskápnum þangað til kjúklingurinn er borinn fram."
    ]
   }
  ]
 },
 {
  "id": 408,
  "t": "Chicken-tonight",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "500 g beinlaust kjúklingakjöt (bringa eða læri)",
     "2-3 msk. olía",
     "1 krukka „chicken-tonight“ sósa (270 g)",
     "1 askja sveppir",
     "vatn eftir þörfum",
     "1 bolli hrísgrjón"
    ],
    "adferd": [
     "Hitið olíu í potti, skerið kjötið í strimla eða bita og brúnið í olíunni.",
     "Skerið niður sveppina og steikið.",
     "Hellið sósunni yfir og hrærið saman.",
     "Látið malla á pönnunni á meðan hrísgrjónin eru soðin. Passið að hafa ekki of háan hita því þá sýður allur vökvi af pönnunni. Hrærið öðru hverju.",
     "Borið fram með hrísgrjónum og snittubrauði."
    ]
   }
  ]
 },
 {
  "id": 466,
  "t": "Dásamlegt kalkúnasalat",
  "fyrir": "3-4",
  "fugl": "kalkunn",
  "hopur": "salat",
  "h": [
   {
    "h": null,
    "efni": [
     "4 dl eldað kalkúnakjöt",
     "½ rauð paprika",
     "1/3 gúrka",
     "1 dl vínber",
     "1 dl fetaostur",
     "lúka af rúsínum",
     "lúka af hnetum (t.d. kasjúhnetur, salthnetur, valhnetur eða furuhnetur)"
    ],
    "adferd": [
     "Kalkúnakjötið sett í skál.",
     "Paprika, gúrka og vínber skorin niður og bætt í skálina.",
     "Fetaosti í bitum bætt við og öllu blandað varlega saman.",
     "Rúsínum og hnetum stráð yfir.",
     "Salatsósu hellt yfir."
    ]
   },
   {
    "h": "Salatsósa",
    "efni": [
     "½ dl græn ólífuolía",
     "2 msk. balsamikedik",
     "salt og pipar"
    ],
    "adferd": [
     "Allt pískað vel saman og hellt yfir salatið."
    ]
   }
  ]
 },
 {
  "id": 374,
  "t": "Einfaldur kjúklingur með spergilkáli",
  "fyrir": "4-6",
  "fugl": "kjuklingur",
  "hopur": "heill",
  "h": [
   {
    "h": null,
    "efni": [
     "1 meðalstór heill kjúklingur",
     "1 tsk. karrý",
     "4 msk. majónes",
     "1 dós sveppasúpa",
     "1 poki frosið spergilkál eða ferskt",
     "rifinn ostur"
    ],
    "adferd": [
     "Sjóðið kjúklinginn.",
     "Hrærið saman majónesi, karrýi og sveppasúpu.",
     "Sjóðið spergilkálið og setjið það í eldfast mót, brytjið kjúklinginn og setjið hann ofan á, hellið sveppablöndunni ofan á og stráið loks rifnum osti yfir.",
     "Bakið við 180-200°C þangað til osturinn hefur bráðnað og tekið á sig fallegan lit."
    ]
   }
  ]
 },
 {
  "id": 364,
  "t": "Eyjavængir með ídýfu",
  "fyrir": "2-3",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "8 stk. kjúklingavængir",
     "1 msk. hvítlauksolía",
     "salt og pipar"
    ],
    "adferd": [
     "Takið fremsta partinn af vængjunum , hann notast ekki.",
     "Takið svo vængina í tvennt á liðnum, þannig að hver vængur verði 2 hlutar.",
     "Hitið hvítlauksolíuna á pönnu.",
     "Eldið vængina í 18-20 mín. eða þangað til þeir eru orðnir fallega brúnir á öllum hliðum.",
     "Kryddið vængina aðeins með salti og pipar.",
     "Berið vængina fram með ídýfunni.",
     "Ídýfa",
     "1 dós niðursoðinn grænn chili, vökvinn tekinn af",
     "¼ bolli saxaður laukur",
     "¼ bolli rúsínur",
     "1 msk. appelsínumarmelaði",
     "1 stór banani, skorinn niður í bita",
     "1 msk. púðursykur",
     "1 msk. sítrónusafi",
     "¼ tsk. allrahanda",
     "Blandið öllum hráefnunum í ídýfuna saman í matvinnsluvél."
    ]
   }
  ]
 },
 {
  "id": 492,
  "t": "Fantagóðir kalkúnavængir",
  "fyrir": "2-3",
  "fugl": "kalkunn",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "1 kg kalkúnavængir, teknir í tvennt",
     "1 tsk. matarolía",
     "¾ bolli Fanta Lemon",
     "1 tsk. rosemarin, mulið",
     "1 tsk. sage, mulið",
     "½ tsk. salt",
     "6 heil svört piparkorn",
     "1 dós (14 oz) ætiþistlar, safinn látinn leka af þeim",
     "2 blaðlaukar, sneiddir niður"
    ],
    "adferd": [
     "Látið vængina malla á meðalhita í olíu á pönnu.",
     "Takið vængina af pönnunni, raðið þeim á eldhúspappír og látið leka af þeim.",
     "Takið alla afgangsolíu af pönnunni, setjið hana aftur á helluna á mikinn hita og blandið saman Fanta, rosemarin, sage, salti, piparkornum, ætiþistlum og blaðlauk.",
     "Látið suðuna koma upp, lækkið hitann og látið vængina saman við á pönnuna.",
     "Látið malla í 1 klst. eða þangað til vængirnir eru tilbúnir (kjarnhiti 80-85°C á kjöthitamæli).",
     "Kælið niður og setjið í ísskáp í nokkrar klukkustundir eða yfir nótt.",
     "Berið vængina fram kalda."
    ]
   }
  ]
 },
 {
  "id": 476,
  "t": "Fljótlegar kalkúnalundir með hvítlauk",
  "fyrir": "2-3",
  "fugl": "kalkunn",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "500 g kalkúnalundir (eða beinlaus og skinnlaus bringa, skorin í 4 cm þykka bita)",
     "3 msk. ólífuolía",
     "5 hvítlauksgeirar, marðir án hýðis",
     "½ tsk. salt",
     "½ tsk. svartur pipar",
     "½ bolli fersk steinselja",
     "½ lime (safinn)"
    ],
    "adferd": [
     "Hitið ofninn í 200°C.",
     "Setjið lundirnar í eldfast mót og bleytið í þeim með ólífuolíunni.",
     "Stráið yfir hvítlauk, salti og pipar.",
     "Setjið lok eða álpappír yfir og steikið í 20 mín.",
     "Takið lokið/álpappírinn af, stráið steinselju yfir og steikið í 10 mín. til viðbótar.",
     "Skvettið limesafanum yfir."
    ]
   },
   {
    "h": "Hvítlaukssteiktar sætar kartöflur",
    "efni": [
     "2 sætar kartöflur, skrældar og skornar í 2 cm kubba",
     "1 rauð paprika, skorin í strimla",
     "1 msk. ólífuolía",
     "5 hvítlauksgeirar, pressaðir",
     "½ tsk. salt",
     "½ svartur pipar"
    ],
    "adferd": [
     "Hitið ofninn í 200°C.",
     "Blandið saman kartöflukubbunum, paprikunni og ólífuolíunni í stóra skál og hrærið lauslega saman, svo að kartöflurnar og paprikan sé vel blaut.",
     "Bætið hvítlauknum við, stráið salti og pipar yfir allt saman og hrærið lítillega.",
     "Setjið í eldfast mót með bökunarpappír undir (ekkert lok), og bakið í 45 mín., eða þangað kartöflurnar eru tilbúnar."
    ]
   }
  ]
 },
 {
  "id": 438,
  "t": "Fljótlegur pönnukjúklingur",
  "fyrir": "5-7",
  "fugl": "kjuklingur",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "1 kg kjúklingakjöt, skorið í strimla",
     "2 laukar, niðurskornir",
     "2 msk. olífuolía",
     "3-4 hvítlauksrif, pressuð",
     "safi úr hálfri sítrónu",
     "½ bolli hvítvín eða kjúklingasoð",
     "1 dós maukaðir tómatar",
     "1 msk. oregano",
     "pipar eftir smekk"
    ],
    "adferd": [
     "Látið laukinn malla í olífuolíunni þangað til hann er glær.",
     "Bætið kjúklingnum út í og hristið pönnuna yfir miklum hita, þangað til hann hefur blandast vel saman við olíuna og laukinn.",
     "Bætið afganginum af hráefninu út í.",
     "Látið malla undir loki í 8-10 mín. Berið fram með hrísgrjónum eða núðlum."
    ]
   }
  ]
 },
 {
  "id": 482,
  "t": "Fyllt kalkúnalæri með sveppasósu",
  "fyrir": "3-4",
  "fugl": "kalkunn",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "750 g kalkúnalæri, úrbeinuð og skinnlaus",
     "1/3 bolli þurrkaðar apríkósur, skornar í bita",
     "2 msk. rúsínur, skornar í bita",
     "1 lítill hvítlauksgeiri, saxaður mjög smátt",
     "¼ bolli laukur, smátt saxaður",
     "½ bolli sellerí, smátt saxað",
     "2/3 bolli ristaðir brauðteningar"
    ],
    "adferd": [
     "Forhitið ofninn í 160°C.",
     "Setjið apríkósurnar og rúsínurnar í skál sem má fara í örbylgjuofn og hellið heitu vatni yfir.",
     "Setjið í örbylgjuofn á háan hita í u.þ.b. 1 ½ mínútu eða þangað til ávextirnir eru orðnir mjúkir.",
     "Takið út og látið vökvann leka vel af. Bætið út í hvítlauk, lauk, selleríi og brauðteningum.",
     "Setjið plastfilmu sem er búið að gata yfir skálina og látið aftur í örbylgjuofninn á háan hita í 1 ½ mínútu eða þangað til laukurinn og selleríð er orðið meyrt. Leggið til hliðar.",
     "Fletjið kalkúnalærin með því að setja smjörpappír ofan á og undir þau og berja (ekki fast) með fínni hliðinni á buffhamri, þangað til þau eru orðin u.þ.b. 2 cm á þykkt.",
     "Skiptið fyllingunni niður á lærin og brjótið þau saman (eins og samloku), bindið þau með rúllupylsugarni í einskonar rúllu og látið samskeytin snúa niður í steikingunni.",
     "Setjið í smurt eldfast mót og steikið í ofninum í 1 ½ til 1 ¾ klst. (Ef notaður er kjöthitamælir á hann að sýna 80°C hita þegar kjötið er fullsteikt.)"
    ]
   },
   {
    "h": "Rjómaleg sveppasósa",
    "efni": [
     "1 askja sveppir",
     "1 tsk. sósujafnari",
     "1/3 bolli kjúklingakraftur",
     "1 ½ tsk. sinnep",
     "1 ½ tsk. hunang",
     "1 tsk. sítrónusafi",
     "3 msk. majones (allt í lagi að nota kólesterólskert majones)"
    ],
    "adferd": [
     "Brúnið sveppina í smjöri.",
     "Hrærið saman í potti yfir meðalhita sósujafnara, kjúklingasoði, sinnepi, hunangi og sítrónusafa. Látið malla og hrærið þangað til sósan þykknar.",
     "Takið pottinn af hellunni og hrærið majonesinu í.",
     "Takið bandið af lærunum, skerið þau í bita og berið fram með sósunni, kartöflum eða hrísgrjónum og fersku salati."
    ]
   }
  ]
 },
 {
  "id": 424,
  "t": "Grillaðar kjúklingabringur á spjóti",
  "fyrir": "2",
  "fugl": "kjuklingur",
  "hopur": "grill",
  "h": [
   {
    "h": null,
    "efni": [
     "2 kjúklingabringur",
     "4-5 ananashringir",
     "2 bananar",
     "1 rauð paprika"
    ],
    "adferd": []
   },
   {
    "h": "Kryddlögur",
    "efni": [
     "2 hvítlauksrif",
     "2 tsk. engiferrót",
     "1 dl ananassafi",
     "2 msk. sojasósa",
     "2 msk. sérrí",
     "1 msk. sítrónusafi",
     "1 tsk. sinnep",
     "2 msk. ólífuolía",
     "3 msk. kryddedik"
    ],
    "adferd": [
     "Merjið hvítlauksrifin, rífið engiferrótina og blandið saman við ananassafa, sérrí, sojasósu, sítrónusafa, sinnep, ólífuolíu og kryddedik.",
     "Hamflettið kjúklingabringurnar og skerið í hæfilega bita.",
     "Hellið kryddleginum yfir bitana og látið bíða í kæli í 3-4 klst.",
     "Skerið ananas, banana og papriku í bita og þræðið til skiptis upp á grillspjót ásamt kjúklingabitunum.",
     "Penslið vel með kryddleginum. Grillið í 10-15 mín. á heitu grilli. Penslið með leginum á meðan og snúið nokkrum sinnum.",
     "Berið fram á salatblöðum með hrísgrjónum sem blönduð eru með smávegis af villigrjónum, ásamt brauði og sojasósu."
    ]
   }
  ]
 },
 {
  "id": 426,
  "t": "Grillaðar kjúklingabringur í snittubrauði",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "grill",
  "h": [
   {
    "h": null,
    "efni": [
     "4 hamflettar kjúklingabringur (600 g)"
    ],
    "adferd": []
   },
   {
    "h": "Kryddlögur",
    "efni": [
     "1/2 dl ólífuolía",
     "3 msk. ananassafi, ósykraður",
     "1 msk. engiferrót, rifin",
     "1 msk. sojasósa",
     "1 tsk. rósmarín, þurrkað",
     "1 tsk. nýmalaður pipar"
    ],
    "adferd": []
   },
   {
    "h": "Meðlæti",
    "efni": [
     "1 gróft snittubrauð",
     "1 salathöfuð",
     "1 rauðlaukur",
     "rauð og gul paprika",
     "6 msk. chillisósa"
    ],
    "adferd": [
     "Hrærið saman öllum hráefnunum í kryddlöginn.",
     "Raðið bringunum á fat og hellið kryddleginum yfir. Gott er að láta þær liggja þar í 2-3 klst. Snúið þeim nokkrum sinnum á meðan.",
     "Grillið bringurnar beggja megin á heitu grilli.",
     "Skerið rauf í brauðið og skerið síðan í fernt.",
     "Rífið salatið, skerið rauðlauk í hringi og setjið hvort tveggja ofan í raufarnar.",
     "Leggið bringurnar ofan á og skreytið með papriku.",
     "Berið fram með chillisósu."
    ]
   }
  ]
 },
 {
  "id": 488,
  "t": "Gullnir karríkalkúnaleggir",
  "fyrir": "5",
  "fugl": "kalkunn",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "1,5 kg kalkúnaleggir eða kalkúnavængir",
     "4 msk. smjör",
     "½ bolli hunang",
     "¼ bolli sinnep",
     "1 tsk. salt",
     "1 ½ tsk. karríduft"
    ],
    "adferd": [
     "Bræðið saman smjör, hunang, salt og karrí.",
     "Húðið kalkúninn upp úr blöndunni og raðið í eldfast mót eða ofnskúffu.",
     "Bakið í ofni við 190°C í 1 klst. eða þangað til kalkúnninn er eldaður í gegn og fallega brúnn. Snúið við á meðan á eldunartíma stendur.",
     "Berið fram með hrísgrjónum og grænu salati."
    ]
   }
  ]
 },
 {
  "id": 358,
  "t": "Hátíðasalat með aprikósusósu",
  "fyrir": "2-3",
  "fugl": "kjuklingur",
  "hopur": "salat",
  "h": [
   {
    "h": null,
    "efni": [
     "1 búnt salat (t.d. Lambhagasalat eða Rucola)",
     "1 greipaldin (rautt)",
     "400 g soðið kjúklinga- eða kalkúnakjöt",
     "1/2 dós niðursoðnar apríkósur"
    ],
    "adferd": [
     "Rífið salatið niður. Afhýðið greipaldin og skerið í bita.",
     "Skerið kjötið og apríkósurnar í strimla (haldið einni apríkósu eftir til að nota í sósuna)."
    ]
   },
   {
    "h": "Sósa",
    "efni": [
     "1 dós sýrður rjómi (10%)",
     "1 apríkósa, ásamt smávegis safa úr dósinni",
     "1 tsk.nýmalaður pipar",
     "1/2 tsk natríumskert salt",
     "2 msk. apríkósusulta"
    ],
    "adferd": [
     "Blandið smátt saxaðri apríkósu, safa og apríkósusultu út í hrærðan sýrða rjómann.",
     "Kryddið með salti og pipar og berið fram sér með salatinu.",
     "Berið fram með grófu brauði."
    ]
   }
  ]
 },
 {
  "id": 366,
  "t": "Hunangsvængir með sítrónusafa",
  "fyrir": "3-5",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "16 stk. kjúklingavængir",
     "1 ½ tsk. gróft salt",
     "safi úr u.þ.b. þremur sítrónum",
     "1-2 hvítlauksrif, pressuð",
     "90 g hunang"
    ],
    "adferd": [
     "Setjið vængina í smurt eldfast mót og stráið saltinu yfir.",
     "Eldið í ofni á 200°C í 30 mín.",
     "Hrærið saman hvítlauknum, sítrónusafanum og hunanginu þar til það hefur blandast vel saman.",
     "Hellið blöndunni yfir vængina og eldið í 20 mín. til viðbótar.",
     "Gott er að nota sítrónugras til skreytingar."
    ]
   }
  ]
 },
 {
  "id": 464,
  "t": "Indversk kalkúnasúpa",
  "fyrir": "3-4",
  "fugl": "kalkunn",
  "hopur": "salat",
  "h": [
   {
    "h": null,
    "efni": [
     "500 g eldað kalkúnakjöt",
     "1 laukur, smátt saxaður",
     "smjör eða olía til steikingar",
     "¼ krukka karrýmauk (Patakas mild curry paste eða 2/3 krukka Tikka Masala sósa frá Patakas)",
     "1-2 dósir niðursoðnir hakkaðir tómatar",
     "1 lítil dós tómatkraftur",
     "4-6 hvítlauksrif",
     "5 dl kjúklingasoð (vatn og 1 teningur)",
     "½ l rjómi eða matreiðslurjómi",
     "1 stór dós niðursoðnar ferskjur og safi",
     "gróft sjávarsalt"
    ],
    "adferd": [
     "Látið laukinn og karrýmaukið mýkjast saman í potti.",
     "Bætið hökkuðum tómötum við og látið malla í um 10 mín.",
     "Setjið kalkúnakjötið út í (steikið fyrst ef það er óeldað).",
     "Bætið ferskjum og ferskjusafa út í súpuna.",
     "Berið fram með góðu brauði."
    ]
   }
  ]
 },
 {
  "id": 1942,
  "t": "Indverskar Kalkúnabollur",
  "fyrir": "",
  "fugl": "kalkunn",
  "hopur": "hakk",
  "h": [
   {
    "h": null,
    "efni": [
     "600 g kalkúnahakk",
     "1 msk saxaður ferskur chilli",
     "2-3 stk hvítlauksgeirar",
     "1 dl sweet mangó",
     "1 tsk karry",
     "½ tsk salt",
     "½ tsk nýmalaður svartur pipar",
     "1 tsk Garam marsala",
     "1 dl brauðraspur"
    ],
    "adferd": [
     "Hrærið öllu saman og lagið litlar bollur c.a. 30 -35 stk bakið við 175°C í 15 – 20 mínútur berið fram með hrísgrjónum og salati"
    ]
   }
  ]
 },
 {
  "id": 410,
  "t": "Indverskur kjúklingaréttur",
  "fyrir": "6-8",
  "fugl": "kjuklingur",
  "hopur": "bitar",
  "h": [
   {
    "h": null,
    "efni": [
     "1 stór kjúklingur, hlutaður niður í bita",
     "1/2 tsk. salt",
     "1 tsk. chiliduft",
     "1/2 tsk. kardimommuduft",
     "1 tsk. negulduft",
     "1 tsk. kanill",
     "1 tsk. kúmínduft (cumin)",
     "125 g þurrkaðar apríkósur",
     "1 msk. matarolía",
     "1 stór laukur",
     "2 hvítlauksrif",
     "1 msk. engifer (ferskt)",
     "1 tómatur (stór)",
     "1 tsk. vínedik",
     "25 g möndlur",
     "25 g rúsínur",
     "1 grænn chilipipar (ferskur)"
    ],
    "adferd": [
     "Skerið kjúklinginn í bita og hamflettið. (Einnig má kaupa kjúklinginn í bitum).",
     "Blandið salti og öllu þurrkryddi saman, nuddið í kjúklingabitana og látið bíða í ísskáp í a.m.k. 1 klst.",
     "Sjóðið apríkósurnar í örlitlu vatni þar til þær eru orðnar mjúkar, a.m.k. 5 mín.",
     "Hitið olíuna á stórri pönnu, skerið laukinn í þunnar sneiðar (hringi) og mýkið í olíunni, rífið engifer, saxið hvítlauk og bætið út í.",
     "Bætið kjúklingabitunum út á pönnuna.",
     "Saxið tómata og bætið þeim við ásamt vínediki og örlitlu vatni.",
     "Látið réttinn malla undir loki í 30 mín. eða þar til kjötið er orðið meyrt.",
     "Afhýðið og saxið möndlurnar og ristið á þurri pönnu og bætið rúsínum saman við í augnablik.",
     "Hellið niðurskornum apríkósum, möndlum og rúsínum yfir réttinn.",
     "Skolið og fjarlægið kjarnann úr græna chilipiparnum og saxið yfir réttinn.",
     "Borið fram með hrísgrjónum."
    ]
   }
  ]
 },
 {
  "id": 334,
  "t": "Ísfuglssúpa",
  "fyrir": "6-8",
  "fugl": "kjuklingur",
  "hopur": "salat",
  "h": [
   {
    "h": null,
    "efni": [
     "4 steiktar kjúklingabringur",
     "2-4 msk. olía",
     "3 msk. karrý (t.d. De luxe frá Pottagöldrum)",
     "heill hvítlaukur",
     "1 blaðlaukur",
     "2 rauðar paprikur",
     "2 grænar paprikur",
     "1 dós tómatmauk",
     "1 askja hreinn rjómaostur (400 g)",
     "1 flaska Heinz chilisósa",
     "3-4 teningar kjúklinga-/grænmetiskraftur",
     "1 ½ lítri vatn",
     "1 peli rjómi",
     "salt",
     "pipar"
    ],
    "adferd": [
     "Grænmetið skorið og svissað á pönnu í olíu og karrýi.",
     "Öllu öðru bætt út í og smakkað til með salti og pipar.",
     "Hrært vel í á meðan suðan kemur upp.",
     "Kjúklingabringurnar skornar í hæfilega bita og settar út í."
    ]
   }
  ]
 },
 {
  "id": 386,
  "t": "Ítalíukjúklingur með skinku og osti",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "4 kjúklingabringur",
     "4 þunnar skinkusneiðar",
     "4 þunnar ostsneiðar",
     "4 blöð fersk salvía",
     "smjör eða matarolía til steikingar",
     "salt",
     "pipar",
     "1 dl kjúklingasoð (vatn + teningur)"
    ],
    "adferd": [
     "Takið skinnið af kjúklingabringunum. Ristið með hnífi ofan í hverja bringu og búið til einskonar vasa.",
     "Setjið eina ostsneið, eina skinkusneið og eitt ferskt salvíublað í hvern vasa.",
     "Þrýstið bringunni saman aftur og látið bíða í 30-40 mín.",
     "Hitið smjör eða olíu á pönnu og steikið bringurnar vel í 3-4 mín. á hvorri hlið.",
     "Kryddið með salti og pipar.",
     "Hellið kjúklingasoðinu yfir réttinn og hitið augnablik.",
     "Berið fram með soðnum hrísgrjónum og tómatasneiðum með sýrðum rjóma."
    ]
   }
  ]
 },
 {
  "id": 428,
  "t": "Ítalskir kjúklinga-Kabobs-pinnar",
  "fyrir": "2-3",
  "fugl": "kjuklingur",
  "hopur": "grill",
  "h": [
   {
    "h": null,
    "efni": [
     "500 g kjúklingabringur, niðurskornar",
     "½ bolli ítölsk salatdressing (köld sósa)",
     "¼ bolli fersk basillauf, niðurskorin",
     "1 meðalstór laukur, skorinn í báta",
     "1 meðalstór kúrbítur, skorinn í þykkar sneiðar",
     "2 meðalstórar rauðar paprikur, skornar í stóra bita"
    ],
    "adferd": [
     "Blandið saman köldu sósunni og basillaufunum í stóra skál.",
     "Skerið kjúklinginn í bita þannig að þeir passi á grillpinna og setjið í sósuna ásamt grænmetinu.",
     "Hrærið aðeins í og látið liggja í leginum í a.m.k. 30 mín., en ennþá betra er að marinera í ísskáp í 12 klst.",
     "Hitið grillið. Þræðið kjúklinginn og grænmetið á pinna.",
     "Grillið á meðalhita í 10-15 mín. og snúið reglulega þangað til pinnarnir eru tilbúnir."
    ]
   }
  ]
 },
 {
  "id": 1940,
  "t": "Ítölsk kalkúnabuff",
  "fyrir": "",
  "fugl": "kalkunn",
  "hopur": "hakk",
  "h": [
   {
    "h": null,
    "efni": [
     "600 g kalkúnahakk",
     "100 g rauðlaukur saxaður fínt",
     "1 egg",
     "½ tsk salt",
     "1 tsk svartur pipar grófmalaður",
     "1 tsk paprikuduft",
     "1 tsk basil",
     "60 g brauðraspur",
     "50 g rifinn ostur"
    ],
    "adferd": [
     "Hrærið saman kalkúnahakk, rauðlauk, osti, egg og kryddi. Bætið í brauðraspi. Lagið buff og brúnið í smjöri á pönnu bakið við 180°C í 15-20 mínútur eftir stærð buffana."
    ]
   }
  ]
 },
 {
  "id": 494,
  "t": "Kaldir BBQ kalkúnavængir",
  "fyrir": "2-3",
  "fugl": "kalkunn",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "1 kg kalkúnavængir, skornir í sundur",
     "1 dós (8 oz) tómatsósa",
     "1 dós (8 oz) ananashringir, geymið safann",
     "1 msk. púðursykur",
     "2 tsk. chiliduft",
     "¼ tsk. malað engifer",
     "¼ tsk. hvítlauksduft",
     "¼ tsk. pipar"
    ],
    "adferd": [
     "Raðið kalkúnavængjunum í smurða ofnskúffu eða eldfast mót.",
     "Steikið í ofni við 220°C í 20-25 mín. eða þangað til vængirnir eru orðnir ljósbrúnir.",
     "Lækkið hitann niður í 160°C.",
     "Blandið saman á meðalheitri pönnu tómatsósu, ananassafa, púðursykri, chilidufti, engifer, hvítlauksdufti og pipar. Hitið upp að suðu. Takið pönnuna af og hellið blöndunni yfir vængina í ofninum, passið að hún fari yfir þá alla.",
     "Setjið álpappír yfir mótið og eldið í 45-60 mín. (Gott er að stinga í vængina með gaffli til að finna hvort þeir eru tilbúnir. Gaffallinn á að renna auðveldlega inn í kjötið.)",
     "Takið álpappírinn af og bætið ananashringjunum ofan á. Bakið án álpappírs í 15 mín. í viðbót.",
     "Kælið vængina og berið þá fram kalda."
    ]
   }
  ]
 },
 {
  "id": 1944,
  "t": "Kalkúnaborgari",
  "fyrir": "",
  "fugl": "kalkunn",
  "hopur": "hakk",
  "h": [
   {
    "h": null,
    "efni": [
     "600 g kalkúnahakk",
     "100 g saxaður rauðlaukur",
     "2 msk tómatsósa",
     "1 tsk Worcestersósa",
     "1 tsk soyjasósa",
     "2 tsk paprikuduft",
     "2 hvítlauksgeirar",
     "1 dl brauðraspur",
     "Salt og pipar eftir smekk"
    ],
    "adferd": [
     "Hrærið öllu saman og búið til 8 stk borgara c.a. 100 g hvert. Brúnið á pönnu og setjið í ofn í 10-12 mínútur eða þar til borgararnir eru tilbúnir"
    ]
   }
  ]
 },
 {
  "id": 1640,
  "t": "Kalkúnabringa með ítalskri fyllingu",
  "fyrir": "6",
  "fugl": "kalkunn",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "1 stk kalkúnabringa 800g – 1000g",
     "50 g smjör til steikingar",
     "1 poki mozzarellakúlur litlar",
     "2 msk ferskt basil",
     "40 g pistasíur",
     "1 msk ferskt rosmaryn",
     "1 egg",
     "1 dl brauðraspur",
     "Salt og pipar"
    ],
    "adferd": []
   },
   {
    "h": "Fyllingin",
    "efni": [
     "Saxið mozzarellaostinn, pistasíuhneturnar, basil og rosmaryn. Blandið saman við brauðraspi og eggi, kryddið með salti og pipar"
    ],
    "adferd": [
     "Skerið vasa í kantinn á bringunni skerið frá mjórri endanum. Setjið fyllinguna í vasann. Brúnið bringuna á pönnu í smjöri og kryddið með salti og pipar. Bakið við 150°C í 50-60 mínútur eða þar til kalkúnabringan er gegnelduð.",
     "Berið fram með salati með steiktu grænmeti."
    ]
   }
  ]
 },
 {
  "id": 478,
  "t": "Kalkúnabringur með kryddgrjónum",
  "fyrir": "3-4",
  "fugl": "kalkunn",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "700-800 g kalkúnabringa",
     "150 g rauðlaukur",
     "2 msk. ólífuolía",
     "3 1/2 dl hrísgrjón",
     "3 tsk. karrí",
     "7 1/2 dl kjúklingasoð",
     "200 g fennikel",
     "1 stór banani",
     "1 stórt rautt epli",
     "4 msk. Mango Chutney sósa",
     "1 msk. sítrónusafi",
     "1 tsk. salt",
     "1 tsk. malaður pipar",
     "2 msk. kókosmjöl"
    ],
    "adferd": [
     "Afhýðið lauk og skerið í báta. Hitið olíu í potti og mýkið laukinn í smástund.",
     "Hrærið karríi og hrísgrjónum saman við og blandið vel.",
     "Bætið kjúklingasoðinu út í og sjóðið í 15 mín.",
     "Takið grjónin af hellunni og látið standa í smástund.",
     "Hreinsið fennikel, afhýðið banana og epli og skerið í teninga.",
     "Hrærið sítrónusafa út í Mango Chutney og blandið saman við teningana.",
     "Hitið ofninn í 200°C.",
     "Snöggsteikið kalkúnabringurnar á teflonpönnu í 5 mín. á hvorri hlið. Setjið í eldfast mót og bakið í 25 mín. (fer þó aðeins eftir þykkt bringu).",
     "Steikið teningana á sömu pönnu og hellið grjónunum saman við. Kryddið með salti og pipar.",
     "Setjið grjónin á fat, skerið bringurnar í sneiðar og raðið ofan á.",
     "Ristið kókosmjölið lítið eitt á þurri pönnu og stráið yfir réttinn."
    ]
   }
  ]
 },
 {
  "id": 1946,
  "t": "Kalkúnalasagne",
  "fyrir": "",
  "fugl": "kalkunn",
  "hopur": "hakk",
  "h": [
   {
    "h": null,
    "efni": [
     "750 g kalkúnahakk",
     "100 g laukur saxaður",
     "2-3 hvítlauksgeirar saxaðir",
     "2 msk olífuolía",
     "1 tsk salt",
     "1 tsk svartur pipar malaður",
     "1 msk oregano",
     "1 msk steinselja",
     "2 msk saxað ferskt rosmaryn",
     "2 dl Rjómi",
     "4 dl pizzasósa",
     "500 g kotasæla",
     "300 g rifinn ostur"
    ],
    "adferd": [
     "Brúnið laukinn og hvítlaukinn á pönnu bætið við salti, svörtum pipar, oregano, steinselju og fersku rosmaryn. Setjið kalkúnahakkið saman við og brúnið gætið að hræra vel í á meðan. Bætið í rjómanum og sjóðið vel. Bætið loks í pizzasósunni. Látið malla í 2-3 mínútur. Setjið 1/2 af kotasælunni í botninn á eldföstu móti þar setjið þið lasagneplötur, ofan á það setjið hakkblöndu, næst ost endurtakið tvisvar sömu röðun endið á hakkblöndu og osti. Bakið við 175°C í 40 mínútur."
    ]
   }
  ]
 },
 {
  "id": 484,
  "t": "Kalkúnalæri með spaghetti að ítölskum hætti",
  "fyrir": "3-4",
  "fugl": "kalkunn",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "750 g kalkúnalæri, skorin í u.þ.b. 1 ½ cm þykka strimla (úrbeinið og takið skinnið af fyrst)",
     "1 msk. grænmetisolía",
     "1 msk. rauðvínsedik",
     "1 stór hvítlauksgeiri, saxaður mjög smátt",
     "1 tsk. Italian seasoning krydd",
     "¼ tsk. salt",
     "¼ tsk. pipar",
     "1 bolli græn stór paprika, brytjuð niður",
     "2/3 bolli laukur, skorinn í sneiðar",
     "½ bolly kirsuberjatómatar, skornir í fernt",
     "4 bollar soðið spaghetti, skorið í bita"
    ],
    "adferd": [
     "Blandið saman í skál olíu, ediki, hvítlauk, ítölsku kryddi, salti og pipar.",
     "Setjið kalkúninn út í blönduna og látið marinerast í ísskáp í nokkra klukkutíma.",
     "Hitið pönnu á meðalhita, setjið kjötblönduna á pönnuna og látið malla í 6 mín., eða þangað til kjötið hefur brúnast aðeins.",
     "Hrærið papriku og lauk saman við.",
     "Lækkið hitann aðeins, setjið lokið á pönnuna og látið malla í 1 mín.",
     "Bætið tómötunum út í og látið malla í aðra mínútu.",
     "Hellið yfir spaghettiið og berið fram með snittubrauði."
    ]
   }
  ]
 },
 {
  "id": 468,
  "t": "Kalkúnasalat með avókadó og hnetum",
  "fyrir": "3-5",
  "fugl": "kalkunn",
  "hopur": "salat",
  "h": [
   {
    "h": null,
    "efni": [
     "½ poki klettasalat",
     "½ poki spínat",
     "1-2 stk. avókadó (skorið í bita)",
     "500 g eldað kalkúnakjöt",
     "50 g ristaðar hnetur",
     "2 msk. raspaður parmesanostur",
     "raspaður börkur af hálfri sítrónu"
    ],
    "adferd": [
     "Salatið sett í gott fat.",
     "Avókadó og kalkúnakjöt sett yfir.",
     "Hnetum, osti og berki stráð yfir.",
     "Salatsósu hellt yfir."
    ]
   },
   {
    "h": "Salatsósa",
    "efni": [
     "safi úr 1 sítrónu",
     "½ dl olífuolía (eða sítrónuolía)",
     "1/3 dl hunang"
    ],
    "adferd": [
     "Allt pískað vel saman og hellt yfir salatið."
    ]
   }
  ]
 },
 {
  "id": 1948,
  "t": "Kalkúnasalsaborgari",
  "fyrir": "",
  "fugl": "kalkunn",
  "hopur": "hakk",
  "h": [
   {
    "h": null,
    "efni": [
     "600 g kalkúnahakk",
     "½ tsk salt",
     "1 tsk svartur pipar grófmalaður",
     "1 tsk paprikuduft",
     "1 tsk laukduft",
     "2 dl salsasósa mild",
     "2 dl brauðraspur"
    ],
    "adferd": [
     "Hrærið saman kalkúnahakk, kryddi og salsasósu. Bætið í brauðraspi. Lagið borgara og brúnið í smjöri á pönnu bakið við 175°C í 10-12 mínútur eftir stærð borgarana eða þar til borgarinn er gegneldaður. Setjið á hamborgarabrauð með avacado og salati"
    ]
   }
  ]
 },
 {
  "id": 1950,
  "t": "Kalkúnaspjót með chilli og engifer",
  "fyrir": "",
  "fugl": "kalkunn",
  "hopur": "hakk",
  "h": [
   {
    "h": null,
    "efni": [
     "600 g kalkúnahakk",
     "2 msk saxaður ferskur koriander",
     "1 msk saxaður ferskur chilli",
     "1 msk saxaður ferskur engifer",
     "½ tsk salt",
     "½ tsk svartur pipar grófmalaður",
     "½ tsk cumin",
     "½ tsk korianderduft",
     "2-3 dl brauðraspur"
    ],
    "adferd": [
     "Hrærið öllu saman og setjið á spjót c.a 20 spjót (einning er hægt að laga bollur c.a. 35 stk) bakið við 175°C í 20-25 mínútur eða þar til spjótin (bollurnar) eru gegneldaðar."
    ]
   }
  ]
 },
 {
  "id": 1643,
  "t": "Kalkúnastrimlar í mango og salthnetum",
  "fyrir": "4",
  "fugl": "kalkunn",
  "hopur": "bitar",
  "h": [
   {
    "h": null,
    "efni": [
     "200 g mild mango chutney",
     "1 dl Teriyaki sósa",
     "200 g laukur",
     "100 g spínat",
     "1 stk epli",
     "1 stk rauður chilli",
     "100 g ristaðar Cashewhnetur"
    ],
    "adferd": [
     "Skerið kalkúnin í strimla og blandið með restinni af hráefninu. Bakið við 150°C í 30 – 40 mínútur eða þar til kalkúnninnn er eldaður.",
     "Berið fram með hrísgrjónum og nanbrauði."
    ]
   }
  ]
 },
 {
  "id": 462,
  "t": "Kalkúnasúpa Louisu",
  "fyrir": "6-8",
  "fugl": "kalkunn",
  "hopur": "salat",
  "h": [
   {
    "h": null,
    "efni": [
     "3-4 msk. olía",
     "1,5 tsk. karrý",
     "1 heill hvítlaukur, pressaður eða saxaður",
     "1 blaðlaukur, niðursneiddur",
     "3 stk. paprika, gul og rauð",
     "1 askja hreinn rjómaostur",
     "1 flaska Heinz Hot Chilli sósa",
     "¾ teningur kjúklinga- eða grænmetiskraftur",
     "1,5 l vatn",
     "1 peli rjómi",
     "500 g eldað kalkúnakjöt í bitum"
    ],
    "adferd": [
     "Blaðlaukur og hvítlaukur steiktur í olíunni með karrýi.",
     "Mixað í blandara eða með töfrasprota.",
     "Rjómaostur, chillisósa, kraftur, vatn og rjómi soðið saman, ásamt lauk- og karrýblöndunni.",
     "Kalkúnakjötið sett síðast út í súpuna og hitað í gegn."
    ]
   }
  ]
 },
 {
  "id": 490,
  "t": "Kalkúnatrommukjuðar með heimagerðri Pico de Gallo salsasósu",
  "fyrir": "4",
  "fugl": "kalkunn",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "1250 g kalkúnaleggir",
     "8 ferskir maísstönglar, skipt í tvennt",
     "2 msk. malaður kóríander",
     "1 tsk. svartur pipar",
     "¾ tsk. salt"
    ],
    "adferd": [
     "Stráið kóríander, pipar og salti yfir kalkúninn og maísinn.",
     "Grillið kalkúnaleggina, þeir þurfa u.þ.b. 60 mín., 30 mín. á hvorri hlið. (Ef þið stingið kjöthitamæli í kjötið á það að vera 80° þar sem það er þykkast.)",
     "Þegar hálfnað er að grilla leggina, setjið maísinn á grillið og grillið í 30 mín."
    ]
   },
   {
    "h": "Picode Gallo salsasósa",
    "efni": [
     "3 þroskaðir tómatar, saxaðir",
     "½ bolli rauðlaukur, saxaður",
     "2 msk. jalapeno pipar, fræhreinsaður, saxaður smátt",
     "2 msk. ferskur sítrónusafi",
     "1 msk. ólífuolía"
    ],
    "adferd": [
     "Öllu hrært saman í skál og sósan látin standa í 20-30 mín. áður en hún er borin fram með kalkúninum og maísnum."
    ]
   }
  ]
 },
 {
  "id": 470,
  "t": "Kalkúnn með sveppafyllingu",
  "fyrir": "8",
  "fugl": "kalkunn",
  "hopur": "heill",
  "h": [
   {
    "h": null,
    "efni": [
     "4 1/2 kg heill kalkúnn",
     "4-5 feitar beikonsneiðar",
     "1/2 sítróna",
     "salt",
     "brætt smjör"
    ],
    "adferd": []
   },
   {
    "h": "Fylling",
    "efni": [
     "2-3 dl franskbrauð",
     "1 dl sérrí eða portvín",
     "innyfli úr kalkún (lifur, hjarta og fóarn)",
     "400 g niðursoðnir sveppir",
     "1 dl fersk steinselja",
     "salt og pipar"
    ],
    "adferd": [
     "Setjið brauðið í bleyti í sérrí eða portvín.",
     "Hakkið innyflin í matvinnsluvél, setjið sveppi, steinselju og brauð í kvörnina og hakkið saman. Kryddið með salti og pipar.",
     "Hreinsið og þerrið kalkúninn. Troðið fyllingunni inn í hann og saumið fyrir opið eða lokið með trépinnum.",
     "Nuddið kalkúninn vel að utan með sítrónu og salti.",
     "Leggið beikonsneiðar yfir bringuna og pakkið kalkúninum inn í álpappír. Steikið í ofni við 250°C í 2 klst.",
     "Takið álpappírinn og beikonsneiðarnar af.",
     "Penslið kalkúninn með bræddu smjöri.",
     "Steikið áfram í 20 mín. eða þar til kalkúnninn er fallega brúnn."
    ]
   },
   {
    "h": "Sósa",
    "efni": [
     "soð af kalkúninum",
     "sveppasoð",
     "vatn",
     "2-3 kjúklingateningar",
     "1/2 dl sérrí eða portvín",
     "hveiti",
     "rjómi"
    ],
    "adferd": [
     "Hellið kalkúnasoðinu í pott ásamt sveppasoði og vatni.",
     "Kryddið með kjúklingateningum og sérríi eða portvíni.",
     "Þykkið sósuna með hveitijafningi (hveiti og vatni) eða sósujafnara.",
     "Hellið rjóma út í og hitið (sjóðið ekki).",
     "Borið fram með brúnuðum kartöflum og Waldorfsalati."
    ]
   }
  ]
 },
 {
  "id": 496,
  "t": "Kalkúnn og hrísgrjón á ferð og flugi",
  "fyrir": "2",
  "fugl": "kalkunn",
  "hopur": "bitar",
  "h": [
   {
    "h": null,
    "efni": [
     "1 bolli eldaður kalkúnn, skorinn í bita",
     "2 2/3 bolli vatn",
     "1 dós (10,5 oz) sveppasúpa",
     "3 bollar hrísgrjón, ósoðin",
     "1 bolli sellerí, skorið þunnt",
     "1 tsk. salt"
    ],
    "adferd": [
     "Setjið allt saman á pönnu. Látið sjóða og hrærið stöðugt í á meðan.",
     "Lækkið hitann, setjið lokið á og látið malla í 5-10 mín. eða þangað til allur vökvinn er farinn af og grjónin eru orðin mjúk.",
     "Hrærið aðeins í áður en borið er fram."
    ]
   }
  ]
 },
 {
  "id": 498,
  "t": "Kanilkalkúnn með sítrónukeim",
  "fyrir": "3-4",
  "fugl": "kalkunn",
  "hopur": "bitar",
  "h": [
   {
    "h": null,
    "efni": [
     "500 g kalkúnakjöt, skorið í u.þ.b. 2,5 cm þykka bita",
     "6 msk. ólífuolía",
     "3 miðlungsstórir laukar, saxaðir",
     "2 hvítlauksgeirar, saxaðir smátt",
     "2/3 bolli tómatamauk úr dós, látið vökvann leka af því",
     "3 msk. tómatpúrra",
     "2 lengjur af ferskum kanil, brotnar í helminga",
     "2 miðlungsstórar sítrónur, skornar niður með hýðinu á",
     "1 ½ tsk. oregano",
     "1/8 tsk. allrahanda",
     "3 bollar kalkúnasoð (notið kalkúnakraft eða jafnvel kjúklingakraft)",
     "½ bolli hveiti",
     "salt og pipar eftir smekk",
     "½ rifinn parmesanostur"
    ],
    "adferd": [
     "Setjið 3 msk. af ólífuolíunni í pott og látið laukinn malla þangað til hann verður léttbrúnn. Bætið hvítlauknum við og látið malla í 1 mín. í viðbót.",
     "Lækkið hitann og bætið við tómötum, tómatpúrru, kanil, sítrónum, oregano og allrahanda. Látið malla á lágum hita í 5 mín. Bætið kalkúnasoðinu út í og látið malla við lágan hita undir loki í 75 mínútur.",
     "Á meðan sósan mallar: Hitið olífuolíuna sem er eftir (3 msk.) á pönnu við háan hita. Veltið kalkúnabitunum upp úr hveiti, hristið af það hveiti sem ekki loðir við og snöggsteikið þangað til kalkúnninn er brúnaður, passið að ofelda hann ekki. (Ef kalkúnabitarnir eru ofsteiktir vilja þeir trosna og fara í sundur þegar þeir eru búnir að malla og eru settir saman við sósuna.)",
     "Takið af hitanum og setjið til hliðar.",
     "Bætið kalkúninum í sósuna þegar hún er tilbúin og látið malla án loks í 15 mín.",
     "Kryddið eftir smekk.",
     "Takið kanilstangirnar og sítrónubitana upp úr.",
     "Berið fram með uppáhaldspastanu ykkar og dreifið parmesan yfir."
    ]
   }
  ]
 },
 {
  "id": 472,
  "t": "Kínverskur kalkúnn",
  "fyrir": "8-10",
  "fugl": "kalkunn",
  "hopur": "heill",
  "h": [
   {
    "h": null,
    "efni": [
     "1 heill kalkúnn (4-5 kg), skorinn í bita",
     "10 bollar vatn",
     "3 bollar sojasósa",
     "1 bolli sérrí eða sítrónugos (t.d. Fanta lemon)",
     "6 sneiðar ferskt engifer (hver sneið u.þ.b. 1,5 cm á þykkt)",
     "4 laukar, skornir í stóra bita",
     "2 msk. sykur",
     "1 ½ tsk. salt",
     "½ tsk. svartur pipar",
     "1 msk. ólífuolía"
    ],
    "adferd": [
     "Vatn, sojasósa, sérrí, engifer, laukur, sykur, salt og pipar sett saman í stóran pott yfir háum hita og suðan látin koma upp.",
     "Setjið kalkúnabitana ofan í sósuna og látið suðuna koma aftur upp.",
     "Lækkið hitann og látið malla í 30 mín.",
     "Takið upp úr pottinum og setjið í ofnskúffu eða eldfast mót, bakið í ofni við 175°C í 1 klst.",
     "Ausið soðinu yfir bitana á tíu mín. fresti á meðan á steikingu stendur.",
     "Hækkið hitann í 220°C, penslið bitana með matarolíunni og steikið í 5-10 mín. eða þangað til bitarnir eru orðnir vel brúnir.",
     "Takið kjötið af beinunum og berið kalkúninn fram.",
     "Þessi réttur er góður kaldur jafnt sem heitur."
    ]
   }
  ]
 },
 {
  "id": 446,
  "t": "Kjúklinga- eða kalkúnabollur",
  "fyrir": "3-4",
  "fugl": "kjuklingur",
  "hopur": "hakk",
  "h": [
   {
    "h": null,
    "efni": [
     "400-500 g kjúklinga- eða kalkúnahakk",
     "1 laukur",
     "2-3 gulrætur",
     "salt og pipar",
     "½ dl vatn",
     "1 egg"
    ],
    "adferd": [
     "Laukurinn er hakkaður og gulræturnar rifnar og þessu hrært saman við hakkið.",
     "Salt og pipar sett saman við og vatni hellt út í til að auðvelda mótun.",
     "Mótið hakkið í bollur og setjið á eldfast fat og síðan í ofninn í 20-30 mín. við 160°C. Einnig má steikja á pönnu í smjöri eða olíu."
    ]
   }
  ]
 },
 {
  "id": 388,
  "t": "Kjúklingabringur á núðlu- og ávaxtabeði",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "4 kjúklingabringur",
     "1 laukur",
     "2 hvítlauksrif",
     "1 sellerístöngull",
     "1 gulrót",
     "1 msk. matarolía",
     "1 1/2 dl kjúklingasoð",
     "2 tsk. sítrónusafi",
     "2 msk. hvítvín (eða mysa)",
     "1 tsk. nýmalaður pipar",
     "1 tsk. maizenamjöl",
     "2 ferskjur",
     "250 g eggjanúðlur"
    ],
    "adferd": [
     "Saxið lauk og pressið hvítlauk. Skerið sellerístöngulinn í bita og gulrótina í strimla. Hitið olíu á pönnu og steikið grænmetið í 3 mín. Takið af pönnunni.",
     "Hitið olíu á pönnu og steikið bringurnar í 3-4 mín. á hvorri hlið eða þar til þær eru farnar að brúnast. Takið af pönnunni og blandið saman við grænmetið.",
     "Sjóðið saman kjúklingasoð, sítrónusafa, hvítvín/mysu og pipar ásamt maizenamjöli þar til það þykknar. Hrærið vel í á meðan.",
     "Setjið nú bringurnar ásamt grænmetinu aftur á pönnuna. Skerið ferskjurnar í litla bita og raðið ofan á. Hellið sósunni yfir. Setjið lok eða álpappír yfir og hitið í 3-4 mín. Sjóðið eggjanúðlur samkvæmt leiðbeiningum á pakka."
    ]
   }
  ]
 },
 {
  "id": 432,
  "t": "Kjúklingabringur með bragðsterkri sósu",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "grill",
  "h": [
   {
    "h": null,
    "efni": [
     "4 kjúklingabringur",
     "1 laukur",
     "3 hvítlauksrif",
     "1/2 rauður chilipipar",
     "1/2 dl jalapenopipar, niðursoðinn",
     "40 g ljósar rúsínur",
     "1 tsk. allrahanda",
     "30 g suðusúkkulaði",
     "1 msk. sesamfræ",
     "1 msk. olía",
     "50 g möndlur, afhýddar",
     "30 g hnetusmjör",
     "1 dós tómatkraftur (lítil)",
     "2 1/2 dl kjúklingasoð",
     "1 tsk. nýmalaður pipar",
     "2 msk. ferskt kóríander",
     "2 1/2 dl hrísgrjón",
     "1 kúrbítur"
    ],
    "adferd": [
     "Hitið grillið í ofninum.",
     "Pressið hvítlauk og saxið lauk. Fræhreinsið chilipipar og saxið smátt.",
     "Brjótið súkkulaðið í litla bita.",
     "Ristið sesamfræin á pönnu.",
     "Grillið kjúklingabringurnar í heitum ofni í 20-30 mín.",
     "Hitið olíu á pönnu og mýkið lauk og hvítlauk á meðalhita.",
     "Bætið chilipipar og rúsínum saman við og steikið í 2 mín.",
     "Bætið möndlum og hnetusmjöri saman við og steikið áfram í 2 mín.",
     "Setjið allt í matvinnsluvél og búið til mauk. Síðan er maukið aftur sett á pönnuna.",
     "Tómatkrafti og kjúklingasoði bætt saman við ásamt allrahanda.",
     "Látið suðuna koma upp og leyfið sósunni að malla við lágan hita.",
     "Bætið súkkulaðinu saman við sósuna, látið bráðna við vægan hita eða bræðið það í örbylgjuofni og blandið vel saman við sósuna.",
     "Dreifið sósunni yfir bringurnar með skeið.",
     "Stráið sesamfræjum og fersku kóríander yfir réttinn.",
     "Berið fram með soðnum hrísgrjónum og steiktum eða grilluðum kúrbítssneiðum."
    ]
   }
  ]
 },
 {
  "id": 430,
  "t": "Kjúklingabringur með kartöflusalati og ávöxtum",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "grill",
  "h": [
   {
    "h": null,
    "efni": [
     "4 kjúklingabringur",
     "1 msk. sojasósa",
     "1 msk. ólífuolía"
    ],
    "adferd": [
     "Blandið saman ólífuolíu og sojasósu og penslið kjúklingabringurnar.",
     "Látið bíða á meðan kartöflusalatið er búið til.",
     "Grillið kjúklingabringurnar í 5-8 mín. á hvorri hlið á heitu grilli. Penslið með sojaolíunni.",
     "Berið grillaðar kjúklingabringurnar fram með kældu kartöflusalatinu, grófu brauði og fersku salati.",
     "Kartöflusalat",
     "600 g kartöflur, soðnar og kældar)",
     "1 dós ananas (lítil)",
     "100 g sýrður rjómi (10%)",
     "2 tsk. karrý",
     "1/2 tsk. natríumskert salt",
     "1 tsk. nýmalaður pipar",
     "100 g blá vínber",
     "2 sneiðar rauð paprika",
     "Hrærið saman sýrðan rjóma, karrý, salt og pipar og 1-2 msk. af",
     "ananassafa.",
     "Skerið kartöflurnar í teninga og hrærið út í ásamt ananas",
     "í teningum.",
     "Raðið ananassneiðum, paprikusneiðum og vínberjum ofan á",
     "og til hliðar.",
     "Kælið í ísskáp."
    ]
   }
  ]
 },
 {
  "id": 390,
  "t": "Kjúklingabringur Orvieto",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "4 kjúklingabringur",
     "1 heill hvítlaukur",
     "100 g steinlausar svartar ólífur",
     "2 stk. fennel",
     "2 stórar bökunarkartöflur",
     "50 g kjúklingalifur"
    ],
    "adferd": [
     "Hvítlaukurinn tekinn í sundur og soðinn þar til hann er mjúkur.",
     "Kartöflurnar skornar í stóra teninga, soðnar og síðan látnar kólna.",
     "Skerið fennelið gróft og setjið á álpappír. Kryddið með salti, pipar og ólífuolíu. Bakið í ofni í 20 mín. við 200°C.",
     "Því næst er kjúklingalifrin steikt í olíu, kartöflum, ólífum, hvítlauk og fennel bætt saman við og allt þetta steikt saman í 5 mín.",
     "Að lokum eru kjúklingabringurnar steiktar og settar á diska.",
     "Bætið meðlætinu ofan á og berið fram."
    ]
   }
  ]
 },
 {
  "id": 434,
  "t": "Kjúklingakebab með bökuðum kartöflum",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "grill",
  "h": [
   {
    "h": null,
    "efni": [
     "400 g bein- og skinnlausar kjúklingabringur",
     "1 rauð paprika",
     "1 græn paprika",
     "1 rauðlaukur",
     "200 g niðursoðnir tómatar",
     "1 tsk. þurrkað óreganó",
     "1/2 tsk. þurrkað rósmarín",
     "1/2 tsk. svartur pipar",
     "1/2 tsk. jurtasalt",
     "1 tsk. appelsínubörkur",
     "1/2 tsk. kanill",
     "4 bökunarkartöflur",
     "4 msk. sýrður rjómi (10%)",
     "ferskar kryddjurtir"
    ],
    "adferd": [
     "Byrjið á að baka kartöflurnar. Þær bakast eða grillast á um 1 klst.",
     "Skerið kjúklingabringurnar í ferninga.",
     "Skolið og hreinsið kjarna úr paprikum og skerið í ferninga. Skerið rauðlauk í ferninga.",
     "Hitið tómata í potti með óreganó, rósmarín, pipar, jurtasalti, appelsínuberki og kanil.",
     "Þræðið til skiptis á grillspjót kjöt, papriku, lauk og sveppi.",
     "Penslið vel með tómatsósunni og grillið í 10 mín. Penslið af og til með sósunni á meðan grillað er. Gætið þess að grilla kjúklingakjötið þannig að það sé gegnumsteikt.",
     "Hrærið fersku kryddjurtirnar saman við sýrða rjómann og setjið út í",
     "bökunarkartöflurnar."
    ]
   }
  ]
 },
 {
  "id": 442,
  "t": "Kjúklingalasagne",
  "fyrir": "4-6",
  "fugl": "kjuklingur",
  "hopur": "hakk",
  "h": [
   {
    "h": null,
    "efni": [
     "250 g kjúklingahakk",
     "3 msk. smjör eða olía",
     "120 g sveppir í sneiðum",
     "½ bolli saxaður laukur (einn stór)",
     "2 dósir rjómasveppasúpa",
     "1 ½ dl mjólk",
     "400 g kotasæla",
     "225 g lasagneplötur (mega vera grænar)",
     "ca 400 g rifinn ostur",
     "125 g (1-1 ½ dl) rifinn Parmesanostur"
    ],
    "adferd": [
     "Blandið saman rifna ostinum og parmesanostinum.",
     "Setjið smjörið eða olíuna á pönnu og steikið sveppina og laukinn, bætið kjúklingahakkinu á pönnuna og látið krauma. Blandið sveppasúpunni, mjólkinni og kotasælunni saman í skál, bætið þessu svo á pönnuna og hrærið saman.",
     "Smyrjið eldfast fat (stærð ca 23&#215;33 cm), setjið eitt lag af lasagneplötum í fatið, hyljið með 1/3 af sveppablöndunni, síðan með 1/3 ostablöndunni og endurtakið tvisvar. Setjið þykkt lag af osti yfir allt saman.",
     "Bakið í 45 mín. við 160-180°C."
    ]
   }
  ]
 },
 {
  "id": 412,
  "t": "Kjúklingaleggir með kartöfluflögum",
  "fyrir": "3-4",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "8-10 stk. kjúklingaleggir",
     "5 dl paprikukartöfluflögur, muldar",
     "ferskur parmesanostur, rifinn",
     "pipar",
     "salt",
     "4 msk. pestó",
     "2 msk. olía"
    ],
    "adferd": [
     "Hitið ofninn í 200°C.",
     "Myljið flögurnar smátt og blandið parmesanostinum saman við.",
     "Þerrið kjúklingaleggina og kryddið þá með salti og pipar.",
     "Blandið saman olíunni og pestósósunni og veltið leggjunum upp úr blöndunni. Veltið þeim síðan upp úr muldu flögunum og þrýstið þeim vel að leggjunum.",
     "Raðið leggjunum í eldfast fat og dreifið afganginum af flögunum yfir.",
     "Bakið í ofninum í 35 mín. eða þar til leggirnir eru gegnsteiktir.",
     "Gott er að bera leggina fram með fersku salati og steiktum kartöflubátum."
    ]
   }
  ]
 },
 {
  "id": 372,
  "t": "Kjúklingaleggir með sojaídýfu",
  "fyrir": "",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "10 stk. kjúklingaleggir",
     "2 msk. engiferrót",
     "2 msk. sesamolía",
     "1 tsk. cumin",
     "2 tsk. garam masala eða karríduft",
     "1/8 tsk. cayennepipar",
     "2 msk. sesamfræ"
    ],
    "adferd": [
     "Rífið engiferrót. Blandið saman sojasósu, engifer, sesamolíu, cumin, garam masala, cayennepipar og sesamfræum.",
     "Penslið kjúklingaleggina með kryddleginum og látið marinerast í a.m.k. 30 mínútur.",
     "Hitið ofninn í 200°C. Klæðið ofnplötuna með bökunarpappír og leggið kjúklingaleggina þar á.",
     "Bakið í miðjum ofninum í 20-25 mín. eða þar til þeir eru gegnumeldaðir og stökkir.",
     "Snúið leggjunum af og til á meðan á eldun stendur og penslið með marineringunni.",
     "Sojaídýfa",
     "4 msk. sojasósa (japönsk)",
     "2 tsk. límónusafi",
     "2 msk. ólífuolía",
     "1 rauður chilipipar",
     "2 msk. kóríander",
     "Kjarnhreinsið chilipipar og skerið í þunna hringi.",
     "Fínsaxið kóríander.",
     "Blandið saman við sojasósu, ólífuolíu og límónusafa.",
     "Berið leggina fram með sojaídýfunni."
    ]
   }
  ]
 },
 {
  "id": 414,
  "t": "Kjúklingalæri með ostrusoja og engifer á linsubaunum",
  "fyrir": "4-5",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "8 stk. kjúklingalæri",
     "salt og pipar",
     "1 ½ dl ostrusojasósa",
     "1 msk. engifer, smátt saxað",
     "2 hvítlauksgeirar, pressaðir",
     "2 msk. edik",
     "1 msk. hunang",
     "400 g soðnar linsubaunir"
    ],
    "adferd": [
     "Kryddið kjúklingalærin með salti og pipar og bakið í 180°C heitum ofni í 25 mín.",
     "Blandið saman ostrusojasósu, engifer, hvítlauk, ediki og hunangi í skál og skiptið í þrennt.",
     "Penslið lærin með 1/3 af sósunni og bakið í 5 mín. í viðbót.",
     "Setjið linsubaunirnar í pott, blandið 1/3 af sósunni saman við og hitið.",
     "Berið kjúklinginn fram með linsubaununum og blönduðu salati.",
     "Berið afganginn af sósunni fram með kjúklingnum."
    ]
   }
  ]
 },
 {
  "id": 376,
  "t": "Kjúklingaréttur Campbells",
  "fyrir": "6-8",
  "fugl": "kjuklingur",
  "hopur": "heill",
  "h": [
   {
    "h": null,
    "efni": [
     "1 heill kjúklingur",
     "1 dós Campbell´s Cream Chicken Soup",
     "ca 2 tsk. karrý",
     "kjúklingakrydd",
     "1/2 dl rjómi",
     "örlítið af sýrðum rjóma",
     "rifinn ostur"
    ],
    "adferd": [
     "Kjúklingurinn kryddaður lítillega með kjúklingakryddi og grillaður.",
     "Síðan er súpan þynnt með rjóma þannig að úr verður sósa. Hún er krydduð með karrýi og svolitlu kjúklingakryddi og sýrða rjómanum blandað saman við.",
     "Kjötið skorið af kjúklingnum, sett saman við sósuna og allt sett í smurt eldfast mót. Rifnum osti stráð yfir og bakað við 180°C í um 20 mín. eða þar til osturinn er vel bráðinn.",
     "Borið fram með hrísgrjónum, salati og brauði."
    ]
   }
  ]
 },
 {
  "id": 392,
  "t": "Kjúklingaréttur með grænu pestói",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "600 g kjúklingabringur",
     "150 g grænt pestó (1 krukka)",
     "150 g fetaostur",
     "3 tómatar"
    ],
    "adferd": [
     "Leggið kjúklingabringurnar í eldfast mót og smyrjið pestóinu yfir.",
     "Dreifið fetaostinum yfir (ekki nota olíuna í krukkunni).",
     "Skerið tómatana í sneiðar og leggið yfir.",
     "Bakið í ofni við 180°C í 40 mín."
    ]
   }
  ]
 },
 {
  "id": 368,
  "t": "Kjúklingavængir með Miðjarðarhafsblæ",
  "fyrir": "3-4",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "12 stk. kjúklingavængir",
     "3 msk. sojasósa",
     "1½ tsk. balsamikedik",
     "1 tsk. þurrkað og mulið basilikum",
     "1 dl olífuolía"
    ],
    "adferd": [
     "Takið vængina í sundur á liðamótum ef þeir hafa verið keyptir heilir.",
     "Blandið saman sojasósu, ediki, basilikum og ólífuolíu í stóra skál.",
     "Setjið vængina út í og blandið vel saman.",
     "Raðið vængjunum í ofnskúffu (eða í grillálform) og eldið í 200°C heitum ofni í 25-30 mín."
    ]
   }
  ]
 },
 {
  "id": 378,
  "t": "Kjúklingur í laukbaði",
  "fyrir": "4-5",
  "fugl": "kjuklingur",
  "hopur": "heill",
  "h": [
   {
    "h": null,
    "efni": [
     "1 stór kjúklingur",
     "1 laukur",
     "1 rauðlaukur",
     "1 hvítlaukur",
     "1 blaðlaukur",
     "5 gulrætur",
     "5-7 meðalstórar kartöflur",
     "salt og pipar"
    ],
    "adferd": [
     "Kjúklingurinn settur í lokað fat eða ofnpott og kryddaður með salti og pipar.",
     "Allur laukurinn skorinn í sneiðar, gulræturnar þvegnar og skornar í bita.",
     "Kartöflurnar þvegnar, skornar í 2-4 bita og kryddaðar með salti og pipar.",
     "Allt sett í fatið með kjúklingnum og bakað í 1 klst. við 200°C.",
     "Þegar kjúklingurinn er tilbúinn eru kartöflurnar veiddar upp úr, saltaðar/kryddaðar og settar í skál, kjúklingurinn settur á fat, laukur og gulrætur blandað vel saman í matvinnsluvél.",
     "Öllu hellt í pott með u.þ.b. 250 ml af vatni, hitað upp og notað sem sósa á kjúklinginn. Kryddað ef þurfa þykir."
    ]
   }
  ]
 },
 {
  "id": 1630,
  "t": "Kjúklingur með kanil og döðlum",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "bitar",
  "h": [
   {
    "h": null,
    "efni": [
     "1,2 kg kjúklingabitar",
     "2 msk möndlusmjör",
     "1 dl appelsínusafi",
     "1/2 tsk kanill",
     "1/2 tsk karry",
     "2 msk soyjasósa",
     "Salt og pipar",
     "100 g rauðlaukur",
     "50 g dölur",
     "100 g broccoli"
    ],
    "adferd": [
     "Hrærið saman möndlusmjöri, appelsínusafa, kanil, karry og soyjasósu. Marinerið kjúklinginn í blöndunni gott að láta liggja yfir nótt. Skerið grænmetið og döðlurnar í bita og setjið í eldfastform. Raðið kjúklingabitunum ofaná og kryddið með salti og pipar. Bakið við 175°C í 40-50 mínútur eða þar til kjúklingurinn er gegneldaður. Berið fram með hrísgrjónum og góðu salati"
    ]
   }
  ]
 },
 {
  "id": 394,
  "t": "Kókossoðnar kjúklingabringur með sítrónugrasi og kúskússalati",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "4 kjúklingabringur eða -lundir",
     "1 dós kókosmjólk (400 ml)",
     "1 sítrónugrasstöngull, skorinn í helminga",
     "1 tsk. engifer",
     "1 tsk. kjúklingakraftur",
     "sósujafnari"
    ],
    "adferd": [
     "Setjið allt nema sósujafnarann í pott og sjóðið við vægan hita í",
     "12-15 mín.",
     "Takið bringurnar upp úr og þykkið sósuna með sósujafnara.",
     "Kúskússalat",
     "3 dl kúskús",
     "3 dl sjóðandi vatn",
     "1 dl steinselja, smátt söxuð",
     "1 dl minta, smátt söxuð",
     "3 msk. sítrónusafi",
     "1-2 tómatar, smátt saxaðir",
     "1 laukur, smátt saxaður",
     "salt",
     "Setjið kúskúsið í skál og hellið sjóðandi vatni yfir.",
     "Hrærið vel saman, breiðið álpappír yfir skálina og kælið.",
     "Blandið öllu hinu saman við kúskúsið og berið fram."
    ]
   }
  ]
 },
 {
  "id": 416,
  "t": "Ljúfsár bóndakjúklingur með appelsínulíkjör",
  "fyrir": "4-6",
  "fugl": "kjuklingur",
  "hopur": "bitar",
  "h": [
   {
    "h": null,
    "efni": [
     "1 heill kjúklingur, hlutaður niður í bita",
     "½ bolli hveiti",
     "1 tsk. salt",
     "¼ tsk. pipar",
     "8 msk. smjör",
     "2 msk. appelsínubörkur, rifinn",
     "¼ bolli sítrónusafi",
     "¼ bolli appelsínulíkjör",
     "1 msk. sojasósa",
     "¼ bolli hunang",
     "8 litlar gulrætur, soðnar (baby carrots)"
    ],
    "adferd": [
     "Blandið saman í plastpoka hveiti, salti og pipar. Bætið kjúklingnum í pokann, tveimur bitum í einu, og hristið vel til að húða bitana.",
     "Bræðið helminginn af smjörinu á pönnu (4 msk.).",
     "Veltið kjúklingabitunum upp úr bræddu smjörinu og raðið í ofnskúffu eða eldfast mót. Bakið við 165°C í 30 mín.",
     "Bræðið afganginn af smjörinu á pönnu. Bætið í appelsínuberkinum, sítrónusafanum, líkjörnum, sojasósunni og hunanginu. Takið u.þ.b. 2 msk. af blöndunni frá.",
     "Takið kjúklinginn úr ofninum, snúið honum við og hellið blöndunni yfir hann.",
     "Setjið aftur inn í ofn og eldið í 30 mín. til viðbótar, ausið blöndunni af og til yfir kjúklinginn.",
     "Blandið saman við soðnar gulræturnar 2 msk. af blöndunni sem var tekin frá og berið fram með kjúklingnum."
    ]
   }
  ]
 },
 {
  "id": 440,
  "t": "Marokkóskur kjúklingapottréttur",
  "fyrir": "4-5",
  "fugl": "kjuklingur",
  "hopur": "bitar",
  "h": [
   {
    "h": null,
    "efni": [
     "400 g gróft niðurskorið kjúklingakjöt",
     "1 msk. ólífuolía",
     "1 meðalstór laukur, skorinn í báta",
     "4 hvítlauksrif, marin",
     "1 msk. engiferduft",
     "2 meðalstórar gulrætur, skornar í bita",
     "1 bolli niðursoðnar kjúklingabaunir, vökvanum hellt af",
     "½ bolli rúsínur",
     "2 stk. kanilstangir",
     "1 ½ tsk. cumin",
     "½ tsk. túrmerik",
     "5 bollar vatn",
     "2 stk. meðalstórir kúrbítar (zucchini), skornir í bita",
     "2 bollar cous cous"
    ],
    "adferd": [
     "Brúnið kjúklingakjötið í olíunni í stórum potti í u.þ.b. 10 mín. eða þangað til hann er orðinn brúnn á öllum hliðum.",
     "Bætið við lauk, hvítlauk, kjúklingabaunum, engifer, gulrótum, rúsínum, kanilstöngum, cumin, túrmerik og vatni.",
     "Látið suðuna koma upp, lækkið undir pottinum og látið malla í 20 mín.",
     "Bætið kúrbítnum við og látið malla í 10 mín. í viðbót.",
     "Takið kanilstangirnar upp úr. Kryddið með salti og pipar eftir smekk.",
     "Berið fram í stórum skálum ofan á soðnum cous cous.",
     "Þessi réttur er tilvalinn til frystingar eftir eldun."
    ]
   }
  ]
 },
 {
  "id": 396,
  "t": "Mexíkóskar kjúklingabringur",
  "fyrir": "6-8",
  "fugl": "kjuklingur",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "6 kjúklingabringur",
     "1 dl sítrónusafi",
     "2 msk. ólífuolía til penslunar",
     "2 msk. ólífuolía",
     "1 meðalstór laukur",
     "1 dós niðursoðnir tómatar",
     "2 msk. möndlur",
     "2 msk. rúsínur",
     "2 tsk. kapers",
     "5 grænar ólífur",
     "1/2 msk. niðursoðinn grænn pipar",
     "1 rauð paprika",
     "1/2 græn paprika",
     "1/2 gul paprika",
     "2 1/2 dl appelsínusafi",
     "1 dl kjúklingasoð",
     "1/2 tsk. kanill",
     "1 msk. kóríander (ferskt)"
    ],
    "adferd": [
     "Raðið kjúklingabringunum í eldfast mót og hellið sítrónusafa yfir.",
     "Látið standa í ísskáp í 2 klst.",
     "Penslið með ólífuoíu og bakið í ofni við 180°C í 20 mín.",
     "Hitið olíu í potti og mýkið smátt saxaðan laukinn.",
     "Bætið tómötum, rúsínum, kapers, ólífum og piparkornum út í og látið suðuna koma upp.",
     "Hreinsið og takið kjarna úr paprikum og skerið í strimla. Bætið út í ásamt appelsínusafa og kjötsoði og sjóðið í 15 mín. Bragðbætið með kanil.",
     "Hellið sósunni yfir kjúklinginn og bakið áfram í 20 mín. í ofninum.",
     "Skreytið með fersku kóríander og berið fram með soðnum hrísgrjónum og brauði."
    ]
   }
  ]
 },
 {
  "id": 444,
  "t": "Mexíkóskt lasagne",
  "fyrir": "4-6",
  "fugl": "kjuklingur",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "600 g kjúklingabringur",
     "4 stórar Tortillas pönnukökur",
     "1 krukka salsasósa",
     "1 krukka ostasósa",
     "200 g rjómaostur",
     "200 g sýrður rjómi",
     "rifinn ostur"
    ],
    "adferd": [
     "Kjúklingabringurnar skornar í strimla og fulleldaðar á pönnu eða í ofni.",
     "Rjómaostinum og sýrða rjómanum hrært saman.",
     "Hráefnið sett í þessari röð í eldfast mót:",
     "Pönnukökur",
     "Rjómaostur + sýrður rjómi",
     "Kjúklingur"
    ]
   },
   {
    "h": "Salsasósa",
    "efni": [
     "Pönnukökur",
     "Rjómaostur + sýrður rjómi",
     "Kjúklingur"
    ],
    "adferd": []
   },
   {
    "h": "Ostasósa",
    "efni": [
     "Rifinn ostur yfir",
     "Bakað í ofni í 20-30 mín. á 170°C, eða þar til rétturinn er orðinn gegnheitur og osturinn hefur bakast."
    ],
    "adferd": []
   }
  ]
 },
 {
  "id": 380,
  "t": "Mexíkóskur kjúklingaréttur í eldföstu móti",
  "fyrir": "6",
  "fugl": "kjuklingur",
  "hopur": "heill",
  "h": [
   {
    "h": null,
    "efni": [
     "1 heill kjúklingur",
     "300 ml kjúklingasúpa",
     "300 ml sveppasúpa",
     "200 ml kjúklingasoð",
     "300 g niðursoðnir tómatar með grænum chilli",
     "1 stk. meðalstór saxaður laukur",
     "320 g Doritos flögur",
     "1 ½ bolli rifinn ostur"
    ],
    "adferd": [
     "Sjóðið eða grillið kjúklinginn og fjarlægið kjötið af beinunum.",
     "Hitið súpurnar, kjúklingasoðið og tómatana saman á pönnu.",
     "Setjið í eldfast mót í lögum í eftirfarandi röð: Kjúkling, lauk, Doritos og ost.",
     "Loks er sósunni hellt yfir allt saman.",
     "Bakið við 180°C í 30 mín."
    ]
   }
  ]
 },
 {
  "id": 398,
  "t": "Ostapasta, kjúklingur og sveppir",
  "fyrir": "2",
  "fugl": "kjuklingur",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "2 kjúklingabringur",
     "150 g sveppir",
     "1/2 l rjómi",
     "1 msk. rjómaostur (hreinn)",
     "salt",
     "pipar",
     "basilikum",
     "kjúklingakraftur",
     "hvítlauksolía"
    ],
    "adferd": [
     "Kjúklingabringurnar skornar í bita og steiktar í hvítlauksolíu.",
     "Sveppir steiktir með og krafti og kryddi bætt á pönnuna eftir smekk.",
     "Rjóminn er soðinn niður og rjómaosti bætt saman við.",
     "Öllu er þessu svo hellt yfir soðið pasta."
    ]
   }
  ]
 },
 {
  "id": 400,
  "t": "Parmesankjúklingur með fljótlegri pastasósu",
  "fyrir": "4",
  "fugl": "kjuklingur",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "4 kjúklingabringur, beinlausar og skinnlausar",
     "½ bolli brauðrasp",
     "¼ bolli rifinn parmesanostur",
     "½ tsk. Italian seasoning",
     "1/8 tsk. svartur pipar",
     "1/3 bolli hveiti",
     "2 stórar eggjahvítur, slegnar aðeins saman",
     "2 tsk. ólífuolía",
     "4 bollar heitt soðið spaghetti",
     "3 bollar Fljótleg og auðveld pastasósa, sjá uppskrift að neðan",
     "1 bolli rifinn ostur",
     "nokkur fersk basilikumlauf (má sleppa)",
     "1 tsk. ólífuolía",
     "1 bolli saxaður laukur",
     "4 hvítlauksgeirar, pressaðir",
     "½ bolli þurrt rauðvín eða 2 msk. balsamikedik",
     "1 msk. sykur",
     "1 msk. saxað ferskt basilikum eða 2 msk. af þurru",
     "2 msk. tómatpúrra"
    ],
    "adferd": [
     "Setjið hverja bringu fyrir sig inn í plastfilmu og rúllið yfir með kökukefli til að gera þær þynnri.",
     "Blandið saman í grunnri skál brauðraspi, parmesanosti, Italian seasoning og pipar.",
     "Dýfið hverri bringu fyrst í hveiti, síðan eggjahvítur og síðast í raspblönduna.",
     "Hitið olíu á stórri teflonpönnu við miðlungsháan hita.",
     "Bætið kjúklingnum á og steikið í 5 mín. á hvorri hlið, eða þangað til kjötið er tilbúið.",
     "Setjið 1 bolla af spaghetti í djúpa eldfasta diska , setjið ½ bolla af pastasósunni þar yfir. Setjið svo kjúklinginn ofan á allt saman. Setjið síðan ¼ bolla af pastasósunni ofan á og stráið ¼ bolla af rifnum osti yfir hvern disk. Setjið diskana á bökunarplötu og hitið í ofni í 3 mín. eða þangað til osturinn er bráðnaður. Skreytið með basilikulaufunum og berið fram með hvítlauksbrauði.",
     "Fljótleg og auðveld pastasósa",
     "Blandið öllu saman í skál og hrærið vel."
    ]
   }
  ]
 },
 {
  "id": 382,
  "t": "Ritz-kjúklingaréttur",
  "fyrir": "4-6",
  "fugl": "kjuklingur",
  "hopur": "heill",
  "h": [
   {
    "h": null,
    "efni": [
     "1 heill kjúklingur",
     "1 pk. Ritz-kex",
     "smjör",
     "sterkur ostur"
    ],
    "adferd": [
     "Kjúklingurinn hlutaður niður (eða keyptur í bitum).",
     "Ritz-kexið sett í poka og mulið vel með kökukefli.",
     "Smjörið brætt í potti, kjúklingabitunum velt upp úr því og síðan upp úr kexmulningnum.",
     "Bitarnir settir í eldfast mót og miklu af rifnum sterkum osti dreift yfir.",
     "Bakað í 50 mín. við 200°C.",
     "Borið fram með hrísgrjónum og sojasósu eða karrýsósu með laukbitum og fersku salati."
    ]
   }
  ]
 },
 {
  "id": 355,
  "t": "Rómantísk kjúklingasúpa",
  "fyrir": "5-6",
  "fugl": "kjuklingur",
  "hopur": "salat",
  "h": [
   {
    "h": null,
    "efni": [
     "1 heill kjúklingur (um 1500 g), hlutaður niður í bita, eða 1 poki kjúklingabitar",
     "2 l vatn",
     "2 laukar",
     "2 msk. salt",
     "4 stórar gulrætur",
     "1 stór gulrófa",
     "1 blómkálshöfuð",
     "8 kartöflur",
     "1 blaðlaukur",
     "2 kjúklingateningar",
     "2 bollar pastaslaufur eða -skrúfur"
    ],
    "adferd": [
     "Kjúklingurinn soðinn í potti með vatni, lauk og salti í 1 1/2 til 2 klst. og síðan kældur.",
     "Á meðan kjúklingurinn er kældur er soðið sigtað, grænmetið látið út í og soðið í ca 30 mín.",
     "Kjúklingurinn hreinsaður af beinunum og látinn út í soðið, pasta bætt við og soðið samkvæmt leiðbeiningum á pastapakkanum.",
     "Borið fram með hvítlauksbrauði eða rúnnstykkjum, góðu smjöri og jafnvel aukakartöflum."
    ]
   }
  ]
 },
 {
  "id": 436,
  "t": "Satay-kjúklingur með hnetusósu",
  "fyrir": "4-5",
  "fugl": "kjuklingur",
  "hopur": "grill",
  "h": [
   {
    "h": null,
    "efni": [
     "1 kg skinnlausar og beinlausar kjúklingabringur"
    ],
    "adferd": []
   },
   {
    "h": "Marinering",
    "efni": [
     "6 hvítlauksrif, söxuð",
     "4 tsk. kóríander",
     "4 tsk. ljós púðursykur",
     "1 msk. svartur pipar",
     "2 tsk. salt",
     "½ bolli sojasósa",
     "4 tsk. ferskt engifer, saxað",
     "2 msk. limesafi",
     "6 msk. matarolía",
     "¼ bolli ferskt kóríander til skreytingar"
    ],
    "adferd": [
     "Blandið saman öllum hráefnunum í marineringuna.",
     "Skerið bringurnar í 4-5 cm breiða bita (mátulega til að hægt sé að þræða þá upp á grillpinna).",
     "Látið kjúklinginn liggja í marineringunni í 2-3 klst. í ísskáp.",
     "Þræðið kjúklinginn upp á satay-pinna.",
     "Grillið pinnana annað hvort í ofni eða á grilli og penslið marineringunni yfir við og við."
    ]
   },
   {
    "h": "Hnetusósa",
    "efni": [
     "1 bolli gróft hnetusmjör",
     "1-2 tsk. chilli-sósa",
     "2 hvítlauksgeirar, pressaðir",
     "3 msk. hunang",
     "1 tsk. cayennepipar",
     "¼ bolli limesafi",
     "¼ bolli sojasósa",
     "½ bolli hnetuolía"
    ],
    "adferd": [
     "Blandið hráefnunum saman.",
     "Bragðið á að vera „sætsterkt“. Smakkið til og bætið við magni af hráefnum eftir smekk."
    ]
   }
  ]
 },
 {
  "id": 418,
  "t": "Sítrónukjúklingur með kryddsósu",
  "fyrir": "4-5",
  "fugl": "kjuklingur",
  "hopur": "bitar",
  "h": [
   {
    "h": null,
    "efni": [
     "1500 g kjúklingabitar",
     "2 sítrónur",
     "frönsk kryddblanda (Provencale)",
     "matarolía eða smjör til steikingar",
     "4 lárviðarlauf",
     "1 kjúklingateningur",
     "4 dl vatn",
     "salt og pipar",
     "sósujafnari",
     "örlítill sykur"
    ],
    "adferd": [
     "Kreistið safa úr einni sítrónu og nuddið yfir kjúklingabitana.",
     "Kryddið með franskri kryddblöndu og látið bíða í 15-20 mín.",
     "Þerrið kjúklingabitana og brúnið í potti í matarolíu eða smjöri.",
     "Setjið lárviðarlauf og einn kjúklingatening út í ásamt vatninu.",
     "Sjóðið réttinn í klukkutíma eða þar til kjötið er meyrt.",
     "Sneiðið hina sítrónuna og bætið tveimur til þremur sneiðum út í réttinn síðustu mínúturnar.",
     "Kryddið með salti og pipar.",
     "Takið kjúklingabitana upp úr pottinum og jafnið soðið með sósujafnara.",
     "Bragðbætið með sítrónusafa, örlitlum sykri og franskri kryddblöndu.",
     "Gott er að bera réttinn fram með hrísgrjónum og brauði."
    ]
   }
  ]
 },
 {
  "id": 420,
  "t": "Steikt kjúklingalæri með ávaxtasalsa",
  "fyrir": "4-5",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "8 stk. kjúklingalæri",
     "1 msk. ólífuolía",
     "1 tsk. paprikuduft",
     "1 tsk. salt",
     "1 tsk. svartur pipar"
    ],
    "adferd": [
     "Forhitið ofninn í 180° C.",
     "Blandið saman í stóra skál kjúklingalærunum, ólífuolíunni, paprikuduftinu, saltinu og piparnum.",
     "Setjið lærin í eldfast mót eða steikingarpott (ekki með loki), með skinnið niður, og steikið í 20 mín. Snúið lærunum við og steikið í 20 mín. í viðbót.",
     "Ávaxtasalsa",
     "3 stk. þroskaðar perur, skornar í teninga",
     "4 stk. þroskaðar plómur, skornar í teninga",
     "½ bolli þurrkuð trönuber",
     "¼ bolli rauðlaukur, fínt saxaður",
     "¼ bolli rauð paprika, söxuð",
     "1 stk. jalapeno-piparbelgur, steinhreinsaður og saxaður fínt",
     "3 msk. ferskt basilikum, saxað",
     "1 tsk. sykur",
     "¼ tsk. kanill",
     "1 msk. balsamikedik",
     "1 msk. olífuolía",
     "½ tsk. salt",
     "½ tsk. svartur pipar",
     "Setjið allt hráefnið í stóra skál, hrærið aðeins í og látið standa við herbergishita í smástund.",
     "Smakkið til með salti og pipar.",
     "Berið lærin fram á diski með 1-2 msk. af salsasósunni ofan á. Berið umframsalsasósu fram í skál með."
    ]
   }
  ]
 },
 {
  "id": 370,
  "t": "Stökkir kjúklingaleggir á fjóra vegu",
  "fyrir": "4-5",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "12 stk. kjúklingaleggir",
     "2 hvítlauksgeirar, pressaðir",
     "1 msk. engifer, fínt saxað",
     "½ chilialdin, fræhreinsað og skorið í sneiðar",
     "1 tsk. kjúklingakraftur"
    ],
    "adferd": [
     "Setjið allt í pott, ásamt svo miklu vatni að rétt fljóti yfir leggina, og sjóðið við vægan hita í 20-25 mín. Takið leggina úr vatninu og kælið.",
     "Útbúið hjúp (sjá fjórar mismunandi uppskriftir að hjúp hér að neðan)og veltið leggjunum upp úr honum. Djúpsteikið leggina í 170-180°C heitri olíu í 3-5 mín. eða þangað til leggirnir eru orðnir fallega brúnir og heitir í gegn. Einnig má steikja þá í 200°C heitum ofni í 7-10 mín. eða þangað til þeir verða fallega brúnir.",
     "Kókos- og karríhjúpur",
     "1-2 msk. karríduft",
     "2 dl hveiti",
     "2 egg, pískuð",
     "2 dl rasp",
     "1 dl kókosmjöl",
     "Blandið saman karríi og hveiti, veltið leggjunum upp úr blöndunni og síðan upp úr eggjunum.",
     "Blandið raspinu saman við kókosmjölið og veltið leggjunum að síðustu upp úr því.",
     "Kryddjurtahjúpur",
     "1 dl hveiti",
     "1 msk. blandað jurtakrydd",
     "salt og pipar",
     "2 egg, pískuð",
     "2 dl rasp",
     "1-2 hvítlauksgeirar, pressaðir",
     "1 dl fínt saxaðar kryddjurtir, t.d. basilikum, steinselja, timian, estragon eða graslaukur",
     "2 msk. parmesanostur",
     "Blandið saman hveiti, jurtakryddi, salti og pipar og setjið í skál.",
     "Þá er raspinu, kryddjurtunum, hvítlauknum og parmesanostinum blandað saman í aðra skál.",
     "Veltið leggjunum fyrst upp úr hveitiblöndunni, þá upp úr eggjunum og síðast upp úr raspinu.",
     "Hnetuhjúpur",
     "1 dl hveiti",
     "1 tsk. kjúklingakrydd (t.d. chickenseasoning)",
     "2 egg, pískuð",
     "1-2 tsk. hnetusmjör",
     "1 dl rasp",
     "1 dl blandaðar hnetur, kurlaðar",
     "Blandið saman hveiti og kjúklingakryddi.",
     "Þeytið saman egg og hnetusmjör.",
     "Blandið saman raspi og hnetukurlinu.",
     "Veltið leggjunum fyrst upp úr hveitiblöndunni, þá upp úr eggjunum og síðast upp úr raspinu.",
     "Mexíkóskur nachos-hjúpur",
     "1 dl hveiti",
     "1-2 msk. blandað mexíkókrydd",
     "2 egg, pískuð",
     "2 dl nachos, kurlað í matvinnsluvél",
     "Blandið saman hveiti og kryddi og veltið leggjunum fyrst upp úr",
     "hveitiblöndunni, síðan upp úr eggjunum og að lokum upp úr nachoskurlinu."
    ]
   }
  ]
 },
 {
  "id": 384,
  "t": "Súrsætur kjúklingur",
  "fyrir": "4-5",
  "fugl": "kjuklingur",
  "hopur": "heill",
  "h": [
   {
    "h": null,
    "efni": [
     "1 heill kjúklingur",
     "1 msk. matarolía",
     "2 msk. barbeque-sósa",
     "2 msk. edik",
     "2 msk. sérrí",
     "1 msk. sojasósa",
     "1 tsk. sesamolía",
     "250 g eggjanúðlur"
    ],
    "adferd": [
     "Hitið ofninn í 180°C.",
     "Blandið olíu, vatni, barbeque-sósu, ediki, sérríi, sojasósu og sesamolíu vel saman og penslið kjúklinginn vel með kryddblöndunni.",
     "Setjið í eldfast mót og inn í ofninn. Steikið kjúklinginn í a.m.k. 50 mín.",
     "Berið fram með sósunni hér að neðan, kínverskum núðlum, blaðlauk, agúrku og rauðri papriku, sem allt er skorið í fína strimla."
    ]
   },
   {
    "h": "Sósa",
    "efni": [
     "1 msk. matarolía",
     "150 g niðursoðinn ananas",
     "1/2 msk. engiferrót",
     "1 hvítlauksrif",
     "1 dl vatn",
     "1 dl ananassafi",
     "2 tsk. barbeque-sósa",
     "1 msk. sojasósa",
     "2 msk. sérrí",
     "1/2 kjúklingateningur",
     "1 msk. edik"
    ],
    "adferd": [
     "Hitið olíu á pönnu. Merjið hvítlauk og rífið engiferrót og mýkið í olíunni.",
     "Skerið ananashringi í bita og hitið á pönnunni með kryddinu.",
     "Hellið vatni, sojasósu, barbeque-sósu, sérríi, ediki og myljið",
     "kjúklingateninga út í. Hleypið upp suðu og þykkið með sósujafnara ef þörf er á."
    ]
   }
  ]
 },
 {
  "id": 1938,
  "t": "Svikinn Kalkúnn",
  "fyrir": "",
  "fugl": "kalkunn",
  "hopur": "hakk",
  "h": [
   {
    "h": null,
    "efni": [
     "800 g kalkúnahakk",
     "100 g beikon í litlum bitum",
     "1 egg",
     "½ tsk salt",
     "1 tsk svartur pipar grófmalaður",
     "1 tsk paprikuduft",
     "½ tsk chilliduft",
     "100 g brauðraspur",
     "5 sneiðar beikon"
    ],
    "adferd": [
     "Hrærið saman kalkúnahakk, beikonbita, egg og krydd. Bætið í brauðraspi og setjið í form raðið beikonsneiðum ofan á og bakið við 170°C í 25-35 mínútur eða þar til kjarnhiti nær minnst 70°C",
     "Berið fram með salati og kartöflumús."
    ]
   }
  ]
 },
 {
  "id": 402,
  "t": "Tandoori-kjúklingur með mintusósu",
  "fyrir": "6",
  "fugl": "kjuklingur",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "6 kjúklingabringur",
     "2 1/2 dl hrein jógúrt (án ávaxta)",
     "1/2 dl hvítvínsedik",
     "1 1/2 msk. kúmínduft (cumin)",
     "1 msk. rautt chiliduft",
     "1 msk. garam masala",
     "1 tsk. natríumskert salt",
     "2 msk. svartur pipar (fínn)",
     "4 hvítlauksgeirar",
     "1 msk. engiferrót (rifin)",
     "1/2 dl olía",
     "350 g hrísgrjón",
     "1 kjúklingateningur"
    ],
    "adferd": [
     "Búið til lög úr jógúrt, hvítvínsediki, olíu og kryddi.",
     "Merjið hvítlauk, rífið engiferrót og bætið út í.",
     "Leggið skinnlausar kjúklingabringurnar í löginn og látið marinerast í a.m.k. 4 klst.",
     "Takið bringurnar úr marineringunni og bakið í eldföstu móti við 200°C í 20 mín."
    ]
   },
   {
    "h": "Mintusósa",
    "efni": [
     "1/2 l hrein jógúrt",
     "4 msk. minta (fersk)",
     "1 sítróna (safi)",
     "1/2 tsk. natríumskert salt",
     "1 tsk. nýmalaður pipar"
    ],
    "adferd": [
     "Látið jógúrt drjúpa í gegnum kaffifilterpoka í 1 klst.",
     "Saxið mintuna smátt og bætið öllum hráefnum saman í matvinnsluvél. Geymið í kæli í a.m.k. 3 klst.",
     "Berið fram með hrísgrjónum soðnum í kjúklingakrafti, krydduðum með fersku kóríander, ásamt salati með rauðlauk og sósu úr ólífuolíu og balsamikediki."
    ]
   }
  ]
 },
 {
  "id": 344,
  "t": "Tælenskur kjúklingahakkréttur með hrísgrjónum",
  "fyrir": "4-6",
  "fugl": "kjuklingur",
  "hopur": "hakk",
  "h": [
   {
    "h": null,
    "efni": [
     "750 g kjúklingahakk",
     "2 tsk. olífuolía",
     "1 stór rauðlaukur",
     "1 búnt ferskt kóríander",
     "1/4 bolli sæt chilisósa",
     "2 msk. fiskisósa",
     "2 msk. sítrónusafi",
     "3 tsk. púðursykur",
     "2 bollar jasmín-hrísgrjón"
    ],
    "adferd": [
     "Léttsteikið laukinn í olíu á pönnu.",
     "Setjið hakkið út og brúnið.",
     "Bætið restinni út í hakkið og steikið áfram í um 5 mín.",
     "Berið fram með hrísgrjónunum og kóríanderlaufum."
    ]
   }
  ]
 },
 {
  "id": 422,
  "t": "Úrbeinuð kjúklingalæri í saltkexmulningi",
  "fyrir": "4-5",
  "fugl": "kjuklingur",
  "hopur": "leggir",
  "h": [
   {
    "h": null,
    "efni": [
     "10 úrbeinuð kjúklingalæri með skinni (lítið mál að úrbeina, má líka nota bringur með skinni)",
     "½ pakki saltkex, mulið (t.d. Ritz)",
     "2 tsk. kjúklingakrydd frá Pottagöldrum",
     "2 tsk. lambakjötskrydd frá Pottagöldrum",
     "2 tsk. graslaukur, ferskur eða þurrkaður",
     "1 egg",
     "örlítil mjólk"
    ],
    "adferd": [
     "Setijð kexmulninginn og kryddið í stóra skál og blandið vel saman.",
     "Pískið saman egg og mjólk.",
     "Dýfið kjötinu í eggjahræruna.",
     "Setjið í eldfast mót og bakið í ofni í 40-50 mín. á 180C°.",
     "Borið fram með kaldri sósu, hrásalati og / eða kartöflusalati."
    ]
   }
  ]
 },
 {
  "id": 480,
  "t": "Æðislegar fylltar kalkúnabringur",
  "fyrir": "6-8",
  "fugl": "kalkunn",
  "hopur": "bringur",
  "h": [
   {
    "h": null,
    "efni": [
     "2 beinlausar kalkúnabringur, u.þ.b. 700 g hvor",
     "5 msk. sojasósa",
     "2 msk. þurrt sérrí",
     "½ tsk. sykur",
     "8 brauðsneiðar",
     "1 bolli sellerí, fínt saxað",
     "2/3 bolli möndlur, saxaðar og ristaðar",
     "¼ bolli blaðlaukur, fínsaxaður",
     "3 msk. smjör, bráðið"
    ],
    "adferd": [
     "Takið bringurnar í sundur með því að byrja á þynnri endanum og fletjið þær út með því að berja þær í u.þ.b. 2 cm þunnan flöt.",
     "Blandið saman 3 msk. af sojasósu, sérríi og sykri í djúpan disk.",
     "Setjið bringurnar ofan í marineringuna í ca 30 mín.",
     "Á meðan bringurnar marinerast er brauðið, blaðlaukurinn, selleríið og möndlurnar skorið niður og möndlurnar ristaðar.",
     "Blandið smjörinu saman við 2 msk. af sojasósu og hellið yfir brauðblönduna (það er ekkert að því að skella höndunum í þetta og hnoða aðeins).",
     "Takið bringurnar úr marineringunni og geymið marineringarlöginn.",
     "Setjið helminginn af fyllingunni á helminginn af hvorri bringunni, rúllið bringunni upp eins þétt og mögulegt er. Festið með tannstönglum eða bandi.",
     "Látið í eldfast mót eða ofnskúffu og penslið með marineringunni. Setjið inn í 160°C heitan ofn og eldið í 1 klst. og 15 mín. Penslið með marineringunni á 30 mínútna fresti.",
     "Takið bringurnar úr ofninum og látið standa í 15 mín. áður en bandið/tannstönglarnir eru teknir af og berið fram.",
     "Gott er að gera sósu úr soðinu sem kemur af bringunum."
    ]
   }
  ]
 }
]
