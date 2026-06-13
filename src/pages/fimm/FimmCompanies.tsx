import { useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { COMPANIES, SCORE_DIMENSIONS } from './data'

const EASE = [0.22, 1, 0.36, 1] as const

/** A current→potential bar: the filled "current" portion against the ceiling. */
function GapBar({ value, accent, delay }: { value: number; accent: string; delay: number }) {
  const reduce = useReducedMotion()
  // The unfilled remainder is tinted mint — the latent "potential headroom"
  // above where the business sits today (the accent fill).
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-fimm-rise/[0.14]">
      <motion.div
        className="h-full rounded-full"
        style={{ background: accent }}
        initial={{ width: reduce ? `${value}%` : '6%' }}
        animate={{ width: `${value}%` }}
        transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : delay, ease: EASE }}
      />
    </div>
  )
}

/**
 * THE FIVE — discovery experience. A vertical index (keyboard tablist) whose
 * selection morphs a detail panel: the company's accent, its current-state
 * critique, a current→potential score read, the single move and its moat.
 */
export function FimmCompanies() {
  const [sel, setSel] = useState(0)
  const c = COMPANIES[sel]

  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null
    if (e.key === 'ArrowDown') next = (sel + 1) % COMPANIES.length
    else if (e.key === 'ArrowUp') next = (sel - 1 + COMPANIES.length) % COMPANIES.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = COMPANIES.length - 1
    if (next === null) return
    e.preventDefault()
    setSel(next)
    document.getElementById(`fimm-tab-${COMPANIES[next].id}`)?.focus()
  }

  return (
    <section id="the-five" aria-labelledby="five-h" className="border-t border-white/8 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] tracking-[0.3em] text-fimm-low uppercase">02 — The Five</p>
        <h2 id="five-h" className="mt-3 max-w-3xl font-grotesk text-4xl font-semibold tracking-tight text-fimm-hi text-balance md:text-5xl">
          Five businesses, each hiding a better brand
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Index — tablist */}
          <div
            role="tablist"
            aria-label="The five companies"
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="flex flex-col lg:col-span-5"
          >
            {COMPANIES.map((co, i) => {
              const active = i === sel
              return (
                <button
                  key={co.id}
                  id={`fimm-tab-${co.id}`}
                  role="tab"
                  aria-selected={active}
                  aria-controls="fimm-company-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSel(i)}
                  className="group relative border-t border-white/10 py-5 text-left transition-colors last:border-b focus-visible:outline-fimm-signal"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-fimm-low tabular-nums">0{i + 1}</span>
                      <span
                        className={`font-grotesk text-xl font-medium transition-colors md:text-2xl ${
                          active ? 'text-fimm-hi' : 'text-fimm-mid group-hover:text-fimm-hi'
                        }`}
                      >
                        {co.name}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[10px] tracking-[0.18em] text-fimm-low uppercase">
                      {co.region}
                    </span>
                  </div>
                  {/* accent underline grows on active */}
                  <motion.span
                    aria-hidden
                    className="absolute -bottom-px left-0 h-px"
                    style={{ background: co.accent }}
                    initial={false}
                    animate={{ width: active ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </button>
              )
            })}
          </div>

          {/* Detail panel */}
          <div id="fimm-company-panel" role="tabpanel" aria-labelledby={`fimm-tab-${c.id}`} className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.34, ease: EASE }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-fimm-panel p-7 md:p-9"
              >
                {/* accent glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
                  style={{ background: c.accent }}
                />
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.18em] uppercase">
                    <span style={{ color: c.accent }}>{c.sector}</span>
                    <span className="text-fimm-low">·</span>
                    <span className="text-fimm-low">{c.location}</span>
                    <span className="text-fimm-low">·</span>
                    <span className="text-fimm-low">{c.established}</span>
                  </div>
                  <p className="mt-4 font-grotesk text-2xl leading-snug font-medium text-fimm-hi text-balance md:text-[1.7rem]">
                    {c.essence}
                  </p>

                  <dl className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    <div>
                      <dt className="font-mono text-[10px] tracking-[0.22em] text-fimm-low uppercase">Today</dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-fimm-mid">{c.currentState}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] tracking-[0.22em] text-fimm-low uppercase">The latent value</dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-fimm-mid">{c.latentValue}</dd>
                    </div>
                  </dl>

                  {/* score read */}
                  <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-white/8 pt-6 sm:grid-cols-4">
                    {SCORE_DIMENSIONS.map((d, i) => (
                      <div key={d.key}>
                        <div className="flex items-baseline justify-between">
                          <span className="font-mono text-[10px] tracking-[0.14em] text-fimm-low uppercase">{d.label}</span>
                          <span className="font-mono text-xs text-fimm-hi tabular-nums">{c.scores[d.key]}</span>
                        </div>
                        <div className="mt-2">
                          <GapBar value={c.scores[d.key]} accent={c.accent} delay={0.1 + i * 0.08} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 grid gap-5 border-t border-white/8 pt-6 sm:grid-cols-[auto_1fr] sm:gap-8">
                    <div className="sm:max-w-xs">
                      <p className="font-mono text-[10px] tracking-[0.22em] text-fimm-low uppercase">The one move</p>
                      <p className="mt-1.5 flex gap-2 text-sm leading-relaxed text-fimm-hi">
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                        {c.theMove}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.22em] text-fimm-low uppercase">The moat</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-fimm-mid">{c.advantage}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
