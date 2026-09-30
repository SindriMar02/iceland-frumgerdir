import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SAMPLE_QUEUE, T, UNITS, UNIT_LABEL, path, type Lang, type Unit } from './data'
import { Arrow } from './Catalog'
import { useCatalog } from './Catalog'
import {
  canSend, clearList, restoreList, deleteSaved, loadDemo, missingOf, openSaved, removeSku, saveCurrent, sendCurrent, updateLine, updateMeta, useList,
  type Line, type ListState, type Sent,
} from './store'
import { lockScroll } from './motion'

const X = () => <svg viewBox="0 0 18 18" aria-hidden="true"><path d="m4 4 10 10M14 4 4 14" /></svg>

/* ------------------------------------------------------------------ overlay (drawer / modal): the video's blur pattern */
export function Overlay({ open, onClose, labelledBy, children, kind, returnSel }: { open: boolean; onClose: () => void; labelledBy: string; children: ReactNode; kind: 'drawer' | 'modal'; returnSel?: string }) {
  const panel = useRef<HTMLDivElement>(null)
  const back = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(false)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    if (open) {
      back.current = document.activeElement as HTMLElement
      setMounted(true)
      return
    }
    setShown(false)
    const id = window.setTimeout(() => setMounted(false), 360)
    return () => window.clearTimeout(id)
  }, [open])
  useEffect(() => {
    if (!open) return
    lockScroll(true)
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeRef.current(); return }
      if (e.key !== 'Tab' || !panel.current) return
      const f = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      html.style.overflow = prev
      lockScroll(false)
      /* Safari never focuses a clicked button, so the opener may be <body>: fall back to the named control */
      const to = back.current && back.current !== document.body && document.contains(back.current) ? back.current : returnSel ? document.querySelector<HTMLElement>(returnSel) : null
      to?.focus?.({ preventScroll: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- returnSel is a constant selector per overlay
  }, [open])
  /* the closed styles paint first (forced reflow), then the open class: no rAF, which a background tab never runs */
  useEffect(() => {
    if (!mounted || !open) return
    void panel.current?.offsetWidth
    setShown(true)
  }, [mounted, open])
  /* focus moves in once the panel is visible (a visibility:hidden element cannot take focus) */
  useEffect(() => {
    if (!shown || !panel.current) return
    const el = panel.current.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current.querySelector<HTMLElement>('button,a[href],input')
    el?.focus({ preventScroll: true })
  }, [shown])
  if (!mounted) return null
  return (
    <div className={`set-scrim${shown ? ' is-open' : ''}`} onMouseDown={(e) => { if (e.target === e.currentTarget) closeRef.current() }}>
      <div ref={panel} className={`set-panel ${kind === 'drawer' ? 'set-drawer' : 'set-modal'}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy} data-lenis-prevent="">
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ one line of the list */
function LineRow({ l, lang }: { l: Line; lang: Lang }) {
  const L = T[lang].list
  const [draft, setDraft] = useState(String(l.qty))
  useEffect(() => { setDraft(String(l.qty)) }, [l.qty])
  return (
    <li className="set-line">
      <span className="set-line__sku">{l.sku}</span>
      <span className="set-line__name">{l.name}</span>
      <span className="set-line__ctl">
        <span className="set-qty">
          <button type="button" onClick={() => updateLine(l.sku, { qty: l.qty - 1 })} aria-label={`${L.less}: ${l.name}`}>−</button>
          <input inputMode="numeric" value={draft} aria-label={`${L.cols.qty}: ${l.name}`}
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
            onBlur={() => updateLine(l.sku, { qty: parseInt(draft, 10) || 1 })}
            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }} />
          <button type="button" onClick={() => updateLine(l.sku, { qty: l.qty + 1 })} aria-label={`${L.more}: ${l.name}`}>+</button>
        </span>
        <select className="set-select" value={l.unit} onChange={(e) => updateLine(l.sku, { unit: e.target.value as Unit })} aria-label={`${L.cols.unit}: ${l.name}`}>
          {UNITS.map((u) => <option key={u} value={u}>{UNIT_LABEL[lang][u]}</option>)}
        </select>
      </span>
      <button type="button" className="set-line__rm" onClick={() => removeSku(l.sku)} aria-label={`${L.cols.remove}: ${l.name}`}><X /></button>
    </li>
  )
}

/* ------------------------------------------------------------------ drawer */
export function ListDrawer({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  const L = T[lang].list
  const { list } = useList()
  return (
    <Overlay open={open} onClose={onClose} labelledBy="set-drawer-h" kind="drawer" returnSel=".set-listbtn">
      <div className="set-drawer__head set-dark">
        <h2 id="set-drawer-h">{L.h1} <span className="set-tnum">({list.lines.length})</span></h2>
        <button type="button" className="set-x" onClick={onClose} aria-label={T[lang].nav.close}><X /></button>
      </div>
      <div className="set-drawer__body">
        {list.lines.length
          ? <ul className="set-lines" style={{ borderTop: 0 }}>{list.lines.map((l) => <LineRow key={l.sku} l={l} lang={lang} />)}</ul>
          : <p style={{ padding: '24px 0', color: 'var(--muted)' }}>{L.empty}</p>}
      </div>
      <div className="set-drawer__foot">
        <Link className="set-btn" to={path(lang, 'list')} onClick={onClose} data-autofocus="">{T[lang].teaser.cta}<Arrow /></Link>
        <p className="set-help">{L.fallback}</p>
      </div>
    </Overlay>
  )
}

/* ------------------------------------------------------------------ material list page */
export function ListPage({ lang }: { lang: Lang }) {
  const L = T[lang].list
  const { list, saved } = useList()
  const { cat } = useCatalog()
  const [showSaved, setShowSaved] = useState(false)
  const [flash, setFlash] = useState(false)
  const [step, setStep] = useState<'none' | 'sum' | 'ack'>('none')
  const [sent, setSent] = useState<Sent | null>(null)
  const [tried, setTried] = useState(false)
  const [undo, setUndo] = useState<ListState | null>(null)
  useEffect(() => { if (!undo) return; const id = window.setTimeout(() => setUndo(null), 8000); return () => window.clearTimeout(id) }, [undo])
  const m = list.meta
  const ok = canSend(list)
  const missing = missingOf(list)

  const save = () => { saveCurrent(); setFlash(true); window.setTimeout(() => setFlash(false), 1600) }
  const send = () => { setTried(true); if (ok) setStep('sum') }
  const confirm = () => { setSent(sendCurrent()); setStep('ack') }
  const place = m.place ? L.places[m.place] : ''
  const fld = (k: keyof typeof m, label: string, extra: Record<string, unknown> = {}, opt = true) => (
    <label className="set-fld">
      <span>{label}{opt ? '' : ' *'}</span>
      <input className="set-inp" value={m[k]} onChange={(e) => updateMeta({ [k]: e.target.value })} aria-label={label} {...extra} />
    </label>
  )

  return (
    <div className="set-page">
      <div className="set-lp">
        <header className="set-lp__head">
          <h1 className="set-d set-d--l" data-set-mask="" data-set-fit="">{L.h1}</h1>
          <p className="set-lede" data-set-fade="">{L.lead}</p>
        </header>

        <div className="set-lp__main">
          <label className="set-fld set-lp__name">
            <span>{L.name}</span>
            <input className="set-inp" value={m.name} aria-label={L.name} placeholder={L.namePh} onChange={(e) => updateMeta({ name: e.target.value })} />
          </label>
          {list.lines.length ? (
            <>
              <div className="set-lines__hd" aria-hidden="true"><span>{L.cols.sku}</span><span>{L.cols.item}</span><span>{L.cols.qty}</span><span>{L.cols.unit}</span><span /></div>
              <ul className="set-lines" style={{ borderTop: 0 }}>{list.lines.map((l) => <LineRow key={l.sku} l={l} lang={lang} />)}</ul>
            </>
          ) : (
            <div className="set-empty-list">
              <p>{L.empty}</p>
              <Link className="set-btn set-btn--line" to={`${path(lang, 'home')}#vorur`}>{L.browse}<Arrow /></Link>
            </div>
          )}
          <div className="set-lp__tools">
            <button type="button" className="set-btn set-btn--line" onClick={save} disabled={!list.lines.length}>{flash ? L.saved : L.save}</button>
            <button type="button" className="set-btn set-btn--line" onClick={() => setShowSaved((x) => !x)} aria-expanded={showSaved} aria-controls="set-saved">{L.open} ({saved.length})</button>
            <button type="button" className="set-btn set-btn--line" onClick={() => { setUndo(JSON.parse(JSON.stringify(list)) as ListState); clearList() }} disabled={!list.lines.length}>{L.clear}</button>
            {cat && <button type="button" className="set-btn set-btn--line" onClick={() => loadDemo(cat.products, lang === 'is' ? 'Dæmi: PE-vatnslögn SDR11' : 'Example: PE water line SDR11')}>{L.demo}</button>}
          </div>
          <p className="set-help" style={{ marginTop: 10 }} aria-live="polite">{undo ? <>{L.cleared} <button type="button" className="set-link" onClick={() => { restoreList(undo); setUndo(null) }}>{L.undo}</button></> : flash ? L.saved : L.local}</p>
          {showSaved && (
            <ul className="set-saved" id="set-saved">
              {saved.length ? saved.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => { openSaved(s.id); setShowSaved(false) }}>
                    {s.state.meta.name || (lang === 'is' ? 'Ónefndur listi' : 'Untitled list')} <small>· {s.state.lines.length} · {s.savedAt.slice(0, 10)}</small>
                  </button>
                  <button type="button" className="set-line__rm" onClick={() => deleteSaved(s.id)} aria-label={`${L.cols.remove}: ${s.state.meta.name}`}><X /></button>
                </li>
              )) : <li>{L.none}</li>}
            </ul>
          )}
        </div>

        <aside className="set-lp__side">
          <fieldset className="set-fs">
            <legend>{L.project}</legend>
            {fld('ref', L.ref, { placeholder: L.refPh })}
            {fld('date', L.date, { type: 'date' })}
            <div className="set-fld" role="radiogroup" aria-label={L.place}>
              <span>{L.place}</span>
              {(['selfoss', 'rvk', 'ship'] as const).map((k) => (
                <label key={k} className="set-radio"><input type="radio" name="set-place" checked={m.place === k} onChange={() => updateMeta({ place: k })} />{L.places[k]}</label>
              ))}
            </div>
            <label className="set-fld">
              <span>{L.notes}</span>
              <textarea className="set-inp" aria-label={L.notes} value={m.notes} placeholder={L.notesPh} onChange={(e) => updateMeta({ notes: e.target.value })} />
            </label>
            <div className="set-fld">
              <span>{L.file}</span>
              <div className="set-file">
                <label className="set-btn set-btn--line" style={{ minHeight: 44 }}>
                  {L.fileBtn}
                  <input className="set-sr" type="file" aria-label={L.file} onChange={(e) => updateMeta({ file: e.target.files?.[0]?.name ?? '' })} />
                </label>
                {m.file && <span>{m.file}</span>}
              </div>
              <small className="set-help">{L.fileNote}</small>
            </div>
          </fieldset>
          <fieldset className="set-fs">
            <legend>{L.contact}</legend>
            {fld('cname', L.cname, { name: 'name', autoComplete: 'name', 'aria-required': true }, false)}
            {fld('company', L.company, { name: 'organization', autoComplete: 'organization' })}
            {fld('email', L.email, { type: 'email', name: 'email', autoComplete: 'email', inputMode: 'email', spellCheck: false })}
            {fld('phone', L.phone, { type: 'tel', name: 'tel', autoComplete: 'tel', inputMode: 'tel' })}
          </fieldset>
          <div className="set-lp__send">
            {tried && !ok && <p className="set-warn" role="alert">{L.need}</p>}
            <button type="button" className="set-btn set-btn--green" onClick={send}>{L.send}<Arrow /></button>
            <p className="set-help">{L.fallback}</p>
          </div>
        </aside>
      </div>

      <Overlay open={step === 'sum'} onClose={() => setStep('none')} labelledBy="set-sum-h" kind="modal" returnSel=".set-lp__send .set-btn">
        <div className="set-modal__head"><h2 id="set-sum-h">{L.sum.title}</h2><button type="button" className="set-x" onClick={() => setStep('none')} aria-label={T[lang].nav.close}><X /></button></div>
        <div className="set-modal__body">
          <Summary lang={lang} s={list} place={place} missing={missing} />
        </div>
        <div className="set-modal__foot">
          <button type="button" className="set-btn set-btn--line" onClick={() => setStep('none')}>{L.sum.back}</button>
          <button type="button" className="set-btn set-btn--green" onClick={confirm} data-autofocus="">{L.sum.confirm}<Arrow /></button>
        </div>
      </Overlay>

      <Overlay open={step === 'ack'} onClose={() => setStep('none')} labelledBy="set-ack-h" kind="modal" returnSel=".set-lp__send .set-btn">
        <div className="set-modal__head"><h2 id="set-ack-h">{L.ack.title}</h2><button type="button" className="set-x" onClick={() => setStep('none')} aria-label={L.ack.close}><X /></button></div>
        <div className="set-modal__body">
          <div className="set-ack">
            <svg className="set-ack__ring" viewBox="0 0 72 72" aria-hidden="true"><circle className="a" cx="36" cy="36" r="31" pathLength={1} transform="rotate(-90 36 36)" /><circle className="b" cx="36" cy="36" r="31" pathLength={1} transform="rotate(-90 36 36)" /></svg>
            <p><strong>{L.ack.num} {sent?.no}</strong></p>
            <p>{L.ack.body}</p>
            <p className="set-help">{L.ack.note}</p>
          </div>
        </div>
        <div className="set-modal__foot">
          <Link className="set-btn set-btn--line" to={path(lang, 'review')}>{L.ack.staff}<Arrow /></Link>
          <button type="button" className="set-btn" onClick={() => setStep('none')} data-autofocus="">{L.ack.close}</button>
        </div>
      </Overlay>
    </div>
  )
}

function Summary({ lang, s, place, missing }: { lang: Lang; s: ListState; place: string; missing: string[] }) {
  const L = T[lang].list
  const row = (k: string, label: string, v: string, miss = false) => (
    <div key={k} className={miss ? 'is-missing' : undefined}><dt>{label}</dt><dd>{v || (miss ? L.sum.missing : '–')}</dd></div>
  )
  return (
    <>
      <dl className="set-sum">
        {row('name', L.name, s.meta.name)}
        {row('ref', L.ref, s.meta.ref, missing.includes('ref'))}
        {row('date', L.date, s.meta.date, missing.includes('date'))}
        {row('place', L.place, place, missing.includes('place'))}
        {row('who', L.contact, [s.meta.cname, s.meta.company, s.meta.email, s.meta.phone].filter(Boolean).join(' · '))}
        {s.meta.file ? row('file', L.file, s.meta.file) : null}
        {s.meta.notes ? row('notes', L.notes, s.meta.notes) : null}
      </dl>
      <p className="set-label">{L.sum.items(s.lines.length)}</p>
      <ul className="set-rv__lines">
        {s.lines.map((l) => <li key={l.sku}><span>{l.sku}</span><span>{l.name}</span><span>{l.qty} {UNIT_LABEL[lang][l.unit]}</span></li>)}
      </ul>
    </>
  )
}

/* ------------------------------------------------------------------ staff review queue (sample data, labelled) */
type Row = { no: string; from: string; ref: string; lines: number; date: string; status: 'new' | 'review' | 'quoted'; flags: string[]; mine?: Sent }
export function ReviewPage({ lang }: { lang: Lang }) {
  const R = T[lang].review
  const L = T[lang].list
  const { sent } = useList()
  const [status, setStatus] = useState<Record<string, Row['status']>>({})
  const rows: Row[] = useMemo(() => [
    ...sent.map((s) => ({ no: s.no, from: [s.state.meta.cname, s.state.meta.company].filter(Boolean).join(', '), ref: s.state.meta.ref, lines: s.state.lines.length, date: s.state.meta.date, status: 'new' as const, flags: missingOf(s.state), mine: s })),
    ...SAMPLE_QUEUE,
  ], [sent])
  const [sel, setSel] = useState<string>(rows[0]?.no ?? '')
  const cur = rows.find((r) => r.no === sel)
  const st = (r: Row) => status[r.no] ?? r.status
  const [reply, setReply] = useState('')
  useEffect(() => {
    if (!cur) return
    const name = cur.mine?.state.meta.cname.split(' ')[0] || (lang === 'is' ? 'viðskiptavinur' : 'there')
    setReply(R.replyText(name, cur.ref))
  }, [cur, R, lang])

  return (
    <div className="set-page">
      <div className="set-lp">
        <header className="set-lp__head">
          <h1 className="set-d set-d--l" data-set-mask="" data-set-fit="">{R.h1}</h1>
          <p className="set-lede" data-set-fade="">{R.lead}</p>
          <p className="set-help" style={{ marginTop: 12 }}><span className="set-tag">{R.sample}</span> {R.sampleNote}</p>
        </header>
      </div>
      <div className="set-rv">
        <div className="set-rv__q">
          <div className="set-rv__tblwrap">
            <table className="set-tbl">
              <thead><tr><th>{R.cols.no}</th><th className="c-from">{R.cols.from}</th><th>{R.cols.ref}</th><th>{R.cols.lines}</th><th className="c-date">{R.cols.date}</th><th>{R.cols.status}</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.no} className={r.no === sel ? 'is-sel' : undefined}>
                    <td><button type="button" onClick={() => setSel(r.no)} aria-pressed={r.no === sel}>
                      <span className="set-tnum">{r.no}</span><br /><span className={`set-tag${r.mine ? ' set-tag--you' : ''}`}>{r.mine ? R.yours : R.sample}</span>
                    </button></td>
                    <td className="c-from">{r.from || '–'}</td>
                    <td>{r.ref || <em style={{ color: 'var(--muted)', fontStyle: 'normal' }}>–</em>}</td>
                    <td className="set-tnum">{r.lines}</td>
                    <td className="c-date set-tnum">{r.date || '–'}</td>
                    <td><span className={`set-st set-st--${st(r)}`}>{R.status[st(r)]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="set-rv__d">
          {cur ? (
            <div className="set-rv__card" aria-live="polite">
              <p className="set-label">{cur.no} · {R.status[st(cur)]} {cur.mine ? '' : `· ${R.sample}`}</p>
              <h2 className="set-h">{cur.ref || cur.from}</h2>
              <div>
                <p className="set-label" style={{ marginBottom: 8 }}>{R.flags}</p>
                <div className="set-flags">
                  {cur.flags.length ? cur.flags.map((f) => <span key={f} className="set-flag">{R.flag[f as keyof typeof R.flag]}</span>) : <span className="set-flag">{R.noFlags}</span>}
                </div>
              </div>
              {cur.mine && (
                <ul className="set-rv__lines">
                  {cur.mine.state.lines.map((l) => <li key={l.sku}><span>{l.sku}</span><span>{l.name}</span><span>{l.qty} {UNIT_LABEL[lang][l.unit]}</span></li>)}
                </ul>
              )}
              <label className="set-fld" style={{ marginBottom: 0 }}>
                <span>{R.reply}</span>
                <textarea className="set-inp" aria-label={R.reply} rows={8} value={reply} onChange={(e) => setReply(e.target.value)} />
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <button type="button" className="set-btn set-btn--line" onClick={() => setStatus((s) => ({ ...s, [cur.no]: 'review' }))}>{R.mark}</button>
                <button type="button" className="set-btn" onClick={() => setStatus((s) => ({ ...s, [cur.no]: 'quoted' }))}>{R.quote}<Arrow /></button>
              </div>
              <p className="set-help">{L.ack.note}</p>
            </div>
          ) : <p className="set-help">{R.pick}</p>}
          <p style={{ marginTop: 20 }}><Link className="set-link" to={path(lang, 'list')}>{R.back}</Link></p>
        </div>
      </div>
    </div>
  )
}
