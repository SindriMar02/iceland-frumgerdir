/**
 * Pólar Hestar — the hand-drawn horse from the owners' own 2022 design.
 *
 * Their designer drew it for a "Places left" line on the long tours (forwarded
 * by Juliane on 17 Oct 2026, `_docs/polarhestar-2022-graphics/`). The SVG is
 * used as a CSS mask so the ink line takes any colour (currentColor) and stays
 * one file. It does the same job here: it stands next to a departure's places
 * status, turns away when the departure is full, and trots once along a
 * hairline at the end of a tour page.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react'

const SRC = {
  right: `${import.meta.env.BASE_URL}polarhestar/horse-right.svg`,
  left: `${import.meta.env.BASE_URL}polarhestar/horse-left.svg`,
}

export function Horse({ facing = 'right', className = '', style }: { facing?: 'left' | 'right'; className?: string; style?: CSSProperties }) {
  const url = `url("${SRC[facing]}")`
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      style={{
        aspectRatio: '11 / 8',
        background: 'currentColor',
        WebkitMask: `${url} center / contain no-repeat`,
        mask: `${url} center / contain no-repeat`,
        ...style,
      }}
    />
  )
}

/** Colour and direction of the horse for a departure status. */
export function horseFor(status: string, tone: 'dark' | 'light') {
  if (status === 'cancelled') return null
  if (status === 'full') return { facing: 'left' as const, color: tone === 'dark' ? 'rgba(255,255,255,.35)' : '#57608A80' }
  if (status === 'few') return { facing: 'right' as const, color: tone === 'dark' ? '#F2C46D' : '#9A6400' }
  return { facing: 'right' as const, color: tone === 'dark' ? '#9BD8F3' : '#2160A6' }
}

/**
 * A hairline with the horse trotting in from the left once, the first time it
 * scrolls into view, and resting a little right of centre. Still for reduced motion.
 */
export function HorseRule({ color, line }: { color: string; line: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [go, setGo] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGo(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="ph-horse-rule relative mx-auto h-16 max-w-6xl" data-go={go} aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: `
        .ph-horse-rule .ph-hr-horse{position:absolute;bottom:7px;left:58%;width:72px;transform:translateX(-60vw);opacity:0}
        .ph-horse-rule[data-go="true"] .ph-hr-horse{animation:phTrot 2.6s cubic-bezier(.25,.6,.3,1) forwards}
        .ph-horse-rule[data-go="true"] .ph-hr-step{animation:phStep .32s ease-in-out 8 alternate}
        @keyframes phTrot{0%{transform:translateX(-60vw);opacity:0}12%{opacity:1}100%{transform:none;opacity:1}}
        @keyframes phStep{from{transform:translateY(0)}to{transform:translateY(-2px)}}
        @media (prefers-reduced-motion: reduce){
          .ph-horse-rule .ph-hr-horse,.ph-horse-rule[data-go="true"] .ph-hr-horse{animation:none;transform:none;opacity:1}
          .ph-horse-rule[data-go="true"] .ph-hr-step{animation:none}
        }
      ` }} />
      <span className="absolute inset-x-0 bottom-2 h-px" style={{ background: line }} />
      <span className="ph-hr-horse">
        <Horse className="ph-hr-step block w-full" style={{ color }} />
      </span>
    </div>
  )
}
