/** Per-DEVICE measurement of a reference, so a build can be checked against it. */
const DBG='9352'; const URL_=process.env.URL; const W=1440,H=900;
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
class S{constructor(w){this.ws=w;this.id=0;this.p=new Map()}
 static async open(u){const ws=new WebSocket(u);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});const s=new S(ws);
  ws.onmessage=(e)=>{const m=JSON.parse(e.data);if(m.id&&s.p.has(m.id)){const{res,rej}=s.p.get(m.id);s.p.delete(m.id);m.error?rej(new Error(JSON.stringify(m.error))):res(m.result)}};return s}
 send(m,p={},ms=45000){const id=++this.id;return new Promise((res,rej)=>{this.p.set(id,{res,rej});this.ws.send(JSON.stringify({id,method:m,params:p}));setTimeout(()=>{if(this.p.has(id)){this.p.delete(id);rej(new Error('t'))}},ms)})}}
const ev=async(s,e)=>(await s.send('Runtime.evaluate',{returnByValue:true,expression:e,awaitPromise:true})).result.value;
const tab=await(await fetch(`http://127.0.0.1:${DBG}/json/new?about:blank`,{method:'PUT'})).json();
const s=await S.open(tab.webSocketDebuggerUrl);
try{
 await s.send('Page.enable');await s.send('Runtime.enable');
 await s.send('Emulation.setDeviceMetricsOverride',{width:W,height:H,deviceScaleFactor:1,mobile:false});
 await s.send('Page.navigate',{url:URL_}); await sleep(9000);
 const h=await ev(s,'document.body.scrollHeight');
 for(let y=0;y<h;y+=600){await ev(s,`window.scrollTo(0,${y})`);await sleep(160);}
 await ev(s,'window.scrollTo(0,0)'); await sleep(800);
 console.log(await ev(s,`(()=>{
  const vw=innerWidth;
  const imgs=[...document.images].filter(i=>i.getBoundingClientRect().width>80);
  const wid=imgs.map(i=>Math.round(i.getBoundingClientRect().width));
  const bleed=imgs.filter(i=>i.getBoundingClientRect().width>=vw*0.97).length;
  const wide=imgs.filter(i=>{const w=i.getBoundingClientRect().width;return w>=vw*0.45&&w<vw*0.97}).length;
  const small=imgs.filter(i=>i.getBoundingClientRect().width<vw*0.45).length;
  const heads=[...document.querySelectorAll('h1,h2,h3')].map(e=>({t:e.innerText.trim().slice(0,34),
    tag:e.tagName, size:Math.round(parseFloat(getComputedStyle(e).fontSize)),
    weight:getComputedStyle(e).fontWeight, align:getComputedStyle(e).textAlign}));
  const bgs={};
  [...document.querySelectorAll('div,section')].forEach(e=>{const r=e.getBoundingClientRect();
    if(r.height>400&&r.width>vw*0.9){const b=getComputedStyle(e).backgroundColor;
      if(b&&b!=='rgba(0, 0, 0, 0)') bgs[b]=(bgs[b]||0)+1;}});
  const areaImg=imgs.reduce((a,i)=>{const r=i.getBoundingClientRect();return a+r.width*r.height},0);
  return JSON.stringify({
   viewport:vw, pageH:document.body.scrollHeight,
   imgCount:imgs.length, fullBleedImgs:bleed, halfPlusImgs:wide, smallImgs:small,
   medianImgWidth: wid.sort((a,b)=>a-b)[Math.floor(wid.length/2)],
   imgAreaPerViewport: +(areaImg/(vw*document.body.scrollHeight)).toFixed(3),
   headingAligns: heads.reduce((a,x)=>{a[x.align]=(a[x.align]||0)+1;return a},{}),
   headingSizes: [...new Set(heads.map(h=>h.size))].sort((a,b)=>b-a).slice(0,6),
   headingWeights: [...new Set(heads.map(h=>h.weight))],
   headings: heads.slice(0,10),
   bigBackgrounds: bgs,
   listItems: document.querySelectorAll('li').length,
   tables: document.querySelectorAll('table').length,
   inputs: document.querySelectorAll('input,select,textarea').length,
  },null,1)})()`));
}finally{await fetch(`http://127.0.0.1:${DBG}/json/close/${tab.id}`).catch(()=>{});}
