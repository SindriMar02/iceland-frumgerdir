#!/usr/bin/env node
/**
 * route-favicons: every client route in this catalogue shows ITS OWN raster favicon,
 * written into the route's static HTML and kept at runtime, or the build fails.
 *
 * Why (2026-09-26, Sindri: "bjarkalundur has the artix favicon ... that should not ever
 * happen"): this catalogue is a GitHub Pages project site on the same origin as the ARTIX
 * site, and every route shares one index.html. Client icons were SVG data URIs that
 * App.tsx swapped in with JS. Safari ignores SVG favicons, so it showed the catalogue's
 * Iceland-flag PNG or whatever icon it had cached for the origin: ARTIX's helm. 35 more
 * deployed previews had no icon of their own at all. favicon-guard.mjs could not see
 * either problem: it only asks that a page has SOME raster icon, and the catalogue's
 * flag satisfied it on every route.
 *
 *   node tools/route-favicons.mjs render
 *       Local, when a preview is added or its icon changes. Renders each route's PNGs
 *       with headless Chrome into public/favicons/<slug>/ and writes
 *       src/preview/route-icons.json (route -> icon folder), which App.tsx reads.
 *       Source per route: its brand folder (BRAND), else its SVG in favicons.ts, else
 *       its accent + initial from companies.ts. Add --sheet=<png> for a contact sheet.
 *
 *   node tools/route-favicons.mjs stamp dist --base=/iceland-frumgerdir/
 *       In postbuild, after the route shells are copied. Replaces the catalogue icons in
 *       every client route's HTML with that route's own, then fails the build if any
 *       client route lacks its own raster icon, points at another route's icon or a
 *       missing file, shares its icon bytes with another client, or carries ARTIX's.
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
/* --manifest= is for testing the gate against a doctored copy, never for the build */
const MANIFEST = resolve(process.argv.find((a) => a.startsWith('--manifest='))?.slice(11) ?? join(ROOT, 'src/preview/route-icons.json'))
const FILES = ['favicon-32.png', 'favicon-48.png', 'apple-touch-icon.png']

/* Routes that carry a real brand mark of their own (same three file names). */
const BRAND = {
  '/preview/bjarkalundur': 'bjarkalundur/brand',
  '/preview/reynir': 'reynir/brand',
  '/preview/nypugardar': 'nypugardar/brand',
}
/* Deployed previews with no companies.ts entry: name + accent from their own page. */
const EXTRA = {
  '/preview/fjorubordid': { name: 'Fjöruborðið', accent: '#ec3c20' },
  '/preview/svarfholl': { name: 'Svarfhóll', accent: '#6E7051' },
}
/* The first word says what the place is, not which one it is. */
const SKIP_WORDS = /^(hótel|hotel|the|iceland|ljósmyndastúdíó)\s+/i
/* Not a client: the hub, internal tools. These keep the catalogue icon. */
const NOT_CLIENT = new Set(['/admin', '/outreach', '/preview/comparison'])
/* ARTIX's own icon files (apple-touch-icon.png, favicon.svg): never on a client route. */
const ARTIX_SHA256 = new Set([
  'b074d076dc4f51ef2c1465b0b06b317e5a909e0454a8a17186a52d3aab28aa27',
  '7eb875af0ad589eed9083c7fdbf8d9c25c059298cb6a66beb05a561783b3ea0b',
])

const sha = (buf) => createHash('sha256').update(buf).digest('hex')
const slugOf = (route) => route.replace(/^\/(preview\/)?/, '').replace(/\//g, '-')

/** Every route shell the postbuild copies, as written in package.json. */
function builtRoutes() {
  const pb = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).scripts.postbuild
  const m = pb.match(/for r in (.*?); do/)
  if (!m) throw new Error('route-favicons: no "for r in ...; do" route list in postbuild')
  return m[1].trim().split(/\s+/)
}
/** The client a route belongs to: /preview/bofs/studlar -> /preview/bofs, daeli-farm -> /daeli-farm */
function ownerRoute(r) {
  const parts = r.replace(/^\//, '').split('/')
  return '/' + (parts[0] === 'preview' ? parts.slice(0, 2) : parts.slice(0, 1)).join('/')
}
/** Longest manifest key that is the path or a parent of it (App.tsx does the same). */
function iconDirFor(manifest, path) {
  if (manifest[path]) return manifest[path]
  let best = ''
  for (const k of Object.keys(manifest)) if (path.startsWith(k + '/') && k.length > best.length) best = k
  return best ? manifest[best] : null
}

function initialOf(name) {
  const word = name.replace(SKIP_WORDS, '').trim()
  return (word.match(/\p{L}|\p{N}/u)?.[0] ?? '?').toUpperCase()
}
function inkFor(hex) {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? '#1c1c1a' : '#ffffff'
}
/* The catalogue's house style for a client without a mark: accent square, serif initial. */
function accentSvg({ name, accent }) {
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='${accent}'/><text x='16' y='16' fill='${inkFor(accent)}' font-family='Georgia,serif' font-size='18' font-weight='600' text-anchor='middle' dominant-baseline='central'>${initialOf(name)}</text></svg>`
}

async function render() {
  const sheetArg = process.argv.find((a) => a.startsWith('--sheet='))?.slice(8)
  const { createServer } = await import('vite')
  const vite = await createServer({
    root: ROOT, logLevel: 'error', appType: 'custom',
    server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] },
  })
  let companies, svgs
  try {
    companies = (await vite.ssrLoadModule('/src/preview/companies.ts')).PREVIEW_COMPANIES
    svgs = (await vite.ssrLoadModule('/src/preview/favicons.ts')).ROUTE_FAVICONS
  } finally { await vite.close() }
  const byRoute = new Map(companies.map((c) => [c.route, c]))

  const routes = new Set([...Object.keys(svgs), ...Object.keys(BRAND)])
  for (const r of builtRoutes()) if (!NOT_CLIENT.has(ownerRoute(r))) routes.add(ownerRoute(r))

  const manifest = {}
  const jobs = []
  const missing = []
  for (const route of [...routes].sort()) {
    if (BRAND[route]) { manifest[route] = BRAND[route]; continue }
    let svg = svgs[route] ? decodeURIComponent(svgs[route].replace(/^data:image\/svg\+xml,/, '')) : null
    if (!svg) {
      const c = EXTRA[route] ?? byRoute.get(route)
      if (!c?.name || !/^#[0-9a-f]{6}$/i.test(c.accent ?? '')) { missing.push(route); continue }
      svg = accentSvg(c)
    }
    const dir = `favicons/${slugOf(route)}`
    manifest[route] = dir
    const out = join(ROOT, 'public', dir)
    const src = join(out, 'source.svg')
    const fresh = existsSync(src) && readFileSync(src, 'utf8') === svg && FILES.every((f) => existsSync(join(out, f)))
    if (!fresh) jobs.push({ route, svg, out, src })
  }
  if (missing.length) {
    console.error(`route-favicons: no icon source for ${missing.join(', ')}.\n  Give each a companies.ts entry with name + accent, or add it to EXTRA/BRAND here.`)
    process.exit(1)
  }

  if (jobs.length || sheetArg) {
    const require = createRequire(join(ROOT, '..', 'package.json'))
    const puppeteer = require('puppeteer-core')
    const browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
    })
    try {
      const page = await browser.newPage()
      const shot = async (svg, size) => {
        await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 })
        const uri = 'data:image/svg+xml,' + encodeURIComponent(svg)
        await page.setContent(`<html><body style="margin:0;background:transparent"><img id="i" width="${size}" height="${size}" style="display:block" src="${uri}"></body></html>`)
        await page.$eval('#i', (img) => img.decode())
        return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
      }
      for (const j of jobs) {
        mkdirSync(j.out, { recursive: true })
        writeFileSync(join(j.out, 'favicon-32.png'), await shot(j.svg, 32))
        writeFileSync(join(j.out, 'favicon-48.png'), await shot(j.svg, 48))
        /* iOS masks the home-screen icon itself; transparent corners would turn black */
        writeFileSync(join(j.out, 'apple-touch-icon.png'), await shot(j.svg.replace(/ rx='[\d.]+'/, ''), 180))
        writeFileSync(j.src, j.svg)
        console.log(`  rendered ${j.route}`)
      }
      if (sheetArg) {
        const cells = Object.entries(manifest).map(([r, d]) => {
          const b64 = readFileSync(join(ROOT, 'public', d, 'favicon-48.png')).toString('base64')
          return `<div><img src="data:image/png;base64,${b64}"><span>${r.replace('/preview/', '')}</span></div>`
        }).join('')
        await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 })
        await page.setContent(`<style>body{margin:12px;font:11px system-ui;display:grid;grid-template-columns:repeat(8,1fr);gap:8px}
          div{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px;background:#dedede}
          div:nth-child(odd){background:#2b2b2b;color:#ddd}</style>${cells}`)
        await page.screenshot({ path: sheetArg, fullPage: true })
        console.log(`  sheet ${sheetArg}`)
      }
    } finally { await browser.close() }
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)))
  writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + '\n')
  console.log(`route-favicons: ${Object.keys(sorted).length} routes, ${jobs.length} rendered, manifest written`)
}

function stamp() {
  const dist = resolve(process.argv[3] ?? 'dist')
  const baseArg = process.argv.find((a) => a.startsWith('--base='))?.slice(7) ?? '/'
  const base = '/' + baseArg.replace(/^\/+|\/+$/g, '') + (baseArg.replace(/\//g, '') ? '/' : '')
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
  const problems = []
  const bytesOwner = new Map()
  let stamped = 0

  /* each client's own files: present, real PNGs, not ARTIX's, not another client's */
  for (const [route, dir] of Object.entries(manifest)) {
    /* a route's icons live in its own folder: a manifest entry pointing elsewhere is another client's */
    const expected = BRAND[route] ?? `favicons/${slugOf(route)}`
    if (dir !== expected) problems.push(`${route}: icon folder ${dir} is not its own (${expected})`)
    for (const f of FILES) {
      const p = join(dist, dir, f)
      if (!existsSync(p)) { problems.push(`${route}: ${dir}/${f} missing from the build`); continue }
      const buf = readFileSync(p)
      if (buf.length < 70 || buf.readUInt32BE(0) !== 0x89504e47) problems.push(`${route}: ${dir}/${f} is not a usable PNG`)
      const h = sha(buf)
      if (ARTIX_SHA256.has(h)) problems.push(`${route}: ${dir}/${f} is ARTIX's icon`)
      if (f === 'favicon-48.png') {
        const other = bytesOwner.get(h)
        if (other && other !== dir) problems.push(`${route}: ${dir}/${f} is byte-identical to ${other}/${f}`)
        bytesOwner.set(h, dir)
      }
    }
  }

  for (const r of builtRoutes()) {
    const owner = ownerRoute(r)
    if (NOT_CLIENT.has(owner) || NOT_CLIENT.has('/' + r)) continue
    const file = join(dist, r, 'index.html')
    if (!existsSync(file)) { problems.push(`/${r}: no index.html in the build`); continue }
    const dir = iconDirFor(manifest, '/' + r)
    if (!dir) { problems.push(`/${r}: no icon of its own (run: node tools/route-favicons.mjs render)`); continue }
    const own = [
      `<link rel="icon" href="${base}${dir}/favicon-32.png" type="image/png" sizes="32x32">`,
      `<link rel="icon" href="${base}${dir}/favicon-48.png" type="image/png" sizes="48x48">`,
      `<link rel="apple-touch-icon" href="${base}${dir}/apple-touch-icon.png">`,
    ].join('\n    ')
    let html = readFileSync(file, 'utf8')
      .replace(/[ \t]*<link[^>]+rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>\n?/g, '')
    if (!html.includes('</head>')) { problems.push(`/${r}: no </head>`); continue }
    html = html.replace('</head>', `    ${own}\n  </head>`)
    writeFileSync(file, html)
    stamped++

    /* read back what ships: only this route's own icons, every one resolving */
    const links = [...html.matchAll(/<link[^>]+rel=["']([^"']*icon[^"']*)["'][^>]*>/g)]
    const hrefs = links.map((l) => l[0].match(/href=["']([^"']+)["']/)?.[1] ?? '')
    if (!links.some((l) => l[1] === 'icon' && /\.png$/.test(l[0].match(/href=["']([^"']+)/)?.[1] ?? ''))) problems.push(`/${r}: no raster rel="icon"`)
    for (const h of hrefs) {
      if (!h.startsWith(`${base}${dir}/`)) problems.push(`/${r}: icon ${h} is not this route's own (${dir})`)
      else if (!existsSync(join(dist, h.slice(base.length)))) problems.push(`/${r}: icon ${h} does not exist in the build`)
    }
  }

  if (!stamped) problems.push('stamped zero pages: a gate that checks nothing is not a pass')
  if (problems.length) {
    console.error(`route-favicons: FAILED\n  ${problems.join('\n  ')}`)
    process.exit(1)
  }
  console.log(`route-favicons: ${stamped} client pages carry their own raster icon (${Object.keys(manifest).length} icon sets)`)
}

const mode = process.argv[2]
if (mode === 'render') await render()
else if (mode === 'stamp') stamp()
else {
  console.error('usage: route-favicons.mjs render [--sheet=out.png] | stamp <dist> [--base=/x/]')
  process.exit(2)
}
