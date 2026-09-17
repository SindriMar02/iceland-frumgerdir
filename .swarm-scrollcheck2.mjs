import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-desktop-designer';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' });
await new Promise(r=>setTimeout(r,1600));
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
for (let i=0;i<15;i++) {
  await page.mouse.wheel({deltaY: 900});
  await wait(450);
}
for (let i=0;i<8;i++) {
  await page.mouse.wheel({deltaY: 900});
  await wait(450);
  const y = await page.evaluate(()=> window.scrollY);
  console.log('y=',y);
  await page.screenshot({path:`${OUT}/T${i}-scroll.png`});
}
await br.close();
