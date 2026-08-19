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

// ---- TEST A: fresh load, force loader, wait it out, then slow scroll ----
console.log('=== TEST A: loader + slow scroll + nav theming + reveal check ===');
{
  const page = await freshPage();
  await page.goto(URL + '?loader=1', { waitUntil: 'networkidle0', timeout: 30000 });
  const loaderSeen = await page.evaluate(() => !!document.querySelector('.ki-loader'));
  console.log('loader mounted on forced load:', loaderSeen);
  // wait for loader to fully leave (up to 5s)
  await page.waitForFunction(() => !document.querySelector('.ki-loader'), { timeout: 6000 }).catch(() => console.log('!! loader never removed from DOM'));

  const transitions = [];
  let lastOn = null;
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    await page.mouse.wheel({ deltaY: totalHeight / steps });
    await new Promise((r) => setTimeout(r, 90));
    const state = await page.evaluate(() => {
      const mark = document.querySelector('.ki-nav-mark');
      const link = document.querySelector('.ki-nav-links a');
      const cta = document.querySelector('.ki-nav-cta');
      return {
        y: window.scrollY,
        mark: mark?.dataset.kiOn, link: link?.dataset.kiOn, cta: cta?.dataset.kiOn,
      };
    });
    const on = `${state.mark}/${state.link}/${state.cta}`;
    if (on !== lastOn) { transitions.push({ y: Math.round(state.y), on }); lastOn = on; }
  }
  console.log('nav theme transitions (slow scroll):', JSON.stringify(transitions, null, 2));

  // check all chrome elements share the SAME theme at all times (mark/link/cta should usually match unless mid-transition boundary differs per element position — that's expected/correct per spec since each themes by its OWN centre)
  const revealCheck = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('.ki-rv, .ki-slide, .ki-shutter'));
    const notIn = all.filter((el) => !el.classList.contains('is-in'));
    return { total: all.length, notInCount: notIn.length, notInSelectors: notIn.map(el => el.className).slice(0, 20) };
  });
  console.log('reveal check after full scroll:', JSON.stringify(revealCheck));

  await page.screenshot({ path: '/Users/sindri/Documents/Website redesign mockups/_solo-wt/_ki-after-scroll-full.png', fullPage: true });
  console.log('console/page errors:', page._errors);
  await page.close();
}

// ---- TEST B: fast scroll flicker check ----
console.log('=== TEST B: fast scroll flicker/lag check ===');
{
  const page = await freshPage();
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 }); // sessionStorage already seen=1 in this profile from Test A -> no loader
  await new Promise((r) => setTimeout(r, 300));
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const samples = [];
  // many quick, large wheel events
  for (let i = 0; i < 25; i++) {
    await page.mouse.wheel({ deltaY: totalHeight / 12 });
    const state = await page.evaluate(() => {
      const mark = document.querySelector('.ki-nav-mark');
      return { y: Math.round(window.scrollY), on: mark?.dataset.kiOn };
    });
    samples.push(state);
    await new Promise((r) => setTimeout(r, 16));
  }
  // let it settle then check final state is correct for wherever it landed (bottom = contact section = dark)
  await new Promise((r) => setTimeout(r, 1200));
  const final = await page.evaluate(() => {
    const mark = document.querySelector('.ki-nav-mark');
    const bandAtCentre = (() => {
      const bands = Array.from(document.querySelectorAll('[data-ki-band]'));
      const r = mark.getBoundingClientRect();
      const cy = window.scrollY + r.top + r.height / 2;
      for (const b of bands) {
        const br = b.getBoundingClientRect();
        const top = br.top + window.scrollY, bottom = br.bottom + window.scrollY;
        if (cy >= top && cy < bottom) return b.dataset.kiBand;
      }
      return null;
    })();
    return { y: Math.round(window.scrollY), maxY: document.body.scrollHeight, on: mark?.dataset.kiOn, expectedBand: bandAtCentre };
  });
  console.log('fast-scroll samples:', JSON.stringify(samples));
  console.log('final state after fast scroll settle:', JSON.stringify(final));
  console.log('console/page errors:', page._errors);
  await page.close();
}

// ---- TEST C: reduced motion ----
console.log('=== TEST C: reduced motion ===');
{
  const page = await freshPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(URL + '?loader=1', { waitUntil: 'networkidle0', timeout: 30000 }); // even forced query, reduced() should override
  await new Promise((r) => setTimeout(r, 800));
  const state = await page.evaluate(() => {
    const root = document.querySelector('.ki-root');
    const loader = document.querySelector('.ki-loader');
    const rvEls = Array.from(document.querySelectorAll('.ki-rv, .ki-slide, .ki-shutter'));
    const bad = rvEls.filter((el) => {
      const cs = getComputedStyle(el);
      return cs.opacity !== '1';
    });
    return {
      hasStaticClass: root?.classList.contains('ki-static'),
      hasJsClass: root?.classList.contains('ki-js'),
      loaderPresent: !!loader,
      rvCount: rvEls.length,
      badOpacityCount: bad.length,
      badSample: bad.slice(0, 5).map(el => el.className),
    };
  });
  console.log('reduced-motion state:', JSON.stringify(state, null, 2));
  await page.screenshot({ path: '/Users/sindri/Documents/Website redesign mockups/_solo-wt/_ki-reduced-motion.png', fullPage: true });
  console.log('console/page errors:', page._errors);
  await page.close();
}

await browser.close();
console.log('DONE');
