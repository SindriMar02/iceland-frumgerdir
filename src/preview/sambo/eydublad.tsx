import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import type { Eydublad as Cfg, Reitur } from './forms'

/* The one request flow behind every form on the page: the visitor fills a few
   honest fields, reviews a finished message with a reference, and opens it in
   their own mail program or copies it. Nothing is sent from the prototype; a
   live build posts to Kólus' inbox and shows the reference only once delivery
   has succeeded. Styled with the system's own field vocabulary (floating
   labels, a dot that turns green or red), so a form in the drawer, in a popup
   and in the contact panel reads as one family. */

type Gildi = Record<string, string>
export type Lina = { n: string; magn: number }
const MAX_SKRAR = 5
const MAX_MB = 10

const makeRef = (prefix: string) => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  const rnd = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('')
  return `${prefix}-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${rnd}`
}
const kb = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} kB`)
const netfangGott = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim())

export const EYD_CSS = `
.sb-eyd{display:grid;gap:1rem;min-width:0}
.sb-eydT{margin:0;font-family:var(--f-disp);font-weight:400;font-size:clamp(1.5rem,2.08vw,2.4rem);line-height:1.05;letter-spacing:-.02em}
.sb-eydL{margin:0;max-width:44ch}
.sb-eyd .sb-reitir{grid-template-columns:1fr 1fr}
.sb-reitir select{width:100%;border:0;background:var(--c-form);color:#06222E;font:inherit;font-size:16px;appearance:none;-webkit-appearance:none;
  padding:1.7rem 2.6rem .55rem 1.04vw;min-height:4.063vw;border-radius:var(--r,0);
  background-image:linear-gradient(45deg,transparent 50%,#06222E 50%),linear-gradient(135deg,#06222E 50%,transparent 50%);
  background-position:calc(100% - 1.3rem) 55%,calc(100% - .95rem) 55%;background-size:.4rem .4rem;background-repeat:no-repeat}
@media (max-width:991px){.sb-reitir select{min-height:6.51vw;padding-left:var(--gut)}}
@media (max-width:479px){.sb-reitir select{min-height:13.889vw;padding-left:4vw}.sb-eyd .sb-reitir{grid-template-columns:1fr}}
.sb-eyd .sb-reitir label.valid select,.sb-eyd .sb-reitir label.gott select{outline:0}
/* typed text lines up with its floating label at every breakpoint (the label sits at 1.04vw, 1.6vw, 4vw) */
.sb-reitir input,.sb-reitir textarea{padding-left:1.04vw}
@media (max-width:991px){.sb-reitir input,.sb-reitir textarea{padding-left:1.6vw}}
@media (max-width:479px){.sb-reitir input,.sb-reitir textarea{padding-left:4vw}}
.sb-root a.sb-btn{color:var(--c-btn-t)}
.sb-root a.sb-btn.sc{color:var(--c-btn2-t)}
.sb-skra{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 1.4rem;cursor:pointer;position:relative;
  background:var(--c-btn2);color:var(--c-btn2-t);font-weight:500;font-size:.92rem;border-radius:999px;width:max-content}
.sb-skra input{position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:pointer;font-size:16px}
.sb-skra:has(input:focus-visible){outline:2px solid var(--c-rautt);outline-offset:3px}
.sb-skrar{display:flex;flex-wrap:wrap;gap:.4rem;list-style:none;margin:0;padding:0}
.sb-skrar li{display:inline-flex;align-items:center;gap:.5rem;padding:.15rem .25rem .15rem .8rem;border-radius:999px;background:var(--c-el);font-size:.85rem}
.sb-skrar button{width:36px;height:36px;border:0;background:none;cursor:pointer;font-size:1.2rem;color:inherit}
.sb-eydA{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
.sb-eydA .sb-btn{padding:.9rem 1.6rem}
.sb-eyd pre.sb-kvittun{margin:0;border-radius:var(--r,0);max-height:46svh;overflow:auto;-webkit-overflow-scrolling:touch}
.sb-eyd .sb-smatt{margin:0}
`

export function Eydublad({ cfg, lina, krefstLina = false, formId, felaTakka = false, onSkoda, onNytt }: {
  cfg: Cfg
  /** the order list (trade form only), put in the finished message */
  lina?: Lina[]
  /** refuse to review an order with an empty list */
  krefstLina?: boolean
  formId?: string
  /** the caller draws its own submit button (the order drawer's footer) */
  felaTakka?: boolean
  onSkoda?: (brief: string) => void
  onNytt?: () => void
}) {
  const id = useId()
  const efst = useRef<HTMLDivElement | null>(null)
  const draftKey = `sb-eyd-${cfg.key}`
  const [v, setV] = useState<Gildi>(() => {
    let cur: Gildi = {}
    try { cur = JSON.parse(sessionStorage.getItem(draftKey) || '{}') } catch { /* no storage */ }
    return { ...cur, __ref: cur.__ref || makeRef(cfg.ref) }
  })
  const [villur, setVillur] = useState<Record<string, string>>({})
  const [snert, setSnert] = useState<Record<string, boolean>>({})
  const [skref, setSkref] = useState<'fylla' | 'yfirfara'>('fylla')
  const [skrar, setSkrar] = useState<File[]>([])
  const [skraNota, setSkraNota] = useState('')
  const [afritad, setAfritad] = useState(false)

  useEffect(() => { try { sessionStorage.setItem(draftKey, JSON.stringify(v)) } catch { /* no storage */ } }, [v, draftKey])

  const get = (k: string) => v[k] ?? ''
  const set = (k: string, val: string) => setV((c) => ({ ...c, [k]: val }))
  const fid = (k: string) => `${cfg.key}-${k}`

  const athuga = (): Record<string, string> => {
    const e: Record<string, string> = {}
    for (const f of cfg.fields) {
      if ('required' in f && f.required && !get(f.id).trim()) e[f.id] = `${f.label}: vantar`
    }
    if (cfg.contactEither && !get('phone').trim() && !get('email').trim()) e.email = 'Netfang eða sími: vantar'
    if (get('email').trim() && !netfangGott(get('email'))) e.email = 'Netfang: er ekki gilt'
    if (krefstLina && !lina?.length) e.__lina = 'Pöntunarlistinn er tómur, settu vörur á hann'
    return e
  }

  const skoda = (ev: FormEvent) => {
    ev.preventDefault()
    const e = athuga()
    setVillur(e)
    setSnert(Object.fromEntries(cfg.fields.map((f) => [f.id, true])))
    if (Object.keys(e).length) {
      const fyrst = Object.keys(e).find((k) => k !== '__lina')
      if (fyrst) window.setTimeout(() => document.getElementById(fid(fyrst))?.focus(), 0)
      return
    }
    if (onSkoda) onSkoda(brief)
    setSkref('yfirfara')
    window.setTimeout(() => efst.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' }), 0)
  }

  const brief = useMemo(() => {
    const L: string[] = [cfg.brief, `Tilvísun: ${v.__ref}`, '']
    for (const f of cfg.fields) {
      if (f.kind === 'files') continue
      const s = (v[f.id] ?? '').trim()
      if (s) L.push(`${f.label}: ${s}`)
    }
    if (lina?.length) { L.push('', 'Vörur og magn:'); lina.forEach((x) => L.push(`  ${x.magn} x ${x.n}`)) }
    if (skrar.length) { L.push('', `Skjöl (hengd við tölvupóstinn): ${skrar.map((f) => f.name).join(', ')}`) }
    return L.join('\n')
  }, [v, lina, skrar, cfg])

  const efni = `${cfg.subject}${cfg.subjectField && get(cfg.subjectField).trim() ? `: ${get(cfg.subjectField).trim()}` : ''} (${v.__ref})`
  const mailto = `mailto:${cfg.to}?subject=${encodeURIComponent(efni)}&body=${encodeURIComponent(brief)}`

  const afrita = async () => {
    try { await navigator.clipboard.writeText(brief); setAfritad(true) } catch {
      const ta = document.getElementById(`${id}-brief`) as HTMLTextAreaElement | null
      ta?.select(); setAfritad(document.execCommand?.('copy') === true)
    }
    window.setTimeout(() => setAfritad(false), 2400)
  }

  const nytt = () => {
    setV({ __ref: makeRef(cfg.ref) }); setSkrar([]); setVillur({}); setSnert({}); setSkref('fylla'); onNytt?.()
  }

  const veljaSkrar = (ev: ChangeEvent<HTMLInputElement>) => {
    const valdar = [...(ev.target.files ?? [])]
    ev.target.value = ''
    const ok: File[] = []
    const nota: string[] = []
    for (const f of valdar) {
      if (!/^image\/|^application\/pdf$/.test(f.type)) { nota.push(`${f.name}: aðeins myndir og PDF skjöl.`); continue }
      if (f.size > MAX_MB * 1048576) { nota.push(`${f.name}: stærri en ${MAX_MB} MB.`); continue }
      ok.push(f)
    }
    const saman = [...skrar, ...ok]
    if (saman.length > MAX_SKRAR) nota.push(`Mest ${MAX_SKRAR} skrár.`)
    setSkrar(saman.slice(0, MAX_SKRAR)); setSkraNota(nota.join(' '))
  }

  const lbl = (f: Reitur) => (snert[f.id] ? (villur[f.id] ? 'villa' : (get(f.id).trim() ? 'gott' : '')) : '')

  if (skref === 'yfirfara') {
    return (
      <div className="sb-eyd" ref={efst}>
        <p className="sb-eydT">Beiðnin þín er tilbúin</p>
        <p className="sb-eydL">Svona les starfsmaður beiðnina. Allt sem þarf til að svara er á einum stað.</p>
        <pre className="sb-kvittun" id={`${id}-brief`} tabIndex={0} aria-label="Beiðnin í heild">{brief}</pre>
        <div className="sb-eydA">
          <a className="sb-btn" href={mailto}>Opna í tölvupósti</a>
          <button type="button" className="sb-btn sc" onClick={afrita}>{afritad ? 'Afritað' : 'Afrita texta'}</button>
          <button type="button" className="sb-nobg" onClick={() => setSkref('fylla')}>Breyta <i>←</i></button>
        </div>
        {skrar.length > 0 && <p className="sb-smatt">Skjöl fylgja ekki tölvupóstslinknum. Hengdu þau við þegar póstforritið opnast: {skrar.map((f) => f.name).join(', ')}.</p>}
        <p className="sb-smatt">
          Þetta er frumgerð og ekkert er sent héðan. Þú opnar póstforritið þitt eða afritar textann. Á tilbúnum vef fer beiðnin
          beint í pósthólf Kólus og þú færð tilvísunarnúmerið {v.__ref} þegar hún hefur borist.
        </p>
        <button type="button" className="sb-nobg" onClick={nytt}>Byrja nýja beiðni <i>→</i></button>
      </div>
    )
  }

  const villuLyklar = Object.keys(villur)
  return (
    <form className="sb-eyd" id={formId} ref={efst as never} onSubmit={skoda} noValidate>
      {cfg.title && <p className="sb-eydT">{cfg.title}</p>}
      {cfg.lead && <p className="sb-eydL">{cfg.lead}</p>}
      <div className="sb-reitir">
        {cfg.fields.map((f) => {
          const kl = `${f.kind === 'textarea' || ('heild' in f && f.heild) ? 'heild ' : ''}${lbl(f)}`.trim()
          if (f.kind === 'files') {
            return (
              <div key={f.id} className="heild" style={{ display: 'grid', gap: '.6rem' }}>
                <span className="sb-smatt" style={{ margin: 0 }}>{f.label}</span>
                <label className="sb-skra"><input type="file" multiple accept="image/*,application/pdf" onChange={veljaSkrar} />Velja skrár</label>
                <p className="sb-smatt">Allt að {MAX_SKRAR} skrár, hver að {MAX_MB} MB, myndir eða PDF. Þú getur alltaf lýst þessu í orðum í staðinn.</p>
                {skraNota && <p className="sb-villa" role="status">{skraNota}</p>}
                {skrar.length > 0 && (
                  <ul className="sb-skrar">
                    {skrar.map((s, i) => (
                      <li key={`${s.name}${i}`}>{s.name} <small>{kb(s.size)}</small>
                        <button type="button" aria-label={`Fjarlægja ${s.name}`} onClick={() => setSkrar(skrar.filter((_, j) => j !== i))}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          }
          return (
            <label key={f.id} className={kl}>
              <span className="sb-lbl">{f.label}{'required' in f && f.required ? ' *' : ''}</span>
              {f.kind === 'textarea' ? (
                <textarea id={fid(f.id)} rows={f.rows ?? 4} value={get(f.id)} aria-invalid={villur[f.id] ? true : undefined}
                  onBlur={() => setSnert((s) => ({ ...s, [f.id]: true }))} onChange={(e) => set(f.id, e.target.value)} />
              ) : f.kind === 'select' ? (
                <select id={fid(f.id)} value={get(f.id)} aria-invalid={villur[f.id] ? true : undefined}
                  onBlur={() => setSnert((s) => ({ ...s, [f.id]: true }))} onChange={(e) => set(f.id, e.target.value)}>
                  <option value="">Veldu</option>
                  {f.options.map((x) => <option key={x.v} value={x.v}>{x.t}</option>)}
                </select>
              ) : (
                <input id={fid(f.id)} type={f.kind === 'qty' ? 'text' : f.kind} inputMode={f.kind === 'qty' ? 'numeric' : f.kind === 'tel' ? 'tel' : f.kind === 'email' ? 'email' : undefined}
                  pattern={f.kind === 'qty' ? '[0-9]*' : undefined} autoComplete={'auto' in f ? f.auto : undefined}
                  placeholder={'placeholder' in f ? f.placeholder : undefined}
                  value={get(f.id)} aria-invalid={villur[f.id] ? true : undefined}
                  onBlur={() => setSnert((s) => ({ ...s, [f.id]: true }))}
                  onChange={(e) => set(f.id, f.kind === 'qty' ? e.target.value.replace(/\D/g, '').slice(0, 5) : e.target.value)} />
              )}
              <i />
            </label>
          )
        })}
      </div>
      {villuLyklar.length > 0 && (
        <p className="sb-villa" role="alert">{villuLyklar.map((k) => villur[k]).join('. ')}.</p>
      )}
      {!felaTakka && (
        <div className="sb-eydA">
          <button type="submit" className="sb-btn stor">{cfg.submit}</button>
        </div>
      )}
      <p className="sb-smatt">Þú sérð beiðnina í heild áður en nokkuð fer af stað.</p>
    </form>
  )
}
