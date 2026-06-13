import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import {
  DISHES,
  VOICES,
  HERO_ID,
  ROOM_ID,
  PLACE_ID,
  card,
  hero,
  variant,
} from './data'

const company = getPreviewCompany('tjoruhusid')

/** A small flame glyph for section markers — decorative. */
function Flame({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M12 2.5c.6 3.2 3.4 4.6 3.4 8.1A5.4 5.4 0 0 1 12 16a5.4 5.4 0 0 1-3.4-5.4c0-1.7.8-2.6 1.6-3.7.5 1 1.2 1.5 2 1.8-.2-2.2-.8-4.2.2-6.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Mobile-only sticky reservation bar; appears after the hero scrolls away. */
function MobileBar() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <motion.div
      initial={false}
      animate={{ y: show ? 0 : 120, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.65, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d98a3d]/25 bg-[#16110d]/95 px-4 py-3 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-tall text-base leading-none text-[#ece3d4]">Tjöruhúsið</p>
          <p className="mt-1 text-[11px] tracking-[0.18em] text-[#ece3d4]/55 uppercase">
            Ísafjörður
          </p>
        </div>
        <a
          href="#book"
          lang="is"
          className="shrink-0 rounded-full bg-[#d98a3d] px-5 py-2.5 text-sm font-semibold text-[#16110d] shadow-lg shadow-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ece3d4]"
        >
          Bóka borð
        </a>
      </div>
    </motion.div>
  )
}

export default function Page() {
  const reduce = useReducedMotion()

  return (
    <div className="min-h-screen bg-[#16110d] font-sans text-[#ece3d4] antialiased selection:bg-[#d98a3d] selection:text-[#16110d]">
      <PreviewChrome company={company} />

      {/* Sticky mini-nav */}
      <header className="fixed inset-x-0 top-0 z-30 border-b border-[#ece3d4]/8 bg-[#16110d]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <a href="#top" className="group flex items-center gap-2.5">
            <Flame className="h-4 w-4 text-[#d98a3d]" />
            <span className="font-tall text-xl tracking-wide text-[#ece3d4] md:text-2xl">
              Tjöruhúsið
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-[13px] tracking-[0.14em] text-[#ece3d4]/65 uppercase md:flex">
            <a className="transition-colors hover:text-[#ece3d4]" href="#ritual">
              The Ritual
            </a>
            <a className="transition-colors hover:text-[#ece3d4]" href="#room">
              The Room
            </a>
            <a className="transition-colors hover:text-[#ece3d4]" href="#catch">
              Tonight’s Catch
            </a>
            <a className="transition-colors hover:text-[#ece3d4]" href="#finding">
              Finding It
            </a>
          </nav>
          <a
            href="#book"
            lang="is"
            className="rounded-full border border-[#d98a3d]/60 px-4 py-2 text-[13px] font-semibold tracking-wide text-[#d98a3d] transition-colors hover:bg-[#d98a3d] hover:text-[#16110d]"
          >
            Bóka borð
          </a>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative flex min-h-[100svh] items-end overflow-hidden">
          <Img
            src={hero(HERO_ID)}
            srcSet={[
              variant(HERO_ID, 828),
              variant(HERO_ID, 1280),
              variant(HERO_ID, 2000),
            ].join(', ')}
            sizes="100vw"
            fetchpriority="high"
            loading="eager"
            alt="Two whole, freshly landed fish resting on weathered timber in low candlelight"
            className="kenburns absolute inset-0 h-full w-full object-cover"
            fallbackClassName="bg-gradient-to-br from-[#1d160f] via-[#16110d] to-[#0c0805]"
          />
          {/* Scrim for AA contrast */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0c0805] via-[#16110d]/70 to-[#16110d]/40"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(217,138,61,0.22),transparent_60%)]"
          />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-28 md:px-8 md:pb-24">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              lang="is"
              className="font-tall text-2xl text-[#d98a3d] italic md:text-3xl"
            >
              Það sem hafið gaf í dag
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.4 }}
              className="mt-3 max-w-4xl font-editorial text-[2.3rem] leading-[1.04] tracking-tight text-balance text-[#ece3d4] md:text-7xl"
            >
              A catch-of-the-day buffet, served by candlelight in a 300-year-old tar house.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-[#ece3d4]/85 md:text-lg"
            >
              By the old harbour in Ísafjörður, the Westfjords. One fixed price,
              whatever the boats brought in, as many helpings as you like.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.95 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href="#book"
                lang="is"
                className="rounded-full bg-[#d98a3d] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#16110d] shadow-xl shadow-black/40 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ece3d4]"
              >
                Bóka borð · Reserve
              </a>
              <a
                href="#ritual"
                className="py-2 -my-2 text-sm tracking-[0.16em] text-[#ece3d4]/70 uppercase underline-offset-8 transition-colors hover:text-[#ece3d4] hover:underline"
              >
                The ritual
              </a>
            </motion.div>
          </div>

          {/* Gentle candle-flicker scroll cue, gated for reduced motion */}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block"
              animate={{ opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Flame className="h-5 w-5 text-[#d98a3d]" />
            </motion.div>
          )}
        </section>

        {/* THE RITUAL */}
        <section id="ritual" className="bg-[#16110d] px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="text-xs tracking-[0.32em] text-[#d98a3d] uppercase">
                The Ritual
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-editorial text-4xl leading-[1.1] text-[#ece3d4] md:text-6xl">
                One price. Whatever the sea gave. As many helpings as you like.
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[#ece3d4]/75 md:text-lg">
                There is no à la carte here, and there never has been. Each evening
                the pans come off the stove carrying whatever the boats landed that
                morning — cod one night, wolffish or langoustine the next. You sit,
                you’re told what the sea gave, and the dishes keep coming until you
                wave them off. The menu cannot be planned, and that is the whole point.
              </p>
            </Reveal>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-px overflow-hidden rounded-2xl border border-[#ece3d4]/10 bg-[#ece3d4]/10 md:grid-cols-3">
            {[
              {
                k: 'Eitt verð',
                h: 'One fixed price',
                b: 'No choosing, no surprises on the bill — sit down and the table fills itself.',
              },
              {
                k: 'Dagsins afli',
                h: 'The day’s catch',
                b: 'Cooked from what came in that morning, so no two evenings are ever quite the same.',
              },
              {
                k: 'Eins og þú vilt',
                h: 'Unlimited helpings',
                b: 'The pans keep arriving until you’re full. Pacing yourself is your only job.',
              },
            ].map((c, i) => (
              <Reveal key={c.h} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col bg-[#1d160f] p-8">
                  <p lang="is" className="font-tall text-lg text-[#d98a3d] italic">
                    {c.k}
                  </p>
                  <h3 className="mt-2 font-editorial text-2xl text-[#ece3d4]">{c.h}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#ece3d4]/65">{c.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* THE ROOM */}
        <section id="room" className="relative bg-[#1d160f] px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl">
                <Img
                  src={card(ROOM_ID)}
                  alt="An intimate restaurant booth glowing in warm candlelight, a single rose on the table"
                  className="h-[26rem] w-full object-cover md:h-[34rem]"
                  fallbackClassName="bg-gradient-to-br from-[#7d3a24] via-[#1d160f] to-[#0c0805]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0c0805]/55 via-transparent to-transparent"
                />
              </div>
            </Reveal>
            <div>
              <Reveal>
                <p className="text-xs tracking-[0.32em] text-[#d98a3d] uppercase">
                  The Room
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-5 font-editorial text-4xl leading-[1.1] text-[#ece3d4] md:text-5xl">
                  Three hundred years of timber, still warm at dinner.
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 text-base leading-relaxed text-[#ece3d4]/75 md:text-lg">
                  The building began life as a tar house on the Ísafjörður harbour —
                  one of the oldest standing in Iceland. Tar once kept the boats
                  afloat; now the same low beams hold candlelight, the smell of
                  butter and the murmur of a full room.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <p className="mt-4 text-base leading-relaxed text-[#ece3d4]/75 md:text-lg">
                  It is small on purpose. A handful of long tables, mismatched chairs,
                  pans carried straight from the stove. You don’t so much arrive as
                  step into the evening already underway.
                </p>
              </Reveal>
              <Reveal delay={0.32}>
                <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                  {[
                    { n: 'c. 1734', l: 'The tar house built' },
                    { n: '20+', l: 'Years serving the catch' },
                    { n: '#1', l: 'Restaurant in Ísafjörður' },
                  ].map((s) => (
                    <div key={s.l}>
                      <p className="font-editorial text-3xl text-[#d98a3d]">{s.n}</p>
                      <p className="mt-1 text-xs tracking-[0.14em] text-[#ece3d4]/55 uppercase">
                        {s.l}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* TONIGHT'S CATCH */}
        <section id="catch" className="bg-[#16110d] px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <Reveal>
                <p className="text-xs tracking-[0.32em] text-[#d98a3d] uppercase">
                  Tonight’s Catch
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-5 font-editorial text-4xl leading-[1.1] text-[#ece3d4] md:text-6xl">
                  A taste of what the pans might bring.
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 text-base leading-relaxed text-[#ece3d4]/70 md:text-lg">
                  This is not a menu — it’s a glimpse. Whatever came in that morning
                  decides the evening; these are simply some of the friends who turn
                  up most often.
                </p>
              </Reveal>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {DISHES.map((d, i) => (
                <Reveal key={d.id} delay={i * 0.07} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#ece3d4]/10 bg-[#1d160f]">
                    <div className="relative h-52 overflow-hidden">
                      <Img
                        src={card(d.imageId)}
                        alt={`${d.name} (${d.icelandic}) plated in candlelight`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        fallbackClassName="bg-gradient-to-br from-[#7d3a24] via-[#1d160f] to-[#0c0805]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#1d160f] via-transparent to-transparent"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p
                        lang="is"
                        className="text-xs tracking-[0.18em] text-[#d98a3d] uppercase"
                      >
                        {d.icelandic}
                      </p>
                      <h3 className="mt-1.5 font-editorial text-2xl text-[#ece3d4]">
                        {d.name}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#ece3d4]/65">
                        {d.note}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <p className="mt-10 text-center text-sm tracking-[0.16em] text-[#ece3d4]/60 uppercase">
                Menu changes nightly · Whatever came in
              </p>
            </Reveal>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-y border-[#ece3d4]/8 bg-[#1d160f] px-5 py-24 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-20">
            <div>
              <Reveal>
                <h2 className="text-xs tracking-[0.32em] text-[#d98a3d] uppercase">
                  How it works
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="mt-6 flex items-end gap-4">
                  <span className="font-editorial text-6xl leading-none text-[#ece3d4] md:text-7xl">
                    7.900
                  </span>
                  <span className="pb-2 text-2xl text-[#d98a3d]">kr.</span>
                </div>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-3 text-sm tracking-[0.16em] text-[#ece3d4]/55 uppercase">
                  Per person · the whole buffet
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <a
                  href="#book"
                  lang="is"
                  className="mt-8 inline-block rounded-full bg-[#d98a3d] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#16110d] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ece3d4]"
                >
                  Bóka borð · Reserve
                </a>
              </Reveal>
            </div>

            <ol className="space-y-7">
              {[
                {
                  n: '01',
                  h: 'Book ahead',
                  b: 'The room is small and fills fast in summer. A table is the one thing you can’t leave to chance.',
                },
                {
                  n: '02',
                  h: 'Come for the evening',
                  b: 'There’s a single seating each night. Arrive hungry; the pace is yours from there.',
                },
                {
                  n: '03',
                  h: 'Let the pans come',
                  b: 'No ordering. You’re told what the sea gave, and the helpings keep arriving until you’re done.',
                },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08}>
                  <li className="flex gap-6 border-b border-[#ece3d4]/10 pb-7 last:border-0 last:pb-0">
                    <span className="font-mono text-sm text-[#d98a3d]">{s.n}</span>
                    <div>
                      <h3 className="font-editorial text-2xl text-[#ece3d4]">{s.h}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#ece3d4]/65 md:text-base">
                        {s.b}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* VOICES */}
        <section className="bg-[#16110d] px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="text-center text-xs tracking-[0.32em] text-[#d98a3d] uppercase">
                Voices
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mx-auto mt-5 max-w-2xl text-center font-editorial text-4xl leading-[1.1] text-[#ece3d4] md:text-5xl">
                People drive across the country for one dinner.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {VOICES.map((v, i) => (
                <Reveal key={v.name} delay={i * 0.08} className="h-full">
                  <figure className="flex h-full flex-col rounded-2xl border border-[#ece3d4]/10 bg-[#1d160f] p-8">
                    <Flame className="h-5 w-5 text-[#7d3a24]" />
                    <blockquote className="mt-5 flex-1 font-tall text-xl leading-relaxed text-[#ece3d4]/90 italic md:text-2xl">
                      “{v.quote}”
                    </blockquote>
                    <figcaption className="mt-6 text-sm tracking-[0.14em] text-[#ece3d4]/55 uppercase">
                      {v.name} · {v.origin}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FINDING IT */}
        <section id="finding" className="relative overflow-hidden">
          <Img
            src={hero(PLACE_ID)}
            srcSet={[
              variant(PLACE_ID, 828),
              variant(PLACE_ID, 1280),
              variant(PLACE_ID, 2000),
            ].join(', ')}
            sizes="100vw"
            alt="Green Westfjords farmland running down to a still fjord at dusk"
            className="absolute inset-0 h-full w-full object-cover"
            fallbackClassName="bg-gradient-to-br from-[#1d160f] via-[#16110d] to-[#0c0805]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#0c0805] via-[#16110d]/85 to-[#16110d]/55"
          />
          <div className="relative z-10 mx-auto max-w-6xl px-5 py-28 md:px-8 md:py-36">
            <div className="max-w-xl">
              <Reveal>
                <p className="text-xs tracking-[0.32em] text-[#d98a3d] uppercase">
                  Finding it
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-5 font-editorial text-4xl leading-[1.1] text-[#ece3d4] md:text-6xl">
                  By the old harbour in Ísafjörður.
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 text-base leading-relaxed text-[#ece3d4]/85 md:text-lg">
                  Tjöruhúsið sits among the old timber houses of Neðstikaupstaður,
                  on the harbour in the heart of the Westfjords. It’s a journey to
                  get here — and that has always been part of the meal.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <dl className="mt-9 grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs tracking-[0.16em] text-[#d98a3d] uppercase">
                      Where
                    </dt>
                    <dd className="mt-1.5 text-base text-[#ece3d4]/85">
                      Neðstikaupstaður, by the harbour
                      <br />
                      400 Ísafjörður, Westfjords
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-[0.16em] text-[#d98a3d] uppercase">
                      When
                    </dt>
                    <dd className="mt-1.5 text-base text-[#ece3d4]/85">
                      Summer season · single evening seating
                      <br />
                      Booking essential
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="book" className="relative bg-[#1d160f] px-5 py-28 md:px-8 md:py-36">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(90%_120%_at_50%_0%,rgba(217,138,61,0.16),transparent_60%)]"
          />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <Reveal>
              <Flame className="mx-auto h-7 w-7 text-[#d98a3d]" />
            </Reveal>
            <Reveal delay={0.08}>
              <p lang="is" className="mt-6 font-tall text-2xl text-[#d98a3d] italic md:text-3xl">
                Komdu meðan pönnurnar eru heitar
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <h2 className="mt-4 font-editorial text-4xl leading-[1.08] text-[#ece3d4] md:text-6xl">
                Reserve the evening. The catch will decide the rest.
              </h2>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#ece3d4]/75 md:text-lg">
                The room is small and summer tables go early. Book ahead, arrive
                hungry, and let Tjöruhúsið do the rest.
              </p>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={`mailto:${company.ownerEmail}`}
                  lang="is"
                  className="rounded-full bg-[#d98a3d] px-10 py-4 text-base font-semibold tracking-wide text-[#16110d] shadow-xl shadow-black/40 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ece3d4]"
                >
                  Bóka borð · Reserve a table
                </a>
                <a
                  href={`mailto:${company.ownerEmail}`}
                  className="rounded-full border border-[#ece3d4]/25 px-10 py-4 text-base font-semibold tracking-wide text-[#ece3d4] transition-colors hover:border-[#ece3d4]/60 hover:bg-[#ece3d4]/5"
                >
                  Email the house
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <MobileBar />
      <PreviewFooter company={company} />
    </div>
  )
}
