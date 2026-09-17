import puppeteer from 'puppeteer-core';

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-desktop-hotel';
const BASE = 'http://localhost:8963';

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const wait = (ms) => new Promise(r => setTimeout(r, ms));
async function shot(name) { await page.screenshot({ path: `${OUT}/${name}.png` }); console.log('shot', name); }
async function goto(path) { await page.goto(BASE + path, { waitUntil: 'networkidle0' }); await wait(1200); }

// navigate to Gistiheimili og hótel category (deep link, SPA fallback)
await goto('/verkefni/gistiheimili-og-hotel');
console.log('URL after category nav:', page.url());
await shot('05-hospitality-category-listing');

// open two hospitality projects
await goto('/verkefni/freyja-gistiheimili');
console.log('URL:', page.url());
await shot('06-freyja-gistiheimili');
await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
await wait(400);
await shot('07-freyja-gistiheimili-scroll');

await goto('/verkefni/hotel-hekla');
console.log('URL:', page.url());
await shot('08-hotel-hekla');
await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
await wait(400);
await shot('09-hotel-hekla-scroll');

// credentials / studioid
await goto('/studioid');
await shot('10-studioid-top');
await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
await wait(400);
await shot('11-studioid-scroll');

// contact
await goto('/hafa-samband');
await shot('12-hafa-samband');

// italian cabinetry
await goto('/italskar-innrettingar');
await shot('13-italskar-innrettingar-top');
await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
await wait(400);
await shot('14-italskar-innrettingar-scroll');

await br.close();
console.log('DONE');
