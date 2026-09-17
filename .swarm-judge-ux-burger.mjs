import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-ux';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width:1440, height:900, deviceScaleFactor:1 });
await page.goto('http://localhost:8963/', { waitUntil:'networkidle0' });
await new Promise(r=>setTimeout(r,1500));
await page.evaluate(()=>window.scrollTo({top:1500, behavior:'instant'}));
await new Promise(r=>setTimeout(r,400));
const burgerBox = await page.evaluate(()=>{
  const btn = document.querySelector('header.ki-nav button, header.ki-nav [role="button"]');
  const r = btn?.getBoundingClientRect();
  return r ? {x:r.x,y:r.y,w:r.width,h:r.height, label: btn.getAttribute('aria-label')} : null;
});
console.log('burgerBox', JSON.stringify(burgerBox));
if (burgerBox) {
  await page.mouse.click(burgerBox.x + burgerBox.w/2, burgerBox.y + burgerBox.h/2);
  await new Promise(r=>setTimeout(r,500));
  await page.screenshot({ path: `${OUT}/24-desktop-burger-open.png` });
}
await page.close();
await br.close();
