import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', userDataDir: '/tmp/review-chrislund', args: ['--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:5344/preview/chrislund', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 600));
const h = await page.evaluate(() => {
  const copy = document.querySelector('.cl-thjonusta-copy').getBoundingClientRect();
  const fig = document.querySelector('.cl-thjonusta-fig').getBoundingClientRect();
  const section = document.querySelector('.cl-thjonusta').getBoundingClientRect();
  return { copyHeight: copy.height, figHeight: fig.height, sectionHeight: section.height };
});
console.log(JSON.stringify(h, null, 2));
await browser.close();
