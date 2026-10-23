import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CHAPTERS, DOORS, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, DEMO_CODES, MANUAL, MANUAL_LOCALITY, type ManualAuto } from './data'
import { HouseMap, MAP_STYLES } from './Map'
import { setNoindex, setThemeColor } from '../../lib/preview'

/* ── THE HOUSE MANUAL (Signý's meeting, 23 Oct 2026) ────────────────────────
   A guest opens their house's manual with the code from their booking
   confirmation. PROTOTYPE: the three demo codes live in this file and the
   check is client-side. On the live site SNDR Bókun issues one code per
   booking, checks it on the server, and the code stops working after
   check-out. Content rule: only facts the site already states (data.ts);
   every section we cannot know is a marked placeholder for Signý, never an
   invented house rule. Not in the nav, noindex, linked from the footer and
   from the booking confirmation. ──────────────────────────────────────── */

const ROOT = '/preview/icelandluxurylodges'
const KEY = 'ill_manual'
type Section = { id: string; title: string; facts: string[]; text: string[]; todo?: string }

/* Builds a house's manual from MANUAL in data.ts: the site's own facts first,
   then Signý's lines (for every house, then for this one). The placeholder only
   shows while a section has no text of hers. */
function sectionsFor(id: string): Section[] {
  const c = CHAPTERS.find((x) => x.id === id)
  const d = DOORS.find((x) => x.id === id)
  if (!c || !d) return []
  const has = (re: RegExp) => c.amenities.filter((a) => re.test(a))
  const auto = (k?: ManualAuto): string[] => {
    switch (k) {
      case 'directions': return [MANUAL_LOCALITY[id], ...has(/minutes from/i)].filter(Boolean)
      case 'house': return [d.kind, ...c.facts.map((f) => `${f.n} ${f.l}`)]
      case 'amenities': return c.amenities.filter((a) => !/minutes from/i.test(a))
      case 'water': return has(/hot tub|sauna|spa/i)
      case 'fireplaces': return has(/fireplace/i)
      case 'contact': return ['Emergency in Iceland (police, ambulance, fire): 112', `The host: ${PHONE_DISPLAY}`, `Email: ${EMAIL}`]
      default: return []
    }
  }
  return MANUAL.filter((m) => !m.only || m.only.includes(id)).map((m) => {
    const text = [...(m.text?.all ?? []), ...(m.text?.[id] ?? [])].filter((t) => t.trim())
    return { id: m.id, title: m.title, facts: auto(m.auto), text, todo: text.length ? undefined : m.todo }
  })
}

const norm = (v: string) => v.toUpperCase().replace(/[^A-Z0-9]/g, '')

export default function Guests() {
  const [house, setHouse] = useState<string | null>(() => {
    try { const v = sessionStorage.getItem(KEY); return v && DEMO_CODES[v] ? v : null } catch { return null }
  })
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    document.title = 'House manual · Iceland Luxury Lodges'
    setThemeColor('#EFF3F5')
    return setNoindex(true)
  }, [])

  const open = (e: React.FormEvent) => {
    e.preventDefault()
    const v = norm(code)
    const hit = v ? Object.entries(DEMO_CODES).find(([, c]) => norm(c) === v) : undefined
    if (!hit) { setErr('That code does not match a stay. It is in your booking confirmation email.'); return }
    setErr(''); setHouse(hit[0])
    try { sessionStorage.setItem(KEY, hit[0]) } catch { /* private mode */ }
    window.scrollTo(0, 0)
  }
  const close = () => { setHouse(null); setCode(''); try { sessionStorage.removeItem(KEY) } catch { /* private mode */ } }

  const c = house ? CHAPTERS.find((x) => x.id === house)! : null
  const secs = house ? sectionsFor(house) : []

  return (
    <div className="ill-root ill-g">
      <style dangerouslySetInnerHTML={{ __html: G_STYLES + MAP_STYLES }} />
      <header className="ill-g-top">
        <Link className="ill-g-mark" to={ROOT}>Iceland Luxury Lodges</Link>
        {house && <div className="ill-g-actions">
          <button type="button" onClick={() => window.print()}>Print</button>
          <button type="button" onClick={close}>Close manual</button>
        </div>}
      </header>

      {!house || !c ? (
        <main className="ill-g-gate">
          <p className="ill-g-eye">For guests</p>
          <h1>Your house manual</h1>
          <p className="ill-g-lede">Enter the code from your booking confirmation email. It opens the manual for your house, and it stops working after check-out.</p>
          <form onSubmit={open} className="ill-g-form" noValidate>
            <label htmlFor="ill-g-code">Booking code</label>
            <div>
              <input id="ill-g-code" name="code" value={code} onChange={(e) => setCode(e.target.value)}
                autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="ABCD-2026…"
                aria-invalid={!!err} aria-describedby={err ? 'ill-g-err' : undefined} />
              <button type="submit" className="ill-g-go">Open <i aria-hidden="true">→</i></button>
            </div>
            {err && <p id="ill-g-err" className="ill-g-err" role="alert">{err}</p>}
          </form>
          <aside className="ill-g-demo" aria-label="Prototype note">
            <p><b>Prototype:</b> demo codes {Object.entries(DEMO_CODES).map(([h, k], i) => <span key={h}>{i ? ', ' : ''}<code>{k}</code> ({DOORS.find((d) => d.id === h)!.name})</span>)}. On the live site SNDR Bókun issues one code per booking, checks it on the server, and the code expires after check-out.</p>
          </aside>
        </main>
      ) : (
        <main className="ill-g-man">
          <header className="ill-g-head">
            <p className="ill-g-eye">House manual</p>
            <h1>{c.name}</h1>
            <p className="ill-g-water">{c.water}</p>
          </header>
          <nav className="ill-g-index" aria-label="In this manual">
            <ol>{secs.map((s, i) => <li key={s.id}><a href={`#${s.id}`}><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</a></li>)}</ol>
          </nav>
          {secs.map((s, i) => (
            <section key={s.id} id={s.id} className="ill-g-sec" aria-labelledby={`h-${s.id}`}>
              <span className="ill-g-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 id={`h-${s.id}`}>{s.title}</h2>
                {s.facts && s.facts.length > 0 && <ul className="ill-g-facts">{s.facts.map((f) => <li key={f}>{f}</li>)}</ul>}
                {s.text.map((t, k) => <p className="ill-g-text" key={k}>{t}</p>)}
                {s.id === 'directions' && <div className="ill-g-map"><HouseMap id={house} /></div>}
                {s.todo && <p className="ill-g-todo"><b>Signý fills in:</b> {s.todo}</p>}
              </div>
            </section>
          ))}
          <footer className="ill-g-foot">
            <p>Questions during your stay: <a href={PHONE_HREF}>{PHONE_DISPLAY}</a> · <a href={EMAIL_HREF}>{EMAIL}</a></p>
            <p className="ill-g-small">Prototype. Facts above are from the site; every “Signý fills in” is hers to write in the manual editor.</p>
          </footer>
        </main>
      )}
    </div>
  )
}

const B = import.meta.env.BASE_URL
const G_STYLES = `
@font-face{font-family:'SentientIll';src:url('${B}fonts/sentient/Sentient-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'SentientIll';src:url('${B}fonts/sentient/Sentient-LightItalic.woff2') format('woff2');font-weight:300;font-style:italic;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('${B}fonts/switzer/Switzer-Light.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'SwitzerIll';src:url('${B}fonts/switzer/Switzer-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
.ill-g{--ice:#EFF3F5;--ink:#0E161D;--dusk:#41607A;--bg:var(--ice);--fg:var(--ink);--acc:var(--dusk);
  --ink-soft:color-mix(in srgb,var(--fg) 78%,transparent);--ink-mute:color-mix(in srgb,var(--fg) 62%,transparent);
  --hair:color-mix(in srgb,var(--fg) 15%,transparent);--serif:'SentientIll','Cormorant Garamond',Georgia,serif;
  --sans:'SwitzerIll','Helvetica Neue',Arial,sans-serif;--e:cubic-bezier(.22,.9,.28,1);
  min-height:100svh;background:var(--bg);color:var(--fg);font-family:var(--sans);font-weight:300;line-height:1.6}
.ill-g *{box-sizing:border-box;margin:0}
.ill-g a{color:inherit}
.ill-g :focus-visible{outline:2px solid var(--acc);outline-offset:3px}
.ill-g button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;-webkit-appearance:none;appearance:none}
.ill-g-top{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:22px clamp(20px,5vw,56px);border-bottom:1px solid var(--hair)}
.ill-g-mark{font-family:var(--serif);font-size:1.15rem;text-decoration:none;white-space:nowrap}
.ill-g-actions{display:flex;gap:18px;font-size:.84rem;white-space:nowrap}
.ill-g-actions button{border-bottom:1px solid var(--hair);padding:4px 0}
.ill-g-actions button:hover{border-color:var(--fg)}
.ill-g-eye{font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:var(--acc);font-weight:500}
.ill-g h1{font-family:var(--serif);font-weight:300;font-size:clamp(2.4rem,6vw,4.4rem);line-height:1.04;letter-spacing:-.01em}
.ill-g-gate{max-width:640px;margin:0 auto;padding:clamp(64px,14vh,140px) clamp(20px,5vw,40px);display:grid;gap:22px}
.ill-g-lede{color:var(--ink-soft);font-size:1.05rem;max-width:46ch}
.ill-g-form{display:grid;gap:10px;margin-top:10px}
.ill-g-form label{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-mute);font-weight:500}
.ill-g-form > div{display:flex;border-bottom:1px solid var(--fg)}
.ill-g-form input{flex:1;min-width:0;font:inherit;font-family:var(--serif);font-size:1.6rem;letter-spacing:.08em;color:var(--fg);background:transparent;border:0;padding:8px 0;text-transform:uppercase;border-radius:0}
.ill-g-form input::placeholder{color:var(--ink-mute);opacity:.6}
.ill-g-form input:focus{outline:none}
.ill-g-form > div:focus-within{border-color:var(--acc);box-shadow:0 1px 0 var(--acc)}
.ill-g-go{display:inline-flex;align-items:center;gap:.5em;font-size:.74rem !important;letter-spacing:.2em;text-transform:uppercase;font-weight:500;padding:0 4px 0 16px;min-height:48px}
.ill-g-go i{font-style:normal;transition:transform .3s var(--e)}
@media (hover:hover) and (pointer:fine){.ill-g-go:hover i{transform:translateX(4px)}}
.ill-g-err{color:#8A2B1F;font-size:.9rem}
.ill-g-demo{margin-top:26px;padding:14px 16px;font-size:.84rem;color:var(--ink-soft);background:color-mix(in srgb,var(--fg) 4%,var(--bg));box-shadow:inset 0 0 0 1px var(--hair)}
.ill-g-demo code{font-family:var(--sans);font-weight:500;letter-spacing:.1em;color:var(--fg)}
.ill-g-man{max-width:880px;margin:0 auto;padding:clamp(48px,9vh,96px) clamp(20px,5vw,40px) 80px}
.ill-g-head{display:grid;gap:10px;padding-bottom:clamp(28px,5vh,48px)}
.ill-g-water{font-family:var(--serif);font-style:italic;color:var(--ink-mute);font-size:1.2rem}
.ill-g-index{border-top:1px solid var(--hair);border-bottom:1px solid var(--hair);padding:18px 0;margin-bottom:clamp(32px,6vh,56px)}
.ill-g-index ol{list-style:none;padding:0;columns:2;column-gap:40px}
.ill-g-index li{break-inside:avoid}
.ill-g-index a{display:flex;gap:14px;padding:6px 0;text-decoration:none;font-size:.95rem}
.ill-g-index a span{color:var(--acc);font-variant-numeric:tabular-nums;font-size:.8rem;padding-top:.15em}
.ill-g-index a:hover{color:var(--acc)}
.ill-g-sec{display:grid;grid-template-columns:56px minmax(0,1fr);gap:8px;padding:28px 0;border-bottom:1px solid var(--hair);scroll-margin-top:24px}
.ill-g-num{font-family:var(--serif);color:var(--acc);font-size:1.2rem;line-height:1.4}
.ill-g-sec h2{font-family:var(--serif);font-weight:300;font-size:clamp(1.5rem,2.6vw,2rem);line-height:1.15;margin-bottom:12px}
.ill-g-facts{list-style:none;padding:0;display:grid;gap:6px;margin-bottom:12px}
.ill-g-facts li{padding-left:18px;position:relative}
.ill-g-facts li::before{content:'';position:absolute;left:0;top:.8em;width:8px;height:1px;background:var(--fg)}
.ill-g-text{margin-bottom:10px;max-width:60ch}
.ill-g-todo{font-size:.92rem;color:var(--ink-soft);padding:10px 14px;border-left:2px solid var(--acc);background:color-mix(in srgb,var(--acc) 7%,var(--bg))}
.ill-g-todo b{font-weight:500;color:var(--acc)}
.ill-g-map{margin:6px 0 14px}
.ill-g-map .ill-hp-map{grid-template-columns:minmax(0,1fr);margin:0}
.ill-g-map .ill-hp-map-copy{display:none}
.ill-g-foot{padding-top:32px;display:grid;gap:8px;font-size:.92rem}
.ill-g-small{font-size:.8rem;color:var(--ink-mute)}
@media (max-width:640px){
  .ill-g-index ol{columns:1}
  .ill-g-top{padding:18px 20px}
  .ill-g-mark{font-size:1rem}
  .ill-g-actions{gap:14px;font-size:.8rem}
  .ill-g-sec{grid-template-columns:40px minmax(0,1fr)}
  .ill-g-form input{font-size:1.3rem}
}
@media print{
  .ill-g-top .ill-g-actions,.ill-g-index,.ill-g-map{display:none}
  .ill-g{background:#fff;min-height:0}
  .ill-g-man{padding:0;max-width:none}
  .ill-g-sec{break-inside:avoid;padding:14px 0}
  .ill-g-todo{background:none}
}
`
