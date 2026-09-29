// iOS Simulator Safari probe for Katrín: visits every route in the booted simulator's katrin tab
// (via ios_webkit_debug_proxy on :9222) and reports horizontal overflow, cropped or stretched
// images, broken images and headline full stops. usage: node .ki-iosprobe-0927.mjs [base]
const BASE = process.argv[2] || 'https://katrin-isfeld.pages.dev';
const ROUTES = `/ /en/ /fjolmidlar/ /hafa-samband/ /italskar-innrettingar/ /studioid/ /verkefni/ /verkefni/alfheimar/ /verkefni/arkitektoniskt-kameljon/ /verkefni/atvinnuhusnaedi/ /verkefni/badherbergi/ /verkefni/barnaherbergi/ /verkefni/eldhus-i-107-sersmidi/ /verkefni/eldhusrymi-i-skandinaviskum-stil/ /verkefni/eldhusrymi-i-skuggahverfi/ /verkefni/eldhusrymi/ /verkefni/fallegt-hus-i-kopavogi/ /verkefni/fjallalind/ /verkefni/freyja-gistiheimili/ /verkefni/freyja-luxusibud/ /verkefni/gistiheimili-og-hotel/ /verkefni/honnunar-studio/ /verkefni/hotel-hekla/ /verkefni/hus-i-gardabae/ /verkefni/hus-i-mosfellsbae/ /verkefni/ibud-i-skuggahverfi/ /verkefni/innanhusshonnun/ /verkefni/laugalaekur-fataherbergi/ /verkefni/nybyggt-hus-i-suluhofda/ /verkefni/old-charm-reykjavik-apartment/ /verkefni/skrifstofurymi/ /verkefni/solvallagata/ /verkefni/stemning/ /verkefni/sumarhus-i-fljotshlidinni/ /verkefni/sumarhus-i-olfusi/ /verkefni/svala-apartments/ /verkefni/tannlaeknastofan-gardatorgi/`.split(' ');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tab() {
  const pages = (await (await fetch('http://127.0.0.1:9222/json')).json()).filter((p) => p.url.includes(new URL(BASE).host));
  return pages[pages.length - 1];
}
function connect(u) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(u);
    let target = null, n = 0;
    const wait = new Map();
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.method === 'Target.targetCreated' && !target) { target = d.params.targetInfo.targetId; res(api); }
      if (d.method === 'Target.dispatchMessageFromTarget') {
        const inner = JSON.parse(d.params.message);
        if (wait.has(inner.id)) { wait.get(inner.id)(inner); wait.delete(inner.id); }
      }
    };
    ws.onerror = rej;
    setTimeout(() => rej(new Error('timeout')), 5000);
    const api = {
      eval(src) {
        return new Promise((r) => {
          const id = ++n;
          wait.set(id, r);
          ws.send(JSON.stringify({ id: 1000 + id, method: 'Target.sendMessageToTarget', params: { targetId: target, message: JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: src, returnByValue: true } }) } }));
          setTimeout(() => r({ result: { result: { value: 'ERR eval timeout' } } }), 8000);
        });
      },
      close() { ws.close(); },
    };
  });
}
async function run(src) {
  const c = await connect((await tab()).webSocketDebuggerUrl);
  const r = await c.eval(`(() => { try { return JSON.stringify(${src}); } catch (e) { return "ERR " + e.message; } })()`);
  c.close();
  return r.result?.result?.value;
}

const MEASURE = `(() => {
  const vw = innerWidth, out = [];
  if (document.documentElement.scrollWidth > vw + 1) out.push('overflow-x ' + document.documentElement.scrollWidth + '>' + vw);
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width && r.right > vw + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('[aria-hidden="true"],[hidden]')) { out.push('wide ' + el.tagName + '.' + (el.className+'').slice(0,40) + ' right=' + Math.round(r.right)); break; }
  }
  const imgs = [...document.querySelectorAll('main img, .ki-gal img, img')];
  let crop = 0, broken = 0;
  for (const im of imgs) {
    const r = im.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (im.complete && im.naturalWidth === 0 && im.currentSrc) broken++;
    const nat = im.naturalWidth ? im.naturalWidth / im.naturalHeight : (im.width && im.height ? +im.getAttribute('width') / +im.getAttribute('height') : 0);
    const fit = getComputedStyle(im).objectFit;
    if (nat && fit !== 'cover' && Math.abs(r.width / r.height - nat) / nat > 0.03) crop++;
    if (!im.hasAttribute('alt')) out.push('missing-alt ' + (im.currentSrc||'').split('/').pop());
  }
  const h = [...document.querySelectorAll('h1,h2')].map((e) => e.textContent.trim()).filter((t) => /\\.$/.test(t));
  if (h.length) out.push('headline-stop: ' + h.join(' | '));
  if (crop) out.push('stretched-img ' + crop);
  if (broken) out.push('broken-img ' + broken);
  return { t: document.title, n: imgs.length, vw, out: [...new Set(out)].slice(0, 8) };
})()`;

let bad = 0;
for (const r of ROUTES) {
  await run(`location.href = ${JSON.stringify(BASE + r)}`).catch(() => {});
  await sleep(3500);
  // scroll through so lazy images load, then measure
  await run(`(() => { let y = 0; const h = document.body.scrollHeight; const id = setInterval(() => { y += innerHeight; scrollTo(0, y); if (y > h) clearInterval(id); }, 60); return h; })()`).catch(() => {});
  await sleep(2500);
  let v;
  try { v = JSON.parse(await run(MEASURE)); } catch (e) { console.log(r, 'ERR', e.message); bad++; continue; }
  if (v.out.length) bad++;
  console.log(v.out.length ? 'FAIL' : 'ok  ', r, `imgs=${v.n} vw=${v.vw}`, v.out.join(' ; '));
}
await run('scrollTo(0,0)').catch(() => {});
console.log(`\n${ROUTES.length} routes on iOS Safari, ${bad} with problems`);
