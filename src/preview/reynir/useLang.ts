/**
 * Reynir bakarí — the language of the page, read from its URL.
 *
 * Icelandic is served at /, /panta, /sagan, /personuvernd; English at the same
 * paths under /en. The toggle navigates between the two, so switching language
 * changes the address, and the address is the only thing that decides which
 * language renders.
 *
 * WHAT THIS REPLACED, and why the old version's care is no longer needed.
 *
 * The language used to be React state: 'is' by default, with a stored choice
 * applied in an effect after mount. That hook carried two deliberate, fragile
 * rules — never read localStorage during render (or the server's markup and
 * the browser's first render disagree and hydration breaks), and never persist
 * on the first run (or a returning visitor's choice is clobbered by the
 * default). Both existed to keep a value that lives outside the URL in step
 * with a page rendered before the browser ran. Reading it from the pathname
 * removes the problem rather than managing it: Node and the browser derive the
 * same language from the same string, every time.
 *
 * The stored preference is gone with it, on purpose. A remembered choice would
 * have to redirect the visitor away from the URL they opened — including the
 * URL Google indexed and the link someone was sent — and Google's own guidance
 * is not to do that. The URL is the choice now, so it survives being shared,
 * bookmarked and linked, which localStorage never did.
 */

import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Lang } from './data'
import { langFromPath, swapLang } from './paths'

export function useLang(): [Lang, (l: Lang) => void] {
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const lang = langFromPath(pathname)

  /* Keep the query and hash: a reader who opened /panta?vara=barnaterta and
     then switched language should still be looking at that cake. */
  const setLang = useCallback(
    (l: Lang) => {
      if (l === lang) return
      /* keepScroll: the toggle lives in the sticky bar, so it is reachable
         half-way down a long page. This is the same page in another language,
         not a new page — landing back at the masthead would lose the reader's
         place. ScrollToTop honours the flag; nothing else in the app sets it. */
      navigate(`${swapLang(pathname, l)}${search}${hash}`, { state: { keepScroll: true } })
    },
    [lang, pathname, search, hash, navigate],
  )

  return [lang, setLang]
}
