import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ArrowButton, Btn, C, Chapter, CSS, Cursor, Header, Label, LineField, Reveal, StickyBar,
  Intro, Words, reduced, step, useInview, useScrollFx,
} from './ui'
import { CONTACT, JSON_LD, MARKMID, PHOTO, PHOTO_CREDIT, TEYMI, TEXTI, THJONUSTA, VERK_GRID, VERK_ONNUR, type Photo } from './data'

const company = getPreviewCompany('roberts')

/* Blocks that only the home page uses. Everything shared lives in ui.tsx. */
const PAGE_CSS = `
.rob-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;color:#fff}
.rob-hero .bg{position:absolute;inset:-10% 0 0;height:120%}
.rob-hero .bg img{filter:saturate(.92)}
.rob-hero .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(30,22,16,.9),rgba(30,22,16,.66) 45%,rgba(30,22,16,.38) 75%,rgba(30,22,16,.5));z-index:1}
/* a second, shorter scrim under the type block: white display copy has to clear AA
   over the brightest pixels of the photograph, not just its average */
.rob-hero .veil2{position:absolute;inset:auto 0 0 0;height:72%;z-index:1;
  background:linear-gradient(to top,rgba(24,18,13,.94) 12%,rgba(24,18,13,.74) 46%,rgba(24,18,13,0))}
.rob-hero .top{position:relative;z-index:2;padding:0 var(--gut) calc(var(--band) / 2)}
.rob-hero h1{max-width:16ch;margin-top:.5em}
.rob-hero .base{position:relative;z-index:2;padding:calc(var(--band) / 2) var(--gut) calc(var(--band) / 1.6);
  border-top:1px solid rgba(255,255,255,.25);display:grid;grid-template-columns:1.1fr 1.4fr auto;gap:var(--col);align-items:start}
@media (max-width:900px){.rob-hero .base{grid-template-columns:1fr;gap:1.4rem}.rob-hero h1{max-width:none}}

.rob-about{position:relative}
.rob-about .top,.rob-culture .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);position:relative;z-index:1}
.rob-about .btm .rob-media{aspect-ratio:3 / 4}
.rob-about .btm{display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:var(--col);margin-top:calc(var(--band) / 1.4);align-items:start;position:relative;z-index:1}
@media (max-width:900px){.rob-about .top,.rob-culture .top{grid-template-columns:1fr;gap:1.2rem}
  .rob-about .btm{grid-template-columns:1fr;gap:1.6rem;margin-top:2.4rem}}

.rob-serv .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col)}
.rob-serv .btm{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);margin-top:calc(var(--band) / 1.6)}
.rob-serv ol{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:0 var(--col)}
.rob-serv li{border-top:1px solid ${C.hairline};padding:1.1em 0 1.2em;display:grid;grid-template-columns:1fr auto;gap:.6em;align-items:baseline}
.rob-serv li p{grid-column:1 / -1;max-width:46ch;opacity:.72;margin-top:.35em}
.rob-serv li span.n{font-size:var(--t-tag);opacity:.5;font-variant-numeric:tabular-nums}
@media (max-width:900px){.rob-serv .top,.rob-serv .btm{grid-template-columns:1fr;gap:1rem}.rob-serv ol{grid-template-columns:1fr}}

.rob-verk .intro{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr) minmax(0,1.3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.5)}
@media (max-width:900px){.rob-verk .intro{grid-template-columns:1fr;gap:1rem}}
.rob-grid{font-size:0}
.rob-card{display:inline-block;vertical-align:top;width:calc(33.3333% - var(--col));margin:0 calc(var(--col) / 2) calc(var(--band) / 1.6);font-size:var(--t-body);color:inherit}
/* the reference's full rhythm on seven jobs: a wide opener, a pair of portraits
   with a deliberate gap, then two pairs of half-width landscapes */
.rob-card:nth-child(1){width:calc(66.6666% - var(--col))}
.rob-card:nth-child(1) .rob-media{aspect-ratio:3 / 2}
.rob-card:nth-child(2),.rob-card:nth-child(3){width:calc(33.3333% - var(--col))}
.rob-card:nth-child(2) .rob-media,.rob-card:nth-child(3) .rob-media{aspect-ratio:3 / 4}
.rob-card:nth-child(3){margin-right:calc(33.3333% + var(--col) / 2)}
.rob-card:nth-child(n+4){width:calc(50% - var(--col))}
.rob-card:nth-child(n+4) .rob-media{aspect-ratio:3 / 2}
.rob-card .rob-media{aspect-ratio:1 / 1}
.rob-card .meta{display:flex;justify-content:space-between;gap:.6em;margin-top:.9em}
.rob-card .meta .tags{display:flex;gap:.4em;flex-wrap:wrap}
.rob-card h3{margin-top:.45em;padding-right:1.2em}
.rob-media .inner:after{content:'';position:absolute;inset:0;background:${C.ink};opacity:.12;transition:opacity .3s;z-index:1}
@media (max-width:1080px){.rob-card:nth-child(1){width:calc(100% - var(--col))}
  .rob-card:nth-child(3){margin-right:calc(var(--col) / 2)}}
@media (max-width:760px){.rob-card,.rob-card:nth-child(n){width:100%;margin:0 0 2.6rem}
  .rob-card .rob-media,.rob-card:nth-child(n) .rob-media{aspect-ratio:4 / 3}}

.rob-divider{height:1px;background:${C.hairline}}
.rob-banner .cols{display:grid;grid-template-columns:1.1fr 1.2fr 1.4fr auto;gap:var(--col);align-items:center}
.rob-banner .rob-media{aspect-ratio:4 / 3}
.rob-banner .onnur a{text-decoration:underline;text-decoration-color:${C.hairline};text-underline-offset:.2em}
.rob-banner .onnur a:hover{text-decoration-color:currentColor}
.rob-teymi{list-style:none;display:grid;grid-template-columns:repeat(3,1fr);gap:var(--col);margin-top:calc(var(--band) / 2)}
.rob-teymi li{border-top:1px solid ${C.hairline};padding-top:1em}
.rob-teymi p{opacity:.72;margin-top:.45em;max-width:40ch}
@media (max-width:900px){.rob-teymi{grid-template-columns:1fr;gap:1.4rem}}
@media (max-width:900px){.rob-banner .cols{grid-template-columns:1fr;gap:1.4rem}}

.rob-quote{position:relative;min-height:78vh;display:flex;align-items:center;overflow:hidden;color:#fff}
.rob-quote .bg{position:absolute;inset:-8% 0;height:116%}
.rob-quote .veil{position:absolute;inset:0;background:rgba(30,22,16,.62);z-index:1}
.rob-quote .card{position:relative;z-index:2;background:rgba(92,60,36,.86);border-radius:var(--rad);padding:calc(var(--band) / 2);
  max-width:64ch;overflow:hidden}
.rob-quote .qmark{font-size:var(--t-num);line-height:.7;opacity:.5;display:block}
.rob-quote blockquote{margin-top:.6em;min-height:5.4em}
.rob-quote .row{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;margin-top:1.6em}
.rob-quote .count{font-size:var(--t-tag);letter-spacing:.08em;opacity:.7;font-variant-numeric:tabular-nums}
.rob-quote .nav{display:flex;gap:.6em;color:#fff}
.rob-quote .rob-arrowbtn{border-color:rgba(255,255,255,.55)}
/* On a phone the card must fit between the floating header and the fold, or
   the first lines of the goal sit behind the header (caught on the iOS
   simulator). Smaller display size, no reserved height, tighter padding. */
@media (max-width:760px){.rob-quote{min-height:0;padding:var(--band) 0}
  .rob-quote .card{padding:2rem 1.4rem 1.6rem}
  .rob-quote blockquote{min-height:0;font-size:var(--t-smaller);line-height:1.3}
  .rob-quote .qmark{font-size:2.4rem}
  .rob-quote .row{margin-top:1.2em}}

.rob-culture .pair{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:var(--col);margin-top:calc(var(--band) / 1.6);align-items:start}
.rob-culture .pair .rob-media:first-child{aspect-ratio:3 / 2}
.rob-culture .pair .rob-media:nth-child(2){aspect-ratio:3 / 4}
.rob-culture .pair .rob-media:last-child{aspect-ratio:3 / 4}
@media (max-width:900px){.rob-culture .pair{grid-template-columns:1fr;gap:1rem}
  .rob-culture .pair .rob-media:nth-child(2),.rob-culture .pair .rob-media:last-child{aspect-ratio:4 / 3}}

.rob-c2a{position:relative;overflow:hidden}
.rob-c2a .cols{display:grid;grid-template-columns:1.25fr 1fr;gap:calc(var(--col) * 2);align-items:center;position:relative;z-index:1}
.rob-c2a .rob-media{aspect-ratio:4 / 3}
.rob-c2a .sub{display:grid;grid-template-columns:auto 1fr;gap:var(--col);align-items:start}
.rob-c2a .acts{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1.8rem}
@media (max-width:900px){.rob-c2a .cols{grid-template-columns:1fr;gap:2rem}.rob-c2a .sub{grid-template-columns:1fr}}
`

const dims = (ratio: string) => {
  const [w, h] = ratio.split('/').map((n) => Number(n.trim()))
  return { width: 1920, height: Math.round((1920 * h) / w) }
}

export function Media({ photo, speed = -1, scrim = 0.9, caption, className = '', sizes = '100vw', priority, style }: {
  photo: Photo
  speed?: number
  scrim?: number
  caption?: string
  className?: string
  sizes?: string
  priority?: boolean
  style?: CSSProperties
}) {
  return (
    <figure className={`rob-media ${className}`} style={style}>
      <div className="inner" data-speed={speed}>
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes={sizes}
          alt={photo.alt}
          width={dims(photo.ratio).width}
          height={dims(photo.ratio).height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          // @ts-expect-error fetchpriority is valid HTML, React types lag
          fetchpriority={priority ? 'high' : undefined}
        />
      </div>
      <span className="scrim" data-scrim={scrim} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

function Hero() {
  const ref = useInview<HTMLDivElement>()
  return (
    <div className="rob-hero" ref={ref}>
      <div className="bg" data-speed={-20} data-anchor="top">
        <img
          src={PHOTO.risidBar.src}
          srcSet={PHOTO.risidBar.srcSet}
          sizes="100vw"
          alt={PHOTO.risidBar.alt}
          width={dims(PHOTO.risidBar.ratio).width}
          height={dims(PHOTO.risidBar.ratio).height}
          // @ts-expect-error fetchpriority is valid HTML, React types lag
          fetchpriority="high"
        />
      </div>
      <div className="veil" />
      <div className="veil2" />
      <div className="top">
        <Label>Trésmíði Róberts ehf.</Label>
        <Words tag="h1" className="rob-big" text={TEXTI.tagline} hold={0.35} />
      </div>
      <div className="base">
        <div className="rob-rise" style={step(1)}>
          <Label>{TEXTI.heroLabel}</Label>
        </div>
        <p className="rob-rise rob-lead" style={step(2)}>{TEXTI.inngangur}</p>
        <div className="rob-rise" style={step(3)}>
          <Btn href="#verkefni" variant="light">Sjá verkin</Btn>
        </div>
      </div>
    </div>
  )
}

function QuoteSlider() {
  const [i, setI] = useState(0)
  const n = MARKMID.length
  const go = (d: number) => setI((p) => (p + d + n) % n)
  const [held, setHeld] = useState(false)
  useEffect(() => {
    if (reduced() || held) return
    const t = window.setInterval(() => setI((p) => (p + 1) % n), 9000)
    return () => clearInterval(t)
  }, [n, held])
  return (
    <section
      className="rob-quote"
      id="stefna"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div className="bg" data-speed={-1}>
        <img src={PHOTO.sumac.src} srcSet={PHOTO.sumac.srcSet} sizes="100vw" alt={PHOTO.sumac.alt} width={dims(PHOTO.sumac.ratio).width} height={dims(PHOTO.sumac.ratio).height} loading="lazy" />
      </div>
      <div className="veil" />
      <div className="rob-wrap">
        <Reveal className="card">
          <LineField top="auto" height={220} seed={4} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Label>Áherslur Trésmíði Róberts</Label>
            <span className="qmark" aria-hidden="true">&ldquo;</span>
            <blockquote key={i} className="rob-normal" aria-live="polite">
              <Words tag="span" text={MARKMID[i]} hold={0.05} />
            </blockquote>
            <div className="row">
              <p className="count">
                {String(i + 1).padStart(2, '0')} <span aria-hidden="true">|</span> {String(n).padStart(2, '0')}
              </p>
              <div className="nav">
                <ArrowButton dir="left" label="Fyrri áhersla" onClick={() => go(-1)} />
                <ArrowButton dir="right" label="Næsta áhersla" onClick={() => go(1)} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function RobertsPage() {
  useScrollFx()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'Trésmíði Róberts ehf. | Sérsmíði og innréttingar fyrir veitingastaði, hótel og verslanir'
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    meta?.setAttribute(
      'content',
      'Trésmíði Róberts ehf. sérsmíðar innréttingar, bari og afgreiðsluborð fyrir veitingastaði, hótel og verslanir. Nýsmíði, endurbætur og viðhald, frá hugmynd að fullkláruðu verki.',
    )
    setThemeColor(C.paper)
    return () => {
      document.title = prevTitle
      document.documentElement.lang = prevLang
      meta?.setAttribute('content', prevDesc)
    }
  }, [])

  return (
    <div className="rob-root">
      <style>{CSS}{PAGE_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <Intro />
      <Cursor />
      <Header light />
      <StickyBar />

      <main id="efni">
        <Hero />

        <div className="rob-band paper">
          <section className="rob-about" id="um-okkur">
            <LineField top="6%" height={430} seed={2} />
            <div className="rob-wrap">
              <Reveal className="top">
                <Chapter n="1.0" />
                <div>
                  <Label>Um okkur</Label>
                  <Words tag="h2" className="rob-normal" text={TEXTI.um} />
                </div>
              </Reveal>
              <Reveal className="btm">
                <Media photo={PHOTO.kassinn} sizes="(max-width:900px) 100vw, 26vw" className="rob-rise" />
                <p className="rob-rise" style={step(2)}>{TEXTI.starfsmenn}</p>
                <div className="rob-rise" style={step(3)}>
                  <Btn href={`mailto:${CONTACT.netfang}`} variant="ghost">Hafa samband</Btn>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="rob-serv" id="thjonusta">
            <div className="rob-wrap">
              <Reveal className="top">
                <Chapter n="1.1" />
                <p className="rob-rise rob-lead" style={{ ...step(1), maxWidth: '58ch' }}>{TEXTI.thjonusta}</p>
              </Reveal>
              <Reveal className="btm">
                <h2 className="rob-label" style={{ marginBottom: '1.4em' }}>
                  <svg className="rob-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg>
                  <span>Þjónusta</span>
                </h2>
                <ol>
                  {THJONUSTA.map((s, idx) => (
                    <li key={s.titill} className="rob-rise" style={step(idx % 3 + 1)}>
                      <span className="rob-smallert">{s.titill}</span>
                      <span className="n">{String(idx + 1).padStart(2, '0')}</span>
                      {s.texti ? <p>{s.texti}</p> : null}
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </section>
        </div>

        <div className="rob-band white">
          <section className="rob-verk" id="verkefni">
            <div className="rob-wrap">
              <Reveal className="intro">
                <Chapter n="1.2" />
                <div>
                  <Label>Verkin okkar</Label>
                  <Words tag="h2" className="rob-normal" text={TEXTI.verkH2} />
                </div>
                <p className="rob-rise" style={step(2)}>{TEXTI.verkefniIntro}</p>
              </Reveal>
              <div className="rob-grid">
                {VERK_GRID.map((v, idx) => (
                  <Reveal as="article" key={v.slug} className="rob-card">
                    <Link to={`/preview/roberts/verk/${v.slug}`} data-cursor="card" aria-label={v.stadur ? `${v.name}, ${v.flokkur.toLowerCase()}, ${v.stadur}` : `${v.name}, ${v.flokkur.toLowerCase()}`}>
                      <Media
                        photo={v.cover}
                        className="rob-rise"
                        sizes={idx === 0 ? '(max-width:760px) 100vw, 60vw' : idx < 3 ? '(max-width:760px) 100vw, 30vw' : '(max-width:760px) 100vw, 45vw'}
                      />
                      <div className="meta rob-rise" style={step(2)}>
                        <span className="tags"><span className="rob-tag">{v.flokkur}</span></span>
                        {v.stadur ? <span className="rob-tag">{v.stadur}</span> : null}
                      </div>
                      <h3 className="rob-smallt rob-rise" style={step(4)}>{v.name}</h3>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="rob-wrap"><div className="rob-divider" /></div>
          </section>

          <section className="rob-banner">
            <div className="rob-wrap">
              <Reveal className="cols">
                <Media photo={PHOTO.fantasia} className="rob-rise" sizes="(max-width:900px) 100vw, 24vw" />
                <Words tag="h2" className="rob-normal" text="Og tíu verk til viðbótar." />
                <p className="rob-rise onnur" style={step(2)}>
                  {VERK_ONNUR.map((v, i) => (
                    <span key={v.slug}>
                      <Link to={`/preview/roberts/verk/${v.slug}`}>{v.name}</Link>
                      {i < VERK_ONNUR.length - 2 ? ', ' : i === VERK_ONNUR.length - 2 ? ' og ' : '.'}
                    </span>
                  ))}
                </p>
                <div className="rob-rise" style={step(3)}>
                  <Btn href={CONTACT.simiHref} variant="brand">Hringja {CONTACT.simi}</Btn>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <QuoteSlider />

        <div className="rob-band white">
          <section className="rob-culture">
            <div className="rob-wrap">
              <Reveal className="top">
                <Chapter n="1.3" />
                <div>
                  <Label>Teymið okkar</Label>
                  <Words tag="h2" className="rob-normal" text={TEXTI.teymi} />
                </div>
              </Reveal>
              <Reveal>
                <ul className="rob-teymi">
                  {TEYMI.map((m, i) => (
                    <li key={m.nafn} className="rob-rise" style={step(i + 1)}>
                      <h3 className="rob-smallert">{m.nafn}</h3>
                      <p>{m.texti}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="pair">
                <Media photo={PHOTO.teymi} className="rob-rise" sizes="(max-width:900px) 100vw, 44vw" />
                <Media photo={PHOTO.enska} className="rob-rise" style={step(1)} sizes="(max-width:900px) 100vw, 24vw" />
                <Media photo={PHOTO.messinn} className="rob-rise" style={step(2)} sizes="(max-width:900px) 100vw, 24vw" />
              </Reveal>
            </div>
          </section>
        </div>

        <div className="rob-band dark" id="hafa-samband">
          <section className="rob-c2a">
            <div className="rob-wrap">
              <Reveal className="cols">
                <div>
                  <LineField top="auto" height={260} seed={7} />
                  <div className="sub" style={{ position: 'relative', zIndex: 1 }}>
                    <Chapter n="1.4" />
                    <Words tag="h2" className="rob-normal" text={TEXTI.metnadur} />
                  </div>
                  <p className="rob-rise" style={{ ...step(2), position: 'relative', zIndex: 1, marginTop: '1.4em', opacity: 0.8 }}>{TEXTI.tilbod}</p>
                  <div className="acts" style={{ position: 'relative', zIndex: 1 }}>
                    <Btn href={`mailto:${CONTACT.netfang}`} variant="light">{CONTACT.netfang}</Btn>
                    <Btn href={CONTACT.simiHref} variant="light">{CONTACT.simi}</Btn>
                  </div>
                </div>
                <Media photo={PHOTO.joe} className="rob-rise" sizes="(max-width:900px) 100vw, 38vw" scrim={0.7} />
              </Reveal>
            </div>
          </section>
        </div>

        <footer className="rob-foot">
          <div className="rob-wrap">
            <div className="cols">
              <div>
                <h3>Fyrirtækið</h3>
                <p>Trésmíði Róberts ehf.<br />kt. {CONTACT.kennitala}<br />{CONTACT.stadur}</p>
              </div>
              <div>
                <h3>Samband</h3>
                <p>
                  <a href={CONTACT.simiHref}>{CONTACT.simi}</a><br />
                  <a href={`mailto:${CONTACT.netfang}`}>{CONTACT.netfang}</a>
                </p>
              </div>
              <div>
                <h3>Verkefni</h3>
                <ul style={{ listStyle: 'none' }}>
                  {VERK_GRID.map((v) => (
                    <li key={v.slug}><Link to={`/preview/roberts/verk/${v.slug}`}>{v.name}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Þjónusta</h3>
                <ul style={{ listStyle: 'none' }}>
                  {THJONUSTA.map((s) => <li key={s.titill}>{s.titill}</li>)}
                </ul>
              </div>
            </div>
            <div className="rule" />
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
