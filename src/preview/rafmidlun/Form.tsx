import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { CONTACT, JOB, type Branch } from './data'

/* One request with four ways in: a work order, a commercial kitchen repair, a new job or tender,
   and a job application. Each asks for exactly what Rafmiðlun's own pages ask for, and the
   finished brief names the inbox their pages give for it. The visitor reviews the brief and then
   opens it in their own mail program or copies it. Nothing is sent from this prototype; a live
   build posts to the right inbox and shows a reference only once delivery has succeeded. */

const ROUTES: Record<Branch, { to: string; dept: string }> = {
  verkbeidni: { to: CONTACT.kitchen, dept: 'Þjónusta, Flugumýri 32' },
  eldhus: { to: CONTACT.kitchen, dept: 'Þjónusta stóreldhústækja' },
  verk: { to: CONTACT.email, dept: 'Skrifstofa, Ögurhvarf 8' },
  umsokn: { to: CONTACT.email, dept: 'Skrifstofa, starfsumsóknir' },
}

export const LABEL: Record<Branch, string> = {
  verkbeidni: 'Verkbeiðni',
  eldhus: 'Stóreldhústæki',
  verk: 'Nýtt verk eða útboð',
  umsokn: 'Starfsumsókn',
}

const KINDS = ['Bilun', 'Viðhald', 'Breyting', 'Eftirlit']
const WORK = ['Nýlagnir', 'Skápasmíði', 'Stóriðja', 'Þjónustusamningur', 'Annað']
const TIMING = ['Sem fyrst', 'Á næstu þremur mánuðum', 'Á þessu ári', 'Útboð með skilafresti']

interface Draft {
  branch: Branch | null
  ref: string
  company: string; kt: string; pkt: string; site: string; person: string; email: string; phone: string
  kind: string; contract: string; contractNo: string; desc: string; urgent: boolean
  device: string; model: string
  work: string[]; timing: string; deadline: string; tender: boolean
  position: string; note: string
}

const blank = (): Draft => ({
  branch: null, ref: '',
  company: '', kt: '', pkt: '', site: '', person: '', email: '', phone: '',
  kind: '', contract: '', contractNo: '', desc: '', urgent: false,
  device: '', model: '',
  work: [], timing: '', deadline: '', tender: false,
  position: '', note: '',
})

const KEY = 'rm-request-draft'
const MAX_FILES = 5
const MAX_MB = 10

const makeRef = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  const rnd = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('')
  return `RM-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${rnd}`
}

const loadDraft = (): Draft => {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) return { ...blank(), ...JSON.parse(raw) }
  } catch { /* no storage: the draft lives for the page only */ }
  return blank()
}

const kb = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(n / 1024))} kB`)
/** a kennitala is ten digits, written with or without the dash */
const ktOk = (v: string) => /^\d{6}-?\d{4}$/.test(v.trim())

type Errors = Partial<Record<string, string>>

export function RequestForm({ start }: { start?: Branch }) {
  const [d, setD] = useState<Draft>(() => {
    const next = { ...loadDraft() }
    if (start) next.branch = start
    if (!next.ref) next.ref = makeRef()
    return next
  })
  const [step, setStep] = useState<'val' | 'upplysingar' | 'yfirlit'>(() => (start ? 'upplysingar' : 'val'))
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
    /* on a request, phone and email answer one question (how do we reach you), so either one clears both;
       an application needs the email itself */
    const pair = (k === 'phone' || k === 'email') && d.branch !== 'umsokn' ? ['phone', 'email'] : [k as string]
    if (pair.some((p) => errors[p])) setErrors((e) => ({ ...e, ...Object.fromEntries(pair.map((p) => [p, undefined])) }))
  }
  const toggleWork = (id: string) => {
    setD((cur) => ({ ...cur, work: cur.work.includes(id) ? cur.work.filter((x) => x !== id) : [...cur.work, id] }))
    if (errors.work) setErrors((e) => ({ ...e, work: undefined }))
  }

  const b: Branch = d.branch ?? 'verkbeidni'
  const route = ROUTES[b]
  const isJob = b === 'umsokn'

  const validate = (): Errors => {
    /* in the order the fields stand on the page, so the summary reads top to bottom */
    const e: Errors = {}
    if (isJob) {
      if (!d.position) e.position = 'Veldu stöðu: rafvirki eða nemi.'
      if (!ktOk(d.pkt)) e.pkt = 'Kennitala er tíu tölustafir, til dæmis 010203-4560.'
      if (!d.person.trim()) e.person = 'Skrifaðu nafnið þitt.'
      if (!d.email.trim()) e.email = 'Settu inn netfang.'
    } else {
      if (!d.company.trim()) e.company = 'Skrifaðu nafn fyrirtækisins.'
      if (b !== 'verk' && !ktOk(d.kt)) e.kt = 'Kennitala fyrirtækisins er tíu tölustafir, til dæmis 460896-2239.'
      if (b !== 'verk' && !d.site.trim()) e.site = 'Skrifaðu heimilisfang verkstaðarins.'
      if (b === 'verkbeidni' && !d.kind) e.kind = 'Veldu hvers konar verk þetta er.'
      if (b === 'eldhus' && !d.device.trim()) e.device = 'Skrifaðu hvaða tæki þetta er, til dæmis ofn eða uppþvottavél.'
      if (b === 'verk' && !d.work.length) e.work = 'Veldu hvers konar verk þetta er.'
      if (!d.desc.trim()) e.desc = b === 'verk' ? 'Lýstu verkinu í nokkrum orðum.' : 'Lýstu í stuttu máli hvað á að gera eða hvað er bilað.'
      if (!d.person.trim()) e.person = 'Skrifaðu nafn tengiliðs svo við vitum hvern við hittum.'
      if (!d.email.trim() && !d.phone.trim()) { e.phone = 'Settu inn símanúmer eða netfang.'; e.email = 'Settu inn netfang eða símanúmer.' }
    }
    if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = 'Netfangið virðist ekki vera rétt, til dæmis nafn@fyrirtaeki.is.'
    return e
  }

  const focusSummary = () => {
    window.setTimeout(() => {
      summary.current?.focus({ preventScroll: true })
      summary.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
    }, 0)
  }

  const next = () => {
    const e = validate()
    setErrors(e)
    if (Object.values(e).some(Boolean)) { focusSummary(); return }
    setStep('yfirlit')
    window.setTimeout(() => top.current?.scrollIntoView({ block: 'start', behavior: 'auto' }), 0)
  }

  const onFiles = (ev: ChangeEvent<HTMLInputElement>) => {
    const picked = [...(ev.target.files ?? [])]
    ev.target.value = ''
    const ok: File[] = []
    const notes: string[] = []
    for (const f of picked) {
      if (!/^image\/|^application\/pdf$/.test(f.type) && !/\.(dwg|dxf|docx?)$/i.test(f.name)) { notes.push(`${f.name}: aðeins myndir, PDF, DWG, DXF eða Word.`); continue }
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
    L.push(isJob ? 'Starfsumsókn til Rafmiðlunar' : `${LABEL[b]} til Rafmiðlunar`)
    L.push(`Tilvísun: ${d.ref}`)
    L.push(`Fer til: ${route.dept} (${route.to})`)
    L.push('')
    if (isJob) {
      row('Nafn', d.person); row('Netfang', d.email); row('Kennitala', d.pkt); row('Staða', d.position); row('Sími', d.phone)
      if (d.note.trim()) { L.push(''); row('Um mig', d.note) }
    } else {
      row('Fyrirtæki', d.company); row('Kennitala', d.kt)
      if (b !== 'verk') row('Heimilisfang verkstaðar', d.site)
      row('Tengiliður', d.person); row('Sími', d.phone); row('Netfang', d.email)
      L.push('')
      if (b === 'verkbeidni') {
        row('Tegund verks', d.kind)
        row('Þjónustusamningur', d.contract === 'ja' ? `Já${d.contractNo.trim() ? `, nr. ${d.contractNo.trim()}` : ''}` : d.contract === 'nei' ? 'Nei' : '')
      }
      if (b === 'eldhus') { row('Tæki', d.device); row('Framleiðandi og gerð', d.model) }
      if (b === 'verk') {
        row('Tegund verks', d.work.join(', ')); row('Staður', d.site); row('Hvenær', d.timing)
        if (d.timing === TIMING[3]) row('Skilafrestur', d.deadline)
        if (d.tender) L.push('Útboðsgögn og teikningar fylgja')
      }
      row('Lýsing á verkinu', d.desc)
      if (d.urgent) L.push('Liggur á: já, ég hringi líka')
    }
    if (files.length) { L.push(''); L.push(`Viðhengi (hengd við tölvupóstinn): ${files.map((f) => f.name).join(', ')}`) }
    return L.join('\n')
  }, [d, files, b, isJob, route])

  const subject = useMemo(() => {
    const who = isJob ? `${d.person}${d.position ? `, ${d.position.toLowerCase()}` : ''}` : [d.company, b !== 'verk' ? d.site : ''].filter((x) => x.trim()).join(', ')
    return `${LABEL[b]}${who ? `: ${who}` : ''} (${d.ref})`
  }, [d, b, isJob])

  const mailto = `mailto:${route.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brief)
      setCopied(true)
    } catch {
      const ta = document.getElementById('rmf-brief') as HTMLTextAreaElement | null
      ta?.select()
      setCopied(document.execCommand?.('copy') === true)
    }
    window.setTimeout(() => setCopied(false), 2400)
  }

  const reset = () => {
    if (!window.confirm('Byrja nýja beiðni? Það sem þú hefur skrifað tæmist.')) return
    setD({ ...blank(), ref: makeRef() }); setFiles([]); setErrors({}); setStep('val')
  }

  /* the brief textarea grows to its text, so nothing is hidden behind an inner scroll */
  useEffect(() => {
    if (step !== 'yfirlit') return
    const fit = () => { const t = document.getElementById('rmf-brief'); if (t) { t.style.height = 'auto'; t.style.height = `${t.scrollHeight + 2}px` } }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [step, brief])

  const errKeys = Object.keys(errors).filter((k) => errors[k])
  const field = (id: keyof Draft | string) => ({
    id: `rmf-${id}`,
    name: String(id),
    'aria-invalid': errors[id as string] ? true : undefined,
    'aria-describedby': errors[id as string] ? `rmf-${id}-e` : undefined,
  })
  const Err = ({ id }: { id: string }) => (errors[id] ? <p className="rm-err" id={`rmf-${id}-e`}>{errors[id]}</p> : null)
  /* render functions, not components: a component declared here would remount its inputs and drop focus */
  const radios = (k: 'kind' | 'position' | 'contract', legend: string, options: { id: string; name: string }[]) => (
    <fieldset className="rm-fld rm-chips" aria-describedby={errors[k] ? `rmf-${k}-e` : undefined}><legend>{legend}</legend>
      {options.map((o, i) => (
        <label key={o.id} className={`rm-chip${d[k] === o.id ? ' is-on' : ''}`}><input type="radio" name={`rmf-${k}`} id={i === 0 ? `rmf-${k}` : undefined} checked={d[k] === o.id} onChange={() => set(k, o.id)} /><span>{o.name}</span></label>
      ))}
      <Err id={k} />
    </fieldset>
  )

  /* ── step 1: which way in ── */
  if (step === 'val') {
    const opts: { id: Branch; s: string }[] = [
      { id: 'verkbeidni', s: 'Bilun, viðhald, breyting eða eftirlit á raflögnum hjá fyrirtæki eða stofnun.' },
      { id: 'eldhus', s: 'Viðgerð á tæki í stóreldhúsi: ofn, uppþvottavél, kælir eða annað.' },
      { id: 'verk', s: 'Nýlagnir, skápasmíði, stóriðja eða þjónustusamningur. Útboðsgögn mega fylgja.' },
      { id: 'umsokn', s: 'Rafvirkjar og nemar: nafn, netfang, kennitala og staða.' },
    ]
    return (
      <div className="rm-form" ref={top}>
        <p className="rm-form__step mono">Skref 1 af 3</p>
        <h2 className="rm-form__h" id="rmf-title">Hvað vantar þig?</h2>
        <div className="rm-opts" role="radiogroup" aria-labelledby="rmf-title">
          {opts.map((o) => (
            <label key={o.id} className={`rm-opt${d.branch === o.id ? ' is-on' : ''}`}>
              <input type="radio" name="rmf-branch" checked={d.branch === o.id} onChange={() => { set('branch', o.id); setStep('upplysingar') }} />
              <span className="rm-opt__t">{LABEL[o.id]}</span>
              <span className="rm-opt__s">{o.s}</span>
              <span className="rm-opt__to mono">Fer til: {ROUTES[o.id].dept}</span>
            </label>
          ))}
        </div>
        <p className="rm-form__note">Ef það liggur á, hringdu frekar strax: skrifstofa og þjónusta <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>, stóreldhústæki <a href={CONTACT.kitchenHref}>{CONTACT.kitchenPhone}</a>.</p>
      </div>
    )
  }

  /* ── step 3: the finished brief ── */
  if (step === 'yfirlit') {
    return (
      <div className="rm-form" ref={top}>
        <p className="rm-form__step mono">Skref 3 af 3</p>
        <h2 className="rm-form__h">{isJob ? 'Umsóknin þín er tilbúin' : 'Beiðnin þín er tilbúin'}</h2>
        <p className="rm-form__lead">Svona les starfsmaður hana. Allt sem þarf til að svara er á einum stað.</p>
        <textarea id="rmf-brief" className="rm-brief" readOnly value={brief} rows={brief.split('\n').length} aria-label={isJob ? 'Umsóknin í heild' : 'Beiðnin í heild'} />
        <div className="rm-form__actions">
          <a className="rm-btn rm-btn--blue" href={mailto}><span className="roll"><span>Opna í tölvupósti</span></span></a>
          <button type="button" className="rm-btn rm-btn--white" onClick={copy}><span className="roll"><span>{copied ? 'Afritað' : 'Afrita texta'}</span></span></button>
          <button type="button" className="rm-btn rm-btn--text" onClick={() => setStep('upplysingar')}>Breyta</button>
        </div>
        {files.length > 0 && <p className="rm-form__note">Viðhengi fylgja ekki tölvupóstslinknum. Hengdu þau við þegar póstforritið opnast: {files.map((f) => f.name).join(', ')}.</p>}
        <p className="rm-form__proto">Þetta er frumgerð og ekkert er sent héðan. Þú opnar póstforritið þitt eða afritar textann. Í fullbúinni síðu fer {isJob ? 'umsóknin' : 'beiðnin'} beint á {route.to} og þú færð tilvísunarnúmerið {d.ref} þegar hún hefur borist.</p>
        <button type="button" className="rm-btn rm-btn--text" onClick={reset}>Byrja nýja beiðni</button>
      </div>
    )
  }

  /* ── step 2: the details ── */
  const heads: Record<Branch, string> = {
    verkbeidni: 'Segðu okkur frá verkinu',
    eldhus: 'Segðu okkur frá tækinu',
    verk: 'Segðu okkur frá verkinu',
    umsokn: 'Segðu okkur frá þér',
  }
  return (
    <form className="rm-form" ref={top as never} noValidate onSubmit={(e) => { e.preventDefault(); next() }}>
      <p className="rm-form__step mono">Skref 2 af 3 · {LABEL[b]} · <button type="button" className="rm-link" onClick={() => setStep('val')}>Breyta</button></p>
      <h2 className="rm-form__h">{heads[b]}</h2>
      <p className="rm-form__to mono">Fer til: {route.dept}</p>

      {errKeys.length > 0 && (
        <div className="rm-errsum" role="alert" tabIndex={-1} ref={summary}>
          <strong>Það vantar upplýsingar</strong>
          <ul>{errKeys.map((k) => <li key={k}><a href={`#rmf-${k}`} onClick={(e) => { e.preventDefault(); document.getElementById(`rmf-${k}`)?.focus() }}>{errors[k]}</a></li>)}</ul>
        </div>
      )}

      {!isJob && (
        <div className="rm-sect">
          <p className="rm-lbl">Fyrirtækið</p>
          <div className="rm-grid2">
            <div className="rm-fld"><label htmlFor="rmf-company">Nafn fyrirtækis</label><input {...field('company')} value={d.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" /><Err id="company" /></div>
            <div className="rm-fld"><label htmlFor="rmf-kt">Kennitala{b === 'verk' ? ', valfrjálst' : ''}</label><input {...field('kt')} value={d.kt} onChange={(e) => set('kt', e.target.value)} inputMode="numeric" autoComplete="off" spellCheck={false} placeholder="000000-0000" /><Err id="kt" /></div>
          </div>
          {b !== 'verk' && <div className="rm-fld"><label htmlFor="rmf-site">Heimilisfang verkstaðar</label><input {...field('site')} value={d.site} onChange={(e) => set('site', e.target.value)} autoComplete="street-address" placeholder="Þar sem verkið er unnið" /><Err id="site" /></div>}
        </div>
      )}

      {b === 'verkbeidni' && (
        <>
          {radios('kind', 'Tegund verks', KINDS.map((k) => ({ id: k, name: k })))}
          <div className="rm-grid2 rm-grid2--end">
            {radios('contract', 'Þjónustusamningur', [{ id: 'ja', name: 'Já' }, { id: 'nei', name: 'Nei' }])}
            {d.contract === 'ja' && <div className="rm-fld"><label htmlFor="rmf-contractNo">Númer samnings, ef þú veist það</label><input id="rmf-contractNo" name="contractNo" value={d.contractNo} onChange={(e) => set('contractNo', e.target.value)} spellCheck={false} autoComplete="off" /></div>}
          </div>
        </>
      )}

      {b === 'eldhus' && (
        <div className="rm-grid2">
          <div className="rm-fld"><label htmlFor="rmf-device">Hvaða tæki</label><input {...field('device')} value={d.device} onChange={(e) => set('device', e.target.value)} placeholder="Til dæmis gufuofn eða uppþvottavél" /><Err id="device" /></div>
          <div className="rm-fld"><label htmlFor="rmf-model">Framleiðandi og gerð, ef þú veist</label><input id="rmf-model" name="model" value={d.model} onChange={(e) => set('model', e.target.value)} placeholder="Af skilti tækisins" spellCheck={false} autoComplete="off" /></div>
        </div>
      )}

      {b === 'verk' && (
        <>
          <fieldset className="rm-fld rm-chips" aria-describedby={errors.work ? 'rmf-work-e' : undefined}><legend>Tegund verks</legend>
            {WORK.map((w, i) => <label key={w} className={`rm-chip${d.work.includes(w) ? ' is-on' : ''}`}><input type="checkbox" id={i === 0 ? 'rmf-work' : undefined} checked={d.work.includes(w)} onChange={() => toggleWork(w)} /><span>{w}</span></label>)}
            <Err id="work" />
          </fieldset>
          <div className="rm-grid2">
            <div className="rm-fld"><label htmlFor="rmf-site">Staður, valfrjálst</label><input id="rmf-site" name="site" value={d.site} onChange={(e) => set('site', e.target.value)} placeholder="Til dæmis Grundartangi eða heimilisfang" /></div>
            <div className="rm-fld"><label htmlFor="rmf-timing">Hvenær</label>
              <select id="rmf-timing" name="timing" value={d.timing} onChange={(e) => set('timing', e.target.value)}><option value="">Veldu</option>{TIMING.map((t) => <option key={t}>{t}</option>)}</select></div>
          </div>
          {d.timing === TIMING[3] && <div className="rm-fld"><label htmlFor="rmf-deadline">Skilafrestur</label><input id="rmf-deadline" name="deadline" type="date" value={d.deadline} onChange={(e) => set('deadline', e.target.value)} /></div>}
          <label className={`rm-check${d.tender ? ' is-on' : ''}`}><input type="checkbox" checked={d.tender} onChange={(e) => set('tender', e.target.checked)} /><span>Útboðsgögn eða teikningar fylgja</span></label>
        </>
      )}

      {!isJob && (
        <div className="rm-fld"><label htmlFor="rmf-desc">{b === 'verk' ? 'Lýsing á verkinu' : 'Lýsing á verkinu, eða hvað er bilað'}</label>
          <textarea {...field('desc')} rows={4} value={d.desc} onChange={(e) => set('desc', e.target.value)} placeholder={b === 'eldhus' ? 'Til dæmis villuboð á skjá, hvenær það byrjaði' : 'Hvað á að gera, og hvað rafvirkinn þarf að vita á staðnum'} /><Err id="desc" /></div>
      )}

      {isJob && (
        <>
          {radios('position', 'Staða', JOB.positions.map((p) => ({ id: p, name: p })))}
          <div className="rm-fld"><label htmlFor="rmf-pkt">Kennitala</label><input {...field('pkt')} value={d.pkt} onChange={(e) => set('pkt', e.target.value)} inputMode="numeric" autoComplete="off" spellCheck={false} placeholder="000000-0000" /><Err id="pkt" /></div>
        </>
      )}

      <div className="rm-sect">
        <p className="rm-lbl">{isJob ? 'Þú' : 'Tengiliður'}</p>
        <div className="rm-grid2">
          <div className="rm-fld"><label htmlFor="rmf-person">Nafn</label><input {...field('person')} value={d.person} onChange={(e) => set('person', e.target.value)} autoComplete="name" /><Err id="person" /></div>
          <div className="rm-fld"><label htmlFor="rmf-phone">Sími{isJob ? ', valfrjálst' : ''}</label><input {...field('phone')} type="tel" inputMode="tel" value={d.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" /><Err id="phone" /></div>
          <div className="rm-fld"><label htmlFor="rmf-email">Netfang</label><input {...field('email')} type="email" inputMode="email" value={d.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" spellCheck={false} /><Err id="email" /></div>
        </div>
      </div>

      {isJob && <div className="rm-fld"><label htmlFor="rmf-note">Um þig, valfrjálst</label><textarea id="rmf-note" name="note" rows={3} value={d.note} onChange={(e) => set('note', e.target.value)} placeholder="Reynsla, sveinspróf, hvenær þú getur byrjað" /></div>}

      {!isJob && b !== 'verk' && (
        <label className={`rm-check${d.urgent ? ' is-on' : ''}`}><input type="checkbox" checked={d.urgent} onChange={(e) => set('urgent', e.target.checked)} /><span>Það liggur á</span></label>
      )}
      {d.urgent && !isJob && b !== 'verk' && <p className="rm-urgent">Hringdu líka, það er fljótlegast: {b === 'eldhus' ? <>stóreldhústæki <a href={CONTACT.kitchenHref}>{CONTACT.kitchenPhone}</a></> : <>skrifstofa og þjónusta <a href={CONTACT.phoneHref}>{CONTACT.phone}</a></>}.</p>}

      <div className="rm-fld rm-files">
        <span className="rm-lbl">{isJob ? 'Ferilskrá eða prófskírteini, valfrjálst' : b === 'verk' ? 'Teikningar eða útboðsgögn, valfrjálst' : 'Myndir, valfrjálst'}</span>
        <label className="rm-filebtn"><input type="file" multiple accept="image/*,application/pdf,.dwg,.dxf,.doc,.docx" onChange={onFiles} /><span>Velja skrár</span></label>
        <p className="rm-form__note">Allt að {MAX_FILES} skrár, hver að {MAX_MB} MB.{isJob ? '' : ' Þú getur alltaf lýst þessu í orðum í staðinn.'}</p>
        {fileNote && <p className="rm-err" role="status">{fileNote}</p>}
        {files.length > 0 && <ul className="rm-tags">{files.map((f, i) => <li key={`${f.name}${i}`}>{f.name} <span className="mono">{kb(f.size)}</span><button type="button" aria-label={`Fjarlægja ${f.name}`} onClick={() => setFiles(files.filter((_, j) => j !== i))}>×</button></li>)}</ul>}
      </div>

      <div className="rm-form__actions">
        <button type="submit" className="rm-btn rm-btn--blue"><span className="roll"><span>{isJob ? 'Skoða umsóknina' : 'Skoða beiðnina'}</span></span></button>
        <p className="rm-form__note">Þú sérð {isJob ? 'umsóknina' : 'beiðnina'} í heild áður en nokkuð fer af stað.</p>
      </div>
    </form>
  )
}
