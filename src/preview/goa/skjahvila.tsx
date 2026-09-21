import { useEffect } from 'react'

/* The screensaver (§4.8 of _docs/noho-teardown.md). After 60s with no input,
   on a fine pointer only, the page hands itself to a full-screen canvas: one
   of Góa's own bags bouncing DVD-logo style on the dark brown. noho recolours
   its chair on every wall hit; Góa's twist is that the bag itself changes, to
   the next pack in the list, so the wall hit shows the range.

   Physics are the reference's: fixed 16.667ms setTimeout step (survives a
   throttled tab), 205px/s start biased away from the axes, x0.86 per bounce
   with a 205 floor, +-0.35rad jitter, a spring while held (k 64, damping
   11.5) with a squash, a throw from a 90ms velocity window clamped 90-520,
   and a slow release within 32px of an edge dismisses it.

   Any other input drops it from full-screen to loose: the page comes back and
   the bag keeps flying over it. Declared deviation 7 (gated harder): never
   while hidden, never before the first scroll, never over an open panel, and
   ?skjahvila=3000 shortens the idle for review. */

const PAKKAR = ['karamellur', 'brak', 'appolo-hjup', 'toffi-sleikjo', 'bangsahlaup', 'bingokulur', 'appolo-pipar-hjup', 'filakulur']
const STEP = 1000 / 60

export const SKJAHVILA_CSS = `
.goa-skja{position:fixed;inset:0;z-index:150;pointer-events:none}
.goa-skja canvas{position:absolute;inset:0;width:100%;height:100%}
.goa-skjaB{position:absolute;inset:0;background:#2D1105;opacity:0;transition:opacity .38s ease-out}
.goa-skja.full .goa-skjaB{opacity:1;pointer-events:auto}
.goa-skjaH{position:absolute;left:0;top:0;pointer-events:auto;cursor:grab}
.goa-skjaH:active{cursor:grabbing}
`

type Sprite = { img: HTMLImageElement; w: number; h: number }

export function Skjahvila() {
  useEffect(() => {
    const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches
    const rm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!fine || rm) return
    const q = Number(new URLSearchParams(location.search).get('skjahvila'))
    const IDLE = q > 0 ? q : 60000
    let armed = false, idleT = 0, stepT = 0, active = false
    let wrap: HTMLDivElement | null = null, cv: HTMLCanvasElement | null = null, hit: HTMLDivElement | null = null
    const sprites: Sprite[] = []
    let si = 0
    let x = 0, y = 0, vx = 0, vy = 0, sc = 1, svel = 0
    let held = false, hx = 0, hy = 0, ox = 0, oy = 0
    const samples: { t: number; x: number; y: number }[] = []

    const blocked = () =>
      document.hidden ||
      !!document.querySelector('.goa-root.goa-laest, .goa-pokiS.on, .goa-pop.opid, .goa-pan.opid')

    const load = () => PAKKAR.forEach((p) => {
      const img = new Image()
      img.src = `${import.meta.env.BASE_URL}goa/${p}.webp`
      img.onload = () => sprites.push({ img, w: img.naturalWidth, h: img.naturalHeight })
    })

    const size = () => {
      const s = sprites[si % sprites.length]
      const h = window.innerHeight * 0.42
      return { w: (s.w / s.h) * h, h }
    }

    const draw = () => {
      if (!cv) return
      const ctx = cv.getContext('2d')!
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      if (cv.width !== innerWidth * dpr) { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      const s = sprites[si % sprites.length]
      const { w, h } = size()
      const sx = Math.min(1.08, Math.max(0.88, sc))
      ctx.save()
      ctx.translate(x + w / 2, y + h / 2)
      ctx.scale(2 - sx, sx)
      ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 18
      ctx.drawImage(s.img, -w / 2, -h / 2, w, h)
      ctx.restore()
      if (hit) { hit.style.width = `${w}px`; hit.style.height = `${h}px`; hit.style.transform = `translate3d(${x}px,${y}px,0)` }
    }

    const tick = () => {
      if (!active) return
      const dt = STEP / 1000
      const { w, h } = size()
      if (held) {
        /* spring the bag's grab point to the pointer */
        const tx = hx - ox, ty = hy - oy
        vx += ((tx - x) * 64 - vx * 11.5) * dt
        vy += ((ty - y) * 64 - vy * 11.5) * dt
        svel += ((0.95 - sc) * 210 - svel * 15) * dt
      } else {
        svel += ((1 - sc) * 210 - svel * 15) * dt
      }
      sc += svel * dt
      x += vx * dt; y += vy * dt
      if (!held) {
        let hitWall = false
        if (x < 0) { x = 0; vx = Math.abs(vx); hitWall = true }
        if (x + w > innerWidth) { x = innerWidth - w; vx = -Math.abs(vx); hitWall = true }
        if (y < 0) { y = 0; vy = Math.abs(vy); hitWall = true }
        if (y + h > innerHeight) { y = innerHeight - h; vy = -Math.abs(vy); hitWall = true }
        if (hitWall) {
          let sp = Math.hypot(vx, vy) * 0.86
          sp = Math.max(205, sp)
          const a = Math.atan2(vy, vx) + (Math.random() - 0.5) * 0.7
          vx = Math.cos(a) * sp; vy = Math.sin(a) * sp
          si = (si + 1) % Math.max(1, sprites.length)
          sc = 0.92
          const n = size()
          x = Math.min(Math.max(0, x), innerWidth - n.w); y = Math.min(Math.max(0, y), innerHeight - n.h)
        }
      }
      draw()
      stepT = window.setTimeout(tick, STEP)
    }

    const start = () => {
      if (active || blocked() || !sprites.length) { rearm(); return }
      active = true
      wrap = document.createElement('div'); wrap.className = 'goa-skja full'
      wrap.innerHTML = '<div class="goa-skjaB"></div><canvas></canvas><div class="goa-skjaH" data-bendill="Gríptu"></div>'
      document.querySelector('.goa-root')?.appendChild(wrap)
      cv = wrap.querySelector('canvas'); hit = wrap.querySelector('.goa-skjaH')
      requestAnimationFrame(() => wrap?.classList.add('full'))
      si = Math.floor(Math.random() * sprites.length)
      const { w, h } = size()
      x = (innerWidth - w) / 2; y = (innerHeight - h) / 2
      let a = Math.random() * Math.PI * 2
      vx = Math.cos(a) * 205; vy = Math.sin(a) * 205
      if (Math.abs(vx) < 60 || Math.abs(vy) < 60) { a = Math.PI / 4 + Math.floor(Math.random() * 4) * (Math.PI / 2); vx = Math.cos(a) * 205; vy = Math.sin(a) * 205 }
      hit?.addEventListener('pointerdown', grab)
      tick()
    }

    const stop = () => {
      active = false; held = false
      window.clearTimeout(stepT)
      hit?.removeEventListener('pointerdown', grab)
      wrap?.remove(); wrap = null; cv = null; hit = null
    }

    const grab = (e: PointerEvent) => {
      e.preventDefault(); e.stopPropagation()
      held = true; hx = e.clientX; hy = e.clientY; ox = hx - x; oy = hy - y
      samples.length = 0
      hit?.setPointerCapture(e.pointerId)
      if (hit) hit.dataset.bendill = 'Sleppa'
      wrap?.classList.remove('full')
    }
    const move = (e: PointerEvent) => {
      if (!held) return
      hx = e.clientX; hy = e.clientY
      samples.push({ t: performance.now(), x: hx, y: hy }); if (samples.length > 16) samples.shift()
    }
    const release = () => {
      if (!held) return
      held = false
      if (hit) hit.dataset.bendill = 'Gríptu'
      const now = performance.now()
      const win = samples.filter((s) => now - s.t <= 90)
      let tvx = 0, tvy = 0
      if (win.length > 1) {
        const a = win[0], b = win[win.length - 1], dt = Math.max(16, b.t - a.t) / 1000
        tvx = ((b.x - a.x) / dt) * 2.4; tvy = ((b.y - a.y) / dt) * 2.4
      }
      const sp = Math.hypot(tvx, tvy)
      const { w, h } = size()
      const nearEdge = x < 32 || y < 32 || innerWidth - (x + w) < 32 || innerHeight - (y + h) < 32
      if (nearEdge && sp <= 160) { stop(); rearm(); return }
      const k = Math.min(520, Math.max(90, sp)) / Math.max(1, sp)
      vx = (sp ? tvx * k : vx); vy = (sp ? tvy * k : vy)
    }

    const rearm = () => {
      window.clearTimeout(idleT)
      if (!armed) return
      idleT = window.setTimeout(start, IDLE)
    }
    const input = (e: Event) => {
      /* Chrome fires a synthetic mousemove under a stationary pointer whenever
         the page beneath it changes, which the overlay itself does. A real
         move has movement; a synthetic one has none. */
      if (e.type === 'mousemove' && !(e as MouseEvent).movementX && !(e as MouseEvent).movementY) return
      if (active && !held && (e.target as HTMLElement)?.closest?.('.goa-skjaH')) return
      if (active) wrap?.classList.remove('full')
      rearm()
    }
    const firstScroll = () => { armed = true; rearm(); window.removeEventListener('scroll', firstScroll) }
    const vis = () => { if (document.hidden) { stop(); window.clearTimeout(idleT) } else rearm() }

    load()
    const EV = ['mousemove', 'mousedown', 'pointerdown', 'keydown', 'wheel', 'touchstart'] as const
    EV.forEach((ev) => window.addEventListener(ev, input, { passive: true, capture: true }))
    window.addEventListener('scroll', firstScroll, { passive: true })
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', release)
    document.addEventListener('visibilitychange', vis)
    if (q > 0) { armed = true; rearm() }
    return () => {
      stop(); window.clearTimeout(idleT)
      EV.forEach((ev) => window.removeEventListener(ev, input, { capture: true }))
      window.removeEventListener('scroll', firstScroll)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', release)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [])
  return null
}
