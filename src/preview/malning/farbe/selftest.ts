import {
  GRUNNUR, HAMARK_DROPA, KOPAL_LITIR, LITEFNI, blanda, deltaE2000,
  fraKodi, kortkodi, lysing, naestiLitur, srgbToLab,
} from './index.ts';
import type { Dropar, Lab, Uppskrift } from './index.ts';

let checks = 0;
function check(condition: boolean, message: string): asserts condition {
  checks++;
  if (!condition) {
    console.assert(condition, message);
    process.exit(1);
  }
}
function rejects(fn: () => unknown, message: string): void {
  let rejected = false;
  try { fn(); } catch (error) { rejected = error instanceof RangeError; }
  check(rejected, message);
}
function hue([r, g, b]: readonly number[]): number {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (d === 0) return 0;
  const h = max === r ? (g - b) / d : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}
function sameRecipe(a: Uppskrift | null, b: Uppskrift): boolean {
  return a !== null && a.vara === b.vara && a.gljai === b.gljai && a.litrar === b.litrar
    && LITEFNI.every(({ id }) => (a.dropar[id] ?? 0) === (b.dropar[id] ?? 0));
}

check(LITEFNI.map(p => p.id).join(',') === 'gult,rautt,blatt,graent,umbra,svart', 'stable pigment order');
check(HAMARK_DROPA === 40, 'drop limit');
const white = blanda({});
check(white.hex === GRUNNUR.hex && white.rgb.every(v => v === 253), 'white base');
check(blanda({ gult: 0, svart: 0 }).hex === white.hex, 'missing drops mean zero');
for (let n = 1; n <= HAMARK_DROPA; n++) {
  const grey = blanda({ svart: n }).rgb;
  check(Math.max(...grey) - Math.min(...grey) <= 1 && grey[0] < 253, `neutral grey ${n}`);
}
for (const drops of [2, 12, 40]) {
  const green = blanda({ gult: drops, blatt: drops }).rgb;
  check(green[1] > green[0] && green[1] > green[2] && hue(green) >= 80 && hue(green) <= 160,
    `yellow + blue gives green at ${drops}`);
}
const pink = blanda({ rautt: 1 }).rgb;
check(pink[0] > pink[1] && pink[2] < pink[0] && pink[1] >= pink[2]
  && hue(pink) >= 0 && hue(pink) <= 30 && srgbToLab(pink)[0] > 80, 'warm pale pink, not lilac');
const brown = blanda({ umbra: 30 }).rgb;
check(brown[0] > brown[1] && brown[1] > brown[2] && hue(brown) > 10 && hue(brown) < 50,
  'warm umbra brown');
for (const { id } of LITEFNI) {
  let previous = srgbToLab(white.rgb)[0];
  for (let n = 1; n <= HAMARK_DROPA; n++) {
    const current = srgbToLab(blanda({ [id]: n }).rgb)[0];
    check(current <= previous + 1e-10, `${id} monotonically darkens at ${n}`);
    previous = current;
  }
  check(previous < srgbToLab(white.rgb)[0] - 10, `${id} visibly darkens`);
}
for (const n of [-1, 41, 0.5, NaN, Infinity]) {
  rejects(() => blanda({ rautt: n }), `invalid drops ${n}`);
}
const labWhite = srgbToLab([255, 255, 255]), labBlack = srgbToLab([0, 0, 0]);
check(Math.abs(labWhite[0] - 100) < 0.0001 && Math.hypot(labWhite[1], labWhite[2]) < 0.0001, 'D65 Lab white');
check(labBlack.every(v => v === 0), 'Lab black');
const labRed = srgbToLab([255, 0, 0]);
check(Math.abs(labRed[0] - 53.2408) < 0.001 && Math.abs(labRed[1] - 80.0925) < 0.001
  && Math.abs(labRed[2] - 67.2032) < 0.001, 'D65 sRGB red Lab');
rejects(() => srgbToLab([256, 0, 0]), 'invalid sRGB');
rejects(() => deltaE2000([NaN, 0, 0], labWhite), 'invalid Lab');

// All 34 Sharma–Wu–Dalal supplementary reference pairs; published ΔE rounded to 4 decimals.
// https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/dataNprograms/ciede2000testdata.txt
const references: readonly (readonly [Lab, Lab, number])[] = [
  [[50, 2.6772, -79.7751], [50, 0, -82.7485], 2.0425],
  [[50, 3.1571, -77.2803], [50, 0, -82.7485], 2.8615],
  [[50, 2.8361, -74.0200], [50, 0, -82.7485], 3.4412],
  [[50, -1.3802, -84.2814], [50, 0, -82.7485], 1],
  [[50, -1.1848, -84.8006], [50, 0, -82.7485], 1],
  [[50, -0.9009, -85.5211], [50, 0, -82.7485], 1],
  [[50, 0, 0], [50, -1, 2], 2.3669],
  [[50, -1, 2], [50, 0, 0], 2.3669],
  [[50, 2.49, -0.001], [50, -2.49, 0.0009], 7.1792],
  [[50, 2.49, -0.001], [50, -2.49, 0.001], 7.1792],
  [[50, 2.49, -0.001], [50, -2.49, 0.0011], 7.2195],
  [[50, 2.49, -0.001], [50, -2.49, 0.0012], 7.2195],
  [[50, -0.001, 2.49], [50, 0.0009, -2.49], 4.8045],
  [[50, -0.001, 2.49], [50, 0.001, -2.49], 4.8045],
  [[50, -0.001, 2.49], [50, 0.0011, -2.49], 4.7461],
  [[50, 2.5, 0], [50, 0, -2.5], 4.3065],
  [[50, 2.5, 0], [73, 25, -18], 27.1492],
  [[50, 2.5, 0], [61, -5, 29], 22.8977],
  [[50, 2.5, 0], [56, -27, -3], 31.9030],
  [[50, 2.5, 0], [58, 24, 15], 19.4535],
  [[50, 2.5, 0], [50, 3.1736, 0.5854], 1],
  [[50, 2.5, 0], [50, 3.2972, 0], 1],
  [[50, 2.5, 0], [50, 1.8634, 0.5757], 1],
  [[50, 2.5, 0], [50, 3.2592, 0.3350], 1],
  [[60.2574, -34.0099, 36.2677], [60.4626, -34.1751, 39.4387], 1.2644],
  [[63.0109, -31.0961, -5.8663], [62.8187, -29.7946, -4.0864], 1.2630],
  [[61.2901, 3.7196, -5.3901], [61.4292, 2.2480, -4.9620], 1.8731],
  [[35.0831, -44.1164, 3.7933], [35.0232, -40.0716, 1.5901], 1.8645],
  [[22.7233, 20.0904, -46.6940], [23.0331, 14.9730, -42.5619], 2.0373],
  [[36.4612, 47.8580, 18.3852], [36.2715, 50.5065, 21.2231], 1.4146],
  [[90.8027, -2.0831, 1.4410], [91.1528, -1.6435, 0.0447], 1.4441],
  [[90.9257, -0.5406, -0.9208], [88.6381, -0.8985, -0.7239], 1.5381],
  [[6.7747, -0.2908, -2.4247], [5.8714, -0.0985, -2.2286], 0.6377],
  [[2.0776, 0.0795, -1.1350], [0.9033, -0.0636, -0.5514], 0.9082],
];
references.forEach(([a, b, expected], i) => {
  check(Math.abs(deltaE2000(a, b) - expected) <= 0.00005, `Sharma pair ${i + 1}`);
  check(Math.abs(deltaE2000(b, a) - expected) <= 0.00005, `Sharma symmetry ${i + 1}`);
  check(deltaE2000(a, a) === 0, `Lab identity ${i + 1}`);
});

const whiteNames = ['HVÍTT', 'HVÍTT 0500', 'FANNHVÍTT', 'SALTHVÍTT'];
check(whiteNames.includes(naestiLitur('#ffffff')[0].nafn), 'nearest white');
check(naestiLitur('#ffffff')[0].deltaE === 0, 'white exact match');
const nearestBlack = naestiLitur('#000000')[0];
check(Math.max(...nearestBlack.hex.slice(1).match(/../g)!.map(v => parseInt(v, 16))) < 64, 'nearest black is dark');
check(naestiLitur('#ABCDEF').length === 3, 'default three matches, case-insensitive hex');
check(naestiLitur('#ffffff', 0).length === 0, 'zero matches');
check(naestiLitur('#ffffff', 1000).length === KOPAL_LITIR.length, 'count capped to card');
for (const { nafn, hex } of KOPAL_LITIR) {
  const matches = naestiLitur(hex, KOPAL_LITIR.length);
  check(matches.some(m => m.nafn === nafn && m.deltaE === 0), `card self-match ${nafn}`);
  check(matches.every((m, i) => i === 0 || m.deltaE >= matches[i - 1].deltaE), `sorted ${nafn}`);
  check(matches.every(m => Math.abs(m.deltaE * 10 - Math.round(m.deltaE * 10)) < 1e-10), `one decimal ${nafn}`);
}
for (const hex of ['#fff', '#gg0000', '#00000000', 'ffffff']) rejects(() => naestiLitur(hex), `bad hex ${hex}`);
for (const n of [-1, 0.5, NaN, Infinity]) rejects(() => naestiLitur('#ffffff', n), `bad match count ${n}`);
for (const [n, expected] of [[0, 'nakvaemur'], [2, 'nakvaemur'], [2.01, 'mjog-nalaegur'],
  [5, 'mjog-nalaegur'], [5.01, 'nalaegur'], [10, 'nalaegur'], [10.01, 'fjarlaegur']] as const) {
  check(lysing(n) === expected, `match threshold ${n}`);
}
rejects(() => lysing(-1), 'negative deltaE');
rejects(() => lysing(NaN), 'NaN deltaE');

const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const empty: Uppskrift = { dropar: {}, vara: 0, gljai: 0, litrar: 0 };
const full: Uppskrift = { dropar: Object.fromEntries(LITEFNI.map(p => [p.id, 40])), vara: 63, gljai: 3, litrar: 5 };
const asymmetric: Uppskrift = { dropar: { gult: 1, rautt: 2, blatt: 3, graent: 4, umbra: 5, svart: 6 }, vara: 37, gljai: 2, litrar: 4 };
check(kortkodi(empty) === 'MAL-0000-0000-000Y', 'zero format vector');
check(kortkodi(full) === 'MAL-02H8-MA52-HZXC', 'maximum format vector');
check(kortkodi(asymmetric) === 'MAL-0022-1H0M-D5MF', 'field order format vector');
check(fraKodi('MAL-02J0-0000-000E') === null, 'valid checksum but forbidden 41 drops');
check(fraKodi('MAL-0000-0000-0060') === null, 'valid checksum but forbidden pack index 6');
for (const recipe of [empty, full, asymmetric]) {
  const code = kortkodi(recipe);
  check(sameRecipe(fraKodi(code), recipe), 'boundary/asymmetric recipe');
  check(sameRecipe(fraKodi(code.toLowerCase().replace(/-/g, ' \t')), recipe), 'case/whitespace forgiving');
  for (const alias of ['I', 'L']) {
    const aliased = 'MAL-' + code.slice(4).replace(/0/g, 'O').replace(/1/g, alias);
    check(sameRecipe(fraKodi(aliased), recipe), `Crockford aliases ${alias}`);
  }
  const body = code.slice(4).replace(/-/g, '');
  for (let i = 0; i < body.length; i++) {
    for (const digit of alphabet) {
      if (digit !== body[i]) {
        check(fraKodi('MAL' + body.slice(0, i) + digit + body.slice(i + 1)) === null,
          `single-symbol corruption at ${i}: ${digit}`);
      }
    }
  }
}
for (const code of ['', '000000000000', 'MAL-0000-0000-000', 'MAL-0000-0000-00000',
  'BAD-0000-0000-0000', 'MAL-U000-0000-0000', 'MAL-4000-0000-0000']) {
  check(fraKodi(code) === null, `malformed code ${code}`);
}
for (const n of [-1, 41, 0.5, NaN, Infinity]) rejects(() => kortkodi({ ...empty, dropar: { blatt: n } }), `code invalid drops ${n}`);
for (const [key, max] of [['vara', 63], ['gljai', 3], ['litrar', 5]] as const) {
  for (const n of [-1, max + 1, 0.5, NaN, Infinity]) rejects(() => kortkodi({ ...empty, [key]: n }), `code invalid ${key} ${n}`);
}

let state = 0x4d414c;
function randomInt(limit: number): number {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return Math.floor((state / 2 ** 32) * limit);
}
for (let i = 0; i < 5000; i++) {
  const dropar: Dropar = {};
  for (const { id } of LITEFNI) {
    const n = randomInt(41);
    if (n !== 0 || i % 2 === 0) dropar[id] = n;
  }
  const recipe: Uppskrift = { dropar, vara: randomInt(64), gljai: randomInt(4), litrar: randomInt(6) };
  const before = JSON.stringify(recipe), code = kortkodi(recipe), decoded = fraKodi(code);
  check(sameRecipe(decoded, recipe), `recipe round-trip ${i}`);
  check(decoded !== null && kortkodi(decoded) === code && /^MAL-[0-9A-HJKMNP-TV-Z]{4}(-[0-9A-HJKMNP-TV-Z]{4}){2}$/.test(code),
    `canonical code ${i}`);
  const badChecksum = code.slice(0, -1) + alphabet[(alphabet.indexOf(code[code.length - 1]) + 1) % 32];
  check(fraKodi(badChecksum) === null, `checksum rejection ${i}`);
  const mixed = blanda(dropar);
  check(/^#[0-9a-f]{6}$/.test(mixed.hex) && mixed.rgb.every(v => Number.isInteger(v) && v >= 0 && v <= 255)
    && mixed.hex === blanda(dropar).hex && mixed.hex === blanda(decoded!.dropar).hex
    && JSON.stringify(recipe) === before, `deterministic bounded mixing, no mutation ${i}`);
}
console.log(`OK ${checks} checks`);
