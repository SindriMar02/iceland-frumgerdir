/**
 * Faxi — the page's motion language.
 *
 * One vocabulary, four primitives, used everywhere. The point is that nothing on
 * this page animates in a way the rest of the page does not already do:
 *
 *   data-mask   an image settles into its frame from behind a short clip-path.
 *               Deliberately SHORT: a full-height curtain wipe announces itself
 *               and you notice the effect instead of the photograph. A fifth of
 *               An eighth of the frame, eased flat, is enough to feel intentional
 *               and stay below notice; anything more and you watch the effect.
 *               Images never fade — a fade reads as a slow load, not a decision.
 *   data-lines  a headline splits into lines and each line rises out of its own
 *               overflow box, 60ms apart.
 *   data-rise   supporting copy lifts 24px into place. The quiet one.
 *   data-drift  the photo inside a frame sits at 112% and drifts within the frame
 *               as you pass it. Parallax belongs INSIDE the frame; a whole section
 *               sliding under you is travel-brochure grammar, not bakery grammar.
 *
 * ScrollTrigger, not IntersectionObserver: an element that clips itself to zero is
 * never "intersecting", so IO-driven reveals on masked elements never fire (that
 * bug has cost this workspace two builds). ScrollTrigger works off positions.
 *
 * Reduced motion takes a hard branch: no Lenis, no triggers, everything painted
 * in its final state.
 *
 * Lenis runs on pointer-fine devices ONLY. iOS Safari minimises its bottom
 * toolbar to the floating pill only for a natively scrolled document, so a JS
 * scroll surface keeps the tall opaque toolbar for the whole visit and the page
 * never runs under it. The reveals below are ScrollTrigger's, not Lenis's, so
 * dropping it on touch costs nothing but the easing.
 */

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

/** Structural type for the Lenis instance, so nothing imports it statically. */
type SmoothScroll = { raf: (t: number) => void; destroy: () => void; on: (e: string, cb: () => void) => void }

/** The page's single easing curve, shared with the CSS transitions. */
export const EASE_CSS = 'cubic-bezier(.16,.84,.44,1)'
const EASE = 'power3.out'

/** Initial states, as CSS, so nothing flashes unstyled before the effect runs. */
export const MOTION_CSS = `
  /* Safari 26 samples html/body background-color for the status bar and
     home-indicator strips when nothing fixed qualifies at that edge. Scoped with
     :has so it applies only while Faxi is mounted -- this is a shared catalogue
     and the next preview must not inherit Faxi's ground. */
  html:has(.faxi-page), body:has(.faxi-page) { background-color:#F1E4CE; }

  .faxi-motion [data-mask] { clip-path:inset(11% 0% 0% 0%); will-change:clip-path; }
  .faxi-motion [data-rise] { opacity:0; transform:translateY(24px); }
  .faxi-motion [data-lines] { opacity:0; }
  /* No will-change here: GSAP promotes the element for the life of the tween and
     releases it after. Declaring it in CSS pins a compositor layer permanently
     for every framed photo on the page. */

  /* If JS never runs, nothing above should be able to hide content. */
  .faxi-nojs [data-mask] { clip-path:none !important; }
  .faxi-nojs [data-rise], .faxi-nojs [data-lines] { opacity:1 !important; transform:none !important; }

  @media (prefers-reduced-motion: reduce) {
    .faxi-motion [data-mask] { clip-path:none !important; }
    .faxi-motion [data-rise], .faxi-motion [data-lines] { opacity:1 !important; transform:none !important; }
  }
`

/**
 * Wires Lenis and every reveal in one context so a single revert() cleans up.
 * Returns nothing; the primitives are declared in markup with data attributes.
 */
export function usePageMotion(rootRef: React.RefObject<HTMLElement | null>, reduced: boolean) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    // Reduced motion: paint the final state and wire nothing at all.
    if (reduced) {
      root.classList.add('faxi-nojs')
      return
    }

    // Loaded on demand, and only where it is wanted: a phone never fetches the
    // library at all, and iOS keeps a natively scrolled document.
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let lenis: SmoothScroll | null = null
    let raf = 0
    let dropped = false
    if (!coarse) {
      void import('lenis').then((mod) => {
        if (dropped) return
        const L = mod.default as unknown as new (o: Record<string, unknown>) => SmoothScroll
        lenis = new L({
          duration: 1.05,
          easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
          smoothWheel: true,
        })
        lenis.on('scroll', ScrollTrigger.update)
        const loop = (t: number) => {
          lenis?.raf(t)
          raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
      })
    }

    const ctx = gsap.context(() => {
      // ── images and panels wipe open ──────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('[data-mask]').forEach((el) => {
        gsap.to(el, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1,
          ease: 'power1.out',
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 94%', once: true },
          // will-change promotes each frame to its own compositor layer. Left
          // on, that is 40-odd permanent layers for animations that ran once.
          onComplete: () => { el.style.willChange = 'auto' },
        })
      })

      // ── headlines rise line by line ──────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('[data-lines]').forEach((el) => {
        const split = new SplitText(el, { type: 'lines', linesClass: 'faxi-line' })
        // Each line needs its own overflow box or the rise shows above the cap line.
        split.lines.forEach((line) => {
          const box = document.createElement('span')
          box.className = 'faxi-linebox'
          line.parentNode?.insertBefore(box, line)
          box.appendChild(line)
        })
        gsap.set(el, { opacity: 1 })
        gsap.from(split.lines, {
          onComplete: () => split.lines.forEach((l) => { (l as HTMLElement).style.willChange = 'auto' }),
          yPercent: 118,
          duration: 1.05,
          ease: EASE,
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        })
      })

      // ── supporting copy lifts ────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: EASE,
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      // ── photos drift inside their own frames ─────────────────────────────
      gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    }, root)

    // Fonts change line breaks, which changes every split and every trigger.
    const onFonts = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(onFonts).catch(() => {})

    return () => {
      dropped = true
      if (raf) cancelAnimationFrame(raf)
      lenis?.destroy()
      ctx.revert()
    }
  }, [rootRef, reduced])
}
