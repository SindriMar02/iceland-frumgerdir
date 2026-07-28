import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADVICE, AFTER_CLOSE, ASK_CHIPS, ASK_ENDPOINT, ASK_FACTS, ASK_FALLBACK, ASK_INTRO, EMAIL, EMAIL_HREF,
  HOURS_NOTE, JSON_LD, KENNITALA, LEGAL_NAME, NAV, ONCALL_FROM, PHONE_DISPLAY, PHONE_HREF,
  PLACES, PLACE_NOTE, PRICES, PRICE_NOTES, PRICE_SURCHARGE, TRAUMA_NOTE, TRIAGE,
  URGENT_INTRO, URGENT_NOW, URGENT_WAIT, WEEK,
} from './data'

const company = getPreviewCompany('tannlaeknavaktin')

/* ── TANNLÆKNAVAKTIN · "VAKTIN" ───────────────────────────────────────────
   The concept comes out of their own logo. Their mark sets a tooth inside
   square BRACKETS, and `[ ]` is interval notation — the notation for a span
   with a start and an end. This business is a time interval. So:

     · the page reads the real clock and answers "eru þið opin núna" in the
       hero, before anyone scrolls or asks
     · its ground follows the actual time of day (paper by day, dark at night)
       so the page looks the way the world looks when you need it
     · every span on the page is set in brackets: [ 08:00 · 22:00 ]

   Deliberate deviation from the house motion rule: there is NO entrance
   animation above the fold. The user of an emergency service is in pain, on a
   phone, one-handed. Nothing may sit between them and the answer. All
   choreography lives below the fold.

   NO PHOTOGRAPHY EXISTS for this business (checked: their site, já.is, the
   Joomla /images/ folder). The page is MARK-LED instead — their bracket, their
   red, their own decay diagram redrawn as clean SVG. Same route as Prentverk's
   registration marks and Fischersetur's board.

   PALETTE — red sampled from the actual logo pixels (#E70104, 16.5k px of it).
   Contrast, computed:
     INK   #141110 on PAPER #F4F1EC = 15.9:1   ·  PAPER on NIGHT #0C0B0B = 17.4:1
     RED   #E70104 on PAPER = 4.23:1  → large/display + fills ONLY
     REDINK #C00003 on PAPER = 5.75:1 → small red text on light  (AA)
     REDLIFT #FF5A5C on NIGHT = 6.41:1 → small red text on dark  (AA)
     WHITE on RED #E70104 = 4.77:1    → the call button           (AA)
   ────────────────────────────────────────────────────────────────────────── */

const RED = '#E70104'
const REDINK = '#C00003'
const REDLIFT = '#FF5A5C'

const PAPER = '#F4F1EC'
const PAPER_INK = '#141110'
const NIGHT = '#0C0B0B'
const NIGHT_INK = '#F2EFEA'

const DISPLAY = "'Space Grotesk', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, monospace"

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E70104] focus-visible:ring-offset-[var(--tlv-bg)]'

type Phase = 'day' | 'night'

interface Skin {
  bg: string
  ink: string
  soft: string
  mute: string
  hair: string
  panel: string
  redText: string
}

const SKINS: Record<Phase, Skin> = {
  day: {
    bg: PAPER,
    ink: PAPER_INK,
    soft: 'rgba(20,17,16,.72)',
    mute: 'rgba(20,17,16,.50)',
    hair: 'rgba(20,17,16,.16)',
    panel: 'rgba(20,17,16,.04)',
    redText: REDINK,
  },
  night: {
    bg: NIGHT,
    ink: NIGHT_INK,
    soft: 'rgba(242,239,234,.74)',
    mute: 'rgba(242,239,234,.52)',
    hair: 'rgba(242,239,234,.18)',
    panel: 'rgba(242,239,234,.05)',
    redText: REDLIFT,
  },
}

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const pad = (n: number) => String(n).padStart(2, '0')
const hhmm = (h: number) => `${pad(h)}:00`

/* ── clock state ──────────────────────────────────────────────────────── */

interface Status {
  phase: Phase
  open: boolean
  onCall: boolean
  today: (typeof WEEK)[number]
  next: (typeof WEEK)[number]
  clock: string
  closesAt: string
  opensAt: string
  opensLabel: string
  /** 0 to 1 across today's opening interval */
  progress: number
}

function readStatus(d: Date): Status {
  const dow = d.getDay()
  const h = d.getHours()
  const m = d.getMinutes()
  const today = WEEK.find((w) => w.day === dow) ?? WEEK[0]
  const decimal = h + m / 60
  const open = decimal >= today.open && decimal < today.close
  const weekend = dow === 0 || dow === 6
  const onCall = open && (weekend || h >= ONCALL_FROM)

  // the next day that opens, for the closed state
  const beforeOpen = decimal < today.open
  const nextIdx = beforeOpen ? dow : (dow + 1) % 7
  const next = WEEK.find((w) => w.day === nextIdx) ?? WEEK[0]

  return {
    // the ground follows the light, not the opening hours: bright working day,
    // dark evening and night. 8 to 17 reads as day in Reykjavík year round.
    phase: h >= 8 && h < 17 ? 'day' : 'night',
    open,
    onCall,
    today,
    next,
    clock: `${pad(h)}:${pad(m)}`,
    closesAt: hhmm(today.close),
    opensAt: hhmm(next.open),
    opensLabel: beforeOpen ? 'í dag' : dow === next.day ? 'í dag' : 'á morgun',
    progress: Math.max(
      0,
      Math.min(1, (decimal - today.open) / (today.close - today.open)),
    ),
  }
}

/* ── the bracketed mark, redrawn from their real logo ─────────────────── */

function Mark({ size = 30, color = RED }: { size?: number; color?: string }) {
  return (
    <svg
      viewBox="0 0 132 132"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block' }}
    >
      <path
        d="M34 10H12v112h22"
        fill="none"
        stroke={color}
        strokeWidth="13"
        strokeLinecap="square"
      />
      <path
        d="M98 10h22v112H98"
        fill="none"
        stroke={color}
        strokeWidth="13"
        strokeLinecap="square"
      />
      <path
        d="M66 18c-19 0-30 12-30 32 0 19 6 34 10 54 2 11 12 13 14 2l5-29c1-6 8-6 9 0l5 29c2 11 12 9 14-2 4-20 10-35 10-54 0-20-11-32-30-32Z"
        fill={color}
      />
      <path
        d="M59 44h6v-6h6v6h6v6h-6v6h-6v-6h-6z"
        fill="#fff"
        transform="rotate(45 66 50)"
      />
    </svg>
  )
}

/* ── scroll reveal: IntersectionObserver + CSS transition ─────────────────
   Never framer whileInView (ledger #7/#12/#36a) and never on the hero. The
   observer sits on an untransformed wrapper; the child does the moving. */

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) {
      setShown(true)
      return
    }
    // already on screen at mount? show without waiting for a crossing
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      <div
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translate3d(0,18px,0)',
          transition: `opacity .62s cubic-bezier(.22,.61,.36,1) ${delay}ms, transform .62s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* ── bracketed label, the page's core typographic device ──────────────── */

function Bracket({
  children,
  color,
  size = 'sm',
}: {
  children: React.ReactNode
  color: string
  size?: 'sm' | 'lg'
}) {
  return (
    <span
      style={{
        fontFamily: MONO,
        color,
        letterSpacing: size === 'lg' ? '.02em' : '.12em',
        fontSize: size === 'lg' ? 'inherit' : '.72rem',
        textTransform: size === 'lg' ? 'none' : 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true" style={{ opacity: 0.55 }}>
        [
      </span>
      <span style={{ padding: '0 .5em' }}>{children}</span>
      <span aria-hidden="true" style={{ opacity: 0.55 }}>
        ]
      </span>
    </span>
  )
}

/* ── the tooth diagram, redrawn from their own skemmd2 illustration ────── */

function ToothDiagram({ skin }: { skin: Skin }) {
  const enamel = skin.bg === PAPER ? '#FFFFFF' : '#26221F'
  const dentin = skin.bg === PAPER ? 'rgba(20,17,16,.10)' : 'rgba(242,239,234,.12)'
  return (
    <svg
      viewBox="0 0 300 330"
      className="w-full h-auto"
      role="img"
      aria-label="Skýringarmynd af tönn sem sýnir tannskemmd, skemmd í taug og sýkingu við tannrót."
      style={{ maxWidth: 340 }}
    >
      <path
        d="M150 26c-46 0-72 28-72 76 0 45 15 81 24 129 5 26 29 31 34 5l12-70c3-15 19-15 22 0l12 70c5 26 29 21 34-5 9-48 24-84 24-129 0-48-26-76-72-76Z"
        fill={enamel}
        stroke={skin.ink}
        strokeWidth="3"
      />
      <path
        d="M150 62c-30 0-46 18-46 48 0 32 11 58 17 92 3 17 15 20 18 3l10-52c3-16 19-16 22 0l10 52c3 17 15 14 18-3 6-34 17-60 17-92 0-30-16-48-46-48Z"
        fill={dentin}
        stroke="none"
      />
      {/* the decay, their word: tannskemmd */}
      <path
        d="M116 68c14-10 34-12 52-6 6 2 5 12-2 13-16 3-28 8-38 16-6 5-16-1-12-9 0-6 0-11 0-14Z"
        fill={RED}
      />
      {/* the nerve, running to the root */}
      <path
        d="M150 96v96"
        stroke={RED}
        strokeWidth="7"
        strokeLinecap="round"
        opacity=".92"
      />
      <path d="M150 192c-4 22-8 34-10 46" stroke={RED} strokeWidth="5" strokeLinecap="round" opacity=".7" />
      <path d="M150 192c4 22 8 34 10 46" stroke={RED} strokeWidth="5" strokeLinecap="round" opacity=".7" />
      {/* the infection at the root tip */}
      <circle cx="140" cy="252" r="15" fill={RED} opacity=".28" />
      <circle cx="140" cy="252" r="7" fill={RED} />

      <g fontFamily={MONO} fontSize="12" fill={skin.soft}>
        <line x1="196" y1="76" x2="238" y2="76" stroke={skin.hair} strokeWidth="1.5" />
        <text x="244" y="80">tannskemmd</text>
        <line x1="162" y1="140" x2="238" y2="140" stroke={skin.hair} strokeWidth="1.5" />
        <text x="244" y="144">skemmd í taug</text>
        <line x1="128" y1="264" x2="238" y2="264" stroke={skin.hair} strokeWidth="1.5" />
        <text x="244" y="268">sýking</text>
      </g>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */

export default function TannlaeknavaktinPage() {
  // seeded SYNCHRONOUSLY so the state is never blank on first paint (Faxi lesson)
  const [status, setStatus] = useState<Status>(() => readStatus(new Date()))
  const [menu, setMenu] = useState(false)
  const skin = SKINS[status.phase]

  // keep the clock honest while the page sits open
  useEffect(() => {
    const t = window.setInterval(() => setStatus(readStatus(new Date())), 30000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    setThemeColor(skin.bg)
  }, [skin.bg])

  // lock scroll while the mobile menu is open
  useEffect(() => {
    if (!menu) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

  const vars = useMemo(
    () =>
      ({
        '--tlv-bg': skin.bg,
        '--tlv-ink': skin.ink,
        '--tlv-hair': skin.hair,
      }) as React.CSSProperties,
    [skin],
  )

  return (
    <div
      style={{
        ...vars,
        background: skin.bg,
        color: skin.ink,
        fontFamily: DISPLAY,
        transition: 'background-color 1.2s linear, color 1.2s linear',
        minHeight: '100vh',
      }}
    >
      <style>{`
        @keyframes tlv-pulse { 0%,100% { opacity:.9 } 50% { opacity:.35 } }
        @keyframes tlv-menu-in { from { opacity:0; transform: translate3d(0,-10px,0) } to { opacity:1; transform:none } }
        .tlv-dot { animation: tlv-pulse 2.4s ease-in-out infinite; }
        .tlv-menu { animation: tlv-menu-in .3s cubic-bezier(.22,.61,.36,1) both; }
        .tlv-link { position: relative; }
        .tlv-link::after {
          content:''; position:absolute; left:0; right:0; bottom:-4px; height:1px;
          background: currentColor; transform: scaleX(0); transform-origin: left;
          transition: transform .34s cubic-bezier(.22,.61,.36,1);
        }
        .tlv-link:hover::after, .tlv-link:focus-visible::after { transform: scaleX(1); }
        .tlv-row { transition: background-color .25s ease; }
        .tlv-row:hover { background: ${skin.panel}; }
        @media (prefers-reduced-motion: reduce) {
          .tlv-dot { animation: none !important; }
          .tlv-menu { animation: none !important; }
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <PreviewChrome company={company} />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: skin.bg,
          borderBottom: `1px solid ${skin.hair}`,
          transition: 'background-color 1.2s linear',
        }}
      >
        <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-5 py-3 sm:px-8">
          <a
            href="#top"
            className={`flex items-center gap-3 ${FOCUS}`}
            style={{ minHeight: 44 }}
            aria-label="Tannlæknavaktin, efst á síðu"
          >
            <Mark size={26} />
            <span
              className="text-[.9rem] sm:text-[1.02rem]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                letterSpacing: '-.02em',
                whiteSpace: 'nowrap',
              }}
            >
              tannlæknavaktin
            </span>
          </a>

          <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="Aðalvalmynd">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`tlv-link inline-flex items-center text-[.94rem] ${FOCUS}`}
                style={{ color: skin.soft, minHeight: 44 }}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <a
            href={PHONE_HREF}
            className={`ml-auto inline-flex shrink-0 items-center gap-2 px-3 text-[.82rem] sm:px-4 sm:text-[.92rem] lg:ml-0 ${FOCUS}`}
            style={{
              background: RED,
              color: '#fff',
              fontFamily: MONO,
              fontWeight: 700,
              paddingTop: 11,
              paddingBottom: 11,
              minHeight: 44,
              letterSpacing: '.01em',
              whiteSpace: 'nowrap',
            }}
            aria-label={`Hringja í ${PHONE_DISPLAY}`}
          >
            <span aria-hidden="true">☏</span>
            {PHONE_DISPLAY}
          </a>

          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-label={menu ? 'Loka valmynd' : 'Opna valmynd'}
            className={`grid h-11 w-11 shrink-0 place-items-center lg:hidden ${FOCUS}`}
            style={{ border: `1px solid ${skin.hair}` }}
          >
            <span className="relative block h-[14px] w-[20px]" aria-hidden="true">
              <span
                className="absolute left-0 block h-[2px] w-full"
                style={{
                  background: skin.ink,
                  top: menu ? 6 : 0,
                  transform: menu ? 'rotate(45deg)' : 'none',
                  transition: 'top .22s ease, transform .22s ease',
                }}
              />
              <span
                className="absolute left-0 block h-[2px] w-full"
                style={{
                  background: skin.ink,
                  bottom: menu ? 6 : 0,
                  transform: menu ? 'rotate(-45deg)' : 'none',
                  transition: 'bottom .22s ease, transform .22s ease',
                }}
              />
            </span>
          </button>
        </div>

        {menu && (
          <div
            className="tlv-menu border-t lg:hidden"
            style={{ borderColor: skin.hair, background: skin.bg }}
          >
            <nav className="mx-auto max-w-[1240px] px-5 py-3 sm:px-8" aria-label="Valmynd">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenu(false)}
                  className={`flex items-center border-b py-3 text-[1.05rem] ${FOCUS}`}
                  style={{ borderColor: skin.hair, minHeight: 48 }}
                >
                  <span aria-hidden="true" style={{ color: RED, fontFamily: MONO, marginRight: 12 }}>
                    [
                  </span>
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main id="top">
        {/* ── HERO — the answer, instantly. No entrance animation. ──────── */}
        <section className="mx-auto max-w-[1240px] px-5 pb-14 pt-12 sm:px-8 sm:pt-16">
          <p
            style={{ fontFamily: MONO, color: skin.mute, fontSize: '.8rem', letterSpacing: '.14em' }}
            className="uppercase"
          >
            Bráðaþjónusta vegna tannlækninga í Reykjavík
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span
              className="tlv-dot inline-block shrink-0 rounded-full"
              style={{
                width: 13,
                height: 13,
                background: status.open ? RED : skin.mute,
              }}
              aria-hidden="true"
            />
            <h1
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                letterSpacing: '-.035em',
                lineHeight: 1.02,
                fontSize: 'clamp(2.9rem, 10vw, 6.4rem)',
                margin: 0,
              }}
            >
              {status.open ? 'Opið núna.' : 'Lokað núna.'}
            </h1>
          </div>

          <p
            className="mt-6 max-w-[54ch]"
            style={{ fontSize: 'clamp(1.12rem, 2.4vw, 1.5rem)', lineHeight: 1.45, color: skin.soft }}
          >
            {status.open ? (
              <>
                Við lokum klukkan <strong style={{ color: skin.ink }}>{status.closesAt}</strong> í dag.{' '}
                {status.onCall
                  ? 'Tannlæknir er á bakvakt. Um kvöld og helgar er 45.590 kr. álag á verðskrána.'
                  : 'Hringdu og fáðu tíma.'}
              </>
            ) : (
              <>
                Við opnum klukkan <strong style={{ color: skin.ink }}>{status.opensAt}</strong>{' '}
                {status.opensLabel}. Í neyðartilvikum er bent á að hafa samband við{' '}
                <strong style={{ color: skin.ink }}>112</strong>.
              </>
            )}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={PHONE_HREF}
              className={`inline-flex items-center gap-3 ${FOCUS}`}
              style={{
                background: RED,
                color: '#fff',
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 'clamp(1.05rem, 2.6vw, 1.32rem)',
                padding: '17px 30px',
                minHeight: 56,
                letterSpacing: '-.01em',
              }}
            >
              Hringja í {PHONE_DISPLAY}
            </a>
            <a
              href="#spyrja"
              className={`inline-flex items-center ${FOCUS}`}
              style={{
                border: `1px solid ${skin.hair}`,
                color: skin.ink,
                fontFamily: DISPLAY,
                fontWeight: 500,
                fontSize: 'clamp(1.02rem, 2.4vw, 1.18rem)',
                padding: '16px 26px',
                minHeight: 56,
              }}
            >
              Spyrja vaktina
            </a>
          </div>

          <p className="mt-6" style={{ fontFamily: MONO, fontSize: '.86rem', color: skin.mute }}>
            Ávallt þarf að hafa samband símleiðis til tímapantana.
          </p>

          {/* the day rail — today's interval, with now marked */}
          <div className="mt-12" aria-hidden="true">
            <div className="flex items-baseline justify-between" style={{ fontFamily: MONO, fontSize: '.78rem', color: skin.mute }}>
              <span>{hhmm(status.today.open)}</span>
              <span style={{ color: status.open ? skin.redText : skin.mute }}>{status.clock}</span>
              <span>{hhmm(status.today.close)}</span>
            </div>
            <div className="relative mt-2 h-[3px] w-full" style={{ background: skin.hair }}>
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${status.progress * 100}%`,
                  background: status.open ? RED : skin.mute,
                  transition: 'width 1s linear, background-color .6s linear',
                }}
              />
            </div>
            <p className="mt-2" style={{ fontFamily: MONO, fontSize: '.74rem', color: skin.mute }}>
              {status.today.label} · bakvakt frá {hhmm(ONCALL_FROM)}
              {!status.open && ' · dagurinn liðinn'}
            </p>
          </div>
        </section>

        {/* ── TRIAGE LADDER ────────────────────────────────────────────── */}
        <section
          className="border-y"
          style={{ borderColor: skin.hair }}
          aria-labelledby="triage-h"
        >
          <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
            <Reveal>
              <h2
                id="triage-h"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 'clamp(1.9rem, 5vw, 3.1rem)',
                  letterSpacing: '-.03em',
                  lineHeight: 1.08,
                }}
              >
                Hvað á að gera núna
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-px" style={{ background: skin.hair }}>
              {TRIAGE.map((t, i) => (
                <Reveal key={t.title} delay={i * 70}>
                  <div
                    className="tlv-row grid gap-4 p-6 sm:p-8 md:grid-cols-[190px_1fr_auto] md:items-start"
                    style={{ background: skin.bg }}
                  >
                    <div className="flex items-center gap-3">
                      <Bracket color={t.primary ? skin.redText : skin.mute}>{t.tag}</Bracket>
                    </div>

                    <div>
                      <h3
                        style={{
                          fontFamily: DISPLAY,
                          fontWeight: 700,
                          fontSize: 'clamp(1.3rem, 3vw, 1.75rem)',
                          letterSpacing: '-.02em',
                        }}
                      >
                        {t.title}
                      </h3>
                      <p className="mt-2 max-w-[52ch]" style={{ color: skin.soft, lineHeight: 1.5 }}>
                        {t.line}
                      </p>
                      <p className="mt-2" style={{ fontFamily: MONO, fontSize: '.8rem', color: skin.mute }}>
                        {t.note}
                      </p>
                    </div>

                    <a
                      href={t.href}
                      className={`inline-flex items-center self-center ${FOCUS}`}
                      style={{
                        background: t.primary ? RED : 'transparent',
                        color: t.primary ? '#fff' : skin.ink,
                        border: t.primary ? 'none' : `1px solid ${skin.hair}`,
                        fontFamily: t.primary ? DISPLAY : MONO,
                        fontWeight: t.primary ? 700 : 400,
                        fontSize: t.primary ? '1.05rem' : '.88rem',
                        padding: '14px 22px',
                        minHeight: 48,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t.action}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ASK / the receptionist ───────────────────────────────────── */}
        <AskSection skin={skin} />

        {/* ── IS THIS AN EMERGENCY ─────────────────────────────────────── */}
        <section
          id="bradatilvik"
          className="border-y scroll-mt-20"
          style={{ borderColor: skin.hair }}
          aria-labelledby="urgent-h"
        >
          <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-start lg:gap-20">
            <div>
              <Reveal>
                <Bracket color={skin.redText}>Bráðatilvik</Bracket>
                <h2
                  id="urgent-h"
                  className="mt-5"
                  style={{
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: 'clamp(1.9rem, 5vw, 3.1rem)',
                    letterSpacing: '-.03em',
                    lineHeight: 1.08,
                  }}
                >
                  Er þetta bráðatilvik?
                </h2>
                <p className="mt-5 max-w-[56ch]" style={{ color: skin.soft, lineHeight: 1.55, fontSize: '1.06rem' }}>
                  {URGENT_INTRO}
                </p>
              </Reveal>

              <Reveal delay={90}>
                <ul className="mt-9 grid gap-px sm:grid-cols-2" style={{ background: skin.hair }}>
                  {URGENT_NOW.map((u) => (
                    <li
                      key={u}
                      className="flex items-center gap-3 p-4"
                      style={{ background: skin.bg, fontSize: '1.02rem' }}
                    >
                      <span
                        aria-hidden="true"
                        style={{ color: RED, fontFamily: MONO, fontWeight: 700 }}
                      >
                        ×
                      </span>
                      {u}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={150}>
                <p className="mt-6" style={{ fontFamily: MONO, fontSize: '.86rem', color: skin.mute }}>
                  {URGENT_WAIT}
                </p>
                <p className="mt-5 max-w-[56ch]" style={{ color: skin.soft, lineHeight: 1.55 }}>
                  {TRAUMA_NOTE}
                </p>
              </Reveal>
            </div>

            <Reveal delay={120} className="lg:pt-4">
              <div
                className="flex justify-center p-8"
                style={{ border: `1px solid ${skin.hair}` }}
              >
                <ToothDiagram skin={skin} />
              </div>
              <p className="mt-3" style={{ fontFamily: MONO, fontSize: '.74rem', color: skin.mute }}>
                Skýringarmynd, byggð á mynd af vef Tannlæknavaktarinnar.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── HOURS ────────────────────────────────────────────────────── */}
        <section id="opnunartimi" className="scroll-mt-20" aria-labelledby="hours-h">
          <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-24">
            <Reveal>
              <Bracket color={skin.mute}>Opnunartími</Bracket>
              <h2
                id="hours-h"
                className="mt-5"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 'clamp(1.9rem, 5vw, 3.1rem)',
                  letterSpacing: '-.03em',
                  lineHeight: 1.08,
                }}
              >
                Vaktin, dag fyrir dag
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <ul className="mt-10">
                {WEEK.map((w) => {
                  const isToday = w.day === status.today.day
                  return (
                    <li
                      key={w.day}
                      className="tlv-row flex flex-wrap items-baseline justify-between gap-3 border-b py-4"
                      style={{
                        borderColor: skin.hair,
                        color: isToday ? skin.ink : skin.soft,
                      }}
                    >
                      <span className="flex items-center gap-3">
                        {isToday && (
                          <span
                            aria-hidden="true"
                            className="inline-block rounded-full"
                            style={{ width: 8, height: 8, background: RED }}
                          />
                        )}
                        <span
                          style={{
                            fontFamily: DISPLAY,
                            fontWeight: isToday ? 700 : 500,
                            fontSize: 'clamp(1.05rem, 2.6vw, 1.35rem)',
                          }}
                        >
                          {w.label}
                        </span>
                        {isToday && (
                          <span style={{ fontFamily: MONO, fontSize: '.72rem', color: skin.redText }}>
                            Í DAG
                          </span>
                        )}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 'clamp(1rem, 2.4vw, 1.2rem)' }}>
                        <span aria-hidden="true" style={{ opacity: 0.45 }}>[</span>
                        <span style={{ padding: '0 .55em' }}>
                          {hhmm(w.open)} · {hhmm(w.close)}
                        </span>
                        <span aria-hidden="true" style={{ opacity: 0.45 }}>]</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Reveal>

            <Reveal delay={130}>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <p style={{ fontFamily: MONO, fontSize: '.88rem', color: skin.soft, lineHeight: 1.6 }}>
                  {HOURS_NOTE}
                </p>
                <p style={{ fontFamily: MONO, fontSize: '.88rem', color: skin.soft, lineHeight: 1.6 }}>
                  {AFTER_CLOSE}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── PRICES ───────────────────────────────────────────────────── */}
        <section
          id="verd"
          className="border-y scroll-mt-20"
          style={{ borderColor: skin.hair }}
          aria-labelledby="price-h"
        >
          <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-24">
            <Reveal>
              <Bracket color={skin.mute}>Verðskrá</Bracket>
              <h2
                id="price-h"
                className="mt-5"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 'clamp(1.9rem, 5vw, 3.1rem)',
                  letterSpacing: '-.03em',
                  lineHeight: 1.08,
                }}
              >
                Hvað þetta kostar
              </h2>
            </Reveal>

            {/* the surcharge, said out loud before anyone picks up the phone */}
            <Reveal delay={70}>
              <div
                className="mt-9 grid gap-5 p-7 sm:p-9 md:grid-cols-[auto_1fr] md:items-center md:gap-10"
                style={{ background: RED, color: '#fff' }}
              >
                <div>
                  <p style={{ fontFamily: MONO, fontSize: '.78rem', letterSpacing: '.12em' }} className="uppercase">
                    {PRICE_SURCHARGE.label}
                  </p>
                  <p
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 700,
                      fontSize: 'clamp(2.4rem, 7vw, 4rem)',
                      letterSpacing: '-.04em',
                      lineHeight: 1,
                    }}
                    className="mt-2"
                  >
                    {PRICE_SURCHARGE.amount}
                  </p>
                </div>
                <p style={{ lineHeight: 1.55, fontSize: '1.04rem', color: 'rgba(255,255,255,.94)' }}>
                  {PRICE_SURCHARGE.body}
                </p>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <ul className="mt-10">
                {PRICES.map((p) => (
                  <li
                    key={p.item}
                    className="tlv-row flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-4"
                    style={{ borderColor: skin.hair }}
                  >
                    <span style={{ fontSize: '1.04rem' }}>{p.item}</span>
                    <span style={{ fontFamily: MONO, fontSize: '1rem', color: skin.soft }}>{p.price}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={150}>
              <ul className="mt-8 grid gap-3">
                {PRICE_NOTES.map((n) => (
                  <li
                    key={n}
                    className="flex gap-3"
                    style={{ fontFamily: MONO, fontSize: '.85rem', color: skin.mute, lineHeight: 1.6 }}
                  >
                    <span aria-hidden="true" style={{ color: skin.redText }}>·</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ── LOCATIONS ────────────────────────────────────────────────── */}
        <section id="stadsetning" className="scroll-mt-20" aria-labelledby="place-h">
          <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-24">
            <Reveal>
              <Bracket color={skin.mute}>Staðsetning</Bracket>
              <h2
                id="place-h"
                className="mt-5"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 'clamp(1.9rem, 5vw, 3.1rem)',
                  letterSpacing: '-.03em',
                  lineHeight: 1.08,
                }}
              >
                Hvar er opið í kvöld
              </h2>
              <p className="mt-5 max-w-[56ch]" style={{ color: skin.soft, fontSize: '1.06rem', lineHeight: 1.55 }}>
                {PLACE_NOTE}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-px sm:grid-cols-2" style={{ background: skin.hair }}>
              {PLACES.map((p, i) => (
                <Reveal key={p.address} delay={i * 80}>
                  <div className="h-full p-7 sm:p-9" style={{ background: skin.bg }}>
                    <p style={{ fontFamily: MONO, fontSize: '.76rem', color: skin.mute, letterSpacing: '.12em' }} className="uppercase">
                      Staður {i + 1} af 2
                    </p>
                    <h3
                      className="mt-4"
                      style={{
                        fontFamily: DISPLAY,
                        fontWeight: 700,
                        fontSize: 'clamp(1.5rem, 3.6vw, 2.1rem)',
                        letterSpacing: '-.025em',
                      }}
                    >
                      {p.address}
                    </h3>
                    <p className="mt-1" style={{ fontFamily: MONO, color: skin.soft }}>{p.postcode}</p>
                    <p className="mt-5" style={{ color: skin.soft, lineHeight: 1.55 }}>
                      <span style={{ color: skin.mute, fontFamily: MONO, fontSize: '.8rem' }}>
                        Tannlæknar
                        <br />
                      </span>
                      {p.dentists}
                    </p>
                    <p className="mt-4" style={{ fontFamily: MONO, fontSize: '.78rem', color: skin.mute, lineHeight: 1.6 }}>
                      {p.licence}
                    </p>
                    <a
                      href={p.maps}
                      target="_blank"
                      rel="noreferrer"
                      className={`tlv-link mt-6 inline-flex items-center ${FOCUS}`}
                      style={{ color: skin.redText, fontFamily: MONO, fontSize: '.88rem', minHeight: 44 }}
                    >
                      Opna í kortum
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ADVICE ───────────────────────────────────────────────────── */}
        <section className="border-t" style={{ borderColor: skin.hair }} aria-labelledby="advice-h">
          <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-24">
            <Reveal>
              <Bracket color={skin.mute}>Á meðan þú bíður</Bracket>
              <h2
                id="advice-h"
                className="mt-5"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 'clamp(1.9rem, 5vw, 3.1rem)',
                  letterSpacing: '-.03em',
                  lineHeight: 1.08,
                }}
              >
                Ráð við tannverk
              </h2>
            </Reveal>

            <div className="mt-11 grid gap-10 md:grid-cols-2 md:gap-x-14">
              {ADVICE.map((a, i) => (
                <Reveal key={a.n} delay={i * 60}>
                  <article>
                    <p style={{ fontFamily: MONO, fontSize: '.82rem', color: skin.redText }}>[ {a.n} ]</p>
                    <h3
                      className="mt-3"
                      style={{
                        fontFamily: DISPLAY,
                        fontWeight: 700,
                        fontSize: 'clamp(1.2rem, 2.8vw, 1.5rem)',
                        letterSpacing: '-.02em',
                      }}
                    >
                      {a.head}
                    </h3>
                    <p className="mt-3" style={{ color: skin.soft, lineHeight: 1.6 }}>{a.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <p
                className="mt-12 max-w-[62ch]"
                style={{ fontFamily: MONO, fontSize: '.85rem', color: skin.mute, lineHeight: 1.65 }}
              >
                Textinn hér að ofan er byggður á fræðsluefni Tannlæknavaktarinnar sjálfrar. Hann kemur
                ekki í staðinn fyrir greiningu tannlæknis. Sé tannverkur mikill og stöðugur þarf
                alltaf að leita til tannlæknis.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── CLOSER ───────────────────────────────────────────────────── */}
        <section
          style={{ background: status.phase === 'day' ? PAPER_INK : '#151211', color: NIGHT_INK }}
          aria-labelledby="closer-h"
        >
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <Mark size={44} color={RED} />
              <h2
                id="closer-h"
                className="mt-8"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 'clamp(2.1rem, 6.4vw, 4.2rem)',
                  letterSpacing: '-.035em',
                  lineHeight: 1.04,
                  maxWidth: '18ch',
                }}
              >
                {status.open ? 'Það er opið. Hringdu.' : 'Við opnum klukkan ' + status.opensAt + '.'}
              </h2>
              <a
                href={PHONE_HREF}
                className={`mt-9 inline-flex items-center ${FOCUS}`}
                style={{
                  background: RED,
                  color: '#fff',
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 'clamp(1.15rem, 3vw, 1.5rem)',
                  padding: '19px 34px',
                  minHeight: 60,
                }}
              >
                {PHONE_DISPLAY}
              </a>
              <p className="mt-8" style={{ fontFamily: MONO, fontSize: '.84rem', color: 'rgba(242,239,234,.56)', lineHeight: 1.7 }}>
                {LEGAL_NAME} · kt. {KENNITALA} · Skipholt 33, 105 Reykjavík
                <br />
                <a
                  href={EMAIL_HREF}
                  className={`tlv-link inline-flex items-center ${FOCUS}`}
                  style={{ color: REDLIFT, minHeight: 44 }}
                >
                  {EMAIL}
                </a>
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}

/* ── the receptionist demo ────────────────────────────────────────────── */

interface Turn {
  who: 'you' | 'vakt'
  text: string
}

function answerFor(q: string): string {
  const norm = q.toLowerCase()
  let best: { score: number; answer: string } | null = null
  for (const f of ASK_FACTS) {
    const score = f.match.reduce((acc, m) => (norm.includes(m) ? acc + 1 : acc), 0)
    if (score > 0 && (!best || score > best.score)) best = { score, answer: f.answer }
  }
  return best ? best.answer : ASK_FALLBACK
}

function AskSection({ skin }: { skin: Skin }) {
  const [turns, setTurns] = useState<Turn[]>([])
  const [value, setValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const logRef = useRef<HTMLDivElement | null>(null)

  /**
   * Ask the live Worker, fall back to the local grounded answers if it is
   * unreachable, slow or capped. The page must never show an error state:
   * someone in pain gets an answer either way.
   */
  const send = useCallback(
    async (qRaw: string) => {
      const q = qRaw.trim()
      if (!q) return
      setValue('')
      const history = [...turns, { who: 'you' as const, text: q }]
      setTurns(history)
      setThinking(true)

      let answer = ''
      const ctrl = new AbortController()
      const timer = window.setTimeout(() => ctrl.abort(), 9000)
      try {
        const res = await fetch(ASK_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: ctrl.signal,
          body: JSON.stringify({
            messages: history.map((t) => ({
              role: t.who === 'you' ? 'user' : 'assistant',
              content: t.text,
            })),
          }),
        })
        if (res.ok) answer = ((await res.json()) as { answer?: string }).answer || ''
      } catch {
        /* offline, aborted or blocked — fall through to the local answers */
      } finally {
        window.clearTimeout(timer)
      }

      setTurns((t) => [...t, { who: 'vakt', text: answer || answerFor(q) }])
      setThinking(false)
    },
    [turns],
  )

  useEffect(() => {
    if (turns.length && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [turns, thinking])

  return (
    <section id="spyrja" className="scroll-mt-20" aria-labelledby="ask-h">
      <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <Bracket color={skin.redText}>Spyrðu vaktina</Bracket>
          <h2
            id="ask-h"
            className="mt-5"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 'clamp(1.9rem, 5vw, 3.1rem)',
              letterSpacing: '-.03em',
              lineHeight: 1.08,
            }}
          >
            Spurning sem má ekki bíða eftir símtali
          </h2>
          <p className="mt-5 max-w-[56ch]" style={{ color: skin.soft, fontSize: '1.06rem', lineHeight: 1.55 }}>
            {ASK_INTRO}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-9" style={{ border: `1px solid ${skin.hair}` }}>
            <div
              ref={logRef}
              className="max-h-[380px] overflow-y-auto p-5 sm:p-7"
              role="log"
              aria-live="polite"
              aria-label="Samtal við vaktina"
            >
              {turns.length === 0 && (
                <p style={{ fontFamily: MONO, fontSize: '.86rem', color: skin.mute, lineHeight: 1.7 }}>
                  Veldu spurningu hér að neðan eða skrifaðu þína eigin.
                </p>
              )}

              {turns.map((t, i) => (
                <div key={i} className={i > 0 ? 'mt-5' : ''}>
                  <p
                    style={{
                      fontFamily: MONO,
                      fontSize: '.72rem',
                      letterSpacing: '.1em',
                      color: t.who === 'you' ? skin.mute : skin.redText,
                    }}
                    className="uppercase"
                  >
                    {t.who === 'you' ? 'Þú' : 'Vaktin'}
                  </p>
                  <p
                    className="mt-1.5"
                    style={{
                      color: t.who === 'you' ? skin.ink : skin.soft,
                      lineHeight: 1.6,
                      fontSize: t.who === 'you' ? '1.08rem' : '1rem',
                      maxWidth: '62ch',
                    }}
                  >
                    {t.text}
                  </p>
                </div>
              ))}

              {thinking && (
                <p className="mt-5" style={{ fontFamily: MONO, fontSize: '.86rem', color: skin.mute }}>
                  <span className="tlv-dot">skrifar…</span>
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(value)
              }}
              className="flex gap-2 border-t p-3"
              style={{ borderColor: skin.hair }}
            >
              <label htmlFor="tlv-ask" className="sr-only">
                Spurningin þín
              </label>
              <input
                id="tlv-ask"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Skrifaðu spurningu"
                className={`flex-1 bg-transparent px-3 ${FOCUS}`}
                style={{
                  color: skin.ink,
                  fontFamily: DISPLAY,
                  fontSize: '1.02rem',
                  minHeight: 48,
                  border: 'none',
                }}
              />
              <button
                type="submit"
                className={FOCUS}
                style={{
                  background: RED,
                  color: '#fff',
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  padding: '0 22px',
                  minHeight: 48,
                }}
              >
                Senda
              </button>
            </form>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ul className="mt-5 flex flex-wrap gap-2">
            {ASK_CHIPS.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => send(c)}
                  className={`inline-flex items-center ${FOCUS}`}
                  style={{
                    border: `1px solid ${skin.hair}`,
                    color: skin.soft,
                    fontFamily: MONO,
                    fontSize: '.85rem',
                    padding: '11px 15px',
                    minHeight: 44,
                  }}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
