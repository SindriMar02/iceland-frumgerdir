import { MARK_COLOURS, MARK_FACES, MARK_IN_LOGO, WORD_COLOUR, WORD_PATH } from './logo-paths'

/* the mark alone: three faces, each its own <path> with data-f so the loader can move them one by one */
export function Mark({ size = 120, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} viewBox="40 58 432 388" width={size} height={Math.round(size * 388 / 432)} aria-hidden="true" focusable="false">
      {(['red', 'amber', 'brown'] as const).map((k) => <path key={k} data-f={k} d={MARK_FACES[k]} fill={MARK_COLOURS[k]} />)}
    </svg>
  )
}

/* the wordmark alone, for the loader (the mark animates above it) */
export function Wordmark({ width = 200, colour = WORD_COLOUR, className }: { width?: number; colour?: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 856 203" width={width} height={Math.round(width * 203 / 856)} aria-hidden="true" focusable="false">
      <path d={WORD_PATH} fill={colour} />
    </svg>
  )
}

/* the wordmark split at the mark: "Umbúða" left of it, "gerðin" right of it, so the loader can close the name around the box */
const WORD_HALVES = (() => {
  const subs = WORD_PATH.split(/(?=M)/).filter(Boolean)
  const x0 = (d: string) => parseFloat(d.slice(1))
  return { left: subs.filter((d) => x0(d) < 400).join(''), right: subs.filter((d) => x0(d) >= 400).join('') }
})()

/* the full logo: the wordmark path with the mark set exactly where the PNG has it.
   `parts` renders the word in two halves (data-w="l" / data-w="r") and the faces with data-f, for the loader. */
export function Logo({ height = 24, colour = WORD_COLOUR, className, title = 'Umbúðagerðin', parts = false }: { height?: number; colour?: string; className?: string; title?: string; parts?: boolean }) {
  const { tx, ty, s } = MARK_IN_LOGO
  return (
    <svg className={className} viewBox="0 0 856 203" height={height} width={Math.round(height * 856 / 203)} role="img" aria-label={title}>
      {parts ? <><path data-w="l" d={WORD_HALVES.left} fill={colour} /><path data-w="r" d={WORD_HALVES.right} fill={colour} /></> : <path d={WORD_PATH} fill={colour} />}
      <g transform={`translate(${tx} ${ty}) scale(${s})`}>
        {(['red', 'amber', 'brown'] as const).map((k) => <path key={k} data-f={k} d={MARK_FACES[k]} fill={MARK_COLOURS[k]} />)}
      </g>
    </svg>
  )
}
