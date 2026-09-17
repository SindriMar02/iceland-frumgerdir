import puppeteer from 'puppeteer-core';

const BASE = 'http://localhost:8963';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-mobile-browser';
const log = (...a) => console.log(...a);

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });

async function shot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  log('shot:', name);
}

// 1. Home load
await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1500));
await shot('01-home');

// Measure tap targets: burger, pill button, i popover, newest project pill
const targets = await page.evaluate(() => {
  function rectOf(el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) };
  }
  const all = Array.from(document.querySelectorAll('button, a, [role="button"]'));
  return all.slice(0, 40).map(el => ({
    tag: el.tagName, text: (el.textContent||'').trim().slice(0,40),
    cls: el.className && typeof el.className === 'string' ? el.className.slice(0,60) : '',
    rect: rectOf(el)
  }));
});
console.log('TARGETS_JSON=' + JSON.stringify(targets));

// 2. Try swipe on slideshow via touch events
async function touchSwipe(x1, y1, x2, y2) {
  await page.touchscreen.touchStart(x1, y1);
  await new Promise(r => setTimeout(r, 50));
  await page.touchscreen.touchMove(x2, y2);
  await new Promise(r => setTimeout(r, 50));
  await page.touchscreen.touchEnd();
}

// find slide indicator/current image src before swipe
const beforeSwipe = await page.evaluate(() => {
  const img = document.querySelector('img');
  return img ? img.currentSrc || img.src : null;
});
await touchSwipe(340, 400, 40, 400);
await new Promise(r => setTimeout(r, 900));
await shot('02-after-swipe');
const afterSwipe = await page.evaluate(() => {
  const img = document.querySelector('img');
  return img ? img.currentSrc || img.src : null;
});
console.log('SWIPE_BEFORE=' + beforeSwipe);
console.log('SWIPE_AFTER=' + afterSwipe);
console.log('SWIPE_CHANGED=' + (beforeSwipe !== afterSwipe));

// 3. "i" info popover
const iBtn = await page.evaluateHandle(() => {
  const els = Array.from(document.querySelectorAll('button, a, span, div'));
  return els.find(el => el.textContent && el.textContent.trim() === 'i' && el.getBoundingClientRect().width < 60 && el.getBoundingClientRect().width > 0);
});
if (iBtn && iBtn.asElement()) {
  const box = await iBtn.asElement().boundingBox();
  console.log('I_BUTTON_BOX=' + JSON.stringify(box));
  await iBtn.asElement().click();
  await new Promise(r => setTimeout(r, 500));
  await shot('03-i-popover');
} else {
  console.log('I_BUTTON_NOT_FOUND');
}

// close popover if open by pressing escape / clicking elsewhere
await page.keyboard.press('Escape').catch(()=>{});
await new Promise(r => setTimeout(r, 300));

// 4. Burger menu
await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1200));
const burger = await page.evaluateHandle(() => {
  const cands = Array.from(document.querySelectorAll('button, a, [role="button"]'));
  return cands.find(el => {
    const al = (el.getAttribute('aria-label')||'').toLowerCase();
    const cls = (el.className||'').toString().toLowerCase();
    return al.includes('menu') || al.includes('valm') || cls.includes('burger') || cls.includes('menu-toggle') || cls.includes('hamburger');
  });
});
if (burger && burger.asElement()) {
  const box = await burger.asElement().boundingBox();
  console.log('BURGER_BOX=' + JSON.stringify(box));
  await burger.asElement().click();
  await new Promise(r => setTimeout(r, 600));
  await shot('04-menu-open');
} else {
  console.log('BURGER_NOT_FOUND');
}

// try clicking a link to verkefni within menu (must be visible, non-zero size)
const verkefniLink = await page.evaluateHandle(() => {
  const links = Array.from(document.querySelectorAll('a[href="/verkefni"]'));
  return links.find(a => {
    const r = a.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
});
if (verkefniLink && verkefniLink.asElement()) {
  await verkefniLink.asElement().click();
  await new Promise(r => setTimeout(r, 1200));
  console.log('NAV_AFTER_MENU_CLICK=' + page.url());
  await shot('05-verkefni-page');
} else {
  console.log('VERKEFNI_LINK_NOT_FOUND_IN_MENU');
}

// 5. Card click test across home, /verkefni, category page
async function testCards(url, label, count) {
  await page.goto(BASE + url, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const cardInfo = await page.evaluate((n) => {
    // real project cards use the ki-card-link class; other a[href^=/verkefni/] are nav/footer duplicates
    const anchors = Array.from(document.querySelectorAll('a.ki-card-link'));
    return anchors.slice(0, n).map(a => {
      const r = a.getBoundingClientRect();
      return { href: a.getAttribute('href'), rect: { w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.y) } };
    });
  }, count);
  console.log(`CARDS_${label}=` + JSON.stringify(cardInfo));

  const results = [];
  for (let i = 0; i < cardInfo.length; i++) {
    await page.goto(BASE + url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 900));
    const anchors = await page.$$('a.ki-card-link');
    if (!anchors[i]) continue;
    await anchors[i].evaluate(el => el.scrollIntoView({ block: 'center' }));
    await new Promise(r => setTimeout(r, 300));
    await anchors[i].click({ delay: 30 }).catch(async () => {
      await anchors[i].evaluate(el => el.click());
    });
    await new Promise(r => setTimeout(r, 900));
    const newUrl = page.url();
    results.push({ index: i, href: cardInfo[i].href, landedOn: newUrl, opened: newUrl.includes(cardInfo[i].href) });
  }
  console.log(`CARD_CLICK_RESULTS_${label}=` + JSON.stringify(results));
  await shot(`06-cards-${label}`);
}

await testCards('/', 'home', 3);
await testCards('/verkefni', 'verkefni', 3);
await testCards('/verkefni/innanhusshonnun', 'category', 2);

// 6. Project page bottom -> next project
await page.goto(BASE + '/verkefni/fjallalind', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1200));
// scroll to bottom in steps
const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < scrollHeight; y += 800) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await new Promise(r => setTimeout(r, 150));
}
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
await new Promise(r => setTimeout(r, 400));
await shot('07-project-bottom');

const nextLink = await page.evaluateHandle(() => {
  const anchors = Array.from(document.querySelectorAll('a[href^="/verkefni/"]'));
  // pick last one in DOM (likely "next project" link at bottom)
  return anchors[anchors.length - 1];
});
if (nextLink && nextLink.asElement()) {
  const href = await nextLink.asElement().evaluate(el => el.getAttribute('href'));
  const box = await nextLink.asElement().boundingBox();
  console.log('NEXT_PROJECT_HREF=' + href);
  console.log('NEXT_PROJECT_BOX=' + JSON.stringify(box));
  await nextLink.asElement().click();
  await new Promise(r => setTimeout(r, 1000));
  console.log('NEXT_PROJECT_LANDED=' + page.url());
  await shot('08-next-project');
} else {
  console.log('NEXT_PROJECT_LINK_NOT_FOUND');
}

await br.close();
