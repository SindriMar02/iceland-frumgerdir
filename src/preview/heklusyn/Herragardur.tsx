import { useEffect, useRef, useState } from 'react'

/* ═════════════════════════════════════════════════════════════════════════
   HERRAGARÐURINN — the wow, and it is one of their own sentences.

   Heklusýn's homepage says the proposition outright:

     "viðskiptavinir okkar séu ekki bara að kaupa sumarhús eða heilsárshús,
      heldur sinn eigin herragarð"

   and draws its own comparison: their plots run to 5 hectares where the
   ordinary Icelandic summerhouse plot is 0,3 til 1 hektari. That contrast is
   the entire product and their site states it in a paragraph nobody reads.

   So it is drawn instead, to true scale, from their published numbers only:

     5 ha            = 50.000 m²  → 223,6 m square
     1 ha            = 10.000 m²  → 100 m square
     0,3 ha          =  3.000 m²  →  54,8 m square
     Rangárslétta 2  =    147 m²  →  12,1 m square

   At that scale the house covers 0,29% of the five hectares. The drawing
   makes a 109-million-króna price legible in a way a photograph cannot: you
   are not buying the house, you are buying everything around it.

   Honesty: this is a scale diagram of published areas, not a survey and not
   a site plan. Labelled as such on the page. No plot boundaries, positions
   or distances are implied — only areas, which they publish.
   ═════════════════════════════════════════════════════════════════════════ */

const INK = '#111111'
const MUTED = '#767676'
const RULE = '#e2e2e2'

/* Everything below derives from side = sqrt(area), normalised so the
   five-hectare square fills the 100-unit viewBox. */
const M_PER_UNIT = Math.sqrt(50000) / 100      // 2.236 m per unit
const side = (m2: number) => Math.sqrt(m2) / M_PER_UNIT

const FIVE_HA = side(50000)   // 100
const ONE_HA = side(10000)    // 44.7
const MIN_HA = side(3000)     // 24.5
const HOUSE = side(147)       // 5.4

export function Herragardur() {
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
    <div ref={ref} className={`hk-herra${shown ? ' is-in' : ''}`}>
      <svg viewBox="-4 -4 108 108" role="img"
           aria-label="Skýringarmynd: fimm hektara spilda, dæmigerð sumarhúsalóð og 147 fermetra hús, öll teiknuð í sama kvarða.">
        {/* five hectares — the parcel */}
        <rect className="hk-h5" x={0} y={0} width={FIVE_HA} height={FIVE_HA} />

        {/* one hectare, the top of the ordinary range */}
        <rect className="hk-h1" x={0} y={FIVE_HA - ONE_HA} width={ONE_HA} height={ONE_HA} />

        {/* 0,3 hectares, the bottom of the ordinary range */}
        <rect className="hk-h03" x={0} y={FIVE_HA - MIN_HA} width={MIN_HA} height={MIN_HA} />

        {/* the house itself, same scale */}
        <rect className="hk-hh" x={0} y={FIVE_HA - HOUSE} width={HOUSE} height={HOUSE} />

        <text className="hk-ht hk-ht5" x={FIVE_HA} y={-1.4} textAnchor="end">5 ha</text>
        <text className="hk-ht" x={ONE_HA + 1.6} y={FIVE_HA - ONE_HA + 4.4}>1 ha</text>
        <text className="hk-ht" x={MIN_HA + 1.6} y={FIVE_HA - MIN_HA + 4}>0,3 ha</text>
        <text className="hk-ht hk-hthouse" x={HOUSE + 1.8} y={FIVE_HA - 1.4}>147 m²</text>
      </svg>

      <dl className="hk-herra-key">
        <div><dt>Spildan</dt><dd>allt að 5 hektarar</dd></div>
        <div><dt>Dæmigerð sumarhúsalóð</dt><dd>0,3 til 1 hektari</dd></div>
        <div><dt>Húsið af spildunni</dt><dd>0,3%</dd></div>
      </dl>
    </div>
  )
}

export const HERRAGARDUR_CSS = `
.hk-herra{display:grid;gap:clamp(28px,4vw,64px);align-items:end}
@media (min-width:880px){.hk-herra{grid-template-columns:minmax(0,1fr) minmax(0,.85fr)}}
.hk-herra svg{width:100%;height:auto;overflow:visible}

.hk-herra rect{transform-box:fill-box;transform-origin:bottom left}
.hk-h5{fill:none;stroke:${INK};stroke-width:.55}
.hk-h1{fill:none;stroke:${MUTED};stroke-width:.4;stroke-dasharray:2.2 1.8}
.hk-h03{fill:none;stroke:${MUTED};stroke-width:.4;stroke-dasharray:2.2 1.8}
.hk-hh{fill:${INK};stroke:none}

/* the five hectares grow around the ordinary plot, which is already there */
.hk-herra .hk-h5{transform:scale(.245);opacity:0;
  transition:transform 1.5s cubic-bezier(.17,.84,.44,1),opacity .6s cubic-bezier(.17,.84,.44,1)}
.hk-herra.is-in .hk-h5{transform:scale(1);opacity:1}
.hk-herra .hk-h1,.hk-herra .hk-h03,.hk-herra .hk-hh{opacity:0;transition:opacity .7s cubic-bezier(.17,.84,.44,1)}
.hk-herra.is-in .hk-h1{opacity:1;transition-delay:.15s}
.hk-herra.is-in .hk-h03{opacity:1;transition-delay:.28s}
.hk-herra.is-in .hk-hh{opacity:1;transition-delay:1.05s}

/* SVG user units, so the rendered size is this times (width / 108). At a
   354px-wide phone that is ~3.3x, so 3.1 renders near 10px — too small.
   Bumped on narrow viewports where the scale factor is lowest. */
.hk-ht{font-size:3.1px;fill:${MUTED};letter-spacing:.02em}
.hk-ht5{fill:${INK};font-size:3.6px}
@media (max-width:700px){
  .hk-ht{font-size:4.4px}
  .hk-ht5{font-size:5px}
}
.hk-hthouse{fill:${INK}}
.hk-herra text{opacity:0;transition:opacity .7s cubic-bezier(.17,.84,.44,1) .9s}
.hk-herra.is-in text{opacity:1}

.hk-herra-key{margin:0;display:grid;gap:0;border-top:1px solid ${RULE}}
.hk-herra-key>div{display:flex;justify-content:space-between;gap:1.4rem;align-items:baseline;
  padding-block:clamp(12px,1.4vw,18px);border-bottom:1px solid ${RULE}}
.hk-herra-key dt{margin:0;color:${MUTED};font-size:clamp(.86rem,1.05vw,1rem)}
.hk-herra-key dd{margin:0;font-size:clamp(1.05rem,2vw,1.6rem);letter-spacing:-.02em;text-align:right}
@media (prefers-reduced-motion:reduce){
  .hk-herra .hk-h5,.hk-herra .hk-h1,.hk-herra .hk-h03,.hk-herra .hk-hh,.hk-herra text{
    opacity:1!important;transform:none!important;transition:none!important}
}
`
