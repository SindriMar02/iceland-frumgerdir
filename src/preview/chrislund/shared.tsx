import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { CONTACT } from './data'

/* ── Shared chrome for the Christopher Lund pages ───────────────────────────
   One token set, one nav, one cursor, one reveal system, one opening
   sequence: the front page, the gallery (safn) and the three service pages
   must read as one building. Everything stays prefix-scoped to .cl-
   ([[no-style-bleed-between-designs]]). */

export const PAPER = '#F5F4F1'
export const INK = '#191917'
export const GOLD = '#A98147' /* his own logo gold, sampled from the CL mark */

export const DISPLAY = "'Cabinet Grotesk', system-ui, sans-serif"
export const BODY = "'Geist', system-ui, sans-serif"
export const MONO = "'Space Mono', ui-monospace, monospace"

export const ASSET_BASE = import.meta.env.BASE_URL
export const ROUTE = '/preview/chrislund'

export const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

export const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true

export const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/** Minimal surface of Lenis that these pages use. */
export interface SmoothScroller {
  raf: (t: number) => void
  on: (ev: 'scroll', fn: () => void) => void
  scrollTo: (target: number | Element, opts?: object) => void
  destroy: () => void
}

/* iOS Safari only collapses its toolbar for a NATIVELY scrolled document, so
   the smooth-scroll library must never even load on touch: dynamic import
   behind the fine-pointer gate ([[lenis-mobile-damage]], mobile-gate rule
   no-smooth-scroll-lib). */
export const createLenis = async (): Promise<SmoothScroller | null> => {
  if (!finePointer() || reduced()) return null
  const { default: Lenis } = await import('lenis')
  return new Lenis({ duration: 1.1, smoothWheel: true }) as unknown as SmoothScroller
}

/* ── reveal backstop ────────────────────────────────────────────────────────
   IntersectionObserver is the primary trigger; this sweep only catches
   elements a chaotic scroll skipped entirely between painted frames. The
   naive version measured EVERY unrevealed element on EVERY scroll frame,
   which is the exact main-thread cost the Sandholt purge removed
   ([[sandholt-wordmark-lag-purge]]). So: throttle to 5x/sec, keep a cached
   list, and prune it as elements resolve. */
export function createRevealSweep(root: HTMLElement) {
  let pending: Element[] = []
  let last = 0
  const refresh = () => { pending = Array.from(root.querySelectorAll('.cl-rv:not(.is-in)')) }
  refresh()
  return {
    refresh,
    tick() {
      if (!pending.length) return
      const now = performance.now()
      if (now - last < 200) return
      last = now
      const vh = window.innerHeight
      const still: Element[] = []
      for (const el of pending) {
        if (el.getBoundingClientRect().top < vh) el.classList.add('is-in')
        else still.push(el)
      }
      pending = still
    },
  }
}

/* The opening is a first-impression device, not chrome, so it plays ONCE per
   visit. Without this, clicking the wordmark home from a service page replays
   the full 1.7s sequence, and that is a tens-per-session action. The back
   button already skips it via the scroll-restore path. */
const OPENED_KEY = 'cl-opening-played'
export const openingPlayed = () => {
  try { return sessionStorage.getItem(OPENED_KEY) === '1' } catch { return false }
}

/* ── the opening sequence ───────────────────────────────────────────────────
   ONE timeline so the parts are genuinely synchronised rather than four
   independent tweens that drift: the photograph settles and the header
   arrives together, the wordmark rises out of it, the reading text last.

   The resting state in CSS is the VISIBLE one. `.cl-pre` (added during the
   very first render, never in an effect) holds the from-state so there is no
   flash before JS runs, and the class comes off in the same frame the
   timeline stamps its own from-values. Nothing here is gated on rAF, which
   would strand the page in a backgrounded tab. */
export function buildEntrance(root: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline()
  const media = root.querySelector<HTMLElement>('[data-cl-enter="media"]')
  const nav = root.querySelector<HTMLElement>('.cl-nav')
  const words = root.querySelectorAll<HTMLElement>('[data-cl-enter="word"] .cl-word')
  const items = root.querySelectorAll<HTMLElement>('[data-cl-enter="item"]')

  if (media) {
    tl.fromTo(media, { autoAlpha: 0, scale: 1.06 },
      { autoAlpha: 1, scale: 1, duration: 1.7, ease: 'expo.out' }, 0)
  }
  if (nav) {
    tl.fromTo(nav, { autoAlpha: 0, y: -18 },
      { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out' }, 0.1)
  }
  if (words.length) {
    tl.fromTo(words, { yPercent: 118, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 1.15, ease: 'expo.out', stagger: 0.07 }, 0.34)
  }
  if (items.length) {
    tl.fromTo(items, { y: 22, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, 0.56)
  }
  /* every fromTo above has already stamped its from-state inline, so dropping
     the holding class cannot flash */
  root.classList.remove('cl-pre')
  try { sessionStorage.setItem(OPENED_KEY, '1') } catch { /* private mode */ }
  return tl
}

/* ── primitives ────────────────────────────────────────────────────────── */

export function Headline({ text, size, floor, as: Tag = 'h2', className = '', measure, enter }: {
  text: string; size: number; floor: number
  as?: 'h1' | 'h2' | 'h3'; className?: string; measure?: number; enter?: boolean
}) {
  return (
    <Tag
      data-cl-headline
      data-cl-enter={enter ? 'word' : undefined}
      aria-label={text}
      className={`cl-headline ${className}`}
      style={{
        fontSize: fluid(size, floor),
        maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined,
      }}
    >
      {text.split(' ').map((w, i, arr) => (
        <span key={i} aria-hidden="true">
          <span className="cl-line"><span className="cl-word">{w}</span></span>
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/** Drawn-rule section head (Búðir's SectionHead, gallery-labelled). */
export function Rule({ label, right }: { label: string; right?: React.ReactNode }) {
  return (
    <div className="cl-rulehead cl-rv">
      <span className="cl-rule" aria-hidden="true" />
      <span className="cl-rulehead-row">
        <span className="cl-rulehead-label">{label}</span>
        {right ? <span className="cl-rulehead-right">{right}</span> : null}
      </span>
    </div>
  )
}

/* ── backtracking ───────────────────────────────────────────────────────────
   A work opened from the wall has to be closeable. If this entry came from
   inside the site there is real history to step back through (and the front
   page restores the exact spot on the wall it was left at); on a cold deep
   link there is none, so the control routes to a sensible parent instead of
   dumping the visitor out of the site. React Router stamps the very first
   entry with key 'default', which is the honest test for which case we are
   in. */
export function BackLink({ fallback, label = 'Til baka', light = false }: {
  fallback: string; label?: string; light?: boolean
}) {
  const navigate = useNavigate()
  const { key } = useLocation()
  const go = () => {
    if (key !== 'default') navigate(-1)
    else navigate(fallback)
  }
  return (
    <button type="button" className={`cl-back ${light ? 'is-light' : ''}`} onClick={go}>
      <span className="cl-back-arrow" aria-hidden="true">&larr;</span>
      <span>{label}</span>
    </button>
  )
}

/* ── nav: difference-blend, no bar. `home` renders in-page anchors, the
   subpages route back to the front page's sections. ────────────────────── */

export function ClNav({ home, onAnchor, tone = 'blend' }: {
  home: boolean
  onAnchor?: (id: string) => (e: React.MouseEvent) => void
  /** 'blend' = difference over imagery; 'ink' = solid ink for flat paper headers */
  tone?: 'blend' | 'ink'
}) {
  const items: Array<[string, string]> = [
    ['veggurinn', 'Veggurinn'],
    ['bokin', 'Bókin'],
    ['thjonusta', 'Þjónusta'],
  ]
  return (
    <header className={`cl-nav ${tone === 'ink' ? 'is-ink' : ''}`}>
      {home ? (
        <a className="cl-nav-mark" href="#top" onClick={onAnchor?.('top')}>CHRISTOPHER&nbsp;LUND</a>
      ) : (
        <Link className="cl-nav-mark" to={ROUTE}>CHRISTOPHER&nbsp;LUND</Link>
      )}
      <nav className="cl-nav-links" aria-label="Síða">
        {items.map(([id, label]) =>
          home ? (
            <a key={id} href={`#${id}`} onClick={onAnchor?.(id)}>{label}</a>
          ) : (
            <Link key={id} to={`${ROUTE}#${id}`}>{label}</Link>
          ),
        )}
        <Link to={`${ROUTE}/safn`}>Safnið</Link>
      </nav>
      <a className="cl-nav-cta" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
    </header>
  )
}

/* ── the circle cursor Chris asked for ──────────────────────────────────────
   A small gold dot that follows the pointer; over anything tagged
   [data-cursor] it opens into a hairline circle carrying the element's own
   label ("Skoða", "Opna"...). Fine pointers only, never under reduced
   motion; the lerped position is written straight to the node via gsap's
   ticker, never through React state. */

export function CursorRing() {
  const ref = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!finePointer() || reduced()) return
    const el = ref.current
    const label = labelRef.current
    if (!el || !label) return

    let x = 0; let y = 0; let tx = 0; let ty = 0; let live = false; let grown = false
    /* quickSetter keeps the per-frame write off the style-parsing path */
    const put = gsap.quickSetter(el, 'css') as (v: object) => void
    const tick = () => {
      const dx = tx - x
      const dy = ty - y
      /* A lerp only ever approaches its target, so without this gate the ring
         keeps writing a transform every frame forever -- including through
         every scroll, when the pointer is parked and nothing is moving. A
         parked cursor must cost nothing. */
      if (dx * dx + dy * dy < 0.02) return
      x += dx * 0.18
      y += dy * 0.18
      put({ x: x - 52, y: y - 52 })
    }
    gsap.ticker.add(tick)

    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY
      if (!live) { live = true; x = tx; y = ty; el.classList.add('is-live') }
    }
    /* pointerover fires for every element that slides under a STILL pointer
       during a scroll, so this runs constantly on the pinned wall; only touch
       the class list when the state actually flips. */
    const over = (e: Event) => {
      const t = (e.target as Element | null)?.closest?.('[data-cursor]')
      if (t && !grown) {
        grown = true
        label.textContent = t.getAttribute('data-cursor') || ''
        el.classList.add('is-grown')
      } else if (t && grown) {
        const next = t.getAttribute('data-cursor') || ''
        if (label.textContent !== next) label.textContent = next
      } else if (!t && grown) {
        grown = false
        el.classList.remove('is-grown')
      }
    }
    const leave = () => {
      live = false; grown = false
      el.classList.remove('is-live'); el.classList.remove('is-grown')
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, true)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over, true)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div className="cl-cursor" ref={ref} aria-hidden="true">
      <span className="cl-cursor-label" ref={labelRef} />
    </div>
  )
}

/* ── shared foot ────────────────────────────────────────────────────────── */

export function ClFoot() {
  return (
    <div className="cl-foot">
      <div className="cl-foot-grid">
        <div>
          <p className="cl-foot-mark">CHRISTOPHER LUND</p>
          <p className="cl-foot-line">Ljósmyndari · {CONTACT.address}</p>
        </div>
        <div>
          <p className="cl-foot-line">Sími <a className="cl-foot-tel" href={CONTACT.phoneHref}>{CONTACT.phone}</a></p>
          <p className="cl-foot-line">Aðili að 1% For The Planet</p>
        </div>
        <div>
          <p className="cl-foot-line">Allar myndir og merki eru af chris.is, sótt í ágúst 2026.</p>
          <p className="cl-foot-line">Frumgerð frá SNDR.</p>
        </div>
      </div>
    </div>
  )
}

/* ── shared CSS ────────────────────────────────────────────────────────── */

export const SHARED_CSS = `
@font-face { font-family: 'Cabinet Grotesk'; src: url('${ASSET_BASE}fonts/cabinet-grotesk/CabinetGrotesk-Variable.woff2') format('woff2'); font-weight: 100 900; font-display: swap; }
@font-face { font-family: 'Geist'; src: url('${ASSET_BASE}fonts/geist/Geist-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Geist'; src: url('${ASSET_BASE}fonts/geist/Geist-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }
@font-face { font-family: 'Space Mono'; src: url('${ASSET_BASE}fonts/space-mono/SpaceMono-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }

/* Safari samples html/body background-color for the status-bar and
   home-indicator strips; it must match the end of the document. */
html, body { background-color: ${PAPER}; }

.cl-root {
  --u: clamp(.44px, 100vw / 1440, 1.15px);
  --cl-paper: ${PAPER};
  --cl-ink: ${INK};
  --cl-gold: ${GOLD};
  --cl-gold-text: #7C5C2B;
  --cl-mute: #5C5B55;
  --cl-hair: rgb(25 25 23 / .16);
  background: var(--cl-paper);
  color: var(--cl-ink);
  font-family: ${BODY};
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
.cl-root [id] { scroll-margin-top: calc(var(--u) * 50 + 24px); }
.cl-root a, .cl-root button { touch-action: manipulation; }
.cl-root ::selection { background: var(--cl-gold); color: #FFFDF8; }
.cl-root :focus-visible { outline: 2px solid var(--cl-gold-text); outline-offset: 3px; border-radius: 2px; }

/* opening sequence: holding state only, the resting state is visible */
.cl-pre .cl-nav,
.cl-pre [data-cl-enter="media"],
.cl-pre [data-cl-enter="item"] { opacity: 0; visibility: hidden; }
.cl-pre [data-cl-enter="word"] .cl-word { opacity: 0; visibility: hidden; }

/* nav: difference-blend, no bar */
.cl-nav {
  position: fixed; inset: 0 0 auto 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: calc(var(--u) * 22) calc(var(--u) * 34);
  padding-top: calc(var(--u) * 22 + env(safe-area-inset-top, 0px));
  mix-blend-mode: difference; color: #EEECE6; pointer-events: none;
}
.cl-nav a { pointer-events: auto; color: inherit; text-decoration: none; transition: opacity .2s cubic-bezier(.16,1,.3,1); }
.cl-nav a:hover { opacity: .7; }
.cl-nav-mark { font-family: ${MONO}; font-size: ${fluid(13, 12.5)}; letter-spacing: .13em; }
.cl-nav-links { display: flex; gap: calc(var(--u) * 26); font-size: ${fluid(14, 13)}; }
.cl-nav-cta { font-family: ${MONO}; font-size: ${fluid(14, 13)}; border-bottom: 1px solid currentColor; padding-bottom: 2px; }
.cl-nav.is-ink { mix-blend-mode: normal; color: var(--cl-ink); }
@media (max-width: 640px) { .cl-nav-links { display: none; } }

/* type */
.cl-headline { font-family: ${DISPLAY}; font-weight: 500; line-height: 1.12; letter-spacing: -.012em; margin: 0 0 calc(var(--u) * 24); }
.cl-line { display: inline-block; overflow: hidden; padding-bottom: .22em; margin-bottom: -.22em; vertical-align: bottom; }
.cl-word { display: inline-block; }
.cl-body { font-size: ${fluid(17, 15)}; line-height: 1.66; color: var(--cl-mute); max-width: 58ch; margin: 0; }

/* drawn rule heads */
.cl-rulehead { margin-bottom: calc(var(--u) * 30); }
.cl-rule { display: block; height: 1px; background: var(--cl-ink); opacity: .5; transform-origin: left; }
.cl-js .cl-rulehead .cl-rule { transform: scaleX(0); }
.cl-js .cl-rulehead.is-in .cl-rule { transform: none; transition: transform 1.1s cubic-bezier(.16,1,.3,1); }
.cl-rulehead-row {
  display: flex; align-items: baseline; justify-content: space-between; gap: 20px;
  padding-top: 10px;
}
.cl-rulehead-label, .cl-rulehead-right {
  font-family: ${MONO}; font-size: ${fluid(12, 12)}; letter-spacing: .16em;
  text-transform: uppercase; color: var(--cl-mute);
}
.cl-rulehead-right { flex: none; }

/* backtracking control */
.cl-back {
  display: inline-flex; align-items: center; gap: 10px; background: none; border: none;
  padding: 4px 0; margin: 0; cursor: pointer; font-family: ${MONO};
  font-size: ${fluid(12, 12)}; letter-spacing: .16em; text-transform: uppercase;
  color: var(--cl-mute); transition: color .3s cubic-bezier(.16,1,.3,1);
}
.cl-back:hover { color: var(--cl-ink); }
.cl-back-arrow { display: inline-block; transition: transform 180ms cubic-bezier(.16,1,.3,1); }
.cl-back:hover .cl-back-arrow { transform: translateX(-5px); }
.cl-back.is-light { color: #8F8D84; }
.cl-back.is-light:hover { color: #EFEDE7; }

/* reveals */
.cl-js .cl-rv { opacity: 0; transform: translateY(26px); }
.cl-js .cl-rv.is-in { opacity: 1; transform: none; transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1); }
.cl-static .cl-rv, .cl-root:not(.cl-js) .cl-rv { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .cl-word { transform: none !important; opacity: 1 !important; }
}

/* the circle cursor: gold dot at rest, hairline circle over [data-cursor]
   targets. No backdrop-filter: it re-samples the backdrop every frame on an
   element that moves every frame, and a flat tint is indistinguishable over
   photography ([[sandholt-wordmark-lag-purge]]). */
.cl-cursor {
  position: fixed; top: 0; left: 0; width: 104px; height: 104px; z-index: 70;
  pointer-events: none; display: grid; place-items: center;
  opacity: 0; transform: translate3d(-300px, -300px, 0);
  transition: opacity .25s; will-change: transform;
}
.cl-cursor::before {
  content: ''; position: absolute; inset: 0; border-radius: 50%;
  background: var(--cl-gold); border: 1px solid transparent;
  transform: scale(.105);
  transition: transform 240ms cubic-bezier(.23,1,.32,1), background-color .24s, border-color .24s;
}
.cl-cursor.is-live { opacity: 1; }
.cl-cursor.is-grown::before {
  transform: scale(1);
  background: rgb(17 17 15 / .34); border-color: rgb(255 255 255 / .6);
}
.cl-cursor-label {
  position: relative; font-family: ${MONO}; font-size: 11px; letter-spacing: .2em;
  text-transform: uppercase; color: #F4F1EA; opacity: 0; transform: translateY(8px);
  transition: opacity .24s .04s, transform 240ms cubic-bezier(.23,1,.32,1);
  text-shadow: 0 1px 8px rgb(0 0 0 / .45);
}
.cl-cursor.is-grown .cl-cursor-label { opacity: 1; transform: none; }
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .cl-root [data-cursor] { cursor: none; }
}
@media (pointer: coarse), (prefers-reduced-motion: reduce) {
  .cl-cursor { display: none; }
}

/* TOUCH TARGETS — a text-scale control on a phone is only as tappable as its
   line box, which put the nav mark at 18px and most links at 22-27px. Expand
   the hit area to the 44px minimum with an overlay rather than padding, so
   nothing in the layout moves, and vertically only, so a control can never
   steal a tap from its neighbour. */
@media (pointer: coarse) {
  .cl-nav-mark, .cl-nav-cta, .cl-nav-links a, .cl-back,
  .cl-bridge-safn, .cl-bridge-tel, .cl-stage-tel, .cl-step,
  .cl-sv-other, .cl-thjonusta-cta, .cl-foot-tel, .cl-rulehead-jump {
    position: relative;
  }
  .cl-nav-mark::after, .cl-nav-cta::after, .cl-nav-links a::after, .cl-back::after,
  .cl-bridge-safn::after, .cl-bridge-tel::after, .cl-stage-tel::after, .cl-step::after,
  .cl-sv-other::after, .cl-thjonusta-cta::after, .cl-foot-tel::after, .cl-rulehead-jump::after {
    content: ''; position: absolute; left: 0; right: 0; top: 50%;
    height: 44px; transform: translateY(-50%);
  }
}

/* footer */
.cl-foot { border-top: 1px solid var(--cl-hair); padding: calc(var(--u) * 54) calc(var(--u) * 34) calc(var(--u) * 70); background: var(--cl-paper); }
.cl-foot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 34); }
.cl-foot-mark { font-family: ${MONO}; font-size: ${fluid(13, 12.5)}; letter-spacing: .14em; margin: 0 0 10px; }
.cl-foot-line { font-size: ${fluid(13.5, 12.5)}; color: var(--cl-mute); margin: 0 0 6px; line-height: 1.6; }
.cl-foot-tel { color: inherit; text-decoration: none; border-bottom: 1px solid currentColor; }
@media (max-width: 991px) { .cl-foot-grid { grid-template-columns: 1fr; } }
`
