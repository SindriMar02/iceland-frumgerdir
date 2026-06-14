import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  ChevronRight,
  Dumbbell,
  FlaskConical,
  Globe,
  Heart,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Star,
  Tag,
  Truck,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'

const company = getPreviewCompany('weider')

/* Weider brand system
   red #e11d48 (fills/CTAs/large) · red-light #ff5470 (small text on dark, AA)
   ink #0b0b0d · surface #141417 · light band #f4f4f2 */
const RED = '#e11d48'

/** Faithful WEIDER wordmark — heavy condensed uppercase (Anton) with ® mark. */
function WeiderMark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-poster leading-none tracking-[0.01em] ${className}`} aria-label="Weider">
      <span aria-hidden="true">
        WEIDER<sup className="ml-[0.06em] align-super text-[0.42em] tracking-normal">®</sup>
      </span>
    </span>
  )
}

const NAV = [
  ['#flokkar', 'Vörur'],
  ['#kreatin', 'Kreatín'],
  ['#vorur', 'Mest selt'],
  ['#markmid', 'Finna vöru'],
  ['#saga', 'Sagan'],
]

const PILLARS = [
  {
    icon: Award,
    title: 'Síðan 1936',
    body: 'Frumkvöðull í íþróttanæringu í næstum 90 ár. Nafn sem ræktarfólk um allan heim þekkir og treystir.',
  },
  {
    icon: Globe,
    title: 'Þróað af Weider Germany',
    body: 'Ekta Weider vörur, þær sömu og seldar eru í yfir 120 löndum, fáanlegar hér heima á íslensku.',
  },
  {
    icon: ShieldCheck,
    title: 'Gæðaloforð Weider',
    body: 'Vörumerki sem byggir á gæðum og þekkingu, með milljónir ánægðra viðskiptavina að baki.',
  },
  {
    icon: Truck,
    title: 'Sent með Dropp',
    body: 'Pantanir sendar um allt land, oftast komnar til þín á einum til tveimur virkum dögum.',
  },
]

const CATEGORIES = [
  {
    href: '#kreatin',
    no: '01',
    nameIs: 'Kreatín',
    nameEn: 'Creatine',
    blurb: 'Sprengikraftur, styrkur og ending.',
    img: 'https://images.unsplash.com/photo-1693996045463-6ea86d10a2e7?q=80&w=1200&auto=format&fit=crop',
    alt: 'Fine white creatine powder spilling from a measuring scoop',
  },
  {
    href: '#vorur',
    no: '02',
    nameIs: 'Prótein',
    nameEn: 'Protein',
    blurb: 'Uppbygging og endurheimt vöðva.',
    img: 'https://images.unsplash.com/photo-1693996046865-19217d179161?q=80&w=1200&auto=format&fit=crop',
    alt: 'A scoop of chocolate protein powder on a clean surface',
  },
  {
    href: '#vorur',
    no: '03',
    nameIs: 'Pre-workout',
    nameEn: 'Fyrir æfingu',
    blurb: 'Orka og fókus fyrir átökin.',
    img: 'https://images.unsplash.com/photo-1516481265257-97e5f4bc50d5?q=80&w=1200&auto=format&fit=crop',
    alt: 'An athlete loading heavy plates onto a barbell before training',
  },
  {
    href: '#vorur',
    no: '04',
    nameIs: 'Amínósýrur',
    nameEn: 'Amino acids',
    blurb: 'Endurheimt og uppbygging.',
    img: 'https://images.unsplash.com/photo-1600679472233-eabc13b79f07?q=80&w=1200&auto=format&fit=crop',
    alt: 'An athlete drinking from a sports bottle outdoors after exercise',
  },
  {
    href: '#vorur',
    no: '05',
    nameIs: 'Vítamín & steinefni',
    nameEn: 'Vitamins',
    blurb: 'Grunnurinn að daglegri heilsu.',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    alt: 'A person stretching calmly at golden hour, everyday wellbeing',
  },
  {
    href: '#vorur',
    no: '06',
    nameIs: 'Snarl & drykkir',
    nameEn: 'Snacks & drinks',
    blurb: 'Prótein á ferðinni.',
    img: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1200&auto=format&fit=crop',
    alt: 'A person preparing a protein shake in a bright kitchen',
  },
]

const GOALS = [
  {
    icon: Dumbbell,
    goal: 'Byggja vöðva',
    pick: 'Prótein + Kreatín',
    body: 'Hreint prótein fyrir uppbyggingu, kreatín fyrir styrk og kraft.',
  },
  {
    icon: Zap,
    goal: 'Meiri orka',
    pick: 'Pre-workout',
    body: 'Orka og fókus fyrir erfiðustu æfingarnar þínar.',
  },
  {
    icon: Leaf,
    goal: 'Betri endurheimt',
    pick: 'Amínósýrur (EAA)',
    body: 'Lífsnauðsynlegar amínósýrur sem styðja við endurheimt.',
  },
  {
    icon: Heart,
    goal: 'Dagleg heilsa',
    pick: 'Vítamín & steinefni',
    body: 'Grunnbætiefni sem styðja við daglega heilsu.',
  },
]

interface Product {
  name: string
  cat: string
  icon: LucideIcon
  price: string
  blurb: string
  rating: string
  tag?: string
  swatch: string
}

const PRODUCTS: Product[] = [
  {
    name: 'Premium Whey',
    cat: 'Prótein',
    icon: Dumbbell,
    price: 'frá 3.990 kr.',
    blurb: 'Hreint mysuprótein fyrir uppbyggingu og endurheimt.',
    rating: '4,9',
    tag: 'Mest selt',
    swatch: 'linear-gradient(135deg,#7b1224,#e11d48)',
  },
  {
    name: 'Pure Creatine',
    cat: 'Kreatín',
    icon: FlaskConical,
    price: 'frá 2.890 kr.',
    blurb: 'Kreatín einhýdrat, mest rannsakaða fæðubótarefnið.',
    rating: '4,8',
    swatch: 'linear-gradient(135deg,#1b1b1f,#3a3a42)',
  },
  {
    name: 'Total Rush 2.0',
    cat: 'Pre-workout',
    icon: Zap,
    price: '3.990 kr.',
    blurb: 'Orka og fókus fyrir átök í ræktinni.',
    rating: '4,7',
    swatch: 'linear-gradient(135deg,#4a0f1d,#e11d48)',
  },
  {
    name: 'Premium EAA',
    cat: 'Amínósýrur',
    icon: Leaf,
    price: '3.790 kr.',
    blurb: 'Allar lífsnauðsynlegu amínósýrurnar fyrir endurheimt.',
    rating: '4,8',
    swatch: 'linear-gradient(135deg,#12303a,#1f93b0)',
  },
  {
    name: 'Multi Vítamín Gúmmí',
    cat: 'Vítamín',
    icon: Heart,
    price: '2.290 kr.',
    blurb: 'Dagleg vítamín í góðgæti sem þú manst eftir að taka.',
    rating: '4,7',
    tag: 'Nýtt',
    swatch: 'linear-gradient(135deg,#7a3a0c,#e0a43a)',
  },
  {
    name: 'Omega 3 Superior',
    cat: 'Vítamín',
    icon: Heart,
    price: '2.990 kr.',
    blurb: 'Hágæða fiskolía fyrir hjarta, heila og liði.',
    rating: '4,8',
    swatch: 'linear-gradient(135deg,#0d2438,#2b6f8f)',
  },
  {
    name: 'Mega Mass',
    cat: 'Prótein',
    icon: Dumbbell,
    price: '3.990 kr.',
    blurb: 'Þyngdaraukandi blanda fyrir aukna orku og massa.',
    rating: '4,6',
    swatch: 'linear-gradient(135deg,#2a1208,#a85a25)',
  },
  {
    name: 'Premium Creatine Gummies',
    cat: 'Kreatín',
    icon: FlaskConical,
    price: '2.990 kr.',
    blurb: 'Kreatín á ferðinni, ekkert hristiglas.',
    rating: '4,7',
    swatch: 'linear-gradient(135deg,#3a0a1a,#e11d48)',
  },
]

const REVIEWS = [
  {
    text: 'Pantaði á mánudegi og fékk sent á miðvikudegi. Premium Whey er það besta sem ég hef prófað.',
    name: 'Andri G.',
    from: 'Reykjavík',
  },
  {
    text: 'Loksins íslensk vefverslun með Weider. Kreatínið virkar og verðið er sanngjarnt.',
    name: 'Sara D.',
    from: 'Akureyri',
  },
  {
    text: 'Frábær þjónusta og hröð afhending. Mæli með gúmmívítamínunum fyrir alla fjölskylduna.',
    name: 'Kristján B.',
    from: 'Hafnarfjörður',
  },
]

const STATS = [
  ['1936', 'Stofnað'],
  ['120+', 'Lönd'],
  ['1–2', 'Dagar með Dropp'],
  ['100%', 'Ekta Weider'],
]

/** Full-width red mobile CTA bar — chrome's button floats above it. */
function MobileBar() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      initial={false}
      animate={{ y: show ? 0 : 120 }}
      transition={{ type: 'spring', damping: 26, stiffness: 280 }}
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-white/10 bg-[#0b0b0d]/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md md:hidden"
    >
      <div className="min-w-0">
        <WeiderMark className="text-base text-white" />
        <p className="mt-0.5 truncate text-[11px] text-zinc-400">Framúrskarandi næring · síðan 1936</p>
      </div>
      <a
        href="#vorur"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#e11d48] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#e11d48]/30"
      >
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
        Versla
      </a>
    </motion.div>
  )
}

export default function Page() {
  useEffect(() => {
    document.title = 'Weider — Redesign Concept'
  }, [])

  return (
    <div className="min-h-screen bg-[#0b0b0d] font-sans text-zinc-300 antialiased">
      <PreviewChrome company={company} />
      <MobileBar />

      {/* Announcement bar */}
      <div className="bg-[#e11d48] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-5 py-2 text-center text-[11px] font-semibold tracking-[0.14em] uppercase md:px-8">
          <Truck className="h-3.5 w-3.5" aria-hidden="true" />
          Sent um allt land með Dropp · 1–2 virkir dagar
        </div>
      </div>

      {/* Sticky nav */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0b0d]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <a href="#top" className="flex items-center" aria-label="Weider — efst">
            <WeiderMark className="text-2xl text-white md:text-[1.7rem]" />
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Aðalvalmynd">
            {NAV.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#vorur"
            className="inline-flex items-center gap-2 rounded-full bg-[#e11d48] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#c4163d]"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Versla núna</span>
            <span className="sm:hidden">Versla</span>
          </a>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden bg-black">
          <Img
            src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2000&auto=format&fit=crop"
            srcSet="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=828&auto=format&fit=crop 828w, https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1280&auto=format&fit=crop 1280w, https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2000&auto=format&fit=crop 2000w"
            sizes="100vw"
            alt="An athlete training hard in a dark gym, lit dramatically"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.85]"
            loading="eager"
            fetchpriority="high"
            fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#2a0a14] via-[#0b0b0d] to-black"
          />
          {/* scrims for AA text contrast */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/15"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-transparent to-[#0b0b0d]/40"
            aria-hidden="true"
          />
          {/* red glow */}
          <div
            className="pointer-events-none absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full opacity-30 blur-[120px]"
            style={{ background: RED }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto grid min-h-[88vh] max-w-6xl items-center px-5 py-20 md:px-8 md:py-28">
            <div className="max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: RED }} aria-hidden="true" />
                Síðan 1936 · Weider á Íslandi
              </motion.p>

              <h1 className="mt-6 font-poster text-[2.55rem] leading-[0.95] tracking-tight text-white uppercase sm:text-7xl sm:leading-[0.92] lg:text-8xl">
                <motion.span
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.08 }}
                  className="block"
                  lang="is"
                >
                  Alvöru árangur
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.18 }}
                  className="block"
                  style={{ color: RED }}
                  lang="is"
                >
                  krefst alvöru næringar
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-6 max-w-xl text-base leading-relaxed text-zinc-200 md:text-lg"
              >
                Framúrskarandi næring fyrir alvöru árangur. Hágæða prótein, kreatín og bætiefni frá
                Weider, send heim að dyrum um allt land.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.42 }}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <a
                  href="#vorur"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#e11d48] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#e11d48]/25 transition-all hover:-translate-y-0.5 hover:bg-[#c4163d]"
                >
                  Versla vörur
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
                <a
                  href="#markmid"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10"
                >
                  Finna réttu vöruna
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-zinc-300"
              >
                <span className="inline-flex items-center gap-2">
                  <Award className="h-4 w-4" style={{ color: '#ff5470' }} aria-hidden="true" />
                  Vörumerki síðan 1936
                </span>
                <span className="inline-flex items-center gap-2">
                  <Globe className="h-4 w-4" style={{ color: '#ff5470' }} aria-hidden="true" />
                  Selt í yfir 120 löndum
                </span>
                <span className="inline-flex items-center gap-2">
                  <Truck className="h-4 w-4" style={{ color: '#ff5470' }} aria-hidden="true" />
                  Sent með Dropp
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="overflow-hidden border-y border-white/10 bg-[#e11d48] py-3 text-white">
          <div
            className="flex w-max animate-[marquee_34s_linear_infinite] whitespace-nowrap motion-reduce:animate-none"
            aria-hidden="true"
          >
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex items-center">
                {['Framúrskarandi næring', 'Síðan 1936', 'Alvöru árangur', 'We Are Bodybuilding', 'Ekta Weider vörur'].map(
                  (t) => (
                    <span key={t} className="flex items-center">
                      <span className="px-6 font-poster text-lg tracking-wide uppercase">{t}</span>
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>

        {/* WHY WEIDER */}
        <section className="border-b border-white/10 bg-[#0b0b0d]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <Reveal className="max-w-2xl">
              <p className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#ff5470' }}>
                <span className="h-px w-8" style={{ background: '#ff5470' }} aria-hidden="true" />
                Af hverju Weider?
              </p>
              <h2 className="mt-4 font-poster text-3xl leading-[1.02] tracking-tight text-white uppercase md:text-5xl">
                Arfleifð sem þú getur treyst
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                Weider er ekki nýtt nafn í íþróttanæringu. Það er upprunalega vörumerkið, byggt á
                næstum 90 ára sögu og notað af íþróttafólki um allan heim.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.06} className="h-full">
                  <div className="flex h-full flex-col bg-[#141417] p-7 transition-colors hover:bg-[#1a1a1f]">
                    <span
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#e11d48]/30 bg-[#e11d48]/10"
                      aria-hidden="true"
                    >
                      <p.icon className="h-6 w-6" style={{ color: '#ff5470' }} />
                    </span>
                    <h3 className="mt-5 font-poster text-xl tracking-wide text-white uppercase" lang="is">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES — light band for shopping clarity */}
        <section id="flokkar" className="scroll-mt-20 bg-[#f4f4f2] text-[#0b0b0d]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-xl">
                <p className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.2em] text-[#be123c] uppercase">
                  <span className="h-px w-8 bg-[#be123c]" aria-hidden="true" />
                  Vöruflokkar
                </p>
                <h2 className="mt-4 font-poster text-3xl leading-[1.02] tracking-tight uppercase md:text-5xl">
                  Verslaðu eftir markmiði
                </h2>
              </div>
              <a
                href="#vorur"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#be123c] transition-colors hover:text-[#0b0b0d]"
              >
                Sjá allar vörur
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((c, i) => (
                <Reveal key={c.nameIs} delay={i * 0.05}>
                  <a
                    href={c.href}
                    className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-[#0b0b0d] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#be123c]"
                  >
                    <Img
                      src={c.img}
                      alt={c.alt}
                      className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                      fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#2a0a14] to-[#0b0b0d]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10"
                      aria-hidden="true"
                    />
                    <span className="absolute top-5 left-5 font-mono text-xs font-semibold tracking-widest text-white/70">
                      {c.no}
                    </span>
                    <span
                      className="absolute top-4 right-4 inline-flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-[#e11d48] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                    <div className="relative z-10 p-6">
                      <p className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
                        {c.nameEn}
                      </p>
                      <h3 className="mt-1 font-poster text-2xl tracking-wide text-white uppercase md:text-3xl" lang="is">
                        {c.nameIs}
                      </h3>
                      <p className="mt-1.5 text-sm text-zinc-300">{c.blurb}</p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* KREATÍN spotlight — on-brand red product imagery */}
        <section id="kreatin" className="scroll-mt-16 overflow-hidden bg-[#0b0b0d]">
          <div className="mx-auto grid max-w-6xl items-stretch gap-0 md:grid-cols-2">
            <div className="order-2 flex flex-col justify-center px-5 py-16 md:order-1 md:px-12 md:py-24">
              <Reveal>
                <p className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#ff5470' }}>
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  Vara í brennidepli · Kreatín
                </p>
                <h2 className="mt-4 font-poster text-3xl leading-[1.02] tracking-tight text-white uppercase md:text-5xl">
                  Leynivopnið þitt í ræktinni
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-300">
                  Ef þú vilt hámarka sprengikraft, styrk og endingu í æfingum, þá er kreatín
                  leynivopnið. Það er eitt mest rannsakaða fæðubótarefnið í heiminum, og með góðri
                  ástæðu.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#vorur"
                    className="group inline-flex items-center gap-2 rounded-full bg-[#e11d48] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#e11d48]/25 transition-all hover:-translate-y-0.5 hover:bg-[#c4163d]"
                  >
                    Skoða kreatín
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-sm font-medium text-zinc-300">
                    <Tag className="h-4 w-4" style={{ color: '#ff5470' }} aria-hidden="true" />
                    frá 2.890 kr.
                  </span>
                </div>
              </Reveal>
            </div>
            <div className="relative order-1 min-h-[20rem] md:order-2">
              <Img
                src="https://images.unsplash.com/photo-1683394572742-1e471f60fc2a?q=80&w=1600&auto=format&fit=crop"
                srcSet="https://images.unsplash.com/photo-1683394572742-1e471f60fc2a?q=80&w=828&auto=format&fit=crop 828w, https://images.unsplash.com/photo-1683394572742-1e471f60fc2a?q=80&w=1280&auto=format&fit=crop 1280w, https://images.unsplash.com/photo-1683394572742-1e471f60fc2a?q=80&w=1600&auto=format&fit=crop 1600w"
                sizes="(min-width: 768px) 50vw, 100vw"
                alt="A jar of creatine monohydrate styled with fresh strawberries on a bold red background"
                className="absolute inset-0 h-full w-full object-cover"
                fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#e11d48] to-[#7b1224]"
              />
            </div>
          </div>
        </section>

        {/* GOAL GUIDE */}
        <section id="markmid" className="scroll-mt-20 border-y border-white/10 bg-[#0e0e11]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <Reveal className="max-w-2xl">
              <p className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#ff5470' }}>
                <span className="h-px w-8" style={{ background: '#ff5470' }} aria-hidden="true" />
                Leiðarvísir
              </p>
              <h2 className="mt-4 font-poster text-3xl leading-[1.02] tracking-tight text-white uppercase md:text-5xl">
                Finndu réttu vöruna
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                Segðu okkur markmiðið þitt, við bendum þér á réttu næringuna. Engin ágiskun, bara það
                sem virkar.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {GOALS.map((g, i) => (
                <Reveal key={g.goal} delay={i * 0.06} className="h-full">
                  <a
                    href="#vorur"
                    className="group flex h-full flex-col rounded-3xl border border-white/10 bg-[#141417] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#e11d48]/40 hover:bg-[#18181d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5470]"
                  >
                    <span
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#e11d48]/10 text-[#ff5470] ring-1 ring-[#e11d48]/30"
                      aria-hidden="true"
                    >
                      <g.icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-white" lang="is">
                      {g.goal}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-zinc-400">{g.body}</p>
                    <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                      <span style={{ color: '#ff5470' }}>{g.pick}</span>
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        style={{ color: '#ff5470' }}
                        aria-hidden="true"
                      />
                    </p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS — best sellers (photo-light, honest typographic cards) */}
        <section id="vorur" className="scroll-mt-20 bg-[#0b0b0d]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-xl">
                <p className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#ff5470' }}>
                  <span className="h-px w-8" style={{ background: '#ff5470' }} aria-hidden="true" />
                  Mest selt
                </p>
                <h2 className="mt-4 font-poster text-3xl leading-[1.02] tracking-tight text-white uppercase md:text-5xl">
                  Vinsælustu vörurnar
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
                Sýnishorn af úrvalinu. Verð eru til viðmiðunar.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCTS.map((p, i) => (
                <Reveal key={p.name} delay={(i % 4) * 0.05}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#141417] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/40">
                    <div
                      className="relative flex aspect-[5/4] items-center justify-center overflow-hidden"
                      style={{ background: p.swatch }}
                    >
                      <p.icon
                        className="h-16 w-16 text-white/25 drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-110"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <WeiderMark className="absolute bottom-3 left-4 text-sm text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]" />
                      {p.tag && (
                        <span className="absolute top-3 right-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#0b0b0d] uppercase">
                          {p.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: '#ff5470' }}>
                          {p.cat}
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-300">
                          <Star className="h-3.5 w-3.5 fill-current" style={{ color: '#ff5470' }} aria-hidden="true" />
                          {p.rating}
                          <span className="sr-only"> af 5 stjörnum</span>
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-bold text-white">{p.name}</h3>
                      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-zinc-400">{p.blurb}</p>
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span className="font-poster text-xl tracking-wide text-white" lang="is">
                          {p.price}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e11d48]/50 px-3.5 py-2 text-xs font-bold text-white transition-colors group-hover:border-transparent group-hover:bg-[#e11d48]">
                          <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                          Í körfu
                        </span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* HERITAGE — Since 1936 */}
        <section id="saga" className="relative scroll-mt-16 overflow-hidden bg-black text-white">
          <Img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop"
            srcSet="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1280&auto=format&fit=crop 1280w, https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop 2000w"
            sizes="100vw"
            alt="A muscular athlete training with weights in a dark gym"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#1a1a1f] to-black"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" aria-hidden="true" />
          <div className="relative z-10 mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Reveal className="max-w-xl">
              <p className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#ff5470' }}>
                <span className="h-px w-8" style={{ background: '#ff5470' }} aria-hidden="true" />
                Sagan · Since 1936
              </p>
              <h2 className="mt-4 font-poster text-4xl leading-[0.98] tracking-tight uppercase md:text-6xl">
                We Are Bodybuilding
              </h2>
              <p className="mt-6 text-base leading-relaxed text-zinc-200 md:text-lg">
                Weider varð til úr ástríðu fyrir íþróttum og heilsu, og hefur í næstum 90 ár verið
                eitt þekktasta nafnið í íþróttanæringu. Frá keppnisfólki á sviði til fólks sem vill
                einfaldlega líða betur, sömu gæðin standa að baki hverri vöru.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4">
                {STATS.map(([big, small]) => (
                  <div key={small}>
                    <p className="font-poster text-3xl tracking-wide text-white md:text-4xl" style={{ color: '#ff5470' }}>
                      {big}
                    </p>
                    <p className="mt-1 text-[11px] tracking-wide text-zinc-300 uppercase">{small}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="bg-[#0b0b0d]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <Reveal className="text-center">
              <p className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#ff5470' }}>
                Umsagnir viðskiptavina
              </p>
              <h2 className="mt-4 font-poster text-3xl leading-[1.02] tracking-tight text-white uppercase md:text-5xl">
                Treyst af íslensku ræktarfólki
              </h2>
              <p className="mt-3 text-sm text-zinc-400">Sýnishorn af umsögnum.</p>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {REVIEWS.map((r, i) => (
                <Reveal key={r.name} delay={i * 0.08}>
                  <figure className="flex h-full flex-col rounded-3xl border border-white/10 bg-[#141417] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                    <div className="flex gap-1" role="img" aria-label="5 af 5 stjörnum">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-current" style={{ color: '#ff5470' }} aria-hidden="true" />
                      ))}
                    </div>
                    <blockquote className="mt-4 flex-1 text-base leading-relaxed text-zinc-200">
                      „{r.text}“
                    </blockquote>
                    <figcaption className="mt-5 border-t border-white/10 pt-4 text-sm">
                      <span className="font-semibold text-white">{r.name}</span>
                      <span className="block text-zinc-400">{r.from}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="hafa-samband" className="scroll-mt-16 bg-[#e11d48]">
          <div className="mx-auto max-w-5xl px-5 py-20 text-center md:px-8 md:py-28">
            <Reveal>
              <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-white uppercase">
                Klár í alvöru árangur?
              </p>
              <h2 className="mx-auto mt-4 max-w-3xl font-poster text-4xl leading-[0.98] tracking-tight text-white uppercase md:text-6xl">
                Byrjaðu með Weider í dag
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white">
                Veldu vörurnar sem henta markmiðum þínum og fáðu þær sendar heim að dyrum um allt
                land með Dropp, oftast á einum til tveimur virkum dögum.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#vorur"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#0b0b0d] shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Versla vörur
                </a>
                <a
                  href="mailto:weidervorur@gmail.com?subject=Fyrirspurn"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Hafa samband
                </a>
              </div>
              <p className="mt-8 text-xs text-white">
                weidervorur@gmail.com · 770 0295 · Austurkór 65, 203 Kópavogur
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}
