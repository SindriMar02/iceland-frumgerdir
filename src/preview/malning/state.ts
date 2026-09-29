import { useSyncExternalStore } from 'react'

/* One small store for everything the visitor builds on the page: the colour
   (from the blender or the colour card) and the job sheet ("verkblað"). The
   whole page reads --tint from the colour, so choosing a colour re-tints it. */

export type Dropar = Partial<Record<'gult' | 'rautt' | 'blatt' | 'graent' | 'umbra' | 'svart', number>>

export type Litur = {
  hex: string
  nafn: string
  /** 'blandad' = poured in the blender, 'litakort' = picked from the Kópal card */
  uppruni: 'blandad' | 'litakort'
  /** nearest Kópal colour and how close (CIEDE2000), when known */
  nalaegur?: { nafn: string; hex: string; deltaE: number }
  dropar?: Dropar
  kodi?: string
}

export type VerkLina = { id: string; litrar: number; flatarmal?: number; umferdir?: number }

export type Stada = {
  litur: Litur | null
  verk: VerkLina[]
  opid: boolean
  /** id of the product whose sheet is open, or null */
  vara: string | null
  /** a colour the library asks the blender to find a recipe for */
  beidni: { hex: string; nafn: string } | null
  /** product preselected in the calculator */
  reikni: string
}

let s: Stada = { litur: null, verk: [], opid: false, vara: null, beidni: null, reikni: 'kopal-10' }
const hlustendur = new Set<() => void>()
const sendaFrettir = () => hlustendur.forEach((f) => f())

export const stada = {
  get: () => s,
  sub: (f: () => void) => {
    hlustendur.add(f)
    return () => { hlustendur.delete(f) }
  },
  setLitur(l: Litur | null) { s = { ...s, litur: l }; sendaFrettir() },
  baeta(l: VerkLina) {
    const i = s.verk.findIndex((x) => x.id === l.id)
    const verk = i >= 0 ? s.verk.map((x, j) => (j === i ? { ...x, ...l } : x)) : [...s.verk, l]
    s = { ...s, verk }; sendaFrettir()
  },
  fjarlaega(id: string) { s = { ...s, verk: s.verk.filter((x) => x.id !== id) }; sendaFrettir() },
  breytaLitrum(id: string, litrar: number) {
    s = { ...s, verk: s.verk.map((x) => (x.id === id ? { ...x, litrar: Math.max(1, Math.min(200, Math.round(litrar))) } : x)) }
    sendaFrettir()
  },
  opna(opid: boolean) { if (s.opid !== opid) { s = { ...s, opid }; sendaFrettir() } },
  opnaVoru(vara: string | null) { if (s.vara !== vara) { s = { ...s, vara }; sendaFrettir() } },
  bidjaUmUppskrift(b: { hex: string; nafn: string } | null) { s = { ...s, beidni: b }; sendaFrettir() },
  veljaReikni(id: string) { if (s.reikni !== id) { s = { ...s, reikni: id }; sendaFrettir() } },
  hreinsa() { s = { ...s, litur: null, verk: [], vara: null, beidni: null }; sendaFrettir() },
}

export function useStada(): Stada {
  return useSyncExternalStore(stada.sub, stada.get, stada.get)
}

/* ---- colour helpers used by the tint and by contrast checks ---- */
export function rgbOf(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function luminance(hex: string): number {
  const [r, g, b] = rgbOf(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/** The ink to put on a tint: charcoal or white, whichever reads better. */
export function blekOn(hex: string): string {
  return contrast(hex, '#222221') >= contrast(hex, '#FFFFFF') ? '#222221' : '#FFFFFF'
}

/** A tint that is too pale to see on white gets pulled slightly darker for lines and badges. */
export function tintLina(hex: string): string {
  return contrast(hex, '#FFFFFF') < 1.6 ? '#C9CCCF' : hex
}
