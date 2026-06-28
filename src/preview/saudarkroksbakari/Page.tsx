import { useEffect, useRef, useState } from 'react'
import { useReducedMotion, useScroll, useTransform, motion, AnimatePresence } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import { CATERING_PLATTERS, DIETARY, HOURS, IMG, MENU, PRODUCTS, SOCIAL, VISIT } from './data'
import { ExpandMap } from './ExpandMap'
import CurvedLoop from '../../components/CurvedLoop'

const company = getPreviewCompany('saudarkroksbakari')

/* Asset base — must honor Vite's base so direct <img src> work under the
   GitHub Pages subpath (/iceland-frumgerdir/), not just at local-dev root. */
const BK_ASSETS = `${import.meta.env.BASE_URL}saudarkroksbakari/`

/* ── Design tokens ─────────────────────────────────────────────────── */
const CREAM = '#FAF4E8'
const WARM_CREAM = '#F0E3C5'
const CARD_BG = '#FBF8F2'
const ESPRESSO = '#1A0F06'
const AMBER = '#B5722E'
const AMBER_DARK = '#8C5420'
const SAGE = '#56654F'

/* ── Bilingual copy ─────────────────────────────────────────────────── */
type Lang = 'is' | 'en'

const COPY = {
  is: {
    navLink1: 'Sagan', navLink2: 'Heimsókn', navCta: 'Heimsókn',
    eyebrow: 'Bakarí · Sauðárkrókur · Ísland',
    heroH1a: 'bakað af alúð', heroH1b: 'alla daga', heroH1c: '',
    heroBody: 'Ástríða fyrir bakstri í meira en öld.',
    ctaPrimary: 'Skoða úrvalið', ctaPhone: 'Hringja · 455 5000',
    prodEyebrow: 'Úr ofninum', prodH2: 'handverk í hverjum bita',
    prodBody: 'Við bökum allt frá grunni: kanelsnúða, rúgbrauð og croissant. Engin fjöldaframleiðsla, bara hendur og natni.',
    signaturePill: 'Sérleikinn',
    sagaEyebrow: 'Sagan', sagaH2: 'stofnað 1880, elsta bakarí Íslands',
    sagaPara1: 'Allt frá fyrsta degi hefur ofninn við Aðalgötu verið kveiktur fyrir sólarupprás. Hver kynslóð hefur skilað uppskriftunum áfram, óbreyttum.',
    sagaPara2: 'Bruninn árið 1979 eyðilagði nánast allt, en uppskriftirnar lifðu af. Daginn eftir hófst baksturinn á ný.',
    statFounded: 'Stofnað', statYears: 'Ára saga', statRating: 'Tripadvisor',
    intEyebrow: 'Staðurinn', intH2: 'bjart hús með fjörutíu sætum',
    intBody: 'Rúmgott og bjart, með sætum bæði inni og úti á veröndinni þegar viðrar.',
    revEyebrow: 'Umsagnir', revH2: '4,7 stjörnur og Travelers\' Choice',
    revDisclaimer: 'Sýnishorn úr umsögnum gesta á Tripadvisor og Google.',
    visitEyebrow: 'Heimsókn', visitH2: 'Aðalgata 5, í hjarta bæjarins',
    addrEyebrow: 'Heimilisfang', hoursEyebrow: 'Opnunartímar', openBadge: 'Opið núna',
    phoneEyebrow: 'Sími', emailEyebrow: 'Netfang',
    addrBtn: 'Opna í kortum', callBtn: 'Hringja', emailBtn: 'Senda tölvupóst', langOther: 'EN',
    navLink3: 'Opnunartímar',
    footerAddress: 'Staður', footerHours: 'Opnunartímar', footerContact: 'Samband',
    footerCopy: '© 2026 Sauðárkróksbakarí', footerTagline: 'handverk frá 1880',
    closedBadge: 'Lokað núna',
    /* ── added sections ── */
    navMenu: 'Matseðill', navCatering: 'Veislur',
    menuEyebrow: 'Matseðill', menuH2: 'allt sem kemur úr ofninum',
    menuNote: 'Verð eru sýnishorn · V merkir vegan',
    catEyebrow: 'Veislur & hópar', catH2: 'bakkelsi fyrir stærri stundir',
    catBody: 'Fundur, afmæli eða erfidrykkja — við tökum saman bakka af snúðum, brauði og kruðeríi fyrir hópinn. Láttu okkur vita með fyrirvara og við stillum bakkann eftir tilefninu.',
    catNote: 'Pantanir með a.m.k. dags fyrirvara', catCall: 'Hringja · 455 5000', catEmail: 'Senda fyrirspurn',
    catBar: 'Veldu bakka eða fáðu sérsniðið tilboð',
    socialEyebrow: 'Instagram', socialH2: 'daglegt brauð, mynd fyrir mynd',
    socialBody: 'Ferskt úr ofninum á hverjum morgni. Fylgdu okkur og sjáðu hvað er á borðinu í dag.',
    socialCta: 'Fylgjast með',
  },
  en: {
    navLink1: 'Our Story', navLink2: 'Visit Us', navCta: 'Visit',
    eyebrow: 'Bakery · Sauðárkrókur · Iceland',
    heroH1a: 'baked with care', heroH1b: 'every day', heroH1c: '',
    heroBody: 'A passion for baking, kept alive for more than a century.',
    ctaPrimary: 'See the selection', ctaPhone: 'Call · 455 5000',
    prodEyebrow: 'From the Oven', prodH2: 'crafted in every bite',
    prodBody: 'We bake everything from scratch: cinnamon buns, rye bread and croissants. No mass production, just hands and care.',
    signaturePill: 'Signature',
    sagaEyebrow: 'Our Story', sagaH2: 'founded 1880, Iceland\'s oldest bakery',
    sagaPara1: 'From the very first day, the oven on Aðalgata has been lit before sunrise. Every generation has passed the recipes down, unchanged.',
    sagaPara2: 'The 1979 fire destroyed almost everything but the recipes. The next day, the baking began anew.',
    statFounded: 'Founded', statYears: 'Years of history', statRating: 'Tripadvisor',
    intEyebrow: 'The Place', intH2: 'a bright house with forty seats',
    intBody: 'Spacious and bright, with seating both indoors and out on the terrace when the weather is kind.',
    revEyebrow: 'Reviews', revH2: '4.7 stars and Travelers\' Choice',
    revDisclaimer: 'A sample of guest reviews on Tripadvisor and Google.',
    visitEyebrow: 'Visit Us', visitH2: 'Aðalgata 5, in the heart of town',
    addrEyebrow: 'Address', hoursEyebrow: 'Opening hours', openBadge: 'Open now',
    phoneEyebrow: 'Phone', emailEyebrow: 'Email',
    addrBtn: 'Open in maps', callBtn: 'Call', emailBtn: 'Send an email', langOther: 'IS',
    navLink3: 'Opening hours',
    footerAddress: 'Address', footerHours: 'Opening hours', footerContact: 'Contact',
    footerCopy: '© 2026 Sauðárkróksbakarí', footerTagline: 'craft since 1880',
    closedBadge: 'Closed now',
    /* ── added sections ── */
    navMenu: 'Menu', navCatering: 'Catering',
    menuEyebrow: 'Menu', menuH2: 'everything from the oven',
    menuNote: 'Prices are samples · V marks vegan',
    catEyebrow: 'Catering & groups', catH2: 'pastries for bigger moments',
    catBody: 'A meeting, a birthday, a reception — we\'ll put together a platter of buns, bread and pastries for the whole group. Let us know ahead of time and we\'ll match it to the occasion.',
    catNote: 'Orders with at least a day\'s notice', catCall: 'Call · 455 5000', catEmail: 'Send an enquiry',
    catBar: 'Pick a platter or get a tailored quote',
    socialEyebrow: 'Instagram', socialH2: 'daily bread, frame by frame',
    socialBody: 'Fresh from the oven every morning. Follow along and see what\'s on the counter today.',
    socialCta: 'Follow along',
  },
} as const

const REVIEWS_BILINGUAL = [
  {
    quote: { is: '"Besti snúðurinn sem ég hef smakkað á ævinni."', en: '"The best cinnamon bun I have ever tasted."' },
    author: 'Jón Gunnarsson',
    meta: { is: 'Reykjavík · Tripadvisor', en: 'Reykjavík · Tripadvisor' },
  },
  {
    quote: { is: '"Við stöldruðum við á leið um Skagafjörð og komum aftur samdægurs."', en: '"We stopped on the way through Skagafjörður and came back the same day."' },
    author: 'Sarah Mitchell',
    meta: { is: 'London · Google', en: 'London · Google' },
  },
  {
    quote: { is: '"Án nokkurs vafa besta bakarí á Íslandi. Engin samkeppni."', en: '"Without a doubt the best bakery in Iceland. No competition."' },
    author: 'Gunnar Þorleifsson',
    meta: { is: 'Akureyri · HappyCow', en: 'Akureyri · HappyCow' },
  },
]

const HOURS_BILINGUAL = [
  { day: { is: 'Mán–Fös', en: 'Mon–Fri' }, time: '7:30–18:00' },
  { day: { is: 'Laugardaga', en: 'Saturday' }, time: '8:00–16:00' },
  { day: { is: 'Sunnudaga', en: 'Sunday' }, time: '9:00–16:00' },
]

const PRODUCTS_EN_BLURB: Record<string, string> = {
  'snudur-sukkuladi': 'Classic cinnamon bun with rich chocolate glaze.',
  'snudur-karamellu': 'Soft and sweet with homemade caramel glaze.',
  'snudur-sykur': 'Simple and perfect: cinnamon and sugar, nothing more.',
  'kleinuhringur-bleikur': 'Large, light, and beautifully pink-glazed.',
  'nutellastong': 'A pastry filled with Nutella, a children\'s favourite.',
  'rugbraud': 'Thin, dense, and perfect with cream cheese.',
  'vegan-croissant': 'Layer-on-layer pastry, 100% plant-based.',
  'kaffi': 'Espresso from a nearby roastery.',
}

const MAPS_URL = 'https://www.google.com/maps/search/?query=Sau%C3%B0%C3%A1rkr%C3%B3ksbakari%2C+A%C3%B0algata+5%2C+Sau%C3%B0%C3%A1rkr%C3%B3kur'

/* ── Open-now helper ───────────────────────────────────────────────── */
function getOpenStatus(lang: Lang): { open: boolean; label: string } {
  const now = new Date()
  const dow = now.getDay()
  const mins = now.getHours() * 60 + now.getMinutes()
  const row = HOURS.find((h) => h.days.includes(dow))
  const open = !!(row && row.open != null && row.close != null && mins >= row.open && mins < row.close)
  return { open, label: open ? COPY[lang].openBadge : COPY[lang].closedBadge }
}

/* ── Shimmer fallback for image slots ─────────────────────────────── */
const SHIMMER_CLASS = 'w-full h-full bakery-shimmer'

/* ── Inline glyphs (stroke = currentColor, so they take the parent's color) ── */
const DIET_ICONS = [
  /* leaf — vegan */
  <svg key="leaf" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13C4 8 9 4 20 4c0 7-4 14-9 14z" /><path d="M4 20s2-6 7-9" /></svg>,
  /* cup — oat milk */
  <svg key="cup" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" /><path d="M16 9h2a3 3 0 0 1 0 6h-2" /><path d="M8 2.5v2M11.5 2.5v2" /></svg>,
  /* info — allergies */
  <svg key="info" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>,
]
/* Factory (not a shared element) so each render site gets its own instance. */
const igGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5.2" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" /></svg>
)

/* ── Keyframe + scoped CSS ─────────────────────────────────────────── */
const PAGE_STYLES = `
  .bakery-page, .bakery-page *, .bakery-page a, .bakery-page button { cursor: none !important; }
  @media (pointer: coarse) {
    .bakery-page, .bakery-page *, .bakery-page a, .bakery-page button { cursor: auto !important; }
    #bakery-cursor-dot, #bakery-cursor-ring { display: none !important; }
  }
  @keyframes bakery-grain-shift {
    0%   { background-position: 0% 0%; }
    20%  { background-position: -8% 12%; }
    40%  { background-position: 15% -8%; }
    60%  { background-position: -4% 20%; }
    80%  { background-position: 8% -15%; }
    100% { background-position: 0% 0%; }
  }
  @keyframes bakery-shimmer-warm {
    0%, 100% { background-position: 0% 50%; }
    50%       { background-position: 100% 50%; }
  }
  @keyframes bakery-pulse-out {
    0%   { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(2.6); opacity: 0; }
  }
  @keyframes bakery-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .bakery-shimmer {
    background: linear-gradient(135deg, #E8CFA0, #D4B07A, #BF9060, #E8CFA0);
    background-size: 300% 300%;
    animation: bakery-shimmer-warm 5s ease infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .bakery-shimmer { animation: none; }
  }
  [data-bk-reveal] {
    opacity: 0;
    transform: translateY(28px);
  }
  [data-bk-reveal].bk-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1);
  }
  @media (prefers-reduced-motion: reduce) {
    [data-bk-reveal] { opacity: 1; transform: none; }
    [data-bk-reveal].bk-visible { transition: none; }
  }
  .bakery-nav-link:hover { color: ${ESPRESSO} !important; }
  .bakery-cta-pill:hover { background: ${AMBER_DARK} !important; transform: translateY(-2px); }
  .bakery-cta-outline:hover { border-color: rgba(26,15,6,0.55) !important; background: rgba(26,15,6,0.04) !important; }
  .bakery-phone-link:hover { color: ${ESPRESSO} !important; }
  .bakery-prod-card:hover { transform: translateY(-5px); }
  .bakery-map-btn:hover { background: ${AMBER_DARK} !important; transform: translateY(-1px); }
  .bakery-footer-phone:hover { color: ${AMBER} !important; }
  .bakery-footer-email:hover { color: rgba(250,244,232,0.65) !important; }
  .bakery-footer-maps:hover { opacity: 0.65; }
  .bakery-addr-link:hover { opacity: 0.7; }

  /* Mobile menu trigger is hidden on desktop; revealed in the media query. */
  .bk-menu-btn { display: none; }

  /* ── Mobile ─────────────────────────────────── */
  @media (max-width: 720px) {
    .bk-nav-links { display: none !important; }
    .bk-nav-cta { display: none !important; }
    .bk-nav-lang { display: none !important; }
    .bk-menu-btn { display: inline-flex !important; }
    .bk-hero-grid { grid-template-columns: 1fr !important; min-height: auto !important; gap: 0 !important; }
    /* Constrain the CONTAINER (not the image) so the cream vignette keeps the
       same ratio to the 115%-wide image as on desktop — that's what melts the
       white photo edges into the page. */
    .bk-hero-pastry { display: flex !important; justify-content: center; width: 260px !important; max-width: 76vw; margin: 16px auto 12px; }
    .bk-sig-grid { grid-template-columns: 1fr !important; }
    /* Same fix as the hero: constrain the signature image container so its cream
       vignette stops bleeding up over the "handverk í hverjum bita" heading. */
    .bk-sig-imgwrap { width: 240px !important; max-width: 70vw; margin: 8px auto 4px !important; }
    .bk-heritage-grid { grid-template-columns: 1fr !important; }
    .bk-interior-copy { grid-template-columns: 1fr !important; }
    .bk-reviews-grid { grid-template-columns: 1fr !important; }
    .bk-visit-outer { grid-template-columns: 1fr !important; }
    .bk-info-cards { grid-template-columns: 1fr !important; }
    .bk-footer-cols { grid-template-columns: 1fr !important; gap: 40px !important; }
  }

  /* ── Added sections: menu / dietary / catering / instagram ── */
  @media (max-width: 720px) {
    .bk-menu-cols { grid-template-columns: 1fr !important; gap: 32px !important; }
    .bk-diet-band { grid-template-columns: 1fr !important; }
    .bk-veisla-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
    .bk-insta-grid { grid-template-columns: 1fr !important; }
  }
`

/* ── Splash screen ──────────────────────────────────────────────────── */
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#ffffff',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 28,
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.1, ease: [0.4, 0, 0.2, 1] } }}
    >
      {/* Grain — dark multiply on white for aged texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: GRAIN_SVG,
        backgroundRepeat: 'repeat',
        opacity: 0.055, mixBlendMode: 'multiply' as const,
      }} />

      {/* Dark vignette frame — keeps drama on white bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(20,8,2,0.42) 100%)',
      }} />

      {/* Logo — multiply blend makes the white image bg vanish against the white
          splash. Fade in with opacity + blur + scale ONLY: any brightness < 1 would
          darken that white bg to grey and reveal a rectangular box mid-fade, so it's
          deliberately omitted to keep the edges seamless at every frame. */}
      <motion.div
        style={{
          position: 'relative', zIndex: 1,
          width: 'clamp(160px,28vw,240px)',
          mixBlendMode: 'multiply' as const,
        }}
        initial={{ opacity: 0, scale: 1.06, filter: 'blur(6px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: [0.25, 0, 0.35, 1] }}
      >
        <img
          src={`${BK_ASSETS}logo.webp`}
          alt="Sauðárkróksbakarí"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </motion.div>

      {/* Eyebrow line */}
      <motion.div
        style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 14 }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
      >
        <div style={{ width: 32, height: 1, background: 'rgba(101,50,15,0.35)' }} />
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500,
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(101,50,15,0.5)',
        }}>Bakarí · Sauðárkrókur · Est. 1880</span>
        <div style={{ width: 32, height: 1, background: 'rgba(101,50,15,0.35)' }} />
      </motion.div>
    </motion.div>
  )
}

/* The nav item that opens the hours panel instead of scroll-navigating. */
const HOURS_HREF = '#bakery-opnunartimar'

/* ── Opening-hours panel (shared by desktop dropdown + mobile accordion) ── */
function HoursPanel({ lang }: { lang: Lang }) {
  const status = getOpenStatus(lang)
  return (
    <div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', borderRadius: 9999, background: status.open ? 'rgba(86,101,79,0.12)' : 'rgba(120,60,60,0.1)', marginBottom: 16 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.open ? SAGE : '#8B3A3A', flexShrink: 0 }} />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.02em', color: status.open ? SAGE : '#8B3A3A' }}>{status.label}</span>
      </div>
      <dl style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: 0, padding: 0 }}>
        {HOURS_BILINGUAL.map((h, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 28 }}>
            <dt style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(26,15,6,0.5)', whiteSpace: 'nowrap' }}>{h.day[lang]}</dt>
            <dd style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: ESPRESSO, whiteSpace: 'nowrap', margin: 0 }}>{h.time}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/* ── Desktop nav: hover-to-open hours dropdown (no navigation) ─────────── */
function NavHoursDropdown({ label, lang }: { label: string; lang: Lang }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="bakery-nav-link"
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: open ? ESPRESSO : 'rgba(26,15,6,0.5)', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', transition: 'color 0.2s' }}
      >
        {label}
        <motion.svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
          animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'block' }}>
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            /* x:'-50%' goes through Framer (not the style transform, which Framer
               overrides for y/scale) so the panel stays centered under the trigger */
            initial={{ opacity: 0, y: 6, scale: 0.97, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 6, scale: 0.97, x: '-50%' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', top: '100%', left: '50%', paddingTop: 16, transformOrigin: 'top center', zIndex: 60 }}
          >
            {/* transparent paddingTop above bridges the gap so the hover doesn't drop */}
            <div style={{ background: CARD_BG, border: '1px solid rgba(26,15,6,0.08)', borderRadius: 16, boxShadow: '0 18px 44px -22px rgba(26,15,6,0.4)', padding: '20px 24px', minWidth: 230 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: AMBER, margin: '0 0 14px' }}>{label}</p>
              <HoursPanel lang={lang} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Mobile menu ────────────────────────────────────────────────────── */
function MobileMenu({ open, onClose, links, lang, onToggleLang }: {
  open: boolean
  onClose: () => void
  links: { href: string; label: string }[]
  lang: Lang
  onToggleLang: () => void
}) {
  const [hoursOpen, setHoursOpen] = useState(false)
  /* collapse the hours accordion whenever the menu closes */
  useEffect(() => { if (!open) setHoursOpen(false) }, [open])

  /* lock background scroll + Escape to close while open */
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  // Circle wipe originates from the menu button (top-right of the 72px header)
  const ORIGIN = 'calc(100% - 32px) 36px'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="bk-mobile-menu"
          style={{ position: 'fixed', inset: 0, zIndex: 850, background: CREAM, display: 'flex', flexDirection: 'column' }}
          initial={{ clipPath: `circle(0px at ${ORIGIN})` }}
          animate={{ clipPath: `circle(150% at ${ORIGIN})` }}
          exit={{ clipPath: `circle(0px at ${ORIGIN})` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top bar — mirrors the nav height so the X lands on the menu button */}
          <div style={{ height: 72, padding: '0 clamp(20px,5vw,40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderBottom: '1px solid rgba(26,15,6,0.07)' }}>
            <span style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 18, color: ESPRESSO, letterSpacing: '-0.015em' }}>Sauðárkróksbakarí</span>
            <button onClick={onClose} aria-label={lang === 'is' ? 'Loka valmynd' : 'Close menu'} style={{ background: 'transparent', border: 'none', padding: 10, margin: -10, display: 'flex', cursor: 'pointer' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ESPRESSO} strokeWidth="1.6" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
          </div>

          {/* Links — staggered in, collapse away with the circle on exit */}
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(10px,2.4vh,22px)', padding: '0 clamp(24px,6vw,40px)' }}>
            {links.map((l, i) => {
              const delay = 0.16 + i * 0.07
              const linkFont = { fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(2.2rem,11vw,3.4rem)', lineHeight: 1.04, letterSpacing: '-0.02em', color: ESPRESSO }
              /* Opening hours taps open an inline accordion instead of navigating. */
              if (l.href === HOURS_HREF) {
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button
                      type="button"
                      onClick={() => setHoursOpen((v) => !v)}
                      aria-expanded={hoursOpen}
                      style={{ ...linkFont, display: 'flex', alignItems: 'center', gap: 14, width: '100%', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                    >
                      {l.label}
                      <motion.svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                        animate={{ rotate: hoursOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ flexShrink: 0 }}>
                        <polyline points="6 9 12 15 18 9" />
                      </motion.svg>
                    </button>
                    <AnimatePresence initial={false}>
                      {hoursOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ padding: '18px 2px 6px' }}>
                            <HoursPanel lang={lang} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              }
              return (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ ...linkFont, textDecoration: 'none' }}
                >
                  {l.label}
                </motion.a>
              )
            })}
          </nav>

          {/* Footer — phone + language toggle */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 + links.length * 0.07, duration: 0.5 }}
            style={{ padding: 'clamp(24px,6vw,40px)', borderTop: '1px solid rgba(26,15,6,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <a href={`tel:${VISIT.tel}`} onClick={onClose} style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: '1.5rem', color: AMBER, textDecoration: 'none' }}>{VISIT.telLabel}</a>
            <button onClick={onToggleLang} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', background: 'transparent', border: '1.5px solid rgba(26,15,6,0.2)', borderRadius: 9999, color: ESPRESSO, padding: '9px 20px', cursor: 'pointer' }}>
              {lang === 'is' ? 'EN' : 'IS'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Page() {
  const [lang, setLang] = useState<Lang>('is')
  const [showSplash, setShowSplash] = useState(() =>
    typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('bk-splash-seen')
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const reduce = useReducedMotion()
  const navRef = useRef<HTMLElement>(null)
  const grainRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const signatureRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start end', 'end start'] })
  const pastryY = useTransform(heroScroll, [0, 1], [70, -70])
  const pastryRotate = useTransform(heroScroll, [0, 1], [-10, 10])

  const { scrollYProgress: signatureScroll } = useScroll({ target: signatureRef, offset: ['start end', 'end start'] })
  const chocolateX = useTransform(signatureScroll, [0, 1], [-18, 18])

  const c = COPY[lang]
  const openStatus = getOpenStatus(lang)
  /* Desktop nav: Menu · Catering · Story · Hours(▾). "Heimsókn" lives in the CTA. */
  const navLinks = [
    { href: '#bakery-matsedill', label: c.navMenu },
    { href: '#bakery-veislur', label: c.navCatering },
    { href: '#bakery-sagan', label: c.navLink1 },
    { href: '#bakery-opnunartimar', label: c.navLink3 },
  ]
  /* Mobile menu also lists Heimsókn explicitly (no header CTA on mobile). */
  const mobileLinks = [...navLinks, { href: '#bakery-finna', label: c.navLink2 }]

  /* theme color */
  useEffect(() => {
    setThemeColor(CREAM)
    return () => { setThemeColor('#0a1320') }
  }, [])

  /* film grain */
  useEffect(() => {
    const el = grainRef.current
    if (!el) return
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const id = ctx.createImageData(256, 256)
    for (let i = 0; i < id.data.length; i += 4) {
      const v = Math.floor(Math.random() * 255)
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v
      id.data[i + 3] = Math.floor(Math.random() * 22)
    }
    ctx.putImageData(id, 0, 0)
    canvas.toBlob((blob) => {
      if (!blob || !el) return
      const url = URL.createObjectURL(blob)
      el.style.backgroundImage = `url(${url})`
      return () => URL.revokeObjectURL(url)
    })
  }, [])

  /* custom cursor (fine pointer only) */
  useEffect(() => {
    if (reduce) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let ringX = -20, ringY = -20, dotX = -20, dotY = -20
    let raf = 0

    const onMove = (e: MouseEvent) => {
      dotX = e.clientX; dotY = e.clientY
      dot.style.left = dotX + 'px'
      dot.style.top = dotY + 'px'
      dot.style.opacity = '1'
      ring.style.opacity = '1'
      if (!raf) {
        const tick = () => {
          ringX += (dotX - ringX) * 0.14
          ringY += (dotY - ringY) * 0.14
          ring.style.left = ringX + 'px'
          ring.style.top = ringY + 'px'
          raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      }
    }
    const onLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element
      if (t.closest('a, button')) {
        dot.style.width = '14px'; dot.style.height = '14px'
        ring.style.width = '50px'; ring.style.height = '50px'
        ring.style.borderColor = 'rgba(181,114,46,0.6)'
      } else {
        dot.style.width = '8px'; dot.style.height = '8px'
        ring.style.width = '32px'; ring.style.height = '32px'
        ring.style.borderColor = 'rgba(181,114,46,0.38)'
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [reduce])

  /* nav scroll hide/show */
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    let lastY = window.scrollY
    let hidden = false
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - lastY
      if (dy > 6 && y > 80 && !hidden) {
        hidden = true
        nav.style.transform = 'translateY(-100%)'
      } else if ((dy < -6 || y <= 80) && hidden) {
        hidden = false
        nav.style.transform = 'translateY(0)'
      }
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* scroll reveal */
  useEffect(() => {
    if (reduce) {
      document.querySelectorAll('[data-bk-reveal]').forEach((el) => el.classList.add('bk-visible'))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            const delay = parseFloat(el.dataset.bkDelay ?? '0')
            if (delay > 0) {
              setTimeout(() => el.classList.add('bk-visible'), delay * 1000)
            } else {
              el.classList.add('bk-visible')
            }
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' },
    )
    const page = pageRef.current
    if (!page) return
    page.querySelectorAll('[data-bk-reveal]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [reduce, lang])

  /* stat counters */
  useEffect(() => {
    if (reduce) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement
          if (!e.isIntersecting || el.dataset.counted) return
          el.dataset.counted = '1'
          const target = parseFloat(el.dataset.bkCount ?? '0')
          const suffix = el.dataset.bkSuffix ?? ''
          const isFloat = (el.dataset.bkCount ?? '').includes('.')
          const duration = 1600
          const startVal = target * 0.6
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            const val = startVal + (target - startVal) * eased
            el.textContent = (isFloat ? val.toFixed(1).replace('.', ',') : String(Math.round(val))) + suffix
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.7 },
    )
    const page = pageRef.current
    if (!page) return
    page.querySelectorAll('[data-bk-count]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [reduce])

  const signature = PRODUCTS[0]
  const gridProducts = PRODUCTS.slice(1)

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onDone={() => {
            sessionStorage.setItem('bk-splash-seen', '1')
            setShowSplash(false)
          }} />
        )}
      </AnimatePresence>

      <style>{PAGE_STYLES}</style>
      <PreviewChrome company={company} />

      {/* Cursor — desktop only (hidden on coarse pointer via CSS) */}
      <div
        id="bakery-cursor-dot"
        ref={dotRef}
        style={{
          position: 'fixed', width: 8, height: 8, background: AMBER,
          borderRadius: '50%', pointerEvents: 'none', zIndex: 99998,
          left: -20, top: -20, transform: 'translate(-50%,-50%)',
          transition: 'width 0.18s, height 0.18s, opacity 0.15s',
          opacity: 0, mixBlendMode: 'multiply',
        }}
      />
      <div
        id="bakery-cursor-ring"
        ref={ringRef}
        style={{
          position: 'fixed', width: 32, height: 32,
          border: '1.5px solid rgba(181,114,46,0.38)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 99997,
          left: -20, top: -20, transform: 'translate(-50%,-50%)',
          transition: 'width 0.22s, height 0.22s, opacity 0.15s, border-color 0.2s',
          opacity: 0,
        }}
      />

      {/* Film grain */}
      <div
        ref={grainRef}
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9000,
          opacity: 0.04, backgroundSize: '256px 256px',
          animation: reduce ? undefined : 'bakery-grain-shift 0.28s steps(1) infinite',
          mixBlendMode: 'overlay',
        }}
      />

      <div ref={pageRef} className="bakery-page" style={{ background: CREAM, color: ESPRESSO, overflowX: 'hidden', fontFamily: "'DM Sans', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased' }}>

        {/* ── NAV ──────────────────────────────────────────────── */}
        <nav
          ref={navRef}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 800,
            height: 72, padding: '0 clamp(20px,4vw,64px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(250,244,232,0.9)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(26,15,6,0.07)',
            transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <a href="#bakery-top" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 18, color: ESPRESSO, letterSpacing: '-0.015em', lineHeight: 1.1 }}>Sauðárkróksbakarí</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(26,15,6,0.36)' }}>est. 1880</span>
          </a>
          <div className="bk-nav-links" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {navLinks.map(({ href, label }) => (
              href === HOURS_HREF
                ? <NavHoursDropdown key={href} label={label} lang={lang} />
                : <a key={href} href={href} className="bakery-nav-link" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: 'rgba(26,15,6,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>{label}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button
              className="bk-nav-lang"
              onClick={() => setLang((l) => l === 'is' ? 'en' : 'is')}
              aria-label={`Switch to ${lang === 'is' ? 'English' : 'Íslenska'}`}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', background: 'transparent', border: 'none', color: 'rgba(26,15,6,0.4)', padding: '4px 8px', transition: 'color 0.2s', minHeight: 44, minWidth: 44 }}
            >
              {c.langOther}
            </button>
            <a href="#bakery-finna" className="bakery-cta-outline bk-nav-cta" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: ESPRESSO, textDecoration: 'none', padding: '10px 24px', border: '1.5px solid rgba(26,15,6,0.2)', borderRadius: 9999, transition: 'all 0.25s' }}>
              {c.navCta}
            </a>
            {/* Mobile menu trigger — hidden on desktop via CSS */}
            <button
              className="bk-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label={lang === 'is' ? 'Opna valmynd' : 'Open menu'}
              style={{ background: 'transparent', border: 'none', padding: 10, margin: -10, cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ESPRESSO} strokeWidth="1.6" strokeLinecap="round">
                <line x1="3" y1="8" x2="21" y2="8" />
                <line x1="3" y1="16" x2="21" y2="16" />
              </svg>
            </button>
          </div>
        </nav>

        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          links={mobileLinks}
          lang={lang}
          onToggleLang={() => setLang((l) => l === 'is' ? 'en' : 'is')}
        />

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section ref={heroRef} id="bakery-top" style={{ minHeight: '100vh', background: CREAM, position: 'relative', overflow: 'hidden', padding: '120px clamp(20px,4vw,64px) 40px', display: 'flex', alignItems: 'center' }}>
          {/* 1880 watermark — SVG textPath so the ends curve gently downward, horizontally centered */}
          <svg
            aria-hidden
            style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', width: '94%', maxWidth: 1100, overflow: 'visible', pointerEvents: 'none', userSelect: 'none', zIndex: 2 }}
            viewBox="0 0 1100 480"
          >
            <defs>
              {/* Arc: center at y=380, ends at y=440 → 60px drop at extremes = subtle downward curve */}
              <path id="bk1880arc" d="M 0,440 Q 550,380 1100,440" />
            </defs>
            <text
              fill="none"
              stroke="rgba(181,114,46,0.1)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              fontFamily="'Playfair Display', Georgia, serif"
              fontStyle="italic"
              fontWeight="800"
              fontSize="400"
              letterSpacing="-8"
            >
              <textPath href="#bk1880arc" textAnchor="middle" startOffset="50%">1880</textPath>
            </text>
          </svg>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
            <div className="bk-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'center', minHeight: 'calc(100vh - 240px)' }}>

              {/* LEFT — text. relative + zIndex keeps it above the pastry vignette's
                  -15% bleed when the grid stacks on mobile (pastry follows in DOM order). */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 'clamp(20px,3vw,40px)' }}>
                  <div style={{ width: 36, height: 1, background: AMBER, flexShrink: 0 }} />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER, margin: 0 }}>{c.eyebrow}</p>
                </div>
                <h1 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(3rem,6vw,7.5rem)', lineHeight: 0.92, letterSpacing: '-0.03em', color: ESPRESSO, fontWeight: 400, margin: '0 0 clamp(20px,3vw,40px)' }}>
                  {c.heroH1a}<br />
                  <em style={{ color: AMBER }}>{c.heroH1b}</em>
                  {c.heroH1c && <><br />{c.heroH1c}</>}
                </h1>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 300, lineHeight: 1.72, color: 'rgba(26,15,6,0.54)', maxWidth: 420, margin: '0 0 clamp(28px,4vw,52px)' }}>{c.heroBody}</p>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <a href="#bakery-bordid" className="bakery-cta-pill" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: CREAM, background: AMBER, padding: '16px 40px', borderRadius: 9999, textDecoration: 'none', transition: 'all 0.3s', display: 'inline-block', minHeight: 44 }}>{c.ctaPrimary}</a>
                  <a href={`tel:${VISIT.tel}`} className="bakery-phone-link" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 400, color: 'rgba(26,15,6,0.44)', textDecoration: 'none', transition: 'color 0.2s' }}>{c.ctaPhone}</a>
                </div>
                <p style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 13, fontStyle: 'italic', color: 'rgba(26,15,6,0.28)', margin: 'clamp(16px,2.5vw,32px) 0 0' }}>síðan 1880</p>
              </div>

              {/* RIGHT — floating pastry */}
              <div className="bk-hero-pastry" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* Radial fade: melts photo edges into cream background */}
                <div aria-hidden style={{ position: 'absolute', inset: '-15%', background: `radial-gradient(ellipse at center, transparent 38%, ${CREAM} 70%)`, pointerEvents: 'none', zIndex: 1 }} />
                <motion.img
                  src={`${BK_ASSETS}cinnamon-roll.webp`}
                  alt={lang === 'is' ? 'Kanilsnúður úr Sauðárkróksbakaríi' : 'Cinnamon roll from Sauðárkróksbakarí'}
                  style={{
                    y: reduce ? 0 : pastryY,
                    rotate: reduce ? 0 : pastryRotate,
                    width: '115%',
                    maxWidth: 640,
                    mixBlendMode: 'multiply' as const,
                    userSelect: 'none',
                    pointerEvents: 'none',
                    willChange: 'transform',
                    display: 'block',
                  }}
                  draggable={false}
                />
              </div>

            </div>
          </div>
        </section>

        {/* ── CURVED MARQUEE ───────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <CurvedLoop
            marqueeText="nýbakað á hverjum morgni  ·  handverk síðan 1880  ·  elsta bakarí Íslands  ·  Sauðárkrókur, Ísland  ·  freshly baked every morning  ·  Iceland's oldest bakery  ·  est. 1880  ·  "
            speed={1.2}
            curveAmount={200}
            direction="left"
            interactive={true}
          />
        </div>

        {/* ── PRODUCTS ─────────────────────────────────────────── */}
        <section id="bakery-bordid" style={{ background: CREAM, padding: 'clamp(80px,12vw,160px) clamp(20px,5vw,72px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Section header */}
            <div data-bk-reveal style={{ position: 'relative', zIndex: 2, marginBottom: 'clamp(48px,8vw,96px)' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER, margin: '0 0 16px' }}>{c.prodEyebrow}</p>
              <h2 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(2rem,5vw,4rem)', lineHeight: 1.02, letterSpacing: '-0.025em', color: ESPRESSO, fontWeight: 400, margin: 0, maxWidth: 700 }}>{c.prodH2}</h2>
            </div>
            {/* Signature feature */}
            {/* minmax(0,1fr) prevents the image from blowing out its grid track and pushing the text column off-screen */}
            {/* NOTE: no data-bk-reveal on this grid. The reveal applies transform: translateY(0) which
                computes to a matrix and creates a stacking context that ISOLATES blend modes — that is what
                broke the multiply blend here. The hero pastry works precisely because it sits outside any
                reveal. So we mirror the hero exactly and put the reveal on the text column only. */}
            <div ref={signatureRef} className="bk-sig-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'clamp(32px,5vw,80px)', alignItems: 'center', marginBottom: 'clamp(64px,10vw,120px)' }}>
              {/* IDENTICAL mechanics to the hero pastry: radial cream vignette melts the photo edges into
                  the page, mix-blend-mode:multiply turns the white photo background into cream while keeping
                  the bun and its own baked shadow. */}
              <div className="bk-sig-imgwrap" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0 }}>
                <div aria-hidden style={{ position: 'absolute', inset: '-15%', background: `radial-gradient(ellipse at center, transparent 38%, ${CREAM} 70%)`, pointerEvents: 'none', zIndex: 1 }} />
                <motion.img
                  src={`${BK_ASSETS}chocolate-swirl.webp`}
                  alt={lang === 'is' ? 'Snúður með súkkulaði úr Sauðárkróksbakaríi' : 'Chocolate swirl from Sauðárkróksbakarí'}
                  style={{
                    x: reduce ? 0 : chocolateX,
                    width: '100%',
                    maxWidth: 560,
                    mixBlendMode: 'multiply' as const,
                    userSelect: 'none',
                    pointerEvents: 'none',
                    willChange: 'transform',
                    display: 'block',
                  }}
                  draggable={false}
                />
              </div>
              {/* relative + zIndex keeps the text above the vignette's -15% bleed (image sits left of text here) */}
              <div data-bk-reveal style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 16px', borderRadius: 9999, background: WARM_CREAM, marginBottom: 22 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: AMBER }}>{c.signaturePill}</span>
                </div>
                <h3 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(1.5rem,2.8vw,2.3rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: ESPRESSO, fontWeight: 400, margin: '0 0 10px' }}>
                  {lang === 'is' ? signature.name : signature.en}
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(26,15,6,0.38)', margin: '0 0 20px', fontStyle: 'italic' }}>
                  {lang === 'is' ? signature.blurb : (PRODUCTS_EN_BLURB[signature.id] ?? signature.en)}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 300, lineHeight: 1.78, color: 'rgba(26,15,6,0.6)', margin: '0 0 30px', maxWidth: 400 }}>{c.prodBody}</p>
                <p style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: '1.5rem', color: AMBER, fontWeight: 400, margin: 0 }}>{signature.price}</p>
              </div>
            </div>
            {/* Product grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'clamp(18px,2.5vw,32px)' }}>
              {gridProducts.map((p, i) => (
                <div
                  key={p.id}
                  data-bk-reveal
                  data-bk-delay={String((i * 0.06).toFixed(2))}
                  className="bakery-prod-card"
                  style={{ transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}
                >
                  <div style={{ aspectRatio: '4/5', borderRadius: 20, overflow: 'hidden', boxShadow: '0 16px 38px -26px rgba(26,15,6,0.46)', marginBottom: 16 }}>
                    <Img src={p.img} alt={p.alt} className="w-full h-full object-cover" fallbackClassName={SHIMMER_CLASS} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                    <h3 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: '1.05rem', fontWeight: 400, color: ESPRESSO, letterSpacing: '-0.01em', margin: 0, lineHeight: 1.25 }}>
                      {lang === 'is' ? p.name : p.en}
                    </h3>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: AMBER, whiteSpace: 'nowrap', flexShrink: 0 }}>{p.price}</span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400, lineHeight: 1.6, color: 'rgba(26,15,6,0.46)', margin: 0 }}>
                    {lang === 'is' ? p.blurb : (PRODUCTS_EN_BLURB[p.id] ?? p.en)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MENU ─────────────────────────────────────────────── */}
        {/* Deliberately NOT another photo grid (Products already is one). This is a
            letterpress-style editorial menu card — reads like a fine bakery's printed
            list, which keeps it original and "expensive" while staying on-palette. */}
        <section id="bakery-matsedill" style={{ background: CREAM, padding: 'clamp(80px,12vw,160px) clamp(20px,5vw,72px)' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            {/* Centered header with flanking amber rules */}
            <div data-bk-reveal style={{ textAlign: 'center', marginBottom: 'clamp(44px,7vw,80px)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 36, height: 1, background: AMBER }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER, margin: 0 }}>{c.menuEyebrow}</p>
                <div style={{ width: 36, height: 1, background: AMBER }} />
              </div>
              <h2 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(2rem,5vw,4rem)', lineHeight: 1.02, letterSpacing: '-0.025em', color: ESPRESSO, fontWeight: 400, margin: 0 }}>{c.menuH2}</h2>
            </div>

            {/* The menu card */}
            <div data-bk-reveal style={{ position: 'relative', background: CARD_BG, border: '1px solid rgba(26,15,6,0.08)', borderRadius: 28, boxShadow: '0 34px 90px -56px rgba(26,15,6,0.5)', padding: 'clamp(30px,5vw,68px)' }}>
              {/* Inner amber hairline — the "printed card" detail */}
              <div aria-hidden style={{ position: 'absolute', inset: 'clamp(10px,1.4vw,18px)', border: '1px solid rgba(181,114,46,0.18)', borderRadius: 18, pointerEvents: 'none' }} />

              <div className="bk-menu-cols" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(34px,5vw,72px) clamp(40px,6vw,88px)' }}>
                {MENU.map((cat) => (
                  <div key={cat.is}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid rgba(26,15,6,0.12)' }}>
                      <h3 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(1.2rem,2vw,1.6rem)', lineHeight: 1.1, letterSpacing: '-0.015em', color: ESPRESSO, fontWeight: 400, margin: 0 }}>{cat[lang]}</h3>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: AMBER, whiteSpace: 'nowrap', flexShrink: 0 }}>{cat.kicker[lang]}</span>
                    </div>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {cat.items.map((it) => (
                        <li key={it.is}>
                          {/* flex-end keeps the dotted leader joined to the name's LAST line
                              and the price when a long name wraps (common on mobile) */}
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: ESPRESSO, lineHeight: 1.3, minWidth: 0 }}>{it[lang]}</span>
                            {it.v && (
                              <span role="img" aria-label={lang === 'is' ? 'Vegan réttur' : 'Vegan'} title="Vegan" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: 5, background: 'rgba(86,101,79,0.16)', color: SAGE, fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, lineHeight: 1, flexShrink: 0, marginBottom: 2 }}>V</span>
                            )}
                            {/* dotted leader */}
                            <span aria-hidden style={{ flex: 1, borderBottom: '1px dotted rgba(26,15,6,0.28)', transform: 'translateY(-5px)', minWidth: 12 }} />
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 600, color: AMBER, whiteSpace: 'nowrap', flexShrink: 0 }}>{it.price}</span>
                          </div>
                          {it.note && (
                            <span style={{ display: 'block', marginTop: 3, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontStyle: 'italic', color: 'rgba(26,15,6,0.4)' }}>{it.note[lang]}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <p style={{ position: 'relative', textAlign: 'center', margin: 'clamp(28px,4vw,44px) 0 0', fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.02em', color: 'rgba(26,15,6,0.36)' }}>{c.menuNote}</p>
            </div>

            {/* Dietary strip */}
            <div data-bk-reveal data-bk-delay="0.08" className="bk-diet-band" style={{ marginTop: 'clamp(18px,2.5vw,26px)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {DIETARY.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: WARM_CREAM, borderRadius: 18, padding: '18px 22px' }}>
                  <span style={{ flexShrink: 0, color: AMBER, display: 'flex' }}>{DIET_ICONS[i]}</span>
                  <div>
                    <p style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: '1.05rem', color: ESPRESSO, fontWeight: 400, margin: '0 0 2px', lineHeight: 1.1 }}>{lang === 'is' ? d.is : d.en}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: 'rgba(26,15,6,0.45)', margin: 0 }}>{lang === 'is' ? d.sub.is : d.sub.en}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HERITAGE ─────────────────────────────────────────── */}
        <section id="bakery-sagan" style={{ background: WARM_CREAM, padding: 'clamp(80px,12vw,160px) clamp(20px,5vw,72px)', position: 'relative', overflow: 'hidden' }}>
          {/* Background watermark */}
          <div aria-hidden style={{ position: 'absolute', bottom: '-10%', left: '-3%', fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(160px,35vw,520px)', color: AMBER, opacity: 0.07, lineHeight: 0.85, letterSpacing: '-0.04em', pointerEvents: 'none', userSelect: 'none', zIndex: 0 }}>1880</div>
          <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div className="bk-heritage-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'clamp(40px,6vw,100px)', alignItems: 'center' }}>
              {/* Baker hands image */}
              <div data-bk-reveal style={{ aspectRatio: '5/6', borderRadius: 24, overflow: 'hidden', boxShadow: '0 26px 64px -34px rgba(26,15,6,0.5)' }}>
                <Img src={IMG.ovenHands} alt={lang === 'is' ? 'Hendur bakarans við heitan ofn' : "Baker's hands at the hot oven"} className="w-full h-full object-cover" fallbackClassName={SHIMMER_CLASS} />
              </div>
              <div>
                <p data-bk-reveal style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER, margin: '0 0 18px' }}>{c.sagaEyebrow}</p>
                <h2 data-bk-reveal data-bk-delay="0.1" style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(1.8rem,4vw,3.2rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: ESPRESSO, fontWeight: 400, margin: '0 0 28px' }}>{c.sagaH2}</h2>
                <p data-bk-reveal data-bk-delay="0.18" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 300, lineHeight: 1.82, color: 'rgba(26,15,6,0.62)', margin: '0 0 18px' }}>{c.sagaPara1}</p>
                <p data-bk-reveal data-bk-delay="0.22" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 300, lineHeight: 1.82, color: 'rgba(26,15,6,0.62)', margin: '0 0 48px' }}>{c.sagaPara2}</p>
                {/* Stats */}
                <div data-bk-reveal data-bk-delay="0.28" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, paddingTop: 36, borderTop: '1px solid rgba(26,15,6,0.1)' }}>
                  <div>
                    <p style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(1.7rem,3.2vw,2.7rem)', lineHeight: 1, color: ESPRESSO, fontWeight: 400, margin: '0 0 6px' }}>1880</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(26,15,6,0.37)', margin: 0 }}>{c.statFounded}</p>
                  </div>
                  <div>
                    <p data-bk-count="146" data-bk-suffix="" style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(1.7rem,3.2vw,2.7rem)', lineHeight: 1, color: ESPRESSO, fontWeight: 400, margin: '0 0 6px' }}>146</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(26,15,6,0.37)', margin: 0 }}>{c.statYears}</p>
                  </div>
                  <div>
                    <p data-bk-count="4.7" data-bk-suffix="★" style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(1.7rem,3.2vw,2.7rem)', lineHeight: 1, color: AMBER, fontWeight: 400, margin: '0 0 6px' }}>4,7★</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(26,15,6,0.37)', margin: 0 }}>{c.statRating}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTERIOR + REVIEWS ──────────────────────────────── */}
        <section id="bakery-staður" style={{ background: CREAM, padding: 'clamp(80px,12vw,160px) clamp(20px,5vw,72px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Wide interior photo */}
            <div data-bk-reveal style={{ width: '100%', aspectRatio: '2/1', borderRadius: 28, overflow: 'hidden', boxShadow: '0 26px 64px -34px rgba(26,15,6,0.5)', marginBottom: 'clamp(48px,7vw,80px)' }}>
              <Img src={IMG.interiorMarble} alt={lang === 'is' ? 'Bjart inni í Sauðárkróksbakaríi' : 'Bright interior of Sauðárkróksbakarí'} className="w-full h-full object-cover" fallbackClassName={SHIMMER_CLASS} />
            </div>
            {/* Copy block */}
            <div data-bk-reveal className="bk-interior-copy" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'end', marginBottom: 'clamp(64px,10vw,120px)' }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER, margin: '0 0 14px' }}>{c.intEyebrow}</p>
                <h2 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(1.8rem,4vw,3.2rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: ESPRESSO, fontWeight: 400, margin: 0 }}>{c.intH2}</h2>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: 'rgba(26,15,6,0.56)', margin: 0 }}>{c.intBody}</p>
            </div>
            {/* Reviews header */}
            <div data-bk-reveal style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, paddingBottom: 24, borderBottom: '1px solid rgba(26,15,6,0.08)', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER, margin: '0 0 14px' }}>{c.revEyebrow}</p>
                <h2 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(1.6rem,3vw,2.6rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: ESPRESSO, fontWeight: 400, margin: 0 }}>{c.revH2}</h2>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(26,15,6,0.33)', maxWidth: 220, textAlign: 'right', lineHeight: 1.6, margin: 0 }}>{c.revDisclaimer}</p>
            </div>
            {/* Reviews grid */}
            <div className="bk-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(20px,3vw,48px)' }}>
              {REVIEWS_BILINGUAL.map((r, i) => (
                <div key={i} data-bk-reveal data-bk-delay={String((i * 0.1).toFixed(2))} style={{ paddingTop: 26, borderTop: '1px solid rgba(26,15,6,0.1)' }}>
                  <blockquote style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(0.95rem,1.6vw,1.2rem)', lineHeight: 1.55, color: ESPRESSO, fontWeight: 400, margin: '0 0 20px', fontStyle: 'italic' }}>{r.quote[lang]}</blockquote>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: ESPRESSO, margin: '0 0 3px' }}>{r.author}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(26,15,6,0.36)', margin: 0 }}>{r.meta[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INSTAGRAM ────────────────────────────────────────── */}
        {/* Not a generic 6-up widget — an editorial "follow" band that reuses the two
            real product photos as pinned prints, so it never shows placeholders. */}
        <section id="bakery-instagram" style={{ background: WARM_CREAM, padding: 'clamp(80px,12vw,160px) clamp(20px,5vw,72px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="bk-insta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,88px)', alignItems: 'center' }}>
              <div data-bk-reveal>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{ color: AMBER, display: 'flex' }}>{igGlyph()}</span>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER, margin: 0 }}>{c.socialEyebrow}</p>
                </div>
                <h2 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(1.8rem,4vw,3.2rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: ESPRESSO, fontWeight: 400, margin: '0 0 22px' }}>{c.socialH2}</h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: 'rgba(26,15,6,0.56)', margin: '0 0 32px', maxWidth: 420 }}>{c.socialBody}</p>
                <a href={SOCIAL.url} target="_blank" rel="noopener noreferrer" className="bakery-cta-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: CREAM, background: AMBER, padding: '14px 28px', borderRadius: 9999, textDecoration: 'none', transition: 'all 0.3s', minHeight: 44 }}>
                  <span style={{ display: 'flex' }}>{igGlyph()}</span>
                  {SOCIAL.handle}
                </a>
              </div>
              {/* Pinned prints — both real webp photos, slightly rotated, straighten on hover */}
              <div data-bk-reveal data-bk-delay="0.1" className="bk-insta-photos" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {[
                  { src: 'chocolate-swirl.webp', rot: -4, mt: 0, alt: { is: 'Snúður með súkkulaði', en: 'Chocolate-glazed cinnamon bun' } },
                  { src: 'cinnamon-roll.webp', rot: 5, mt: 36, alt: { is: 'Kanilsnúður beint úr ofninum', en: 'Cinnamon roll fresh from the oven' } },
                ].map((t, i) => (
                  <motion.div
                    key={t.src}
                    style={{ rotate: t.rot, marginTop: t.mt, marginLeft: i === 1 ? -28 : 0, width: 'clamp(150px,42%,250px)', background: CARD_BG, padding: 12, borderRadius: 14, boxShadow: '0 24px 50px -28px rgba(26,15,6,0.5)', zIndex: i }}
                    whileHover={{ rotate: 0, y: -8, zIndex: 5, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                  >
                    <div style={{ aspectRatio: '1/1', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
                      <Img src={`${BK_ASSETS}${t.src}`} alt={t.alt[lang]} className="w-full h-full object-cover" fallbackClassName={SHIMMER_CLASS} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CATERING ─────────────────────────────────────────── */}
        {/* Platter "package" cards — reads unmistakably as catering for groups and
            mirrors the menu/product card language. The middle (featured) card is the
            espresso accent, so the drama is kept but now lives inside a real card. */}
        <section id="bakery-veislur" style={{ background: CREAM, padding: 'clamp(80px,12vw,160px) clamp(20px,5vw,72px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Centered header */}
            <div data-bk-reveal style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto clamp(40px,6vw,72px)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 36, height: 1, background: AMBER }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER, margin: 0 }}>{c.catEyebrow}</p>
                <div style={{ width: 36, height: 1, background: AMBER }} />
              </div>
              <h2 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(2rem,5vw,4rem)', lineHeight: 1.02, letterSpacing: '-0.025em', color: ESPRESSO, fontWeight: 400, margin: '0 0 20px' }}>{c.catH2}</h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 300, lineHeight: 1.75, color: 'rgba(26,15,6,0.56)', margin: 0 }}>{c.catBody}</p>
            </div>

            {/* Platter cards */}
            <div className="bk-veisla-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 'clamp(18px,2.5vw,28px)', alignItems: 'stretch' }}>
              {CATERING_PLATTERS.map((p, i) => {
                const dark = !!p.featured
                const ink = dark ? CREAM : ESPRESSO
                const muted = dark ? 'rgba(250,244,232,0.62)' : 'rgba(26,15,6,0.5)'
                return (
                  <div
                    key={p.name.is}
                    data-bk-reveal
                    data-bk-delay={String((i * 0.08).toFixed(2))}
                    style={{
                      position: 'relative', display: 'flex', flexDirection: 'column',
                      background: dark ? ESPRESSO : CARD_BG,
                      border: dark ? '1px solid rgba(181,114,46,0.3)' : '1px solid rgba(26,15,6,0.08)',
                      borderRadius: 24,
                      padding: 'clamp(26px,3vw,38px)',
                      boxShadow: dark ? '0 34px 80px -40px rgba(26,15,6,0.65)' : '0 18px 44px -30px rgba(26,15,6,0.4)',
                    }}
                  >
                    {dark && (
                      <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: ESPRESSO, background: AMBER, padding: '6px 16px', borderRadius: 9999 }}>{lang === 'is' ? 'Vinsælast' : 'Most popular'}</span>
                    )}
                    {/* serving size — a people icon makes "for groups" explicit */}
                    <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 9999, background: dark ? 'rgba(250,244,232,0.1)' : 'rgba(181,114,46,0.1)', marginBottom: 20 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" />
                        <circle cx="9" cy="7" r="3" />
                        <path d="M22 19v-1a4 4 0 0 0-3-3.87" />
                        <path d="M16 4.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.02em', color: dark ? 'rgba(250,244,232,0.85)' : AMBER_DARK }}>{p.serves[lang]}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(1.4rem,2.4vw,1.85rem)', lineHeight: 1.08, letterSpacing: '-0.02em', color: ink, fontWeight: 400, margin: '0 0 12px' }}>{p.name[lang]}</h3>
                    <p style={{ flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, lineHeight: 1.65, color: muted, margin: '0 0 24px' }}>{p.includes[lang]}</p>
                    <div style={{ height: 1, background: dark ? 'rgba(250,244,232,0.14)' : 'rgba(26,15,6,0.1)', margin: '0 0 16px' }} />
                    <p style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: '1.35rem', color: AMBER, fontWeight: 400, margin: 0 }}>{p.price[lang]}</p>
                  </div>
                )
              })}
            </div>

            {/* Order bar — lead time + the single primary call/email action */}
            <div data-bk-reveal data-bk-delay="0.12" className="bk-veisla-bar" style={{ marginTop: 'clamp(24px,3.5vw,40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'clamp(16px,3vw,32px)', flexWrap: 'wrap', background: WARM_CREAM, borderRadius: 22, padding: 'clamp(22px,3vw,32px) clamp(26px,4vw,44px)' }}>
              <div>
                <p style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(1.15rem,2vw,1.5rem)', lineHeight: 1.15, color: ESPRESSO, fontWeight: 400, margin: '0 0 8px' }}>{c.catBar}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: AMBER, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 500, color: 'rgba(26,15,6,0.5)' }}>{c.catNote}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
                <a href={`tel:${VISIT.tel}`} className="bakery-cta-pill" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: CREAM, background: AMBER, padding: '15px 34px', borderRadius: 9999, textDecoration: 'none', transition: 'all 0.3s', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>{c.catCall}</a>
                <a href={`mailto:${VISIT.email}`} className="bakery-phone-link" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 400, color: 'rgba(26,15,6,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>{c.catEmail} →</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── VISIT ────────────────────────────────────────────── */}
        <section id="bakery-finna" style={{ background: WARM_CREAM, padding: 'clamp(80px,12vw,160px) clamp(20px,5vw,72px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div data-bk-reveal style={{ marginBottom: 'clamp(48px,7vw,80px)' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER, margin: '0 0 16px' }}>{c.visitEyebrow}</p>
              <h2 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(1.8rem,4.5vw,3.6rem)', lineHeight: 1.02, letterSpacing: '-0.025em', color: ESPRESSO, fontWeight: 400, margin: 0, maxWidth: 680 }}>{c.visitH2}</h2>
            </div>
            <div className="bk-visit-outer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'stretch' }}>
              {/* Info cards 2×2 */}
              <div className="bk-info-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* Address */}
                <div data-bk-reveal style={{ background: CARD_BG, borderRadius: 20, border: '1px solid rgba(26,15,6,0.07)', padding: '28px 22px' }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,15,6,0.36)', margin: '0 0 14px' }}>{c.addrEyebrow}</p>
                  <p style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: '1.45rem', lineHeight: 1.1, color: ESPRESSO, fontWeight: 400, margin: '0 0 4px' }}>{VISIT.street}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(26,15,6,0.5)', margin: '0 0 3px' }}>{VISIT.town}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(26,15,6,0.36)', margin: '0 0 22px' }}>Skagafjörður</p>
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="bakery-addr-link" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: AMBER, textDecoration: 'none', transition: 'opacity 0.2s' }}>{c.addrBtn} →</a>
                </div>
                {/* Hours */}
                <div id="bakery-opnunartimar" data-bk-reveal data-bk-delay="0.08" style={{ background: CARD_BG, borderRadius: 20, border: '1px solid rgba(26,15,6,0.07)', padding: '28px 22px' }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,15,6,0.36)', margin: '0 0 12px' }}>{c.hoursEyebrow}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 9999, background: openStatus.open ? 'rgba(86,101,79,0.12)' : 'rgba(120,60,60,0.1)', marginBottom: 18 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: openStatus.open ? SAGE : '#8B3A3A', flexShrink: 0 }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: openStatus.open ? SAGE : '#8B3A3A' }}>{openStatus.label}</span>
                  </div>
                  <dl style={{ display: 'flex', flexDirection: 'column', gap: 7, margin: 0, padding: 0 }}>
                    {HOURS_BILINGUAL.map((h, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                        <dt style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(26,15,6,0.48)', whiteSpace: 'nowrap' }}>{h.day[lang]}</dt>
                        <dd style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: ESPRESSO, whiteSpace: 'nowrap', margin: 0 }}>{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                {/* Phone */}
                <div data-bk-reveal data-bk-delay="0.14" style={{ background: AMBER, borderRadius: 20, padding: '28px 22px', display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,244,232,0.48)', margin: '0 0 14px' }}>{c.phoneEyebrow}</p>
                  <p style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: '1.7rem', lineHeight: 1.1, color: CREAM, fontWeight: 400, margin: '0 auto 0 0', paddingBottom: 20 }}>{VISIT.telLabel}</p>
                  <a href={`tel:${VISIT.tel}`} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: 'rgba(250,244,232,0.72)', textDecoration: 'none', transition: 'color 0.2s', minHeight: 44, display: 'flex', alignItems: 'flex-end' }}>{c.callBtn} →</a>
                </div>
                {/* Email */}
                <div data-bk-reveal data-bk-delay="0.2" style={{ background: CARD_BG, borderRadius: 20, border: '1px solid rgba(26,15,6,0.07)', padding: '28px 22px', display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: AMBER, margin: '0 0 14px' }}>{c.emailEyebrow}</p>
                  <p style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: '1.3rem', lineHeight: 1.1, color: ESPRESSO, fontWeight: 400, margin: '0 0 2px' }}>saudarkroksbakari</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(26,15,6,0.38)', margin: '0 auto 0 0', paddingBottom: 18 }}>@gmail.com</p>
                  <a href={`mailto:${VISIT.email}`} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: AMBER, textDecoration: 'none', transition: 'color 0.2s', minHeight: 44, display: 'flex', alignItems: 'flex-end' }}>{c.emailBtn} →</a>
                </div>
              </div>
              {/* Interactive expand map */}
              <div data-bk-reveal data-bk-delay="0.12" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <ExpandMap lang={lang} openNow={openStatus.open} />
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <footer style={{ background: ESPRESSO, padding: 'clamp(56px,8vw,96px) clamp(20px,5vw,72px) 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Wordmark row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'end', paddingBottom: 52, borderBottom: '1px solid rgba(250,244,232,0.07)' }}>
              <h2 style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 'clamp(2rem,5.5vw,4.8rem)', color: CREAM, margin: 0, letterSpacing: '-0.03em', lineHeight: 1, fontWeight: 400 }}>Sauðárkróks<em>bakarí</em></h2>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(250,244,232,0.2)', whiteSpace: 'nowrap', paddingBottom: 10 }}>est. 1880</span>
            </div>
            {/* Three columns */}
            <div className="bk-footer-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(24px,5vw,80px)', padding: '52px 0 60px', borderBottom: '1px solid rgba(250,244,232,0.07)' }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,244,232,0.22)', margin: '0 0 22px' }}>{c.footerAddress}</p>
                <p style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: '1.15rem', color: CREAM, margin: '0 0 6px', fontWeight: 400, lineHeight: 1.15 }}>{VISIT.street}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(250,244,232,0.38)', lineHeight: 1.85, margin: '0 0 22px' }}>{VISIT.town}<br />Skagafjörður</p>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="bakery-footer-maps" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', color: AMBER, textDecoration: 'none', transition: 'opacity 0.2s' }}>Opna í kortum →</a>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,244,232,0.22)', margin: '0 0 22px' }}>{c.footerHours}</p>
                <dl style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {HOURS_BILINGUAL.map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                      <dt style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(250,244,232,0.38)' }}>{h.day[lang]}</dt>
                      <dd style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: 'rgba(250,244,232,0.65)', margin: 0, whiteSpace: 'nowrap' }}>{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,244,232,0.22)', margin: '0 0 22px' }}>{c.footerContact}</p>
                <a href={`tel:${VISIT.tel}`} className="bakery-footer-phone" style={{ display: 'block', fontFamily: "'Gloock', Georgia, serif", fontSize: '1.55rem', color: CREAM, textDecoration: 'none', fontWeight: 400, margin: '0 0 10px', lineHeight: 1.15, transition: 'color 0.2s' }}>{VISIT.telLabel}</a>
                <a href={`mailto:${VISIT.email}`} className="bakery-footer-email" style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(250,244,232,0.35)', textDecoration: 'none', wordBreak: 'break-all', lineHeight: 1.55, transition: 'color 0.2s' }}>{VISIT.email}</a>
              </div>
            </div>
            {/* Bottom bar */}
            <div style={{ padding: '22px 0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(250,244,232,0.18)', margin: 0 }}>{c.footerCopy}</p>
              <p style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: 12, fontStyle: 'italic', color: 'rgba(250,244,232,0.14)', margin: 0 }}>{c.footerTagline}</p>
            </div>
          </div>
        </footer>
      </div>

      <PreviewFooter company={company} />
    </>
  )
}
