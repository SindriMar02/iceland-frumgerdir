import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT, ROUTE, SECTORS, STAGES, SUPPLIERS } from './data'
import { useList } from './store'

/* One request flow, two branches and an "unsure" route (matvelar-brief): new equipment or advice,
   or a machine already running (service, parts). The visitor reviews a finished brief and then
   opens it in their own mail program or copies it. Nothing is sent from this prototype; a live
   build posts to Matvélar's inbox and shows a reference only once delivery has succeeded. */

export type Branch = 'ny' | 'thjonusta' | 'veit-ekki'

const KINDS = [
  { id: 'bilun', name: 'Bilun' },
  { id: 'varahlutur', name: 'Varahlutur' },
  { id: 'vidhald', name: 'Viðhald' },
  { id: 'uppsetning', name: 'Uppsetning' },
  { id: 'kennsla', name: 'Kennsla' },
]
const TIMING = ['Sem fyrst', 'Á næstu þremur mánuðum', 'Á þessu ári', 'Ég er bara að skoða']
const MAKERS = [...SUPPLIERS.map((s) => s.name), 'Annar framleiðandi', 'Veit ekki']

interface Draft {
  branch: Branch | null
  ref: string
  company: string; person: string; email: string; phone: string
  sectors: string[]; product: string; tasks: string[]; throughput: string; timing: string; space: string; trial: boolean; extra: string
  maker: string; model: string; serial: string; kind: string; desc: string; address: string; urgent: boolean
  free: string
}

const blank = (): Draft => ({
  branch: null, ref: '',
  company: '', person: '', email: '', phone: '',
  sectors: [], product: '', tasks: [], throughput: '', timing: '', space: '', trial: false, extra: '',
  maker: '', model: '', serial: '', kind: '', desc: '', address: '', urgent: false,
  free: '',
})

const KEY = 'mv-request-draft'
const MAX_FILES = 5
const MAX_MB = 10

const makeRef = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  const rnd = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('')
  return `MV-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${rnd}`
}

const loadDraft = (): Draft => {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) return { ...blank(), ...JSON.parse(raw) }
  } catch { /* no storage: the draft lives for the page only */ }
  return blank()
}

const kb = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(n / 1024))} kB`)
const join = (a: string[]) => a.join(', ')

type Errors = Partial<Record<string, string>>

export interface FormStart { branch?: Branch; sector?: string; trial?: boolean }

export function RequestForm({ start, lock }: { start?: FormStart; lock?: Branch }) {
  const list = useList()
  const [d, setD] = useState<Draft>(() => {
    const cur = loadDraft()
    const next = { ...cur }
    if (lock) next.branch = lock
    else if (start?.branch) next.branch = start.branch
    if (start?.sector && !next.sectors.includes(start.sector)) next.sectors = [...next.sectors, start.sector]
    if (start?.trial) next.trial = true
    if (!next.ref) next.ref = makeRef()
    return next
  })
  const [step, setStep] = useState<'val' | 'upplysingar' | 'yfirlit'>(() => (lock || start?.branch ? 'upplysingar' : 'val'))
  const [errors, setErrors] = useState<Errors>({})
  const [files, setFiles] = useState<File[]>([])
  const [fileNote, setFileNote] = useState('')
  const [copied, setCopied] = useState(false)
  const summary = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(d)) } catch { /* ignore */ }
  }, [d])

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD((cur) => ({ ...cur, [k]: v }))
    if (errors[k as string]) setErrors((e) => ({ ...e, [k as string]: undefined }))
  }
  const toggle = (k: 'sectors' | 'tasks', id: string) =>
    setD((cur) => ({ ...cur, [k]: cur[k].includes(id) ? cur[k].filter((x) => x !== id) : [...cur[k], id] }))

  const listNames = list.items.map((i) => i.label)

  const validate = (): Errors => {
    const e: Errors = {}
    if (!d.person.trim()) e.person = 'Skrifaðu nafn svo við vitum hver hefur samband.'
    if (!d.email.trim() && !d.phone.trim()) { e.email = 'Settu inn netfang eða símanúmer.'; e.phone = 'Settu inn símanúmer eða netfang.' }
    if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = 'Netfangið virðist ekki vera rétt, til dæmis nafn@fyrirtaeki.is.'
    if (d.branch === 'ny') {
      if (!d.company.trim()) e.company = 'Skrifaðu nafn fyrirtækisins.'
      if (!d.product.trim() && !listNames.length) e.product = 'Segðu okkur hvað þú vinnur með, eða bættu vél á fyrirspurnalistann.'
    }
    if (d.branch === 'thjonusta') {
      if (!d.maker) e.maker = 'Veldu framleiðanda, eða „Veit ekki“.'
      if (!d.kind) e.kind = 'Veldu hvers konar erindi þetta er.'
      if (!d.desc.trim()) e.desc = 'Lýstu í stuttu máli hvað er að, eða hvaða varahlut vantar.'
    }
    if (d.branch === 'veit-ekki' && d.free.trim().length < 10) e.free = 'Skrifaðu nokkur orð um hvað þú ert að leita að.'
    return e
  }

  const focusFirst = (e: Errors) => {
    window.setTimeout(() => {
      summary.current?.focus()
      const id = Object.keys(e).find((k) => e[k])
      if (id) document.getElementById(`mvf-${id}`)?.scrollIntoView({ block: 'center', behavior: 'auto' })
    }, 0)
  }

  const next = () => {
    const e = validate()
    setErrors(e)
    if (Object.values(e).some(Boolean)) { focusFirst(e); return }
    setStep('yfirlit')
    window.setTimeout(() => top.current?.scrollIntoView({ block: 'start', behavior: 'auto' }), 0)
  }

  const onFiles = (ev: ChangeEvent<HTMLInputElement>) => {
    const picked = [...(ev.target.files ?? [])]
    ev.target.value = ''
    const ok: File[] = []
    const notes: string[] = []
    for (const f of picked) {
      if (!/^image\/|^application\/pdf$/.test(f.type)) { notes.push(`${f.name}: aðeins myndir og PDF skjöl.`); continue }
      if (f.size > MAX_MB * 1048576) { notes.push(`${f.name}: skráin er stærri en ${MAX_MB} MB.`); continue }
      ok.push(f)
    }
    const merged = [...files, ...ok]
    if (merged.length > MAX_FILES) notes.push(`Mest ${MAX_FILES} skrár, þær síðustu voru ekki teknar með.`)
    setFiles(merged.slice(0, MAX_FILES))
    setFileNote(notes.join(' '))
  }

  const brief = useMemo(() => {
    const L: string[] = []
    const row = (k: string, v: string) => { if (v.trim()) L.push(`${k}: ${v.trim()}`) }
    L.push('Fyrirspurn til Matvéla og umbúða')
    L.push(`Tilvísun: ${d.ref}`)
    if (d.branch === 'ny') L.push('Tegund: Ný vél eða ráðgjöf')
    if (d.branch === 'thjonusta') L.push('Tegund: Þjónusta eða varahlutir')
    if (d.branch === 'veit-ekki') L.push('Tegund: Ég veit ekki enn hvaða leið á við')
    L.push('')
    if (d.branch === 'ny') {
      row('Fyrirtæki', d.company)
      row('Tengiliður', d.person); row('Sími', d.phone); row('Netfang', d.email)
      L.push('')
      row('Geiri', join(d.sectors.map((s) => SECTORS.find((x) => x.id === s)?.name ?? s)))
      row('Hvað er unnið', d.product)
      row('Hvað á vélin að gera', join(d.tasks.map((t) => STAGES.find((x) => x.id === t)?.name ?? t)))
      row('Áætluð afköst', d.throughput)
      row('Hvenær', d.timing)
      row('Pláss og aðstæður', d.space)
      row('Vélar á fyrirspurnalista', join(listNames))
      if (d.trial) L.push('Prufa með mínu hráefni: já, ég vil skoða prufu hjá birgi')
      row('Annað', d.extra)
    }
    if (d.branch === 'thjonusta') {
      row('Tengiliður', d.person); row('Fyrirtæki', d.company); row('Sími', d.phone); row('Netfang', d.email)
      L.push('')
      row('Framleiðandi', d.maker)
      row('Gerð vélar', d.model)
      row('Raðnúmer', d.serial)
      row('Erindi', KINDS.find((k) => k.id === d.kind)?.name ?? '')
      row('Lýsing', d.desc)
      row('Staður', d.address)
      if (d.urgent) L.push('Framleiðsla stendur kyrr: já, ég hringi líka')
    }
    if (d.branch === 'veit-ekki') {
      row('Tengiliður', d.person); row('Fyrirtæki', d.company); row('Sími', d.phone); row('Netfang', d.email)
      L.push('')
      row('Lýsing', d.free)
      row('Vélar á fyrirspurnalista', join(listNames))
    }
    if (files.length) { L.push(''); L.push(`Myndir og skjöl (hengd við tölvupóstinn): ${files.map((f) => f.name).join(', ')}`) }
    return L.join('\n')
  }, [d, files, listNames])

  const subject = useMemo(() => {
    const t = d.branch === 'thjonusta' ? 'Þjónusta' : d.branch === 'ny' ? 'Ný vél' : 'Fyrirspurn'
    const m = d.branch === 'thjonusta' ? [d.maker, d.model].filter(Boolean).join(' ') : d.company
    return `${t}${m ? `: ${m}` : ''} (${d.ref})`
  }, [d])

  const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brief)
      setCopied(true)
    } catch {
      const ta = document.getElementById('mvf-brief') as HTMLTextAreaElement | null
      ta?.select()
      setCopied(document.execCommand?.('copy') === true)
    }
    window.setTimeout(() => setCopied(false), 2400)
  }

  const reset = () => {
    setD({ ...blank(), ref: makeRef() }); setFiles([]); setErrors({}); setStep('val'); list.clear()
  }

  /* the brief textarea grows to its text, so nothing is hidden behind an inner scroll */
  useEffect(() => {
    if (step !== 'yfirlit') return
    const fit = () => { const t = document.getElementById('mvf-brief'); if (t) { t.style.height = 'auto'; t.style.height = `${t.scrollHeight + 2}px` } }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [step, brief])

  const errKeys = Object.keys(errors).filter((k) => errors[k])
  const field = (id: keyof Draft | string) => ({
    id: `mvf-${id}`,
    'aria-invalid': errors[id as string] ? true : undefined,
    'aria-describedby': errors[id as string] ? `mvf-${id}-e` : undefined,
  })
  const Err = ({ id }: { id: string }) => (errors[id] ? <p className="mv-err" id={`mvf-${id}-e`}>{errors[id]}</p> : null)

  /* ── step 1: which way in ── */
  if (step === 'val' && !lock) {
    const opts: { id: Branch; t: string; s: string }[] = [
      { id: 'ny', t: 'Ný vél eða ráðgjöf', s: 'Þú ert að skoða vélar fyrir framleiðsluna, eða vilt ráðgjöf um línuna.' },
      { id: 'thjonusta', t: 'Vél í notkun', s: 'Bilun, varahlutur, viðhald, uppsetning eða kennsla á vél sem þú átt.' },
      { id: 'veit-ekki', t: 'Ég veit ekki enn', s: 'Lýstu því í nokkrum orðum, við finnum rétta leið.' },
    ]
    return (
      <div className="mv-form" ref={top}>
        <p className="mv-form__step mono">Skref 1 af 3</p>
        <h2 className="mv-form__h" id="mvf-title">Hvað viltu gera?</h2>
        <div className="mv-opts" role="radiogroup" aria-labelledby="mvf-title">
          {opts.map((o) => (
            <label key={o.id} className={`mv-opt${d.branch === o.id ? ' is-on' : ''}`}>
              <input type="radio" name="mvf-branch" checked={d.branch === o.id} onChange={() => { set('branch', o.id); setStep('upplysingar') }} />
              <span className="mv-opt__t">{o.t}</span>
              <span className="mv-opt__s">{o.s}</span>
            </label>
          ))}
        </div>
        <p className="mv-form__note">Ef framleiðslan stendur kyrr, hringdu frekar strax: Páll í Matvélum <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>, Rúnar í KAPP <a href={CONTACT.kappHref}>{CONTACT.kapp}</a>.</p>
      </div>
    )
  }

  /* ── step 3: the finished brief ── */
  if (step === 'yfirlit') {
    return (
      <div className="mv-form" ref={top}>
        <p className="mv-form__step mono">Skref 3 af 3</p>
        <h2 className="mv-form__h">Fyrirspurnin þín er tilbúin</h2>
        <p className="mv-form__lead">Svona les starfsmaður hana. Allt sem þarf til að svara er á einum stað.</p>
        <textarea id="mvf-brief" className="mv-brief" readOnly value={brief} rows={brief.split('\n').length} aria-label="Fyrirspurnin í heild" />
        <div className="mv-form__actions">
          <a className="mv-btn mv-btn--signal" href={mailto}><span className="roll"><span>Opna í tölvupósti</span></span></a>
          <button type="button" className="mv-btn mv-btn--ghost" onClick={copy}><span className="roll"><span>{copied ? 'Afritað' : 'Afrita texta'}</span></span></button>
          <button type="button" className="mv-btn mv-btn--text" onClick={() => setStep('upplysingar')}>Breyta</button>
        </div>
        {files.length > 0 && <p className="mv-form__note">Myndir og skjöl fylgja ekki tölvupóstslinknum. Hengdu þau við þegar póstforritið opnast: {files.map((f) => f.name).join(', ')}.</p>}
        <p className="mv-form__proto">Þetta er frumgerð og ekkert er sent héðan. Þú opnar póstforritið þitt eða afritar textann. Í fullbúinni síðu fer fyrirspurnin beint í pósthólf Matvéla og þú færð tilvísunarnúmerið {d.ref} þegar hún hefur borist.</p>
        <button type="button" className="mv-btn mv-btn--text" onClick={reset}>Byrja nýja fyrirspurn</button>
      </div>
    )
  }

  /* ── step 2: the details ── */
  const label = d.branch === 'thjonusta' ? 'Vél í notkun' : d.branch === 'ny' ? 'Ný vél eða ráðgjöf' : 'Ég veit ekki enn'
  return (
    <form className="mv-form" ref={top as never} noValidate onSubmit={(e) => { e.preventDefault(); next() }}>
      <p className="mv-form__step mono">{lock ? 'Skref 1 af 2' : 'Skref 2 af 3'} · {label}{!lock && <> · <button type="button" className="mv-link" onClick={() => setStep('val')}>Breyta</button></>}</p>
      <h2 className="mv-form__h">{d.branch === 'thjonusta' ? 'Segðu okkur frá vélinni' : d.branch === 'ny' ? 'Segðu okkur hvað þú framleiðir' : 'Segðu okkur hvað þú ert að leita að'}</h2>

      {errKeys.length > 0 && (
        <div className="mv-errsum" role="alert" tabIndex={-1} ref={summary}>
          <strong>Það vantar upplýsingar</strong>
          <ul>{errKeys.map((k) => <li key={k}><a href={`#mvf-${k}`} onClick={(e) => { e.preventDefault(); document.getElementById(`mvf-${k}`)?.focus() }}>{errors[k]}</a></li>)}</ul>
        </div>
      )}

      {d.branch === 'ny' && (
        <>
          <div className="mv-grid2">
            <div className="mv-fld"><label htmlFor="mvf-company">Fyrirtæki</label><input {...field('company')} value={d.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" /><Err id="company" /></div>
            <div className="mv-fld"><label htmlFor="mvf-timing">Hvenær</label>
              <select id="mvf-timing" value={d.timing} onChange={(e) => set('timing', e.target.value)}><option value="">Veldu</option>{TIMING.map((t) => <option key={t}>{t}</option>)}</select></div>
          </div>
          <fieldset className="mv-fld mv-chips"><legend>Geiri</legend>
            {SECTORS.map((s) => (
              <label key={s.id} className={`mv-chip${d.sectors.includes(s.id) ? ' is-on' : ''}`}><input type="checkbox" checked={d.sectors.includes(s.id)} onChange={() => toggle('sectors', s.id)} /><span>{s.name}</span></label>
            ))}
          </fieldset>
          <div className="mv-fld"><label htmlFor="mvf-product">Hvað er unnið</label>
            <input {...field('product')} value={d.product} onChange={(e) => set('product', e.target.value)} placeholder="Til dæmis lambakjöt, lax, kjúklingabringur, brauð" /><Err id="product" /></div>
          <fieldset className="mv-fld mv-chips"><legend>Hvað á vélin að gera</legend>
            {STAGES.map((s) => (
              <label key={s.id} className={`mv-chip${d.tasks.includes(s.id) ? ' is-on' : ''}`}><input type="checkbox" checked={d.tasks.includes(s.id)} onChange={() => toggle('tasks', s.id)} /><span>{s.name}</span></label>
            ))}
          </fieldset>
          <div className="mv-grid2">
            <div className="mv-fld"><label htmlFor="mvf-throughput">Áætluð afköst, ef þú veist</label><input id="mvf-throughput" value={d.throughput} onChange={(e) => set('throughput', e.target.value)} placeholder="Til dæmis 500 kg á klukkustund" /></div>
            <div className="mv-fld"><label htmlFor="mvf-space">Pláss og aðstæður, valfrjálst</label><input id="mvf-space" value={d.space} onChange={(e) => set('space', e.target.value)} /></div>
          </div>
          <div className="mv-fld">
            <span className="mv-lbl">Vélar á fyrirspurnalista</span>
            {list.items.length ? (
              <ul className="mv-tags">{list.items.map((i) => <li key={i.id}>{i.label}<button type="button" aria-label={`Taka ${i.label} af listanum`} onClick={() => list.remove(i.id)}>×</button></li>)}</ul>
            ) : <p className="mv-form__note">Listinn er tómur. Þú getur bætt vélum á hann á síðunum <Link to={`${ROUTE}/velar`}>Vélar</Link>, eða sleppt því og lýst því sem þú þarft.</p>}
          </div>
          <label className={`mv-check${d.trial ? ' is-on' : ''}`}><input type="checkbox" checked={d.trial} onChange={(e) => set('trial', e.target.checked)} /><span>Ég vil skoða prufu með mínu hráefni hjá birgi erlendis</span></label>
          <div className="mv-fld"><label htmlFor="mvf-extra">Annað, valfrjálst</label><textarea id="mvf-extra" rows={3} value={d.extra} onChange={(e) => set('extra', e.target.value)} /></div>
        </>
      )}

      {d.branch === 'thjonusta' && (
        <>
          <div className="mv-grid2">
            <div className="mv-fld"><label htmlFor="mvf-maker">Framleiðandi</label>
              <select {...field('maker')} value={d.maker} onChange={(e) => set('maker', e.target.value)}><option value="">Veldu</option>{MAKERS.map((m) => <option key={m}>{m}</option>)}</select><Err id="maker" /></div>
            <div className="mv-fld"><label htmlFor="mvf-model">Gerð vélar</label><input id="mvf-model" value={d.model} onChange={(e) => set('model', e.target.value)} placeholder="Gerðarheitið á skilti vélarinnar" /></div>
          </div>
          <div className="mv-grid2">
            <div className="mv-fld"><label htmlFor="mvf-serial">Raðnúmer, ef þú hefur það</label><input id="mvf-serial" value={d.serial} onChange={(e) => set('serial', e.target.value)} autoCapitalize="characters" /></div>
            <div className="mv-fld"><label htmlFor="mvf-address">Hvar er vélin</label><input id="mvf-address" value={d.address} onChange={(e) => set('address', e.target.value)} placeholder="Heimilisfang eða staður" autoComplete="street-address" /></div>
          </div>
          <fieldset className="mv-fld mv-chips" aria-describedby={errors.kind ? 'mvf-kind-e' : undefined}><legend>Erindi</legend>
            {KINDS.map((k) => (
              <label key={k.id} className={`mv-chip${d.kind === k.id ? ' is-on' : ''}`}><input type="radio" name="mvf-kind" id={k.id === KINDS[0].id ? 'mvf-kind' : undefined} checked={d.kind === k.id} onChange={() => set('kind', k.id)} /><span>{k.name}</span></label>
            ))}
            <Err id="kind" />
          </fieldset>
          <div className="mv-fld"><label htmlFor="mvf-desc">Hvað er að, eða hvaða varahlut vantar</label>
            <textarea {...field('desc')} rows={4} value={d.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Til dæmis villuboð á skjá, hljóð, hvenær það byrjaði" /><Err id="desc" /></div>
          <label className={`mv-check${d.urgent ? ' is-on' : ''}`}><input type="checkbox" checked={d.urgent} onChange={(e) => set('urgent', e.target.checked)} /><span>Framleiðslan stendur kyrr</span></label>
          {d.urgent && <p className="mv-urgent">Hringdu líka, það er fljótlegast: Páll í Matvélum <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>, Rúnar í KAPP <a href={CONTACT.kappHref}>{CONTACT.kapp}</a>.</p>}
        </>
      )}

      {d.branch === 'veit-ekki' && (
        <div className="mv-fld"><label htmlFor="mvf-free">Hvað ert þú að leita að</label>
          <textarea {...field('free')} rows={5} value={d.free} onChange={(e) => set('free', e.target.value)} placeholder="Skrifaðu eins og þér er eðlilegt, við tökum við þessu eins og það er." /><Err id="free" /></div>
      )}

      <div className="mv-sect">
        <p className="mv-lbl">Hver ert þú</p>
        <div className="mv-grid2">
          <div className="mv-fld"><label htmlFor="mvf-person">Nafn</label><input {...field('person')} value={d.person} onChange={(e) => set('person', e.target.value)} autoComplete="name" /><Err id="person" /></div>
          {d.branch !== 'ny' && <div className="mv-fld"><label htmlFor="mvf-company">Fyrirtæki, valfrjálst</label><input id="mvf-company" value={d.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" /></div>}
          <div className="mv-fld"><label htmlFor="mvf-phone">Sími</label><input {...field('phone')} type="tel" inputMode="tel" value={d.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" /><Err id="phone" /></div>
          <div className="mv-fld"><label htmlFor="mvf-email">Netfang</label><input {...field('email')} type="email" inputMode="email" value={d.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" /><Err id="email" /></div>
        </div>
      </div>

      {d.branch !== 'veit-ekki' && (
        <div className="mv-fld mv-files">
          <span className="mv-lbl">Myndir eða skjöl, valfrjálst</span>
          <label className="mv-filebtn"><input type="file" multiple accept="image/*,application/pdf" onChange={onFiles} /><span>Velja skrár</span></label>
          <p className="mv-form__note">Allt að {MAX_FILES} skrár, hver að {MAX_MB} MB, myndir eða PDF. Þú getur alltaf lýst þessu í orðum í staðinn.</p>
          {fileNote && <p className="mv-err" role="status">{fileNote}</p>}
          {files.length > 0 && <ul className="mv-tags">{files.map((f, i) => <li key={`${f.name}${i}`}>{f.name} <span className="mono">{kb(f.size)}</span><button type="button" aria-label={`Fjarlægja ${f.name}`} onClick={() => setFiles(files.filter((_, j) => j !== i))}>×</button></li>)}</ul>}
        </div>
      )}

      <div className="mv-form__actions">
        <button type="submit" className="mv-btn mv-btn--signal"><span className="roll"><span>Skoða fyrirspurnina</span></span></button>
        <p className="mv-form__note">Þú sérð fyrirspurnina í heild áður en nokkuð fer af stað.</p>
      </div>
    </form>
  )
}
