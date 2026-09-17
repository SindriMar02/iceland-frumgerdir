import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-ux';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width:1440, height:900, deviceScaleFactor:1 });
await page.goto('http://localhost:8963/', { waitUntil:'networkidle0' });
await new Promise(r=>setTimeout(r,1500));
await page.evaluate(()=>window.scrollTo({top:1500, behavior:'instant'}));
await new Promise(r=>setTimeout(r,400));
// check tabindex / focusability of the (invisible) nav links
const info = await page.evaluate(()=>{
  const links = document.querySelectorAll('.ki-nav-links a');
  return Array.from(links).map(a => ({text:a.textContent.trim().slice(0,20), tabIndex:a.tabIndex, ariaHidden: a.closest('[aria-hidden="true"]') ? true : false}));
});
console.log(JSON.stringify(info));
// tab from body and see where focus lands, does it visit invisible links
await page.evaluate(()=> document.activeElement.blur());
await page.keyboard.press('Tab');
for (let i=0;i<3;i++){
  const active = await page.evaluate(()=>({tag:document.activeElement.tagName, text:document.activeElement.textContent?.trim().slice(0,30), opacity:getComputedStyle(document.activeElement).opacity}));
  console.log('tab'+i, JSON.stringify(active));
  await page.keyboard.press('Tab');
}
await page.close();
await br.close();
