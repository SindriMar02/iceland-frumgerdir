import puppeteer from 'puppeteer-core';import fs from 'node:fs/promises';
const b=await puppeteer.connect({browserURL:'http://127.0.0.1:9361'});const c=await b.createBrowserContext();const p=await c.newPage();const wait=ms=>new Promise(r=>setTimeout(r,ms));const out={};
try{
 await p.setViewport({width:1440,height:900});await p.goto('http://127.0.0.1:5311/',{waitUntil:'networkidle2'});await wait(3000);
 const heroSrc=await p.$eval('#efst img',e=>e.src);await wait(6800);out.cycle=await p.$$eval('#efst img',es=>es.map(e=>({src:e.src,decoded:e.complete&&e.naturalWidth>0})));out.cycleChanged=!out.cycle.every(e=>e.src===heroSrc);
 await p.evaluate(()=>document.querySelector('#thjonusta').scrollIntoView({behavior:'instant'}));await wait(300);
 const sizes=()=>p.$$eval('.bg-service-row',es=>es.map(e=>e.getBoundingClientRect().height));const before=await sizes();
 await p.$eval('.bg-service-strip button:nth-child(4)',e=>e.click());await wait(700);out.services={before,after:await sizes(),selected:await p.$eval('.bg-service-strip button[aria-pressed=true]',e=>e.getAttribute('aria-label'))};
 await p.evaluate(()=>scrollTo({top:2300,behavior:'instant'}));await p.click('header a');await wait(1800);out.desktopLogo=await p.evaluate(()=>scrollY);
 await p.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
 await p.tap('button[aria-controls="bg-mobile-menu"]');await wait(180);await p.tap('button[aria-controls="bg-mobile-menu"]');await wait(180);await p.tap('button[aria-controls="bg-mobile-menu"]');await wait(1000);
 out.rapidMenu=await p.evaluate(()=>({open:document.querySelector('button[aria-controls="bg-mobile-menu"]').getAttribute('aria-expanded'),panels:document.querySelectorAll('#bg-mobile-menu').length,body:document.body.style.position}));
 await p.keyboard.press('Escape');await wait(1000);await p.evaluate(()=>scrollTo({top:2400,behavior:'instant'}));await p.tap('header a');await wait(1400);out.mobileLogo=await p.evaluate(()=>scrollY);
 await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 out.reduced=[];
 for(const width of [1440,1024,390]){await p.setViewport({width,height:900});await p.goto('http://127.0.0.1:5311/?intro',{waitUntil:'networkidle2'});out.reduced.push(await p.evaluate(()=>({width:innerWidth,loader:!!document.querySelector('.bgl-loader'),headerOpacity:getComputedStyle(document.querySelector('header')).opacity,h1Transform:getComputedStyle(document.querySelector('h1 span span')).transform,hidden:[...document.querySelectorAll('main h2,main p,main img')].filter(el=>{for(let e=el;e&&e.tagName!=='MAIN';e=e.parentElement)if(getComputedStyle(e).opacity==='0')return true;return false}).length})));}
 await fs.writeFile('bilageirinn/shots/interactions.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));
}finally{await c.close();b.disconnect()}
