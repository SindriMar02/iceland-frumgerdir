// Iceland Luxury Lodges: responsive picture set (round 8, 23 Oct 2026).
// node src/preview/icelandluxurylodges/encode-images.mjs [name ...]
// For each public/icelandluxurylodges/<name>.jpg writes r/<name>-<w>.{avif,webp}
// at 800/1200/1800/2400 (a width above the source is written at the source's
// own width, never upscaled here). AVIF q72 / WebP q86 up to 1200; q58 / q78 at
// 1800-2400, where the pixel density hides it (round 13, load speed).
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
const DIR = path.resolve('public/icelandluxurylodges'), OUT = path.join(DIR, 'r'), TMP = fs.mkdtempSync('/tmp/ill-enc-')
const WIDTHS = [800, 1200, 1800, 2400]
const names = process.argv.slice(2).length ? process.argv.slice(2)
  : fs.readdirSync(DIR).filter((f) => f.endsWith('.jpg')).map((f) => f.slice(0, -4))
const dims = (f) => execFileSync('sips', ['-g', 'pixelWidth', f]).toString().match(/pixelWidth: (\d+)/)[1] * 1
for (const n of names) {
  const src = path.join(DIR, `${n}.jpg`), sw = dims(src)
  for (const w of WIDTHS) {
    const tw = Math.min(w, sw), png = path.join(TMP, `${n}-${w}.png`)
    execFileSync('sips', ['-s', 'format', 'png', '--resampleWidth', String(tw), src, '--out', png], { stdio: 'ignore' })
    /* round 13: the two big widths are what retina screens and phones fetch for the hero and the
       doors; at 1800/2400 px a lower quality is invisible and saves ~40% (they were 700 KB each) */
    const big = w >= 1800
    execFileSync('cwebp', ['-quiet', '-q', big ? '78' : '86', '-m', '6', '-sharp_yuv', png, '-o', path.join(OUT, `${n}-${w}.webp`)])
    execFileSync('avifenc', ['-q', big ? '58' : '72', '-s', '6', '--jobs', '4', png, path.join(OUT, `${n}-${w}.avif`)], { stdio: 'ignore' })
  }
  console.log(n, sw)
}
fs.rmSync(TMP, { recursive: true, force: true })
