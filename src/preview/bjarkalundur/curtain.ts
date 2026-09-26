/* The loading curtain. It is painted by the HTML shell before any script of ours has
   arrived (index.html in the catalogue, bjarkalundur.html on the launch build): a dark
   ground, the name set in Nyght Serif once that font is in (never in a fallback), and a
   hairline that fills as the load really progresses. The shell also starts the fonts and
   the hero picture at once instead of after the app bundle (measured 2026-09-26 at
   12 Mbps: the name painted in the fallback serif at 1.38 s and swapped at 1.76 s; the
   desktop hero sat on the small poster until the 3 MB film landed at 3.7 s).

   Here the app takes over the node on screen: it waits for the name's font and the hero
   picture, holds long enough for the name to be read, then lifts the curtain and lets
   the hero letters rise. The film only starts after the lift (whenLifted), so it does
   not compete with the picture and the fonts for the connection. */

const CAP_MS = 4000 /* never hold longer than this after the curtain painted */
const READ_MS = 650 /* the name stays at least this long once it has appeared */

let lifted = typeof document === 'undefined' || !document.getElementById('bjc')
const waiting = new Set<() => void>()

/** Runs cb once the curtain is gone (at once when there is none); returns an unsubscribe. */
export function whenLifted(cb: () => void) {
  if (lifted) { cb(); return () => {} }
  waiting.add(cb)
  return () => { waiting.delete(cb) }
}

function heroReady() {
  const img = document.querySelector<HTMLImageElement>('.bj3 [data-hero] .hero-media img')
  if (!img || (img.complete && img.naturalWidth)) return Promise.resolve()
  return new Promise<void>((done) => {
    img.addEventListener('load', () => done(), { once: true })
    img.addEventListener('error', () => done(), { once: true })
  })
}

function fontsReady() {
  if (!document.fonts?.load) return Promise.resolve()
  return Promise.all([
    document.fonts.load('300 1em bjc'),
    document.fonts.load('300 1em "Nyght Serif"'),
  ]).then(() => {}, () => {})
}

/** Called once the page has mounted. Safe to call twice (StrictMode); a no-op without a
 *  curtain. Leaving the page early needs nothing: the cap still lifts it. */
export function liftCurtain() {
  const el = document.getElementById('bjc')
  if (!el || el.dataset.lifting) return
  el.dataset.lifting = '1'
  const progress = (p: number) => el.style.setProperty('--p', String(Math.max(p, Number(el.style.getPropertyValue('--p')) || 0)))
  progress(0.7)
  const painted = Number(el.dataset.t0) || performance.now()
  let timer = 0

  const go = () => {
    window.clearTimeout(timer)
    if (lifted) return
    lifted = true
    progress(1)
    el.classList.add('out')
    document.documentElement.removeAttribute('data-bjc')
    waiting.forEach((cb) => cb())
    waiting.clear()
    const remove = () => el.remove()
    el.addEventListener('transitionend', (e) => { if (e.target === el) remove() })
    window.setTimeout(remove, 1500)
  }

  const cap = new Promise<void>((done) => window.setTimeout(done, Math.max(0, CAP_MS - (performance.now() - painted))))
  Promise.race([Promise.all([fontsReady(), heroReady().then(() => progress(1))]), cap]).then(() => {
    const shown = Number(el.dataset.shown) || performance.now()
    timer = window.setTimeout(go, Math.max(0, READ_MS - (performance.now() - shown)))
  })
}
