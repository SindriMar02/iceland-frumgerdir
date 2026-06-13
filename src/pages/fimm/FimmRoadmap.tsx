import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ROADMAP } from './data'
import { Reveal } from '../../components/Reveal'

/**
 * TRANSFORMATION ROADMAP — the studio's path from a dated site to a compounding
 * direct channel, as a horizontal timeline (vertical on mobile) with a line
 * that draws itself on scroll.
 */
export function FimmRoadmap() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  const grow = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="roadmap" aria-labelledby="road-h" className="border-t border-white/8 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] tracking-[0.3em] text-fimm-low uppercase">04 — The Roadmap</p>
        <h2 id="road-h" className="mt-3 max-w-3xl font-grotesk text-4xl font-semibold tracking-tight text-fimm-hi text-balance md:text-5xl">
          From a dated page to a channel that compounds
        </h2>

        <div ref={ref} className="relative mt-14">
          {/* connecting line — two fills so each orientation grows on its own
              axis only (a single element scaling both axes thins the 1px line). */}
          <div aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10 md:left-0 md:right-0 md:top-[7px] md:h-px md:w-auto md:bottom-auto">
            {/* mobile: vertical grow */}
            <motion.div
              className="absolute inset-0 origin-top bg-gradient-to-b from-fimm-signal to-fimm-rise md:hidden"
              style={{ scaleY: reduce ? 1 : grow }}
            />
            {/* desktop: horizontal grow */}
            <motion.div
              className="absolute inset-0 hidden origin-left bg-gradient-to-r from-fimm-signal to-fimm-rise md:block"
              style={{ scaleX: reduce ? 1 : grow }}
            />
          </div>

          <ol className="grid gap-8 md:grid-cols-5 md:gap-5">
            {ROADMAP.map((p, i) => (
              <Reveal key={p.no} delay={i * 0.08}>
                <li className="relative pl-8 md:pt-10 md:pl-0">
                  <span
                    aria-hidden
                    className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-fimm-bg bg-fimm-signal md:top-0"
                    style={{ background: i === ROADMAP.length - 1 ? 'var(--color-fimm-rise)' : 'var(--color-fimm-signal)' }}
                  />
                  <p className="font-mono text-xs text-fimm-low tabular-nums">{p.no}</p>
                  <h3 className="mt-1 font-grotesk text-xl font-medium text-fimm-hi">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fimm-mid">{p.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* current → potential delta */}
        <Reveal className="mt-20">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/8 sm:grid-cols-2">
            <div className="bg-fimm-bg p-7 md:p-9">
              <p className="font-mono text-[10px] tracking-[0.22em] text-fimm-low uppercase">Current state</p>
              <p className="mt-3 font-grotesk text-lg leading-snug text-fimm-mid">
                Word-of-mouth demand pouring into sites that can’t hold it — no mobile, no booking, no story, commission
                leaking to the middlemen.
              </p>
            </div>
            <motion.div
              className="relative bg-fimm-bg p-7 md:p-9"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-fimm-rise/[0.04]" />
              <p className="relative font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: 'var(--color-fimm-rise)' }}>
                Potential state
              </p>
              <p className="relative mt-3 font-grotesk text-lg leading-snug text-fimm-hi">
                The same demand, captured: found on a phone, booked direct, the heritage finally visible — and the margin
                staying in the business.
              </p>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
