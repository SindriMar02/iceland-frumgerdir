/**
 * The homepage device, rebuilt to the reference's own physics: NOT native
 * scroll but an infinite wheel-velocity snap slider. Constants verbatim from
 * juliencalot.com's bundle (see motion.ts). The metadata band of each slide is
 * a fixed full-viewport layer clipped with `inset(top% 0 bottom% 0)` computed
 * from its slide's wrapped offset — the reference's exact formula — so the
 * series name is WIPED in and out as the painting passes, never faded.
 * Hover splits the viewport into vertical zones; crossing zones swaps the
 * painting with a 0.45s directional wipe (their PIXI shader, done in clip-path).
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { REVEAL_START, SLIDER, isMobile, reduceMotion } from './motion'

/* DOM tuning over the reference constants: their maxVelocity (0.8) was a PIXI
   per-frame unit — in this loop it means nearly a slide per frame. Calmer caps,
   measured against the real site's travel: one wheel notch drifts, a firm spin
   carries about one slide, momentum dies over ~1.5s. */
const VEL_CAP = 0.22
const VEL_PER_EVENT = 0.028

export interface Slide {
  id: string
  hero: string
  /** alternate paintings from the same series, shown on hover zones */
  variants: string[]
  pos: string
  band: 'light' | 'dark'
  node: React.ReactNode
  label: string
}

interface Props {
  slides: Slide[]
  onOpen: (id: string) => void
  /** fires whenever the centred slide changes, with its index */
  onIndex?: (i: number) => void
}

export function HomeSlider({ slides, onOpen, onIndex }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(onOpen)
  const indexRef = useRef(onIndex)
  openRef.current = onOpen
  indexRef.current = onIndex

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const slideEls = [...root.querySelectorAll<HTMLElement>('[data-slide]')]
    const bandEls = [...root.querySelectorAll<HTMLElement>('[data-band]')]
    const n = slideEls.length
    if (!n) return

    const reduced = reduceMotion()
    let H = root.clientHeight
    const wrapH = () => n * H
    // wrap into [-H, wrapH - H) — the reference's gsap.utils.wrap range
    const wrap = gsap.utils.wrap(-H, wrapH() - H)

    /* ---- physics state (names mirror their source) ---- */
    let scrollY_norm = 0
    let targetScrollY_norm = 0
    let velocity = 0
    let snapping = false
    let lastIndex = -1

    const paint = () => {
      for (let i = 0; i < n; i++) {
        const off = wrap(i * H + scrollY_norm * H)
        slideEls[i].style.transform = `translate3d(0, ${off}px, 0)`
        // the band clip: fixed layer, clipped to its slide's visible window
        const top = Math.max(0, off)
        const bottom = Math.min(H, off + H)
        bandEls[i].style.clipPath =
          bottom <= 0 || top >= H
            ? 'inset(100% 0% 0% 0%)'
            : `inset(${(top / H) * 100}% 0% ${((H - bottom) / H) * 100}% 0%)`
      }
      const cur = ((Math.round(-scrollY_norm) % n) + n) % n
      if (cur !== lastIndex) {
        lastIndex = cur
        indexRef.current?.(cur)
      }
    }

    const render = () => {
      if (snapping) {
        const target = Math.round(targetScrollY_norm)
        targetScrollY_norm += (target - targetScrollY_norm) * SLIDER.snapLerp
        if (Math.abs(target - targetScrollY_norm) < 0.001) targetScrollY_norm = target
      } else {
        velocity *= SLIDER.friction
        targetScrollY_norm += velocity
        if (
          Math.abs(velocity) < SLIDER.minVelocityThreshold &&
          Math.abs(targetScrollY_norm - Math.round(targetScrollY_norm)) < SLIDER.snapDistance
        )
          snapping = true
      }
      scrollY_norm += (targetScrollY_norm - scrollY_norm) * SLIDER.scrollLerp
      paint()
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      let d = e.deltaY
      if (e.deltaMode === 1) d *= 16
      else if (e.deltaMode === 2) d *= H
      snapping = false
      // gentle injection: one full wheel notch adds ~0.005 norm/frame of velocity;
      // the friction/lerp pair (their constants) does the gliding
      velocity -= Math.max(
        -VEL_PER_EVENT,
        Math.min(VEL_PER_EVENT, (d / H) * SLIDER.acceleration * SLIDER.wheelMultiplier * 3.5),
      )
      velocity = Math.max(-VEL_CAP, Math.min(VEL_CAP, velocity))
    }

    /* ---- touch ---- */
    let touchStart = 0
    let touchLast = 0
    let touchT = 0
    let dragged = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStart = touchLast = e.touches[0].clientY
      touchT = performance.now()
      dragged = 0
      snapping = false
      velocity = 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY
      const d = touchLast - y
      touchLast = y
      dragged += Math.abs(d)
      targetScrollY_norm -= (d / H) * (SLIDER.touchMultiplier / 6)
    }
    const onTouchEnd = () => {
      const dt = Math.max(performance.now() - touchT, 1)
      const flick = ((touchStart - touchLast) / dt) * 5
      velocity = Math.max(-VEL_CAP, Math.min(VEL_CAP, -flick / H))
      snapping = Math.abs(velocity) < SLIDER.minVelocityThreshold
    }

    /* ---- hover zones: crossing a zone swaps the painting with a wipe ---- */
    let curZone = -1
    const onMove = (e: MouseEvent) => {
      if (isMobile()) return
      // only while settled, like the reference (delta < 5px)
      if (Math.abs(targetScrollY_norm - scrollY_norm) * H > 5) return
      const i = lastIndex
      const slide = slideEls[i]
      if (!slide) return
      const variants = [...slide.querySelectorAll<HTMLElement>('[data-variant]')]
      const zones = variants.length + 1
      if (zones < 2) return
      const zone = Math.max(0, Math.min(zones - 1, Math.floor((e.clientX / root.clientWidth) * zones)))
      if (zone === curZone) return
      const down = zone > curZone
      curZone = zone
      // zone 0 = the hero itself (all variants wiped out); zone k = variant k-1 on top
      variants.forEach((v, k) => {
        gsap.killTweensOf(v)
        const show = k === zone - 1
        gsap.to(v, {
          clipPath: show
            ? 'inset(0% 0% 0% 0%)'
            : down
              ? 'inset(0% 0% 100% 0%)'
              : 'inset(100% 0% 0% 0%)',
          duration: SLIDER.hoverWipe,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })
    }
    const onLeave = () => {
      if (curZone === -1) return
      curZone = -1
      slideEls.forEach((s) =>
        [...s.querySelectorAll<HTMLElement>('[data-variant]')].forEach((v) =>
          gsap.to(v, { clipPath: 'inset(100% 0% 0% 0%)', duration: SLIDER.hoverWipe, ease: 'power2.out' }),
        ),
      )
    }

    const onClick = () => {
      if (dragged > 12) return
      const s = slides[lastIndex]
      if (s) openRef.current(s.id)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        targetScrollY_norm = Math.round(targetScrollY_norm) - 1
        snapping = true
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        targetScrollY_norm = Math.round(targetScrollY_norm) + 1
        snapping = true
      }
    }

    const onResize = () => {
      H = root.clientHeight
      paint()
    }

    paint()
    if (reduced) {
      // reduced motion: arrow keys/taps step instantly, no physics loop
      const step = () => {
        scrollY_norm = targetScrollY_norm = Math.round(targetScrollY_norm)
        paint()
      }
      const onKeyReduced = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') targetScrollY_norm -= 1
        else if (e.key === 'ArrowUp' || e.key === 'PageUp') targetScrollY_norm += 1
        else return
        step()
      }
      const onWheelReduced = (e: WheelEvent) => {
        e.preventDefault()
        targetScrollY_norm -= Math.sign(e.deltaY)
        step()
      }
      window.addEventListener('keydown', onKeyReduced)
      root.addEventListener('wheel', onWheelReduced, { passive: false })
      root.addEventListener('click', onClick)
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('keydown', onKeyReduced)
        root.removeEventListener('wheel', onWheelReduced)
        root.removeEventListener('click', onClick)
        window.removeEventListener('resize', onResize)
      }
    }

    gsap.ticker.add(render)
    root.addEventListener('wheel', onWheel, { passive: false })
    root.addEventListener('touchstart', onTouchStart, { passive: true })
    root.addEventListener('touchmove', onTouchMove, { passive: true })
    root.addEventListener('touchend', onTouchEnd, { passive: true })
    root.addEventListener('mousemove', onMove)
    root.addEventListener('mouseleave', onLeave)
    root.addEventListener('click', onClick)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      gsap.ticker.remove(render)
      root.removeEventListener('wheel', onWheel)
      root.removeEventListener('touchstart', onTouchStart)
      root.removeEventListener('touchmove', onTouchMove)
      root.removeEventListener('touchend', onTouchEnd)
      root.removeEventListener('mousemove', onMove)
      root.removeEventListener('mouseleave', onLeave)
      root.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [slides])

  /* First-load entrance — there is no loading screen, so the landing page has to
     arrive rather than blink into existence: the opening painting settles down
     from a 1.06 scale as it fades up, and the metadata band follows it in. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const first = root.querySelector<HTMLElement>('[data-slide] img')
    const band = root.querySelector<HTMLElement>('[data-band]')
    if (!first) return
    // fromTo, never from: React double-mounts effects in dev, and a killed `from()`
    // leaves its start state written to the DOM — the next `from()` then reads that
    // as its target and animates 0 -> 0, leaving the page blank forever.
    const tl = gsap.timeline({ paused: true })
    if (reduceMotion()) {
      tl.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 })
    } else {
      tl.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: 'power2.out' }, 0)
        .fromTo(
          first,
          { scale: 1.06 },
          { scale: 1, duration: 1.9, ease: 'expo.out', clearProps: 'transform' },
          0,
        )
      if (band) tl.fromTo(band, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: 'power2.out' }, 0.45)
    }
    const play = () => tl.play()
    window.addEventListener(REVEAL_START, play)
    const fallback = window.setTimeout(() => {
      if (tl.progress() === 0 && !tl.isActive()) tl.play()
    }, 900)
    return () => {
      window.removeEventListener(REVEAL_START, play)
      window.clearTimeout(fallback)
      tl.kill()
      gsap.set(root, { clearProps: 'opacity,visibility' })
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 cursor-pointer overflow-hidden bg-black"
      role="region"
      aria-roledescription="carousel"
      aria-label={slides.map((s) => s.label).join(' · ')}
    >
      {/* the paintings, one absolutely-positioned slide each, translated by the loop */}
      {slides.map((s) => (
        <div key={s.id} data-slide="" className="absolute inset-0 will-change-transform">
          <img
            src={s.hero}
            alt={s.label}
            decoding="async"
            style={{ objectPosition: s.pos }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {s.variants.map((v) => (
            <img
              key={v}
              src={v}
              alt=""
              aria-hidden
              data-variant=""
              decoding="async"
              loading="lazy"
              style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              className="absolute inset-0 h-full w-full object-cover will-change-[clip-path]"
            />
          ))}
          <div aria-hidden className="sbb-topveil absolute inset-x-0 top-0 h-[150px]" />
        </div>
      ))}
      {/* the fixed band layer per slide, clipped by the slide's visible window */}
      {slides.map((s) => (
        <div
          key={`band-${s.id}`}
          data-band=""
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        >
          {s.node}
        </div>
      ))}
    </div>
  )
}
