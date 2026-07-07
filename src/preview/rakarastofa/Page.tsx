import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  BARBERS,
  EMAIL,
  FACEBOOK,
  HERO,
  HOURS,
  IMG,
  MAPS,
  NOONA,
  PHONE_DISPLAY,
  PHONE_HREF,
  SERVICES,
  STORY,
} from './data'

const company = getPreviewCompany('rakarastofa')

/* ── Klippt síðan 1948 — dark, cinematic, modern. Warm charcoal, warm off-white,
      one muted barber-red. Full-bleed photography carries it; motion is a slow
      ken-burns, gentle parallax and smooth reveals — no gimmicks. ───────────── */
const BG_DEEP = '#0C0B0A' // near-black warm charcoal (page ground)
const BG = '#141210' // section ground
const SURFACE = '#1B1917' // panels / cards
const HAIR = 'rgba(244,239,231,0.10)' // thin hairlines
const HAIR_HI = 'rgba(244,239,231,0.20)'
const INK = '#F4EFE7' // warm off-white
const MUT = 'rgba(244,239,231,0.62)'
const MUT2 = 'rgba(244,239,231,0.40)'
const ACCENT_HI = '#E8795F' // muted barber-red accent (AA on charcoal)

const BASE = import.meta.env.BASE_URL
const DISPLAY = "'Fraunces', Georgia, serif"
const SANS = "'CabinetGrotesk-Regular', system-ui, sans-serif"
const SANS_MED = "'CabinetGrotesk-Medium', system-ui, sans-serif"
const SANS_BOLD = "'CabinetGrotesk-Bold', system-ui, sans-serif"
const MONO = "'Space Mono', monospace"

/* ── Smooth reveal ──────────────────────────────────────────────────────── */
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )
    io.observe(el)
    const tm = window.setTimeout(() => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) setOn(true)
    }, 1400)
    return () => {
      io.disconnect()
      window.clearTimeout(tm)
    }
  }, [])
  return (
    <div ref={ref} data-in={on} className={`rk-rev ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ── Cinematic photo with a dark fallback until the Higgsfield shot lands ─── */
function Shot({
  src,
  alt,
  className = '',
  imgClassName = '',
  kenburns = false,
  screen = false,
  contain = false,
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  kenburns?: boolean
  screen?: boolean
  contain?: boolean
  priority?: boolean
}) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: screen ? BG_DEEP : SURFACE }}>
      {failed ? (
        <div className="absolute inset-0 grid place-items-center" style={{ background: 'radial-gradient(120% 120% at 50% 18%, #232019 0%, #0B0A09 72%)' }}>
          <span className="text-[10px] tracking-[0.26em] uppercase" style={{ fontFamily: MONO, color: MUT2 }}>
            Ljósmynd væntanleg
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
          className={`h-full w-full ${contain ? 'object-contain' : 'object-cover'} ${kenburns ? 'rk-kb' : ''} ${screen ? 'rk-screen' : ''} ${imgClassName}`}
        />
      )}
    </div>
  )
}

function Cta({ href, children, tone = 'solid' }: { href: string; children: ReactNode; tone?: 'solid' | 'ghost' }) {
  const solid = tone === 'solid'
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rk-cta inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[13px] tracking-[0.08em] uppercase"
      style={
        solid
          ? { background: INK, color: BG_DEEP, fontFamily: SANS_BOLD }
          : { border: `1px solid ${HAIR_HI}`, color: INK, fontFamily: SANS_BOLD }
      }
    >
      {children}
    </a>
  )
}

export default function RakarastofaPage() {
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const signRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setThemeColor(BG_DEEP)
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Smooth scroll-driven parallax on the neon sign: it eases up, scales and
  // fades as the hero scrolls away. Direct DOM writes + rAF lerp (no re-render).
  useEffect(() => {
    const sign = signRef.current
    const hero = heroRef.current
    if (!sign || !hero) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let target = 0
    let cur = 0
    let raf = 0
    const measure = () => {
      const h = hero.offsetHeight || window.innerHeight
      target = Math.min(1, Math.max(0, window.scrollY / h))
    }
    const tick = () => {
      cur += (target - cur) * 0.09
      sign.style.transform = `translate3d(0, ${(-cur * 64).toFixed(1)}px, 0) scale(${(1 - cur * 0.07).toFixed(3)})`
      sign.style.opacity = (1 - cur * 0.5).toFixed(3)
      raf = requestAnimationFrame(tick)
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(raf)
    }
  }, [])

  const jsonLd = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HairSalon',
        name: 'Rakarastofa Björns og Kjartans',
        url: 'https://rakarastofan.is',
        telephone: '+354 482 2244',
        email: EMAIL,
        foundingDate: '1948',
        image: company.thumb,
        address: { '@type': 'PostalAddress', streetAddress: 'Austurvegur 4', addressLocality: 'Selfoss', postalCode: '800', addressCountry: 'IS' },
        openingHours: ['Mo-Fr 09:00-17:00', 'Sa 09:30-12:00'],
        priceRange: '$$',
      }),
    [],
  )

  return (
    <div className="rk-root min-h-screen overflow-x-hidden pb-[4.5rem] antialiased md:pb-0" style={{ background: BG_DEEP, color: INK, fontFamily: SANS }}>
      <link rel="stylesheet" href={`${BASE}fonts/cabinet-grotesk/css/cabinet-grotesk.css`} />
      <script type="application/ld+json">{jsonLd}</script>

      <style>{`
        .rk-rev{opacity:0;transform:translateY(22px);transition:opacity .9s cubic-bezier(0.22,1,0.36,1),transform .9s cubic-bezier(0.22,1,0.36,1)}
        .rk-rev[data-in="true"]{opacity:1;transform:none}
        .rk-kb{animation:rk-kb 26s ease-in-out infinite alternate;transform-origin:center}
        @keyframes rk-kb{from{transform:scale(1.02)}to{transform:scale(1.12)}}
        .rk-screen{mix-blend-mode:screen}
        .rk-neonglow{animation:rk-neon 5.5s ease-in-out infinite}
        @keyframes rk-neon{0%,100%{opacity:1}47%{opacity:.94}49%{opacity:.8}51%{opacity:.96}}
        .rk-cta{transition:transform .25s ease,opacity .25s ease,background .25s ease}
        .rk-cta:hover{transform:translateY(-2px);opacity:.92}
        .rk-nav{transition:background .4s ease,backdrop-filter .4s ease,border-color .4s ease}
        .rk-ul{background-image:linear-gradient(${ACCENT_HI},${ACCENT_HI});background-size:0% 1px;background-repeat:no-repeat;background-position:0 100%;transition:background-size .35s ease;padding-bottom:2px}
        .rk-ul:hover{background-size:100% 1px}
        .rk-row{transition:background .3s ease,padding .3s ease}
        .rk-card{transition:transform .4s cubic-bezier(0.22,1,0.36,1),border-color .4s ease,background .4s ease}
        .rk-card:hover{transform:translateY(-4px);border-color:${HAIR_HI};background:#211E1B}
        .rk-root :focus-visible{outline:2px solid ${ACCENT_HI};outline-offset:3px}
        @media (prefers-reduced-motion: reduce){
          .rk-root *,.rk-root *::before,.rk-root *::after{transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}
          .rk-rev{opacity:1;transform:none}
          .rk-kb{animation:none}
        }
      `}</style>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="rk-nav fixed inset-x-0 top-0 z-50 border-b" style={{ background: scrolled ? 'rgba(12,11,10,0.82)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderColor: scrolled ? HAIR : 'transparent' }}>
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-4 md:px-8 md:py-5">
          <a href="#top" className="text-xl md:text-2xl" style={{ fontFamily: DISPLAY, color: INK }}>
            Björns <span style={{ color: ACCENT_HI }}>&amp;</span> Kjartans
          </a>
          <nav className="hidden items-center gap-9 text-[13px] tracking-[0.02em] md:flex" style={{ fontFamily: SANS_MED, color: MUT }} aria-label="Valmynd">
            <a href="#saga" className="rk-ul" style={{ color: INK }}>Sagan</a>
            <a href="#verd" className="rk-ul" style={{ color: INK }}>Verðskrá</a>
            <a href="#rakarar" className="rk-ul" style={{ color: INK }}>Rakararnir</a>
            <a href="#heimsokn" className="rk-ul" style={{ color: INK }}>Heimsókn</a>
          </nav>
          <Cta href={NOONA}>Bóka tíma</Cta>
        </div>
      </header>

      {/* ── Hero — headline left, neon sign right (scroll-parallaxed) ─────── */}
      <section id="top" ref={heroRef} className="relative flex min-h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1280px] items-center gap-8 px-5 pt-28 pb-16 md:px-8 md:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          {/* headline — left */}
          <Reveal className="order-2 lg:order-1">
            <p className="flex items-center gap-3 text-[11px] tracking-[0.26em] uppercase md:text-[12px]" style={{ fontFamily: MONO, color: ACCENT_HI }}>
              <span className="inline-block h-px w-8" style={{ background: ACCENT_HI }} />
              Rakarastofa · Selfoss · síðan 1948
            </p>
            <h1 className="mt-6 text-[clamp(2.7rem,6.4vw,5.4rem)] leading-[0.98]" style={{ fontFamily: DISPLAY, color: INK, fontWeight: 400, letterSpacing: '-0.01em' }}>
              {HERO.line1} <span style={{ fontStyle: 'italic' }}>{HERO.line2}</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed" style={{ color: MUT }}>
              {HERO.sub}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Cta href={NOONA}>Bóka tíma á Noona</Cta>
              <a href="#verd" className="rk-ul text-[13px] tracking-[0.06em] uppercase" style={{ fontFamily: SANS_BOLD, color: INK }}>
                Sjá verðskrá
              </a>
            </div>
          </Reveal>

          {/* neon sign — right, scroll-parallaxed */}
          <div className="order-1 lg:order-2">
            <Reveal delay={120}>
              <div ref={signRef} className="will-change-transform">
                <Shot
                  src={IMG.hero}
                  alt="Neon skilti Rakarastofunnar Björns og Kjartans"
                  className="mx-auto aspect-square w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[560px]"
                  imgClassName="rk-neonglow"
                  screen
                  contain
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Intro ───────────────────────────────────────────────────────── */}
      <section className="border-t" style={{ background: BG, borderColor: HAIR }}>
        <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32">
          <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-20">
            <Reveal>
              <h2 className="text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.1]" style={{ fontFamily: DISPLAY, color: INK, fontWeight: 400 }}>
                Herraklipping og skegg, á sama stað í hjarta Selfoss.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="max-w-md text-lg leading-relaxed" style={{ color: MUT }}>
                Rótgróin rakarastofa með sömu handtökin kynslóð fram af kynslóð. Bókaðu tíma á Noona eða líttu við, kaffi á könnunni og gamla góða rakarastofustemningin á sínum stað.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
                {[['Síðan', '1948'], ['Rakarar', '6'], ['Selfoss', 'Austurvegur 4']].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: MUT2 }}>{k}</p>
                    <p className="mt-1 text-2xl" style={{ fontFamily: DISPLAY, color: INK }}>{v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Statement band ──────────────────────────────────────────────── */}
      <section className="border-t" style={{ background: BG_DEEP, borderColor: HAIR }}>
        <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-36">
          <Reveal>
            <p className="text-[12px] tracking-[0.26em] uppercase" style={{ fontFamily: MONO, color: ACCENT_HI }}>Handverkið</p>
            <p className="mt-6 max-w-3xl text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1.1]" style={{ fontFamily: DISPLAY, color: INK, fontWeight: 400 }}>
              Sömu hendur, sama alúð, <span style={{ fontStyle: 'italic' }}>klippt eftir þér.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Verðskrá ────────────────────────────────────────────────────── */}
      <section id="verd" className="scroll-mt-24 border-t" style={{ background: BG, borderColor: HAIR }}>
        <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[12px] tracking-[0.26em] uppercase" style={{ fontFamily: MONO, color: ACCENT_HI }}>Verðskrá</p>
                <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02]" style={{ fontFamily: DISPLAY, color: INK, fontWeight: 400 }}>Þjónusta</h2>
              </div>
              <span className="text-[11px] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: MUT2 }}>Sýnishorn · staðfestist á stofunni</span>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-x-16 md:grid-cols-2">
            {SERVICES.map((s, i) => (
              <Reveal key={s.name} delay={(i % 2) * 80}>
                <div className="rk-row flex items-baseline gap-5 border-t py-6" style={{ borderColor: HAIR }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl" style={{ fontFamily: SANS_MED, color: INK }}>{s.name}</p>
                    <p className="mt-1 text-sm" style={{ color: MUT }}>{s.note}</p>
                  </div>
                  <p className="shrink-0 text-2xl" style={{ fontFamily: DISPLAY, color: INK }}>{s.price}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-12 flex flex-wrap items-center gap-5">
              <Cta href={NOONA}>Bóka tíma</Cta>
              <span className="text-sm" style={{ fontFamily: MONO, color: MUT2 }}>Einnig velkomið að líta við.</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Rakararnir ──────────────────────────────────────────────────── */}
      <section id="rakarar" className="scroll-mt-24 border-t" style={{ background: BG_DEEP, borderColor: HAIR }}>
        <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <p className="text-[12px] tracking-[0.26em] uppercase" style={{ fontFamily: MONO, color: ACCENT_HI }}>Teymið</p>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02]" style={{ fontFamily: DISPLAY, color: INK, fontWeight: 400 }}>Rakararnir</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BARBERS.map((b, i) => (
              <Reveal key={b.name} delay={(i % 3) * 80}>
                <div className="rk-card flex h-full items-start justify-between gap-4 rounded-xl border p-6" style={{ borderColor: HAIR, background: SURFACE }}>
                  <div>
                    <p className="text-lg leading-tight" style={{ fontFamily: SANS_BOLD, color: INK }}>{b.name}</p>
                    <p className="mt-1.5 text-[13px]" style={{ fontFamily: MONO, color: b.owner ? ACCENT_HI : MUT }}>{b.role}</p>
                  </div>
                  <span className="text-2xl" style={{ fontFamily: DISPLAY, color: HAIR_HI }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sagan — the real 1948 photo ─────────────────────────────────── */}
      <section id="saga" className="scroll-mt-24 border-t" style={{ background: BG, borderColor: HAIR }}>
        <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
            <Reveal>
              <div className="relative overflow-hidden rounded-xl" style={{ border: `1px solid ${HAIR}` }}>
                <Shot src={IMG.heritage} alt="Gömul ljósmynd úr rakarastofunni, klipping um miðja síðustu öld" className="aspect-[4/5] w-full" imgClassName="grayscale" />
                <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(9,8,7,0.55), transparent 45%)' }} />
                <span className="absolute bottom-4 left-5 right-5 text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: MONO, color: MUT2 }}>
                  {STORY.caption}
                </span>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-[12px] tracking-[0.26em] uppercase" style={{ fontFamily: MONO, color: ACCENT_HI }}>Sagan</p>
              <p className="mt-4 text-[clamp(3.4rem,7vw,5.4rem)] leading-none" style={{ fontFamily: DISPLAY, color: INK, fontWeight: 400 }}>1948</p>
              <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.1]" style={{ fontFamily: DISPLAY, color: INK, fontWeight: 400 }}>
                {STORY.headline}
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed" style={{ color: MUT }}>{STORY.body}</p>
              <p className="mt-6 text-sm" style={{ fontFamily: MONO, color: MUT2 }}>Stofnuð 1948 af Gísla Sigurðssyni.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Heimsókn ────────────────────────────────────────────────────── */}
      <section id="heimsokn" className="scroll-mt-24 border-t" style={{ background: BG_DEEP, borderColor: HAIR }}>
        <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            <Reveal>
              <p className="text-[12px] tracking-[0.26em] uppercase" style={{ fontFamily: MONO, color: ACCENT_HI }}>Heimsókn</p>
              <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.04]" style={{ fontFamily: DISPLAY, color: INK, fontWeight: 400 }}>
                Austurvegur 4, Selfoss
              </h2>
              <div className="mt-8 max-w-md">
                <a href={MAPS} target="_blank" rel="noreferrer" className="rk-row flex items-baseline justify-between border-t py-4" style={{ borderColor: HAIR, fontFamily: SANS_MED, color: INK }}>
                  <span>{ADDRESS.street}</span>
                  <span className="text-sm" style={{ fontFamily: MONO, color: MUT }}>{ADDRESS.town}</span>
                </a>
                <a href={PHONE_HREF} className="rk-row flex items-baseline justify-between border-t py-4" style={{ borderColor: HAIR, fontFamily: SANS_MED, color: INK }}>
                  <span>Sími</span>
                  <span className="text-sm" style={{ fontFamily: MONO, color: MUT }}>{PHONE_DISPLAY}</span>
                </a>
                <a href={`mailto:${EMAIL}`} className="rk-row flex items-baseline justify-between border-t border-b py-4" style={{ borderColor: HAIR, fontFamily: SANS_MED, color: INK }}>
                  <span>Netfang</span>
                  <span className="text-sm" style={{ fontFamily: MONO, color: MUT }}>{EMAIL}</span>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Cta href={NOONA}>Bóka tíma</Cta>
                <a href={FACEBOOK} target="_blank" rel="noreferrer" className="rk-ul text-[13px] tracking-[0.06em] uppercase" style={{ fontFamily: SANS_BOLD, color: INK }}>Facebook</a>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="rounded-xl border p-8" style={{ borderColor: HAIR, background: SURFACE }}>
                <p className="text-[12px] tracking-[0.26em] uppercase" style={{ fontFamily: MONO, color: MUT2 }}>Opnunartími</p>
                <div className="mt-5">
                  {HOURS.map((h) => (
                    <div key={h.day} className="flex items-baseline justify-between border-t py-4" style={{ borderColor: HAIR }}>
                      <span style={{ fontFamily: SANS_MED, color: INK }}>{h.day}</span>
                      <span className="text-sm" style={{ fontFamily: MONO, color: h.time === 'Lokað' ? MUT2 : INK }}>{h.time}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-relaxed" style={{ color: MUT }}>
                  Bókaðu tíma á Noona eða líttu við á opnunartíma, kaffi á könnunni.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <PreviewFooter company={company} />

      {/* ── Mobile sticky CTA ───────────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t p-3 md:hidden" style={{ background: 'rgba(12,11,10,0.92)', backdropFilter: 'blur(10px)', borderColor: HAIR }}>
        <a href={NOONA} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center rounded-full px-5 py-3.5 text-[13px] tracking-[0.06em] uppercase" style={{ background: INK, color: BG_DEEP, fontFamily: SANS_BOLD }}>
          Bóka tíma
        </a>
        <a href={PHONE_HREF} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border" style={{ borderColor: HAIR_HI, color: INK }} aria-label="Hringja í rakarastofuna">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
        </a>
      </div>

      <PreviewChrome company={company} />
    </div>
  )
}
