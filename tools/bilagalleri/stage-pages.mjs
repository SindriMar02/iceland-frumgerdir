// Install the standalone experience alongside the shared outreach previews.
// Run after both the shared build and the Bílagallerí standalone build.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import assert from 'node:assert/strict'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const output = resolve(root, process.argv[2] || 'dist')
assert(['dist', 'dist-bilagalleri-pages-check'].some(name => output === join(root, name)), 'Unexpected output directory')
const source = join(root, 'dist-bilagalleri')
assert(existsSync(join(source, 'index.html')), 'Build Bílagallerí before staging Pages')
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
assert(/^[a-f0-9]{40}$/.test(sha))
const destination = join(output, 'preview/bilagalleri')
mkdirSync(destination, { recursive: true })
cpSync(source, destination, { recursive: true })

// Keep the 67 primary images local and all secondary pictures at their original
// resolution. Immutable URLs in this PUBLIC repo avoid duplicating 86 MiB in an
// already crowded shared Pages artifact; no external image service is required.
const cars = JSON.parse(readFileSync(join(destination, 'inventory.json'), 'utf8'))
const primary = new Set(cars.map(car => car.photos[0]))
let remoteCount = 0
for (const car of cars) {
  car.photos = car.photos.map(photo => {
    if (!photo.startsWith('./') || primary.has(photo)) return photo
    assert(/^\.\/[0-9]+-[0-9]+\.webp$/.test(photo), 'Unexpected photo path')
    assert(existsSync(join(root, 'public/bilagalleri', photo)))
    remoteCount++
    return `https://raw.githubusercontent.com/SindriMar02/iceland-frumgerdir/${sha}/public/bilagalleri/${photo.slice(2)}`
  })
}
writeFileSync(join(destination, 'inventory.json'), JSON.stringify(cars))
for (const file of readdirSync(destination)) {
  if (/^[0-9]+-[0-9]+\.webp$/.test(file) && !primary.has(`./${file}`)) rmSync(join(destination, file))
}
// Vite's shared public copy is redundant; only this project's generated copy
// is removed. Existing previews, their assets and source files are untouched.
rmSync(join(output, 'bilagalleri'), { recursive: true, force: true })
writeFileSync(join(destination, 'build.json'), JSON.stringify({ commit: sha, route: '/preview/bilagalleri/', vehicles: cars.length }))
if (output.endsWith('dist-bilagalleri-pages-check')) writeFileSync(join(output, '.gitignore'), '*\n')

assert.equal(cars.length, 67)
const html = readFileSync(join(destination, 'index.html'), 'utf8')
assert(html.includes('noindex,nofollow'), 'Outreach previews must remain noindex')
for (const [, asset] of html.matchAll(/(?:src|href)="(\.\/[^"?#]+)"/g)) assert(existsSync(join(destination, asset)), `Missing built asset ${asset}`)
for (const photo of primary) assert(existsSync(join(destination, photo)), `Missing primary image ${photo}`)
console.log(`Bílagallerí staged: ${cars.length} vehicles, ${primary.size} primary images, ${remoteCount} secondary images pinned to ${sha.slice(0, 8)}.`)
