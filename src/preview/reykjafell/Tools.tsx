import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { C, Btn, Label, ask, step, usePanelFocus } from './ui'
import {
  CONTACT, FLOKKAR, KLASAR, SKILMALAR, STARFSFOLK, THJONUSTA, VIDBURDIR, VORUR, starfsmadur, vorumynd,
  type Starfsmadur, type Vara,
} from './data'

/* The systems on this page run only on Reykjafell's own records: the products,
   stock counts and datasheets their product pages publish, the events their
   registration forms carry, the people their staff page names and the answers
   their news already gave. Nothing is sent from the prototype: every request
   ends as a finished e-mail to the person responsible, or a copy. */

/* ── shared state: the material list and the one request ───────────────── */

export type Tab = 'tilbod' | 'adgangur' | 'thjonusta'
export interface Tengilidur { nafn: string; fyrirtaeki: string; simi: string; netfang: string; athugasemd: string }
export interface Adgangur { kennitala: string; tegund: string; notendur: number }
export interface Mal { lina: string; sku: string; lysing: string }
export interface Tilbod { verk: string; afhending: 'RVK' | 'AK' | 'senda' }
export interface Lina { texti: string; sku: string | null; magn: number; vissa: 'viss' | 'liklegt' | 'ekki' }

interface Ctx {
  listi: Lina[]
  setListi: (l: Lina[]) => void
  baeta: (sku: string, magn?: number) => void
  fjarlaegja: (i: number) => void
  tab: Tab
  setTab: (t: Tab) => void
  tengilidur: Tengilidur
  setTengilidur: (p: Partial<Tengilidur>) => void
  adgangur: Adgangur
  setAdgangur: (p: Partial<Adgangur>) => void
  mal: Mal
  setMal: (p: Partial<Mal>) => void
  tilbod: Tilbod
  setTilbod: (p: Partial<Tilbod>) => void
  senda: (t: Tab) => void
}
const BriefCtx = createContext<Ctx | null>(null)
export function useBrief() {
  const c = useContext(BriefCtx)
  if (!c) throw new Error('useBrief outside BriefProvider')
  return c
}

const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth') as ScrollBehavior

// Route changes unmount the provider. Keep the unfinished draft in memory only;
// contact details are never written to browser storage.
let briefDraft: Pick<Ctx, 'listi' | 'tab' | 'tengilidur' | 'adgangur' | 'mal' | 'tilbod'> | undefined

export function BriefProvider({ children }: { children: ReactNode }) {
  const [listi, setListi] = useState<Lina[]>(() => briefDraft?.listi ?? [])
  const [tab, setTab] = useState<Tab>(() => briefDraft?.tab ?? 'tilbod')
  const [tengilidur, setT] = useState<Tengilidur>(() => briefDraft?.tengilidur ?? { nafn: '', fyrirtaeki: '', simi: '', netfang: '', athugasemd: '' })
  const [adgangur, setA] = useState<Adgangur>(() => briefDraft?.adgangur ?? { kennitala: '', tegund: 'Rafverktaki', notendur: 1 })
  const [mal, setM] = useState<Mal>(() => briefDraft?.mal ?? { lina: THJONUSTA[0].id, sku: '', lysing: '' })
  const [tilbod, setTb] = useState<Tilbod>(() => briefDraft?.tilbod ?? { verk: '', afhending: 'RVK' })
  useEffect(() => { briefDraft = { listi, tab, tengilidur, adgangur, mal, tilbod } }, [listi, tab, tengilidur, adgangur, mal, tilbod])
  const baeta = useCallback((sku: string, magn = 1) => setListi((l) => {
    const i = l.findIndex((x) => x.sku === sku)
    if (i >= 0) return l.map((x, n) => (n === i ? { ...x, magn: x.magn + magn } : x))
    const v = VORUR.find((x) => x.sku === sku)
    return [...l, { texti: v ? `${v.name}${v.model ? ` : ${v.model}` : ''}` : sku, sku, magn, vissa: 'viss' }]
  }), [])
  const fjarlaegja = useCallback((i: number) => setListi((l) => l.filter((_, n) => n !== i)), [])
  const senda = useCallback((t: Tab) => {
    setTab(t)
    document.querySelector('#hafa-samband')?.scrollIntoView({ behavior: smooth(), block: 'start' })
  }, [])
  const value = useMemo<Ctx>(() => ({
    listi, setListi, baeta, fjarlaegja, tab, setTab,
    tengilidur, setTengilidur: (p) => setT((o) => ({ ...o, ...p })),
    adgangur, setAdgangur: (p) => setA((o) => ({ ...o, ...p })),
    mal, setMal: (p) => setM((o) => ({ ...o, ...p })),
    tilbod, setTilbod: (p) => setTb((o) => ({ ...o, ...p })),
    senda,
  }), [listi, baeta, fjarlaegja, tab, tengilidur, adgangur, mal, tilbod, senda])
  return <BriefCtx.Provider value={value}>{children}</BriefCtx.Provider>
}

/* ── catalogue search: one scorer, shared by the finder, the list and the assistant ── */

export const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/þ/g, 'th').replace(/ð/g, 'd').replace(/æ/g, 'ae').replace(/ö/g, 'o')
const tight = (s: string) => norm(s).replace(/[^a-z0-9]/g, '')
const STOP = new Set(['fyrir', 'med', 'og', 'a', 'i', 'til', 'er', 'eru', 'stk', 'x', 'the', 'hvad', 'hvar', 'hja', 'ykkur', 'thid', 'eg', 'mig', 'vantar', 'leita', 'ad', 'um', 'af', 'sem'])
/* their own words for families, so "hleðslustöð" or "dyrasími" finds the line */
const ALIAS: Record<string, string[]> = {
  easee: ['hledslustod', 'hledsla', 'rafbil', 'charger', 'easee', 'hledslustodvar'],
  comelit: ['dyrasimi', 'dyrasima', 'dyrasimar', 'comelit', 'utistod', 'intercom'],
  ansell: ['lysing', 'lampi', 'lampar', 'ljos', 'led', 'spennir', 'neydarlysing', 'ansell'],
  plejd: ['snjall', 'snjallheimili', 'dimmir', 'bluetooth', 'plejd', 'husstjorn'],
  janitza: ['orkugaedi', 'orkumaelir', 'maelir', 'straumspennir', 'janitza', 'maelastod'],
  weidmuller: ['yfirspennuvorn', 'yfirspennuvar', 'eldingavorn', 'weidmuller', 'spd'],
  eaton: ['varaafl', 'ups', 'varaaflgjafi', 'eaton'],
  kyoritsu: ['maelitaeki', 'uttektarmaelir', 'kyoritsu', 'lan', 'tester'],
  kapall: ['jardstrengur', 'strengur', 'kapall', 'kv', 'jardstreng'],
}

export function leita(q: string, max = 6): { v: Vara; score: number }[] {
  const t = tight(q)
  if (!t) return []
  /* an exact SKU, model or supplier number wins outright */
  /* also per word, so "Er UT9260M til á Akureyri?" finds UT9260M */
  const toks = [t, ...q.split(/\s+/).map(tight).filter((w) => w.length >= 4)]
  const exact = VORUR.filter((v) => toks.some((w) => v.sku === w || (v.model && tight(v.model) === w) || (v.vendor && tight(v.vendor) === w)))
  if (exact.length) return exact.slice(0, max).map((v) => ({ v, score: 100 }))
  const words = norm(q).split(/[^a-z0-9.,/]+/).filter((w) => w.length > 1 && !STOP.has(w))
  if (!words.length) return []
  const out = VORUR.map((v) => {
    const hay = norm(`${v.name} ${v.model} ${v.brand} ${v.cats.join(' ')} ${v.tags.join(' ')} ${v.desc}`)
    const hayT = tight(`${v.name} ${v.model}`)
    let s = 0
    for (const w of words) {
      const wt = tight(w)
      if (wt.length > 3 && hayT.includes(wt)) s += 4
      else if (hay.includes(w)) s += 2
      if ((ALIAS[v.fam] ?? []).some((a) => a.startsWith(wt) || wt.startsWith(a))) s += 3
    }
    return { v, score: s / Math.max(1, words.length) }
  }).filter((x) => x.score >= 1.5).sort((a, b) => b.score - a.score || b.v.stock - a.v.stock)
  return out.slice(0, max)
}

export const fam = (id: string) => FLOKKAR.find((f) => f.id === id)
export const klasiFyrir = (famId: string) => KLASAR.find((k) => k.id === (fam(famId)?.klasi ?? '')) ?? KLASAR[3]

export function Lager({ v, compact }: { v: Vara; compact?: boolean }) {
  if (v.stock > 0) {
    return (
      <span className="rfl-stock in" title={`Lagerstaða ${v.stock} samkvæmt vörusíðu Reykjafells 19. október 2026`}>
        <i aria-hidden="true" />{v.stock} á lager{compact ? '' : ` · ${v.loc.map((l) => (l === 'AEY' ? 'AK' : l)).join(' og ')}`}
      </span>
    )
  }
  return <span className="rfl-stock out"><i aria-hidden="true" />Ekki á lager</span>
}

/* ── 1. the catalogue: a sentence finder over real products ─────────────── */

type Hvar = 'allt' | 'RVK' | 'AEY'
const HVAR: { id: Hvar; ord: string }[] = [
  { id: 'allt', ord: 'hvar sem er' },
  { id: 'RVK', ord: 'á lager í Reykjavík' },
  { id: 'AEY', ord: 'á lager á Akureyri' },
]

function Slot<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; ord: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <span className="rfl-slot">
      <select value={value} onChange={(e) => onChange(e.target.value as T)} aria-label={label}>
        {options.map((o) => <option key={o.id} value={o.id}>{o.ord}</option>)}
      </select>
      <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
    </span>
  )
}

export function Catalog() {
  const { baeta, listi } = useBrief()
  const [f, setF] = useState<string>('easee')
  const [hvar, setHvar] = useState<Hvar>('allt')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<Vara | null>(null)
  const [added, setAdded] = useState<string | null>(null)
  const opener = useRef<HTMLElement | null>(null)
  const keyboard = useRef(false)

  const syna = useMemo(() => {
    const base = q.trim() ? leita(q, 24).map((x) => x.v) : VORUR.filter((v) => v.fam === f)
    return base.filter((v) => hvar === 'allt' || (v.stock > 0 && v.loc.includes(hvar)))
  }, [f, hvar, q])
  const iListanum = (sku: string) => listi.find((l) => l.sku === sku)?.magn ?? 0

  const add = (v: Vara) => {
    baeta(v.sku)
    setAdded(v.sku)
    window.setTimeout(() => setAdded((a) => (a === v.sku ? null : a)), 1600)
  }
  const show = (v: Vara, e: React.MouseEvent<HTMLElement>) => {
    opener.current = e.currentTarget
    keyboard.current = e.detail === 0
    setOpen(v)
  }

  return (
    <div className="rfl-cat">
      <div className="rfl-finder" role="search">
        <p className="rfl-sentence">
          <span>Ég leita að</span>
          <Slot value={f} label="Vöruflokkur" options={FLOKKAR.map((x) => ({ id: x.id, ord: x.ord }))} onChange={(v) => { setF(v); setQ('') }} />
          <Slot value={hvar} label="Lagerstaða" options={HVAR} onChange={setHvar} />
        </p>
        <label className="rfl-search">
          <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path fillRule="evenodd" d="M7.07 12.27a5.2 5.2 0 1 0 0-10.4 5.2 5.2 0 0 0 0 10.4Zm4.1-.33a6.3 6.3 0 1 1 .88-.88l3.37 3.37-.88.88-3.37-3.37Z" fill="currentColor" /></svg>
          <span className="sr">Leita að vörunúmeri, gerð eða heiti</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Eða vörunúmer, gerð eða heiti…" autoComplete="off" spellCheck={false} enterKeyHint="search" />
        </label>
      </div>

      <p className="rfl-count" aria-live="polite">
        {syna.length} {syna.length === 1 ? 'vara' : 'vörur'}
        {q.trim() ? <> sem passa við „{q.trim()}“</> : <> í flokknum {fam(f)?.titill.toLowerCase()}</>}
        {hvar !== 'allt' ? <>, {HVAR.find((h) => h.id === hvar)?.ord}</> : null}
      </p>

      {syna.length ? (
        <ul className="rfl-grid-p">
          {syna.map((v, i) => (
            <li key={v.sku} className="rfl-rise" style={step(i % 4)}>
              <article className="rfl-pcard">
                <button type="button" className="shot" onClick={(e) => show(v, e)} aria-label={`Nánar: ${v.name}`} data-cursor="card">
                  <img src={vorumynd(v.sku)} alt="" loading="lazy" decoding="async" width={600} height={600} />
                </button>
                <p className="sku" translate="no"><span>{v.sku}</span>{v.brand ? <span>{v.brand}</span> : null}</p>
                <h3>{v.name}</h3>
                {v.model ? <p className="model" translate="no">{v.model}</p> : null}
                <div className="foot">
                  <Lager v={v} compact />
                  <button type="button" className={`addbtn${added === v.sku ? ' done' : ''}`} onClick={() => add(v)} aria-label={`Setja ${v.name} á efnislistann`}>
                    {added === v.sku ? 'Komið á listann' : iListanum(v.sku) ? `Á listanum (${iListanum(v.sku)})` : 'Á listann'}
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rfl-empty">
          <p>Engin vara í sýnishorninu passar. Í lifandi útgáfu leitar þetta í öllum vörulistanum.</p>
          <Btn href="#spyrja" variant="ghost" onClick={(e) => ask(q, e.detail === 0)}>Spyrja Reykjafell</Btn>
        </div>
      )}
      <p className="rfl-note">Sýnishorn: {VORUR.length} vörur úr vörulista Reykjafells með lagerstöðu eins og vörusíðurnar birtu hana 19. október 2026. Verð birtist fyrirtækjum í reikningsviðskiptum við innskráningu.</p>

      <ProductSheet v={open} keyboard={keyboard} onClose={() => { setOpen(null); opener.current?.focus({ preventScroll: true }) }} onAdd={add} />
    </div>
  )
}

/* a side sheet, not a modal page: it opens with the panel itself focused (never
   its first control) so no focus ring is painted on a tap, see _tools/focus-guard */
function ProductSheet({ v, keyboard, onClose, onAdd }: { v: Vara | null; keyboard: React.RefObject<boolean>; onClose: () => void; onAdd: (v: Vara) => void }) {
  const ref = useRef<HTMLDivElement | null>(null)
  usePanelFocus(!!v, ref, keyboard, onClose)
  useEffect(() => {
    if (!v) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [v])
  const k = v ? klasiFyrir(v.fam) : null
  const p = k ? starfsmadur(k.abyrgd) : null
  return (
    <div className={`rfl-sheet${v ? ' open' : ''}`} aria-hidden={!v}>
      <button type="button" className="scrim" tabIndex={-1} aria-hidden="true" onClick={onClose} />
      <div className="panel" role="dialog" aria-modal="true" aria-label={v ? v.name : 'Vara'} tabIndex={-1} ref={ref}>
        {v ? (
          <>
            <div className="top">
              <p className="sku"><span>Vörunr. {v.sku}</span>{v.vendor ? <span>Framl.nr. {v.vendor}</span> : null}</p>
              <button type="button" className="x" onClick={onClose} aria-label="Loka">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" /></svg>
              </button>
            </div>
            <div className="img"><img src={vorumynd(v.sku)} alt={v.name} width={600} height={600} /></div>
            <h3 className="rfl-smallt">{v.name}</h3>
            {v.model ? <p className="model">{v.model}{v.brand ? ` · ${v.brand}` : ''}</p> : null}
            {v.desc ? <p className="desc">{v.desc}</p> : null}
            <dl className="facts">
              <div><dt>Lager</dt><dd><Lager v={v} /></dd></div>
              <div><dt>Flokkur</dt><dd>{v.cats.join(' › ') || '—'}</dd></div>
              <div><dt>Verð</dt><dd>Við innskráningu, án vsk.</dd></div>
              {p ? <div><dt>Sérfræðingur</dt><dd>{p.name}, <a href={`tel:+354${p.tel.replace(/\s/g, '')}`}>{p.tel}</a></dd></div> : null}
            </dl>
            <div className="acts">
              <Btn href="#efnislisti" variant="brand" onClick={() => onAdd(v)}>Á efnislistann</Btn>
              {v.pdf ? <a className="rfl-link" href={v.pdf} target="_blank" rel="noreferrer">Tækniblað (PDF)</a> : null}
              <a className="rfl-link" href={v.url} target="_blank" rel="noreferrer">Á reykjafell.is</a>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

/* ── 2. material list → quote request ───────────────────────────────────── */

const DAEMI = `4 x UT9260M
1390050 2 stk
Easee Charge Core 22kW x6
6 stk easee standur 1x
yfirspennuvar 3+1 275 VAC 20 kA
plejd dimmir 0-300W 12
Kyoritsu úttektarmælir 1
3x150 jarðstrengur 36kV 240 m
Hager töflukassi 24 einingar 2`

/** One line of an electrician's list: quantity anywhere, then the best match. */
export function lesaLinu(raw: string): Lina | null {
  const t = raw.trim()
  if (!t) return null
  let magn = 1
  let rest = t
  /* "4 x", "4x", "x4", "4 stk", "stk 4", "240 m" or a lone trailing number */
  const pats: RegExp[] = [/^(\d+)\s*(x|stk\.?|m)\s+/i, /\s+(x|stk\.?)\s*(\d+)$/i, /\s+(\d+)\s*(stk\.?|m)$/i, /\s+x(\d+)$/i, /^(\d+)x\s*/i]
  for (const p of pats) {
    const m = rest.match(p)
    if (m) {
      const n = Number(m.slice(1).find((g) => /^\d+$/.test(g ?? '')))
      if (n > 0 && n < 100000) { magn = n; rest = rest.replace(p, ' ').trim(); break }
    }
  }
  if (magn === 1) {
    const tail = rest.match(/\s(\d{1,4})$/)
    /* a trailing number is a quantity only when the rest still names a product;
       "1390050" alone is a SKU, never "1 of 390050" */
    if (tail && rest.replace(/\s\d{1,4}$/, '').trim().length > 3) { magn = Number(tail[1]); rest = rest.replace(/\s\d{1,4}$/, '').trim() }
  }
  const hits = leita(rest, 1)
  if (!hits.length) return { texti: t, sku: null, magn, vissa: 'ekki' }
  return { texti: t, sku: hits[0].v.sku, magn, vissa: hits[0].score >= 4 ? 'viss' : 'liklegt' }
}

export function Efnislisti() {
  const { listi, setListi, fjarlaegja, senda, tilbod, setTilbod } = useBrief()
  const [txt, setTxt] = useState('')
  const [sidast, setSidast] = useState<Lina[] | null>(null)
  useEffect(() => {
    if (!sidast) return
    const t = window.setTimeout(() => setSidast(null), 8000)
    return () => window.clearTimeout(t)
  }, [sidast])
  const lesa = (src: string) => {
    const nyjar = src.split(/\r?\n|;/).map(lesaLinu).filter((x): x is Lina => !!x)
    setListi([...listi, ...nyjar])
    setTxt('')
  }
  const fundnar = listi.filter((l) => l.sku)
  const ekki = listi.filter((l) => !l.sku)
  const vara = (sku: string | null) => (sku ? VORUR.find((v) => v.sku === sku) ?? null : null)
  /* the same routing the request form uses: each found line to its cluster's
     lead, anything unmatched to the head of sales */
  const leidir = useMemo(() => {
    const m = new Map<string, number>()
    fundnar.forEach((l) => { const v = vara(l.sku); if (v) { const k = klasiFyrir(v.fam).abyrgd; m.set(k, (m.get(k) ?? 0) + 1) } })
    const rows = [...m.entries()].map(([uid, n]) => {
      const k = KLASAR.find((x) => x.abyrgd === uid)!
      return { uid, nafn: starfsmadur(uid)?.name ?? k.titill, hvad: `${k.titill}, ${n} ${n === 1 ? 'lína' : 'línur'}` }
    })
    if (ekki.length) rows.push({ uid: SOLULEIDTOGI, nafn: starfsmadur(SOLULEIDTOGI)?.name ?? 'Söludeildin', hvad: `Fyrirliði söludeildar, ${ekki.length} ${ekki.length === 1 ? 'lína' : 'línur'} sem fannst ekki` })
    return rows
  }, [listi]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rfl-tool" id="efnislisti-verkfaeri">
      <div className="inp">
        <h3 className="rfl-label"><svg className="rfl-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg><span>Efnislistinn</span></h3>
        <label className="rfl-field">
          <span className="lbl">Límdu inn línur, ein vara í hverri</span>
          <textarea rows={7} value={txt} onChange={(e) => setTxt(e.target.value)} placeholder={'Til dæmis\n4 x UT9260M\n1390050 2 stk\nEasee Charge Core x6'} spellCheck={false} />
        </label>
        <div className="rfl-row">
          <button type="button" className="rfl-btn brand" disabled={!txt.trim()} onClick={() => lesa(txt)}>
            <span className="lab">Lesa listann</span>
          </button>
          <button type="button" className="rfl-chipbtn" onClick={() => lesa(DAEMI)}>Prófa með dæmi</button>
          {listi.length ? <button type="button" className="rfl-chipbtn" onClick={() => { setSidast(listi); setListi([]) }}>Hreinsa</button> : null}
          {!listi.length && sidast ? <button type="button" className="rfl-chipbtn on" onClick={() => { setListi(sidast); setSidast(null) }}>Afturkalla</button> : null}
        </div>
        <p className="hint">Vörunúmer Reykjafells, gerð framleiðanda eða heiti, og magn hvar sem er í línunni: „4 x“, „x6“, „2 stk“ eða „240 m“. Vörur sem þú setur á listann úr vöruleitinni koma hér líka.</p>

        {listi.length ? (
          <ol className="rfl-lines-t">
            {listi.map((l, i) => {
              const v = vara(l.sku)
              return (
                <li key={`${l.texti}-${i}`} className={l.vissa}>
                  {v ? <img src={vorumynd(v.sku)} alt="" width={56} height={56} loading="lazy" /> : <span className="ph" aria-hidden="true">?</span>}
                  <div className="m">
                    <span className="src">{l.texti}</span>
                    {v ? (
                      <>
                        <span className="nm">{v.name}{v.model ? ` : ${v.model}` : ''}</span>
                        <span className="meta"><span className="mono">{v.sku}</span><Lager v={v} compact />{l.vissa === 'liklegt' ? <span className="flag">Líklegt, sölumaður staðfestir</span> : null}{v.stock > 0 && l.magn > v.stock ? <span className="flag">Pantað umfram lager: {l.magn - v.stock}</span> : null}</span>
                      </>
                    ) : (
                      <span className="meta"><span className="flag">Finnst ekki í sýnishorninu, sölumaður skoðar</span></span>
                    )}
                  </div>
                  <span className="q mono">{l.magn}</span>
                  <button type="button" className="rm" onClick={() => fjarlaegja(i)} aria-label={`Taka „${l.texti}“ af listanum`}>
                    <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" /></svg>
                  </button>
                </li>
              )
            })}
          </ol>
        ) : null}
      </div>

      <aside className="out" aria-label="Tilboðsbeiðnin">
        <p className="rfl-label"><svg className="rfl-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg><span>Tilboðsbeiðnin</span></p>
        {/* a plain count, not a fraction with a superscript: the raised "/9" rode up
            into the label above, and an empty list said "0/0" */}
        {listi.length ? (
          <p className="total"><span className="rfl-num">{fundnar.length}</span><small>af {listi.length} {listi.length === 1 ? 'línu fannst' : 'línum fundust'} í vörulistanum</small></p>
        ) : (
          <p className="total empty"><small>Listinn er tómur. Límdu inn línur hér til vinstri eða settu vörur á hann úr vöruleitinni.</small></p>
        )}
        {ekki.length ? <p className="fine">{ekki.length} {ekki.length === 1 ? 'lína' : 'línur'} fylgja með óbreyttar svo ekkert týnist.</p> : null}
        {leidir.length ? (
          <div className="route">
            <p className="fine">Fer á:</p>
            <ul>
              {leidir.map((r) => <li key={r.uid}><b>{r.nafn}</b><span>{r.hvad}</span></li>)}
            </ul>
          </div>
        ) : null}
        <label className="rfl-field sm">
          <span className="lbl">Verk eða verknúmer</span>
          <input type="text" value={tilbod.verk} onChange={(e) => setTilbod({ verk: e.target.value })} placeholder="Til dæmis Blikastaðavegur, áfangi 2…" autoComplete="off" />
        </label>
        <fieldset className="rfl-field sm">
          <legend>Afhending</legend>
          <div className="chips">
            {([['RVK', 'Sækja í Reykjavík'], ['AK', 'Sækja á Akureyri'], ['senda', 'Senda']] as const).map(([id, t]) => (
              <button key={id} type="button" className="rfl-chip" aria-pressed={tilbod.afhending === id} onClick={() => setTilbod({ afhending: id })}>{t}</button>
            ))}
          </div>
        </fieldset>
        <p className="fine">{SKILMALAR.tilbodGildir} {SKILMALAR.verd}</p>
        <div className="act">
          <Btn href="#hafa-samband" variant="brand" onClick={() => senda('tilbod')}>Senda sem tilboðsbeiðni</Btn>
        </div>
      </aside>
    </div>
  )
}

/* ── 3. events: one calendar for every registration form ────────────────── */

const MANUDIR = ['jan.', 'feb.', 'mar.', 'apr.', 'maí', 'jún.', 'júl.', 'ágú.', 'sep.', 'okt.', 'nóv.', 'des.']
const DAGAR = ['sunnudagur', 'mánudagur', 'þriðjudagur', 'miðvikudagur', 'fimmtudagur', 'föstudagur', 'laugardagur']
/* Iceland keeps UTC all year, so the stored UTC time is the local time */
const klst = (iso: string) => iso.slice(11, 16)
const STADUR = { RVK: 'Blikastaðavegi 2, Reykjavík', AK: 'Baldursnesi 6a, Akureyri' }

function ics(e: (typeof VIDBURDIR)[number]) {
  const d = (s: string) => s.replace(/[-:]/g, '').replace(/\+0000$/, 'Z').replace(/\.\d+/, '')
  const end = e.end ?? new Date(new Date(e.start).getTime() + 2 * 3600e3).toISOString()
  const body = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Reykjafell//Vidburdir//IS', 'BEGIN:VEVENT',
    `UID:${e.uid}@reykjafell.is`, `DTSTAMP:${d(new Date().toISOString())}`, `DTSTART:${d(e.start)}`, `DTEND:${d(end)}`,
    `SUMMARY:${e.tag}: ${e.title}`, `LOCATION:${STADUR[e.loc]}`, `URL:${e.url}`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url; a.download = `${e.uid}.ics`; a.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 2000)
}

const lesaSkraningar = (): string[] => { try { return JSON.parse(localStorage.getItem('rfl-skraning') ?? '[]') } catch { return [] } }

export function Vidburdir() {
  const [stadur, setStadur] = useState<'allt' | 'RVK' | 'AK'>('allt')
  const [opid, setOpid] = useState<string | null>(null)
  const [skradur, setSkradur] = useState<string[]>(lesaSkraningar)
  const [form, setForm] = useState({ nafn: '', netfang: '', fyrirtaeki: '' })
  const [tried, setTried] = useState(false)
  const [lidnir, setLidnir] = useState(false)
  const nu = Date.now()
  const listi = VIDBURDIR.filter((e) => stadur === 'allt' || e.loc === stadur)
  const framundan = listi.filter((e) => new Date(e.start).getTime() >= nu)
  const lokid = listi.filter((e) => new Date(e.start).getTime() < nu).reverse()

  const skra = (uid: string) => {
    setTried(true)
    if (form.nafn.trim().length < 2 || !/\S+@\S+\.\S+/.test(form.netfang)) return
    const n = [...new Set([...skradur, uid])]
    setSkradur(n)
    try { localStorage.setItem('rfl-skraning', JSON.stringify(n)) } catch { /* private mode */ }
    setOpid(null); setTried(false)
  }

  /* a render function, not a component: a component declared in here would be a
     new type every render and remount the open form on each keystroke */
  const kort = (e: (typeof VIDBURDIR)[number], lidinn?: boolean) => {
    const d = new Date(e.start)
    const er = skradur.includes(e.uid)
    return (
      <li key={e.uid} className={`rfl-ev${lidinn ? ' past' : ''}`}>
        <div className="date" aria-hidden="true"><b>{d.getUTCDate()}</b><span>{MANUDIR[d.getUTCMonth()]}</span></div>
        <div className="body">
          <p className="tag">{e.tag} · {e.loc === 'AK' ? 'Akureyri' : 'Reykjavík'}</p>
          <h3 className="rfl-smallert">{e.title}</h3>
          <p className="when">{DAGAR[d.getUTCDay()]} {d.getUTCDate()}. {MANUDIR[d.getUTCMonth()]} {d.getUTCFullYear()}, kl. {klst(e.start)}{e.end ? `–${klst(e.end)}` : ''}</p>
          {e.desc && !/^Fylltu út|^Vinsamlegast/.test(e.desc) ? <p className="desc">{e.desc}</p> : null}
          {!lidinn ? (
            <div className="acts">
              {e.seats ? <span className="seats mono">{e.seats} sæti</span> : null}
              {er ? <span className="ok">Þú ert skráð(ur)</span> : (
                <button type="button" className="rfl-chipbtn on" aria-expanded={opid === e.uid} onClick={() => { setOpid(opid === e.uid ? null : e.uid); setTried(false) }}>Skrá mig</button>
              )}
              <button type="button" className="rfl-chipbtn" onClick={() => ics(e)}>Í dagatalið</button>
            </div>
          ) : null}
          {opid === e.uid ? (
            <form className="reg" onSubmit={(ev) => { ev.preventDefault(); skra(e.uid) }} noValidate>
              <label className="rfl-field sm"><span className="lbl">Nafn</span><input type="text" autoComplete="name" value={form.nafn} onChange={(x) => setForm({ ...form, nafn: x.target.value })} aria-invalid={tried && form.nafn.trim().length < 2} /></label>
              <label className="rfl-field sm"><span className="lbl">Netfang</span><input type="email" autoComplete="email" inputMode="email" value={form.netfang} onChange={(x) => setForm({ ...form, netfang: x.target.value })} aria-invalid={tried && !/\S+@\S+\.\S+/.test(form.netfang)} /></label>
              <label className="rfl-field sm"><span className="lbl">Fyrirtæki</span><input type="text" autoComplete="organization" value={form.fyrirtaeki} onChange={(x) => setForm({ ...form, fyrirtaeki: x.target.value })} /></label>
              {tried && (form.nafn.trim().length < 2 || !/\S+@\S+\.\S+/.test(form.netfang)) ? <p className="err" role="alert">Settu inn nafn og netfang, svo staðfestingin berist.</p> : null}
              <button type="submit" className="rfl-chipbtn on">Staðfesta skráningu</button>
              <p className="hint">Sömu reitir og skráningarform Reykjafells. Frumgerð: skráningin geymist aðeins í þessum vafra.</p>
            </form>
          ) : null}
        </div>
      </li>
    )
  }

  return (
    <div className="rfl-events">
      <div className="chips" role="group" aria-label="Staður">
        {([['allt', 'Allir staðir'], ['RVK', 'Reykjavík'], ['AK', 'Akureyri']] as const).map(([id, t]) => (
          <button key={id} type="button" className="rfl-chip" aria-pressed={stadur === id} onClick={() => setStadur(id)}>{t}</button>
        ))}
      </div>
      {framundan.length ? <ol className="rfl-evlist">{framundan.map((e) => kort(e))}</ol> : <p className="rfl-note">Enginn viðburður framundan á þessum stað.</p>}
      <div className="rfl-evpast">
        <button type="button" className="rfl-link" aria-expanded={lidnir} onClick={() => setLidnir((x) => !x)}>
          {lidnir ? 'Fela' : 'Sýna'} {lokid.length} liðna viðburði
        </button>
        {lidnir ? <ol className="rfl-evlist">{lokid.map((e) => kort(e, true))}</ol> : null}
      </div>
      <div className="rfl-evsys">
        <p>Í lifandi kerfi telja sætin niður um leið og fólk skráir sig, biðlisti tekur við þegar fullt er, áminning fer út daginn áður og birgirinn fær þátttakendalistann. Nýr viðburður er ein færsla, ekki tvær nýjar síður.</p>
      </div>
    </div>
  )
}

/* ── 4. service triage ──────────────────────────────────────────────────── */

export function Thjonusta() {
  const { setMal, senda } = useBrief()
  const [lina, setLina] = useState(THJONUSTA[0].id)
  const [opin, setOpin] = useState<number | null>(0)
  const L = THJONUSTA.find((t) => t.id === lina)!
  const k = klasiFyrir(L.fam)
  const p = starfsmadur(k.abyrgd)
  return (
    <div className="rfl-triage">
      <div className="chips" role="group" aria-label="Vörulína">
        {THJONUSTA.map((t) => (
          <button key={t.id} type="button" className="rfl-chip" aria-pressed={t.id === lina} onClick={() => { setLina(t.id); setOpin(0) }}>{t.titill}</button>
        ))}
      </div>
      <div className="cols">
        <ul className="qa">
          {L.einkenni.map((x, i) => (
            <li key={x.spurning}>
              <button type="button" aria-expanded={opin === i} onClick={() => setOpin(opin === i ? null : i)}>
                <span>{x.spurning}</span><i aria-hidden="true" />
              </button>
              {opin === i ? (
                <div className="a">
                  <p>{x.svar}</p>
                  {x.heimild ? <a className="rfl-link" href={x.heimild} target="_blank" rel="noreferrer">Úr frétt Reykjafells</a> : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
        <aside className="who">
          {p ? <img src={`${import.meta.env.BASE_URL}reykjafell/folk/${p.uid}.jpg`} alt="" width={120} height={143} loading="lazy" /> : null}
          <div>
            <p className="fine">Leystist ekki? Málið fer á</p>
            <p className="nm">{p?.name}</p>
            <p className="fine">{p?.role || k.titill}</p>
            <p className="tel"><a href={`tel:+354${(p?.tel ?? '').replace(/\s/g, '')}`}>{p?.tel}</a> · <a href={`mailto:${p?.email}`}>{p?.email}</a></p>
            <p className="fine">Utan opnunartíma: neyðarsími {CONTACT.neyd} í Reykjavík og {CONTACT.ak.neyd} á Akureyri.</p>
            <Btn href="#hafa-samband" variant="ghost" onClick={() => { setMal({ lina }); senda('thjonusta') }}>Senda málið</Btn>
          </div>
        </aside>
      </div>
    </div>
  )
}

/* ── 5. the one request form ────────────────────────────────────────────── */

const TABS: { id: Tab; nafn: string }[] = [
  { id: 'tilbod', nafn: 'Tilboð' },
  { id: 'adgangur', nafn: 'Aðgangur að netverslun' },
  { id: 'thjonusta', nafn: 'Þjónusta' },
]
const SOLULEIDTOGI = 'adalsteinn-richter'
const NETVERSLUN = 'asgeir-thordarson'

export function mottakendur(tab: Tab, listi: Lina[], mal: Mal): Starfsmadur[] {
  const uids = new Set<string>()
  if (tab === 'adgangur') uids.add(NETVERSLUN)
  else if (tab === 'thjonusta') uids.add(klasiFyrir(THJONUSTA.find((t) => t.id === mal.lina)?.fam ?? '').abyrgd)
  else {
    listi.forEach((l) => { const v = VORUR.find((x) => x.sku === l.sku); if (v) uids.add(klasiFyrir(v.fam).abyrgd) })
    if (!uids.size || listi.some((l) => !l.sku)) uids.add(SOLULEIDTOGI)
  }
  return [...uids].map((u) => STARFSFOLK.find((s) => s.uid === u)).filter((s): s is Starfsmadur => !!s)
}

export function RequestForm() {
  const b = useBrief()
  const { tab, setTab, listi, tengilidur: T, setTengilidur, adgangur: A, setAdgangur, mal, setMal, tilbod } = b
  const [tried, setTried] = useState(false)
  const [copied, setCopied] = useState(false)
  const til = mottakendur(tab, listi, mal)
  const ktOk = /^\d{6}-?\d{4}$/.test(A.kennitala.trim())

  const rows: [string, string][] = []
  let subject = ''
  if (tab === 'tilbod') {
    subject = `Tilboðsbeiðni${tilbod.verk ? `: ${tilbod.verk}` : ''}`
    listi.forEach((l, i) => {
      const v = VORUR.find((x) => x.sku === l.sku)
      rows.push([`${i + 1}.`, v ? `${l.magn} × ${v.sku} ${v.name}${v.model ? ` : ${v.model}` : ''}${l.vissa === 'liklegt' ? ' (staðfesta)' : ''}` : `${l.magn} × „${l.texti}“ (fannst ekki)`])
    })
    if (!listi.length) rows.push(['Efnislisti', 'Enginn, sjá athugasemd'])
    rows.push(['Afhending', tilbod.afhending === 'RVK' ? 'Sækja í Reykjavík' : tilbod.afhending === 'AK' ? 'Sækja á Akureyri' : 'Senda'])
  } else if (tab === 'adgangur') {
    subject = 'Umsókn um reikningsviðskipti og aðgang að netverslun'
    rows.push(['Kennitala', A.kennitala || 'Ekki tilgreind'])
    rows.push(['Tegund', A.tegund])
    rows.push(['Fjöldi notenda', String(A.notendur)])
  } else {
    const L = THJONUSTA.find((t) => t.id === mal.lina)
    subject = `Þjónustubeiðni: ${L?.titill ?? ''}`
    rows.push(['Vörulína', L?.titill ?? ''])
    rows.push(['Vörunúmer', mal.sku || 'Ekki tilgreint'])
    rows.push(['Lýsing', mal.lysing || 'Ekki tilgreind'])
  }
  rows.push(['Nafn', T.nafn || 'Ekki tilgreint'])
  rows.push(['Fyrirtæki', T.fyrirtaeki || 'Ekki tilgreint'])
  rows.push(['Sími', T.simi || 'Ekki tilgreindur'])
  rows.push(['Netfang', T.netfang || 'Ekki tilgreint'])
  if (tilbod.verk && tab === 'tilbod') rows.push(['Verk', tilbod.verk])
  if (T.athugasemd) rows.push(['Athugasemd', T.athugasemd])
  const body = `Sæl,\n\n${subject}.\n\n${rows.map(([k, v]) => `${k} ${v}`).join('\n')}\n\nBeiðnin var sett saman á vef Reykjafells.`
  const valid = T.nafn.trim().length > 1 && (T.simi.trim().length > 6 || /\S+@\S+\.\S+/.test(T.netfang)) && (tab !== 'adgangur' || (ktOk && T.fyrirtaeki.trim().length > 1))
  const href = `mailto:${til.map((p) => p.email).join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  const copy = async () => {
    try { await navigator.clipboard.writeText(`${subject}\n\n${body}`); setCopied(true); window.setTimeout(() => setCopied(false), 2400) } catch { setCopied(false) }
  }
  const tabsRef = useRef<HTMLDivElement | null>(null)
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const i = TABS.findIndex((t) => t.id === tab)
    const n = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length]
    setTab(n.id)
    requestAnimationFrame(() => tabsRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${n.id}"]`)?.focus())
  }

  return (
    <form className="rfl-req" onSubmit={(e) => e.preventDefault()} noValidate>
      <div className="tabs" role="tablist" aria-label="Hvað viltu?" ref={tabsRef} onKeyDown={onKey}>
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" id={`rfl-tab-${t.id}`} data-tab={t.id} aria-selected={tab === t.id} aria-controls="rfl-panel" tabIndex={tab === t.id ? 0 : -1} onClick={() => setTab(t.id)}>{t.nafn}</button>
        ))}
      </div>
      <div className="cols" id="rfl-panel" role="tabpanel" aria-labelledby={`rfl-tab-${tab}`}>
        <div className="left">
          {tab === 'tilbod' ? (
            <div className="recap">
              <Label>Efnislistinn þinn</Label>
              {listi.length ? (
                <dl>{rows.filter(([k]) => /^\d+\.$/.test(k)).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              ) : <p className="hint">Listinn er tómur. Settu vörur á hann úr vöruleitinni eða límdu inn efnislista, eða lýstu verkinu í athugasemd.</p>}
              <p><a className="rfl-back" href="#efnislisti" onClick={(e) => { e.preventDefault(); document.querySelector('#efnislisti-verkfaeri')?.scrollIntoView({ behavior: smooth(), block: 'start' }) }}>Breyta listanum</a></p>
            </div>
          ) : tab === 'adgangur' ? (
            <>
              <p className="lead">Fyrirtæki í rafiðnaði geta sótt um reikningsviðskipti og aðgang að vefverslun. Umsóknin fer á viðskiptastjóra netverslunar.</p>
              <label className="rfl-field">
                <span className="lbl">Kennitala fyrirtækis</span>
                <input type="text" inputMode="numeric" value={A.kennitala} placeholder="000000-0000…" autoComplete="off" spellCheck={false} onChange={(e) => setAdgangur({ kennitala: e.target.value })} aria-invalid={tried && !ktOk} />
              </label>
              <label className="rfl-field">
                <span className="lbl">Starfsemi</span>
                <select value={A.tegund} onChange={(e) => setAdgangur({ tegund: e.target.value })}>
                  {['Rafverktaki', 'Iðnfyrirtæki', 'Veita eða orkufyrirtæki', 'Endursöluaðili', 'Annað'].map((x) => <option key={x}>{x}</option>)}
                </select>
              </label>
              <label className="rfl-field">
                <span className="lbl">Hve margir starfsmenn þurfa aðgang?</span>
                <input type="number" inputMode="numeric" min={1} max={500} value={A.notendur} onChange={(e) => setAdgangur({ notendur: Math.max(1, Number(e.target.value) || 1) })} />
              </label>
              <p className="hint">{SKILMALAR.reidufe} Reikningsviðskipti eru háð samþykki og lánshæfismati.</p>
            </>
          ) : (
            <>
              <label className="rfl-field">
                <span className="lbl">Vörulína</span>
                <select value={mal.lina} onChange={(e) => setMal({ lina: e.target.value })}>
                  {THJONUSTA.map((t) => <option key={t.id} value={t.id}>{t.titill}</option>)}
                </select>
              </label>
              <label className="rfl-field">
                <span className="lbl">Vörunúmer eða raðnúmer</span>
                <input type="text" value={mal.sku} onChange={(e) => setMal({ sku: e.target.value })} placeholder="Til dæmis 6221214…" autoComplete="off" spellCheck={false} />
              </label>
              <label className="rfl-field">
                <span className="lbl">Hvað gerist?</span>
                <textarea rows={4} value={mal.lysing} onChange={(e) => setMal({ lysing: e.target.value })} placeholder="Ljós, villuboð, hvenær það byrjaði…" />
              </label>
              <p className="hint">{SKILMALAR.gallar}</p>
            </>
          )}
        </div>
        <div className="right">
          <div className="rfl-two">
            <label className="rfl-field"><span className="lbl">Nafn</span><input type="text" value={T.nafn} autoComplete="name" onChange={(e) => setTengilidur({ nafn: e.target.value })} aria-invalid={tried && T.nafn.trim().length < 2} /></label>
            <label className="rfl-field"><span className="lbl">Fyrirtæki</span><input type="text" value={T.fyrirtaeki} autoComplete="organization" onChange={(e) => setTengilidur({ fyrirtaeki: e.target.value })} aria-invalid={tried && tab === 'adgangur' && T.fyrirtaeki.trim().length < 2} /></label>
          </div>
          <div className="rfl-two">
            <label className="rfl-field"><span className="lbl">Sími</span><input type="tel" value={T.simi} autoComplete="tel" inputMode="tel" onChange={(e) => setTengilidur({ simi: e.target.value })} /></label>
            <label className="rfl-field"><span className="lbl">Netfang</span><input type="email" value={T.netfang} autoComplete="email" inputMode="email" onChange={(e) => setTengilidur({ netfang: e.target.value })} /></label>
          </div>
          <label className="rfl-field"><span className="lbl">Athugasemd</span><textarea rows={3} value={T.athugasemd} onChange={(e) => setTengilidur({ athugasemd: e.target.value })} /></label>
          <div className="to">
            <span className="fine">Fer beint á</span>
            {til.map((p) => <span key={p.uid} className="pill">{p.name}<small>{p.role || p.title}</small></span>)}
          </div>
          {tried && !valid ? <p className="err" role="alert">{tab === 'adgangur' && !ktOk ? 'Settu inn kennitölu fyrirtækisins, tíu tölustafi. ' : ''}Nafn og annaðhvort sími eða netfang þarf svo hægt sé að svara.</p> : null}
          <div className="acts">
            <a className="rfl-btn brand" href={valid ? href : '#hafa-samband'} onClick={(e) => { if (!valid) { e.preventDefault(); setTried(true) } }}>
              <span className="lab">Opna í tölvupósti</span>
            </a>
            <button type="button" className="rfl-btn ghostl" onClick={copy}><span className="lab">{copied ? 'Afritað' : 'Afrita beiðnina'}</span></button>
          </div>
          <p className="fine">Frumgerð: ekkert er sent héðan. Beiðnin opnast í tölvupóstforritinu þínu, stíluð á {til.map((p) => p.email).join(' og ')}.</p>
        </div>
      </div>
    </form>
  )
}

/* ── the look of the systems ───────────────────────────────────────────── */
export const TOOLS_CSS = `
.rfl-root .mono{font-family:'RflMono',ui-monospace,monospace;font-size:.86em;letter-spacing:0}
.rfl-root .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.rfl-link{font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.06em;text-decoration:underline;text-underline-offset:.3em;
  text-decoration-color:rgba(0,147,208,.5);color:${C.blueInk};background:none;border:0;padding:.7em 0;min-height:44px;cursor:pointer;display:inline-flex;align-items:center;font-family:inherit}
.rfl-band.dark .rfl-link{color:#fff;text-decoration-color:rgba(255,255,255,.5)}
.rfl-note{font-size:var(--t-tag);line-height:1.5;opacity:.7;margin-top:1.4rem;max-width:70ch}

/* stock pill: the one place colour carries meaning, so it also carries a word */
.rfl-stock{display:inline-flex;align-items:center;gap:.45em;font-family:'RflMono',ui-monospace,monospace;font-size:var(--t-tag);white-space:nowrap}
.rfl-stock i{width:7px;height:7px;border-radius:50%;background:#1f9d55;flex:none}
.rfl-stock.out i{background:transparent;border:1.5px solid currentColor;opacity:.6}
.rfl-stock.out{opacity:.75}

/* sentence finder */
.rfl-finder{display:grid;gap:1.2rem;margin-bottom:1.6rem}
.rfl-sentence{font-size:var(--t-normal);line-height:1.35;font-weight:500;letter-spacing:-.02em;display:flex;flex-wrap:wrap;align-items:baseline;gap:.25em .4em}
.rfl-slot{position:relative;display:inline-flex;align-items:center;color:${C.blue}}
.rfl-slot select{font:inherit;color:inherit;background:transparent;border:0;border-bottom:2px solid currentColor;padding:0 1.1em .05em 0;
  -webkit-appearance:none;appearance:none;cursor:pointer;border-radius:0;min-height:44px}
.rfl-slot svg{position:absolute;right:.1em;pointer-events:none;width:.42em;height:auto}
.rfl-slot select:focus-visible{outline:2px solid ${C.blue};outline-offset:4px}
.rfl-search{display:flex;align-items:center;gap:.7em;border:1px solid rgba(17,21,24,.28);border-radius:var(--rad);background:#fff;padding:0 1em;max-width:640px;min-height:52px}
.rfl-search input{flex:1;min-width:0;border:0;background:transparent;font:inherit;font-size:max(16px,var(--t-body));color:${C.ink};padding:.8em 0}
.rfl-search input:focus{outline:none}
.rfl-search:focus-within{outline:2px solid ${C.blue};outline-offset:2px}
.rfl-count{font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.06em;opacity:.7;margin-bottom:1.2rem}

/* product grid: their cutouts on flat squares, SKU above the name */
.rfl-grid-p{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:calc(var(--col) * 1.4) var(--col)}
@media (max-width:1080px){.rfl-grid-p{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:760px){.rfl-grid-p{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.6rem .8rem}}
.rfl-pcard{display:flex;flex-direction:column;height:100%}
.rfl-pcard .shot{display:block;aspect-ratio:1 / 1;background:${C.paper};border:0;border-radius:var(--rad);padding:12%;cursor:pointer;width:100%;overflow:hidden}
.rfl-band.paper .rfl-pcard .shot{background:#fff}
.rfl-pcard .shot img{object-fit:contain;mix-blend-mode:multiply;transition:transform .35s cubic-bezier(.23,1,.32,1)}
.rfl-pcard .sku{display:flex;justify-content:space-between;gap:.5em;margin-top:.9em;font-family:'RflMono',ui-monospace,monospace;font-size:var(--t-tag);opacity:.65}
.rfl-pcard h3{font-size:var(--t-body);font-weight:600;line-height:1.3;margin-top:.35em;letter-spacing:0;overflow-wrap:anywhere}
.rfl-pcard .model{font-family:'RflMono',ui-monospace,monospace;font-size:var(--t-tag);opacity:.7;margin-top:.25em;overflow-wrap:anywhere}
.rfl-pcard .foot{margin-top:auto;padding-top:.9em;display:flex;justify-content:space-between;align-items:center;gap:.5em;flex-wrap:wrap}
.addbtn{font:inherit;font-size:var(--t-tag);font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:${C.ink};background:transparent;
  border:1px solid rgba(17,21,24,.3);border-radius:var(--rad);min-height:40px;padding:.5em .8em;cursor:pointer;transition:background .3s,color .3s,border-color .3s;touch-action:manipulation}
.addbtn.done{background:${C.blueInk};border-color:${C.blueInk};color:#fff}
@media (max-width:760px){.rfl-pcard .foot{flex-direction:column;align-items:stretch}.addbtn{min-height:44px}}
.rfl-empty{border:1px dashed rgba(17,21,24,.3);border-radius:var(--rad);padding:2rem;display:grid;gap:1rem;justify-items:start}

/* product sheet */
.rfl-sheet{position:fixed;inset:0;z-index:55;visibility:hidden;pointer-events:none}
.rfl-sheet.open{visibility:visible;pointer-events:auto}
.rfl-sheet .scrim{position:absolute;inset:0;background:rgba(7,43,63,.45);opacity:0;transition:opacity .3s;border:0;cursor:pointer}
.rfl-sheet.open .scrim{opacity:1}
.rfl-sheet .panel{position:absolute;top:0;right:0;bottom:0;width:min(480px,100vw);background:#fff;overflow-y:auto;overscroll-behavior:contain;
  padding:calc(var(--col) * 1.6);padding-bottom:calc(var(--col) * 1.6 + env(safe-area-inset-bottom));transform:translateX(100%);transition:transform .45s cubic-bezier(.32,.72,0,1);outline:none}
.rfl-sheet.open .panel{transform:none}
.rfl-sheet .top{display:flex;justify-content:space-between;align-items:center;gap:1rem}
.rfl-sheet .sku{display:flex;gap:1em;flex-wrap:wrap;font-family:'RflMono',ui-monospace,monospace;font-size:var(--t-tag);opacity:.7}
.rfl-sheet .x{width:44px;height:44px;display:grid;place-items:center;border:1px solid rgba(17,21,24,.25);border-radius:var(--rad);background:transparent;cursor:pointer;color:${C.ink}}
.rfl-sheet .img{aspect-ratio:1 / 1;background:${C.paper};border-radius:var(--rad);padding:12%;margin:1.2rem 0}
.rfl-sheet .img img{object-fit:contain;mix-blend-mode:multiply}
.rfl-sheet .model{font-family:'RflMono',ui-monospace,monospace;font-size:var(--t-tag);opacity:.7;margin-top:.4em}
.rfl-sheet .desc{margin-top:1em;line-height:1.55}
.rfl-sheet .facts{margin-top:1.2rem}
.rfl-sheet .facts div{display:grid;grid-template-columns:7.5em minmax(0,1fr);gap:1rem;padding:.65em 0;border-top:1px solid ${C.hairline}}
.rfl-sheet .facts dt{opacity:.6;font-size:var(--t-tag);text-transform:uppercase;letter-spacing:.06em;font-weight:600;padding-top:.15em}
.rfl-sheet .facts a{text-decoration:underline;text-underline-offset:.2em}
.rfl-sheet .acts{display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;align-items:center;margin-top:1.4rem}
@media (prefers-reduced-motion:reduce){.rfl-sheet .panel{transition:none}}

/* tool frame (the Ægir tool layout) */
.rfl-tool{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:calc(var(--col) * 2);align-items:start}
@media (max-width:900px){.rfl-tool{grid-template-columns:minmax(0,1fr);gap:2.2rem}}
.rfl-tool .inp>h3{margin-bottom:1.4rem}
.rfl-tool .out{position:sticky;top:calc(var(--band) / 2 + 3vw);border:1px solid ${C.hairline};border-radius:var(--rad);background:#fff;padding:calc(var(--col) * 1.4)}
.rfl-band.white .rfl-tool .out{background:${C.paper}}
@media (max-width:900px){.rfl-tool .out{position:static}}
.rfl-tool .total{display:flex;flex-direction:column;gap:.4em;padding:.6em 0 .9em;margin-top:.4rem;border-bottom:1px solid ${C.hairline};margin-bottom:1rem}
.rfl-tool .total .rfl-num{line-height:1}
.rfl-tool .total.empty small{font-size:var(--t-body);opacity:.72;line-height:1.5;letter-spacing:0}
.rfl-tool .total small{font-size:var(--t-tag);letter-spacing:.04em;opacity:.7}
.rfl-tool .fine,.rfl-req .fine,.rfl-triage .fine{font-size:var(--t-tag);line-height:1.5;opacity:.72;margin-top:.6em}
.rfl-tool .act{margin-top:1.2rem}
.rfl-tool .act .rfl-btn{width:100%}
.rfl-tool .route ul{list-style:none;margin-top:.4rem}
.rfl-tool .route li{display:flex;justify-content:space-between;gap:1rem;padding:.55em 0;border-top:1px solid ${C.hairline};font-size:var(--t-body)}
.rfl-tool .route li span{opacity:.7;text-align:right;font-size:var(--t-tag)}
.rfl-row{display:flex;flex-wrap:wrap;gap:.6rem;align-items:center}
.rfl-row .rfl-btn{min-width:0}
.rfl-row .rfl-btn:disabled{opacity:.4;cursor:default}
.rfl-row .rfl-btn .lab{padding-right:1.2em}
.rfl-chipbtn{font:inherit;font-size:var(--t-tag);font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:${C.ink};background:transparent;
  border:1px solid rgba(17,21,24,.3);border-radius:var(--rad);min-height:44px;padding:.55em 1em;cursor:pointer;transition:background .3s,color .3s,border-color .3s;touch-action:manipulation}
.rfl-chipbtn.on{background:${C.ink};border-color:${C.ink};color:#fff}

/* the read-back list */
.rfl-lines-t{list-style:none;margin-top:1.6rem;border-top:1px solid ${C.ink}}
.rfl-lines-t li{display:grid;grid-template-columns:56px minmax(0,1fr) auto 44px;gap:.9rem;align-items:center;padding:.8em 0;border-bottom:1px solid ${C.hairline}}
.rfl-lines-t img,.rfl-lines-t .ph{width:56px;height:56px;border-radius:var(--rad);background:${C.paper};object-fit:contain;mix-blend-mode:multiply;padding:6px}
.rfl-lines-t .ph{display:grid;place-items:center;font-weight:600;opacity:.6;mix-blend-mode:normal;border:1px dashed rgba(17,21,24,.35);background:transparent}
.rfl-lines-t .m{display:grid;gap:.15em;min-width:0}
.rfl-lines-t .src{font-family:'RflMono',ui-monospace,monospace;font-size:var(--t-tag);opacity:.6;overflow-wrap:anywhere}
.rfl-lines-t .nm{font-weight:600;line-height:1.3;overflow-wrap:anywhere}
.rfl-lines-t .meta{display:flex;flex-wrap:wrap;gap:.3em .9em;align-items:center;font-size:var(--t-tag)}
.rfl-lines-t .flag{color:#9a5b00;font-weight:600}
.rfl-lines-t li.ekki .flag{color:#b3261e}
.rfl-lines-t .q{font-size:var(--t-smaller);font-variant-numeric:tabular-nums;text-align:right;min-width:2.5ch}
.rfl-lines-t .rm{width:44px;height:44px;display:grid;place-items:center;border:0;background:transparent;cursor:pointer;color:${C.ink};opacity:.55;border-radius:var(--rad)}
@media (max-width:480px){.rfl-lines-t li{grid-template-columns:44px minmax(0,1fr) auto 44px;gap:.6rem}.rfl-lines-t img,.rfl-lines-t .ph{width:44px;height:44px}}

/* fields and chips (as on Ægir) */
.rfl-field{display:block;border:0;margin:0 0 1.4rem;min-width:0}
.rfl-field.sm{margin-bottom:1rem}
.rfl-field legend,.rfl-field .lbl{display:block;font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.6em;padding:0}
.rfl-field input[type=text],.rfl-field input[type=tel],.rfl-field input[type=email],.rfl-field input[type=number],.rfl-field select,.rfl-field textarea{
  width:100%;font:inherit;font-size:max(16px,var(--t-body));color:${C.ink};background:#fff;border:1px solid rgba(17,21,24,.3);border-radius:var(--rad);
  padding:.8em .9em;min-height:48px;-webkit-appearance:none;appearance:none}
.rfl-field textarea{resize:vertical;line-height:1.5;font-family:'RflMono',ui-monospace,monospace;font-size:max(16px,.92em)}
.rfl-req .rfl-field textarea{font-family:inherit}
.rfl-band.white .rfl-field input,.rfl-band.white .rfl-field select,.rfl-band.white .rfl-field textarea{background:${C.paper}}
.rfl-field select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23111518' stroke-width='1.4'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .9em center;padding-right:2.4em}
.rfl-field input:focus-visible,.rfl-field select:focus-visible,.rfl-field textarea:focus-visible{outline:2px solid ${C.blue};outline-offset:2px}
.rfl-field [aria-invalid="true"]{border-color:#b3261e}
.rfl-root .hint{font-size:var(--t-tag);line-height:1.5;opacity:.72;margin-top:.7em;max-width:60ch}
.rfl-two{display:grid;grid-template-columns:1fr 1fr;gap:var(--col)}
@media (max-width:560px){.rfl-two{grid-template-columns:1fr}}
.rfl-root .chips{display:flex;flex-wrap:wrap;gap:.5rem}
.rfl-chip{font:inherit;font-size:var(--t-body);font-weight:500;color:${C.ink};background:transparent;border:1px solid rgba(17,21,24,.3);border-radius:var(--rad);
  min-height:44px;padding:.55em 1em;cursor:pointer;line-height:1.15;transition:background .3s,color .3s,border-color .3s;touch-action:manipulation}
.rfl-chip[aria-pressed="true"]{background:${C.blueInk};border-color:${C.blueInk};color:#fff}
.rfl-chip:focus-visible,.rfl-chipbtn:focus-visible,.addbtn:focus-visible{outline:2px solid ${C.blue};outline-offset:2px}

/* events */
.rfl-events>.chips{margin-bottom:1.6rem}
.rfl-evlist{list-style:none;border-top:1px solid ${C.ink}}
.rfl-ev{display:grid;grid-template-columns:5.5em minmax(0,1fr);gap:var(--col);padding:1.4em 0;border-bottom:1px solid ${C.hairline}}
.rfl-ev .date{display:flex;flex-direction:column;align-items:flex-start;line-height:1}
.rfl-ev .date b{font-size:var(--t-num);font-weight:400;font-variant-numeric:tabular-nums;color:${C.blue}}
.rfl-ev .date span{font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-top:.4em}
.rfl-ev.past .date b{color:inherit;opacity:.45}
.rfl-ev .tag{font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.06em;opacity:.7}
.rfl-ev h3{margin-top:.3em}
.rfl-ev .when{margin-top:.35em;opacity:.8}
.rfl-ev .desc{margin-top:.5em;max-width:64ch;opacity:.8;font-size:var(--t-body)}
.rfl-ev .acts{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem;margin-top:1rem}
.rfl-ev .seats{padding:.4em .7em;border:1px solid ${C.hairline};border-radius:var(--rad)}
.rfl-ev .ok{font-weight:600;color:#1f7a45;display:inline-flex;align-items:center;min-height:44px}
.rfl-ev .reg{margin-top:1.2rem;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 var(--col);align-items:end;max-width:760px}
.rfl-ev .reg .hint{grid-column:1 / -1;margin-top:0}
.rfl-ev .reg .err{grid-column:1 / -1;color:#b3261e;font-size:var(--t-tag);font-weight:600;margin:0 0 .8rem}
.rfl-ev .reg button{justify-self:start;margin-bottom:1rem}
@media (max-width:760px){.rfl-ev{grid-template-columns:3.6em minmax(0,1fr)}.rfl-ev .reg{grid-template-columns:1fr}}
.rfl-evpast{margin-top:1rem}
.rfl-evsys{margin-top:2rem;padding:1.2rem 1.4rem;border-left:2px solid ${C.blue};background:rgba(0,147,208,.06);max-width:72ch}
.rfl-evsys p{font-size:var(--t-body);line-height:1.55}

/* triage */
.rfl-triage>.chips{margin-bottom:1.6rem}
.rfl-band.dark .rfl-chip{color:#fff;border-color:rgba(255,255,255,.45)}
.rfl-band.dark .rfl-chip[aria-pressed="true"]{background:#fff;color:${C.blueDeep};border-color:#fff}
.rfl-triage .cols{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:calc(var(--col) * 2);align-items:start}
@media (max-width:900px){.rfl-triage .cols{grid-template-columns:1fr;gap:2rem}}
.rfl-triage .qa{list-style:none;border-top:1px solid rgba(255,255,255,.35)}
.rfl-triage .qa li{border-bottom:1px solid rgba(255,255,255,.2)}
.rfl-triage .qa button{width:100%;display:flex;justify-content:space-between;align-items:center;gap:1rem;text-align:left;font:inherit;font-size:var(--t-lead);font-weight:500;
  color:inherit;background:none;border:0;padding:1.1em 0;cursor:pointer;min-height:44px}
.rfl-triage .qa button i{width:14px;height:14px;position:relative;flex:none}
.rfl-triage .qa button i:before,.rfl-triage .qa button i:after{content:'';position:absolute;left:0;top:6px;width:14px;height:1.6px;background:currentColor;transition:transform .3s}
.rfl-triage .qa button i:after{transform:rotate(90deg)}
.rfl-triage .qa button[aria-expanded="true"] i:after{transform:rotate(0)}
.rfl-triage .qa button:focus-visible{outline:2px solid #fff;outline-offset:2px}
.rfl-triage .a{padding:0 0 1.3em;max-width:64ch}
.rfl-triage .a p{opacity:.88;line-height:1.6}
.rfl-triage .who{display:grid;grid-template-columns:96px minmax(0,1fr);gap:1.1rem;padding:1.2rem;border:1px solid rgba(255,255,255,.25);border-radius:var(--rad)}
.rfl-triage .who img{width:96px;height:auto;aspect-ratio:600 / 714;object-fit:cover;border-radius:var(--rad);background:rgba(255,255,255,.1)}
.rfl-triage .who .nm{font-size:var(--t-smaller);font-weight:600;margin-top:.2em}
.rfl-triage .who .tel{margin:.6em 0;overflow-wrap:anywhere}
.rfl-triage .who .tel a{text-decoration:underline;text-decoration-color:rgba(255,255,255,.45);text-underline-offset:.2em}
.rfl-triage .who .rfl-btn{margin-top:.8rem;color:#fff;border-color:rgba(255,255,255,.6)}

@media (max-width:400px){.rfl-triage .who{grid-template-columns:minmax(0,1fr)}}
@media (max-width:760px){.rfl-triage .who .tel a,.rfl-sheet .facts a{display:inline-flex;align-items:center;min-height:44px}}

/* request form, on the dark band */
.rfl-req .tabs{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:calc(var(--col) * 1.6)}
.rfl-req .tabs button{font:inherit;font-size:var(--t-body);font-weight:600;color:#fff;background:transparent;border:1px solid rgba(255,255,255,.45);border-radius:var(--rad);min-height:46px;padding:.6em 1.1em;cursor:pointer;transition:background .3s,color .3s;touch-action:manipulation}
.rfl-req .tabs button[aria-selected="true"]{background:#fff;color:${C.blueDeep};border-color:#fff}
.rfl-req .tabs button:focus-visible{outline:2px solid #fff;outline-offset:3px}
.rfl-req .cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:calc(var(--col) * 2);align-items:start}
@media (max-width:900px){.rfl-req .cols{grid-template-columns:minmax(0,1fr);gap:1.6rem}}
.rfl-req .lead{margin-bottom:1.4rem;opacity:.88;max-width:52ch}
.rfl-req .rfl-field .lbl,.rfl-req .rfl-field legend{opacity:.85}
.rfl-req .rfl-field input,.rfl-req .rfl-field select,.rfl-req .rfl-field textarea{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.4);color:#fff}
.rfl-req .rfl-field select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23ffffff' stroke-width='1.4'/%3E%3C/svg%3E")}
.rfl-req .rfl-field select option{color:${C.ink}}
.rfl-req .rfl-field input::placeholder,.rfl-req .rfl-field textarea::placeholder{color:rgba(255,255,255,.55)}
.rfl-req .rfl-field input:focus-visible,.rfl-req .rfl-field select:focus-visible,.rfl-req .rfl-field textarea:focus-visible{outline-color:#fff}
.rfl-req .recap dl{margin:.9rem 0 .4rem;display:grid}
.rfl-req .recap dl div{display:grid;grid-template-columns:2.4em minmax(0,1fr);gap:.6rem;padding:.6em 0;border-top:1px solid rgba(255,255,255,.22)}
.rfl-req .recap dt{opacity:.6;font-variant-numeric:tabular-nums}
.rfl-req .recap dd{overflow-wrap:anywhere}
.rfl-req .rfl-back{font-size:var(--t-label);text-transform:uppercase;letter-spacing:.06em;font-weight:600;text-decoration:underline;text-underline-offset:.25em;display:inline-block;padding:.7em 0;min-height:44px}
.rfl-req .to{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin:.2rem 0 1rem}
.rfl-req .to .fine{margin:0 .3rem 0 0}
.rfl-req .pill{display:inline-flex;flex-direction:column;padding:.45em .8em;border:1px solid rgba(255,255,255,.35);border-radius:var(--rad);font-weight:600;line-height:1.25}
.rfl-req .pill small{font-weight:500;opacity:.7;font-size:var(--t-tag)}
.rfl-req .acts{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:.6rem}
.rfl-req .acts .rfl-btn{min-width:0;flex:1 1 14em;text-align:left;font-family:inherit}
.rfl-req .acts .rfl-btn.ghostl{background:transparent;color:#fff;border-color:rgba(255,255,255,.6)}
.rfl-req .acts .rfl-btn.brand{background:#fff;color:${C.blueDeep};border-color:#fff}
.rfl-req .acts .rfl-btn .lab{padding:1.05em 1.2em 1.1em}
.rfl-req .err{color:#ffb4ab;font-size:var(--t-body);margin:.2rem 0 .6rem}

@media (hover:hover) and (pointer:fine){
  .rfl-pcard .shot:hover img{transform:scale(1.04)}
  .addbtn:not(.done):hover,.rfl-chipbtn:not(.on):hover{background:${C.ink};color:#fff;border-color:${C.ink}}
  .rfl-chip:not([aria-pressed="true"]):hover{background:rgba(0,147,208,.09);border-color:${C.blue}}
  .rfl-band.dark .rfl-chip:not([aria-pressed="true"]):hover{background:rgba(255,255,255,.12)}
  .rfl-req .tabs button[aria-selected="false"]:hover{background:rgba(255,255,255,.12)}
  .rfl-req .acts .rfl-btn.ghostl:hover{background:#fff;color:${C.blueDeep}}
  .rfl-req .acts .rfl-btn.brand:hover{background:transparent;color:#fff}
  .rfl-lines-t .rm:hover{opacity:1;background:${C.paper}}
  .rfl-link:hover{text-decoration-color:currentColor}
}
@media (prefers-reduced-motion:reduce){.rfl-pcard .shot img{transition:none}}
`
