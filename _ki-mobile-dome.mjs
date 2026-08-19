import puppeteer from 'puppeteer-core';

const URL = 'http://localhost:5344/preview/katrinisfeld';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/review-katrinisfeld',
  args: ['--window-size=1440,900'],
});

// --- dome word-spread check: capture x-transform of word spans mid-scrub ---
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 300));
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  // dome is roughly mid-page; step toward it gradually so scrub has scroll delta to react to
  for (let i = 0; i < 45; i++) {
    await page.mouse.wheel({ deltaY: totalHeight / 90 });
    await new Promise((r) => setTimeout(r, 40));
  }
  await new Promise((r) => setTimeout(r, 300));
  const info = await page.evaluate(() => {
    const words = Array.from(document.querySelectorAll('.ki-dome-title > span'));
    return {
      y: window.scrollY,
      transforms: words.map((w) => getComputedStyle(w).transform),
      domeVisible: !!document.querySelector('.ki-dome-arch'),
    };
  });
  console.log('dome word transforms mid-scroll:', JSON.stringify(info, null, 2));
  await page.screenshot({ path: '/Users/sindri/Documents/Website redesign mockups/_solo-wt/_ki-dome-mid.png' });
  await page.close();
}

// --- mobile viewport full check ---
{
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 300));
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    await page.mouse.wheel({ deltaY: totalHeight / steps });
    await new Promise((r) => setTimeout(r, 50));
  }
  await new Promise((r) => setTimeout(r, 500));
  const reveal = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('.ki-rv, .ki-slide, .ki-shutter'));
    return { total: all.length, notIn: all.filter(el => !el.classList.contains('is-in')).map(el => el.className) };
  });
  console.log('mobile reveal completeness:', JSON.stringify(reveal));
  await page.screenshot({ path: '/Users/sindri/Documents/Website redesign mockups/_solo-wt/_ki-mobile-full.png', fullPage: true });
  await page.close();
}

await browser.close();
console.log('done');
