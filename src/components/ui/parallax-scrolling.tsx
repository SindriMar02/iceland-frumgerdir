'use client'

/**
 * 21st.dev @osmosupply/parallax-scrolling.
 *
 * The registry entry ships the GSAP wiring and NOTHING ELSE — no CSS, no
 * registryDependencies. Every class it renders (.parallax, .parallax__header,
 * .parallax__visuals, .parallax__layers, .parallax__layer-img,
 * .parallax__fade, .parallax__black-line-overflow) is absent from the package,
 * which is why the code alone cannot tell you what it looks like. The
 * stylesheet next to this file was measured off the running demo's computed
 * styles; the numbers are in its comments.
 *
 * Two changes from the registry source, both forced:
 *   · it imports '@studio-freight/lenis', which is the OLD package name.
 *     Lenis ships as 'lenis' now, and that is what is installed here.
 *   · the layers are props rather than four hardcoded cdn.21st.dev URLs, so
 *     this page can pass Katrín's own photograph and her marble.
 *
 * The motion is untouched: yPercent 70 / 55 / 40 / 10, every layer on the
 * SAME timeline position (each added at '<'), ease none, scrub 0, running
 * from the layer box's top hitting the viewport top to its bottom hitting it.
 */
import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './parallax-scrolling.css'

export interface ParallaxLayer {
  /** layer 1 is furthest away, 4 is nearest — the registry's own numbering */
  layer: '1' | '2' | '4'
  src: string
  srcAvif?: string
  alt: string
  width: number
  height: number
}

export interface ParallaxProps {
  layers: ReadonlyArray<ParallaxLayer>
  /** rides layer 3, between the plates, exactly as the demo's <h2> does */
  title: ReactNode
  /** whatever the descent hands off to */
  children?: ReactNode
  /** Lenis smooth scroll. Off by default: it costs iOS momentum and freezes
   *  nested scrollers, and this site drives its other effects from real
   *  scroll offsets. The parallax itself does not need it. */
  smooth?: boolean
}

export function ParallaxComponent({ layers, title, children, smooth = false }: ParallaxProps) {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]')
    const ctx = gsap.context(() => {
      if (!triggerElement) return
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement, start: '0% 0%', end: '100% 0%', scrub: 0,
          invalidateOnRefresh: true,
        },
      })
      const spec = [
        { layer: '1', yPercent: 70 },
        { layer: '2', yPercent: 55 },
        { layer: '3', yPercent: 40 },
        { layer: '4', yPercent: 10 },
      ]
      spec.forEach((o, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${o.layer}"]`),
          { yPercent: o.yPercent, ease: 'none' },
          idx === 0 ? undefined : '<',
        )
      })
    }, parallaxRef)

    /* WITHOUT LENIS, NOTHING DRIVES ScrollTrigger HERE.
       The registry demo always constructs Lenis and wires
       lenis.on('scroll', ScrollTrigger.update) — that call is what advances
       the timeline. Dropped straight in without Lenis the trigger measures
       correctly (start 0, end 1080) but its own scroll getter kept returning
       0 while window.scrollY was 540, so progress never moved and every
       layer sat at translate 0. This is the same wiring Lenis provides. */
    const onScroll = () => ScrollTrigger.update()
    if (!smooth) window.addEventListener('scroll', onScroll, { passive: true })

    let lenis: Lenis | undefined
    let ticker: ((t: number) => void) | undefined
    if (smooth) {
      lenis = new Lenis()
      lenis.on('scroll', ScrollTrigger.update)
      ticker = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(ticker)
      gsap.ticker.lagSmoothing(0)
    }

    /* This page is prerendered and hydrated, and its photographs decode after
       mount — so ScrollTrigger's first measurement is taken against a layout
       that has not settled, and the timeline ends up with a zero-length
       range that never advances. Re-measure once everything has landed. */
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    const imgs = Array.from(parallaxRef.current?.querySelectorAll('img') ?? [])
    let pending = imgs.filter((i) => !i.complete).length
    for (const img of imgs) {
      if (img.complete) continue
      img.addEventListener('load', () => { if (--pending <= 0) refresh() }, { once: true })
    }
    const t = window.setTimeout(refresh, 400)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('load', refresh)
      window.clearTimeout(t)
      ctx.revert()
      if (ticker) gsap.ticker.remove(ticker)
      lenis?.destroy()
    }
  }, [smooth])

  return (
    <div className="parallax" ref={parallaxRef}>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow" />
          <div data-parallax-layers className="parallax__layers">
            {/* background-image, not <img>: an absolutely positioned <img> at
                width/height:100% inside this oversized (-17.5%/117.5%) box
                computed its height from its own intrinsic aspect ratio instead
                of the parent's actual height in this engine (2000x1906 ->
                1220px against a 1128px parent, confirmed live), and whatever
                else that touched off left large stretches of these transform-
                driven layers unpainted mid-scroll. A background div has no
                replaced-element sizing algorithm to misfire. Costs the AVIF
                source (image-set() was untested after two format bugs in a
                row here) - webp only, which is still real compression. */}
            {layers.map((l) => (
              <div
                key={l.layer}
                data-parallax-layer={l.layer}
                className="parallax__layer-img"
                role={l.alt ? 'img' : undefined}
                aria-label={l.alt || undefined}
                aria-hidden={l.alt ? undefined : true}
                style={{ backgroundImage: `url(${l.src})` }}
              />
            ))}
            <div data-parallax-layer="3" className="parallax__layer-title">
              {title}
            </div>
          </div>
          <div className="parallax__fade" />
        </div>
      </section>
      {children}
    </div>
  )
}

export default ParallaxComponent
