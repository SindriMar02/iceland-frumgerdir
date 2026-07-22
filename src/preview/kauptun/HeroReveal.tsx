import { motion, useReducedMotion } from 'framer-motion'

/**
 * Vertical Cut Reveal (adapted from 21st.dev #18595 by cnippet.dev) for THIS
 * stack: framer-motion + Tailwind v4, self-hosted, no new deps.
 *
 * Adaptation for the Icelandic-accent risk (brief Part D + ledger #23):
 * the original clips each *character* in a tight overflow-hidden box, which
 * shears the accent off capitals like Í / Á and the eth in "Hjartað". We split
 * by WORDS instead — a word box has far more vertical headroom around a single
 * diacritic — and give each mask generous top/bottom padding plus open leading
 * so nothing hugs the glyph. Falls back to a plain static heading under
 * prefers-reduced-motion (ledger #8): no wrapper spans, no animation.
 */
export function HeroReveal({
  text,
  className,
  delay = 0,
  stagger = 0.09,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
}) {
  const reduced = useReducedMotion()
  const words = text.split(' ')

  if (reduced) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {/* Accessible name — the animated pieces below are decorative. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-flex overflow-hidden pt-[0.2em] pb-[0.1em] leading-[1.08]"
            style={{ marginRight: i === words.length - 1 ? 0 : '0.26em' }}
          >
            <motion.span
              className="inline-block"
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.82,
                delay: delay + i * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  )
}
