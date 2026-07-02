import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface StickyCtaProps {
  label: string
  button: string
  href: string
  /** Tailwind classes for the button (per-brand gradient/colour) */
  buttonClassName: string
  /** Tailwind classes for the bar background */
  barClassName?: string
  /**
   * Selector of the section that retires the bar when visible. Defaults to
   * `href` when that is an in-page anchor; set explicitly when `href` is an
   * external action (tel:/mailto:) so the bar still steps aside.
   */
  watchTarget?: string
}

/**
 * Mobile-only sticky conversion bar. Appears once the hero scrolls away and
 * retires when the target CTA section is on screen, so it never sits on top
 * of the very section it points to.
 */
export function StickyCta({
  label,
  button,
  href,
  buttonClassName,
  barClassName = 'bg-white/85 text-slate-900 border-t border-slate-200/80',
  watchTarget,
}: StickyCtaProps) {
  const [pastHero, setPastHero] = useState(false)
  const [atTarget, setAtTarget] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const selector = watchTarget ?? (href.startsWith('#') ? href : null)
    if (!selector) return
    const target = document.querySelector(selector)
    if (!target) return
    const io = new IntersectionObserver(([entry]) => setAtTarget(entry.isIntersecting), {
      rootMargin: '0px 0px -15% 0px',
    })
    io.observe(target)
    return () => io.disconnect()
  }, [href, watchTarget])

  return (
    <AnimatePresence>
      {pastHero && !atTarget && (
        <motion.div
          initial={{ y: 88 }}
          animate={{ y: 0 }}
          exit={{ y: 88 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden ${barClassName}`}
        >
          <p className="min-w-0 truncate text-[13px] font-medium opacity-80">{label}</p>
          <a
            href={href}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition-transform active:scale-95 ${buttonClassName}`}
          >
            {button}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
