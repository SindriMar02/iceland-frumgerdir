import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import { FLAVOURS, HOURS, QUOTES } from './data'

const company = getPreviewCompany('erpsstadir')

const HERO_ID = 'photo-1497034825429-c343d7c6a68f'
const HERO = `https://images.unsplash.com/${HERO_ID}?q=80&w=2000&auto=format&fit=crop`
const HERO_SRCSET = [828, 1280, 2000]
  .map((w) => `https://images.unsplash.com/${HERO_ID}?q=80&w=${w}&auto=format&fit=crop ${w}w`)
  .join(', ')

const FARM = 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2000&auto=format&fit=crop'
const VALLEY = 'https://images.unsplash.com/photo-1598208083114-991498347e6d?q=80&w=1200&auto=format&fit=crop'

const GOLD = '#e0a43a'
const BERRY = '#b6486b'
const BERRY_TEXT = '#a23c5f'
const INK = '#2a211a'

/** Small caramel "scoop" mark used as a section ornament. */
function ScoopMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none">
      <path d="M5 13a7 7 0 0 1 14 0Z" fill={GOLD} />
      <path d="M9 13 12 22 15 13Z" fill={INK} opacity="0.85" />
    </svg>
  )
}

export default function Page() {
  const reduce = useReducedMotion()
  const [showBar, setShowBar] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#fbf6ec] font-sans text-[#2a211a] antialiased">
      <PreviewChrome company={company} />

      {/* Sticky mini-nav */}
      <header className="sticky top-0 z-40 border-b border-[#2a211a]/8 bg-[#fbf6ec]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <a href="#top" className="flex items-baseline gap-2 font-display text-lg font-semibold tracking-tight md:text-xl">
            Erpsstaðir
            <span className="font-mono text-[10px] font-normal tracking-[0.2em] text-[#2a211a]/65 uppercase">Rjómabú</span>
          </a>
          <div className="flex items-center gap-5">
            <a href="#visit" className="hidden text-sm font-medium text-[#2a211a]/70 transition-colors hover:text-[#2a211a] sm:inline">
              Opnunartímar <span className="text-[#2a211a]/65">/ Hours</span>
            </a>
            <a
              href="#visit"
              lang="is"
              className="rounded-full bg-[#2a211a] px-4 py-2 text-sm font-semibold text-[#fbf6ec] transition-transform hover:-translate-y-0.5"
            >
              Finna okkur
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Img
              src={HERO}
              srcSet={HERO_SRCSET}
              sizes="100vw"
              alt="A hand holding a freshly scooped ice cream cone in warm afternoon light at the farm shop"
              className="h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#e0a43a] via-[#d98a3d] to-[#2a211a]"
              fetchpriority="high"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a211a]/85 via-[#2a211a]/35 to-transparent" />
          </div>

          <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pt-28 pb-12 md:px-8 md:pb-20">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fbf6ec]/15 px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-[#fbf6ec] uppercase ring-1 ring-[#fbf6ec]/25 backdrop-blur-sm">
                <ScoopMark /> Dalir · Vestur-Ísland · síðan 2009
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 max-w-3xl font-display text-[2.6rem] leading-[1.02] font-semibold text-[#fbf6ec] md:text-7xl">
                Beint úr fjósinu,
                <br />
                <span className="text-[#e0a43a]">í brauðformið þitt.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#fbf6ec]/90 md:text-lg">
                Farm-made ice cream, skyr and cheese — churned a few steps from the herd that made the
                cream. Pull off Route 60 toward the Westfjords and taste a dairy that still does it by hand.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#visit"
                  lang="is"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e0a43a] px-6 py-3.5 text-sm font-semibold text-[#2a211a] shadow-lg shadow-black/25 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fbf6ec]"
                >
                  Opnunartímar &amp; leiðir
                  <span className="font-normal text-[#2a211a]/65">/ Hours &amp; directions</span>
                </a>
                <a
                  href="#churning"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#fbf6ec]/10 px-6 py-3.5 text-sm font-semibold text-[#fbf6ec] ring-1 ring-[#fbf6ec]/30 backdrop-blur-sm transition-colors hover:bg-[#fbf6ec]/20"
                >
                  What’s churning today
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* WHAT'S CHURNING TODAY */}
        <section id="churning" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <div>
                <p className="flex items-center gap-2 font-mono text-xs font-medium tracking-[0.2em] uppercase" style={{ color: BERRY_TEXT }}>
                  <ScoopMark /> Í dag á búðinni
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">What’s churning today</h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-sm text-sm leading-relaxed text-[#2a211a]/65">
                Small batches, made fresh — the board changes with the season and the day. A scoop is
                typically <span className="font-semibold text-[#2a211a]">890 kr.</span>
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FLAVOURS.map((f, i) => (
              <Reveal key={f.id} delay={i * 0.06} className="h-full">
                <motion.article
                  whileHover={reduce ? undefined : { y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_44px_-26px_rgba(42,33,26,0.4)] ring-1 ring-[#2a211a]/5"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Img
                      src={f.img}
                      alt={f.alt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      fallbackClassName="bg-gradient-to-br from-[#e0a43a]/70 to-[#b6486b]/70"
                    />
                    <span
                      className="absolute top-3 left-3 rounded-full px-3 py-1 font-mono text-[11px] font-semibold tracking-wide shadow-sm"
                      style={{
                        background: f.accent === 'berry' ? BERRY : GOLD,
                        color: f.accent === 'berry' ? '#fbf6ec' : '#2a211a',
                      }}
                    >
                      {f.is}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-2xl font-semibold leading-tight">{f.name}</h3>
                      <span className="shrink-0 rounded-full bg-[#fbf6ec] px-3 py-1 text-sm font-semibold text-[#2a211a]">
                        {f.price}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#2a211a]/70">{f.note}</p>
                  </div>
                </motion.article>
              </Reveal>
            ))}

            {/* Closing card — invite */}
            <Reveal delay={FLAVOURS.length * 0.06} className="h-full">
              <a
                href="#preorder"
                className="flex h-full min-h-[18rem] flex-col justify-between rounded-[2rem] bg-[#2a211a] p-7 text-[#fbf6ec] shadow-[0_18px_44px_-26px_rgba(42,33,26,0.6)] transition-transform hover:-translate-y-1.5"
              >
                <ScoopMark />
                <div>
                  <h3 className="font-display text-3xl font-semibold leading-tight">
                    …and a few we only make when the berries are right.
                  </h3>
                  <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#e0a43a]">
                    Pre-order a tub for the road
                    <span aria-hidden="true">→</span>
                  </p>
                </div>
              </a>
            </Reveal>
          </div>
        </section>

        {/* FARM STORY */}
        <section className="relative overflow-hidden bg-[#2a211a] text-[#fbf6ec]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[20rem] lg:min-h-full">
              <Img
                src={FARM}
                alt="Cows and their calves grazing in a green field at golden Icelandic sunset"
                className="h-full w-full object-cover"
                fallbackClassName="bg-gradient-to-br from-[#e0a43a] to-[#2a211a]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a211a]/70 to-transparent lg:bg-gradient-to-r" />
            </div>
            <div className="px-5 py-20 md:px-12 md:py-28 lg:px-16">
              <Reveal>
                <p className="flex items-center gap-2 font-mono text-xs font-medium tracking-[0.2em] text-[#e0a43a] uppercase">
                  <ScoopMark /> Frá kú til könnu
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">From cow to cone</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-md text-base leading-relaxed text-[#fbf6ec]/80">
                  Sixty-some cows, one valley, no middlemen. The milk that becomes your scoop was drawn
                  this morning, a stone’s throw from the shop window. We pasteurise, churn and freeze it
                  ourselves — which is why our ice cream tastes of this particular place and not a factory.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-[#fbf6ec]/15 pt-8">
                  {[
                    ['60+', 'cows in the herd'],
                    ['2009', 'churning since'],
                    ['0 km', 'from herd to vat'],
                  ].map(([n, l]) => (
                    <div key={l}>
                      <dt className="font-display text-3xl font-semibold text-[#e0a43a] md:text-4xl">{n}</dt>
                      <dd className="mt-1 text-xs leading-snug text-[#fbf6ec]/65">{l}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* VISIT US */}
        <section id="visit" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <p className="flex items-center gap-2 font-mono text-xs font-medium tracking-[0.2em] uppercase" style={{ color: BERRY_TEXT }}>
              <ScoopMark /> Heimsókn
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Visit the farm shop</h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Hours table */}
            <Reveal>
              <div className="rounded-[2rem] bg-white p-7 shadow-[0_18px_44px_-30px_rgba(42,33,26,0.4)] ring-1 ring-[#2a211a]/5 md:p-9">
                <h3 className="font-display text-2xl font-semibold">
                  Opnunartímar <span className="text-[#2a211a]/65">/ Hours</span>
                </h3>
                <dl className="mt-6 divide-y divide-[#2a211a]/8">
                  {HOURS.map((h) => (
                    <div key={h.days} className="flex items-baseline justify-between gap-4 py-4">
                      <dt>
                        <p className="font-semibold">{h.days}</p>
                        <p className="font-mono text-[11px] tracking-wide text-[#2a211a]/65 uppercase">{h.season}</p>
                      </dt>
                      <dd className="text-right text-sm font-medium text-[#2a211a]/80">{h.time}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 rounded-2xl bg-[#fbf6ec] px-4 py-3 text-sm leading-relaxed text-[#2a211a]/70">
                  <span className="font-semibold text-[#2a211a]">6 km off the ring road.</span> Follow Route 60
                  toward the Westfjords; we’re signposted on your right in the Dalir valleys.
                </p>
              </div>
            </Reveal>

            {/* Map placeholder */}
            <Reveal delay={0.1}>
              <div className="relative h-full min-h-[20rem] overflow-hidden rounded-[2rem] shadow-[0_18px_44px_-30px_rgba(42,33,26,0.4)] ring-1 ring-[#2a211a]/5">
                <Img
                  src={VALLEY}
                  alt="Round hay bales scattered across a green Icelandic valley near the farm"
                  className="h-full w-full object-cover"
                  fallbackClassName="bg-gradient-to-br from-[#9bbf7a] to-[#2a211a]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a211a]/80 via-[#2a211a]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.18em] text-[#fbf6ec]/70 uppercase">Rjómabúið Erpsstaðir</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-[#fbf6ec]">Dalir, 371 · Route 60</p>
                  </div>
                  <a
                    href="#visit"
                    className="shrink-0 rounded-full bg-[#fbf6ec] px-4 py-2.5 text-sm font-semibold text-[#2a211a] transition-transform hover:-translate-y-0.5"
                  >
                    Map &amp; route
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PRE-ORDER */}
        <section id="preorder" className="px-5 pb-4 md:px-8">
          <Reveal className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#e0a43a] px-6 py-12 md:px-14 md:py-16">
              <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="font-mono text-xs font-medium tracking-[0.2em] text-[#2a211a]/70 uppercase">
                    Pre-order for the road
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-[#2a211a] md:text-4xl">
                    Skip the summer queue. Reserve a tub or a box to collect.
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#2a211a]/80">
                    Heading to the Westfjords? Tell us what you’d like and roughly when you’ll arrive — we’ll
                    have a 500&nbsp;ml tub or a mixed cheese-and-skyr box waiting, cold and ready, so you’re
                    back on the road in minutes.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="rounded-2xl bg-[#fbf6ec] px-5 py-4 text-[#2a211a]">
                    <p className="flex items-baseline justify-between">
                      <span className="font-semibold">500 ml tub</span>
                      <span className="font-semibold">1.290 kr.</span>
                    </p>
                    <p className="mt-1 text-xs text-[#2a211a]/70">Any flavour from today’s board</p>
                  </div>
                  <div className="rounded-2xl bg-[#fbf6ec] px-5 py-4 text-[#2a211a]">
                    <p className="flex items-baseline justify-between">
                      <span className="font-semibold">Farm box</span>
                      <span className="font-semibold">3.490 kr.</span>
                    </p>
                    <p className="mt-1 text-xs text-[#2a211a]/70">Skyr, cheese &amp; two tubs</p>
                  </div>
                  <a
                    href="#visit"
                    lang="is"
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#2a211a] px-6 py-3.5 text-sm font-semibold text-[#fbf6ec] transition-transform hover:-translate-y-0.5"
                  >
                    Panta fyrir ferðina
                    <span className="font-normal text-[#fbf6ec]/65">/ Pre-order</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* GUESTBOOK */}
        <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <p className="flex items-center gap-2 font-mono text-xs font-medium tracking-[0.2em] uppercase" style={{ color: BERRY_TEXT }}>
              <ScoopMark /> Gestabók
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">From the guestbook</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {QUOTES.map((q, i) => (
              <Reveal key={q.name} delay={i * 0.08} className="h-full">
                <figure className="flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-[0_18px_44px_-30px_rgba(42,33,26,0.35)] ring-1 ring-[#2a211a]/5">
                  <span aria-hidden="true" className="font-display text-5xl leading-none text-[#e0a43a]">“</span>
                  <blockquote className="mt-2 flex-1 text-base leading-relaxed text-[#2a211a]/80">{q.text}</blockquote>
                  <figcaption className="mt-5 border-t border-[#2a211a]/8 pt-4 text-sm">
                    <span className="font-semibold text-[#2a211a]">{q.name}</span>
                    <span className="text-[#2a211a]/65"> · {q.from}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-5 pb-24 md:px-8">
          <Reveal className="mx-auto max-w-6xl">
            <div className="rounded-[2.5rem] bg-[#2a211a] px-6 py-16 text-center text-[#fbf6ec] md:py-24">
              <p className="font-mono text-xs font-medium tracking-[0.2em] text-[#e0a43a] uppercase">Komdu og smakkaðu</p>
              <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.05] md:text-6xl">
                You can almost taste it.
                <br />
                <span className="text-[#e0a43a]">Now come and actually do.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#fbf6ec]/75">
                Six kilometres off Route 60, open every day through the summer. Bring an appetite.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#visit"
                  lang="is"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e0a43a] px-7 py-4 text-sm font-semibold text-[#2a211a] transition-transform hover:-translate-y-0.5"
                >
                  Opnunartímar &amp; leiðir
                </a>
                <a
                  href="#churning"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-[#fbf6ec] ring-1 ring-[#fbf6ec]/30 transition-colors hover:bg-[#fbf6ec]/10"
                >
                  See today’s flavours
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* MOBILE STICKY CTA */}
      <motion.div
        initial={false}
        animate={{ y: showBar ? 0 : 120, opacity: showBar ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[#2a211a]/10 bg-[#fbf6ec]/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] tracking-[0.16em] text-[#2a211a]/70 uppercase">Sumar · daglega</p>
            <p className="truncate text-sm font-semibold text-[#2a211a]">Opið 10–18 · Route 60</p>
          </div>
          <a
            href="#visit"
            lang="is"
            className="shrink-0 rounded-full bg-[#e0a43a] px-5 py-3 text-sm font-semibold text-[#2a211a] shadow-md shadow-black/15"
          >
            Opnunartímar
          </a>
        </div>
      </motion.div>

      <PreviewFooter company={company} />
    </div>
  )
}
