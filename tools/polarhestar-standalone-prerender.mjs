/**
 * Prerender every Pólar Hestar route, in every language, to real HTML.
 *
 * WHY THIS EXISTS. Without this step the client build ships an index.html
 * whose body holds exactly one thing: <div id="root"></div>. A browser fills
 * that in instantly, so nothing looks wrong. But the crawlers that decide
 * whether a riding farm gets found do not run JavaScript: GPTBot,
 * OAI-SearchBot, PerplexityBot and ClaudeBot fetch the HTML and stop, and
 * Google only renders on a deferred second pass. To every one of them the
 * 24 Oct audit found the same 15.6 KB shell with 17 words on every URL.
 *
 * So the body is rendered at build time and the browser hydrates it. Same
 * markup, same code splitting; the only difference is that the words exist
 * before JavaScript does. 11 pages x 3 languages, each at its own address.
 *
 * Runs from tools/polarhestar-standalone-post.mjs, after the client build
 * (the shell) and the SSR build (the renderer), and BEFORE the SEO injector,
 * which writes each route's own <head> into the files written here.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = 'dist-polarhestar'
const serverEntry = resolve('dist-polarhestar-server/polarhestar-entry-server.js')

if (!existsSync(serverEntry)) {
  console.error(
    'polarhestar-prerender: dist-polarhestar-server/polarhestar-entry-server.js missing.\n' +
      '  Run the SSR build first:\n' +
      '  vite build --config vite.polarhestar.config.ts --ssr src/polarhestar-entry-server.tsx --outDir dist-polarhestar-server',
  )
  process.exit(1)
}

const { render, PRERENDER_ROUTES } = await import(pathToFileURL(serverEntry).href)

const shell = readFileSync(join(dist, 'index.html'), 'utf8')
if (!shell.includes('<div id="root"></div>')) {
  console.error('polarhestar-prerender: shell has no empty <div id="root"></div> to fill; did the build change?')
  process.exit(1)
}

/* A route that renders almost nothing is the failure this step exists to
 * prevent, and it fails silently by nature: the page still works in a
 * browser. So it fails the BUILD instead. The smallest real page (a short
 * ride) is well above this, an empty shell far below. */
const MIN_MARKUP = 6000

let total = 0
for (const route of PRERENDER_ROUTES) {
  const body = await render(route)

  if (body.length < MIN_MARKUP) {
    console.error(
      `polarhestar-prerender: ${route} produced only ${body.length} chars of markup (expected at least ${MIN_MARKUP}).\n` +
        '  An empty body is what the AI crawlers would see. Refusing to ship it.',
    )
    process.exit(1)
  }

  /* React escapes text children, INCLUDING the contents of a <style> tag. A
   * component that writes <style>{CSS}</style> prerenders its CSS as
   * content:&#x27;&#x27;: valid HTML, broken stylesheet, invisible in a
   * browser because the failed hydration quietly rebuilt the page. */
  const escapedInStyle = [...body.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
    .reduce((n, m) => n + (m[1].match(/&#x27;|&quot;|&amp;/g) || []).length, 0)
  if (escapedInStyle > 0) {
    console.error(
      `polarhestar-prerender: ${route} has ${escapedInStyle} HTML-escaped character(s) inside a <style> block.\n` +
        '  Render style tags with <style dangerouslySetInnerHTML={{ __html: CSS }} />, not <style>{CSS}</style>.',
    )
    process.exit(1)
  }

  /* No inline opacity:0 in the markup: hidden content to a crawler and a blank
   * region to a reader whose script failed. The reveals hide through a CSS
   * class that a <noscript> rule in the shell lifts. */
  // (aria-hidden decoration is exempt: the season switcher stacks every season's photo and glow and
  //  crossfades them with opacity; only the active layer is content.)
  const hidden = (body.replace(/<style[\s\S]*?<\/style>/g, '').match(/<(?!img\b)[a-z0-9]+\b[^>]*style="[^"]*opacity:\s*0[;"][^>]*>/g) || [])
    .filter((tag) => !/aria-hidden="true"/.test(tag)).length
  if (hidden > 0) {
    console.error(`polarhestar-prerender: ${route} carries ${hidden} element(s) with inline opacity:0 in the prerendered markup.`)
    process.exit(1)
  }

  /* One H1 per page. */
  const h1 = (body.match(/<h1[\s>]/g) || []).length
  if (h1 !== 1) {
    console.error(`polarhestar-prerender: ${route} has ${h1} <h1> elements; every page must have exactly one.`)
    process.exit(1)
  }

  const html = shell.replace('<div id="root"></div>', `<div id="root">${body}</div>`)

  const dir = route === '/' ? dist : join(dist, route.replace(/^\/|\/$/g, ''))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)

  total += body.length
  console.log(`  ${route.padEnd(36)} ${String(body.length).padStart(7)} chars of markup`)
}

console.log(`polarhestar-prerender: ${PRERENDER_ROUTES.length} routes prerendered, ${total.toLocaleString('en-US')} chars total`)
