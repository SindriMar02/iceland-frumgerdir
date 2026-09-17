import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-desktop-designer';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' });
await new Promise(r=>setTimeout(r,1600));
const pill = await page.$('a.ki-fill');
const box = await pill.boundingBox();
await page.mouse.move(box.x+box.width/2, box.y+box.height/2);
for (const delay of [100,300,600,1000,1500]) {
  await new Promise(r=>setTimeout(r,delay===100?100:200));
  await page.screenshot({path: `${OUT}/07c-pill-t${delay}.png`, clip:{x:box.x-40,y:box.y-40,width:box.width+80,height:box.height+80}});
}
await br.close();
