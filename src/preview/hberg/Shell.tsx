import { useEffect, type ReactNode } from 'react'
import { Bendill, C, CSS, Haus, faraA, useMjukSkrun, useWatchdog } from './ui'
import { Poki, POKA_CSS } from './poki'
import { Popup, POP_CSS } from './popup'
import { Hledsla, HLEDSLA_CSS } from './hledsla'
import { REGN_CSS } from './regn'
import { EYD_CSS } from './eydublad'
import { MERKI_CSS } from './merki'
import { EXPERIENCE_CSS } from './experience-style'
import { BROWSER_CSS } from './product-browser-style'
import { ROUTE_CSS } from './route-style'
import { PAGE, ROOT } from './paths'
import { setThemeColor } from '../../lib/preview'

// One header, menu, order window, popup family and footer for every entry.
export function Shell({ children, footer, css }: { children: ReactNode; footer: ReactNode; css: string }) {
  useWatchdog()
  useMjukSkrun()
  useEffect(() => {
    document.documentElement.lang = 'is'
    setThemeColor(C.pappirHreint)
    const hash = location.hash
    // Native page arrival; anchors wait for the fixed header to publish its height.
    if (!hash) window.scrollTo(0, 0)
    const timer = hash ? window.setTimeout(() => faraA(hash), PAGE === 'home' ? 2800 : 100) : 0
    return () => clearTimeout(timer)
  }, [])
  const cameFromSite = document.referrer && new URL(document.referrer).origin === location.origin && new URL(document.referrer).pathname.startsWith(ROOT)
  return <div className={`hb-root hb-route-${PAGE}`} id="top">
    <style>{CSS}{css}{POKA_CSS}{HLEDSLA_CSS}{REGN_CSS}{POP_CSS}{EYD_CSS}{MERKI_CSS}{EXPERIENCE_CSS}{BROWSER_CSS}{ROUTE_CSS}</style>
    <Bendill /><Haus /><Poki /><Popup />
    {PAGE === 'home' && !cameFromSite && <Hledsla />}
    <main>{children}</main>{footer}
  </div>
}
