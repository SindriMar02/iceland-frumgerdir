import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-ux';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width:1440, height:900, deviceScaleFactor:1 });
await page.goto('http://localhost:8963/', { waitUntil:'networkidle0' });
await new Promise(r=>setTimeout(r,1500));
for (const y of [900, 1300, 1700, 2100]) {
  await page.evaluate((yy)=>window.scrollTo({top:yy, behavior:'instant'}), y);
  await new Promise(r=>setTimeout(r,300));
  await page.screenshot({ path: `${OUT}/22-scroll-${y}.png`, clip:{x:0,y:0,width:1440,height:100} });
}
const navBox = await page.evaluate(()=>{
  const links = document.querySelector('.ki-nav-links');
  const rect = links?.getBoundingClientRect();
  const cs = links ? getComputedStyle(links) : null;
  return { rect, display: cs?.display, visibility: cs?.visibility, opacity: cs?.opacity };
});
console.log('navLinks state at scroll 2100:', JSON.stringify(navBox));
await page.close();
await br.close();
