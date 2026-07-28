import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADVICE, AFTER_CLOSE, ASK_CHIPS, ASK_ENDPOINT, ASK_FACTS, ASK_FALLBACK, EMAIL, EMAIL_HREF,
  HOURS_NOTE, IMG, JSON_LD, KENNITALA, LEGAL_NAME, NAV, ONCALL_FROM, PHONE_DISPLAY, PHONE_HREF,
  PLACES, PLACE_NOTE, PRICES, PRICE_NOTES, PRICE_SURCHARGE, TRAUMA_NOTE, TRIAGE,
  URGENT_INTRO, URGENT_NOW, URGENT_WAIT, WEEK,
} from './data'

const company = getPreviewCompany('tannlaeknavaktin')

/* ── TANNLÆKNAVAKTIN v2 · "LÉTTIRINN" ─────────────────────────────────────
   v1 was rejected: too dark for a dental clinic, no photography, no motion,
   "generic ai slop template". This is the rebuild.

   WHAT CHANGED
     · BRIGHT at every hour. The live clock state stays (it was the good idea)
       but the ground is warm bone all day and night.
     · Photography leads. The art direction is RELIEF, not teeth: the emotional
       truth of an emergency dental service is the moment the pain stops. No
       dental cliché, no stock grin, and honest because it depicts no real
       premises and no real staff (disclosed in the footer).
     · A real scroll engine: Lenis + one damped rAF writing --rv per element,
       driving scrubbed clip-path media reveals and content rises. Reversible.
     · SIGNATURE = the day dial. Drag across the day and the price answers
       back, because their one genuinely confusing fact is that after 16:00 a
       45.590 kr call-out charge lands on top of the price list. An interaction
       class, not a scroll-drawn line.
     · The assistant is a floating bubble in the corner, per Sindri's call.

   KEPT: every verified fact, the bracket [ ] device from their real logo, and
   brand red #E70104 sampled from the logo pixels.

   CONTRAST (computed):
     INK #1B1613 on BONE #FBF7F1 = 15.7:1 · on SAND #F3E9DB = 14.2:1
     REDINK #C00003 on BONE = 5.8:1 (small text)  · WHITE on RED = 4.8:1
     GREEN #1F7A4D on BONE = 4.6:1 (the open indicator)
   ────────────────────────────────────────────────────────────────────────── */

const RED = '#E70104'
const REDINK = '#C00003'
const GREEN = '#1F7A4D'
const BONE = '#FBF7F1'
const SAND = '#F3E9DB'
const INK = '#1B1613'
const SOFT = 'rgba(27,22,19,.70)'
const MUTE = 'rgba(27,22,19,.48)'
const HAIR = 'rgba(27,22,19,.14)'

const DISPLAY = "'Chillax', system-ui, sans-serif"
const BODY = "'Hanken Grotesk', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, monospace"

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C00003] focus-visible:ring-offset-[#FBF7F1]'

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const pad = (n: number) => String(n).padStart(2, '0')
const hhmm = (h: number) => `${pad(h)}:00`

/* ── the scroll engine ────────────────────────────────────────────────────
   ONE rAF loop. Reads every registered element's rect, damps toward the
   target, writes a single --rv (0 to 1) custom property. CSS does all the
   geometry. Scrubbed and reversible: scroll back up and values fall again.
   Batches every READ before every WRITE so style never invalidates mid-pass. */

function useScrollEngine() {
  useEffect(() => {
    if (reduced()) {
      document.querySelectorAll<HTMLElement>('[data-rv]').forEach((el) =>
        el.style.setProperty('--rv', '1'),
      )
      return
    }

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    const cur = new WeakMap<HTMLElement, number>()
    let raf = 0
    let last = performance.now()

    const frame = (now: number) => {
      lenis.raf(now)
      const dt = Math.min(64, now - last) / 1000
      last = now

      const els = Array.from(document.querySelectorAll<HTMLElement>('[data-rv]'))
      const vh = window.innerHeight

      // READ pass
      const targets = els.map((el) => {
        const r = el.getBoundingClientRect()
        const start = vh * 0.92
        const end = vh * 0.35
        const t = (start - r.top) / Math.max(1, start - end)
        return Math.max(0, Math.min(1, t))
      })

      // WRITE pass
      els.forEach((el, i) => {
        const tgt = targets[i]
        const prev = cur.get(el) ?? 0
        const tau = 0.16
        let next = prev + (tgt - prev) * (1 - Math.exp(-dt / tau))
        if (Math.abs(tgt - next) < 0.001) next = tgt
        if (next !== prev) {
          cur.set(el, next)
          el.style.setProperty('--rv', next.toFixed(4))
        }
      })

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
}

/* ── clock ────────────────────────────────────────────────────────────── */

interface Status {
  open: boolean
  onCall: boolean
  today: (typeof WEEK)[number]
  next: (typeof WEEK)[number]
  clock: string
  closesAt: string
  opensAt: string
  opensLabel: string
  progress: number
}

function readStatus(d: Date): Status {
  const dow = d.getDay()
  const h = d.getHours()
  const m = d.getMinutes()
  const today = WEEK.find((w) => w.day === dow) ?? WEEK[0]
  const dec = h + m / 60
  const open = dec >= today.open && dec < today.close
  const weekend = dow === 0 || dow === 6
  const beforeOpen = dec < today.open
  const nextIdx = beforeOpen ? dow : (dow + 1) % 7
  const next = WEEK.find((w) => w.day === nextIdx) ?? WEEK[0]
  return {
    open,
    onCall: open && (weekend || h >= ONCALL_FROM),
    today,
    next,
    clock: `${pad(h)}:${pad(m)}`,
    closesAt: hhmm(today.close),
    opensAt: hhmm(next.open),
    opensLabel: beforeOpen ? 'í dag' : 'á morgun',
    progress: Math.max(0, Math.min(1, (dec - today.open) / (today.close - today.open))),
  }
}

/* ── the bracketed mark, redrawn from their real logo ─────────────────── */

function Mark({ size = 30, color = RED }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 132 132" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <path d="M34 10H12v112h22" fill="none" stroke={color} strokeWidth="13" strokeLinecap="square" />
      <path d="M98 10h22v112H98" fill="none" stroke={color} strokeWidth="13" strokeLinecap="square" />
      <path
        d="M66 18c-19 0-30 12-30 32 0 19 6 34 10 54 2 11 12 13 14 2l5-29c1-6 8-6 9 0l5 29c2 11 12 9 14-2 4-20 10-35 10-54 0-20-11-32-30-32Z"
        fill={color}
      />
      <path d="M59 44h6v-6h6v6h6v6h-6v6h-6v-6h-6z" fill="#fff" transform="rotate(45 66 50)" />
    </svg>
  )
}

/* ── primitives ───────────────────────────────────────────────────────── */

/** Content rise, scrubbed off --rv. */
function Rise({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  return (
    <Tag
      data-rv
      className={`tlv-rise ${className}`}
      style={{ '--d': delay } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}

/**
 * Scrubbed media reveal. An off-axis feathered mask sweep plus blur and
 * saturation falling away on the same --rv, so the frame resolves out of
 * softness like a print coming up rather than being uncovered by a scanline
 * (ledger #52). Image is oversized on both axes so blur cannot pull
 * transparency in at the edges, with max-width:none so the reset can't
 * clamp it back (ledger #57).
 */
function Plate({
  src,
  alt,
  ratio = '16 / 9',
  className = '',
  priority = false,
}: {
  src: string
  alt: string
  ratio?: string
  className?: string
  priority?: boolean
}) {
  return (
    <div data-rv className={`tlv-plate ${className}`} style={{ aspectRatio: ratio }}>
      {/* no inline height here: the CSS sets width AND height for the oversized
          absolutely-positioned cover image. An inline height:auto would win and
          collapse it to its intrinsic ratio, leaving a band of bare panel. */}
      <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
    </div>
  )
}

function Bracket({ children, color = MUTE }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ fontFamily: MONO, color, fontSize: '.72rem', letterSpacing: '.14em' }} className="uppercase">
      <span aria-hidden="true" style={{ opacity: 0.5 }}>[</span>
      <span style={{ padding: '0 .55em' }}>{children}</span>
      <span aria-hidden="true" style={{ opacity: 0.5 }}>]</span>
    </span>
  )
}

function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      style={{
        fontFamily: DISPLAY,
        fontWeight: 600,
        fontSize: 'clamp(2rem, 5.2vw, 3.4rem)',
        letterSpacing: '-.025em',
        lineHeight: 1.06,
      }}
    >
      {children}
    </h2>
  )
}

/* ═══ WHEN THE SURCHARGE APPLIES ═════════════════════════════════════════
   This replaced an interactive price dial that was MISLEADING: it showed
   "9.200 kr." as the cost of coming at a given hour, but 9.200 is the price of
   a skoðun alone and a real emergency visit adds deyfing, röntgen, fylling. It
   also printed a 54.790 kr total that appears nowhere on their price list, and
   a slider implied you choose your arrival time when appointments are actually
   day-by-day by phone. Two plain states, no invented arithmetic. */

function WhenBand() {
  return (
    <section id="hvenaer" className="scroll-mt-24" aria-labelledby="when-h">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
        <Rise>
          <Bracket color={REDINK}>Verðið</Bracket>
          <H2 id="when-h">Hvenær þú kemur skiptir máli</H2>
          <p className="mt-5 max-w-[54ch]" style={{ color: SOFT, fontSize: '1.08rem', lineHeight: 1.62 }}>
            Eftir klukkan 16 á virkum dögum, og allar helgar, þarf að kalla út tannlækni á bakvakt.
            Þá bætist álag ofan á verðskrána.
          </p>
        </Rise>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Rise>
            <div className="h-full rounded-2xl bg-white p-8 sm:p-10" style={{ border: `1px solid ${HAIR}` }}>
              <p style={{ fontFamily: MONO, fontSize: '.76rem', letterSpacing: '.13em', color: GREEN }} className="uppercase">
                Dagvinnutími
              </p>
              <p className="mt-3" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(1.5rem, 3.6vw, 2.1rem)', letterSpacing: '-.025em', lineHeight: 1.15 }}>
                Verðskráin gildir óbreytt
              </p>
              <p className="mt-4" style={{ color: SOFT, lineHeight: 1.6 }}>
                Virka daga frá klukkan 8 til 16. Ekkert álag leggst ofan á.
              </p>
            </div>
          </Rise>

          <Rise delay={1}>
            <div className="h-full rounded-2xl p-8 sm:p-10" style={{ background: RED, color: '#fff' }}>
              <p style={{ fontFamily: MONO, fontSize: '.76rem', letterSpacing: '.13em', color: 'rgba(255,255,255,.85)' }} className="uppercase">
                Kvöld og helgar
              </p>
              <p className="mt-3" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.2rem, 6vw, 3.4rem)', letterSpacing: '-.035em', lineHeight: 1 }}>
                {PRICE_SURCHARGE.amount}
              </p>
              <p className="mt-4" style={{ color: 'rgba(255,255,255,.94)', lineHeight: 1.6 }}>
                Álag sem bætist ofan á verðskrána þegar kalla þarf út tannlækni á bakvakt.
              </p>
            </div>
          </Rise>
        </div>

        <Rise delay={2}>
          <p className="mt-6 max-w-[62ch]" style={{ fontFamily: MONO, fontSize: '.8rem', color: MUTE, lineHeight: 1.65 }}>
            Verkin sjálf eru síðan samkvæmt verðskránni hér að neðan, og vakthafandi tannlæknir
            metur meðferðarþörf í hvert sinn.
          </p>
        </Rise>
      </div>
    </section>
  )
}

/* ═══ the floating assistant ═════════════════════════════════════════════ */

function Robot({ talking }: { talking: boolean }) {
  return (
    <svg viewBox="0 0 48 48" width="30" height="30" aria-hidden="true">
      <rect x="6" y="14" width="36" height="28" rx="11" fill="#fff" />
      <circle cx="24" cy="7" r="3" fill="#fff" />
      <path d="M24 10v4" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="17" cy="26" r={talking ? 2.4 : 3.4} fill={RED}>
        {talking && <animate attributeName="r" values="3.4;1.6;3.4" dur="1.6s" repeatCount="indefinite" />}
      </circle>
      <circle cx="31" cy="26" r={talking ? 2.4 : 3.4} fill={RED}>
        {talking && <animate attributeName="r" values="3.4;1.6;3.4" dur="1.6s" repeatCount="indefinite" />}
      </circle>
      <path d="M19 33c1.7 1.9 3.3 2.8 5 2.8s3.3-.9 5-2.8" stroke={RED} strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

interface Turn {
  who: 'you' | 'vakt'
  text: string
}

function answerFor(q: string): string {
  const n = q.toLowerCase()
  let best: { s: number; a: string } | null = null
  for (const f of ASK_FACTS) {
    const s = f.match.reduce((acc, m) => (n.includes(m) ? acc + 1 : acc), 0)
    if (s > 0 && (!best || s > best.s)) best = { s, a: f.answer }
  }
  return best ? best.a : ASK_FALLBACK
}

function Assistant() {
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const [value, setValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const [nudge, setNudge] = useState(false)
  const logRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  // one gentle nudge after the visitor has settled, then never again
  useEffect(() => {
    const t = window.setTimeout(() => setNudge(true), 4200)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [turns, thinking])

  const send = useCallback(
    async (raw: string) => {
      const q = raw.trim()
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
            messages: history.map((t) => ({ role: t.who === 'you' ? 'user' : 'assistant', content: t.text })),
          }),
        })
        if (res.ok) answer = ((await res.json()) as { answer?: string }).answer || ''
      } catch {
        /* fall through to the local grounded answers */
      } finally {
        window.clearTimeout(timer)
      }
      setTurns((t) => [...t, { who: 'vakt', text: answer || answerFor(q) }])
      setThinking(false)
    },
    [turns],
  )

  return (
    <>
      {/* the bubble */}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          setNudge(false)
        }}
        aria-expanded={open}
        aria-controls="tlv-assistant"
        className={`tlv-bubble ${nudge && !open ? 'tlv-bubble-nudge' : ''} ${FOCUS}`}
        style={{ background: RED }}
      >
        <Robot talking={thinking} />
        <span className="sr-only">{open ? 'Loka spjalli' : 'Spyrja vaktina'}</span>
      </button>

      {nudge && !open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true)
            setNudge(false)
          }}
          className={`tlv-nudge ${FOCUS}`}
        >
          Spurning? Ég svara strax.
        </button>
      )}

      {/* the panel */}
      <div
        id="tlv-assistant"
        ref={panelRef}
        className={`tlv-panel ${open ? 'tlv-panel-open' : ''}`}
        role="dialog"
        aria-label="Spyrja vaktina"
        aria-hidden={!open}
      >
        <div className="flex items-center gap-3 border-b p-4" style={{ borderColor: HAIR }}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: RED }}>
            <Robot talking={thinking} />
          </span>
          <div className="min-w-0">
            <p style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: '1rem' }}>Vaktin</p>
            <p style={{ fontFamily: MONO, fontSize: '.68rem', color: GREEN }}>Svarar strax, allan sólarhringinn</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`ml-auto grid h-11 w-11 place-items-center ${FOCUS}`}
            aria-label="Loka"
            style={{ color: MUTE, fontSize: '1.4rem', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div ref={logRef} className="tlv-log" role="log" aria-live="polite">
          {turns.length === 0 && (
            <p style={{ fontFamily: BODY, color: SOFT, lineHeight: 1.6 }}>
              Góðan dag. Hvað get ég gert fyrir þig?
            </p>
          )}
          {turns.map((t, i) => (
            <div key={i} className={t.who === 'you' ? 'tlv-you' : 'tlv-vakt'}>
              {t.text}
            </div>
          ))}
          {thinking && (
            <p className="tlv-vakt" style={{ color: MUTE }}>
              <span className="tlv-typing">skrifar</span>
            </p>
          )}
        </div>

        <div className="border-t p-3" style={{ borderColor: HAIR }}>
          <ul className="mb-2 flex flex-wrap gap-1.5">
            {ASK_CHIPS.slice(0, 4).map((c) => (
              <li key={c}>
                <button type="button" onClick={() => send(c)} className={`tlv-chip ${FOCUS}`}>
                  {c}
                </button>
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(value)
            }}
            className="flex gap-2"
          >
            <label htmlFor="tlv-ask" className="sr-only">
              Spurningin þín
            </label>
            <input
              id="tlv-ask"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Skrifaðu spurningu"
              className={`tlv-input ${FOCUS}`}
            />
            <button type="submit" className={`tlv-send ${FOCUS}`} style={{ background: RED }}>
              Senda
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */

export default function TannlaeknavaktinPage() {
  const [status, setStatus] = useState<Status>(() => readStatus(new Date()))
  const [menu, setMenu] = useState(false)
  useScrollEngine()

  useEffect(() => {
    const t = window.setInterval(() => setStatus(readStatus(new Date())), 30000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => setThemeColor(BONE), [])

  useEffect(() => {
    if (!menu) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

  const dial = useMemo(() => <WhenBand />, [])

  return (
    <div style={{ background: BONE, color: INK, fontFamily: BODY, minHeight: '100vh' }}>
      <style>{`
        /* scrubbed content rise */
        .tlv-rise > * { }
        .tlv-rise {
          --rv: 0;
          opacity: calc(.06 + var(--rv) * .94);
          transform: translate3d(0, calc((1 - var(--rv)) * 26px), 0);
          will-change: opacity, transform;
        }
        /* scrubbed media reveal: feathered off-axis sweep + blur falling away */
        .tlv-plate {
          --rv: 0;
          position: relative;
          overflow: hidden;
          background: ${SAND};
        }
        .tlv-plate img {
          position: absolute;
          left: -2.5%; top: -2.5%;
          width: 105%; height: 105%;
          max-width: none;
          object-fit: cover;
          transform: scale(calc(1.06 - var(--rv) * .06));
          filter: blur(calc((1 - var(--rv)) * 14px)) saturate(calc(.55 + var(--rv) * .45));
          -webkit-mask-image: linear-gradient(168deg,
            #000 calc(var(--rv) * 165% - 45%),
            transparent calc(var(--rv) * 165% - 6%));
          mask-image: linear-gradient(168deg,
            #000 calc(var(--rv) * 165% - 45%),
            transparent calc(var(--rv) * 165% - 6%));
          will-change: transform, filter;
        }

        /* underline that draws on hover, the page's one link idiom */
        .tlv-navlink { position: relative; }
        .tlv-navlink::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 6px; height: 1px;
          background: currentColor; transform: scaleX(0); transform-origin: left;
          transition: transform .34s cubic-bezier(.22,.61,.36,1);
        }
        .tlv-navlink:hover::after, .tlv-navlink:focus-visible::after { transform: scaleX(1); }

        /* the floating assistant */
        .tlv-bubble {
          position: fixed; right: 18px; bottom: 18px; z-index: 60;
          width: 62px; height: 62px; border-radius: 999px;
          display: grid; place-items: center;
          box-shadow: 0 10px 30px rgba(231,1,4,.34);
          transition: transform .28s cubic-bezier(.34,1.56,.64,1);
        }
        .tlv-bubble:hover { transform: scale(1.07); }
        @keyframes tlvBob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
        .tlv-bubble-nudge { animation: tlvBob 2.4s ease-in-out infinite; }
        .tlv-nudge {
          position: fixed; right: 92px; bottom: 33px; z-index: 60;
          background: #fff; color: ${INK}; font-family: ${BODY}; font-size: .92rem;
          padding: 11px 15px; border-radius: 999px; min-height: 44px;
          box-shadow: 0 8px 26px rgba(27,22,19,.16); border: 1px solid ${HAIR};
          white-space: nowrap;
        }
        .tlv-panel {
          position: fixed; right: 18px; bottom: 92px; z-index: 60;
          width: min(376px, calc(100vw - 36px));
          background: #fff; border: 1px solid ${HAIR}; border-radius: 20px;
          box-shadow: 0 26px 70px rgba(27,22,19,.24);
          display: flex; flex-direction: column; overflow: hidden;
          opacity: 0; transform: translateY(14px) scale(.97); pointer-events: none;
          transition: opacity .28s ease, transform .28s cubic-bezier(.34,1.4,.64,1);
        }
        .tlv-panel-open { opacity: 1; transform: none; pointer-events: auto; }
        .tlv-log { padding: 16px; overflow-y: auto; max-height: min(46vh, 340px); display: grid; gap: 10px; }
        .tlv-you {
          justify-self: end; max-width: 86%;
          background: ${INK}; color: ${BONE};
          padding: 10px 14px; border-radius: 16px 16px 4px 16px; line-height: 1.5;
        }
        .tlv-vakt {
          justify-self: start; max-width: 92%;
          background: ${SAND}; color: ${INK};
          padding: 10px 14px; border-radius: 16px 16px 16px 4px; line-height: 1.55;
        }
        @keyframes tlvDots { 0%,100% { opacity:.3 } 50% { opacity:1 } }
        .tlv-typing::after { content: '…'; animation: tlvDots 1.2s ease-in-out infinite; }
        .tlv-chip {
          font-family: ${MONO}; font-size: .74rem; color: ${SOFT};
          border: 1px solid ${HAIR}; border-radius: 999px; padding: 8px 12px; min-height: 46px;
        }
        .tlv-chip:hover { background: ${SAND}; }
        .tlv-input {
          flex: 1; min-height: 46px; padding: 0 12px; font-family: ${BODY}; font-size: .98rem;
          border: 1px solid ${HAIR}; border-radius: 999px; background: ${BONE}; color: ${INK};
        }
        .tlv-send {
          min-height: 46px; padding: 0 16px; color: #fff; border-radius: 999px;
          font-family: ${DISPLAY}; font-weight: 600;
        }

        @media (prefers-reduced-motion: reduce) {
          .tlv-rise { opacity: 1 !important; transform: none !important; }
          .tlv-plate img {
            filter: none !important; transform: none !important;
            -webkit-mask-image: none !important; mask-image: none !important;
          }
          .tlv-bubble-nudge, .tlv-typing::after { animation: none !important; }
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <PreviewChrome company={company} />

      {/* ── NAV ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40" style={{ background: 'rgba(251,247,241,.92)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${HAIR}` }}>
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-5 py-3 sm:px-8">
          <a href="#top" className={`flex items-center gap-2.5 ${FOCUS}`} style={{ minHeight: 44 }} aria-label="Tannlæknavaktin, efst">
            <Mark size={25} />
            <span className="text-[.92rem] sm:text-[1.04rem]" style={{ fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>
              tannlæknavaktin
            </span>
          </a>
          <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Aðalvalmynd">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className={`tlv-navlink inline-flex items-center text-[.95rem] ${FOCUS}`} style={{ color: SOFT, minHeight: 44 }}>
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href={PHONE_HREF}
            className={`ml-auto inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 text-[.84rem] sm:px-5 sm:text-[.94rem] lg:ml-0 ${FOCUS}`}
            style={{ background: RED, color: '#fff', fontFamily: MONO, fontWeight: 700, minHeight: 44, whiteSpace: 'nowrap' }}
            aria-label={`Hringja í ${PHONE_DISPLAY}`}
          >
            ☏ {PHONE_DISPLAY}
          </a>
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-label={menu ? 'Loka valmynd' : 'Opna valmynd'}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full lg:hidden ${FOCUS}`}
            style={{ border: `1px solid ${HAIR}` }}
          >
            <span className="relative block h-[13px] w-[19px]" aria-hidden="true">
              <span className="absolute left-0 block h-[2px] w-full" style={{ background: INK, top: menu ? 5.5 : 0, transform: menu ? 'rotate(45deg)' : 'none', transition: 'top .22s, transform .22s' }} />
              <span className="absolute left-0 block h-[2px] w-full" style={{ background: INK, bottom: menu ? 5.5 : 0, transform: menu ? 'rotate(-45deg)' : 'none', transition: 'bottom .22s, transform .22s' }} />
            </span>
          </button>
        </div>
        {menu && (
          <div className="border-t lg:hidden" style={{ borderColor: HAIR, background: BONE }}>
            <nav className="mx-auto max-w-[1180px] px-5 py-2 sm:px-8" aria-label="Valmynd">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setMenu(false)} className={`flex items-center border-b py-3.5 text-[1.05rem] ${FOCUS}`} style={{ borderColor: HAIR, minHeight: 48, fontFamily: DISPLAY, fontWeight: 500 }}>
                  <span aria-hidden="true" style={{ color: RED, fontFamily: MONO, marginRight: 12 }}>[</span>
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main id="top">
        {/* ── HERO ────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[1180px] px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <div className="grid gap-10 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:gap-16">
            <div>
              <p style={{ fontFamily: MONO, fontSize: '.76rem', letterSpacing: '.15em', color: MUTE }} className="uppercase">
                Bráðaþjónusta vegna tannlækninga í Reykjavík
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span
                  className="inline-block shrink-0 rounded-full"
                  style={{ width: 11, height: 11, background: status.open ? GREEN : MUTE }}
                  aria-hidden="true"
                />
                <span style={{ fontFamily: MONO, fontSize: '.82rem', color: status.open ? GREEN : MUTE, letterSpacing: '.06em' }}>
                  {status.open ? (status.onCall ? 'OPIÐ · TANNLÆKNIR Á BAKVAKT' : 'OPIÐ NÚNA') : 'LOKAÐ NÚNA'}
                </span>
              </div>

              <h1
                className="mt-4"
                style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.7rem, 8.4vw, 5.2rem)', letterSpacing: '-.035em', lineHeight: 1.02 }}
              >
                Verkurinn hættir í dag.
              </h1>

              <p className="mt-6 max-w-[46ch]" style={{ fontSize: 'clamp(1.08rem, 2.2vw, 1.34rem)', lineHeight: 1.5, color: SOFT }}>
                {status.open ? (
                  <>
                    Við lokum klukkan <strong style={{ color: INK }}>{status.closesAt}</strong> í dag.{' '}
                    {status.onCall
                      ? 'Tannlæknir er á bakvakt. Um kvöld og helgar er 45.590 kr. álag á verðskrána.'
                      : 'Hringdu og fáðu tíma.'}
                  </>
                ) : (
                  <>
                    Við opnum klukkan <strong style={{ color: INK }}>{status.opensAt}</strong> {status.opensLabel}. Í
                    neyðartilvikum er bent á að hafa samband við <strong style={{ color: INK }}>112</strong>.
                  </>
                )}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={PHONE_HREF}
                  className={`inline-flex items-center rounded-full ${FOCUS}`}
                  style={{ background: RED, color: '#fff', fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(1.06rem, 2.5vw, 1.28rem)', padding: '17px 32px', minHeight: 56 }}
                >
                  Hringja í {PHONE_DISPLAY}
                </a>
                <a
                  href="#hvenaer"
                  className={`inline-flex items-center rounded-full ${FOCUS}`}
                  style={{ border: `1px solid ${HAIR}`, color: INK, fontFamily: DISPLAY, fontWeight: 500, fontSize: '1.06rem', padding: '16px 26px', minHeight: 56 }}
                >
                  Sjá hvað það kostar
                </a>
              </div>

              <p className="mt-6" style={{ fontFamily: MONO, fontSize: '.84rem', color: MUTE }}>
                Ávallt þarf að hafa samband símleiðis til tímapantana.
              </p>
            </div>

            <Plate src={IMG.hero} alt="Hlý morgunbirta inn um glugga, rjúkandi bolli á borði." ratio="4 / 3" priority />
          </div>

          {/* the live day rail */}
          <div className="mt-14" aria-hidden="true">
            <div className="flex items-baseline justify-between" style={{ fontFamily: MONO, fontSize: '.76rem', color: MUTE }}>
              <span>{hhmm(status.today.open)}</span>
              <span style={{ color: status.open ? GREEN : MUTE }}>{status.clock}</span>
              <span>{hhmm(status.today.close)}</span>
            </div>
            <div className="relative mt-2 h-[3px] w-full rounded-full" style={{ background: HAIR }}>
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${status.progress * 100}%`, background: status.open ? GREEN : MUTE, transition: 'width 1s linear' }}
              />
            </div>
            <p className="mt-2" style={{ fontFamily: MONO, fontSize: '.74rem', color: MUTE }}>
              {status.today.label} · bakvakt frá {hhmm(ONCALL_FROM)}
              {!status.open && ' · dagurinn liðinn'}
            </p>
          </div>
        </section>

        {/* ── TRIAGE ──────────────────────────────────────────────────── */}
        <section style={{ background: SAND }} aria-labelledby="triage-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Rise>
              <Bracket color={REDINK}>Hvað á að gera</Bracket>
              <H2 id="triage-h">Þrjár leiðir, eftir því hvað liggur á</H2>
            </Rise>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {TRIAGE.map((t, i) => (
                <Rise key={t.title} delay={i} as="article">
                  <div
                    className="flex h-full flex-col rounded-2xl p-7"
                    style={{ background: t.primary ? RED : '#fff', color: t.primary ? '#fff' : INK, border: t.primary ? 'none' : `1px solid ${HAIR}` }}
                  >
                    <span style={{ fontFamily: MONO, fontSize: '.7rem', letterSpacing: '.14em', color: t.primary ? 'rgba(255,255,255,.8)' : MUTE }} className="uppercase">
                      {t.tag}
                    </span>
                    <h3 className="mt-4" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: '1.7rem', letterSpacing: '-.02em' }}>
                      {t.title}
                    </h3>
                    <p className="mt-3 flex-1" style={{ lineHeight: 1.55, color: t.primary ? 'rgba(255,255,255,.92)' : SOFT }}>
                      {t.line}
                    </p>
                    <a
                      href={t.href}
                      className={`mt-6 inline-flex items-center justify-center rounded-full ${FOCUS}`}
                      style={{
                        background: t.primary ? '#fff' : 'transparent',
                        color: t.primary ? RED : INK,
                        border: t.primary ? 'none' : `1px solid ${HAIR}`,
                        fontFamily: DISPLAY, fontWeight: 600, padding: '13px 20px', minHeight: 48,
                      }}
                    >
                      {t.action}
                    </a>
                    <p className="mt-3" style={{ fontFamily: MONO, fontSize: '.74rem', color: t.primary ? 'rgba(255,255,255,.75)' : MUTE }}>
                      {t.note}
                    </p>
                  </div>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* ── SIGNATURE ───────────────────────────────────────────────── */}
        {dial}

        {/* ── RELIEF BAND ─────────────────────────────────────────────── */}
        <section aria-labelledby="relief-h">
          <div className="mx-auto grid max-w-[1180px] gap-10 px-5 pb-20 sm:px-8 sm:pb-28 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-16">
            <Plate src={IMG.relief} alt="Manneskja við bjartan glugga, róleg eftir að verkur er liðinn hjá." ratio="4 / 5" />
            <Rise>
              <Bracket color={REDINK}>Léttirinn</Bracket>
              <H2 id="relief-h">Það er ekki tönnin sem fólk man eftir</H2>
              <p className="mt-6 max-w-[48ch]" style={{ color: SOFT, fontSize: '1.1rem', lineHeight: 1.62 }}>
                Það er stundin þegar verkurinn hættir. Tannlæknavaktin sinnir bráðatilvikum þegar
                flest annað er lokað, alla daga ársins, með tannlækni á bakvakt á kvöldin og um helgar.
              </p>
              <p className="mt-5 max-w-[48ch]" style={{ color: SOFT, lineHeight: 1.62 }}>
                {URGENT_INTRO}
              </p>
            </Rise>
          </div>
        </section>

        {/* ── URGENT ──────────────────────────────────────────────────── */}
        <section id="bradatilvik" className="scroll-mt-24" style={{ background: SAND }} aria-labelledby="urgent-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Rise>
              <Bracket color={REDINK}>Bráðatilvik</Bracket>
              <H2 id="urgent-h">Hvenær á að hringja strax</H2>
            </Rise>
            <Rise delay={1}>
              <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {URGENT_NOW.map((u) => (
                  <li key={u} className="flex items-center gap-3 rounded-xl bg-white p-5" style={{ fontSize: '1.05rem', border: `1px solid ${HAIR}` }}>
                    <span aria-hidden="true" style={{ color: RED, fontFamily: MONO, fontWeight: 700 }}>×</span>
                    {u}
                  </li>
                ))}
              </ul>
            </Rise>
            <Rise delay={2}>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <p style={{ fontFamily: MONO, fontSize: '.85rem', color: SOFT, lineHeight: 1.65 }}>{URGENT_WAIT}</p>
                <p style={{ color: SOFT, lineHeight: 1.6 }}>{TRAUMA_NOTE}</p>
              </div>
            </Rise>
          </div>
        </section>

        {/* ── HOURS ───────────────────────────────────────────────────── */}
        <section id="opnunartimi" className="scroll-mt-24" aria-labelledby="hours-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Rise>
              <Bracket>Opnunartími</Bracket>
              <H2 id="hours-h">Vaktin, dag fyrir dag</H2>
            </Rise>
            <Rise delay={1}>
              <ul className="mt-10">
                {WEEK.map((w) => {
                  const today = w.day === status.today.day
                  return (
                    <li key={w.day} className="flex flex-wrap items-baseline justify-between gap-3 border-b py-4" style={{ borderColor: HAIR, color: today ? INK : SOFT }}>
                      <span className="flex items-center gap-3">
                        {today && <span aria-hidden="true" className="inline-block rounded-full" style={{ width: 8, height: 8, background: status.open ? GREEN : RED }} />}
                        <span style={{ fontFamily: DISPLAY, fontWeight: today ? 600 : 500, fontSize: 'clamp(1.06rem, 2.5vw, 1.35rem)' }}>{w.label}</span>
                        {today && <span style={{ fontFamily: MONO, fontSize: '.7rem', color: REDINK }}>Í DAG</span>}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 'clamp(1rem, 2.2vw, 1.16rem)' }}>
                        <span aria-hidden="true" style={{ opacity: 0.4 }}>[</span>
                        <span style={{ padding: '0 .55em' }}>{hhmm(w.open)} · {hhmm(w.close)}</span>
                        <span aria-hidden="true" style={{ opacity: 0.4 }}>]</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Rise>
            <Rise delay={2}>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <p style={{ fontFamily: MONO, fontSize: '.86rem', color: SOFT, lineHeight: 1.65 }}>{HOURS_NOTE}</p>
                <p style={{ fontFamily: MONO, fontSize: '.86rem', color: SOFT, lineHeight: 1.65 }}>{AFTER_CLOSE}</p>
              </div>
            </Rise>
          </div>
        </section>

        {/* ── PRICES ──────────────────────────────────────────────────── */}
        <section id="verd" className="scroll-mt-24" style={{ background: SAND }} aria-labelledby="price-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Rise>
              <Bracket>Verðskrá</Bracket>
              <H2 id="price-h">Öll verðin, uppi á borðum</H2>
            </Rise>
            <Rise delay={1}>
              <div className="mt-10 grid gap-6 rounded-2xl p-7 sm:p-10 md:grid-cols-[auto_1fr] md:items-center md:gap-12" style={{ background: RED, color: '#fff' }}>
                <div>
                  <p style={{ fontFamily: MONO, fontSize: '.76rem', letterSpacing: '.13em' }} className="uppercase">{PRICE_SURCHARGE.label}</p>
                  <p className="mt-2" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.5rem, 7.5vw, 4.2rem)', letterSpacing: '-.04em', lineHeight: 1 }}>
                    {PRICE_SURCHARGE.amount}
                  </p>
                </div>
                <p style={{ lineHeight: 1.58, fontSize: '1.05rem', color: 'rgba(255,255,255,.94)' }}>{PRICE_SURCHARGE.body}</p>
              </div>
            </Rise>
            <Rise delay={2}>
              <ul className="mt-10">
                {PRICES.map((p) => (
                  <li key={p.item} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-4" style={{ borderColor: HAIR }}>
                    <span style={{ fontSize: '1.05rem' }}>{p.item}</span>
                    <span style={{ fontFamily: MONO, color: SOFT }}>{p.price}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-8 grid gap-3">
                {PRICE_NOTES.map((n) => (
                  <li key={n} className="flex gap-3" style={{ fontFamily: MONO, fontSize: '.85rem', color: MUTE, lineHeight: 1.6 }}>
                    <span aria-hidden="true" style={{ color: REDINK }}>·</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </section>

        {/* ── LOCATIONS ───────────────────────────────────────────────── */}
        <section id="stadsetning" className="scroll-mt-24" aria-labelledby="place-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Rise>
              <Bracket>Staðsetning</Bracket>
              <H2 id="place-h">Hvar er opið í kvöld</H2>
              <p className="mt-5 max-w-[52ch]" style={{ color: SOFT, fontSize: '1.08rem', lineHeight: 1.6 }}>{PLACE_NOTE}</p>
            </Rise>

            <Rise delay={1} className="mt-10">
              <Plate src={IMG.night} alt="Einn upplýstur gluggi í dimmri götu að kvöldi." ratio="21 / 9" />
            </Rise>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {PLACES.map((p, i) => (
                <Rise key={p.address} delay={i + 1} as="article">
                  <div className="h-full rounded-2xl bg-white p-7 sm:p-8" style={{ border: `1px solid ${HAIR}` }}>
                    <p style={{ fontFamily: MONO, fontSize: '.72rem', color: MUTE, letterSpacing: '.13em' }} className="uppercase">
                      Staður {i + 1} af 2
                    </p>
                    <h3 className="mt-4" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(1.5rem, 3.4vw, 2rem)', letterSpacing: '-.025em' }}>
                      {p.address}
                    </h3>
                    <p className="mt-1" style={{ fontFamily: MONO, color: SOFT }}>{p.postcode}</p>
                    <p className="mt-5" style={{ color: SOFT, lineHeight: 1.55 }}>
                      <span style={{ color: MUTE, fontFamily: MONO, fontSize: '.78rem' }}>Tannlæknar<br /></span>
                      {p.dentists}
                    </p>
                    <p className="mt-4" style={{ fontFamily: MONO, fontSize: '.76rem', color: MUTE, lineHeight: 1.6 }}>{p.licence}</p>
                    <a href={p.maps} target="_blank" rel="noreferrer" className={`tlv-navlink mt-6 inline-flex items-center ${FOCUS}`} style={{ color: REDINK, fontFamily: MONO, fontSize: '.88rem', minHeight: 44 }}>
                      Opna í kortum
                    </a>
                  </div>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* ── ADVICE ──────────────────────────────────────────────────── */}
        <section style={{ background: SAND }} aria-labelledby="advice-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Rise>
              <Bracket>Á meðan þú bíður</Bracket>
              <H2 id="advice-h">Ráð við tannverk</H2>
            </Rise>
            <div className="mt-11 grid gap-8 md:grid-cols-2 md:gap-x-12">
              {ADVICE.map((a, i) => (
                <Rise key={a.n} delay={i} as="article">
                  <p style={{ fontFamily: MONO, fontSize: '.82rem', color: REDINK }}>[ {a.n} ]</p>
                  <h3 className="mt-3" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(1.2rem, 2.6vw, 1.45rem)', letterSpacing: '-.02em' }}>
                    {a.head}
                  </h3>
                  <p className="mt-3" style={{ color: SOFT, lineHeight: 1.62 }}>{a.body}</p>
                </Rise>
              ))}
            </div>
            <Rise delay={2}>
              <p className="mt-12 max-w-[62ch]" style={{ fontFamily: MONO, fontSize: '.84rem', color: MUTE, lineHeight: 1.65 }}>
                Textinn hér að ofan er byggður á fræðsluefni Tannlæknavaktarinnar sjálfrar. Hann kemur
                ekki í staðinn fyrir greiningu tannlæknis.
              </p>
            </Rise>
          </div>
        </section>

        {/* ── CLOSER ──────────────────────────────────────────────────── */}
        <section aria-labelledby="closer-h">
          <div className="mx-auto max-w-[1180px] px-5 py-24 text-center sm:px-8 sm:py-32">
            <Rise>
              <div className="flex justify-center"><Mark size={42} /></div>
              <h2 id="closer-h" className="mx-auto mt-8 max-w-[16ch]" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.2rem, 6.5vw, 4.2rem)', letterSpacing: '-.035em', lineHeight: 1.04 }}>
                {status.open ? 'Það er opið. Hringdu.' : `Við opnum klukkan ${status.opensAt}.`}
              </h2>
              <a
                href={PHONE_HREF}
                className={`mt-9 inline-flex items-center rounded-full ${FOCUS}`}
                style={{ background: RED, color: '#fff', fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(1.15rem, 3vw, 1.5rem)', padding: '19px 36px', minHeight: 60 }}
              >
                {PHONE_DISPLAY}
              </a>
              <p className="mt-8" style={{ fontFamily: MONO, fontSize: '.82rem', color: MUTE, lineHeight: 1.7 }}>
                {LEGAL_NAME} · kt. {KENNITALA} · Skipholt 33, 105 Reykjavík
                <br />
                <a href={EMAIL_HREF} className={`tlv-navlink inline-flex items-center ${FOCUS}`} style={{ color: REDINK, minHeight: 44 }}>
                  {EMAIL}
                </a>
              </p>
            </Rise>
          </div>
        </section>
      </main>

      <Assistant />
      <PreviewFooter company={company} />
    </div>
  )
}
