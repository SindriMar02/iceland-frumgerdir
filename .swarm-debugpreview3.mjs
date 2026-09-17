import puppeteer from 'puppeteer-core';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' });
await new Promise(r=>setTimeout(r,1600));
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
const row = await page.$('a[data-preview]');
await page.evaluate((el)=> el.scrollIntoView({block:'center'}), row);
await wait(300);
const result = await page.evaluate((el) => {
  const r = el.getBoundingClientRect();
  const x = r.x + r.width/2, y = r.y + r.height/2;
  el.dispatchEvent(new PointerEvent('pointerover', {bubbles:true, clientX:x, clientY:y, pointerType:'mouse'}));
  el.dispatchEvent(new PointerEvent('pointermove', {bubbles:true, clientX:x, clientY:y, pointerType:'mouse'}));
  return {x,y};
}, row);
console.log(result);
await wait(500);
const state = await page.evaluate(() => {
  const fig = document.querySelector('.ki-peek');
  return { hasOn: fig ? ('on' in fig.dataset) : null, html: fig ? fig.outerHTML.slice(0,300): null };
});
console.log(JSON.stringify(state));
await br.close();
