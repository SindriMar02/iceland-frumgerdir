/**
 * Nýpugarðar — the hero (Kleif v1 hero, ported; spec in DESIGN.md §3.0 and §4).
 *
 * Her largest photograph, the wordmark centred across its foot, and the mist
 * rising off Mýrar as the page scrolls: three alpha fog plates travel up at
 * three speeds while the picture holds and then dissolves into the mist
 * ground the manifesto sits on.
 *
 * PRERENDER. The server HTML is the resting frame: letters in place, photo at
 * scale 1, plates parked below the picture by the stylesheet. The intro is
 * armed in a layout effect (before first paint, so no flash) and GSAP only
 * ever runs from an effect, so no timed state can be baked into the HTML
 * ([[prerender-bakes-timed-intros]]). A load that arrives already scrolled,
 * which is what a reload mid-page does, skips the intro instead of holding
 * the letters down over a page the visitor is already reading
 * ([[scroll-restoration-defeats-held-intro]]).
 *
 * ONE WRITER PER ELEMENT. GSAP owns the wrapper, the content box, the drift
 * spans, the fog WRAPPERS and the fade layer. The CSS drift animation owns
 * the img inside each fog wrapper. React owns the letter spans and the photo.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Img } from '../../components/Img'
import { IMG } from './data'
import { largest, srcSet } from './photos'
import type { Copy } from './copy'
import { isTouch, loadMotion, scrub } from './motion'

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const EASE_REVEAL = 'cubic-bezier(0.16, 1, 0.3, 1)'
const WORDMARK = 'Nýpugarðar'
const BASE = import.meta.env.BASE_URL

const HERO_CSS = `
.nyp-fog { position: absolute; top: 0; left: 0; width: 100%; height: 100svh; transform: translateY(100%); pointer-events: none; }
.nyp-fog img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: top;
  will-change: transform; backface-visibility: hidden;
  background: linear-gradient(0deg, #E9EAE5 0%, #E9EAE5 14%, transparent 46%);
  /* the plates are tinted to this same mist at build time (was paper white) */
}
.nyp-fog--far { z-index: 2; }
.nyp-fog--veil { z-index: 4; opacity: .5; }
.nyp-fog--near { z-index: 6; }
.nyp-fog--far img { animation: nyp-fog-a 83s ease-in-out infinite; }
.nyp-fog--veil img { animation: nyp-fog-b 61s ease-in-out infinite; }
.nyp-fog--near img { animation: nyp-fog-c 47s ease-in-out infinite; }
@keyframes nyp-fog-a { 0%,100% { transform: translate3d(-1.6%,0,0) scale(1.07); } 50% { transform: translate3d(1.6%,-1.1%,0) scale(1.13); } }
@keyframes nyp-fog-b { 0%,100% { transform: translate3d(1.4%,-.6%,0) scale(1.11); } 50% { transform: translate3d(-1.8%,.8%,0) scale(1.06); } }
@keyframes nyp-fog-c { 0%,100% { transform: translate3d(-1.1%,.5%,0) scale(1.09); } 38% { transform: translate3d(.9%,-.9%,0) scale(1.15); } }
.nyp-wordmark { font-size: min(19rem, calc((100vw - 2.5rem) / 4.75)); }
html[data-nyp-intro="held"] .nyp-letter { transform: translateY(105%); }
html[data-nyp-intro="held"] .nyp-hero-photo { transform: scale(1.06); }
html[data-nyp-intro="held"] .nyp-kicker { opacity: 0; }
/* The drift only runs while the hero can be seen: three full-viewport layers
   compositing behind the rest of the page is cost with nothing to show. */
header[data-offscreen] .nyp-fog img { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .nyp-fog { display: none; }
}
`

type Phase = 'static' | 'hidden' | 'shown'

export default function Hero({ t, reduced }: { t: Copy; reduced: boolean }) {
  const heroRef = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const fadeRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('static')

  /* The arrival.
   * Standalone site: nypugardar.html marks <html data-nyp-intro="held"> before
   * first paint and the stylesheet above holds the letters down. Here React
   * takes the hold over inline (no transition, so nothing moves), drops the
   * attribute, and releases on the next frames with the transitions on.
   * If the failsafe already released it, the page has been readable for a
   * while: never replay. Catalogue (client render, no attribute): the layout
   * effect runs before first paint, so it can hide and release the same way. */
  useIsoLayoutEffect(() => {
    const root = document.documentElement
    const mark = root.dataset.nypIntro
    if (mark === 'released') return
    if (reduced || (!mark && window.scrollY > 40)) {
      delete root.dataset.nypIntro
      return
    }
    setPhase('hidden')
    let raf = requestAnimationFrame(() => {
      delete root.dataset.nypIntro
      raf = requestAnimationFrame(() => setPhase('shown'))
    })
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  /* Pause the fog drift while the hero is off screen. */
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || reduced) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) delete hero.dataset.offscreen
      else hero.dataset.offscreen = ''
    })
    io.observe(hero)
    return () => io.disconnect()
  }, [reduced])

  /* The scroll scene. */
  useEffect(() => {
    if (reduced) return
    let disposed = false
    let revert: (() => void) | null = null
    loadMotion().then(({ gsap }) => {
      const hero = heroRef.current
      const wrap = wrapRef.current
      const content = contentRef.current
      const fade = fadeRef.current
      if (disposed || !hero || !wrap || !content || !fade) return
      const S = scrub()
      const vh = () => window.innerHeight
      const whole = { trigger: hero, start: 'top top', end: 'bottom top', scrub: S, invalidateOnRefresh: true }
      const ctx = gsap.context(() => {
        gsap.to(wrap, { y: () => vh(), ease: 'none', scrollTrigger: whole })
        /* A scrubbed blur repaints the whole hero every frame; WebKit on a
           phone pays for it in dropped frames. The fade carries it there. */
        if (!isTouch())
          gsap.fromTo(content, { filter: 'blur(0px)' }, { filter: 'blur(10px)', ease: 'none', scrollTrigger: whole })
        hero.querySelectorAll<HTMLElement>('[data-fog-speed]').forEach((el) => {
          gsap.to(el, { y: el.dataset.fogSpeed, ease: 'none', scrollTrigger: whole })
        })
        gsap.fromTo(
          fade,
          { opacity: 0 },
          { opacity: 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top-=8%', end: 'top top-=52%', scrub: S } },
        )
        hero.querySelectorAll<HTMLElement>('[data-hero-drift]').forEach((el) => {
          gsap.to(el, { y: () => -0.6 * vh(), ease: 'none', scrollTrigger: whole })
        })
      }, hero)
      revert = () => ctx.revert()
    })
    return () => {
      disposed = true
      revert?.()
    }
  }, [reduced])

  const on = phase === 'shown'
  /* The held state carries NO transition: the hold must apply instantly.
     With the transition attached, hiding animated too, and the release 60ms
     later reversed it before anything visibly moved (measured: letters never
     left y=0, the photo only reached scale 1.008). */
  const photoStyle: CSSProperties | undefined =
    phase === 'static'
      ? undefined
      : on
        ? { transform: 'scale(1)', transition: `transform 2.2s ${EASE_REVEAL}` }
        : { transform: 'scale(1.06)', transition: 'none' }
  const fadeIn = (delay: number): CSSProperties | undefined =>
    phase === 'static'
      ? undefined
      : on
        ? { opacity: 1, transition: `opacity 0.9s ease ${delay}ms` }
        : { opacity: 0, transition: 'none' }

  return (
    <header
      ref={heroRef}
      /* The mist ground behind the wrapper: in the second viewport the fog
         plates are the only thing drawn over it, and wherever a plate is thin
         the page ground shows through. Night there read as a dark seam. */
      className="relative h-[200svh] bg-[#E9EAE5] motion-reduce:h-[100svh]"
      aria-labelledby="hero-title"
    >
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />
      {/* Nav-ground markers: clear while the picture is the ground, mist once
          the fog has taken over. Read by the bar's observer in Page.tsx. */}
      <div aria-hidden="true" data-nav="clear" className="pointer-events-none absolute inset-x-0 top-0 h-[70svh] motion-reduce:h-full" />
      <div aria-hidden="true" data-nav="mist" className="pointer-events-none absolute inset-x-0 bottom-0 top-[70svh] motion-reduce:hidden" />

      <div ref={wrapRef} className="relative h-[100svh] [transform:translateZ(0)]">
        <div className="absolute inset-0 overflow-hidden bg-[#15130F]">
          <Img
            src={largest(IMG.hero)}
            srcSet={srcSet(IMG.hero)}
            sizes="100vw"
            alt={t.hero.alt}
            fetchpriority="high"
            loading="eager"
            className="nyp-hero-photo absolute inset-0 h-full w-full object-cover"
            style={photoStyle}
          />
          <HeroFilm reduced={reduced} on={phase !== 'hidden'} />
          {/* Low scrim at the foot for the wordmark, a lighter one at the head
              for the kicker. The top two thirds of the frame are the light on
              the ice and are left alone. */}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#15130F]/60 via-[#15130F]/10 to-[#15130F]/25" />
          <div
            ref={fadeRef}
            aria-hidden="true"
            className="absolute inset-0 opacity-0"
            style={{
              background:
                'linear-gradient(to top, #E9EAE5 0%, #E9EAE5 10%, rgba(233,234,229,.92) 22%, rgba(233,234,229,.55) 38%, transparent 64%)',
            }}
          />
        </div>

        <div ref={contentRef} className="absolute inset-0 z-[3] text-[#F4EEE2]">
          <h1 id="hero-title" className="grid h-full grid-rows-[1fr_auto]">
            <span className="row-start-2 flex justify-center pb-[0.4rem]" data-hero-drift>
              {/* pb reserves the descenders (ý, p, g sit 0.22em below the
                  baseline in Erode) inside the mask AND in the layout; a
                  negative margin here let the viewport edge crop them. */}
              <span translate="no" className="nyp-wordmark relative block overflow-hidden whitespace-nowrap pb-[0.24em] font-erode font-light leading-[0.95] tracking-[-0.01em] [text-shadow:0_2px_40px_rgba(21,19,15,0.25)]">
                {/* One copy of the name, as letters. A visually hidden duplicate
                    made the h1 read "NýpugarðarNýpugarðar" to anything that takes
                    textContent, crawlers included. */}
                <span className="nyp-word">
                  {Array.from(WORDMARK).map((ch, i) => (
                    <span
                      key={i}
                      className="nyp-letter inline-block"
                      style={
                        phase === 'static'
                          ? undefined
                          : on
                            ? { transform: 'translateY(0)', transition: `transform 1.4s ${EASE_REVEAL} ${250 + i * 45}ms` }
                            : { transform: 'translateY(105%)', transition: 'none' }
                      }
                    >
                      {ch}
                    </span>
                  ))}
                </span>
              </span>
            </span>
            <span className="sr-only">, </span>
            <span
              className="row-start-1 flex items-center px-5 pt-20 md:px-8"
              data-hero-drift
            >
              <span
                className="nyp-kicker block max-w-[17rem] font-erode text-[1.35rem] font-light italic leading-[1.25] [text-shadow:0_1px_14px_rgba(21,19,15,0.45)] md:max-w-[20rem] md:text-[1.6rem]"
                style={fadeIn(900)}
              >
                {t.hero.kicker}
              </span>
            </span>
          </h1>
        </div>

        <div className="nyp-fog nyp-fog--far" data-fog-speed="-10%" aria-hidden="true">
          <img src={`${BASE}nypugardar/fog/far-1920.webp`} srcSet={`${BASE}nypugardar/fog/far-960.webp 960w, ${BASE}nypugardar/fog/far-1920.webp 1920w`} sizes="100vw" alt="" width={1920} height={1080} decoding="async" />
        </div>
        <div className="nyp-fog nyp-fog--veil" data-fog-speed="-42%" aria-hidden="true">
          <img src={`${BASE}nypugardar/fog/veil-1920.webp`} srcSet={`${BASE}nypugardar/fog/veil-960.webp 960w, ${BASE}nypugardar/fog/veil-1920.webp 1920w`} sizes="100vw" alt="" width={1920} height={1080} decoding="async" />
        </div>
        <div className="nyp-fog nyp-fog--near" data-fog-speed="-80%" aria-hidden="true">
          <img src={`${BASE}nypugardar/fog/near-1920.webp`} srcSet={`${BASE}nypugardar/fog/near-960.webp 960w, ${BASE}nypugardar/fog/near-1920.webp 1920w`} sizes="100vw" alt="" width={1920} height={1080} decoding="async" />
        </div>
      </div>
    </header>
  )
}

/* ── HeroFilm — her own photograph, moving (moved here from Page.tsx).
 *
 * The hero still was handed to an image-to-video model and asked for nothing
 * but what the weather does: clouds drift, the light shifts on the ice, a slow
 * push in. An 8.7 s loop. It is a LUXURY, fetched only on wide fine-pointer
 * screens with no reduced-motion or Save-Data preference; the still underneath
 * stays the LCP element and the film fades over it once it is really playing.
 * Client-side only, so the prerendered HTML carries no <video>. */
function HeroFilm({ reduced, on }: { reduced: boolean; on: boolean }) {
  const [wanted, setWanted] = useState(false)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (reduced) return
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
    if (nav.connection?.saveData) return
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const decide = () => setWanted(mq.matches)
    decide()
    mq.addEventListener('change', decide)
    return () => mq.removeEventListener('change', decide)
  }, [reduced])
  if (!wanted) return null
  return (
    <video
      ref={(el) => {
        if (!el) return
        el.muted = true
        el.play().catch(() => {})
      }}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ opacity: playing && on ? 1 : 0, transition: `opacity 1.6s ${EASE_REVEAL}` }}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      disableRemotePlayback
      onPlaying={() => setPlaying(true)}
    >
      <source src={`${BASE}nypugardar/film/hero-1600.mp4`} type="video/mp4" />
    </video>
  )
}
