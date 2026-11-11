// Audit built entry references, CSS URLs, JS imports and runtime asset templates.
// Run after the isolated Vite build: node src/preview/hberg/paths-check.mjs
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
const dist = path.resolve('dist-hberg')
const origin = 'https://sindrimar02.github.io'
const mount = '/hberg-frumgerd/'
const entries = ['index.html', 'vorur/index.html', 'naeringargildi/index.html']
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])
const files = walk(dist), inventory = files.map(f => path.relative(dist, f).replaceAll(path.sep, '/'))
const errors = new Set(), checked = new Set(), assets = new Set(), slugs = new Set()
const fail = message => errors.add(message)
function check(ref, from) {
  if (/^(?:data:|https?:|mailto:|tel:|#)/.test(ref)) return
  const url = new URL(ref, origin + mount + from)
  if (!url.pathname.startsWith(mount)) { fail(`Escapes deployment: ${from} → ${ref}`); return }
  const target = decodeURIComponent(url.pathname.slice(mount.length))
  checked.add(`${from}:${target}`)
  if (!fs.existsSync(path.join(dist, target))) fail(`Missing: ${from} → ${ref} (${target})`)
}
const scripts = new Set()
for (const entry of entries) {
  if (!inventory.includes(entry)) { fail(`Missing entry: ${entry}`); continue }
  const html = fs.readFileSync(path.join(dist, entry), 'utf8')
  const root = html.match(/<meta name="hb-root" content="([^"]+)"/)?.[1]
  if (!root || new URL(root, origin + mount + entry).pathname !== mount) fail(`Invalid hb-root in ${entry}`)
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    check(match[1], entry)
    if (/\.js(?:\?|$)/.test(match[1])) scripts.add(path.posix.normalize(path.posix.join(path.posix.dirname(entry), match[1])))
  }
}
function visit(node, fn) { fn(node); ts.forEachChild(node, child => visit(child, fn)) }
for (const file of files.filter(f => /\.(js|css)$/.test(f))) {
  const rel = path.relative(dist, file).replaceAll(path.sep, '/'), code = fs.readFileSync(file, 'utf8')
  for (const m of code.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) if (!m[1].includes('${') && !m[1].includes('+')) check(m[1], rel)
  if (!file.endsWith('.js')) continue
  const ast = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const roots = new Set(), aliases = [], templates = []
  visit(ast, node => {
    if (ts.isPropertyAssignment(node) && node.name.getText(ast) === 'f' && ts.isStringLiteral(node.initializer) && /\.(svg|png|webp)$/.test(node.initializer.text)) assets.add(`hberg/solu/${node.initializer.text}`)
    if (ts.isStringLiteral(node) && /^hero:.+/.test(node.text)) assets.add(`hberg/hero/${node.text.slice(5)}.webp`)
    if (ts.isStringLiteral(node) && /^(?:laus:)?p\d\d$/.test(node.text)) assets.add(`hberg/laus/${node.text.replace('laus:', '')}.webp`)
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isIdentifier(node.name)) {
      const text = node.initializer.getText(ast)
      if (/^new URL\([^,]+,\s*document.baseURI\)\.pathname$/.test(text)) roots.add(node.name.text)
      if (ts.isIdentifier(node.initializer)) aliases.push([node.name.text, node.initializer.text])
    }
    if (ts.isPropertyAssignment(node) && node.name.getText(ast) === 'slug' && ts.isStringLiteral(node.initializer)) slugs.add(node.initializer.text)
    if (ts.isTemplateExpression(node) && /(?:hberg|fonts)\//.test(node.getText(ast))) templates.push(node)
    if (ts.isStringLiteral(node) && /\.(woff2|webp|png|svg|ico|js)$/.test(node.text)) {
      if (node.text.startsWith('./') || node.text.startsWith('../')) check(node.text, rel)
      if (/\.woff2$/.test(node.text) && !node.text.includes('/hberg/')) assets.add(`hberg/fonts/${node.text}`)
    }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && ts.isStringLiteral(node.arguments[0])) check(node.arguments[0].text, rel)
  })
  for (let i = 0; i < aliases.length; i++) for (const [a, b] of aliases) if (roots.has(b)) roots.add(a)
  for (const node of templates) {
    // An asset template must begin with a verified root binding (including aliases).
    const first = node.templateSpans[0]
    if (!node.head.text.startsWith('hberg/') && node.head.text !== '') {
      for (const span of node.templateSpans) if (/^(?:hberg|fonts)\//.test(span.literal.text)) {
        if (!ts.isIdentifier(span.expression) || !roots.has(span.expression.text)) fail(`Unrooted CSS asset in ${rel}`)
        else { const asset = span.literal.text.match(/^(?:hberg|fonts)\/[^'"\s)]+/)?.[0]; if (asset) assets.add(asset.split('?')[0]) }
      }
      continue
    }
    if (node.head.text !== '' || !ts.isIdentifier(first.expression) || !roots.has(first.expression.text) || !/^(?:hberg|fonts)\//.test(first.literal.text)) {
      fail(`Unrooted runtime asset template in ${rel}: ${node.getText(ast).slice(0, 100)}`); continue
    }
    const parts = node.templateSpans.map(s => s.literal.text)
    let pattern = parts.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')
    // Cache query interpolations are not filesystem paths.
    pattern = pattern.split('\\?')[0]
    const re = new RegExp(`^${pattern}$`)
    const matches = inventory.filter(f => re.test(f))
    if (!matches.length) fail(`No files match runtime template in ${rel}: ${node.getText(ast).slice(0,100)}`)
    matches.forEach(f => assets.add(f))
    // Static paths must exist even when no inventory match is possible.
    if (parts.length === 2 && parts[1] === '' && !parts[0].endsWith('/')) assets.add(parts[0].split('?')[0])
  }
}
// PK's dynamic product/size template is exhaustive: validate every built product,
// including missing files which an inventory-based template match cannot discover.
for (const slug of slugs) for (const size of [400, 800, 1200]) assets.add(`hberg/p/${slug}/${size}.webp`)
for (let i = 0; i < 40; i++) assets.add(`hberg/laus/p${String(i).padStart(2, '0')}.webp`)
if (slugs.size !== 57) fail(`Expected 57 built product slugs, found ${slugs.size}`)
for (const entry of entries) {
  const html = fs.readFileSync(path.join(dist, entry), 'utf8')
  const root = html.match(/<meta name="hb-root" content="([^"]+)"/)?.[1] ?? './'
  const resolvedRoot = new URL(root, origin + mount + entry)
  for (const asset of assets) {
    const ref = new URL(asset, resolvedRoot).pathname
    check(ref, entry)
    if (/\/(vorur|naeringargildi)\/hberg\//.test(ref)) fail(`Nested asset: ${ref}`)
  }
}
if (!scripts.size) fail('No built entry script found')
for (const error of errors) console.error(error)
console.log(`${entries.length} page depths; ${slugs.size} products; ${assets.size} runtime assets; ${checked.size} resolved references; ${errors.size} missing or invalid paths.`)
process.exitCode = errors.size ? 1 : 0
