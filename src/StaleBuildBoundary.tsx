import { Component, type ReactNode } from 'react'

/**
 * WHY THIS EXISTS — the "preview won't open" white screen (2026-08-14).
 *
 * Tannlæknavaktin opened blank for Sindri and only came back after a refresh
 * AND quitting the browser. It was not that preview's fault; every route on
 * this site could do it, and the trigger is a deploy:
 *
 *  1. GitHub Pages serves index.html with `cache-control: max-age=600`, so a
 *     visitor can hold a ten-minute-old copy of it.
 *  2. Every deploy replaces dist/ wholesale. Vite's chunk filenames are
 *     content-hashed, so the new build has DIFFERENT names and the old files
 *     are gone.
 *  3. A cached index.html therefore asks for /assets/Page-<oldhash>.js, gets a
 *     404, and the `lazy()` import rejects.
 *  4. Nothing caught that rejection. React unmounted the whole tree, the outer
 *     Suspense fallback was `null`, and the visitor was left with a permanently
 *     white page. Reloading only helped once the 600s HTML cache had expired,
 *     which is exactly the "refresh, then quit the browser" dance.
 *
 * Measured, not assumed: 404-ing a single chunk against the live site left
 * `#root` with 0 children and 0 characters of text.
 *
 * THE FIX. A stale build is recoverable — the current index.html names chunks
 * that DO exist — so the correct response to a chunk failure is one hard
 * reload, not an error page. `reload()` revalidates against the origin and
 * picks up the new HTML.
 *
 * One reload, never a loop. The attempt is recorded in sessionStorage before
 * reloading, so a genuinely broken deploy (where the chunk is missing from the
 * CURRENT build too) shows an honest message instead of reloading forever.
 * sessionStorage, not local: the flag should die with the tab, so a visitor
 * coming back tomorrow gets a fresh automatic recovery.
 */

/**
 * Shared with the inline watchdog in index.html, which covers the case this
 * boundary cannot: the ENTRY script 404ing, where no bundled code ever runs.
 * Both must spend the same single retry, or the two of them can ping-pong.
 * Change it in one place and the other stops matching.
 */
const RETRY_KEY = 'sndr:stale-build-reload'

/** Chrome, Safari and Firefox each word this differently; match all of them. */
function isStaleBuildError(err: unknown): boolean {
  const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
  return (
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    // Vite's own wording when a <link rel=modulepreload> is the thing that died.
    /Unable to preload (CSS|module)/i.test(msg) ||
    /'?text\/html'? is not a valid JavaScript MIME type/i.test(msg) ||
    /ChunkLoadError/i.test(msg) ||
    /Loading chunk \d+ failed/i.test(msg)
  )
}

/** Returns false when we have already spent this tab's one reload. */
function claimReload(): boolean {
  try {
    if (sessionStorage.getItem(RETRY_KEY)) return false
    sessionStorage.setItem(RETRY_KEY, String(Date.now()))
    return true
  } catch {
    // Private mode with storage disabled: reload once rather than never. The
    // page is blank otherwise, and a loop still needs a repeating 404 to feed it.
    return true
  }
}

/** Called once the app has actually rendered, so the next deploy gets its own retry. */
export function clearStaleBuildRetry() {
  try {
    sessionStorage.removeItem(RETRY_KEY)
  } catch {
    /* storage disabled: nothing to clear */
  }
}

/**
 * Vite fires this on the <link rel=modulepreload> path, which can fail BEFORE
 * React ever sees a rejected import. Same recovery, same one-shot guard.
 * Registered at module scope so it is live from the first tick.
 */
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (e) => {
    if (claimReload()) {
      e.preventDefault() // we are handling it; suppress Vite's rethrow
      window.location.reload()
      return
    }
    // Out of retries: deliberately do NOT preventDefault, so Vite rethrows the
    // original, recognisable error and the boundary below can show the retry
    // message. Swallowing it here instead let the import resolve to undefined
    // and surfaced as a bare "Cannot read properties of undefined (reading
    // 'default')", which matches nothing and white-screened the page.
  })
}

type Props = { children: ReactNode }
type State = { failed: boolean; fatal: unknown }

export default class StaleBuildBoundary extends Component<Props, State> {
  state: State = { failed: false, fatal: null }

  static getDerivedStateFromError(err: unknown): State {
    // A stale chunk is recoverable, so reload instead of rendering anything.
    // Anything else is a real bug and is re-thrown from render(), so it is
    // never silently swallowed into a "reload" message that cannot fix it.
    if (!isStaleBuildError(err)) return { failed: false, fatal: err }
    if (claimReload()) {
      window.location.reload()
      return { failed: false, fatal: null }
    }
    return { failed: true, fatal: null }
  }

  render() {
    if (this.state.fatal) throw this.state.fatal
    if (!this.state.failed) return this.props.children

    // Reached only when the reload did not help, i.e. the live build really is
    // missing a file. Icelandic, because everyone who opens a preview link is.
    // Deliberately names no client and links nowhere: preview links must never
    // expose the catalogue.
    return (
      <div
        role="alert"
        style={{
          minHeight: '100svh',
          display: 'grid',
          placeContent: 'center',
          gap: 18,
          padding: 32,
          textAlign: 'center',
          background: '#faf8f5',
          color: '#1c1a17',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        <p style={{ margin: 0, fontSize: 19, lineHeight: 1.5, maxWidth: '34ch' }}>
          Síðan náðist ekki að hlaðast. Þetta lagast oftast við að hlaða henni aftur.
        </p>
        <button
          type="button"
          onClick={() => {
            clearStaleBuildRetry()
            window.location.reload()
          }}
          style={{
            justifySelf: 'center',
            minHeight: 44,
            padding: '0 22px',
            borderRadius: 999,
            border: '1px solid currentColor',
            background: 'transparent',
            color: 'inherit',
            font: 'inherit',
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Hlaða síðunni aftur
        </button>
      </div>
    )
  }
}
