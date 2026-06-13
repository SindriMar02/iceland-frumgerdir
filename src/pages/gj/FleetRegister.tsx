import { useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '../../components/Reveal'
import { FLEET } from './data'

const PLOTTER = [0.65, 0, 0.35, 1] as const

/** Hand-drawn side elevations, one array of stroke paths per registration. */
const BLUEPRINTS: Record<string, string[]> = {
  'GJ-63': [
    'M32 38 H316 Q334 38 334 56 V102 Q334 110 326 110 H32 Q26 110 26 102 V46 Q26 38 32 38 Z',
    'M36 48 H314 V74 H36 Z',
    'M66 48 V74 M96 48 V74 M126 48 V74 M156 48 V74 M186 48 V74 M216 48 V74 M246 48 V74 M276 48 V74',
    'M296 108 V78 H322 V108',
    'M26 90 H334',
    'M69 112 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0',
    'M257 112 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0',
    'M78 112 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0',
    'M266 112 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0',
    'M334 52 L344 46',
  ],
  'GJ-4X': [
    'M52 30 H294 Q312 30 312 48 V92 H52 Q44 92 44 84 V38 Q44 30 52 30 Z',
    'M58 40 H296 V64 H58 Z',
    'M92 40 V64 M126 40 V64 M160 40 V64 M194 40 V64 M228 40 V64 M262 40 V64',
    'M44 78 H312',
    'M52 30 V16 H62',
    'M79 107 a19 19 0 1 0 38 0 a19 19 0 1 0 -38 0',
    'M237 107 a19 19 0 1 0 38 0 a19 19 0 1 0 -38 0',
    'M91 107 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0',
    'M249 107 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0',
    'M324 92 V126 M320 92 H328 M320 126 H328',
  ],
  'GJ-19': [
    'M100 46 H242 Q262 46 264 66 V98 Q264 104 256 104 H100 Q94 104 94 96 V54 Q94 46 100 46 Z',
    'M102 54 H250 V76 H102 Z',
    'M132 54 V76 M162 54 V76 M192 54 V76 M222 54 V76',
    'M94 90 H264',
    'M118 114 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0',
    'M216 114 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0',
    'M125 114 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',
    'M223 114 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',
  ],
  'GJ-SJ': [
    'M118 88 V70 Q118 62 126 62 H146 L158 42 H212 Q228 42 230 58 V88 Z',
    'M162 48 H208 V60 H162 Z',
    'M118 76 H230',
    'M131 105 a21 21 0 1 0 42 0 a21 21 0 1 0 -42 0',
    'M191 105 a21 21 0 1 0 42 0 a21 21 0 1 0 -42 0',
    'M144 105 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0',
    'M204 105 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0',
    'M230 70 H240 V80',
  ],
  'GJ-62': [
    'M84 44 Q84 30 102 30 H250 Q272 30 276 48 V96 Q276 104 268 104 H92 Q84 104 84 96 Z',
    'M96 42 H120 V62 H96 Z',
    'M130 42 H154 V62 H130 Z',
    'M164 42 H188 V62 H164 Z',
    'M198 42 H222 V62 H198 Z',
    'M232 42 H256 V62 H232 Z',
    'M84 80 H276',
    'M108 104 a17 17 0 0 1 34 0',
    'M220 104 a17 17 0 0 1 34 0',
    'M112 112 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0',
    'M224 112 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0',
  ],
}

const MAX_LENGTH_M = 15

/**
 * SHEET IV — REGISTER OF ASSETS. The fleet as an auditable register: original
 * blueprint line-art that draws itself, a spec table, and an honest scale
 * bar. No stock coach photography — engineering drawing as art direction.
 */
export function FleetRegister() {
  const reduce = useReducedMotion()
  const [selected, setSelected] = useState(0)
  const v = FLEET[selected]
  const paths = BLUEPRINTS[v.reg]
  const strokeColor = v.vermilion ? 'var(--color-gj-vermilion)' : 'var(--color-gj-ink)'

  const onTablistKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = (selected + dir + FLEET.length) % FLEET.length
    setSelected(next)
    document.getElementById(`fleet-tab-${FLEET[next].reg}`)?.focus()
  }

  return (
    <section id="fleet" aria-labelledby="fleet-h" className="bg-gj-paper2 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-grotesk text-[11px] font-medium tracking-[0.22em] text-gj-lichen uppercase">
            Sheet IV — Register of Assets
          </p>
          <h2 id="fleet-h" className="mt-3 max-w-2xl font-survey text-4xl text-gj-ink text-balance md:text-6xl">
            The machines that read the rivers
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gj-ink/70 md:text-base">
            An owned fleet, maintained by GJ’s own mechanics — from 63-seat tourers to
            high-clearance highland coaches. Drawn here to scale, as the workshop drew them.
          </p>
        </Reveal>

        {/* Registration tabs */}
        <div
          role="tablist"
          aria-label="Fleet register"
          onKeyDown={onTablistKey}
          className="mt-10 flex flex-wrap gap-2"
        >
          {FLEET.map((f, i) => {
            const isActive = i === selected
            return (
              <button
                key={f.reg}
                id={`fleet-tab-${f.reg}`}
                role="tab"
                aria-selected={isActive}
                aria-controls="fleet-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setSelected(i)}
                className={`border px-4 py-2.5 font-grotesk text-xs font-semibold tracking-[0.14em] uppercase transition-colors duration-300 tabular-nums focus-visible:outline-gj-ink ${
                  isActive
                    ? f.vermilion
                      ? 'border-gj-vermilion bg-gj-vermilion text-white'
                      : 'border-gj-ink bg-gj-ink text-gj-paper'
                    : 'border-gj-ink/30 text-gj-ink/70 hover:border-gj-ink hover:text-gj-ink'
                }`}
              >
                {f.reg}
              </button>
            )
          })}
        </div>

        <div
          id="fleet-panel"
          role="tabpanel"
          aria-labelledby={`fleet-tab-${v.reg}`}
          tabIndex={0}
          className="mt-8 grid gap-8 focus-visible:outline-gj-ink lg:grid-cols-5 lg:gap-12"
        >
          {/* Blueprint plate */}
          <div className="border border-gj-ink/25 bg-gj-paper p-4 lg:col-span-3">
            <div className="flex items-center justify-between border-b border-gj-ink/15 pb-2 font-grotesk text-[10px] tracking-[0.22em] text-gj-lichen uppercase">
              <span>
                Drawing {v.reg} · {v.name}
              </span>
              <span className="tabular-nums">Scale 1 : 50</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.svg
                key={v.reg}
                viewBox="0 0 360 150"
                className="mt-3 w-full"
                aria-hidden
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
              >
                {/* grid */}
                {[30, 60, 90, 120].map((y) => (
                  <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="var(--color-gj-ink)" strokeOpacity="0.06" />
                ))}
                {[60, 120, 180, 240, 300].map((x) => (
                  <line key={x} x1={x} y1="0" x2={x} y2="150" stroke="var(--color-gj-ink)" strokeOpacity="0.06" />
                ))}
                {/* ground line */}
                <line x1="14" y1="126" x2="346" y2="126" stroke="var(--color-gj-ink)" strokeOpacity="0.35" strokeDasharray="6 4" />
                {/* vehicle */}
                {paths.map((d, i) => (
                  <motion.path
                    key={d}
                    d={d}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : i * 0.07, ease: PLOTTER }}
                  />
                ))}
                {/* dimension leader */}
                <motion.g
                  initial={{ opacity: reduce ? 1 : 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduce ? 0 : paths.length * 0.07 + 0.3, duration: 0.4 }}
                >
                  <line x1="26" y1="142" x2="334" y2="142" stroke="var(--color-gj-cobalt)" strokeWidth="1" />
                  <line x1="26" y1="137" x2="26" y2="147" stroke="var(--color-gj-cobalt)" strokeWidth="1" />
                  <line x1="334" y1="137" x2="334" y2="147" stroke="var(--color-gj-cobalt)" strokeWidth="1" />
                  <rect x="150" y="134" width="60" height="16" fill="var(--color-gj-paper)" />
                  <text x="180" y="146" textAnchor="middle" fontSize="10" fontFamily="Space Grotesk" letterSpacing="2" fill="var(--color-gj-cobalt)">
                    {v.lengthM.toFixed(1)} M
                  </text>
                </motion.g>
              </motion.svg>
            </AnimatePresence>

            {/* Honest scale bar */}
            <div className="mt-2 border-t border-gj-ink/15 pt-3" aria-hidden>
              <div className="flex items-center justify-between font-grotesk text-[10px] tracking-[0.22em] text-gj-lichen uppercase">
                <span>Relative length</span>
                <span className="tabular-nums">0 — {MAX_LENGTH_M} m</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full bg-gj-ink/10">
                <motion.div
                  className={v.vermilion ? 'h-full bg-gj-vermilion' : 'h-full bg-gj-cobalt'}
                  animate={{ width: `${(v.lengthM / MAX_LENGTH_M) * 100}%` }}
                  transition={{ duration: reduce ? 0 : 0.6, ease: PLOTTER }}
                />
              </div>
            </div>
          </div>

          {/* Spec register */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={v.reg}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-survey text-3xl text-gj-ink md:text-4xl">{v.name}</h3>
                <p className={`mt-1 font-grotesk text-xs font-medium tracking-[0.18em] uppercase ${v.vermilion ? 'text-gj-vermilion' : 'text-gj-cobalt'}`}>
                  {v.type}
                </p>
                <dl className="mt-6 space-y-0">
                  {(
                    [
                      ['Registration', v.reg],
                      ['Seats', v.seats],
                      ['Drivetrain', v.drive],
                      ['Ground clearance', v.clearance],
                      ['Commissioned', v.commissioned],
                      ['Assignment', v.role],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-6 border-t border-gj-ink/15 py-2.5 text-sm">
                      <dt className="font-grotesk text-xs font-medium tracking-[0.14em] text-gj-lichen uppercase">{label}</dt>
                      <dd className="text-right text-gj-ink/85 tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>
                {v.vermilion && (
                  <p className="mt-5 border-l-2 border-gj-vermilion pl-4 font-survey text-lg text-gj-ink/80 italic">
                    The coach that started the modern fleet — kept running, kept red.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
