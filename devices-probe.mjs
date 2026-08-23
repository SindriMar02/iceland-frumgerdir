// Same probe for reference and build. Walks the page so reveals fire, then measures.
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url=process.argv[2], label=process.argv[3]||url;
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--hide-scrollbars']});
const p=await b.newPage();
await p.setViewport({width:1440,height:900,deviceScaleFactor:1});
await p.goto(url,{waitUntil:'networkidle2',timeout:60000}).catch(()=>{});
// walk the whole page so lazy images and reveals fire
await p.evaluate(async()=>{
  const H=document.documentElement.scrollHeight;
  for(let y=0;y<H;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}
  window.scrollTo(0,0); await new Promise(r=>setTimeout(r,600));
});
const m=await p.evaluate(()=>{
  const vw=innerWidth, H=document.documentElement.scrollHeight;
  const imgs=[...document.querySelectorAll('img')].filter(i=>i.getBoundingClientRect().width>2);
  let area=0; imgs.forEach(i=>{const r=i.getBoundingClientRect(); area+=r.width*r.height;});
  // background-image nodes count as photography too
  const bg=[...document.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e);
    return s.backgroundImage&&s.backgroundImage.includes('url(')&&!s.backgroundImage.includes('gradient');});
  bg.forEach(e=>{const r=e.getBoundingClientRect(); if(r.width>60&&r.height>60) area+=r.width*r.height;});
  const vids=[...document.querySelectorAll('video')];
  vids.forEach(v=>{const r=v.getBoundingClientRect(); area+=r.width*r.height;});
  const px=t=>{const e=document.querySelector(t); return e?Math.round(parseFloat(getComputedStyle(e).fontSize)):null;};
  const fams=[...new Set([...document.querySelectorAll('h1,h2,h3,p')].map(e=>getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g,'')))].slice(0,4);
  return {vw,pageH:H,screens:+(H/innerHeight).toFixed(1),
    imgCount:imgs.length+vids.length, bgNodes:bg.length,
    imgRatio:+(area/(vw*H)).toFixed(3),
    h1:px('h1'),h2:px('h2'),h3:px('h3'),body:px('p'),
    fonts:fams, videos:vids.length};
});
console.log(JSON.stringify({label,...m}));
await b.close();
