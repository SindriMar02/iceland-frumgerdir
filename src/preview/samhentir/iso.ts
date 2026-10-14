/* Isometric drawing kit for the Samhentir line (the kit is shared with the Matvélar build; the drawing is new).
 *
 * Our own geometry, written for this build: world (x, y, z) projects to the
 * screen with the true isometric angle, so a circle in the floor plane is an
 * ellipse with rx = 1.2247 r and ry = 0.7071 r. x runs down and to the right,
 * y down and to the left, z straight up. A point with a larger x + y is nearer
 * the viewer, so shapes are emitted back to front.
 *
 * Every shape carries a role; the stylesheet colours roles. Machines are white
 * and steel (lit in the group's blue when active); the fish is salmon (p, pl, pr),
 * corrugated board is kraft (b, bl, br), pallet wood is darker (d, dl, dr), and
 * print on a label or a box is the one blue ink (u).
 */

export type Pt = [number, number]
export type XY = [number, number]
export type XYZ = [number, number, number]
export type Role = 't' | 'l' | 'r' | 'k' | 'n' | 'w' | 'f' | 'p' | 'pl' | 'pr' | 'b' | 'bl' | 'br' | 'd' | 'dl' | 'dr' | 'u'

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

/** many strokes or specks of one kind as a single path: fewer nodes for the browser to paint */
export function join(shapes: Shape[]): Shape[] {
  if (!shapes.length) return []
  return [{ ...shapes[0], d: shapes.map((x) => x.d).join('') }]
}

/** a flat quad on the +y face (the left face): for doors and panels */
export function panelY(x: number, y: number, z: number, w: number, h: number, role: Role = 'k'): Shape {
  const p = (a: number, c: number) => iso(a, y, c)
  return { d: poly([p(x, z), p(x + w, z), p(x + w, z + h), p(x, z + h)]), role }
}

/** a flat quad on the +x face (the right face): for handle slots */
export function panelX(x: number, y: number, z: number, w: number, h: number, role: Role = 'k'): Shape {
  const p = (b: number, c: number) => iso(x, b, c)
  return { d: poly([p(y, z), p(y + w, z), p(y + w, z + h), p(y, z + h)]), role }
}

/** a flat circle standing in the y-z plane (axis x), the x-z plane (axis y) or lying down (axis z) */
export function planeDisc(axis: 'x' | 'y' | 'z', c: XYZ, r: number, role: Role = 't', n = 28): Shape {
  const out: Pt[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const u = r * Math.cos(a), v = r * Math.sin(a)
    out.push(axis === 'x' ? iso(c[0], c[1] + u, c[2] + v) : axis === 'y' ? iso(c[0] + u, c[1], c[2] + v) : iso(c[0] + u, c[1] + v, c[2]))
  }
  return { d: poly(out), role }
}


/* ── fish, board and pallets ──────────────────────────────────────────── */

/** deterministic noise, so a drawing never changes between builds */
const prng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** an extruded outline in the floor plane; only the faces turned to the viewer are drawn */
export function prism(outline: XY[], z: number, h: number, roles: [Role, Role, Role]): Shape[] {
  const n = outline.length
  let area = 0
  for (let i = 0; i < n; i++) { const a = outline[i], b = outline[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1] }
  const s = area >= 0 ? 1 : -1
  const faces = new Map<Role, string>()
  for (let i = 0; i < n; i++) {
    const a = outline[i], b = outline[(i + 1) % n]
    const nx = s * (b[1] - a[1]), ny = -s * (b[0] - a[0])
    if (nx + ny <= 1e-6) continue
    const role = ny >= nx ? roles[0] : roles[1]
    faces.set(role, (faces.get(role) ?? '') + poly([iso(a[0], a[1], z), iso(b[0], b[1], z), iso(b[0], b[1], z + h), iso(a[0], a[1], z + h)]))
  }
  return [...[...faces].map(([role, d]): Shape => ({ d, role })), { d: poly(outline.map(([x, y]) => iso(x, y, z + h))), role: roles[2] }]
}

const FISH: [Role, Role, Role] = ['pl', 'pr', 'p']
const KRAFT: [Role, Role, Role] = ['bl', 'br', 'b']
const WOOD: [Role, Role, Role] = ['dl', 'dr', 'd']

/** a salmon fillet seen from above: a long rounded shape, full at the head end, narrowing to the tail */
function filletUV(len: number, wid: number, seed: number, n = 22): XY[] {
  const rnd = prng(seed)
  const out: XY[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const u = Math.cos(a) * len / 2
    const t = (u / (len / 2) + 1) / 2                  // 0 at the head, 1 at the tail
    const v = Math.sin(a) * (wid / 2) * (1 - 0.55 * Math.pow(t, 1.6)) * (1 + (rnd() - 0.5) * 0.06)
    out.push([u, v])
  }
  return out
}

/** the white lines of fat across the top of a salmon piece */
function fat(cx: number, cy: number, z: number, len: number, wid: number, count: number, taper = 0.55): Shape[] {
  const out: Shape[] = []
  for (let i = 1; i <= count; i++) {
    const u = -len / 2 + (len * i) / (count + 1)
    const t = (u / (len / 2) + 1) / 2
    const half = (wid / 2) * (1 - taper * Math.pow(t, 1.6)) * 0.78
    out.push(rod([cx + u - 1.2, cy - half, z], [cx + u + 1.6, cy + half, z], 'fat'))
  }
  return join(out)
}

/** a whole fillet lying along the belt */
function fillet(cx: number, cy: number, z: number, len: number, wid: number, seed: number): Shape[] {
  const o = filletUV(len, wid, seed).map(([u, v]): XY => [cx + u, cy + v])
  const top = filletUV(len * 0.86, wid * 0.74, seed).map(([u, v]): XY => [cx + u - len * 0.02, cy + v])
  return [...prism(o, z, 3, FISH), ...prism(top, z + 3, 1.6, FISH), ...fat(cx, cy, z + 4.6, len * 0.8, wid * 0.74, 7)]
}

/** a portion: a squarish cut of fillet, thick, with its fat lines */
function portion(cx: number, cy: number, z: number, s: number, seed: number): Shape[] {
  const rnd = prng(seed)
  const w = 10 * s, d = 7.8 * s, r = 2 * s
  const pts: XY[] = []
  const corners: XY[] = [[w / 2 - r, d / 2 - r], [-w / 2 + r, d / 2 - r], [-w / 2 + r, -d / 2 + r], [w / 2 - r, -d / 2 + r]]
  corners.forEach(([x, y], k) => {
    for (let j = 0; j <= 3; j++) {
      const a = (k * Math.PI) / 2 + (j / 3) * (Math.PI / 2)
      pts.push([cx + x + Math.cos(a) * r * (1 + (rnd() - 0.5) * 0.2), cy + y + Math.sin(a) * r])
    }
  })
  const h = 3.2 * s
  return [...prism(pts, z, h, FISH), ...fat(cx, cy, z + h, w * 0.9, d * 0.9, 3, 0)]
}

/** pieces painted back to front, so a group hides itself correctly */
const byDepth = <T extends { cx: number; cy: number }>(items: T[]) => [...items].sort((a, b) => a.cx + a.cy - (b.cx + b.cy))

const PORTIONS: [number, number][] = [[-7.8, -3.4], [3, -4.2], [-2.4, 5.2], [8.4, 4.6]]

/** a group of portions, back to front */
const portions = (z: number, s: number, at = PORTIONS) =>
  byDepth(at.map(([cx, cy], i) => ({ cx: cx * s, cy: cy * s, i }))).flatMap(({ cx, cy, i }) => portion(cx, cy, z, s * 0.92, 60 + i))

/** clear film sealed over a tray: slopes up from the rim to the top of the product */
function filmOver(x: number, y: number, w: number, d: number, zb: number, zt: number, inset: number): Shape[] {
  const p = (a: number, b: number, c: number) => iso(a, b, c)
  return [
    { d: poly([p(x, y + d, zb), p(x + w, y + d, zb), p(x + w - inset, y + d - inset, zt), p(x + inset, y + d - inset, zt)]), role: 'f' },
    { d: poly([p(x + w, y, zb), p(x + w, y + d, zb), p(x + w - inset, y + d - inset, zt), p(x + w - inset, y + inset, zt)]), role: 'f' },
    { d: poly([p(x + inset, y + inset, zt), p(x + w - inset, y + inset, zt), p(x + w - inset, y + d - inset, zt), p(x + inset, y + d - inset, zt)]), role: 'f' },
    { ...rod([x + inset + w * 0.16, y + d - inset - 1, zt], [x + inset + w * 0.4, y + inset + 1, zt], 'glare') },
    { ...rod([x + inset + w * 0.28, y + d - inset - 1, zt], [x + inset + w * 0.44, y + inset + 4, zt], 'glare') },
  ]
}

const TW = 30, TD = 22

/** the tray, open or sealed, with or without its label */
function tray(state: 'open' | 'sealed' | 'labelled', s = 1): Shape[] {
  const w = TW * s, d = TD * s
  const x0 = -w / 2, y0 = -d / 2
  const rim = 4 * s
  const cavity = poly([iso(x0 + 1.6 * s, y0 + 1.6 * s, rim), iso(x0 + w - 1.6 * s, y0 + 1.6 * s, rim), iso(x0 + w - 1.6 * s, y0 + d - 1.6 * s, rim), iso(x0 + 1.6 * s, y0 + d - 1.6 * s, rim)])
  const out: Shape[] = [...box(x0, y0, 0, w, d, rim), { d: cavity, role: 'l' }, ...portions(1.4 * s, 1.02 * s)]
  if (state === 'open') return out
  out.push(...filmOver(x0 + 0.4 * s, y0 + 0.4 * s, w - 0.8 * s, d - 0.8 * s, rim, 8.4 * s, 2.4 * s))
  if (state === 'labelled') {
    /* a blue label on the film, with three lines of white print, and the date code on the front */
    const lx = x0 + w * 0.5, ly = y0 + 4 * s, lz = 8.5 * s
    out.push({ d: poly([iso(lx, ly, lz), iso(lx + 10 * s, ly, lz), iso(lx + 10 * s, ly + 8 * s, lz), iso(lx, ly + 8 * s, lz)]), role: 'u' })
    out.push(...join([0, 1, 2].map((k) => rod([lx + 1.6 * s, ly + (2 + k * 2) * s, lz], [lx + (k === 2 ? 5.5 : 8.4) * s, ly + (2 + k * 2) * s, lz], 'print'))))
    out.push(panelY(x0 + 3 * s, y0 + d, 0.9 * s, 9 * s, 2.2 * s, 'u'))
  }
  return out
}

/** a closed corrugated box: kraft, a band of the one blue print, tape along the top */
function carton(x: number, y: number, z: number, w: number, d: number, h: number, band = true): Shape[] {
  const out: Shape[] = [...box(x, y, z, w, d, h, KRAFT)]
  if (band) {
    out.push(panelY(x + w * 0.12, y + d, z + h * 0.42, w * 0.46, h * 0.26, 'u'))
    out.push(panelX(x + w, y + d * 0.18, z + h * 0.42, d * 0.5, h * 0.26, 'u'))
  }
  out.push(rod([x, y + d / 2, z + h], [x + w, y + d / 2, z + h], 'tape'))
  out.push(rod([x + w, y + d / 2, z + h], [x + w, y + d / 2, z + h * 0.62], 'tape'))
  return out
}

const CW = 30, CD = 23, CH = 15

/** a wooden pallet: three runners and the deck boards */
function pallet(x: number, y: number, z: number, w: number, d: number): Shape[] {
  const out: Shape[] = []
  for (let i = 0; i < 3; i++) out.push(...box(x, y + (i * (d - 4)) / 2, z, w, 4, 3, WOOD))
  out.push(...box(x, y, z + 3, w, d, 2, WOOD))
  out.push(...join([1, 2, 3, 4].map((k) => rod([x + (k * w) / 5, y, z + 5], [x + (k * w) / 5, y + d, z + 5], 'slat'))))
  return out
}

/** a pallet of cartons in two layers, wrapped in stretch film */
function wrappedPallet(x: number, y: number, z: number): Shape[] {
  const w = CW * 2, d = CD * 2
  const cartons: Shape[] = []
  for (let layer = 0; layer < 2; layer++) {
    const zz = z + 5 + layer * CH
    for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) cartons.push(...carton(x + i * CW, y + j * CD, zz, CW, CD, CH, layer === 1 || j === 1 || i === 1))
  }
  const top = z + 5 + 2 * CH
  /* the film: a translucent skin over the stack, with the wrap lines around it */
  const skin = box(x - 0.6, y - 0.6, z + 3, w + 1.2, d + 1.2, top - z - 3 + 0.8, ['f', 'f', 'f'])
  const wraps = join([0.25, 0.42, 0.58, 0.75, 0.9].flatMap((t) => {
    const zz = z + 3 + (top - z - 3) * t
    return [rod([x - 0.6, y + d + 0.6, zz], [x + w + 0.6, y + d + 0.6, zz + 1.4], 'wrap'), rod([x + w + 0.6, y - 0.6, zz + 1.4], [x + w + 0.6, y + d + 0.6, zz + 1.4], 'wrap')]
  }))
  return [...pallet(x, y, z, w, d), ...cartons, ...skin, ...wraps]
}

/* ── the line ─────────────────────────────────────────────────────────── */

export const PITCH = 100
export const BELT_Y = 39
export const BELT_Z = 14

/** `back` is drawn before the belt and the product, `front` after them; cz is the height the camera looks at */
export interface Station { id: string; back: Shape[]; front: Shape[]; cx: number; cz: number }

const BELT_END = 474

const belt = (): Shape[] => {
  const out: Shape[] = []
  for (let x = -24; x <= BELT_END - 10; x += 108) out.push(...box(x, 24, 0, 3, 3, 10), ...box(x, 52, 0, 3, 3, 10))
  out.push(...box(-34, 22, 10, BELT_END + 34, 34, 4))
  const rolls: Shape[] = []
  for (let x = -26; x < BELT_END - 4; x += 14) rolls.push(rod([x, 22.5, BELT_Z], [x, 55.5, BELT_Z], 'roll'))
  return [...out, ...join(rolls)]
}

export const BELT = belt()

/** 01 Vinnsla: a portion cutter, a cabinet behind the belt and a hood across it */
const cutter = (x0: number): Station => ({
  id: 'vinnsla', cx: x0 + 30, cz: 26,
  back: [
    ...box(x0, -26, 0, 58, 42, 24),
    ...box(x0 + 4, -22, 24, 50, 34, 3),
    /* the control panel on a short post */
    ...box(x0 + 46, -30, 27, 3, 3, 12),
    ...box(x0 + 38, -32, 39, 18, 4, 13),
    panelY(x0 + 40, -28, 41, 14, 9, 'k'),
    /* the back legs of the hood */
    ...box(x0 + 8, 16, 0, 4, 4, 30), ...box(x0 + 46, 16, 0, 4, 4, 30),
    /* a fillet waiting on the infeed */
    ...fillet(x0 - 14, BELT_Y - 6, BELT_Z, 30, 11, 3),
  ],
  front: [
    ...box(x0 + 8, 58, 0, 4, 4, 30), ...box(x0 + 46, 58, 0, 4, 4, 30),
    ...box(x0 + 4, 14, 30, 50, 50, 12),
    /* the cutting window along the front of the hood */
    panelY(x0 + 10, 64, 32, 38, 5, 'k'),
    ...join([0, 1, 2, 3, 4, 5].map((i) => rod([x0 + 12 + i * 6.6, 64, 32.4], [x0 + 12 + i * 6.6, 64, 36.6], 'rib'))),
  ],
})

/** 02 Vigtun: a multihead weigher on a platform that straddles the belt */
const weigher = (x0: number): Station => {
  const cx = x0 + 30, cy = 39, deck = 44
  const buckets: { cx: number; cy: number; s: Shape[] }[] = []
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    const bx = cx + Math.cos(a) * 15, by = cy + Math.sin(a) * 15
    buckets.push({ cx: bx, cy: by, s: box(bx - 3, by - 3, deck + 12, 6, 6, 9) })
  }
  return {
    id: 'vigtun', cx: x0 + 30, cz: 44,
    back: [
      ...box(x0 + 2, -4, 0, 6, 6, deck), ...box(x0 + 52, -4, 0, 6, 6, deck),
      ...box(x0 + 2, -4, deck - 8, 56, 6, 6),
      /* the discharge chute down to the belt */
      ...frustum(cx - 4, cy - 4, 24, 8, 8, 18, 18, 20),
      ...box(x0, -6, deck, 60, 64, 4),
      ...vcyl(cx, cy, deck + 4, 9, 8),
      ...byDepth(buckets).filter((b) => b.cx + b.cy < cx + cy).flatMap((b) => b.s),
      ...vcyl(cx, cy, deck + 12, 10, 12),
      ...byDepth(buckets).filter((b) => b.cx + b.cy >= cx + cy).flatMap((b) => b.s),
      /* the dispersion cone on top, and the infeed above it */
      ...frustum(cx - 12, cy - 12, deck + 24, 24, 24, 6, 6, 9),
      ...vcyl(cx, cy, deck + 33, 3, 14),
    ],
    front: [],
  }
}

/** 03 Pökkun: a tray sealer with its reel of film */
const sealer = (x0: number): Station => ({
  id: 'pokkun', cx: x0 + 30, cz: 30,
  back: [
    ...box(x0, -26, 0, 56, 42, 26),
    ...box(x0 + 8, -26, 26, 3, 3, 16), ...box(x0 + 40, -26, 26, 3, 3, 16),
    ...hcyl('y', x0 + 14, -24, 44, 10, 22),
    planeDisc('y', [x0 + 14, -2, 44], 10, 'f'), planeDisc('y', [x0 + 14, -2, 44], 3.4, 'k'),
    ...box(x0 + 8, 16, 0, 4, 4, 26), ...box(x0 + 46, 16, 0, 4, 4, 26),
  ],
  front: [
    ...box(x0 + 8, 58, 0, 4, 4, 26), ...box(x0 + 46, 58, 0, 4, 4, 26),
    ...box(x0 + 4, 14, 26, 50, 50, 10),
    panelY(x0 + 10, 64, 28, 38, 6, 'k'),
  ],
})

/** 04 Merking: a printer cabinet, and a labeller arm reaching over the belt with a roll of blue labels */
const labeller = (x0: number): Station => ({
  id: 'merking', cx: x0 + 34, cz: 32,
  back: [
    ...box(x0 + 2, -26, 0, 30, 32, 30),
    panelY(x0 + 6, 6, 16, 20, 10, 'k'),
    ...join([0, 1, 2].map((i) => rod([x0 + 8, 6, 12 - i * 3], [x0 + 22, 6, 12 - i * 3], 'rib'))),
    ...box(x0 + 44, -6, 0, 6, 6, 44),
    ...box(x0 + 40, -6, 44, 12, 46, 6),
    /* the label roll on the arm, and its spent core */
    ...hcyl('x', x0 + 52, 8, 56, 10, 5, ['u', 'u']),
    planeDisc('x', [x0 + 57, 8, 56], 3.4, 'k'),
    ...hcyl('x', x0 + 52, 26, 54, 4, 5, ['w', 'w']),
  ],
  front: [
    /* the applicator head, low over the belt */
    ...box(x0 + 40, 30, 31, 12, 12, 14),
    panelY(x0 + 42, 42, 33, 8, 4, 'u'),
  ],
})

/** 05 Kassi: a case erector and sealer, flat blanks stacked on top, tape head over the belt */
const caser = (x0: number): Station => {
  const blanks = Array.from({ length: 6 }, (_, i) => box(x0 + 8, -20, 30 + i * 2.2, 40, 30, 2.2, KRAFT)).flat()
  return {
    id: 'kassi', cx: x0 + 32, cz: 30,
    back: [
      ...box(x0, -26, 0, 62, 42, 30),
      ...blanks,
      ...box(x0 + 10, 16, 0, 4, 4, 34), ...box(x0 + 50, 16, 0, 4, 4, 34),
    ],
    front: [
      ...box(x0 + 10, 58, 0, 4, 4, 34), ...box(x0 + 50, 58, 0, 4, 4, 34),
      ...box(x0 + 6, 14, 34, 52, 50, 6),
      /* the tape head and its roll */
      ...box(x0 + 26, 34, 24, 10, 10, 10),
      ...hcyl('y', x0 + 31, 33, 28, 3.2, 3, ['f', 'k']),
    ],
  }
}

/** 06 Bretti: a pallet wrapper: turntable, mast and film carriage */
const WRAP_X = 540
const wrapper = (): Station => ({
  id: 'bretti', cx: WRAP_X, cz: 32,
  back: [
    ...box(WRAP_X + 34, -14, 0, 8, 8, 82),
    ...box(WRAP_X + 26, -18, 0, 20, 16, 6),
    ...box(WRAP_X + 28, -8, 40, 10, 12, 16),
    ...vcyl(WRAP_X + 33, 8, 40, 4, 16, ['f', 'f']),
    ...vcyl(WRAP_X, BELT_Y, 0, 34, 4),
    disc(WRAP_X, BELT_Y, 4, 30, 'r'),
  ],
  front: [],
})

/** the finished pallets beside the wrapper: drawn outside the stations, so a lit machine never tints them */
export const OUTPUT: Shape[] = [...wrappedPallet(WRAP_X + 54, -38, 0)]

export const STATIONS: Station[] = [cutter(0), weigher(PITCH), sealer(PITCH * 2), labeller(PITCH * 3), caser(PITCH * 4), wrapper()]

/** where the product waits at each station, along the belt */
export const ITEM_X = [70, 130, 268, 330, 474, WRAP_X]

/** the product, in seven forms, each centred on its own origin */
export const ITEM_FORMS: Shape[][] = [
  /* 0 raw: two whole fillets along the belt */
  [...fillet(0, -6, 0, 32, 11.5, 1), ...fillet(1, 6, 0, 32, 11.5, 2)],
  /* 1 cut: four portions */
  portions(0, 1.05),
  /* 2 weighed into an open tray */
  tray('open'),
  /* 3 sealed under film */
  tray('sealed'),
  /* 4 labelled */
  tray('labelled'),
  /* 5 packed in a carton */
  carton(-CW / 2, -CD / 2, 0, CW, CD, CH),
  /* 6 a wrapped pallet on the turntable (the turntable top is 10 below the belt) */
  wrappedPallet(-CW, -CD, -10),
]

/** screen position of the item origin when it stands at belt x */
export const beltPoint = (x: number): Pt => iso(x, BELT_Y, BELT_Z)

/** screen-space centre for the camera at station i: between the machine and where the product stands, so both are in frame */
export const centreOf = (i: number): Pt => {
  const [mx, my] = iso(STATIONS[i].cx, 10, STATIONS[i].cz)
  const [px, py] = beltPoint(ITEM_X[i])
  return [mx + (px - mx) * 0.42, my + (py - my) * 0.42]
}

/* the carton that drops onto a pallet, in the industries section */
export const DROP_PALLET: Shape[] = pallet(4, 4, 0, 76, 76)
export const DROP_BOX: Shape[] = carton(14, 14, 5, 56, 56, 40)

/* camera boxes, [minX, minY, w, h], all with the card's 481:469 aspect */
export const ASPECT = 481 / 469
export function camera(i: number, width = 178): [number, number, number, number] {
  const [cx, cy] = centreOf(i)
  const h = width / ASPECT
  return [cx - width / 2, cy - h / 2, width, h]
}
export function overview(): [number, number, number, number] {
  const w = 640
  const h = w / ASPECT
  const [cx, cy] = iso(310, 10, 40)
  return [cx - w / 2, cy - h / 2, w, h]
}
