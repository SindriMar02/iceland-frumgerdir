/**
 * Palette + type tokens, computed AA contrast noted inline (see the final
 * build report for the full pair-by-pair numbers). Light, energetic,
 * clinical-warm: a cool porcelain ground (never cream/beige, so this never
 * reads as the warm-paper editorial look), one committed coral accent, a
 * pale sage "clinical" alt ground. Distinct from every other batch-13 build.
 */
export const INK = '#15191C'
export const BASE = '#F6F7F5'
export const MIST = '#E8F0EC'
export const CARD = '#FFFFFF'
export const SOFT = '#4B5054'
/** Retuned from an earlier #6C7174 (4.26:1 on MIST, failed AA) to a value
 * that clears 4.5:1 on every ground the page uses (BASE, MIST, white). */
export const MUTE = '#5C6164'
export const HAIR = 'rgba(21,25,28,.12)'
export const ACCENT = '#FF5A36'
/** Retuned from an earlier #C6431F (4.29:1 on MIST, failed AA) so the one
 * accent-for-text shade clears 4.5:1 on BASE, MIST and white alike. */
export const ACCENT_DEEP = '#B23A1A'
export const GREEN = '#0B7A61'

export const DISPLAY = "'SJR Gabarito', system-ui, sans-serif"
export const BODY = "'SJR Switzer', system-ui, sans-serif"
export const MONO = "'SJR Plex Mono', ui-monospace, monospace"

export const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B23A1A] focus-visible:ring-offset-[#F6F7F5]'
