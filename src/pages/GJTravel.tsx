import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Bus,
  Clock,
  Leaf,
  Map,
  Phone,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'
import { getCompany } from '../data/companies'
import { brandOffsetClass, setThemeColor } from '../lib/preview'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { SendPreview } from '../components/SendPreview'
import { StickyCta } from '../components/StickyCta'
import { BackChip, ProtoFooter, WantRedesign } from '../components/Proto'

const company = getCompany('gj-travel')

const TIMELINE = [
  ['1929', 'Guðmundur Jónasson begins driving Iceland’s first mountain routes.'],
  ['1950s', 'Pioneering glacier and highland crossings, years before the bridges came.'],
  ['1970s', 'A full coach fleet takes travellers where ordinary buses cannot go.'],
  ['1990s', 'Incoming agency for the world — groups, guides, multiple languages.'],
  ['2010s', 'Greenland and the Faroe Islands join the map.'],
  ['Today', 'Modern fleet, greener journeys, the same standards.'],
]

const SERVICES = [
  {
    num: '01',
    icon: Map,
    title: 'Day tours',
    desc: 'Golden Circle, south coast, northern lights — classic routes run with uncommon care.',
  },
  {
    num: '02',
    icon: Bus,
    title: 'Grand journeys',
    desc: 'Multi-day guided tours around the ring road, the Westfjords and beyond, summer and winter.',
  },
  {
    num: '03',
    icon: Users,
    title: 'Private & groups',
    desc: 'Tailored itineraries with your own guide and coach — in English, German, Spanish or Portuguese.',
  },
  {
    num: '04',
    icon: Briefcase,
    title: 'Meetings & incentives',
    desc: 'Conferences and corporate travel handled end to end — transfers, venues, contingencies.',
  },
]

const TOURS = [
  {
    title: 'Golden Circle Classic',
    meta: 'Day tour · from Reykjavík',
    desc: 'Þingvellir, Geysir and Gullfoss with a guide who has driven this road a thousand times and still loves it.',
    price: 'from 13.900 kr.',
    img: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Grand Tour of Iceland',
    meta: '8 days · ring road',
    desc: 'The whole country in one unhurried loop — glaciers, fjords, whale country and the geothermal north.',
    price: 'from 349.000 kr.',
    img: 'https://images.unsplash.com/photo-1500043357865-c6b8827edf10?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Winter Lights & Ice',
    meta: '5 days · Sep – Apr',
    desc: 'Ice caves, frozen waterfalls and aurora hunting with drivers trained for Icelandic winters.',
    price: 'from 215.000 kr.',
    img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1200&auto=format&fit=crop',
  },
]

const QUOTES = [
  {
    text: 'We brought 42 colleagues from three countries. Every transfer, every meal, every contingency was already handled before we thought to ask.',
    name: 'Event organiser · corporate group, Germany',
  },
  {
    text: 'Our driver-guide had been doing highland routes for 30 years. You cannot buy that kind of calm when a storm rolls in.',
    name: 'Robert & Ellen · 8-day grand tour',
  },
  {
    text: 'Booked late, changed dates twice, got a personal reply within the hour each time. Old-school service, modern speed.',
    name: 'Priya S. · winter package',
  },
]

export default function GJTravel() {
  useEffect(() => {
    document.title = 'GJ Travel — Redesign Concept'
    setThemeColor('#ffffff')
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-[#10243e]">
      <BackChip />
      <SendPreview company={company} />
      <StickyCta
        label="Iceland’s veteran tour operator"
        button="Plan a trip"
        href="#book"
        buttonClassName="bg-[#0b2545] text-white shadow-[#0b2545]/30"
      />

      {/* Top rule + nav */}
      <div className="h-1.5 bg-[#0b2545]" />
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-slate-200 px-5 py-5 md:px-8">
        <div className={`${brandOffsetClass()} flex items-baseline gap-3`}>
          <span className="text-lg font-extrabold tracking-tight">GJ TRAVEL</span>
          <span className="hidden text-[11px] tracking-[0.22em] text-slate-500 uppercase md:inline">
            Guðmundur Jónasson Travel · Iceland
          </span>
        </div>
        <a
          href="#book"
          className="hidden rounded-full bg-[#0b2545] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#163a66] md:inline-flex"
        >
          Plan a trip
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-20 md:px-8 md:pt-20 md:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <span className="h-px w-10 bg-[#b08d57]" />
              <p className="text-[11px] font-semibold tracking-[0.3em] text-[#8a6a3b] uppercase">
                Iceland · Greenland · Faroe Islands
              </p>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-6 text-5xl leading-[1.02] font-extrabold tracking-tight text-balance md:text-6xl lg:text-7xl"
            >
              Iceland, organised <span className="text-[#b08d57]">properly.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="mt-6 max-w-md text-base leading-relaxed text-slate-600 md:text-lg"
            >
              Day tours, grand journeys and group travel from the operator that has been on
              Iceland’s roads since 1929 — with its own fleet and its own standards.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#tours"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0b2545] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#0b2545]/20 transition-all hover:-translate-y-0.5 hover:bg-[#163a66]"
              >
                Explore tours
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#book"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-8 py-4 text-sm font-semibold transition-colors hover:border-[#0b2545] hover:bg-slate-50"
              >
                Plan group travel
              </a>
            </motion.div>
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="mt-9 flex flex-wrap gap-2"
            >
              {['IATA', 'USTOA', 'SAF', 'Safe Travel certified'].map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-slate-500 uppercase"
                >
                  {c}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl">
              <Img
                src="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1400&auto=format&fit=crop"
                srcSet="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=828&auto=format&fit=crop 828w, https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1400&auto=format&fit=crop 1400w"
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt="A snow-capped peak rising over open Icelandic moorland"
                className="aspect-[4/5] w-full object-cover md:aspect-[3/2] lg:aspect-[5/6]"
                loading="eager"
                fetchpriority="high"
                fallbackClassName="bg-gradient-to-br from-slate-300 via-slate-400 to-[#0b2545]"
              />
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-2xl border-l-4 border-[#b08d57] bg-white px-6 py-4 shadow-xl md:-left-8">
              <p className="font-grotesk text-3xl font-bold text-[#0b2545]">97</p>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                years on the road
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#0b2545] py-24 text-white md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
              A century in the making
            </h2>
            <p className="inline-flex items-center gap-2 text-sm text-white/60">Scroll sideways<ArrowRight className="h-4 w-4" /></p>
          </Reveal>
        </div>
        <div className="scrollbar-none mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-pl-5 px-5 pb-4 md:scroll-pl-[max(2rem,calc((100vw-72rem)/2+2rem))] md:px-[max(2rem,calc((100vw-72rem)/2+2rem))]">
          {TIMELINE.map(([year, text]) => (
            <article
              key={year}
              className="w-[78vw] max-w-[330px] shrink-0 snap-start rounded-2xl border border-white/10 bg-white/[0.05] p-7 transition-colors hover:border-[#b08d57]/60"
            >
              <p className="font-grotesk text-4xl font-bold text-[#d8b478]">{year}</p>
              <div className="mt-4 h-px w-12 bg-[#b08d57]" />
              <p className="mt-4 text-sm leading-relaxed text-white/75">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-[#8a6a3b] uppercase">What we do</p>
          <h2 className="mt-4 max-w-xl text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            Four ways to see the north
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.08}>
              <div className="group border-t-2 border-slate-200 pt-6 transition-colors hover:border-[#b08d57]">
                <div className="flex items-center justify-between">
                  <span className="font-grotesk text-sm font-bold text-slate-300 transition-colors group-hover:text-[#b08d57]">
                    {s.num}
                  </span>
                  <s.icon className="h-5 w-5 text-[#0b2545]" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats / why */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <Reveal>
                <p className="text-[11px] font-semibold tracking-[0.3em] text-[#8a6a3b] uppercase">Why GJ Travel</p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
                  Experience is the one thing you can’t improvise
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600">
                  Weather turns, roads close, plans shift — and a company that has crossed unbridged
                  glacier rivers simply does not panic. That calm is what you’re really booking.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <ul className="mt-8 space-y-3.5 text-sm font-medium">
                  {[
                    { icon: Bus, label: 'Own fleet — 3-seaters to 63-seat coaches, highland 4x4s, one beloved antique bus' },
                    { icon: ShieldCheck, label: 'Licensed, certified and insured to international standards' },
                    { icon: Users, label: 'Guides in English, German, Spanish & Portuguese' },
                    { icon: Leaf, label: 'Carbon offsetting through the Katla reforestation project' },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#b08d57]" />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                ['1929', 'year established'],
                ['63', 'seats in the largest coach'],
                ['3', 'countries served'],
                ['4.9★', 'TripAdvisor rating'],
              ].map(([big, small], i) => (
                <Reveal key={small} delay={i * 0.07}>
                  <div className="rounded-2xl border border-slate-200 bg-white p-7 text-center transition-colors duration-300 hover:border-[#b08d57]">
                    <p className="font-grotesk text-4xl font-bold text-[#0b2545] md:text-5xl">{big}</p>
                    <p className="mt-2 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">{small}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured tours */}
      <section id="tours" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#8a6a3b] uppercase">Featured departures</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance md:text-5xl">Start with the classics</h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-500">
            Fixed departures year-round, or any of them rebuilt privately for your group.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TOURS.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08}>
              <a
                href="#book"
                className="group block h-full overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <Img
                    src={t.img}
                    alt={t.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    fallbackClassName="bg-gradient-to-br from-slate-300 to-[#0b2545]"
                  />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#0b2545]/85 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
                    <Clock className="h-3 w-3 text-[#d8b478]" />
                    {t.meta}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-grotesk text-sm font-bold text-[#0b2545]">{t.price}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8a6a3b] transition-all group-hover:gap-3">
                      View tour <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="text-center text-[11px] font-semibold tracking-[0.3em] text-[#8a6a3b] uppercase">
              In their words
            </p>
            <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
              Trusted by travellers & planners
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {QUOTES.map((q, i) => (
              <Reveal key={q.name} delay={i * 0.1}>
                <figure className="h-full rounded-3xl border border-slate-200 bg-white p-7">
                  <div role="img" aria-label="Rated 5 out of 5" className="flex gap-1 text-[#b08d57]">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed text-slate-700">“{q.text}”</blockquote>
                  <figcaption className="mt-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    {q.name}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Atmosphere */}
      <section className="relative overflow-hidden py-32 md:py-44">
        <Img
          src="https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=2000&auto=format&fit=crop"
          alt="Moss-covered river canyon in the Icelandic interior"
          className="absolute inset-0 h-full w-full object-cover"
          fallbackClassName="absolute inset-0 bg-gradient-to-br from-slate-500 via-[#1d3b5c] to-[#0b2545]"
        />
        <div className="absolute inset-0 bg-[#0b2545]/75" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center text-white">
          <Reveal>
            <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-balance md:text-6xl">
              The highlands taught us everything.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85">
              Before the bridges, before GPS, GJ drivers were crossing glacier rivers with
              travellers aboard. Ninety-seven years later, that knowledge rides with every tour.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section id="book" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <div className="grid overflow-hidden rounded-[2.5rem] bg-[#0b2545] text-white md:grid-cols-2">
            <div className="p-9 md:p-14">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-[#d8b478] uppercase">Start planning</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
                Plan with people who’ve seen it all
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                Tell us who’s travelling and when. A fast, personal reply has been the GJ trademark
                since 1929.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:gjtravel@gjtravel.is?subject=Group%20proposal%20request&body=Group%20size%3A%0ADates%3A%0AInterests%3A"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#b08d57] px-8 py-4 text-sm font-semibold text-[#0b2545] transition-all hover:-translate-y-0.5 hover:bg-[#c9a86d]"
                >
                  Request a proposal
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="tel:+3545205200"
                  className="font-grotesk inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold transition-colors hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" />
                  +354 520 5200
                </a>
              </div>
            </div>
            <div className="relative hidden md:block">
              <Img
                src="https://images.unsplash.com/photo-1483347756197-71ef80e95f73?q=80&w=1200&auto=format&fit=crop"
                alt="Northern lights over Iceland"
                className="absolute inset-0 h-full w-full object-cover"
                fallbackClassName="absolute inset-0 bg-gradient-to-br from-emerald-900 to-[#0b2545]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b2545] to-transparent" />
            </div>
          </div>
        </Reveal>
      </section>

      <WantRedesign company={company} accentClassName="bg-[#0b2545] text-white hover:bg-[#163a66]" />
      <ProtoFooter company={company} />
    </div>
  )
}
