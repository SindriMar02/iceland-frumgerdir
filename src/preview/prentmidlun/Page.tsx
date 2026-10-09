/**
 * Prentmiðlun ehf · "Frá skrá að dyrum" (spec prototype, 2026-10-09).
 *
 * System: Live-up (sndr-teardowns PR #3) through its React port at /preview/hudflur: intro shutter, masked
 * lines on one expo curve, the WebGL lens on the hero photo, a filterable works wall with masked labels, the
 * width-fitted e-mail. Re-aimed for a print broker: Sentient book serif with an English italic gloss, printer's
 * crop marks and signature letters, their logo blue only on marks and rules, and every picture is one of their
 * own studio photos of work they produced. Facts: _docs/PRENTMIDLUN-FACTCHECK-2026-10-09.md.
 *
 * Routes live under /preview/prentmidlun/*; this component reads the sub-path. Structure that must work
 * without motion (header, drawer, filters, tap-to-open, the builder, the inbox) lives here; motion.ts only
 * adds travel and never runs under prefers-reduced-motion.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setMetaDescription, setNoindex, setThemeColor } from '../../lib/preview'
import { prentCss } from './styles'
import { initPrentMotion, refreshTriggers, scrollToHash, topNow } from './motion'
import {
  A, CATS, CAT_LABEL, CONTACT, DESTS, FILES, FINISH, JSON_LD, OPTIONS, PAPERS, PROCESS, PRODUCTS, ROUTE, SAMPLES, SERVICES, WORKS,
  companyEntry, img, imgSet, serviceBySlug,
} from './data'
import type { Cat, ProductKey, Service, Work } from './data'

const B = import.meta.env.BASE_URL
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const INTRO_KEY = 'pm-intro-seen'
const STORE = 'pm-requests'
const to = (k = '') => (k ? `${ROUTE}/${k}` : ROUTE)
const LOGO = A('brand/logo.png')
const LOGO_LIGHT = A('brand/logo-light.png')
const YEAR = new Date().getFullYear()

/* ---------- small pieces ---------- */
function Line({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`pm-line ${className}`} data-pm-mask=""><span>{children}</span></span>
}
function Reg() {
  return (
    <svg className="pm-reg" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="4.2" stroke="currentColor" strokeWidth="1" />
      <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
/* the Icelandic title in the book serif, the English gloss under it (live-up's EN title + JA gloss, turned round) */
function Title({ id, sig, lines, gloss, as = 'h2' }: { id?: string; sig?: string; lines: string[]; gloss?: string; as?: 'h1' | 'h2' }) {
  const H = as
  return (
    <>
      {sig && <p className="pm-sig" data-pm-fade=""><Reg />{sig}</p>}
      <H className="pm-title" id={id}>
        {lines.map((l) => <Line key={l}>{l}</Line>)}
        {gloss && <Line className="pm-gloss"><span lang="en">{gloss}</span></Line>}
      </H>
    </>
  )
}
function Arrow({ className = 'pm-btn__arrow' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
function Roll({ children }: { children: string }) {
  return <span className="pm-btn__roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>
}
function Btn({ to: href, children, ghost = false }: { to: string; children: string; ghost?: boolean }) {
  const cls = `pm-btn${ghost ? ' pm-btn--ghost' : ''}`
  if (href.startsWith('/')) return <Link className={cls} to={href}><Roll>{children}</Roll><Arrow /></Link>
  return <a className={cls} href={href}><Roll>{children}</Roll><Arrow /></a>
}

/* fit one line of type to its container's width, measured at 100px once the fonts are in */
function useFit(ref: React.RefObject<HTMLElement | null>, prop: string, max = Infinity) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const run = () => {
      const box = el.parentElement!.clientWidth
      el.style.setProperty(prop, '100px')
      el.style.display = 'inline-block'
      el.style.width = 'auto'
      const natural = el.scrollWidth
      el.style.display = ''
      el.style.width = ''
      if (natural) el.style.setProperty(prop, `${Math.min(max, (100 * box) / natural).toFixed(2)}px`)
    }
    run()
    document.fonts?.ready.then(run)
    const ro = new ResizeObserver(run)
    ro.observe(el.parentElement!)
    return () => ro.disconnect()
  }, [ref, prop, max])
}
function useMedia(query: string) {
  const [on, setOn] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const f = () => setOn(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [query])
  return on
}

/* ---------- works wall (live-up M8) ---------- */
function WorkCard({ w, open, onToggle }: { w: Work; open: boolean; onToggle: () => void }) {
  return (
    <figure
      className={`pm-work${open ? ' is-open' : ''}`} onClick={onToggle} tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
    >
      <img src={img(w.k)} srcSet={imgSet(w.k)} sizes="(max-width: 768px) 48vw, 24vw" width={w.w} height={w.h} alt={w.alt} loading="lazy" decoding="async" />
      <figcaption className="pm-work__veil">
        <span className="pm-work__line"><span className="pm-work__title">{w.title}</span></span>
        <span className="pm-work__line"><span className="pm-work__cat">{CAT_LABEL[w.cat]}{w.spec ? ` · ${w.spec}` : ''}</span></span>
      </figcaption>
    </figure>
  )
}

function Works({ full = false, only }: { full?: boolean; only?: Cat[] }) {
  const pool = useMemo(() => (only?.length ? WORKS.filter((w) => only.includes(w.cat)) : WORKS), [only])
  const tabs = useMemo(() => CATS.filter((c) => c.key === 'allt' || pool.some((w) => w.cat === c.key)), [pool])
  const [tag, setTag] = useState<'allt' | Cat>('allt')
  const [all, setAll] = useState(full)
  const [openK, setOpenK] = useState<string | null>(null)
  const [swapping, setSwapping] = useState(false)
  const narrow = useMedia('(max-width: 768px)')
  const cols = narrow ? 2 : 4
  const picked = useMemo(() => pool.filter((w) => tag === 'allt' || w.cat === tag), [pool, tag])
  const limit = only ? 8 : 12
  const shown = tag === 'allt' && !all ? picked.slice(0, limit) : picked
  const dealt = useMemo(() => {
    const c: Work[][] = Array.from({ length: cols }, () => [])
    shown.forEach((w, i) => c[i % cols].push(w))
    return c
  }, [shown, cols])
  const note = tabs.find((t) => t.key === tag)!.note
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    refreshTriggers()
  }, [tag, all, cols])

  const pick = (next: 'allt' | Cat) => {
    if (next === tag) return
    setOpenK(null)
    if (reducedMotion()) { setTag(next); return }
    setSwapping(true)
    window.setTimeout(() => { setTag(next); setSwapping(false) }, 260)
  }
  const count = (k: 'allt' | Cat) => (k === 'allt' ? pool.length : pool.filter((w) => w.cat === k).length)

  return (
    <section className="pm-sec pm-works pm-rule" id="verk" aria-labelledby="verk-t">
      <div className="pm-works__head">
        <div><Title id="verk-t" sig={full ? undefined : 'C · Verk'} lines={[only ? 'Úr safninu' : 'Verkin']} gloss={only ? 'From the archive' : 'Selected work'} as={full ? 'h1' : 'h2'} /></div>
        {tabs.length > 2 && (
          <div className="pm-works__filters">
            <ul className="pm-tabs" aria-label="Sía verk">
              {tabs.map((t) => (
                <li key={t.key}>
                  <button type="button" className="pm-tab" aria-pressed={tag === t.key} onClick={() => pick(t.key)}>{t.label}<sup>{count(t.key)}</sup></button>
                </li>
              ))}
            </ul>
            <div className="pm-note" aria-live="polite"><p key={note}>{note}</p></div>
          </div>
        )}
      </div>
      <div className={`pm-grid${swapping ? ' is-swapping' : ''}`}>
        {dealt.map((col, i) => (
          <div className="pm-col" key={`${tag}-${cols}-${i}`}>
            {col.map((w) => (
              <WorkCard key={w.k} w={w} open={openK === w.k} onToggle={() => { if (narrow) setOpenK((o) => (o === w.k ? null : w.k)) }} />
            ))}
          </div>
        ))}
      </div>
      {tag === 'allt' && !all && picked.length > limit && (
        <div className="pm-works__more">
          {only
            ? <Btn to={to('verk')} ghost>{`Öll ${WORKS.length} verkin`}</Btn>
            : <button type="button" className="pm-btn pm-btn--ghost" onClick={() => setAll(true)}><Roll>{`Sýna öll ${picked.length} verkin`}</Roll></button>}
        </div>
      )}
      <p className="pm-works__src">Myndirnar eru úr myndasafni Prentmiðlunar. Titlar eru þeir sem standa á kápunum.</p>
    </section>
  )
}

/* ---------- services index with the photo that follows the row (fine pointer) ---------- */
function ServiceIndex() {
  const listRef = useRef<HTMLUListElement>(null)
  const peekRef = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState<number | null>(null)
  const move = (i: number, el: HTMLElement) => {
    const list = listRef.current, peek = peekRef.current
    if (!list || !peek) return
    const y = el.offsetTop + el.offsetHeight / 2 - peek.offsetHeight / 2
    peek.style.setProperty('--py', `${Math.round(y)}px`)
    setOn(i)
  }
  return (
    <section className="pm-sec pm-rule" id="thjonusta" aria-labelledby="thjonusta-t">
      <div className="pm-svc__head">
        <div><Title id="thjonusta-t" sig="B · Þjónusta" lines={['Hvað við prentum']} gloss="What we produce" /></div>
        <p data-pm-fade="">Við leitum hagstæðustu lausnanna fyrir hvert verk og veitum ráðgjöf um pappír og efni.</p>
      </div>
      <div style={{ position: 'relative' }} onMouseLeave={() => setOn(null)}>
        <ul className="pm-index" ref={listRef}>
          {SERVICES.map((s, i) => (
            <li key={s.slug} onMouseEnter={(e) => move(i, e.currentTarget)}>
              <Link to={to(`thjonusta/${s.slug}`)} onFocus={(e) => move(i, e.currentTarget.parentElement!)}>
                <span className="pm-index__n">{s.n}</span>
                <img className="pm-index__thumb" src={img(s.photo)} alt="" width={64} height={64} loading="lazy" decoding="async" />
                <span className="pm-index__t"><strong>{s.title}</strong><em lang="en">{s.en}</em></span>
                <span className="pm-index__s">{s.short}</span>
                <Arrow className="" />
              </Link>
            </li>
          ))}
        </ul>
        <div className={`pm-peek${on !== null ? ' is-on' : ''}`} ref={peekRef} aria-hidden="true">
          {SERVICES.map((s, i) => <img key={s.slug} className={on === i ? 'is-on' : ''} src={img(s.photo)} alt="" width={1276} height={900} loading="lazy" decoding="async" />)}
        </div>
      </div>
    </section>
  )
}

/* ---------- contact block with the fitted e-mail (live-up M11) ---------- */
function Contact({ heading = 'Hafðu samband', sig = 'F · Samband' }: { heading?: string; sig?: string }) {
  const mailRef = useRef<HTMLSpanElement>(null)
  const [tip, setTip] = useState<string | null>(null)
  const timer = useRef(0)
  useFit(mailRef, '--mail-size', 150)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setTip('Afritað')
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setTip(null), 1500)
    } catch { window.location.href = `mailto:${CONTACT.email}` }
  }
  return (
    <section className="pm-sec pm-rule" id="samband" aria-labelledby="samband-t">
      <Title id="samband-t" sig={sig} lines={[heading]} gloss="Get in touch" />
      <p className="pm-contact__lead" data-pm-fade="">Sendu okkur línu um verkið, eða hringdu. Við eigum mikið úrval sýnishorna af pappír og bókbandsefni ef þú vilt sjá og snerta áður en þú velur.</p>
      <button type="button" className="pm-mail" onClick={copy} aria-label={`Afrita netfang: ${CONTACT.email}`}
        onMouseEnter={() => setTip((t) => t ?? 'Smelltu til að afrita')} onMouseLeave={() => setTip(null)}>
        <span className="pm-mail__addr" ref={mailRef}>{CONTACT.email}</span>
        <span className="pm-mail__rule" aria-hidden="true" />
        <span className={`pm-mail__tip${tip ? '' : ' is-off'}`} aria-live="polite">{tip ?? 'Smelltu til að afrita'}</span>
      </button>
      <dl className="pm-facts" data-pm-fade="">
        <div><dt>Sími</dt><dd><a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></dd></div>
        <div><dt>Netfang</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
        <div><dt>Heimilisfang</dt><dd><a href={CONTACT.map} target="_blank" rel="noreferrer">{CONTACT.street}<br />{CONTACT.town}</a></dd></div>
        <div><dt>Facebook</dt><dd><a href={CONTACT.facebook} target="_blank" rel="noreferrer">Prentmiðlun á Facebook</a></dd></div>
      </dl>
      <div style={{ marginTop: 'clamp(32px,3vw,56px)' }}><Btn to={to('verdtilbod')}>Biðja um verðtilboð</Btn></div>
    </section>
  )
}

/* ---------- home ---------- */
function Home() {
  return (
    <>
      <section className="pm-hero" aria-labelledby="hero-t">
        <div className="pm-hero__text">
          <h1 className="pm-hero__title" id="hero-t">
            <span className="pm-line"><span className="pm-rise">Bækur, spil og kort,</span></span>
            <span className="pm-line"><span className="pm-rise pm-rise--2">prentuð þar sem</span></span>
            <span className="pm-line"><span className="pm-rise pm-rise--3">best hentar.</span></span>
            <span className="pm-line pm-gloss"><span className="pm-rise pm-rise--4" lang="en">Books, games and maps, printed where it suits the job.</span></span>
          </h1>
          <p className="pm-hero__lead pm-fadein">Prentmiðlun velur prentsmiðjuna sem hentar verkinu, hérlendis, í Evrópu, Asíu eða Ameríku, og sér um allt frá prentskjali að dyrum.</p>
          <div className="pm-hero__ctas pm-fadein">
            <Btn to={to('verdtilbod')}>Biðja um verðtilboð</Btn>
            <Btn to={to('verk')} ghost>Skoða verkin</Btn>
          </div>
        </div>
        <figure className="pm-hero__photo pm-marks pm-unveil">
          <div className="pm-hero__clip">
            <img src={img('askja-loftmynd', 1280)} srcSet={imgSet('askja-loftmynd')} sizes="(max-width: 768px) 90vw, 40vw" width={1276} height={877}
              alt="Ljósmyndabók með loftmynd af jökli á kápu, í svartri öskju" {...({ fetchpriority: 'high' } as Record<string, string>)} />
          </div>
          <figcaption className="pm-hero__cap"><span>Ljósmyndabók í öskju</span><span>Úr myndasafni Prentmiðlunar</span></figcaption>
        </figure>
        <div className="pm-hero__meta pm-fadein">
          <span>Reykjavíkurvegur 70, Hafnarfirði</span>
          <a href={`tel:${CONTACT.tel}`}>Sími {CONTACT.phone}</a>
          <span>Frá 2008</span>
        </div>
      </section>

      <section className="pm-sec pm-rule" aria-labelledby="um-t">
        <div className="pm-state">
          <p className="pm-sig" data-pm-fade="" style={{ gridColumn: '1 / -1' }} id="um-t"><Reg />A · Um Prentmiðlun</p>
          <p className="pm-state__text" data-pm-fade="">
            Prentmiðlun er <em>óháð fyrirtæki</em> og vinnur með sérhæfðum birgjum á hverju sviði. Viðskiptavinirnir eru bókaforlög, tímaritaútgefendur, fyrirtæki og einstaklingar, og verkin fara heim að dyrum til flestra landa.
          </p>
          <dl className="pm-figs" data-pm-fade="">
            <div><dt>Eyþór Páll Hauksson, prentari, stofnaði Prentmiðlun</dt><dd>2008</dd></div>
            <div><dt>Heimsálfur þar sem samstarfsprentsmiðjurnar starfa, auk Íslands</dt><dd>3</dd></div>
            <div><dt>Útfærslur í prentun og bókbandi, frá rúnnuðum hornum að öskjum</dt><dd>28</dd></div>
          </dl>
        </div>
      </section>

      <ServiceIndex />
      <Works />

      <section className="pm-sec pm-rule" aria-labelledby="flora-t">
        <p className="pm-sig" data-pm-fade=""><Reg />D · Stærsta verkið</p>
        <div className="pm-flora">
          <p className="pm-flora__big" aria-hidden="true"><Line>12<small>kg</small></Line></p>
          <div className="pm-flora__text" data-pm-fade="">
            <h3 id="flora-t">Flóra Íslands<em>Eggert Pétursson · Crymogea</em></h3>
            <p>Eitt stærsta verkefnið sem Prentmiðlun hefur séð um prentun og bókband á. Gríðarlega stórt og vandað rit sem vegur 12 kíló og kemur í klæddum viðarkassa.</p>
            <Link className="pm-link" to={to('thjonusta/bokaprentun')}>Um bókaprentun</Link>
          </div>
        </div>
      </section>

      <section className="pm-sec pm-night" id="ferlid" aria-labelledby="ferlid-t">
        <Title id="ferlid-t" sig="E · Ferlið" lines={['Frá skrá að dyrum']} gloss="From file to front door" />
        <ol className="pm-steps">
          {PROCESS.map((s) => (
            <li className="pm-step" key={s.t} data-pm-fade="">
              <span className="pm-step__n" aria-hidden="true">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="pm-process__foot" data-pm-fade="">
          <span>Vöruhýsing og dreifing í Evrópu og Bandaríkjunum ef óskað er.</span>
          <Btn to={to('verdtilbod')}>Byrja á beiðni</Btn>
        </div>
      </section>

      <section className="pm-sec" aria-labelledby="synishorn-t">
        <div className="pm-about">
          <figure className="pm-about__photo">
            <div className="pm-frame pm-frame--bw pm-drift pm-marks"><img src={img('eythor')} srcSet={imgSet('eythor')} sizes="(max-width: 768px) 80vw, 30vw" width={977} height={1468} alt="Eyþór Páll Hauksson ungur við prentvél" loading="lazy" decoding="async" /></div>
            <figcaption className="pm-about__cap">Eyþór Páll Hauksson, prentari og stofnandi.</figcaption>
          </figure>
          <div className="pm-about__text">
            <Title id="synishorn-t" sig="Sýnishorn" lines={['Sjáðu og snertu']} gloss="Samples on the shelf" />
            <p className="pm-quote" data-pm-fade="">Við eigum mikið úrval sýnishorna af barnabókum, orðabókum, ljósmyndabókum, kortabókum, matreiðslubókum og fleiru.</p>
            <p data-pm-fade="">Og af efninu sem fer í þær:</p>
            <ul className="pm-chips" data-pm-fade="">{SAMPLES.map((s) => <li key={s}>{s}</li>)}</ul>
            <p data-pm-fade="">Hringdu í {CONTACT.phone} eða sendu Eyþóri Páli línu á <a className="pm-link" href={`mailto:${CONTACT.eythor}`}>{CONTACT.eythor}</a>.</p>
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}

/* ---------- service detail ---------- */
function ServicePage({ s }: { s: Service }) {
  const others = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3)
  return (
    <>
      <section className="pm-page">
        <ol className="pm-crumbs" aria-label="Leiðarstika"><li><Link to={to()}>Forsíða</Link></li><li><Link to={`${to()}#thjonusta`}>Þjónusta</Link></li><li aria-current="page">{s.title}</li></ol>
        <Title as="h1" sig={`${s.n} · Þjónusta`} lines={[s.title]} gloss={s.en} />
        <div className="pm-detail">
          <figure className="pm-detail__photo">
            <div className="pm-frame pm-marks pm-unveil"><img src={img(s.photo, 1280)} srcSet={imgSet(s.photo)} sizes="(max-width: 768px) 90vw, 40vw" width={1276} height={900} alt={s.slug === 'timarit' ? 'Tímarit á borði: Hús og híbýli, Gestgjafinn, Vikan, Lifandi vísindi og Úti' : (WORKS.find((w) => w.k === s.photo)?.alt ?? s.title)} /></div>
          </figure>
          <div className="pm-detail__text">
            <p className="pm-detail__lead" data-pm-fade="">{s.lead}</p>
            {s.body.map((p) => <p key={p} data-pm-fade="">{p}</p>)}
            <dl className="pm-spec" data-pm-fade="">{s.facts.map((f) => <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}</dl>
            <div><Btn to={s.product ? `${to('verdtilbod')}?vara=${s.product}` : to('verdtilbod')}>{s.product ? `Verðtilboð í ${s.title.toLowerCase()}` : 'Biðja um verðtilboð'}</Btn></div>
          </div>
        </div>
        {s.slug === 'bokaprentun' && (
          <div style={{ marginTop: 'var(--pad)' }}>
            <Title sig="Möguleikar" lines={['Í prentun og bókbandi']} gloss="Finishing and binding" />
            <div className="pm-opts">
              {OPTIONS.map((g) => (
                <div key={g.group} data-pm-fade=""><h3>{g.group}</h3><ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul></div>
              ))}
            </div>
            <div className="pm-cta-band" data-pm-fade="">
              <p>Flóra Íslands vegur 12 kíló og kemur í klæddum viðarkassa. Hvað langar þig að gera?</p>
              <Btn to={`${to('verdtilbod')}?vara=innbundin`}>Lýstu bókinni</Btn>
            </div>
          </div>
        )}
      </section>
      {s.cats.length > 0 && <Works only={s.cats} />}
      <section className="pm-sec pm-rule" aria-labelledby="fleira-t">
        <Title id="fleira-t" lines={['Fleira sem við gerum']} gloss="More services" />
        <ul className="pm-index pm-more-list" style={{ marginTop: 'clamp(28px,3vw,56px)' }}>
          {others.map((o) => (
            <li key={o.slug}>
              <Link to={to(`thjonusta/${o.slug}`)}>
                <span className="pm-index__n">{o.n}</span>
                <img className="pm-index__thumb" src={img(o.photo)} alt="" width={64} height={64} loading="lazy" decoding="async" />
                <span className="pm-index__t"><strong>{o.title}</strong><em lang="en">{o.en}</em></span>
                <span className="pm-index__s">{o.short}</span>
                <Arrow className="" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

/* ---------- the quote builder ---------- */
type Req = {
  id: string; at: string; status: 'ny' | 'tilbod' | 'prentun'; demo?: boolean
  product: ProductKey; format: string; pages: number; run: number; paper: string; binding: string; finish: string[]
  date: string; dest: string; file: string; name: string; email: string; company: string; phone: string; notes: string
}
const STATUS: Record<Req['status'], string> = { ny: 'Ný', tilbod: 'Tilboð sent', prentun: 'Í prentun' }
const nf = (n: number) => n.toLocaleString('is-IS')
const productOf = (k: ProductKey) => PRODUCTS.find((p) => p.key === k)!
function readReqs(): Req[] {
  try { return JSON.parse(localStorage.getItem(STORE) || '[]') as Req[] } catch { return [] }
}
function writeReqs(list: Req[]) {
  try { localStorage.setItem(STORE, JSON.stringify(list)) } catch { /* private mode: the e-mail still carries it */ }
}
function specRows(r: Pick<Req, 'product' | 'format' | 'pages' | 'run' | 'paper' | 'binding' | 'finish' | 'date' | 'dest' | 'file'>) {
  const p = productOf(r.product)
  const rows: [string, string][] = [['Vara', p.label], ['Stærð', r.format]]
  if (p.pages) rows.push(['Blaðsíður', `${nf(r.pages)} bls.`])
  rows.push(['Upplag', `${nf(r.run)} eintök`], ['Pappír', r.paper], [p.key === 'spil' ? 'Íhlutir' : p.key === 'kort' ? 'Frágangur' : 'Band', r.binding])
  if (r.finish.length) rows.push(['Sérvinnsla', r.finish.join(', ')])
  rows.push(['Afhending', r.date ? `${new Date(r.date).toLocaleDateString('is-IS', { day: 'numeric', month: 'long', year: 'numeric' })}, ${r.dest.toLowerCase()}` : r.dest], ['Skjöl', r.file])
  return rows
}
function mailBody(r: Req) {
  const lines = specRows(r).map(([k, v]) => `${k}: ${v}`)
  return [`Beiðni ${r.id}`, '', ...lines, '', r.notes ? `Athugasemdir: ${r.notes}` : '', `Nafn: ${r.name}`, r.company ? `Fyrirtæki: ${r.company}` : '', `Netfang: ${r.email}`, r.phone ? `Sími: ${r.phone}` : ''].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n')
}
const mailto = (r: Req) => `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Verðtilboð: ${productOf(r.product).label}, ${nf(r.run)} eintök (${r.id})`)}&body=${encodeURIComponent(mailBody(r))}`

function Stepper({ id, value, onChange, step, min, label }: { id: string; value: number; onChange: (n: number) => void; step: number; min: number; label: string }) {
  const [draft, setDraft] = useState(String(value))
  useEffect(() => { setDraft(String(value)) }, [value])
  const commit = (s: string) => { const n = parseInt(s.replace(/\D/g, ''), 10); onChange(Number.isFinite(n) ? Math.max(min, n) : min) }
  return (
    <div className="pm-step-in">
      <button type="button" aria-label={`Fækka ${label}`} onClick={() => onChange(Math.max(min, value - step))}>−</button>
      <input id={id} name={id} inputMode="numeric" pattern="[0-9]*" value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={(e) => commit(e.target.value)} aria-label={label} />
      <button type="button" aria-label={`Fjölga ${label}`} onClick={() => onChange(value + step)}>+</button>
    </div>
  )
}

function QuotePage() {
  const loc = useLocation()
  const initial = (new URLSearchParams(loc.search).get('vara') as ProductKey) || 'innbundin'
  const [product, setProduct] = useState<ProductKey>(PRODUCTS.some((p) => p.key === initial) ? initial : 'innbundin')
  const p = productOf(product)
  const [format, setFormat] = useState(p.formats[0])
  const [pages, setPages] = useState(192)
  const [run, setRun] = useState(1000)
  const [paper, setPaper] = useState(PAPERS[0])
  const [binding, setBinding] = useState(p.bindings[0])
  const [finish, setFinish] = useState<string[]>([])
  const [date, setDate] = useState('')
  const [dest, setDest] = useState(DESTS[0])
  const [file, setFile] = useState(FILES[0])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [sent, setSent] = useState<Req | null>(null)

  const choose = (k: ProductKey) => {
    const n = productOf(k)
    setProduct(k); setFormat(n.formats[0]); setBinding(n.bindings[0])
    if (k === 'spil') setRun((r) => Math.max(r, 500))
    if (k === 'timarit') setPages((x) => Math.max(4, Math.round(x / 4) * 4))
  }
  const toggle = (f: string) => setFinish((l) => (l.includes(f) ? l.filter((x) => x !== f) : [...l, f]))
  const bookish = product === 'innbundin' || product === 'kilja' || product === 'ljosmynd'
  const minDate = useMemo(() => new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10), [])
  const weeks = date ? Math.round((new Date(date).getTime() - Date.now()) / (7 * 864e5)) : null

  const hints: ReactNode[] = [<span key="base">{p.hint}</span>]
  if (bookish && run < 500) hints.push(<span key="dig">Undir 500 eintökum er stafræn prentun oft hagkvæmari og fljótlegri. <button type="button" className="pm-link" style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit' }} onClick={() => choose('stafraent')}>Skipta yfir í stafræna prentun</button></span>)
  if (product === 'spil' && run < 500) hints.push(<span key="min">{nf(run)} eintök er undir venjulegri lágmarkspöntun í borðspilum.</span>)
  if (product === 'spil' && weeks !== null && weeks < 6) hints.push(<span key="wk">Borðspil eru afgreidd 6 til 12 vikum frá samþykktri próförk. Dagsetningin er eftir {weeks} vikur.</span>)
  if (product === 'timarit' && pages % 4 !== 0) hints.push(<span key="p4">Vírheft rit þurfa blaðsíðufjölda sem gengur upp í 4. Næst: {Math.ceil(pages / 4) * 4} bls.</span>)

  const draft = { product, format, pages, run, paper, binding, finish, date, dest, file }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setErr('Vantar nafn.'); document.getElementById('q-name')?.focus(); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr('Netfangið lítur ekki rétt út. Dæmi: nafn@forlag.is'); document.getElementById('q-email')?.focus(); return }
    setErr(null)
    const d = new Date()
    const id = `PM-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`
    const r: Req = { id, at: d.toISOString(), status: 'ny', ...draft, name: name.trim(), email: email.trim(), company: company.trim(), phone: phone.trim(), notes: notes.trim() }
    writeReqs([r, ...readReqs()])
    setSent(r)
    requestAnimationFrame(() => document.getElementById('q-sent')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' }))
  }

  if (sent) {
    return (
      <section className="pm-page">
        <div className="pm-sent" id="q-sent">
          <p className="pm-sig"><Reg />Beiðni {sent.id}</p>
          <h1 style={{ margin: 0, font: '300 clamp(34px,3.4vw,60px)/1.05 var(--f-serif)', letterSpacing: '-.025em' }}>Beiðnin er tilbúin</h1>
          <p>Ýttu á „Senda tölvupóst“ til að senda hana til Prentmiðlunar úr þínu póstforriti. Allar upplýsingarnar eru komnar í póstinn. Verð er gefið á fyrirspurn.</p>
          <div className="pm-sent__acts">
            <a className="pm-btn" href={mailto(sent)}><Roll>Senda tölvupóst</Roll><Arrow /></a>
            <button type="button" className="pm-btn pm-btn--ghost" onClick={() => { navigator.clipboard?.writeText(mailBody(sent)).catch(() => {}) }}><Roll>Afrita beiðnina</Roll></button>
          </div>
          <div className="pm-docket" style={{ maxWidth: 560 }}>
            <h2>{productOf(sent.product).label}<span>Verð á fyrirspurn</span></h2>
            <dl>{specRows(sent).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
          <p style={{ color: 'var(--mute)', fontSize: 'var(--fs-small)' }}>Frumgerð: ekkert er sent sjálfkrafa. Afrit er geymt í þessum vafra og birtist í <Link className="pm-link" to={to('afgreidsla')}>afgreiðslu starfsfólks</Link>.</p>
          <div><button type="button" className="pm-btn pm-btn--ghost" onClick={() => setSent(null)}><Roll>Ný beiðni</Roll></button></div>
        </div>
      </section>
    )
  }

  return (
    <section className="pm-page">
      <ol className="pm-crumbs" aria-label="Leiðarstika"><li><Link to={to()}>Forsíða</Link></li><li aria-current="page">Verðtilboð</li></ol>
      <Title as="h1" sig="Verðtilboð" lines={['Lýstu verkinu']} gloss="Request a quote" />
      <p style={{ maxWidth: '54ch', marginTop: 'clamp(18px,1.8vw,28px)', color: 'var(--ink-2)' }}>Sex spurningar og þú ert komin(n) með fullbúna beiðni. Við svörum með verði og afhendingartíma. Ekkert er bindandi.</p>
      <form className="pm-q" id="pm-quote" onSubmit={submit} noValidate>
        <div className="pm-q__form">
          <fieldset className="pm-fs">
            <legend><span>1</span>Hvað á að prenta?</legend>
            <div className="pm-types">
              {PRODUCTS.map((x) => (
                <button key={x.key} type="button" className="pm-type" aria-pressed={product === x.key} onClick={() => choose(x.key)}>
                  <span className="pm-type__img"><img src={img(x.photo)} alt="" width={1276} height={957} loading="lazy" decoding="async" /></span>
                  <strong>{x.label}</strong><em lang="en">{x.en}</em>
                </button>
              ))}
            </div>
            <p className="pm-hint" aria-live="polite"><Reg /><span style={{ display: 'grid', gap: 6 }}>{hints}</span></p>
          </fieldset>

          <fieldset className="pm-fs">
            <legend><span>2</span>Stærð og umfang</legend>
            <div className="pm-row">
              <label className="pm-field"><span>Stærð</span>
                <select name="staerd" className="pm-in" value={format} onChange={(e) => setFormat(e.target.value)}>{p.formats.map((f) => <option key={f}>{f}</option>)}</select>
              </label>
              {p.pages && (
                <div className="pm-field"><label htmlFor="q-pages"><span style={{ font: '600 var(--fs-ui)/1.3 var(--f-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mute)' }}>Blaðsíður</span></label>
                  <Stepper id="q-pages" value={pages} onChange={setPages} step={product === 'timarit' ? 4 : 16} min={4} label="blaðsíðum" />
                  <small>Í örkum er gott að blaðsíðufjöldi gangi upp í 16.</small>
                </div>
              )}
              <div className="pm-field"><label htmlFor="q-run"><span style={{ font: '600 var(--fs-ui)/1.3 var(--f-sans)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mute)' }}>Upplag (eintök)</span></label>
                <Stepper id="q-run" value={run} onChange={setRun} step={run >= 1000 ? 500 : 100} min={1} label="eintökum" />
              </div>
            </div>
          </fieldset>

          <fieldset className="pm-fs">
            <legend><span>3</span>Pappír og band</legend>
            <div className="pm-row">
              <label className="pm-field"><span>Pappír</span>
                <select name="pappir" className="pm-in" value={paper} onChange={(e) => setPaper(e.target.value)}>{PAPERS.map((f) => <option key={f}>{f}</option>)}</select>
              </label>
              <label className="pm-field"><span>{product === 'spil' ? 'Íhlutir' : product === 'kort' ? 'Frágangur' : 'Band'}</span>
                <select name="band" className="pm-in" value={binding} onChange={(e) => setBinding(e.target.value)}>{p.bindings.map((f) => <option key={f}>{f}</option>)}</select>
              </label>
            </div>
            <div className="pm-field" role="group" aria-labelledby="q-fin"><span id="q-fin">Sérvinnsla (má velja fleiri en eitt)</span>
              <div className="pm-pills">{FINISH.map((f) => <button key={f} type="button" className="pm-pill" aria-pressed={finish.includes(f)} onClick={() => toggle(f)}>{f}</button>)}</div>
              <small>Fleiri möguleikar eru á síðunni <Link className="pm-link" to={to('thjonusta/bokaprentun')}>bókaprentun</Link>: 28 útfærslur í prentun og bókbandi.</small>
            </div>
          </fieldset>

          <fieldset className="pm-fs">
            <legend><span>4</span>Afhending</legend>
            <div className="pm-row">
              <label className="pm-field"><span>Hvenær þarf verkið að vera komið?</span>
                <input name="afhending" className="pm-in" type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} placeholder="dd.mm.áááá" />
              </label>
              <label className="pm-field"><span>Hvert?</span>
                <select name="hvert" className="pm-in" value={dest} onChange={(e) => setDest(e.target.value)}>{DESTS.map((f) => <option key={f}>{f}</option>)}</select>
              </label>
            </div>
          </fieldset>

          <fieldset className="pm-fs">
            <legend><span>5</span>Skjölin</legend>
            <div className="pm-pills" role="radiogroup" aria-label="Staða skjala">
              {FILES.map((f) => <button key={f} type="button" role="radio" aria-checked={file === f} className="pm-pill" aria-pressed={file === f} onClick={() => setFile(f)}>{f}</button>)}
            </div>
            <small style={{ color: 'var(--mute)', fontSize: 'var(--fs-small)' }}>Prentskjöl eru PDF í CMYK og 300 dpi. Stór skjöl fara um FTP-svæði Prentmiðlunar; þú færð aðgang þegar beiðnin er komin. <Link className="pm-link" to={to('thjonusta/forvinnsla')}>Um forvinnslu</Link></small>
          </fieldset>

          <fieldset className="pm-fs">
            <legend><span>6</span>Um þig</legend>
            {err && <p className="pm-err" role="alert">{err}</p>}
            <div className="pm-row">
              <label className="pm-field"><span>Nafn *</span><input id="q-name" name="nafn" className="pm-in" aria-invalid={err === 'Vantar nafn.' || undefined} autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); if (err === 'Vantar nafn.' && e.target.value.trim()) setErr(null) }} required /></label>
              <label className="pm-field"><span>Netfang *</span><input id="q-email" name="netfang" spellCheck={false} autoCapitalize="off" className="pm-in" aria-invalid={err?.startsWith('Netfangið') || undefined} type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => { setEmail(e.target.value); if (err?.startsWith('Netfangið') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value.trim())) setErr(null) }} required /></label>
              <label className="pm-field"><span>Forlag eða fyrirtæki</span><input name="fyrirtaeki" className="pm-in" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} /></label>
              <label className="pm-field"><span>Sími</span><input name="simi" className="pm-in" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            </div>
            <label className="pm-field"><span>Annað sem við ættum að vita</span><textarea name="athugasemdir" className="pm-in" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Til dæmis: kápa með fólíu, tvö tungumál, sýnishorn til viðmiðunar…" /></label>
          </fieldset>
        </div>

        <aside className="pm-q__side" aria-label="Samantekt">
          <div className="pm-docket">
            <h2>Beiðnin<span>Verð á fyrirspurn</span></h2>
            <dl>{specRows(draft).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            {err && <p className="pm-err">{err}</p>}
            <button type="submit" className="pm-btn" style={{ width: '100%' }}><Roll>Ganga frá beiðni</Roll><Arrow /></button>
            <small style={{ color: 'var(--mute)', fontSize: 'var(--fs-small)' }}>Prentmiðlun birtir ekki verðskrá; hvert verk fær sitt tilboð.</small>
          </div>
        </aside>
      </form>
      <div className="pm-mbar" aria-hidden="false">
        <p><strong>{p.label}</strong>{nf(run)} eintök · {format}</p>
        <button type="submit" form="pm-quote" className="pm-btn">Ganga frá</button>
      </div>
    </section>
  )
}

/* ---------- staff view: incoming requests as production dockets ---------- */
const DEMO: Req[] = [
  { id: 'PM-DÆMI-01', at: '2026-10-06T10:12:00Z', status: 'tilbod', demo: true, product: 'ljosmynd', format: '240 × 300 mm', pages: 208, run: 1500, paper: 'Húðaður mattur', binding: 'Saumað harðband', finish: ['Fólíuþrykk', 'Lesmerkiborði'], date: '2027-03-01', dest: 'Til dreifingaraðila á Íslandi', file: 'Skjöl í vinnslu', name: 'Dæmi: útgefandi', email: 'daemi@example.com', company: 'Dæmi', phone: '', notes: 'Íslensk og ensk útgáfa, sama myndefni.' },
  { id: 'PM-DÆMI-02', at: '2026-10-08T14:40:00Z', status: 'ny', demo: true, product: 'spil', format: 'Ferköntuð askja', pages: 0, run: 1000, paper: 'Húðaður glans', binding: 'Sérsniðinn innri bakki', finish: ['Plastpökkun'], date: '2027-05-15', dest: 'Á lager hjá mér á Íslandi', file: 'Þarf aðstoð við forvinnslu', name: 'Dæmi: spilahöfundur', email: 'daemi@example.com', company: '', phone: '', notes: 'Tré-peð ef hægt er.' },
]
function InboxPage() {
  const [list, setList] = useState<Req[]>(() => [...readReqs(), ...DEMO])
  const [cur, setCur] = useState(list[0]?.id ?? null)
  const r = list.find((x) => x.id === cur) ?? list[0]
  const setStatus = (s: Req['status']) => {
    const next = list.map((x) => (x.id === r.id ? { ...x, status: s } : x))
    setList(next)
    writeReqs(next.filter((x) => !x.demo))
  }
  const reply = (x: Req) => `mailto:${x.email}?subject=${encodeURIComponent(`Verðtilboð ${x.id}: ${productOf(x.product).label}`)}&body=${encodeURIComponent(`Sæl/l ${x.name.replace(/^Dæmi: /, '')},\n\nTakk fyrir beiðnina.\n\n${specRows(x).map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nVerð: \nAfhendingartími: \n\nKveðja,\nPrentmiðlun ehf.\n${CONTACT.phone}`)}`
  return (
    <section className="pm-page">
      <ol className="pm-crumbs" aria-label="Leiðarstika"><li><Link to={to()}>Forsíða</Link></li><li aria-current="page">Afgreiðsla</li></ol>
      <Title as="h1" sig="Starfsfólk" lines={['Beiðnir']} gloss="Incoming requests" />
      <p style={{ maxWidth: '60ch', marginTop: 16, color: 'var(--ink-2)' }}>Svona lítur innhólfið út hjá Prentmiðlun: hver beiðni kemur inn sem verkseðill með öllu sem þarf til að fá verð hjá prentsmiðju. Beiðnir sem þú sendir í verðtilboðinu birtast hér efst (geymdar í þínum vafra). Tvær eru merktar sem dæmi.</p>
      <div className="pm-inbox">
        <ul className="pm-inbox__list">
          {list.map((x) => (
            <li key={x.id}>
              <button type="button" aria-current={x.id === r?.id} onClick={() => setCur(x.id)}>
                <span className="pm-inbox__top"><span>{x.id}{x.demo && <span className="pm-demo">Dæmi</span>}</span><span className="pm-badge" data-s={x.status}>{STATUS[x.status]}</span></span>
                <strong>{productOf(x.product).label}, {nf(x.run)} eintök</strong>
                <small>{x.name} · {new Date(x.at).toLocaleDateString('is-IS', { day: 'numeric', month: 'short' })}</small>
              </button>
            </li>
          ))}
        </ul>
        {r && (
          <article className="pm-inbox__card" aria-label={`Beiðni ${r.id}`}>
            <p className="pm-sig" style={{ margin: 0 }}><Reg />Verkseðill {r.id}</p>
            <h2>{productOf(r.product).label}, {r.format}</h2>
            <div className="pm-docket" style={{ border: 0, padding: 0 }}>
              <dl>
                {specRows(r).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                {r.notes && <div><dt>Athugasemdir</dt><dd>{r.notes}</dd></div>}
                <div><dt>Frá</dt><dd>{r.name}{r.company && r.company !== 'Dæmi' ? `, ${r.company}` : ''}<br />{r.email}{r.phone ? ` · ${r.phone}` : ''}</dd></div>
              </dl>
            </div>
            <div className="pm-pills" role="group" aria-label="Staða">
              {(Object.keys(STATUS) as Req['status'][]).map((s) => <button key={s} type="button" className="pm-pill" aria-pressed={r.status === s} onClick={() => setStatus(s)}>{STATUS[s]}</button>)}
            </div>
            <div className="pm-inbox__acts">
              <a className="pm-btn" href={reply(r)}><Roll>Svara með tilboði</Roll><Arrow /></a>
            </div>
          </article>
        )}
      </div>
    </section>
  )
}

/* ---------- about + contact ---------- */
function AboutPage() {
  return (
    <>
      <section className="pm-page">
        <ol className="pm-crumbs" aria-label="Leiðarstika"><li><Link to={to()}>Forsíða</Link></li><li aria-current="page">Um okkur</li></ol>
        <Title as="h1" sig="Um okkur" lines={['Prentmiðlun']} gloss="About us" />
        <div className="pm-detail">
          <figure className="pm-detail__photo">
            <div className="pm-frame pm-frame--bw pm-marks pm-unveil"><img src={img('eythor', 1280)} srcSet={imgSet('eythor')} sizes="(max-width: 768px) 90vw, 40vw" width={977} height={1468} alt="Eyþór Páll Hauksson ungur við prentvél" /></div>
            <figcaption className="pm-about__cap">Eyþór Páll Hauksson, prentari og stofnandi.</figcaption>
          </figure>
          <div className="pm-detail__text">
            <p className="pm-detail__lead" data-pm-fade="">Eyþór Páll Hauksson, prentari, stofnaði Prentmiðlun í byrjun árs 2008.</p>
            <p data-pm-fade="">Prentmiðlun býður hagkvæmar lausnir í prentun fyrir fyrirtæki og einstaklinga innanlands sem utan. Fyrirtækið er óháð og vinnur með sérhæfðum birgjum á hverju sviði. Það hefur átt farsælt samstarf við prentfyrirtæki hérlendis og víðs vegar um Evrópu, Asíu og Ameríku, meðal annars eitt stærsta prentfyrirtæki í heiminum.</p>
            <p data-pm-fade="">Eitt helsta hlutverk okkar er að leita hagstæðustu lausnanna fyrir viðskiptavinina, auk ráðgjafar og faglegrar aðstoðar, meðal annars við val á pappír og efni.</p>
            <p data-pm-fade="">Við höfum umsjón með móttöku verka, yfirförum prentskjöl, sjáum um samskipti við framleiðendur, prentum vottaðar litaprufur og höldum utan um prófarkaferli, framleiðslu, gæðaeftirlit og afgreiðslu hér heima eða erlendis, ásamt tollafgreiðslu ef þarf. Útflutningur er stór hluti af starfseminni.</p>
            <dl className="pm-spec" data-pm-fade="">
              <div><dt>Félag</dt><dd>{CONTACT.legal}</dd></div>
              <div><dt>Kennitala</dt><dd>{CONTACT.kt}</dd></div>
              <div><dt>VSK-númer</dt><dd>{CONTACT.vsk}</dd></div>
              <div><dt>Eyþór Páll</dt><dd><a className="pm-link" href={`mailto:${CONTACT.eythor}`}>{CONTACT.eythor}</a></dd></div>
            </dl>
            <div lang="en" data-pm-fade="" style={{ display: 'grid', gap: 10, paddingTop: 20, borderTop: '1px solid var(--hair)' }}>
              <p className="pm-sig" style={{ margin: 0 }}><Reg />In English</p>
              <p style={{ margin: 0 }}>Prentmiðlun is an independent print broker in Hafnarfjörður, Iceland. Through partners in Europe, Asia and America we produce books, catalogues, magazines, board games and maps for publishers and companies, and deliver door to door to most countries, with warehousing and distribution in Europe and the USA on request. Founded in 2008 by Eyþór Páll Hauksson, a professional printer.</p>
            </div>
          </div>
        </div>
      </section>
      <Contact heading="Hafa samband" sig="Samband" />
    </>
  )
}

function PrivacyPage() {
  return (
    <section className="pm-page">
      <ol className="pm-crumbs" aria-label="Leiðarstika"><li><Link to={to()}>Forsíða</Link></li><li aria-current="page">Persónuvernd</li></ol>
      <Title as="h1" lines={['Persónuvernd']} gloss="Privacy" />
      <div className="pm-prose" style={{ marginTop: 'clamp(32px,3vw,56px)' }}>
        <p>Þegar þú átt í samskiptum við Prentmiðlun í tölvupósti, síma eða augliti til auglitis vinnum við með upplýsingar eins og nafn, netfang, símanúmer og upplýsingar um verkið sem þú biður um.</p>
        <h2>Tilgangur</h2>
        <p>Við notum upplýsingarnar til að svara fyrirspurnum, gera tilboð og afgreiða verk. Lagagrundvöllurinn er samningur við þig eða lögmætir hagsmunir Prentmiðlunar af því að veita vandaða þjónustu.</p>
        <h2>Verðtilboð á vefnum</h2>
        <p>Verðtilboðsformið sendir ekkert sjálfkrafa. Það setur beiðnina saman í tölvupóst sem þú sendir sjálf(ur) úr þínu póstforriti. Í þessari frumgerð er afrit geymt í vafranum þínum (localStorage) og fer hvergi annað.</p>
        <h2>Vafrakökur</h2>
        <p>Vefurinn notar engar vafrakökur til greiningar eða auglýsinga, og þess vegna er enginn vafrakökuborði.</p>
        <h2>Réttindi þín</h2>
        <p>Þú getur beðið um aðgang að upplýsingum um þig, leiðréttingu eða eyðingu með því að senda póst á <a className="pm-link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. Þú getur einnig leitað til Persónuverndar.</p>
        <p style={{ color: 'var(--mute)', fontSize: 'var(--fs-small)' }}>{CONTACT.legal}, kt. {CONTACT.kt}, {CONTACT.street}, {CONTACT.town}.</p>
      </div>
    </section>
  )
}

function NotFound() {
  return (
    <section className="pm-page" style={{ minHeight: '70svh' }}>
      <Title as="h1" lines={['Síðan fannst ekki']} gloss="Page not found" />
      <div style={{ marginTop: 32 }}><Btn to={to()}>Á forsíðu</Btn></div>
    </section>
  )
}

/* ---------- the shell ---------- */
const NAV = [
  { k: 'thjonusta/bokaprentun', label: 'Þjónusta', match: 'thjonusta' },
  { k: 'verk', label: 'Verk', match: 'verk' },
  { k: 'um-okkur', label: 'Um okkur', match: 'um-okkur' },
]
const TITLES: Record<string, [string, string]> = {
  '': ['Prentmiðlun | Bókaprentun, borðspil, kort og tímarit', 'Prentmiðlun í Hafnarfirði prentar bækur, borðspil, landakort og tímarit hjá völdum prentsmiðjum í Evrópu, Asíu og Ameríku og afhendir heim að dyrum. Frá 2008.'],
  verk: ['Verk | Prentmiðlun', 'Sýnishorn af bókum, borðspilum og kortum sem Prentmiðlun hefur framleitt: ljósmyndabækur, barnabækur, handbækur, matreiðslubækur og fleira.'],
  verdtilbod: ['Verðtilboð | Prentmiðlun', 'Lýstu verkinu: vara, stærð, blaðsíður, upplag, pappír, band og afhending. Ein fullbúin beiðni til Prentmiðlunar.'],
  afgreidsla: ['Afgreiðsla | Prentmiðlun', 'Starfsmannahlið: beiðnir af vefnum sem verkseðlar.'],
  'um-okkur': ['Um okkur | Prentmiðlun', 'Eyþór Páll Hauksson, prentari, stofnaði Prentmiðlun árið 2008. Reykjavíkurvegur 70, Hafnarfirði. Sími 554 5800.'],
  personuvernd: ['Persónuvernd | Prentmiðlun', 'Hvaða upplýsingum Prentmiðlun safnar og hvernig þær eru notaðar.'],
}

export default function PrentmidlunPage() {
  const loc = useLocation()
  const sub = loc.pathname.replace(/^.*?\/preview\/prentmidlun\/?/, '').replace(/\/+$/, '')
  const page = sub.split('/')[0]
  const svc = page === 'thjonusta' ? serviceBySlug(sub.split('/')[1] ?? '') : undefined
  const isHome = sub === ''
  const rootRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLElement>(null)
  const footRef = useRef<HTMLSpanElement>(null)
  const css = useMemo(() => prentCss(B), [])
  const [intro, setIntro] = useState<'off' | 'on' | 'lit' | 'leaving'>('off')
  const [menu, setMenu] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMounted, setDrawerMounted] = useState(false)
  useFit(footRef, '--foot-size')

  /* head */
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    const [t, d] = svc ? [`${svc.title} | Prentmiðlun`, `${svc.lead} ${svc.short}`] : (TITLES[page] ?? TITLES[''])
    document.title = t
    document.documentElement.lang = 'is'
    setThemeColor('#f4f3f1')
    const a = setMetaDescription(d)
    const b = setNoindex(true)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => { document.title = prevTitle; document.documentElement.lang = prevLang; a(); b(); ld.remove() }
  }, [page, svc])

  /* intro (live-up M2): home only, once per visit, never under reduced motion */
  useLayoutEffect(() => {
    const root = rootRef.current!
    let seen = false
    try { seen = sessionStorage.getItem(INTRO_KEY) === '1' } catch { /* private mode */ }
    if (!isHome || seen || reducedMotion() || window.location.hash) { root.classList.add('is-quick'); return }
    setIntro('on')
    document.documentElement.style.overflow = 'hidden'
    /* iOS Safari paints its status strip and the band above the bottom toolbar from html/body:
       ink while the loader covers the page, paper again the moment the shutter starts lifting */
    const ink = (on: boolean) => {
      document.body.style.backgroundColor = on ? '#15191c' : ''
      document.documentElement.style.backgroundColor = on ? '#15191c' : ''
      setThemeColor(on ? '#15191c' : '#f4f3f1')
    }
    ink(true)
    const t: number[] = []
    t.push(window.setTimeout(() => setIntro('lit'), 30))
    t.push(window.setTimeout(() => ink(false), 700 + 350))
    t.push(window.setTimeout(() => setIntro('leaving'), 700))
    t.push(window.setTimeout(() => {
      setIntro('off')
      document.documentElement.style.overflow = ''
      try { sessionStorage.setItem(INTRO_KEY, '1') } catch { /* private mode */ }
      root.classList.add('is-quick')
    }, 700 + 350 + 1500 + 150))
    return () => { t.forEach(clearTimeout); setIntro('off'); document.documentElement.style.overflow = ''; ink(false) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* route change: top of page (or the anchor), menu closed */
  useEffect(() => {
    setMenuOpen(false)
    if (loc.hash) { window.setTimeout(() => scrollToHash(decodeURIComponent(loc.hash)), 90); return }
    topNow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname, loc.hash])

  /* motion branch, rebuilt for every page */
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion()) return
    return initPrentMotion(root)
  }, [loc.pathname])

  /* masthead: condensed past 60px, hidden on the way down, back on the way up */
  useEffect(() => {
    const head = headRef.current!
    let lastY = window.scrollY
    let raf = 0
    const tick = () => {
      raf = 0
      const y = window.scrollY
      head.classList.toggle('is-condensed', y > 60)
      if (!head.classList.contains('is-menu')) {
        if (y > 320 && y > lastY + 4) head.classList.add('is-hidden')
        else if (y < lastY - 4 || y <= 320) head.classList.remove('is-hidden')
      }
      lastY = y
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', on, { passive: true })
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf) }
  }, [])

  /* drawer (live-up G8-G11) */
  const setMenuOpen = useCallback((open: boolean) => {
    setMenu(open)
    document.documentElement.style.overflow = open ? 'hidden' : ''
    setThemeColor(open ? '#15191c' : '#f4f3f1')
    /* iOS Safari paints the status-bar strip from body: it goes ink with the drawer, instantly */
    document.body.style.backgroundColor = open ? '#15191c' : ''
    document.documentElement.style.backgroundColor = open ? '#15191c' : ''
    if (open) requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)))
    else setDrawerOpen(false)
  }, [])
  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu, setMenuOpen])
  useEffect(() => {
    if (menu) { setDrawerMounted(true); return }
    const t = window.setTimeout(() => setDrawerMounted(false), reducedMotion() ? 0 : 480)
    return () => clearTimeout(t)
  }, [menu])

  let body: ReactNode
  if (isHome) body = <Home />
  else if (page === 'thjonusta') body = svc ? <ServicePage s={svc} /> : <NotFound />
  else if (page === 'verk') body = <div style={{ paddingTop: 'calc(env(safe-area-inset-top) + 60px)' }}><Works full /></div>
  else if (page === 'verdtilbod') body = <QuotePage />
  else if (page === 'afgreidsla') body = <InboxPage />
  else if (page === 'um-okkur') body = <AboutPage />
  else if (page === 'personuvernd') body = <PrivacyPage />
  else body = <NotFound />

  return (
    <div ref={rootRef} className="pm" lang="is">
      <style>{css}</style>
      <PreviewChrome company={companyEntry} />
      <a className="pm-skip" href="#efni">Fara í efni</a>

      {intro !== 'off' && (
        <div className={`pm-intro${intro === 'lit' || intro === 'leaving' ? ' is-lit' : ''}${intro === 'leaving' ? ' is-leaving' : ''}`} aria-hidden="true">
          <div className="pm-intro__veil" />
          <div className="pm-intro__shutter" />
          <div className="pm-intro__mark"><img src={LOGO_LIGHT} alt="" width={1718} height={199} /><span>frá skrá að dyrum</span></div>
        </div>
      )}

      <header ref={headRef} className={`pm-head${menu ? ' is-menu' : ''}`}>
        <Link className="pm-brand" to={to()} aria-label="Prentmiðlun, forsíða">
          <img className="is-dark" src={LOGO} alt="Prentmiðlun" width={1718} height={199} />
          <img className="is-light" src={LOGO_LIGHT} alt="" width={1718} height={199} />
        </Link>
        <nav className="pm-nav" aria-label="Aðalvalmynd">
          {NAV.map((n) => <Link key={n.k} to={to(n.k)} aria-current={page === n.match ? 'page' : undefined}>{n.label}</Link>)}
          <Link className="pm-nav__cta" to={to('verdtilbod')} aria-current={page === 'verdtilbod' ? 'page' : undefined}>Verðtilboð</Link>
        </nav>
        <button type="button" className="pm-burger" aria-expanded={menu} aria-controls="pm-drawer" onClick={() => setMenuOpen(!menu)}>
          <span className="pm-burger__face pm-burger__face--open">Valmynd</span>
          <span className="pm-burger__face pm-burger__face--close">Loka</span>
          <span className="pm-sr">{menu ? 'Loka valmynd' : 'Opna valmynd'}</span>
        </button>
      </header>
      {drawerMounted && (
        <div id="pm-drawer" className={`pm-drawer${drawerOpen ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Valmynd" data-lenis-prevent="">
          <nav className="pm-drawer__links" aria-label="Valmynd">
            <Link to={to()} aria-current={isHome ? 'page' : undefined}>Forsíða</Link>
            <Link to={`${to()}#thjonusta`}>Þjónusta</Link>
            <Link to={to('verk')} aria-current={page === 'verk' ? 'page' : undefined}>Verk</Link>
            <Link to={to('verdtilbod')} aria-current={page === 'verdtilbod' ? 'page' : undefined}>Verðtilboð</Link>
            <Link to={to('um-okkur')} aria-current={page === 'um-okkur' ? 'page' : undefined}>Um okkur</Link>
          </nav>
          <div className="pm-drawer__meta">
            <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <span>{CONTACT.street}, {CONTACT.town}</span>
          </div>
        </div>
      )}

      <main id="efni" key={loc.pathname}>{body}</main>

      <footer className="pm-foot pm-night">
        <div style={{ overflow: 'hidden' }}><span className="pm-foot__name" ref={footRef} aria-hidden="true">Prentmiðlun</span></div>
        <div className="pm-foot__grid">
          <div>
            <img className="pm-foot__logo" src={LOGO_LIGHT} alt="Prentmiðlun ehf." width={1718} height={199} loading="lazy" />
            <span>Bækur, borðspil, kort og tímarit, prentuð þar sem best hentar og afhent heim að dyrum.</span>
          </div>
          <div>
            <h2>Þjónusta</h2>
            {SERVICES.map((s) => <Link key={s.slug} to={to(`thjonusta/${s.slug}`)}>{s.title}</Link>)}
          </div>
          <div>
            <h2>Samband</h2>
            <a href={`tel:${CONTACT.tel}`}>Sími {CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={CONTACT.map} target="_blank" rel="noreferrer">{CONTACT.street}<br />{CONTACT.town}</a>
            <a href={CONTACT.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </div>
          <div>
            <h2>Vefurinn</h2>
            <Link to={to('verk')}>Verk</Link>
            <Link to={to('verdtilbod')}>Verðtilboð</Link>
            <Link to={to('um-okkur')}>Um okkur</Link>
            <Link to={to('personuvernd')}>Persónuvernd</Link>
            <Link to={to('afgreidsla')}>Afgreiðsla</Link>
          </div>
        </div>
        <div className="pm-foot__legal">
          <span>© {YEAR} {CONTACT.legal} · Kt. {CONTACT.kt} · VSK-nr. {CONTACT.vsk}</span>
          <span>Frumgerð: hugmynd að nýjum vef. Textar og myndir af prentmidlun.is, sótt 9. október 2026.</span>
        </div>
      </footer>
      <PreviewFooter company={companyEntry} verifiedContent />
    </div>
  )
}
