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

// scroll all the way down once to arm every reveal, then screenshot specific rects
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < totalHeight; y += 400) {
  await page.mouse.wheel({ deltaY: 400 });
  await new Promise((r) => setTimeout(r, 15));
}
await new Promise((r) => setTimeout(r, 400));

const shots = [
  ['verkefni', '_ki-sec-yfirlit.png'],
  ['skra', '_ki-sec-skra.png'],
];
for (const [id, file] of shots) {
  const box = await page.evaluate((id) => {
    const el = document.getElementById(id);
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  }, id);
  await page.evaluate((top) => window.scrollTo(0, top), Math.max(0, box.top - 20));
  await new Promise((r) => setTimeout(r, 250));
  await page.screenshot({ path: `/Users/sindri/Documents/Website redesign mockups/_solo-wt/${file}`, clip: { x: 0, y: 0, width: 1440, height: Math.min(900, box.height + 40) } });
}

// Italian cabinetry + Studio: use class selectors since no id
for (const [sel, file] of [['.ki-italskar', '_ki-sec-italskar.png'], ['.ki-studio', '_ki-sec-studio.png'], ['.ki-samband', '_ki-sec-samband.png']]) {
  const box = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  }, sel);
  await page.evaluate((top) => window.scrollTo(0, top), Math.max(0, box.top - 20));
  await new Promise((r) => setTimeout(r, 250));
  await page.screenshot({ path: `/Users/sindri/Documents/Website redesign mockups/_solo-wt/${file}`, clip: { x: 0, y: 0, width: 1440, height: Math.min(900, box.height + 40) } });
}

await browser.close();
console.log('done');
