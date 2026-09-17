import puppeteer from 'puppeteer-core';

const BASE = 'http://localhost:8963';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-mobile-browser';

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });

async function shot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot:', name);
}

async function testCards(url, label, count) {
  await page.goto(BASE + url, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const cardInfo = await page.evaluate((n) => {
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
    await anchors[i].click({ delay: 30 });
    await new Promise(r => setTimeout(r, 900));
    const newUrl = page.url();
    results.push({ index: i, href: cardInfo[i].href, landedOn: newUrl, opened: newUrl.includes(cardInfo[i].href) });
  }
  console.log(`CARD_CLICK_RESULTS_${label}=` + JSON.stringify(results));
}

await testCards('/', 'home', 2);
await testCards('/verkefni', 'verkefni', 2);
await testCards('/verkefni/innanhusshonnun', 'category', 2);

// register list "Skráin öll" desktop hover preview test — check if it exists on mobile too / list link works
await page.goto(BASE + '/verkefni', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 900));
const registerRow = await page.$('a[href="/verkefni/fjallalind"]:not(.ki-card-link)');
if (registerRow) {
  const box = await registerRow.boundingBox();
  console.log('REGISTER_ROW_BOX=' + JSON.stringify(box));
  await registerRow.evaluate(el => el.scrollIntoView({ block: 'center' }));
  await new Promise(r => setTimeout(r, 200));
  await registerRow.click();
  await new Promise(r => setTimeout(r, 900));
  console.log('REGISTER_ROW_LANDED=' + page.url());
} else {
  console.log('REGISTER_ROW_NOT_FOUND');
}

// contact page tap target check
await page.goto(BASE + '/hafa-samband', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1000));
await shot('09-contact');

await br.close();
