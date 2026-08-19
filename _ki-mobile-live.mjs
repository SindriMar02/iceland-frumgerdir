import puppeteer from 'puppeteer-core';
const URL = 'http://localhost:5344/preview/katrinisfeld';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', userDataDir: '/tmp/review-katrinisfeld', args: ['--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise((r) => setTimeout(r, 300));
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
for (let i = 0; i <= 70; i++) {
  await page.mouse.wheel({ deltaY: totalHeight / 70 });
  await new Promise((r) => setTimeout(r, 50));
}
await new Promise((r) => setTimeout(r, 1500));
const y = await page.evaluate(() => window.scrollY);
console.log('settled scrollY:', y, 'of', totalHeight);
await page.screenshot({ path: '/Users/sindri/Documents/Website redesign mockups/_solo-wt/_ki-mobile-samband-live.png' });
await browser.close();
