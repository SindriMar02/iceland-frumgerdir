import puppeteer from 'puppeteer-core';
const CH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT=process.env.HOME+'/Downloads/sndr-ad-pack-2026-09-06';
const b=await puppeteer.launch({executablePath:CH,headless:'new',args:['--hide-scrollbars']});
const p=await b.newPage();
await p.setViewport({width:1440,height:900,deviceScaleFactor:2});
await p.goto('https://sndrstudio.is/',{waitUntil:'networkidle2',timeout:45000});
// walk the page so every scroll reveal has fired
await p.evaluate(async()=>{const h=document.body.scrollHeight;for(let y=0;y<h;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,90));}window.scrollTo(0,0);});
await new Promise(r=>setTimeout(r,1500));
const sec=await p.$('#fyrir-eftir');
if(!sec){console.log('SECTION NOT FOUND');}
else{
  await sec.screenshot({path:`${OUT}/06-vefhonnun-fyrir-eftir/fyrir-eftir-heild.png`});
  const figs=await p.$$('#fyrir-eftir figure');
  console.log('figures found:',figs.length);
  const names=['fyrir-gamall-vefur.png','eftir-hotel-vor.png'];
  for(let i=0;i<figs.length&&i<2;i++){await figs[i].screenshot({path:`${OUT}/06-vefhonnun-fyrir-eftir/${names[i]}`});}
}
// the one real live piece of work named on the site
try{
  const q=await b.newPage(); await q.setViewport({width:1440,height:900,deviceScaleFactor:2});
  await q.goto('https://artix.is/',{waitUntil:'networkidle2',timeout:45000});
  await new Promise(r=>setTimeout(r,2000));
  await q.screenshot({path:`${OUT}/09-raunveruleg-verk/artix-hero.png`});
  await q.screenshot({path:`${OUT}/09-raunveruleg-verk/artix-heild.png`,fullPage:true});
  console.log('artix captured');
}catch(e){console.log('artix FAILED',e.message.slice(0,80));}
await b.close();
