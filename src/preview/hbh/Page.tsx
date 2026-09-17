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
import { CONTACT, JSON_LD, MARKMID, PHOTO, PHOTO_CREDIT, TEXTI, THJONUSTA, VERK, type Photo } from './data'

const company = getPreviewCompany('hbh')

/* Blocks that only the home page uses. Everything shared lives in ui.tsx. */
const PAGE_CSS = `
.hbh-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;color:#fff}
.hbh-hero .bg{position:absolute;inset:-10% 0 0;height:120%}
.hbh-hero .bg img{filter:saturate(.92)}
.hbh-hero .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(5,42,71,.9),rgba(5,42,71,.66) 45%,rgba(5,42,71,.38) 75%,rgba(5,42,71,.5));z-index:1}
/* a second, shorter scrim under the type block: white display copy has to clear AA
   over the brightest pixels of the photograph, not just its average */
.hbh-hero .veil2{position:absolute;inset:auto 0 0 0;height:72%;z-index:1;
  background:linear-gradient(to top,rgba(4,30,52,.94) 12%,rgba(4,30,52,.74) 46%,rgba(4,30,52,0))}
.hbh-hero .top{position:relative;z-index:2;padding:0 var(--gut) calc(var(--band) / 2)}
.hbh-hero h1{max-width:16ch;margin-top:.5em}
.hbh-hero .base{position:relative;z-index:2;padding:calc(var(--band) / 2) var(--gut) calc(var(--band) / 1.6);
  border-top:1px solid rgba(255,255,255,.25);display:grid;grid-template-columns:1.1fr 1.4fr auto;gap:var(--col);align-items:start}
@media (max-width:900px){.hbh-hero .base{grid-template-columns:1fr;gap:1.4rem}.hbh-hero h1{max-width:none}}

.hbh-about{position:relative}
.hbh-about .top,.hbh-culture .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);position:relative;z-index:1}
.hbh-about .btm .hbh-media{aspect-ratio:3 / 4}
.hbh-about .btm{display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:var(--col);margin-top:calc(var(--band) / 1.4);align-items:start;position:relative;z-index:1}
@media (max-width:900px){.hbh-about .top,.hbh-culture .top{grid-template-columns:1fr;gap:1.2rem}
  .hbh-about .btm{grid-template-columns:1fr;gap:1.6rem;margin-top:2.4rem}}

.hbh-serv .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col)}
.hbh-serv .btm{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);margin-top:calc(var(--band) / 1.6)}
.hbh-serv ol{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:0 var(--col)}
.hbh-serv li{border-top:1px solid ${C.hairline};padding:1.1em 0 1.2em;display:grid;grid-template-columns:1fr auto;gap:.6em;align-items:baseline}
.hbh-serv li p{grid-column:1 / -1;max-width:46ch;opacity:.72;margin-top:.35em}
.hbh-serv li span.n{font-size:var(--t-tag);opacity:.5;font-variant-numeric:tabular-nums}
@media (max-width:900px){.hbh-serv .top,.hbh-serv .btm{grid-template-columns:1fr;gap:1rem}.hbh-serv ol{grid-template-columns:1fr}}

.hbh-verk .intro{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr) minmax(0,1.3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.5)}
@media (max-width:900px){.hbh-verk .intro{grid-template-columns:1fr;gap:1rem}}
.hbh-grid{font-size:0}
.hbh-card{display:inline-block;vertical-align:top;width:calc(33.3333% - var(--col));margin:0 calc(var(--col) / 2) calc(var(--band) / 1.6);font-size:var(--t-body);color:inherit}
/* the reference's rhythm on five jobs: a wide opener, a pair of portraits with a
   deliberate gap, then a pair of half-width landscapes */
.hbh-card:nth-child(1){width:calc(66.6666% - var(--col))}
.hbh-card:nth-child(1) .hbh-media{aspect-ratio:3 / 2}
.hbh-card:nth-child(2),.hbh-card:nth-child(3){width:calc(33.3333% - var(--col))}
.hbh-card:nth-child(2) .hbh-media,.hbh-card:nth-child(3) .hbh-media{aspect-ratio:3 / 4}
.hbh-card:nth-child(3){margin-right:calc(33.3333% + var(--col) / 2)}
.hbh-card:nth-child(4),.hbh-card:nth-child(5){width:calc(50% - var(--col))}
.hbh-card:nth-child(4) .hbh-media,.hbh-card:nth-child(5) .hbh-media{aspect-ratio:3 / 2}
.hbh-card .hbh-media{aspect-ratio:1 / 1}
.hbh-card .meta{display:flex;justify-content:space-between;gap:.6em;margin-top:.9em}
.hbh-card .meta .tags{display:flex;gap:.4em;flex-wrap:wrap}
.hbh-card h3{margin-top:.45em;padding-right:1.2em}
.hbh-card:hover .hbh-media .inner:after{opacity:.55}
.hbh-media .inner:after{content:'';position:absolute;inset:0;background:${C.ink};opacity:.12;transition:opacity .3s;z-index:1}
@media (max-width:1080px){.hbh-card:nth-child(1){width:calc(100% - var(--col))}
  .hbh-card:nth-child(3){margin-right:calc(var(--col) / 2)}}
@media (max-width:760px){.hbh-card,.hbh-card:nth-child(n){width:100%;margin:0 0 2.6rem}
  .hbh-card .hbh-media,.hbh-card:nth-child(n) .hbh-media{aspect-ratio:4 / 3}}

.hbh-divider{height:1px;background:${C.hairline}}
.hbh-banner .cols{display:grid;grid-template-columns:1.1fr 1.2fr 1.4fr auto;gap:var(--col);align-items:center}
.hbh-banner .hbh-media{aspect-ratio:4 / 3}
@media (max-width:900px){.hbh-banner .cols{grid-template-columns:1fr;gap:1.4rem}}

.hbh-quote{position:relative;min-height:78vh;display:flex;align-items:center;overflow:hidden;color:#fff}
.hbh-quote .bg{position:absolute;inset:-8% 0;height:116%}
.hbh-quote .veil{position:absolute;inset:0;background:rgba(5,42,71,.62);z-index:1}
.hbh-quote .card{position:relative;z-index:2;background:rgba(0,70,122,.86);border-radius:var(--rad);padding:calc(var(--band) / 2);
  max-width:64ch;overflow:hidden}
.hbh-quote .qmark{font-size:var(--t-num);line-height:.7;opacity:.5;display:block}
.hbh-quote blockquote{margin-top:.6em;min-height:5.4em}
.hbh-quote .row{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;margin-top:1.6em}
.hbh-quote .count{font-size:var(--t-tag);letter-spacing:.08em;opacity:.7;font-variant-numeric:tabular-nums}
.hbh-quote .nav{display:flex;gap:.6em;color:#fff}
.hbh-quote .hbh-arrowbtn{border-color:rgba(255,255,255,.55)}
/* On a phone the card must fit between the floating header and the fold, or
   the first lines of the goal sit behind the header (caught on the iOS
   simulator). Smaller display size, no reserved height, tighter padding. */
@media (max-width:760px){.hbh-quote{min-height:0;padding:var(--band) 0}
  .hbh-quote .card{padding:2rem 1.4rem 1.6rem}
  .hbh-quote blockquote{min-height:0;font-size:var(--t-smaller);line-height:1.3}
  .hbh-quote .qmark{font-size:2.4rem}
  .hbh-quote .row{margin-top:1.2em}}

.hbh-culture .pair{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:var(--col);margin-top:calc(var(--band) / 1.6);align-items:start}
.hbh-culture .pair .hbh-media:first-child{aspect-ratio:3 / 2}
.hbh-culture .pair .hbh-media:nth-child(2){aspect-ratio:3 / 4}
.hbh-culture .pair .hbh-media:last-child{aspect-ratio:3 / 4}
@media (max-width:900px){.hbh-culture .pair{grid-template-columns:1fr;gap:1rem}
  .hbh-culture .pair .hbh-media:nth-child(2),.hbh-culture .pair .hbh-media:last-child{aspect-ratio:4 / 3}}

.hbh-c2a{position:relative;overflow:hidden}
.hbh-c2a .cols{display:grid;grid-template-columns:1.25fr 1fr;gap:calc(var(--col) * 2);align-items:center;position:relative;z-index:1}
.hbh-c2a .hbh-media{aspect-ratio:4 / 3}
.hbh-c2a .sub{display:grid;grid-template-columns:auto 1fr;gap:var(--col);align-items:start}
.hbh-c2a .acts{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1.8rem}
@media (max-width:900px){.hbh-c2a .cols{grid-template-columns:1fr;gap:2rem}.hbh-c2a .sub{grid-template-columns:1fr}}
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
    <figure className={`hbh-media ${className}`} style={style}>
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
    <div className="hbh-hero" ref={ref}>
      <div className="bg" data-speed={-20} data-anchor="top">
        <img
          src={PHOTO.canopyMottaka.src}
          srcSet={PHOTO.canopyMottaka.srcSet}
          sizes="100vw"
          alt={PHOTO.canopyMottaka.alt}
          width={1920}
          height={1280}
          // @ts-expect-error fetchpriority is valid HTML, React types lag
          fetchpriority="high"
        />
      </div>
      <div className="veil" />
      <div className="veil2" />
      <div className="top">
        <Label>HBH Byggir ehf.</Label>
        <Words tag="h1" className="hbh-big" text={TEXTI.tagline} hold={0.35} />
      </div>
      <div className="base">
        <div className="hbh-rise" style={step(1)}>
          <Label>Heildarlausnir í byggingaframkvæmdum</Label>
        </div>
        <p className="hbh-rise hbh-lead" style={step(2)}>{TEXTI.heildarlausnir}</p>
        <div className="hbh-rise" style={step(3)}>
          <Btn href="#verkefni" variant="light">Sjá verkefnin</Btn>
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
      className="hbh-quote"
      id="stefna"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div className="bg" data-speed={-1}>
        <img src={PHOTO.smaraBar.src} srcSet={PHOTO.smaraBar.srcSet} sizes="100vw" alt={PHOTO.smaraBar.alt} width={1920} height={1280} loading="lazy" />
      </div>
      <div className="veil" />
      <div className="hbh-wrap">
        <Reveal className="card">
          <LineField top="auto" height={220} seed={4} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Label>Almenn markmið HBH</Label>
            <span className="qmark" aria-hidden="true">&ldquo;</span>
            <blockquote key={i} className="hbh-normal" aria-live="polite">
              <Words tag="span" text={MARKMID[i]} hold={0.05} />
            </blockquote>
            <div className="row">
              <p className="count">
                {String(i + 1).padStart(2, '0')} <span aria-hidden="true">|</span> {String(n).padStart(2, '0')}
              </p>
              <div className="nav">
                <ArrowButton dir="left" label="Fyrra markmið" onClick={() => go(-1)} />
                <ArrowButton dir="right" label="Næsta markmið" onClick={() => go(1)} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function HbhPage() {
  useScrollFx()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'HBH Byggir ehf. | Byggingaframkvæmdir og sérsmíðaðar innréttingar'
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    meta?.setAttribute(
      'content',
      'HBH Byggir ehf. sérhæfir sig í heildarlausnum á sviði byggingaframkvæmda: nýbyggingum, framkvæmdum innanhúss, lóðaframkvæmdum og sérsmíðuðum innréttingum. Verkstæði í Reykjavík og á Akranesi.',
    )
    setThemeColor(C.paper)
    return () => {
      document.title = prevTitle
      document.documentElement.lang = prevLang
      meta?.setAttribute('content', prevDesc)
    }
  }, [])

  return (
    <div className="hbh-root">
      <style>{CSS}{PAGE_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <Intro />
      <Cursor />
      <Header light />
      <StickyBar />

      <main id="efni">
        <Hero />

        <div className="hbh-band paper">
          <section className="hbh-about" id="um-okkur">
            <LineField top="6%" height={430} seed={2} />
            <div className="hbh-wrap">
              <Reveal className="top">
                <Chapter n="1.0" />
                <div>
                  <Label>Um okkur</Label>
                  <Words tag="h2" className="hbh-normal" text={TEXTI.heildarlausnir} />
                </div>
              </Reveal>
              <Reveal className="btm">
                <Media photo={PHOTO.verkVidarhurdir} sizes="(max-width:900px) 100vw, 26vw" className="hbh-rise" />
                <p className="hbh-rise" style={step(2)}>{TEXTI.starfsmenn}</p>
                <div className="hbh-rise" style={step(3)}>
                  <Btn href={`mailto:${CONTACT.netfang}`} variant="ghost">Hafa samband</Btn>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="hbh-serv" id="thjonusta">
            <div className="hbh-wrap">
              <Reveal className="top">
                <Chapter n="1.1" />
                <p className="hbh-rise hbh-lead" style={{ ...step(1), maxWidth: '58ch' }}>{TEXTI.vidskiptavinir}</p>
              </Reveal>
              <Reveal className="btm">
                <h2 className="hbh-label" style={{ marginBottom: '1.4em' }}>
                  <svg className="hbh-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg>
                  <span>Þjónusta</span>
                </h2>
                <ol>
                  {THJONUSTA.map((s, idx) => (
                    <li key={s.titill} className="hbh-rise" style={step(idx % 3 + 1)}>
                      <span className="hbh-smallert">{s.titill}</span>
                      <span className="n">{String(idx + 1).padStart(2, '0')}</span>
                      {s.texti ? <p>{s.texti}</p> : null}
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </section>
        </div>

        <div className="hbh-band white">
          <section className="hbh-verk" id="verkefni">
            <div className="hbh-wrap">
              <Reveal className="intro">
                <Chapter n="1.2" />
                <div>
                  <Label>Verkefnin</Label>
                  <Words tag="h2" className="hbh-normal" text="Verkin sjálf eru ferilskráin." />
                </div>
                <p className="hbh-rise" style={step(2)}>{TEXTI.verkefniIntro}</p>
              </Reveal>
              <div className="hbh-grid">
                {VERK.map((v, idx) => (
                  <Reveal as="article" key={v.slug} className="hbh-card">
                    <Link to={`/preview/hbh/verk/${v.slug}`} data-cursor="card" aria-label={`${v.name}, ${v.flokkur} í ${v.stadur}`}>
                      <Media
                        photo={v.cover}
                        className="hbh-rise"
                        sizes={idx === 0 ? '(max-width:760px) 100vw, 60vw' : idx < 3 ? '(max-width:760px) 100vw, 30vw' : '(max-width:760px) 100vw, 45vw'}
                      />
                      <div className="meta hbh-rise" style={step(2)}>
                        <span className="tags"><span className="hbh-tag">{v.flokkur}</span></span>
                        <span className="hbh-tag">{v.stadur}</span>
                      </div>
                      <h3 className="hbh-smallt hbh-rise" style={step(4)}>{v.name}</h3>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="hbh-wrap"><div className="hbh-divider" /></div>
          </section>

          <section className="hbh-banner">
            <div className="hbh-wrap">
              <Reveal className="cols">
                <Media photo={PHOTO.verkBar} className="hbh-rise" sizes="(max-width:900px) 100vw, 24vw" />
                <Words tag="h2" className="hbh-normal" text="Fleiri verk en myndirnar ná yfir." />
                <p className="hbh-rise" style={step(2)}>{TEXTI.onnurVerk}</p>
                <div className="hbh-rise" style={step(3)}>
                  <Btn href={CONTACT.simiHref} variant="brand">Hringja {CONTACT.simi}</Btn>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <QuoteSlider />

        <div className="hbh-band white">
          <section className="hbh-culture">
            <div className="hbh-wrap">
              <Reveal className="top">
                <Chapter n="1.3" />
                <div>
                  <Label>Stefna HBH</Label>
                  <Words tag="h2" className="hbh-normal" text={TEXTI.stefna} />
                </div>
              </Reveal>
              <Reveal className="pair">
                <Media photo={PHOTO.verkVidarklaedning} className="hbh-rise" sizes="(max-width:900px) 100vw, 44vw" />
                <Media photo={PHOTO.verkGangur} className="hbh-rise" style={step(1)} sizes="(max-width:900px) 100vw, 24vw" />
                <Media photo={PHOTO.verkStofa} className="hbh-rise" style={step(2)} sizes="(max-width:900px) 100vw, 24vw" />
              </Reveal>
            </div>
          </section>
        </div>

        <div className="hbh-band dark" id="hafa-samband">
          <section className="hbh-c2a">
            <div className="hbh-wrap">
              <Reveal className="cols">
                <div>
                  <LineField top="auto" height={260} seed={7} />
                  <div className="sub" style={{ position: 'relative', zIndex: 1 }}>
                    <Chapter n="1.4" />
                    <Words tag="h2" className="hbh-normal" text={TEXTI.metnadur} />
                  </div>
                  <div className="acts" style={{ position: 'relative', zIndex: 1 }}>
                    <Btn href={`mailto:${CONTACT.netfang}`} variant="light">{CONTACT.netfang}</Btn>
                    <Btn href={CONTACT.simiHref} variant="light">{CONTACT.simi}</Btn>
                  </div>
                </div>
                <Media photo={PHOTO.canopyStigi} className="hbh-rise" sizes="(max-width:900px) 100vw, 38vw" scrim={0.7} />
              </Reveal>
            </div>
          </section>
        </div>

        <footer className="hbh-foot">
          <div className="hbh-wrap">
            <div className="cols">
              <div>
                <h3>Heimilisfang</h3>
                <p>HBH Byggir ehf.<br />{CONTACT.heimilisfang[0]}<br />{CONTACT.heimilisfang[1]}</p>
                <p style={{ marginTop: '.8em' }}>{CONTACT.verkstaedi}</p>
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
                  {VERK.map((v) => (
                    <li key={v.slug}><Link to={`/preview/hbh/verk/${v.slug}`}>{v.name}</Link></li>
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
              <p>&copy; {new Date().getFullYear()} HBH Byggir ehf.</p>
            </div>
          </div>
        </footer>
      </main>

      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
