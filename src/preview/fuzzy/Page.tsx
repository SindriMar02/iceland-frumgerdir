import { useEffect, useMemo, useRef, useState } from 'react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { companyEntry as company } from './company'
import {
  BRAND, HERO, SPEC, COLOURWAYS, TIMELINE, RECOGNITION,
  RETAILERS, MAKER, LAMPS, IMAGES, TRIVIA,
} from './data'

/* ------------------------------------------------------------------ tokens */

const BASALT = '#14110F'
const ASH = '#201B18'
const WOOL = '#EDE7DF'
const SLATE = '#8C837A'
const PINK = '#B8256B'

const DISPLAY = "'Cabinet Grotesk', system-ui, sans-serif"
const BODY = "'Schibsted Grotesk', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, monospace"

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

/* ------------------------------------------------------------------ styles */

/**
 * Scoped to `.fz-root` and prefixed `fz-` so nothing bleeds into another
 * preview ([[no-style-bleed-between-designs]]). Injected via
 * dangerouslySetInnerHTML because a React <style>{...}</style> child gets
 * HTML-escaped during prerender and `content:''` arrives as `content:&#x27;&#x27;`.
 */
const CSS = `
.fz-root{background:var(--fz-ground,${BASALT});color:${WOOL};font-family:${BODY};
  transition:background-color 600ms cubic-bezier(.22,1,.36,1);overflow-x:clip}
.fz-root ::selection{background:${PINK};color:#fff}

/* every child of a full-bleed grid cell must be positioned, or a positioned
   sibling paints over static text regardless of DOM order (ledger #73) */
.fz-bleed > *{position:relative}

.fz-display{font-family:${DISPLAY};font-weight:800;letter-spacing:-.035em;line-height:1.16}
.fz-mono{font-family:${MONO};font-size:11px;letter-spacing:.16em;text-transform:uppercase}

/* ---- per-word headline rise (Daylight device, words never characters) ---- */
/* inline-block, not block: a per-word block puts every word on its own line and
   reads as broken (ledger #74). padding-top keeps Í Á Ó Ú Ý off the mask edge. */
.fz-ln{display:inline-block;overflow:hidden;vertical-align:bottom;
  padding-top:.18em;margin-top:-.18em}
.fz-w{display:inline-block;transform:translateY(105%);opacity:0;
  transition:transform 900ms cubic-bezier(.16,1,.3,1),opacity 700ms linear}
.fz-in .fz-w{transform:translateY(0);opacity:1}

/* ---- reveal ---- */
.fz-rv{opacity:0;transform:translateY(22px);
  transition:opacity 700ms cubic-bezier(.16,1,.3,1),transform 700ms cubic-bezier(.16,1,.3,1)}
.fz-in.fz-rv,.fz-in .fz-rv{opacity:1;transform:none}

/* ---- THE SIGNATURE: the fleece edge -------------------------------------
   A dense field of thin strands. As the divider crosses the viewport the
   strands lean, the way a sheepskin shows which way it was stroked. Driven by
   a CSS view() timeline so there is no scroll listener at all. */
/* clip-path, NOT overflow:hidden. overflow:hidden would make this element its
   own scrollport, and a view() timeline resolves against the nearest scrollport,
   so the strands would freeze inside a box that never scrolls. Same family as
   [[overflow-hidden-breaks-sticky]]. clip-path clips without that side effect. */
.fz-fibre{position:relative;height:74px;clip-path:inset(0);pointer-events:none}
.fz-fibre-in{position:absolute;inset:-14% -6%;
  background:
    repeating-linear-gradient(90deg,
      rgba(237,231,223,.00) 0px, rgba(237,231,223,.19) 1px, rgba(237,231,223,.00) 2px,
      rgba(237,231,223,.00) 3px, rgba(237,231,223,.11) 4px, rgba(237,231,223,.00) 6px),
    repeating-linear-gradient(90deg,
      rgba(237,231,223,.00) 0px, rgba(237,231,223,.07) 1px, rgba(237,231,223,.00) 5px);
  -webkit-mask-image:linear-gradient(to bottom,transparent,#000 42%,#000 58%,transparent);
  mask-image:linear-gradient(to bottom,transparent,#000 42%,#000 58%,transparent);
  transform:skewX(0deg)}
@supports (animation-timeline: view()){
  @media (prefers-reduced-motion:no-preference){
    /* LONGHAND on purpose. The animation shorthand resets animation-duration
       to 0s, and a scroll-driven timeline with a 0s duration never progresses,
       so the strands sit frozen at their midpoint. Verified by measuring the
       same element at three scroll depths (ledger #42). */
    .fz-fibre-in{
      animation-name:fz-lean;
      animation-duration:auto;
      animation-timing-function:linear;
      animation-fill-mode:both;
      animation-timeline:view();
      animation-range:entry 0% exit 100%}
  }
}
@keyframes fz-lean{from{transform:skewX(-11deg) translateX(-8px)}
  to{transform:skewX(11deg) translateX(8px)}}

/* ---- links, buttons ---- */
.fz-link{position:relative;display:inline-block}
.fz-link::after{content:"";position:absolute;left:0;right:0;bottom:-3px;height:1px;
  background:currentColor;transform:scaleX(0);transform-origin:left;
  transition:transform 200ms cubic-bezier(.16,1,.3,1)}
.fz-link:hover::after,.fz-link:focus-visible::after{transform:scaleX(1)}
.fz-btn{transition:background-color 180ms ease,color 180ms ease,transform 160ms ease}
.fz-btn:active{transform:scale(.985)}

/* ---- colourway chips ---- */
.fz-chip{position:relative;border-radius:999px;transition:transform 180ms cubic-bezier(.16,1,.3,1)}
.fz-chip:active{transform:scale(.96)}
.fz-chip[aria-pressed="true"]{box-shadow:0 0 0 1px ${BASALT},0 0 0 3px ${PINK}}

/* ---- product stage: swap dips, never blanks (ledger #209) ---- */
.fz-stage img{transition:opacity 260ms ease,filter 260ms ease}
.fz-stage.fz-swap img{opacity:.38}

/* ---- retailer rows ---- */
.fz-row{transition:background-color 180ms ease,padding-left 200ms cubic-bezier(.16,1,.3,1)}
@media (hover:hover) and (pointer:fine){
  @media (prefers-reduced-motion:no-preference){
    .fz-row:hover{background:rgba(237,231,223,.045);padding-left:14px}
  }
}
.fz-row:active{background:rgba(237,231,223,.07)}

@media (prefers-reduced-motion:reduce){
  .fz-w{transform:none;opacity:1;transition:none}
  .fz-rv{opacity:1;transform:none;transition:none}
  .fz-fibre-in{animation:none;transform:none}
  .fz-row:hover{padding-left:0;background:none}
}
`

/* ------------------------------------------------------------- primitives */

/** Splits per WORD. Icelandic accents make per-character splits a trap. */
function Headline({
  text, id, className = '', size = 96, measure, as: Tag = 'h2',
}: {
  text: string; id?: string; className?: string; size?: number; measure?: number
  as?: 'h1' | 'h2'
}) {
  const words = useMemo(() => text.split(' '), [text])
  return (
    <Tag
      id={id}
      aria-label={text}
      className={`fz-display ${className}`}
      style={{
        fontSize: `clamp(30px, ${size / 19}vw, ${size}px)`,
        maxWidth: measure ? `${measure}px` : undefined,
        textWrap: 'balance',
      }}
    >
      {/* one correctly spaced copy for assistive tech and crawlers */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          // the space is a SIBLING of the clipped box; inside it, overflow:hidden
          // eats it and the words run together (ledger #74a)
          <span key={`${w}-${i}`}>
            <span className="fz-ln">
              <span className="fz-w" style={{ transitionDelay: `${i * 44}ms` }}>
                {w}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="fz-mono" style={{ color: SLATE }}>{children}</p>
}

/** The fleece-edge divider. Decorative only. */
function Fibre() {
  return (
    <div className="fz-fibre" aria-hidden="true">
      <div className="fz-fibre-in" />
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function FuzzyPage() {
  const [colour, setColour] = useState<(typeof COLOURWAYS)[number]>(COLOURWAYS[0])
  const [swapping, setSwapping] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  /* Reveal on enter. IntersectionObserver, never a scroll listener. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-rv]'))
    if (reduce) {
      targets.forEach((t) => t.classList.add('fz-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('fz-in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.18 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  function pick(c: (typeof COLOURWAYS)[number]) {
    if (c.id === colour.id) return
    setSwapping(true)
    window.setTimeout(() => {
      setColour(c)
      setSwapping(false)
    }, 160)
  }

  const nav = [
    { label: 'Kollurinn', href: '#kollurinn' },
    { label: 'Gæran', href: '#gaeran' },
    { label: 'Bílskúrinn', href: '#bilskurinn' },
    { label: 'Söluaðilar', href: '#soluadilar' },
  ]

  return (
    <div
      ref={rootRef}
      className="fz-root"
      style={{ ['--fz-ground' as string]: colour.ground }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ---------------------------------------------------------- header */}
      <header
        className="absolute left-0 right-0 top-0 z-30 px-5 pt-6 sm:px-10"
        style={{ color: WOOL }}
      >
        <div className="mx-auto flex max-w-[1360px] items-baseline justify-between gap-6">
          <a
            href="#top"
            className={`fz-display ${FOCUS}`}
            style={{
              fontSize: 26, letterSpacing: '-.05em', color: WOOL,
              minHeight: 44, display: 'inline-flex', alignItems: 'center',
            }}
          >
            fuzzy
          </a>
          <nav className="hidden gap-8 sm:flex" aria-label="Aðalvalmynd">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`fz-link fz-mono ${FOCUS}`}
                style={{ color: WOOL, minHeight: 44, lineHeight: '44px' }}
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ hero */}
        <section
          className="fz-bleed relative grid min-h-[100svh] place-items-center px-5 pb-24 pt-32 sm:px-10"
          aria-labelledby="hero-h"
        >
          <div className="mx-auto w-full max-w-[1360px]">
            <div data-rv className="fz-rv">
              <Eyebrow>{HERO.eyebrow}</Eyebrow>
            </div>

            <div data-rv className="mt-6">
              <Headline as="h1" id="hero-h" text={HERO.headline} size={104} measure={1180} />
            </div>

            <div data-rv className="fz-rv mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <p
                className="max-w-[46ch] text-[16px] leading-relaxed sm:text-[17px]"
                style={{ color: SLATE }}
              >
                {HERO.lede}
              </p>
              <a
                href={HERO.cta.href}
                className={`fz-btn fz-mono inline-flex shrink-0 items-center justify-center rounded-full px-8 ${FOCUS}`}
                style={{ background: PINK, color: '#fff', minHeight: 52 }}
              >
                {HERO.cta.label}
              </a>
            </div>

            {/* the real range photograph, background knocked out */}
            <div data-rv className="fz-rv fz-stage mt-14 sm:mt-20">
              <img
                src={IMAGES.range}
                srcSet={`${IMAGES.rangeSm} 1200w, ${IMAGES.range} 2400w`}
                sizes="(max-width: 900px) 100vw, 1360px"
                width={2400}
                height={992}
                alt="Fimm Fuzzy kollar í ólíkum gærulitum ásamt upprunalega kassanum."
                className="h-auto w-full"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <Fibre />

        {/* ------------------------------------------------------- the object */}
        <section id="kollurinn" className="scroll-mt-20 px-5 py-24 sm:px-10 sm:py-32" aria-labelledby="spec-h">
          <div className="mx-auto max-w-[1360px]">
            <div data-rv>
              {/* the Waka Waka lockup: name, then the real measurements */}
              <h2 id="spec-h" className="fz-display" style={{ fontSize: 'clamp(30px,6vw,86px)' }}>
                {SPEC.title}{' '}
                <span style={{ fontFamily: MONO, fontSize: '.34em', letterSpacing: '.02em', color: SLATE }}>
                  ({SPEC.dims} · {SPEC.weight})
                </span>
              </h2>
            </div>

            <div className="mt-14 grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
              <div data-rv className="fz-rv">
                <img
                  src={IMAGES.home}
                  width={1170}
                  height={611}
                  alt="Hvítur Fuzzy kollur á viðargólfi við hliðina á minni Fuzzy undir glerkúpli."
                  className="h-auto w-full rounded-[4px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <dl data-rv className="fz-rv self-center">
                {SPEC.rows.map((r) => (
                  <div
                    key={r.k}
                    className="grid grid-cols-[104px_1fr] gap-6 py-5"
                    style={{ borderTop: '1px solid rgba(237,231,223,.14)' }}
                  >
                    <dt className="fz-mono" style={{ color: SLATE }}>{r.k}</dt>
                    <dd className="text-[15px] leading-relaxed sm:text-[16px]">{r.v}</dd>
                  </div>
                ))}
                <div className="pt-8">
                  {TRIVIA.map((t) => (
                    <p key={t} className="text-[14px] leading-relaxed" style={{ color: SLATE }}>{t}</p>
                  ))}
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- the wool */}
        <section id="gaeran" className="fz-bleed scroll-mt-20" aria-labelledby="wool-h">
          <div className="relative">
            <img
              src={IMAGES.fleece}
              width={2200}
              height={372}
              alt="Nærmynd af gærunni: löng, mjúk íslensk ull."
              className="h-[46vh] w-full object-cover sm:h-[58vh]"
              loading="lazy"
              decoding="async"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: `linear-gradient(to top, ${colour.ground} 4%, rgba(0,0,0,.25) 46%, rgba(0,0,0,.05))` }}
            />
          </div>

          <div className="mx-auto max-w-[1360px] px-5 py-20 sm:px-10 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
              <div data-rv>
                <Headline id="wool-h" text="Ekta íslensk gæra, ekkert annað" size={72} measure={620} />
              </div>
              <div data-rv className="fz-rv self-end">
                <p className="max-w-[52ch] text-[16px] leading-relaxed sm:text-[18px]">
                  Setan er bólstruð með ekta íslenskri gæru og fæturnir eru fjórir ávalir,
                  renndir viðarfætur. Ullin er löng og heldur lögun sinni, og hver gæra er
                  ólík þeirri næstu, svo engir tveir kollar eru eins.
                </p>
                <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                  {RECOGNITION.map((r) => (
                    <li key={r} className="fz-mono" style={{ color: SLATE }}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Fibre />

        {/* ------------------------------------------------------- colourways */}
        <section id="litir" className="scroll-mt-20 px-5 py-24 sm:px-10 sm:py-32" aria-labelledby="col-h">
          <div className="mx-auto max-w-[1360px]">
            <div data-rv>
              <Headline id="col-h" text="Hver gæra hefur sinn lit" size={72} measure={720} />
            </div>
            <p data-rv className="fz-rv mt-6 max-w-[54ch] text-[16px] leading-relaxed" style={{ color: SLATE }}>
              Litirnir hér að neðan eru mældir beint úr ljósmynd Sigurðar Más af kollunum,
              ekki valdir af okkur. Veldu lit og síðan tekur á sig tóninn af gærunni.
            </p>

            <div
              data-rv
              className="fz-rv mt-12 flex flex-wrap items-center gap-3"
              role="group"
              aria-label="Veldu gærulit"
            >
              {COLOURWAYS.map((c) => {
                const on = c.id === colour.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pick(c)}
                    aria-pressed={on}
                    className={`fz-chip fz-mono inline-flex items-center gap-3 px-5 ${FOCUS}`}
                    style={{
                      minHeight: 48,
                      color: on ? WOOL : SLATE,
                      background: on ? 'rgba(237,231,223,.07)' : 'transparent',
                      border: '1px solid rgba(237,231,223,.16)',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block rounded-full"
                      style={{ width: 20, height: 20, background: c.hex, border: '1px solid rgba(237,231,223,.2)' }}
                    />
                    {c.name}
                  </button>
                )
              })}
            </div>

            <p className="fz-mono mt-6" style={{ color: SLATE }} aria-live="polite">
              {colour.name} · {colour.note} · {colour.hex}
            </p>

            <div className={`fz-stage mt-12 ${swapping ? 'fz-swap' : ''}`}>
              <img
                src={IMAGES.range}
                width={2400}
                height={992}
                alt="Úrval Fuzzy kolla í ólíkum gærulitum."
                className="h-auto w-full"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <Fibre />

        {/* --------------------------------------------------------- the maker */}
        <section
          id="bilskurinn"
          className="scroll-mt-20 px-5 py-24 sm:px-10 sm:py-32"
          style={{ background: ASH }}
          aria-labelledby="maker-h"
        >
          <div className="mx-auto max-w-[1360px]">
            <div data-rv>
              <Headline
                id="maker-h"
                text="Enn þann dag í dag smíðar hann þá sjálfur"
                size={80}
                measure={900}
              />
            </div>

            <div className="mt-14 grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
              <div data-rv className="fz-rv">
                <p className="fz-mono" style={{ color: PINK }}>{MAKER.role}</p>
                <p className="fz-display mt-3" style={{ fontSize: 'clamp(24px,3vw,34px)' }}>
                  {MAKER.name}
                </p>
                {MAKER.body.map((p) => (
                  <p key={p.slice(0, 24)} className="mt-5 max-w-[46ch] text-[15px] leading-relaxed sm:text-[16px]"
                     style={{ color: SLATE }}>
                    {p}
                  </p>
                ))}
              </div>

              {/* dated timeline: a genuine sequence, so numbering is honest here */}
              <ol data-rv className="fz-rv">
                {TIMELINE.map((t) => (
                  <li
                    key={t.year}
                    className="grid grid-cols-[92px_1fr] gap-6 py-6 sm:grid-cols-[120px_1fr]"
                    style={{ borderTop: '1px solid rgba(237,231,223,.14)' }}
                  >
                    <span className="fz-mono" style={{ color: PINK }}>{t.year}</span>
                    <div>
                      <p className="text-[16px] font-semibold sm:text-[17px]">{t.title}</p>
                      <p className="mt-2 text-[14px] leading-relaxed sm:text-[15px]" style={{ color: SLATE }}>
                        {t.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- travels */}
        <section className="px-5 py-24 sm:px-10 sm:py-32" aria-labelledby="far-h">
          <div className="mx-auto max-w-[1360px]">
            <div data-rv>
              <Headline id="far-h" text="Kollurinn hefur farið víða" size={72} measure={680} />
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-[1.25fr_.75fr] sm:gap-10">
              <figure data-rv className="fz-rv m-0">
                <img
                  src={IMAGES.stockist}
                  width={1400}
                  height={2100}
                  alt="Fuzzy kollur til sýnis í verslun erlendis, við hlið uppstoppaðs ísbjarnar."
                  className="h-full max-h-[70vh] w-full rounded-[4px] object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="fz-mono mt-4" style={{ color: SLATE }}>
                  Fuzzy erlendis, meðal annars í Nordatlantisk Hus í Danmörku og í Kanada
                </figcaption>
              </figure>
              <figure data-rv className="fz-rv m-0 self-end">
                <img
                  src={IMAGES.press}
                  width={1100}
                  height={1414}
                  alt="Umfjöllun um Fuzzy í Iceland Review."
                  className="h-auto w-full rounded-[4px]"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="fz-mono mt-4" style={{ color: SLATE }}>
                  Iceland Review, Made in Iceland
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <Fibre />

        {/* ----------------------------------------------------------- lamps */}
        <section className="px-5 py-24 sm:px-10 sm:py-28" aria-labelledby="lamp-h">
          <div className="mx-auto grid max-w-[1360px] gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div data-rv>
              <Headline id="lamp-h" text={LAMPS.title} size={58} measure={420} />
            </div>
            <p data-rv className="fz-rv max-w-[60ch] self-center text-[16px] leading-relaxed sm:text-[18px]"
               style={{ color: SLATE }}>
              {LAMPS.body}
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------- retailers */}
        <section
          id="soluadilar"
          className="scroll-mt-20 px-5 py-24 sm:px-10 sm:py-32"
          style={{ background: ASH }}
          aria-labelledby="ret-h"
        >
          <div className="mx-auto max-w-[1360px]">
            <div data-rv>
              <Headline id="ret-h" text="Fæst hjá tíu verslunum" size={72} measure={640} />
            </div>
            <ul data-rv className="fz-rv mt-12">
              {RETAILERS.map((r) => (
                <li
                  key={r.name}
                  className="fz-row grid grid-cols-1 gap-1 py-5 sm:grid-cols-[minmax(200px,.8fr)_1.4fr_auto] sm:items-baseline sm:gap-8"
                  style={{ borderTop: '1px solid rgba(237,231,223,.14)' }}
                >
                  <span className="text-[16px] font-semibold sm:text-[17px]">{r.name}</span>
                  <span className="text-[14px] sm:text-[15px]" style={{ color: SLATE }}>{r.addr}</span>
                  <a
                    href={`tel:${r.tel.replace(/\s/g, '')}`}
                    className={`fz-link fz-mono ${FOCUS}`}
                    style={{ color: WOOL, minHeight: 44, lineHeight: '44px' }}
                  >
                    {r.tel}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Fibre />

        {/* ---------------------------------------------------------- closer */}
        <section className="px-5 pb-32 pt-24 sm:px-10 sm:pt-28" aria-labelledby="closer-h">
          <div className="mx-auto max-w-[1360px]">
            <div data-rv>
              <Headline id="closer-h" text="Sérsmíði og fyrirspurnir" size={76} measure={760} />
            </div>
            <div data-rv className="fz-rv mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
              {BRAND.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/[^\d]/g, '')}`}
                  className={`fz-display ${FOCUS}`}
                  style={{
                    fontSize: 'clamp(26px,4vw,46px)', color: PINK,
                    minHeight: 48, display: 'inline-flex', alignItems: 'center',
                  }}
                >
                  {p}
                </a>
              ))}
            </div>
            <p data-rv className="fz-rv mt-8 text-[15px] leading-relaxed" style={{ color: SLATE }}>
              {BRAND.legal} · {BRAND.address}
              <br />
              Kennitala {BRAND.kt} · skráð {BRAND.founded}
            </p>
          </div>
        </section>
      </main>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
