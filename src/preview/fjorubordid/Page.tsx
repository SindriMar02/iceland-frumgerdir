import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { companyEntry } from './company'
import { IMG, CONTACT, HOURS, NAV, HERO, WEIGHTS, WEIGHTS_INTRO, SAGA, SAGA_SOURCE, ROOM, MENU, DRINKS, MENU_NOTE } from './data'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('osmo', '0.625, 0.05, 0, 1')

/* Tokens: _docs/design/fjorubordid-DESIGN.md. Grounds are three steps of one
   hue taken from their own black-wood texture; the red is sampled from the
   logo they publish and is also, it turns out, the colour of their walls. */
const C = {
  plank: '#0b0a08',
  lifted: '#14110d',
  surface: '#1c1813',
  cream: '#efe9df',
  muted: '#b3aa9b',
  faint: 'rgba(239,233,223,.14)',
  red: '#ec3c20',
}

const FONT = `${import.meta.env.BASE_URL}fjorubordid/fonts/switzer-variable.woff2`
const FONT_I = `${import.meta.env.BASE_URL}fjorubordid/fonts/switzer-variable-italic.woff2`

const css = `
@font-face{font-family:'Switzer';src:url(${FONT}) format('woff2');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'Switzer';src:url(${FONT_I}) format('woff2');font-weight:100 900;font-style:italic;font-display:swap}

.fb{--plank:${C.plank};--lifted:${C.lifted};--surface:${C.surface};--cream:${C.cream};--muted:${C.muted};--faint:${C.faint};--red:${C.red};
  --m:2vw;--gut:clamp(12px,1.5vw,22px);--sec:clamp(6rem,12vw,11rem);
  font-family:'Switzer',system-ui,-apple-system,'Helvetica Neue',sans-serif;font-weight:300;
  background:var(--plank);color:var(--cream);line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:clip}
.fb *{box-sizing:border-box;margin:0;padding:0}
.fb a{color:inherit;text-decoration:none}
.fb a,.fb button{-webkit-tap-highlight-color:transparent}
.fb :focus-visible{outline:2px solid var(--cream);outline-offset:4px}
.fb img{display:block;max-width:100%}
.fb button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}

/* the one hairline weight, the two labels, the type scale */
.fb-label{font-size:11.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
.fb-display{font-weight:300;font-size:clamp(2.6rem,5.7vw,6.4rem);line-height:.95;letter-spacing:-.02em}
.fb-title{font-weight:400;font-size:clamp(1.7rem,3vw,2.6rem);line-height:1.05;letter-spacing:-.01em}
.fb-body{font-size:clamp(1rem,1.05vw,1.15rem);color:var(--muted);max-width:62ch}
.fb-num{font-weight:500;font-variant-numeric:tabular-nums;letter-spacing:0}

/* buttons: square, one accent */
.fb-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 1.6em;font-size:15px;font-weight:500;letter-spacing:.01em;
  transition:background-color .35s cubic-bezier(.625,.05,0,1),color .35s cubic-bezier(.625,.05,0,1),transform .18s cubic-bezier(.625,.05,0,1);touch-action:manipulation}
.fb-btn:active{transform:translateY(1px)}
.fb-btn--red{background:var(--red);color:var(--plank)}
@media (hover:hover) and (pointer:fine){.fb-btn--red:hover{background:#d8361c}
.fb-btn--line{box-shadow:inset 0 0 0 1px var(--cream);color:var(--cream)}
.fb-btn--line:hover{background:var(--cream);color:var(--plank)}}
.fb-link{position:relative;color:var(--cream)}
.fb-link::after{content:'';position:absolute;left:0;right:0;bottom:-3px;height:1px;background:currentColor;transform-origin:right;transition:transform .5s cubic-bezier(.625,.05,0,1)}
@media (hover:hover) and (pointer:fine){.fb-link:hover{color:var(--red)}
.fb-link:hover::after{transform:scaleX(0)}
.fb-w:hover .fb-w__sq img{transform:scale(calc(var(--z) * 1.04))}}

/* grain: their black-wood, fixed, never on a scrolling box */
.fb-grain{position:fixed;inset:0;z-index:0;pointer-events:none;background:url(${IMG.wood}) center/720px repeat;opacity:.11;mix-blend-mode:screen}
@media (hover:none) and (pointer:coarse){.fb-grain{display:none}}
.fb-main{position:relative;z-index:1}

/* header */
.fb-head{position:fixed;top:0;left:0;right:0;z-index:40;height:84px;padding:0 var(--m);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;
  transform:translateY(0);transition:transform .6s cubic-bezier(.625,.05,0,1)}
.fb-head::before{content:'';position:absolute;inset:0;background:var(--plank);opacity:0;transition:opacity .5s;z-index:-1}
.fb-head.is-solid::before{opacity:.96}
.fb-head.is-hidden{transform:translateY(-100%)}
.fb-head__vignette{position:fixed;top:0;left:0;right:0;height:200px;z-index:39;pointer-events:none;
  background:linear-gradient(to bottom,rgba(11,10,8,.72) 0%,rgba(11,10,8,.42) 45%,rgba(11,10,8,0) 100%)}
.fb-head__mark{display:inline-flex;align-items:center;min-height:44px}
.fb-head__mark img{height:46px;width:auto}
.fb-head__nav{display:flex;gap:clamp(1.4rem,2.4vw,2.6rem);font-size:15px;font-weight:400}
.fb-head__nav a{display:inline-flex;align-items:center;min-height:44px}
.fb-head__nav a::after{transform:scaleX(0);transform-origin:left}
.fb-head__end{display:flex;justify-content:flex-end;align-items:center;gap:1rem}
.fb-head__end .fb-btn{min-height:44px;padding:0 1.25em;font-size:14px}
.fb-burger{display:none;width:44px;height:44px;position:relative}
.fb-burger span{position:absolute;left:12px;right:12px;height:1.5px;background:var(--cream);transition:transform .5s cubic-bezier(.625,.05,0,1),opacity .3s}
.fb-burger span:nth-child(1){top:18px}.fb-burger span:nth-child(2){top:25px}
.fb-burger.is-open span:nth-child(1){transform:translateY(3.5px) rotate(45deg)}
.fb-burger.is-open span:nth-child(2){transform:translateY(-3.5px) rotate(-45deg)}
.fb-sheet{position:fixed;inset:0;z-index:38;overscroll-behavior:contain;background:var(--plank);display:none;flex-direction:column;justify-content:flex-end;padding:0 var(--m) calc(2.4rem + env(safe-area-inset-bottom))}
.fb-sheet.is-open{display:flex}
.fb-sheet a{display:block;font-size:clamp(2.2rem,9vw,3.4rem);font-weight:300;letter-spacing:-.02em;line-height:1.15;padding:.35rem 0}
.fb-sheet__meta{margin-top:2rem;display:grid;gap:.5rem;color:var(--muted);font-size:15px}
.fb-sheet .fb-btn{margin-top:1.6rem;align-self:flex-start}
@media (max-width:899px){
  .fb-head{height:72px;grid-template-columns:1fr auto}
  .fb-head__nav,.fb-head__end .fb-btn{display:none}
  .fb-burger{display:block}
  .fb-head__mark img{height:38px}
}

/* hero */
.fb-hero{position:relative;min-height:100svh;display:grid;align-items:end;padding:0 var(--m) clamp(2.4rem,5vw,4.5rem);overflow:hidden;isolation:isolate}
.fb-hero__media{position:absolute;inset:0;z-index:-2}
.fb-hero__media img{width:100%;height:100%;object-fit:cover;object-position:62% 55%;will-change:transform}
.fb-hero__scrim{position:absolute;inset:0;z-index:-1;
  background:linear-gradient(to top,rgba(11,10,8,.94) 0%,rgba(11,10,8,.8) 28%,rgba(11,10,8,.5) 50%,rgba(11,10,8,.14) 68%,rgba(11,10,8,0) 82%),
             linear-gradient(to right,rgba(11,10,8,.72) 0%,rgba(11,10,8,.4) 36%,rgba(11,10,8,0) 66%)}
.fb-hero__inner{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gut)}
.fb-hero__copy{grid-column:1/9;display:grid;gap:clamp(1.1rem,1.8vw,1.6rem)}
.fb-hero__copy .fb-display{max-width:20ch}
.fb-hero__sub{font-size:clamp(1rem,1.15vw,1.2rem);color:var(--cream);max-width:46ch;opacity:.92}
.fb-hero__row{display:flex;align-items:center;gap:1.4rem;flex-wrap:wrap;margin-top:.4rem}
.fb-hero__row .fb-link{font-size:15px}
@media (max-width:899px){.fb-hero__copy{grid-column:1/-1}.fb-hero__copy .fb-display{max-width:none}}

/* sections */
.fb-sec{padding:var(--sec) var(--m)}
.fb-sec--lifted{background:var(--lifted)}
.fb-secHead{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gut);align-items:end;margin-bottom:clamp(2.4rem,4vw,3.6rem)}
.fb-secHead__l{grid-column:1/8;display:grid;gap:1rem}
.fb-secHead__r{grid-column:9/-1;justify-self:end;align-self:end}
@media (max-width:899px){.fb-secHead__l,.fb-secHead__r{grid-column:1/-1;justify-self:start}}

/* the weight grid: four squares, one pan, four framings */
.fb-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--gut)}
.fb-w{display:grid;gap:.9rem}
.fb-w__sq{position:relative;aspect-ratio:1;overflow:hidden;background:var(--surface)}
.fb-w__sq img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:var(--pos,54% 58%);transition:transform .8s cubic-bezier(.625,.05,0,1)}
.fb-w__sq img{transform:scale(var(--z))}
.fb-w__row{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;font-size:clamp(1.05rem,1.25vw,1.3rem)}
.fb-w__g{font-weight:500;letter-spacing:-.01em}
.fb-w__g small{font-size:.72em;font-weight:400;color:var(--muted);margin-left:.15em}
.fb-w__three{font-size:14px;color:var(--muted)}
.fb-w__rule{height:1px;background:var(--red);transform-origin:left}
@media (max-width:899px){.fb-grid{grid-template-columns:repeat(2,1fr)}}

/* the soup story, pinned */
.fb-saga{min-height:100svh;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gut);align-items:center;padding:var(--sec) var(--m)}
.fb-saga__media{grid-column:1/6;aspect-ratio:4/5;overflow:hidden;align-self:center}
.fb-saga__media img{width:100%;height:100%;object-fit:cover;object-position:50% 70%;will-change:transform}
.fb-saga__text{grid-column:7/-1;display:grid;gap:clamp(1rem,1.6vw,1.5rem)}
.fb-saga__line{font-weight:300;font-size:clamp(1.35rem,2.05vw,2.05rem);line-height:1.25;letter-spacing:-.012em}
.fb-saga__line.is-lead{font-size:clamp(1.9rem,3vw,3rem);line-height:1.08;letter-spacing:-.02em;font-weight:400;opacity:1}
.fb-saga__src{margin-top:.8rem}
@media (max-width:899px){
  .fb-saga{min-height:0;align-items:start;row-gap:2.4rem}
  .fb-saga__media{grid-column:1/-1;aspect-ratio:4/3}
  .fb-saga__text{grid-column:1/-1}
  .fb-saga__line{opacity:1}
}

/* the room */
.fb-room{padding:0 0 var(--sec)}
.fb-room__media{height:min(110svh,900px);overflow:hidden;position:relative}
.fb-room__media img{width:100%;height:130%;object-fit:cover;object-position:50% 45%;position:absolute;top:-15%;left:0;will-change:transform}
.fb-room__copy{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gut);padding:clamp(2.4rem,4vw,3.6rem) var(--m) 0}
.fb-room__copy .fb-title{grid-column:1/8;max-width:18ch}
.fb-room__copy .fb-body{grid-column:8/-1;align-self:end}
@media (max-width:899px){.fb-room__copy .fb-title,.fb-room__copy .fb-body{grid-column:1/-1}.fb-room__copy .fb-body{margin-top:1.2rem}}

/* the menu */
.fb-strip{aspect-ratio:1903/599;overflow:hidden;position:relative}
.fb-strip img{width:100%;height:120%;object-fit:cover;position:absolute;top:-10%;left:0;will-change:transform}
.fb-menu{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gut)}
.fb-menu__side{grid-column:1/5;align-self:start;position:sticky;top:112px;display:grid;gap:1.1rem}
.fb-menu__list{grid-column:6/-1;display:grid;gap:clamp(2.6rem,4vw,3.6rem)}
.fb-mg{display:grid;gap:1.2rem}
.fb-mg__title{font-weight:400;font-size:clamp(1.25rem,1.6vw,1.55rem);letter-spacing:-.01em}
.fb-mg__note{color:var(--muted);font-size:clamp(.95rem,1vw,1.05rem);max-width:58ch}
.fb-mr{display:grid;grid-template-columns:1fr auto;column-gap:1.5rem;row-gap:.25rem;align-items:baseline;padding:.85rem 0}
.fb-mr + .fb-mr{box-shadow:0 -1px 0 var(--faint)}
.fb-mr__n{font-size:clamp(1rem,1.1vw,1.15rem);font-weight:400}
.fb-mr__t{grid-column:1;color:var(--muted);font-size:.95rem;max-width:52ch}
.fb-mr__p{grid-column:2;grid-row:1;font-size:clamp(1rem,1.1vw,1.15rem)}
.fb-menu__drinks{margin-top:clamp(3rem,5vw,4.5rem);display:grid;gap:clamp(2rem,3vw,2.8rem)}
.fb-menu__drinks .fb-mr{padding:.6rem 0}
@media (max-width:899px){.fb-menu__side{grid-column:1/-1;position:static;margin-bottom:2.4rem}.fb-menu__list{grid-column:1/-1}}

/* practical: the one surface */
.fb-prac{background:var(--surface);padding:clamp(2.6rem,4.5vw,4.2rem) clamp(1.4rem,3vw,3rem);display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gut);row-gap:2.4rem}
.fb-prac__col{grid-column:span 4;display:grid;gap:.6rem;align-content:start}
.fb-prac__col .fb-label{margin-bottom:.4rem}
.fb-prac__big{font-size:clamp(1.5rem,2.4vw,2.3rem);font-weight:400;letter-spacing:-.015em;line-height:1.1}
.fb-prac__col p{color:var(--muted)}
.fb-prac__acts{grid-column:1/-1;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;margin-top:.6rem}
.fb-prac__acts .fb-link{margin-left:.6rem;font-size:15px}
@media (max-width:899px){.fb-prac__col{grid-column:1/-1}}

/* footer: the mark, large */
.fb-foot{padding:var(--sec) var(--m) clamp(2rem,3vw,3rem)}
.fb-foot__mark{width:min(100%,72vw);display:block}
.fb-foot__mark img{width:100%;height:auto}
.fb-foot__cols{margin-top:clamp(2.4rem,4vw,3.6rem);display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gut);row-gap:1.8rem;color:var(--muted);font-size:15px}
.fb-foot__col{grid-column:span 3;display:grid;gap:.35rem;align-content:start}
.fb-foot__col .fb-label{margin-bottom:.45rem}
.fb-foot__col a{color:var(--cream)}
.fb-foot__bottom{margin-top:clamp(2.4rem,4vw,3.6rem);padding-top:1.2rem;box-shadow:0 -1px 0 var(--faint);display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;color:var(--muted);font-size:13px}
@media (max-width:899px){.fb-foot__col{grid-column:span 6}}
@media (max-width:520px){.fb-foot__col{grid-column:1/-1}}

/* reveal pre-hide: only when motion is welcome, only until GSAP owns it */
@media (prefers-reduced-motion:no-preference){
  .fb-reveal{opacity:0}
  .fb-split-host{opacity:0}
  .fb-hero__media img{transform:scale(1.06)}
  .fb-w__rule{transform:scaleX(0)}
  .fb-saga__line:not(.is-lead){opacity:.18}
  @media (max-width:899px){.fb-saga__line{opacity:1}}
}
.fb-display,.fb-title{text-wrap:balance}
.fb section,.fb footer{scroll-margin-top:84px}
.fb-skip{position:fixed;top:10px;left:10px;z-index:60;background:var(--cream);color:var(--plank);padding:.7em 1em;font-weight:500;transform:translateY(-200%)}
.fb-skip:focus-visible{transform:none;outline-offset:2px}
.fb-foot__col a,.fb-sheet__meta a{display:inline-flex;align-items:center;min-height:44px}
@media (max-width:899px){.fb-secHead__r{margin-top:1.4rem}}
.fb-head{transition:transform .45s cubic-bezier(.625,.05,0,1)}
/* SplitText line masks clip þ j g ð without this */
.fb-split-host > div{padding-bottom:.22em;margin-bottom:-.22em}
`

function armRevealFailsafe(root: HTMLElement, selectors: string) {
  const enteredAt = new Map<Element, number>()
  const id = window.setInterval(() => {
    const now = performance.now()
    root.querySelectorAll(selectors).forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.bottom <= 0 || r.top >= window.innerHeight) {
        enteredAt.delete(el)
        return
      }
      if (!enteredAt.has(el)) enteredAt.set(el, now)
      const style = window.getComputedStyle(el)
      const stuck = parseFloat(style.opacity) < 0.05 || style.visibility === 'hidden'
      if (now - (enteredAt.get(el) as number) > 2200 && stuck) {
        gsap.set(el, { autoAlpha: 1, clearProps: 'transform' })
      }
    })
  }, 350)
  return () => window.clearInterval(id)
}

const kr = (p: string) => `${p}\u00a0kr.`

export default function FjorubordidPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const headRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const prev = document.documentElement.lang
    const prevScheme = document.documentElement.style.colorScheme
    document.documentElement.lang = 'is'
    document.documentElement.style.colorScheme = 'dark'
    setThemeColor(C.plank)
    const pre = document.createElement('link')
    pre.rel = 'preload'
    pre.as = 'font'
    pre.type = 'font/woff2'
    pre.href = FONT
    pre.crossOrigin = 'anonymous'
    document.head.appendChild(pre)
    return () => {
      document.documentElement.lang = prev
      document.documentElement.style.colorScheme = prevScheme
      pre.remove()
    }
  }, [])

  /* Lenis, desktop only, driven from the GSAP ticker. */
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
      if (isTouchDevice) return undefined
      const lenis = new Lenis({ lerp: 0.165, wheelMultiplier: 1.25, syncTouch: false })
      lenisRef.current = lenis
      ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      return () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
        lenisRef.current = null
      }
    })
    return () => mm.revert()
  }, [])

  /* Header: static vignette, solid past hero/2, hide on cumulative down travel. */
  useEffect(() => {
    const head = headRef.current
    const root = rootRef.current
    if (!head || !root) return
    let last = window.scrollY
    let down = 0
    let up = 0
    let half = 400
    const measure = () => { const hero = root.querySelector<HTMLElement>('.fb-hero'); half = hero ? hero.offsetHeight * 0.5 : 400 }
    measure()
    ScrollTrigger.addEventListener('refresh', measure)
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll()
        const d = y - last
        last = y
        if (d > 0) { down += d; up = 0 } else if (d < 0) { up -= d; down = 0 }
        head.classList.toggle('is-solid', y > half)
        if (y < 120) head.classList.remove('is-hidden')
        else if (down > 28) head.classList.add('is-hidden')
        else if (up > 28) head.classList.remove('is-hidden')
      },
    })
    return () => {
      ScrollTrigger.removeEventListener('refresh', measure)
      st.kill()
    }
  }, [])

  /* Mobile sheet: lock the page while open, Escape closes. */
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    const first = document.querySelector<HTMLAnchorElement>('#fb-sheet a')
    first?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      document.querySelector<HTMLButtonElement>('.fb-burger')?.focus()
    }
  }, [open])

  /* Motion. Everything below is inside the reduced-motion gate; without it
     the CSS pre-hide never applies and the page is simply static. */
  useEffect(() => {
    const root = rootRef.current as HTMLElement
    if (!root) return
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      mm.add(
        { motion: '(prefers-reduced-motion: no-preference)', desk: '(min-width: 900px)' },
        (c) => {
          const { motion, desk } = c.conditions as { motion: boolean; desk: boolean }
          if (!motion) return undefined
          gsap.defaults({ ease: 'osmo', duration: 0.8 })
          const failsafe = armRevealFailsafe(root, '.fb-reveal, .fb-split-host, .fb-split-host div')
          let cleanup: (() => void) | null = null
          let cancelled = false
          /* Split only once Switzer is really in: a swap after the split makes
             autoSplit re-run the hero rise a second time. */
          const ready = document.fonts?.load
            ? Promise.all([document.fonts.load("300 4rem 'Switzer'"), document.fonts.load("400 1rem 'Switzer'")]).catch(() => undefined)
            : Promise.resolve()
          ready.then(() => {
            if (cancelled) return
            cleanup = setup()
          })
          function setup() {

          /* Hero arrival: one orchestrated timeline. */
          const heroImg = root.querySelector('.fb-hero__media img')
          const heroTl = gsap.timeline({ paused: true })
          heroTl.to(heroImg, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0)
          heroTl.to('.fb-hero .fb-reveal--mark', { autoAlpha: 1, y: 0, duration: 1 }, 0.15)
          let heroLines: gsap.core.Tween[] = []
          let heroArrived = false
          const heroSplit = SplitText.create('.fb-hero .fb-split-host', {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit(self) {
              gsap.set(self.elements, { opacity: 1 })
              const tw = gsap.from(self.lines, { yPercent: 110, duration: 1.1, ease: 'power3.out', stagger: { amount: 0.45 }, paused: !heroArrived })
              heroLines = [tw]
              return tw
            },
          })
          heroTl.add(() => { heroArrived = true; heroLines.forEach((t) => t.play()) }, 0.35)
          heroTl.fromTo('.fb-hero .fb-reveal--late', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.95)
          gsap.set('.fb-hero .fb-reveal--mark', { y: 12 })
          heroTl.play()

          /* Section headings: masked line rises on enter. */
          const splits = SplitText.create('.fb-sec .fb-split-host, .fb-room .fb-split-host', {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit(self) {
              gsap.set(self.elements, { opacity: 1 })
              return gsap.from(self.lines, {
                yPercent: 110, duration: 1, ease: 'power3.out', stagger: { amount: 0.3 },
                scrollTrigger: { trigger: self.elements[0], start: 'top 86%', once: true },
              })
            },
          })

          /* Plain reveals, batched. */
          ScrollTrigger.batch('.fb-reveal:not(.fb-hero .fb-reveal)', {
            start: 'top 88%',
            once: true,
            onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }),
          })

          /* The weight grid arrives as a set: card rises, photo settles, red rule draws. */
          const grid = root.querySelector('.fb-grid')
          if (grid) {
            const cards = gsap.utils.toArray<HTMLElement>('.fb-w', grid)
            const imgs = cards.map((c2) => c2.querySelector('img'))
            const rules = cards.map((c2) => c2.querySelector('.fb-w__rule'))
            gsap.set(cards, { autoAlpha: 0, y: 26 })
            gsap.set(imgs, { scale: (i) => 1.08 * Number(cards[i].style.getPropertyValue('--z') || 1) })
            gsap.timeline({ scrollTrigger: { trigger: grid, start: 'top 80%', once: true } })
              .to(cards, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09 }, 0)
              .to(imgs, { scale: (i) => Number(cards[i].style.getPropertyValue('--z') || 1), duration: 1.6, ease: 'power2.out', stagger: 0.09, onComplete: () => gsap.set(imgs, { clearProps: 'transform' }) }, 0)
              .to(rules, { scaleX: 1, duration: 1, stagger: 0.09 }, 0.4)
          }

          /* The soup story: pinned on desktop, read at the speed you scroll. */
          const saga = root.querySelector<HTMLElement>('.fb-saga')
          const lines = gsap.utils.toArray<HTMLElement>('.fb-saga__line', saga || undefined)
          const sagaImg = saga?.querySelector('img')
          if (saga && desk && sagaImg) {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: saga, start: 'top top', end: '+=180%', pin: true, scrub: 0.6, anticipatePin: 1 },
            })
            tl.to(sagaImg, { scale: 1.12, ease: 'none', duration: lines.length }, 0)
            lines.slice(1).forEach((l, i) => tl.to(l, { opacity: 1, ease: 'none', duration: 0.8 }, i * 0.85))
            tl.to({}, { duration: 0.6 })
          } else if (saga) {
            gsap.set(lines.slice(1), { opacity: 0.18 })
            ScrollTrigger.batch(lines.slice(1), { start: 'top 82%', once: true, onEnter: (els) => gsap.to(els, { opacity: 1, duration: 1.1, stagger: 0.12 }) })
          }

          /* The room and the soup strip: depth, scrubbed. */
          root.querySelectorAll<HTMLElement>('.fb-room__media, .fb-strip').forEach((box) => {
            const im = box.querySelector('img')
            gsap.fromTo(im, { yPercent: -9 }, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true } })
          })

          return () => {
            heroSplit.revert()
            splits.revert()
          }
          }
          return () => {
            cancelled = true
            failsafe()
            if (cleanup) cleanup()
          }
        },
      )
    }, root)
    return () => {
      mm.revert()
      ctx.revert()
    }
  }, [])

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return
    const el = document.querySelector<HTMLElement>(href)
    if (!el) return
    e.preventDefault()
    setOpen(false)
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -84 })
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="fb" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <PreviewChrome company={companyEntry} />
      <a className="fb-skip" href="#efni" onClick={(e) => go(e, '#efni')}>Fara beint í efni</a>
      <div className="fb-grain" aria-hidden="true" />

      <div className="fb-head__vignette" aria-hidden="true" />
      <header className="fb-head" ref={headRef}>
        <a className="fb-head__mark" href="#top" onClick={(e) => go(e, '#top')} aria-label="Fjöruborðið, forsíða">
          <img src={IMG.logoCream} alt="Fjöruborðið" width={104} height={38} />
        </a>
        <nav className="fb-head__nav" aria-label="Aðalvalmynd">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="fb-link" onClick={(e) => go(e, n.href)}>{n.label}</a>
          ))}
        </nav>
        <div className="fb-head__end">
          <a className="fb-btn fb-btn--line" href={CONTACT.booking} target="_blank" rel="noopener">Panta borð</a>
          <button
            type="button"
            className={`fb-burger${open ? ' is-open' : ''}`}
            aria-expanded={open}
            aria-controls="fb-sheet"
            aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span />
          </button>
        </div>
      </header>
      <div id="fb-sheet" className={`fb-sheet${open ? ' is-open' : ''}`} aria-hidden={!open}>
        {NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)}>{n.label}</a>
        ))}
        <a className="fb-btn fb-btn--red" href={CONTACT.booking} target="_blank" rel="noopener">Panta borð</a>
        <div className="fb-sheet__meta">
          <span>{HOURS.days} {HOURS.open}</span>
          <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
        </div>
      </div>

      <main className="fb-main" id="top">
        <section className="fb-hero">
          <div className="fb-hero__media" aria-hidden="true">
            <img src={IMG.hero} alt="" width={2880} height={1920} decoding="async" {...({ fetchpriority: 'high' } as Record<string, string>)} />
          </div>
          <div className="fb-hero__scrim" aria-hidden="true" />
          <div className="fb-hero__inner">
            <div className="fb-hero__copy">
              <p className="fb-label fb-reveal fb-reveal--mark" style={{ color: C.cream }}>{HERO.eyebrow}</p>
              <h1 className="fb-display fb-split-host">{HERO.title}</h1>
              <p className="fb-hero__sub fb-reveal fb-reveal--late">{HERO.sub}</p>
              <div className="fb-hero__row fb-reveal fb-reveal--late">
                <a className="fb-btn fb-btn--red" href={CONTACT.booking} target="_blank" rel="noopener">{HERO.cta}</a>
                <a className="fb-link" href={CONTACT.phoneHref}>Sími {CONTACT.phoneDisplay}</a>
              </div>
            </div>
          </div>
        </section>

        <section className="fb-sec" id="humar" aria-labelledby="fb-w-title"><span id="efni" tabIndex={-1} />
          <div className="fb-secHead">
            <div className="fb-secHead__l">
              <p className="fb-label fb-reveal">{WEIGHTS_INTRO.eyebrow}</p>
              <h2 className="fb-title fb-split-host" id="fb-w-title">{WEIGHTS_INTRO.title}</h2>
              <p className="fb-body fb-reveal">{WEIGHTS_INTRO.text}</p>
            </div>
            <div className="fb-secHead__r fb-reveal">
              <a className="fb-btn fb-btn--line" href="#matsedill" onClick={(e) => go(e, '#matsedill')}>{WEIGHTS_INTRO.more}</a>
            </div>
          </div>
          <div className="fb-grid">
            {WEIGHTS.map((w, i) => (
              <article className="fb-w" key={w.grams} style={{ ['--z' as string]: String(1 + i * 0.24), ['--pos' as string]: `${54 - i * 2}% ${58 + i * 2}%` }}>
                <div className="fb-w__sq">
                  <img src={IMG.pan} alt={`Leturhumar Fjöruborðsins, ${w.grams} gramma skammtur í koparpönnu`} width={2400} height={1603} loading="lazy" decoding="async" />
                </div>
                <div className="fb-w__rule" aria-hidden="true" />
                <div className="fb-w__row">
                  <span className="fb-w__g fb-num">{w.grams}<small>gr</small></span>
                  <span className="fb-num">{kr(w.price)}</span>
                </div>
                {w.threeCourse ? (
                  <p className="fb-w__three">Þriggja rétta <span className="fb-num">{kr(w.threeCourse)}</span></p>
                ) : (
                  <p className="fb-w__three">Aðalréttur</p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="fb-saga fb-sec--lifted" id="sagan" aria-label="Sagan af súpunni">
          <div className="fb-saga__media">
            <img src={IMG.table} alt="Humarsúpan borin fram við gluggann á Fjöruborðinu, rauður veggur og hvítvínsglas" width={2400} height={2400} loading="lazy" decoding="async" />
          </div>
          <div className="fb-saga__text">
            {SAGA.map((s, i) => (
              <p key={i} className={`fb-saga__line${i === 0 ? ' is-lead' : ''}`}>{s}</p>
            ))}
            <p className="fb-label fb-saga__src">{SAGA_SOURCE}</p>
          </div>
        </section>

        <section className="fb-room" aria-label="Salurinn">
          <div className="fb-room__media">
            <img src={IMG.room} alt="Salurinn á Fjöruborðinu: langborð úr eik, rauðar servíettur og glerkúlur í glugganum" width={2880} height={1626} loading="lazy" decoding="async" />
          </div>
          <div className="fb-room__copy">
            <h2 className="fb-title fb-split-host">{ROOM.line}</h2>
            <p className="fb-body fb-reveal">{ROOM.text}</p>
          </div>
        </section>

        <section className="fb-sec fb-sec--lifted" id="matsedill" aria-labelledby="fb-m-title" style={{ paddingTop: 0 }}>
          <div className="fb-strip" style={{ margin: '0 calc(-1 * var(--m))' }}>
            <img src={IMG.soup} alt="Humar í göldróttri súpu á dökkum grunni" width={1903} height={599} loading="lazy" decoding="async" />
          </div>
          <div className="fb-menu" style={{ paddingTop: 'var(--sec)' }}>
            <div className="fb-menu__side">
              <p className="fb-label fb-reveal">Matseðill</p>
              <h2 className="fb-title fb-split-host" id="fb-m-title">Humar, súpa, brauð úr ofninum.</h2>
              <p className="fb-body fb-reveal">{MENU_NOTE} {HOURS.note}</p>
              <div className="fb-reveal" style={{ marginTop: '.6rem' }}>
                <a className="fb-btn fb-btn--line" href={CONTACT.booking} target="_blank" rel="noopener">Panta borð</a>
              </div>
            </div>
            <div className="fb-menu__list">
              {MENU.map((g) => (
                <div className="fb-mg fb-reveal" key={g.title}>
                  <h3 className="fb-mg__title">{g.title}</h3>
                  {g.note && <p className="fb-mg__note">{g.note}</p>}
                  <div>
                    {g.rows.map((r) => (
                      <div className="fb-mr" key={r.name}>
                        <span className="fb-mr__n">{r.name}</span>
                        <span className="fb-mr__p fb-num">{kr(r.price)}</span>
                        {r.text && <span className="fb-mr__t">{r.text}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="fb-menu__drinks">
                <p className="fb-label fb-reveal">Fordrykkir</p>
                {DRINKS.map((g) => (
                  <div className="fb-mg fb-reveal" key={g.title}>
                    <h3 className="fb-mg__title">{g.title}</h3>
                    <div>
                      {g.rows.map((r) => (
                        <div className="fb-mr" key={r.name}>
                          <span className="fb-mr__n">{r.name}</span>
                          <span className="fb-mr__p fb-num">{kr(r.price)}</span>
                          {r.text && <span className="fb-mr__t">{r.text}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="fb-sec" id="opnunartimi" aria-labelledby="fb-p-title">
          <div className="fb-secHead">
            <div className="fb-secHead__l">
              <h2 className="fb-title fb-split-host" id="fb-p-title">Við fjöruborðið, alla daga.</h2>
            </div>
          </div>
          <div className="fb-prac fb-reveal">
            <div className="fb-prac__col">
              <p className="fb-label">Opnunartími</p>
              <p className="fb-prac__big fb-num">{HOURS.open}</p>
              <p>{HOURS.days}. {HOURS.lastBooking}.</p>
            </div>
            <div className="fb-prac__col">
              <p className="fb-label">Hvar</p>
              <p className="fb-prac__big">{CONTACT.street}</p>
              <p>{CONTACT.town}. <a className="fb-link" href={CONTACT.map} target="_blank" rel="noopener">Kort</a></p>
            </div>
            <div className="fb-prac__col">
              <p className="fb-label">Samband</p>
              <p className="fb-prac__big fb-num"><a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a></p>
              <p><a className="fb-link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
            </div>
            <div className="fb-prac__acts">
              <a className="fb-btn fb-btn--red" href={CONTACT.booking} target="_blank" rel="noopener">Panta borð</a>
              <a className="fb-btn fb-btn--line" href={CONTACT.giftCards} target="_blank" rel="noopener">Gjafabréf</a>
              <span className="fb-body" style={{ fontSize: 14 }}>{HOURS.note}</span>
            </div>
          </div>
        </section>

        <footer className="fb-foot">
          <a className="fb-foot__mark" href="#top" onClick={(e) => go(e, '#top')} aria-label="Fjöruborðið, efst á síðu">
            <img src={IMG.logoCream} alt="" width={2080} height={760} loading="lazy" />
          </a>
          <div className="fb-foot__cols">
            <div className="fb-foot__col">
              <p className="fb-label">Heimilisfang</p>
              <span>{CONTACT.street}</span>
              <span>{CONTACT.town}</span>
            </div>
            <div className="fb-foot__col">
              <p className="fb-label">Opnunartími</p>
              <span>{HOURS.days}</span>
              <span className="fb-num">{HOURS.open}</span>
              <span>{HOURS.lastBooking}</span>
            </div>
            <div className="fb-foot__col">
              <p className="fb-label">Samband</p>
              <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
            <div className="fb-foot__col">
              <p className="fb-label">Bóka</p>
              <a href={CONTACT.booking} target="_blank" rel="noopener">Panta borð</a>
              <a href={CONTACT.giftCards} target="_blank" rel="noopener">Gjafabréf</a>
            </div>
          </div>
          <div className="fb-foot__bottom">
            <span>Fjöruborðið, Stokkseyri</span>
            <span>Leturhumar síðan 1995</span>
          </div>
        </footer>
      </main>

      <PreviewFooter company={companyEntry} />
    </div>
  )
}
