import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  Bath,
  Bed,
  Coffee,
  Flower2,
  Heart,
  MapPin,
  Moon,
  PawPrint,
  Sparkles,
  Star,
  Users,
  Utensils,
  Wifi,
} from 'lucide-react'
import { getCompany } from '../data/companies'
import { brandOffsetClass, setThemeColor } from '../lib/preview'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { SendPreview } from '../components/SendPreview'
import { StickyCta } from '../components/StickyCta'
import { BackChip, ProtoFooter, WantRedesign } from '../components/Proto'

const company = getCompany('daeli-farm')

const MARQUEE = [
  'fresh mountain air',
  'home-baked mornings',
  'midnight sun',
  'northern lights',
  'horses at the fence',
  'hot tub under the stars',
  'a valley to yourselves',
]

const POLAROIDS = [
  {
    img: 'https://images.unsplash.com/photo-1519092437326-bfd121eb53ae?q=80&w=900&auto=format&fit=crop',
    caption: 'The valley, July, 23:30',
    rotate: '-rotate-3',
  },
  {
    img: 'https://images.unsplash.com/photo-1598900154122-a6dad15d17d6?q=80&w=900&auto=format&fit=crop',
    caption: 'Morning regulars',
    rotate: 'rotate-2',
  },
  {
    img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=900&auto=format&fit=crop',
    caption: 'Winter nights, from the hot tub',
    rotate: '-rotate-1',
  },
]

const STAYS = [
  {
    title: 'Farmhouse rooms',
    desc: 'Warm, simple rooms in the main house — wake to the smell of breakfast and the sound of absolutely nothing.',
    price: 'from 18.900 kr / night',
    img: 'https://images.unsplash.com/photo-1631940182015-6604116ead7d?q=80&w=1200&auto=format&fit=crop',
    amenities: [Bed, Wifi, Coffee],
  },
  {
    title: 'Countryside cottages',
    desc: 'Your own little house with a kitchen, a porch and a view that goes on for kilometres. Sleep with the curtains open.',
    price: 'from 27.900 kr / night',
    img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop',
    amenities: [Bed, Utensils, Bath],
  },
  {
    title: 'Family stay',
    desc: 'Room for everyone — kids meet the animals in the morning, parents meet the hot tub in the evening.',
    price: 'from 32.900 kr / night',
    img: 'https://images.unsplash.com/photo-1727706572437-4fcda0cbd66f?q=80&w=1200&auto=format&fit=crop',
    amenities: [Bed, Users, Bath],
  },
]

const AMENITY_LABELS = new Map([
  [Bed, 'Comfortable beds'],
  [Wifi, 'Wi-Fi'],
  [Coffee, 'Coffee & kettle'],
  [Utensils, 'Kitchen'],
  [Bath, 'Hot tub access'],
  [Users, 'Sleeps the whole family'],
])

const FARM_LIFE = [
  {
    icon: PawPrint,
    title: 'Lambing in spring',
    desc: 'May fills the barn with newborn lambs — guests are welcome at feeding time.',
  },
  {
    icon: Heart,
    title: 'Horses at the fence',
    desc: 'The farm horses are shameless attention-seekers. Bring your camera, lose an hour.',
  },
  {
    icon: Flower2,
    title: 'Valley walks',
    desc: 'Berry slopes in August, birdsong in June, and a river that has never been in a hurry.',
  },
  {
    icon: Moon,
    title: 'Aurora from the hot tub',
    desc: 'In winter the lights often come to you — warm water, cold air, green sky.',
  },
]

const REVIEWS = [
  {
    text: 'We came for one night on the way to Akureyri and stayed three. The family treated our kids like their own grandchildren.',
    name: 'Famille Moreau',
    origin: 'France',
  },
  {
    text: 'The silence is real. We sat on the porch at midnight in full daylight and just… breathed.',
    name: 'Jonas & Erik',
    origin: 'Germany',
  },
  {
    text: 'Best sleep of our whole Iceland trip, and the homemade breakfast bread should be illegal.',
    name: 'Sarah P.',
    origin: 'Canada',
  },
]

const NEARBY = [
  ['Route 1 — Ring Road', '6 km'],
  ['Kolugljúfur canyon', '20 min'],
  ['Hvítserkur sea stack', '40 min'],
  ['Seal watching, Vatnsnes', '45 min'],
  ['Midway Reykjavík – Akureyri', '≈2½ hrs either way'],
]

export default function DaeliFarm() {
  useEffect(() => {
    document.title = 'Dæli Farm — Redesign Concept'
    setThemeColor('#faf6ee')
  }, [])

  return (
    <div className="min-h-screen bg-[#faf6ee] font-sans text-[#2d2721]">
      <BackChip />
      <SendPreview company={company} />
      <StickyCta
        label="Dæli farm stay · Víðidalur"
        button="Book your stay"
        href="#book"
        buttonClassName="bg-[#c05f33] text-white shadow-[#c05f33]/30"
        barClassName="bg-[#faf6ee]/90 text-[#2d2721] border-t border-[#e5dcc9]"
      />

      {/* Nav */}
      <header className="flex items-center justify-between px-5 pt-5 pb-2 md:px-8">
        <div className={brandOffsetClass()}>
          <span className="font-display text-2xl font-semibold italic">Dæli</span>
          <span className="ml-2.5 hidden text-xs tracking-[0.22em] text-[#6b6051] uppercase sm:inline">
            farm stay · Víðidalur
          </span>
        </div>
        <a
          href="#book"
          className="hidden rounded-full bg-[#41502f] px-5 py-2.5 text-sm font-medium text-[#f5f1e4] transition-colors hover:bg-[#54663d] md:inline-flex"
        >
          Book your stay
        </a>
      </header>

      {/* Hero — framed, like a photograph pinned to paper */}
      <section className="px-3 pt-2 md:px-5">
        <div className="relative min-h-[88svh] overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem]">
          <Img
            src="https://images.unsplash.com/photo-1598208083114-991498347e6d?q=80&w=2000&auto=format&fit=crop"
            srcSet="https://images.unsplash.com/photo-1598208083114-991498347e6d?q=80&w=828&auto=format&fit=crop 828w, https://images.unsplash.com/photo-1598208083114-991498347e6d?q=80&w=1280&auto=format&fit=crop 1280w, https://images.unsplash.com/photo-1598208083114-991498347e6d?q=80&w=2000&auto=format&fit=crop 2000w"
            sizes="100vw"
            fetchpriority="high"
            alt="Hay bales in a green Icelandic farm valley in evening light"
            className="kenburns absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fallbackClassName="absolute inset-0 bg-gradient-to-b from-amber-200 via-[#b9a77c] to-[#5c5a3c]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#211c14]/85 via-[#211c14]/15 to-transparent" />

          <div className="relative z-10 flex min-h-[88svh] flex-col justify-end p-6 pb-12 md:p-14 md:pb-16">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#faf6ee]/15 px-4 py-2 text-[11px] font-semibold tracking-[0.22em] text-[#f5edd8] uppercase backdrop-blur-md"
            >
              <PawPrint className="h-3.5 w-3.5" />
              Working family farm<span className="hidden sm:inline"> · Northwest Iceland</span>
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="mt-5 max-w-3xl font-display text-5xl leading-[1.04] font-medium text-balance text-[#fdf9ee] md:text-7xl"
            >
              The quietest place you’ll <em className="italic">ever</em> wake up
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-[#f1e9d6]/90 md:text-lg"
            >
              Dæli is a working farm in Víðidalur, kept by the same family since 1988 — six
              kilometres off the Ring Road, and a world away from it.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.8 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#book"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#c05f33] px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-black/25 transition-all hover:-translate-y-0.5 hover:bg-[#d06c3e]"
              >
                Book your stay
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#farm-life"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#faf6ee]/15 px-8 py-4 text-sm font-semibold text-[#fdf9ee] backdrop-blur-md transition-colors hover:bg-[#faf6ee]/25"
              >
                Meet the farm
                <ArrowDown className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="mt-6 overflow-hidden border-y border-[#e5dcc9] bg-[#41502f] py-3.5">
        <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex items-center gap-8">
              {MARQUEE.map((m) => (
                <span
                  key={m}
                  className="flex items-center gap-8 font-display text-sm tracking-wide text-[#e9e4cf] italic"
                >
                  {m}
                  <Sparkles className="h-3.5 w-3.5 text-[#c9b97a]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hook + polaroids */}
      <section className="mx-auto max-w-5xl px-5 py-24 text-center md:py-32">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.3em] text-[#7d684c] uppercase">The Dæli effect</p>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl leading-[1.1] font-medium text-balance md:text-6xl">
            When did you last hear <em className="text-[#c05f33] italic">nothing at all?</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#6b6051]">
            No traffic, no crowds, no schedule. Just a wide green valley, animals going about
            their morning, and a family that has welcomed travellers for nearly forty years.
            Guests book one night on the way north — and find the stop was the destination.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-5 md:gap-10">
          {POLAROIDS.map((p, i) => (
            <Reveal key={p.caption} delay={i * 0.12} className="w-full max-w-64">
              <figure
                className={`${p.rotate} w-full rounded-md bg-white p-3 pb-4 shadow-xl shadow-[#3a3120]/15 transition-transform duration-500 hover:rotate-0 hover:scale-[1.04]`}
              >
                <Img
                  src={p.img}
                  alt={p.caption}
                  className="aspect-square w-full rounded-sm object-cover"
                  fallbackClassName="bg-gradient-to-br from-amber-200 to-stone-400"
                />
                <figcaption className="mt-3 font-display text-sm text-[#6b6051] italic">{p.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stays */}
      <section className="bg-[#f3ecdd] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] text-[#7d684c] uppercase">Stay with us</p>
              <h2 className="mt-4 font-display text-4xl font-medium md:text-5xl">Three ways to slow down</h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-[#6b6051]">
              Book directly with us — you’ll always get our best price and a real answer.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STAYS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <article className="group h-full overflow-hidden rounded-[1.75rem] bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#3a3120]/10">
                  <div className="overflow-hidden">
                    <Img
                      src={s.img}
                      alt={s.title}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      fallbackClassName="bg-gradient-to-br from-amber-100 to-stone-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 text-[#8a7f6c]">
                      {s.amenities.map((A, idx) => (
                        <span key={idx} title={AMENITY_LABELS.get(A)} className="rounded-full bg-[#f3ecdd] p-2">
                          <A className="h-4 w-4" />
                          <span className="sr-only">{AMENITY_LABELS.get(A)}</span>
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-medium">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#6b6051]">{s.desc}</p>
                    <p className="mt-4 text-sm font-bold text-[#a84f28]">{s.price}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Farm life */}
      <section id="farm-life" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="text-center text-xs font-semibold tracking-[0.3em] text-[#7d684c] uppercase">Farm life</p>
          <h2 className="mx-auto mt-4 max-w-xl text-center font-display text-4xl leading-[1.1] font-medium text-balance md:text-5xl">
            Things no booking site can give you
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FARM_LIFE.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="h-full rounded-[1.75rem] border border-[#e5dcc9] bg-white/60 p-7 transition-colors hover:border-[#c9b97a] hover:bg-white">
                <span className="inline-flex rounded-full bg-[#41502f] p-3 text-[#e9e4cf]">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b6051]">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Hosts / why */}
      <section className="bg-[#41502f] py-24 text-[#f1edda] md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.3em] text-[#c9b97a] uppercase">Your hosts</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.1] font-medium text-balance md:text-5xl">
              You’re a guest here, not a room number
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#d8d2b6]">
              Kiddi and Haffi have run Dæli together since 1988, now with Bolli and Þórhildur
              alongside. They will tell you which waterfall is worth the detour, lend you the better
              map, and remember how you take your coffee by day two.
            </p>
            <ul className="mt-8 space-y-3.5 text-sm text-[#e9e4cf]">
              {[
                'Family-run since 1988 — the same family',
                'Personal route tips for the whole northwest',
                'Home-style breakfast with fresh baking',
                'English and Icelandic spoken',
              ].map((li) => (
                <li key={li} className="flex items-start gap-3">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-[#c9b97a]" />
                  {li}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <figure className="rounded-[2rem] bg-[#37432a] p-8 md:p-10">
              <blockquote className="font-display text-2xl leading-relaxed font-medium italic md:text-3xl">
                “We can’t make Iceland cheaper. But we can make it feel like coming home to family
                you didn’t know you had.”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c9b97a] font-display text-lg font-semibold text-[#41502f]">
                  D
                </span>
                <span>
                  <span className="block text-sm font-semibold">The Dæli family</span>
                  <span className="block text-xs text-[#c9c2a2]">Víðidalur, since 1988</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="text-center text-xs font-semibold tracking-[0.3em] text-[#7d684c] uppercase">Guest book</p>
          <h2 className="mt-4 text-center font-display text-4xl font-medium md:text-5xl">Word travels</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.1}>
              <figure className="h-full rounded-[1.75rem] bg-white p-7 shadow-sm transition-[transform,box-shadow] duration-500 hover:-rotate-1 hover:shadow-lg">
                <div role="img" aria-label="Rated 5 out of 5" className="flex gap-1 text-[#c05f33]">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 font-display text-lg leading-relaxed text-[#3d362c] italic">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold">{r.name}</span>
                  <span className="ml-2 text-[#7d684c]">{r.origin}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="bg-[#f3ecdd] py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
          <Reveal className="order-2 md:order-1">
            <div className="overflow-hidden rounded-[2rem]">
              <Img
                src="https://images.unsplash.com/photo-1531168556467-80aace0d0144?q=80&w=1400&auto=format&fit=crop"
                alt="Moss-green river canyon in Iceland"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                fallbackClassName="bg-gradient-to-br from-amber-200 to-emerald-900/60"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 md:order-2">
            <p className="text-xs font-semibold tracking-[0.3em] text-[#7d684c] uppercase">Where you’ll be</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.1] font-medium text-balance md:text-5xl">
              Perfectly placed on the way north
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#6b6051]">
              Halfway between Reykjavík and Akureyri, six easy kilometres off Route 1 — close enough
              to reach, far enough to forget everything.
            </p>
            <ul className="mt-8 space-y-3">
              {NEARBY.map(([place, dist]) => (
                <li
                  key={place}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white/70 px-5 py-3.5 text-sm"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <MapPin className="h-4 w-4 text-[#c05f33]" />
                    {place}
                  </span>
                  <span className="shrink-0 text-[#7d684c]">{dist}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section id="book" className="bg-[#41502f] py-28 text-center text-[#f1edda] md:py-36">
        <div className="mx-auto max-w-2xl px-5">
          <Reveal>
            <Coffee className="mx-auto h-8 w-8 text-[#c9b97a]" />
            <h2 className="mt-6 font-display text-5xl font-medium text-balance md:text-6xl">
              The kettle’s on.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[#d8d2b6]">
              Send us your dates and we’ll reply personally — usually the same day, always with our
              best price.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:daeli@daeli.is?subject=Booking%20request%20%E2%80%93%20D%C3%A6li&body=Dates%3A%0AGuests%3A%0ARoom%20or%20cottage%3A"
                className="group inline-flex items-center gap-2 rounded-full bg-[#c05f33] px-9 py-4 text-sm font-semibold text-white shadow-xl shadow-black/25 transition-all hover:-translate-y-0.5 hover:bg-[#d06c3e]"
              >
                Request your dates
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <span className="text-xs text-[#c9c2a2]">No booking fees · Direct with the family</span>
            </div>
          </Reveal>
        </div>
      </section>

      <WantRedesign company={company} accentClassName="bg-[#c05f33] text-white hover:bg-[#d06c3e]" />
      <ProtoFooter company={company} />
    </div>
  )
}
