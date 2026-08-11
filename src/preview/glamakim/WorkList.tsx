import { useEffect, useRef, useState } from 'react'
import { IMG, PROJECTS } from './data'

/* ═════════════════════════════════════════════════════════════════════════
   Verkin — a typeset list with a cursor-following photograph.

   The Heklusýn build's HouseList, carried across device-for-device and
   re-prefixed gk-. Copied rather than imported: repo law is zero code bleed
   between page folders.

   Originally vendored from 21st.dev "Project Showcase" by @jatin-yadav05
   (https://21st.dev/@jatin-yadav05/components/project-showcase), adapted:

     · The original lerps the preview position by calling a React state
       setter inside requestAnimationFrame — a re-render every frame. The
       lerp here writes straight to the node's transform via a ref and React
       never re-renders during pointer movement.
     · shadcn tokens swapped for this page's paper-and-ink palette.
     · A real <ul> of links, so it is keyboard reachable and reads linearly
       to a screen reader; the floating preview is decorative and aria-hidden.
     · Coarse pointer and reduced-motion get no floating preview at all —
       each row shows its own thumbnail inline instead, so a phone still sees
       every building.

   Why a list and not a grid: seven names set large read as a practice with a
   position. Seven tiles read as a thin grid of stock photos.
   ═════════════════════════════════════════════════════════════════════════ */

const INK = '#111111'
const MUTED = '#767676'
const RULE = '#e2e2e2'

export function WorkList() {
  const [hover, setHover] = useState<number | null>(null)
  const [fine, setFine] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const raf = useRef(0)

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setFine(canHover && !reduced)
  }, [])

  useEffect(() => {
    if (!fine) return
    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.14
      current.current.y += (target.current.y - current.current.y) * 0.14
      const el = previewRef.current
      if (el) el.style.transform = `translate3d(${current.current.x + 24}px, ${current.current.y - 110}px, 0)`
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [fine])

  const onMove = (e: React.MouseEvent) => {
    const box = wrapRef.current?.getBoundingClientRect()
    if (!box) return
    target.current = { x: e.clientX - box.left, y: e.clientY - box.top }
  }

  return (
    <div ref={wrapRef} onMouseMove={fine ? onMove : undefined} style={{ position: 'relative' }}>
      {fine ? (
        <div
          ref={previewRef}
          aria-hidden
          className="gk-preview"
          style={{ opacity: hover === null ? 0 : 1, scale: hover === null ? '0.86' : '1' }}
        >
          {PROJECTS.map((p, i) => (
            <img
              key={p.key} src={IMG(p.image)} alt="" loading="lazy" decoding="async"
              style={{
                opacity: hover === i ? 1 : 0,
                transform: hover === i ? 'scale(1)' : 'scale(1.08)',
                filter: hover === i ? 'none' : 'blur(8px)',
              }}
            />
          ))}
        </div>
      ) : null}

      <ul className="gk-wlist">
        {PROJECTS.map((p, i) => (
          <li key={p.key}>
            <a
              href="#gk-enquiry"
              className="gk-wrow"
              onMouseEnter={fine ? () => setHover(i) : undefined}
              onMouseLeave={fine ? () => setHover(null) : undefined}
              onFocus={fine ? () => setHover(i) : undefined}
              onBlur={fine ? () => setHover(null) : undefined}
            >
              {!fine ? (
                <span className="gk-wthumb">
                  <img src={IMG(p.image)} alt={p.alt} loading="lazy" decoding="async" />
                </span>
              ) : null}
              <span className="gk-wnum" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              <span className="gk-wname">{p.name}</span>
              {/* Only some projects publish a year or a size. Joining on a
                  separator unconditionally would print a bare " · " on the
                  ones that publish neither — build from what exists. */}
              <span className="gk-wmeta">
                {[p.place, p.year, p.size, p.status].filter(Boolean).join(' · ')}
              </span>
              <span className="gk-wstate">{p.tag}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const WORK_LIST_CSS = `
.gk-preview{position:absolute;left:0;top:0;z-index:30;pointer-events:none;width:300px;height:200px;
  overflow:hidden;background:${RULE};transition:opacity .34s cubic-bezier(.17,.84,.44,1),scale .34s cubic-bezier(.17,.84,.44,1)}
.gk-preview img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  transition:opacity .45s cubic-bezier(.17,.84,.44,1),transform .6s cubic-bezier(.17,.84,.44,1),filter .45s cubic-bezier(.17,.84,.44,1)}

.gk-wlist{list-style:none;margin:0;padding:0;border-top:1px solid ${RULE}}
.gk-wrow{display:grid;grid-template-columns:1fr auto;gap:.4rem 1.5rem;align-items:baseline;
  padding-block:clamp(16px,2vw,26px);border-bottom:1px solid ${RULE};text-decoration:none;color:${INK};
  position:relative;transition:padding-left .4s cubic-bezier(.17,.84,.44,1)}
@media (hover:hover) and (pointer:fine){.gk-wrow:hover{padding-left:.9rem}}
/* One step down from Heklusýn's 4.2vw ceiling: "Endurhæfingarmiðstöð SÁÁ, Vík"
   is 27 characters where the longest house name is 15, and at the larger
   clamp it wrapped to three lines on every viewport under ~1200px. */
.gk-wnum{grid-column:1;color:#767676;font-size:clamp(.78rem,.9vw,.92rem);letter-spacing:.14em}
.gk-wname{font-size:clamp(1.3rem,3.3vw,2.7rem);letter-spacing:-.026em;line-height:1.04;grid-column:1}
.gk-wmeta{grid-column:1;color:${MUTED};font-size:clamp(.86rem,1.05vw,1rem)}
.gk-wstate{grid-column:2;grid-row:1/3;text-align:right;color:${MUTED};font-size:clamp(.9rem,1.15vw,1.06rem);white-space:nowrap}
.gk-wrow:focus-visible{outline:2px solid ${INK};outline-offset:4px}

/* coarse pointer / reduced motion: every row carries its own image */
.gk-wthumb{grid-column:1;grid-row:1;display:block;position:relative;width:100%;aspect-ratio:3/2;
  overflow:hidden;margin-bottom:.9rem}
.gk-wthumb img{width:100%;height:100%;object-fit:cover}
@media (prefers-reduced-motion:reduce){.gk-preview{display:none}}

/* Phones get ONE column. The 1fr/auto split is right on desktop, where the
   kind sits opposite the name on the same baseline, but on a 390px screen
   that second column is sized by the longest label ("Þjónusta og hjúkrun")
   and takes its width out of the first — which is where the thumbnail
   lives. Measured at 390px: every photograph was squeezed to 296px of a
   354px row, with the label stranded alongside the middle of the image and
   a ragged gutter down the right. Stacking fixes the photographs and puts
   the kind where it reads as a tag on the work rather than a second column
   of the page. */
@media (max-width:759px){
  .gk-wrow{grid-template-columns:1fr;gap:0}
  .gk-wthumb{margin-bottom:1rem}
  .gk-wname,.gk-wmeta{grid-column:1}
  .gk-wstate{grid-column:1;grid-row:auto;text-align:left;margin-top:.5rem;
    font-size:11px;letter-spacing:.14em;text-transform:uppercase}
}
`
