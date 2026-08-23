#!/usr/bin/env node
/**
 * Route regression guard.
 *
 * A deploy replaces dist/ wholesale, so a route that is missing from the
 * postbuild list in package.json does not go stale, it stops existing and the
 * SPA serves NotFound. That is how five previews that were built, audited and
 * deployed on 2026-07-28 silently went 404 when a later deploy ran from a
 * branch whose postbuild list never had them.
 *
 * This fails the build if a route that is recorded as live disappears, and it
 * checks that the build actually emitted a shell for each one.
 *
 *   node tools/route-guard.mjs dist          # verify (CI)
 *   node tools/route-guard.mjs dist --update # accept the current list as live
 *
 * Adding routes never fails; only losing them does. Run --update and commit the
 * manifest in the same change that adds a route, so the diff shows the intent.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const MANIFEST = join(HERE, 'live-routes.json')
const distDir = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'dist'
const update = process.argv.includes('--update')

/** The postbuild script is the single source of truth for what gets a shell. */
function routesFromPackageJson() {
  const pkg = JSON.parse(readFileSync(join(HERE, '..', 'package.json'), 'utf8'))
  const post = pkg.scripts?.postbuild ?? ''
  const m = post.match(/for r in ([^;]+); do/)
  if (!m) {
    console.error('route-guard: could not find the route list in scripts.postbuild.')
    process.exit(1)
  }
  return m[1].trim().split(/\s+/).filter(Boolean)
}

const current = routesFromPackageJson()

if (update) {
  writeFileSync(MANIFEST, JSON.stringify({ routes: [...current].sort() }, null, 2) + '\n')
  console.log(`route-guard: manifest updated, ${current.length} route(s) recorded as live.`)
  process.exit(0)
}

if (!existsSync(MANIFEST)) {
  console.error('route-guard: no manifest. Run: node tools/route-guard.mjs --update')
  process.exit(1)
}

const known = JSON.parse(readFileSync(MANIFEST, 'utf8')).routes ?? []
const set = new Set(current)
const missing = known.filter((r) => !set.has(r))
const added = current.filter((r) => !known.includes(r))

if (missing.length) {
  console.error(
    `route-guard: ${missing.length} route(s) recorded as live are missing from postbuild.\n` +
    `These are already published; removing them turns a working link into a 404:\n` +
    missing.map((r) => `  - ${r}`).join('\n') +
    `\n\nRestore them, or if the removal is deliberate (a retired preview) run:\n` +
    `  node tools/route-guard.mjs --update\n`,
  )
  process.exit(1)
}

/* A route can be listed and still not ship, e.g. a postbuild that half-ran. */
const notEmitted = current.filter((r) => !existsSync(join(distDir, r, 'index.html')))
if (notEmitted.length) {
  console.error(
    `route-guard: ${notEmitted.length} route(s) are listed but got no shell in ${distDir}:\n` +
    notEmitted.map((r) => `  - ${r}`).join('\n'),
  )
  process.exit(1)
}

const note = added.length ? `, ${added.length} new (${added.join(', ')})` : ''
console.log(`route-guard: ${current.length} route(s) OK${note}`)
