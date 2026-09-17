import puppeteer from 'puppeteer-core';

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-ux';
const BASE = 'http://localhost:8963';

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot', name);
}

async function newPage(viewport) {
  const page = await br.newPage();
  await page.setViewport(viewport);
  return page;
}

const desktop = { width: 1440, height: 900, deviceScaleFactor: 1 };
const mobile = { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true };

// --- DESKTOP HOME ---
let page = await newPage(desktop);
await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1500));
await shot(page, '01-desktop-home');

// hover nav link
const navLinks = await page.$$('nav a, header a');
console.log('nav link count', navLinks.length);
if (navLinks.length) {
  await navLinks[0].hover();
  await new Promise(r => setTimeout(r, 300));
  await shot(page, '02-desktop-nav-hover');
}

// info popover "i"
// try generic search for element with text "i" small button near name
const infoCandidates = await page.$$eval('button, [role="button"], a', els => els.map((e,idx)=>({idx, text:e.textContent?.trim(), cls:e.className})).filter(e=>e.text && e.text.length<=2));
console.log('info candidates', JSON.stringify(infoCandidates).slice(0,500));

// click first candidate with text "i"
const iHandle = await page.evaluateHandle(() => {
  const els = Array.from(document.querySelectorAll('button, [role="button"], a, span'));
  return els.find(e => e.textContent && e.textContent.trim() === 'i' && e.offsetParent !== null);
});
if (iHandle && iHandle.asElement()) {
  await iHandle.asElement().click();
  await new Promise(r => setTimeout(r, 400));
  await shot(page, '03-desktop-info-popover');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 300));
  await shot(page, '04-desktop-info-popover-esc');
} else {
  console.log('NO info popover trigger found');
}

// keyboard tab through header/hero
await page.keyboard.press('Tab');
let tabShots = [];
for (let i=0;i<8;i++){
  await page.keyboard.press('Tab');
  await new Promise(r=>setTimeout(r,150));
}
await shot(page, '05-desktop-tab-8');
for (let i=0;i<4;i++){
  await page.keyboard.press('Tab');
  await new Promise(r=>setTimeout(r,150));
}
await shot(page, '06-desktop-tab-12');

// slideshow arrows
const arrowCandidates = await page.$$eval('button, [role="button"]', els => els.map((e,idx)=>({idx, aria:e.getAttribute('aria-label'), cls: e.className})).filter(e=>e.aria && /next|prev|arrow|slide/i.test(e.aria)));
console.log('arrow candidates', JSON.stringify(arrowCandidates).slice(0,500));

await page.close();

// --- DESKTOP /verkefni ---
page = await newPage(desktop);
await page.goto(BASE + '/verkefni', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1500));
await shot(page, '07-desktop-verkefni');
await page.evaluate(()=>window.scrollTo({top:800, behavior:'instant'}));
await new Promise(r=>setTimeout(r,300));
await shot(page, '08-desktop-verkefni-scroll');

// click a project card
const cardLink = await page.evaluateHandle(() => {
  const links = Array.from(document.querySelectorAll('a[href^="/verkefni/"]'));
  return links.find(a => a.offsetParent !== null);
});
let cardHref = null;
if (cardLink && cardLink.asElement()) {
  cardHref = await page.evaluate(el => el.getAttribute('href'), cardLink.asElement());
  await cardLink.asElement().click();
  await new Promise(r => setTimeout(r, 1200));
  console.log('after click url', page.url());
  await shot(page, '09-desktop-project-page');
} else {
  console.log('NO project card link found on /verkefni');
}
await page.close();

// --- DESKTOP one specific project ---
page = await newPage(desktop);
await page.goto(BASE + '/verkefni/fjallalind', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1500));
await shot(page, '10-desktop-fjallalind');
await page.evaluate(()=>window.scrollTo({top:1200, behavior:'instant'}));
await new Promise(r=>setTimeout(r,300));
await shot(page, '11-desktop-fjallalind-scroll');
await page.close();

// --- DESKTOP /hafa-samband ---
page = await newPage(desktop);
await page.goto(BASE + '/hafa-samband', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1200));
await shot(page, '12-desktop-hafa-samband');
await page.close();

// --- MOBILE HOME ---
page = await newPage(mobile);
await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1500));
await shot(page, '13-mobile-home');

// mobile burger menu
const burger = await page.evaluateHandle(() => {
  const els = Array.from(document.querySelectorAll('button, [role="button"]'));
  return els.find(e => /menu|burger/i.test(e.getAttribute('aria-label')||'') || /menu/i.test(e.className||''));
});
if (burger && burger.asElement()) {
  await burger.asElement().click();
  await new Promise(r=>setTimeout(r,400));
  await shot(page, '14-mobile-menu-open');
  await page.keyboard.press('Escape');
  await new Promise(r=>setTimeout(r,300));
  await shot(page, '15-mobile-menu-esc');
} else {
  console.log('NO mobile burger found');
}

// swipe slideshow
await page.touchscreen.touchStart(340, 400);
await page.touchscreen.touchMove(60, 400);
await page.touchscreen.touchEnd();
await new Promise(r=>setTimeout(r,500));
await shot(page, '16-mobile-swipe');
await page.close();

// --- MOBILE /verkefni ---
page = await newPage(mobile);
await page.goto(BASE + '/verkefni', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1200));
await shot(page, '17-mobile-verkefni');
await page.evaluate(()=>window.scrollTo({top:900, behavior:'instant'}));
await new Promise(r=>setTimeout(r,300));
await shot(page, '18-mobile-verkefni-scroll');
await page.close();

// --- MOBILE project page ---
page = await newPage(mobile);
await page.goto(BASE + '/verkefni/fjallalind', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1200));
await shot(page, '19-mobile-fjallalind');
await page.close();

// --- MOBILE /hafa-samband ---
page = await newPage(mobile);
await page.goto(BASE + '/hafa-samband', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1200));
await shot(page, '20-mobile-hafa-samband');
await page.close();

await br.close();
console.log('DONE');
