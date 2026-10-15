import { useSyncExternalStore } from 'react'
import { PRODUCTS, productBySlug, tierFor } from './data'

/*
 * Pöntunarlistinn (the basket): slug -> quantity, kept in this browser only. Nothing is sent anywhere.
 * The tier discount is the sample mechanism from data.ts; Umbúðagerðin sets the real steps.
 */
export type Line = { slug: string; qty: number }
const KEY = 'ug-listi'
const subs = new Set<() => void>()
let cache: Line[] | null = null

const read = (): Line[] => {
  if (cache) return cache
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]') as Line[]
    cache = Array.isArray(raw) ? raw.filter((l) => l && typeof l.slug === 'string' && l.qty > 0 && productBySlug(l.slug)) : []
  } catch { cache = [] }
  return cache
}
const write = (next: Line[]) => {
  cache = next
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* private mode: stays in memory */ }
  subs.forEach((f) => f())
}
const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }

export const useList = () => useSyncExternalStore(sub, read, read)
export const setQty = (slug: string, qty: number) => {
  const cur = read()
  const next = qty <= 0 ? cur.filter((l) => l.slug !== slug) : cur.some((l) => l.slug === slug) ? cur.map((l) => (l.slug === slug ? { ...l, qty } : l)) : [...cur, { slug, qty }]
  write(next)
}
export const toggle = (slug: string) => { const cur = read(); setQty(slug, cur.some((l) => l.slug === slug) ? 0 : 1) }
export const clearList = () => write([])
export const listCount = (list: Line[]) => list.reduce((a, l) => a + l.qty, 0)
export const lineTotal = (l: Line) => { const p = productBySlug(l.slug); if (!p) return { gross: 0, net: 0, pct: 0 }; const t = tierFor(l.qty); const gross = p.price * l.qty; return { gross, net: Math.round(gross * (1 - t.pct / 100)), pct: t.pct } }
export const listTotals = (list: Line[]) => list.reduce((a, l) => { const t = lineTotal(l); return { gross: a.gross + t.gross, net: a.net + t.net } }, { gross: 0, net: 0 })

/* a ready list for a common need: everything a small web shop packs with (real products from the sample) */
export const STARTERS: { key: string; label: string; items: [string, number][] }[] = [
  { key: 'vefverslun', label: 'Vefverslunin', items: PRODUCTS.filter((p) => p.catKey === 'vefverslunarpokar-og-umslog').slice(0, 2).map((p) => [p.slug, 1] as [string, number]).concat(PRODUCTS.filter((p) => p.catKey === 'limbond').slice(0, 1).map((p) => [p.slug, 2] as [string, number])) },
  { key: 'gjof', label: 'Gjafir', items: PRODUCTS.filter((p) => p.catKey === 'gjafakassar').slice(0, 2).map((p) => [p.slug, 10] as [string, number]).concat(PRODUCTS.filter((p) => p.catKey === 'bordar-og-bond').slice(0, 1).map((p) => [p.slug, 1] as [string, number])) },
  { key: 'flutningur', label: 'Flutningar', items: PRODUCTS.filter((p) => p.catKey === 'sendingarkassar').slice(0, 2).map((p) => [p.slug, 1] as [string, number]).concat(PRODUCTS.filter((p) => p.catKey === 'kassakurl').slice(0, 1).map((p) => [p.slug, 1] as [string, number])) },
]
export const loadStarter = (key: string) => { const s = STARTERS.find((x) => x.key === key); if (s) write(s.items.map(([slug, qty]) => ({ slug, qty }))) }
