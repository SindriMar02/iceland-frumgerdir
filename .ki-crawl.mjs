import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 2400 })
const seen = new Set(), out = []
const queue = ['https://katrinisfeld.is/verkefni/']
while (queue.length && seen.size < 60) {
  const u = queue.shift()
  if (seen.has(u)) continue
  seen.add(u)
  try {
    await page.goto(u, { waitUntil: 'networkidle2', timeout: 25000 })
    await new Promise(r => setTimeout(r, 900))
    const d = await page.evaluate(() => {
      const imgs = [...document.images].filter(i => i.naturalWidth > 400 && !/logo|icon|avatar/i.test(i.currentSrc))
      const main = document.querySelector('main, .entry-content, article, #content') || document.body
      const txt = main.innerText.replace(/\s+/g, ' ').trim()
      return {
        title: document.title,
        h1: document.querySelector('h1')?.innerText.trim() || '',
        imgs: imgs.length,
        srcs: imgs.map(i => i.currentSrc.split('/').pop()).slice(0, 40),
        words: txt.split(' ').length,
        text: txt.slice(0, 400),
        links: [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.includes('katrinisfeld.is/verkefni')),
      }
    })
    out.push({ url: u, ...d })
    for (const l of d.links) { const c = l.split('#')[0].split('?')[0]; if (!seen.has(c) && c.includes('/verkefni')) queue.push(c) }
  } catch (e) { out.push({ url: u, error: e.message.slice(0, 60) }) }
}
console.log(JSON.stringify(out.map(o => ({ url: o.url.replace('https://katrinisfeld.is', ''), h1: o.h1, imgs: o.imgs, words: o.words, err: o.error })), null, 0))

const fs = await import('node:fs'); fs.writeFileSync('/tmp/ki-crawl.json', JSON.stringify(out, null, 1))
await br.close()
