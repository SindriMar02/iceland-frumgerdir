import { useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '../../components/Reveal'
import { ICELAND_OUTLINE, MAP_GRATICULE, ROUTES } from './data'

const PLOTTER = [0.65, 0, 0.35, 1] as const

/**
 * SHEET III — THE ATLAS. An interactive survey plate of Iceland: choosing a
 * route plots its line (pathLength), pops its waypoints and redraws the
 * elevation profile. The route list is a keyboard tablist; the day-by-day
 * card is the accessible source of truth — the map is decoration.
 */
export function RouteAtlas() {
  const reduce = useReducedMotion()
  const [selected, setSelected] = useState(0)
  const route = ROUTES[selected]

  const onTablistKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1
    const next = (selected + dir + ROUTES.length) % ROUTES.length
    setSelected(next)
    document.getElementById(`route-tab-${ROUTES[next].id}`)?.focus()
  }

  return (
    <section id="atlas" aria-labelledby="atlas-h" className="bg-gj-paper px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-grotesk text-[11px] font-medium tracking-[0.22em] text-gj-lichen uppercase">
            Sheet III — The Atlas
          </p>
          <h2 id="atlas-h" className="mt-3 max-w-2xl font-survey text-4xl text-gj-ink text-balance md:text-6xl">
            Choose a line across the country
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gj-ink/70 md:text-base">
            Every route below is escorted, all-inclusive of coach, guide and lodging — and every
            kilometre of it has been driven by this company more times than anyone has counted.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Route list — tablist */}
          <div
            role="tablist"
            aria-label="Survey routes"
            aria-orientation="vertical"
            onKeyDown={onTablistKey}
            className="flex flex-col gap-2 lg:col-span-2"
          >
            {ROUTES.map((r, i) => {
              const isActive = i === selected
              return (
                <button
                  key={r.id}
                  id={`route-tab-${r.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="route-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setSelected(i)}
                  className={`group flex items-baseline justify-between gap-4 border-t px-1 py-4 text-left transition-colors duration-300 focus-visible:outline-gj-ink ${
                    isActive ? 'border-gj-ink' : 'border-gj-ink/20 hover:border-gj-ink/50'
                  }`}
                >
                  <span className="flex items-baseline gap-4">
                    <span
                      className={`font-grotesk text-xs font-medium tracking-[0.18em] tabular-nums ${
                        isActive ? 'text-gj-cobalt' : 'text-gj-lichen'
                      }`}
                    >
                      {r.id}
                    </span>
                    <span
                      className={`font-survey text-2xl md:text-[1.7rem] ${
                        isActive ? 'text-gj-ink' : 'text-gj-ink/55 group-hover:text-gj-ink/80'
                      }`}
                    >
                      {r.name}
                    </span>
                  </span>
                  <span className="shrink-0 font-grotesk text-[11px] tracking-[0.22em] text-gj-lichen uppercase tabular-nums">
                    {r.meta}
                  </span>
                </button>
              )
            })}
            <div className="border-t border-gj-ink/20" />
          </div>

          {/* Map plate + route card */}
          <div className="lg:col-span-3">
            <div className="border border-gj-ink/25 bg-gj-paper2 p-3 md:p-4">
              <div className="flex items-center justify-between border-b border-gj-ink/15 pb-2 font-grotesk text-[10px] tracking-[0.22em] text-gj-lichen uppercase">
                <span>Survey plate · Iceland {route.greenland ? '& Greenland approach' : ''}</span>
                <span className="tabular-nums">1 : 2 500 000</span>
              </div>
              <svg viewBox="0 0 440 300" className="mt-2 w-full" aria-hidden>
                {MAP_GRATICULE.map((d) => (
                  <path key={d} d={d} stroke="var(--color-gj-ink)" strokeOpacity="0.07" strokeWidth="1" fill="none" />
                ))}
                <path
                  d={ICELAND_OUTLINE}
                  fill="var(--color-gj-paper)"
                  stroke="var(--color-gj-ink)"
                  strokeOpacity="0.55"
                  strokeWidth="1.25"
                />
                {route.greenland && (
                  <text
                    x="14"
                    y="282"
                    fontSize="9"
                    fontFamily="Space Grotesk"
                    letterSpacing="1.5"
                    className="fill-gj-lichen"
                  >
                    ← GREENLAND, ACROSS THE DENMARK STRAIT
                  </text>
                )}
                <AnimatePresence mode="wait">
                  <motion.g key={route.id}>
                    <motion.path
                      d={route.path}
                      fill="none"
                      stroke="var(--color-gj-cobalt)"
                      strokeWidth="2"
                      strokeDasharray={route.greenland ? '5 4' : undefined}
                      initial={{ pathLength: reduce ? 1 : 0, opacity: 1 }}
                      animate={{ pathLength: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      transition={{ duration: reduce ? 0 : 1.1, ease: PLOTTER }}
                    />
                    {route.waypoints.map((w, i) => (
                      <motion.g
                        key={w.label}
                        initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        transition={{ delay: reduce ? 0 : 0.25 + i * 0.18, duration: 0.3 }}
                      >
                        <circle cx={w.x} cy={w.y} r="3.5" fill="var(--color-gj-paper)" stroke="var(--color-gj-cobalt)" strokeWidth="1.5" />
                        <text
                          x={w.x + 7}
                          y={w.y + 3}
                          fontSize="9"
                          fontFamily="Space Grotesk"
                          letterSpacing="1"
                          className="fill-gj-ink"
                          opacity="0.75"
                        >
                          {w.label.toUpperCase()}
                        </text>
                      </motion.g>
                    ))}
                  </motion.g>
                </AnimatePresence>
              </svg>

              {/* Elevation profile */}
              <div className="mt-1 border-t border-gj-ink/15 pt-3">
                <div className="flex items-center justify-between font-grotesk text-[10px] tracking-[0.22em] text-gj-lichen uppercase">
                  <span>Elevation profile</span>
                  <span className="tabular-nums">max {route.maxElevation}</span>
                </div>
                <svg viewBox="0 0 300 56" className="mt-1 h-12 w-full" aria-hidden preserveAspectRatio="none">
                  <line x1="0" y1="50" x2="300" y2="50" stroke="var(--color-gj-ink)" strokeOpacity="0.2" strokeWidth="1" />
                  <AnimatePresence mode="wait">
                    <motion.polyline
                      key={route.id}
                      points={route.elevation}
                      fill="none"
                      stroke="var(--color-gj-cobalt)"
                      strokeWidth="1.5"
                      initial={{ pathLength: reduce ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      transition={{ duration: reduce ? 0 : 0.9, ease: PLOTTER }}
                    />
                  </AnimatePresence>
                </svg>
              </div>
            </div>

            {/* Route card — the accessible source of truth */}
            <div id="route-panel" role="tabpanel" aria-labelledby={`route-tab-${route.id}`} className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-survey text-3xl text-gj-ink">{route.name}</h3>
                    <p className="font-grotesk text-xs font-medium tracking-[0.16em] text-gj-lichen uppercase tabular-nums">
                      {route.season} · {route.priceFrom}
                    </p>
                  </div>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gj-ink/70">{route.desc}</p>
                  <ul className="mt-5 space-y-2.5">
                    {route.days.map((d) => (
                      <li key={d.label} className="flex gap-4 border-t border-gj-ink/15 pt-2.5 text-sm">
                        <span className="w-20 shrink-0 font-grotesk text-xs font-medium tracking-[0.14em] text-gj-cobalt uppercase tabular-nums">
                          {d.label}
                        </span>
                        <span className="text-gj-ink/75">{d.detail}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#book"
                    className="mt-6 inline-flex items-center gap-2 font-grotesk text-sm font-semibold text-gj-ink underline decoration-gj-cobalt decoration-2 underline-offset-4 transition-colors hover:text-gj-cobalt"
                  >
                    Enquire about {route.id}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
