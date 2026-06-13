import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Coffee,
  Fish,
  MapPin,
  Phone,
  Snowflake,
  Star,
  Utensils,
} from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'

const company = getPreviewCompany('kaffihornid')

const TEL = 'tel:+3544782600'

const MENU = [
  {
    icon: Fish,
    kicker: 'Merki hússins',
    name: 'Humar Hornafjarðar',
    en: 'Langoustine from the bay',
    desc: 'Sweet local langoustine, pan-grilled in garlic butter with crusty bread. The reason people pull off the Ring Road.',
    price: '4.900 kr.',
    feature: true,
    img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80&w=1200&auto=format&fit=crop',
    alt: 'Plated langoustine with gold cutlery on a warm table',
  },
  {
    icon: Utensils,
    kicker: 'Af landinu',
    name: 'Íslenskt lambafillet',
    en: 'Icelandic lamb fillet',
    desc: 'Tender highland lamb with rosemary jus, root vegetables and a glacier-air freshness you can almost taste.',
    price: '5.600 kr.',
    img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop',
    alt: 'A warm, lively dinner table set for a meal',
  },
  {
    icon: Fish,
    kicker: 'Dagsins',
    name: 'Fiskur dagsins',
    en: 'Catch of the day',
    desc: 'Whatever the harbour landed this morning, simply cooked and generously served. Ask your server what it is today.',
    price: '4.200 kr.',
    img: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?q=80&w=1200&auto=format&fit=crop',
    alt: 'A bowl of cooked prawns garnished with basil',
  },
  {
    icon: Coffee,
    kicker: 'Með kaffinu',
    name: 'Kaka & kaffi',
    en: 'Cake & coffee',
    desc: 'A warm slice and a proper cup at the corner table — the simplest, oldest reason to stop in Höfn.',
    price: '1.290 kr.',
    img: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?q=80&w=1200&auto=format&fit=crop',
    alt: 'Overhead brunch table with waffles and coffee',
  },
]

const HOURS = [
  ['Mánudaga – fimmtudaga', 'Mon – Thu', '11:30 – 21:00'],
  ['Föstudaga – laugardaga', 'Fri – Sat', '11:30 – 22:00'],
  ['Sunnudaga', 'Sun', '12:00 – 21:00'],
]

const REVIEWS = [
  {
    text: 'We drove the whole south coast for this langoustine and it was worth every kilometre. The room is warm, the staff warmer.',
    name: 'Sophie L.',
    from: 'France · Summer 2025',
  },
  {
    text: 'A proper corner table after a cold day at the glacier lagoon. Coffee that never ran out and the best lamb of our trip.',
    name: 'Daniel & Mia',
    from: 'Germany · Spring 2025',
  },
  {
    text: 'Been stopping here for 27 years on the way east. Still the friendliest light in Höfn after dark.',
    name: 'Guðrún Þ.',
    from: 'Reykjavík · local regular',
  },
]

/** Bright, full-width mobile booking bar — chrome's button floats above it. */
function MobileBar() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      initial={false}
      animate={{ y: show ? 0 : 120 }}
      transition={{ type: 'spring', damping: 26, stiffness: 280 }}
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-[#ecdcc6] bg-[#fdfaf4]/95 px-4 py-3 shadow-[0_-8px_24px_rgba(43,33,28,0.10)] backdrop-blur-md md:hidden"
    >
      <div className="min-w-0">
        <p className="font-editorial text-base leading-none text-[#2b211c]">Kaffi Hornið</p>
        <p className="mt-1 truncate text-xs text-[#6f6055]">Höfn · síðan 1999</p>
      </div>
      <a
        href="#bokun"
        lang="is"
        className="shrink-0 rounded-full bg-[#a94f24] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#c5612f]/30 transition-colors hover:bg-[#a94f24]"
      >
        Bóka borð
      </a>
    </motion.div>
  )
}

export default function Page() {
  useEffect(() => {
    document.title = 'Kaffi Hornið — Redesign Concept'
  }, [])

  return (
    <div className="min-h-screen bg-[#fdfaf4] font-sans text-[#2b211c] antialiased">
      <PreviewChrome company={company} />
      <MobileBar />

      {/* Sticky mini-nav */}
      <header className="sticky top-0 z-30 border-b border-[#efe2cf]/80 bg-[#fdfaf4]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <a href="#top" className="flex items-baseline gap-2.5">
            <span className="font-editorial text-xl tracking-tight text-[#2b211c] md:text-2xl">
              Kaffi Hornið
            </span>
            <span className="hidden text-[10px] font-semibold tracking-[0.28em] text-[#a94f24] uppercase sm:inline">
              Höfn · 1999
            </span>
          </a>
          <nav className="flex items-center gap-1.5 sm:gap-4">
            <a
              href="#matsedill"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-[#5c4d42] transition-colors hover:text-[#a94f24] sm:inline"
            >
              Matseðill / Menu
            </a>
            <a
              href="#bokun"
              lang="is"
              className="rounded-full bg-[#a94f24] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#a94f24]"
            >
              Bóka borð
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-12 pb-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12 md:px-8 md:pt-16 md:pb-24">
            <div className="relative z-10">
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full bg-[#fff] px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-[#a94f24] uppercase shadow-sm ring-1 ring-[#efe2cf]"
              >
                <Coffee className="h-3.5 w-3.5" aria-hidden="true" />
                Café · bar · veitingastaður
              </motion.p>

              <h1 className="mt-6 font-editorial text-[2.55rem] leading-[1.04] tracking-tight text-[#2b211c] sm:text-6xl lg:text-7xl">
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.08 }}
                  className="block"
                  lang="is"
                >
                  Hornið á Höfn
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.18 }}
                  className="block text-[#c5612f]"
                  lang="is"
                >
                  síðan 1999
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-6 max-w-md text-base leading-relaxed text-[#5c4d42] md:text-lg"
              >
                The warm corner table in Iceland&rsquo;s langoustine capital — daylight, good coffee
                and Vatnajökull on the horizon. Most people find us off the road. Now you can book
                from it.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.42 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <a
                  href="#bokun"
                  lang="is"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#a94f24] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#c5612f]/25 transition-all hover:-translate-y-0.5 hover:bg-[#a94f24]"
                >
                  Bóka borð / Reserve
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <a
                  href="#matsedill"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9c8b0] bg-white px-7 py-3.5 text-sm font-semibold text-[#2b211c] transition-colors hover:border-[#a94f24] hover:text-[#a94f24]"
                  lang="is"
                >
                  Sjá matseðil
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#6f6055]"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="flex text-[#c5612f]" role="img" aria-label="Rated 4.8 out of 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                    ))}
                  </span>
                  4,8 · 27 ár á Höfn
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#6fa3b0]" aria-hidden="true" />
                  Hafnarbraut 42
                </span>
              </motion.div>
            </div>

            {/* Hero image stack */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.65, 0.36, 1] }}
              className="relative"
            >
              <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-[#2b211c]/15 ring-1 ring-[#efe2cf]">
                <Img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000&auto=format&fit=crop"
                  srcSet="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=828&auto=format&fit=crop 828w, https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1280&auto=format&fit=crop 1280w, https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000&auto=format&fit=crop 2000w"
                  sizes="(min-width: 768px) 46vw, 100vw"
                  alt="The warm, rustic café interior of Kaffi Hornið with pendant lights and plants"
                  className="aspect-[4/5] w-full object-cover"
                  loading="eager"
                  fetchpriority="high"
                  fallbackClassName="aspect-[4/5] w-full bg-gradient-to-br from-[#e8c9a3] via-[#c5612f] to-[#7a3d1c]"
                />
              </div>

              {/* Floating langoustine card */}
              <div className="absolute -bottom-6 -left-3 hidden w-44 rotate-[-3deg] overflow-hidden rounded-2xl bg-white p-2 shadow-xl shadow-[#2b211c]/20 ring-1 ring-[#efe2cf] sm:block md:-left-8 md:w-52">
                <Img
                  src="https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80&w=1200&auto=format&fit=crop"
                  alt="Close-up of the signature langoustine plate"
                  className="aspect-square w-full rounded-xl object-cover"
                  fallbackClassName="aspect-square w-full rounded-xl bg-gradient-to-br from-[#e8c9a3] to-[#c5612f]"
                />
                <p className="px-1 pt-2 pb-1 font-editorial text-sm text-[#2b211c]">Humarinn okkar</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* THE LANGOUSTINE */}
        <section className="bg-[#fff7ec]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:gap-16 md:px-8 md:py-28">
            <Reveal className="order-2 md:order-1">
              <div className="overflow-hidden rounded-[2rem] shadow-xl shadow-[#2b211c]/10 ring-1 ring-[#efe2cf]">
                <Img
                  src="https://images.unsplash.com/photo-1625943553852-781c6dd46faa?q=80&w=1200&auto=format&fit=crop"
                  alt="A bowl of freshly cooked langoustine prawns with basil"
                  className="aspect-[5/4] w-full object-cover transition-transform duration-700 hover:scale-105"
                  fallbackClassName="aspect-[5/4] w-full bg-gradient-to-br from-[#e8c9a3] to-[#c5612f]"
                />
              </div>
            </Reveal>
            <div className="order-1 md:order-2">
              <Reveal>
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-[#a94f24] uppercase">
                  <Fish className="h-4 w-4" aria-hidden="true" />
                  Höfn · humarhöfuðborgin
                </p>
                <h2 className="mt-4 font-editorial text-3xl leading-tight text-[#2b211c] md:text-5xl">
                  Iceland&rsquo;s langoustine capital, on a plate
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-md text-base leading-relaxed text-[#5c4d42]">
                  The cold bay below Vatnajökull grows langoustine sweeter and firmer than almost
                  anywhere. For decades the boats of Höfn have landed it here — and for 27 years our
                  kitchen has cooked it simply: garlic, butter, bread, and as little fuss as the dish
                  deserves.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[#e8d6bd] pt-6">
                  {[
                    ['1999', 'opnuðum dyrnar'],
                    ['Höfn', 'humar capital'],
                    ['Á hverjum degi', 'fresh from the bay'],
                  ].map(([big, small]) => (
                    <div key={small}>
                      <p className="font-editorial text-xl text-[#2b211c] md:text-2xl">{big}</p>
                      <p className="mt-1 text-[11px] tracking-wide text-[#6f6055] uppercase">{small}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* MENU HIGHLIGHTS */}
        <section id="matsedill" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <Reveal className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-[#a94f24] uppercase">
                <Utensils className="h-4 w-4" aria-hidden="true" />
                Matseðill / Menu
              </p>
              <h2 className="mt-4 font-editorial text-3xl leading-tight text-[#2b211c] md:text-5xl">
                A short, honest menu — done well
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#5c4d42]">
                Langoustine, lamb, the day&rsquo;s catch, and something sweet with the coffee. Sample
                prices shown.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {MENU.map((m, i) => (
                <Reveal key={m.name} delay={i * 0.06}>
                  <article
                    className={`group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2b211c]/10 ${
                      m.feature ? 'ring-2 ring-[#c5612f]/40' : 'ring-[#efe2cf]'
                    }`}
                  >
                    <div className="relative overflow-hidden">
                      <Img
                        src={m.img}
                        alt={m.alt}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        fallbackClassName="aspect-[16/10] w-full bg-gradient-to-br from-[#e8c9a3] to-[#c5612f]"
                      />
                      {m.feature && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#a94f24] px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-white uppercase shadow-md">
                          <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                          Merki hússins
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-[#3f5359] uppercase">
                        <m.icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {m.kicker}
                      </p>
                      <h3 className="mt-2 font-editorial text-2xl text-[#2b211c]" lang="is">
                        {m.name}
                      </h3>
                      <p className="text-sm font-medium text-[#6f6055]">{m.en}</p>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5c4d42]">{m.desc}</p>
                      <p className="mt-4 font-editorial text-xl text-[#a94f24]">{m.price}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* THE ROOM */}
        <section className="relative overflow-hidden bg-[#2b211c] text-[#f6ede0]">
          <Img
            src="https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?q=80&w=2000&auto=format&fit=crop"
            alt="An intimate café booth set with a single rose"
            className="absolute inset-0 h-full w-full object-cover"
            fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#4a3527] via-[#2b211c] to-[#1a130f]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a130f]/95 via-[#2b211c]/85 to-[#2b211c]/55" aria-hidden="true" />
          <div className="relative z-10 mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Reveal className="max-w-xl">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-[#e8a06a] uppercase">
                <Coffee className="h-4 w-4" aria-hidden="true" />
                Stofan / The room
              </p>
              <h2 className="mt-4 font-editorial text-3xl leading-tight md:text-5xl">
                Open all day, warm long after dark
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#d8c8b6]">
                Pendant lights, plants in the window and the same corner table that&rsquo;s seen
                travellers, fishermen and locals since 1999. Come for coffee at noon or langoustine at
                nine — the light stays on.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/15 backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-[#e8a06a]" aria-hidden="true" />
                  Opið alla daga
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/15 backdrop-blur-sm">
                  <Coffee className="h-4 w-4 text-[#e8a06a]" aria-hidden="true" />
                  Kaffi, bar & matur
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* THE PLACE — Vatnajökull */}
        <section className="bg-[#eef4f5]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:gap-16 md:px-8 md:py-28">
            <div>
              <Reveal>
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-[#3f5359] uppercase">
                  <Snowflake className="h-4 w-4" aria-hidden="true" />
                  Staðurinn / The place
                </p>
                <h2 className="mt-4 font-editorial text-3xl leading-tight text-[#23363b] md:text-5xl">
                  Höfn, under Vatnajökull
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-md text-base leading-relaxed text-[#3f5359]">
                  A small harbour town on the south-east coast, where Europe&rsquo;s largest glacier
                  fills the horizon. Glacier lagoons, black sand and ice caves are minutes away — and
                  our corner is the warm place to land afterwards.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <a
                  href="https://maps.google.com/?q=Kaffi+Horni%C3%B0+H%C3%B6fn"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#3f5359] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#6fa3b0]/30 transition-all hover:-translate-y-0.5 hover:bg-[#33474c]"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Finna á korti
                </a>
              </Reveal>
            </div>
            <Reveal>
              <div className="overflow-hidden rounded-[2rem] shadow-xl shadow-[#23363b]/15 ring-1 ring-white/60">
                <Img
                  src="https://images.unsplash.com/photo-1490682143684-14369e18dce8?q=80&w=1200&auto=format&fit=crop"
                  alt="Golden light over mountains on the Vatnajökull horizon"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                  fallbackClassName="aspect-[4/3] w-full bg-gradient-to-br from-[#a9cfd6] via-[#6fa3b0] to-[#3f5359]"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* VOICES */}
        <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal className="text-center">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#a94f24] uppercase">
              Raddir gesta / Voices
            </p>
            <h2 className="mt-4 font-editorial text-3xl leading-tight text-[#2b211c] md:text-5xl">
              A 27-year favourite
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-[1.75rem] bg-white p-7 shadow-sm ring-1 ring-[#efe2cf] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#2b211c]/10">
                  <div className="flex gap-1 text-[#c5612f]" role="img" aria-label="Rated 5 out of 5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-base leading-relaxed text-[#3f342b]">
                    &ldquo;{r.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-[#efe2cf] pt-4 text-sm">
                    <span className="font-semibold text-[#2b211c]">{r.name}</span>
                    <span className="block text-[#6f6055]">{r.from}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* RESERVATIONS / HOURS — final CTA */}
        <section id="bokun" className="scroll-mt-20 bg-[#a94f24] text-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:gap-16 md:px-8 md:py-28">
            <Reveal>
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-white/80 uppercase">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Bókun & opnunartímar
              </p>
              <h2 className="mt-4 font-editorial text-4xl leading-tight md:text-6xl">
                Save the corner table
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white">
                Reserve ahead in summer — the dining room is cosy and fills up. Or just call from the
                road; we&rsquo;ll keep the coffee warm.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:info@kaffihornid.is?subject=Bókun%20%E2%80%94%20Kaffi%20Horni%C3%B0&body=Dagsetning%3A%0AT%C3%ADmi%3A%0AFj%C3%B6ldi%20gesta%3A%0ANafn%3A"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#a94f24] shadow-lg shadow-black/15 transition-all hover:-translate-y-0.5 hover:bg-[#fff3e6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  lang="is"
                >
                  Bóka borð
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <a
                  href={TEL}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-white"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  +354 478 2600
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-[2rem] bg-white p-7 text-[#2b211c] shadow-2xl shadow-black/20 md:p-9">
                <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-[#a94f24] uppercase">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  Opnunartímar / Hours
                </p>
                <dl className="mt-5 divide-y divide-[#efe2cf]">
                  {HOURS.map(([is, en, time]) => (
                    <div key={en} className="flex items-baseline justify-between gap-4 py-3.5">
                      <dt>
                        <span className="block text-sm font-semibold text-[#2b211c]" lang="is">
                          {is}
                        </span>
                        <span className="block text-xs text-[#6f6055]">{en}</span>
                      </dt>
                      <dd className="font-editorial text-lg whitespace-nowrap text-[#a94f24]">{time}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 flex items-start gap-2 rounded-2xl bg-[#fff7ec] px-4 py-3 text-xs leading-relaxed text-[#6f6055]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#6fa3b0]" aria-hidden="true" />
                  Hafnarbraut 42, 780 Höfn í Hornafirði — by the harbour, under the glacier.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}
