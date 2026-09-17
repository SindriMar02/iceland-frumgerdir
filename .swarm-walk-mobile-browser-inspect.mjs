import puppeteer from 'puppeteer-core';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
for (const url of ['/', '/verkefni', '/verkefni/innanhusshonnun']) {
  await page.goto('http://localhost:8963' + url, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const info = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href^="/verkefni/"]'));
    return anchors.map(a => {
      const r = a.getBoundingClientRect();
      const inNav = !!a.closest('nav, header, [class*="panel"], [class*="menu"]');
      return { href: a.getAttribute('href'), cls: a.className, w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.y), inNav };
    });
  });
  console.log(url, JSON.stringify(info));
}
await br.close();
