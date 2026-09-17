import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-desktop-designer';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' });
await new Promise(r=>setTimeout(r,1600));
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
const row = await page.$('a[data-preview]');
await page.evaluate((el)=> el.scrollIntoView({block:'center'}), row);
await wait(500);
const box = await row.boundingBox();
await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
await wait(150);
await page.mouse.move(box.x + box.width/2 + 5, box.y + box.height/2 + 5);
await wait(400);
await page.screenshot({path:`${OUT}/25-register-preview-hover.png`});
// move down to another row to see preview follow
const rows = await page.$$('a[data-preview]');
if (rows[3]) {
  const box2 = await rows[3].boundingBox();
  await page.mouse.move(box2.x+box2.width/2, box2.y+box2.height/2, {steps: 10});
  await wait(400);
  await page.screenshot({path:`${OUT}/26-register-preview-hover2.png`});
}
await br.close();
