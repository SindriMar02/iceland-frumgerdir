import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-ux';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width:1440, height:900, deviceScaleFactor:1 });
await page.goto('http://localhost:8963/studioid', { waitUntil:'networkidle0' });
await new Promise(r=>setTimeout(r,1200));
await page.screenshot({ path: `${OUT}/27-desktop-studioid.png` });
await page.evaluate(()=>window.scrollTo({top:1200, behavior:'instant'}));
await new Promise(r=>setTimeout(r,300));
await page.screenshot({ path: `${OUT}/28-desktop-studioid-scroll.png` });

// find "Skráin öll" register list item and hover
const listItems = await page.$$eval('a, li', els => els.map((e,i)=>({i,text:e.textContent?.trim().slice(0,40)})).filter(e=>e.text));
const regHit = listItems.find(x=>/skrá/i.test(x.text||''));
console.log('register search', JSON.stringify(regHit));
await page.close();
await br.close();
