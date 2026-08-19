import puppeteer from 'puppeteer-core';
const URL = 'http://localhost:5344/preview/katrinisfeld';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', userDataDir: '/tmp/review-katrinisfeld', args: ['--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise((r) => setTimeout(r, 300));
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
let found = [];
for (let i = 0; i < 100; i++) {
  await page.mouse.wheel({ deltaY: totalHeight / 100 });
  await new Promise((r) => setTimeout(r, 35));
  const s = await page.evaluate(() => {
    const el = document.querySelector('.ki-dome-title');
    const r = el.getBoundingClientRect();
    const w = el.querySelectorAll(':scope > span')[2];
    return { y: Math.round(window.scrollY), top: Math.round(r.top), tf: w ? getComputedStyle(w).transform : null };
  });
  found.push(s);
}
const nonIdentity = found.filter(f => f.tf && f.tf !== 'none' && f.tf !== 'matrix(1, 0, 0, 1, 0, 0)');
console.log('total samples:', found.length, 'non-identity:', nonIdentity.length);
console.log('sample of non-identity:', JSON.stringify(nonIdentity.slice(0, 6), null, 2));
console.log('last few samples regardless:', JSON.stringify(found.slice(-5), null, 2));
await browser.close();
