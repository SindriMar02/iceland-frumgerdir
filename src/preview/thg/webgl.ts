import * as THREE from 'three'
import { THG_PLANE_VERT, THG_MEDIA_FRAG, THG_SKETCH_FRAG } from './shaders'

/**
 * THG Arkitektar — the one-canvas image pipeline (KONONENKO-BRIEF.md §system).
 *
 * A single fixed THREE.js canvas renders every `[data-thg-plane]` element on
 * the page as a plane, synced to that element's own DOM `getBoundingClientRect()`
 * every animation frame — so it tracks Lenis-smoothed scroll for free (Lenis
 * writes real `window.scrollY`, it doesn't transform a wrapper, so rects are
 * already correct wherever Lenis is in its smoothing). The DOM `<img>` inside
 * each plane element is the SSR/SEO/no-JS/no-WebGL source of truth and stays
 * visible until its own texture is confirmed decoded, then (only then) is
 * hidden — never before the pipeline can actually show something in its place.
 *
 * Two shaders, per KONONENKO-BRIEF.md's "which images get which shader"
 * device:
 *  - `data-thg-plane="media"`  → THG_MEDIA_FRAG  (photographs: in-plane
 *    parallax + optional shader hairline border, Innandyra grid)
 *  - `data-thg-plane="sketch"` → THG_SKETCH_FRAG (ink-sketch develop +
 *    cursor hover lens, the work grid + the three method blocks)
 *
 * Caller contract (see Page.tsx): only call `initThgImagePipeline` inside
 * a `prefers-reduced-motion: no-preference` AND `pointer: fine` branch —
 * this module does its own WebGL-support probe and returns `null` if
 * unavailable, but does NOT itself check motion/touch preferences, so the
 * caller is what actually implements "No-WebGL/reduced-motion/touch ⇒
 * plain DOM images."
 */

export type ThgPlaneKind = 'media' | 'sketch'

interface PlaneRecord {
  el: HTMLElement
  img: HTMLImageElement
  kind: ThgPlaneKind
  mesh: THREE.Mesh
  material: THREE.ShaderMaterial
  ready: boolean
  onscreen: boolean
  border: boolean
  /** sketch-only hover state, eased toward its target every frame */
  hoverT: number
  hoverTarget: number
  expandR: number
  expandTarget: number
  mouseX: number
  mouseY: number
}

export interface ThgImagePipelineHandle {
  dispose: () => void
}

function probeWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export function initThgImagePipeline(root: HTMLElement): ThgImagePipelineHandle | null {
  if (typeof window === 'undefined' || !probeWebGL()) return null

  const planeEls = Array.from(root.querySelectorAll<HTMLElement>('[data-thg-plane]'))
  if (planeEls.length === 0) return null

  const canvas = document.createElement('canvas')
  canvas.className = 'thg-gl-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  root.insertBefore(canvas, root.firstChild)

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
  } catch {
    canvas.remove()
    return null
  }
  // Pass-through colour: the fragment shaders sample sRGB-encoded JPEG
  // texels and write them straight to gl_FragColor with no linear-light
  // math anywhere in either shader, so the renderer must not re-encode the
  // framebuffer either — that would double-gamma the image (washed out,
  // too bright). NoColorSpace keeps every plane pixel-identical to the
  // <img> it stands in for.
  // NOTE: renderer.outputColorSpace = NoColorSpace THROWS in this three
  // version (no drawing-buffer config for it) and killed the whole React
  // tree on mount. Textures below opt out of color management individually,
  // which achieves the same no-double-gamma goal safely.
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

  const scene = new THREE.Scene()
  let vw = window.innerWidth
  let vh = window.innerHeight
  // Orthographic camera mapped 1:1 to CSS pixels, origin at viewport
  // centre, +Y up — mesh positions below are derived directly from
  // getBoundingClientRect() (origin top-left, +Y down) with a single
  // flip, so "1 world unit == 1 CSS pixel" everywhere.
  const camera = new THREE.OrthographicCamera(-vw / 2, vw / 2, vh / 2, -vh / 2, 0.1, 2000)
  camera.position.z = 10

  const noiseTex = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}thg/noise.png`)
  noiseTex.wrapS = THREE.RepeatWrapping
  noiseTex.wrapT = THREE.RepeatWrapping
  noiseTex.colorSpace = THREE.NoColorSpace

  const records: PlaneRecord[] = []
  const byEl = new Map<Element, PlaneRecord>()
  const fine = window.matchMedia('(pointer: fine)').matches
  const controller = new AbortController()
  const { signal } = controller

  for (const el of planeEls) {
    const img = el.querySelector('img')
    if (!img) continue
    const kind: ThgPlaneKind = el.dataset.thgPlane === 'sketch' ? 'sketch' : 'media'
    const border = el.dataset.thgBorder === '1'

    const uniforms: Record<string, THREE.IUniform> =
      kind === 'media'
        ? {
            uTexture: { value: null },
            uResolution: { value: new THREE.Vector2(1, 1) },
            uImageSize: { value: new THREE.Vector2(1, 1) },
            uParallax: { value: new THREE.Vector2(0.5, 0.5) },
            uStrength: { value: 0.12 },
            uContain: { value: 0 },
            uZoom: { value: 1 },
            uBgColor: { value: new THREE.Color(0xffffff) },
            uBgOpacity: { value: 0 },
            uBorderColor: { value: new THREE.Color(0x111111) },
            uBorderPx: { value: border ? 1.5 : 0 },
            uPaddingPx: { value: 0 },
            uOpacity: { value: 0 },
          }
        : {
            uTexture: { value: null },
            uNoiseTex: { value: noiseTex },
            uResolution: { value: new THREE.Vector2(1, 1) },
            uImageSize: { value: new THREE.Vector2(1, 1) },
            uProgress: { value: 0 },
            uSoftness: { value: 0.14 },
            uOpacity: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uHover: { value: 0 },
            uCircleRadius: { value: 0.17 },
            uCircleSoftness: { value: 0.08 },
            uExpandRadius: { value: 0 },
          }

    const material = new THREE.ShaderMaterial({
      vertexShader: THG_PLANE_VERT,
      fragmentShader: kind === 'media' ? THG_MEDIA_FRAG : THG_SKETCH_FRAG,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
    mesh.visible = false
    mesh.frustumCulled = false
    scene.add(mesh)

    const rec: PlaneRecord = {
      el,
      img,
      kind,
      mesh,
      material,
      ready: false,
      onscreen: false,
      border,
      hoverT: 0,
      hoverTarget: 0,
      expandR: 0,
      expandTarget: 0,
      mouseX: 0.5,
      mouseY: 0.5,
    }
    records.push(rec)
    byEl.set(el, rec)

    const onLoad = () => {
      if (rec.ready) return
      const tex = new THREE.Texture(img)
      tex.colorSpace = THREE.NoColorSpace
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = false
      tex.needsUpdate = true
      material.uniforms.uTexture.value = tex
      material.uniforms.uImageSize.value.set(img.naturalWidth || 1, img.naturalHeight || 1)
      material.uniforms.uOpacity.value = 1
      rec.ready = true
      img.style.visibility = 'hidden'
    }
    if (img.complete && img.naturalWidth > 0) onLoad()
    else img.addEventListener('load', onLoad, { once: true, signal })

    if (kind === 'sketch' && fine) {
      el.addEventListener('pointerenter', () => {
        rec.hoverTarget = 1
        rec.expandTarget = 0.95
      }, { signal })
      el.addEventListener('pointerleave', () => {
        rec.hoverTarget = 0
        rec.expandTarget = 0
      }, { signal })
      el.addEventListener('pointermove', (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        rec.mouseX = (e.clientX - r.left) / Math.max(r.width, 1)
        rec.mouseY = 1 - (e.clientY - r.top) / Math.max(r.height, 1)
      }, { signal })
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const rec = byEl.get(entry.target)
        if (!rec) continue
        rec.onscreen = entry.isIntersecting
        if (!entry.isIntersecting && rec.kind === 'media') {
          // "reset to (.5,.5) offscreen" — KONONENKO-BRIEF.md media-shader spec.
          rec.material.uniforms.uParallax.value.set(0.5, 0.5)
        }
      }
    },
    { rootMargin: '240px 0px', threshold: 0 },
  )
  records.forEach((r) => io.observe(r.el))

  function resize() {
    vw = window.innerWidth
    vh = window.innerHeight
    renderer.setSize(vw, vh, false)
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    camera.left = -vw / 2
    camera.right = vw / 2
    camera.top = vh / 2
    camera.bottom = -vh / 2
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize, { signal })

  let raf = 0
  let running = true
  const onVisibility = () => {
    running = !document.hidden
    if (running && !raf) raf = requestAnimationFrame(frame)
  }
  document.addEventListener('visibilitychange', onVisibility, { signal })

  function frame() {
    raf = 0
    if (!running) return
    for (const rec of records) {
      if (!rec.ready || !rec.onscreen) {
        rec.mesh.visible = false
      } else {
        rec.mesh.visible = true
        const r = rec.el.getBoundingClientRect()
        const w = Math.max(r.width, 0.001)
        const h = Math.max(r.height, 0.001)
        rec.mesh.position.set(r.left + w / 2 - vw / 2, vh / 2 - (r.top + h / 2), 0)
        rec.mesh.scale.set(w, h, 1)
        rec.material.uniforms.uResolution.value.set(w, h)

        if (rec.kind === 'media') {
          const t = clamp01((vh - r.top) / (vh + h))
          rec.material.uniforms.uParallax.value.set(0.5, t)
        } else {
          const p = clamp01((vh - r.top) / (vh * 0.8))
          rec.material.uniforms.uProgress.value = p
          rec.hoverT += (rec.hoverTarget - rec.hoverT) * 0.22
          rec.expandR += (rec.expandTarget - rec.expandR) * 0.055
          rec.material.uniforms.uHover.value = rec.hoverT
          rec.material.uniforms.uExpandRadius.value = rec.expandR
          rec.material.uniforms.uMouse.value.set(rec.mouseX, rec.mouseY)
        }
      }
    }
    renderer.render(scene, camera)
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  const onContextLost = (e: Event) => {
    e.preventDefault()
    running = false
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    // Graceful degrade: fall back to the DOM images rather than an empty canvas.
    records.forEach((r) => { r.img.style.visibility = '' })
    canvas.style.display = 'none'
  }
  canvas.addEventListener('webglcontextlost', onContextLost, { signal })

  return {
    dispose() {
      running = false
      if (raf) cancelAnimationFrame(raf)
      controller.abort()
      io.disconnect()
      records.forEach((r) => {
        r.img.style.visibility = ''
        r.mesh.geometry.dispose()
        r.material.dispose()
        const tex = r.material.uniforms.uTexture?.value as THREE.Texture | null
        tex?.dispose()
        scene.remove(r.mesh)
      })
      noiseTex.dispose()
      renderer.dispose()
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    },
  }
}
