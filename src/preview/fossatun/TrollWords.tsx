/**
 * THE SIGNATURE — "Tröllastafir".
 *
 * This is not an invented flourish. There is a real installation standing in
 * the Trollgarden at Fossatún: carved wooden letter drums on two spindles that
 * visitors turn by hand to spell troll words (see
 * public/fossatun/img/troll-garden-artwork.jpg). This component is the digital
 * echo of that object, and it is the one memorable interaction on the page.
 *
 * It is a TOY, not a scroll effect: it does nothing until a person touches it,
 * which is the whole point. Drag, click, or use the arrow keys on a drum.
 * Under prefers-reduced-motion it renders as a plain, correct word.
 */

import { useEffect, useRef, useState } from 'react'

const ALPHABET = 'AÁBDÐEÉFGHIÍJKLMNOÓPRSTUÚVXYÝÞÆÖ'.split('')

/** The word the drums settle on when solved, and the tease they start from. */
const TARGET = 'TRÖLL'

function letterAt(i: number, offset: number) {
  const n = ALPHABET.length
  return ALPHABET[(((i + offset) % n) + n) % n]
}

function Drum({
  index,
  solvedChar,
  reduced,
}: {
  index: number
  solvedChar: string
  reduced: boolean
}) {
  const solvedIdx = Math.max(0, ALPHABET.indexOf(solvedChar))
  // Start scrambled by a per-drum amount so the row reads as a puzzle.
  const [offset, setOffset] = useState(() => (reduced ? 0 : (index + 1) * 5 + 3))
  const startY = useRef<number | null>(null)

  if (reduced) {
    return <span className="fst-drum fst-drum--static">{solvedChar}</span>
  }

  const shown = letterAt(solvedIdx, offset)

  return (
    <button
      type="button"
      className="fst-drum"
      data-solved={shown === solvedChar || undefined}
      aria-label={`Stafur ${index + 1}, núna ${shown}. Notaðu upp og niður örvar til að snúa.`}
      onClick={() => setOffset((o) => o + 1)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp') { e.preventDefault(); setOffset((o) => o - 1) }
        if (e.key === 'ArrowDown') { e.preventDefault(); setOffset((o) => o + 1) }
      }}
      onPointerDown={(e) => { startY.current = e.clientY; (e.target as HTMLElement).setPointerCapture(e.pointerId) }}
      onPointerMove={(e) => {
        if (startY.current === null) return
        const dy = e.clientY - startY.current
        if (Math.abs(dy) > 22) {
          setOffset((o) => o + (dy > 0 ? 1 : -1))
          startY.current = e.clientY
        }
      }}
      onPointerUp={() => { startY.current = null }}
    >
      <span className="fst-drum__face">{shown}</span>
    </button>
  )
}

export function TrollWords() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    setReduced(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true)
  }, [])

  return (
    <div className="fst-drums" role="group" aria-label="Tröllastafir, snúanlegir stafir eins og í Tröllagarðinum">
      {TARGET.split('').map((c, i) => (
        <Drum key={i} index={i} solvedChar={c} reduced={reduced} />
      ))}
    </div>
  )
}
