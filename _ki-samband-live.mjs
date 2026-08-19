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
const steps = 60;
for (let i = 0; i <= steps; i++) {
  await page.mouse.wheel({ deltaY: totalHeight / steps });
  await new Promise((r) => setTimeout(r, 60));
}
await new Promise((r) => setTimeout(r, 1500)); // let Lenis fully settle at the bottom
const y = await page.evaluate(() => window.scrollY);
console.log('settled scrollY:', y, 'of', totalHeight);
// plain VIEWPORT screenshot (no fullPage, no clip) — exactly what a real visitor sees
await page.screenshot({ path: '/Users/sindri/Documents/Website redesign mockups/_solo-wt/_ki-samband-live.png' });
await browser.close();
