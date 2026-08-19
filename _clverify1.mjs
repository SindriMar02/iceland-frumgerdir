import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/review-chrislund',
  args: ['--window-size=1440,900'],
});

// ---- TEST 1: count-up no longer flashes 130->reset->count ----
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:5344/preview/chrislund', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 500));
  const before = await page.$$eval('.cl-edit-n', els => els.map(e => e.textContent));
  console.log('TEST1 before any scroll (should be 0/0 now, zeroed at mount):', before);
  await page.evaluate(() => document.querySelector('.cl-edit')?.scrollIntoView({ block: 'center' }));
  const samples = [];
  for (let i = 0; i < 18; i++) {
    const t = await page.$$eval('.cl-edit-n', els => els.map(e => e.textContent));
    samples.push(t.join('/'));
    await new Promise(r => setTimeout(r, 100));
  }
  console.log('TEST1 samples (should rise monotonically 0->130 / 0->12, no drop):');
  samples.forEach((s, i) => console.log(`  t=${i * 100}ms:`, s));
  console.log('TEST1 errors:', errors.length ? errors.join('\n') : '(none)');
  await page.close();
}

// ---- TEST 2: fast jump-scroll no longer strands .cl-rv elements ----
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:5344/preview/chrislund', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 500));
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  for (const frac of [0.2, 0.4, 0.6, 0.8, 1.0]) {
    await page.evaluate((y) => window.scrollTo(0, y), bodyHeight * frac);
    await new Promise(r => setTimeout(r, 60));
  }
  await new Promise(r => setTimeout(r, 600));
  const notRevealed = await page.$$eval('.cl-rv', els =>
    els.filter(e => !e.classList.contains('is-in')).map(e => e.className));
  console.log('\nTEST2 fast jump-scroll -- NOT revealed (should be empty now):', notRevealed);
  console.log('TEST2 errors:', errors.length ? errors.join('\n') : '(none)');
  await page.close();
}

// ---- TEST 3: mobile wall headlines now animate ----
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:5344/preview/chrislund', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 500));
  // check the words start hidden (before scrolled into view) -- proof the animation is wired now
  const beforeReveal = await page.evaluate(() => {
    const vitni = document.querySelector('.cl-vitni-title .cl-word');
    return vitni ? getComputedStyle(vitni).opacity : 'NOT FOUND';
  });
  console.log('\nTEST3 VITNI word opacity BEFORE scrolled into view on mobile (should be 0, proving animation is now wired):', beforeReveal);

  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let i = 0; i <= 30; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), (bodyHeight * i) / 30);
    await new Promise(r => setTimeout(r, 150));
  }
  await new Promise(r => setTimeout(r, 400));
  const afterReveal = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-cl-headline]').forEach((h) => {
      const words = [...h.querySelectorAll('.cl-word')];
      out.push({ text: h.getAttribute('aria-label'), opacities: words.map(w => getComputedStyle(w).opacity) });
    });
    return out;
  });
  console.log('TEST3 all headline word opacities after full scroll (should ALL be 1):', JSON.stringify(afterReveal));
  console.log('TEST3 errors:', errors.length ? errors.join('\n') : '(none)');
  await page.close();
}

await browser.close();
console.log('\ndone');
