import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { BriefProvider, TOOLS_CSS } from './Tools'
import { ASSIST_CSS, Assistant } from './Assistant'
import { Btn, C, Chapter, CSS, Cursor, Header, Intro, Label, LineField, Reveal, StickyBar, Words, step, useGoto, useInview, useRouteScroll, useScrollFx } from './ui'
import { CONTACT, KLASAR, PHOTO_CREDIT, VERK, starfsmadur, type Verk } from './data'
import { Media } from './Page'

const company = getPreviewCompany('reykjafell')

/* The reference's project template, carrying only what Reykjafell publishes: the
   job as their own news tells it, where and when, and the pictures that news
   carries. No invented case-study prose; the news itself is linked. */
const CSS_VERK = `
.rfl-vhero{position:relative;min-height:72svh;display:flex;align-items:flex-end;overflow:hidden;color:#fff}
.rfl-vhero .bg{position:absolute;inset:-8% 0;height:116%}
.rfl-vhero .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(7,43,63,.8),rgba(7,43,63,.15) 60%,rgba(7,43,63,.45));z-index:1}
.rfl-vhero .in{position:relative;z-index:2;padding:0 var(--gut) calc(var(--band) / 1.6);width:100%}
.rfl-vhero .tags{display:flex;gap:.5em;margin-top:1em}
.rfl-vintro{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col)}
@media (max-width:900px){.rfl-vintro{grid-template-columns:1fr;gap:1rem}}
.rfl-vgal{display:grid;grid-template-columns:1fr 1fr;gap:var(--col)}
.rfl-vgal .rfl-media{aspect-ratio:3 / 2}
.rfl-vgal .wide{grid-column:1 / -1;aspect-ratio:16 / 9}
/* a leftover odd picture takes the whole row but only half its width, so the
   grid never shows an empty cell next to it */
.rfl-vgal .single{grid-column:1 / -1;max-width:calc(50% - var(--col) / 2)}
.rfl-vgal .tall{aspect-ratio:2 / 3}
@media (max-width:760px){.rfl-vgal{grid-template-columns:1fr}.rfl-vgal .rfl-media,.rfl-vgal .wide{aspect-ratio:4 / 3}}
.rfl-vnext{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--col)}
@media (max-width:760px){.rfl-vnext{grid-template-columns:1fr;gap:2rem}}
.rfl-vnext .rfl-media{aspect-ratio:3 / 2}
.rfl-vnext h3{margin-top:.6em}
.rfl-back{display:inline-flex;align-items:center;gap:.5em;font-size:var(--t-label);text-transform:uppercase;
  letter-spacing:.06em;font-weight:600;opacity:.7;min-height:44px}
@media (hover:hover) and (pointer:fine){.rfl-back:hover{opacity:1}}
`

/** the section of the home page that carries the tool for this kind of job */
const klasiAf = (v: Verk) => KLASAR.find((k) => k.id === v.klasi) ?? KLASAR[0]

export default function ReykjafellProject() {
  const { slug } = useParams()
  const goto = useGoto()
  const verk = VERK.find((v) => v.slug === slug)
  useScrollFx()
  useRouteScroll()
  const heroRef = useInview<HTMLDivElement>()

  useEffect(() => {
    if (!verk) return
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = `${verk.name} | Reykjafell ehf.`
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', verk.lina)
    setThemeColor(C.paper)
    return () => {
      document.title = prevTitle
      document.documentElement.lang = prevLang
      meta?.setAttribute('content', prevDesc)
    }
  }, [verk])

  if (!verk) return <Navigate to="/preview/reykjafell" replace />

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
    <div className="rfl-root">
      <style>{CSS}{CSS_VERK}{TOOLS_CSS}{ASSIST_CSS}</style>
      <PreviewChrome company={company} />
      <Intro />
      <Cursor />
      <Header light />
      <StickyBar />

      <main id="efni">
        <div className="rfl-vhero" ref={heroRef}>
          <div className="bg" data-speed={-2}>
            <img src={first.src} srcSet={first.srcSet} sizes="100vw" alt={first.alt} width={firstW} height={Number(first.ratio.split('/')[1])} />
          </div>
          <div className="veil" />
          <div className="in">
            <Label>Verk · {verk.ar}</Label>
            <Words tag="h1" className="rfl-big" text={verk.name} hold={0.3} />
            <div className="tags rfl-rise" style={step(2)}>
              <span className="rfl-tag" style={{ opacity: 0.8 }}>{verk.flokkur}</span>
              {verk.stadur ? <span className="rfl-tag" style={{ opacity: 0.8 }}>{verk.stadur}</span> : null}
            </div>
          </div>
        </div>

        <div className="rfl-band paper">
          <section>
            <div className="rfl-wrap">
              <Reveal className="rfl-vintro">
                <Chapter n="1.0" />
                <div>
                  <Label>Verkið</Label>
                  <Words tag="h2" className="rfl-normal" text={verk.lina} />
                  {verk.texti ? <p className="rfl-rise" style={{ ...step(3), marginTop: '1.4em', maxWidth: '58ch' }}>{verk.texti}</p> : null}
                  <div className="rfl-rise" style={{ ...step(4), marginTop: '1.8em', display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
                    <Btn href="#vorur" variant="brand" onClick={() => goto('#vorur')}>Vörurnar</Btn>
                    <Btn href={verk.frett} variant="ghost">Fréttin á reykjafell.is</Btn>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        {gallery.length > 0 ? (
        <div className="rfl-band white">
          <section>
            <div className="rfl-wrap">
              <Reveal className="rfl-vgal">
                {gallery.map(({ p, cls }) => (
                  <Media
                    key={p.src}
                    photo={p}
                    className={`rfl-rise ${cls}`}
                    sizes="(max-width:760px) 100vw, 44vw"
                  />
                ))}
              </Reveal>
            </div>
          </section>
        </div>
        ) : null}

        <div className="rfl-band paper">
          <section style={{ position: 'relative' }}>
            <LineField top="0" height={320} seed={5} />
            <div className="rfl-wrap" style={{ position: 'relative', zIndex: 1 }}>
              <Reveal>
                <h2 className="rfl-label"><svg className="rfl-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg><span>Fleiri verk</span></h2>
                <div className="rfl-vnext" style={{ marginTop: '2rem' }}>
                  {others.map((v, i) => (
                    <article key={v.slug} className="rfl-rise" style={step(i + 1)}>
                      <Link to={`/preview/reykjafell/verk/${v.slug}`} data-cursor="card" aria-label={v.stadur ? `${v.name}, ${v.flokkur.toLowerCase()}, ${v.stadur}` : `${v.name}, ${v.flokkur.toLowerCase()}`}>
                        <Media photo={v.cover} sizes="(max-width:760px) 100vw, 44vw" />
                        <h3 className="rfl-smallt">{v.name}</h3>
                        <p className="rfl-tag" style={{ display: 'inline-block', marginTop: '.6em' }}>{v.stadur ?? v.flokkur}</p>
                      </Link>
                    </article>
                  ))}
                </div>
                <p style={{ marginTop: '2.4rem' }}>
                  <Link className="rfl-back" to="/preview/reykjafell">Til baka á forsíðu</Link>
                </p>
              </Reveal>
            </div>
          </section>
        </div>

        <div className="rfl-band dark">
          <section>
            <div className="rfl-wrap">
              <Reveal>
                <Label>{klasiAf(verk).titill}</Label>
                <Words tag="h2" className="rfl-normal" text={`${starfsmadur(klasiAf(verk).abyrgd)?.name ?? 'Söludeildin'} svarar um ${klasiAf(verk).titill.toLowerCase()}.`} />
                <div className="rfl-rise" style={{ ...step(3), display: 'flex', gap: '.8rem', flexWrap: 'wrap', marginTop: '1.8rem' }}>
                  <Btn href="#hafa-samband" variant="light" onClick={() => goto('#hafa-samband')}>Senda tilboðsbeiðni</Btn>
                  <Btn href={CONTACT.simiHref} variant="light">{CONTACT.simi}</Btn>
                  <Btn href={`mailto:${starfsmadur(klasiAf(verk).abyrgd)?.email ?? ''}`} variant="light">{starfsmadur(klasiAf(verk).abyrgd)?.email}</Btn>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <footer className="rfl-foot">
          <div className="rfl-wrap">
            <div className="fine">
              <p>{PHOTO_CREDIT}</p>
              <p>&copy; {new Date().getFullYear()} Reykjafell ehf. Allur réttur áskilinn.</p>
            </div>
          </div>
        </footer>
      </main>

      <BriefProvider><Assistant /></BriefProvider>
      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
