/**
 * Reynir bakari — language choice, shared across the two routes.
 *
 * The order page is its own route, so a visitor reading the site in Icelandic
 * and then tapping "Panta" must not land in English. The choice is persisted so
 * it survives the navigation. Wrapped in try/catch because Safari private mode
 * throws on localStorage access rather than returning null.
 */

import { useEffect, useState } from 'react'
import type { Lang } from './data'

const KEY = 'rb-lang'

function read(): Lang {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = window.localStorage.getItem(KEY)
    return stored === 'is' || stored === 'en' ? stored : 'en'
  } catch {
    return 'en'
  }
}

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(read)

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, lang)
    } catch {
      /* storage unavailable; the in-memory choice still works for this visit */
    }
  }, [lang])

  return [lang, setLang]
}
