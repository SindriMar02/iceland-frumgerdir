import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'

const AMBER = '#B5722E'
const AMBER_DARK = '#8C5420'
const CREAM = '#FAF4E8'
const CARD_BG = '#FBF8F2'
const ESPRESSO = '#1A0F06'
const WARM_CREAM = '#F0E3C5'

const MAPS_URL = 'https://www.google.com/maps/search/?query=Sau%C3%B0%C3%A1rkr%C3%B3ksbakari%2C+A%C3%B0algata+5%2C+Sau%C3%B0%C3%A1rkr%C3%B3kur'

interface ExpandMapProps {
  lang: 'is' | 'en'
  openNow: boolean
}

export function ExpandMap({ lang, openNow }: ExpandMapProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-50, 50], [6, -6])
  const rotateY = useTransform(mouseX, [-50, 50], [-6, 6])
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (rect.left + rect.width / 2))
    mouseY.set(e.clientY - (rect.top + rect.height / 2))
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const mapsLabel = lang === 'is' ? 'Opna í kortum' : 'Open in maps'
  const expandHint = lang === 'is' ? 'Smelltu til að sjá kort' : 'Click to expand map'
  const openLabel = lang === 'is' ? (openNow ? 'Opið núna' : 'Lokað núna') : (openNow ? 'Open now' : 'Closed now')

  return (
    /* Outer: fills the flex column from Page.tsx wrapper, leaves 28px for the hint */
    <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* 3D perspective wrapper — fills the available height */}
      <motion.div
        ref={containerRef}
        style={{ flex: 1, perspective: 1000, cursor: 'pointer', userSelect: 'none', width: '100%' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Card — CSS transition from 100% (collapsed, fills parent) to 640px (expanded) */}
        <motion.div
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformStyle: 'preserve-3d',
            borderRadius: 24,
            overflow: 'hidden',
            border: `1px solid rgba(26,15,6,0.08)`,
            background: CARD_BG,
            position: 'relative',
            height: isExpanded ? '640px' : '100%',
            transition: 'height 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Subtle warm gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, rgba(181,114,46,0.04) 0%, transparent 50%, rgba(181,114,46,0.06) 100%)`, pointerEvents: 'none', zIndex: 1 }} />

          {/* Expanded map content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                {/* Map base */}
                <div style={{ position: 'absolute', inset: 0, background: WARM_CREAM }} />

                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
                  {/* Secondary horizontal streets */}
                  {[20, 50, 80].map((y, i) => (
                    <motion.line key={`h-${i}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
                      stroke={`rgba(26,15,6,0.1)`} strokeWidth="1.5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.55 + i * 0.08 }}
                    />
                  ))}
                  {/* Secondary vertical streets */}
                  {[20, 45, 75].map((x, i) => (
                    <motion.line key={`v-${i}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
                      stroke={`rgba(26,15,6,0.1)`} strokeWidth="1.5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
                    />
                  ))}
                  {/* Aðalgata — main amber road running horizontally at 50% */}
                  <motion.line x1="0%" y1="50%" x2="100%" y2="50%"
                    stroke={AMBER} strokeWidth="3.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  />
                  {/* Cross street vertical */}
                  <motion.line x1="50%" y1="0%" x2="50%" y2="100%"
                    stroke={`rgba(26,15,6,0.2)`} strokeWidth="2.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  />
                  {/* Aðalgata label */}
                  <motion.text x="8" y="46%" fontFamily="DM Sans, sans-serif" fontSize="9"
                    fill={AMBER} fontWeight="600" letterSpacing="0.5"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                  >
                    Aðalgata
                  </motion.text>
                </svg>

                {/* Buildings */}
                {[
                  { top: '18%', left: '8%', w: '16%', h: '22%', delay: 0.45 },
                  { top: '62%', left: '8%', w: '12%', h: '18%', delay: 0.5 },
                  { top: '15%', left: '58%', w: '14%', h: '28%', delay: 0.52 },
                  { top: '60%', left: '60%', w: '18%', h: '20%', delay: 0.55 },
                  { top: '12%', left: '28%', w: '10%', h: '16%', delay: 0.48 },
                  { top: '62%', left: '30%', w: '8%', h: '14%', delay: 0.58 },
                ].map((b, i) => (
                  <motion.div key={i}
                    style={{ position: 'absolute', top: b.top, left: b.left, width: b.w, height: b.h, borderRadius: 3, background: `rgba(26,15,6,0.1)`, border: `1px solid rgba(26,15,6,0.07)` }}
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: b.delay }}
                  />
                ))}

                {/* Amber pin at intersection */}
                <motion.div
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 10 }}
                  initial={{ scale: 0, y: -16 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22, delay: 0.28 }}
                >
                  <svg width="28" height="36" viewBox="0 0 24 32" fill="none" style={{ filter: `drop-shadow(0 4px 12px rgba(181,114,46,0.5))` }}>
                    <path d="M12 0C7.58 0 4 3.58 4 8c0 6.5 8 16 8 16s8-9.5 8-16c0-4.42-3.58-8-8-8z" fill={AMBER} />
                    <circle cx="12" cy="8" r="3" fill={CREAM} />
                  </svg>
                </motion.div>

                {/* Pulse rings on the pin dot */}
                <motion.div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9, pointerEvents: 'none' }}>
                  <motion.div style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: `1.5px solid rgba(181,114,46,0.5)` }}
                    animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.div style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: `1.5px solid rgba(181,114,46,0.3)` }}
                    animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.7 }}
                  />
                </motion.div>

                {/* Bottom fade */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: `linear-gradient(to top, ${CARD_BG} 0%, transparent 100%)`, pointerEvents: 'none' }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed grid pattern */}
          <motion.div
            style={{ position: 'absolute', inset: 0 }}
            animate={{ opacity: isExpanded ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <pattern id="bk-map-grid" width="22" height="22" patternUnits="userSpaceOnUse">
                  <path d="M 22 0 L 0 0 0 22" fill="none" stroke={AMBER} strokeWidth="0.4" opacity="0.35" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#bk-map-grid)`} />
            </svg>
          </motion.div>

          {/* Card content overlay */}
          <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 22px' }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <motion.div animate={{ opacity: isExpanded ? 0 : 1 }} transition={{ duration: 0.25 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ filter: isHovered ? `drop-shadow(0 0 8px rgba(181,114,46,0.6))` : `drop-shadow(0 0 4px rgba(181,114,46,0.3))` }}
                >
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" x2="9" y1="3" y2="18" />
                  <line x1="15" x2="15" y1="6" y2="21" />
                </svg>
              </motion.div>
              {/* Open/closed badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 9999, background: openNow ? 'rgba(86,101,79,0.12)' : 'rgba(120,60,60,0.1)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: openNow ? '#56654F' : '#8B3A3A', flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, color: openNow ? '#56654F' : '#8B3A3A', letterSpacing: '0.04em' }}>{openLabel}</span>
              </div>
            </div>

            {/* Bottom row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <motion.p
                style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: '1rem', color: ESPRESSO, fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}
                animate={{ x: isHovered ? 3 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                Aðalgata 5, Sauðárkrókur
              </motion.p>
              <AnimatePresence>
                {isExpanded && (
                  <motion.a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: AMBER, textDecoration: 'none', letterSpacing: '0.02em' }}
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ duration: 0.22 }}
                    whileHover={{ color: AMBER_DARK }}
                  >
                    {mapsLabel} →
                  </motion.a>
                )}
              </AnimatePresence>
              {/* Amber underline */}
              <motion.div
                style={{ height: 1, background: `linear-gradient(to right, rgba(181,114,46,0.5), rgba(181,114,46,0.25), transparent)`, transformOrigin: 'left' }}
                animate={{ scaleX: isHovered || isExpanded ? 1 : 0.25 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Expand hint */}
      <motion.p
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: `rgba(26,15,6,0.36)`, margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.04em', textAlign: 'center' }}
        animate={{ opacity: isHovered && !isExpanded ? 1 : 0, y: isHovered && !isExpanded ? 0 : 4 }}
        transition={{ duration: 0.2 }}
      >
        {expandHint}
      </motion.p>
    </div>
  )
}
