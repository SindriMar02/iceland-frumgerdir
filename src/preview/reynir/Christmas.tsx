/**
 * Jólin hjá Reyni: the Christmas layer of reynirbakari.is.
 *
 * Agreed with Þorleifur (13 and 14 Nov 2026): deep red velvet under the gold
 * type, real snow falling over the whole site, "Gleðileg jól" written in over
 * HANDGERT with snow lying on the letters, and the Jólavörur page in the menu.
 *
 * WHEN. Stillingar > Jólin in the Studio. On (the default): every year from the
 * first Sunday of Advent to the end of 6 January, then it hides itself. Off: no
 * Christmas. Optional from/to dates move the start or the end of ONE season
 * (the one they fall in); the next year runs on the default window again.
 * Dates are Iceland's (UTC, no daylight saving), so every visitor anywhere in
 * the world sees it switch at the same moment. ?jol=1 previews it any day,
 * ?jol=0 hides it.
 *
 * NO FLASH. The red ground is pure CSS keyed on html[data-jol]. A few bytes of
 * inline script, rendered on the server, set that attribute while the page is
 * still being parsed, so the first paint is already red; the snow and the
 * greeting arrive after hydration, which is when they animate in anyway.
 */
import { useEffect, useRef, useState } from 'react'
import type { Lang } from './data'
import { useSiteContent } from './sanity'
import { GOLD, GOLD_LIGHT } from './tokens'

export interface Season { on: boolean }
export type ChristmasConfig = { on: boolean; from?: string; to?: string }

/* The season rule, written ONCE as source text. The inline no-flash script
   embeds this exact text and the app compiles the same text below, so the
   server's markup and the browser's never differ (a serialised, separately
   minified function would) and the two can never disagree about a date.
   Default window: the first Sunday of Advent (the fourth is the last Sunday on
   or before 24 December) up to midnight after 6 January, in UTC = Iceland. A
   date in January to June belongs to the season that began the year before.
   from/to apply only to the season they fall in. */
const SEASON_SRC =
  "function(t,from,to){var D=864e5;function day(s){var p=String(s).split('-');return Date.UTC(+p[0],+p[1]-1,+p[2])}" +
  "function sy(ms){var d=new Date(ms);return d.getUTCMonth()<6?d.getUTCFullYear()-1:d.getUTCFullYear()}" +
  "var y=sy(t),eve=Date.UTC(y,11,24),start=eve-(new Date(eve).getUTCDay()+21)*D,end=Date.UTC(y+1,0,7);" +
  "if(from&&sy(day(from))===y)start=day(from);if(to&&sy(day(to))===y)end=day(to)+D;return t>=start&&t<end}"
// eslint-disable-next-line no-new-func
export const inSeason = new Function('return ' + SEASON_SRC)() as (t: number, from?: string | null, to?: string | null) => boolean

/* ?jol=1 / ?jol=0, matched whole (so ?jol=10 is neither) */
const QUERY_SRC = "function(s){var m=/[?&]jol=([^&#]*)/.exec(s);return m?m[1]:null}"
// eslint-disable-next-line no-new-func
const jolQuery = new Function('return ' + QUERY_SRC)() as (search: string) => string | null

function decide(cfg: ChristmasConfig, search: string, now: number): boolean {
  const q = jolQuery(search)
  if (q === '0') return false
  if (q === '1') return true
  return cfg.on && inSeason(now, cfg.from, cfg.to)
}

/** null until the browser has decided (the server never decides: the inline
 *  script has already painted the right ground, and nothing may undo it in
 *  between). Re-decided when the tab comes back, so a page left open across
 *  6 January lets go of Christmas the next time it is looked at. */
function useSeasonState(): boolean | null {
  const cfg = useSiteContent().christmas
  const [on, setOn] = useState<boolean | null>(null)
  useEffect(() => {
    const run = () => setOn(decide(cfg, window.location.search, Date.now()))
    run()
    const onVis = () => { if (!document.hidden) run() }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [cfg.on, cfg.from, cfg.to])
  return on
}

/** Season state for components that render only in season (snow, greeting). */
export function useChristmas(): Season {
  return { on: useSeasonState() === true }
}

const BASE = `${import.meta.env.BASE_URL}reynir/jol/`

/* ── The season's ground: red velvet under the gold ─────────────────────────
 *
 * Sindri, 13 Nov: "how is that christmassy?? what about changing the dark
 * theme color? dark red over the gold texts? some actual snow". The site's
 * three grounds are CSS variables (tokens.ts); in season they turn from
 * near-black to a deep garnet, and the hero and the deep sections get a
 * photographed velvet. Gold type on #3A0A0E measures about 7:1.
 */
/* ONE ground for the whole page (Sindri: "not super keen on the background
   differences and switchups from the gradient to stale color"). Every section
   and the page root go transparent, and a single velvet photograph sits fixed
   behind all of it, so nothing changes colour as you scroll. The three ground
   tokens collapse to one colour sampled from that velvet, so the few solid
   pieces (cards, the map veil, overlays) match it instead of reading as
   patches. Gold on #400609 measures about 7:1. */
const RED = { ground: '#400609', bar: 'rgba(64,6,9,.9)' }
/** the everyday ground (tokens.ts INK fallback), for the browser bar when the season ends */
const EVERYDAY_INK = '#131313'
const THEME_CSS = `
html[data-jol] { --rb-ink:${RED.ground}; --rb-ink-warm:${RED.ground}; --rb-ink-deep:${RED.ground}; }
html[data-jol], html[data-jol] body { background-color:${RED.ground}; }
/* The header, the strip above it (behind the iPhone clock) and the browser's
   own bar are ONE colour, the ground's, so the header reaches the top edge
   instead of reading as a darker band hung below it. Glass on desktop, solid
   on touch screens, exactly as the everyday site does it. */
html[data-jol] .rb-stickybar { background-color:${RED.bar}; }
html[data-jol] .rb-awning { background:${RED.ground}; }
/* the order page's phone total bar is a hard-coded ink; in season it takes the header's red */
html[data-jol] .rb-ord-mobiletotal { background:${RED.ground}; }
/* the story page's burgundy quote band would read as a lighter red block on the
   one red ground: in season it goes see-through and keeps a hairline either side */
html[data-jol] .rb-st-quote { background:transparent !important; border-top:1px solid rgba(238,211,170,.16); border-bottom:1px solid rgba(238,211,170,.16); }
@media (hover:none) { html[data-jol] .rb-stickybar { background-color:${RED.ground}; } }
/* every page root, section and footer painted with a ground token goes see-through
   (the order form's <option>s keep theirs: a native list must stay opaque) */
html[data-jol] [style*="--rb-ink"]:not(option):not([style*="gradient"]) { background-color:transparent !important; background-image:none !important; }
/* (a gradient that ends in a ground token is a reading scrim over a photograph,
   not a ground: it stays, and its end takes the red) */
/* the map's top and bottom veils fade into the red ground, not into black */
html[data-jol] .rb-mapband-veil { background:linear-gradient(180deg, rgba(64,6,9,.55) 0%, rgba(64,6,9,0) 20%, rgba(64,6,9,0) 55%, rgba(64,6,9,.92) 100%); }
/* small faint text keeps 4.5:1 on the lighter velvet */
html[data-jol] { --rb-faint:rgba(243,234,211,.6); }
.rb-jol-ground { display:none; }
html[data-jol] .rb-jol-ground { display:block; position:fixed; top:0; left:0; width:100%; height:100lvh; z-index:-1; pointer-events:none;
  background:${RED.ground} url(${BASE}velvet-a.webp) center / cover no-repeat; }
/* a steady vignette, the same on every screen: the light sits in the middle */
html[data-jol] .rb-jol-ground::after { content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse 90% 80% at 50% 45%, rgba(20,2,4,0) 40%, rgba(20,2,4,.55) 100%); }
@media (max-width:980px) { html[data-jol] .rb-jol-ground { background-image:url(${BASE}velvet-a-960.webp); } }
@font-face { font-family:'Reynir Jol Script'; src:url(${BASE}fonts/DancingScript-Variable.woff2) format('woff2');
  font-weight:400 700; font-display:swap; }
`

/** Mounted on every page (Chrome.tsx), on the server too: the CSS, the fixed
 *  velvet ground, the no-flash script, and the snow once in season. */
export function Christmas() {
  const cfg = useSiteContent().christmas
  const state = useSeasonState()
  const on = state === true
  const script = `(function(){try{var q=(${QUERY_SRC})(location.search);var on=q==='0'?false:q==='1'?true:(${cfg.on ? 'true' : 'false'}&&(${SEASON_SRC})(Date.now(),${JSON.stringify(cfg.from ?? null)},${JSON.stringify(cfg.to ?? null)}));if(on){document.documentElement.setAttribute('data-jol','');var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content','${RED.ground}')}}catch(e){}})()`
  useEffect(() => {
    if (state === null) return // undecided: leave what the inline script set
    const html = document.documentElement
    const meta = document.querySelector('meta[name="theme-color"]')
    if (state) {
      html.setAttribute('data-jol', '')
      meta?.setAttribute('content', RED.ground)
    } else if (html.hasAttribute('data-jol')) {
      html.removeAttribute('data-jol')
      meta?.setAttribute('content', EVERYDAY_INK)
    }
  }, [state])
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: THEME_CSS + SNOWCAP_CSS }} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <div className="rb-jol-ground" aria-hidden="true" />
      {on && <SnowFall />}
    </>
  )
}

/* ── Snow over the whole page, drawn in code ────────────────────────────────
 *
 * Sindri, 13 Nov: the filmed snow looked like a still, then "weird"; "can we do
 * better snow in code instead?". So: one canvas, fixed to the screen, under
 * the header.
 *
 *  - Three depths. Far: many tiny, dim, slow flakes. Mid: the body of the
 *    fall. Near: a few large, soft, faster flakes. Speed, size, softness and
 *    brightness all follow depth, which is what makes it read as real snow.
 *  - Every flake sways on its own sine (own phase, frequency and width) and
 *    the whole field rides one slow wind that drifts left and right over
 *    ~20 s. Nothing loops: no flake ever repeats a path.
 *  - Scrolling moves the layers at different rates (near the most), so the
 *    snow has depth as the page moves under it.
 *  - Drawn from pre-rendered soft sprites (one per size step), time-based so
 *    the speed is the same at 60 and 120 Hz, density scaled to screen area,
 *    paused when the tab is hidden, thinned past the hero so it never sits
 *    on prices and opening hours. Reduced motion: no snow at all.
 */
const SNOW_CSS = `
.rb-snow { position:fixed; inset:0; z-index:140; pointer-events:none; display:block; width:100%; height:100%;
  opacity:0; transition:opacity 2.4s cubic-bezier(.23,1,.32,1); }
.rb-snow[data-on] { opacity:1; }
.rb-snow[data-on][data-past] { opacity:.5; transition-duration:1.2s; }
@media (prefers-reduced-motion: reduce) { .rb-snow { display:none; } }
`

type Flake = { x: number; y: number; r: number; d: number; vy: number; sw: number; sf: number; sp: number; a: number; sprite: number }

/** depth 0 = far, 1 = near */
const LAYERS = [
  { share: 0.55, d: [0.0, 0.3], r: [0.6, 1.3], vy: [14, 26], a: [0.35, 0.55], soft: 0.25, parallax: 0.05 },
  { share: 0.36, d: [0.35, 0.7], r: [1.4, 2.4], vy: [30, 48], a: [0.6, 0.85], soft: 0.45, parallax: 0.12 },
  { share: 0.09, d: [0.75, 1.0], r: [3.2, 5.6], vy: [55, 80], a: [0.55, 0.8], soft: 0.85, parallax: 0.28 },
]
const rand = (a: number, b: number) => a + Math.random() * (b - a)

/** One soft round sprite per radius step; softer (wider falloff) for near flakes. */
function makeSprites(dpr: number) {
  const out: { c: HTMLCanvasElement; r: number }[] = []
  for (let r = 0.5; r <= 6; r += 0.5) {
    const soft = Math.min(1, Math.max(0.2, (r - 0.5) / 5))
    const R = Math.ceil((r * (1 + soft * 1.6) + 1) * dpr)
    const c = document.createElement('canvas'); c.width = c.height = R * 2
    const g = c.getContext('2d')!
    const grad = g.createRadialGradient(R, R, 0, R, R, R)
    const core = Math.max(0.05, 1 - soft) * (r * dpr) / R
    grad.addColorStop(0, 'rgba(255,253,248,1)')
    grad.addColorStop(Math.min(0.95, core), 'rgba(255,252,245,.9)')
    grad.addColorStop(1, 'rgba(255,250,240,0)')
    g.fillStyle = grad; g.beginPath(); g.arc(R, R, R, 0, Math.PI * 2); g.fill()
    out.push({ c, r: R / dpr })
  }
  return out
}

/* ── The visitor's own switch: "Slökkva á snjónum" ─────────────────────────
 *
 * Moving content that starts by itself and runs longer than five seconds needs
 * a way to stop it (WCAG 2.2.2). A quiet text button in every footer, beside
 * the studio credit; the choice is remembered on this device. Reduced motion
 * never shows snow in the first place.
 */
const SNOW_KEY = 'rb-snow-off'
const snowSubs = new Set<() => void>()
function readSnowOff(): boolean { try { return localStorage.getItem(SNOW_KEY) === '1' } catch { return false } }
function writeSnowOff(v: boolean) {
  try { if (v) localStorage.setItem(SNOW_KEY, '1'); else localStorage.removeItem(SNOW_KEY) } catch { /* private mode: this page only */ }
  memOff = v
  snowSubs.forEach((f) => f())
}
let memOff: boolean | null = null
function useSnowOff(): boolean {
  const [off, setOff] = useState(false)
  useEffect(() => {
    const f = () => setOff(memOff ?? readSnowOff())
    f(); snowSubs.add(f)
    return () => { snowSubs.delete(f) }
  }, [])
  return off
}

const TOGGLE_CSS = `
.rb-snow-toggle { display:inline-flex; align-items:center; gap:8px; background:none; border:0; cursor:pointer;
  padding:12px 0; margin:-12px 0; font:inherit; font-size:12.5px; letter-spacing:.02em; color:var(--rb-faint, rgba(243,234,211,.52));
  transition:color .2s cubic-bezier(.23,1,.32,1); }
.rb-snow-toggle:hover { color:rgba(243,234,211,.86); }
.rb-snow-toggle:focus-visible { outline:1px solid rgba(238,211,170,.5); outline-offset:4px; border-radius:2px; }
.rb-snow-toggle svg { flex:none; }
`
/** Footer switch; renders nothing out of season. */
export function SnowToggle({ lang }: { lang: Lang }) {
  const { on } = useChristmas()
  const off = useSnowOff()
  if (!on) return null
  const label = off
    ? (lang === 'is' ? 'Kveikja á snjónum' : 'Show the snow')
    : (lang === 'is' ? 'Slökkva á snjónum' : 'Hide the snow')
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TOGGLE_CSS }} />
      <button type="button" className="rb-snow-toggle" aria-pressed={!off} onClick={() => writeSnowOff(!off)}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <path d="M8 1.5v13M2.4 4.75l11.2 6.5M2.4 11.25l11.2-6.5M6.3 2.6 8 4.2l1.7-1.6M6.3 13.4 8 11.8l1.7 1.6" />
        </svg>
        {label}
      </button>
    </>
  )
}

export function SnowFall() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [on, setOn] = useState(false)
  const [past, setPast] = useState(false)
  const off = useSnowOff()
  const offRef = useRef(off)
  const syncRef = useRef<() => void>(() => {})
  offRef.current = off
  useEffect(() => { syncRef.current() }, [off])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0, flakes: Flake[] = [], sprites: { c: HTMLCanvasElement; r: number }[] = []
    let raf = 0, last = 0, t = 0, lastScroll = window.scrollY
    let ready = false, disposed = false, idleId = 0, idleKind: 'idle' | 'timeout' | '' = '', rt = 0

    const spawn = (f: Partial<Flake> = {}, top = false): Flake => {
      const L = LAYERS[Math.random() < LAYERS[0].share ? 0 : Math.random() < LAYERS[1].share / (1 - LAYERS[0].share) ? 1 : 2]
      const r = rand(L.r[0], L.r[1])
      return {
        x: rand(-20, W + 20), y: top ? rand(-40, -8) : rand(-20, H),
        r, d: rand(L.d[0], L.d[1]), vy: rand(L.vy[0], L.vy[1]),
        sw: rand(6, 22) * (0.5 + r / 6), sf: rand(0.25, 0.7), sp: rand(0, Math.PI * 2),
        a: rand(L.a[0], L.a[1]), sprite: Math.min(sprites.length - 1, Math.max(0, Math.round(r / 0.5) - 1)), ...f,
      }
    }
    const resize = () => {
      if (disposed) return
      const nd = Math.min(window.devicePixelRatio || 1, 2)
      const nW = window.innerWidth, nH = window.innerHeight
      if (nW === W && nH === H && nd === dpr && sprites.length) return // nothing changed (iOS fires resize as its bars move)
      const widthChanged = nW !== W || nd !== dpr
      dpr = nd; W = nW; H = nH
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (widthChanged || !sprites.length) sprites = makeSprites(dpr)
      const target = Math.round(Math.min(200, Math.max(60, (W * H) / 9000)))
      while (flakes.length < target) flakes.push(spawn())
      flakes.length = target
    }

    const frame = (now: number) => {
      raf = 0
      if (disposed) return
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now; t += dt
      // one slow wind for the whole field, drifting left and right
      const wind = Math.sin(t * 0.31) * 9 + Math.sin(t * 0.13 + 1.7) * 6 - 4
      const sy = window.scrollY, dScroll = sy - lastScroll; lastScroll = sy
      ctx.clearRect(0, 0, W, H)
      for (const f of flakes) {
        const depth = f.d
        f.y += f.vy * dt - dScroll * (0.05 + depth * 0.25)
        f.x += (wind * (0.5 + depth)) * dt
        const sway = Math.sin(t * f.sf * Math.PI * 2 * 0.25 + f.sp) * f.sw
        if (f.y > H + 12) Object.assign(f, spawn({}, true))
        else if (f.y < -50) f.y = H + 10
        if (f.x < -30) f.x += W + 60; else if (f.x > W + 30) f.x -= W + 60
        const s = sprites[f.sprite]
        ctx.globalAlpha = f.a
        ctx.drawImage(s.c, f.x + sway - s.r, f.y - s.r, s.r * 2, s.r * 2)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    /* One place decides whether the loop runs: started, tab visible, motion
       allowed, not switched off. At most one frame is ever queued. */
    const sync = () => {
      if (disposed) return
      const run = ready && !document.hidden && !mq.matches && !offRef.current
      if (run && !raf) { last = 0; lastScroll = window.scrollY; raf = requestAnimationFrame(frame) }
      if (!run && raf) { cancelAnimationFrame(raf); raf = 0 }
      setOn(ready && !mq.matches && !offRef.current)
    }
    syncRef.current = sync
    const start = () => { idleKind = ''; if (disposed) return; ready = true; resize(); sync() }
    // after the page has loaded and the browser is idle: never ahead of the hero
    const idle = () => {
      if (disposed) return
      if ('requestIdleCallback' in window) { idleKind = 'idle'; idleId = (window as any).requestIdleCallback(start, { timeout: 1200 }) }
      else { idleKind = 'timeout'; idleId = window.setTimeout(start, 200) }
    }
    if (document.readyState === 'complete') idle(); else window.addEventListener('load', idle, { once: true })

    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(resize, 150) }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', sync)
    mq.addEventListener?.('change', sync)

    /* quieter past the first screen: on the home page once the hero is mostly
       gone, on every other page once the reader has scrolled past its top */
    const cover = document.querySelector('.rb-cover')
    let io: IntersectionObserver | null = null
    let onScroll: (() => void) | null = null
    if (cover) {
      io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting || e.intersectionRatio < 0.35), { threshold: [0, 0.35, 1] })
      io.observe(cover)
    } else {
      onScroll = () => setPast(window.scrollY > window.innerHeight * 0.5)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    return () => {
      disposed = true
      if (raf) cancelAnimationFrame(raf); raf = 0
      if (idleKind === 'idle') (window as any).cancelIdleCallback?.(idleId)
      else if (idleKind === 'timeout') clearTimeout(idleId)
      clearTimeout(rt)
      window.removeEventListener('load', idle); window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', sync); mq.removeEventListener?.('change', sync)
      io?.disconnect(); if (onScroll) window.removeEventListener('scroll', onScroll)
      syncRef.current = () => {}
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SNOW_CSS }} />
      <canvas ref={ref} className="rb-snow" aria-hidden="true" data-on={on || undefined} data-past={past || undefined} />
    </>
  )
}

/* ── "Gleðileg jól", written in over the headline ───────────────────────────
 *
 * In a hand like the logo's signature, gold, leaning in over the top of
 * HANDGERT the way a greeting is written on a card. It is written on left to
 * right (a clip that follows the pen) after the hero has arrived.
 */
const SCRIPT_CSS = `
.rb-jol-script { margin:clamp(14px,2.4vh,26px) 0 0; font-family:'Reynir Jol Script', cursive; font-weight:600;
  font-size:clamp(44px,5.6vw,86px); line-height:1; letter-spacing:.005em;
  transform:rotate(-5deg); transform-origin:0 100%; position:relative; z-index:3;
  margin-bottom:calc(-0.32 * clamp(44px,5.6vw,86px));
  background:linear-gradient(180deg, ${GOLD_LIGHT} 10%, ${GOLD} 62%, #A98C5F 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent;
  filter:drop-shadow(0 2px 0 rgba(0,0,0,.45));
  padding:0 .12em .2em 0; clip-path:inset(-.2em 100% -.3em -.2em);
  animation:rb-jol-write 1.9s cubic-bezier(.55,.1,.25,1) 1.1s forwards; }
[data-curtain="playing"] .rb-jol-script { animation-delay:2.4s; }
html[data-rb-seen] [data-curtain="playing"] .rb-jol-script { animation-delay:1.1s; }
@keyframes rb-jol-write { to { clip-path:inset(-.2em -.2em -.3em -.2em); } }
@media (max-width:980px) { .rb-jol-script { transform:rotate(-4deg); transform-origin:50% 100%; } }
@media (prefers-reduced-motion: reduce) { .rb-jol-script { animation:none; clip-path:none; } }
`

/* ── Snow lying on HANDGERT ────────────────────────────────────────────────
 *
 * Sindri: "put some snow ontop of the handgert". Drawn from the real letters:
 * the word is rasterised off-screen at the heading's exact font and letter
 * positions (each glyph placed where the browser put it), its top edge is read
 * column by column, and a pillow of snow is drawn along it. Thick on flat tops
 * (serifs, the bar of T, the crown of D and G), thin to nothing on steep sides
 * (snow slides off the A), rounded where a surface ends, with a slow irregular
 * top so no two letters carry the same snow. It settles onto the letters
 * after the heading arrives; redrawn on resize and once the fonts are in.
 */
const SNOWCAP_CSS = `
.rb-snowcap { position:relative; }
.rb-snowcap-canvas { position:absolute; left:0; top:0; pointer-events:none; z-index:1;
  opacity:0; transform:translateY(-0.05em);
  animation:rb-snow-settle 1.7s cubic-bezier(.22,1,.36,1) 1.9s forwards; }
[data-curtain="playing"] .rb-snowcap-canvas { animation-delay:3.3s; }
html[data-rb-seen] [data-curtain="playing"] .rb-snowcap-canvas { animation-delay:1.9s; }
@keyframes rb-snow-settle { to { opacity:1; transform:none; } }
@media (prefers-reduced-motion: reduce) { .rb-snowcap-canvas { animation:none; opacity:1; transform:none; } }
`

function drawSnowCap(h1: HTMLElement, canvas: HTMLCanvasElement) {
  const text = h1.firstChild
  if (!text || text.nodeType !== 3) return
  const cs = getComputedStyle(h1)
  const fs = parseFloat(cs.fontSize)
  const box = h1.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const pad = Math.ceil(fs * 0.12) // room above the letters for the snow
  const W = Math.ceil(box.width), H = Math.ceil(fs * 0.6) + pad
  // 1. the word, off-screen, each glyph exactly where the browser laid it out
  const off = document.createElement('canvas'); off.width = W * dpr; off.height = H * dpr
  const o = off.getContext('2d')!; o.scale(dpr, dpr)
  o.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`; o.textBaseline = 'alphabetic'; o.fillStyle = '#000'
  const str = text.textContent || ''
  const range = document.createRange()
  const m = o.measureText('H'); const capFromBase = m.actualBoundingBoxAscent
  let baseY = 0, lineTop = NaN
  for (let i = 0; i < str.length; i++) {
    range.setStart(text, i); range.setEnd(text, i + 1)
    const r = range.getBoundingClientRect()
    if (!r.width) continue
    // snow lies on the top line only: a heading that wraps (a long English
    // title, a phone, a reader's large text) keeps its later lines bare
    if (Number.isNaN(lineTop)) lineTop = r.top
    else if (Math.abs(r.top - lineTop) > fs * 0.5) break
    if (!baseY) { const fm = o.measureText(str[i]); baseY = (r.top - box.top) + fm.fontBoundingBoxAscent }
    o.fillText(str[i], r.left - box.left, baseY - (box.top - box.top) + pad - (0))
  }
  // 2. the top edge, column by column (in CSS px)
  const img = o.getImageData(0, 0, off.width, off.height).data
  const capY = baseY + pad - capFromBase
  const reach = fs * 0.2 // a column counts as a top surface if its ink starts within this of the cap line
  const top: number[] = new Array(W).fill(NaN)
  for (let x = 0; x < W; x++) {
    const px = Math.round(x * dpr)
    for (let y = Math.max(0, Math.floor((capY - fs * 0.05) * dpr)); y < Math.min(off.height, (capY + reach) * dpr); y++) {
      if (img[(y * off.width + px) * 4 + 3] > 110) { top[x] = y / dpr; break }
    }
  }
  // 3. snow thickness: noise, slope, rounded ends
  const ctx = canvas.getContext('2d')!
  canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
  canvas.style.top = `${-pad}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H)
  const base = fs * 0.082
  const seed = 7.3
  // low-frequency only: an uneven drift, never a ragged one
  const noise = (x: number) => 0.8 + 0.14 * Math.sin(x / (fs * 0.23) + seed) + 0.06 * Math.sin(x / (fs * 0.11) + seed * 2.1)
  const smooth = (arr: number[], k: number) => arr.map((_, i) => {
    let sum = 0, n = 0
    for (let j = Math.max(0, i - k); j <= Math.min(arr.length - 1, i + k); j++) { sum += arr[j]; n++ }
    return sum / n
  })
  const runs: [number, number][] = []
  for (let x = 0; x < W; x++) {
    if (Number.isNaN(top[x])) continue
    let e = x; while (e + 1 < W && !Number.isNaN(top[e + 1]) && Math.abs(top[e + 1] - top[e]) < fs * 0.06) e++
    // a surface carries snow only if it reaches up to the cap line: the inner
    // corner where N's diagonal meets its stem is a top edge too, but a low one
    let hi = Infinity; for (let k = x; k <= e; k++) hi = Math.min(hi, top[k])
    if (e - x > fs * 0.03 && hi < capY + fs * 0.04) runs.push([x, e]); x = e
  }
  const grad = ctx.createLinearGradient(0, 0, 0, pad + fs * 0.06)
  grad.addColorStop(0, '#FFFFFF'); grad.addColorStop(0.75, '#FFFEFB'); grad.addColorStop(1, '#F1ECE4')
  ctx.fillStyle = grad
  ctx.shadowColor = 'rgba(35,3,5,.4)'; ctx.shadowBlur = fs * 0.018; ctx.shadowOffsetY = fs * 0.006
  const ov = Math.round(fs * 0.014) // snow overhangs the edge of a surface a little, as real snow does
  for (const [a0, b0] of runs) {
    // the surface, smoothed so antialiasing and serif nicks never show as spikes
    const surf = smooth(top.slice(a0, b0 + 1), Math.max(2, Math.round(fs * 0.012)))
    const a = a0 - ov, b = b0 + ov, n = b - a + 1
    const at = (x: number) => surf[Math.min(surf.length - 1, Math.max(0, x - a0))]
    const thick: number[] = []
    for (let x = a; x <= b; x++) {
      const slope = Math.abs(at(x + 3) - at(x - 3)) / 6
      const flat = Math.max(0, 1 - slope * 1.4)
      const u = Math.min(1, Math.min(x - a, b - x) / Math.min(fs * 0.06, n / 2)) // 0 at the ends
      const round = Math.sqrt(1 - (1 - u) * (1 - u)) // a quarter circle: rounded, not chamfered
      // snow gathers on the tops; below them (a shoulder sloping away, a nick in
      // a diagonal) it fades out within a few hundredths of an em
      const below = at(x) - capY
      const near = Math.max(0, Math.min(1, 1 - (below - fs * 0.03) / (fs * 0.03)))
      thick.push(base * noise(x) * flat * round * near)
    }
    const t = smooth(thick, Math.max(2, Math.round(fs * 0.03)))
    // draw only where there is real snow; the seat under it (where it meets the
    // letter) scales with it, so a steep side that shed its snow stays bare gold
    const MIN = fs * 0.006
    let i = 0
    while (i < n) {
      while (i < n && t[i] < MIN) i++
      if (i >= n) break
      let j = i; while (j + 1 < n && t[j + 1] >= MIN) j++
      ctx.beginPath()
      ctx.moveTo(a + i, at(a + i))
      for (let k = i; k <= j; k++) ctx.lineTo(a + k, at(a + k) - t[k])
      for (let k = j; k >= i; k--) ctx.lineTo(a + k, at(a + k) + Math.min(fs * 0.012, t[k] * 0.3))
      ctx.closePath(); ctx.fill()
      i = j + 1
    }
  }
}

export function SnowCap({ text }: { text: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current, h1 = canvas?.parentElement
    if (!canvas || !h1) return
    let rt = 0, gone = false
    const draw = () => { if (!gone) drawSnowCap(h1, canvas) }
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(draw, 120) }
    document.fonts.ready.then(draw)
    window.addEventListener('resize', onResize)
    return () => { gone = true; clearTimeout(rt); window.removeEventListener('resize', onResize) }
  }, [text])
  // its CSS ships with the site-wide Christmas styles, never inside the heading
  return <canvas ref={ref} className="rb-snowcap-canvas" aria-hidden="true" />
}

export function JolScript({ lang }: { lang: Lang }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SCRIPT_CSS }} />
      <p className="rb-jol-script" lang={lang}>{lang === 'is' ? 'Gleðileg jól' : 'Merry Christmas'}</p>
    </>
  )
}
