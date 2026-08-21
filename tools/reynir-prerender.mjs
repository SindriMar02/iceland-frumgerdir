/**
 * Prerender every Reynir route to real HTML.
 *
 * WHY THIS EXISTS. Until this step the client build shipped an index.html whose
 * body held exactly one thing: <div id="root"></div>. A browser fills that in
 * instantly, so nothing looked wrong. But the crawlers that increasingly decide
 * whether a small bakery gets found do not run JavaScript — GPTBot,
 * OAI-SearchBot, PerplexityBot and ClaudeBot fetch the HTML and stop. To every
 * one of them the site was a blank page, and Google, which does render, only
 * did so on a deferred second pass with the menu and prices arriving from
 * Sanity at runtime.
 *
 * So the body is rendered at build time and the browser hydrates it. Same
 * markup, same code splitting, same CMS behaviour at runtime — the only
 * difference is that the words now exist before JavaScript does.
 *
 * Runs from tools/reynir-standalone-post.mjs, after the client build (which
 * produces the shell) and the SSR build (which produces the renderer), and
 * BEFORE reynir-seo.mjs, which injects each route's own head into the files
 * written here.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = 'dist-reynir'
const serverEntry = resolve('dist-reynir-server/reynir-entry-server.js')

if (!existsSync(serverEntry)) {
  console.error(
    'reynir-prerender: dist-reynir-server/reynir-entry-server.js missing.\n' +
      '  Run the SSR build first:\n' +
      '  vite build --config vite.reynir.config.ts --ssr src/reynir-entry-server.tsx --outDir dist-reynir-server',
  )
  process.exit(1)
}

const { render, PRERENDER_ROUTES, setPrerenderRaw, QUERY } = await import(pathToFileURL(serverEntry).href)

/* ── bake the CMS into the HTML ────────────────────────────────────────────
 * Without this the prerendered pages carry the bundled fallback, because
 * effects do not run during a server render. The owner would edit a price,
 * watch it change in his own browser, and every crawler would go on reading
 * the old one. So the content is fetched here, rendered from, and written
 * into the page for the browser to hydrate from.
 *
 * A failure is a WARNING, not an error: shipping the bundled content is the
 * old behaviour and still a working site. Shipping nothing is not. */
const PROJECT = 'v4v3s4wg'
const DATASET = 'production'
let cmsRaw = null
try {
  const url =
    `https://${PROJECT}.api.sanity.io/v2025-08-15/data/query/${DATASET}` +
    `?query=${encodeURIComponent(QUERY)}&returnQuery=false&perspective=published`
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  cmsRaw = (await res.json()).result ?? null
  const counts = Object.entries(cmsRaw || {})
    .map(([k, v]) => `${k} ${Array.isArray(v) ? v.length : v ? 'ok' : 'MISSING'}`)
    .join(', ')
  console.log(`reynir-prerender: CMS fetched — ${counts}`)
} catch (err) {
  console.warn(
    `reynir-prerender: WARNING — CMS fetch failed (${err.message}).\n` +
      '  The pages will be built from the bundled content, which is a working\n' +
      '  site but will not reflect anything the owner has edited since the last\n' +
      '  successful build. Re-run the build once the CMS is reachable.',
  )
}
setPrerenderRaw(cmsRaw)

/* Escaped so the payload cannot terminate the script element or break the
   HTML parser; the ampersand matters because this sits in a data island. */
const cmsScript = cmsRaw
  ? `<script id="__reynir_cms" type="application/json">${JSON.stringify(cmsRaw)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')}</script>`
  : ''


const shell = readFileSync(join(dist, 'index.html'), 'utf8')
if (!shell.includes('<div id="root"></div>')) {
  console.error('reynir-prerender: shell has no empty <div id="root"></div> to fill — did the build change?')
  process.exit(1)
}

/* A route that renders almost nothing is the failure this whole step exists to
 * prevent, and it fails silently by nature: the page still works in a browser.
 * So it fails the BUILD instead. 2000 chars is far below any real Reynir page
 * and far above an empty shell. */
const MIN_MARKUP = 2000

let total = 0
for (const route of PRERENDER_ROUTES) {
  const body = await render(route)

  if (body.length < MIN_MARKUP) {
    console.error(
      `reynir-prerender: ${route} produced only ${body.length} chars of markup ` +
        `(expected at least ${MIN_MARKUP}).\n` +
        '  An empty body is what the AI crawlers would see. Refusing to ship it.',
    )
    process.exit(1)
  }

  /* React escapes text children, INCLUDING the contents of a <style> tag. A
   * component that writes <style>{CSS}</style> therefore prerenders its CSS as
   * content:&#x27;&#x27; — valid HTML, broken stylesheet, and invisible in a
   * browser because the failed hydration quietly rebuilt the page client-side.
   * The fix is dangerouslySetInnerHTML on every <style>; this gate is what
   * stops the next component from reintroducing the bug. */
  const escapedInStyle = [...body.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
    .reduce((n, m) => n + (m[1].match(/&#x27;|&quot;|&amp;/g) || []).length, 0)
  if (escapedInStyle > 0) {
    console.error(
      `reynir-prerender: ${route} has ${escapedInStyle} HTML-escaped character(s) inside a <style> block.\n` +
        '  That CSS is corrupt. Render style tags with' +
        ' <style dangerouslySetInnerHTML={{ __html: CSS }} />, not <style>{CSS}</style>.',
    )
    process.exit(1)
  }

  const html = shell.replace('<div id="root"></div>', `<div id="root">${body}</div>${cmsScript}`)

  const dir = route === '/' ? dist : join(dist, route.replace(/^\//, ''))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)

  total += body.length
  console.log(`  ${route.padEnd(16)} ${String(body.length).padStart(7)} chars of markup`)
}

console.log(`reynir-prerender: ${PRERENDER_ROUTES.length} routes prerendered, ${total.toLocaleString('en-US')} chars total`)
