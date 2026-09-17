import puppeteer from 'puppeteer-core';
const BASE = 'http://localhost:8963';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-mobile-browser';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1500));

// open i popover
const iBtn = await page.$('button.ki-show-i');
await iBtn.click();
await new Promise(r => setTimeout(r, 500));
const closeBtn = await page.$('button.ki-show-info-x');
const closeBox = closeBtn ? await closeBtn.boundingBox() : null;
console.log('CLOSE_BTN_BOX=' + JSON.stringify(closeBox));
const iBox = await iBtn.boundingBox();
console.log('I_BTN_BOX=' + JSON.stringify(iBox));

// burger real tappable box (button element incl any padding)
await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1200));
const burger = await page.$('button.ki-burger');
const burgerBox = await burger.boundingBox();
console.log('BURGER_BTN_BOX=' + JSON.stringify(burgerBox));

// pill "Verkefnin" button
const pill = await page.$('a.ki-fill');
const pillBox = pill ? await pill.boundingBox() : null;
console.log('PILL_BOX=' + JSON.stringify(pillBox));

// slideshow dots/pagination indicator check
const dots = await page.evaluate(() => {
  const candidates = Array.from(document.querySelectorAll('[class*="dot"], [class*="pagin"], [class*="indicator"]'));
  return candidates.map(c => c.className);
});
console.log('DOTS_INDICATORS=' + JSON.stringify(dots));

await br.close();
