import { useSyncExternalStore } from 'react'
import { PRODUCTS, TRIPS, productBySlug } from './data'

/*
 * The basket / trip list (Set's material list, re-aimed): slug -> quantity,
 * kept in this browser only. Nothing is sent anywhere.
 */
export type Line = { slug: string; qty: number }
const KEY = 'vv-list'
const subs = new Set<() => void>()
let cache: Line[] | null = null

function read(): Line[] {
  if (cache) return cache
  try { cache = (JSON.parse(localStorage.getItem(KEY) ?? '[]') as Line[]).filter((l) => productBySlug(l.slug) && l.qty > 0) } catch { cache = [] }
  return cache
}
function write(next: Line[]) {
  cache = next
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* private mode */ }
  subs.forEach((f) => f())
}
const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }
const EMPTY: Line[] = []

export function useList() { return useSyncExternalStore(subscribe, read, () => EMPTY) }
export const listCount = (l: Line[]) => l.reduce((a, b) => a + b.qty, 0)
export const listTotal = (l: Line[]) => l.reduce((a, b) => a + (productBySlug(b.slug)?.price ?? 0) * b.qty, 0)
export function setQty(slug: string, qty: number) {
  const cur = read()
  const next = qty <= 0 ? cur.filter((l) => l.slug !== slug) : cur.some((l) => l.slug === slug) ? cur.map((l) => (l.slug === slug ? { ...l, qty } : l)) : [...cur, { slug, qty }]
  write(next)
}
export const toggle = (slug: string) => { const has = read().some((l) => l.slug === slug); setQty(slug, has ? 0 : 1) }
export function loadTrip(key: string) {
  const t = TRIPS.find((x) => x.key === key)
  if (t) write(t.items.map(([slug, qty]) => ({ slug, qty })))
}
export const clearList = () => write([])
export const tripTotal = (key: string) => (TRIPS.find((x) => x.key === key)?.items ?? []).reduce((a, [s, q]) => a + (PRODUCTS.find((p) => p.slug === s)?.price ?? 0) * q, 0)
