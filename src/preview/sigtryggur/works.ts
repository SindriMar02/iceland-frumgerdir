/* GENERATED from sigtryggurbjarni.is (his own Wix galleries, harvested 2026-08-06).
 * 212 works across 15 series that HE named and grouped.
 * Titles, years, sizes, techniques and provenance are his, verbatim from the item
 * metadata on his own site. Colours are SAMPLED from the paintings themselves.
 * Series names are not translated — exhibition and place names stay in Icelandic.
 * NOTE: his site server-renders only 25 items per gallery, so this is 212 of
 * the 409 works his own galleries report. Regenerate with scratchpad/gen-sb-data.mjs. */

export type Medium = 'olia' | 'vatnslitur'

export interface Work {
  id: string
  title: string
  series: string
  /** 1-based position inside its series */
  n: number
  year: number | null
  size: string | null
  tech: string | null
  /** who owns it now, in his words (einkaeign / eign listamannsins / safn) */
  prov: string | null
  medium: Medium | null
  colours: string[]
  w: number
  h: number
}

export interface Series {
  id: string
  name: string
  /** kept identical to `name`: his series are exhibition and place names, which
   *  are not translated. The EN toggle changes the chrome, never his titles. */
  en: string
  hero: string
  /** the solo exhibition this series was shown in, from his own CV */
  show: { title: string; venue: string; year: number } | null
  from: number | null
  to: number | null
  count: number
}

export const COLOUR_HEX: Record<string, string> = {
  "Blár": "#2E4A7D",
  "Grár": "#8C8C8E",
  "Hvítur": "#EEECE8",
  "Gulur": "#D9A93A",
  "Svartur": "#141416",
  "Brúnn": "#6B4B33",
  "Rauður": "#A8321E",
  "Grænn": "#4A6440",
  "Fjólublár": "#6B4E86",
  "Bleikur": "#D9899A"
}

export const COLOUR_EN: Record<string, string> = {
  "Blár": "Blue", "Grár": "Grey", "Hvítur": "White", "Gulur": "Yellow",
  "Svartur": "Black", "Brúnn": "Brown", "Rauður": "Red", "Grænn": "Green",
  "Fjólublár": "Purple", "Bleikur": "Pink"
}

export const SERIES: Series[] = [
  { id: "staumvotn-og-vatnsfletir", name: "Straumvötn og vatnsfletir", en: "Straumvötn og vatnsfletir", hero: "staumvotn-og-vatnsfletir", show: null, from: 2010, to: 2018, count: 23 },
  { id: "hedinsfjordur", name: "Héðinsfjörður", en: "Héðinsfjörður", hero: "hedinsfjordur", show: null, from: 2018, to: 2023, count: 25 },
  { id: "modan-graa", name: "Móðan gráa", en: "Móðan gráa", hero: "modan-graa", show: { title: "Móðan gráa", venue: "Listasafn ASÍ, Reykjavík", year: 2011 }, from: 2010, to: 2011, count: 25 },
  { id: "merlmyndir", name: "Merlmyndir", en: "Merlmyndir", hero: "merlmyndir", show: null, from: 1998, to: 2010, count: 10 },
  { id: "bruara", name: "Brúará", en: "Brúará", hero: "bruara", show: null, from: 2005, to: 2010, count: 7 },
  { id: "7-himnar", name: "7 himnar", en: "7 himnar", hero: "7-himnar", show: { title: "Sjö himnar", venue: "Árbæjarkirkja, Reykjavík", year: 2010 }, from: 2008, to: 2008, count: 8 },
  { id: "litir-kvarans", name: "Litir Kvarans", en: "Litir Kvarans", hero: "litir-kvarans", show: { title: "Útvarp Mýri – Litir Kvarans", venue: "Hverfisgallerí, Reykjavík", year: 2018 }, from: 2016, to: 2017, count: 10 },
  { id: "vatnslitur", name: "Vatnslitamyndir", en: "Vatnslitamyndir", hero: "vatnslitur", show: { title: "Eftir regnið", venue: "Kompan, Siglufirði", year: 2020 }, from: 2016, to: 2020, count: 11 },
  { id: "360-dagar-i-grasagardinum", name: "360 dagar í grasagarðinum", en: "360 dagar í grasagarðinum", hero: "360-dagar-i-grasagardinum", show: { title: "360 dagar í grasagarðinum", venue: "Hallgrímskirkja, Reykjavík", year: 2014 }, from: 2014, to: 2014, count: 24 },
  { id: "vindvaettir", name: "Vindvættir", en: "Vindvættir", hero: "vindvaettir", show: null, from: 2010, to: 2010, count: 14 },
  { id: "i-minningu-rothko", name: "Í minningu Rothko", en: "Í minningu Rothko", hero: "i-minningu-rothko", show: { title: "Í minningu Rothko", venue: "Hallgrímskirkja, Reykjavík", year: 2002 }, from: 2000, to: 2001, count: 4 },
  { id: "sjotta-svitan", name: "Sjötta svítan", en: "Sjötta svítan", hero: "sjotta-svitan", show: null, from: 2021, to: 2021, count: 6 },
  { id: "stanmer-skogur", name: "Stanmer skógur", en: "Stanmer skógur", hero: "stanmer-skogur", show: null, from: 2014, to: 2014, count: 4 },
  { id: "giardini-publicchi-treemix-remix", name: "Giardini Publicchi", en: "Giardini Publicchi", hero: "giardini-publicchi-treemix-remix", show: { title: "Treemix-Remix", venue: "Englaborg, Reykjavík", year: 2002 }, from: 2002, to: 2003, count: 16 },
  { id: "gomul-verk-skolaverk", name: "Gömul verk og skólaverk", en: "Gömul verk og skólaverk", hero: "gomul-verk-skolaverk", show: null, from: 1992, to: 2004, count: 25 },
]

export const WORKS: Work[] = [
  { id: "staumvotn-og-vatnsfletir-082", title: "Merlandi Héðinsfjarðarvatn", series: "staumvotn-og-vatnsfletir", n: 1, year: 2018, size: "190x 250 cm", tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Blár"], w: 1276, h: 968 },
  { id: "staumvotn-og-vatnsfletir-083", title: "Merlandi Skagafjörður 5", series: "staumvotn-og-vatnsfletir", n: 2, year: 2016, size: "160x140 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Svartur","Grár"], w: 1090, h: 1233 },
  { id: "staumvotn-og-vatnsfletir-084", title: "Merlandi Skagafjörður 4", series: "staumvotn-og-vatnsfletir", n: 3, year: 2016, size: "135x170 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Grár","Blár"], w: 1440, h: 1102 },
  { id: "staumvotn-og-vatnsfletir-085", title: "Merlandi Skagafjörður 3", series: "staumvotn-og-vatnsfletir", n: 4, year: 2016, size: "140x160 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár","Grár","Svartur"], w: 1276, h: 1098 },
  { id: "staumvotn-og-vatnsfletir-086", title: "Merlandi Höfðavatn", series: "staumvotn-og-vatnsfletir", n: 5, year: 2015, size: "70x60", tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Grár","Blár"], w: 1051, h: 1223 },
  { id: "staumvotn-og-vatnsfletir-087", title: "Héðinsfjarðará 2", series: "staumvotn-og-vatnsfletir", n: 6, year: null, size: "125x145 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 1276, h: 977 },
  { id: "staumvotn-og-vatnsfletir-088", title: "Ermarsund 2", series: "staumvotn-og-vatnsfletir", n: 7, year: 2014, size: "167x174 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 1134, h: 1099 },
  { id: "staumvotn-og-vatnsfletir-089", title: "Ermarsund 1", series: "staumvotn-og-vatnsfletir", n: 8, year: 2013, size: "90x100 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Grár","Blár"], w: 1134, h: 1020 },
  { id: "staumvotn-og-vatnsfletir-090", title: "Sjórinn við Stokksnes", series: "staumvotn-og-vatnsfletir", n: 9, year: 2013, size: "80x90 cm", tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Blár"], w: 1134, h: 1011 },
  { id: "staumvotn-og-vatnsfletir-091", title: "Grátjörn", series: "staumvotn-og-vatnsfletir", n: 10, year: 2016, size: "135x165 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Grár"], w: 1134, h: 1339 },
  { id: "staumvotn-og-vatnsfletir-092", title: "Ólafsfjarðarvatn", series: "staumvotn-og-vatnsfletir", n: 11, year: 2017, size: "170x130 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 1134, h: 1509 },
  { id: "staumvotn-og-vatnsfletir-093", title: "Heiðarvatn", series: "staumvotn-og-vatnsfletir", n: 12, year: 2016, size: "170x130 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 1134, h: 1495 },
  { id: "staumvotn-og-vatnsfletir-094", title: "Héðinsfjarðará", series: "staumvotn-og-vatnsfletir", n: 13, year: 2013, size: "100x120 cm", tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Grár"], w: 1134, h: 942 },
  { id: "staumvotn-og-vatnsfletir-095", title: "Sindrandi Miðfjarðará", series: "staumvotn-og-vatnsfletir", n: 14, year: 2015, size: "90x110 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár","Grár"], w: 1134, h: 921 },
  { id: "staumvotn-og-vatnsfletir-096", title: "Miðfjarðará", series: "staumvotn-og-vatnsfletir", n: 15, year: 2017, size: "55x70 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár","Grænn"], w: 1276, h: 1001 },
  { id: "staumvotn-og-vatnsfletir-097", title: "Miðfjarðará", series: "staumvotn-og-vatnsfletir", n: 16, year: 2017, size: "55x70 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Grænn","Blár"], w: 1276, h: 1004 },
  { id: "staumvotn-og-vatnsfletir-098", title: "Vindur á vatni 1", series: "staumvotn-og-vatnsfletir", n: 17, year: 2010, size: "66x101 cm", tech: "vatnslitur á pappír", prov: "einkaeign", medium: "vatnslitur", colours: ["Hvítur","Blár"], w: 992, h: 763 },
  { id: "staumvotn-og-vatnsfletir-099", title: "Vindur á vatni 2", series: "staumvotn-og-vatnsfletir", n: 18, year: 2010, size: "66x101 cm", tech: "vatnslitur á pappír", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Hvítur","Blár"], w: 925, h: 745 },
  { id: "staumvotn-og-vatnsfletir-100", title: "Vindur á vatni 3", series: "staumvotn-og-vatnsfletir", n: 19, year: 2010, size: "66x101 cm", tech: "vatnslitur á pappír", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Hvítur","Blár"], w: 1015, h: 757 },
  { id: "staumvotn-og-vatnsfletir-101", title: "Vindur á vatni 4", series: "staumvotn-og-vatnsfletir", n: 20, year: 2010, size: "66x101 cm", tech: "vatnslitur á pappír", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Hvítur"], w: 888, h: 751 },
  { id: "staumvotn-og-vatnsfletir-102", title: "Vindur á  vatni græn", series: "staumvotn-og-vatnsfletir", n: 21, year: 2010, size: "75x80 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár","Grænn"], w: 850, h: 796 },
  { id: "staumvotn-og-vatnsfletir-103", title: "Vindur á vatni blá", series: "staumvotn-og-vatnsfletir", n: 22, year: 2010, size: "75x80 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 1134, h: 1062 },
  { id: "staumvotn-og-vatnsfletir-104", title: "Jökulsá", series: "staumvotn-og-vatnsfletir", n: 23, year: 2012, size: "120x140 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár","Grár","Brúnn"], w: 992, h: 876 },
  { id: "hedinsfjordur-015", title: "Haust 1", series: "hedinsfjordur", n: 1, year: 2022, size: "107x129 cm", tech: "vatnslitur", prov: "einkaeign", medium: "vatnslitur", colours: ["Gulur"], w: 704, h: 850 },
  { id: "hedinsfjordur-016", title: "Haust 2", series: "hedinsfjordur", n: 2, year: 2022, size: "107x 124 cm", tech: "vatnslitur", prov: "eign Listasafn Íslands", medium: "vatnslitur", colours: ["Gulur"], w: 850, h: 734 },
  { id: "hedinsfjordur-017", title: "Valur", series: "hedinsfjordur", n: 3, year: 2022, size: "110x129 cm", tech: "vatnslitur", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Gulur"], w: 850, h: 724 },
  { id: "hedinsfjordur-018", title: "Benda", series: "hedinsfjordur", n: 4, year: 2022, size: "109x145 cm", tech: "vatnslitur", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Gulur"], w: 850, h: 635 },
  { id: "hedinsfjordur-019", title: "Flótti 1", series: "hedinsfjordur", n: 5, year: 2022, size: "107x130 cm", tech: "vatnslitur", prov: "einkaeign", medium: "vatnslitur", colours: ["Gulur","Rauður"], w: 850, h: 701 },
  { id: "hedinsfjordur-020", title: "Farinn", series: "hedinsfjordur", n: 6, year: 2022, size: "106x128 cm", tech: "vatnslitur", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Rauður"], w: 850, h: 718 },
  { id: "hedinsfjordur-021", title: "Flekar", series: "hedinsfjordur", n: 7, year: 2022, size: "109x129 cm", tech: "vatnslitur", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Gulur"], w: 850, h: 728 },
  { id: "hedinsfjordur-022", title: "Ætt", series: "hedinsfjordur", n: 8, year: 2022, size: "88x110 cm", tech: "vatnslitur", prov: "einkaeign", medium: "vatnslitur", colours: ["Gulur"], w: 850, h: 679 },
  { id: "hedinsfjordur-023", title: "Fimm fiskar", series: "hedinsfjordur", n: 9, year: 2022, size: "76x109 cm", tech: "vatnslitur", prov: "einkaeign", medium: "vatnslitur", colours: ["Gulur","Grár"], w: 850, h: 606 },
  { id: "hedinsfjordur-024", title: "Aftur og aftur", series: "hedinsfjordur", n: 10, year: 2022, size: "60x93 cm", tech: "vatnslitur", prov: "einkaeign", medium: "vatnslitur", colours: ["Rauður","Gulur","Grár"], w: 850, h: 539 },
  { id: "hedinsfjordur-025", title: "Ganga", series: "hedinsfjordur", n: 11, year: 2022, size: "230x130 cm", tech: "vatnslitur á pappír", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Gulur","Rauður"], w: 568, h: 1020 },
  { id: "hedinsfjordur-026", title: "Par", series: "hedinsfjordur", n: 12, year: 2022, size: "230x130 cm", tech: "vatnslitur", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Gulur"], w: 543, h: 992 },
  { id: "hedinsfjordur-027", title: "Skjól", series: "hedinsfjordur", n: 13, year: 2023, size: "93x111cm", tech: "vatnslitur", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Hvítur","Grár"], w: 850, h: 706 },
  { id: "hedinsfjordur-028", title: "Mýri 8", series: "hedinsfjordur", n: 14, year: 2021, size: "100x105 cm", tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Grár","Blár"], w: 1134, h: 1085 },
  { id: "hedinsfjordur-029", title: "Mýri 9", series: "hedinsfjordur", n: 15, year: 2021, size: "100x105 cm", tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Grár"], w: 1134, h: 1089 },
  { id: "hedinsfjordur-030", title: "Eftir regnið 14 agust 12:29:25", series: "hedinsfjordur", n: 16, year: 2020, size: "100x120 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 1276, h: 1049 },
  { id: "hedinsfjordur-031", title: "Eftir regnið olía 14. ágúst", series: "hedinsfjordur", n: 17, year: 2020, size: "100x120 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Fjólublár","Grár"], w: 1276, h: 1024 },
  { id: "hedinsfjordur-032", title: "Eftir regnið 14. ágúst 12:32:00", series: "hedinsfjordur", n: 18, year: 2020, size: "101x67 cm", tech: "vatnslitur á pappír", prov: "einkaeign", medium: "vatnslitur", colours: ["Blár"], w: 1134, h: 1630 },
  { id: "hedinsfjordur-033", title: "Eftir regnið 14. ágúst 12:11:09", series: "hedinsfjordur", n: 19, year: 2020, size: "101x67 cm", tech: "vatnslitur á pappír", prov: "einkaeign", medium: "vatnslitur", colours: ["Blár"], w: 1417, h: 2070 },
  { id: "hedinsfjordur-034", title: "Eftir regnið 14 ágúst 12:10:51", series: "hedinsfjordur", n: 20, year: 2020, size: "101x67 cm", tech: "vatnslitur á pappír", prov: "einkaeign", medium: "vatnslitur", colours: ["Blár"], w: 1417, h: 2059 },
  { id: "hedinsfjordur-035", title: "Héðinsfjarðará 4", series: "hedinsfjordur", n: 21, year: 2021, size: "50x60 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár","Svartur","Grár"], w: 1417, h: 1174 },
  { id: "hedinsfjordur-036", title: "Héðinsfjarðará 3", series: "hedinsfjordur", n: 22, year: 2021, size: "50x55 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár","Svartur"], w: 1361, h: 1193 },
  { id: "hedinsfjordur-037", title: "Mýri 6", series: "hedinsfjordur", n: 23, year: 2018, size: "115x95 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 1134, h: 1365 },
  { id: "hedinsfjordur-038", title: "Mýri 7", series: "hedinsfjordur", n: 24, year: 2018, size: "115x95 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 1134, h: 1392 },
  { id: "hedinsfjordur-039", title: "Merlandi Héðinsfjarðarvatn", series: "hedinsfjordur", n: 25, year: 2018, size: "190x 250", tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Blár"], w: 1276, h: 968 },
  { id: "modan-graa-121", title: "Jökulsá nr 1", series: "modan-graa", n: 1, year: 2011, size: "50x60 cm", tech: "olía á mdf", prov: "einkaeign", medium: "olia", colours: ["Grár","Svartur"], w: 1134, h: 936 },
  { id: "modan-graa-122", title: "Jökulsá nr 2", series: "modan-graa", n: 2, year: 2011, size: "50x60 cm", tech: "olía á mdf", prov: "einkaeign", medium: "olia", colours: ["Grár"], w: 1134, h: 947 },
  { id: "modan-graa-123", title: "Jökulsá nr 4", series: "modan-graa", n: 3, year: 2011, size: "60x50 cm", tech: "olía á mdf", prov: "eign listamannsins", medium: "olia", colours: ["Grár"], w: 1134, h: 1373 },
  { id: "modan-graa-124", title: "Jökulsá nr 5", series: "modan-graa", n: 4, year: 2011, size: "50x60 cm", tech: "olía á mdf", prov: "eign listamannsins", medium: "olia", colours: ["Grár"], w: 1134, h: 938 },
  { id: "modan-graa-125", title: "Jökulsá nr 7", series: "modan-graa", n: 5, year: 2011, size: "50x60 cm", tech: "olía á mdf", prov: "eign listamannsins", medium: "olia", colours: ["Grár"], w: 1134, h: 939 },
  { id: "modan-graa-126", title: "Jökulsá nr 9", series: "modan-graa", n: 6, year: 2011, size: "50x60 cm", tech: "olía á mdf", prov: "eign listamannsins", medium: "olia", colours: ["Grár"], w: 1134, h: 940 },
  { id: "modan-graa-127", title: "Jökulsá á Fjöllum", series: "modan-graa", n: 7, year: 2010, size: "155x140 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Grár","Blár"], w: 1134, h: 1216 },
  { id: "modan-graa-128", title: "Jökulsá á Fjöllum II", series: "modan-graa", n: 8, year: 2011, size: "190x250 cm+150x250 cm", tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Grár"], w: 992, h: 1383 },
  { id: "modan-graa-129", title: "Yfirlit", series: "modan-graa", n: 9, year: null, size: null, tech: null, prov: null, medium: null, colours: ["Grár","Brúnn"], w: 1233, h: 890 },
  { id: "modan-graa-130", title: "Jökulsá vatnslitur 1", series: "modan-graa", n: 10, year: 2011, size: "115x119 cm", tech: "vatnslitur á pappír", prov: "einkaeign", medium: "vatnslitur", colours: ["Grár","Hvítur"], w: 1134, h: 1051 },
  { id: "modan-graa-131", title: "Jökulsá vatnslitur spegluð", series: "modan-graa", n: 11, year: 2011, size: "115x178 cm", tech: "vatnslitur á pappír", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Hvítur","Grár"], w: 1417, h: 893 },
  { id: "modan-graa-132", title: "Jökulsá vatnslitur tvíspegluð", series: "modan-graa", n: 12, year: 2011, size: "115x130 cm", tech: "vatnslitur á pappír", prov: "einkaeign", medium: "vatnslitur", colours: ["Grár","Blár","Hvítur"], w: 1134, h: 887 },
  { id: "modan-graa-133", title: "Jökulsárárar 1", series: "modan-graa", n: 13, year: 2011, size: "45x37 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár","Svartur"], w: 1063, h: 1276 },
  { id: "modan-graa-134", title: "Jökulsárárar 2", series: "modan-graa", n: 14, year: 2011, size: "45x37 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1063, h: 1276 },
  { id: "modan-graa-135", title: "Jökulsárárar 3", series: "modan-graa", n: 15, year: 2011, size: "25x30 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár","Svartur"], w: 1134, h: 1360 },
  { id: "modan-graa-136", title: "Jökulsárárar 4", series: "modan-graa", n: 16, year: 2011, size: "30x25 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1134, h: 1360 },
  { id: "modan-graa-137", title: "Jökulsárárar 5", series: "modan-graa", n: 17, year: 2011, size: "60x50 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár","Svartur"], w: 1134, h: 1361 },
  { id: "modan-graa-138", title: "Jökulsárárar 6", series: "modan-graa", n: 18, year: 2011, size: "60x50 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1134, h: 1361 },
  { id: "modan-graa-139", title: "Jökulsárárar 7", series: "modan-graa", n: 19, year: 2011, size: "30x25 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár","Svartur","Hvítur"], w: 1134, h: 1360 },
  { id: "modan-graa-140", title: "Jökulsárárar 8", series: "modan-graa", n: 20, year: 2011, size: "30x25 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1134, h: 1360 },
  { id: "modan-graa-141", title: "Jökulsárárar 9", series: "modan-graa", n: 21, year: 2011, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1134, h: 1361 },
  { id: "modan-graa-142", title: "Jökulsárárar 10", series: "modan-graa", n: 22, year: 2011, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1134, h: 1361 },
  { id: "modan-graa-143", title: "Jökulsárárar 11", series: "modan-graa", n: 23, year: 2011, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1134, h: 1361 },
  { id: "modan-graa-144", title: "Jökulsárárar 12", series: "modan-graa", n: 24, year: 2011, size: "60x50 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1134, h: 1361 },
  { id: "modan-graa-145", title: "Jökulsárárar 13", series: "modan-graa", n: 25, year: 2011, size: "45x37 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1134, h: 1361 },
  { id: "merlmyndir-146", title: "Merlandi Brúará", series: "merlmyndir", n: 1, year: 2008, size: "140x130 cm", tech: "olía á striga", prov: null, medium: "olia", colours: ["Blár"], w: 1134, h: 1221 },
  { id: "merlmyndir-147", title: "Blikandi Brúará", series: "merlmyndir", n: 2, year: 2008, size: "80x80 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 992, h: 996 },
  { id: "merlmyndir-148", title: "Jökulsá á Fjöllum", series: "merlmyndir", n: 3, year: 2010, size: "155x140 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Grár","Blár"], w: 765, h: 821 },
  { id: "merlmyndir-149", title: "Brúará 5", series: "merlmyndir", n: 4, year: 2005, size: "120x160 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 992, h: 743 },
  { id: "merlmyndir-150", title: "Blár merlandi sjór", series: "merlmyndir", n: 5, year: 2000, size: "150x150 cm", tech: "olía á striga", prov: "Listasafn Reykjavíkur", medium: "olia", colours: ["Blár"], w: 1134, h: 1113 },
  { id: "merlmyndir-151", title: "Stór röndóttur merlandi sjór", series: "merlmyndir", n: 6, year: 1999, size: "180x200 cm", tech: "olía á striga", prov: "Listasafn Íslands", medium: "olia", colours: ["Blár"], w: 1353, h: 1213 },
  { id: "merlmyndir-152", title: "Stór gul merlandi", series: "merlmyndir", n: 7, year: 2000, size: "200x200 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Gulur"], w: 992, h: 991 },
  { id: "merlmyndir-153", title: "Lítil gul merlandi", series: "merlmyndir", n: 8, year: 1999, size: "40x40", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Rauður"], w: 1134, h: 1126 },
  { id: "merlmyndir-154", title: "Speglaðar rendur og merl", series: "merlmyndir", n: 9, year: null, size: "60x60 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár","Rauður","Brúnn"], w: 1134, h: 1137 },
  { id: "merlmyndir-155", title: "Fenomen", series: "merlmyndir", n: 10, year: 1998, size: "40x40 cm", tech: "olía á krossvið", prov: "einkaeign", medium: "olia", colours: ["Hvítur"], w: 1417, h: 1417 },
  { id: "bruara-008", title: "Brúará 4", series: "bruara", n: 1, year: 2005, size: "120x160 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár","Rauður"], w: 1134, h: 846 },
  { id: "bruara-009", title: "Brúará púsl 1 & 2", series: "bruara", n: 2, year: 2006, size: "Brúará púsl 1, á gólfi (120x160cm), Brúará púsl 2, á vegg (300x500cm)", tech: "Brúará púsl 1, á gólfi (120x160cm), Brúará púsl 2, á vegg (300x500cm)", prov: "einkaeign", medium: null, colours: ["Hvítur","Gulur"], w: 1134, h: 1236 },
  { id: "bruara-010", title: "Brúará púsl 2", series: "bruara", n: 3, year: 2006, size: "300x500 cm", tech: "olía á pvc plast í um það bil 100 hlutum", prov: "einkaeign", medium: "olia", colours: ["Hvítur"], w: 1126, h: 721 },
  { id: "bruara-011", title: "Brúará hvít", series: "bruara", n: 4, year: 2010, size: null, tech: "pvc plast", prov: "eign listamannsins", medium: "olia", colours: ["Grár","Gulur"], w: 1134, h: 756 },
  { id: "bruara-012", title: "Brúará hvít", series: "bruara", n: 5, year: 2007, size: null, tech: "á gólf Listasafni ASÍ, Ásmundarsal", prov: "á gólf Listasafni ASÍ, Ásmundarsal", medium: null, colours: ["Grár","Svartur"], w: 1134, h: 818 },
  { id: "bruara-013", title: "Brúará hvít spegluð", series: "bruara", n: 6, year: 2008, size: null, tech: "pvc plast", prov: null, medium: "olia", colours: ["Grár","Brúnn","Hvítur"], w: 1134, h: 1511 },
  { id: "bruara-014", title: "Brúará hvít", series: "bruara", n: 7, year: 2008, size: null, tech: "pvc plast", prov: "eign listamannsins", medium: "olia", colours: ["Grár","Svartur","Hvítur"], w: 1134, h: 851 },
  { id: "7-himnar-000", title: "Himininn yfir Skjálfandaflóa", series: "7-himnar", n: 1, year: 2008, size: "130x155 cm", tech: "olía á striga", prov: null, medium: "olia", colours: ["Blár","Hvítur"], w: 1134, h: 1008 },
  { id: "7-himnar-001", title: "Himininn yfir Húnavatnssýslu", series: "7-himnar", n: 2, year: 2008, size: "160x140 cm", tech: "olía á striga", prov: null, medium: "olia", colours: ["Blár","Gulur"], w: 1956, h: 2142 },
  { id: "7-himnar-002", title: "Himininn í Dölunum", series: "7-himnar", n: 3, year: 2008, size: "120x140 cm", tech: "olía á striga", prov: null, medium: "olia", colours: ["Hvítur","Svartur","Blár"], w: 1134, h: 991 },
  { id: "7-himnar-003", title: "Himininn yfir Breiðafirði", series: "7-himnar", n: 4, year: 2008, size: "140x140 cm", tech: "olía á striga", prov: null, medium: "olia", colours: ["Blár","Hvítur"], w: 1134, h: 1087 },
  { id: "7-himnar-004", title: "Himininn yfir Snæfellsöræfum", series: "7-himnar", n: 5, year: 2008, size: "140x170 cm", tech: "olía á striga", prov: null, medium: "olia", colours: ["Blár","Hvítur"], w: 1134, h: 1237 },
  { id: "7-himnar-005", title: "Himininn yfir Skálavík", series: "7-himnar", n: 6, year: 2008, size: "120x130 cm", tech: "olía á striga", prov: null, medium: "olia", colours: ["Blár","Hvítur"], w: 1134, h: 1008 },
  { id: "7-himnar-006", title: "Himininn yfir Látrabjargi", series: "7-himnar", n: 7, year: 2008, size: "180x180 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Hvítur","Rauður","Brúnn"], w: 1134, h: 1167 },
  { id: "7-himnar-007", title: "Himinninn yfir Látrabjargi II", series: "7-himnar", n: 8, year: 2008, size: "180x180 cm", tech: "olía á striga", prov: null, medium: "olia", colours: ["Grár","Brúnn","Hvítur"], w: 1134, h: 1147 },
  { id: "litir-kvarans-111", title: "Í minningu Kvarans 1", series: "litir-kvarans", n: 1, year: 2016, size: "57x47 cm", tech: "gvass á pappír", prov: "einkaeign", medium: "vatnslitur", colours: ["Brúnn","Svartur","Blár"], w: 1134, h: 1354 },
  { id: "litir-kvarans-112", title: "Í minningu Kvarans 2", series: "litir-kvarans", n: 2, year: 2016, size: "57x47 cm", tech: "gvass á pappír", prov: "einkaeign", medium: "vatnslitur", colours: ["Blár","Svartur"], w: 1134, h: 1334 },
  { id: "litir-kvarans-113", title: "Í minningu kvarans 3", series: "litir-kvarans", n: 3, year: 2016, size: "57x47 cm", tech: "gvass á pappír", prov: "einkaeign", medium: "vatnslitur", colours: ["Blár","Grár"], w: 1134, h: 1377 },
  { id: "litir-kvarans-114", title: "Allir bláir Kvarans", series: "litir-kvarans", n: 4, year: 2017, size: "14x38x56 cm", tech: "monocrome gvass á pappír", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Gulur","Hvítur","Blár"], w: 1317, h: 878 },
  { id: "litir-kvarans-115", title: "Allir Bláir Kvarans - French blue Newman", series: "litir-kvarans", n: 5, year: 2017, size: "38x56 cm", tech: "gvass á pappír", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Blár","Hvítur"], w: 1417, h: 945 },
  { id: "litir-kvarans-116", title: "Allir litir Kvarans", series: "litir-kvarans", n: 6, year: 2017, size: "50x14.8x21 cm", tech: "gvass á pappír", prov: "eign listamannsins og einkaeign", medium: "vatnslitur", colours: ["Hvítur","Gulur","Blár"], w: 1336, h: 890 },
  { id: "litir-kvarans-117", title: "Allir litir Kvarans vinstri", series: "litir-kvarans", n: 7, year: null, size: null, tech: null, prov: null, medium: null, colours: ["Gulur","Hvítur"], w: 853, h: 1279 },
  { id: "litir-kvarans-118", title: "Allir litir Kvarans miðja", series: "litir-kvarans", n: 8, year: null, size: null, tech: null, prov: null, medium: null, colours: ["Gulur","Hvítur"], w: 872, h: 1308 },
  { id: "litir-kvarans-119", title: "Allir litir Kvarans hægri", series: "litir-kvarans", n: 9, year: null, size: null, tech: null, prov: null, medium: null, colours: ["Gulur","Hvítur"], w: 878, h: 1316 },
  { id: "litir-kvarans-120", title: "Gvasslitatúbur", series: "litir-kvarans", n: 10, year: null, size: null, tech: null, prov: null, medium: null, colours: ["Gulur"], w: 1331, h: 888 },
  { id: "vatnslitur-160", title: "Eftir regnið 14 ágúst 12:10:51", series: "vatnslitur", n: 1, year: 2020, size: "101x67 cm", tech: "vatnslitur á pappír", prov: "einkaeign", medium: "vatnslitur", colours: ["Blár"], w: 1417, h: 2059 },
  { id: "vatnslitur-161", title: "Eftir regnið 14. ágúst 12:11:09", series: "vatnslitur", n: 2, year: 2020, size: "101x67 cm", tech: "vatnslitur á pappír", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Blár"], w: 1417, h: 2070 },
  { id: "vatnslitur-162", title: "Mýrarskuggar speglaðir", series: "vatnslitur", n: 3, year: 2018, size: "124x106 cm", tech: "vatnslitur og gvass", prov: "einkaeign", medium: "vatnslitur", colours: ["Grár","Blár"], w: 1134, h: 1318 },
  { id: "vatnslitur-163", title: "Mýrarskuggar", series: "vatnslitur", n: 4, year: 2018, size: "124x106 cm", tech: "vatnslitur og gvass", prov: "einkaeign", medium: "vatnslitur", colours: ["Blár"], w: 1134, h: 1003 },
  { id: "vatnslitur-164", title: "Fífubakki", series: "vatnslitur", n: 5, year: 2019, size: "94x112 cm", tech: "vatnslitur á pappír", prov: "einkaeign", medium: "vatnslitur", colours: ["Grár","Svartur","Hvítur"], w: 1276, h: 1027 },
  { id: "vatnslitur-165", title: "Mýrarskuggar 3", series: "vatnslitur", n: 6, year: 2016, size: "50x60 cm", tech: "vatnslitur á pappír á mdf", prov: "einkaeign", medium: "vatnslitur", colours: ["Grár","Hvítur","Svartur"], w: 1134, h: 937 },
  { id: "vatnslitur-166", title: "Mýrarskuggar 2", series: "vatnslitur", n: 7, year: 2016, size: "50x60 cm", tech: "vatnslitur á pappír á mdf", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Hvítur","Grár"], w: 1299, h: 1082 },
  { id: "vatnslitur-167", title: "Mýrarskuggar 1", series: "vatnslitur", n: 8, year: 2016, size: "50x60 cm", tech: "vatnslitur á pappír á mdf", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Hvítur","Grár"], w: 1134, h: 943 },
  { id: "vatnslitur-168", title: "Mýrarskuggar 4", series: "vatnslitur", n: 9, year: 2016, size: "50x60 cm", tech: "vatnslitur á pappír á mdf", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Grár","Hvítur"], w: 1134, h: 947 },
  { id: "vatnslitur-169", title: "Mýrarskuggar 6", series: "vatnslitur", n: 10, year: 2016, size: "50x60 cm", tech: "vatnslitur á pappír á mdf", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Hvítur","Grár"], w: 1134, h: 942 },
  { id: "vatnslitur-170", title: "Mýrarskuggar 7", series: "vatnslitur", n: 11, year: 2016, size: "101x76 cm", tech: "vatnslitur", prov: "einkaeign", medium: "vatnslitur", colours: ["Hvítur"], w: 785, h: 1215 },
  { id: "360-dagar-i-grasagardinum-058", title: "360 dagar í grasagarðinum. Uppsetning á Listasafninu á Akureyri", series: "360-dagar-i-grasagardinum", n: 1, year: 2014, size: null, tech: null, prov: "eign listamannsins", medium: null, colours: ["Hvítur","Grár","Blár","Gulur"], w: 1417, h: 945 },
  { id: "360-dagar-i-grasagardinum-059", title: "nr.1 Hallgrímur Pétursson 17. september 2013", series: "360-dagar-i-grasagardinum", n: 2, year: 2014, size: "31.5x42 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Hvítur","Grár"], w: 1134, h: 850 },
  { id: "360-dagar-i-grasagardinum-060", title: "nr.2 Hallgrímur Pétursson 19. september 2013", series: "360-dagar-i-grasagardinum", n: 3, year: 2014, size: "31.5x42 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Hvítur"], w: 1134, h: 850 },
  { id: "360-dagar-i-grasagardinum-061", title: "nr.12 Hallgrímur Pétursson 15. október 2013", series: "360-dagar-i-grasagardinum", n: 4, year: 2014, size: "31.5x42 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár","Hvítur","Svartur"], w: 1134, h: 850 },
  { id: "360-dagar-i-grasagardinum-062", title: "nr.18 Hallgrímur Pétursson 22. oktober 2013", series: "360-dagar-i-grasagardinum", n: 5, year: 2014, size: "31.5x42 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár","Brúnn","Svartur"], w: 1134, h: 850 },
  { id: "360-dagar-i-grasagardinum-063", title: "nr.20 Hallgrímur Pétursson 2. febrúar 2014", series: "360-dagar-i-grasagardinum", n: 6, year: 2014, size: "31.5x42 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1134, h: 850 },
  { id: "360-dagar-i-grasagardinum-064", title: "nr.25 Hallgrímur Pétursson 24. mars 2014", series: "360-dagar-i-grasagardinum", n: 7, year: 2014, size: "31.5x42 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár","Blár"], w: 1134, h: 850 },
  { id: "360-dagar-i-grasagardinum-065", title: "nr.35 Hallgrímur Pétursson 26. juni 2014", series: "360-dagar-i-grasagardinum", n: 8, year: 2014, size: "31.5x42 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1134, h: 800 },
  { id: "360-dagar-i-grasagardinum-066", title: "nr.37 Hallgrímur Pétursson 15. juli 2014", series: "360-dagar-i-grasagardinum", n: 9, year: 2014, size: "31.5x42 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1134, h: 850 },
  { id: "360-dagar-i-grasagardinum-067", title: "nr.40.Hallgrímur Pétursson 2. águst 2014", series: "360-dagar-i-grasagardinum", n: 10, year: 2014, size: "31.5x42 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 1191, h: 893 },
  { id: "360-dagar-i-grasagardinum-068", title: "Hallgrímur gegnumlýstur 1", series: "360-dagar-i-grasagardinum", n: 11, year: 2014, size: "42x31,5 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Gulur","Brúnn"], w: 893, h: 1191 },
  { id: "360-dagar-i-grasagardinum-069", title: "Hallgrímur gegnulýstur 2", series: "360-dagar-i-grasagardinum", n: 12, year: 2014, size: "42x31,5 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Brúnn","Blár","Gulur"], w: 893, h: 1191 },
  { id: "360-dagar-i-grasagardinum-070", title: "Hallgrímur gegnumlýstur 4", series: "360-dagar-i-grasagardinum", n: 13, year: 2014, size: "42x31,5 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Brúnn","Svartur"], w: 893, h: 1191 },
  { id: "360-dagar-i-grasagardinum-071", title: "Hallgrímur gegnulýstur 6", series: "360-dagar-i-grasagardinum", n: 14, year: 2014, size: "42x31,5 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Brúnn","Gulur","Grænn"], w: 893, h: 1191 },
  { id: "360-dagar-i-grasagardinum-072", title: "Baldvin Jóhannes Bjarnason þvær sár Hallgríms", series: "360-dagar-i-grasagardinum", n: 15, year: 2014, size: "31.5x40 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár","Brúnn","Blár"], w: 1191, h: 893 },
  { id: "360-dagar-i-grasagardinum-073", title: "Baldvin Hrannar Sigtryggsson þvær sár Hallgríms", series: "360-dagar-i-grasagardinum", n: 16, year: 2014, size: "31.5x42 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár","Svartur","Brúnn","Blár"], w: 1191, h: 893 },
  { id: "360-dagar-i-grasagardinum-074", title: "Kirsuberjablóm á Hallgrími bleikum", series: "360-dagar-i-grasagardinum", n: 17, year: 2014, size: "54x72 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Rauður","Bleikur","Fjólublár"], w: 1134, h: 850 },
  { id: "360-dagar-i-grasagardinum-075", title: "Rós í blóma", series: "360-dagar-i-grasagardinum", n: 18, year: 2014, size: "32x24cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Svartur"], w: 680, h: 907 },
  { id: "360-dagar-i-grasagardinum-076", title: "Rotnandi Rós", series: "360-dagar-i-grasagardinum", n: 19, year: 2014, size: "54x72 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Svartur","Grár","Blár"], w: 1134, h: 850 },
  { id: "360-dagar-i-grasagardinum-077", title: "Himnastigi", series: "360-dagar-i-grasagardinum", n: 20, year: 2014, size: "72x54 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár","Brúnn"], w: 1063, h: 1417 },
  { id: "360-dagar-i-grasagardinum-078", title: "Gluggi, garður, jesúfluga", series: "360-dagar-i-grasagardinum", n: 21, year: 2014, size: "72x54 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Brúnn","Svartur"], w: 1134, h: 1512 },
  { id: "360-dagar-i-grasagardinum-079", title: "Sól, vefur, skilningstré.", series: "360-dagar-i-grasagardinum", n: 22, year: 2014, size: "32x24 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grænn"], w: 1134, h: 1512 },
  { id: "360-dagar-i-grasagardinum-080", title: "Valgerður T í hlutverki Guðríðar Símonardóttur í Barbaríinu", series: "360-dagar-i-grasagardinum", n: 23, year: 2014, size: "75x100 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Brúnn","Grár"], w: 1134, h: 1512 },
  { id: "360-dagar-i-grasagardinum-081", title: "Innsetning í fordyri Hallgrímskirkju", series: "360-dagar-i-grasagardinum", n: 24, year: null, size: null, tech: null, prov: null, medium: null, colours: ["Grár"], w: 2126, h: 669 },
  { id: "vindvaettir-044", title: "Vindvættir 1", series: "vindvaettir", n: 1, year: 2010, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Blár","Grár"], w: 709, h: 591 },
  { id: "vindvaettir-045", title: "Vindvættir 2", series: "vindvaettir", n: 2, year: 2010, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Blár"], w: 709, h: 591 },
  { id: "vindvaettir-046", title: "Vindvættir 3", series: "vindvaettir", n: 3, year: null, size: null, tech: null, prov: null, medium: null, colours: ["Blár"], w: 709, h: 591 },
  { id: "vindvaettir-047", title: "Vindvættir 4", series: "vindvaettir", n: 4, year: 2010, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Brúnn","Grænn","Gulur"], w: 709, h: 591 },
  { id: "vindvaettir-048", title: "Vindvættir 5", series: "vindvaettir", n: 5, year: 2010, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Blár"], w: 709, h: 591 },
  { id: "vindvaettir-049", title: "Vindvættir 6", series: "vindvaettir", n: 6, year: 2010, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Rauður","Svartur"], w: 709, h: 591 },
  { id: "vindvaettir-050", title: "Vindvættir 7", series: "vindvaettir", n: 7, year: 2010, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Gulur"], w: 709, h: 591 },
  { id: "vindvaettir-051", title: "Vindvættir 8", series: "vindvaettir", n: 8, year: 2010, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Blár"], w: 709, h: 591 },
  { id: "vindvaettir-052", title: "Vindvættir 9", series: "vindvaettir", n: 9, year: 2010, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Svartur","Grænn"], w: 709, h: 591 },
  { id: "vindvaettir-053", title: "Vindvættir 10", series: "vindvaettir", n: 10, year: 2010, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár","Grænn"], w: 709, h: 591 },
  { id: "vindvaettir-054", title: "Vindvættir 11", series: "vindvaettir", n: 11, year: 2010, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár"], w: 709, h: 591 },
  { id: "vindvaettir-055", title: "Vindvættir 12", series: "vindvaettir", n: 12, year: 2010, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Hvítur","Grár","Svartur"], w: 709, h: 591 },
  { id: "vindvaettir-056", title: "Vindvættir 13", series: "vindvaettir", n: 13, year: 2010, size: "50x60 cm", tech: null, prov: "eign listamannsins", medium: null, colours: ["Grár","Gulur","Brúnn"], w: 709, h: 548 },
  { id: "vindvaettir-057", title: "Vindvættir", series: "vindvaettir", n: 14, year: null, size: null, tech: null, prov: null, medium: null, colours: ["Blár","Gulur","Grár"], w: 1134, h: 743 },
  { id: "i-minningu-rothko-040", title: "Eftir Rothko 1", series: "i-minningu-rothko", n: 1, year: 2001, size: "150x180 cm", tech: "olía á striga", prov: null, medium: "olia", colours: ["Gulur","Brúnn"], w: 954, h: 797 },
  { id: "i-minningu-rothko-041", title: "Eftir Rothko 2", series: "i-minningu-rothko", n: 2, year: 2001, size: "185x150 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár","Fjólublár"], w: 854, h: 1072 },
  { id: "i-minningu-rothko-042", title: "Eftir Rothko 3", series: "i-minningu-rothko", n: 3, year: 2001, size: "200x180 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Rauður","Brúnn","Bleikur"], w: 941, h: 1050 },
  { id: "i-minningu-rothko-043", title: "Þúsund og ein nótt", series: "i-minningu-rothko", n: 4, year: 2000, size: "200x200 cm", tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Blár","Grár","Gulur","Brúnn"], w: 733, h: 733 },
  { id: "sjotta-svitan-105", title: "Sjötta svítan, hluti", series: "sjotta-svitan", n: 1, year: 2021, size: "220x450 cm", tech: "akrýl á mdf", prov: "Eign listamannsins", medium: "olia", colours: ["Blár","Brúnn","Gulur"], w: 935, h: 624 },
  { id: "sjotta-svitan-106", title: "Sjötta svítan", series: "sjotta-svitan", n: 2, year: 2021, size: "220x450 cm", tech: "akrýl á mdf", prov: "Eign listamannsins", medium: "olia", colours: ["Grár"], w: 624, h: 935 },
  { id: "sjotta-svitan-107", title: "Sjötta svítan", series: "sjotta-svitan", n: 3, year: 2021, size: "220x450 cm", tech: "akrýl á mdf", prov: "Eign listamannsins", medium: "olia", colours: ["Grár"], w: 935, h: 624 },
  { id: "sjotta-svitan-108", title: "Sjötta svítan", series: "sjotta-svitan", n: 4, year: 2021, size: "220x450 cm", tech: "akrýl á mdf", prov: "Eign listamannsins", medium: "olia", colours: ["Gulur","Blár","Rauður","Grár"], w: 850, h: 714 },
  { id: "sjotta-svitan-109", title: "Sjötta svítan, hluti", series: "sjotta-svitan", n: 5, year: 2021, size: "220x450 cm", tech: "akrýl á mdf", prov: "Eign listamannsins", medium: "olia", colours: ["Rauður","Brúnn","Gulur"], w: 935, h: 630 },
  { id: "sjotta-svitan-110", title: "Sjötta svítan, hluti", series: "sjotta-svitan", n: 6, year: 2021, size: "220x450 cm", tech: "akrýl á mdf", prov: "Eign listamannsins", medium: "olia", colours: ["Rauður","Brúnn"], w: 935, h: 624 },
  { id: "stanmer-skogur-156", title: "Stanmer skógur 1", series: "stanmer-skogur", n: 1, year: 2014, size: "120x100cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár","Svartur"], w: 1134, h: 1364 },
  { id: "stanmer-skogur-157", title: "Stanmer Park 2", series: "stanmer-skogur", n: 2, year: null, size: "76x56", tech: "vatnslitur", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Gulur","Blár","Svartur"], w: 1134, h: 1490 },
  { id: "stanmer-skogur-158", title: "Stanmer Park", series: "stanmer-skogur", n: 3, year: 2014, size: "76x56cm", tech: "vatnslitur á pappír", prov: "eign listamannsins", medium: "vatnslitur", colours: ["Blár","Hvítur"], w: 1134, h: 1496 },
  { id: "stanmer-skogur-159", title: "Stanmer skógur 2", series: "stanmer-skogur", n: 4, year: 2014, size: "139x174 cm.", tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Blár"], w: 1134, h: 908 },
  { id: "giardini-publicchi-treemix-remix-196", title: "Giardini Publicchi", series: "giardini-publicchi-treemix-remix", n: 1, year: 2002, size: "92x92 cm", tech: "vatnslitur á pappír á mdf", prov: "Gerðarsafn", medium: "vatnslitur", colours: ["Hvítur","Rauður"], w: 962, h: 958 },
  { id: "giardini-publicchi-treemix-remix-197", title: "Giardini Publicchi", series: "giardini-publicchi-treemix-remix", n: 2, year: 2002, size: "92x92 cm", tech: "vatnslitur á pappír á mdf", prov: "Gerðarsafn", medium: "vatnslitur", colours: ["Gulur","Rauður","Hvítur"], w: 995, h: 1002 },
  { id: "giardini-publicchi-treemix-remix-198", title: "Giardini Publicchi", series: "giardini-publicchi-treemix-remix", n: 3, year: 2002, size: "135x125 cm", tech: "vatnslitur á pappír á mdf", prov: "Gerðarsafn", medium: "vatnslitur", colours: ["Hvítur","Blár"], w: 933, h: 1012 },
  { id: "giardini-publicchi-treemix-remix-199", title: "Giardini Publicchi", series: "giardini-publicchi-treemix-remix", n: 4, year: 2002, size: "92x92 cm", tech: "vatnslitur á pappír á mdf", prov: "Gerðarsafn", medium: "vatnslitur", colours: ["Hvítur","Gulur"], w: 1045, h: 1043 },
  { id: "giardini-publicchi-treemix-remix-200", title: "Giardini Publicchi", series: "giardini-publicchi-treemix-remix", n: 5, year: 2002, size: "135x92 cm", tech: "vatnslitur á pappír á mdf", prov: "Gerðarsafn", medium: "vatnslitur", colours: ["Rauður","Hvítur"], w: 902, h: 1193 },
  { id: "giardini-publicchi-treemix-remix-201", title: "Giardiniserían", series: "giardini-publicchi-treemix-remix", n: 6, year: null, size: null, tech: null, prov: null, medium: null, colours: ["Hvítur","Rauður","Gulur"], w: 2835, h: 523 },
  { id: "giardini-publicchi-treemix-remix-202", title: "Treemix skýmix", series: "giardini-publicchi-treemix-remix", n: 7, year: 2002, size: "100x100 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Fjólublár","Blár"], w: 654, h: 656 },
  { id: "giardini-publicchi-treemix-remix-203", title: "Treemix skýmix 2", series: "giardini-publicchi-treemix-remix", n: 8, year: 2002, size: "180x180 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 941, h: 945 },
  { id: "giardini-publicchi-treemix-remix-204", title: "Camouflage", series: "giardini-publicchi-treemix-remix", n: 9, year: 2002, size: "170x150 cm", tech: "olía á striga", prov: null, medium: "olia", colours: ["Blár"], w: 992, h: 1097 },
  { id: "giardini-publicchi-treemix-remix-205", title: "Bleikt mix", series: "giardini-publicchi-treemix-remix", n: 10, year: 2002, size: "120x140 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Rauður"], w: 725, h: 620 },
  { id: "giardini-publicchi-treemix-remix-206", title: "Treemix skýmix rigningarlegt", series: "giardini-publicchi-treemix-remix", n: 11, year: 2002, size: "100x100 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Gulur"], w: 654, h: 660 },
  { id: "giardini-publicchi-treemix-remix-207", title: "Mix á gulu sóltjaldi", series: "giardini-publicchi-treemix-remix", n: 12, year: 2002, size: "120x120 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Gulur"], w: 992, h: 989 },
  { id: "giardini-publicchi-treemix-remix-208", title: "Bleikt mix", series: "giardini-publicchi-treemix-remix", n: 13, year: 2002, size: "100x100 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Rauður"], w: 992, h: 992 },
  { id: "giardini-publicchi-treemix-remix-209", title: "Mix fyrir Birgi", series: "giardini-publicchi-treemix-remix", n: 14, year: 2002, size: "160x140 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Fjólublár","Blár"], w: 1276, h: 1410 },
  { id: "giardini-publicchi-treemix-remix-210", title: "Mix fyrir Ransu", series: "giardini-publicchi-treemix-remix", n: 15, year: 2002, size: "100x120 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Gulur","Fjólublár","Blár"], w: 1276, h: 1065 },
  { id: "giardini-publicchi-treemix-remix-211", title: "Svart mix", series: "giardini-publicchi-treemix-remix", n: 16, year: 2003, size: "3x50x50 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Svartur","Blár"], w: 1276, h: 494 },
  { id: "gomul-verk-skolaverk-171", title: "Heilagfiski eða listamaðurinn köllunin og efinn", series: "gomul-verk-skolaverk", n: 1, year: 1993, size: "130x160 cm", tech: "olía á striga", prov: null, medium: "olia", colours: ["Blár"], w: 1417, h: 928 },
  { id: "gomul-verk-skolaverk-172", title: "Peinture humide (Blautt málverk)", series: "gomul-verk-skolaverk", n: 2, year: 1992, size: "140x140 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 1134, h: 1137 },
  { id: "gomul-verk-skolaverk-173", title: "Peinture rouge", series: "gomul-verk-skolaverk", n: 3, year: 1993, size: "140x160 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Rauður"], w: 1276, h: 1151 },
  { id: "gomul-verk-skolaverk-174", title: "Peinture blue", series: "gomul-verk-skolaverk", n: 4, year: 1994, size: "150x180 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 1134, h: 876 },
  { id: "gomul-verk-skolaverk-175", title: "Jafnvægi", series: "gomul-verk-skolaverk", n: 5, year: 1993, size: "70x140 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár","Hvítur"], w: 1134, h: 812 },
  { id: "gomul-verk-skolaverk-176", title: "Flugfiskar", series: "gomul-verk-skolaverk", n: 6, year: 1994, size: "140x150 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Grænn"], w: 1276, h: 1175 },
  { id: "gomul-verk-skolaverk-177", title: "Gula pensilförin", series: "gomul-verk-skolaverk", n: 7, year: 1995, size: "160x160 cm", tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Gulur","Rauður"], w: 1117, h: 1126 },
  { id: "gomul-verk-skolaverk-178", title: "Melankóliljur", series: "gomul-verk-skolaverk", n: 8, year: 1994, size: "180x180 cm", tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Svartur","Brúnn"], w: 1134, h: 1116 },
  { id: "gomul-verk-skolaverk-179", title: "Midnight Expresso", series: "gomul-verk-skolaverk", n: 9, year: 1994, size: "150x150 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Svartur","Blár"], w: 1134, h: 1123 },
  { id: "gomul-verk-skolaverk-180", title: "Blóm á leiði Jackson Pollock", series: "gomul-verk-skolaverk", n: 10, year: 1997, size: null, tech: "olía á striga", prov: "Listasafn Reykjavíkur", medium: "olia", colours: ["Brúnn","Hvítur","Rauður"], w: 1276, h: 1276 },
  { id: "gomul-verk-skolaverk-181", title: "Krossfiskur við Kyrrþey", series: "gomul-verk-skolaverk", n: 11, year: 1996, size: "140x160 cm", tech: "olía á bómull", prov: "eign listamannsins", medium: "olia", colours: ["Hvítur","Svartur"], w: 1276, h: 1094 },
  { id: "gomul-verk-skolaverk-182", title: "Starrar við brunn", series: "gomul-verk-skolaverk", n: 12, year: 1997, size: null, tech: "olía á striga", prov: null, medium: "olia", colours: ["Gulur","Brúnn","Rauður"], w: 1134, h: 1134 },
  { id: "gomul-verk-skolaverk-183", title: "Buren fullur Pollock ekki", series: "gomul-verk-skolaverk", n: 13, year: 1995, size: null, tech: "olía á striga", prov: "eign listamannsins", medium: "olia", colours: ["Hvítur","Grænn","Rauður"], w: 1276, h: 1292 },
  { id: "gomul-verk-skolaverk-184", title: "Hringför", series: "gomul-verk-skolaverk", n: 14, year: 2000, size: null, tech: "olía á striga", prov: "Listasafn Icelandair", medium: "olia", colours: ["Hvítur","Bleikur","Rauður"], w: 992, h: 952 },
  { id: "gomul-verk-skolaverk-185", title: "Flatfiskur", series: "gomul-verk-skolaverk", n: 15, year: 1998, size: "60x40 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Hvítur","Blár"], w: 1134, h: 969 },
  { id: "gomul-verk-skolaverk-186", title: "Drög að sýningu fyrir kaffihús eða bar", series: "gomul-verk-skolaverk", n: 16, year: 1995, size: "3x35 cm þvm.", tech: "vatnslitur á pappír", prov: "einkaeign", medium: "vatnslitur", colours: ["Rauður","Gulur"], w: 1134, h: 956 },
  { id: "gomul-verk-skolaverk-187", title: "Cerulian og Cerulian", series: "gomul-verk-skolaverk", n: 17, year: 2004, size: "40x40 cm", tech: "olía á krossvið", prov: "Listasafn Íslands", medium: "olia", colours: ["Hvítur"], w: 1417, h: 1417 },
  { id: "gomul-verk-skolaverk-188", title: "Naglför", series: "gomul-verk-skolaverk", n: 18, year: 2004, size: "40x40 cm", tech: "olía á krossvið", prov: "Listasafn Íslands", medium: "olia", colours: ["Hvítur"], w: 1417, h: 1417 },
  { id: "gomul-verk-skolaverk-189", title: "Fúsjón", series: "gomul-verk-skolaverk", n: 19, year: 2004, size: "40x40 cm", tech: "olía á krossvið", prov: "Listasafn Íslands", medium: "olia", colours: ["Hvítur"], w: 1417, h: 1417 },
  { id: "gomul-verk-skolaverk-190", title: "Ljóska", series: "gomul-verk-skolaverk", n: 20, year: 2004, size: "40x40 cm", tech: "olía á krossvið", prov: "einkaeign", medium: "olia", colours: ["Hvítur"], w: 1417, h: 1417 },
  { id: "gomul-verk-skolaverk-191", title: "Fenómen", series: "gomul-verk-skolaverk", n: 21, year: 2004, size: "40x40 cm", tech: "olía á krossvið", prov: "einkaeign", medium: "olia", colours: ["Hvítur"], w: 1417, h: 1417 },
  { id: "gomul-verk-skolaverk-192", title: "Fíflar á sjó", series: "gomul-verk-skolaverk", n: 22, year: 1994, size: "150x150 cm", tech: "olía á striga", prov: "Listasafn Akureyrar", medium: "olia", colours: ["Brúnn","Svartur"], w: 1134, h: 1139 },
  { id: "gomul-verk-skolaverk-193", title: "Blóm á sjó", series: "gomul-verk-skolaverk", n: 23, year: 2002, size: "60x60 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Brúnn","Gulur"], w: 992, h: 989 },
  { id: "gomul-verk-skolaverk-194", title: "Narsissíur", series: "gomul-verk-skolaverk", n: 24, year: 1999, size: "135x135 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Svartur"], w: 992, h: 986 },
  { id: "gomul-verk-skolaverk-195", title: "Krass á bláum sjó", series: "gomul-verk-skolaverk", n: 25, year: 1997, size: "150x150 cm", tech: "olía á striga", prov: "einkaeign", medium: "olia", colours: ["Blár"], w: 1134, h: 1130 },
]

/** colours ordered by how much of his catalogue they actually hold */
export const COLOUR_ORDER: string[] = ["Blár","Grár","Hvítur","Gulur","Svartur","Brúnn","Rauður","Grænn","Fjólublár","Bleikur"]

export const seriesById = (s: string) => SERIES.find((x) => x.id === s)
export const worksOf = (s: string) => WORKS.filter((w) => w.series === s)
export const workById = (id: string) => WORKS.find((w) => w.id === id)
export const countOfColour = (c: string) => WORKS.filter((w) => w.colours.includes(c)).length
