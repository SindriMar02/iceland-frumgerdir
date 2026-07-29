import { useEffect, useRef, useState } from 'react'

/* ═════════════════════════════════════════════════════════════════════════
   Percentage preloader with a wordmark that fills as the number climbs.

   Observed on kononenkogroup.com: white field, hairline progress bar pinned
   to the top edge, number set large at bottom-left. Their exit transition I
   never captured (the tab wedged), so the upward wipe is my choice.

   The wordmark reveal is the "Text Scroll Read" technique from 21st.dev by
   @youcefbnm (https://21st.dev/@youcefbnm/components/text-scroll-read),
   retargeted: their version sweeps a hard two-stop gradient across text with
   background-clip:text driven by scroll progress. Here the same sweep is
   driven by load progress, so the wordmark is exactly full at 100.

   Adapted rather than pasted:
     · framer-motion dropped, this is one CSS custom property
     · shadcn `cn` and Tailwind arbitrary values dropped for this page's tokens
     · reduced motion gets the wordmark solid and no sweep at all

   The wordmark sits at the hero lockup's exact size and position, so when the
   field wipes away the word appears to stay put and the hero takes over.

   Rules this obeys, all from things that burned earlier builds:
     · counts REAL image decode, never a fake timer
     · hard cap so a slow asset can never hold the page hostage
     · once per session
     · never mounts under prefers-reduced-motion
     · the page is fully in the DOM underneath the entire time
   ═════════════════════════════════════════════════════════════════════════ */

const CAP_MS = 2400          // hard ceiling: a stalled asset never holds the page
const MIN_MS = 1100          // floor: on a warm cache every image is already
                             // complete, so without this the loader mounts and
                             // unmounts in the same tick and you see one frame
const KEY = 'hk-preloader-seen'

export function Preloader({ ink = '#111111', ground = '#ffffff' }: { ink?: string; ground?: string }) {
  const [mounted, setMounted] = useState(false)
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const done = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // ?loader forces it regardless of the session flag, for review and demos
    const forced = new URLSearchParams(window.location.search).has('loader')
    try { if (!forced && sessionStorage.getItem(KEY)) return } catch { /* private mode: show it */ }
    setMounted(true)
    const startedAt = performance.now()

    const imgs = Array.from(document.images)
    const total = Math.max(imgs.length, 1)
    let loaded = imgs.filter((i) => i.complete).length

    const finish = () => {
      if (done.current) return
      done.current = true
      try { sessionStorage.setItem(KEY, '1') } catch { /* ignore */ }
      // Hold for the remainder of the floor so the wordmark actually gets to
      // fill, then let the finished word sit a beat before the field leaves.
      const held = Math.max(0, MIN_MS - (performance.now() - startedAt))
      window.setTimeout(() => setPct(100), held)
      window.setTimeout(() => setLeaving(true), held + 320)
      window.setTimeout(() => setMounted(false), held + 320 + 900)
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

    // creep so the number is never frozen while a large file streams
    const creep = window.setInterval(() => {
      const byTime = Math.round(((performance.now() - startedAt) / MIN_MS) * 92)
      setPct((p) => (p < 92 ? Math.max(p, Math.min(92, byTime)) : p))
    }, 24)
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
      <div className="hk-pre-foot">
        {/* 100 - pct: at 0 the sweep sits fully right (nothing revealed),
            at 100 it has travelled all the way left and the word is solid. */}
        <span className="hk-pre-mark" style={{ backgroundPositionX: `${100 - pct}%` }}>
          Heklusýn
        </span>
        <span className="hk-pre-num">{pct}</span>
      </div>
    </div>
  )
}

export const PRELOADER_CSS = `
.hk-pre{position:fixed;inset:0;z-index:90;pointer-events:none;
  transform:translateY(0);transition:transform .9s cubic-bezier(.17,.84,.44,1)}
.hk-pre.is-out{transform:translateY(-100%)}
.hk-pre-bar{position:absolute;top:0;left:0;right:0;height:2px;transform-origin:left center;
  transition:transform .18s linear}

/* the foot sits exactly where the hero lockup does, so the handoff is seamless */
.hk-pre-foot{position:absolute;left:clamp(18px,3.4vw,52px);right:clamp(18px,3.4vw,52px);
  bottom:clamp(16px,2.6vw,40px);display:flex;align-items:baseline;justify-content:space-between;gap:1.5rem}

/* 21st.dev "Text Scroll Read" sweep: a hard two-stop gradient at 200% width,
   clipped to the glyphs, its x position driven by the percentage. */
.hk-pre-mark{
  font-size:clamp(2.5rem,10.6vw,10.4rem);line-height:.9;letter-spacing:-.03em;font-weight:400;
  background-image:linear-gradient(-90deg,rgba(17,17,17,.12) 50%,rgb(17,17,17) 50%);
  background-size:200% 100%;background-repeat:no-repeat;background-attachment:scroll;
  -webkit-background-clip:text;background-clip:text;color:transparent;
  transition:background-position-x .34s cubic-bezier(.17,.84,.44,1)}

.hk-pre-num{font-size:clamp(.9rem,1.4vw,1.15rem);font-variant-numeric:tabular-nums;
  letter-spacing:.02em;flex:none}

@media (prefers-reduced-motion:reduce){
  .hk-pre-mark{background:none;-webkit-background-clip:border-box;background-clip:border-box;
    color:inherit;transition:none}
}
`
