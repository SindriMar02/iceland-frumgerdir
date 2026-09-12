import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const path of process.argv.slice(3)) {
  const p = await br.newPage(); await p.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
  await p.goto(process.argv[2] + path, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 2500))
  const H = await p.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < H; y += 800) { await p.evaluate(v => scrollTo(0, v), y); await new Promise(r => setTimeout(r, 200)) }
  await p.evaluate(() => scrollTo(0, 0)); await new Promise(r => setTimeout(r, 700))
  const name = (path.replace(/\//g, '_') || 'home')
  await p.screenshot({ path: `/tmp/pg${name}.png`, fullPage: false })
  console.log(name, 'h=' + H, await p.evaluate(() => document.title.slice(0, 60)))
  await p.close()
}
await br.close()
