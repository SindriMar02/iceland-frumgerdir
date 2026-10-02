import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/* The enquiry list: machines a visitor collects while browsing, kept for the
   session, and carried into the request form as one tidy list. */

export interface ListItem {
  id: string
  label: string
  kind: 'family' | 'also'
  /** where the item lives, so the drawer can link back to it */
  href?: string
}

interface ListCtx {
  items: ListItem[]
  has: (id: string) => boolean
  toggle: (item: ListItem) => void
  remove: (id: string) => void
  clear: () => void
  open: boolean
  setOpen: (v: boolean) => void
}

const KEY = 'mv-enquiry-list'
const Ctx = createContext<ListCtx | null>(null)

const read = (): ListItem[] => {
  try {
    const raw = sessionStorage.getItem(KEY)
    const v = raw ? JSON.parse(raw) : []
    return Array.isArray(v) ? v.filter((x) => x && typeof x.id === 'string' && typeof x.label === 'string') : []
  } catch {
    return []
  }
}

export function ListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ListItem[]>(read)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(items)) } catch { /* private mode: the list lives for the page only */ }
  }, [items])

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items])
  const toggle = useCallback((item: ListItem) => {
    setItems((cur) => (cur.some((i) => i.id === item.id) ? cur.filter((i) => i.id !== item.id) : [...cur, item]))
  }, [])
  const remove = useCallback((id: string) => setItems((cur) => cur.filter((i) => i.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(() => ({ items, has, toggle, remove, clear, open, setOpen }), [items, has, toggle, remove, clear, open])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useList(): ListCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useList outside ListProvider')
  return v
}
