/**
 * The one-canvas WebGL image pipeline (KONONENKO-BRIEF §1). A single fixed
 * full-viewport <canvas>, THREE orthographic camera mapped 1:1 to CSS
 * pixels, every image on the page a plane synced every frame to its DOM
 * twin's getBoundingClientRect(). No per-image canvases.
 *
 * Capability gate lives here too: no WebGL / prefers-reduced-motion /
 * coarse pointer (touch) ⇒ the engine never constructs a renderer at all,
 * `register()` becomes a no-op, and the DOM <img> twins (already in the
 * markup for SSR/SEO/a11y) simply stay visible — exactly the reference's
 * own graceful-degradation shape.
 */
import * as THREE from 'three'
import { MEDIA_FRAG, SKETCH_FRAG, VERT } from './shaders'

export type ShaderKind = 'media' | 'sketch'

export interface RegisterOpts {
  /** The visible, hit-testable wrapper box (its rect drives the plane's
   *  screen position/size every frame). Never itself visibility:hidden. */
  wrapper: HTMLElement
  /** The real <img> — hidden (visibility) once the plane is confirmed
   *  rendering; texture is built directly from this element (no 2nd
   *  network fetch). */
  img: HTMLImageElement
  shader: ShaderKind
  /** Hairline shader border in CSS px (media only). 0 = none. */
  borderPx?: number
  borderColor?: [number, number, number]
}

export interface PlaneHandle {
  /** Pointer position in element-local UV space (0..1, y already flipped
   *  to WebGL's bottom-left origin) + hover on/off, sketch planes only.
   *  uParallax/uProgress are NOT exposed here — the engine's own tick()
   *  derives both directly from the same getBoundingClientRect() it reads
   *  for plane transforms every frame, per KONONENKO-BRIEF §2 formulas, so
   *  there is exactly one rect read per plane per frame, not two. */
  setPointer(u: number, v: number, hovering: boolean): void
  destroy(): void
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

let noiseTexture: THREE.Texture | null = null

function loadNoiseTexture(base: string): THREE.Texture {
  if (noiseTexture) return noiseTexture
  const loader = new THREE.TextureLoader()
  const tex = loader.load(`${base}heklusyn/noise.png`)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.generateMipmaps = false
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  noiseTexture = tex
  return tex
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

interface Plane {
  wrapper: HTMLElement
  img: HTMLImageElement
  shader: ShaderKind
  mesh: THREE.Mesh
  material: THREE.ShaderMaterial
  texture: THREE.Texture
  observer: IntersectionObserver
  visible: boolean
  expandCurrent: number
  expandTarget: number
  hoverCurrent: number
  hoverTarget: number
}

export class CanvasEngine {
  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.OrthographicCamera
  private planes = new Set<Plane>()
  private raf = 0
  private running = true
  private width = 0
  private height = 0
  private base: string

  constructor(base: string) {
    this.base = base
    this.canvas = document.createElement('canvas')
    this.canvas.setAttribute('data-hk-webgl', '')
    Object.assign(this.canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '1',
    } as CSSStyleDeclaration)
    document.body.appendChild(this.canvas)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })
    this.renderer.setClearColor(0x000000, 0)
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000)
    this.camera.position.z = 100
    this.resize()
    window.addEventListener('resize', this.onResize)
    this.raf = requestAnimationFrame(this.tick)
  }

  private onResize = () => this.resize()

  private resize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.camera.left = -this.width / 2
    this.camera.right = this.width / 2
    this.camera.top = this.height / 2
    this.camera.bottom = -this.height / 2
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.setSize(this.width, this.height, true)
  }

  register(opts: RegisterOpts): PlaneHandle {
    const { wrapper, img, shader, borderPx = 0, borderColor = [0.886, 0.886, 0.886] } = opts

    const geometry = new THREE.PlaneGeometry(1, 1)
    const texture = new THREE.Texture(img)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping

    const markReady = () => { texture.needsUpdate = true }
    if (img.complete && img.naturalWidth > 0) markReady()
    else img.addEventListener('load', markReady, { once: true })

    let material: THREE.ShaderMaterial
    if (shader === 'media') {
      material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: MEDIA_FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTexture: { value: texture },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uImageSize: { value: new THREE.Vector2(1, 1) },
          uParallax: { value: new THREE.Vector2(0.5, 0.5) },
          uStrength: { value: 0.12 },
          uContain: { value: 0 },
          uZoom: { value: 1 },
          uBgColor: { value: new THREE.Vector3(1, 1, 1) },
          uBgOpacity: { value: 0 },
          uBorderColor: { value: new THREE.Vector3(...borderColor) },
          uBorderPx: { value: borderPx },
          uPaddingPx: { value: 0 },
          uOpacity: { value: 1 },
        },
      })
    } else {
      material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: SKETCH_FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTexture: { value: texture },
          uNoiseTex: { value: loadNoiseTexture(this.base) },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uImageSize: { value: new THREE.Vector2(1, 1) },
          uProgress: { value: 0 },
          uSoftness: { value: 0.15 },
          uOpacity: { value: 1 },
          uMouse: { value: new THREE.Vector2(-1, -1) },
          uHover: { value: 0 },
          uCircleRadius: { value: 0.14 },
          uCircleSoftness: { value: 0.1 },
          uExpandRadius: { value: 0 },
        },
      })
    }

    const mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = false
    this.scene.add(mesh)

    const plane: Plane = {
      wrapper, img, shader, mesh, material, texture,
      observer: null as unknown as IntersectionObserver,
      visible: true,
      expandCurrent: 0, expandTarget: 0,
      hoverCurrent: 0, hoverTarget: 0,
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) plane.visible = e.isIntersecting
        mesh.visible = plane.visible
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0 },
    )
    io.observe(wrapper)
    plane.observer = io

    this.planes.add(plane)
    img.style.visibility = 'hidden'

    const handle: PlaneHandle = {
      setPointer: (u: number, v: number, hovering: boolean) => {
        const mu = material.uniforms.uMouse as { value: THREE.Vector2 }
        mu.value.set(u, v)
        plane.hoverTarget = hovering ? 1 : 0
        plane.expandTarget = hovering ? 0.55 : 0
      },
      destroy: () => {
        io.disconnect()
        this.scene.remove(mesh)
        geometry.dispose()
        material.dispose()
        texture.dispose()
        this.planes.delete(plane)
        img.style.visibility = ''
      },
    }
    return handle
  }

  private tick = () => {
    if (!this.running) return
    for (const plane of this.planes) {
      if (!plane.visible) continue
      const rect = plane.wrapper.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) continue

      plane.mesh.position.set(
        rect.left + rect.width / 2 - this.width / 2,
        this.height / 2 - (rect.top + rect.height / 2),
        0,
      )
      plane.mesh.scale.set(rect.width, rect.height, 1)

      const res = plane.material.uniforms.uResolution as { value: THREE.Vector2 }
      res.value.set(rect.width, rect.height)

      const imgSize = plane.material.uniforms.uImageSize as { value: THREE.Vector2 } | undefined
      if (imgSize && plane.img.naturalWidth) {
        imgSize.value.set(plane.img.naturalWidth, plane.img.naturalHeight)
      }

      /* uParallax.y: 0 when the plane enters at the bottom of the viewport,
         1 when it leaves at the top (KONONENKO-BRIEF §2). Reset to the
         shader's own neutral (.5,.5) is unnecessary here since invisible
         planes already skip this whole block (mesh.visible=false, culled
         by the IO above) and the shader itself no-ops on discard elsewhere. */
      if (plane.shader === 'media') {
        const parallaxU = plane.material.uniforms.uParallax as { value: THREE.Vector2 }
        const p = clamp01((this.height - rect.top) / (this.height + rect.height))
        parallaxU.value.set(0.5, p)
      } else {
        /* uProgress: 0..1 across the plane's first 80% of viewport travel. */
        const progressU = plane.material.uniforms.uProgress as { value: number }
        progressU.value = clamp01((this.height - rect.top) / (this.height * 0.8))

        plane.expandCurrent += (plane.expandTarget - plane.expandCurrent) * 0.12
        plane.hoverCurrent += (plane.hoverTarget - plane.hoverCurrent) * 0.18
        const expandU = plane.material.uniforms.uExpandRadius as { value: number }
        const hoverU = plane.material.uniforms.uHover as { value: number }
        expandU.value = plane.expandCurrent
        hoverU.value = plane.hoverCurrent
      }
    }
    this.renderer.render(this.scene, this.camera)
    this.raf = requestAnimationFrame(this.tick)
  }

  dispose() {
    this.running = false
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    for (const plane of Array.from(this.planes)) {
      plane.observer.disconnect()
      this.scene.remove(plane.mesh)
      plane.mesh.geometry.dispose()
      plane.material.dispose()
      plane.texture.dispose()
      plane.img.style.visibility = ''
    }
    this.planes.clear()
    if (noiseTexture) { noiseTexture.dispose(); noiseTexture = null }
    this.renderer.dispose()
    this.canvas.remove()
  }
}
