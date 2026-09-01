/**
 * Prerender every Nýpugarðar route to real HTML.
 *
 * WHY THIS EXISTS. Without this step the client build ships an index.html
 * whose body holds exactly one thing: <div id="root"></div>. A browser fills
 * that in instantly, so nothing looks wrong. But the crawlers that decide
 * whether a farm guesthouse gets found do not run JavaScript: GPTBot,
 * OAI-SearchBot, PerplexityBot and ClaudeBot fetch the HTML and stop, and
 * Google only renders on a deferred second pass. To every one of them the
 * site would be a blank page.
 *
 * So the body is rendered at build time and the browser hydrates it. Same
 * markup, same code splitting; the only difference is that the words exist
 * before JavaScript does. Four routes: English at the root, Icelandic under
 * /is/, so each language is a real page at a real address.
 *
 * Runs from tools/nypugardar-standalone-post.mjs, after the client build
 * (the shell) and the SSR build (the renderer), and BEFORE the SEO injector,
 * which writes each route's own head into the files written here.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = 'dist-nypugardar'
const serverEntry = resolve('dist-nypugardar-server/nypugardar-entry-server.js')

if (!existsSync(serverEntry)) {
  console.error(
    'nypugardar-prerender: dist-nypugardar-server/nypugardar-entry-server.js missing.\n' +
      '  Run the SSR build first:\n' +
      '  vite build --config vite.nypugardar.config.ts --ssr src/nypugardar-entry-server.tsx --outDir dist-nypugardar-server',
  )
  process.exit(1)
}

const { render, PRERENDER_ROUTES } = await import(pathToFileURL(serverEntry).href)

const shell = readFileSync(join(dist, 'index.html'), 'utf8')
if (!shell.includes('<div id="root"></div>')) {
  console.error('nypugardar-prerender: shell has no empty <div id="root"></div> to fill; did the build change?')
  process.exit(1)
}

/* A route that renders almost nothing is the failure this step exists to
 * prevent, and it fails silently by nature: the page still works in a
 * browser. So it fails the BUILD instead. 2000 chars is far below any real
 * page here and far above an empty shell. */
const MIN_MARKUP = 2000

let total = 0
for (const route of PRERENDER_ROUTES) {
  const body = await render(route)

  if (body.length < MIN_MARKUP) {
    console.error(
      `nypugardar-prerender: ${route} produced only ${body.length} chars of markup ` +
        `(expected at least ${MIN_MARKUP}).\n` +
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
      `nypugardar-prerender: ${route} has ${escapedInStyle} HTML-escaped character(s) inside a <style> block.\n` +
        '  Render style tags with <style dangerouslySetInnerHTML={{ __html: CSS }} />, not <style>{CSS}</style>.',
    )
    process.exit(1)
  }

  /* Every reveal must render at rest. An inline opacity:0 in the markup is
   * hidden content to a crawler and a blank page to a reader whose script
   * failed; the reveals arm themselves in a layout effect instead. */
  const hidden = (
    body
      .replace(/<style[\s\S]*?<\/style>/g, '' /* keyframes legitimately start at 0 */)
      .replace(/<div id="mobile-menu"[^>]*>/, '' /* the closed menu is meant to be hidden */)
      .match(/opacity:\s*0[;"]/g) || []
  ).length
  if (hidden > 0) {
    console.error(
      `nypugardar-prerender: ${route} carries ${hidden} element(s) with opacity:0 in the prerendered markup.\n` +
        '  Reveals must render visible and be armed by a layout effect (see useIsoLayoutEffect in Page.tsx).',
    )
    process.exit(1)
  }

  const html = shell.replace('<div id="root"></div>', `<div id="root">${body}</div>`)

  const dir = route === '/' ? dist : join(dist, route.replace(/^\/|\/$/g, ''))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)

  total += body.length
  console.log(`  ${route.padEnd(16)} ${String(body.length).padStart(7)} chars of markup`)
}

console.log(`nypugardar-prerender: ${PRERENDER_ROUTES.length} routes prerendered, ${total.toLocaleString('en-US')} chars total`)
