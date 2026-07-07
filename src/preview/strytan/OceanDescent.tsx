import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Strýtan — a real WebGL descent. A full-screen GLSL water column (volumetric
 * light shafts, caustic shimmer, a soft glowing hydrothermal vent) plus a
 * drifting, additively-blended marine-snow field for depth and luminosity.
 * Depth follows scroll via `depthRef` (no React re-render per frame); DPR
 * capped; reduced-motion renders one still frame.
 *
 * NB: renders directly (no three/examples postprocessing) — importing those
 * pulls a 2nd copy of three under Vite ("Multiple instances of Three.js") and
 * breaks at runtime. The glow is baked into the shader instead.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uDepth;
  uniform vec2  uRes;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i+vec2(1.,0.)), c = hash(i+vec2(0.,1.)), d = hash(i+vec2(1.,1.));
    vec2 u = f*f*(3.-2.*f);
    return mix(a,b,u.x) + (c-a)*u.y*(1.-u.x) + (d-b)*u.x*u.y;
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;                 // 0..1, y up
    float depth = clamp(uDepth, 0.0, 1.0);
    float aspect = uRes.x / max(uRes.y, 1.0);

    // ---- base water column: brighter toward the top (surface light) ----
    vec3 surface = vec3(0.36, 0.74, 0.82);
    vec3 mid     = vec3(0.035, 0.22, 0.30);
    vec3 deep    = vec3(0.006, 0.035, 0.065);
    vec3 water = mix(mid, surface, pow(clamp(uv.y,0.0,1.0), 1.35));
    water = mix(water, deep, smoothstep(0.12, 1.0, depth));
    water *= 0.9 + 0.1*fbm(uv*2.0 + vec2(0.0, uTime*0.02));

    // ---- volumetric god-ray shafts (soft, additive) ----
    float rays = 0.0;
    float sx = (uv.x - 0.5)*1.3 + (1.0 - uv.y)*0.18;
    for(int i=0;i<3;i++){
      float fi = float(i);
      float w = sx*(7.0 + fi*3.5) + uTime*(0.12 + fi*0.045) + fi*2.7;
      rays += smoothstep(0.45, 1.0, 0.5 + 0.5*sin(w));
    }
    rays *= smoothstep(0.0, 0.7, uv.y);
    rays *= (1.0 - uv.y*0.30);
    rays *= (1.0 - smoothstep(0.0, 0.55, depth));
    rays *= 0.5;

    // ---- caustic shimmer near the surface ----
    float caus = fbm(vec2(uv.x*3.4, uv.y*3.0) + vec2(uTime*0.06, uTime*0.03));
    caus = smoothstep(0.58, 0.92, caus) * smoothstep(0.35, 1.0, uv.y);
    caus *= (1.0 - smoothstep(0.0, 0.5, depth)) * 0.55;

    // ---- warm hydrothermal-vent glow rising from the bottom (soft bloom feel) ----
    float warmth = smoothstep(0.42, 1.0, depth);
    vec2 gp = vec2((uv.x - 0.5)*aspect, uv.y + 0.05);
    float gd = length(gp);
    float halo = warmth * exp(-gd*1.7);          // wide soft halo
    float mids = warmth * exp(-gd*3.4);
    float core = warmth * exp(-gd*7.5);          // hot core

    vec3 col = water;
    col += vec3(0.62, 0.88, 0.94) * rays;
    col += vec3(0.48, 0.74, 0.80) * caus;
    col += vec3(0.95, 0.55, 0.24) * halo * 0.9;
    col += vec3(1.00, 0.68, 0.34) * mids * 0.8;
    col += vec3(1.00, 0.86, 0.60) * core;

    // grain + vignette
    col += (hash(uv*uRes + uTime) - 0.5) * 0.022;
    float vig = smoothstep(1.25, 0.32, length(uv - 0.5));
    col *= mix(0.78, 1.0, vig);

    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`

function makeParticleTexture(): THREE.Texture {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(222,244,248,0.5)')
  g.addColorStop(1, 'rgba(222,244,248,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

export default function OceanDescent({ depthRef }: { depthRef: React.MutableRefObject<number> }) {
  const mountRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(coarse ? 1.25 : 1.5, window.devicePixelRatio || 1))
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const uniforms = {
      uTime: { value: 0 },
      uDepth: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
    }
    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, depthTest: false, depthWrite: false }),
    )
    scene.add(quad)

    // marine-snow particles
    const COUNT = coarse ? 130 : 260
    const pos = new Float32Array(COUNT * 3)
    const scl = new Float32Array(COUNT)
    const spd = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * 1.15
      pos[i * 3 + 1] = Math.random() * 2 - 1
      pos[i * 3 + 2] = 0.05
      const z = 0.35 + Math.random() * 0.65
      scl[i] = z
      spd[i] = 0.03 + z * 0.09 // NDC units per second
    }
    const pgeo = new THREE.BufferGeometry()
    pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    pgeo.setAttribute('aScale', new THREE.BufferAttribute(scl, 1))
    const ptex = makeParticleTexture()
    const pmat = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTex: { value: ptex }, uPix: { value: 1 }, uDepth: uniforms.uDepth },
      vertexShader: /* glsl */ `
        attribute float aScale;
        uniform float uPix;
        uniform float uDepth;
        varying float vA;
        void main(){
          vA = aScale * (0.55 + (1.0 - uDepth) * 0.5);
          gl_Position = vec4(position.xy, 0.0, 1.0);
          gl_PointSize = aScale * 9.0 * uPix;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTex;
        varying float vA;
        void main(){
          vec4 t = texture2D(uTex, gl_PointCoord);
          gl_FragColor = vec4(t.rgb, t.a * vA * 0.55);
        }
      `,
    })
    const points = new THREE.Points(pgeo, pmat)
    scene.add(points)

    function resize() {
      const w = mount!.clientWidth || window.innerWidth
      const h = mount!.clientHeight || window.innerHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h, false)
      const dpr = renderer.getPixelRatio()
      uniforms.uRes.value.set(w * dpr, h * dpr)
      pmat.uniforms.uPix.value = dpr
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    let smooth = 0
    let last = performance.now()
    const t0 = last
    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const t = (now - t0) / 1000
      smooth += (depthRef.current - smooth) * Math.min(1, dt * 3.2)
      uniforms.uDepth.value = smooth
      uniforms.uTime.value = t
      const arr = pgeo.attributes.position.array as Float32Array
      for (let i = 0; i < COUNT; i++) {
        arr[i * 3 + 1] += spd[i] * (0.5 + smooth * 0.7) * dt
        arr[i * 3] += Math.sin(t * 0.5 + i) * 0.00018
        if (arr[i * 3 + 1] > 1.05) {
          arr[i * 3 + 1] = -1.05
          arr[i * 3] = (Math.random() * 2 - 1) * 1.15
        }
      }
      pgeo.attributes.position.needsUpdate = true
      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }
    if (reduce) {
      smooth = 0.5
      uniforms.uDepth.value = 0.5
      renderer.render(scene, camera)
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (raf) cancelAnimationFrame(raf)
      quad.geometry.dispose()
      ;(quad.material as THREE.Material).dispose()
      pgeo.dispose()
      pmat.dispose()
      ptex.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [depthRef])

  return <div ref={mountRef} aria-hidden="true" className="pointer-events-none fixed inset-0 h-full w-full" style={{ zIndex: 0 }} />
}
