import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { SCRIPT, DISPLAY } from './handwriting'
import type { ScriptLine } from './handwriting'
import {
  ADDRESS, BORD, CLOSE_LABEL, CLOSE_MIN, EMAIL, FACEBOOK, FOOTER, HERO, HOURS_LABEL,
  HUSID, IMG, INSTAGRAM, MAPS_URL, MATSEDILL, NAV, OPEN_LABEL, OPEN_MIN, OPID, PHONE,
  PHONE_HREF, PLATES, PORTRAIT, REVIEWS, SUPAN, UMSAGNIR, plateSrc, plateSrcSet,
} from './data'

const company = getPreviewCompany('naustid')

/* ══════════════════════════════════════════════════════════════════════════
 * NAUSTIÐ — "Gula húsið"
 * Rework 2026-09-05. Plan: _docs/NAUSTID-REWORK-2026-09.md
 * Grammar ported from haven-annecy.fr — _reference/haven-annecy-teardown/
 *
 * The four things this page is built out of:
 *
 *  1 · HANDWRITING. Five lines are written on, letter by letter, as SVG
 *      outlines traced by stroke-dashoffset and then flooded with fill. The
 *      reference does this at runtime with opentype.js; we precompute the
 *      outlines and their exact path lengths at build time (see
 *      scripts/naustid-handwriting.mjs), so the page ships data instead of a
 *      font parser. The per-letter duration is the glyph's own path length /
 *      1000 — long letters take longer, which is what makes it read as a hand
 *      rather than a stagger. Letters overlap by 35% (delay += .65 × duration).
 *
 *  2 · TWO WATERCOLOURS of the house, painted from the restaurant's own
 *      photograph and feathered into the page ground so neither has an edge.
 *      The house is painted; the food is photographed; nothing is stock.
 *
 *  3 · ONE CONTINUOUS LINE — a fish, drawn in a single unbroken stroke that
 *      draws itself across the hero. Their signboard already carries a fish.
 *
 *  4 · COLOUR PANELS, no cards, no shadows. Depth comes from a moss panel
 *      overlapping a painting, and from oversized script colliding with the
 *      block above it. Zero box-shadows on the page, exactly as the reference.
 *
 * Every colour was sampled off their own photographs: the ground is the white
 * window trim, the ink is the tarred base course, the moss is the panelled
 * dining-room wall, the yellow is the corrugated iron.
 * ══════════════════════════════════════════════════════════════════════ */

const BEIN = '#FBF6EA'   // ground — the white trim and the tablecloths
const TJARA = '#1E2016'  // text  — the tarred base course
const THANG = '#414A2C'  // panel — the sage-olive dining room
const HUSGULT = '#E0B424' // accent — the corrugated iron
const SOL = '#EAE3C7'    // soft   — the upstairs wallpaper

const EASE = 'cubic-bezier(.2,.8,.2,1)'
const WRITE_EASE = 'cubic-bezier(.45,0,.55,1)'

/* ────────────────────────────────────────────────────────────────────────
 * The handwriting renderer.
 * One <svg> per word so words can wrap; one <path> per glyph so each letter
 * carries its own dash length, duration and delay.
 * ──────────────────────────────────────────────────────────────────────── */

const PAD = 14 // user units of breathing room for brush swashes past the advance

function Handwriting({
  line, className = '', style, draw = true, id,
}: {
  line: ScriptLine
  className?: string
  style?: CSSProperties
  /** false = the wordmark: painted at once, never animated */
  draw?: boolean
  id?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(!draw)

  useEffect(() => {
    if (!draw) return
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true)
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [draw])

  const [, yMin, , yMax] = line.bbox
  const h = yMax - yMin

  let delay = 0.1
  const words = line.words.map((w, wi) => {
    const paths = w.glyphs.map((g, gi) => {
      const dur = g.len / 1000
      const d = delay
      delay += 0.65 * dur
      return (
        <path
          key={gi}
          className="nd-draw"
          d={g.d}
          style={{ ['--l' as string]: g.len, ['--t' as string]: `${dur.toFixed(3)}s`, ['--d' as string]: `${d.toFixed(3)}s` }}
        />
      )
    })
    delay += 0.08
    return (
      <span className="nd-word" key={wi}>
        <svg
          viewBox={`${-PAD} ${yMin} ${w.width + PAD * 2} ${h}`}
          style={{ height: `${(h / 100).toFixed(3)}em` }}
          aria-hidden="true"
          focusable="false"
        >
          {paths}
        </svg>
      </span>
    )
  })

  return (
    <span
      ref={ref}
      id={id}
      className={`nd-script ${active ? 'is-active' : ''} ${className}`}
      style={style}
      role="img"
      aria-label={line.text}
    >
      {words}
    </span>
  )
}

/** The flat display word the script collides with. Scales to its container. */
function DisplayWord({ k }: { k: keyof typeof DISPLAY }) {
  const w = DISPLAY[k]
  const [x0, y0, x1, y1] = w.bbox
  return (
    <svg
      className="nd-display"
      viewBox={`${x0 - 2} ${y0 - 2} ${x1 - x0 + 4} ${y1 - y0 + 4}`}
      role="img"
      aria-label={w.text}
      focusable="false"
    >
      <path d={w.d} />
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * One continuous line: a fish. Enters top-left, becomes the fish, leaves as
 * the swell. Drawn with stroke-dashoffset over a duration proportional to its
 * own length, the way the reference draws its shopfront doodle.
 * ──────────────────────────────────────────────────────────────────────── */

const FISH_D =
  /* one unbroken stroke: drift in from the left, round the body, notch the
     tail, come back under to the snout, then fall away as the swell */
  'M -20 96 C 90 60 220 52 320 84 C 400 108 440 128 486 136 ' +
  'C 560 74 700 58 812 96 C 848 108 878 74 922 60 ' +
  'C 910 96 910 132 922 166 C 878 154 848 122 812 134 ' +
  'C 700 172 560 190 486 136 C 452 150 430 176 452 194 ' +
  'C 560 236 760 238 900 206 C 1040 176 1180 168 1300 190 ' +
  'C 1360 200 1392 208 1424 214'

function FishLine() {
  const ref = useRef<SVGPathElement>(null)
  const [len, setLen] = useState(0)
  useEffect(() => {
    const p = ref.current
    if (p) setLen(p.getTotalLength())
  }, [])
  const dur = len ? Math.max(2.4, len / 620) : 0
  return (
    <svg
      className="nd-fish"
      viewBox="-30 40 1470 212"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <path
        ref={ref}
        d={FISH_D}
        style={len ? { ['--l' as string]: len, ['--t' as string]: `${dur.toFixed(2)}s` } : { opacity: 0 }}
      />
    </svg>
  )
}

/* ── the reveal grammar: 40px lift, .9s, once, then unobserved ───────────── */

function Reveal({
  children, as: As = 'div', className = '', delay = 0,
}: {
  children: ReactNode
  as?: 'div' | 'section' | 'li' | 'p' | 'header'
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true)
      return
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <As
      ref={ref as never}
      className={`nd-rev ${on ? 'is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </As>
  )
}

/** A photo. WebP with a JPEG fallback, always with a real alt. */
function Pic({
  src, set, alt, sizes, className = '', eager = false,
}: {
  src: string
  set: string
  alt: string
  sizes: string
  className?: string
  eager?: boolean
}) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={set} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        /* lowercase: React 18 has no camelCase fetchPriority prop */
        {...(eager ? { fetchpriority: 'high' } : {})}
      />
    </picture>
  )
}

/* ── the hand-drawn arrow link ───────────────────────────────────────────── */

const ARROW =
  'M.05 6.4C-.08 5.94.07 5.47.44 5.17.52 5.1.56 5.08.69 5.02.88 4.94.9 4.93 1.58 4.88 8.2 4.33 13.83 4.19 18.92 4.45c.36.02.77.04.91.05.15.01.28.02.3.02.04 0 .09.04-.48-.36-.73-.5-1.24-.85-2.36-1.58-.42-.27-.79-.52-.84-.56-.15-.13-.28-.32-.35-.53-.16-.47.02-1.01.44-1.3.13-.09.33-.17.48-.19.24-.03.46 0 .68.1.07.03 1.21.77 1.9 1.22 1.36.9 2.4 1.64 3.39 2.41.21.16.49.38.62.48.71.54 1.04.91 1.25 1.41.17.4.19.79.06 1.17-.29.86-1.25 1.58-3.5 2.63-.79.37-2.77 1.2-2.97 1.24-.29.07-.58.03-.84-.12a1.06 1.06 0 0 1-.58-.93c-.02-.35.13-.7.39-.93.14-.12.19-.15.97-.46.6-.25.89-.37 1.69-.73.53-.24 1.02-.46 1.1-.51l.14-.07-.34-.03c-.51-.04-1.5-.1-2.2-.14-4.92-.25-10.46-.12-16.9.41-.79.07-.86.06-1.08 0A1.06 1.06 0 0 1 .05 6.4Z'

function ArrowLink({
  href, children, flip = false, tone = 'ink',
}: {
  href: string
  children: ReactNode
  flip?: boolean
  tone?: 'ink' | 'bone' | 'gult'
}) {
  return (
    <a className={`nd-link ${flip ? 'is-flip' : ''} nd-link-${tone}`} href={href}>
      <span>{children}</span>
      <svg className="nd-arrow" viewBox="0 0 25 10.7" aria-hidden="true" focusable="false">
        <path d={ARROW} />
      </svg>
    </a>
  )
}

/* ── the marquee: three copies, 0.9px a frame, forever ───────────────────── */

function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const first = el.querySelector<HTMLUListElement>('ul')
    if (!first) return
    let raf = 0
    let x = 0
    let width = 0
    const measure = () => {
      width = first.getBoundingClientRect().width + 27
    }
    const tick = () => {
      if (!width) measure()
      x += 0.9
      if (x >= width) {
        x = 0
        el.scrollLeft = 0
      } else {
        el.scrollLeft = x
      }
      raf = requestAnimationFrame(tick)
    }
    const start = window.setTimeout(() => {
      measure()
      raf = requestAnimationFrame(tick)
    }, 200)
    const ro = new ResizeObserver(measure)
    ro.observe(first)
    return () => {
      window.clearTimeout(start)
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])
  const strip = (copy: number) => (
    <ul key={copy} aria-hidden={copy > 0}>
      {PLATES.map((pl) => (
        <li key={pl.key}>
          <Pic
            src={plateSrc(pl.key)}
            set={plateSrcSet(pl.key)}
            alt={copy === 0 ? pl.alt : ''}
            sizes="(max-width: 767px) 62vw, (max-width: 1279px) 32vw, 24vw"
          />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="nd-marquee" ref={ref}>
      {[0, 1, 2].map(strip)}
    </div>
  )
}

/* ── open / closed against 11:30–21:30 ───────────────────────────────────── */

function useOpenNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(t)
  }, [])
  const minutes = now.getHours() * 60 + now.getMinutes()
  return minutes >= OPEN_MIN && minutes < CLOSE_MIN
}

/* ════════════════════════════════════════════════════════════════════════ */

export default function NaustidPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLElement>(null)
  const [menu, setMenu] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', contact: '', guests: '2', when: '', message: '' })
  const open = useOpenNow()

  /* Page ink on html/body: Safari 26 tints its own chrome from it, and the
     sticky awning needs a solid ground behind it. Restored on the way out so
     the rest of the app is untouched. */
  useEffect(() => {
    document.title = 'Naustið, sjávarréttastaður á Húsavík'
    setThemeColor(BEIN)
    const h = document.documentElement.style
    const b = document.body.style
    const prev = { h: h.backgroundColor, b: b.backgroundColor }
    h.backgroundColor = BEIN
    b.backgroundColor = BEIN
    return () => {
      h.backgroundColor = prev.h
      b.backgroundColor = prev.b
      setThemeColor('#0a1320')
    }
  }, [])

  /* The header: static inside the hero, then a fixed bar that slides down once
     the hero has left. Exactly the reference's IntersectionObserver, including
     the double rAF that lets the browser paint translateY(-100%) before the
     transition runs. Overridden to a permanent bar under 768px, where SNDR's
     standing chrome rule forbids a header that transforms at all. */
  useEffect(() => {
    const hero = heroRef.current
    const head = headRef.current
    if (!hero || !head) return
    if (window.matchMedia('(max-width: 767px)').matches) return
    let shown = false
    let leave = 0
    const apply = () => {
      if (shown) {
        head.classList.remove('is-leaving')
        head.classList.add('is-visible')
      } else {
        head.classList.remove('is-visible')
        head.classList.add('is-leaving')
      }
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting && e.boundingClientRect.top < 0) {
          shown = true
          head.classList.add('is-fixed')
          requestAnimationFrame(() => requestAnimationFrame(apply))
        } else if (e.isIntersecting && head.classList.contains('is-fixed')) {
          shown = false
          apply()
          window.clearTimeout(leave)
          leave = window.setTimeout(() => {
            if (!shown) head.classList.remove('is-fixed', 'is-visible', 'is-leaving')
          }, 600)
        }
      },
      { threshold: 0 },
    )
    io.observe(hero)
    return () => {
      io.disconnect()
      window.clearTimeout(leave)
    }
  }, [])

  /* Menu panel: fix the body at its offset rather than overflow:hidden, which
     does not hold on iOS and also kills the sticky awning. */
  useEffect(() => {
    if (!menu) return
    const y = window.scrollY
    const b = document.body.style
    const prev = { position: b.position, top: b.top, left: b.left, right: b.right, width: b.width }
    b.position = 'fixed'
    b.top = `-${y}px`
    b.left = '0'
    b.right = '0'
    b.width = '100%'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    const mq = window.matchMedia('(min-width: 768px)')
    const onWide = (e: MediaQueryListEvent) => e.matches && setMenu(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onWide)
    return () => {
      b.position = prev.position
      b.top = prev.top
      b.left = prev.left
      b.right = prev.right
      b.width = prev.width
      const prevBehavior = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, y)
      document.documentElement.style.scrollBehavior = prevBehavior
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onWide)
    }
  }, [menu])

  const mailto = useMemo(() => {
    const body = [
      `Nafn: ${form.name}`,
      `Sími eða netfang: ${form.contact}`,
      `Fjöldi gesta: ${form.guests}`,
      `Dagur og tími: ${form.when}`,
      form.message ? `Skilaboð: ${form.message}` : '',
    ].filter(Boolean).join('\n')
    return `mailto:${EMAIL}?subject=${encodeURIComponent('Borðapöntun')}&body=${encodeURIComponent(body)}`
  }, [form])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const nav = (
    <ul className="nd-nav">
      {NAV.map((n) => (
        <li key={n.id}>
          <a href={`#${n.id}`} onClick={() => setMenu(false)}>
            <span>{n.label}</span>
            {n.sub ? <em>{n.sub}</em> : null}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="nd-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <PreviewChrome company={company} />

      {/* The awning: sticky, so it lives in the scrolling layer — the only
          layer iOS paints inside the Dynamic Island strip. Mobile only. */}
      <div className="nd-awning" aria-hidden="true" />

      <div className="nd-headwrap">
        <header className="nd-head" ref={headRef}>
          <div className="nd-headin">
            <a className="nd-mark" href="#top" aria-label="Naustið">
              <Handwriting line={SCRIPT.mark} draw={false} className="nd-markscript" />
              <span className="nd-marksub">veitingastaður · Húsavík</span>
            </a>
            <nav className="nd-navwrap" aria-label="Aðalvalmynd">{nav}</nav>
            <p className={`nd-barstatus ${open ? 'is-open' : ''}`}>
              <span className="nd-dot" aria-hidden="true" />
              {open ? `Opið til ${CLOSE_LABEL}` : `Opnum kl. ${OPEN_LABEL}`}
              <a href={PHONE_HREF}>{PHONE}</a>
            </p>
            <div className="nd-actions">
              <a className="nd-pill nd-pill-1" href="#bord">Panta borð</a>
            </div>
            <span className={`nd-dot nd-dot-m ${open ? 'is-open' : ''}`} aria-hidden="true" />
            <button
              type="button"
              className="nd-menubtn"
              aria-expanded={menu}
              aria-controls="nd-menu"
              onClick={() => setMenu((v) => !v)}
            >
              {menu ? 'Loka' : 'Valmynd'}
            </button>
          </div>
        </header>
      </div>

      {menu ? (
        <div className="nd-menu" id="nd-menu">
          <div className="nd-menuin">
            {nav}
            <div className="nd-menufoot">
              <a className="nd-pill nd-pill-1 nd-pill-full" href="#bord" onClick={() => setMenu(false)}>Panta borð</a>
              <a className="nd-pill nd-pill-2 nd-pill-full" href={PHONE_HREF}>{`Hringja · ${PHONE}`}</a>
              <p className="nd-menuaddr">{ADDRESS}<br />{HOURS_LABEL}</p>
            </div>
          </div>
        </div>
      ) : null}

      <main id="top">
        {/* ─── 1 · HERO ─────────────────────────────────────────────────── */}
        <div className="nd-hero" ref={heroRef}>
          <div className="nd-heropic">
            <Pic
              src={IMG.hus}
              set={IMG.husWebp}
              alt={HERO.imgAlt}
              sizes="100vw"
              eager
              className="nd-akvarel"
            />
          </div>
          <div className="nd-fishband" aria-hidden="true"><FishLine /></div>
          <div className="nd-herotext">
            <Reveal>
              <h1 className="nd-h1">{HERO.h1}</h1>
            </Reveal>
            <Reveal delay={90}>
              <div className="nd-herobody">
                <p>{HERO.body}</p>
                <p><strong>{HERO.welcome}</strong></p>
                <p className="nd-herocta">
                  <a className="nd-btn nd-btn-1" href="#bord">{HERO.ctaTable}</a>
                  <a className="nd-btn nd-btn-2" href={PHONE_HREF}>{HERO.ctaCall}</a>
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ─── 2 · SÚPAN — the moss panel ───────────────────────────────── */}
        <section className="nd-panel" id="supan" aria-labelledby="nd-supan-h">
          <p className="nd-eyebrow" id="nd-supan-h">{SUPAN.eyebrow}</p>
          <Handwriting line={SCRIPT.amma} className="nd-script-mid" />
          <div className="nd-two">
            {SUPAN.columns.map((c, i) => (
              <Reveal key={c.h} delay={i * 90}>
                <div className="nd-col">
                  <h2 className="nd-h2">{c.h}</h2>
                  <p>{c.body}</p>
                  {c.quote ? (
                    <blockquote className="nd-quote">
                      <p>„{c.quote}"</p>
                      <cite>{c.quoteName} · {c.quoteSource}</cite>
                    </blockquote>
                  ) : null}
                  <ArrowLink href={c.href} tone="bone" flip={i === 0}>{c.link}</ArrowLink>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── 3 · MATSEÐILL — display word + script + the list ─────────── */}
        <section className="nd-teaser" id="matsedill" aria-labelledby="nd-mat-h">
          <div className="nd-teaserhead">
            <DisplayWord k="matsedill" />
            <Handwriting line={SCRIPT.alla} className="nd-script-big nd-script-gult" />
          </div>
          <div className="nd-teasertext">
            <Reveal>
              <h2 className="nd-h2" id="nd-mat-h">{MATSEDILL.h}</h2>
            </Reveal>
            <Reveal delay={90}>
              <div>
                <p>{MATSEDILL.body}</p>
                <ArrowLink href={MATSEDILL.href}>{MATSEDILL.link}</ArrowLink>
              </div>
            </Reveal>
          </div>

          <div className="nd-menugrid">
            <aside className="nd-rail">
              <div className="nd-railcard">
                <h3 className="nd-railh">{MATSEDILL.rail.h}</h3>
                <dl>
                  {MATSEDILL.rail.rows.map((r) => (
                    <div key={r.k}><dt>{r.k}</dt><dd>{r.v}</dd></div>
                  ))}
                </dl>
                <p className="nd-railcta">
                  <a className="nd-btn nd-btn-1" href={PHONE_HREF}>{`Hringja · ${PHONE}`}</a>
                </p>
              </div>
            </aside>

            <div className="nd-dishwrap">
            <div className="nd-dishes">
              {MATSEDILL.groups.map((g) => (
                <div className="nd-menugroup" key={g.title}>
                  <h3 className="nd-h3">{g.title}</h3>
                  <ul>
                    {g.items.map((it) => (
                      <li key={it.name}>
                        <span className="nd-dish">{it.name}</span>
                        <span className="nd-note">{it.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="nd-fine nd-menufine">{MATSEDILL.smallPrint}</p>
            </div>
          </div>
        </section>

        {/* ─── 4 · DISKARNIR — the marquee ──────────────────────────────── */}
        <section className="nd-plates" aria-label="Myndir af réttum Naustsins">
          <Marquee />
        </section>

        {/* ─── 5 · HÚSIÐ — display word + script + the story ────────────── */}
        <section className="nd-teaser" id="husid" aria-labelledby="nd-hus-h">
          <div className="nd-teaserhead">
            <DisplayWord k="husid" />
            <Handwriting line={SCRIPT.sidan} className="nd-script-big nd-script-gult" />
          </div>
          <div className="nd-story">
            <Reveal className="nd-storypic">
              <Pic
                src={PORTRAIT.salur.src}
                set={PORTRAIT.salur.set}
                alt="Matsalur Naustsins: sagræn þiljuð veggklæðning, hvítur gluggapóstur og dekkað borð með hvítvíni"
                sizes="(max-width: 959px) 92vw, 38vw"
              />
            </Reveal>
            <Reveal className="nd-storytext" delay={90}>
              <h2 className="nd-h2" id="nd-hus-h">{HUSID.h}</h2>
              <p>{HUSID.body}</p>
              <p>{HUSID.body2}</p>
              <ul className="nd-ledger">
                {HUSID.facts.map((f) => (
                  <li key={f.k}>
                    <span className="nd-factk">{f.k}</span>
                    <span className="nd-factv">{f.v}</span>
                  </li>
                ))}
              </ul>
              <ArrowLink href={HUSID.href}>{HUSID.link}</ArrowLink>
            </Reveal>
          </div>
        </section>

        {/* ─── 6 · SAGAN — the second painting under the moss panel ─────── */}
        <section className="nd-about" aria-labelledby="nd-sagan-h">
          <div className="nd-aboutpic">
            <Pic
              src={IMG.sagan}
              set={IMG.saganWebp}
              alt={UMSAGNIR.imgAlt}
              sizes="100vw"
              className="nd-akvarel"
            />
          </div>
          <div className="nd-aboutpanel">
            {/* The wordmark sits in the band where the panel has climbed over the
                painting, the way the reference drops its logo onto the drawing. */}
            <Handwriting line={SCRIPT.mark} draw={false} className="nd-aboutmark" />
            <p className="nd-eyebrow">{UMSAGNIR.eyebrow}</p>
            <h2 className="nd-h2 nd-umsagnirh" id="nd-sagan-h">{UMSAGNIR.h}</h2>
            <ul className="nd-scores">
              {UMSAGNIR.scores.map((sc, i) => (
                <Reveal as="li" key={sc.k} delay={i * 80}>
                  <span className="nd-scorev">{sc.v}</span>
                  <span className="nd-scorek">{sc.k}</span>
                </Reveal>
              ))}
            </ul>
            <ul className="nd-reviews">
              {REVIEWS.map((r, i) => (
                <Reveal as="li" key={r.name} delay={i * 90}>
                  <p>„{r.text}"</p>
                  <cite>{r.name} · {r.source}</cite>
                </Reveal>
              ))}
            </ul>
            <div className="nd-umsagnirfoot">
              <p className="nd-fine nd-fine-bone">{UMSAGNIR.note}</p>
              <ArrowLink href={UMSAGNIR.href} tone="bone">{UMSAGNIR.link}</ArrowLink>
            </div>
          </div>
        </section>

        {/* ─── 7 · OPIÐ & STAÐSETNING ──────────────────────────────────── */}
        <section className="nd-visit" id="opid" aria-labelledby="nd-visit-h">
          <div className="nd-visitgrid">
            <Reveal>
              <div>
                <p className="nd-eyebrow nd-eyebrow-ink">{OPID.eyebrow}</p>
                <h2 className="nd-h2" id="nd-visit-h">{OPID.h}</h2>
                <p>{OPID.body}</p>
                <p className={`nd-status ${open ? 'is-open' : ''}`}>
                  <span className="nd-dot" aria-hidden="true" />
                  <strong>{open ? OPID.openNow : OPID.closedNow}</strong>
                  <span>{open ? OPID.closesAt : OPID.opensAt}</span>
                </p>
                <dl className="nd-details">
                  <div><dt>Heimilisfang</dt><dd>{ADDRESS}</dd></div>
                  <div><dt>Opnunartími</dt><dd>{HOURS_LABEL}</dd></div>
                  <div><dt>Sími</dt><dd><a href={PHONE_HREF}>{PHONE}</a></dd></div>
                  <div><dt>Netfang</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
                </dl>
                <p className="nd-herocta">
                  <a className="nd-btn nd-btn-1" href={MAPS_URL} target="_blank" rel="noreferrer">{OPID.mapsCta}</a>
                  <a className="nd-btn nd-btn-2" href="#bord">Panta borð</a>
                </p>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <figure className="nd-realfig">
                <Pic
                  src={IMG.raunmynd}
                  set={IMG.raunmyndWebp}
                  alt={OPID.raunmyndAlt}
                  sizes="(max-width: 959px) 92vw, 44vw"
                />
                <figcaption>{OPID.raunmyndCaption}</figcaption>
              </figure>
            </Reveal>
          </div>
          <div className="nd-gardur">
            <Pic
              src={IMG.gardur}
              set={IMG.gardurWebp}
              alt={OPID.gardurAlt}
              sizes="100vw"
            />
          </div>
        </section>

        {/* ─── 8 · BORÐAPÖNTUN ─────────────────────────────────────────── */}
        <section className="nd-book" id="bord" aria-labelledby="nd-book-h">
          <div className="nd-bookin">
            <div className="nd-bookhead">
              <p className="nd-eyebrow">{BORD.eyebrow}</p>
              <h2 className="nd-h2" id="nd-book-h">{BORD.h}</h2>
              <p>{BORD.body}</p>
              <p className="nd-fine nd-fine-bone">{BORD.disclaimer}</p>
              <dl className="nd-bookfacts">
                <div><dt>Opið</dt><dd>{HOURS_LABEL}</dd></div>
                <div><dt>Heimilisfang</dt><dd>{ADDRESS}</dd></div>
                <div><dt>Sími</dt><dd><a href={PHONE_HREF}>{PHONE}</a></dd></div>
                <div><dt>Netfang</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
              </dl>
            </div>
            {sent ? (
              <div className="nd-sent">
                <h3 className="nd-h3">{BORD.successHeading}</h3>
                <p>{BORD.successBody}</p>
                <p className="nd-herocta">
                  <a className="nd-btn nd-btn-1" href={mailto}>{BORD.successMail}</a>
                  <a className="nd-btn nd-btn-3" href={PHONE_HREF}>{BORD.successCall}</a>
                </p>
                <button type="button" className="nd-again" onClick={() => setSent(false)}>Breyta beiðninni</button>
              </div>
            ) : (
              <form className="nd-form" onSubmit={onSubmit}>
                <label>
                  <span>{BORD.fields.name}</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoComplete="name"
                  />
                </label>
                <label>
                  <span>{BORD.fields.contact}</span>
                  <input
                    required
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    autoComplete="tel"
                  />
                </label>
                <label>
                  <span>{BORD.fields.guests}</span>
                  <input
                    required
                    inputMode="numeric"
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  />
                </label>
                <label>
                  <span>{BORD.fields.when}</span>
                  <input
                    required
                    placeholder="t.d. föstudag kl. 19"
                    value={form.when}
                    onChange={(e) => setForm({ ...form, when: e.target.value })}
                  />
                </label>
                <label className="nd-wide">
                  <span>{BORD.fields.message}</span>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </label>
                <div className="nd-wide nd-submitrow">
                  <button type="submit" className="nd-btn nd-btn-1">{BORD.submit}</button>
                  <a className="nd-btn nd-btn-3" href={PHONE_HREF}>{`Hringja · ${PHONE}`}</a>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ─── 9 · FÓTUR ───────────────────────────────────────────────── */}
        <footer className="nd-foot">
          <Handwriting line={SCRIPT.sjaumst} className="nd-script-big nd-script-sol" />
          <div className="nd-footgrid">
            <div>
              <p className="nd-foothead">{FOOTER.cols.contact}</p>
              <p>{ADDRESS}</p>
              <p><a href={PHONE_HREF}>{PHONE}</a></p>
              <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
              <p className="nd-social">
                <a href={FACEBOOK} target="_blank" rel="noreferrer">Facebook</a>
                <a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a>
              </p>
            </div>
            <div>
              <p className="nd-foothead">{FOOTER.cols.hours}</p>
              {FOOTER.hoursLines.map((l) => (
                <p className="nd-hourrow" key={l.k}><span>{l.k}</span><span>{l.v}</span></p>
              ))}
            </div>
            <div>
              <p className="nd-foothead">{FOOTER.cols.book}</p>
              <p>Í síma eða tölvupósti. Við staðfestum um leið og við getum.</p>
              <p className="nd-herocta">
                <a className="nd-btn nd-btn-1" href="#bord">Panta borð</a>
                <a className="nd-btn nd-btn-2" href={PHONE_HREF}>{PHONE}</a>
              </p>
            </div>
          </div>
        </footer>
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
 * The stylesheet.
 *
 * Spacing is the reference's 0.75rem grid on an 18px root, written out in px
 * because this page cannot change the app's root font-size:
 *   .75rem 13.5 · 1.5rem 27 · 2.25rem 40.5 · 3rem 54 · 4.5rem 81 · 6rem 108
 * Gutters: 27px → 54px (≥1280) → 108px (≥1480).
 * Radius: 30px pills, 5px pictures and panels, nothing else. No box-shadows.
 * ══════════════════════════════════════════════════════════════════════ */

const CSS = `
@font-face{font-family:'Valley Sans';src:url('${import.meta.env.BASE_URL}fonts/naustid/ValleySans-Light.woff2') format('woff2');font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:'Valley Sans';src:url('${import.meta.env.BASE_URL}fonts/naustid/ValleySans-Regular.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Valley Sans';src:url('${import.meta.env.BASE_URL}fonts/naustid/ValleySans-Medium.woff2') format('woff2');font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:'Valley Sans';src:url('${import.meta.env.BASE_URL}fonts/naustid/ValleySans-SemiBold.woff2') format('woff2');font-weight:600;font-style:normal;font-display:swap}
@font-face{font-family:'Valley Sans';src:url('${import.meta.env.BASE_URL}fonts/naustid/ValleySans-ExtraBold.woff2') format('woff2');font-weight:800;font-style:normal;font-display:swap}
@font-face{font-family:'Valley Sans';src:url('${import.meta.env.BASE_URL}fonts/naustid/ValleySans-BoldItalic.woff2') format('woff2');font-weight:700;font-style:italic;font-display:swap}

.nd-page{
  --bein:${BEIN}; --tjara:${TJARA}; --thang:${THANG}; --gult:${HUSGULT}; --sol:${SOL};
  --gut:27px; --sans:'Valley Sans',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;
  background:var(--bein); color:var(--tjara); font-family:var(--sans); font-weight:300;
  font-size:18px; line-height:1.5; letter-spacing:.5px;
  overflow-x:clip; position:relative;
  -webkit-font-smoothing:antialiased;
}
@media (min-width:1280px){ .nd-page{ --gut:54px } }
@media (min-width:1480px){ .nd-page{ --gut:108px } }
.nd-page *{box-sizing:border-box}
.nd-page p{margin:0 0 13.5px}
.nd-page p:last-child{margin-bottom:0}
.nd-page a{color:inherit;text-decoration:none;transition:color .5s ease}
.nd-page strong{font-weight:600;font-style:italic}
.nd-page img{display:block;width:100%;height:auto}
.nd-page picture{display:block}
.nd-page :focus-visible{outline:2px solid var(--gult);outline-offset:3px;border-radius:2px}

/* ── type ─────────────────────────────────────────────────────────────── */
.nd-h1{font-family:var(--sans);font-weight:700;font-style:italic;font-size:39.6px;
  line-height:1.06;letter-spacing:-.2px;margin:0}
@media (min-width:768px){ .nd-h1{font-size:49.5px} }
.nd-h2{font-weight:600;font-size:27px;line-height:1.35;margin:0 0 13.5px;letter-spacing:0}
.nd-h3{font-weight:600;font-size:22.5px;line-height:1.3;margin:0 0 13.5px}
.nd-eyebrow{font-weight:700;font-size:16px;text-transform:uppercase;letter-spacing:1px;
  text-align:center;margin:0 0 13.5px;color:var(--sol)}
.nd-eyebrow-ink{text-align:left;color:var(--thang)}
.nd-fine{font-size:14.4px;line-height:1.55;opacity:.72}
.nd-fine-bone{opacity:.8;color:var(--sol)}

/* ── the handwriting ──────────────────────────────────────────────────── */
.nd-script{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;
  gap:0 5%;line-height:1;color:var(--sol)}
.nd-script svg{display:block;width:auto;overflow:visible}
.nd-word{height:fit-content}
.nd-draw{fill:currentColor;stroke:currentColor;stroke-width:1;vector-effect:non-scaling-stroke;
  stroke-linecap:round;stroke-linejoin:round;fill-opacity:0;
  stroke-dasharray:var(--l);stroke-dashoffset:var(--l)}
.nd-script.is-active .nd-draw{
  animation:ndWrite var(--t) ${WRITE_EASE} var(--d) forwards,
            ndFill var(--t) ease-in-out var(--d) forwards}
@keyframes ndWrite{to{stroke-dashoffset:0}}
@keyframes ndFill{0%,35%{fill-opacity:0}100%{fill-opacity:1}}
@media (min-width:960px){ .nd-draw{stroke-width:1.5} }

.nd-script-mid{font-size:13.4vw;margin:0 0 -3%;gap:0 2.5%}
@media (min-width:960px){ .nd-script-mid{font-size:8vw} }
.nd-script-big{font-size:20vw;margin-top:-8%;margin-bottom:-4%;position:relative}
.nd-script-gult{color:var(--gult)}
.nd-script-sol{color:var(--sol)}

/* ── the flat display word the script collides with ───────────────────── */
.nd-display{display:block;width:100%;height:auto;fill:var(--sol);overflow:visible}

/* ── the hand-drawn arrow link ────────────────────────────────────────── */
.nd-link{display:inline-flex;align-items:center;gap:13.5px;font-weight:600;font-style:italic;
  margin-top:27px;letter-spacing:.5px}
.nd-link .nd-arrow{width:25px;height:10.7px;flex:none;fill:currentColor;
  transition:translate .5s ease}
.nd-link:hover .nd-arrow{translate:.25rem}
.nd-link.is-flip{flex-direction:row-reverse}
.nd-link.is-flip .nd-arrow{transform:rotate(180deg)}
.nd-link.is-flip:hover .nd-arrow{translate:-.25rem}
.nd-link-ink{color:var(--tjara)}
.nd-link-ink:hover{color:var(--thang)}
.nd-link-bone{color:var(--sol)}
.nd-link-bone:hover{color:var(--gult)}
.nd-link-gult{color:var(--gult)}

/* ── buttons ──────────────────────────────────────────────────────────── */
.nd-btn{display:inline-block;padding:13.5px 27px;font-weight:600;font-size:14.4px;
  text-transform:uppercase;border-radius:30px;line-height:18px;letter-spacing:.5px;
  border:2px solid transparent;transition:background-color .5s ease,color .5s ease,border-color .5s ease;
  white-space:nowrap}
.nd-btn-1{background:var(--gult);border-color:var(--gult);color:var(--tjara)}
.nd-btn-1:hover{background:var(--bein);color:var(--thang);border-color:var(--thang)}
.nd-btn-2{background:transparent;border-color:var(--thang);color:var(--thang)}
.nd-btn-2:hover{background:var(--thang);color:var(--bein)}
.nd-btn-3{background:transparent;border-color:var(--sol);color:var(--sol)}
.nd-btn-3:hover{background:var(--sol);color:var(--thang)}
.nd-herocta{display:flex;flex-wrap:wrap;gap:13.5px;margin-top:27px}

/* ── the reveal ───────────────────────────────────────────────────────── */
.nd-rev{opacity:0;transform:translateY(40px);will-change:transform,opacity;
  transition:opacity .9s ${EASE},transform .9s ${EASE}}
.nd-rev.is-in{opacity:1;transform:none}

/* ── chrome ───────────────────────────────────────────────────────────── */
.nd-awning{display:none}
.nd-headwrap{min-height:120px}
.nd-head{position:relative;z-index:120}
.nd-headin{display:grid;grid-template-columns:auto 1fr auto auto;align-items:center;
  padding:22px var(--gut) 0 var(--gut);gap:27px}
.nd-head.is-fixed{position:fixed;inset:0 0 auto 0;z-index:140;width:100%;
  transform:translateY(-100%);transition:none;will-change:transform}
.nd-head.is-fixed .nd-headin{padding-top:13.5px;padding-bottom:0;align-items:center}
.nd-head.is-fixed::before{content:'';position:absolute;inset:0 0 auto 0;height:72px;
  background:rgba(251,246,234,.92);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(30,32,22,.10);z-index:-1}
.nd-head.is-fixed.is-visible{transition:transform .4s ${EASE};transform:translateY(0)}
.nd-head.is-fixed.is-leaving{transition:transform .4s ${EASE};transform:translateY(-100%)}

.nd-mark{display:block;color:var(--tjara)}
.nd-markscript{justify-content:flex-start;font-size:44px;color:var(--tjara)}
.nd-head.is-fixed .nd-markscript{font-size:34px}
.nd-marksub{display:block;font-size:9.5px;font-weight:500;text-transform:uppercase;
  letter-spacing:.19em;opacity:.62;margin-top:2px;padding-left:3px}
.nd-head.is-fixed .nd-marksub{display:none}

.nd-navwrap{justify-self:end;align-self:center}
.nd-barstatus{display:flex;align-items:center;gap:9px;margin:0;font-size:14.4px;
  white-space:nowrap;letter-spacing:.3px}
.nd-barstatus .nd-dot{width:8px;height:8px;border-radius:50%;background:#9a5a3a;flex:none}
.nd-barstatus.is-open .nd-dot{background:#4f7a3a}
.nd-barstatus a{margin-left:4px;font-weight:600;text-decoration:underline;
  text-underline-offset:3px}
.nd-barstatus a:hover{color:var(--thang)}
.nd-dot-m{display:none;width:8px;height:8px;border-radius:50%;background:#9a5a3a;
  flex:none;justify-self:end}
.nd-dot-m.is-open{background:#4f7a3a}
.nd-nav{display:flex;gap:40.5px;list-style:none;margin:0;padding:0;justify-content:flex-end}
.nd-nav a{display:block;text-align:center;font-size:14.4px;text-transform:uppercase;
  letter-spacing:.5px;font-weight:500}
.nd-nav a:hover{color:var(--thang)}
.nd-nav a span{display:block;margin-bottom:2px}
.nd-nav a em{display:block;font-style:normal;font-size:12px;font-weight:300;opacity:.6;
  letter-spacing:.4px}

/* the half-pills, flush to the viewport edge — the reference's signature */
.nd-actions{display:flex;flex-direction:column;align-items:flex-end;
  margin-right:calc(-1 * var(--gut))}
.nd-pill{display:inline-block;padding:13.5px 27px;font-size:14.4px;line-height:18px;
  letter-spacing:.5px;text-transform:uppercase;font-weight:500;
  border-radius:30px 0 0 30px;border:2px solid transparent;
  transition:background-color .5s ease,color .5s ease,border-color .5s ease}
.nd-pill-1{background:var(--gult);border-color:var(--gult);color:var(--tjara)}
.nd-pill-1:hover{background:var(--bein);color:var(--thang);border-color:var(--bein)}
.nd-pill-2{background:#fff;border-color:#fff;color:var(--thang)}
.nd-pill-2:hover{background:var(--sol);border-color:var(--sol)}
.nd-menubtn{display:none;font:inherit;font-size:14.4px;font-weight:500;letter-spacing:.5px;
  text-transform:uppercase;background:var(--bein);border:2px solid var(--bein);color:var(--tjara);
  padding:13.5px 27px;border-radius:30px 0 0 30px;cursor:pointer;line-height:18px}

/* ── hero ─────────────────────────────────────────────────────────────── */
.nd-hero{position:relative;min-height:calc(87vh - 120px);display:flex;flex-direction:column;
  justify-content:flex-end;padding:0 var(--gut) 27px}
/* the seam between the painting and the headline: the line crosses the
   feathered bottom edge of the watercolour and runs on under the h1 */
.nd-fishband{position:relative;z-index:2;width:112vw;margin-left:-6vw;
  margin-top:-58px;margin-bottom:-22px;pointer-events:none}
.nd-fish{display:block;width:100%;height:auto;overflow:visible}
.nd-fish path{fill:none;stroke:#D3C79E;stroke-width:2.6;stroke-linecap:round;
  stroke-linejoin:round;stroke-dasharray:var(--l);stroke-dashoffset:var(--l);
  animation:ndDraw var(--t) ${WRITE_EASE} forwards}
@keyframes ndDraw{to{stroke-dashoffset:0}}
.nd-heropic{position:relative;z-index:1;max-width:1420px;width:100%;margin:0 auto 27px}
.nd-akvarel img{border-radius:5px}
.nd-herotext{position:relative;z-index:3;display:grid;gap:27px}
@media (min-width:1080px){
  .nd-herotext{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 54px;align-items:end}
}
.nd-herobody{max-width:560px}
@media (min-width:1080px){ .nd-herobody{justify-self:end} }

/* ── the moss panel ───────────────────────────────────────────────────── */
.nd-panel{position:relative;margin:81px var(--gut) 54px;background:var(--thang);
  border-radius:5px;color:#fff;padding:67.5px 27px 54px;scroll-margin-top:90px}
.nd-panel a{color:#fff}
.nd-two{display:grid;gap:40.5px;margin-top:27px}
@media (min-width:960px){
  .nd-panel{padding:81px 54px 67.5px}
  .nd-two{grid-template-columns:1fr 1fr;gap:0}
  .nd-two > *:first-child{padding-right:54px;border-right:2px solid rgba(234,227,199,.5)}
  .nd-two > *:last-child{padding-left:54px}
}
@media (max-width:959px){
  .nd-two > *:first-child{padding-bottom:40.5px;border-bottom:2px solid rgba(234,227,199,.5)}
}
.nd-col{display:flex;flex-direction:column;height:100%}
.nd-col .nd-link{margin-top:auto;padding-top:27px}
.nd-quote{margin:27px 0 0;padding:0;border-left:2px solid var(--gult);padding-left:18px}
.nd-quote p{font-style:italic;font-weight:400}
.nd-quote cite{display:block;font-style:normal;font-size:14.4px;opacity:.75;margin-top:6px}

/* ── teasers: display word + script + text ────────────────────────────── */
.nd-teaser{padding-top:54px;scroll-margin-top:90px}
.nd-teaserhead{padding:0 var(--gut)}
@media (min-width:1280px){ .nd-teaserhead{padding:0 calc(var(--gut) - 27px)} }
.nd-teasertext{display:grid;gap:27px;padding:0 var(--gut);margin-top:54px}
@media (min-width:768px){
  .nd-teasertext{grid-template-columns:1fr 1fr;gap:54px;
    padding-left:calc(var(--gut) + 27px);padding-right:calc(var(--gut) + 27px)}
  .nd-teasertext > *:nth-child(2){padding-top:54px}
}
@media (min-width:1280px){
  .nd-teasertext{padding-left:calc(var(--gut) + 54px);padding-right:calc(var(--gut) + 54px)}
}

/* the dish list — rib rows, no cards, no prices */
.nd-menugrid{display:grid;gap:40.5px;padding:54px var(--gut) 0}
@media (min-width:960px){
  .nd-menugrid{grid-template-columns:340px minmax(0,1fr);gap:54px;align-items:start}
}
@media (min-width:1480px){ .nd-menugrid{grid-template-columns:390px minmax(0,1fr);gap:81px} }
/* sticky, like the reference's menu sidebar: it stays with you down the list */
@media (min-width:960px){ .nd-rail{position:sticky;top:96px} }
.nd-railcard{background:var(--thang);color:#fff;border-radius:5px;padding:27px}
.nd-railcard a{color:var(--tjara)}
.nd-railh{font-weight:700;font-size:16px;text-transform:uppercase;letter-spacing:1px;
  margin:0 0 18px}
.nd-railcard dl{display:grid;gap:13.5px;margin:0}
.nd-railcard dl > div{border-top:1px solid rgba(234,227,199,.3);padding-top:13.5px}
.nd-railcard dt{font-size:13px;text-transform:uppercase;letter-spacing:.7px;font-weight:600;
  color:var(--gult);margin-bottom:3px}
.nd-railcard dd{margin:0;font-size:16px;line-height:1.45}
.nd-railcta{margin:27px 0 0}
@media (min-width:640px){
  .nd-dishes{columns:2;column-gap:54px;column-fill:balance}
  .nd-menugroup{display:inline}
}
@media (min-width:1480px){ .nd-dishes{column-gap:81px} }
.nd-menugroup li{break-inside:avoid}
.nd-menugroup .nd-h3{break-after:avoid}
.nd-menugroup:not(:first-child) .nd-h3{margin-top:40.5px}
.nd-menufine{margin-top:40.5px;border-top:1px solid rgba(30,32,22,.16);padding-top:18px}
.nd-menugroup ul{list-style:none;margin:0;padding:0}
.nd-menugroup li{display:flex;flex-direction:column;gap:2px;padding:13.5px 0 13.5px 0;
  border-top:1px solid rgba(30,32,22,.16);position:relative;
  transition:padding-left .35s ${EASE}}
.nd-menugroup li::before{content:'';position:absolute;left:0;top:-1px;height:1px;width:0;
  background:var(--gult);transition:width .35s ${EASE}}
.nd-menugroup li:hover{padding-left:13.5px}
.nd-menugroup li:hover::before{width:100%;height:2px}
.nd-dish{font-weight:600;font-size:19px}
.nd-note{font-size:14.4px;opacity:.68}

/* ── the marquee ──────────────────────────────────────────────────────── */
.nd-plates{padding:54px 0 13.5px;overflow:hidden}
.nd-marquee{width:100%;overflow:hidden;display:flex;scrollbar-width:none}
.nd-marquee::-webkit-scrollbar{display:none}
.nd-marquee ul{display:flex;flex:0 0 auto;list-style:none;margin:0;padding:0;gap:27px;
  margin-right:27px}
.nd-marquee li{flex:0 0 auto;width:62vw}
@media (min-width:768px){ .nd-marquee li{width:32vw} }
@media (min-width:1280px){ .nd-marquee li{width:24vw} }
.nd-marquee img{border-radius:5px;aspect-ratio:1/1;object-fit:cover}

/* ── facts row ────────────────────────────────────────────────────────── */
.nd-story{display:grid;gap:40.5px;padding:54px var(--gut) 0}
@media (min-width:960px){
  .nd-story{grid-template-columns:38% minmax(0,1fr);gap:54px;align-items:start}
}
@media (min-width:1480px){ .nd-story{gap:81px} }
.nd-storypic img{border-radius:5px}
.nd-storytext{max-width:660px}
.nd-ledger{list-style:none;margin:27px 0 0;padding:0}
.nd-ledger li{display:grid;grid-template-columns:118px 1fr;gap:18px;padding:13.5px 0;
  border-top:1px solid rgba(30,32,22,.16)}
.nd-factk{font-weight:600;font-size:14.4px;text-transform:uppercase;letter-spacing:.6px;
  color:var(--thang)}
.nd-factv{font-size:17px}

/* ── the painting under the panel ─────────────────────────────────────── */
.nd-about{padding-top:81px}
.nd-aboutpic{position:relative;padding:0 var(--gut)}
.nd-aboutmark{justify-content:center;font-size:11vw;color:var(--gult);
  pointer-events:none;margin-bottom:9px}
.nd-aboutpanel{background:var(--thang);color:#fff;border-radius:5px;
  margin:-9% var(--gut) 0;padding:40.5px 27px 54px;position:relative}
.nd-aboutpanel a{color:#fff}
@media (min-width:768px){
  .nd-aboutpanel{padding-left:54px;padding-right:54px}
  .nd-aboutmark{font-size:8.5vw}
}
.nd-umsagnirh{text-align:center;margin-bottom:0}
.nd-scores{list-style:none;margin:40.5px 0 0;padding:0;display:grid;
  grid-template-columns:1fr 1fr;gap:18px 27px}
@media (min-width:768px){ .nd-scores{grid-template-columns:repeat(4,1fr);gap:27px} }
.nd-scores li{border-top:2px solid var(--gult);padding-top:13.5px}
.nd-scorev{display:block;font-size:36px;font-weight:700;font-style:italic;line-height:1;
  color:var(--gult)}
@media (min-width:960px){ .nd-scorev{font-size:44px} }
.nd-scorek{display:block;font-size:14.4px;margin-top:6px;color:var(--sol);line-height:1.35}
.nd-umsagnirfoot{display:flex;flex-wrap:wrap;justify-content:space-between;
  align-items:baseline;gap:18px 40.5px;margin-top:40.5px;
  border-top:1px solid rgba(234,227,199,.28);padding-top:18px}
.nd-umsagnirfoot .nd-fine{max-width:620px;margin:0}
.nd-umsagnirfoot .nd-link{margin-top:0}
@media (min-width:1280px){ .nd-aboutpanel{padding-left:81px;padding-right:81px} }
.nd-reviews{list-style:none;margin:40.5px 0 0;padding:0;display:grid;gap:27px}
@media (min-width:960px){ .nd-reviews{grid-template-columns:repeat(3,1fr);gap:40.5px} }
.nd-reviews li{border-top:1px solid rgba(234,227,199,.32);padding-top:18px}
.nd-reviews p{font-style:italic;font-size:17px;line-height:1.45;margin-bottom:9px}
.nd-reviews cite{font-style:normal;font-size:13.5px;opacity:.7}

/* ── visit ────────────────────────────────────────────────────────────── */
.nd-visit{padding-top:81px;scroll-margin-top:90px}
.nd-visitgrid{display:grid;gap:40.5px;padding:0 var(--gut)}
@media (min-width:960px){ .nd-visitgrid{grid-template-columns:1fr 1fr;gap:54px;align-items:start} }
.nd-status{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:27px;
  font-size:16px}
.nd-status .nd-dot{width:9px;height:9px;border-radius:50%;background:#9a5a3a;flex:none}
.nd-status.is-open .nd-dot{background:#4f7a3a}
.nd-status strong{font-style:normal;font-weight:600}
.nd-status span:last-child{opacity:.7}
.nd-details{margin:27px 0 40.5px;display:grid;gap:13.5px}
.nd-details > div{display:grid;grid-template-columns:120px 1fr;gap:13.5px;
  border-top:1px solid rgba(30,32,22,.16);padding-top:13.5px}
.nd-details dt{font-size:13.5px;text-transform:uppercase;letter-spacing:.7px;font-weight:600;
  color:var(--thang)}
.nd-details dd{margin:0}
.nd-details a,.nd-bookfacts a,.nd-footgrid a[href^="tel"],.nd-footgrid a[href^="mailto"]{
  display:inline-block;padding:3px 0;text-decoration:underline;text-underline-offset:3px}
.nd-realfig{margin:0}
.nd-realfig img{border-radius:5px}
.nd-realfig figcaption{font-size:13.5px;opacity:.66;margin-top:9px}
.nd-gardur{margin-top:54px;padding:0 var(--gut)}
.nd-gardur img{border-radius:5px;aspect-ratio:16/9;object-fit:cover;object-position:50% 32%}

/* ── booking ──────────────────────────────────────────────────────────── */
.nd-book{margin:81px var(--gut) 0;background:var(--thang);color:#fff;border-radius:5px;
  padding:54px 27px;scroll-margin-top:90px}
.nd-book a{color:#fff}
@media (min-width:960px){ .nd-book{padding:67.5px 54px} }
.nd-bookin{display:grid;gap:40.5px}
@media (min-width:960px){ .nd-bookin{grid-template-columns:1fr 1.15fr;gap:54px;align-items:start} }
.nd-bookfacts{margin:40.5px 0 0;display:grid;gap:13.5px}
.nd-bookfacts > div{display:grid;grid-template-columns:120px 1fr;gap:13.5px;
  border-top:1px solid rgba(234,227,199,.28);padding-top:13.5px}
.nd-bookfacts dt{font-size:13.5px;text-transform:uppercase;letter-spacing:.7px;font-weight:600;
  color:var(--sol)}
.nd-bookfacts dd{margin:0}
.nd-bookfacts a{text-decoration:underline;text-underline-offset:3px}
.nd-form{display:grid;gap:18px}
@media (min-width:640px){ .nd-form{grid-template-columns:1fr 1fr} }
.nd-form label{display:grid;gap:6px}
.nd-form .nd-wide{grid-column:1/-1}
.nd-form span{font-size:13.5px;text-transform:uppercase;letter-spacing:.7px;font-weight:600;
  color:var(--sol)}
.nd-form input,.nd-form textarea{width:100%;font:inherit;font-size:16.2px;font-weight:400;
  padding:13.5px;border-radius:5px;border:1px solid rgba(234,227,199,.28);
  background:rgba(251,246,234,.06);color:#fff;resize:none}
.nd-form input::placeholder{color:rgba(255,255,255,.45)}
.nd-form input:focus,.nd-form textarea:focus{outline:2px solid var(--gult);outline-offset:1px}
.nd-submitrow{display:flex;flex-wrap:wrap;gap:13.5px;align-items:center}
.nd-form button{font:inherit;cursor:pointer}
.nd-sent .nd-again{margin-top:18px;background:none;border:none;color:var(--sol);
  text-decoration:underline;text-underline-offset:3px;cursor:pointer;font:inherit;
  font-size:14.4px;padding:0}

/* ── footer ───────────────────────────────────────────────────────────── */
.nd-foot{margin-top:81px;padding:0 var(--gut) 40.5px;position:relative}
.nd-foot .nd-script-big{margin-bottom:-9%}
.nd-footgrid{position:relative;z-index:1;border-top:2px solid var(--thang);
  display:grid;gap:0}
@media (min-width:960px){ .nd-footgrid{grid-template-columns:1fr 1fr 1fr} }
.nd-footgrid > *{padding:27px 0}
@media (min-width:960px){
  .nd-footgrid > *{padding:27px 40.5px}
  .nd-footgrid > *:first-child{padding-left:0}
  .nd-footgrid > *:not(:last-child){border-right:2px solid var(--thang)}
}
@media (max-width:959px){
  .nd-footgrid > *:not(:last-child){border-bottom:2px solid var(--thang)}
}
.nd-foothead{font-weight:700;font-size:16px;text-transform:uppercase;letter-spacing:1px;
  margin-bottom:13.5px}
.nd-hourrow{display:flex;justify-content:space-between;gap:18px;align-items:baseline}
.nd-hourrow span:last-child{text-align:right;white-space:nowrap}
.nd-footgrid a:hover{color:var(--thang)}
.nd-social{display:flex;gap:18px;margin-top:13.5px}
.nd-social a{display:inline-block;padding:3px 0;text-decoration:underline;
  text-underline-offset:3px}

/* ── mobile chrome: the constant bar + the awning ─────────────────────── */
@media (max-width:767px){
  .nd-awning{display:block;position:sticky;top:-100px;height:96px;flex:none;z-index:130;
    background:var(--bein);pointer-events:none}
  .nd-headwrap{min-height:0}
  .nd-head{position:fixed !important;inset:0 0 auto 0;z-index:150;width:100%;
    transform:none !important;transition:none !important}
  .nd-head::before{content:'';position:absolute;inset:0;
    background:rgba(251,246,234,.9);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
    border-bottom:1px solid rgba(30,32,22,.10);z-index:-1}
  .nd-headin{grid-template-columns:1fr auto;padding:9px 0 9px var(--gut);gap:13.5px;
    align-items:center}
  .nd-navwrap{display:none}
  .nd-actions{display:none}
  .nd-barstatus{display:none}
  .nd-dot-m{display:block}
  .nd-menubtn{display:block;justify-self:end}
  .nd-headin{grid-template-columns:1fr auto auto;gap:9px}
  .nd-markscript{font-size:31px}
  .nd-marksub{display:none}
  .nd-hero{min-height:auto;padding-top:0}
  .nd-heropic{width:100vw;margin-left:calc(-1 * var(--gut));margin-bottom:13.5px}
  .nd-akvarel img{border-radius:0}
  .nd-fishband{margin-top:-30px;margin-bottom:-14px}
  .nd-panel,.nd-book{padding-left:22px;padding-right:22px}
  /* two-word script lines wrapped on a phone once each word's swash padding
     and the 5% word gap were counted; 17vw keeps them on one line */
  .nd-script-big{font-size:17vw;gap:0 3%}
  .nd-page{scroll-padding-top:78px}
  .nd-panel,.nd-teaser,.nd-visit,.nd-book{scroll-margin-top:78px}
}

/* z-index BELOW the bar on purpose: the bar carries the Loka button, and a
   panel that covers its own close control is a trap. */
.nd-menu{position:fixed;inset:0;z-index:140;background:var(--bein);overflow-y:auto;
  padding:96px var(--gut) calc(40.5px + env(safe-area-inset-bottom))}
.nd-menu .nd-nav{flex-direction:column;gap:0;align-items:stretch}
.nd-menu .nd-nav li{border-bottom:1px solid rgba(30,32,22,.16)}
.nd-menu .nd-nav a{text-align:left;padding:22px 0;font-size:22px;text-transform:none;
  letter-spacing:0;font-weight:600}
.nd-menu .nd-nav a em{font-size:14.4px;margin-top:2px}
.nd-menufoot{margin-top:40.5px;display:grid;gap:13.5px;justify-items:start}
.nd-pill-full{border-radius:30px;text-align:center;width:100%}
.nd-menuaddr{margin-top:18px;font-size:15px;opacity:.7;line-height:1.6}

/* ── reduced motion: nothing moves, everything is already drawn ───────── */
@media (prefers-reduced-motion:reduce){
  .nd-rev{opacity:1 !important;transform:none !important;transition:none !important}
  .nd-draw{fill-opacity:1 !important;stroke-dashoffset:0 !important;animation:none !important}
  .nd-fish path{stroke-dashoffset:0 !important;animation:none !important}
  .nd-link .nd-arrow{transition:none}
}
`
