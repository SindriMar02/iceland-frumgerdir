import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { ADDRESS, CLOSE_MIN, DISCLAIMER, EMAIL, IMG, MAPS_URL, OPEN_MIN, PHONE, PHONE_HREF } from './data'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('naustid')

/* ══════════════════════════════════════════════════════════════════════════
 * NAUSTIÐ — "Gluggar" (windows), full site
 *
 * The scroll system is the designer's approved handoff, applied across the
 * WHOLE site rather than only the six panels the prototype happened to show:
 *
 *   1 · WINDOW DRIFT — no photograph moves WITH the page. Each sits in a
 *       fixed window whose oversized inner wrapper translates as the window
 *       crosses the viewport. Overhang is DERIVED from drift (×1.6).
 *   2 · TEXT MASKS   — display type rises out of an overflow mask; body copy
 *       gets a quieter fade-and-lift.
 *   3 · THE JOURNEY  — five panels travel sideways past a pinned viewport.
 *   4 · STICKY STACK — the cream hours section recedes under the yellow one.
 *
 * ONE requestAnimationFrame loop drives all of it, reading every measurement
 * before writing any transform.
 *
 * ── FACTS, ALL RE-VERIFIED 2026-08-04 ─────────────────────────────────────
 * · Hours 11:30–21:30 every day — ja.is, the national directory. The design
 *   prototype said 12:00–21:00 and a search snippet said 11:45–21:00; both
 *   are wrong.
 * · #1 of 13 in Húsavík on Tripadvisor · Google 4.7 (1,506) · Restaurant Guru
 *   4.8 · Facebook 4.7 (221).
 * · Price band 4.000–6.000 kr. per person is an aggregator figure, not a
 *   published price list — labelled as such, and no dish carries a price.
 * · "Eins og að koma til ömmu" is not invented: Visit Húsavík's own listing
 *   describes eating here as a grandmother's kitchen full of delicacies.
 * · Every photograph is the restaurant's own. There are only four, which is
 *   why the layout favours panels and slabs over large free crops.
 * ══════════════════════════════════════════════════════════════════════ */

const INK = '#12171B'
const INK_2 = '#0C1013'
const SLAB = '#171E23'
const YELLOW = '#E3B81F'
const YELLOW_INK = '#9A7A0E'
const CREAM = '#F7F2E8'
const BONE = '#D8DEDD'
const BONE_SOFT = 'rgba(216,222,221,0.72)'
const BONE_MUTE = '#727F87'
const INK_SOFT = '#4E5A61'
const HAIR_INK = 'rgba(18,23,27,0.22)'

const CFG = {
  drift: { slab: 13, fig: 9, heroFactor: 0.8 },
  overhangFactor: 1.6,
  scrubLerp: 0.08,
  mask: { triggerAt: 0.86 },
  fade: { triggerAt: 0.82 },
  stack: { scale: 0.94, fadeTo: 0.55 },
  /* minDuration must clear the aperture's own 1.4s enter transition, or on a
   * warm cache the pill blows out before it has finished forming and the
   * loader reads as a flicker. */
  preload: { minDuration: 1700, maxDuration: 6000, holdAtFull: 220 },
  /* The swipe rail exists because swiping is natural on TOUCH — not because a
   * window is narrow. A 700px desktop window still has a mouse and should get
   * the pinned journey, which is what "scroll down to go sideways" means. */
  bp: { journeyMin: 560, narrow: 700 },
  journeyQuery: '(min-width: 560px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  railQuery: '(max-width: 559px), (pointer: coarse)',
  testimonialMs: 5200,
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

function windowBox(drift: number, axis: 'x' | 'y'): CSSProperties {
  const o = drift * CFG.overhangFactor
  const size = 100 + o * 2
  return axis === 'x'
    ? { left: `-${o.toFixed(1)}%`, width: `${size.toFixed(1)}%`, top: 0, height: '100%' }
    : { top: `-${o.toFixed(1)}%`, height: `${size.toFixed(1)}%`, left: 0, width: '100%' }
}

const MONO = "'Space Mono', ui-monospace, monospace"
const SERIF = "'Gambarino', Georgia, serif"
const SANS = "'Karla', system-ui, sans-serif"
const TICK = 'repeating-linear-gradient(90deg, rgba(216,222,221,0.3) 0 1px, transparent 1px 7px)'
const TICK_INK = 'repeating-linear-gradient(90deg, rgba(18,23,27,0.28) 0 1px, transparent 1px 7px)'

/* ── Bilingual catalogue ────────────────────────────────────────────────── */
type L = { is: string; en: string }

const C = {
  preKicker: { is: 'Naustið · Húsavík', en: 'Naustið · Húsavík' },
  book: { is: 'Borðapöntun', en: 'Book a table' },
  heroKicker: { is: 'Sjávarréttir · fjölskyldurekið · við höfnina', en: 'Seafood · family-run · by the harbour' },
  heroSub: {
    is: 'Ferskur fiskur úr héraði, brauð bakað á staðnum og súpan sem gestir tala um. Gakktu nær.',
    en: 'Fish landed locally, bread baked in the house, and the soup guests keep mentioning. Come closer.',
  },
  scrollHint: { is: 'skrunaðu ↓', en: 'scroll ↓' },
  swipeHint: { is: '→ strjúktu til hliðar', en: '→ swipe sideways' },

  navSupan: { is: 'Súpan', en: 'The soup' },
  navMatsedill: { is: 'Matseðill', en: 'Menu' },
  navSagan: { is: 'Sagan', en: 'Story' },
  navUmsagnir: { is: 'Umsagnir', en: 'Reviews' },
  navOpid: { is: 'Opnunartími', en: 'Hours' },
  navStadur: { is: 'Staðsetning', en: 'Find us' },

  k1: { is: '01 · súpan', en: '01 · the soup' },
  soupH: { is: 'Fiskisúpan', en: 'The fish soup' },
  soupBody: {
    is: 'Rjómakennd fiskisúpa með tómat, full af fiski og skelfiski, borin fram með nýbökuðu brauði. Í umsögn eftir umsögn nefna gestir sömu skálina.',
    en: 'A creamy tomato fish soup, full of fish and shellfish, served with bread baked that morning. Review after review names the same bowl.',
  },
  slab1: { is: 'Húsið · timbur, 1931 · bárujárn', en: 'The house · timber, 1931 · corrugated iron' },

  k2: { is: '02 · matseðill', en: '02 · the menu' },
  menuH: { is: 'Matseðill', en: 'The menu' },
  menuSea: { is: 'Af sjónum', en: 'From the sea' },
  menuEnd: { is: 'Í lokin', en: 'To finish' },
  menuNote: {
    is: 'Sýnishorn tekið saman úr umsögnum og matarskrifum. Matseðillinn breytist eftir árstíð og afla dagsins — hringdu í 464 1520 til að heyra hvað er í boði.',
    en: 'A sample drawn from reviews and food writing. The menu changes with the season and the day’s catch — call 464 1520 to hear what is on.',
  },
  slab2: { is: 'Grillaður lax · af grillinu', en: 'Grilled salmon · off the grill' },
  slabGardur: { is: 'Garðurinn · skiltið og baðkarið', en: 'The garden · the sign and the bathtub' },
  plateNote: {
    is: 'Af grillinu, borinn fram með salati og kartöflum. Fiskurinn kemur ferskur úr héraði og aflinn ræður hvað er á borðum hverju sinni.',
    en: 'Off the grill, served with salad and potatoes. The fish is landed locally, and the day’s catch decides what is on the table.',
  },

  k3: { is: '03 · sagan', en: '03 · the story' },
  storyH: { is: 'Eins og að koma til ömmu', en: 'Like visiting grandma' },
  storyBody: {
    is: 'Hugmyndin kviknaði eftir hrunið 2008. Tvær mágkonur opnuðu lítinn stað við höfnina og fluttu árið 2016 í Sel, gult timburhús frá 1931. Húsinu var hlíft eins og hægt var svo sál þess fengi að halda sér.',
    en: 'The idea came after the 2008 crash. Two sisters-in-law opened a small place by the harbour and in 2016 moved into Sel, a yellow timber house from 1931. The building was left as intact as possible so it kept its character.',
  },

  revKicker: { is: 'Umsagnir', en: 'Reviews' },
  revH: { is: 'Efst á lista á Húsavík', en: 'Top of the list in Húsavík' },
  revNote: {
    is: 'Raunverulegar umsagnir, sóttar í gegnum umsagnaveitur. Einkunnir uppfærðar í ágúst 2026.',
    en: 'Real reviews, gathered through review aggregators. Ratings current as of August 2026.',
  },
  revPrev: { is: 'Fyrri umsögn', en: 'Previous review' },
  revNext: { is: 'Næsta umsögn', en: 'Next review' },

  openKicker: { is: 'Opið alla daga', en: 'Open every day' },
  openBody: {
    is: 'Sami opnunartími alla daga vikunnar. Þegar ljós logar í glugganum á Ásgarðsvegi 1 er potturinn á hellunni.',
    en: 'The same hours every day of the week. When the light is on in the window at Ásgarðsvegur 1, the pot is on the stove.',
  },
  openNow: { is: 'Opið núna', en: 'Open now' },
  closedNow: { is: 'Lokað núna', en: 'Closed now' },
  closesAt: { is: 'lokar 21:30', en: 'closes 21:30' },
  opensAt: { is: 'opnar 11:30', en: 'opens 11:30' },

  bookKicker: { is: 'Ekkert netbókunarkerfi · hringdu eða kíktu við', en: 'No online booking · call or drop in' },
  bookBody: {
    is: 'Naustið tekur við borðapöntunum í síma og tölvupósti. Skildu eftir miða hér og staðurinn hefur samband til að staðfesta.',
    en: 'Naustið takes bookings by phone and email. Leave a note here and the restaurant will get back to confirm.',
  },
  fName: { is: 'Nafn', en: 'Name' },
  fContact: { is: 'Sími eða netfang', en: 'Phone or email' },
  fGuests: { is: 'Fjöldi gesta', en: 'Number of guests' },
  fWhen: { is: 'Dagur og tími', en: 'Day and time' },
  fMessage: { is: 'Skilaboð (t.d. ofnæmi)', en: 'Message (e.g. allergies)' },
  fSubmit: { is: 'Senda beiðni', en: 'Send request' },
  fNote: {
    is: 'Þetta er beiðni um borð, ekki staðfest bókun.',
    en: 'This is a request for a table, not a confirmed booking.',
  },
  okH: { is: 'Miðinn er tilbúinn', en: 'Your note is ready' },
  okBody: {
    is: 'Í frumgerðinni er beiðnin ekki send sjálfkrafa. Kláraðu hana með tölvupósti eða símtali:',
    en: 'In this prototype the request is not sent automatically. Finish it by email or phone:',
  },
  okMail: { is: 'Senda í tölvupósti', en: 'Send by email' },
  okAgain: { is: 'Skrifa nýjan miða', en: 'Write a new note' },

  findKicker: { is: 'Staðsetning', en: 'Find us' },
  findH: { is: 'Í hjarta Húsavíkur', en: 'In the heart of Húsavík' },
  findBody: {
    is: 'Húsavík stendur við Skjálfandaflóa á Norðurlandi og er oft kölluð höfuðstaður hvalaskoðunar á Íslandi. Naustið er í miðbænum, í göngufæri frá höfninni, og vinsælt stopp á Demantshringnum.',
    en: 'Húsavík sits on Skjálfandi bay in north Iceland and is often called the country’s whale-watching capital. Naustið is in the centre, walking distance from the harbour, and a popular stop on the Diamond Circle.',
  },
  findAddr: { is: 'Heimilisfang', en: 'Address' },
  findMaps: { is: 'Opna í kortum', en: 'Open in maps' },
  findPhone: { is: 'Sími', en: 'Phone' },
  findMail: { is: 'Netfang', en: 'Email' },
  findPrice: { is: 'Verðbil', en: 'Price band' },
  findPriceV: { is: '4.000–6.000 kr. á mann', en: 'ISK 4,000–6,000 per person' },
  mapLabel: { is: 'Kort af staðsetningu Naustsins', en: 'Map of Naustið’s location' },
  mapKicker: { is: 'Á kortinu', en: 'On the map' },
  mapEnable: { is: 'Virkja kortið', en: 'Enable the map' },
  findPriceNote: {
    is: 'Viðmið úr opinberum skráningum, ekki staðfestur verðlisti.',
    en: 'An aggregator figure, not a published price list.',
  },
} satisfies Record<string, L>

/* Their real dishes. No prices anywhere: the restaurant publishes none. */
const SEA: { name: L; note: L }[] = [
  { name: { is: 'Fiskisúpa', en: 'Fish soup' }, note: { is: 'rjómakennd með tómat, full af fiski og skelfiski', en: 'creamy with tomato, full of fish and shellfish' } },
  { name: { is: 'Fiskur dagsins', en: 'Catch of the day' }, note: { is: 'aflinn ræður, breytist frá degi til dags', en: 'whatever came in, changes daily' } },
  { name: { is: 'Grillaður lax', en: 'Grilled salmon' }, note: { is: 'af grillinu með salati og kartöflum', en: 'off the grill with salad and potatoes' } },
  { name: { is: 'Plokkfiskur', en: 'Icelandic fish stew' }, note: { is: 'borinn fram á rúgbrauði', en: 'served on rye bread' } },
  { name: { is: 'Fish and chips', en: 'Fish and chips' }, note: { is: 'stökkur fiskur og franskar', en: 'crisp fish and fries' } },
  { name: { is: 'Grilluð humarsamloka', en: 'Grilled langoustine roll' }, note: { is: 'humar af grillinu í brauði', en: 'langoustine off the grill, in bread' } },
]
const END: { name: L; note: L }[] = [
  { name: { is: 'Súkkulaðikaka', en: 'Chocolate cake' }, note: { is: 'bökuð á staðnum', en: 'baked in the house' } },
  { name: { is: 'Skyramisu', en: 'Skyramisu' }, note: { is: 'skyrið mætir tiramisu', en: 'skyr meets tiramisu' } },
  { name: { is: 'Rabarbaragrautur', en: 'Rhubarb compote' }, note: { is: 'heitur, með rjóma', en: 'warm, with cream' } },
]

/* Real, attributable reviews. Guðrún Ólafía's and Philippe Blanc's are quoted
 * in their original Icelandic — translating a review would misrepresent it,
 * so the EN column carries a translation clearly marked by context only. */
const QUOTES: { text: L; name: string; src: L }[] = [
  {
    text: { is: '„Besti fiskiveitingastaðurinn á landinu ❤“', en: '“Besti fiskiveitingastaðurinn á landinu ❤” — the best fish restaurant in the country' },
    name: 'Guðrún Ólafía',
    src: { is: 'í gegnum Sluurpy', en: 'via Sluurpy' },
  },
  {
    text: { is: '„Such an excellent meal and cute location. Brilliant fish soup, fish of the day, mussels and lamb.“', en: '“Such an excellent meal and cute location. Brilliant fish soup, fish of the day, mussels and lamb.”' },
    name: 'Amanda Summons',
    src: { is: 'í gegnum Sluurpy', en: 'via Sluurpy' },
  },
  {
    text: { is: '„Skemmtilegt umhverfi, mjög góðir fiskréttir“', en: '“Skemmtilegt umhverfi, mjög góðir fiskréttir” — a lovely room, very good fish' },
    name: 'Philippe Blanc',
    src: { is: 'í gegnum Sluurpy', en: 'via Sluurpy' },
  },
  {
    text: { is: '„Amazing dishes — the fish is very fresh and delicious. Lovely atmosphere and attentive and hospitable staff!“', en: '“Amazing dishes — the fish is very fresh and delicious. Lovely atmosphere and attentive and hospitable staff!”' },
    name: 'Lisa',
    src: { is: 'Tripadvisor, í gegnum Restaurant Guru', en: 'Tripadvisor, via Restaurant Guru' },
  },
]

/* Ratings as published by each platform, checked 2026-08-04. */
const RATINGS: { v: string; label: L }[] = [
  { v: '#1', label: { is: 'af 13 á Húsavík · Tripadvisor', en: 'of 13 in Húsavík · Tripadvisor' } },
  { v: '4,7', label: { is: '1.506 umsagnir · Google', en: '1,506 reviews · Google' } },
  { v: '4,8', label: { is: 'Restaurant Guru', en: 'Restaurant Guru' } },
  { v: '4,7', label: { is: '221 umsögn · Facebook', en: '221 reviews · Facebook' } },
]

function Win({ src, webp, sizes, alt, drift, axis = 'x', eager = false, objectPosition }: {
  src: string; webp?: string; sizes?: string; alt: string; drift: number
  axis?: 'x' | 'y'; eager?: boolean; objectPosition?: string
}) {
  return (
    /* `transform` is deliberately NOT in the style prop — the rAF loop owns
     * it, and a React re-render (the language toggle) must not wipe it. */
    <div className="na-win" data-win={drift} style={{ position: 'absolute', ...windowBox(drift, axis) }}>
      <picture>
        {webp && <source type="image/webp" srcSet={webp} sizes={sizes} />}
        <img
          src={src} sizes={sizes} alt={alt} decoding="async"
          loading={eager ? 'eager' : 'lazy'} {...(eager ? { fetchpriority: 'high' } : {})}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', objectPosition }}
        />
      </picture>
    </div>
  )
}

function Kick({ children, color = YELLOW }: { children: ReactNode; color?: string }) {
  return <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.18em', color, textTransform: 'uppercase' }}>{children}</div>
}

/* The mask crops at the line box, so the 0.22em headroom and a line-height
 * never below 0.98 are both load-bearing for ð þ g j. */
function Mask({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ overflow: 'hidden', paddingBottom: '0.22em' }}>
      <div className="na-mask" style={style}>{children}</div>
    </div>
  )
}

function isOpenNow(): boolean {
  try {
    const hm = new Intl.DateTimeFormat('en-GB', { timeZone: 'Atlantic/Reykjavik', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date())
    const [h, m] = hm.split(':').map(Number)
    const mins = h * 60 + m
    return mins >= OPEN_MIN && mins < CLOSE_MIN
  } catch { return true }
}

export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [lang, setLang] = useState<'is' | 'en'>('is')
  const T = (v: L) => v[lang]

  const [open, setOpen] = useState(isOpenNow)
  useEffect(() => {
    const t = window.setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    document.title = 'Naustið · Sjávarréttir við höfnina á Húsavík'
    setThemeColor(INK)
    return () => setThemeColor('#0a1320')
  }, [])
  useEffect(() => { document.documentElement.setAttribute('lang', lang) }, [lang])

  /* ── Testimonials: one state change per 5.2s, never per frame. ───────── */
  const [qi, setQi] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setQi((i) => (i + 1) % QUOTES.length), CFG.testimonialMs)
    return () => window.clearInterval(t)
  }, [paused])

  /* ── Reservation note ────────────────────────────────────────────────── */
  type Draft = { name: string; contact: string; guests: string; when: string; message: string }
  const EMPTY: Draft = { name: '', contact: '', guests: '', when: '', message: '' }
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [sent, setSent] = useState<Draft | null>(null)
  const mailto = sent
    ? `mailto:${EMAIL}?subject=${encodeURIComponent('Borðapöntun á Naustinu')}&body=${encodeURIComponent(
        `Nafn: ${sent.name}\nSamband: ${sent.contact}\nFjöldi gesta: ${sent.guests}\nDagur og tími: ${sent.when}\nSkilaboð: ${sent.message}`,
      )}`
    : `mailto:${EMAIL}`

  /* ── THE ENGINE ─────────────────────────────────────────────────────── */
  const navTo = useRef<(id: string) => void>(() => {})
  const journeyMaster = useRef<{ master: ScrollTrigger; track: HTMLElement; tween: gsap.core.Tween } | null>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = <E extends Element>(s: string) => root.querySelector(s) as E | null
    const qa = (s: string) => Array.from(root.querySelectorAll<HTMLElement>(s))

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    /* rootRef is the outer wrapper; the styles are scoped to #na-root inside
     * it, so the theming attribute has to land on that node, not this one. */
    const themeRoot = (root.querySelector('#na-root') as HTMLElement | null) ?? root
    const heroImg = q<HTMLElement>('[data-hero-img]')
    const jwrap = q<HTMLElement>('[data-journey]')
    const jview = q<HTMLElement>('[data-journey-view]')
    const track = q<HTMLElement>('[data-track]')
    const prog = q<HTMLElement>('[data-progress]')
    const hint = q<HTMLElement>('[data-swipe-hint]')
    const stackUnder = q<HTMLElement>('[data-stack-under]')
    const stackOver = q<HTMLElement>('[data-stack-over]')
    const pre = q<HTMLElement>('[data-preloader]')
    const preNum = q<HTMLElement>('[data-preloader-count]')
    const heroTitle = q<HTMLElement>('[data-hero-title]')
    const heroSub = q<HTMLElement>('[data-hero-sub]')

    const wins = qa('.na-win')
    const masks = qa('.na-mask')
    const fades = qa('.na-fade')
    const shown = new Set<HTMLElement>()

    const useRail = () => !window.matchMedia(CFG.journeyQuery).matches
    let vw = window.innerWidth, vh = window.innerHeight
    let mobile = useRail()
    let raf = 0

    const layout = () => {
      vw = window.innerWidth; vh = window.innerHeight
      mobile = useRail()
      if (!track || !jwrap || !jview) return
      const panels = Array.from(track.children) as HTMLElement[]

      if (reduced) {
        jwrap.style.height = 'auto'
        Object.assign(jview.style, { position: 'relative', height: 'auto', overflow: 'visible' })
        Object.assign(track.style, { flexDirection: 'column', height: 'auto', transform: 'none' })
        panels.forEach((p) => { p.style.width = '100%'; p.style.minHeight = '70svh' })
        return
      }
      if (mobile) {
        const narrow = vw < CFG.bp.narrow
        jwrap.style.height = 'auto'
        Object.assign(jview.style, { position: 'relative', height: '86svh', overflow: 'visible' })
        Object.assign(track.style, { transform: 'none', overflowX: 'auto', scrollSnapType: 'x mandatory' })
        panels.forEach((p) => {
          p.style.scrollSnapAlign = 'start'
          if (p.dataset.panel !== 'slab') { p.style.width = '90vw'; p.style.padding = '0 24px' }
          if (p.dataset.cols) p.style.gridTemplateColumns = narrow ? '1fr' : '1fr 1fr'
          p.querySelectorAll<HTMLElement>('figure').forEach((f) => { f.style.height = narrow ? '34svh' : '54svh' })
        })
        if (hint) hint.style.display = 'block'
        return
      }
      /* ScrollTrigger owns the pin and the spacer on desktop, so the wrapper
       * height must NOT be set by hand here — doing both fights the pin. */
      Object.assign(jview.style, { position: 'relative', height: '100vh', overflow: 'hidden' })
      Object.assign(track.style, { overflowX: 'visible', scrollSnapType: 'none', flexDirection: 'row', height: '100%' })
      panels.forEach((p) => {
        /* Every panel is FULL BLEED. The reading column is created by padding
         * instead of by narrowing the panel, so each one fills the screen the
         * way a section should while the copy stays a sane measure. */
        p.style.width = '100vw'
        p.style.minHeight = ''
        p.style.padding = p.dataset.panel === 'slab' ? '0' : '0 max(28px, calc((100vw - 1180px) / 2))'
        if (p.dataset.cols) p.style.gridTemplateColumns = '1fr 1fr'
        /* A pinned panel cannot scroll: content taller than the viewport is
         * unreachable, not cropped. Shrink the figures on short screens. */
        p.querySelectorAll<HTMLElement>('figure').forEach((f) => { f.style.height = vh < 860 ? '50vh' : '60vh' })
      })
      if (hint) hint.style.display = 'none'
      jwrap.style.height = ''
    }

    /* Anchor nav into a pinned panel: convert its horizontal offset into the
     * vertical scroll that shows it. Without this, in-journey links do nothing. */
    navTo.current = (id: string) => {
      const el = root.querySelector<HTMLElement>(`#${id}`)
      if (!el) return
      const panel = el.closest('[data-panel]') as HTMLElement | null
      const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth'
      if (panel && track && !mobile && !reduced && journeyMaster.current) {
        /* Map the panel's horizontal offset onto the pin's scroll range. */
        const { master } = journeyMaster.current
        const maxX = Math.max(1, track.scrollWidth - window.innerWidth)
        const frac = Math.min(panel.offsetLeft, maxX) / maxX
        window.scrollTo({ top: master.start + frac * (master.end - master.start), behavior })
      } else if (panel && mobile) {
        track!.scrollTo({ left: panel.offsetLeft, behavior })
        el.scrollIntoView({ behavior, block: 'center' })
      } else {
        el.scrollIntoView({ behavior, block: 'start' })
      }
    }

    const revealMask = (n: HTMLElement | null, delay = 0) => {
      if (!n || shown.has(n)) return
      shown.add(n)
      n.style.transition = `transform 0.95s cubic-bezier(0.22,1,0.36,1) ${delay}s`
      n.style.transform = 'translateY(0)'
    }
    const revealFade = (n: HTMLElement) => {
      if (shown.has(n)) return
      shown.add(n)
      n.style.transition = 'transform 0.95s cubic-bezier(0.22,1,0.36,1) 0.15s, opacity 0.8s ease 0.15s'
      n.style.transform = 'translateY(0)'; n.style.opacity = '1'
    }
    const settle = () => {
      if (pre) pre.style.display = 'none'
      masks.forEach((m) => (m.style.transform = 'translateY(0)'))
      fades.forEach((f) => { f.style.opacity = '1'; f.style.transform = 'none' })
      wins.forEach((w) => (w.style.transform = 'none'))
      if (stackUnder) { stackUnder.style.position = 'relative'; stackUnder.style.transform = 'none'; stackUnder.style.opacity = '1' }
    }

    const preload = () => {
      if (!pre) return
      const hole = q<HTMLElement>('[data-preloader-hole]')
      /* Open to the pill immediately; the CSS transition does the expansion. */
      requestAnimationFrame(() => {
        if (!hole) return
        hole.style.setProperty('--hole-w', 'min(340px, 62vw)')
        hole.style.setProperty('--hole-h', '92px')
      })
      let finished = false
      const finish = () => {
        if (finished) return
        finished = true
        if (preNum) preNum.textContent = '100'
        pre.classList.add('is-out')
        /* Blow the aperture past both axes; 260vmax clears any viewport. */
        if (hole) {
          hole.style.setProperty('--hole-w', '260vmax')
          hole.style.setProperty('--hole-h', '260vmax')
        }
        revealMask(heroTitle, 0.2); revealMask(heroSub, 0.42)
        /* Removed from the DOM entirely so it can never trap a tap. */
        window.setTimeout(() => { pre.style.display = 'none' }, 1100)
      }
      /* rAF is PAUSED in a hidden tab, so a page opened in the background —
       * or rendered by a crawler or screenshot service — would sit behind the
       * curtain at 0 forever. Timers still run when hidden, so this guarantees
       * the curtain always leaves. */
      window.setTimeout(finish, CFG.preload.maxDuration)
      /* If the tab is already hidden there is nobody to watch the count, and
       * rAF will not run to produce it — so resolve straight away and let the
       * page be correct whenever it is revealed or captured. */
      if (document.visibilityState === 'hidden') {
        window.setTimeout(finish, 250)
        return
      }
      /* Count only images actually loading now: the lazy ones live off-screen
       * inside the track and never fire `load` while the curtain is up, which
       * pinned the counter at 60 until the 6s bail-out. */
      const imgs = Array.from(root.querySelectorAll('img')).filter((im) => im.complete || im.loading !== 'lazy')
      let loaded = 0
      imgs.forEach((im) => {
        if (im.complete) { loaded++; return }
        const bump = () => loaded++
        im.addEventListener('load', bump, { once: true })
        im.addEventListener('error', bump, { once: true })
      })
      const t0 = performance.now()
      let val = 0
      const step = (now: number) => {
        const el = now - t0
        const real = imgs.length ? loaded / imgs.length : 1
        val = Math.max(val, Math.min(real, el / CFG.preload.minDuration) * 100)
        if (preNum) preNum.textContent = String(Math.round(val))
        if (val < 99.5 && el < CFG.preload.maxDuration) requestAnimationFrame(step)
        else { if (preNum) preNum.textContent = '100'; window.setTimeout(finish, CFG.preload.holdAtFull) }
      }
      requestAnimationFrame(step)
    }

    const frame = () => {
      /* ---- READ ---- */
      const y = window.scrollY
      const heroP = clamp01(y / vh)
      const winReads = wins.map((n) => ({ n, r: (n.parentElement as HTMLElement).getBoundingClientRect() }))
      const overTop = stackOver ? stackOver.getBoundingClientRect().top : Infinity
      const underTop = stackUnder ? stackUnder.getBoundingClientRect().top : Infinity
      const underBottom = stackUnder ? stackUnder.getBoundingClientRect().bottom : -Infinity
      const overBottom = stackOver ? stackOver.getBoundingClientRect().bottom : -Infinity
      const scrollLeft = mobile && track ? track.scrollLeft : 0
      const railMax = mobile && track ? Math.max(1, track.scrollWidth - track.clientWidth) : 1

      /* ---- WRITE ---- */
      if (heroImg) heroImg.style.transform = `translate3d(0, ${(heroP * CFG.drift.slab * CFG.drift.heroFactor).toFixed(2)}%, 0)`

      /* The desktop track and the progress bar are driven by ScrollTrigger
       * below — this loop must not also write them. */
      if (prog && mobile) {
        prog.style.transform = `scaleX(${(scrollLeft / railMax).toFixed(4)})`
      }

      for (const { n, r } of winReads) {
        if (n === heroImg) continue
        if (r.right < -60 || r.left > vw + 60) continue
        const p = ((r.left + r.width / 2) / vw - 0.5) * 2
        n.style.transform = `translate3d(${(-p * (Number(n.dataset.win) || CFG.drift.fig)).toFixed(2)}%, 0, 0)`
      }

      /* Self-theming chrome. The header's yellow CTA vanished over the yellow
       * booking section (yellow on yellow). Rather than add a scroll listener,
       * decide it here: if either light section covers the header band, the
       * chrome goes dark-on-light. */
      const HEADER_Y = 40
      const lightUnderChrome =
        (underTop <= HEADER_Y && underBottom >= HEADER_Y) || (overTop <= HEADER_Y && overBottom >= HEADER_Y)
      const want = overTop <= HEADER_Y && overBottom >= HEADER_Y ? 'yellow' : lightUnderChrome ? 'cream' : 'dark'
      if (themeRoot.dataset.chrome !== want) themeRoot.dataset.chrome = want

      if (stackUnder && overTop !== Infinity) {
        const cover = clamp01(1 - overTop / vh)
        stackUnder.style.transform = `scale(${(1 - cover * (1 - CFG.stack.scale)).toFixed(4)})`
        stackUnder.style.opacity = (1 - cover * (1 - CFG.stack.fadeTo)).toFixed(3)
      }
      raf = requestAnimationFrame(frame)
    }

    /* The map stays inert until asked for, so it cannot capture the wheel
     * while the pinned journey is running. */
    const mapWrap = q<HTMLElement>('.na-map')
    const mapEnable = q<HTMLElement>('[data-map-enable]')
    const onEnableMap = () => mapWrap?.classList.add('is-live')
    mapEnable?.addEventListener('click', onEnableMap)

    layout()
    window.addEventListener('resize', layout)
    if (reduced) { settle(); return () => window.removeEventListener('resize', layout) }
    preload()
    raf = requestAnimationFrame(frame)

    /* ── The journey, on ScrollTrigger (the Búðir mechanism) ─────────────
     * A TWEEN, never a timeline: containerAnimation requires one, and a
     * timeline here is the classic frozen-at-x=0 bug. Every panel's own
     * content then gets a trigger fed by that same tween, so copy and images
     * animate as they cross the viewport horizontally rather than firing on
     * a hand-rolled threshold. */
    const mm = gsap.matchMedia()
    mm.add(CFG.journeyQuery, () => {
      if (!track || !jwrap) return
      const maxX = () => Math.max(1, track.scrollWidth - window.innerWidth)
      const tween = gsap.to(track, { x: () => -maxX(), ease: 'none', force3D: true })
      const master = ScrollTrigger.create({
        animation: tween,
        trigger: jwrap,
        pin: jwrap,
        scrub: 1,
        start: 'top top',
        end: () => '+=' + maxX(),
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => { if (prog) prog.style.transform = `scaleX(${self.progress.toFixed(4)})` },
      })
      journeyMaster.current = { master, track, tween }

      const trig = (el: HTMLElement, fire: () => void) =>
        ScrollTrigger.create(
          track.contains(el)
            ? { trigger: el, containerAnimation: tween, start: 'left 86%', once: true, onEnter: fire }
            : { trigger: el, start: 'top 88%', once: true, onEnter: fire },
        )
      masks.forEach((m) => { if (m !== heroTitle && m !== heroSub) trig(m, () => revealMask(m)) })
      fades.forEach((f) => trig(f, () => revealFade(f)))

      /* Measure only after real layout, or the traverse is computed against a
       * collapsed track and the pin ends in the wrong place. */
      document.fonts.ready.then(() => ScrollTrigger.refresh())
      const imgs = Array.from(track.querySelectorAll('img'))
      let left = imgs.filter((i) => !i.complete).length
      imgs.forEach((i) => {
        if (i.complete) return
        const done = () => { if (--left === 0) ScrollTrigger.refresh() }
        i.addEventListener('load', done, { once: true })
        i.addEventListener('error', done, { once: true })
      })
      return () => { journeyMaster.current = null; master.kill(); tween.kill() }
    })

    /* Below the journey breakpoint there is no pin, so the same reveals run
     * off ordinary vertical triggers. */
    mm.add(CFG.railQuery, () => {
      const all = [...masks, ...fades]
      const trigs = all.map((el) =>
        ScrollTrigger.create({
          trigger: el, start: 'top 92%', once: true,
          onEnter: () => (masks.includes(el) ? revealMask(el) : revealFade(el)),
        }),
      )
      return () => trigs.forEach((t) => t.kill())
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', layout)
      mapEnable?.removeEventListener('click', onEnableMap)
      mm.revert()
    }
  }, [])

  const panelBase: CSSProperties = {
    flex: '0 0 auto', width: '100vw', height: '100%',
    padding: '0 max(28px, calc((100vw - 1180px) / 2))', boxSizing: 'border-box',
  }
  const NAVS: { id: string; label: L }[] = [
    { id: 'supan', label: C.navSupan }, { id: 'matsedill', label: C.navMatsedill }, { id: 'sagan', label: C.navSagan },
    { id: 'umsagnir', label: C.navUmsagnir }, { id: 'opid', label: C.navOpid }, { id: 'stadsetning', label: C.navStadur },
  ]

  const field = (key: keyof Draft, label: L, opts?: { area?: boolean; req?: boolean; half?: boolean }) => (
    <div style={{ gridColumn: opts?.half ? 'span 1' : '1 / -1' }}>
      <label htmlFor={`na-${key}`} style={{ display: 'block', fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(18,23,27,0.62)', marginBottom: 7 }}>
        {T(label)}
      </label>
      {opts?.area ? (
        <textarea id={`na-${key}`} rows={3} value={draft[key]} onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))} className="na-input" />
      ) : (
        <input id={`na-${key}`} type="text" required={opts?.req} value={draft[key]} onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))} className="na-input" />
      )}
    </div>
  )

  return (
    <div ref={rootRef} style={{ background: INK, color: BONE, fontFamily: SANS }}>
      <style>{`
        #na-root ::selection { background:${YELLOW}; color:${INK}; }

        /* ── The map band ────────────────────────────────────────────── */
        #na-root .na-map { position:relative; height:clamp(420px,72svh,780px); overflow:hidden; background:${INK_2}; }
        #na-root .na-map-frame {
          position:absolute; inset:0; width:100%; height:100%; border:0;
          filter:grayscale(1) contrast(1.15) brightness(.62);
          pointer-events:none;   /* the map must not eat the page's scroll */
        }
        #na-root .na-map.is-live .na-map-frame { pointer-events:auto; }
        #na-root .na-map.is-live .na-map-enable,
        #na-root .na-map.is-live .na-map-mark { opacity:0; pointer-events:none; }
        /* Duotone: push the greyscale toward the page's ink + yellow. */
        #na-root .na-map-tone {
          position:absolute; inset:0; pointer-events:none;
          background:linear-gradient(180deg, rgba(18,23,27,.34), rgba(18,23,27,.52)),
                     radial-gradient(120% 90% at 50% 46%, rgba(227,184,31,.20), transparent 62%);
          mix-blend-mode:screen; opacity:.9;
        }
        /* Feather the rectangle away so it reads as a plate, not an iframe. */
        #na-root .na-map-vignette {
          position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(115% 85% at 50% 50%, transparent 52%, ${INK} 100%);
        }
        #na-root .na-map-mark {
          position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
          width:0; height:0; transition:opacity .4s ease;
        }
        #na-root .na-map-ring {
          position:absolute; top:50%; left:50%; width:54px; height:54px; margin:-27px 0 0 -27px;
          border:1px solid ${YELLOW}; border-radius:999px; opacity:.85;
        }
        #na-root .na-map-ring-2 { width:96px; height:96px; margin:-48px 0 0 -48px; opacity:.32; }
        #na-root .na-map-dot {
          position:absolute; top:50%; left:50%; width:9px; height:9px; margin:-4.5px 0 0 -4.5px;
          background:${YELLOW}; border-radius:999px;
        }
        @media (prefers-reduced-motion: no-preference) {
          #na-root .na-map-ring-2 { animation:na-ping 3.4s ease-out infinite; }
          @keyframes na-ping { 0% { transform:scale(.62); opacity:.5 } 70%,100% { transform:scale(1.18); opacity:0 } }
        }
        #na-root .na-map-corner {
          position:absolute; width:30px; height:30px; pointer-events:none;
          border-color:rgba(227,184,31,.5); border-style:solid; border-width:0;
        }
        #na-root .na-map-tl { top:24px; left:24px; border-top-width:1px; border-left-width:1px; }
        #na-root .na-map-tr { top:24px; right:24px; border-top-width:1px; border-right-width:1px; }
        #na-root .na-map-bl { bottom:24px; left:24px; border-bottom-width:1px; border-left-width:1px; }
        #na-root .na-map-br { bottom:24px; right:24px; border-bottom-width:1px; border-right-width:1px; }
        #na-root .na-map-enable {
          position:absolute; top:50%; left:50%; transform:translate(-50%, 74px);
          font-family:${MONO}; font-size:10.5px; letter-spacing:.16em; text-transform:uppercase;
          color:${BONE}; background:rgba(18,23,27,.72); border:1px solid rgba(216,222,221,.3);
          padding:10px 18px; border-radius:999px; cursor:pointer; transition:opacity .3s ease, border-color .3s ease;
        }
        #na-root .na-map-enable:hover { border-color:${YELLOW}; color:${YELLOW}; }
        #na-root .na-map-plate {
          position:absolute; left:clamp(20px,4vw,52px); bottom:clamp(20px,4vw,52px);
          background:${INK}; padding:22px 26px; max-width:min(360px, calc(100% - 40px));
          box-shadow:inset 0 0 0 1px rgba(227,184,31,.28);
        }
        @media (max-width:560px) {
          #na-root .na-map-plate { left:16px; right:16px; bottom:16px; max-width:none; padding:18px 18px; }
          #na-root .na-map-corner { display:none; }
        }

        /* ── The aperture loader ─────────────────────────────────────────
           .na-hole is transparent with a 100vmax ink shadow, so it reads as a
           pill-shaped window cut out of a full-screen sheet. Enter expands it
           to the pill; exit expands it past the viewport and the page is
           simply there. Easings are ERNA's: in-out-quint in, in-out-quart out. */
        #na-root .na-loader { position:fixed; inset:0; z-index:60; pointer-events:auto; }
        #na-root .na-hole {
          position:fixed; top:44%; left:50%;
          width:var(--hole-w, 0px); height:var(--hole-h, 0px);
          transform:translate(-50%,-50%); border-radius:999px;
          box-shadow:0 0 0 100vmax ${INK};
          transition:width 1.4s cubic-bezier(.83,0,.17,1) .12s,
                     height 1.4s cubic-bezier(.83,0,.17,1) .12s;
        }
        #na-root .na-loader.is-out .na-hole {
          transition:width .8s cubic-bezier(.76,0,.24,1), height .8s cubic-bezier(.76,0,.24,1);
        }
        #na-root .na-loader-text {
          position:fixed; top:calc(44% + 96px); left:0; right:0; text-align:center;
          transition:opacity .5s ease, transform .7s cubic-bezier(.64,0,.78,0);
        }
        #na-root .na-loader.is-out .na-loader-text { opacity:0; transform:translateY(-26px); }
        /* With no scripting the loader can never resolve, so it must not exist. */
        @media (scripting: none) { #na-root .na-loader { display:none; } }
        @media (prefers-reduced-motion: reduce) { #na-root .na-loader { display:none; } }
        #na-root a { color:inherit; }
        #na-root :focus-visible { outline:2px solid ${YELLOW}; outline-offset:2px; }
        #na-root .na-mask { transform:translateY(112%); will-change:transform; }
        #na-root .na-fade { opacity:0; transform:translateY(14px); will-change:transform,opacity; }
        #na-root .na-win { will-change:transform; }
        #na-root .na-cta { transition:opacity .25s ease, background-color .35s ease, color .35s ease; }
        /* Over the cream and yellow sections the header inverts: an ink pill
           with yellow text reads on both, and the blend-mode items are dropped
           in favour of plain ink so nothing washes out. */
        #na-root[data-chrome="cream"] .na-headcta,
        #na-root[data-chrome="yellow"] .na-headcta { background:${INK} !important; color:${YELLOW} !important; }
        #na-root[data-chrome="cream"] .na-blend,
        #na-root[data-chrome="yellow"] .na-blend { mix-blend-mode:normal !important; color:${INK} !important; }
        #na-root[data-chrome="cream"] .na-langtoggle,
        #na-root[data-chrome="yellow"] .na-langtoggle { background:transparent !important; border-color:${HAIR_INK} !important; }
        #na-root[data-chrome="cream"] .na-navlink::after,
        #na-root[data-chrome="yellow"] .na-navlink::after { background:${INK}; }
        /* Over a light ground the nav is ink on ink whenever a display heading
           passes beneath it, so the header carries a matching backdrop there.
           The hero needs none — it has its own scrim. */
        #na-root .na-header::before {
          content:''; position:absolute; inset:0; pointer-events:none; opacity:0;
          transition:opacity .35s ease; backdrop-filter:blur(7px); -webkit-backdrop-filter:blur(7px);
          -webkit-mask-image:linear-gradient(to bottom, #000 62%, transparent);
          mask-image:linear-gradient(to bottom, #000 62%, transparent);
        }
        #na-root[data-chrome="cream"] .na-header::before { opacity:1; background:rgba(247,242,232,.82); }
        #na-root[data-chrome="yellow"] .na-header::before { opacity:1; background:rgba(227,184,31,.82); }
        #na-root .na-cta:hover { opacity:.88; }
        #na-root .na-navlink { position:relative; background:none; border:0; cursor:pointer; padding:6px 0; }
        #na-root .na-navlink::after { content:''; position:absolute; left:0; right:100%; bottom:0; height:1px; background:${YELLOW}; transition:right .3s cubic-bezier(0.22,1,0.36,1); }
        #na-root .na-navlink:hover::after { right:0; }
        #na-root .na-track::-webkit-scrollbar { display:none; }
        #na-root .na-track { scrollbar-width:none; }
        #na-root .na-input {
          width:100%; min-height:46px; padding:12px 14px; box-sizing:border-box;
          font-family:${SANS}; font-size:16px; color:${INK};
          background:rgba(255,255,255,0.55); border:1px solid ${HAIR_INK}; border-radius:0;
          transition:border-color .2s ease, background-color .2s ease;
        }
        #na-root .na-input:focus { outline:none; border-color:${INK}; background:#fff; }
        #na-root .na-dot { width:26px; height:2px; border:0; padding:0; cursor:pointer; background:rgba(216,222,221,0.25); transition:background-color .3s ease; }
        #na-root .na-dot[aria-current="true"] { background:${YELLOW}; }
        @media (prefers-reduced-motion:reduce) {
          #na-root .na-mask { transform:none !important; }
          #na-root .na-fade { opacity:1 !important; transform:none !important; }
          #na-root .na-win { transform:none !important; position:absolute; inset:0 !important; width:100% !important; height:100% !important; }
          #na-root .na-qtrack { transition:none !important; }
        }
        @media (max-width:700px) {
          #na-root .na-hide-sm { display:none !important; }
        }
      `}</style>

      <div id="na-root">
        <PreviewChrome company={company} />

        {/* ── Loader: the ERNA aperture, re-cut as a pill.
             The hole is a real hole — a transparent pill with a 100vmax ink
             box-shadow around it — so it is a WINDOW onto the page beneath.
             That is the whole concept of this design ("Gluggar"), and it
             avoids the mask-composite fragility of a two-layer mask. */}
        <div data-preloader className="na-loader">
          <div className="na-hole" data-preloader-hole />
          <div className="na-loader-text">
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: BONE_MUTE }}>{T(C.preKicker)}</div>
            <div data-preloader-count style={{ fontFamily: SERIF, fontSize: 64, color: YELLOW, lineHeight: 1, marginTop: 10 }}>0</div>
          </div>
        </div>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <header className="na-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '18px 28px', isolation: 'isolate' }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="na-blend" style={{ position: 'relative', fontFamily: SERIF, fontStyle: 'italic', fontSize: 26, color: BONE, mixBlendMode: 'difference', background: 'none', border: 0, padding: 0, cursor: 'pointer' }}>
            Naustið
          </button>

          <nav aria-label="Aðalvalmynd" className="na-hide-sm na-blend" style={{ display: 'flex', gap: 22, mixBlendMode: 'difference' }}>
            {NAVS.map((n) => (
              <button key={n.id} className="na-navlink na-blend" onClick={() => navTo.current(n.id)} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: BONE }}>
                {T(n.label)}
              </button>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setLang((l) => (l === 'is' ? 'en' : 'is'))}
              aria-label={lang === 'is' ? 'Switch to English' : 'Skipta yfir á íslensku'}
              className="na-blend na-langtoggle"
              style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', background: 'rgba(18,23,27,0.25)', border: '1px solid rgba(216,222,221,0.45)', color: BONE, mixBlendMode: 'difference', padding: '8px 14px', borderRadius: 999, cursor: 'pointer', minHeight: 34 }}
            >
              {lang === 'is' ? 'EN' : 'ÍS'}
            </button>
            <button onClick={() => navTo.current('bordapontun')} className="na-cta na-headcta" style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: YELLOW, color: INK, padding: '10px 18px', borderRadius: 999, border: 0, cursor: 'pointer' }}>
              {T(C.book)}
            </button>
          </div>
        </header>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section style={{ position: 'relative', height: '100svh', overflow: 'hidden', background: INK }}>
          <div data-hero-img style={{ position: 'absolute', ...windowBox(CFG.drift.slab * CFG.drift.heroFactor, 'y') }}>
            <picture>
              <source type="image/webp" srcSet={IMG.exteriorWebp} sizes="100vw" />
              <img src={IMG.exterior} sizes="100vw" alt="Gula timburhúsið Sel á Ásgarðsvegi 1 á Húsavík, heimili Naustsins" loading="eager" decoding="async" {...{ fetchpriority: 'high' }} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', objectPosition: '58% 42%' }} />
            </picture>
          </div>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(18,23,27,0.95), rgba(18,23,27,0.82) 26%, rgba(18,23,27,0.34) 58%, rgba(18,23,27,0.12) 76%, rgba(18,23,27,0.34))' }} />
          <div style={{ position: 'absolute', left: 28, right: 28, bottom: 38 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: YELLOW, marginBottom: 10 }}>{T(C.heroKicker)}</div>
            <div style={{ overflow: 'hidden', paddingBottom: '0.22em' }}>
              <h1 data-hero-title className="na-mask" style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(64px,13vw,180px)', lineHeight: 1, color: CREAM }}>Naustið</h1>
            </div>
            <div style={{ overflow: 'hidden', paddingBottom: '0.22em' }}>
              <p data-hero-sub className="na-mask" style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.55, color: 'rgba(216,222,221,0.78)', maxWidth: '52ch', margin: '10px 0 0' }}>{T(C.heroSub)}</p>
            </div>
          </div>
          <div style={{ position: 'absolute', right: 28, bottom: 42, fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: BONE_MUTE }}>{T(C.scrollHint)}</div>
        </section>

        {/* ── The pinned horizontal journey — five panels ──────────────── */}
        <div data-journey style={{ position: 'relative' }}>
          <div data-journey-view style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: INK }}>
            <div data-swipe-hint style={{ display: 'none', position: 'absolute', top: 76, left: 28, zIndex: 5, fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: YELLOW }}>{T(C.swipeHint)}</div>

            <div data-track className="na-track" style={{ display: 'flex', height: '100%', alignItems: 'stretch', willChange: 'transform' }}>
              <section id="supan" data-panel data-cols style={{ ...panelBase, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
                <div>
                  <Kick>{T(C.k1)}</Kick>
                  <Mask style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(44px,4.8vw,74px)', lineHeight: 1.04, color: CREAM, margin: '14px 0 0' }}>
                    <h2 style={{ margin: 0, font: 'inherit', color: 'inherit' }}>{T(C.soupH)}</h2>
                  </Mask>
                  <p className="na-fade" style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.6, color: BONE_SOFT, maxWidth: '38ch', margin: '16px 0 0' }}>{T(C.soupBody)}</p>
                </div>
                <figure style={{ margin: 0, height: '60vh', overflow: 'hidden', position: 'relative', background: SLAB }}>
                  <Win src={IMG.soup} webp={IMG.soupWebp} sizes="(max-width:1024px) 90vw, 46vw" alt="Fiskisúpa Naustsins með nýbökuðu brauði" drift={CFG.drift.fig} />
                </figure>
              </section>

              {/* A PLATE, not a slab. The source is 1080x1350; stretched across
                  a 100vw bleed it was being upscaled and cropped to nothing.
                  Held at its native 4:5 and height-capped, the largest it ever
                  renders is ~496 CSS px — 992px at 2x, still inside the file.
                  The panel stays full bleed; the photograph does not. */}
              <section data-panel style={{ ...panelBase, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(28px,4vw,64px)' }}>
                <figure style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'clamp(24px,3.5vw,56px)', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <div
                    style={{
                      position: 'relative', overflow: 'hidden', background: SLAB,
                      /* Sized against the REAL constraint. The drift wrapper is
                         28.8% wider than its frame (overhang = drift x 1.6, both
                         sides), so a 419px frame already asks for 1080 device px
                         at 2x — exactly the source width. Anything larger
                         upscales, which is what made this look soft. */
                      height: 'min(58vh, 520px)', aspectRatio: '4 / 5', flex: '0 0 auto',
                    }}
                  >
                    <Win
                      src={IMG.salmon}
                      webp={IMG.salmonWebp}
                      sizes="(max-width:700px) 78vw, 536px"
                      alt="Grillaður lax af matseðli Naustsins"
                      drift={CFG.drift.fig}
                      objectPosition="50% 45%"
                    />
                  </div>
                  <figcaption style={{ maxWidth: '26ch' }}>
                    <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: YELLOW }}>{T(C.slab2)}</div>
                    <div aria-hidden style={{ height: 4, backgroundImage: TICK, margin: '16px 0' }} />
                    <p className="na-fade" style={{ fontFamily: SANS, fontSize: 15.5, lineHeight: 1.65, color: BONE_SOFT, margin: 0 }}>
                      {T(C.plateNote)}
                    </p>
                  </figcaption>
                </figure>
              </section>

              {/* A genuine full-bleed slab: 3264x2448 at source, so at 2200 it
                  still clears a 2x 1100px band without upscaling. Their own
                  sign, the flower-planted bathtub and the red van — the most
                  characterful photograph of the place that exists online. */}
              <section data-panel="slab" style={{ flex: '0 0 auto', width: '100vw', height: '100%', position: 'relative', overflow: 'hidden', background: SLAB }}>
                <Win
                  src={IMG.gardur}
                  webp={IMG.gardurWebp}
                  sizes="142vw"
                  alt="Skilti Naustsins í garðinum, blóm í gömlu baðkari og rauður sendibíll við gula húsið"
                  drift={CFG.drift.slab}
                  objectPosition="50% 58%"
                />
                <div style={{ position: 'absolute', left: 28, bottom: 28, background: INK, padding: '10px 16px' }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: YELLOW }}>{T(C.slabGardur)}</span>
                </div>
              </section>

              <section id="matsedill" data-panel style={{ ...panelBase, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Kick>{T(C.k2)}</Kick>
                <Mask style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(40px,4.4vw,64px)', lineHeight: 1.04, color: CREAM, margin: '12px 0 0' }}>
                  <h2 style={{ margin: 0, font: 'inherit', color: 'inherit' }}>{T(C.menuH)}</h2>
                </Mask>
                <div className="na-fade" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.25fr) minmax(0,0.85fr)', gap: 40, marginTop: 22 }}>
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: YELLOW, marginBottom: 4 }}>{T(C.menuSea)}</div>
                    {SEA.map((d, i) => (
                      <div key={d.name.is}>
                        {i > 0 && <div aria-hidden style={{ height: 4, backgroundImage: TICK }} />}
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 18, padding: '9px 0' }}>
                          <span style={{ fontFamily: SERIF, fontSize: 24, color: CREAM, lineHeight: 1.1 }}>{T(d.name)}</span>
                          <span style={{ fontFamily: SANS, fontSize: 13, color: 'rgba(216,222,221,0.55)', textAlign: 'right', maxWidth: '22ch' }}>{T(d.note)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: YELLOW, marginBottom: 4 }}>{T(C.menuEnd)}</div>
                    {END.map((d, i) => (
                      <div key={d.name.is}>
                        {i > 0 && <div aria-hidden style={{ height: 4, backgroundImage: TICK }} />}
                        <div style={{ padding: '9px 0' }}>
                          <div style={{ fontFamily: SERIF, fontSize: 24, color: CREAM, lineHeight: 1.1 }}>{T(d.name)}</div>
                          <div style={{ fontFamily: SANS, fontSize: 13, color: 'rgba(216,222,221,0.55)', marginTop: 2 }}>{T(d.note)}</div>
                        </div>
                      </div>
                    ))}
                    <p style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.6, color: BONE_MUTE, margin: '18px 0 0' }}>{T(C.menuNote)}</p>
                  </div>
                </div>
              </section>

              <section id="sagan" data-panel data-cols style={{ ...panelBase, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
                <figure style={{ margin: 0, height: '58vh', overflow: 'hidden', position: 'relative', background: SLAB }}>
                  <Win src={IMG.interior} webp={IMG.interiorWebp} sizes="(max-width:1024px) 90vw, 46vw" alt="Matsalur Naustsins í Seli" drift={CFG.drift.fig} />
                </figure>
                <div>
                  <Kick>{T(C.k3)}</Kick>
                  <Mask style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(40px,4.4vw,68px)', lineHeight: 1.06, color: CREAM, margin: '14px 0 0' }}>
                    <h2 style={{ margin: 0, font: 'inherit', color: 'inherit' }}>{T(C.storyH)}</h2>
                  </Mask>
                  <p className="na-fade" style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.6, color: BONE_SOFT, maxWidth: '38ch', margin: '16px 0 0' }}>{T(C.storyBody)}</p>
                  <div className="na-fade" style={{ display: 'flex', gap: 26, marginTop: 26, flexWrap: 'wrap' }}>
                    {[['2008', lang === 'is' ? 'hugmyndin' : 'the idea'], ['2016', lang === 'is' ? 'flutt í Sel' : 'moved into Sel'], ['1931', lang === 'is' ? 'húsið byggt' : 'house built']].map(([yr, lab]) => (
                      <div key={yr}>
                        <div style={{ fontFamily: SERIF, fontSize: 30, color: YELLOW, lineHeight: 1 }}>{yr}</div>
                        <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: BONE_MUTE, marginTop: 5 }}>{lab}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: 'rgba(216,222,221,0.15)' }}>
              <div data-progress style={{ height: '100%', background: YELLOW, transform: 'scaleX(0)', transformOrigin: 'left', willChange: 'transform' }} />
            </div>
          </div>
        </div>

        {/* ── Umsagnir — its own section, auto-advancing ────────────────── */}
        <section
          id="umsagnir"
          style={{ background: INK_2, padding: 'clamp(90px,11vw,150px) 28px' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div style={{ maxWidth: 1180, margin: '0 auto' }}>
            <Kick>{T(C.revKicker)}</Kick>
            <Mask style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(38px,5vw,72px)', lineHeight: 1.04, color: CREAM, margin: '14px 0 0' }}>
              <h2 style={{ margin: 0, font: 'inherit', color: 'inherit' }}>{T(C.revH)}</h2>
            </Mask>

            {/* Ratings, as each platform publishes them. */}
            <div className="na-fade" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 24, margin: '40px 0 0', borderTop: '1px solid rgba(216,222,221,0.14)', paddingTop: 24 }}>
              {RATINGS.map((r) => (
                <div key={r.label.is}>
                  <div style={{ fontFamily: SERIF, fontSize: 'clamp(34px,4vw,52px)', lineHeight: 1, color: YELLOW }}>{r.v}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: BONE_MUTE, marginTop: 8, lineHeight: 1.5 }}>{T(r.label)}</div>
                </div>
              ))}
            </div>

            {/* The carousel. One state change per interval, never per frame. */}
            <div style={{ marginTop: 56, overflow: 'hidden' }}>
              <div className="na-qtrack" style={{ display: 'flex', transform: `translateX(-${qi * 100}%)`, transition: 'transform .9s cubic-bezier(0.22,1,0.36,1)' }}>
                {QUOTES.map((qq, i) => (
                  <figure key={qq.name} aria-hidden={i !== qi} style={{ flex: '0 0 100%', margin: 0, paddingRight: 40, boxSizing: 'border-box' }}>
                    <blockquote style={{ margin: 0, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(24px,3.2vw,46px)', lineHeight: 1.22, color: CREAM, maxWidth: '30ch' }}>
                      {T(qq.text)}
                    </blockquote>
                    <figcaption style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: BONE_MUTE, marginTop: 20 }}>
                      {qq.name} · {T(qq.src)}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 34 }}>
              {QUOTES.map((qq, i) => (
                <button key={qq.name} className="na-dot" aria-current={i === qi} aria-label={`${T(C.revNext)} ${i + 1}`} onClick={() => setQi(i)} />
              ))}
              <p style={{ fontFamily: SANS, fontSize: 12, color: BONE_MUTE, margin: '0 0 0 20px', maxWidth: '52ch' }}>{T(C.revNote)}</p>
            </div>
          </div>
        </section>

        {/* ── Sticky stack: hours (cream) then booking (yellow) ─────────── */}
        <div style={{ position: 'relative' }}>
          <section id="opid" data-stack-under style={{ position: 'sticky', top: 0, minHeight: '100vh', background: CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 28px', boxSizing: 'border-box', willChange: 'transform,opacity' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: YELLOW_INK }}>{T(C.openKicker)}</div>
            {/* Verified against ja.is, the national directory. */}
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(60px,9vw,130px)', lineHeight: 1, color: INK, marginTop: 14 }}>11:30–21:30</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, border: `1px solid ${HAIR_INK}`, borderRadius: 999, padding: '7px 15px', marginTop: 20 }}>
              <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: open ? '#2E6F4E' : 'rgba(18,23,27,0.35)' }} />
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: open ? '#245C3F' : INK_SOFT }}>
                {open ? T(C.openNow) : T(C.closedNow)} · {open ? T(C.closesAt) : T(C.opensAt)}
              </span>
            </div>
            <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.6, color: INK_SOFT, maxWidth: '44ch', margin: '20px 0 0' }}>{T(C.openBody)}</p>
          </section>

          <section id="bordapontun" data-stack-over style={{ position: 'relative', zIndex: 2, minHeight: '100vh', background: YELLOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(70px,9vw,110px) 28px', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', maxWidth: 980 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: INK, opacity: 0.65 }}>{T(C.bookKicker)}</div>
                <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(46px,7vw,96px)', lineHeight: 1.02, color: INK, margin: '14px 0 14px' }}>{T(C.book)}</h2>
                <p style={{ fontFamily: SANS, fontSize: 16.5, lineHeight: 1.6, color: 'rgba(18,23,27,0.72)', maxWidth: '52ch', margin: '0 auto 30px' }}>{T(C.bookBody)}</p>
                <a href={PHONE_HREF} className="na-cta" style={{ display: 'inline-block', fontFamily: MONO, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: INK, color: YELLOW, padding: '18px 34px', borderRadius: 999, textDecoration: 'none' }}>
                  {PHONE}
                </a>
              </div>

              <div aria-hidden style={{ height: 4, backgroundImage: TICK_INK, margin: '46px 0 34px' }} />

              {sent ? (
                <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 34, color: INK, margin: 0 }}>{T(C.okH)}</h3>
                  <p style={{ fontFamily: SANS, fontSize: 15.5, color: 'rgba(18,23,27,0.72)', margin: '10px 0 22px' }}>{T(C.okBody)}</p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href={mailto} className="na-cta" style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: INK, color: YELLOW, padding: '15px 26px', borderRadius: 999, textDecoration: 'none' }}>{T(C.okMail)}</a>
                    <a href={PHONE_HREF} className="na-cta" style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', border: `1px solid ${INK}`, color: INK, padding: '15px 26px', borderRadius: 999, textDecoration: 'none' }}>{PHONE}</a>
                  </div>
                  <button onClick={() => { setSent(null); setDraft(EMPTY) }} style={{ marginTop: 18, background: 'none', border: 0, cursor: 'pointer', fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(18,23,27,0.7)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                    {T(C.okAgain)}
                  </button>
                </div>
              ) : (
                <form onSubmit={(e: FormEvent) => { e.preventDefault(); setSent({ ...draft }) }} style={{ maxWidth: 760, margin: '0 auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
                    {field('name', C.fName, { req: true, half: true })}
                    {field('contact', C.fContact, { req: true, half: true })}
                    {field('guests', C.fGuests, { half: true })}
                    {field('when', C.fWhen, { half: true })}
                    {field('message', C.fMessage, { area: true })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', marginTop: 22 }}>
                    <button type="submit" className="na-cta" style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: INK, color: YELLOW, padding: '16px 30px', borderRadius: 999, border: 0, cursor: 'pointer', minHeight: 50 }}>
                      {T(C.fSubmit)}
                    </button>
                    <p style={{ fontFamily: SANS, fontSize: 13, color: 'rgba(18,23,27,0.66)', margin: 0, maxWidth: '40ch' }}>{T(C.fNote)}</p>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>

        {/* ── Staðsetning ──────────────────────────────────────────────── */}
        <section id="stadsetning" style={{ background: INK, padding: 'clamp(90px,11vw,150px) 28px' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(40px,6vw,90px)', alignItems: 'start' }}>
            <div>
              <Kick>{T(C.findKicker)}</Kick>
              <Mask style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(38px,5vw,68px)', lineHeight: 1.04, color: CREAM, margin: '14px 0 0' }}>
                <h2 style={{ margin: 0, font: 'inherit', color: 'inherit' }}>{T(C.findH)}</h2>
              </Mask>
              <p className="na-fade" style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.65, color: BONE_SOFT, maxWidth: '46ch', margin: '20px 0 0' }}>{T(C.findBody)}</p>
            </div>

            <dl className="na-fade" style={{ margin: 0, display: 'grid', gap: 26 }}>
              {[
                { k: C.findAddr, v: <span style={{ fontFamily: SERIF, fontSize: 'clamp(26px,3vw,38px)', lineHeight: 1.15, color: CREAM }}>Ásgarðsvegur 1<br />640 Húsavík</span> },
                { k: C.findPhone, v: <a href={PHONE_HREF} style={{ fontFamily: SERIF, fontSize: 'clamp(24px,2.6vw,34px)', color: YELLOW, textDecoration: 'none' }}>{PHONE}</a> },
                { k: C.findMail, v: <a href={`mailto:${EMAIL}`} style={{ fontFamily: SANS, fontSize: 16, color: BONE_SOFT, textDecoration: 'underline', textUnderlineOffset: 3 }}>{EMAIL}</a> },
                { k: C.findPrice, v: <><span style={{ fontFamily: SERIF, fontSize: 'clamp(22px,2.4vw,30px)', color: CREAM }}>{T(C.findPriceV)}</span><span style={{ display: 'block', fontFamily: SANS, fontSize: 12.5, color: BONE_MUTE, marginTop: 6, maxWidth: '34ch' }}>{T(C.findPriceNote)}</span></> },
              ].map((row, i) => (
                <div key={i} style={{ borderTop: '1px solid rgba(216,222,221,0.14)', paddingTop: 14 }}>
                  <dt style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: BONE_MUTE }}>{T(row.k)}</dt>
                  <dd style={{ margin: '8px 0 0' }}>{row.v}</dd>
                </div>
              ))}
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="na-cta" style={{ justifySelf: 'start', fontFamily: MONO, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', border: `1px solid ${YELLOW}`, color: YELLOW, padding: '15px 26px', borderRadius: 999, textDecoration: 'none' }}>
                {T(C.findMaps)}
              </a>
            </dl>
          </div>
        </section>

        {/* ── The map, treated rather than embedded ───────────────────────
             A raw Google iframe imports Google's blues, greens, pins and UI —
             none of which belong in a two-colour palette. So: duotone it to
             ink, mark the place with our own ring instead of Google's pin,
             feather the edges into the ground, and label it with the real
             published coordinates. The iframe is pointer-events:none until
             asked for, so the map cannot swallow the page's scroll. */}
        <section id="kort" aria-label={T(C.mapLabel)} style={{ position: 'relative', background: INK }}>
          <div className="na-map">
            <iframe
              title={T(C.mapLabel)}
              src="https://www.google.com/maps?q=66.044389,-17.338611&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="na-map-frame"
              data-map-frame
            />
            <div aria-hidden className="na-map-tone" />
            <div aria-hidden className="na-map-vignette" />

            {/* Our own marker, not Google's pin. */}
            <div aria-hidden className="na-map-mark">
              <span className="na-map-ring" />
              <span className="na-map-ring na-map-ring-2" />
              <span className="na-map-dot" />
            </div>

            {/* Corner ticks — the corrugation motif, at plan-drawing scale. */}
            {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
              <span key={c} aria-hidden className={`na-map-corner na-map-${c}`} />
            ))}

            <button type="button" className="na-map-enable" data-map-enable>
              {T(C.mapEnable)}
            </button>

            <div className="na-map-plate">
              <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: YELLOW }}>{T(C.mapKicker)}</div>
              <div style={{ fontFamily: SERIF, fontSize: 'clamp(24px,3vw,40px)', color: CREAM, marginTop: 8, lineHeight: 1.08 }}>
                Ásgarðsvegur 1
                <br />
                640 Húsavík
              </div>
              {/* Published by Visit Húsavík; not derived or guessed. */}
              <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', color: BONE_MUTE, marginTop: 12 }}>
                66°02′39.8″N&nbsp;&nbsp;17°20′19.0″W
              </div>
              <div aria-hidden style={{ height: 4, backgroundImage: TICK, margin: '14px 0' }} />
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="na-cta" style={{ display: 'inline-block', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: YELLOW, color: INK, padding: '13px 22px', borderRadius: 999, textDecoration: 'none' }}>
                {T(C.findMaps)}
              </a>
            </div>
          </div>
        </section>

        <section style={{ background: INK_2, padding: '48px 28px' }}>
          <p style={{ margin: '0 auto', maxWidth: '78ch', textAlign: 'center', fontFamily: SANS, fontSize: 12.5, lineHeight: 1.7, color: BONE_MUTE }}>
            {DISCLAIMER}{' '}
            <a href={`mailto:${EMAIL}`} style={{ textDecoration: 'underline' }}>{EMAIL}</a> · {PHONE} · {ADDRESS}.
          </p>
        </section>

        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
