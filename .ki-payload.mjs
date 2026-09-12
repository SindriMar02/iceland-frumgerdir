import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const path of process.argv.slice(3)) {
  const p = await br.newPage(); await p.setViewport({ width: 1440, height: 900 })
  let js = 0, all = 0
  p.on('response', async r => { const u = r.url(); if (!u.startsWith('http')) return
    try { const b = (await r.buffer()).length; all += b; if (/\.js$/.test(u)) js += b } catch {} })
  await p.goto(process.argv[2] + path, { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 2000))
  console.log(`${(path||'/').padEnd(28)} JS ${(js/1024).toFixed(0).padStart(4)}KB   total ${(all/1024/1024).toFixed(2)}MB`)
  await p.close()
}
await br.close()
