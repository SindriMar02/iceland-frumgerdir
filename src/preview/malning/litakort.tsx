import { useMemo, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { KOPAL_LITIR } from './farbe/index.ts'
import { stada, useStada } from './state'
import { Ord, faraA, useInview } from './ui'
import { TEXTI } from './data'

/* The Kópal interior colour card as a colour library. Names are Málning's
   own, printed on their 2018 card; each hex is estimated from a scan of that
   printed card and is not the paint formula, which the page says out loud. */

type Fjolskylda = 'allir' | 'hvitir' | 'grair' | 'blair' | 'graenir' | 'rauðir' | 'brunir'
const FJOLSKYLDUR: { id: Fjolskylda; n: string }[] = [
  { id: 'allir', n: 'Allir' },
  { id: 'hvitir', n: 'Hvítir' },
  { id: 'grair', n: 'Gráir' },
  { id: 'blair', n: 'Bláir' },
  { id: 'graenir', n: 'Grænir' },
  { id: 'rauðir', n: 'Rauðir og bleikir' },
  { id: 'brunir', n: 'Brúnir og gulir' },
]

function hsl(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2
  const d = mx - mn
  if (d === 0) return [0, 0, l]
  const s = d / (1 - Math.abs(2 * l - 1))
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [(h * 60 + 360) % 360, s, l]
}

export function fjolskylda(hex: string): Exclude<Fjolskylda, 'allir'> {
  const [h, s, l] = hsl(hex)
  if (l >= 0.86 && s < 0.25) return 'hvitir'
  if (s < 0.13) return 'grair'
  if (h >= 175 && h < 265) return 'blair'
  if (h >= 75 && h < 175) return 'graenir'
  if (h >= 20 && h < 75) return 'brunir'
  return 'rauðir'
}

const heiti = (n: string) => n.charAt(0) + n.slice(1).toLocaleLowerCase('is')

export const LITAKORT_CSS = `
.mal-litakort{padding:clamp(72px,9vw,140px) var(--gutter) 0;max-width:1500px;margin:0 auto;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(24px,4vw,72px);align-items:start}
.mal-lkV{display:flex;flex-direction:column;gap:22px;min-width:0}
.mal-lkV h2{font-family:var(--disp);font-weight:400;font-size:clamp(2.4rem,4.6vw,4.4rem);line-height:1;letter-spacing:-.02em;margin:0}
.mal-lkV .undir{margin:0;max-width:46ch;color:var(--mute);font-size:16px}
.mal-flok{display:flex;flex-wrap:wrap;gap:6px}
.mal-flok .mal-pilla{border:1px solid var(--lina);height:44px;padding:0 15px}
.mal-flok .mal-pilla[aria-pressed=true]{background:var(--ink);color:#fff;border-color:var(--ink)}
.mal-lestur{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;align-items:center;padding:14px;border-radius:var(--r);background:var(--kort);min-height:104px}
.mal-lestur .lit{grid-row:1/3;width:76px;height:76px;border-radius:16px;box-shadow:inset 0 0 0 1px rgba(34,34,33,.16);transition:background .3s var(--ease)}
.mal-lestur b{font-family:var(--disp);font-weight:400;font-size:1.7rem;line-height:1.05;align-self:end}
.mal-lestur small{font-size:13px;color:var(--mute);align-self:start}
.mal-lestur .a{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.mal-lestur .mal-knappur{height:44px;font-size:14px}
.mal-lestur .mal-knappur i{width:32px;height:32px}
.mal-rutur{--rows:8;display:grid;grid-auto-flow:column;grid-template-rows:repeat(var(--rows),auto);grid-auto-columns:minmax(0,1fr);gap:6px;margin:0;padding:0;list-style:none}
.mal-rutur li{min-width:0}
.mal-rutur button{display:block;width:100%;border-radius:12px;padding:0;position:relative}
.mal-sv{display:block;aspect-ratio:1/1;border-radius:12px;box-shadow:inset 0 0 0 1px rgba(34,34,33,.14);
  transition:transform .3s var(--ease),opacity .3s var(--ease),box-shadow .2s var(--ease)}
.mal-rutur.sia button:not(.samsvarar) .mal-sv{opacity:.16}
@media (hover:hover) and (pointer:fine){.mal-rutur button:hover .mal-sv,.mal-rutur button:focus-visible .mal-sv{transform:scale(1.14);z-index:2;box-shadow:inset 0 0 0 1px rgba(34,34,33,.2),0 10px 20px -8px rgba(34,34,33,.5)}}
.mal-rutur button[aria-pressed=true] .mal-sv{box-shadow:inset 0 0 0 1px rgba(34,34,33,.14),0 0 0 2px #fff,0 0 0 4px var(--ink)}
.mal-rutur button:focus-visible{outline-offset:3px}
@media (max-width:991px){.mal-litakort{grid-template-columns:1fr}.mal-rutur{overflow-x:auto;grid-auto-columns:60px;scroll-snap-type:x proximity;scroll-padding-inline:var(--gutter);padding:2px 2px 10px;margin:0 calc(var(--gutter) * -1);padding-inline:var(--gutter);scrollbar-width:none}
  .mal-rutur::-webkit-scrollbar{display:none}.mal-rutur li{scroll-snap-align:start}.mal-rutur button{min-height:44px}}
`

export function Litakort() {
  const st = useStada()
  const [f, setF] = useState<Fjolskylda>('allir')
  const [yfir, setYfir] = useState<{ n: string; hex: string } | null>(null)
  const ref = useInview<HTMLElement>('0px 0px -8% 0px')
  const fam = useMemo(() => new Map(KOPAL_LITIR.map((l) => [l.nafn, fjolskylda(l.hex)])), [])
  const valinn = st.litur?.uppruni === 'litakort' ? st.litur : null
  const lestur = yfir ?? (valinn ? { n: valinn.nafn.replace(/^Kópal /, '').toLocaleUpperCase('is'), hex: valinn.hex } : null)

  const veldu = (n: string, hex: string) => {
    if (valinn && valinn.hex === hex && valinn.nafn === `Kópal ${heiti(n)}`) { stada.setLitur(null); return }
    stada.setLitur({ hex, nafn: `Kópal ${heiti(n)}`, uppruni: 'litakort' })
  }

  return (
    <section className="mal-litakort" id="litakort" aria-labelledby="mal-lk-t" ref={ref as never}>
      <div className="mal-lkV">
        <Ord text={TEXTI.litakortTitill} id="mal-lk-t" />
        <p className="undir mal-rise">{TEXTI.litakortUnder}</p>
        <div className="mal-flok mal-rise" role="group" aria-label="Sía eftir lit">
          {FJOLSKYLDUR.map((x) => (
            <button key={x.id} className="mal-pilla" aria-pressed={f === x.id} onClick={() => setF(x.id)}>{x.n}</button>
          ))}
        </div>
        <div className="mal-lestur mal-rise" aria-live="polite">
          <span className="lit" style={{ background: lestur?.hex ?? 'transparent', boxShadow: lestur ? undefined : 'inset 0 0 0 1px rgba(34,34,33,.16)' }} aria-hidden="true" />
          <b>{lestur ? heiti(lestur.n) : 'Veldu lit'}</b>
          <small>{lestur ? 'Úr Kópal innilitakortinu' : 'Bentu á lit eða veldu hann til að sjá nafnið'}</small>
          {valinn && (
            <div className="a">
              <button className="mal-knappur" onClick={() => { stada.bidjaUmUppskrift({ hex: valinn.hex, nafn: valinn.nafn }); faraA('#blandari') }}>Blanda þennan lit<i><ArrowRight size={17} strokeWidth={2} /></i></button>
              <button className="mal-knappur hljodur" onClick={() => stada.opna(true)}>Verkblað<i><Check size={17} strokeWidth={2.25} /></i></button>
            </div>
          )}
        </div>
      </div>
      <ul className={`mal-rutur${f !== 'allir' ? ' sia' : ''}`} aria-label="Litir í Kópal litakortinu">
        {KOPAL_LITIR.map((l) => (
          <li key={l.nafn}>
            <button className={f === 'allir' || fam.get(l.nafn) === f ? 'samsvarar' : ''} aria-pressed={valinn?.nafn === `Kópal ${heiti(l.nafn)}`}
              aria-label={`${heiti(l.nafn)}, litur úr Kópal litakortinu`}
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') setYfir({ n: l.nafn, hex: l.hex }) }} onPointerLeave={() => setYfir(null)}
              onFocus={() => setYfir({ n: l.nafn, hex: l.hex })} onBlur={() => setYfir(null)}
              onClick={() => veldu(l.nafn, l.hex)}>
              <span className="mal-sv" style={{ background: l.hex }} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
