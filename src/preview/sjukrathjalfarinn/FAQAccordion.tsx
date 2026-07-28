import { useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { gsap } from 'gsap'
import { FAQ_ITEMS } from './data'
import { reduced } from './primitives'
import { ACCENT_DEEP, BODY, DISPLAY, FOCUS, INK, SOFT } from './tokens'

/**
 * DEVICE 7 — the FAQ accordion (mandated). Height animates 0 <-> auto via a
 * measured-height GSAP tween (a bare CSS `height:auto` transition doesn't
 * animate), and the plus icon rotates 45deg into an X. Only questions
 * answerable straight from data.ts's verified facts are asked — FAQ_ITEMS
 * is deliberately short rather than padded with invented ones.
 */
export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="sjr-faq-list">
      {FAQ_ITEMS.map((item, i) => (
        <FAQRow key={item.q} q={item.q} a={item.a} isOpen={open === i} onToggle={() => setOpen((prev) => (prev === i ? null : i))} />
      ))}
    </div>
  )
}

function FAQRow({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const iconRef = useRef<HTMLSpanElement | null>(null)
  const mounted = useRef(false)

  useEffect(() => {
    const panel = panelRef.current
    const inner = innerRef.current
    if (!panel || !inner) return

    // first commit: snap to the starting state, no tween
    if (!mounted.current) {
      mounted.current = true
      panel.style.height = isOpen ? 'auto' : '0px'
      if (iconRef.current) iconRef.current.style.transform = isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
      return
    }

    if (reduced()) {
      panel.style.height = isOpen ? 'auto' : '0px'
      if (iconRef.current) iconRef.current.style.transform = isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
      return
    }

    const h = inner.getBoundingClientRect().height
    gsap.killTweensOf(panel)
    if (isOpen) {
      gsap.fromTo(panel, { height: 0 }, { height: h, duration: 0.42, ease: 'power2.out', onComplete: () => (panel.style.height = 'auto') })
    } else {
      gsap.set(panel, { height: h })
      gsap.to(panel, { height: 0, duration: 0.36, ease: 'power2.inOut' })
    }
    gsap.to(iconRef.current, { rotate: isOpen ? 45 : 0, duration: 0.36, ease: 'power2.out' })
  }, [isOpen])

  return (
    <div>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className={`flex w-full items-center justify-between gap-4 py-5 text-left ${FOCUS}`}
          style={{ minHeight: 44 }}
        >
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1rem, 2vw, 1.15rem)', letterSpacing: '-.01em', color: INK }}>{q}</span>
          <span
            ref={iconRef}
            aria-hidden="true"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
            style={{ border: `1.5px solid ${ACCENT_DEEP}`, color: ACCENT_DEEP }}
          >
            <Plus size={16} strokeWidth={2.4} />
          </span>
        </button>
      </h3>
      <div ref={panelRef} style={{ overflow: 'hidden' }}>
        <div ref={innerRef} className="pb-6" style={{ fontFamily: BODY, color: SOFT, lineHeight: 1.6, maxWidth: '62ch' }}>
          {a}
        </div>
      </div>
    </div>
  )
}
