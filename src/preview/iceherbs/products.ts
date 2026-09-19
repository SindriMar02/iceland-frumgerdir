/* Every product, price and word on this page is Iceherbs' own, harvested from
   their public WooCommerce API on 2026-09-19. Attribution manifest:
   _reference/iceherbs-harvest/MANIFEST.md. Nothing here is invented. */

export type Vara = { n: string; v: number; img: string | null }

/** kr. 2.999 - their own format, with the Icelandic thousands dot. */
export const kr = (v: number) => 'kr. ' + v.toLocaleString('de-DE')

/* Mixtúrur: the oldest line, on sale under the ICEHERBS name since 1995. */
export const MIXTURUR: Vara[] = [
  { n: 'FJALLAGRASAMIXTÚRA -SOFÐU RÓTT', v: 2190, img: '/iceherbs/3D-mix-Sofdurott-600x600-1.webp' },
  { n: 'HÁLSMIXTÚRA FJALLAGRASA MEÐ LAKKRÍS', v: 1990, img: '/iceherbs/230010_ICEHERBS-HALSMIXTURA-LAKKRIS-200ML_600X600.webp' },
  { n: 'HÁLSMIXTÚRA HUNANG & PIPARMYNTU', v: 1990, img: '/iceherbs/230011_ICEHERBS-HALSMIXTURA-HUN.PIPARM200ML_600X600.webp' },
  { n: 'HÓSTAMIXTÚRA ENGIFER & SÍTRÓNU', v: 1990, img: '/iceherbs/230016_ICEHERBS-HOSTAMIXTURA-SITRONUENGIFER_600X600.webp' },
  { n: 'ÍSLENSKIR BRJÓSTDROPAR MEÐ FJALLAGRÖSUM', v: 1990, img: '/iceherbs/230015_ICEHERBS-HOSTAMIXTURA-BRJOSTDROPAR_600X600-.webp' },
  { n: 'KRAKKAMIXTÚRA FJALLAGRASA MEÐ APPELSÍNU', v: 1990, img: '/iceherbs/230013_ICEHERBS-KRAKKAMIXTURA-APPELS._600X600.webp' },
  { n: 'KRAKKAMIXTÚRA FJALLAGRASA MEÐ JARÐABERJUM', v: 1990, img: '/iceherbs/230012_ICEHERBS-KRAKKAMIXTURA-JARDAB._600X600.webp' },
  { n: 'KRAKKAMIXTÚRA FJALLAGRASA MEÐ SÚKKULAÐI', v: 1990, img: '/iceherbs/230014_ICEHERBS-KRAKKAMIXTURA-SUKKUL._600X600.webp' },
]

/* Bætiefni: capsule production began in 2012. */
export const BAETIEFNI: Vara[] = [
  { n: 'ASTAXANTHIN 8 mg', v: 3699, img: '/iceherbs/220250_ICEHERBS-ASTAXANTHIN-60-PERLUR_600X600.webp' },
  { n: 'B-12', v: 2399, img: '/iceherbs/220360_ICEHERBS-B12-VITAMIN-60-HYLK_nyttI_600X600.webp' },
  { n: 'C-VÍTAMÍN & ENGIFER', v: 2599, img: '/iceherbs/220240_ICEHERBS-C-VITAMIN-ENGIFER-FLENSUBANI-60-HYLKI_600X600.webp' },
  { n: 'COLLAGEN LIÐAMÓT', v: 3699, img: '/iceherbs/220270_ICEHERBS-COLLAGEN-LIDAMOT-120-HYLKI_600X600.webp' },
  { n: 'COLLAGEN SKIN', v: 3699, img: '/iceherbs/220550_ICEHERBS-COLLAGEN-SKIN-60-CAPSULES_600X600.webp' },
  { n: 'D-VÍTAMÍN ORKUBLANDA', v: 2899, img: '/iceherbs/220200_ICEHERBS-D-VITAMIN-BURNIROT-60-HYLKI_600X600.webp' },
  { n: 'FJALLAGRÖS - FYRIR MELTINGUNA', v: 2099, img: '/iceherbs/220010_ICEHERBS-ICELAND-MOSS-60-CAPSULES_600X600.webp' },
  { n: 'HÚÐ, HÁR & NEGLUR', v: 2999, img: '/iceherbs/220220_ICEHERBS-HUD-HAR-OG-NEGLUR-60-HYLKI_600X600.webp' },
  { n: 'HVANNARRÓT', v: 2899, img: '/iceherbs/220020_ICEHERBS-HVANNAROT-60-HYLKI_600X600.webp' },
  { n: 'JÁRN & TREFJAR - KRÆKIBER & RAUÐRÓFUR', v: 2399, img: '/iceherbs/3D-skinbooster-60.webp' },
  { n: 'KALK & MAGNESÍUM', v: 3199, img: '/iceherbs/220560_ICEHERBS-CALMAG-60-CAPSULES_600X600.webp' },
  { n: 'Konur 40 plús', v: 3399, img: '/iceherbs/Konur-40-2025.webp' },
  { n: 'Litabombur', v: 1690, img: '/iceherbs/glas-logo-2022-nytt2-1.webp' },
  { n: 'MAGNESÍUM & FJALLAGRÖS', v: 2899, img: '/iceherbs/220400_ICEHERBS-MAGNESIUM-MOSS-60-CAPSULES_600X600.webp' },
  { n: 'MEIRI ORKA - BURNIRÓT', v: 2999, img: '/iceherbs/220070_ICEHERBS-FOCUS-ENERGY-60-CAPSULES_600X600.webp' },
  { n: 'MELTING - BLANDA ENGIFERS & FJALLAGRASA', v: 2699, img: '/iceherbs/220050_ICEHERBS-DIGESTIVE-60-CAPSULES_600X600.webp' },
  { n: 'MJÓLKURÞISTILL HREINSANDI', v: 2899, img: '/iceherbs/mjolkurthistill.webp' },
  { n: 'RAUÐRÓFUR', v: 2999, img: '/iceherbs/220230_ICEHERBS-RAUDROFUR-60-HYLKI_600X600.webp' },
  { n: 'SOFÐU RÓTT', v: 3190, img: '/iceherbs/Sofdurott-60.webp' },
  { n: 'TURMERIK MILT', v: 2159, img: '/iceherbs/220160_ICEHERBS-TURMERIK-M.FJALLAGR-MILT-60-HYLKI_600X600.webp' },
  { n: 'TURMERIK STERKT', v: 2239, img: '/iceherbs/220180_ICEHERBS-TURMERIK-M.PIPAR-STERKT-60-HYLKI_600X600.webp' },
]

/* ICEHERBS SKIN, from 2017. The first products were lip balms with fjallagrös. */
export const HUDVORUR: Vara[] = [
  { n: 'ICEHERBS SKIN Handsápa með íslenskum fjallagrösum - sítruslauf og kókos 300 ml.', v: 1390, img: '/iceherbs/51000220.webp' },
  { n: 'ICEHERBS SKIN Handsápa með fjallagrösum, rósmarínlaufum og myntu', v: 1390, img: '/iceherbs/51000213.webp' },
  { n: 'ICEHERBS SKIN Handkrem með fjallagrösum, collageni og Shea Smjöri 50 ml.', v: 2590, img: '/iceherbs/51000206.webp' },
  { n: 'ICEHERBS SKIN Hreinsimjólk með collagen & Aloe Vera', v: 3690, img: '/iceherbs/51000176.webp' },
  { n: 'ICEHERBS SKIN Andlitskrem 50 ml.', v: 3790, img: '/iceherbs/51000190.webp' },
  { n: 'Gjafakassi ICEHERBS SKIN - Fyrir hendur', v: 3890, img: '/iceherbs/3D-ermi-framm-Hand.webp' },
  { n: 'Gjafapoki ICEHERBS SKIN - Fyrir hendur', v: 3890, img: '/iceherbs/56103614_Hendur_Gjafapakki_2.webp' },
  { n: 'ICEHERBS SKIN collagen serum með C vítamíni 30 ml.', v: 4190, img: '/iceherbs/51000183.webp' },
  { n: 'Gjafakassi ICEHERBS SKIN - Fyrir andlit', v: 7190, img: '/iceherbs/3D-ermi-framm-Facial.webp' },
  { n: 'Gjafapoki ICEHERBS SKIN - Fyrir andlit', v: 7190, img: '/iceherbs/53103613_Andlits_Gjafapakki_2.webp' },
  { n: 'Húðnæringarpakkinn', v: 8990, img: '/iceherbs/3D-heimasida-maedradagurinn-vefur.webp' },
]

/* Tilboðspakkar. Their own names, which are the best copy on the whole site. */
export const PAKKAR: Vara[] = [
  { n: 'Vetrartvenna', v: 4390, img: '/iceherbs/Tilbodspakkar_VETRARTVENNA.webp' },
  { n: 'Meltingartvenna', v: 4590, img: '/iceherbs/meltingartvenna_600x600.webp' },
  { n: 'SLÖKUNARTVENNA', v: 4790, img: '/iceherbs/Tilbodspakkar_SLOKUNARTVENNA_2.webp' },
  { n: 'Orkupakkinn', v: 6190, img: '/iceherbs/Orkupakkinn-1.webp' },
  { n: 'Flensubaninn', v: 6290, img: '/iceherbs/Flensubani.webp' },
  { n: 'Daglegi pakkinn', v: 6290, img: '/iceherbs/daglegipakkinn_600x600.webp' },
  { n: 'Meltingarþrenna', v: 6790, img: '/iceherbs/meltingarthrenna_600x600.webp' },
  { n: 'Kvennaþrenna', v: 6790, img: '/iceherbs/Kvennathrenna.webp' },
  { n: 'D-bomba', v: 6890, img: '/iceherbs/Dbomba_600x600.webp' },
  { n: 'Næturbrölt', v: 6890, img: '/iceherbs/naeturbrolt_600x600.webp' },
  { n: 'Úthald', v: 6890, img: '/iceherbs/uthaldspakki_600x600.webp' },
  { n: 'Álagstímar', v: 6990, img: '/iceherbs/alagstimar_600x600.webp' },
  { n: 'Góða nótt', v: 7090, img: '/iceherbs/morgungledi_godanott600x600.webp' },
  { n: 'Bjútíbarinn', v: 7290, img: '/iceherbs/bjutibarinn_600x600.webp' },
  { n: 'Liðugur', v: 7490, img: '/iceherbs/lidugur.webp' },
  { n: 'Sportpakki', v: 7490, img: '/iceherbs/Sportpakkinn600x600.webp' },
  { n: 'Glóandi', v: 8290, img: '/iceherbs/med-THrenna-hud-2026.webp' },
  { n: 'Breytingaskeiðið', v: 8790, img: '/iceherbs/Breytingaskeidid.webp' },
  { n: 'Sólarpakkinn', v: 8890, img: '/iceherbs/Solarpakkinn-Astaxanthin-NYTT.webp' },
  { n: 'Húðnæringarpakkinn', v: 8990, img: '/iceherbs/3D-heimasida-maedradagurinn-vefur.webp' },
]

/* Free delivery starts at 12.000 kr and every single bundle is below it. */
export const FRI_SENDING = 12000

export const GREINAR = [
  { t: 'Rólegri kvöld og betri næturhvíld', d: '2026-06-04', s: 'rolegri-kvold-og-betri-naeturhvild' },
  { t: 'Hvað segir einkaþjálfari World Class um magnesíum', d: '2026-03-16', s: 'hvad-segir-einkathjalfari-world-class-um-magnesium-vidtal-vid-orku-kristinsdottir' },
  { t: 'D vítamín - Þessi blanda kemur þér í gegnum veturinn brosandi', d: '2025-01-24', s: 'dvitamin-orkublanda' },
  { t: 'Hvannarót: Þvagþörfin kom aftur með Hvannarrót', d: '2023-03-07', s: 'thvagthorfin-kom-med-hvannarrot' },
  { t: 'Burnirót: Kemst í gegnum daginn með kvíðarótinni', d: '2023-02-06', s: 'burnirot-kemst-i-gegnum-daginn-med-kvidarotinni' },
  { t: 'C-vítamín: Öflugur & náttúrulegur flensubani', d: '2023-01-12', s: 'c-vitamin-natturulegur-flensubani' },
]
