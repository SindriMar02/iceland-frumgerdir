import puppeteer from 'puppeteer-core';

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-desktop-designer';
const BASE = 'http://localhost:8963';
const wait = (ms) => new Promise(r => setTimeout(r, ms));

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

async function shot(name, clip) {
  await page.screenshot({ path: `${OUT}/${name}.png`, clip });
}
async function clickAria(label) {
  const [h] = await page.$x ? [] : [];
  const btn = await page.evaluateHandle((l) => {
    return Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label') === l);
  }, label);
  const el = btn.asElement();
  if (el) await el.click();
  return el;
}
async function hoverSel(sel) {
  const el = await page.$(sel);
  if (el) { await el.hover(); return true; }
  return false;
}

// === HOME ===
await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
await wait(1600);
await shot('01-home-slide1', { x: 0, y: 0, width: 1440, height: 900 });

// slide 3 (dots)
await clickAria('Mynd 3 af 7');
await wait(700);
await shot('02-home-slide3', { x: 0, y: 0, width: 1440, height: 900 });

await clickAria('Mynd 5 af 7');
await wait(700);
await shot('03-home-slide5', { x: 0, y: 0, width: 1440, height: 900 });

// info popover "i"
await clickAria('Um myndina');
await wait(400);
await shot('04-home-info-popover', { x: 0, y: 600, width: 900, height: 300 });
await clickAria('Loka');
await wait(300);

// back to slide 1
await clickAria('Mynd 1 af 7');
await wait(700);

// hover nav link "Verkefni"
await page.hover('nav a::-p-text(Verkefni)').catch(()=>{});
const navHandle = await page.evaluateHandle(() => Array.from(document.querySelectorAll('header a')).find(a => a.textContent.includes('Verkefni') && !a.textContent.includes('Ítalskar')));
if (navHandle.asElement()) { await navHandle.asElement().hover(); await wait(350); }
await shot('05-nav-hover-verkefni', { x: 0, y: 0, width: 1440, height: 90 });

// hover "Hafa samband" text CTA in hero
const ctaHandle = await page.evaluateHandle(() => Array.from(document.querySelectorAll('a')).find(a => a.className.includes('ki-cta') && a.textContent.includes('Hafa samband')));
if (ctaHandle.asElement()) { await ctaHandle.asElement().hover(); await wait(350); }
await shot('06-hero-textcta-hover', { x: 400, y: 480, width: 700, height: 200 });

// hover pill button "Verkefnin"
const pillHandle = await page.evaluateHandle(() => document.querySelector('a.ki-fill'));
if (pillHandle.asElement()) { await pillHandle.asElement().hover(); await wait(350); }
await shot('07-pill-hover', { x: 450, y: 480, width: 500, height: 200 });

// hover newest project card
const newestHandle = await page.evaluateHandle(() => document.querySelector('a.ki-newest'));
if (newestHandle.asElement()) { await newestHandle.asElement().hover(); await wait(350); }
await shot('08-newest-card-hover', { x: 950, y: 650, width: 490, height: 220 });

// === SCROLL FULL HOME ===
const sections = [900, 1800, 2700, 3600, 4500, 5400, 6300, 7200];
let idx = 9;
for (const y of sections) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await wait(250);
  await shot(`${idx}-scroll-y${y}`, { x: 0, y: 0, width: 1440, height: 900 });
  idx++;
}

// find register list rows and hover to trigger cursor-follow preview
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
console.log('page height', pageHeight);

// try hover on a register row (Skráin öll) — search text
const registerRow = await page.evaluateHandle(() => {
  const rows = Array.from(document.querySelectorAll('a'));
  return rows.find(a => /Heimili$/.test(a.textContent.trim()) === false && a.textContent.includes('01Heimili'));
});
if (registerRow.asElement()) {
  const box = await registerRow.asElement().boundingBox();
  if (box) {
    await page.evaluate((yy) => window.scrollTo({top: yy, behavior:'instant'}), Math.max(0, box.y - 300));
    await wait(300);
    await page.mouse.move(box.x + box.width/2, 380);
    await wait(200);
    await page.mouse.move(box.x + 100, 400);
    await wait(400);
    await shot('20-register-hover-preview', { x: 0, y: 0, width: 1440, height: 900 });
  }
}

// card hover (project grid card)
const cardHandle = await page.evaluateHandle(() => document.querySelector('a.ki-card-link'));
if (cardHandle.asElement()) {
  await page.evaluate((el) => el.scrollIntoView({block:'center'}), cardHandle);
  await wait(300);
  await cardHandle.asElement().hover();
  await wait(350);
  const box = await cardHandle.asElement().boundingBox();
  await shot('21-card-hover', { x: Math.max(0,box.x-50), y: Math.max(0,box.y-50), width: Math.min(1440,box.width+300), height: Math.min(800,box.height+150) });
}

// === click a card to confirm navigation ===
await cardHandle.asElement().click();
await wait(1200);
const url1 = page.url();
console.log('navigated to', url1);
await shot('22-project-page-top', { x: 0, y: 0, width: 1440, height: 900 });
await page.evaluate(() => window.scrollTo({top: 900, behavior:'instant'}));
await wait(300);
await shot('23-project-page-mid', { x: 0, y: 0, width: 1440, height: 900 });
await page.evaluate(() => window.scrollTo({top: 1800, behavior:'instant'}));
await wait(300);
await shot('24-project-page-mid2', { x: 0, y: 0, width: 1440, height: 900 });

await br.close();
console.log('DONE');
