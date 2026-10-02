import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { C, Btn, Label, Reveal, step } from './ui'
import {
  AWNINGS, BOGASKYGGNI, CONTACT, FYRIR_EFTIR, GASKUTUR, HLIDAR, MARKISA_LOFORD, PARTY_TENTS, PHOTO,
  RENTAL_ITEMS, SAUMA_FLOKKAR, TEXTI, VEISLUTJALD, type Photo,
} from './data'

/* The three tools on this page are built only from numbers Seglagerðin already
   publishes on seglagerdin.is: the party-tent table, the rental price list, and
   the awning price grids. They estimate; they never quote. Each one hands its
   selection to the single request form at the bottom, which opens the owner's
   own mail program with a finished brief. Nothing is sent from this prototype. */

export const kr = (n: number) => `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} kr.`
const m2 = (n: number) => `${n} m²`

/* ── the brief every tool writes into ──────────────────────────────────── */

export type Tab = 'leiga' | 'markisa' | 'saum'
export type TjaldGerd = 'party' | 'veisla' | 'ekkert'
export interface Leiga {
  gestir: number
  tjald: TjaldGerd
  partyFm: number
  veislaBreidd: number
  veislaEiningar: number
  items: Record<string, number>
  gaskutar: number
  dags: string
  stadur: string
}
export type MarkisaGerd = 'opin' | 'lokud' | 'hlidar' | 'boga'
export interface Markisa { gerd: MarkisaGerd; breidd: number; lengd: number; haed: number; motor: boolean }
export interface Saum { flokkur: string; lysing: string; mal: string }
export interface Tengilidur { nafn: string; simi: string; netfang: string; athugasemd: string }

const suggestParty = (gestir: number) => PARTY_TENTS.find((t) => gestir <= t.gestirMax) ?? null
const veisluRaekt = (breidd: number) => ({
  min: Math.ceil(VEISLUTJALD.minFm / (breidd * VEISLUTJALD.einingMetrar)),
  max: Math.floor(VEISLUTJALD.maxFm / (breidd * VEISLUTJALD.einingMetrar)),
})
export const veisluFm = (breidd: number, einingar: number) => breidd * VEISLUTJALD.einingMetrar * einingar

const tentFm = (l: Leiga) => (l.tjald === 'party' ? l.partyFm : l.tjald === 'veisla' ? veisluFm(l.veislaBreidd, l.veislaEiningar) : 0)
const defaultItems = (gestir: number, fm: number): Record<string, number> => {
  const bord = Math.max(0, Math.ceil(gestir / 8))
  return { bord, bekkur: bord * 2, standbord: 0, golf: fm, hitari: fm > 0 ? Math.ceil(fm / 30) : 0 }
}

const START_LEIGA: Leiga = (() => {
  const t = suggestParty(40)!
  return { gestir: 40, tjald: 'party', partyFm: t.fm, veislaBreidd: 6, veislaEiningar: 3, items: defaultItems(40, t.fm), gaskutar: 0, dags: '', stadur: '' }
})()
const START_MARKISA: Markisa = { gerd: 'opin', breidd: 300, lengd: 210, haed: 210, motor: false }

interface BriefCtx {
  tab: Tab
  setTab: (t: Tab) => void
  leiga: Leiga
  setLeiga: (patch: Partial<Leiga>) => void
  /** gestir or tent changed: refill the equipment counts from their guide numbers */
  stingaUpp: (patch: Partial<Leiga>) => void
  markisa: Markisa
  setMarkisa: (patch: Partial<Markisa>) => void
  saum: Saum
  setSaum: (patch: Partial<Saum>) => void
  tengilidur: Tengilidur
  setTengilidur: (patch: Partial<Tengilidur>) => void
  /** jump to the request form with this tab open */
  senda: (t: Tab) => void
}
const Ctx = createContext<BriefCtx | null>(null)
export function useBrief() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useBrief outside BriefProvider')
  return c
}

export function BriefProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<Tab>('leiga')
  const [leiga, setL] = useState<Leiga>(START_LEIGA)
  const [markisa, setM] = useState<Markisa>(START_MARKISA)
  const [saum, setS] = useState<Saum>({ flokkur: SAUMA_FLOKKAR[0], lysing: '', mal: '' })
  const [tengilidur, setT] = useState<Tengilidur>({ nafn: '', simi: '', netfang: '', athugasemd: '' })
  const setLeiga = useCallback((p: Partial<Leiga>) => setL((o) => ({ ...o, ...p })), [])
  const stingaUpp = useCallback((p: Partial<Leiga>) => setL((o) => {
    const n = { ...o, ...p }
    return { ...n, items: defaultItems(n.gestir, tentFm(n)) }
  }), [])
  const setMarkisa = useCallback((p: Partial<Markisa>) => setM((o) => ({ ...o, ...p })), [])
  const setSaum = useCallback((p: Partial<Saum>) => setS((o) => ({ ...o, ...p })), [])
  const setTengilidur = useCallback((p: Partial<Tengilidur>) => setT((o) => ({ ...o, ...p })), [])
  const senda = useCallback((t: Tab) => {
    setTab(t)
    const el = document.querySelector('#hafa-samband')
    el?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }, [])
  const value = useMemo(
    () => ({ tab, setTab, leiga, setLeiga, stingaUpp, markisa, setMarkisa, saum, setSaum, tengilidur, setTengilidur, senda }),
    [tab, leiga, markisa, saum, tengilidur, setLeiga, stingaUpp, setMarkisa, setSaum, setTengilidur, senda],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/* ── small controls ────────────────────────────────────────────────────── */

function Chip({ on, onClick, children, disabled, label }: { on: boolean; onClick: () => void; children: ReactNode; disabled?: boolean; label?: string }) {
  return (
    <button type="button" className="aeg-chip" aria-pressed={on} disabled={disabled} onClick={onClick} aria-label={label}>
      {children}
    </button>
  )
}

function Stepper({ value, onChange, min = 0, max = 999, label, unit }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string; unit?: string }) {
  /* the field keeps what is being typed until it is a valid number in range, so
     clearing it to type a new figure does not snap it to the minimum mid-edit */
  const [draft, setDraft] = useState<string | null>(null)
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  const step = (d: number) => { setDraft(null); onChange(clamp(value + d)) }
  return (
    <div className="aeg-stepper" role="group" aria-label={label}>
      <button type="button" aria-label={`Fækka: ${label}`} onClick={() => step(-1)} disabled={value <= min}>
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
      <button type="button" aria-label={`Fjölga: ${label}`} onClick={() => step(1)} disabled={value >= max}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M0 6h12M6 0v12" stroke="currentColor" strokeWidth="1.6" /></svg>
      </button>
    </div>
  )
}

/* ── tool 1: tent hire, from their party-tent table and rental list ────── */

export function RentalBuilder() {
  const { leiga: L, setLeiga, stingaUpp, senda } = useBrief()
  const fm = tentFm(L)
  const party = PARTY_TENTS.find((t) => t.fm === L.partyFm) ?? PARTY_TENTS[0]
  const rec = suggestParty(L.gestir)
  const range = veisluRaekt(L.veislaBreidd)

  const lines = RENTAL_ITEMS.map((it) => ({ it, n: L.items[it.id] ?? 0 })).filter((x) => x.n > 0)
  const itemsTotal = lines.reduce((s, x) => s + x.n * x.it.verd, 0) + L.gaskutar * GASKUTUR.verd
  const tentPrice = L.tjald === 'party' ? party.verd : 0
  const total = tentPrice + itemsTotal

  const pickGestir = (gestir: number) => {
    const r = suggestParty(gestir)
    if (L.tjald === 'ekkert') { stingaUpp({ gestir }); return }
    if (r) stingaUpp({ gestir, tjald: 'party', partyFm: r.fm })
    else stingaUpp({ gestir, tjald: 'veisla' })
  }
  const pickTjald = (tjald: TjaldGerd) => {
    if (tjald === 'party') stingaUpp({ tjald, partyFm: (suggestParty(L.gestir) ?? PARTY_TENTS[PARTY_TENTS.length - 1]).fm })
    else if (tjald === 'veisla') {
      const r = veisluRaekt(L.veislaBreidd)
      stingaUpp({ tjald, veislaEiningar: r.min })
    } else stingaUpp({ tjald })
  }
  const setItem = (id: string, n: number) => setLeiga({ items: { ...L.items, [id]: n } })

  return (
    <div className="aeg-tool" id="tjaldaleiga-verkfaeri">
      <div className="inp">
        <p className="mini" aria-hidden="true"><span>Áætlað verð</span><b>{kr(total)}</b></p>
        <h3 className="aeg-label"><svg className="aeg-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg><span>Settu saman viðburðinn</span></h3>

        <fieldset className="aeg-field">
          <legend>Hve margir gestir?</legend>
          <Stepper value={L.gestir} onChange={pickGestir} min={1} max={2000} label="Fjöldi gesta" unit="gestir" />
          <p className="hint" aria-live="polite">
            {L.tjald === 'ekkert'
              ? 'Þú leigir aðeins borð, bekki, gólf eða hita.'
              : rec
                ? `Fyrir ${L.gestir} gesti hentar partýtjald ${rec.fm} m² (${rec.gestir} gestir).`
                : 'Yfir 100 gestir: þá hentar Veislutjaldið, sem er verðlagt sem tilboð.'}
          </p>
        </fieldset>

        <fieldset className="aeg-field">
          <legend>Tjald</legend>
          <div className="chips">
            <Chip on={L.tjald === 'party'} onClick={() => pickTjald('party')}>Partýtjald</Chip>
            <Chip on={L.tjald === 'veisla'} onClick={() => pickTjald('veisla')}>Veislutjaldið</Chip>
            <Chip on={L.tjald === 'ekkert'} onClick={() => pickTjald('ekkert')}>Ekkert tjald</Chip>
          </div>
          {L.tjald === 'party' ? (
            <div className="chips sizes" role="group" aria-label="Stærð partýtjalds">
              {PARTY_TENTS.map((t) => (
                <Chip key={t.fm} on={t.fm === L.partyFm} onClick={() => stingaUpp({ partyFm: t.fm })} label={`${t.fm} fermetrar, ${t.mal}, ${t.gestir} gestir, ${kr(t.verd)}`}>
                  <b>{m2(t.fm)}</b><small>{t.gestir}</small>
                </Chip>
              ))}
            </div>
          ) : null}
          {L.tjald === 'veisla' ? (
            <div className="veisla">
              <div className="chips" role="group" aria-label="Breidd Veislutjaldsins">
                {VEISLUTJALD.breidd.map((b) => (
                  <Chip key={b} on={b === L.veislaBreidd} onClick={() => {
                    const r = veisluRaekt(b)
                    stingaUpp({ veislaBreidd: b, veislaEiningar: Math.min(r.max, Math.max(r.min, L.veislaEiningar)) })
                  }}>{b} m breitt</Chip>
                ))}
              </div>
              <div className="row">
                <Stepper value={L.veislaEiningar} onChange={(n) => stingaUpp({ veislaEiningar: n })} min={range.min} max={range.max} label="Fjöldi eininga, hver 3 metra löng" unit="einingar" />
                <p className="hint">{m2(fm)}, {L.veislaEiningar * VEISLUTJALD.einingMetrar} m á lengd. Veislutjaldið er verðlagt sem tilboð.</p>
              </div>
            </div>
          ) : null}
        </fieldset>

        <fieldset className="aeg-field">
          <legend>Borð, bekkir, gólf og hitarar</legend>
          <p className="hint">Tillaga: eitt borð á hverja 8 gesti með tveimur bekkjum, einn hitablásari á hverja 30 m² og gólf undir allt tjaldið, eins og Seglagerðin lýsir búnaðinum. Breyttu eins og þarf.</p>
          <ul className="items">
            {RENTAL_ITEMS.map((it) => (
              <li key={it.id}>
                <div>
                  <span className="nm">{it.nafn}</span>
                  <span className="sub">{it.fyrir}, {kr(it.verd)} {it.eining === 'm²' ? 'á fermetra' : 'stykkið'}</span>
                </div>
                <Stepper value={L.items[it.id] ?? 0} onChange={(n) => setItem(it.id, n)} min={0} max={it.hamark} label={it.nafn} unit={it.eining === 'm²' ? 'm²' : ''} />
              </li>
            ))}
            <li>
              <div>
                <span className="nm">{GASKUTUR.nafn}</span>
                <span className="sub">{kr(GASKUTUR.verd)} stykkið. Með hverjum hitablásara fylgir 11 kg gaskútur en leigjandinn þarf sjálfur að kaupa áfyllingu.</span>
              </div>
              <Stepper value={L.gaskutar} onChange={(n) => setLeiga({ gaskutar: n })} min={0} max={40} label="Fullir gaskútar" />
            </li>
          </ul>
        </fieldset>

        <div className="aeg-two">
          <label className="aeg-field">
            <span className="lbl">Dagsetning</span>
            <span className="datewrap">
              <input type="date" value={L.dags} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setLeiga({ dags: e.target.value })} />
              {L.dags ? null : <span className="ph" aria-hidden="true">Veldu dagsetningu</span>}
            </span>
          </label>
          <label className="aeg-field">
            <span className="lbl">Staður</span>
            <input type="text" value={L.stadur} placeholder="Til dæmis garðurinn heima" autoComplete="off" onChange={(e) => setLeiga({ stadur: e.target.value })} />
          </label>
        </div>
      </div>

      <aside className="out" aria-label="Áætlun">
        <Label>Áætlað verð</Label>
        <dl className="sum">
          {L.tjald === 'party' ? (
            <div><dt>Partýtjald {m2(party.fm)}</dt><dd>{kr(party.verd)}</dd></div>
          ) : L.tjald === 'veisla' ? (
            <div><dt>Veislutjald {m2(fm)}</dt><dd>Tilboð</dd></div>
          ) : null}
          {lines.map(({ it, n }) => (
            <div key={it.id}><dt>{it.nafn}, {n} {it.eining === 'm²' ? 'm²' : 'stk.'}</dt><dd>{kr(n * it.verd)}</dd></div>
          ))}
          {L.gaskutar > 0 ? <div><dt>{GASKUTUR.nafn}, {L.gaskutar} stk.</dt><dd>{kr(L.gaskutar * GASKUTUR.verd)}</dd></div> : null}
        </dl>
        <p className="total" aria-live="polite">
          <span className="aeg-num">{kr(total)}</span>
          <small>{L.tjald === 'veisla' ? 'án Veislutjaldsins' : 'dagleiga eða helgarleiga'}</small>
        </p>
        <p className="fine">
          Verðin eru verðskrá Seglagerðarinnar á þeim dögum sem frumgerðin var gerð. Dagleiga er einn dagur frá mánudegi til föstudags, helgarleiga frá föstudegi til mánudagsmorguns. Starfsmaður staðfestir dagsetningu og verð.
        </p>
        <div className="act">
          <Btn href="#hafa-samband" variant="brand" onClick={() => senda('leiga')}>Senda sem beiðni</Btn>
        </div>
      </aside>
    </div>
  )
}

/* ── tool 2: awning price finder, from their price grids ───────────────── */

const GERDIR: { id: MarkisaGerd; nafn: string }[] = [
  { id: 'opin', nafn: 'Opið box' },
  { id: 'lokud', nafn: 'Hlífðarbox' },
  { id: 'hlidar', nafn: 'Hliðarmarkísa' },
  { id: 'boga', nafn: 'Bogaskyggni' },
]

export function awningPrice(m: Markisa): { grunn: number; motor: number; innifalid: string } | null {
  if (m.gerd === 'opin' || m.gerd === 'lokud') {
    const g = AWNINGS.find((a) => a.id === m.gerd)!
    const row = g.rader[m.breidd]
    const idx = g.lengdir.indexOf(m.lengd)
    if (!row || idx < 0 || idx >= row.length) return null
    return { grunn: row[idx], motor: g.motor, innifalid: g.innifalid }
  }
  if (m.gerd === 'hlidar') {
    const row = HLIDAR.verd[m.haed]
    const idx = HLIDAR.lengdir.indexOf(m.lengd)
    if (!row || idx < 0) return null
    return { grunn: row[idx], motor: 0, innifalid: '' }
  }
  const idx = BOGASKYGGNI.breiddir.indexOf(m.breidd)
  if (idx < 0) return null
  return { grunn: BOGASKYGGNI.verd[idx], motor: 0, innifalid: '' }
}

export function AwningFinder() {
  const { markisa: M, setMarkisa, senda } = useBrief()
  const grid = AWNINGS.find((a) => a.id === M.gerd)
  const breiddir = grid ? Object.keys(grid.rader).map(Number) : M.gerd === 'boga' ? BOGASKYGGNI.breiddir : []
  const lengdir = grid ? grid.lengdir : HLIDAR.lengdir
  const offered = (b: number, l: number) => {
    if (!grid) return true
    const row = grid.rader[b]
    const idx = grid.lengdir.indexOf(l)
    return !!row && idx >= 0 && idx < row.length
  }
  const maxLengd = (b: number) => {
    if (!grid) return M.lengd
    const row = grid.rader[b] ?? []
    return grid.lengdir[Math.max(0, row.length - 1)]
  }

  const pickGerd = (gerd: MarkisaGerd) => {
    const g = AWNINGS.find((a) => a.id === gerd)
    if (g) {
      const bs = Object.keys(g.rader).map(Number)
      const b = bs.includes(M.breidd) ? M.breidd : bs.reduce((p, c) => (Math.abs(c - M.breidd) < Math.abs(p - M.breidd) ? c : p), bs[0])
      const row = g.rader[b]
      const l = g.lengdir.indexOf(M.lengd) < row.length && g.lengdir.indexOf(M.lengd) >= 0 ? M.lengd : g.lengdir[row.length - 1]
      setMarkisa({ gerd, breidd: b, lengd: l })
    } else if (gerd === 'hlidar') setMarkisa({ gerd, haed: 210, lengd: 300, motor: false })
    else setMarkisa({ gerd, breidd: 300, motor: false })
  }
  const pickBreidd = (b: number) => {
    if (grid && !offered(b, M.lengd)) setMarkisa({ breidd: b, lengd: maxLengd(b) })
    else setMarkisa({ breidd: b })
  }

  const p = awningPrice(M)
  const motorOk = M.gerd === 'opin' || M.gerd === 'lokud'
  const total = p ? p.grunn + (motorOk && M.motor ? p.motor : 0) : 0
  const photo: Photo = M.gerd === 'lokud' ? PHOTO.markisaBox : M.gerd === 'hlidar' ? PHOTO.hlidar : M.gerd === 'boga' ? PHOTO.einstok : PHOTO.markisaOpin

  return (
    <div className="aeg-tool" id="markisa-verkfaeri">
      <div className="inp">
        <p className="mini" aria-hidden="true"><span>Verð samkvæmt verðskrá</span><b>{p ? kr(total) : 'Tilboð'}</b></p>
        <h3 className="aeg-label"><svg className="aeg-dot" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.5" /></svg><span>Finndu verð</span></h3>

        <fieldset className="aeg-field">
          <legend>Gerð</legend>
          <div className="chips" role="group" aria-label="Gerð markísu">
            {GERDIR.map((g) => <Chip key={g.id} on={g.id === M.gerd} onClick={() => pickGerd(g.id)}>{g.nafn}</Chip>)}
          </div>
        </fieldset>

        {M.gerd === 'hlidar' ? (
          <>
            <fieldset className="aeg-field">
              <legend>Hæð</legend>
              <div className="chips" role="group" aria-label="Hæð hliðarmarkísu">
                {HLIDAR.haedir.map((h) => <Chip key={h} on={h === M.haed} onClick={() => setMarkisa({ haed: h })}>{h} cm</Chip>)}
              </div>
            </fieldset>
            <fieldset className="aeg-field">
              <legend>Út frá vegg</legend>
              <div className="chips" role="group" aria-label="Lengd hliðarmarkísu">
                {HLIDAR.lengdir.map((l) => <Chip key={l} on={l === M.lengd} onClick={() => setMarkisa({ lengd: l })}>{l} cm</Chip>)}
              </div>
            </fieldset>
          </>
        ) : (
          <>
            <fieldset className="aeg-field">
              <legend>Breidd</legend>
              <div className="chips" role="group" aria-label="Breidd">
                {breiddir.map((b) => <Chip key={b} on={b === M.breidd} onClick={() => pickBreidd(b)}>{b} cm</Chip>)}
              </div>
            </fieldset>
            {grid ? (
              <fieldset className="aeg-field">
                <legend>Útdraganleg lengd</legend>
                <div className="chips" role="group" aria-label="Útdraganleg lengd">
                  {lengdir.map((l) => (
                    <Chip key={l} on={l === M.lengd} onClick={() => setMarkisa({ lengd: l })} disabled={!offered(M.breidd, l)}
                      label={offered(M.breidd, l) ? `${l} cm` : `${l} cm, ekki í boði á þessari breidd`}>{l} cm</Chip>
                  ))}
                </div>
                <p className="hint">Valkostir sem eru strikaðir yfir eru ekki í boði á þeirri breidd sem þú valdir, samkvæmt verðtöflu Seglagerðarinnar.</p>
              </fieldset>
            ) : (
              <p className="hint">{BOGASKYGGNI.texti}</p>
            )}
          </>
        )}

        {motorOk ? (
          <label className="aeg-check">
            <input type="checkbox" checked={M.motor} onChange={(e) => setMarkisa({ motor: e.target.checked })} />
            <span>Rafdrifin, {kr(grid!.motor)} aukalega. Annars er markísan skrúfuð út með sveif.</span>
          </label>
        ) : null}
        {M.gerd === 'hlidar' ? <p className="hint">{HLIDAR.texti}</p> : null}
      </div>

      <aside className="out" aria-label="Verð">
        <div className="shot"><img src={photo.src} srcSet={photo.srcSet} sizes="(max-width:900px) 100vw, 30vw" alt={photo.alt} loading="lazy" decoding="async" /></div>
        <Label>Verð samkvæmt verðskrá</Label>
        {p ? (
          <>
            <p className="total" aria-live="polite">
              <span className="aeg-num">{kr(total)}</span>
              <small>{M.gerd === 'boga' ? `${BOGASKYGGNI.dypt} cm út, ${M.breidd} cm breitt` : M.gerd === 'hlidar' ? `${M.haed} cm á hæð, ${M.lengd} cm út` : `${M.breidd} cm breið, ${M.lengd} cm út`}</small>
            </p>
            {p.innifalid ? <p className="fine">Innifalið: {p.innifalid}.</p> : null}
            {motorOk && M.motor ? <p className="fine">Þar af mótor {kr(p.motor)}.</p> : null}
          </>
        ) : (
          <p className="fine">Þessi samsetning er ekki í verðtöflu Seglagerðarinnar. Segðu okkur stærðina og við mælum og sérhönnum markísu fyrir þitt hús.</p>
        )}
        <p className="fine">{TEXTI.markisaFyrirvari}</p>
        <div className="act">
          <Btn href="#hafa-samband" variant="brand" onClick={() => senda('markisa')}>Biðja um mælingu</Btn>
        </div>
      </aside>
    </div>
  )
}

export function MarkisaLoford() {
  return (
    <ul className="aeg-loford">
      {MARKISA_LOFORD.map((t, i) => <li key={t} className="aeg-rise" style={step(i + 1)}>{t}</li>)}
    </ul>
  )
}

/* ── tool 3: before / after, two pairs their own files date ────────────── */

export function BeforeAfter({ only }: { only?: 'pottur' | 'laug' }) {
  const [i, setI] = useState(() => Math.max(0, FYRIR_EFTIR.findIndex((p) => p.id === only)))
  const [pos, setPos] = useState(50)
  const stage = useRef<HTMLDivElement | null>(null)
  const drag = useRef(false)
  const pair = FYRIR_EFTIR[i]

  const set = (clientX: number) => {
    const el = stage.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }
  useEffect(() => { setPos(50) }, [i])

  return (
    <div className="aeg-ba">
      {only ? null : (
        <div className="chips ba-tabs" role="group" aria-label="Veldu verk">
          {FYRIR_EFTIR.map((p, n) => <Chip key={p.id} on={n === i} onClick={() => setI(n)}>{p.titill}</Chip>)}
        </div>
      )}
      <div
        ref={stage}
        className="stage"
        style={{ ['--pos' as string]: `${pos}%` }}
        onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); set(e.clientX) }}
        onPointerMove={(e) => { if (drag.current) set(e.clientX) }}
        onPointerUp={() => { drag.current = false }}
        onPointerCancel={() => { drag.current = false }}
      >
        <img className="after" src={pair.eftir.src} srcSet={pair.eftir.srcSet} sizes="(max-width:900px) 100vw, 70vw" alt={pair.eftir.alt} loading="lazy" decoding="async" draggable={false} />
        <img className="before" src={pair.fyrir.src} srcSet={pair.fyrir.srcSet} sizes="(max-width:900px) 100vw, 70vw" alt={pair.fyrir.alt} loading="lazy" decoding="async" draggable={false} />
        <span className="tag l">Áður</span>
        <span className="tag r">Eftir</span>
        <span className="bar" aria-hidden="true"><i /></span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Dragðu til að bera saman fyrir og eftir: ${pair.titill}`}
        />
      </div>
      <p className="cap">{pair.titill}. Myndirnar eru dagsettar {pair.dagsetning}.</p>
    </div>
  )
}

/* ── the one request form ──────────────────────────────────────────────── */

const TABS: { id: Tab; nafn: string }[] = [
  { id: 'leiga', nafn: 'Tjaldaleiga' },
  { id: 'markisa', nafn: 'Markísa eða skyggni' },
  { id: 'saum', nafn: 'Sérsaumur eða viðgerð' },
]

export function buildBrief(tab: Tab, b: { leiga: Leiga; markisa: Markisa; saum: Saum; tengilidur: Tengilidur }): { subject: string; body: string; rows: [string, string][] } {
  const rows: [string, string][] = []
  let subject = ''
  if (tab === 'leiga') {
    const L = b.leiga
    const fm = tentFm(L)
    const party = PARTY_TENTS.find((t) => t.fm === L.partyFm) ?? PARTY_TENTS[0]
    subject = 'Beiðni um tjaldaleigu'
    rows.push(['Gestir', String(L.gestir)])
    rows.push(['Dagsetning', L.dags ? new Date(L.dags + 'T12:00:00').toLocaleDateString('is-IS', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Ekki valin'])
    rows.push(['Staður', L.stadur || 'Ekki tilgreindur'])
    rows.push(['Tjald', L.tjald === 'party' ? `Partýtjald ${m2(party.fm)} (${party.mal}), ${kr(party.verd)}` : L.tjald === 'veisla' ? `Veislutjald ${m2(fm)}, ${L.veislaBreidd} m breitt, ${L.veislaEiningar} einingar, tilboð óskast` : 'Ekkert tjald'])
    RENTAL_ITEMS.forEach((it) => { const n = L.items[it.id] ?? 0; if (n > 0) rows.push([it.nafn, `${n} ${it.eining === 'm²' ? 'm²' : 'stk.'}, ${kr(n * it.verd)}`]) })
    if (L.gaskutar > 0) rows.push([GASKUTUR.nafn, `${L.gaskutar} stk., ${kr(L.gaskutar * GASKUTUR.verd)}`])
    const total = (L.tjald === 'party' ? party.verd : 0) + RENTAL_ITEMS.reduce((s, it) => s + (L.items[it.id] ?? 0) * it.verd, 0) + L.gaskutar * GASKUTUR.verd
    rows.push(['Áætlað verð', `${kr(total)}${L.tjald === 'veisla' ? ' án Veislutjaldsins' : ''}, samkvæmt verðskrá, dagleiga eða helgarleiga`])
  } else if (tab === 'markisa') {
    const M = b.markisa
    const p = awningPrice(M)
    const g = GERDIR.find((x) => x.id === M.gerd)!.nafn
    subject = 'Beiðni um mælingu og tilboð í markísu'
    rows.push(['Gerð', g])
    if (M.gerd === 'hlidar') { rows.push(['Hæð', `${M.haed} cm`]); rows.push(['Út frá vegg', `${M.lengd} cm`]) }
    else if (M.gerd === 'boga') { rows.push(['Breidd', `${M.breidd} cm`]); rows.push(['Dýpt', `${BOGASKYGGNI.dypt} cm`]) }
    else { rows.push(['Breidd', `${M.breidd} cm`]); rows.push(['Útdraganleg lengd', `${M.lengd} cm`]); rows.push(['Drif', M.motor ? 'Rafdrifin' : 'Sveif']) }
    if (p) rows.push(['Verð samkvæmt verðskrá', kr(p.grunn + ((M.gerd === 'opin' || M.gerd === 'lokud') && M.motor ? p.motor : 0))])
  } else {
    subject = `Beiðni um sérsaum eða viðgerð: ${b.saum.flokkur}`
    rows.push(['Tegund', b.saum.flokkur])
    rows.push(['Lýsing', b.saum.lysing || 'Ekki tilgreind'])
    rows.push(['Stærð eða mál', b.saum.mal || 'Ekki tilgreind'])
  }
  const t = b.tengilidur
  rows.push(['Nafn', t.nafn || 'Ekki tilgreint'])
  rows.push(['Sími', t.simi || 'Ekki tilgreindur'])
  rows.push(['Netfang', t.netfang || 'Ekki tilgreint'])
  if (t.athugasemd) rows.push(['Athugasemd', t.athugasemd])
  const body = `Sæl,\n\n${subject}.\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nBeiðnin var sett saman á vef Seglagerðarinnar.`
  return { subject, body, rows }
}

export function RequestForm() {
  const brief = useBrief()
  const { tab, setTab, saum, setSaum, tengilidur: T, setTengilidur } = brief
  const [tried, setTried] = useState(false)
  const [copied, setCopied] = useState(false)
  const out = useMemo(() => buildBrief(tab, brief), [tab, brief])
  const valid = T.nafn.trim().length > 1 && (T.simi.trim().length > 4 || /\S+@\S+\.\S+/.test(T.netfang))
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

  return (
    <form className="aeg-req" onSubmit={(e) => e.preventDefault()} noValidate>
      <div className="tabs" role="tablist" aria-label="Hvað viltu biðja um?" ref={tabsRef} onKeyDown={onKey}>
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" id={`aeg-tab-${t.id}`} data-tab={t.id} aria-selected={tab === t.id} aria-controls="aeg-panel" tabIndex={tab === t.id ? 0 : -1} onClick={() => setTab(t.id)}>{t.nafn}</button>
        ))}
      </div>
      <div className="cols" id="aeg-panel" role="tabpanel" aria-labelledby={`aeg-tab-${tab}`}>
        <div className="left">
          {tab === 'saum' ? (
            <>
              <label className="aeg-field">
                <span className="lbl">Hvað er verkefnið?</span>
                <select value={saum.flokkur} onChange={(e) => setSaum({ flokkur: e.target.value })}>
                  {SAUMA_FLOKKAR.map((f) => <option key={f}>{f}</option>)}
                </select>
              </label>
              <label className="aeg-field">
                <span className="lbl">Lýstu því</span>
                <textarea rows={4} value={saum.lysing} placeholder="Hvað á að sauma eða gera við, og til hvers?" onChange={(e) => setSaum({ lysing: e.target.value })} />
              </label>
              <label className="aeg-field">
                <span className="lbl">Stærð eða mál, ef þú veist</span>
                <input type="text" value={saum.mal} placeholder="Til dæmis 3,2 m á lengd og 1,1 m á hæð" onChange={(e) => setSaum({ mal: e.target.value })} />
              </label>
              <p className="hint">Myndir hjálpa mikið. Hengdu þær við tölvupóstinn þegar hann opnast.</p>
            </>
          ) : (
            <div className="recap">
              <Label>{tab === 'leiga' ? 'Viðburðurinn þinn' : 'Markísan þín'}</Label>
              <dl>
                {out.rows.filter(([k]) => !['Nafn', 'Sími', 'Netfang', 'Athugasemd'].includes(k)).map(([k, v]) => (
                  <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
              <p className="hint">{tab === 'leiga' ? 'Breyttu viðburðinum hér að ofan í tjaldaleigunni.' : 'Breyttu stærðinni hér að ofan í verðleitinni.'}</p>
              <p><a className="aeg-back" href={tab === 'leiga' ? '#tjaldaleiga' : '#markisur'} onClick={(e) => { e.preventDefault(); document.querySelector(tab === 'leiga' ? '#tjaldaleiga-verkfaeri' : '#markisa-verkfaeri')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}>Breyta</a></p>
            </div>
          )}
        </div>
        <div className="right">
          <label className="aeg-field">
            <span className="lbl">Nafn</span>
            <input type="text" value={T.nafn} autoComplete="name" onChange={(e) => setTengilidur({ nafn: e.target.value })} aria-invalid={tried && T.nafn.trim().length < 2} />
          </label>
          <div className="aeg-two">
            <label className="aeg-field">
              <span className="lbl">Sími</span>
              <input type="tel" value={T.simi} autoComplete="tel" inputMode="tel" onChange={(e) => setTengilidur({ simi: e.target.value })} />
            </label>
            <label className="aeg-field">
              <span className="lbl">Netfang</span>
              <input type="email" value={T.netfang} autoComplete="email" inputMode="email" onChange={(e) => setTengilidur({ netfang: e.target.value })} />
            </label>
          </div>
          <label className="aeg-field">
            <span className="lbl">Athugasemd, ef einhver er</span>
            <textarea rows={3} value={T.athugasemd} onChange={(e) => setTengilidur({ athugasemd: e.target.value })} />
          </label>
          {tried && !valid ? <p className="err" role="alert">Settu inn nafn og annaðhvort síma eða netfang, svo við getum svarað.</p> : null}
          <div className="acts">
            <a
              className="aeg-btn brand"
              href={valid ? href : '#hafa-samband'}
              onClick={(e) => { if (!valid) { e.preventDefault(); setTried(true) } }}
            >
              <span className="lab">Opna í tölvupósti</span>
              <span className="arw l"><svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}><path d="M11 1l5 5-5 5M16 6H0" stroke="currentColor" strokeWidth="1.4" /></svg></span>
              <span className="arw r"><svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true"><path d="M11 1l5 5-5 5M16 6H0" stroke="currentColor" strokeWidth="1.4" /></svg></span>
            </a>
            <button type="button" className="aeg-btn light ghostl" onClick={copy}>
              <span className="lab">{copied ? 'Afritað' : 'Afrita beiðnina'}</span>
              <span className="arw l" />
              <span className="arw r" />
            </button>
          </div>
          <p className="fine">Þetta er frumgerð: ekkert er sent héðan. Beiðnin opnast í tölvupóstforritinu þínu, tilbúin til sendingar á {CONTACT.netfang}.</p>
        </div>
      </div>
    </form>
  )
}

/* ── shared look of the three tools ────────────────────────────────────── */
export const TOOLS_CSS = `
.aeg-tool{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:calc(var(--col) * 2);align-items:start}
@media (max-width:900px){.aeg-tool{grid-template-columns:minmax(0,1fr);gap:2.2rem}}
.aeg-tool .inp>h3{margin-bottom:1.6rem}
/* on a phone the price panel sits below the inputs, so a slim live total rides
   under the floating header while the inputs are being changed */
.aeg-tool .mini{display:none}
@media (max-width:900px){.aeg-tool .mini{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;position:sticky;top:calc(3.448vw + 66px);z-index:5;
  margin:0 0 1.2rem;padding:.7em .9em;background:${C.blue};color:#fff;border-radius:var(--rad);font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.05em}
  .aeg-tool .mini b{font-size:clamp(18px,5vw,22px);font-weight:600;letter-spacing:-.01em;text-transform:none;font-variant-numeric:tabular-nums;white-space:nowrap}}
.aeg-tool .out{position:sticky;top:calc(var(--band) / 2 + 3vw);border:1px solid ${C.hairline};border-radius:var(--rad);background:#fff;padding:calc(var(--col) * 1.4)}
.aeg-band.white .aeg-tool .out{background:${C.paper}}
@media (max-width:900px){.aeg-tool .out{position:static}}
.aeg-tool .out .aeg-label{margin-bottom:.9rem}
.aeg-tool .out .shot{aspect-ratio:3 / 2;overflow:hidden;border-radius:var(--rad);margin-bottom:1.1rem;background:#d8d4cf}
.aeg-tool .out .shot img{width:100%;height:100%;object-fit:cover}
.aeg-tool .sum{display:grid;gap:0;margin-bottom:1rem}
.aeg-tool .sum div{display:flex;justify-content:space-between;gap:1rem;padding:.55em 0;border-top:1px solid ${C.hairline};font-size:var(--t-body)}
.aeg-tool .sum dd{white-space:nowrap;font-variant-numeric:tabular-nums}
.aeg-tool .total{display:flex;flex-direction:column;gap:.3em;padding:.9em 0 .4em;border-top:1px solid ${C.ink}}
.aeg-tool .total small{font-size:var(--t-tag);letter-spacing:.04em;opacity:.7}
.aeg-tool .fine{font-size:var(--t-tag);line-height:1.5;opacity:.72;margin-top:.7em}
.aeg-tool .act{margin-top:1.4rem}
.aeg-tool .act .aeg-btn{width:100%}

.aeg-field{display:block;border:0;margin:0 0 1.6rem;min-width:0}
.aeg-field legend,.aeg-field .lbl{display:block;font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.7em;padding:0}
.aeg-field input[type="date"]{-webkit-appearance:none;appearance:none;min-width:0;max-width:100%;display:block}
.aeg-field input[type=text],.aeg-field input[type=tel],.aeg-field input[type=email],.aeg-field input[type="date"],.aeg-field select,.aeg-field textarea{
  width:100%;font:inherit;font-size:max(16px,var(--t-body));color:${C.ink};background:#fff;border:1px solid rgba(18,20,23,.3);border-radius:var(--rad);
  padding:.8em .9em;min-height:48px;-webkit-appearance:none;appearance:none}
.aeg-band.white .aeg-field input,.aeg-band.white .aeg-field select,.aeg-band.white .aeg-field textarea{background:${C.paper}}
.aeg-field select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23121417' stroke-width='1.4'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .9em center;padding-right:2.4em}
.aeg-field textarea{resize:vertical;line-height:1.5}
/* an iOS date field with its native look removed is a blank box until a date is
   chosen, so an empty one carries its own words */
.aeg-field .datewrap{position:relative;display:block}
.aeg-field .datewrap .ph{position:absolute;left:.9em;top:50%;transform:translateY(-50%);pointer-events:none;opacity:.55;font-size:max(16px,var(--t-body))}
.aeg-field input:focus-visible,.aeg-field select:focus-visible,.aeg-field textarea:focus-visible{outline:2px solid ${C.blue};outline-offset:2px}
.aeg-field [aria-invalid="true"]{border-color:#b3261e}
.aeg-field .hint,.aeg-tool .hint,.aeg-req .hint{font-size:var(--t-tag);line-height:1.5;opacity:.72;margin-top:.7em;max-width:56ch}
.aeg-two{display:grid;grid-template-columns:1fr 1fr;gap:var(--col)}
@media (max-width:560px){.aeg-two{grid-template-columns:1fr}}
.chips{display:flex;flex-wrap:wrap;gap:.5rem}
.aeg-chip{font:inherit;font-size:var(--t-body);font-weight:500;color:${C.ink};background:transparent;border:1px solid rgba(18,20,23,.3);border-radius:var(--rad);
  min-height:44px;padding:.55em 1em;cursor:pointer;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.15;
  transition:background .3s,color .3s,border-color .3s;touch-action:manipulation}
.aeg-chip small{font-size:var(--t-tag);opacity:.75;margin-top:.15em}
.aeg-chip[aria-pressed="true"]{background:${C.blue};border-color:${C.blue};color:#fff}
.aeg-chip:disabled{opacity:.32;cursor:not-allowed;text-decoration:line-through}
.aeg-chip:focus-visible{outline:2px solid ${C.blue};outline-offset:2px}
.chips.sizes{margin-top:.7rem}
.aeg-tool .veisla{margin-top:.9rem;display:grid;gap:.9rem}
.aeg-tool .veisla .row{display:grid;gap:.5rem}
.aeg-stepper{display:inline-flex;align-items:center;border:1px solid rgba(18,20,23,.3);border-radius:var(--rad);background:#fff;max-width:100%}
.aeg-band.white .aeg-stepper{background:${C.paper}}
.aeg-stepper button{width:46px;height:46px;display:grid;place-items:center;background:transparent;border:0;color:${C.ink};cursor:pointer;touch-action:manipulation;transition:background .3s,color .3s}
.aeg-stepper button:disabled{opacity:.3;cursor:default}
.aeg-stepper button:focus-visible{outline:2px solid ${C.blue};outline-offset:-2px}
.aeg-stepper input{width:4.2ch;min-width:0;text-align:center;font:inherit;font-size:max(16px,var(--t-body));font-variant-numeric:tabular-nums;border:0;background:transparent;color:${C.ink};padding:0;-moz-appearance:textfield;appearance:textfield}
.aeg-stepper input::-webkit-outer-spin-button,.aeg-stepper input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.aeg-stepper input:focus-visible{outline:2px solid ${C.blue};outline-offset:0}
.aeg-stepper .u{font-size:var(--t-tag);opacity:.65;padding-right:.3em;margin-left:-.2em}
.aeg-tool .items{list-style:none;margin-top:.5rem}
.aeg-tool .items li{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.9em 0;border-top:1px solid ${C.hairline}}
.aeg-tool .items li:first-child{border-top:0}
.aeg-tool .items .nm{display:block;font-weight:600}
.aeg-tool .items .sub{display:block;font-size:var(--t-tag);opacity:.7;line-height:1.45;margin-top:.15em;max-width:44ch}
@media (max-width:560px){.aeg-tool .items li{align-items:flex-start;flex-direction:column;gap:.6rem}}
.aeg-check{display:flex;gap:.8em;align-items:flex-start;margin:0 0 1rem;cursor:pointer;min-height:44px}
.aeg-check input{width:22px;height:22px;margin-top:.15em;accent-color:${C.blue};flex:none}
.aeg-check span{font-size:var(--t-body);line-height:1.45}
.aeg-loford{list-style:none;display:grid;gap:0;margin:0}
.aeg-loford li{border-top:1px solid ${C.hairline};padding:1em 0 1.1em;font-size:var(--t-lead);line-height:1.4}
.aeg-loford li:last-child{border-bottom:1px solid ${C.hairline}}

/* before / after */
.aeg-ba .ba-tabs{margin-bottom:1.1rem}
.aeg-band.dark .aeg-chip{color:#fff;border-color:rgba(255,255,255,.45)}
.aeg-band.dark .aeg-chip[aria-pressed="true"]{background:#fff;color:${C.blueDeep};border-color:#fff}
.aeg-band.dark .aeg-chip:focus-visible{outline-color:#fff}
.aeg-ba .stage{position:relative;aspect-ratio:3 / 2;overflow:hidden;border-radius:var(--rad);background:#06182a;touch-action:pan-y;user-select:none;-webkit-user-select:none}
.aeg-ba .stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}
.aeg-ba .stage .before{clip-path:inset(0 calc(100% - var(--pos)) 0 0)}
.aeg-ba .tag{position:absolute;top:.8rem;z-index:3;font-size:var(--t-tag);font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#fff;background:rgba(10,42,67,.78);padding:.35em .7em;border-radius:var(--rad)}
.aeg-ba .tag.l{left:.8rem}.aeg-ba .tag.r{right:.8rem}
.aeg-ba .bar{position:absolute;top:0;bottom:0;left:var(--pos);width:2px;margin-left:-1px;background:#fff;z-index:2;pointer-events:none}
.aeg-ba .bar i{position:absolute;top:50%;left:50%;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:#fff;display:block}
.aeg-ba .bar i:before,.aeg-ba .bar i:after{content:'';position:absolute;top:50%;width:8px;height:8px;border-top:2px solid ${C.blueDeep};border-left:2px solid ${C.blueDeep}}
.aeg-ba .bar i:before{left:12px;transform:translateY(-50%) rotate(-45deg)}
.aeg-ba .bar i:after{right:12px;transform:translateY(-50%) rotate(135deg)}
.aeg-ba .stage input[type=range]{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize;z-index:4;-webkit-appearance:none;appearance:none;touch-action:pan-y}
.aeg-ba .stage:focus-within .bar i{outline:2px solid #fff;outline-offset:3px}
.aeg-ba .cap{font-size:var(--t-tag);opacity:.78;margin-top:.8rem}

/* the request form */
.aeg-req .tabs{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:calc(var(--col) * 1.6)}
.aeg-req .tabs button{font:inherit;font-size:var(--t-body);font-weight:600;color:#fff;background:transparent;border:1px solid rgba(255,255,255,.45);border-radius:var(--rad);min-height:46px;padding:.6em 1.1em;cursor:pointer;transition:background .3s,color .3s;touch-action:manipulation}
.aeg-req .tabs button[aria-selected="true"]{background:#fff;color:${C.blueDeep};border-color:#fff}
.aeg-req .tabs button:focus-visible{outline:2px solid #fff;outline-offset:3px}
.aeg-req .cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:calc(var(--col) * 2);align-items:start}
@media (max-width:900px){.aeg-req .cols{grid-template-columns:minmax(0,1fr);gap:1.6rem}}
.aeg-req .aeg-field legend,.aeg-req .aeg-field .lbl{opacity:.85}
.aeg-req .aeg-field input,.aeg-req .aeg-field select,.aeg-req .aeg-field textarea{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.4);color:#fff}
.aeg-req .aeg-field select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23ffffff' stroke-width='1.4'/%3E%3C/svg%3E")}
.aeg-req .aeg-field select option{color:${C.ink}}
.aeg-req .aeg-field input::placeholder,.aeg-req .aeg-field textarea::placeholder{color:rgba(255,255,255,.55)}
.aeg-req .aeg-field input:focus-visible,.aeg-req .aeg-field select:focus-visible,.aeg-req .aeg-field textarea:focus-visible{outline-color:#fff}
.aeg-req .recap dl{margin:.9rem 0 .4rem;display:grid}
.aeg-req .recap dl div{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.6fr);gap:1rem;padding:.6em 0;border-top:1px solid rgba(255,255,255,.22)}
.aeg-req .recap dt{opacity:.7}
.aeg-req .recap dd{overflow-wrap:anywhere}
.aeg-req .aeg-back{font-size:var(--t-label);text-transform:uppercase;letter-spacing:.06em;font-weight:600;text-decoration:underline;text-underline-offset:.25em;display:inline-block;padding:.7em 0;min-height:44px}
.aeg-req .acts{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:.6rem}
.aeg-req .acts .aeg-btn{min-width:0;flex:1 1 14em;text-align:left}
.aeg-req .acts button.aeg-btn{font-family:inherit}
.aeg-req .acts .aeg-btn.ghostl{background:transparent;color:#fff;border-color:rgba(255,255,255,.6)}
.aeg-req .acts .aeg-btn.brand{background:#fff;color:${C.blueDeep};border-color:#fff}
.aeg-req .acts .aeg-btn .lab{padding:1.05em 1.2em 1.1em;padding-right:3.4em}
.aeg-req .err{color:#ffb4ab;font-size:var(--t-body);margin:.2rem 0 .6rem}
.aeg-req .fine{font-size:var(--t-tag);opacity:.7;margin-top:1.1rem;line-height:1.5;max-width:52ch}
@media (hover:hover) and (pointer:fine){
  .aeg-chip:not(:disabled):not([aria-pressed="true"]):hover{background:rgba(0,112,176,.09);border-color:${C.blue}}
  .aeg-band.dark .aeg-chip:not([aria-pressed="true"]):hover{background:rgba(255,255,255,.12)}
  .aeg-stepper button:not(:disabled):hover{background:${C.blue};color:#fff}
  .aeg-req .tabs button[aria-selected="false"]:hover{background:rgba(255,255,255,.12)}
  .aeg-req .acts .aeg-btn.ghostl:hover{background:#fff;color:${C.blueDeep}}
  .aeg-req .acts .aeg-btn.brand:hover{background:transparent;color:#fff}
}
@media (prefers-reduced-motion:reduce){.aeg-ba .bar{transition:none}}
`

/* Reveal re-export keeps Page's imports short */
export { Reveal }
