import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/dr-fps-profile', args: ['--window-size=1440,900'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.evaluateOnNewDocument(() => sessionStorage.setItem('dr_seen', '1'))
await page.goto(process.env.FPS_URL || 'http://localhost:5399/preview/drangar', { waitUntil: 'domcontentloaded' })
await page.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 3500))
await page.evaluate(() => { window.__f = []; let last = performance.now(); const loop = (t) => { window.__f.push(t - last); last = t; requestAnimationFrame(loop) }; requestAnimationFrame(loop) })
for (let i = 0; i < 90; i++) { await page.mouse.wheel({ deltaY: 300 }); await new Promise(r => setTimeout(r, 16)) }
const fps = await page.evaluate(() => { const f = window.__f.slice(5); const avg = 1000 / (f.reduce((a,b)=>a+b,0)/f.length); const s=[...f].sort((a,b)=>a-b); return { avg: Math.round(avg*10)/10, p95: Math.round(s[Math.floor(f.length*.95)]*10)/10, janky: Math.round(f.filter(x=>x>20).length/f.length*1000)/10 } })
console.log(JSON.stringify(fps))
await browser.close()
