import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { motion, useReducedMotion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowDown, ArrowRight, Dumbbell, FlaskConical, Heart, Leaf, Plus, Zap } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'

const company = getPreviewCompany('weider')

/* ───────────────────────── brand system ─────────────────────────
   ink #08080a · carbon #101013 · steel #1b1c20
   Weider red #e11d48 (fills/large) · red-light #ff5470 (small text on dark, AA)
   Display: Anton (font-poster) treated kinetic. Spec voice: Space Mono (font-mono).
   Scroll-linked motion uses a manual synchronous scroll handler (not Framer
   useScroll) so it is deterministic and not tied to a throttled rAF loop. */
const RED = '#e11d48'
const REDL = '#ff5470'

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n))

/** Passive scroll subscription that fires synchronously (verifiable, untied to rAF). */
function useScrollSync(fn: () => void) {
  const ref = useRef(fn)
  ref.current = fn
  useEffect(() => {
    const handler = () => ref.current()
    handler()
    // re-measure once webfonts (Anton) land so first-frame track width is exact
    document.fonts?.ready.then(handler).catch(() => {})
    window.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
    }
  }, [])
}

/* ───────────────────────── data (verified) ───────────────────── */

const CATS: { no: string; is: string; en: string; blurb: string; spec: string; price: string; img: string; alt: string }[] = [
  { no: '01', is: 'Kreatín', en: 'Creatine', blurb: 'Sprengikraftur, styrkur og ending. Mest rannsakaða fæðubótarefnið.', spec: 'KRAFTUR / STYRKUR', price: 'frá 2.890 kr.', img: 'https://images.unsplash.com/photo-1693996045463-6ea86d10a2e7?q=80&w=1600&auto=format&fit=crop', alt: 'Fine white creatine powder in a measuring scoop on a dark surface' },
  { no: '02', is: 'Prótein', en: 'Protein', blurb: 'Uppbygging og endurheimt vöðva. Mysuprótein, jurtaprótein og massablöndur.', spec: 'UPPBYGGING', price: 'frá 3.990 kr.', img: 'https://images.unsplash.com/photo-1693996046865-19217d179161?q=80&w=1600&auto=format&fit=crop', alt: 'A scoop of chocolate protein powder spilling onto a clean surface' },
  { no: '03', is: 'Pre-workout', en: 'Fyrir æfingu', blurb: 'Orka og fókus fyrir átökin. Hannað til neyslu rétt fyrir æfingu.', spec: 'ORKA / FÓKUS', price: 'frá 3.990 kr.', img: 'https://images.unsplash.com/photo-1516481265257-97e5f4bc50d5?q=80&w=1600&auto=format&fit=crop', alt: 'An athlete loading heavy plates onto a barbell before training' },
  { no: '04', is: 'Amínósýrur', en: 'Amino acids', blurb: 'EAA, BCAA og glútamín sem styðja við endurheimt og uppbyggingu.', spec: 'ENDURHEIMT', price: 'frá 3.790 kr.', img: 'https://images.unsplash.com/photo-1600679472233-eabc13b79f07?q=80&w=1600&auto=format&fit=crop', alt: 'An athlete drinking from a sports bottle outdoors after exercise' },
  { no: '05', is: 'Vítamín', en: 'Vitamins', blurb: 'Vítamín, steinefni og omega 3. Grunnurinn að daglegri heilsu.', spec: 'DAGLEG HEILSA', price: 'frá 2.290 kr.', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop', alt: 'A person stretching calmly at golden hour, everyday wellbeing' },
  { no: '06', is: 'Snarl & drykkir', en: 'Snacks & drinks', blurb: 'Próteinstykki, drykkir og snarl. Næring á ferðinni.', spec: 'Á FERÐINNI', price: 'frá 249 kr.', img: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1600&auto=format&fit=crop', alt: 'A person preparing a protein shake in a bright kitchen' },
]

interface Product {
  no: string
  name: string
  cat: string
  icon: LucideIcon
  spec: string
  price: string
  rating: string
  swatch: string
}

const PRODUCTS: Product[] = [
  { no: '01', name: 'Premium Whey', cat: 'Prótein', icon: Dumbbell, spec: 'Mysuprótein · uppbygging', price: 'frá 3.990 kr.', rating: '4,9', swatch: RED },
  { no: '02', name: 'Pure Creatine', cat: 'Kreatín', icon: FlaskConical, spec: 'Einhýdrat · styrkur', price: 'frá 2.890 kr.', rating: '4,8', swatch: '#3a3a42' },
  { no: '03', name: 'Total Rush 2.0', cat: 'Pre-workout', icon: Zap, spec: 'Orka · fókus', price: '3.990 kr.', rating: '4,7', swatch: '#b5481f' },
  { no: '04', name: 'Premium EAA', cat: 'Amínósýrur', icon: Leaf, spec: 'Lífsnauðsynlegar amínósýrur', price: '3.790 kr.', rating: '4,8', swatch: '#1f93b0' },
  { no: '05', name: 'Multi Vítamín Gúmmí', cat: 'Vítamín', icon: Heart, spec: 'Dagleg vítamín · góðgæti', price: '2.290 kr.', rating: '4,7', swatch: '#e0a43a' },
  { no: '06', name: 'Omega 3 Superior', cat: 'Vítamín', icon: Heart, spec: 'Fiskolía · hjarta & heili', price: '2.990 kr.', rating: '4,8', swatch: '#2b6f8f' },
]

const PROTOCOLS: { goal: string; icon: LucideIcon; line: string; stack: string[] }[] = [
  { goal: 'Byggja vöðva', icon: Dumbbell, line: 'Prótein fyrir uppbyggingu, kreatín fyrir kraft.', stack: ['Premium Whey', 'Pure Creatine'] },
  { goal: 'Meiri orka', icon: Zap, line: 'Orka og fókus fyrir erfiðustu æfingarnar.', stack: ['Total Rush 2.0'] },
  { goal: 'Betri endurheimt', icon: Leaf, line: 'Amínósýrur sem styðja við endurheimt.', stack: ['Premium EAA'] },
  { goal: 'Dagleg heilsa', icon: Heart, line: 'Grunnbætiefni sem styðja við daglega heilsu.', stack: ['Multi Vítamín Gúmmí', 'Omega 3 Superior'] },
]

const STATS: { to: number; suffix: string; label: string }[] = [
  { to: 90, suffix: ' ár', label: 'í íþróttanæringu' },
  { to: 120, suffix: '+', label: 'lönd um allan heim' },
  { to: 100, suffix: '%', label: 'ekta Weider vörur' },
]

const REVIEWS = [
  { text: 'Pantaði á mánudegi, fékk sent á miðvikudegi. Premium Whey er það besta sem ég hef prófað.', who: 'Andri G. — Reykjavík' },
  { text: 'Loksins íslensk vefverslun með Weider. Kreatínið virkar og verðið er sanngjarnt.', who: 'Sara D. — Akureyri' },
  { text: 'Hröð afhending og frábær þjónusta. Mæli með gúmmívítamínunum fyrir alla fjölskylduna.', who: 'Kristján B. — Hafnarfjörður' },
]

const SECTIONS = ['hetja', 'jatning', 'loadout', 'vorur', 'protocol', 'saga', 'lokun']
const SECTION_LABELS: Record<string, string> = {
  hetja: 'Kveikjan',
  jatning: 'Yfirlýsing',
  loadout: 'Úrvalið',
  vorur: 'Mest selt',
  protocol: 'Markmið',
  saga: 'Sagan',
  lokun: 'Versla',
}

/* ───────────────────────── wordmark ───────────────────────────── */
function WeiderMark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-poster leading-none tracking-[0.01em] ${className}`} aria-label="Weider">
      <span aria-hidden="true">
        WEIDER<sup className="ml-[0.06em] align-super text-[0.4em] tracking-normal">®</sup>
      </span>
    </span>
  )
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-48% 0px -48% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

/* ───────────────────────── nav ────────────────────────────────── */
function Nav() {
  const active = useActiveSection(SECTIONS)
  const [past, setPast] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const pastRef = useRef(false)

  useScrollSync(() => {
    const doc = document.documentElement
    const p = clamp(doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1))
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
    const next = window.scrollY > window.innerHeight * 0.7
    if (next !== pastRef.current) {
      pastRef.current = next
      setPast(next)
    }
  })

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div ref={barRef} className="h-[2px] origin-left" style={{ transform: 'scaleX(0)', background: RED }} aria-hidden="true" />
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-10 md:py-6">
        <a href="#hetja" className="pointer-events-auto" aria-label="Weider — efst">
          <WeiderMark className="text-xl text-white md:text-2xl" />
        </a>
        <div className="flex items-center gap-4 md:gap-6">
          <p className="hidden font-mono text-[11px] tracking-[0.16em] text-zinc-400 uppercase sm:block">
            <span style={{ color: REDL }}>{String(SECTIONS.indexOf(active) + 1).padStart(2, '0')}</span>
            <span className="mx-1.5 text-zinc-500" aria-hidden="true">/</span>
            {SECTION_LABELS[active]}
          </p>
          <a
            href="#vorur"
            className={`pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-500 ${
              past ? 'bg-[#e11d48] text-white' : 'border border-white/25 text-white hover:border-white/60'
            }`}
          >
            Versla
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  )
}

/* ───────────────────────── hero ───────────────────────────────── */
function Hero() {
  const reduce = useReducedMotion()
  const coreRef = useRef<HTMLDivElement>(null)

  useScrollSync(() => {
    if (reduce || !coreRef.current) return
    coreRef.current.style.transform = `translateY(${Math.min(window.scrollY * 0.12, 160)}px)`
  })

  const rise = {
    initial: { y: '115%' },
    animate: { y: '0%' },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <section id="hetja" className="relative min-h-[100svh] overflow-hidden bg-[#08080a]">
      {/* duotone athlete core — bleeds off the right, off the grid */}
      <div ref={coreRef} className="absolute top-0 right-0 h-full w-[58%] will-change-transform sm:w-[46%] md:w-[40%]" aria-hidden="true">
        <div className="relative h-full w-full">
          <Img
            src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2000&auto=format&fit=crop"
            srcSet="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=828&auto=format&fit=crop 828w, https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1280&auto=format&fit=crop 1280w, https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2000&auto=format&fit=crop 2000w"
            sizes="(min-width: 768px) 40vw, 58vw"
            alt=""
            className="h-full w-full object-cover object-[60%_30%] opacity-90 grayscale contrast-125"
            loading="eager"
            fetchpriority="high"
            fallbackClassName="h-full w-full bg-[#1b1c20]"
          />
          <div className="absolute inset-0 mix-blend-color" style={{ background: RED }} />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#08080a]/35 to-[#08080a]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-[#08080a]/30" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col justify-center px-5 pt-24 pb-28 md:px-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-mono text-[11px] tracking-[0.34em] text-zinc-400 uppercase"
        >
          Weider<span style={{ color: REDL }}>®</span> — Síðan 1936
        </motion.p>

        <h1 className="mt-5 font-poster text-[18vw] leading-[0.82] tracking-[-0.01em] text-white uppercase sm:text-[15vw] md:text-[13vw] lg:text-[11rem]">
          <span className="block overflow-hidden">
            <motion.span {...rise} className="block">Breyttu</motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span {...rise} transition={{ ...rise.transition, delay: 0.08 }} className="block text-white/10 [-webkit-text-stroke:1.5px_#8a8b92] sm:[-webkit-text-stroke:2px_#8a8b92]">
              fæðu í
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span {...rise} transition={{ ...rise.transition, delay: 0.16 }} className="block" style={{ color: RED }}>
              hreint afl.
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 max-w-md text-sm leading-relaxed text-zinc-300 md:max-w-xl md:text-base"
        >
          Framúrskarandi næring fyrir alvöru árangur. Hágæða prótein, kreatín og bætiefni frá Weider,
          send heim að dyrum um allt land.
        </motion.p>
      </div>

      <motion.a
        href="#loadout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="absolute bottom-6 left-5 z-10 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-zinc-400 uppercase md:left-10"
      >
        <motion.span
          animate={reduce ? {} : { y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20"
        >
          <ArrowDown className="h-4 w-4 text-white" aria-hidden="true" />
        </motion.span>
        Skrunaðu að úrvalinu
      </motion.a>
    </section>
  )
}

/* ───────────────────────── manifesto ──────────────────────────── */
function Manifesto() {
  const words = 'SÍÐAN 1936 · ALVÖRU ÁRANGUR · WE ARE BODYBUILDING · '
  return (
    <section id="jatning" className="relative overflow-hidden border-y border-white/10 bg-[#08080a] py-20 md:py-32">
      <div className="space-y-1 md:space-y-3" aria-hidden="true">
        <div className="flex w-max animate-[marquee_38s_linear_infinite] whitespace-nowrap motion-reduce:animate-none">
          {[0, 1].map((d) => (
            <span key={d} className="font-poster text-[12vw] leading-none tracking-tight text-white/8 uppercase md:text-[8rem]">{words.repeat(2)}</span>
          ))}
        </div>
        <div className="flex w-max animate-[marquee_38s_linear_infinite] [animation-direction:reverse] whitespace-nowrap motion-reduce:animate-none">
          {[0, 1].map((d) => (
            <span key={d} className="font-poster text-[12vw] leading-none tracking-tight uppercase md:text-[8rem]" style={{ color: 'rgba(225,29,72,0.12)' }}>{words.repeat(2)}</span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mx-auto mt-8 max-w-[1500px] px-5 md:mt-4 md:px-10"
      >
        <p className="ml-auto max-w-xl text-right font-poster text-2xl leading-[1.1] tracking-tight text-white uppercase md:text-4xl">
          Weider varð til úr ástríðu fyrir íþróttum.{' '}
          <span style={{ color: REDL }}>Í næstum níutíu ár</span> hefur sama nafnið staðið að baki alvöru árangri.
        </p>
      </motion.div>
    </section>
  )
}

/* ───────────────────────── signature: THE LOADOUT ─────────────── */
function CatPanel({ c, eager }: { c: (typeof CATS)[number]; eager?: boolean }) {
  return (
    <article className="relative h-full w-full overflow-hidden bg-[#08080a]">
      <Img src={c.img} alt={c.alt} className="absolute inset-0 h-full w-full object-cover opacity-55" loading={eager ? 'eager' : 'lazy'} fallbackClassName="absolute inset-0 bg-[#1b1c20]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/55 to-[#08080a]/25" aria-hidden="true" />
      <div className="relative z-10 flex h-full flex-col justify-between p-7 md:p-14">
        <div className="flex items-start justify-between">
          <span className="font-poster text-6xl text-white/15 md:text-8xl" aria-hidden="true">{c.no}</span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: REDL }}>{c.spec}</span>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-zinc-400 uppercase">{c.en}</p>
          <h3 className="mt-2 font-poster text-5xl leading-[0.9] tracking-tight text-white uppercase md:text-7xl" lang="is">{c.is}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-300">{c.blurb}</p>
          <a href="#vorur" className="mt-6 inline-flex items-center gap-2 border-b border-[#e11d48] pb-1 font-mono text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:text-[#ff5470]">
            {c.price}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}

function LoadoutHeader() {
  return (
    <div className="pointer-events-none absolute top-0 left-0 z-20 w-full p-5 md:p-10">
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: REDL }}>Úrvalið / The loadout</p>
      <h2 className="mt-1 font-poster text-3xl tracking-tight text-white uppercase md:text-5xl">Verslaðu eftir markmiði</h2>
    </div>
  )
}

function LoadoutDesktop() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useScrollSync(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return
    const total = wrap.offsetHeight - window.innerHeight
    const p = clamp(-wrap.getBoundingClientRect().top / (total || 1))
    const maxX = track.scrollWidth - window.innerWidth
    track.style.transform = `translate3d(${-(p * maxX)}px,0,0)`
    if (barRef.current) barRef.current.style.width = `${8 + p * 92}%`
  })

  return (
    <div ref={wrapRef} className="relative hidden h-[600vh] md:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <LoadoutHeader />
        <div ref={trackRef} className="flex h-screen will-change-transform">
          {CATS.map((c, i) => (
            <div key={c.no} className="h-screen w-screen shrink-0 pt-28">
              <div className="mx-auto h-full max-w-[1500px] px-5 md:px-10">
                <div className="h-full overflow-hidden rounded-[2rem] ring-1 ring-white/10">
                  <CatPanel c={c} eager={i === 0} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 w-[min(80vw,420px)] -translate-x-1/2">
          <div className="relative h-[6px] rounded-full bg-white/12">
            <div ref={barRef} className="absolute inset-y-0 left-0 rounded-full" style={{ width: '8%', background: RED }} />
          </div>
          <p className="mt-3 text-center font-mono text-[10px] tracking-[0.22em] text-zinc-400 uppercase">Skrunaðu — 06 flokkar</p>
        </div>
      </div>
    </div>
  )
}

function LoadoutMobile() {
  return (
    <div className="relative pt-24 pb-10 md:hidden">
      <div className="px-5 pb-6">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: REDL }}>Úrvalið</p>
        <h2 className="mt-1 font-poster text-4xl tracking-tight text-white uppercase">Verslaðu eftir markmiði</h2>
        <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-zinc-400 uppercase">Strjúktu til hliðar →</p>
      </div>
      <div className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
        {CATS.map((c, i) => (
          <div key={c.no} className="aspect-[3/4.4] w-[78vw] shrink-0 snap-center overflow-hidden rounded-[1.75rem] ring-1 ring-white/10">
            <CatPanel c={c} eager={i === 0} />
          </div>
        ))}
        <div className="w-1 shrink-0" aria-hidden="true" />
      </div>
    </div>
  )
}

function Loadout() {
  const reduce = useReducedMotion()
  return (
    <section id="loadout" className="bg-[#08080a]">
      <LoadoutMobile />
      {reduce ? (
        <div className="hidden md:block">
          <div className="mx-auto max-w-[1500px] px-10 pt-28 pb-12">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: REDL }}>Úrvalið</p>
            <h2 className="mt-1 font-poster text-5xl tracking-tight text-white uppercase">Verslaðu eftir markmiði</h2>
          </div>
          <div className="mx-auto grid max-w-[1500px] gap-6 px-10 pb-16 lg:grid-cols-2">
            {CATS.map((c) => (
              <div key={c.no} className="aspect-[16/10] overflow-hidden rounded-[2rem] ring-1 ring-white/10">
                <CatPanel c={c} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <LoadoutDesktop />
      )}
    </section>
  )
}

/* ───────────────────────── product ledger (hover system) ─────── */
function Ledger() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const p = PRODUCTS[active]
  const Icon = p.icon

  return (
    <section id="vorur" className="relative scroll-mt-24 bg-[#0c0c0e]">
      <div className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: REDL }}>Mest selt / Index</p>
            <h2 className="mt-1 font-poster text-4xl tracking-tight text-white uppercase md:text-6xl">Vinsælasta næringin</h2>
          </div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-zinc-400 uppercase">Sýnishorn · verð og einkunnir til viðmiðunar</p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <ul className="border-t border-white/10">
            {PRODUCTS.map((row, i) => {
              const on = i === active
              return (
                <li key={row.no}>
                  <a
                    href="#lokun"
                    aria-label={`${row.name} — ${row.price}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group relative flex items-center gap-4 border-b border-white/10 py-5 transition-colors md:gap-6 md:py-7"
                  >
                    <span className="absolute top-0 left-0 h-full w-[3px] origin-top transition-transform duration-500" style={{ background: RED, transform: on ? 'scaleY(1)' : 'scaleY(0)' }} aria-hidden="true" />
                    <span className="w-8 shrink-0 pl-3 font-mono text-[11px] text-zinc-400 md:pl-5">{row.no}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-poster text-2xl tracking-tight uppercase transition-colors md:text-4xl" style={{ color: on ? '#fff' : '#8a8a92' }}>{row.name}</span>
                      <span className="mt-1 block font-mono text-[10px] tracking-[0.16em] text-zinc-400 uppercase">{row.cat} · {row.spec}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-poster text-lg tracking-wide text-white md:text-xl" lang="is">{row.price}</span>
                      <span className="mt-0.5 block font-mono text-[10px] text-zinc-400">★ {row.rating}<span className="sr-only"> af 5 stjörnum</span></span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="relative hidden lg:block">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={p.no}
                  initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                  className="overflow-hidden rounded-[2rem] ring-1 ring-white/10"
                >
                  <div className="relative flex aspect-[4/5] flex-col justify-between p-8" style={{ background: `linear-gradient(150deg, #0c0c0e 0%, ${p.swatch} 220%)` }}>
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[11px] tracking-[0.2em] text-white/90 uppercase">{p.cat}</span>
                      <span className="font-mono text-[11px] text-white/90">★ {p.rating}</span>
                    </div>
                    <Icon className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 text-white/10" strokeWidth={1} aria-hidden="true" />
                    <div>
                      <WeiderMark className="text-base text-white/70" />
                      <h3 className="mt-2 font-poster text-4xl leading-none tracking-tight text-white uppercase">{p.name}</h3>
                      <p className="mt-2 text-sm text-white/80">{p.spec}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="font-poster text-2xl tracking-wide text-white" lang="is">{p.price}</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 font-mono text-[11px] font-bold tracking-[0.12em] text-[#08080a] uppercase">
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Í körfu
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── protocol (goal selector) ──────────── */
function Protocol() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const p = PROTOCOLS[active]
  const Icon = p.icon

  return (
    <section id="protocol" className="relative scroll-mt-24 border-y border-white/10 bg-[#08080a]">
      <div className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-32">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: REDL }}>Leiðarvísir / Protocol</p>
        <h2 className="mt-1 max-w-2xl font-poster text-4xl leading-[0.95] tracking-tight text-white uppercase md:text-6xl">
          Hvað er <span style={{ color: RED }}>markmiðið?</span>
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="flex flex-col gap-2">
            {PROTOCOLS.map((pr, i) => {
              const on = i === active
              const PIcon = pr.icon
              return (
                <button
                  key={pr.goal}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className={`group flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${on ? 'border-[#e11d48] bg-[#e11d48]/10' : 'border-white/10 hover:border-white/30'}`}
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors" style={{ background: on ? RED : 'rgba(255,255,255,0.06)' }}>
                    <PIcon className="h-5 w-5" style={{ color: on ? '#fff' : REDL }} aria-hidden="true" />
                  </span>
                  <span className="font-poster text-xl tracking-wide uppercase" style={{ color: on ? '#fff' : '#8a8a92' }}>{pr.goal}</span>
                </button>
              )
            })}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#101013] p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.goal}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="h-9 w-9" style={{ color: REDL }} aria-hidden="true" />
                <p className="mt-5 font-poster text-2xl leading-tight tracking-tight text-white uppercase md:text-3xl">{p.line}</p>
                <p className="mt-6 font-mono text-[11px] tracking-[0.18em] text-zinc-400 uppercase">Ráðlögð næring</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {p.stack.map((s) => (
                    <span key={s} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: RED }} aria-hidden="true" />
                      {s}
                    </span>
                  ))}
                </div>
                <a href="#vorur" className="mt-7 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.14em] uppercase" style={{ color: REDL }}>
                  Sjá vörurnar <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── heritage 1936 ──────────────────────── */
function CountStat({ to, suffix, label }: { to: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) {
      setN(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 1100
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur)
      setN(Math.round((1 - Math.pow(1 - k, 3)) * to))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, to])
  return (
    <div ref={ref}>
      <p className="font-poster text-5xl tracking-tight md:text-7xl" style={{ color: RED }}>{n}{suffix}</p>
      <p className="mt-2 font-mono text-[11px] tracking-[0.16em] text-zinc-400 uppercase">{label}</p>
    </div>
  )
}

function Heritage() {
  const reduce = useReducedMotion()
  return (
    <section id="saga" className="relative overflow-hidden bg-[#08080a]">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-20 md:grid-cols-2 md:gap-16 md:px-10 md:py-32">
        <div className="relative order-2 md:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-white/10">
            <Img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop"
              srcSet="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1280&auto=format&fit=crop 1280w, https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop 1600w"
              sizes="(min-width: 768px) 46vw, 100vw"
              alt="A muscular athlete training with weights in a dark gym"
              className="h-full w-full object-cover grayscale contrast-110"
              fallbackClassName="h-full w-full bg-[#1b1c20]"
            />
            <div className="absolute inset-0 mix-blend-color opacity-60" style={{ background: RED }} aria-hidden="true" />
            <span className="absolute bottom-6 left-6 font-mono text-[11px] tracking-[0.2em] text-white/80 uppercase">Est. 1936</span>
          </div>
        </div>

        <div className="order-1 flex flex-col justify-center md:order-2">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: REDL }}>Sagan / Since 1936</p>
          <h2 className="mt-2 font-poster text-5xl leading-[0.88] tracking-tight text-white uppercase md:text-8xl">
            We are<br />bodybuilding
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-300">
            Weider er upprunalega íþróttanæringin. Frá keppnisfólki á sviði til þeirra sem vilja
            einfaldlega líða betur, sama nafnið og sömu gæðin hafa staðið að baki í næstum níutíu ár.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {STATS.map((s) => (
              <CountStat key={s.label} {...s} />
            ))}
          </div>

          <div className="mt-10 space-y-5 border-t border-white/10 pt-8">
            {REVIEWS.map((r, i) => (
              <motion.figure
                key={r.who}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-4"
              >
                <span className="font-poster text-2xl leading-none" style={{ color: RED }} aria-hidden="true">„</span>
                <div>
                  <blockquote className="text-sm leading-relaxed text-zinc-200">{r.text}</blockquote>
                  <figcaption className="mt-1.5 font-mono text-[10px] tracking-[0.16em] text-zinc-400 uppercase">{r.who}</figcaption>
                </div>
              </motion.figure>
            ))}
          </div>
          <p className="mt-4 font-mono text-[10px] tracking-[0.16em] text-zinc-400 uppercase">Sýnishorn af umsögnum</p>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── terminal (close) ──────────────────── */
function Terminal() {
  return (
    <section id="lokun" className="relative overflow-hidden bg-[#e11d48] text-white">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
        <span className="font-poster text-[40vw] leading-none tracking-tight text-white/10 uppercase">AFL</span>
      </div>
      <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-36">
        <p className="font-mono text-[11px] tracking-[0.24em] text-white uppercase">Klár í alvöru árangur?</p>
        <h2 className="mt-4 max-w-4xl font-poster text-[14vw] leading-[0.85] tracking-tight uppercase md:text-[9rem]">
          Byrjaðu með<br />Weider í dag
        </h2>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a href="#vorur" className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-mono text-xs font-bold tracking-[0.14em] text-[#08080a] uppercase transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Versla vörur
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <a href="mailto:weidervorur@gmail.com?subject=Fyrirspurn" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-8 py-4 font-mono text-xs font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Hafa samband
          </a>
        </div>
        <div className="mt-12 grid max-w-2xl gap-px overflow-hidden rounded-2xl border border-white/25 sm:grid-cols-3">
          {[
            ['Netfang', 'weidervorur@gmail.com'],
            ['Sími', '770 0295'],
            ['Sent með', 'Dropp · 1–2 dagar'],
          ].map(([k, v]) => (
            <div key={k} className="bg-[#e11d48] p-4">
              <p className="font-mono text-[10px] tracking-[0.16em] text-white uppercase">{k}</p>
              <p className="mt-1 text-sm font-semibold text-white">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── page ──────────────────────────────── */
export default function Page() {
  useEffect(() => {
    document.title = 'Weider — Redesign Concept'
  }, [])

  return (
    <div className="min-h-screen bg-[#08080a] font-sans text-zinc-300 antialiased">
      <PreviewChrome company={company} />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Loadout />
        <Ledger />
        <Protocol />
        <Heritage />
        <Terminal />
      </main>
      <PreviewFooter company={company} />
    </div>
  )
}
