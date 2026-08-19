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

const g = await page.evaluate(() => {
  const nav = document.querySelector('.ki-nav');
  const headline = document.querySelector('.ki-samband-in .ki-headline');
  const foot = document.querySelector('.ki-foot');
  const previewFooter = document.body.lastElementChild; // whatever renders after .ki-foot inside ki-root wrapper
  const hr = headline.getBoundingClientRect();
  const nr = nav.getBoundingClientRect();
  return {
    navHeight: Math.round(nr.height),
    headlineTop: Math.round(hr.top + window.scrollY),
    headlineHeight: Math.round(hr.height),
    docHeight: document.body.scrollHeight,
    footTop: Math.round(foot.getBoundingClientRect().top + window.scrollY),
  };
});
console.log(JSON.stringify(g, null, 2));
const viewportH = 900;
const maxScroll = g.docHeight - viewportH;
const headlineViewportY = g.headlineTop - maxScroll;
console.log({ maxScroll, headlineViewportY, overlapPx: g.navHeight - headlineViewportY });
await browser.close();
