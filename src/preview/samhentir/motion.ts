import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CUBE_LIFT } from './Art'
import { ITEM_X, beltPoint, camera, overview } from './iso'

/* Motion for the Samhentir build: the engine of the Matvélar build (Deepbook vocabulary:
   M1 line reveal, M2 grid reveal, M4 divider, M8 odometer counters, 8.5 pinned stack,
   8.7 drop, 8.10 line field), with a new hero: the flute field, a cross-section of
   corrugated board in the one blue ink. The page scrolls natively on every device. */

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('shdb', 'M0,0 C0.65,0 0.35,1 1,1')
CustomEase.create('shsui', 'M0,0 C0.19,1 0.22,1 1,1')
gsap.defaults({ ease: 'shdb' })
ScrollTrigger.config({ ignoreMobileResize: true })

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const q = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => [...root.querySelectorAll<T>(sel)]
const SIGNAL = '#284195'

/* ── generic reveals, counters and rules ──────────────────────────────── */

export function setupMotion(root: HTMLElement): () => void {
  if (reducedMotion()) {
    root.classList.add('sh-lines-fallback')
    return () => undefined
  }
  let dead = false
  const ctx = gsap.context(() => {
    /* M4 divider: two squares of their mark travel from the centre to the edges, scrub 1.1 */
    q(root, '[data-rule]').forEach((row) => {
      const [a, b] = q(row, '.sh-rule__sq')
      if (!a || !b) return
      const mid = () => (row.offsetWidth - a.offsetWidth) / 2
      const st = () => ({ trigger: row, start: 'top bottom', end: 'top 30%', scrub: 1.1, invalidateOnRefresh: true })
      gsap.fromTo(a, { x: () => mid() }, { x: 0, ease: 'none', scrollTrigger: st() })
      gsap.fromTo(b, { x: () => -mid() }, { x: 0, ease: 'none', scrollTrigger: st() })
    })
  }, root)

  const fallback = window.setTimeout(() => root.classList.add('sh-lines-fallback'), 2600)
  const ready = (document.fonts?.ready ?? Promise.resolve()) as Promise<unknown>
  ready.then(() => {
    if (dead) return
    window.clearTimeout(fallback)
    ctx.add(() => {
      lineReveal(root)
      gridReveal(root)
      initCounters(root)
    })
    ScrollTrigger.refresh()
  })
  const onLoad = () => ScrollTrigger.refresh()
  if (document.readyState !== 'complete') window.addEventListener('load', onLoad, { once: true })

  return () => {
    dead = true
    window.clearTimeout(fallback)
    window.removeEventListener('load', onLoad)
    ctx.revert()
  }
}

/* M1: lines rise 100% with a -45° tilt, .937s, stagger .08, at top 85%, once */
function lineReveal(root: HTMLElement) {
  q(root, '[data-lines]').forEach((el) => {
    let shown = false
    const split = SplitText.create(el, {
      type: 'lines',
      autoSplit: true,
      onSplit(self) {
        if (shown) return
        gsap.set(self.lines, { transformPerspective: 600, yPercent: 100, rotateX: -45, opacity: 0 })
        el.classList.add('is-split')
      },
    })
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => {
        shown = true
        gsap.to(split.lines, { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.937, ease: 'shsui', stagger: 0.08 })
      },
    })
  })
}

/* M2: children rise 24px, .4s, stagger .06, at top bottom-20% */
function gridReveal(root: HTMLElement) {
  q(root, '[data-grid-reveal]').forEach((grid) => {
    const marked = q(grid, '[data-grid-item]')
    const items = marked.length ? marked : ([...grid.children] as HTMLElement[])
    gsap.set(items, { opacity: 0, y: 24 })
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.4, stagger: 0.06,
      scrollTrigger: { trigger: grid, start: 'top bottom-=20%', once: true },
    })
  })
}

/* M8: odometer digits and a scrambled label, at top 85%, once */
const SCRAMBLE = '!@#$%^&*()_+-=[]{}|;:,.<>?/~'
interface Counter { strips: HTMLElement[]; from: number; chars: HTMLElement[] | null; original: string[]; colour: string }

function buildCounter(tile: HTMLElement): Counter | null {
  const num = tile.querySelector<HTMLElement>('[data-count]')
  if (!num) return null
  num.dataset.text ??= num.textContent?.trim() ?? ''
  const text = num.dataset.text
  if (!/\d/.test(text)) return null
  num.textContent = text
  const lh = parseFloat(getComputedStyle(num).lineHeight) || 1.2 * parseFloat(getComputedStyle(num).fontSize)
  num.textContent = ''
  num.style.display = 'inline-flex'
  const strips: HTMLElement[] = []
  for (const ch of text) {
    if (!/\d/.test(ch)) {
      const s = document.createElement('span')
      s.textContent = ch; s.style.whiteSpace = 'pre'
      num.append(s)
      continue
    }
    const d = +ch
    const win = document.createElement('span')
    win.style.cssText = `display:inline-block;height:${lh}px;overflow:hidden;vertical-align:top;`
    const strip = document.createElement('span')
    strip.style.cssText = `display:flex;flex-direction:column;line-height:${lh}px;`
    for (let k = 0; k <= 10; k++) {
      const r = document.createElement('span')
      r.textContent = String(k === 0 ? d : (d + k) % 10)
      r.style.cssText = `height:${lh}px;display:flex;align-items:center;justify-content:center;`
      strip.append(r)
    }
    win.append(strip); num.append(win)
    const ghost = document.createElement('span')
    ghost.textContent = String(d)
    ghost.style.cssText = 'visibility:hidden;position:absolute;white-space:pre;'
    num.append(ghost)
    win.style.width = `${ghost.getBoundingClientRect().width}px`
    ghost.remove()
    strips.push(strip)
  }
  const from = -10 * lh
  gsap.set(strips, { y: from })
  const label = tile.querySelector<HTMLElement>('[data-scramble]')
  let chars: HTMLElement[] | null = null, original: string[] = [], colour = ''
  if (label) {
    label.dataset.text ??= label.textContent?.trim() ?? ''
    label.textContent = label.dataset.text
    colour = getComputedStyle(label).color
    const split = new SplitText(label, { type: 'chars' })
    chars = split.chars as HTMLElement[]
    original = chars.map((c) => c.textContent ?? '')
    chars.forEach((c, i) => {
      const w = c.getBoundingClientRect().width
      Object.assign(c.style, { display: 'inline-block', width: `${w}px`, textAlign: 'center' })
      if (original[i] !== ' ') c.textContent = '0'
    })
  }
  return { strips, from, chars, original, colour }
}

function playCounter(c: Counter) {
  gsap.killTweensOf(c.strips)
  gsap.set(c.strips, { y: c.from })
  gsap.to(c.strips, { y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.04, overwrite: true })
  if (!c.chars) return
  const step = 1.6 / c.chars.length
  c.chars.forEach((ch, i) => {
    if (c.original[i] === ' ') { ch.textContent = ' '; return }
    ch.style.color = SIGNAL
    gsap.to({ t: 0 }, {
      t: 1, duration: i * step + 0.01, ease: 'none',
      onUpdate: () => { ch.textContent = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)] },
      onComplete: () => { ch.textContent = c.original[i]; ch.style.color = c.colour },
    })
  })
}

function initCounters(root: HTMLElement) {
  q(root, '[data-stats] > *').forEach((tile) => {
    const c = buildCounter(tile)
    if (!c) return
    ScrollTrigger.create({ trigger: tile, start: 'top 85%', once: true, onEnter: () => playCounter(c) })
  })
}

/* ── hero: the flute field, corrugated board seen on its edge ──────────── */

/* Layers of board stacked on top of each other: a straight liner, the fluting (a wave) and the
   next liner. Each layer drifts slowly to one side, so the stack reads as sheets sliding past;
   a few flutes are inked in full blue and travel with their layer. Under a fine pointer the
   flutes press flat, the way board gives under a thumb. */
export function fluteField(canvas: HTMLCanvasElement, still = false): () => void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => undefined
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !still
  let W = 0, H = 0, layer = 30, period = 52, rows = 0
  let lit: { row: number; k: number; born: number; life: number }[] = []
  const seeded = (n: number) => { const s = Math.sin(n * 91.3458) * 47453.5453; return s - Math.floor(s) }
  const fit = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = canvas.clientWidth; H = canvas.clientHeight
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    layer = Math.max(22, Math.min(40, W / 40))
    period = layer * 1.75
    rows = Math.ceil(H / layer) + 1
  }
  const pointer = { x: -9999, y: -9999, amount: 0 }
  const R = 170
  let phase = 0, prev = performance.now()
  const draw = (t: number, dt: number) => {
    phase += dt
    ctx.clearRect(0, 0, W, H)
    const now = t / 1000
    lit = lit.filter((b) => now - b.born < b.life)
    while (lit.length < 7) lit.push({ row: Math.floor(Math.random() * rows), k: Math.floor(Math.random() * Math.ceil(W / period + 2)), born: now, life: 2.4 + Math.random() * 2 })
    const amp = layer * 0.34
    const pressAt = (x: number, y: number) => {
      if (pointer.amount < 0.001) return 1
      const d = Math.hypot(x - pointer.x, y - pointer.y)
      return d > R ? 1 : 1 - 0.85 * pointer.amount * (1 - (d / R) ** 2)
    }
    for (let r = 0; r < rows; r++) {
      const y0 = H - (r + 1) * layer
      const mid = y0 + layer / 2
      const dir = r % 2 ? 1 : -1
      const off = (dir * phase * (5 + 3 * seeded(r)) + seeded(r + 9) * period) % period
      /* the two liners */
      ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(40,65,149,.55)'
      ctx.beginPath(); ctx.moveTo(0, y0 + 0.5); ctx.lineTo(W, y0 + 0.5); ctx.stroke()
      /* the fluting */
      ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(40,65,149,.42)'
      ctx.beginPath()
      for (let x = -period; x <= W + period; x += 4) {
        const k = pressAt(x, mid)
        const y = mid + Math.sin(((x + off) / period) * Math.PI * 2) * amp * k
        if (x === -period) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.stroke()
      /* inked flutes in this layer */
      ctx.lineWidth = 2.6; ctx.strokeStyle = '#284195'
      for (const b of lit) {
        if (b.row !== r) continue
        const life = (now - b.born) / b.life
        const alpha = Math.sin(Math.min(1, Math.max(0, life)) * Math.PI)
        ctx.globalAlpha = alpha
        ctx.beginPath()
        const start = b.k * period - off
        for (let x = start; x <= start + period; x += 3) {
          const k = pressAt(x, mid)
          const y = mid + Math.sin(((x + off) / period) * Math.PI * 2) * amp * k
          if (x === start) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }
  }
  fit()
  let raf = 0, visible = true
  const loop = (t: number) => {
    const dt = Math.min((t - prev) / 1000, 0.05); prev = t
    draw(t, dt)
    raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0
  }
  if (still) draw(performance.now(), 0); else raf = requestAnimationFrame(loop)
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible && !raf && !still) { prev = performance.now(); raf = requestAnimationFrame(loop) }
  })
  io.observe(canvas)
  const onVis = () => { if (!document.hidden && !raf && visible && !still) { prev = performance.now(); raf = requestAnimationFrame(loop) } }
  document.addEventListener('visibilitychange', onVis)
  const toAmount = gsap.quickTo(pointer, 'amount', { duration: 0.5, ease: 'power2.out' })
  const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; toAmount(1) }
  const onLeave = () => toAmount(0)
  const host = canvas.parentElement
  if (fine && host) { host.addEventListener('pointermove', onMove, { passive: true }); host.addEventListener('pointerleave', onLeave, { passive: true }) }
  let lastW = window.innerWidth, rt = 0
  const onResize = () => {
    if (window.innerWidth <= 767 && window.innerWidth === lastW) return     // phones: ignore URL-bar height changes
    lastW = window.innerWidth
    window.clearTimeout(rt)
    rt = window.setTimeout(() => { fit(); if (still) draw(performance.now(), 0) }, 150)
  }
  window.addEventListener('resize', onResize)
  return () => {
    cancelAnimationFrame(raf); raf = 0; visible = false
    io.disconnect(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', onResize)
    if (host) { host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerleave', onLeave) }
    window.clearTimeout(rt)
  }
}

/* ── 8.10 closing line field: bars from the edges, pinched by the pointer ── */

export function lineField(section: HTMLElement, canvas: HTMLCanvasElement, still = false): () => void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => undefined
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !still
  interface Bar { x: number; len: number; cur: number; hot: boolean }
  let bars: Bar[] = []
  let W = 0, H = 0
  const seeded = (n: number) => { const s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s) }
  const build = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = canvas.clientWidth; H = canvas.clientHeight
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const step = Math.max(14, Math.min(26, W / 56))
    const n = Math.ceil(W / step) + 1
    bars = Array.from({ length: n }, (_, i) => {
      const edge = Math.abs(i - n / 2) / (n / 2)               // 0 centre, 1 edge
      const len = (0.12 + 0.62 * Math.pow(edge, 1.4)) * H * (0.55 + 0.45 * seeded(i + 3))
      return { x: i * step, len, cur: len, hot: seeded(i * 3.7) > 0.86 }
    })
  }
  const pointer = { x: -9999, y: -9999, amount: 0 }
  const R = 150, SQUEEZE = 0.62
  const paint = () => {
    ctx.clearRect(0, 0, W, H)
    ctx.lineWidth = 3; ctx.lineCap = 'butt'
    for (const pass of [false, true]) {
      ctx.strokeStyle = pass ? '#ffffff' : 'rgba(255,255,255,.28)'
      ctx.beginPath()
      for (const b of bars) {
        if (b.hot !== pass) continue
        ctx.moveTo(b.x, 0); ctx.lineTo(b.x, b.cur)
        ctx.moveTo(b.x, H); ctx.lineTo(b.x, H - b.cur)
      }
      ctx.stroke()
    }
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.9)
    g.addColorStop(0, 'rgba(40,65,149,0.94)'); g.addColorStop(1, 'rgba(40,65,149,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  }
  let raf = 0, last = performance.now(), idleSince = 0
  const tick = (t: number) => {
    const dt = Math.min((t - last) / 1000, 0.05); last = t
    const k = 1 - Math.exp(-8 * dt)
    let moving = false
    for (const b of bars) {
      let target = b.len
      const d = Math.abs(b.x - pointer.x)
      if (pointer.amount > 0.001 && d < R) {
        const f = 1 - Math.pow(d / R, 2)
        target = b.len * (1 - SQUEEZE * f * pointer.amount)
      }
      const nx = b.cur + (target - b.cur) * k
      if (Math.abs(nx - b.cur) > 0.05) moving = true
      b.cur = nx
    }
    paint()
    if (moving || pointer.amount > 0.001) { idleSince = 0; raf = requestAnimationFrame(tick) }
    else { raf = 0; idleSince = t }
  }
  const wake = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick) } }
  const toAmount = gsap.quickTo(pointer, 'amount', { duration: 0.4, ease: 'power2.out', onUpdate: wake })
  const onMove = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect()
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top
    toAmount(1); wake()
  }
  const onLeave = () => { toAmount(0); wake() }
  build(); paint()
  if (fine) { section.addEventListener('mousemove', onMove, { passive: true }); section.addEventListener('mouseleave', onLeave, { passive: true }) }
  let lastW = window.innerWidth, rt = 0
  const onResize = () => {
    if (window.innerWidth <= 767 && window.innerWidth === lastW) return
    lastW = window.innerWidth
    window.clearTimeout(rt); rt = window.setTimeout(() => { build(); paint() }, 150)
  }
  window.addEventListener('resize', onResize)
  void idleSince
  return () => {
    cancelAnimationFrame(raf); window.clearTimeout(rt)
    section.removeEventListener('mousemove', onMove); section.removeEventListener('mouseleave', onLeave)
    window.removeEventListener('resize', onResize)
  }
}

/* ── 8.7 the crate drops onto the belt as the heading scrolls up ──────── */

export function cubeDrop(section: HTMLElement): () => void {
  const crate = section.querySelector<SVGGElement>('[data-crate]')
  const guides = q<SVGLineElement>(section, '[data-guide]').map((el) => ({ el, y2: +el.getAttribute('y2')! }))
  if (!crate) return () => undefined
  const ctx = gsap.context(() => {
    const state = { p: 0 }
    const render = () => {
      const lift = CUBE_LIFT * (1 - state.p)
      crate.setAttribute('transform', `translate(0 ${-lift})`)
      guides.forEach((g) => g.el.setAttribute('y1', String(g.y2 - lift)))
    }
    render()
    gsap.to(state, { p: 1, ease: 'power2.in', onUpdate: render, scrollTrigger: { trigger: section, start: 'top bottom', end: 'center 40%', scrub: true } })
  }, section)
  return () => ctx.revert()
}

/* ── 8.5 the pinned production line ───────────────────────────────────── */

export interface StackParts {
  track: HTMLElement
  svg: SVGSVGElement
}

const fmtBox = (b: number[]) => b.map((n) => Math.round(n * 100) / 100).join(' ')

/* One master timeline of N units: half a unit of hold, N-1 legs of one unit, half a unit of hold.
   Camera and product are scrubbed by it. Which machine is lit, which form the product has and which
   sentence is shown are all derived from the same progress, so a reload half way down the page and a
   scroll back up both land in a consistent state. */
export function initStack({ track, svg }: StackParts): () => void {
  const slides = q(track, '[data-slide]')
  const dots = q(track, '[data-dot]')
  const fills = q(track, '[data-fill]')
  const N = slides.length
  const fades = slides.map((sl) => q(sl, '[data-fade]'))
  const forms = q<SVGGElement>(svg, '[data-form]')
  const item = svg.querySelector<SVGGElement>('[data-item]')
  const groups = q<SVGGElement>(svg, '.st')
  if (!item || !forms.length) return () => undefined

  const ctx = gsap.context(() => {
    const splits = slides.map((s) => SplitText.create(q(s, '[data-split]'), { type: 'words', mask: 'words', maskClass: 'sh-mask' }))
    const words = splits.map((sp) => sp.words)
    words.forEach((w) => gsap.set(w, { yPercent: 100 }))
    gsap.set(slides, { autoAlpha: 0 })
    gsap.set(slides[0], { autoAlpha: 1 })
    gsap.set(words[0], { yPercent: 0 })
    fades.forEach((f, i) => gsap.set(f, { autoAlpha: i === 0 ? 1 : 0, y: 0 }))
    gsap.set(fills, { scaleX: 0, autoAlpha: 0, transformOrigin: 'left center' })
    gsap.set(fills[0], { autoAlpha: 1 })
    dots[0]?.classList.add('is-active')

    /* ── the copy ── */
    let active = 0
    let swap: gsap.core.Timeline | null = null
    const show = (i: number, on: boolean) => {
      gsap.killTweensOf([slides[i], words[i], fades[i], dots[i], fills[i]])
      gsap.set(slides[i], { autoAlpha: on ? 1 : 0 })
      gsap.set(words[i], { yPercent: on ? 0 : 100 })
      gsap.set(fades[i], { autoAlpha: on ? 1 : 0, y: 0 })
      gsap.set(dots[i], { width: on ? '2.906em' : '5px' })
      gsap.set(fills[i], { autoAlpha: on ? 1 : 0 })
      dots[i].classList.toggle('is-active', on)
    }
    const goTo = (next: number) => {
      if (next === active) return
      const prev = active
      active = next
      swap?.kill()
      for (let i = 0; i < N; i++) if (i !== next && i !== prev) show(i, false)
      if (Math.abs(next - prev) > 1) { show(prev, false); show(next, true); return }
      gsap.killTweensOf([slides[prev], slides[next], words[prev], words[next], fades[prev], fades[next], dots[prev], dots[next], fills[prev], fills[next]])
      gsap.set(slides[next], { autoAlpha: 1 })
      dots[prev].classList.remove('is-active'); dots[next].classList.add('is-active')
      swap = gsap.timeline({
        onComplete: () => {
          if (active === next) { gsap.set(slides[prev], { autoAlpha: 0 }); gsap.set(words[prev], { yPercent: 100 }); gsap.set(fades[prev], { autoAlpha: 0 }) }
          swap = null
        },
      })
        .to(words[prev], { yPercent: -100, stagger: 0.01, duration: 0.35 }, 0)
        .fromTo(words[next], { yPercent: 100 }, { yPercent: 0, stagger: 0.01, duration: 0.35 }, 0.1)
        .to(fades[prev], { autoAlpha: 0, duration: 0.2 }, 0)
        .fromTo(fades[next], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.18)
        .to(dots[prev], { width: '5px', duration: 0.4 }, 0)
        .to(dots[next], { width: '2.906em', duration: 0.4 }, 0)
        .to(fills[prev], { autoAlpha: 0, duration: 0.3 }, 0)
        .to(fills[next], { autoAlpha: 1, duration: 0.3 }, 0)
    }

    /* ── the drawing ── */
    const proxy = { x: -26 }
    const place = () => {
      const [x, y] = beltPoint(proxy.x)
      item.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`)
    }
    const setState = (lit: number | null, form: number) => {
      groups.forEach((g) => g.setAttribute('data-on', String(Number(g.dataset.i) === lit ? 1 : 0)))
      forms.forEach((f, k) => { f.style.opacity = k === form ? '1' : '0'; f.dataset.on = k === form ? '1' : '0' })
    }

    /* before the pin: the whole line, then in on the first machine, the product arriving and being ground */
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: track, start: 'top bottom', end: 'top top', scrub: true,
        onUpdate: ({ progress }) => setState(progress > 0.85 ? 0 : null, progress > 0.7 ? 1 : 0),
      },
    })
      .fromTo(svg, { attr: { viewBox: fmtBox(overview()) } }, { attr: { viewBox: fmtBox(camera(0)) }, duration: 1 }, 0)
      .fromTo(proxy, { x: -26 }, { x: ITEM_X[0], duration: 0.8, onUpdate: place }, 0)
    setState(null, 0); place()

    const master = gsap.timeline({ defaults: { ease: 'none' } })
    for (let i = 1; i < N; i++) {
      const t0 = 0.5 + (i - 1)
      master
        .fromTo(svg, { attr: { viewBox: fmtBox(camera(i - 1)) } }, { attr: { viewBox: fmtBox(camera(i)) }, duration: 1, immediateRender: false }, t0)
        .fromTo(proxy, { x: ITEM_X[i - 1] }, { x: ITEM_X[i], duration: 1, immediateRender: false, onUpdate: place }, t0)
    }
    master.set({}, {}, N)                                    // pad to N units, the last half unit is a hold

    ScrollTrigger.create({
      trigger: track, start: 'top top', end: 'bottom bottom', scrub: true, animation: master,
      onUpdate: ({ progress }) => {
        const t = progress * N
        const lit = Math.max(0, Math.min(N - 1, Math.floor(t)))
        setState(lit, lit + 1)
        fills.forEach((f, i) => gsap.set(f, { scaleX: i < lit ? 1 : i > lit ? 0 : Math.max(0, Math.min(1, t - i)) }))
        if (lit !== active) goTo(lit)
      },
    })
  }, track)
  return () => ctx.revert()
}
