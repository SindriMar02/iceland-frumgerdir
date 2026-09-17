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
const box = await row.boundingBox();
// dispatch a native PointerEvent manually
const result = await page.evaluate((x,y) => {
  const el = document.elementFromPoint(x,y);
  const ev = new PointerEvent('pointerover', {bubbles:true, clientX:x, clientY:y, pointerType:'mouse'});
  el.dispatchEvent(ev);
  const ev2 = new PointerEvent('pointermove', {bubbles:true, clientX:x, clientY:y, pointerType:'mouse'});
  el.dispatchEvent(ev2);
  return el.outerHTML.slice(0,200);
}, box.x+box.width/2, box.y+box.height/2);
console.log('target el:', result);
await wait(500);
const state = await page.evaluate(() => {
  const fig = document.querySelector('.ki-peek');
  return { hasOn: fig ? ('on' in fig.dataset) : null, html: fig ? fig.outerHTML.slice(0,300): null };
});
console.log(JSON.stringify(state));
await br.close();
