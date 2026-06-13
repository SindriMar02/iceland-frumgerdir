import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BedDouble,
  Car,
  Check,
  Coffee,
  Footprints,
  MapPin,
  Mountain,
  Phone,
  Star,
  Utensils,
  Waves,
  X,
} from 'lucide-react'
import { getCompany } from '../data/companies'
import { brandOffsetClass, setThemeColor } from '../lib/preview'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { SendPreview } from '../components/SendPreview'
import { StickyCta } from '../components/StickyCta'
import { BackChip, ProtoFooter, WantRedesign } from '../components/Proto'

const company = getCompany('guesthouse-carina')

const PERKS = [
  { icon: Waves, label: 'Walk to the black beach' },
  { icon: Coffee, label: 'Homemade breakfast' },
  { icon: Car, label: 'Free parking' },
  { icon: Footprints, label: 'Shoes off, slippers on' },
]

const ROOMS = [
  {
    title: 'Cosy Single',
    desc: 'Everything one traveller needs after a long day on the south coast — warm, quiet, spotless.',
    detail: 'Shared bathroom · mountain or town view',
    price: 'from €90',
    img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Double & Twin',
    desc: 'Our most-loved rooms. Big windows facing the cliffs or the sea, beds you will write home about.',
    detail: 'Shared bathroom · cliff, ocean or town view',
    price: 'from €130',
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Family Room',
    desc: 'Sleeps five, with your own private bathroom — the whole crew under one warm roof in Vík.',
    detail: 'Private bathroom · sleeps 5',
    price: 'from €370',
    img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop',
  },
]

const OTA = [
  'Commission baked into your price',
  'No contact with hosts until arrival',
  'Generic listing, generic answers',
  'Requests lost in a ticket system',
]

const DIRECT = [
  'Our best available rate, always',
  'A real host answers before you book',
  'Honest local advice for your route',
  'Breakfast & special requests, sorted',
]

const NEARBY = [
  {
    title: 'Reynisfjara',
    desc: 'The famous black-sand beach with basalt columns and roaring Atlantic surf.',
    dist: '10 min drive',
    img: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Dyrhólaey',
    desc: 'A volcanic arch over the sea, puffin cliffs in summer, views forever.',
    dist: '20 min drive',
    img: 'https://images.unsplash.com/photo-1500043357865-c6b8827edf10?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Skógafoss',
    desc: 'Sixty metres of falling water and a staircase to the top. Go early, beat the buses.',
    dist: '30 min drive',
    img: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Katla Ice Cave',
    desc: 'Black-and-blue glacier ice under the volcano — tours leave from Vík itself.',
    dist: 'Tours from town',
    img: 'https://images.unsplash.com/photo-1494564605686-2e931f77a8e2?q=80&w=1200&auto=format&fit=crop',
  },
]

const REVIEWS = [
  {
    score: '9.6',
    title: 'Exceptional',
    text: 'The glass dining room at breakfast, with the cliffs right there — we sat for an hour after eating. Felt like staying with friends.',
    name: 'Hannah · Netherlands',
  },
  {
    score: '9.4',
    title: 'Wonderful',
    text: 'We walked the black beach below town at sunrise, then beat every bus to Reynisfjara.',
    name: 'Diego & Marta · Spain',
  },
  {
    score: '9.8',
    title: 'Like home',
    text: 'Slippers at the door, waffles in the morning, honest tips on what to skip. Booking direct was the best decision of our trip.',
    name: 'Allison · USA',
  },
]

export default function GuesthouseCarina() {
  useEffect(() => {
    document.title = 'Guesthouse Carina — Redesign Concept'
    setThemeColor('#fcfaf6')
  }, [])

  return (
    <div className="min-h-screen bg-[#fcfaf6] font-sans text-[#22303a]">
      <BackChip />
      <SendPreview company={company} />
      <StickyCta
        label="Guesthouse Carina · Vík"
        button="Book direct"
        href="#book"
        buttonClassName="bg-[#1f4e5b] text-white shadow-[#1f4e5b]/30"
        barClassName="bg-[#fcfaf6]/90 text-[#22303a] border-t border-[#e7e0d3]"
      />

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <div className={brandOffsetClass()}>
          <span className="font-editorial text-xl font-semibold">Guesthouse Carina</span>
          <span className="ml-2.5 hidden text-xs tracking-[0.2em] text-[#9a8d77] uppercase sm:inline">Vík í Mýrdal</span>
        </div>
        <a
          href="#book"
          className="hidden rounded-full bg-[#1f4e5b] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a6376] md:inline-flex"
        >
          Book direct
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-6 pb-20 md:px-8 md:pt-12 md:pb-28">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-[11px] font-semibold tracking-[0.22em] text-balance text-[#9a8d77] uppercase sm:tracking-[0.3em]"
            >
              Family-run guesthouse · Est. 2015 in a 1956 home
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-5 font-editorial text-5xl leading-[1.06] font-medium text-balance md:text-6xl lg:text-7xl"
            >
              Wake up where the black sand meets the sea
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="mt-5 max-w-md text-base leading-relaxed text-[#5b6470]"
            >
              Fourteen warm rooms in the heart of Vík — five minutes on foot from the black sand,
              with breakfast in a glass room facing the cliffs.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a
                href="#book"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#1f4e5b] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#1f4e5b]/25 transition-all hover:-translate-y-0.5 hover:bg-[#2a6376]"
              >
                Check availability
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#rooms"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8cfbe] px-8 py-4 text-sm font-semibold text-[#22303a] transition-colors hover:border-[#1f4e5b]/40 hover:bg-white"
              >
                See the rooms
              </a>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="mt-5 text-xs text-[#7a6d57]"
            >
              Best price when you book direct · Personal reply from your hosts
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2.5rem] rounded-tr-[6rem]">
              <Img
                src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1400&auto=format&fit=crop"
                srcSet="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=828&auto=format&fit=crop 828w, https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1400&auto=format&fit=crop 1400w"
                sizes="(min-width: 768px) 50vw, 100vw"
                alt="A bright, calm guesthouse bedroom with crisp white bedding"
                className="aspect-[4/5] w-full object-cover"
                loading="eager"
                fetchpriority="high"
                fallbackClassName="bg-gradient-to-br from-[#dfd5c2] to-[#7e8d94]"
              />
            </div>
            <div className="absolute -bottom-6 left-4 flex items-center gap-4 rounded-2xl bg-white/90 px-5 py-4 shadow-xl shadow-[#22303a]/10 backdrop-blur-md md:-left-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f4e5b] font-editorial text-lg font-semibold text-white">
                9.4
              </span>
              <span>
                <span className="block text-sm font-semibold">“Wonderful”</span>
                <span className="flex items-center gap-1 text-xs text-[#7a6d57]">
                  <Star className="h-3 w-3 fill-[#d9a441] text-[#d9a441]" />
                  guest rating · sample
                </span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Perk strip */}
        <Reveal className="mt-20">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {PERKS.map((p) => (
              <li
                key={p.label}
                className="flex items-center gap-3 rounded-2xl border border-[#e7e0d3] bg-white px-5 py-4 text-sm font-medium transition-colors hover:border-[#1f4e5b]/40"
              >
                <p.icon className="h-5 w-5 shrink-0 text-[#1f4e5b]" />
                {p.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Rooms */}
      <section id="rooms" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#9a8d77] uppercase">The rooms</p>
            <h2 className="mt-4 font-editorial text-4xl font-medium text-balance md:text-5xl">Fourteen rooms, one warm house</h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[#5b6470]">
            Every room with free Wi-Fi and a view — mountains, cliffs, town or ocean.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ROOMS.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <a href="#book" className="group block h-full">
                <article className="h-full overflow-hidden rounded-[1.75rem] border border-[#e7e0d3] bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#22303a]/8">
                  <div className="overflow-hidden">
                    <Img
                      src={r.img}
                      alt={r.title}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      fallbackClassName="bg-gradient-to-br from-[#e8e0d2] to-[#9aa8ad]"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-editorial text-2xl font-medium">{r.title}</h3>
                      <BedDouble className="h-5 w-5 text-[#9a8d77]" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[#5b6470]">{r.desc}</p>
                    <p className="mt-3 text-xs tracking-wide text-[#7a6d57] uppercase">{r.detail}</p>
                    <p className="mt-4 text-sm font-bold text-[#1f4e5b]">{r.price} / night</p>
                  </div>
                </article>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why us / breakfast */}
      <section className="bg-[#f4efe5] py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-[2.5rem]">
              <Img
                src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1400&auto=format&fit=crop"
                alt="A homemade breakfast spread on a wooden table"
                className="aspect-[4/3] w-full object-cover"
                fallbackClassName="bg-gradient-to-br from-[#e8d9bd] to-[#a98e63]"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#9a8d77] uppercase">Mornings at Carina</p>
            <h2 className="mt-4 font-editorial text-4xl leading-[1.1] font-medium text-balance md:text-5xl">
              Rye bread, waffles, and a glass room full of mountains
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#5b6470]">
              Breakfast is served in our panoramic glass dining room — homemade Icelandic rye bread,
              fresh waffles off the iron, and a view that makes everyone late for their day trip.
            </p>
            <ul className="mt-8 space-y-3.5 text-sm font-medium">
              {[
                { icon: Utensils, label: 'Rye bread baked here, waffles off the iron — €20 per person' },
                { icon: Mountain, label: 'Panoramic lounge facing Reynisfjall' },
                { icon: Coffee, label: 'Leaving early for the ice cave? Breakfast packed to go' },
                { icon: Phone, label: 'Hosts one call away, before and during your stay' },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#1f4e5b]" />
                  {item.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Direct booking comparison */}
      <section className="bg-[#1f4e5b] py-24 text-white md:py-32">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <Reveal className="text-center">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#a8c6ce] uppercase">Book smarter</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-editorial text-4xl font-medium text-balance md:text-5xl">
              Booking sites sell you a room. We host your stay.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Reveal delay={0.05}>
              <div className="h-full rounded-[1.75rem] border border-white/15 bg-white/5 p-7 md:p-9">
                <p className="text-sm font-semibold tracking-wide text-white/60 uppercase">Through a booking site</p>
                <ul className="mt-6 space-y-4">
                  {OTA.map((li) => (
                    <li key={li} className="flex items-start gap-3 text-sm text-white/65">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative h-full rounded-[1.75rem] bg-white p-7 text-[#22303a] shadow-2xl md:p-9">
                <span className="absolute -top-3 right-6 rounded-full bg-[#d9a441] px-3.5 py-1 text-[11px] font-bold tracking-wide text-[#22303a] uppercase">
                  Recommended
                </span>
                <p className="text-sm font-semibold tracking-wide text-[#1f4e5b] uppercase">Directly with us</p>
                <ul className="mt-6 space-y-4">
                  {DIRECT.map((li) => (
                    <li key={li} className="flex items-start gap-3 text-sm font-medium">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1f4e5b]" />
                      {li}
                    </li>
                  ))}
                </ul>
                <a
                  href="#book"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1f4e5b] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2a6376]"
                >
                  Book direct <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Around Vík */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#9a8d77] uppercase">Your basecamp</p>
            <h2 className="mt-4 font-editorial text-4xl font-medium text-balance md:text-5xl">All of the south coast, from one bed</h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {NEARBY.map((n, i) => (
            <Reveal key={n.title} delay={i * 0.07}>
              <article className="group relative h-80 overflow-hidden rounded-[1.75rem]">
                <Img
                  src={n.img}
                  alt={n.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                  fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#54616b] to-[#22303a]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101b22]/90 via-[#101b22]/20 to-transparent" />
                <div className="absolute right-5 bottom-5 left-5 text-white">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur-md">
                    <MapPin className="h-3 w-3" />
                    {n.dist}
                  </span>
                  <h3 className="mt-2.5 font-editorial text-2xl font-medium">{n.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/75 lg:opacity-0 lg:transition-opacity lg:duration-500 lg:group-hover:opacity-100">
                    {n.desc}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-[#f4efe5] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="text-center text-[11px] font-semibold tracking-[0.3em] text-[#9a8d77] uppercase">Guest words</p>
            <h2 className="mt-4 text-center font-editorial text-4xl font-medium text-balance md:text-5xl">Why people come back</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.1}>
                <figure className="h-full rounded-[1.75rem] bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1f4e5b] font-editorial text-base font-semibold text-white">
                      {r.score}
                    </span>
                    <span className="font-editorial text-lg font-medium">“{r.title}”</span>
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed text-[#5b6470]">“{r.text}”</blockquote>
                  <figcaption className="mt-4 text-xs font-semibold tracking-wide text-[#7a6d57] uppercase">
                    {r.name}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="book" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1f4e5b] px-7 py-16 text-center text-white md:px-16 md:py-20">
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#d9a441]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#a8c6ce] uppercase">Mýrarbraut 13 · 870 Vík</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-editorial text-4xl font-medium text-balance md:text-5xl">
              Vík is waiting. So is your room.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70">
              Send us your dates and we’ll reply personally — usually within hours, always with our
              best price.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:info@guesthousecarina.is?subject=Availability%20request&body=Dates%3A%0AGuests%3A%0ARoom%20type%3A"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-9 py-4 text-sm font-semibold text-[#1f4e5b] shadow-xl transition-all hover:-translate-y-0.5"
              >
                Check availability
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="tel:+3546990961"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-9 py-4 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                +354 699 0961
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <WantRedesign company={company} accentClassName="bg-[#1f4e5b] text-white hover:bg-[#2a6376]" />
      <ProtoFooter company={company} />
    </div>
  )
}
