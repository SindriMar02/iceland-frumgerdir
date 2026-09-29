import { useMemo, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { stada, useStada } from './state'
import { Ord, useInview, vaMynd } from './ui'
import { TEXTI } from './data'
import { FLOKKAR, VORUR, type Vara } from './vorur'

/* "Hvað þarf ég?" Every number comes from Málning's own data sheets (the PDF
   under each product): litres per square metre per coat, and the hours until
   the next coat may go on. The page adds nothing but the multiplication. */

const komma = (n: number, d: number) => n.toFixed(d).replace('.', ',')
export const fmtL = (n: number, d = 1) => {
  const t = komma(n, d)
  return t.includes(',') ? t.replace(/,?0+$/, '') : t
}
const tv = (n: number) => komma(n, 2)
export const fmtNotkun = (v: Vara) =>
  !v.notkun ? '' : v.notkun[0] === v.notkun[1]
    ? `${tv(v.notkun[0])} l/m² í umferð`
    : `${tv(v.notkun[0])} til ${tv(v.notkun[1])} l/m²`

const REIKNANLEG = VORUR.filter((v) => v.notkun)

function klst(min: number, max: number) {
  return min === max ? `${min} ${min === 1 ? 'klukkustund' : 'klukkustundir'}` : `${min} til ${max} klukkustundir`
}

function timiEftir(byrjun: string, klstar: number): string {
  const [h, m] = byrjun.split(':').map(Number)
  const t = h * 60 + (m || 0) + klstar * 60
  const dagar = Math.floor(t / 1440)
  const hh = Math.floor((t % 1440) / 60), mm = t % 60
  const s = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
  return dagar === 0 ? `kl. ${s}` : dagar === 1 ? `á morgun kl. ${s}` : `eftir ${dagar} daga kl. ${s}`
}

export const VERK_CSS = `
.mal-verk{padding:clamp(72px,9vw,140px) var(--gutter) 0;max-width:1500px;margin:0 auto;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(28px,5vw,96px);align-items:start}
.mal-verkV{display:flex;flex-direction:column;gap:26px;min-width:0}
.mal-verk h2{font-family:var(--disp);font-weight:400;font-size:clamp(2.6rem,5.2vw,5rem);line-height:.98;letter-spacing:-.02em;margin:0}
.mal-verkV .undir{margin:0;color:var(--mute);font-size:17px;max-width:50ch}
.mal-reit{display:flex;flex-direction:column;gap:8px}
.mal-reit>span{font-size:13px;font-weight:600;color:var(--mute)}
.mal-verk .mal-vsel{width:100%}
.mal-fl{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center}
.mal-fl input[type=number]{width:120px;height:52px;border-radius:14px;border:0;background:var(--kort);font:inherit;font-size:20px;font-weight:600;padding:0 14px;color:var(--ink);
  font-variant-numeric:tabular-nums;box-shadow:inset 0 0 0 1px transparent}
.mal-fl input[type=number]:focus{outline:2px solid var(--ink);outline-offset:2px}
.mal-fl input[type=range]{width:100%;accent-color:var(--ink);height:44px}
.mal-umf{display:flex;gap:6px}
.mal-umf .mal-pilla{border:1px solid var(--lina);min-width:56px;justify-content:center;height:46px}
.mal-umf .mal-pilla[aria-pressed=true]{background:var(--ink);color:#fff;border-color:var(--ink)}
.mal-nidurst{background:var(--kort);border-radius:var(--r);padding:clamp(22px,3vw,44px);display:flex;flex-direction:column;gap:22px;min-width:0;position:relative;overflow:hidden}
.mal-nidurstT{display:grid;grid-template-columns:minmax(0,1fr) 148px;gap:12px;align-items:center}
.mal-nidurstT img{width:100%;height:auto;mix-blend-mode:multiply}
.mal-tala2{font-family:var(--disp);font-size:clamp(2.6rem,5vw,4.6rem);line-height:1;letter-spacing:-.02em;margin:0;font-variant-numeric:lining-nums}
.mal-tala2 small{font-family:var(--sans);font-size:.3em;letter-spacing:0;color:var(--mute);margin-left:.4em;font-weight:500}
.mal-undirt{margin:0;font-size:15px;color:var(--mute)}
.mal-tima{display:flex;flex-direction:column;gap:10px}
.mal-braut{display:flex;align-items:stretch;gap:4px;height:44px}
.mal-braut span{display:grid;place-items:center;border-radius:12px;font-size:13px;font-weight:600;white-space:nowrap;padding:0 10px;min-width:0;overflow:hidden}
.mal-braut .m{background:var(--tint);color:var(--tint-ink);transition:background .7s var(--ease),color .7s var(--ease)}
.mal-braut .b{background:#fff;color:var(--mute);flex:0 0 auto}
.mal-byrja{display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:15px}
.mal-byrja input{height:46px;border-radius:12px;border:0;background:#fff;padding:0 12px;font:inherit;font-size:16px;font-weight:600;color:var(--ink);box-shadow:inset 0 0 0 1px var(--lina)}
.mal-heimild{margin:0;font-size:13px;color:var(--mute)}
.mal-heimild a{text-underline-offset:3px}
.mal-verkA{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
@media (max-width:991px){.mal-verk{grid-template-columns:1fr}.mal-nidurstT{grid-template-columns:minmax(0,1fr) 108px}}
@media (max-width:560px){.mal-braut{flex-direction:column;height:auto}.mal-braut span{min-height:40px;white-space:normal;text-align:center}}
.mal-heimild a{display:inline-flex;align-items:center;min-height:44px;padding:0 6px}
`

export function Verk() {
  const st = useStada()
  const [flat, setFlat] = useState(40)
  const [umf, setUmf] = useState(2)
  const [byrjun, setByrjun] = useState('09:00')
  const ref = useInview<HTMLElement>('0px 0px -8% 0px')
  const v = REIKNANLEG.find((x) => x.id === st.reikni) ?? REIKNANLEG[0]

  const lag = useMemo(() => {
    if (!v.notkun) return null
    const lo = flat * umf * v.notkun[0], hi = flat * umf * v.notkun[1]
    return { lo, hi }
  }, [v, flat, umf])
  if (!lag || !v.notkun) return null

  const svid = lag.hi - lag.lo > lag.hi * 0.05
    ? `${fmtL(lag.lo)} til ${fmtL(lag.hi)}`
    : `um ${fmtL(lag.hi)}`
  const yfir = v.yfir
  const setaAVerk = () => { stada.baeta({ id: v.id, litrar: Math.max(1, Math.ceil(lag.hi)), flatarmal: flat, umferdir: umf }); stada.opna(true) }

  return (
    <section className="mal-verk" id="verk" aria-labelledby="mal-verk-t" ref={ref as never}>
      <div className="mal-verkV">
        <Ord text="Hvað | *þarf ég?*" id="mal-verk-t" />
        <p className="undir mal-rise">{TEXTI.verkUnder}</p>

        <label className="mal-reit mal-rise"><span>Vara</span>
          <select className="mal-vsel" value={v.id} onChange={(e) => stada.veljaReikni(e.target.value)}>
            {FLOKKAR.map((f) => {
              const l = REIKNANLEG.filter((x) => x.fl === f.id)
              return l.length ? (<optgroup key={f.id} label={f.nafn}>{l.map((x) => (<option key={x.id} value={x.id}>{x.nafn}</option>))}</optgroup>) : null
            })}
          </select>
        </label>

        <div className="mal-reit mal-rise">
          <span id="mal-flat-l">Flatarmál í fermetrum</span>
          <div className="mal-fl">
            <input name="flatarmal" type="number" inputMode="numeric" min={1} max={2000} value={flat} aria-labelledby="mal-flat-l"
              onChange={(e) => setFlat(Math.max(1, Math.min(2000, Number(e.target.value) || 1)))} />
            <input type="range" min={5} max={300} step={5} value={Math.min(300, Math.max(5, flat))} aria-label="Flatarmál, sleði"
              onChange={(e) => setFlat(Number(e.target.value))} />
          </div>
        </div>

        <div className="mal-reit mal-rise">
          <span id="mal-umf-l">Umferðir</span>
          <div className="mal-umf" role="group" aria-labelledby="mal-umf-l">
            {[1, 2, 3].map((n) => (<button key={n} className="mal-pilla" aria-pressed={umf === n} onClick={() => setUmf(n)}>{n}</button>))}
          </div>
        </div>
      </div>

      <div className="mal-nidurst mal-rise">
        <div className="mal-nidurstT">
          <div>
            <p className="mal-tala2" aria-live="polite">{svid}<small>lítrar</small></p>
            <p className="mal-undirt">{v.nafn}, {umf} {umf === 1 ? 'umferð' : 'umferðir'} á {flat}&nbsp;m², {fmtNotkun(v)}. Efnisnotkun er háð hrjúfleika og gleypni flatarins.</p>
          </div>
          <img src={vaMynd(v.mynd, 480)} alt={v.nafn} width={148} height={148} loading="lazy" />
        </div>

        {yfir ? (
          <div className="mal-tima">
            <div className="mal-braut" aria-hidden="true">
              {Array.from({ length: umf }).flatMap((_, i) => [
                <span key={'m' + i} className="m" style={{ flex: '1 1 0' }}>Umferð {i + 1}</span>,
                ...(i < umf - 1 ? [<span key={'b' + i} className="b">{yfir[0] === yfir[1] ? `${yfir[0]} klst.` : `${yfir[0]} til ${yfir[1]} klst.`}</span>] : []),
              ])}
            </div>
            <p className="mal-undirt"><b>Næsta umferð má fara á eftir {klst(yfir[0], yfir[1])}</b>, eftir aðstæðum (við 20°C samkvæmt vörulýsingu).</p>
            <div className="mal-byrja">
              <label htmlFor="mal-byrja">Ég byrja kl.</label>
              <input id="mal-byrja" type="time" value={byrjun} onChange={(e) => setByrjun(e.target.value || '09:00')} />
              <span>Næsta umferð {timiEftir(byrjun, yfir[0])}{yfir[1] !== yfir[0] ? ` til ${timiEftir(byrjun, yfir[1])}` : ''}.</span>
            </div>
          </div>
        ) : (
          <p className="mal-undirt">Tími milli umferða stendur í vörulýsingunni.</p>
        )}

        <p className="mal-heimild">Tölurnar koma úr vörulýsingu Málningar{v.pdf ? <> fyrir {v.nafn} (<a href={v.pdf} target="_blank" rel="noreferrer">PDF</a>)</> : ''}. Spurðu söluaðila um pakkningar.</p>
        <div className="mal-verkA">
          <button className="mal-knappur dokkur" onClick={setaAVerk}>Setja á verkblað<i><Check size={18} strokeWidth={2.25} /></i></button>
          <button className="mal-knappur hljodur" onClick={() => stada.opnaVoru(v.id)}>Sjá vöruna<i><ArrowRight size={18} strokeWidth={2} /></i></button>
        </div>
      </div>
    </section>
  )
}
