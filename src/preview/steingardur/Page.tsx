import { useEffect, useState, type CSSProperties } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ArrowButton, Btn, C, Chapter, CSS, Cursor, Header, Label, LineField, Reveal, StickyBar,
  Intro, Words, reduced, step, useGoto, useInview, useScrollFx,
} from './ui'
import {
  BADGE, CONTACT, JSON_LD, LEIDIR, LJOS_STADIR, LOGO, MARKMID, PHOTO, PHOTO_CREDIT, STADREYNDIR, STARFSMENN, STJORN,
  TEXTI, UNNIN_VERK, VERK, VIDSKIPTAVINIR, type Photo,
} from './data'
import { BriefProvider, Fleet, JobBuilder, RequestForm, TOOLS_CSS, useBrief } from './Tools'
import { PAGE_CSS_BASE } from './pageCss'

const company = getPreviewCompany('steingardur')

/* Blocks only Steingarður has. The rest is the Ægir page system in pageCss.ts. */
const PAGE_CSS = PAGE_CSS_BASE + `
.stg-hero .bg img{object-position:58% 60%}
@media (max-width:760px){.stg-hero .bg{inset:-18% 0 auto;height:128%}.stg-hero .bg img{object-position:62% 50%}
  .stg-hero{min-height:calc(100svh - 76px)}
  .stg-hero .base .stg-lead,.stg-hero .base>div:first-child{display:none}}
.stg-hero h1{max-width:16ch}
.stg-hero .ctas{display:flex;flex-wrap:wrap;gap:.7rem}
.stg-hero .ctas .stg-btn{min-width:0}
.stg-hero .stg-btn.ghost{color:#fff;border-color:rgba(255,255,255,.6);background:transparent}

.stg-stats{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--col);margin-top:calc(var(--band) / 1.4);border-top:1px solid ${C.hairline};position:relative;z-index:1}
.stg-stats li{padding-top:1.1rem}
.stg-stats b{display:block;font-family:'StgDisp',system-ui,sans-serif;font-weight:700;font-size:var(--t-normal);line-height:1;letter-spacing:-.04em;color:${C.green};font-variant-numeric:tabular-nums}
.stg-stats span{display:block;margin-top:.45em;opacity:.75}
@media (max-width:760px){.stg-stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 1rem}.stg-stats li{padding:1rem 0;border-bottom:1px solid ${C.hairline}}}
.stg-about .badges{display:flex;flex-direction:column;gap:1rem;align-items:flex-start}
.stg-about .badges img{width:auto;height:auto;max-width:min(240px,100%);object-fit:contain;border-radius:2px}
.stg-about .badges .cert{max-width:150px;box-shadow:0 18px 40px -22px rgba(0,0,0,.45)}
.stg-about .badges p{font-size:var(--t-tag);opacity:.72;max-width:30ch}

.stg-card{cursor:default}
.stg-card .stg-media .inner:after{opacity:.06}

.stg-unnin{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col)}
.stg-unnin ol{list-style:none}
.stg-unnin li{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1.6fr);gap:var(--col);padding:1.1em 0;border-top:1px solid ${C.hairline}}
.stg-unnin li:last-child{border-bottom:1px solid ${C.hairline}}
.stg-unnin li b{font-family:'StgSans',system-ui,sans-serif;font-weight:700;font-size:var(--t-smaller);line-height:1.2}
.stg-unnin li span{opacity:.78}
@media (max-width:900px){.stg-unnin{grid-template-columns:1fr;gap:1rem}.stg-unnin li{grid-template-columns:1fr;gap:.35rem}}

.stg-clients{margin-top:calc(var(--band) / 1.2)}
.stg-clients ul{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid ${C.hairline};border-left:1px solid ${C.hairline};margin-top:1.2rem}
.stg-clients li{display:grid;place-items:center;aspect-ratio:2 / 1;border-right:1px solid ${C.hairline};border-bottom:1px solid ${C.hairline};padding:1.4rem}
.stg-clients img{width:auto;height:auto;max-width:72%;max-height:68px;object-fit:contain;filter:grayscale(1) contrast(1.05);opacity:.82;transition:opacity .2s ease-out}
@media (max-width:760px){.stg-clients ul{grid-template-columns:repeat(2,minmax(0,1fr))}.stg-clients img{max-height:52px}}

.stg-ljos{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:calc(var(--col) * 2);margin-top:calc(var(--band) / 1.4);align-items:start}
.stg-ljos .big{aspect-ratio:4 / 3}
.stg-ljos .side{display:grid;gap:var(--col)}
.stg-ljos .side .stg-media{aspect-ratio:3 / 2}
.stg-ljos .stadir{list-style:none;display:flex;flex-wrap:wrap;gap:.4rem;margin-top:1rem}
.stg-ljos .stadir .stg-tag{font-size:var(--t-body);padding:.3em .75em .4em;color:${C.ink};border-color:rgba(20,23,20,.28)}
@media (max-width:900px){.stg-ljos{grid-template-columns:1fr;gap:1.6rem}}

.stg-snjo{position:relative}
.stg-snjo .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.4);position:relative;z-index:1}
.stg-snjo .body{max-width:62ch}
.stg-snjo .body p{margin-top:1.1em;opacity:.86}
.stg-snjo .grid{display:grid;grid-template-columns:1.5fr 1fr 1fr;grid-template-rows:auto auto;gap:var(--col);position:relative;z-index:1}
.stg-snjo .grid .a{grid-row:span 2;aspect-ratio:auto;min-height:100%}
.stg-snjo .grid .stg-media{aspect-ratio:4 / 3}
@media (max-width:900px){.stg-snjo .top{grid-template-columns:1fr;gap:1.2rem}.stg-snjo .grid{grid-template-columns:1fr 1fr}.stg-snjo .grid .a{grid-column:span 2;grid-row:auto;aspect-ratio:4 / 3}}

.stg-folk .cols{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:calc(var(--col) * 2);align-items:start;margin-top:calc(var(--band) / 1.4)}
.stg-folk .team{aspect-ratio:4 / 3}
.stg-folk .lead2{display:grid;gap:var(--col)}
.stg-folk .person{border-top:1px solid ${C.ink};padding-top:1rem}
.stg-folk .person h3{margin-top:.2em}
.stg-folk .person .role{font-size:var(--t-label);font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${C.green}}
.stg-folk .person .links{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.9rem}
.stg-folk .person .links a{font-size:var(--t-label);font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:.85em 1em;border:1px solid ${C.ink};border-radius:var(--rad);min-height:44px;display:inline-flex;align-items:center;transition:background .3s,color .3s}
.stg-folk .selfie{aspect-ratio:4 / 3}
.stg-folk .crew{margin-top:calc(var(--band) / 1.6)}
.stg-folk .crew ul{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0 var(--col);margin-top:1rem}
.stg-folk .crew li{padding:.75em 0;border-top:1px solid ${C.hairline};font-size:var(--t-lead)}
@media (max-width:900px){.stg-folk .cols{grid-template-columns:1fr;gap:2rem}.stg-folk .crew ul{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:420px){.stg-folk .crew ul{grid-template-columns:1fr}}

.stg-c2a .staffwrap{position:relative;z-index:1}
.stg-c2a .facts .stg-media{aspect-ratio:2 / 1;margin-top:.8rem}
.stg-foot .brandline img{width:150px;height:auto;margin-bottom:1rem}
@media (hover:hover) and (pointer:fine){
  .stg-clients li:hover img{filter:none;opacity:1}
  .stg-folk .person .links a:hover{background:${C.ink};color:#fff}
}
`

const dims = (ratio: string) => {
  const [w, h] = ratio.split('/').map((n) => Number(n.trim()))
  return { width: 1920, height: Math.round((1920 * h) / w) }
}

export function Media({ photo, speed = -1, scrim = 0.9, caption, className = '', sizes = '100vw', priority, style, pos }: {
  photo: Photo
  speed?: number
  scrim?: number
  caption?: string
  className?: string
  sizes?: string
  priority?: boolean
  style?: CSSProperties
  pos?: string
}) {
  return (
    <figure className={`stg-media ${className}`} style={style}>
      <div className="inner" data-speed={speed}>
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes={sizes}
          alt={photo.alt}
          width={dims(photo.ratio).width}
          height={dims(photo.ratio).height}
          style={pos ? { objectPosition: pos } : undefined}
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
  const goto = useGoto()
  const p = PHOTO.beltagrafa
  return (
    <div className="stg-hero" ref={ref}>
      <div className="bg" data-speed={-20} data-anchor="top">
        <img
          src={p.src}
          srcSet={p.srcSet}
          sizes="100vw"
          alt={p.alt}
          width={dims(p.ratio).width}
          height={dims(p.ratio).height}
          // @ts-expect-error fetchpriority is valid HTML, React types lag
          fetchpriority="high"
        />
      </div>
      <div className="veil" />
      <div className="veil2" />
      <div className="top">
        <Label>Steingarður ehf. · Hafnarfjörður</Label>
        <Words tag="h1" className="stg-big" text={TEXTI.tagline} hold={0.35} />
      </div>
      <div className="base">
        <div className="stg-rise" style={step(1)}>
          <Label>{TEXTI.heroLabel}</Label>
        </div>
        <p className="stg-rise stg-lead" style={step(2)}>{TEXTI.inngangur}</p>
        <div className="stg-rise ctas" style={step(3)}>
          <Btn href="#verkbeidni" variant="light" onClick={() => goto('#verkbeidni')}>Fá tilboð</Btn>
          <Btn href={CONTACT.simiHref} variant="ghost">{CONTACT.simi}</Btn>
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
  const bg = PHOTO.jcbMerkt
  return (
    <section
      className="stg-quote"
      id="stefna"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div className="bg" data-speed={-1}>
        <img src={bg.src} srcSet={bg.srcSet} sizes="100vw" alt="" width={dims(bg.ratio).width} height={dims(bg.ratio).height} loading="lazy" style={{ objectPosition: '50% 70%' }} />
      </div>
      <div className="veil" />
      <div className="stg-wrap">
        <Reveal className="card">
          <LineField top="auto" height={220} seed={4} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Label>Steingarður í fjórum línum</Label>
            <span className="qmark" aria-hidden="true">&ldquo;</span>
            <blockquote key={i} className="stg-normal" aria-live="polite">
              <Words tag="span" text={MARKMID[i]} hold={0.05} />
            </blockquote>
            <div className="row">
              <p className="count">
                {String(i + 1).padStart(2, '0')} <span aria-hidden="true">|</span> {String(n).padStart(2, '0')}
              </p>
              <div className="nav">
                <ArrowButton dir="left" label="Fyrri lína" onClick={() => go(-1)} />
                <ArrowButton dir="right" label="Næsta lína" onClick={() => go(1)} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SectionHead({ n, label, h2, children }: { n: string; label: string; h2: string; children?: React.ReactNode }) {
  return (
    <Reveal className="stg-head2">
      <div className="top">
        <Chapter n={n} />
        <div className="body">
          <Label>{label}</Label>
          <Words tag="h2" className="stg-normal" text={h2} />
          {children}
        </div>
      </div>
    </Reveal>
  )
}

function Ways() {
  const brief = useBrief()
  const goto = useGoto()
  return (
    <ul className="stg-ways">
      {LEIDIR.map((l, i) => (
        <Reveal as="li" key={l.id}>
          <a
            href={l.id === 'snjomokstur' ? '#snjomokstur' : '#verkbeidni'}
            data-cursor="card"
            onClick={(e) => {
              e.preventDefault()
              if (l.id === 'snjomokstur') { goto('#snjomokstur'); return }
              if (!brief.verk.tegundir.includes(l.verk)) brief.toggleTegund(l.verk)
              goto('#verkbeidni')
            }}
          >
            <Media photo={l.photo} className="stg-rise" sizes="(max-width:560px) 100vw, (max-width:1080px) 46vw, 22vw" />
            <span className="n stg-rise" style={step(1)}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className="stg-smallt stg-rise" style={step(2)}>{l.titill}</h3>
            <p className="stg-rise" style={step(3)}>{l.texti}</p>
            <span className="go stg-rise" style={step(4)}>{l.id === 'snjomokstur' ? 'Sjá snjómokstur' : 'Setja í verkbeiðni'}</span>
          </a>
        </Reveal>
      ))}
    </ul>
  )
}

function HomeBody() {
  const brief = useBrief()
  const goto = useGoto()
  return (
    <main id="efni">
      <Hero />

      <div className="stg-band paper">
        <section className="stg-about" id="um-okkur">
          <LineField top="4%" height={430} seed={2} />
          <div className="stg-wrap">
            <Reveal className="top">
              <Chapter n="1.0" />
              <div>
                <Label>Um Steingarð</Label>
                <Words tag="h2" className="stg-normal" text={TEXTI.umH2} />
              </div>
            </Reveal>
            <Reveal className="btm">
              <Media photo={PHOTO.hopur} sizes="(max-width:900px) 100vw, 26vw" className="stg-rise" pos="50% 60%" />
              <div className="stg-rise" style={step(2)}>
                <p className="stg-lead">{TEXTI.inngangur}</p>
                <p>{TEXTI.thjonustaIntro}</p>
              </div>
              <div className="stg-rise badges" style={step(3)}>
                <img src={BADGE.framurskarandi} alt="Framúrskarandi fyrirtæki 2020–2025, merki Creditinfo" width={382} height={82} loading="lazy" />
                <img className="cert" src={BADGE.vidurkenning} alt="Viðurkenningarskjal Creditinfo: Steingarður ehf. er Framúrskarandi fyrirtæki 2024" width={377} height={529} loading="lazy" />
                <p>Framúrskarandi fyrirtæki hjá Creditinfo sex ár í röð.</p>
              </div>
            </Reveal>
            <Reveal as="div">
              <ul className="stg-stats">
                {STADREYNDIR.map((s, i) => (
                  <li key={s.texti} className="stg-rise" style={step(i)}><b>{s.tala}</b><span>{s.texti}</span></li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="stg-serv" id="thjonusta">
          <div className="stg-wrap">
            <Reveal className="top">
              <Chapter n="1.1" />
              <div>
                <Label>Þjónusta</Label>
                <p className="stg-rise stg-lead" style={{ ...step(1), maxWidth: '58ch', marginTop: '.6em' }}>Fjögur svið, eitt símanúmer. Veldu svið og það fer beint í verkbeiðnina.</p>
              </div>
            </Reveal>
            <Ways />
          </div>
        </section>
      </div>

      <div className="stg-band white">
        <section className="stg-verk" id="verkefni">
          <div className="stg-wrap">
            <Reveal className="intro">
              <Chapter n="1.2" />
              <div>
                <Label>Verkin</Label>
                <Words tag="h2" className="stg-normal" text={TEXTI.verkH2} />
              </div>
              <p className="stg-rise" style={step(2)}>{TEXTI.verkIntro}</p>
            </Reveal>
            <div className="stg-grid">
              {VERK.map((v, idx) => (
                <Reveal as="article" key={v.slug} className="stg-card">
                  <Media
                    photo={v.cover}
                    className="stg-rise"
                    sizes={idx === 0 ? '(max-width:760px) 100vw, 60vw' : idx < 3 ? '(max-width:760px) 100vw, 30vw' : '(max-width:760px) 100vw, 45vw'}
                  />
                  <div className="meta stg-rise" style={step(2)}>
                    <span className="tags"><span className="stg-tag">{v.flokkur}</span></span>
                    {v.stadur ? <span className="stg-tag">{v.stadur}</span> : null}
                  </div>
                  <h3 className="stg-smallt stg-rise" style={step(4)}>{v.name}</h3>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="stg-wrap"><div className="stg-divider" /></div>
        </section>

        <section>
          <div className="stg-wrap">
            <Reveal className="stg-unnin">
              <div className="stg-rise"><Label>Unnin verk</Label></div>
              <ol>
                {UNNIN_VERK.map((u, i) => (
                  <li key={u.titill} className="stg-rise" style={step(i)}><b>{u.titill}</b><span>{u.stadir}</span></li>
                ))}
              </ol>
            </Reveal>
            <Reveal className="stg-clients" as="div">
              <Label>Viðskiptavinir</Label>
              <ul>
                {VIDSKIPTAVINIR.map((v, i) => (
                  <li key={v.nafn} className="stg-rise" style={step(i % 4)}>
                    <img src={v.logo} alt={v.nafn} loading="lazy" decoding="async" />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      </div>

      <QuoteSlider />

      <div className="stg-band paper">
        <section id="ljosleidari" style={{ position: 'relative' }}>
          <LineField top="0" height={430} seed={3} />
          <div className="stg-wrap" style={{ position: 'relative', zIndex: 1 }}>
            <SectionHead n="1.3" label="Ljósleiðari" h2={TEXTI.ljosH2}>
              <p className="stg-rise stg-lead" style={step(3)}>Steingarður hefur lagt ljósleiðara í þrettán bæjum og hverfum, frá Borgarnesi og Hvanneyri til Grindavíkur og Voga.</p>
            </SectionHead>
            <Reveal className="stg-ljos">
              <Media photo={PHOTO.ljosGata} className="stg-rise big" sizes="(max-width:900px) 100vw, 54vw" />
              <div>
                <div className="side">
                  <Media photo={PHOTO.kobelcoKefli} className="stg-rise" style={step(1)} sizes="(max-width:900px) 100vw, 36vw" />
                  <Media photo={PHOTO.ljosSkapur} className="stg-rise" style={step(2)} sizes="(max-width:900px) 100vw, 36vw" />
                </div>
                <div style={{ marginTop: '1.6rem' }}>
                  <Label>Þar sem Steingarður hefur lagt ljósleiðara</Label>
                  <ul className="stadir stg-rise" style={step(3)}>
                    {LJOS_STADIR.map((s) => <li key={s}><span className="stg-tag">{s}</span></li>)}
                  </ul>
                </div>
                <div className="stg-rise" style={{ ...step(4), marginTop: '1.6rem' }}>
                  <Btn href="#verkbeidni" variant="brand" onClick={() => {
                    brief.setVerk({ lagnir: brief.verk.lagnir.includes('Ljósleiðari') ? brief.verk.lagnir : [...brief.verk.lagnir, 'Ljósleiðari'] })
                    if (!brief.verk.tegundir.includes('heimlagnir')) brief.toggleTegund('heimlagnir')
                    goto('#verkbeidni')
                  }}>Ljósleiðari í verkbeiðni</Btn>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <div className="stg-band white">
        <section id="taekjakostur">
          <div className="stg-wrap">
            <SectionHead n="1.4" label="Tækjakostur" h2={TEXTI.tackH2}>
              <p className="stg-rise stg-lead" style={step(3)}>{TEXTI.tackIntro}</p>
            </SectionHead>
            <Reveal>
              <Fleet />
            </Reveal>
          </div>
        </section>
      </div>

      <div className="stg-band paper">
        <section id="verkbeidni" style={{ position: 'relative' }}>
          <LineField top="0" height={380} seed={5} />
          <div className="stg-wrap" style={{ position: 'relative', zIndex: 1 }}>
            <SectionHead n="1.5" label="Verkbeiðni" h2={TEXTI.beidniH2}>
              <p className="stg-rise stg-lead" style={step(3)}>{TEXTI.beidniIntro}</p>
            </SectionHead>
            <Reveal>
              <JobBuilder />
            </Reveal>
          </div>
        </section>
      </div>

      <div className="stg-band dark">
        <section className="stg-snjo" id="snjomokstur">
          <LineField top="0" height={380} seed={6} />
          <div className="stg-wrap" style={{ position: 'relative', zIndex: 1 }}>
            <Reveal className="top">
              <Chapter n="1.6" />
              <div className="body">
                <Label>Snjómokstur</Label>
                <Words tag="h2" className="stg-normal" text={TEXTI.snjoH2} />
                <p className="stg-rise" style={step(3)}>{TEXTI.snjoIntro}</p>
                <div className="stg-rise" style={{ ...step(4), marginTop: '1.6rem' }}>
                  <Btn href="#hafa-samband" variant="light" onClick={() => brief.senda('snjo')}>Biðja um snjómokstur</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal className="grid">
              <Media photo={PHOTO.snjoNott} className="stg-rise a" sizes="(max-width:900px) 100vw, 44vw" />
              <Media photo={PHOTO.snjoKlefi} className="stg-rise" style={step(1)} sizes="(max-width:900px) 50vw, 26vw" />
              <Media photo={PHOTO.snjoTvaer} className="stg-rise" style={step(2)} sizes="(max-width:900px) 50vw, 26vw" />
              <Media photo={PHOTO.snjoJcb} className="stg-rise" style={step(3)} sizes="(max-width:900px) 50vw, 26vw" />
              <Media photo={PHOTO.miniDusk} className="stg-rise" style={step(4)} sizes="(max-width:900px) 50vw, 26vw" />
            </Reveal>
          </div>
        </section>
      </div>

      <div className="stg-band white">
        <section className="stg-folk" id="starfsfolk">
          <div className="stg-wrap">
            <SectionHead n="1.7" label="Starfsfólk" h2={TEXTI.folkH2}>
              <p className="stg-rise" style={step(3)}>{TEXTI.folkIntro}</p>
            </SectionHead>
            <Reveal className="cols">
              <Media photo={PHOTO.hopur} className="stg-rise team" sizes="(max-width:900px) 100vw, 54vw" />
              <div className="lead2">
                {STJORN.map((s, i) => (
                  <div key={s.nafn} className="person stg-rise" style={step(i + 1)}>
                    <p className="role">{s.starf}</p>
                    <h3 className="stg-smallt">{s.nafn}</h3>
                    <div className="links">
                      <a href={`mailto:${CONTACT.netfang}?subject=${encodeURIComponent(`Til ${s.thgf}`)}`}>Senda {s.fornafn} póst</a>
                      <a href={CONTACT.simiHref}>Hringja</a>
                    </div>
                  </div>
                ))}
                <Media photo={PHOTO.bogdanRunar} className="stg-rise selfie" style={step(3)} caption="Bogdan og Rúnar á Heklureit" sizes="(max-width:900px) 100vw, 36vw" />
              </div>
            </Reveal>
            <Reveal className="crew" as="div">
              <Label>Með þeim vinna</Label>
              <ul>
                {STARFSMENN.map((s, i) => <li key={s} className="stg-rise" style={step(i % 4)}>{s}</li>)}
              </ul>
            </Reveal>
          </div>
        </section>
      </div>

      <div className="stg-band dark" id="hafa-samband">
        <section className="stg-c2a">
          <LineField top="auto" height={300} seed={7} />
          <div className="stg-wrap">
            <Reveal className="head">
              <Chapter n="1.8" />
              <div>
                <Label>Hafa samband</Label>
                <Words tag="h2" className="stg-normal" text={TEXTI.tilbodH2} />
                <p className="l stg-rise" style={step(3)}>{TEXTI.tilbodIntro}</p>
              </div>
            </Reveal>
            <Reveal className="reqwrap">
              <RequestForm />
            </Reveal>
            <Reveal className="facts">
              <div className="stg-rise">
                <h3>Heimilisfang</h3>
                <p>Steingarður ehf.<br />{CONTACT.heimilisfang}<br />{CONTACT.postnumer}</p>
              </div>
              <div className="stg-rise" style={step(1)}>
                <h3>Sími</h3>
                <p><a href={CONTACT.simiHref}>{CONTACT.simi}</a></p>
              </div>
              <div className="stg-rise" style={step(2)}>
                <h3>Netfang</h3>
                <p><a href={`mailto:${CONTACT.netfang}`}>{CONTACT.netfang}</a></p>
              </div>
              <div className="stg-rise" style={step(3)}>
                <h3>Facebook</h3>
                <p><a href={CONTACT.facebook} rel="noopener" target="_blank">facebook.com/Steingardur</a></p>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <footer className="stg-foot">
        <div className="stg-wrap">
          <div className="cols">
            <div className="brandline">
              <img src={LOGO} alt="Steingarður" width={573} height={158} loading="lazy" />
              <p>Steingarður ehf.<br />{CONTACT.heimilisfang}, {CONTACT.postnumer}</p>
            </div>
            <div>
              <h3>Samband</h3>
              <p>
                <a href={CONTACT.simiHref}>{CONTACT.simi}</a><br />
                <a href={`mailto:${CONTACT.netfang}`}>{CONTACT.netfang}</a>
              </p>
            </div>
            <div>
              <h3>Þjónusta</h3>
              <ul style={{ listStyle: 'none' }}>
                {LEIDIR.map((l) => <li key={l.id}><a href={l.id === 'snjomokstur' ? '#snjomokstur' : '#thjonusta'} onClick={(e) => { e.preventDefault(); goto(l.id === 'snjomokstur' ? '#snjomokstur' : '#thjonusta') }}>{l.titill}</a></li>)}
              </ul>
            </div>
            <div>
              <h3>Á síðunni</h3>
              <ul style={{ listStyle: 'none' }}>
                {[['Ljósleiðari', '#ljosleidari'], ['Tækjakostur', '#taekjakostur'], ['Verkbeiðni', '#verkbeidni'], ['Starfsfólk', '#starfsfolk']].map(([t, h]) => (
                  <li key={h}><a href={h} onClick={(e) => { e.preventDefault(); goto(h) }}>{t}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rule" />
          <div className="fine">
            <p>{PHOTO_CREDIT}</p>
            <p>&copy; {new Date().getFullYear()} Steingarður ehf.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default function SteingardurPage() {
  useScrollFx()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'Steingarður ehf. | Jarðvinna, heimlagnir, ljósleiðari og snjómokstur'
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    meta?.setAttribute(
      'content',
      'Steingarður ehf. í Hafnarfirði sér um jarðvinnu, lóðagerð, heimtaugalagnir, ljósleiðara, gatnagerð og snjómokstur. Stofnað 2006. Sendu verkbeiðni á netinu.',
    )
    setThemeColor(C.paper)
    return () => {
      document.title = prevTitle
      document.documentElement.lang = prevLang
      meta?.setAttribute('content', prevDesc)
    }
  }, [])

  return (
    <div className="stg-root">
      <style>{CSS}{PAGE_CSS}{TOOLS_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <Intro />
      <Cursor />
      <Header light />
      <StickyBar />
      <BriefProvider>
        <HomeBody />
      </BriefProvider>
      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
