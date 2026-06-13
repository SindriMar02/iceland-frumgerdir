import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Anchor,
  ArrowUpRight,
  Clock,
  MapPin,
  Package,
  ShoppingBag,
  Waves,
} from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import { HERO_ID, MARKS, PRODUCTS, SHOP_STEPS } from './data'

const company = getPreviewCompany('ektafiskur')

const HERO = `https://images.unsplash.com/${HERO_ID}`
const Q = '&auto=format&fit=crop'

export default function Page() {
  const reduce = useReducedMotion()
  const [showBar, setShowBar] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 620)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f7f8] font-sans text-[#15212a] antialiased selection:bg-[#1f5673] selection:text-white">
      <PreviewChrome company={company} />

      {/* ── Sticky mini-nav ─────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#15212a]/10 bg-[#f5f7f8]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <a href="#top" className="flex items-baseline gap-2.5">
            <span className="font-grotesk text-lg font-bold tracking-tight text-[#15212a]">
              Ektafiskur
            </span>
            <span
              className="hidden font-grotesk text-[10px] font-semibold tracking-[0.22em] text-[#8a6d2f] uppercase sm:inline"
              aria-hidden="true"
            >
              · síðan 1940
            </span>
          </a>
          <div className="flex items-center gap-6">
            <a
              href="#products"
              className="hidden font-grotesk text-xs font-medium tracking-wide text-[#15212a]/65 transition-colors hover:text-[#15212a] md:inline"
            >
              Vörur
            </a>
            <a
              href="#bar"
              className="hidden font-grotesk text-xs font-medium tracking-wide text-[#15212a]/65 transition-colors hover:text-[#15212a] md:inline"
            >
              Baccalá Bar
            </a>
            <a
              href="#shop"
              lang="is"
              className="hidden items-center gap-1.5 rounded-full bg-[#1f5673] px-4 py-2 font-grotesk text-xs font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5 md:inline-flex"
            >
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              Vefverslun
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ── HERO ──────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Img
              src={`${HERO}?q=80&w=2000${Q}`}
              srcSet={`${HERO}?q=80&w=828${Q} 828w, ${HERO}?q=80&w=1280${Q} 1280w, ${HERO}?q=80&w=2000${Q} 2000w`}
              sizes="100vw"
              fetchpriority="high"
              loading="eager"
              alt="Fresh whole cod laid on crushed ice, photographed in black and white"
              className="h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#15212a] via-[#1f5673] to-[#15212a]"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0c151b]/92 via-[#0c151b]/55 to-[#0c151b]/35"
              aria-hidden="true"
            />
          </div>

          <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pt-28 pb-14 md:px-8 md:pb-20">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#b3924f]/50 px-3.5 py-1.5 font-grotesk text-[11px] font-semibold tracking-[0.2em] text-[#e7d5ab] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b3924f]" aria-hidden="true" />
                Hauganes · Norðurland
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 max-w-3xl font-display text-[clamp(2rem,9vw,2.6rem)] leading-[0.98] font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
                Saltaður með höndum
                <span className="block text-[#e7d5ab]">síðan 1940.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
                Hand-salted Icelandic cod from a tiny northern village. Eighty-five
                years of bacalao, harðfiskur and provenance you can taste — now in a
                webshop that finally works.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#shop"
                  lang="is"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#1f5673] px-7 py-3.5 font-grotesk text-sm font-semibold tracking-wide text-white shadow-lg shadow-black/30 transition-transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Vefverslun / Shop
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </a>
                <a
                  href="#bar"
                  lang="is"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-7 py-3.5 font-grotesk text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  Heimsækja Baccalá Bar
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── THE HOUSE SINCE 1940 ──────────────────────── */}
        <section className="border-b border-[#15212a]/10 bg-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:px-8 md:py-28">
            <Reveal className="flex flex-col justify-center">
              <p className="font-grotesk text-xs font-semibold tracking-[0.24em] text-[#8a6d2f] uppercase">
                Salthúsið
              </p>
              <span className="mt-4 font-display text-[6.5rem] leading-[0.78] font-semibold tracking-tighter text-[#1f5673] md:text-[9rem]">
                1940
              </span>
              <p className="mt-3 font-grotesk text-sm font-semibold tracking-[0.18em] text-[#15212a]/70 uppercase">
                85 ár · eighty-five years
              </p>
              {/* hairline that draws */}
              <motion.div
                className="mt-7 h-px origin-left bg-[#b3924f]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-72px' }}
                transition={{ duration: 1.1, ease: [0.21, 0.65, 0.36, 1] }}
                aria-hidden="true"
              />
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col justify-center">
              <h2 className="max-w-lg font-display text-3xl leading-tight font-semibold tracking-tight text-[#15212a] md:text-4xl">
                A salt house on the harbour, run by the same family for three
                generations.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#15212a]/75">
                Hauganes is a village of barely a hundred people on Iceland’s north
                coast — and it has cured saltfish since before most of the country
                had electricity. We still salt by hand, in small batches, the way it
                was taught here in 1940.
              </p>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[#15212a]/75">
                That provenance is not marketing. It is the moat. No supermarket
                bacalao carries eighty-five years of one family’s salt.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── THE PRODUCTS ──────────────────────────────── */}
        <section id="products" className="scroll-mt-20 bg-[#f5f7f8]">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <Reveal>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-grotesk text-xs font-semibold tracking-[0.24em] text-[#8a6d2f] uppercase">
                    Vörurnar
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#15212a] md:text-5xl">
                    The cure, in four forms.
                  </h2>
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-[#15212a]/65">
                  Vacuum-sealed, stamped and shipped. Within Iceland, or exported to
                  your door.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCTS.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#15212a]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#15212a]/10">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Img
                        src={p.img}
                        alt={p.alt}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        fallbackClassName="bg-gradient-to-br from-[#1f5673] to-[#15212a]"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-grotesk text-[10px] font-semibold tracking-[0.14em] text-[#1f5673] uppercase backdrop-blur-sm">
                        {p.is}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-grotesk text-lg font-bold tracking-tight text-[#15212a]">
                        {p.name}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#15212a]/65">
                        {p.blurb}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-[#15212a]/10 pt-4">
                        <div>
                          <p className="font-grotesk text-base font-bold text-[#15212a]">
                            {p.price}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#15212a]/65">{p.weight}</p>
                        </div>
                        <span className="flex items-center gap-1 font-grotesk text-[10px] font-semibold tracking-[0.1em] text-[#8a6d2f] uppercase">
                          <Package className="h-3 w-3" aria-hidden="true" />
                          {p.ships}
                        </span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE WEBSHOP pitch ─────────────────────────── */}
        <section id="shop" className="scroll-mt-20 bg-[#15212a] text-white">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <div className="grid gap-14 md:grid-cols-[1fr_1.05fr] md:gap-16">
              <Reveal className="flex flex-col justify-center">
                <p className="font-grotesk text-xs font-semibold tracking-[0.24em] text-[#b3924f] uppercase">
                  Vefverslun
                </p>
                <h2 className="mt-4 max-w-md font-display text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
                  A webshop that finally works.
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
                  Clean, bilingual and built for a phone. Pick your cure, pay in two
                  clicks, and we ship it sealed to your door — anywhere we’re allowed
                  to send fish.
                </p>
                <a
                  href="#products"
                  lang="is"
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#1f5673] px-7 py-3.5 font-grotesk text-sm font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Opna vefverslun
                </a>
              </Reveal>

              <Reveal delay={0.1}>
                <ol className="flex flex-col divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
                  {SHOP_STEPS.map((s) => (
                    <li key={s.n} className="flex items-start gap-5 p-6 md:p-7">
                      <span className="font-display text-3xl font-semibold text-[#b3924f] tabular-nums">
                        {s.n}
                      </span>
                      <div>
                        <h3 className="font-grotesk text-base font-bold tracking-tight text-white">
                          {s.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                          {s.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── THE BACCALÁ BAR ───────────────────────────── */}
        <section id="bar" className="scroll-mt-20 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:gap-16 md:px-8 md:py-28">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl">
                <Img
                  src="https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=1200&auto=format&fit=crop"
                  alt="Plated cooked white fish dish served at the Baccalá Bar"
                  className="aspect-[4/3] w-full object-cover md:aspect-[5/6]"
                  fallbackClassName="bg-gradient-to-br from-[#1f5673] to-[#15212a]"
                />
                <span className="absolute bottom-4 left-4 rounded-full bg-[#15212a]/85 px-3.5 py-1.5 font-grotesk text-[11px] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-sm">
                  Við höfnina
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col justify-center">
              <p className="font-grotesk text-xs font-semibold tracking-[0.24em] text-[#8a6d2f] uppercase">
                Baccalá Bar
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight text-[#15212a] md:text-5xl">
                Visit the source.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[#15212a]/75">
                A small restaurant a few steps from the salting house, right on the
                Hauganes harbour. The bacalao on your plate was cured behind the wall
                you’re leaning on. There is no shorter supply chain in Iceland.
              </p>

              <dl className="mt-8 flex flex-col gap-4 border-t border-[#15212a]/10 pt-7">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5673]" aria-hidden="true" />
                  <div>
                    <dt className="font-grotesk text-xs font-semibold tracking-[0.14em] text-[#15212a]/70 uppercase">
                      Opnunartími · Summer
                    </dt>
                    <dd className="mt-0.5 text-sm text-[#15212a]/80">
                      Daily 12:00 – 21:00 · June through August
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5673]" aria-hidden="true" />
                  <div>
                    <dt className="font-grotesk text-xs font-semibold tracking-[0.14em] text-[#15212a]/70 uppercase">
                      Staðsetning
                    </dt>
                    <dd className="mt-0.5 text-sm text-[#15212a]/80">
                      Hauganes harbour, North Iceland · 40 min from Akureyri
                    </dd>
                  </div>
                </div>
              </dl>

              <p className="mt-7 font-grotesk text-sm font-semibold text-[#1f5673]">
                Smáréttur frá 1.890 kr. · plates from{' '}
                <span className="text-[#15212a]">2.690 kr.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── QUALITY / PROVENANCE MARKS ────────────────── */}
        <section className="relative isolate overflow-hidden bg-[#1f5673] text-white">
          <div className="absolute inset-0 -z-10">
            <Img
              src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2000&auto=format&fit=crop"
              alt=""
              className="h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#1f5673] to-[#15212a]"
            />
            <div className="absolute inset-0 bg-[#15212a]/80" aria-hidden="true" />
          </div>
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <h2 className="sr-only">Provenance</h2>
            <Reveal>
              <p className="text-center font-grotesk text-xs font-semibold tracking-[0.24em] text-[#e7d5ab] uppercase">
                Provenance · the legend
              </p>
            </Reveal>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 sm:grid-cols-3">
              {MARKS.map((m, i) => {
                const Icon = i === 0 ? Anchor : i === 1 ? Package : Waves
                return (
                  <Reveal key={m.k} delay={i * 0.08}>
                    <div className="flex h-full flex-col items-center bg-[#1f5673]/85 px-6 py-10 text-center">
                      <Icon className="h-5 w-5 text-[#e7d5ab]" aria-hidden="true" />
                      <span className="mt-4 font-display text-5xl font-semibold tracking-tight text-white md:text-6xl">
                        {m.k}
                      </span>
                      <span className="mt-2 font-grotesk text-xs font-semibold tracking-[0.16em] text-[#e7d5ab] uppercase">
                        {m.label}
                      </span>
                      <p className="mt-3 max-w-[15rem] text-sm leading-relaxed text-white/80">
                        {m.detail}
                      </p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────── */}
        <section className="bg-[#f5f7f8]">
          <div className="mx-auto max-w-4xl px-5 py-24 text-center md:px-8 md:py-32">
            <Reveal>
              <p className="font-grotesk text-xs font-semibold tracking-[0.24em] text-[#8a6d2f] uppercase">
                Ektafiskur · síðan 1940
              </p>
              <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl leading-[1.05] font-semibold tracking-tight text-[#15212a] md:text-6xl">
                Taste eighty-five years of salt.
              </h2>
              <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#15212a]/70">
                Order the cure to your door, or drive north and eat it where it’s
                made. Both are worth the trip.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#shop"
                  lang="is"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1f5673] px-8 py-4 font-grotesk text-sm font-semibold tracking-wide text-white shadow-lg shadow-[#1f5673]/25 transition-transform hover:-translate-y-0.5 sm:w-auto"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Vefverslun / Shop
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </a>
                <a
                  href="#bar"
                  lang="is"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#15212a]/20 px-8 py-4 font-grotesk text-sm font-semibold tracking-wide text-[#15212a] transition-colors hover:bg-white sm:w-auto"
                >
                  Heimsækja Baccalá Bar
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── MOBILE STICKY CTA BAR ─────────────────────────
          Full-width at bottom; chrome's send button floats above it
          (bottom-20 on mobile), so no overlap. */}
      <motion.div
        initial={false}
        animate={{ y: showBar ? 0 : 120 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', damping: 26, stiffness: 280 }}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[#15212a]/10 bg-[#f5f7f8]/95 px-4 py-3 backdrop-blur-md md:hidden"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-grotesk text-sm font-bold tracking-tight text-[#15212a]">
              Ektafiskur
            </p>
            <p className="font-grotesk text-[10px] font-semibold tracking-[0.18em] text-[#8a6d2f] uppercase">
              síðan 1940
            </p>
          </div>
          <a
            href="#shop"
            lang="is"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#1f5673] px-5 py-2.5 font-grotesk text-sm font-semibold tracking-wide text-white"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Vefverslun
          </a>
        </div>
      </motion.div>

      <PreviewFooter company={company} />
    </div>
  )
}
