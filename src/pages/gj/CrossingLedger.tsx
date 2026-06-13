import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { MILESTONES } from './data'

const FIRST_YEAR = 1931
const LAST_YEAR = 2026
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/** One rolling drum column of the year odometer. */
function DigitDrum({ digit }: { digit: number }) {
  return (
    <span className="inline-block h-[1em] w-[0.56em] overflow-hidden align-top">
      <motion.span
        className="flex flex-col leading-none"
        animate={{ y: `${-digit}em` }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="h-[1em] text-center">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

/**
 * SHEET II — THE FIRST CROSSING. A pinned 320vh ledger: scrolling scrubs the
 * year 1931→2026 on serif odometer drums while survey benchmarks crossfade
 * and a braided glacial river draws itself behind. Reduced motion renders
 * the same content as a static vertical timeline.
 */
export function CrossingLedger() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const riverDraw = useTransform(scrollYProgress, [0.04, 0.96], [0, 1])
  const [year, setYear] = useState(FIRST_YEAR)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const y = Math.round(FIRST_YEAR + Math.min(1, Math.max(0, (v - 0.04) / 0.88)) * (LAST_YEAR - FIRST_YEAR))
    setYear(Math.min(LAST_YEAR, Math.max(FIRST_YEAR, y)))
  })

  const activeIdx = MILESTONES.reduce((acc, m, i) => (year >= m.year ? i : acc), 0)
  const active = MILESTONES[activeIdx]
  const digits = String(year).split('').map(Number)

  if (reduce) {
    return (
      <section id="heritage" aria-labelledby="heritage-h" className="bg-gj-paper px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="font-grotesk text-[11px] font-medium tracking-[0.22em] text-gj-lichen uppercase">
            Sheet II — The First Crossing
          </p>
          <h2 id="heritage-h" className="mt-3 font-survey text-4xl text-gj-ink md:text-6xl">
            Ninety-five years, one line
          </h2>
          <ol className="mt-12 space-y-10 border-l border-gj-ink/20 pl-8">
            {MILESTONES.map((m) => (
              <li key={m.year}>
                <p className="font-grotesk text-xs font-medium tracking-[0.22em] text-gj-cobalt tabular-nums">
                  {m.mark} · {m.year}
                </p>
                <h3 className="mt-1.5 font-survey text-2xl text-gj-ink">{m.title}</h3>
                <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-gj-ink/70">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  return (
    <section id="heritage" aria-labelledby="heritage-h" ref={ref} className="relative h-[320vh] bg-gj-paper">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-5 md:px-10">
        {/* Braided river, drawn by the scroll */}
        <svg
          aria-hidden
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full opacity-[0.16]"
        >
          <motion.path
            d="M-20 520 C160 480 240 430 330 430 C420 430 460 480 560 470 C660 460 700 380 800 370 C900 360 960 410 1060 390 C1130 376 1180 340 1230 320"
            fill="none"
            stroke="var(--color-gj-cobalt)"
            strokeWidth="2"
            style={{ pathLength: riverDraw }}
          />
          <motion.path
            d="M-20 560 C180 530 260 470 360 470 C460 470 500 520 600 505 C700 490 740 420 840 410 C940 400 1000 440 1100 420 C1160 408 1200 380 1240 360"
            fill="none"
            stroke="var(--color-gj-cobalt)"
            strokeWidth="1"
            style={{ pathLength: riverDraw }}
          />
        </svg>

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="font-grotesk text-[11px] font-medium tracking-[0.22em] text-gj-lichen uppercase">
              Sheet II — The First Crossing
            </p>
            <h2 id="heritage-h" className="mt-2 font-survey text-2xl text-gj-ink md:text-3xl">
              Ninety-five years, one line
            </h2>
            <p
              aria-hidden
              className="mt-4 font-survey text-[clamp(5.5rem,16vw,12rem)] leading-none text-gj-ink tabular-nums"
            >
              {digits.map((d, i) => (
                <DigitDrum key={i} digit={d} />
              ))}
            </p>
            <p className="mt-2 font-grotesk text-[11px] font-medium tracking-[0.3em] text-gj-cobalt uppercase">
              Year of record · scroll to advance
            </p>
          </div>

          <div className="relative min-h-[15rem] md:min-h-[17rem]">
            <AnimatePresence mode="wait">
              <motion.article
                key={active.mark}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="border-t-2 border-gj-ink pt-5"
              >
                <p className="font-grotesk text-xs font-medium tracking-[0.22em] text-gj-cobalt tabular-nums">
                  {active.mark} · BENCHMARK {active.year}
                </p>
                <h3 className="mt-3 font-survey text-3xl text-gj-ink md:text-5xl">{active.title}</h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-gj-ink/70 md:text-base">
                  {active.body}
                </p>
              </motion.article>
            </AnimatePresence>

            {/* Benchmark tick rail */}
            <div aria-hidden className="mt-8 flex items-center gap-2">
              {MILESTONES.map((m, i) => (
                <span
                  key={m.mark}
                  className={`h-2 w-px transition-colors duration-300 ${
                    i <= activeIdx ? 'bg-gj-cobalt' : 'bg-gj-ink/25'
                  } ${i === activeIdx ? 'h-3.5' : ''}`}
                />
              ))}
              <span className="ml-2 font-grotesk text-[10px] tracking-[0.22em] text-gj-lichen tabular-nums">
                {String(activeIdx + 1).padStart(2, '0')}/{String(MILESTONES.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
