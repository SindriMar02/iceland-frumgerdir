import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Pause, Play, Plus } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  CSS, Haus, M, Ord, Reveal, faraA, foto, reduced, step, useInview, useMjukSkrun, useTint, useWatchdog, vaMynd, lenisOf,
} from './ui'
import { stada, useStada } from './state'
import { BLANDARI_CSS, Blandari } from './blandari'
import { LITAKORT_CSS, Litakort } from './litakort'
import { VERK_CSS, Verk, fmtNotkun } from './verk'
import { SKUFFA_CSS, Verkblad, Voruspjald } from './skuffur'
import { FLISAR, FYRIRTAEKI, JSON_LD, OPNUN, SOLUSTADIR, SPURT, TEXTI } from './data'
import { FLOKKAR, VORUR, type Flokkur } from './vorur'

const company = getPreviewCompany('malning')

/* ------------------------------------------------------------------ *
 * Hero: the reference's split hero with three slides, all Málning's own
 * photography. Nothing fades: the entering slide is wiped in from below and
 * the lines rise out of their masks.
 * ------------------------------------------------------------------ */
const SLIDES = [
  {
    id: 'litur', aug: TEXTI.augnamerki, lina: [TEXTI.heroA, `*${TEXTI.heroB}*`], undir: TEXTI.heroUnder, takki: TEXTI.heroTakki, href: '#blandari',
    v: 'hero-vinstri', h: 'hero-haegri', dim: 0.66,
    altV: 'Kona málar vegg í djúpgrænum lit í herbergi þar sem allt er í sama lit.', altH: 'Kópal innimálning í svartri fötu í herbergi með vegg í tveimur litum.',
  },
  {
    id: 'steinn', aug: 'Utanhúss', lina: ['Steinn og múr', '*sem þola veðrið.*'],
    undir: 'Steinakrýl er hannað fyrir múr og steinsteypta fleti utanhúss við íslenskar aðstæður.', takki: 'Skoða utanhússvörur', href: '#vorur', fl: 'uti' as Flokkur,
    v: 'steinn-horn', h: 'steinn-hvitt', dim: 0.5,
    altV: 'Hvítmálað horn á húsi með svölum, með litakort í bakgrunni.', altH: 'Hvítt hús með tré og limgerði við götu.',
  },
  {
    id: 'vidur', aug: 'Viðarvörn', lina: ['Viður sem fær', '*að anda.*'],
    undir: 'Kjörvari ver viðinn fyrir vætu og hleypir öllum raka út.', takki: 'Skoða viðarvörn', href: '#vorur', fl: 'vidur' as Flokkur,
    v: 'vidur-pallur', h: 'vidur-vetur', dim: 0.54,
    altV: 'Maður málar pall með viðarvörn við sumarhús.', altH: 'Timburhús í snjó að kvöldi, lýst innan frá.',
  },
]

const HERO_MS = 7500

const lines = (ls: string[]) => ls.map((l, j) => (
  <span className="mal-mask" key={l}>
    <span className="mal-up" style={{ ['--d' as string]: `${(0.12 + j * 0.12).toFixed(2)}s` }}>
      {l.startsWith('*') ? <em>{l.slice(1, -1)}</em> : l}
    </span>
  </span>
))

function Hero({ onFlokkur }: { onFlokkur: (f: Flokkur) => void }) {
  const [i, setI] = useState(0)
  const [spila, setSpila] = useState(() => !reduced())
  const [sjaanlegt, setSjaanlegt] = useState(true)
  const ref = useRef<HTMLElement | null>(null)
  const n = SLIDES.length
  /* a slide's photographs are only mounted once it is the current or the next one (after a short idle), so the page does not fetch all six at load */
  const [seen, setSeen] = useState<number[]>([0])
  useEffect(() => {
    const t = window.setTimeout(() => setSeen((a) => [...new Set([...a, i, (i + 1) % n])]), i === 0 && seen.length === 1 ? 2200 : 0)
    return () => window.clearTimeout(t)
  }, [i, n, seen.length])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setSjaanlegt(e.isIntersecting), { threshold: 0.25 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    const on = () => setSjaanlegt(!document.hidden)
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])
  useEffect(() => {
    if (!spila || !sjaanlegt) return
    const t = window.setTimeout(() => setI((x) => (x + 1) % n), HERO_MS)
    return () => window.clearTimeout(t)
  }, [i, spila, sjaanlegt, n])

  return (
    <section className="mal-hero" id="top" ref={ref as never} aria-roledescription="hringekja" aria-label="Málning">
      {SLIDES.map((s, k) => (
        <div key={s.id} className={`mal-slide${k === i ? ' virk' : ''}${k === (i + n - 1) % n ? ' fyrri' : ''}`} aria-hidden={k !== i} {...(k !== i ? { inert: '' as unknown as boolean } : {})}
          style={{ ['--dim' as string]: s.dim }}>
          {seen.includes(k) ? (<figure className="mal-helm mal-helmV">
            <img src={foto(s.v as 'hero-vinstri', 1280)} srcSet={`${foto(s.v as 'hero-vinstri', 640)} 640w, ${foto(s.v as 'hero-vinstri', 1280)} 1280w`} sizes="50vw" alt={s.altV} width={1172} height={1758}
              {...(k === 0 ? ({ fetchpriority: 'high' } as Record<string, string>) : { loading: 'lazy' as const })} />
          </figure>) : <figure className="mal-helm mal-helmV" />}
          {seen.includes(k) ? (<figure className="mal-helm mal-helmH">
            <img src={foto(s.h as 'hero-haegri', 1280)} srcSet={`${foto(s.h as 'hero-haegri', 640)} 640w, ${foto(s.h as 'hero-haegri', 1280)} 1280w`} sizes="50vw" alt={s.altH} width={1020} height={1530}
              {...(k === 0 ? ({ fetchpriority: 'high' } as Record<string, string>) : { loading: 'lazy' as const })} />
          </figure>) : <figure className="mal-helm mal-helmH" />}
          <div className="mal-heroT">
            <p className="mal-aug"><span className="mal-mask"><span className="mal-up" style={{ ['--d' as string]: '.05s' }}>{s.aug}</span></span></p>
            {k === 0 ? <h1 className="mal-h1">{lines(s.lina)}</h1> : <p className="mal-h1">{lines(s.lina)}</p>}
            <p className="mal-heroU"><span className="mal-mask"><span className="mal-up" style={{ ['--d' as string]: '.36s' }}>{s.undir}</span></span></p>
            <div className="mal-mask mal-heroK"><div className="mal-up" style={{ ['--d' as string]: '.48s' }}>
              <button className="mal-knappur" onClick={() => { if ('fl' in s && s.fl) onFlokkur(s.fl); faraA(s.href) }}>{s.takki}<i><ArrowRight size={18} strokeWidth={2} /></i></button>
            </div></div>
          </div>
        </div>
      ))}
      <div className="mal-heroS">
        <span className="tala" aria-live="off">{i + 1}/{n}</span>
        <span className="linu" aria-hidden="true"><span key={i + String(spila && sjaanlegt)} className={`fyll${spila && sjaanlegt ? ' gengur' : ''}`} style={{ animationDuration: `${HERO_MS}ms` }} /></span>
        <button className="ör" aria-label="Fyrri mynd" onClick={() => setI((x) => (x + n - 1) % n)}><ArrowLeft size={18} strokeWidth={1.75} /></button>
        <button className="ör" aria-label="Næsta mynd" onClick={() => setI((x) => (x + 1) % n)}><ArrowRight size={18} strokeWidth={1.75} /></button>
        <button className="ör" aria-label={spila ? 'Stöðva skiptingu mynda' : 'Halda áfram með skiptingu mynda'} onClick={() => setSpila((x) => !x)}>{spila ? <Pause size={16} strokeWidth={1.75} /> : <Play size={16} strokeWidth={1.75} />}</button>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * The product rail
 * ------------------------------------------------------------------ */
function Vorur({ fl, setFl }: { fl: Flokkur; setFl: (f: Flokkur) => void }) {
  const list = VORUR.filter((v) => v.fl === fl)
  const ref = useInview<HTMLElement>('0px 0px -8% 0px')
  const braut = useRef<HTMLDivElement | null>(null)
  const [pr, setPr] = useState(0)
  const [enda, setEnda] = useState<{ v: boolean; h: boolean }>({ v: true, h: false })
  const st = useStada()

  const mæla = useCallback(() => {
    const el = braut.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setPr(max > 0 ? el.scrollLeft / max : 0)
    setEnda({ v: el.scrollLeft <= 2, h: el.scrollLeft >= max - 2 })
  }, [])
  useEffect(() => { braut.current?.scrollTo({ left: 0 }); mæla() }, [fl, mæla])
  useEffect(() => {
    const el = braut.current
    if (!el) return
    let r = 0
    const on = () => { cancelAnimationFrame(r); r = requestAnimationFrame(mæla) }
    el.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { el.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(r) }
  }, [mæla])
  const fara = (dir: 1 | -1) => braut.current?.scrollBy({ left: dir * Math.max(280, (braut.current?.clientWidth ?? 800) * 0.8), behavior: reduced() ? 'auto' : 'smooth' })

  return (
    <section className="mal-vorur" id="vorur" aria-labelledby="mal-vorur-t" ref={ref as never}>
      <div className="mal-vorurH">
        <Ord text={TEXTI.vorurTitill} id="mal-vorur-t" />
        <div className="mal-pillur" role="group" aria-label="Flokkar">
          {FLOKKAR.map((f) => (<button key={f.id} className="mal-pilla" aria-pressed={fl === f.id} onClick={() => setFl(f.id)}>{f.nafn}</button>))}
        </div>
      </div>
      <p className="mal-vorurU mal-rise">{TEXTI.vorurUnder}</p>
      <div className="mal-braut2" ref={braut} tabIndex={0} role="region" aria-label={`Vörur: ${FLOKKAR.find((f) => f.id === fl)?.nafn}`}>
        {list.map((v, i) => {
          const a = st.verk.some((x) => x.id === v.id)
          return (
            <article className="mal-kort" key={v.id} style={step(Math.min(i, 6))}>
              <button className="mal-kortA" onClick={() => stada.opnaVoru(v.id)} aria-label={`${v.nafn}, sjá nánar`}>
                {v.svans && <span className="mal-tag">Svansmerkt</span>}
                <span className="mal-kortM"><img src={vaMynd(v.mynd, 480)} srcSet={`${vaMynd(v.mynd, 480)} 480w, ${vaMynd(v.mynd, 800)} 800w`} sizes="(max-width:640px) 70vw, 300px" alt="" width={300} height={300} loading="lazy" /></span>
                <span className="mal-kortT">
                  <small>{FLOKKAR.find((f) => f.id === v.fl)?.nafn}</small>
                  <b>{v.nafn}</b>
                  <span>{fmtNotkun(v) || 'Sjá vörulýsingu'}</span>
                </span>
              </button>
              <button className="mal-hring mal-baeta" aria-label={a ? `${v.nafn} er á verkblaði` : `Setja ${v.nafn} á verkblað`}
                onClick={() => { stada.baeta({ id: v.id, litrar: 4 }); if (!a) stada.opna(true) }}>
                {a ? <Check size={18} strokeWidth={2.25} /> : <Plus size={18} strokeWidth={2} />}
              </button>
            </article>
          )
        })}
      </div>
      <div className="mal-vorurF">
        <span className="linu" aria-hidden="true"><span style={{ transform: `scaleX(${Math.max(0.12, pr)})` }} /></span>
        <span className="hnappar">
          <button className="mal-hring ljos" aria-label="Fyrri vörur" disabled={enda.v} onClick={() => fara(-1)}><ArrowLeft size={18} strokeWidth={1.75} /></button>
          <button className="mal-hring ljos" aria-label="Fleiri vörur" disabled={enda.h} onClick={() => fara(1)}><ArrowRight size={18} strokeWidth={1.75} /></button>
        </span>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function Framleitt() {
  return (
    <section className="mal-fram" id="framleitt" aria-labelledby="mal-fram-t">
      <div className="mal-framH">
        <Ord text={TEXTI.framleittTitill} id="mal-fram-t" />
        <p className="mal-rise">{TEXTI.framleittUnder}</p>
      </div>
      <div className="mal-flisar">
        {FLISAR.map((f, i) => (
          <Reveal as="figure" className="mal-flis mal-rise" style={step(i)} key={f.m}>
            <img src={foto(f.mynd as 'skipt-herbergi', 640)} srcSet={`${foto(f.mynd as 'skipt-herbergi', 640)} 640w, ${foto(f.mynd as 'skipt-herbergi', 1280)} 1280w`} sizes="(max-width:991px) 100vw, 33vw" alt="" width={640} height={430} loading="lazy" />
            <span className="mal-tag">{f.m}</span>
            <figcaption>{f.t}</figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Solustadir() {
  return (
    <section className="mal-sol" id="solustadir" aria-labelledby="mal-sol-t">
      <div className="mal-solV">
        <Ord text={TEXTI.solustadirTitill} id="mal-sol-t" />
        <p className="mal-rise">{TEXTI.solustadirUnder}</p>
      </div>
      <div className="mal-solH">
        {SOLUSTADIR.map((h, i) => (
          <Reveal className="mal-solHop mal-rise" style={step(i)} key={h.hopur}>
            <h3>{h.hopur}</h3>
            <ul>
              {h.nofn.map((x) => (
                <li key={x.n + x.s}>
                  <b>{x.n}</b><span>{x.s}</span>
                  <a href={`tel:+354${x.simi.replace(/\D/g, '')}`}>{x.simi}</a>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Spurt() {
  const [opid, setOpid] = useState<number | null>(0)
  return (
    <section className="mal-spurt" id="spurt" aria-labelledby="mal-spurt-t">
      <Ord text={TEXTI.spurtTitill} id="mal-spurt-t" />
      <div className="mal-spurtL">
        {SPURT.map((q, i) => {
          const o = opid === i
          return (
            <Reveal className="mal-q mal-rise" style={step(i)} key={q.s}>
              <h3><button aria-expanded={o} aria-controls={`mal-q${i}`} id={`mal-qh${i}`} onClick={() => setOpid(o ? null : i)}>{q.s}<span className="pl" aria-hidden="true" /></button></h3>
              <div className={`mal-qs${o ? ' opid' : ''}`} id={`mal-q${i}`} role="region" aria-labelledby={`mal-qh${i}`}><div><p>{q.sv}</p></div></div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function Fotur() {
  return (
    <footer className="mal-fot" id="hafa-samband">
      <div className="mal-fotI">
        <div className="mal-fotT">
          <img className="mal-fotMerki" src={M('brand/merki-hvitt.svg')} alt="Málning" width={360} height={95} loading="lazy" />
          <div className="mal-fotD">
            <div><h3>Söludeild</h3>
              <p>{FYRIRTAEKI.heimilisfang}<br />{FYRIRTAEKI.postnumer}</p>
              <p><a href={FYRIRTAEKI.simiHref}>{FYRIRTAEKI.simi}</a><br /><a href={`mailto:${FYRIRTAEKI.netfang}`}>{FYRIRTAEKI.netfang}</a></p></div>
            <div><h3>Opnunartími</h3>
              {OPNUN.map((o) => (<p key={o.d}><span>{o.d}</span><br />{o.t}</p>))}</div>
            <div><h3>Á síðunni</h3>
              <p><a href="#blandari" onClick={(e) => { e.preventDefault(); faraA('#blandari') }}>Blandaðu þinn lit</a><br />
                <a href="#litakort" onClick={(e) => { e.preventDefault(); faraA('#litakort') }}>Litakort Kópal</a><br />
                <a href="#verk" onClick={(e) => { e.preventDefault(); faraA('#verk') }}>Hvað þarf ég?</a><br />
                <a href="#solustadir" onClick={(e) => { e.preventDefault(); faraA('#solustadir') }}>Söluaðilar</a></p></div>
          </div>
        </div>
        <p className="mal-fotSlag" aria-hidden="true">{TEXTI.fotur}</p>
        <p className="mal-fotSm">{FYRIRTAEKI.nafn} kt. {FYRIRTAEKI.kt}. Vörumyndir, ljósmyndir, merki og litakort eru Málningar hf.</p>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ *
 * Intro: the panel carries the mark, then lifts away over the hero.
 * ------------------------------------------------------------------ */
function Hledsla({ ljuka }: { ljuka: () => void }) {
  const [fasi, setFasi] = useState<'inn' | 'burt'>('inn')
  useEffect(() => {
    lenisOf()?.stop()
    const t1 = window.setTimeout(() => setFasi('burt'), 1500)
    const t2 = window.setTimeout(ljuka, 2500)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2) }
  }, [ljuka])
  return (
    <div className={`mal-plota ${fasi}`} aria-hidden="true">
      <span className="mal-plotaM"><img src={M('brand/merki-hvitt.svg')} alt="" width={260} height={69} /></span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
const PAGE_CSS = `
html:has(.mal-root.mal-laest){overflow:hidden}
.mal-plota{position:fixed;inset:0;z-index:95;background:${'#222221'};display:grid;place-items:center;transition:transform 1s cubic-bezier(.64,0,.47,.57)}
.mal-plota.burt{transform:translateY(-100%)}
.mal-plotaM{display:block;width:min(56vw,18rem);overflow:hidden}
.mal-plotaM img{width:100%;height:auto;transform:translateY(105%);animation:mal-merki 1s var(--ease) .15s forwards}
@keyframes mal-merki{to{transform:none}}
.mal-root.mal-bid .mal-hero .mal-up{transform:translateY(125%) !important;transition:none !important}
.mal-main{position:relative;z-index:2;background:#fff}
.mal-sect{padding-top:0}

/* hero */
.mal-hero{position:relative;height:100svh;min-height:600px;max-height:1200px;background:var(--ink);overflow:hidden;isolation:isolate}
.mal-slide{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;clip-path:inset(100% 0 0 0);z-index:1;transition:clip-path 1.1s cubic-bezier(.64,0,.47,.57)}
.mal-slide.fyri{z-index:1}
.mal-slide.fyrri{clip-path:inset(0);z-index:1;transition:none;animation:mal-gomul 0s linear 1.25s forwards}
@keyframes mal-gomul{to{visibility:hidden}}
.mal-slide.virk{clip-path:inset(0);z-index:2}
.mal-slide:not(.virk):not(.fyrri){visibility:hidden;transition:clip-path 1.1s cubic-bezier(.64,0,.47,.57),visibility 0s 1.1s}
.mal-helm{margin:0;overflow:hidden;position:relative}
.mal-helm img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(var(--dim,.85))}
.mal-helmV{background:#2f4a48}.mal-helmH{background:#3a4a4f}
.mal-heroT{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff;padding:90px var(--gutter) 90px;pointer-events:none}
.mal-heroT>*{pointer-events:auto}
.mal-aug{margin:0 0 clamp(14px,1.6vw,22px);font-size:14px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;text-shadow:0 1px 3px rgba(20,24,24,.5),0 1px 16px rgba(20,24,24,.6)}
.mal-h1{font-family:var(--disp);font-weight:400;font-size:clamp(3.4rem,10.6vw,9.6rem);line-height:.94;letter-spacing:-.025em;margin:0 0 clamp(20px,2.4vw,34px);text-shadow:0 2px 40px rgba(20,24,24,.5),0 0 2px rgba(20,24,24,.25)}
.mal-h1 em{font-style:italic;padding-right:.08em}
.mal-heroU{margin:0 0 clamp(26px,3vw,38px);max-width:40ch;font-size:clamp(17px,1.6vw,21px);line-height:1.45;font-weight:500;color:#fff;text-shadow:0 1px 3px rgba(20,24,24,.45),0 1px 24px rgba(20,24,24,.6)}
.mal-heroK{padding-bottom:0;margin-bottom:0;overflow:visible}
.mal-heroK .mal-up{transition-property:transform}
.mal-heroS{position:absolute;z-index:6;left:50%;transform:translateX(-50%);bottom:26px;display:flex;align-items:center;gap:14px;color:#fff;font-size:13px;font-weight:600}
.mal-heroS .tala{font-variant-numeric:tabular-nums;min-width:3ch}
.mal-heroS .linu{position:relative;display:block;width:clamp(90px,14vw,150px);height:2px;background:rgba(255,255,255,.35);overflow:hidden;border-radius:2px}
.mal-heroS .fyll{position:absolute;inset:0;background:#fff;transform:scaleX(0);transform-origin:left}
.mal-heroS .fyll.gengur{animation:mal-fylla linear forwards}
@keyframes mal-fylla{to{transform:scaleX(1)}}
.mal-heroS .ör{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;color:#fff;transition:background .2s var(--ease)}
@media (hover:hover) and (pointer:fine){.mal-heroS .ör:hover{background:rgba(255,255,255,.16)}}
.mal-slide:not(.virk) .mal-up{transform:translateY(112%);transition-duration:.001s}
.mal-slide.virk .mal-up{transform:none}
@media (max-width:991px){
  .mal-hero{height:auto;min-height:100svh;max-height:none}
  .mal-slide{grid-template-columns:1fr;grid-template-rows:1fr}
  .mal-helmH{display:none}
  .mal-heroT{padding-top:110px}
}

/* rail */
.mal-vorur{padding:clamp(72px,9vw,140px) 0 0;max-width:1500px;margin:0 auto}
.mal-vorurH{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:20px 40px;padding:0 var(--gutter)}
.mal-vorur h2{font-family:var(--disp);font-weight:400;font-size:clamp(2.4rem,4.6vw,4.4rem);line-height:1;letter-spacing:-.02em;margin:0}
.mal-pillur{display:flex;flex-wrap:wrap;gap:4px}
@media (max-width:640px){.mal-pillur{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 calc(var(--gutter) * -1);padding:0 var(--gutter);width:calc(100% + 2 * var(--gutter))}.mal-pillur::-webkit-scrollbar{display:none}.mal-pillur .mal-pilla{flex:none}}
.mal-vorurU{margin:14px var(--gutter) 30px;color:var(--mute);max-width:60ch;font-size:16px}
.mal-braut2{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x proximity;padding:0 var(--gutter) 6px;scroll-padding:0 var(--gutter);scrollbar-width:none;overscroll-behavior-x:contain}
.mal-braut2::-webkit-scrollbar{display:none}
.mal-kort{position:relative;flex:0 0 clamp(250px,24vw,330px);max-width:min(78vw,330px);scroll-snap-align:start;border-radius:var(--r);background:var(--kort);contain:layout paint}
.mal-kortA{display:flex;flex-direction:column;width:100%;height:100%;text-align:left;padding:14px 14px 76px;border-radius:var(--r)}
.mal-kortM{display:grid;place-items:center;aspect-ratio:1/1;margin:8px 4px 10px}
.mal-kortM img{width:82%;height:82%;object-fit:contain;mix-blend-mode:multiply;transition:transform .6s var(--ease)}
@media (hover:hover) and (pointer:fine){.mal-kort:hover .mal-kortM img{transform:scale(1.05) rotate(-1deg)}}
.mal-tag{position:absolute;left:14px;top:14px;display:inline-flex;align-items:center;height:30px;padding:0 12px;border-radius:999px;background:var(--tint);color:var(--tint-ink);font-size:13px;font-weight:600;z-index:2;
  transition:background .7s var(--ease),color .7s var(--ease)}
.mal-kortT{display:block;padding:0 4px}
.mal-kortT small{display:block;font-size:13px;color:var(--mute)}
.mal-kortT b{display:block;font-weight:600;font-size:17px;line-height:1.25;margin:2px 0}
.mal-kortT span{display:block;font-size:14px;color:var(--mute);font-variant-numeric:tabular-nums}
.mal-baeta{position:absolute;right:14px;bottom:14px;z-index:3}
.mal-vorurF{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px var(--gutter) 0}
.mal-vorurF .linu{position:relative;display:block;width:clamp(120px,18vw,240px);height:2px;background:var(--lina);overflow:hidden;border-radius:2px}
.mal-vorurF .linu span{position:absolute;inset:0;background:var(--ink);transform-origin:left;transition:transform .25s var(--ease)}
.mal-vorurF .hnappar{display:flex;gap:8px}
.mal-vorurF .mal-hring:disabled{opacity:.3;cursor:not-allowed}

/* made in Kópavogur */
.mal-fram{padding:clamp(80px,10vw,150px) var(--gutter) 0;max-width:1500px;margin:0 auto}
.mal-framH{display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px;margin-bottom:clamp(32px,4vw,56px)}
.mal-framH h2{font-family:var(--disp);font-weight:400;font-size:clamp(2.4rem,4.6vw,4.4rem);line-height:1;letter-spacing:-.02em;margin:0}
.mal-framH p{margin:0;max-width:56ch;color:var(--mute);font-size:17px}
.mal-flisar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.mal-flis{position:relative;margin:0;border-radius:var(--r);overflow:hidden;background:var(--kort);display:flex;flex-direction:column}
.mal-flis img{width:100%;aspect-ratio:4/3;object-fit:cover;transition:transform 1.2s var(--ease)}
@media (hover:hover) and (pointer:fine){.mal-flis:hover img{transform:scale(1.04)}}
.mal-flis .mal-tag{background:#fff;color:var(--ink)}
.mal-flis figcaption{padding:20px 22px 26px;font-size:16px;line-height:1.5}
@media (max-width:991px){.mal-flisar{grid-template-columns:1fr}}

/* dealers */
.mal-sol{padding:clamp(80px,10vw,150px) var(--gutter) 0;max-width:1500px;margin:0 auto;display:grid;grid-template-columns:minmax(0,.7fr) minmax(0,1.3fr);gap:clamp(28px,5vw,96px)}
.mal-solV h2{font-family:var(--disp);font-weight:400;font-size:clamp(2.4rem,4.6vw,4.4rem);line-height:1;letter-spacing:-.02em;margin:0 0 18px}
.mal-solV p{margin:0;color:var(--mute);max-width:40ch;font-size:17px}
.mal-solH{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 36px}
.mal-solHop h3{margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);font-weight:600;padding-bottom:10px;border-bottom:1px solid var(--lina)}
.mal-solHop ul{list-style:none;margin:0;padding:0}
.mal-solHop li{display:grid;grid-template-columns:1fr auto;gap:0 14px;padding:12px 0;border-bottom:1px solid var(--lina)}
.mal-solHop li b{font-weight:600;grid-column:1}
.mal-solHop li span{grid-column:1;font-size:14px;color:var(--mute)}
.mal-solHop li a{grid-column:2;grid-row:1/3;align-self:center;font-variant-numeric:tabular-nums;font-weight:500;text-decoration:none;padding:10px 0;min-height:44px;display:flex;align-items:center}
.mal-solHop li a:hover{text-decoration:underline;text-underline-offset:3px}
@media (max-width:991px){.mal-sol{grid-template-columns:1fr}}
@media (max-width:560px){.mal-solH{grid-template-columns:1fr}}

/* faq */
.mal-spurt{padding:clamp(80px,10vw,150px) var(--gutter) clamp(72px,9vw,120px);max-width:1500px;margin:0 auto;display:grid;grid-template-columns:minmax(0,.7fr) minmax(0,1.3fr);gap:clamp(28px,5vw,96px)}
.mal-spurt h2{font-family:var(--disp);font-weight:400;font-size:clamp(2.4rem,4.6vw,4.4rem);line-height:1;letter-spacing:-.02em;margin:0}
.mal-q{border-top:1px solid var(--lina)}
.mal-q:last-child{border-bottom:1px solid var(--lina)}
.mal-q h3{margin:0}
.mal-q button{display:flex;align-items:center;justify-content:space-between;gap:18px;width:100%;text-align:left;padding:22px 0;font-size:clamp(17px,1.6vw,20px);font-weight:600;min-height:64px}
.mal-q .pl{position:relative;flex:none;width:36px;height:36px;border-radius:50%;background:var(--kort)}
.mal-q .pl::before,.mal-q .pl::after{content:'';position:absolute;left:50%;top:50%;width:14px;height:2px;background:var(--ink);transform:translate(-50%,-50%);transition:transform .35s var(--ease)}
.mal-q .pl::after{transform:translate(-50%,-50%) rotate(90deg)}
.mal-q button[aria-expanded=true] .pl::after{transform:translate(-50%,-50%) rotate(0)}
.mal-qs{display:grid;grid-template-rows:0fr;visibility:hidden;transition:grid-template-rows .5s var(--ease),visibility 0s .5s}
.mal-qs>div{overflow:hidden}
.mal-qs.opid{grid-template-rows:1fr;visibility:visible;transition:grid-template-rows .5s var(--ease)}
.mal-qs p{margin:0 0 24px;max-width:62ch;color:var(--mute);font-size:17px}
@media (max-width:991px){.mal-spurt{grid-template-columns:1fr}}

/* footer curtain: sits behind the page and is uncovered as it ends */
.mal-fot{position:sticky;bottom:0;z-index:0;background:var(--ink);color:#fff;min-height:min(100svh,780px);display:flex}
@media (max-width:991px),(max-height:860px){.mal-fot{position:relative;min-height:0}.mal-fotI{padding-bottom:48px;gap:36px}}
.mal-fotI{width:100%;max-width:1500px;margin:0 auto;padding:clamp(48px,7vw,96px) var(--gutter) 140px;display:flex;flex-direction:column;justify-content:space-between;gap:48px}
.mal-fotT{display:flex;flex-wrap:wrap;gap:40px 8vw;justify-content:space-between;align-items:flex-start}
.mal-fotMerki{width:min(360px,60vw);height:auto}
.mal-fotD{display:grid;grid-template-columns:repeat(3,minmax(150px,auto));gap:24px 6vw}
.mal-fot h3{margin:0 0 12px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.66);font-weight:600}
.mal-fot p{margin:0 0 12px;font-size:16px;line-height:1.55}
.mal-fot p span{color:rgba(255,255,255,.7)}
.mal-fot a{text-decoration:none;display:inline-flex;align-items:center;min-height:44px;padding:0}
.mal-fot a:hover{text-decoration:underline;text-underline-offset:3px}
.mal-fot p.mal-fotSlag{margin:0;font-family:var(--disp);font-size:clamp(3rem,10.5vw,10.5rem);line-height:.9;letter-spacing:-.03em;color:var(--tint);transition:color .7s var(--ease);overflow-wrap:anywhere}
.mal-fot p.mal-fotSm{margin:0;font-size:13px;color:rgba(255,255,255,.66)}
@media (max-width:640px){.mal-fotD{grid-template-columns:1fr 1fr}.mal-fotI{padding-bottom:110px}}
`

export default function MalningPage() {
  const rot = useRef<HTMLDivElement | null>(null)
  const [fl, setFl] = useState<Flokkur>('inni')
  const [hled, setHled] = useState(() => {
    if (typeof window === 'undefined' || reduced() || window.location.hash) return false
    try { if (sessionStorage.getItem('mal-intro')) return false; sessionStorage.setItem('mal-intro', '1') } catch { /* private mode: play it */ }
    return true
  })

  useWatchdog()
  useMjukSkrun()
  useTint(rot)

  const ljuka = useCallback(() => { setHled(false) }, [])
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'Málning | Málning í þínum lit'
    document.documentElement.lang = 'is'
    setThemeColor('#222221')
    const hash = window.location.hash
    const t = hash.length > 1 ? window.setTimeout(() => faraA(hash), 1200) : 0
    return () => {
      window.clearTimeout(t)
      stada.opna(false); stada.opnaVoru(null)
      document.title = prevTitle; document.documentElement.lang = prevLang
    }
  }, [])
  useEffect(() => { if (!hled) lenisOf()?.start() }, [hled])

  const velja = (f: Flokkur) => setFl(f)

  return (
    <div className={`mal-root${hled ? ' mal-laest mal-bid' : ''}`} ref={rot}>
      <style>{CSS}{PAGE_CSS}{BLANDARI_CSS}{LITAKORT_CSS}{VERK_CSS}{SKUFFA_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      {hled && <Hledsla ljuka={ljuka} />}
      <Haus onFlokkur={velja} />
      <Verkblad />
      <Voruspjald />
      <main id="efni" className="mal-main">
        <Hero onFlokkur={velja} />
        <Vorur fl={fl} setFl={setFl} />
        <div style={{ height: 'clamp(72px,9vw,140px)' }} />
        <Blandari />
        <Litakort />
        <Verk />
        <Framleitt />
        <Solustadir />
        <Spurt />
        <PreviewFooter company={company} verifiedContent />
      </main>
      <Fotur />
    </div>
  )
}
