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
const box = await page.evaluate(() => {
  const el = document.querySelector('a.ki-proj-adj-link--on');
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: r.height };
});
console.log(JSON.stringify(box));
await page.evaluate((b) => window.scrollTo({ top: b.top - 100, behavior: 'instant' }), box);
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: `${OUT}/13-next-project-final.png` });
await br.close();
