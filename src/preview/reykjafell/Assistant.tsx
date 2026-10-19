import { useEffect, useRef, useState, type ReactNode } from 'react'
import { C, reduced, useGoto, usePanelFocus } from './ui'
import { CONTACT, KLASAR, SKILMALAR, TEXTI, VIDBURDIR, folkmynd, starfsmadur, vorumynd, type Starfsmadur, type Vara } from './data'
import { Lager, klasiFyrir, leita, norm, useBrief } from './Tools'

/* "Spyrja Reykjafell": the assistant.

   In this prototype every answer is computed in the browser from Reykjafell's
   own records: the catalogue sample with its stock and datasheets, the events
   their registration forms carry, the people their staff page names, their
   opening hours, emergency numbers and terms. Nothing leaves the page and no
   model is called, so nothing is spent. The live version puts the same
   records behind Claude (Haiku 5.5) on a Worker with a per-user rate limit,
   and the same hand-off: a question it cannot settle goes to the named person
   with the question attached. */

type Kort =
  | { t: 'vara'; v: Vara }
  | { t: 'folk'; p: Starfsmadur; why?: string }
  | { t: 'vidburdur'; e: (typeof VIDBURDIR)[number] }
  | { t: 'hnappur'; label: string; hash: string }
interface Svar { texti: string; kort?: Kort[]; til?: Starfsmadur }
interface Skilabod { fra: 'notandi' | 'adstod'; texti: string; kort?: Kort[]; til?: Starfsmadur }

const has = (q: string, ...w: string[]) => w.some((x) => q.includes(x))
const MAN = ['jan.', 'feb.', 'mar.', 'apr.', 'maí', 'jún.', 'júl.', 'ágú.', 'sep.', 'okt.', 'nóv.', 'des.']
const dags = (iso: string) => { const d = new Date(iso); return `${d.getUTCDate()}. ${MAN[d.getUTCMonth()]} kl. ${iso.slice(11, 16)}` }
const SOLU = () => starfsmadur('adalsteinn-richter')

/** The whole engine: intents first (their own words), then the catalogue. */
export function svara(raw: string): Svar {
  const q = norm(raw)
  const ak = has(q, 'akureyri', ' ak ', 'aey', 'nordan', 'baldursnes')

  if (/^(hae|hallo|sael|saell|godan dag|hi|hello)\b/.test(q) && q.length < 18) {
    return { texti: 'Góðan dag. Spurðu um vöru, lagerstöðu, námskeið, skil eða hver sér um hvað. Ég svara úr vörulista og skilmálum Reykjafells.' }
  }
  if (has(q, 'neyd', 'utan opnun', 'um helgi', 'a kvoldin', 'naetur', 'bilun nuna', 'straumlaus')) {
    return { texti: `Utan opnunartíma er neyðarsími Reykjafells ${CONTACT.neyd} í Reykjavík og ${CONTACT.ak.neyd} á Akureyri. ${CONTACT.opid}`, kort: [{ t: 'hnappur', label: 'Þjónusta og bilanir', hash: '#thjonusta' }] }
  }
  if (has(q, 'opid', 'opnunar', 'hvenaer lokar', 'hvenaer opnar', 'afgreidsla', 'opnar')) {
    return { texti: `${CONTACT.opid} ${CONTACT.netverslun}` }
  }
  if (has(q, 'heimilisfang', 'hvar erud', 'stadsetn', 'blikastad', 'korputorg', 'hvert a eg', 'keyra til')) {
    return { texti: `Höfuðstöðvarnar eru á ${CONTACT.heimilisfang}, ${CONTACT.postnumer}, við Korputorg, sími ${CONTACT.simi}. Útibúið er á ${CONTACT.ak.heimilisfang}, ${CONTACT.ak.postnumer}, sími ${CONTACT.ak.simi}. ${CONTACT.opidStutt}.` }
  }
  if (has(q, 'skila', 'skil ', 'skilarett', 'endurgreid', 'inneign')) {
    return { texti: SKILMALAR.skil, kort: [{ t: 'hnappur', label: 'Senda þjónustubeiðni', hash: '#hafa-samband' }] }
  }
  if (has(q, 'gallad', 'galli', 'skemmd', 'brotid', 'vantar i send', 'rong vara')) {
    return { texti: `${SKILMALAR.gallar} Tilgreindu vörunúmer, reikning og lýsingu, helst með mynd.`, kort: [{ t: 'hnappur', label: 'Senda þjónustubeiðni', hash: '#hafa-samband' }] }
  }
  if (has(q, 'reidufe', 'sedlar', 'peningum', 'cash')) return { texti: SKILMALAR.reidufe }
  if (has(q, 'senda', 'sendid', 'sending', 'afhend', 'postur', 'flutning', 'ut a land')) {
    return { texti: `${SKILMALAR.afhending} ${CONTACT.netverslun}` }
  }
  if (has(q, 'serpont', 'serpanta', 'panta inn', 'ekki a lager')) {
    return { texti: `${SKILMALAR.serpantanir} Settu vöruna á efnislistann og sendu sem tilboðsbeiðni, þá fær sölumaður hana með afhendingartíma.`, kort: [{ t: 'hnappur', label: 'Efnislisti og tilboð', hash: '#efnislisti' }] }
  }
  if (has(q, 'einstakling', 'kaupa sjalf', 'heimilid mitt', 'byko', 'almenning', 'smasala')) {
    return { texti: TEXTI.fagmadur }
  }
  if (has(q, 'adgang', 'reikningsvid', 'stofna reikning', 'innskra', 'logg', 'netverslun')) {
    const p = starfsmadur('asgeir-thordarson')
    return { texti: `${TEXTI.aukahl} ${TEXTI.netverslun}`, kort: [{ t: 'hnappur', label: 'Sækja um aðgang', hash: '#hafa-samband' }, ...(p ? [{ t: 'folk' as const, p, why: 'Viðskiptastjóri netverslunar' }] : [])] }
  }
  if (has(q, 'verd', 'kostar', 'kostnad', 'afslatt', 'tilbod')) {
    const vara = leita(raw, 1).filter((h) => h.score >= 3)
    return {
      texti: `Verð birtist fyrirtækjum í reikningsviðskiptum við innskráningu. ${SKILMALAR.verd} ${SKILMALAR.tilbodGildir} Fljótlegast er að setja vöruna á efnislistann og senda sem tilboðsbeiðni.`,
      kort: [...vara.map((h) => ({ t: 'vara' as const, v: h.v })), { t: 'hnappur' as const, label: 'Efnislisti og tilboð', hash: '#efnislisti' }],
    }
  }
  if (has(q, 'namskeid', 'kynning', 'vidburd', 'fyrirlestur', 'skraning', 'skra mig')) {
    const nu = Date.now()
    const naest = VIDBURDIR.filter((e) => new Date(e.start).getTime() >= nu && (!ak || e.loc === 'AK')).slice(0, 3)
    if (!naest.length) return { texti: 'Enginn viðburður er skráður framundan í augnablikinu.', kort: [{ t: 'hnappur', label: 'Viðburðadagatalið', hash: '#vidburdir' }] }
    return { texti: `Næst${naest.length > 1 ? 'u' : ''} á dagskrá${ak ? ' á Akureyri' : ''}:`, kort: [...naest.map((e) => ({ t: 'vidburdur' as const, e })), { t: 'hnappur', label: 'Allt dagatalið', hash: '#vidburdir' }] }
  }
  if (has(q, 'hver ser um', 'hver selur', 'tengilid', 'solumad', 'hringja i', 'tala vid', 'serfraed', 'hver er')) {
    const k = KLASAR.find((x) => has(q, norm(x.titill).split(/[ ,]+/)[0]) || x.merki.some((m) => q.includes(norm(m)))) ??
      (has(q, 'hledsl', 'easee', 'dyrasim', 'snjall', 'ups', 'varaafl', 'umferd') ? KLASAR[3] : has(q, 'jardstreng', 'dreifi', 'yfirspenn') ? KLASAR[1] : has(q, 'maeli', 'janitza', 'thjark', 'kuka') ? KLASAR[2] : has(q, 'lamp', 'ljos', 'lysing') ? KLASAR[0] : null)
    if (has(q, 'framkvaemdastjor', 'forstjor', 'stjornar')) {
      const e = starfsmadur('einar-thor-einarsson'); const k2 = starfsmadur('kristinn-benediktsson')
      return { texti: 'Einar Þór Einarsson er framkvæmdastjóri og Kristinn Benediktsson aðstoðarframkvæmdastjóri, frá september 2026.', kort: [e, k2].filter((x): x is Starfsmadur => !!x).map((p) => ({ t: 'folk' as const, p })) }
    }
    if (ak) {
      const a = starfsmadur('adalsteinn-e-bergthorsson')
      return { texti: 'Á Akureyri ber Aðalsteinn E. Bergþórsson ábyrgð á útibúinu.', kort: a ? [{ t: 'folk', p: a }] : [] }
    }
    if (k) { const p = starfsmadur(k.abyrgd); return { texti: `${k.titill}: ${p?.name} er ábyrgðarmaður klasans.`, kort: p ? [{ t: 'folk', p, why: k.titill }] : [] } }
    const s = SOLU()
    return { texti: 'Söludeildin skiptist í klasa: lýsing, afldreifing, iðnstýringar, samgöngur og hleðsla, og raflagnir. Segðu mér um hvað málið snýst, eða talaðu við fyrirliða söludeildar.', kort: s ? [{ t: 'folk', p: s, why: 'Fyrirliði söludeildar' }] : [] }
  }

  /* the catalogue */
  const hits = leita(raw, 3)
  if (hits.length) {
    const top = hits[0].v
    const k = klasiFyrir(top.fam)
    const p = starfsmadur(k.abyrgd)
    const lagerSpurt = has(q, 'lager', 'til ', 'eigid', 'eigi', 'til?', 'stock')
    let texti: string
    if (hits[0].score === 100) {
      const stadir = top.loc.map((l) => (l === 'AEY' ? 'á Akureyri' : 'í Reykjavík')).join(' og ')
      texti = top.stock > 0
        ? `${top.name}${top.model ? ` (${top.model})` : ''}, vörunúmer ${top.sku}: ${top.stock} á lager ${stadir}${ak && !top.loc.includes('AEY') ? '. Á Akureyri er hún ekki á lager núna, aðeins í Reykjavík' : ''}.`
        : `${top.name}${top.model ? ` (${top.model})` : ''}, vörunúmer ${top.sku}, er ekki á lager núna. Settu hana á efnislistann og sölumaður svarar með afhendingartíma.`
    } else {
      texti = `${lagerSpurt ? 'Þetta fann ég, með lagerstöðu:' : 'Þetta passar best í vörulistanum:'}`
    }
    return { texti, kort: hits.map((h) => ({ t: 'vara' as const, v: h.v })), til: p }
  }

  const s = SOLU()
  return {
    texti: 'Þessu get ég ekki svarað úr vörulistanum eða skilmálunum. Ég sendi spurninguna á sölumann, með orðunum þínum, svo þú þurfir ekki að útskýra aftur.',
    til: s,
  }
}

const TILLOGUR = ['Er UT9260M til á Akureyri?', 'Hvenær er næsta námskeið?', 'Hver sér um lýsingu?', 'Hvernig skila ég vöru?']

export function Assistant() {
  const { baeta } = useBrief()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Skilabod[]>([])
  const [txt, setTxt] = useState('')
  const [hugsar, setHugsar] = useState(false)
  const panel = useRef<HTMLDivElement | null>(null)
  const input = useRef<HTMLInputElement | null>(null)
  const log = useRef<HTMLDivElement | null>(null)
  const viaKeyboard = useRef(false)
  const goto = useGoto()
  const phone = window.matchMedia('(max-width:760px)').matches
  usePanelFocus(open, panel, viaKeyboard, () => setOpen(false), 'input', '', phone)

  const spyrja = (q: string) => {
    const t = q.trim()
    if (!t) return
    setMsgs((m) => [...m, { fra: 'notandi', texti: t }])
    setTxt('')
    setHugsar(true)
    window.setTimeout(() => {
      const s = svara(t)
      setMsgs((m) => [...m, { fra: 'adstod', ...s }])
      setHugsar(false)
    }, reduced() ? 0 : 520)
  }

  /* opened from the header, the sticky bar, the hero or the catalogue */
  useEffect(() => {
    const on = (e: Event) => {
      const detail = (e as CustomEvent<string | { q: string; keyboard: boolean }>).detail
      const q = typeof detail === 'string' ? detail : detail.q
      viaKeyboard.current = typeof detail === 'string' ? false : detail.keyboard
      setOpen(true)
      if (q) spyrja(q)
    }
    window.addEventListener('rfl-ask', on)
    return () => window.removeEventListener('rfl-ask', on)
  }, [])

  // The full-screen phone panel owns scrolling; keep the document at its
  // original position, including when Safari pans a focused field.
  useEffect(() => {
    if (!open || !phone) return
    const y = window.scrollY
    const body = document.body
    const prev = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow }
    Object.assign(body.style, { position: 'fixed', top: `-${y}px`, width: '100%', overflow: 'hidden' })
    return () => { Object.assign(body.style, prev); window.scrollTo({ top: y, behavior: 'instant' }) }
  }, [open, phone])
  /* With the on-screen keyboard up, iOS Safari shrinks the visual viewport and
     pans it down (measured on the simulator: 614 px tall, 100 px down), while a
     100svh panel stays 714 px tall from the top, so its title and close button
     left the screen while typing. On phones the panel follows the visual
     viewport instead. */
  useEffect(() => {
    const vv = window.visualViewport
    const el = panel.current
    if (!open || !phone || !vv || !el) return
    const sync = () => { el.style.top = `${vv.offsetTop}px`; el.style.height = `${vv.height}px` }
    sync()
    vv.addEventListener('resize', sync)
    vv.addEventListener('scroll', sync)
    return () => {
      vv.removeEventListener('resize', sync)
      vv.removeEventListener('scroll', sync)
      el.style.top = ''
      el.style.height = ''
    }
  }, [open, phone])
  useEffect(() => {
    const el = log.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced() ? 'auto' : 'smooth' })
  }, [msgs, hugsar])

  const fara = (hash: string) => {
    setOpen(false)
    requestAnimationFrame(() => goto(hash))
  }
  const sidastaSpurning = [...msgs].reverse().find((m) => m.fra === 'notandi')?.texti ?? ''

  const kort = (k: Kort, i: number): ReactNode => {
    if (k.t === 'vara') {
      return (
        <div key={`v${k.v.sku}${i}`} className="k vara">
          <img src={vorumynd(k.v.sku)} alt="" width={64} height={64} loading="lazy" />
          <div>
            <p className="mono sku">{k.v.sku}{k.v.model ? ` · ${k.v.model}` : ''}</p>
            <p className="nm">{k.v.name}</p>
            <Lager v={k.v} />
          </div>
          <button type="button" className="add" onClick={() => baeta(k.v.sku)} aria-label={`Setja ${k.v.name} á efnislistann`}>+</button>
        </div>
      )
    }
    if (k.t === 'folk') {
      return (
        <div key={`p${k.p.uid}${i}`} className="k folk">
          <img src={folkmynd(k.p.uid)} alt="" width={52} height={62} loading="lazy" />
          <div>
            <p className="nm">{k.p.name}</p>
            <p className="sub">{k.why ?? (k.p.role || k.p.title)}</p>
            <p className="sub"><a href={`tel:+354${k.p.tel.replace(/\s/g, '')}`}>{k.p.tel}</a> · <a href={`mailto:${k.p.email}`}>{k.p.email}</a></p>
          </div>
        </div>
      )
    }
    if (k.t === 'vidburdur') {
      return (
        <div key={`e${k.e.uid}`} className="k ev">
          <div>
            <p className="sub">{k.e.tag} · {k.e.loc === 'AK' ? 'Akureyri' : 'Reykjavík'}</p>
            <p className="nm">{k.e.title}</p>
            <p className="sub">{dags(k.e.start)}{k.e.seats ? ` · ${k.e.seats} sæti` : ''}</p>
          </div>
        </div>
      )
    }
    return <button key={`h${k.hash}${i}`} type="button" className="go" onClick={() => fara(k.hash)}>{k.label}</button>
  }

  return (
    <>
      <button
        type="button"
        className={`rfl-askfab${open ? ' hidden' : ''}`}
        onClick={(e) => { viaKeyboard.current = e.detail === 0; setOpen(true) }}
        aria-expanded={open}
        aria-controls="rfl-ask"
      >
        <span className="dot" aria-hidden="true" />Spyrja Reykjafell
      </button>
      <div className={`rfl-ask${open ? ' open' : ''}`} id="rfl-ask" aria-hidden={!open}>
        <div className="panel" role="dialog" aria-modal={phone || undefined} aria-label="Spyrja Reykjafell" tabIndex={-1} ref={panel}>
          <header>
            <div>
              <p className="ttl">Spyrja Reykjafell</p>
              <p className="sub">Svarar úr vörulista, lager, skilmálum og viðburðum</p>
            </div>
            <button type="button" className="x" onClick={() => setOpen(false)} aria-label="Loka aðstoð" tabIndex={open ? 0 : -1}>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
          </header>
          <div className="log" ref={log} aria-live="polite">
            {msgs.length === 0 ? (
              <div className="hello">
                <span className="orb" aria-hidden="true" />
                <p className="h">Hvernig get ég aðstoðað?</p>
                <div className="tillogur">
                  {TILLOGUR.map((t) => <button key={t} type="button" onClick={() => spyrja(t)} tabIndex={open ? 0 : -1}>{t}</button>)}
                </div>
              </div>
            ) : msgs.map((m, i) => (
              <div key={i} className={`m ${m.fra}`}>
                <p>{m.texti}</p>
                {m.kort?.length ? <div className="kort">{m.kort.map(kort)}</div> : null}
                {m.fra === 'adstod' && m.til ? (
                  <a className="handoff" href={`mailto:${m.til.email}?subject=${encodeURIComponent('Spurning af vef Reykjafells')}&body=${encodeURIComponent(`Sæl,\n\n${sidastaSpurning}\n\nKveðja`)}`}>
                    Senda spurninguna áfram: {m.til.name}
                  </a>
                ) : null}
              </div>
            ))}
            {hugsar ? <div className="m adstod typing" aria-label="Svarar"><i /><i /><i /></div> : null}
          </div>
          <form className="bar" onSubmit={(e) => { e.preventDefault(); spyrja(txt) }}>
            <input ref={input} type="text" value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Spurðu um vöru, lager, skil…" autoComplete="off" aria-label="Spurning" enterKeyHint="send" tabIndex={open ? 0 : -1} />
            <button type="submit" aria-label="Senda" disabled={!txt.trim()} tabIndex={open ? 0 : -1}>
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true"><path d="M11 1l5 5-5 5M16 6H0" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
          </form>
          <p className="legal">Frumgerð: svörin eru reiknuð í vafranum úr gögnum Reykjafells. Í lifandi útgáfu svarar Claude og vísar áfram á réttan mann.</p>
        </div>
      </div>
    </>
  )
}

export const ASSIST_CSS = `
.rfl-askfab{position:fixed;right:max(1.6vw,16px);bottom:max(1.6vw,16px);z-index:45;display:inline-flex;align-items:center;gap:.7em;
  font:inherit;font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#fff;background:${C.ink};
  border:0;border-radius:999px;padding:1em 1.4em 1em 1.1em;cursor:pointer;box-shadow:0 10px 30px -10px rgba(7,43,63,.55);
  transition:transform .3s cubic-bezier(.22,1,.36,1),opacity .3s,background .3s;touch-action:manipulation}
.rfl-askfab .dot{position:relative;width:10px;height:10px;border-radius:50%;background:${C.blue}}
/* a ring that scales out three times on arrival, then rests: transform and
   opacity only, and never an endless loop on an element that is always on screen */
.rfl-askfab .dot:after{content:'';position:absolute;inset:0;border-radius:50%;background:${C.blue};opacity:.55;animation:rfl-pulse 2.4s cubic-bezier(.23,1,.32,1) 1s 3 both}
.rfl-askfab.hidden{opacity:0;transform:translateY(12px);pointer-events:none}
@keyframes rfl-pulse{0%{transform:scale(1);opacity:.55}70%,100%{transform:scale(3);opacity:0}}
/* on a phone the sticky bar carries the assistant, so the round button steps aside */
@media (max-width:760px){.rfl-askfab{display:none}}

.rfl-ask{position:fixed;inset:0;z-index:58;pointer-events:none;visibility:hidden}
.rfl-ask.open{pointer-events:none;visibility:visible}
.rfl-ask .panel{pointer-events:auto;position:absolute;right:max(1.6vw,16px);bottom:max(1.6vw,16px);width:min(420px,calc(100vw - 32px));height:min(640px,calc(100svh - 32px));
  background:#fff;color:${C.ink};border-radius:14px;display:flex;flex-direction:column;overflow:hidden;outline:none;
  box-shadow:0 30px 80px -20px rgba(7,43,63,.45),0 0 0 1px rgba(17,21,24,.06);
  opacity:0;transform:translateY(12px) scale(.97);transform-origin:bottom right;transition:opacity .2s ease-out,transform .3s cubic-bezier(.23,1,.32,1)}
.rfl-ask.open .panel{opacity:1;transform:none}
@media (max-width:760px){.rfl-ask .panel{inset:0;width:auto;height:100svh;border-radius:0;right:0;bottom:0;transform:translateY(24px)}}
/* the panel follows the visual viewport while the keyboard is up; the strip it
   leaves above the keyboard must not show the page (its sticky bar) behind */
@media (max-width:760px){.rfl-ask.open{background:#fff}}
.rfl-ask header{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:1rem 1.1rem;border-bottom:1px solid ${C.hairline};
  padding-top:max(1rem,env(safe-area-inset-top))}
.rfl-ask .ttl{font-weight:600;font-size:var(--t-lead)}
.rfl-ask .sub{font-size:var(--t-tag);opacity:.65;line-height:1.4}
.rfl-ask .x{width:44px;height:44px;display:grid;place-items:center;border:0;border-radius:10px;background:${C.paper};cursor:pointer;color:${C.ink};flex:none}
.rfl-ask .log{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:1.1rem;display:flex;flex-direction:column;gap:.8rem}
.rfl-ask .hello{margin:auto 0;display:grid;justify-items:center;text-align:center;gap:1rem;padding:1rem 0}
.rfl-ask .orb{width:56px;height:56px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#7fd3f5,${C.blue} 55%,${C.blueDeep});
  box-shadow:0 10px 30px -8px rgba(0,147,208,.6)}
.rfl-ask .hello .h{font-size:var(--t-small);font-weight:500;letter-spacing:-.02em}
.rfl-ask .tillogur{display:flex;flex-wrap:wrap;gap:.45rem;justify-content:center}
.rfl-ask .tillogur button{font:inherit;font-size:var(--t-tag);color:${C.ink};background:${C.paper};border:1px solid transparent;border-radius:999px;padding:.6em .95em;cursor:pointer;min-height:44px;touch-action:manipulation}
.rfl-ask .m{max-width:88%;display:grid;gap:.6rem}
.rfl-ask .m p{line-height:1.5;font-size:var(--t-body)}
.rfl-ask .m.notandi{align-self:flex-end;background:${C.ink};color:#fff;border-radius:14px 14px 4px 14px;padding:.65em .95em}
.rfl-ask .m.adstod{align-self:flex-start}
.rfl-ask .m.adstod>p{background:${C.paper};border-radius:14px 14px 14px 4px;padding:.7em .95em}
.rfl-ask .typing{flex-direction:row;display:flex;gap:4px;background:${C.paper};border-radius:14px;padding:.9em 1em}
.rfl-ask .typing i{width:6px;height:6px;border-radius:50%;background:${C.ink};opacity:.4;animation:rfl-typing 1s infinite}
.rfl-ask .typing i:nth-child(2){animation-delay:.15s}.rfl-ask .typing i:nth-child(3){animation-delay:.3s}
@keyframes rfl-typing{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:.8;transform:translateY(-3px)}}
.rfl-ask .kort{display:grid;gap:.45rem}
.rfl-ask .k{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:.75rem;align-items:center;border:1px solid ${C.hairline};border-radius:12px;padding:.6rem}
.rfl-ask .k.ev{grid-template-columns:1fr;border-left:3px solid ${C.blue}}
.rfl-ask .k img{width:56px;height:56px;object-fit:contain;mix-blend-mode:multiply;background:${C.paper};border-radius:8px;padding:4px}
.rfl-ask .k.folk img{width:52px;height:62px;object-fit:cover;padding:0;mix-blend-mode:normal}
.rfl-ask .k .nm{font-weight:600;font-size:var(--t-tag);line-height:1.35;overflow-wrap:anywhere}
.rfl-ask .k .sku{font-size:11px;opacity:.6}
.rfl-ask .k a{text-decoration:underline;text-underline-offset:.15em}
@media (max-width:760px){.rfl-ask .k a{display:inline-flex;align-items:center;min-height:44px}}
.rfl-ask .k .add{width:44px;height:44px;border-radius:10px;border:1px solid ${C.hairline};background:#fff;font-size:20px;cursor:pointer;color:${C.ink}}
.rfl-ask .go{justify-self:start;font:inherit;font-size:var(--t-tag);font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:${C.blueInk};background:none;border:0;
  text-decoration:underline;text-underline-offset:.3em;cursor:pointer;padding:.5em 0;min-height:44px}
.rfl-ask .handoff{justify-self:start;font-size:var(--t-tag);font-weight:600;color:${C.blueInk};text-decoration:underline;text-underline-offset:.3em;padding:.3em 0;min-height:44px;display:inline-flex;align-items:center}
.rfl-ask .bar{display:flex;gap:.5rem;padding:.8rem;border-top:1px solid ${C.hairline}}
.rfl-ask .bar input{flex:1;min-width:0;font:inherit;font-size:max(16px,var(--t-body));border:1px solid rgba(17,21,24,.22);border-radius:12px;padding:.7em .9em;background:${C.paper};color:${C.ink}}
.rfl-ask .bar input:focus-visible{outline:2px solid ${C.blue};outline-offset:1px}
.rfl-ask .bar button{width:48px;border:0;border-radius:12px;background:${C.blue};color:#fff;cursor:pointer;display:grid;place-items:center}
.rfl-ask .bar button:disabled{opacity:.35;cursor:default}
.rfl-ask .legal{font-size:11px;line-height:1.45;opacity:.6;padding:0 1rem .9rem;padding-bottom:max(.9rem,env(safe-area-inset-bottom))}
@media (hover:hover) and (pointer:fine){
  .rfl-askfab:hover{background:${C.blueDeep};transform:translateY(-2px)}
  .rfl-ask .tillogur button:hover{border-color:${C.blue};background:#fff}
  .rfl-ask .k .add:hover{background:${C.blue};color:#fff;border-color:${C.blue}}
}
@media (prefers-reduced-motion:reduce){.rfl-askfab .dot:after,.rfl-ask .typing i{animation:none;opacity:0}.rfl-ask .typing i{opacity:.5}.rfl-ask .panel{transition:opacity .15s}}
`

