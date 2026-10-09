import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronDown, Mail, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { SndrBadge } from '../SndrBadge'
import { setMetaDescription, setNoindex, setThemeColor } from '../../lib/preview'
import {
  A, BRANCHES, BRANDS, CATS, CONTACT, DEPTS, FIELDS, IMG, JSON_LD, KIND_LABEL, KUHN_OFFER, LIVELINK, MACHINES, NEWS, PARTS, ROUTE, SAMPLE_REQUESTS, STAFF, STOCK_NOTE, VAT, WARRANTY,
  branch, brandByKey, kr, loadRequests, machineById, machineName, openState, routeTo, saveRequest, staffPhoto, telOf,
  type BranchKey, type Brand, type Dept, type Field, type Kind, type Machine, type Photo, type Request,
} from './data'
import { ICELAND } from './geo'
import { answer, CHIPS, GREETING } from './chat'
import { CSS, GRAPHITE } from './styles'

/*
 * Vélfang — "Verkin tala". DESIGN.md beside this file.
 *
 * Base: the Vatt system (src/preview/vatt), re-aimed. Kept: the page shell,
 * the contact bar, the staged opening (header, masked lines .72s/.08, photo,
 * body, button), masked character titles by position, buttons opening from the
 * middle, the catalogue with URL filters and an empty state, the request forms
 * with a staff-side inbox, the page-only <sndr-chat>. Changed: everything is
 * square; Archivo Narrow capitals; Vélfang red and field green; every frame
 * opens like the peak in the Vélfang mark (a small peak at the bottom centre
 * rises into the full rectangle); the pinned chapter builds the three-branch
 * service map on real OpenStreetMap geometry instead of lifting a veil.
 *
 * Routes live under /preview/velfang/*; this component reads the sub-path.
 */

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('vf', 'M0,0 C0.625,0.05 0,1 1,1')

const company = getPreviewCompany('velfang')
let pageLenis: Lenis | null = null
const isTouch = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches
const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const to = (p = '') => (p ? `${ROUTE}/${p}` : ROUTE)
const BRN: Record<BranchKey, string> = { rvk: 'Reykjavík', ak: 'Akureyri', sel: 'Selfoss' }
const BRN_AT: Record<BranchKey, string> = { rvk: 'í Reykjavík', ak: 'á Akureyri', sel: 'á Selfossi' }
const mailHref = (e: string) => `mailto:${e.toLowerCase()}`

/* the peak: Vélfang's white triangle, as a clip that rises into the full frame */
const PEAK_SMALL = 'polygon(40% 100%, 40% 100%, 50% 78%, 60% 100%, 60% 100%)'
const PEAK_WIDE = 'polygon(14% 100%, 14% 100%, 50% 52%, 86% 100%, 86% 100%)'
const PEAK_FULL = 'polygon(0% 100%, 0% 0%, 50% 0%, 100% 0%, 100% 100%)'

function goTo(id: string) {
  const t = document.getElementById(id)
  if (!t) return
  if (pageLenis) pageLenis.scrollTo(t, { offset: -96 })
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

type Tone = 'red' | 'ink' | 'white' | 'line' | 'ghost'
function Btn({ to: path, href, label, tone = 'red', icon, onClick, ext, type, className = '' }: {
  to?: string; href?: string; label: string; tone?: Tone; icon?: ReactNode; onClick?: () => void; ext?: boolean; type?: 'submit' | 'button'; className?: string
}) {
  const inner = (
    <>
      <span className="sr">{label}</span>
      <span className="lbl" aria-hidden="true">
        {[...label].map((c, i) => <span key={i} className="c" style={{ '--i': i } as CSSProperties}>{c === ' ' ? ' ' : c}</span>)}
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

function Lines({ lines }: { lines: ReactNode[] }) {
  return <>{lines.map((l, i) => <span key={i} className="lm"><span data-line="">{l}</span></span>)}</>
}

/* ── navigation: three groups with dropdowns ────────────────────────────── */

type NavItem = { k: string; label: string; sub: string }
const NAV: { key: string; label: string; items: NavItem[] }[] = [
  { key: 'velar', label: 'Vélar', items: [
    { k: 'velar', label: 'Vélar á lager', sub: 'Nýjar og notaðar, með verði og síum' },
    { k: 'umbod', label: 'Umboðin 21', sub: 'Landbúnaður, vinnuvélar, sveitarfélög' },
    { k: 'tilbod', label: 'Fá tilboð', sub: 'Fyrir bú, verktaka og sveitarfélög' },
    { k: 'selja', label: 'Selja eða leita', sub: 'Skrá vél til sölu eða á óskalista' },
  ] },
  { key: 'thjonusta', label: 'Þjónusta', items: [
    { k: 'verkstaedi', label: 'Bóka verkstæði', sub: 'Reykjavík, Akureyri og Selfoss' },
    { k: 'varahlutir', label: 'Varahlutir', sub: 'Beiðni með fastnúmeri eða raðnúmeri' },
    { k: 'livelink', label: 'JCB LiveLink', sub: 'Fylgstu með vélinni úr fjarlægð' },
    { k: 'abyrgd', label: 'Ábyrgðarskilmálar', sub: 'Eitt ár, nema annað sé tekið fram' },
  ] },
  { key: 'fyrirtaekid', label: 'Fyrirtækið', items: [
    { k: 'utibu', label: 'Útibú og kort', sub: 'Gylfaflöt, Óseyri og Gagnheiði' },
    { k: 'starfsfolk', label: 'Starfsfólk', sub: '28 manns, bein númer og netföng' },
    { k: `frettir/${NEWS[0].slug}`, label: 'Fréttir', sub: NEWS[0].title },
  ] },
]

function Header({ sub, onMenu }: { sub: string; onMenu: () => void }) {
  const [open, setOpen] = useState<string | null>(null)
  const loc = useLocation()
  const ref = useRef<HTMLDivElement>(null)
  const fine = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches, [])
  useEffect(() => { setOpen(null) }, [loc.pathname])
  useEffect(() => {
    if (!open) return
    const onDoc = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(null) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); (ref.current?.querySelector(`[data-dd="${open}"] > button`) as HTMLElement | null)?.focus() } }
    document.addEventListener('pointerdown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])
  const page = sub.split('/')[0]
  return (
    <div className="row" ref={ref}>
      <Link className="logo" to={to()} aria-label="Vélfang, forsíða">
        <img src={A('velfang-logo.svg')} alt="" width={275} height={50} />
      </Link>
      <nav className="links" aria-label="Aðalvalmynd">
        {NAV.map((g) => (
          <div key={g.key} className="dd" data-dd={g.key} data-open={open === g.key ? '1' : '0'}
            onPointerEnter={() => { if (fine) setOpen(g.key) }} onPointerLeave={() => { if (fine) setOpen(null) }}>
            <button type="button" aria-expanded={open === g.key} aria-controls={`dd-${g.key}`} aria-current={g.items.some((i) => i.k.split('/')[0] === page) ? 'true' : undefined}
              onClick={() => setOpen(open === g.key ? null : g.key)}>
              {g.label}<ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            </button>
            <div className="panel" id={`dd-${g.key}`}>
              {g.items.map((i) => (
                <Link key={i.k} to={to(i.k)} tabIndex={open === g.key ? 0 : -1} aria-current={i.k === sub ? 'page' : undefined}><b>{i.label}</b><span>{i.sub}</span></Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="acts">
        <Link className="cta" to={to('verkstaedi')}>Bóka verkstæði</Link>
        <button className="burger" type="button" onClick={onMenu} aria-label="Opna valmynd">
          <Menu size={24} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

type ChatEl = HTMLElement & { answerer?: typeof answer; open?: () => void }

/* ── home sections ──────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="vf-hero" aria-labelledby="h-hero">
      <div className="wrap htop">
        <h1 id="h-hero"><Lines lines={['Vélar fyrir', <>bændur og <em>verktaka.</em></>]} /></h1>
        <div className="hside">
          <p className="lede" data-open="">Umboð fyrir JCB, Fendt, CLAAS, Kuhn og 17 önnur merki. Sala, varahlutir og verkstæði í Reykjavík, á Akureyri og Selfossi.</p>
          <div className="ctas" data-open="">
            <Btn to="velar" label="Vélar á lager" tone="red" />
            <Btn to="verkstaedi" label="Bóka verkstæði" tone="line" />
          </div>
        </div>
      </div>
      <figure className="hfig">
        <div className="hmask" data-hmask=""><div className="hp" data-hp=""><Pic p={IMG.hero} sizes="100vw" eager /></div></div>
        <figcaption data-open="">Gylfaflöt 32 í Grafarvogi, höfuðstöðvar Vélfangs síðan 2006.</figcaption>
      </figure>
    </section>
  )
}

function MachineCard({ x, vat }: { x: Machine; vat?: boolean }) {
  const p = vat ? Math.round(x.price * (1 + VAT)) : x.price
  return (
    <Link className="mc" to={to(`velar/${x.id}`)}>
      <div className="ph"><Pic p={x.img} sizes="(min-width: 1100px) 30vw, (min-width: 640px) 46vw, 90vw" /><span className={`tag${x.cond === 'ny' ? ' ny' : ''}`}>{x.cond === 'ny' ? 'Nýtt' : 'Notað'}</span></div>
      <p className="br">{x.brand} · {x.cat}</p>
      <h3 className="nm" translate="no">{x.model}</h3>
      <p className="mt num">{x.year && <span>{x.year}</span>}{x.hours !== undefined && <span>{x.hours.toLocaleString('de-DE')} {x.unit}</span>}<span>{BRN[x.region]}</span></p>
      <p className="pr num">{kr(p)}<small>{vat ? 'með vsk.' : 'án vsk.'}</small></p>
    </Link>
  )
}

const RAIL = ['274097', '367541', '422839', '992887', '845629', '938781']
function StockRail() {
  return (
    <section className="vf-rail" id="lager" aria-labelledby="h-rail">
      <div className="wrap">
        <div className="shead">
          <div>
            <h2 id="h-rail" data-chars="">Á lager núna</h2>
            <p data-fade="">Verð, árgerð, notkun og hvar vélin stendur, beint af söluskrá Vélfangs. Ekki lengur á öðrum vef.</p>
          </div>
          <Link className="tlink" to={to('velar')}>Allar vélar og síur <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <ul className="track" role="list" data-items="">
          {RAIL.map((id) => <li key={id}><MachineCard x={machineById(id)!} /></li>)}
        </ul>
      </div>
    </section>
  )
}

const stockOf = (k: string) => MACHINES.filter((m) => m.brandKey === k).length
function BrandIndex({ full = false }: { full?: boolean }) {
  const [f, setF] = useState<Field | 'all'>('all')
  const [more, setMore] = useState(full)
  const narrow = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 899px)').matches, [])
  const shown = BRANDS.filter((b) => f === 'all' || b.fields.includes(f))
  const cap = !more && narrow && f === 'all' ? 8 : Infinity
  useEffect(() => { const t = window.setTimeout(() => ScrollTrigger.refresh(), 120); return () => window.clearTimeout(t) }, [f, more])
  const fl = FIELDS.find((x) => x.key === f)
  return (
    <section className="vf-index" id="umbodin" aria-labelledby="h-ix">
      <div className="wrap">
        <div className="shead">
          <div>
            <h2 id="h-ix" data-chars="">21 umboð</h2>
            <p data-fade="">Raðað eins og Vélfang raðar sjálft: landbúnaður, vinnuvélar, sveitarfélög og golfvellir.</p>
          </div>
        </div>
        <div className="seg" role="group" aria-label="Sía umboð eftir grein">
          <button type="button" aria-pressed={f === 'all'} onClick={() => setF('all')}>Öll<small>21</small></button>
          {FIELDS.map((x) => <button key={x.key} type="button" aria-pressed={f === x.key} onClick={() => setF(x.key)}>{x.label}<small>{BRANDS.filter((b) => b.fields.includes(x.key)).length}</small></button>)}
        </div>
        <p className="fline" role="status">{fl ? fl.line : 'Smelltu á merki til að sjá hvað Vélfang segir um það og hvað er á lager.'}</p>
        <ul className="ix" role="list">
          {shown.map((b, i) => {
            const n = stockOf(b.key)
            return (
              <li key={b.key} hidden={i >= cap}>
                <Link to={to(`umbod/${b.key}`)}>
                  <span className="bn" translate="no">{b.name}</span>
                  <span className="bl">{b.line ?? b.site.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '')}{b.since ? `. Umboð síðan ${b.since}` : ''}</span>
                  <span className="bs">
                    {n > 0 && <span className="cnt"><b>{n}</b>á lager</span>}
                    <span className="lg" aria-hidden="true">{b.logo ? <img src={A(`logos/${b.logo}`)} alt="" loading="lazy" /> : <span style={{ fontFamily: 'VfD', fontWeight: 700, fontSize: 15, textTransform: 'uppercase' }}>{b.name}</span>}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        {cap < shown.length && <div className="more-b"><Btn label="Sýna öll 21 umboðin" tone="line" onClick={() => setMore(true)} /></div>}
      </div>
    </section>
  )
}

/* the map: real coastline, three branch markers shaped like the mark's peak */
function IcelandMap({ active, labels = true }: { active?: number; labels?: boolean }) {
  return (
    <div className="map">
      <svg viewBox={`0 0 ${ICELAND.w} ${ICELAND.h}`} role="img" aria-label="Kort af Íslandi með útibúum Vélfangs í Reykjavík, á Akureyri og Selfossi">
        <path className="land" d={ICELAND.d} />
        {BRANCHES.map((b, i) => (
          <g key={b.key} className={`pin${active !== undefined && i > active ? ' off' : ''}`} data-pin={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`}>
            <ellipse className="gnd" data-gnd="" cx="0" cy="2" rx="18" ry="5" />
            <g data-drop=""><path className="tri" d="M-15 0 L0 -30 L15 0 Z" /></g>
            {labels && <text x={b.key === 'sel' ? 20 : b.key === 'ak' ? 22 : -24} y={b.key === 'rvk' ? -38 : b.key === 'sel' ? 26 : -8} textAnchor={b.key === 'rvk' ? 'end' : 'start'}>{b.name}</text>}
          </g>
        ))}
      </svg>
    </div>
  )
}

function Network({ page = false }: { page?: boolean }) {
  return (
    <section className="vf-net" id="verkstaedin" aria-labelledby="h-net" data-net="">
      <div className="wrap">
        {!page && (
          <div className="shead">
            <div>
              <h2 id="h-net" data-chars="">Reykjavík, Akureyri, Selfoss</h2>
              <p data-fade="">Vélar sem stoppa sem styst. Verkstæðisbílar fara líka á staðinn og bilanagreina án flutnings.</p>
            </div>
          </div>
        )}
        <div className="ngrid">
          <div className="mapw">
            <IcelandMap />
            <p className="mcount num"><b data-staff="">28</b><span>starfsmenn á <span data-sites="">þremur stöðum</span></span></p>
            <div className="prog" aria-hidden="true"><span data-prog="" /></div>
            <p className="cap">Strandlína: OpenStreetMap (© OpenStreetMap contributors, ODbL). Staðsetningar eftir heimilisföngum.</p>
          </div>
          <div className="cards">
            {BRANCHES.map((b, i) => (
              <article key={b.key} className="bc" data-card={i}>
                <span className="yr">{b.opened}</span>
                <h3>{b.name}</h3>
                <p className="muted">{b.note}</p>
                <dl>
                  <div><dt>Heimilisfang</dt><dd>{b.street}, {b.post}</dd></div>
                  <div><dt>Tímapantanir</dt><dd><a href={`tel:${b.bookTel}`} className="num">{b.book}</a></dd></div>
                  <div><dt>Netfang</dt><dd><a href={mailHref(b.email)}>{b.email}</a></dd></div>
                  <div><dt>Starfsfólk</dt><dd className="num">{b.staff}</dd></div>
                  <div><dt>Opið</dt><dd>{b.hours ? 'Mán.-fim. 8-17, fös. 8-16' : 'Hringdu á undan'}</dd></div>
                </dl>
                {b.key === 'rvk' && <Frame p={IMG.handover} sizes="(min-width: 900px) 36vw, 100vw" />}
                {b.key === 'sel' && <Frame p={IMG.selfoss} sizes="(min-width: 900px) 36vw, 100vw" pos="50% 40%" />}
                <div><Btn to={`verkstaedi?stadur=${b.key}`} label={`Bóka ${BRN_AT[b.key]}`} tone="ink" /></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Statement() {
  return (
    <section className="vf-band" aria-labelledby="h-band">
      <div className="wrap bgrid">
        <div>
          <h2 id="h-band" data-chars="">Verkin tala.</h2>
          <p data-fade="">Slagorðið á bréfsefni Vélfangs. „Það skemmtilegasta sem við gerum er að afhenda ánægðum viðskiptavinum vélar.“ Tvær Fendt á innan við ári í Þykkvabæinn.</p>
          <div className="ctas"><Btn to="tilbod" label="Fá tilboð" tone="white" /><Btn to="umbod" label="Umboðin" tone="ghost" /></div>
        </div>
        <figure><Frame p={IMG.handover2} sizes="(min-width: 900px) 46vw, 100vw" /><figcaption>Fendt 314 Vario með ámoksturstækjum afhent í Þykkvabæ, júní 2023. Fendt Vario 720 fylgdi í apríl 2024.</figcaption></figure>
      </div>
    </section>
  )
}

function ServiceSplit() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 60_000); return () => window.clearInterval(t) }, [])
  const s = openState(now)
  return (
    <section className="vf-serv" aria-labelledby="h-serv">
      <div className="wrap sgrid">
        <div className="shop">
          <Frame p={IMG.selfoss} sizes="(min-width: 900px) 30vw, 100vw" pos="50% 35%" />
          <div>
            <h2 id="h-serv" data-chars="">Verkstæði og varahlutir</h2>
            <p data-fade="">Viðhald, viðgerðir og ábyrgðarmál á þremur stöðum. Bókaðu tíma á vefnum; vélar í ábyrgð kosta ekkert í tækniaðstoð.</p>
            <span className={`st${s.open ? ' on' : ''}`}><i aria-hidden="true" />Gylfaflöt: {s.text.toLowerCase()}</span>
            <div><Btn to="verkstaedi" label="Bóka verkstæði" tone="red" /></div>
          </div>
        </div>
        <nav className="links3" aria-label="Þjónusta">
          <Link to={to('varahlutir')}><b>Varahlutir</b><span>Fastnúmer eða raðnúmer og árgerð, og við finnum hlutinn.</span><ArrowRight size={22} aria-hidden="true" /></Link>
          <Link to={to('livelink')}><b>JCB LiveLink</b><span>Vinnustundir, staðsetning og villukóðar úr fjarlægð.</span><ArrowRight size={22} aria-hidden="true" /></Link>
          <Link to={to('abyrgd')}><b>Ábyrgð</b><span>Eitt ár á vélum og ísettum varahlutum, nema annað sé tekið fram.</span><ArrowRight size={22} aria-hidden="true" /></Link>
          <Link to={to('selja')}><b>Selja eða leita</b><span>Skráðu notaða vél til sölu, eða láttu Vélfang leita fyrir þig.</span><ArrowRight size={22} aria-hidden="true" /></Link>
        </nav>
      </div>
    </section>
  )
}

function KuhnBand() {
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState('')
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('netfang') ?? '').trim()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setErr('Skrifaðu netfang, til dæmis nafn@bu.is.'); return }
    setErr('')
    setDone(saveRequest({ kind: 'kuhn', title: 'Láta vita af áramótatilboði Kuhn', when: 'Desember', who: email, contact: email, detail: '', branch: 'rvk' }))
  }
  return (
    <section className="vf-kuhn on-dark" aria-labelledby="h-kuhn">
      <div className="kgrid">
        <div className="kph"><Pic p={IMG.kuhn} sizes="(min-width: 900px) 50vw, 100vw" /></div>
        <div className="kc">
          <span className="kick">Kemur í desember</span>
          <h2 id="h-kuhn" data-chars="">Áramótatilboð KUHN</h2>
          <p data-fade="">Tilboðið er ekki lengur sent á öll lögbýli landsins. Skráðu netfangið og fáðu það um leið og það birtist. Síðast, {KUHN_OFFER.last}:</p>
          <ul>{KUHN_OFFER.terms.map((t) => <li key={t}>{t}</li>)}</ul>
          {done ? <p className="ok" role="status">Skráð. Þú færð póst á {done.contact} þegar tilboðið birtist.</p> : (
            <form onSubmit={submit} noValidate>
              <label className="sr" htmlFor="kuhn-email">Netfang</label>
              <input id="kuhn-email" name="netfang" type="email" autoComplete="email" inputMode="email" placeholder="Netfang" aria-invalid={err ? 'true' : undefined} aria-describedby={err ? 'kuhn-err' : undefined} />
              <Btn type="submit" label="Láta mig vita" tone="red" />
              {err && <p className="err" id="kuhn-err" role="alert">{err}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function News() {
  const [a, ...rest] = NEWS
  return (
    <section className="vf-news" aria-labelledby="h-news">
      <div className="wrap">
        <div className="shead"><div><h2 id="h-news" data-chars="">Fréttir</h2></div></div>
        <div className="ngrid2">
          <Link className="lead" to={to(`frettir/${a.slug}`)}>
            <Frame p={a.img} sizes="(min-width: 900px) 56vw, 100vw" />
            <time className="num">{a.date}</time>
            <h3>{a.title}</h3>
            <p>{a.lead}</p>
          </Link>
          <div className="side">
            {rest.map((n) => (
              <Link key={n.slug} to={to(`frettir/${n.slug}`)}>
                <div className="frame"><div className="still-photo"><Pic p={n.img} sizes="132px" /></div></div>
                <div><time className="num">{n.date}</time><h3>{n.title}</h3></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function People() {
  /* only portraits Vélfang published at a usable size (several are 120 px thumbnails) */
  const ps = ['david', 'gummi', 'haftor', 'jon', 'paolo', 'kristjanfr', 'hlynur', 'heimir', 'axel', 'birnir', 'valdimar', 'arnarfr', 'henrik', 'rafal'].map((k) => STAFF.find((s) => s.key === k)!)
  return (
    <section className="vf-people" aria-labelledby="h-people">
      <div className="wrap pgrid">
        <div>
          <h2 id="h-people" data-chars="">28 manns, beint númer</h2>
          <p className="muted" data-fade="" style={{ margin: '16px 0 24px', maxWidth: '44ch' }}>Sala, varahlutir, skrifstofa og verkstæði á þremur stöðum. Hver og einn með síma og netfang sem virkar.</p>
          <Btn to="starfsfolk" label="Starfsfólk" tone="ink" />
        </div>
        <div className="faces" data-items="">
          {ps.slice(0, 14).map((p) => <img key={p.key} src={staffPhoto(p)} alt={`${p.name}, ${p.role.toLowerCase()}`} loading="lazy" width={480} height={600} />)}
        </div>
      </div>
    </section>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <StockRail />
      <BrandIndex />
      <Network />
      <Statement />
      <ServiceSplit />
      <KuhnBand />
      <News />
      <People />
    </>
  )
}

/* ── route pages ────────────────────────────────────────────────────────── */

function Intro({ kick, title, lede, crumb }: { kick?: string; title: ReactNode[]; lede?: ReactNode; crumb?: { to: string; label: string } }) {
  return (
    <div className="intro">
      {crumb && <Link className="crumb" to={to(crumb.to)}><ArrowLeft size={15} aria-hidden="true" />{crumb.label}</Link>}
      {kick && <span className="kick" data-open="">{kick}</span>}
      <h1><Lines lines={title} /></h1>
      {lede && <p className="lede" data-open="">{lede}</p>}
    </div>
  )
}

type F = { merki: string; flokkur: string; astand: string; svid: string; stadur: string }
const FKEYS: (keyof F)[] = ['astand', 'svid', 'flokkur', 'merki', 'stadur']
const STOCK_BRANDS = [...new Set(MACHINES.map((m) => m.brandKey))]
const matches = (x: Machine, f: F) => (!f.merki || x.brandKey === f.merki) && (!f.flokkur || x.cat === f.flokkur) && (!f.astand || x.cond === f.astand) && (!f.svid || x.field === f.svid) && (!f.stadur || x.region === f.stadur)
const SORTS: { k: string; label: string; fn: (a: Machine, b: Machine) => number }[] = [
  { k: 'verd-upp', label: 'Verð, lægst fyrst', fn: (a, b) => a.price - b.price },
  { k: 'verd-nidur', label: 'Verð, hæst fyrst', fn: (a, b) => b.price - a.price },
  { k: 'nyjast', label: 'Nýjast skráð', fn: (a, b) => dnum(b.listed) - dnum(a.listed) },
  { k: 'notkun', label: 'Minnst notkun', fn: (a, b) => (a.hours ?? 0) - (b.hours ?? 0) },
]
function dnum(d: string) { const [dd, mm, yy] = d.split('.').map(Number); return yy * 10000 + mm * 100 + dd }

function useVat(): [boolean, (v: boolean) => void] {
  const [v, setV] = useState(() => { try { return sessionStorage.getItem('vf-vat') === '1' } catch { return false } })
  return [v, (x: boolean) => { setV(x); try { sessionStorage.setItem('vf-vat', x ? '1' : '0') } catch { /* */ } }]
}

function StockPage() {
  const loc = useLocation()
  const nav = useNavigate()
  const sp = new URLSearchParams(loc.search)
  const f: F = { merki: sp.get('merki') ?? '', flokkur: sp.get('flokkur') ?? '', astand: sp.get('astand') ?? '', svid: sp.get('svid') ?? '', stadur: sp.get('stadur') ?? '' }
  const sort = sp.get('rod') ?? 'verd-nidur'
  const [vat, setVat] = useVat()
  const set = (k: string, v: string) => {
    const p = new URLSearchParams(loc.search)
    if (p.get(k) === v || !v) p.delete(k); else p.set(k, v)
    nav({ pathname: loc.pathname, search: p.toString() ? `?${p}` : '' }, { replace: true })
  }
  const clear = () => nav({ pathname: loc.pathname }, { replace: true })
  const active = FKEYS.filter((k) => f[k]).length
  const shown = MACHINES.filter((x) => matches(x, f)).sort((SORTS.find((s) => s.k === sort) ?? SORTS[1]).fn)
  useEffect(() => { const t = window.setTimeout(() => ScrollTrigger.refresh(), 650); return () => window.clearTimeout(t) }, [loc.search])
  const groups: { k: keyof F; label: string; opts: [string, string][] }[] = [
    { k: 'astand', label: 'Ástand', opts: [['ny', 'Ný tæki'], ['notud', 'Notuð tæki']] },
    { k: 'svid', label: 'Svið', opts: FIELDS.filter((x) => x.key !== 'sveitarfelog').map((x) => [x.key, x.label]) },
    { k: 'flokkur', label: 'Flokkur', opts: CATS.map((c) => [c, c]) },
    { k: 'merki', label: 'Merki', opts: STOCK_BRANDS.map((k) => [k, brandByKey(k)!.name]) },
    { k: 'stadur', label: 'Stendur', opts: BRANCHES.map((b) => [b.key, b.name]) },
  ]
  return (
    <div className="vf-page">
      <div className="wrap">
        <Intro kick="Söluskrá Vélfangs" title={['Vélar á lager']} lede="Nýjar og notaðar vélar með verði, árgerð, notkun og hvar þær standa. Síaðu, berðu saman og bókaðu skoðun." />
        <div className="filters" role="group" aria-label="Sía vélar">
          {groups.map((g) => (
            <div key={g.k} className="fgroup"><span>{g.label}</span>
              {g.opts.map(([v, l]) => <button key={v} type="button" className="chip" aria-pressed={f[g.k] === v} onClick={() => set(g.k, v)}>{l}</button>)}
            </div>
          ))}
          <div className="fbar">
            <p className="fcount num" role="status">{shown.length} {shown.length === 1 ? 'vél' : 'vélar'}{active > 0 && <button type="button" onClick={clear}>Hreinsa síur</button>}</p>
            <div className="ftools">
              <label className="switch"><input type="checkbox" checked={vat} onChange={(e) => setVat(e.target.checked)} />Sýna verð með vsk.</label>
              <label>Röðun <select value={sort} onChange={(e) => set('rod', e.target.value)}>{SORTS.map((s) => <option key={s.k} value={s.k}>{s.label}</option>)}</select></label>
            </div>
          </div>
        </div>
        {shown.length === 0 ? (
          <div className="empty">
            <h3>Engin vél passar við þessar síur.</h3>
            <p>Prófaðu færri síur, eða skráðu þig á óskalista og Vélfang leitar að vélinni, líka erlendis.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Btn label="Hreinsa síur" tone="ink" onClick={clear} /><Btn to="selja?leit=1" label="Óskalisti" tone="line" /></div>
          </div>
        ) : (
          <motion.ul className="grid" layout role="list">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((x) => (
                <motion.li key={x.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: still() ? 0 : 0.32, ease: [0.23, 1, 0.32, 1] }}>
                  <MachineCard x={x} vat={vat} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
        <p className="fine">{STOCK_NOTE}{vat ? ' Verð með vsk. er reiknað hér með 24 %.' : ''} Myndir af söluskrá Vélfangs.</p>
      </div>
    </div>
  )
}

function DetailPage({ id }: { id: string }) {
  const x = machineById(id)
  const [i, setI] = useState(0)
  const [vat, setVat] = useVat()
  if (!x) return <NotFound />
  const pics = [x.img, ...x.gallery]
  const b = branch(x.region)
  const specs: [string, string | undefined][] = [
    ['Árgerð', x.year], ['Notkun', x.hours !== undefined ? `${x.hours.toLocaleString('de-DE')} ${x.unit}` : undefined], ['Vél', x.engine], ['Þyngd', x.weight],
    ['Skipting', x.gear], ['Drif', x.drive], ['Flokkur', x.cat], ['Raðnúmer', x.id],
  ]
  const more = MACHINES.filter((m) => m.id !== x.id && (m.cat === x.cat || m.brandKey === x.brandKey)).slice(0, 3)
  const p = vat ? Math.round(x.price * (1 + VAT)) : x.price
  return (
    <div className="vf-page vf-detail">
      <div className="wrap">
        <Link className="crumb" to={to('velar')}><ArrowLeft size={15} aria-hidden="true" />Allar vélar</Link>
        <div className="dgrid">
          <div>
            <div className="gmain"><Pic p={pics[i]} sizes="(min-width: 900px) 56vw, 100vw" eager /></div>
            {pics.length > 1 && (
              <div className="thumbs" role="group" aria-label="Myndir">
                {pics.map((ph, k) => <button key={k} type="button" aria-pressed={i === k} aria-label={`Mynd ${k + 1} af ${pics.length}`} onClick={() => setI(k)}><img src={ph.src.replace('-1280.webp', '-640.webp')} alt="" loading="lazy" width={640} height={512} /></button>)}
              </div>
            )}
            <div className="plate">
              <h2>Tæknilýsing</h2>
              <dl>{specs.filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="num">{v}</dd></div>)}</dl>
            </div>
            {x.note && (
              <div className="note">
                <h2>Frá sölumanni</h2>
                <p>{x.note}</p>
                {x.extras && <div className="extras">{x.extras.map((e) => <span key={e}>{e}</span>)}</div>}
              </div>
            )}
            <p className="src">Af söluskrá Vélfangs, raðnúmer {x.id}. Skráð {x.listed}, síðast uppfært {x.updated}.</p>
          </div>
          <aside className="dside">
            <p className="brn"><span className={`tag${x.cond === 'notud' ? ' u' : ''}`}>{x.cond === 'ny' ? 'Nýtt' : 'Notað'}</span>{x.brand}</p>
            <h1 translate="no"><Lines lines={[x.model]} /></h1>
            <p className="head" data-open="">{x.head}</p>
            <div className="price" data-open="">
              <b className="num">{kr(p)}</b>
              <small>{vat ? 'Með 24 % vsk.' : 'Án vsk.'}{x.priceNote ? ` ${x.priceNote}` : ''}</small>
              <label className="switch" style={{ marginTop: 10, fontSize: 14 }}><input type="checkbox" checked={vat} onChange={(e) => setVat(e.target.checked)} />Sýna með vsk.</label>
            </div>
            <div className="dact" data-open="">
              <Btn to={`skodun?vel=${x.id}`} label="Bóka skoðun" tone="red" />
              <Btn to={`tilbod?vel=${x.id}`} label="Fá tilboð" tone="line" />
            </div>
            <p className="where"><MapPin size={14} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />Stendur hjá Vélfangi {BRN_AT[x.region]}, {b.street}. Sími <a className="num" href={`tel:${b.tel}`} style={{ fontWeight: 600 }}>{b.phone}</a>.</p>
          </aside>
        </div>
        {more.length > 0 && (
          <div className="more">
            <h2 data-chars="">Skyldar vélar</h2>
            <ul className="grid" style={{ marginTop: 32 }} data-items="">{more.map((m) => <li key={m.id}><MachineCard x={m} vat={vat} /></li>)}</ul>
          </div>
        )}
      </div>
    </div>
  )
}

/* forms */
function focusFirst(form: HTMLFormElement, er: Record<string, string>) {
  window.setTimeout(() => {
    const k = Object.keys(er)[0]
    const el = form.querySelector<HTMLElement>(`[name="${k}"], [aria-invalid="true"]`)
    ;(el ?? form.querySelector<HTMLElement>('.err'))?.focus?.()
  }, 0)
}
function weekdays(n = 10): { v: string; label: string }[] {
  const out: { v: string; label: string }[] = []
  const days = ['sun.', 'mán.', 'þri.', 'mið.', 'fim.', 'fös.', 'lau.']
  const months = ['jan.', 'feb.', 'mars', 'apr.', 'maí', 'júní', 'júlí', 'ág.', 'sept.', 'okt.', 'nóv.', 'des.']
  for (let i = 1; out.length < n && i < 40; i++) {
    const t = new Date(Date.now() + i * 86_400_000)
    const wd = t.getUTCDay()
    if (wd === 0 || wd === 6) continue
    out.push({ v: t.toISOString().slice(0, 10), label: `${days[wd]} ${t.getUTCDate()}. ${months[t.getUTCMonth()]}` })
  }
  return out
}
function weeks(n = 4): { v: string; label: string }[] {
  const out: { v: string; label: string }[] = []
  const d = new Date()
  const mon = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + ((8 - d.getUTCDay()) % 7 || 7)))
  for (let i = 0; i < n; i++) {
    const a = new Date(mon.getTime() + i * 7 * 86_400_000), f = new Date(a.getTime() + 4 * 86_400_000)
    const jan1 = new Date(Date.UTC(a.getUTCFullYear(), 0, 1))
    const wk = Math.ceil(((a.getTime() - jan1.getTime()) / 86_400_000 + jan1.getUTCDay() + 1) / 7)
    out.push({ v: `v${wk}`, label: `Vika ${wk}: ${a.getUTCDate()}.-${f.getUTCDate()}.${f.getUTCMonth() + 1}.` })
  }
  return out
}
const okName = (s: string) => s.trim().length >= 2
const okTel = (s: string) => /^\+?[\d\s-]{7,}$/.test(s.trim())
const okMail = (s: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.trim())

function Done({ r, back }: { r: Request; back: ReactNode }) {
  return (
    <div className="done" role="status">
      <h2>Beiðnin er komin til Vélfangs.</h2>
      <dl>
        <div><dt>Númer</dt><dd className="num">{r.id}</dd></div>
        <div><dt>Beiðni</dt><dd>{r.title}</dd></div>
        <div><dt>Hvenær</dt><dd>{r.when}</dd></div>
        <div><dt>Staður</dt><dd>{BRN[r.branch]}</dd></div>
        <div><dt>Fer til</dt><dd>{routeTo(r.kind, r.branch)}</dd></div>
      </dl>
      <div className="acts">{back}</div>
      <p className="proto-note">Frumgerð: beiðnin er geymd í þessum vafra og birtist á <Link to={to('afgreidsla')} style={{ textDecoration: 'underline' }}>afgreiðslusíðunni</Link>. Ekkert er sent til Vélfangs.</p>
    </div>
  )
}

function Field({ label, name, type = 'text', required, auto, mode, error, placeholder, hint, defaultValue }: { label: string; name: string; type?: string; required?: boolean; auto?: string; mode?: 'tel' | 'email' | 'numeric'; error?: string; placeholder?: string; hint?: string; defaultValue?: string }) {
  return (
    <label>
      <span>{label}{!required && <span className="sr"> (valfrjálst)</span>}</span>
      <input name={name} type={type} required={required} autoComplete={auto} inputMode={mode} spellCheck={type === 'email' || type === 'tel' ? false : undefined} aria-invalid={error ? 'true' : undefined} placeholder={placeholder} defaultValue={defaultValue} />
      {hint && <span className="hint">{hint}</span>}
      {error && <p className="err" role="alert">{error}</p>}
    </label>
  )
}

function Contact({ err, company = true }: { err: Record<string, string>; company?: boolean }) {
  return (
    <>
      <div className="two">
        <Field label="Nafn" name="nafn" required auto="name" error={err.nafn} />
        <Field label="Sími" name="simi" type="tel" required auto="tel" mode="tel" error={err.simi} />
      </div>
      <div className="two">
        <Field label="Netfang (valfrjálst)" name="netfang" type="email" auto="email" mode="email" error={err.netfang} />
        {company && <Field label="Bú eða fyrirtæki (valfrjálst)" name="fyrirtaeki" auto="organization" />}
      </div>
    </>
  )
}
function readContact(fd: FormData, er: Record<string, string>) {
  const name = String(fd.get('nafn') ?? ''), tel = String(fd.get('simi') ?? ''), mail = String(fd.get('netfang') ?? '')
  if (!okName(name)) er.nafn = 'Skrifaðu nafnið þitt.'
  if (!okTel(tel)) er.simi = 'Skrifaðu símanúmer, 7 tölustafi.'
  if (mail && !okMail(mail)) er.netfang = 'Netfangið lítur ekki rétt út.'
  const co = String(fd.get('fyrirtaeki') ?? '').trim()
  return { who: co ? `${name.trim()}, ${co}` : name.trim(), contact: [tel.trim(), mail.trim()].filter(Boolean).join(', ') }
}

function MachinePicked({ x }: { x: Machine }) {
  return (
    <div className="picked"><img src={x.img.src.replace('-1280.webp', '-640.webp')} alt="" width={640} height={512} /><div><b>{machineName(x)}</b><span>{kr(x.price)} án vsk. · stendur {BRN_AT[x.region]}</span></div></div>
  )
}

function ViewingPage() {
  const loc = useLocation()
  const pre = new URLSearchParams(loc.search).get('vel') ?? ''
  const [id, setId] = useState(machineById(pre) ? pre : '')
  const [trade, setTrade] = useState(false)
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const days = useMemo(() => weekdays(10), [])
  const x = machineById(id)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const er: Record<string, string> = {}
    if (!x) er.vel = 'Veldu vél.'
    const day = String(fd.get('dagur') ?? ''), part = String(fd.get('hluti') ?? '')
    if (!day) er.dagur = 'Veldu dag.'
    const c = readContact(fd, er)
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    const d = days.find((q) => q.v === day)
    setDone(saveRequest({ kind: 'skodun', title: `${machineName(x!)} (${x!.id})`, when: `${d?.label ?? day}, ${part || 'hvenær sem er'}`, who: c.who, contact: c.contact, detail: trade ? `Vél upp í: ${String(fd.get('uppi') ?? '')}` : '', branch: x!.region }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="vf-page">
      <div className="wrap">
        <Intro crumb={x ? { to: `velar/${x.id}`, label: machineName(x) } : { to: 'velar', label: 'Allar vélar' }} kick="Skoðun og prufa" title={['Bóka skoðun']} lede="Veldu dag. Sölumaður staðfestir í síma og vélin bíður þín þar sem hún stendur." />
        <div className="book-grid">
          {done ? <Done r={done} back={<><Btn to="velar" label="Fleiri vélar" tone="ink" /><Btn label="Önnur skoðun" tone="line" onClick={() => setDone(null)} /></>} /> : (
            <form className="form" onSubmit={submit} noValidate>
              {x ? <><MachinePicked x={x} /><button type="button" className="tlink" style={{ width: 'max-content' }} onClick={() => setId('')}>Velja aðra vél</button></> : (
                <label><span>Vél</span>
                  <select name="vel" value={id} onChange={(e) => setId(e.target.value)} aria-invalid={err.vel ? 'true' : undefined}>
                    <option value="">Veldu vél</option>
                    {MACHINES.map((m) => <option key={m.id} value={m.id}>{machineName(m)}, {kr(m.price)} án vsk.</option>)}
                  </select>
                  {err.vel && <p className="err" role="alert">{err.vel}</p>}
                </label>
              )}
              <fieldset>
                <legend>Dagur</legend>
                <div className="opts">{days.map((d) => <label key={d.v} className="opt"><input type="radio" name="dagur" value={d.v} /><span>{d.label}</span></label>)}</div>
                {err.dagur && <p className="err">{err.dagur}</p>}
              </fieldset>
              <fieldset>
                <legend>Tími dags</legend>
                <div className="opts">{['Fyrir hádegi', 'Eftir hádegi'].map((o) => <label key={o} className="opt"><input type="radio" name="hluti" value={o} /><span>{o}</span></label>)}</div>
              </fieldset>
              <Contact err={err} />
              <fieldset>
                <legend>Viltu setja vél upp í?</legend>
                <div className="opts">{['Nei', 'Já'].map((o) => <label key={o} className="opt"><input type="radio" name="trade" value={o} checked={trade === (o === 'Já')} onChange={() => setTrade(o === 'Já')} /><span>{o}</span></label>)}</div>
              </fieldset>
              {trade && <label><span>Vélin sem fer upp í</span><textarea name="uppi" rows={3} placeholder="Tegund, árgerð, notkun í vinnustundum, ástand" /></label>}
              <div className="acts"><Btn type="submit" label="Senda beiðni" tone="red" /></div>
              <p className="note">Upplýsingarnar eru aðeins notaðar til að bóka þessa skoðun. <Link to={to('personuvernd')} style={{ textDecoration: 'underline' }}>Persónuvernd</Link>.</p>
            </form>
          )}
          <aside className="aside">
            <h3>{x ? `Vélin stendur ${BRN_AT[x.region]}` : 'Þrír staðir'}</h3>
            {x ? <p>{branch(x.region).street}, {branch(x.region).post}. Sími <a href={`tel:${branch(x.region).tel}`} className="tlink">{branch(x.region).phone}</a>.</p> : <p>Vélarnar standa í Reykjavík, á Akureyri eða Selfossi. Staðurinn kemur fram á hverri vél.</p>}
            <p>Opið á Gylfaflöt mánudaga til fimmtudaga kl. 8-17 og föstudaga kl. 8-16.</p>
            <Frame p={IMG.hero} sizes="(min-width: 900px) 36vw, 100vw" pos="50% 60%" />
          </aside>
        </div>
      </div>
    </div>
  )
}

const WS_JOBS = ['Reglubundið viðhald', 'Viðgerð', 'Ábyrgðarmál', 'Villukóði úr LiveLink', 'Verkstæðisbíll á staðinn']
function WorkshopPage() {
  const loc = useLocation()
  const pre = new URLSearchParams(loc.search).get('stadur') as BranchKey | null
  const [b, setB] = useState<BranchKey | ''>(pre && ['rvk', 'ak', 'sel'].includes(pre) ? pre : '')
  const [job, setJob] = useState('')
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const wks = useMemo(() => weeks(4), [])
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const er: Record<string, string> = {}
    if (!b) er.stadur = 'Veldu verkstæði.'
    if (!job) er.verk = 'Veldu verk.'
    const make = String(fd.get('tegund') ?? ''), model = String(fd.get('gerd') ?? '').trim(), id = String(fd.get('numer') ?? '').trim(), yr = String(fd.get('argerd') ?? '').trim()
    if (!make) er.tegund = 'Veldu tegund.'
    if (model.length < 2) er.gerd = 'Skrifaðu gerð, til dæmis Fendt 516 Vario.'
    if (id.length < 3) er.numer = 'Fastnúmer eða framleiðslunúmer flýtir fyrir.'
    if (job === 'Verkstæðisbíll á staðinn' && String(fd.get('stadsetning') ?? '').trim().length < 3) er.stadsetning = 'Hvar er vélin?'
    const c = readContact(fd, er)
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    const w = wks.find((q) => q.v === fd.get('vika'))
    setDone(saveRequest({ kind: 'verkstaedi', title: `${job}, ${make === 'Annað' ? '' : `${make} `}${model}`, when: w?.label ?? 'Sem fyrst', who: c.who, contact: c.contact, detail: `Nr. ${id}${yr ? `, árgerð ${yr}` : ''}. ${String(fd.get('stadsetning') ?? '')} ${String(fd.get('lysing') ?? '')}`.trim(), branch: b as BranchKey }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="vf-page">
      <div className="wrap">
        <Intro kick="Þjónusta" title={['Bóka verkstæði']} lede="Veldu stað, segðu hvaða vél og hvað þarf að gera. Verkstæðið staðfestir tímann í síma." />
        <div className="book-grid">
          {done ? <Done r={done} back={<><Btn to="" label="Á forsíðu" tone="ink" /><Btn label="Önnur bókun" tone="line" onClick={() => { setDone(null); setJob('') }} /></>} /> : (
            <form className="form" onSubmit={submit} noValidate>
              <fieldset>
                <legend>Verkstæði</legend>
                <div className="opts">
                  {BRANCHES.map((x) => <label key={x.key} className="opt bigopt"><input type="radio" name="stadur" value={x.key} checked={b === x.key} onChange={() => setB(x.key)} /><span><b>{x.name}</b><small>{x.street} · {x.book}</small></span></label>)}
                </div>
                {err.stadur && <p className="err">{err.stadur}</p>}
              </fieldset>
              <fieldset>
                <legend>Verk</legend>
                <div className="opts">{WS_JOBS.map((j) => <label key={j} className="opt"><input type="radio" name="verk" value={j} checked={job === j} onChange={() => setJob(j)} /><span>{j}</span></label>)}</div>
                {err.verk && <p className="err">{err.verk}</p>}
              </fieldset>
              {job === 'Verkstæðisbíll á staðinn' && <Field label="Hvar er vélin?" name="stadsetning" required placeholder="Bær eða verkstaður, sveitarfélag" error={err.stadsetning} />}
              <div className="two">
                <label><span>Tegund</span>
                  <select name="tegund" defaultValue="" aria-invalid={err.tegund ? 'true' : undefined}><option value="">Veldu</option>{BRANDS.map((x) => <option key={x.key}>{x.name}</option>)}<option>Annað</option></select>
                  {err.tegund && <p className="err" role="alert">{err.tegund}</p>}
                </label>
                <Field label="Gerð" name="gerd" required placeholder="Til dæmis 516 Vario" error={err.gerd} />
              </div>
              <div className="two">
                <Field label="Fastnúmer eða framleiðslunúmer" name="numer" required error={err.numer} hint="Á dráttarvélum fastnúmer, á vinnu- og heyvinnuvélum framleiðslunúmer." />
                <Field label="Árgerð (valfrjálst)" name="argerd" mode="numeric" placeholder="2019" />
              </div>
              <label><span>Hvað er að? (valfrjálst)</span><textarea name="lysing" rows={3} placeholder="Hvað gerist, hvenær byrjaði það, villukóði ef hann sést" /></label>
              <fieldset>
                <legend>Hvenær hentar?</legend>
                <div className="opts">{wks.map((w, i) => <label key={w.v} className="opt"><input type="radio" name="vika" value={w.v} defaultChecked={i === 0} /><span className="num">{w.label}</span></label>)}</div>
              </fieldset>
              <Contact err={err} />
              <div className="acts"><Btn type="submit" label="Senda bókun" tone="red" /></div>
              <p className="note">Tækniaðstoð við vélar í ábyrgð kostar ekkert. Víðtæk aðstoð utan þjónustusamninga getur verið gjaldskyld á tímagjaldi.</p>
            </form>
          )}
          <aside className="aside">
            <h3>{b ? `Verkstæðið ${BRN_AT[b]}` : 'Þrjú verkstæði'}</h3>
            {b ? <><p>{branch(b).street}, {branch(b).post}.</p><p>Tímapantanir: <a className="tlink" href={`tel:${branch(b).bookTel}`}>{branch(b).book}</a>, <a className="tlink" href={mailHref(branch(b).email)}>{branch(b).email}</a></p><p>{branch(b).hours ? 'Opið mánudaga til fimmtudaga kl. 8-17, föstudaga kl. 8-16.' : 'Opnunartími er ekki birtur: hringdu á undan.'}</p></>
              : <p>Reykjavík, Akureyri og Selfoss. Verkstæðisbílar fara líka á staðinn, bilanagreina og gera við það sem hægt er án flutnings.</p>}
            <Frame p={b === 'sel' ? IMG.selfoss : IMG.hero} sizes="(min-width: 900px) 36vw, 100vw" pos="50% 45%" />
          </aside>
        </div>
      </div>
    </div>
  )
}

function QuotePage() {
  const loc = useLocation()
  const pre = machineById(new URLSearchParams(loc.search).get('vel') ?? '')
  const [who, setWho] = useState('Verktaki')
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const er: Record<string, string> = {}
    const want = String(fd.get('vantar') ?? '').trim()
    const brands = fd.getAll('merki').map(String)
    if (!pre && want.length < 4 && !brands.length) er.vantar = 'Hvaða vél eða tæki vantar þig?'
    const c = readContact(fd, er)
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    setDone(saveRequest({ kind: 'tilbod', title: pre ? `${machineName(pre)} (${pre.id})` : want || brands.join(', '), when: String(fd.get('hvenaer') || 'Óákveðið'), who: `${who}: ${c.who}`, contact: c.contact, detail: [brands.length ? `Merki: ${brands.join(', ')}` : '', fd.get('uppi') ? `Upp í: ${fd.get('uppi')}` : ''].filter(Boolean).join('. '), branch: pre?.region ?? 'rvk' }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="vf-page">
      <div className="wrap">
        <Intro kick="Fyrir bú, verktaka og sveitarfélög" title={['Fá tilboð']} lede="Segðu hvað vantar. Sölumaður finnur lausnina á besta verði sem völ er á; stundum hentar góð notuð vél jafn vel og ný." />
        <div className="book-grid">
          {done ? <Done r={done} back={<><Btn to="velar" label="Vélar á lager" tone="ink" /><Btn label="Önnur beiðni" tone="line" onClick={() => setDone(null)} /></>} /> : (
            <form className="form" onSubmit={submit} noValidate>
              {pre && <MachinePicked x={pre} />}
              <fieldset>
                <legend>Fyrir hvern?</legend>
                <div className="opts">{['Verktaki', 'Bú', 'Sveitarfélag eða golfvöllur'].map((o) => <label key={o} className="opt"><input type="radio" name="hver" value={o} checked={who === o} onChange={() => setWho(o)} /><span>{o}</span></label>)}</div>
              </fieldset>
              {!pre && <label><span>Hvað vantar?</span><textarea name="vantar" rows={4} placeholder={who === 'Verktaki' ? 'Til dæmis 14 tonna hjólagrafa með rótortilti' : who === 'Bú' ? 'Til dæmis sjálfhleðsluvagn fyrir 2027' : 'Til dæmis dráttarvél fyrir snjóhreinsun og slátt'} aria-invalid={err.vantar ? 'true' : undefined} />{err.vantar && <p className="err" role="alert">{err.vantar}</p>}</label>}
              <fieldset>
                <legend>Merki sem koma til greina (valfrjálst)</legend>
                <div className="opts">{BRANDS.filter((x) => x.fields.length).map((x) => <label key={x.key} className="opt"><input type="checkbox" name="merki" value={x.name} /><span>{x.name}</span></label>)}</div>
              </fieldset>
              <div className="two">
                <label><span>Hvenær?</span><select name="hvenaer" defaultValue=""><option value="">Óákveðið</option><option>Sem fyrst</option><option>Fyrir vorið</option><option>Fyrir heyskapinn</option><option>Á næsta ári</option></select></label>
                <Field label="Vél upp í (valfrjálst)" name="uppi" placeholder="Tegund, árgerð, notkun" />
              </div>
              <Contact err={err} />
              <div className="acts"><Btn type="submit" label="Senda beiðni" tone="red" /></div>
            </form>
          )}
          <aside className="aside">
            <h3>Sölumenn</h3>
            {STAFF.filter((p) => p.dept === 'sala').map((p) => <p key={p.key}><b style={{ color: 'var(--ink)', fontWeight: 600 }}>{p.name}</b>, {p.role.toLowerCase()}<br /><a className="num" href={`tel:${telOf(p.phone!)}`}>{p.phone}</a> · <a href={mailHref(p.email!)}>{p.email}</a></p>)}
            <Frame p={IMG.jcbCity} sizes="(min-width: 900px) 36vw, 100vw" />
          </aside>
        </div>
      </div>
    </div>
  )
}

function PartsPage() {
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const [b, setB] = useState<BranchKey>('rvk')
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const er: Record<string, string> = {}
    const vel = String(fd.get('vel') ?? '').trim(), num = String(fd.get('numer') ?? '').trim(), hlutur = String(fd.get('hlutur') ?? '').trim()
    if (vel.length < 3) er.vel = 'Hvaða vél? Tegund og gerð.'
    if (num.length < 3) er.numer = 'Fastnúmer eða framleiðslunúmer.'
    if (hlutur.length < 3) er.hlutur = 'Hvaða hlut vantar?'
    const c = readContact(fd, er)
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    setDone(saveRequest({ kind: 'varahlutir', title: `${hlutur} í ${vel}`, when: 'Sem fyrst', who: c.who, contact: c.contact, detail: `Nr. ${num}${fd.get('argerd') ? `, árgerð ${fd.get('argerd')}` : ''}${fd.get('vnr') ? `, vörunúmer ${fd.get('vnr')}` : ''}`, branch: b }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="vf-page">
      <div className="wrap">
        <Intro kick="Þjónusta" title={['Varahlutir']} lede={PARTS.lead} />
        <div className="book-grid">
          {done ? <Done r={done} back={<Btn label="Önnur beiðni" tone="line" onClick={() => setDone(null)} />} /> : (
            <form className="form" onSubmit={submit} noValidate>
              <fieldset>
                <legend>Afgreitt frá</legend>
                <div className="opts">{(['rvk', 'ak'] as BranchKey[]).map((k) => <label key={k} className="opt"><input type="radio" name="fra" value={k} checked={b === k} onChange={() => setB(k)} /><span>{k === 'rvk' ? 'Reykjavík, varahlutir@velfang.is' : 'Akureyri, 580 8222'}</span></label>)}</div>
              </fieldset>
              <Field label="Vél" name="vel" required placeholder="Til dæmis CLAAS Arion 420" error={err.vel} />
              <div className="two">
                <Field label="Fastnúmer eða framleiðslunúmer" name="numer" required error={err.numer} />
                <Field label="Árgerð (valfrjálst)" name="argerd" mode="numeric" />
              </div>
              <div className="two">
                <Field label="Hlutur" name="hlutur" required placeholder="Til dæmis loftsía og olíusía" error={err.hlutur} />
                <Field label="Vörunúmer (valfrjálst)" name="vnr" hint="Úr varahlutalista framleiðandans, ef þú ert með það." />
              </div>
              <Contact err={err} />
              <div className="acts"><Btn type="submit" label="Senda beiðni" tone="red" /></div>
            </form>
          )}
          <aside className="aside">
            <h3>Líka í aðrar tegundir</h3>
            <p>{PARTS.others}</p>
            <p>Sími <a className="tlink num" href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>, <a className="tlink" href={mailHref(CONTACT.parts)}>{CONTACT.parts}</a></p>
            {STAFF.filter((p) => p.dept === 'varahlutir').map((p) => <p key={p.key}>{p.name}, {p.role.toLowerCase()}{p.phone !== '580 8200' && <>: <a className="num" href={`tel:${telOf(p.phone!)}`}>{p.phone}</a></>}</p>)}
          </aside>
        </div>
      </div>
    </div>
  )
}

function LiveLinkPage() {
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const er: Record<string, string> = {}
    const vel = String(fd.get('vel') ?? '').trim(), num = String(fd.get('numer') ?? '').trim()
    if (vel.length < 3) er.vel = 'Hvaða JCB vél?'
    if (num.length < 3) er.numer = 'Framleiðslunúmer vélarinnar.'
    const c = readContact(fd, er)
    if (!okMail(String(fd.get('netfang') ?? ''))) er.netfang = 'Aðgangurinn er sendur á netfang.'
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    setDone(saveRequest({ kind: 'livelink', title: `LiveLink aðgangur, ${vel}`, when: 'Sem fyrst', who: c.who, contact: c.contact, detail: `Framleiðslunúmer ${num}`, branch: 'rvk' }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="vf-page">
      <div className="wrap">
        <Intro kick="JCB vinnuvélar" title={['JCB LiveLink']} lede={LIVELINK.what} />
        <div className="book-grid">
          <div className="doc">
            <div><h2>Það sem eigandinn sér</h2><ul style={{ marginTop: 14 }}>{LIVELINK.reports.map((r) => <li key={r}>{r}</li>)}</ul></div>
            <div><h2>Af hverju</h2><ul style={{ marginTop: 14 }}>{LIVELINK.why.map((r) => <li key={r}>{r}</li>)}</ul></div>
            <p className="callout">{LIVELINK.which} {LIVELINK.who}</p>
          </div>
          <div>
            {done ? <Done r={done} back={<Btn to="" label="Á forsíðu" tone="ink" />} /> : (
              <form className="form" onSubmit={submit} noValidate>
                <h2 style={{ fontSize: 'clamp(28px,2.6vw,40px)' }}>Sækja um aðgang</h2>
                <p className="note">Guðmundur Sigurðsson þjónustustjóri tengir þig við vélina: {LIVELINK.contact}.</p>
                <div className="two">
                  <Field label="JCB vél" name="vel" required placeholder="Til dæmis JS145W" error={err.vel} />
                  <Field label="Framleiðslunúmer" name="numer" required error={err.numer} />
                </div>
                <div className="two">
                  <Field label="Nafn" name="nafn" required auto="name" error={err.nafn} />
                  <Field label="Sími" name="simi" type="tel" required auto="tel" mode="tel" error={err.simi} />
                </div>
                <Field label="Netfang" name="netfang" type="email" required auto="email" mode="email" error={err.netfang} />
                <div className="acts"><Btn type="submit" label="Sækja um" tone="red" /></div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SellPage() {
  const loc = useLocation()
  const [tab, setTab] = useState<'selja' | 'leita'>(new URLSearchParams(loc.search).get('leit') ? 'leita' : 'selja')
  const [done, setDone] = useState<Request | null>(null)
  const [err, setErr] = useState<Record<string, string>>({})
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const er: Record<string, string> = {}
    const what = String(fd.get('hvad') ?? '').trim()
    if (what.length < 4) er.hvad = tab === 'selja' ? 'Tegund, gerð og árgerð.' : 'Hvaða vél ertu að leita að?'
    const c = readContact(fd, er)
    setErr(er)
    if (Object.keys(er).length) { focusFirst(e.currentTarget, er); return }
    const kind: Kind = tab === 'selja' ? 'selja' : 'oskalisti'
    setDone(saveRequest({ kind, title: what, when: tab === 'selja' ? 'Til sölu' : String(fd.get('hvenaer') || 'Óákveðið'), who: c.who, contact: c.contact, detail: [fd.get('notkun') ? `Notkun ${fd.get('notkun')}` : '', fd.get('verd') ? `Verð ${fd.get('verd')}` : '', String(fd.get('lysing') ?? '')].filter(Boolean).join('. '), branch: 'rvk' }))
    window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' })
  }
  return (
    <div className="vf-page">
      <div className="wrap">
        <Intro kick="Notaðar vélar" title={['Selja eða leita']} lede="Vélfang tekur notaðar vélar í sölu og leitar að vélum fyrir viðskiptavini, líka erlendis: kornþreskivélum, dráttarvélum, vinnuvélum og öðru." />
        <div className="seg" role="group" aria-label="Selja eða leita">
          <button type="button" aria-pressed={tab === 'selja'} onClick={() => { setTab('selja'); setDone(null) }}>Skrá vél til sölu</button>
          <button type="button" aria-pressed={tab === 'leita'} onClick={() => { setTab('leita'); setDone(null) }}>Óskalisti</button>
        </div>
        <div className="book-grid">
          {done ? <Done r={done} back={<Btn label="Önnur skráning" tone="line" onClick={() => setDone(null)} />} /> : (
            <form className="form" onSubmit={submit} noValidate key={tab}>
              <Field label={tab === 'selja' ? 'Vélin' : 'Vélin sem þig vantar'} name="hvad" required placeholder={tab === 'selja' ? 'Til dæmis CLAAS Arion 420, 2017' : 'Til dæmis Fendt 300 Vario með ámoksturstækjum'} error={err.hvad} />
              {tab === 'selja' ? (
                <div className="two"><Field label="Notkun (valfrjálst)" name="notkun" placeholder="Vinnustundir" /><Field label="Verðhugmynd (valfrjálst)" name="verd" placeholder="Án vsk." /></div>
              ) : (
                <div className="two"><Field label="Verðbil (valfrjálst)" name="verd" placeholder="Án vsk." /><label><span>Hvenær?</span><select name="hvenaer" defaultValue=""><option value="">Óákveðið</option><option>Sem fyrst</option><option>Fyrir vorið</option><option>Fyrir heyskapinn</option></select></label></div>
              )}
              <label><span>Nánar (valfrjálst)</span><textarea name="lysing" rows={4} placeholder={tab === 'selja' ? 'Ástand, aukabúnaður, hvar vélin er. Myndir sendir þú sölumanni þegar hann hefur samband.' : 'Búnaður sem verður að fylgja, og hvort notuð erlendis frá kemur til greina'} /></label>
              <Contact err={err} />
              <div className="acts"><Btn type="submit" label={tab === 'selja' ? 'Skrá vélina' : 'Skrá á óskalista'} tone="red" /></div>
            </form>
          )}
          <aside className="aside">
            <h3>{tab === 'selja' ? 'Það sem þarf að koma fram' : 'Vélfang leitar'}</h3>
            <p>{tab === 'selja' ? 'Allar helstu upplýsingar um vélina, myndir af henni og nafn, heimilisfang og símanúmer seljanda.' : 'Vélfang hefur flutt inn notaðar vélar fyrir viðskiptavini, til dæmis kornþreskivélar, dráttarvélar, vinnuvélar og vörubíla, og annast líka útflutning á vélum.'}</p>
            <Frame p={IMG.schaffer} sizes="(min-width: 900px) 36vw, 100vw" />
          </aside>
        </div>
      </div>
    </div>
  )
}

function WarrantyPage() {
  return (
    <div className="vf-page">
      <div className="wrap">
        <Intro kick="Þjónusta" title={['Ábyrgðarskilmálar']} lede={WARRANTY.lead} />
        <div className="doc">
          <div><h2>Það sem ábyrgðin nær yfir</h2><ul style={{ marginTop: 14 }}>{WARRANTY.covers.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div><h2>Það sem hún nær ekki yfir</h2><ul style={{ marginTop: 14 }}>{WARRANTY.excludes.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div><h2>Ábyrgð fellur niður ef</h2><ul style={{ marginTop: 14 }}>{WARRANTY.voids.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <p className="callout">{WARRANTY.maker}</p>
          <p>{WARRANTY.help}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Btn to="verkstaedi" label="Tilkynna bilun" tone="red" /><Btn to="livelink" label="JCB LiveLink" tone="line" /></div>
        </div>
      </div>
    </div>
  )
}

function StaffPage() {
  const [b, setB] = useState<BranchKey | ''>('')
  const [d, setD] = useState<Dept | ''>('')
  const list = STAFF.filter((p) => (!b || p.branch === b) && (!d || p.dept === d))
  return (
    <div className="vf-page">
      <div className="wrap">
        <Intro kick="Fyrirtækið" title={['Starfsfólk']} lede="Fámenn en öflug liðsheild með mikla samanlagða reynslu af bú- og vinnuvélum. Hvert netfang hér virkar." />
        <div className="sfilters">
          <div className="fgroup"><span>Staður</span><button type="button" className="chip" aria-pressed={!b} onClick={() => setB('')}>Allir</button>{BRANCHES.map((x) => <button key={x.key} type="button" className="chip" aria-pressed={b === x.key} onClick={() => setB(x.key)}>{x.name} <span className="muted num" style={{ marginLeft: 4 }}>{x.staff}</span></button>)}</div>
          <div className="fgroup"><span>Deild</span><button type="button" className="chip" aria-pressed={!d} onClick={() => setD('')}>Allar</button>{DEPTS.map((x) => <button key={x.key} type="button" className="chip" aria-pressed={d === x.key} onClick={() => setD(x.key)}>{x.label}</button>)}</div>
        </div>
        <p className="fcount num" role="status" style={{ marginBottom: 14 }}>{list.length} {list.length === 1 ? 'starfsmaður' : 'starfsmenn'}</p>
        <ul className="team" role="list">
          {list.map((p) => (
            <li key={p.key} className="person">
              <img src={staffPhoto(p)} alt="" loading="lazy" width={64} height={80} />
              <b>{p.name}</b>
              <span className="ro">{p.role}{b ? '' : ` · ${BRN[p.branch]}`}</span>
              <span className="ct">
                {p.phone && <a href={`tel:${telOf(p.phone)}`} aria-label={`Hringja í ${p.name}, ${p.phone}`}><Phone size={17} aria-hidden="true" /></a>}
                {p.email && <a href={mailHref(p.email)} aria-label={`Senda ${p.name} póst, ${p.email}`}><Mail size={17} aria-hidden="true" /></a>}
              </span>
              {(p.phone || p.email) && <span className="em num">{[p.phone, p.email].filter(Boolean).join(' · ')}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function BranchesPage() {
  return (
    <div className="vf-page" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <Intro kick="Fyrirtækið" title={['Útibú og kort']} lede={`${CONTACT.summary} Á Gylfaflöt 32 síðan 2006, á Akureyri síðan 2006 og á Selfossi síðan í maí 2026.`} />
      </div>
      <Network page />
    </div>
  )
}

function BrandsPage() {
  return (
    <div className="vf-page" style={{ paddingBottom: 0 }}>
      <div className="wrap"><Intro kick="Umboðin" title={['21 framleiðandi,', 'eitt hús']} lede="JCB, Fendt, CLAAS, Kuhn, Kverneland, Strautmann og fimmtán til viðbótar. Sjáðu hvað Vélfang segir um hvert merki og hvað er á lager." /></div>
      <BrandIndex full />
    </div>
  )
}

function BrandPage({ k }: { k: string }) {
  const b: Brand | undefined = brandByKey(k)
  if (!b) return <NotFound />
  const ms = MACHINES.filter((m) => m.brandKey === b.key)
  return (
    <div className="vf-page">
      <div className="wrap">
        <div className="bhero">
          <Intro crumb={{ to: 'umbod', label: 'Öll umboðin' }} kick={b.since ? `Umboð síðan ${b.since}` : b.fields.length ? FIELDS.filter((f) => b.fields.includes(f.key)).map((f) => f.label).join(' · ') : 'Umboð Vélfangs'} title={[b.name]} lede={b.line} />
          <div className="blogo" data-open="">{b.logo ? <img src={A(`logos/${b.logo}`)} alt={`${b.name} merkið`} /> : <span>{b.name}</span>}</div>
        </div>
        <div className="doc" style={{ maxWidth: 820 }}>
          {b.text?.map((t) => <p key={t}>{t}</p>)}
          {!b.text && <p className="muted">Vélfang er með umboð fyrir {b.name} á Íslandi. Sölumenn segja þér hvað er í boði og hvað er á leiðinni.</p>}
          <p><a className="tlink" href={b.site} target="_blank" rel="noopener">{b.siteLabel ?? `Vefur ${b.name}`} <ArrowRight size={15} aria-hidden="true" /></a></p>
        </div>
        <div style={{ marginTop: 56 }}>
          <h2 data-chars="">{ms.length ? `${b.name} á lager` : 'Ekkert á lager núna'}</h2>
          {ms.length ? <ul className="grid" style={{ marginTop: 32 }} data-items="">{ms.map((m) => <li key={m.id}><MachineCard x={m} /></li>)}</ul>
            : <p className="muted" style={{ marginTop: 16, maxWidth: '52ch' }}>Í söluskránni hér er engin {b.name} vél. Sölumenn panta eftir óskum og vita hvað er á leiðinni.</p>}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 32 }}><Btn to="tilbod" label={`Tilboð í ${b.name}`} tone="red" /><Btn to="verkstaedi" label="Bóka verkstæði" tone="line" /></div>
        </div>
      </div>
    </div>
  )
}

function NewsPage({ slug }: { slug: string }) {
  const n = NEWS.find((x) => x.slug === slug)
  if (!n) return <NotFound />
  return (
    <div className="vf-page">
      <div className="wrap">
        <Intro crumb={{ to: '', label: 'Forsíða' }} kick={n.date} title={[n.title]} lede={n.lead} />
        <figure style={{ maxWidth: 1100, marginBottom: 40 }}><Frame p={n.img} sizes="(min-width: 1100px) 1100px, 100vw" ratio="3 / 2" /></figure>
        <div className="doc">{n.body.map((t) => <p key={t}>{t}</p>)}</div>
        <div style={{ marginTop: 48, display: 'grid', gap: 0, maxWidth: 760, borderTop: '2px solid var(--ink)' }}>
          {NEWS.filter((x) => x.slug !== slug).map((x) => <Link key={x.slug} to={to(`frettir/${x.slug}`)} style={{ padding: '16px 0', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', gap: 16 }}><b style={{ fontWeight: 600 }}>{x.title}</b><span className="muted num">{x.date}</span></Link>)}
        </div>
      </div>
    </div>
  )
}

function InboxPage() {
  const [mine, setMine] = useState<Request[]>(() => loadRequests())
  const [ok, setOk] = useState<Record<string, boolean>>({})
  const all = [...mine, ...SAMPLE_REQUESTS]
  const fmt = (iso: string) => { const d = new Date(iso); return `${d.getUTCDate()}.${d.getUTCMonth() + 1}. kl. ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}` }
  return (
    <div className="vf-page vf-inbox">
      <div className="wrap">
        <div className="ibar" role="status"><span><b>Afgreiðsla Vélfangs</b> · beiðnir af vefnum, allir þrír staðir</span><span className="num">{all.filter((r) => r.status === 'ný' && !ok[r.id]).length} nýjar</span></div>
        <Intro title={['Beiðnir dagsins']} lede="Hver beiðni lendir hjá réttum manni eftir tegund og stað: verkstæðið á Selfossi fær Selfossbókanir, Akureyri sínar, varahlutir sínar." />
        <table>
          <thead><tr><th>Númer</th><th>Tegund</th><th>Beiðni</th><th>Staður</th><th>Fer til</th><th>Hver</th><th>Barst</th><th>Staða</th><th>Aðgerð</th></tr></thead>
          <tbody>
            {all.map((r) => {
              const done = r.status === 'staðfest' || ok[r.id]
              const mail = r.contact.split(', ').find((c) => c.includes('@'))
              const tel = r.contact.split(', ').find((c) => !c.includes('@'))
              return (
                <tr key={r.id}>
                  <td className="num">{r.id}</td>
                  <td><span className="kind">{KIND_LABEL[r.kind]}</span></td>
                  <td>{r.title}<br /><small>{r.when}{r.detail ? ` · ${r.detail}` : ''}</small></td>
                  <td>{BRN[r.branch]}</td>
                  <td><small>{routeTo(r.kind, r.branch)}</small></td>
                  <td>{r.who}<br /><small>{r.contact}</small></td>
                  <td className="num">{fmt(r.at)}</td>
                  <td><span className={`st${done ? '' : ' new'}`}><i aria-hidden="true" />{done ? 'Staðfest' : 'Ný'}</span></td>
                  <td><div className="ia">{!done && <button type="button" onClick={() => setOk((c) => ({ ...c, [r.id]: true }))}>Staðfesta</button>}{tel && <a href={`tel:${tel.replace(/\s/g, '')}`}>Hringja</a>}{mail && <a href={`mailto:${mail}`}>Svara</a>}</div></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="inote">Frumgerð af starfsmannahlið. Beiðnir merktar VF-S og „Sýnishorn“ eru tilbúin dæmi; hinar eru þær sem þú sendir sjálf(ur) á þessum vef í þessum vafra. Í raunverulegu kerfi fer hver beiðni líka í tölvupóst á netfangið í dálkinum „Fer til“. {mine.length > 0 && <button type="button" style={{ textDecoration: 'underline' }} onClick={() => { try { sessionStorage.removeItem('vf-requests') } catch { /* */ } setMine([]) }}>Hreinsa mínar beiðnir</button>}</p>
      </div>
    </div>
  )
}

function PrivacyPage() {
  return (
    <div className="vf-page">
      <div className="wrap">
        <Intro kick="Persónuvernd" title={['Hvað er geymt,', 'og hve lengi']} />
        <div className="doc">
          <p>Vélfang ehf., kt. {CONTACT.kt}, Gylfaflöt 32, 112 Reykjavík, er ábyrgðaraðili. Formin á vefnum safna aðeins því sem þarf til að svara beiðninni: nafni, síma, netfangi ef þú gefur það upp, upplýsingum um vélina og því sem þú skrifar sjálf(ur).</p>
          <p>Upplýsingarnar eru notaðar til að afgreiða beiðnina og ekki í annað. Bókunum er eytt þegar verkinu lýkur og fyrirspurnum þegar þeim hefur verið svarað. Skráning á áramótatilboð Kuhn er geymd þar til þú afskráir þig.</p>
          <p>Vefurinn notar engar auglýsinga- eða rakningarkökur, svo hann þarf engan kökuborða. Þú getur beðið um afrit af gögnum um þig eða látið eyða þeim með því að skrifa á {CONTACT.email}.</p>
          <p className="callout">Frumgerð: textinn er tillaga sem Vélfang þarf að yfirfara. Í frumgerðinni er ekkert sent; formin geyma beiðnir aðeins í þínum vafra.</p>
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return <div className="vf-page"><div className="wrap"><Intro title={['Síðan fannst ekki.']} lede="Hlekkurinn er úreltur eða skakkt skrifaður." /><Btn to="" label="Á forsíðu" tone="ink" /></div></div>
}

/* ── the shell ──────────────────────────────────────────────────────────── */

const TITLES: Record<string, [string, string]> = {
  '': ['Vélfang | Landbúnaðar- og vinnuvélar, varahlutir og verkstæði', 'Vélfang ehf. selur og þjónustar nýjar og notaðar vélar fyrir landbúnað, verktaka, golfvelli og sveitarfélög. JCB, Fendt, CLAAS, Kuhn og 17 önnur umboð. Verkstæði í Reykjavík, á Akureyri og Selfossi.'],
  velar: ['Vélar á lager | Vélfang', 'Nýjar og notaðar vélar hjá Vélfangi með verði án vsk., árgerð, notkun og staðsetningu. Síaðu eftir merki, flokki og útibúi.'],
  umbod: ['Umboðin | Vélfang', 'Vélfang er með umboð fyrir 21 framleiðanda: JCB, Fendt, CLAAS, Kuhn, Kverneland, Strautmann og fleiri.'],
  verkstaedi: ['Bóka verkstæði | Vélfang', 'Bókaðu tíma á verkstæði Vélfangs í Reykjavík, á Akureyri eða Selfossi.'],
  varahlutir: ['Varahlutir | Vélfang', 'Varahlutir í vélar Vélfangs og flestar tegundir dráttarvéla. Beiðni með fastnúmeri eða framleiðslunúmeri.'],
  tilbod: ['Fá tilboð | Vélfang', 'Tilboð í vélar og tæki fyrir bú, verktaka og sveitarfélög.'],
  skodun: ['Bóka skoðun | Vélfang', 'Bókaðu skoðun á vél þar sem hún stendur.'],
  selja: ['Selja eða leita | Vélfang', 'Skráðu notaða vél til sölu eða á óskalista hjá Vélfangi.'],
  livelink: ['JCB LiveLink | Vélfang', 'JCB LiveLink: vinnustundir, staðsetning og villukóðar úr fjarlægð. Sæktu um aðgang.'],
  abyrgd: ['Ábyrgðarskilmálar | Vélfang', 'Almennir ábyrgðarskilmálar Vélfangs ehf.'],
  starfsfolk: ['Starfsfólk | Vélfang', '28 starfsmenn Vélfangs í Reykjavík, á Akureyri og Selfossi, með beinum númerum og netföngum.'],
  utibu: ['Útibú og kort | Vélfang', 'Gylfaflöt 32 í Reykjavík, Óseyri 8 á Akureyri og Gagnheiði 32 á Selfossi.'],
  frettir: ['Fréttir | Vélfang', 'Fréttir frá Vélfangi.'],
  afgreidsla: ['Afgreiðsla | Vélfang', 'Starfsmannahlið: beiðnir af vefnum.'],
  personuvernd: ['Persónuvernd | Vélfang', 'Hvaða upplýsingum vefur Vélfangs safnar og hvernig þær eru notaðar.'],
}

export default function VelfangPage() {
  const root = useRef<HTMLDivElement>(null)
  const loc = useLocation()
  const sub = loc.pathname.replace(/^.*?\/preview\/velfang\/?/, '').replace(/\/+$/, '')
  const [menu, setMenu] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const chat = useRef<ChatEl | null>(null)
  const page = sub.split('/')[0]
  const isHome = sub === ''
  const formPage = useRef(false)
  formPage.current = ['verkstaedi', 'varahlutir', 'tilbod', 'skodun', 'selja', 'livelink', 'afgreidsla'].includes(page)

  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    const [t, d] = TITLES[page] ?? TITLES['']
    const m = page === 'velar' && sub.includes('/') ? machineById(sub.split('/')[1]) : undefined
    const b = page === 'umbod' && sub.includes('/') ? brandByKey(sub.split('/')[1]) : undefined
    const n = page === 'frettir' ? NEWS.find((x) => x.slug === sub.split('/')[1]) : undefined
    document.title = m ? `${machineName(m)} | Vélfang` : b ? `${b.name} | Vélfang` : n ? `${n.title} | Vélfang` : t
    document.documentElement.lang = 'is'
    setThemeColor(GRAPHITE)
    const a = setMetaDescription(m ? `${machineName(m)} hjá Vélfangi: ${kr(m.price)} án vsk.${m.year ? `, árgerð ${m.year}` : ''}. Stendur ${BRN_AT[m.region]}.` : n ? n.lead : d)
    const nb = setNoindex(true)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => { document.title = prevTitle; document.documentElement.lang = prevLang; a(); nb(); ld.remove() }
  }, [sub, page])

  useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 60_000); return () => window.clearInterval(t) }, [])

  useEffect(() => {
    let el: ChatEl | null = null
    let alive = true
    import('./vendor/sndr-chat.js').then(() => {
      if (!alive || !root.current) return
      el = document.createElement('sndr-chat') as ChatEl
      el.setAttribute('name', 'Vélfang')
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

  useEffect(() => {
    setMenu(false)
    if (loc.hash) { window.setTimeout(() => goTo(decodeURIComponent(loc.hash.slice(1))), 80); return }
    if (pageLenis) pageLenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0)
  }, [loc.pathname, loc.hash])

  /* chrome: hide on the way down, show on the way up */
  const chromeRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const chrome = chromeRef.current!
    let lastY = window.scrollY
    let raf = 0
    const tick = () => {
      raf = 0
      const y = window.scrollY
      chrome.dataset.solid = y > 20 ? '1' : '0'
      if (root.current) root.current.dataset.sticky = !formPage.current && y > window.innerHeight * 0.6 ? '1' : '0'
      if (!document.documentElement.classList.contains('vf-menu') && !chrome.querySelector('.dd[data-open="1"]')) {
        if (y > 320 && y > lastY + 4) chrome.dataset.hide = '1'
        else if (y < lastY - 4 || y <= 320) chrome.dataset.hide = '0'
      }
      lastY = y
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])

  /* menu */
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('vf-menu', menu)
    if (!menu) return
    pageLenis?.stop()
    const opener = document.activeElement as HTMLElement | null
    const bg = root.current ? [...root.current.children].filter((c) => !c.classList.contains('vf-menu-panel') && c.tagName !== 'STYLE') as HTMLElement[] : []
    bg.forEach((c) => c.setAttribute('inert', ''))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    document.addEventListener('keydown', onKey)
    const panel = menuRef.current
    panel?.querySelector<HTMLElement>('a,button')?.focus()
    if (panel && !still()) {
      gsap.fromTo(panel, { clipPath: PEAK_WIDE }, { clipPath: PEAK_FULL, duration: 0.45, ease: 'vf' })
      gsap.fromTo(panel.querySelectorAll('[data-mi]'), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.04, delay: 0.15, ease: 'vf' })
    }
    return () => { document.removeEventListener('keydown', onKey); pageLenis?.start(); html.classList.remove('vf-menu'); bg.forEach((c) => c.removeAttribute('inert')); opener?.focus?.() }
  }, [menu])

  /* Lenis, once, fine pointers only */
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

  /* motion per route: the staged opening, then position-tied reveals */
  useLayoutEffect(() => {
    const el = root.current!
    const main = el.querySelector<HTMLElement>('main')!
    const reduce = still()
    let ctx: gsap.Context | null = null
    let alive = true
    const splits: SplitText[] = []
    const build = () => { if (!alive) return; ctx = gsap.context(() => {
      if (reduce) { main.querySelectorAll<HTMLElement>('[data-prog]').forEach((p) => { p.style.transform = 'scaleX(1)' }); return }
      const desk = window.matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)').matches
      const isHomeRoute = !!main.querySelector('.vf-hero')
      const travel = isTouch() ? 12 : 22

      /* the opening: masked lines, the photo through the peak, body, buttons */
      const open = gsap.timeline({ defaults: { ease: 'power3.out' } })
      const intro = main.querySelector<HTMLElement>('.vf-hero, .intro, .dside') ?? main
      const lines = intro.querySelectorAll('[data-line]')
      const opens = main.querySelectorAll('[data-open]')
      if (lines.length) open.from(lines, { yPercent: 112, duration: 0.72, stagger: 0.08 }, 0.12)
      const hmask = main.querySelector<HTMLElement>('[data-hmask]')
      if (hmask) {
        open.fromTo(hmask, { clipPath: PEAK_SMALL }, { clipPath: PEAK_FULL, duration: 1.25, ease: 'vf' }, 0.3)
        open.fromTo(hmask.querySelector('img'), { scale: 1.14 }, { scale: 1, duration: 1.5, ease: 'vf' }, 0.3)
      }
      if (opens.length) open.from(opens, { y: travel, opacity: 0, duration: 0.55, stagger: 0.07 }, 0.4)
      const finish = (e: KeyboardEvent) => { if (e.key === 'Tab') open.progress(1) }
      document.addEventListener('keydown', finish)

      /* titles: masked characters by position */
      main.querySelectorAll<HTMLElement>('[data-chars]').forEach((t) => {
        splits.push(new SplitText(t, { type: 'chars,words', charsClass: 'ch', wordsClass: 'wd', mask: 'chars', autoSplit: true,
          onSplit: (self) => gsap.fromTo(self.chars, { yPercent: 105 }, { yPercent: 0, ease: 'vf', duration: 0.8, stagger: 0.016, scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 82%', scrub: true } }) }))
      })
      main.querySelectorAll<HTMLElement>('[data-fade]').forEach((t) => {
        if (intro.contains(t)) return
        gsap.fromTo(t, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, ease: 'none', scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 84%', scrub: true } })
      })
      /* every frame: the peak rises into the rectangle, tied to position (reversible) */
      main.querySelectorAll<HTMLElement>('[data-media]').forEach((f) => {
        if (intro.contains(f) && intro !== main) return
        const img = f.querySelector('img')
        const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 100%', end: 'top 62%', scrub: true } })
        tl.fromTo(f, { clipPath: PEAK_WIDE }, { clipPath: PEAK_FULL, ease: 'vf', duration: 1 }, 0)
        if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'vf', duration: 1 }, 0)
      })
      main.querySelectorAll<HTMLElement>('[data-par]').forEach((p) => {
        gsap.fromTo(p, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: p.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      main.querySelectorAll<HTMLElement>('[data-items]').forEach((g) => {
        gsap.fromTo(g.children, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'vf', duration: 0.8, stagger: 0.06, scrollTrigger: { trigger: g, start: 'top 100%', end: 'top 78%', scrub: true } })
      })
      if (isHomeRoute) main.querySelectorAll<HTMLElement>('[data-btn]').forEach((b) => {
        if (intro.contains(b)) return
        gsap.fromTo(b, { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', ease: 'vf', scrollTrigger: { trigger: b, start: 'top 99%', end: 'top 84%', scrub: true } })
      })
      const revealFocused = (e: FocusEvent) => {
        const t = e.target as HTMLElement
        ScrollTrigger.getAll().forEach((st) => { const tr = st.trigger as HTMLElement | null; if (tr && (tr === t || tr.contains(t) || t.contains(tr))) st.animation?.progress(1) })
      }
      main.addEventListener('focusin', revealFocused)

      /* hero: the yard sinks a little as the words lift (desktop) */
      const hp = main.querySelector<HTMLElement>('[data-hp]')
      if (hp && desk) gsap.fromTo(hp, { yPercent: 0 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: hp.parentElement, start: 'top 60%', end: 'bottom top', scrub: true } })

      /* the network chapter: the map stays (CSS sticky) while each branch card drops its peak marker
         and adds its people to the count, tied to the card's position, reversible. Phones show all. */
      const net = main.querySelector<HTMLElement>('[data-net]')
      if (net && desk) {
        const pins = [...net.querySelectorAll<SVGGElement>('[data-pin]')]
        const cards = [...net.querySelectorAll<HTMLElement>('[data-card]')]
        const staff = net.querySelector<HTMLElement>('[data-staff]')
        const sites = net.querySelector<HTMLElement>('[data-sites]')
        const counts = [20, 6, 2]
        const st = { n: 0, s: 0 }
        const SITES = ['engum stað', 'einum stað', 'tveimur stöðum', 'þremur stöðum']
        const paint = () => { if (staff) staff.textContent = String(Math.round(st.n)); if (sites) sites.textContent = SITES[Math.round(st.s)] }
        paint()
        cards.forEach((c, i) => {
          const pin = pins[i]
          const tl = gsap.timeline({ scrollTrigger: { trigger: c, start: 'top 78%', end: 'top 42%', scrub: 0.4 } })
          tl.fromTo(pin.querySelector('[data-drop]'), { y: -70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'power3.out', duration: 0.6 }, 0)
            .fromTo(pin.querySelector('[data-gnd]'), { scaleX: 0, transformOrigin: '50% 50%' }, { scaleX: 1, ease: 'vf', duration: 0.5 }, 0.4)
            .fromTo(pin.querySelector('text'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.55)
            .to(st, { n: counts.slice(0, i + 1).reduce((a, b) => a + b, 0), s: i + 1, duration: 0.4, ease: 'none', onUpdate: paint }, 0.45)
        })
        gsap.fromTo(net.querySelector('[data-prog]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: cards[0], start: 'top 78%', endTrigger: cards[cards.length - 1], end: 'top 42%', scrub: true } })
      } else if (net) {
        const p = net.querySelector<HTMLElement>('[data-prog]'); if (p) p.style.transform = 'scaleX(1)'
      }
      return () => { document.removeEventListener('keydown', finish); main.removeEventListener('focusin', revealFocused) }
    }, el); ScrollTrigger.refresh() }
    if (!document.fonts) build()
    else Promise.all(['400 16px VfT', '600 16px VfT', '700 16px VfD'].map((f) => document.fonts.load(f))).then(() => document.fonts.ready).then(build, build)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => { alive = false; window.removeEventListener('load', refresh); ctx?.revert(); splits.forEach((s) => s.revert()) }
  }, [loc.pathname])

  const s = openState(now)
  let body: ReactNode
  const seg = sub.split('/')
  if (isHome) body = <Home />
  else if (page === 'velar') body = seg[1] ? <DetailPage id={seg[1]} /> : <StockPage />
  else if (page === 'umbod') body = seg[1] ? <BrandPage k={seg[1]} /> : <BrandsPage />
  else if (page === 'verkstaedi') body = <WorkshopPage />
  else if (page === 'varahlutir') body = <PartsPage />
  else if (page === 'tilbod') body = <QuotePage />
  else if (page === 'skodun') body = <ViewingPage />
  else if (page === 'selja') body = <SellPage />
  else if (page === 'livelink') body = <LiveLinkPage />
  else if (page === 'abyrgd') body = <WarrantyPage />
  else if (page === 'starfsfolk') body = <StaffPage />
  else if (page === 'utibu') body = <BranchesPage />
  else if (page === 'frettir' && seg[1]) body = <NewsPage slug={seg[1]} />
  else if (page === 'afgreidsla') body = <InboxPage />
  else if (page === 'personuvernd') body = <PrivacyPage />
  else body = <NotFound />

  return (
    <div ref={root} className={`vf${menu ? ' menu-open' : ''}`} id="efst" lang="is">
      <style>{CSS}</style>
      <PreviewChrome company={company} />
      <a className="skip" href="#efni">Fara í efni</a>

      <div className="vf-chrome" ref={chromeRef} data-hide="0" data-solid="0">
        <div className="bar">
          <div className="in">
            <a href={`tel:${CONTACT.tel}`}><Phone size={13} aria-hidden="true" />{CONTACT.phone}</a>
            <a href={mailHref(CONTACT.email)} className="hide-s"><Mail size={13} aria-hidden="true" />{CONTACT.email}</a>
            <span className={`st${s.open ? ' on' : ''}`}><i aria-hidden="true" />Gylfaflöt: {s.text.toLowerCase()}</span>
            <span className="br">{BRANCHES.map((b) => <Link key={b.key} to={to('utibu')}><MapPin size={13} aria-hidden="true" />{b.name}</Link>)}</span>
          </div>
        </div>
        <header className="hdr"><Header sub={sub} onMenu={() => setMenu(true)} /></header>
      </div>

      {menu && (
        <div className="vf-menu-panel" ref={menuRef} role="dialog" aria-modal="true" aria-label="Valmynd" data-lenis-prevent="">
          <div className="mtop">
            <img src={A('velfang-logo-white.svg')} alt="Vélfang" width={275} height={50} />
            <button type="button" className="mx" onClick={() => setMenu(false)} aria-label="Loka valmynd"><X size={26} strokeWidth={1.8} aria-hidden="true" /></button>
          </div>
          <div className="mgroups">
            {NAV.map((g) => (
              <nav key={g.key} className="mg" aria-label={g.label} data-mi="">
                <p>{g.label}</p>
                {g.items.map((i) => <Link key={i.k} to={to(i.k)} aria-current={sub === i.k ? 'page' : undefined} onClick={() => setMenu(false)}>{i.label}</Link>)}
              </nav>
            ))}
          </div>
          <div className="mfoot" data-mi="">
            <a className="big num" href={`tel:${CONTACT.tel}`}><Phone size={20} aria-hidden="true" />{CONTACT.phone}</a>
            <button type="button" onClick={openChat}><MessageCircle size={17} aria-hidden="true" />Spyrja aðstoðarmanninn</button>
            <p>Gylfaflöt: mánudaga til fimmtudaga kl. 8-17, föstudaga kl. 8-16</p>
          </div>
        </div>
      )}

      <main id="efni" key={loc.pathname}>{body}</main>

      <footer className="vf-foot on-dark">
        <div className="wrap">
          <div className="ftop">
            <div className="fbrand">
              <img src={A('velfang-logo-white.svg')} alt="Vélfang ehf." width={275} height={50} />
              <p className="sl">{CONTACT.slogan}.</p>
              <p>{CONTACT.summary}</p>
            </div>
            <div className="fbr">
              {BRANCHES.map((b) => (
                <div key={b.key}>
                  <h3>{b.name}</h3>
                  <p>{b.street}, {b.post}</p>
                  <a className="num" href={`tel:${b.tel}`}>Sími {b.phone}</a>
                  <a href={mailHref(b.key === 'rvk' ? CONTACT.email : b.email)}>{b.key === 'rvk' ? CONTACT.email : b.email}</a>
                  <p>{b.hours ? 'Mán.-fim. 8-17, fös. 8-16' : 'Hringdu á undan'}</p>
                </div>
              ))}
            </div>
          </div>
          <nav className="fnav" aria-label="Neðst á síðu">
            {[['velar', 'Vélar á lager'], ['umbod', 'Umboðin'], ['verkstaedi', 'Verkstæði'], ['varahlutir', 'Varahlutir'], ['starfsfolk', 'Starfsfólk'], ['utibu', 'Útibú']].map(([k, l]) => <Link key={k} to={to(k)}>{l}</Link>)}
          </nav>
          <div className="flegal">
            <p>{CONTACT.legal} · Kt. {CONTACT.kt} · VSK nr. {CONTACT.vsk} · <a href={CONTACT.facebook} target="_blank" rel="noopener">Facebook</a> · <Link to={to('abyrgd')}>Ábyrgðarskilmálar</Link> · <Link to={to('personuvernd')}>Persónuvernd</Link> · <Link to={to('afgreidsla')}>Afgreiðsla</Link></p>
            <SndrBadge />
          </div>
          <p className="proto">Frumgerð: hugmynd að nýjum vef, ekki vefur Vélfangs. Upplýsingar, myndir og vélar eru af velfang.is og söluskrá Vélfangs á velasolur.is, sótt 9. október 2026; verð geta breyst. Merkið er endurteiknað eftir merkinu á velfang.is. Formin senda ekkert; beiðnir eru geymdar í þínum vafra. Aðstoðarmaðurinn svarar aðeins út frá því sem stendur á þessum vef.</p>
        </div>
      </footer>

      <div className="vf-sticky" aria-label="Flýtileiðir">
        <a href={`tel:${CONTACT.tel}`}><Phone size={16} aria-hidden="true" />Hringja</a>
        <Link to={to('velar')}>Vélar</Link>
        <button type="button" onClick={openChat}><MessageCircle size={16} aria-hidden="true" />Spyrja</button>
      </div>
    </div>
  )
}
