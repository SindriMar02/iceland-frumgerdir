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

/** Archival toning for the black-and-white photography.
 *
 *  The photographer's mono selects are neutral grey, which on a warm near-black
 *  ground reads as "desaturated digital photo" rather than as a print. A light
 *  sepia pulls them toward the page's own ivory/gold and makes them read as
 *  what they are: a record of a bakery that has been running since 1994. Kept
 *  well under a half-strength sepia — past roughly .4 it stops looking like a
 *  warm print and starts looking like an Instagram filter. */
export const ARCHIVAL = 'sepia(.32) saturate(.88) contrast(1.05)'
/** The same frame, warmed back toward true on hover — the photograph "comes
 *  up" under the cursor without the tone visibly switching off. */
export const ARCHIVAL_LIVE = 'sepia(.12) saturate(1) contrast(1.03)'

/** A printed-on-paper depth for the gold display type. GOLD_TEXT clips a
 *  gradient to the glyphs, which makes the text itself transparent — so a
 *  text-shadow would paint through it and a drop-shadow filter is the only
 *  thing that reads. One pixel, hard, no blur: debossed, not glowing. */
export const LETTERPRESS = { filter: 'drop-shadow(0 1px 0 rgba(0,0,0,.55))' } as const

export const GOLD_TEXT = {
  background: `linear-gradient(180deg, ${GOLD_LIGHT} 6%, ${GOLD} 58%, #A98C5F 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
} as const
