/**
 * THE SIGNATURE — "Tröllastafir".
 *
 * A digital echo of the real installation standing in Fossatún's Trollgarden:
 * carved wooden letter drums on spindles (see
 * public/fossatun/img/troll-garden-artwork.jpg).
 *
 * IT IS DECORATIVE, NOT CUSTOMISABLE, AND THAT IS A HARD REQUIREMENT.
 * The first version let a visitor rotate each drum to any letter. Two problems:
 *   1. SAFETY. Free letter rotation means the row can be arranged into
 *      slurs and obscenities on a client's page. The first build's own
 *      deterministic scramble happened to land on a racial slur. Never ship
 *      a control that lets arbitrary text be assembled from letterforms.
 *   2. It was a toy competing with the booking, which is the page's real job.
 *
 * So the drums now only ever roll to TRÖLL. Each drum owns a DIFFERENT filler
 * reel, so mid-roll the columns cannot align into any readable word, and the
 * only resting state is the intended one. Hover replays the roll. Under
 * prefers-reduced-motion it is plain static text.
 */

import { useEffect, useRef, useState } from 'react'

const TARGET = ['T', 'R', 'Ö', 'L', 'L']

/**
 * One distinct reel per drum, each ending on its target letter. They are
 * deliberately different from one another: a shared reel would mean every
 * column showed the same letter at the same moment, which both looks
 * mechanical and could spell something unintended on the way past.
 */
const REELS = [
  ['Þ', 'Á', 'Ð', 'Ý', 'Ú', 'T'],
  ['Ö', 'Í', 'Æ', 'Þ', 'Ó', 'R'],
  ['Ú', 'Ð', 'Ý', 'Á', 'Í', 'Ö'],
  ['Æ', 'Ó', 'Þ', 'Ö', 'Ð', 'L'],
  ['Í', 'Ý', 'Á', 'Ú', 'Æ', 'L'],
]

export function TrollWords() {
  const [reduced, setReduced] = useState(false)
  const [spinKey, setSpinKey] = useState(0)
  const [armed, setArmed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setReduced(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true)
  }, [])

  // Roll on first sight rather than on load, so the moment is not wasted
  // above the fold where nobody is looking yet.
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { setArmed(true); io.disconnect() }
      }),
      { threshold: 0.4 },
    )
    io.observe(el)
    const failsafe = window.setTimeout(() => { setArmed(true); io.disconnect() }, 2000)
    return () => { io.disconnect(); window.clearTimeout(failsafe) }
  }, [reduced])

  if (reduced) {
    return (
      <div className="fst-drums" aria-label="Tröllastafir">
        {TARGET.map((c, i) => (
          <span className="fst-drum fst-drum--static" key={i} aria-hidden="true">
            <span className="fst-drum__face">{c}</span>
          </span>
        ))}
      </div>
    )
  }

  return (
    <div
      className="fst-drums"
      ref={ref}
      aria-label="Tröllastafir, orðið tröll á snúningskubbum eins og í Tröllagarðinum"
      onMouseEnter={() => setSpinKey((k) => k + 1)}
    >
      {REELS.map((reel, i) => (
        <span className="fst-drum" key={i} aria-hidden="true">
          <span
            key={spinKey}
            className={armed ? 'fst-drum__reel is-rolling' : 'fst-drum__reel'}
            style={{
              // Each drum lands a beat after the one before it.
              animationDelay: `${i * 90}ms`,
              // The reel is translated so its LAST cell is the resting frame.
              ['--fst-reel-len' as string]: reel.length,
            }}
          >
            {reel.map((c, j) => (
              <span className="fst-drum__face" key={j}>{c}</span>
            ))}
          </span>
        </span>
      ))}
    </div>
  )
}
