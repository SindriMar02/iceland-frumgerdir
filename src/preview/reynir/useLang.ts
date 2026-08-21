/**
 * Reynir bakari — language choice, shared across the routes.
 *
 * The order page is its own route, so a visitor reading the site in Icelandic
 * and then tapping "Panta" must not land in English. The choice is persisted so
 * it survives the navigation. Wrapped in try/catch because Safari private mode
 * throws on localStorage access rather than returning null.
 *
 * TWO things here are deliberate and easy to "fix" wrongly:
 *
 * 1. THE DEFAULT IS ICELANDIC EVERYWHERE, catalogue preview included.
 *
 *    It used to be English on the catalogue, on the reasoning that the
 *    catalogue is Sindri reading his own work. That was wrong twice over. The
 *    preview URL is the link SENT TO THE OWNER and to prospects, so the first
 *    thing an Icelandic baker saw of his own site was in English. And the
 *    shell already declares lang="is" on every route, so the page was telling
 *    Google and screen readers Icelandic while serving them English body text:
 *    a contradiction that indexes the wrong language for the whole site.
 *
 *    A first-time visitor to reynirbakari.is is overwhelmingly a Kopavogur
 *    local. English stays one tap away in the header for everyone else, and
 *    the choice is remembered.
 *
 * 2. THE FIRST RENDER NEVER READS STORAGE. It returns the same constant on the
 *    server and in the browser, so the prerendered markup and React's first
 *    client render are identical and hydration is clean. The stored preference
 *    is applied one tick later, in an effect. Reading localStorage during
 *    render is the classic way to produce a hydration mismatch.
 */

import { useEffect, useRef, useState } from 'react'
import type { Lang } from './data'

const KEY = 'rb-lang'

/** Icelandic bakery, Icelandic default, on whichever host it is served from. */
const DEFAULT_LANG: Lang = 'is'

function stored(): Lang | null {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'is' || v === 'en' ? v : null
  } catch {
    return null
  }
}

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG)
  const mounted = useRef(false)

  /* Apply the remembered choice after mount, not during render. */
  useEffect(() => {
    const s = stored()
    if (s && s !== lang) setLang(s)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Persist only real choices. The first run is always skipped: at that point
     `lang` is still the default and the effect above may not have applied the
     stored value yet, so writing here would clobber a returning visitor's
     choice with the default. A visitor who never touches the switch therefore
     leaves nothing in localStorage at all. */
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    try {
      window.localStorage.setItem(KEY, lang)
    } catch {
      /* storage unavailable; the in-memory choice still works for this visit */
    }
  }, [lang])

  return [lang, setLang]
}
