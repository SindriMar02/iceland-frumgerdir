import type { PreviewCompany } from '../company-types'

/* Every fact here is sourced in _docs/PRENTMIDLUN-FACTCHECK-2026-10-09.md (read 2026-10-09).
   Copy is Prentmiðlun's own text from prentmidlun.is, typos corrected, nothing invented.
   Work captions = the title readable on the cover in their own studio photo + the album it sits in. */

export const ROUTE = '/preview/prentmidlun'
const B = import.meta.env.BASE_URL
export const A = (p: string) => `${B}prentmidlun/${p}`
export const img = (k: string, w: 640 | 1280 = 640) => A(`work/${k}-${w}.webp`)
export const imgSet = (k: string) => `${img(k, 640)} 640w, ${img(k, 1280)} 1280w`

export const CONTACT = {
  legal: 'Prentmiðlun ehf.',
  kt: '440208-0290',
  vsk: '97103',
  email: 'prentmidlun@prentmidlun.is',
  eythor: 'eythor@prentmidlun.is',
  phone: '554 5800',
  tel: '+3545545800',
  street: 'Reykjavíkurvegur 70',
  town: '220 Hafnarfjörður',
  map: 'https://www.google.com/maps/search/?api=1&query=Reykjav%C3%ADkurvegur+70%2C+220+Hafnarfj%C3%B6r%C3%B0ur',
  facebook: 'https://www.facebook.com/692532247486781',
}

export type Cat = 'ljosmynd' | 'barna' | 'hand' | 'matur' | 'gjafa' | 'bokmenntir' | 'spil' | 'kort'
export const CATS: { key: 'allt' | Cat; label: string; note: string }[] = [
  { key: 'allt', label: 'Allt', note: 'Sýnishorn úr myndasafni Prentmiðlunar.' },
  { key: 'ljosmynd', label: 'Ljósmyndabækur', note: 'Pappírsþykkt og gljástig valin fyrir hverja bók.' },
  { key: 'barna', label: 'Barnabækur', note: 'Harðspjalda- og spjaldabækur fyrir yngstu lesendurna.' },
  { key: 'hand', label: 'Handbækur', note: 'Prjónabækur, orðabækur og fræðirit sem eiga að endast.' },
  { key: 'matur', label: 'Matreiðslubækur', note: 'Opnast vel á borði og þola eldhúsið.' },
  { key: 'gjafa', label: 'Gjafabækur', note: 'Upphleypt kápa, lesmerkiborði og litur á hverri bók.' },
  { key: 'bokmenntir', label: 'Bókmenntir', note: 'Skáldsögur, ljóð og fornrit í öskju.' },
  { key: 'spil', label: 'Borðspil', note: 'Askja, spjöld, bakki og plastpökkun, tilbúið í sölu.' },
  { key: 'kort', label: 'Kort', note: 'Landakort, brotin og pökkuð í sérsniðna vasa.' },
]

export type Work = { k: string; title: string; cat: Cat; alt: string; w: number; h: number; spec?: string }
/* w/h = the 1280px export (their originals are 1276 wide) */
const W = (k: string, title: string, cat: Cat, alt: string, h: number, spec?: string): Work => ({ k, title, cat, alt, w: 1276, h, spec })
export const WORKS: Work[] = [
  W('askja-loftmynd', 'Ljósmyndabók í svartri öskju', 'ljosmynd', 'Ljósmyndabók með loftmynd af jökli á kápu, í svartri öskju', 877, 'Askja og harðband'),
  W('verum-graen', 'Verum græn!', 'barna', 'Barnabókin Verum græn! með jörðina og tvö börn á kápu', 947),
  W('fimbulfamb', 'Fimbulfamb', 'spil', 'Svört askja spilsins Fimbulfamb með litríku ljósi', 890, 'Askja'),
  W('vettlingaprjon', 'Vettlingaprjón', 'hand', 'Bókin Vettlingaprjón með prjónuðum vettlingum á kápu', 937),
  W('villibrad', 'Stóra bókin um villibráð', 'matur', 'Matreiðslubókin Stóra bókin um villibráð í harðbandi', 976),
  W('sturlunga', 'Sturlunga saga', 'bokmenntir', 'Sturlunga saga í koparlitaðri öskju með þrykktu mynstri', 857, 'Bindi í öskju'),
  W('veidimenn-nordursins', 'Veiðimenn norðursins', 'ljosmynd', 'Ljósmyndabókin Veiðimenn norðursins með svarthvítri mynd á kápu', 993),
  W('gjafabaekur-stafli', 'Gjafabækur í lit', 'gjafa', 'Stafli af gjafabókum í sex litum með lesmerkiborðum', 897, 'Upphleypt kápa, lesmerkiborði'),
  W('aevintyralandid', 'Ævintýralandið', 'spil', 'Borðspilið Ævintýralandið með öskju, spilum, peðum og reglum', 846, 'Askja, spjöld og íhlutir'),
  W('kort-1', 'Landakort', 'kort', 'Þrjú brotin landakort af Íslandi í plastvösum', 722, 'Brotið, í plastvasa'),
  W('harid', 'Hárið', 'hand', 'Bókin Hárið með svarthvítri mynd af konu á kápu', 935),
  W('incredible-iceland', 'Incredible Iceland', 'ljosmynd', 'Ljósmyndabókin Incredible Iceland í brúnu bandi með mynd á kápu', 800),
  W('blomin-a-thakinu', 'Blómin á þakinu', 'barna', 'Barnabókin Blómin á þakinu með teikningu af gamalli konu', 917),
  W('fagur-fiskur', 'Fagur fiskur', 'matur', 'Matreiðslubókin Fagur fiskur með manni í lopapeysu á kápu', 983),
  W('skripo', 'Skrípó', 'spil', 'Spilið Skrípó með öskju, spilaborði og spjöldum', 842, 'Askja, borð og spjöld'),
  W('prjonabiblian', 'Prjónabiblían', 'hand', 'Prjónabiblían í hvítu bandi með rauðri prjónaðri fléttu', 845),
  W('gylling-kjolur', 'Gylling á bandi', 'ljosmynd', 'Nærmynd af gylltum stöfum á brúnu bókbandi', 851, 'Fólíuþrykk'),
  W('sidasta-ordsending', 'Síðasta orðsending elskhugans', 'bokmenntir', 'Skáldsagan Síðasta orðsending elskhugans í kilju', 998, 'Kilja'),
  W('latibaer', 'Íþróttaálfurinn á ferð og Solla stirða', 'barna', 'Tvær harðspjaldabækur með Íþróttaálfinum og Sollu stirðu', 752, 'Harðspjaldabækur'),
  W('i-tilefni-dagsins', 'Í tilefni dagsins', 'matur', 'Matreiðslubókin Í tilefni dagsins eftir Yesmine Olsson', 935),
  W('islandssoguspilid', 'Íslandssögu-spilið', 'spil', 'Askja Íslandssögu-spilsins með teiknuðu Íslandskorti', 915, 'Askja'),
  W('little-big-book', 'The little big book about Iceland', 'ljosmynd', 'Ljósmyndabókin The little big book about Iceland', 950),
  W('samheitaordabok', 'Íslensk samheitaorðabók', 'hand', 'Íslensk samheitaorðabók og íslensk-spænsk orðabók', 972),
  W('malshaettir', 'Íslenskir málshættir', 'gjafa', 'Gjafabókin Íslenskir málshættir í brúnni upphleyptri kápu', 1304, 'Upphleypt kápa'),
  W('vin', 'Vín', 'matur', 'Bókin Vín með ljósri kápu og bleikum stöfum', 855),
  W('ljodasafn', 'Ljóðasafn', 'bokmenntir', 'Ljóðasafn í brúnu bandi með rauðu mynstri', 972),
  W('karnival', 'Gaman saman með Karnivali dýranna', 'spil', 'Tónlistarspilið Gaman saman með Karnivali dýranna, svanur á öskju', 896, 'Askja'),
  W('hani-krummi', 'Hani, krummi, hundur, svín', 'barna', 'Harðspjaldabókin Hani, krummi, hundur, svín', 1094, 'Harðspjaldabók'),
  W('two-in-one', 'Iceland, Two in One', 'ljosmynd', 'Ljósmyndabókin Two in One með vetrarmynd á kápu', 912),
  W('sokkaprjon', 'Sokkaprjón', 'hand', 'Bókin Sokkaprjón með prjónuðum sokkum á kápu', 893),
  W('afmaelisveislubokin', 'Afmælisveislubókin', 'matur', 'Afmælisveislubókin með litríkri afmælisköku á kápu', 1029),
  W('kort-2', 'Landakort á korti', 'kort', 'Tvö brotin landakort liggjandi á útbreiddu korti', 763, 'Brotið, í plastvasa'),
  W('petur-og-ulfurinn', 'Gaman saman með Pétri og úlfinum', 'spil', 'Tónlistarspilið Gaman saman með Pétri og úlfinum í grænni öskju', 884, 'Askja'),
  W('gjafabaekur-tvaer', 'Íslensk kvæði og fleiri', 'gjafa', 'Tvær gjafabækur í brúnu og grænbláu með lesmerkiborðum', 957),
  W('af-jordu', 'Af jörðu', 'bokmenntir', 'Bókin Af jörðu með torfbæ á kápu', 1109),
  W('niceland', 'Niceland', 'ljosmynd', 'Ljósmyndabókin Niceland með lunda á kápu', 771),
  W('allur-matur', 'Allur matur á að fara', 'barna', 'Harðspjaldabækurnar Allur matur á að fara og Nú er úti norðanvindur', 970, 'Harðspjaldabækur'),
  W('islensk-ensk', 'Íslensk-ensk orðabók', 'hand', 'Íslensk-ensk ensk-íslensk orðabók í blárri kápu', 980),
  W('nara', 'Yoshitomo Nara + YNG', 'bokmenntir', 'Harðspjaldabók með málverki af stúlku eftir Yoshitomo Nara', 876),
  W('loftmyndir-opna', 'Opna úr ljósmyndabók', 'ljosmynd', 'Opin ljósmyndabók með tveimur loftmyndum', 722),
  W('svort-askja', 'Ljósmyndir í öskju', 'ljosmynd', 'Svört askja með lausum ljósmyndablöðum og kápu', 729, 'Askja'),
  W('iceland-askja', 'Iceland', 'ljosmynd', 'Tvær ljósmyndabækur sem heita Iceland, önnur í öskju', 800),
]
export const CAT_LABEL: Record<Cat, string> = Object.fromEntries(CATS.filter((c) => c.key !== 'allt').map((c) => [c.key, c.label])) as Record<Cat, string>

export type Service = {
  slug: string; n: string; title: string; en: string; short: string; lead: string; body: string[]
  facts: { k: string; v: string }[]; photo: string; cats: Cat[]; product?: ProductKey
}
export const SERVICES: Service[] = [
  {
    slug: 'bokaprentun', n: 'A', title: 'Bókaprentun', en: 'Book printing', product: 'innbundin',
    short: 'Allar útfærslur, í öllum stærðum og gerðum.',
    lead: 'Bókaprentun hefur frá upphafi verið það sem við hjá Prentmiðlun erum þekktust fyrir.',
    body: [
      'Við getum boðið upp á allar útfærslur í bókaprentun, í öllum mögulegum stærðum og gerðum. Stærsti hluti framleiðslunnar fer fram erlendis, eftir því hvað hentar hverju sinni hvað varðar gæði, verð, afhendingartíma eða afhendingarstað.',
      'Ef óskað er sjáum við um framleiðslu og afgreiðslu heim að dyrum til flestra landa. Undanfarin ár höfum við einnig boðið vöruhýsingu og dreifingu í Evrópu og Bandaríkjunum samhliða framleiðslu bóka.',
      'Viðskiptavinir Prentmiðlunar hafa í gegnum árin lagt mikla áherslu á prentgæði og vandað bókband, eins og bækurnar sem við höfum komið að bera glöggt merki.',
    ],
    facts: [
      { k: 'Framleitt', v: 'Þar sem gæði, verð og afhendingartími henta best' },
      { k: 'Afhending', v: 'Heim að dyrum til flestra landa' },
      { k: 'Aukaþjónusta', v: 'Vöruhýsing og dreifing í Evrópu og Bandaríkjunum' },
    ],
    photo: 'sturlunga', cats: ['barna', 'hand', 'matur', 'gjafa', 'bokmenntir'],
  },
  {
    slug: 'ljosmyndabaekur', n: 'B', title: 'Ljósmyndabækur', en: 'Photo books', product: 'ljosmynd',
    short: 'Gæðaprentun og vandað bókband.',
    lead: 'Útgefendur og höfundar gera miklar kröfur þegar ljósmyndabækur eru prentaðar.',
    body: [
      'Prentmiðlun hefur prentað ljósmyndabækur fyrir útgefendur sem gefa út verk þekktustu ljósmyndara Íslands.',
      'Bækurnar eru af öllum gerðum og stærðum, með mismunandi kröfur um pappírsþykkt og gljástig, allt til að ljósmyndin komist sem best til skila og á sem hagkvæmastan hátt.',
    ],
    facts: [{ k: 'Pappír', v: 'Þykkt og gljástig valin fyrir hverja bók' }, { k: 'Litaprufur', v: 'Vottaðar GMG-prufur ef óskað er' }],
    photo: 'askja-loftmynd-2', cats: ['ljosmynd'],
  },
  {
    slug: 'stafraen-prentun', n: 'C', title: 'Stafræn prentun', en: 'Short-run digital', product: 'stafraent',
    short: 'Minna upplag á skemmri tíma.',
    lead: 'Stafrænt prentaðar bækur í hörðu bandi og kilju, nánast eins og hefðbundin bókaprentun.',
    body: [
      'Við getum boðið upp á stafrænt prentaðar bækur, svarthvítar eða í lit, saumaðar eða fræstar.',
      'Með stafrænni prentun er hægt að prenta mun færri eintök á hagkvæmari hátt og á skemmri tíma en í hefðbundinni offsetprentun, þar sem lágmarksmagn getur verið um 500 til 1.000 eintök.',
    ],
    facts: [{ k: 'Band', v: 'Harðband eða kilja, saumað eða fræst' }, { k: 'Offset til samanburðar', v: 'Lágmark oft um 500 til 1.000 eintök' }],
    photo: 'gjafabaekur-tvaer', cats: ['gjafa', 'bokmenntir'],
  },
  {
    slug: 'bordspil', n: 'D', title: 'Borðspil', en: 'Board games', product: 'spil',
    short: 'Sérhannaðir íhlutir þar sem hver hlutur á sinn stað.',
    lead: 'Við sjáum um framleiðslu á borðspilum sem eru sérframleidd eftir óskum hvers viðskiptavinar.',
    body: [
      'Í borðspilunum geta verið hefðbundnir prentaðir íhlutir eða íhlutir sérframleiddir úr til dæmis plasti, málmi eða tré. Hægt er að fá sérsniðinn innri plastbakka þar sem hver hlutur á sinn stað.',
      'Borðspilin eru jafnan afgreidd í vönduðum öskjum, plastpökkuð og tilbúin í sölu.',
    ],
    facts: [{ k: 'Lágmarkspöntun', v: 'Oftast um 500 eintök' }, { k: 'Afgreiðslutími', v: '6 til 12 vikur frá samþykktri próförk' }, { k: 'Frágangur', v: 'Askja, plastpökkun, tilbúið í sölu' }],
    photo: 'aevintyralandid', cats: ['spil'],
  },
  {
    slug: 'kortaprentun', n: 'E', title: 'Kortaprentun', en: 'Map printing', product: 'kort',
    short: 'Landakort fyrir útgefendur, brotin og pökkuð.',
    lead: 'Undanfarin ár höfum við séð um prentun á landakortum fyrir útgefendur.',
    body: ['Landakortin eru oftast afgreidd samanbrotin og pökkuð í sérsniðna plastvasa.'],
    facts: [{ k: 'Hámarksstærð', v: '1200 × 1620 mm' }, { k: 'Hámark í brotvél', v: '1120 × 1600 mm' }],
    photo: 'kort-1', cats: ['kort'],
  },
  {
    slug: 'timarit', n: 'F', title: 'Tímarit og bæklingar', en: 'Magazines and brochures', product: 'timarit',
    short: 'Vírheft eða fræst, hagstætt verð.',
    lead: 'Hagstæð verð í prentun tímarita, fjölpósts og bæklinga, hvort heldur vírheft eða fræst.',
    body: ['Mjög mikið úrval af pappír og útfærslum, til dæmis á kápum: lökk, upphleypingar, fólíur eða önnur sérvinnsla.'],
    facts: [{ k: 'Band', v: 'Vírheft eða fræst' }, { k: 'Kápa', v: 'Lakk, upphleyping, fólía' }],
    photo: 'timarit', cats: [],
  },
  {
    slug: 'forvinnsla', n: 'G', title: 'Forvinnsla og skil', en: 'Prepress and files',
    short: 'PDF, CMYK, 300 dpi og vottaðar litaprufur.',
    lead: 'Tekið er við verkum til framleiðslu sem PDF-skjölum nema annað sé tekið fram.',
    body: [
      'Myndir skulu vera unnar í CMYK, eða í grátóni ef þær eru svarthvítar. Við umbreytingu í CMYK skiptir máli að nota litaprófíl sem hentar pappírnum sem á að prenta á. Myndir þurfa að vera í 300 dpi upplausn til að tryggja hámarksgæði.',
      'Prentmiðlun býður vottaðar GMG-litaprufur (GMG ColorProof) ef óskað er. Þannig er hægt að meta prentgæði einstakra mynda eða fá sýnishorn af bókakápu.',
      'Stærri skjöl fara um FTP-svæði Prentmiðlunar. Sendu póst á prentmidlun@prentmidlun.is til að fá aðgang.',
    ],
    facts: [{ k: 'Skil', v: 'PDF' }, { k: 'Litir', v: 'CMYK eða grátónn, réttur prófíll' }, { k: 'Upplausn', v: '300 dpi' }],
    photo: 'gylling-kjolur', cats: [],
  },
]
export const serviceBySlug = (s: string) => SERVICES.find((x) => x.slug === s)

/* the 28 options from "Möguleikar í prentun og bókbandi", grouped */
export const OPTIONS: { group: string; items: string[] }[] = [
  { group: 'Band', items: ['Saumaðar bækur', 'Saumaðar bækur með sérstakri styrkingu', 'Otabind / lay-flat', 'Fræstar bækur', 'Gormabækur', 'Singer-saumur í kjöl', 'Singer-hliðarsaumur við kjöl', 'Spjaldabækur', 'Baðbækur úr plastefni'] },
  { group: 'Kápa', items: ['Rúnnuð horn á harðbandskápu', '3D upphleyping', 'Blindþrykk', 'Venjuleg upphleyping', 'Silkiprentun á kápu eða bindi', 'Ísaumur í bókbandsefni', 'UV heillakk eða hlutalakk', 'French fold kápur'] },
  { group: 'Snið og innihald', items: ['Litun á snið', 'Prentun á snið', 'Fólíuprentun á snið', 'Prentun á biblíupappír', 'Lesmerkiborðar', 'Teygjur utan um bækur eða fyrir penna', 'CD og DVD í vösum', 'Stansanir'] },
  { group: 'Stærðir og umbúðir', items: ['Mjög litlar bækur', 'Mjög stórar bækur', 'Öskjur í öllum stærðum og gerðum'] },
]

export const PROCESS = [
  { n: '1', t: 'Móttaka verka', d: 'Þú sendir verkið eða hugmyndina. Við förum yfir hvað hentar: pappír, band, upplag og afhendingu.' },
  { n: '2', t: 'Yfirferð prentskjala', d: 'Við yfirförum prentskjölin, liti og upplausn, áður en nokkuð fer í prentun.' },
  { n: '3', t: 'Vottaðar litaprufur', d: 'GMG-litaprufur af myndum eða kápu, svo þú sjáir litinn áður en upplagið er prentað.' },
  { n: '4', t: 'Próförk', d: 'Við höldum utan um prófarkaferlið við framleiðandann þar til þú samþykkir.' },
  { n: '5', t: 'Framleiðsla og gæðaeftirlit', d: 'Hjá þeim prentsmiðjum í Evrópu, Asíu eða Ameríku sem henta verkinu best.' },
  { n: '6', t: 'Afgreiðsla og tollur', d: 'Heim að dyrum hér heima eða erlendis, með tollafgreiðslu ef þarf.' },
]

export const SAMPLES = ['Pappír', 'Bókbandsefni', 'Saurblöð', 'Fólíur til gyllingar', 'Lesmerkiborðar', 'Kjölkragar', 'Lakk']

/* ---------- the quote builder ---------- */
export type ProductKey = 'innbundin' | 'kilja' | 'ljosmynd' | 'stafraent' | 'spil' | 'kort' | 'timarit'
export const PRODUCTS: { key: ProductKey; label: string; en: string; photo: string; formats: string[]; bindings: string[]; pages: boolean; hint: string }[] = [
  { key: 'innbundin', label: 'Innbundin bók', en: 'Hardback', photo: 'villibrad', formats: ['148 × 210 mm', '170 × 240 mm', '210 × 297 mm', '240 × 280 mm'], bindings: ['Saumað harðband', 'Otabind / lay-flat', 'Harðspjaldabók'], pages: true, hint: 'Í offsetprentun er lágmarksmagn oft um 500 til 1.000 eintök.' },
  { key: 'kilja', label: 'Kilja', en: 'Paperback', photo: 'sidasta-ordsending', formats: ['110 × 178 mm', '135 × 210 mm', '148 × 210 mm', '170 × 240 mm'], bindings: ['Fræst', 'Saumað', 'French fold kápa'], pages: true, hint: 'Í offsetprentun er lágmarksmagn oft um 500 til 1.000 eintök.' },
  { key: 'ljosmynd', label: 'Ljósmyndabók', en: 'Photo book', photo: 'incredible-iceland', formats: ['240 × 300 mm', '300 × 240 mm (langsnið)', '300 × 300 mm', '330 × 260 mm (langsnið)'], bindings: ['Saumað harðband', 'Otabind / lay-flat', 'Harðband í öskju'], pages: true, hint: 'Pappírsþykkt og gljástig eru valin fyrir hverja bók. Vottaðar GMG-litaprufur ef óskað er.' },
  { key: 'stafraent', label: 'Stafræn prentun', en: 'Short run', photo: 'gjafabaekur-stafli', formats: ['148 × 210 mm', '170 × 240 mm', '210 × 297 mm'], bindings: ['Harðband, saumað', 'Harðband, fræst', 'Kilja, fræst'], pages: true, hint: 'Hentar þegar upplagið er undir offset-lágmarkinu: færri eintök, hagkvæmara og fljótlegra.' },
  { key: 'spil', label: 'Borðspil', en: 'Board game', photo: 'skripo', formats: ['Ferköntuð askja', 'Aflöng askja', 'Spilastokkur', 'Eigin mál'], bindings: ['Prentaðir íhlutir', 'Íhlutir úr plasti, málmi eða tré', 'Sérsniðinn innri bakki'], pages: false, hint: 'Lágmarkspöntun er oftast um 500 eintök. Afgreiðslutími 6 til 12 vikur frá samþykktri próförk.' },
  { key: 'kort', label: 'Landakort', en: 'Map', photo: 'kort-2', formats: ['600 × 840 mm', '840 × 1190 mm', '1120 × 1600 mm (hámark í brotvél)', '1200 × 1620 mm (hámark)'], bindings: ['Brotið', 'Brotið í plastvasa', 'Óbrotið'], pages: false, hint: 'Hámarksstærð er 1200 × 1620 mm og 1120 × 1600 mm í brotvél.' },
  { key: 'timarit', label: 'Tímarit eða bæklingur', en: 'Magazine', photo: 'timarit', formats: ['A5 (148 × 210 mm)', 'A4 (210 × 297 mm)', '230 × 297 mm', 'Eigin mál'], bindings: ['Vírheft', 'Fræst'], pages: true, hint: 'Vírheft rit eru í blaðsíðufjölda sem gengur upp í 4.' },
]
export const PAPERS = ['Húðaður mattur', 'Húðaður glans', 'Óhúðaður', 'Bókapappír (ljós)', 'Veit ekki, ráðleggið mér']
export const FINISH = ['Fólíuþrykk', 'Blindþrykk', 'Upphleyping', 'UV hlutalakk', 'Lesmerkiborði', 'Litað snið', 'Askja', 'Plastpökkun']
export const FILES = ['PDF tilbúið til prentunar', 'Skjöl í vinnslu', 'Þarf aðstoð við forvinnslu', 'Bara hugmynd enn sem komið er']
export const DESTS = ['Á lager hjá mér á Íslandi', 'Til dreifingaraðila á Íslandi', 'Heim að dyrum erlendis', 'Vöruhýsing og dreifing í Evrópu eða Bandaríkjunum']

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Prentmiðlun ehf.',
  url: 'https://www.prentmidlun.is/',
  email: CONTACT.email,
  telephone: '+354 554 5800',
  taxID: CONTACT.kt,
  foundingDate: '2008',
  founder: { '@type': 'Person', name: 'Eyþór Páll Hauksson' },
  address: { '@type': 'PostalAddress', streetAddress: CONTACT.street, postalCode: '220', addressLocality: 'Hafnarfjörður', addressCountry: 'IS' },
  sameAs: [CONTACT.facebook],
}

export const companyEntry: PreviewCompany = {
  slug: 'prentmidlun',
  route: ROUTE,
  name: 'Prentmiðlun',
  sector: 'Prentmiðlun: bækur, borðspil, kort og tímarit',
  location: 'Reykjavíkurvegur 70, 220 Hafnarfjörður',
  region: 'Höfuðborgarsvæðið',
  established: 'Frá 2008',
  currentUrl: 'https://www.prentmidlun.is',
  ownerEmail: 'prentmidlun@prentmidlun.is',
  concept: 'Frá skrá að dyrum',
  conceptTagline: 'The Live-up studio system re-aimed at a print broker: a book-serif display with an English gloss, printer’s crop marks and signature letters, 42 of their own studio photos on a filterable wall, and a print quote builder with a staff-side docket view.',
  accent: '#3A91C7',
  dark: false,
  status: 'In build',
  thumb: A('work/askja-loftmynd-640.webp'),
  ownPhotography: true,
  photoCredit: 'Allar myndir eru úr myndasafni Prentmiðlunar á prentmidlun.is.',
  audit: {
    strengths: ['Bókaprentun síðan 2008, með Flóru Íslands (12 kg, í viðarkassa) að baki', 'Um 80 vandaðar ljósmyndir af eigin verkum, flokkaðar eftir tegund', 'Heim að dyrum til flestra landa, vöruhýsing í Evrópu og Bandaríkjunum'],
    weaknesses: ['© 2014 og WordPress-þema frá 2014', 'Hálfenskur vafrakökuborði („Privacy Overview“, „SAVE & ACCEPT“)', 'Ekkert heimilisfang á forsíðu, textar slitnir í miðri setningu („Ef óskað er þá […]“)'],
    opportunities: ['Verðtilboðsbeiðni sem spyr réttu spurninganna strax', 'Verkasafn sem sýnir breiddina: bækur, spil, kort', 'Einn vefur á íslensku og ensku fyrir útgefendur heima og erlendis'],
  },
  positioning: 'Prentmiðlun finnur réttu prentsmiðjuna fyrir hvert verk og sér um allt frá skjali að dyrum. Vefurinn á að sýna verkin og taka við fullbúinni fyrirspurn.',
  outreach: {
    subject: 'Hugmynd að nýjum vef fyrir Prentmiðlun',
    body: 'Sjá _docs/PRENTMIDLUN-BUILD-2026-10-09.md (pitch hooks, ekki sent).',
  },
}
