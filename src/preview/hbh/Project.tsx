import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Btn, C, Chapter, CSS, Cursor, Header, Intro, Label, LineField, Reveal, StickyBar, Words, step, useInview, useScrollFx } from './ui'
import { CONTACT, PHOTO_CREDIT, TEXTI, VERK } from './data'
import { Media } from './Page'

const company = getPreviewCompany('hbh')

/* The reference's project template, carrying only what HBH publishes: the job,
   where it is, and their own photographs of it. No invented case-study prose. */
const CSS_VERK = `
.hbh-vhero{position:relative;min-height:72svh;display:flex;align-items:flex-end;overflow:hidden;color:#fff}
.hbh-vhero .bg{position:absolute;inset:-8% 0;height:116%}
.hbh-vhero .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(5,42,71,.8),rgba(5,42,71,.15) 60%,rgba(5,42,71,.45));z-index:1}
.hbh-vhero .in{position:relative;z-index:2;padding:0 var(--gut) calc(var(--band) / 1.6);width:100%}
.hbh-vhero .tags{display:flex;gap:.5em;margin-top:1em}
.hbh-vintro{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col)}
@media (max-width:900px){.hbh-vintro{grid-template-columns:1fr;gap:1rem}}
.hbh-vgal{display:grid;grid-template-columns:1fr 1fr;gap:var(--col)}
.hbh-vgal .hbh-media{aspect-ratio:3 / 2}
.hbh-vgal .wide{grid-column:1 / -1;aspect-ratio:16 / 9}
/* a leftover odd picture takes the whole row but only half its width, so the
   grid never shows an empty cell next to it */
.hbh-vgal .single{grid-column:1 / -1;max-width:calc(50% - var(--col) / 2)}
.hbh-vgal .tall{aspect-ratio:2 / 3}
@media (max-width:760px){.hbh-vgal{grid-template-columns:1fr}.hbh-vgal .hbh-media,.hbh-vgal .wide{aspect-ratio:4 / 3}}
.hbh-vnext{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--col)}
@media (max-width:760px){.hbh-vnext{grid-template-columns:1fr;gap:2rem}}
.hbh-vnext .hbh-media{aspect-ratio:3 / 2}
.hbh-vnext h3{margin-top:.6em}
.hbh-back{display:inline-flex;align-items:center;gap:.5em;font-size:var(--t-label);text-transform:uppercase;
  letter-spacing:.06em;font-weight:600;opacity:.7}
.hbh-back:hover{opacity:1}
`

export default function HbhProject() {
  const { slug } = useParams()
  const verk = VERK.find((v) => v.slug === slug)
  useScrollFx()
  const heroRef = useInview<HTMLDivElement>()

  useEffect(() => {
    if (!verk) return
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = `${verk.name} | HBH Byggir ehf.`
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

  if (!verk) return <Navigate to="/preview/hbh" replace />

  const others = VERK.filter((v) => v.slug !== verk.slug).slice(0, 2)
  const [first, ...rest] = verk.gallery
  /* landscapes first, then portraits, so rows pair by shape; a leftover picture
     takes a half-width row of its own rather than leaving an empty cell */
  const land = rest.filter((p) => !p.portrait)
  const port = rest.filter((p) => p.portrait)
  const gallery = [
    ...land.map((p, i) => ({ p, cls: land.length % 2 === 1 && i === land.length - 1 ? 'single' : '' })),
    ...port.map((p, i) => ({ p, cls: port.length % 2 === 1 && i === port.length - 1 ? 'single tall' : 'tall' })),
  ]

  return (
    <div className="hbh-root">
      <style>{CSS}{CSS_VERK}</style>
      <PreviewChrome company={company} />
      <Intro />
      <Cursor />
      <Header light />
      <StickyBar />

      <main id="efni">
        <div className="hbh-vhero" ref={heroRef}>
          <div className="bg" data-speed={-2}>
            <img src={first.src} srcSet={first.srcSet} sizes="100vw" alt={first.alt} width={1920} height={1280} />
          </div>
          <div className="veil" />
          <div className="in">
            <Label>Verkefni</Label>
            <Words tag="h1" className="hbh-big" text={verk.name} hold={0.3} />
            <div className="tags hbh-rise" style={step(2)}>
              <span className="hbh-tag" style={{ opacity: 0.8 }}>{verk.flokkur}</span>
              <span className="hbh-tag" style={{ opacity: 0.8 }}>{verk.stadur}</span>
            </div>
          </div>
        </div>

        <div className="hbh-band paper">
          <section>
            <div className="hbh-wrap">
              <Reveal className="hbh-vintro">
                <Chapter n="1.0" />
                <div>
                  <Label>Verkið</Label>
                  <Words tag="h2" className="hbh-normal" text={verk.lina} />
                  <p className="hbh-rise" style={{ ...step(3), marginTop: '1.4em', maxWidth: '58ch' }}>{TEXTI.verkefniIntro}</p>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        {gallery.length > 0 ? (
        <div className="hbh-band white">
          <section>
            <div className="hbh-wrap">
              <Reveal className="hbh-vgal">
                {gallery.map(({ p, cls }) => (
                  <Media
                    key={p.src}
                    photo={p}
                    className={`hbh-rise ${cls}`}
                    sizes="(max-width:760px) 100vw, 44vw"
                  />
                ))}
              </Reveal>
            </div>
          </section>
        </div>
        ) : null}

        <div className="hbh-band paper">
          <section style={{ position: 'relative' }}>
            <LineField top="0" height={320} seed={5} />
            <div className="hbh-wrap" style={{ position: 'relative', zIndex: 1 }}>
              <Reveal>
                <h2 className="hbh-label"><svg className="hbh-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg><span>Fleiri verk</span></h2>
                <div className="hbh-vnext" style={{ marginTop: '2rem' }}>
                  {others.map((v, i) => (
                    <article key={v.slug} className="hbh-rise" style={step(i + 1)}>
                      <Link to={`/preview/hbh/verk/${v.slug}`} data-cursor="card" aria-label={`${v.name}, ${v.flokkur} í ${v.stadur}`}>
                        <Media photo={v.cover} sizes="(max-width:760px) 100vw, 44vw" />
                        <h3 className="hbh-smallt">{v.name}</h3>
                        <p className="hbh-tag" style={{ display: 'inline-block', marginTop: '.6em' }}>{v.stadur}</p>
                      </Link>
                    </article>
                  ))}
                </div>
                <p style={{ marginTop: '2.4rem' }}>
                  <Link className="hbh-back" to="/preview/hbh">Til baka á forsíðu</Link>
                </p>
              </Reveal>
            </div>
          </section>
        </div>

        <div className="hbh-band dark">
          <section>
            <div className="hbh-wrap">
              <Reveal>
                <Label>Hafa samband</Label>
                <Words tag="h2" className="hbh-normal" text={TEXTI.metnadur} />
                <div className="hbh-rise" style={{ ...step(3), display: 'flex', gap: '.8rem', flexWrap: 'wrap', marginTop: '1.8rem' }}>
                  <Btn href={`mailto:${CONTACT.netfang}`} variant="light">{CONTACT.netfang}</Btn>
                  <Btn href={CONTACT.simiHref} variant="light">{CONTACT.simi}</Btn>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <footer className="hbh-foot">
          <div className="hbh-wrap">
            <div className="fine">
              <p>{PHOTO_CREDIT}</p>
              <p>&copy; {new Date().getFullYear()} HBH Byggir ehf.</p>
            </div>
          </div>
        </footer>
      </main>

      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
