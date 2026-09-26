/**
 * Server entry for the Bjarkalundur prerender.
 *
 * renderToPipeableStream with onAllReady, never renderToString: it waits for
 * every Suspense boundary, so the page arrives whole instead of as the fallback.
 * Also exports the head builder, so the prerender writes exactly the head the
 * browser applies on client-side navigation (one source, seo.ts).
 */
import { Writable } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { BjarkalundurApp } from './bjarkalundur-app'

export { PRERENDER_ROUTES } from './bjarkalundur-app'
export { headFor, headHtml } from './preview/bjarkalundur/seo'
export { COPY } from './preview/bjarkalundur/copy'
export { ROOMS, REVIEWS, PHONE_INTL, EMAIL, ADDRESS } from './preview/bjarkalundur/data'

export function render(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = ''
    const sink = new Writable({
      write(chunk, _enc, cb) { html += chunk.toString('utf8'); cb() },
    })
    sink.on('finish', () => resolve(html))
    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={path}>
        <BjarkalundurApp />
      </StaticRouter>,
      { onAllReady() { pipe(sink) }, onError(err) { reject(err) } },
    )
    /* a hung lazy import must fail the build, not hang it */
    setTimeout(() => { abort(); reject(new Error(`prerender of ${path} timed out after 30s`)) }, 30_000).unref?.()
  })
}
