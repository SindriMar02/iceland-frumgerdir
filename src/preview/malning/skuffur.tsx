import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Check, Copy, ExternalLink, Minus, Phone, Plus, X } from 'lucide-react'
import { FYRIRTAEKI, SOLUSTADIR } from './data'
import { stada, useStada } from './state'
import { faraA, lenisOf, vaMynd } from './ui'
import { FLOKKAR, VORUR } from './vorur'
import { fmtNotkun } from './verk'
import { litaKodi } from './blandari'

/* Two dialogs: the job sheet ("verkblað") and the product sheet. Neither sends
   anything: "Senda" opens the visitor's own mail app with the text filled in. */

export const SKUFFA_CSS = `
.mal-tjald{position:fixed;inset:0;z-index:90;background:rgba(34,34,33,.5);opacity:0;pointer-events:none;transition:opacity .25s var(--ease)}
.mal-tjald.opid{opacity:1;pointer-events:auto}
.mal-skuffa{position:fixed;z-index:91;top:12px;right:12px;bottom:12px;width:min(520px,calc(100vw - 24px));background:#fff;color:var(--ink);border-radius:var(--r);
  transform:translateX(calc(100% + 24px));transition:transform .32s var(--skuff),visibility 0s .32s;visibility:hidden;display:flex;flex-direction:column;overflow:hidden;
  box-shadow:0 30px 90px -20px rgba(34,34,33,.5)}
.mal-skuffa.opid{transform:none;visibility:visible;transition:transform .5s var(--skuff)}
.mal-skuffaH{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:20px 20px 12px 26px}
.mal-skuffaH h2{font-family:var(--disp);font-weight:400;font-size:2.2rem;line-height:1;letter-spacing:-.01em;margin:0}
.mal-skuffaB{flex:1;overflow-x:hidden;overflow-y:auto;min-height:0;padding:4px 26px 24px;display:flex;flex-direction:column;gap:22px;overscroll-behavior:contain}
.mal-skuffaF{padding:16px 26px 22px;border-top:1px solid var(--lina);display:flex;flex-direction:column;gap:12px;background:#fff}
.mal-blokk{display:flex;flex-direction:column;gap:10px}
.mal-blokk>h3{margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);font-weight:600}
.mal-lita{display:grid;grid-template-columns:64px 1fr auto;gap:14px;align-items:center;padding:10px;border-radius:16px;background:var(--kort)}
.mal-lita .sv{width:64px;height:64px;border-radius:12px;box-shadow:inset 0 0 0 1px rgba(34,34,33,.14)}
.mal-lita b{display:block;font-weight:600;line-height:1.25}
.mal-lita small{display:block;color:var(--mute);font-size:13px}
.mal-lita code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;letter-spacing:.05em;font-weight:600}
.mal-vlina{display:grid;grid-template-columns:64px 1fr;gap:14px;padding:10px;border-radius:16px;background:var(--kort);align-items:center}
.mal-vlina img{width:64px;height:64px;object-fit:contain;mix-blend-mode:multiply}
.mal-vlina .h{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:6px}
.mal-vlina .h .mal-hring{width:44px;height:44px}
.mal-vlina .h span{min-width:4ch;text-align:center;font-weight:600;font-variant-numeric:tabular-nums}
.mal-vlina .fj{margin-left:auto;font-size:13px;color:var(--mute);text-decoration:underline;text-underline-offset:3px;min-height:44px;padding:0 8px}
.mal-reitur{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:var(--mute)}
.mal-reitur input,.mal-reitur textarea,.mal-reitur select{font:inherit;font-size:16px;font-weight:500;color:var(--ink);background:var(--kort);border:0;border-radius:14px;padding:14px;min-height:52px;width:100%}
.mal-reitur textarea{min-height:88px;resize:vertical}
.mal-reitur input:focus,.mal-reitur textarea:focus,.mal-reitur select:focus{outline:2px solid var(--ink);outline-offset:2px}
.mal-tveir{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mal-vidtak{display:flex;flex-direction:column;gap:8px}
.mal-vidtak label{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border-radius:14px;background:var(--kort);cursor:pointer;font-weight:600}
.mal-vidtak label span{display:block;font-weight:400;font-size:13px;color:var(--mute)}
.mal-vidtak input{margin-top:4px;accent-color:var(--ink);width:20px;height:20px;flex:none}
.mal-tomt{background:var(--kort);border-radius:16px;padding:22px;display:flex;flex-direction:column;gap:14px;align-items:flex-start}
.mal-tomt p{margin:0;color:var(--mute)}
.mal-skuffaF .mal-knappur{width:100%;justify-content:space-between}
.mal-skuffaFr{flex-direction:row;align-items:flex-end;gap:10px}
.mal-skuffaFr .mal-knappur{flex:1;width:auto}
.mal-litrarR{width:96px;flex:none}
.mal-litrarR input{padding:0 12px;text-align:center;font-weight:600}
.mal-spjald .mal-skuffaB .mal-knappur{width:100%;justify-content:space-between}
.mal-fjolskylda{font-size:12.5px;color:var(--mute);margin:0}
/* product sheet */
.mal-spjald .mal-skuffaB{gap:18px}
.mal-skuffaB>*{min-width:0}
.mal-spjaldM{background:var(--kort);border-radius:var(--rs);display:grid;place-items:center;padding:20px;aspect-ratio:4/3;width:100%;min-width:0;overflow:hidden}
.mal-spjaldM img{max-height:100%;width:auto;height:auto;max-width:82%;min-width:0;object-fit:contain;mix-blend-mode:multiply}
.mal-spjald h2{font-size:2.4rem}
.mal-svans{display:inline-flex;align-items:center;height:30px;padding:0 12px;border-radius:999px;background:var(--tint);color:var(--tint-ink);font-size:13px;font-weight:600;margin-bottom:4px;transition:background .7s var(--ease),color .7s var(--ease)}
.mal-spjald p{margin:0}
.mal-tafla{display:grid;grid-template-columns:auto 1fr;gap:8px 18px;margin:0;font-size:15px}
.mal-tafla dt{color:var(--mute);font-weight:500}
.mal-tafla dd{margin:0;font-weight:500;overflow-wrap:anywhere}
.mal-tenglar{display:flex;flex-wrap:wrap;gap:8px}
.mal-tengill{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 16px;border-radius:999px;background:var(--kort);font-size:14px;font-weight:600;text-decoration:none}
@media (max-width:640px){
  .mal-skuffa{top:64px;right:8px;left:8px;bottom:8px;width:auto;height:auto;transform:translateY(calc(100% + 80px))}
  .mal-skuffaH{padding:16px 14px 8px 20px}.mal-skuffaB{padding:4px 20px 20px}.mal-skuffaF{padding:14px 20px 18px}
  .mal-tveir{grid-template-columns:1fr}
  .mal-spjaldM{aspect-ratio:16/10;padding:12px}
}
`

function useDialog(opid: boolean, lokaFall: () => void) {
  const ref = useRef<HTMLDivElement | null>(null)
  const fyrri = useRef<HTMLElement | null>(null)
  /* the close callback is recreated on every render; keeping it in a ref stops the
     open/focus effect from re-running (and stealing focus) on every keystroke */
  const loka = useRef(lokaFall)
  loka.current = lokaFall
  useEffect(() => {
    if (!opid) return
    fyrri.current = document.activeElement as HTMLElement | null
    lenisOf()?.stop()
    document.documentElement.style.overflow = 'hidden'
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>('[data-fyrst]')?.focus(), 80)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); loka.current() }
      if (e.key === 'Tab' && ref.current) {
        const f = [...ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter((x) => x.offsetParent !== null)
        if (!f.length) return
        const a = f[0], b = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus() }
        else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t); document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''; lenisOf()?.start(); fyrri.current?.focus?.()
    }
  }, [opid])
  return ref
}

/* ------------------------------------------------------------------ */
export function Verkblad() {
  const st = useStada()
  const loka = () => stada.opna(false)
  const ref = useDialog(st.opid, loka)
  const [nafn, setNafn] = useState('')
  const [simi, setSimi] = useState('')
  const [netfang, setNetfang] = useState('')
  const [athugasemd, setAthugasemd] = useState('')
  const [sendist, setSendist] = useState<'malning' | 'solustadur'>('malning')
  const [stadur, setStadur] = useState('Bauhaus')
  const [afritad, setAfritad] = useState(false)

  const lit = st.litur
  const linur = st.verk.map((l) => ({ l, v: VORUR.find((v) => v.id === l.id) })).filter((x) => x.v)
  const tomt = !lit && linur.length === 0
  const dealer = useMemo(() => SOLUSTADIR.flatMap((h) => h.nofn).find((x) => x.n === stadur), [stadur])
  const kodi = lit?.kodi ?? (lit && lit.uppruni === 'litakort' ? '' : '')

  const texti = () => {
    const t: string[] = ['Verkblað af malning.is (frumgerð)', '']
    if (lit) {
      t.push(`Litur: ${lit.nafn}`)
      if (lit.uppruni === 'blandad' && lit.nalaegur) t.push(`Nálægasti litur í Kópal litakortinu: ${lit.nalaegur.nafn.charAt(0) + lit.nalaegur.nafn.slice(1).toLocaleLowerCase('is')}`)
      const k = lit.kodi ?? (lit.dropar ? litaKodi(lit.dropar, linur[0]?.v?.id ?? 'kopal-10', linur[0]?.l.litrar ?? 4) : '')
      if (k) t.push(`Litakóði: ${k}`)
      t.push('')
    }
    if (linur.length) {
      t.push('Vörur:')
      linur.forEach(({ l, v }) => t.push(`- ${v?.nafn}, ${l.litrar} l${l.flatarmal ? ` (${l.flatarmal} m², ${l.umferdir} ${l.umferdir === 1 ? 'umferð' : 'umferðir'})` : ''}`))
      t.push('')
    }
    if (nafn) t.push(`Nafn: ${nafn}`)
    if (simi) t.push(`Sími: ${simi}`)
    if (netfang) t.push(`Netfang: ${netfang}`)
    if (athugasemd) t.push(`Athugasemd: ${athugasemd}`)
    t.push('', 'Litur á skjá er aldrei alveg eins og á vegg. Fersk litaprufa gefur raunverulegustu myndina af litnum.')
    return t.join('\n')
  }

  const mailto = `mailto:${FYRIRTAEKI.netfang}?subject=${encodeURIComponent('Verkblað: litur og vörur')}&body=${encodeURIComponent(texti())}`
  const afrita = async () => {
    try { await navigator.clipboard.writeText(texti()); setAfritad(true); window.setTimeout(() => setAfritad(false), 1800) } catch { /* clipboard blocked */ }
  }

  return (
    <>
      <div className={`mal-tjald${st.opid ? ' opid' : ''}`} onClick={loka} aria-hidden="true" />
      <div ref={ref} className={`mal-skuffa${st.opid ? ' opid' : ''}`} role="dialog" aria-modal="true" aria-labelledby="mal-vb-t" aria-hidden={!st.opid}
        {...(!st.opid ? { inert: '' as unknown as boolean } : {})} data-lenis-prevent>
        <div className="mal-skuffaH">
          <h2 id="mal-vb-t">Verkblað</h2>
          <button className="mal-hring ljos" data-fyrst aria-label="Loka verkblaði" onClick={loka}><X size={20} strokeWidth={1.75} /></button>
        </div>
        <div className="mal-skuffaB">
          {tomt && (
            <div className="mal-tomt">
              <p>Verkblaðið er tómt. Blandaðu lit, veldu þér vöru eða reiknaðu magnið, og hlutirnir birtast hér, tilbúnir til að senda.</p>
              <button className="mal-knappur dokkur" onClick={() => { loka(); faraA('#blandari') }}>Blanda lit<i><ArrowRight size={18} /></i></button>
            </div>
          )}
          {lit && (
            <section className="mal-blokk" aria-label="Litur">
              <h3>Litur</h3>
              <div className="mal-lita">
                <span className="sv" style={{ background: lit.hex }} aria-hidden="true" />
                <div>
                  <b>{lit.nafn}</b>
                  {lit.uppruni === 'blandad' && lit.nalaegur && <small>Næst {lit.nalaegur.nafn.charAt(0) + lit.nalaegur.nafn.slice(1).toLocaleLowerCase('is')} í Kópal litakortinu</small>}
                  {lit.uppruni === 'litakort' && <small>Úr Kópal litakortinu</small>}
                  {kodi && <code>{kodi}</code>}
                </div>
                <button className="mal-hring ljos" aria-label="Fjarlægja lit" onClick={() => stada.setLitur(null)}><X size={18} strokeWidth={1.75} /></button>
              </div>
            </section>
          )}
          {linur.length > 0 && (
            <section className="mal-blokk" aria-label="Vörur">
              <h3>Vörur</h3>
              {linur.map(({ l, v }) => (
                <div className="mal-vlina" key={l.id}>
                  <img src={vaMynd(v!.mynd, 480)} alt="" width={64} height={64} />
                  <div>
                    <b>{v!.nafn}</b>
                    {l.flatarmal && <small style={{ display: 'block', color: 'var(--mute)', fontSize: 13 }}>{l.flatarmal} m², {l.umferdir} {l.umferdir === 1 ? 'umferð' : 'umferðir'}</small>}
                    <div className="h">
                      <button className="mal-hring ljos" aria-label={`Færri lítrar af ${v!.nafn}`} onClick={() => stada.breytaLitrum(l.id, l.litrar - 1)}><Minus size={16} strokeWidth={2} /></button>
                      <span>{l.litrar} l</span>
                      <button className="mal-hring" aria-label={`Fleiri lítrar af ${v!.nafn}`} onClick={() => stada.breytaLitrum(l.id, l.litrar + 1)}><Plus size={16} strokeWidth={2} /></button>
                      <button className="fj" onClick={() => stada.fjarlaega(l.id)}>Fjarlægja</button>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {!tomt && (
            <>
              <section className="mal-blokk" aria-label="Senda til">
                <h3>Senda til</h3>
                <div className="mal-vidtak" role="radiogroup" aria-label="Móttakandi">
                  <label><input type="radio" name="sendist" checked={sendist === 'malning'} onChange={() => setSendist('malning')} />
                    <div>Söludeild Málningar<span>{FYRIRTAEKI.netfang}, {FYRIRTAEKI.simi}</span></div></label>
                  <label><input type="radio" name="sendist" checked={sendist === 'solustadur'} onChange={() => setSendist('solustadur')} />
                    <div>Söluaðili sem ég vel<span>Ég sýni kóðann og textann í verslun</span></div></label>
                </div>
                {sendist === 'solustadur' && (
                  <label className="mal-reitur">Söluaðili
                    <select value={stadur} onChange={(e) => setStadur(e.target.value)}>
                      {SOLUSTADIR.map((h) => (<optgroup key={h.hopur} label={h.hopur}>{h.nofn.map((x) => (<option key={x.n + x.s} value={x.n}>{x.n}, {x.s}</option>))}</optgroup>))}
                    </select>
                  </label>
                )}
                {sendist === 'solustadur' && dealer && (
                  <a className="mal-tengill" href={`tel:+354${dealer.simi.replace(/\D/g, '')}`}><Phone size={16} strokeWidth={1.75} />{dealer.simi}</a>
                )}
              </section>
              <section className="mal-blokk" aria-label="Upplýsingar">
                <h3>Upplýsingar</h3>
                <div className="mal-tveir">
                  <label className="mal-reitur">Nafn<input name="nafn" value={nafn} onChange={(e) => setNafn(e.target.value)} autoComplete="name" /></label>
                  <label className="mal-reitur">Sími<input name="simi" value={simi} onChange={(e) => setSimi(e.target.value)} inputMode="tel" autoComplete="tel" spellCheck={false} /></label>
                </div>
                <label className="mal-reitur">Netfang<input name="netfang" type="email" spellCheck={false} value={netfang} onChange={(e) => setNetfang(e.target.value)} autoComplete="email" /></label>
                <label className="mal-reitur">Athugasemd<textarea value={athugasemd} onChange={(e) => setAthugasemd(e.target.value)} /></label>
              </section>
            </>
          )}
        </div>
        {!tomt && (
          <div className="mal-skuffaF">
            {sendist === 'malning'
              ? <a className="mal-knappur dokkur" href={mailto}>Senda á Málningu<i><ArrowRight size={18} /></i></a>
              : <button className="mal-knappur dokkur" onClick={afrita}>{afritad ? 'Afritað' : 'Afrita texta fyrir söluaðila'}<i>{afritad ? <Check size={18} /> : <Copy size={17} />}</i></button>}
            {sendist === 'malning' && <button className="mal-knappur hljodur" onClick={afrita}>{afritad ? 'Afritað' : 'Afrita texta'}<i>{afritad ? <Check size={18} /> : <Copy size={17} />}</i></button>}
            <p className="mal-fjolskylda">Þetta er frumgerð. Ekkert er sent héðan: hnappurinn opnar póstforritið þitt með textanum tilbúnum.</p>
          </div>
        )}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
export function Voruspjald() {
  const st = useStada()
  const loka = () => stada.opnaVoru(null)
  const ref = useDialog(!!st.vara, loka)
  const v = VORUR.find((x) => x.id === st.vara) ?? null
  const [litrar, setLitrar] = useState(4)
  const fl = v ? FLOKKAR.find((f) => f.id === v.fl)?.nafn : ''

  return (
    <>
      <div className={`mal-tjald${v ? ' opid' : ''}`} onClick={loka} aria-hidden="true" />
      <div ref={ref} className={`mal-skuffa mal-spjald${v ? ' opid' : ''}`} role="dialog" aria-modal="true" aria-labelledby="mal-vs-t" aria-hidden={!v}
        {...(!v ? { inert: '' as unknown as boolean } : {})} data-lenis-prevent>
        <div className="mal-skuffaH">
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--mute)' }}>{fl}</span>
          <button className="mal-hring ljos" data-fyrst aria-label="Loka" onClick={loka}><X size={20} strokeWidth={1.75} /></button>
        </div>
        {v && (
          <div className="mal-skuffaB">
            <div className="mal-spjaldM"><img src={vaMynd(v.mynd, 800)} alt={v.nafn} width={520} height={390} /></div>
            <div>
              {v.svans && <span className="mal-svans">Svansmerkt</span>}
              <h2 id="mal-vs-t">{v.nafn}</h2>
            </div>
            <p>{v.lysing}</p>
            <dl className="mal-tafla">
              {v.notkun && (<><dt>Efnisnotkun</dt><dd>{fmtNotkun(v)}</dd></>)}
              {v.aferd && (<><dt>Áferð</dt><dd>{v.aferd.replace(/\.$/, '')}</dd></>)}
              {v.thurr && (<><dt>Þurrktími</dt><dd>{v.thurr.replace(/\.$/, '')}</dd></>)}
              {v.yfir && (<><dt>Yfirmálun</dt><dd>eftir {v.yfir[0] === v.yfir[1] ? v.yfir[0] : `${v.yfir[0]} til ${v.yfir[1]}`} klst.</dd></>)}
              {v.litir && (<><dt>Litir</dt><dd>{v.litir}</dd></>)}
            </dl>
            <div className="mal-tenglar">
              {v.pdf && <a className="mal-tengill" href={v.pdf} target="_blank" rel="noreferrer">Vörulýsing (PDF)<ExternalLink size={15} strokeWidth={1.75} /></a>}
              {v.oryggi && <a className="mal-tengill" href={v.oryggi} target="_blank" rel="noreferrer">Öryggisblað (PDF)<ExternalLink size={15} strokeWidth={1.75} /></a>}
              <a className="mal-tengill" href={v.url} target="_blank" rel="noreferrer">Á malning.is<ExternalLink size={15} strokeWidth={1.75} /></a>
            </div>
            {v.notkun && (
              <button className="mal-knappur hljodur" onClick={() => { stada.veljaReikni(v.id); loka(); faraA('#verk') }}>Reikna magn<i><ArrowRight size={18} /></i></button>
            )}
          </div>
        )}
        {v && (
          <div className="mal-skuffaF mal-skuffaFr">
            <label className="mal-reitur mal-litrarR">Lítrar
              <input type="number" inputMode="numeric" min={1} max={200} value={litrar} onChange={(e) => setLitrar(Math.max(1, Math.min(200, Number(e.target.value) || 1)))} />
            </label>
            <button className="mal-knappur dokkur" onClick={() => { stada.baeta({ id: v.id, litrar }); loka(); stada.opna(true) }}>Setja á verkblað<i><Check size={18} strokeWidth={2.25} /></i></button>
          </div>
        )}
      </div>
    </>
  )
}
