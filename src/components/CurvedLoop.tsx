import { useRef, useEffect, useState, useMemo, useId, FC, PointerEvent } from 'react'
import './CurvedLoop.css'

interface CurvedLoopProps {
  marqueeText?: string
  speed?: number
  curveAmount?: number
  direction?: 'left' | 'right'
  interactive?: boolean
}

const CurvedLoop: FC<CurvedLoopProps> = ({
  marqueeText = '',
  speed = 2,
  curveAmount = 400,
  direction = 'left',
  interactive = true,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s| $/.test(marqueeText)
    return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + ' '
  }, [marqueeText])

  const measureRef = useRef<SVGTextElement | null>(null)
  const textPathRef = useRef<SVGTextPathElement | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)
  const [spacing, setSpacing] = useState(0)
  const [offset, setOffset] = useState(0)
  const uid = useId()
  const pathId = `bk-curve-${uid}`
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`

  const dragRef = useRef(false)
  const lastXRef = useRef(0)
  const dirRef = useRef<'left' | 'right'>(direction)
  const velRef = useRef(0)

  const textLength = spacing
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2).fill(text).join('')
    : text
  const ready = spacing > 0

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength())
  }, [text])

  useEffect(() => {
    if (!spacing) return
    if (textPathRef.current) {
      const initial = -spacing
      textPathRef.current.setAttribute('startOffset', initial + 'px')
      setOffset(initial)
    }
  }, [spacing])

  useEffect(() => {
    if (!spacing || !ready) return
    let frame = 0
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0')
        let newOffset = currentOffset + delta
        if (newOffset <= -spacing) newOffset += spacing
        if (newOffset > 0) newOffset -= spacing
        textPathRef.current.setAttribute('startOffset', newOffset + 'px')
        setOffset(newOffset)
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [spacing, speed, ready])

  const onPointerDown = (e: PointerEvent) => {
    if (!interactive) return
    dragRef.current = true
    lastXRef.current = e.clientX
    velRef.current = 0
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return
    const dx = e.clientX - lastXRef.current
    lastXRef.current = e.clientX
    velRef.current = dx
    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0')
    let newOffset = currentOffset + dx
    if (newOffset <= -spacing) newOffset += spacing
    if (newOffset > 0) newOffset -= spacing
    textPathRef.current.setAttribute('startOffset', newOffset + 'px')
    setOffset(newOffset)
  }

  const endDrag = () => {
    if (!interactive) return
    dragRef.current = false
    dirRef.current = velRef.current > 0 ? 'right' : 'left'
  }

  return (
    <div
      className="bk-curved-loop-jacket"
      style={{ cursor: interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto', visibility: ready ? 'visible' : 'hidden' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg className="bk-curved-loop-svg" viewBox="0 0 1440 120">
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {text}
        </text>
        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text xmlSpace="preserve">
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + 'px'} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  )
}

export default CurvedLoop
