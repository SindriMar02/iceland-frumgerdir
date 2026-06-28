import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { PartialPrototypeBanner } from '../PartialPrototypeBanner'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  BRING,
  C,
  CLIMB_BG,
  FACEBOOK,
  FAMILY,
  FAQ,
  GALLERY,
  HERO_ALT,
  IMG,
  IMG_DISCLAIMER,
  INCLUDED,
  INSTAGRAM,
  ITINERARY,
  PHONES,
  PLACEHOLDER_EMAIL,
  PRICE_ISK,
  REVIEWS,
  STAGES,
  SUMMARY,
  SUMMIT_M,
  TOURS,
  TRUST,
} from './data'

const company = getPreviewCompany('glacierparadise')

/* ── Unsplash helpers ─────────────────────────────────────────────────────── */
const u = (id: string, w = 1280) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`
const srcSet = (id: string) =>
  `${u(id, 640)} 640w, ${u(id, 1024)} 1024w, ${u(id, 1600)} 1600w, ${u(id, 2200)} 2200w`

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* The 300 m gradations the altimeter ticks brighten at. */
const TICKS = [0, 300, 600, 900, 1200, SUMMIT_M]
const pad4 = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0')

/* Off-screen but screen-reader-readable — keeps the heading outline complete. */
const srOnly: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
}

/* Smooth-scroll to a hash target, reduced-motion aware. */
function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({
    behavior: prefersReduced() ? 'auto' : 'smooth',
    block: 'start',
  })
}

/* ── Reveal — IO + CSS transition, in-view-on-mount + setTimeout failsafe ── */
function Reveal({
  children,
  delay = 0,
  y = 24,
  className = '',
  style,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.14 },
    )
    io.observe(el)
    const t = window.setTimeout(() => setShown(true), 1500) // failsafe
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
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity .8s cubic-bezier(.22,.7,.2,1) ${delay}ms, transform .8s cubic-bezier(.22,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ── CountUp — interval-stepped with a setTimeout that lands the final value ─ */
function CountUp({ to, render }: { to: number; render: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const run = () => {
      if (started.current) return
      started.current = true
      if (prefersReduced()) {
        setN(to)
        return
      }
      const dur = 1300
      const t0 = Date.now()
      const iv = window.setInterval(() => {
        const p = Math.min(1, (Date.now() - t0) / dur)
        setN(to * (1 - Math.pow(1 - p, 3)))
        if (p >= 1) window.clearInterval(iv)
      }, 32)
      window.setTimeout(() => {
        window.clearInterval(iv)
        setN(to) // failsafe lands the final value even if throttled
      }, dur + 280)
    }
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) run()
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run()
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    const fs = window.setTimeout(run, 1700)
    return () => {
      io.disconnect()
      window.clearTimeout(fs)
    }
  }, [to])
  return <span ref={ref}>{render(n)}</span>
}

/* ── Mono eyebrow — code-comment label, +0.14em tracking, ice ─────────────── */
function Eyebrow({
  children,
  color = C.ice,
  className = '',
}: {
  children: ReactNode
  color?: string
  className?: string
}) {
  return (
    <span
      className={`font-geistmono text-[11.5px] uppercase tracking-[0.14em] ${className}`}
      style={{ color }}
    >
      {children}
    </span>
  )
}

/* Shared section heading — eyebrow + display h2, instrument voice */
function SectionHead({
  eyebrow,
  title,
  intro,
  align = 'left',
}: {
  eyebrow: string
  title: string
  intro?: string
  align?: 'left' | 'center'
}) {
  return (
    <Reveal
      className={align === 'center' ? 'mx-auto max-w-[640px] text-center' : 'max-w-[640px]'}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-4 font-geist font-600 leading-[1.02]"
        style={{
          color: C.ink,
          fontSize: 'clamp(2rem,4.6vw,3.4rem)',
          letterSpacing: '-0.03em',
        }}
      >
        {title}
      </h2>
      {intro && (
        <p
          className="mt-4 font-geist leading-[1.55]"
          style={{ color: C.muted, fontSize: 'clamp(15px,1.5vw,17px)' }}
        >
          {intro}
        </p>
      )}
    </Reveal>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  STICKY UTILITY BOOKING BAR — docks after the hero scrolls past.
 * ═════════════════════════════════════════════════════════════════════════ */
function StickyBar({ alt, visible }: { alt: number; visible: boolean }) {
  return (
    <div
      className="fixed inset-x-0 top-0 z-[45] hidden sm:block"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(-110%)',
        opacity: visible ? 1 : 0,
        transition: 'transform .45s cubic-bezier(.22,.7,.2,1), opacity .45s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      aria-hidden={!visible}
    >
      <div
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-[26px] py-3 sm:pr-[100px]"
        style={{
          background: 'rgba(7,10,13,0.86)',
          borderBottom: `1px solid ${C.hair}`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="font-geist text-[14px] font-600" style={{ color: C.ink }}>
            Top of the Diamond
          </span>
          <span className="font-geistmono text-[11px] uppercase tracking-[0.12em]" style={{ color: C.muted }}>
            · Snow-cat ascent
          </span>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-2 md:flex">
            <span className="font-geistmono text-[12px] tabular-nums" style={{ color: C.ice }}>
              frá {PRICE_ISK.toLocaleString('is-IS')} kr
            </span>
            <span className="font-geistmono text-[11px]" style={{ color: C.muted }}>
              · sýnishorn
            </span>
          </div>
          <span
            className="hidden items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 lg:flex"
            style={{ border: `1px solid ${C.iceDim}`, background: 'rgba(127,200,232,0.05)' }}
          >
            <span className="font-geistmono text-[9px] uppercase tracking-[0.14em]" style={{ color: C.muted }}>
              ALT
            </span>
            <span className="font-geistmono text-[12px] tabular-nums" style={{ color: C.ice }}>
              {pad4(alt)} M
            </span>
          </span>
          <button
            type="button"
            onClick={() => scrollToId('book')}
            className="gp-cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-geist text-[14px] font-600 transition-transform active:scale-[0.97]"
            style={{ background: C.summit, color: C.ground, cursor: 'pointer' }}
          >
            Book the ascent <span aria-hidden>↑</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* Mobile bottom-docked book pill */
function MobileBookDock({ visible }: { visible: boolean }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[45] px-4 pb-4 sm:hidden"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(140%)',
        transition: 'transform .45s cubic-bezier(.22,.7,.2,1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={() => scrollToId('book')}
        className="gp-cta flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-geist text-[15px] font-600"
        style={{
          background: C.summit,
          color: C.ground,
          boxShadow: '0 12px 30px rgba(7,10,13,0.55)',
          cursor: 'pointer',
        }}
      >
        Book the ascent · frá {PRICE_ISK.toLocaleString('is-IS')} kr <span aria-hidden>↑</span>
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  ALTIMETER RAIL — the living instrument, pinned right edge.
 * ═════════════════════════════════════════════════════════════════════════ */
function AltimeterRail({ alt, summitGlow }: { alt: number; summitGlow: boolean }) {
  return (
    <div
      className="pointer-events-none fixed inset-y-0 right-0 z-[40] hidden w-[78px] sm:flex sm:flex-col sm:items-center sm:justify-center"
      aria-hidden
    >
      <div className="relative flex h-[62vh] flex-col justify-between">
        <span
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
          style={{ background: C.iceDim }}
        />
        {[...TICKS].reverse().map((t) => {
          const on = alt >= t - 6
          return (
            <div key={t} className="relative flex items-center justify-end gap-2 pr-3">
              <span
                className="font-geistmono text-[10px] tabular-nums tracking-[0.08em] transition-colors duration-300"
                style={{ color: on ? C.ice : C.muted, opacity: on ? 1 : 0.7 }}
              >
                {pad4(t)}
              </span>
              <span
                className="h-px w-3 transition-all duration-300"
                style={{
                  background: on ? C.ice : C.iceDim,
                  boxShadow: on ? `0 0 6px ${C.ice}` : 'none',
                  width: on ? 16 : 10,
                }}
              />
            </div>
          )
        })}
      </div>
      <div
        className="mt-5 rounded-[8px] px-2.5 py-2 text-center transition-shadow duration-500"
        style={{
          background: 'rgba(7,10,13,0.72)',
          border: `1px solid ${summitGlow ? C.summit : C.iceDim}`,
          boxShadow: summitGlow ? `0 0 22px ${C.summit}66` : `0 0 14px ${C.iceFaint}`,
          backdropFilter: 'blur(6px)',
        }}
      >
        <div className="font-geistmono text-[9px] uppercase tracking-[0.16em]" style={{ color: C.muted }}>
          ALT
        </div>
        <div
          className="font-geistmono text-[15px] tabular-nums leading-tight transition-colors duration-500"
          style={{ color: summitGlow ? C.summit : C.ice }}
        >
          {pad4(alt)}
        </div>
        <div className="font-geistmono text-[9px]" style={{ color: C.muted }}>
          M
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  HERO — base camp / altimeter zero. Near-full-bleed glacier frame.
 * ═════════════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <header
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
      style={{ background: C.ground }}
    >
      {/* near-full-bleed glacier frame — lifted to real cinematic presence */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Img
          src={u(IMG.glacier, 2200)}
          srcSet={srcSet(IMG.glacier)}
          sizes="100vw"
          alt=""
          fetchpriority="high"
          className="gp-hero-img h-full w-full object-cover"
          style={{ opacity: 0.58 }}
          fallbackClassName="bg-gradient-to-br from-[#11161B] to-[#070A0D]"
        />
        {/* left-anchored basalt scrim keeps the headline AAA-legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(7,10,13,.95) 0%, rgba(7,10,13,.82) 34%, rgba(7,10,13,.5) 62%, rgba(7,10,13,.34) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 12% 16%, rgba(7,10,13,.4), transparent 60%), linear-gradient(0deg, rgba(7,10,13,.7), transparent 38%)',
          }}
        />
        {/* one soft summit-light glow, rare warmth */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(58% 48% at 86% 10%, rgba(255,185,122,.12), transparent 62%)' }}
        />
      </div>

      <div className="relative z-[5] mx-auto w-full max-w-6xl px-[26px] pt-28 sm:pr-[90px]">
        <div className="gp-rise" style={{ ['--d' as string]: '40ms' }}>
          <Eyebrow>SNÆFELLSJÖKULL · 1446 M · SNOW-CAT</Eyebrow>
        </div>

        <h1
          className="font-geist m-0 mt-5 font-600 leading-[0.96]"
          style={{ color: C.ink, fontSize: 'clamp(2.75rem,9vw,6rem)', letterSpacing: '-0.03em' }}
        >
          <span className="gp-rise block" style={{ ['--d' as string]: '120ms' }}>
            THE
          </span>
          <span className="gp-rise block" style={{ ['--d' as string]: '220ms' }}>
            ASCENT
          </span>
        </h1>

        <p
          className="gp-rise mt-7 max-w-[460px] font-geist leading-[1.55]"
          style={{ color: C.ink, fontSize: 'clamp(15px,1.5vw,17px)', ['--d' as string]: '360ms', opacity: 0.92 }}
        >
          A third-generation, family-run snow-cat climb up Snæfellsjökull — from
          the black coast of Arnarstapi to a 360° summit of ice. Scroll, and you
          ascend.
        </p>

        <div
          className="gp-rise mt-9 inline-flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[12px] px-5 py-3.5 sm:gap-x-7"
          style={{
            background: 'rgba(17,22,27,0.66)',
            border: `1px solid ${C.hair}`,
            backdropFilter: 'blur(10px)',
            ['--d' as string]: '460ms',
          }}
        >
          <div className="font-geistmono text-[13px] tabular-nums" style={{ color: C.ice }}>
            frá {PRICE_ISK.toLocaleString('is-IS')} kr{' '}
            <span style={{ color: C.muted }}>· sýnishorn</span>
          </div>
          <div className="font-geistmono text-[13px] tabular-nums" style={{ color: C.muted }}>
            ~2 HR
          </div>
          <div className="font-geistmono text-[13px]" style={{ color: C.muted }}>
            DEPARTS ARNARSTAPI
          </div>
        </div>

        <div className="gp-rise mt-7 flex flex-wrap items-center gap-3.5" style={{ ['--d' as string]: '560ms' }}>
          <button
            type="button"
            onClick={() => scrollToId('book')}
            className="gp-cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-geist text-[15px] font-600 transition-transform active:scale-[0.97]"
            style={{ background: C.summit, color: C.ground, cursor: 'pointer' }}
          >
            Book the ascent <span aria-hidden>↑</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToId('climb')}
            className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 font-geist text-[15px] font-500 transition-colors hover:bg-white/5"
            style={{ borderColor: C.iceDim, color: C.ink, cursor: 'pointer' }}
          >
            See the route
          </button>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-7 left-1/2 z-[5] hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        style={{ color: C.muted }}
        aria-hidden
      >
        <span className="font-geistmono text-[10px] uppercase tracking-[0.2em]">Ascend</span>
        <span className="gp-bob text-[15px] leading-none">
          ↓
        </span>
      </div>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  TOUR LINE-UP — Choose your ascent. Five real offerings as big image cards.
 * ═════════════════════════════════════════════════════════════════════════ */
function TourLineup({ onPick }: { onPick: (id: string) => void }) {
  return (
    <section id="tours" style={{ background: C.ground, padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="mx-auto max-w-6xl px-[26px] sm:pr-[90px]">
        <SectionHead
          eyebrow="FIVE WAYS UP THE DIAMOND"
          title="Choose your ascent"
          intro="One mountain, several ways to climb it — from the flagship snow-cat run to a midnight-sun evening, a buggy across the lava, or your own private route."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-6">
          {TOURS.map((t, i) => {
            const featured = !!t.featured
            // featured spans 2 cols on lg and is taller; others fill the rack
            const span = featured
              ? 'lg:col-span-3 lg:row-span-2'
              : i === 1
                ? 'lg:col-span-3'
                : 'lg:col-span-2'
            return (
              <Reveal
                key={t.id}
                delay={i * 70}
                className={`group ${span}`}
              >
                <div
                  className="flex h-full flex-col overflow-hidden rounded-[14px]"
                  style={{ background: C.surface, border: `1px solid ${featured ? C.iceDim : C.hair}` }}
                >
                  <div className="relative overflow-hidden">
                    <Img
                      src={u(IMG[t.imageKey], featured ? 1600 : 1024)}
                      srcSet={srcSet(IMG[t.imageKey])}
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      alt={t.name}
                      className="block w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                      style={{ aspectRatio: featured ? '16 / 10' : '4 / 3' }}
                      fallbackClassName="bg-gradient-to-br from-[#11161B] to-[#070A0D]"
                    />
                    <span
                      className="pointer-events-none absolute inset-0"
                      style={{ background: 'linear-gradient(0deg, rgba(7,10,13,.55), transparent 50%)' }}
                      aria-hidden
                    />
                    {featured && (
                      <span
                        className="absolute left-4 top-4 rounded-full px-3 py-1 font-geistmono text-[10px] uppercase tracking-[0.14em]"
                        style={{ background: C.summit, color: C.ground }}
                      >
                        Flagship
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3
                      className="font-geist font-600 leading-tight"
                      style={{ color: C.ink, fontSize: featured ? 'clamp(1.5rem,2.6vw,2rem)' : '1.2rem', letterSpacing: '-0.02em' }}
                    >
                      {t.name}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {t.chips.map((c) => (
                        <span
                          key={c}
                          className="rounded-full px-2.5 py-1 font-geistmono text-[10.5px] uppercase tracking-[0.08em]"
                          style={{ border: `1px solid ${C.hair}`, color: C.muted }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <p
                      className="mt-4 font-geist leading-[1.55]"
                      style={{ color: C.muted, fontSize: featured ? '15px' : '13.5px' }}
                    >
                      {t.line}
                    </p>
                    <div
                      className="mt-5 flex items-center justify-between gap-3 border-t pt-4"
                      style={{ borderColor: C.hair }}
                    >
                      <div>
                        <div className="font-geistmono text-[14px] tabular-nums" style={{ color: C.ice }}>
                          {t.price}
                        </div>
                        <div className="font-geistmono text-[10px]" style={{ color: C.muted }}>
                          {t.priceNote}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onPick(t.id)}
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-geist text-[13px] font-600 transition-transform active:scale-[0.96]"
                        style={
                          featured
                            ? { background: C.summit, color: C.ground, cursor: 'pointer' }
                            : { border: `1px solid ${C.iceDim}`, color: C.ice, cursor: 'pointer' }
                        }
                      >
                        {t.cta} <span aria-hidden>↑</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
        <p className="mt-6 font-geistmono text-[10px]" style={{ color: C.muted }}>
          Prices marked sýnishorn / sample are placeholders — no live prices appear on the current site. {IMG_DISCLAIMER}
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  WHAT TO EXPECT — chronological itinerary + included / bring diptych.
 * ═════════════════════════════════════════════════════════════════════════ */
function WhatToExpect() {
  const lineRef = useRef<HTMLDivElement>(null)
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const el = lineRef.current
    if (!el) return
    if (prefersReduced()) {
      setDrawn(true)
      return
    }
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
      setDrawn(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    const t = window.setTimeout(() => setDrawn(true), 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])

  return (
    <section id="day" style={{ background: C.surface, padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="mx-auto max-w-6xl px-[26px] sm:pr-[90px]">
        <SectionHead
          eyebrow="THE DAY · HOUR BY HOUR"
          title="What to expect"
          intro="A measured ascent from the black coast to the ice cap and back — the snow-cat does the climbing, you do the looking."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          {/* LARGE anchor image */}
          <Reveal className="overflow-hidden rounded-[14px]" style={{ border: `1px solid ${C.hair}` }}>
            <Img
              src={u(IMG.itinerary, 1600)}
              srcSet={srcSet(IMG.itinerary)}
              sizes="(max-width:1024px) 100vw, 52vw"
              alt="Tracked snow-cat climbing through the glacier snowline"
              className="block w-full object-cover"
              style={{ aspectRatio: '16 / 11' }}
              fallbackClassName="bg-gradient-to-br from-[#11161B] to-[#070A0D]"
            />
            <p
              className="px-4 py-2.5 font-geistmono text-[10px] uppercase tracking-[0.1em]"
              style={{ background: 'rgba(7,10,13,0.5)', color: C.muted }}
            >
              Snowline · where the snow-cat takes over — {IMG_DISCLAIMER}
            </p>
          </Reveal>

          {/* timeline rail */}
          <div ref={lineRef} className="relative pl-8">
            <span className="absolute left-[7px] top-1 h-full w-px" style={{ background: C.hair }} aria-hidden />
            <span
              className="absolute left-[7px] top-1 w-px"
              style={{
                height: drawn ? '100%' : '0%',
                background: C.ice,
                boxShadow: `0 0 8px ${C.ice}`,
                transition: 'height 1.2s cubic-bezier(.4,0,.2,1)',
              }}
              aria-hidden
            />
            {ITINERARY.map((step, i) => (
              <Reveal key={step.title} delay={i * 90} className="relative mb-8 last:mb-0">
                <span
                  className="absolute -left-8 top-1 grid h-4 w-4 place-items-center rounded-full"
                  style={{ background: C.ground, border: `1px solid ${C.ice}` }}
                  aria-hidden
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.ice }} />
                </span>
                <div className="font-geistmono text-[11px] uppercase tracking-[0.12em]" style={{ color: C.ice }}>
                  {step.mark}
                </div>
                <h3 className="mt-1 font-geist text-[18px] font-600" style={{ color: C.ink, letterSpacing: '-0.01em' }}>
                  {step.title}
                </h3>
                <p className="mt-1.5 font-geist text-[14px] leading-[1.55]" style={{ color: C.muted }}>
                  {step.line}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* included / bring diptych */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {[
            { label: 'WHAT’S INCLUDED', items: INCLUDED, mark: '+' },
            { label: 'WHAT TO BRING', items: BRING, mark: '·' },
          ].map((col, ci) => (
            <Reveal
              key={col.label}
              delay={ci * 80}
              className="rounded-[14px] p-6 sm:p-7"
              style={{ background: C.ground, border: `1px solid ${C.hair}` }}
            >
              <Eyebrow>{col.label}</Eyebrow>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.items.map((it) => (
                  <li key={it} className="flex items-center gap-3 font-geist text-[15px]" style={{ color: C.ink }}>
                    <span className="font-geistmono text-[14px]" style={{ color: C.ice }}>
                      {col.mark}
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <p className="mt-5 font-geistmono text-[10px]" style={{ color: C.muted }}>
          Times shown are approximate / sample. Inclusions are indicative and confirmed at booking.
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  FULL-BLEED EXPERIENCE BAND — Verne's doorway. Cinematic exhale + parallax.
 * ═════════════════════════════════════════════════════════════════════════ */
function ExperienceBand() {
  const bandRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (prefersReduced()) return
    const band = bandRef.current
    const img = imgRef.current
    if (!band || !img) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const r = band.getBoundingClientRect()
        const vh = window.innerHeight
        // -1 (above) → 1 (below); 0 when centred
        const center = (r.top + r.height / 2 - vh / 2) / vh
        const shift = Math.max(-1, Math.min(1, center)) * -40
        img.style.transform = `translate3d(0, ${shift}px, 0) scale(1.16)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    const t = window.setTimeout(onScroll, 300)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(t)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={bandRef}
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: 'clamp(420px,70vh,640px)', background: C.ground }}
    >
      <div ref={imgRef} className="absolute inset-0" style={{ transform: 'scale(1.16)' }} aria-hidden>
        <Img
          src={u(IMG.experience, 2200)}
          srcSet={srcSet(IMG.experience)}
          sizes="100vw"
          alt=""
          className="h-full w-full object-cover"
          style={{ opacity: 0.66 }}
          fallbackClassName="bg-gradient-to-br from-[#11161B] to-[#070A0D]"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,10,13,.78) 0%, rgba(7,10,13,.6) 40%, rgba(7,10,13,.78) 100%)',
        }}
        aria-hidden
      />
      <div className="relative z-[2] mx-auto w-full max-w-6xl px-[26px] sm:pr-[90px]">
        <Reveal>
          <Eyebrow color={C.summit}>1446 M · VERNE’S DOORWAY</Eyebrow>
          <p
            className="mt-5 max-w-[760px] font-geist font-600 leading-[1.08]"
            style={{ color: C.ink, fontSize: 'clamp(1.9rem,5vw,3.8rem)', letterSpacing: '-0.03em' }}
          >
            The mountain through which Jules Verne’s travellers descended to the
            centre of the earth.
          </p>
          <p className="mt-4 max-w-[520px] font-geist text-[14px] leading-[1.6]" style={{ color: C.ink, opacity: 0.82 }}>
            A fact about the peak, not a claim we make — but standing on the ice
            cap at 1446 metres, you understand why he chose it.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  THE CLIMB — pinned scroll-driven elevation spine (signature, intact).
 *  Only the inset plates are enlarged to feature scale.
 * ═════════════════════════════════════════════════════════════════════════ */
function Climb({
  setAlt,
  setSummitGlow,
}: {
  setAlt: (n: number) => void
  setSummitGlow: (b: boolean) => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [prog, setProg] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const reduce = prefersReduced()
    setReduced(reduce)
    if (reduce) {
      setAlt(SUMMIT_M)
      setSummitGlow(true)
      setProg(1)
      return
    }
    const wrap = wrapRef.current
    if (!wrap) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const r = wrap.getBoundingClientRect()
        const total = r.height - window.innerHeight
        const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0
        setProg(p)
        if (r.top <= 1) {
          setAlt(Math.round(p * SUMMIT_M))
          setSummitGlow(p > 0.985)
        } else if (r.top < window.innerHeight) {
          const approach = Math.min(1, Math.max(0, 1 - r.top / window.innerHeight))
          setAlt(Math.round(HERO_ALT * (1 - approach)))
          setSummitGlow(false)
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    const t = window.setTimeout(onScroll, 300)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(t)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [setAlt, setSummitGlow])

  const lerp = (a: number, b: number) => Math.round(a + (b - a) * prog)
  const [r0, g0, b0] = CLIMB_BG.bottom
  const [r1, g1, b1] = CLIMB_BG.top
  const bg = reduced
    ? C.climbBottom
    : `rgb(${lerp(r0, r1)}, ${lerp(g0, g1)}, ${lerp(b0, b1)})`
  const txtOnBg = C.ink

  const stageAt = Math.min(STAGES.length - 1, Math.floor(prog * STAGES.length + 0.0001))

  if (reduced) {
    return (
      <section id="climb" style={{ background: bg }}>
        <h2 style={srOnly}>The climb — basalt coast to summit</h2>
        {STAGES.map((s) => (
          <div
            key={s.id}
            className="mx-auto grid max-w-6xl gap-8 px-[26px] py-20 sm:pr-[90px] lg:grid-cols-[1fr_minmax(0,clamp(460px,42vw,620px))] lg:items-center"
            style={{ borderTop: `1px solid ${C.hair}` }}
          >
            <div>
              <Eyebrow color={C.ice}>
                {s.index} / {s.label} — {pad4(s.alt)} M
              </Eyebrow>
              <p
                className="mt-4 max-w-[560px] font-geist leading-[1.5]"
                style={{ color: C.ink, fontSize: 'clamp(18px,2.4vw,26px)' }}
              >
                {s.line}
              </p>
            </div>
            <div>
              <div
                className="overflow-hidden rounded-[12px]"
                style={{ border: `1px solid ${C.hair}` }}
              >
                <Img
                  src={u(IMG[s.imageKey], 1280)}
                  srcSet={srcSet(IMG[s.imageKey])}
                  sizes="(max-width:1024px) 100vw, 620px"
                  alt={s.alpha}
                  className="block w-full object-cover"
                  style={{ aspectRatio: '3 / 2' }}
                  fallbackClassName="bg-gradient-to-br from-[#11161B] to-[#070A0D]"
                />
              </div>
              <p className="mt-2.5 font-geistmono text-[10px]" style={{ color: C.muted }}>
                {IMG_DISCLAIMER}
              </p>
            </div>
          </div>
        ))}
      </section>
    )
  }

  return (
    <section id="climb" ref={wrapRef} style={{ height: '320vh', background: bg }}>
      <h2 style={srOnly}>The climb — basalt coast to summit</h2>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="absolute left-[26px] top-0 hidden h-full w-px sm:block" style={{ background: C.hair }}>
          <span
            className="absolute left-0 top-0 w-px"
            style={{ height: `${prog * 100}%`, background: C.ice, boxShadow: `0 0 8px ${C.ice}` }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-[26px] sm:pl-[58px] sm:pr-[90px]">
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,clamp(460px,42vw,620px))] lg:items-center">
            {/* stages cross-fade in place */}
            <div className="relative" style={{ minHeight: 'clamp(220px,38vh,360px)' }}>
              {STAGES.map((s, i) => {
                const active = i === stageAt
                return (
                  <div
                    key={s.id}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{
                      opacity: active ? 1 : 0,
                      transform: active ? 'translateY(0)' : `translateY(${i < stageAt ? -22 : 22}px)`,
                      transition: 'opacity .55s ease, transform .55s ease',
                      pointerEvents: active ? 'auto' : 'none',
                    }}
                  >
                    <Eyebrow color={C.ice}>
                      {s.index} / {s.label} — {pad4(s.alt)} M
                    </Eyebrow>
                    <p
                      className="mt-5 max-w-[600px] font-geist leading-[1.42]"
                      style={{ color: txtOnBg, fontSize: 'clamp(22px,3.6vw,40px)', letterSpacing: '-0.02em' }}
                    >
                      {s.line}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* ENLARGED inset plate — parallaxes slightly slower than text */}
            <div style={{ transform: `translateY(${(0.5 - prog) * 26}px)` }}>
              {STAGES.map((s, i) => (
                <div
                  key={s.id}
                  className="overflow-hidden rounded-[12px]"
                  style={{ display: i === stageAt ? 'block' : 'none', border: `1px solid ${C.hairBright}` }}
                >
                  <Img
                    src={u(IMG[s.imageKey], 1280)}
                    srcSet={srcSet(IMG[s.imageKey])}
                    sizes="(max-width:1024px) 100vw, 620px"
                    alt={s.alpha}
                    className="block w-full object-cover"
                    style={{ aspectRatio: '3 / 2' }}
                    fallbackClassName="bg-gradient-to-br from-[#11161B] to-[#070A0D]"
                  />
                  <div
                    className="px-3.5 py-2.5 font-geistmono text-[10px] uppercase tracking-[0.12em]"
                    style={{ background: 'rgba(7,10,13,0.55)', color: C.muted }}
                  >
                    {s.alpha}
                  </div>
                </div>
              ))}
              <p className="mt-2.5 font-geistmono text-[10px]" style={{ color: C.muted }}>
                {IMG_DISCLAIMER}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  GALLERY — On the ice. Justified masonry grid with a 2-col hero tile + lightbox.
 * ═════════════════════════════════════════════════════════════════════════ */
function Gallery() {
  const [open, setOpen] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const openAt = (i: number) => {
    triggerRef.current = document.activeElement as HTMLElement | null
    setOpen(i)
  }
  const close = () => {
    setOpen(null)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (open === null) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab') {
        // single focusable inside the dialog — keep focus trapped on the close button
        e.preventDefault()
        closeRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <section id="gallery" style={{ background: C.ground, padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="mx-auto max-w-6xl px-[26px] sm:pr-[90px]">
        <SectionHead
          eyebrow="ON THE GLACIER · FRAMES"
          title="On the ice"
          intro="The black coast, the snowline, the snow-cat tracks and the 360° summit — the experience the page is built to sell."
        />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {GALLERY.map((g, i) => (
            <Reveal
              key={`${g.key}-${i}`}
              delay={(i % 4) * 70}
              y={16}
              className={`group ${g.wide ? 'col-span-2 row-span-2' : ''}`}
            >
              <button
                type="button"
                onClick={() => openAt(i)}
                className="block h-full w-full overflow-hidden rounded-[12px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ border: `1px solid ${C.hair}`, cursor: 'zoom-in', outlineColor: C.ice }}
                aria-label={`Enlarge: ${g.alt}`}
              >
                <Img
                  src={u(IMG[g.key], g.wide ? 1600 : 900)}
                  srcSet={srcSet(IMG[g.key])}
                  sizes={g.wide ? '(max-width:1024px) 100vw, 50vw' : '(max-width:1024px) 50vw, 25vw'}
                  alt={g.alt}
                  className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  style={{ aspectRatio: g.wide ? '4 / 3' : '1 / 1' }}
                  fallbackClassName="bg-gradient-to-br from-[#11161B] to-[#070A0D]"
                />
              </button>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 font-geistmono text-[10px]" style={{ color: C.muted }}>
          {IMG_DISCLAIMER}
        </p>
      </div>

      {/* lightbox */}
      {open !== null && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center p-5"
          style={{ background: 'rgba(7,10,13,0.92)', backdropFilter: 'blur(4px)' }}
          role="dialog"
          aria-modal="true"
          aria-label={GALLERY[open].alt}
          onClick={close}
        >
          <div className="gp-lightbox relative max-h-[88vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <Img
              src={u(IMG[GALLERY[open].key], 2200)}
              srcSet={srcSet(IMG[GALLERY[open].key])}
              sizes="92vw"
              alt={GALLERY[open].alt}
              className="block max-h-[82vh] w-auto rounded-[12px] object-contain"
              style={{ border: `1px solid ${C.hairBright}` }}
              fallbackClassName="bg-gradient-to-br from-[#11161B] to-[#070A0D]"
            />
            <p className="mt-3 text-center font-geistmono text-[11px] uppercase tracking-[0.1em]" style={{ color: C.muted }}>
              {GALLERY[open].alt} · indicative
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full font-geist text-[20px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: 'rgba(17,22,27,0.9)', color: C.ink, border: `1px solid ${C.hair}`, cursor: 'pointer', outlineColor: C.ice }}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  REVIEWS / TRUST — stat tiles + sample review cards.
 * ═════════════════════════════════════════════════════════════════════════ */
function Reviews() {
  return (
    <section style={{ background: C.surface, padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="mx-auto max-w-6xl px-[26px] sm:pr-[90px]">
        <SectionHead
          eyebrow="WHY CLIMB WITH US"
          title="A small family on the ice"
          intro="Third-generation glacier guides who treat every ascent as a personal one — these stats and quotes are shown as samples."
        />

        {/* stat tiles */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRUST.map((t, i) => (
            <Reveal
              key={t.k}
              delay={i * 60}
              className="gp-stat rounded-[12px] p-5"
              style={{ background: C.ground, border: `1px solid ${C.hair}` }}
            >
              <div className="font-geistmono text-[26px] tabular-nums leading-none" style={{ color: C.ice }}>
                {t.v}
              </div>
              <span className="mt-2 block h-px w-8" style={{ background: C.iceDim }} aria-hidden />
              <div className="mt-2.5 font-geistmono text-[11px] uppercase tracking-[0.1em]" style={{ color: C.muted }}>
                {t.k}
                {t.sample && <span className="ml-1" style={{ color: C.summit }}>· sample</span>}
              </div>
            </Reveal>
          ))}
        </div>

        {/* review cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal
              key={i}
              delay={i * 80}
              className="flex flex-col rounded-[12px] p-6"
              style={{ background: C.ground, border: `1px solid ${C.hair}` }}
            >
              <span className="font-geistmono text-[28px] leading-none" style={{ color: C.iceDim }} aria-hidden>
                “
              </span>
              <p className="mt-2 flex-1 font-geist text-[15px] leading-[1.6]" style={{ color: C.ink }}>
                {r.quote}
              </p>
              <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: C.hair }}>
                <span className="font-geistmono text-[11px] uppercase tracking-[0.1em]" style={{ color: C.muted }}>
                  {r.who}
                </span>
                <span className="font-geistmono text-[10px]" style={{ color: C.summit }}>
                  {r.from}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-5 font-geistmono text-[10px]" style={{ color: C.muted }}>
          The 4.6★ rating and the review quotes are placeholders — no public reviews appear on the current site.
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  FAQ ACCORDION — keyboard-accessible expand/collapse.
 * ═════════════════════════════════════════════════════════════════════════ */
function FaqRow({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-[12px]" style={{ border: `1px solid ${open ? C.iceDim : C.hair}`, background: C.surface }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ cursor: 'pointer', outlineColor: C.ice }}
      >
        <span className="font-geist text-[16px] font-500" style={{ color: C.ink }}>
          {q}
        </span>
        <span
          className="grid h-6 w-6 shrink-0 place-items-center font-geistmono text-[16px] transition-transform duration-300"
          style={{ color: C.ice, transform: open ? 'rotate(45deg)' : 'none' }}
          aria-hidden
        >
          +
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? 240 : 0,
          opacity: open ? 1 : 0,
          transition: 'max-height .35s ease, opacity .35s ease',
          overflow: 'hidden',
        }}
      >
        <p className="px-5 pb-5 font-geist text-[14px] leading-[1.6]" style={{ color: C.muted }}>
          {a}
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  MEET THE FAMILY + FAQ + CONTACT — lineage portrait, accordion, contact.
 * ═════════════════════════════════════════════════════════════════════════ */
function FamilyFaqContact() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const contacts: { k: string; v: string; href?: string; note?: string }[] = [
    { k: 'EMAIL', v: PLACEHOLDER_EMAIL, href: `mailto:${PLACEHOLDER_EMAIL}`, note: 'placeholder' },
    { k: 'PHONE', v: PHONES[0], href: `tel:${PHONES[0].replace(/\s/g, '')}` },
    { k: 'PHONE', v: PHONES[1], href: `tel:${PHONES[1].replace(/\s/g, '')}` },
    { k: 'ADDRESS', v: ADDRESS },
    { k: 'INSTAGRAM', v: INSTAGRAM, href: `https://instagram.com/${INSTAGRAM.replace('@', '')}` },
    { k: 'FACEBOOK', v: FACEBOOK, href: `https://facebook.com/${FACEBOOK}` },
  ]

  return (
    <section id="family" style={{ background: C.ground, padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="mx-auto max-w-6xl px-[26px] sm:pr-[90px]">
        {/* meet the family — portrait + story */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <Reveal className="overflow-hidden rounded-[14px]" style={{ border: `1px solid ${C.hair}` }}>
            <Img
              src={u(IMG.family, 1280)}
              srcSet={srcSet(IMG.family)}
              sizes="(max-width:1024px) 100vw, 46vw"
              alt="Two glacier guides on Snæfellsjökull"
              className="block w-full object-cover"
              style={{ aspectRatio: '4 / 5' }}
              fallbackClassName="bg-gradient-to-br from-[#11161B] to-[#070A0D]"
            />
            <p
              className="px-4 py-2.5 font-geistmono text-[10px] uppercase tracking-[0.1em]"
              style={{ background: 'rgba(7,10,13,0.5)', color: C.muted }}
            >
              Vignir & Kolfinna on the glacier — {IMG_DISCLAIMER}
            </p>
          </Reveal>

          <div>
            <Eyebrow>3RD GENERATION ON THE GLACIER</Eyebrow>
            <h2
              className="mt-4 font-geist font-600 leading-[1.04]"
              style={{ color: C.ink, fontSize: 'clamp(1.9rem,4vw,3rem)', letterSpacing: '-0.03em' }}
            >
              Meet the family
            </h2>
            <p className="mt-5 max-w-[480px] font-geist leading-[1.55]" style={{ color: C.ink, fontSize: 'clamp(16px,1.8vw,19px)' }}>
              Founded in 2022 by Vignir and Kolfinna — the third generation of
              their family to guide on this ice, with 20+ years of family
              experience on Snæfellsjökull.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Reveal className="rounded-[12px] p-5" style={{ background: C.surface, border: `1px solid ${C.hair}` }}>
                <div className="font-geistmono text-[11px] uppercase tracking-[0.12em]" style={{ color: C.ice }}>
                  Vignir
                </div>
                <p className="mt-2 font-geist text-[14px] leading-[1.6]" style={{ color: C.muted }}>
                  {FAMILY.vignir}
                </p>
              </Reveal>
              <Reveal delay={70} className="rounded-[12px] p-5" style={{ background: C.surface, border: `1px solid ${C.hair}` }}>
                <div className="font-geistmono text-[11px] uppercase tracking-[0.12em]" style={{ color: C.ice }}>
                  Kolfinna
                </div>
                <p className="mt-2 font-geist text-[14px] leading-[1.6]" style={{ color: C.muted }}>
                  {FAMILY.kolfinna}
                </p>
              </Reveal>
            </div>
            <p className="mt-5 max-w-[480px] font-geist text-[13px] leading-[1.6]" style={{ color: C.muted }}>
              Snæfellsjökull is the mountain through which Jules Verne’s travellers
              descended in <span className="italic">Journey to the Center of the Earth</span> (1864) — a
              fact about the peak, not a claim we make.
            </p>
          </div>
        </div>

        {/* FAQ + contact */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <Eyebrow>BEFORE YOU CLIMB</Eyebrow>
            <h3
              className="mt-3 font-geist font-600 leading-[1.05]"
              style={{ color: C.ink, fontSize: 'clamp(1.6rem,3vw,2.2rem)', letterSpacing: '-0.02em' }}
            >
              Questions, answered
            </h3>
            <div className="mt-6 flex flex-col gap-3">
              {FAQ.map((f, i) => (
                <Reveal key={f.q} delay={i * 50} y={14}>
                  <FaqRow
                    q={f.q}
                    a={f.a}
                    open={openFaq === i}
                    onToggle={() => setOpenFaq((cur) => (cur === i ? null : i))}
                  />
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={80}>
            <h3 style={srOnly}>Contact</h3>
            <div className="font-geistmono text-[11px] uppercase tracking-[0.12em]" style={{ color: C.ice }} aria-hidden>
              Contact
            </div>
            <div className="mt-5 flex flex-col gap-px overflow-hidden rounded-[12px]" style={{ background: C.hair }}>
              {contacts.map((c, i) => (
                <div
                  key={`${c.k}-${i}`}
                  className="flex items-center justify-between gap-4 px-4 py-3.5"
                  style={{ background: C.surface }}
                >
                  <span className="font-geistmono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: C.muted }}>
                    {c.k}
                  </span>
                  <span className="text-right font-geistmono text-[13px]" style={{ color: C.ink }}>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={{ color: C.ink }}>
                        {c.v}
                      </a>
                    ) : (
                      c.v
                    )}
                    {c.note && <span className="ml-1.5 text-[10px]" style={{ color: C.summit }}>· {c.note}</span>}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 font-geistmono text-[10px]" style={{ color: C.muted }}>
              The email above is a placeholder — the current site lists no email address.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  SUMMIT BOOKING PANEL — arrival. Tour selector + faint summit-wash backdrop.
 * ═════════════════════════════════════════════════════════════════════════ */
function Booking({ tourId, setTourId }: { tourId: string; setTourId: (id: string) => void }) {
  const today = new Date().toISOString().slice(0, 10)
  const [party, setParty] = useState(2)
  const [date, setDate] = useState(today)
  const selected = TOURS.find((t) => t.id === tourId) ?? TOURS[0]
  // Only the flagship diamond tour has a concrete sample price; others are on request.
  const hasPrice = selected.id === 'diamond'
  const total = PRICE_ISK * party

  return (
    <section id="book" className="relative overflow-hidden" style={{ background: C.summitWash, padding: 'clamp(72px,9vw,120px) 0' }}>
      {/* faint summit-wash backdrop fills the band */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Img
          src={u(IMG.bookingWash, 2200)}
          srcSet={srcSet(IMG.bookingWash)}
          sizes="100vw"
          alt=""
          className="h-full w-full object-cover"
          style={{ opacity: 0.16 }}
          fallbackClassName="bg-gradient-to-br from-[#46586A] to-[#2a3742]"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(70,88,106,.6), rgba(70,88,106,.85))' }}
        />
      </div>

      <div className="relative z-[2] mx-auto max-w-5xl px-[26px] sm:pr-[90px]">
        <Reveal
          className="relative overflow-hidden rounded-[16px]"
          style={{ background: C.surface, border: `1px solid ${C.hairBright}`, boxShadow: '0 40px 90px rgba(7,10,13,0.45)' }}
        >
          <span
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${C.summit}, transparent)` }}
            aria-hidden
          />
          <div
            className="absolute right-5 top-5 hidden rounded-[8px] px-3 py-1.5 sm:block"
            style={{ border: `1px solid ${C.summit}55`, background: 'rgba(7,10,13,0.4)' }}
          >
            <span className="font-geistmono text-[10px] uppercase tracking-[0.14em]" style={{ color: C.muted }}>
              ALT{' '}
            </span>
            <span className="font-geistmono text-[13px] tabular-nums" style={{ color: C.summit }}>
              {pad4(SUMMIT_M)} M · ARRIVED
            </span>
          </div>

          <div className="grid gap-px sm:grid-cols-2" style={{ background: C.hairBright }}>
            {/* left — tour summary */}
            <div className="p-7 sm:p-9" style={{ background: C.surface }}>
              <Eyebrow>SUMMIT REACHED · BOOK YOUR CLIMB</Eyebrow>
              <h2 style={srOnly}>Book your climb</h2>
              <p
                className="mt-4 font-geist font-600 leading-[1.0]"
                style={{ color: C.ink, fontSize: 'clamp(1.9rem,4vw,3rem)', letterSpacing: '-0.03em' }}
              >
                {selected.name}
              </p>
              <div className="mt-7 flex flex-col gap-px overflow-hidden rounded-[10px]" style={{ background: C.hair }}>
                {SUMMARY.map((row, i) => (
                  <div
                    key={row.k}
                    className="gp-row flex items-center justify-between px-4 py-3"
                    style={{ background: C.surface, ['--i' as string]: `${i * 60}ms` }}
                  >
                    <span className="font-geistmono text-[11px] uppercase tracking-[0.12em]" style={{ color: C.muted }}>
                      {row.k}
                    </span>
                    <span className="font-geistmono text-[13px]" style={{ color: C.ink }}>
                      {row.k === 'TOUR' ? selected.name : row.v}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-4" style={{ background: C.surface }}>
                  <span className="font-geistmono text-[11px] uppercase tracking-[0.12em]" style={{ color: C.muted }}>
                    PRICE
                  </span>
                  <span className="font-geistmono text-[20px] tabular-nums font-600" style={{ color: C.summit }}>
                    {hasPrice ? (
                      <>
                        <CountUp to={PRICE_ISK} render={(n) => Math.round(n).toLocaleString('is-IS')} /> kr
                      </>
                    ) : (
                      <span className="text-[15px]" style={{ color: C.muted }}>
                        {selected.price}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <p className="mt-3 font-geistmono text-[10.5px]" style={{ color: C.muted }}>
                Sample price · per person · sýnishorn. No live price on the current site.
              </p>
            </div>

            {/* right — booking action */}
            <div className="p-7 sm:p-9" style={{ background: C.surface }}>
              <div className="font-geistmono text-[11px] uppercase tracking-[0.12em]" style={{ color: C.muted }}>
                Reserve
              </div>

              {/* tour selector */}
              <label className="mt-5 block">
                <span className="mb-2 block font-geistmono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: C.muted }}>
                  Tour
                </span>
                <select
                  value={tourId}
                  onChange={(e) => setTourId(e.target.value)}
                  className="w-full rounded-[9px] px-3.5 py-3 font-geistmono text-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ background: 'rgba(127,200,232,0.06)', border: `1px solid ${C.iceDim}`, color: C.ink, colorScheme: 'dark', outlineColor: C.ice, cursor: 'pointer' }}
                >
                  {TOURS.map((t) => (
                    <option key={t.id} value={t.id} style={{ background: C.surface, color: C.ink }}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block">
                <span className="mb-2 block font-geistmono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: C.muted }}>
                  Date
                </span>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-[9px] px-3.5 py-3 font-geistmono text-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ background: 'rgba(127,200,232,0.06)', border: `1px solid ${C.iceDim}`, color: C.ink, colorScheme: 'dark', outlineColor: C.ice }}
                />
              </label>

              <div className="mt-4">
                <span className="mb-2 block font-geistmono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: C.muted }}>
                  Party
                </span>
                <div
                  className="flex items-center justify-between rounded-[9px] px-2.5 py-1.5"
                  style={{ background: 'rgba(127,200,232,0.06)', border: `1px solid ${C.iceDim}` }}
                >
                  <button
                    onClick={() => setParty((p) => Math.max(1, p - 1))}
                    disabled={party <= 1}
                    aria-label="Fewer guests"
                    className="grid h-11 w-11 place-items-center rounded-[7px] text-[18px] leading-none transition-opacity disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
                    style={{ background: 'rgba(127,200,232,0.1)', color: C.ice, cursor: 'pointer', outlineColor: C.ice }}
                  >
                    −
                  </button>
                  <span className="font-geistmono text-[18px] tabular-nums" style={{ color: C.ink }}>
                    {party}
                  </span>
                  <button
                    onClick={() => setParty((p) => Math.min(8, p + 1))}
                    disabled={party >= 8}
                    aria-label="More guests"
                    className="grid h-11 w-11 place-items-center rounded-[7px] text-[18px] leading-none transition-opacity disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
                    style={{ background: 'rgba(127,200,232,0.1)', color: C.ice, cursor: 'pointer', outlineColor: C.ice }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t pt-5" style={{ borderColor: C.hair }}>
                <span className="font-geistmono text-[11px] uppercase tracking-[0.12em]" style={{ color: C.muted }}>
                  Est. total
                </span>
                <span className="font-geistmono text-[24px] tabular-nums font-600" style={{ color: C.ink }}>
                  {hasPrice ? (
                    <>
                      {total.toLocaleString('is-IS')}{' '}
                      <span className="text-[0.5em]" style={{ color: C.muted }}>
                        kr
                      </span>
                    </>
                  ) : (
                    <span className="text-[18px]" style={{ color: C.muted }}>
                      On request
                    </span>
                  )}
                </span>
              </div>

              <button
                type="button"
                className="gp-cta mt-6 flex w-full items-center justify-center gap-2 rounded-[11px] py-4 font-geist text-[16px] font-600 transition-transform active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ background: C.summit, color: C.ground, outlineColor: C.ice, cursor: 'pointer' }}
              >
                Reserve your seat <span aria-hidden>↑</span>
              </button>
              <p className="mt-4 text-center font-geistmono text-[11px]" style={{ color: C.muted }}>
                Prefer to talk?{' '}
                {PHONES.map((p, i) => (
                  <span key={p}>
                    <a href={`tel:${p.replace(/\s/g, '')}`} style={{ color: C.ice }}>
                      {p}
                    </a>
                    {i === 0 ? ' / ' : ''}
                  </span>
                ))}
              </p>
              <p className="mt-2 text-center font-geistmono text-[10px]" style={{ color: C.muted }}>
                Booking flow is a prototype — no payment is taken.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function GlacierParadisePage() {
  const [alt, setAlt] = useState(HERO_ALT)
  const [summitGlow, setSummitGlow] = useState(false)
  const [tourId, setTourId] = useState('diamond')
  const [docked, setDocked] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Glacier Paradise · The Ascent — Snæfellsjökull snow-cat tours'
    setThemeColor(C.ground)
    return () => setThemeColor('#0a1320')
  }, [])

  // dock the sticky bar once the hero scrolls past
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const r = hero.getBoundingClientRect()
        setDocked(r.bottom < 80)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    const t = window.setTimeout(onScroll, 300)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(t)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  // line-up card → preselect tour + scroll to booking
  const pickTour = (id: string) => {
    setTourId(id)
    scrollToId('book')
  }

  return (
    <div className="font-geist overflow-x-hidden" style={{ background: C.ground, color: C.ink }}>
      <style>{`
        #gp-root ::selection { background:${C.ice}; color:${C.ground}; }
        #gp-root :focus-visible { outline-color:${C.ice}; }
        .gp-rise { opacity:1; }
        @media (prefers-reduced-motion: no-preference) {
          html { scroll-behavior: smooth; }
          .gp-rise { animation: gp-rise .85s cubic-bezier(.22,.7,.2,1) var(--d,0ms) both; }
          @keyframes gp-rise { from { transform:translateY(14px); } to { transform:none; } }
          @keyframes gp-bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(6px); } }
          .gp-bob { animation: gp-bob 2.2s ease-in-out infinite; }
          .gp-cta { box-shadow: 0 0 0 0 rgba(255,185,122,0); animation: gp-breathe 4s ease-in-out infinite; }
          @keyframes gp-breathe { 0%,100% { box-shadow: inset 0 0 0 0 rgba(255,255,255,0); } 50% { box-shadow: inset 0 0 22px 0 rgba(255,255,255,.22); } }
          .gp-row { opacity:0; transform:translateY(8px); animation: gp-row .5s ease forwards var(--i,0ms); }
          @keyframes gp-row { to { opacity:1; transform:none; } }
          .gp-hero-img { animation: gp-breath 22s ease-in-out infinite; transform-origin: 60% 40%; }
          @keyframes gp-breath { 0%,100% { transform: scale(1.0); } 50% { transform: scale(1.05); } }
          .gp-lightbox { animation: gp-pop .3s ease both; }
          @keyframes gp-pop { from { opacity:0; transform: scale(.97); } to { opacity:1; transform:none; } }
        }
        @media (prefers-reduced-motion: reduce) {
          .gp-row { opacity:1; transform:none; }
          .gp-hero-img { transform: scale(1.02); }
        }
      `}</style>
      <div id="gp-root">
        <PreviewChrome company={company} />
        <PartialPrototypeBanner />
        <AltimeterRail alt={alt} summitGlow={summitGlow} />
        <StickyBar alt={alt} visible={docked} />
        <MobileBookDock visible={docked} />
        <main>
          <div ref={heroRef}>
            <Hero />
          </div>
          <TourLineup onPick={pickTour} />
          <WhatToExpect />
          <ExperienceBand />
          <Climb setAlt={setAlt} setSummitGlow={setSummitGlow} />
          <Gallery />
          <Reviews />
          <FamilyFaqContact />
          <Booking tourId={tourId} setTourId={setTourId} />
        </main>
        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
