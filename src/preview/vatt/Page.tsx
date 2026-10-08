import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Mail, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { SndrBadge } from '../SndrBadge'
import { setMetaDescription, setNoindex, setThemeColor } from '../../lib/preview'
import {
  A, BRANDS, CONTACT, DEPTS, FINANCE, IMG, JSON_LD, MODELS, ROUTE, SAMPLE_REQUESTS, SERVICE, SLOTS, STAFF,
  fullName, kr, loadRequests, modelBySlug, openState, priceLine, saveRequest, type Body, type Drive, type Model, type Photo, type Power, type Request,
} from './data'
import { answer, CHIPS, GREETING } from './chat'
import { CSS, SLATE } from './styles'

/*
 * Vatt — "Eitt hús, sex merki". DESIGN.md beside this file.
 *
 * Base: the Benni/ÍSBAND system (Host Grotesk, Drivehub chrome, Spyker
 * numbers: ease cubic-bezier(.625,.05,0,1), masked characters .8s/.018,
 * clip-scale media, buttons opening from the middle, the statement band's
 * inset(10%) clip, the header coloured at the section edge, position-tied
 * reveals). Blend: Suðurverk's CargoKite opening (no curtain; header .28s,
 * eyebrow, masked heading lines .72s/.08, masked photo .85s, body, button),
 * the pinned chapter with a progress line, and Alberici browsing for the
 * catalogue (equal dated tiles, filters, empty state, 4/8 detail).
 *
 * Routes live under /preview/vatt/*; this component reads the sub-path.
 */

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('vt', 'M0,0 C0.625,0.05 0,1 1,1')

const company = getPreviewCompany('vatt')
let pageLenis: Lenis | null = null
const isTouch = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches
const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const to = (p = '') => (p ? `${ROUTE}/${p}` : ROUTE)

function goTo(id: string) {
  const t = document.getElementById(id)
  if (!t) return
  if (pageLenis) pageLenis.scrollTo(t, { offset: -72 })
  else t.scrollIntoView({ behavior: still() ? 'auto' : 'smooth', block: 'start' })
}

/* ── small parts ────────────────────────────────────────────────────────── */

function Pic({ p, sizes, eager, className, pos }: { p: Photo; sizes: string; eager?: boolean; className?: string; pos?: string }) {
  return (
    <img className={className} src={p.src} srcSet={p.srcSet} sizes={sizes} alt={p.alt} width={p.w} height={p.h}
      style={pos ? { objectPosition: pos } : undefined}
      loading={eager ? 'eager' : 'lazy'} decoding={eager ? 'sync' : 'async'} {...(eager ? { fetchpriority: 'high' } : {})} />
  )
}

function Frame({ p, sizes, ratio, className = '', pos, parallax = true }: { p: Photo; sizes: string; ratio?: string; className?: string; pos?: string; parallax?: boolean }) {
  return (
    <div className={`frame ${className}`} style={ratio ? { aspectRatio: ratio } : undefined} data-media="">
      <div className={parallax ? 'par' : 'still-photo'} data-par={parallax ? '' : undefined}>
        <Pic p={p} sizes={sizes} pos={pos} />
      </div>
    </div>
  )
}

function Btn({ to: path, href, label, tone = 'deep', icon, onClick, ext, type, className = '' }: {
  to?: string; href?: string; label: string; tone?: 'deep' | 'dark' | 'light' | 'line' | 'ghost' | 'green'; icon?: ReactNode; onClick?: () => void; ext?: boolean; type?: 'submit' | 'button'; className?: string
}) {
  const inner = (
    <>
      <span className="sr">{label}</span>
      <span className="lbl" aria-hidden="true">
        {[...label].map((c, i) => <span key={i} className="c" style={{ '--i': i } as CSSProperties}>{c === ' ' ? '\u00A0' : c}</span>)}
      </span>
      {icon}
    </>
  )
  const cls = `btn btn-${tone} ${className}`
  if (path !== undefined) return <Link className={cls} to={to(path)} data-btn="" onClick={onClick}>{inner}</Link>
  if (href) {
    const internal = href.startsWith('#')
    return (
      <a className={cls} href={href} data-btn="" {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
        onClick={(e) => { if (internal) { e.preventDefault(); onClick?.(); goTo(href.slice(1)) } else onClick?.() }}>{inner}</a>
    )
  }
  return <button className={cls} type={type ?? 'button'} onClick={onClick} data-btn="">{inner}</button>
}

function Eyebrow({ children, dot = true, open }: { children: ReactNode; dot?: boolean; open?: boolean }) {
  return <p className="eyebrow" {...(open ? { 'data-open': '' } : { 'data-fade': '' })}>{dot && <i aria-hidden="true" />}{children}</p>
}

/* heading lines for the staged opening: each line in its own mask */
function Lines({ lines }: { lines: string[] }) {
  return <>{lines.map((l, i) => <span key={i} className="lm"><span data-line="">{l}</span></span>)}</>
}

const NAV = [
  { k: 'bilar', label: 'Bílar' },
  { k: 'fyrirtaeki', label: 'Fyrirtæki' },
  { k: 'thjonusta', label: 'Þjónusta' },
  { k: 'fjarmognun', label: 'Fjármögnun' },
  { k: 'hafa-samband', label: 'Hafa samband' },
]

function HeaderRow({ layer, focusKey, onFocusKey, onMenu, sub }: { layer: 'base' | 'top'; focusKey: string | null; onFocusKey: (k: string | null) => void; onMenu: () => void; sub: string }) {
  const hidden = layer === 'top'
  const tab = hidden ? -1 : undefined
  const f = (k: string) => (hidden ? {} : { onFocus: () => onFocusKey(k), onBlur: () => onFocusKey(null) })
  const kf = (k: string) => (hidden && focusKey === k ? ' kf' : '')
  return (
    <div className="row">
      <Link className={`logo${kf('logo')}`} to={to()} tabIndex={tab} {...f('logo')} aria-label="Vatt, forsíða">
        <img src={A(hidden ? 'vatt-logo-white.png' : 'vatt-logo.png')} alt="" width={1710} height={458} />
      </Link>
      <nav className="links" aria-label={hidden ? undefined : 'Aðalvalmynd'}>
        {NAV.map((n) => (
          <Link key={n.k} className={`nl${kf(n.k)}`} to={to(n.k)} tabIndex={tab} {...f(n.k)} aria-current={sub.split('/')[0] === n.k ? 'page' : undefined}>{n.label}</Link>
        ))}
      </nav>
      <div className="acts">
        <Link className={`pill${kf('cta')}`} to={to('reynsluakstur')} tabIndex={tab} {...f('cta')}>Bóka reynsluakstur</Link>
        <button className={`burger${kf('menu')}`} type="button" tabIndex={tab} {...f('menu')} onClick={onMenu} aria-label="Opna valmynd">
          <Menu size={22} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

type ChatEl = HTMLElement & { answerer?: typeof answer; open?: () => void }

/* ── home sections ──────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="vt-hero" aria-labelledby="h-hero">
      <div className="hfield" aria-hidden="true" />
      <div className="wrap hgrid">
        <div className="hcopy" data-hcopy="">
          <Eyebrow open dot={false}>Umboð BYD og Maxus á Íslandi</Eyebrow>
          <h1 id="h-hero"><Lines lines={['Eitt hús,', 'sex merki.']} /></h1>
          <p className="lede" data-open="">BYD og Maxus í Skeifunni 17 í dag. OMODA, EXLANTIX og JAECOO frumsýnd hér í janúar 2027. Verð, reynsluakstur og verkstæði á einum stað.</p>
          <div className="ctas" data-open="">
            <Btn to="bilar" label="Skoða bílana" tone="deep" />
            <Btn to="reynsluakstur" label="Bóka reynsluakstur" tone="line" />
          </div>
        </div>
        <figure className="hphoto" data-hphoto="">
          <div className="hmask" data-hmask=""><Pic p={IMG.hero} sizes="(min-width: 900px) 46vw, 100vw" eager /></div>
          <figcaption data-open="">BYD Sealion 7 AWD, nýjasti jeppinn í húsinu. Frá 7.990.000 kr. með rafbílastyrk.</figcaption>
        </figure>
      </div>
    </section>
  )
}

function BrandPlates() {
  const nav = useNavigate()
  const [open, setOpen] = useState(0)
  const fine = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches, [])
  const act = (i: number) => {
    const b = BRANDS[i]
    if (open !== i) { setOpen(i); return }
    if (b.status === 'now') nav(`${to('bilar')}?merki=${b.key}`)
    else if (b.status === 'jan2027') goTo('janúar')
    else nav(to('thjonusta'))
  }
  return (
    <section className="vt-brands" id="merkin" aria-labelledby="h-brands">
      <div className="wrap">
        <div className="head">
          <div>
            <Eyebrow>Merkin í Skeifunni 17</Eyebrow>
            <h2 id="h-brands" data-chars="">Veldu merki</h2>
          </div>
        </div>
        <div className="plates" role="list">
          {BRANDS.map((b, i) => (
            <button key={b.key} type="button" role="listitem" className={`plate6${b.status === 'jan2027' ? ' soon' : ''}${b.status === 'service' ? ' quiet' : ''}`} data-open={open === i ? '1' : '0'}
              onPointerEnter={() => { if (fine) setOpen(i) }} onFocus={() => setOpen(i)} onClick={() => act(i)}
              aria-label={`${b.name}: ${b.line}`} aria-expanded={open === i}>
              {b.img && <span className="ph" aria-hidden="true"><Pic p={b.img} sizes="(min-width: 900px) 40vw, 100vw" /></span>}
              {b.logo ? <img className={`mark${b.key === 'omoda' || b.key === 'exlantix' ? ' tall' : ''}`} src={A(b.logo)} alt="" aria-hidden="true" /> : <span className="word" aria-hidden="true">{b.name}</span>}
              {b.status === 'jan2027' && <span className="date">Janúar 2027</span>}
              <span className="pn" aria-hidden="true">{b.status === 'jan2027' ? 'Nýtt' : b.status === 'service' ? 'Þjónusta' : b.name}</span>
              <span className="pl" aria-hidden="true">{b.line}</span>
              {b.status !== 'service' && <span className="go" aria-hidden="true"><ArrowUpRight size={17} strokeWidth={1.6} /></span>}
            </button>
          ))}
        </div>
        <p className="pnote" data-fade="">BYD og Maxus eru í sölu núna. OMODA, EXLANTIX og JAECOO verða frumsýnd í janúar 2027. Aiways U5 fær áfram þjónustu og varahluti í húsinu.</p>
      </div>
    </section>
  )
}

type F = { merki: string; gerd: string; drif: string; afl: string }
const BODIES: Body[] = ['Smábíll', 'Fólksbíll', 'Jepplingur', 'Jeppi', 'Sendibíll', 'Pallbíll']
const matches = (x: Model, f: F) =>
  (!f.merki || x.brand.toLowerCase() === f.merki) && (!f.gerd || x.body === f.gerd) && (!f.drif || x.drive === (f.drif as Drive)) && (!f.afl || x.power === (f.afl as Power))

function Car({ x }: { x: Model }) {
  return (
    <Link className="car" to={to(`bilar/${x.slug}`)}>
      <div className="ph"><Pic p={x.img} sizes="(min-width: 1100px) 30vw, (min-width: 640px) 46vw, 46vw" /></div>
      <p className="meta"><span translate="no">{x.brand}</span><span>{x.body}</span><span>{x.power === 'Tengiltvinn' ? 'Tengiltvinn' : 'Rafmagn'} · {x.drive}</span></p>
      <h3 translate="no">{x.name}</h3>
      <p className="pr num">{priceLine(x)}{x.priceGrant && <s>{kr(x.price!)}</s>}</p>
      <p className="rg">Drægni {x.range}</p>
    </Link>
  )
}

function Catalogue({ full }: { full: boolean }) {
  const loc = useLocation()
  const nav = useNavigate()
  const sp = new URLSearchParams(loc.search)
  const f: F = { merki: sp.get('merki') ?? '', gerd: sp.get('gerd') ?? '', drif: sp.get('drif') ?? '', afl: sp.get('afl') ?? '' }
  const set = (k: keyof F, v: string) => {
    const p = new URLSearchParams(loc.search)
    if (p.get(k) === v || !v) p.delete(k); else p.set(k, v)
    nav({ pathname: loc.pathname, search: p.toString() ? `?${p}` : '' }, { replace: true })
  }
  const active = Object.values(f).filter(Boolean).length
  const shown = MODELS.filter((x) => matches(x, f))
  const list = full ? shown : shown.slice(0, 6)
  useEffect(() => { const t = window.setTimeout(() => ScrollTrigger.refresh(), 650); return () => window.clearTimeout(t) }, [loc.search])
  return (
    <section className="vt-cat" id="bilar" aria-labelledby="h-cat">
      <div className="wrap">
        <div className="head">
          <div>
            <h2 id="h-cat" data-chars="">{full ? 'Allir bílar í húsinu' : 'Verðin standa á síðunni'}</h2>
          </div>
          {!full && <Link className="tlink" to={to('bilar')}>Allir bílar og síur <ArrowUpRight size={15} aria-hidden="true" /></Link>}
        </div>
        <div className="filters" role="group" aria-label="Sía bíla">
          <div className="fgroup"><span>Merki</span>{['byd', 'maxus'].map((k) => <button key={k} type="button" className="chip" aria-pressed={f.merki === k} onClick={() => set('merki', k)}>{k === 'byd' ? 'BYD' : 'Maxus'}</button>)}</div>
          {full && <div className="fgroup"><span>Gerð</span>{BODIES.map((k) => <button key={k} type="button" className="chip" aria-pressed={f.gerd === k} onClick={() => set('gerd', k)}>{k}</button>)}</div>}
          <div className="fgroup"><span>Drif</span>{(['Framhjóladrif', 'Fjórhjóladrif'] as Drive[]).map((k) => <button key={k} type="button" className="chip" aria-pressed={f.drif === k} onClick={() => set('drif', k)}>{k}</button>)}</div>
          <div className="fgroup"><span>Afl</span>{(['Rafmagn', 'Tengiltvinn'] as Power[]).map((k) => <button key={k} type="button" className="chip" aria-pressed={f.afl === k} onClick={() => set('afl', k)}>{k}</button>)}</div>
          <p className="fcount num" role="status">{shown.length} {shown.length === 1 ? 'bíll' : 'bílar'}{active > 0 && <button type="button" onClick={() => nav({ pathname: loc.pathname }, { replace: true })}>Hreinsa síur</button>}</p>
        </div>
        {shown.length === 0 ? (
          <div className="empty">
            <h3>Enginn bíll passar við þessa samsetningu.</h3>
            <p>Prófaðu færri síur. Tengiltvinnbíllinn er aðeins einn: BYD Seal U AWD.</p>
            <Btn label="Hreinsa síur" tone="dark" onClick={() => nav({ pathname: loc.pathname }, { replace: true })} />
          </div>
        ) : (
          <motion.ul className="grid" layout role="list">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((x) => (
                <motion.li key={x.slug} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: still() ? 0 : 0.5, ease: [0.625, 0.05, 0, 1] }}>
                  <Car x={x} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
        <p className="fine">Verð af verðlistum byd.is og maxus.is, lesin 8. október 2026. „Með styrk“ er verð framleiðandans að frádregnum 500.000 kr. rafbílastyrk Orkusjóðs, með skilyrðum sjóðsins. Sendibílar einnig á verði án vsk. Myndir eru framleiðendamyndir og geta sýnt aukabúnað.</p>
      </div>
    </section>
  )
}

function Launch() {
  const soon = BRANDS.filter((b) => b.status === 'jan2027')
  return (
    <>
      <section className="vt-launch on-dark" id="janúar" data-tone="dark" aria-labelledby="h-launch">
        <div className="stage" data-stage="">
          <div className="wrap lgrid">
            <div className="lcopy">
              <Eyebrow>Janúar 2027</Eyebrow>
              <h2 id="h-launch" data-chars="">Við lyftum hulunni í janúar.</h2>
              <p data-lines="">OMODA, EXLANTIX og JAECOO bætast í hópinn hjá Vatt og verða frumsýnd í Skeifunni 17 í janúar 2027. Þangað til standa BYD og Maxus í salnum, og verkstæðið sinnir öllum merkjunum.</p>
              <p className="lcount num" aria-hidden="true"><span data-count="">0</span> af 3 merkjum afhjúpuð</p>
              <div className="prog" aria-hidden="true"><span data-prog="" /></div>
            </div>
            <ul className="lplates" role="list">
              {soon.map((b, i) => (
                <li key={b.key} className="lp" data-plate={i}>
                  <img src={A(b.logo!)} alt={`${b.name} merkið`} data-mark="" />
                  <span className="lname">{b.name}</span>
                  <span className="veil" data-veil="" aria-hidden="true"><i /></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="vt-statement" aria-labelledby="h-state">
        <div className="scopy">
          <h2 id="h-state" data-chars=""><span>Taktu janúar frá.</span></h2>
          <p data-lines="">Frumsýningin verður í Skeifunni 17. Söludeildin lætur þig vita þegar dagsetningin er fest, og þú getur prófað BYD og Maxus á meðan.</p>
          <div className="ctas">
            <Btn to="hafa-samband" label="Láta vita þegar þau koma" tone="dark" />
            <Btn to="reynsluakstur" label="Bóka reynsluakstur" tone="light" />
          </div>
        </div>
      </section>
    </>
  )
}

function FleetBand() {
  const vans = MODELS.filter((x) => x.fleet)
  return (
    <section className="vt-fleet" id="floti" aria-labelledby="h-fleet">
      <div className="wrap fgrid">
        <div className="fintro">
          <Eyebrow>Maxus fyrir fyrirtæki</Eyebrow>
          <h2 id="h-fleet" data-chars="">Atvinnubílar sem hlaðast á nóttunni</h2>
          <p data-lines="">Tveir rafsendibílar og einn rafpallbíll, allir með 5 ára ábyrgð. Verð án vsk. og fjármögnun fyrir rekstraraðila eru á fyrirtækjasíðunni.</p>
          <Btn to="fyrirtaeki" label="Fá tilboð í flota" tone="deep" />
        </div>
        <figure className="fa"><Frame p={IMG.fleetDoors} sizes="(min-width: 900px) 48vw, 100vw" ratio="3 / 2" /><figcaption>Maxus e-Deliver 7 með rennihurðir báðum megin.</figcaption></figure>
        <ul className="vans grid" data-items="" role="list">
          {vans.map((x) => (
            <li key={x.slug}>
              <Car x={x} />
              <p className="rg num" style={{ marginTop: 6 }}>{x.priceExVat ? `Án vsk. ${kr(x.priceExVat)}` : 'Verð án vsk. hjá söludeild'} · {x.cargo ?? x.payload} · dregur {x.tow}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ServiceBand({ full }: { full: boolean }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 60_000); return () => window.clearInterval(t) }, [])
  const w = openState(DEPTS[1], now)
  return (
    <section className="vt-serv" id="verkstaedi" aria-labelledby="h-serv">
      <div className="wrap sgrid">
        <div className="sintro">
          <h2 id="h-serv" data-chars="">Verkstæðið í Skeifunni, og tvö úti á landi</h2>
          <p data-lines="">Þjónustuverkstæði, varahlutir og aukahlutir fyrir BYD, Maxus og Aiways eru í Skeifunni 17. Höldur á Akureyri og TR þjónusta í Reykjanesbæ sinna sömu bílum. Verkstæðið er {w.text.toLowerCase()}; opið mánudaga til fimmtudaga kl. 8–17 og föstudaga kl. 8–16.</p>
          <div className="ctas" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Btn to="verkstaedi" label="Bóka verkstæðistíma" tone="deep" />
            {!full && <Btn to="thjonusta" label="Vegaaðstoð og rafhlöður" tone="line" />}
          </div>
        </div>
        <div className="rows" data-items="">
          {SERVICE.shops.map((s) => (
            <article key={s.key} className="r">
              <div><h3>{s.name}</h3><p className="sub">{s.street ? `${s.street}, ` : ''}{s.town}</p></div>
              <a href={`tel:${s.tel}`} className="tel num">{s.phone}</a>
              <span className="role">{s.role}</span>
            </article>
          ))}
        </div>
        {full && (
          <>
            <div className="sintro" style={{ gridColumn: '1 / -1', marginTop: 40 }}>
              <h2 data-chars="">Vegaaðstoð utan opnunartíma</h2>
              <p data-lines="">{SERVICE.roadsideNote}</p>
            </div>
            <div className="rows" style={{ gridColumn: '1 / -1' }}>
              {SERVICE.roadside.map((r) => <article key={r.name} className="r"><div><h3>{r.name}</h3></div><a href={`tel:${r.tel}`} className="tel num">{r.phone}</a><span className="role">Allan sólarhringinn hjá þeim, ekki Vatt</span></article>)}
              {SERVICE.body.map((r) => <article key={r.name} className="r"><div><h3>{r.name}</h3><p className="sub">{r.street}, 104 Reykjavík</p></div><a href={`tel:+354${r.phone.replace(' ', '')}`} className="tel num">{r.phone}</a><span className="role">Réttingar og sprautun</span></article>)}
            </div>
            <div className="sintro" style={{ gridColumn: '1 / -1', marginTop: 40 }}>
              <h2 data-chars="">Rafhlöðum skilað án endurgjalds</h2>
              <p data-lines="">{SERVICE.battery}</p>
            </div>
            <figure className="sphoto"><Frame p={IMG.charge} sizes="100vw" ratio="21 / 9" pos="50% 45%" /></figure>
          </>
        )}
      </div>
    </section>
  )
}

function FinanceBand({ full }: { full: boolean }) {
  return (
    <section className="vt-fin" id="fjarmognun" aria-labelledby="h-fin">
      <div className="wrap">
        <h2 id="h-fin" data-chars="">Fjórir lánveitendur, þrjár leiðir</h2>
        <div className="fin" data-items="">
          {FINANCE.products.map((p, i) => (
            <article key={p.name}>
              <h3>{p.name}</h3>
              <p className="big num">{['90 %', '80 %', '75 %'][i]}</p>
              <p>{p.terms}</p>
            </article>
          ))}
        </div>
        <p className="lenders" data-fade="">{FINANCE.lenders.map((l) => <span key={l}><i aria-hidden="true" />{l}</span>)}</p>
        <p className="gr" data-fade="">{FINANCE.business} {FINANCE.grant}</p>
        {full && <div style={{ marginTop: 40, display: 'flex', gap: 10, flexWrap: 'wrap' }}><Btn to="hafa-samband" label="Fá fjármögnunartilboð" tone="deep" /><Btn to="bilar" label="Skoða bílana" tone="line" /></div>}
      </div>
    </section>
  )
}

function DriveBand() {
  return (
    <section className="vt-drive on-dark" id="reynsluakstur" data-tone="dark" aria-labelledby="h-drive">
      <div className="dbg"><div className="par" data-par=""><Pic p={IMG.drive} sizes="100vw" /></div></div>
      <div className="dshade" aria-hidden="true" />
      <div className="wrap dgrid">
        <div className="dcopy">
          <h2 id="h-drive" data-chars="">Prófaðu bílinn áður en þú velur</h2>
          <p data-lines="">Veldu bíl, dag og tíma. Söludeildin staðfestir símleiðis og bíllinn bíður í Skeifunni 17.</p>
        </div>
        <div className="dcard" data-fade="">
          <p>Reynsluakstur á opnunartíma söludeildar: mánudaga til fimmtudaga kl. 8:30–17, föstudaga til kl. 16 og laugardaga kl. 13–16.</p>
          <div className="two">
            <Btn to="reynsluakstur" label="Bóka reynsluakstur" tone="green" />
            <Btn to="verkstaedi" label="Verkstæðistími" tone="ghost" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <BrandPlates />
      <Catalogue full={false} />
      <Launch />
      <FleetBand />
      <ServiceBand full={false} />
      <FinanceBand full={false} />
      <DriveBand />
    </>
  )
}

/* ── route pages ────────────────────────────────────────────────────────── */

function Intro({ eyebrow, title, lede, crumb }: { eyebrow?: string; title: string[]; lede?: string; crumb?: { to: string; label: string } }) {
  return (
    <div className="intro">
      {crumb && <Link className="crumb" to={to(crumb.to)}><ArrowLeft size={14} aria-hidden="true" />{crumb.label}</Link>}
      {eyebrow && <Eyebrow open>{eyebrow}</Eyebrow>}
      <h1><Lines lines={title} /></h1>
      {lede && <p className="lede" data-open="">{lede}</p>}
    </div>
  )
}

function CarsPage() {
  return (
    <div className="vt-page" style={{ paddingBottom: 0 }}>
      <div className="wrap"><Intro eyebrow="BYD og Maxus" title={['Bílarnir í húsinu']} lede="Tíu gerðir með verðum af verðlistum framleiðendanna. Síaðu eftir merki, gerð, drifi og afli." /></div>
      <Catalogue full />
      <DriveBand />
    </div>
  )
}

function DetailPage({ slug }: { slug: string }) {
  const x = modelBySlug(slug)
  if (!x) return <NotFound />
  const specs: [string, string | undefined][] = [['Drægni (WLTP)', x.range], ['Rafhlaða', x.battery], ['Afl', x.powerLine], ['0–100 km/klst', x.accel], ['Hraðhleðsla', x.charge], ['Drif', x.drive], ['Sæti', String(x.seats)], ['Farangur', x.cargo], ['Dráttargeta', x.tow], ['Burðargeta', x.payload]]
  const more = MODELS.filter((m) => m.slug !== x.slug && (m.body === x.body || m.brand === x.brand)).slice(0, 3)
  return (
    <div className="vt-page vt-detail">
      <div className="wrap">
        <div className="dhead">
          <div>
            <Link className="crumb" to={to('bilar')}><ArrowLeft size={14} aria-hidden="true" />Allir bílar</Link>
            <Eyebrow open dot={false}>{x.brand} · {x.body} · {x.power === 'Tengiltvinn' ? 'Tengiltvinnbíll' : 'Rafbíll'}</Eyebrow>
            <h1 translate="no"><Lines lines={[x.name]} /></h1>
            <p className="price num" data-open="">
              {x.price === null ? 'Verð á fyrirspurn' : x.priceGrant ? kr(x.priceGrant) : kr(x.price)}
              <small>{x.price === null ? 'Framleiðandinn birtir ekki verð á þessari gerð.' : x.priceGrant ? `Með 500.000 kr. rafbílastyrk Orkusjóðs. Listaverð ${kr(x.price)}.${x.priceExVat ? ` Án vsk. ${kr(x.priceExVat)}.` : ''}` : `Listaverð framleiðanda.${x.priceExVat ? ` Án vsk. ${kr(x.priceExVat)}.` : ''}`}</small>
            </p>
            <div className="dact" data-open="">
              <Btn to={`reynsluakstur?bill=${x.slug}`} label="Bóka reynsluakstur" tone="deep" />
              <Btn to={x.fleet ? 'fyrirtaeki' : 'fjarmognun'} label={x.fleet ? 'Tilboð fyrir fyrirtæki' : 'Fjármögnun'} tone="line" />
            </div>
          </div>
          <figure className="hphoto" data-hphoto=""><div className="hmask dmain frame" data-hmask="" style={{ aspectRatio: '3 / 2' }}><Pic p={x.img} sizes="(min-width: 900px) 62vw, 100vw" eager className="still" /></div></figure>
        </div>
        <dl className="specs" data-items="">
          {specs.filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <div className="dbody">
          <div>
            <h2 data-chars="">Það sem skiptir máli</h2>
            <ul className="facts" style={{ marginTop: 24 }}>
              {x.facts.map((f) => <li key={f}>{f}</li>)}
              <li>Ábyrgð: {x.warranty}</li>
              {x.power === 'Tengiltvinn' && <li>Tengiltvinnbíll: bensínvél og rafmótor saman. Ekur 70–98 km á rafmagni einu og sér; hann er ekki hreinn rafbíll.</li>}
            </ul>
            <p className="src">Tölur og verð: <a href={x.source} target="_blank" rel="noopener">{x.source.replace('https://www.', '')}</a> og verðlisti framleiðanda, 8. október 2026.</p>
          </div>
          <div className="gal">
            {x.gallery.map((g, i) => <Frame key={i} p={g} sizes="(min-width: 900px) 56vw, 100vw" ratio={i === 0 ? '16 / 9' : '4 / 3'} />)}
          </div>
        </div>
        <div className="more">
          <h2 data-chars="">Skyldir bílar</h2>
          <ul className="grid" style={{ marginTop: 32 }} data-items="">{more.map((m) => <li key={m.slug}><Car x={m} /></li>)}</ul>
        </div>
      </div>
    </div>
  )
}

/* after a failed submit the first invalid field gets focus */
function focusFirst(form: HTMLFormElement, er: Record<string, string>) {
  window.setTimeout(() => {
    const k = Object.keys(er)[0]
    const el = form.querySelector<HTMLElement>(`[name="${k}"], [aria-invalid="true"]`)
    ;(el ?? form.querySelector<HTMLElement>('.err'))?.focus?.()
  }, 0)
}

/* days the forms offer: the next ten opening days from today, UTC like the clock */
function nextDays(sat: boolean): { v: string; label: string }[] {
  const out: { v: string; label: string }[] = []
  const d = new Date()
  const days = ['sun.', 'mán.', 'þri.', 'mið.', 'fim.', 'fös.', 'lau.']
  const months = ['jan.', 'feb.', 'mars', 'apr.', 'maí', 'júní', 'júlí', 'ág.', 'sept.', 'okt.', 'nóv.', 'des.']
  for (let i = 1; out.length < 10 && i < 30; i++) {
    const t = new Date(d.getTime() + i * 86_400_000)
    const wd = t.getUTCDay()
    if (wd === 0 || (wd === 6 && !sat)) continue
    out.push({ v: t.toISOString().slice(0, 10), label: `${days[wd]} ${t.getUTCDate()}. ${months[t.getUTCMonth()]}` })
  }
  return out
}

function Done({ r, back }: { r: Request; back: ReactNode }) {
  return (
    <div className="done" role="status">
      <h2>Beiðnin er komin til okkar.</h2>
      <dl>
        <div><dt>Númer</dt><dd className="id num">{r.id}</dd></div>
        <div><dt>{r.kind === 'verkstaedi' ? 'Verk' : 'Bíll'}</dt><dd>{r.title}</dd></div>
        <div><dt>Hvenær</dt><dd>{r.when}</dd></div>
        <div><dt>Staðfesting</dt><dd>{r.kind === 'floti' ? 'Söludeildin hefur samband innan tveggja virkra daga' : 'Söludeildin hringir í þig og staðfestir'}</dd></div>
      </dl>
      <div className="acts">{back}</div>
      <p className="proto-note">Frumgerð: beiðnin er geymd í þessum vafra og birtist á <Link to={to('afgreidsla')} style={{ textDecoration: 'underline' }}>afgreiðslusíðunni</Link>. Ekkert er sent til Vatt.</p>
    </div>
  )
}

function Field({ label, name, type = 'text', required, auto, mode, value, onChange, error, placeholder }: { label: string; name: string; type?: string; required?: boolean; auto?: string; mode?: 'tel' | 'email'; value?: string; onChange?: (v: string) => void; error?: string; placeholder?: string }) {
  return (
    <label>
      <span>{label}</span>
      <input name={name} type={type} required={required} autoComplete={auto} inputMode={mode} spellCheck={type === 'email' || type === 'tel' ? false : undefined} value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} aria-invalid={error ? 'true' : undefined} placeholder={placeholder} />
      {error && <p className="err" role="alert">{error}</p>}
    </label>
  )
}

function TestDrivePage() {
  const loc = useLocation()
  const pre = new URLSearchParams(loc.search).get('bill') ?? ''
  const [step, setStep] = useState(pre ? 2 : 1)
  const [car, setCar] = useState(pre)
  const [day, setDay] = useState('')
  const [slot, setSlot] = useState('')
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const days = useMemo(() => nextDays(true), [])
  const model = modelBySlug(car)
  const satSlots = (v: string) => (new Date(`${v}T12:00:00Z`).getUTCDay() === 6 ? SLOTS.filter((s) => ['13:00', '14:00', '15:00'].includes(s)) : SLOTS)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('nafn') ?? '').trim(), tel = String(fd.get('simi') ?? '').trim()
    const er: Record<string, string> = {}
    if (name.length < 2) er.nafn = 'Skrifaðu nafnið þitt.'
    if (!/^\+?[\d\s-]{7,}$/.test(tel)) er.simi = 'Skrifaðu símanúmer, 7 tölustafi.'
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    const d = days.find((x) => x.v === day)
    setDone(saveRequest({ kind: 'reynsluakstur', title: model ? fullName(model) : 'Bíll valinn síðar', when: `${d?.label ?? day} kl. ${slot}`, who: name, contact: tel, detail: String(fd.get('ath') ?? '') }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="vt-page">
      <div className="wrap">
        <Intro eyebrow="Reynsluakstur" title={['Veldu bíl,', 'dag og tíma.']} lede="Söludeildin staðfestir símleiðis. Reynsluakstur hefst í Skeifunni 17 á opnunartíma söludeildar." />
        <div className="book-grid">
          {done ? <Done r={done} back={<><Btn to="bilar" label="Skoða fleiri bíla" tone="dark" /><Btn label="Bóka annan tíma" tone="line" onClick={() => { setDone(null); setStep(1); setCar(''); setDay(''); setSlot('') }} /></>} /> : (
            <form className="form" onSubmit={submit} noValidate>
              <div className="steps" aria-label="Skref">
                {['Bíll', 'Tími', 'Þú'].map((s, i) => <span key={s} aria-current={step === i + 1 ? 'step' : undefined}><span className="num">{i + 1}</span> {s}</span>)}
              </div>
              {step === 1 && (
                <>
                  <fieldset>
                    <legend>Hvaða bíl viltu prófa?</legend>
                    <div className="opts">
                      {MODELS.map((x) => <label key={x.slug} className="opt"><input type="radio" name="bill" value={x.slug} checked={car === x.slug} onChange={() => setCar(x.slug)} /><span>{fullName(x)}</span></label>)}
                    </div>
                  </fieldset>
                  <div className="acts"><Btn label="Næsta: tími" tone="deep" onClick={() => { if (car) setStep(2) }} /><span className="note">{car ? `${fullName(model!)} valinn.` : 'Veldu bíl til að halda áfram.'}</span></div>
                </>
              )}
              {step === 2 && (
                <>
                  <p className="note">{model ? `${fullName(model)}.` : ''} <button type="button" style={{ textDecoration: 'underline' }} onClick={() => setStep(1)}>Breyta bíl</button></p>
                  <fieldset>
                    <legend>Dagur</legend>
                    <div className="opts">{days.map((d) => <label key={d.v} className="opt"><input type="radio" name="dagur" value={d.v} checked={day === d.v} onChange={() => { setDay(d.v); setSlot('') }} /><span>{d.label}</span></label>)}</div>
                  </fieldset>
                  <fieldset>
                    <legend>Tími</legend>
                    <div className="opts">{(day ? satSlots(day) : SLOTS).map((s) => <label key={s} className="opt"><input type="radio" name="timi" value={s} disabled={!day} checked={slot === s} onChange={() => setSlot(s)} /><span className="num">{s}</span></label>)}</div>
                    {!day && <p className="note" style={{ marginTop: 8 }}>Veldu dag fyrst. Á laugardögum er opið kl. 13–16.</p>}
                  </fieldset>
                  <div className="acts"><Btn label="Næsta: þínar upplýsingar" tone="deep" onClick={() => { if (day && slot) setStep(3) }} /><button type="button" className="tlink" onClick={() => setStep(1)}>Til baka</button></div>
                </>
              )}
              {step === 3 && (
                <>
                  <p className="note">{model ? `${fullName(model)}, ` : ''}{days.find((x) => x.v === day)?.label} kl. {slot}. <button type="button" style={{ textDecoration: 'underline' }} onClick={() => setStep(2)}>Breyta</button></p>
                  <div className="two">
                    <Field label="Nafn" name="nafn" required auto="name" error={err.nafn} />
                    <Field label="Sími" name="simi" type="tel" required auto="tel" mode="tel" error={err.simi} />
                  </div>
                  <label><span>Athugasemd (valfrjálst)</span><textarea name="ath" rows={3} placeholder="Til dæmis: vil líka sjá Seal U, eða þarf krókinn" /></label>
                  <div className="acts"><Btn type="submit" label="Senda beiðni" tone="deep" /><button type="button" className="tlink" onClick={() => setStep(2)}>Til baka</button></div>
                  <p className="note">Söludeildin hringir og staðfestir. Upplýsingarnar eru aðeins notaðar til að bóka þennan tíma.</p>
                </>
              )}
            </form>
          )}
          <aside className="aside">
            <h3>Söludeild, Skeifan 17</h3>
            <p>Mánudaga til fimmtudaga kl. 8:30–17, föstudaga kl. 8:30–16, laugardaga kl. 13–16. Lokað á laugardögum um hásumarið og í desember.</p>
            <p>Frekar hringja? <a href={`tel:${CONTACT.tel}`} className="tlink">{CONTACT.phone}</a></p>
            <Frame p={IMG.drive} sizes="(min-width: 900px) 36vw, 100vw" ratio="4 / 3" />
          </aside>
        </div>
      </div>
    </div>
  )
}

function WorkshopPage() {
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const [job, setJob] = useState('')
  const [day, setDay] = useState('')
  const [slot, setSlot] = useState('')
  const days = useMemo(() => nextDays(false), [])
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('nafn') ?? '').trim(), tel = String(fd.get('simi') ?? '').trim(), reg = String(fd.get('numer') ?? '').trim().toUpperCase(), bill = String(fd.get('bill') ?? '').trim()
    const er: Record<string, string> = {}
    if (!job) er.job = 'Veldu verk.'
    if (!day || !slot) er.timi = 'Veldu dag og tíma.'
    if (!/^[A-ZÞÆÖÐ]{2,3}[- ]?\d{2,3}$/.test(reg)) er.numer = 'Skrifaðu bílnúmer, til dæmis AB-123.'
    if (bill.length < 3) er.bill = 'Hvaða bíll er þetta? Til dæmis BYD Atto 3, 2024.'
    if (name.length < 2) er.nafn = 'Skrifaðu nafnið þitt.'
    if (!/^\+?[\d\s-]{7,}$/.test(tel)) er.simi = 'Skrifaðu símanúmer, 7 tölustafi.'
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    const d = days.find((x) => x.v === day)
    setDone(saveRequest({ kind: 'verkstaedi', title: `${job}, ${bill}`, when: `${d?.label ?? day} kl. ${slot}`, who: name, contact: tel, detail: `Bílnúmer ${reg}. ${String(fd.get('ath') ?? '')}` }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="vt-page">
      <div className="wrap">
        <Intro eyebrow="Verkstæðið í Skeifunni 17" title={['Panta tíma', 'á verkstæði.']} lede="Veldu verk, dag og tíma. Verkstæðið staðfestir símleiðis. Bílar í ábyrgð fá ábyrgðarmál afgreidd hér." />
        <div className="book-grid">
          {done ? <Done r={done} back={<><Btn to="thjonusta" label="Þjónustusíðan" tone="dark" /><Btn label="Panta annan tíma" tone="line" onClick={() => { setDone(null); setJob(''); setDay(''); setSlot('') }} /></>} /> : (
            <form className="form" onSubmit={submit} noValidate>
              <fieldset>
                <legend>Verk</legend>
                <div className="opts">{SERVICE.jobs.map((j) => <label key={j} className="opt"><input type="radio" name="verk" value={j} checked={job === j} onChange={() => setJob(j)} /><span>{j}</span></label>)}</div>
                {err.job && <p className="err">{err.job}</p>}
              </fieldset>
              <div className="two">
                <Field label="Bílnúmer" name="numer" required error={err.numer} placeholder="AB-123" />
                <Field label="Bíll og árgerð" name="bill" required error={err.bill} placeholder="BYD Atto 3, 2024" />
              </div>
              <fieldset>
                <legend>Dagur</legend>
                <div className="opts">{days.map((d) => <label key={d.v} className="opt"><input type="radio" name="dagur" value={d.v} checked={day === d.v} onChange={() => setDay(d.v)} /><span>{d.label}</span></label>)}</div>
              </fieldset>
              <fieldset>
                <legend>Koma með bílinn</legend>
                <div className="opts">{['8:00', '9:00', '10:00', '11:00', '13:00', '14:00'].map((s) => <label key={s} className="opt"><input type="radio" name="timi" value={s} disabled={!day} checked={slot === s} onChange={() => setSlot(s)} /><span className="num">{s}</span></label>)}</div>
                {err.timi && <p className="err">{err.timi}</p>}
              </fieldset>
              <div className="two">
                <Field label="Nafn" name="nafn" required auto="name" error={err.nafn} />
                <Field label="Sími" name="simi" type="tel" required auto="tel" mode="tel" error={err.simi} />
              </div>
              <label><span>Lýsing (valfrjálst)</span><textarea name="ath" rows={3} placeholder="Hvað er að, hvenær byrjaði það, viðvörunarljós" /></label>
              <div className="acts"><Btn type="submit" label="Panta tíma" tone="deep" /></div>
              <p className="note">Verkstæðið staðfestir símleiðis. Utan Reykjavíkur: Höldur á Akureyri 461 6060, TR þjónusta í Reykjanesbæ 420 6600.</p>
            </form>
          )}
          <aside className="aside">
            <h3>Verkstæði og varahlutir</h3>
            <p>Mánudaga til fimmtudaga kl. 8–17, föstudaga kl. 8–16. <a href={`tel:${CONTACT.tel}`} className="tlink">{CONTACT.phone}</a>, <a href={`mailto:${CONTACT.workshop}`} className="tlink">{CONTACT.workshop}</a>.</p>
            <p>{SERVICE.roadsideNote}</p>
            <Frame p={IMG.charge} sizes="(min-width: 900px) 36vw, 100vw" ratio="4 / 3" pos="50% 45%" />
          </aside>
        </div>
      </div>
    </div>
  )
}

function FleetPage() {
  const vans = MODELS.filter((x) => x.fleet)
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const co = String(fd.get('fyrirtaeki') ?? '').trim(), name = String(fd.get('nafn') ?? '').trim(), email = String(fd.get('netfang') ?? '').trim()
    const picked = vans.filter((v) => fd.get(`v-${v.slug}`)).map((v) => `${fd.get(`n-${v.slug}`) || 1} × ${v.name}`)
    const er: Record<string, string> = {}
    if (co.length < 2) er.fyrirtaeki = 'Nafn fyrirtækis.'
    if (name.length < 2) er.nafn = 'Nafn tengiliðar.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) er.netfang = 'Netfang sem tilboðið fer á.'
    if (!picked.length) er.bilar = 'Hakaðu við að minnsta kosti einn bíl.'
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    setDone(saveRequest({ kind: 'floti', title: `Tilboð í ${picked.join(', ')}`, when: String(fd.get('hvenaer') || 'Afhending óákveðin'), who: co, contact: `${name}, ${email}`, detail: `${fd.get('fjarmognun')}. ${String(fd.get('ath') ?? '')}` }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="vt-page" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <Intro eyebrow="Fyrirtæki og rekstraraðilar" title={['Maxus flotinn,', 'verð án vsk.']} lede="Þrír rafmagnaðir atvinnubílar með 5 ára ábyrgð. Söludeildin setur upp tilboð með bílaláni eða kaupleigu hjá Ergo, Arion banka, Landsbankanum eða Lykli." />
        <ul className="grid" data-items="" style={{ marginBottom: 'var(--sec)' }}>
          {vans.map((x) => (
            <li key={x.slug}>
              <Car x={x} />
              <p className="rg num" style={{ marginTop: 6 }}>{x.priceExVat ? `Án vsk. ${kr(x.priceExVat)}` : 'Verð án vsk. hjá söludeild'} · {x.cargo ?? x.payload} · {x.tow} dráttargeta</p>
            </li>
          ))}
        </ul>
        <div className="book-grid" id="tilbod" data-anchor="">
          {done ? <Done r={done} back={<><Btn to="bilar" label="Skoða alla bíla" tone="dark" /><Btn label="Önnur beiðni" tone="line" onClick={() => setDone(null)} /></>} /> : (
            <form className="form" onSubmit={submit} noValidate>
              <h2 style={{ fontSize: 'clamp(26px,2.6vw,36px)' }}>Fá tilboð í flota</h2>
              <fieldset>
                <legend>Bílar og fjöldi</legend>
                {vans.map((v) => (
                  <div key={v.slug} style={{ display: 'grid', gridTemplateColumns: '1fr 96px', gap: 12, alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--line)' }}>
                    <label className="opt" style={{ display: 'flex' }}><input type="checkbox" name={`v-${v.slug}`} /><span>{fullName(v)}</span></label>
                    <input name={`n-${v.slug}`} type="number" min={1} max={99} defaultValue={1} aria-label={`Fjöldi ${v.name}`} />
                  </div>
                ))}
                {err.bilar && <p className="err">{err.bilar}</p>}
              </fieldset>
              <div className="two">
                <Field label="Fyrirtæki" name="fyrirtaeki" required auto="organization" error={err.fyrirtaeki} />
                <label><span>Afhending</span><select name="hvenaer" defaultValue=""><option value="">Óákveðin</option><option>Innan mánaðar</option><option>Innan þriggja mánaða</option><option>Á næsta ári</option></select></label>
              </div>
              <div className="two">
                <Field label="Tengiliður" name="nafn" required auto="name" error={err.nafn} />
                <Field label="Netfang" name="netfang" type="email" required auto="email" mode="email" error={err.netfang} />
              </div>
              <fieldset>
                <legend>Fjármögnun</legend>
                <div className="opts">{['Staðgreitt', 'Bílalán', 'Kaupleiga', 'Óákveðið'].map((o, i) => <label key={o} className="opt"><input type="radio" name="fjarmognun" value={o} defaultChecked={i === 3} /><span>{o}</span></label>)}</div>
              </fieldset>
              <label><span>Notkun og hleðsla (valfrjálst)</span><textarea name="ath" rows={3} placeholder="Daglegur akstur, hleðsla á athafnasvæði, innréttingar" /></label>
              <div className="acts"><Btn type="submit" label="Senda tilboðsbeiðni" tone="deep" /></div>
              <p className="note">Söludeildin svarar innan tveggja virkra daga með verði án vsk., afhendingartíma og fjármögnunarleið.</p>
            </form>
          )}
          <aside className="aside">
            <h3>Fyrir reksturinn</h3>
            <p>{FINANCE.business}</p>
            <p>Ábyrgð á nýjum Maxus: 5 ár / 100.000 km á bíl og 8 ár á rafhlöðu. Rafhlöðum er skilað til Vatt án endurgjalds þegar þar að kemur.</p>
            <Frame p={IMG.fleetCargo} sizes="(min-width: 900px) 36vw, 100vw" ratio="4 / 3" />
          </aside>
        </div>
      </div>
      <div style={{ marginTop: 'var(--sec)' }}><ServiceBand full={false} /></div>
    </div>
  )
}

function ContactPage() {
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const [now] = useState(() => new Date())
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('nafn') ?? '').trim(), email = String(fd.get('netfang') ?? '').trim(), msg = String(fd.get('skilabod') ?? '').trim()
    const er: Record<string, string> = {}
    if (name.length < 2) er.nafn = 'Skrifaðu nafnið þitt.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) er.netfang = 'Netfang sem við svörum á.'
    if (msg.length < 5) er.skilabod = 'Hvað getum við gert fyrir þig?'
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    setDone(saveRequest({ kind: 'fyrirspurn', title: String(fd.get('efni') || 'Fyrirspurn'), when: 'Svar á netfang', who: name, contact: email, detail: msg }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  const groups: [Request['kind'] | string, string][] = [['stjorn', 'Stjórnendur'], ['sala', 'Söludeild'], ['thjonusta', 'Þjónusta']]
  return (
    <div className="vt-page vt-contact">
      <div className="wrap">
        <Intro eyebrow="Skeifan 17" title={['Hafðu samband.']} lede="Eitt símanúmer fyrir allt húsið, og hvert netfang hér virkar. Söludeildin svarar fyrirspurnum um bíla, fjármögnun og nýju merkin." />
        <div className="cgrid">
          <div>
            {done ? <Done r={done} back={<Btn label="Önnur fyrirspurn" tone="line" onClick={() => setDone(null)} />} /> : (
              <form className="form" onSubmit={submit} noValidate>
                <div className="two">
                  <Field label="Nafn" name="nafn" required auto="name" error={err.nafn} />
                  <Field label="Netfang" name="netfang" type="email" required auto="email" mode="email" error={err.netfang} />
                </div>
                <label><span>Efni</span><select name="efni" defaultValue="Fyrirspurn um bíl"><option>Fyrirspurn um bíl</option><option>Láta vita þegar nýju merkin koma</option><option>Fjármögnun</option><option>Verkstæði og varahlutir</option><option>Annað</option></select></label>
                <label><span>Skilaboð</span><textarea name="skilabod" rows={5} aria-invalid={err.skilabod ? 'true' : undefined} />{err.skilabod && <p className="err">{err.skilabod}</p>}</label>
                <div className="acts"><Btn type="submit" label="Senda" tone="deep" /></div>
                <p className="note">Við notum netfangið aðeins til að svara þessari fyrirspurn. <Link to={to('personuvernd')} style={{ textDecoration: 'underline' }}>Persónuvernd</Link>.</p>
              </form>
            )}
            <div className="where" data-fade="">
              <strong>Vatt ehf., Skeifan 17, 108 Reykjavík</strong>
              <dl>
                <div><dt>Sími</dt><dd><a href={`tel:${CONTACT.tel}`} className="num">{CONTACT.phone}</a></dd></div>
                <div><dt>Netfang</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
                {DEPTS.map((d) => <div key={d.key}><dt>{d.name}</dt><dd>{openState(d, now).text}</dd></div>)}
              </dl>
              <a className="tlink" href={CONTACT.map} target="_blank" rel="noopener">Opna í Google Maps <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="people">
            {groups.map(([k, label]) => (
              <div key={k}>
                <h3>{label}</h3>
                {STAFF.filter((p) => p.dept === k).map((p) => (
                  <div key={p.email} className="person">
                    <b>{p.name}</b>
                    <span>{p.role}</span>
                    <a href={`mailto:${p.email}`}><Mail size={14} aria-hidden="true" />{p.email}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function InboxPage() {
  const [mine, setMine] = useState<Request[]>(() => loadRequests())
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({})
  const all = [...mine, ...SAMPLE_REQUESTS]
  const KIND: Record<Request['kind'], string> = { reynsluakstur: 'Reynsluakstur', verkstaedi: 'Verkstæði', floti: 'Floti', fyrirspurn: 'Fyrirspurn' }
  const fmt = (iso: string) => { const d = new Date(iso); return `${d.getUTCDate()}.${d.getUTCMonth() + 1}. kl. ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}` }
  return (
    <div className="vt-page vt-inbox">
      <div className="wrap">
        <div className="ibar" role="status"><span><b>Afgreiðsla, Skeifan 17</b> · innhólf söludeildar og verkstæðis</span><span className="num">{all.filter((r) => r.status === 'ný' && !confirmed[r.id]).length} nýjar beiðnir</span></div>
        <Intro title={['Beiðnir dagsins']} lede="Hver beiðni af vefnum lendir hér með númeri, tíma og tengilið. Starfsmaður staðfestir og hringir." />
        <table>
          <thead><tr><th>Númer</th><th>Tegund</th><th>Beiðni</th><th>Hvenær</th><th>Hver</th><th>Barst</th><th>Staða</th><th>Aðgerð</th></tr></thead>
          <tbody>
            {all.map((r) => {
              const ok = r.status === 'staðfest' || confirmed[r.id]
              return (
                <tr key={r.id}>
                  <td className="num">{r.id}</td>
                  <td><span className="kind">{KIND[r.kind]}</span></td>
                  <td>{r.title}{r.detail && <><br /><small style={{ color: 'var(--mute)' }}>{r.detail}</small></>}</td>
                  <td>{r.when}</td>
                  <td>{r.who}<br /><small style={{ color: 'var(--mute)' }}>{r.contact}</small></td>
                  <td className="num">{fmt(r.at)}</td>
                  <td><span className={`st${ok ? '' : ' new'}`}><i aria-hidden="true" />{ok ? 'Staðfest' : 'Ný'}</span></td>
                  <td><div className="ia">{!ok && <button type="button" onClick={() => setConfirmed((c) => ({ ...c, [r.id]: true }))}>Staðfesta</button>}<a href={/@/.test(r.contact) ? `mailto:${r.contact.split(', ').pop()}` : `tel:${r.contact.replace(/\s/g, '')}`} className="btn btn-line" style={{ minHeight: 36, padding: '0 12px', fontSize: 13.5 }}>{/@/.test(r.contact) ? 'Svara' : 'Hringja'}</a></div></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="inote">Frumgerð af starfsmannahlið. Beiðnir merktar V-S eru sýnishorn; hinar eru þær sem þú sendir sjálf(ur) á þessum vef í þessum vafra. Í raunverulegu kerfi fer hver beiðni í tölvupóst á soludeild@ eða verkstaedi@ og í þetta innhólf með innskráningu. {mine.length > 0 && <button type="button" style={{ textDecoration: 'underline' }} onClick={() => { try { sessionStorage.removeItem('vt-requests') } catch { /* */ } setMine([]) }}>Hreinsa mínar beiðnir</button>}</p>
      </div>
    </div>
  )
}

function PrivacyPage() {
  return (
    <div className="vt-page">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <Intro eyebrow="Persónuvernd" title={['Hvað við geymum,', 'og hve lengi.']} />
        <div style={{ display: 'grid', gap: 18, fontSize: 17 }} data-lines="">
          <p>Vatt ehf., kt. {CONTACT.kt}, Skeifunni 17, er ábyrgðaraðili. Formin á þessum vef safna aðeins því sem þarf til að bóka tíma eða svara fyrirspurn: nafni, símanúmeri eða netfangi, bílnúmeri þegar um verkstæði er að ræða, og því sem þú skrifar sjálf(ur).</p>
          <p>Upplýsingarnar eru notaðar til að afgreiða beiðnina og ekki í annað. Beiðnum um reynsluakstur og verkstæðistíma er eytt þegar tímanum lýkur; fyrirspurnum þegar þeim hefur verið svarað. Þær eru ekki seldar eða sendar þriðja aðila nema lánveitanda sem þú velur sjálf(ur) við fjármögnun.</p>
          <p>Þú getur beðið um afrit af gögnum um þig eða látið eyða þeim með því að skrifa á {CONTACT.email}.</p>
          <p style={{ color: 'var(--mute)', fontSize: 14 }}>Frumgerð: þessi texti er tillaga sem Vatt þarf að yfirfara. Í frumgerðinni er ekkert sent; formin geyma beiðnir aðeins í þínum vafra.</p>
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="vt-page"><div className="wrap"><Intro title={['Síðan fannst ekki.']} lede="Hlekkurinn er úreltur eða skakkt skrifaður." /><Btn to="" label="Á forsíðu" tone="dark" /></div></div>
  )
}

/* ── the shell ──────────────────────────────────────────────────────────── */

const TITLES: Record<string, [string, string]> = {
  '': ['Vatt | BYD, Maxus og þrjú ný merki í janúar 2027', 'Vatt ehf. í Skeifunni 17 er umboð BYD og Maxus á Íslandi og tekur á móti OMODA, EXLANTIX og JAECOO í janúar 2027. Verð, reynsluakstur, verkstæði og fjármögnun á einum stað.'],
  bilar: ['Bílar | Vatt', 'Allir BYD og Maxus bílar hjá Vatt með verðum af verðlistum framleiðendanna. Síaðu eftir merki, gerð, drifi og afli.'],
  reynsluakstur: ['Bóka reynsluakstur | Vatt', 'Veldu bíl, dag og tíma. Söludeild Vatt í Skeifunni 17 staðfestir símleiðis.'],
  verkstaedi: ['Panta tíma á verkstæði | Vatt', 'Verkstæði Vatt í Skeifunni 17 fyrir BYD, Maxus og Aiways. Veldu verk, dag og tíma.'],
  fyrirtaeki: ['Fyrirtæki og flotar | Vatt', 'Maxus e-Deliver 5, e-Deliver 7 og eTerron 9 fyrir rekstraraðila, verð án vsk. og tilboðsbeiðni.'],
  fjarmognun: ['Fjármögnun | Vatt', 'Bílalán og kaupleiga hjá Ergo, Arion banka, Landsbankanum og Lykli. Nýr bíll allt að 90 % í 7 ár.'],
  thjonusta: ['Þjónusta | Vatt', 'Verkstæði og varahlutir í Skeifunni 17, samstarfsverkstæði á Akureyri og í Reykjanesbæ, vegaaðstoð og skil á rafhlöðum.'],
  'hafa-samband': ['Hafa samband | Vatt', 'Sími 568 5100, netföng starfsfólks og fyrirspurnaform. Skeifan 17, 108 Reykjavík.'],
  afgreidsla: ['Afgreiðsla | Vatt', 'Starfsmannahlið: beiðnir af vefnum.'],
  personuvernd: ['Persónuvernd | Vatt', 'Hvaða upplýsingum vefur Vatt safnar og hvernig þær eru notaðar.'],
}

export default function VattPage() {
  const root = useRef<HTMLDivElement>(null)
  const loc = useLocation()
  const sub = loc.pathname.replace(/^.*?\/preview\/vatt\/?/, '').replace(/\/+$/, '')
  const [menu, setMenu] = useState(false)
  const [focusKey, setFocusKey] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())
  const chat = useRef<ChatEl | null>(null)
  const page = sub.split('/')[0]
  const isHome = sub === ''
  const formPage = useRef(false)
  formPage.current = ['reynsluakstur', 'verkstaedi', 'fyrirtaeki', 'hafa-samband', 'afgreidsla'].includes(page)

  /* head: title, description, lang, noindex, theme colour, structured data */
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    const [t, d] = TITLES[page] ?? TITLES['']
    const car = sub.startsWith('bilar/') ? modelBySlug(sub.split('/')[1]) : undefined
    document.title = car ? `${fullName(car)} | Vatt` : t
    document.documentElement.lang = 'is'
    setThemeColor(SLATE)
    const a = setMetaDescription(sub.startsWith('bilar/') ? `${document.title.replace(' | Vatt', '')} hjá Vatt: verð, drægni, afl og ábyrgð, og reynsluakstur í Skeifunni 17.` : d)
    const b = setNoindex(true)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => { document.title = prevTitle; document.documentElement.lang = prevLang; a(); b(); ld.remove() }
  }, [sub, page])

  useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 60_000); return () => window.clearInterval(t) }, [])

  /* the assistant: our widget, answering only from this page (chat.ts) */
  useEffect(() => {
    let el: ChatEl | null = null
    let alive = true
    import('./vendor/sndr-chat.js').then(() => {
      if (!alive || !root.current) return
      el = document.createElement('sndr-chat') as ChatEl
      el.setAttribute('name', 'Vatt')
      el.setAttribute('phone', CONTACT.phone)
      el.setAttribute('lang', 'is')
      el.setAttribute('label', 'Spurðu okkur')
      el.setAttribute('greeting', GREETING)
      el.setAttribute('chips', JSON.stringify(CHIPS))
      el.answerer = answer
      root.current.appendChild(el)
      chat.current = el
    }).catch(() => { /* the page works without it; the phone is everywhere */ })
    return () => { alive = false; el?.remove(); chat.current = null }
  }, [])
  const openChat = () => { setMenu(false); chat.current?.open?.() }

  /* route change: top of page, menu closed */
  useEffect(() => {
    setMenu(false)
    if (loc.hash) { window.setTimeout(() => goTo(decodeURIComponent(loc.hash.slice(1))), 80); return }
    if (pageLenis) pageLenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0)
  }, [loc.pathname, loc.hash])

  /* chrome: hide on the way down, show on the way up, colour at the section edge */
  const chromeRef = useRef<HTMLDivElement>(null)
  const topPlate = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const chrome = chromeRef.current!
    let lastY = window.scrollY
    let raf = 0
    const tick = () => {
      raf = 0
      const y = window.scrollY
      chrome.style.setProperty('--bar', `${-Math.min(y, 36)}px`)
      chrome.dataset.solid = y > 40 ? '1' : '0'
      /* the sticky bar is for browsing pages; a form page already has its action on screen */
      if (root.current) root.current.dataset.sticky = !formPage.current && y > window.innerHeight * 0.6 ? '1' : '0'
      if (!document.documentElement.classList.contains('vt-menu')) {
        if (y > 320 && y > lastY + 4) chrome.dataset.hide = '1'
        else if (y < lastY - 4 || y <= 320) chrome.dataset.hide = '0'
      }
      lastY = y
      const plate = topPlate.current
      if (!plate) return
      const band = plate.getBoundingClientRect()
      let a = Infinity, b = -Infinity
      root.current?.querySelectorAll<HTMLElement>('[data-tone="dark"]').forEach((d) => {
        const r = d.getBoundingClientRect()
        const t = Math.max(r.top, band.top), bt = Math.min(r.bottom, band.bottom)
        if (bt > t && r.width > window.innerWidth * 0.6) { a = Math.min(a, t - band.top); b = Math.max(b, bt - band.top) }
      })
      plate.style.clipPath = a === Infinity ? 'inset(0 0 100% 0)' : `inset(${a.toFixed(1)}px 0 ${(band.height - b).toFixed(1)}px 0)`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    const iv = window.setInterval(on, 250)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); window.clearInterval(iv); cancelAnimationFrame(raf) }
  }, [])

  /* menu */
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('vt-menu', menu)
    if (!menu) return
    pageLenis?.stop()
    const opener = document.activeElement as HTMLElement | null
    const bg = root.current ? [...root.current.children].filter((c) => !c.classList.contains('vt-menu-panel') && c.tagName !== 'STYLE') as HTMLElement[] : []
    bg.forEach((c) => c.setAttribute('inert', ''))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    document.addEventListener('keydown', onKey)
    const panel = menuRef.current
    panel?.querySelector<HTMLElement>('a,button')?.focus()
    if (panel && !still()) {
      gsap.fromTo(panel, { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: 'vt' })
      gsap.fromTo(panel.querySelectorAll('[data-mi]'), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.07, delay: 0.3, ease: 'vt' })
    }
    return () => { document.removeEventListener('keydown', onKey); pageLenis?.start(); html.classList.remove('vt-menu'); bg.forEach((c) => c.removeAttribute('inert')); opener?.focus?.() }
  }, [menu])

  /* Lenis, once */
  useLayoutEffect(() => {
    const reduce = still()
    let lenis: Lenis | null = null
    const onTick = (t: number) => lenis?.raf(t * 1000)
    if (!reduce && window.matchMedia('(pointer: fine)').matches) {
      /* the touch guard sits on the constructor line so tools/mobile-gate.mjs can see it */
      lenis = isTouch() ? null : new Lenis({ lerp: 0.125, anchors: true, smoothWheel: true })
      pageLenis = lenis
      lenis?.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(onTick)
      gsap.ticker.lagSmoothing(0)
    }
    return () => { gsap.ticker.remove(onTick); lenis?.destroy(); pageLenis = null }
  }, [])

  /* motion per route: the staged opening, then the position-tied reveals */
  useLayoutEffect(() => {
    const el = root.current!
    const main = el.querySelector<HTMLElement>('main')!
    const reduce = still()
    let ctx: gsap.Context | null = null
    let alive = true
    const splits: SplitText[] = []
    const build = () => { if (!alive) return; ctx = gsap.context(() => {
      if (reduce) return
      const desk = window.matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)').matches
      const isHomeRoute = !!main.querySelector('.vt-hero')
      const touch = isTouch()
      const travel = touch ? 12 : 22

      /* the opening (Suðurverk/CargoKite): header, eyebrow, masked lines, masked photo, body, button */
      const open = gsap.timeline({ defaults: { ease: 'power3.out' } })
      const intro = main.querySelector<HTMLElement>('.vt-hero, .intro, .dhead') ?? main
      const lines = intro.querySelectorAll('[data-line]')
      const opens = intro.querySelectorAll('[data-open]:not(.eyebrow)')
      const photo = intro.querySelector('[data-hmask] img')
      open.from(intro.querySelectorAll('.eyebrow'), { y: travel, opacity: 0, duration: 0.45 }, 0.12)
      if (lines.length) open.from(lines, { yPercent: 110, duration: 0.72, stagger: 0.08 }, 0.22)
      if (photo) open.from(photo, { yPercent: 12, opacity: 0, duration: 0.85 }, 0.18)
      if (opens.length) open.from(opens, { y: travel, opacity: 0, duration: 0.55, stagger: 0.08 }, 0.42)
      const finish = (e: KeyboardEvent) => { if (e.key === 'Tab') open.progress(1) }
      document.addEventListener('keydown', finish)

      /* titles: masked characters, .8s, .018, by position (Spyker) */
      main.querySelectorAll<HTMLElement>('[data-chars]').forEach((t) => {
        splits.push(new SplitText(t, { type: 'chars,words', charsClass: 'ch', wordsClass: 'wd', mask: 'chars', autoSplit: true,
          onSplit: (self) => gsap.fromTo(self.chars, { yPercent: 100 }, { yPercent: 0, ease: 'vt', duration: 0.8, stagger: 0.018, scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 86%', scrub: true } }) }))
      })
      main.querySelectorAll<HTMLElement>('[data-lines]').forEach((t) => {
        if (intro.contains(t)) return
        splits.push(new SplitText(t, { type: 'lines', linesClass: 'ln', autoSplit: true,
          onSplit: (self) => gsap.fromTo(self.lines, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, ease: 'vt', duration: 0.8, stagger: 0.05, scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 84%', scrub: true } }) }))
      })
      main.querySelectorAll<HTMLElement>('[data-fade]').forEach((t) => {
        if (intro.contains(t)) return
        gsap.fromTo(t, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, ease: 'none', scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 84%', scrub: true } })
      })
      main.querySelectorAll<HTMLElement>('[data-media]').forEach((f) => {
        if (intro.contains(f)) return
        const img = f.querySelector('img')
        const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 100%', end: 'top 70%', scrub: true } })
        tl.fromTo(f, { clipPath: 'inset(20% 20% 20% 20%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'vt', duration: 0.9 }, 0)
        if (img) tl.fromTo(img, { scale: 1.1 }, { scale: 1, ease: 'vt', duration: 0.9 }, 0)
      })
      main.querySelectorAll<HTMLElement>('[data-par]').forEach((p) => {
        gsap.fromTo(p, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: p.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      main.querySelectorAll<HTMLElement>('[data-items]').forEach((g) => {
        gsap.fromTo(g.children, { scale: 0.92, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: 'vt', duration: 0.8, stagger: 0.06, scrollTrigger: { trigger: g, start: 'top 100%', end: 'top 80%', scrub: true } })
      })
      /* buttons open from the middle on the home page only: on a form page a CTA that sits low in
         the viewport would wait, half clipped, for a scroll that may never come */
      if (isHomeRoute) main.querySelectorAll<HTMLElement>('[data-btn]').forEach((b) => {
        if (intro.contains(b)) return
        gsap.fromTo(b, { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', ease: 'vt', scrollTrigger: { trigger: b, start: 'top 99%', end: 'top 84%', scrub: true } })
      })

      /* a keyboard user never lands on a hidden reveal */
      const revealFocused = (e: FocusEvent) => {
        const t = e.target as HTMLElement
        gsap.getTweensOf(t.querySelectorAll('*')).forEach((tw) => tw.progress(1))
        ScrollTrigger.getAll().forEach((st) => { const tr = st.trigger as HTMLElement | null; if (tr && (tr === t || tr.contains(t) || t.contains(tr))) st.animation?.progress(1) })
      }
      main.addEventListener('focusin', revealFocused)

      /* home only: hero parallax (desktop), the pinned launch chapter (desktop), the statement clip */
      const hero = main.querySelector<HTMLElement>('.vt-hero')
      if (hero && desk) {
        gsap.to(hero.querySelector('[data-hcopy]'), { yPercent: -18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '+=700', scrub: true } })
        gsap.to(hero.querySelector('[data-hphoto]'), { yPercent: 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '+=700', scrub: true } })
      }
      /* the launch chapter: scrolling lifts the veil off the three plates, one after another (CargoKite's
         scrubbed shift device, re-aimed at Vatt's own banner line "lyfta hulunni"). Desktop pins the stage
         for the reveal; phones tie each veil to its own position. */
      const launch = main.querySelector<HTMLElement>('.vt-launch')
      if (launch) {
        const veils = [...launch.querySelectorAll<HTMLElement>('[data-veil]')]
        const marks = [...launch.querySelectorAll<HTMLElement>('[data-mark]')]
        const counter = launch.querySelector<HTMLElement>('[data-count]')
        const count = { n: 0 }
        const setCount = () => { if (counter) counter.textContent = String(Math.round(count.n)) }
        if (desk) {
          const tl = gsap.timeline({ scrollTrigger: { trigger: launch, start: 'top top', end: '+=900', pin: launch.querySelector('[data-stage]') as HTMLElement, scrub: 0.6, anticipatePin: 1 } })
          tl.fromTo(launch.querySelector('[data-prog]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0)
          veils.forEach((v, i) => {
            tl.fromTo(v, { yPercent: 0 }, { yPercent: -112, ease: 'power2.inOut', duration: 0.26 }, 0.06 + i * 0.3)
              .fromTo(marks[i], { autoAlpha: 0.25, scale: 0.94 }, { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.26 }, 0.08 + i * 0.3)
              .to(count, { n: i + 1, duration: 0.05, onUpdate: setCount }, 0.2 + i * 0.3)
          })
        } else {
          veils.forEach((v, i) => {
            const plate = v.parentElement!
            const tl = gsap.timeline({ scrollTrigger: { trigger: plate, start: 'top 88%', end: 'top 45%', scrub: true } })
            tl.fromTo(v, { yPercent: 0 }, { yPercent: -112, ease: 'power2.inOut' }, 0)
              .fromTo(marks[i], { autoAlpha: 0.25, scale: 0.94 }, { autoAlpha: 1, scale: 1 }, 0)
              .to(count, { n: i + 1, duration: 0.01, onUpdate: setCount }, 0.6)
          })
          gsap.fromTo(launch.querySelector('[data-prog]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: launch.querySelector('.lplates'), start: 'top 88%', end: 'bottom 45%', scrub: true } })
        }
      }
      const band = main.querySelector<HTMLElement>('.vt-statement')
      if (band) {
        const mInset = 10
        const st = { inset: mInset }
        const set = () => { band.style.clipPath = `inset(${st.inset}% round ${st.inset > 0.5 ? 8 : 0}px)` }
        set()
        const q = gsap.quickTo(st, 'inset', { duration: 0.15, ease: 'none', onUpdate: set })
        ScrollTrigger.create({
          trigger: band, start: 'top bottom', end: 'bottom top',
          onUpdate: (s) => {
            const y = s.scroll(), h = band.offsetHeight
            const a = s.start + 0.4 * window.innerHeight, b = s.end - 0.6 * h
            const v = y <= a ? gsap.utils.mapRange(s.start, a, mInset, 0, y) : y >= b ? gsap.utils.mapRange(b, s.end, 0, mInset, y) : 0
            q(gsap.utils.clamp(0, mInset, v))
          },
        })
      }
      return () => { document.removeEventListener('keydown', finish); main.removeEventListener('focusin', revealFocused) }
    }, el); ScrollTrigger.refresh() }
    /* the real family must be measured, not the fallback: ask for the three weights, then build */
    if (!document.fonts) build()
    else Promise.all(['400', '500', '600'].map((w) => document.fonts.load(`${w} 16px VtF`))).then(() => document.fonts.ready).then(build, build)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => { alive = false; window.removeEventListener('load', refresh); ctx?.revert(); splits.forEach((s) => s.revert()) }
  }, [loc.pathname])

  const sala = openState(DEPTS[0], now)
  let body: ReactNode
  if (isHome) body = <Home />
  else if (page === 'bilar') body = sub.includes('/') ? <DetailPage slug={sub.split('/')[1]} /> : <CarsPage />
  else if (page === 'reynsluakstur') body = <TestDrivePage />
  else if (page === 'verkstaedi') body = <WorkshopPage />
  else if (page === 'fyrirtaeki') body = <FleetPage />
  else if (page === 'fjarmognun') body = <><FinanceBand full /><DriveBand /></>
  else if (page === 'thjonusta') body = <ServiceBand full />
  else if (page === 'hafa-samband') body = <ContactPage />
  else if (page === 'afgreidsla') body = <InboxPage />
  else if (page === 'personuvernd') body = <PrivacyPage />
  else body = <NotFound />
  const bandPage = page === 'fjarmognun' || page === 'thjonusta'

  return (
    <div ref={root} className={`vt${menu ? ' menu-open' : ''}`} id="efst" lang="is">
      <style>{CSS}</style>
      <PreviewChrome company={company} />
      <a className="skip" href="#efni">Fara í efni</a>

      <div className="vt-chrome" ref={chromeRef} data-hide="0" data-solid="0">
        <div className="bar">
          <div className="in">
            <a href={`tel:${CONTACT.tel}`}><Phone size={13} aria-hidden="true" />{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.sales}`} className="hide-s"><Mail size={13} aria-hidden="true" />{CONTACT.sales}</a>
            <a href={CONTACT.map} target="_blank" rel="noopener" className="hide-s"><MapPin size={13} aria-hidden="true" />{CONTACT.street}, {CONTACT.town}</a>
            <span className={`st${sala.open ? ' on' : ''}`}><i aria-hidden="true" />Söludeild: {sala.text.toLowerCase()}</span>
          </div>
        </div>
        <header className="hdr">
          <div className="plate base"><HeaderRow layer="base" focusKey={focusKey} onFocusKey={setFocusKey} onMenu={() => setMenu(true)} sub={sub} /></div>
          <div className="plate top" ref={topPlate} aria-hidden="true"><HeaderRow layer="top" focusKey={focusKey} onFocusKey={setFocusKey} onMenu={() => setMenu(true)} sub={sub} /></div>
        </header>
      </div>

      {menu && (
        <div className="vt-menu-panel" ref={menuRef} role="dialog" aria-modal="true" aria-label="Valmynd" data-lenis-prevent="">
          <div className="mtop">
            <img src={A('vatt-logo-white.png')} alt="Vatt" width={1710} height={458} />
            <button type="button" className="mx" onClick={() => setMenu(false)} aria-label="Loka valmynd"><X size={24} strokeWidth={1.6} aria-hidden="true" /></button>
          </div>
          <nav aria-label="Valmynd">
            {[{ k: '', label: 'Forsíða' }, ...NAV, { k: 'reynsluakstur', label: 'Reynsluakstur' }, { k: 'verkstaedi', label: 'Verkstæðistími' }].map((n) => (
              <Link key={n.k} to={to(n.k)} data-mi="" aria-current={page === n.k ? 'page' : undefined} onClick={() => setMenu(false)}>{n.label}</Link>
            ))}
          </nav>
          <div className="mfoot" data-mi="">
            <a href={`tel:${CONTACT.tel}`}><Phone size={18} aria-hidden="true" />{CONTACT.phone}</a>
            <button type="button" onClick={openChat}><MessageCircle size={16} aria-hidden="true" />Spyrja aðstoðarmanninn</button>
            <p>Söludeild: mánudaga til fimmtudaga kl. 8:30–17, föstudaga til 16, laugardaga 13–16</p>
          </div>
        </div>
      )}

      <main id="efni" key={loc.pathname} style={bandPage ? { paddingTop: 'calc(72px + 36px + env(safe-area-inset-top))' } : undefined}>
        {body}
      </main>

      <footer className="vt-foot on-dark" data-tone="dark">
        <div className="wrap fgrid">
          <div className="fbrand">
            <img src={A('vatt-logo-white.png')} alt="Vatt ehf." width={1710} height={458} />
            <p>Umboð BYD og Maxus á Íslandi. OMODA, EXLANTIX og JAECOO frá janúar 2027. Þjónusta og varahlutir fyrir Aiways.</p>
          </div>
          <nav className="fnav" aria-label="Neðst á síðu">
            {[...NAV, { k: 'reynsluakstur', label: 'Reynsluakstur' }].map((n) => <Link key={n.k} to={to(n.k)}>{n.label}</Link>)}
          </nav>
          <div className="fside">
            <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={CONTACT.map} target="_blank" rel="noopener">{CONTACT.street}, {CONTACT.town}</a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener">Facebook</a>
            <p className="brands">Söludeild: mán.–fim. 8:30–17, fös. 8:30–16, lau. 13–16. Verkstæði: mán.–fim. 8–17, fös. 8–16.</p>
          </div>
        </div>
        <div className="wrap flegal">
          <p>{CONTACT.legal} · Kt. {CONTACT.kt} · <Link to={to('personuvernd')}>Persónuvernd</Link> · <Link to={to('afgreidsla')}>Afgreiðsla</Link></p>
          <SndrBadge />
        </div>
        <p className="wrap proto">Frumgerð: hugmynd að nýjum vef, ekki vefur Vatt. Upplýsingar eru af vatt.is, byd.is og maxus.is og verðlistum þeirra, sótt 8. október 2026. Verð geta breyst án fyrirvara. Myndir eru framleiðendamyndir frá BYD og Maxus. Formin senda ekkert; beiðnir eru geymdar í þínum vafra. Aðstoðarmaðurinn svarar aðeins út frá því sem stendur á þessum vef.</p>
      </footer>

      <div className="vt-sticky" aria-label="Flýtileiðir">
        <a href={`tel:${CONTACT.tel}`}><Phone size={16} aria-hidden="true" />Hringja</a>
        <Link to={to('reynsluakstur')}>Reynsluakstur</Link>
        <button type="button" onClick={openChat}><MessageCircle size={16} aria-hidden="true" />Spyrja</button>
      </div>
    </div>
  )
}
