/**
 * Nýpugarðar — photo harvest and resize.
 *
 * WHAT THIS FIXES. The first harvest (2026-08-21) scraped 47 files straight off
 * the rendered Booking.com page. Two problems came out of that on 2026-08-25:
 *
 *   1. FOUR OF THE 47 WERE NOT HERS. Booking renders a "similar properties"
 *      carousel on the same page, and the scrape swallowed it. One of the four
 *      (908946914, an aerial of a large blue-roofed farm complex next to a
 *      church) was being used as the SITE'S HERO IMAGE. Another (591821923) is
 *      literally Hótel Jökull at Nesjum, sign and all; 614398038 is that same
 *      property's coastline; 92332508 is its main block mid-renovation, hi-vis
 *      workman and skip included. All four are deleted and can never come back,
 *      because this file now harvests from booking.env.hotelPhotos — the
 *      property's own photo array — instead of from whatever <img> tags the
 *      page happened to render.
 *
 *   2. EVERY FILE WAS DOWNSCALED. The scrape took Booking's max1920x1080
 *      endpoint, which caps a 3024×4032 phone photo at 810×1080. The originals
 *      are 8–16 MP. Booking also serves /max3000/, which returns 2250×3000 for
 *      the same file — 7.7× the pixels. There is no /original/ (404). So the
 *      masters below are max3000, resized locally to the widths the page
 *      actually renders.
 *
 * THE ROOM MAPPING IS NOT GUESSWORK. booking.env.hotelPhotos carries an
 * `associated_rooms` array per photo, which is the mapping Bogga herself made
 * in the Booking extranet. Her Booking room types line up 1:1 with her seven
 * Godo room types, confirmed on bed counts (Booking "Family Room" = 4 singles
 * ×4 = Godo "Family Cottage"; Booking "Standard Bungalow" = 2 singles + sofa
 * bed = Godo "Cottage, 3 persons"). Two photos are associated with two room
 * types each, which is correct: 510523749 is the bathroom the two
 * shared-bathroom types share, and 510529210 is an exterior with both cottages
 * in frame.
 *
 * Usage:  node tools/nypugardar-photos.mjs [--force]
 * Output: public/nypugardar/photos/<id>-<width>.jpg
 *
 * Requires `sips` (macOS, built in). Outputs are committed; this only needs
 * re-running when she adds or replaces photos on Booking.
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/nypugardar/photos')
const TMP = resolve(ROOT, 'node_modules/.cache/nypugardar-photos')
const FORCE = process.argv.includes('--force')

/**
 * Every photograph on her Booking.com listing, 43 of them, read out of
 * booking.env.hotelPhotos on 2026-08-25.
 *
 *   id    Booking photo id, also the filename stem
 *   k     Booking's per-photo signature; the CDN 403s without it
 *   room  her Godo room key(s), from Booking's associated_rooms
 *   cat   what the frame shows (see photos.ts for how each cat is placed)
 *   w/h   the ORIGINAL pixel size she uploaded, for reference
 *   wide  true = the page can render it edge to edge, so it gets big widths
 */
const PHOTOS = [
  // ── The land. Her own view, no buildings. Oldest files, smallest sensors.
  { id: '125645004', k: 'e1ae078146d5fb65eb3a2342dd86db7d64ab7d39314f14f52b17550eaffe1429', cat: 'land', w: 5312, h: 2988, wide: true, hero: true },
  { id: '125645011', k: 'e9cffcc379fe94d02b69ea1eebad7060531f916b962f6230a17e3ceda3a85593', cat: 'land', w: 3648, h: 2736, wide: true },
  { id: '125645015', k: '7031ebef1f659cf568ae450753b5730dbbaef2322225a6e4bcd2921fc4e8cc8e', cat: 'land', w: 3648, h: 2736, wide: true },
  { id: '125645022', k: 'c25b572a018662e4e368fef6941ec0d05ebc2d562eac4e3534b08ac58024d41e', cat: 'land', w: 3648, h: 2440, wide: true },
  { id: '125644995', k: 'ec530983ee764abda8cc6b68583a24b6b58cd84f81fdd309b9424414c93b673f', cat: 'land', w: 3648, h: 2736, wide: true },
  { id: '10523812',  k: '5b1bfe08b7ae32505338726b2936a8de54d30b86eed66de2b51e4e99cf61082a', cat: 'land', w: 960,  h: 720,  wide: true },
  { id: '10523758',  k: 'b2e0ecfa45969c3ec61dbfe2e7e25d64c80bcfc2b4276c67476d7b9a1acbbc4f', cat: 'land', w: 960,  h: 720 },
  { id: '10523864',  k: '2e21596f72fdae8178942f8e63817dfaa86ab9c4c383b883323636aad39aa600', cat: 'land', w: 960,  h: 720 },

  // ── The house itself.
  { id: '258957593', k: 'f7d6e7abf51c04679ab9d1024686d4431631dc0c8372a3b452eab7208b455f52', cat: 'house', w: 2500, h: 1667, wide: true, credit: 'wiebke-schellers' },
  { id: '510526816', k: '103ddb095b1442e83a2b63234d9afe3c71aadd98689c6f8203ecb054552d85da', cat: 'house', w: 3024, h: 4032 },

  // ── Where everyone eats.
  { id: '305950064', k: '8a3e32272d703383c1b42e8f4bc2ab3cfcab10689b32597c236815e67cf1b83d', cat: 'table', w: 3264, h: 1472, wide: true },
  { id: '259128011', k: '9af66adb759fae2c572570bdeecfaf7edad304e7e356d986b67b07400c15bd43', cat: 'table', w: 2500, h: 1667, wide: true },

  // ── Small twin, shared bathroom  (Godo 477163 · Booking 41994909)
  { id: '539099044', k: 'b28510f40cffdadf4e0dd5910fb1b2951f62b70412ab0b37ab9ec676ae1e41fa', cat: 'room', room: ['twinSharedEconomy'], w: 4032, h: 3024 },
  { id: '539099047', k: '972a350157726044df3f622985f9280de680ae923c0594b04a3e49fb3172d1c7', cat: 'room', room: ['twinSharedEconomy'], w: 4032, h: 3024 },
  { id: '539099049', k: 'a7442de9ca3f6c47b33ff0fb5b732352aa08ee81d6171e56cb44dbdc9e2730b3', cat: 'room', room: ['twinSharedEconomy'], w: 4032, h: 3024 },

  // ── Double/twin, shared bathroom  (Godo 145056 · Booking 41994901)
  { id: '510521394', k: 'a021e3e74e11ab77886478bfb05f2ac31140c81895908924c721f73c31116b0d', cat: 'room', room: ['doubleTwinShared'], w: 3024, h: 4032 },
  { id: '510521438', k: '9f2d5a381520d6313ff2de574c4b33dbb31b2d09c62887e3b8d08e7704c415b2', cat: 'room', room: ['doubleTwinShared'], w: 3024, h: 4032 },
  { id: '510523433', k: '16f1447d65ab6d13ca8cc628a7904183ad4c7bd67b086b452e7c3b33485458ab', cat: 'room', room: ['doubleTwinShared'], w: 3024, h: 4032 },
  { id: '510523430', k: '4e969b20856fcc9c774b688a3a3badca0a370ff8de487ff72fc34b58ce41ea3d', cat: 'room', room: ['doubleTwinShared'], w: 3024, h: 4032 },
  /* The bathroom the two shared-bathroom types share — Booking associates it
   * with both, so the site must not present it as private to either. */
  { id: '510523749', k: 'f011f17f7ee0dfac0ddf722b97ac03937465e095a82e0584d874539c34c673c2', cat: 'bath', room: ['doubleTwinShared', 'twinSharedEconomy'], w: 3024, h: 4032, shared: true },

  // ── Double/twin, private bathroom  (Godo 145057 · Booking 41994903)
  { id: '510523878', k: 'abdc3969f71017d5ca48af128c8177b77ee9f2cfc999c8c11780a1e514a5ab39', cat: 'room', room: ['doubleTwinPrivate'], w: 3024, h: 4032 },
  { id: '510523877', k: 'a24f75d0313bf569cac0300e4a5192e816fe99608c56415e031e4f0577f49b7d', cat: 'room', room: ['doubleTwinPrivate'], w: 3024, h: 4032 },
  { id: '510523966', k: 'df08dd817f258b061ffdc53e1218e86bc2e217d2b741e8956af229e621e60c04', cat: 'room', room: ['doubleTwinPrivate'], w: 3024, h: 4032 },
  { id: '510523968', k: '52d8d1ce88ecf62336be36a2dc2670716fb305b653ea41de78b247f770aa17f5', cat: 'bath', room: ['doubleTwinPrivate'], w: 3024, h: 4032 },

  // ── Double/twin with an extra bed  (Godo 145058 · Booking 41994904)
  { id: '510524066', k: '720f81d8ff7ec905d2d3eb30179c56c0468e17ba242afb042a5ad18c8eea9c5d', cat: 'room', room: ['doublePrivateExtraBed'], w: 3024, h: 4032 },
  { id: '510524029', k: '65df4b44b95732f132a42064b1873efaef9e4bb02794fbcbfa1ebb609b825f5c', cat: 'room', room: ['doublePrivateExtraBed'], w: 3024, h: 4032 },
  { id: '510524067', k: '5df8397e2aef9edde49d4c29eb9bd563556129506e9caf32ea6f765eb3b78338', cat: 'room', room: ['doublePrivateExtraBed'], w: 3024, h: 4032 },
  { id: '510524064', k: 'ae327400206cba113cd938b5b6b273d635f7d9ce59a59d4053aa0dacc1adcc60', cat: 'room', room: ['doublePrivateExtraBed'], w: 3024, h: 4032 },
  { id: '510524063', k: 'd2b696626a6397e9d9538ef97aff2e8f5753990eb61d6e591d211d587735c203', cat: 'bath', room: ['doublePrivateExtraBed'], w: 3024, h: 4032 },
  { id: '510524065', k: '71e70cab4b0690541a73eeae9d733c1aa3f975067b108ccaf63790f6eb210db7', cat: 'bath', room: ['doublePrivateExtraBed'], w: 3024, h: 4032 },

  // ── Double  (Godo 259673 · Booking 41994907)
  { id: '510523622', k: '6f9fd7dd2f48546b99bb14352bd315f4295d8379526f19d1a0d79a7aaac16843', cat: 'room', room: ['double'], w: 3024, h: 4032 },
  { id: '510523625', k: 'ef35f06351996036df957033097a14e59047219f2a1963273bfe760cc4123c97', cat: 'bath', room: ['double'], w: 3024, h: 4032 },

  // ── Cottage for three  (Godo 145059 · Booking 41994908 "Standard Bungalow")
  { id: '510526820', k: '08fd4f5c49c45283e285b4809c86e86be6bb4143e9fe5d6cd0ae0f2011a00283', cat: 'cottageIn', room: ['cottage3'], w: 3024, h: 4032 },
  { id: '510524300', k: '763118073025f22d72a8fa1bbfe50f2c7d75fabc8fe3bfde388402b08e946d21', cat: 'cottageIn', room: ['cottage3'], w: 3024, h: 4032 },
  { id: '510524299', k: '486c814476690046d75ec175385aa92c0ac9f04c6eb2c192da0644c9e2546eff', cat: 'bath',      room: ['cottage3'], w: 3024, h: 4032 },
  { id: '510524306', k: '3a1be9ec04c9ab3709bde7802652283692f36507bb0841d4169fc321e90bc55b', cat: 'cottageOut', room: ['cottage3'], w: 3024, h: 4032 },
  { id: '510524307', k: 'b425f03d085e0bc1ba45be813b7a629cd20c5b65724ea5d74151b8fee0e3c7ae', cat: 'cottageOut', room: ['cottage3'], w: 3024, h: 4032 },

  // ── Family cottage  (Godo 182212 · Booking 41994905 "Family Room", 4 beds)
  { id: '510524188', k: 'bebb6072787421b782729d05a8ad9d04d23c137f95b306f54322f47f561af800', cat: 'cottageIn', room: ['familyCottage'], w: 3024, h: 4032 },
  { id: '510524194', k: 'cb083da88ba4981575eb84a9905f2f5dc075d7d4c4776d5850b160b91f2415e8', cat: 'cottageIn', room: ['familyCottage'], w: 3024, h: 4032 },
  { id: '510524196', k: 'e47477aea100bda92707e9dd180ed84c39c0a05c34d4375372ce78b92a3eb04b', cat: 'cottageIn', room: ['familyCottage'], w: 3024, h: 4032 },
  { id: '510524189', k: '004e2c3378078de3ad654520699d0933f92d61827df8a153b965693bca7b3729', cat: 'bath',      room: ['familyCottage'], w: 3024, h: 4032 },
  { id: '510524232', k: 'f431b6289b8bc792d2d276fb955d7fdf0063bdb836eb7c189b3aa76567abfbb0', cat: 'cottageOut', room: ['familyCottage'], w: 3024, h: 4032 },
  /* Both cottages in one frame, so Booking associates it with both types. */
  { id: '510529210', k: 'dca7f61615da522a08fce59905c796e4e4405e2a48633a2c7d6f0bda6e875f29', cat: 'cottageOut', room: ['familyCottage', 'cottage3'], w: 3024, h: 4032 },
]

/**
 * Rendered widths. A tile is at most ~420 CSS px in the 6xl grid, so 900w
 * covers it on a 2× screen with room to spare; 480w serves phones. Only frames
 * the page can run edge to edge need more, and 2000w is the honest ceiling —
 * above that most of these files are being enlarged, not sharpened.
 */
const TILE = [480, 900]
const WIDE = [480, 1100, 2000]
const HERO = [640, 1280, 2000, 2600]

const widthsFor = (p) => (p.hero ? HERO : p.wide ? WIDE : TILE)

const url = (id, k) => `https://cf.bstatic.com/xdata/images/hotel/max3000/${id}.jpg?k=${k}&o=&hp=1`

async function master(p) {
  const file = resolve(TMP, `${p.id}.jpg`)
  if (existsSync(file) && statSync(file).size > 10_000 && !FORCE) return file
  const res = await fetch(url(p.id, p.k))
  if (!res.ok) throw new Error(`${p.id}: HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 10_000) throw new Error(`${p.id}: ${buf.length} bytes, refusing`)
  writeFileSync(file, buf)
  return file
}

function derive(src, id, width) {
  const out = resolve(OUT, `${id}-${width}.jpg`)
  execFileSync('sips', [
    '--resampleWidth', String(width),
    '-s', 'format', 'jpeg',
    '-s', 'formatOptions', '68',
    src, '--out', out,
  ], { stdio: 'ignore' })
  return out
}

async function main() {
  mkdirSync(TMP, { recursive: true })
  mkdirSync(OUT, { recursive: true })

  /* Anything already in the folder that this manifest does not name is stale —
   * that is how the four foreign photos leave and stay gone. */
  const wanted = new Set(PHOTOS.flatMap((p) => widthsFor(p).map((w) => `${p.id}-${w}.jpg`)))
  for (const f of readdirSync(OUT)) {
    if (!wanted.has(f)) {
      unlinkSync(resolve(OUT, f))
      console.log(`  removed stale ${f}`)
    }
  }

  let bytes = 0
  for (const p of PHOTOS) {
    const src = await master(p)
    const sizes = widthsFor(p).map((w) => {
      const f = derive(src, p.id, w)
      const n = statSync(f).size
      bytes += n
      return `${w}w:${Math.round(n / 1024)}k`
    })
    console.log(`  ${p.id.padEnd(10)} ${p.cat.padEnd(11)} ${sizes.join('  ')}`)
  }
  console.log(`\n[nypugardar-photos] ${PHOTOS.length} photos, ${(bytes / 1048576).toFixed(1)} MB in ${OUT}`)
}

main().catch((e) => {
  console.error('[nypugardar-photos]', e.message || e)
  process.exit(1)
})
