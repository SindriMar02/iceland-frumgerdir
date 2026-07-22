import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowUpRight,
  Blocks,
  Clock,
  Croissant,
  Gift,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Plug,
  ShoppingBasket,
} from 'lucide-react'
import { Img } from '../../components/Img'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { HeroReveal } from './HeroReveal'
import { CONTACT, HOURS, IMG, OFFERINGS, QUOTES, computeStatus, type OpenStatus } from './data'

const company = getPreviewCompany('kauptun')
const EASE = [0.16, 1, 0.3, 1] as const

const OFFERING_ICONS = {
  basket: ShoppingBasket,
  croissant: Croissant,
  blocks: Blocks,
  gift: Gift,
  plug: Plug,
} as const

/* ---------- small motion helpers ---------- */

function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  amount = 0.3,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  amount?: number
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Standalone photo that reveals with a clip-path wipe (ledger #7-safe: the
 *  observer target's layout box is unchanged by clip-path). */
function PhotoReveal({
  src,
  alt,
  wrapClass,
  imgClass,
  eager = false,
}: {
  src: string
  alt: string
  wrapClass?: string
  imgClass?: string
  eager?: boolean
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={`overflow-hidden ${wrapClass ?? ''}`}
      initial={reduced ? false : { clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <Img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        className={`h-full w-full object-cover ${imgClass ?? ''}`}
        fallbackClassName="bg-gradient-to-br from-[#4B6670] to-[#1C2624]"
      />
    </motion.div>
  )
}

/* ---------- status chip ---------- */

function StatusChip({ status, tone }: { status: OpenStatus; tone: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] ${
        dark
          ? 'bg-[#F4F0E6]/12 text-[#F4F0E6] ring-1 ring-[#F4F0E6]/25'
          : 'bg-[#1C2624]/[0.04] text-[#1C2624] ring-1 ring-[#1C2624]/12'
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${status.openNow ? 'bg-[#4B7C4B]' : 'bg-[#B8432A]'}`}
        style={status.openNow ? { boxShadow: '0 0 0 3px rgba(75,124,75,0.22)' } : undefined}
      />
      <span>{status.openNow ? 'Opið núna' : 'Lokað núna'}</span>
      <span className={dark ? 'text-[#F4F0E6]/55' : 'text-[#4B6670]'}>{status.detail}</span>
    </span>
  )
}

/* ---------- page ---------- */

export default function Page() {
  const reduced = useReducedMotion()
  const [status, setStatus] = useState<OpenStatus>(() => computeStatus(new Date()))
  const coreRef = useRef<HTMLElement>(null)

  // Live open/closed, refreshed each minute.
  useEffect(() => {
    setStatus(computeStatus(new Date()))
    const id = window.setInterval(() => setStatus(computeStatus(new Date())), 60_000)
    return () => window.clearInterval(id)
  }, [])

  // Lenis smooth scroll — skipped entirely under reduced motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const lenis = new Lenis({
      duration: 1.15,
      easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
    })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  // THE single scroll-linked signature: the accent rule that draws itself
  // through the "650 manns" section. Pure scaleX on one element, origin-left.
  const { scrollYProgress } = useScroll({
    target: coreRef,
    offset: ['start 0.75', 'start 0.15'],
  })
  const ruleScaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div lang="is" className="min-h-screen bg-[#F4F0E6] font-sans text-[#1C2624] antialiased">
      <PreviewChrome company={company} />

      {/* lightweight page header (not sticky) over the hero */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-5 md:px-8">
          <span className="font-grotesk text-lg font-bold uppercase tracking-[0.14em] text-[#F4F0E6] drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
            Kauptún
          </span>
          <div className="hidden items-center gap-5 md:flex">
            <a
              href="#hagnytt"
              className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#F4F0E6]/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)] transition-colors hover:text-[#F4F0E6]"
            >
              Opnunartími
            </a>
            <a
              href={CONTACT.phoneHref}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F0E6] px-4 py-2 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-[#1C2624] transition-transform active:scale-[0.97]"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </header>

      {/* ============ 1 · HERO ============ */}
      <section className="relative min-h-[92svh] w-full overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { scale: 1.09, opacity: 0 }}
          animate={reduced ? undefined : { scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: EASE }}
        >
          <Img
            src={IMG.storefront}
            alt="Verslunin Kauptún á Hafnarbyggð 4, tvílyft hús með skiltinu KAUPTÚN yfir innganginum, fjöll og fjörður í baksýn."
            loading="eager"
            fetchpriority="high"
            className="h-full w-full object-cover object-[50%_38%]"
            fallbackClassName="bg-gradient-to-br from-[#4B6670] to-[#1C2624]"
          />
        </motion.div>
        {/* legibility scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#141b1a] via-[#141b1a]/45 to-[#141b1a]/10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#141b1a]/55 to-transparent"
        />

        <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-[1200px] flex-col justify-end px-5 pb-14 pt-28 md:px-8 md:pb-20">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="mb-5 font-mono text-[12px] uppercase tracking-[0.24em] text-[#F4F0E6]/75"
          >
            Vopnafjörður · verslunin síðan 1988
          </motion.p>

          <h1 className="max-w-[16ch] font-grotesk text-[3.1rem] font-bold leading-[1.08] text-[#F4F0E6] drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)] sm:text-6xl md:text-7xl lg:text-[5.4rem]">
            <HeroReveal text="Hjartað í þorpinu" delay={0.35} />
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
            className="mt-6 max-w-[54ch] text-[1.05rem] leading-relaxed text-[#F4F0E6]/90 md:text-lg"
          >
            Matvörur, heimabakað bakkelsi, leikföng og gjafavörur. Allt undir sama þaki á
            Hafnarbyggð 4, í búðinni sem heldur Vopnafirði gangandi.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05, ease: EASE }}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <a
              href={CONTACT.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B8432A] px-6 py-3.5 text-[15px] font-semibold text-[#F4F0E6] shadow-[0_10px_30px_-8px_rgba(184,67,42,0.6)] transition-transform active:scale-[0.97]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Hringja í búðina · {CONTACT.phone}
            </a>
            <a
              href={CONTACT.mapsHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[15px] font-medium text-[#F4F0E6] ring-1 ring-[#F4F0E6]/40 backdrop-blur-sm transition-colors hover:bg-[#F4F0E6]/10"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              Leiðarlýsing
            </a>
            <span className="sm:ml-1">
              <StatusChip status={status} tone="dark" />
            </span>
          </motion.div>
        </div>
      </section>

      {/* ============ 2 · OPIÐ NÚNA STRIP ============ */}
      <section aria-labelledby="opid-heading" className="bg-[#E7DFC9]">
        <h2 id="opid-heading" className="sr-only">
          Opnunartími og staðsetning
        </h2>
        <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-10 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-12 md:px-8">
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 shrink-0 text-[#B8432A]" aria-hidden="true" />
            <StatusChip status={status} tone="light" />
          </div>

          <dl className="grid gap-x-8 gap-y-1.5 border-y border-[#1C2624]/10 py-4 sm:grid-cols-3 md:border-x-0 md:border-y-0 md:py-0">
            {HOURS.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-3 sm:flex-col sm:gap-0.5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#4B6670]">
                  {row.label}
                </dt>
                <dd className={`font-mono text-sm ${row.open === null ? 'text-[#9A3720]' : 'text-[#1C2624]'}`}>
                  {row.display}
                </dd>
              </div>
            ))}
          </dl>

          <a
            href={CONTACT.mapsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 justify-self-start py-2 font-mono text-[12px] uppercase tracking-[0.12em] text-[#1C2624] underline decoration-[#B8432A]/40 decoration-2 underline-offset-4 transition-colors hover:decoration-[#B8432A] md:justify-self-end"
          >
            <MapPin className="h-4 w-4 text-[#B8432A]" aria-hidden="true" />
            {CONTACT.address}, {CONTACT.postal}
          </a>
        </div>
      </section>

      {/* ============ 3 · UNDIR EINU ÞAKI (offerings) ============ */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Reveal className="max-w-[24ch]">
          <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.22em] text-[#B8432A]">
            Undir einu þaki
          </p>
          <h2 className="font-grotesk text-[2.4rem] font-bold leading-[1.08] md:text-5xl">
            Ekki bara matvörur, heldur allt sem þorpið þarf.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-[#1C2624]/10 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERINGS.map((item, i) => {
            const Icon = OFFERING_ICONS[item.icon]
            return (
              <Reveal
                key={item.title}
                delay={i * 0.06}
                y={20}
                className="group flex flex-col bg-[#F4F0E6] p-8 transition-colors hover:bg-[#EFEADC]"
              >
                <Icon className="h-7 w-7 text-[#B8432A]" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-6 font-grotesk text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#1C2624]/70">{item.body}</p>
              </Reveal>
            )
          })}
          {/* fifth tile pairs with a warm closing note so the grid has no empty cell */}
          <Reveal
            delay={OFFERINGS.length * 0.06}
            y={20}
            className="flex flex-col justify-center bg-[#1C2624] p-8 text-[#F4F0E6]"
          >
            <p className="font-grotesk text-lg font-medium leading-snug">
              Fjölskylduvæn verslun í hjarta Vopnafjarðar.
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F4F0E6]/55">
              Opið allt árið
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ 4 · NÝBAKAÐ (fresh-baked band) ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Img
            src={IMG.bread}
            alt="Nýhnoðuð brauð með hveiti á striga, dæmigerð bakstursmynd."
            className="h-full w-full object-cover object-center"
            fallbackClassName="bg-gradient-to-br from-[#c9a96a] to-[#8a6a3a]"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[#1C2624]/62" />
        <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-24 md:px-8 md:py-32">
          <Reveal className="max-w-[40ch]">
            <h2 className="font-grotesk text-[2rem] font-semibold leading-[1.14] text-[#F4F0E6] md:text-[2.7rem]">
              „Dýrindis bakkelsi sem bakað er á staðnum.“
            </h2>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-[#F4F0E6]/80">
              Heimabakstur er hluti af daglegu lífi í búðinni. Lyktin af nýbökuðu tekur á móti
              þér um leið og þú gengur inn.
            </p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F4F0E6]/70">
              Mynd til skýringar, ekki af bakkelsi Kauptúns
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ 5 · SAGA (story, split) ============ */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <PhotoReveal
            src={IMG.owners}
            alt="Berghildur Fanney Oddsson Hauksdóttir og Eyjólfur Sigurðsson, núverandi eigendur Kauptúns, standa saman fyrir utan verslunina árið 2020."
            wrapClass="aspect-[4/3] rounded-2xl"
          />
          <div>
            <Reveal>
              <h2 className="font-grotesk text-[2.2rem] font-bold leading-[1.1] md:text-[2.9rem]">
                Búð sem varð að vera áfram opin.
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#1C2624]/75">
                <p>
                  Árni Róbertsson stofnaði Kauptún árið 1988 og rak verslunina í rúm 30 ár áður
                  en hann settist í helgan stein. Árið 2020 tóku Berghildur Fanney Oddsson
                  Hauksdóttir og Eyjólfur Sigurðsson við og héldu nafninu og rekstrinum gangandi
                  á eigin vegum.
                </p>
                <p>
                  Í janúar 2021 hlaut Kauptún 5,2 milljóna króna styrk úr byggðaáætlun, ætlaðan
                  verslunum í dreifðum byggðum. Búðin hefur verið starfrækt samfleytt í 38 ár.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 border-l-2 border-[#B8432A] pl-6">
              <p className="font-grotesk text-lg font-medium leading-snug text-[#1C2624]">
                „{QUOTES.story}“
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-[#1C2624]/70">
                „{QUOTES.storyTwo}“
              </p>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#4B6670]">
                {QUOTES.attribution} · {QUOTES.source}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 6 · ÞVÍ HÉR BÚA ~650 MANNS (emotional core + signature) ============ */}
      <section ref={coreRef} className="bg-[#1C2624] py-24 text-[#F4F0E6] md:py-36">
        <div className="mx-auto max-w-[1000px] px-5 md:px-8">
          <h2 className="sr-only">Því hér býr fólk</h2>
          <Reveal amount={0.4}>
            <blockquote className="font-grotesk text-[2.3rem] font-bold leading-[1.12] tracking-[-0.01em] md:text-[3.6rem]">
              „Hér verði að vera búð, því hér búa{' '}
              <span className="text-[#E0A08c]">650 manns</span>.“
            </blockquote>
          </Reveal>

          {/* the one scroll-drawn signature: an accent rule that fills as you pass */}
          <motion.div
            aria-hidden="true"
            className="mt-8 h-[2px] w-full origin-left bg-[#B8432A]"
            style={{ scaleX: reduced ? 1 : ruleScaleX }}
          />

          <Reveal amount={0.4} delay={0.05}>
            <p className="mt-10 max-w-[46ch] text-lg leading-relaxed text-[#F4F0E6]/80 md:text-xl">
              „{QUOTES.bigTwo}“
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F4F0E6]/45">
              {QUOTES.attribution} · {QUOTES.source}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ 7 · HÖFNIN OG ÞORPIÐ (local context) ============ */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Reveal className="max-w-[34ch]">
          <h2 className="font-grotesk text-[2.2rem] font-bold leading-[1.1] md:text-5xl">
            Lítið fiskiþorp á Austurlandi, um 650 íbúar.
          </h2>
          <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-[#1C2624]/70">
            Vopnafjörður liggur við fjörðinn þar sem bátar landa við bryggjuna og húsin raða sér
            eftir strandlengjunni. Kauptún er búðin sem allt þetta samfélag reiðir sig á.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-12 md:gap-5">
          <PhotoReveal
            src={IMG.harbor}
            alt="Fiskibátur landar afla við höfnina á Vopnafirði, húsin og hlíðin í baksýn."
            wrapClass="aspect-[16/10] rounded-2xl md:col-span-8"
          />
          <PhotoReveal
            src={IMG.church}
            alt="Hvíta timburkirkjan á Vopnafirði með rauðum listum og turni undir bláum himni."
            wrapClass="aspect-[4/5] rounded-2xl md:col-span-4 md:aspect-auto"
          />
          <PhotoReveal
            src={IMG.coastline}
            alt="Strandlengjan á Vopnafirði, grænar hlíðar, rautt þak og hús við gráan sjó."
            wrapClass="aspect-[21/9] rounded-2xl md:col-span-12"
          />
        </div>
      </section>

      {/* ============ 8 · HAGNÝTAR UPPLÝSINGAR (practical info) ============ */}
      <section id="hagnytt" className="bg-[#E7DFC9]">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.22em] text-[#9A3720]">
              Hagnýtar upplýsingar
            </p>
            <h2 className="font-grotesk text-[2.4rem] font-bold leading-[1.08] md:text-5xl">
              Hvar við erum og hvenær opið er.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
            <div className="space-y-8">
              <Reveal>
                <a href={CONTACT.phoneHref} className="group block">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#4B6670]">
                    Sími
                  </span>
                  <span className="mt-2 flex items-center gap-3 font-grotesk text-4xl font-bold text-[#1C2624] transition-colors group-hover:text-[#B8432A] md:text-5xl">
                    <Phone className="h-7 w-7 text-[#B8432A]" aria-hidden="true" />
                    {CONTACT.phone}
                  </span>
                </a>
              </Reveal>

              <Reveal delay={0.05}>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#4B6670]">
                  Heimilisfang
                </span>
                <p className="mt-2 flex items-start gap-3 font-grotesk text-2xl font-semibold text-[#1C2624]">
                  <MapPin className="mt-1 h-6 w-6 shrink-0 text-[#B8432A]" aria-hidden="true" />
                  <span>
                    {CONTACT.address}
                    <br />
                    {CONTACT.postal}
                  </span>
                </p>
                <a
                  href={CONTACT.mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 py-2 font-mono text-[12px] uppercase tracking-[0.12em] text-[#9A3720] underline underline-offset-4"
                >
                  Opna í kortum
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </Reveal>

              <Reveal delay={0.1}>
                <a href={`mailto:${CONTACT.email}`} className="group inline-block">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#4B6670]">
                    Netfang
                  </span>
                  <span className="mt-2 flex items-center gap-3 font-grotesk text-xl font-semibold text-[#1C2624] transition-colors group-hover:text-[#B8432A]">
                    <Mail className="h-5 w-5 text-[#B8432A]" aria-hidden="true" />
                    {CONTACT.email}
                  </span>
                </a>
              </Reveal>

              <Reveal delay={0.12}>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#4B6670]">
                  Opnunartími
                </span>
                <dl className="mt-3 divide-y divide-[#1C2624]/10 border-t border-[#1C2624]/10">
                  {HOURS.map((row) => (
                    <div key={row.label} className="flex items-baseline justify-between py-2.5">
                      <dt className="text-[15px] text-[#1C2624]/75">{row.label}</dt>
                      <dd
                        className={`font-mono text-sm ${
                          row.open === null ? 'text-[#9A3720]' : 'text-[#1C2624]'
                        }`}
                      >
                        {row.display}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <Reveal delay={0.08} className="min-h-[340px]">
              <div className="h-full min-h-[340px] overflow-hidden rounded-2xl ring-1 ring-[#1C2624]/10">
                <iframe
                  title="Kort af Kauptúni, Hafnarbyggð 4, Vopnafirði"
                  src="https://maps.google.com/maps?q=Kaupt%C3%BAn%20Hafnarbygg%C3%B0%204%20Vopnafj%C3%B6r%C3%B0ur&z=14&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[340px] w-full border-0"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 9 · LOKAORÐ (closing mood band) ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Img
            src={IMG.coast}
            alt="Öldur brotna við dökka kletta, stemningsmynd af Norður-Atlantshafi."
            className="h-full w-full object-cover object-center"
            fallbackClassName="bg-gradient-to-br from-[#4B6670] to-[#1C2624]"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[#141b1a]/70" />
        <div className="relative z-10 mx-auto max-w-[1000px] px-5 py-28 text-center md:px-8 md:py-40">
          <Reveal>
            <h2 className="font-grotesk text-[2.6rem] font-bold leading-[1.06] text-[#F4F0E6] md:text-6xl">
              Sjáumst í Kauptúni.
            </h2>
            <p className="mx-auto mt-6 max-w-[42ch] text-[15px] leading-relaxed text-[#F4F0E6]/80 md:text-base">
              Fyrsta vefsíðan okkar, gerð svo hver sem er, hvort sem hann býr á Vopnafirði eða er
              á leiðinni þangað, sjái strax hvað er í búðinni og hvenær opið er.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={CONTACT.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B8432A] px-6 py-3.5 text-[15px] font-semibold text-[#F4F0E6] shadow-[0_10px_30px_-8px_rgba(184,67,42,0.6)] transition-transform active:scale-[0.97]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Hringja · {CONTACT.phone}
              </a>
              <a
                href={CONTACT.mapsHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[15px] font-medium text-[#F4F0E6] ring-1 ring-[#F4F0E6]/40 transition-colors hover:bg-[#F4F0E6]/10"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                {CONTACT.address}, {CONTACT.postal}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <PreviewFooter company={company} />

      {/* ============ mobile sticky CTA ============ */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1C2624]/10 bg-[#F4F0E6]/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-3">
          <a
            href={CONTACT.phoneHref}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#B8432A] py-3 text-[15px] font-semibold text-[#F4F0E6] transition-transform focus-visible:outline-[#1C2624] active:scale-[0.98]"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Hringja
          </a>
          <a
            href={CONTACT.mapsHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-medium text-[#1C2624] ring-1 ring-[#1C2624]/20 transition-transform active:scale-[0.98]"
          >
            <Navigation className="h-4 w-4 text-[#B8432A]" aria-hidden="true" />
            Leiðarlýsing
          </a>
        </div>
      </div>
    </div>
  )
}
