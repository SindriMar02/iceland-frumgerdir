import { ArchFrame } from './ArchFrame'

/**
 * THE ASYMMETRIC PAIR — device 3 of the Amour Liquide transplant.
 * grid-template-columns: 72% 28%; the narrow column is a tall pill
 * (border-radius: 400px 400px 0 0) with a negative margin-left so it kisses
 * the big arch frame. Collapses to a single column under 768px.
 */
export function FramePair({
  big,
  pill,
}: {
  big: { src: string; alt: string; caption?: string }
  pill: { src: string; alt: string }
}) {
  return (
    <div className="hh-pair">
      <ArchFrame src={big.src} alt={big.alt} caption={big.caption} aspect="16 / 11" />
      <div className="hh-pair__pill" aria-hidden={false}>
        <img src={pill.src} alt={pill.alt} loading="lazy" />
      </div>
    </div>
  )
}
