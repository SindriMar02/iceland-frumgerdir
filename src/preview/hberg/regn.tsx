import { useEffect, useRef, useState } from 'react'
import type { Body as MBody, Constraint as MConstraint } from 'matter-js'
import { Merki } from './ui'
import { ASSETS } from './assets.gen'
import { BASE, PK, PRODUCTS } from './vorur'



type Mynd = { src: string; w: number; h: number; n: string; k: 'poki' | 'stong' | 'kassi' | 'egg' | 'laus' }

// Lausar hnetur og ávextir: 40 stakir bitar (loose/ í hberg-build), dreift á milli pokanna.
const LAUSIR: Mynd[] = Array.from({ length: 40 }, (_, i) => ({ src: `${BASE}hberg/laus/p${String(i).padStart(2, '0')}.webp`, w: 1, h: 1, n: '', k: 'laus' as const }))
const blanda = (pokar: Mynd[], nPoka: number, nLausra: number) => {
  const ut: Mynd[] = []
  const p = pokar.slice(0, nPoka)
  for (let i = 0; i < nLausra; i++) {
    if (p.length && i % Math.ceil(nLausra / p.length) === 0) ut.push(p.shift()!)
    ut.push(LAUSIR[(i * 7) % LAUSIR.length])
  }
  return ut.concat(p)
}


const RODUN = ['mondlur', 'heslihnetur-med-sukkuladi-afrit', 'graskersfrae-2', 'kajuhnetur-heilarristadar', 'aprikosur-2', 'dodlur-2', 'hnetusmjor', 'tronuber-2', 'valhnetukjarnar',
  'fikjur-2', 'kasjusmjor', 'kasjusmjor-2', 'pistasiur']
const MYNDIR: Mynd[] = PRODUCTS.filter((p) => ASSETS[p.slug]?.pack && ['hnetur','avextir'].some(t=>p.tags.includes(t)))
  .sort((a, b) => { const x = RODUN.indexOf(a.slug), y = RODUN.indexOf(b.slug); return (x < 0 ? 99 : x) - (y < 0 ? 99 : y) })
  .map((p) => { const [w, h] = ASSETS[p.slug].pack!; return { src: p.slug, w, h, n: p.name.is, k: w / h > 1.8 ? 'stong' : 'poki' } })

export const REGN_CSS = `
.hb-regn{position:relative}
.hb-regnH{padding:0 var(--gut);position:relative;z-index:3;pointer-events:none}
.hb-regnH p{margin:.9rem 0 0;max-width:34ch;opacity:.8}
.hb-svid{position:relative;z-index:1;height:clamp(30rem,82svh,52rem);margin-top:calc(clamp(8rem,22vh,14rem) * -1);
  overflow:hidden;touch-action:pan-y;user-select:none;-webkit-user-select:none}
.hb-svid img{position:absolute;left:0;top:0;will-change:transform;pointer-events:none;
  filter:drop-shadow(0 10px 14px rgba(28,18,12,.22));-webkit-user-drag:none}
@media (max-width:640px){.hb-svid{height:clamp(24rem,64svh,34rem);margin-top:-5rem}}
.hb-svid img.laus{filter:drop-shadow(0 3px 3px rgba(28,18,12,.22))}
.hb-svid.grip{cursor:grab}
.hb-svid.grip.held{cursor:grabbing}
.hb-golf{position:absolute;left:var(--gut);right:var(--gut);bottom:0;height:1px;background:var(--c-lina)}
`

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
const fine = () => window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true

export function VoruRegn() {
  const stage = useRef<HTMLDivElement | null>(null)
  const [virkt, setVirkt] = useState(false)

  
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVirkt(true); io.disconnect() } },
      { rootMargin: '100% 0px 100% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!virkt) return
    const el = stage.current
    if (!el) return
    let lifandi = true
    let raf = 0
    let cleanup = () => {}
    void import('matter-js').then((mod) => {
      if (!lifandi || !stage.current) return
      
      const M = ((mod as unknown as { default?: typeof mod }).default ?? mod) as typeof mod
      const { Engine, Bodies, Composite, Body, Sleeping } = M
      const W = el.clientWidth
      const H = el.clientHeight
      const simi = W < 640
      const u = Math.max(58, Math.min(118, W / (simi ? 5.6 : 12.5)))
      const listi = simi ? blanda(MYNDIR, 4, 46) : blanda(MYNDIR, 7, 96)

      const engine = Engine.create({ enableSleeping: true })
      engine.gravity.y = 1.15
      const t = 200
      Composite.add(engine.world, [
        Bodies.rectangle(W / 2, H + t / 2, W * 3, t, { isStatic: true, friction: 0.9 }),
        Bodies.rectangle(-t / 2, H / 2 - H, t, H * 4, { isStatic: true }),
        Bodies.rectangle(W + t / 2, H / 2 - H, t, H * 4, { isStatic: true }),
      ])

      const imgs: HTMLImageElement[] = []
      const bodies: MBody[] = []
      listi.forEach((m, i) => {
        const laus = m.k === 'laus'
        const langt = m.k === 'stong'
        const bw = laus ? u * 0.42 : langt ? u * 1.55 : m.k === 'egg' ? u * 0.62 : (m.w / m.h) * u * 1.3
        const bh = laus ? bw : langt ? bw * (m.h / m.w) : m.k === 'egg' ? bw * (m.h / m.w) : u * 1.3
        const x = laus ? W * (0.3 + 0.4 * Math.random()) : bw / 2 + ((i * 0.618) % 1) * (W - bw)
        const y = -bh - i * (u * (laus ? 0.22 : 0.55)) - Math.random() * u
        const b = laus
          ? Bodies.circle(x, y, bw * 0.4, { restitution: 0.32, friction: 0.4, frictionAir: 0.01, density: 0.0016, angle: Math.random() * 6.28 })
          : Bodies.rectangle(x, y, bw, bh, {
            chamfer: { radius: Math.min(bw, bh) * 0.12 },
            restitution: m.k === 'stong' ? 0.18 : 0.28,
            friction: 0.6, frictionAir: 0.012, density: 0.0012,
            angle: (Math.random() - 0.5) * 0.9,
          })
        Body.setAngularVelocity(b, (Math.random() - 0.5) * (laus ? 0.2 : 0.08))
        bodies.push(b)
        const im = document.createElement('img')
        im.src = laus ? m.src : PK(m.src, 'pack', 's')
        if (laus) im.className = 'laus'
        im.alt = ''
        im.decoding = 'async'
        im.width = Math.round(bw); im.height = Math.round(bh)
        im.style.width = `${bw}px`; im.style.height = `${bh}px`
        im.style.transform = `translate3d(-999px,-999px,0)`
        el.appendChild(im)
        imgs.push(im)
      })

      const draw = () => {
        for (let i = 0; i < bodies.length; i++) {
          const b = bodies[i], im = imgs[i]
          im.style.transform = `translate3d(${(b.position.x - im.width / 2).toFixed(1)}px,${(b.position.y - im.height / 2).toFixed(1)}px,0) rotate(${b.angle.toFixed(3)}rad)`
        }
      }

      if (reduced()) {
        Composite.add(engine.world, bodies)
        for (let s = 0; s < 1400; s++) Engine.update(engine, 1000 / 60)
        draw()
        cleanup = () => { imgs.forEach((im) => im.remove()); Engine.clear(engine) }
        return
      }

      
      let slept = 0
      let synilegt = false
      let dropped = 0
      let dropTimer = 0
      const dropNext = () => {
        if (dropped >= bodies.length) return
        Composite.add(engine.world, bodies[dropped])
        dropped++
        dropTimer = window.setTimeout(dropNext, listi[dropped]?.k === 'laus' ? (simi ? 34 : 26) : (simi ? 110 : 85))
      }
      const vio = new IntersectionObserver(([e]) => {
        synilegt = e.isIntersecting
        if (synilegt && dropped === 0) dropNext()
        if (synilegt && !raf) raf = requestAnimationFrame(tick)
      }, { threshold: 0.35 })
      vio.observe(el)

      let last = performance.now()
      const tick = (now: number) => {
        const dt = Math.min(32, now - last); last = now
        Engine.update(engine, dt)
        draw()
        
        const allir = dropped === bodies.length && bodies.every((b) => b.isSleeping)
        slept = allir ? slept + 1 : 0
        raf = synilegt && slept < 30 ? requestAnimationFrame(tick) : 0
      }
      const wake = () => { if (!raf && synilegt) { last = performance.now(); raf = requestAnimationFrame(tick) } }

      
      const lokal = (e: PointerEvent) => { const r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
      const offs: (() => void)[] = []
      if (fine()) {
        el.classList.add('grip')
        let tak: MConstraint | null = null
        const nidur = (e: PointerEvent) => {
          const p = lokal(e)
          const hit = M.Query.point(bodies, p)[0]
          if (!hit) return
          e.preventDefault()
          el.setPointerCapture(e.pointerId)
          Sleeping.set(hit, false)
          
          const dx = p.x - hit.position.x, dy = p.y - hit.position.y
          const c = Math.cos(-hit.angle), s2 = Math.sin(-hit.angle)
          tak = M.Constraint.create({ pointA: p, bodyB: hit, pointB: { x: dx * c - dy * s2, y: dx * s2 + dy * c },
            stiffness: 0.12, damping: 0.08, length: 0 })
          Composite.add(engine.world, tak)
          el.classList.add('held')
          wake()
        }
        const hreyfa = (e: PointerEvent) => { if (tak) { tak.pointA = lokal(e); wake() } }
        const upp = () => { if (tak) { Composite.remove(engine.world, tak); tak = null; el.classList.remove('held') } }
        el.addEventListener('pointerdown', nidur)
        el.addEventListener('pointermove', hreyfa)
        el.addEventListener('pointerup', upp)
        el.addEventListener('pointercancel', upp)
        offs.push(() => {
          el.removeEventListener('pointerdown', nidur); el.removeEventListener('pointermove', hreyfa)
          el.removeEventListener('pointerup', upp); el.removeEventListener('pointercancel', upp)
        })
      } else {
        
        const tap = (e: PointerEvent) => {
          const hit = M.Query.point(bodies, lokal(e))[0]
          if (!hit) return
          Sleeping.set(hit, false)
          Body.setVelocity(hit, { x: (Math.random() - 0.5) * 6, y: -14 })
          Body.setAngularVelocity(hit, (Math.random() - 0.5) * 0.3)
          wake()
        }
        el.addEventListener('pointerup', tap)
        offs.push(() => el.removeEventListener('pointerup', tap))
      }

      cleanup = () => {
        vio.disconnect()
        window.clearTimeout(dropTimer)
        cancelAnimationFrame(raf)
        offs.forEach((f) => f())
        imgs.forEach((im) => im.remove())
        Engine.clear(engine)
      }
    })
    return () => { lifandi = false; cleanup() }
  }, [virkt])

  return (
    <section className="hb-regn" aria-labelledby="hb-regn-t">
      <div className="hb-regnH">
        <Merki>Pokinn</Merki>
        <h2 id="hb-regn-t" className="hb-disp">Hellt úr pokanum.</h2>
        <p>{fineHint()}</p>
      </div>
      <div className="hb-svid" ref={stage} data-bendill="Gríptu"
        role="img" aria-label="Pokar frá H-Berg og lausar hnetur og þurrkaðir ávextir í hrúgu." />
      <div style={{ position: 'relative', height: 0 }}><span className="hb-golf" /></div>
    </section>
  )
}

function fineHint() {
  if (typeof window === 'undefined') return ''
  return fine() ? 'Gríptu vöru og kastaðu henni.' : 'Pikkaðu á vöru og hún hoppar.'
}
