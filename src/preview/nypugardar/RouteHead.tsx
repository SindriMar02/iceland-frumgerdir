import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Built from the same headFor() output as the initial HTML. No second copy of
// page facts, network request or stale asynchronous navigation response.
const selector = 'title,meta[name="description"],meta[name="robots"],link[rel="canonical"],link[hreflang],meta[property^="og:"],meta[name^="twitter:"],script[type="application/ld+json"]'
export function RouteHead() {
  const { pathname } = useLocation()
  const [previewNoindex] = useState(() => typeof document !== 'undefined' &&
    !!document.querySelector('meta[name="robots"]')?.getAttribute('content')?.includes('noindex'))
  useEffect(() => {
    const raw = document.getElementById('nyp-route-heads')?.textContent
    if (!raw) return // Development/catalogue has no injected head table.
    const heads = JSON.parse(raw) as Record<string, string>
    const key = pathname.replace(/\/+$/, '') || '/'
    const html = heads[key === '/herbergi' ? '/rooms' : key]
    const next = new DOMParser().parseFromString(html || '<title>Page not found | Nýpugarðar</title><meta name="robots" content="noindex">', 'text/html')
    document.head.querySelectorAll(selector).forEach(node => node.remove())
    next.head.querySelectorAll(selector).forEach(node => document.head.appendChild(document.importNode(node, true)))
    if (previewNoindex) document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, nofollow')
  }, [pathname, previewNoindex])
  return null
}
