import puppeteer from 'puppeteer-core';

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-mobile-density';
const viewports = [
  { label: '390x844', width: 390, height: 844 },
  { label: '375x667', width: 375, height: 667 },
];

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

for (const vp of viewports) {
  const page = await br.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' });
  await sleep(1500);

  // First-viewport element census
  const census = await page.evaluate(() => {
    const vw = window.innerWidth, vh = window.innerHeight;
    function visible(el) {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return false;
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity) === 0) return false;
      const intersects = r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0;
      return intersects;
    }
    // text nodes: elements with direct non-whitespace text
    const all = Array.from(document.querySelectorAll('body *'));
    const textEls = [];
    for (const el of all) {
      const direct = Array.from(el.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim().length > 0);
      if (direct.length && visible(el)) {
        textEls.push({ tag: el.tagName, text: direct.map(n=>n.textContent.trim()).join(' ').slice(0,60), cls: el.className.toString().slice(0,50) });
      }
    }
    const interactiveSel = 'a,button,[role=button],input,select,textarea,[onclick],[data-clickable]';
    const interactive = Array.from(document.querySelectorAll(interactiveSel)).filter(visible).map(el => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, text: (el.textContent||'').trim().slice(0,40), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) };
    });
    const images = Array.from(document.querySelectorAll('img,picture,video,[style*="background-image"]')).filter(visible).length;
    return { textCount: textEls.length, textEls, interactiveCount: interactive.length, interactive, images, scrollHeight: document.documentElement.scrollHeight };
  });

  console.log(`\n=== ${vp.label} CENSUS ===`);
  console.log(JSON.stringify(census, null, 1));

  await page.screenshot({ path: `${OUT}/${vp.label}-screen0.png` });

  // Walk down the page screen by screen
  const total = census.scrollHeight;
  const step = vp.height;
  let i = 1;
  for (let y = step; y < total; y += step) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, left: 0, behavior: 'instant' }), y);
    await sleep(150);
    await page.screenshot({ path: `${OUT}/${vp.label}-screen${i}.png` });
    i++;
    if (i > 8) break; // safety cap
  }

  await page.close();
}

await br.close();
console.log('DONE');
