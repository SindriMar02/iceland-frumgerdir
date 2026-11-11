import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
const browser=await puppeteer.connect({browserURL:'http://127.0.0.1:9361'});
const context=await browser.createBrowserContext();
const page=await context.newPage();
const errors=[];const warnings=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warn')warnings.push(m.text())});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const results={errors,warnings,widths:[]};
await fs.mkdir('bilageirinn/shots',{recursive:true});
try {
 for(const width of [1440,1024,390]){
  await page.setViewport({width,height:width===390?844:900,deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390});
  await page.goto('http://127.0.0.1:5311/',{waitUntil:'networkidle2'});await sleep(2600);
  await page.screenshot({path:`bilageirinn/shots/home-${width}-hero.png`});
  const total=await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<total;y+=650){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await sleep(90)}
  await sleep(600);
  const captureStyle=await page.addStyleTag({content:'.bg-chrome{position:absolute!important;top:0!important}'});
  await page.screenshot({path:`bilageirinn/shots/home-${width}-full.png`,fullPage:true});
  await captureStyle.evaluate(el=>el.remove());
  const result=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,brokenImages:[...document.querySelectorAll('img')].filter(i=>i.getClientRects().length && i.complete && !i.naturalWidth).map(i=>i.src)}));
  await page.evaluate(()=>document.querySelector('#tjon').scrollIntoView({behavior:'instant'}));await sleep(450);
  await page.screenshot({path:`bilageirinn/shots/home-${width}-claims.png`});
  if(width===1440){
   result.motion=[];
   for(const i of [0,1,2,3,1]){
    await page.evaluate(i=>document.querySelector(`#claim-step-${i}`).scrollIntoView({behavior:'instant',block:'center'}),i);await sleep(180);
    result.motion.push(await page.evaluate(()=>({current:document.querySelector('.bg-chapter-current')?.textContent,path:document.querySelector('#tjon svg path')?.getAttribute('d')})));
   }
   const absoluteTop=await page.$eval('#thjonusta',el=>el.getBoundingClientRect().top+scrollY);
   result.reveal=[];
   for(const delta of [780,600,780]){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),absoluteTop-delta);await sleep(180);result.reveal.push(await page.$eval('#thjonusta>div>div',el=>({opacity:getComputedStyle(el).opacity,transform:getComputedStyle(el).transform})));}
   await page.click('button[aria-label="English"]');await sleep(500);
   result.english=await page.evaluate(()=>({lang:document.documentElement.lang,h1:document.querySelector('h1').textContent,rental:document.querySelector('#claim-step-3').textContent}));
   await page.reload({waitUntil:'networkidle2'});result.persisted=await page.evaluate(()=>document.documentElement.lang);
   await page.click('button[aria-label="Íslenska"]');
  }
  if(width===390){
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await sleep(300);
   await page.evaluate(()=>document.activeElement?.blur());await page.tap('button[aria-controls="bg-mobile-menu"]');await sleep(1000);
   result.tap=await page.evaluate(()=>{const e=document.activeElement;const first=document.querySelector('#bg-mobile-menu a');return{active:e.id,focusVisible:e.matches(':focus-visible'),outline:getComputedStyle(e).outlineStyle,firstFocusVisible:first.matches(':focus-visible'),firstOutline:getComputedStyle(first).outlineStyle,locked:document.body.style.position}});
   await page.screenshot({path:'bilageirinn/shots/menu-390.png'});
   await page.keyboard.press('Escape');await sleep(1000);
   result.escape=await page.evaluate(()=>({menu:!!document.querySelector('#bg-mobile-menu'),active:document.activeElement?.getAttribute('aria-controls'),locked:document.body.style.position}));
   await page.focus('button[aria-controls="bg-mobile-menu"]');await page.keyboard.press('Enter');await sleep(700);
   result.keyboard=await page.evaluate(()=>({active:document.activeElement.tagName,text:document.activeElement.textContent}));
   await page.keyboard.press('Escape');await sleep(400);
  }
  results.widths.push(result);
 }
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await page.goto('http://127.0.0.1:5311/?intro',{waitUntil:'networkidle2'});await sleep(400);
 results.reduced=await page.evaluate(()=>({loader:!!document.querySelector('.bgl-loader'),hidden:[...document.querySelectorAll('main h1,main h2,main p,main img')].filter(el=>{for(let e=el;e&&e.tagName!=='MAIN';e=e.parentElement){if(getComputedStyle(e).opacity==='0'||getComputedStyle(e).visibility==='hidden')return true}return false}).map(e=>e.textContent||e.getAttribute('src')),width:document.documentElement.scrollWidth}));
 await page.screenshot({path:'bilageirinn/shots/reduced-390-full.png',fullPage:true});
 await page.emulateMediaFeatures([]);await page.setViewport({width:1440,height:900});
 await page.goto('http://127.0.0.1:5311/?intro',{waitUntil:'domcontentloaded'});await sleep(500);await page.screenshot({path:'bilageirinn/shots/loader-1440.png'});await sleep(950);await page.screenshot({path:'bilageirinn/shots/shutter-1440.png'});await sleep(1500);
 await fs.writeFile('bilageirinn/shots/checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await context.close();browser.disconnect()}
