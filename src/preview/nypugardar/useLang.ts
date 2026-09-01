/**
 * Nýpugarðar — language choice.
 *
 * TWO HOMES, TWO MECHANICS (paths.ts explains the split):
 *
 * STANDALONE (glacierview.is): the language IS the URL. English at the root,
 * Icelandic under /is/. There is nothing to remember and nothing to read from
 * storage: the route decides, the server and the browser agree on the first
 * render by construction, and every page exists at one address per language,
 * which is what lets Google index the Icelandic pages and what hreflang
 * points at. Switching languages navigates to the counterpart URL.
 *
 * CATALOGUE (/preview/nypugardar): one route, a toggle remembered in the
 * browser. Modelled on reynir bakarí's hook, which earned its comments the
 * hard way. Two things carried over unchanged because they are easy to "fix"
 * wrongly:
 *
 * 1. THE FIRST RENDER NEVER READS STORAGE. It returns the same constant on the
 *    server and in the browser, so prerendered markup and React's first client
 *    render are identical and hydration is clean. The stored preference is
 *    applied one tick later, in an effect. Reading localStorage during render
 *    is the classic way to produce a hydration mismatch.
 *
 * 2. THE FIRST PERSIST IS SKIPPED. At that point `lang` is still the default
 *    and the effect above may not have applied the stored value yet, so writing
 *    would clobber a returning visitor's choice. A visitor who never touches
 *    the switch leaves nothing in localStorage at all.
 *
 * ONE THING DELIBERATELY DIFFERENT: the default is English, where reynir's is
 * Icelandic. Reynir serves Kópavogur locals; this farm's guests are
 * overwhelmingly foreign travellers (see the reasoning in copy.ts). Change the
 * one constant below if that ever stops being true.
 *
 * The <html lang> attribute follows the choice and is restored on unmount, so
 * the declared language always matches the body text. Shipping lang="en" while
 * serving Icelandic (or the reverse) tells Google and screen readers the wrong
 * thing and indexes the wrong language for the whole page.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Lang } from './copy'
import { STANDALONE, counterpart, langFromPath } from './paths'

const KEY = 'nyp-lang'

/** Foreign-guest property, English default. See the note above before flipping. */
export const DEFAULT_LANG: Lang = 'en'

function stored(): Lang | null {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'is' || v === 'en' ? v : null
  } catch {
    /* Safari private mode throws on access rather than returning null. */
    return null
  }
}

export function useLang(): [Lang, (l: Lang) => void] {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const [remembered, setRemembered] = useState<Lang>(DEFAULT_LANG)
  const mounted = useRef(false)

  const lang: Lang = STANDALONE ? (langFromPath(pathname) ?? DEFAULT_LANG) : remembered

  /* Apply the remembered choice after mount, not during render. Catalogue only:
     in the standalone build the address already says. */
  useEffect(() => {
    if (STANDALONE) return
    const s = stored()
    if (s && s !== remembered) setRemembered(s)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Persist only real choices; skip the first run. */
  useEffect(() => {
    if (STANDALONE) return
    if (!mounted.current) {
      mounted.current = true
      return
    }
    try {
      window.localStorage.setItem(KEY, remembered)
    } catch {
      /* storage unavailable; the in-memory choice still works for this visit */
    }
  }, [remembered])

  /* Keep the declared document language honest, and put it back on the way out
     so it cannot follow a visitor onto a different preview route. */
  useEffect(() => {
    const prev = document.documentElement.lang
    document.documentElement.lang = lang
    return () => {
      document.documentElement.lang = prev
    }
  }, [lang])

  const setLang = useCallback(
    (l: Lang) => {
      if (STANDALONE) navigate(counterpart(pathname, hash, l))
      else setRemembered(l)
    },
    [navigate, pathname, hash],
  )

  return [lang, setLang]
}
