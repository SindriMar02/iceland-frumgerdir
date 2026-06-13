import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { COMPANIES, SCORE_DIMENSIONS } from './data'

const EASE = [0.22, 1, 0.36, 1] as const

/* Map model space (0–100 each axis) into the 0..1 plot box. */
const px = (x: number) => 0.08 + (x / 100) * 0.84
const py = (y: number) => 0.92 - (y / 100) * 0.84

/**
 * COMPARATIVE INSIGHTS — an animated market map plotting digital maturity
 * against latent strength, with the top-left "opportunity zone" called out;
 * plus a scorecard matrix of all five across the thesis dimensions.
 */
export function FimmMatrix() {
  const reduce = useReducedMotion()
  const [hover, setHover] = useState<string | null>(null)

  return (
    <section
      id="opportunity"
      aria-labelledby="opp-h"
      className="border-t border-white/8 bg-fimm-panel/40 px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] tracking-[0.3em] text-fimm-low uppercase">03 — The Opportunity</p>
        <h2 id="opp-h" className="mt-3 max-w-3xl font-grotesk text-4xl font-semibold tracking-tight text-fimm-hi text-balance md:text-5xl">
          High demand, low digital maturity — the same quadrant, five times
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-fimm-mid">
          Plot each business by how modern its web presence is against how much latent pull it already has.
          They cluster in one corner: proven demand, almost no digital expression. That corner is the work.
        </p>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Market map */}
          <figure className="rounded-2xl border border-white/10 bg-fimm-bg p-4 md:p-6">
            <div className="relative aspect-square w-full">
              <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" role="img" aria-label="Market map: all five companies sit in the high-demand, low-digital-maturity quadrant.">
                {/* opportunity zone */}
                <motion.rect
                  x={px(0) * 100}
                  y={py(100) * 100}
                  width={(px(45) - px(0)) * 100}
                  height={(py(60) - py(100)) * 100}
                  fill="var(--color-fimm-signal)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.08 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                />
                {/* grid */}
                {[0.08, 0.5, 0.92].map((g) => (
                  <g key={g}>
                    <line x1={g * 100} y1="6" x2={g * 100} y2="94" stroke="white" strokeOpacity="0.06" strokeWidth="0.3" />
                    <line x1="6" y1={g * 100} x2="94" y2={g * 100} stroke="white" strokeOpacity="0.06" strokeWidth="0.3" />
                  </g>
                ))}
                {/* points — label only the hovered one (names live in the scorecard) */}
                {COMPANIES.map((c, i) => {
                  const cx = px(c.map.x) * 100
                  const cy = py(c.map.y) * 100
                  const on = hover === c.id
                  return (
                    <motion.circle
                      key={c.id}
                      cx={cx}
                      cy={cy}
                      r={on ? 2.4 : 1.7}
                      fill={c.accent}
                      initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: reduce ? 0 : 0.3 + i * 0.12, ease: EASE }}
                      onMouseEnter={() => setHover(c.id)}
                      onMouseLeave={() => setHover(null)}
                      style={{ cursor: 'default' }}
                    />
                  )
                })}
                {/* hovered halo + label chip, drawn last so it sits on top */}
                {COMPANIES.filter((c) => c.id === hover).map((c) => {
                  const cx = px(c.map.x) * 100
                  const cy = py(c.map.y) * 100
                  const label = c.name.replace('Rjómabúið ', '')
                  const right = cx < 60
                  // generous monospace advance estimate so labels never spill
                  const chipW = label.length * 2.05 + 2.5
                  return (
                    <g key={`lbl-${c.id}`} style={{ pointerEvents: 'none' }}>
                      <circle cx={cx} cy={cy} r="5.5" fill={c.accent} opacity="0.18" />
                      <rect
                        x={right ? cx + 3.5 : cx - 3.5 - chipW}
                        y={cy - 2.7}
                        width={chipW}
                        height="5.4"
                        rx="1"
                        fill="var(--color-fimm-bg)"
                        opacity="0.88"
                      />
                      <text
                        x={right ? cx + 4.8 : cx - 4.8}
                        y={cy + 1.3}
                        fontSize="3.2"
                        fontFamily="'Space Mono', ui-monospace, monospace"
                        textAnchor={right ? 'start' : 'end'}
                        fill={c.accent}
                      >
                        {label}
                      </text>
                    </g>
                  )
                })}
              </svg>
              {/* axis labels */}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.2em] text-fimm-low uppercase">
                Digital maturity →
              </span>
              <span className="absolute top-1/2 left-1 -translate-y-1/2 -rotate-90 font-mono text-[9px] tracking-[0.2em] text-fimm-low uppercase">
                Latent strength →
              </span>
            </div>
            <figcaption className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-fimm-low uppercase">
              <span className="inline-block h-2 w-3 rounded-sm bg-fimm-signal/20" />
              Opportunity zone · concept estimate
            </figcaption>
          </figure>

          {/* Scorecard */}
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Opportunity scorecard across thesis dimensions (concept estimates, 0–100)</caption>
                <thead>
                  <tr className="border-b border-white/10">
                    <th scope="col" className="py-3 pr-3 font-mono text-[10px] tracking-[0.16em] text-fimm-low uppercase">
                      Company
                    </th>
                    {SCORE_DIMENSIONS.map((d) => (
                      <th key={d.key} scope="col" className="px-2 py-3 text-right font-mono text-[10px] tracking-[0.14em] text-fimm-low uppercase">
                        {d.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPANIES.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-white/8 transition-colors hover:bg-white/[0.03]"
                      onMouseEnter={() => setHover(c.id)}
                      onMouseLeave={() => setHover(null)}
                    >
                      <th scope="row" className="py-3 pr-3 text-sm font-medium text-fimm-hi">
                        <span className="flex items-center gap-2">
                          <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: c.accent }} />
                          {c.name.replace('Rjómabúið ', '')}
                        </span>
                      </th>
                      {SCORE_DIMENSIONS.map((d) => (
                        <td key={d.key} className="px-2 py-3 text-right font-mono text-sm text-fimm-mid tabular-nums">
                          {c.scores[d.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.1em] text-fimm-low uppercase">
              Scores are the studio’s concept estimates, not measured data — a way to compare, not a valuation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
