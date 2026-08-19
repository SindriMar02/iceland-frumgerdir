/**
 * THE LOADER — a flip-book of her own canvases behind her own signature.
 *
 * Every frame is a tight zoom onto HER OWN SIGNATURE on a different canvas,
 * cropped by build-flip-frames.py so each signature lands at the identical
 * position and identical size. Her hand holds dead still; the painting under
 * it — colour, ground, texture, even ink vs white — changes every 115ms.
 *
 * Frames come from the 7 works whose signatures could be located by eye. Add more
 * with public/asaja/mark-signatures.html (drag a box round the signature, Copy
 * JSON) then re-run build-flip-frames.py and bump FRAME_COUNT. Automated
 * detection does NOT work here — five methods tried, see LOADER-HANDOFF.md.
 *
 * The frames are decoded before the loader commits to running, so the strobe
 * never stutters on a cold cache.
 */
import { useEffect, useRef, useState } from 'react'
import { reduceMotion } from './motion'

const BASE = import.meta.env.BASE_URL
const FRAME_COUNT = 5
const FRAME = (i: number) => `${BASE}asaja/flip/${String(i).padStart(3, '0')}.jpg`

/** ms per frame — each canvas needs long enough to actually register as a
 *  different painting; below ~200ms it reads as noise rather than a flip-book */
const FRAME_MS = 260
/** how many frames must decode before we start; the rest stream in behind */
const PRELOAD = 5

export function SignatureFlip({ running }: { running: boolean }) {
  const [idx, setIdx] = useState(0)
  /** frames whose bitmap is decoded and safe to show — the strobe only ever
   *  cycles inside this pool, so a cold cache can never flash a black frame */
  const readyRef = useRef<number[]>([])
  const [readyCount, setReadyCount] = useState(0)
  const order = useRef<number[]>([])

  // deterministic shuffle so the strobe never repeats a run of canvases,
  // but every visitor sees the same sequence
  if (order.current.length === 0) {
    const a = Array.from({ length: FRAME_COUNT }, (_, i) => i)
    for (let i = a.length - 1; i > 0; i--) {
      const j = (i * 7919 + 13) % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    order.current = a
  }

  // decode frames and admit each to the pool only once its bitmap is ready
  useEffect(() => {
    let alive = true
    const admit = async (n: number) => {
      const im = new Image()
      im.decoding = 'async'
      im.src = FRAME(n)
      try {
        await im.decode()
      } catch {
        return // a frame that fails to decode simply never joins the pool
      }
      if (!alive) return
      readyRef.current.push(n)
      setReadyCount(readyRef.current.length)
    }
    // burst the first batch, then trickle the rest so we never saturate the net
    const first = order.current.slice(0, PRELOAD).map(admit)
    void Promise.allSettled(first).then(() => {
      if (!alive) return
      order.current.slice(PRELOAD).forEach((n, i) => {
        window.setTimeout(() => alive && void admit(n), i * 25)
      })
    })
    return () => {
      alive = false
    }
  }, [])

  // the strobe — held until enough frames are decoded to run smoothly
  useEffect(() => {
    if (!running || reduceMotion()) return
    if (readyCount < 3) return
    const id = window.setInterval(() => setIdx((i) => i + 1), FRAME_MS)
    return () => window.clearInterval(id)
  }, [running, readyCount])

  const pool = readyRef.current
  const cur = pool.length ? pool[idx % pool.length] : null

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* the painting, filling the frame */}
      {cur !== null && (
        <img
          src={FRAME(cur)}
          alt=""
          aria-hidden
          decoding="sync"
          className="asaja-flip-frame absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* Only enough veil for the counter to read — the paintings carry themselves.
          No pinned overlay: the signature in EVERY frame is her real one, already
          registered to the same spot by build-flip-frames.py. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,0) 26%)' }}
      />
    </div>
  )
}
