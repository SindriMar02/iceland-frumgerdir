import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight, BedDouble, Home as House, Plus, ShowerHead, Wifi } from 'lucide-react'
import {
  IMG, EMAIL, EMAIL_HREF, MAP_EMBED, MAP_LINK, DIRECTIONS, PHONE_HREF, REVIEWS, HERO_FILM, ROADS, WEATHER, VEIDIKORTID, quote,
} from './data'
import type { Review } from './data'
import { Accordion, Eyebrow, Photo, Stars, Title, useNavTo } from './shell'
import { StayPicker } from './StayPicker'
import { useSite } from './site'
import { SECTION, pathFor, roomHref, sectionHref } from './paths'
import { whenLifted } from './curtain'

/* Home, v4. The order is the Edelhaus board's: film hero, staggered serif
   intro, a full-bleed photo chapter with a framed card, rooms with icons and
   a photo strip, food, the reviews, the story, what guests ask, and the
   booking calendar at the foot. The page moves the MRC way (TEARDOWN.md): the
   hero stays put and a rounded sheet (our Fagravík grammar) slides up over it.
   Every section carries a language-free data-anchor so the IS/EN switch can
   land the reader on the same section in the other language. */

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
.bj3 .meals-wrap{grid-area:meals;display:grid;gap:18px}
.bj3 .meals-wrap .guests{max-width:none;color:var(--mute);font-size:.95rem}
.bj3 .meals{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,1.2vw,16px);list-style:none;margin:0;padding:0}
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
.bj3 .drift .card .stars{margin-bottom:-4px}
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

/* history: the years fold open, the picture flips to each year */
.bj3 .saga{padding:var(--sec) 0;background:var(--paper)}
.bj3 .saga .grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,6vw,110px);align-items:start}
.bj3 .saga .left{display:grid;gap:clamp(28px,3.4vw,48px);position:sticky;top:110px}
.bj3 .flip{position:relative;aspect-ratio:4/3;border-radius:var(--r);overflow:hidden;background:#D9D8D4}
.bj3 .flip .fp{position:absolute;inset:0;z-index:1;clip-path:inset(100% 0 0 0);transition:clip-path 0s linear .95s}
.bj3 .flip .fp[data-on="true"]{z-index:2;clip-path:inset(0 0 0 0);transition:clip-path .95s var(--ease)}
.bj3 .flip .fp .pic{position:absolute;inset:0}
.bj3 .flip .fp .pic img{transform:scale(1.08);transition:transform 1.4s var(--ease)}
.bj3 .flip .fp[data-on="true"] .pic img{transform:none}
.bj3 .flip-cap{display:flex;align-items:baseline;gap:14px;margin-top:12px;font-size:.88rem;color:var(--mute)}
.bj3 .flip-cap b{font-family:var(--serif);font-weight:300;font-size:1.4rem;color:var(--ink)}
.bj3 .saga .yr{font-family:var(--serif);font-weight:300;font-variant-numeric:lining-nums;display:inline-block;min-width:3.4em}
.bj3 .saga .acc-inner p{max-width:52ch;color:var(--text);padding-left:calc(3.4em * 1.6)}
@media (max-width:899px){.bj3 .saga .grid{grid-template-columns:1fr}.bj3 .saga .left{position:static}.bj3 .saga .acc-inner p{padding-left:0}}
@media (prefers-reduced-motion:reduce){.bj3 .flip .fp,.bj3 .flip .fp[data-on="true"]{transition:none}}

/* good to know: native <details> (read by every crawler), the contact card beside */
.bj3 .faq{padding:var(--sec) 0;interpolate-size:allow-keywords}
.bj3 .faq .grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(32px,6vw,110px);align-items:start}
.bj3 .faq .head{display:grid;gap:20px;margin-bottom:clamp(28px,3.4vw,48px)}
.bj3 .qa{border-top:1px solid var(--line)}
.bj3 .qa details{border-bottom:1px solid var(--line)}
.bj3 .qa summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 0;font-family:var(--serif);font-weight:300;font-size:clamp(1.2rem,1.7vw,1.55rem);line-height:1.25}
.bj3 .qa summary::-webkit-details-marker{display:none}
.bj3 .qa summary:focus-visible{outline:2px solid var(--band);outline-offset:4px}
.bj3 .qa summary i{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;border:1px solid var(--line);transition:transform .5s var(--ease),background-color .3s,color .3s}
.bj3 .qa details[open] summary i{transform:rotate(45deg);background:var(--ink);color:var(--on);border-color:var(--ink)}
.bj3 .qa details::details-content{block-size:0;overflow:hidden;transition:block-size .55s var(--ease),content-visibility .55s allow-discrete}
.bj3 .qa details[open]::details-content{block-size:auto}
.bj3 .qa .ans{padding:0 0 24px;max-width:60ch;color:var(--text);display:grid;gap:12px}
.bj3 .qa .ans .links{display:flex;flex-wrap:wrap;gap:8px 22px}
@media (prefers-reduced-motion:reduce){.bj3 .qa details::details-content{transition:none}}
.bj3 .reach{position:sticky;top:110px;display:grid;gap:22px;background:var(--paper);border-radius:var(--r);padding:clamp(22px,2.6vw,34px)}
.bj3 .reach .t-h2{font-size:clamp(2rem,3.4vw,3rem)}
.bj3 .reach .map{display:block;width:100%;aspect-ratio:4/3;border:0;border-radius:10px;background:#DAD9D5}
.bj3 .reach .contact{display:flex;flex-wrap:wrap;gap:10px}
.bj3 .reach .links{display:flex;flex-wrap:wrap;gap:8px 22px}
@media (max-width:899px){.bj3 .faq .grid{grid-template-columns:1fr}.bj3 .reach{position:static}}
@media (max-width:420px){.bj3 .facts{grid-template-columns:1fr;gap:2px}.bj3 .facts dd{margin-bottom:10px}}

/* closing: full bleed, the booking calendar at the bottom (house rule) */
.bj3 .closing{min-height:max(100svh,640px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(28px,3.4vw,44px);padding:clamp(96px,11vw,150px) var(--gut);text-align:center}
.bj3 .closing .shade{background:rgba(18,18,16,.4)}
.bj3 .closing .t-h2{position:relative;font-size:clamp(2.8rem,7vw,6rem)}
.bj3 .closing .lede{position:relative;max-width:52ch;color:rgba(245,244,241,.9)}
.bj3 .closing .picker{position:relative;width:min(1080px,100%)}
.bj3 .closing .ctas{position:relative;display:flex;flex-wrap:wrap;justify-content:center;gap:12px}
.bj3 .closing .pill-light{background:rgba(18,18,16,.46);border-color:rgba(245,244,241,.62)}
.bj3 .closing .pill-light:hover{background:var(--on);color:var(--ink)}
`

const ICONS = [BedDouble, House, ShowerHead, Wifi]
const STRIP = [
  { pic: 'lomur', room: 'vaskur' },
  { pic: 'cottageBeds', room: 'hus-bad' },
  { pic: 'single', room: 'einn' },
  { pic: 'cottageKitchen', room: 'hus-eldhus' },
] as const

function Hero() {
  const { t, lang } = useSite()
  const film = useRef<HTMLVideoElement>(null)
  /* reduced motion: the poster only, and the film is not even fetched */
  const [still, setStill] = useState(false)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setStill(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  /* the film fades in over the still once it is really playing */
  const [rolling, setRolling] = useState(false)
  useEffect(() => {
    const v = film.current
    if (!v) return
    v.muted = true
    if (still) { v.pause(); return }
    gsap.registerPlugin(ScrollTrigger)
    /* the film only plays while it can be seen; the sheet covers it after one screen.
       It is not even fetched until the loading curtain has lifted: the still and the
       fonts get the connection first. */
    let armed = false
    const play = () => { if (armed) v.play().catch(() => {}) }
    const st = ScrollTrigger.create({ start: 0, end: () => window.innerHeight * 1.05, onLeave: () => v.pause(), onEnterBack: play })
    const off = whenLifted(() => {
      armed = true
      /* scroll 0 sits on the start edge, which ScrollTrigger counts as outside */
      if (window.scrollY < window.innerHeight * 1.05) play()
    })
    return () => { off(); st.kill(); v.pause() }
  }, [still])
  const letters = [...t.hero.name]
  const prefix = t.hero.h1.replace(t.hero.name, '')
  return (
    <section className="hero" data-hero data-anchor="top" aria-labelledby="bj3-h1">
      <div className="hero-media">
        {/* the landing picture is a real, responsive image the shell preloads (same srcset),
            not the video's poster: a poster has one size, and the phone one looked soft on desktop */}
        <img className="hero-still" src={IMG.heroPoster.srcS} srcSet={`${IMG.heroPoster.srcS} 1280w, ${IMG.heroPoster.src} ${IMG.heroPoster.w}w`} sizes="100vw"
          width={IMG.heroPoster.w} height={IMG.heroPoster.h} alt={IMG.heroPoster.alt[lang]} decoding="async" {...{ fetchpriority: 'high' }} />
        <video ref={film} className={rolling ? 'on' : undefined} onPlaying={() => setRolling(true)} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}>
          <source media="(min-width: 901px)" src={HERO_FILM.src} type="video/mp4" />
          <source src={HERO_FILM.srcS} type="video/mp4" />
        </video>
      </div>
      <div className="hero-grad" />
      <div className="hero-tint" />
      {/* the scroll fade sits on this wrapper: the children's CSS entrances (fill: both) would override it */}
      <div className="hero-copy hero-leave">
        {/* the text a crawler reads is "Hótel Bjarkalundur"; the letters are the show */}
        <h1 id="bj3-h1" className="hero-name" aria-label={t.hero.h1} translate="no">
          <span className="sr">{prefix}</span>
          <span className="mask">
            {letters.map((c, i) => <span key={i} className="ch" style={{ '--i': i } as CSSProperties}>{c}</span>)}
          </span>
        </h1>
        <p className="hero-sub">{t.hero.sub}</p>
        <div className="hero-ctas">
          <HeroBook />
          <Link className="tlink" to={pathFor(lang, 'rooms')} viewTransition style={{ color: 'var(--on)' }}>{t.hero.rooms}</Link>
        </div>
      </div>
    </section>
  )
}

function HeroBook() {
  const { t, lang } = useSite()
  const navTo = useNavTo()
  const href = sectionHref(lang, 'booking')
  return <a className="pill" href={href} onClick={(e) => navTo(href, e)}>{t.ui.bookStay}</a>
}

function Strip() {
  const { t, lang } = useSite()
  const [on, setOn] = useState(0)
  const navTo = useNavTo()
  return (
    <ul className="strip rv-up">
      {STRIP.map((s, i) => {
        const to = roomHref(lang, s.room)
        return (
          <li key={s.room} data-on={on === i} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)}>
            <Link to={to} viewTransition onClick={(e) => navTo(to, e)}>
              <Photo pic={IMG[s.pic]} sizes="(max-width: 899px) 76vw, 44vw" ratio="auto" />
              <span className="lab"><span>{t.stay.strip[i]}</span><i aria-hidden="true"><ArrowUpRight size={18} strokeWidth={1.5} /></i></span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function Card({ r, dup }: { r: Review; dup?: boolean }) {
  const { t, lang } = useSite()
  return (
    <figure className={`card${r.text.length < 160 ? ' short' : ''}${dup ? ' dup' : ''}`} aria-hidden={dup || undefined}>
      {r.stars ? <Stars n={r.stars} label={t.ui.starsLabel(r.stars)} /> : null}
      <blockquote lang={r.lang}><p>{quote(r)}</p></blockquote>
      <footer>
        <strong>{r.name}</strong>
        <span>{r.source}, {r.when[lang]}</span>
      </footer>
    </figure>
  )
}

function Drift() {
  const { t } = useSite()
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
        {paused ? t.ui.driftPlay : t.ui.driftPause}
      </button>
    </div>
  )
}

/** The years fold open one at a time and the picture flips to each year's photo. */
function History() {
  const { t, lang } = useSite()
  const [active, setActive] = useState(0)
  const years = t.history.years
  return (
    <section id={SECTION.history[lang]} data-anchor="history" className="saga" aria-labelledby="bj3-saga">
      <div className="wrap grid">
        <div className="left">
          <Title id="bj3-saga" text={t.history.title} stagger />
          <div className="rv-up">
            <div className="flip">
              {years.map((y, i) => (
                <div key={y.y} className="fp" data-on={i === active} aria-hidden={i !== active}>
                  <Photo pic={IMG[y.pic]} sizes="(max-width: 899px) 92vw, 38vw" ratio="auto" />
                </div>
              ))}
            </div>
            <p className="flip-cap" aria-live="polite"><b>{years[active].y}</b>{years[active].h}</p>
          </div>
        </div>
        <div className="rv-up">
          <Accordion
            initial={0}
            onOpen={setActive}
            items={years.map((y) => ({ id: y.y, head: <><span className="yr">{y.y}</span>{y.h}</>, body: <p>{y.t}</p> }))}
          />
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const { t, lang } = useSite()
  const navTo = useNavTo()
  const campsite = pathFor(lang, 'campsite')
  const book = sectionHref(lang, 'booking')
  const extra: Record<string, JSX.Element> = {
    faerd: <><a className="tlink" href={ROADS.is} target="_blank" rel="noopener">{t.faq.roadsLink}</a><a className="tlink" href={WEATHER.is} target="_blank" rel="noopener">{t.faq.weatherLink}</a></>,
    roads: <><a className="tlink" href={ROADS.en} target="_blank" rel="noopener">{t.faq.roadsLink}</a><a className="tlink" href={WEATHER.en} target="_blank" rel="noopener">{t.faq.weatherLink}</a></>,
    veidi: <a className="tlink" href={VEIDIKORTID} target="_blank" rel="noopener">{t.faq.fishingLink}</a>,
    fishing: <a className="tlink" href={VEIDIKORTID} target="_blank" rel="noopener">{t.faq.fishingLink}</a>,
    tjald: <Link className="tlink" to={campsite} viewTransition>{t.nav.find((n) => n.page === 'campsite')?.label}</Link>,
    camping: <Link className="tlink" to={campsite} viewTransition>{t.nav.find((n) => n.page === 'campsite')?.label}</Link>,
    boka: <a className="tlink" href={book} onClick={(e) => navTo(book, e)}>{t.ui.bookStay}</a>,
    book: <a className="tlink" href={book} onClick={(e) => navTo(book, e)}>{t.ui.bookStay}</a>,
  }
  return (
    <section id={SECTION.faq[lang]} data-anchor="faq" className="faq" aria-labelledby="bj3-faq">
      <div className="wrap grid">
        <div>
          <div className="head">
            <Eyebrow>{t.faq.eyebrow}</Eyebrow>
            <Title id="bj3-faq" text={t.faq.title} stagger />
          </div>
          <div className="qa rv-up">
            {t.faq.items.map((f, i) => (
              <details key={f.id} name="bj-faq" open={i === 0 || undefined}>
                <summary><span>{f.q}</span><i aria-hidden="true"><Plus size={18} strokeWidth={1.4} /></i></summary>
                <div className="ans">
                  <p>{f.a}</p>
                  {extra[f.id] ? <p className="links">{extra[f.id]}</p> : null}
                </div>
              </details>
            ))}
          </div>
        </div>
        <aside id={SECTION.contact[lang]} data-anchor="contact" className="reach rv-up" aria-labelledby="bj3-contact">
          <Title id="bj3-contact" text={t.contact.title} as="h2" />
          <dl className="facts">{t.contact.rows.map((r) => <FactRow key={r.k} k={r.k} v={r.v} />)}</dl>
          <div className="contact">
            <a className="pill pill-ink" href={PHONE_HREF}>{t.ui.call}</a>
            <a className="pill pill-ink" href={EMAIL_HREF}>{EMAIL}</a>
          </div>
          <iframe className="map" src={MAP_EMBED} title={t.ui.mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <p className="links">
            <a className="tlink" href={DIRECTIONS} target="_blank" rel="noopener">{t.ui.directions}</a>
            <a className="tlink" href={MAP_LINK} target="_blank" rel="noopener">{t.ui.mapLink}</a>
          </p>
        </aside>
      </div>
    </section>
  )
}

export function Home() {
  const { t, lang } = useSite()
  const navTo = useNavTo()
  const skip = REVIEWS.find((r) => r.id === 'skip')!
  const history = sectionHref(lang, 'history')
  const rooms = pathFor(lang, 'rooms')
  return (
    <>
      <Hero />
      <div className="over">
        <section className="intro" data-anchor="intro" aria-labelledby="bj3-intro">
          <div className="wrap grid">
            <div className="head">
              <Eyebrow>{t.intro.eyebrow}</Eyebrow>
              <Title id="bj3-intro" text={t.intro.title} stagger />
            </div>
            <div className="text">
              {t.intro.body.map((p) => <p key={p} className="body rv-up">{p}</p>)}
              <a className="round rv-up" href={history} onClick={(e) => navTo(history, e)}>
                <i aria-hidden="true"><ArrowRight size={20} strokeWidth={1.3} /></i>{t.intro.link}
              </a>
            </div>
          </div>
        </section>

        <section id={SECTION.surroundings[lang]} data-anchor="surroundings" className="bleed exp on-dark" aria-labelledby="bj3-exp">
          <Photo pic={IMG.lake} sizes="100vw" ratio="auto" className="rv-par" />
          <div className="shade" />
          <div className="copy">
            <Title id="bj3-exp" text={t.experience.title} center />
            <p className="body rv-up">{t.experience.sub}</p>
            <p className="body rv-up">{t.experience.road}</p>
          </div>
          <article className="frame rv-card">
            <Photo pic={IMG.kayaks} sizes="(max-width: 520px) 92vw, 440px" ratio="3 / 2" />
            <h3 className="t-h3">{t.experience.card.title}</h3>
            <p>{t.experience.card.text}</p>
          </article>
        </section>

        <section id={SECTION.stay[lang]} data-anchor="stay" className="stay" aria-labelledby="bj3-stay">
          <div className="wrap">
            <div className="head">
              <Eyebrow>{t.stay.eyebrow}</Eyebrow>
              <Title id="bj3-stay" text={t.stay.title} center />
            </div>
            <ul className="icons rv-stagger">
              {t.stay.features.map((f, i) => {
                const I = ICONS[i]
                return <li key={f}><i aria-hidden="true"><I size={24} strokeWidth={1.2} /></i>{f}</li>
              })}
            </ul>
            <Strip />
            <div className="more rv-up">
              <Link className="pill pill-ink" to={rooms} viewTransition>{t.stay.cta}</Link>
              <HeroBookSolid />
            </div>
          </div>
        </section>

        <section className="cott" data-anchor="cottages" aria-labelledby="bj3-cott">
          <div className="wrap grid">
            <div className="text">
              <Title id="bj3-cott" text={t.cottages.title} stagger />
              <p className="body rv-up">{t.cottages.body}</p>
              <Link className="round rv-up" to={roomHref(lang, 'hus-bad')} viewTransition onClick={(e) => navTo(roomHref(lang, 'hus-bad'), e)}>
                <i aria-hidden="true"><ArrowRight size={20} strokeWidth={1.3} /></i>{t.cottages.link}
              </Link>
            </div>
            <Photo pic={IMG.cottageA} sizes="(max-width: 899px) 92vw, 56vw" ratio="4 / 3" className="rounded rv-settle" />
          </div>
        </section>

        <section className="owners on-dark" data-anchor="owners" aria-labelledby="bj3-owners">
          <div className="panel rv-settle"><Photo pic={IMG.lamp} sizes="(max-width: 899px) 100vw, 44vw" ratio="auto" /></div>
          <div className="text">
            <Eyebrow>{t.owners.eyebrow}</Eyebrow>
            <Title id="bj3-owners" text={t.owners.title} />
            <div>{t.owners.body.map((p) => <p key={p} className="body rv-up">{p}</p>)}</div>
            <a className="tlink rv-up" href={history} onClick={(e) => navTo(history, e)}>{t.owners.link}</a>
          </div>
        </section>

        <section id={SECTION.food[lang]} data-anchor="food" className="food" aria-labelledby="bj3-food">
          <div className="wrap spread">
            <div className="head">
              <Eyebrow>{t.food.eyebrow}</Eyebrow>
              <Title id="bj3-food" text={t.food.title} stagger />
            </div>
            <Photo pic={IMG.dining} sizes="(max-width: 899px) 92vw, 38vw" ratio="3 / 4" className="lead rv-settle" />
            <figure className="said">
              <blockquote className="rv-up" lang={skip.lang}><p className="q">{quote(skip)}</p></blockquote>
              <figcaption className="rv-up"><strong>{skip.name}</strong>, {skip.source}, {skip.when[lang]}</figcaption>
            </figure>
            <div className="meals-wrap">
              <ul className="meals rv-stagger">
                {t.food.cards.map((c) => <li key={c.h} className="meal"><h3 className="t-h3">{c.h}</h3><p>{c.t}</p></li>)}
              </ul>
              <p className="body rv-up guests">{t.food.guests}</p>
            </div>
          </div>
        </section>

        <section id={SECTION.reviews[lang]} data-anchor="reviews" className="voices" aria-labelledby="bj3-voices">
          <div className="wrap">
            <div className="head">
              <div>
                <Title id="bj3-voices" text={t.reviewsTeaser.title} stagger />
                <p className="body rv-up">{t.reviewsTeaser.sub}</p>
              </div>
              <Link className="round rv-up" to={pathFor(lang, 'reviews')} viewTransition>
                <i aria-hidden="true"><ArrowRight size={20} strokeWidth={1.3} /></i>{t.reviewsTeaser.cta}
              </Link>
            </div>
            <Drift />
          </div>
        </section>

        <History />
        <Faq />

        <section id={SECTION.booking[lang]} data-anchor="booking" className="bleed closing on-dark" aria-labelledby="bj3-close">
          <Photo pic={IMG.valley} sizes="100vw" ratio="auto" className="rv-par" />
          <div className="shade" />
          <Title id="bj3-close" text={t.closing.title} center />
          <p className="lede rv-up">{t.booking.lede}</p>
          <StayPicker />
          <div className="ctas rv-up">
            <a className="pill pill-light" href={PHONE_HREF}>{t.closing.call}</a>
            <a className="pill pill-light" href={EMAIL_HREF}>{t.ui.email}</a>
          </div>
        </section>
      </div>
    </>
  )
}

function HeroBookSolid() {
  const { t, lang } = useSite()
  const navTo = useNavTo()
  const href = sectionHref(lang, 'booking')
  return <a className="pill pill-solid" href={href} onClick={(e) => navTo(href, e)}>{t.ui.bookStay}</a>
}

function FactRow({ k, v }: { k: string; v: string }) {
  return <><dt>{k}</dt><dd>{v}</dd></>
}
