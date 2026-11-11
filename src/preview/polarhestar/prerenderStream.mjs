import { renderToReadableStream } from 'react-dom/server.browser'

/**
 * React 18's Node pipeable writer flushes a whole 2048-byte buffer when a
 * multibyte character cannot fit, including its unused zero-filled tail.
 * The Web Streams writer pre-encodes strings and safely splits byte arrays.
 * Wait for lazy routes, then decode the entire stream across chunk boundaries.
 * @param {import('react').ReactNode} element
 */
export async function renderMarkup(element) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(new Error('prerender timed out after 30s')), 30_000)
  let renderError
  try {
    const stream = await renderToReadableStream(element, {
      signal: controller.signal,
      onError(error) { renderError = error },
    })
    await stream.allReady
    if (renderError) throw renderError
    return await new Response(stream).text()
  } finally {
    clearTimeout(timeout)
  }
}
