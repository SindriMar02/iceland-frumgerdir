/* Isometric drawing kit for the Matvélar production line.
 *
 * Our own geometry, written for this build: world (x, y, z) projects to the
 * screen with the true isometric angle, so a circle in the floor plane is an
 * ellipse with rx = 1.2247 r and ry = 0.7071 r. x runs down and to the right,
 * y down and to the left, z straight up. A point with a larger x + y is nearer
 * the viewer, so shapes are emitted back to front.
 *
 * Every shape carries a role; the stylesheet colours roles. Machines are white
 * and steel (lit slate when active); everything edible is the one signal yellow
 * in two states: fresh (p, pl, pr) and cooked (c, cl, cr).
 */

export type Pt = [number, number]
export type XY = [number, number]
export type XYZ = [number, number, number]
export type Role = 't' | 'l' | 'r' | 'k' | 'n' | 'w' | 'f' | 'p' | 'pl' | 'pr' | 'c' | 'cl' | 'cr' | 's'

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

/* ── food: cuts of meat, nuggets, patties, crumbs ─────────────────────── */

/** deterministic noise, so a drawing never changes between builds */
const prng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** an irregular rounded outline (u, v) around the origin, counter-clockwise: a cut of meat, a nugget */
function blobUV(rx: number, ry: number, n: number, rot: number, jit: number, seed: number): XY[] {
  const rnd = prng(seed)
  const cr = Math.cos(rot), sr = Math.sin(rot)
  const out: XY[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const k = 1 + (rnd() - 0.5) * 2 * jit
    const u = Math.cos(a) * rx * k, v = Math.sin(a) * ry * k
    out.push([u * cr - v * sr, u * sr + v * cr])
  }
  return out
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
    /* the visible faces of one prism never overlap, so each tone is a single path */
    faces.set(role, (faces.get(role) ?? '') + poly([iso(a[0], a[1], z), iso(b[0], b[1], z), iso(b[0], b[1], z + h), iso(a[0], a[1], z + h)]))
  }
  return [...[...faces].map(([role, d]): Shape => ({ d, role })), { d: poly(outline.map(([x, y]) => iso(x, y, z + h))), role: roles[2] }]
}

const FRESH: [Role, Role, Role] = ['pl', 'pr', 'p']
const COOKED: [Role, Role, Role] = ['cl', 'cr', 'c']

/** one piece: an irregular chunk standing on the floor plane */
function chunk(cx: number, cy: number, z: number, rx: number, ry: number, h: number, rot: number, seed: number, roles = FRESH, n = 10, jit = 0.1, pillow = 0): Shape[] {
  const o = blobUV(rx, ry, n, rot, jit, seed)
  const base = prism(o.map(([u, v]): XY => [cx + u, cy + v]), z, h, roles)
  /* a smaller, shallower slab on top rounds the shoulders of a cut: pillow is the height of that cap */
  return pillow ? [...base, ...prism(o.map(([u, v]): XY => [cx + u * 0.78, cy + v * 0.78]), z + h, pillow, roles)] : base
}

/** a flat chunk drawn on a vertical face (the window of a tumbler) */
function chunkOn(axis: 'x' | 'y', c: XYZ, rx: number, ry: number, rot: number, seed: number, role: Role = 'p'): Shape {
  const pts = blobUV(rx, ry, 9, rot, 0.12, seed).map(([u, v]): Pt => (axis === 'x' ? iso(c[0], c[1] + u, c[2] + v) : iso(c[0] + u, c[1], c[2] + v)))
  return { d: poly(pts), role }
}

/** a cylinder lying along x or y whose radius changes along its length: a chicken leg, a sausage end */
function taper(axis: 'x' | 'y', x: number, y: number, z: number, r0: number, r1: number, len: number, roles: [Role, Role] = ['l', 't']): Shape[] {
  const ring = (t: number, r: number): Pt[] => {
    const out: Pt[] = []
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2
      const u = r * Math.cos(a), v = r * Math.sin(a)
      out.push(axis === 'x' ? iso(x + t, y + u, z + v) : iso(x + u, y + t, z + v))
    }
    return out
  }
  const back = ring(0, r0), front = ring(len, r1)
  return [
    { d: poly(hull([...back, ...front])), role: roles[0] },
    { d: poly(front), role: roles[1] },
  ]
}

/** a raw chicken leg lying across the belt: a full rounded thigh tapering to a white bone with its knob */
function drumstick(x: number, y: number, s = 1, z = 0): Shape[] {
  const zc = z + 5.8 * s
  const profile: [number, number][] = [[0, 2.4], [2, 4.7], [5, 5.9], [9, 5.7], [13, 4.3], [17, 3], [21, 2.3]]
  const body = profile.slice(1).flatMap(([t, r], i) => taper('y', x, y + profile[i][0] * s, zc, profile[i][1] * s, r * s, (t - profile[i][0]) * s, ['pl', 'p']))
  return [
    ...body,
    ...hcyl('y', x, y + 21 * s, zc, 1.2 * s, 5.5 * s, ['w', 'w']),
    ...hcyl('y', x, y + 26.5 * s, zc, 1.9 * s, 2.4 * s, ['w', 'w']),
    { ...rod([x - 2 * s, y + 5 * s, zc + 5.2 * s], [x - 1.4 * s, y + 15 * s, zc + 4 * s], 'shine') },
  ]
}

/** a sausage lying across the belt */
function sausage(x: number, y: number, len: number, r = 3.4, z = 0, roles: [Role, Role] = ['pl', 'p']): Shape[] {
  return [
    ...hcyl('y', x, y, z + r, r, len, roles),
    { ...rod([x - r * 0.35, y + 2.5, z + r * 1.9], [x - r * 0.35, y + len - 2.5, z + r * 1.9], 'shine') },
  ]
}

/** pieces painted back to front, then low to high, so a heap hides itself correctly */
interface Piece { cx: number; cy: number; z: number; h: number; shapes: Shape[] }
const heap = (pieces: Piece[]): Shape[] => [...pieces].sort((a, b) => a.cx + a.cy + a.z + a.h / 2 - (b.cx + b.cy + b.z + b.h / 2)).flatMap((p) => p.shapes)
const piece = (cx: number, cy: number, z: number, rx: number, ry: number, h: number, rot: number, seed: number, roles = FRESH, n = 10, jit = 0.1, pillow = 0): Piece => ({ cx, cy, z, h: h + pillow, shapes: chunk(cx, cy, z, rx, ry, h, rot, seed, roles, n, jit, pillow) })

/** muscle grain on the top of a cut: two short strokes */
const grain = (cx: number, cy: number, z: number, rot = 0): Shape[] => {
  const dx = Math.cos(rot) * 3.2, dy = Math.sin(rot) * 3.2
  return join([
    rod([cx - dx - dy * 0.6, cy - dy + dx * 0.6, z], [cx + dx - dy * 0.6, cy + dy + dx * 0.6, z], 'grain'),
    rod([cx - dx + dy * 0.6, cy - dy - dx * 0.6, z], [cx + dx + dy * 0.6, cy + dy - dx * 0.6, z], 'grain'),
  ])
}

/** crumbs on a cooked piece */
const crumbs = (cx: number, cy: number, z: number, spread: number, seed: number, count = 5): Shape[] => {
  const rnd = prng(seed)
  return join(Array.from({ length: count }, () => planeDisc('z', [cx + (rnd() - 0.5) * 2 * spread, cy + (rnd() - 0.5) * 1.5 * spread, z], 0.55, 's', 6)))
}

/** a heap of crumbs: mince, in layers, stacked low to high */
const crumbHeap = (cx: number, cy: number, z: number, s: number, seed: number): Piece[] => {
  const rnd = prng(seed)
  const layers: [number, number, number][] = [[19, 11, 8.2], [11, 6.8, 5], [5, 3, 2.2]]
  const out: Piece[] = []
  layers.forEach(([count, ra, rb], li) => {
    for (let i = 0; i < count; i++) {
      const centre = li === 0 && i === 0
      const a = ((i + rnd() * 0.8) / count) * Math.PI * 2
      const k = centre ? 0 : li === 2 ? rnd() * 0.5 : 0.55 + rnd() * 0.45
      out.push(piece(cx + Math.cos(a) * ra * k * s, cy + Math.sin(a) * rb * k * s, z + li * 2.5 * s, (1.9 + rnd() * 1.2) * s, (1.6 + rnd() * 1) * s, (2.4 + rnd() * 1.6) * s, rnd() * 3, seed * 7 + li * 20 + i, FRESH, 8, 0.2))
    }
  })
  return out
}

/** clear film sealed over a tray: slopes up from the rim to the top of the product */
function filmOver(x: number, y: number, w: number, d: number, zb: number, zt: number, inset: number): Shape[] {
  const p = (a: number, b: number, c: number) => iso(a, b, c)
  return [
    { d: poly([p(x, y + d, zb), p(x + w, y + d, zb), p(x + w - inset, y + d - inset, zt), p(x + inset, y + d - inset, zt)]), role: 'f' },
    { d: poly([p(x + w, y, zb), p(x + w, y + d, zb), p(x + w - inset, y + d - inset, zt), p(x + w - inset, y + inset, zt)]), role: 'f' },
    { d: poly([p(x + inset, y + inset, zt), p(x + w - inset, y + inset, zt), p(x + w - inset, y + d - inset, zt), p(x + inset, y + d - inset, zt)]), role: 'f' },
    { ...rod([x + inset + w * 0.18, y + d - inset - 1, zt], [x + inset + w * 0.42, y + inset + 1, zt], 'glare') },
    { ...rod([x + inset + w * 0.3, y + d - inset - 1, zt], [x + inset + w * 0.46, y + inset + 4, zt], 'glare') },
  ]
}

/** a packed tray: white tray, cooked pieces under clear film, a yellow label on the front */
function tray(cx: number, cy: number, z: number, s = 1): Shape[] {
  const w = 28 * s, d = 20 * s
  const x0 = cx - w / 2, y0 = cy - d / 2
  const top = z + 3 * s
  const nug = [[-7.5, -3.4, 0.2], [0.6, -4.2, 0.8], [7.8, 2.4, 0.5]]
  const cavity = poly([iso(x0 + 1.6 * s, y0 + 1.6 * s, z + 4 * s), iso(x0 + w - 1.6 * s, y0 + 1.6 * s, z + 4 * s), iso(x0 + w - 1.6 * s, y0 + d - 1.6 * s, z + 4 * s), iso(x0 + 1.6 * s, y0 + d - 1.6 * s, z + 4 * s)])
  return [
    ...box(x0, y0, z, w, d, 4 * s),
    { d: cavity, role: 'l' },
    ...nug.flatMap(([a, b, r], i) => [...chunk(cx + a * s, cy + b * s, top, 5.6 * s, 4.1 * s, 4.2 * s, r, 40 + i, COOKED, 11, 0.07, 1.1 * s), ...crumbs(cx + a * s, cy + b * s, top + 5.3 * s, 3 * s, 70 + i, 3)]),
    ...filmOver(x0 + 0.4 * s, y0 + 0.4 * s, w - 0.8 * s, d - 0.8 * s, z + 4 * s, z + 8.6 * s, 2.2 * s),
    panelY(x0 + 3 * s, y0 + d, z + 0.9 * s, 9 * s, 2.2 * s, 'p'),
  ]
}

/** a wisp of steam or smoke rising from a point, drawn in the screen plane */
const wisp = (x: number, y: number, z: number, dx: number, lean: number, len: number): Shape => {
  const [sx, sy] = iso(x, y, z)
  const a = len / 3
  return { d: `M${f(sx + dx)} ${f(sy)}c${f(-lean)} ${f(-a * 0.5)} ${f(lean)} ${f(-a * 0.9)} 0 ${f(-a * 1.4)}s${f(-lean)} ${f(-a * 0.9)} ${f(lean * 0.3)} ${f(-a * 1.6)}`, role: 'n', cls: 'steam' }
}

/* ── the line ─────────────────────────────────────────────────────────── */

export const PITCH = 100
export const BELT_Y = 39
export const BELT_Z = 14

/** `back` is drawn before the belt and the product, `front` after them */
export interface Station { id: string; back: Shape[]; front: Shape[]; cx: number }

const belt = (): Shape[] => {
  const out: Shape[] = []
  for (let i = 0; i <= 5; i++) {
    const x = -24 + i * 108
    out.push(...box(x, 24, 0, 3, 3, 10), ...box(x, 52, 0, 3, 3, 10))
  }
  out.push(...box(-34, 22, 10, 592, 34, 4))
  const rolls: Shape[] = []
  for (let x = -26; x < 548; x += 14) rolls.push(rod([x, 22.5, BELT_Z], [x, 55.5, BELT_Z], 'roll'))
  return [...out, ...join(rolls)]
}

export const BELT = belt()

const grinder = (x0: number): Station => {
  /* meat in the hopper: the mouth of the hopper is full of cuts */
  const cuts: [number, number, number, number, number, number, number, number, number][] = [
    [14, -14, 51, 8, 6, 8, 0.4, 3, 9], [40, -12, 51, 8.5, 6.5, 6.5, -0.5, 4, 10], [28, -4, 51, 9.5, 7, 9.5, 0.2, 5, 9],
    [14, 6, 51, 8, 6, 6, 0.9, 6, 10], [42, 5, 51, 8, 6.5, 8.5, -0.2, 7, 9], [23, -12, 58, 6.5, 4.8, 5.5, 0.7, 8, 10], [34, 2, 59, 7, 5.2, 5.5, -0.6, 9, 9],
  ]
  const load = [
    ...heap(cuts.map(([cx, cy, z, rx, ry, h, rot, seed, n]) => piece(x0 + cx, cy, z, rx, ry, h, rot, seed, FRESH, n, 0.15))),
    ...cuts.slice(2).flatMap(([cx, cy, z, , , h, rot]) => grain(x0 + cx, cy, z + h, rot)),
  ]
  /* the die plate at the mouth of the barrel, and the mince coming through it */
  const dies: [number, number][] = [[0, 0], [5, 0], [-5, 0], [2.5, 4.3], [-2.5, 4.3], [2.5, -4.3], [-2.5, -4.3]]
  const plate = dies.map(([a, b]) => planeDisc('x', [x0 + 68, -4 + a, 14 + b], 1.3, 'k', 12))
  const strands = [...dies].sort((p, q) => p[0] + p[1] - (q[0] + q[1])).flatMap(([a, b], i) => hcyl('x', x0 + 68, -4 + a, 14 + b, 1.15, 7 + ((i * 5) % 6), ['pl', 'p']))
  return {
    id: 'forvinnsla', cx: 34,
    back: [
      ...box(x0, -26, 0, 56, 44, 24),
      ...box(x0 + 4, -22, 24, 48, 36, 4),
      ...frustum(x0 + 6, -20, 28, 44, 32, 60, 44, 26),
      ...load,
      ...hcyl('x', x0 + 56, -4, 14, 9, 12),
      ...plate,
      ...strands,
      ...box(x0 + 38, 18, 6, 12, 2, 12, ['k', 'r', 't']),
    ],
    front: [],
  }
}

const injector = (x0: number): Station => {
  const px = x0 + 70
  const needles = join([34, 43].flatMap((y, row) => Array.from({ length: 5 }, (_, i) => rod([px - 8.8 + i * 4.4 + (row ? 2.2 : 0), y, 40], [px - 8.8 + i * 4.4 + (row ? 2.2 : 0), y, BELT_Z + 9], 'needle'))))
  const winC: XYZ = [x0 + 46, -6, 28]
  return {
    id: 'marinering', cx: x0 + 44,
    back: [
      ...box(x0 + 6, -26, 0, 3, 3, 12), ...box(x0 + 40, -26, 0, 3, 3, 12),
      ...box(x0 + 6, 12, 0, 3, 3, 12), ...box(x0 + 40, 12, 0, 3, 3, 12),
      ...hcyl('x', x0 + 4, -6, 28, 17, 42),
      /* the hatch of the tumbler, with the meat tumbling behind the glass */
      planeDisc('x', winC, 11.5, 'l'), planeDisc('x', winC, 9.2, 'k'),
      chunkOn('x', [winC[0], winC[1] - 3.4, winC[2] + 2.6], 3.6, 2.7, 0.3, 21), chunkOn('x', [winC[0], winC[1] + 3.2, winC[2] - 2.4], 3.8, 2.8, -0.5, 22),
      chunkOn('x', [winC[0], winC[1] + 1.2, winC[2] + 4.6], 2.8, 2.2, 0.9, 23, 'pl'), chunkOn('x', [winC[0], winC[1] - 3.8, winC[2] - 3.4], 2.6, 2.1, 0.1, 24, 'pr'),
      ...box(px - 4, 16, 0, 4, 4, 40),
    ],
    front: [
      ...box(px - 4, 56, 0, 4, 4, 40),
      ...box(px - 14, 16, 40, 24, 44, 6),
      ...needles,
    ],
  }
}

const former = (x0: number): Station => {
  /* the hopper of the former is full of mince, a mound, and the mould plate has patties in it */
  const mound = heap(crumbHeap(x0 + 26, -6, 50, 1.15, 31))
  const onPlate = [0, 1, 2].flatMap((i) => sausage(x0 + 16 + i * 10, 17.5 + (i % 2), 10, 2.9, 20))
  return {
    id: 'formun', cx: x0 + 28,
    back: [
      ...box(x0, -26, 0, 52, 44, 28),
      ...vcyl(x0 + 26, -6, 28, 15, 24),
      disc(x0 + 26, -6, 52, 11, 'k'),
      ...mound,
      ...box(x0 + 8, 18, 14, 38, 11, 6),
      ...onPlate,
    ],
    front: [],
  }
}

const oven = (x0: number): Station => {
  /* three doors, each with a window and trays of golden product on the racks */
  const doors = [5, 25, 45].flatMap((dx, k) => {
    const shelf = [9, 15, 21]
    return [
      panelY(x0 + dx, 20, 5, 17, 24),
      ...shelf.flatMap((z, row) => [
        rod([x0 + dx + 1.5, 20, z], [x0 + dx + 15.5, 20, z], 'rack'),
        ...[0, 1, 2].map((i) => panelY(x0 + dx + 2.2 + i * 4.4 + (row + k) % 2 * 0.8, 20, z + 0.5, 3.6, 2.4, 'c')),
      ]),
    ]
  })
  return {
    id: 'eldun', cx: x0 + 34,
    back: [
      ...box(x0, -26, 0, 68, 46, 34),
      ...doors,
      rod([x0 + 20, 20, 17], [x0 + 20, 20, 21], 'rod'),
      ...[0, 1, 2, 3, 4].map((i) => rod([x0 + 6 + i * 12, -22, 34], [x0 + 6 + i * 12, 16, 34], 'rod')),
      ...vcyl(x0 + 54, -8, 34, 6, 20),
      wisp(x0 + 54, -8, 54, -3, 4.2, 40), wisp(x0 + 54, -8, 54, 3.5, -3.6, 34),
    ],
    front: [],
  }
}

const packer = (x0: number): Station => ({
  id: 'pokkun', cx: x0 + 40,
  back: [
    ...box(x0, -26, 0, 50, 44, 28),
    ...box(x0 + 8, -26, 28, 3, 3, 14), ...box(x0 + 34, -26, 28, 3, 3, 14),
    ...hcyl('y', x0 + 12, -24, 46, 10, 22),
    /* the reel of film on the roll, and its core */
    planeDisc('y', [x0 + 12, -2, 46], 10, 'f'), planeDisc('y', [x0 + 12, -2, 46], 3.4, 'k'),
  ],
  front: [
    ...box(x0 + 36, 14, 27, 20, 44, 9),
  ],
})

/** the packed trays stacked at the end of the belt: drawn outside the stations, so a lit machine never tints them */
export const OUTPUT: Shape[] = [...tray(504, BELT_Y, BELT_Z, 0.8), ...tray(504, BELT_Y, BELT_Z + 7.4 * 0.8, 0.8)]

export const STATIONS: Station[] = [grinder(0), injector(PITCH), former(PITCH * 2), oven(PITCH * 3), packer(PITCH * 4)]

/** where the product waits at each station, along the belt */
export const ITEM_X = [64, 170, 228, 330, 472]

/** the product, in six forms, each centred on its own origin: raw, ground, brined, formed, breaded, packed */
export const ITEM_FORMS: Shape[][] = [
  /* 0 raw: three chicken legs across the belt */
  [...drumstick(-11, -13, 0.82), ...drumstick(0, -11, 0.82), ...drumstick(11, -13, 0.82)],
  /* 1 ground: a heap of crumbs */
  heap(crumbHeap(0, 0, 0, 1.1, 5)),
  /* 2 brined: three wet cuts with a sheen on them */
  [
    ...heap([piece(-8, -4.5, 0, 8, 6, 6.4, 0.5, 14, FRESH, 11, 0.1), piece(8.5, -2, 0, 7.6, 5.8, 6, -0.3, 15, FRESH, 11, 0.1), piece(0, 7.5, 0, 8.2, 6, 6.6, 0.1, 16, FRESH, 11, 0.1)]),
    ...[[-8, -4.5, 6.4], [8.5, -2, 6], [0, 7.5, 6.6]].flatMap(([x, y, z]) => [rod([x - 4.2, y + 0.8, z], [x - 0.6, y - 2.2, z], 'shine'), rod([x + 0.8, y + 2.6, z], [x + 3.2, y + 0.6, z], 'shine'), ...grain(x + 0.5, y - 1, z, 0.4).slice(0, 1)]),
  ],
  /* 3 formed: three sausages across the belt */
  [...sausage(-9, -11.5, 22, 3.5), ...sausage(0, -9.5, 22, 3.5), ...sausage(9, -11.5, 22, 3.5)],
  /* 4 breaded and cooked: three golden cutlets with crumbs */
  [
    ...heap([
      piece(-8.5, -5, 0, 8.4, 5.8, 5, 0.35, 90, COOKED, 12, 0.06, 1.2), piece(8, -4.2, 0, 8, 5.6, 5, -0.4, 91, COOKED, 12, 0.06, 1.2), piece(-0.5, 8, 0, 8.4, 5.8, 5, 0.1, 92, COOKED, 12, 0.06, 1.2),
    ]),
    ...[[-8.5, -5], [8, -4.2], [-0.5, 8]].flatMap(([x, y], i) => crumbs(x, y, 6.2, 5, 100 + i, 7)),
  ],
  /* 5 packed: the tray */
  tray(0, 0, 0, 1),
]

/** screen-space centre of station i, for the camera */
export const centreOf = (i: number): Pt => iso(STATIONS[i].cx, 6, 30)

/** screen position of the item origin when it stands at belt x */
export const beltPoint = (x: number): Pt => iso(x, BELT_Y, BELT_Z)

/* the crate that drops onto the slab: a dark steel lug, full of cuts, in the "who we serve" section */
const LUG_X = 14, LUG_Y = 14, LUG_Z = 6, LUG_S = 56, LUG_H = 30
const LUG_TOP = LUG_Z + LUG_H
export const LUG: Shape[] = [
  ...box(LUG_X, LUG_Y, LUG_Z, LUG_S, LUG_S, LUG_H),
  panelY(LUG_X + 14, LUG_Y + LUG_S, LUG_Z + 19, 28, 5, 'k'),
  panelX(LUG_X + LUG_S, LUG_Y + 14, LUG_Z + 19, 28, 5, 'k'),
  { d: poly([iso(LUG_X + 4, LUG_Y + 4, LUG_TOP), iso(LUG_X + LUG_S - 4, LUG_Y + 4, LUG_TOP), iso(LUG_X + LUG_S - 4, LUG_Y + LUG_S - 4, LUG_TOP), iso(LUG_X + 4, LUG_Y + LUG_S - 4, LUG_TOP)]), role: 'k' },
  { d: poly([iso(LUG_X + 4, LUG_Y + 4, LUG_TOP), iso(LUG_X + LUG_S - 4, LUG_Y + 4, LUG_TOP), iso(LUG_X + LUG_S - 4, LUG_Y + 4, LUG_TOP - 12), iso(LUG_X + 4, LUG_Y + 4, LUG_TOP - 12)]), role: 'r' },
  { d: poly([iso(LUG_X + 4, LUG_Y + 4, LUG_TOP), iso(LUG_X + 4, LUG_Y + LUG_S - 4, LUG_TOP), iso(LUG_X + 4, LUG_Y + LUG_S - 4, LUG_TOP - 12), iso(LUG_X + 4, LUG_Y + 4, LUG_TOP - 12)]), role: 'l' },
  ...heap([
    piece(26, 26, LUG_TOP - 8, 9, 7, 13, 0.4, 111, FRESH, 10, 0.16), piece(46, 24, LUG_TOP - 8, 9.5, 7, 12, -0.4, 112, FRESH, 10, 0.16), piece(58, 40, LUG_TOP - 8, 8, 6.5, 11, 0.2, 113, FRESH, 10, 0.16),
    piece(24, 46, LUG_TOP - 8, 9, 7, 11, 0.8, 114, FRESH, 10, 0.16), piece(40, 40, LUG_TOP - 8, 10, 8, 15, -0.2, 115, FRESH, 10, 0.16), piece(54, 58, LUG_TOP - 8, 9, 6.5, 12, 0.6, 116, FRESH, 10, 0.16),
    piece(34, 58, LUG_TOP - 8, 8.5, 6.5, 12, -0.5, 117, FRESH, 10, 0.16), piece(37, 30, LUG_TOP + 3, 7, 5.4, 7, 0.5, 118, FRESH, 10, 0.16), piece(50, 48, LUG_TOP + 3, 7, 5.4, 8, -0.3, 119, FRESH, 10, 0.16),
    piece(30, 42, LUG_TOP + 3, 6.4, 5, 6, 1.1, 120, FRESH, 10, 0.16),
  ]),
  ...drumstick(26, 28, 0.95, LUG_TOP + 5), ...drumstick(46, 26, 0.95, LUG_TOP + 5),
]

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
