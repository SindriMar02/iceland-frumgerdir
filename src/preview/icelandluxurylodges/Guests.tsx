import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link } from 'react-router-dom'
import {
  CHAPTERS, DOORS, IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, DEMO_STAYS, PASS_RULES,
  MANUAL, MANUAL_LOCALITY, MANUAL_COORDS, MANUAL_IMAGES, MANUAL_FACTS, type ManualAuto,
} from './data'
import { HouseMap, MAP_STYLES } from './Map'
import { setNoindex, setThemeColor } from '../../lib/preview'

/* ── THE HOUSE MANUAL (round 10, 23 Oct 2026) ──────────────────────────────
   Sindri: "the password page very intelligent and premium, the manual
   brilliant and in line with the site; nice icons, fun facts, easy
   navigation, beautiful images". References: Mobbin, Family + Skyscanner
   code screens (grouped boxes, paste from email), Airbnb/Vrbo arrival guides
   (check-in, Wi-Fi, rules blocks), Polarsteps destination header
   (coordinates + facts). 21st.dev catalog search was down (twice).

   GATE  one real <input> under eight drawn boxes (paste, autofill, screen
         readers all work); the first four letters already tell which house it
         is, so the photograph crossfades to that house and names it before the
         code is finished; a full code opens by itself.
   MANUAL photo header with the lake's coordinates, today's light at the lake
         (sunrise/sunset computed on the device, no API), icon facts, a sticky
         icon bar that follows the reader, sections with fine-line icons and
         photographs, "Good to know", and the host one tap away.
   Content is ALL in data.ts (MANUAL*, PASS_RULES, DEMO_STAYS). Prototype:
   client-side passes; live, SNDR Bókun issues and checks one per booking. ────────── */

const ROOT = '/preview/icelandluxurylodges'
const RDIR = `${import.meta.env.BASE_URL}icelandluxurylodges/r/`

/* ── pictures: the same AVIF/WebP set the rest of the site uses ── */
function Pic({ src, alt, sizes = '100vw', eager = false }: { src: string; alt: string; sizes?: string; eager?: boolean }) {
  const n = src.match(/\/([a-z0-9-]+)\.jpg$/i)?.[1]
  const set = (ext: string) => [800, 1200, 1800, 2400].map((w) => `${RDIR}${n}-${w}.${ext} ${w}w`).join(', ')
  return (
    <picture>
      {n && <source type="image/avif" srcSet={set('avif')} sizes={sizes} />}
      {n && <source type="image/webp" srcSet={set('webp')} sizes={sizes} />}
      <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" {...(eager ? { fetchPriority: 'high' as const } : {})} />
    </picture>
  )
}

/* ── fine-line icons (1.25 stroke, 24 grid), drawn for this page ── */
type IconName = 'key' | 'pin' | 'house' | 'sparkle' | 'water' | 'wifi' | 'flame' | 'leaf' | 'scroll' | 'lifebuoy'
  | 'phone' | 'mail' | 'sun' | 'moon' | 'bed' | 'people' | 'bath' | 'area' | 'print' | 'close' | 'arrow'
  | 'swan' | 'law' | 'lake' | 'river' | 'steam' | 'aurora' | 'lock' | 'compass'
const P: Record<IconName, string> = {
  key: 'M14.5 9.5a4 4 0 1 1-1.2-2.8M13.3 6.7 20 13.4v3h-3v-2h-2v-2h-2',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  house: 'M4 11 12 4l8 7M6 9.5V20h12V9.5M10 20v-5h4v5',
  sparkle: 'M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4',
  water: 'M3 15c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1M3 19c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1M8 11c0-2 1.5-2.5 1.5-4.5M12 11c0-2 1.5-2.5 1.5-4.5M16 11c0-2 1.5-2.5 1.5-4.5',
  wifi: 'M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0M12 19.5h.01',
  flame: 'M12 21c-3.6 0-6-2.4-6-5.6 0-3.4 3-5.4 3.6-9.4 2.4 1.6 3.4 3.6 3.4 5.4.8-.6 1.4-1.6 1.6-2.8 2.2 1.8 3.4 4 3.4 6.8 0 3.2-2.4 5.6-6 5.6Z',
  leaf: 'M5 19c0-8 5-13 14-14-1 9-6 14-14 14Zm0 0 7-7',
  scroll: 'M7 4h11a2 2 0 0 1 2 2v1h-4M7 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7M7 4a2 2 0 0 1 2 2v1M9 11h6M9 14.5h6',
  lifebuoy: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6',
  phone: 'M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.5 1.5C10.5 20.5 3.5 13.5 3.5 5.5A1.5 1.5 0 0 1 5 4Z',
  mail: 'M3.5 6.5h17v11h-17zM3.5 7l8.5 6 8.5-6',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4',
  moon: 'M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z',
  bed: 'M3 18v-8M3 14h18v4M21 14v-2.5A2.5 2.5 0 0 0 18.5 9H11v5M6.5 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 19c.4-3 2.7-5 5.5-5s5.1 2 5.5 5M16 11a2.5 2.5 0 1 0 0-5M17.5 14c1.8.5 3 2.2 3.2 4.5',
  bath: 'M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2ZM6 12V6a2 2 0 0 1 3.7-1M7 19l-1 2M17 19l1 2',
  area: 'M4 4h16v16H4zM4 9h3M4 14h3M9 4v3M14 4v3',
  print: 'M7 9V4h10v5M7 17H5a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 5 9h14a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 19 17h-2M7 14h10v6H7z',
  close: 'M6 6l12 12M18 6 6 18',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  swan: 'M3.5 14.5c1.5 3.5 10 4.2 14.5 1 1.6-1.1 2-3 1.2-4.6l-1.7-3.3c-.6-1.2-.4-2.6.5-3.3-1.8-.6-3.6.6-3.6 2.6 0 1.2.6 2.3 1.2 3.4.8 1.5.6 3.1-.8 3.8-3 1.5-7.6.9-11.3.4ZM15.2 4.7 13.6 5.2M2.5 20.5h19',
  law: 'M12 4v16M5 20h14M6 8h12M8.5 8l-3 6a3 3 0 0 0 6 0l-3-6M15.5 8l-3 6a3 3 0 0 0 6 0l-3-6',
  lake: 'M3 13c3-2 6-2 9 0s6 2 9 0M3 17.5c3-2 6-2 9 0s6 2 9 0M7 9l3-4 2.5 3 2-2 3.5 3',
  river: 'M8 3c0 4 6 4 6 8s-6 4-6 8M14 3c0 3 4 3.5 4 6M6 15c0 3 4 3.5 4 6',
  steam: 'M8 20h8M6 16h12M9 12c0-2 1.5-2.5 1.5-4.5S9 5 9 3M13 12c0-2 1.5-2.5 1.5-4.5S13 5 13 3',
  aurora: 'M3 17c2.5-6 5.5-9 9-9s6.5 3 9 9M3 21c3-4 6-6 9-6s6 2 9 6M7 6l.5-2M12 4.5V2.5M17 6l-.5-2',
  lock: 'M6.5 10.5h11V20h-11zM8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 14v2.5',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z',
}
function Icon({ n, size = 22 }: { n: IconName; size?: number }) {
  return (
    <svg className="ill-g-ico" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path d={P[n]} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
const SECTION_ICON: Record<string, IconName> = {
  arrival: 'key', directions: 'compass', house: 'house', yours: 'sparkle', water: 'water', wifi: 'wifi',
  heat: 'flame', waste: 'leaf', rules: 'scroll', emergency: 'lifebuoy',
}
const QUICK = [
  { id: 'arrival', label: 'Arrival', hint: 'Key and times' },
  { id: 'wifi', label: 'Wi-Fi', hint: 'Network and password' },
  { id: 'water', label: 'Hot tub', hint: 'How it works' },
  { id: 'emergency', label: 'Help', hint: 'Host, 112' },
]
const SHORT: Record<string, string> = {
  arrival: 'Arrival', directions: 'Directions', house: 'The house', yours: 'Yours to use', water: 'Hot tub',
  wifi: 'Wi-Fi', heat: 'Heating', waste: 'Waste', rules: 'Rules', emergency: 'Help',
}

/* ── today's light at the lake: NOAA sunrise equation, Iceland is UTC all year ── */
function sunTimes(day: Date, lat: number, lon: number) {
  const rad = Math.PI / 180
  const J = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()) / 86400000 + 2440587.5
  const n = Math.round(J - 2451545 + 0.0008)
  const Js = n - lon / 360
  const M = (357.5291 + 0.98560028 * Js) % 360
  const C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad)
  const L = (M + C + 180 + 102.9372) % 360
  const Jt = 2451545 + Js + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * L * rad)
  const d = Math.asin(Math.sin(L * rad) * Math.sin(23.44 * rad))
  const cosH = (Math.sin(-0.833 * rad) - Math.sin(lat * rad) * Math.sin(d)) / (Math.cos(lat * rad) * Math.cos(d))
  if (cosH > 1) return { kind: 'night' as const }
  if (cosH < -1) return { kind: 'day' as const }
  const H = Math.acos(cosH) / rad
  const toDate = (j: number) => new Date((j - 2440587.5) * 86400000)
  return { kind: 'normal' as const, rise: toDate(Jt - H / 360), set: toDate(Jt + H / 360) }
}
const hm = (d: Date) => `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
const dms = (v: number, pos: string, neg: string) => {
  const a = Math.abs(v), deg = Math.floor(a), min = Math.round((a - deg) * 60)
  return `${deg}°${String(min).padStart(2, '0')}′${v >= 0 ? pos : neg}`
}

/* ── the manual's sections, built from MANUAL in data.ts ── */
type Section = { id: string; title: string; facts: string[]; text: string[]; todo?: string }
function sectionsFor(id: string): Section[] {
  const c = CHAPTERS.find((x) => x.id === id)
  const d = DOORS.find((x) => x.id === id)
  if (!c || !d) return []
  const has = (re: RegExp) => c.amenities.filter((a) => re.test(a))
  const auto = (k?: ManualAuto): string[] => {
    switch (k) {
      case 'directions': return [MANUAL_LOCALITY[id], ...has(/minutes from/i)].filter(Boolean)
      case 'house': return [d.kind, ...c.facts.map((f) => `${f.n} ${f.l}`)]
      case 'amenities': return c.amenities.filter((a) => !/minutes from/i.test(a))
      case 'water': return has(/hot tub|sauna|spa/i)
      case 'fireplaces': return has(/fireplace/i)
      case 'contact': return ['Emergency in Iceland (police, ambulance, fire): 112', `The host: ${PHONE_DISPLAY}`, `Email: ${EMAIL}`]
      default: return []
    }
  }
  return MANUAL.filter((m) => !m.only || m.only.includes(id)).map((m) => {
    const text = [...(m.text?.all ?? []), ...(m.text?.[id] ?? [])].filter((t) => t.trim())
    return { id: m.id, title: m.title, facts: auto(m.auto), text, todo: text.length ? undefined : m.todo }
  })
}
const factIcon = (l: string): IconName => (/bed/i.test(l) ? 'bed' : /guest/i.test(l) ? 'people' : /bath/i.test(l) ? 'bath' : /m²|m2/i.test(l) ? 'area' : 'house')

/* ═════════════════════════════ THE STAY PASS ════════════════════════════════
   One engine for both doors: the private link in the confirmation email
   (?pass=<token>) and the 4-digit PIN. Time-aware (opens N days before
   arrival, closes at check-out), forgiving (paste, autofill, type anywhere),
   and paced (a short pause after too many wrong tries). Prototype data is
   DEMO_STAYS in data.ts; live, SNDR Bókun answers the same questions. ── */
type Stay = { house: string; guest: string; arrive: Date; leave: Date }
type PassResult = { kind: 'open'; stay: Stay } | { kind: 'early'; stay: Stay; opens: Date } | { kind: 'over'; stay: Stay } | { kind: 'cancelled' } | { kind: 'none' }
/* Iceland is UTC all year: every window is built in UTC and shown in Iceland time,
   so a guest's phone in another zone sees the same check-out moment as the lodge */
const dayAt = (offset: number, hhmm = '00:00', now = new Date()) => {
  const [h, m] = hhmm.split(':').map(Number)
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offset, h, m))
}
function resolvePass(q: { pin?: string; token?: string }, now = new Date()): PassResult {
  const s = DEMO_STAYS.find((x) => (q.pin && x.pin === q.pin) || (q.token && x.token === q.token))
  if (!s) return { kind: 'none' }
  if (s.cancelled) return { kind: 'cancelled' }
  const stay: Stay = { house: s.house, guest: s.guest, arrive: dayAt(s.arriveInDays, '15:00', now), leave: dayAt(s.arriveInDays + s.nights, PASS_RULES.closesAt, now) }
  const opens = dayAt(s.arriveInDays - PASS_RULES.opensDaysBefore, '00:00', now)
  if (now < opens) return { kind: 'early', stay, opens }
  if (now > stay.leave) return { kind: 'over', stay }
  return { kind: 'open', stay }
}
const fmtDay = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Atlantic/Reykjavik' })
const fmtShortDay = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Atlantic/Reykjavik' })
/* remembered on this device until check-out, then forgotten by itself */
const PASS_KEY = 'ill_pass'
function rememberPass(stay: Stay, pin: string) {
  try { localStorage.setItem(PASS_KEY, JSON.stringify({ pin, until: stay.leave.getTime() })) } catch { /* private mode */ }
}
function recallPass(): PassResult | null {
  try {
    const v = JSON.parse(localStorage.getItem(PASS_KEY) || 'null') as { pin: string; until: number } | null
    if (!v || Date.now() > v.until) { localStorage.removeItem(PASS_KEY); return null }
    const r = resolvePass({ pin: v.pin })
    return r.kind === 'open' ? r : null
  } catch { return null }
}
function forgetPass() { try { localStorage.removeItem(PASS_KEY) } catch { /* private mode */ } }

const PIN_LEN = 4
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
/* one photograph travels between the gate and the manual's header (View Transitions where
   the browser has them, a plain swap elsewhere); reduced motion always swaps */
type VTDoc = Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }
function morph(update: () => void) {
  const d = document as VTDoc
  if (!d.startViewTransition || reducedMotion()) { update(); return }
  d.startViewTransition(() => flushSync(update))
}
function Gate({ onOpen, notice }: { onOpen: (stay: Stay) => void; notice?: string }) {
  const [pin, setPin] = useState('')
  const [state, setState] = useState<'idle' | 'wrong' | 'ok' | 'early' | 'over' | 'paused'>('idle')
  const [msg, setMsg] = useState(notice ?? '')
  const [house, setHouse] = useState<string | null>(null)
  const [guest, setGuest] = useState('')
  const [pausedUntil, setPausedUntil] = useState(0)
  const [, tick] = useState(0)
  const tries = useRef(0)
  const pauseRef = useRef(0)
  const seq = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const done = useRef(false)
  const [focusIn, setFocusIn] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [hit, setHit] = useState('')
  const hitT = useRef(0)
  const echo = (k: string) => { setHit(k); window.clearTimeout(hitT.current); hitT.current = window.setTimeout(() => setHit(''), 160) }

  const check = (value: string, at: number) => {
    if (done.current || at !== seq.current) return
    if (Date.now() < pauseRef.current) { setPin(''); return }
    const r = resolvePass({ pin: value })
    if (r.kind === 'open') {
      done.current = true
      rememberPass(r.stay, value)
      setHouse(r.stay.house); setGuest(r.stay.guest); setState('ok'); setMsg('')
      if ('vibrate' in navigator) navigator.vibrate?.(12)
      /* dots draw into a check (≈.5 s), the panel lifts away, then the photograph carries into the manual */
      if (reducedMotion()) { window.setTimeout(() => onOpen(r.stay), 200); return }
      window.setTimeout(() => setLeaving(true), 760)
      window.setTimeout(() => onOpen(r.stay), 1080)
      return
    }
    if (r.kind === 'early') {
      setHouse(r.stay.house); setState('early')
      setMsg(`Your manual for ${DOORS.find((d) => d.id === r.stay.house)?.name} opens on ${fmtDay(r.opens)}, three days before you arrive.`)
      setPin(''); return
    }
    if (r.kind === 'over') { setState('over'); setMsg('That stay has ended. Thank you for staying with us.'); setPin(''); return }
    if (r.kind === 'cancelled') { setState('over'); setMsg('This booking was cancelled, so its pass no longer opens a manual.'); setPin(''); return }
    tries.current += 1
    if (tries.current >= PASS_RULES.maxTries) {
      tries.current = 0
      pauseRef.current = Date.now() + PASS_RULES.pauseSeconds * 1000
      setPausedUntil(pauseRef.current); setState('paused')
    } else {
      setState('wrong'); setMsg('That pass does not match a stay. It is in your booking confirmation.')
    }
    window.setTimeout(() => { if (at === seq.current) setPin('') }, 380)
  }
  const put = (d: string) => {
    if (done.current || Date.now() < pauseRef.current) return
    setPin((p) => {
      if (p.length >= PIN_LEN) return p
      const next = p + d
      if (state !== 'idle' && state !== 'ok') { setState('idle'); setMsg('') }
      if (next.length === PIN_LEN) { const at = ++seq.current; window.setTimeout(() => check(next, at), 120) }
      return next
    })
  }
  const back = () => { if (!done.current) { seq.current++; setPin((p) => p.slice(0, -1)) } }

  /* the paused countdown */
  useEffect(() => {
    if (!pausedUntil) return
    const id = window.setInterval(() => {
      if (Date.now() >= pausedUntil) { pauseRef.current = 0; setPausedUntil(0); setState('idle'); setMsg(''); window.clearInterval(id) } else tick((n) => n + 1)
    }, 500)
    return () => window.clearInterval(id)
  }, [pausedUntil])
  /* type anywhere: digits and Backspace go to the pass (not while a link or button is being used) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (document.activeElement === inputRef.current) return
      if (/^[0-9]$/.test(e.key)) { put(e.key); echo(e.key); e.preventDefault() } else if (e.key === 'Backspace') { back(); echo('del'); e.preventDefault() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  /* paste or one-time-code autofill into the real (visually hidden) field */
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, PIN_LEN)
    e.target.value = ''
    if (!digits) return
    if (Date.now() < pauseRef.current || done.current) return
    if (digits.length === PIN_LEN) { const at = ++seq.current; setPin(digits); window.setTimeout(() => check(digits, at), 120) } else digits.split('').forEach(put)
  }

  const paused = Date.now() < pausedUntil
  const wait = paused ? Math.ceil((pausedUntil - Date.now()) / 1000) : 0
  const door = house ? DOORS.find((d) => d.id === house) : null
  const coords = house ? MANUAL_COORDS[house] : null
  const stage = [{ id: '', src: IMG.heroGolden }, ...DOORS.map((d) => ({ id: d.id, src: IMG[MANUAL_IMAGES[d.id]?.hero?.img ?? d.img as keyof typeof IMG] }))]
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']
  const status = paused ? `Too many tries. Try again in ${wait} s.` : state === 'ok' ? `Welcome, ${guest}.` : msg || 'Enter the 4-digit pass from your booking confirmation.'

  return (
    <main className={`ill-g-gate is-${state} ${leaving ? 'is-leaving' : ''}`}>
      <div className="ill-g-stage" aria-hidden="true">
        {stage.map((s, i) => (
          <div key={s.id || 'all'} className={`ill-g-stage-img ${(house ?? '') === s.id ? 'is-on' : ''}`}>
            <Pic src={s.src} alt="" sizes="(orientation: portrait) 150vh, 100vw" eager={i === 0} />
          </div>
        ))}
      </div>

      <section className="ill-g-pass" aria-labelledby="ill-g-h">
        <p className="ill-g-eye is-ice ill-g-in" style={{ '--i': 0 } as React.CSSProperties}><Icon n="key" size={14} /> {state === 'ok' ? 'Your house' : state === 'early' && door ? door.name : 'For guests'}</p>
        <h1 id="ill-g-h" key={state === 'ok' ? 'name' : 'welcome'} className={state === 'ok' ? 'is-swap' : 'ill-g-in'} style={{ '--i': 1 } as React.CSSProperties}>{state === 'ok' && door ? door.name : 'Welcome to the lake'}</h1>
        {coords && state === 'ok' && <p className="ill-g-pass-coord">{coords.lake} · {dms(coords.lat, 'N', 'S')} {dms(coords.lon, 'E', 'W')}</p>}

        <label htmlFor="ill-g-pin" className="ill-sr">4-digit pass</label>
        <input ref={inputRef} id="ill-g-pin" className="ill-g-pin-real" inputMode="numeric" autoComplete="one-time-code"
          pattern="[0-9]*" maxLength={8} onChange={onInput} aria-describedby="ill-g-status ill-g-progress" disabled={paused || state === 'ok'}
          onKeyDown={(e) => { if (e.key === 'Backspace') { e.preventDefault(); back() } }}
          onFocus={() => setFocusIn(true)} onBlur={() => setFocusIn(false)} />
        <span id="ill-g-progress" className="ill-sr" aria-live="polite">{pin.length} of {PIN_LEN} digits entered</span>
        <div className={`ill-g-dots ill-g-in ${focusIn ? 'is-focus' : ''}`} style={{ '--i': 2 } as React.CSSProperties} aria-hidden="true" onClick={() => inputRef.current?.focus()}>
          {Array.from({ length: PIN_LEN }, (_, i) => <span key={i} className={i < pin.length ? 'is-on' : ''} style={{ '--d': i } as React.CSSProperties} />)}
          <svg className="ill-g-tick" viewBox="0 0 24 24" width="28" height="28"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <p id="ill-g-status" className="ill-g-pass-status ill-g-in" style={{ '--i': 3 } as React.CSSProperties} role={state === 'wrong' || paused ? 'alert' : 'status'}>{status}</p>

        <div className="ill-g-pad ill-g-in" style={{ '--i': 4 } as React.CSSProperties} role="group" aria-label="Number pad">
          {keys.map((k, i) => k === '' ? <span key={i} /> : k === 'del'
            ? <button key={i} type="button" className={`is-del ${hit === 'del' ? 'is-hit' : ''}`} onClick={back} aria-label="Delete last digit" disabled={paused || state === 'ok'}><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 6h10.5v12H9l-5.5-6L9 6Zm3.5 3.5 5 5m0-5-5 5" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            : <button key={i} type="button" className={hit === k ? 'is-hit' : ''} onClick={() => put(k)} disabled={paused || state === 'ok'}>{k}</button>)}
        </div>

        <p className="ill-g-pass-help ill-g-in" style={{ '--i': 5 } as React.CSSProperties}>The link in your booking confirmation opens the manual directly: by email, or as a message on Airbnb or Booking.com. Can’t find it? Call <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.</p>
        <details className="ill-g-pass-demo ill-g-in" style={{ '--i': 6 } as React.CSSProperties}>
          <summary>Prototype passes</summary>
          <p>{DEMO_STAYS.map((s, i) => <span key={s.pin}>{i ? ' · ' : ''}<code>{s.pin}</code> {DOORS.find((d) => d.id === s.house)?.name}{s.cancelled ? ' (cancelled booking)' : s.arriveInDays > PASS_RULES.opensDaysBefore ? ' (arrives in 12 days)' : ''}</span>)}.
            {' '}Or the email link: <Link to={`${ROOT}/gestir?pass=demo-alft`} reloadDocument>open as James</Link>. Live, SNDR Bókun issues one pass per booking and checks it on the server.</p>
        </details>
      </section>
    </main>
  )
}

/* ════════════════════════════════ MANUAL ══════════════════════════════════ */
function Manual({ stay, onClose, fromGate }: { stay: Stay; onClose: () => void; fromGate: boolean }) {
  const house = stay.house
  const c = CHAPTERS.find((x) => x.id === house)!
  const d = DOORS.find((x) => x.id === house)!
  const imgs = MANUAL_IMAGES[house] ?? {}
  const coords = MANUAL_COORDS[house]
  const secs = useMemo(() => sectionsFor(house), [house])
  const facts = [...(MANUAL_FACTS.all ?? []), ...(MANUAL_FACTS[house] ?? [])]
  const [active, setActive] = useState(secs[0]?.id ?? '')
  const barRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const light = useMemo(() => {
    if (!coords) return null
    const now = new Date()
    const s = sunTimes(now, coords.lat, coords.lon)
    if (s.kind !== 'normal') return { line: s.kind === 'night' ? 'The sun stays below the horizon today.' : 'The sun does not set today.', dark: s.kind === 'night' }
    const mins = Math.round((s.set.getTime() - s.rise.getTime()) / 60000)
    const after = now > s.set || now < s.rise
    return { rise: hm(s.rise), set: hm(s.set), len: `${Math.floor(mins / 60)} h ${mins % 60} min`, dark: after }
  }, [coords])

  /* scrollspy: the section crossing the upper third is the active one */
  useEffect(() => {
    const els = secs.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (vis[0]) setActive(vis[0].target.id)
    }, { rootMargin: '-30% 0px -60% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [secs])
  /* keep the active chip in view inside the bar, never scrolling the page */
  useEffect(() => {
    const bar = barRef.current
    const chip = bar?.querySelector<HTMLElement>(`[data-s="${active}"]`)
    if (!bar || !chip) return
    const left = chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2
    bar.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [active])
  /* the active chip's underline slides to it (transform only) */
  const [ind, setInd] = useState({ x: 0, w: 0 })
  useEffect(() => {
    const place = () => {
      const chip = barRef.current?.querySelector<HTMLElement>(`[data-s="${active}"]`)
      if (chip) setInd({ x: chip.offsetLeft, w: chip.offsetWidth })
    }
    place(); window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active])
  /* in-page jumps glide (and land under the bar); reduced motion jumps */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      const el = a && document.getElementById(a.getAttribute('href')!.slice(1))
      if (!a || !el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
      window.history.replaceState(null, '', `#${el.id}`)
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [])
  /* reveal: sections and cards rise in once */
  useEffect(() => {
    const root = rootRef.current
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    root.classList.add('is-js')
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-on'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' })
    root.querySelectorAll('.ill-g-rise').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const hero = imgs.hero ?? { img: d.img as keyof typeof IMG, alt: d.alt }
  const statFacts = c.facts.slice(0, 4)

  return (
    <div className={`ill-g-man ${fromGate ? 'is-from-gate' : ''}`} ref={rootRef}>
      <header className="ill-g-hero">
        <div className="ill-g-hero-img"><Pic src={IMG[hero.img]} alt={hero.alt} eager sizes="(orientation: portrait) 150vh, 100vw" /></div>
        <div className="ill-g-hero-in">
          <p className="ill-g-eye is-ice"><Icon n="key" size={14} /> Welcome, {stay.guest}</p>
          <h1>{c.name}</h1>
          <p className="ill-g-hero-water">{c.water}</p>
          <p className="ill-g-hero-stay">{fmtShortDay(stay.arrive)} <i aria-hidden="true">→</i> {fmtShortDay(stay.leave)} · check-out {PASS_RULES.closesAt}</p>
          {coords && <p className="ill-g-hero-coord"><Icon n="pin" size={14} /> {dms(coords.lat, 'N', 'S')} · {dms(coords.lon, 'E', 'W')} <span>the lake</span></p>}
        </div>
      </header>

      <div className="ill-g-strip">
        <ul className="ill-g-stats">
          {statFacts.map((f, i) => <li key={f.l} className="ill-g-in" style={{ '--i': i + 3 } as React.CSSProperties}><Icon n={factIcon(f.l)} /><b>{f.n}</b><span>{f.l}</span></li>)}
        </ul>
        {light && (
          <div className="ill-g-light" aria-label="Today at the lake">
            <Icon n={light.dark ? 'moon' : 'sun'} />
            {'rise' in light
              ? <p><span>Today at the lake</span><b>{light.rise} sunrise · {light.set} sunset</b><i>{light.len} of daylight{light.dark ? ' · dark now, look north for the aurora' : ''}</i></p>
              : <p><span>Today at the lake</span><b>{light.line}</b></p>}
          </div>
        )}
      </div>

      <div className="ill-g-quick" role="list" aria-label="Most asked">
        {QUICK.filter((q) => secs.some((x) => x.id === q.id)).map((q, i) => (
          <a role="listitem" key={q.id} href={`#${q.id}`} className="ill-g-rise" style={{ '--i': i } as React.CSSProperties}><Icon n={SECTION_ICON[q.id]} size={26} /><b>{q.label}</b><span>{q.hint}</span></a>
        ))}
      </div>

      <nav className="ill-g-bar" aria-label="In this manual">
        <div className="ill-g-bar-in" ref={barRef}>
          <span className="ill-g-bar-ind" aria-hidden="true" style={{ transform: `translateX(${ind.x}px) scaleX(${ind.w / 100})` }} />
          {secs.map((s) => (
            <a key={s.id} href={`#${s.id}`} data-s={s.id} className={active === s.id ? 'is-on' : ''} aria-current={active === s.id ? 'true' : undefined}>
              <Icon n={SECTION_ICON[s.id] ?? 'sparkle'} size={18} /><span>{SHORT[s.id] ?? s.title}</span>
            </a>
          ))}
        </div>
      </nav>

      <div className="ill-g-body">
        <aside className="ill-g-rail" aria-hidden="true">
          <ol>{secs.map((s, i) => <li key={s.id} className={active === s.id ? 'is-on' : ''}><a href={`#${s.id}`} tabIndex={-1}><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</a></li>)}</ol>
          <div className="ill-g-rail-act">
            <button type="button" onClick={() => window.print()}><Icon n="print" size={16} /> Print</button>
            <button type="button" onClick={onClose}><Icon n="lock" size={16} /> Lock</button>
          </div>
        </aside>

        <div className="ill-g-secs">
          {secs.map((s, i) => {
            const pic = imgs[s.id]
            return (
              <section key={s.id} id={s.id} className="ill-g-sec ill-g-rise" aria-labelledby={`h-${s.id}`}>
                <header className="ill-g-sec-head">
                  <span className="ill-g-sec-ico"><Icon n={SECTION_ICON[s.id] ?? 'sparkle'} size={24} /></span>
                  <span className="ill-g-sec-num">{String(i + 1).padStart(2, '0')}</span>
                  <h2 id={`h-${s.id}`}>{s.title}</h2>
                </header>
                {s.facts.length > 0 && <ul className={`ill-g-facts ${s.id === 'yours' ? 'is-grid' : ''}`}>{s.facts.map((f) => <li key={f}>{f}</li>)}</ul>}
                {s.id === 'directions' && <div className="ill-g-map"><HouseMap id={house} /></div>}
                {pic && <figure className="ill-g-fig"><Pic src={IMG[pic.img]} alt={pic.alt} sizes="(max-width: 900px) 100vw, 640px" /></figure>}
                {s.id === 'yours' && c.photos.length > 0 && (
                  <div className="ill-g-reel" role="list" aria-label={`${c.name} in pictures`}>
                    {c.photos.slice(0, 6).map((p) => <figure role="listitem" key={p.img}><Pic src={IMG[p.img]} alt={p.alt} sizes="(max-width: 640px) 70vw, 280px" /><figcaption>{p.alt}</figcaption></figure>)}
                  </div>
                )}
                {s.text.map((t, k) => <p className="ill-g-text" key={k}>{t}</p>)}
                {s.todo && <p className="ill-g-todo"><b>Signý fills in:</b> {s.todo}</p>}
                {s.id === 'emergency' && (
                  <div className="ill-g-call">
                    <a href="tel:112" className="is-sos"><Icon n="lifebuoy" size={18} /> Call 112</a>
                    <a href={PHONE_HREF}><Icon n="phone" size={18} /> Call the host</a>
                    <a href={EMAIL_HREF}><Icon n="mail" size={18} /> Email</a>
                  </div>
                )}
              </section>
            )
          })}

          {facts.length > 0 && (
            <section className="ill-g-know ill-g-rise" aria-labelledby="h-know">
              <p className="ill-g-eye is-ice"><Icon n="sparkle" size={14} /> Good to know</p>
              <h2 id="h-know">The place around you</h2>
              <ul>{facts.map((f) => <li key={f.title}><Icon n={f.icon} size={28} /><b>{f.title}</b><p>{f.body}</p></li>)}</ul>
            </section>
          )}

          <footer className="ill-g-foot">
            <p>Questions during your stay: <a href={PHONE_HREF}>{PHONE_DISPLAY}</a> · <a href={EMAIL_HREF}>{EMAIL}</a></p>
            <p className="ill-g-small">Prototype. House facts are from the site; Good to know is general knowledge about the area; every “Signý fills in” is hers to write in the manual editor.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════ PAGE ════════════════════════════════════ */
export default function Guests() {
  const [boot] = useState<{ stay: Stay | null; notice?: string }>(() => {
    /* 1) the private link from the confirmation: authoritative, never falls back to device memory */
    let token: string | null = null
    try { token = new URLSearchParams(window.location.search).get('pass') } catch { /* no URL access */ }
    if (token) {
      const r = resolvePass({ token })
      if (r.kind === 'open') { const s = DEMO_STAYS.find((x) => x.token === token)!; rememberPass(r.stay, s.pin); return { stay: r.stay } }
      forgetPass()
      const notice = r.kind === 'early' ? `Your manual opens on ${fmtDay(r.opens)}, three days before you arrive.`
        : r.kind === 'over' ? 'That stay has ended. Thank you for staying with us.'
        : r.kind === 'cancelled' ? 'This booking was cancelled, so its link no longer opens a manual.'
        : 'That link is not valid. Enter the 4-digit pass from your booking confirmation.'
      return { stay: null, notice }
    }
    /* 2) a pass remembered on this device, until check-out */
    const r = recallPass()
    return { stay: r && r.kind === 'open' ? r.stay : null }
  })
  const [stay, setStay] = useState<Stay | null>(boot.stay)
  /* the manual closes itself at check-out, also when the tab was left open */
  useEffect(() => {
    if (!stay) return
    const expire = () => { if (Date.now() >= stay.leave.getTime()) { forgetPass(); setStay(null) } }
    const ms = Math.min(stay.leave.getTime() - Date.now(), 2 ** 31 - 1)
    const id = window.setTimeout(expire, Math.max(0, ms))
    const onVis = () => { if (document.visibilityState === 'visible') expire() }
    document.addEventListener('visibilitychange', onVis)
    return () => { window.clearTimeout(id); document.removeEventListener('visibilitychange', onVis) }
  }, [stay])
  useEffect(() => {
    document.title = stay ? `${DOORS.find((d) => d.id === stay.house)?.name ?? ''} · House manual` : 'House manual · Iceland Luxury Lodges'
    setThemeColor(stay ? '#0E161D' : '#0E161D')
  }, [stay])
  useEffect(() => setNoindex(true), [])
  /* the link has done its job: keep the token out of the address bar and history */
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('pass')) window.history.replaceState(null, '', window.location.pathname)
  }, [])

  const [fromGate, setFromGate] = useState(false)
  const open = (s: Stay) => morph(() => { setFromGate(true); setStay(s); window.scrollTo(0, 0) })
  const close = () => { forgetPass(); window.scrollTo(0, 0); morph(() => setStay(null)) }

  return (
    <div className={`ill-root ill-g ${stay ? 'is-open' : 'is-gate'}`}>
      <style dangerouslySetInnerHTML={{ __html: G_STYLES + MAP_STYLES }} />
      <header className="ill-g-top">
        <Link className="ill-g-mark" to={ROOT}>Iceland Luxury Lodges</Link>
        {stay && <div className="ill-g-actions">
          <button type="button" onClick={() => window.print()} aria-label="Print the manual"><Icon n="print" size={18} /><span>Print</span></button>
          <button type="button" onClick={close} aria-label="Lock the manual on this device"><Icon n="lock" size={18} /><span>Lock</span></button>
        </div>}
      </header>
      {stay ? <Manual key={stay.house} stay={stay} onClose={close} fromGate={fromGate} /> : <Gate onOpen={open} notice={boot.notice} />}
    </div>
  )
}

const B = import.meta.env.BASE_URL
const G_STYLES = `
@font-face{font-family:'SentientIll';src:url('${B}fonts/sentient/Sentient-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'SentientIll';src:url('${B}fonts/sentient/Sentient-LightItalic.woff2') format('woff2');font-weight:300;font-style:italic;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('${B}fonts/switzer/Switzer-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('${B}fonts/switzer/Switzer-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('${B}fonts/switzer/Switzer-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
.ill-g{--ice:#EFF3F5;--ink:#0E161D;--dusk:#41607A;--bg:var(--ice);--fg:var(--ink);--acc:var(--dusk);
  --ink-soft:color-mix(in srgb,var(--fg) 78%,transparent);--ink-mute:color-mix(in srgb,var(--fg) 60%,transparent);
  --hair:color-mix(in srgb,var(--fg) 14%,transparent);--card:color-mix(in srgb,var(--fg) 3.5%,var(--bg));
  --serif:'SentientIll','Cormorant Garamond',Georgia,serif;--sans:'SwitzerIll','Helvetica Neue',Arial,sans-serif;
  --e:cubic-bezier(.22,.9,.28,1);--e2:cubic-bezier(.32,.72,0,1);
  min-height:100svh;background:var(--bg);color:var(--fg);font-family:var(--sans);font-weight:300;line-height:1.6;overflow-x:clip}
.ill-g *{box-sizing:border-box;margin:0}
.ill-g a{color:inherit}
.ill-g img{display:block;width:100%;height:100%;object-fit:cover}
.ill-g picture{display:contents}
.ill-g :focus-visible{outline:2px solid var(--acc);outline-offset:3px}
.ill-g :where(button,a,input){touch-action:manipulation}
.ill-g :where(button){font:inherit;color:inherit;background:none;border:0;cursor:pointer;-webkit-appearance:none;appearance:none;border-radius:0}
.ill-g-ico{flex:none;display:block}
.ill-g-eye{display:inline-flex;align-items:center;gap:8px;font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:var(--acc);font-weight:500}
.ill-g-eye.is-ice{color:rgba(239,243,245,.86)}
.ill-g-know .ill-g-eye.is-ice{color:#B9CEDC}

/* top bar: sits over the photograph on both pages */
.ill-g-top{position:absolute;top:0;left:0;right:0;z-index:5;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:max(22px,env(safe-area-inset-top)) max(clamp(20px,4vw,48px),env(safe-area-inset-right)) 22px max(clamp(20px,4vw,48px),env(safe-area-inset-left))}
.ill-g .ill-g-mark{font-family:var(--serif);font-size:1.15rem;text-decoration:none;white-space:nowrap;color:#F6F9FA;text-shadow:0 1px 18px rgba(14,22,29,.45)}
.ill-g-actions{display:flex;gap:8px}
.ill-g-actions button{display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;color:#F6F9FA;font-size:.8rem;letter-spacing:.04em;
  background:rgba(14,22,29,.28);box-shadow:inset 0 0 0 1px rgba(246,249,250,.38);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);transition:background .3s var(--e)}
@media (hover:hover) and (pointer:fine){.ill-g-actions button:hover{background:rgba(14,22,29,.5)}}

/* ═══ GATE: the stay pass. Full-bleed photograph, one glass column, four dots, a round pad ═══ */
.ill-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ill-g-gate{position:relative;min-height:100svh;display:grid;place-items:center;padding:96px 20px 40px;background:var(--ink);color:#F6F9FA;overflow:hidden}
.ill-g-stage{position:absolute;inset:0}
.ill-g-stage-img{position:absolute;inset:0;opacity:0;transform:scale(1.05);transition:opacity 1.2s var(--e2),transform 2.2s var(--e2)}
.ill-g-stage-img.is-on{opacity:1;transform:none;view-transition-name:ill-photo}
::view-transition-group(ill-photo){animation-duration:.75s;animation-timing-function:cubic-bezier(.32,.72,0,1)}
::view-transition-old(ill-photo),::view-transition-new(ill-photo){height:100%;width:100%;object-fit:cover;animation-duration:.75s}
::view-transition-old(root),::view-transition-new(root){animation-duration:.42s;animation-timing-function:cubic-bezier(.22,.9,.28,1)}
.ill-g-stage::after{content:'';position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 55%,rgba(14,22,29,.35) 0%,rgba(14,22,29,.72) 70%),linear-gradient(180deg,rgba(14,22,29,.4),rgba(14,22,29,.1) 30%,rgba(14,22,29,.55))}
.ill-g-pass{position:relative;z-index:2;width:min(100%,400px);display:grid;justify-items:center;gap:14px;text-align:center;padding:34px 28px 26px;
  background:rgba(14,22,29,.32);box-shadow:inset 0 0 0 1px rgba(246,249,250,.16),0 40px 80px -40px rgba(0,0,0,.6);-webkit-backdrop-filter:blur(22px) saturate(1.2);backdrop-filter:blur(22px) saturate(1.2)}
.ill-g-pass h1{font-family:var(--serif);font-weight:300;font-size:clamp(2rem,4.4vw,2.8rem);line-height:1.04;letter-spacing:-.01em}
/* entrance: the glass settles, then its contents rise in a short stagger (once per visit) */
.ill-g-pass{animation:ill-g-panel .9s var(--e2) .1s both}
@keyframes ill-g-panel{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:none}}
.ill-g-in{animation:ill-g-rise-in .6s var(--e2) both;animation-delay:calc(var(--i,0) * 50ms + 220ms)}
@keyframes ill-g-rise-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.ill-g-pass h1.is-swap{animation:ill-g-up .6s var(--e2) both}
/* leaving: the panel lifts away and the scrim thins, so the photograph carries the moment */
.ill-g-pass{transition:opacity .32s var(--e),transform .32s var(--e)}
.is-leaving .ill-g-pass{opacity:0;transform:translateY(-12px) scale(.985)}
.ill-g-stage::after{transition:opacity .6s var(--e)}
.is-leaving .ill-g-stage::after{opacity:.4}
.ill-g-pass-coord{font-size:.78rem;letter-spacing:.08em;color:rgba(246,249,250,.78);animation:ill-g-up .7s var(--e2) .08s both}
@keyframes ill-g-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.ill-g-pin-real{position:absolute;top:0;left:0;width:1px;height:1px;opacity:0;border:0;padding:0;font-size:16px}
.ill-g-dots{position:relative;display:flex;gap:18px;padding:16px 4px 6px;cursor:text}
.ill-g-dots.is-focus{box-shadow:0 1px 0 rgba(246,249,250,.7)}
.ill-g-dots span{position:relative;width:14px;height:14px;border-radius:50%;box-shadow:inset 0 0 0 1.25px rgba(246,249,250,.75);transition:transform .38s var(--e2),opacity .3s var(--e)}
.ill-g-dots span::after{content:'';position:absolute;inset:0;border-radius:50%;background:#F6F9FA;opacity:0;transform:scale(.5);transition:transform .16s cubic-bezier(.34,1.3,.64,1),opacity .12s var(--e),background .2s var(--e)}
.ill-g-dots span.is-on::after{opacity:1;transform:none}
.is-wrong .ill-g-dots span::after,.is-paused .ill-g-dots span::after{background:#E8A79C;transition-delay:calc((3 - var(--d)) * 45ms)}
.ill-g-tick{position:absolute;left:50%;top:50%;margin:-6px 0 0 -14px;color:#F6F9FA;opacity:0}
.ill-g-tick path{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .42s var(--e2) .26s}
.is-ok .ill-g-dots span{opacity:0;transform:translateX(calc((1.5 - var(--d)) * 32px)) scale(.5)}
.is-ok .ill-g-tick{opacity:1;transition:opacity .2s var(--e) .22s}
.is-ok .ill-g-tick path{stroke-dashoffset:0}
.is-wrong .ill-g-dots,.is-paused .ill-g-dots{animation:ill-g-shake .42s var(--e)}
.is-wrong .ill-g-dots span.is-on,.is-paused .ill-g-dots span.is-on{background:#E8A79C}
@keyframes ill-g-shake{20%{transform:translateX(-7px)}45%{transform:translateX(6px)}70%{transform:translateX(-3px)}90%{transform:translateX(1px)}}
.ill-g-pass-status{min-height:2.8em;max-width:30ch;font-size:.86rem;line-height:1.45;color:rgba(246,249,250,.78)}
.is-wrong .ill-g-pass-status,.is-paused .ill-g-pass-status{color:#F2C3BB}
.ill-g-pad{display:grid;grid-template-columns:repeat(3,72px);gap:14px 22px;margin:4px 0 6px}
.ill-g-pad button{width:72px;height:72px;border-radius:50%;display:grid;place-items:center;font-family:var(--serif);font-size:1.75rem;font-weight:300;color:#F6F9FA;
  background:rgba(246,249,250,.06);box-shadow:inset 0 0 0 1px rgba(246,249,250,.22);transition:background .26s var(--e),transform .26s var(--e)}
.ill-g-pad button.is-del{background:none;box-shadow:none}
.ill-g-pad button:active:not(:disabled){transform:scale(.92);background:rgba(246,249,250,.24);transition-duration:.06s}
.ill-g-pad button.is-hit{background:rgba(246,249,250,.24);transition-duration:.06s}
.ill-g-pad button.is-del:active:not(:disabled),.ill-g-pad button.is-del.is-hit{background:rgba(246,249,250,.1)}
.ill-g-pad button:disabled{opacity:.4;cursor:default}
@media (hover:hover) and (pointer:fine){.ill-g-pad button:hover:not(:disabled):not(.is-del){background:rgba(246,249,250,.14)}}
.ill-g-pass-help{font-size:.8rem;line-height:1.5;color:rgba(246,249,250,.68);max-width:34ch}
.ill-g-pass-help a{color:#F6F9FA;text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(246,249,250,.35)}
.ill-g-pass-demo{font-size:.76rem;color:rgba(246,249,250,.7);max-width:34ch}
.ill-g-pass-demo summary{cursor:pointer;letter-spacing:.14em;text-transform:uppercase;font-size:.64rem;color:rgba(246,249,250,.6);list-style:none;padding:6px}
.ill-g-pass-demo summary::-webkit-details-marker{display:none}
.ill-g-pass-demo p{padding-top:4px}
.ill-g-pass-demo code{font-family:var(--sans);font-weight:500;letter-spacing:.12em;color:#F6F9FA}
.ill-g-pass-demo a{color:#F6F9FA;text-decoration:underline;text-underline-offset:3px}
@media (max-width:420px){.ill-g-pad{grid-template-columns:repeat(3,68px);gap:12px 20px}.ill-g-pad button{width:68px;height:68px}.ill-g-pass{padding:28px 18px 20px;background:rgba(14,22,29,.26)}}

/* ═══ MANUAL ═══ */
.ill-g-hero{position:relative;height:min(78svh,760px);min-height:460px;color:#F6F9FA;overflow:hidden;background:var(--ink)}
.ill-g-hero-img{position:absolute;inset:0;animation:ill-g-settle 1.6s var(--e2) both;view-transition-name:ill-photo}
.is-from-gate .ill-g-hero-img{animation:none}
@keyframes ill-g-settle{from{transform:scale(1.05)}to{transform:none}}
.ill-g-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,22,29,.42) 0%,rgba(14,22,29,0) 30%,rgba(14,22,29,.12) 55%,rgba(14,22,29,.7) 100%)}
.ill-g-hero-in{position:absolute;left:0;right:0;bottom:0;z-index:2;max-width:1280px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(30px,6vh,60px);display:grid;gap:10px}
.ill-g-hero h1{font-family:var(--serif);font-weight:300;font-size:clamp(3rem,9vw,7.2rem);line-height:.98;letter-spacing:-.015em;animation:ill-g-up .9s var(--e2) .1s both}
.ill-g-hero-water{font-family:var(--serif);font-style:italic;font-size:clamp(1.1rem,2vw,1.5rem);color:rgba(246,249,250,.9);animation:ill-g-up .9s var(--e2) .18s both}
.ill-g-hero-coord{display:inline-flex;align-items:center;gap:8px;font-size:.8rem;letter-spacing:.08em;color:rgba(246,249,250,.8);animation:ill-g-up .9s var(--e2) .26s both}
.ill-g-hero-coord span{font-family:var(--serif);font-style:italic;letter-spacing:0;opacity:.8}
.ill-g-strip{max-width:1280px;margin:0 auto;padding:clamp(28px,5vh,44px) clamp(20px,5vw,64px);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:clamp(20px,4vw,56px);align-items:center;border-bottom:1px solid var(--hair)}
.ill-g-stats{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:clamp(20px,4vw,48px)}
.ill-g-stats li{display:grid;grid-template-columns:auto auto;grid-template-rows:auto auto;column-gap:12px;align-items:center}
.ill-g-stats .ill-g-ico{grid-row:1/3;color:var(--acc)}
.ill-g-stats b{font-family:var(--serif);font-weight:300;font-size:1.7rem;line-height:1}
.ill-g-stats span{font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-mute)}
.ill-g-light{display:flex;gap:14px;align-items:center;padding:14px 18px;background:var(--card);box-shadow:inset 0 0 0 1px var(--hair)}
.ill-g-light .ill-g-ico{color:var(--acc)}
.ill-g-light p{display:grid;gap:1px}
.ill-g-light span{font-size:.66rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-mute);font-weight:500}
.ill-g-light b{font-weight:400;font-size:.95rem;font-variant-numeric:tabular-nums}
.ill-g-light i{font-style:normal;font-size:.82rem;color:var(--ink-mute)}

.ill-g-hero-stay{font-size:.86rem;letter-spacing:.04em;color:rgba(246,249,250,.9);animation:ill-g-up .9s var(--e2) .22s both}
.ill-g-hero-stay i{font-style:normal;opacity:.7}
/* quick tiles: the four things a guest looks for first */
.ill-g-quick{max-width:1280px;margin:0 auto;padding:clamp(20px,3vh,28px) clamp(20px,5vw,64px) 0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.ill-g-quick a{display:grid;gap:4px;padding:18px 18px 16px;text-decoration:none;background:var(--card);box-shadow:inset 0 0 0 1px var(--hair);transition:background .25s var(--e),transform .15s var(--e)}
.ill-g-quick a .ill-g-ico{color:var(--acc);margin-bottom:10px}
.ill-g-quick b{font-family:var(--serif);font-weight:300;font-size:1.25rem;line-height:1.1}
.ill-g-quick span{font-size:.78rem;color:var(--ink-mute)}
.ill-g-quick a:active{transform:scale(.98)}
@media (hover:hover) and (pointer:fine){.ill-g-quick a:hover{background:color-mix(in srgb,var(--fg) 7%,var(--bg))}}
/* the icon bar: a floating glass bar that follows the reader; a bottom dock on phones */
.ill-g-bar{position:sticky;top:12px;z-index:4;max-width:1280px;margin:18px auto 0;padding:0 clamp(20px,5vw,64px)}
.ill-g-bar > .ill-g-bar-in{background:color-mix(in srgb,var(--bg) 78%,transparent);-webkit-backdrop-filter:blur(18px) saturate(1.3);backdrop-filter:blur(18px) saturate(1.3);box-shadow:inset 0 0 0 1px var(--hair),0 18px 40px -28px rgba(14,22,29,.45)}
.ill-g-bar-in{position:relative;display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;padding:6px;scroll-padding:0 24px}
.ill-g-bar-ind{position:absolute;left:0;bottom:7px;width:100px;height:1px;background:var(--fg);transform-origin:0 50%;transition:transform .3s var(--e2);pointer-events:none}
.ill-g-bar-in::-webkit-scrollbar{display:none}
.ill-g-bar a{flex:none;display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;text-decoration:none;font-size:.84rem;color:var(--ink-soft);
  box-shadow:inset 0 0 0 1px transparent;transition:color .25s var(--e),box-shadow .25s var(--e),background .25s var(--e)}
.ill-g-bar a .ill-g-ico{color:var(--acc)}
.ill-g-bar a.is-on{color:var(--fg)}
@media (hover:hover) and (pointer:fine){.ill-g-bar a:hover{color:var(--fg)}}

.ill-g-body{max-width:1280px;margin:0 auto;padding:0 clamp(20px,5vw,64px);display:grid;grid-template-columns:240px minmax(0,1fr);gap:clamp(32px,6vw,96px)}
.ill-g-rail{position:sticky;top:84px;align-self:start;padding-top:clamp(40px,7vh,72px);display:grid;gap:28px}
.ill-g-rail ol{list-style:none;padding:0;display:grid;gap:2px;border-left:1px solid var(--hair)}
.ill-g-rail a{display:flex;gap:12px;padding:6px 0 6px 16px;margin-left:-1px;text-decoration:none;font-size:.88rem;color:var(--ink-mute);border-left:1px solid transparent;transition:color .25s var(--e),border-color .25s var(--e)}
.ill-g-rail a span{font-variant-numeric:tabular-nums;font-size:.74rem;padding-top:.15em}
.ill-g-rail li.is-on a{color:var(--fg);border-left-color:var(--fg)}
.ill-g-rail-act{display:flex;gap:16px;font-size:.82rem}
.ill-g-rail-act button{display:inline-flex;align-items:center;gap:6px;color:var(--ink-soft);border-bottom:1px solid var(--hair);padding:4px 0}
.ill-g-secs{min-width:0;padding:clamp(24px,5vh,56px) 0 40px}
.ill-g-sec{padding:clamp(34px,6vh,56px) 0;border-bottom:1px solid var(--hair);scroll-margin-top:72px;max-width:720px}
.ill-g-sec-head{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:16px;align-items:center;margin-bottom:18px}
.ill-g-sec-ico{grid-row:1/3;display:grid;place-items:center;width:52px;height:52px;color:var(--acc);background:var(--card);box-shadow:inset 0 0 0 1px var(--hair)}
.ill-g-sec-num{font-size:.7rem;letter-spacing:.2em;color:var(--ink-mute);font-variant-numeric:tabular-nums}
.ill-g-sec h2{font-family:var(--serif);font-weight:300;font-size:clamp(1.6rem,2.8vw,2.2rem);line-height:1.1}
.ill-g-facts{list-style:none;padding:0;display:grid;gap:8px;margin-bottom:16px}
.ill-g-facts.is-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 24px}
.ill-g-facts li{padding-left:18px;position:relative}
.ill-g-facts li::before{content:'';position:absolute;left:0;top:.8em;width:8px;height:1px;background:var(--fg)}
.ill-g-fig{margin:6px 0 18px;aspect-ratio:16/9;overflow:hidden;background:var(--ink)}
.ill-g-reel{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;margin:6px calc(-1 * clamp(20px,5vw,64px)) 18px 0;padding-bottom:6px;scrollbar-width:thin}
.ill-g-reel figure{flex:none;width:clamp(220px,26vw,280px);scroll-snap-align:start;display:grid;gap:8px}
.ill-g-reel figure > picture img,.ill-g-reel img{aspect-ratio:4/5;height:auto}
.ill-g-reel figcaption{font-size:.8rem;color:var(--ink-mute);line-height:1.4}
.ill-g-text{margin-bottom:10px;max-width:62ch}
.ill-g-todo{font-size:.9rem;color:var(--ink-soft);padding:12px 16px;border-left:2px solid var(--acc);background:color-mix(in srgb,var(--acc) 7%,var(--bg))}
.ill-g-todo b{font-weight:500;color:var(--acc)}
.ill-g-map{margin:6px 0 18px}
.ill-g-map .ill-hp-map{grid-template-columns:minmax(0,1fr);margin:0}
.ill-g-map .ill-hp-map-copy{display:none}
.ill-g-call{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.ill-g-call a{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 18px;text-decoration:none;font-size:.88rem;background:var(--card);box-shadow:inset 0 0 0 1px var(--hair);transition:background .25s var(--e)}
.ill-g-call a.is-sos{background:var(--ink);color:#F6F9FA;box-shadow:none}
@media (hover:hover) and (pointer:fine){.ill-g-call a:not(.is-sos):hover{background:color-mix(in srgb,var(--fg) 8%,var(--bg))}}
.ill-g-call a:active{transform:scale(.98)}

/* good to know: the one INK band of the manual */
.ill-g-know{margin:clamp(40px,7vh,72px) 0 0;padding:clamp(36px,6vh,56px) clamp(22px,4vw,44px);background:var(--ink);color:#EFF3F5;display:grid;gap:12px}
.ill-g-know h2{font-family:var(--serif);font-weight:300;font-size:clamp(1.8rem,3.2vw,2.6rem);line-height:1.1;margin-bottom:12px}
.ill-g-know ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));border-top:1px solid rgba(239,243,245,.14)}
.ill-g-know li{padding:24px 22px 26px 0;display:grid;gap:8px;align-content:start;border-bottom:1px solid rgba(239,243,245,.14)}
.ill-g-know li .ill-g-ico{color:#B9CEDC;margin-bottom:6px}
.ill-g-know b{font-family:var(--serif);font-weight:300;font-size:1.25rem}
.ill-g-know p{font-size:.9rem;color:rgba(239,243,245,.76)}
.ill-g-foot{padding-top:32px;display:grid;gap:8px;font-size:.92rem}
.ill-g-small{font-size:.8rem;color:var(--ink-mute)}

/* reveals (transform + opacity only) */
.is-js .ill-g-rise{opacity:0;transform:translateY(22px);transition:opacity .9s var(--e2),transform .9s var(--e2);transition-delay:calc(var(--i,0) * 60ms)}
.is-js .ill-g-rise.is-on{opacity:1;transform:none}

@media (max-width:1020px){
  .ill-g-body{grid-template-columns:minmax(0,1fr)}
  .ill-g-rail{display:none}
  .ill-g-strip{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:640px){
  .ill-g-actions button span{display:none}
  .ill-g-actions button{width:40px;padding:0;justify-content:center}
  .ill-g-hero{height:68svh;min-height:420px}
  .ill-g-quick{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ill-g-bar{position:fixed;top:auto;bottom:max(10px,env(safe-area-inset-bottom));left:10px;right:10px;margin:0;padding:0;z-index:6}
  .ill-g-bar a span{font-size:.78rem}
  .ill-g-man{padding-bottom:84px}
  .ill-g-sec{scroll-margin-top:20px}
  .ill-g-facts.is-grid{grid-template-columns:minmax(0,1fr)}
  .ill-g-sec-ico{width:44px;height:44px}
  .ill-g-know{margin-left:-20px;margin-right:-20px}
}
@media (prefers-reduced-motion:reduce){
  .ill-g *,.ill-g *::before,.ill-g *::after{animation:none !important;transition-duration:.01ms !important}
  .ill-g-stage-img{transform:none}
}
@media print{
  .ill-g-top,.ill-g-bar,.ill-g-rail,.ill-g-map,.ill-g-reel,.ill-g-call,.ill-g-fig{display:none !important}
  .ill-g{background:#fff;min-height:0}
  .ill-g-hero{height:auto;min-height:0;background:none;color:var(--ink)}
  .ill-g-hero-img,.ill-g-hero::after{display:none}
  .ill-g-hero-in{position:static;padding:0 0 16px}
  .ill-g-hero h1,.ill-g-hero-water,.ill-g-hero-coord{color:var(--ink);animation:none}
  .ill-g-body{display:block;padding:0}
  .ill-g-sec{break-inside:avoid;padding:14px 0;max-width:none}
  .ill-g-know{background:none;color:var(--ink);padding:16px 0}
  .ill-g-know ul{background:none}.ill-g-know li{background:none;padding:8px 0}.ill-g-know p{color:var(--ink-soft)}
  .is-js .ill-g-rise{opacity:1;transform:none}
}
`
