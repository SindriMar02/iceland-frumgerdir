/**
 * Öruggt skjól — the landing page's own chapters (rebuilt 2026-09-17).
 *
 * The first landing stacked the same block eleven times: label, serif title,
 * lead, a row of rounded white cards, a beige band, repeat. Every section had
 * the same width, the same weight and the same shape, so the page read as a
 * template even though each block was fine on its own.
 *
 * This file replaces that rhythm with eight chapters that alternate between
 * two registers the paintings and the interface already speak:
 *
 *   shelter   watercolour, serif, feeling      hero · story · service cards
 *   guidance  white, sans, numbers, actions    entrances · process · help
 *
 * Rules that hold across all of them: no two chapters share a layout family,
 * at most one white card surface on the page (the help panel), section titles
 * carry no eyebrow, and every reveal is transform/opacity and reduced-motion
 * safe. Native scroll only, as before.
 *
 * Imagery honesty: the three Lækjarbakki photographs are real. Every other
 * photograph in these chapters is an AI-generated PLACEHOLDER that stands in
 * for the kind of picture the agency would need to shoot, and is labelled as
 * such in its caption and with data-placeholder="ai". Nothing here pretends
 * to be a BOFS photograph that is not one.
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Img } from '../../components/Img'
import { asset, Button, C, Handwritten, SectionHead, ServiceCard, useLang } from './ui'
import { ABOUT_TEASER, CATEGORIES, HELP, HERO, HONEST, INSTITUTIONS, NEWS, ORG, PATH, REPORT, SERVICES, type L } from './data'

const t = (is: string, en: string): L => ({ is, en })

/* ── placeholders: AI-generated stand-ins, always labelled ───────────── */

/*
 * These four files were generated on 2026-09-17 (Higgsfield, Nano Banana 2)
 * to show the kind of documentary photograph the real site needs: ordinary
 * rooms and grounds of a treatment home, an adult's hands, a colleague seen
 * from behind. No children, no faces. They are to be replaced by the
 * agency's own photographs before anything ships.
 */
const PLACEHOLDER = {
  table: 'ph-kitchen-table.jpg',
  shoes: 'ph-shoes-doorway.jpg',
  hands: 'ph-hands-bed.jpg',
  grounds: 'ph-staff-grounds.jpg',
}

function PlaceholderTag() {
  const [, , pick] = useLang()
  return <span> {pick({ is: '(Sýnishorn, gervimynd.)', en: '(Placeholder, AI image.)' })}</span>
}

function Caption({ children, placeholder = false }: { children: string; placeholder?: boolean }) {
  return (
    <figcaption className="mt-3 text-[13.5px] leading-snug" style={{ color: C.body }}>
      {children}
      {placeholder && <PlaceholderTag />}
    </figcaption>
  )
}

/* ── torn paper, and the chapter marker ───────────────────────────────── */

/*
 * decriminalizepoverty.org (Awwwards SOTD, an institutional illustrated
 * site) changes ground colour per chapter and joins the chapters with a
 * torn paper edge instead of a straight seam. The jitter here is a fixed
 * sequence so every render tears the same way.
 */
const TORN = (() => {
  const pts: string[] = []
  let x = 0
  let seed = 7
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  while (x < 1440) {
    pts.push(`L${x.toFixed(0)} ${(6 + rnd() * 16).toFixed(1)}`)
    x += 14 + rnd() * 30
  }
  return `M0 28 L0 12 ${pts.join(' ')} L1440 10 L1440 28 Z`
})()

function Torn({ color, className = '' }: { color: string; className?: string }) {
  return (
    <svg className={`block h-6 w-full sm:h-7 ${className}`} viewBox="0 0 1440 28" preserveAspectRatio="none" aria-hidden="true">
      <path d={TORN} fill={color} />
    </svg>
  )
}

/**
 * A small fixed line at the foot of the sheet: which chapter you are in,
 * and how far down the page. The sub-nav pills this replaces were chrome;
 * this is a page number.
 */
export function ChapterMark({ chapters }: { chapters: { id: string; label: string }[] }) {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const idKey = chapters.map((c) => c.id).join('|')
  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const on = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (on) setActive(chapters.findIndex((c) => c.id === on.target.id))
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.1, 0.5] },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKey])
  const c = chapters[Math.max(0, active)]
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden sm:block" aria-hidden="true">
      <div className="mx-auto flex max-w-6xl items-end justify-between px-5 pb-4 sm:px-8">
        <span className="bofs-num text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: C.cocoa }}>
          {active + 1} / {chapters.length} · {c?.label}
        </span>
        <span className="relative block h-[2px] w-40 overflow-hidden" style={{ background: 'rgba(58,44,34,.16)' }}>
          <motion.span className="absolute inset-0 origin-left" style={{ background: C.clay, scaleX: reduce ? 1 : scrollYProgress }} />
        </span>
      </div>
    </div>
  )
}

/* ── 1. Hero: the original composition, simplified ─────────────────────── */

/*
 * The first hero was the strongest thing on the site and the brief said so:
 * keep it almost exactly. Two recuts that moved the type (into the sky, then
 * below the painting as a cover) were both worse. So this is the original
 * again: the valley full-screen, a cream wash on the left for the type, the
 * lit house on the right. Only what the brief asked for is changed: the
 * second button and the 112 pill are gone (112 already sits in the header and
 * every number is in the help panel), the mist drifts, and the type is the new
 * grotesk.
 */
export function Hero() {
  const [, , pick] = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // the painting is scaled 110%, so 70px of drift never exposes an edge
  const valleyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="bofs-wash relative isolate flex min-h-[100svh] flex-col overflow-hidden" style={{ background: C.cream }}>
      <motion.div style={{ y: valleyY, willChange: 'transform' }} className="pointer-events-none absolute inset-0 -z-10">
        <Img
          src={asset('art-dawn.jpg')}
          alt=""
          aria-hidden
          loading="eager"
          fetchpriority="high"
          /* The lit house sits at x≈78%, y≈56% of the painting (measured).
             A portrait phone shows only ~26% of the width under object-cover;
             84% brings the whole house into frame beside the type. */
          className="h-full w-full scale-110 object-cover object-[93%_50%] md:object-[62%_60%]"
          fallbackClassName="bg-gradient-to-b from-[#F8EAD8] via-[#EFE5D2] to-[#CFD7C4]"
        />
        {/* Mist that drifts across the valley floor. The one ambient loop on
            the site, asked for by name on 2026-09-17; transform-only, 46s,
            and it stops under reduced motion. */}
        <div className="bofs-mist" aria-hidden="true" />
        {/* legibility wash for the type block, as in the original */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(251,243,231,.95) 0%, rgba(251,243,231,.84) 30%, rgba(251,243,231,.38) 56%, rgba(251,243,231,0) 78%)' }} />
        <div className="absolute inset-x-0 top-0 h-24" style={{ background: 'linear-gradient(rgba(251,243,231,.8), rgba(251,243,231,0))' }} />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity, willChange: 'transform, opacity' }} className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-start px-5 pb-48 pt-24 sm:px-8 md:justify-center md:pb-24 md:pt-28">
        <div className="max-w-2xl">
          <p className="text-[14px] font-semibold" style={{ color: C.clayText }}>
            {pick(HERO.kicker)}
          </p>
          <h1 className="bofs-display bofs-display-xl bofs-balance mt-3 text-[clamp(40px,7.2vw,80px)]">{pick(HERO.title)}</h1>
          <p className="bofs-pretty mt-6 max-w-xl text-[clamp(17px,2vw,20px)] leading-relaxed" style={{ color: C.body }}>
            {pick(HERO.lead)}
          </p>
          <div className="mt-8">
            <Button href="#byrja">{pick(HERO.ctaPrimary)}</Button>
          </div>
        </div>
      </motion.div>

    </section>
  )
}

/* ── 2. Entrances: three ways in, three different sizes ───────────────── */

/* Chapters below carry no entrance animation: a fade-up on every section was
   itself one of the tells. The page simply is there. */

/*
 * The old wayfinder was three equal white cards with the same house icon in
 * each. The three visitors are not equal: someone who needs help now should
 * meet the biggest, warmest surface on the page; someone worried about a
 * child needs one direct sentence; a professional needs a signpost. So one
 * painted panel, one typographic block, one narrow strip.
 */
export function Entrances() {
  const [, , pick] = useLang()
  const ways = [
    { to: '#help', title: t('Ég þarf hjálp', 'I need help'), note: t('Númerin sem svara, allan sólarhringinn ef þarf.', 'The numbers that answer, around the clock if needed.') },
    { to: '#tilkynna', title: t('Ég hef áhyggjur af barni', 'I am worried about a child'), note: t('Áhyggjur duga. Þú þarft engar sannanir.', 'Concern is enough. You need no proof.') },
    { to: '/preview/bofs/kerfid', title: t('Ég vinn með börnum', 'I work with children'), note: t('Kerfið, úrræðin og lögin á bak við þau.', 'The system, the services and the law behind them.') },
  ]
  return (
    <section id="byrja" className="bofs-wash scroll-mt-24" style={{ background: C.cream }}>
      {/*
        No boxes. Three ways in, set as a table of contents in the display
        face beside the painting of the room, which dissolves into the paper
        instead of sitting in a frame. The whole line is the link; hovering
        draws an underline under it. Nothing else: no arrow, no border, no
        scrim, no card.
      */}
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="bofs-display text-[clamp(30px,4vw,46px)]">{pick({ is: 'Hvar byrjar þú?', en: 'Where do you start?' })}</h2>
          <ol className="mt-8 divide-y-0">
            {ways.map((w) => {
              const inner = (
                <>
                  <span className="bofs-display bofs-way block text-[clamp(28px,3.3vw,40px)]">{pick(w.title)}</span>
                  <span className="mt-2 block text-[16.5px] leading-relaxed" style={{ color: C.cocoa }}>
                    {pick(w.note)}
                  </span>
                </>
              )
              const cls = 'bofs-focus group block rounded py-5'
              return (
                <li key={w.to}>
                  {w.to.startsWith('/') ? (
                    <Link to={w.to} className={cls}>
                      {inner}
                    </Link>
                  ) : (
                    <a href={w.to} className={cls}>
                      {inner}
                    </a>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
        <div className="lg:col-span-7">
          <div className="bofs-wet">
            <Img
              src={asset('art-inni.jpg')}
              width={2560}
              height={1440}
              alt={pick({ is: 'Vatnslitamynd: borðstofuborð við glugga með útsýni yfir dalinn', en: 'Watercolour: a dining table by a window looking over the valley' })}
              className="aspect-[16/10] w-full object-cover object-[50%_45%]"
              fallbackClassName="bg-gradient-to-b from-[#F3E6CF] to-[#E4D3B4]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 3. One human story before the directory ──────────────────────────── */

/*
 * The system is easier to understand through one person than through its
 * organisation chart. One anonymous line, one photograph that overlaps it,
 * and the four words a family actually passes through. The line is an
 * example and says so in its caption: this site never invents a quote and
 * presents it as real.
 */
export function Story() {
  const [, , pick] = useLang()
  const steps = [t('Áhyggjur', 'Worry'), t('Samtal', 'A conversation'), t('Mat', 'Assessment'), t('Stuðningur', 'Support')]
  return (
    <section id="saga" className="bofs-wash scroll-mt-24" style={{ background: C.cream2 }}>
      <Torn color={C.cream2} className="-mt-6 sm:-mt-7" />
      {/*
        One story in the second person, in three beats, the way
        decriminalizepoverty.org walks its reader through a day. Big lines,
        a sentence each, one painting beside two of them, and the four words
        the road is made of. It is a made-up example and says so.
      */}
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-20">
        <Handwritten className="text-[30px] leading-none sm:text-[34px]" style={{ color: C.clayText }}>
          {pick({ is: 'Ímyndaðu þér', en: 'Imagine' })}
        </Handwritten>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="bofs-display bofs-balance text-[clamp(30px,4.4vw,56px)]" style={{ fontWeight: 500 }}>
              {pick({ is: 'að þú sért foreldri sem veit ekki hvert á að leita.', en: 'you are a parent who does not know where to turn.' })}
            </p>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed" style={{ color: C.cocoa }}>
              {pick({
                is: 'Eitthvað er ekki í lagi heima, í skólanum eða með vinum. Þú hefur beðið of lengi eftir réttu orðunum.',
                en: 'Something is not right at home, at school or with friends. You have waited too long for the right words.',
              })}
            </p>
          </div>
          <div className="bofs-wet lg:col-span-6">
            <Img
              src={asset('art-plass.jpg')}
              srcSet={`${asset('art-plass-1000.jpg')} 1000w, ${asset('art-plass.jpg')} 1800w`}
              sizes="(min-width: 1024px) 560px, 100vw"
              width={1800}
              height={1350}
              alt={pick({ is: 'Vatnslitamynd: eldhús að kvöldi, borðið lagt, auður stóll með teppi', en: 'Watercolour: a kitchen in the evening, the table laid, an empty chair with a blanket' })}
              className="aspect-[4/3] w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#EAD6B4] to-[#C2D8BC]"
            />
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-3xl text-center sm:mt-28">
          <p className="bofs-display bofs-balance text-[clamp(30px,4.4vw,56px)]" style={{ fontWeight: 500 }}>
            {pick({ is: 'Þú hringir eitt símtal.', en: 'You make one phone call.' })}
          </p>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed" style={{ color: C.cocoa }}>
            {pick({
              is: 'Barnavernd í þínu sveitarfélagi hlustar, kynnist stöðunni og finnur með ykkur hvaða stuðningur á best við. Þjónustan kostar ekkert.',
              en: 'Child protection in your municipality listens, gets to know the situation and finds with you the support that fits. The service is free.',
            })}
          </p>
        </div>

        <div className="mt-20 grid items-center gap-10 sm:mt-28 lg:grid-cols-12 lg:gap-16">
          <div className="bofs-wet order-2 lg:order-1 lg:col-span-6">
            <Img
              src={asset('art-kerfid.jpg')}
              srcSet={`${asset('art-kerfid-1600.jpg')} 1600w, ${asset('art-kerfid.jpg')} 3024w`}
              sizes="(min-width: 1024px) 560px, 100vw"
              width={3024}
              height={1296}
              alt={pick({ is: 'Vatnslitamynd: vegur liggur um dal að húsi með ljós í glugga', en: 'Watercolour: a road runs through a valley to a house with a light in the window' })}
              className="aspect-[16/9] w-full object-cover object-[60%_60%]"
              fallbackClassName="bg-gradient-to-br from-[#EAD6B4] to-[#C2D8BC]"
            />
          </div>
          <div className="order-1 lg:order-2 lg:col-span-6">
            <p className="bofs-display bofs-balance text-[clamp(30px,4.4vw,56px)]" style={{ fontWeight: 500 }}>
              {pick({ is: 'Rétta úrræðið tekur við. Og fylgir ykkur heim.', en: 'The right service steps in. And follows you home.' })}
            </p>
            <ol className="mt-8 flex flex-wrap items-center gap-y-3">
              {steps.map((s, i) => (
                <li key={s.is} className="flex items-center">
                  <span className="bofs-display whitespace-nowrap text-[clamp(17px,1.7vw,22px)]" style={{ fontWeight: 500 }}>
                    {pick(s)}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="mx-3 w-7 sm:w-9" aria-hidden="true">
                      <span className="bofs-rule" />
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[13.5px]" style={{ color: C.body }}>
              {pick({
                is: 'Dæmisaga um leið sem margar fjölskyldur fara. Ekki raunverulegt mál.',
                en: 'An example of a road many families travel. Not a real case.',
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 4. The services, by category (as before) ────────────────────────── */

/*
 * Two category sections with the painted service cards, exactly the shape
 * the first landing had. A numbered flip-through index was tried on
 * 2026-09-17 and rejected: the categories are what a visitor thinks in
 * (a safe home, or support that comes to the family), and the cards let all
 * nine services be seen and compared at once.
 */
export function ServiceCategories() {
  const [, , pick] = useLang()
  const homes = SERVICES.filter((s) => s.category === 'heimili')
  const services = SERVICES.filter((s) => s.category === 'thjonusta')
  return (
    <>
      <section id="heimili" className="bofs-wash scroll-mt-24" style={{ background: C.cream }}>
        <Torn color={C.cream} className="-mt-6 sm:-mt-7" />
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pb-28 sm:pt-20">
          <SectionHead eyebrow={pick(CATEGORIES[0].title)} title={pick({ is: 'Örugg heimili þegar þeirra er þörf', en: 'Safe homes, when they’re needed' })} lead={pick(CATEGORIES[0].blurb)} />
          {/* five paintings, set on the page, no frames */}
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {homes.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section id="thjonusta" className="bofs-wash scroll-mt-24" style={{ background: C.oat }}>
        <Torn color={C.oat} className="-mt-6 sm:-mt-7" />
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pb-28 sm:pt-20">
          <SectionHead
            eyebrow={pick(CATEGORIES[1].title)}
            title={pick({ is: 'Stuðningur sem kemur til fjölskyldunnar', en: 'Support that comes to the family' })}
            lead={pick(CATEGORIES[1].blurb)}
          />
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ── 5. How help works: the one drawn line ────────────────────────────── */

/*
 * Guidance mode: white ground, sans, four steps that really are a sequence.
 * The line between them draws itself as the reader scrolls, from a dark
 * doorway to a lit window, which is the whole concept of the site in one
 * stroke. Scrubbed on scroll, transform-free (pathLength only), and drawn in
 * full under reduced motion.
 */
export function Process() {
  const [, , pick] = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })
  const drawn = useTransform(scrollYProgress, [0, 1], [0, 1])
  const steps = [
    ...PATH.steps.map((s) => ({ title: s.title, body: s.body })),
    {
      title: t('Fjölskyldan fær eftirfylgd', 'The family is followed up'),
      body: t(
        'Stuðningurinn hættir ekki þegar meðferð lýkur. Barnavernd og úrræðið fylgja fjölskyldunni eftir heim.',
        'Support does not end when treatment ends. Child protection and the service follow the family home.',
      ),
    },
  ]

  return (
    <section id="ferli" className="scroll-mt-24" style={{ background: '#FFFFFF' }}>
      <Torn color="#FFFFFF" className="-mt-6 sm:-mt-7" />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
        <div>
          <h2 className="bofs-display max-w-2xl text-[clamp(30px,4.6vw,52px)]">{pick({ is: 'Hvernig hjálpin virkar', en: 'How help works' })}</h2>
          <p className="bofs-pretty mt-4 max-w-xl text-[16.5px] leading-relaxed" style={{ color: C.body }}>
            {pick({
              is: 'Fjögur skref, í þessari röð. Barnaverndarþjónusta í þínu sveitarfélagi er alltaf fyrsti viðkomustaðurinn og þjónustan kostar ekkert.',
              en: 'Four steps, in this order. The child protection service in your municipality is always the first stop, and the service is free.',
            })}
          </p>
        </div>

        <div ref={ref} className="relative mt-14">
          {/* one straight rule that draws itself as the reader reaches it */}
          <svg className="absolute inset-x-0 top-0 hidden h-2 w-full md:block" viewBox="0 0 1200 2" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M0 1 H1200" fill="none" stroke={C.clay} strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ pathLength: reduce ? 1 : drawn }} />
          </svg>
          <svg className="absolute bottom-0 left-2 top-0 w-8 md:hidden" viewBox="0 0 32 800" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M16 14 V 786" fill="none" stroke={C.clay} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength: reduce ? 1 : drawn }} />
          </svg>

          <ol className="grid gap-10 pl-12 md:grid-cols-4 md:gap-8 md:pl-0 md:pt-12">
            {steps.map((s, i) => (
              <div key={s.title.is}>
                <li className="relative">
                  <span className="bofs-display bofs-num absolute -left-12 top-0 block text-[28px] leading-none md:static md:mb-4" style={{ color: C.clay }}>
                    {i + 1}
                  </span>
                  <h3 className="text-[19px] font-bold leading-snug" style={{ color: C.cocoa }}>
                    {pick(s.title)}
                  </h3>
                  <p className="bofs-pretty mt-2 text-[15px] leading-relaxed" style={{ color: C.body }}>
                    {pick(s.body)}
                  </p>
                </li>
              </div>
            ))}
          </ol>
        </div>

        <p className="mt-14 text-[17px]">
          <Link to="/preview/bofs/kerfid" className="bofs-focus group rounded">
            <span className="bofs-way font-semibold" style={{ color: C.clayText }}>
              {pick({ is: 'Lesa um allt ferlið', en: 'Read about the whole process' })}
            </span>
          </Link>
        </p>
      </div>
    </section>
  )
}

/* ── 6. Ordinary places: real photographs break the painted world ─────── */

/*
 * Too many paintings and the agency starts to feel imaginary. This chapter
 * is photographs only. The three Lækjarbakki pictures are real; the rest
 * are labelled placeholders for the shoot the agency would do itself:
 * a kitchen table, hands making a bed, a colleague crossing the grounds.
 * No staged smiles, no children.
 */
export function Grounds() {
  const [, , pick] = useLang()
  return (
    <section id="stadir" className="bofs-wash scroll-mt-24" style={{ background: C.cream }}>
      <Torn color={C.cream} className="-mt-6 sm:-mt-7" />
      <div className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 sm:pt-20">
        <div>
          <h2 className="bofs-display max-w-2xl text-[clamp(30px,4.6vw,52px)]">{pick({ is: 'Venjulegir staðir, venjulegir dagar', en: 'Ordinary places, ordinary days' })}</h2>
          <p className="bofs-pretty mt-4 max-w-xl text-[16.5px] leading-relaxed" style={{ color: C.body }}>
            {pick({
              is: 'Meðferðarheimili er fyrst og fremst heimili. Morgunmatur, herbergi sem er tekið til, gönguferð. Það er í þessum smáu hlutum sem öryggið býr.',
              en: 'A treatment home is first of all a home. Breakfast, a room made ready, a walk. Safety lives in these small things.',
            })}
          </p>
        </div>
      </div>

      {/* the one full-bleed photograph, and it is a real one */}
      <div className="mt-12">
        <figure>
          <Img
            src={asset('laekjarbakki-hus.jpg')}
            width={1920}
            height={1440}
            srcSet={`${asset('laekjarbakki-hus-1000.jpg')} 1000w, ${asset('laekjarbakki-hus.jpg')} 1920w`}
            sizes="100vw"
            alt={pick({ is: 'Meðferðarheimilið Lækjarbakki í Gunnarsholti að vetri', en: 'The Lækjarbakki treatment home in Gunnarsholt in winter' })}
            className="bofs-photo h-[52vw] max-h-[680px] min-h-[280px] w-full object-cover"
            fallbackClassName="bg-gradient-to-br from-[#EAD6B4] to-[#C2D8BC]"
          />
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Caption>{pick({ is: 'Lækjarbakki í Gunnarsholti, opnað í maí 2026. Ljósmynd frá heimilinu.', en: 'Lækjarbakki in Gunnarsholt, opened May 2026. Photograph from the home.' })}</Caption>
          </div>
        </figure>
      </div>

      <div className="mx-auto grid max-w-6xl gap-x-6 gap-y-10 px-5 pb-20 pt-12 sm:grid-cols-2 sm:px-8 sm:pb-28">
        {[
          { src: PLACEHOLDER.table, w: 1920, h: 1071, ph: true, alt: t('Eldhúsborð með tveimur bollum og ullarteppi á stólbaki', 'A kitchen table with two mugs and a wool blanket on a chair'), cap: t('Eldhúsborðið, þar sem flest samtöl byrja.', 'The kitchen table, where most conversations begin.') },
          { src: PLACEHOLDER.hands, w: 966, h: 1200, ph: true, alt: t('Hendur slétta sæng á rúmi í björtu herbergi', 'Hands smoothing a duvet on a bed in a bright room'), cap: t('Herbergi tekið til fyrir þann sem kemur.', 'A room made ready for whoever is arriving.') },
          { src: PLACEHOLDER.grounds, w: 1400, h: 939, ph: true, alt: t('Starfsmaður gengur eftir malarstíg við lágreist hvítt hús', 'A staff member walking along a gravel path by a low white house'), cap: t('Gengið um lóðina.', 'Crossing the grounds.') },
          { src: 'laekjarbakki-tonlist.jpg', w: 1920, h: 1440, ph: false, alt: t('Tónlistarherbergi á Lækjarbakka', 'The music room at Lækjarbakki'), cap: t('Tónlistarherbergið á Lækjarbakka. Ljósmynd frá heimilinu.', 'The music room at Lækjarbakki. Photograph from the home.') },
        ].map((f) => (
          <figure key={f.src}>
            <Img
              src={asset(f.src)}
              width={f.w}
              height={f.h}
              data-placeholder={f.ph ? 'ai' : undefined}
              alt={pick(f.alt)}
              className="bofs-photo aspect-[3/2] w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#EAD6B4] to-[#C2D8BC]"
            />
            <Caption placeholder={f.ph}>{pick(f.cap)}</Caption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ── 7. Help, as an instrument: one panel, every number ───────────────── */

/*
 * The old page repeated help information in five places. This is the one.
 * A utility panel: label on the left, the number set large on the right,
 * the whole row a phone link. Red is used exactly once, on 112. The duty to
 * report keeps its anchor here so every existing link to #tilkynna lands.
 */
export function HelpPanel() {
  const [, , pick] = useLang()
  const municipal = INSTITUTIONS.items[0]
  const rows: { label: L; blurb: L; value: string; href: string; external?: boolean; red?: boolean }[] = [
    { label: t('Bráð hætta', 'Immediate danger'), blurb: HELP.lines[0].blurb, value: '112', href: 'tel:112', red: true },
    { label: t('Ég þarf að tala við einhvern', 'I need to talk to someone'), blurb: HELP.lines[1].blurb, value: '1717', href: 'tel:1717' },
    {
      label: t('Áhyggjur af barni', 'Worried about a child'),
      blurb: t('Barnaverndarþjónusta í þínu sveitarfélagi tekur við', 'The child protection service in your municipality takes it from here'),
      value: pick({ is: 'Finna', en: 'Find' }),
      href: municipal.href ?? '#',
      external: true,
    },
    { label: t('Eftir ofbeldi', 'After abuse'), blurb: t('Barnahús', 'Barnahús'), value: HELP.lines[2].value, href: `tel:${HELP.lines[2].value.replace(/\s/g, '')}` },
    { label: t('Almennar upplýsingar', 'General information'), blurb: t('Barna- og fjölskyldustofa, virka daga', 'Barna- og fjölskyldustofa, weekdays'), value: HELP.lines[3].value, href: `tel:${HELP.lines[3].value.replace(/\s/g, '')}` },
  ]

  return (
    <section id="help" className="bofs-wash scroll-mt-24" style={{ background: C.cream2 }}>
      <Torn color={C.cream2} className="-mt-6 sm:-mt-7" />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div>
              <h2 className="bofs-display bofs-balance text-[clamp(30px,4.6vw,52px)]">{pick(HELP.title)}</h2>
              <p className="bofs-pretty mt-4 max-w-md text-[16.5px] leading-relaxed" style={{ color: C.body }}>
                {pick(HELP.lead)}
              </p>
            </div>

            {/* the duty to report, kept at its anchor */}
            <div>
              <div id="tilkynna" className="mt-12 scroll-mt-32 border-t pt-8" style={{ borderColor: C.line }}>
                <h3 className="bofs-display text-[22px]">{pick(REPORT.title)}</h3>
                <p className="bofs-pretty mt-3 text-[15.5px] leading-relaxed" style={{ color: C.body }}>
                  {pick(REPORT.lead)}{' '}
                  {pick(REPORT.lanes[0].rows[2])}
                </p>
                <p className="bofs-display mt-5 text-[17px]" style={{ fontWeight: 500, color: C.cocoa }}>
                  {pick(REPORT.statute)}
                </p>
                <p className="mt-1 text-[13px] font-semibold" style={{ color: C.clayText }}>
                  {pick(REPORT.statuteRef)}
                </p>
                <Link to="/preview/bofs/kerfid" className="bofs-focus group mt-5 inline-block rounded text-[15px] font-semibold" style={{ color: C.clayText }}>
                  <span className="bofs-way">{pick(REPORT.ctaPrimary)}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ul className="border-t" style={{ borderColor: C.cocoa }}>
              {rows.map((r, i) => (
                <li key={r.value + i} className="border-b" style={{ borderColor: C.line }}>
                  <a
                    href={r.href}
                    target={r.external ? '_blank' : undefined}
                    rel={r.external ? 'noopener noreferrer' : undefined}
                    className="bofs-focus group flex items-center justify-between gap-6 py-6"
                  >
                    <span>
                      <span className="block text-[17px] font-bold" style={{ color: C.cocoa }}>
                        {pick(r.label)}
                      </span>
                      <span className="mt-0.5 block text-[14px]" style={{ color: C.body }}>
                        {pick(r.blurb)}
                        {r.external && <span className="sr-only"> {pick({ is: '(opnast á nýjum vef)', en: '(opens in a new tab)' })}</span>}
                      </span>
                    </span>
                    <span className="bofs-display bofs-num bofs-way shrink-0 whitespace-nowrap text-[clamp(24px,3.4vw,40px)]" style={{ color: r.red ? '#A83A24' : C.clay, fontWeight: 500 }}>
                      {r.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 8. The institutional ending: short, and in a clean grid ──────────── */

/*
 * News feed, timeline, statistics, related institutions and the FAQ all
 * moved to their own pages. What remains: the one current story, one
 * honest statement about the agency, how to reach it, and the links a
 * professional expects.
 */
export function Ending() {
  const [, , pick] = useLang()
  const story = NEWS.items.find((n) => n.featured) ?? NEWS.items[0]
  const links = [
    { label: pick({ is: 'Kerfið, frá upphafi til enda', en: 'The system, end to end' }), to: '/preview/bofs/kerfid' },
    { label: pick({ is: 'Gerast fósturforeldri', en: 'Become a foster parent' }), to: '/preview/bofs/fostur#gerast' },
    { label: pick({ is: 'Allar fréttir', en: 'All news' }), to: '/preview/bofs/frettir' },
    { label: pick({ is: 'Saga, skipulag og eftirlit', en: 'History, structure and oversight' }), to: '/preview/bofs/um-stofnunina' },
  ]
  return (
    <section id="um" className="bofs-wash scroll-mt-24" style={{ background: C.oat }}>
      <Torn color={C.oat} className="-mt-6 sm:-mt-7" />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12">
          {/* the one story */}
          <div className="lg:col-span-5">
            <article className="group relative border-t pt-5" style={{ borderColor: C.cocoa }}>
              <div className="flex items-center gap-3 text-[13px] font-semibold" style={{ color: C.body }}>
                <span>{pick({ is: 'Nýjast', en: 'Latest' })}</span>
                <span className="bofs-num">{story.date}</span>
                <span>{story.source}</span>
              </div>
              <h2 className="bofs-display bofs-balance mt-3 text-[clamp(22px,2.6vw,30px)]">
                <a href={story.href} target="_blank" rel="noopener noreferrer" className="bofs-focus rounded after:absolute after:inset-0 after:content-['']" style={{ color: C.cocoa }}>
                  {pick(story.title)}
                </a>
              </h2>
              {story.summary && (
                <p className="bofs-pretty mt-3 text-[15px] leading-relaxed" style={{ color: C.body }}>
                  {pick(story.summary)}
                </p>
              )}
              <span className="bofs-way mt-4 inline-block text-[14.5px] font-semibold" style={{ color: C.clayText }}>
                {pick(NEWS.readMore)}
              </span>
            </article>
          </div>

          {/* the statement */}
          <div className="lg:col-span-4">
            <div className="border-t pt-5" style={{ borderColor: C.cocoa }}>
              <p className="bofs-display bofs-balance text-[clamp(20px,2.2vw,26px)]" style={{ fontWeight: 500 }}>
                {pick(HONEST.title)}
              </p>
              <p className="bofs-pretty mt-4 text-[15px] leading-relaxed" style={{ color: C.body }}>
                {pick(ABOUT_TEASER.body)}
              </p>
              <Link to="/preview/bofs/um-stofnunina" className="bofs-focus group mt-4 inline-block rounded text-[14.5px] font-semibold" style={{ color: C.clayText }}>
                <span className="bofs-way">{pick(ABOUT_TEASER.cta)}</span>
              </Link>
            </div>
          </div>

          {/* contact and the links a professional expects */}
          <div className="lg:col-span-3">
            <div className="border-t pt-5" style={{ borderColor: C.cocoa }}>
              <p className="text-[15px] font-bold" style={{ color: C.cocoa }}>
                {ORG.name}
              </p>
              <ul className="mt-2 space-y-0.5 text-[15px]" style={{ color: C.body }}>
                <li>{ORG.address}</li>
                <li>
                  <a className="bofs-focus rounded hover:opacity-70" href={`tel:${ORG.phone.replace(/\s/g, '')}`}>
                    {ORG.phone}
                  </a>
                </li>
                <li>
                  <a className="bofs-focus rounded hover:opacity-70" href={`mailto:${ORG.email}`}>
                    {ORG.email}
                  </a>
                </li>
                <li className="text-[13.5px]">{pick(ORG.hours)}</li>
              </ul>
              <ul className="mt-6 space-y-1.5">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="bofs-focus group inline-block rounded text-[14.5px] font-semibold" style={{ color: C.cocoa }}>
                      <span className="bofs-way">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
