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
 * PAINTED, not printed.
 *
 * The real blocks in their garden are stained wood: some green, some orange,
 * with the letters carved and hand painted in the opposite colour. The first
 * version was a flat brown tile with clean type on it, which read as a render
 * rather than an object. This paints each face the way the real ones look,
 * with grain showing through, chipped edges, and letters drawn with a little
 * jitter so no two strokes are mechanically identical.
 */
const PAINT = [
  { wood: '#5f6b39', letter: '#e08a2c', chip: '#7d8a52' }, // mossy green block
  { wood: '#c07726', letter: '#4f5c30', chip: '#d68f3f' }, // orange block
]

function faceTexture(ch: string, variant: number): THREE.CanvasTexture {
  const w = 340
  const h = 268
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!
  const paint = PAINT[variant % PAINT.length]

  // bare timber underneath, so chips can reveal it
  g.fillStyle = '#9a8355'
  g.fillRect(0, 0, w, h)

  // the paint coat, brushed rather than flat
  g.fillStyle = paint.wood
  g.fillRect(0, 0, w, h)
  for (let i = 0; i < 260; i++) {
    g.globalAlpha = 0.06 + Math.random() * 0.1
    g.fillStyle = i % 2 ? '#ffffff' : '#000000'
    const y = Math.random() * h
    g.fillRect(0, y, w, 1 + Math.random() * 2.4)
  }
  g.globalAlpha = 1

  // grain pulled through the coat
  for (let i = 0; i < 700; i++) {
    g.globalAlpha = 0.05 + Math.random() * 0.12
    g.fillStyle = '#2b2313'
    g.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 26, 1)
  }
  g.globalAlpha = 1

  // worn edges: paint chipped away to the timber
  for (let i = 0; i < 90; i++) {
    const edge = Math.floor(Math.random() * 4)
    const x = edge === 0 ? Math.random() * w : edge === 1 ? w - Math.random() * 12 : Math.random() * w
    const y = edge === 2 ? Math.random() * h : edge === 3 ? h - Math.random() * 12 : Math.random() * 10
    g.fillStyle = Math.random() > 0.5 ? '#9a8355' : paint.chip
    g.globalAlpha = 0.35 + Math.random() * 0.5
    g.beginPath()
    g.ellipse(x, y, 1 + Math.random() * 5, 1 + Math.random() * 3, Math.random() * 3, 0, Math.PI * 2)
    g.fill()
  }
  g.globalAlpha = 1

  // the letter, carved: a dark bed, then paint laid slightly off it
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = '600 172px Georgia, serif'
  g.fillStyle = 'rgba(22,16,6,.55)'
  g.fillText(ch, w / 2 + 3, h / 2 + 5)
  // three lightly offset passes read as a brush rather than a print
  for (let i = 0; i < 3; i++) {
    g.globalAlpha = i === 0 ? 1 : 0.5
    g.fillStyle = paint.letter
    g.fillText(ch, w / 2 + (Math.random() - 0.5) * 2.4, h / 2 + (Math.random() - 0.5) * 2.4)
  }
  g.globalAlpha = 1

  // a soft inner shadow so the block reads solid under the lights
  const grad = g.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, 'rgba(20,14,4,.4)')
  grad.addColorStop(0.18, 'rgba(20,14,4,0)')
  grad.addColorStop(0.82, 'rgba(20,14,4,0)')
  grad.addColorStop(1, 'rgba(20,14,4,.45)')
  g.fillStyle = grad
  g.fillRect(0, 0, w, h)

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
    const coreMats = PAINT.map((pnt) => {
      const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(pnt.wood), roughness: 0.88 })
      disposables.push(m)
      return m
    })
    disposables.push(coreGeo)

    const spanX = 1.78
    REELS.forEach((reel, i) => {
      const group = new THREE.Group()
      group.position.x = (i - (REELS.length - 1) / 2) * spanX
      group.add(new THREE.Mesh(coreGeo, coreMats[i % coreMats.length]))

      reel.forEach((ch, j) => {
        const a = j * step
        const tex = faceTexture(ch, i)
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
    let rollStart = 0
    let rolling = false
    let painted = false
    let inView = false
    const DUR = 1250

    /*
     * A PERSISTENT LOOP, not a one-shot.
     *
     * The first version stopped rendering the moment the roll finished, so the
     * drums sat perfectly frozen and read as a picture of blocks rather than
     * blocks. Now the loop runs the whole time the piece is on screen: the row
     * breathes on its axis and each drum carries a tiny independent wobble that
     * always returns to its letter. It stops dead when scrolled away, so it is
     * not burning frames for nothing.
     */
    const tick = (t: number) => {
      const secs = t / 1000

      if (rolling) {
        if (!rollStart) rollStart = t
        const p = Math.min(1, (t - rollStart) / DUR)
        drums.forEach((d, i) => {
          const lag = Math.min(1, Math.max(0, (p - i * 0.075) / (1 - i * 0.075)))
          // overshoot a touch and settle back, the way a weighted block would
          const e = lag >= 1 ? 1 : 1 - Math.pow(2, -9 * lag) * Math.cos(lag * 13)
          d.group.rotation.x = d.from + (d.to - d.from) * e
        })
        if (p >= 1) { rolling = false; rollStart = 0 }
      } else {
        // idle: each block settles around its letter, never away from it
        drums.forEach((d, i) => {
          d.group.rotation.x = d.to + Math.sin(secs * 0.7 + i * 1.3) * 0.022
        })
      }

      // the whole row sways gently on the spindle
      const sway = Math.sin(secs * 0.42) * 0.05
      scene.rotation.y = sway
      scene.rotation.z = Math.cos(secs * 0.33) * 0.012

      renderer.render(scene, camera)
      if (!painted) { painted = true; setLive(true) }
      if (inView) raf = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (raf) return
      raf = requestAnimationFrame(tick)
    }
    const stopLoop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    /** Spin every drum back a few faces and let it settle on its letter again. */
    const play = () => {
      if (rolling) return
      rolling = true
      rollStart = 0
      drums.forEach((d, i) => { d.from = d.to - step * (3 + i) })
      startLoop()
    }

    // roll when it comes into view, and again on hover
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        inView = en.isIntersecting
        if (inView) { startLoop(); play() } else { stopLoop() }
      }),
      { threshold: 0.2 },
    )
    io.observe(el)
    el.addEventListener('mouseenter', play)

    // one frame immediately so the resting word is on screen even if the
    // observer never fires
    renderer.render(scene, camera)
    setLive(true)

    return () => {
      stopLoop()
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
