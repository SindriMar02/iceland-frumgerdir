/**
 * TRÖLLASTAFIR IN 3D — the signature, as real rotating drums.
 *
 * Fossatún's Trollgarden has a physical installation: carved wooden letter
 * blocks on two spindles that visitors turn by hand. The CSS version read as
 * flat tiles sliding; these are actual cylinders on an axle, lit, with the
 * letters wrapped around the circumference exactly as they are on the real
 * thing.
 *
 * THREE HARD CONSTRAINTS, all of them learned the hard way:
 *
 * 1. IT IS NOT CUSTOMISABLE. The drums roll to TRÖLL and stop. An earlier
 *    build let a visitor turn each drum to any letter, and the scramble landed
 *    on a racial slur on a client's page. Letterforms a visitor can arrange
 *    freely will eventually spell something you would never ship, so the
 *    control does not exist. See craft ledger #60.
 *
 * 2. IT MUST DEGRADE TO SOMETHING, NEVER TO NOTHING. The CSS drums stay in the
 *    DOM underneath and are only hidden once WebGL has actually produced a
 *    frame. If the context fails, is blocked, or the device refuses it, the
 *    flat version is simply still there. A GL layer that hides the fallback
 *    before it works blanks the section (craft ledger, WebGL image effects).
 *
 * 3. NO WORK WHEN OFF SCREEN OR UNWANTED. The loop runs only while the canvas
 *    is intersecting and only when motion is allowed, and everything is
 *    disposed on unmount. A hidden tab pauses rAF anyway, which is exactly why
 *    the resting state has to be correct without the loop ever running.
 */

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'


/** Distinct filler per drum so mid-roll the columns cannot align into a word. */
const REELS = [
  ['Þ', 'Á', 'Ð', 'Ý', 'Ú', 'T'],
  ['Ö', 'Í', 'Æ', 'Þ', 'Ó', 'R'],
  ['Ú', 'Ð', 'Ý', 'Á', 'Í', 'Ö'],
  ['Æ', 'Ó', 'Þ', 'Ö', 'Ð', 'L'],
  ['Í', 'Ý', 'Á', 'Ú', 'Æ', 'L'],
]

/**
 * One letter, painted onto a wooden face.
 *
 * The first attempt wrapped all six letters around a smooth cylinder via its
 * UVs, which put them along the AXIS instead of around the circumference: the
 * drums rendered as ridges with no readable letter anywhere. Discrete faces
 * are both easier to reason about and closer to the real object, which is a
 * ring of carved blocks rather than a printed tube.
 */
function faceTexture(ch: string): THREE.CanvasTexture {
  const w = 340
  const h = 268
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!

  g.fillStyle = '#8a7549'
  g.fillRect(0, 0, w, h)
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(${58 + Math.random() * 44},${42 + Math.random() * 30},${16 + Math.random() * 22},${Math.random() * 0.17})`
    g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 4, 1)
  }
  // a darker bevel at the block edges
  const grad = g.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, 'rgba(24,16,6,.42)')
  grad.addColorStop(0.16, 'rgba(24,16,6,0)')
  grad.addColorStop(0.84, 'rgba(24,16,6,0)')
  grad.addColorStop(1, 'rgba(24,16,6,.46)')
  g.fillStyle = grad
  g.fillRect(0, 0, w, h)

  g.font = '600 176px Georgia, serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillStyle = 'rgba(34,22,8,.6)'
  g.fillText(ch, w / 2, h / 2 + 6)
  g.fillStyle = '#f7f0de'
  g.fillText(ch, w / 2, h / 2)

  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

export function TrollDrums3D({ children }: { children: React.ReactNode }) {
  const host = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = host.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    } catch {
      return // no context: the CSS drums below stay visible, which is the point
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
    camera.position.set(0, 0, 12)

    scene.add(new THREE.AmbientLight(0xffffff, 1.25))
    const key = new THREE.DirectionalLight(0xfff3dd, 2.1)
    key.position.set(2.5, 4, 6)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x9fb6c4, 0.8)
    rim.position.set(-4, -2, 2)
    scene.add(rim)

    const drums: { group: THREE.Group; from: number; to: number }[] = []
    const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = []

    const FACES = REELS[0].length
    const step = (Math.PI * 2) / FACES
    const radius = 1.02
    // a face just wide enough to close the ring, so the block reads as solid
    const faceW = 2 * radius * Math.tan(step / 2) * 1.02
    const faceGeo = new THREE.PlaneGeometry(1.5, faceW)
    disposables.push(faceGeo)

    const coreGeo = new THREE.CylinderGeometry(radius * 0.93, radius * 0.93, 1.5, FACES)
    coreGeo.rotateZ(Math.PI / 2)
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x6b5a38, roughness: 0.85 })
    disposables.push(coreGeo, coreMat)

    const spanX = 1.78
    REELS.forEach((reel, i) => {
      const group = new THREE.Group()
      group.position.x = (i - (REELS.length - 1) / 2) * spanX
      group.add(new THREE.Mesh(coreGeo, coreMat))

      reel.forEach((ch, j) => {
        const a = j * step
        const tex = faceTexture(ch)
        const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.03 })
        disposables.push(tex, mat)
        const face = new THREE.Mesh(faceGeo, mat)
        // ring around the X axis: at a = 0 the face sits at +Z and needs no turn
        face.position.set(0, radius * Math.sin(a), radius * Math.cos(a))
        face.rotation.x = -a
        group.add(face)
      })

      /*
       * Which rotation brings a face to the camera.
       *
       * A face at ring angle `a` has world normal (0, sin(a - R), cos(a - R))
       * once the group is turned by R about X, so it faces +Z when R === a.
       * The sign was inverted at first and the drums rested on the wrong
       * letters: with six faces, -5 steps is congruent to +1 step, so the
       * second letter of each reel sat forward instead of the last.
       */
      const target = (reel.length - 1) * step
      group.rotation.x = target
      scene.add(group)
      drums.push({ group, from: target, to: target })
    })

    // the axle
    const axle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, spanX * REELS.length + 1.2, 12).rotateZ(Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x6d6a63, roughness: 0.5, metalness: 0.6 }),
    )
    scene.add(axle)

    el.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    const resize = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    let raf = 0
    let start = 0
    let running = false
    let painted = false
    const DUR = 1150

    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / DUR)
      drums.forEach((d, i) => {
        const lag = Math.min(1, Math.max(0, (p - i * 0.07) / (1 - i * 0.07)))
        const e = 1 - Math.pow(1 - lag, 4) // settle, no overshoot past the letter
        d.group.rotation.x = d.from + (d.to - d.from) * e
      })
      renderer.render(scene, camera)
      if (!painted) { painted = true; setLive(true) }
      if (p < 1) raf = requestAnimationFrame(tick)
      else running = false
    }

    const play = () => {
      if (running) return
      running = true
      start = 0
      drums.forEach((d, i) => { d.from = d.to - step * (3 + i) })
      raf = requestAnimationFrame(tick)
    }

    // roll when it comes into view, and again on hover
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) play() }),
      { threshold: 0.35 },
    )
    io.observe(el)
    el.addEventListener('mouseenter', play)

    // one frame immediately so the resting word is on screen even if the
    // observer never fires
    renderer.render(scene, camera)
    setLive(true)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      el.removeEventListener('mouseenter', play)
      disposables.forEach((d) => d.dispose())
      axle.geometry.dispose()
      ;(axle.material as THREE.Material).dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="fst-drums3d">
      <div className="fst-drums3d__gl" ref={host} aria-hidden="true" />
      {/* the flat drums stay in the DOM and are only hidden once GL has painted */}
      <div className="fst-drums3d__flat" data-hidden={live || undefined}>
        {children}
      </div>
    </div>
  )
}
