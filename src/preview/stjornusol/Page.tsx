import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  BEDS,
  DESTINATIONS,
  FACEBOOK,
  FOUNDED,
  INSTAGRAM,
  MAPS_HREF,
  NOONA,
  PHONE_DISPLAY,
  PHONE_HREF,
  PRICES,
  TOWN,
} from './data'

const company = getPreviewCompany('stjornusol')

/* ── "Vélin vaknar" — the K11 render's own materials: obsidian room,
      champagne metal, violet LED light, and the brand's magenta star ──── */
const OBSIDIAN = '#0A090C' // page ground (the room)
const OBSIDIAN2 = '#111015' // raised panels
const CHAMPAGNE = '#D3C7B2' // the pillars: structure, rules, big numerals
const CHAMP_DIM = '#9C917E' // secondary champagne text (AA on obsidian)
const TXT = '#F4EFE6' // headline ivory
const BODY_T = '#C9C2B4' // body text on obsidian
const MAGENTA = '#E8357E' // brand star — CTAs and living accents
const MAGENTA_DEEP = '#C2185F' // CTA fill (white text ≥5:1)
const HAIR = 'rgba(211,199,178,.16)' // champagne hairline; LED violet + amber live in PANEL_ART

const BASE = import.meta.env.BASE_URL
const A = `${BASE}stjornusol/`
const DISPLAY = "'Melodrama-Semibold', Georgia, serif"
const DISPLAY_MED = "'Melodrama-Medium', Georgia, serif"
const HANKEN = "'Hanken Grotesk', system-ui, sans-serif"
const MONO = "'Geist Mono', ui-monospace, monospace"
const EASE = 'cubic-bezier(.32,.72,0,1)'

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── LED relight of the Higgsfield render — each panel is a masked light
      layer over the OFF photo; panels wake in sequence, then shimmer.
      Regions are % of the 2688x1520 frame. ──────────────────────────── */
interface Panel {
  id: string
  left: number
  top: number
  width: number
  height: number
  delay: number
  kind: 'field' | 'bar' | 'deck' | 'base'
  clip?: string
}

const PANELS: Panel[] = [
  { id: 'canopy', left: 28.2, top: 9.6, width: 43.6, height: 5.6, delay: 0.4, kind: 'field', clip: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)' },
  { id: 'bar1', left: 29.2, top: 40.2, width: 39.0, height: 7.6, delay: 1.15, kind: 'bar' },
  { id: 'bar2', left: 29.6, top: 53.0, width: 40.6, height: 7.4, delay: 1.8, kind: 'bar' },
  { id: 'deck', left: 26.0, top: 63.2, width: 48.0, height: 9.5, delay: 2.5, kind: 'deck' },
  { id: 'strip', left: 28.6, top: 75.6, width: 42.8, height: 5.2, delay: 2.3, kind: 'field' },
  { id: 'base', left: 26.5, top: 83.6, width: 47.0, height: 7.2, delay: 2.7, kind: 'field' },
]

function K11Relight({ on }: { on: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-0" data-lit={on}>
      {/* staged wake: each panel is a clipped window revealing the lit frame */}
      {PANELS.map((p) => (
        <div
          key={p.id}
          className="sv-panel absolute overflow-hidden"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.width}%`,
            height: `${p.height}%`,
            clipPath: p.clip,
            ['--pd' as string]: `${p.delay}s`,
          } as React.CSSProperties}
        >
          <img
            src={`${A}k11-on.webp`}
            alt=""
            className="absolute"
            style={{
              width: `${(100 / p.width) * 100}%`,
              height: `${(100 / p.height) * 100}%`,
              left: `${(-p.left / p.width) * 100}%`,
              top: `${(-p.top / p.height) * 100}%`,
              maxWidth: 'none',
            }}
          />
        </div>
      ))}
      {/* the full lit frame unifies the baked bloom, reflections and spill,
          then hums globally; a clipped veil gives bar2 a faulty-driver blink */}
      <img src={`${A}k11-on.webp`} alt="" className="sv-onfull absolute inset-0 h-full w-full" style={{ maxWidth: 'none' }} />
      <div className="sv-blink absolute" style={{ left: '29.6%', top: '53%', width: '40.6%', height: '7.4%', background: '#0A090C', borderRadius: 6 }} />
    </div>
  )
}

/* ── IO reveal ─────────────────────────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    io.observe(el)
    const t = window.setTimeout(() => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) setOn(true)
    }, 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])
  return (
    <div ref={ref} data-in={on} className={`sv-r ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ── Destination skies (verified programs) ─────────────────────────────── */
const SKY: Record<string, string> = {
  capri: 'linear-gradient(180deg, #1A0F2E 0%, #4A2350 45%, #C25A6B 78%, #F5A05C 100%)',
  hawaii: 'linear-gradient(180deg, #0E2247 0%, #2B5C9E 45%, #7FB2D9 78%, #F7E9B8 100%)',
  hamptons: 'linear-gradient(180deg, #191026 0%, #55284E 40%, #B14A67 70%, #E88B54 100%)',
}
const SUN_Y: Record<string, string> = { capri: '72%', hawaii: '30%', hamptons: '84%' }

export default function StjornusolPage() {
  const [lit, setLit] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [slot, setSlot] = useState<'morgun' | 'dag'>('morgun')
  const [nowSlot, setNowSlot] = useState<'morgun' | 'dag'>('morgun')
  const [dest, setDest] = useState(0)
  const [peek, setPeek] = useState(0)
  const [barHidden, setBarHidden] = useState(false)
  const progFill = useRef<HTMLDivElement>(null)
  const peekEl = useRef<HTMLDivElement>(null)
  const finaleEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Stjörnusól, sólbaðsstofa í Hafnarfirði. Bóka tíma á Noona'
    setThemeColor(OBSIDIAN)
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prev = meta.content
    meta.content =
      'Stjörnusól er sólbaðsstofa á Fjarðargötu 17 í Hafnarfirði, síðan 1979. K11 Air Loft, morgunverð alla daga fyrir kl. 14, opið til 22:00. Bókaðu á Noona.'
    return () => {
      if (created) meta?.remove()
      else if (meta) meta.content = prev
    }
  }, [])

  /* the machine wakes shortly after load */
  useEffect(() => {
    if (reduceMotion()) {
      setLit(true)
      return
    }
    const t = window.setTimeout(() => setLit(true), 700)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const h = new Date().getHours()
    const now = h >= 10 && h < 14 ? 'morgun' : 'dag'
    setNowSlot(now)
    setSlot(now)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      if (progFill.current) {
        const d = document.documentElement.scrollHeight - window.innerHeight
        progFill.current.style.transform = `scaleX(${d > 0 ? Math.min(1, window.scrollY / d) : 0})`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* bed peek follower */
  useEffect(() => {
    if (reduceMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      if (!peekEl.current) return
      const w = Math.min(300, window.innerWidth * 0.34)
      const x = Math.min(e.clientX + 24, window.innerWidth - w - 12)
      const y = Math.min(e.clientY + 24, window.innerHeight - w * 0.75 - 12)
      peekEl.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const el = finaleEl.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setBarHidden(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const jsonLd = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TanningSalon',
        name: 'Stjörnusól',
        url: 'https://solbadsstofa.is',
        telephone: '+3545557272',
        foundingDate: FOUNDED,
        image: `${A}k11-on.webp`,
        address: { '@type': 'PostalAddress', streetAddress: ADDRESS, postalCode: '220', addressLocality: 'Hafnarfjörður', addressCountry: 'IS' },
        openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '10:00', closes: '22:00' }],
        priceRange: '2.190 kr. til 32.900 kr.',
        sameAs: [FACEBOOK, INSTAGRAM],
        potentialAction: { '@type': 'ReserveAction', target: NOONA },
      }),
    [],
  )

  const morgun = slot === 'morgun'
  const d = DESTINATIONS[dest]

  const cta = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: MAGENTA_DEEP,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 700,
    borderRadius: 999,
    fontFamily: HANKEN,
    ...extra,
  })

  return (
    <div className="sv-root min-h-screen antialiased" style={{ background: OBSIDIAN, color: BODY_T, fontFamily: HANKEN, overflowX: 'clip' }}>
      <link rel="stylesheet" href={`${BASE}fonts/melodrama/css/melodrama.css`} />
      <script type="application/ld+json">{jsonLd}</script>

      <style>{`
        .sv-root ::selection{background:${MAGENTA_DEEP};color:#FFF6EE}
        .sv-root :focus-visible{outline:3px solid ${MAGENTA};outline-offset:3px}
        @keyframes svWake{0%{opacity:0;clip-path:inset(0 100% 0 0)}10%{opacity:.35;clip-path:inset(0 100% 0 0)}16%{opacity:.12}26%{opacity:.85;clip-path:inset(0 55% 0 0)}38%{opacity:.3}52%{opacity:1;clip-path:inset(0 12% 0 0)}70%,100%{opacity:1;clip-path:inset(0 0 0 0)}}
        @keyframes svHum{0%,91%{opacity:1}91.6%{opacity:.82}92.1%{opacity:1}95.4%{opacity:.9}95.8%{opacity:1}98.1%{opacity:.86}98.5%,100%{opacity:1}}
        @keyframes svRoom{from{opacity:0}to{opacity:1}}
        .sv-panel{opacity:0;will-change:opacity;transition:opacity .5s ease}
        .sv-onfull{transition:opacity .5s ease}
        [data-lit="true"] .sv-panel{animation:svWake 1.4s steps(1,end) var(--pd,0s) both}
        .sv-onfull{opacity:0;will-change:opacity}
        .sv-power{transition:background .35s ease, border-color .35s ease}
        .sv-power .sv-knob{transition:transform .4s cubic-bezier(.32,.72,0,1), background .35s ease, box-shadow .35s ease}
        [data-lit="true"] .sv-onfull{animation:svRoom .9s ease 2.9s both, svHum 11s steps(1,end) 5s infinite}
        .sv-blink{opacity:0}
        [data-lit="true"] .sv-blink{animation:svBlink 13s steps(1,end) 7s infinite}
        @keyframes svBlink{0%,93.2%{opacity:0}93.6%{opacity:.32}94%{opacity:0}96.4%{opacity:.18}96.8%,100%{opacity:0}}
        .sv-r{opacity:0;transform:translateY(28px);transition:opacity .9s ease,transform .9s ${EASE}}
        .sv-r[data-in="true"]{opacity:1;transform:none}
        .sv-rise{animation:svRise 1s ${EASE} both}
        @keyframes svRise{from{opacity:0;transform:translateY(26px)}}
        .sv-cta{transition:transform .3s ${EASE}, box-shadow .3s ease, filter .25s ease}
        .sv-cta:hover{transform:translateY(-3px);filter:brightness(1.1)}
        .sv-cta:active{transform:scale(.97)}
        .sv-ghost{transition:background .3s ease, transform .3s ${EASE}}
        .sv-ghost:hover{background:rgba(244,239,230,.08);transform:translateY(-2px)}
        .sv-ghost:active{transform:scale(.97)}
        @keyframes svTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .sv-ticker{animation:svTicker 36s linear infinite}
        .sv-row{transition:transform .35s ${EASE}, background .35s ease}
        .sv-row:hover{transform:translateX(8px)}
        .sv-sunarc{transition:top 1.1s ${EASE}, background .9s ease}
        .sv-sky{transition:opacity 1s ease}
        .sv-roll{transition:transform .55s cubic-bezier(.6,.1,.2,1)}
        .sv-peek-card{transition:opacity .28s ease, transform .32s ${EASE}}
        .sv-peek-img{transition:opacity .25s ease}
        @keyframes svSpin{to{transform:rotate(360deg)}}
        @keyframes svBadge{0%,86%{opacity:1}88%{opacity:.4}90%{opacity:1}94%{opacity:.7}96%,100%{opacity:1}}
        @media (prefers-reduced-motion: reduce){
          .sv-panel,.sv-blink{animation:none !important;opacity:0 !important}
          .sv-onfull{animation:none !important;opacity:1 !important}
          .sv-r{opacity:1;transform:none;transition:none}
          .sv-rise{animation:none}
          .sv-ticker{animation:none}
          .sv-roll{transition:none !important}
          .sv-spin{animation:none !important}
        }
      `}</style>

      {/* ── top progress hairline ─────────────────────────────────────── */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-[2px]" style={{ background: 'rgba(211,199,178,.1)' }}>
        <div ref={progFill} className="h-full w-full origin-left" style={{ background: `linear-gradient(90deg, ${CHAMPAGNE}, ${MAGENTA})`, transform: 'scaleX(0)', willChange: 'transform' }} />
      </div>

      {/* ── header ────────────────────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-3"
        style={{
          padding: 'clamp(14px,2.4vw,20px) clamp(16px,4vw,36px)',
          background: scrolled ? 'rgba(10,9,12,.78)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: `1px solid ${scrolled ? HAIR : 'transparent'}`,
          transition: 'background .45s ease, backdrop-filter .45s ease, border-color .45s ease',
        }}
      >
        <a href="#top" aria-label="Stjörnusól, forsíða" className="shrink-0">
          <img src={`${A}logo.png`} alt="Stjörnusól" className="h-6 w-auto md:h-7" />
        </a>
        <nav className="hidden items-center gap-6 text-[13px] font-semibold tracking-[.14em] md:flex" aria-label="Valmynd">
          {(
            [
              ['#k11', 'K11'],
              ['#afangastadir', 'ÁFANGASTAÐIR'],
              ['#verdskra', 'VERÐSKRÁ'],
              ['#velarnar', 'VÉLARNAR'],
              ['#stofan', 'STOFAN'],
            ] as const
          ).map(([href, label]) => (
            <a key={href} href={href} className="no-underline transition-colors duration-300 hover:text-[#F4EFE6]" style={{ color: CHAMP_DIM, fontFamily: MONO }}>
              {label}
            </a>
          ))}
        </nav>
        <a href={NOONA} target="_blank" rel="noreferrer" className="sv-cta" style={cta({ fontSize: 15, padding: '11px 24px' })}>
          Bóka tíma
        </a>
      </header>

      {/* ── bed peek follower ─────────────────────────────────────────── */}
      <div ref={peekEl} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[48]" style={{ width: 'min(300px, 34vw)', aspectRatio: '4 / 3', transform: 'translate3d(-500px,-500px,0)', willChange: 'transform' }}>
        <div className="sv-peek-card absolute inset-0 overflow-clip rounded-[14px]" style={{ border: `1px solid ${HAIR}`, boxShadow: '0 30px 70px rgba(0,0,0,.7)', background: OBSIDIAN2, opacity: peek ? 1 : 0, transform: peek ? 'scale(1)' : 'scale(.9)' }}>
          {BEDS.map((b, i) => (
            <img key={b.id} src={`${A}${b.image}`} alt="" className="sv-peek-img absolute inset-0 h-full w-full object-cover" style={{ opacity: peek === i + 1 ? 1 : 0 }} />
          ))}
        </div>
      </div>

      {/* ── sticky booking bar ────────────────────────────────────────── */}
      <div
        className="fixed right-0 left-0 z-[55] mx-auto flex gap-2 rounded-full p-2"
        style={{
          bottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
          width: 'min(calc(100% - 24px), 400px)',
          background: 'rgba(12,11,14,.85)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${HAIR}`,
          boxShadow: '0 18px 50px rgba(0,0,0,.6)',
          transform: barHidden ? 'translateY(140%)' : 'none',
          transition: `transform .5s ${EASE}`,
        }}
      >
        <a href={PHONE_HREF} aria-label={`Hringja í ${PHONE_DISPLAY}`} className="grid h-[50px] w-[50px] flex-none place-items-center rounded-full no-underline" style={{ background: 'rgba(244,239,230,.08)', border: '1px solid rgba(244,239,230,.14)', color: TXT }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </a>
        <a href={NOONA} target="_blank" rel="noreferrer" className="sv-cta flex-1 text-center" style={cta({ fontSize: 17, padding: '14px 20px' })}>
          Bóka tíma
        </a>
      </div>

      <main id="top">
        {/* ══ HERO — the machine wakes ═══════════════════════════════════ */}
        <section id="k11" className="relative flex min-h-[100svh] items-end overflow-clip" style={{ background: OBSIDIAN }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="sv-stage absolute" style={{ top: '50%', left: '62%', transform: 'translate(-62%, -50%)', height: '100%', aspectRatio: '2688 / 1520', minWidth: '100%' }}>
              <img src={`${A}k11-off.webp`} alt="KBL K11 Air Loft ljósabekkur í dimmum sal" className="absolute inset-0 h-full w-full" fetchPriority="high" />
              <K11Relight on={lit} />
            </div>
            {/* legibility scrims */}
            <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,9,12,.9) 0%, rgba(10,9,12,.55) 34%, rgba(10,9,12,.08) 62%, transparent 100%)' }} />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5" style={{ background: 'linear-gradient(180deg, transparent, rgba(10,9,12,.88))' }} />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 pt-28 pb-24 md:px-9 md:pb-28">
            <p className="sv-rise m-0 text-[12px] font-medium tracking-[.3em]" style={{ color: CHAMP_DIM, fontFamily: MONO, animationDelay: '.15s' }}>
              SÓLBAÐSSTOFA Í HAFNARFIRÐI · SÍÐAN {FOUNDED}
            </p>
            <h1 className="sv-rise mt-5 mb-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(52px, 9.5vw, 128px)', lineHeight: 0.98, letterSpacing: '.005em', color: TXT, maxWidth: '13ch', animationDelay: '.3s' }}>
              Næsta kynslóð sólbaða.
            </h1>
            <p className="sv-rise mt-6 mb-0 max-w-[46ch] text-[17px] leading-[1.6] md:text-[19px]" style={{ color: BODY_T, animationDelay: '.5s' }}>
              K11 Air Loft er kominn í Fjarðargötu 17. ALL LED bekkur með SunFinity ljósatækni, Loft Infinity speglum og kælingu fyrir líkama og andlit.
            </p>
            <div className="sv-rise mt-9 flex flex-wrap items-center gap-3.5" style={{ animationDelay: '.68s' }}>
              <a href={NOONA} target="_blank" rel="noreferrer" className="sv-cta" style={cta({ fontSize: 17, padding: '18px 40px', boxShadow: '0 16px 44px rgba(194,24,95,.4)' })}>
                Bóka tíma
              </a>
              <a href="#verdskra" className="sv-ghost rounded-full font-semibold no-underline" style={{ color: TXT, fontSize: 16, padding: '17px 28px', border: '1px solid rgba(244,239,230,.26)' }}>
                Sjá verðskrá
              </a>
            </div>
            <p className="sv-rise mt-7 mb-0 text-[13px]" style={{ color: CHAMP_DIM, fontFamily: MONO, animationDelay: '.8s' }}>
              MORGUNVERÐ ALLA DAGA FYRIR KL. 14 · FRÁ 2.190 KR.
            </p>
          </div>

          {/* the machine's own power switch */}
          <div className="sv-rise absolute right-4 bottom-24 z-10 md:right-9 md:bottom-10" style={{ animationDelay: '1s' }}>
            <button
              type="button"
              aria-pressed={lit}
              onClick={() => setLit(!lit)}
              className="sv-power flex cursor-pointer items-center gap-3 rounded-full border py-2 pr-2 pl-4"
              style={{ background: 'rgba(12,11,14,.72)', borderColor: lit ? 'rgba(211,199,178,.4)' : HAIR, backdropFilter: 'blur(10px)' }}
            >
              <span className="text-[11px] tracking-[.22em]" style={{ color: lit ? CHAMPAGNE : CHAMP_DIM, fontFamily: MONO }}>
                {lit ? 'LJÓSIN Á' : 'LJÓSIN AF'}
              </span>
              <span aria-hidden="true" className="relative inline-block h-6 w-11 rounded-full" style={{ background: lit ? 'rgba(232,53,126,.28)' : 'rgba(244,239,230,.1)', border: '1px solid rgba(244,239,230,.18)' }}>
                <span
                  className="sv-knob absolute top-[2px] left-[2px] h-[18px] w-[18px] rounded-full"
                  style={{
                    transform: lit ? 'translateX(20px)' : 'none',
                    background: lit ? MAGENTA : '#6E6659',
                    boxShadow: lit ? '0 0 12px 2px rgba(232,53,126,.65)' : 'none',
                  }}
                />
              </span>
            </button>
          </div>
        </section>

        {/* ══ SPEC TICKER ════════════════════════════════════════════════ */}
        <section aria-hidden="true" className="overflow-hidden border-y py-4" style={{ borderColor: HAIR, background: OBSIDIAN2 }}>
          <div className="sv-ticker flex w-max gap-12 whitespace-nowrap">
            {[0, 1].map((k) => (
              <div key={k} className="flex gap-12 text-[13px] tracking-[.26em]" style={{ color: CHAMP_DIM, fontFamily: MONO }}>
                <span>ALL LED</span>
                <span style={{ color: CHAMPAGNE }}>+26% UVA Í ANDLITI</span>
                <span>+33% UVB Á HÁLSSVÆÐI</span>
                <span style={{ color: CHAMPAGNE }}>SUNFINITY LJÓSATÆKNI</span>
                <span>SUNCONTROL SÉRSNIÐIN BRÚNKA</span>
                <span style={{ color: CHAMPAGNE }}>LOFT INFINITY SPEGLAR</span>
                <span>KÆLING FYRIR LÍKAMA OG ANDLIT</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ ÁFANGASTAÐIR — pick your sky ═══════════════════════════════ */}
        <section id="afangastadir" className="relative scroll-mt-20" style={{ padding: 'clamp(90px, 12vw, 150px) 0' }}>
          <div className="mx-auto max-w-[1180px] px-5 md:px-9">
            <Reveal>
              <p className="m-0 mb-4 text-[12px] tracking-[.3em]" style={{ color: MAGENTA, fontFamily: MONO }}>
                SUNCONTROL · ÞÚ VELUR ÁFANGASTAÐ
              </p>
            </Reveal>
            <Reveal>
              <h2 className="m-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(40px, 6.5vw, 84px)', lineHeight: 1.02, color: TXT }}>
                Þrír himnar, einn bekkur.
              </h2>
            </Reveal>

            <Reveal className="mt-10">
              <div className="relative overflow-clip rounded-[22px]" style={{ border: `1px solid ${HAIR}`, aspectRatio: '16 / 10', background: OBSIDIAN2, maxHeight: '30rem', width: '100%' }}>
                {DESTINATIONS.map((x, i) => (
                  <div key={x.id} className="sv-sky absolute inset-0" style={{ background: SKY[x.id], opacity: dest === i ? 1 : 0 }} />
                ))}
                <div aria-hidden="true" className="sv-sunarc absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: SUN_Y[d.id], width: 64, height: 64, background: 'radial-gradient(circle at 38% 32%, #FFF3D2, #FFC46B 55%, #F08556)', boxShadow: '0 0 60px 18px rgba(255,196,107,.5), 0 0 140px 60px rgba(240,133,86,.25)' }} />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5" style={{ background: 'linear-gradient(180deg, transparent, rgba(10,9,12,.78))' }} />

                <div className="absolute top-4 right-5 left-5 flex items-start justify-between gap-3">
                  <p className="m-0" style={{ fontFamily: DISPLAY_MED, fontSize: 'clamp(19px, 2.4vw, 28px)', color: '#FFF9EF', textShadow: '0 2px 24px rgba(0,0,0,.5)' }}>
                    {d.title}
                  </p>
                  <p className="m-0 text-[18px] md:text-[24px]" style={{ fontFamily: MONO, color: '#FFF9EF', textShadow: '0 2px 24px rgba(0,0,0,.5)' }}>
                    {d.lat}
                  </p>
                </div>

                <div className="absolute right-4 bottom-4 left-4 md:right-6 md:bottom-5 md:left-6">
                  <div className="inline-flex flex-wrap gap-1.5 rounded-full p-1.5" style={{ background: 'rgba(10,9,12,.55)', border: '1px solid rgba(244,239,230,.16)', backdropFilter: 'blur(10px)' }}>
                    {DESTINATIONS.map((x, i) => (
                      <button
                        key={x.id}
                        type="button"
                        aria-pressed={dest === i}
                        onClick={() => setDest(i)}
                        className="cursor-pointer rounded-full border-none px-3.5 py-2 text-[12px] font-bold tracking-[.06em] transition-all duration-300"
                        style={{
                          background: dest === i ? 'rgba(244,239,230,.14)' : 'transparent',
                          color: dest === i ? '#FFF9EF' : 'rgba(244,239,230,.55)',
                          boxShadow: dest === i ? 'inset 0 0 0 1px rgba(211,199,178,.45)' : 'none',
                          fontFamily: MONO,
                        }}
                      >
                        {x.id === 'capri' ? 'CAPRI' : x.id === 'hawaii' ? 'HAWAII' : 'HAMPTONS'}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2.5 mb-0 flex flex-wrap items-center gap-2.5 text-[13px]" style={{ color: 'rgba(244,239,230,.85)', textShadow: '0 1px 14px rgba(0,0,0,.6)' }}>
                    <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-[.06em]" style={{ borderColor: 'rgba(232,53,126,.55)', color: '#FF8FBC' }}>
                      {d.chip}
                    </span>
                    {d.body}
                  </p>
                </div>
              </div>
              <p className="mt-3 mb-0 text-[13px]" style={{ color: CHAMP_DIM }}>
                Áfangastaðirnir eru innbyggð prógrömm í K11 Air Loft. Bókanlegur á Noona.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══ STJÓRNBORÐIÐ — verðskrá as the machine's control panel ═════ */}
        <section id="verdskra" className="scroll-mt-20" style={{ padding: 'clamp(90px, 12vw, 150px) 0', background: OBSIDIAN2 }}>
          <div className="mx-auto max-w-[1180px] px-5 md:px-9">
            <Reveal>
              <p className="m-0 mb-4 text-[12px] tracking-[.3em]" style={{ color: MAGENTA, fontFamily: MONO }}>
                VERÐSKRÁ · MORGUNN 10 TIL 14 KOSTAR MINNA
              </p>
            </Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <h2 className="m-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(40px, 6.5vw, 84px)', lineHeight: 1.02, color: TXT }}>
                  Mættu fyrr.
                  <br />
                  Sparaðu meira.
                </h2>
              </Reveal>
              <Reveal delay={80} className="text-right">
                <p className="m-0 text-sm leading-[1.6]" style={{ color: CHAMP_DIM }}>
                  Morgunverð gildir alla daga frá kl. 10 til 14.
                </p>
                <p className="mt-0.5 mb-0 text-sm leading-[1.6]" style={{ color: CHAMP_DIM }}>
                  Öryrkjar fá 10% afslátt.
                </p>
              </Reveal>
            </div>

            {/* the control panel */}
            <Reveal className="mt-10">
              <div className="rounded-[26px] p-2" style={{ background: 'rgba(211,199,178,.06)', border: `1px solid ${HAIR}` }}>
                <div className="rounded-[calc(26px-8px)] p-6 md:p-9" style={{ background: OBSIDIAN, boxShadow: 'inset 0 1px 0 rgba(244,239,230,.06)' }}>
                  {/* rocker switch */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative inline-flex rounded-full p-[5px]" style={{ background: 'rgba(211,199,178,.08)', border: `1px solid ${HAIR}`, minWidth: 'min(100%, 400px)' }}>
                      <span aria-hidden="true" className="absolute rounded-full" style={{ top: 5, bottom: 5, left: 5, width: 'calc(50% - 10px)', background: 'rgba(244,239,230,.12)', border: '1px solid rgba(211,199,178,.45)', boxShadow: `0 0 24px rgba(179,156,255,.25)`, transform: morgun ? 'translateX(0)' : 'translateX(calc(100% + 10px))', transition: `transform .45s ${EASE}` }} />
                      {(
                        [
                          ['morgun', 'Morgunverð'],
                          ['dag', 'Dagverð'],
                        ] as const
                      ).map(([id, label]) => (
                        <button key={id} type="button" aria-pressed={slot === id} onClick={() => setSlot(id)} className="relative z-[1] inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-none bg-transparent font-bold" style={{ fontFamily: HANKEN, fontSize: 15, padding: '13px 14px', color: slot === id ? TXT : CHAMP_DIM, transition: 'color .3s ease' }}>
                          {label}
                          {nowSlot === id ? <span className="h-[7px] w-[7px] rounded-full" style={{ background: MAGENTA, boxShadow: `0 0 10px 2px rgba(232,53,126,.6)`, animation: 'svBadge 6s steps(1,end) infinite' }} title="gildir núna" /> : null}
                        </button>
                      ))}
                    </div>
                    <p className="m-0 text-[13px]" style={{ color: CHAMP_DIM, fontFamily: MONO }}>
                      {nowSlot === 'morgun' ? 'MORGUNVERÐ GILDIR NÚNA' : 'DAGVERÐ GILDIR NÚNA'}
                    </p>
                  </div>

                  {/* ledger rows */}
                  <div className="mt-8">
                    {(['stakir', 'kort'] as const).map((group) => (
                      <div key={group}>
                        <p className="text-[11px] font-semibold tracking-[.26em]" style={{ margin: group === 'kort' ? '26px 0 4px' : '0 0 4px', color: MAGENTA, fontFamily: MONO }}>
                          {group === 'stakir' ? 'STAKIR TÍMAR' : 'KORT'}
                        </p>
                        {PRICES.filter((p) => p.group === group).map((p, i, arr) => {
                          const gi = PRICES.findIndex((x) => x.id === p.id)
                          return (
                            <div key={p.id} className="grid items-center" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', gap: '8px 18px', padding: '17px 4px', borderTop: `1px solid ${HAIR}`, borderBottom: group === 'kort' && i === arr.length - 1 ? `1px solid ${HAIR}` : undefined }}>
                              <div>
                                <p className="m-0 font-bold" style={{ fontSize: 'clamp(17px, 2.3vw, 20px)', color: TXT }}>
                                  {p.name}
                                  {p.minutes ? (
                                    <span className="text-sm font-medium" style={{ color: CHAMP_DIM }}>
                                      {' '}
                                      · {p.minutes}
                                    </span>
                                  ) : null}
                                </p>
                                <p className="mt-1 mb-0 text-[13px]" style={{ color: CHAMP_DIM }}>
                                  Morgunverð {p.morning} · Dagverð {p.day}
                                  <span className="ml-2.5 font-bold" style={{ color: MAGENTA, opacity: morgun ? 1 : 0.25, transition: 'opacity .4s ease' }}>
                                    þú sparar {p.saves}
                                  </span>
                                </p>
                              </div>
                              <div className="overflow-hidden text-right" style={{ height: '1.2em', fontSize: 'clamp(26px, 4.4vw, 40px)', fontFamily: MONO, fontWeight: 500, color: CHAMPAGNE }}>
                                <div className="sv-roll" style={{ transform: morgun ? 'translateY(0)' : 'translateY(-1.2em)', transitionDelay: `${gi * 0.06}s` }}>
                                  <span className="block" style={{ height: '1.2em', lineHeight: '1.2em' }}>
                                    {p.morning}
                                  </span>
                                  <span className="block" style={{ height: '1.2em', lineHeight: '1.2em' }}>
                                    {p.day}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-5">
                    <p className="m-0 text-sm" style={{ color: CHAMP_DIM }}>
                      K11 Air Loft er bókanlegur á Noona. Bókun fer fram á Noona.
                    </p>
                    <a href={NOONA} target="_blank" rel="noreferrer" className="sv-cta" style={cta({ fontSize: 16, padding: '15px 34px' })}>
                      Bóka tíma
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ VÉLARNAR — the line-up ═════════════════════════════════════ */}
        <section id="velarnar" className="scroll-mt-20" style={{ padding: 'clamp(90px, 12vw, 150px) 0' }}>
          <div className="mx-auto max-w-[1180px] px-5 md:px-9">
            <Reveal>
              <p className="m-0 mb-4 text-[12px] tracking-[.3em]" style={{ color: MAGENTA, fontFamily: MONO }}>
                VÉLARNAR OKKAR
              </p>
            </Reveal>
            <Reveal>
              <h2 className="m-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(40px, 6.5vw, 84px)', lineHeight: 1.02, color: TXT }}>
                Veldu vél sem hentar þér.
              </h2>
            </Reveal>
            <div className="mt-10">
              {BEDS.map((b, i) => (
                <Reveal key={b.id}>
                  <div className="sv-row grid items-center gap-4" onMouseEnter={() => setPeek(i + 1)} onMouseLeave={() => setPeek(0)} style={{ gridTemplateColumns: 'clamp(34px, 5vw, 56px) minmax(0,1fr) auto', padding: 'clamp(20px, 3.4vw, 30px) 4px', borderTop: `1px solid ${HAIR}`, borderBottom: i === BEDS.length - 1 ? `1px solid ${HAIR}` : undefined }}>
                    <p className="m-0 text-sm" style={{ color: CHAMP_DIM, fontFamily: MONO }}>
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="m-0" style={{ fontFamily: DISPLAY_MED, fontSize: 'clamp(24px, 4.4vw, 46px)', color: TXT, lineHeight: 1.06 }}>
                      {b.name}
                    </p>
                    {b.maker ? (
                      <p className="m-0 text-sm" style={{ color: CHAMP_DIM }}>
                        {b.maker}
                      </p>
                    ) : (
                      <a href="#k11" className="inline-flex items-center gap-[7px] rounded-full text-[13px] font-bold no-underline transition-colors duration-300 hover:bg-[rgba(232,53,126,.12)]" style={{ color: MAGENTA, border: '1px solid rgba(232,53,126,.4)', padding: '9px 16px' }}>
                        stjarnan okkar<span aria-hidden="true">↑</span>
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <p className="mt-5 mb-0 text-[13px]" style={{ color: CHAMP_DIM }}>
                Renndu músinni yfir bekk til að sjá hann.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══ STOFAN + finale + footer ═══════════════════════════════════ */}
        <section id="stofan" className="relative scroll-mt-20 overflow-clip" style={{ background: OBSIDIAN2, padding: 'clamp(90px, 12vw, 150px) 0 0' }}>
          <span aria-hidden="true" className="sv-spin pointer-events-none absolute" style={{ right: '-8vw', top: '4%', width: '34vw', height: '34vw', animation: 'svSpin 100s linear infinite' }}>
            <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
              <g fill="rgba(232,53,126,.07)">
                {[0, 90, 180, 270].map((r) => (
                  <rect key={r} x="11" y="0" width="2" height="9" rx="1" transform={`rotate(${r} 12 12)`} />
                ))}
                {[45, 135, 225, 315].map((r) => (
                  <rect key={r} x="11" y="3" width="2" height="6" rx="1" transform={`rotate(${r} 12 12)`} />
                ))}
              </g>
            </svg>
          </span>
          <div className="relative mx-auto max-w-[1180px] px-5 md:px-9">
            <Reveal>
              <p className="m-0 mb-4 text-[12px] tracking-[.3em]" style={{ color: MAGENTA, fontFamily: MONO }}>
                STOFAN
              </p>
            </Reveal>
            <Reveal>
              <h2 className="m-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(44px, 7.5vw, 96px)', lineHeight: 1, color: TXT, textWrap: 'balance' }}>
                Sjáumst í ljósinu.
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-4 mb-0 text-[15px]" style={{ color: CHAMP_DIM }}>
                Sólbaðsstofa í Hafnarfirði síðan {FOUNDED}.
              </p>
            </Reveal>
            <div className="mt-12 flex flex-wrap" style={{ gap: 'clamp(32px, 6vw, 72px) clamp(40px, 8vw, 96px)' }}>
              <Reveal>
                <p className="m-0 mb-2.5 text-[11px] tracking-[.26em]" style={{ color: MAGENTA, fontFamily: MONO }}>
                  HEIMILISFANG
                </p>
                <p className="m-0 text-[19px] leading-[1.5] font-bold" style={{ color: TXT }}>
                  {ADDRESS}
                  <br />
                  {TOWN}
                </p>
                <a href={MAPS_HREF} target="_blank" rel="noreferrer" className="mt-3 inline-block pb-0.5 text-sm font-semibold no-underline" style={{ color: CHAMPAGNE, borderBottom: `1px solid ${HAIR}` }}>
                  Opna í kortum ↗
                </a>
              </Reveal>
              <Reveal delay={70}>
                <p className="m-0 mb-2.5 text-[11px] tracking-[.26em]" style={{ color: MAGENTA, fontFamily: MONO }}>
                  OPNUNARTÍMI
                </p>
                <p className="m-0 text-[19px] leading-[1.5] font-bold" style={{ color: TXT }}>
                  Alla daga
                  <br />
                  10:00 til 22:00
                </p>
                <p className="mt-3 mb-0 text-sm" style={{ color: CHAMP_DIM }}>
                  Morgunverð til kl. 14
                </p>
              </Reveal>
              <Reveal delay={140}>
                <p className="m-0 mb-2.5 text-[11px] tracking-[.26em]" style={{ color: MAGENTA, fontFamily: MONO }}>
                  SAMBAND
                </p>
                <p className="m-0 text-[19px] leading-[1.5] font-bold">
                  <a href={PHONE_HREF} className="no-underline" style={{ color: TXT }}>
                    {PHONE_DISPLAY}
                  </a>
                </p>
                <p className="mt-3.5 mb-0 flex gap-4">
                  <a href={FACEBOOK} target="_blank" rel="noreferrer" className="pb-0.5 text-sm font-semibold no-underline" style={{ color: CHAMPAGNE, borderBottom: `1px solid ${HAIR}` }}>
                    Facebook ↗
                  </a>
                  <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="pb-0.5 text-sm font-semibold no-underline" style={{ color: CHAMPAGNE, borderBottom: `1px solid ${HAIR}` }}>
                    Instagram ↗
                  </a>
                </p>
              </Reveal>
            </div>

            <div ref={finaleEl} className="text-center" style={{ marginTop: 'clamp(64px, 9vw, 110px)' }}>
              <Reveal>
                <a href={NOONA} target="_blank" rel="noreferrer" className="sv-cta inline-block" style={cta({ fontSize: 'clamp(18px, 2.4vw, 22px)', fontWeight: 800, padding: '22px 56px', boxShadow: '0 18px 60px rgba(194,24,95,.45)' })}>
                  Bóka tíma
                </a>
                <p className="mt-4 mb-0 text-sm" style={{ color: CHAMP_DIM }}>
                  Bókun fer fram á Noona
                </p>
              </Reveal>
            </div>

            <footer className="flex flex-wrap items-center gap-[18px]" style={{ marginTop: 'clamp(56px, 8vw, 90px)', padding: '26px 0 calc(88px + env(safe-area-inset-bottom, 0px))', borderTop: `1px solid ${HAIR}` }}>
              <img src={`${A}logo.png`} alt="Stjörnusól" className="h-5 w-auto" />
              <p className="m-0 text-[13px] leading-[1.6]" style={{ color: CHAMP_DIM }}>
                © 2026 Stjörnusól · {ADDRESS}, {TOWN} ·{' '}
                <a href={PHONE_HREF} className="no-underline" style={{ color: CHAMPAGNE }}>
                  {PHONE_DISPLAY}
                </a>
              </p>
            </footer>
          </div>
        </section>
      </main>

      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
