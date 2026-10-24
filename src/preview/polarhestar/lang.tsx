/**
 * Pólar Hestar — which language a page is in, and how a visitor changes it.
 *
 *   catalogue preview   the browser decides: the saved choice (localStorage),
 *                       else the first of navigator.languages we offer, else
 *                       English. One URL for all three languages.
 *   STANDALONE          the URL decides (/ is Icelandic, /en/, /de/), via the
 *                       RouteLang provider that polarhestar-app.tsx wraps each
 *                       route in. Switching language navigates to the same
 *                       page in the other language, keeping query and hash.
 *                       Nothing guesses a language from the browser or
 *                       redirects: Googlebot sends no Accept-Language, and a
 *                       redirect from / would hide the Icelandic pages from it.
 *
 * Every page used to carry its own copy of the preview logic; they all call
 * useLang() now and get the right behaviour for the build they are in.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Lang } from './data'
import { LANGS, STANDALONE, switchLangPath } from './paths'

const RouteLangContext = createContext<Lang>('is')

export function RouteLang({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <RouteLangContext.Provider value={lang}>{children}</RouteLangContext.Provider>
}

function usePreviewLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('ph-lang') as Lang | null
      if (saved && LANGS.includes(saved)) return saved
      const nav = (navigator.languages ?? [navigator.language]).map((l) => l.slice(0, 2))
      return nav.find((l): l is Lang => LANGS.includes(l as Lang)) ?? 'en'
    } catch {
      return 'en'
    }
  })
  const set = (l: Lang) => {
    try { localStorage.setItem('ph-lang', l) } catch { /* private mode */ }
    setLang(l)
  }
  return [lang, set]
}

function useStandaloneLang(): [Lang, (l: Lang) => void] {
  const lang = useContext(RouteLangContext)
  const navigate = useNavigate()
  const { pathname, search, hash } = useLocation()
  const set = (l: Lang) => {
    if (l === lang) return
    const to = switchLangPath(pathname, l)
    // replace: a language switch is the same page, not a new step in the history
    if (to) navigate(`${to}${search}${hash}`, { replace: true })
  }
  return [lang, set]
}

export const useLang: () => [Lang, (l: Lang) => void] = STANDALONE ? useStandaloneLang : usePreviewLang

/**
 * Renders its children only in the browser, after hydration. The booking form
 * is date-driven (default day = today + 7, a strip of the days around it), so
 * a form baked into HTML on build day would disagree with the browser on any
 * other day. The prerender holds a same-sized placeholder with the section's
 * own copy instead, and the form mounts untouched on the client.
 */
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return <>{mounted ? children : fallback}</>
}
