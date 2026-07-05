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
  H1_GLYPHS,
  INSTAGRAM,
  INTRO_LETTERS,
  MAPS_HREF,
  NOONA,
  PHONE_DISPLAY,
  PHONE_HREF,
  PRICES,
  RAYS,
  TOWN,
  TUBES,
} from './data'

const company = getPreviewCompany('stjornusol')

/* ── "Mjúka stjarnan" tokens — ported 1:1 from the Claude Design handoff ── */
const DARK0 = '#0B0212'
const DARK1 = '#12051C'
const DARK2 = '#0E0318'
const DARK3 = '#1A0A28'
const CREAM = '#FFF8EE'
const TXT = '#FFF8F5' // on dark
const BODY_D = '#E9D9E4' // body on dark
const MUT_D = '#C4A9BC' // muted on dark
const RAIL_IDLE_D = '#9A7E90'
const PINK_SOFT = '#FF9EC6' // labels on dark
const PINK_PALE = '#FFD9EC'
const PINK_LINK = '#FFB9D6'
const CTA = '#CA1D64' // fill, white text 5.9:1
const INK = '#331021' // on blush/cream
const MUT_L = '#6B4455'
const SOFT_L = '#8A5B72'
const RAIL_IDLE_L = '#7A4A62'
const ACC_L = '#A8154F' // small text accent on light
const DEEP = '#C4145C' // intro glyph / wordmark on blush

const BASE = import.meta.env.BASE_URL
const A = `${BASE}stjornusol/`
const GARAMOND = "'EB Garamond', Georgia, serif"
const HANKEN = "'Hanken Grotesk', system-ui, sans-serif"
const EASE = 'cubic-bezier(.32,.72,0,1)'
const NUMS: React.CSSProperties = { fontFeatureSettings: "'lnum' 1", fontVariantNumeric: 'tabular-nums' }

const TUBE_GLOW =
  '0 0 12px 2px rgba(255,140,196,.6), 0 0 40px 12px rgba(233,72,142,.3), 0 0 90px 30px rgba(202,29,100,.12)'
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── The ray glyph (the ✦ mark), colorway per ground ───────────────────── */
function Glyph({ size, ray, dot, glow = false }: { size: number; ray: string; dot: string; glow?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={glow ? { filter: 'drop-shadow(0 0 8px rgba(255,124,178,.5))' } : undefined}
    >
      <g fill={ray}>
        {[0, 90, 180, 270].map((r) => (
          <rect key={r} x="11.25" y="1.2" width="1.5" height="6.6" rx=".75" transform={`rotate(${r} 12 12)`} />
        ))}
        {[45, 135, 225, 315].map((r) => (
          <rect key={r} x="11.25" y="3.4" width="1.5" height="4.2" rx=".75" transform={`rotate(${r} 12 12)`} />
        ))}
      </g>
      <circle cx="12" cy="12" r="1.7" fill={dot} />
    </svg>
  )
}

/* ── IO reveal (replaces animation-timeline:view of the prototype) ─────── */
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
    <div ref={ref} data-in={on} className={`sj-r ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ── Section label ("02 · nýjasti bekkurinn") ──────────────────────────── */
function Label({ n, text, on }: { n: string; text: string; on: 'dark' | 'light' }) {
  return (
    <p
      className="m-0 mb-4 text-[13px] font-semibold tracking-[.26em]"
      style={{ color: on === 'dark' ? PINK_SOFT : ACC_L, fontFamily: HANKEN }}
    >
      <span style={NUMS}>{n}</span> · {text}
    </p>
  )
}

/* ── Sun disc for the destination rows ─────────────────────────────────── */
const DISC: Record<string, { bg: string; shadow: string; anim: string }> = {
  capri: {
    bg: 'radial-gradient(circle at 50% 78%, #FFE3B0 0%, #FF9E6E 34%, #D9447C 62%, #2A1030 88%)',
    shadow: '0 0 24px rgba(255,158,110,.3)',
    anim: 'sjCapri 7s ease-in-out infinite alternate',
  },
  hawaii: {
    bg: 'radial-gradient(circle at 50% 42%, #FFF3CE 0%, #FFC46B 40%, #E8557E 74%, #2A1030 95%)',
    shadow: '0 0 24px rgba(255,196,107,.35)',
    anim: 'sjHawaii 9s ease-in-out infinite alternate',
  },
  hamptons: {
    bg: 'radial-gradient(circle at 50% 88%, #FFB98A 0%, #E8557E 42%, #7B2450 68%, #1B0C2A 90%)',
    shadow: '0 0 24px rgba(232,85,126,.3)',
    anim: 'sjHamptons 8s ease-in-out infinite alternate',
  },
}

export default function StjornusolPage() {
  const [introDone, setIntroDone] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [slot, setSlot] = useState<'morgun' | 'dag'>('morgun')
  const [nowSlot, setNowSlot] = useState<'morgun' | 'dag'>('morgun')
  const [activeSec, setActiveSec] = useState('ljosin')
  const [barHidden, setBarHidden] = useState(false)
  const [videoOn, setVideoOn] = useState(false)
  const [peek, setPeek] = useState(0) // 0 = none, 1..4 = bed index
  const heroContent = useRef<HTMLDivElement>(null)
  const progFill = useRef<HTMLDivElement>(null)
  const glowEl = useRef<HTMLDivElement>(null)
  const peekEl = useRef<HTMLDivElement>(null)
  const videoEl = useRef<HTMLVideoElement>(null)
  const finaleEl = useRef<HTMLDivElement>(null)

  /* title + theme + meta */
  useEffect(() => {
    document.title = 'Stjörnusól, sólbaðsstofa í Hafnarfirði. Bóka tíma á Noona'
    setThemeColor(DARK0)
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prev = meta.content
    meta.content =
      'Stjörnusól er sólbaðsstofa á Fjarðargötu 17 í Hafnarfirði, síðan 1979. Morgunverð alla daga fyrir kl. 14, opið til 22:00. Bókaðu tíma á Noona.'
    return () => {
      if (created) meta?.remove()
      else if (meta) meta.content = prev
    }
  }, [])

  /* intro overlay: once per load; reduced motion skips it */
  useEffect(() => {
    if (reduceMotion()) {
      setIntroDone(true)
      return
    }
    const t = window.setTimeout(() => setIntroDone(true), 2400)
    return () => window.clearTimeout(t)
  }, [])

  /* clock → price slot */
  useEffect(() => {
    const h = new Date().getHours()
    const now = h >= 10 && h < 14 ? 'morgun' : 'dag'
    setNowSlot(now)
    setSlot(now)
  }, [])

  /* scroll: header, progress tube, hero parallax — all synchronous */
  useEffect(() => {
    const rm = reduceMotion()
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      if (progFill.current) {
        const d = document.documentElement.scrollHeight - window.innerHeight
        progFill.current.style.transform = `scaleY(${d > 0 ? Math.min(1, y / d) : 0})`
      }
      if (!rm && heroContent.current && y < window.innerHeight * 1.2) {
        heroContent.current.style.transform = `translateY(${(y * 0.16).toFixed(1)}px)`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* cursor glow + bed peek follow (fine pointers, event-paced writes) */
  useEffect(() => {
    if (reduceMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      if (glowEl.current) {
        glowEl.current.style.opacity = '1'
        glowEl.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
      if (peekEl.current) {
        const w = Math.min(300, window.innerWidth * 0.34)
        const x = Math.min(e.clientX + 24, window.innerWidth - w - 12)
        const y = Math.min(e.clientY + 24, window.innerHeight - w * 0.75 - 12)
        peekEl.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
    }
    const onLeave = () => {
      if (glowEl.current) glowEl.current.style.opacity = '0'
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  /* optional hero film: only if stjornusol/k11.mp4 exists (HEAD probe) */
  useEffect(() => {
    if (reduceMotion()) return
    const v = videoEl.current
    if (!v) return
    let io: IntersectionObserver | null = null
    let url: string | null = null
    let dead = false
    fetch(`${A}k11.mp4`, { method: 'HEAD' })
      .then((r) => {
        if (!r.ok || !(r.headers.get('content-type') ?? '').includes('video')) return null
        return fetch(`${A}k11.mp4`).then((r2) => r2.blob())
      })
      .then((b) => {
        if (!b || dead) return
        url = URL.createObjectURL(b)
        v.src = url
        v.muted = true
        v.load()
        v.addEventListener('playing', () => setVideoOn(true), { once: true })
        io = new IntersectionObserver(
          (es) => es.forEach((e) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())),
          { threshold: 0.05 },
        )
        io.observe(v)
      })
      .catch(() => {})
    return () => {
      dead = true
      io?.disconnect()
      if (url) URL.revokeObjectURL(url)
    }
  }, [])

  /* finale hides the sticky bar */
  useEffect(() => {
    const el = finaleEl.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setBarHidden(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* chapter rail tracking */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        let best: IntersectionObserverEntry | null = null
        es.forEach((e) => {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e
        })
        if (best) setActiveSec((best as IntersectionObserverEntry).target.id)
      },
      { threshold: [0.25, 0.5] },
    )
    ;['ljosin', 'k11', 'verdskra', 'bekkirnir', 'stofan'].forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
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
        image: `${A}poster.jpg`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: ADDRESS,
          postalCode: '220',
          addressLocality: 'Hafnarfjörður',
          addressCountry: 'IS',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '10:00',
            closes: '22:00',
          },
        ],
        priceRange: '2.190 kr. til 32.900 kr.',
        sameAs: [FACEBOOK, INSTAGRAM],
        potentialAction: { '@type': 'ReserveAction', target: NOONA },
      }),
    [],
  )

  const morgun = slot === 'morgun'
  const railColor = (id: string) => {
    const light = activeSec === 'verdskra' || activeSec === 'bekkirnir'
    if (activeSec === id) return light ? ACC_L : PINK_SOFT
    return light ? RAIL_IDLE_L : RAIL_IDLE_D
  }

  const ctaPill = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: CTA,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 700,
    borderRadius: 999,
    fontFamily: HANKEN,
    ...extra,
  })

  return (
    <div className="sj-root min-h-screen antialiased" style={{ background: DARK0, color: BODY_D, fontFamily: HANKEN, overflowX: 'clip' }}>
      <script type="application/ld+json">{jsonLd}</script>

      <style>{`
        .sj-root ::selection{background:${CTA};color:${CREAM}}
        .sj-root :focus-visible{outline:3px solid #FF6BB0;outline-offset:3px}
        @keyframes sjStrike{0%{opacity:.04}9%{opacity:.55}12%{opacity:.08}21%{opacity:.85}26%{opacity:.12}33%{opacity:.06}41%{opacity:1}52%{opacity:.3}58%{opacity:1}74%{opacity:.55}79%,100%{opacity:1}}
        @keyframes sjHum{0%,90.6%{opacity:1}91%{opacity:.78}91.5%{opacity:1}94.8%{opacity:.92}95.1%{opacity:1}97.6%{opacity:.85}97.9%,100%{opacity:1}}
        @keyframes sjTwinkle{0%,84%{opacity:.85}86%{opacity:.2}88%{opacity:.85}93%{opacity:.4}95%,100%{opacity:.85}}
        @keyframes sjBuzz{0%{filter:brightness(1)}28%{filter:brightness(1.4)}40%{filter:brightness(1.02)}55%{filter:brightness(1.34)}100%{filter:brightness(1.14)}}
        @keyframes sjCapri{from{transform:translate(-14px,12px)}to{transform:translate(2px,-4px)}}
        @keyframes sjHawaii{0%{transform:translate(-16px,4px)}50%{transform:translate(0,-12px)}100%{transform:translate(16px,4px)}}
        @keyframes sjHamptons{from{transform:translate(6px,-4px)}to{transform:translate(-12px,14px)}}
        @keyframes sjSpin{to{transform:rotate(360deg)}}
        @keyframes sjRayGrow{0%{opacity:0;transform:scaleY(0)}60%{opacity:1;transform:scaleY(1.18)}100%{opacity:1;transform:scaleY(1)}}
        @keyframes sjDotPop{0%{opacity:0;transform:scale(0)}55%{opacity:1;transform:scale(1.5)}100%{opacity:1;transform:scale(1)}}
        @keyframes sjIntroShow{0%,74%{transform:translateY(0)}100%{transform:translateY(-101%)}}
        .sj-tube{will-change:opacity;animation:sjStrike 1.9s steps(1,end) var(--sd,0s) both, sjHum var(--hd,9s) steps(1,end) var(--hdd,3s) infinite}
        .sj-h1g{display:inline-block;will-change:opacity;animation:sjStrike 1.6s steps(1,end) var(--sd,0s) both, sjHum var(--hd,9s) steps(1,end) var(--hdd,3s) infinite}
        .sj-mini{animation:sjHum var(--hd,9s) steps(1,end) var(--hdd,3s) infinite}
        .sj-r{opacity:0;transform:translateY(30px);transition:opacity .9s ease,transform .9s ${EASE}}
        .sj-r[data-in="true"]{opacity:1;transform:none}
        .sj-rise{animation:sjRise .9s ${EASE} both}
        @keyframes sjRise{from{opacity:0;transform:translateY(30px)}}
        .sj-cta{transition:transform .3s ${EASE}, box-shadow .3s ease, filter .25s ease}
        .sj-cta:hover{transform:translateY(-3px);animation:sjBuzz .55s steps(1,end) both}
        .sj-cta:active{transform:scale(.97);animation:none}
        .sj-ghost{transition:background .3s ease, transform .3s ${EASE}}
        .sj-ghost:hover{background:rgba(255,255,255,.08);transform:translateY(-2px)}
        .sj-ghost:active{transform:scale(.97)}
        .sj-dest{transition:transform .35s ${EASE}, background .35s ease}
        .sj-dest:hover{transform:translateY(-3px);background:rgba(255,248,238,.08) !important}
        .sj-bed{transition:transform .35s ${EASE}}
        .sj-bed:hover{transform:translateX(8px)}
        .sj-strike-once{display:inline-block;animation:sjStrike .9s steps(1,end) both}
        .sj-glow-follow{transition:opacity .5s ease}
        .sj-peek-card{transition:opacity .28s ease, transform .32s ${EASE}}
        .sj-peek-img{transition:opacity .25s ease}
        @media (max-width:1219px){.sj-rail{display:none}}
        @media (prefers-reduced-motion: reduce){
          .sj-tube,.sj-h1g,.sj-mini,.sj-tw,.sj-spin{animation:none !important;opacity:1 !important}
          .sj-r{opacity:1;transform:none;transition:none}
          .sj-rise{animation:none}
          .sj-roll{transition:none !important}
          .sj-cta:hover{animation:none}
        }
      `}</style>

      {/* ── Skip link ─────────────────────────────────────────────────── */}
      <a
        href="#efni"
        className="fixed top-3.5 left-3.5 z-[100] -translate-y-[200%] rounded-xl px-4 py-3 text-[15px] font-bold transition-transform focus:translate-y-0"
        style={{ background: CREAM, color: ACC_L }}
      >
        Beint í efnið
      </a>

      {/* ── Intro overlay ─────────────────────────────────────────────── */}
      {!introDone && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[90] grid place-items-center"
          style={{ background: 'linear-gradient(180deg, #FBE3EC 0%, #F8CFDD 100%)', animation: `sjIntroShow 2.1s ${EASE} both`, willChange: 'transform' }}
        >
          <div className="grid justify-items-center gap-6">
            <span className="relative inline-block" style={{ width: 80, height: 80, fontSize: 80 }}>
              {RAYS.map((r) => (
                <span
                  key={r.rot}
                  className="absolute bottom-1/2 left-1/2"
                  style={{ width: '.075em', height: r.long ? '.3em' : '.18em', marginLeft: '-.0375em', transformOrigin: '50% 100%', transform: `rotate(${r.rot}deg) translateY(-.13em)` }}
                >
                  <span className="absolute inset-0 rounded-full" style={{ background: DEEP, transformOrigin: '50% 100%', animation: `sjRayGrow .5s ${EASE} ${r.d}s both` }} />
                </span>
              ))}
              <span className="absolute top-1/2 left-1/2 rounded-full" style={{ width: '.12em', height: '.12em', margin: '-.06em 0 0 -.06em', background: ACC_L, animation: 'sjDotPop .5s cubic-bezier(.34,1.4,.4,1) .05s both' }} />
            </span>
            <p className="m-0" style={{ fontFamily: GARAMOND, fontSize: 46, fontWeight: 500, letterSpacing: '.01em', color: DEEP }}>
              {INTRO_LETTERS.map((l, i) => (
                <span key={i} className="inline-block" style={{ animation: `sjStrike .7s steps(1,end) ${l.d}s both` }}>
                  {l.ch}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-3"
        style={{
          padding: 'clamp(12px,2.4vw,18px) clamp(16px,4vw,34px)',
          background: scrolled ? 'rgba(11,2,18,.72)' : 'transparent',
          backdropFilter: scrolled ? 'blur(18px)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,.08)' : 'transparent'}`,
          transition: 'background .45s ease, backdrop-filter .45s ease, border-color .45s ease',
        }}
      >
        <a href="#efni" aria-label="Stjörnusól, forsíða" className="inline-flex items-center gap-2.5 no-underline">
          <Glyph size={22} ray="#FF7CB2" dot="#FFC2E1" glow />
          <span style={{ fontFamily: GARAMOND, fontSize: 22, fontWeight: 500, color: TXT }}>Stjörnusól</span>
        </a>
        <a href={NOONA} target="_blank" rel="noreferrer" className="sj-cta" style={ctaPill({ fontSize: 15, padding: '11px 22px' })}>
          Bóka tíma
        </a>
      </header>

      {/* ── Chapter rail (≥1220px) ────────────────────────────────────── */}
      <nav aria-label="Kaflar" className="sj-rail fixed top-1/2 left-6 z-[52] flex -translate-y-1/2 flex-col gap-[18px]">
        {(
          [
            ['ljosin', '01', 'ljósin'],
            ['k11', '02', 'k11 air loft'],
            ['verdskra', '03', 'verðskrá'],
            ['bekkirnir', '04', 'bekkirnir'],
            ['stofan', '05', 'stofan'],
          ] as const
        ).map(([id, n, label]) => (
          <a key={id} href={`#${id}`} className="flex items-baseline gap-2.5 text-[11px] font-bold tracking-[.14em] no-underline transition-colors duration-300" style={{ color: railColor(id) }}>
            <span style={NUMS}>{n}</span>
            <span>{label}</span>
          </a>
        ))}
      </nav>

      {/* ── Cursor glow ───────────────────────────────────────────────── */}
      <div
        ref={glowEl}
        aria-hidden="true"
        className="sj-glow-follow pointer-events-none fixed top-0 left-0 z-[45] rounded-full opacity-0"
        style={{ width: 520, height: 520, margin: '-260px 0 0 -260px', background: 'radial-gradient(circle, rgba(255,124,178,.15) 0%, rgba(202,29,100,.06) 45%, rgba(202,29,100,0) 70%)', mixBlendMode: 'screen', willChange: 'transform' }}
      />

      {/* ── Progress tube ─────────────────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none fixed top-3 right-[9px] bottom-3 z-50 w-[3px] rounded-full" style={{ background: 'rgba(255,158,198,.12)' }}>
        <div
          ref={progFill}
          className="sj-mini h-full w-full origin-top rounded-full"
          style={{ background: 'linear-gradient(180deg, #FFF6FB, #FF7CB2 40%, #CA1D64)', boxShadow: '0 0 10px 1px rgba(255,124,178,.55)', transform: 'scaleY(0)', willChange: 'transform', '--hd': '11s', '--hdd': '4s' } as React.CSSProperties}
        />
      </div>

      {/* ── Bed peek follower ─────────────────────────────────────────── */}
      <div ref={peekEl} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[48]" style={{ width: 'min(300px, 34vw)', aspectRatio: '4 / 3', transform: 'translate3d(-500px,-500px,0)', willChange: 'transform' }}>
        <div className="sj-peek-card absolute inset-0 overflow-clip rounded-[18px]" style={{ border: '1px solid rgba(255,158,198,.28)', boxShadow: '0 30px 70px rgba(4,0,8,.6)', background: '#150826', opacity: peek ? 1 : 0, transform: peek ? 'scale(1)' : 'scale(.88)' }}>
          {BEDS.map((b, i) => (
            <img key={b.id} src={`${A}${b.image}`} alt="" className="sj-peek-img absolute inset-0 h-full w-full object-cover" style={{ opacity: peek === i + 1 ? 1 : 0 }} />
          ))}
        </div>
      </div>

      {/* ── Sticky booking bar ────────────────────────────────────────── */}
      <div
        className="fixed right-0 left-0 z-[55] mx-auto flex gap-2 rounded-full p-2"
        style={{
          bottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
          width: 'min(calc(100% - 24px), 400px)',
          background: 'rgba(14,4,24,.82)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,158,198,.18)',
          boxShadow: '0 18px 50px rgba(6,1,10,.55)',
          transform: barHidden ? 'translateY(140%)' : 'none',
          transition: `transform .5s ${EASE}`,
        }}
      >
        <a href={PHONE_HREF} aria-label={`Hringja í ${PHONE_DISPLAY}`} className="grid h-[50px] w-[50px] flex-none place-items-center rounded-full no-underline" style={{ background: 'rgba(255,255,255,.09)', border: '1px solid rgba(255,255,255,.14)', color: '#FFEFF7' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </a>
        <a href={NOONA} target="_blank" rel="noreferrer" className="sj-cta flex-1 text-center" style={ctaPill({ fontSize: 17, padding: '14px 20px' })}>
          Bóka tíma
        </a>
      </div>

      <main id="efni">
        {/* ══ 01 · LJÓSIN — hero ═════════════════════════════════════════ */}
        <section id="ljosin" className="relative grid min-h-[100svh] place-items-center overflow-clip" style={{ background: `linear-gradient(180deg, ${DARK0} 0%, ${DARK1} 58%, ${DARK3} 100%)`, padding: 'clamp(104px, 14vh, 150px) 0 clamp(72px, 10vh, 120px)' }}>
          <video ref={videoEl} muted loop playsInline preload="none" poster={`${A}poster.jpg`} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: videoOn ? 1 : 0, transition: 'opacity 1.2s ease' }} />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 bottom-[8vh] z-[1] flex justify-between" style={{ padding: '0 clamp(8px, 3.4vw, 56px)', opacity: videoOn ? 0.2 : 1, transition: 'opacity 1s ease' }}>
            {TUBES.map((t, i) => (
              <div
                key={i}
                className="sj-tube h-full rounded-full"
                style={{ width: 'clamp(2px, .4vw, 5px)', background: 'linear-gradient(180deg, #FFC2E1, #FFF6FB 30%, #FFF6FB 62%, #FFC2E1)', boxShadow: TUBE_GLOW, opacity: 0.55, '--sd': `${t.strike}s`, '--hd': `${t.hum}s`, '--hdd': `${t.humDelay}s` } as React.CSSProperties}
              />
            ))}
          </div>
          <div aria-hidden="true" className="absolute inset-0 z-[2]" style={{ background: 'radial-gradient(130% 96% at 50% 86%, rgba(8,1,14,.92) 0%, rgba(8,1,14,.55) 46%, rgba(8,1,14,.06) 100%)' }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2]" style={{ backgroundImage: GRAIN, opacity: 0.07 }} />
          {(
            [
              ['13%', '10%', 12, 7.3, 2.8],
              ['18%', '87%', 11, 8.7, 4.1],
              ['9%', '52%', 10, 8.1, 5.2],
            ] as const
          ).map(([top, left, size, dur, delay], i) => (
            <span key={i} aria-hidden="true" className="sj-tw absolute z-[3]" style={{ top, left, color: PINK_PALE, fontSize: size, animation: `sjTwinkle ${dur}s steps(1,end) ${delay}s infinite` }}>
              ✦
            </span>
          ))}

          <div ref={heroContent} className="relative z-[4] mx-auto w-full max-w-[1240px] self-center text-center" style={{ padding: '0 clamp(18px, 4.5vw, 64px)', willChange: 'transform' }}>
            <p className="sj-rise m-0 mb-5 text-[13px] font-semibold tracking-[.26em]" style={{ color: PINK_SOFT, animationDelay: '.1s' }}>
              <span aria-hidden="true">✦ </span>sólbaðsstofa í hafnarfirði síðan {FOUNDED}
            </p>
            <p className="sj-rise m-0 mb-4 font-bold" style={{ fontSize: 'clamp(17px, 2.2vw, 22px)', color: PINK_PALE, animationDelay: '.05s' }}>
              Morgunverð alla daga fyrir kl. 14
            </p>
            <h1 aria-label="Morgunverð frá 2.190 kr. fyrir kl. 14" className="m-0 whitespace-nowrap" style={{ fontFamily: GARAMOND, fontSize: 'clamp(46px, 11.5vw, 152px)', lineHeight: 1, letterSpacing: '-.01em', fontWeight: 500, color: TXT, textShadow: '0 0 60px rgba(255,124,178,.32)', ...NUMS }}>
              <span aria-hidden="true">
                {H1_GLYPHS.map((g, i) => (
                  <span key={i}>
                    {g.gap ? <span className="inline-block" style={{ width: '.2em' }} /> : null}
                    <span className="sj-h1g" style={{ '--sd': `${g.strike}s`, '--hd': `${g.hum}s`, '--hdd': `${g.humDelay}s` } as React.CSSProperties}>
                      {g.ch}
                    </span>
                  </span>
                ))}
              </span>
            </h1>
            <p className="sj-rise mx-auto mt-6 mb-0" style={{ maxWidth: '54ch', fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.55, color: BODY_D, animationDelay: '.5s' }}>
              Gildir frá kl. 10 til 14, dagverð tekur við eftir það. Stjörnusól er sólbaðsstofa á Fjarðargötu 17 í Hafnarfirði, opið alla daga frá 10 til 22.
            </p>
            <div className="sj-rise mt-[30px] flex flex-wrap items-center justify-center gap-3.5" style={{ animationDelay: '.65s' }}>
              <a href={NOONA} target="_blank" rel="noreferrer" className="sj-cta" style={ctaPill({ fontSize: 17, padding: '18px 38px', boxShadow: '0 14px 40px rgba(202,29,100,.4)' })}>
                Bóka tíma
              </a>
              <a href="#verdskra" className="sj-ghost rounded-full font-semibold no-underline" style={{ color: '#FFF6FA', fontSize: 16, padding: '17px 26px', border: '1px solid rgba(255,255,255,.24)' }}>
                Sjá verðskrá ↓
              </a>
            </div>
            <a href="#k11" className="sj-rise mt-[22px] inline-flex items-center gap-[9px] rounded-full text-sm font-semibold no-underline transition-colors duration-300 hover:bg-[rgba(202,29,100,.26)]" style={{ padding: '9px 18px', border: '1px solid rgba(255,158,198,.34)', background: 'rgba(202,29,100,.14)', color: PINK_PALE, animationDelay: '.78s' }}>
              <span aria-hidden="true" style={{ color: PINK_SOFT }}>✦</span>
              Nýjasti bekkurinn, K11 Air Loft, er kominn
            </a>
          </div>
        </section>

        {/* ══ 02 · K11 AIR LOFT ══════════════════════════════════════════ */}
        <section id="k11" className="relative overflow-clip" style={{ background: DARK2, padding: 'clamp(90px, 12vw, 150px) 0' }}>
          <div aria-hidden="true" className="absolute rounded-full" style={{ top: -140, right: -120, width: 460, height: 460, background: 'radial-gradient(circle, rgba(202,29,100,.2) 0%, rgba(202,29,100,0) 70%)' }} />
          <div className="relative mx-auto max-w-[1180px]" style={{ padding: '0 clamp(20px, 5vw, 64px)' }}>
            <Reveal>
              <Label n="02" text="nýjasti bekkurinn" on="dark" />
            </Reveal>
            <div className="grid items-start" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 'clamp(28px, 5vw, 72px)' }}>
              <div>
                <Reveal>
                  <h2 className="m-0" style={{ fontFamily: GARAMOND, fontSize: 'clamp(44px, 7vw, 92px)', lineHeight: 1, letterSpacing: '-.01em', fontWeight: 500, color: TXT }}>
                    K11 Air Loft
                  </h2>
                </Reveal>
                <Reveal delay={80}>
                  <p className="mt-[22px] mb-0" style={{ maxWidth: '56ch', fontSize: 'clamp(16px, 2vw, 18px)', lineHeight: 1.6, color: BODY_D }}>
                    ALL LED bekkur með SunFinity ljósatækni og SunControl sérsniðinni brúnku. Loft Infinity speglar og kæling fyrir líkama og andlit.
                  </p>
                </Reveal>
                <Reveal delay={140} className="mt-[30px] flex flex-wrap items-center gap-4">
                  <a href={NOONA} target="_blank" rel="noreferrer" className="sj-cta" style={ctaPill({ fontSize: 16, padding: '15px 30px' })}>
                    Bóka tíma
                  </a>
                  <p className="m-0 text-sm" style={{ color: MUT_D }}>
                    Bókanlegur á Noona.
                  </p>
                </Reveal>
              </div>
              <div className="flex flex-col gap-[22px]" style={{ borderLeft: '1px solid rgba(255,255,255,.12)', paddingLeft: 'clamp(20px, 3vw, 40px)' }}>
                {(
                  [
                    ['+26%', 'meira UVA í andliti og á hálssvæði'],
                    ['+33%', 'meira UVB í andliti og á hálssvæði'],
                  ] as const
                ).map(([n, t], i) => (
                  <Reveal key={n} delay={i * 90}>
                    <p className="m-0" style={{ fontSize: 'clamp(44px, 5.5vw, 68px)', fontFamily: GARAMOND, fontWeight: 500, color: TXT, textShadow: '0 0 40px rgba(255,124,178,.3)', ...NUMS }}>
                      {n}
                    </p>
                    <p className="mt-1 mb-0 text-sm" style={{ lineHeight: 1.5, color: MUT_D }}>
                      {t}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal>
              <p className="mb-0 text-[13px] font-semibold tracking-[.26em]" style={{ margin: 'clamp(40px, 6vw, 64px) 0 0', color: PINK_SOFT }}>
                þú velur áfangastað
              </p>
            </Reveal>
            <div className="mt-[18px] grid gap-2.5">
              {DESTINATIONS.map((d, i) => (
                <Reveal key={d.id} delay={i * 70}>
                  <div className="sj-dest grid items-center gap-[18px] rounded-[20px] p-[18px]" style={{ gridTemplateColumns: '64px minmax(0,1fr) auto', background: 'rgba(255,248,238,.04)', border: '1px solid rgba(255,158,198,.13)' }}>
                    <span aria-hidden="true" className="relative overflow-clip rounded-full" style={{ width: 64, height: 64, background: DISC[d.id].bg, boxShadow: DISC[d.id].shadow }}>
                      <span className="absolute top-1/2 left-1/2 rounded-full" style={{ width: 10, height: 10, margin: '-5px 0 0 -5px', background: 'radial-gradient(circle, #FFF6DF 0%, #FFB46B 70%)', boxShadow: '0 0 10px 2px rgba(255,180,107,.8)', animation: DISC[d.id].anim }} />
                    </span>
                    <div>
                      <p className="m-0" style={{ fontSize: 'clamp(19px, 2.6vw, 24px)', fontFamily: GARAMOND, fontWeight: 500, color: TXT }}>
                        {d.title}{' '}
                        <span className="ml-1.5 text-[13px] font-semibold" style={{ color: MUT_D, fontFamily: HANKEN, ...NUMS }}>
                          {d.lat}
                        </span>
                      </p>
                      <p className="mt-1 mb-0 text-sm" style={{ lineHeight: 1.5, color: MUT_D }}>
                        {d.body}
                      </p>
                    </div>
                    <span className="rounded-full text-xs font-bold tracking-[.06em] whitespace-nowrap" style={{ color: PINK_PALE, border: '1px solid rgba(255,158,198,.32)', padding: '7px 13px' }}>
                      {d.chip}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 03 · VERÐSKRÁ — the blush chapter ══════════════════════════ */}
        <section id="verdskra" className="relative overflow-clip" style={{ background: 'linear-gradient(180deg, #FBE3EC 0%, #F8CFDD 100%)', padding: 'clamp(90px, 12vw, 150px) 0' }}>
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(90% 60% at 50% 0%, rgba(255,170,110,.3) 0%, rgba(255,170,110,0) 70%)', opacity: morgun ? 1 : 0, transition: 'opacity .9s ease' }} />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(90% 60% at 50% 0%, rgba(232,57,126,.2) 0%, rgba(232,57,126,0) 70%)', opacity: morgun ? 0 : 1, transition: 'opacity .9s ease' }} />
          <div className="relative mx-auto max-w-[1180px]" style={{ padding: '0 clamp(20px, 5vw, 64px)' }}>
            <Reveal>
              <Label n="03" text="verðskrá" on="light" />
            </Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <h2 className="m-0" style={{ fontFamily: GARAMOND, fontSize: 'clamp(44px, 7vw, 92px)', lineHeight: 1, letterSpacing: '-.01em', fontWeight: 500, color: INK }}>
                  Sami tími,
                  <br />
                  tvö verð.
                </h2>
              </Reveal>
              <Reveal delay={80} className="text-right">
                <p className="m-0 text-sm" style={{ lineHeight: 1.6, color: MUT_L }}>
                  Morgunverð gildir alla daga frá kl. 10 til 14.
                </p>
                <p className="mt-0.5 mb-0 text-sm" style={{ lineHeight: 1.6, color: MUT_L }}>
                  Öryrkjar fá 10% afslátt.
                </p>
              </Reveal>
            </div>

            {/* toggle */}
            <Reveal className="mt-[38px] flex flex-wrap items-center gap-3.5">
              <div className="relative inline-flex rounded-full p-[5px]" style={{ background: 'rgba(196,20,92,.08)', border: '1px solid rgba(196,20,92,.22)', minWidth: 'min(100%, 420px)' }}>
                <span aria-hidden="true" className="absolute rounded-full" style={{ top: 5, bottom: 5, left: 5, width: 'calc(50% - 10px)', background: '#FFFDF8', border: '1px solid rgba(196,20,92,.28)', boxShadow: '0 4px 14px rgba(122,26,74,.16)', transform: morgun ? 'translateX(0)' : 'translateX(calc(100% + 10px))', transition: `transform .45s ${EASE}` }} />
                {(
                  [
                    ['morgun', 'Morgunverð'],
                    ['dag', 'Dagverð'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={slot === id}
                    onClick={() => setSlot(id)}
                    className="relative z-[1] inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-none bg-transparent font-bold"
                    style={{ fontFamily: HANKEN, fontSize: 15, padding: '13px 12px', color: slot === id ? ACC_L : MUT_L, transition: 'color .3s ease' }}
                  >
                    <span key={slot} className="sj-strike-once">
                      {label}
                    </span>
                    {nowSlot === id ? <span className="h-[7px] w-[7px] rounded-full" style={{ background: DEEP }} title="gildir núna" /> : null}
                  </button>
                ))}
              </div>
              <p className="m-0 text-[13px]" style={{ color: MUT_L }}>
                {nowSlot === 'morgun' ? 'Morgunverð gildir núna.' : 'Dagverð gildir núna.'}
              </p>
            </Reveal>

            {/* rows */}
            <div className="mt-[30px]">
              {(['stakir', 'kort'] as const).map((group) => (
                <div key={group}>
                  <p className="mb-1 text-xs font-semibold tracking-[.22em]" style={{ margin: group === 'kort' ? '26px 0 4px' : '0 0 4px', color: ACC_L }}>
                    {group === 'stakir' ? 'stakir tímar' : 'kort'}
                  </p>
                  {PRICES.filter((p) => p.group === group).map((p, i, arr) => {
                    const globalIndex = PRICES.findIndex((x) => x.id === p.id)
                    return (
                      <Reveal key={p.id}>
                        <div className="grid items-center" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', gap: '8px 18px', padding: '18px 4px', borderTop: '1px solid rgba(51,16,33,.16)', borderBottom: group === 'kort' && i === arr.length - 1 ? '1px solid rgba(51,16,33,.16)' : undefined }}>
                          <div>
                            <p className="m-0 font-bold" style={{ fontSize: 'clamp(18px, 2.4vw, 21px)', color: INK }}>
                              {p.name}
                              {p.minutes ? (
                                <span className="text-sm font-medium" style={{ color: MUT_L }}>
                                  {' '}
                                  · {p.minutes}
                                </span>
                              ) : null}
                            </p>
                            <p className="mt-1 mb-0 text-[13px]" style={{ color: MUT_L }}>
                              Morgunverð {p.morning} · Dagverð {p.day}
                              <span className="ml-2.5 font-bold" style={{ color: ACC_L, opacity: morgun ? 1 : 0.25, transition: 'opacity .4s ease' }}>
                                þú sparar {p.saves}
                              </span>
                            </p>
                          </div>
                          <div className="overflow-hidden text-right" style={{ height: '1.15em', fontSize: 'clamp(30px, 5vw, 46px)', fontFamily: GARAMOND, fontWeight: 500, color: INK, ...NUMS }}>
                            <div className="sj-roll" style={{ transform: morgun ? 'translateY(0)' : 'translateY(-1.15em)', transition: `transform .55s cubic-bezier(.6,.1,.2,1) ${globalIndex * 0.06}s` }}>
                              <span className="block" style={{ height: '1.15em', lineHeight: '1.15em' }}>
                                {p.morning}
                              </span>
                              <span className="block" style={{ height: '1.15em', lineHeight: '1.15em' }}>
                                {p.day}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-5">
              <p className="m-0 text-sm" style={{ color: MUT_L }}>
                K11 Air Loft er bókanlegur á Noona. Bókun fer fram á Noona.
              </p>
              <a href={NOONA} target="_blank" rel="noreferrer" className="sj-cta" style={ctaPill({ fontSize: 16, padding: '16px 32px', boxShadow: '0 12px 32px rgba(202,29,100,.3)' })}>
                Bóka tíma
              </a>
            </div>
          </div>
        </section>

        {/* ══ 04 · BEKKIRNIR ═════════════════════════════════════════════ */}
        <section id="bekkirnir" className="relative" style={{ background: CREAM, padding: 'clamp(90px, 12vw, 150px) 0' }}>
          <div className="mx-auto max-w-[1180px]" style={{ padding: '0 clamp(20px, 5vw, 64px)' }}>
            <Reveal>
              <Label n="04" text="bekkirnir" on="light" />
            </Reveal>
            <Reveal>
              <h2 className="m-0" style={{ fontFamily: GARAMOND, fontSize: 'clamp(44px, 7vw, 92px)', lineHeight: 1, letterSpacing: '-.01em', fontWeight: 500, color: INK }}>
                Fjórir bekkir, eitt ljós.
              </h2>
            </Reveal>
            <div className="mt-10">
              {BEDS.map((b, i) => (
                <Reveal key={b.id}>
                  <div
                    className="sj-bed grid items-center gap-4"
                    onMouseEnter={() => setPeek(i + 1)}
                    onMouseLeave={() => setPeek(0)}
                    style={{ gridTemplateColumns: 'clamp(30px, 5vw, 52px) minmax(0,1fr) auto auto', padding: 'clamp(20px, 3.4vw, 30px) 4px', borderTop: '1px solid rgba(51,16,33,.16)', borderBottom: i === BEDS.length - 1 ? '1px solid rgba(51,16,33,.16)' : undefined }}
                  >
                    <p className="m-0 text-sm font-semibold" style={{ color: SOFT_L, ...NUMS }}>
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="m-0" style={{ fontSize: 'clamp(24px, 4.6vw, 48px)', fontFamily: GARAMOND, fontWeight: 500, letterSpacing: '-.005em', color: INK, lineHeight: 1.05 }}>
                      {b.name}
                    </p>
                    {b.maker ? (
                      <p className="m-0 text-sm" style={{ color: MUT_L }}>
                        {b.maker}
                      </p>
                    ) : (
                      <a href="#k11" className="inline-flex items-center gap-[7px] rounded-full text-[13px] font-bold no-underline transition-colors duration-300 hover:bg-[rgba(196,20,92,.08)]" style={{ color: ACC_L, border: '1px solid rgba(196,20,92,.32)', padding: '9px 16px' }}>
                        sjá kaflann<span aria-hidden="true">↑</span>
                      </a>
                    )}
                    <div aria-hidden="true" className="flex gap-1">
                      {[0, 1, 2].map((j) => (
                        <span key={j} className="sj-mini rounded-full" style={{ width: 3, height: 26, background: 'linear-gradient(180deg, #E86FA8, #FFD3E7)', '--hd': `${7.4 + ((i * 3 + j) % 5) * 1.1}s`, '--hdd': `${1.2 + ((i * 3 + j) % 6) * 0.8}s` } as React.CSSProperties}
                        />
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 05 · STOFAN + finale + footer ══════════════════════════════ */}
        <section id="stofan" className="relative overflow-clip" style={{ background: `linear-gradient(180deg, ${DARK0} 0%, ${DARK1} 70%, ${DARK3} 100%)`, padding: 'clamp(90px, 12vw, 150px) 0 0' }}>
          <span aria-hidden="true" className="sj-spin pointer-events-none absolute" style={{ right: '-10vw', top: '2%', fontSize: '40vw', lineHeight: 1, color: 'rgba(202,29,100,.07)', willChange: 'transform', animation: 'sjSpin 90s linear infinite' }}>
            ✦
          </span>
          <div className="relative mx-auto max-w-[1180px]" style={{ padding: '0 clamp(20px, 5vw, 64px)' }}>
            <Reveal>
              <Label n="05" text="stofan" on="dark" />
            </Reveal>
            <Reveal>
              <h2 className="m-0" style={{ fontFamily: GARAMOND, fontSize: 'clamp(46px, 8vw, 100px)', lineHeight: 1, letterSpacing: '-.01em', fontWeight: 500, color: TXT, textWrap: 'balance' }}>
                Sjáumst í ljósinu.
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-4 mb-0 text-[15px]" style={{ color: MUT_D }}>
                Sólbaðsstofa í Hafnarfirði síðan {FOUNDED}.
              </p>
            </Reveal>
            <div className="mt-[46px] flex flex-wrap" style={{ gap: 'clamp(32px, 6vw, 72px) clamp(40px, 8vw, 96px)' }}>
              <Reveal>
                <p className="m-0 mb-2.5 text-xs font-semibold tracking-[.2em]" style={{ color: PINK_SOFT }}>
                  heimilisfang
                </p>
                <p className="m-0 text-[19px] font-bold" style={{ color: TXT, lineHeight: 1.5 }}>
                  {ADDRESS}
                  <br />
                  {TOWN}
                </p>
                <a href={MAPS_HREF} target="_blank" rel="noreferrer" className="mt-3 inline-block pb-0.5 text-sm font-semibold no-underline" style={{ color: PINK_LINK, borderBottom: '1px solid rgba(255,185,214,.4)' }}>
                  Opna í kortum ↗
                </a>
              </Reveal>
              <Reveal delay={70}>
                <p className="m-0 mb-2.5 text-xs font-semibold tracking-[.2em]" style={{ color: PINK_SOFT }}>
                  opnunartími
                </p>
                <p className="m-0 text-[19px] font-bold" style={{ color: TXT, lineHeight: 1.5 }}>
                  Alla daga
                  <br />
                  10:00 til 22:00
                </p>
                <p className="mt-3 mb-0 text-sm" style={{ color: MUT_D }}>
                  Morgunverð til kl. 14
                </p>
              </Reveal>
              <Reveal delay={140}>
                <p className="m-0 mb-2.5 text-xs font-semibold tracking-[.2em]" style={{ color: PINK_SOFT }}>
                  samband
                </p>
                <p className="m-0 text-[19px] font-bold" style={{ lineHeight: 1.5 }}>
                  <a href={PHONE_HREF} className="no-underline" style={{ color: TXT }}>
                    {PHONE_DISPLAY}
                  </a>
                </p>
                <p className="mt-3.5 mb-0 flex gap-4">
                  <a href={FACEBOOK} target="_blank" rel="noreferrer" className="pb-0.5 text-sm font-semibold no-underline" style={{ color: PINK_LINK, borderBottom: '1px solid rgba(255,185,214,.4)' }}>
                    Facebook ↗
                  </a>
                  <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="pb-0.5 text-sm font-semibold no-underline" style={{ color: PINK_LINK, borderBottom: '1px solid rgba(255,185,214,.4)' }}>
                    Instagram ↗
                  </a>
                </p>
              </Reveal>
            </div>

            <div ref={finaleEl} className="text-center" style={{ marginTop: 'clamp(64px, 9vw, 110px)' }}>
              <Reveal>
                <a href={NOONA} target="_blank" rel="noreferrer" className="sj-cta inline-block" style={ctaPill({ fontSize: 'clamp(18px, 2.4vw, 22px)', fontWeight: 800, padding: '22px 52px', boxShadow: '0 18px 60px rgba(202,29,100,.45)' })}>
                  Bóka tíma
                </a>
                <p className="mt-4 mb-0 text-sm" style={{ color: MUT_D }}>
                  Bókun fer fram á Noona
                </p>
              </Reveal>
            </div>

            <footer className="flex flex-wrap items-center gap-[18px]" style={{ marginTop: 'clamp(56px, 8vw, 90px)', padding: '26px 0 calc(88px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid rgba(255,255,255,.1)' }}>
              <span className="inline-flex items-center gap-2">
                <Glyph size={17} ray="#FF7CB2" dot="#FFC2E1" />
                <span style={{ fontFamily: GARAMOND, fontSize: 18, fontWeight: 500, color: TXT }}>Stjörnusól</span>
              </span>
              <p className="m-0 text-[13px]" style={{ color: MUT_D, lineHeight: 1.6 }}>
                © 2026 Stjörnusól · {ADDRESS}, {TOWN} ·{' '}
                <a href={PHONE_HREF} className="no-underline" style={{ color: PINK_LINK }}>
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
