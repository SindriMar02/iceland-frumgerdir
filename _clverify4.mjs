import puppeteer from 'puppeteer-core';

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d8d1af4d-f44e-4394-8cb3-37e1bdebce71/scratchpad';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/review-chrislund',
  args: ['--window-size=1440,900'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
await page.goto('http://localhost:5344/preview/chrislund', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 600));
await page.evaluate(() => document.querySelector('.cl-thjonusta-cta')?.scrollIntoView({ block: 'center' }));
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: `${OUT}/cl-final-thjonusta-cta.png` });
const ctaText = await page.$eval('.cl-thjonusta-cta', el => el.textContent);
const ctaHref = await page.$eval('.cl-thjonusta-cta', el => el.getAttribute('href'));
console.log('CTA text:', ctaText, ' href:', ctaHref);
await page.close();

// mobile full check
const mobPage = await browser.newPage();
await mobPage.setViewport({ width: 390, height: 844 });
await mobPage.goto('http://localhost:5344/preview/chrislund', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 600));
await mobPage.evaluate(() => document.querySelector('.cl-bridge')?.scrollIntoView({ block: 'start' }));
await new Promise(r => setTimeout(r, 2200));
await mobPage.screenshot({ path: `${OUT}/cl-final-mobile-bridge.png` });
await mobPage.evaluate(() => document.querySelector('.cl-thjonusta')?.scrollIntoView({ block: 'start' }));
await new Promise(r => setTimeout(r, 2200));
await mobPage.screenshot({ path: `${OUT}/cl-final-mobile-thjonusta.png` });
await mobPage.close();

await browser.close();
console.log('done');
