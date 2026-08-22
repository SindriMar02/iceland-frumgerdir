import { useEffect, useRef, useState } from 'react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { companyEntry as company } from './company'
import {
  BRAND, SPEC, COLOURWAYS, TIMELINE, RECOGNITION,
  RETAILERS, MAKER, LAMPS, IMAGES, TRIVIA, WORK,
} from './data'

/* ------------------------------------------------------------------ tokens
 * Rebuilt against wakawaka.world, MEASURED rather than eyeballed (2026-08-22):
 * image-area ratio 1.004, 128 images, h2 14px, body 10px. The first build was
 * 0.264 / 6 images / h2 86px, which is a text page with pictures, and Sindri
 * called it correctly. The grammar here is: the work fills the page, the type
 * whispers, and there is exactly one display moment.
 *
 * The ground is paper, not the dark slab of the first attempt. It comes from
 * their own five-language advertisement, printed white with a magenta banner,
 * and MAGENTA below is sampled out of that artwork rather than chosen.
 */

const PAPER = '#EDE9E2'
const CARD = '#F7F4EF'
const INK = '#17140F'
const MUTE = '#635C54'
const MAGENTA = '#872684'

const SANS = "'Schibsted Grotesk', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, monospace"

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

const CSS = `
.fz-root{background:var(--fz-ground,${PAPER});color:${INK};font-family:${SANS};
  font-size:13px;line-height:1.5;transition:background-color 600ms cubic-bezier(.22,1,.36,1);
  overflow-x:clip}
.fz-root ::selection{background:${MAGENTA};color:#fff}
.fz-bleed > *{position:relative}

.fz-lab{font-family:${MONO};font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:${MUTE}}
.fz-cap{font-family:${MONO};font-size:10px;letter-spacing:.04em;color:${MUTE};line-height:1.45}
.fz-anchor{font-size:clamp(26px,3.4vw,40px);line-height:1.16;letter-spacing:-.025em;font-weight:600}
.fz-sub{font-size:13px;line-height:1.6;color:${MUTE}}

.fz-rv{opacity:0;transform:translateY(14px);
  transition:opacity 620ms cubic-bezier(.16,1,.3,1),transform 620ms cubic-bezier(.16,1,.3,1)}
.fz-in.fz-rv,.fz-in .fz-rv{opacity:1;transform:none}

/* THE INDEX. Twelve columns, every item a different span, so the page reads as
   a wall of work rather than a stack of sections. */
.fz-index{display:grid;grid-template-columns:repeat(12,1fr);gap:10px}
.fz-item{grid-column:span 12;margin:0}
@media (min-width:760px){.fz-item{grid-column:span var(--sp,6)}}
.fz-item img{display:block;width:100%;height:auto;background:${CARD};
  transition:filter 460ms ease,transform 560ms cubic-bezier(.16,1,.3,1)}
.fz-item figcaption{margin-top:7px}
@media (hover:hover) and (pointer:fine){
  @media (prefers-reduced-motion:no-preference){
    .fz-index:hover .fz-item img{filter:grayscale(.4) brightness(.93)}
    .fz-item:hover img{filter:none;transform:scale(1.012)}
  }
}

.fz-strip{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(126px,1fr);
  gap:8px;overflow-x:auto;scroll-snap-type:x proximity}
.fz-chip{border:1px solid rgba(23,20,15,.16);background:${CARD};padding:9px 12px;
  display:flex;align-items:center;gap:9px;min-height:44px;
  transition:border-color 180ms ease,transform 160ms ease}
.fz-chip:active{transform:scale(.985)}
.fz-chip[aria-pressed="true"]{border-color:${MAGENTA};box-shadow:inset 0 0 0 1px ${MAGENTA}}

.fz-row{display:grid;gap:6px;padding:10px 0;border-top:1px solid rgba(23,20,15,.14)}
@media (min-width:700px){.fz-row{grid-template-columns:minmax(160px,.8fr) 1.6fr auto;gap:18px;align-items:baseline}}
.fz-link{position:relative;display:inline-block}
.fz-link::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:1px;
  background:currentColor;transform:scaleX(0);transform-origin:left;
  transition:transform 190ms cubic-bezier(.16,1,.3,1)}
.fz-link:hover::after,.fz-link:focus-visible::after{transform:scaleX(1)}
.fz-btn{transition:background-color 170ms ease,transform 150ms ease}
.fz-btn:active{transform:scale(.985)}

@media (prefers-reduced-motion:reduce){
  .fz-rv{opacity:1;transform:none;transition:none}
  .fz-item img{transition:none}
  .fz-index:hover .fz-item img{filter:none}
}
`

export default function FuzzyPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [colour, setColour] = useState<(typeof COLOURWAYS)[number]>(COLOURWAYS[0])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-rv]'))
    if (reduce) { targets.forEach((t) => t.classList.add('fz-in')); return }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('fz-in'); io.unobserve(e.target) }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="fz-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="sticky top-0 z-30 px-4 py-3 sm:px-6"
              style={{ background: PAPER, borderBottom: '1px solid rgba(23,20,15,.14)' }}>
        <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-6">
          <a href="#top" className={`fz-lab ${FOCUS}`}
             style={{ color: INK, fontWeight: 700, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
            FUZZY · MÓDEL-HÚSGÖGN
          </a>
          <nav className="hidden gap-6 sm:flex" aria-label="Valmynd">
            {[['Verkin', '#verkin'], ['Kollurinn', '#kollurinn'], ['Söluaðilar', '#soluadilar']].map(([l, h]) => (
              <a key={h} href={h} className={`fz-link fz-lab ${FOCUS}`}
                 style={{ color: INK, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>{l}</a>
            ))}
          </nav>
          <a href={`tel:${BRAND.phones[1].replace(/\D/g, '')}`} className={`fz-link fz-lab ${FOCUS}`}
             style={{ color: MAGENTA, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
            {BRAND.phones[1]}
          </a>
        </div>
      </header>

      <main id="top">
        <section className="px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14" aria-labelledby="h1">
          <div className="mx-auto max-w-[1560px]">
            <div data-rv className="fz-rv grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-14">
              <div className="self-end">
                <p className="fz-lab">Reykjavík · síðan 1972</p>
                <h1 id="h1" className="fz-anchor mt-4" style={{ maxWidth: '19ch' }}>
                  Sami maðurinn hefur smíðað hvern einasta koll síðan 1972.
                </h1>
                <p className="fz-sub mt-5" style={{ maxWidth: '44ch' }}>
                  Fuzzy er lítill íslenskur gærukollur. Sigurður Már hannaði hann 1972
                  og smíðar hann enn sjálfur í bílskúrnum sínum.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a href="#verkin" className={`fz-btn fz-lab inline-flex items-center justify-center px-6 ${FOCUS}`}
                     style={{ background: MAGENTA, color: '#fff', minHeight: 44 }}>Sjá verkin</a>
                  <span className="fz-cap">{SPEC.dims} · {SPEC.weight}</span>
                </div>
              </div>
              <figure className="m-0">
                <img src={IMAGES.bench} width={1280} height={853} loading="eager" decoding="async"
                     alt="Sigurður Már Helgason rennur viðarfætur í bílskúrnum sínum."
                     className="block h-auto w-full" />
                <figcaption className="fz-cap mt-2">
                  Bílskúrinn í Reykjavík. Hver einasti Fuzzy er smíðaður hér.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="verkin" className="scroll-mt-14 px-4 pb-16 sm:px-6" aria-label="Verkin">
          <div className="mx-auto max-w-[1560px]">
            <div className="fz-index" data-rv>
              {WORK.map((w) => (
                <figure key={w.src} className="fz-item" style={{ ['--sp' as string]: w.span }}>
                  <img src={`/fuzzy/${w.src}.webp`} loading="lazy" decoding="async"
                       alt={w.cap} className="h-auto w-full" />
                  <figcaption className="fz-cap">{w.cap}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="kollurinn" className="scroll-mt-14 px-4 py-14 sm:px-6"
                 style={{ borderTop: '1px solid rgba(23,20,15,.14)' }} aria-labelledby="k-h">
          <div className="mx-auto max-w-[1560px]">
            <p className="fz-lab" id="k-h">Kollurinn</p>
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
              <div data-rv className="fz-rv">
                <img src={IMAGES.range} srcSet={`${IMAGES.rangeSm} 1200w, ${IMAGES.range} 2400w`}
                     sizes="(max-width:900px) 100vw, 60vw" width={2400} height={992}
                     alt="Fimm Fuzzy kollar í ólíkum gærulitum ásamt kassanum."
                     className="h-auto w-full" loading="lazy" decoding="async" />
                <div className="fz-strip mt-4" role="group" aria-label="Veldu gærulit">
                  {COLOURWAYS.map((c) => (
                    <button key={c.id} type="button" onClick={() => setColour(c)}
                            aria-pressed={c.id === colour.id} className={`fz-chip ${FOCUS}`}>
                      <span aria-hidden="true" style={{ width: 14, height: 14, background: c.hex,
                            border: '1px solid rgba(23,20,15,.2)', display: 'inline-block' }} />
                      <span className="fz-lab" style={{ color: c.id === colour.id ? INK : MUTE }}>{c.name}</span>
                    </button>
                  ))}
                </div>
                <p className="fz-cap mt-3" aria-live="polite">
                  {colour.name} · {colour.note} · litur mældur úr þeirra eigin ljósmynd
                </p>
              </div>
              <dl data-rv className="fz-rv m-0">
                {SPEC.rows.map((r) => (
                  <div key={r.k} className="fz-row">
                    <dt className="fz-lab">{r.k}</dt>
                    <dd className="m-0">{r.v}</dd>
                  </div>
                ))}
                <div className="fz-row">
                  <dt className="fz-lab">Vissir þú</dt>
                  <dd className="m-0">{TRIVIA.join(' ')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6" style={{ borderTop: '1px solid rgba(23,20,15,.14)' }}
                 aria-labelledby="m-h">
          <div className="mx-auto grid max-w-[1560px] gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
            <div data-rv className="fz-rv">
              <p className="fz-lab" id="m-h">Hönnuðurinn</p>
              <p className="mt-4 text-[15px] font-semibold">{MAKER.name}</p>
              <p className="fz-cap mt-1">{MAKER.role}</p>
              {MAKER.body.map((b) => (
                <p key={b.slice(0, 18)} className="fz-sub mt-4" style={{ maxWidth: '46ch' }}>{b}</p>
              ))}
              <ul className="mt-7 grid gap-1">
                {RECOGNITION.map((r) => <li key={r} className="fz-cap">{r}</li>)}
              </ul>
            </div>
            <ol data-rv className="fz-rv m-0">
              {TIMELINE.map((t) => (
                <li key={t.year} className="fz-row">
                  <span className="fz-lab" style={{ color: MAGENTA }}>{t.year}</span>
                  <span>
                    <span className="font-semibold">{t.title}.</span>{' '}
                    <span style={{ color: MUTE }}>{t.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6" style={{ borderTop: '1px solid rgba(23,20,15,.14)' }}
                 aria-labelledby="l-h">
          <div className="mx-auto max-w-[1560px]">
            <p className="fz-lab" id="l-h">{LAMPS.title}</p>
            <p data-rv className="fz-rv fz-sub mt-4" style={{ maxWidth: '70ch' }}>{LAMPS.body}</p>
          </div>
        </section>

        <section id="soluadilar" className="scroll-mt-14 px-4 py-14 sm:px-6"
                 style={{ borderTop: '1px solid rgba(23,20,15,.14)' }} aria-labelledby="r-h">
          <div className="mx-auto max-w-[1560px]">
            <p className="fz-lab" id="r-h">Fæst hjá tíu verslunum</p>
            <ul data-rv className="fz-rv mt-6">
              {RETAILERS.map((r) => (
                <li key={r.name} className="fz-row">
                  <span className="font-semibold">{r.name}</span>
                  <span style={{ color: MUTE }}>{r.addr}</span>
                  <a href={`tel:${r.tel.replace(/\s/g, '')}`} className={`fz-link fz-cap ${FOCUS}`}
                     style={{ color: INK, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
                    {r.tel}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-4 pb-24 pt-14 sm:px-6" style={{ borderTop: '1px solid rgba(23,20,15,.14)' }}
                 aria-labelledby="c-h">
          <div className="mx-auto max-w-[1560px]">
            <p className="fz-lab" id="c-h">Sérsmíði og fyrirspurnir</p>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-8 gap-y-3">
              {BRAND.phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/\D/g, '')}`} className={`fz-link ${FOCUS}`}
                   style={{ color: MAGENTA, fontSize: 22, fontWeight: 600, minHeight: 44,
                            display: 'inline-flex', alignItems: 'center' }}>{p}</a>
              ))}
            </div>
            <p className="fz-cap mt-6">
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
