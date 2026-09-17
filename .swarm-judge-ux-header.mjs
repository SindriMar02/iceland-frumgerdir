import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-ux';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width:1440, height:900, deviceScaleFactor:1 });
await page.goto('http://localhost:8963/', { waitUntil:'networkidle0' });
await new Promise(r=>setTimeout(r,1500));
await page.evaluate(()=>window.scrollTo({top:1400, behavior:'instant'}));
await new Promise(r=>setTimeout(r,400));
await page.screenshot({ path: `${OUT}/21-desktop-scrolled-header.png`, clip:{x:0,y:0,width:1440,height:120} });
// check computed header markup
const headerHTML = await page.evaluate(()=>{
  const h = document.querySelector('header, nav')?.closest('header') || document.querySelector('header');
  return h ? h.outerHTML.slice(0,1500) : 'NO HEADER FOUND';
});
console.log(headerHTML);
await page.close();
await br.close();
