import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Btn, C, Chapter, CSS, Cursor, Header, Intro, Label, LineField, Reveal, StickyBar, Words, step, useInview, useScrollFx } from './ui'
import { CONTACT, PHOTO_CREDIT, TEXTI, VERK } from './data'
import { Media } from './Page'

const company = getPreviewCompany('treborg')

/* The reference's project template, carrying only what Tréborg publishes: the
   job, where it is when that is certain, the partners their own caption names,
   and the photographs their gallery shows of it. No invented case-study prose. */
const CSS_VERK = `
.tre-vhero{position:relative;min-height:72svh;display:flex;align-items:flex-end;overflow:hidden;color:#fff}
.tre-vhero .bg{position:absolute;inset:-8% 0;height:116%}
.tre-vhero .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(22,25,27,.8),rgba(22,25,27,.15) 60%,rgba(22,25,27,.45));z-index:1}
.tre-vhero .in{position:relative;z-index:2;padding:0 var(--gut) calc(var(--band) / 1.6);width:100%}
.tre-vhero .tags{display:flex;gap:.5em;margin-top:1em}
.tre-vintro{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col)}
@media (max-width:900px){.tre-vintro{grid-template-columns:1fr;gap:1rem}}
.tre-vgal{display:grid;grid-template-columns:1fr 1fr;gap:var(--col)}
.tre-vgal .tre-media{aspect-ratio:3 / 2}
.tre-vgal .wide{grid-column:1 / -1;aspect-ratio:16 / 9}
/* a leftover odd picture takes the whole row but only half its width, so the
   grid never shows an empty cell next to it */
.tre-vgal .single{grid-column:1 / -1;max-width:calc(50% - var(--col) / 2)}
.tre-vgal .tall{aspect-ratio:2 / 3}
@media (max-width:760px){.tre-vgal{grid-template-columns:1fr}.tre-vgal .tre-media,.tre-vgal .wide{aspect-ratio:4 / 3}
  /* one column on a phone: a lone picture takes the full width, and an upright
     one keeps an upright frame instead of being cut to a letterbox */
  .tre-vgal .single{max-width:none}.tre-vgal .tall{aspect-ratio:3 / 4}}
.tre-vnext{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--col)}
@media (max-width:760px){.tre-vnext{grid-template-columns:1fr;gap:2rem}}
.tre-vnext .tre-media{aspect-ratio:3 / 2}
.tre-vnext h3{margin-top:.6em}
.tre-back{display:inline-flex;align-items:center;gap:.5em;font-size:var(--t-label);text-transform:uppercase;
  letter-spacing:.06em;font-weight:600;opacity:.7}
.tre-back:hover{opacity:1}
`

export default function TreborgProject() {
  const { slug } = useParams()
  const verk = VERK.find((v) => v.slug === slug)
  useScrollFx()
  const heroRef = useInview<HTMLDivElement>()

  useEffect(() => {
    if (!verk) return
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = `${verk.name} | Tréborg ehf.`
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

  if (!verk) return <Navigate to="/preview/treborg" replace />

  /* the next two jobs in order, wrapping, so every page leads on and all
     ten are reachable from any one of them */
  const at = VERK.indexOf(verk)
  const others = [VERK[(at + 1) % VERK.length], VERK[(at + 2) % VERK.length]]
  const [first, ...rest] = verk.gallery
  const firstW = Number(first.ratio.split('/')[0])
  /* landscapes first, then portraits, so rows pair by shape; a leftover picture
     takes a half-width row of its own rather than leaving an empty cell */
  const land = rest.filter((p) => !p.portrait)
  const port = rest.filter((p) => p.portrait)
  /* a job with one photograph shows it once more without the hero's veil:
     full width when it is a landscape wide enough to carry it, a half-width
     portrait frame when it was taken upright (most of Tréborg's are) */
  const gallery = rest.length === 0 ? [{ p: first, cls: first.portrait ? 'single tall' : firstW >= 1500 ? 'wide' : 'single' }] : [
    ...land.map((p, i) => ({ p, cls: land.length % 2 === 1 && i === land.length - 1 ? 'single' : '' })),
    ...port.map((p, i) => ({ p, cls: port.length % 2 === 1 && i === port.length - 1 ? 'single tall' : 'tall' })),
  ]

  return (
    <div className="tre-root">
      <style>{CSS}{CSS_VERK}</style>
      <PreviewChrome company={company} />
      <Intro />
      <Cursor />
      <Header light />
      <StickyBar />

      <main id="efni">
        <div className="tre-vhero" ref={heroRef}>
          <div className="bg" data-speed={-2}>
            <img
              src={first.src} srcSet={first.srcSet} sizes="100vw" alt={first.alt}
              width={firstW} height={Number(first.ratio.split('/')[1])}
              // @ts-expect-error fetchpriority is valid HTML, React types lag
              fetchpriority="high"
            />
          </div>
          <div className="veil" />
          <div className="in">
            <Label>Verkefni</Label>
            <Words tag="h1" className="tre-big" text={verk.name} hold={0.3} />
            <div className="tags tre-rise" style={step(2)}>
              <span className="tre-tag" style={{ opacity: 0.8 }}>{verk.flokkur}</span>
              {verk.stadur ? <span className="tre-tag" style={{ opacity: 0.8 }}>{verk.stadur}</span> : null}
            </div>
          </div>
        </div>

        <div className="tre-band paper">
          <section>
            <div className="tre-wrap">
              <Reveal className="tre-vintro">
                <Chapter n="1.0" />
                <div>
                  <Label>Verkið</Label>
                  <Words tag="h2" className="tre-normal" text={verk.lina} />
                  <p className="tre-rise" style={{ ...step(3), marginTop: '1.4em', maxWidth: '58ch' }}>{TEXTI.verkefniIntro}</p>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        {gallery.length > 0 ? (
        <div className="tre-band white">
          <section>
            <div className="tre-wrap">
              <Reveal className="tre-vgal">
                {gallery.map(({ p, cls }) => (
                  <Media
                    key={p.src}
                    photo={p}
                    className={`tre-rise ${cls}`}
                    sizes="(max-width:760px) 100vw, 44vw"
                  />
                ))}
              </Reveal>
            </div>
          </section>
        </div>
        ) : null}

        <div className="tre-band paper">
          <section style={{ position: 'relative' }}>
            <LineField top="0" height={320} seed={5} />
            <div className="tre-wrap" style={{ position: 'relative', zIndex: 1 }}>
              <Reveal>
                <h2 className="tre-label"><svg className="tre-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg><span>Fleiri verk</span></h2>
                <div className="tre-vnext" style={{ marginTop: '2rem' }}>
                  {others.map((v, i) => (
                    <article key={v.slug} className="tre-rise" style={step(i + 1)}>
                      <Link to={`/preview/treborg/verk/${v.slug}`} data-cursor="card" aria-label={v.stadur ? `${v.name}, ${v.flokkur.toLowerCase()}, ${v.stadur}` : `${v.name}, ${v.flokkur.toLowerCase()}`}>
                        <Media photo={v.cover} sizes="(max-width:760px) 100vw, 44vw" />
                        <h3 className="tre-smallt">{v.name}</h3>
                        <p className="tre-tag" style={{ display: 'inline-block', marginTop: '.6em' }}>{v.stadur ?? v.flokkur}</p>
                      </Link>
                    </article>
                  ))}
                </div>
                <p style={{ marginTop: '2.4rem' }}>
                  <Link className="tre-back" to="/preview/treborg">Til baka á forsíðu</Link>
                </p>
              </Reveal>
            </div>
          </section>
        </div>

        <div className="tre-band dark">
          <section>
            <div className="tre-wrap">
              <Reveal>
                <Label>Hafa samband</Label>
                <Words tag="h2" className="tre-normal" text={TEXTI.metnadur} />
                <div className="tre-rise" style={{ ...step(3), display: 'flex', gap: '.8rem', flexWrap: 'wrap', marginTop: '1.8rem' }}>
                  <Btn href={`mailto:${CONTACT.netfang}`} variant="light">{CONTACT.netfang}</Btn>
                  <Btn href={CONTACT.simiHref} variant="light">{CONTACT.simi}</Btn>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <footer className="tre-foot">
          <div className="tre-wrap">
            <div className="fine">
              <p>{PHOTO_CREDIT}</p>
              <p>&copy; {new Date().getFullYear()} Tréborg ehf.</p>
            </div>
          </div>
        </footer>
      </main>

      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
