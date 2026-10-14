import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT, LABELS, ON_CALL, ROUTE, SECTORS, STAGES } from './data'
import { useList } from './store'

/* One request flow with five ways in: packaging, a new machine, a machine in use, labels, or
   "not sure". Each brief names the department that receives it, so one form serves the whole
   group. The visitor reviews a finished brief and then opens it in their own mail program or
   copies it. Nothing is sent from this prototype; a live build posts to the right inbox and
   shows a reference only once delivery has succeeded. */

export type Branch = 'umbudir' | 'vel' | 'thjonusta' | 'merkingar' | 'veit-ekki'

const ROUTES: Record<Branch, { to: string; dept: string }> = {
  umbudir: { to: CONTACT.email, dept: 'Sala, Samhentir' },
  vel: { to: CONTACT.machines, dept: 'Véladeild Samhentra og Plastco' },
  thjonusta: { to: CONTACT.service, dept: 'Þjónusta við vélar' },
  merkingar: { to: 'vorumerking@vorumerking.is', dept: 'Vörumerking' },
  'veit-ekki': { to: CONTACT.email, dept: 'Sala, Samhentir' },
}

const PACK = ['Kassar og öskjur', 'Plast, bakkar og filmur', 'Pokar', 'Frauðplastkassar', 'Rekstrarvörur', 'Krydd og íblöndunarefni', 'Annað']
const KINDS = [
  { id: 'bilun', name: 'Bilun' },
  { id: 'varahlutur', name: 'Varahlutur' },
  { id: 'vidhald', name: 'Viðhald' },
  { id: 'uppsetning', name: 'Uppsetning' },
  { id: 'thjalfun', name: 'Þjálfun' },
]
const TIMING = ['Sem fyrst', 'Á næstu þremur mánuðum', 'Á þessu ári', 'Ég er bara að skoða']
const PART = ['Vélbúnaður', 'Hugbúnaður', 'Veit ekki']

interface Draft {
  branch: Branch | null
  ref: string
  company: string; person: string; email: string; phone: string
  sectors: string[]; product: string; pack: string[]; quantity: string; print: boolean; sample: boolean
  tasks: string[]; throughput: string; timing: string; space: string
  maker: string; model: string; serial: string; part: string; contract: string; contractNo: string; kind: string; desc: string; address: string; urgent: boolean
  labelTypes: string[]; size: string; colours: string; artwork: string
  extra: string; free: string
}

const blank = (): Draft => ({
  branch: null, ref: '',
  company: '', person: '', email: '', phone: '',
  sectors: [], product: '', pack: [], quantity: '', print: false, sample: false,
  tasks: [], throughput: '', timing: '', space: '',
  maker: '', model: '', serial: '', part: '', contract: '', contractNo: '', kind: '', desc: '', address: '', urgent: false,
  labelTypes: [], size: '', colours: '', artwork: '',
  extra: '', free: '',
})

const KEY = 'sh-request-draft'
const MAX_FILES = 5
const MAX_MB = 10

const makeRef = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  const rnd = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('')
  return `SH-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${rnd}`
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
type ListKey = 'sectors' | 'tasks' | 'pack' | 'labelTypes'

export interface FormStart { branch?: Branch; sector?: string; sample?: boolean }

const LABEL: Record<Branch, string> = {
  umbudir: 'Umbúðir og rekstrarvörur',
  vel: 'Ný vél eða ráðgjöf',
  thjonusta: 'Vél í notkun',
  merkingar: 'Merkingar og límmiðar',
  'veit-ekki': 'Ég veit ekki enn',
}

export function RequestForm({ start, lock }: { start?: FormStart; lock?: Branch }) {
  const list = useList()
  const [d, setD] = useState<Draft>(() => {
    const cur = loadDraft()
    const next = { ...cur }
    if (lock) next.branch = lock
    else if (start?.branch) next.branch = start.branch
    if (start?.sector && !next.sectors.includes(start.sector)) next.sectors = [...next.sectors, start.sector]
    if (start?.sample) next.sample = true
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
  const toggle = (k: ListKey, id: string) => {
    setD((cur) => ({ ...cur, [k]: cur[k].includes(id) ? cur[k].filter((x) => x !== id) : [...cur[k], id] }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const listNames = list.items.map((i) => i.label)
  const route = d.branch ? ROUTES[d.branch] : ROUTES['veit-ekki']

  const validate = (): Errors => {
    const e: Errors = {}
    if (!d.person.trim()) e.person = 'Skrifaðu nafn svo við vitum hver hefur samband.'
    if (!d.email.trim() && !d.phone.trim()) { e.email = 'Settu inn netfang eða símanúmer.'; e.phone = 'Settu inn símanúmer eða netfang.' }
    if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = 'Netfangið virðist ekki vera rétt, til dæmis nafn@fyrirtaeki.is.'
    if (d.branch === 'umbudir' || d.branch === 'vel' || d.branch === 'merkingar') {
      if (!d.company.trim()) e.company = 'Skrifaðu nafn fyrirtækisins.'
    }
    if (d.branch === 'umbudir' && !d.pack.length && !listNames.length) e.pack = 'Veldu hvað þig vantar, eða bættu vöru á fyrirspurnalistann.'
    if (d.branch === 'vel' && !d.product.trim() && !listNames.length) e.product = 'Segðu okkur hvað þú framleiðir, eða bættu vél á fyrirspurnalistann.'
    if (d.branch === 'thjonusta') {
      if (!d.model.trim()) e.model = 'Skrifaðu gerð vélarinnar, eða „veit ekki“.'
      if (!d.kind) e.kind = 'Veldu hvers konar erindi þetta er.'
      if (!d.desc.trim()) e.desc = 'Lýstu í stuttu máli hvað er að, eða hvaða varahlut vantar.'
    }
    if (d.branch === 'merkingar' && !d.labelTypes.length) e.labelTypes = 'Veldu hvers konar merkingar þú ert að skoða.'
    if (d.branch === 'veit-ekki' && d.free.trim().length < 10) e.free = 'Skrifaðu nokkur orð um hvað þú ert að leita að.'
    return e
  }

  const focusFirst = (e: Errors) => {
    window.setTimeout(() => {
      summary.current?.focus()
      const id = Object.keys(e).find((k) => e[k])
      if (id) document.getElementById(`shf-${id}`)?.scrollIntoView({ block: 'center', behavior: 'auto' })
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
      if (!/^image\/|^application\/pdf$/.test(f.type) && !/\.(ai|eps|tif|tiff)$/i.test(f.name)) { notes.push(`${f.name}: aðeins myndir, PDF, AI, EPS eða TIFF.`); continue }
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
    const who = () => { row('Fyrirtæki', d.company); row('Tengiliður', d.person); row('Sími', d.phone); row('Netfang', d.email); L.push('') }
    const sectors = join(d.sectors.map((s) => SECTORS.find((x) => x.slug === s)?.name ?? s))
    L.push('Fyrirspurn til Samhentra')
    L.push(`Tilvísun: ${d.ref}`)
    if (d.branch) L.push(`Tegund: ${LABEL[d.branch]}`)
    L.push(`Fer til: ${route.dept} (${route.to})`)
    L.push('')
    if (d.branch === 'umbudir') {
      who()
      row('Atvinnugrein', sectors)
      row('Hvað vantar', join(d.pack))
      row('Varan sem á að pakka', d.product)
      row('Magn, ef vitað', d.quantity)
      if (d.print) L.push('Áprentun: já, með okkar merki eða texta')
      if (d.sample) L.push('Sýnishorn til mátunar: já, takk')
      row('Á fyrirspurnalista', join(listNames))
      row('Annað', d.extra)
    }
    if (d.branch === 'vel') {
      who()
      row('Atvinnugrein', sectors)
      row('Hvað er framleitt', d.product)
      row('Skref í línunni', join(d.tasks.map((t) => STAGES.find((x) => x.id === t)?.name ?? t)))
      row('Áætluð afköst', d.throughput)
      row('Hvenær', d.timing)
      row('Pláss og aðstæður', d.space)
      row('Vélar á fyrirspurnalista', join(listNames))
      row('Annað', d.extra)
    }
    if (d.branch === 'thjonusta') {
      who()
      row('Framleiðandi', d.maker)
      row('Gerð vélar', d.model)
      row('Raðnúmer', d.serial)
      row('Vélbúnaður eða hugbúnaður', d.part)
      row('Þjónustusamningur', d.contract === 'ja' ? `Já${d.contractNo.trim() ? `, nr. ${d.contractNo.trim()}` : ''}` : d.contract === 'nei' ? 'Nei' : '')
      row('Erindi', KINDS.find((k) => k.id === d.kind)?.name ?? '')
      row('Lýsing', d.desc)
      row('Staður', d.address)
      if (d.urgent) L.push('Framleiðsla stendur kyrr: já, ég hringi líka')
    }
    if (d.branch === 'merkingar') {
      who()
      row('Tegund merkinga', join(d.labelTypes))
      row('Stærð og lögun', d.size)
      row('Magn', d.quantity)
      row('Fjöldi lita', d.colours)
      row('Prentskrár', d.artwork === 'tilbuid' ? 'Tilbúnar samkvæmt leiðbeiningum' : d.artwork === 'adstod' ? 'Vantar aðstoð við hönnun' : '')
      row('Annað', d.extra)
    }
    if (d.branch === 'veit-ekki') {
      who()
      row('Lýsing', d.free)
      row('Á fyrirspurnalista', join(listNames))
    }
    if (files.length) { L.push(''); L.push(`Viðhengi (hengd við tölvupóstinn): ${files.map((f) => f.name).join(', ')}`) }
    return L.join('\n')
  }, [d, files, listNames, route])

  const subject = useMemo(() => {
    const m = d.branch === 'thjonusta' ? [d.maker, d.model].filter(Boolean).join(' ') : d.company
    return `${d.branch ? LABEL[d.branch] : 'Fyrirspurn'}${m ? `: ${m}` : ''} (${d.ref})`
  }, [d])

  const mailto = `mailto:${route.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brief)
      setCopied(true)
    } catch {
      const ta = document.getElementById('shf-brief') as HTMLTextAreaElement | null
      ta?.select()
      setCopied(document.execCommand?.('copy') === true)
    }
    window.setTimeout(() => setCopied(false), 2400)
  }

  const reset = () => {
    if (!window.confirm('Byrja nýja fyrirspurn? Það sem þú hefur skrifað og fyrirspurnalistinn tæmast.')) return
    setD({ ...blank(), ref: makeRef() }); setFiles([]); setErrors({}); setStep('val'); list.clear()
  }

  /* the brief textarea grows to its text, so nothing is hidden behind an inner scroll */
  useEffect(() => {
    if (step !== 'yfirlit') return
    const fit = () => { const t = document.getElementById('shf-brief'); if (t) { t.style.height = 'auto'; t.style.height = `${t.scrollHeight + 2}px` } }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [step, brief])

  const errKeys = Object.keys(errors).filter((k) => errors[k])
  const field = (id: keyof Draft | string) => ({
    id: `shf-${id}`,
    'aria-invalid': errors[id as string] ? true : undefined,
    'aria-describedby': errors[id as string] ? `shf-${id}-e` : undefined,
  })
  const err = (id: string) => (errors[id] ? <p className="sh-err" id={`shf-${id}-e`}>{errors[id]}</p> : null)
  const Err = ({ id }: { id: string }) => (errors[id] ? <p className="sh-err" id={`shf-${id}-e`}>{errors[id]}</p> : null)
  /* a render function, not a component: a component declared here would remount its inputs and drop focus */
  const chips = (k: ListKey, legend: string, options: { id: string; name: string }[], first = false) => (
    <fieldset className="sh-fld sh-chips" aria-describedby={errors[k] ? `shf-${k}-e` : undefined}><legend>{legend}</legend>
      {options.map((o, i) => (
        <label key={o.id} className={`sh-chip${d[k].includes(o.id) ? ' is-on' : ''}`}><input type="checkbox" id={first && i === 0 ? `shf-${k}` : undefined} checked={d[k].includes(o.id)} onChange={() => toggle(k, o.id)} /><span>{o.name}</span></label>
      ))}
      {err(k)}
    </fieldset>
  )
  const sectorChips = chips('sectors', 'Atvinnugrein', SECTORS.map((s) => ({ id: s.slug, name: s.name })))

  /* ── step 1: which way in ── */
  if (step === 'val' && !lock) {
    const opts: { id: Branch; s: string }[] = [
      { id: 'umbudir', s: 'Kassar, öskjur, plast, pokar, frauðplastkassar og rekstrarvörur, staðlað eða sérsniðið.' },
      { id: 'vel', s: 'Pökkunarvélar, vogir, prentarar, kassavélar, brettavafning eða heil lína.' },
      { id: 'thjonusta', s: 'Bilun, varahlutur, viðhald, uppsetning eða þjálfun á vél sem þú átt.' },
      { id: 'merkingar', s: 'Límmiðar, állok, áprentuð filma eða plastkort frá Vörumerkingu.' },
      { id: 'veit-ekki', s: 'Lýstu því í nokkrum orðum og við finnum rétta leið.' },
    ]
    return (
      <div className="sh-form" ref={top}>
        <p className="sh-form__step mono">Skref 1 af 3</p>
        <h2 className="sh-form__h" id="shf-title">Hvað vantar þig?</h2>
        <div className="sh-opts" role="radiogroup" aria-labelledby="shf-title">
          {opts.map((o) => (
            <label key={o.id} className={`sh-opt${d.branch === o.id ? ' is-on' : ''}`}>
              <input type="radio" name="shf-branch" checked={d.branch === o.id} onChange={() => { set('branch', o.id); setStep('upplysingar') }} />
              <span className="sh-opt__t">{LABEL[o.id]}</span>
              <span className="sh-opt__s">{o.s}</span>
              <span className="sh-opt__to mono">Fer til: {ROUTES[o.id].dept}</span>
            </label>
          ))}
        </div>
        <p className="sh-form__note">Ef framleiðslan stendur kyrr, hringdu frekar strax: skiptiborð <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>, utan opnunartíma {ON_CALL[0].name} <a href={ON_CALL[0].href}>{ON_CALL[0].phone}</a>.</p>
      </div>
    )
  }

  /* ── step 3: the finished brief ── */
  if (step === 'yfirlit') {
    return (
      <div className="sh-form" ref={top}>
        <p className="sh-form__step mono">Skref 3 af 3</p>
        <h2 className="sh-form__h">Fyrirspurnin þín er tilbúin</h2>
        <p className="sh-form__lead">Svona les {route.dept.toLowerCase().startsWith('vörumerking') ? 'Vörumerking' : 'starfsmaður'} hana. Allt sem þarf til að svara er á einum stað.</p>
        <textarea id="shf-brief" className="sh-brief" readOnly value={brief} rows={brief.split('\n').length} aria-label="Fyrirspurnin í heild" />
        <div className="sh-form__actions">
          <a className="sh-btn sh-btn--blue" href={mailto}><span className="roll"><span>Opna í tölvupósti</span></span></a>
          <button type="button" className="sh-btn sh-btn--white" onClick={copy}><span className="roll"><span>{copied ? 'Afritað' : 'Afrita texta'}</span></span></button>
          <button type="button" className="sh-btn sh-btn--text" onClick={() => setStep('upplysingar')}>Breyta</button>
        </div>
        {files.length > 0 && <p className="sh-form__note">Viðhengi fylgja ekki tölvupóstslinknum. Hengdu þau við þegar póstforritið opnast: {files.map((f) => f.name).join(', ')}.</p>}
        <p className="sh-form__proto">Þetta er frumgerð og ekkert er sent héðan. Þú opnar póstforritið þitt eða afritar textann. Í fullbúinni síðu fer fyrirspurnin beint til {route.dept.toLowerCase().startsWith('vörumerking') ? 'Vörumerkingar' : route.dept.toLowerCase()} og þú færð tilvísunarnúmerið {d.ref} þegar hún hefur borist.</p>
        <button type="button" className="sh-btn sh-btn--text" onClick={reset}>Byrja nýja fyrirspurn</button>
      </div>
    )
  }

  /* ── step 2: the details ── */
  const heads: Record<Branch, string> = {
    umbudir: 'Segðu okkur hvað á að pakka',
    vel: 'Segðu okkur hvað þú framleiðir',
    thjonusta: 'Segðu okkur frá vélinni',
    merkingar: 'Segðu okkur hvað á að merkja',
    'veit-ekki': 'Segðu okkur hvað þú ert að leita að',
  }
  const b = d.branch ?? 'veit-ekki'
  return (
    <form className="sh-form" ref={top as never} noValidate onSubmit={(e) => { e.preventDefault(); next() }}>
      <p className="sh-form__step mono">{lock ? 'Skref 1 af 2' : 'Skref 2 af 3'} · {LABEL[b]}{!lock && <> · <button type="button" className="sh-link" onClick={() => setStep('val')}>Breyta</button></>}</p>
      <h2 className="sh-form__h">{heads[b]}</h2>
      <p className="sh-form__to mono">Fer til: {route.dept}</p>

      {errKeys.length > 0 && (
        <div className="sh-errsum" role="alert" tabIndex={-1} ref={summary}>
          <strong>Það vantar upplýsingar</strong>
          <ul>{errKeys.map((k) => <li key={k}><a href={`#shf-${k}`} onClick={(e) => { e.preventDefault(); document.getElementById(`shf-${k}`)?.focus() }}>{errors[k]}</a></li>)}</ul>
        </div>
      )}

      {(b === 'umbudir' || b === 'vel' || b === 'merkingar') && (
        <div className="sh-grid2">
          <div className="sh-fld"><label htmlFor="shf-company">Fyrirtæki</label><input {...field('company')} value={d.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" /><Err id="company" /></div>
          <div className="sh-fld"><label htmlFor="shf-timing">Hvenær</label>
            <select id="shf-timing" value={d.timing} onChange={(e) => set('timing', e.target.value)}><option value="">Veldu</option>{TIMING.map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
      )}

      {b === 'umbudir' && (
        <>
          {sectorChips}
          {chips('pack', 'Hvað vantar', PACK.map((p) => ({ id: p, name: p })), true)}
          <div className="sh-grid2">
            <div className="sh-fld"><label htmlFor="shf-product">Varan sem á að pakka, valfrjálst</label><input id="shf-product" value={d.product} onChange={(e) => set('product', e.target.value)} placeholder="Til dæmis fersk laxaflök, kökur, ís" /></div>
            <div className="sh-fld"><label htmlFor="shf-quantity">Magn, ef vitað</label><input id="shf-quantity" value={d.quantity} onChange={(e) => set('quantity', e.target.value)} placeholder="Til dæmis 5.000 kassar á mánuði" /></div>
          </div>
          <label className={`sh-check${d.print ? ' is-on' : ''}`}><input type="checkbox" checked={d.print} onChange={(e) => set('print', e.target.checked)} /><span>Ég vil áprentun, með mínu merki eða texta</span></label>
          <label className={`sh-check${d.sample ? ' is-on' : ''}`}><input type="checkbox" checked={d.sample} onChange={(e) => set('sample', e.target.checked)} /><span>Ég vil fá sýnishorn til mátunar</span></label>
          <ListField />
          <div className="sh-fld"><label htmlFor="shf-extra">Annað, valfrjálst</label><textarea id="shf-extra" rows={3} value={d.extra} onChange={(e) => set('extra', e.target.value)} /></div>
        </>
      )}

      {b === 'vel' && (
        <>
          {sectorChips}
          <div className="sh-fld"><label htmlFor="shf-product">Hvað er framleitt</label>
            <input {...field('product')} value={d.product} onChange={(e) => set('product', e.target.value)} placeholder="Til dæmis fersk laxaflök í bökkum, frosinn fiskur í öskjum" /><Err id="product" /></div>
          {chips('tasks', 'Skref í línunni', STAGES.map((s) => ({ id: s.id, name: s.name })))}
          <div className="sh-grid2">
            <div className="sh-fld"><label htmlFor="shf-throughput">Áætluð afköst, ef þú veist</label><input id="shf-throughput" value={d.throughput} onChange={(e) => set('throughput', e.target.value)} placeholder="Til dæmis 40 bakkar á mínútu" /></div>
            <div className="sh-fld"><label htmlFor="shf-space">Pláss og aðstæður, valfrjálst</label><input id="shf-space" value={d.space} onChange={(e) => set('space', e.target.value)} /></div>
          </div>
          <ListField />
          <div className="sh-fld"><label htmlFor="shf-extra">Annað, valfrjálst</label><textarea id="shf-extra" rows={3} value={d.extra} onChange={(e) => set('extra', e.target.value)} /></div>
        </>
      )}

      {b === 'thjonusta' && (
        <>
          <div className="sh-grid2">
            <div className="sh-fld"><label htmlFor="shf-maker">Framleiðandi, ef þú veist</label><input id="shf-maker" value={d.maker} onChange={(e) => set('maker', e.target.value)} placeholder="Til dæmis Sealpac eða Ilapak" /></div>
            <div className="sh-fld"><label htmlFor="shf-model">Gerð vélar</label><input {...field('model')} value={d.model} onChange={(e) => set('model', e.target.value)} placeholder="Gerðarheitið á skilti vélarinnar" spellCheck={false} autoComplete="off" /><Err id="model" /></div>
          </div>
          <div className="sh-grid2">
            <div className="sh-fld"><label htmlFor="shf-serial">Raðnúmer, ef þú hefur það</label><input id="shf-serial" value={d.serial} onChange={(e) => set('serial', e.target.value)} autoCapitalize="characters" spellCheck={false} autoComplete="off" /></div>
            <div className="sh-fld"><label htmlFor="shf-address">Hvar er vélin</label><input id="shf-address" value={d.address} onChange={(e) => set('address', e.target.value)} placeholder="Heimilisfang eða staður" autoComplete="street-address" /></div>
          </div>
          <fieldset className="sh-fld sh-chips"><legend>Vélbúnaður eða hugbúnaður</legend>
            {PART.map((p) => <label key={p} className={`sh-chip${d.part === p ? ' is-on' : ''}`}><input type="radio" name="shf-part" checked={d.part === p} onChange={() => set('part', p)} /><span>{p}</span></label>)}
          </fieldset>
          <div className="sh-grid2 sh-grid2--end">
            <fieldset className="sh-fld sh-chips"><legend>Þjónustusamningur</legend>
              {[{ id: 'ja', n: 'Já' }, { id: 'nei', n: 'Nei' }].map((o) => <label key={o.id} className={`sh-chip${d.contract === o.id ? ' is-on' : ''}`}><input type="radio" name="shf-contract" checked={d.contract === o.id} onChange={() => set('contract', o.id)} /><span>{o.n}</span></label>)}
            </fieldset>
            {d.contract === 'ja' && <div className="sh-fld"><label htmlFor="shf-contractNo">Númer samnings</label><input id="shf-contractNo" value={d.contractNo} onChange={(e) => set('contractNo', e.target.value)} spellCheck={false} autoComplete="off" /></div>}
          </div>
          <fieldset className="sh-fld sh-chips" aria-describedby={errors.kind ? 'shf-kind-e' : undefined}><legend>Erindi</legend>
            {KINDS.map((k) => (
              <label key={k.id} className={`sh-chip${d.kind === k.id ? ' is-on' : ''}`}><input type="radio" name="shf-kind" id={k.id === KINDS[0].id ? 'shf-kind' : undefined} checked={d.kind === k.id} onChange={() => set('kind', k.id)} /><span>{k.name}</span></label>
            ))}
            <Err id="kind" />
          </fieldset>
          <div className="sh-fld"><label htmlFor="shf-desc">Hvað er að, eða hvaða varahlut vantar</label>
            <textarea {...field('desc')} rows={4} value={d.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Til dæmis villuboð á skjá, hljóð, hvenær það byrjaði" /><Err id="desc" /></div>
          <label className={`sh-check${d.urgent ? ' is-on' : ''}`}><input type="checkbox" checked={d.urgent} onChange={(e) => set('urgent', e.target.checked)} /><span>Framleiðslan stendur kyrr</span></label>
          {d.urgent && <p className="sh-urgent">Hringdu líka, það er fljótlegast: skiptiborð <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>, utan opnunartíma {ON_CALL.map((p, i) => <span key={p.phone}>{i ? ' eða ' : ''}{p.name} <a href={p.href}>{p.phone}</a></span>)}.</p>}
        </>
      )}

      {b === 'merkingar' && (
        <>
          {chips('labelTypes', 'Hvers konar merkingar', LABELS.products.map((p) => ({ id: p.k, name: p.k })), true)}
          <div className="sh-grid2">
            <div className="sh-fld"><label htmlFor="shf-size">Stærð og lögun, valfrjálst</label><input id="shf-size" value={d.size} onChange={(e) => set('size', e.target.value)} placeholder="Til dæmis 80 × 50 mm, rúnnuð horn" /></div>
            <div className="sh-fld"><label htmlFor="shf-quantity">Magn</label><input id="shf-quantity" value={d.quantity} onChange={(e) => set('quantity', e.target.value)} placeholder="Einn, fimmtíu eða fimmtíu þúsund" /></div>
          </div>
          <div className="sh-grid2">
            <div className="sh-fld"><label htmlFor="shf-colours">Fjöldi lita, valfrjálst</label><input id="shf-colours" value={d.colours} onChange={(e) => set('colours', e.target.value)} placeholder="Allt að 12 litir" /></div>
            <fieldset className="sh-fld sh-chips"><legend>Prentskrár</legend>
              {[{ id: 'tilbuid', n: 'Tilbúnar' }, { id: 'adstod', n: 'Vantar aðstoð' }].map((o) => <label key={o.id} className={`sh-chip${d.artwork === o.id ? ' is-on' : ''}`}><input type="radio" name="shf-artwork" checked={d.artwork === o.id} onChange={() => set('artwork', o.id)} /><span>{o.n}</span></label>)}
            </fieldset>
          </div>
          <p className="sh-form__note">Leiðbeiningar um prentskrár eru á síðunni <Link to={`${ROUTE}/merkingar`}>Merkingar</Link>: letur útlínað, 2 mm blæði, CMYK og 300 dpi.</p>
          <div className="sh-fld"><label htmlFor="shf-extra">Annað, valfrjálst</label><textarea id="shf-extra" rows={3} value={d.extra} onChange={(e) => set('extra', e.target.value)} /></div>
        </>
      )}

      {b === 'veit-ekki' && (
        <div className="sh-fld"><label htmlFor="shf-free">Hvað ert þú að leita að</label>
          <textarea {...field('free')} rows={5} value={d.free} onChange={(e) => set('free', e.target.value)} placeholder="Skrifaðu eins og þér er eðlilegt, við tökum við þessu eins og það er." /><Err id="free" /></div>
      )}

      <div className="sh-sect">
        <p className="sh-lbl">Hver ert þú</p>
        <div className="sh-grid2">
          <div className="sh-fld"><label htmlFor="shf-person">Nafn</label><input {...field('person')} value={d.person} onChange={(e) => set('person', e.target.value)} autoComplete="name" /><Err id="person" /></div>
          {(b === 'thjonusta' || b === 'veit-ekki') && <div className="sh-fld"><label htmlFor="shf-company">Fyrirtæki, valfrjálst</label><input id="shf-company" value={d.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" /></div>}
          <div className="sh-fld"><label htmlFor="shf-phone">Sími</label><input {...field('phone')} type="tel" inputMode="tel" value={d.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" /><Err id="phone" /></div>
          <div className="sh-fld"><label htmlFor="shf-email">Netfang</label><input {...field('email')} type="email" inputMode="email" value={d.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" spellCheck={false} /><Err id="email" /></div>
        </div>
      </div>

      {b !== 'veit-ekki' && (
        <div className="sh-fld sh-files">
          <span className="sh-lbl">{b === 'merkingar' ? 'Prentskrár eða skissur, valfrjálst' : 'Myndir eða skjöl, valfrjálst'}</span>
          <label className="sh-filebtn"><input type="file" multiple accept="image/*,application/pdf,.ai,.eps,.tif,.tiff" onChange={onFiles} /><span>Velja skrár</span></label>
          <p className="sh-form__note">Allt að {MAX_FILES} skrár, hver að {MAX_MB} MB. Þú getur alltaf lýst þessu í orðum í staðinn.</p>
          {fileNote && <p className="sh-err" role="status">{fileNote}</p>}
          {files.length > 0 && <ul className="sh-tags">{files.map((f, i) => <li key={`${f.name}${i}`}>{f.name} <span className="mono">{kb(f.size)}</span><button type="button" aria-label={`Fjarlægja ${f.name}`} onClick={() => setFiles(files.filter((_, j) => j !== i))}>×</button></li>)}</ul>}
        </div>
      )}

      <div className="sh-form__actions">
        <button type="submit" className="sh-btn sh-btn--blue"><span className="roll"><span>Skoða fyrirspurnina</span></span></button>
        <p className="sh-form__note">Þú sérð fyrirspurnina í heild áður en nokkuð fer af stað.</p>
      </div>
    </form>
  )
}

/** what the visitor collected while browsing, carried into the request */
function ListField() {
  const list = useList()
  return (
    <div className="sh-fld">
      <span className="sh-lbl">Á fyrirspurnalista</span>
      {list.items.length ? (
        <ul className="sh-tags">{list.items.map((i) => <li key={i.id}>{i.label}<button type="button" aria-label={`Taka ${i.label} af listanum`} onClick={() => list.remove(i.id)}>×</button></li>)}</ul>
      ) : <p className="sh-form__note">Listinn er tómur. Þú getur bætt vélum og vörum á hann á síðunum <Link to={`${ROUTE}/velar`}>Vélar</Link> og atvinnugreinanna, eða sleppt því og lýst því sem þú þarft.</p>}
    </div>
  )
}
