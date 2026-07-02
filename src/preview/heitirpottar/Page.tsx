import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Package, Phone, Truck, Wrench } from 'lucide-react'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import { StickyCta } from '../../components/StickyCta'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import {
  CATEGORIES,
  DEALS,
  HERO_SLIDES,
  HITAVEITA_IMAGE,
  HITAVEITA_TUBS,
  INFRARED_IMAGE,
  PHONES,
  REVIEWS,
  REVIEWS_IMAGE,
  SAUNA_HOUSES,
  SAUNA_IMAGES,
  SHOWROOM_IMAGE,
  SOCIALS,
  cdn,
  kr,
  productUrl,
} from './data'

/*
 * GUFA — basalt showroom at dusk for heitirpottar.is.
 * Canvas #141210 · steam #F3EEE7 · muted #A79E92 · ember #F07B3C.
 * Clash Display (display) + Satoshi (body), both already loaded via Fontshare.
 * Every top-level component below maps 1:1 to a Shopify Liquid section.
 */

const EASE = 'cubic-bezier(0.23,1,0.32,1)'
const SLIDE_MS = 6000

const company = getPreviewCompany('heitirpottar')

/* ------------------------------------------------------------ sections */

function AnnouncementBar() {
  return (
    <p className="bg-[#1D1A17] px-4 py-2.5 text-center text-[12.5px] font-medium tracking-wide text-[#C9C0B4]">
      Frí sending á smávörum ef verslað er fyrir 17.000 kr. · Opið alla daga vikunnar
    </p>
  )
}

function Header() {
  const links = [
    { label: 'Pottar', href: '#pottar' },
    { label: 'Saunahús', href: '#saunahus' },
    { label: 'Infrared', href: '#infrared' },
    { label: 'Góðir dílar', href: '#dilar' },
    { label: 'Hafa samband', href: '#samband' },
  ]
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-5 md:px-10">
        <a href="#" className="font-['Clash_Display',sans-serif] text-[15px] font-semibold tracking-[0.14em] text-[#F3EEE7]">
          HEITIRPOTTAR.IS
        </a>
        <nav aria-label="Aðalvalmynd" className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] font-medium text-[#E4DDD2] transition-colors duration-300 hover:text-[#F07B3C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F07B3C]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="tel:+3547772000"
          className="flex items-center gap-2 rounded-full border border-[#F3EEE7]/25 px-4 py-2 text-[13px] font-semibold text-[#F3EEE7] transition-colors duration-300 hover:border-[#F07B3C] hover:text-[#F07B3C] active:scale-[0.98]"
        >
          <Phone size={14} strokeWidth={2} aria-hidden />
          777 2000
        </a>
      </div>
    </header>
  )
}

/**
 * Signature: full-bleed showroom slideshow. Auto-advances every 6s with
 * segmented timing bars; photo slides get a slow Ken Burns settle, cutout
 * products sit on a lit stage. Maps to a Liquid slideshow section whose
 * blocks are product references.
 */
function HeroSlideshow() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const n = HERO_SLIDES.length

  useEffect(() => {
    const onVis = () => setHidden(document.visibilityState === 'hidden')
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Pauses while hovered, focused or in a hidden tab — no burst-advancing
  // when the tab comes back, and keyboard users get time to read.
  // `i` in the deps is deliberate: every slide change (auto OR manual)
  // restarts the 6s window so a manual jump gets a full read time.
  useEffect(() => {
    if (paused || hidden || reduce) return
    const t = window.setInterval(() => setI((v) => (v + 1) % n), SLIDE_MS)
    return () => window.clearInterval(t)
  }, [paused, hidden, reduce, n, i])

  const slide = HERO_SLIDES[i]
  const saving = slide.compareAtPrice ? slide.compareAtPrice - slide.price : 0

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Vörur í sýningarsal"
      className="gufa-hero relative overflow-hidden bg-[#141210]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h1 className="sr-only">Heitirpottar.is. Heitir pottar, kaldir pottar, saunahús og infrared klefar.</h1>

      {/* stacked slides, CSS opacity crossfade (portable to Liquid + vanilla JS) */}
      {HERO_SLIDES.map((s, idx) => {
        const active = idx === i
        return (
          <div
            key={s.handle}
            aria-hidden={!active}
            className="absolute inset-0 transition-opacity duration-[900ms]"
            style={{ opacity: active ? 1 : 0, transitionTimingFunction: EASE }}
          >
            {s.layout === 'photo' ? (
              <>
                <Img
                  src={cdn(s.image, 1600)}
                  srcSet={`${cdn(s.image, 828)} 828w, ${cdn(s.image, 1280)} 1280w, ${cdn(s.image, 2000)} 2000w`}
                  sizes="100vw"
                  alt={s.alt}
                  fetchpriority={idx === 0 ? 'high' : undefined}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  className="h-full w-full object-cover"
                  style={{
                    transform: active && !reduce ? 'scale(1)' : 'scale(1.06)',
                    transition: 'transform 7s linear',
                  }}
                  fallbackClassName="bg-gradient-to-br from-[#2A241E] to-[#141210]"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/45 to-[#141210]/15" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#141210]/70 via-transparent to-transparent" />
              </>
            ) : (
              <div className="relative h-full w-full">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(90% 55% at 72% 88%, rgba(240,123,60,0.16), transparent 65%), radial-gradient(60% 40% at 30% 10%, rgba(243,238,231,0.05), transparent 70%)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-[22vh] flex justify-center px-6 md:bottom-[16vh] md:justify-end md:pr-[10vw]">
                  <Img
                    src={cdn(s.image, 1100)}
                    alt={s.alt}
                    loading="lazy"
                    className="max-h-[34vh] w-auto max-w-full object-contain md:max-h-[52vh] md:max-w-[44vw]"
                    style={{ filter: 'drop-shadow(0 44px 56px rgba(0,0,0,0.55))' }}
                    fallbackClassName="h-64 w-80 rounded-2xl bg-gradient-to-br from-[#2A241E] to-[#141210]"
                  />
                </div>
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#141210] via-[#141210]/65 to-transparent md:h-44 md:via-transparent" />
              </div>
            )}
          </div>
        )
      })}

      {/* slide content */}
      <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-[1400px] flex-col justify-end px-5 pb-24 pt-36 md:px-10 md:pb-28">
        <motion.div
          key={slide.handle}
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-2xl"
        >
          <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#C9C0B4]">
            {slide.type}
            {slide.badge && (
              <span className="rounded-full bg-[#F07B3C] px-2.5 py-0.5 text-[11px] font-bold normal-case tracking-normal text-[#141210]">
                {slide.badge}
              </span>
            )}
          </p>
          <h2 className="mt-3 font-['Clash_Display',sans-serif] text-5xl font-semibold leading-[1.02] tracking-[-0.02em] text-[#F3EEE7] md:text-7xl">
            {slide.title}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#D9D2C7]">{slide.blurb}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="flex items-baseline gap-3">
              <span className={`text-2xl font-bold tabular-nums md:text-3xl ${slide.compareAtPrice ? 'text-[#F5A579]' : 'text-[#F3EEE7]'}`}>
                {kr(slide.price)}
              </span>
              {slide.compareAtPrice && (
                <span className="text-[15px] tabular-nums text-[#A79E92]">
                  <span className="sr-only">Áður </span>
                  <s>{kr(slide.compareAtPrice)}</s>
                </span>
              )}
            </p>
            {saving > 0 && (
              <p className="text-[13px] font-semibold text-[#F5A579]">Þú sparar {kr(saving)}</p>
            )}
          </div>

          <div className="mt-7">
            <a
              href={productUrl(slide.handle)}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-[#F07B3C] py-2.5 pl-6 pr-2.5 text-[14px] font-bold text-[#141210] transition-transform duration-300 hover:bg-[#F5905B] focus-visible:outline-[#F3EEE7] active:scale-[0.98]"
            >
              Skoða nánar
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#141210]/15 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
              </span>
            </a>
          </div>
        </motion.div>

        {/* controls + segmented timers */}
        <div className="mt-10 flex items-center gap-5">
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Fyrri vara"
              onClick={() => setI((i - 1 + n) % n)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F3EEE7]/25 text-[#F3EEE7] transition-colors duration-300 hover:border-[#F07B3C] hover:text-[#F07B3C] active:scale-[0.98]"
            >
              <ChevronLeft size={18} strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Næsta vara"
              onClick={() => setI((i + 1) % n)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F3EEE7]/25 text-[#F3EEE7] transition-colors duration-300 hover:border-[#F07B3C] hover:text-[#F07B3C] active:scale-[0.98]"
            >
              <ChevronRight size={18} strokeWidth={2} aria-hidden />
            </button>
          </div>
          <div className="flex flex-1 gap-2.5" role="tablist" aria-label="Velja vöru í sýningarsal">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.handle}
                type="button"
                role="tab"
                aria-selected={idx === i}
                aria-label={`Sýna ${s.title}`}
                onClick={() => setI(idx)}
                className="group flex-1 py-[22px]"
              >
                <span className="block h-[3px] overflow-hidden rounded-full bg-[#F3EEE7]/20">
                  <span
                    key={`${idx}-${i}`}
                    className="block h-full origin-left rounded-full bg-[#F07B3C]"
                    style={
                      idx === i
                        ? reduce
                          ? { transform: 'scaleX(1)' }
                          : { animation: `gufaFill ${SLIDE_MS}ms linear forwards`, animationPlayState: paused || hidden ? 'paused' : 'running' }
                        : { transform: idx < i ? 'scaleX(1)' : 'scaleX(0)' }
                    }
                  />
                </span>
              </button>
            ))}
          </div>
          <p className="hidden text-[13px] font-medium tabular-nums text-[#A79E92] sm:block">
            {i + 1} / {n}
          </p>
        </div>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section id="pottar" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className="max-w-3xl font-['Clash_Display',sans-serif] text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-[#F3EEE7] md:text-6xl">
          Heitt, kalt og allt þar á milli.
        </h2>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-12">
        {CATEGORIES.map((c, idx) => {
          const big = idx < 2
          return (
            <Reveal
              key={c.title}
              delay={Math.min(idx * 0.06, 0.3)}
              className={big ? 'md:col-span-6' : 'sm:col-span-1 md:col-span-3'}
            >
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className={`group relative block overflow-hidden rounded-2xl bg-[#1D1A17] ${big ? 'h-[340px] md:h-[440px]' : 'h-[240px] md:h-[280px]'}`}
              >
                {c.photo ? (
                  <>
                    <Img
                      src={cdn(c.image, big ? 1400 : 800)}
                      alt={c.alt}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      style={{ transitionTimingFunction: EASE }}
                      fallbackClassName="bg-gradient-to-br from-[#2A241E] to-[#141210]"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#141210]/90 via-[#141210]/20 to-transparent" />
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center p-6 pb-20">
                    <Img
                      src={cdn(c.image, 640)}
                      alt={c.alt}
                      className="max-h-full w-auto max-w-full object-contain transition-transform duration-700 group-hover:scale-[1.05]"
                      style={{ transitionTimingFunction: EASE, filter: 'drop-shadow(0 22px 28px rgba(0,0,0,0.45))' }}
                      fallbackClassName="h-32 w-40 rounded-xl bg-gradient-to-br from-[#2A241E] to-[#141210]"
                    />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div>
                    <h3 className="font-['Clash_Display',sans-serif] text-xl font-semibold text-[#F3EEE7]">{c.title}</h3>
                    <p className="mt-0.5 text-[12.5px] text-[#C9C0B4]">{c.note}</p>
                  </div>
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F3EEE7]/25 text-[#F3EEE7] transition-all duration-300 group-hover:border-[#F07B3C] group-hover:text-[#F07B3C]"
                  >
                    <ArrowRight size={15} strokeWidth={2} />
                  </span>
                </div>
              </a>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function DealsRail() {
  return (
    <section id="dilar" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-['Clash_Display',sans-serif] text-4xl font-semibold tracking-[-0.02em] text-[#F3EEE7] md:text-5xl">
              Góðir dílar
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#A79E92]">
              Raunveruleg tilboð úr versluninni, uppfærð beint af lager.
            </p>
          </div>
          <a
            href="https://heitirpottar.is/collections/godir-dilar"
            target="_blank"
            rel="noreferrer"
            className="text-[13.5px] font-semibold text-[#F07B3C] underline-offset-4 hover:underline"
          >
            Sjá öll tilboð
          </a>
        </Reveal>
      </div>
      <Reveal delay={0.1}>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:px-10 [scrollbar-width:thin] [scrollbar-color:#3a342c_transparent]">
          {DEALS.map((p) => {
            const pct = p.compareAtPrice ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0
            return (
              <a
                key={p.handle}
                href={productUrl(p.handle)}
                target="_blank"
                rel="noreferrer"
                className="group relative w-[264px] shrink-0 snap-start rounded-2xl bg-[#1D1A17] p-5 transition-colors duration-300 hover:bg-[#242019] sm:w-[288px]"
              >
                {pct > 0 && (
                  <span className="absolute left-5 top-5 z-10 rounded-full bg-[#F07B3C] px-2.5 py-1 text-[12px] font-bold tabular-nums text-[#141210]">
                    -{pct}%
                  </span>
                )}
                <div className="flex h-44 items-center justify-center">
                  <Img
                    src={cdn(p.image, 560)}
                    alt={p.alt}
                    className="max-h-full w-auto max-w-full object-contain transition-transform duration-700 group-hover:scale-[1.05]"
                    style={{ transitionTimingFunction: EASE, filter: 'drop-shadow(0 18px 22px rgba(0,0,0,0.4))' }}
                    fallbackClassName="h-32 w-44 rounded-xl bg-gradient-to-br from-[#2A241E] to-[#141210]"
                  />
                </div>
                <p className="mt-5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#A79E92]">{p.type}</p>
                <h3 className="mt-1 text-[16px] font-bold text-[#F3EEE7]">{p.title}</h3>
                <p className="mt-2 flex items-baseline gap-2.5">
                  <span className="text-[17px] font-bold tabular-nums text-[#F5A579]">{kr(p.price)}</span>
                  {p.compareAtPrice && (
                    <span className="text-[13px] tabular-nums text-[#A79E92]">
                      <span className="sr-only">Áður </span>
                      <s>{kr(p.compareAtPrice)}</s>
                    </span>
                  )}
                </p>
              </a>
            )
          })}
        </div>
      </Reveal>
    </section>
  )
}

function Hitaveita() {
  return (
    <section id="hitaveita" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="overflow-hidden rounded-2xl">
            <Img
              src={cdn(HITAVEITA_IMAGE.src, 1200)}
              alt={HITAVEITA_IMAGE.alt}
              className="aspect-[4/5] w-full object-cover md:aspect-[5/6]"
              fallbackClassName="aspect-[4/5] w-full bg-gradient-to-br from-[#2A241E] to-[#141210]"
            />
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#F07B3C]">Hitaveitupottar</p>
          <h2 className="mt-3 font-['Clash_Display',sans-serif] text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-[#F3EEE7] md:text-5xl">
            Tengdur beint við heita vatnið.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[#C9C0B4]">
            Hitaveitupottur notar heita vatnið úr hitaveitunni eins og það kemur. Einfaldur í uppsetningu,
            ódýr í rekstri og alltaf tilbúinn þegar kvöldið kallar. Arctic Spas pottarnir okkar koma með
            legubekkjum, kafteinssætum og hornbekkjum.
          </p>
          <ul className="mt-8 divide-y divide-[#F3EEE7]/10 border-y border-[#F3EEE7]/10">
            {HITAVEITA_TUBS.map((t) => (
              <li key={t.handle}>
                <a
                  href={productUrl(t.handle)}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-baseline justify-between gap-4 py-3.5"
                >
                  <span className="text-[15px] font-bold text-[#F3EEE7] transition-colors duration-300 group-hover:text-[#F07B3C]">
                    {t.title}
                    <span className="ml-2.5 text-[12.5px] font-medium text-[#A79E92]">{t.type}</span>
                  </span>
                  <span className="text-[15px] font-semibold tabular-nums text-[#E4DDD2]">{kr(t.price)}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[13.5px] text-[#A79E92]">Hitaveituskeljar fást sér, frá 600.000 kr.</p>
        </Reveal>
      </div>
    </section>
  )
}

function Saunahus() {
  return (
    <section id="saunahus" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <Reveal>
            <h2 className="font-['Clash_Display',sans-serif] text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-[#F3EEE7] md:text-5xl">
              Alþingi, Bessastaðir, Þingvellir.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#C9C0B4]">
              Saunahúsin okkar bera stór nöfn og standa undir þeim. Frá Forseta sem passar á pallinn
              upp í fjögurra metra Þingvelli með 210 cm lofthæð.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-9 divide-y divide-[#F3EEE7]/10 border-y border-[#F3EEE7]/10">
              {SAUNA_HOUSES.map((s) => (
                <li key={s.handle}>
                  <a
                    href={productUrl(s.handle)}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-baseline justify-between gap-4 py-4"
                  >
                    <span>
                      <span className="font-['Clash_Display',sans-serif] text-[19px] font-semibold text-[#F3EEE7] transition-colors duration-300 group-hover:text-[#F07B3C]">
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] text-[#A79E92]">{s.capacity}</span>
                    </span>
                    <span className="shrink-0 text-[15px] font-semibold tabular-nums text-[#E4DDD2]">{kr(s.price)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="relative md:col-span-7">
          <div className="overflow-hidden rounded-2xl">
            <Img
              src={cdn(SAUNA_IMAGES.interior.src, 1400)}
              alt={SAUNA_IMAGES.interior.alt}
              className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full md:min-h-[560px]"
              fallbackClassName="aspect-[4/3] w-full bg-gradient-to-br from-[#2A241E] to-[#141210]"
            />
          </div>
          <div className="absolute -bottom-8 -left-6 hidden w-56 overflow-hidden rounded-xl border-4 border-[#141210] shadow-2xl md:block">
            <Img
              src={cdn(SAUNA_IMAGES.night.src, 560)}
              alt={SAUNA_IMAGES.night.alt}
              className="aspect-[4/3] w-full object-cover"
              fallbackClassName="aspect-[4/3] w-full bg-gradient-to-br from-[#2A241E] to-[#141210]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function InfraredBand() {
  return (
    <section id="infrared" className="relative overflow-hidden">
      <Img
        src={cdn(INFRARED_IMAGE.src, 2000)}
        alt={INFRARED_IMAGE.alt}
        className="absolute inset-0 h-full w-full object-cover"
        fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#3A1410] to-[#141210]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#141210]/90 via-[#141210]/55 to-[#141210]/20" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
        <Reveal>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#F5A579]">Infrared</p>
          <h2 className="mt-3 max-w-xl font-['Clash_Display',sans-serif] text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-[#F3EEE7] md:text-5xl">
            Taktu heilsuna á næsta stig.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#D9D2C7]">
            Infrarauðir inniklefar með A, B og C bylgjutíðni, frá 277.990 kr. Koma í einingum sem
            þarf einungis að smella saman.
          </p>
          <a
            href="https://heitirpottar.is/collections/infrared-inniklefar"
            target="_blank"
            rel="noreferrer"
            className="group mt-8 inline-flex items-center gap-3 rounded-full border border-[#F3EEE7]/35 py-2.5 pl-6 pr-2.5 text-[14px] font-bold text-[#F3EEE7] transition-colors duration-300 hover:border-[#F07B3C] hover:text-[#F07B3C] active:scale-[0.98]"
          >
            Sjá alla klefa
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3EEE7]/10 transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}

function Services() {
  const items = [
    { icon: Clock, title: 'Opið alla daga vikunnar', text: 'Líka á sunnudögum.' },
    { icon: Truck, title: 'Hagstæð kjör í flutning', text: 'Við komum pottinum heim að palli.' },
    { icon: Package, title: 'Frí sending á smávörum', text: 'Ef verslað er fyrir 17.000 kr. eða meira.' },
    { icon: Wrench, title: 'Viðgerðaþjónusta', text: 'Aðstoð og varahlutir eftir kaupin.' },
  ]
  return (
    <section className="border-y border-[#F3EEE7]/10">
      <h2 className="sr-only">Þjónusta</h2>
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-x-8 gap-y-10 px-5 py-16 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
        {items.map((s, idx) => (
          <Reveal key={s.title} delay={Math.min(idx * 0.06, 0.24)}>
            <s.icon size={22} strokeWidth={1.5} aria-hidden className="text-[#F07B3C]" />
            <h3 className="mt-4 text-[15px] font-bold text-[#F3EEE7]">{s.title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#A79E92]">{s.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="overflow-hidden rounded-2xl">
            <Img
              src={cdn(REVIEWS_IMAGE.src, 1200)}
              alt={REVIEWS_IMAGE.alt}
              className="aspect-[4/3] w-full object-cover"
              fallbackClassName="aspect-[4/3] w-full bg-gradient-to-br from-[#2A241E] to-[#141210]"
            />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <h2 className="font-['Clash_Display',sans-serif] text-4xl font-semibold tracking-[-0.02em] text-[#F3EEE7] md:text-5xl">
              Heitasti staðurinn á heimilinu.
            </h2>
          </Reveal>
          <div className="mt-9 space-y-8">
            {REVIEWS.map((r, idx) => (
              <Reveal key={r.name} delay={0.08 + idx * 0.07}>
                <blockquote className="text-[15.5px] leading-relaxed text-[#D9D2C7]">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <p className="mt-2.5 text-[13px] font-semibold text-[#F3EEE7]">
                  {r.name}
                  <span className="ml-2 font-medium text-[#A79E92]">{r.detail}</span>
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="samband" className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10 md:pb-32">
      <div className="overflow-hidden rounded-3xl bg-[#1D1A17]">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-14">
            <Reveal>
              <h2 className="font-['Clash_Display',sans-serif] text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-[#F3EEE7] md:text-5xl">
                Toppgæði og toppþjónusta.
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#C9C0B4]">
                Opið alla daga vikunnar. Hringdu, sendu póst eða skrifaðu á samfélagsmiðlunum,
                við svörum fljótt.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mt-9 space-y-4">
                {PHONES.map((p) => (
                  <li key={p.tel}>
                    <a href={`tel:${p.tel}`} className="group flex items-center gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F07B3C]/15 text-[#F07B3C]">
                        <Phone size={16} strokeWidth={2} aria-hidden />
                      </span>
                      <span>
                        <span className="block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#A79E92]">
                          {p.label}
                        </span>
                        <span className="text-[17px] font-bold tabular-nums text-[#F3EEE7] transition-colors duration-300 group-hover:text-[#F07B3C]">
                          {p.number}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:heitirpottar@heitirpottar.is"
                className="mt-7 inline-block text-[14.5px] font-semibold text-[#F07B3C] underline-offset-4 hover:underline"
              >
                heitirpottar@heitirpottar.is
              </a>
              <p className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium text-[#A79E92]">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors duration-300 hover:text-[#F3EEE7]"
                  >
                    {s.label}
                  </a>
                ))}
              </p>
            </Reveal>
          </div>
          <div className="relative min-h-[320px] md:min-h-0">
            <Img
              src={cdn(SHOWROOM_IMAGE.src, 1200)}
              alt={SHOWROOM_IMAGE.alt}
              className="absolute inset-0 h-full w-full object-cover"
              fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#2A241E] to-[#141210]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- page */

export default function HeitirpottarPage() {
  return (
    <div lang="is" className="bg-[#141210] font-['Satoshi',sans-serif] text-[#F3EEE7] antialiased">
      <style>{`
        @keyframes gufaFill { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        .gufa-hero { min-height: 100vh; min-height: 100svh; }
      `}</style>
      <PreviewChrome company={company} />
      <AnnouncementBar />
      <div className="relative">
        <Header />
        <HeroSlideshow />
      </div>
      <main className="overflow-x-clip">
        <Categories />
        <DealsRail />
        <Hitaveita />
        <Saunahus />
        <InfraredBand />
        <Services />
        <Reviews />
        <Contact />
      </main>
      <StickyCta
        label="Opið alla daga vikunnar"
        button="Hringja í 777 2000"
        href="tel:+3547772000"
        watchTarget="#samband"
        buttonClassName="bg-[#F07B3C] text-[#141210] font-bold focus-visible:outline-[#F3EEE7]"
        barClassName="bg-[#141210]/92 text-[#F3EEE7] border-t border-white/10 backdrop-blur-md"
      />
      <PreviewFooter company={company} />
    </div>
  )
}
