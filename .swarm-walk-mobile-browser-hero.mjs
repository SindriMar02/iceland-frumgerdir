import puppeteer from 'puppeteer-core';
const BASE = 'http://localhost:8963';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-mobile-browser';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1500));
async function swipe() {
  await page.touchscreen.touchStart(340, 400);
  await new Promise(r => setTimeout(r, 50));
  await page.touchscreen.touchMove(40, 400);
  await new Promise(r => setTimeout(r, 50));
  await page.touchscreen.touchEnd();
  await new Promise(r => setTimeout(r, 900));
}
for (let i = 0; i < 4; i++) {
  await swipe();
  const title = await page.evaluate(() => document.querySelector('.ki-show-title')?.textContent);
  console.log('slide', i, title);
  await page.screenshot({ path: `${OUT}/14-slide-${i}.png`, clip: { x: 0, y: 0, width: 390, height: 500 } });
}
await br.close();
