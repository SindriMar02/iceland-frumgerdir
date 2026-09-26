import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight, BedDouble, Home as House, ShowerHead, Wifi } from 'lucide-react'
import {
  IMG, ROOT, BOOKING_URL, PHONE_HREF, EMAIL, EMAIL_HREF, MAP_EMBED, MAP_LINK, REVIEWS,
  HERO_FILM, HERO, INTRO, EXPERIENCE, STAY, COTTAGES, OWNERS, FOOD, REVIEWS_TEASER,
  HISTORY, CAMPSITE, INFO, CLOSING,
} from './data'
import type { Review } from './data'
import { Accordion, Eyebrow, Photo, Title, useNavTo } from './shell'

/* Home, v4. The order is the Edelhaus board's: film hero, staggered serif
   intro, a full-bleed photo chapter with a framed card, rooms with icons and
   a photo strip, food cards, a full-bleed closing, the dark footer. The page
   moves the MRC way (TEARDOWN.md): the hero stays put and a rounded sheet
   (our Fagravík grammar) slides up over it. */

export const HOME_CSS = `
/* intro */
.bj3 .intro{padding:var(--sec) 0}
.bj3 .intro .grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(32px,6vw,110px);align-items:end}
.bj3 .intro .head{display:grid;gap:clamp(18px,2vw,28px)}
.bj3 .intro .text{display:grid;gap:28px;padding-bottom:.6em}
@media (max-width:899px){.bj3 .intro .grid{grid-template-columns:1fr}}

/* full-bleed chapters: the image is taller than its frame and lags it (MRC 1/15) */
.bj3 .bleed{position:relative;overflow:hidden;color:var(--on)}
.bj3 .bleed>.pic{position:absolute;inset:0;background:#3A3B37}
.bj3 .bleed>.pic img{will-change:transform}
.bj3 .bleed .shade{position:absolute;inset:0;pointer-events:none}

/* experience: the lake, a framed card over it */
.bj3 .exp{min-height:max(118svh,760px);display:flex;flex-direction:column;align-items:center;padding:clamp(96px,14vw,180px) var(--gut) clamp(72px,10vw,140px);text-align:center}
.bj3 .exp .shade{background:linear-gradient(180deg,rgba(18,18,16,.5) 0%,rgba(18,18,16,.12) 46%,rgba(18,18,16,.28) 100%)}
.bj3 .exp .copy{position:relative;display:grid;justify-items:center;gap:22px;max-width:760px}
.bj3 .exp .copy .body{color:rgba(245,244,241,.9);max-width:44ch;text-shadow:0 1px 18px rgba(0,0,0,.25)}
.bj3 .exp .frame{position:relative;margin-top:clamp(56px,9vw,120px);width:min(460px,100%);background:var(--paper);color:var(--ink);border-radius:var(--r);padding:12px 12px 26px;text-align:left;
  box-shadow:0 30px 60px -30px rgba(10,10,8,.45)}
.bj3 .exp .frame .pic{border-radius:8px}
.bj3 .exp .frame h3{margin:22px 14px 6px}
.bj3 .exp .frame p{margin:0 14px;color:var(--text)}

/* stay: icons and the expanding strip */
.bj3 .stay{padding:var(--sec) 0}
.bj3 .stay .head{display:grid;justify-items:center;gap:22px;text-align:center}
.bj3 .icons{display:flex;flex-wrap:wrap;justify-content:center;gap:14px clamp(28px,5vw,72px);margin:clamp(40px,5vw,64px) 0 clamp(48px,6vw,80px);padding:0;list-style:none}
.bj3 .icons li{display:grid;justify-items:center;gap:12px;font-size:.95rem;color:var(--text)}
@media (max-width:560px){.bj3 .icons{display:grid;grid-template-columns:1fr 1fr;gap:28px 12px}}
.bj3 .icons li i{display:grid;place-items:center;width:62px;height:62px;border-radius:50%;border:1px solid var(--line);color:var(--ink)}
.bj3 .strip{display:flex;gap:10px;height:clamp(420px,62vh,640px);list-style:none;margin:0;padding:0}
.bj3 .strip li{flex:1 1 0;min-width:0;transition:flex-grow .8s var(--ease)}
.bj3 .strip li[data-on="true"]{flex-grow:3.4}
.bj3 .strip a{position:relative;display:block;height:100%;border-radius:var(--r);overflow:hidden;color:var(--on);text-decoration:none;background:#3A3B37}
.bj3 .strip .pic{position:absolute;inset:0}
.bj3 .strip .pic img{transition:transform 1.2s var(--ease)}
.bj3 .strip li[data-on="true"] .pic img{transform:scale(1.04)}
.bj3 .strip a::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,18,16,0) 52%,rgba(18,18,16,.55) 100%)}
.bj3 .strip .lab{position:absolute;left:22px;right:22px;bottom:20px;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:12px}
.bj3 .strip .lab span{font-family:var(--serif);font-size:clamp(1.3rem,1.8vw,1.75rem);font-weight:300;white-space:nowrap}
.bj3 .strip .lab i{flex:none;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--on);color:var(--ink);opacity:0;transform:scale(.9);transition:opacity .4s ease,transform .5s var(--ease)}
.bj3 .strip li[data-on="true"] .lab i{opacity:1;transform:none}
.bj3 .strip .lab span{transition:opacity .4s ease}
@media (min-width:900px){.bj3 .strip li:not([data-on="true"]) .lab span{writing-mode:vertical-rl;transform:rotate(180deg);font-size:clamp(1.2rem,1.5vw,1.5rem)}}
.bj3 .stay .more{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:clamp(36px,4vw,56px)}
@media (max-width:899px){
  .bj3 .strip{height:auto;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(var(--gut) * -1);padding:0 var(--gut);scrollbar-width:none;-webkit-overflow-scrolling:touch}
  .bj3 .strip::-webkit-scrollbar{display:none}
  .bj3 .strip li,.bj3 .strip li[data-on="true"]{flex:0 0 76%;scroll-snap-align:center;aspect-ratio:4/5}
  .bj3 .strip .lab i{opacity:1;transform:none}
}

/* cottages */
.bj3 .cott{padding:0 0 var(--sec)}
.bj3 .cott .grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,6vw,110px);align-items:end}
.bj3 .cott .text{display:grid;gap:26px;padding-bottom:clamp(0px,2vw,24px)}
.bj3 .cott .rounded{border-radius:var(--r)}
@media (max-width:899px){.bj3 .cott .grid{grid-template-columns:1fr}.bj3 .cott .text{order:2}}

/* owners: the MRC colour band, in the red of the house's own band */
.bj3 .owners{display:grid;grid-template-columns:43.5% 1fr;background:var(--band);color:var(--on);min-height:100svh}
.bj3 .owners .panel{position:relative;overflow:hidden;min-height:420px}
.bj3 .owners .panel .pic{position:absolute;inset:0}
.bj3 .owners .text{padding:clamp(72px,9vw,150px) clamp(24px,8vw,150px) clamp(72px,9vw,150px) clamp(24px,5.5vw,96px);display:grid;align-content:center;gap:28px}
.bj3 .owners .body{color:rgba(245,244,241,.86);max-width:50ch}
.bj3 .owners .tlink{justify-self:start;color:var(--on)}
@media (max-width:899px){.bj3 .owners{grid-template-columns:1fr;min-height:0}.bj3 .owners .panel{order:2;aspect-ratio:4/3;min-height:0}}

/* food: one photo-led spread. The dining room leads, the quote and three short cards sit beside it */
.bj3 .food{padding:var(--sec) 0}
.bj3 .food .spread{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);grid-template-areas:"photo head" "photo said" "photo meals";
  column-gap:clamp(32px,6vw,110px);row-gap:clamp(32px,4vw,56px);align-items:start}
.bj3 .food .lead{grid-area:photo;border-radius:var(--r)}
.bj3 .food .head{grid-area:head;display:grid;gap:22px}
.bj3 .food .said{grid-area:said;margin:0}
.bj3 .food .said blockquote{margin:0}
.bj3 .food .q{font-family:var(--serif);font-weight:300;font-style:italic;font-size:clamp(1.45rem,2.4vw,2.2rem);line-height:1.24;letter-spacing:-.01em;text-wrap:pretty}
.bj3 .food .said figcaption{margin-top:18px;font-size:.95rem;color:var(--mute)}
.bj3 .food .said figcaption strong{color:var(--ink);font-weight:560}
.bj3 .meals{grid-area:meals;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,1.2vw,16px);list-style:none;margin:0;padding:0}
.bj3 .meal{background:var(--paper);border-radius:var(--r);padding:clamp(20px,2vw,28px);display:grid;gap:8px;align-content:start}
.bj3 .meal .t-h3{font-size:1.3rem}
@media (max-width:1199px){.bj3 .meals{grid-template-columns:1fr}}
.bj3 .meal p{color:var(--text);font-size:.95rem;line-height:1.55}
@media (max-width:899px){.bj3 .food .spread{grid-template-columns:1fr;grid-template-areas:"head" "photo" "said" "meals"}.bj3 .meals{grid-template-columns:1fr}}

/* reviews: three drifting columns (21st.dev Infinite Testimonials Scroller, ported to CSS) */
.bj3 .voices{padding:0 0 var(--sec)}
.bj3 .voices .head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:clamp(36px,4.5vw,64px)}
.bj3 .voices .head>div{display:grid;gap:18px}
.bj3 .drift{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.6vw,20px);height:clamp(520px,68vh,700px);overflow:hidden;
  -webkit-mask-image:linear-gradient(to bottom,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(to bottom,transparent,#000 12%,#000 88%,transparent)}
.bj3 .drift .col{display:flex;flex-direction:column;gap:clamp(12px,1.6vw,20px);animation:bj3-drift var(--d,44s) linear infinite}
.bj3 .drift:hover .col,.bj3 .drift:focus-within .col,.bj3 .drift[data-paused="true"] .col{animation-play-state:paused}
.bj3 .drift .card{border-top:1px solid var(--line);padding:clamp(20px,2vw,26px) 0 clamp(26px,2.6vw,34px);display:grid;gap:18px;margin:0}
.bj3 .drift .card.short blockquote{font-family:var(--serif);font-weight:300;font-size:clamp(1.3rem,1.6vw,1.55rem);line-height:1.3;color:var(--ink)}
.bj3 .drift .card blockquote{margin:0;font-size:1.02rem;line-height:1.6;color:var(--text)}
.bj3 .drift .card footer{display:grid;gap:2px;font-size:.88rem;color:var(--mute)}
.bj3 .drift .card footer strong{font-family:var(--serif);font-weight:400;font-size:1.15rem;color:var(--ink)}
.bj3 .drift-ctl{all:unset;cursor:pointer;display:inline-flex;align-items:center;min-height:44px;font-size:.92rem;font-weight:520;text-decoration:underline;text-underline-offset:.28em;margin-top:14px}
.bj3 .drift-ctl:focus-visible{outline:2px solid var(--band);outline-offset:3px}
@keyframes bj3-drift{from{transform:translateY(0)}to{transform:translateY(calc(-50% - clamp(6px,.8vw,10px)))}}
@media (max-width:1023px){.bj3 .drift{grid-template-columns:1fr 1fr}.bj3 .drift .c3{display:none}}
@media (max-width:640px){.bj3 .drift{grid-template-columns:1fr}.bj3 .drift .c2{display:none}}
@media (prefers-reduced-motion:reduce){.bj3 .drift{height:auto;-webkit-mask-image:none;mask-image:none}.bj3 .drift .dup,.bj3 .drift-ctl{display:none}}

/* history: the years fold open */
.bj3 .saga{padding:var(--sec) 0;background:var(--paper)}
.bj3 .saga .grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,6vw,110px);align-items:start}
.bj3 .saga .left{display:grid;gap:clamp(32px,4vw,56px);position:sticky;top:110px}
.bj3 .saga .left .pic{border-radius:var(--r)}
.bj3 .saga .yr{font-family:var(--serif);font-weight:300;font-variant-numeric:lining-nums;display:inline-block;min-width:3.4em}
.bj3 .saga .acc-inner p{max-width:52ch;color:var(--text);padding-left:calc(3.4em * 1.6)}
@media (max-width:899px){.bj3 .saga .grid{grid-template-columns:1fr}.bj3 .saga .left{position:static}.bj3 .saga .acc-inner p{padding-left:0}}

/* practical: folds + map */
.bj3 .info{padding:var(--sec) 0}
.bj3 .info .grid{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:clamp(32px,6vw,110px);align-items:start}
.bj3 .info .left{display:grid;gap:clamp(32px,4vw,52px)}
.bj3 .info .contact{display:flex;flex-wrap:wrap;gap:12px}
.bj3 .info .camp p{max-width:52ch;color:var(--text);margin-bottom:18px}
.bj3 .info .map{display:block;width:100%;aspect-ratio:4/5;border:0;border-radius:var(--r);background:#DAD9D5}
.bj3 .info .maplink{display:inline-block;margin-top:14px}
@media (max-width:899px){.bj3 .info .grid{grid-template-columns:1fr}.bj3 .info .map{aspect-ratio:4/3}}
@media (max-width:420px){.bj3 .facts{grid-template-columns:1fr;gap:2px}.bj3 .facts dd{margin-bottom:10px}}

/* closing: full bleed, booking at the bottom (house rule) */
.bj3 .closing{min-height:max(100svh,640px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(32px,4vw,52px);padding:120px var(--gut);text-align:center}
.bj3 .closing .shade{background:rgba(18,18,16,.34)}
.bj3 .closing .t-h2{position:relative;font-size:clamp(2.8rem,7vw,6rem)}
.bj3 .closing .ctas{position:relative;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:18px 28px}
.bj3 .closing .pill-light{background:rgba(18,18,16,.46);border-color:rgba(245,244,241,.62)}
.bj3 .closing .pill-light:hover{background:var(--on);color:var(--ink)}
.bj3 .big-round{display:grid;place-items:center;width:clamp(128px,12vw,164px);aspect-ratio:1;border-radius:50%;background:var(--on);color:var(--ink);text-decoration:none;font-weight:560;font-size:1rem;
  transition:transform .6s var(--ease),background-color .3s ease,color .3s ease}
.bj3 .big-round span{display:grid;justify-items:center;gap:6px}
@media (hover:hover) and (pointer:fine){.bj3 .big-round:hover{transform:scale(1.06);background:var(--band);color:var(--on)}}
.bj3 .big-round:active{transform:scale(.97)}
`

const ICONS = { bed: BedDouble, house: House, bath: ShowerHead, wifi: Wifi }

function Hero() {
  const film = useRef<HTMLVideoElement>(null)
  /* reduced motion: the poster only, and the film is not even fetched */
  const [still, setStill] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setStill(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  useEffect(() => {
    const v = film.current
    if (!v) return
    v.muted = true
    if (still) { v.pause(); return }
    gsap.registerPlugin(ScrollTrigger)
    /* the film only plays while it can be seen; the sheet covers it after one screen */
    const play = () => { v.play().catch(() => {}) }
    const st = ScrollTrigger.create({
      start: 0,
      end: () => window.innerHeight * 1.05,
      onLeave: () => v.pause(),
      onEnterBack: play,
    })
    /* scroll 0 sits on the start edge, which ScrollTrigger counts as outside */
    if (window.scrollY < window.innerHeight * 1.05) play()
    return () => { st.kill(); v.pause() }
  }, [still])
  const letters = [...HERO.name]
  return (
    <section className="hero" data-hero aria-labelledby="bj3-h1">
      <div className="hero-media">
        <video ref={film} muted loop playsInline preload={still ? 'none' : 'auto'} poster={HERO_FILM.posterS} aria-hidden="true" tabIndex={-1}>
          <source media="(min-width: 901px)" src={HERO_FILM.src} type="video/mp4" />
          <source src={HERO_FILM.srcS} type="video/mp4" />
        </video>
      </div>
      <div className="hero-grad" />
      <div className="hero-tint" />
      {/* the scroll fade sits on this wrapper: the children's CSS entrances (fill: both) would override it */}
      <div className="hero-copy hero-leave">
        <h1 id="bj3-h1" className="hero-name" aria-label="Hótel Bjarkalundur" translate="no">
          <span className="mask" aria-hidden="true">
            {letters.map((c, i) => <span key={i} className="ch" style={{ '--i': i } as CSSProperties}>{c}</span>)}
          </span>
        </h1>
        <p className="hero-sub">{HERO.sub}</p>
        <div className="hero-ctas">
          <a className="pill" href={BOOKING_URL} target="_blank" rel="noreferrer">{HERO.book}</a>
          <Link className="tlink" to={`${ROOT}/gisting`} viewTransition style={{ color: 'var(--on)' }}>{STAY.cta}</Link>
        </div>
      </div>
    </section>
  )
}

function Strip() {
  const [on, setOn] = useState(0)
  const navTo = useNavTo()
  return (
    <ul className="strip rv-up">
      {STAY.strip.map((s, i) => (
        <li key={s.label} data-on={on === i} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)}>
          <Link to={s.to} viewTransition onClick={(e) => navTo(s.to, e)}>
            <Photo pic={IMG[s.pic]} sizes="(max-width: 899px) 76vw, 44vw" ratio="auto" />
            <span className="lab"><span>{s.label}</span><i aria-hidden="true"><ArrowUpRight size={18} strokeWidth={1.5} /></i></span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export const quote = (r: Review) => (r.lang === 'en' ? `“${r.text}${r.excerpt ? ' …' : ''}”` : `„${r.text}${r.excerpt ? ' …' : ''}“`)

function Card({ r, dup }: { r: Review; dup?: boolean }) {
  return (
    <figure className={`card${r.text.length < 160 ? ' short' : ''}${dup ? ' dup' : ''}`} aria-hidden={dup || undefined} lang={r.lang}>
      <blockquote><p>{quote(r)}</p></blockquote>
      <footer lang="is">
        <strong>{r.name}</strong>
        <span>{r.source}, {r.when.toLowerCase()}</span>
      </footer>
    </figure>
  )
}

function Drift() {
  const [paused, setPaused] = useState(false)
  const cols = [REVIEWS.filter((_, i) => i % 3 === 0), REVIEWS.filter((_, i) => i % 3 === 1), REVIEWS.filter((_, i) => i % 3 === 2)]
  const speeds = ['46s', '58s', '50s']
  return (
    <div className="rv-up">
      <div className="drift" data-paused={paused}>
        {cols.map((c, k) => (
          <div key={k} className={`col c${k + 1}`} style={{ '--d': speeds[k] } as CSSProperties}>
            {c.map((r) => <Card key={r.id} r={r} />)}
            {c.map((r) => <Card key={`${r.id}-d`} r={r} dup />)}
          </div>
        ))}
      </div>
      <button type="button" className="drift-ctl" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        {paused ? 'Hreyfa umsagnirnar aftur' : 'Stöðva hreyfinguna'}
      </button>
    </div>
  )
}

export function Home() {
  const navTo = useNavTo()
  const skip = REVIEWS.find((r) => r.id === FOOD.quoteId)!
  return (
    <>
      <Hero />
      <div className="over">
        <section className="intro" aria-labelledby="bj3-intro">
          <div className="wrap grid">
            <div className="head">
              <Eyebrow>{INTRO.eyebrow}</Eyebrow>
              <Title id="bj3-intro" text={INTRO.title} stagger />
            </div>
            <div className="text">
              {INTRO.body.map((t) => <p key={t} className="body rv-up">{t}</p>)}
              <a className="round rv-up" href="#sagan" onClick={(e) => navTo(`${ROOT}#sagan`, e)}>
                <i aria-hidden="true"><ArrowRight size={20} strokeWidth={1.3} /></i>{OWNERS.link}
              </a>
            </div>
          </div>
        </section>

        <section id="umhverfid" className="bleed exp on-dark" aria-labelledby="bj3-exp">
          <Photo pic={IMG.lake} sizes="100vw" ratio="auto" className="rv-par" />
          <div className="shade" />
          <div className="copy">
            <Title id="bj3-exp" text={EXPERIENCE.title} center />
            <p className="body rv-up">{EXPERIENCE.sub} {EXPERIENCE.hike}</p>
          </div>
          <article className="frame rv-card">
            <Photo pic={IMG[EXPERIENCE.card.pic]} sizes="(max-width: 520px) 92vw, 440px" ratio="3 / 2" />
            <h3 className="t-h3">{EXPERIENCE.card.title}</h3>
            <p>{EXPERIENCE.card.text}</p>
          </article>
        </section>

        <section id="gisting" className="stay" aria-labelledby="bj3-stay">
          <div className="wrap">
            <div className="head">
              <Eyebrow>{STAY.eyebrow}</Eyebrow>
              <Title id="bj3-stay" text={STAY.title} center />
            </div>
            <ul className="icons rv-stagger">
              {STAY.features.map((f) => {
                const I = ICONS[f.icon]
                return <li key={f.label}><i aria-hidden="true"><I size={24} strokeWidth={1.2} /></i>{f.label}</li>
              })}
            </ul>
            <Strip />
            <div className="more rv-up">
              <Link className="pill pill-ink" to={`${ROOT}/gisting`} viewTransition>{STAY.cta}</Link>
              <a className="pill pill-solid" href={BOOKING_URL} target="_blank" rel="noreferrer">{HERO.book}</a>
            </div>
          </div>
        </section>

        <section className="cott" aria-labelledby="bj3-cott">
          <div className="wrap grid">
            <div className="text">
              <Title id="bj3-cott" text={COTTAGES.title} stagger />
              <p className="body rv-up">{COTTAGES.body}</p>
              <Link className="round rv-up" to={`${ROOT}/gisting#hus-bad`} viewTransition onClick={(e) => navTo(`${ROOT}/gisting#hus-bad`, e)}>
                <i aria-hidden="true"><ArrowRight size={20} strokeWidth={1.3} /></i>{COTTAGES.link}
              </Link>
            </div>
            <Photo pic={IMG.cottageA} sizes="(max-width: 899px) 92vw, 56vw" ratio="4 / 3" className="rounded rv-settle" />
          </div>
        </section>

        <section className="owners on-dark" aria-labelledby="bj3-owners">
          <div className="panel rv-settle"><Photo pic={IMG.lamp} sizes="(max-width: 899px) 100vw, 44vw" ratio="auto" /></div>
          <div className="text">
            <Eyebrow>{OWNERS.eyebrow}</Eyebrow>
            <Title id="bj3-owners" text={OWNERS.title} />
            <div>{OWNERS.body.map((t) => <p key={t} className="body rv-up">{t}</p>)}</div>
            <a className="tlink rv-up" href="#sagan" onClick={(e) => navTo(`${ROOT}#sagan`, e)}>{OWNERS.link}</a>
          </div>
        </section>

        <section id="stofan" className="food" aria-labelledby="bj3-food">
          <div className="wrap spread">
            <div className="head">
              <Eyebrow>{FOOD.eyebrow}</Eyebrow>
              <Title id="bj3-food" text={FOOD.title} stagger />
            </div>
            <Photo pic={IMG.dining} sizes="(max-width: 899px) 92vw, 38vw" ratio="3 / 4" className="lead rv-settle" />
            <figure className="said">
              <blockquote className="rv-up" lang={skip.lang}><p className="q">{quote(skip)}</p></blockquote>
              <figcaption className="rv-up"><strong>{skip.name}</strong>, {skip.source}, {skip.when.toLowerCase()}</figcaption>
            </figure>
            <ul className="meals rv-stagger">
              {FOOD.cards.map((c) => <li key={c.h} className="meal"><h3 className="t-h3">{c.h}</h3><p>{c.t}</p></li>)}
            </ul>
          </div>
        </section>

        <section id="umsagnir" className="voices" aria-labelledby="bj3-voices">
          <div className="wrap">
            <div className="head">
              <div>
                <Title id="bj3-voices" text={REVIEWS_TEASER.title} stagger />
                <p className="body rv-up">{REVIEWS_TEASER.sub}</p>
              </div>
              <Link className="round rv-up" to={`${ROOT}/umsagnir`} viewTransition>
                <i aria-hidden="true"><ArrowRight size={20} strokeWidth={1.3} /></i>{REVIEWS_TEASER.cta}
              </Link>
            </div>
            <Drift />
          </div>
        </section>

        <section id="sagan" className="saga" aria-labelledby="bj3-saga">
          <div className="wrap grid">
            <div className="left">
              <Title id="bj3-saga" text={HISTORY.title} stagger />
              <figure className="rv-up" style={{ margin: 0 }}>
                <Photo pic={IMG.archival} sizes="(max-width: 899px) 92vw, 36vw" className="rv-settle" />
                <figcaption>{OWNERS.archivalCaption}</figcaption>
              </figure>
            </div>
            <div className="rv-up">
              <Accordion
                initial={0}
                items={HISTORY.years.map((y) => ({
                  id: y.y,
                  head: <><span className="yr">{y.y}</span>{y.h}</>,
                  body: <p>{y.t}</p>,
                }))}
              />
            </div>
          </div>
        </section>

        <section id="hafa-samband" className="info" aria-labelledby="bj3-info">
          <div className="wrap grid">
            <div className="left">
              <Title id="bj3-info" text={INFO.title} stagger />
              <div className="rv-up">
                <Accordion
                  initial={0}
                  items={INFO.items.map((it) => ({
                    id: it.id,
                    head: it.h,
                    body: it.id === 'tjald'
                      ? <div className="camp"><p>{CAMPSITE.body}</p><dl className="facts">{CAMPSITE.prices.map((r) => <FactRow key={r.k} k={r.k} v={r.v} />)}</dl></div>
                      : <dl className="facts">{it.rows.map((r) => <FactRow key={r.k} k={r.k} v={r.v} />)}</dl>,
                  }))}
                />
              </div>
              <div className="contact rv-up">
                <a className="pill pill-ink" href={PHONE_HREF}>Hringja</a>
                <a className="pill pill-ink" href={EMAIL_HREF}>{EMAIL}</a>
              </div>
            </div>
            <div className="rv-up">
              <iframe className="map" src={MAP_EMBED} title="Kort: Hótel Bjarkalundur við Vestfjarðaveg" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <a className="tlink maplink" href={MAP_LINK} target="_blank" rel="noreferrer">{INFO.mapLabel}</a>
            </div>
          </div>
        </section>

        <section className="bleed closing on-dark" aria-labelledby="bj3-close">
          <Photo pic={IMG.valley} sizes="100vw" ratio="auto" className="rv-par" />
          <div className="shade" />
          <Title id="bj3-close" text={CLOSING.title} center />
          <div className="ctas rv-up">
            <a className="big-round" href={BOOKING_URL} target="_blank" rel="noreferrer">
              <span><ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" />{CLOSING.book}</span>
            </a>
            <a className="pill pill-light" href={PHONE_HREF}>{CLOSING.call}</a>
          </div>
        </section>
      </div>
    </>
  )
}

function FactRow({ k, v }: { k: string; v: string }) {
  return <><dt>{k}</dt><dd>{v}</dd></>
}
