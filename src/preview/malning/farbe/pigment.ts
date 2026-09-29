/* Illustrative Kubelka–Munk model, NOT a measured Málning paint formula.
 * Synthetic pigment spectra and drop strengths are tuned for typical tinting behaviour;
 * neither these previews nor the scanned Kópal swatches claim absolute paint accuracy. */
export const LITEFNI = [
  { id: 'gult', nafn: 'Gult', hex: '#e8b817' },
  { id: 'rautt', nafn: 'Rautt', hex: '#b52b20' },
  { id: 'blatt', nafn: 'Blátt', hex: '#174b91' },
  { id: 'graent', nafn: 'Grænt', hex: '#22623c' },
  { id: 'umbra', nafn: 'Umbra', hex: '#65452e' },
  { id: 'svart', nafn: 'Svart', hex: '#202020' },
] as const;

export type LiteftiId = (typeof LITEFNI)[number]['id'];
export type Dropar = Partial<Record<LiteftiId, number>>;
export const HAMARK_DROPA = 40;
export const GRUNNUR = { id: 'grunnur', nafn: 'Hvítur grunnur', hex: '#fdfdfd' } as const;

// CIE 1931 2° x̄,ȳ,z̄ and D65 SPD, sampled every 10 nm from 400–700 nm.
// Rounded standard tables: https://cie.co.at/data-tables (source links in REPORT.md).
const SPECTRUM = [
  [0.014310, 0.000396, 0.067850, 82.7549],
  [0.043510, 0.001210, 0.207400, 91.4860],
  [0.134380, 0.004000, 0.645600, 93.4318],
  [0.283900, 0.011600, 1.385600, 86.6823],
  [0.348280, 0.023000, 1.747060, 104.865],
  [0.336200, 0.038000, 1.772110, 117.008],
  [0.290800, 0.060000, 1.669200, 117.812],
  [0.195360, 0.090980, 1.287640, 114.861],
  [0.095640, 0.139020, 0.812950, 115.923],
  [0.032010, 0.208020, 0.465180, 108.811],
  [0.004900, 0.323000, 0.272000, 109.354],
  [0.009300, 0.503000, 0.158200, 107.802],
  [0.063270, 0.710000, 0.078250, 104.790],
  [0.165500, 0.862000, 0.042160, 107.689],
  [0.290400, 0.954000, 0.020300, 104.405],
  [0.433450, 0.994950, 0.008750, 104.046],
  [0.594500, 0.995000, 0.003900, 100.000],
  [0.762100, 0.952000, 0.002100, 96.3342],
  [0.916300, 0.870000, 0.001650, 95.7880],
  [1.026300, 0.757000, 0.001100, 88.6856],
  [1.062200, 0.631000, 0.000800, 90.0062],
  [1.002600, 0.503000, 0.000340, 89.5991],
  [0.854450, 0.381000, 0.000190, 87.6987],
  [0.642400, 0.265000, 0.000050, 83.2886],
  [0.447900, 0.175000, 0.000020, 83.6992],
  [0.283500, 0.107000, 0.000000, 80.0268],
  [0.164900, 0.061000, 0.000000, 80.2146],
  [0.087400, 0.032000, 0.000000, 82.2778],
  [0.046770, 0.017000, 0.000000, 78.2842],
  [0.022700, 0.008210, 0.000000, 69.7213],
  [0.011359, 0.004102, 0.000000, 71.6091],
] as const;

// K absorbs light; S scatters it back. Units are relative to one fixed white base.
// White has K=0.0002, S=1; one drop adds 0.0125 pigment units. Pigment S is flat.
const SCATTERING = [0.18, 0.12, 0.10, 0.14, 0.20, 0.04] as const;
const edge = (nm: number, centre: number, width: number) =>
  1 / (1 + Math.exp((nm - centre) / width));
const ABSORPTION = SPECTRUM.map((_, i) => {
  const nm = 400 + i * 10;
  return [
    0.025 + 9 * edge(nm, 495, 12),
    0.04 + 7 * edge(nm, 590, 14) + 2 * edge(nm, 490, 15),
    0.04 + 8 * (1 - edge(nm, 565, 17)),
    0.08 + 7 * edge(nm, 490, 15) + 7 * (1 - edge(nm, 585, 18)),
    0.7 + 5 * edge(nm, 580, 65),
    12,
  ];
});
const WHITE = [0.95047, 1, 1.08883] as const;
const NORMALIZATION = WHITE.map((value, channel) =>
  value / SPECTRUM.reduce((sum, row) => sum + row[channel] * row[3], 0));

function srgbByte(linear: number): number {
  const v = Math.max(0, Math.min(1, linear));
  return Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055));
}

export function blanda(dropar: Dropar): { hex: string; rgb: [number, number, number] } {
  const amounts = LITEFNI.map(({ id }) => {
    const n = dropar[id] ?? 0;
    if (!Number.isInteger(n) || n < 0 || n > HAMARK_DROPA) {
      throw new RangeError(`Invalid drops for ${id}: expected integer 0..${HAMARK_DROPA}`);
    }
    return n * 0.0125;
  });
  const xyz = [0, 0, 0];
  const s = 1 + amounts.reduce((sum, amount, i) => sum + amount * SCATTERING[i], 0);
  SPECTRUM.forEach((row, i) => {
    const k = 0.0002 + amounts.reduce((sum, amount, j) => sum + amount * ABSORPTION[i][j], 0);
    const q = k / s;
    // Optically thick, diffuse paint: R∞=1+K/S−√((K/S)²+2K/S).
    // Reciprocal form avoids cancellation; volume normalization cancels in K/S.
    const reflectance = 1 / (1 + q + Math.sqrt(q * q + 2 * q));
    for (let c = 0; c < 3; c++) xyz[c] += reflectance * row[c] * row[3];
  });
  // Per-channel white normalization corrects truncated spectral tails, keeping grey neutral.
  const [x, y, z] = xyz.map((value, i) => value * NORMALIZATION[i]);
  const rgb: [number, number, number] = [
    srgbByte(3.2404542 * x - 1.5371385 * y - 0.4985314 * z),
    srgbByte(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
    srgbByte(0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
  ];
  return { hex: '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join(''), rgb };
}
