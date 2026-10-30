import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import type { Eydublad as Cfg, Reitur } from './forms'



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
.hb-eyd{display:grid;gap:1rem;min-width:0}
.hb-eydT{margin:0;font-family:var(--f-disp);font-weight:600;font-size:clamp(1.5rem,2.08vw,2.4rem);line-height:1.05;letter-spacing:-.02em}
.hb-eydL{margin:0;max-width:44ch}
.hb-eyd .hb-reitir{grid-template-columns:1fr 1fr}
.hb-reitir select{width:100%;border:0;background:var(--c-form);color:#172D4D;font:inherit;font-size:16px;appearance:none;-webkit-appearance:none;
  padding:1.7rem 2.6rem .55rem 1.04vw;min-height:4.063vw;border-radius:var(--r,0);
  background-image:linear-gradient(45deg,transparent 50%,#172D4D 50%),linear-gradient(135deg,#172D4D 50%,transparent 50%);
  background-position:calc(100% - 1.3rem) 55%,calc(100% - .95rem) 55%;background-size:.4rem .4rem;background-repeat:no-repeat}
@media (max-width:991px){.hb-reitir select{min-height:6.51vw;padding-left:var(--gut)}}
@media (max-width:479px){.hb-reitir select{min-height:13.889vw;padding-left:4vw}.hb-eyd .hb-reitir{grid-template-columns:1fr}}
.hb-eyd .hb-reitir label.valid select:not(:focus-visible),.hb-eyd .hb-reitir label.gott select:not(:focus-visible){outline:0}

.hb-reitir input,.hb-reitir textarea{padding-left:1.04vw}
@media (max-width:991px){.hb-reitir input,.hb-reitir textarea{padding-left:1.6vw}}
@media (max-width:479px){.hb-reitir input,.hb-reitir textarea{padding-left:4vw}}
.hb-root a.hb-btn{color:var(--c-btn-t)}
.hb-root a.hb-btn.sc{color:var(--c-btn2-t)}
.hb-skra{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 1.4rem;cursor:pointer;position:relative;
  background:var(--c-btn2);color:var(--c-btn2-t);font-weight:500;font-size:.92rem;border-radius:999px;width:max-content}
.hb-skra input{position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:pointer;font-size:16px}
.hb-skra:has(input:focus-visible){outline:2px solid var(--c-rautt);outline-offset:3px}
.hb-skrar{display:flex;flex-wrap:wrap;gap:.4rem;list-style:none;margin:0;padding:0}
.hb-skrar li{display:inline-flex;align-items:center;gap:.5rem;padding:.15rem .25rem .15rem .8rem;border-radius:999px;background:var(--c-el);font-size:.85rem}
.hb-skrar button{width:36px;height:36px;border:0;background:none;cursor:pointer;font-size:1.2rem;color:inherit}
.hb-eydA{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
.hb-eydA .hb-btn{padding:.9rem 1.6rem}
.hb-eyd pre.hb-kvittun{margin:0;border-radius:var(--r,0);max-height:46svh;overflow:auto;-webkit-overflow-scrolling:touch}
.hb-eyd .hb-smatt{margin:0}
`

export function Eydublad({ cfg, lina, krefstLina = false, formId, felaTakka = false, onSkoda, onNytt, onEdit }: {
  cfg: Cfg
  
  lina?: Lina[]
  
  krefstLina?: boolean
  formId?: string
  
  felaTakka?: boolean
  onSkoda?: (brief: string) => void
  onNytt?: () => void
  onEdit?: () => void
}) {
  const id = useId()
  const efst = useRef<HTMLDivElement | null>(null)
  const draftKey = `hb-eyd-${cfg.key}`
  const [v, setV] = useState<Gildi>(() => {
    let cur: Gildi = {}
    try { cur = JSON.parse(sessionStorage.getItem(draftKey) || '{}') } catch {  }
    return { ...cur, __ref: cur.__ref || makeRef(cfg.ref) }
  })
  const [villur, setVillur] = useState<Record<string, string>>({})
  const [snert, setSnert] = useState<Record<string, boolean>>({})
  const [skref, setSkref] = useState<'fylla' | 'yfirfara'>('fylla')
  const [skrar, setSkrar] = useState<File[]>([])
  const [skraNota, setSkraNota] = useState('')
  const [afritad, setAfritad] = useState(false)

  useEffect(() => { try { sessionStorage.setItem(draftKey, JSON.stringify(v)) } catch {  } }, [v, draftKey])

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

  
  useEffect(() => {
    setVillur((cur) => {
      const ks = Object.keys(cur)
      if (!ks.length) return cur
      const nu = athuga()
      const n: Record<string, string> = {}
      for (const k of ks) if (nu[k]) n[k] = nu[k]
      return Object.keys(n).length === ks.length ? cur : n
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v, lina])

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
      const el = document.getElementById(`${id}-brief`); if(el){const r=document.createRange();r.selectNodeContents(el);const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(r);setAfritad(document.execCommand?.('copy')===true)}
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
      <div className="hb-eyd" ref={efst}>
        <p className="hb-eydT">Beiðnin þín er tilbúin</p>
        <p className="hb-eydL">Svona les starfsmaður beiðnina. Allt sem þarf til að svara er á einum stað.</p>
        <pre className="hb-kvittun" id={`${id}-brief`} tabIndex={0} aria-label="Beiðnin í heild">{brief}</pre>
        <div className="hb-eydA">
          <a className="hb-btn" href={mailto}>Opna í tölvupósti</a>
          <button type="button" className="hb-btn sc" onClick={afrita}>{afritad ? 'Afritað' : 'Afrita texta'}</button>
          <button type="button" className="hb-nobg" onClick={() => {setSkref('fylla');onEdit?.()}}>Breyta <i>←</i></button>
        </div>
        {skrar.length > 0 && <p className="hb-smatt">Skjöl fylgja ekki tölvupóstslinknum. Hengdu þau við þegar póstforritið opnast: {skrar.map((f) => f.name).join(', ')}.</p>}
        <p className="hb-smatt">
          Ekkert er sent héðan. Þú opnar póstforritið þitt eða afritar textann og sendir þegar þú ert tilbúin/n.
        </p>
        <button type="button" className="hb-nobg" onClick={nytt}>Byrja nýja beiðni <i>→</i></button>
      </div>
    )
  }

  const villuLyklar = Object.keys(villur)
  return (
    <form className="hb-eyd" id={formId} ref={efst as never} onSubmit={skoda} noValidate>
      {cfg.title && <p className="hb-eydT">{cfg.title}</p>}
      {cfg.lead && <p className="hb-eydL">{cfg.lead}</p>}
      <div className="hb-reitir">
        {cfg.fields.map((f) => {
          const kl = `${f.kind === 'textarea' || ('heild' in f && f.heild) ? 'heild ' : ''}${lbl(f)}`.trim()
          if (f.kind === 'files') {
            return (
              <div key={f.id} className="heild" style={{ display: 'grid', gap: '.6rem' }}>
                <span className="hb-smatt" style={{ margin: 0 }}>{f.label}</span>
                <label className="hb-skra"><input type="file" multiple accept="image/*,application/pdf" onChange={veljaSkrar} />Velja skrár</label>
                <p className="hb-smatt">Allt að {MAX_SKRAR} skrár, hver að {MAX_MB} MB, myndir eða PDF. Þú getur alltaf lýst þessu í orðum í staðinn.</p>
                {skraNota && <p className="hb-villa" role="status">{skraNota}</p>}
                {skrar.length > 0 && (
                  <ul className="hb-skrar">
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
              <span className="hb-lbl">{f.label}{'required' in f && f.required ? ' *' : ''}</span>
              {f.kind === 'textarea' ? (
                <textarea id={fid(f.id)} rows={f.rows ?? 4} value={get(f.id)} aria-invalid={villur[f.id] ? true : undefined} aria-required={'required' in f && f.required ? true : undefined} aria-describedby={villur[f.id] ? `${id}-errors` : undefined}
                  onBlur={() => setSnert((s) => ({ ...s, [f.id]: true }))} onChange={(e) => set(f.id, e.target.value)} />
              ) : f.kind === 'select' ? (
                <select id={fid(f.id)} value={get(f.id)} aria-invalid={villur[f.id] ? true : undefined} aria-required={'required' in f && f.required ? true : undefined} aria-describedby={villur[f.id] ? `${id}-errors` : undefined}
                  onBlur={() => setSnert((s) => ({ ...s, [f.id]: true }))} onChange={(e) => set(f.id, e.target.value)}>
                  <option value="">Veldu</option>
                  {f.options.map((x) => <option key={x.v} value={x.v}>{x.t}</option>)}
                </select>
              ) : (
                <input id={fid(f.id)} type={f.kind === 'qty' ? 'text' : f.kind} inputMode={f.kind === 'qty' ? 'numeric' : f.kind === 'tel' ? 'tel' : f.kind === 'email' ? 'email' : undefined}
                  pattern={f.kind === 'qty' ? '[0-9]*' : undefined} autoComplete={'auto' in f ? f.auto : undefined}
                  placeholder={'placeholder' in f ? f.placeholder : undefined}
                  value={get(f.id)} aria-invalid={villur[f.id] ? true : undefined} aria-required={'required' in f && f.required ? true : undefined} aria-describedby={villur[f.id] ? `${id}-errors` : undefined}
                  onBlur={() => setSnert((s) => ({ ...s, [f.id]: true }))}
                  onChange={(e) => set(f.id, f.kind === 'qty' ? e.target.value.replace(/\D/g, '').slice(0, 5) : e.target.value)} />
              )}
              <i />
            </label>
          )
        })}
      </div>
      {villuLyklar.length > 0 && (
        <p className="hb-villa" id={`${id}-errors`} role="alert">{villuLyklar.map((k) => villur[k]).join('. ')}.</p>
      )}
      {!felaTakka && (
        <div className="hb-eydA">
          <button type="submit" className="hb-btn stor">{cfg.submit}</button>
        </div>
      )}
      <p className="hb-smatt">Þú sérð beiðnina í heild áður en nokkuð fer af stað.</p>
    </form>
  )
}
