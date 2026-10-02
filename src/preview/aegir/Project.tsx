import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { BeforeAfter, TOOLS_CSS } from './Tools'
import { Btn, C, Chapter, CSS, Cursor, Header, Intro, Label, LineField, Reveal, StickyBar, Words, step, useGoto, useInview, useScrollFx } from './ui'
import { CONTACT, PHOTO_CREDIT, TEXTI, VERK, type Verk } from './data'
import { Media } from './Page'

const company = getPreviewCompany('aegir')

/* The reference's project template, carrying only what Seglagerðin publishes: the
   job, where it is when the sign in the photograph or their own page fixes it,
   and the photographs their own pages show of it. No invented case-study prose. */
const CSS_VERK = `
.aeg-vhero{position:relative;min-height:72svh;display:flex;align-items:flex-end;overflow:hidden;color:#fff}
.aeg-vhero .bg{position:absolute;inset:-8% 0;height:116%}
.aeg-vhero .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,42,67,.8),rgba(10,42,67,.15) 60%,rgba(10,42,67,.45));z-index:1}
.aeg-vhero .in{position:relative;z-index:2;padding:0 var(--gut) calc(var(--band) / 1.6);width:100%}
.aeg-vhero .tags{display:flex;gap:.5em;margin-top:1em}
.aeg-vintro{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col)}
@media (max-width:900px){.aeg-vintro{grid-template-columns:1fr;gap:1rem}}
.aeg-vgal{display:grid;grid-template-columns:1fr 1fr;gap:var(--col)}
.aeg-vgal .aeg-media{aspect-ratio:3 / 2}
.aeg-vgal .wide{grid-column:1 / -1;aspect-ratio:16 / 9}
/* a leftover odd picture takes the whole row but only half its width, so the
   grid never shows an empty cell next to it */
.aeg-vgal .single{grid-column:1 / -1;max-width:calc(50% - var(--col) / 2)}
.aeg-vgal .tall{aspect-ratio:2 / 3}
@media (max-width:760px){.aeg-vgal{grid-template-columns:1fr}.aeg-vgal .aeg-media,.aeg-vgal .wide{aspect-ratio:4 / 3}}
.aeg-vnext{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--col)}
@media (max-width:760px){.aeg-vnext{grid-template-columns:1fr;gap:2rem}}
.aeg-vnext .aeg-media{aspect-ratio:3 / 2}
.aeg-vnext h3{margin-top:.6em}
.aeg-back{display:inline-flex;align-items:center;gap:.5em;font-size:var(--t-label);text-transform:uppercase;
  letter-spacing:.06em;font-weight:600;opacity:.7}
.aeg-back:hover{opacity:1}
`

/** the section of the home page that carries the tool for this kind of job */
const sectionFor = (v: Verk) => (v.flokkur === 'Sundlaugar og pottar' || v.flokkur === 'Yfirbreiðslur' ? '#sundlaugar' : v.leid === 'leiga' ? '#tjaldaleiga' : v.leid === 'markisa' ? '#markisur' : '#saumastofa')
const sectionLabel = (v: Verk) => (v.flokkur === 'Sundlaugar og pottar' || v.flokkur === 'Yfirbreiðslur' ? 'Sundlaugar og pottar' : v.leid === 'leiga' ? 'Tjaldaleigan' : v.leid === 'markisa' ? 'Markísur og skyggni' : 'Saumastofan')

export default function AegirProject() {
  const { slug } = useParams()
  const goto = useGoto()
  const verk = VERK.find((v) => v.slug === slug)
  useScrollFx()
  const heroRef = useInview<HTMLDivElement>()

  useEffect(() => {
    if (!verk) return
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = `${verk.name} | Seglagerðin Ægir ehf.`
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', verk.lina)
    setThemeColor(C.paper)
    window.scrollTo(0, 0)
    return () => {
      document.title = prevTitle
      document.documentElement.lang = prevLang
      meta?.setAttribute('content', prevDesc)
    }
  }, [verk])

  if (!verk) return <Navigate to="/preview/aegir" replace />

  /* the next two jobs in order, wrapping, so every page leads on and all
     all are reachable from any one of them */
  const at = VERK.indexOf(verk)
  const others = [VERK[(at + 1) % VERK.length], VERK[(at + 2) % VERK.length]]
  const [first, ...rest] = verk.gallery
  const firstW = Number(first.ratio.split('/')[0])
  /* landscapes first, then portraits, so rows pair by shape; a leftover picture
     takes a half-width row of its own rather than leaving an empty cell */
  const land = rest.filter((p) => !p.portrait)
  const port = rest.filter((p) => p.portrait)
  /* a job with one photograph shows it once more without the hero's veil,
     full width only when the file is wide enough to carry it */
  const gallery = rest.length === 0 ? [{ p: first, cls: firstW >= 1500 ? 'wide' : 'single' }] : [
    ...land.map((p, i) => ({ p, cls: land.length % 2 === 1 && i === land.length - 1 ? 'single' : '' })),
    ...port.map((p, i) => ({ p, cls: port.length % 2 === 1 && i === port.length - 1 ? 'single tall' : 'tall' })),
  ]

  return (
    <div className="aeg-root">
      <style>{CSS}{CSS_VERK}{TOOLS_CSS}</style>
      <PreviewChrome company={company} />
      <Intro />
      <Cursor />
      <Header light />
      <StickyBar />

      <main id="efni">
        <div className="aeg-vhero" ref={heroRef}>
          <div className="bg" data-speed={-2}>
            <img src={first.src} srcSet={first.srcSet} sizes="100vw" alt={first.alt} width={firstW} height={Number(first.ratio.split('/')[1])} />
          </div>
          <div className="veil" />
          <div className="in">
            <Label>Verkefni</Label>
            <Words tag="h1" className="aeg-big" text={verk.name} hold={0.3} />
            <div className="tags aeg-rise" style={step(2)}>
              <span className="aeg-tag" style={{ opacity: 0.8 }}>{verk.flokkur}</span>
              {verk.stadur ? <span className="aeg-tag" style={{ opacity: 0.8 }}>{verk.stadur}</span> : null}
            </div>
          </div>
        </div>

        <div className="aeg-band paper">
          <section>
            <div className="aeg-wrap">
              <Reveal className="aeg-vintro">
                <Chapter n="1.0" />
                <div>
                  <Label>Verkið</Label>
                  <Words tag="h2" className="aeg-normal" text={verk.lina} />
                  {verk.texti ? <p className="aeg-rise" style={{ ...step(3), marginTop: '1.4em', maxWidth: '58ch' }}>{verk.texti}</p> : null}
                  <div className="aeg-rise" style={{ ...step(4), marginTop: '1.8em', display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
                    <Btn href={sectionFor(verk)} variant="brand" onClick={() => goto(sectionFor(verk))}>{sectionLabel(verk)}</Btn>
                    <Btn href="#hafa-samband" variant="ghost" onClick={() => goto('#hafa-samband')}>Biðja um tilboð</Btn>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        {verk.pair ? (
          <div className="aeg-band dark">
            <section>
              <div className="aeg-wrap">
                <Reveal>
                  <BeforeAfter only={verk.pair} />
                </Reveal>
              </div>
            </section>
          </div>
        ) : gallery.length > 0 ? (
        <div className="aeg-band white">
          <section>
            <div className="aeg-wrap">
              <Reveal className="aeg-vgal">
                {gallery.map(({ p, cls }) => (
                  <Media
                    key={p.src}
                    photo={p}
                    className={`aeg-rise ${cls}`}
                    sizes="(max-width:760px) 100vw, 44vw"
                  />
                ))}
              </Reveal>
            </div>
          </section>
        </div>
        ) : null}

        <div className="aeg-band paper">
          <section style={{ position: 'relative' }}>
            <LineField top="0" height={320} seed={5} />
            <div className="aeg-wrap" style={{ position: 'relative', zIndex: 1 }}>
              <Reveal>
                <h2 className="aeg-label"><svg className="aeg-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg><span>Fleiri verk</span></h2>
                <div className="aeg-vnext" style={{ marginTop: '2rem' }}>
                  {others.map((v, i) => (
                    <article key={v.slug} className="aeg-rise" style={step(i + 1)}>
                      <Link to={`/preview/aegir/verk/${v.slug}`} data-cursor="card" aria-label={v.stadur ? `${v.name}, ${v.flokkur.toLowerCase()}, ${v.stadur}` : `${v.name}, ${v.flokkur.toLowerCase()}`}>
                        <Media photo={v.cover} sizes="(max-width:760px) 100vw, 44vw" />
                        <h3 className="aeg-smallt">{v.name}</h3>
                        <p className="aeg-tag" style={{ display: 'inline-block', marginTop: '.6em' }}>{v.stadur ?? v.flokkur}</p>
                      </Link>
                    </article>
                  ))}
                </div>
                <p style={{ marginTop: '2.4rem' }}>
                  <Link className="aeg-back" to="/preview/aegir">Til baka á forsíðu</Link>
                </p>
              </Reveal>
            </div>
          </section>
        </div>

        <div className="aeg-band dark">
          <section>
            <div className="aeg-wrap">
              <Reveal>
                <Label>Hafa samband</Label>
                <Words tag="h2" className="aeg-normal" text={TEXTI.metnadur} />
                <div className="aeg-rise" style={{ ...step(3), display: 'flex', gap: '.8rem', flexWrap: 'wrap', marginTop: '1.8rem' }}>
                  <Btn href="#hafa-samband" variant="light" onClick={() => goto('#hafa-samband')}>Biðja um tilboð</Btn>
                  <Btn href={CONTACT.simiHref} variant="light">{CONTACT.simi}</Btn>
                  <Btn href={`mailto:${CONTACT.netfang}`} variant="light">{CONTACT.netfang}</Btn>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <footer className="aeg-foot">
          <div className="aeg-wrap">
            <div className="fine">
              <p>{PHOTO_CREDIT}</p>
              <p>&copy; {new Date().getFullYear()} Seglagerðin Ægir ehf.</p>
            </div>
          </div>
        </footer>
      </main>

      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
