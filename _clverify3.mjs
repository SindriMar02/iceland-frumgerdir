import puppeteer from 'puppeteer-core';

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d8d1af4d-f44e-4394-8cb3-37e1bdebce71/scratchpad';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/review-chrislund',
  args: ['--window-size=1440,900'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
await page.goto('http://localhost:5344/preview/chrislund', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 600));

// bridge section
await page.evaluate(() => document.querySelector('.cl-bridge')?.scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 900));
await page.screenshot({ path: `${OUT}/cl-final-bridge.png` });

// thjonusta section, full
await page.evaluate(() => document.querySelector('.cl-thjonusta')?.scrollIntoView({ block: 'start' }));
await new Promise(r => setTimeout(r, 900));
await page.screenshot({ path: `${OUT}/cl-final-thjonusta.png` });

// series picker hover interaction: hover row 3 ("Fólk"), screenshot before/after
await page.evaluate(() => document.querySelector('.cl-safn')?.scrollIntoView({ block: 'start' }));
await new Promise(r => setTimeout(r, 700));
await page.screenshot({ path: `${OUT}/cl-final-safn-before-hover.png` });
const rows = await page.$$('.cl-series-row');
const box = await rows[2].boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: `${OUT}/cl-final-safn-hover.png` });
const rowTransform = await page.evaluate(() => {
  const inner = document.querySelectorAll('.cl-series-row-inner')[2];
  return getComputedStyle(inner).transform;
});
console.log('hovered row-3 inner transform (should show translateX ~18px, i.e. matrix with e=18):', rowTransform);

console.log('errors:', errors.length ? errors.join('\n') : '(none)');
await browser.close();
console.log('done');
