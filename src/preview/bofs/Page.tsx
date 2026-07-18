/**
 * Öruggt skjól — landing page.
 * A warm, honest hub for every service under Barna- og fjölskyldustofa.
 *
 * Section order is one narrative arc of light: dawn cream, daylight services,
 * the one white official-notice band (tilkynningarskylda), warm afternoon,
 * the deep honest pause, resolution, then a dusk valley into the night footer.
 * Native scroll only; every reveal is transform/opacity and reduced-motion safe.
 */

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Reveal } from '../../components/Reveal'
import { setThemeColor } from '../../lib/preview'
import { BofsStyles, Button, C, Eyebrow, Footer, Header, SectionHead, ServiceCard, useLang, Arrow } from './ui'
import { ValleyScene, ValueIcon, WaveDivider, HillDivider } from './illustrations'
import { GALLERY, HERO, HONEST, PATH, SERVICES, UI, VALUES, CATEGORIES } from './data'
import { Img } from '../../components/Img'
import { asset } from './ui'
import {
  AboutTeaser,
  DuskBookend,
  FaqList,
  FosterBand,
  HelpBand,
  InstitutionsAndClose,
  ReportBand,
  StatsBand,
  WayfinderDoors,
} from './sections'

export default function BofsPage() {
  const [, , pick] = useLang()
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Öruggt skjól | Barna- og fjölskyldustofa'
    setThemeColor(C.cream)
  }, [])

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const valleyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const homes = SERVICES.filter((s) => s.category === 'heimili')
  const services = SERVICES.filter((s) => s.category === 'thjonusta')

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <a href="#main" className="sr-only focus:not-sr-only">
        {pick(UI.skipToContent)}
      </a>

      <main id="main">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden">
          <motion.div style={{ y: valleyY, willChange: 'transform' }} className="pointer-events-none absolute inset-0 -z-10">
            <ValleyScene className="absolute inset-x-0 bottom-0 h-full w-full" />
            <div className="absolute inset-x-0 top-0 h-1/2" style={{ background: `linear-gradient(${C.cream}, rgba(251,243,231,0))` }} />
          </motion.div>

          <motion.div style={{ y: contentY, opacity: contentOpacity, willChange: 'transform, opacity' }} className="mx-auto w-full max-w-6xl px-5 pb-40 pt-28 sm:px-8">
            <div className="max-w-2xl">
              <Reveal y={16}>
                <span className="bofs-hand text-[26px] leading-none" style={{ color: C.clayText }}>
                  {pick({ is: 'velkomin', en: 'welcome' })}
                </span>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="bofs-display bofs-display-xl bofs-balance mt-1 text-[clamp(40px,8vw,76px)]">{pick(HERO.title)}</h1>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="bofs-pretty mt-6 max-w-xl text-[clamp(17px,2.2vw,21px)] leading-relaxed" style={{ color: C.body }}>
                  {pick(HERO.lead)}
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button href="#heimili" icon={<Arrow />}>
                    {pick(HERO.ctaPrimary)}
                  </Button>
                  <Button href="#path" variant="soft">
                    {pick(HERO.ctaSecondary)}
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold" style={{ background: '#fff', color: C.cocoa, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                  <span className="grid h-6 w-6 place-items-center rounded-full bofs-num text-[12px] font-bold text-white" style={{ background: '#A83A24' }}>
                    112
                  </span>
                  {pick(HERO.reassure)}
                </div>
              </Reveal>
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-6 mx-auto flex w-fit flex-col items-center gap-1 text-[12px] font-semibold uppercase tracking-widest"
            style={{ color: C.body, opacity: contentOpacity }}
          >
            <span>{pick({ is: 'skoðaðu', en: 'scroll' })}</span>
            <span className="bofs-float block h-8 w-5 rounded-full" style={{ boxShadow: `inset 0 0 0 1.5px ${C.body}` }}>
              <span className="mx-auto mt-1.5 block h-1.5 w-1.5 rounded-full" style={{ background: C.body }} />
            </span>
          </motion.div>
        </section>

        {/* ── WAYFINDER (three doors) ──────────────────────────────────── */}
        <WayfinderDoors />

        {/* ── MISSION + compressed values ─────────────────────────────── */}
        <section className="relative" style={{ background: C.cream2 }}>
          <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <Reveal>
              <Eyebrow>{pick({ is: 'Eitt net af hlýju', en: 'One warm network' })}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="bofs-statement bofs-balance mx-auto mt-5 max-w-3xl">
                {pick({
                  is: 'Á bak við hvert úrræði er sama hugsun: að ekkert barn eigi að standa eitt. Hér höldum við utan um þau öll.',
                  en: 'Behind every service is the same idea: no child should stand alone. Here, we hold all of them.',
                })}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-4">
                {VALUES.map((v, i) => (
                  <span key={v.key} className="inline-flex items-center gap-2.5">
                    <ValueIcon name={v.icon} color={[C.clay, C.rose, C.sage, C.sun][i % 4]} className="h-6 w-6" />
                    <span className="text-[15px] font-bold" style={{ color: C.cocoa }}>
                      {pick(v.title)}
                    </span>
                    <span className="hidden text-[14px] lg:inline" style={{ color: C.body }}>
                      {pick(v.body).split('.')[0]}
                    </span>
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── TREATMENT HOMES ──────────────────────────────────────────── */}
        <section id="heimili" className="scroll-mt-24" style={{ background: C.cream }}>
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <SectionHead eyebrow={pick(CATEGORIES[0].title)} title={pick({ is: 'Örugg heimili þegar þeirra er þörf', en: 'Safe homes, when they’re needed' })} lead={pick(CATEGORIES[0].blurb)} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {homes.map((s, i) => (
                <ServiceCard key={s.slug} service={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FAMILY & SUPPORT SERVICES ────────────────────────────────── */}
        <section id="thjonusta" className="scroll-mt-24" style={{ background: C.oat }}>
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <SectionHead
              eyebrow={pick(CATEGORIES[1].title)}
              title={pick({ is: 'Stuðningur sem kemur til fjölskyldunnar', en: 'Support that comes to the family' })}
              lead={pick(CATEGORIES[1].blurb)}
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s, i) => (
                <ServiceCard key={s.slug} service={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── PATH (3 steps) ───────────────────────────────────────────── */}
        <section id="path" className="scroll-mt-24" style={{ background: C.cream }}>
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <SectionHead eyebrow={pick({ is: 'Fyrsta skrefið', en: 'The first step' })} title={pick(PATH.title)} lead={pick(PATH.lead)} align="center" />
            <div className="relative mt-14 grid gap-6 md:grid-cols-3">
              <div className="pointer-events-none absolute left-0 right-0 top-9 hidden md:block" style={{ borderTop: `2px dashed ${C.line}` }} />
              {PATH.steps.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.1}>
                  <div className="relative flex h-full flex-col rounded-[26px] p-7" style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                    <span className="bofs-display grid h-16 w-16 place-items-center rounded-2xl text-[28px] text-white" style={{ background: [C.terra, C.sage, C.sun][i] }}>
                      {step.n}
                    </span>
                    <h3 className="bofs-display bofs-display-sm mt-5 text-[21px]">{pick(step.title)}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.body }}>
                      {pick(step.body)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TILKYNNINGARSKYLDA (the one white band) ──────────────────── */}
        <ReportBand />

        {/* ── NATIONAL STATISTICS ──────────────────────────────────────── */}
        <StatsBand />

        {/* ── WARMTH GALLERY ───────────────────────────────────────────── */}
        <section style={{ background: C.cream }}>
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <SectionHead eyebrow={pick(GALLERY.eyebrow)} title={pick(GALLERY.title)} lead={pick(GALLERY.lead)} align="center" />
            <div className="mt-12 grid grid-cols-2 gap-4 lg:h-[540px] lg:grid-cols-4 lg:grid-rows-2">
              {GALLERY.photos.map((p, i) => (
                <Reveal
                  key={p.src}
                  delay={i * 0.08}
                  className={i === 0 ? 'col-span-2 lg:col-span-2 lg:row-span-2' : i === 1 ? 'col-span-2 lg:col-span-2' : 'col-span-1'}
                >
                  <figure className="group relative h-full overflow-hidden rounded-[26px]" style={{ boxShadow: `0 30px 56px -44px rgba(58,44,34,.6)` }}>
                    <Img
                      src={asset(p.src)}
                      alt={pick(p.alt)}
                      className={`bofs-photo w-full object-cover transition-transform duration-700 group-hover:scale-105 ${i === 0 ? 'h-56 lg:h-full' : i === 1 ? 'h-44 lg:h-full' : 'h-40 lg:h-full'}`}
                      fallbackClassName="bg-gradient-to-br from-[#EAD6B4] to-[#C2D8BC]"
                    />
                    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1.5 p-4 text-[13px] font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" style={{ background: 'linear-gradient(transparent, rgba(58,44,34,.7))' }}>
                      {pick(p.alt)}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT TEASER + history stones ────────────────────────────── */}
        <AboutTeaser />
        <WaveDivider color={C.deep} className="block w-full" />

        {/* ── HONEST-HOPE BAND (the one deep pause) ────────────────────── */}
        <section style={{ background: C.deep }}>
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <SectionHead eyebrow={pick(HONEST.kicker)} title={pick(HONEST.title)} onDeep />
            </div>
            <Reveal delay={0.1}>
              <div className="rounded-[28px] p-8" style={{ background: 'rgba(255,255,255,.06)', boxShadow: 'inset 0 0 0 1px rgba(246,232,213,.14)' }}>
                <p className="text-[17px] leading-relaxed" style={{ color: 'rgba(246,232,213,.9)' }}>
                  {pick(HONEST.body)}
                </p>
                <p className="bofs-hand mt-5 text-[24px]" style={{ color: C.sun }}>
                  {pick({ is: 'af því að börnin eiga það skilið', en: 'because children deserve it' })}
                </p>
              </div>
            </Reveal>
          </div>
          <HillDivider color={C.cream} className="block w-full" />
        </section>

        {/* ── FOSTER INVITATION ────────────────────────────────────────── */}
        <FosterBand />

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <FaqList />

        {/* ── HELP / CONTACT ───────────────────────────────────────────── */}
        <HelpBand />

        {/* ── RELATED INSTITUTIONS + CLOSING ───────────────────────────── */}
        <InstitutionsAndClose />

        {/* ── DUSK VALLEY → NIGHT FOOTER ───────────────────────────────── */}
        <DuskBookend />
      </main>

      <Footer />
    </div>
  )
}
