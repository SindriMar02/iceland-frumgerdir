import { useEffect, useRef, useState } from 'react'
import { IMG, HOUSES, STATUS_LABEL } from './data'

/* ═════════════════════════════════════════════════════════════════════════
   Húsin — a typeset list with a cursor-following photograph.

   Vendored from 21st.dev "Project Showcase" by @jatin-yadav05
   (https://21st.dev/@jatin-yadav05/components/project-showcase), adapted:

     · The original lerps the preview position by calling a React state
       setter inside requestAnimationFrame — a re-render every frame. That
       is the same anti-pattern that wedged this page's own scroll loop, so
       the lerp here writes straight to the node's transform via a ref and
       React never re-renders during pointer movement.
     · shadcn tokens (bg-secondary / text-foreground / border-border) swapped
       for this page's paper-and-ink palette; every class prefixed hk-.
     · Rebuilt as a real <ul> of links so it is keyboard reachable and reads
       linearly to a screen reader; the preview is decorative and aria-hidden.
     · Coarse pointer and reduced-motion get no floating preview at all —
       each row shows its own thumbnail inline instead, so a phone still
       sees every house.

   Why a list and not the reference's grid: only five houses will ever
   exist. Five tiles read as a thin grid; five names set large read as the
   scarcity that is the entire proposition.
   ═════════════════════════════════════════════════════════════════════════ */

const INK = '#111111'
const MUTED = '#767676'
const RULE = '#e2e2e2'

export interface HouseShot { file: string; alt: string; chip?: string }

export function HouseList({ shots }: { shots: HouseShot[] }) {
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
          className="hk-preview"
          style={{ opacity: hover === null ? 0 : 1, scale: hover === null ? '0.86' : '1' }}
        >
          {shots.map((s, i) => (
            <img
              key={s.file} src={IMG(s.file)} alt="" loading="lazy" decoding="async"
              style={{
                opacity: hover === i ? 1 : 0,
                transform: hover === i ? 'scale(1)' : 'scale(1.08)',
                filter: hover === i ? 'none' : 'blur(8px)',
              }}
            />
          ))}
        </div>
      ) : null}

      <ul className="hk-hlist">
        {HOUSES.map((h, i) => {
          const shot = shots[i]
          return (
            <li key={h.name}>
              <a
                href="#hk-enquiry"
                className="hk-hrow"
                onMouseEnter={fine ? () => setHover(i) : undefined}
                onMouseLeave={fine ? () => setHover(null) : undefined}
                onFocus={fine ? () => setHover(i) : undefined}
                onBlur={fine ? () => setHover(null) : undefined}
              >
                {!fine && shot ? (
                  <span className="hk-hthumb">
                    <img src={IMG(shot.file)} alt={shot.alt} loading="lazy" decoding="async" />
                    {shot.chip ? <span className="hk-chip">{shot.chip}</span> : null}
                  </span>
                ) : null}
                <span className="hk-hname">{h.name}</span>
                {/* Only Rangárslétta 2 and 3 publish a size and plot. Joining
                    on a separator unconditionally printed a bare " · " on the
                    three that publish neither. Build from what exists. */}
                <span className="hk-hmeta">
                  {[h.size, h.plot].filter(Boolean).join(' · ')}
                  {shot?.chip ? (
                    <em className="hk-hvis">{[h.size, h.plot].some(Boolean) ? ' · ' : ''}{shot.chip}</em>
                  ) : null}
                </span>
                <span className="hk-hstate">
                  {h.price ?? h.statuses.map((s) => STATUS_LABEL[s]).join(', ')}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const HOUSE_LIST_CSS = `
.hk-preview{position:absolute;left:0;top:0;z-index:30;pointer-events:none;width:300px;height:200px;
  overflow:hidden;background:${RULE};transition:opacity .34s cubic-bezier(.17,.84,.44,1),scale .34s cubic-bezier(.17,.84,.44,1)}
.hk-preview img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  transition:opacity .45s cubic-bezier(.17,.84,.44,1),transform .6s cubic-bezier(.17,.84,.44,1),filter .45s cubic-bezier(.17,.84,.44,1)}

.hk-hlist{list-style:none;margin:0;padding:0;border-top:1px solid ${RULE}}
.hk-hrow{display:grid;grid-template-columns:1fr auto;gap:.4rem 1.5rem;align-items:baseline;
  padding-block:clamp(16px,2vw,26px);border-bottom:1px solid ${RULE};text-decoration:none;color:${INK};
  position:relative;transition:padding-left .4s cubic-bezier(.17,.84,.44,1)}
@media (hover:hover) and (pointer:fine){.hk-hrow:hover{padding-left:.9rem}}
.hk-hname{font-size:clamp(1.5rem,4.2vw,3.4rem);letter-spacing:-.026em;line-height:1.02;grid-column:1}
.hk-hmeta{grid-column:1;color:${MUTED};font-size:clamp(.86rem,1.05vw,1rem)}
.hk-hvis{font-style:normal;text-transform:uppercase;letter-spacing:.1em;font-size:.82em}
.hk-hstate{grid-column:2;grid-row:1/3;text-align:right;color:${MUTED};font-size:clamp(.9rem,1.15vw,1.06rem);white-space:nowrap}
.hk-hrow:focus-visible{outline:2px solid ${INK};outline-offset:4px}

/* coarse pointer / reduced motion: every row carries its own image */
.hk-hthumb{grid-column:1;grid-row:1;display:block;position:relative;width:100%;aspect-ratio:3/2;
  overflow:hidden;margin-bottom:.9rem}
.hk-hthumb img{width:100%;height:100%;object-fit:cover}
@media (prefers-reduced-motion:reduce){.hk-preview{display:none}}
`
