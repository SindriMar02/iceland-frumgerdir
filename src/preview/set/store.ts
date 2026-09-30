import { useSyncExternalStore } from 'react'
import { DEMO_LIST, defaultUnit, type Product, type Unit } from './data'

/* The material list. In the preview it lives in localStorage (per browser); every read and write is guarded, and the
   page works without storage (private mode, blocked site data). Nothing is posted anywhere. */

export type Line = { sku: string; id: number; name: string; qty: number; unit: Unit }
export type Meta = {
  name: string; ref: string; date: string; place: '' | 'selfoss' | 'rvk' | 'ship'; notes: string; file: string
  cname: string; company: string; email: string; phone: string
}
export type ListState = { lines: Line[]; meta: Meta }
export type Saved = { id: string; savedAt: string; state: ListState }
export type Sent = { no: string; at: string; state: ListState }

const KEY = 'set-efnislisti-v1'
const SAVED = 'set-efnislisti-saved-v1'
const SENT = 'set-efnislisti-sent-v1'

export const emptyMeta = (): Meta => ({ name: '', ref: '', date: '', place: '', notes: '', file: '', cname: '', company: '', email: '', phone: '' })

const read = <T,>(k: string, fallback: T): T => {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fallback } catch { return fallback }
}
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage blocked: stays in memory */ } }

type Store = { list: ListState; saved: Saved[]; sent: Sent[]; seeded: boolean }
let store: Store = {
  list: read<ListState>(KEY, { lines: [], meta: emptyMeta() }),
  saved: read<Saved[]>(SAVED, []),
  sent: read<Sent[]>(SENT, []),
  seeded: read<boolean>(`${KEY}-seeded`, false),
}
/* older or damaged entries: keep the shape */
store.list = { lines: Array.isArray(store.list?.lines) ? store.list.lines : [], meta: { ...emptyMeta(), ...(store.list?.meta ?? {}) } }

const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())
const set = (next: Partial<Store>) => {
  store = { ...store, ...next }
  if (next.list) write(KEY, store.list)
  if (next.saved) write(SAVED, store.saved)
  if (next.sent) write(SENT, store.sent)
  if (next.seeded !== undefined) write(`${KEY}-seeded`, store.seeded)
  emit()
}

export function useList(): Store {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => store, () => store)
}
export const getList = () => store

export const lineOf = (p: Product, qty?: number, unit?: Unit): Line => ({ sku: p.sku, id: p.id, name: p.name, qty: qty ?? 1, unit: unit ?? defaultUnit(p) })

export function addProduct(p: Product, qty?: number, unit?: Unit) {
  const lines = store.list.lines.slice()
  const i = lines.findIndex((l) => l.sku === p.sku)
  if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + (qty ?? 1), unit: unit ?? lines[i].unit }
  else lines.push(lineOf(p, qty ?? (defaultUnit(p) === 'm' ? 10 : 1), unit))
  set({ list: { ...store.list, lines } })
}
export function removeSku(sku: string) {
  set({ list: { ...store.list, lines: store.list.lines.filter((l) => l.sku !== sku) } })
}
export function updateLine(sku: string, patch: Partial<Line>) {
  set({ list: { ...store.list, lines: store.list.lines.map((l) => (l.sku === sku ? { ...l, ...patch, qty: Math.max(1, Math.round(patch.qty ?? l.qty)) } : l)) } })
}
export function updateMeta(patch: Partial<Meta>) {
  set({ list: { ...store.list, meta: { ...store.list.meta, ...patch } } })
}
export function clearList() {
  set({ list: { lines: [], meta: { ...emptyMeta(), cname: store.list.meta.cname, company: store.list.meta.company, email: store.list.meta.email, phone: store.list.meta.phone } } })
}
export function restoreList(s: ListState) { set({ list: JSON.parse(JSON.stringify(s)) as ListState }) }
export function loadDemo(products: Product[], name: string) {
  const bySku = new Map(products.map((p) => [p.sku, p]))
  const lines = DEMO_LIST.flatMap((d) => { const p = bySku.get(d.sku); return p ? [lineOf(p, d.qty, d.unit)] : [] })
  set({ list: { lines, meta: { ...store.list.meta, name } }, seeded: true })
}
/* first visit: the page opens on the demonstration list (2.18020 and two related items), once */
export function seedOnce(products: Product[], name: string) {
  if (store.seeded || store.list.lines.length) { if (!store.seeded) set({ seeded: true }); return }
  loadDemo(products, name)
}

export function saveCurrent(): string {
  const id = `L${Date.now().toString(36)}`
  const saved = [{ id, savedAt: new Date().toISOString(), state: JSON.parse(JSON.stringify(store.list)) as ListState }, ...store.saved.filter((s) => s.state.meta.name !== store.list.meta.name || !store.list.meta.name)].slice(0, 12)
  set({ saved })
  return id
}
export function openSaved(id: string) {
  const s = store.saved.find((x) => x.id === id)
  if (s) set({ list: JSON.parse(JSON.stringify(s.state)) as ListState })
}
export function deleteSaved(id: string) { set({ saved: store.saved.filter((s) => s.id !== id) }) }

export function sendCurrent(): Sent {
  const no = `S-${1043 + store.sent.length}`
  const sent: Sent = { no, at: new Date().toISOString(), state: JSON.parse(JSON.stringify(store.list)) as ListState }
  set({ sent: [sent, ...store.sent].slice(0, 8) })
  return sent
}

export const totalLines = () => store.list.lines.length
export const canSend = (s: ListState) => s.lines.length > 0 && !!s.meta.cname.trim() && !!(s.meta.email.trim() || s.meta.phone.trim())
export const missingOf = (s: ListState): ('date' | 'place' | 'ref' | 'unit')[] => {
  const m: ('date' | 'place' | 'ref' | 'unit')[] = []
  if (!s.meta.date) m.push('date')
  if (!s.meta.place) m.push('place')
  if (!s.meta.ref.trim()) m.push('ref')
  return m
}
