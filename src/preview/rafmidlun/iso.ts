/* Isometric drawing kit for the Rafmiðlun line (the kit is shared with the Matvélar and Samhentir builds; the drawing is new).
 *
 * Our own geometry, written for this build: world (x, y, z) projects to the
 * screen with the true isometric angle, so a circle in the floor plane is an
 * ellipse with rx = 1.2247 r and ry = 0.7071 r. x runs down and to the right,
 * y down and to the left, z straight up. A point with a larger x + y is nearer
 * the viewer, so shapes are emitted back to front.
 *
 * Every shape carries a role; the stylesheet colours roles. Stations are white
 * and steel (lit in Rafmiðlun's navy when active); copper (p, pl, pr) is busbars and
 * cable, kraft (b, bl, br) is cartons, wood (d, dl, dr) is a cable drum, and the
 * ink on a drawing, a label or a band is the one navy (u).
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


/* ── sheets, boards and the stock they are built from ─────────────────── */

const KRAFT: [Role, Role, Role] = ['bl', 'br', 'b']
const COPPER: [Role, Role, Role] = ['pl', 'pr', 'p']
const PAPER: [Role, Role, Role] = ['w', 'w', 'w']

/** a flat quad lying in the floor plane at height z */
const flat = (x: number, y: number, z: number, w: number, d: number, role: Role): Shape =>
  ({ d: poly([iso(x, y, z), iso(x + w, y, z), iso(x + w, y + d, z), iso(x, y + d, z)]), role })

/** strokes on a horizontal surface at height z, as one path */
const strokes = (segs: [number, number, number, number][], z: number, cls = 'ink'): Shape[] =>
  join(segs.map(([x1, y1, x2, y2]) => rod([x1, y1, z], [x2, y2, z], cls)))

const SW = 30, SD = 21, ST = 0.6

/** a drawing sheet lying on the ladder */
const sheet = (): Shape[] => box(-SW / 2, -SD / 2, 0, SW, SD, ST, PAPER)

/** the floor plan the meeting leaves with: walls, one door gap, the board's place marked in the ink */
const plan = (): Shape[] => [
  ...sheet(),
  ...strokes([
    [-12, -8, 12, -8], [12, -8, 12, 8], [12, 8, -12, 8], [-12, 8, -12, -8],
    [-2, -8, -2, 1], [-12, 1, -6, 1], [-3.6, 1, -2, 1], [4, 8, 4, 2], [4, 2, 12, 2],
  ], ST, 'ink'),
  flat(7.6, -6.8, ST + 0.05, 3, 2, 'u'),
]

/** the single-line diagram: supply, a bus, five outgoing circuits, each with its breaker */
const diagram = (): Shape[] => {
  const xs = [-9, -4.5, 0, 4.5, 9]
  return [
    ...sheet(),
    ...strokes([[0, -9.5, 0, -6], [-10, -6, 10, -6], ...xs.map((x): [number, number, number, number] => [x, -6, x, 7.5])], ST, 'ink'),
    ...xs.map((x) => flat(x - 0.9, -1.4, ST + 0.05, 1.8, 2.2, 'u')),
    flat(-1.2, -9.4, ST + 0.05, 2.4, 1.8, 'u'),
  ]
}

/** an enclosure on its plinth, empty, fitted or closed; front is the +y face */
function enclosure(x: number, y: number, z: number, w: number, d: number, h: number, state: 'empty' | 'fitted' | 'closed', cables = false): Shape[] {
  const fy = y + d
  const pz = z + 2.6
  const out: Shape[] = [...box(x - 0.6, y - 0.6, z, w + 1.2, d + 1.2, 2.6, ['k', 'k', 'k']), ...box(x, y, pz, w, d, h)]
  const s = w / 24
  if (state === 'closed') {
    out.push(panelY(x + 1 * s, fy, pz + 1.2, w - 2 * s, h - 2.4, 't'))
    out.push(rod([x + w - 3 * s, fy, pz + h * 0.42], [x + w - 3 * s, fy, pz + h * 0.58], 'handle'))
    out.push(panelY(x + 3.6 * s, fy, pz + h - 7 * s, 8 * s, 3 * s, 'u'))
    out.push(...join([0, 1, 2, 3].map((k) => rod([x + 4 * s, fy, pz + 4 * s + k * 1.6 * s], [x + 12 * s, fy, pz + 4 * s + k * 1.6 * s], 'vent'))))
  } else {
    out.push(panelY(x + 1.4 * s, fy, pz + 1.4, w - 2.8 * s, h - 2.8, 'k'))
    out.push(panelY(x + 2.6 * s, fy, pz + 2.6, w - 5.2 * s, h - 5.2, 'w'))
    if (state === 'fitted') {
      /* three copper busbars across the top, two rows of breakers on their rails, the main switch in the ink */
      for (let k = 0; k < 3; k++) out.push(...box(x + 4 * s, fy, pz + h - 8 * s - k * 2.4 * s, w - 8 * s, 0.9, 1.2 * s, COPPER))
      for (const rz of [pz + h * 0.42, pz + h * 0.2]) {
        out.push(rod([x + 3.4 * s, fy + 0.2, rz + 2.2 * s], [x + w - 3.4 * s, fy + 0.2, rz + 2.2 * s], 'rail'))
        for (let i = 0; i < 7; i++) out.push(...box(x + 4 * s + i * 2.3 * s, fy, rz, 2 * s, 1.4, 4.4 * s, ['w', 'l', 't']))
      }
      out.push(...box(x + w - 9 * s, fy, pz + h * 0.62, 4.4 * s, 1.8, 4.6 * s, ['u', 'u', 'u']))
      out.push(...join([0, 1, 2, 3, 4].map((i) => rod([x + 5 * s + i * 2.3 * s, fy + 1, pz + h * 0.2], [x + 5 * s + i * 2.3 * s, fy + 1, pz + 2], 'cable'))))
    }
  }
  if (cables) out.push(...join([0, 1, 2].map((i) => rod([x + w * (0.3 + i * 0.2), y + d / 2, pz + h], [x + w * (0.3 + i * 0.2), y + d / 2, pz + h + 18], 'cable'))))
  return out
}

/** a drum of cable: two wooden flanges and the copper between them, lying along x */
function drum(x: number, y: number, z: number, r: number, len: number): Shape[] {
  return [
    ...hcyl('x', x, y, z, r, 2.4, ['dl', 'd']),
    ...hcyl('x', x + 2.4, y, z, r * 0.68, len, ['pl', 'p']),
    ...hcyl('x', x + 2.4 + len, y, z, r, 2.4, ['dl', 'd']),
    planeDisc('x', [x + 4.8 + len, y, z], r * 0.18, 'k'),
  ]
}

/** a closed carton with a band of the ink */
function carton(x: number, y: number, z: number, w: number, d: number, h: number): Shape[] {
  return [...box(x, y, z, w, d, h, KRAFT), panelY(x + w * 0.12, y + d, z + h * 0.38, w * 0.5, h * 0.28, 'u'), rod([x, y + d / 2, z + h], [x + w, y + d / 2, z + h], 'tape')]
}

/* ── the line ─────────────────────────────────────────────────────────── */

export const PITCH = 100
export const BELT_Y = 39
export const BELT_Z = 14

/** `back` is drawn before the ladder and the product, `front` after them; cz is the height the camera looks at */
export interface Station { id: string; back: Shape[]; front: Shape[]; cx: number; cz: number }

const BELT_END = 474

/** the cable ladder the board travels on: two rails, the rungs between them, a post every metre */
const belt = (): Shape[] => {
  const out: Shape[] = []
  for (let x = -24; x <= BELT_END - 10; x += 100) out.push(...box(x, 22, 0, 3, 3, 10), ...box(x, 53, 0, 3, 3, 10))
  out.push(...box(-34, 22, 10, BELT_END + 34, 3, 4))
  const rungs: Shape[] = []
  for (let x = -30; x < BELT_END - 2; x += 9) rungs.push(rod([x, 25, 11.4], [x, 53, 11.4], 'rung'))
  out.push(...join(rungs))
  out.push(...box(-34, 53, 10, BELT_END + 34, 3, 4))
  return out
}

export const BELT = belt()

const legs = (x0: number, x1: number, y0: number, y1: number, h: number): Shape[] => [...box(x0, y0, 0, 3, 3, h), ...box(x1, y0, 0, 3, 3, h), ...box(x0, y1, 0, 3, 3, h), ...box(x1, y1, 0, 3, 3, h)]

/** 01 Ráðgjöf: a meeting table with a site plan rolled up, a hard hat and a laptop, two stools behind */
const radgjof = (x0: number): Station => ({
  id: 'radgjof', cx: x0 + 30, cz: 24,
  back: [
    ...vcyl(x0 + 16, -34, 0, 4.5, 14), ...vcyl(x0 + 44, -34, 0, 4.5, 14),
    ...box(x0 + 6, -22, 0, 3, 3, 22), ...box(x0 + 52, -22, 0, 3, 3, 22),
    ...box(x0 + 4, -24, 22, 54, 34, 3),
    ...box(x0 + 6, 6, 0, 3, 3, 22), ...box(x0 + 52, 6, 0, 3, 3, 22),
    ...hcyl('x', x0 + 10, -18, 26.8, 1.8, 20, ['w', 'w']),
    /* the hard hat: a brim, then a dome stepped in four rings, and the ridge */
    disc(x0 + 18, -4, 25, 7.6, 'r'), ...vcyl(x0 + 18, -4, 25.4, 5.6, 1.6), ...vcyl(x0 + 18, -4, 27, 5, 1.4), ...vcyl(x0 + 18, -4, 28.4, 4, 1.2), ...vcyl(x0 + 18, -4, 29.6, 2.6, 0.8),
    rod([x0 + 13.4, -4, 27.2], [x0 + 18, -4, 30.4], 'rail'),
    ...box(x0 + 34, -12, 25, 15, 11, 0.8),
    ...box(x0 + 34, -12, 25.8, 15, 1, 10),
    panelY(x0 + 35.2, -11, 27, 12.6, 7.6, 'k'),
  ],
  front: [],
})

/** 02 Hönnun: a desk and a screen with the single-line diagram on it */
const honnun = (x0: number): Station => {
  const sy = -19.6
  const bus = 45, xs = [16, 21, 26, 31, 36].map((v) => x0 + v + 2)
  return {
    id: 'honnun', cx: x0 + 30, cz: 32,
    back: [
      ...legs(x0 + 4, x0 + 52, -24, 6, 22),
      ...box(x0 + 2, -26, 22, 56, 36, 3),
      ...box(x0 + 27, -20, 25, 4, 4, 5),
      ...box(x0 + 10, -22, 30, 38, 2.4, 22),
      panelY(x0 + 12, sy, 32, 34, 18, 'k'),
      ...join([[x0 + 28, sy, 48.4, x0 + 28, sy, bus], [x0 + 16, sy, bus, x0 + 40, sy, bus], ...xs.map((x) => [x, sy, bus, x, sy, 35.4])].map(([a, b, c, d, e, g]) => rod([a, b, c], [d, e, g], 'scr'))),
      ...xs.map((x) => panelY(x - 0.9, sy, 39, 1.8, 2.4, 'u')),
      ...box(x0 + 18, -10, 25, 20, 6, 1),
      ...box(x0 + 44, -8, 25, 6, 8, 0.6, ['w', 'w', 'w']),
    ],
    front: [],
  }
}

/** 03 Teikningar: a large-format plotter, a roll of paper, a drawing feeding out of it */
const teikningar = (x0: number): Station => ({
  id: 'teikningar', cx: x0 + 30, cz: 30,
  back: [
    ...legs(x0 + 6, x0 + 50, -22, -8, 24),
    ...box(x0 + 2, -24, 24, 56, 18, 12),
    ...hcyl('x', x0 + 6, -19, 39.6, 3.6, 48, ['w', 't']),
    panelY(x0 + 6, -6, 29.6, 48, 2, 'k'),
    panelX(x0 + 58, -20, 28, 8, 5, 'k'),
    { d: poly([iso(x0 + 9, -6, 30), iso(x0 + 51, -6, 30), iso(x0 + 51, 6, 21), iso(x0 + 9, 6, 21)]), role: 'w' },
    ...join([0.3, 0.55, 0.8].map((t) => rod([x0 + 14, -6 + 12 * t, 30 - 9 * t], [x0 + 46, -6 + 12 * t, 30 - 9 * t], 'ink'))),
    rod([x0 + 30, -6, 30], [x0 + 30, 6, 21], 'ink'),
  ],
  front: [],
})

/** 04 Efnisöflun: racking with a drum of cable, cartons and boxed breakers */
const efnisoflun = (x0: number): Station => ({
  id: 'efnisoflun', cx: x0 + 30, cz: 30,
  back: [
    ...box(x0 + 2, -32, 0, 3, 3, 58), ...box(x0 + 55, -32, 0, 3, 3, 58),
    ...box(x0 + 2, -32, 2, 56, 26, 2),
    ...drum(x0 + 7, -19, 14.4, 10, 15),
    ...carton(x0 + 36, -29, 4, 18, 14, 10), ...carton(x0 + 38, -27, 14, 14, 11, 7),
    ...box(x0 + 2, -32, 27, 56, 26, 2),
    ...[0, 1, 2].flatMap((i) => [...box(x0 + 6 + i * 12, -28, 29, 10, 9, 6), panelY(x0 + 7 + i * 12, -19, 31, 6, 2, 'u')]),
    ...vcyl(x0 + 48, -18, 29, 6, 5, ['pl', 'p']), disc(x0 + 48, -18, 34, 2.6, 'k'),
    ...box(x0 + 2, -32, 50, 56, 26, 2),
    ...carton(x0 + 8, -28, 52, 22, 16, 10), ...carton(x0 + 34, -26, 52, 16, 13, 8),
    ...box(x0 + 2, -9, 0, 3, 3, 58), ...box(x0 + 55, -9, 0, 3, 3, 58),
  ],
  front: [],
})

/** 05 Framkvæmd: a wall with a cable ladder up it, sockets and a lamp; a finished board stands against it */
const FX = PITCH * 4
const framkvaemd = (): Station => ({
  id: 'framkvaemd', cx: FX + 34, cz: 36,
  back: [
    ...box(FX - 4, -40, 0, 80, 6, 74),
    ...box(FX + 44, -34, 8, 2, 1.4, 66), ...box(FX + 56, -34, 8, 2, 1.4, 66),
    ...join(Array.from({ length: 10 }, (_, k) => rod([FX + 46, -33, 12 + k * 6.4], [FX + 56, -33, 12 + k * 6.4], 'rung'))),
    ...join([48, 50.5, 53].map((cx) => rod([FX + cx, -33, 10], [FX + cx, -33, 74], 'cable'))),
    panelY(FX + 6, -34, 18, 6, 6, 't'), panelY(FX + 15, -34, 18, 6, 6, 't'),
    ...box(FX + 14, -34, 64, 2, 14, 2),
    ...vcyl(FX + 15, -21, 56, 5, 4, ['u', 'u']), disc(FX + 15, -21, 56, 4.2, 'w'),
  ],
  front: [],
})

/** the board that is already done, against the wall: drawn outside the stations, so a lit station never tints it */
export const OUTPUT: Shape[] = enclosure(FX + 54, -31, 0, 18, 11, 30, 'closed', true)

export const STATIONS: Station[] = [radgjof(0), honnun(PITCH), teikningar(PITCH * 2), efnisoflun(PITCH * 3), framkvaemd()]

/** where the board waits at each station, along the ladder */
export const ITEM_X = [34, 134, 234, 334, 428]

const EW = 24, ED = 14, EH = 36

/** the board, in six forms, each centred on its own origin */
export const ITEM_FORMS: Shape[][] = [
  /* 0 a blank sheet */
  sheet(),
  /* 1 the plan of the place */
  plan(),
  /* 2 the single-line diagram */
  diagram(),
  /* 3 the empty enclosure */
  enclosure(-EW / 2, -ED / 2, 0, EW, ED, EH, 'empty'),
  /* 4 busbars, rails and breakers in */
  enclosure(-EW / 2, -ED / 2, 0, EW, ED, EH, 'fitted'),
  /* 5 closed, labelled, cables rising */
  enclosure(-EW / 2, -ED / 2, 0, EW, ED, EH, 'closed', true),
]

/** screen position of the item origin when it stands at ladder x */
export const beltPoint = (x: number): Pt => iso(x, BELT_Y, BELT_Z)

/** screen-space centre for the camera at station i: between the station and where the board stands, so both are in frame */
export const centreOf = (i: number): Pt => {
  const [mx, my] = iso(STATIONS[i].cx, 10, STATIONS[i].cz)
  const [px, py] = beltPoint(ITEM_X[i])
  return [mx + (px - mx) * 0.42, my + (py - my) * 0.42]
}

/* the board that drops onto its plinth, in the skápasmíði section */
export const DROP_PALLET: Shape[] = [...box(8, 8, 0, 68, 42, 5, ['k', 'k', 'k'])]
export const DROP_BOX: Shape[] = enclosure(14, 14, 5, 56, 30, 64, 'closed')
export const DROP_CORNERS: Pt[] = [iso(14, 44, 5), iso(70, 44, 5), iso(70, 14, 5)]
/** the same board with its cables rising, for the hero */
export const HERO_BOARD: Shape[] = enclosure(14, 14, 5, 56, 30, 64, 'closed', true)

/* camera boxes, [minX, minY, w, h], all with the card's 481:469 aspect */
export const ASPECT = 481 / 469
export function camera(i: number, width = 178): [number, number, number, number] {
  const [cx, cy] = centreOf(i)
  const h = width / ASPECT
  return [cx - width / 2, cy - h / 2, width, h]
}
export function overview(): [number, number, number, number] {
  const w = 600
  const h = w / ASPECT
  const [cx, cy] = iso(240, 10, 36)
  return [cx - w / 2, cy - h / 2, w, h]
}
