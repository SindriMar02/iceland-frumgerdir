/**
 * Faxi — the page's motion language.
 *
 * One vocabulary, four primitives, used everywhere. The point is that nothing on
 * this page animates in a way the rest of the page does not already do:
 *
 *   data-mask   an image settles into its frame from behind a short clip-path.
 *               Deliberately SHORT: a full-height curtain wipe announces itself
 *               and you notice the effect instead of the photograph. A fifth of
 *               the frame is enough to feel intentional and stay invisible.
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
 */

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText)

/** The page's single easing curve, shared with the CSS transitions. */
export const EASE_CSS = 'cubic-bezier(.16,.84,.44,1)'
const EASE = 'power3.out'

/** Initial states, as CSS, so nothing flashes unstyled before the effect runs. */
export const MOTION_CSS = `
  .faxi-motion [data-mask] { clip-path:inset(19% 0% 0% 0%); will-change:clip-path; }
  .faxi-motion [data-rise] { opacity:0; transform:translateY(24px); }
  .faxi-motion [data-lines] { opacity:0; }
  .faxi-motion [data-drift] { will-change:transform; }

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

    const lenis = new Lenis({
      duration: 1.05,
      easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const ctx = gsap.context(() => {
      // ── images and panels wipe open ──────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('[data-mask]').forEach((el) => {
        gsap.to(el, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.8,
          ease: 'power2.out',
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 94%', once: true },
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
          { yPercent: -5 },
          {
            yPercent: 5,
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
      cancelAnimationFrame(raf)
      lenis.destroy()
      ctx.revert()
    }
  }, [rootRef, reduced])
}
