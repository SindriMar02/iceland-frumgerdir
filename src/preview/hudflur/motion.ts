import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/* The motion branch of /preview/hudflur. Behaviour from the live-up.co.jp clean-room rebuild
   (sndr-teardowns PR #3, js/app.js, module numbers in comments). Never started under
   prefers-reduced-motion: the plain render in styles.ts is that branch.

   Two deliberate departures from the reference:
   - live-up fires its masked reveals once from an IntersectionObserver on a 1.2s timer. Here each mask is
     tied to scroll position over a short band (memory: scroll-reveals-must-be-position-tied), so a fast
     flick can never outrun a heading that is still below its mask.
   - live-up runs Lenis everywhere with touch left native. Here Lenis is never constructed on a touch
     device at all (memory: lenis-mobile-damage). */

const isTouch = () => matchMedia('(hover: none) and (pointer: coarse)').matches
const isFine = () => matchMedia('(hover: hover) and (pointer: fine)').matches
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

let pageLenis: Lenis | null = null
/* anchor jumps go through Lenis when it runs (live-up M1: offset -20, duration 1, easeOutCubic) */
export function scrollToHash(hash: string): boolean {
  const target = document.querySelector<HTMLElement>(hash)
  if (!target) return false
  if (pageLenis) pageLenis.scrollTo(target, { offset: -20, duration: 1, easing: easeOutCubic })
  else target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  return true
}

/* M5: the WebGL displacement lens, moved from live-up's hero photo onto the one piece of work that
   sits on the blackletter wall: the cursor drags the ink along a lagging path (follower lerp .015,
   radius .25, x18). Fine pointer, ≥1024px only; the picture underneath stays the real content. */
function initLens(fig: HTMLElement): () => void {
  if (!isFine() || window.innerWidth < 1024) return () => {}
  const img = fig.querySelector('img')
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
  if (!gl || !img) return () => {}
  const VERT = `attribute vec2 aPos; varying vec2 vTex;
    void main(){ vTex = vec2(aPos.x*0.5+0.5, 0.5-aPos.y*0.5); gl_Position = vec4(aPos,0.0,1.0); }`
  /* object-fit: cover done in the shader: uScale crops the texture to the frame's aspect */
  const FRAG = `precision highp float;
    uniform sampler2D uImage; uniform vec2 uPointer; uniform vec2 uDrift; uniform float uAmount; uniform vec2 uScale; varying vec2 vTex;
    void main(){
      float lens = smoothstep(0.25, 0.0, distance(vTex, uPointer));
      vec2 st = vTex - uDrift * lens * uAmount * 18.0;
      st = (st - 0.5) * uScale + 0.5;
      gl_FragColor = texture2D(uImage, clamp(st, 0.0, 1.0));
    }`
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s }
  const prog = gl.createProgram()!
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  gl.useProgram(prog)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
  const uPointer = gl.getUniformLocation(prog, 'uPointer'), uDrift = gl.getUniformLocation(prog, 'uDrift')
  const uAmount = gl.getUniformLocation(prog, 'uAmount'), uScale = gl.getUniformLocation(prog, 'uScale')

  const target = { x: 0.5, y: 0.5 }, follow = { x: 0.5, y: 0.5 }
  let wanted = 0, amount = 0, raf = 0, dead = false
  const fit = () => {
    const dpr = Math.min(window.devicePixelRatio, 2)
    const w = Math.round(fig.clientWidth * dpr), h = Math.round(fig.clientHeight * dpr)
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h) }
    const ia = img.naturalWidth / img.naturalHeight, fa = fig.clientWidth / fig.clientHeight
    gl.uniform2f(uScale, ia > fa ? fa / ia : 1, ia > fa ? 1 : ia / fa)
  }
  /* the loop sleeps once the lens has settled (idle style work 60/s to 0, as on the Dill build) */
  const frame = () => {
    raf = 0
    const px = follow.x, py = follow.y
    follow.x += (target.x - follow.x) * 0.015
    follow.y += (target.y - follow.y) * 0.015
    amount += (wanted - amount) * 0.008
    gl.uniform2f(uPointer, follow.x, follow.y)
    gl.uniform2f(uDrift, follow.x - px, follow.y - py)
    gl.uniform1f(uAmount, amount)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    const moving = Math.abs(target.x - follow.x) + Math.abs(target.y - follow.y) > 0.0005 || Math.abs(wanted - amount) > 0.002
    if (moving && !dead) raf = requestAnimationFrame(frame)
  }
  const wake = () => { if (!raf && !dead) raf = requestAnimationFrame(frame) }
  const onMove = (e: MouseEvent) => {
    const r = fig.getBoundingClientRect()
    target.x = (e.clientX - r.left) / r.width
    target.y = (e.clientY - r.top) / r.height
    wanted = 1
    wake()
  }
  const onLeave = () => { wanted = 0; wake() }
  const start = () => {
    if (dead) return
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    fig.appendChild(canvas)
    fit()
    frame()
    fig.classList.add('is-gl')
    fig.addEventListener('mousemove', onMove)
    fig.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', fit)
  }
  if (img.complete && img.naturalWidth) start()
  else img.addEventListener('load', start, { once: true })
  return () => {
    dead = true
    cancelAnimationFrame(raf)
    img.removeEventListener('load', start)
    fig.removeEventListener('mousemove', onMove)
    fig.removeEventListener('mouseleave', onLeave)
    window.removeEventListener('resize', fit)
    fig.classList.remove('is-gl')
    canvas.remove()
  }
}

export function initHudflurMotion(root: HTMLElement): () => void {
  const offs: Array<() => void> = []
  const mm = gsap.matchMedia()
  mm.add({ wide: '(min-width: 769px)', narrow: '(max-width: 768px)' }, (ctx) => {
    const { wide } = ctx.conditions as { wide: boolean; narrow: boolean }
    const q = gsap.utils.selector(root)

    /* M1 smooth scroll: never a JS scroll surface on a phone, Safari only collapses its toolbar for a native scroll */
    const lenis = isFine() && !isTouch() ? new Lenis({ duration: 1, easing: easeOutCubic, smoothWheel: true, wheelMultiplier: 1 }) : null
    let tick: ((t: number) => void) | null = null
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
      tick = (t: number) => lenis.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      pageLenis = lenis
    }

    /* M4 masked lines, position-tied: 108% to 0 over the band where the line crosses the lower third */
    ;(q('[data-hf-mask] > span') as HTMLElement[]).forEach((inner) => {
      const line = inner.parentElement!
      gsap.fromTo(inner, { yPercent: 108 }, {
        yPercent: 0, ease: 'expo.out',
        scrollTrigger: {
          trigger: line, start: 'top bottom', end: 'top 72%', scrub: 0.4,
          onLeave: (self) => { self.animation?.progress(1); self.kill(); gsap.set(inner, { clearProps: 'transform' }) },
        },
      })
    })
    /* M4 fade recipe (24px, same band) for paragraphs, stats and steps */
    ;(q('[data-hf-fade]') as HTMLElement[]).forEach((el) => {
      gsap.fromTo(el, { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, ease: 'power2.out',
        scrollTrigger: {
          /* the element travels 24px, so the band starts 24px earlier: the trigger is measured where it rests */
          trigger: el, start: 'top-=24 bottom', end: 'top-=24 78%', scrub: 0.4,
          onLeave: (self) => { self.animation?.progress(1); self.kill(); gsap.set(el, { clearProps: 'opacity,visibility,transform' }) },
        },
      })
    })

    /* their own sentence, word by word: each word inks in from 15% as the quote crosses the lower half */
    ;(q('[data-hf-words]') as HTMLElement[]).forEach((pEl) => {
      gsap.fromTo(pEl.children, { opacity: 0.15 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: pEl, start: 'top 85%', end: 'bottom 55%', scrub: 0.4 },
      })
    })

    /* M5 hero layers: the name rises out of the page slower than the paper under it (desktop only, as live-up) */
    if (wide) {
      const hero = q('.hf-hero')[0] as HTMLElement
      gsap.to(q('.hf-hero__lockup'), { yPercent: -14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      /* fromTo: the foot is mid CSS fade-in when this is built, a plain .to would record opacity 0 as its start */
      gsap.fromTo(q('.hf-hero__foot'), { yPercent: 0, autoAlpha: 1 }, { yPercent: -40, autoAlpha: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: hero, start: 'top top', end: '60% top', scrub: true } })
    }

    /* the wall: rows drift against each other like a lettering sleeve turning on the arm, the work rides slower */
    const wall = q('.hf-wall')[0] as HTMLElement
    ;(q('.hf-wall__row') as HTMLElement[]).forEach((row, i) => {
      const dir = i % 2 ? 1 : -1
      gsap.fromTo(row, { xPercent: dir > 0 ? -16 : -4 }, {
        xPercent: dir > 0 ? -4 : -16, ease: 'none',
        scrollTrigger: { trigger: wall, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
    gsap.fromTo(q('.hf-wall__photo'), { yPercent: -44 }, { yPercent: -56, ease: 'none', scrollTrigger: { trigger: wall, start: 'top bottom', end: 'bottom top', scrub: true } })
    const fig = q('.hf-wall__photo')[0] as HTMLElement | undefined
    if (fig) offs.push(initLens(fig))

    /* M6 core-value drift: each photo slides inside its 3:4 frame over the frame's pass */
    ;(q('.hf-frame img') as HTMLElement[]).forEach((im, i) => {
      gsap.fromTo(im, { yPercent: -7 - (i % 2) * 2 }, {
        yPercent: 7 + (i % 2) * 2, ease: 'none',
        scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })

    /* the work cards: the card never moves (it is its own trigger), the picture settles inside it */
    ;(q('.hf-work') as HTMLElement[]).forEach((card) => {
      const im = card.querySelector('img')
      if (!im) return
      gsap.fromTo(im, { autoAlpha: 0, scale: 1.12 }, {
        autoAlpha: 1, scale: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: card, start: 'top bottom', end: 'top 80%', scrub: 0.4,
          onLeave: (self) => { self.animation?.progress(1); self.kill(); gsap.set(im, { clearProps: 'opacity,visibility,transform' }) },
        },
      })
    })

    /* the fitted e-mail's rule draws in under it */
    gsap.fromTo(q('.hf-mail__rule'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: q('.hf-mail')[0] as HTMLElement, start: 'top bottom', end: 'top 60%', scrub: 0.4 } })

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
      if (pageLenis === lenis) pageLenis = null
      offs.splice(0).forEach((f) => f())
    }
  })
  return () => { mm.revert(); offs.splice(0).forEach((f) => f()) }
}

/* the works grid changes height when it re-deals: every later trigger has to be measured again */
export function refreshTriggers(): void {
  requestAnimationFrame(() => ScrollTrigger.refresh())
}
