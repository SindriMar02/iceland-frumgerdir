/* Isometric drawing kit for the Matvélar production line.
 *
 * Our own geometry, written for this build: world (x, y, z) projects to the
 * screen with the true isometric angle, so a circle in the floor plane is an
 * ellipse with rx = 1.2247 r and ry = 0.7071 r. x runs down and to the right,
 * y down and to the left, z straight up. A point with a larger x + y is nearer
 * the viewer, so shapes are emitted back to front.
 *
 * Every shape carries a role; the stylesheet colours roles, so an active
 * machine can be lit in steel blue and the product stays signal orange.
 */

export type Pt = [number, number]
export type Role = 't' | 'l' | 'r' | 'k' | 'o' | 'n' | 'w'

export interface Shape {
  d: string
  role: Role
  /** extra class, e.g. a stroke-only needle */
  cls?: string
}

const C = Math.sqrt(3) / 2
const RX = Math.sqrt(1.5)
const RY = Math.sqrt(0.5)

export const iso = (x: number, y: number, z: number): Pt => [(x - y) * C, (x + y) / 2 - z]

const f = (n: number) => String(Math.round(n * 100) / 100)
const poly = (pts: Pt[]) => 'M' + pts.map(([a, b]) => `${f(a)} ${f(b)}`).join('L') + 'Z'
const line = (a: Pt, b: Pt) => `M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`

/** left (+y) face, right (+x) face, top: in painting order. */
export function box(x: number, y: number, z: number, w: number, d: number, h: number, roles: [Role, Role, Role] = ['l', 'r', 't']): Shape[] {
  const p = (a: number, b: number, c: number) => iso(a, b, c)
  return [
    { d: poly([p(x, y + d, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x, y + d, z + h)]), role: roles[0] },
    { d: poly([p(x + w, y, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x + w, y, z + h)]), role: roles[1] },
    { d: poly([p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)]), role: roles[2] },
  ]
}

/** a horizontal circle (floor plane) at height z */
export function disc(cx: number, cy: number, z: number, r: number, role: Role = 't'): Shape {
  const [px, py] = iso(cx, cy, z)
  const rx = RX * r, ry = RY * r
  return { d: `M${f(px - rx)} ${f(py)}A${f(rx)} ${f(ry)} 0 1 0 ${f(px + rx)} ${f(py)}A${f(rx)} ${f(ry)} 0 1 0 ${f(px - rx)} ${f(py)}Z`, role }
}

/** upright cylinder: body then top disc */
export function vcyl(cx: number, cy: number, z: number, r: number, h: number, roles: [Role, Role] = ['l', 't']): Shape[] {
  const [bx, by] = iso(cx, cy, z)
  const [, ty] = iso(cx, cy, z + h)
  const rx = RX * r, ry = RY * r
  return [
    { d: `M${f(bx - rx)} ${f(ty)}L${f(bx - rx)} ${f(by)}A${f(rx)} ${f(ry)} 0 0 0 ${f(bx + rx)} ${f(by)}L${f(bx + rx)} ${f(ty)}Z`, role: roles[0] },
    disc(cx, cy, z + h, r, roles[1]),
  ]
}

/** a truncated pyramid (hopper): bottom w0×d0, top w1×d1 on the same axis; the top is an open rim with a dark mouth */
export function frustum(x: number, y: number, z: number, w0: number, d0: number, w1: number, d1: number, h: number, roles: [Role, Role, Role] = ['l', 'r', 't']): Shape[] {
  const cx = x + w0 / 2, cy = y + d0 / 2
  const bx0 = cx - w0 / 2, bx1 = cx + w0 / 2, by0 = cy - d0 / 2, by1 = cy + d0 / 2
  const tx0 = cx - w1 / 2, tx1 = cx + w1 / 2, ty0 = cy - d1 / 2, ty1 = cy + d1 / 2
  const zt = z + h
  const p = (a: number, b: number, c: number) => iso(a, b, c)
  const m = 4
  return [
    { d: poly([p(bx0, by1, z), p(bx1, by1, z), p(tx1, ty1, zt), p(tx0, ty1, zt)]), role: roles[0] },
    { d: poly([p(bx1, by0, z), p(bx1, by1, z), p(tx1, ty1, zt), p(tx1, ty0, zt)]), role: roles[1] },
    { d: poly([p(tx0, ty0, zt), p(tx1, ty0, zt), p(tx1, ty1, zt), p(tx0, ty1, zt)]), role: roles[2] },
    { d: poly([p(tx0 + m, ty0 + m, zt), p(tx1 - m, ty0 + m, zt), p(tx1 - m, ty1 - m, zt), p(tx0 + m, ty1 - m, zt)]), role: 'k' },
  ]
}

/** monotone-chain convex hull */
function hull(pts: Pt[]): Pt[] {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo: Pt[] = []
  for (const p of s) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p) }
  const up: Pt[] = []
  for (const p of [...s].reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p) }
  return lo.slice(0, -1).concat(up.slice(0, -1))
}

/** a cylinder lying along x or y: body is the hull of its two end ellipses, then the near end cap */
export function hcyl(axis: 'x' | 'y', x: number, y: number, z: number, r: number, len: number, roles: [Role, Role] = ['l', 't']): Shape[] {
  const ring = (t: number): Pt[] => {
    const out: Pt[] = []
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2
      const u = r * Math.cos(a), v = r * Math.sin(a)
      out.push(axis === 'x' ? iso(x + t, y + u, z + v) : iso(x + u, y + t, z + v))
    }
    return out
  }
  const back = ring(0), front = ring(len)
  return [
    { d: poly(hull([...back, ...front])), role: roles[0] },
    { d: poly(front), role: roles[1] },
  ]
}

/** a straight stroke-only line, for needles, grooves and belt rollers */
export function rod(a: [number, number, number], b: [number, number, number], cls = 'rod'): Shape {
  return { d: line(iso(...a), iso(...b)), role: 'n', cls }
}

/** a flat quad on the +y face (the left face): for doors and panels */
export function panelY(x: number, y: number, z: number, w: number, h: number, role: Role = 'k'): Shape {
  const p = (a: number, c: number) => iso(a, y, c)
  return { d: poly([p(x, z), p(x + w, z), p(x + w, z + h), p(x, z + h)]), role }
}

/* ── the line ─────────────────────────────────────────────────────────── */

export const PITCH = 100
export const BELT_Y = 36
export const BELT_Z = 14

/** `back` is drawn before the belt and the product, `front` after them */
export interface Station { id: string; back: Shape[]; front: Shape[]; cx: number }

const belt = (): Shape[] => {
  const out: Shape[] = []
  for (let i = 0; i <= 5; i++) {
    const x = -24 + i * 108
    out.push(...box(x, 24, 0, 3, 3, 10), ...box(x, 44, 0, 3, 3, 10))
  }
  out.push(...box(-34, 22, 10, 592, 26, 4))
  for (let x = -26; x < 548; x += 14) out.push(rod([x, 22.5, BELT_Z], [x, 47.5, BELT_Z], 'roll'))
  return out
}

export const BELT = belt()

const grinder = (x0: number): Station => ({
  id: 'forvinnsla', cx: 34,
  back: [
    ...box(x0, -26, 0, 56, 44, 24),
    ...box(x0 + 4, -22, 24, 48, 36, 4),
    ...frustum(x0 + 6, -20, 28, 44, 32, 60, 44, 26),
    ...hcyl('x', x0 + 56, -4, 14, 9, 12),
    ...box(x0 + 38, 18, 6, 12, 2, 12, ['k', 'r', 't']),
  ],
  front: [],
})

const injector = (x0: number): Station => ({
  id: 'marinering', cx: x0 + 44,
  back: [
    ...box(x0 + 6, -26, 0, 3, 3, 12), ...box(x0 + 40, -26, 0, 3, 3, 12),
    ...box(x0 + 6, 12, 0, 3, 3, 12), ...box(x0 + 40, 12, 0, 3, 3, 12),
    ...hcyl('x', x0 + 4, -6, 28, 17, 42),
    ...box(x0 + 66, 14, 14, 4, 4, 26),
  ],
  front: [
    ...box(x0 + 66, 52, 14, 4, 4, 26),
    ...box(x0 + 56, 14, 40, 24, 42, 6),
    ...Array.from({ length: 6 }, (_, i) => rod([x0 + 59 + i * 3.6, 28 + (i % 2) * 2, 40], [x0 + 59 + i * 3.6, 28 + (i % 2) * 2, 24 + (i % 2) * 3], 'needle')),
  ],
})

const former = (x0: number): Station => ({
  id: 'formun', cx: x0 + 28,
  back: [
    ...box(x0, -26, 0, 52, 44, 28),
    ...vcyl(x0 + 26, -6, 28, 15, 24),
    disc(x0 + 26, -6, 52, 11, 'k'),
    ...box(x0 + 8, 18, 14, 38, 11, 6),
    ...[0, 1, 2, 3].map((i) => disc(x0 + 15 + i * 9, 23.5, 20, 3.2, 'k')),
  ],
  front: [],
})

const oven = (x0: number): Station => ({
  id: 'eldun', cx: x0 + 34,
  back: [
    ...box(x0, -26, 0, 68, 46, 34),
    panelY(x0 + 5, 20, 5, 17, 24), panelY(x0 + 25, 20, 5, 17, 24), panelY(x0 + 45, 20, 5, 17, 24),
    rod([x0 + 20, 20, 17], [x0 + 20, 20, 21], 'rod'),
    ...[0, 1, 2, 3, 4].map((i) => rod([x0 + 6 + i * 12, -22, 34], [x0 + 6 + i * 12, 16, 34], 'rod')),
    ...vcyl(x0 + 54, -8, 34, 6, 20),
  ],
  front: [],
})

const packer = (x0: number): Station => ({
  id: 'pokkun', cx: x0 + 40,
  back: [
    ...box(x0, -26, 0, 50, 44, 28),
    ...box(x0 + 8, -26, 28, 3, 3, 14), ...box(x0 + 34, -26, 28, 3, 3, 14),
    ...hcyl('y', x0 + 12, -24, 46, 10, 22),
  ],
  front: [
    ...box(x0 + 36, 14, 22, 20, 36, 9),
    ...box(x0 + 82, 30, BELT_Z, 14, 12, 2), ...box(x0 + 82, 30, BELT_Z + 2, 14, 12, 2), ...box(x0 + 82, 30, BELT_Z + 4, 14, 12, 2),
  ],
})

export const STATIONS: Station[] = [grinder(0), injector(PITCH), former(PITCH * 2), oven(PITCH * 3), packer(PITCH * 4)]

/** where the product waits at each station, along the belt */
export const ITEM_X = [64, 170, 228, 330, 462]

/** the product, in six forms, each centred on its own origin: raw, ground, brined, formed, breaded, packed */
export const ITEM_FORMS: Shape[][] = [
  box(-6, -5, 0, 12, 10, 9, ['o', 'o', 'o']),
  [[-5, -4], [2, -5], [-2, 2], [5, 2], [-6, 5]].flatMap(([a, b]) => box(a - 2, b - 2, 0, 4, 4, 3, ['o', 'o', 'o'])),
  vcyl(0, 0, 0, 5.5, 7, ['o', 'o']),
  [[-6, 0], [0, -3], [6, 2]].flatMap(([a, b]) => vcyl(a, b, 0, 3.2, 3, ['o', 'o'])),
  [[-6, 0], [0, -3], [6, 2]].flatMap(([a, b]) => [...vcyl(a, b, 0, 3.4, 3.4, ['o', 'o']), rod([a - 1.6, b, 3.4], [a + 1.6, b, 3.4], 'speck')]),
  [
    ...box(-8, -6, 0, 16, 12, 3, ['w', 'w', 'w']),
    ...box(-5, -4, 3, 10, 8, 3, ['o', 'o', 'o']),
    ...box(-8, -6, 6, 16, 12, 1, ['n', 'n', 'w']),
  ],
]

/** screen-space centre of station i, for the camera */
export const centreOf = (i: number): Pt => iso(STATIONS[i].cx, 6, 30)

/** screen position of the item origin when it stands at belt x */
export const beltPoint = (x: number): Pt => iso(x, BELT_Y, BELT_Z)

/* camera boxes, [minX, minY, w, h], all with the card's 481:469 aspect */
export const ASPECT = 481 / 469
export function camera(i: number, width = 214): [number, number, number, number] {
  const [cx, cy] = centreOf(i)
  const h = width / ASPECT
  return [cx - width / 2, cy - h / 2, width, h]
}
export function overview(): [number, number, number, number] {
  const w = 560
  const h = w / ASPECT
  const [cx, cy] = iso(262, 12, 36)
  return [cx - w / 2, cy - h / 2, w, h]
}
