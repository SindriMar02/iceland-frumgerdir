/**
 * Palette + type tokens — v2. Computed AA contrast pairs (WCAG relative
 * luminance formula, checked by script during the build, see build report):
 *   INK on BONE 14.3:1 · SOFT on BONE 6.4:1 · MUTE on BONE 5.3:1
 *   SOFT on WHITE 8.0:1 · MUTE on WHITE 6.5:1 · GREEN on BONE 5.6:1
 *   CREAM on DEEP 14.9:1 · DEEP_MUTE on DEEP 6.7:1 · CREAM on FOOTER 16.7:1
 *   ACCENT_DEEP on BONE 4.8:1 · ACCENT_DEEP on WHITE 6.0:1
 *   CREAM on ACCENT_DEEP 5.3:1 · INK on raw ACCENT 4.75:1
 * The raw coral ACCENT (#E8503A) fails white-text AA (3.7:1) — it is used
 * ONLY as a fill behind dark INK text/art, or as a small swatch/border.
 * Any solid button or band that needs light text uses ACCENT_DEEP instead.
 */

/* ── light "bone" register ──────────────────────────────────────────── */
export const INK = '#1B1815'
export const BONE = '#E8E7E2'
export const MIST = '#E7EFE9'
export const CARD = '#FFFFFF'
export const SOFT = '#55504A'
export const MUTE = '#625D57'
export const HAIR = 'rgba(27,24,21,.14)'
export const GREEN = '#096650'

/* ── accent (spent only on the two ACCENT PUNCH bands: people, booking) ── */
export const ACCENT = '#E8503A'
export const ACCENT_DEEP = '#B23A1A'
export const ACCENT_SOFT = 'rgba(232,80,58,.14)'

/* ── deep "pine" register (marquee band + roster directory) ──────────── */
export const DEEP = '#0E211A'
export const DEEP_SOFT = '#16352A'
export const CREAM = '#F5F1EA'
export const DEEP_MUTE = '#9CA69F'
export const DEEP_HAIR = 'rgba(245,241,234,.14)'

/* ── near-black sign-off register (distinct hue from DEEP, warmer) ──── */
export const FOOTER = '#14110E'

export const DISPLAY = "'SJR Display', system-ui, sans-serif"
export const BODY = "'SJR General', system-ui, sans-serif"
export const MONO = "'SJR Plex Mono', ui-monospace, monospace"

export const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B23A1A] focus-visible:ring-offset-[#E8E7E2]'
export const FOCUS_DEEP =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F5F1EA] focus-visible:ring-offset-[#0E211A]'
