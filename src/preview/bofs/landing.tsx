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
import { asset, Button, C, EASE, Footer, SectionHead, ServiceCard, Torn, useLang, WordReveal } from './ui'
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

/* ── the chapter marker ─────────────────────────────────────────────── */

/*
 * SCROLL-BOUND MOTION (after decriminalizepoverty.org). Movement is tied to
 * the scroll position, never to a timer, so it is exactly as fast as the
 * reader and can never leave something hidden. Transform only.
 */

/** Settles a block into place as it enters the lower part of the screen. */
function Rise({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.55'] })
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 56, 0])
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}

/** A picture drifting a little slower than the page. Its frame must clip. */
function Drift({ children, amount = 40, className = '' }: { children: React.ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-amount, amount])
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, scale: reduce ? 1 : 1.1 }}>{children}</motion.div>
    </div>
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
  const [lang, , pick] = useLang()
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
        <div className="bofs-open-scene absolute inset-0">
        <Img
          src={asset('art-dawn.jpg')}
          srcSet={`${asset('art-dawn-900.jpg')} 900w, ${asset('art-dawn-1400.jpg')} 1400w, ${asset('art-dawn.jpg')} 2560w`}
          sizes="110vw"
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
        </div>
        {/* legibility wash for the type block, as in the original */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(251,243,231,.95) 0%, rgba(251,243,231,.84) 30%, rgba(251,243,231,.38) 56%, rgba(251,243,231,0) 78%)' }} />
        <div className="absolute inset-x-0 top-0 h-24" style={{ background: 'linear-gradient(rgba(251,243,231,.8), rgba(251,243,231,0))' }} />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity, willChange: 'transform, opacity' }} className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-start px-5 pb-48 pt-24 sm:px-8 md:justify-center md:pb-24 md:pt-28">
        <div className="max-w-2xl">
          <p className="bofs-open-fade text-[14px] font-semibold" style={{ color: C.clayText, animationDelay: '.2s' }}>
            {pick(HERO.kicker)}
          </p>
          {/* each line rises from behind its own mask, a beat apart */}
          <h1 className="bofs-display bofs-display-xl mt-3 text-[clamp(40px,7.2vw,80px)]">
            <span className="sr-only">{pick(HERO.title)}</span>
            {HERO.titleLines[lang].map((line, i) => (
              <span key={i} className="bofs-open-line" aria-hidden="true">
                <span style={{ animationDelay: `${0.42 + i * 0.12}s` }}>{line}</span>
              </span>
            ))}
          </h1>
          <p className="bofs-open-fade bofs-pretty mt-6 max-w-xl text-[clamp(17px,2vw,20px)] leading-relaxed" style={{ color: C.cocoa, animationDelay: '.85s' }}>
            {pick(HERO.lead)}
          </p>
          <div className="bofs-open-fade mt-8" style={{ animationDelay: '1s' }}>
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
    { to: '#help', title: t('Ég þarf hjálp', 'I need help'), note: t('Símanúmer sem svara strax, sum allan sólarhringinn.', 'Numbers that answer straight away, some around the clock.') },
    { to: '#tilkynna', title: t('Ég hef áhyggjur af barni', 'I am worried about a child'), note: t('Hafðu samband við barnavernd. Þú þarft ekki sannanir.', 'Contact child protection. You do not need proof.') },
    { to: '/preview/bofs/kerfid', title: t('Ég vinn með börnum', 'I work with children'), note: t('Ferlið, tilkynningarskyldan og lögin sem gilda.', 'The process, the duty to report and the laws that apply.') },
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
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Rise>
            <h2 className="bofs-display text-[clamp(30px,4vw,46px)]">{pick({ is: 'Hvar byrjar þú?', en: 'Where do you start?' })}</h2>
          </Rise>
          <ol className="mt-8 divide-y-0">
            {ways.map((w) => {
              const inner = (
                <>
                  <span className="bofs-display bofs-way bofs-way-ink inline-block text-[clamp(28px,3.3vw,40px)]">{pick(w.title)}</span>
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
          <Drift amount={28} className="rounded-[4px]">
            <Img
              src={asset('art-inni.jpg')}
              srcSet={`${asset('art-inni-900.jpg')} 900w, ${asset('art-inni-1400.jpg')} 1400w, ${asset('art-inni.jpg')} 2560w`}
              sizes="(min-width: 1024px) 680px, 100vw"
              width={2560}
              height={1440}
              alt={pick({ is: 'Vatnslitamynd: borð við glugga með útsýni yfir dal', en: 'Watercolour: a table by a window looking over a valley' })}
              className="aspect-[16/10] w-full object-cover object-[50%_45%]"
              fallbackClassName="bg-gradient-to-b from-[#F3E6CF] to-[#E4D3B4]"
            />
          </Drift>
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
/*
 * THE STORY, after decriminalizepoverty.org, compact. Three beats in a row
 * rather than three full screens: each is a centred column with a setup
 * line, a large line whose key word is marked by hand, and a short source
 * note. The paintings sit in small round vignettes. The whole chapter is
 * about two screens tall on a desktop.
 */

type BeatData = {
  ground: string
  ink: string
  soft: string
  accent: string
  setup: L
  big: L
  /** Marked only when the word is the fact a worried reader needs. */
  mark?: L
  markKind: 'underline' | 'double'
  after?: L
  art?: 'plass' | 'kerfid'
  cite: L
  source: L
}

const BEATS: BeatData[] = [
  {
    ground: C.cream2,
    ink: C.cocoa,
    soft: C.cocoa,
    accent: C.clay,
    setup: t('Foreldri hefur', 'A parent is'),
    big: t('áhyggjur af barninu sínu', 'worried about their child'),
    markKind: 'underline',
    art: 'plass',
    cite: t(
      'Öllum er skylt að láta barnaverndarþjónustu vita ef ástæða er til að ætla að barn búi við óviðunandi aðstæður. Foreldrar geta líka sjálfir leitað þangað.',
      'Everyone must tell the child protection service if there is reason to believe a child lives in unacceptable conditions. Parents can also turn there themselves.',
    ),
    source: t('Barnaverndarlög nr. 80/2002, byggt á 16. gr.', 'Child Protection Act no. 80/2002, based on Article 16'),
  },
  {
    ground: C.deep,
    ink: '#FFF5E3',
    soft: 'rgba(255,245,227,.86)',
    accent: C.sunOnDeep,
    setup: t('Barnavernd ákveður innan', 'Child protection decides within'),
    big: t('sjö daga', 'seven days'),
    mark: t('sjö daga', 'seven days'),
    markKind: 'double',
    after: t('hvort málið verði kannað', 'whether to investigate'),
    cite: t(
      'Ef málið er kannað er gerð skrifleg áætlun í samvinnu við foreldra og barnið, eftir aldri þess og þroska.',
      'If the case is investigated, a written plan is made with the parents and the child, according to the child’s age and maturity.',
    ),
    source: t('Barnaverndarlög nr. 80/2002, byggt á 21. til 23. gr.', 'Child Protection Act no. 80/2002, based on Articles 21 to 23'),
  },
  {
    ground: C.cream,
    ink: C.cocoa,
    soft: C.cocoa,
    accent: C.clay,
    setup: t('Fyrst er reynt að', 'The first step is to'),
    big: t('styðja fjölskylduna heima', 'support the family at home'),
    mark: t('heima', 'at home'),
    markKind: 'underline',
    art: 'kerfid',
    cite: t(
      'Barnaverndaryfirvöld beita ekki íþyngjandi ráðstöfunum nema markmiðum verði ekki náð með vægari hætti.',
      'Child protection authorities do not use intrusive measures unless the aims cannot be reached in a less intrusive way.',
    ),
    source: t('Barnaverndarlög nr. 80/2002, byggt á 4. gr.', 'Child Protection Act no. 80/2002, based on Article 4'),
  },
]

function Beat({ beat, first }: { beat: BeatData; first: boolean }) {
  const [, , pick] = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const artY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40])

  const art =
    beat.art === 'plass' ? (
      <Img
        src={asset('art-plass-1000.jpg')}
        width={1000}
        height={750}
        alt={pick({ is: 'Vatnslitamynd: eldhús að kvöldi', en: 'Watercolour: a kitchen in the evening' })}
        className="h-full w-full object-cover object-[45%_55%]"
        fallbackClassName="bg-gradient-to-br from-[#EAD6B4] to-[#C2D8BC]"
      />
    ) : beat.art === 'kerfid' ? (
      <Img
        src={asset('art-kerfid-1600.jpg')}
        width={1600}
        height={685}
        alt={pick({ is: 'Vatnslitamynd: vegur um dal að húsi', en: 'Watercolour: a road through a valley to a house' })}
        className="h-full w-full object-cover object-[50%_60%]"
        fallbackClassName="bg-gradient-to-br from-[#EAD6B4] to-[#C2D8BC]"
      />
    ) : null

  const bigSize = beat.markKind === 'double' ? 'text-[clamp(52px,7.4vw,96px)]' : 'text-[clamp(34px,4.6vw,60px)]'

  return (
    <div ref={ref} className="relative" style={{ background: beat.ground }}>
      {!first && <Torn color={beat.ground} className="absolute inset-x-0 -top-6 sm:-top-7" />}
      <div className="mx-auto grid max-w-6xl items-center gap-x-14 gap-y-8 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-12">
        <div className={`text-center md:text-left ${art ? 'md:col-span-8' : 'md:col-span-12 md:text-center'}`}>
          <WordReveal
            text={pick(beat.setup)}
            className="bofs-display text-[clamp(20px,2.4vw,30px)] leading-[1.1]"
            style={{ color: beat.ink, fontWeight: 400 }}
          />
          <WordReveal
            as="h3"
            text={pick(beat.big)}
            mark={beat.mark && pick(beat.mark)}
            markKind={beat.markKind}
            markColor={beat.accent}
            base={0.12}
            className={`bofs-display bofs-balance mt-1 ${bigSize} leading-[1.02]`}
            style={{ color: beat.markKind === 'double' ? beat.accent : beat.ink, fontWeight: 700, letterSpacing: '-0.02em' }}
          />
          {beat.after && (
            <WordReveal
              text={pick(beat.after)}
              base={0.3}
              className="bofs-display mt-2 text-[clamp(20px,2.4vw,30px)] leading-[1.1]"
              style={{ color: beat.ink, fontWeight: 400 }}
            />
          )}
          <motion.figure
            className={`mt-7 max-w-2xl ${art ? 'mx-auto md:mx-0' : 'mx-auto'}`}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          >
            <blockquote className="bofs-pretty text-[clamp(16px,1.5vw,18px)] leading-relaxed" style={{ color: beat.soft }}>
              {pick(beat.cite)}
            </blockquote>
            <figcaption className="mt-2 text-[13px]" style={{ color: beat.soft, opacity: 0.85 }}>
              {pick(beat.source)}
            </figcaption>
          </motion.figure>
        </div>
        {art && (
          <motion.div style={{ y: artY }} className="mx-auto aspect-square w-[min(58vw,300px)] overflow-hidden rounded-full md:col-span-4 md:w-full md:max-w-[300px]">
            {art}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export function Story() {
  const [, , pick] = useLang()
  return (
    <section id="saga" className="scroll-mt-20" aria-label={pick({ is: 'Dæmi um feril máls', en: 'An example of how a case proceeds' })}>
      {BEATS.map((b, i) => (
        <Beat key={i} beat={b} first={i === 0} />
      ))}
      <p className="bofs-wash px-5 pb-8 text-center text-[13.5px]" style={{ background: C.cream, color: C.body }}>
        {pick({ is: 'Almennt dæmi um feril máls. Hvert mál er ólíkt.', en: 'A general example of how a case proceeds. Every case is different.' })}
      </p>
    </section>
  )
}

/* ── chapter breaks: a pause, not a page ──────────────────────────────────
 * After the reference, but a third of the height: a short hairline draws
 * down, the chapter number, one word written in with a hand-drawn stroke
 * beneath it. Decorative for screen readers; the chapter's heading follows.
 */
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI']

export function ChapterBreak({ n, word, ground = C.cream, ink = C.cocoa }: { n: number; word: L; ground?: string; ink?: string }) {
  const [, , pick] = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const lineIn = useTransform(scrollYProgress, [0.2, 0.9], [reduce ? 1 : 0, 1])
  return (
    <div ref={ref} aria-hidden="true" className="bofs-wash relative flex flex-col items-center px-5 pb-14 pt-10" style={{ background: ground }}>
      <Torn color={ground} className="absolute inset-x-0 -top-6 sm:-top-7" />
      <motion.span className="block h-16 w-px origin-top sm:h-20" style={{ background: ink, scaleY: lineIn, opacity: 0.45 }} />
      <span className="bofs-display mt-4 text-[16px]" style={{ color: ink, opacity: 0.8 }}>
        {pick({ is: 'Kafli', en: 'Chapter' })} {ROMAN[n - 1]}
      </span>
      <WordReveal
        as="span"
        text={pick(word)}
        className="bofs-display mt-1 block text-center text-[clamp(40px,6.4vw,84px)] leading-[1.05]"
        style={{ color: ink, fontWeight: 400, letterSpacing: '-0.02em' }}
      />
    </div>
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
          <Rise>
            <SectionHead title={pick({ is: 'Meðferðarheimili', en: 'Treatment homes' })} lead={pick(CATEGORIES[0].blurb)} />
          </Rise>
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
          <Rise>
            <SectionHead
              title={pick({ is: 'Þjónusta við börn og fjölskyldur', en: 'Services for children and families' })}
              lead={pick(CATEGORIES[1].blurb)}
            />
          </Rise>
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
      title: t('Málinu er fylgt eftir', 'The case is followed up'),
      body: t(
        'Markmiðið er að barnið geti búið heima eða við stöðugar aðstæður. Barnaverndarþjónustan fylgir málinu eftir samkvæmt áætluninni.',
        'The aim is for the child to live at home or in stable circumstances. The child protection service follows the case according to the plan.',
      ),
    },
  ]

  return (
    <section id="ferli" className="scroll-mt-24" style={{ background: '#FFFFFF' }}>
      <Torn color="#FFFFFF" className="-mt-6 sm:-mt-7" />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
        <Rise>
          <h2 className="bofs-display max-w-2xl text-[clamp(30px,4.6vw,52px)]">{pick({ is: 'Hvernig barn fær aðstoð', en: 'How a child gets help' })}</h2>
          <p className="bofs-pretty mt-4 max-w-xl text-[16.5px] leading-relaxed" style={{ color: C.body }}>
            {pick({
              is: 'Barnaverndarþjónusta í sveitarfélagi barnsins er alltaf fyrsti viðkomustaður.',
              en: 'The child protection service in the child’s municipality is always the first point of contact.',
            })}
          </p>
        </Rise>

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

        <p className="mt-14 flex flex-wrap gap-x-10 gap-y-3 text-[17px]">
          <Link to="/preview/bofs/kerfid" className="bofs-focus group rounded">
            <span className="bofs-way font-semibold" style={{ color: C.clayText }}>
              {pick({ is: 'Nánar um ferlið', en: 'More about the process' })}
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
        <Rise>
          <h2 className="bofs-display max-w-2xl text-[clamp(30px,4.6vw,52px)]">{pick({ is: 'Á meðferðarheimilunum', en: 'At the treatment homes' })}</h2>
          <p className="bofs-pretty mt-4 max-w-xl text-[16.5px] leading-relaxed" style={{ color: C.body }}>
            {pick({
              is: 'Í meðferð er lögð áhersla á öryggi, stöðugleika og virkni í skóla, vinnu og tómstundum. Foreldrar taka þátt í meðferðinni.',
              en: 'Treatment focuses on safety, stability and activity in school, work and leisure. Parents take part in the treatment.',
            })}
          </p>
        </Rise>
      </div>

      {/* the one full-bleed photograph, and it is a real one */}
      <div className="mt-12">
        <figure>
          <Drift amount={30} className="h-[38vw] max-h-[460px] min-h-[240px]">
            <Img
              src={asset('laekjarbakki-hus.jpg')}
              width={1920}
              height={1440}
              srcSet={`${asset('laekjarbakki-hus-1000.jpg')} 1000w, ${asset('laekjarbakki-hus.jpg')} 1920w`}
              sizes="100vw"
              alt={pick({ is: 'Meðferðarheimilið Lækjarbakki í Gunnarsholti að vetri', en: 'The Lækjarbakki treatment home in Gunnarsholt in winter' })}
              className="bofs-photo h-[38vw] max-h-[460px] min-h-[240px] w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#EAD6B4] to-[#C2D8BC]"
            />
          </Drift>
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Caption>{pick({ is: 'Lækjarbakki í Gunnarsholti. Ljósmynd frá heimilinu.', en: 'Lækjarbakki at Gunnarsholt. Photograph from the home.' })}</Caption>
          </div>
        </figure>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-5 gap-y-8 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-4">
        {[
          { src: PLACEHOLDER.table, w: 1920, h: 1071, ph: true, alt: t('Eldhúsborð með tveimur bollum og ullarteppi á stólbaki', 'A kitchen table with two mugs and a wool blanket on a chair'), cap: t('Eldhús.', 'A kitchen.') },
          { src: PLACEHOLDER.hands, w: 966, h: 1200, ph: true, alt: t('Hendur slétta sæng á rúmi í björtu herbergi', 'Hands smoothing a duvet on a bed in a bright room'), cap: t('Herbergi.', 'A bedroom.') },
          { src: PLACEHOLDER.grounds, w: 1400, h: 939, ph: true, alt: t('Starfsmaður gengur eftir malarstíg við lágreist hvítt hús', 'A staff member walking along a gravel path by a low white house'), cap: t('Lóð meðferðarheimilis.', 'The grounds of a treatment home.') },
          { src: 'laekjarbakki-tonlist.jpg', w: 1920, h: 1440, ph: false, alt: t('Tónlistarherbergi á Lækjarbakka', 'The music room at Lækjarbakki'), cap: t('Tónlistarherbergi á Lækjarbakka. Ljósmynd frá heimilinu.', 'The music room at Lækjarbakki. Photograph from the home.') },
        ].map((f) => (
          <figure key={f.src}>
            <Img
              src={asset(f.src)}
              srcSet={`${asset(f.src.replace('.jpg', '-900.jpg'))} 900w, ${asset(f.src)} ${f.w}w`}
              sizes="(min-width: 1024px) 270px, 50vw"
              width={f.w}
              height={f.h}
              data-placeholder={f.ph ? 'ai' : undefined}
              alt={pick(f.alt)}
              className="bofs-photo aspect-[4/5] w-full object-cover"
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
    { label: t('Að tala við einhvern', 'Talk to someone'), blurb: HELP.lines[1].blurb, value: '1717', href: 'tel:1717' },
    {
      label: t('Áhyggjur af barni', 'Worried about a child'),
      blurb: t('Finna barnaverndarþjónustu sveitarfélagsins', 'Find your municipal child protection service'),
      value: pick({ is: 'Finna', en: 'Find' }),
      href: municipal.href ?? '#',
      external: true,
    },
    { label: t('Grunur um ofbeldi', 'Suspected violence'), blurb: t('Barnahús', 'Barnahús'), value: HELP.lines[2].value, href: `tel:${HELP.lines[2].value.replace(/\s/g, '')}` },
    { label: t('Almennar upplýsingar', 'General information'), blurb: HELP.lines[3].blurb, value: HELP.lines[3].value, href: `tel:${HELP.lines[3].value.replace(/\s/g, '')}` },
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
                <p className="mt-5">
                  <Link to="/preview/bofs/kerfid" className="bofs-focus group inline-block rounded text-[15px] font-semibold" style={{ color: C.clayText }}>
                    <span className="bofs-way">{pick(REPORT.ctaPrimary)}</span>
                  </Link>
                </p>
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
                    className="bofs-focus group flex items-center justify-between gap-6 py-6 transition-transform duration-300 ease-[cubic-bezier(.23,1,.32,1)] hover:translate-x-1"
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
    { label: pick({ is: 'Hvernig barnavernd virkar', en: 'How child protection works' }), to: '/preview/bofs/kerfid' },
    { label: pick({ is: 'Að gerast fósturforeldri', en: 'Becoming a foster parent' }), to: '/preview/bofs/fostur#gerast' },
    { label: pick({ is: 'Allar fréttir', en: 'All news' }), to: '/preview/bofs/frettir' },
    { label: pick({ is: 'Um stofnunina', en: 'About the agency' }), to: '/preview/bofs/um-stofnunina' },
  ]
  return (
    <section id="um" className="bofs-wash scroll-mt-24" style={{ background: C.oat }}>
      <Torn color={C.oat} className="-mt-6 sm:-mt-7" />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        {/* two written pieces, side by side */}
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
          <article className="group relative lg:col-span-7">
            <p className="text-[13px] font-semibold" style={{ color: C.clayText }}>
              {pick({ is: 'Nýjasta frétt', en: 'Latest news' })}
            </p>
            <h2 className="bofs-display bofs-balance mt-3 max-w-2xl text-[clamp(24px,3vw,36px)]">
              <a href={story.href} target="_blank" rel="noopener noreferrer" className="bofs-focus rounded after:absolute after:inset-0 after:content-['']" style={{ color: C.cocoa }}>
                {pick(story.title)}
              </a>
            </h2>
            {story.summary && (
              <p className="bofs-pretty mt-4 max-w-2xl text-[16px] leading-relaxed" style={{ color: C.cocoa }}>
                {pick(story.summary)}
              </p>
            )}
            <p className="mt-4 text-[13.5px]" style={{ color: C.body }}>
              <span className="bofs-num">{story.date}</span> · {story.source} ·{' '}
              <span className="bofs-way font-semibold" style={{ color: C.clayText }}>
                {pick(NEWS.readMore)}
              </span>
            </p>
          </article>

          <div className="lg:col-span-5 lg:pl-10" style={{ borderLeft: `1px solid ${C.line}` }}>
            <p className="bofs-display bofs-balance text-[clamp(22px,2.4vw,30px)]" style={{ fontWeight: 500 }}>
              {pick(HONEST.title)}
            </p>
            <p className="bofs-pretty mt-4 text-[15.5px] leading-relaxed" style={{ color: C.cocoa }}>
              {pick(HONEST.body)}
            </p>
            <p className="mt-4">
              <Link to="/preview/bofs/um-stofnunina#eftirlit" className="bofs-focus group inline-block rounded text-[15px] font-semibold" style={{ color: C.clayText }}>
                <span className="bofs-way">{pick({ is: 'Eftirlit og kvartanir', en: 'Oversight and complaints' })}</span>
              </Link>
            </p>
            <p className="bofs-pretty mt-8 border-t pt-6 text-[15.5px] leading-relaxed" style={{ borderColor: C.line, color: C.cocoa }}>
              {pick(ABOUT_TEASER.body)}
            </p>
            <p className="mt-4">
              <Link to="/preview/bofs/um-stofnunina" className="bofs-focus group inline-block rounded text-[15px] font-semibold" style={{ color: C.clayText }}>
                <span className="bofs-way">{pick(ABOUT_TEASER.cta)}</span>
              </Link>
            </p>
          </div>
        </div>

        {/* the colophon: who this is and where, on one rule */}
        <div className="mt-20 border-t pt-8 sm:mt-24" style={{ borderColor: C.cocoa }}>
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="bofs-display text-[20px]">{ORG.name}</p>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.cocoa }}>
                {ORG.address}
                <br />
                <a className="bofs-focus rounded" href={`tel:${ORG.phone.replace(/\s/g, '')}`}>
                  {ORG.phone}
                </a>
                {' · '}
                <a className="bofs-focus rounded" href={`mailto:${ORG.email}`}>
                  {ORG.email}
                </a>
                <br />
                <span style={{ color: C.body }}>{pick(ORG.hours)}</span>
              </p>
            </div>
            <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2 md:col-span-7 md:pt-1">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="bofs-focus group inline-block rounded text-[15px] font-semibold" style={{ color: C.cocoa }}>
                    <span className="bofs-way">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 9. Night: the valley at dusk carries the closing line AND the footer ── */

/*
 * The old bookend faded its painting into a flat brown, and the footer was
 * the same brown without the paper texture, so a seam showed where the two
 * met. Now there is one night section: the painting runs behind the closing
 * line and the whole footer, darkening continuously as it goes down, and
 * the footer paints no ground of its own.
 */
export function NightClose() {
  const [, , pick] = useLang()
  return (
    <section className="relative overflow-hidden" style={{ background: C.deep }}>
      <Img
        src={asset('art-dusk.jpg')}
        srcSet={`${asset('art-dusk-1600.jpg')} 1600w, ${asset('art-dusk.jpg')} 2560w`}
        sizes="100vw"
        width={2560}
        height={1440}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
        fallbackClassName="bg-gradient-to-b from-[#55402E] to-[#4A3123]"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(rgba(58,44,34,.18) 0%, rgba(58,44,34,.5) 30%, rgba(58,44,34,.8) 55%, rgba(58,44,34,.9) 100%)' }} />
      <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-32 text-center sm:px-8 sm:pt-40">
        <p className="bofs-display bofs-balance mx-auto max-w-2xl text-[clamp(22px,3.2vw,32px)]" style={{ color: '#FDF3E3', textShadow: '0 1px 24px rgba(40,28,18,.45)' }}>
          {pick({ is: 'Ef barn er í bráðri hættu skaltu hringja í 112.', en: 'If a child is in immediate danger, call 112.' })}
        </p>
        <p className="mx-auto mt-3 max-w-xl text-[17px]" style={{ color: 'rgba(253,243,227,.9)' }}>
          {pick({ is: 'Hjálparsími Rauða krossins, 1717, svarar allan sólarhringinn.', en: 'The Red Cross helpline, 1717, answers around the clock.' })}
        </p>
      </div>
      <Footer bare />
    </section>
  )
}
