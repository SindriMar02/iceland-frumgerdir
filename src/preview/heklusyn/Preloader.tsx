import { useEffect, useRef, useState } from 'react'

/* ═════════════════════════════════════════════════════════════════════════
   Percentage preloader.

   Observed on kononenkogroup.com: a white field, a hairline black progress
   bar pinned to the very top edge, and the number set large at bottom-left.
   Their exact exit transition I did not capture (the tab wedged before I
   could measure it), so the upward wipe here is my choice, not a measurement.

   Everything else is governed by the rules that burned earlier builds:
     · counts REAL image decode, never a fake timer
     · hard cap so a slow asset can never hold the page hostage
     · once per session
     · never mounts under prefers-reduced-motion
     · the page is fully in the DOM underneath the whole time, so a crawler,
       a JS failure or a paused rAF simply never sees this element
   ═════════════════════════════════════════════════════════════════════════ */

const CAP_MS = 2400
const KEY = 'hk-preloader-seen'

export function Preloader({ ink = '#111111', ground = '#ffffff' }: { ink?: string; ground?: string }) {
  const [mounted, setMounted] = useState(false)
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const done = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    try { if (sessionStorage.getItem(KEY)) return } catch { /* private mode: just show it */ }
    setMounted(true)

    const imgs = Array.from(document.images)
    const total = Math.max(imgs.length, 1)
    let loaded = imgs.filter((i) => i.complete).length

    const finish = () => {
      if (done.current) return
      done.current = true
      try { sessionStorage.setItem(KEY, '1') } catch { /* ignore */ }
      setPct(100)
      // let 100 sit for a beat, then wipe
      window.setTimeout(() => setLeaving(true), 180)
      window.setTimeout(() => setMounted(false), 180 + 900)
    }

    const bump = () => {
      loaded += 1
      const next = Math.min(99, Math.round((loaded / total) * 100))
      setPct((p) => (next > p ? next : p))
      if (loaded >= total) finish()
    }

    imgs.forEach((i) => {
      if (i.complete) return
      i.addEventListener('load', bump, { once: true })
      i.addEventListener('error', bump, { once: true })
    })

    // creep upward so the number is never frozen while a big file streams
    const creep = window.setInterval(() => {
      setPct((p) => (p < 92 ? p + 1 : p))
    }, 26)

    // the cap: whatever happens, the page is released
    const cap = window.setTimeout(finish, CAP_MS)
    if (loaded >= total) finish()

    return () => {
      window.clearInterval(creep)
      window.clearTimeout(cap)
      imgs.forEach((i) => { i.removeEventListener('load', bump); i.removeEventListener('error', bump) })
    }
  }, [])

  if (!mounted) return null

  return (
    <div className={`hk-pre${leaving ? ' is-out' : ''}`} aria-hidden style={{ background: ground, color: ink }}>
      <span className="hk-pre-bar" style={{ background: ink, transform: `scaleX(${pct / 100})` }} />
      <span className="hk-pre-num">{pct}</span>
    </div>
  )
}

export const PRELOADER_CSS = `
.hk-pre{position:fixed;inset:0;z-index:90;pointer-events:none;
  transform:translateY(0);transition:transform .9s cubic-bezier(.17,.84,.44,1)}
.hk-pre.is-out{transform:translateY(-100%)}
.hk-pre-bar{position:absolute;top:0;left:0;right:0;height:2px;transform-origin:left center;
  transition:transform .18s linear}
.hk-pre-num{position:absolute;left:clamp(18px,3.4vw,52px);bottom:clamp(16px,2.6vw,40px);
  font-size:clamp(2.5rem,10.6vw,10.4rem);line-height:.9;letter-spacing:-.03em;font-weight:400;
  font-variant-numeric:tabular-nums}
`
