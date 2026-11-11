// node _tools/focus-guard/check-menu.mjs <url> [triggerSelector]
// Taps the menu trigger like a phone (nothing focused first) and fails if anything opens highlighted.
import puppeteer from 'puppeteer-core';
const [url, given] = process.argv.slice(2);
const b = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9361' });
const context = await b.createBrowserContext();
const pg = await context.newPage(); await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await pg.evaluateOnNewDocument(() => addEventListener('mousedown', e => e.preventDefault(), true)); // SAFARI-LIKE: Safari and iOS never focus a tapped button, so nothing is focused when the menu code runs
await pg.goto(url, { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 2500));
const sel = given || await pg.evaluate(() => { const e = [...document.querySelectorAll('[aria-expanded][aria-controls],button[aria-expanded],#burger,.burger')].find(x => x.getBoundingClientRect().width > 8); if (!e) return null; e.setAttribute('data-scan', '1'); return '[data-scan="1"]'; });
if (!sel) { console.log('no menu trigger found; pass a selector'); process.exit(2); }
await pg.evaluate(() => document.activeElement && document.activeElement.blur());
await pg.tap(sel); await new Promise(r => setTimeout(r, 1200));
const r = await pg.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return { el: a.tagName.toLowerCase() + (a.id ? '#' + a.id : ''), text: (a.textContent || '').trim().slice(0, 20), focusVisible: a.matches(':focus-visible'), outline: cs.outlineStyle, ring: cs.outlineStyle !== 'none' && cs.outlineStyle !== '' }; });
console.log(JSON.stringify(r)); await context.close(); b.disconnect();
process.exit(r.focusVisible && r.ring ? 1 : 0);
