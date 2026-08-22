import { useEffect, useMemo, useRef, useState } from 'react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { companyEntry as company } from './company'
import {
  BRAND, SPEC, COLOURWAYS, RECOGNITION, RETAILERS, MAKER, LAMPS,
  IMAGES, TRIVIA, STATIONS, CHAPTERS, CH_HEAD, WORKSHOP,
} from './data'

/* ---------------------------------------------------------------- tokens
 * TRANSPLANT of the Fríða engine (01-live/frida), which Sindri picked.
 * Measured 2026-08-22: image ratio .322, 12 images, h1 32 / h2 45 / body 17,
 * 12.2 screens, Cabinet Grotesk + Switzer + Azeret Mono on porcelain.
 *
 * Its signature is that the catalogue IS a dateline: a sticky rail of honest
 * dated stations that light as the reader moves, and every chapter is a museum
 * accession entry carrying its own SOURCE. Fuzzy earns that structure because
 * its argument is literally a dateline, and each station here is checkable.
 *
 * Anti-convergence vs Fríða, same engine: her ground is porcelain with a gold
 * well; Fuzzy's is paper with the magenta sampled from its own printed advert.
 * Her stations are centuries; his are five decades of one workshop.
 */

const PAPER = '#F4F1EB'
const WELL = '#FBFAF7'
const INK = '#141414'
const MUTE = '#635C54'
const MAGENTA = '#872684'

const DISP = "'Cabinet Grotesk', system-ui, sans-serif"
const BODY = "'Schibsted Grotesk', system-ui, sans-serif"
const REG = "'Space Mono', ui-monospace, monospace"

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

const CSS = `
.fz-root{background:${PAPER};color:${INK};font-family:${BODY};font-size:17px;line-height:1.62;
  overflow-x:clip}
.fz-root ::selection{background:${MAGENTA};color:#fff}
.fz-wrap{margin:0 auto;max-width:1180px;padding:0 20px}
@media (min-width:800px){.fz-wrap{padding:0 40px}}

.reg{font-family:${REG};font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:${MUTE}}
.fz-h1{font-family:${DISP};font-size:clamp(26px,3vw,32px);line-height:1.2;letter-spacing:-.02em;font-weight:700}
.fz-h2{font-family:${DISP};font-size:clamp(30px,4.2vw,45px);line-height:1.14;letter-spacing:-.025em;font-weight:700}
.fz-h3{font-family:${DISP};font-size:clamp(24px,2.9vw,37px);line-height:1.16;letter-spacing:-.02em;font-weight:700}
.fz-lead{max-width:62ch;color:${MUTE}}

/* per-word rise, words never characters */
.fz-ln{display:inline-block;overflow:hidden;vertical-align:bottom;padding-top:.18em;margin-top:-.18em}
.fz-w{display:inline-block;transform:translateY(105%);opacity:0;
  transition:transform 820ms cubic-bezier(.16,1,.3,1),opacity 620ms linear}
.fz-in .fz-w{transform:translateY(0);opacity:1}
.fz-rv{opacity:0;transform:translateY(18px);
  transition:opacity 640ms cubic-bezier(.16,1,.3,1),transform 640ms cubic-bezier(.16,1,.3,1)}
.fz-in.fz-rv,.fz-in .fz-rv{opacity:1;transform:none}

/* ---- hero: wordmark set across the photograph ---- */
.fz-intro{padding:70px 0 90px;text-align:center}
.fz-intro-fig{position:relative;margin:34px auto 0;max-width:620px}
.fz-intro-fig img{display:block;width:100%;height:auto}
.fz-mark{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);
  font-family:${DISP};font-weight:700;font-size:clamp(56px,11vw,148px);line-height:1;
  letter-spacing:-.045em;color:${WELL};mix-blend-mode:difference;pointer-events:none}

/* ---- THE SIGNATURE: the dateline rail ---- */
.fz-dl{position:relative;margin-top:56px}
.fz-rail{position:sticky;top:0;z-index:12;background:${PAPER};
  border-top:1px solid rgba(20,20,20,.14);border-bottom:1px solid rgba(20,20,20,.14)}
.fz-rail-in{margin:0 auto;max-width:1180px;padding:11px 20px;display:flex;gap:6px}
@media (min-width:800px){.fz-rail-in{padding:11px 40px;gap:14px}}
.fz-st{flex:1;min-width:0}
.fz-st b{display:block;height:2px;background:rgba(20,20,20,.16);overflow:hidden}
.fz-st b::after{content:"";display:block;height:100%;width:var(--f,0%);background:${MAGENTA};
  transition:width 420ms cubic-bezier(.16,1,.3,1)}
.fz-st span{display:block;margin-top:7px;font-family:${REG};font-size:10px;letter-spacing:.13em;
  text-transform:uppercase;color:${MUTE};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  transition:color 300ms ease}
.fz-st[data-on="1"] span{color:${INK}}

/* ---- chapter = a museum accession entry ---- */
.fz-ch{padding:86px 0;border-bottom:1px solid rgba(20,20,20,.12)}
.fz-ch-grid{display:grid;gap:30px}
@media (min-width:900px){.fz-ch-grid{grid-template-columns:1.25fr .95fr;gap:56px;align-items:start}}
.fz-ch img{display:block;width:100%;height:auto;background:${WELL}}
.fz-ch-no{color:${MAGENTA};margin-right:12px}
.fz-ch-srclabel{margin-top:26px}
.fz-ch-src{margin-top:6px;font-size:15px;color:${MUTE}}
.fz-ch-body{margin-top:18px;max-width:52ch}
.fz-ch-q{margin:26px 0 0;padding-left:16px;border-left:2px solid ${MAGENTA}}
.fz-ch-q p{font-family:${DISP};font-size:19px;line-height:1.34;font-weight:500}
.fz-ch-foot{margin-top:22px;display:flex;gap:16px;align-items:baseline}

/* ---- index rows ---- */
.fz-row{display:grid;gap:4px;padding:13px 0;border-top:1px solid rgba(20,20,20,.12)}
@media (min-width:700px){.fz-row{grid-template-columns:minmax(180px,1fr) 2fr auto;gap:20px;align-items:baseline}}
.fz-chip{display:inline-flex;align-items:center;gap:9px;padding:9px 13px;min-height:44px;
  border:1px solid rgba(20,20,20,.18);background:${WELL};
  transition:border-color 180ms ease,transform 150ms ease}
.fz-chip:active{transform:scale(.985)}
.fz-chip[aria-pressed="true"]{border-color:${MAGENTA};box-shadow:inset 0 0 0 1px ${MAGENTA}}
.fz-link{position:relative;display:inline-block}
.fz-link::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:1px;background:currentColor;
  transform:scaleX(0);transform-origin:left;transition:transform 190ms cubic-bezier(.16,1,.3,1)}
.fz-link:hover::after,.fz-link:focus-visible::after{transform:scaleX(1)}
.fz-ib{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border:1px solid ${INK};
  font-family:${REG};font-size:11px;letter-spacing:.13em;text-transform:uppercase;
  transition:background-color 180ms ease,color 180ms ease,transform 150ms ease}
.fz-ib:hover{background:${INK};color:${PAPER}}
.fz-ib:active{transform:scale(.985)}
.fz-ib--solid{background:${MAGENTA};border-color:${MAGENTA};color:#fff}
.fz-ib--solid:hover{background:${INK};border-color:${INK}}

@media (prefers-reduced-motion:reduce){
  .fz-w{transform:none;opacity:1;transition:none}
  .fz-rv{opacity:1;transform:none;transition:none}
  .fz-st b::after{transition:none}
}
`

function Words({ text, as: Tag = 'h2', className = '' }:
  { text: string; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  const words = useMemo(() => text.split(' '), [text])
  return (
    <Tag aria-label={text} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={`${w}-${i}`}>
            <span className="fz-ln"><span className="fz-w" style={{ transitionDelay: `${i * 42}ms` }}>{w}</span></span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  )
}

export default function FuzzyPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [colour, setColour] = useState<(typeof COLOURWAYS)[number]>(COLOURWAYS[0])
  const [fills, setFills] = useState<number[]>(() => STATIONS.map(() => 0))

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-rv]'))
    if (reduce) targets.forEach((t) => t.classList.add('fz-in'))
    const io = reduce ? null : new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('fz-in'); io?.unobserve(e.target) }
      }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )
    if (io) targets.forEach((t) => io.observe(t))

    /* The rail reads real reading position: each station fills by how far the
       matching chapter has passed the middle of the viewport. IntersectionObserver
       cannot give a continuous fraction, so this is a rAF sampler gated on the
       dateline being on screen, never a scroll listener (ledger: never ask
       "am I on screen" with getBoundingClientRect inside a ticker). */
    const chs = Array.from(root.querySelectorAll<HTMLElement>('.fz-ch'))
    let live = false, raf = 0
    const gate = new IntersectionObserver(
      (es) => { live = es.some((e) => e.isIntersecting); if (live && !raf) raf = requestAnimationFrame(tick) },
      { rootMargin: '10% 0px 10% 0px' },
    )
    const dl = root.querySelector('.fz-dl')
    if (dl) gate.observe(dl)

    function tick() {
      raf = 0
      if (!live) return
      const mid = window.innerHeight * 0.55
      const next = chs.map((c) => {
        const r = c.getBoundingClientRect()
        return Math.max(0, Math.min(1, (mid - r.top) / Math.max(1, r.height)))
      })
      setFills((prev) => (prev.some((v, i) => Math.abs(v - next[i]) > 0.012) ? next : prev))
      raf = requestAnimationFrame(tick)
    }
    return () => { io?.disconnect(); gate.disconnect(); if (raf) cancelAnimationFrame(raf) }
  }, [])

  const active = fills.findIndex((f, i) => f > 0 && (fills[i + 1] ?? 0) < 1)

  return (
    <div ref={rootRef} className="fz-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <main id="top">
        {/* ------------------------------------------------------------ hero */}
        <section className="fz-intro">
          <div className="fz-wrap">
            <p className="reg" data-rv>Módel-húsgögn · Reykjavík</p>
            <figure className="fz-intro-fig m-0" data-rv>
              <img src={IMAGES.bench} width={1280} height={853} loading="eager" decoding="async"
                   alt="Sigurður Már Helgason rennur viðarfætur í bílskúrnum sínum." />
              <span className="fz-mark" aria-hidden="true">fuzzy</span>
            </figure>
            <p className="reg mt-7" data-rv>
              <span>Handsmíðaður síðan 1972</span>
              <span style={{ margin: '0 12px' }}>·</span>
              <span>{SPEC.dims}</span>
              <span style={{ margin: '0 12px' }}>·</span>
              <span>{SPEC.weight}</span>
            </p>
          </div>
        </section>

        {/* -------------------------------------------- THE DATELINE + CHAPTERS */}
        <section id="heimildir">
          <div className="fz-wrap" data-rv>
            <p className="reg">{CH_HEAD.eyebrow}</p>
            <Words text={CH_HEAD.title} as="h2" className="fz-h2 mt-4" />
            <p className="fz-lead mt-6">{CH_HEAD.lead}</p>
          </div>

          <div className="fz-dl">
            <div className="fz-rail">
              <div className="fz-rail-in" role="list" aria-label="Tímalína">
                {STATIONS.map((st, i) => (
                  <span key={st} className="fz-st" role="listitem" data-on={i <= active ? '1' : '0'}>
                    <b style={{ ['--f' as string]: `${Math.round((fills[i] ?? 0) * 100)}%` }} />
                    <span>{st}</span>
                  </span>
                ))}
              </div>
            </div>

            {CHAPTERS.map((ch, i) => (
              <article key={ch.id} id={ch.id} className="fz-ch">
                <div className="fz-wrap">
                  <div className="fz-ch-grid">
                    <div data-rv className="fz-rv">
                      <img src={`/fuzzy/${ch.img}.webp`} alt={ch.alt} loading="lazy" decoding="async" />
                    </div>
                    <div data-rv>
                      <p className="reg"><span className="fz-ch-no">{String(i + 1).padStart(2, '0')}</span>{ch.station}</p>
                      <Words text={ch.name} as="h3" className="fz-h3 mt-4" />
                      <p className="reg fz-ch-srclabel">{CH_HEAD.sourceLabel}</p>
                      <p className="fz-ch-src">{ch.source}</p>
                      <p className="fz-ch-body">{ch.body}</p>
                      <blockquote className="fz-ch-q"><p>{ch.quote}</p></blockquote>
                      <p className="fz-ch-foot"><span className="reg">{ch.count}</span></p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- workshop */}
        <section id="verkstaedid" className="py-20">
          <div className="fz-wrap">
            <p className="reg" data-rv>{WORKSHOP.eyebrow}</p>
            <Words text={WORKSHOP.title} as="h2" className="fz-h2 mt-4" />
            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
              <div data-rv className="fz-rv">
                <p className="fz-lead">{WORKSHOP.body}</p>
                <p className="mt-6 text-[15px]" style={{ color: MUTE }}>
                  <span className="reg">{WORKSHOP.noteLabel}</span>{' '}{WORKSHOP.note}
                </p>
                <p className="mt-8 text-[15px] font-semibold">{MAKER.name}</p>
                <p className="reg mt-1">{MAKER.role}</p>
                <ul className="mt-7 grid gap-1">
                  {RECOGNITION.map((r) => <li key={r} className="reg" style={{ letterSpacing: '.08em' }}>{r}</li>)}
                </ul>
              </div>
              <figure data-rv className="fz-rv m-0">
                <img src="/fuzzy/hraun.webp" alt="Fuzzy kollur í íslensku hrauni."
                     className="block h-auto w-full" loading="lazy" decoding="async" />
              </figure>
            </div>

            <figure data-rv className="fz-rv m-0 mt-14">
              <img src="/fuzzy/gras.webp" alt="Tveir hvítir Fuzzy kollar úti í grasi."
                   className="block h-auto w-full" loading="lazy" decoding="async" />
            </figure>
            <figure data-rv className="fz-rv m-0 mt-4 grid gap-4 sm:grid-cols-3">
              <img src="/fuzzy/refur.webp" alt="Fuzzy kollur og refur." className="block h-auto w-full"
                   loading="lazy" decoding="async" />
              <img src="/fuzzy/syning1.webp" alt="Fuzzy á sýningu." className="block h-auto w-full"
                   loading="lazy" decoding="async" />
              <img src="/fuzzy/budur3.webp" alt="Fuzzy í jólaglugga verslunar." className="block h-auto w-full"
                   loading="lazy" decoding="async" />
            </figure>
          </div>
        </section>

        {/* --------------------------------------------------------- the range */}
        <section id="litirnir" className="py-20" style={{ background: WELL }}>
          <div className="fz-wrap">
            <p className="reg" data-rv>Gærurnar</p>
            <Words text="Engir tveir kollar eru eins" as="h2" className="fz-h2 mt-4" />
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
              <div data-rv className="fz-rv">
                <img src={IMAGES.range} srcSet={`${IMAGES.rangeSm} 1200w, ${IMAGES.range} 2400w`}
                     sizes="(max-width:900px) 100vw, 58vw" width={2400} height={992}
                     alt="Fimm Fuzzy kollar í ólíkum gærulitum ásamt kassanum."
                     className="block h-auto w-full" loading="lazy" decoding="async" />
                <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Gærulitir">
                  {COLOURWAYS.map((c) => (
                    <button key={c.id} type="button" onClick={() => setColour(c)}
                            aria-pressed={c.id === colour.id} className={`fz-chip ${FOCUS}`}>
                      <span aria-hidden="true" style={{ width: 14, height: 14, background: c.hex,
                            border: '1px solid rgba(20,20,20,.2)', display: 'inline-block' }} />
                      <span className="reg" style={{ color: c.id === colour.id ? INK : MUTE }}>{c.name}</span>
                    </button>
                  ))}
                </div>
                <p className="reg mt-4" aria-live="polite" style={{ letterSpacing: '.08em' }}>
                  {colour.name} · {colour.note} · litur mældur úr þeirra eigin ljósmynd
                </p>
              </div>
              <dl data-rv className="fz-rv m-0">
                {SPEC.rows.map((r) => (
                  <div key={r.k} className="fz-row">
                    <dt className="reg">{r.k}</dt>
                    <dd className="m-0 text-[15px]">{r.v}</dd>
                  </div>
                ))}
                <div className="fz-row">
                  <dt className="reg">Vissir þú</dt>
                  <dd className="m-0 text-[15px]">{TRIVIA.join(' ')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- their own advert */}
        <section className="py-20">
          <div className="fz-wrap">
            <p className="reg" data-rv>Auglýsingin</p>
            <Words text="Kveðja frá Íslandi, á fimm tungumálum" as="h2" className="fz-h2 mt-4" />
            <p data-rv className="fz-rv fz-lead mt-6">
              Þeirra eigin auglýsing, prentuð fyrir ferðamanninn á fimm tungumálum. Sami kollurinn,
              sama myndin, fimm kveðjur.
            </p>
            <div data-rv className="fz-rv mt-9 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {[['ad-is', 'Kveðja frá Íslandi'], ['ad-en', 'Greetings from Iceland'],
                ['ad-de', 'Grüße aus Island'], ['ad-es', 'Saludos desde Islandia'],
                ['ad-zh', '来自冰岛的问候']].map(([f, cap]) => (
                <figure key={f} className="m-0">
                  <img src={`/fuzzy/${f}.webp`} alt={cap} className="block h-auto w-full"
                       loading="lazy" decoding="async" />
                  <figcaption className="reg mt-2" style={{ letterSpacing: '.08em' }}>{cap}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- retailers */}
        <section id="soluadilar" className="py-20">
          <div className="fz-wrap">
            <p className="reg" data-rv>Söluaðilar</p>
            <Words text="Fæst hjá tíu verslunum" as="h2" className="fz-h2 mt-4" />
            <ul data-rv className="fz-rv mt-8">
              {RETAILERS.map((r) => (
                <li key={r.name} className="fz-row">
                  <span className="text-[15px] font-semibold">{r.name}</span>
                  <span className="text-[15px]" style={{ color: MUTE }}>{r.addr}</span>
                  <a href={`tel:${r.tel.replace(/\s/g, '')}`} className={`fz-link reg ${FOCUS}`}
                     style={{ color: INK, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>{r.tel}</a>
                </li>
              ))}
            </ul>
            <p data-rv className="fz-rv mt-10 fz-lead text-[15px]">{LAMPS.title}. {LAMPS.body}</p>
          </div>
        </section>

        {/* --------------------------------------------------------- contact */}
        <section id="samband" className="pb-28 pt-20" style={{ background: WELL }}>
          <div className="fz-wrap">
            <p className="reg" data-rv>Samband</p>
            <Words text="Sérsmíði og fyrirspurnir" as="h2" className="fz-h2 mt-4" />
            <p data-rv className="fz-rv fz-lead mt-6">
              Sigurður Már tekur við fyrirspurnum í síma. Kollurinn kemur í sérhönnuðum kassa,
              {' '}{SPEC.dims}, sem hentar til sendinga innanlands og utan.
            </p>
            <p data-rv className="fz-rv mt-8 flex flex-wrap gap-4">
              {BRAND.phones.map((p, i) => (
                <a key={p} href={`tel:${p.replace(/\D/g, '')}`}
                   className={`fz-ib ${i === 0 ? 'fz-ib--solid' : ''} ${FOCUS}`}>{p}</a>
              ))}
            </p>
            <p className="reg mt-10" style={{ letterSpacing: '.08em' }}>
              {BRAND.legal} · {BRAND.address} · kt. {BRAND.kt} · skráð {BRAND.founded}
            </p>
          </div>
        </section>
      </main>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
