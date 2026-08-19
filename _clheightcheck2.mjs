import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d8d1af4d-f44e-4394-8cb3-37e1bdebce71/scratchpad';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', userDataDir: '/tmp/review-chrislund', args: ['--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:5344/preview/chrislund', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 600));
await page.evaluate(() => document.querySelector('.cl-thjonusta')?.scrollIntoView({ block: 'start' }));
await new Promise(r => setTimeout(r, 900));
await page.screenshot({ path: `${OUT}/cl-thjonusta-alignstart.png` });
const h = await page.evaluate(() => {
  const copy = document.querySelector('.cl-thjonusta-copy').getBoundingClientRect();
  const fig = document.querySelector('.cl-thjonusta-fig').getBoundingClientRect();
  return { copyTop: copy.top, figTop: fig.top, copyHeight: copy.height, figHeight: fig.height };
});
console.log(JSON.stringify(h));
await browser.close();
