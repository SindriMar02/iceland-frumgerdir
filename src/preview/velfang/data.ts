import type { PreviewCompany } from '../company-types'
import { project } from './geo'

/*
 * Vélfang ehf. Every fact here was read on 09.10.2026 from velfang.is (every
 * page in its sitemap and the twelve newest posts), the stock list Vélfang
 * runs on velfang.velasolur.is (Rögg ehf.), Skatturinn's company register and
 * Nominatim. The fact check, with a source per line and the list of what could
 * not be verified: _docs/VELFANG-FACTCHECK-2026-10-09.md. Raw pages, photos and
 * the manifest: _docs/velfang-harvest-2026-10-09/.
 */

const BASE = import.meta.env.BASE_URL
export const A = (name: string) => `${BASE}velfang/${name}`
export const ROUTE = '/preview/velfang'

export type Photo = { src: string; srcSet: string; alt: string; w: number; h: number }
const photo = (name: string, widths: number[], w: number, h: number, alt: string): Photo => ({
  src: A(`${name}-${widths[widths.length - 1]}.webp`),
  srcSet: widths.map((x) => `${A(`${name}-${x}.webp`)} ${x}w`).join(', '),
  alt,
  w,
  h,
})

export const CONTACT = {
  legal: 'Vélfang ehf.',
  kt: '560909-1520',
  vsk: '102471',
  street: 'Gylfaflöt 32',
  town: '112 Reykjavík',
  phone: '580 8200',
  tel: '+3545808200',
  email: 'velfang@velfang.is',
  workshop: 'verk@velfang.is',
  parts: 'varahlutir@velfang.is',
  facebook: 'https://www.facebook.com/velfangehf/',
  slogan: 'Verkin tala',
  summary: 'Vélfang ehf. selur og þjónustar jafnt nýjar sem notaðar vélar og tæki fyrir landbúnað, vélaverktaka, golfvelli og sveitarfélög.',
}

/* Opening hours: only Gylfaflöt publishes them (velfang.is header). Minutes from midnight, d = JS weekday. */
type Span = { d: number[]; from: number; to: number }
export const HQ_HOURS = {
  label: [{ d: 'Mánudaga til fimmtudaga', t: '8:00-17:00' }, { d: 'Föstudaga', t: '8:00-16:00' }],
  spans: [{ d: [1, 2, 3, 4], from: 480, to: 1020 }, { d: [5], from: 480, to: 960 }] as Span[],
}
/* Iceland keeps UTC all year. */
export function openState(now = new Date()) {
  const d = now.getUTCDay()
  const m = now.getUTCHours() * 60 + now.getUTCMinutes()
  const today = HQ_HOURS.spans.find((s) => s.d.includes(d))
  const hhmm = (x: number) => `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`
  if (today && m >= today.from && m < today.to) return { open: true, text: `Opið til ${hhmm(today.to)}` }
  if (today && m < today.from) return { open: false, text: `Opnar kl. ${hhmm(today.from)}` }
  return { open: false, text: 'Lokað núna' }
}

/* ── Branches: Gylfaflöt (2006), Akureyri (2006, now Óseyri 8), Selfoss (May 2026) ── */
export type BranchKey = 'rvk' | 'ak' | 'sel'
export type Branch = {
  key: BranchKey; name: string; town: string; street: string; post: string; since: string; opened: string
  phone: string; tel: string; book: string; bookTel: string; email: string; lat: number; lon: number; x: number; y: number
  region: string; staff: number; hours?: typeof HQ_HOURS; note: string; img?: Photo
}
const br = (b: Omit<Branch, 'x' | 'y'>): Branch => ({ ...b, ...project(b.lat, b.lon) })
export const BRANCHES: Branch[] = [
  br({ key: 'rvk', name: 'Reykjavík', town: 'Reykjavík', street: 'Gylfaflöt 32', post: '112 Reykjavík', since: '2006', opened: 'Á Gylfaflöt 32 síðan í janúar 2006',
    phone: '580 8200', tel: '+3545808200', book: '580 8200', bookTel: '+3545808200', email: 'verk@velfang.is', lat: 64.144235, lon: -21.7995113,
    region: 'Höfuðborgarsvæðið', staff: 20, hours: HQ_HOURS,
    note: 'Höfuðstöðvar: sala, varahlutalager, skrifstofa og verkstæði. Verkstæðisbílar fara þaðan á staðinn.' }),
  br({ key: 'ak', name: 'Akureyri', town: 'Akureyri', street: 'Óseyri 8', post: '603 Akureyri', since: '2006', opened: 'Umboð og verkstæði á Akureyri síðan 2006',
    phone: '580 8221', tel: '+3545808221', book: '580 8222', bookTel: '+3545808222', email: 'haftor@velfang.is', lat: 65.6939831, lon: -18.1004838,
    region: 'Norðurland', staff: 6,
    note: 'Verkstæði og varahlutalager sérbúinn fyrir tækin sem eru í vinnu á Norðurlandi. Tímapantanir og varahlutir í síma 580 8222.' }),
  br({ key: 'sel', name: 'Selfoss', town: 'Selfoss', street: 'Gagnheiði 32', post: '800 Selfoss', since: '2026', opened: 'Nýtt þjónustuverkstæði, opnað í maí 2026',
    phone: '767 8403', tel: '+3547678403', book: '767 8403', bookTel: '+3547678403', email: 'jon@velfang.is', lat: 63.9292484, lon: -21.019448,
    region: 'Suðurland', staff: 2,
    note: 'Fullbúið þjónustuverkstæði fyrir reglubundið viðhald og flóknari viðgerðir á landbúnaðar- og vinnuvélum á Suðurlandi.' }),
]
export const branch = (k: BranchKey) => BRANCHES.find((b) => b.key === k)!

/* ── Brands: the 21 on the home page strip (20 logos) plus Strautmann (Sept 2025) ── */
export type Field = 'landbunadur' | 'vinnuvelar' | 'sveitarfelog'
export const FIELDS: { key: Field; label: string; line: string }[] = [
  { key: 'landbunadur', label: 'Landbúnaður', line: 'Dráttarvélar, heyvinnu- og jarðvinnutæki, vagnar, haugsugur og liðléttingar.' },
  { key: 'vinnuvelar', label: 'Vinnuvélar', line: 'JCB: traktorsgröfur, beltagröfur, hjólagröfur, minigröfur, skotbómulyftarar.' },
  { key: 'sveitarfelog', label: 'Sveitarfélög og golfvellir', line: 'Sérútbúnar Fendt dráttarvélar og Shibaura sláttu- og fjölnotatæki.' },
]
export type Brand = { key: string; name: string; fields: Field[]; logo: string; site: string; siteLabel?: string; since?: string; line?: string; text?: string[]; img?: Photo; src?: string }
export const BRANDS: Brand[] = [
  { key: 'jcb', name: 'JCB', fields: ['vinnuvelar'], logo: 'jcblogo.gif', site: 'https://www.jcb.com', since: 'haust 2009', src: 'https://velfang.is/jcb-vinnuvelar/',
    line: 'Traktorsgröfur, beltagröfur, hjólagröfur, minigröfur, skotbómulyftarar og Fastrac',
    text: [
      'Vélfang tók við umboði fyrir JCB vinnuvélar á haustmánuðum 2009. JCB er einn stærsti framleiðandi vinnuvéla í heimi, með höfuðstöðvar í Bretlandi.',
      'Traktorsgröfur frá 3CX Compact að 5CXS CM. Beltagröfur 12-40 tonn, hjólagröfur 12-23 tonn og minigröfur 1-11 tonn, þar á meðal 19C-1 E-TEC rafmagnsgrafa. Skotbómulyftarar og Fastrac dráttarvélar.',
      'JCB LiveLink fylgir flestum JCB vélum yfir 5 tonnum sem framleiddar eru eftir 2015.',
    ] },
  { key: 'fendt', name: 'Fendt', fields: ['landbunadur', 'sveitarfelog'], logo: 'fendt.jpg', site: 'https://www.fendt.com', src: 'https://velfang.is/fendt-landbunadur/',
    line: 'Dráttarvélar með Vario stiglausri skiptingu',
    text: [
      'Vario skiptingin var kynnt árið 1996 og síðan 2009 hafa allar Fendt dráttarvélar verið með henni.',
      'Fendt 200 Vario V/F/P, 70-110 hö, fæst sérútbúin fyrir sveitarfélög frá 50 upp í 230 hö, meðal annars í snjóhreinsun og slátt.',
      'Í nóvember 2025 bauð Fendt öllu starfsfólki Vélfangs í verksmiðjurnar í Marktoberdorf vegna góðrar frammistöðu.',
    ] },
  { key: 'claas', name: 'CLAAS', fields: ['landbunadur'], logo: 'claas-logo.jpg', site: 'https://www.claas.com', src: 'https://velfang.is/claas/',
    line: 'Dráttarvélar frá Elios að Xerion, rúlluvélar, múgavélar, sjálfhleðsluvagnar',
    text: [
      'CLAAS framleiðir dráttarvélar frá 70 hestafla Elios upp í Xerion, auk rúlluvéla, sjálfhleðsluvagna, stórbaggavéla og annarra heyvinnutækja.',
      'Nýjasta línan er AXION 8 CMATIC, allt að 313 hö, sem tekur við af AXION 800.',
    ] },
  { key: 'kuhn', name: 'Kuhn', fields: ['landbunadur'], logo: 'kuhn.png', site: 'https://www.kuhn.com', src: 'https://velfang.is/kuhn/',
    line: 'Sláttuvélar, heytætlur, jarðvinnslu- og fóðurtæki',
    text: [
      'Kuhn diskasláttuvélar fást frá 1,2 m upp í 8,8 m vinnslubreidd. Heytætlur í öllum stærðum, jarðtætarar og aflherfi, sláttusaxarar og heilfóðurvagnar.',
      'Allar notendahandbækur frá Kuhn eru á íslensku. Áramótatilboð Kuhn og Vélfangs er gefið út í desember ár hvert.',
    ] },
  { key: 'kverneland', name: 'Kverneland', fields: ['landbunadur'], logo: 'kvernelogo.jpg', site: 'https://www.kverneland.com', src: 'https://velfang.is/kverneland-jardhvinnutaeki/',
    line: 'Plógar, herfi, valtarar og áburðardreifarar',
    text: ['Kverneland var stofnað árið 1879 í Noregi. Kverneland plógarnir hafa um árabil verið mest seldu plógarnir á Íslandi.'] },
  { key: 'strautmann', name: 'Strautmann', fields: ['landbunadur'], logo: '', site: 'https://www.strautmann.com', since: 'september 2025', src: 'https://velfang.is/velfang-ehf-tekur-vid-umbodi-fyrir-strautmann-gmbh-a-islandi/',
    line: 'Sjálfhleðsluvagnar, taðdreifarar, fóðurvagnar og flutningavagnar',
    text: [
      'Vélfang tók við umboði fyrir Strautmann GmbH í september 2025. Strautmann hefur starfað í meira en 90 ár.',
      'Sjálfhleðsluvagnar í Magnon, Zelon og Giga-Vitesse línunum, taðdreifarar, fóðurvagnar og blandarar 4-45 m³, Gigant og SMK flutningavagnar og blokkskerar.',
    ] },
  { key: 'schaffer', name: 'Schäffer', fields: ['landbunadur'], logo: 'Schaffer-Logo.jpg', site: 'http://www.schaeffer.de', since: 'sumar 2020', src: 'https://velfang.is/landbunadur/',
    line: 'Liðléttingar og hjólaskóflur',
    text: ['Schäffer var stofnað árið 1956. Vélfang varð umboðsaðili Schäffer á Íslandi um mitt sumar 2020.'] },
  { key: 'slurrykat', name: 'SlurryKat', fields: ['landbunadur'], logo: 'SlurryKat-Logo.jpg', site: 'https://www.slurrykat.com', since: '2023', src: 'https://velfang.is/landbunadur/',
    line: 'Haugsugur, naflastrengskerfi, brunndælur og vagnar',
    text: ['SlurryKat er mest áberandi í haugsugum og naflastrengskerfum og smíðar líka brunndælur, skrúfur fyrir skítalón, rúlluvagna og vélavagna. Vélfang varð umboðsaðili árið 2023.'] },
  { key: 'pichon', name: 'Pichon', fields: ['landbunadur'], logo: 'logo-pichon-n-240.png', site: 'https://www.pichonindustries.fr/en/', since: 'mars 2022', src: 'https://velfang.is/velfang-tekur-vid-umbodi-fyrir-pichon-a-islandi/',
    line: 'Haughrærur og haugtæki' },
  { key: 'krampe', name: 'Krampe', fields: ['landbunadur'], logo: 'krampe_logo.gif', site: 'http://www.krampe.de/', src: 'https://velfang.is/landbunadur/',
    line: 'Vagnar af öllum toga',
    text: ['Þýskt fyrirtæki rétt norðan við Dortmund sem hefur smíðað vagna síðan 1981 og sníður þá að þörfum hvers kaupanda.'] },
  { key: 'redrock', name: 'Redrock', fields: ['landbunadur'], logo: 'redrock_logo.jpg', site: 'http://www.redrockmachinery.com/', src: 'https://velfang.is/landbunadur/',
    line: 'Vagnar og haugsugur', text: ['Redrock Machinery var stofnað á Norður-Írlandi. Helstu vörurnar eru vagnar af ýmsum toga og haugsugur.'] },
  { key: 'underhaug', name: 'Underhaug', fields: ['landbunadur'], logo: 'Underhaug-logo.jpg', site: 'https://underhaug.no', src: 'https://velfang.is/underhaug-as/',
    line: 'Rúllu- og stórbaggagreipar', text: ['Underhaug AS var stofnað í Nærbø í Noregi árið 1987 og framleiðir aðallega fyrir umboðsmenn Kverneland um allan heim.'] },
  { key: 'shibaura', name: 'Shibaura', fields: ['sveitarfelog'], logo: 'shibaura_logo.jpg', site: 'http://www.shibaura.com/', src: 'https://velfang.is/shibaura/',
    line: 'Smátraktorar, sláttuvélar og fjölnotatæki',
    text: ['Shibaura var stofnað árið 1950 af Toshiba og IHI. Smátraktorar, garðtraktorar, framsláttuvélar og fjölnotatæki, sópar, snjóplógar og golfvallarsláttuvélar.'] },
  { key: 'steinbauer', name: 'Steinbauer', fields: [], logo: 'steinbauer.jpg', site: 'http://www.steinbauer.cc/', line: 'Aflaukar' },
  { key: 'mcconnel', name: 'McConnel', fields: [], logo: 'mcconnel.jpg', site: 'http://www.mcconnel.com/' },
  { key: 'tume', name: 'Tume-Agri', fields: [], logo: 'tume-logo.jpg', site: 'http://www.tumeagri.fi' },
  { key: 'samson', name: 'Samson Agro', fields: [], logo: 'samsonlogo.jpg', site: 'https://samson-agro.com/' },
  { key: 'tanco', name: 'Tanco Autowrap', fields: [], logo: 'tanco.jpg', site: 'http://www.tanco-autowrap.com' },
  { key: 'bvl', name: 'BvL', fields: [], logo: 'bvl-group.jpg', site: 'http://www.bvl-group.de/' },
  { key: 'parkland', name: 'ParkLand', fields: [], logo: 'parkland-logo.jpg', site: 'http://www.parkland.dk/' },
  { key: 'globus', name: 'Globus', fields: [], logo: 'Globus-logo_web.jpg', site: 'https://herdeindustrier.no', siteLabel: 'Herde Industrier (framleiðandi Globus)' },
]
export const brandByKey = (k: string) => BRANDS.find((b) => b.key === k)

/* ── Stock: a sample of twelve from Vélfang's list on velfang.velasolur.is, read 09.10.2026 ── */
export type Cat = 'Dráttarvél' | 'Skotbómulyftari' | 'Hjólagrafa' | 'Heyvinnutæki' | 'Jarðvinnutæki' | 'Haugtæki'
export const CATS: Cat[] = ['Dráttarvél', 'Skotbómulyftari', 'Hjólagrafa', 'Heyvinnutæki', 'Jarðvinnutæki', 'Haugtæki']
export type Machine = {
  id: string; brand: string; brandKey: string; model: string; cat: Cat; cond: 'ny' | 'notud'; field: Field
  price: number; priceNote?: string; year?: string; hours?: number; unit?: string
  engine?: string; weight?: string; gear?: string; drive?: string; fuel?: string
  region: BranchKey; listed: string; updated: string; head: string; note?: string; extras?: string[]
  img: Photo; gallery: Photo[]
}
const mp = (id: string, n: number, alt: string, model: string): { img: Photo; gallery: Photo[] } => ({
  img: photo(`m-${id}-0`, [640, 1280], 1280, 1024, alt),
  gallery: Array.from({ length: n - 1 }, (_, i) => photo(`m-${id}-${i + 1}`, [640, 1280], 1280, 1024, `${model}, mynd ${i + 2} af ${n} úr söluskrá Vélfangs`)),
})
export const MACHINES: Machine[] = [
  { id: '274097', brand: 'Fendt', brandKey: 'fendt', model: '728 Profi', cat: 'Dráttarvél', cond: 'notud', field: 'landbunadur', price: 34_500_000,
    year: '6/2024', hours: 2553, unit: 'klst.', engine: '6 strokka dísel, 7.527 cc, 300 hö', weight: '9.380 kg', gear: 'Sjálfskipting', fuel: 'Dísel',
    region: 'rvk', listed: '22.9.2026', updated: '22.9.2026', head: 'Nokian Soil King dekk ársgömul',
    note: '60 km/klst. Tvívirkt afturbeisli, Comfort frambeisli tvívirkt, 220 l vökvadæla, úrhleypibúnaður í nöfum, Comfort húsfjöðrun, LED ljós, hiti, kæling og nudd í sæti, rafstýrðir speglar, myndavélar að framan og aftan, vökvayfirtengi, þýskur krókur, klofbiti og krókur. 600/70R30 að framan og 710/70R42 að aftan. Afhendist nýsmurður og yfirfarinn af umboði. Hægt að kaupa með GPS og RTK leiðréttingarbúnaði frá FJ Dynamics.',
    extras: ['Loftkæling', 'LED aðalljós', 'Rafdrifið sæti ökumanns', 'Bluetooth'],
    ...mp('274097', 4, 'Svört Fendt 728 Profi dráttarvél á blautu plani við atvinnuhús', 'Fendt 728 Profi') },
  { id: '992887', brand: 'CLAAS', brandKey: 'claas', model: 'Xerion 4000', cat: 'Dráttarvél', cond: 'notud', field: 'landbunadur', price: 23_000_000,
    year: '5/2016', hours: 4000, unit: 'klst.', engine: 'Dísel, 10.700 cc, 420 hö, túrbína', weight: '17.000 kg', gear: 'Sjálfskipting, loftpúðafjöðrun', fuel: 'Dísel',
    region: 'sel', listed: '15.5.2026', updated: '15.5.2026', head: 'Mjög flott vél', note: 'Tveir gangar af dekkjum, 900 og 710 dekk.',
    extras: ['Driflæsingar', 'Ísskápur', 'Bluetooth', 'USB tengi'],
    ...mp('992887', 4, 'Svartur CLAAS Xerion 4000 á malarplani undir lauflausum trjám', 'CLAAS Xerion 4000') },
  { id: '728834', brand: 'Fendt', brandKey: 'fendt', model: '516 Profi Plus', cat: 'Dráttarvél', cond: 'notud', field: 'landbunadur', price: 17_500_000,
    year: '2020', hours: 5500, unit: 'klst.', region: 'ak', listed: '21.9.2026', updated: '24.9.2026', head: 'Fendt 516 Profi Plus árgerð 2020',
    note: 'Notkun 5.500 vinnustundir. Ámoksturstæki, vigt í gálga, frambúnaður og aflúrtak að framan, GPS.',
    ...mp('728834', 4, 'Græn Fendt 516 Profi Plus með ámoksturstækjum inni á verkstæði', 'Fendt 516 Profi Plus') },
  { id: '367541', brand: 'JCB', brandKey: 'jcb', model: '525-60 E-TECH', cat: 'Skotbómulyftari', cond: 'ny', field: 'vinnuvelar', price: 11_900_000,
    year: '5/2023', hours: 8, unit: 'klst.', engine: 'Rafmagn', weight: '5.800 kg', drive: 'Fjórhjóladrif', fuel: 'Rafmagn',
    region: 'rvk', listed: '26.3.2024', updated: '3.2.2026', head: 'Gafflar, aukavökvaúrtak', extras: ['LED aðalljós'],
    ...mp('367541', 3, 'Gulur JCB 525-60 E-TECH rafmagnsskotbómulyftari fyrir framan hús Vélfangs', 'JCB 525-60 E-TECH') },
  { id: '413023', brand: 'JCB', brandKey: 'jcb', model: '525-60 AGP', cat: 'Skotbómulyftari', cond: 'notud', field: 'vinnuvelar', price: 7_800_000,
    year: '1/2023', hours: 1292, unit: 'klst.', engine: '4 strokka dísel, 2.500 cc, 75 hö', weight: '6.000 kg', gear: 'Sjálfskipting', drive: 'Fjórhjóladrif', fuel: 'Dísel',
    region: 'ak', listed: '27.8.2026', updated: '1.9.2026', head: 'JCB 525-60 AGP', note: 'Flott eintak. Lyftigeta 2.500 kg, 1.000 kg í 3 m.',
    ...mp('413023', 4, 'Gulur JCB 525-60 AGP skotbómulyftari með göfflum á plani', 'JCB 525-60 AGP') },
  { id: '422839', brand: 'JCB', brandKey: 'jcb', model: 'JS145W', cat: 'Hjólagrafa', cond: 'notud', field: 'vinnuvelar', price: 7_500_000,
    year: '4/2016', hours: 12900, unit: 'klst.', engine: '4 strokka dísel, 4.800 cc, 130 hö', weight: '16.000 kg', gear: 'Sjálfskipting', fuel: 'Dísel',
    region: 'rvk', listed: '30.3.2026', updated: '25.9.2026', head: 'Flott verð', note: 'JS145W hjólagrafa. Smurkerfi, Engcon rótortilt. Nýjar fóðringar í dipper enda. 1.600 mm skófla fylgir.',
    ...mp('422839', 4, 'Gul JCB JS145W hjólagrafa í snjó', 'JCB JS145W') },
  { id: '911820', brand: 'JCB', brandKey: 'jcb', model: '560-80 AGS', cat: 'Skotbómulyftari', cond: 'notud', field: 'vinnuvelar', price: 6_500_000,
    year: '4/2018', hours: 2600, unit: 'klst.', engine: '4 strokka dísel, 4.400 cc, 130 hö', weight: '12.000 kg', gear: 'Sjálfskipting, 6 gírar', fuel: 'Dísel',
    region: 'rvk', listed: '11.9.2026', updated: '25.9.2026', head: 'JCB 560-80 AGS', note: 'Með vökvalyftikrók, 6.000 kg lyftigeta, lítið keyrður. Gafflar fylgja.',
    ...mp('911820', 4, 'Gulur JCB 560-80 AGS skotbómulyftari með göfflum á plani', 'JCB 560-80 AGS') },
  { id: '845629', brand: 'CLAAS', brandKey: 'claas', model: 'Liner 3600', cat: 'Heyvinnutæki', cond: 'notud', field: 'landbunadur', price: 4_500_000,
    year: '2016', region: 'rvk', listed: '17.8.2026', updated: '17.8.2026', head: 'Vinnslubreidd frá 9,9 m til 12,5 m',
    ...mp('845629', 4, 'Græn CLAAS Liner 3600 múgavél á grasflöt', 'CLAAS Liner 3600') },
  { id: '487848', brand: 'Kuhn', brandKey: 'kuhn', model: 'GF 13012', cat: 'Heyvinnutæki', cond: 'notud', field: 'landbunadur', price: 3_200_000,
    year: '2019', region: 'rvk', listed: '17.8.2026', updated: '17.8.2026', head: 'Ekki mikið notuð vél. 13 metra vinnslubreidd',
    ...mp('487848', 4, 'Rauð Kuhn GF 13012 heytætla á grasi', 'Kuhn GF 13012') },
  { id: '267861', brand: 'Kverneland', brandKey: 'kverneland', model: 'Actiroll 630 Classic', cat: 'Jarðvinnutæki', cond: 'ny', field: 'landbunadur', price: 2_790_000,
    region: 'ak', listed: '30.9.2026', updated: '1.10.2026', head: 'Kverneland Actiroll 630 Classic valtari', weight: '3.720 kg',
    note: '550 mm cambridge. Þyngd 3.720 kg.',
    ...mp('267861', 1, 'Rauður Kverneland Actiroll 630 valtari á malarplani', 'Kverneland Actiroll 630') },
  { id: '918412', brand: 'Kuhn', brandKey: 'kuhn', model: 'EL 92-180', cat: 'Jarðvinnutæki', cond: 'ny', field: 'landbunadur', price: 1_200_000,
    region: 'ak', listed: '6.10.2026', updated: '6.10.2026', head: 'Kuhn EL 92-180 hnífatætari', weight: '525 kg',
    note: 'Eftirársvél. Vinnslubreidd 1,8 m. Þyngd 525 kg. Lágmarksaflþörf 51 hö.',
    ...mp('918412', 1, 'Appelsínugulur Kuhn EL 92-180 hnífatætari á malbiki', 'Kuhn EL 92-180') },
  { id: '938781', brand: 'Pichon', brandKey: 'pichon', model: 'B-MIX 50', cat: 'Haugtæki', cond: 'ny', field: 'landbunadur', price: 1_150_000,
    priceNote: 'Með 600/700 mm skrúfu 1.250.000 kr. án vsk.', region: 'rvk', listed: '1.10.2026', updated: '1.10.2026', head: 'Pichon B-MIX 50 haughræra',
    note: 'Lengd 5 m. Verð með 600/600 mm skrúfum. Sterkbyggðar, smurbanki.',
    ...mp('938781', 2, 'Galvaníseruð Pichon B-MIX 50 haughræra á plani', 'Pichon B-MIX 50') },
]
export const machineById = (id: string) => MACHINES.find((x) => x.id === id)
export const machineName = (x: Pick<Machine, 'brand' | 'model'>) => `${x.brand} ${x.model}`
export const VAT = 0.24
export const kr = (n: number) => `${n.toLocaleString('de-DE')} kr.`
export const STOCK_NOTE = 'Úrtak: tólf vélar af söluskrá Vélfangs eins og hún stóð 9. október 2026. Verð án vsk. eins og Vélfang birtir þau.'

/* ── Photography: Vélfang's own, from velfang.is ── */
export const IMG = {
  hero: photo('hero', [800, 1600, 2400], 2400, 1800, 'Þrjár JCB vinnuvélar með ljósin kveikt í snjó fyrir framan hús Vélfangs á Gylfaflöt'),
  selfoss: photo('selfoss', [800, 1400], 1400, 1876, 'Nýja þjónustuverkstæði Vélfangs á Gagnheiði 32 á Selfossi'),
  handover: photo('handover', [800, 1600], 1600, 1200, 'Fendt Vario 720 afhent fjölskyldunni í Hrauki í Þykkvabæ fyrir framan Vélfang, apríl 2024'),
  handover2: photo('handover2', [800, 1600], 1600, 1200, 'Fendt 314 Vario með ámoksturstækjum afhent í Þykkvabæ, júní 2023'),
  magnon: photo('magnon', [800, 1600, 2400], 2400, 1600, 'Græn Fendt dráttarvél dregur rauðan og grænan Strautmann Magnon sjálfhleðsluvagn um tún'),
  magnon2: photo('magnon2', [800, 1600], 1600, 1200, 'Strautmann Magnon sjálfhleðsluvagn á slegnu túni'),
  axion: photo('axion', [800, 1500], 1500, 1000, 'CLAAS AXION 8 CMATIC dráttarvél með herfi á akri'),
  axionCab: photo('axion-cab', [800, 1500], 1500, 1000, 'Útsýni úr ökumannshúsi CLAAS AXION 8 CMATIC yfir akur'),
  kuhn: photo('kuhn', [800, 1600], 1600, 1067, 'Kuhn heytætla í vinnu á grænu túni'),
  snow: photo('snow', [800, 1600], 1600, 1067, 'Snjóblásari á dráttarvél kastar snjó hátt upp á fjallvegi'),
  schaffer: photo('schaffer', [800, 1600], 1600, 1076, 'Rauður Schäffer liðléttingur lyftir heyrúllu í hlöðu'),
  jcbCity: photo('jcb-city', [800, 1600], 1600, 1067, 'JCB vél við byggingarframkvæmdir í borg í ljósaskiptunum'),
  spread: photo('strautmann-spread', [800, 1600], 1600, 1060, 'Strautmann taðdreifari aftan í dráttarvél á akri'),
}

/* ── Staff: /starfsfolk/ read 09.10.2026, 28 people, emails exactly as printed ── */
export type Dept = 'sala' | 'skrifstofa' | 'varahlutir' | 'thjonusta'
export type Person = { key: string; name: string; role: string; dept: Dept; branch: BranchKey; phone?: string; email?: string }
export const DEPTS: { key: Dept; label: string }[] = [
  { key: 'sala', label: 'Sala' }, { key: 'thjonusta', label: 'Þjónusta og verkstæði' }, { key: 'varahlutir', label: 'Varahlutir' }, { key: 'skrifstofa', label: 'Skrifstofa' },
]
export const STAFF: Person[] = [
  { key: 'eyjolfur', name: 'Eyjólfur Pétur Pálmason', role: 'Forstjóri', dept: 'skrifstofa', branch: 'rvk', phone: '580 8201', email: 'eyjolfur@velfang.is' },
  { key: 'thorarinn', name: 'Þórarinn Sigvaldason', role: 'Sölumaður', dept: 'sala', branch: 'rvk', phone: '580 8208', email: 'toti@velfang.is' },
  { key: 'david', name: 'Davíð Örn Ingvason', role: 'Sölumaður', dept: 'sala', branch: 'rvk', phone: '580 8204', email: 'david@velfang.is' },
  { key: 'gunnsteinn', name: 'Gunnsteinn Lárusson', role: 'Sölumaður', dept: 'sala', branch: 'rvk', phone: '580 8229', email: 'Gunnsteinn@velfang.is' },
  { key: 'hlynur', name: 'Hlynur Haraldsson', role: 'Sölumaður', dept: 'sala', branch: 'rvk', phone: '580 8227', email: 'hlynur@velfang.is' },
  { key: 'inga', name: 'Inga Lilja Lárusdóttir', role: 'Fjármálastjóri', dept: 'skrifstofa', branch: 'rvk', phone: '580 8202', email: 'inga@velfang.is' },
  { key: 'margret', name: 'Margrét Friðriksdóttir', role: 'Bókhald', dept: 'skrifstofa', branch: 'rvk', phone: '580 8213', email: 'magga@velfang.is' },
  { key: 'ylfa', name: 'Ýlfa Proppé Einarsdóttir', role: 'Bókhald', dept: 'skrifstofa', branch: 'rvk', phone: '580 8228', email: 'ylfa@velfang.is' },
  { key: 'kristjan', name: 'Kristján Ragnarsson', role: 'Yfirmaður varahluta', dept: 'varahlutir', branch: 'rvk', phone: '580 8205', email: 'kristjan@velfang.is' },
  { key: 'bjorgvinst', name: 'Björgvin Steinar Valdemarsson', role: 'Varahlutir', dept: 'varahlutir', branch: 'rvk', phone: '580 8206', email: 'bjorgvinst@velfang.is' },
  { key: 'bjorgvin', name: 'Björgvin Björgvinsson', role: 'Lagerstjóri', dept: 'varahlutir', branch: 'rvk', phone: '580 8200', email: 'bjorgvin@velfang.is' },
  { key: 'arnarfr', name: 'Arnar Freyr Björgvinsson', role: 'Varahlutir', dept: 'varahlutir', branch: 'rvk', phone: '580 8219', email: 'arnarfr@velfang.is' },
  { key: 'paolo', name: 'Paolo Gratton', role: 'Rekstrarstjóri', dept: 'thjonusta', branch: 'rvk', phone: '580 8217', email: 'Paolo@velfang.is' },
  { key: 'gummi', name: 'Guðmundur Sigurðsson', role: 'Þjónustustjóri', dept: 'thjonusta', branch: 'rvk', phone: '580 8211', email: 'gummi@velfang.is' },
  { key: 'kristinn', name: 'Kristinn Páll Pálsson', role: 'Verkstjóri', dept: 'thjonusta', branch: 'rvk', phone: '580 8200', email: 'kristinn@velfang.is' },
  { key: 'povilas', name: 'Povilas Vaitkevicius', role: 'Verkstæði', dept: 'thjonusta', branch: 'rvk', phone: '580 8200' },
  { key: 'heimir', name: 'Heimir Smári Heimisson', role: 'Verkstæði', dept: 'thjonusta', branch: 'rvk', phone: '580 8200' },
  { key: 'arnarmar', name: 'Arnar Már Gunnarsson', role: 'Verkstæði', dept: 'thjonusta', branch: 'rvk', phone: '580 8200' },
  { key: 'birnir', name: 'Birnir Frosti Sigurðarson', role: 'Verkstæði', dept: 'thjonusta', branch: 'rvk', phone: '580 8200' },
  { key: 'rafal', name: 'Rafal Kempinski', role: 'Verkstæði', dept: 'thjonusta', branch: 'rvk', phone: '580 8200' },
  { key: 'haftor', name: 'Hafþór Hermannsson', role: 'Yfirmaður Akureyri', dept: 'thjonusta', branch: 'ak', phone: '580 8222', email: 'haftor@velfang.is' },
  { key: 'kristjanfr', name: 'Kristján Friðriksson', role: 'Sölustjóri Norðurlandi', dept: 'sala', branch: 'ak', phone: '580 8223', email: 'Kristjanfr@velfang.is' },
  { key: 'hermann', name: 'Hermann Hafþórsson', role: 'Verkstæði Akureyri', dept: 'thjonusta', branch: 'ak', phone: '580 8200', email: 'hermann@velfang.is' },
  { key: 'henrik', name: 'Henrik Þór Tryggvason', role: 'Verkstæði Akureyri', dept: 'thjonusta', branch: 'ak', phone: '580 8200' },
  { key: 'axel', name: 'Axel Haukur Þórisson', role: 'Verkstæði Akureyri', dept: 'thjonusta', branch: 'ak', phone: '580 8200' },
  { key: 'valdimar', name: 'Valdimar Geir Valdimarsson', role: 'Verkstæði Akureyri', dept: 'thjonusta', branch: 'ak', phone: '580 8200' },
  { key: 'jon', name: 'Jón Trausti Ingvason', role: 'Þjónustustjóri Selfossi', dept: 'thjonusta', branch: 'sel', phone: '767 8403', email: 'jon@velfang.is' },
  { key: 'sigurdur', name: 'Sigurður Óli Bragason', role: 'Verkstæði Selfossi', dept: 'thjonusta', branch: 'sel' },
]
export const staffPhoto = (p: Person) => A(`s-${p.key}.webp`)
export const telOf = (phone: string) => `+354${phone.replace(/\s/g, '')}`

/* ── Terms, LiveLink, parts: velfang.is, verbatim where it matters ── */
export const WARRANTY = {
  lead: 'Ábyrgð hjá Vélfangi ehf. gildir í eitt ár nema annað sé sérstaklega tekið fram.',
  covers: [
    'Kostnaður vegna vinnu og varahluta sem til fellur á ábyrgðartíma og rekja má til framleiðslu- eða efnisgalla er á ábyrgð söluaðila. Skilyrði er að ábyrgðarviðgerð sé unnin í dagvinnu á verkstæði söluaðila eða verkstæði sem hann samþykkir.',
    'Varahlutir eru í ábyrgð í eitt ár ef söluaðili, eða aðili sem hann samþykkir, setur þá í.',
  ],
  excludes: [
    'Eðlilegt slit fellur aldrei undir ábyrgð.',
    'Flutningskostnaður tækis á verkstæði söluaðila er ekki innifalinn.',
    'Kostnaður vegna afnotamissis og afleidds tjóns fellur ekki undir ábyrgð.',
  ],
  voids: [
    'Aðrir en starfsmenn söluaðila gera við bilun, eða reyna það án samþykkis söluaðila.',
    'Vélinni hefur verið breytt af öðrum en söluaðila eða þeim sem hann samþykkir.',
    'Viðhaldi og þjónustu samkvæmt handbók er ekki fylgt.',
    'Notaðir eru varahlutir frá öðrum en framleiðanda tækisins.',
    'Tækið er ekki rétt notað, eða ill meðferð leiðir til bilunar.',
    'Bilun er ekki tilkynnt söluaðila tafarlaust.',
  ],
  maker: 'Framleiðandi getur verið með aðra ábyrgðarskilmála og þeir gilda framar þessum. Lestu handbók tækisins vel og spurðu söluaðila ef vafi leikur á.',
  help: 'Tækniaðstoð í síma er sjálfsögð. Víðtæk aðstoð utan þjónustusamninga, svo sem endurtekin símtöl og nákvæm bilanaleit, getur verið gjaldskyld á gildandi tímagjaldi. Vélar í ábyrgð: ekkert gjald.',
}
export const LIVELINK = {
  what: 'JCB LiveLink er hugbúnaður sem lætur eiganda fylgjast með vélinni sinni úr fjarlægð, allan sólarhringinn. LiveLink tölvan safnar upplýsingum úr skynjurum vélarinnar og sendir þær í öruggan gagnagrunn JCB.',
  reports: ['Vinnustundir vélar eða allra véla', 'Staðsetning í rauntíma', 'Viðhaldsskýrslur og tilkynningar', 'Eldsneytiseyðsla og eldsneytismagn', 'Skýrslur um hægagang og vinnutíma', 'Viðvörun ef vél er notuð utan leyfðs vinnutíma eða svæðis'],
  why: ['JCB umboðið getur flett upp villukóðum vélarinnar hvar sem hún er á landinu', 'Auðveldar bilanaleit og styttir viðgerðartíma', 'LiveLink Lite má setja í aðrar vélar, tæki og bíla'],
  which: 'Langflestar JCB vélar yfir 5 tonnum, framleiddar eftir 2015, eru með JCB LiveLink. Margar eldri og stærri vélar líka.',
  who: 'Eigandi vélar fær aðgang að sinni vél eingöngu.',
  contact: 'gummi@velfang.is',
}
export const PARTS = {
  lead: 'Varahlutaþjónustan er stór hluti af starfi Vélfangs. Með fastnúmeri eða framleiðslunúmeri og árgerð gengur pöntunin hraðar fyrir sig.',
  others: 'Fyrir utan eigin umboð útvegar Vélfang varahluti og síur í flestar tegundir dráttarvéla, til dæmis Massey Ferguson, Deutz og McCormick frá Vapormatic og Sparex, í flestar tegundir þreskivéla og í Furukawa og IH vinnuvélar.',
}
export const KUHN_OFFER = {
  title: 'Áramótatilboð KUHN og Vélfangs',
  last: '2025-2026',
  until: '5. janúar 2026',
  terms: ['15 % afsláttur af hey- og jarðvinnutækjum', '5 % afsláttur af rúllusamstæðum', 'Vélin er af árgerð 2026', 'Greitt við afhendingu; gengi má tryggja með fyrirframgreiðslu', 'Slithlutir eins og hnífar og tindar með 20 % afslætti á gildistímanum'],
  note: 'Tilboðið gilti til 5. janúar, eins og undanfarin 21 ár. Það er ekki lengur sent á öll lögbýli landsins.',
}

/* ── News: the three newest posts on velfang.is ── */
export type Post = { slug: string; date: string; title: string; lead: string; body: string[]; img: Photo }
export const NEWS: Post[] = [
  { slug: 'strautmann-magnon-330-390', date: '17.08.2026', title: 'Nýjar Magnon gerðir frá Strautmann', img: IMG.magnon2,
    lead: 'Strautmann stækkar Magnon-línuna með tveimur nýjum sjálfhleðsluvögnum, Magnon 8/9-330 og Magnon 10/11-390.',
    body: [
      'Með nýju gerðunum færist Magnon-línan niður í minni stærðarflokka, fyrir bændur og verktaka sem gera miklar kröfur um afköst, fóðurgæði og rekstraröryggi en vilja liprari vagn og minna hleðslurými.',
      'Magnon 8/9-330: 32 m³ hleðslurými samkvæmt DIN, 18 tonna boggie-undirvagn, leyfileg heildarþyngd allt að 22 tonn, 35 mm skurðarlengd í Magnon 8 og 22 mm í Magnon 9, vökvastýrður framveggur.',
      'Magnon 10/11-390: 38 m³ hleðslurými samkvæmt DIN, 20 tonna vökvafjöðraður undirvagn, leyfileg heildarþyngd allt að 24 tonn, 35 mm og 22 mm skurðarlengd, 2,25 m breiður, Flex-Load upptökutæki með vökvadrifi.',
      'Fyrstu vagnarnir verða fáanlegir fyrir heyskapinn 2027.',
    ] },
  { slug: 'claas-axion-8-cmatic', date: '11.08.2026', title: 'Vélfang kynnir CLAAS AXION 8 CMATIC', img: IMG.axion,
    lead: 'Ný kynslóð stórra dráttarvéla frá CLAAS tekur við af AXION 800 línunni: allt að 313 hö og nýtt, hljóðlátt ökumannshús.',
    body: [
      'Þrjár gerðir: AXION 8.240 CMATIC allt að 264 hö, 8.270 CMATIC allt að 291 hö og 8.290 CMATIC allt að 313 hö. Allar með 6,7 lítra sex strokka FPT NEF vél og CMATIC stiglausri skiptingu, hámarkstog allt að 1.282 Nm.',
      'CEMOS AUTO POWERTRAIN stýrir samspili vélar og skiptingar sjálfkrafa. AUTO LOAD ANTICIPATION hlaut silfurverðlaun á Agritechnica 2025.',
      'CMATIC skiptingin nær 40 km/klst. við aðeins 1.300 snúninga á mínútu.',
    ] },
  { slug: 'nytt-verkstaedi-a-selfossi', date: '12.05.2026', title: 'Nýtt þjónustuverkstæði á Selfossi', img: IMG.selfoss,
    lead: 'Vélfang hefur opnað nýtt og fullbúið þjónustuverkstæði að Gagnheiði 32 á Selfossi.',
    body: [
      'Verkstæðið sinnir bæði reglubundnu viðhaldi og flóknari viðgerðum á fjölbreyttum tækjabúnaði, þar sem eftirspurn eftir sérhæfðri þjónustu við landbúnaðar- og vinnuvélar á Suðurlandi hefur farið vaxandi.',
      '„Með verkstæðinu á Selfossi erum við að færa þjónustuna nær viðskiptavinum okkar og stytta viðbragðstíma verulega. Markmiðið er einfalt: að halda vélum gangandi og lágmarka stöðvunartíma,“ segir Eyjólfur Pétur Pálmason.',
      'Jón Ingvason hefur umsjón með rekstri verkstæðisins. Pantanir: jon@velfang.is, sími 767 8403. Almennar verkbeiðnir: verk@velfang.is.',
    ] },
]

/* ── Requests from the forms (kept in this browser for the prototype) ── */
export type Kind = 'skodun' | 'tilbod' | 'verkstaedi' | 'varahlutir' | 'livelink' | 'selja' | 'oskalisti' | 'kuhn' | 'fyrirspurn'
export const KIND_LABEL: Record<Kind, string> = { skodun: 'Skoðun', tilbod: 'Tilboð', verkstaedi: 'Verkstæði', varahlutir: 'Varahlutir', livelink: 'LiveLink', selja: 'Vél til sölu', oskalisti: 'Óskalisti', kuhn: 'Kuhn tilboð', fyrirspurn: 'Fyrirspurn' }
export type Request = { id: string; kind: Kind; title: string; when: string; who: string; contact: string; detail: string; branch: BranchKey; at: string; status: 'ný' | 'staðfest' }
/* Who the request lands with, by Vélfang's own published routing. */
export function routeTo(kind: Kind, b: BranchKey): string {
  if (kind === 'varahlutir') return b === 'ak' ? 'Akureyri, 580 8222' : 'varahlutir@velfang.is'
  if (kind === 'livelink') return 'gummi@velfang.is'
  if (kind === 'verkstaedi') return b === 'ak' ? 'haftor@velfang.is' : b === 'sel' ? 'jon@velfang.is' : 'verk@velfang.is'
  if (b === 'ak') return 'Kristjanfr@velfang.is'
  return 'velfang@velfang.is (söludeild)'
}
const RK = 'vf-requests'
export function loadRequests(): Request[] { try { return JSON.parse(sessionStorage.getItem(RK) ?? '[]') } catch { return [] } }
export function saveRequest(r: Omit<Request, 'id' | 'at' | 'status'>): Request {
  const full: Request = { ...r, id: `VF-${Date.now().toString(36).toUpperCase().slice(-5)}`, at: new Date().toISOString(), status: 'ný' }
  try { sessionStorage.setItem(RK, JSON.stringify([full, ...loadRequests()])) } catch { /* private mode */ }
  return full
}
/* Sample inbox for the staff-side preview, marked as sample on the page. */
export const SAMPLE_REQUESTS: Request[] = [
  { id: 'VF-S0001', kind: 'verkstaedi', title: 'Reglubundið viðhald, Fendt 516 Vario', when: 'Vika 42', who: 'Sýnishorn: bú í Flóa', contact: '690 0000', detail: 'Fastnúmer XX-000. Komið með vélina á Gagnheiði.', branch: 'sel', at: '2026-10-09T08:12:00Z', status: 'ný' },
  { id: 'VF-S0002', kind: 'skodun', title: 'JCB JS145W hjólagrafa (422839)', when: 'fim. 16. okt.', who: 'Sýnishorn: verktaki', contact: 'verk@example.is', detail: 'Vill sjá rótortiltið virka.', branch: 'rvk', at: '2026-10-08T14:40:00Z', status: 'staðfest' },
  { id: 'VF-S0003', kind: 'varahlutir', title: 'Síur í CLAAS Arion 420', when: 'Sem fyrst', who: 'Sýnishorn: kúabú', contact: '690 0001', detail: 'Árgerð 2017, framleiðslunúmer í myndinni.', branch: 'ak', at: '2026-10-08T10:05:00Z', status: 'ný' },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Vélfang ehf.',
  slogan: 'Verkin tala',
  taxID: '560909-1520',
  telephone: '+354 580 8200',
  email: CONTACT.email,
  url: 'https://velfang.is',
  brand: BRANDS.map((b) => ({ '@type': 'Brand', name: b.name })),
  location: BRANCHES.map((b) => ({ '@type': 'Place', name: `Vélfang ${b.name}`, address: { '@type': 'PostalAddress', streetAddress: b.street, postalCode: b.post.split(' ')[0], addressLocality: b.town, addressCountry: 'IS' }, geo: { '@type': 'GeoCoordinates', latitude: b.lat, longitude: b.lon } })),
}

export const companyEntry: PreviewCompany = {
  slug: 'velfang',
  route: ROUTE,
  name: 'Vélfang',
  sector: 'Landbúnaðar- og vinnuvélar',
  location: 'Gylfaflöt 32, 112 Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Stofnað í mars 2004; Reykjavík, Akureyri og Selfoss',
  currentUrl: 'https://velfang.is',
  ownerEmail: 'velfang@velfang.is',
  concept: 'Verkin tala',
  conceptTagline: 'The Vatt system re-aimed at a 21-brand machinery dealer: the stock list pulled home from velasolur with filters by brand, type, condition, field and branch, a typographic brand index in Vélfang’s own three fields, a pinned map chapter on real OpenStreetMap geometry that builds the three-branch service network, workshop booking for Reykjavík, Akureyri and Selfoss, viewing and quote requests, parts and LiveLink flows, a staff-side inbox, and an assistant that answers only from this page. Every frame opens like the peak in Vélfang’s mark.',
  accent: '#E7001C',
  dark: false,
  status: 'In build',
  thumb: A('hero-800.webp'),
  ownPhotography: true,
  photoCredit: 'Myndir af velfang.is og af söluskrá Vélfangs á velasolur.is, október 2026. Merki Vélfangs endurteiknað eftir merkinu á velfang.is.',
  audit: {
    strengths: ['21 umboð, þar á meðal JCB, Fendt, CLAAS og Kuhn', 'Þrjú verkstæði: Reykjavík, Akureyri og nýtt á Selfossi', 'Eigin myndir af vélum, afhendingum og starfsfólki'],
    weaknesses: ['Vélarnar á lager eru á öðrum vef (velasolur.is)', 'Sniðmátssíður úr 2016 enn í lofti: „Spotless LTD, New York“ og verðskrá hreingerningafyrirtækis', 'Selfoss vantar á verkstæðissíðuna og Akureyri er með tvö heimilisföng'],
    opportunities: ['Lagerinn heim á vefinn með síum eftir merki, flokki og útibúi', 'Bókun á verkstæði á þremur stöðum', 'Áramótatilboð Kuhn með skráningu í stað póstsendinga'],
  },
  positioning: 'Vélfang selur og þjónustar nýjar og notaðar vélar fyrir landbúnað, vélaverktaka, golfvelli og sveitarfélög, með umboð fyrir 21 framleiðanda og verkstæði í Reykjavík, á Akureyri og Selfossi.',
  outreach: {
    subject: 'Vélfang: lagerinn heim á velfang.is',
    body: 'Góðan dag,\n\nÉg setti saman hugmynd að nýjum vef fyrir Vélfang:\n\n[HLEKKUR Á FRUMGERÐ]\n\nKveðja,\nSindri Már',
  },
}
