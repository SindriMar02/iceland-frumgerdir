/**
 * Stjörnusól — content data. Every fact verified against solbadsstofa.is
 * (2026-07-05): forsíða, /verdskra/, /k11-air-loft/ + noona.is/stjornusol
 * (hours "Opið til 22:00", established 1979). The handoff's email address
 * (@stjornusol.is) could NOT be verified on any official source and their
 * domain is solbadsstofa.is — it is deliberately omitted.
 */

export const PHONE_DISPLAY = '555 7272'
export const PHONE_HREF = 'tel:+3545557272'
export const NOONA = 'https://www.noona.is/stjornusol'
export const ADDRESS = 'Fjarðargata 17'
export const TOWN = '220 Hafnarfjörður'
export const MAPS_HREF =
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Fjarðargata 17, 220 Hafnarfjörður')
export const FACEBOOK = 'https://www.facebook.com/stjornusol'
export const INSTAGRAM = 'https://www.instagram.com/stjornusol'
export const FOUNDED = '1979'

/* ── Verðskrá — verified solbadsstofa.is/verdskra (morgunverð kl. 10-14) ── */

export interface PriceRow {
  id: string
  name: string
  minutes?: string
  morning: string
  day: string
  saves: string
  group: 'stakir' | 'kort'
}

export const PRICES: PriceRow[] = [
  { id: 'halfur', name: 'Hálfur tími', minutes: '7 mínútur', morning: '2.190 kr.', day: '2.390 kr.', saves: '200 kr.', group: 'stakir' },
  { id: 'stakur', name: 'Stakur tími', minutes: '14 mínútur', morning: '2.590 kr.', day: '2.790 kr.', saves: '200 kr.', group: 'stakir' },
  { id: 'halfurannar', name: '1½ tími', minutes: '21 mínúta', morning: '3.690 kr.', day: '4.190 kr.', saves: '500 kr.', group: 'stakir' },
  { id: 'kort5', name: '5 tíma kort', morning: '11.900 kr.', day: '12.900 kr.', saves: '1.000 kr.', group: 'kort' },
  { id: 'kort10', name: '10 tíma kort', morning: '21.900 kr.', day: '23.900 kr.', saves: '2.000 kr.', group: 'kort' },
  { id: 'kort15', name: '15 tíma kort', morning: '30.900 kr.', day: '32.900 kr.', saves: '2.000 kr.', group: 'kort' },
]

/* ── K11 destinations — verified solbadsstofa.is/k11-air-loft ──────────── */

export interface Destination {
  id: 'capri' | 'hawaii' | 'hamptons'
  title: string
  lat: string
  body: string
  chip: string
}

export const DESTINATIONS: Destination[] = [
  { id: 'capri', title: 'Sólarupprás á Capri', lat: '40,6°N', body: 'Fyrir þá sem fara reglulega í ljós.', chip: 'miðlungs sól' },
  { id: 'hawaii', title: 'Hámarkssólskin frá Hawaii', lat: '19,6°N', body: 'Fyrir þrælvana.', chip: 'mikil sól' },
  { id: 'hamptons', title: 'Sólsetur í Hamptons', lat: '40,9°N', body: 'Fyrir viðkvæmari húð og þá sem koma sjaldnar.', chip: 'viðkvæm sól' },
]

/* ── Bekkirnir — verified solbadsstofa.is forsíða ──────────────────────── */

export interface Bed {
  id: string
  name: string
  maker?: string
  image: string
}

export const BEDS: Bed[] = [
  { id: 'megasun5600', name: 'Megasun 5600 Ultra Power', maker: 'frá megaSun', image: 'beds/megasun-5600.jpg' },
  { id: 'x10', name: 'Luxura X10', maker: 'frá Luxura', image: 'beds/luxura-x10.jpg' },
  { id: 'megasun6800', name: 'Megasun 6800', maker: 'frá megaSun', image: 'beds/megasun-6800.jpg' },
  { id: 'k11', name: 'K11 Air Loft', image: 'beds/k11.jpg' },
]

/* ── Hero h1 glyphs: "Frá 2.190 kr." with per-glyph strike/hum delays ──── */

export interface Glyph {
  ch: string
  strike: number
  hum: number
  humDelay: number
  gap?: boolean
}

export const H1_GLYPHS: Glyph[] = [
  { ch: 'F', strike: 0.15, hum: 9.3, humDelay: 3.1 },
  { ch: 'r', strike: 0.95, hum: 8.1, humDelay: 4.6 },
  { ch: 'á', strike: 0.4, hum: 10.2, humDelay: 2.9 },
  { ch: '2', strike: 0.3, hum: 8.8, humDelay: 4.2, gap: true },
  { ch: '.', strike: 1.2, hum: 10.8, humDelay: 3.9 },
  { ch: '1', strike: 0.55, hum: 7.9, humDelay: 6.1 },
  { ch: '9', strike: 1.75, hum: 9.1, humDelay: 4.1 },
  { ch: '0', strike: 0.45, hum: 11.2, humDelay: 4.9 },
  { ch: 'k', strike: 1.05, hum: 8.4, humDelay: 3.4, gap: true },
  { ch: 'r', strike: 0.85, hum: 10.5, humDelay: 5.2 },
  { ch: '.', strike: 1.35, hum: 8.9, humDelay: 4.4 },
]

/* Intro wordmark letters with strike delays */
export const INTRO_LETTERS: { ch: string; d: number }[] = [
  { ch: 'S', d: 0.12 },
  { ch: 't', d: 0.34 },
  { ch: 'j', d: 0.2 },
  { ch: 'ö', d: 0.48 },
  { ch: 'r', d: 0.28 },
  { ch: 'n', d: 0.55 },
  { ch: 'u', d: 0.4 },
  { ch: 's', d: 0.62 },
  { ch: 'ó', d: 0.3 },
  { ch: 'l', d: 0.7 },
]

/* 12 hero tubes: strike delay + hum cycle (duration, delay) — from handoff */
export const TUBES: { strike: number; hum: number; humDelay: number }[] = [
  { strike: 0.2, hum: 9.1, humDelay: 3.2 },
  { strike: 0.9, hum: 7.4, humDelay: 5.1 },
  { strike: 0.5, hum: 11.3, humDelay: 2.4 },
  { strike: 1.4, hum: 8.2, humDelay: 6.3 },
  { strike: 0.7, hum: 10.6, humDelay: 4.7 },
  { strike: 2.3, hum: 5.9, humDelay: 4.4 },
  { strike: 0.35, hum: 9.8, humDelay: 7.2 },
  { strike: 1.1, hum: 8.8, humDelay: 3.8 },
  { strike: 0.6, hum: 12.1, humDelay: 5.6 },
  { strike: 1.7, hum: 7.9, humDelay: 4.0 },
  { strike: 0.45, hum: 10.2, humDelay: 6.8 },
  { strike: 1.25, hum: 9.4, humDelay: 4.1 },
]

/* Intro glyph rays: 8 rays clockwise from 12 o'clock (long/short alternate) */
export const RAYS: { rot: number; long: boolean; d: number }[] = [
  { rot: 0, long: true, d: 0.18 },
  { rot: 45, long: false, d: 0.24 },
  { rot: 90, long: true, d: 0.3 },
  { rot: 135, long: false, d: 0.36 },
  { rot: 180, long: true, d: 0.42 },
  { rot: 225, long: false, d: 0.48 },
  { rot: 270, long: true, d: 0.54 },
  { rot: 315, long: false, d: 0.6 },
]
