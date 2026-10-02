/**
 * Every internal link on this site, with the route swap wrapped in a view
 * transition.
 *
 * The browser holds a snapshot of the page being left, we swap the DOM and the
 * scroll position underneath it, and it cross-fades to the new one. That is
 * what makes the jump to the top of the next page invisible: it happens inside
 * the fade rather than in front of it.
 *
 * WHY THIS IS NOT `<Link viewTransition>`. React Router ships that prop and it
 * does nothing here — it is wired through the data router, and this app is
 * mounted on the declarative <BrowserRouter>. Measured: navigation worked,
 * document.startViewTransition was called zero times. Rather than migrate the
 * router (and with it the prerenderer, which walks these routes), the link
 * starts the transition itself.
 *
 * flushSync is the load-bearing part: startViewTransition captures the "after"
 * state when its callback returns, so React has to have committed by then. A
 * plain navigate() would return before the render and the browser would
 * cross-fade the old page to itself.
 *
 * Everything that could go wrong is a guard: a modified click (new tab), a
 * non-internal target, a browser without the API, or a visitor who has asked
 * for no motion all fall through to React Router's own handling.
 */
import { flushSync } from 'react-dom'
import { Link as RouterLink, useNavigate, type LinkProps } from 'react-router-dom'

/** Every route is prerendered as <route>/index.html, which Cloudflare Pages
 *  serves at /route/ and 308-redirects /route to. The canonicals and the
 *  sitemap already say /route/, so the links have to as well, or every
 *  internal link is a redirect hop and Google sees two URLs per page.
 *  Root, files and anything already ending in a slash are left alone; a
 *  query or hash stays after the slash. */
export function slash(to: string): string {
  const cut = to.search(/[?#]/)
  const path = cut === -1 ? to : to.slice(0, cut)
  const tail = cut === -1 ? '' : to.slice(cut)
  if (path === '' || path.endsWith('/') || /\.[a-z0-9]+$/i.test(path)) return to
  return `${path}/${tail}`
}

/** Same page whatever the slash form, for aria-current and the like. */
export function samePath(a: string, b: string): boolean {
  return a.replace(/\/+$/, '') === b.replace(/\/+$/, '')
}

export function Link({ onClick, to: rawTo, ...rest }: LinkProps) {
  const navigate = useNavigate()
  const to = typeof rawTo === 'string' && rawTo.startsWith('/') ? slash(rawTo) : rawTo

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (typeof to !== 'string' || !to.startsWith('/')) return
    if (typeof document === 'undefined' || !document.startViewTransition) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    e.preventDefault()
    document.startViewTransition(() => { flushSync(() => { navigate(to) }) })
  }

  return <RouterLink to={to} onClick={handleClick} {...rest} />
}
