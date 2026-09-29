import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, Copy, Minus, Plus, RotateCcw } from 'lucide-react'
import {
  HAMARK_DROPA, LITEFNI, blanda, deltaE2000, kortkodi, lysing, naestiLitur, srgbToLab, type Dropar, type LiteftiId,
} from './farbe/index.ts'
import { stada, luminance, rgbOf, useStada } from './state'
import { Ord, foto, reduced, useInview } from './ui'
import { TEXTI } from './data'
import { VORUR } from './vorur'

/* The blender. Colourant drops go into a white base; the result is shown on
   Málning's own split-room photograph (the pink half of the wall is replaced
   by the visitor's colour), matched to the nearest Kópal colour from their
   printed colour card, and turned into a short code. The maths is the
   engine in ./farbe (an illustrative Kubelka-Munk model, not their formulas). */

export const BLANDA_VORUR = [
  'kopal-2', 'kopal-4', 'kopal-10', 'kopal-25', 'kopal-akrylhud-gljastig-25-60', 'kopal-perlulakk-4080',
  'kjorvari-14', 'kjorvari-16', 'kjorvari-20', 'kjorvari-22-pallaolia', 'kjorvari-24', 'steintex', 'steinskjol', 'steinvari-2000',
]
export const LITRAR = [1, 2, 4, 6, 8, 10]

const LYSING_TEXTI: Record<ReturnType<typeof lysing>, string> = {
  nakvaemur: 'næstum sami litur',
  'mjog-nalaegur': 'mjög nálægur litur',
  nalaegur: 'nálægur litur',
  fjarlaegur: 'enginn nálægur litur á kortinu',
}

const heiti = (n: string) => n.charAt(0) + n.slice(1).toLocaleLowerCase('is')

/** Greedy search for a drop recipe that lands on a hex: add whichever 1 to 3 drops of one colourant lowers CIEDE2000 most. */
export function finnaUppskrift(hex: string): Dropar {
  const mark = srgbToLab(rgbOf(hex))
  const nu: Record<string, number> = {}
  const dE = (d: Dropar) => deltaE2000(srgbToLab(rgbOf(blanda(d).hex)), mark)
  let best = dE({})
  for (let i = 0; i < 70; i++) {
    let val: { id: LiteftiId; n: number; e: number } | null = null
    for (const l of LITEFNI) {
      for (const n of [1, 2, 3]) {
        const c = (nu[l.id] ?? 0) + n
        if (c > HAMARK_DROPA) continue
        const e = dE({ ...nu, [l.id]: c })
        if (e < best - 0.05 && (!val || e < val.e)) val = { id: l.id, n: c, e }
      }
    }
    if (!val) break
    nu[val.id] = val.n; best = val.e
  }
  return nu
}

export function litaKodi(d: Dropar, vara: string, litrar: number): string {
  const vi = Math.max(0, BLANDA_VORUR.indexOf(vara))
  return kortkodi({ dropar: d, vara: vi, gljai: 0, litrar: Math.max(0, LITRAR.indexOf(litrar)) })
}

export const BLANDARI_CSS = `
.mal-bl{margin:0 var(--gutter);background:var(--kort);border-radius:var(--r);display:grid;grid-template-columns:minmax(0,1.02fr) minmax(0,.98fr);overflow:hidden;
  position:relative}
.mal-blV{padding:clamp(28px,4.4vw,72px) clamp(20px,4vw,64px);display:flex;flex-direction:column;gap:28px;min-width:0}
.mal-blV h2{font-family:var(--disp);font-weight:400;font-size:clamp(2.6rem,5.4vw,5.2rem);line-height:.98;letter-spacing:-.02em;margin:0}
.mal-blV h2 em,.mal-vorur h2 em,.mal-verk h2 em{font-style:italic;padding-right:.08em}
.mal-blV .undir{max-width:52ch;margin:0;color:var(--mute);font-size:17px}
.mal-lit{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none}
.mal-lit li{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;padding:8px 8px 8px 12px;border-radius:16px;background:#fff}
.mal-lit .dott{width:26px;height:26px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(34,34,33,.18)}
.mal-lit b{font-weight:600;font-size:15px}
.mal-lit .skammtur{display:flex;align-items:center;gap:6px}
.mal-lit .fjoldi{min-width:2.2ch;text-align:center;font-variant-numeric:tabular-nums;font-weight:600;font-size:16px}
.mal-lit .mal-hring{width:44px;height:44px}
.mal-lit .mal-hring:disabled,.mal-kodi .mal-hring:disabled{opacity:.35;cursor:not-allowed}
.mal-nidur{display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center}
.mal-laug{position:relative;width:132px;height:132px;flex:none}
.mal-laug .flot{position:absolute;inset:0;border-radius:50%;background:var(--vegg,#fdfdfd);
  box-shadow:inset 0 0 0 1px rgba(34,34,33,.2),inset 0 -14px 26px -8px rgba(34,34,33,.28),0 0 0 8px #fff,0 0 0 9px rgba(34,34,33,.16);
  transition:background .5s var(--ease)}
.mal-laug .bara{position:absolute;inset:-9px;border-radius:50%;pointer-events:none}
.mal-dropi{position:absolute;left:calc(50% - 7px);top:-36px;width:14px;height:18px;border-radius:50% 50% 50% 50% / 62% 62% 38% 38%;
  animation:mal-fall .55s cubic-bezier(.5,0,.9,.5) forwards}
@keyframes mal-fall{0%{transform:translateY(-10px) scale(.7);opacity:0}15%{opacity:1}100%{transform:translateY(96px) scale(1);opacity:0}}
.mal-alda{position:absolute;inset:16px;border-radius:50%;border:2px solid rgba(255,255,255,.75);animation:mal-alda .9s var(--ease) forwards;pointer-events:none}
@keyframes mal-alda{0%{transform:scale(.3);opacity:.9}100%{transform:scale(1.15);opacity:0}}
.mal-nidur .texti{min-width:0}
.mal-nidur .fyr{font-size:13px;color:var(--mute);margin:0 0 2px}
.mal-nidur .naf{font-family:var(--disp);font-size:clamp(1.8rem,3vw,2.5rem);line-height:1.05;margin:0}
.mal-nidur .nal{font-size:14px;color:var(--mute);margin:4px 0 0}
.mal-kodi{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:10px}
.mal-kodi code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;letter-spacing:.06em;background:#fff;border-radius:999px;padding:9px 16px;
  font-variant-numeric:tabular-nums;font-weight:600}
.mal-kodi .mal-hring{width:44px;height:44px}
.mal-val{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.mal-val label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:var(--mute)}
.mal-val select,.mal-vsel{height:52px;border-radius:14px;border:0;background:#fff;color:var(--ink);font:inherit;font-size:16px;font-weight:500;padding:0 14px;
  box-shadow:inset 0 0 0 1px var(--lina);appearance:none;-webkit-appearance:none;
  background-image:linear-gradient(45deg,transparent 50%,var(--ink) 50%),linear-gradient(135deg,var(--ink) 50%,transparent 50%);
  background-position:calc(100% - 22px) 22px,calc(100% - 16px) 22px;background-size:6px 6px,6px 6px;background-repeat:no-repeat;padding-right:38px}
.mal-blA{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.mal-vidvorun{margin:0;font-size:14px;color:var(--mute);max-width:56ch;border-top:1px solid var(--lina);padding-top:16px}
.mal-blH{position:relative;min-height:100%;display:grid;place-items:center;background:var(--kort2)}
.mal-vegg{position:relative;isolation:isolate;height:min(86svh,860px);aspect-ratio:2/3;max-width:100%;overflow:hidden;background:#ccc}
.mal-vegg img.grunn{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mal-vegg .lag{position:absolute;inset:0;clip-path:polygon(47% 0,100% 0,100% 100%,50.2% 100%,47.9% 60%,47% 45%);pointer-events:none;transition:background .5s var(--ease),opacity .5s var(--ease)}
.mal-vegg .l1{background:var(--vegg,#fdfdfd);mix-blend-mode:color}
.mal-vegg .l2{background:var(--vegg,#fdfdfd);mix-blend-mode:multiply;opacity:var(--vm,.3)}
.mal-vegg .l3{background:#fff;mix-blend-mode:screen;opacity:var(--vs,0)}
[data-tomt] .mal-vegg .lag{opacity:0 !important}
.mal-vegg .merkid{position:absolute;bottom:22px;display:inline-flex;align-items:center;height:36px;padding:0 16px;border-radius:999px;background:#fff;color:var(--ink);font-size:13px;font-weight:600;
  box-shadow:0 8px 24px -10px rgba(34,34,33,.4)}
.mal-vegg .m1{left:20px}.mal-vegg .m2{right:20px;background:var(--tint);color:var(--tint-ink);transition:background .7s var(--ease),color .7s var(--ease)}
@media (max-width:991px){
  .mal-bl{grid-template-columns:1fr;overflow:clip}
  .mal-blH{position:sticky;top:76px;z-index:4;align-self:start;order:-1;padding:12px 12px 0;min-height:0;background:var(--kort)}
  .mal-bl :is(li,label,select,button,code){scroll-margin-top:calc(84px + clamp(170px,27svh,260px))}
  .mal-vegg{height:clamp(170px,27svh,260px);width:100%;aspect-ratio:auto;border-radius:16px;max-width:none}
  .mal-vegg img.grunn{object-position:center 46%}
  .mal-vegg .merkid{bottom:12px;height:32px;padding:0 13px;font-size:12px}
  .mal-blV{padding:24px 18px 32px}
}
@media (max-width:479px){.mal-val{grid-template-columns:1fr}.mal-laug{width:112px;height:112px}}
`

type Drop = { id: number; lit: string }

export function Blandari() {
  const st = useStada()
  const [dropar, setDropar] = useState<Dropar>({})
  const [vara, setVara] = useState('kopal-10')
  const [litrar, setLitrar] = useState(4)
  const [dropi, setDropi] = useState<Drop[]>([])
  const [afritad, setAfritad] = useState(false)
  const raf = useRef(0)
  const ref = useInview<HTMLElement>('0px 0px -10% 0px')

  const blond = useMemo(() => blanda(dropar), [dropar])
  const naest = useMemo(() => naestiLitur(blond.hex, 1)[0], [blond.hex])
  const samtals = LITEFNI.reduce((a, l) => a + (dropar[l.id] ?? 0), 0)
  const kodi = useMemo(() => litaKodi(dropar, vara, litrar), [dropar, vara, litrar])

  /* publish the mix as the page colour once the visitor has poured something */
  const audu = useRef(false)
  useEffect(() => {
    if (!audu.current) return
    stada.setLitur({
      hex: blond.hex, nafn: samtals ? `Þinn litur, næst ${heiti(naest.nafn)}` : 'Hvítur grunnur', uppruni: 'blandad',
      nalaegur: { nafn: naest.nafn, hex: naest.hex, deltaE: naest.deltaE }, dropar, kodi,
    })
  }, [blond.hex, naest, samtals, dropar, kodi])

  const baeta = useCallback((id: LiteftiId, d: number) => {
    audu.current = true
    setDropar((p) => {
      const n = Math.max(0, Math.min(HAMARK_DROPA, (p[id] ?? 0) + d))
      return n === (p[id] ?? 0) ? p : { ...p, [id]: n }
    })
    if (d > 0 && !reduced()) {
      const lit = LITEFNI.find((l) => l.id === id)?.hex ?? '#000'
      const k = Date.now() + Math.random()
      setDropi((a) => [...a.slice(-4), { id: k, lit }])
      window.setTimeout(() => setDropi((a) => a.filter((x) => x.id !== k)), 1000)
    }
  }, [])

  /* a colour picked in the library is poured here: find a recipe, then add the drops one at a time */
  const beidni = st.beidni
  useEffect(() => {
    if (!beidni) return
    audu.current = false
    const uppskrift = finnaUppskrift(beidni.hex)
    const rod = LITEFNI.flatMap((l) => Array.from({ length: uppskrift[l.id] ?? 0 }, () => l.id))
    stada.bidjaUmUppskrift(null)
    setDropar({})
    if (reduced()) { audu.current = true; setDropar(uppskrift); return }
    let i = 0
    const tikk = window.setInterval(() => {
      if (i >= rod.length) { window.clearInterval(tikk); return }
      const id = rod[i++]
      audu.current = true
      setDropar((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 }))
      const k = Date.now() + i
      setDropi((a) => [...a.slice(-3), { id: k, lit: LITEFNI.find((l) => l.id === id)?.hex ?? '#000' }])
      window.setTimeout(() => setDropi((a) => a.filter((x) => x.id !== k)), 900)
    }, Math.max(45, Math.min(160, 2600 / Math.max(1, rod.length))))
    return () => window.clearInterval(tikk)
  }, [beidni])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const lum = luminance(blond.hex)
  /* the photo's rose half has a luminance of about .10 (measured); `color` keeps that, so darker
     targets get a multiply layer and lighter ones a screen layer */
  const L0 = 0.1
  const veggur = {
    ['--vegg' as string]: blond.hex,
    ['--vm' as string]: (lum < L0 ? Math.min(0.9, 1 - lum / L0) : 0).toFixed(2),
    ['--vs' as string]: (lum > L0 ? Math.min(0.92, (lum - L0) / (1 - L0)) : 0).toFixed(2),
  }

  const afrita = async () => {
    const t = `Litakóði: ${kodi}\nLitur: ${samtals ? `næst ${heiti(naest.nafn)} í Kópal litakortinu` : 'Hvítur grunnur'}\nVara: ${VORUR.find((v) => v.id === vara)?.nafn}, ${litrar} l`
    try { await navigator.clipboard.writeText(t); setAfritad(true); window.setTimeout(() => setAfritad(false), 1800) } catch { /* clipboard blocked */ }
  }

  const setaAVerk = () => {
    stada.baeta({ id: vara, litrar })
    if (!stada.get().litur || stada.get().litur?.uppruni !== 'blandad') audu.current = true
    stada.opna(true)
  }

  const nafnVara = VORUR.find((v) => v.id === vara)?.nafn

  return (
    <section className="mal-bl" id="blandari" ref={ref as never} aria-labelledby="mal-bl-t" style={veggur} {...(samtals || st.litur ? {} : { 'data-tomt': '' })}>
      <div className="mal-blV">
        <Ord text={`${TEXTI.blandariTitillA} | *${TEXTI.blandariTitillB}*`} id="mal-bl-t" />
        <p className="undir mal-rise">{TEXTI.blandariUnder}</p>

        <ul className="mal-lit" aria-label="Litarefni">
          {LITEFNI.map((l) => {
            const n = dropar[l.id] ?? 0
            return (
              <li key={l.id}>
                <span className="dott" style={{ background: l.hex }} aria-hidden="true" />
                <b>{l.nafn}</b>
                <span className="skammtur" role="group" aria-label={`${l.nafn}, dropar`}>
                  <button className="mal-hring ljos" aria-label={`Færri dropar af ${l.nafn.toLocaleLowerCase('is')}`} disabled={n === 0} onClick={() => baeta(l.id, -1)}><Minus size={18} strokeWidth={2} /></button>
                  <span className="fjoldi" aria-live="polite">{n}</span>
                  <button className="mal-hring" aria-label={`Bæta dropa af ${l.nafn.toLocaleLowerCase('is')}`} disabled={n >= HAMARK_DROPA} onClick={() => baeta(l.id, 1)}><Plus size={18} strokeWidth={2} /></button>
                </span>
              </li>
            )
          })}
        </ul>

        <div className="mal-nidur">
          <div className="mal-laug" aria-hidden="true">
            <div className="flot" />
            {dropi.map((d) => (<span key={d.id} className="mal-dropi" style={{ background: d.lit }} />))}
            {dropi.map((d) => (<span key={'a' + d.id} className="mal-alda" />))}
          </div>
          <div className="texti">
            <p className="fyr">{samtals ? `${samtals} ${samtals === 1 ? 'dropi' : 'dropar'} í hvítum grunni` : 'Byrjaðu á að bæta dropa út í hvítan grunn'}</p>
            <p className="naf" aria-live="polite">{samtals ? heiti(naest.nafn) : 'Hvítur grunnur'}</p>
            {samtals > 0 && <p className="nal">{LYSING_TEXTI[lysing(naest.deltaE)]} í Kópal litakortinu</p>}
            <div className="mal-kodi">
              <code aria-label={`Litakóði ${kodi}`}>{kodi}</code>
              <button className="mal-hring ljos" aria-label={afritad ? 'Afritað' : 'Afrita litakóða'} onClick={afrita}>{afritad ? <Check size={18} strokeWidth={2} /> : <Copy size={18} strokeWidth={1.75} />}</button>
              <button className="mal-hring ljos" aria-label="Hreinsa blönduna" disabled={!samtals} onClick={() => { audu.current = false; setDropar({}); stada.setLitur(null) }}><RotateCcw size={18} strokeWidth={1.75} /></button>
            </div>
          </div>
        </div>

        <div className="mal-val">
          <label>Vara
            <select value={vara} onChange={(e) => setVara(e.target.value)}>
              {BLANDA_VORUR.map((id) => (<option key={id} value={id}>{VORUR.find((v) => v.id === id)?.nafn}</option>))}
            </select>
          </label>
          <label>Lítrar
            <select value={litrar} onChange={(e) => setLitrar(Number(e.target.value))}>
              {LITRAR.map((n) => (<option key={n} value={n}>{n} {n === 1 ? 'lítri' : 'lítrar'}</option>))}
            </select>
          </label>
        </div>

        <div className="mal-blA">
          <button className="mal-knappur dokkur" onClick={setaAVerk} disabled={!samtals && !st.litur}>
            Setja á verkblað<i><Check size={18} strokeWidth={2.25} /></i>
          </button>
          <span style={{ fontSize: 14, color: 'var(--mute)' }}>{nafnVara}, {litrar} l</span>
        </div>
        <p className="mal-vidvorun">{TEXTI.blandariVidvorun}</p>
      </div>

      <div className="mal-blH">
        <div className="mal-vegg" role="img" aria-label="Herbergi með vegg í tveimur litum. Hægri helmingurinn tekur litinn sem þú blandar.">
          <img className="grunn" src={foto('skipt-herbergi', 1280)} srcSet={`${foto('skipt-herbergi', 640)} 640w, ${foto('skipt-herbergi', 1280)} 1280w`} sizes="(max-width:991px) 100vw, 46vw" alt="" width={1261} height={1891} loading="lazy" />
          <div className="lag l1" /><div className="lag l2" /><div className="lag l3" />
          <span className="merkid m1">Núverandi</span>
          <span className="merkid m2">{samtals || st.litur ? 'Þinn litur' : 'Bættu við dropa'}</span>
        </div>
      </div>
    </section>
  )
}

