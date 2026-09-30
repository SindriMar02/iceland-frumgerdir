import { useEffect, useRef, useState } from 'react'
import type { Body as MBody, Constraint as MConstraint } from 'matter-js'
import { Merki } from './ui'

/* "Frá bónda á disk." The line above the stage is Ísfugl's own promise, so the
   plates come down: their dishes, their birds and the four farm medallions drop
   into a stage as round bodies and pile up under real physics (matter-js, loaded
   only when the section comes near). On a fine pointer you can grab one and
   throw it; on touch a tap pops it into the air, because dragging would steal
   the page scroll. Reduced motion: the pile is simulated off-screen and shown
   settled, nothing moves.

   Bodies are drawn as plain <img>s moved with translate3d + rotate each frame,
   so the browser composites them. The engine only steps while the stage is on
   screen. The dish and bird discs are cropped from the recipe pictures and the
   real 2014 shoot (see public/isfugl/d); the medallions are the farm badges. */

type Mynd = { src: string; n: string; m?: boolean }

const MYNDIR: Mynd[] = [
  { src: 'm/reykjabuid', n: 'Reykjabúið', m: true },
  { src: 'd/d-kalkunn', n: 'Heill kalkúnn' },
  { src: 'd/d-tandoori', n: 'Tandoori-kjúklingur' },
  { src: 'm/heidarbaer', n: 'Heiðarbær I', m: true },
  { src: 'd/d-haena', n: 'Hæna' },
  { src: 'd/d-supa', n: 'Kalkúnasúpa' },
  { src: 'd/d-vaengir', n: 'Kalkúnavængir' },
  { src: 'm/hjallakrokur', n: 'Hjallakrókur', m: true },
  { src: 'd/d-kjuklingur', n: 'Appelsínukjúklingur' },
  { src: 'd/d-ungar', n: 'Ungar' },
  { src: 'd/d-borgari', n: 'Kalkúnaborgari' },
  { src: 'm/neslaekur', n: 'Neslækur', m: true },
  { src: 'd/d-fyllt', n: 'Fyllt kalkúnabringa' },
  { src: 'd/d-satay', n: 'Satay-kjúklingur' },
  { src: 'd/d-kalkunar', n: 'Kalkúnar' },
  { src: 'd/d-lasagne', n: 'Kalkúnalasagne' },
  { src: 'd/d-sursaett', n: 'Súrsætur kjúklingur' },
  { src: 'd/d-leggir', n: 'Kjúklingaleggir' },
  { src: 'd/d-vaengir2', n: 'Kjúklingavængir' },
]

export const REGN_CSS = `
.isf-regn{position:relative}
.isf-regnH{padding:0 var(--gut);position:relative;z-index:3;pointer-events:none}
.isf-regnH p{margin:.9rem 0 0;max-width:34ch;opacity:.8}
.isf-svid{position:relative;z-index:1;height:clamp(30rem,82svh,52rem);margin-top:calc(clamp(8rem,22vh,14rem) * -1);
  overflow:hidden;touch-action:pan-y;user-select:none;-webkit-user-select:none}
.isf-svid img{position:absolute;left:0;top:0;will-change:transform;pointer-events:none;
  filter:drop-shadow(0 10px 14px rgba(30,20,16,.28));-webkit-user-drag:none}
@media (max-width:640px){.isf-svid{height:clamp(24rem,64svh,34rem);margin-top:-5rem}}
.isf-svid.grip{cursor:grab}
.isf-svid.grip.held{cursor:grabbing}
.isf-golf{position:absolute;left:var(--gut);right:var(--gut);bottom:0;height:1px;background:var(--c-lina)}
`

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
const fine = () => window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true

export function Diskaregn() {
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
      const u = Math.max(62, Math.min(124, W / (simi ? 5.2 : 11.5)))
      const listi = simi ? MYNDIR.filter((_, i) => i < 13) : MYNDIR

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
        const R = (m.m ? u * 0.74 : u * 0.6) * (0.92 + ((i * 0.37) % 1) * 0.2)
        const x = R + ((i * 0.618) % 1) * (W - 2 * R)
        const y = -R * 2 - i * (u * 0.55) - Math.random() * u
        const b = Bodies.circle(x, y, R * 0.94, {
          restitution: 0.34, friction: 0.5, frictionAir: 0.012, density: 0.0012,
          angle: (Math.random() - 0.5) * 0.9,
        })
        Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.08)
        bodies.push(b)
        const im = document.createElement('img')
        im.src = `${import.meta.env.BASE_URL}isfugl/${m.src}.webp`
        im.alt = ''
        im.decoding = 'async'
        const d = Math.round(R * 2 * (m.m ? 1.16 : 1.06))
        im.width = d; im.height = d
        im.style.width = `${d}px`; im.style.height = `${d}px`
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
    <section className="isf-regn" aria-labelledby="isf-regn-t">
      <div className="isf-regnH">
        <Merki>Diskarnir</Merki>
        <h2 id="isf-regn-t" className="isf-disp">Frá bónda á disk.</h2>
        <p>{fineHint()}</p>
      </div>
      <div className="isf-svid" ref={stage} data-bendill="Gríptu"
        role="img" aria-label="Diskar með réttum úr uppskriftum Ísfugls og verðlaunapeningar bæjanna fjögurra í hrúgu." />
      <div style={{ position: 'relative', height: 0 }}><span className="isf-golf" /></div>
    </section>
  )
}

function fineHint() {
  if (typeof window === 'undefined') return ''
  return fine() ? 'Gríptu disk og kastaðu honum.' : 'Pikkaðu á disk og hann hoppar.'
}
