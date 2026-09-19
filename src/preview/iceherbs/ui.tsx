import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/* The noho.ink system, transplanted. See _docs/noho-teardown.md.
   The two rules that carry the whole thing:
     1. Nothing fades. Every reveal is y:+ownHeight -> 0 inside a clipped
        parent, opacity untouched. Title lines start at 108% so a descender
        on the line below never peeks above the mask edge.
     2. One ease does almost everything: cubic-bezier(0.17,0.17,0,1).
   Deviations from the reference are listed in _docs/ICEHERBS-DESIGN-2026-09-19.md. */

export const C = {
  mosi: '#25422D',
  mosi2: '#2B473A',
  jokull: '#B5D4D3',
  jokullLj: '#CAE4E2',
  blek: '#24232C',
  pappir: '#E7E4DD',
  pappirHreint: '#F2F0EB',
}

export const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true

/* ---------------------------------------------------------------- *
 * Tokens. @property is what makes the 0.6s theme change actually
 * interpolate rather than snap: the reference tweens all 24 of its
 * custom properties individually, and this is the CSS equivalent.
 * ---------------------------------------------------------------- */
export const CSS = `
@property --c-bg { syntax: '<color>'; inherits: true; initial-value: #F2F0EB }
@property --c-ink { syntax: '<color>'; inherits: true; initial-value: #24232C }
@property --c-mosi { syntax: '<color>'; inherits: true; initial-value: #25422D }
@property --c-flotur { syntax: '<color>'; inherits: true; initial-value: #E7E4DD }
@property --c-lina { syntax: '<color>'; inherits: true; initial-value: rgba(36,35,44,.16) }

.ih-root{
  --c-bg:#F2F0EB; --c-ink:#24232C; --c-mosi:#25422D; --c-flotur:#E7E4DD;
  --c-lina:rgba(36,35,44,.16); --c-jokull:#B5D4D3;
  --ease:cubic-bezier(.17,.17,0,1);
  --gut:clamp(1.1rem,4.2vw,4.5rem);
  --band:clamp(4.4rem,9vw,12.5rem);
  --col:clamp(.9rem,1.6vw,2rem);
  --stem:calc(var(--gut) + clamp(0px,1.4vw,26px));
  background:var(--c-bg); color:var(--c-ink);
  font-family:'Technor',system-ui,sans-serif;
  font-size:clamp(16px,1.02vw,18px); line-height:1.55;
  -webkit-font-smoothing:antialiased;
  transition:--c-bg .6s var(--ease), --c-ink .6s var(--ease), --c-flotur .6s var(--ease), --c-lina .6s var(--ease);
}
.ih-root[data-tema="dokkt"]{
  --c-bg:#1B211C; --c-ink:#E7E4DD; --c-mosi:#B5D4D3; --c-flotur:#242C25;
  --c-lina:rgba(231,228,221,.18);
}
.ih-root *,.ih-root *::before,.ih-root *::after{box-sizing:border-box}
.ih-root img{display:block;max-width:100%;height:auto}
.ih-root a{color:inherit;text-decoration:none}
.ih-root :focus-visible{outline:2px solid var(--c-jokull);outline-offset:3px}

/* type ---------------------------------------------------------- */
.ih-disp{
  font-weight:600; letter-spacing:-.04em; line-height:1;
  /* vw-locked like the reference, but capped: Breytingaskeiðið and
     Húðnæringarpakkinn overflow a 360px column at a raw 13.33vw */
  font-size:clamp(2.1rem,4.17vw,5.2rem);
  margin:0; text-wrap:balance;
}
@media (max-width:991px){ .ih-disp{ font-size:clamp(2rem,6.25vw,3.3rem); line-height:.95 } }
@media (max-width:479px){ .ih-disp{ font-size:clamp(1.85rem,10.4vw,2.6rem); line-height:.95 } }
.ih-mid{font-weight:500;letter-spacing:-.025em;line-height:1.1;font-size:clamp(1.25rem,2.08vw,2rem);margin:0}
.ih-merki{font-size:clamp(.72rem,.84vw,.82rem);letter-spacing:.14em;text-transform:uppercase;font-weight:500;
  color:var(--c-mosi);margin:0 0 1.1em}
.ih-brod{max-width:62ch;margin:0;color:var(--c-ink)}
.ih-verd{font-variant-numeric:tabular-nums;font-weight:500}

/* the stem: one hairline doing three jobs, the grid, the timeline and the
   moss. It draws itself as the page scrolls. ---------------------- */
.ih-stem{position:absolute;left:var(--stem);top:0;bottom:0;width:1px;background:var(--c-lina);
  transform-origin:top;transform:scaleY(0);pointer-events:none;will-change:transform}
.ih-band{position:relative;padding:var(--band) 0}
.ih-wrap{padding:0 var(--gut);position:relative}
.ih-inn{padding-left:calc(var(--stem) - var(--gut) + 1.6rem)}
@media (max-width:760px){ .ih-inn{padding-left:1.4rem} }

/* mask rise. opacity is never animated anywhere on this page. --- */
.ih-mask{overflow:hidden;display:block}
.ih-up{transform:translateY(100%);transition:transform .95s var(--ease);transition-delay:var(--d,0s);will-change:transform}
.ih-lina{transform:translateY(108%)}
.on .ih-up,.ih-up.on{transform:translateY(0)}

/* flotur = the one container. no rounded card, no shadow, no border box:
   a tint and a hairline above it, which is how the reference groups. -- */
.ih-flotur{background:var(--c-flotur);padding:clamp(1.1rem,2vw,1.7rem)}

.ih-hnappur{display:inline-block;padding:.95em 1.5em;background:var(--c-mosi);color:var(--c-bg);
  font-size:1rem;font-weight:500;letter-spacing:.01em;border:0;cursor:pointer;
  transition:background .3s var(--ease),transform .3s var(--ease)}
.ih-hnappur.ljos{background:transparent;color:var(--c-ink);box-shadow:inset 0 0 0 1px var(--c-lina)}
.ih-hnappur:active{transform:scale(.98)}
@media (hover:hover) and (pointer:fine){ .ih-hnappur:hover{background:var(--c-ink)} .ih-hnappur.ljos:hover{background:var(--c-flotur)} }

/* header --------------------------------------------------------- */
.ih-haus{position:fixed;top:0;left:0;right:0;z-index:40;display:flex;align-items:center;
  justify-content:space-between;gap:1rem;padding:.75rem var(--gut);
  transition:background .4s var(--ease)}
.ih-haus.fest{background:color-mix(in srgb,var(--c-bg) 92%,transparent);backdrop-filter:blur(8px)}
.ih-merkid{font-weight:600;letter-spacing:.12em;font-size:.95rem}
.ih-hausH{display:flex;align-items:center;gap:.5rem}

/* Orkunotkun. The reference's best idea: the two accessibility switches
   report as a live energy reading in the header. ------------------ */
.ih-orka{display:flex;align-items:center;gap:.5rem;background:transparent;border:0;cursor:pointer;
  font:inherit;font-size:.82rem;color:inherit;padding:.4rem .2rem}
.ih-orkaG{height:1.15em;overflow:hidden;display:inline-block}
.ih-orkaR{display:block;transition:transform .4s var(--ease);transform:translateY(calc(var(--stig,0) * -1.15em))}
.ih-orkaR span{display:block;height:1.15em;line-height:1.15em;font-weight:600;color:var(--c-mosi)}
.ih-spjald{position:absolute;top:100%;right:var(--gut);width:min(22rem,calc(100vw - 2 * var(--gut)));
  background:var(--c-flotur);padding:1.15rem;display:grid;gap:1rem;
  box-shadow:inset 0 1px 0 var(--c-lina)}
.ih-rofiRod{display:flex;align-items:center;justify-content:space-between;gap:1rem}
.ih-rofi{width:34px;height:18px;border-radius:999px;background:var(--c-lina);border:0;cursor:pointer;
  padding:2px;display:flex;flex-shrink:0;transition:background .2s var(--ease)}
.ih-rofi[aria-checked="true"]{background:var(--c-mosi)}
.ih-rofi i{width:14px;height:14px;border-radius:999px;background:var(--c-bg);display:block;
  transition:transform .2s var(--ease)}
.ih-rofi[aria-checked="true"] i{transform:translateX(16px)}
.ih-smatt{font-size:.78rem;line-height:1.45;color:var(--c-ink);opacity:.75;margin:.25rem 0 0}

/* cursor --------------------------------------------------------- */
.ih-bendill{position:fixed;top:0;left:0;z-index:70;pointer-events:none;border-radius:999px;
  display:grid;place-items:center;background:transparent;color:var(--c-bg);
  width:118px;height:118px;margin:-59px 0 0 -59px;
  font-size:.9rem;font-weight:500;overflow:hidden;will-change:transform}
/* the disc is one fixed box scaled on the GPU, never resized: animating
   width/height/margin here would be layout work on every pointer move */
.ih-bendill i{display:block;position:absolute;inset:0;border-radius:inherit;
  background:var(--c-mosi);transform:scale(.127);
  transition:transform .4s var(--ease)}
.ih-bendill.stor i{transform:scale(1)}
.ih-bendill b{position:relative;font-weight:500;opacity:0;transition:opacity .25s var(--ease)}
.ih-bendill.stor b{opacity:1}
@media (hover:none),(pointer:coarse){ .ih-bendill{display:none} }

/* intro. Two stages with a hitch in the middle, exactly as measured. */
.ih-intro{position:fixed;inset:0;z-index:90;background:var(--c-mosi);
  display:grid;place-items:center;transform:translateY(0);
  transition:transform 1.5s cubic-bezier(.5,0,0,1)}
.ih-intro.farid{transform:translateY(-100%)}
.ih-intro p{color:var(--c-bg);font-size:clamp(1.4rem,3vw,2.4rem);font-weight:600;letter-spacing:-.03em;margin:0}

/* screensaver ---------------------------------------------------- */
.ih-hvild{position:fixed;inset:0;z-index:80;background:var(--c-mosi);
  opacity:0;visibility:hidden;transition:opacity .38s var(--ease),visibility .38s}
.ih-hvild.a{opacity:1;visibility:visible}
.ih-hvild canvas{display:block;width:100%;height:100%}

@media (prefers-reduced-motion:reduce){
  .ih-root *{transition-duration:.15s !important;animation-duration:.15s !important}
  .ih-up{transform:none !important}
  .ih-stem{transform:none !important}
  .ih-intro{display:none}
}
.ih-root[data-hreyfing="min"] .ih-up{transform:none !important;transition:none !important}
/* watchdog: nothing may stay masked forever because an observer never fired */
.ih-root.ih-allt .ih-up{transform:translateY(0)}
.ih-root[data-hreyfing="min"] .ih-stem,.ih-root.ih-allt .ih-stem{transform:scaleY(1) !important}
.ih-root[data-hreyfing="min"] .ih-stem{transform:none !important}
`

/* ---------------------------------------------------------------- *
 * Reveal. IntersectionObserver, never a scroll listener. On compact
 * widths every child gets its own observer instead of a group stagger,
 * which is what the reference itself does at 390.
 * ---------------------------------------------------------------- */
/** Reveals anything still masked after 8s, so a missed observer can never
 *  leave content permanently off-screen. The reference does the same with its
 *  12s preloader watchdog. */
export function useWatchdog(ms = 8000) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      document.querySelector('.ih-root')?.classList.add('ih-allt')
    }, ms)
    return () => window.clearTimeout(t)
  }, [ms])
}

export function useInview<T extends HTMLElement>(margin = '0px 0px -18% 0px') {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) { el.classList.add('on'); return }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('on'); io.disconnect() } },
      { rootMargin: margin, threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return ref
}

export function Reveal({ as: Tag = 'div', className = '', children, style }: {
  as?: 'div' | 'section' | 'article' | 'ul' | 'li' | 'header' | 'footer'
  className?: string; children: ReactNode; style?: CSSProperties
}) {
  const ref = useInview<HTMLDivElement>()
  return (
    <Tag ref={ref as never} className={className} style={style}>{children}</Tag>
  )
}

/** 0.07s per step, the reference's stagger rounded to this page's tempo. */
export const step = (i: number): CSSProperties => ({ ['--d' as string]: `${(i * 0.07).toFixed(2)}s` })

/** A headline, split to lines, each rising out of its own mask at 108%. */
export function Ord({ text, className = '', tag: Tag = 'h2', hold = 0 }: {
  text: string; className?: string; tag?: 'h1' | 'h2' | 'h3'; hold?: number
}) {
  const lines = text.split(' | ')
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span className="ih-mask" key={l + i}>
          <span className="ih-up ih-lina" style={{ ['--d' as string]: `${(hold + i * 0.08).toFixed(2)}s` }}>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

export function Merki({ children }: { children: ReactNode }) {
  return <p className="ih-merki"><span className="ih-mask"><span className="ih-up">{children}</span></span></p>
}

/* ---------------------------------------------------------------- *
 * The stem. Draws itself against scroll progress through its own
 * section, driven by rAF that only runs while the section is on screen.
 * ---------------------------------------------------------------- */
export function Stem() {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return
    const host = el.parentElement
    if (!host) return
    let raf = 0
    let live = false
    const run = () => {
      const r = host.getBoundingClientRect()
      const p = Math.max(0, Math.min(1, (window.innerHeight - r.top) / (r.height + window.innerHeight * 0.4)))
      el.style.transform = `scaleY(${p.toFixed(3)})`
      raf = live ? requestAnimationFrame(run) : 0
    }
    const io = new IntersectionObserver(([e]) => {
      live = e.isIntersecting
      if (live && !raf) raf = requestAnimationFrame(run)
    }, { rootMargin: '30% 0px' })
    io.observe(host)
    return () => { live = false; io.disconnect(); if (raf) cancelAnimationFrame(raf) }
  }, [])
  return <div className="ih-stem" ref={ref} aria-hidden="true" />
}

/* ---------------------------------------------------------------- *
 * Magnet cursor. A dot that grows and puts a word in itself, so the
 * label tells you what the click does before you make it.
 * ---------------------------------------------------------------- */
export function Bendill() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [ord, setOrd] = useState('')
  useEffect(() => {
    if (!finePointer() || reduced()) return
    const el = ref.current
    if (!el) return
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0
    const tick = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      el.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`
      /* park the loop once it has caught up; a pointer move wakes it again */
      raf = Math.abs(x - cx) > 0.3 || Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0
    }
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY
      if (!raf) raf = requestAnimationFrame(tick)
      const t = (e.target as HTMLElement)?.closest?.('[data-bendill]') as HTMLElement | null
      setOrd(t?.dataset.bendill ?? '')
    }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div className={`ih-bendill${ord ? ' stor' : ''}`} ref={ref} aria-hidden="true">
      <i /><b>{ord}</b>
    </div>
  )
}

/* ---------------------------------------------------------------- *
 * Intro. The reference releases scroll from the title tween rather
 * than from the timeline, and carries three escape hatches. Both are
 * reproduced: a 2.4s normal exit, plus visibilitychange, pageshow and
 * a hard watchdog.
 * ---------------------------------------------------------------- */
export function Intro() {
  const [farid, setFarid] = useState(false)
  const [burt, setBurt] = useState(() => reduced() || !finePointer())
  useEffect(() => {
    if (burt) { document.documentElement.style.removeProperty('overflow'); return }
    document.documentElement.style.overflow = 'hidden'
    const t0 = Date.now()
    let done = false
    const ljuka = () => {
      if (done) return
      done = true
      setFarid(true)
      document.documentElement.style.removeProperty('overflow')
      window.setTimeout(() => setBurt(true), 1500)
    }
    const timer = window.setTimeout(ljuka, Math.max(0, 1500 - (Date.now() - t0)))
    const watchdog = window.setTimeout(ljuka, 6000)
    const onHide = () => { if (document.hidden) ljuka() }
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) ljuka() }
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pageshow', onShow)
    window.addEventListener('pointerdown', ljuka, { once: true })
    window.addEventListener('keydown', ljuka, { once: true })
    return () => {
      window.clearTimeout(timer); window.clearTimeout(watchdog)
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pageshow', onShow)
      document.documentElement.style.removeProperty('overflow')
    }
  }, [burt])
  if (burt) return null
  return (
    <div className={`ih-intro${farid ? ' farid' : ''}`} aria-hidden="true">
      <p>Úr sama grasi</p>
    </div>
  )
}

/* ---------------------------------------------------------------- *
 * Orkunotkun. state = (dark ? 1 : 2) - (reduce ? 1 : 0), clamped 0..2,
 * read out as Mikil / Miðlungs / Lítil. Same arithmetic as the
 * reference. prefers-reduced-motion seeds the reduce switch, which the
 * reference does not do.
 * ---------------------------------------------------------------- */
export function Orkunotkun() {
  const [opid, setOpid] = useState(false)
  const [dokkt, setDokkt] = useState(false)
  const [min, setMin] = useState(() => reduced())
  const stig = Math.max(0, Math.min(2, (dokkt ? 1 : 2) - (min ? 1 : 0)))

  useEffect(() => {
    const root = document.querySelector('.ih-root') as HTMLElement | null
    if (!root) return
    root.dataset.tema = dokkt ? 'dokkt' : 'ljost'
    root.dataset.hreyfing = min ? 'min' : 'full'
    if (min) root.querySelectorAll('.ih-up').forEach((n) => n.classList.add('on'))
  }, [dokkt, min])

  return (
    <div style={{ position: 'relative' }}>
      <button className="ih-orka" aria-expanded={opid} onClick={() => setOpid((v) => !v)}>
        <span>Orkunotkun</span>
        <span className="ih-orkaG" aria-live="polite">
          <span className="ih-orkaR" style={{ ['--stig' as string]: stig }}>
            <span>Lítil</span><span>Miðlungs</span><span>Mikil</span>
          </span>
        </span>
      </button>
      {opid ? (
        <div className="ih-spjald">
          <p className="ih-smatt" style={{ margin: 0 }}>
            Dökkt útlit og minni hreyfing spara rafhlöðu og draga úr álagi á tækið.
          </p>
          <div>
            <div className="ih-rofiRod">
              <span>Dökkt útlit</span>
              <button className="ih-rofi" role="switch" aria-checked={dokkt}
                aria-label="Dökkt útlit" onClick={() => setDokkt((v) => !v)}><i /></button>
            </div>
            <p className="ih-smatt">Sparar orku á OLED skjám.</p>
          </div>
          <div>
            <div className="ih-rofiRod">
              <span>Minni hreyfing</span>
              <button className="ih-rofi" role="switch" aria-checked={min}
                aria-label="Minni hreyfing" onClick={() => setMin((v) => !v)}><i /></button>
            </div>
            <p className="ih-smatt">Slekkur á hreyfingum á síðunni.</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function Haus() {
  const [fest, setFest] = useState(false)
  const sentinel = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setFest(!e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <>
      <div ref={sentinel} style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 24, pointerEvents: 'none' }} />
      <header className={`ih-haus${fest ? ' fest' : ''}`}>
        <span className="ih-merkid">ICEHERBS</span>
        <div className="ih-hausH"><Orkunotkun /></div>
      </header>
    </>
  )
}

/* ---------------------------------------------------------------- *
 * Screensaver. 60s idle, fine pointer only, never while the tab is
 * hidden. A cut-out of their own bottle bouncing on the moss green,
 * recoloured on every wall hit from their own product range.
 * ---------------------------------------------------------------- */
const LITIR = ['#B5D4D3', '#E7E4DD', '#8FA98C', '#CAE4E2', '#A8B6AC']

export function Hvild({ mynd }: { mynd: string }) {
  const [virk, setVirk] = useState(false)
  const wrap = useRef<HTMLDivElement | null>(null)
  const cv = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!finePointer() || reduced()) return
    let t = 0
    const arm = () => { window.clearTimeout(t); setVirk(false); t = window.setTimeout(() => { if (!document.hidden) setVirk(true) }, 60000) }
    const evts: (keyof WindowEventMap)[] = ['pointermove', 'pointerdown', 'keydown', 'wheel']
    evts.forEach((e) => window.addEventListener(e, arm, { passive: true, capture: true }))
    document.addEventListener('visibilitychange', arm)
    arm()
    return () => {
      window.clearTimeout(t)
      evts.forEach((e) => window.removeEventListener(e, arm, { capture: true } as never))
      document.removeEventListener('visibilitychange', arm)
    }
  }, [])

  useEffect(() => {
    if (!virk) return
    const c = cv.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0
    const size = () => {
      w = window.innerWidth; h = window.innerHeight
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr)
      c.style.width = `${w}px`; c.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()
    const im = new Image()
    im.src = mynd
    let raf = 0
    const H = () => Math.max(120, h * 0.42)
    let bw = 120, bh = 160
    let x = w * 0.3, y = h * 0.3
    const ang = Math.random() * Math.PI * 2
    let vx = Math.cos(ang) * 190, vy = Math.sin(ang) * 190
    if (Math.abs(vx) < 60) vx = vx < 0 ? -90 : 90
    if (Math.abs(vy) < 60) vy = vy < 0 ? -90 : 90
    let litur = 0
    let last = performance.now()
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (im.naturalWidth) {
        bh = H(); bw = (im.naturalWidth / im.naturalHeight) * bh
      }
      x += vx * dt; y += vy * dt
      let hit = false
      if (x <= 0) { x = 0; vx = Math.abs(vx); hit = true }
      if (y <= 0) { y = 0; vy = Math.abs(vy); hit = true }
      if (x + bw >= w) { x = w - bw; vx = -Math.abs(vx); hit = true }
      if (y + bh >= h) { y = h - bh; vy = -Math.abs(vy); hit = true }
      if (hit) litur = (litur + 1) % LITIR.length
      ctx.clearRect(0, 0, w, h)
      if (im.naturalWidth) {
        ctx.save()
        ctx.globalAlpha = 0.92
        ctx.drawImage(im, x, y, bw, bh)
        ctx.globalCompositeOperation = 'source-atop'
        ctx.fillStyle = LITIR[litur]
        ctx.globalAlpha = 0.55
        ctx.fillRect(x, y, bw, bh)
        ctx.restore()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', size)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size) }
  }, [virk, mynd])

  return (
    <div className={`ih-hvild${virk ? ' a' : ''}`} ref={wrap} aria-hidden="true">
      <canvas ref={cv} />
    </div>
  )
}
