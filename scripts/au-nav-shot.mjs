import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-nav' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await p.goto('https://sindrimar02.github.io/austurey-preview/?nav=1', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 3000))
const info = await p.evaluate(() => {
  const r = s => { const e=document.querySelector(s); if(!e) return null; const b=e.getBoundingClientRect(); const c=getComputedStyle(e); return {l:Math.round(b.left),r:Math.round(b.right),t:Math.round(b.top),w:Math.round(b.width),h:Math.round(b.height),disp:c.display,pos:c.position} }
  return { vw: innerWidth, nav_in: r('.nav_in'), logo: r('.nav_logo'), right: r('.nav_right'), book: r('.nav_book'), burger: r('.nav_burger'),
    navInCS: (c=>({disp:c.display,just:c.justifyContent,align:c.alignItems,grid:c.gridTemplateColumns}))(getComputedStyle(document.querySelector('.nav_in'))),
    rightCS: (c=>({disp:c.display,just:c.justifyContent,gap:c.gap}))(getComputedStyle(document.querySelector('.nav_right'))) }
})
console.log(JSON.stringify(info, null, 1))
await p.screenshot({ path: 'scripts/au-nav-closed.png', clip: { x: 0, y: 0, width: 1440, height: 130 } })
await p.click('#burger')
await new Promise(r => setTimeout(r, 1200))
await p.screenshot({ path: 'scripts/au-menu-open.png' })
console.log('shots written')
await b.close()
