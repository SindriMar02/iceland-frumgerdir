import puppeteer from 'puppeteer-core';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' });
await new Promise(r=>setTimeout(r,1600));
const btns = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map((b,i)=>({i, aria: b.getAttribute('aria-label'), cls: b.className, text: b.textContent.trim()})));
console.log(JSON.stringify(btns, null, 1));
await br.close();
