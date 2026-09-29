/* Teitur motion: the Valecampus vocabulary (sndr-teardowns PR #4, TEARDOWN.md M02 to M06), re-implemented with no
   library and no scroll pin. Everything is one class toggle:
     [data-lines]            masked line-by-line headline reveal, each line .15s after the last (M6)
     [data-reveal="fade"]    opacity, delayed until the headline has landed (M02)
     [data-reveal="crop"]    3% inset clip-path crop on big panels, 1s (M04)
     [data-parallax]         one +-15% drift over a viewport of scroll, transform only (M05)
   Content is visible by default; the root only gets `tj-motion` (which hides it) once this has run, so a failure
   leaves a plain page. Fine pointers only for parallax: on a touch device nothing moves under the finger. */

const fine = () => window.matchMedia('(hover:hover) and (pointer:fine)').matches

/* Greedy line split by measurement: words go into inline spans, offsetTop groups them into lines, then each line is
   rebuilt as mask > line. The accessible name stays on the heading; the split spans are hidden from the tree. */
function splitLines(el: HTMLElement) {
  const text = el.dataset.text ?? (el.textContent ?? '').replace(/\s+/g, ' ').trim()
  el.dataset.text = text
  el.classList.remove('is-split')
  el.textContent = ''
  const words = text.split(' ')
  const spans = words.map((w) => {
    const s = document.createElement('span')
    s.textContent = w
    s.style.display = 'inline-block'
    el.appendChild(s)
    el.appendChild(document.createTextNode(' '))
    return s
  })
  const lines: string[][] = []
  let top = -1
  spans.forEach((s, i) => {
    const y = s.offsetTop
    if (top < 0 || Math.abs(y - top) > 2) { lines.push([]); top = y }
    lines[lines.length - 1].push(words[i])
  })
  el.textContent = ''
  el.setAttribute('aria-label', text)
  lines.forEach((ws, i) => {
    const mask = document.createElement('span')
    mask.className = 'tj-lm'
    mask.setAttribute('aria-hidden', 'true')
    const line = document.createElement('span')
    line.className = 'tj-ll'
    line.style.setProperty('--i', String(i))
    line.textContent = ws.join(' ')
    mask.appendChild(line)
    el.appendChild(mask)
  })
  el.classList.add('is-split')
}

export function initTeiturMotion(root: HTMLElement): () => void {
  const lineEls = Array.from(root.querySelectorAll<HTMLElement>('[data-lines]'))
  const revealEls = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
  const parallax = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'))
  let dead = false
  let lastW = window.innerWidth
  let resizeT = 0

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('is-in'); io?.unobserve(e.target) } })
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 })
    : null

  const start = () => {
    if (dead) return
    lineEls.forEach(splitLines)
    const targets = [...lineEls, ...revealEls]
    if (io) targets.forEach((el) => io.observe(el))
    else targets.forEach((el) => el.classList.add('is-in'))
  }
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
  const timer = window.setTimeout(start, 1600)
  if (fonts?.ready) fonts.ready.then(() => { window.clearTimeout(timer); start() })
  else { window.clearTimeout(timer); start() }

  /* re-split on a real width change only; on touch the URL bar changes the height mid-fling and must not touch layout */
  const onResize = () => {
    if (window.innerWidth === lastW) return
    lastW = window.innerWidth
    window.clearTimeout(resizeT)
    resizeT = window.setTimeout(() => { if (!dead) lineEls.forEach((el) => { const was = el.classList.contains('is-in'); splitLines(el); if (was) el.classList.add('is-in') }) }, 180)
  }
  window.addEventListener('resize', onResize)

  let raf = 0
  const onScroll = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      const vh = window.innerHeight
      parallax.forEach((el, i) => {
        /* single-column layouts stack the cards with a small gap: no drift there, it would run them into each other */
        if (window.innerWidth <= 820) { el.style.transform = ''; return }
        const r = el.parentElement?.getBoundingClientRect()
        if (!r || r.bottom < -vh || r.top > vh * 2) return
        const p = Math.min(1, Math.max(0, (vh - r.top) / vh))
        const sign = el.dataset.parallax === 'down' ? 1 : el.dataset.parallax === 'up' ? -1 : i % 2 === 0 ? -1 : 1
        el.style.transform = `translate3d(0,${(sign * 0.15 * el.offsetHeight * (p - 0.5)).toFixed(1)}px,0)`
      })
    })
  }
  if (parallax.length && fine()) { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() }

  return () => {
    dead = true
    window.clearTimeout(timer)
    window.clearTimeout(resizeT)
    cancelAnimationFrame(raf)
    io?.disconnect()
    window.removeEventListener('resize', onResize)
    window.removeEventListener('scroll', onScroll)
    lineEls.forEach((el) => {
      if (el.dataset.text) el.textContent = el.dataset.text
      delete el.dataset.text
      el.classList.remove('is-split', 'is-in')
      el.removeAttribute('aria-label')
    })
    revealEls.forEach((el) => el.classList.remove('is-in'))
    parallax.forEach((el) => { el.style.transform = '' })
  }
}
