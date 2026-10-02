/**
 * One home for the site: katrinisfeld.is.
 *
 * www.katrinisfeld.is and the Pages production alias katrin-isfeld.pages.dev
 * serve the same files, which Google would treat as duplicate sites. Both are
 * sent to the same path on katrinisfeld.is with a 301 (query kept).
 *
 * Only those two hostnames move. Branch and hash preview URLs
 * (<branch>.katrin-isfeld.pages.dev) stay reachable for review; Pages already
 * marks them noindex.
 *
 * Lives in deploy/katrin/functions, not the repo root, so no other Pages
 * project deployed from this repository picks it up. Deploy from
 * deploy/katrin:  npx wrangler pages deploy ../../dist-katrin --project-name katrin-isfeld --branch main
 */
const CANONICAL = 'katrinisfeld.is'
const MOVE = new Set(['www.katrinisfeld.is', 'katrin-isfeld.pages.dev'])

export async function onRequest(context) {
  const url = new URL(context.request.url)
  if (MOVE.has(url.hostname)) {
    url.protocol = 'https:'
    url.hostname = CANONICAL
    url.port = ''
    return Response.redirect(url.toString(), 301)
  }
  return context.next()
}
