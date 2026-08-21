import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { CONTACT } from './data'

/* ── Shared chrome for the Christopher Lund pages ───────────────────────────
   One token set, one nav, one cursor, one reveal system: the front page, the
   gallery (safn) and the three service pages must read as one building.
   Everything stays prefix-scoped to .cl- ([[no-style-bleed-between-designs]]). */

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

/* ── primitives ────────────────────────────────────────────────────────── */

export function Headline({ text, size, floor, as: Tag = 'h2', className = '', measure }: {
  text: string; size: number; floor: number
  as?: 'h1' | 'h2' | 'h3'; className?: string; measure?: number
}) {
  return (
    <Tag
      data-cl-headline
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
export function Rule({ label }: { label: string }) {
  return (
    <div className="cl-rulehead cl-rv">
      <span className="cl-rule" aria-hidden="true" />
      <span className="cl-rulehead-label">{label}</span>
    </div>
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
   [data-cursor] it opens into a frosted hairline circle carrying the
   element's own label ("Skoða", "Opna"...). Fine pointers only, never under
   reduced motion; the lerped position is written straight to the node via
   gsap's ticker, never through React state. */

export function CursorRing() {
  const ref = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!finePointer() || reduced()) return
    const el = ref.current
    const label = labelRef.current
    if (!el || !label) return

    let x = 0; let y = 0; let tx = 0; let ty = 0; let live = false
    const tick = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      el.style.transform = `translate3d(${(x - 52).toFixed(1)}px, ${(y - 52).toFixed(1)}px, 0)`
    }
    gsap.ticker.add(tick)

    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY
      if (!live) { live = true; x = tx; y = ty; el.classList.add('is-live') }
    }
    const over = (e: Event) => {
      const t = (e.target as Element | null)?.closest?.('[data-cursor]')
      if (t) {
        label.textContent = t.getAttribute('data-cursor') || ''
        el.classList.add('is-grown')
      } else {
        el.classList.remove('is-grown')
      }
    }
    const leave = () => { live = false; el.classList.remove('is-live') }

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
.cl-nav-mark { font-family: ${MONO}; font-size: ${fluid(13, 12)}; letter-spacing: .13em; }
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
.cl-rulehead-label {
  display: inline-block; padding-top: 10px; font-family: ${MONO};
  font-size: ${fluid(12, 11)}; letter-spacing: .16em; text-transform: uppercase; color: var(--cl-mute);
}

/* reveals */
.cl-js .cl-rv { opacity: 0; transform: translateY(26px); }
.cl-js .cl-rv.is-in { opacity: 1; transform: none; transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1); }
.cl-static .cl-rv, .cl-root:not(.cl-js) .cl-rv { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .cl-word { transform: none !important; opacity: 1 !important; }
}

/* the circle cursor: gold dot at rest, frosted hairline circle over
   [data-cursor] targets. The system cursor stays visible everywhere except
   over the tagged targets, where the ring IS the pointer. */
.cl-cursor {
  position: fixed; top: 0; left: 0; width: 104px; height: 104px; z-index: 70;
  pointer-events: none; display: grid; place-items: center;
  opacity: 0; transform: translate3d(-300px, -300px, 0); transition: opacity .25s;
}
.cl-cursor::before {
  content: ''; position: absolute; inset: 0; border-radius: 50%;
  background: var(--cl-gold); border: 1px solid transparent;
  transform: scale(.105);
  transition: transform .5s cubic-bezier(.23,1,.32,1), background-color .3s, border-color .3s;
}
.cl-cursor.is-live { opacity: 1; }
.cl-cursor.is-grown::before {
  transform: scale(1);
  background: rgb(17 17 15 / .22); border-color: rgb(255 255 255 / .55);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
}
.cl-cursor-label {
  position: relative; font-family: ${MONO}; font-size: 11px; letter-spacing: .2em;
  text-transform: uppercase; color: #F4F1EA; opacity: 0; transform: translateY(8px);
  transition: opacity .3s .06s, transform .5s cubic-bezier(.23,1,.32,1);
  text-shadow: 0 1px 8px rgb(0 0 0 / .35);
}
.cl-cursor.is-grown .cl-cursor-label { opacity: 1; transform: none; }
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .cl-root [data-cursor] { cursor: none; }
}
@media (pointer: coarse), (prefers-reduced-motion: reduce) {
  .cl-cursor { display: none; }
}

/* footer */
.cl-foot { border-top: 1px solid var(--cl-hair); padding: calc(var(--u) * 54) calc(var(--u) * 34) calc(var(--u) * 70); background: var(--cl-paper); }
.cl-foot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 34); }
.cl-foot-mark { font-family: ${MONO}; font-size: ${fluid(13, 12)}; letter-spacing: .14em; margin: 0 0 10px; }
.cl-foot-line { font-size: ${fluid(13.5, 12.5)}; color: var(--cl-mute); margin: 0 0 6px; line-height: 1.6; }
.cl-foot-tel { color: inherit; text-decoration: none; border-bottom: 1px solid currentColor; }
@media (max-width: 991px) { .cl-foot-grid { grid-template-columns: 1fr; } }
`
