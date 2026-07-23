/**
 * KIDKA Wool Factory — "Straight off the machine".
 *
 * English-first (their shop and customers are international; kidka.com itself
 * is EN-first with an /is/ variant). Icelandic appears only in the gated
 * preview chrome and the outreach draft.
 *
 * SIGNATURE — the knit-row reveal: the hero photograph is revealed in twelve
 * discrete rows, the way fabric grows on a knitting bed, driven by a pure
 * time-based CSS steps() animation (no scroll-jack, no rAF, nothing gated on
 * JS mount). A 1.8s failsafe adds the `done` class so a throttled tab or a
 * paused animation can never trap the hero hidden; prefers-reduced-motion
 * renders it complete from the first frame.
 *
 * Motion rules (project lessons): IntersectionObserver + CSS transitions
 * only — no framer whileInView; no overflow-hidden clip reveals over type;
 * hero text starts at opacity 1 with a transform-only entrance; passive
 * scroll listener solely for the header flip.
 *
 * AA pairs used (computed): ink on bone 14.9:1 · bone on charcoal 13.4:1 ·
 * bone on moss 5.7:1 · rust #8F3F1E on bone 6.2:1 · #C86A3B large-only on
 * charcoal 4.6:1.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  C,
  CATEGORIES,
  CONTACT,
  FONT,
  HOURS,
  IMG,
  PROCESS,
  PRODUCTS,
  REVIEWS,
  TRUST,
} from './data'

const company = getPreviewCompany('kidka')

/* ------------------------------------------------------------------ helpers */

/** IO + CSS transition reveal. In-view-on-mount check + timeout failsafe —
 *  content is never permanently gated on the observer firing. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true)
      return
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setOn(true)),
      { threshold: 0.12 },
    )
    io.observe(el)
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) setOn(true)
    const t = window.setTimeout(() => setOn(true), 2200)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(22px)',
        transition: `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/** Mono spec label — the factory's "care label" voice. */
function SpecLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className="text-[11px] uppercase tracking-[0.22em]"
      style={{ fontFamily: FONT.mono, color: dark ? C.rustBright : C.rust }}
    >
      {children}
    </p>
  )
}

/** Handwritten margin note (Arkipelago) — the analog gesture. */
function HandNote({
  children,
  className = '',
  color = C.rust,
}: {
  children: ReactNode
  className?: string
  color?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block select-none ${className}`}
      style={{ fontFamily: FONT.hand, color, fontSize: '1.35rem', transform: 'rotate(-3deg)' }}
    >
      {children}
    </span>
  )
}

/* ---------------------------------------------------------------- component */

export default function KidkaPage() {
  const [solidNav, setSolidNav] = useState(false)
  const [heroDone, setHeroDone] = useState(false)
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    setThemeColor(C.bone)
    const onScroll = () => setSolidNav(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    // Failsafe: whatever happens to the CSS animation, the hero is revealed.
    const t = window.setTimeout(() => setHeroDone(true), 1800)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(t)
    }
  }, [])

  return (
    <>
      <PreviewChrome company={company} />
      <style>{`
        @keyframes kidka-knit { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0% 0); } }
        @keyframes kidka-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .kidka-knit-img { clip-path: inset(0 0 0% 0); }
        .kidka-knit-img.anim { animation: kidka-knit 1.15s steps(12, end) 120ms both; }
        .kidka-knit-img.done { animation: none; clip-path: inset(0 0 0% 0); }
        @media (prefers-reduced-motion: reduce) {
          .kidka-knit-img.anim { animation: none; clip-path: inset(0 0 0% 0); }
          .kidka-marquee-track { animation: none !important; }
        }
      `}</style>

      <div style={{ background: C.bone, color: C.ink, fontFamily: FONT.body }}>
        {/* ------------------------------------------------------------ nav */}
        <header
          className="fixed inset-x-0 top-0 z-40 transition-colors duration-300"
          style={{
            background: solidNav ? 'rgba(239,234,225,0.94)' : 'transparent',
            backdropFilter: solidNav ? 'blur(8px)' : undefined,
            borderBottom: solidNav ? `1px solid ${C.line}` : '1px solid transparent',
          }}
        >
          <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5">
            <a
              href="#top"
              className="text-[1.35rem] font-bold tracking-[0.08em]"
              style={{ fontFamily: FONT.display, color: solidNav ? C.ink : '#FFFFFF' }}
            >
              KIDKA
            </a>
            <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
              {[
                ['The collection', '#collection'],
                ['The factory', '#factory'],
                ['Visit us', '#visit'],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm font-medium hover:opacity-70"
                  style={{ color: solidNav ? C.ink : '#FFFFFF' }}
                >
                  {label}
                </a>
              ))}
              <a
                href="https://kidka.com/shop/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm px-4 py-2 text-sm font-semibold"
                style={{ background: C.rust, color: '#FFF7EF' }}
              >
                Shop on kidka.com
              </a>
            </nav>
          </div>
        </header>

        {/* ----------------------------------------------------------- hero */}
        <section id="top" className="relative min-h-[100svh] overflow-hidden" style={{ background: C.charcoal }}>
          <div
            className={`kidka-knit-img absolute inset-0 ${reduce ? '' : 'anim'} ${heroDone ? 'done' : ''}`}
          >
            <img
              src={IMG.hero}
              alt="A visitor in a rust-orange KIDKA Fjallalopi hat standing among a herd of Icelandic horses"
              className="h-full w-full object-cover"
              style={{ objectPosition: '50% 38%' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(20,17,14,0.42) 0%, rgba(20,17,14,0.12) 45%, rgba(20,17,14,0.66) 100%)',
              }}
            />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1240px] flex-col justify-end px-5 pb-24 pt-28">
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.26em]"
              style={{ fontFamily: FONT.mono, color: '#E8DCCB' }}
            >
              Wool factory &amp; shop · Hvammstangi, North-West Iceland
            </p>
            <h1
              className="max-w-[13ch] text-[clamp(2.6rem,7.2vw,5.6rem)] font-bold leading-[1.02] text-white"
              style={{ fontFamily: FONT.display }}
            >
              Knitted where you can{' '}
              <em className="not-italic" style={{ color: '#E9B98A', fontStyle: 'italic' }}>
                watch.
              </em>
            </h1>
            <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-white/90">
              KIDKA knits sweaters, blankets and beanies from 100% Icelandic wool on its own
              machines in Hvammstangi, and the shop floor looks straight onto them. What you
              take home was made behind the wall you are standing at.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#collection"
                className="rounded-sm px-6 py-3.5 text-[0.95rem] font-semibold"
                style={{ background: C.rustBright, color: '#1F1207' }}
              >
                See the collection
              </a>
              <a
                href="#visit"
                className="rounded-sm border px-6 py-3.5 text-[0.95rem] font-semibold text-white"
                style={{ borderColor: 'rgba(255,255,255,0.55)' }}
              >
                Visit the factory shop
              </a>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- trust marquee */}
        <div
          className="overflow-hidden border-y py-3.5"
          style={{ borderColor: C.line, background: C.boneDeep }}
          aria-hidden="true"
        >
          <div
            className="kidka-marquee-track flex w-max gap-10 whitespace-nowrap"
            style={{ animation: 'kidka-marquee 34s linear infinite' }}
          >
            {[...TRUST, ...TRUST, ...TRUST, ...TRUST].map((t, i) => (
              <span
                key={i}
                className="text-[12px] uppercase tracking-[0.2em]"
                style={{ fontFamily: FONT.mono, color: C.ink }}
              >
                {t} <span style={{ color: C.rust }}>·</span>
              </span>
            ))}
          </div>
        </div>
        <p className="sr-only">{TRUST.join(' · ')}</p>

        {/* ----------------------------------------------------- collection */}
        <section id="collection" className="mx-auto max-w-[1240px] px-5 py-20 lg:py-28">
          <Reveal>
            <SpecLabel>The collection · prices as listed on kidka.com today</SpecLabel>
            <div className="mt-3 flex flex-wrap items-end gap-x-6">
              <h2
                className="text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-tight"
                style={{ fontFamily: FONT.display }}
              >
                Real wool, real names, real prices
              </h2>
              <HandNote className="mb-2">every piece knitted here</HandNote>
            </div>
            <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-relaxed" style={{ color: '#4A423A' }}>
              These are KIDKA’s own products and photographs, exactly as they sell today, from
              the 2026 puffin edition to the “Ísar” and “Ás” cardigans. Every card opens the real
              product page.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.name} delay={Math.min(i * 60, 240)}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-md border bg-white/60 transition-transform duration-300 hover:-translate-y-1"
                  style={{ borderColor: C.line }}
                >
                  <div className="relative aspect-square overflow-hidden" style={{ background: C.boneDeep }}>
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    {p.tag && (
                      <span
                        className="absolute left-2 top-2 rounded-sm px-2 py-1 text-[10px] uppercase tracking-[0.14em]"
                        style={{ fontFamily: FONT.mono, background: C.charcoal, color: '#EFE7D9' }}
                      >
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between gap-2 px-3 py-3">
                    <span className="text-[0.92rem] font-medium leading-snug">{p.name}</span>
                    <span
                      className="shrink-0 text-[0.92rem] font-semibold"
                      style={{ fontFamily: FONT.mono, color: C.rust }}
                    >
                      {p.eur ? `€${p.eur}` : 'shop →'}
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((c) => (
                <a
                  key={c.label}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border px-3.5 py-2 text-[0.85rem] font-medium transition-colors hover:bg-white/70"
                  style={{ borderColor: C.line, color: C.ink }}
                >
                  {c.label}
                </a>
              ))}
            </div>
          </Reveal>
        </section>

        {/* -------------------------------------------------------- process */}
        <section id="factory" style={{ background: C.charcoal, color: '#EFE7D9' }}>
          <div className="mx-auto max-w-[1240px] px-5 py-20 lg:py-28">
            <Reveal>
              <SpecLabel dark>From fleece to shop floor</SpecLabel>
              <h2
                className="mt-3 max-w-[24ch] text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-tight"
                style={{ fontFamily: FONT.display }}
              >
                The machines run behind the shop wall
              </h2>
              <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-relaxed" style={{ color: '#CDbfAC' }}>
                Washing, brushing and steaming give the Icelandic wool its softer, fluffier
                feel. Then it is knitted, linked and labelled on site. Through the viewing
                windows in the factory shop you can watch it happen during opening hours.
              </p>
            </Reveal>

            <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
              {PROCESS.map((s, i) => (
                <Reveal key={s.n} delay={Math.min(i * 80, 320)}>
                  <li className="relative border-t pt-5" style={{ borderColor: 'rgba(239,231,217,0.25)' }}>
                    <span
                      className="text-[12px] tracking-[0.2em]"
                      style={{ fontFamily: FONT.mono, color: C.rustBright }}
                    >
                      {s.n}
                    </span>
                    <h3 className="mt-2 text-[1.15rem] font-semibold" style={{ fontFamily: FONT.display }}>
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed" style={{ color: '#CDBFAC' }}>
                      {s.note}
                    </p>
                    <HandNote color="#E9B98A" className="mt-3">
                      {s.hand}
                    </HandNote>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------- lookbook band */}
        <section className="relative overflow-hidden" aria-label="KIDKA lookbook">
          <img
            src={IMG.band}
            alt="Two women in dark patterned KIDKA sweaters and beanies standing with Icelandic horses"
            loading="lazy"
            className="h-[52vh] min-h-[380px] w-full object-cover"
          />
          <div
            className="absolute inset-0 flex items-end"
            style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(20,17,14,0.62) 100%)' }}
          >
            <div className="mx-auto w-full max-w-[1240px] px-5 pb-10">
              <p
                className="max-w-[30ch] text-[clamp(1.5rem,3.4vw,2.4rem)] font-bold leading-snug text-white"
                style={{ fontFamily: FONT.display }}
              >
                Photographed where it belongs: outside, in the North.
              </p>
              <p className="mt-2 text-[0.95rem] text-white/85">
                All photography on this page is KIDKA’s own, from kidka.com.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- story */}
        <section className="mx-auto max-w-[1240px] px-5 py-20 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
            <Reveal>
              <div className="overflow-hidden rounded-md">
                <img
                  src={IMG.story}
                  alt="A man wearing a patterned KIDKA lopapeysa cardigan in front of winter grass"
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <SpecLabel>Family-run since 2008</SpecLabel>
              <h2
                className="mt-3 max-w-[20ch] text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-tight"
                style={{ fontFamily: FONT.display }}
              >
                Irina &amp; Kristinn keep the needles moving
              </h2>
              <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed" style={{ color: '#4A423A' }}>
                <p>
                  Irina Kamp and Kristinn Karlsson have run KIDKA since 2008, carrying on a
                  knitting tradition in Hvammstangi that goes back to the 1970s. Today it is
                  one of the biggest knitting factories in Iceland and an important employer
                  in the Miðfjörður region.
                </p>
                <p>
                  Everything is made from Icelandic sheep wool, processed from start to finish
                  in the factory: sweaters and cardigans, ponchos, blankets, beanies, and a
                  wool line for Icelandic horses that riders order from all over the world.
                </p>
              </div>
              <a
                href="https://kidka.com/about-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-[0.95rem] font-semibold hover:opacity-75"
                style={{ color: C.rust }}
              >
                Their story on kidka.com <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </section>

        {/* ----------------------------------------------- horse line aside */}
        <section style={{ background: C.moss, color: '#F2EEE3' }}>
          <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 py-14 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:py-16">
            <Reveal>
              <SpecLabel dark>The horse line</SpecLabel>
              <h2
                className="mt-2 max-w-[24ch] text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold leading-tight"
                style={{ fontFamily: FONT.display }}
              >
                Wool for the other Icelanders: the horses
              </h2>
              <p className="mt-3 max-w-[56ch] text-[0.98rem] leading-relaxed" style={{ color: '#DDE5CF' }}>
                Saddle pads, rugs and neck covers knitted from the same Icelandic wool, a
                factory specialty you will not find in the tourist shops.
              </p>
              <a
                href="https://kidka.com/category/horseproducts/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block rounded-sm px-5 py-3 text-[0.92rem] font-semibold"
                style={{ background: '#F2EEE3', color: C.mossDeep }}
              >
                Browse horse products
              </a>
            </Reveal>
            <Reveal delay={100}>
              <img
                src={IMG.horse}
                alt="A KIDKA wool saddle pad on an Icelandic horse"
                loading="lazy"
                className="aspect-[16/10] w-full rounded-md object-cover"
              />
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------- reviews */}
        <section className="mx-auto max-w-[1240px] px-5 py-20 lg:py-28">
          <Reveal>
            <SpecLabel>What travellers write</SpecLabel>
            <h2
              className="mt-3 text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-tight"
              style={{ fontFamily: FONT.display }}
            >
              Worth the stop off Route 1
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.url} delay={Math.min(i * 90, 270)}>
                <figure
                  className="flex h-full flex-col justify-between rounded-md border bg-white/60 p-6"
                  style={{ borderColor: C.line }}
                >
                  <blockquote>
                    <p className="text-[1.12rem] font-semibold leading-snug" style={{ fontFamily: FONT.display }}>
                      “{r.quote}”
                    </p>
                    <p className="mt-3 text-[0.93rem] leading-relaxed" style={{ color: '#4A423A' }}>
                      {r.body}
                    </p>
                  </blockquote>
                  <figcaption className="mt-5">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.82rem] underline-offset-2 hover:underline"
                      style={{ fontFamily: FONT.mono, color: C.rust }}
                    >
                      {r.source}
                    </a>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- visit */}
        <section id="visit" style={{ background: C.charcoal, color: '#EFE7D9' }}>
          <div className="mx-auto max-w-[1240px] px-5 py-20 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
              <div>
                <Reveal>
                  <SpecLabel dark>Visit the factory shop</SpecLabel>
                  <h2
                    className="mt-3 max-w-[18ch] text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-tight"
                    style={{ fontFamily: FONT.display }}
                  >
                    Five minutes off Route 1
                  </h2>
                  <p className="mt-4 max-w-[58ch] text-[1.02rem] leading-relaxed" style={{ color: '#CDBFAC' }}>
                    Hvammstangi sits halfway between Reykjavík and Akureyri, in Iceland’s
                    seal-watching country. The factory shop is at Höfðabraut 34. Come in,
                    try the wool on, and watch the machines through the windows.
                  </p>
                </Reveal>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      [MapPin, 'Address', CONTACT.address, CONTACT.maps, 'Open in Google Maps'],
                      [Phone, 'Phone', CONTACT.phone, `tel:${CONTACT.phoneTel}`, 'Call the shop'],
                      [Mail, 'Email', CONTACT.email, `mailto:${CONTACT.email}`, 'Write to KIDKA'],
                      [Clock, 'Worldwide', 'Web shop ships from the factory', 'https://kidka.com/shop/', 'kidka.com/shop'],
                    ] as const
                  ).map(([Icon, label, value, href, cta], i) => (
                    <Reveal key={label} delay={Math.min(i * 70, 210)}>
                      <div
                        className="flex h-full flex-col rounded-md border p-5"
                        style={{ borderColor: 'rgba(239,231,217,0.22)' }}
                      >
                        <Icon size={18} aria-hidden="true" style={{ color: C.rustBright }} />
                        <p
                          className="mt-3 text-[11px] uppercase tracking-[0.2em]"
                          style={{ fontFamily: FONT.mono, color: '#B7A78F' }}
                        >
                          {label}
                        </p>
                        <p className="mt-1 text-[1rem] font-medium">{value}</p>
                        <a
                          href={href}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="mt-auto pt-3 text-[0.88rem] font-semibold underline-offset-2 hover:underline"
                          style={{ color: C.rustBright }}
                        >
                          {cta}
                        </a>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              <Reveal delay={120}>
                <div className="rounded-md border p-6" style={{ borderColor: 'rgba(239,231,217,0.22)' }}>
                  <h3 className="text-[1.3rem] font-semibold" style={{ fontFamily: FONT.display }}>
                    Opening hours
                  </h3>
                  {[HOURS.winter, HOURS.summer].map((season) => (
                    <div key={season.label} className="mt-5">
                      <p
                        className="text-[11px] uppercase tracking-[0.2em]"
                        style={{ fontFamily: FONT.mono, color: C.rustBright }}
                      >
                        {season.label}
                      </p>
                      <dl className="mt-2">
                        {season.rows.map(([d, h]) => (
                          <div
                            key={d}
                            className="flex items-baseline justify-between border-b py-2.5 text-[0.98rem]"
                            style={{ borderColor: 'rgba(239,231,217,0.14)' }}
                          >
                            <dt>{d}</dt>
                            <dd style={{ fontFamily: FONT.mono }}>{h}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                  <p className="mt-4 text-[0.85rem] leading-relaxed" style={{ color: '#B7A78F' }}>
                    Hours as published on kidka.com. Confirm around holidays.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* final CTA */}
            <Reveal className="mt-16">
              <div
                className="flex flex-col items-start justify-between gap-6 rounded-md p-8 md:flex-row md:items-center"
                style={{ background: C.mossDeep }}
              >
                <div>
                  <p className="text-[clamp(1.5rem,3vw,2.1rem)] font-bold leading-snug" style={{ fontFamily: FONT.display }}>
                    Take home wool that never left its town.
                  </p>
                  <p className="mt-1 text-[0.95rem]" style={{ color: '#DDE5CF' }}>
                    Sheared, knitted and sold in Hvammstangi, or shipped worldwide.
                  </p>
                </div>
                <a
                  href="https://kidka.com/shop/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-sm px-6 py-3.5 text-[0.95rem] font-semibold"
                  style={{ background: C.rustBright, color: '#1F1207' }}
                >
                  Shop the collection
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* --------------------------------------------- mobile sticky CTA */}
        <div
          className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t px-4 py-3 md:hidden"
          style={{ background: 'rgba(239,234,225,0.96)', borderColor: C.line, backdropFilter: 'blur(8px)' }}
        >
          <a
            href="https://kidka.com/shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-sm py-3 text-center text-[0.95rem] font-semibold"
            style={{ background: C.rust, color: '#FFF7EF' }}
          >
            Shop the collection
          </a>
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="rounded-sm border px-4 py-3 text-[0.95rem] font-semibold"
            style={{ borderColor: C.ink, color: C.ink }}
            aria-label="Call KIDKA"
          >
            <Phone size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="h-14 md:hidden" aria-hidden="true" />

        <PreviewFooter company={company} />
      </div>
    </>
  )
}
