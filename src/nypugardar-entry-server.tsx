/**
 * Server entry for the Nýpugarðar prerender.
 *
 * Injecting only <head> metadata would leave #root empty, and an empty #root
 * is exactly what the AI crawlers see: Google renders JavaScript, GPTBot and
 * PerplexityBot largely do not. So the body has to be real HTML too.
 *
 * renderToPipeableStream, NOT renderToString: the routes are React.lazy, and
 * renderToString does not wait for a lazy import. It renders the Suspense
 * fallback, which here is null, producing exactly the empty page this whole
 * exercise exists to fix, while appearing to succeed. onAllReady waits for
 * every lazy chunk to resolve before handing back the markup, which is why
 * the client's code splitting survives this untouched.
 */
import { Writable } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { NypugardarApp } from './nypugardar-app'

export { PRERENDER_ROUTES } from './nypugardar-app'

export function render(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = ''
    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString('utf8')
        cb()
      },
    })
    sink.on('finish', () => resolve(html))

    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={path}>
        <NypugardarApp />
      </StaticRouter>,
      {
        onAllReady() {
          pipe(sink)
        },
        onError(err) {
          reject(err)
        },
      },
    )

    /* A hung lazy import must fail the build, not hang it forever. */
    setTimeout(() => {
      abort()
      reject(new Error(`prerender of ${path} timed out after 30s`))
    }, 30_000).unref?.()
  })
}
