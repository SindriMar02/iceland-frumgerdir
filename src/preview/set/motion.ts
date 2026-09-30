import Lenis from 'lenis'

/* Set motion. Hybrid, as locked 2026-09-29 (_docs/set-build/DESIGN.md §10):
     [data-set-mask]   giant display titles: Live-up masked line slide, 108% to 0 (rebuild css/main.css l.66–68)
     [data-set-words]  headings and short text: the Chema video's per-word blur resolve (blur 10px, y 12px, opacity)
     [data-set-fade]   cards, paragraphs, photos: the same resolve applied to the whole element
     [data-set-drift]  a photo drifting inside its frame over the frame's pass (Live-up M6), fine pointers only
   One curve for all of it: expo out, the curve Live-up writes as cubic-bezier(.16,1,.3,1).

   Scroll reveals are tied to position over a short band (top of the element from the viewport bottom to 66%),
   never a timed entrance, so a fast flick cannot outrun them (memory: scroll-reveals-must-be-position-tied).
   Anything already on screen when it appears (the hero after the shutter, a filter change, a route with data) plays
   on a clock at the video's pace instead. Styles are inline and removed when an element lands: no text is left
   rendered through a filter, and a failure leaves a plain page. Never started under prefers-reduced-motion. */

const expo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const reducedMotion = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const isTouch = () => matchMedia('(hover: none) and (pointer: coarse)').matches
const isFine = () => matchMedia('(hover: hover) and (pointer: fine)').matches

type Kind = 'mask' | 'words' | 'fade'
type Item = {
  el: HTMLElement; kind: Kind; parts: HTMLElement[]; done: boolean
  clock?: { start: number; dur: number; stagger: number }
}

let lenis: Lenis | null = null
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
export function scrollToEl(el: Element | null, instant = false) {
  if (!el) return
  const y = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 72
  if (lenis) lenis.scrollTo(y, instant ? { immediate: true, force: true } : { duration: 1, easing: easeOutCubic })
  else window.scrollTo({ top: y, behavior: instant || reducedMotion() ? 'auto' : 'smooth' })
}
/* a route change must not inherit the previous page's easing (memory: lenis-overwrites-route-scroll-reset) */
export function resetScrollForRoute() {
  if (lenis) { lenis.scrollTo(0, { immediate: true, force: true }) }
  window.scrollTo(0, 0)
}
export function lockScroll(on: boolean) {
  if (!lenis) return
  if (on) lenis.stop(); else lenis.start()
}

/* measured line split for masked titles: words grouped by offsetTop, each line rebuilt as mask > line */
function splitLines(el: HTMLElement): HTMLElement[] {
  const text = el.dataset.text ?? (el.textContent ?? '').replace(/\s+/g, ' ').trim()
  el.dataset.text = text
  el.textContent = ''
  const words = text.split(' ')
  const spans = words.map((w) => {
    const s = document.createElement('span')
    s.textContent = w
    s.style.display = 'inline-block'
    el.appendChild(s)
    el.appendChild(document.createTextNode(' '))
    return s
  })
  const lines: string[][] = []
  let top = -1
  spans.forEach((s, i) => {
    const y = s.offsetTop
    if (top < 0 || Math.abs(y - top) > 2) { lines.push([]); top = y }
    lines[lines.length - 1].push(words[i])
  })
  el.textContent = ''
  el.setAttribute('aria-label', text)
  return lines.map((ws) => {
    const mask = document.createElement('span')
    mask.className = 'set-lm'
    mask.setAttribute('aria-hidden', 'true')
    const line = document.createElement('span')
    line.className = 'set-ll'
    line.textContent = ws.join(' ')
    mask.appendChild(line)
    el.appendChild(mask)
    return line
  })
}

/* HARD rule (memory: icelandic-titles-break-a-display-scale): a display title is fitted to its widest WORD, per title,
   so VATNSVEITULAGNIR shrinks on a phone and nothing else moves. Measured in the real face after fonts load. */
export function fitDisplay(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-set-fit]').forEach((el) => {
    el.style.fontSize = ''
    const text = el.dataset.text ?? el.textContent ?? ''
    const avail = el.clientWidth
    if (!avail) return
    const probe = document.createElement('span')
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;top:0'
    el.appendChild(probe)
    let widest = 0
    for (const w of text.split(/\s+/)) { probe.textContent = w; widest = Math.max(widest, probe.getBoundingClientRect().width) }
    probe.remove()
    if (widest > avail) {
      const size = parseFloat(getComputedStyle(el).fontSize)
      el.style.fontSize = `${Math.floor(size * (avail / widest) * 0.98 * 10) / 10}px`
    }
  })
}

function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.dataset.text ?? (el.textContent ?? '').replace(/\s+/g, ' ').trim()
  el.dataset.text = text
  el.textContent = ''
  el.setAttribute('aria-label', text)
  const parts: HTMLElement[] = []
  text.split(' ').forEach((w, i, all) => {
    const s = document.createElement('span')
    s.className = 'set-w'
    s.setAttribute('aria-hidden', 'true')
    s.textContent = w
    el.appendChild(s)
    parts.push(s)
    if (i < all.length - 1) el.appendChild(document.createTextNode(' '))
  })
  return parts
}

function paint(part: HTMLElement, kind: Kind, e: number) {
  if (kind === 'mask') { part.style.transform = e >= 1 ? '' : `translate3d(0,${((1 - e) * 108).toFixed(2)}%,0)`; return }
  if (e >= 1) { part.style.filter = ''; part.style.opacity = ''; part.style.transform = ''; return }
  const blur = kind === 'words' ? 10 : 8, rise = kind === 'words' ? 12 : 16
  part.style.filter = `blur(${((1 - e) * blur).toFixed(2)}px)`
  part.style.opacity = e.toFixed(3)
  part.style.transform = `translate3d(0,${((1 - e) * rise).toFixed(2)}px,0)`
}

export function initSetMotion(root: HTMLElement, opts: { heroDelay: () => number }): () => void {
  if (reducedMotion()) return () => {}
  const items: Item[] = []
  const known = new WeakSet<HTMLElement>()
  let raf = 0, dead = false, lastW = window.innerWidth

  /* Live-up M1 on fine pointers only; a phone never gets a JS scroll surface (memory: lenis-mobile-damage) */
  lenis = isFine() && !isTouch() ? new Lenis({ duration: 1, easing: easeOutCubic, smoothWheel: true, wheelMultiplier: 1 }) : null
  if (lenis) {
    const loop = (t: number) => { if (dead || !lenis) return; lenis.raf(t); requestAnimationFrame(loop) }
    requestAnimationFrame(loop)
  }

  const register = (el: HTMLElement) => {
    if (known.has(el) || !root.contains(el)) return
    known.add(el)
    const kind: Kind = el.hasAttribute('data-set-mask') ? 'mask' : el.hasAttribute('data-set-words') ? 'words' : 'fade'
    const parts = kind === 'mask' ? splitLines(el) : kind === 'words' ? splitWords(el) : [el]
    const it: Item = { el, kind, parts, done: false }
    const r = el.getBoundingClientRect(), vh = window.innerHeight
    if (r.bottom < 0) { it.done = true; return }                  // already scrolled past: leave it plain
    const hero = el.closest('[data-set-hero]')
    if (hero || r.top < vh * 0.9) {
      /* on screen now: a clock at the video's pace (hero .9s/word, 100ms apart; the rest .8s, 60ms) */
      const idx = Number(el.dataset.setI ?? 0)
      const delay = hero ? opts.heroDelay() + Number((hero as HTMLElement).dataset.setDelay ?? 0) : idx * 50
      it.clock = {
        start: performance.now() + delay,
        dur: kind === 'mask' ? 1200 : hero ? 900 : kind === 'words' ? 700 : 550,
        stagger: kind === 'mask' ? 80 : hero ? 100 : 50,
      }
    }
    parts.forEach((p) => paint(p, kind, 0))
    items.push(it)
    kick()
  }

  const tick = () => {
    raf = 0
    if (dead) return
    const vh = window.innerHeight, now = performance.now()
    let alive = false
    for (const it of items) {
      if (it.done) continue
      const n = it.parts.length
      if (it.clock) {
        const c = it.clock
        let all = true
        it.parts.forEach((p, i) => {
          const t = clamp((now - c.start - i * c.stagger) / c.dur)
          paint(p, it.kind, expo(t))
          if (t < 1) all = false
        })
        if (all) it.done = true; else alive = true
        continue
      }
      /* position band: top at the viewport bottom -> top at 66% of the viewport */
      const top = it.el.getBoundingClientRect().top
      const p = clamp((vh - top) / (vh * 0.34))
      const d = n > 1 ? Math.min(0.08, 0.5 / (n - 1)) : 0
      let all = true
      it.parts.forEach((part, i) => {
        const pi = clamp((p - i * d) / (1 - (n - 1) * d))
        paint(part, it.kind, expo(pi))
        if (pi < 1) all = false
      })
      if (all) it.done = true
    }
    if (alive) kick()
  }
  const kick = () => { if (!raf && !dead) raf = requestAnimationFrame(tick) }

  /* drift (M6): frames on fine pointers only; nothing moves under a finger */
  const drift = () => {
    if (!isFine() || window.innerWidth < 900) return
    const vh = window.innerHeight
    root.querySelectorAll<HTMLElement>('[data-set-drift]').forEach((im) => {
      const r = im.parentElement!.getBoundingClientRect()
      if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) return
      const p = clamp((vh - r.top) / (vh + r.height))
      im.style.transform = `translate3d(0,${((p - 0.5) * 8).toFixed(2)}%,0) scale(1.1)`
    })
  }
  const onScroll = () => { kick(); drift() }
  window.addEventListener('scroll', onScroll, { passive: true })

  const scan = (node: ParentNode) => {
    node.querySelectorAll<HTMLElement>('[data-set-mask],[data-set-words],[data-set-fade]').forEach(register)
  }
  const mo = new MutationObserver((recs) => {
    for (const r of recs) r.addedNodes.forEach((n) => {
      if (!(n instanceof HTMLElement)) return
      if (n.matches('[data-set-mask],[data-set-words],[data-set-fade]')) register(n)
      scan(n)
    })
  })
  const start = () => {
    if (dead) return
    fitDisplay(root)
    scan(root)
    mo.observe(root, { childList: true, subtree: true })
    drift()
  }
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
  /* line splits need the real face; hide nothing until then (the page is already plain and readable) */
  const timer = window.setTimeout(start, 1200)
  fonts?.ready.then(() => { window.clearTimeout(timer); start() })

  /* re-split masked titles on a real width change only: on iOS the URL bar changes the height mid-fling */
  let rT = 0
  const onResize = () => {
    if (window.innerWidth === lastW) return
    lastW = window.innerWidth
    window.clearTimeout(rT)
    rT = window.setTimeout(() => {
      items.forEach((it) => { if (it.kind === 'mask') it.el.textContent = it.el.dataset.text ?? '' })
      fitDisplay(root)
      items.forEach((it) => {
        if (it.kind !== 'mask') return
        const was = it.done
        it.parts = splitLines(it.el)
        it.parts.forEach((p) => paint(p, 'mask', was ? 1 : 0))
      })
      kick(); drift()
    }, 180)
  }
  window.addEventListener('resize', onResize)

  return () => {
    dead = true
    cancelAnimationFrame(raf)
    window.clearTimeout(timer)
    window.clearTimeout(rT)
    mo.disconnect()
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    lenis?.destroy(); lenis = null
    items.forEach((it) => {
      if (it.el.dataset.text !== undefined) { it.el.textContent = it.el.dataset.text; delete it.el.dataset.text; it.el.removeAttribute('aria-label') }
      else it.parts.forEach((p) => paint(p, it.kind, 1))
    })
    root.querySelectorAll<HTMLElement>('[data-set-drift]').forEach((im) => { im.style.transform = '' })
  }
}
