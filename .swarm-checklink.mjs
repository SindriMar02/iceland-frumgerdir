import puppeteer from 'puppeteer-core';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.goto('http://localhost:8963/hafa-samband', { waitUntil: 'networkidle0' });
await new Promise(r=>setTimeout(r,1000));
const info = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('a,button')).filter(e => e.textContent.includes('Hringja og finna tíma') || e.textContent.includes('HRINGJA'));
  return els.map(e => ({ tag: e.tagName, href: e.getAttribute('href'), text: e.textContent.trim() }));
});
console.log(JSON.stringify(info));
await br.close();
