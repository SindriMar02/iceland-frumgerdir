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
const DISPLAY = "'Fraunces-SemiBold', Georgia, serif"
const DISPLAY_MED = "'Fraunces-Regular', Georgia, serif"
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

/* Peau d'Or film strip — the salon's own promo photos from solbadsstofa.is */
const KREM = ['krem-01.webp', 'krem-02.webp', 'krem-03.webp', 'krem-04.webp', 'krem-05.webp', 'krem-06.webp', 'krem-07.webp']
const KREM_ALT = [
  'Í ljósabekknum hjá Stjörnusól',
  'Peau d’Or krem í sólbaði',
  'Peau d’Or krem, gyllt túpa',
  'Peau d’Or krem fyrir sólbað',
  'Peau d’Or Pure Men krem',
  'Peau d’Or Ibiza Black krem',
  'Peau d’Or Satin Noir krem',
]

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

  const cta = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: MAGENTA_DEEP,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 700,
    borderRadius: 3,
    fontFamily: HANKEN,
    ...extra,
  })

  return (
    <div className="sv-root min-h-screen antialiased" style={{ background: OBSIDIAN, color: BODY_T, fontFamily: HANKEN, overflowX: 'clip' }}>
      <link rel="stylesheet" href={`${BASE}fonts/fraunces/css/fraunces.css`} />
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
        .sv-nav{position:relative}
        .sv-nav::after{content:"";position:absolute;left:0;right:0;bottom:-7px;height:2px;border-radius:1px;background:linear-gradient(90deg,${CHAMPAGNE},${MAGENTA});transform:scaleX(0);transform-origin:100% 50%;transition:transform .35s ${EASE}}
        .sv-nav:hover::after,.sv-nav:focus-visible::after{transform:scaleX(1);transform-origin:0 50%}
        .sv-cta{transition:transform .3s ${EASE}, box-shadow .3s ease, filter .25s ease}
        .sv-cta:hover{transform:translateY(-3px);filter:brightness(1.1)}
        .sv-cta:active{transform:scale(.97)}
        @keyframes svTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .sv-ticker{animation:svTicker 36s linear infinite}
        .sv-row{transition:transform .35s ${EASE}, background .35s ease}
        .sv-row:hover{transform:translateX(8px)}
        @keyframes svFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        .sv-fade{animation:svFade .35s ease both}
        .sv-roll{transition:transform .55s cubic-bezier(.6,.1,.2,1)}
        .sv-peek-card{transition:opacity .28s ease, transform .32s ${EASE}}
        .sv-peek-img{transition:opacity .25s ease}
        .sv-filmwrap{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}
        @keyframes svFilm{from{transform:translateX(0)}to{transform:translateX(calc(-50% - 8px))}}
        .sv-film{animation:svFilm 60s linear infinite}
        .sv-film:hover{animation-play-state:paused}
        .sv-frame img{filter:saturate(.82) brightness(.94) contrast(1.03);transition:filter .5s ease,transform .6s ${EASE}}
        .sv-frame:hover img{filter:none;transform:scale(1.045)}
        @keyframes svBadge{0%,86%{opacity:1}88%{opacity:.4}90%{opacity:1}94%{opacity:.7}96%,100%{opacity:1}}
        @media (hover: none), (pointer: coarse){
          .sv-peek{display:none}
          .sv-hint{display:none}
          .sv-row:hover{transform:none}
          .sv-filmwrap{overflow-x:auto;scrollbar-width:none;-webkit-mask-image:none;mask-image:none}
          .sv-filmwrap::-webkit-scrollbar{display:none}
          .sv-film{animation:none;padding:0 20px}
          .sv-film-dup{display:none}
          .sv-frame img{filter:none}
        }
        @media (prefers-reduced-motion: reduce){
          .sv-panel,.sv-blink{animation:none !important;opacity:0 !important}
          .sv-onfull{animation:none !important;opacity:1 !important}
          .sv-r{opacity:1;transform:none;transition:none}
          .sv-rise{animation:none}
          .sv-ticker{animation:none}
          .sv-fade{animation:none}
          .sv-roll{transition:none !important}
          .sv-nav::after{transition:none}
          .sv-film{animation:none}
          .sv-film-dup{display:none}
          .sv-filmwrap{overflow-x:auto;-webkit-mask-image:none;mask-image:none}
          .sv-frame img{filter:none;transition:none}
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
              ['#kremin', 'KREMIN'],
              ['#stofan', 'STOFAN'],
            ] as const
          ).map(([href, label]) => (
            <a key={href} href={href} className="sv-nav no-underline transition-colors duration-300 hover:text-[#F4EFE6]" style={{ color: CHAMP_DIM, fontFamily: MONO }}>
              {label}
            </a>
          ))}
        </nav>
        <a href={NOONA} target="_blank" rel="noreferrer" className="sv-cta" style={cta({ fontSize: 15, padding: '11px 24px' })}>
          Bóka tíma
        </a>
      </header>

      {/* ── bed peek follower ─────────────────────────────────────────── */}
      <div ref={peekEl} aria-hidden="true" className="sv-peek pointer-events-none fixed top-0 left-0 z-[48]" style={{ width: 'min(300px, 34vw)', aspectRatio: '4 / 3', transform: 'translate3d(-500px,-500px,0)', willChange: 'transform' }}>
        <div className="sv-peek-card absolute inset-0 overflow-clip rounded-[14px]" style={{ border: `1px solid ${HAIR}`, boxShadow: '0 30px 70px rgba(0,0,0,.7)', background: OBSIDIAN2, opacity: peek ? 1 : 0, transform: peek ? 'scale(1)' : 'scale(.9)' }}>
          {BEDS.map((b, i) => (
            <img key={b.id} src={`${A}${b.image}`} alt="" className="sv-peek-img absolute inset-0 h-full w-full object-cover" style={{ opacity: peek === i + 1 ? 1 : 0 }} />
          ))}
        </div>
      </div>

      {/* ── sticky booking bar ────────────────────────────────────────── */}
      <div
        className="fixed right-0 left-0 z-[55] mx-auto flex gap-2 rounded-[10px] p-2 md:hidden"
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
        <a href={PHONE_HREF} aria-label={`Hringja í ${PHONE_DISPLAY}`} className="grid h-[50px] w-[50px] flex-none place-items-center rounded-[7px] no-underline" style={{ background: 'rgba(244,239,230,.08)', border: '1px solid rgba(244,239,230,.14)', color: TXT }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </a>
        <a href={NOONA} target="_blank" rel="noreferrer" className="sv-cta flex-1 text-center" style={cta({ fontSize: 17, padding: '14px 20px' })}>
          Bóka tíma
        </a>
      </div>

      <main id="top">
        {/* ══ HERO — copy left, the machine floating in the dark right ═══ */}
        <section id="k11" className="relative flex min-h-[100svh] items-center overflow-clip" style={{ background: OBSIDIAN }}>
          <div className="mx-auto grid w-full max-w-[1400px] items-center gap-x-10 gap-y-8 px-5 pt-24 pb-14 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:px-9 md:pt-28 md:pb-16">
            {/* left: clean copy, off the photo */}
            <div>
              <p className="sv-rise m-0 text-[12px] font-medium tracking-[.3em]" style={{ color: CHAMP_DIM, fontFamily: MONO, animationDelay: '.15s' }}>
                SÓLBAÐSSTOFA Í HAFNARFIRÐI · SÍÐAN {FOUNDED}
              </p>
              <h1 className="sv-rise mt-5 mb-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(46px, 6.4vw, 92px)', lineHeight: 1, letterSpacing: '.005em', color: TXT, maxWidth: '12ch', animationDelay: '.3s' }}>
                Næsta kynslóð sólbaða.
              </h1>
              <p className="sv-rise mt-6 mb-0 max-w-[44ch] text-[16px] leading-[1.65] md:text-[18px]" style={{ color: BODY_T, animationDelay: '.5s' }}>
                K11 Air Loft er kominn í Fjarðargötu 17. ALL LED bekkur með SunFinity ljósatækni, Loft Infinity speglum og kælingu fyrir líkama og andlit.
              </p>
              <div className="sv-rise mt-9 flex flex-wrap items-center gap-x-7 gap-y-4" style={{ animationDelay: '.68s' }}>
                <a href={NOONA} target="_blank" rel="noreferrer" className="sv-cta" style={cta({ fontSize: 16, padding: '17px 36px', boxShadow: '0 16px 44px rgba(194,24,95,.35)' })}>
                  Bóka tíma
                </a>
                <a href="#verdskra" className="pb-1 text-[15px] font-semibold no-underline" style={{ color: TXT, borderBottom: '1px solid rgba(244,239,230,.4)' }}>
                  Sjá verðskrá
                </a>
              </div>
              <p className="sv-rise mt-8 mb-0 text-[13px]" style={{ color: CHAMP_DIM, fontFamily: MONO, animationDelay: '.8s' }}>
                MORGUNVERÐ ALLA DAGA FYRIR KL. 14 · FRÁ 2.190 KR.
              </p>
            </div>

            {/* right: the machine, cropped in and dissolving into the page */}
            <div className="sv-rise" style={{ animationDelay: '.45s' }}>
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: '4 / 3.1',
                  WebkitMaskImage: 'radial-gradient(52% 52% at 50% 50%, #000 52%, transparent 94%)',
                  maskImage: 'radial-gradient(52% 52% at 50% 50%, #000 52%, transparent 94%)',
                }}
              >
                <div className="sv-stage absolute top-1/2 left-[-19%] w-[138%] -translate-y-1/2" style={{ aspectRatio: '2688 / 1520' }}>
                  <img src={`${A}k11-off.webp`} alt="KBL K11 Air Loft ljósabekkur í dimmum sal" className="absolute inset-0 h-full w-full" {...({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)} />
                  <K11Relight on={lit} />
                </div>
              </div>

              {/* caption + the machine's own power switch */}
              <div className="mt-1 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 md:px-2">
                <p className="m-0 text-[12px] tracking-[.24em]" style={{ color: CHAMP_DIM, fontFamily: MONO }}>
                  K11 AIR LOFT · FJARÐARGATA 17
                </p>
                <button
                  type="button"
                  aria-pressed={lit}
                  onClick={() => setLit(!lit)}
                  className="sv-power flex cursor-pointer items-center gap-3 rounded-[4px] border py-2 pr-2 pl-3.5"
                  style={{ background: 'rgba(17,16,21,.85)', borderColor: lit ? 'rgba(211,199,178,.4)' : HAIR }}
                >
                  <span className="text-[11px] tracking-[.22em]" style={{ color: lit ? CHAMPAGNE : CHAMP_DIM, fontFamily: MONO }}>
                    {lit ? 'LJÓSIN Á' : 'LJÓSIN AF'}
                  </span>
                  <span aria-hidden="true" className="relative inline-block h-6 w-11 rounded-[3px]" style={{ background: lit ? 'rgba(232,53,126,.28)' : 'rgba(244,239,230,.1)', border: '1px solid rgba(244,239,230,.18)' }}>
                    <span
                      className="sv-knob absolute top-[2px] left-[2px] h-[18px] w-[18px] rounded-[2px]"
                      style={{
                        transform: lit ? 'translateX(20px)' : 'none',
                        background: lit ? MAGENTA : '#6E6659',
                        boxShadow: lit ? '0 0 12px 2px rgba(232,53,126,.65)' : 'none',
                      }}
                    />
                  </span>
                </button>
              </div>
            </div>
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

        {/* ══ SUNCONTROL — compact console strip ═════════════════════════ */}
        <section id="afangastadir" className="scroll-mt-20" style={{ padding: 'clamp(52px, 7vw, 84px) 0' }}>
          <div className="mx-auto max-w-[1180px] px-5 md:px-9">
            <Reveal>
              <div className="rounded-[8px] border" style={{ borderColor: HAIR, background: OBSIDIAN2, padding: 'clamp(20px, 3vw, 28px)' }}>
                <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
                  <div>
                    <p className="m-0 text-[11px] tracking-[.28em]" style={{ color: MAGENTA, fontFamily: MONO }}>
                      SUNCONTROL · ÞÚ VELUR ÁFANGASTAÐ
                    </p>
                    <p className="mt-1.5 mb-0" style={{ fontFamily: DISPLAY_MED, fontSize: 'clamp(20px, 2.6vw, 26px)', color: TXT }}>
                      Þrjár upplifanir. Einn bekkur.
                    </p>
                  </div>
                  <div className="flex w-full overflow-hidden rounded-[4px] border md:w-auto" style={{ borderColor: HAIR }} role="group" aria-label="SunControl prógrömm">
                    {DESTINATIONS.map((x, i) => {
                      const on = dest === i
                      return (
                        <button
                          key={x.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setDest(i)}
                          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 border-0 px-1 py-3 text-[11px] font-bold tracking-[.1em] md:flex-none md:justify-start md:gap-2.5 md:px-4 md:text-[12px] md:tracking-[.18em]"
                          style={{
                            fontFamily: MONO,
                            color: on ? TXT : CHAMP_DIM,
                            background: on ? 'rgba(244,239,230,.09)' : 'transparent',
                            borderLeft: i > 0 ? `1px solid ${HAIR}` : 'none',
                            transition: 'background .3s ease, color .3s ease',
                          }}
                        >
                          <span aria-hidden="true" className="h-[12px] w-[12px] flex-none rounded-[2px] md:h-[14px] md:w-[14px]" style={{ background: SKY[x.id], boxShadow: on ? 'inset 0 0 0 1px rgba(244,239,230,.5)' : 'inset 0 0 0 1px rgba(244,239,230,.18)' }} />
                          {x.id === 'capri' ? 'CAPRI' : x.id === 'hawaii' ? 'HAWAII' : 'HAMPTONS'}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {(() => {
                  const d = DESTINATIONS[dest]
                  return (
                    <div key={d.id} className="sv-fade mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1.5 border-t pt-4" style={{ borderColor: HAIR }}>
                      <span style={{ fontFamily: DISPLAY_MED, fontSize: 18, color: TXT }}>{d.title}</span>
                      <span className="text-[13px]" style={{ fontFamily: MONO, color: CHAMP_DIM }}>
                        {d.lat}
                      </span>
                      <span className="rounded-[3px] border px-2 py-0.5 text-[11px] font-bold tracking-[.06em]" style={{ borderColor: 'rgba(232,53,126,.5)', color: '#FF8FBC' }}>
                        {d.chip}
                      </span>
                      <span className="text-[14px]" style={{ color: BODY_T }}>
                        {d.body}
                      </span>
                      <span className="text-[12px] md:ml-auto" style={{ color: CHAMP_DIM }}>
                        Innbyggt í K11 Air Loft · Bókanlegt á Noona
                      </span>
                    </div>
                  )
                })()}
              </div>
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
              <Reveal delay={80} className="text-left md:text-right">
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
                <div className="rounded-[calc(26px-8px)] p-4 py-6 md:p-9" style={{ background: OBSIDIAN, boxShadow: 'inset 0 1px 0 rgba(244,239,230,.06)' }}>
                  {/* rocker switch */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative inline-flex rounded-[6px] p-[5px]" style={{ background: 'rgba(211,199,178,.08)', border: `1px solid ${HAIR}`, minWidth: 'min(100%, 400px)' }}>
                      <span aria-hidden="true" className="absolute rounded-[4px]" style={{ top: 5, bottom: 5, left: 5, width: 'calc(50% - 10px)', background: 'rgba(244,239,230,.12)', border: '1px solid rgba(211,199,178,.45)', boxShadow: `0 0 24px rgba(179,156,255,.25)`, transform: morgun ? 'translateX(0)' : 'translateX(calc(100% + 10px))', transition: `transform .45s ${EASE}` }} />
                      {(
                        [
                          ['morgun', 'Morgunverð'],
                          ['dag', 'Dagverð'],
                        ] as const
                      ).map(([id, label]) => (
                        <button key={id} type="button" aria-pressed={slot === id} onClick={() => setSlot(id)} className="relative z-[1] inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[4px] border-none bg-transparent font-bold" style={{ fontFamily: HANKEN, fontSize: 15, padding: '13px 14px', color: slot === id ? TXT : CHAMP_DIM, transition: 'color .3s ease' }}>
                          {label}
                          {nowSlot === id ? <span className="h-[7px] w-[7px] rounded-full" style={{ background: MAGENTA, boxShadow: `0 0 10px 2px rgba(232,53,126,.6)`, animation: 'svBadge 6s steps(1,end) infinite' }} title="gildir núna" /> : null}
                        </button>
                      ))}
                    </div>
                    <p className="m-0 text-[13px]" style={{ color: CHAMP_DIM, fontFamily: MONO }}>
                      {nowSlot === 'morgun' ? 'MORGUNVERÐ GILDIR NÚNA' : 'DAGVERÐ GILDIR NÚNA'}
                    </p>
                  </div>

                  {/* ledger: single tíma column beside kort column on desktop */}
                  <div className="mt-8 grid gap-x-14 md:grid-cols-2">
                    {(['stakir', 'kort'] as const).map((group) => (
                      <div key={group} className={group === 'kort' ? 'mt-7 md:mt-0' : ''}>
                        <p className="m-0 mb-1 text-[11px] font-semibold tracking-[.26em]" style={{ color: MAGENTA, fontFamily: MONO }}>
                          {group === 'stakir' ? 'STAKIR TÍMAR' : 'KORT'}
                        </p>
                        {PRICES.filter((p) => p.group === group).map((p, i, arr) => {
                          const gi = PRICES.findIndex((x) => x.id === p.id)
                          return (
                            <div key={p.id} className="grid grid-cols-1 items-center gap-x-[18px] gap-y-1.5 md:grid-cols-[minmax(0,1fr)_auto]" style={{ padding: '17px 4px', borderTop: `1px solid ${HAIR}`, borderBottom: i === arr.length - 1 ? `1px solid ${HAIR}` : undefined }}>
                              <p className="m-0 font-bold" style={{ fontSize: 'clamp(17px, 2.3vw, 20px)', color: TXT }}>
                                {p.name}
                                {p.minutes ? (
                                  <span className="text-sm font-medium" style={{ color: CHAMP_DIM }}>
                                    {' '}
                                    · {p.minutes}
                                  </span>
                                ) : null}
                              </p>
                              <div className="overflow-hidden text-left md:row-span-2 md:self-center md:text-right" style={{ height: '1.2em', fontSize: 'clamp(30px, 8.6vw, 36px)', fontFamily: MONO, fontWeight: 500, color: CHAMPAGNE }}>
                                <div className="sv-roll" style={{ transform: morgun ? 'translateY(0)' : 'translateY(-1.2em)', transitionDelay: `${gi * 0.06}s` }}>
                                  <span className="block" style={{ height: '1.2em', lineHeight: '1.2em' }}>
                                    {p.morning}
                                  </span>
                                  <span className="block" style={{ height: '1.2em', lineHeight: '1.2em' }}>
                                    {p.day}
                                  </span>
                                </div>
                              </div>
                              <p className="m-0 text-[13px] leading-[1.55]" style={{ color: CHAMP_DIM }}>
                                <span className="whitespace-nowrap">Morgunverð {p.morning}</span> ·{' '}
                                <span className="whitespace-nowrap">Dagverð {p.day}</span>
                                <span className="ml-2.5 inline-block font-bold whitespace-nowrap" style={{ color: MAGENTA, opacity: morgun ? 1 : 0.25, transition: 'opacity .4s ease' }}>
                                  þú sparar {p.saves}
                                </span>
                              </p>
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
                    <a href={NOONA} target="_blank" rel="noreferrer" className="sv-cta w-full text-center md:w-auto" style={cta({ fontSize: 16, padding: '15px 34px' })}>
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
                    <div>
                      <p className="m-0" style={{ fontFamily: DISPLAY_MED, fontSize: 'clamp(24px, 4.4vw, 46px)', color: TXT, lineHeight: 1.06 }}>
                        {b.name}
                      </p>
                      {b.maker ? (
                        <p className="mt-1 mb-0 text-[13px] md:hidden" style={{ color: CHAMP_DIM }}>
                          {b.maker}
                        </p>
                      ) : (
                        <a href="#k11" className="mt-2 inline-flex items-center gap-[7px] rounded-[3px] text-[12px] font-bold no-underline md:hidden" style={{ color: MAGENTA, border: '1px solid rgba(232,53,126,.4)', padding: '6px 12px' }}>
                          stjarnan okkar<span aria-hidden="true">↑</span>
                        </a>
                      )}
                    </div>
                    <img src={`${A}${b.image}`} alt="" aria-hidden="true" loading="lazy" className="w-[86px] rounded-[10px] md:hidden" style={{ border: `1px solid ${HAIR}` }} />
                    {b.maker ? (
                      <p className="m-0 hidden text-sm md:block" style={{ color: CHAMP_DIM }}>
                        {b.maker}
                      </p>
                    ) : (
                      <a href="#k11" className="hidden items-center gap-[7px] rounded-[3px] text-[13px] font-bold no-underline transition-colors duration-300 hover:bg-[rgba(232,53,126,.12)] md:inline-flex" style={{ color: MAGENTA, border: '1px solid rgba(232,53,126,.4)', padding: '9px 16px' }}>
                        stjarnan okkar<span aria-hidden="true">↑</span>
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <p className="sv-hint mt-5 mb-0 text-[13px]" style={{ color: CHAMP_DIM }}>
                Renndu músinni yfir bekk til að sjá hann.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══ KREMIN — Peau d'Or film strip, real photos from the salon ══ */}
        <section id="kremin" className="scroll-mt-20 overflow-clip" style={{ padding: '0 0 clamp(90px, 12vw, 150px)' }}>
          <div className="mx-auto max-w-[1180px] px-5 md:px-9">
            <Reveal>
              <p className="m-0 mb-4 text-[12px] tracking-[.3em]" style={{ color: MAGENTA, fontFamily: MONO }}>
                KREMIN · PEAU D’OR
              </p>
            </Reveal>
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
              <Reveal>
                <h2 className="m-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(38px, 6vw, 76px)', lineHeight: 1.02, color: TXT }}>
                  Ljóminn fylgir þér heim.
                </h2>
              </Reveal>
              <Reveal delay={80}>
                <p className="m-0 max-w-[44ch] text-[15px] leading-[1.65]" style={{ color: CHAMP_DIM }}>
                  Við mælum með kremunum frá Peau d’Or fyrir dýpri og jafnari lit. Satin Noir, Ibiza Black, Pure Men og fleiri. Spurðu okkur í afgreiðslunni.
                </p>
              </Reveal>
            </div>
          </div>
          <Reveal className="mt-10">
            <div className="sv-filmwrap">
              <div className="sv-film flex w-max gap-4">
                {[0, 1].map((k) => (
                  <div key={k} className={`flex gap-4 ${k === 1 ? 'sv-film-dup' : ''}`} aria-hidden={k === 1}>
                    {KREM.map((f, i) => (
                      <div key={f} className="sv-frame w-[240px] flex-none overflow-clip rounded-[14px] md:w-[300px]" style={{ aspectRatio: '4 / 5', border: `1px solid ${HAIR}`, background: OBSIDIAN2 }}>
                        <img src={`${A}krem/${f}`} alt={k === 0 ? KREM_ALT[i] : ''} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ══ STOFAN + finale + footer ═══════════════════════════════════ */}
        <section id="stofan" className="relative scroll-mt-20 overflow-clip" style={{ background: OBSIDIAN2, padding: 'clamp(90px, 12vw, 150px) 0 0' }}>
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
