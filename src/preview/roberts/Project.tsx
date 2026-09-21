import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Btn, C, Chapter, CSS, Cursor, Header, Intro, Label, LineField, Reveal, StickyBar, Words, step, useInview, useScrollFx } from './ui'
import { CONTACT, PHOTO_CREDIT, TEXTI, VERK } from './data'
import { Media } from './Page'

const company = getPreviewCompany('roberts')

/* The reference's project template, carrying only what Róberts publishes: the
   job, where it is when that is certain, and the photographs their own page
   shows of it. No invented case-study prose. */
const CSS_VERK = `
.rob-vhero{position:relative;min-height:72svh;display:flex;align-items:flex-end;overflow:hidden;color:#fff}
.rob-vhero .bg{position:absolute;inset:-8% 0;height:116%}
.rob-vhero .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(30,22,16,.8),rgba(30,22,16,.15) 60%,rgba(30,22,16,.45));z-index:1}
.rob-vhero .in{position:relative;z-index:2;padding:0 var(--gut) calc(var(--band) / 1.6);width:100%}
.rob-vhero .tags{display:flex;gap:.5em;margin-top:1em}
.rob-vintro{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col)}
@media (max-width:900px){.rob-vintro{grid-template-columns:1fr;gap:1rem}}
.rob-vgal{display:grid;grid-template-columns:1fr 1fr;gap:var(--col)}
.rob-vgal .rob-media{aspect-ratio:3 / 2}
.rob-vgal .wide{grid-column:1 / -1;aspect-ratio:16 / 9}
/* a leftover odd picture takes the whole row but only half its width, so the
   grid never shows an empty cell next to it */
.rob-vgal .single{grid-column:1 / -1;max-width:calc(50% - var(--col) / 2)}
.rob-vgal .tall{aspect-ratio:2 / 3}
@media (max-width:760px){.rob-vgal{grid-template-columns:1fr}.rob-vgal .rob-media,.rob-vgal .wide{aspect-ratio:4 / 3}}
.rob-vnext{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--col)}
@media (max-width:760px){.rob-vnext{grid-template-columns:1fr;gap:2rem}}
.rob-vnext .rob-media{aspect-ratio:3 / 2}
.rob-vnext h3{margin-top:.6em}
.rob-back{display:inline-flex;align-items:center;gap:.5em;font-size:var(--t-label);text-transform:uppercase;
  letter-spacing:.06em;font-weight:600;opacity:.7}
.rob-back:hover{opacity:1}
`

export default function RobertsProject() {
  const { slug } = useParams()
  const verk = VERK.find((v) => v.slug === slug)
  useScrollFx()
  const heroRef = useInview<HTMLDivElement>()

  useEffect(() => {
    if (!verk) return
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = `${verk.name} | Trésmíði Róberts ehf.`
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

  if (!verk) return <Navigate to="/preview/roberts" replace />

  /* the next two jobs in order, wrapping, so every page leads on and all
     seventeen are reachable from any one of them */
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
    <div className="rob-root">
      <style>{CSS}{CSS_VERK}</style>
      <PreviewChrome company={company} />
      <Intro />
      <Cursor />
      <Header light />
      <StickyBar />

      <main id="efni">
        <div className="rob-vhero" ref={heroRef}>
          <div className="bg" data-speed={-2}>
            <img src={first.src} srcSet={first.srcSet} sizes="100vw" alt={first.alt} width={firstW} height={Number(first.ratio.split('/')[1])} />
          </div>
          <div className="veil" />
          <div className="in">
            <Label>Verkefni</Label>
            <Words tag="h1" className="rob-big" text={verk.name} hold={0.3} />
            <div className="tags rob-rise" style={step(2)}>
              <span className="rob-tag" style={{ opacity: 0.8 }}>{verk.flokkur}</span>
              {verk.stadur ? <span className="rob-tag" style={{ opacity: 0.8 }}>{verk.stadur}</span> : null}
            </div>
          </div>
        </div>

        <div className="rob-band paper">
          <section>
            <div className="rob-wrap">
              <Reveal className="rob-vintro">
                <Chapter n="1.0" />
                <div>
                  <Label>Verkið</Label>
                  <Words tag="h2" className="rob-normal" text={verk.lina} />
                  <p className="rob-rise" style={{ ...step(3), marginTop: '1.4em', maxWidth: '58ch' }}>{TEXTI.verkefniIntro}</p>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        {gallery.length > 0 ? (
        <div className="rob-band white">
          <section>
            <div className="rob-wrap">
              <Reveal className="rob-vgal">
                {gallery.map(({ p, cls }) => (
                  <Media
                    key={p.src}
                    photo={p}
                    className={`rob-rise ${cls}`}
                    sizes="(max-width:760px) 100vw, 44vw"
                  />
                ))}
              </Reveal>
            </div>
          </section>
        </div>
        ) : null}

        <div className="rob-band paper">
          <section style={{ position: 'relative' }}>
            <LineField top="0" height={320} seed={5} />
            <div className="rob-wrap" style={{ position: 'relative', zIndex: 1 }}>
              <Reveal>
                <h2 className="rob-label"><svg className="rob-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg><span>Fleiri verk</span></h2>
                <div className="rob-vnext" style={{ marginTop: '2rem' }}>
                  {others.map((v, i) => (
                    <article key={v.slug} className="rob-rise" style={step(i + 1)}>
                      <Link to={`/preview/roberts/verk/${v.slug}`} data-cursor="card" aria-label={v.stadur ? `${v.name}, ${v.flokkur.toLowerCase()}, ${v.stadur}` : `${v.name}, ${v.flokkur.toLowerCase()}`}>
                        <Media photo={v.cover} sizes="(max-width:760px) 100vw, 44vw" />
                        <h3 className="rob-smallt">{v.name}</h3>
                        <p className="rob-tag" style={{ display: 'inline-block', marginTop: '.6em' }}>{v.stadur ?? v.flokkur}</p>
                      </Link>
                    </article>
                  ))}
                </div>
                <p style={{ marginTop: '2.4rem' }}>
                  <Link className="rob-back" to="/preview/roberts">Til baka á forsíðu</Link>
                </p>
              </Reveal>
            </div>
          </section>
        </div>

        <div className="rob-band dark">
          <section>
            <div className="rob-wrap">
              <Reveal>
                <Label>Hafa samband</Label>
                <Words tag="h2" className="rob-normal" text={TEXTI.metnadur} />
                <div className="rob-rise" style={{ ...step(3), display: 'flex', gap: '.8rem', flexWrap: 'wrap', marginTop: '1.8rem' }}>
                  <Btn href={`mailto:${CONTACT.netfang}`} variant="light">{CONTACT.netfang}</Btn>
                  <Btn href={CONTACT.simiHref} variant="light">{CONTACT.simi}</Btn>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <footer className="rob-foot">
          <div className="rob-wrap">
            <div className="fine">
              <p>{PHOTO_CREDIT}</p>
              <p>&copy; {new Date().getFullYear()} Trésmíði Róberts ehf.</p>
            </div>
          </div>
        </footer>
      </main>

      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
