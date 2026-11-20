/**
 * Jólavörur: the Christmas products page (/jol/, /en/jol/).
 *
 * Content from Þorleifur's email of 16 Nov 2026, editable in the Studio
 * (Jólin > Jólavörur). Built on the story page's frame (slim bar, back link,
 * footer) and the home menu's grammar (name, dotted leader, gold price), so it
 * reads as the same bakery, in its Christmas clothes: in season the ground is
 * the red velvet and it snows (Christmas.tsx via Chrome), and the title
 * carries the same snow as HANDGERT.
 *
 * Each group is one photograph (or two, for the cookies) beside its list,
 * alternating sides. A group whose items all cost the same shows the price
 * once ("Allar sortir 999 kr.") instead of seven identical prices.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Chrome from './Chrome'
import { SndrCredit } from './SndrCredit'
import { pathsFor } from './paths'
import { setThemeColor } from '../../lib/preview'
import { LOGO } from './data'
import { useLang } from './useLang'
import { SiteContentProvider, usePageText, useSiteContent } from './sanity'
import { JOL_GROUPS, type JolGroupId, type JolProduct } from './jol-data'
import type { Bilingual } from './order'
import { SnowCap, SnowToggle, useChristmas } from './Christmas'
import { useIsomorphicLayoutEffect } from './ssr'
import { noticeIsActive, shortDate, upcomingExceptions } from './availability'
import {
  BODY, BURGUNDY, DIM, DISPLAY, EASE, FAINT, GOLD, GOLD_LIGHT, GOLD_TEXT, HAIR, HAIR_SOFT, INK, INK_DEEP, IVORY, LETTERPRESS,
} from './tokens'

const T = {
  is: {
    kicker: 'Jólin hjá Reyni',
    title: 'Jólavörur',
    soon: 'Jólavörurnar koma inn á næstu dögum. Hringdu í okkur ef þú vilt vita meira.',
    allKinds: 'Allar sortir',
    whereKicker: 'Panta fyrirfram',
    where: 'Allar jólavörurnar er hægt að panta fyrirfram. Þær fást líka í bakaríinu á Dalvegi 4 í Kópavogi.',
    call: 'Hringja',
    callNote: 'Hringdu til að panta eða ef þú hefur spurningar.',
    holidayKicker: 'Um hátíðirnar',
  },
  en: {
    kicker: 'Christmas at Reynir',
    title: 'Christmas baking',
    soon: 'The Christmas range is on its way. Give us a call if you would like to know more.',
    allKinds: 'All kinds',
    whereKicker: 'Order ahead',
    where: 'Everything in the Christmas range can be ordered ahead. It is also sold at the bakery, Dalvegur 4 in Kópavogur.',
    call: 'Call',
    callNote: 'Call to order, or with any questions.',
    holidayKicker: 'Over the holidays',
  },
} as const

const CSS = `
  html, body { background-color:${INK}; }
  .rb-jol ::selection { background:${BURGUNDY}; color:${IVORY}; }
  .rb-jol a:focus-visible, .rb-jol button:focus-visible { outline:2px solid ${GOLD}; outline-offset:3px; border-radius:4px; }
  .rb-jol-bar { position:sticky; top:0; z-index:150; display:grid; grid-template-columns:1fr auto 1fr; align-items:center;
    gap:20px; padding:calc(14px + env(safe-area-inset-top, 0px)) clamp(20px,4.5vw,72px) 14px;
    background-color:${INK}; border-bottom:1px solid ${HAIR_SOFT}; }
  html[data-jol] .rb-jol-bar { background-color:rgba(64,6,9,.92); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); }
  @media (hover:none) { html[data-jol] .rb-jol-bar { background-color:#400609; -webkit-backdrop-filter:none; backdrop-filter:none; } }
  .rb-jol-awning { position:sticky; top:-100px; height:106px; margin-top:-106px; z-index:140; background:${INK}; pointer-events:none; }
  html[data-jol] .rb-jol-awning { background:#400609; }
  .rb-jol-back { display:inline-flex; align-items:center; gap:8px; text-decoration:none;
    font-family:${BODY}; font-size:14px; color:${DIM}; padding:10px 0; transition:color .2s ${EASE}; }
  .rb-jol-back:hover { color:${GOLD_LIGHT}; font-style:italic; }
  /* on a phone the bar is arrow, centred logo, language: the words stay for screen readers */
  @media (max-width:480px) {
    .rb-jol-bar .rb-jol-back { min-width:44px; min-height:44px; padding:0; }
    .rb-jol-bar .rb-jol-back svg { width:20px; height:20px; }
    .rb-jol-back-txt { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
  }
  .rb-jol-langs { display:flex; align-items:center; justify-self:end; margin-right:-10px; }
  .rb-jol-lang { background:none; border:none; cursor:pointer; min-width:44px; min-height:44px; padding:0 10px; margin:-6px 0;
    font-family:${BODY}; font-size:13px; letter-spacing:.08em; color:${FAINT}; transition:color .2s ${EASE}; border-radius:4px; }
  .rb-jol-lang[aria-pressed="true"] { color:${GOLD_LIGHT}; }

  .rb-jol-group { display:grid; grid-template-columns:minmax(0,5fr) minmax(0,7fr); gap:clamp(28px,5vw,80px); align-items:start; }
  .rb-jol-group[data-flip] { grid-template-columns:minmax(0,7fr) minmax(0,5fr); }
  .rb-jol-group[data-flip] .rb-jol-pics { order:2; }
  .rb-jol-pics { display:grid; gap:14px; }
  .rb-jol-pics[data-n="2"] { grid-template-columns:1fr 1fr; }
  /* three: one tall photo beside two stacked, the tall one as high as the pair */
  .rb-jol-pics[data-n="3"] { grid-template-columns:1.3fr 1fr; grid-template-rows:auto auto; }
  .rb-jol-pics[data-n="3"] .rb-jol-fig:first-child { grid-row:1 / 3; }
  .rb-jol-pics[data-n="3"] .rb-jol-fig:first-child .rb-jol-pic { aspect-ratio:auto; flex:1 1 auto; min-height:0; }
  /* four or more: one row of photos across the whole group, the list below */
  /* order: kicker and title, then the photo row, then the list */
  .rb-jol-group[data-strip] { display:flex; flex-direction:column; gap:0; }
  .rb-jol-group[data-strip] .rb-jol-text { display:contents; }
  .rb-jol-group[data-strip] .rb-jol-text > :nth-child(1) { order:0; }
  .rb-jol-group[data-strip] .rb-jol-text > :nth-child(2) { order:1; }
  .rb-jol-group[data-strip] > .rb-jol-pics { order:2; margin:clamp(14px,2vw,22px) 0 clamp(26px,3vw,38px); }
  .rb-jol-group[data-strip] .rb-jol-text > :nth-child(n+3) { order:3; width:100%; max-width:760px; }
  .rb-jol-pics[data-strip] { grid-template-columns:repeat(var(--n), minmax(0,1fr)); }
  .rb-jol-pics[data-scroll] { grid-template-columns:none; grid-auto-flow:column; grid-auto-columns:calc((100% - 4 * 14px) / 5);
    overflow-x:auto; scroll-snap-type:x mandatory; overscroll-behavior-x:contain; scrollbar-width:thin; }
  .rb-jol-pics[data-scroll] .rb-jol-fig { scroll-snap-align:start; }
  .rb-jol-pics[data-strip]:focus-visible { outline:2px solid ${GOLD}; outline-offset:6px; border-radius:4px; }
  .rb-jol-fig { margin:0; display:flex; flex-direction:column; gap:9px; min-width:0; }
  .rb-jol-fig figcaption { font-size:12.5px; letter-spacing:.04em; color:${DIM}; line-height:1.35; }
  .rb-jol-pic { margin:0; overflow:hidden; border-radius:3px; aspect-ratio:4 / 5; background:${INK_DEEP};
    box-shadow:0 30px 60px -30px rgba(0,0,0,.6); }
  .rb-jol-pic img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .9s ${EASE}; }
  @media (hover:hover) { .rb-jol-fig:hover img { transform:scale(1.035); } }
  .rb-jol-row { padding:18px 0 16px; border-bottom:1px solid ${HAIR_SOFT}; }
  /* name, leader, price on one line; a long name wraps inside its own column and
     the leader and price sit on its last line, never dropped to a new row */
  .rb-jol-line { display:flex; align-items:flex-end; gap:6px; }
  .rb-jol-name { min-width:0; flex:0 1 auto; }
  .rb-jol-line .rb-leader { flex:1 1 24px; min-width:24px; height:0; border-bottom:1.5px dotted rgba(238,211,170,.32); margin:0 4px .42em; }
  .rb-jol-price { flex:none; font-size:15px; font-weight:600; color:${GOLD}; white-space:nowrap; }
  .rb-jol-kinds { display:grid; grid-template-columns:1fr 1fr; gap:0 clamp(20px,3vw,40px); }
  @media (max-width:860px) {
    .rb-jol-group, .rb-jol-group[data-flip] { grid-template-columns:1fr; }
    .rb-jol-group[data-flip] .rb-jol-pics { order:0; }
    .rb-jol-pics { max-width:520px; }
    /* the photo row becomes a row you swipe, native scroll, snapping per photo */
    .rb-jol-pics[data-strip] { max-width:none; grid-template-columns:none; grid-auto-flow:column; grid-auto-columns:clamp(150px,42%,240px);
      overflow-x:auto; scroll-snap-type:x mandatory; overscroll-behavior-x:contain; scrollbar-width:none;
      margin:0 calc(-1 * clamp(20px,4.5vw,72px)); padding:0 clamp(20px,4.5vw,72px); scroll-padding:0 clamp(20px,4.5vw,72px); }
    .rb-jol-pics[data-strip]::-webkit-scrollbar { display:none; }
    .rb-jol-pics[data-strip] .rb-jol-fig { scroll-snap-align:start; }
    .rb-jol-group[data-strip] > .rb-jol-pics[data-strip] { margin-left:calc(-1 * clamp(20px,4.5vw,72px)); margin-right:calc(-1 * clamp(20px,4.5vw,72px)); }
  }
  @media (max-width:520px) { .rb-jol-kinds { grid-template-columns:1fr; } }

  /* arrival: each group rises in once as it reaches the screen */
  /* hidden only once the script has armed it (before paint), so without
     JavaScript every group is simply there */
  .rb-jol-rise { transition:opacity .9s ${EASE}, transform .9s ${EASE}; }
  .rb-jol-rise[data-armed]:not([data-in]) { opacity:0; transform:translateY(22px); }
  .rb-jol-rise[data-in] .rb-jol-row { animation:rb-jol-row .7s ${EASE} both; animation-delay:calc(var(--i) * 60ms + 120ms); }
  @keyframes rb-jol-row { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  @media (prefers-reduced-motion: reduce) {
    .rb-jol-rise, .rb-jol-rise[data-armed]:not([data-in]) { opacity:1; transform:none; transition:none; }
    .rb-jol-rise[data-in] .rb-jol-row { animation:none; }
    .rb-jol-pic img { transition:none; }
  }
`

/* Counts and headings follow the list as it stands in the Studio, so hiding a
   cookie or a whole group never leaves the page claiming what is not there. */
const KINDS_IS = ['', 'ein sort', 'tvær sortir', 'þrjár sortir', 'fjórar sortir', 'fimm sortir', 'sex sortir', 'sjö sortir', 'átta sortir', 'níu sortir', 'tíu sortir']
const KINDS_EN = ['', 'one kind', 'two kinds', 'three kinds', 'four kinds', 'five kinds', 'six kinds', 'seven kinds', 'eight kinds', 'nine kinds', 'ten kinds']
const kinds = (n: number, lang: 'is' | 'en') => (lang === 'is' ? KINDS_IS[n] ?? `${n} sortir` : KINDS_EN[n] ?? `${n} kinds`)
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const allButter = (items: JolProduct[]) => items.every((p) => /^butterdeig/i.test(p.name.is))

function groupMeta(id: JolGroupId, items: JolProduct[]): { title: Bilingual; kicker: Bilingual } {
  const base = JOL_GROUPS.find((g) => g.id === id)!
  if (id === 'smakokur') return { title: base.title, kicker: { is: cap(kinds(items.length, 'is')), en: cap(kinds(items.length, 'en')) } }
  if (id === 'kokur' && items.length > 1) return { title: { is: 'Jólakökur', en: 'Christmas cakes' }, kicker: { is: 'Bakaðar fyrir jólin', en: 'Baked for Christmas' } }
  if (id === 'kokur') return { title: base.title, kicker: items[0].name }
  if (id === 'annad' && !allButter(items)) return { title: { is: 'Fleira fyrir jólin', en: 'More for Christmas' }, kicker: base.kicker }
  return base
}

function leadFor(groups: { id: JolGroupId; items: JolProduct[] }[], lang: 'is' | 'en'): string {
  const parts: string[] = []
  for (const g of groups) {
    if (g.id === 'lagtertur') parts.push(lang === 'is' ? 'lagtertur' : 'layer cakes')
    else if (g.id === 'kokur') parts.push(g.items.length === 1 ? (lang === 'is' ? g.items[0].name.is.toLowerCase() : g.items[0].name.en) : (lang === 'is' ? 'jólakökur' : 'Christmas cakes'))
    else if (g.id === 'smakokur') parts.push(lang === 'is' ? `${kinds(g.items.length, 'is')} af smákökum` : `${kinds(g.items.length, 'en')} of Christmas cookies`)
    else if (g.id === 'annad' && allButter(g.items)) parts.push(lang === 'is' ? 'butterdeigsbotnar' : 'puff pastry bases')
  }
  const tail = lang === 'is' ? 'Allt bakað á staðnum á Dalvegi, eins og annað hjá okkur.' : 'All baked on site on Dalvegur, like everything else we make.'
  if (!parts.length) return tail
  const and = lang === 'is' ? ' og ' : ' and '
  const list = parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + and + parts[parts.length - 1]
  return `${cap(list)}. ${tail}`
}

function useRise() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setIn] = useState(false)
  const [armed, setArmed] = useState(false)
  useIsomorphicLayoutEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setArmed(true)
  }, [])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setIn(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect() } }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, inView, armed }
}

function Group({ id, items, flip, lang }: { id: JolGroupId; items: JolProduct[]; flip: boolean; lang: 'is' | 'en' }) {
  const meta = groupMeta(id, items)
  const { ref, inView, armed } = useRise()
  const pics = items.filter((p) => p.img)
  const strip = pics.length >= 4
  const scrolls = pics.length > 5 // more than five: a row you scroll on every screen
  const prices = new Set(items.map((p) => p.price))
  // one shared price only when EVERY kind carries that same price
  const onePrice = items.length >= 3 && prices.size === 1 && items[0].price ? items[0].price : undefined
  const t = T[lang]
  return (
    <div ref={ref} className="rb-jol-group rb-jol-rise" data-strip={strip || undefined} data-flip={(flip && !strip) || undefined} data-armed={armed || undefined} data-in={inView || undefined}>
      {pics.length > 0 && (
        <div className="rb-jol-pics" data-n={pics.length} data-strip={strip || undefined} data-scroll={scrolls || undefined} style={{ ['--n' as string]: Math.min(pics.length, 5) }}
          {...(strip ? { role: 'region', tabIndex: 0, 'aria-label': lang === 'is' ? `Myndir: ${meta.title.is}` : `Photos: ${meta.title.en}` } : {})}>
          {pics.map((p, i) => (
            <figure className="rb-jol-fig" key={p.img!.src}>
              <div className="rb-jol-pic">
              <img src={p.img!.src} srcSet={`${p.img!.srcSm} 600w, ${p.img!.src} 1000w`} sizes={strip ? '(max-width:860px) 42vw, 18vw' : pics.length === 1 ? '(max-width:860px) 92vw, 40vw' : pics.length === 3 && i === 0 ? '(max-width:860px) 52vw, 23vw' : '(max-width:860px) 46vw, 20vw'}
                alt={p.img!.alt[lang]} width={1000} height={1250} loading="lazy" decoding="async" />
              </div>
              {/* named whenever the group lists more than one product, so a photo is never mistaken for its neighbour;
                  a group of one product is named right beside its photo already */}
              {items.length > 1 && <figcaption>{p.name[lang]}</figcaption>}
            </figure>
          ))}
        </div>
      )}
      <div className="rb-jol-text" style={{ gridColumn: pics.length ? undefined : '1 / -1' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{meta.kicker[lang]}</div>
        <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(30px,3.6vw,48px)', lineHeight: 1.05, margin: '12px 0 10px', ...GOLD_TEXT }}>{meta.title[lang]}</h2>
        {onePrice ? (
          <>
            <div className="rb-jol-row" style={{ ['--i' as string]: 0 }}>
              <div className="rb-jol-line">
                <span className="rb-jol-name" style={{ fontFamily: DISPLAY, fontSize: 'clamp(19px,1.7vw,23px)', color: IVORY }}>{t.allKinds}</span>
                <span className="rb-leader" aria-hidden="true" />
                <span className="rb-jol-price">{onePrice}</span>
              </div>
            </div>
            <ul className="rb-jol-kinds" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {items.map((p, i) => (
                <li key={p.name.is} className="rb-jol-row" style={{ ['--i' as string]: i + 1, padding: '14px 0 12px' }}>
                  <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(17px,1.5vw,20px)', color: IVORY }}>{p.name[lang]}</span>
                  {p.desc && <p style={{ fontSize: 14, color: DIM, margin: '4px 0 0' }}>{p.desc[lang]}</p>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {items.map((p, i) => (
              <li key={p.name.is} className="rb-jol-row" style={{ ['--i' as string]: i }}>
                <div className="rb-jol-line">
                  <span className="rb-jol-name" style={{ fontFamily: DISPLAY, fontSize: 'clamp(19px,1.7vw,23px)', lineHeight: 1.25, color: IVORY }}>{p.name[lang]}</span>
                  {p.price && <><span className="rb-leader" aria-hidden="true" /><span className="rb-jol-price">{p.price}</span></>}
                </div>
                {p.desc && <p style={{ fontSize: 14.5, color: DIM, margin: '6px 0 0' }}>{p.desc[lang]}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ChristmasPageInner() {
  const [lang, setLang] = useLang()
  const P = pathsFor(lang)
  const pt = usePageText(lang)
  const t = T[lang]
  const { JOL, LINKS, hoursRows, mainName, dateExceptions, notice } = useSiteContent()
  /* Holiday hours: the dated changes he enters in the Studio (Opnunartími >
     Frídagar og breyttur opnunartími), from today to the end of the season.
     Client-only, like on the front page: they depend on today's date. */
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => { setNow(Date.now()) }, [])
  const holiday = now === null ? [] : upcomingExceptions(dateExceptions, now, 60)
  const noticeLive = now !== null && noticeIsActive(notice, now)
  const hm = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
  const season = useChristmas()
  useEffect(() => { setThemeColor(INK) }, [])

  const wrap: CSSProperties = { maxWidth: 1180, margin: '0 auto' }
  const pad = 'clamp(56px,8vh,100px) clamp(20px,4.5vw,72px)'
  const groups = JOL_GROUPS.map((g) => ({ id: g.id, items: JOL.filter((p) => p.group === g.id) })).filter((g) => g.items.length)

  return (
    <div className="rb-jol" style={{ background: INK, color: IVORY, fontFamily: BODY, minHeight: '100svh', overflowX: 'clip' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="rb-jol-awning" aria-hidden="true" />
      <div className="rb-jol-bar">
        <Link to={P.home} className="rb-jol-back" style={{ justifySelf: 'start' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="rb-jol-back-txt">{pt.storyBack}</span>
        </Link>
        <Link to={P.home} style={{ display: 'flex' }}>
          <img src={LOGO} alt="Reynir bakari" width={132} height={57} decoding="async" style={{ width: 92, height: 'auto' }} />
        </Link>
        <div role="group" aria-label="Language" className="rb-jol-langs">
          <button className="rb-jol-lang" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
          <span aria-hidden="true" style={{ color: FAINT, alignSelf: 'center' }}>/</span>
          <button className="rb-jol-lang" aria-pressed={lang === 'is'} onClick={() => setLang('is')}>ÍS</button>
        </div>
      </div>

      <main id="reynir-jol-content">
        <section style={{ padding: 'clamp(64px,11vh,130px) clamp(20px,4.5vw,72px) clamp(24px,4vh,48px)' }}>
          <div style={{ ...wrap, textAlign: 'center' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.kicker}</div>
            <h1 className={season.on ? 'rb-snowcap' : undefined} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(46px,8vw,112px)', lineHeight: 0.98, letterSpacing: '.02em', margin: '18px auto 0', width: 'fit-content', ...GOLD_TEXT, ...LETTERPRESS }}>
              {t.title}{season.on && <SnowCap text={t.title} />}
            </h1>
            <p style={{ fontSize: 'clamp(16px,1.6vw,19px)', lineHeight: 1.65, color: DIM, maxWidth: '54ch', margin: '22px auto 0' }}>{leadFor(groups, lang)}</p>
            {!groups.length && <p style={{ fontFamily: DISPLAY, fontSize: 'clamp(20px,2.2vw,26px)', lineHeight: 1.4, color: IVORY, maxWidth: '30ch', margin: '36px auto 0' }}>{t.soon}</p>}
          </div>
        </section>

        {groups.map((g, i) => (
          <section key={g.id} style={{ padding: pad, borderTop: i ? `1px solid ${HAIR_SOFT}` : undefined }}>
            <div style={wrap}><Group id={g.id} items={g.items} flip={i % 2 === 1} lang={lang} /></div>
          </section>
        ))}

        <section style={{ padding: pad, borderTop: `1px solid ${HAIR_SOFT}` }}>
          <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.whereKicker}</div>
              <p style={{ fontFamily: DISPLAY, fontSize: 'clamp(22px,2.4vw,30px)', lineHeight: 1.3, color: IVORY, margin: '14px 0 0', maxWidth: '24ch' }}>{t.where}</p>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {hoursRows[lang].map((l) => (
                <div key={l.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${HAIR_SOFT}`, paddingBottom: 10, fontSize: 14.5, color: DIM }}>
                  <span>{l.label}</span><span style={{ color: IVORY }}>{l.value}</span>
                </div>
              ))}
              {holiday.length > 0 && <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginTop: 14 }}>{t.holidayKicker}</div>}
              {holiday.map((d) => (
                <div key={d.date} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${HAIR_SOFT}`, paddingBottom: 10, fontSize: 14.5, color: DIM }}>
                  <span>{shortDate(d.date, lang)}</span>
                  <span style={{ color: GOLD }}>{d.closed ? (lang === 'en' ? 'Closed' : 'Lokað') : `${hm(d.open)} ${lang === 'en' ? 'to' : 'til'} ${hm(d.close)}`}</span>
                </div>
              ))}
              {noticeLive && notice && <p style={{ margin: '6px 0 0', fontSize: 14.5, color: IVORY, lineHeight: 1.55 }}>{notice.text[lang]}</p>}
              <p style={{ fontSize: 14.5, color: DIM, margin: '10px 0 0' }}>{t.callNote}</p>
              <a href={`tel:${LINKS.phone}`} className="rb-jol-back" style={{ color: GOLD_LIGHT, fontSize: 18, fontFamily: DISPLAY, borderBottom: `1px solid ${HAIR}`, width: 'fit-content' }}>
                {t.call} · {LINKS.phoneLabel}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ background: INK_DEEP, borderTop: `1px solid ${HAIR_SOFT}`, padding: '48px clamp(20px,4.5vw,72px)' }}>
        <div style={{ ...wrap, display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <Link to={P.home} className="rb-jol-back">{pt.storyBack}</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 13, color: FAINT }}>{mainName}</div>
            <SnowToggle lang={lang} />
            <SndrCredit lang={lang} />
          </div>
        </div>
      </footer>
      <Chrome />
    </div>
  )
}

export default function ReynirChristmasPage() {
  return (
    <SiteContentProvider>
      <ChristmasPageInner />
    </SiteContentProvider>
  )
}
