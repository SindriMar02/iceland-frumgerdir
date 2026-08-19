import puppeteer from 'puppeteer-core';

const URL = 'http://localhost:5344/preview/katrinisfeld';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/review-katrinisfeld',
  args: ['--window-size=1440,900'],
});

async function freshPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  page.on('requestfailed', (r) => errors.push('REQFAIL: ' + r.url()));
  page._errors = errors;
  return page;
}

console.log('=== A: structural + grid + meta checks ===');
{
  const page = await freshPage();
  await page.goto(URL + '?loader=1', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForFunction(() => !document.querySelector('.ki-loader'), { timeout: 6000 }).catch(() => console.log('!! loader never removed'));

  const info = await page.evaluate(() => {
    const clusters = Array.from(document.querySelectorAll('.ki-yfirlit-cluster')).map((c) => {
      const grid = c.querySelector('.ki-yfirlit-grid');
      return {
        cat: c.querySelector('.ki-yfirlit-cat')?.textContent,
        cols: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
        cards: grid.querySelectorAll('.ki-verk-card').length,
      };
    });
    const meta = document.querySelector('meta[name="description"]')?.content;
    const sections = Array.from(document.querySelectorAll('[data-ki-band]')).map(s => s.id || s.className.split(' ')[0]);
    const domeWords = document.querySelectorAll('.ki-dome-title > span').length;
    return { clusters, meta, sections, domeWords, title: document.title };
  });
  console.log(JSON.stringify(info, null, 2));
  console.log('errors:', page._errors);
  await page.screenshot({ path: '/Users/sindri/Documents/Website redesign mockups/_solo-wt/_ki-hero.png' });
  await page.close();
}

console.log('=== B: full slow scroll — nav theming + reveal completeness ===');
{
  const page = await freshPage();
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 300));
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const transitions = [];
  let lastOn = null;
  const steps = 50;
  for (let i = 0; i <= steps; i++) {
    await page.mouse.wheel({ deltaY: totalHeight / steps });
    await new Promise((r) => setTimeout(r, 80));
    const state = await page.evaluate(() => {
      const mark = document.querySelector('.ki-nav-mark');
      return { y: Math.round(window.scrollY), on: mark?.dataset.kiOn };
    });
    if (state.on !== lastOn) { transitions.push(state); lastOn = state.on; }
  }
  console.log('nav transitions:', JSON.stringify(transitions));

  const reveal = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('.ki-rv, .ki-slide, .ki-shutter'));
    const notIn = all.filter((el) => !el.classList.contains('is-in'));
    return { total: all.length, notIn: notIn.map(el => el.className) };
  });
  console.log('reveal completeness:', JSON.stringify(reveal));
  await page.screenshot({ path: '/Users/sindri/Documents/Website redesign mockups/_solo-wt/_ki-full-scrolled.png', fullPage: true });
  console.log('errors:', page._errors);
  await page.close();
}

console.log('=== C: fast scroll flicker check ===');
{
  const page = await freshPage();
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 300));
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const samples = [];
  for (let i = 0; i < 25; i++) {
    await page.mouse.wheel({ deltaY: totalHeight / 12 });
    const state = await page.evaluate(() => ({ y: Math.round(window.scrollY), on: document.querySelector('.ki-nav-mark')?.dataset.kiOn }));
    samples.push(state);
    await new Promise((r) => setTimeout(r, 16));
  }
  await new Promise((r) => setTimeout(r, 1200));
  const final = await page.evaluate(() => {
    const mark = document.querySelector('.ki-nav-mark');
    const bands = Array.from(document.querySelectorAll('[data-ki-band]'));
    const r = mark.getBoundingClientRect();
    const cy = window.scrollY + r.top + r.height / 2;
    let expected = null;
    for (const b of bands) {
      const br = b.getBoundingClientRect();
      const top = br.top + window.scrollY, bottom = br.bottom + window.scrollY;
      if (cy >= top && cy < bottom) { expected = b.dataset.kiBand; break; }
    }
    return { y: Math.round(window.scrollY), on: mark?.dataset.kiOn, expected };
  });
  console.log('fast samples:', JSON.stringify(samples));
  console.log('final:', JSON.stringify(final));
  console.log('errors:', page._errors);
  await page.close();
}

console.log('=== D: reduced motion ===');
{
  const page = await freshPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(URL + '?loader=1', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  const state = await page.evaluate(() => {
    const root = document.querySelector('.ki-root');
    const rvEls = Array.from(document.querySelectorAll('.ki-rv, .ki-slide, .ki-shutter'));
    const bad = rvEls.filter((el) => getComputedStyle(el).opacity !== '1');
    return {
      static: root?.classList.contains('ki-static'),
      js: root?.classList.contains('ki-js'),
      loader: !!document.querySelector('.ki-loader'),
      rvCount: rvEls.length,
      bad: bad.map(el => el.className),
    };
  });
  console.log(JSON.stringify(state, null, 2));
  console.log('errors:', page._errors);
  await page.close();
}

await browser.close();
console.log('DONE');
