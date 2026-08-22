import { useEffect, useMemo, useRef } from 'react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { companyEntry as company } from './company'
import {
  STUDIO, HERO, STAGES, PACKAGES, PRINTS, PRICE_NOTE,
  PROCESS, SCHOOLS, OTHER, OLINA, IMAGES,
} from './data'

/* ------------------------------------------------------------------ tokens */

const LINEN = '#F3EFE9'
const BONE = '#FBF8F3'
const UMBER = '#2A2420'
const MOSS = '#3F5140'
const STONE = '#6B645C' /* 5.09:1 on linen, so secondary text clears AA */
const LINE = 'rgba(42,36,32,.14)'

/* Serif is justified here: what she actually sells is a printed heirloom album,
   and the studio is nineteen years of family portraiture. Newsreader, not one of
   the four display serifs that read as slop on a page like this. */
const DISPLAY = "'Newsreader', Georgia, serif"
const BODY = "'Schibsted Grotesk', system-ui, sans-serif"

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

const NAV = [
  { id: 'aeviskeidin', label: 'Æviskeiðin' },
  { id: 'ferlid', label: 'Ferlið' },
  { id: 'verdskra', label: 'Verðskrá' },
  { id: 'skolamyndir', label: 'Skólamyndir' },
]

/* ------------------------------------------------------------------ styles */

const CSS = `
.my-root{background:${LINEN};color:${UMBER};font-family:${BODY}}
.my-root ::selection{background:${MOSS};color:#fff}
.my-bleed > *{position:relative}
.my-display{font-family:${DISPLAY};font-weight:500;letter-spacing:-.02em;line-height:1.16}
.my-eyebrow{font-size:11.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
.my-num{font-variant-numeric:tabular-nums}

/* ---- header band ---- */
.my-head{position:relative;z-index:20;padding:18px 20px;background:${LINEN};
  border-bottom:1px solid ${LINE}}
.my-head-in{margin:0 auto;max-width:1340px;display:grid;align-items:center;
  grid-template-columns:1fr auto 1fr;gap:20px}
.my-navset{display:none;gap:26px}
@media (min-width:920px){.my-navset{display:flex}}
.my-navset.is-right{justify-content:flex-end}
.my-navlink{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;
  color:${UMBER};min-height:44px;display:inline-flex;align-items:center}

/* ---- headline rise ---- */
.my-ln{display:inline-block;overflow:hidden;vertical-align:bottom;
  padding-top:.2em;margin-top:-.2em}
.my-w{display:inline-block;transform:translateY(105%);opacity:0;
  transition:transform 860ms cubic-bezier(.16,1,.3,1),opacity 640ms linear}
.my-in .my-w{transform:translateY(0);opacity:1}
.my-rv{opacity:0;transform:translateY(20px);
  transition:opacity 660ms cubic-bezier(.16,1,.3,1),transform 660ms cubic-bezier(.16,1,.3,1)}
.my-in.my-rv,.my-in .my-rv{opacity:1;transform:none}

/* ---- hero ---- */
/* On a phone the text block is tall enough to climb off the veil and land on
   the bright part of the photograph, so the hero STACKS below 760px: the picture
   keeps its own band and the type sits on linen where it is always readable.
   Above that the two share one grid cell and the veil does the work. */
.my-hero{position:relative;display:grid;isolation:isolate}
.my-hero img{width:100%;height:100%;object-fit:cover;object-position:50% 38%}
.my-hero-veil{display:none}
.my-hero-img{height:56svh;min-height:330px}
.my-hero-body{padding-top:34px}
@media (min-width:760px){
  .my-hero{min-height:clamp(520px,80svh,780px)}
  .my-hero > *{grid-area:1/1}
  .my-hero-img{height:auto;min-height:0}
  .my-hero-veil{display:block;background:linear-gradient(to top,
    ${LINEN} 1%, rgba(243,239,233,.92) 26%, rgba(243,239,233,.34) 56%, rgba(243,239,233,0) 78%)}
  .my-hero-body{align-self:end;padding-top:0}
}

/* ---- THE SIGNATURE: the life rail ---------------------------------------
   Her service list in the order a life happens. The interaction is a focus
   pull, which is a camera truth rather than a decorative hover: the stage the
   pointer is on resolves, the rest soften. Touch has no hover, so on a phone
   every card simply stays sharp. */
.my-rail{display:grid;gap:18px;grid-auto-flow:column;
  grid-auto-columns:minmax(255px,1fr);overflow-x:auto;scroll-snap-type:x mandatory;
  padding-bottom:10px;scrollbar-width:thin}
.my-stage{scroll-snap-align:start;background:${BONE};border:1px solid ${LINE};
  border-radius:4px;overflow:hidden;display:flex;flex-direction:column;
  transition:filter 260ms ease,opacity 260ms ease,transform 260ms cubic-bezier(.16,1,.3,1)}
@media (hover:hover) and (pointer:fine){
  @media (prefers-reduced-motion:no-preference){
    .my-rail:hover .my-stage,.my-rail:focus-within .my-stage{filter:blur(2.5px);opacity:.5}
    .my-rail .my-stage:hover,.my-rail .my-stage:focus-within{filter:none;opacity:1;transform:translateY(-3px)}
  }
}
.my-stage-img{aspect-ratio:4/3;width:100%;object-fit:cover;display:block}
.my-stage-blank{aspect-ratio:4/3;width:100%;display:grid;place-items:center;
  background:linear-gradient(160deg, rgba(63,81,64,.07), rgba(42,36,32,.05))}

/* ---- price rows ---- */
.my-pack{background:${BONE};border:1px solid ${LINE};border-radius:4px}
.my-print{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:baseline;
  padding:12px 0;border-bottom:1px dotted rgba(42,36,32,.24)}
.my-print:last-child{border-bottom:0}

/* ---- links ---- */
.my-link{position:relative;display:inline-block}
.my-link::after{content:"";position:absolute;left:0;right:0;bottom:-3px;height:1px;
  background:currentColor;transform:scaleX(0);transform-origin:left;
  transition:transform 190ms cubic-bezier(.16,1,.3,1)}
.my-link:hover::after,.my-link:focus-visible::after{transform:scaleX(1)}
.my-btn{transition:background-color 170ms ease,transform 150ms ease}
.my-btn:active{transform:scale(.985)}

@media (prefers-reduced-motion:reduce){
  .my-w{transform:none;opacity:1;transition:none}
  .my-rv{opacity:1;transform:none;transition:none}
  .my-stage{transition:none}
}
`

/* ------------------------------------------------------------- primitives */

function Headline({
  text, id, size = 88, measure, as: Tag = 'h2', className = '',
}: {
  text: string; id?: string; size?: number; measure?: number
  as?: 'h1' | 'h2'; className?: string
}) {
  const words = useMemo(() => text.split(' '), [text])
  return (
    <Tag
      id={id}
      aria-label={text}
      className={`my-display ${className}`}
      style={{
        fontSize: `clamp(30px, ${size / 19}vw, ${size}px)`,
        maxWidth: measure ? `${measure}px` : undefined,
        textWrap: 'balance',
      }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={`${w}-${i}`}>
            <span className="my-ln">
              <span className="my-w" style={{ transitionDelay: `${i * 44}ms` }}>{w}</span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  )
}

/* ------------------------------------------------------------------- page */

export default function MyndoPage() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-rv]'))
    if (reduce) { targets.forEach((t) => t.classList.add('my-in')); return }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('my-in'); io.unobserve(e.target) }
      }),
      { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  const hero = STAGES.find((s) => s.id === 'nyburi')!

  return (
    <div ref={rootRef} className="my-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="my-head">
        <div className="my-head-in">
          <nav className="my-navset" aria-label="Valmynd, vinstri">
            {NAV.slice(0, 2).map((n) => (
              <a key={n.id} href={`#${n.id}`} className={`my-link my-navlink ${FOCUS}`}>{n.label}</a>
            ))}
          </nav>
          <a href="#top" className={`my-display justify-self-center ${FOCUS}`}
             style={{ fontSize: 25, letterSpacing: '-.01em', color: UMBER, minHeight: 44,
                      display: 'inline-flex', alignItems: 'center' }}>
            Myndó
          </a>
          <nav className="my-navset is-right" aria-label="Valmynd, hægri">
            {NAV.slice(2).map((n) => (
              <a key={n.id} href={`#${n.id}`} className={`my-link my-navlink ${FOCUS}`}>{n.label}</a>
            ))}
            <a href={`tel:${STUDIO.telHref}`} className={`my-link my-navlink my-num ${FOCUS}`}
               style={{ color: MOSS }}>{STUDIO.tel}</a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ hero */}
        <section className="my-bleed my-hero" aria-labelledby="hero-h">
          <img
            className="my-hero-img"
            src={hero.photo!}
            width={1600}
            height={621}
            alt={hero.alt!}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="my-hero-veil" aria-hidden="true" />
          <div className="my-hero-body w-full px-5 pb-12 sm:px-10 sm:pb-16">
            <div className="mx-auto w-full max-w-[1340px]">
              <div data-rv className="my-rv">
                <p className="my-eyebrow" style={{ color: STONE }}>{HERO.eyebrow}</p>
              </div>
              <div data-rv className="mt-4">
                <Headline as="h1" id="hero-h" text={HERO.headline} size={92} measure={860} />
              </div>
              <div data-rv className="my-rv mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-[48ch] text-[16px] leading-relaxed sm:text-[17px]" style={{ color: STONE }}>
                  {HERO.lede}
                </p>
                <a href={HERO.cta.href}
                   className={`my-btn inline-flex shrink-0 items-center justify-center rounded-full px-8 text-[15px] font-semibold ${FOCUS}`}
                   style={{ background: MOSS, color: '#fff', minHeight: 52 }}>
                  {HERO.cta.label}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- THE LIFE RAIL */}
        <section id="aeviskeidin" className="scroll-mt-16 px-5 py-20 sm:px-10 sm:py-28" aria-labelledby="ae-h">
          <div className="mx-auto max-w-[1340px]">
            <div data-rv>
              <Headline id="ae-h" text="Ein ævi, einn ljósmyndari" size={68} measure={720} />
            </div>
            <p data-rv className="my-rv mt-6 max-w-[58ch] text-[16px] leading-relaxed" style={{ color: STONE }}>
              Þjónustan hjá Myndó, lesin í þeirri röð sem lífið gerist. Flestir koma fyrst með bumbuna
              og eru enn að koma þegar barnið útskrifast.
            </p>

            <div data-rv className="my-rv mt-12">
              <ul className="my-rail" role="list">
                {STAGES.map((s) => (
                  <li key={s.id} className="my-stage" tabIndex={0}>
                    {s.photo
                      ? <img className="my-stage-img" src={s.photo} width={1600} height={1200}
                             alt={s.alt} loading="lazy" decoding="async" />
                      : <div className="my-stage-blank" aria-hidden="true">
                          <span className="my-display" style={{ fontSize: 46, color: 'rgba(42,36,32,.16)' }}>
                            {s.n}
                          </span>
                        </div>}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="my-eyebrow my-num" style={{ color: MOSS }}>{s.n} · {s.name}</p>
                      <p className="mt-3 flex-1 text-[14px] leading-relaxed" style={{ color: STONE }}>{s.body}</p>
                      <p className="my-num mt-5 text-[14px]">
                        {s.price
                          ? <><span className="font-semibold">{s.price} kr.</span>
                              <span style={{ color: STONE }}> · {s.dur}</span></>
                          : <span style={{ color: STONE }}>Verð eftir umfangi, hafðu samband</span>}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- process */}
        <section id="ferlid" className="scroll-mt-16 px-5 py-20 sm:px-10 sm:py-24"
                 style={{ background: BONE, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}
                 aria-labelledby="fe-h">
          <div className="mx-auto max-w-[1340px]">
            <div data-rv><Headline id="fe-h" text="Þrjú skref" size={58} measure={480} /></div>
            <ol data-rv className="my-rv mt-12 grid gap-10 md:grid-cols-3 md:gap-16">
              {PROCESS.map((p) => (
                <li key={p.n} style={{ borderTop: `1px solid ${LINE}` }} className="pt-6">
                  <p className="my-eyebrow my-num" style={{ color: MOSS }}>{p.n}</p>
                  <p className="my-display mt-3" style={{ fontSize: 24 }}>{p.t}</p>
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ color: STONE }}>{p.b}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* --------------------------------------------------------- prices */}
        <section id="verdskra" className="scroll-mt-16 px-5 py-20 sm:px-10 sm:py-28" aria-labelledby="vs-h">
          <div className="mx-auto max-w-[1340px]">
            <div data-rv><Headline id="vs-h" text="Verðskráin" size={68} measure={520} /></div>
            <p data-rv className="my-rv mt-6 max-w-[62ch] text-[15px] leading-relaxed" style={{ color: STONE }}>
              {PRICE_NOTE}
            </p>

            <div data-rv className="my-rv mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {PACKAGES.map((p) => (
                <article key={p.name} className="my-pack flex flex-col p-7">
                  <p className="my-display" style={{ fontSize: 23 }}>{p.name}</p>
                  <p className="my-num mt-2 text-[26px] font-semibold" style={{ color: MOSS }}>{p.price} kr.</p>
                  <p className="my-eyebrow my-num mt-1" style={{ color: STONE }}>{p.dur}</p>
                  <p className="mt-5 flex-1 text-[14px] leading-relaxed" style={{ color: STONE }}>{p.fits}</p>
                  <p className="mt-4 text-[13px]" style={{ color: STONE, borderTop: `1px solid ${LINE}`, paddingTop: 14 }}>
                    Innifalið: {p.incl}
                  </p>
                </article>
              ))}
            </div>

            <div data-rv className="my-rv mt-16 max-w-[720px]">
              <p className="my-eyebrow" style={{ color: MOSS }}>Prentun</p>
              <div className="mt-4">
                {PRINTS.map((r) => (
                  <div key={r.k} className="my-print">
                    <span className="text-[15px]">
                      {r.k}
                      {r.note ? <span className="block text-[13px]" style={{ color: STONE }}>{r.note}</span> : null}
                    </span>
                    <span className="my-num text-[15px] font-semibold whitespace-nowrap">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ schools */}
        <section id="skolamyndir" className="scroll-mt-16 px-5 py-20 sm:px-10 sm:py-24"
                 style={{ background: BONE, borderTop: `1px solid ${LINE}` }} aria-labelledby="sk-h">
          <div className="mx-auto grid max-w-[1340px] gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
            <div data-rv><Headline id="sk-h" text={SCHOOLS.title} size={56} measure={380} /></div>
            <div data-rv className="my-rv self-center">
              <p className="max-w-[56ch] text-[16px] leading-relaxed sm:text-[17px]">{SCHOOLS.body}</p>
              <a href={`tel:${STUDIO.telHref}`}
                 className={`my-btn mt-8 inline-flex items-center justify-center rounded-full px-8 text-[15px] font-semibold ${FOCUS}`}
                 style={{ background: MOSS, color: '#fff', minHeight: 52 }}>
                Fyrirspurn fyrir skóla
              </a>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- about */}
        <section className="px-5 py-20 sm:px-10 sm:py-28" aria-labelledby="um-h">
          <div className="mx-auto max-w-[1340px]">
            <div data-rv><Headline id="um-h" text="Ólína á bak við vélina" size={62} measure={640} /></div>
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
              <div data-rv className="my-rv">
                <img src={IMAGES.olina} width={1140} height={604}
                     alt="Ólína Kristín Margeirsdóttir í ljósmyndastofunni."
                     className="h-auto w-full rounded-[4px]" style={{ border: `1px solid ${LINE}` }}
                     loading="lazy" decoding="async" />
              </div>
              <div data-rv className="my-rv self-center">
                <p className="my-display" style={{ fontSize: 26 }}>{OLINA.name}</p>
                <p className="my-eyebrow mt-2" style={{ color: MOSS }}>{OLINA.role}</p>
                {OLINA.body.map((b) => (
                  <p key={b.slice(0, 20)} className="mt-5 max-w-[52ch] text-[15px] leading-relaxed sm:text-[16px]"
                     style={{ color: STONE }}>{b}</p>
                ))}
                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                  {OTHER.map((o) => (
                    <li key={o} className="my-eyebrow" style={{ color: STONE }}>{o}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- closer */}
        <section className="my-bleed px-5 pb-28 sm:px-10" aria-labelledby="cl-h">
          <div className="mx-auto max-w-[1340px]">
            <div data-rv className="my-rv overflow-hidden rounded-[4px]"
                 style={{ border: `1px solid ${LINE}` }}>
              <img src={IMAGES.nyburi2} width={707} height={500}
                   alt="Svarthvít mynd af sofandi nýbura."
                   className="h-[240px] w-full object-cover sm:h-[320px]" loading="lazy" decoding="async" />
            </div>
            <div data-rv className="mt-12">
              <Headline id="cl-h" text="Bókaðu myndatöku" size={68} measure={560} />
            </div>
            <a data-rv href={`tel:${STUDIO.telHref}`}
               className={`my-link my-display my-num my-rv mt-6 inline-flex ${FOCUS}`}
               style={{ fontSize: 'clamp(30px,5vw,58px)', color: MOSS, minHeight: 52, alignItems: 'center' }}>
              {STUDIO.tel}
            </a>
            <p data-rv className="my-rv mt-8 text-[14px] leading-relaxed" style={{ color: STONE }}>
              {STUDIO.legal} · {STUDIO.address}
              <br />
              Kennitala {STUDIO.kt} · stofnuð {STUDIO.founded} · félagi í {STUDIO.member}
            </p>
          </div>
        </section>
      </main>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
