/**
 * Nýpugarðar — language choice.
 *
 * Modelled on reynir bakarí's hook, which earned its comments the hard way.
 * Two things carried over unchanged because they are easy to "fix" wrongly:
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

import { useEffect, useRef, useState } from 'react'
import type { Lang } from './copy'

const KEY = 'nyp-lang'

/** Foreign-guest property, English default. See the note above before flipping. */
const DEFAULT_LANG: Lang = 'en'

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
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG)
  const mounted = useRef(false)

  /* Apply the remembered choice after mount, not during render. */
  useEffect(() => {
    const s = stored()
    if (s && s !== lang) setLang(s)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Persist only real choices; skip the first run. */
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

  /* Keep the declared document language honest, and put it back on the way out
     so it cannot follow a visitor onto a different preview route. */
  useEffect(() => {
    const prev = document.documentElement.lang
    document.documentElement.lang = lang
    return () => {
      document.documentElement.lang = prev
    }
  }, [lang])

  return [lang, setLang]
}
