import { useEffect, useRef, useState } from 'react'
import type { Body as MBody, Constraint as MConstraint } from 'matter-js'
import { Merki } from './ui'

/* "…og allt hitt í pokanum." The sentence above ends on the bag, so the bag
   gets emptied: Góa's own pack shots drop into a stage and pile up under real
   physics (matter-js, loaded only when the section comes near). On a fine
   pointer you can grab one and throw it; on touch a tap pops it into the air,
   because dragging would steal the page scroll. Reduced motion: the pile is
   simulated off-screen and shown settled, nothing moves.

   Bodies are drawn as plain <img>s moved with translate3d + rotate each
   frame, so the browser composites them and no canvas repaints the packs.
   The engine only steps while the stage is on screen. */

type Mynd = { src: string; w: number; h: number; n: string; k: 'poki' | 'stong' | 'kassi' | 'egg' }

const MYNDIR: Mynd[] = [
  { src: 'karamellur', w: 603, h: 900, n: 'Karamellur', k: 'poki' },
  { src: 'hraun', w: 900, h: 257, n: 'Hraun', k: 'stong' },
  { src: 'brak', w: 558, h: 900, n: 'Brak', k: 'poki' },
  { src: 'lindu-mjolkursukkuladi', w: 900, h: 400, n: 'Lindu mjólkursúkkulaði', k: 'stong' },
  { src: 'appolo-hjup', w: 588, h: 900, n: 'Appolo Hjúp', k: 'poki' },
  { src: 'floridabitar', w: 900, h: 728, n: 'Floridabitar', k: 'kassi' },
  { src: 'bangsahlaup', w: 683, h: 900, n: 'Bangsahlaup', k: 'poki' },
  { src: 'risahraun', w: 900, h: 249, n: 'Risahraun', k: 'stong' },
  { src: 'toffi-sleikjo', w: 858, h: 900, n: 'Toffí sleikjó', k: 'poki' },
  { src: 'paskaegg-5', w: 352, h: 900, n: 'Páskaegg nr. 5', k: 'egg' },
  { src: 'bingokulur', w: 575, h: 900, n: 'Bingókúlur', k: 'poki' },
  { src: 'lindor', w: 900, h: 397, n: 'Lindor', k: 'stong' },
  { src: 'lava-marshmallow', w: 780, h: 900, n: 'Lava marshmallow', k: 'kassi' },
  { src: 'appolo-pipar-hjup', w: 603, h: 900, n: 'Appolo piparfylltur Hjúp', k: 'poki' },
  { src: 'lava', w: 900, h: 275, n: 'Lava', k: 'stong' },
  { src: 'filakulur', w: 900, h: 818, n: 'Fílakúlur', k: 'poki' },
  { src: 'appolo-fylltar-reimar', w: 900, h: 317, n: 'Appolo fylltar reimar', k: 'stong' },
  { src: 'appolo-kurl', w: 639, h: 900, n: 'Appolo kurl', k: 'poki' },
  { src: 'lindu-sudusukkuladi', w: 900, h: 427, n: 'Lindu suðusúkkulaði', k: 'stong' },
  { src: 'paskaegg-hraun-5', w: 352, h: 900, n: 'Hraunegg nr. 5', k: 'egg' },
  { src: 'lindu-appelsinu-100', w: 900, h: 354, n: 'Lindu appelsínusúkkulaði', k: 'stong' },
]

export const REGN_CSS = `
.goa-regn{position:relative;padding:var(--band) 0 0}
.goa-regnH{padding:0 var(--gut);position:relative;z-index:3;pointer-events:none}
.goa-regnH p{margin:.9rem 0 0;max-width:34ch;opacity:.8}
.goa-svid{position:relative;z-index:1;height:clamp(30rem,82svh,52rem);margin-top:calc(clamp(8rem,22vh,14rem) * -1);
  overflow:hidden;touch-action:pan-y;user-select:none;-webkit-user-select:none}
.goa-svid img{position:absolute;left:0;top:0;will-change:transform;pointer-events:none;
  filter:drop-shadow(0 10px 14px rgba(28,18,12,.22));-webkit-user-drag:none}
@media (max-width:640px){.goa-svid{height:clamp(24rem,64svh,34rem);margin-top:-5rem}}
.goa-svid.grip{cursor:grab}
.goa-svid.grip.held{cursor:grabbing}
.goa-golf{position:absolute;left:var(--gut);right:var(--gut);bottom:0;height:1px;background:var(--c-lina)}
`

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
const fine = () => window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true

export function Nammiregn() {
  const stage = useRef<HTMLDivElement | null>(null)
  const [virkt, setVirkt] = useState(false)

  /* wake when the stage is one screen away; drop when it is actually in view */
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
      /* matter-js is CommonJS; depending on the bundler the API sits on default */
      const M = ((mod as unknown as { default?: typeof mod }).default ?? mod) as typeof mod
      const { Engine, Bodies, Composite, Body, Sleeping } = M
      const W = el.clientWidth
      const H = el.clientHeight
      const simi = W < 640
      const u = Math.max(58, Math.min(118, W / (simi ? 5.6 : 12.5)))
      const listi = simi ? MYNDIR.slice(0, 13) : MYNDIR

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
        const langt = m.k === 'stong'
        const bw = langt ? u * 1.55 : m.k === 'egg' ? u * 0.62 : (m.w / m.h) * u * 1.3
        const bh = langt ? bw * (m.h / m.w) : m.k === 'egg' ? bw * (m.h / m.w) : u * 1.3
        const x = bw / 2 + ((i * 0.618) % 1) * (W - bw)
        const y = -bh - i * (u * 0.55) - Math.random() * u
        const b = Bodies.rectangle(x, y, bw, bh, {
          chamfer: { radius: Math.min(bw, bh) * 0.12 },
          restitution: m.k === 'stong' ? 0.18 : 0.28,
          friction: 0.6, frictionAir: 0.012, density: 0.0012,
          angle: (Math.random() - 0.5) * 0.9,
        })
        Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.08)
        bodies.push(b)
        const im = document.createElement('img')
        im.src = `${import.meta.env.BASE_URL}goa/${m.src}.webp`
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
        for (let s = 0; s < 600; s++) Engine.update(engine, 1000 / 60)
        draw()
        cleanup = () => { imgs.forEach((im) => im.remove()); Engine.clear(engine) }
        return
      }

      /* drop in one at a time once the stage is properly on screen */
      let slept = 0
      let synilegt = false
      let dropped = 0
      let dropTimer = 0
      const dropNext = () => {
        if (dropped >= bodies.length) return
        Composite.add(engine.world, bodies[dropped])
        dropped++
        dropTimer = window.setTimeout(dropNext, simi ? 110 : 85)
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
        /* park the loop once everything that has dropped is asleep */
        const allir = dropped === bodies.length && bodies.every((b) => b.isSleeping)
        slept = allir ? slept + 1 : 0
        raf = synilegt && slept < 30 ? requestAnimationFrame(tick) : 0
      }
      const wake = () => { if (!raf && synilegt) { last = performance.now(); raf = requestAnimationFrame(tick) } }

      /* Drag is our own pointer handling on a spring constraint, not Matter's
         MouseConstraint: Matter's mouse maps page coordinates against the
         document scroll and was ~950px off on this page (a grab picked up a
         pack far above the pointer and flung it off-stage). Reading the stage's
         own rect on every event cannot drift. It also leaves the wheel alone. */
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
          /* hold the pack where it was grabbed, in the pack's own frame */
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
        /* touch: tap a pack and it pops */
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
    <section className="goa-regn" aria-labelledby="goa-regn-t">
      <div className="goa-regnH">
        <Merki>Pokinn</Merki>
        <h2 id="goa-regn-t" className="goa-disp">Hellt úr pokanum.</h2>
        <p>{fineHint()}</p>
      </div>
      <div className="goa-svid" ref={stage} data-bendill="Gríptu"
        role="img" aria-label="Vörur Góu, Lindu og Appolo í hrúgu: karamellur, Hraun, Brak, Appolo lakkrís, Lindu súkkulaði og páskaegg." />
      <div style={{ position: 'relative', height: 0 }}><span className="goa-golf" /></div>
    </section>
  )
}

function fineHint() {
  if (typeof window === 'undefined') return ''
  return fine() ? 'Gríptu vöru og kastaðu henni.' : 'Pikkaðu á vöru og hún hoppar.'
}
