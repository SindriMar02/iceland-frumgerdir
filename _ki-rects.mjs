import puppeteer from 'puppeteer-core';

const URL = 'http://localhost:5344/preview/katrinisfeld';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/review-katrinisfeld',
  args: ['--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise((r) => setTimeout(r, 300));
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
const steps = 50;
for (let i = 0; i <= steps; i++) {
  await page.mouse.wheel({ deltaY: totalHeight / steps });
  await new Promise((r) => setTimeout(r, 80));
}
await new Promise((r) => setTimeout(r, 500));

const rects = await page.evaluate(() => {
  const sy = window.scrollY;
  const get = (sel) => {
    const el = typeof sel === 'string' && sel.startsWith('#') ? document.getElementById(sel.slice(1)) : document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top + sy), height: Math.round(r.height) };
  };
  return {
    yfirlit: get('#verkefni'),
    skra: get('#skra'),
    italskar: get('.ki-italskar'),
    studio: get('.ki-studio'),
    samband: get('#samband'),
    docHeight: document.body.scrollHeight,
  };
});
console.log(JSON.stringify(rects, null, 2));
await browser.close();
