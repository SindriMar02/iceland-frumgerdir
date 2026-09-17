import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-desktop-designer';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' });
await new Promise(r=>setTimeout(r,1600));
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
const targets = [6300,7650,9000,10350,11700];
let cur = 0;
for (const t of targets) {
  const delta = t - cur;
  const steps = Math.ceil(delta/900);
  for (let s=0;s<steps;s++){ await page.mouse.wheel({deltaY: delta/steps}); await wait(200); }
  await wait(400);
  cur = t;
  const y = await page.evaluate(()=> window.scrollY);
  await page.screenshot({path:`${OUT}/M${t}-scroll.png`});
  console.log('target',t,'actual y',y);
}
await br.close();
