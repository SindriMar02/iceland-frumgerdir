import puppeteer from 'puppeteer-core';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' });
await new Promise(r=>setTimeout(r,1500));
const info = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll('a[href="/verkefni/gistiheimili-og-hotel"]'));
  return links.map(l => { const r = l.getBoundingClientRect(); return { top: r.top + window.scrollY, text: l.textContent.trim() }; });
});
console.log(JSON.stringify(info));
await br.close();
