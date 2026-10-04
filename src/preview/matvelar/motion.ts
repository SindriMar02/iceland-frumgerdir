import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CUBE_LIFT } from './Art'
import { ITEM_X, beltPoint, camera, overview } from './iso'

/* Motion for the Matvélar build: the Deepbook vocabulary, rewritten for this page.
   Parameters come from the teardown's measured catalogue (M1 line reveal, M2 grid
   reveal, M4 divider cubes, M8 odometer counters, 8.5 pinned stack, 8.7 cube drop,
   8.4 streams, 8.10 line field). Smooth-scroll libraries are not used: the page
   scrolls natively on every device. */

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('mvdb', 'M0,0 C0.65,0 0.35,1 1,1')
CustomEase.create('mvsui', 'M0,0 C0.19,1 0.22,1 1,1')
gsap.defaults({ ease: 'mvdb' })
ScrollTrigger.config({ ignoreMobileResize: true })

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const q = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => [...root.querySelectorAll<T>(sel)]
const SIGNAL = '#ffdd00'

/* ── generic reveals, counters and rules ──────────────────────────────── */

export function setupMotion(root: HTMLElement): () => void {
  if (reducedMotion()) {
    root.classList.add('mv-lines-fallback')
    return () => undefined
  }
  let dead = false
  const ctx = gsap.context(() => {
    /* M4 divider cubes: from the centre to the edges, scrub 1.1 */
    q(root, '[data-rule]').forEach((row) => {
      const [a, b] = q(row, '.mv-rule__cube')
      if (!a || !b) return
      const mid = () => (row.offsetWidth - a.offsetWidth) / 2
      const st = () => ({ trigger: row, start: 'top bottom', end: 'top 30%', scrub: 1.1, invalidateOnRefresh: true })
      gsap.fromTo(a, { x: () => mid() }, { x: 0, ease: 'none', scrollTrigger: st() })
      gsap.fromTo(b, { x: () => -mid() }, { x: 0, ease: 'none', scrollTrigger: st() })
    })
  }, root)

  const fallback = window.setTimeout(() => root.classList.add('mv-lines-fallback'), 2600)
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
        gsap.to(split.lines, { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.937, ease: 'mvsui', stagger: 0.08 })
      },
    })
  })
}

/* M2: children rise 24px, .4s, stagger .1, at top bottom-20% */
function gridReveal(root: HTMLElement) {
  q(root, '[data-grid-reveal]').forEach((grid) => {
    const marked = q(grid, '[data-grid-item]')
    const items = marked.length ? marked : ([...grid.children] as HTMLElement[])
    gsap.set(items, { opacity: 0, y: 24 })
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.4, stagger: 0.1,
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

/* ── 8.4 hero streams: lanes of dashes pouring toward the line ────────── */

const DW = 1440, DH = 842
const strokeAt = (w: number) => (w <= 375 ? 2.5 : w >= 2560 ? 6.5 : w <= 1440 ? 2.5 + 1.25 * ((w - 375) / 1065) : 3.75 + 2.75 * ((w - 1440) / 1120))

export function heroStreams(canvas: HTMLCanvasElement, still = false): () => void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => undefined
  const LANES = 30, N = 118, STEP = 4, TICKS = Math.floor(N / STEP)
  const lanes: { x: Float32Array; y: Float32Array; off: number }[] = []
  for (let i = 0; i < LANES; i++) {
    const u = i / (LANES - 1)
    const xt = -140 + u * (DW + 280)
    const xb = DW / 2 + (xt - DW / 2) * 0.2
    const x = new Float32Array(N), y = new Float32Array(N)
    for (let k = 0; k < N; k++) {
      const t = k / (N - 1)
      y[k] = -70 + t * (DH + 140)
      x[k] = xt + (xb - xt) * Math.pow(t, 1.7) + Math.sin(t * Math.PI * 2 + i * 0.9) * 5
    }
    lanes.push({ x, y, off: (i * 7) % STEP })
  }
  let W = 0, H = 0, scale = 1, ox = 0, oy = 0, dash = 20, width = 3
  const fit = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = canvas.clientWidth; H = canvas.clientHeight
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    scale = Math.max(W / DW, H / DH)
    ox = (W - DW * scale) / 2; oy = (H - DH * scale) / 2
    dash = 26 * scale; width = strokeAt(W)
  }
  const SPEED = 5.2          // samples per second
  const LIT = 9, LIFE = 1.3
  let phase = 0, prev = performance.now()
  let lit: { l: number; k: number; born: number; life: number }[] = []
  const spawn = (now: number) => {
    for (let tries = 0; tries < 30; tries++) {
      const l = Math.floor(Math.random() * LANES), k = Math.floor(Math.random() * TICKS)
      if (lit.some((b) => b.l === l && b.k === k)) continue
      lit.push({ l, k, born: now, life: LIFE * (0.7 + 0.6 * Math.random()) })
      return
    }
  }
  const at = (l: number, pos: number): [number, number, number, number] | null => {
    const ln = lanes[l]
    const s = ((pos % N) + N) % N
    const i = Math.floor(s)
    if (i >= N - 1) return null
    const f = s - i
    const px = ln.x[i] + (ln.x[i + 1] - ln.x[i]) * f, py = ln.y[i] + (ln.y[i + 1] - ln.y[i]) * f
    const tx = ln.x[i + 1] - ln.x[i], ty = ln.y[i + 1] - ln.y[i]
    const m = Math.hypot(tx, ty) || 1
    return [px * scale + ox, py * scale + oy, tx / m, ty / m]
  }
  const draw = (now: number, t: number) => {
    phase += SPEED * Math.min((t - prev) / 1000, 0.05); prev = t
    lit = lit.filter((b) => now - b.born < b.life)
    while (lit.length < LIT) spawn(now)
    const taken = new Set(lit.map((b) => `${b.l}:${b.k}`))
    const half = dash / 2
    ctx.clearRect(0, 0, W, H)
    /* a faint steel haze where the lanes meet: the page is never a bare black field behind the headline */
    const haze = ctx.createRadialGradient(W / 2, H * 0.6, 0, W / 2, H * 0.6, Math.max(W, H) * 0.6)
    haze.addColorStop(0, 'rgb(40,56,72)'); haze.addColorStop(1, 'rgb(0,0,0)')
    ctx.fillStyle = haze; ctx.fillRect(0, 0, W, H)
    ctx.lineWidth = width; ctx.lineCap = 'butt'
    ctx.strokeStyle = '#6a7681'; ctx.beginPath()
    for (let l = 0; l < LANES; l++) {
      for (let k = 0; k < TICKS; k++) {
        if (taken.has(`${l}:${k}`)) continue
        const p = at(l, phase + k * STEP + lanes[l].off)
        if (!p || p[0] < -half || p[0] > W + half || p[1] < -half || p[1] > H + half) continue
        ctx.moveTo(p[0] - p[2] * half, p[1] - p[3] * half); ctx.lineTo(p[0] + p[2] * half, p[1] + p[3] * half)
      }
    }
    ctx.stroke()
    ctx.strokeStyle = SIGNAL; ctx.beginPath()
    lit.forEach((b) => {
      const p = at(b.l, phase + b.k * STEP + lanes[b.l].off)
      if (!p) return
      ctx.moveTo(p[0] - p[2] * half, p[1] - p[3] * half); ctx.lineTo(p[0] + p[2] * half, p[1] + p[3] * half)
    })
    ctx.stroke()
  }
  fit()
  let raf = 0, visible = true
  const loop = (t: number) => { draw(t / 1000, t); raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0 }
  if (still) { draw(0, performance.now()); } else raf = requestAnimationFrame(loop)
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible && !raf && !still) { prev = performance.now(); raf = requestAnimationFrame(loop) }
  })
  io.observe(canvas)
  const onVis = () => { if (!document.hidden && !raf && visible && !still) { prev = performance.now(); raf = requestAnimationFrame(loop) } }
  document.addEventListener('visibilitychange', onVis)
  let lastW = window.innerWidth, rt = 0
  const onResize = () => {
    if (window.innerWidth <= 767 && window.innerWidth === lastW) return     // phones: ignore URL-bar height changes
    lastW = window.innerWidth
    window.clearTimeout(rt)
    rt = window.setTimeout(() => { fit(); if (still) draw(0, performance.now()) }, 150)
  }
  window.addEventListener('resize', onResize)
  return () => {
    cancelAnimationFrame(raf); raf = 0; visible = false
    io.disconnect(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', onResize)
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
      ctx.strokeStyle = pass ? SIGNAL : '#576a7c'
      ctx.beginPath()
      for (const b of bars) {
        if (b.hot !== pass) continue
        ctx.moveTo(b.x, 0); ctx.lineTo(b.x, b.cur)
        ctx.moveTo(b.x, H); ctx.lineTo(b.x, H - b.cur)
      }
      ctx.stroke()
    }
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.9)
    g.addColorStop(0, 'rgba(0,0,0,0.9)'); g.addColorStop(1, 'rgba(0,0,0,0)')
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
    const splits = slides.map((s) => SplitText.create(q(s, '[data-split]'), { type: 'words', mask: 'words', maskClass: 'mv-mask' }))
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
