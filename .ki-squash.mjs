import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const [w, h] of [[390, 844], [390, 750], [390, 664], [375, 635], [430, 780]]) {
  const p = await br.newPage(); await p.setViewport({ width: w, height: h, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
  await (await p.createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
  await p.goto(process.argv[2], { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 5200))
  const o = await p.evaluate(() => {
    const m = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { h: Math.round(r.height) } }
    const need = s => { const e = document.querySelector(s); return e ? Math.round(e.scrollHeight) : null }
    return { scene: m('.ki-plx-scene'), lock: m('.ki-plx-lockup'), name: m('.ki-plx-name'),
      roleH: m('.ki-plx-role').h, roleNeed: need('.ki-plx-role'),
      tagH: m('.ki-plx-tag').h, tagNeed: need('.ki-plx-tag') }
  })
  const clipped = o.roleH < o.roleNeed || o.tagH < o.tagNeed
  console.log(`${w}x${h}  scene ${o.scene.h} lock ${o.lock.h} name ${o.name.h} | role ${o.roleH}/${o.roleNeed} tag ${o.tagH}/${o.tagNeed}  ${clipped ? '*** CLIPPED ***' : 'ok'}`)
  await p.close()
}
await br.close()
