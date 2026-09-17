import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-desktop-designer';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' });
await new Promise(r=>setTimeout(r,1600));
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
// scroll with wheel only, to the register section (~ y 8900 per earlier full-scroll target that had 'Skráin öll' visible around M9000ish... let's binary search)
let cur=0;
for (let i=0;i<11;i++){ await page.mouse.wheel({deltaY:900}); await wait(150); cur+=900; }
await wait(400);
await page.screenshot({path:`${OUT}/27-find-register.png`});
const box = await page.evaluate(() => {
  const row = document.querySelector('a[data-preview]');
  const r = row.getBoundingClientRect();
  return {x:r.x, y:r.y, w:r.width, h:r.height, vh: window.innerHeight};
});
console.log(box);
if (box.y > 0 && box.y < 900) {
  await page.mouse.move(box.x+box.w/2, box.y+box.h/2, {steps:8});
  await wait(500);
  await page.screenshot({path:`${OUT}/28-register-hover-real.png`});
}
await br.close();
