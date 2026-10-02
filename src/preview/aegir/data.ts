import type { PreviewCompany } from '../companies'
import { SIZE } from './photos.gen'

/**
 * SEGLAGERÐIN ÆGIR EHF. — seglagerdin.is (kt. 470904-2750)
 *
 * Every string below is Seglagerðin Ægir's own published copy (seglagerdin.is,
 * harvested 2026-10-02 from the live pages), tidied only for spelling, or a fact
 * they publish themselves; every price is a price in their own tables. Their
 * site publishes prices, so this page has prices, and only theirs. Where a
 * number is stale or contradicts another page it is listed in
 * _docs/aegir-build-2026-10-02/HANDOFF.md, not guessed
 * ([[client-copy-from-their-own-words]], [[feedback-her-text-verbatim-ours-bulletproof]]).
 *
 * Photography: every picture is one their own pages show, at the highest
 * resolution their media library serves; widths are the real served widths so
 * srcset never claims pixels the file does not have ([[srcset-descriptor-lies]]).
 * The wedding and Viðey tent series carry a third-party watermark and are not
 * used. A premises name is shown only where the sign in the photograph reads it.
 */

const BASE = import.meta.env.BASE_URL

export interface Photo {
  src: string
  srcSet: string
  alt: string
  /** natural aspect, so the grid can reserve space and never shift */
  ratio: string
  portrait?: boolean
}

const P = (id: string, alt: string): Photo => {
  const [w, h] = SIZE[id] ?? [1920, 1280]
  return {
    src: `${BASE}aegir/${id}-1920.jpg`,
    srcSet: w > 960 ? `${BASE}aegir/${id}-960.jpg 960w, ${BASE}aegir/${id}-1920.jpg ${w}w` : `${BASE}aegir/${id}-1920.jpg ${w}w`,
    alt,
    ratio: `${w} / ${h}`,
    portrait: h > w,
  }
}

export const CONTACT = {
  simi: '511 2200',
  simiHref: 'tel:+3545112200',
  netfang: 'seglagerdin@seglagerdin.is',
  kennitala: '470904-2750',
  heimilisfang: 'Tónahvarf 5',
  postnumer: '203 Kópavogur',
  opid: 'Opið mánudaga til föstudaga kl. 8:00 til 17:00',
}

export const PHOTO = {
  // awnings and canopies on named premises (signage visible)
  einstok: P('einstok', 'Blá bogaskyggni yfir inngangi og gluggum Einstök Bar, grátt hús við götu með rauðri gangstétt'),
  kaffibarinn: P('kaffibarinn', 'Blá bogaskyggni yfir dyrum og gluggum Kaffibarsins í rauðu bárujárnshúsi'),
  kaffibarinn2: P('kaffibarinn2', 'Rautt hús með bláum bogaskyggnum og skilti Kaffibarsins'),
  american: P('american', 'Rauðar markísur yfir fullri verönd American Bar á sólardegi'),
  american2: P('american2', 'Rauðar og hvítar röndóttar markísur yfir gestum fyrir utan American Bar'),
  american3: P('american3', 'Markísur American Bar séðar eftir götunni'),
  english: P('english', 'Gestir sitja undir markísum fyrir utan The English Pub'),
  english2: P('english2', 'Rauð markísa með merki yfir gangstétt fyrir utan The English Pub, sendibíll fyrir framan'),
  frederiksen: P('frederiksen', 'Svört bogaskyggni yfir dökkum viðardyrum Frederiksen Ale House'),
  frederiksen2: P('frederiksen2', 'Svört bogaskyggni með merki Frederiksen Ale House, séð að ofan og frá hlið'),
  napoli: P('napoli', 'Svartar bogaskyggnur með áletruninni Napoli yfir gluggum hvíts húss'),
  napoli2: P('napoli2', 'Napoli bogaskyggni yfir inngangi í sólskini'),
  napoli3: P('napoli3', 'Svört bogaskyggni Napoli yfir stórum gluggum'),
  ahansen: P('ahansen', 'Rauðar bogaskyggnur með merki A. Hansen á gulu timburhúsi'),
  ahansen2: P('ahansen2', 'Rauð bogaskyggni yfir dyrum A. Hansen, gult hús og blómapottar'),
  centrum: P('centrum', 'Svört bogaskyggni með áletruninni Centrum yfir verslunarglugga, bíll og stigi fyrir framan'),
  tapas: P('tapas', 'Rauðir sólhlífar með áletruninni Tapashúsið á hafnarsvæði með gestum við borð'),
  tapas2: P('tapas2', 'Stórir rauðir sólhlífar yfir útisvæði Tapashússins'),
  tapas3: P('tapas3', 'Rauðir ferkantaðir sólhlífar við hafnarbakka'),
  alda: P('alda', 'Svart kúluskyggni með gylltri áletruninni ALDA'),
  litir: P('litir', 'Litakort með akrýldúk í fjölda lita, rauðum, grænum, bláum og röndóttum'),
  // awnings on houses and terraces
  markisaHus1: P('markisa-hus1', 'Dökk markísa út frá hvítu húsi yfir viðarpall með borðum og stólum'),
  markisaHus2: P('markisa-hus2', 'Dökk útdraganleg markísa yfir verönd við hvítt hús'),
  markisaHus3: P('markisa-hus3', 'Markísa á nútímalegu húsi með svartri og hvítri klæðningu, grasflöt fyrir framan'),
  markisaOpin: P('markisa-opin', 'Dökkgrá markísa á hvítu húsi með timburbyggingu við sólpall'),
  markisaBox: P('markisa-box', 'Markísa í hlífðarboxi útdregin yfir sólpall við hvítt hús'),
  markisaBox2: P('markisa-box2', 'Útdregin markísa í boxi séð að neðan með borðum og stólum'),
  markisaGata: P('markisa-gata', 'Rauðar markísur á steinhúsi við göngugötu í Reykjavík'),
  markisaPort: P('markisa-port', 'Dökk markísa yfir sólpall við blátt hús, lóðrétt mynd'),
  hlidar: P('hlidar', 'Hliðarmarkísa á hvítu húsi með bogadregnum glugga'),
  // pools and hot tubs
  potturFyrir: P('pottur-fyrir', 'Gamall átthyrndur pottur með slitnu bláu yfirborði og tröppum, áður en dúkur er lagður'),
  potturEftir: P('pottur-eftir', 'Sami átthyrndi potturinn með nýjum hvítum dúk og bláum tröppum'),
  laugFyrir: P('laug-fyrir', 'Tóm sporöskjulaga laug með gráu yfirborði áður en dúkur er lagður'),
  laugEftir: P('laug-eftir', 'Sama sporöskjulaga laugin með nýjum bláum dúk og svörtum brautarlínum'),
  hlif1: P('hlif1', 'Blá yfirbreiðsla yfir útisundlaug með fjöllum í baksýn'),
  hlif2: P('hlif2', 'Sundlaugarhlíf úr bláum dúk og rennibraut á bakka við sundlaug'),
  hlif3: P('hlif3', 'Blár dúkur yfir sundlaug í vetrarsól'),
  hlif4: P('hlif4', 'Blá sundlaugarhlíf með handriði á bakka'),
  laugSnjor: P('laug-snjor', 'Blá yfirbreiðsla á útisundlaug í snjó'),
  laugRennibraut: P('laug-rennibraut', 'Útisundlaug með gulri rennibraut og bláu yfirborði'),
  pottur2: P('pottur2', 'Heitur pottur með bláum dúk og tveimur stálhandföngum, viðarbrún'),
  laugHlifRond: P('laug-hlif-rond', 'Kringlótt blá hlíf yfir potti í grasi við sundlaug'),
  // tent hire
  hardarParty: P('harpa-party', 'Samsett partýtjöld á plani við Hörpu'),
  partyPallur: P('party-pallur', 'Rjómahvítt partýtjald á viðarpalli með glerhandriði'),
  partyHus: P('party-hus', 'Partýtjald við gult hús með gluggum allan hringinn'),
  partyHjolhysi: P('party-hjolhysi', 'Partýtjald tengt við húsbíl á grasi'),
  partyPallur2: P('party-pallur2', 'Salur með viðargólfi og gluggum út að höfn'),
  partyPort: P('party-port', 'Innan í partýtjaldi með borðum og bekkjum á viðargólfi'),
  hitari: P('hitari', 'Gashitari inni í tjaldi á grasi með hvítum standborðum'),
  hitari2: P('hitari2', 'Gashitari og standborð með hvítum dúk undir tjaldþaki'),
  hitariPort: P('hitari-port', 'Stálgashitari og standborð inni í tjaldi'),
  veislaTun: P('veisla-tun', 'Hvítt veislutjald með bogadregnum gluggum á grasflöt, fólk við hornið'),
  veislaBogi: P('veisla-bogi', 'Veislutjald með blómaboga við inngang og borð fyrir framan'),
  veislaInni: P('veisla-inni', 'Innan í veislutjaldi: langt borð með grænum dúk, bekkir og bogadregnir gluggar'),
  veislaInni2: P('veisla-inni2', 'Innan í veislutjaldi með löngum borðum og bekkjum'),
  veislaHarpa: P('veisla-harpa', 'Langt hvítt veislutjald fyrir framan Hörpu með fánum'),
  veislaHorn: P('veisla-horn', 'Horn á hvítu veislutjaldi með bogadregnum gluggum við hús'),
  veislaHus: P('veisla-hus', 'Veislutjald við hlið stórhýsis með gluggum á hliðum'),
  veislaPort: P('veisla-port', 'Veislutjald við atvinnuhúsnæði með borðum fyrir framan'),
  veislaHol: P('veisla-hol', 'Veislutjald á svörtum malarvelli í dalverpi'),
  golf: P('golf', 'Trégólf og borð í veislutjaldi'),
  golf2: P('golf2', 'Viðargólf og langt borð með dúk í tjaldi'),
  // sewing workshop
  net: P('net', 'Appelsínugular ólar með málmhring saumaðar í net á gólfi saumastofunnar'),
  net2: P('net2', 'Appelsínugult ólanet á gólfi, nærmynd af saumuðum samskeytum'),
  skilrum: P('skilrum', 'Stór hvít dúkskilrúm hengd í lofti í vöruskemmu með lyftara'),
  skilrum2: P('skilrum2', 'Grá dúkskilrúm fyrir framan hurð í bílskúr'),
  ruslur: P('ruslur', 'Glær plastrimlagardína fyrir framan rautt tæki'),
  bat: P('bat', 'Blá yfirbreiðsla yfir bát á kerru'),
  bat2: P('bat2', 'Dökkgrá og hvít yfirbreiðsla yfir bát á hafnarbakka'),
  traktor: P('traktor', 'Dráttarvél við slátt í grænum túni með dúkhlíf á sláttuvél'),
  flugvel: P('flugvel', 'Gul flugvél í flugskýli með sérsaumaða hlíf'),
  pudar: P('pudar', 'Hvítur garðbekkur með bláum og hvítröndóttum púðum og dökkbláu sæti'),
  loft: P('loft', 'Hvítur dúkur strekktur sem loftklæðning yfir borð í veitingasal'),
  kross: P('kross', 'Rauður krossformaður bólstraður leikkubbur á grænu gólfi'),
  taska: P('taska', 'Gul vatnsheld taska með áletruninni Dagskrá á Austurlandi'),
  segl: P('segl', 'Há hvít segl á stöngum meðfram hafnarsvæði'),
  skjolveggur: P('skjolveggur', 'Appelsínugult skjól á svalahandriði á húsi við höfn'),
  tjoldRondott: P('tjold-rondott', 'Bláhvítröndótt tjöld á hátíðarsvæði með fólki við borð'),
  sirkus: P('sirkus', 'Stórt rauðhvítt tjald með tveimur mastrastöngum'),
  tjaldSnjor: P('tjald-snjor', 'Stórt grænblátt tjald í snjó með flutningabíl'),
  tjaldveggur: P('tjaldveggur', 'Svartur tjaldveggur með gluggaplasti á timburklæðningu'),
  kerra: P('kerra', 'Blá yfirbreiðsla á kerru fyrir framan hús'),
  svalir: P('svalir', 'Skjólveggur úr hvítum dúk við svalir með borði og stólum'),
  svalir2: P('svalir2', 'Hvítur skjóltjaldsveggur með gluggaplasti við sólpall með grilli og sófa'),
  skjol1: P('skjol1', 'Hvítt skjól við viðarpall með grillhlíf og húsgögnum'),
  skjol2: P('skjol2', 'Skjólveggur úr dúk með glugga við verönd'),
  fortjald: P('fortjald', 'Sóltjald með rúðuplasti fest við hjólhýsi á grasi'),
  bidskyli: P('bidskyli', 'Biðskýli úr gleri og stáli við grjótvegg'),
  bidskyli2: P('bidskyli2', 'Glerbiðskýli með grænum stálgrind á gangstétt'),
  bidskyli3: P('bidskyli3', 'Biðskýli með skilti og grjóthleðslu í bakgrunni'),
  sagaFyrr: P('saga-fyrr', 'Gömul ljósmynd af stóru tjaldi og mannfjölda í kring'),
  sagaDalur: P('saga-dalur', 'Loftmynd af grænum dal með fjölda hvítra tjalda og tjaldbúða'),
  sagaMynd: P('saga-mynd', 'Svört markísa yfir inngangi á bar með skreyttu húsi og ljósaseríu'),
} satisfies Record<string, Photo>

/* ── the work: premises that show on their own pages ────────────────────── */

export interface Verk {
  slug: string
  name: string
  flokkur: string
  /** only where it is certain, see the header note */
  stadur?: string
  /** one line naming the job */
  lina: string
  /** what their own pages say about this kind of work, unchanged */
  texti: string
  /** the dated before / after pair this job shows, if any */
  pair?: 'pottur' | 'laug'
  cover: Photo
  gallery: Photo[]
  /** which request form the page leads on to */
  leid: 'markisa' | 'leiga' | 'saumastofa'
}

const BOGA = 'Bogaskyggni eru í senn góð auglýsing, útlitsuppbót og prýði fyrir fyrirtæki.'
const POTT = 'Seglagerðin notast við sterkan pvc dúk og á bakkana er settur hálkufrír dúkur.'
const TJALD = 'Partý tjaldið er auðvelt í uppsetningu og flutning.'
const VEISLA = 'Veislutjaldið er bjart og þægilegt sem og að bogadregnir gluggarnir skapa hátíðlegt yfirbragð.'
const lina = (name: string) => `${name} er á meðal verka Seglagerðarinnar.`

/** The grid shows the first seven, in the order that suits the reference's
 *  rhythm (a wide opener, two portraits, then half widths); the rest are
 *  linked in the banner. */
export const VERK: Verk[] = [
  { slug: 'einstok-bar', name: 'Einstök Bar', flokkur: 'Bogaskyggni', lina: lina('Bogaskyggnið á Einstök Bar'), texti: BOGA, cover: PHOTO.einstok, gallery: [PHOTO.einstok], leid: 'markisa' },
  { slug: 'a-hansen', name: 'A. Hansen', flokkur: 'Bogaskyggni', stadur: 'Hafnarfjörður', lina: lina('Bogaskyggnin á A. Hansen'), texti: BOGA, cover: PHOTO.ahansen2, gallery: [PHOTO.ahansen2, PHOTO.ahansen], leid: 'markisa' },
  { slug: 'frederiksen-ale-house', name: 'Frederiksen Ale House', flokkur: 'Bogaskyggni', stadur: 'Reykjavík', lina: lina('Bogaskyggnið á Frederiksen Ale House'), texti: BOGA, cover: PHOTO.frederiksen, gallery: [PHOTO.frederiksen, PHOTO.frederiksen2], leid: 'markisa' },
  { slug: 'tjold-vid-horpu', name: 'Tjöld við Hörpu', flokkur: 'Tjaldaleiga', stadur: 'Reykjavík', lina: lina('Tjöldin við Hörpu'), texti: `${TJALD} ${VEISLA}`, cover: PHOTO.hardarParty, gallery: [PHOTO.hardarParty, PHOTO.veislaHarpa], leid: 'leiga' },
  { slug: 'kaffibarinn', name: 'Kaffibarinn', flokkur: 'Bogaskyggni', stadur: 'Reykjavík', lina: lina('Bogaskyggnin á Kaffibarnum'), texti: BOGA, cover: PHOTO.kaffibarinn, gallery: [PHOTO.kaffibarinn, PHOTO.kaffibarinn2], leid: 'markisa' },
  { slug: 'pottur-dukalogn', name: 'Heitur pottur, dúklögn', flokkur: 'Sundlaugar og pottar', stadur: 'Júní 2013', lina: lina('Dúklögnin í þessum potti'), texti: `Sundlaugar og pottar eru okkar fag. ${POTT} Myndirnar eru dagsettar 19. og 22. júní 2013.`, cover: PHOTO.potturEftir, gallery: [PHOTO.potturEftir, PHOTO.potturFyrir], pair: 'pottur', leid: 'saumastofa' },
  { slug: 'american-bar', name: 'American Bar', flokkur: 'Markísur', stadur: 'Reykjavík', lina: lina('Markísurnar á American Bar'), texti: 'Markísurnar okkar eru sterkar og endingargóðar. Þær veita sérstakt skjól fyrir regni og sól.', cover: PHOTO.american, gallery: [PHOTO.american, PHOTO.american2, PHOTO.american3], leid: 'markisa' },
  { slug: 'the-english-pub', name: 'The English Pub', flokkur: 'Markísur', stadur: 'Reykjavík', lina: lina('Markísurnar á The English Pub'), texti: 'Markísurnar okkar eru sterkar og endingargóðar. Þær veita sérstakt skjól fyrir regni og sól.', cover: PHOTO.english, gallery: [PHOTO.english, PHOTO.english2], leid: 'markisa' },
  { slug: 'napoli', name: 'Napoli', flokkur: 'Bogaskyggni', lina: lina('Bogaskyggnin hjá Napoli'), texti: BOGA, cover: PHOTO.napoli, gallery: [PHOTO.napoli, PHOTO.napoli2, PHOTO.napoli3], leid: 'markisa' },
  { slug: 'centrum', name: 'Centrum', flokkur: 'Bogaskyggni', lina: lina('Bogaskyggnið hjá Centrum'), texti: BOGA, cover: PHOTO.centrum, gallery: [PHOTO.centrum], leid: 'markisa' },
  { slug: 'tapashusid', name: 'Tapashúsið', flokkur: 'Sólhlífar', lina: lina('Sólhlífarnar hjá Tapashúsinu'), texti: 'Við hjá Seglagerðinni tökum að okkur að sérsmíða sólhlífar að þínum þörfum. Þær veita gott skjól fyrir bæði rigningu og sól.', cover: PHOTO.tapas, gallery: [PHOTO.tapas, PHOTO.tapas2, PHOTO.tapas3], leid: 'markisa' },
  { slug: 'laug-dukalogn', name: 'Sundlaug, dúklögn', flokkur: 'Sundlaugar og pottar', stadur: 'Maí 2015', lina: lina('Dúklögnin í þessari laug'), texti: `Sundlaugar og pottar eru okkar fag. ${POTT} Myndirnar eru teknar 16. og 17. maí 2015.`, cover: PHOTO.laugEftir, gallery: [PHOTO.laugEftir, PHOTO.laugFyrir], pair: 'laug', leid: 'saumastofa' },
  { slug: 'veislutjald', name: 'Veislutjald í sveit', flokkur: 'Tjaldaleiga', lina: lina('Þetta veislutjald'), texti: VEISLA, cover: PHOTO.veislaTun, gallery: [PHOTO.veislaTun, PHOTO.veislaBogi, PHOTO.veislaHol, PHOTO.veislaInni], leid: 'leiga' },
  { slug: 'sundlaugarhlifar', name: 'Sundlaugarhlífar', flokkur: 'Yfirbreiðslur', lina: lina('Þessar hlífar yfir sundlaugar'), texti: 'Við saumum fjölmargar tegundir af yfirbreiðslum.', cover: PHOTO.hlif1, gallery: [PHOTO.hlif1, PHOTO.hlif2, PHOTO.hlif3, PHOTO.hlif4], leid: 'saumastofa' },
]
export const VERK_GRID = VERK.slice(0, 7)
export const VERK_ONNUR = VERK.slice(7)

/* ── the words ──────────────────────────────────────────────────────────── */

export const TEXTI = {
  tagline: 'Hönnum og saumum það sem þér hentar',
  heroLabel: 'Seglagerðin Ægir, stofnuð 1913',
  inngangur:
    'Seglagerðin Ægir er eitt af elstu starfandi fyrirtækjum landsins, stofnað 1913. Það hefur ávallt kappkostað að laga sig að kröfum tímans og viðskiptavinanna.',
  um: 'Eitt af elstu starfandi fyrirtækjum landsins, stofnað 1913.',
  umMalsgrein:
    'Seglagerðin hefur ætið verið í nálægð við Reykjavíkurhöfn og var starfsemi þess upphaflega bundin við sjávarútveginn. Seglagerðin Ægir hefur verið í eigu sömu fjölskyldunnar frá því árinu 1951 og er nú í eign og stjórn Björgvins Barðdal, sem er þriðji ættliður framkvæmdastjóra fyrirtækisins.',
  saumastofan:
    'Saumastofan sér um að sauma allt frá hælapokum að markísum og upp í 20 þúsund fermetra vöruskemmur, einnig sér hún um almennar viðgerðir á tjöldum og seglum. Starfsmenn saumastofunnar búa yfir áratuga reynslu af hönnun og saumaskap og er því ekkert verkefni of lítið eða of stórt fyrir okkur.',
  tjaldaleigan:
    'Tjaldaleigan leigir þér veislutjöld sem henta við hvert tækifæri, ásamt aukahlutum eins og borðum, bekkjum, hiturum og trégólfum. Hafðu samband og við gefum þér tilboð í allt frá 2 manna einkapartý til 2.000 manna stórveislu.',
  thjonustaIntro: 'Fjórar leiðir til Seglagerðarinnar. Veldu þá sem passar við verkið.',
  verkH2: 'Verkin sjást víða um Reykjavík og landið allt.',
  verkIntro: 'Hér eru verk sem Seglagerðin hefur unnið, hvert á sinni síðu.',
  leigaH2: 'Tjaldaleigan.',
  leigaIntro:
    'Veislutjöld, partýtjöld, borð, bekkir, gólf og hitarar. Hér eru verð Seglagerðarinnar eins og þau eru birt á vef þeirra. Settu saman viðburðinn þinn og sendu beiðnina, starfsmaður staðfestir dagsetningu og verð.',
  markisaH2: 'Markísur og skyggni.',
  markisaIntro:
    'Seglagerðin hefur um árabil framleitt markísur í öllum stærðum og gerðum. Markísurnar okkar eru sterkar og endingargóðar. Við mælum og sérhönnum markísu fyrir þitt hús.',
  markisaFyrirvari: 'Seglagerðin áskilur sér rétt til breytinga á verðskrá. Endanlegt verð er staðfest við mælingu.',
  laugH2: 'Sundlaugar og pottar eru okkar fag.',
  laugIntro:
    'Seglagerðin tekur að sér að leggja dúk í heita potta og sundlaugar um land allt. Dúklögn er langvarandi og hugguleg lausn. Starfsmenn okkar hafa mikla reynslu af dúklögn í hinar ýmsu stærðir sundlauga og potta.',
  saumH2: 'Saumastofan og verkstæðið.',
  saumIntro:
    'Saumastofa og verkstæði Seglagerðarinnar er skipuð fagmönnum sem hanna og sauma það sem þér hentar. Starfsmenn verkstæðisins aðstoða við að finna sem hentugasta lausn á viðfangsefninu, útfæra hana og framleiða.',
  saumVerkefni:
    'Alls slags tjöld, yfirbreiðslur, töskur, skjólveggir, skilrúmsveggir og loftklæðningar eru meðal verkefna sem starfsmenn Seglagerðarinnar hafa leyst. Hafirðu skemmtilega hugmynd ættir þú að líta við í Seglagerðinni.',
  sagaH2: 'Frá Duus-húsi við Ægisgötu í Tónahvarf.',
  sagaIntro:
    'Seglagerðin hefur í yfir hundrað ár starfað í návígi við Reykjavíkurhöfn. Fyrstu árin einkenndist starfsemin af þjónustu við útgerðina með seglasaumi, yfirbreiðslu fyrir síldarbáta og fleira því tengt.',
  metnadur: 'Segðu okkur hvað þig vantar.',
  tilbod:
    'Veldu hvort það er tjald, markísa eða sérsaumur, fylltu út það sem þú veist og sendu okkur beiðnina. Því nákvæmari sem hún er, því fyrr getum við svarað með tilboði.',
}

export const MARKMID = [
  'Ekkert verkefni er of stórt eða lítið fyrir okkur.',
  'Sérhannað fyrir íslenskar aðstæður.',
  'Við mælum og sérhönnum markísu fyrir þitt hús.',
  'Aðeins þriggja til fimm daga afgreiðslufrestur.',
  'Seglagerðin kappkostar að bjóða upp á örugga og fljótlega þjónustu með þörfum viðskiptavinarins á leiðarljósi.',
  'Hafirðu skemmtilega hugmynd ættir þú að líta við í Seglagerðinni.',
]

/** The four ways in, each with the sentence their own page uses for it. */
export const LEIDIR = [
  {
    id: 'tjaldaleiga',
    titill: 'Tjaldaleiga',
    texti: 'Hafðu samband og við gefum þér tilboð í allt frá 2 manna einkapartý til 2.000 manna stórveislu.',
    hnappur: 'Setja saman viðburð',
    photo: PHOTO.partyPallur,
  },
  {
    id: 'markisur',
    titill: 'Markísur og skyggni',
    texti: 'Aðeins þriggja til fimm daga afgreiðslufrestur. Góð auglýsing, mögulegt að prenta á skyggnin.',
    hnappur: 'Skoða verð og stærðir',
    photo: PHOTO.markisaHus3,
  },
  {
    id: 'sundlaugar',
    titill: 'Sundlaugar og pottar',
    texti: 'Seglagerðin tekur að sér að leggja dúk í heita potta og sundlaugar um land allt.',
    hnappur: 'Sjá fyrir og eftir',
    photo: PHOTO.laugEftir,
  },
  {
    id: 'saumastofa',
    titill: 'Sérsaumur og viðgerðir',
    texti: 'Alhliða viðgerða- og viðhaldsþjónusta á seglum, tjöldum, skyggnum, yfirbreiðslum, sundlaugum og heitum pottum.',
    hnappur: 'Senda verkefnið',
    photo: PHOTO.flugvel,
  },
] as const

/* ── tent hire: their published prices (Dag/Helgarleiga) ─────────────────── */

export interface PartyTent { fm: number; mal: string; gestir: string; gestirMin: number; gestirMax: number; kg: number; verd: number }
/** tjaldaleiga/party-tjaldid, modified 2026-05-27 */
export const PARTY_TENTS: PartyTent[] = [
  { fm: 20, mal: '5 m × 4 m', gestir: '20 til 40', gestirMin: 20, gestirMax: 40, kg: 100, verd: 35000 },
  { fm: 30, mal: '5 m × 6 m', gestir: '30 til 50', gestirMin: 30, gestirMax: 50, kg: 130, verd: 44000 },
  { fm: 40, mal: '5 m × 8 m', gestir: '40 til 60', gestirMin: 40, gestirMax: 60, kg: 160, verd: 53000 },
  { fm: 50, mal: '5 m × 10 m', gestir: '50 til 80', gestirMin: 50, gestirMax: 80, kg: 190, verd: 62000 },
  { fm: 60, mal: '5 m × 12 m', gestir: '60 til 100', gestirMin: 60, gestirMax: 100, kg: 220, verd: 70000 },
]

export interface RentalItem { id: string; nafn: string; mal: string; fyrir: string; kg: number; verd: number; eining: string; hamark: number }
/** tjaldaleiga/bord-og-bekkir, golf and hitablasari, modified 2025-05-24 and 2024-02-19/20 */
export const RENTAL_ITEMS: RentalItem[] = [
  { id: 'bord', nafn: 'Borð', mal: '80 × 220 × 70 cm', fyrir: '7 til 8 manns', kg: 25, verd: 3500, eining: 'stk.', hamark: 60 },
  { id: 'bekkur', nafn: 'Bekkur', mal: '25 × 220 cm', fyrir: '7 til 8 manns', kg: 13, verd: 1000, eining: 'stk.', hamark: 120 },
  { id: 'standbord', nafn: 'Standborð', mal: '79 × 113 cm', fyrir: '4 til 6 manns', kg: 12, verd: 2500, eining: 'stk.', hamark: 60 },
  { id: 'golf', nafn: 'Trégólf', mal: 'einingar 50 × 300 cm', fyrir: 'hver fermetri', kg: 16, verd: 700, eining: 'm²', hamark: 468 },
  { id: 'hitari', nafn: 'Hitablásari', mal: '220 cm á hæð, hitar 25 til 30 m²', fyrir: 'með 11 kg gaskút', kg: 10, verd: 12000, eining: 'stk.', hamark: 20 },
]
export const GASKUTUR = { nafn: 'Fullur gaskútur', verd: 6500 }

export const VEISLUTJALD = {
  stærd: 'Stærðin getur verið allt frá 54 upp í 468 m². Hver eining er 3 metra löng.',
  breidd: [6, 9, 12],
  einingMetrar: 3,
  minFm: 54,
  maxFm: 468,
  vegghaed: 'Vegghæð veislutjaldsins er 220 til 240 cm en fyrir miðju er tjaldið 4 metrar.',
  inngangur: 'Venjulegur inngangur er 80 cm breiður en að auki er hægt að fá inngang sem er 270 cm.',
  uppsetning:
    'Veislutjaldið er leigt með fullri upp og niðurtöku en mögulegt er að senda einn mann með tjaldinu og þá útvegar leigjandinn 3 til 5 aðstoðarmenn.',
  notkun:
    'Veislutjaldið hefur verið sérstaklega vinsælt fyrir brúðkaup og stórafmæli en einnig hafa ýmis fyrirtæki nýtt sér tjaldið til að auka við rými sitt, til dæmis fyrir viðskiptasýningar, tímabundinn lager og útsölur.',
}
export const PARTY_FACTS = [
  'Sterk álgrind sem auðvelt er að setja saman gerir tjaldið stöðugt.',
  'Gluggar allan hringinn til þess að hleypa birtunni inn.',
  'Vegghæð tjaldanna er 200 cm og hæð fyrir miðju er 280 cm.',
  'Mögulegt er að hafa inngang hvar sem er og jafnvel má sleppa öllum gluggunum.',
]
export const LEIGU_REGLUR = [
  'Leigutaki ber fulla ábyrgð á umgengni og leigubúnaði á leigutíma.',
  'Leigutaki skuldbindur sig til að bæta tjón sem verða kann á leigubúnaði á leigutíma, hvort sem hann setur búnaðinn sjálfur upp eða fær aðstoð leiguaðila.',
  'Dagleiga er leiga í einn dag á tímabilinu frá mánudegi til föstudags.',
  'Helgarleiga er leiga frá umsömdum tíma á föstudegi og skilað á mánudagsmorgni.',
  'Ganga þarf frá greiðslu um leið og leigubúnaður er sóttur.',
  'Leigutaki þarf að leggja fram greiðslukortanúmer sem tryggingu fyrir mögulegu tjóni á leigubúnaði.',
  'Leigutaki skilar leigubúnaðinum strax að leigutíma loknum til starfsmanna Seglagerðarinnar Ægis í Tónahvarfi 5, annars getur Seglagerðin innheimt sektir vegna tafa.',
  'Leigutaki skilar leigubúnaði hreinum að leigutíma loknum, annars er innheimt þrifagjald af kortinu sem lagt var fram sem trygging.',
]

/* ── awnings: every cell of their own price tables ───────────────────────── */

export interface AwningGrid {
  id: 'opin' | 'lokud'
  nafn: string
  innifalid: string
  motor: number
  /** útdraganleg lengd, cm */
  lengdir: number[]
  /** breidd, cm → price per útdraganleg lengd in the same order; a shorter row means larger projections are not offered at that width */
  rader: Record<number, number[]>
}
/** saumastofa/markisur/markisa-i-opnu-boxi (2025-03-30) and markisa-i-lokudu-boxi (2025-04-04) */
export const AWNINGS: AwningGrid[] = [
  {
    id: 'opin',
    nafn: 'Markísa í opnu boxi',
    innifalid: 'útdraganlegt skyggni, dúkur að eigin vali, sveif og festingar',
    motor: 69900,
    lengdir: [160, 185, 210, 260, 310, 360],
    rader: {
      200: [192900],
      250: [206900, 213900, 225900],
      300: [219100, 228000, 239900, 253900],
      400: [233500, 248800, 262000, 277200, 289200, 304200],
      500: [281500, 292600, 303500, 317200, 334100, 364100],
    },
  },
  {
    id: 'lokud',
    nafn: 'Markísa í hlífðarboxi',
    innifalid: 'útdraganlegt skyggni í sterku hlífðarboxi, dúkur að eigin vali, sveif og festingar',
    motor: 69000,
    lengdir: [160, 185, 210, 260, 310, 360],
    rader: {
      250: [266200, 279000, 293000],
      300: [292000, 305500, 319100, 333000],
      350: [316000, 327000, 339700, 351300, 363600],
      400: [337900, 351500, 359500, 377500, 385800, 397300],
      450: [361900, 377500, 382100, 392000, 411000, 422500],
      500: [395100, 401500, 416600, 429200, 441800, 453000],
      600: [446700, 464400, 481700, 505000, 523000, 539800],
      700: [501500, 522500, 539100, 563000, 575000, 586200],
    },
  },
]
/** saumastofa/markisur/hlidarmarkisa: "dæmi um stærðir og verð" */
export const HLIDAR = {
  nafn: 'Hliðarmarkísa',
  texti:
    'Hliðarsóltjöld gegn íslenskum vindi, kjörið fyrir þá sem vilja loka af svalir og palla. Þær eru framleiddar frá 90 til 210 cm á hæð og allt að 380 cm á lengd.',
  haedir: [170, 210],
  lengdir: [200, 300, 350],
  verd: { 170: [115900, 123900, 131900], 210: [137900, 145900, 151900] } as Record<number, number[]>,
}
/** saumastofa/markisur/bogaskyggni: dýpt 70 cm */
export const BOGASKYGGNI = {
  nafn: 'Bogaskyggni',
  texti: 'Bogaskyggnin standa venjulega 70 cm út en hægt er að fá þau dýpri. Breidd þeirra fer eftir þörfum hvers og eins.',
  dypt: 70,
  breiddir: [150, 200, 250, 300, 350, 400, 450, 500],
  verd: [159900, 164500, 171500, 178800, 185200, 192000, 199700, 207900],
}
export const MARKISA_LOFORD = [
  'Aðeins þriggja til fimm daga afgreiðslufrestur.',
  'Góð auglýsing, mögulegt að prenta á skyggnin.',
  'Persónuleg uppsetningarþjónusta hvar sem er á landinu.',
  'Glæsilegt úrval af mismunandi litum.',
]

/* ── the workshop: what they sew, with the sentence their page uses ─────── */

export const SAUMAD = [
  { titill: 'Yfirbreiðslur', texti: 'Saumað er yfir tjaldvagna, hestakerrur, heita potta, sandkassa, grill og fleira. Staðlaðar stærðir eru til á lager.', photo: PHOTO.bat2 },
  { titill: 'Skilrúm og skemmur', texti: 'Stórar vöruskemmur eru eitt af sérsviðum verkstæðis Seglagerðarinnar. Þær standast fyllilega íslenska veðráttu.', photo: PHOTO.skilrum },
  { titill: 'Skjól og sóltjöld', texti: 'Við framleiðum skjóltjöld á svalahandrið í öllum stærðum og gerðum úr sterkum acrylic dúk.', photo: PHOTO.svalir2 },
  { titill: 'Fortjöld og svefntjöld', texti: 'Fortjöldin eru sérhönnuð fyrir amerísku fellihýsin og framleidd af Seglagerðinni Ægi.', photo: PHOTO.fortjald },
  { titill: 'Töskur og pokar', texti: 'Algengt er að einstaklingar eða fyrirtæki láti sérsauma töskur við sérstök tilefni, til dæmis fyrir ráðstefnur.', photo: PHOTO.taska },
  { titill: 'Auglýsingaborðar', texti: 'Við sjáum um allt sem snýr að verkinu, látum prenta auglýsinguna, saumum, kósum og setjum upp sé þess óskað.', photo: PHOTO.sagaMynd },
  { titill: 'Einangrunarmottur', texti: 'Við útbúum bæði hita- og kælieinangrunarmottur, notaðar í frystiklefum, á togurum og í verksmiðjum.', photo: PHOTO.net2 },
  { titill: 'Leikskóladýnur', texti: 'Sérhannaðar leikskóladýnur, samanbrjótanlegar og léttar. Þær eru fáanlegar í vínrauðu, grænu og gráu.', photo: PHOTO.kross },
] as const
export const SAUMAD_VERD = [
  { vara: 'Rekakkeri fyrir báta undir 6 tonnum', verd: '71.200 kr. m.vsk.' },
  { vara: 'Rekakkeri fyrir báta 6 tonn og yfir', verd: '83.400 kr. m.vsk.' },
  { vara: 'Stór vatnsheld taska, 150 lítrar', verd: '29.900 kr.' },
  { vara: 'Minni vatnsheld taska, 50 lítrar', verd: '22.900 kr.' },
  { vara: 'Bensínbrúsataska, 20 lítra / 25 lítra', verd: '8.900 kr. / 9.900 kr.' },
  { vara: 'Multi Tarp dúkar, margar stærðir', verd: '350 kr. á fermetra' },
]
export const SAUMA_FLOKKAR = [
  'Yfirbreiðsla',
  'Skilrúm eða skjólveggur',
  'Segl eða tjald',
  'Taska eða poki',
  'Auglýsingaborði',
  'Viðgerð',
  'Annað',
]
export const BIDSKYLI_STADIR = ['Reykjanesbær', 'Hveragerði', 'Akureyri', 'Kópavogur', 'Árborg', 'Fjarðabyggð']
export const BIDSKYLI_TEXTI =
  'Seglagerðin annast innflutning á vönduðum og glæsilegum strætóskýlum og reykingarskýlum. Þetta er ódýr og hentug lausn fyrir bæjarfélög og veitingastaði sem hyggjast endurnýja sín skýli eða vilja bæta við.'

/* ── before / after: two pairs with dates their own files carry ─────────── */
export const FYRIR_EFTIR = [
  { id: 'pottur', titill: 'Heitur pottur', dagsetning: '19. og 22. júní 2013', fyrir: PHOTO.potturFyrir, eftir: PHOTO.potturEftir },
  { id: 'laug', titill: 'Sporöskjulaga sundlaug', dagsetning: '16. og 17. maí 2015', fyrir: PHOTO.laugFyrir, eftir: PHOTO.laugEftir },
] as const

/* ── history: their own saga page, in order ─────────────────────────────── */
export const SAGA = [
  { ar: '1913', texti: 'Guðmundur Einarsson sjómaður stofnar Seglagerðina og rekur hana fyrstu árin í Duus-húsi við Ægisgötu.' },
  { ar: '1951', texti: 'Óli Sigurjón Barðdal kaupir sig inn í fyrirtækið. Það hefur verið í eigu sömu fjölskyldunnar síðan.' },
  { ar: '1959', texti: 'Hafnarstjórinn í Reykjavík leigir fyrirtækinu lóð á Grandabót, sem í dag er Grandagarður 13.' },
  { ar: '1965', texti: 'Framleiðsla á tjöldum hefst og nýtur skjótt mikilla vinsælda meðal landsmanna.' },
  { ar: '1975', texti: 'Fyrirtækið flytur í Örfirisey, að Eyjarslóð 7.' },
  { ar: '2005', texti: 'Flutt í stærra húsnæði við hliðina, að Eyjarslóð 5.' },
  { ar: 'Í dag', texti: 'Seglagerðin er til húsa í Tónahvarfi 5 í Kópavogi.' },
] as const
export const SAGA_FLEIRA = [
  'Seglagerðin hefur einnig verið leiðandi í hönnun á tjöldum og naut við það liðsinnis Einars Þ. Óskarssonar tjaldhönnuðar. Tjöld hafa verið sett upp við hátíðarhöld í Reykjavík, á Þingvöllum og í Herjólfsdal vegna þjóðhátíðarinnar í Eyjum.',
  'Seglagerðin fékk það verkefni frá Félagi Húmanista á Íslandi að búa til neyðartjöld til að hýsa 40 munaðarlaus börn á Haítí.',
]

export const PHOTO_CREDIT =
  'Ljósmyndir eru af vef Seglagerðarinnar Ægis (seglagerdin.is), sóttar í október 2026. Verð eru verð Seglagerðarinnar eins og þau eru birt á vefnum þann dag og geta breyst.'

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Seglagerðin Ægir ehf.',
  url: 'https://www.seglagerdin.is',
  email: CONTACT.netfang,
  telephone: '+354 511 2200',
  taxID: CONTACT.kennitala,
  foundingDate: '1913',
  founder: { '@type': 'Person', name: 'Guðmundur Einarsson' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT.heimilisfang,
    postalCode: '203',
    addressLocality: 'Kópavogur',
    addressCountry: 'IS',
  },
  areaServed: 'Ísland',
  openingHours: 'Mo-Fr 08:00-17:00',
  description: TEXTI.inngangur,
}

export const companyEntry: PreviewCompany = {
  slug: 'aegir',
  route: '/preview/aegir',
  name: 'Seglagerðin Ægir ehf.',
  sector: 'Seglasaumur, tjaldaleiga og markísur',
  location: 'Kópavogur',
  region: 'Höfuðborgarsvæðið',
  established: 'Stofnuð 1913, í eigu sömu fjölskyldu frá 1951',
  currentUrl: 'https://www.seglagerdin.is',
  ownerEmail: 'seglagerdin@seglagerdin.is',
  concept: 'Hönnum og saumum það sem þér hentar',
  conceptTagline:
    'Tjald, markísa, sundlaugardúkur eða sérsaumur: hver beiðni fer í gegnum vefinn með dagsetningu, stað og stærð, svo fyrsta svarið geti verið tilboð en ekki spurningalisti.',
  accent: '#0070B0',
  dark: false,
  status: 'Concept ready',
  thumb: `${BASE}aegir/einstok-960.jpg`,
  ownPhotography: true,
  photoCredit: PHOTO_CREDIT,
  audit: {
    strengths: [
      'Stofnuð 1913 og í eigu sömu fjölskyldu frá 1951, ein af elstu starfandi fyrirtækjum landsins',
      'Verð á markísum, partýtjöldum, borðum, bekkjum, gólfi og hitara eru þegar birt á vefnum',
      'Hundruð eigin ljósmynda af verkum á nafngreindum stöðum, af tjöldum og sundlaugum',
    ],
    weaknesses: [
      'Hafðu samband síðan segir „Þessi síða er í vinnslu“ og sýnir óunninn kóða fyrir eyðublað í stað þess að vera með eyðublað',
      'Reglur um leigubúnað segja leigutaka að skila á Eyjarslóð 7 en vefurinn er annars með Tónahvarf 5 sem heimilisfang',
      'Forsíðan hefst á rafmagnshiturum og segir „111 ára reynsla“, hún er því ekki uppfærð í takt við aldur fyrirtækisins, og engin leið er að biðja um tjald, markísu eða sérsaum á vefnum',
      'Forsíðan er um átta sekúndur að birtast í síma á hægri tengingu (3,2 MB, 1,9 MB af JavaScript) og aðeins 5 af 58 síðum vefsins eru með lýsingu fyrir leitarvélar, ekki forsíðan eða tjaldaleigan, svo Google sýnir fótinn í staðinn',
      'Já.is skráir tjaldaleiguna enn á Eyjarslóð 5 og gamla verðlistinn frá 2021 kemur upp í leit með verð sem stangast á við vörusíðurnar',
    ],
    opportunities: [
      'Tjaldaleiga: viðburðurinn settur saman úr eigin verðum Seglagerðarinnar og sendur sem skýr beiðni',
      'Markísur: verð eftir breidd og útdraganlegri lengd eins og þau standa í töflum Seglagerðarinnar',
      'Hver nafngreind markísa eða skyggni fær sína eigin síðu með myndum',
    ],
  },
  positioning:
    'Seglagerðin Ægir hannar og saumar markísur, skyggni, yfirbreiðslur og sundlaugardúka og leigir út veislutjöld. Frumgerðin byggir á eigin verkum þeirra og eigin verðum: nafngreind verk á eigin síðum, fyrir og eftir myndir af dúklögn, og beiðnir sem berast tilbúnar til úrvinnslu.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Seglagerðina Ægi',
    body:
      'Sæll Björgvin,\n\nÉg heiti Sindri Már og starfa undir nafninu SNDR Studio, þar sem ég hanna og smíða nútímalegar, stílhreinar vefsíður, bókunarkerfi og netverslanir fyrir fyrirtæki víða um land.\n\nMarkmiðið er að búa til veflausnir sem endurspegla fyrirtækið, einfalda daglegan rekstur og spara tíma. Ég sé jafnframt um hýsingu, viðhald og reglulegar uppfærslur, svo vefurinn haldist hraður, öruggur og í takt við þær miklu tæknibreytingar sem eiga sér stað.\n\nÉg rakst á Seglagerðina Ægi þegar ég skoðaði vefinn ykkar, sérstaklega bogaskyggnin á Kaffibarnum og American Bar, tjöldin við Hörpu og dúklögnina í sundlaugum og pottum, og mér fannst magnað hvað fyrirtæki frá 1913 sinnir svona mörgu af mikilli kunnáttu. Umsagnirnar á Google eru sammála, 4,8 í einkunn.\n\nVefurinn gerir verkunum samt ekki alveg réttlæti. Hafðu samband síðan segir að hún sé í vinnslu og sýnir óunninn kóða þar sem eyðublaðið á að vera, leigureglurnar segja fólki að skila búnaðinum á Eyjarslóð 7 þótt þið séuð í Tónahvarfi, og forsíðan er nokkrar sekúndur að birtast í símanum á hægri tengingu. Ég velti því líka fyrir mér hversu oft þið þurfið að spyrja um dagsetningu og stað áður en tilboð er gefið, en þið vitið það betur en ég.\n\nÉg gerði því frumgerð að nýjum vef úr efni sem þið hafið sjálf birt, og hana má skoða hér hvenær sem er, líka í síma:\n\n[HLEKKUR Á FRUMGERÐ]\n\nÞar má setja saman veislu úr tjaldaleigunni ykkar, finna markísu eftir breidd og útdraganlegri lengd, bera saman fyrir og eftir myndir af dúklögn og senda beiðnina með dagsetningu og stað, svo fyrsta svarið geti verið tilboð. Í frumgerðinni opnast beiðnin sem tölvupóstur.\n\nÞessi frumgerð kostar ykkur ekki neitt og henni fylgir engin skuldbinding. Mig langar að sýna ykkur hana í stuttu símtali eða á fundi í Tónahvarfi, en ef ekki er það að sjálfsögðu allt í lagi.\n\nBestu kveðjur,\nSindri Már\n845-1758\nsndrstudio.is',
  },
}
