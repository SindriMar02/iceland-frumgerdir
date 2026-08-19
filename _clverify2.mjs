import puppeteer from 'puppeteer-core';

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d8d1af4d-f44e-4394-8cb3-37e1bdebce71/scratchpad';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/review-chrislund',
  args: ['--window-size=1440,900'],
});

// ---- TEST 4: wall pin regression check (desktop) ----
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto('http://localhost:5344/preview/chrislund', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 600));
  const geo = await page.evaluate(() => {
    const wall = document.querySelector('.cl-wall');
    const track = document.querySelector('.cl-wall-track');
    const rect = wall.getBoundingClientRect();
    return { wallTop: rect.top + window.scrollY, maxX: track.scrollWidth - window.innerWidth };
  });
  const progressAt = async (frac) => {
    await page.evaluate((y) => window.scrollTo(0, y), geo.wallTop + geo.maxX * frac);
    await new Promise(r => setTimeout(r, 200));
    return page.evaluate(() => getComputedStyle(document.querySelector('.cl-wall-progress')).transform);
  };
  console.log('TEST4 progress @0%:', await progressAt(0));
  console.log('TEST4 progress @50%:', await progressAt(0.5));
  console.log('TEST4 progress @100%:', await progressAt(1.0));
  await new Promise(r => setTimeout(r, 1200));
  const vitniOpacity = await page.evaluate(() => getComputedStyle(document.querySelector('.cl-vitni-title .cl-word')).opacity);
  console.log('TEST4 VITNI opacity at pin end (should be ~1):', vitniOpacity);
  console.log('TEST4 errors:', errors.length ? errors.join('\n') : '(none)');
  await page.close();
}

// ---- TEST 5: reduced motion regression check ----
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:5344/preview/chrislund', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 500));
  const rootClass = await page.$eval('.cl-root', el => el.className);
  const rvStates = await page.$$eval('.cl-rv', els => els.map(e => getComputedStyle(e).opacity));
  const allOne = rvStates.every(o => o === '1');
  const nums = await page.$$eval('.cl-edit-n', els => els.map(e => e.textContent));
  console.log('\nTEST5 reduced-motion root class:', rootClass, ' all .cl-rv opacity=1:', allOne, ' edit nums (should be 130/12 static):', nums);
  console.log('TEST5 errors:', errors.length ? errors.join('\n') : '(none)');
  await page.close();
}

// ---- TEST 6: mobile nav-overlap fix (scroll-margin-top) ----
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5344/preview/chrislund', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => document.getElementById('thjonusta')?.scrollIntoView({ behavior: 'auto', block: 'start' }));
  await new Promise(r => setTimeout(r, 400));
  const rects = await page.evaluate(() => {
    const navMark = document.querySelector('.cl-nav-mark').getBoundingClientRect();
    const specs = [...document.querySelectorAll('.cl-bok-specs dd')];
    const lastSpec = specs[specs.length - 1];
    const lastSpecRect = lastSpec ? lastSpec.getBoundingClientRect() : null;
    const overlap = lastSpecRect && !(lastSpecRect.bottom < navMark.top || lastSpecRect.top > navMark.bottom);
    return {
      navMark: { top: navMark.top, bottom: navMark.bottom },
      lastSpecRect: lastSpecRect && { top: lastSpecRect.top, bottom: lastSpecRect.bottom, text: lastSpec.textContent },
      overlap,
    };
  });
  console.log('\nTEST6 mobile nav-overlap check (overlap should now be false):', JSON.stringify(rects));
  await page.screenshot({ path: `${OUT}/cl-verify-nav-thjonusta.png`, clip: { x: 0, y: 0, width: 390, height: 100 } });
  await page.close();
}

await browser.close();
console.log('\ndone');
