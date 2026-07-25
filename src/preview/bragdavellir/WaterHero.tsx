import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl'

/**
 * Living water for the Bragðavellir hero.
 *
 * The photograph is a calm East-Iceland fjord: the bottom ~40% is still water
 * carrying a mirror reflection of the mountains and the red-roofed house. This
 * component renders that same image through a WebGL fragment shader that
 * disturbs ONLY the water, so the reflection breathes while the land, the
 * house and the sky stay perfectly still.
 *
 * What makes it read as real rather than as a "ripple filter":
 *  1. SLOPING WATERLINE. The shore recedes — water starts at ~0.57 of the
 *     image height on the left and ~0.65 under the house. A flat mask is the
 *     classic tell, so the waterline is a function of x, with a soft ramp so
 *     the effect eases in instead of starting on a hard edge.
 *  2. PERSPECTIVE. Real water compresses toward the horizon. Amplitude grows
 *     and frequency drops as the surface approaches the viewer, so distant
 *     water is fine and glassy while near water has broad, slow swells.
 *  3. VERTICAL-DOMINANT DISPLACEMENT. A reflection smears up and down far more
 *     than sideways, so the y displacement is ~6x the x displacement.
 *  4. LAYERED OCTAVES. Three sine waves at different speeds and angles, so the
 *     motion never visibly repeats.
 *  5. SLOW. Calm fjord water, not a swimming pool: the whole field advances at
 *     roughly a third of "obvious animation" speed.
 *  6. A whisper of specular glint on the wave crests, driven by the derivative
 *     of the wave, so light appears to catch the ripples.
 *
 * Robustness: the plain <img> underneath is always rendered and is what shows
 * under prefers-reduced-motion, without JS, or if WebGL is unavailable — the
 * canvas simply fades in on top once it is genuinely drawing. The rAF loop is
 * parked whenever the hero is off-screen.
 */

const VERT = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

uniform sampler2D uTex;
uniform float uTime;
uniform vec2  uRes;    // canvas size in px
uniform vec2  uImg;    // texture natural size in px
varying vec2 vUv;

/* object-fit: cover, with a focal point — mirrors the CSS on the <img>. */
vec2 coverUv(vec2 uv, vec2 res, vec2 img, vec2 focal) {
  float rRes = res.x / res.y;
  float rImg = img.x / img.y;
  vec2 s = vec2(1.0);
  if (rRes > rImg) s.y = rImg / rRes; else s.x = rRes / rImg;
  vec2 f = vec2(
    clamp(focal.x, s.x * 0.5, 1.0 - s.x * 0.5),
    clamp(focal.y, s.y * 0.5, 1.0 - s.y * 0.5)
  );
  return (uv - 0.5) * s + f;
}

/* The measured shoreline: ~0.57 at the left edge, ~0.65 under the house. */
float waterTop(float x) { return 0.600 + 0.055 * x; }

void main() {
  vec2 uv = coverUv(vUv, uRes, uImg, vec2(0.5, 0.46));

  float top = waterTop(uv.x);
  /* Soft ramp so the surface eases in — never a hard horizontal seam. */
  float inWater = smoothstep(top, top + 0.050, uv.y);

  vec2 disp = vec2(0.0);
  float crest = 0.0;

  if (inWater > 0.001) {
    /* 0 at the waterline (far away), 1 at the bottom edge (closest). */
    float d = clamp((uv.y - top) / max(1.0 - top, 0.001), 0.0, 1.0);

    /* Perspective: tight and shallow far off, broad and deep up close. */
    float freq = mix(120.0, 16.0, d);
    float amp  = mix(0.00035, 0.00680, pow(d, 1.55));
    float t    = uTime * 0.34;

    /* Three octaves, different directions and speeds — no visible repeat. */
    float w =
        sin(uv.y * freq         + t * 1.70)
      + sin(uv.y * freq * 1.73  - t * 1.15 + uv.x *  6.0) * 0.62
      + sin(uv.y * freq * 0.58  + t * 0.72 - uv.x *  3.2) * 0.85;

    /* Sideways motion is a fraction of the vertical smear. */
    float wx =
        sin(uv.x * freq * 0.30 + t * 0.95)
      + sin(uv.x * freq * 0.17 - t * 0.55) * 0.7;

    disp.y = w  * amp * inWater;
    disp.x = wx * amp * 0.17 * inWater;

    /* Crest derivative → where light would catch the ripple. */
    crest = cos(uv.y * freq + t * 1.70) * amp * freq * inWater;
  }

  vec2 sampleUv = clamp(uv + disp, vec2(0.0005), vec2(0.9995));
  vec4 col = texture2D(uTex, sampleUv);

  /* Very restrained glint — enough to feel wet, never sparkly. */
  col.rgb += vec3(0.055) * clamp(crest, 0.0, 1.0);

  gl_FragColor = col;
}
`

export function WaterHero({
  src, alt, className = '', style,
}: {
  src: string; alt: string; className?: string; style?: React.CSSProperties
}) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const wrap = wrapRef.current
    if (!wrap) return

    /* The canvas is created HERE, not rendered by React. React 18 StrictMode
       (and Vite HMR) run effects twice; reusing one canvas element meant the
       second run inherited a context the first run had deliberately lost, and
       silently drew nothing. A fresh canvas per run is always a live context. */
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    /* Opaque from the first frame, and no CSS opacity transition: a
       backgrounded tab freezes transitions and could strand the canvas
       half-visible. It draws the very photo it sits on top of, so appearing
       instantly is imperceptible. */
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'
    wrap.appendChild(canvas)

    /* Everything below is best-effort: if WebGL, the shader, or the texture
       fails for any reason, we bail out silently and the untouched <img>
       remains. A decorative effect must never be able to break the hero. */
    let renderer: Renderer
    try {
      renderer = new Renderer({
        canvas, alpha: true, antialias: false,
        dpr: Math.min(2, window.devicePixelRatio || 1),
      })
    } catch (err) {
      console.warn('[WaterHero] WebGL unavailable:', err)
      canvas.remove()
      return
    }
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)

    let texture: Texture
    let program: Program
    let mesh: Mesh
    try {
      texture = new Texture(gl, { generateMipmaps: false })
      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        transparent: true,
        uniforms: {
          uTex: { value: texture },
          uTime: { value: 0 },
          uRes: { value: [1, 1] },
          uImg: { value: [2000, 1500] },
        },
      })
      mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
    } catch (err) {
      console.warn('[WaterHero] shader/program failed:', err)
      canvas.remove()
      return
    }

    const resize = () => {
      try {
        const r = wrap.getBoundingClientRect()
        if (r.width < 2 || r.height < 2) return
        renderer.setSize(r.width, r.height)
        program.uniforms.uRes.value = [r.width, r.height]
      } catch (err) {
        console.warn('[WaterHero] resize failed:', err)
      }
    }
    resize()
    /* ogl measures once; a ResizeObserver keeps the canvas correct. */
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    let raf = 0
    let visible = true
    let ready = false
    let start = 0

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (!visible || !ready) return
      if (!start) start = t
      program.uniforms.uTime.value = (t - start) / 1000
      /* No fade: the canvas draws the same photograph that sits underneath it,
         so the hand-off is invisible with a hard cut — and there is no ramp
         that a backgrounded tab can freeze halfway. */
      renderer.render({ scene: mesh })
    }

    let used = false
    const use = (im: HTMLImageElement) => {
      if (used) return
      used = true
      try {
        texture.image = im
        program.uniforms.uImg.value = [im.naturalWidth, im.naturalHeight]
        ready = true
        resize()
      } catch (err) {
        console.warn('[WaterHero] texture upload failed:', err)
        canvas.remove()
      }
    }
    /* Source the texture from the <img> React already rendered rather than a
       fresh Image(). A second Image() for the same URL comes from memory cache,
       which makes `complete` true instantly so `onload` never fires, while
       naturalWidth can still be 0 at that moment and decode() may reject for a
       cached WebP — between them every event-based hook can silently miss. The
       rendered element is the one source guaranteed to reach a usable state, so
       we poll it briefly and upload the moment it has real pixels. */
    const el = wrap.querySelector('img')
    let tries = 0
    const waitForPixels = () => {
      if (used) return
      if (el && el.complete && el.naturalWidth > 0) { use(el); return }
      if (tries++ > 180) { console.warn('[WaterHero] hero image never became usable'); return }
      requestAnimationFrame(waitForPixels)
    }
    waitForPixels()

    /* Park the loop whenever the hero is off-screen. */
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting },
      { rootMargin: '120px' },
    )
    io.observe(wrap)

    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      /* Free the GPU context, then drop the element it belonged to — the next
         run builds its own, so nothing can inherit a lost context. */
      const ext = gl.getExtension('WEBGL_lose_context')
      if (ext) ext.loseContext()
      canvas.remove()
    }
  }, [src])

  return (
    <div ref={wrapRef} className={`absolute inset-0 ${className}`} style={style}>
      {/* Always present: this is what shows under reduced motion, without JS,
          or if WebGL is unavailable. The canvas is appended above it and only
          becomes visible once it is genuinely drawing. */}
      <img src={src} alt={alt} loading="eager" decoding="async"
        {...{ fetchpriority: 'high' as const }}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: 'center 46%' }} />
    </div>
  )
}
