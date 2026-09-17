import puppeteer from 'puppeteer-core';
const BASE = 'http://localhost:8963';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-mobile-browser';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto(BASE + '/verkefni/fjallalind', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1200));
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 250) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await new Promise(r => setTimeout(r, 150));
}
await new Promise(r => setTimeout(r, 300));
// scroll back up slightly so the next-project card is centered in viewport
await page.evaluate(() => window.scrollTo({ top: 1913 - 250, behavior: 'instant' }));
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: `${OUT}/12-next-project-card-revealed.png` });
await br.close();
