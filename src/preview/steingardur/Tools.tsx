import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { C, Btn, Label, step } from './ui'
import {
  CONTACT, HVENAER, LAGNIR, SNJO_SVAEDI, SNJO_TEGUND, SVEITARFELOG, TAEKI, TAEKI_STUTT, VERKKAUPAR, VERKTEGUNDIR,
  type TaekiId, type VerkId,
} from './data'
import { TOOLS_CSS_BASE } from './toolsCss'

/* Steingarður publishes no prices, so nothing here prices anything. The job
   builder and the equipment catalogue only gather what a foreman needs to give
   a quote: what is to be done, which pipes, where, when, roughly how long the
   trench is, and which of their own machines fit. Both write into one brief;
   the request form at the bottom opens the customer's own mail program with
   it, and the staff-side card shows what lands in steingardur@steingardur.is.
   Nothing is sent from this prototype. */

export type Tab = 'verk' | 'snjo' | 'fyrirspurn'
export interface Verk {
  tegundir: VerkId[]
  lagnir: string[]
  verkkaupi: string
  sveitarfelag: string
  heimilisfang: string
  lengd: number
  hvenaer: string
  dags: string
  taeki: TaekiId[]
  /** the visitor picked machines by hand: stop re-suggesting over their choice */
  handvalid: boolean
}
export interface Snjo { svaedi: string[]; tegund: string; heimilisfang: string }
export interface Tengilidur { nafn: string; fyrirtaeki: string; simi: string; netfang: string; athugasemd: string; lysing: string }

const suggest = (tegundir: VerkId[]): TaekiId[] => {
  const set = new Set<TaekiId>()
  VERKTEGUNDIR.filter((v) => tegundir.includes(v.id)).forEach((v) => v.taeki.forEach((t) => set.add(t)))
  return TAEKI.map((t) => t.id).filter((id) => set.has(id))
}

const START_VERK: Verk = {
  tegundir: ['heimlagnir'], lagnir: ['Hitaveita', 'Kalt vatn'], verkkaupi: VERKKAUPAR[0], sveitarfelag: 'Hafnarfjörður',
  heimilisfang: '', lengd: 0, hvenaer: HVENAER[1], dags: '', taeki: suggest(['heimlagnir']), handvalid: false,
}

interface BriefCtx {
  tab: Tab
  setTab: (t: Tab) => void
  verk: Verk
  setVerk: (patch: Partial<Verk>) => void
  toggleTegund: (id: VerkId) => void
  toggleTaeki: (id: TaekiId) => void
  snjo: Snjo
  setSnjo: (patch: Partial<Snjo>) => void
  tengilidur: Tengilidur
  setTengilidur: (patch: Partial<Tengilidur>) => void
  senda: (t: Tab) => void
}
const Ctx = createContext<BriefCtx | null>(null)
export function useBrief() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useBrief outside BriefProvider')
  return c
}

const scrollTo = (sel: string, block: ScrollLogicalPosition = 'start') =>
  document.querySelector(sel)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block })

export function BriefProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<Tab>('verk')
  const [verk, setV] = useState<Verk>(START_VERK)
  const [snjo, setS] = useState<Snjo>({ svaedi: [SNJO_SVAEDI[0]], tegund: SNJO_TEGUND[0], heimilisfang: '' })
  const [tengilidur, setT] = useState<Tengilidur>({ nafn: '', fyrirtaeki: '', simi: '', netfang: '', athugasemd: '', lysing: '' })
  const setVerk = useCallback((p: Partial<Verk>) => setV((o) => ({ ...o, ...p })), [])
  const toggleTegund = useCallback((id: VerkId) => setV((o) => {
    const tegundir = o.tegundir.includes(id) ? o.tegundir.filter((x) => x !== id) : [...o.tegundir, id]
    return { ...o, tegundir, taeki: o.handvalid ? o.taeki : suggest(tegundir) }
  }), [])
  const toggleTaeki = useCallback((id: TaekiId) => setV((o) => ({
    ...o, handvalid: true, taeki: o.taeki.includes(id) ? o.taeki.filter((x) => x !== id) : TAEKI.map((t) => t.id).filter((x) => x === id || o.taeki.includes(x)),
  })), [])
  const setSnjo = useCallback((p: Partial<Snjo>) => setS((o) => ({ ...o, ...p })), [])
  const setTengilidur = useCallback((p: Partial<Tengilidur>) => setT((o) => ({ ...o, ...p })), [])
  const senda = useCallback((t: Tab) => { setTab(t); scrollTo('#hafa-samband') }, [])
  const value = useMemo(
    () => ({ tab, setTab, verk, setVerk, toggleTegund, toggleTaeki, snjo, setSnjo, tengilidur, setTengilidur, senda }),
    [tab, verk, snjo, tengilidur, setVerk, toggleTegund, toggleTaeki, setSnjo, setTengilidur, senda],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/* ── small controls ────────────────────────────────────────────────────── */

function Chip({ on, onClick, children, disabled, label }: { on: boolean; onClick: () => void; children: ReactNode; disabled?: boolean; label?: string }) {
  return (
    <button type="button" className="stg-chip" aria-pressed={on} disabled={disabled} onClick={onClick} aria-label={label}>
      {children}
    </button>
  )
}

function Stepper({ value, onChange, min = 0, max = 999, label, unit, by = 1 }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string; unit?: string; by?: number }) {
  const [draft, setDraft] = useState<string | null>(null)
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  const bump = (d: number) => { setDraft(null); onChange(clamp(value + d)) }
  return (
    <div className="stg-stepper" role="group" aria-label={label}>
      <button type="button" aria-label={`Minnka: ${label}`} onClick={() => bump(-by)} disabled={value <= min}>
        <svg width="12" height="2" viewBox="0 0 12 2" aria-hidden="true"><path d="M0 1h12" stroke="currentColor" strokeWidth="1.6" /></svg>
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={draft ?? String(value)}
        aria-label={label}
        onChange={(e) => {
          setDraft(e.target.value)
          const n = parseInt(e.target.value, 10)
          if (Number.isFinite(n) && n >= min && n <= max) onChange(n)
        }}
        onBlur={() => setDraft(null)}
      />
      {unit ? <span className="u">{unit}</span> : null}
      <button type="button" aria-label={`Auka: ${label}`} onClick={() => bump(by)} disabled={value >= max}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M0 6h12M6 0v12" stroke="currentColor" strokeWidth="1.6" /></svg>
      </button>
    </div>
  )
}

const dagsTexti = (d: string) =>
  d ? new Date(d + 'T12:00:00').toLocaleDateString('is-IS', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''

const tegundNafn = (id: VerkId) => VERKTEGUNDIR.find((v) => v.id === id)?.nafn ?? id
const verkLysing = (V: Verk) => {
  const parts = V.tegundir.map((id) => (id === 'heimlagnir' && V.lagnir.length ? `Heimtaug (${V.lagnir.join(', ').toLowerCase()})` : tegundNafn(id)))
  return parts.length ? parts.join(', ') : 'Ekki valið'
}

/* ── tool 1: the job builder ───────────────────────────────────────────── */

export function JobBuilder() {
  const { verk: V, setVerk, toggleTegund, toggleTaeki, senda } = useBrief()
  const lagnirOn = V.tegundir.includes('heimlagnir')
  const toggleLogn = (l: string) => setVerk({ lagnir: V.lagnir.includes(l) ? V.lagnir.filter((x) => x !== l) : [...V.lagnir, l] })
  const tillaga = suggest(V.tegundir)

  return (
    <div className="stg-tool" id="verkbeidni-verkfaeri">
      <div className="inp">
        <p className="mini" aria-hidden="true"><span>Verkbeiðnin</span><b>{V.tegundir.length} verkþ. · {V.taeki.length} tæki</b></p>
        <h3 className="stg-label"><svg className="stg-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg><span>Settu saman verkið</span></h3>

        <fieldset className="stg-field">
          <legend>Hvað á að gera?</legend>
          <div className="chips">
            {VERKTEGUNDIR.map((v) => <Chip key={v.id} on={V.tegundir.includes(v.id)} onClick={() => toggleTegund(v.id)}>{v.nafn}</Chip>)}
          </div>
          <p className="hint">Veldu eitt eða fleira.</p>
        </fieldset>

        {lagnirOn ? (
          <fieldset className="stg-field">
            <legend>Hvaða lagnir?</legend>
            <div className="chips">
              {LAGNIR.map((l) => <Chip key={l} on={V.lagnir.includes(l)} onClick={() => toggleLogn(l)}>{l}</Chip>)}
            </div>
          </fieldset>
        ) : null}

        <fieldset className="stg-field">
          <legend>Hver biður um verkið?</legend>
          <div className="chips">
            {VERKKAUPAR.map((k) => <Chip key={k} on={V.verkkaupi === k} onClick={() => setVerk({ verkkaupi: k })}>{k}</Chip>)}
          </div>
        </fieldset>

        <fieldset className="stg-field">
          <legend>Hvar?</legend>
          <div className="chips">
            {SVEITARFELOG.map((s) => <Chip key={s} on={V.sveitarfelag === s} onClick={() => setVerk({ sveitarfelag: s })}>{s}</Chip>)}
          </div>
          <label className="stg-field sub">
            <span className="lbl">Heimilisfang eða lýsing á staðnum</span>
            <input type="text" value={V.heimilisfang} placeholder="Til dæmis Hraunbrún 12" autoComplete="street-address" onChange={(e) => setVerk({ heimilisfang: e.target.value })} />
          </label>
        </fieldset>

        <div className="stg-two">
          <fieldset className="stg-field">
            <legend>Lengd skurðar, ef þú veist</legend>
            <Stepper value={V.lengd} onChange={(n) => setVerk({ lengd: n })} min={0} max={5000} by={5} label="Lengd skurðar í metrum" unit="m" />
            <p className="hint">{V.lengd === 0 ? 'Núll þýðir óþekkt. Verkstjóri metur á staðnum.' : `Um ${V.lengd} metrar.`}</p>
          </fieldset>
          <fieldset className="stg-field">
            <legend>Hvenær?</legend>
            <div className="chips">
              {HVENAER.map((h) => <Chip key={h} on={V.hvenaer === h} onClick={() => setVerk({ hvenaer: h })}>{h}</Chip>)}
            </div>
            <label className="stg-field sub">
              <span className="lbl">Ákveðinn dagur, ef einhver</span>
              <span className="datewrap">
                <input type="date" value={V.dags} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setVerk({ dags: e.target.value })} />
                {V.dags ? null : <span className="ph" aria-hidden="true">Veldu dag</span>}
              </span>
            </label>
          </fieldset>
        </div>
      </div>

      <aside className="out" aria-label="Verkbeiðnin þín">
        <Label>Verkbeiðnin þín</Label>
        <dl className="sum">
          <div><dt>Verk</dt><dd>{verkLysing(V)}</dd></div>
          <div><dt>Staður</dt><dd>{[V.heimilisfang, V.sveitarfelag].filter(Boolean).join(', ')}</dd></div>
          <div><dt>Hvenær</dt><dd>{V.dags ? dagsTexti(V.dags) : V.hvenaer}</dd></div>
          {V.lengd > 0 ? <div><dt>Skurður</dt><dd>um {V.lengd} m</dd></div> : null}
        </dl>
        <p className="tk-h">Tæki sem henta</p>
        {V.taeki.length ? (
          <ul className="tk" aria-live="polite">
            {V.taeki.map((id) => (
              <li key={id}>
                <span>{TAEKI_STUTT[id]}</span>
                <button type="button" onClick={() => toggleTaeki(id)} aria-label={`Taka ${TAEKI_STUTT[id]} úr beiðninni`}>×</button>
              </li>
            ))}
          </ul>
        ) : <p className="fine">Engin tæki valin. Verkstjóri velur tækin.</p>}
        <p className="fine">
          {V.handvalid ? 'Tækin eru eins og þú valdir þau. ' : 'Tillaga eftir tegund verks. '}
          Verkstjóri staðfestir tækin og gefur tilboð. <a href="#taekjakostur" onClick={(e) => { e.preventDefault(); scrollTo('#taekjakostur') }}>Sjá allan tækjakostinn</a>.
        </p>
        {V.handvalid && tillaga.join() !== V.taeki.join() ? (
          <button type="button" className="stg-linkbtn" onClick={() => setVerk({ taeki: tillaga, handvalid: false })}>Nota tillöguna aftur</button>
        ) : null}
        <div className="act">
          <Btn href="#hafa-samband" variant="brand" onClick={() => senda('verk')}>Senda sem verkbeiðni</Btn>
        </div>
      </aside>
    </div>
  )
}

/* ── tool 2: the equipment list as a catalogue ─────────────────────────── */

export function Fleet() {
  const { verk, toggleTaeki, senda } = useBrief()
  const flokkar = Array.from(new Set(TAEKI.map((t) => t.flokkur)))
  return (
    <div className="stg-fleet">
      <div className="bar" aria-live="polite">
        <p><b>{verk.taeki.length}</b> {verk.taeki.length === 1 ? 'tæki' : 'tæki'} í verkbeiðninni</p>
        <Btn href="#verkbeidni" variant="brand" onClick={() => scrollTo('#verkbeidni')}>Beiðnin</Btn>
      </div>
      {flokkar.map((f) => (
        <div key={f} className="grp">
          <h3 className="stg-label"><svg className="stg-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg><span>{f}</span></h3>
          <ul>
            {TAEKI.filter((t) => t.flokkur === f).map((t, i) => {
              const on = verk.taeki.includes(t.id)
              return (
                <li key={t.id} className={`stg-rise${t.photo ? '' : ' nophoto'}${on ? ' on' : ''}`} style={step(i)}>
                  {t.photo ? (
                    <div className="ph"><img src={t.photo.src} srcSet={t.photo.srcSet} sizes="(max-width:560px) 100vw, (max-width:1080px) 46vw, 30vw" alt={t.photo.alt} loading="lazy" decoding="async" /></div>
                  ) : null}
                  <div className="tx">
                    <p className="ln">{t.lina}</p>
                    {t.fjoldi ? <span className="stg-tag">{t.fjoldi}</span> : null}
                  </div>
                  <button type="button" className="add" aria-pressed={on} onClick={() => toggleTaeki(t.id)}>
                    <span aria-hidden="true">{on ? '✓' : '+'}</span>{on ? 'Í beiðninni' : 'Bæta í beiðni'}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
      <p className="fine">Tækjalistinn er eins og Steingarður birtir hann á vef sínum. <a href="#hafa-samband" onClick={(e) => { e.preventDefault(); senda('verk') }}>Senda verkbeiðni með þessum tækjum</a>.</p>
    </div>
  )
}

/* ── the one request form ──────────────────────────────────────────────── */

const TABS: { id: Tab; nafn: string }[] = [
  { id: 'verk', nafn: 'Verkbeiðni' },
  { id: 'snjo', nafn: 'Snjómokstur' },
  { id: 'fyrirspurn', nafn: 'Almenn fyrirspurn' },
]

type Brief = { verk: Verk; snjo: Snjo; tengilidur: Tengilidur }
export function buildBrief(tab: Tab, b: Brief): { subject: string; body: string; rows: [string, string][]; tags: string[] } {
  const rows: [string, string][] = []
  const tags: string[] = []
  let subject = ''
  if (tab === 'verk') {
    const V = b.verk
    subject = `Verkbeiðni: ${V.tegundir.length ? V.tegundir.map(tegundNafn).join(', ') : 'jarðvinna'}, ${V.sveitarfelag}`
    rows.push(['Verk', verkLysing(V)])
    rows.push(['Verkkaupi', V.verkkaupi])
    rows.push(['Staður', [V.heimilisfang, V.sveitarfelag].filter(Boolean).join(', ')])
    rows.push(['Hvenær', V.dags ? `${V.hvenaer}, ${dagsTexti(V.dags)}` : V.hvenaer])
    rows.push(['Lengd skurðar', V.lengd > 0 ? `um ${V.lengd} m` : 'Óþekkt'])
    rows.push(['Tæki', V.taeki.length ? V.taeki.map((t) => TAEKI_STUTT[t]).join(', ') : 'Verkstjóri velur'])
    tags.push(...V.tegundir.map(tegundNafn), V.sveitarfelag, V.hvenaer)
  } else if (tab === 'snjo') {
    const S = b.snjo
    subject = `Snjómokstur: ${S.tegund.toLowerCase()}`
    rows.push(['Tegund', S.tegund])
    rows.push(['Svæði', S.svaedi.length ? S.svaedi.join(', ') : 'Ekki valið'])
    rows.push(['Staður', S.heimilisfang || 'Ekki tilgreindur'])
    tags.push('Snjómokstur', S.tegund)
  } else {
    subject = 'Fyrirspurn til Steingarðs'
    rows.push(['Fyrirspurn', b.tengilidur.lysing || 'Ekki skrifuð'])
    tags.push('Fyrirspurn')
  }
  const t = b.tengilidur
  rows.push(['Nafn', t.nafn || 'Ekki tilgreint'])
  if (t.fyrirtaeki) rows.push(['Fyrirtæki', t.fyrirtaeki])
  rows.push(['Sími', t.simi || 'Ekki tilgreindur'])
  rows.push(['Netfang', t.netfang || 'Ekki tilgreint'])
  if (t.athugasemd) rows.push(['Athugasemd', t.athugasemd])
  const body = `Góðan dag,\n\n${subject}.\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nBeiðnin var sett saman á vef Steingarðs.`
  return { subject, body, rows, tags }
}

const CONTACT_KEYS = ['Nafn', 'Fyrirtæki', 'Sími', 'Netfang', 'Athugasemd']

export function RequestForm() {
  const brief = useBrief()
  const { tab, setTab, snjo, setSnjo, tengilidur: T, setTengilidur } = brief
  const [tried, setTried] = useState(false)
  const [copied, setCopied] = useState(false)
  const out = useMemo(() => buildBrief(tab, brief), [tab, brief])
  const valid = T.nafn.trim().length > 1 && (T.simi.replace(/\D/g, '').length >= 7 || /\S+@\S+\.\S+/.test(T.netfang))
  const href = `mailto:${CONTACT.netfang}?subject=${encodeURIComponent(out.subject)}&body=${encodeURIComponent(out.body)}`

  const tabsRef = useRef<HTMLDivElement | null>(null)
  const onKey = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab)
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const n = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length]
      setTab(n.id)
      requestAnimationFrame(() => tabsRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${n.id}"]`)?.focus())
    }
  }
  const copy = async () => {
    setTried(true)
    try { await navigator.clipboard.writeText(`${out.subject}\n\n${out.body}`); setCopied(true); window.setTimeout(() => setCopied(false), 2400) } catch { setCopied(false) }
  }
  const toggleSvaedi = (s: string) => setSnjo({ svaedi: snjo.svaedi.includes(s) ? snjo.svaedi.filter((x) => x !== s) : [...snjo.svaedi, s] })

  return (
    <>
      <form className="stg-req" onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="tabs" role="tablist" aria-label="Hvað viltu biðja um?" ref={tabsRef} onKeyDown={onKey}>
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" id={`stg-tab-${t.id}`} data-tab={t.id} aria-selected={tab === t.id} aria-controls="stg-panel" tabIndex={tab === t.id ? 0 : -1} onClick={() => setTab(t.id)}>{t.nafn}</button>
          ))}
        </div>
        <div className="cols" id="stg-panel" role="tabpanel" aria-labelledby={`stg-tab-${tab}`}>
          <div className="left">
            {tab === 'verk' ? (
              <div className="recap">
                <Label>Verkið þitt</Label>
                <dl>
                  {out.rows.filter(([k]) => !CONTACT_KEYS.includes(k)).map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
                <p><a className="stg-back" href="#verkbeidni" onClick={(e) => { e.preventDefault(); scrollTo('#verkbeidni-verkfaeri', 'center') }}>Breyta verkinu</a></p>
              </div>
            ) : tab === 'snjo' ? (
              <>
                <fieldset className="stg-field">
                  <legend>Samningur eða stakt skipti?</legend>
                  <div className="chips">
                    {SNJO_TEGUND.map((s) => <Chip key={s} on={snjo.tegund === s} onClick={() => setSnjo({ tegund: s })}>{s}</Chip>)}
                  </div>
                </fieldset>
                <fieldset className="stg-field">
                  <legend>Hvað á að moka?</legend>
                  <div className="chips">
                    {SNJO_SVAEDI.map((s) => <Chip key={s} on={snjo.svaedi.includes(s)} onClick={() => toggleSvaedi(s)}>{s}</Chip>)}
                  </div>
                </fieldset>
                <label className="stg-field">
                  <span className="lbl">Heimilisfang</span>
                  <input type="text" value={snjo.heimilisfang} placeholder="Til dæmis bílaplan við Dalshraun 5" onChange={(e) => setSnjo({ heimilisfang: e.target.value })} />
                </label>
              </>
            ) : (
              <label className="stg-field">
                <span className="lbl">Hvað viltu spyrja um?</span>
                <textarea rows={6} value={T.lysing} placeholder="Lýstu verkinu eða spurningunni" onChange={(e) => setTengilidur({ lysing: e.target.value })} />
              </label>
            )}
          </div>
          <div className="right">
            <div className="stg-two">
              <label className="stg-field">
                <span className="lbl">Nafn</span>
                <input type="text" value={T.nafn} autoComplete="name" onChange={(e) => setTengilidur({ nafn: e.target.value })} aria-invalid={tried && T.nafn.trim().length < 2} />
              </label>
              <label className="stg-field">
                <span className="lbl">Fyrirtæki, ef við á</span>
                <input type="text" value={T.fyrirtaeki} autoComplete="organization" onChange={(e) => setTengilidur({ fyrirtaeki: e.target.value })} />
              </label>
            </div>
            <div className="stg-two">
              <label className="stg-field">
                <span className="lbl">Sími</span>
                <input type="tel" value={T.simi} autoComplete="tel" inputMode="tel" onChange={(e) => setTengilidur({ simi: e.target.value })} />
              </label>
              <label className="stg-field">
                <span className="lbl">Netfang</span>
                <input type="email" value={T.netfang} autoComplete="email" inputMode="email" onChange={(e) => setTengilidur({ netfang: e.target.value })} />
              </label>
            </div>
            <label className="stg-field">
              <span className="lbl">Athugasemd, ef einhver er</span>
              <textarea rows={3} value={T.athugasemd} onChange={(e) => setTengilidur({ athugasemd: e.target.value })} />
            </label>
            {tried && !valid ? <p className="err" role="alert">Settu inn nafn og annaðhvort síma eða netfang, svo hægt sé að svara.</p> : null}
            <div className="acts">
              <a className="stg-btn brand" href={valid ? href : '#hafa-samband'} onClick={(e) => { if (!valid) { e.preventDefault(); setTried(true) } }}>
                <span className="lab">Opna í tölvupósti</span>
                <span className="arw l"><svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true"><path d="M11 1l5 5-5 5M16 6H0" stroke="currentColor" strokeWidth="1.4" /></svg></span>
                <span className="arw r"><svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true"><path d="M11 1l5 5-5 5M16 6H0" stroke="currentColor" strokeWidth="1.4" /></svg></span>
              </a>
              <button type="button" className="stg-btn light ghostl" onClick={copy}>
                <span className="lab">{copied ? 'Afritað' : 'Afrita beiðnina'}</span>
                <span className="arw l" />
                <span className="arw r" />
              </button>
            </div>
            <p className="fine">Þetta er frumgerð: ekkert er sent héðan. Beiðnin opnast í tölvupóstforritinu þínu, tilbúin til sendingar á {CONTACT.netfang}.</p>
          </div>
        </div>
      </form>
      <StaffPreview out={out} t={T} />
    </>
  )
}

/* ── what Steingarður sees: the same brief as it lands in their inbox ──── */

function StaffPreview({ out, t }: { out: ReturnType<typeof buildBrief>; t: Tengilidur }) {
  const fornafn = t.nafn.trim().split(/\s+/)[0] ?? ''
  const reply = t.netfang && /\S+@\S+\.\S+/.test(t.netfang)
    ? `mailto:${t.netfang}?subject=${encodeURIComponent(`Re: ${out.subject}`)}&body=${encodeURIComponent(`Góðan dag${fornafn ? ` ${fornafn}` : ''},\n\nTakk fyrir beiðnina. Við kíkjum á staðinn og sendum tilboð.\n\nKveðja,\nSteingarður ehf.\n${CONTACT.simi}`)}`
    : null
  const tel = t.simi.replace(/\D/g, '').length >= 7 ? `tel:+354${t.simi.replace(/\D/g, '').slice(-7)}` : null
  return (
    <div className="stg-staff" aria-label="Svona berst beiðnin Steingarði">
      <div className="hd">
        <Label>Svona berst beiðnin til ykkar</Label>
        <p>Allt sem verkstjórinn þarf er í einum pósti, flokkað og tilbúið til svars.</p>
      </div>
      <article className="mail">
        <header>
          <span className="av" aria-hidden="true">{(t.nafn.trim()[0] ?? '?').toUpperCase()}</span>
          <div className="who">
            <b>{t.nafn.trim() || 'Nafn viðskiptavinar'}{t.fyrirtaeki ? `, ${t.fyrirtaeki}` : ''}</b>
            <span>til {CONTACT.netfang}</span>
          </div>
          <span className="when">Rétt í þessu</span>
        </header>
        <h4>{out.subject}</h4>
        <ul className="tags">{out.tags.map((g) => <li key={g}>{g}</li>)}</ul>
        <dl>
          {out.rows.filter(([k]) => !['Nafn', 'Fyrirtæki'].includes(k)).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <footer>
          {reply ? <a className="rb" href={reply}>Svara með tölvupósti</a> : <span className="rb off">Svara með tölvupósti</span>}
          {tel ? <a className="rb" href={tel}>Hringja í {fornafn || 'viðskiptavin'}</a> : <span className="rb off">Hringja</span>}
        </footer>
      </article>
    </div>
  )
}

/* ── the look of the tools ─────────────────────────────────────────────── */
export const TOOLS_CSS = TOOLS_CSS_BASE + `
.stg-field.sub{margin:1rem 0 0}
.stg-tool .tk-h{font-size:var(--t-label);font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin:1.1rem 0 .5rem}
.stg-tool .tk{list-style:none;display:grid;gap:.4rem}
.stg-tool .tk li{display:flex;justify-content:space-between;align-items:center;gap:.6rem;padding:.35em .35em .35em .8em;border:1px solid ${C.hairline};border-radius:var(--rad);background:${C.paper}}
.stg-tool .tk button{width:44px;height:44px;border:0;background:transparent;font-size:1.3em;cursor:pointer;color:${C.ink};border-radius:var(--rad)}
.stg-tool .fine a{text-decoration:underline;text-underline-offset:.2em}
.stg-linkbtn{font:inherit;font-size:var(--t-tag);font-weight:700;background:none;border:0;padding:.7em 0;min-height:44px;color:${C.green};text-decoration:underline;text-underline-offset:.2em;cursor:pointer}
.stg-tool .sum dd{white-space:normal;text-align:right;overflow-wrap:anywhere}

/* the equipment catalogue */
.stg-fleet .bar{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;padding:1rem 1.2rem;border:1px solid ${C.hairline};border-radius:var(--rad);background:#fff;margin-bottom:calc(var(--col) * 2);position:sticky;top:calc(var(--band) / 2 + 3.6vw);z-index:5}
.stg-fleet .bar p{font-size:var(--t-lead)}
.stg-fleet .bar b{font-family:'StgDisp',system-ui,sans-serif;font-size:1.35em;font-weight:700;color:${C.green};font-variant-numeric:tabular-nums;margin-right:.15em}
@media (max-width:760px){.stg-fleet .bar{top:calc(3.448vw + 72px);padding:.5rem .6rem .5rem .9rem;flex-wrap:nowrap}.stg-fleet .bar p{font-size:15px;white-space:nowrap}
  .stg-fleet .bar .stg-btn{min-width:0;flex:none}}
.stg-fleet .grp{margin-top:calc(var(--col) * 2)}
.stg-fleet .grp>h3{margin-bottom:1rem}
.stg-fleet ul{list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--col)}
@media (max-width:1080px){.stg-fleet ul{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.stg-fleet ul{grid-template-columns:minmax(0,1fr)}}
.stg-fleet li{display:flex;flex-direction:column;border:1px solid ${C.hairline};border-radius:var(--rad);background:#fff;overflow:hidden;transition:border-color .2s cubic-bezier(.23,1,.32,1)}
.stg-fleet li.on{border-color:${C.green};box-shadow:inset 0 0 0 1px ${C.green}}
.stg-fleet .ph{aspect-ratio:3 / 2;overflow:hidden;background:#d6d6d0}
.stg-fleet .ph img{width:100%;height:100%;object-fit:cover}
.stg-fleet .tx{padding:1rem 1.1rem .4rem;display:flex;flex-direction:column;gap:.6rem;align-items:flex-start;flex:1}
.stg-fleet .ln{font-family:'StgSans',system-ui,sans-serif;font-weight:700;font-size:var(--t-smaller);line-height:1.2}
.stg-fleet .add{margin:.6rem 1.1rem 1.1rem;font:inherit;font-size:var(--t-label);font-weight:700;text-transform:uppercase;letter-spacing:.05em;min-height:46px;border-radius:var(--rad);
  border:1px solid ${C.ink};background:transparent;color:${C.ink};cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.6em;transition:background .3s,color .3s,border-color .3s}
.stg-fleet .add span{font-size:1.3em;line-height:1}
.stg-fleet .add[aria-pressed="true"]{background:${C.green};border-color:${C.green};color:#fff}
.stg-fleet .add:focus-visible{outline:2px solid ${C.green};outline-offset:2px}
.stg-fleet .fine{font-size:var(--t-tag);opacity:.75;margin-top:1.6rem}
.stg-fleet .fine a{text-decoration:underline;text-underline-offset:.2em}

/* the staff-side card */
.stg-staff{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:calc(var(--col) * 2);margin-top:calc(var(--band) / 1.4);padding-top:calc(var(--band) / 2);border-top:1px solid rgba(255,255,255,.22);align-items:start}
@media (max-width:900px){.stg-staff{grid-template-columns:minmax(0,1fr);gap:1.4rem}}
.stg-staff .hd p{margin-top:.8rem;opacity:.8;max-width:38ch}
.stg-staff .mail{background:#fff;color:${C.ink};border-radius:calc(var(--rad) * 2);padding:clamp(1rem,1.6vw,1.6rem);box-shadow:0 30px 60px -30px rgba(0,0,0,.6)}
.stg-staff .mail header{display:flex;align-items:center;gap:.8rem;padding-bottom:.9rem;border-bottom:1px solid ${C.hairline}}
.stg-staff .av{width:42px;height:42px;border-radius:50%;background:${C.green};color:#fff;display:grid;place-items:center;font-weight:700;flex:none}
.stg-staff .who{display:flex;flex-direction:column;min-width:0;flex:1}
.stg-staff .who b{overflow-wrap:anywhere}
.stg-staff .who span,.stg-staff .when{font-size:var(--t-tag);opacity:.65}
.stg-staff h4{font-family:'StgSans',system-ui,sans-serif;font-weight:700;font-size:var(--t-smaller);line-height:1.2;margin:1rem 0 .7rem}
.stg-staff .tags{list-style:none;display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.8rem}
.stg-staff .tags li{font-size:var(--t-tag);font-weight:700;padding:.25em .65em;border-radius:var(--rad);background:rgba(46,125,53,.12);color:${C.green}}
.stg-staff dl div{display:grid;grid-template-columns:minmax(0,.7fr) minmax(0,1.7fr);gap:1rem;padding:.5em 0;border-top:1px solid ${C.hairline};font-size:var(--t-body)}
.stg-staff dt{opacity:.6}
.stg-staff dd{overflow-wrap:anywhere}
.stg-staff footer{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1rem}
.stg-staff .rb{font-size:var(--t-label);font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:.9em 1.1em;border-radius:var(--rad);background:${C.asphalt};color:#fff;min-height:44px;display:inline-flex;align-items:center}
.stg-staff .rb.off{background:transparent;color:rgba(20,23,20,.45);border:1px dashed rgba(20,23,20,.3)}
@media (hover:hover) and (pointer:fine){
  .stg-fleet .add:not([aria-pressed="true"]):hover{background:${C.ink};color:#fff}
  .stg-tool .tk button:hover{background:rgba(20,23,20,.08)}
  .stg-staff a.rb:hover{background:${C.green}}
}
`
