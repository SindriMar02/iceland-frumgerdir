import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'

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
const F = (n: string) => `${import.meta.env.BASE_URL}fonts/switzer/${n}`

export const CSS = `
/* Switzer, which is the reference's own typeface (measured off noho.ink:
   font-family "Switzer, sans-serif", display weight 600). It is already in
   this repo and carries full Icelandic: Þ Ð æ and every acute, checked with
   fontTools rather than by eye. The previous build named 'Technor' with no
   @font-face behind it anywhere, so every word on the page was actually
   rendering in system-ui. */
@font-face{font-family:'IH Switzer';src:url('${F('Switzer-Regular.woff2')}') format('woff2');
  font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'IH Switzer';src:url('${F('Switzer-Medium.woff2')}') format('woff2');
  font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:'IH Switzer';src:url('${F('Switzer-Semibold.woff2')}') format('woff2');
  font-weight:600;font-style:normal;font-display:swap}
@font-face{font-family:'IH Switzer';src:url('${F('Switzer-Bold.woff2')}') format('woff2');
  font-weight:700;font-style:normal;font-display:swap}

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
  background:var(--c-bg); color:var(--c-ink);
  font-family:'IH Switzer',system-ui,sans-serif;
  font-size:clamp(16px,1.02vw,18px); line-height:1.55;
  -webkit-font-smoothing:antialiased;
  transition:--c-bg .6s var(--ease), --c-ink .6s var(--ease), --c-flotur .6s var(--ease), --c-lina .6s var(--ease);
}
.ih-root[data-tema="dokkt"]{
  --c-bg:#1B211C; --c-ink:#E7E4DD; --c-mosi:#B5D4D3; --c-flotur:#242C25;
  --c-lina:rgba(231,228,221,.18);
}
.ih-root *,.ih-root *::before,.ih-root *::after{box-sizing:border-box}
/* Guidelines pass. touch-action kills the synthetic tap delay, and the tap
   highlight is set deliberately rather than left as the UA's grey flash -
   on the colour tiles the default reads as a dirty rectangle. */
.ih-root{touch-action:manipulation;-webkit-tap-highlight-color:rgba(37,66,45,.14)}
/* Native UI - scrollbars, form controls, the caret - has to follow the
   theme too, or the dark page keeps light scrollbars. */
.ih-root{color-scheme:light}
.ih-root[data-tema="dokkt"]{color-scheme:dark}
/* A pasted #solustadir link, or a browser restoring one, lands under the
   fixed header. The nav handler offsets for it; this covers everything
   that does not go through the handler. */
.ih-root :is(section[id]){scroll-margin-top:calc(var(--haus-h,64px) + .75rem)}
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

.ih-band{position:relative;padding:var(--band) 0}
.ih-wrap{padding:0 var(--gut);position:relative}

/* mask rise. opacity is never animated anywhere on this page. --- */
.ih-mask{overflow:hidden;display:block}
/* A mask is exactly as tall as its content, so the descenders on the last
   line of a paragraph sit on the cut. Give those masks room and pay for it
   with negative margin; because the mask is now taller, the content has to
   start at 118% rather than 100% to stay hidden behind it. */
.ih-maskP{padding-bottom:.16em;margin-bottom:-.16em}
.ih-maskP > .ih-up{transform:translateY(118%)}
.on .ih-maskP > .ih-up,.ih-maskP > .ih-up.on{transform:translateY(0)}
.ih-root.ih-allt .ih-maskP > .ih-up{transform:translateY(0)}

/* Display masks need room at BOTH ends, and Icelandic is why. The acute on
   Ú and Í sits above cap height and the mask cut it off the top of the
   footer slogan; ð, g, ö, þ and the comma hang below the baseline and were
   cut off the bottom of the quote lines. Measured, not guessed: probes/
   ih-clip.mjs resolves each line's baseline from the font's own metrics
   and compares the ink box to the clipping ancestor. The padding is paid
   back with negative margin so the vertical rhythm does not move, and
   because the mask is taller the lines now start at 125% instead of 108%
   to stay hidden behind it. */
.ih-disp .ih-mask{padding:.13em 0 .17em;margin:-.13em 0 -.17em}
/* The footer slogan sets line-height .9, so its box is tighter than the
   display lines and the acutes need proportionally more room. The mask
   carries the slogan's own font-size because em on the mask would
   otherwise resolve against the inherited 16px root size, not the 144px
   the glyphs are actually drawn at - which is why .2em here bought 3px
   instead of 29px on the first attempt. */
.ih-slagM{font-size:clamp(2.4rem,11vw,9rem);padding:.2em 0 .17em;margin:-.2em 0 -.17em}
.ih-disp .ih-lina,.ih-slagM > .ih-up{transform:translateY(125%)}
.on .ih-disp .ih-lina,.ih-disp .ih-lina.on,
.on .ih-slagM > .ih-up,.ih-slagM > .ih-up.on{transform:translateY(0)}
.ih-root.ih-allt .ih-disp .ih-lina,
.ih-root.ih-allt .ih-slagM > .ih-up{transform:translateY(0)}
.ih-up{transform:translateY(100%);transition:transform 1s var(--ease);transition-delay:var(--d,0s);will-change:transform}
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
.ih-merkid{display:inline-flex;align-items:center;line-height:0;min-height:36px}
.ih-merkid img{height:clamp(19px,1.7vw,25px);width:auto}
.ih-merkid .ih-merkidD{display:none}
.ih-root[data-tema="dokkt"] .ih-merkid img{display:none}
.ih-root[data-tema="dokkt"] .ih-merkid .ih-merkidD{display:block}
/* The reference groups everything except the logo on the right: nav at
   x=768..1372 of 1440, burger at 1374. space-between with three children
   centred the nav instead, which put it straight on top of the hero tiles. */
.ih-hausH{display:flex;align-items:center;gap:clamp(1rem,2vw,2.2rem)}

.ih-nav{display:flex;align-items:center;gap:clamp(1rem,2vw,2.1rem)}
.ih-nav a{font-size:.92rem;padding:.55rem 0;min-height:32px;display:inline-flex;align-items:center;
  position:relative}
.ih-nav a::after{content:'';position:absolute;left:0;right:0;bottom:.3rem;height:1px;
  background:currentColor;transform:scaleX(0);transform-origin:right;
  transition:transform .45s var(--ease)}
@media (hover:hover) and (pointer:fine){
  .ih-nav a:hover::after{transform:scaleX(1);transform-origin:left}
}
/* the burger is the narrow-width path; the reference carries one too */
.ih-braud{display:none;width:36px;height:36px;border:0;background:transparent;cursor:pointer;
  padding:9px 7px;flex-direction:column;justify-content:space-between}
.ih-braud i{display:block;height:1.5px;width:100%;background:var(--c-ink);
  transform-origin:center;transition:transform .4s var(--ease)}
.ih-braud.opin i:nth-child(1){transform:translateY(7.5px) rotate(45deg)}
.ih-braud.opin i:nth-child(2){transform:scaleX(0)}
.ih-braud.opin i:nth-child(3){transform:translateY(-7.5px) rotate(-45deg)}
.ih-braudSpjald{overscroll-behavior:contain;position:absolute;top:100%;left:0;right:0;background:var(--c-flotur);
  display:grid;padding:.4rem var(--gut) 1rem;box-shadow:inset 0 1px 0 var(--c-lina)}
.ih-braudSpjald a{padding:.85rem 0;font-size:1.05rem;box-shadow:inset 0 -1px 0 var(--c-lina)}
.ih-braudSpjald a:last-child{box-shadow:none}
@media (max-width:900px){
  .ih-nav{display:none}
  .ih-braud{display:flex}
}

/* Orkunotkun. The reference's best idea: the two accessibility switches
   report as a live energy reading in the header. ------------------ */
/* No position:relative here. The panel is 22rem wide and this wrapper is the
   width of a small button, so making it the containing block anchored the
   panel to the button and pushed it off the LEFT edge of a phone, cutting
   "Dökkt útlit" to "kkt útlit". It anchors to .ih-haus instead, which is fixed
   and spans the viewport, so right:var(--gut) means what it says. */
.ih-orkaW{position:static}
.ih-orka{display:flex;align-items:center;gap:.5rem;background:transparent;border:0;cursor:pointer;
  font:inherit;font-size:.82rem;color:inherit;padding:.4rem .2rem}
.ih-orkaG{height:1.15em;overflow:hidden;display:inline-block}
.ih-orkaR{display:block;transition:transform .4s var(--ease);transform:translateY(calc(var(--stig,0) * -1.15em))}
.ih-orkaR span{display:block;height:1.15em;line-height:1.15em;font-weight:600;color:var(--c-mosi)}
.ih-spjald{overscroll-behavior:contain;position:absolute;top:100%;right:var(--gut);width:min(22rem,calc(100vw - 2 * var(--gut)));
  background:var(--c-flotur);padding:1.15rem;display:grid;gap:1rem;
  box-shadow:inset 0 1px 0 var(--c-lina)}
.ih-rofiRod{display:flex;align-items:center;justify-content:space-between;gap:1rem}
/* The switch READS as 34x18, which is well under a finger, so the button is a
   real 44x44 and the track is drawn inside it. A pseudo element on a 34x18
   button would enlarge the hit area too, but the element's own rect would stay
   34x18 and a tap-target check could never see the difference: the control has
   to measure correct, not just behave correct. Only visible once the panel is
   open, which is why the gate now opens the disclosures before measuring. */
.ih-rofi{position:relative;width:44px;height:44px;border:0;background:transparent;
  cursor:pointer;padding:0;flex-shrink:0;display:grid;place-items:center}
.ih-rofi::before{content:'';width:34px;height:18px;border-radius:999px;
  background:var(--c-lina);transition:background .2s var(--ease)}
.ih-rofi[aria-checked="true"]::before{background:var(--c-mosi)}
.ih-rofi i{position:absolute;left:calc(50% - 15px);top:50%;margin-top:-7px;
  width:14px;height:14px;border-radius:999px;background:var(--c-bg);display:block;
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



@media (prefers-reduced-motion:reduce){
  .ih-root *{transition-duration:.15s !important;animation-duration:.15s !important}
  .ih-up{transform:none !important}
}
.ih-root[data-hreyfing="min"] .ih-up{transform:none !important;transition:none !important}
/* watchdog: nothing may stay masked forever because an observer never fired */
.ih-root.ih-allt .ih-up{transform:translateY(0)}
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
/* stagger 0.12s and duration 1s are the reference's own defaults for
   addAppearanceByTrigger({ duration: 1, stagger: 0.12, ease: "custom-our" }).
   This build was running 0.07s, which read as a faster, busier cascade. */
/* ------------------------------------------------------------------
   The scroll. This is the reference's dominant sensation and the one
   thing a CSS-only build cannot fake: Lenis at duration 3, which puts
   half a wheel notch away in ~270ms, 90% in ~1.0s, and spends another
   1.3s on the last ten pixels. It is why a 1s reveal never reads as
   late there: the scroll is slower than the animation.

   One recorded deviation. The reference also sets syncTouch:true with
   syncTouchLerp:0.075, which intercepts touch scrolling and kills iOS
   momentum. noho accepts that because it is one pinned page; this is a
   shop, so smooth scroll is bound to fine pointers only and phones keep
   native momentum.
   ------------------------------------------------------------------ */
export function useMjukSkrun() {
  useEffect(() => {
    if (reduced()) return
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return
    let lifandi = true
    let raf = 0
    let lenis: { raf: (t: number) => void; destroy: () => void; scrollTo: (t: number, o?: object) => void } | null = null
    void import('lenis').then(({ default: Lenis }) => {
      if (!lifandi) return
      lenis = new Lenis({
        duration: 3,
        smoothWheel: true,
        gestureOrientation: 'vertical',
        allowNestedScroll: true,
      })
      /* Lenis restores its own scroll position over any route reset,
         so the top has to be asserted after it exists, not before. */
      lenis.scrollTo(0, { immediate: true })
      /* exposed so the probes can jump the real scroller; a plain
         window.scrollTo is intercepted and animated over three seconds. */
      ;(window as unknown as { __ihLenis?: unknown }).__ihLenis = lenis
      const tikk = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(tikk) }
      raf = requestAnimationFrame(tikk)
    })
    return () => {
      lifandi = false; cancelAnimationFrame(raf); lenis?.destroy()
      delete (window as unknown as { __ihLenis?: unknown }).__ihLenis
    }
  }, [])
}

export const step = (i: number): CSSProperties => ({ ['--d' as string]: `${(i * 0.12).toFixed(2)}s` })

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
    <div className="ih-orkaW">
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

/* Their own logo, from iceherbs.is/wp-content/uploads/2021/02/iceherbs-vefur-2.png,
   which is the file their live header serves (at 3000px into a 348px slot, the
   thing the audit flags). Two deliberate changes, both stated rather than
   quiet: the "NATURAL SUPPLEMENTS" line is cut, because at header height it
   renders about four pixels tall and turns to mush - the crop point was
   measured off the alpha channel's row profile, not eyeballed; and a second
   file carries the wordmark in paper for the dark theme, since #165228 does
   not read on #1B211C. The leaf mark is untouched in both. */
const NAV = [
  { h: '#vorur', t: 'Vörur' },
  { h: '#pakkar', t: 'Pakkar' },
  { h: '#sagan', t: 'Sagan' },
  { h: '#solustadir', t: 'Sölustaðir' },
  { h: '#greinar', t: 'Greinar' },
]

/* Lenis owns the scroll, so a bare anchor jump would either be ignored or
   fight the smooth scroller. Hand the target to Lenis when it is there and
   fall back to scrollIntoView when it is not (touch, reduced motion). */
function faraA(e: MouseEvent<HTMLAnchorElement>, href: string) {
  const mark = document.querySelector(href)
  if (!mark) return
  e.preventDefault()
  const haus = document.querySelector('.ih-haus')
  const offset = -((haus?.getBoundingClientRect().height ?? 56) + 12)
  const l = (window as unknown as { __ihLenis?: { scrollTo: (t: Element, o?: object) => void } }).__ihLenis
  if (l) l.scrollTo(mark, { offset })
  else window.scrollTo({ top: mark.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
}

export function Haus() {
  const [fest, setFest] = useState(false)
  const [opin, setOpin] = useState(false)
  const sentinel = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setFest(!e.isIntersecting), { threshold: 0 })
    io.observe(el)
    /* scroll-margin-top needs the header's real height, which changes with
       the clamp on the logo, so publish it rather than hard-coding 64px. */
    const publish = () => {
      const h = document.querySelector('.ih-haus')?.getBoundingClientRect().height
      if (h) document.querySelector('.ih-root')?.setAttribute('style', `--haus-h:${Math.round(h)}px`)
    }
    publish()
    window.addEventListener('resize', publish)
    return () => { io.disconnect(); window.removeEventListener('resize', publish) }
  }, [])
  return (
    <>
      <div ref={sentinel} style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 24, pointerEvents: 'none' }} />
      <header className={`ih-haus${fest ? ' fest' : ''}`}>
        <a className="ih-merkid" href="#top" aria-label="ICEHERBS, á forsíðu"
          onClick={(e) => { e.preventDefault(); const l = (window as unknown as { __ihLenis?: { scrollTo: (t: number, o?: object) => void } }).__ihLenis; if (l) l.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <img src={`${import.meta.env.BASE_URL}iceherbs/iceherbs-merki.webp`}
            alt="ICEHERBS" width={494} height={112} decoding="async" />
          <img className="ih-merkidD" src={`${import.meta.env.BASE_URL}iceherbs/iceherbs-merki-ljos.webp`}
            alt="" aria-hidden="true" width={495} height={112} decoding="async" />
        </a>
        <div className="ih-hausH">
          <nav className="ih-nav" aria-label="Aðalvalmynd">
            {NAV.map((n) => (
              <a key={n.h} href={n.h} onClick={(e) => faraA(e, n.h)}>{n.t}</a>
            ))}
          </nav>
          <Orkunotkun />
          <button className={`ih-braud${opin ? ' opin' : ''}`} aria-expanded={opin}
            aria-label={opin ? 'Loka valmynd' : 'Opna valmynd'}
            onClick={() => setOpin((v) => !v)}><i /><i /><i /></button>
        </div>
        {opin ? (
          <div className="ih-braudSpjald">
            {NAV.map((n) => (
              <a key={n.h} href={n.h} onClick={(e) => { faraA(e, n.h); setOpin(false) }}>{n.t}</a>
            ))}
          </div>
        ) : null}
      </header>
    </>
  )
}

