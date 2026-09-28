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
import { CONTACT, JSON_LD, MARKMID, NOLTE, PHOTO, PHOTO_CREDIT, TEXTI, THJONUSTA, VERK_GRID, VERK_ONNUR, type Photo } from './data'

const company = getPreviewCompany('treborg')

/* Blocks that only the home page uses. Everything shared lives in ui.tsx. */
const PAGE_CSS = `
.tre-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;color:#fff}
.tre-hero .bg{position:absolute;inset:-10% 0 0;height:120%}
.tre-hero .bg img{filter:saturate(.92);object-position:50% 58%}
.tre-hero .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(22,25,27,.9),rgba(22,25,27,.66) 45%,rgba(22,25,27,.38) 75%,rgba(22,25,27,.5));z-index:1}
/* a second, shorter scrim under the type block: white display copy has to clear AA
   over the brightest pixels of the photograph, not just its average */
.tre-hero .veil2{position:absolute;inset:auto 0 0 0;height:72%;z-index:1;
  background:linear-gradient(to top,rgba(18,20,22,.94) 12%,rgba(18,20,22,.74) 46%,rgba(18,20,22,0))}
.tre-hero .top{position:relative;z-index:2;padding:0 var(--gut) calc(var(--band) / 2)}
.tre-hero h1{max-width:16ch;margin-top:.5em}
.tre-hero .base{position:relative;z-index:2;padding:calc(var(--band) / 2) var(--gut) calc(var(--band) / 1.6);
  border-top:1px solid rgba(255,255,255,.25);display:grid;grid-template-columns:1.1fr 1.4fr auto;gap:var(--col);align-items:start}
@media (max-width:900px){.tre-hero .base{grid-template-columns:1fr;gap:1.4rem}.tre-hero h1{max-width:none}}
/* phones carry the fixed call bar; the hero's button sat half under it on the first screen */
@media (max-width:760px){.tre-hero .base{padding-bottom:calc(var(--band) / 1.6 + 72px + env(safe-area-inset-bottom))}}

.tre-about{position:relative}
.tre-about .top,.tre-culture .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);position:relative;z-index:1}
.tre-about .btm .tre-media{aspect-ratio:3 / 4}
.tre-about .btm{display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:var(--col);margin-top:calc(var(--band) / 1.4);align-items:start;position:relative;z-index:1}
@media (max-width:900px){.tre-about .top,.tre-culture .top{grid-template-columns:1fr;gap:1.2rem}
  .tre-about .btm{grid-template-columns:1fr;gap:1.6rem;margin-top:2.4rem}}

.tre-serv .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col)}
.tre-serv .btm{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);margin-top:calc(var(--band) / 1.6)}
.tre-serv ol{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:0 var(--col)}
.tre-serv li{border-top:1px solid ${C.hairline};padding:1.1em 0 1.2em;display:grid;grid-template-columns:1fr auto;gap:.6em;align-items:baseline}
.tre-serv li p{grid-column:1 / -1;max-width:46ch;opacity:.72;margin-top:.35em}
.tre-serv li span.n{font-size:var(--t-tag);opacity:.5;font-variant-numeric:tabular-nums}
@media (max-width:900px){.tre-serv .top,.tre-serv .btm{grid-template-columns:1fr;gap:1rem}.tre-serv ol{grid-template-columns:1fr}}

.tre-verk .intro{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr) minmax(0,1.3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.5)}
@media (max-width:900px){.tre-verk .intro{grid-template-columns:1fr;gap:1rem}}
.tre-grid{font-size:0}
.tre-card{display:inline-block;vertical-align:top;width:calc(33.3333% - var(--col));margin:0 calc(var(--col) / 2) calc(var(--band) / 1.6);font-size:var(--t-body);color:inherit}
/* the reference's full rhythm on seven jobs: a wide opener, a pair of portraits
   with a deliberate gap, then two pairs of half-width landscapes */
.tre-card:nth-child(1){width:calc(66.6666% - var(--col))}
.tre-card:nth-child(1) .tre-media{aspect-ratio:3 / 2}
.tre-card:nth-child(2),.tre-card:nth-child(3){width:calc(33.3333% - var(--col))}
.tre-card:nth-child(2) .tre-media,.tre-card:nth-child(3) .tre-media{aspect-ratio:3 / 4}
.tre-card:nth-child(3){margin-right:calc(33.3333% + var(--col) / 2)}
.tre-card:nth-child(n+4){width:calc(50% - var(--col))}
.tre-card:nth-child(n+4) .tre-media{aspect-ratio:3 / 2}
.tre-card .tre-media{aspect-ratio:1 / 1}
.tre-card .meta{display:flex;justify-content:space-between;gap:.6em;margin-top:.9em}
.tre-card .meta .tags{display:flex;gap:.4em;flex-wrap:wrap}
.tre-card h3{margin-top:.45em;padding-right:1.2em}
.tre-media .inner:after{content:'';position:absolute;inset:0;background:${C.ink};opacity:.12;transition:opacity .3s;z-index:1}
@media (max-width:1080px){.tre-card:nth-child(1){width:calc(100% - var(--col))}
  .tre-card:nth-child(3){margin-right:calc(var(--col) / 2)}}
@media (max-width:760px){.tre-card,.tre-card:nth-child(n){width:100%;margin:0 0 2.6rem}
  .tre-card .tre-media,.tre-card:nth-child(n) .tre-media{aspect-ratio:4 / 3}}

.tre-divider{height:1px;background:${C.hairline}}
.tre-banner .cols{display:grid;grid-template-columns:1.1fr 1.2fr 1.4fr auto;gap:var(--col);align-items:center}
.tre-banner .tre-media{aspect-ratio:4 / 3}
.tre-banner .onnur a{text-decoration:underline;text-decoration-color:${C.hairline};text-underline-offset:.2em}
.tre-banner .onnur a:hover{text-decoration-color:currentColor}
.tre-teymi{list-style:none;display:grid;grid-template-columns:repeat(3,1fr);gap:var(--col);margin-top:calc(var(--band) / 2)}
.tre-teymi li{border-top:1px solid ${C.hairline};padding-top:1em}
.tre-teymi p{opacity:.72;margin-top:.45em;max-width:40ch}
@media (max-width:900px){.tre-teymi{grid-template-columns:1fr;gap:1.4rem}}
@media (max-width:900px){.tre-banner .cols{grid-template-columns:1fr;gap:1.4rem}}

.tre-quote{position:relative;min-height:78vh;display:flex;align-items:center;overflow:hidden;color:#fff}
.tre-quote .bg{position:absolute;inset:-8% 0;height:116%}
.tre-quote .veil{position:absolute;inset:0;background:rgba(22,25,27,.62);z-index:1}
.tre-quote .card{position:relative;z-index:2;background:rgba(106,74,48,.86);border-radius:var(--rad);padding:calc(var(--band) / 2);
  max-width:64ch;overflow:hidden}
.tre-quote .qmark{font-size:var(--t-num);line-height:.7;opacity:.5;display:block}
.tre-quote blockquote{margin-top:.6em;min-height:5.4em}
.tre-quote .row{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;margin-top:1.6em}
.tre-quote .count{font-size:var(--t-tag);letter-spacing:.08em;opacity:.7;font-variant-numeric:tabular-nums}
.tre-quote .nav{display:flex;gap:.6em;color:#fff}
.tre-quote .tre-arrowbtn{border-color:rgba(255,255,255,.55)}
/* On a phone the card must fit between the floating header and the fold, or
   the first lines of the goal sit behind the header (caught on the iOS
   simulator). Smaller display size, no reserved height, tighter padding. */
@media (max-width:760px){.tre-quote{min-height:0;padding:var(--band) 0}
  .tre-quote .card{padding:2rem 1.4rem 1.6rem}
  .tre-quote blockquote{min-height:0;font-size:var(--t-smaller);line-height:1.3}
  .tre-quote .qmark{font-size:2.4rem}
  .tre-quote .row{margin-top:1.2em}}

.tre-culture .pair{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:var(--col);margin-top:calc(var(--band) / 1.6);align-items:start}
.tre-culture .pair .tre-media:first-child{aspect-ratio:3 / 2}
.tre-culture .pair .tre-media:nth-child(2){aspect-ratio:3 / 4}
.tre-culture .pair .tre-media:last-child{aspect-ratio:3 / 4}
@media (max-width:900px){.tre-culture .pair{grid-template-columns:1fr;gap:1rem}
  .tre-culture .pair .tre-media:nth-child(2),.tre-culture .pair .tre-media:last-child{aspect-ratio:4 / 3}}

.tre-c2a{position:relative;overflow:hidden}
.tre-c2a .cols{display:grid;grid-template-columns:1.25fr 1fr;gap:calc(var(--col) * 2);align-items:center;position:relative;z-index:1}
.tre-c2a .tre-media{aspect-ratio:4 / 3}
.tre-c2a .sub{display:grid;grid-template-columns:auto 1fr;gap:var(--col);align-items:start}
.tre-c2a .acts{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1.8rem}
@media (max-width:900px){.tre-c2a .cols{grid-template-columns:1fr;gap:2rem}.tre-c2a .sub{grid-template-columns:1fr}}
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
    <figure className={`tre-media ${className}`} style={style}>
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
    <div className="tre-hero" ref={ref}>
      <div className="bg" data-speed={-20} data-anchor="top">
        <img
          src={PHOTO.skrifstofur.src}
          srcSet={PHOTO.skrifstofur.srcSet}
          sizes="100vw"
          alt={PHOTO.skrifstofur.alt}
          width={dims(PHOTO.skrifstofur.ratio).width}
          height={dims(PHOTO.skrifstofur.ratio).height}
          // @ts-expect-error fetchpriority is valid HTML, React types lag
          fetchpriority="high"
        />
      </div>
      <div className="veil" />
      <div className="veil2" />
      <div className="top">
        <Label>Tréborg ehf.</Label>
        <Words tag="h1" className="tre-big" text={TEXTI.tagline} hold={0.35} />
      </div>
      <div className="base">
        <div className="tre-rise" style={step(1)}>
          <Label>{TEXTI.heroLabel}</Label>
        </div>
        <p className="tre-rise tre-lead" style={step(2)}>{TEXTI.inngangur}</p>
        <div className="tre-rise" style={step(3)}>
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
      className="tre-quote"
      id="stefna"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div className="bg" data-speed={-1}>
        <img src={PHOTO.eldhus.src} srcSet={PHOTO.eldhus.srcSet} sizes="100vw" alt={PHOTO.eldhus.alt} width={dims(PHOTO.eldhus.ratio).width} height={dims(PHOTO.eldhus.ratio).height} loading="lazy" />
      </div>
      <div className="veil" />
      <div className="tre-wrap">
        <Reveal className="card">
          <LineField top="auto" height={220} seed={4} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Label>Tréborg í eigin orðum</Label>
            <span className="qmark" aria-hidden="true">&ldquo;</span>
            <blockquote key={i} className="tre-normal" aria-live="polite">
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

export default function TreborgPage() {
  useScrollFx()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'Tréborg ehf. | Trésmiðja, sérsmíði og húsgagnasmíði í Reykjavík'
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    meta?.setAttribute(
      'content',
      'Tréborg sérsmíðar innréttingar, húsgögn, borðplötur, sólbekki og innihurðir fyrir fyrirtæki, stofnanir og einstaklinga. Húsgagnasmíði, viðgerðir og Nolte innréttingar, Eldshöfða 4 í Reykjavík.',
    )
    setThemeColor(C.paper)
    return () => {
      document.title = prevTitle
      document.documentElement.lang = prevLang
      meta?.setAttribute('content', prevDesc)
    }
  }, [])

  return (
    <div className="tre-root">
      <style>{CSS}{PAGE_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <Intro />
      <Cursor />
      <Header light />
      <StickyBar />

      <main id="efni">
        <Hero />

        <div className="tre-band paper">
          <section className="tre-about" id="um-okkur">
            <LineField top="6%" height={430} seed={2} />
            <div className="tre-wrap">
              <Reveal className="top">
                <Chapter n="1.0" />
                <div>
                  <Label>Um okkur</Label>
                  <Words tag="h2" className="tre-normal" text={TEXTI.um} />
                </div>
              </Reveal>
              <Reveal className="btm">
                <Media photo={PHOTO.fataskapur} sizes="(max-width:900px) 100vw, 26vw" className="tre-rise" />
                <p className="tre-rise" style={step(2)}>{TEXTI.starfsmenn}</p>
                <div className="tre-rise" style={step(3)}>
                  <Btn href={`mailto:${CONTACT.netfang}`} variant="ghost">Hafa samband</Btn>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="tre-serv" id="thjonusta">
            <div className="tre-wrap">
              <Reveal className="top">
                <Chapter n="1.1" />
                <p className="tre-rise tre-lead" style={{ ...step(1), maxWidth: '58ch' }}>{TEXTI.thjonusta}</p>
              </Reveal>
              <Reveal className="btm">
                <h2 className="tre-label" style={{ marginBottom: '1.4em' }}>
                  <svg className="tre-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg>
                  <span>Þjónusta</span>
                </h2>
                <ol>
                  {THJONUSTA.map((s, idx) => (
                    <li key={s.titill} className="tre-rise" style={step(idx % 3 + 1)}>
                      <span className="tre-smallert">{s.titill}</span>
                      <span className="n">{String(idx + 1).padStart(2, '0')}</span>
                      {s.texti ? <p>{s.texti}</p> : null}
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </section>
        </div>

        <div className="tre-band white">
          <section className="tre-verk" id="verkefni">
            <div className="tre-wrap">
              <Reveal className="intro">
                <Chapter n="1.2" />
                <div>
                  <Label>Verkin okkar</Label>
                  <Words tag="h2" className="tre-normal" text={TEXTI.verkH2} />
                </div>
                <p className="tre-rise" style={step(2)}>{TEXTI.verkefniIntro}</p>
              </Reveal>
              <div className="tre-grid">
                {VERK_GRID.map((v, idx) => (
                  <Reveal as="article" key={v.slug} className="tre-card">
                    <Link to={`/preview/treborg/verk/${v.slug}`} data-cursor="card" aria-label={v.stadur ? `${v.name}, ${v.flokkur.toLowerCase()}, ${v.stadur}` : `${v.name}, ${v.flokkur.toLowerCase()}`}>
                      <Media
                        photo={v.cover}
                        className="tre-rise"
                        sizes={idx === 0 ? '(max-width:760px) 100vw, 60vw' : idx < 3 ? '(max-width:760px) 100vw, 30vw' : '(max-width:760px) 100vw, 45vw'}
                      />
                      <div className="meta tre-rise" style={step(2)}>
                        <span className="tags"><span className="tre-tag">{v.flokkur}</span></span>
                        {v.stadur ? <span className="tre-tag">{v.stadur}</span> : null}
                      </div>
                      <h3 className="tre-smallt tre-rise" style={step(4)}>{v.name}</h3>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="tre-wrap"><div className="tre-divider" /></div>
          </section>

          <section className="tre-banner">
            <div className="tre-wrap">
              <Reveal className="cols">
                <Media photo={PHOTO.bokahilla} className="tre-rise" sizes="(max-width:900px) 100vw, 24vw" />
                <Words tag="h2" className="tre-normal" text="Og sérsmíði fyrir heimili." />
                <p className="tre-rise onnur" style={step(2)}>
                  {VERK_ONNUR.map((v, i) => (
                    <span key={v.slug}>
                      <Link to={`/preview/treborg/verk/${v.slug}`}>
                        {v.stutt ? (i === 0 ? v.stutt[0].toUpperCase() + v.stutt.slice(1) : v.stutt) : v.name}
                      </Link>
                      {i < VERK_ONNUR.length - 2 ? ', ' : i === VERK_ONNUR.length - 2 ? ' og ' : '.'}
                    </span>
                  ))}
                </p>
                <div className="tre-rise" style={step(3)}>
                  <Btn href={CONTACT.simiHref} variant="brand">Hringja {CONTACT.simi}</Btn>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <QuoteSlider />

        <div className="tre-band white">
          <section className="tre-culture" id="nolte">
            <div className="tre-wrap">
              <Reveal className="top">
                <Chapter n="1.3" />
                <div>
                  <Label>Nolte innréttingar</Label>
                  <Words tag="h2" className="tre-normal" text={TEXTI.nolte} />
                </div>
              </Reveal>
              <Reveal>
                <ul className="tre-teymi">
                  {NOLTE.map((m, i) => (
                    <li key={m.titill} className="tre-rise" style={step(i + 1)}>
                      <h3 className="tre-smallert">{m.titill}</h3>
                      <p>{m.texti}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        </div>

        <div className="tre-band dark" id="hafa-samband">
          <section className="tre-c2a">
            <div className="tre-wrap">
              <Reveal className="cols">
                <div>
                  <LineField top="auto" height={260} seed={7} />
                  <div className="sub" style={{ position: 'relative', zIndex: 1 }}>
                    <Chapter n="1.4" />
                    <Words tag="h2" className="tre-normal" text={TEXTI.metnadur} />
                  </div>
                  <p className="tre-rise" style={{ ...step(2), position: 'relative', zIndex: 1, marginTop: '1.4em', opacity: 0.8 }}>{TEXTI.tilbod}</p>
                  <div className="acts" style={{ position: 'relative', zIndex: 1 }}>
                    <Btn href={`mailto:${CONTACT.netfang}`} variant="light">{CONTACT.netfang}</Btn>
                    <Btn href={CONTACT.simiHref} variant="light">{CONTACT.simi}</Btn>
                  </div>
                </div>
                <Media photo={PHOTO.ionNalaegt} className="tre-rise" sizes="(max-width:900px) 100vw, 38vw" scrim={0.7} />
              </Reveal>
            </div>
          </section>
        </div>

        <footer className="tre-foot">
          <div className="tre-wrap">
            <div className="cols">
              <div>
                <h3>Fyrirtækið</h3>
                <p>Tréborg ehf.<br />kt. {CONTACT.kennitala}<br />{CONTACT.heimilisfang}, {CONTACT.stadur}<br />{CONTACT.opid}</p>
              </div>
              <div>
                <h3>Samband</h3>
                <p>
                  <a href={CONTACT.simiHref}>{CONTACT.simi}</a><br />
                  <a href={CONTACT.gsmHref}>{CONTACT.gsm}</a><br />
                  <a href={`mailto:${CONTACT.netfang}`}>{CONTACT.netfang}</a>
                </p>
              </div>
              <div>
                <h3>Verkefni</h3>
                <ul style={{ listStyle: 'none' }}>
                  {VERK_GRID.map((v) => (
                    <li key={v.slug}><Link to={`/preview/treborg/verk/${v.slug}`}>{v.name}</Link></li>
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
              <p>&copy; {new Date().getFullYear()} Tréborg ehf.</p>
            </div>
          </div>
        </footer>
      </main>

      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
