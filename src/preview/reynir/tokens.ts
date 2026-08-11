/**
 * Reynir bakari — the locked design tokens, shared by Page.tsx and its section
 * components so a new section cannot drift from the established palette.
 *
 * Cloned from the Passion Reykjavík system per the original brief: near-black
 * warm ground, antique gold, deep burgundy, ivory; Lusitana + Source Serif 4.
 */

export const INK = '#131313'
export const INK_WARM = '#161311'
export const INK_DEEP = '#0B0A09'
export const BURGUNDY = '#5C1C1F'
export const GOLD = '#C8A877'
export const GOLD_LIGHT = '#EED3AA'
export const IVORY = '#F3EAD3'

/** Ivory at reduced alpha over INK. FAINT sits at 4.9:1, DIM at 7.2:1 (both AA). */
export const DIM = 'rgba(243,234,211,.66)'
export const FAINT = 'rgba(243,234,211,.52)'
export const HAIR = 'rgba(238,211,170,.16)'
export const HAIR_SOFT = 'rgba(238,211,170,.1)'

export const DISPLAY = "'Lusitana', Georgia, serif"
export const BODY = "'Source Serif 4', 'Source Serif Pro', Georgia, serif"
export const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'

export const GOLD_TEXT = {
  background: `linear-gradient(180deg, ${GOLD_LIGHT} 6%, ${GOLD} 58%, #A98C5F 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
} as const
