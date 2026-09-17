import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-desktop-hotel';
const wait = (ms) => new Promise(r => setTimeout(r, ms));

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' });
await wait(1500);

// click "i" info popover near slide caption (bottom-left)
const iInfo = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button'));
  const b = btns.find(b => b.textContent.trim() === 'i' && b.getBoundingClientRect().top > 700);
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return { x: r.x + r.width/2, y: r.y + r.height/2 };
});
console.log('iInfo coords', iInfo);
if (iInfo) {
  await page.mouse.click(iInfo.x, iInfo.y);
  await wait(500);
  await page.screenshot({ path: `${OUT}/02-hero-i-popover.png` });
  console.log('shot 02');
}

// click next arrow (bottom right, two round buttons)
const arrows = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button'));
  return btns.filter(b => b.getBoundingClientRect().top > 780 && b.getBoundingClientRect().left > 1250)
    .map(b => { const r = b.getBoundingClientRect(); return { x: r.x+r.width/2, y: r.y+r.height/2, label: b.getAttribute('aria-label') }; });
});
console.log('arrows', JSON.stringify(arrows));
if (arrows.length) {
  const next = arrows[arrows.length - 1];
  await page.mouse.click(next.x, next.y);
  await wait(700);
  await page.mouse.click(next.x, next.y);
  await wait(700);
  await page.screenshot({ path: `${OUT}/03-hero-after-next-arrows.png` });
  console.log('shot 03');
}

await br.close();
console.log('DONE3');
