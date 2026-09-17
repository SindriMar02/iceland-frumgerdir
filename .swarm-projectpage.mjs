import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-desktop-designer';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:8963/verkefni/nybyggt-hus-i-suluhofda', { waitUntil: 'networkidle0' });
await new Promise(r=>setTimeout(r,1600));
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
await page.screenshot({path:`${OUT}/30-proj-top.png`});
for (let i=0;i<3;i++){ await page.mouse.wheel({deltaY:900}); await wait(400); }
await page.screenshot({path:`${OUT}/31-proj-scroll1.png`});
for (let i=0;i<3;i++){ await page.mouse.wheel({deltaY:900}); await wait(400); }
await page.screenshot({path:`${OUT}/32-proj-scroll2.png`});
for (let i=0;i<4;i++){ await page.mouse.wheel({deltaY:900}); await wait(400); }
await page.screenshot({path:`${OUT}/33-proj-scroll3.png`});
await br.close();
