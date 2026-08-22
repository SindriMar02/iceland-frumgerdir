import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']});
const p=await b.newPage(); await p.setViewport({width:1440,height:900});
await p.goto('https://waka-waka.com/en/',{waitUntil:'networkidle2',timeout:60000}).catch(()=>{});
await p.evaluate(async()=>{const H=document.documentElement.scrollHeight;
 for(let y=0;y<H;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,110));} window.scrollTo(0,0);});
const r=await p.evaluate(()=>{
 const out={};
 out.libs=[...document.scripts].map(s=>s.src.split('/').pop()).filter(Boolean).slice(0,14);
 out.sections=[...document.querySelectorAll('section,main > div,article')].slice(0,14).map(s=>({
   cls:(s.className||'').toString().slice(0,52),
   h:Math.round(s.getBoundingClientRect().height),
   imgs:s.querySelectorAll('img,video').length,
   txt:(s.innerText||'').trim().slice(0,60).replace(/\n/g,' | ')}));
 // grid usage
 const grids=[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).display.includes('grid'));
 out.grids=grids.slice(0,6).map(g=>getComputedStyle(g).gridTemplateColumns);
 // sticky / fixed elements = the chrome devices
 out.sticky=[...document.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e);return s.position==='sticky'||s.position==='fixed';})
   .slice(0,8).map(e=>({tag:e.tagName,cls:(e.className||'').toString().slice(0,40),pos:getComputedStyle(e).position,txt:(e.innerText||'').trim().slice(0,34)}));
 // image aspect ratios actually used
 out.ratios=[...document.querySelectorAll('img')].slice(0,16).map(i=>{const r=i.getBoundingClientRect();
   return r.width>4?+(r.width/r.height).toFixed(2):null;}).filter(Boolean);
 out.mixBlend=[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).mixBlendMode!=='normal').length;
 return out;});
console.log(JSON.stringify(r,null,1));
await b.close();
