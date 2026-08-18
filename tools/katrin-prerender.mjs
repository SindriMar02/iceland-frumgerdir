/**
 * Katrín Ísfeld — prerender every route to static HTML.
 *
 * WHY, IN ONE SENTENCE: an empty <div id="root"></div> is what most AI
 * crawlers, and every link-preview scraper, actually receive from a React SPA.
 *
 * Google renders JavaScript and would eventually have indexed the old build.
 * Almost nothing else does. Facebook, Messenger, LinkedIn, Slack and the
 * answer engines read the raw HTML, and the raw HTML of the previous build
 * was the catalogue's shell: 793 characters of unrelated boilerplate, no
 * headings, no photographs, no business. Prerendering is also, incidentally,
 * the largest single speed win available here, because the page paints
 * completely before a byte of application JavaScript has been parsed.
 *
 * WHAT GETS STRIPPED, AND WHY IT MATTERS
 * The motion engine marks the root .ki-js and each revealed element .is-in.
 * If those classes were captured in the snapshot, every element below the
 * fold would ship already-revealed and the scroll animations would never
 * play; capture them too early and the opposite happens, elements ship at
 * opacity 0 and a visitor without JavaScript sees a blank page. So the
 * snapshot is taken after React has rendered and before anything is revealed,
 * and both classes are removed: the static HTML is the resting state, fully
 * visible, which is exactly what a crawler and a no-JS visitor should get.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { createServer } from 'node:http'
import { extname } from 'node:path'
import puppeteer from 'puppeteer-core'
import { build } from 'esbuild'

const dist = process.argv[2] || 'dist-katrin'
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

/* the route list comes from the same module the app routes from */
const tmp = join(process.cwd(), 'node_modules', '.katrin-routes.mjs')
await build({
  entryPoints: ['src/preview/katrinisfeld/paths.ts'],
  bundle: true, format: 'esm', platform: 'node', outfile: tmp, logLevel: 'silent',
  define: { 'import.meta.env.BASE_URL': '"/"', 'import.meta.env.VITE_KATRIN_STANDALONE': '"1"' },
})
const { ROUTES } = await import(tmp + '?t=' + process.hrtime.bigint())

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
}

/** The untouched build shell, held before a single route is written. */
const SHELL = readFileSync(join(dist, 'index.html'))

const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0])
  const file = join(dist, url)
  if (!extname(file) || !existsSync(file)) {
    res.writeHead(200, { 'Content-Type': MIME['.html'] })
    return res.end(SHELL)
  }
  try {
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
    res.end(readFileSync(file))
  } catch {
    res.writeHead(404).end('nope')
  }
})
await new Promise((r) => server.listen(0, r))
const port = server.address().port

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--font-render-hinting=none'],
})

let failures = 0
const captured = []
for (const route of ROUTES) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(`http://localhost:${port}${route.clean}`, { waitUntil: 'networkidle0', timeout: 60000 })
  // React has mounted when the design root and its single h1 both exist
  await page.waitForFunction(() => !!document.querySelector('.ki-root h1'), { timeout: 20000 })
    .catch(() => { errors.push('never rendered an h1') })

  const html = await page.evaluate(() => {
    const root = document.querySelector('.ki-root')
    // resting state: visible without JavaScript, un-animated, unthemed
    root?.classList.remove('ki-js', 'ki-static')
    document.querySelectorAll('.is-in').forEach((el) => el.classList.remove('is-in'))
    document.querySelectorAll('[data-ki-on]').forEach((el) => el.removeAttribute('data-ki-on'))
    document.querySelectorAll('[data-ki-par], [data-ki-par] > span').forEach((el) => { el.style.transform = '' })
    document.querySelectorAll('[style=""]').forEach((el) => el.removeAttribute('style'))

    // React's own separator between adjacent text nodes, so hydration finds
    // the same node boundaries the client render built
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
    const targets = []
    for (let el = walk.currentNode; el; el = walk.nextNode()) {
      const kids = el.childNodes
      for (let i = 1; i < kids.length; i++) {
        if (kids[i].nodeType === 3 && kids[i - 1].nodeType === 3) targets.push(kids[i])
      }
    }
    targets.forEach((n) => n.parentNode.insertBefore(document.createComment(''), n))

    return '<!doctype html>\n' + document.documentElement.outerHTML
  })

  const text = await page.evaluate(() => (document.querySelector('main')?.innerText || '').trim().length)
  captured.push({ route, html, text })
  const bad = errors.length > 0 || text < 400
  if (bad) failures++
  console.log(`  ${bad ? '✗' : '·'} ${route.clean.padEnd(40)} ${String(text).padStart(5)} chars of text${errors.length ? '  ' + errors.join(' | ') : ''}`)
  await page.close()
}

await browser.close()
server.close()

/* every route captured against the same pristine shell; now they can land */
for (const { route, html } of captured) {
  const out = join(dist, route.clean === '/' ? '' : route.clean.slice(1), 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}

/* a 404 that renders the site rather than the host's default page */
writeFileSync(join(dist, '404.html'), readFileSync(join(dist, 'index.html')))

if (failures) {
  console.error(`katrin-prerender: ${failures} route(s) rendered badly — refusing to ship a blank page`)
  process.exit(1)
}
console.log(`katrin-prerender: ${ROUTES.length} routes prerendered`)
