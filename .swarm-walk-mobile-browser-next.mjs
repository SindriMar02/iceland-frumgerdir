import puppeteer from 'puppeteer-core';
const BASE = 'http://localhost:8963';
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-mobile-browser';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto(BASE + '/verkefni/fjallalind', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1200));
const h = await page.evaluate(() => document.body.scrollHeight);
console.log('scrollHeight=', h);
// find the actual "next project" link/card element and its position + surrounding text
const info = await page.evaluate(() => {
  const anchors = Array.from(document.querySelectorAll('a[href^="/verkefni/"]'));
  return anchors.map(a => {
    const r = a.getBoundingClientRect();
    return { href: a.getAttribute('href'), cls: a.className, text: (a.textContent||'').trim().slice(0,60), top: Math.round(r.top + window.scrollY), h: Math.round(r.height), w: Math.round(r.width) };
  });
});
console.log(JSON.stringify(info, null, 1));
await browserClose(br);
async function browserClose(b){ await b.close(); }
