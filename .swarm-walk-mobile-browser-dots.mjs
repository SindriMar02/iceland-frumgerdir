import puppeteer from 'puppeteer-core';
const BASE = 'http://localhost:8963';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-mobile-browser';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1500));
const box = await page.evaluate(() => {
  const el = document.querySelector('.ki-show-dots');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, w: r.width, h: r.height, visible: r.width > 0 && r.height > 0 };
});
console.log('DOTS_BOX=' + JSON.stringify(box));
await page.screenshot({ path: `${OUT}/15-dots-check.png` });
await br.close();
