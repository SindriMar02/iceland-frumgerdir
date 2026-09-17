import puppeteer from 'puppeteer-core';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-ux';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width:390, height:844, deviceScaleFactor:1, isMobile:true, hasTouch:true });
await page.goto('http://localhost:8963/', { waitUntil:'networkidle0' });
await new Promise(r=>setTimeout(r,1500));
const btn = await page.evaluateHandle(()=>document.querySelector('header.ki-nav button, header.ki-nav [role="button"]'));
if (btn && btn.asElement()) {
  await btn.asElement().click();
  await new Promise(r=>setTimeout(r,500));
  await page.screenshot({ path: `${OUT}/25-mobile-menu-open.png` });
  // check tap target size
  const box = await btn.asElement().boundingBox();
  console.log('burger box', JSON.stringify(box));
  await page.keyboard.press('Escape');
  await new Promise(r=>setTimeout(r,400));
  await page.screenshot({ path: `${OUT}/26-mobile-menu-esc.png` });
} else {
  console.log('STILL NOT FOUND');
}
await page.close();
await br.close();
