import { useEffect, useRef, useState } from 'react'
import { VIK } from './data'

/* ═════════════════════════════════════════════════════════════════════════
   STAÐARANDI — the wow, and it is one of their own sentences.

   Structurally this is the Heklusýn build's Herragardur: a scale diagram of
   PUBLISHED AREAS ONLY, drawn because the client states the whole
   proposition in a paragraph nobody reads. Copied device, THG's numbers.

   thg.is publishes exactly two figures for Endurhæfingarmiðstöð SÁÁ í Vík:

     "Húsið stækkar um samtals 2.730 m² og verður eftir stækkun samtals
      3.580 m²."

   3.580 − 2.730 = 850, so the building already standing is 850 m². That
   subtraction is arithmetic on their own published figures and nothing more
   — no third number is introduced.

   Drawn at true scale it IS the thesis the practice never states out loud:
   the addition is more than three times the original building, and the whole
   job is making it defer to the small square it grew out of. "Að fella nýtt
   að því sem fyrir er", as an area.

   Honesty: a scale diagram of areas, not a survey and not a site plan.
   Labelled as such on the page. No boundary, position, orientation or
   distance is implied — only areas, which they publish.
   ═════════════════════════════════════════════════════════════════════════ */

const INK = '#111111'
const MUTED = '#767676'
const RULE = '#e2e2e2'

/* Everything below derives from side = sqrt(area), normalised so the
   post-extension square fills the 100-unit viewBox. */
const M_PER_UNIT = Math.sqrt(VIK.after) / 100
const side = (m2: number) => Math.sqrt(m2) / M_PER_UNIT

const AFTER = side(VIK.after)        // 100
const ADDITION = side(VIK.addition)  // 87.3
const BEFORE = side(VIK.before)      // 48.7

/* Icelandic groups thousands with a FULL STOP: 3.580, never 3,580. Chrome's
   own is-IS locale data returns a comma here, which put "3,580 m²" on the
   drawing while the body copy two lines above it said "3.580" — so the
   separator is written explicitly rather than delegated. */
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export function Stadarandi() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(true); return }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }),
      { rootMargin: '0px 0px -18% 0px', threshold: 0.01 },
    )
    io.observe(el)
    const failsafe = window.setTimeout(() => setShown(true), 2000)
    return () => { io.disconnect(); window.clearTimeout(failsafe) }
  }, [])

  return (
    <div ref={ref} className={`thg-sta${shown ? ' is-in' : ''}`}>
      <svg
        viewBox="-4 -4 108 108" role="img"
        aria-label={`Skýringarmynd: húsið í Vík fyrir stækkun ${fmt(VIK.before)} fermetrar, viðbótin ${fmt(VIK.addition)} fermetrar og húsið eftir stækkun ${fmt(VIK.after)} fermetrar, öll teiknuð í sama kvarða.`}
      >
        {/* after the extension — the whole building */}
        <rect className="thg-sa" x={0} y={0} width={AFTER} height={AFTER} />

        {/* the addition alone */}
        <rect className="thg-sadd" x={0} y={AFTER - ADDITION} width={ADDITION} height={ADDITION} />

        {/* what was already standing — the thing everything else defers to */}
        <rect className="thg-sb" x={0} y={AFTER - BEFORE} width={BEFORE} height={BEFORE} />

        <text className="thg-st thg-st-a" x={AFTER} y={-1.4} textAnchor="end">{fmt(VIK.after)} m²</text>
        <text className="thg-st" x={ADDITION + 1.6} y={AFTER - ADDITION + 4.4}>{fmt(VIK.addition)} m² viðbót</text>
        <text className="thg-st thg-st-b" x={BEFORE + 1.8} y={AFTER - 1.4}>{fmt(VIK.before)} m² fyrir</text>
      </svg>

      <dl className="thg-sta-key">
        <div><dt>Húsið sem stóð fyrir</dt><dd>{fmt(VIK.before)} m²</dd></div>
        <div><dt>Viðbótin</dt><dd>{fmt(VIK.addition)} m²</dd></div>
        <div><dt>Eftir stækkun</dt><dd>{fmt(VIK.after)} m²</dd></div>
      </dl>
    </div>
  )
}

export const STADARANDI_CSS = `
.thg-sta{display:grid;gap:clamp(28px,4vw,64px);align-items:end}
@media (min-width:880px){.thg-sta{grid-template-columns:minmax(0,1fr) minmax(0,.85fr)}}
.thg-sta svg{width:100%;height:auto;overflow:visible}

.thg-sta rect{transform-box:fill-box;transform-origin:bottom left}
.thg-sa{fill:none;stroke:${INK};stroke-width:.55}
.thg-sadd{fill:none;stroke:${MUTED};stroke-width:.4;stroke-dasharray:2.2 1.8}
.thg-sb{fill:${INK};stroke:none}

/* the finished building grows out around the one that was already there */
.thg-sta .thg-sa{transform:scale(.487);opacity:0;
  transition:transform 1.5s cubic-bezier(.17,.84,.44,1),opacity .6s cubic-bezier(.17,.84,.44,1)}
.thg-sta.is-in .thg-sa{transform:scale(1);opacity:1}
.thg-sta .thg-sadd,.thg-sta .thg-sb{opacity:0;transition:opacity .7s cubic-bezier(.17,.84,.44,1)}
.thg-sta.is-in .thg-sadd{opacity:1;transition-delay:.22s}
.thg-sta.is-in .thg-sb{opacity:1;transition-delay:1.05s}

/* SVG user units, so the rendered size is this times (width / 108). At a
   354px-wide phone that is ~3.3x, so 3.1 renders near 10px — too small.
   Bumped on narrow viewports where the scale factor is lowest. */
.thg-st{font-size:3.1px;fill:${MUTED};letter-spacing:.02em}
.thg-st-a{fill:${INK};font-size:3.6px}
@media (max-width:700px){
  .thg-st{font-size:4.4px}
  .thg-st-a{font-size:5px}
}
.thg-st-b{fill:${INK}}
.thg-sta text{opacity:0;transition:opacity .7s cubic-bezier(.17,.84,.44,1) .9s}
.thg-sta.is-in text{opacity:1}

.thg-sta-key{margin:0;display:grid;gap:0;border-top:1px solid ${RULE}}
.thg-sta-key>div{display:flex;justify-content:space-between;gap:1.4rem;align-items:baseline;
  padding-block:clamp(12px,1.4vw,18px);border-bottom:1px solid ${RULE}}
.thg-sta-key dt{margin:0;color:${MUTED};font-size:clamp(.86rem,1.05vw,1rem)}
.thg-sta-key dd{margin:0;font-size:clamp(1.05rem,2vw,1.6rem);letter-spacing:-.02em;text-align:right}
@media (prefers-reduced-motion:reduce){
  .thg-sta .thg-sa,.thg-sta .thg-sadd,.thg-sta .thg-sb,.thg-sta text{
    opacity:1!important;transform:none!important;transition:none!important}
}
`
