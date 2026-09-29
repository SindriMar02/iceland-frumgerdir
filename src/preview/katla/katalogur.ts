/* Katla's whole catalogue as listed on katla.is (the Neytendavara, Bakarí and
   Kjötvinnslur pages), captured 2026-09-28. Names, pakkning and vörunúmer are
   theirs, tidied only for case and "x" to "×"; a vörunúmer or pakkning is left
   blank where their own card and product page print none. img = a local pack
   shot where one exists (consumer goods only; Eðal kakó is deliberately text
   only). Generated from _docs/katla-harvest-2026-09-28/cards.json, do not hand-edit. */

export type KVara = { nr: string; n: string; pk: string; pdf: string; img: string; d: string }
export type KFlokkur = { s: string; t: string; items: KVara[] }

export const KATALOGUR: KFlokkur[] = [
 {
  "s": "blondur",
  "t": "Bakstursblöndur",
  "items": [
   {
    "nr": "10208",
    "n": "Vöfflumix",
    "pk": "15 × 500 g",
    "pdf": "",
    "img": "vofflumix",
    "d": ""
   },
   {
    "nr": "15515",
    "n": "Íslenskar pönnsur",
    "pk": "18 × 300 g",
    "pdf": "",
    "img": "islenskar-ponnsur",
    "d": ""
   },
   {
    "nr": "15545",
    "n": "Vöfflur, hrista og baka",
    "pk": "6 × 330 g",
    "pdf": "",
    "img": "vofflur-hristabaka",
    "d": ""
   },
   {
    "nr": "",
    "n": "Amerískar pönnukökur",
    "pk": "",
    "pdf": "",
    "img": "ameriskar-ponnukokur",
    "d": ""
   },
   {
    "nr": "15823",
    "n": "Súkkulaðikaka",
    "pk": "15 × 500 g",
    "pdf": "",
    "img": "sukkuladikaka",
    "d": ""
   },
   {
    "nr": "15680",
    "n": "Baunasúpugrunnur",
    "pk": "6 × 1 l",
    "pdf": "",
    "img": "baunasupu-grunnur",
    "d": ""
   }
  ]
 },
 {
  "s": "dropar",
  "t": "Dropar",
  "items": [
   {
    "nr": "10217",
    "n": "Sítrónudropar",
    "pk": "12 × 30 ml",
    "pdf": "",
    "img": "sitronudropar",
    "d": ""
   },
   {
    "nr": "10221",
    "n": "Rommdropar",
    "pk": "24 × 30 ml",
    "pdf": "",
    "img": "rommdropar",
    "d": ""
   },
   {
    "nr": "10216",
    "n": "Kardimommudropar",
    "pk": "24 × 30 ml",
    "pdf": "",
    "img": "kardimommudropar",
    "d": ""
   },
   {
    "nr": "10214",
    "n": "Vanilludropar",
    "pk": "24 × 30 ml",
    "pdf": "",
    "img": "vanilludropar",
    "d": ""
   },
   {
    "nr": "10219",
    "n": "Piparmyntudropar",
    "pk": "12 × 30 ml",
    "pdf": "",
    "img": "piparmyntudropar",
    "d": ""
   },
   {
    "nr": "10215",
    "n": "Möndludropar",
    "pk": "12 × 30 ml",
    "pdf": "",
    "img": "mondludropar",
    "d": ""
   },
   {
    "nr": "10222",
    "n": "Appelsínudropar",
    "pk": "12 × 30 ml",
    "pdf": "",
    "img": "appelsinudropar",
    "d": ""
   }
  ]
 },
 {
  "s": "deig",
  "t": "Smákökudeig",
  "items": [
   {
    "nr": "",
    "n": "Smákökudeig lakkrís",
    "pk": "",
    "pdf": "",
    "img": "smakokudeig-lakkris",
    "d": ""
   },
   {
    "nr": "",
    "n": "Smákökudeig hvítt súkkulaði",
    "pk": "",
    "pdf": "",
    "img": "smakokudeig-hvitt-sukkuladi",
    "d": ""
   },
   {
    "nr": "",
    "n": "Smákökudeig súkkulaðibitar",
    "pk": "",
    "pdf": "",
    "img": "smakokudeig-sukkuladibitar",
    "d": ""
   },
   {
    "nr": "",
    "n": "Smákökudeig piparkökur",
    "pk": "",
    "pdf": "",
    "img": "smakokudeig-piparkokur",
    "d": ""
   },
   {
    "nr": "",
    "n": "Smákökudeig kókos",
    "pk": "",
    "pdf": "",
    "img": "smakokudeig-kokos",
    "d": ""
   },
   {
    "nr": "",
    "n": "Smákökudeig engifer",
    "pk": "",
    "pdf": "",
    "img": "smakokudeig-engifer",
    "d": ""
   }
  ]
 },
 {
  "s": "krydd",
  "t": "Krydd og bakstur",
  "items": [
   {
    "nr": "10239",
    "n": "Púðursykur",
    "pk": "12 × 1 kg",
    "pdf": "",
    "img": "pudursykur",
    "d": ""
   },
   {
    "nr": "10224",
    "n": "Eðal kakó",
    "pk": "18 × 250 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15630",
    "n": "Glassúr",
    "pk": "10 × 500 ml",
    "pdf": "",
    "img": "glassur",
    "d": ""
   },
   {
    "nr": "10240",
    "n": "Rasp gullið",
    "pk": "18 × 300 g",
    "pdf": "",
    "img": "rasp-gullid",
    "d": ""
   },
   {
    "nr": "15783",
    "n": "Kanill",
    "pk": "10 × 120 g",
    "pdf": "",
    "img": "kanill",
    "d": ""
   },
   {
    "nr": "15781",
    "n": "Matarsódi",
    "pk": "10 × 110 g",
    "pdf": "",
    "img": "matarsodi-dos",
    "d": ""
   },
   {
    "nr": "15784",
    "n": "Vanillusykur",
    "pk": "10 × 140 g",
    "pdf": "",
    "img": "vanillusykur",
    "d": ""
   },
   {
    "nr": "15829",
    "n": "Lyftiduft",
    "pk": "10 × 110 g",
    "pdf": "",
    "img": "lyftiduft",
    "d": ""
   },
   {
    "nr": "15785",
    "n": "Karrí",
    "pk": "10 × 110 g",
    "pdf": "",
    "img": "karri",
    "d": ""
   },
   {
    "nr": "15745",
    "n": "Matarsódi",
    "pk": "12 × 1 kg",
    "pdf": "",
    "img": "matarsodi",
    "d": ""
   },
   {
    "nr": "15782",
    "n": "Hjartarsalt",
    "pk": "10 × 210 g",
    "pdf": "",
    "img": "hjartarsalt",
    "d": ""
   }
  ]
 },
 {
  "s": "salt",
  "t": "Salt",
  "items": [
   {
    "nr": "10232",
    "n": "Borðsalt",
    "pk": "15 × 1 kg",
    "pdf": "",
    "img": "bordsalt",
    "d": ""
   },
   {
    "nr": "10232",
    "n": "Sjávarsalt",
    "pk": "15 × 1 kg",
    "pdf": "",
    "img": "sjavarsalt",
    "d": ""
   },
   {
    "nr": "",
    "n": "Gróft salt",
    "pk": "",
    "pdf": "",
    "img": "groft-salt",
    "d": ""
   },
   {
    "nr": "15870",
    "n": "Epsom salt",
    "pk": "12 × 1,2 kg",
    "pdf": "",
    "img": "epsom-salt",
    "d": ""
   }
  ]
 },
 {
  "s": "bakari",
  "t": "Bakarí",
  "items": [
   {
    "nr": "10020",
    "n": "Sítrónudropar",
    "pk": "1 l",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10018",
    "n": "Möndludropar",
    "pk": "1 l",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10019",
    "n": "Kardemommudropar",
    "pk": "1 l",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10017",
    "n": "Vanilludropar",
    "pk": "1 l",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15330",
    "n": "Quarkdeig Lindemann /Skonsu mix",
    "pk": "20 kg sekkur",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15897",
    "n": "Lakkrískurl 2kg í kassa",
    "pk": "2 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15586",
    "n": "Kalt krem Lindemann",
    "pk": "15 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15330",
    "n": "Vöfflumix 5kg",
    "pk": "20 kg sekkur",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15891",
    "n": "Súkkulaðikökumix bakara NÝTT",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15044",
    "n": "Kanilflögur Kötlu",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15750",
    "n": "Kakó 20-22% Cargill DÖKKT",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15205",
    "n": "Súkkulaði Chunks Mjólkur – Barry Callebaut",
    "pk": "25 kg í kassa",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15203",
    "n": "Súkkulaði dropar litlir – Barry Callebaut",
    "pk": "25 kg í kassa",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15618",
    "n": "Súkkulaði dropar Hvítir litlir – Barry",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15529",
    "n": "Hrærismjörlíki 10kg block",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15531",
    "n": "Steikingarfeiti  Lindemann",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15326",
    "n": "Rúllusmjörlíki í 2kg plötum",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15473",
    "n": "Rúllusmjörlíki 640kg bretti",
    "pk": "640 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15206",
    "n": "Steikingarfeiti hörð Trans frí AVENO",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15054",
    "n": "Lyftiduft Bakara",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10243",
    "n": "Hjartasalt",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15327",
    "n": "RÖRE BLÖD Hrærismjörlíki 10kg block",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10844",
    "n": "Matarsódi",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10129",
    "n": "Brúnkökukrydd",
    "pk": "3 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15698",
    "n": "Pressuger / De danske / Lallemand",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15699",
    "n": "Þurrger Instaferm 500gr.",
    "pk": "20 × 500 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15698",
    "n": "kókosmjöl",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15664",
    "n": "Trönuber cranberries",
    "pk": "12,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10046",
    "n": "Rúsínur",
    "pk": "12,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13822",
    "n": "Kanill",
    "pk": "12 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15001",
    "n": "Picanto papriku krydd",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15814",
    "n": "Púðursykur DÖKKUR",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14964",
    "n": "Flórsykur Kötlu",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13836",
    "n": "Borðsalt",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13836",
    "n": "Púðursykur",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15370",
    "n": "Blandað eggjahvítuduft",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15371",
    "n": "Blandað eggjaduft",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12008",
    "n": "Strásykur",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15519",
    "n": "Blandað eggjahvítuduft",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10874",
    "n": "Haframjöl Fínt",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15164",
    "n": "Graskersfræ",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15165",
    "n": "Birkifræ Blátt",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13976",
    "n": "Haframjöl flögur (tröll hafrar)",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12771",
    "n": "Kartöfluflögur",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13307",
    "n": "Hörfræ",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10840",
    "n": "Hveiti Classic",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14097",
    "n": "Rúgmjöl/normal",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15934",
    "n": "Kransakökumassi Lubeca",
    "pk": "12,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13309",
    "n": "Sólkjarnafræ",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13305",
    "n": "Sesamfræ",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15935",
    "n": "Persipan bittermassi Lubeca",
    "pk": "12,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15937",
    "n": "Möndluflögur ÁN HÝÐIS 1mm Lubeca",
    "pk": "12,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15936",
    "n": "Heslihnetur M/hýði 1mm Lubeca",
    "pk": "12,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15938",
    "n": "Bittermassi Brún Roma Lubeca",
    "pk": "12,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13809",
    "n": "Plötupappír 70 X 50 cm",
    "pk": "500 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15395",
    "n": "Airbrush Appelsínugulur",
    "pk": "190 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12902",
    "n": "Tertukassi Gulur m hjarta",
    "pk": "60 stk 32 × 32 × 11,5",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12901",
    "n": "Tertukassi Gulur m hjarta",
    "pk": "80 stk 26 × 26 × 12",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15396",
    "n": "Airbrush Blár",
    "pk": "190 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15501",
    "n": "Airbrush Fjólublár",
    "pk": "190 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15398",
    "n": "Airbrush Brúnn",
    "pk": "190 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15400",
    "n": "Airbrush Bleikur",
    "pk": "190 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15402",
    "n": "Airbrush Grænn",
    "pk": "190 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15514",
    "n": "Airbrush Silver",
    "pk": "190 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15513",
    "n": "Airbrush Gold",
    "pk": "190 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15397",
    "n": "Airbrush Gulur",
    "pk": "190 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15401",
    "n": "Airbrush Rauður",
    "pk": "190 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15430",
    "n": "Fjölskeri 5-hjóla",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15429",
    "n": "Einnota sprautupokar 55cm",
    "pk": "100 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15399",
    "n": "Airbrush Svartur",
    "pk": "190 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15431",
    "n": "Fjölskeri 7-hjóla",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15551",
    "n": "Pizzaskeri langur 95x400mm",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15451",
    "n": "Pallet hnífur 26cm",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15439",
    "n": "Hveitskófla 1520ml",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15378",
    "n": "Piskur 45cm",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15420",
    "n": "Plast borði 6cm hæð",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15419",
    "n": "Plast borði 5cm hæð",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15377",
    "n": "Pískur 35cm",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15445",
    "n": "Silicon mót kubbur (12 hólf í mottu)",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15597",
    "n": "Siliconform 24cm hringur",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15447",
    "n": "Siliconform 22cm hringur",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15579",
    "n": "Silconform 18cm hringur",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15550",
    "n": "Siliconform 26cm hringur",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15416",
    "n": "Sleif 30cm hitaþolinn",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15435",
    "n": "Skafleður",
    "pk": "10 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15458",
    "n": "Hringskeri 10,5cm Cutter80 hvítur",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15417",
    "n": "Sleif 50cm hitaþolinn",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15455",
    "n": "Sprautupoki fjölnota 60cm",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15415",
    "n": "Sleikja 45cm",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15414",
    "n": "Sleikja 35cm",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15456",
    "n": "Sprautupoki fjölnota 70cm",
    "pk": "1 stk",
    "pdf": "",
    "img": "",
    "d": ""
   }
  ]
 },
 {
  "s": "kjot",
  "t": "Kjötvinnslur",
  "items": [
   {
    "nr": "11849",
    "n": "Allroundkrydd án MSG",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13922",
    "n": "Allround.án MSG húð.salt #GL",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10967",
    "n": "Allrahanda",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10682",
    "n": "Alkmara #MJ",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14996",
    "n": "Ávaxtasykur",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11012",
    "n": "Aromatsalt Culinar #MJ #CE",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10997",
    "n": "Anisduft",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15898",
    "n": "Bacon Flavour án MGS, snakk",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15950",
    "n": "Baconblanda Raps 1Kg",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10653",
    "n": "Bacon flavour Raps",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11973",
    "n": "Bacon flavour Katla 25kg, snakk",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14348",
    "n": "Baconmarinering #",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10380",
    "n": "Battermix 2000 #",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14283",
    "n": "Basil 30mesh",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14349",
    "n": "Baconmarinering #",
    "pk": "4 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10373",
    "n": "Battermix 7kg #",
    "pk": "7 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15899",
    "n": "Beinahlífar BG 12",
    "pk": "92 m rúlla",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10374",
    "n": "Battermix Lemmon #",
    "pk": "6 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15821",
    "n": "Battermix Classic crisp Leimer",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14919",
    "n": "Betakarotín Duft",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14270",
    "n": "Carmin blanda",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11409",
    "n": "Cajun spicy Raps",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15070",
    "n": "Brauðstangakrydd Kötlu # 5 kg",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10819",
    "n": "Carmine",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11005",
    "n": "Cayennepipar",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15925",
    "n": "Carrageenan GENU MB-154F",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15128",
    "n": "Carrageenan Cellagel 1400",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12569",
    "n": "Chili Bites Raps #",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10658",
    "n": "Cooked ham flavour",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10963",
    "n": "Chilipipar",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14180",
    "n": "Chiliduft 3 Kg",
    "pk": "3 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11613",
    "n": "Cooked pepperoni",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14227",
    "n": "Cumin malað",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10705",
    "n": "Crusto Raps #",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14172",
    "n": "Coriander malað",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10984",
    "n": "Dill",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13850",
    "n": "Dry Marinade Hot",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11846",
    "n": "Dry Barbecue Kötlu #GL",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15885",
    "n": "Dill frostþurrkað",
    "pk": "7 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11002",
    "n": "Einiber heil",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10977",
    "n": "Fenigal duft",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14178",
    "n": "engifer duft",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11000",
    "n": "Einiber möluð",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15127",
    "n": "Fenugreek Duft",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13863",
    "n": "French Garlic Kötlu #",
    "pk": "4 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15268",
    "n": "Frankfurter krydd",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10422",
    "n": "Fjallablanda #",
    "pk": "8 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10737",
    "n": "French garlic Raps #",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14258",
    "n": "GDL",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10707",
    "n": "Garden herbs Raps",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13795",
    "n": "Fresh Lemon Extra",
    "pk": "1 l",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10679",
    "n": "Glutalín #CE #MU",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10602",
    "n": "Grillkrydd Kötlu 10 kg",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10738",
    "n": "Grillbutter Raps",
    "pk": "4,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10998",
    "n": "Graslaukur",
    "pk": "8 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15684",
    "n": "Heiðarkrydd",
    "pk": "6 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14332",
    "n": "Honey Mustard #",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10729",
    "n": "Herb Butter Raps",
    "pk": "4,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13923",
    "n": "Heiðmerkurbl.húð.salt",
    "pk": "6 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10621",
    "n": "Hunangs grillsósa #",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14181",
    "n": "Hvítlauks Gran",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14367",
    "n": "Hveititrefjar wf 600",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10662",
    "n": "Húðað salt RAPS.",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15349",
    "n": "Hvítlauks og engifer marinering",
    "pk": "4 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10991",
    "n": "Hvítlauksflögur",
    "pk": "8 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14170",
    "n": "Hvítlauksduft",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15151",
    "n": "Hvítlauks og rósmarin marinering",
    "pk": "4 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15874",
    "n": "Hvítlauksolía sterk Raps",
    "pk": "4,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10722",
    "n": "Italia sósa Raps",
    "pk": "4 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13300",
    "n": "Hvítlaukur fljótandi Raps 1,0",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11397",
    "n": "Hvítlaukspipar",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10640",
    "n": "Ítalío sósa #",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12772",
    "n": "Jurtakrydd Kötlu",
    "pk": "6 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10666",
    "n": "Jambolak Raps",
    "pk": "7 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10233",
    "n": "Jager seasoning #MU",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14354",
    "n": "Trefjar Canasel WWF 200",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11845",
    "n": "Kartöflukrydd 10 kg #MU",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15133",
    "n": "Karrý Kötlublanda",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14167",
    "n": "Karrý 15 kg",
    "pk": "15 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12993",
    "n": "Kartöflumjöl 25Kg.",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10384",
    "n": "Kjúklingabredding #",
    "pk": "8 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15538",
    "n": "KATLA Phosphates 2110",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10246",
    "n": "Kartöflumús 4 kg #",
    "pk": "4 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11964",
    "n": "Kjúklingakraftur án msg Raps #CE",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15073",
    "n": "Kjötkraftur Exter 301 (CL)",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11893",
    "n": "Kjötfarsblanda Kötlu #",
    "pk": "3,740 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11843",
    "n": "Kjúklingakrydd Kötlu 10 kg",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13129",
    "n": "Kjötmeyrir Kötlu",
    "pk": "15 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10406",
    "n": "Kryddblanda Svína Katla #",
    "pk": "11 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12027",
    "n": "Kryddblanda Hörpu #",
    "pk": "8 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10443",
    "n": "Kryddblanda G-1 Einar Ólafsson",
    "pk": "8 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15170",
    "n": "Kryddblanda Teryaki",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10980",
    "n": "Laukduft",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15964",
    "n": "Lakkrískryddblanda Raps",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15324",
    "n": "Kryddblanda Thai",
    "pk": "6 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10981",
    "n": "Laukduft granulated 0.6 mm",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15903",
    "n": "Lárviðarlauf heil",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14184",
    "n": "Laukur hakkaður",
    "pk": "18 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12366",
    "n": "Laukhringir 14 kg",
    "pk": "14 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14228",
    "n": "Lárviðarlauf malað",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14335",
    "n": "Lemongrass Marinade Raps",
    "pk": "4,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11013",
    "n": "Lemon crisp #GL",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10719",
    "n": "Lemon bragðefni Raps",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15185",
    "n": "Lime & Karrý Marinering #",
    "pk": "4 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15301",
    "n": "Magic Mango chili Raps",
    "pk": "2,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15882",
    "n": "Magic Inferno Raps",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15880",
    "n": "Magic Brasil Raps",
    "pk": "4,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15881",
    "n": "Magic Orange Thyme Raps",
    "pk": "4,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14033",
    "n": "Magnesiumcarbonat",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10728",
    "n": "Magic Spicy Mariner. (Grill Magic) Raps",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10744",
    "n": "Magic pepper Raps",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14357",
    "n": "Maltodextrin DE 15-20",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14171",
    "n": "Marjoram 3mm",
    "pk": "7,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15879",
    "n": "Maripur Chipotle Raps",
    "pk": "2,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15810",
    "n": "Maltodextrin DE 28-31",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12200",
    "n": "Meat Love (RAPS)",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14086",
    "n": "Mila Katla #SOJA",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10746",
    "n": "Mexicosósa Raps",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14046",
    "n": "Meatline 3451",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11008",
    "n": "MSG",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15626",
    "n": "Net 100 mm Supreme hvítt/hvítt 100 mtr",
    "pk": "15 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14179",
    "n": "Negull duft",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10698",
    "n": "Múskat",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10947",
    "n": "Net 18 standard hvítt 100 mtr 150 mm",
    "pk": "10 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14306",
    "n": "Net Hvítt 700 metrar ( 150 mm )",
    "pk": "700 m",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14318",
    "n": "Net Hvítt  ultra peel 700 mtr (130mm)",
    "pk": "700 m",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13250",
    "n": "Net Hvítt 150 mm clear",
    "pk": "10 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15933",
    "n": "Net rautt/hvítt NE30317X 130MM",
    "pk": "8 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15883",
    "n": "Nítritsalt 0,45% nítrit",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10960",
    "n": "Net RW 4 18 rautt/glært, 130mm, 100 mt",
    "pk": "10 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14275",
    "n": "Net RW 4 18 rautt/glært 800 mt 130mm",
    "pk": "800 m",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10822",
    "n": "Nítritsalt 0,6% (25 KG)",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12869",
    "n": "Oriental Katla #SE",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11419",
    "n": "Oregano fínt",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14229",
    "n": "Oregano 3 mm",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14233",
    "n": "Orientalsósa Kötlu #",
    "pk": "4 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13177",
    "n": "Paprika extract 40000 Raps",
    "pk": "3 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10646",
    "n": "Paprika 3000 Raps",
    "pk": "1,3 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14230",
    "n": "Paprika 100asta",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14230",
    "n": "Paprika græn 3 mm",
    "pk": "18 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15720",
    "n": "Paprikubitar rauðir 1,5-4mm",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15719",
    "n": "Paprikubitar grænir 1,5-4mm",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10850",
    "n": "Paprikubitar fínir",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10656",
    "n": "Pepperoni authentic Raps",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15670",
    "n": "Phosphate, pækilfosfat kjöt",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15669",
    "n": "Phosphate fyrir farsvörur, kjöt",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12519",
    "n": "Pesto Rosso Raps",
    "pk": "2,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10647",
    "n": "Pipar grænn fljótandi Raps",
    "pk": "1,3 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14226",
    "n": "Pipar svarturmilli grófur",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10992",
    "n": "Pipar svartur fínn",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14231",
    "n": "Pipar Hvítur",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11003",
    "n": "Piparmix med paprika/  D-279",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12564",
    "n": "Raps red",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14255",
    "n": "Prótein Alpha 8+ # SOJA",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14049",
    "n": "Potassium Chloride FG+AC",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14215",
    "n": "Raspur gulur grófur UC 3-325 #",
    "pk": "18 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14131",
    "n": "Raspur gulur NA 3-187 #GL",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15742",
    "n": "Raspur gulur NA 3 – 428 #GL",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14220",
    "n": "Raspur Gulur í fötu #",
    "pk": "2,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14309",
    "n": "Raspur hvítur fínn LO-318 #",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14219",
    "n": "Raspur retail án E efna # 2,5 kg",
    "pk": "2,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15842",
    "n": "Raspur rauður grófur UC 4-393 #GL",
    "pk": "18 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14175",
    "n": "Raspur hvítur UC 1-036 #GL",
    "pk": "15 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13940",
    "n": "Raspur Retail án E efna # 20kg",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11011",
    "n": "Rósmarín 2 mm",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13181",
    "n": "Rauðvíns Marinering Kötlu",
    "pk": "4 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13128",
    "n": "Rauður, Kötlu",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11014",
    "n": "Salvía gróf  Culinar",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15319",
    "n": "Sellerýsalt #CE",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10700",
    "n": "Sellerý duft #CE",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10706",
    "n": "Samba Raps #",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15258",
    "n": "Sesamhjúpur",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15627",
    "n": "Sítrónupipar án E efna #",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10970",
    "n": "Sinnepsfræ #MU",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11010",
    "n": "Sinnepsduft  #MU",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10768",
    "n": "Sítrónupipar án MSG #CE #MU",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14222",
    "n": "Smjörolía",
    "pk": "5 l",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14154",
    "n": "Smjör bragðefni",
    "pk": "5 l",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15554",
    "n": "Skankahettur 440 MU – 10000 stk",
    "pk": "10000 stk",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10645",
    "n": "Smokal liquid Raps",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14247",
    "n": "Spear mint",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13137",
    "n": "Sodium Acetate",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11415",
    "n": "Smokal powder Raps",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10672",
    "n": "Spice extract  ws ECO Raps",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10618",
    "n": "Steinselja Raps",
    "pk": "8 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14177",
    "n": "Steinselja (Parsley Leaves)",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10671",
    "n": "Stabilaton os Raps",
    "pk": "200 g",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10842",
    "n": "Sterkja Batterbind SC (1422)",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10799",
    "n": "Sterkja Frigex W (1442)",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10795",
    "n": "Sterkja Firmtex (E1442)",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10801",
    "n": "Sterkja Colflo 67 (E1422)",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15906",
    "n": "Sterkja Homecraft Pulse 3103",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15732",
    "n": "Sterkja N Hance 59",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15701",
    "n": "Sterkja N Creamer 2230 (E1450)",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11394",
    "n": "Sterkja Instant Pure Flo F (E1442)",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14133",
    "n": "Sterkja N-Dulge C1",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11004",
    "n": "Svartur pipar grófur(Brotinn)",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12093",
    "n": "Súpujurtir 10 mm extra",
    "pk": "15 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15700",
    "n": "Sterkja Ultra tex 2131 (E1422)",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15801",
    "n": "Tandori seasoning Raps no ALG",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10860",
    "n": "Tómatbitar",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10971",
    "n": "Timjan 5 Kg.",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10973",
    "n": "Tarragon",
    "pk": "8 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10862",
    "n": "Tómatduft",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14084",
    "n": "Trefjar Sanacel bambus BF 40",
    "pk": "15 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15632",
    "n": "Trefjar Canacel cellulose BF 200 LDL",
    "pk": "20 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13861",
    "n": "Traditionel Marinering Kötlu #",
    "pk": "10 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15910",
    "n": "Trefjar Sanacel potato PF 300PO",
    "pk": "15 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10704",
    "n": "Varianta Raps #",
    "pk": "1 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "14225",
    "n": "Turmeric",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "15682",
    "n": "Trefjar Sanacel sugarcane SC 40",
    "pk": "15 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "11871",
    "n": "Veitingahúsadrykkur",
    "pk": "7,5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "13164",
    "n": "Þurrmarinering French Garlic",
    "pk": "5 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "10839",
    "n": "Þrúgusykur (Dextrose)",
    "pk": "25 kg",
    "pdf": "",
    "img": "",
    "d": ""
   },
   {
    "nr": "12158",
    "n": "Þórsmerkurblanda #",
    "pk": "6 kg",
    "pdf": "",
    "img": "",
    "d": ""
   }
  ]
 }
]
