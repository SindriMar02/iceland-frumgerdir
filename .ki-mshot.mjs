import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const [w, h, tag] of [[390, 844, 'a'], [390, 664, 'b']]) {
  const p = await br.newPage(); await p.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await (await p.createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
  await p.goto(process.argv[2], { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 5200))
  await p.screenshot({ path: `/tmp/ki-m-${tag}.png` })
  console.log(tag, JSON.stringify(await p.evaluate(() => {
    const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom)] }
    return { corner: r('.parallax__corner'), name: r('.ki-plx-name'), role: r('.ki-plx-role'), tag: r('.ki-plx-tag'), vh: innerHeight }
  })))
  await p.close()
}
await br.close()
