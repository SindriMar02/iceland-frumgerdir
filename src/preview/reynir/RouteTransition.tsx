/**
 * Page to page: the old page steps out, the new one rises in.
 *
 * Why it lives here and not at the router: the Reynir pages are mounted by TWO
 * route trees (the catalogue's App.tsx and the standalone reynir-app.tsx), and
 * the catalogue's tree serves every other client's preview too. Holding the
 * old route at that level would change every prototype in the repo. So the
 * pages do it themselves:
 *
 *  LEAVE — a capture-phase click listener catches an internal link to a
 *  different page before React Router's <Link> sees it, plays a short exit on
 *  the page body, then replays the same click with a pass flag set. The router
 *  therefore still does its own navigation, basename and all; this only
 *  decides WHEN.
 *
 *  ENTER — the next page mounts, finds the `arriving` flag and rises in. The
 *  flag is also set by back/forward, which cannot be delayed, so a history
 *  step still gets the entrance even though it skips the exit.
 *
 * The first load of a visit is never an arrival, so the landing page's own
 * curtain and held hero keep the first impression to themselves.
 *
 * Only the page body moves (main and footer). The sticky bar stays put, the
 * way a header should across pages. Reduced motion: opacity only.
 */
import { useEffect } from 'react'
import { useIsomorphicLayoutEffect } from './ssr'
import { EASE } from './tokens'

/** Set by an exit or a history step, read once by the next page to mount. */
let arriving = false
/** The replayed click must not be caught a second time. */
let passing = false

const BODY = '#reynir-content, #reynir-order-content, #reynir-story-content, .rb-lg-wrap, .rb-page > footer, .rb-op-foot, .rb-lg-foot, .rb-st > footer'

const CSS = `
@keyframes rb-route-out { to { opacity:0; transform:translateY(-8px); } }
@keyframes rb-route-in { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
@keyframes rb-route-fade-out { to { opacity:0; } }
@keyframes rb-route-fade-in { from { opacity:0; } to { opacity:1; } }
html[data-rb-route="leave"] :is(${BODY}) { animation:rb-route-out .24s cubic-bezier(.4,0,.2,1) forwards; }
html[data-rb-route="enter"] :is(${BODY}) { animation:rb-route-in .55s ${EASE} both; }
@media (prefers-reduced-motion: reduce) {
  html[data-rb-route="leave"] :is(${BODY}) { animation:rb-route-fade-out .18s linear forwards; }
  html[data-rb-route="enter"] :is(${BODY}) { animation:rb-route-fade-in .3s linear both; }
}
`

const EXIT_MS = 240
const ENTER_MS = 600

export function RouteTransition() {
  /* ENTER — before paint, so the new page never flashes in at full opacity
     for one frame before its own entrance starts. */
  useIsomorphicLayoutEffect(() => {
    if (!arriving) return
    arriving = false
    const root = document.documentElement
    root.dataset.rbRoute = 'enter'
    /* Not cleared on unmount: the flag is already spent, so a cancelled timer
       (StrictMode's double mount, or a fast second click) would leave the
       attribute behind for good. Guarded by value instead. */
    window.setTimeout(() => {
      if (root.dataset.rbRoute === 'enter') delete root.dataset.rbRoute
    }, ENTER_MS)
  }, [])

  /* LEAVE */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (passing) return
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      if (a.origin !== window.location.origin) return
      /* same page (a #section jump or the page's own link) is not a page change */
      if (a.pathname === window.location.pathname) return
      e.preventDefault()
      e.stopPropagation()
      const root = document.documentElement
      if (root.dataset.rbRoute === 'leave') return
      root.dataset.rbRoute = 'leave'
      window.setTimeout(() => {
        arriving = true
        /* the new page takes over the attribute in its layout effect; clear it
           here only if the click somehow did not navigate */
        passing = true
        a.click()
        passing = false
        window.setTimeout(() => {
          if (root.dataset.rbRoute === 'leave') delete root.dataset.rbRoute
        }, 60)
      }, EXIT_MS)
    }
    const onPop = () => { arriving = true }
    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPop)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPop)
    }
  }, [])

  return <style dangerouslySetInnerHTML={{ __html: CSS }} />
}
