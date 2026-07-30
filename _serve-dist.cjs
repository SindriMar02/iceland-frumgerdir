/* Minimal static server for dist/, honouring $PORT so the harness can assign
   a free port (the vite dev config hardcodes 5199 and is held by another
   session). SPA-safe: postbuild already writes a per-route index.html, and
   anything unmatched falls back to dist/index.html. */
const http = require('http')
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, 'dist')
const PORT = Number(process.env.PORT || 4199)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
}

const send = (res, code, body, type) => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' })
  res.end(body)
}

http
  .createServer((req, res) => {
    let rel = decodeURIComponent((req.url || '/').split('?')[0])
    if (rel.endsWith('/')) rel += 'index.html'
    let file = path.join(ROOT, rel)
    if (!file.startsWith(ROOT)) return send(res, 403, 'forbidden', 'text/plain')

    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const withIndex = path.join(file, 'index.html')
      file = fs.existsSync(withIndex) ? withIndex : path.join(ROOT, 'index.html')
    }
    try {
      const buf = fs.readFileSync(file)
      send(res, 200, buf, TYPES[path.extname(file)] || 'application/octet-stream')
    } catch {
      send(res, 404, 'not found', 'text/plain')
    }
  })
  .listen(PORT, () => console.log(`dist server on http://localhost:${PORT}`))
