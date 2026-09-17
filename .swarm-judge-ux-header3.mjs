import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-ux';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width:1440, height:900, deviceScaleFactor:1 });
await page.goto('http://localhost:8963/', { waitUntil:'networkidle0' });
await new Promise(r=>setTimeout(r,1500));

const pageHeight = await page.evaluate(()=>document.body.scrollHeight);
console.log('pageHeight', pageHeight);

for (const y of [0, 500, 1000, 1500, 2000, 2500, 3000, 3500]) {
  await page.evaluate((yy)=>window.scrollTo({top:yy, behavior:'instant'}), y);
  await new Promise(r=>setTimeout(r,300));
  const state = await page.evaluate(()=>{
    const header = document.querySelector('header.ki-nav');
    const links = document.querySelector('.ki-nav-links');
    const cs = header ? getComputedStyle(header) : null;
    const csl = links ? getComputedStyle(links) : null;
    const burger = document.querySelector('[class*="burger"], [class*="toggle"], [aria-label*="enu" i]');
    return {
      condensed: header?.getAttribute('data-ki-condensed'),
      tone: header?.getAttribute('data-ki-tone'),
      headerOpacity: cs?.opacity,
      headerBg: cs?.backgroundColor,
      linksOpacity: csl?.opacity,
      burgerFound: !!burger,
      burgerVisible: burger ? getComputedStyle(burger).opacity : null
    };
  });
  console.log('y='+y, JSON.stringify(state));
  await page.screenshot({ path: `${OUT}/23-full-y${y}.png` });
}
await page.close();
await br.close();
