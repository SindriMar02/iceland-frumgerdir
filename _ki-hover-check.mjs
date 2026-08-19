import puppeteer from 'puppeteer-core';
const URL = 'http://localhost:5344/preview/katrinisfeld';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', userDataDir: '/tmp/review-katrinisfeld', args: ['--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise((r) => setTimeout(r, 300));

const totalHeight = await page.evaluate(() => document.body.scrollHeight);
// big deliberate overshoot toward skra, then let Lenis fully settle (well past its 1.15s duration)
for (let i = 0; i < 30; i++) {
  await page.mouse.wheel({ deltaY: totalHeight / 20 });
  await new Promise((r) => setTimeout(r, 30));
}
await new Promise((r) => setTimeout(r, 2000)); // full Lenis settle

let box = await page.evaluate(() => {
  const row = document.querySelector('.ki-skra-row');
  const r = row.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height, inView: r.top > 0 && r.top < 900 };
});
console.log('row rect after settle:', JSON.stringify(box));

if (!box.inView) {
  // nudge into better view
  await page.evaluate(() => document.getElementById('skra').scrollIntoView({ block: 'center' }));
  await new Promise((r) => setTimeout(r, 2000));
  box = await page.evaluate(() => {
    const row = document.querySelector('.ki-skra-row');
    const r = row.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height, inView: r.top > 0 && r.top < 900 };
  });
  console.log('row rect after scrollIntoView nudge:', JSON.stringify(box));
}

const before = await page.evaluate(() => {
  const el = document.querySelector('.ki-skra-row');
  const span = el.querySelector('span');
  const b = getComputedStyle(el, '::before');
  return { spanTransform: getComputedStyle(span).transform, barTransform: b.transform, color: getComputedStyle(el).color };
});
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
await new Promise((r) => setTimeout(r, 300));
// confirm :hover actually matched via JS
const hoverMatched = await page.evaluate(() => document.querySelector('.ki-skra-row:hover') !== null);
await new Promise((r) => setTimeout(r, 900));
const after = await page.evaluate(() => {
  const el = document.querySelector('.ki-skra-row');
  const span = el.querySelector('span');
  const b = getComputedStyle(el, '::before');
  return { spanTransform: getComputedStyle(span).transform, barTransform: b.transform, color: getComputedStyle(el).color };
});
console.log('hoverMatched (:hover selector):', hoverMatched);
console.log('before hover:', JSON.stringify(before));
console.log('after hover:', JSON.stringify(after));
console.log('errors:', errors);
await browser.close();
