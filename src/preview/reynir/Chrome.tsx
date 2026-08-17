/**
 * The catalogue's preview chrome — the "this is a prototype" shell — gated so
 * it can NEVER ship on the client's own domain.
 *
 * The gate works at the bundler, not at runtime. STANDALONE is a compile-time
 * constant (vite.reynir.config.ts bakes VITE_REYNIR_STANDALONE), so in the
 * standalone build the lazy import below is dead code and Rollup emits no
 * chunk for it — which means PreviewChrome AND the private company catalogue
 * it pulls in (companies.ts, every prospect brief and outreach email) simply
 * do not exist in the client's deployment. See [[preview-link-isolation]]:
 * this used to depend on nobody importing the wrong module; now the wrong
 * module cannot be reached from the client build at all.
 */
import { lazy, Suspense } from 'react'
import { STANDALONE } from './paths'

const PreviewShell = STANDALONE ? null : lazy(() => import('./PreviewShell'))

export default function Chrome() {
  if (!PreviewShell) return null
  return (
    <Suspense fallback={null}>
      <PreviewShell />
    </Suspense>
  )
}
