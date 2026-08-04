import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { ADDRESS, DISCLAIMER, EMAIL, IMG, PHONE, PHONE_HREF } from './data'

const company = getPreviewCompany('naustid')

/* ══════════════════════════════════════════════════════════════════════════
 * NAUSTIÐ — "Gluggar" (windows)
 *
 * Ported from the design handoff: vertical hero → pinned horizontal journey →
 * sticky-stack close, wrapped in one motion system.
 *
 *   1 · WINDOW DRIFT — no photograph moves WITH the page. Each sits in a
 *       fixed window with an oversized inner wrapper that translates as the
 *       window crosses the viewport.
 *   2 · TEXT MASKS   — display type rises out of an overflow mask; body copy
 *       gets a quieter fade-and-lift so the mask reads as emphasis.
 *   3 · THE JOURNEY  — six panels travel sideways past a pinned viewport.
 *
 * ONE requestAnimationFrame loop drives all of it, reading every measurement
 * before writing any transform. No second loop, no scroll listener, no
 * IntersectionObserver — the read-then-write discipline is the whole reason
 * this holds 60fps.
 *
 * ── CONTENT DIFFERS FROM THE PROTOTYPE, DELIBERATELY ───────────────────────
 * The handoff shipped placeholder copy. Everything here is the restaurant's
 * verified material instead:
 *   · hours are 11:30–21:30, not the prototype's 12:00–21:00
 *   · the menu rows are their real dishes; there is no "Humarsúpa" or
 *     "Fiskispjót" on their menu and neither was invented back in
 *   · the "recipe has been in the family from the start" line is gone — the
 *     verified story is two sisters-in-law who started around 2011
 *   · the pull quote is a real sourced review, not the prototype's stand-in
 *   · Slab II is the salmon, not a harbour: no harbour photograph exists in
 *     the restaurant's own set, and this design admits no stock imagery
 * ══════════════════════════════════════════════════════════════════════ */

const INK = '#12171B'
const SLAB = '#171E23'
const YELLOW = '#E3B81F'
const YELLOW_INK = '#9A7A0E'
const CREAM = '#F7F2E8'
const BONE = '#D8DEDD'
const BONE_SOFT = 'rgba(216,222,221,0.72)'
const BONE_MUTE = '#727F87'
const INK_SOFT = '#4E5A61'

/* Contrast against INK: yellow 9.57:1 · bone 13.24:1 · bone-soft 8.06:1 ·
 * bone-mute 5.21:1. Yellow-ink on cream 4.6:1. */

const CFG = {
  drift: { slab: 13, fig: 9, heroFactor: 0.8 },
  /* Overhang is DERIVED, never typed: the wrapper must exceed its window by
   * more than it travels or the image's own edge slides into frame. */
  overhangFactor: 1.6,
  scrubLerp: 0.08,
  mask: { triggerAt: 0.86 },
  fade: { triggerAt: 0.82 },
  stack: { scale: 0.94, fadeTo: 0.55 },
  preload: { minDuration: 900, maxDuration: 6000, holdAtFull: 140 },
  bp: { journey: 1024, narrow: 700 },
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/** The inline box a drifting image wrapper needs, derived from its drift. */
function windowBox(drift: number, axis: 'x' | 'y'): CSSProperties {
  const o = drift * CFG.overhangFactor
  const size = 100 + o * 2
  return axis === 'x'
    ? { left: `-${o.toFixed(1)}%`, width: `${size.toFixed(1)}%`, top: 0, height: '100%' }
    : { top: `-${o.toFixed(1)}%`, height: `${size.toFixed(1)}%`, left: 0, width: '100%' }
}

/* ══════════════════════════════════════════════════════════════════════════
 *  BILINGUAL CATALOGUE
 *  Two message catalogues rather than swapping DOM text, per the handoff's
 *  own porting note. Icelandic is the default; English is what most of
 *  Húsavík's summer trade actually reads.
 * ══════════════════════════════════════════════════════════════════════ */
type L = { is: string; en: string }
const t = (v: L, lang: 'is' | 'en') => v[lang]

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

  k1: { is: '01 · súpan', en: '01 · the soup' },
  soupH: { is: 'Fiskisúpan', en: 'The fish soup' },
  soupBody: {
    is: 'Rjómakennd fiskisúpa með tómat, full af fiski og skelfiski, borin fram með nýbökuðu brauði. Í umsögn eftir umsögn nefna gestir sömu skálina.',
    en: 'A creamy tomato fish soup, full of fish and shellfish, served with bread baked that morning. Review after review names the same bowl.',
  },
  soupCap: { is: 'Fiskisúpan · mynd staðarins', en: 'The fish soup · the restaurant’s own photo' },

  slab1: { is: 'Húsið · timbur, 1931 · bárujárn', en: 'The house · timber, 1931 · corrugated iron' },

  k2: { is: '02 · matseðill', en: '02 · the menu' },
  menuH: { is: 'Matseðill', en: 'The menu' },
  menuNote: {
    is: 'Sýnishorn. Matseðillinn breytist eftir árstíð og afla dagsins. Hringdu í 464 1520 til að heyra hvað er í boði.',
    en: 'A sample. The menu changes with the season and the day’s catch. Call 464 1520 to hear what is on.',
  },

  slab2: { is: 'Grillaður lax · af grillinu', en: 'Grilled salmon · off the grill' },

  k3: { is: '03 · sagan', en: '03 · the story' },
  storyH: { is: 'Tvær mágkonur, hús frá 1931', en: 'Two sisters-in-law, a house from 1931' },
  storyBody: {
    is: 'Hugmyndin kviknaði eftir hrunið 2008. Tvær mágkonur opnuðu lítinn stað við höfnina og fluttu árið 2016 í Sel, gult timburhús frá 1931. Húsinu var hlíft eins og hægt var svo sál þess fengi að halda sér.',
    en: 'The idea came after the 2008 crash. Two sisters-in-law opened a small place by the harbour, and in 2016 moved into Sel, a yellow timber house from 1931. The building was left as intact as possible so it kept its character.',
  },
  storyCap: { is: 'Matsalurinn í Seli · mynd staðarins', en: 'The dining room in Sel · the restaurant’s own photo' },

  k4: { is: '04 · umsagnir', en: '04 · reviews' },
  quote: {
    is: '„Best seafood restaurant in the country ❤“',
    en: '“Best seafood restaurant in the country ❤”',
  },
  quoteAttr: { is: 'Guðrún Ólafía · í gegnum Sluurpy', en: 'Guðrún Ólafía · via Sluurpy' },
  forward: { is: 'áfram — pantaðu borð ↓', en: 'keep scrolling — book a table ↓' },

  openKicker: { is: 'Opið alla daga', en: 'Open every day' },
  openBody: {
    is: 'Þegar ljós logar í glugganum á Ásgarðsvegi 1 er potturinn á hellunni.',
    en: 'When the light is on in the window at Ásgarðsvegur 1, the pot is on the stove.',
  },
  bookKicker: {
    is: 'Ekkert netbókunarkerfi · hringdu eða kíktu við',
    en: 'No online booking · call or drop in',
  },
} satisfies Record<string, L>

/* Their real dishes, taken from the verified menu. Five rows is what the
 * panel holds — a pinned panel cannot scroll, so anything taller than the
 * viewport would be unreachable rather than merely cropped. */
const DISHES: { name: L; note: L }[] = [
  { name: { is: 'Fiskisúpa', en: 'Fish soup' }, note: { is: 'rjómakennd með tómat', en: 'creamy, with tomato' } },
  { name: { is: 'Fiskur dagsins', en: 'Catch of the day' }, note: { is: 'aflinn ræður', en: 'whatever came in' } },
  { name: { is: 'Grillaður lax', en: 'Grilled salmon' }, note: { is: 'af grillinu, með salati', en: 'off the grill, with salad' } },
  { name: { is: 'Plokkfiskur', en: 'Fish stew' }, note: { is: 'borinn fram á rúgbrauði', en: 'served on rye bread' } },
  { name: { is: 'Rabarbaragrautur', en: 'Rhubarb compote' }, note: { is: 'heitur, með rjóma', en: 'warm, with cream' } },
]

const TICK = 'repeating-linear-gradient(90deg, rgba(216,222,221,0.3) 0 1px, transparent 1px 7px)'
const MONO = "'Space Mono', ui-monospace, monospace"
const SERIF = "'Instrument Serif', Georgia, serif"
const SANS = "'Karla', system-ui, sans-serif"

/* ── One drifting window ────────────────────────────────────────────────── */
function Win({
  src,
  webp,
  sizes,
  alt,
  drift,
  axis = 'x',
  eager = false,
  objectPosition,
}: {
  src: string
  webp?: string
  sizes?: string
  alt: string
  drift: number
  axis?: 'x' | 'y'
  eager?: boolean
  objectPosition?: string
}) {
  return (
    /* data-win carries the drift so the loop never has to look it up, and
     * `transform` is deliberately NOT in the style prop — the rAF loop owns
     * it, and a React re-render (e.g. the language toggle) must not wipe it. */
    <div className="na-win" data-win={drift} style={{ position: 'absolute', ...windowBox(drift, axis) }}>
      <picture>
        {webp && <source type="image/webp" srcSet={webp} sizes={sizes} />}
        <img
          src={src}
          sizes={sizes}
          alt={alt}
          decoding="async"
          loading={eager ? 'eager' : 'lazy'}
          {...(eager ? { fetchpriority: 'high' } : {})}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', objectPosition }}
        />
      </picture>
    </div>
  )
}

function Kicker({ children, color = YELLOW, tracking = '0.18em' }: { children: ReactNode; color?: string; tracking?: string }) {
  return (
    <div className="na-kick" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: tracking, color }}>
      {children}
    </div>
  )
}

/* Display type inside its mask. The 0.22em bottom padding and the 0.98 floor
 * on line-height are both load-bearing: the mask crops at the line box, and
 * Icelandic ð þ g j clip against its edge without them. */
function Mask({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div style={{ overflow: 'hidden', paddingBottom: '0.22em' }}>
      <div className={`na-mask ${className}`} style={style}>
        {children}
      </div>
    </div>
  )
}

export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [lang, setLang] = useState<'is' | 'en'>('is')
  const T = (v: L) => t(v, lang)

  useEffect(() => {
    document.title = 'Naustið · Sjávarréttir við höfnina á Húsavík'
    setThemeColor(INK)
    return () => setThemeColor('#0a1320')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  /* ── THE ENGINE ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = <T2 extends Element>(s: string) => root.querySelector(s) as T2 | null
    const qa = (s: string) => Array.from(root.querySelectorAll<HTMLElement>(s))

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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

    let vw = window.innerWidth
    let vh = window.innerHeight
    let mobile = vw < CFG.bp.journey
    let travel = 1
    let trackX = 0
    let raf = 0

    const layout = () => {
      vw = window.innerWidth
      vh = window.innerHeight
      mobile = vw < CFG.bp.journey
      if (!track || !jwrap || !jview) return
      const panels = Array.from(track.children) as HTMLElement[]

      if (reduced) {
        jwrap.style.height = 'auto'
        Object.assign(jview.style, { position: 'relative', height: 'auto', overflow: 'visible' })
        Object.assign(track.style, { flexDirection: 'column', height: 'auto', transform: 'none' })
        panels.forEach((p) => {
          p.style.width = '100%'
          p.style.minHeight = '70svh'
        })
        return
      }

      if (mobile) {
        /* The distinct mobile gesture: a snap-aligned rail the reader swipes.
         * Nothing is pinned, so nothing can trap them. Drift and masks still
         * run, so the phone keeps the signature. */
        const narrow = vw < CFG.bp.narrow
        jwrap.style.height = 'auto'
        Object.assign(jview.style, { position: 'relative', height: '86svh', overflow: 'visible' })
        Object.assign(track.style, { transform: 'none', overflowX: 'auto', scrollSnapType: 'x mandatory' })
        panels.forEach((p) => {
          p.style.scrollSnapAlign = 'start'
          if (p.dataset.panel !== 'slab') {
            p.style.width = '90vw'
            p.style.padding = '0 24px'
          }
          if (p.dataset.cols) p.style.gridTemplateColumns = narrow ? '1fr' : '1fr 1fr'
          p.querySelectorAll<HTMLElement>('figure').forEach((f) => {
            f.style.height = narrow ? '34svh' : '58vh'
          })
        })
        if (hint) hint.style.display = 'block'
        return
      }

      Object.assign(jview.style, { position: 'sticky', height: '100vh', overflow: 'hidden' })
      Object.assign(track.style, { overflowX: 'visible', scrollSnapType: 'none', flexDirection: 'row', height: '100%' })
      panels.forEach((p) => {
        p.style.width = p.dataset.panel === 'slab' ? '100vw' : 'min(1100px, 92vw)'
        p.style.minHeight = ''
        p.style.padding = p.dataset.panel === 'slab' ? '0' : '0 60px'
        if (p.dataset.cols) p.style.gridTemplateColumns = '1fr 1fr'
        p.querySelectorAll<HTMLElement>('figure').forEach((f) => {
          /* Short viewports: a pinned panel cannot scroll, so its content has
           * to shrink rather than overflow into unreachable space. */
          f.style.height = vh < 860 ? '52vh' : '62vh'
        })
      })
      if (hint) hint.style.display = 'none'
      travel = Math.max(1, track.scrollWidth - vw)
      jwrap.style.height = `${travel + vh}px`
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
      n.style.transform = 'translateY(0)'
      n.style.opacity = '1'
    }
    const settle = () => {
      if (pre) pre.style.display = 'none'
      masks.forEach((m) => (m.style.transform = 'translateY(0)'))
      fades.forEach((f) => {
        f.style.opacity = '1'
        f.style.transform = 'none'
      })
      wins.forEach((w) => (w.style.transform = 'none'))
      if (stackUnder) {
        stackUnder.style.position = 'relative'
        stackUnder.style.transform = 'none'
        stackUnder.style.opacity = '1'
      }
    }

    /* Preloader counter tied to real image decode, never a timer. */
    const preload = () => {
      if (!pre) return
      const finish = () => {
        pre.style.transition = 'transform 0.9s cubic-bezier(0.76,0,0.24,1)'
        pre.style.transform = 'translateY(-101%)'
        revealMask(heroTitle, 0.2)
        revealMask(heroSub, 0.42)
        window.setTimeout(() => {
          pre.style.display = 'none'
        }, 1000)
      }
      /* Count only images that are actually going to load NOW. Four of the
       * five photographs are lazy and live off-screen inside the horizontal
       * track, so they never fire `load` while the curtain is up — gating on
       * all of document.images pinned the counter at 60 and left the curtain
       * sitting there until the 6s bail-out. The prototype used eager
       * placeholders and so could not hit this. */
      const imgs = Array.from(root.querySelectorAll('img')).filter((im) => im.complete || im.loading !== 'lazy')
      let loaded = 0
      imgs.forEach((im) => {
        if (im.complete) {
          loaded++
          return
        }
        const bump = () => loaded++
        im.addEventListener('load', bump, { once: true })
        /* A 404 must not hang the curtain. */
        im.addEventListener('error', bump, { once: true })
      })
      const t0 = performance.now()
      let val = 0
      const step = (now: number) => {
        const elapsed = now - t0
        const real = imgs.length ? loaded / imgs.length : 1
        /* Never outrun real decode, never crawl. Monotonic. */
        val = Math.max(val, Math.min(real, elapsed / CFG.preload.minDuration) * 100)
        if (preNum) preNum.textContent = String(Math.round(val))
        if (val < 99.5 && elapsed < CFG.preload.maxDuration) requestAnimationFrame(step)
        else {
          if (preNum) preNum.textContent = '100'
          window.setTimeout(finish, CFG.preload.holdAtFull)
        }
      }
      requestAnimationFrame(step)
    }

    const frame = () => {
      /* ---- READ ---- */
      const y = window.scrollY
      const heroP = clamp01(y / vh)
      const jTop = jwrap ? jwrap.offsetTop : 0
      const winReads = wins.map((n) => ({ n, r: (n.parentElement as HTMLElement).getBoundingClientRect() }))
      const maskReads = masks.map((n) => ({ n, r: n.getBoundingClientRect() }))
      const fadeReads = fades.map((n) => ({ n, r: n.getBoundingClientRect() }))
      const overTop = stackOver ? stackOver.getBoundingClientRect().top : Infinity
      const scrollLeft = mobile && track ? track.scrollLeft : 0
      const railMax = mobile && track ? Math.max(1, track.scrollWidth - track.clientWidth) : 1

      /* ---- WRITE ---- */
      if (heroImg) {
        const d = CFG.drift.slab * CFG.drift.heroFactor
        heroImg.style.transform = `translate3d(0, ${(heroP * d).toFixed(2)}%, 0)`
      }

      if (track && !mobile) {
        const p = clamp01((y - jTop) / travel)
        const targetX = -p * travel
        /* The scrub lerp — the track eases behind the pointer rather than
         * tracking it rigidly. This is most of why the motion reads expensive. */
        trackX = CFG.scrubLerp > 0 ? trackX + (targetX - trackX) * CFG.scrubLerp : targetX
        track.style.transform = `translate3d(${trackX.toFixed(1)}px, 0, 0)`
        if (prog) prog.style.transform = `scaleX(${p.toFixed(4)})`
      } else if (prog && mobile) {
        prog.style.transform = `scaleX(${(scrollLeft / railMax).toFixed(4)})`
      }

      for (const { n, r } of winReads) {
        if (n === heroImg) continue
        if (r.right < -60 || r.left > vw + 60) continue
        const p = ((r.left + r.width / 2) / vw - 0.5) * 2
        const d = Number(n.dataset.win) || CFG.drift.fig
        n.style.transform = `translate3d(${(-p * d).toFixed(2)}%, 0, 0)`
      }

      /* Arrival uses HORIZONTAL thresholds — panels arrive from the right. */
      for (const { n, r } of maskReads) if (r.left < vw * CFG.mask.triggerAt && r.right > 0) revealMask(n)
      for (const { n, r } of fadeReads) if (r.left < vw * CFG.fade.triggerAt && r.right > 0) revealFade(n)

      if (stackUnder && overTop !== Infinity) {
        const cover = clamp01(1 - overTop / vh)
        stackUnder.style.transform = `scale(${(1 - cover * (1 - CFG.stack.scale)).toFixed(4)})`
        stackUnder.style.opacity = (1 - cover * (1 - CFG.stack.fadeTo)).toFixed(3)
      }

      raf = requestAnimationFrame(frame)
    }

    layout()
    window.addEventListener('resize', layout)
    if (reduced) {
      settle()
      return () => window.removeEventListener('resize', layout)
    }
    preload()
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', layout)
    }
  }, [])

  const panelBase: CSSProperties = {
    flex: '0 0 auto',
    width: 'min(1100px, 92vw)',
    height: '100%',
    padding: '0 60px',
    boxSizing: 'border-box',
  }

  return (
    <div ref={rootRef} style={{ background: INK, color: BONE, fontFamily: SANS }}>
      <style>{`
        #na-root ::selection { background:${YELLOW}; color:${INK}; }
        #na-root a { color:inherit; }
        #na-root :focus-visible { outline:2px solid ${YELLOW}; outline-offset:2px; }
        #na-root .na-mask { transform:translateY(112%); will-change:transform; }
        #na-root .na-fade { opacity:0; transform:translateY(14px); will-change:transform,opacity; }
        #na-root .na-win { will-change:transform; }
        #na-root .na-cta:hover { opacity:.88; }
        #na-root .na-track::-webkit-scrollbar { display:none; }
        #na-root .na-track { scrollbar-width:none; }
        @media (prefers-reduced-motion:reduce) {
          #na-root .na-mask { transform:none !important; }
          #na-root .na-fade { opacity:1 !important; transform:none !important; }
          #na-root .na-win { transform:none !important; position:absolute; inset:0 !important; width:100% !important; height:100% !important; }
        }
      `}</style>

      <div id="na-root">
        <PreviewChrome company={company} />

        {/* ── Preloader ────────────────────────────────────────────────── */}
        <div
          data-preloader
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: INK,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: BONE_MUTE }}>
            {T(C.preKicker)}
          </div>
          <div data-preloader-count style={{ fontFamily: SERIF, fontSize: 88, color: YELLOW, lineHeight: 1 }}>
            0
          </div>
        </div>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <header
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 28px',
          }}
        >
          <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 26, color: BONE, mixBlendMode: 'difference' }}>
            Naustið
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setLang((l) => (l === 'is' ? 'en' : 'is'))}
              aria-label={lang === 'is' ? 'Switch to English' : 'Skipta yfir á íslensku'}
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: '0.14em',
                background: 'rgba(18,23,27,0.25)',
                border: '1px solid rgba(216,222,221,0.45)',
                color: BONE,
                mixBlendMode: 'difference',
                padding: '8px 14px',
                borderRadius: 999,
                cursor: 'pointer',
                minHeight: 34,
              }}
            >
              {lang === 'is' ? 'EN' : 'ÍS'}
            </button>
            <a
              href="#bordapontun"
              className="na-cta"
              style={{
                fontFamily: MONO,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                background: YELLOW,
                color: INK,
                padding: '10px 18px',
                borderRadius: 999,
                textDecoration: 'none',
              }}
            >
              {T(C.book)}
            </a>
          </div>
        </header>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section style={{ position: 'relative', height: '100svh', overflow: 'hidden', background: INK }}>
          <div data-hero-img style={{ position: 'absolute', ...windowBox(CFG.drift.slab * CFG.drift.heroFactor, 'y') }}>
            <picture>
              <source type="image/webp" srcSet={IMG.exteriorWebp} sizes="100vw" />
              <img
                src={IMG.exterior}
                sizes="100vw"
                alt="Gula timburhúsið Sel á Ásgarðsvegi 1 á Húsavík, heimili Naustsins"
                loading="eager"
                decoding="async"
                {...{ fetchpriority: 'high' }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', objectPosition: '58% 42%' }}
              />
            </picture>
          </div>
          {/* Load-bearing: the kicker sits over sunlit parts of the photo and
              fails without this. */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'linear-gradient(to top, rgba(18,23,27,0.95), rgba(18,23,27,0.82) 26%, rgba(18,23,27,0.34) 58%, rgba(18,23,27,0.12) 76%, rgba(18,23,27,0.34))',
            }}
          />
          <div style={{ position: 'absolute', left: 28, right: 28, bottom: 38 }}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: YELLOW,
                marginBottom: 10,
              }}
            >
              {T(C.heroKicker)}
            </div>
            <div style={{ overflow: 'hidden', paddingBottom: '0.22em' }}>
              <h1
                data-hero-title
                className="na-mask"
                style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(64px,13vw,180px)', lineHeight: 1, color: CREAM }}
              >
                Naustið
              </h1>
            </div>
            <div style={{ overflow: 'hidden', paddingBottom: '0.22em' }}>
              <p
                data-hero-sub
                className="na-mask"
                style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.55, color: 'rgba(216,222,221,0.78)', maxWidth: '52ch', margin: '10px 0 0' }}
              >
                {T(C.heroSub)}
              </p>
            </div>
          </div>
          <div style={{ position: 'absolute', right: 28, bottom: 42, fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: BONE_MUTE }}>
            {T(C.scrollHint)}
          </div>
        </section>

        {/* ── The pinned horizontal journey ────────────────────────────── */}
        <div data-journey style={{ position: 'relative' }}>
          <div data-journey-view style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: INK }}>
            <div
              data-swipe-hint
              style={{ display: 'none', position: 'absolute', top: 14, left: 28, zIndex: 5, fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: YELLOW }}
            >
              {T(C.swipeHint)}
            </div>

            <div data-track className="na-track" style={{ display: 'flex', height: '100%', alignItems: 'stretch', willChange: 'transform' }}>
              {/* 01 · súpan */}
              <section
                id="supan"
                data-panel
                data-cols
                style={{ ...panelBase, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}
              >
                <div>
                  <Kicker>{T(C.k1)}</Kicker>
                  <Mask style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(44px,4.8vw,74px)', lineHeight: 1.04, color: CREAM, margin: '14px 0 0' }}>
                    <h2 style={{ margin: 0, font: 'inherit', color: 'inherit' }}>{T(C.soupH)}</h2>
                  </Mask>
                  <p className="na-fade" style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.6, color: BONE_SOFT, maxWidth: '38ch', margin: '16px 0 0' }}>
                    {T(C.soupBody)}
                  </p>
                </div>
                <figure style={{ margin: 0, height: '62vh', overflow: 'hidden', position: 'relative', background: SLAB }}>
                  <Win src={IMG.soup} webp={IMG.soupWebp} sizes="(max-width:1024px) 90vw, 46vw" alt="Fiskisúpa Naustsins með nýbökuðu brauði" drift={CFG.drift.fig} />
                </figure>
              </section>

              {/* Slab I — the house */}
              <section data-panel="slab" style={{ flex: '0 0 auto', width: '100vw', height: '100%', position: 'relative', overflow: 'hidden', background: SLAB }}>
                <Win src={IMG.exterior} webp={IMG.exteriorWebp} sizes="100vw" alt="" drift={CFG.drift.slab} objectPosition="52% 40%" />
                <div style={{ position: 'absolute', left: 28, bottom: 28, background: INK, padding: '10px 16px' }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: YELLOW }}>{T(C.slab1)}</span>
                </div>
              </section>

              {/* 02 · matseðill */}
              <section id="matsedill" data-panel style={{ ...panelBase, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Kicker>{T(C.k2)}</Kicker>
                <Mask style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(44px,4.8vw,74px)', lineHeight: 1.04, color: CREAM, margin: '14px 0 0' }}>
                  <h2 style={{ margin: 0, font: 'inherit', color: 'inherit' }}>{T(C.menuH)}</h2>
                </Mask>
                <div className="na-fade" style={{ display: 'flex', flexDirection: 'column', maxWidth: 620, marginTop: 26 }}>
                  {DISHES.map((d, i) => (
                    <div key={d.name.is}>
                      {i > 0 && <div aria-hidden style={{ height: 4, backgroundImage: TICK }} />}
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24, padding: '14px 0' }}>
                        <span style={{ fontFamily: SERIF, fontSize: 28, color: CREAM }}>{T(d.name)}</span>
                        <span style={{ fontFamily: SANS, fontSize: 14, color: 'rgba(216,222,221,0.6)', textAlign: 'right' }}>{T(d.note)}</span>
                      </div>
                    </div>
                  ))}
                  {/* No prices anywhere: the restaurant publishes none, and
                      inventing them was not an option. */}
                  <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.6, color: BONE_MUTE, maxWidth: '46ch', margin: '18px 0 0' }}>
                    {T(C.menuNote)}
                  </p>
                </div>
              </section>

              {/* Slab II — the salmon. Not a harbour: no harbour photograph
                  of theirs exists, and this design admits no stock imagery. */}
              <section data-panel="slab" style={{ flex: '0 0 auto', width: '100vw', height: '100%', position: 'relative', overflow: 'hidden', background: SLAB }}>
                <Win src={IMG.salmon} webp={IMG.salmonWebp} sizes="100vw" alt="Grillaður lax af matseðli Naustsins" drift={CFG.drift.slab} objectPosition="50% 45%" />
                <div style={{ position: 'absolute', left: 28, bottom: 28, background: INK, padding: '10px 16px' }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: YELLOW }}>{T(C.slab2)}</span>
                </div>
              </section>

              {/* 03 · sagan — figure LEFT */}
              <section
                id="sagan"
                data-panel
                data-cols
                style={{ ...panelBase, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}
              >
                <figure style={{ margin: 0, height: '58vh', overflow: 'hidden', position: 'relative', background: SLAB }}>
                  <Win src={IMG.interior} webp={IMG.interiorWebp} sizes="(max-width:1024px) 90vw, 46vw" alt="Matsalur Naustsins í Seli" drift={CFG.drift.fig} />
                </figure>
                <div>
                  <Kicker>{T(C.k3)}</Kicker>
                  <Mask style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(40px,4.4vw,68px)', lineHeight: 1.06, color: CREAM, margin: '14px 0 0' }}>
                    <h2 style={{ margin: 0, font: 'inherit', color: 'inherit' }}>{T(C.storyH)}</h2>
                  </Mask>
                  <p className="na-fade" style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.6, color: BONE_SOFT, maxWidth: '38ch', margin: '16px 0 0' }}>
                    {T(C.storyBody)}
                  </p>
                </div>
              </section>

              {/* 04 · umsagnir */}
              <section data-panel style={{ ...panelBase, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Kicker>{T(C.k4)}</Kicker>
                <Mask
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: 'clamp(30px,3.6vw,52px)',
                    lineHeight: 1.18,
                    color: CREAM,
                    maxWidth: '26ch',
                    margin: '18px 0 0',
                  }}
                >
                  <blockquote style={{ margin: 0, font: 'inherit', color: 'inherit' }}>{T(C.quote)}</blockquote>
                </Mask>
                <div className="na-fade" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: BONE_MUTE, marginTop: 14 }}>
                  {T(C.quoteAttr)}
                </div>
                <div style={{ marginTop: 48, fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', color: YELLOW }}>{T(C.forward)}</div>
              </section>
            </div>

            <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: 'rgba(216,222,221,0.15)' }}>
              <div data-progress style={{ height: '100%', background: YELLOW, transform: 'scaleX(0)', transformOrigin: 'left', willChange: 'transform' }} />
            </div>
          </div>
        </div>

        {/* ── Sticky-stack close ───────────────────────────────────────── */}
        <div style={{ position: 'relative' }}>
          <section
            id="opid"
            data-stack-under
            style={{
              position: 'sticky',
              top: 0,
              minHeight: '100vh',
              background: CREAM,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '60px 28px',
              boxSizing: 'border-box',
              willChange: 'transform,opacity',
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: YELLOW_INK }}>
              {T(C.openKicker)}
            </div>
            {/* Their verified hours. The prototype said 12:00–21:00. */}
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(60px,9vw,130px)', lineHeight: 1, color: INK, marginTop: 16 }}>11:30–21:30</div>
            <p style={{ fontFamily: SANS, fontSize: 17, color: INK_SOFT, maxWidth: '44ch', margin: '18px 0 0' }}>{T(C.openBody)}</p>
          </section>

          <section
            id="bordapontun"
            data-stack-over
            style={{
              position: 'relative',
              zIndex: 2,
              minHeight: '100vh',
              background: YELLOW,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '60px 28px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: INK, opacity: 0.65 }}>
              {T(C.bookKicker)}
            </div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(52px,8vw,110px)', lineHeight: 1.02, color: INK, margin: '18px 0 26px' }}>
              {T(C.book)}
            </h2>
            {/* There is no booking system, so the CTA is the phone. */}
            <a
              href={PHONE_HREF}
              className="na-cta"
              style={{
                fontFamily: MONO,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                background: INK,
                color: YELLOW,
                padding: '18px 34px',
                borderRadius: 999,
                textDecoration: 'none',
              }}
            >
              {PHONE}
            </a>
            <div
              style={{
                marginTop: 90,
                width: '100%',
                maxWidth: 920,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                borderTop: '1px solid rgba(18,23,27,0.25)',
                paddingTop: 18,
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', color: INK, opacity: 0.75 }}>
                Naustið · {ADDRESS} · {PHONE}
              </span>
              <a href={`mailto:${EMAIL}`} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', color: INK, opacity: 0.75 }}>
                {EMAIL}
              </a>
            </div>
          </section>
        </div>

        <section style={{ background: '#0C1013', padding: '48px 28px' }}>
          <p style={{ margin: '0 auto', maxWidth: '78ch', textAlign: 'center', fontFamily: SANS, fontSize: 12.5, lineHeight: 1.7, color: BONE_MUTE }}>
            {DISCLAIMER}{' '}
            <a href={`mailto:${EMAIL}`} style={{ textDecoration: 'underline' }}>
              {EMAIL}
            </a>{' '}
            · {PHONE} · {ADDRESS}.
          </p>
        </section>

        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
