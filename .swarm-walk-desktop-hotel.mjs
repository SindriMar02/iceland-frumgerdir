import puppeteer from 'puppeteer-core';

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-desktop-hotel';
const BASE = 'http://localhost:8963';

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await br.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

async function shot(name, opts={}) {
  await page.screenshot({ path: `${OUT}/${name}.png`, ...opts });
  console.log('shot', name);
}

async function goto(path) {
  await page.goto(BASE + path, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
}

// 1. Home page
await goto('/');
await shot('01-home');

// find nav links text
const navLinks = await page.$$eval('a', as => as.map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') })).filter(x => x.text));
console.log('LINKS', JSON.stringify(navLinks, null, 0));

await br.close();
