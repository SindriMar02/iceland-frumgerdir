/**
 * The home route, split off from every other page.
 *
 * GSAP, ScrollTrigger and Lenis measure 134 KB raw and 49.4 KB gzipped, and
 * they exist for the two ParallaxComponent instances on the home page and for
 * nothing else on this site. Imported statically they sat in the one chunk all
 * thirty-three routes download, so a visitor landing on the contact page paid
 * for a scroll engine they will never run.
 *
 * WHY NOT React.lazy AND A FALLBACK. Every route here is prerendered, so #root
 * already holds the finished page before this code runs and hydrateRoot adopts
 * it. A Suspense boundary that is not ready at hydration renders its fallback,
 * which would tear the finished hero out of the DOM and put it back a moment
 * later — the exact flash this build has been bitten by twice. So there is no
 * fallback and no suspending: the entry AWAITS this module before it hydrates
 * whenever the first paint is the home page (see katrin-main.tsx), which means
 * React finds the component already resolved and never suspends.
 *
 * A client-side navigation TO home later is a different case and safe: the
 * page is interactive, the module is usually already warm, and the view
 * transition covers the swap. That path gets the promise, not the flash.
 */
import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'

type HomeModule = { Home: ComponentType }

/** One promise, shared: awaited by the entry AND read by the component, so
 *  the module is fetched exactly once however the route is reached. */
let pending: Promise<HomeModule> | undefined
let loaded: HomeModule | undefined

export function loadHome(): Promise<HomeModule> {
  if (loaded) return Promise.resolve(loaded)
  pending ||= import('./Home').then((m) => { loaded = m; return m })
  return pending
}

export function HomeRoute() {
  const [mod, setMod] = useState<HomeModule | undefined>(loaded)
  useEffect(() => {
    if (mod) return
    let alive = true
    loadHome().then((m) => { if (alive) setMod(m) })
    return () => { alive = false }
  }, [mod])
  if (!mod) return null
  const Home = mod.Home
  return <Home />
}
