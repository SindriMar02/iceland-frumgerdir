import { KOPAL_LITIR } from './litir.ts';

export type Lab = readonly [number, number, number];

// Input: sRGB bytes (0..255); output: CIELAB L*,a*,b* relative to D65, not CSS D50 Lab.
export function srgbToLab(rgb: readonly [number, number, number]): Lab {
  if (rgb.some(v => !Number.isFinite(v) || v < 0 || v > 255)) {
    throw new RangeError('Expected sRGB channels in 0..255');
  }
  const [r, g, b] = rgb.map(v => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const f = (v: number) => v > (6 / 29) ** 3 ? Math.cbrt(v) : v / (3 * (6 / 29) ** 2) + 4 / 29;
  const x = f((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047);
  const y = f(0.2126729 * r + 0.7151522 * g + 0.0721750 * b);
  const z = f((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

const radians = Math.PI / 180;
const cos = (degrees: number) => Math.cos(degrees * radians);
const sin = (degrees: number) => Math.sin(degrees * radians);
function hue(a: number, b: number): number {
  if (a === 0 && b === 0) return 0;
  const angle = Math.atan2(b, a) / radians;
  return angle < 0 ? angle + 360 : angle;
}

// Sharma–Wu–Dalal formulation, kL=kC=kH=1; signed hue terms and achromatic branches matter.
export function deltaE2000(a: Lab, b: Lab): number {
  if ([...a, ...b].some(v => !Number.isFinite(v))) throw new RangeError('Expected finite Lab');
  const cMean = (Math.hypot(a[1], a[2]) + Math.hypot(b[1], b[2])) / 2;
  const g = 0.5 * (1 - Math.sqrt(cMean ** 7 / (cMean ** 7 + 25 ** 7)));
  const a1 = (1 + g) * a[1], a2 = (1 + g) * b[1];
  const c1 = Math.hypot(a1, a[2]), c2 = Math.hypot(a2, b[2]);
  const h1 = hue(a1, a[2]), h2 = hue(a2, b[2]);
  const achromatic = c1 * c2 === 0;
  let dh = h2 - h1;
  if (achromatic) dh = 0;
  else if (dh > 180) dh -= 360;
  else if (dh < -180) dh += 360;
  const dH = 2 * Math.sqrt(c1 * c2) * sin(dh / 2);
  const lMean = (a[0] + b[0]) / 2, cpMean = (c1 + c2) / 2;
  let hMean = (h1 + h2) / 2;
  if (achromatic) hMean = h1 + h2;
  else if (Math.abs(h1 - h2) > 180) hMean += h1 + h2 < 360 ? 180 : -180;
  const t = 1 - 0.17 * cos(hMean - 30) + 0.24 * cos(2 * hMean)
    + 0.32 * cos(3 * hMean + 6) - 0.20 * cos(4 * hMean - 63);
  const sl = 1 + 0.015 * (lMean - 50) ** 2 / Math.sqrt(20 + (lMean - 50) ** 2);
  const sc = 1 + 0.045 * cpMean, sh = 1 + 0.015 * cpMean * t;
  const rotation = -2 * Math.sqrt(cpMean ** 7 / (cpMean ** 7 + 25 ** 7))
    * sin(60 * Math.exp(-(((hMean - 275) / 25) ** 2)));
  const dl = (b[0] - a[0]) / sl, dc = (c2 - c1) / sc, dhScaled = dH / sh;
  return Math.sqrt(Math.max(0, dl * dl + dc * dc + dhScaled * dhScaled + rotation * dc * dhScaled));
}

function hexToRgb(hex: string): [number, number, number] {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new RangeError('Expected #RRGGBB');
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

export function naestiLitur(hex: string, fjoldi = 3): { nafn: string; hex: string; deltaE: number }[] {
  const target = srgbToLab(hexToRgb(hex));
  if (!Number.isInteger(fjoldi) || fjoldi < 0) throw new RangeError('Expected a nonnegative integer count');
  return KOPAL_LITIR.map(litur => ({
    ...litur, deltaE: deltaE2000(target, srgbToLab(hexToRgb(litur.hex))),
  })).sort((a, b) => a.deltaE - b.deltaE).slice(0, fjoldi)
    .map(litur => ({ ...litur, deltaE: Math.round(litur.deltaE * 10) / 10 }));
}

// UI heuristics, not production tolerances: ≤2 exact, ≤5 very close, ≤10 close, >10 distant.
export function lysing(deltaE: number): 'nakvaemur' | 'mjog-nalaegur' | 'nalaegur' | 'fjarlaegur' {
  if (!Number.isFinite(deltaE) || deltaE < 0) throw new RangeError('Expected nonnegative finite ΔE');
  return deltaE <= 2 ? 'nakvaemur' : deltaE <= 5 ? 'mjog-nalaegur' : deltaE <= 10 ? 'nalaegur' : 'fjarlaegur';
}
