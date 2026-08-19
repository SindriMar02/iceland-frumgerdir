/**
 * The serie view's two layouts, both from the reference:
 *  LIST (default) — each painting full-width and stacked, with ONE fixed
 *  name + `01/NN` counter whose characters roll like an odometer as the
 *  current painting passes (SplitText chars, rotateX ±90, y ∓2, z ±10,
 *  direction-aware transform-origins, stagger from 'end', 0.5s power3.out,
 *  the incoming roll starting at -=0.4).
 *  GRID — the sparse 5×173px index; switching layouts is a GSAP Flip
 *  (absolute, stagger 0.01, 1.5s power4.inOut) after a scroll-to-top tween of
 *  duration max(√scrollY×0.03, 1.25).
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { SplitText } from 'gsap/SplitText'
import { GRID_REVEAL, LIST_REVEAL, REVEAL_START, gridDelay, isMobile, reduceMotion } from './motion'
import type { Work } from './works'

gsap.registerPlugin(Flip, SplitText)

const pad2 = (n: number) => String(n).padStart(2, '0')

interface Props {
  works: Work[]
  grid: (id: string) => string
  full: (id: string) => string
  onOpen: (id: string) => void
  lbl: string
  listLabel: string
  gridLabel: string
}

export function SeriesWorks({ works, grid, full, onOpen, lbl, listLabel, gridLabel }: Props) {
  const [layout, setLayout] = useState<'list' | 'grid'>('list')
  const listRef = useRef<HTMLUListElement>(null)
  const nameWrapRef = useRef<HTMLSpanElement>(null)
  const numWrapRef = useRef<HTMLSpanElement>(null)
  const state = useRef({
    current: 0,
    animating: false,
    nameSplits: [] as SplitText[],
    numSplits: [] as SplitText[],
    flipping: false,
  })

  /* ---- build the stacked clones for the odometer ---- */
  useEffect(() => {
    const nameWrap = nameWrapRef.current
    const numWrap = numWrapRef.current
    if (!nameWrap || !numWrap || reduceMotion()) return
    const s = state.current
    s.nameSplits = []
    s.numSplits = []
    nameWrap.textContent = ''
    numWrap.textContent = ''
    works.forEach((w, i) => {
      const el = document.createElement('span')
      el.textContent = w.title
      el.style.cssText =
        i === 0
          ? 'display:inline-block; perspective:1000px; transform-style:preserve-3d;'
          : 'position:absolute; top:0; left:0; display:inline-block; perspective:1000px; transform-style:preserve-3d; white-space:nowrap;'
      nameWrap.appendChild(el)
      const split = new SplitText(el, { type: 'chars' })
      if (i !== 0) gsap.set(split.chars, { rotateX: 90, z: 10, opacity: 0 })
      s.nameSplits.push(split)

      const num = document.createElement('span')
      num.textContent = pad2(i + 1)
      num.style.cssText =
        (i === 0 ? '' : 'position:absolute; top:0; left:0;') +
        'display:inline-block; width:2ch; text-align:center; font-variant-numeric:tabular-nums; perspective:1000px; transform-style:preserve-3d;'
      numWrap.appendChild(num)
      const nsplit = new SplitText(num, { type: 'chars' })
      if (i !== 0) gsap.set(nsplit.chars, { rotateX: 90, z: 10, opacity: 0 })
      s.numSplits.push(nsplit)
    })
    s.current = 0
    return () => {
      s.nameSplits = []
      s.numSplits = []
    }
  }, [works])

  /* ---- scroll → which painting is current; roll on change ---- */
  const roll = useCallback((from: number, to: number) => {
    const s = state.current
    if (s.animating || from === to) return
    s.animating = true
    const down = to > from
    const rot = { out: down ? -90 : 90, in: down ? 90 : -90 }
    const pos = { outY: down ? -2 : 2, inY: down ? -2 : 2, outZ: down ? 10 : -10, inZ: down ? -10 : 10 }
    const org = { out: down ? 'top' : 'bottom', in: down ? 'bottom' : 'top' }
    const tl = gsap.timeline({
      onComplete: () => {
        s.animating = false
      },
    })
    const pairs: Array<[SplitText[], number]> = [
      [s.nameSplits, 0.02],
      [s.numSplits, 0.075],
    ]
    for (const [splits, each] of pairs) {
      const out = splits[from]?.chars
      const inc = splits[to]?.chars
      if (out) {
        gsap.set(out, { transformOrigin: org.out })
        tl.to(
          out,
          { rotateX: rot.out, y: pos.outY, z: pos.outZ, opacity: 0, stagger: { each, from: 'end' }, duration: 0.5, ease: 'power3.out' },
          0,
        )
      }
      if (inc) {
        gsap.set(inc, { rotateX: rot.in, y: pos.inY, z: pos.inZ, opacity: 1, transformOrigin: org.in })
        tl.to(
          inc,
          { rotateX: 0, y: 0, z: 0, stagger: { each, from: 'end' }, duration: 0.5, ease: 'power3.out' },
          '-=0.4',
        )
      }
    }
  }, [])

  useEffect(() => {
    if (reduceMotion()) return
    const s = state.current
    const onScroll = () => {
      if (layout !== 'list' || s.animating || s.flipping) return
      const wrap = nameWrapRef.current
      const list = listRef.current
      if (!wrap || !list) return
      const anchor = wrap.getBoundingClientRect().top
      const imgs = [...list.querySelectorAll<HTMLElement>('[data-work-img]')]
      let idx = 0
      for (let i = imgs.length - 1; i >= 0; i--) {
        if (imgs[i].getBoundingClientRect().top <= anchor) {
          idx = i
          break
        }
      }
      if (idx !== s.current) {
        roll(s.current, idx)
        s.current = idx
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [layout, roll])

  /* ---- entrance reveal: list yPercent 100 · 1.5s · stagger 0.1 · expo.out;
         grid yPercent 200 · 1.75s · center-out delay ---- */
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const imgs = [...list.querySelectorAll<HTMLElement>('[data-work-img]')]
    if (reduceMotion() || !imgs.length) return
    const tl = gsap.timeline({ paused: true })
    if (layout === 'list') {
      tl.from(imgs, {
        yPercent: LIST_REVEAL.yPercent,
        duration: LIST_REVEAL.duration,
        stagger: LIST_REVEAL.stagger,
        ease: LIST_REVEAL.ease,
        clearProps: 'transform',
      })
    } else {
      imgs.forEach((el, i) => {
        tl.from(
          el,
          {
            yPercent: GRID_REVEAL.yPercent,
            duration: GRID_REVEAL.duration,
            ease: GRID_REVEAL.ease,
            clearProps: 'transform',
          },
          gridDelay(i, isMobile()),
        )
      })
    }
    const play = () => tl.play()
    window.addEventListener(REVEAL_START, play)
    // layout toggles happen outside a view change, so cue them directly
    const t = setTimeout(() => {
      if (!tl.isActive() && tl.progress() === 0 && !state.current.flipping) tl.play()
    }, 900)
    return () => {
      window.removeEventListener(REVEAL_START, play)
      clearTimeout(t)
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [works])

  /* ---- list ⇄ grid via Flip ---- */
  const toggle = useCallback(
    (next: 'list' | 'grid') => {
      const s = state.current
      if (next === layout || s.flipping) return
      const list = listRef.current
      if (!list) return
      if (reduceMotion()) {
        setLayout(next)
        return
      }
      s.flipping = true
      const go = () => {
        const flipState = Flip.getState(list.querySelectorAll('[data-work-cell], [data-work-img]'))
        setLayout(next)
        requestAnimationFrame(() => {
          Flip.from(flipState, {
            absolute: true,
            stagger: 0.01,
            duration: 1.5,
            ease: 'power4.inOut',
            onComplete: () => {
              s.flipping = false
            },
          })
        })
      }
      const dur = window.scrollY ? Math.max(Math.sqrt(window.scrollY) * 0.03, 1.25) : 0
      if (dur > 0) gsap.to(window, { scrollTo: 0, duration: dur, ease: 'power4.inOut', onComplete: go })
      else go()
    },
    [layout],
  )

  const LBL = lbl

  return (
    <div className="relative">
      {/* layout toggle, 9px like everything else */}
      <div className="flex items-center gap-6 px-6 pb-10 md:px-10">
        <button
          type="button"
          onClick={() => toggle('list')}
          className={`${LBL} ${layout === 'list' ? 'text-black' : 'text-black/35'}`}
        >
          {listLabel}
        </button>
        <button
          type="button"
          onClick={() => toggle('grid')}
          className={`${LBL} ${layout === 'grid' ? 'text-black' : 'text-black/35'}`}
        >
          {gridLabel}
        </button>
      </div>

      <ul
        ref={listRef}
        className={
          layout === 'list'
            ? 'asaja-serie-list mx-auto flex max-w-[880px] list-none flex-col gap-[16vh] px-6 pb-40'
            : `asaja-grid mx-auto grid list-none grid-cols-2 justify-center gap-x-[26px] gap-y-[44px] px-6 pb-40
               sm:grid-cols-3 sm:gap-x-[56px] sm:gap-y-[76px]
               lg:[grid-template-columns:repeat(4,150px)] lg:gap-x-[100px] lg:gap-y-[104px]
               [@media(min-width:1440px)]:[grid-template-columns:repeat(5,173px)]
               [@media(min-width:1440px)]:gap-x-[134px] [@media(min-width:1440px)]:gap-y-[134px]`
        }
      >
        {works.map((w, i) => (
          <li key={w.id} data-work-cell="">
            <button
              type="button"
              onClick={() => onOpen(w.id)}
              className="asaja-cell group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              <span
                className={
                  layout === 'list'
                    ? 'block overflow-hidden'
                    : 'block aspect-square w-full overflow-hidden'
                }
              >
                <img
                  data-work-img=""
                  src={layout === 'list' ? full(w.id) : grid(w.id)}
                  alt={`${w.title}, ${w.year}`}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                  width={w.w}
                  height={w.h}
                  className={
                    layout === 'list'
                      ? 'asaja-thumb block w-full will-change-transform'
                      : 'asaja-thumb block h-full w-full object-contain object-bottom will-change-transform'
                  }
                />
              </span>
              {layout === 'grid' && (
                <span className={`${LBL} mt-3 flex items-baseline gap-2 text-black`}>
                  <span className="tabular-nums opacity-40">{pad2(i + 1)}</span>
                  <span className="truncate">{w.title}</span>
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* the fixed rolling name + counter (list layout only) */}
      <div
        aria-hidden={layout !== 'list'}
        className={`pointer-events-none fixed inset-x-0 bottom-8 z-30 px-6 transition-opacity duration-300 md:px-10 ${
          layout === 'list' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-end justify-between">
          <span
            ref={nameWrapRef}
            className="asaja-display relative inline-block overflow-hidden text-[clamp(24px,2.4vw,34px)] uppercase leading-none tracking-[0em]"
            style={{ lineHeight: 1 }}
          />
          <span className={`${LBL} flex items-baseline gap-1 tabular-nums`}>
            <span ref={numWrapRef} className="relative inline-block overflow-hidden" style={{ lineHeight: 1 }} />
            <span className="opacity-40">/{pad2(works.length)}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
