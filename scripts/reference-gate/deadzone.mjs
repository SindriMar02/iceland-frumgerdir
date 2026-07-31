const DBG='9352'; const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
class S{constructor(w){this.ws=w;this.id=0;this.p=new Map()}
 static async open(u){const ws=new WebSocket(u);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});const s=new S(ws);
  ws.onmessage=(e)=>{const m=JSON.parse(e.data);if(m.id&&s.p.has(m.id)){const{res,rej}=s.p.get(m.id);s.p.delete(m.id);m.error?rej(new Error(JSON.stringify(m.error))):res(m.result)}};return s}
 send(m,p={},ms=45000){const id=++this.id;return new Promise((res,rej)=>{this.p.set(id,{res,rej});this.ws.send(JSON.stringify({id,method:m,params:p}));setTimeout(()=>{if(this.p.has(id)){this.p.delete(id);rej(new Error('t'))}},ms)})}}
const ev=async(s,e)=>(await s.send('Runtime.evaluate',{returnByValue:true,expression:e,awaitPromise:true})).result.value;
const tab=await(await fetch(`http://127.0.0.1:${DBG}/json/new?about:blank`,{method:'PUT'})).json();
const s=await S.open(tab.webSocketDebuggerUrl);
try{
 await s.send('Page.enable');await s.send('Runtime.enable');
 await s.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 await s.send('Page.navigate',{url:process.env.URL}); await sleep(7000);
 const h=await ev(s,'document.body.scrollHeight');
 for(let y=0;y<h;y+=600){await ev(s,`window.scrollTo(0,${y})`);await sleep(150);}
 await ev(s,'window.scrollTo(0,0)'); await sleep(600);
 console.log(await ev(s,`(()=>{
  const secs=[...document.querySelectorAll('main > section, .fst-hero')];
  const rows=secs.map(sec=>{
    const r=sec.getBoundingClientRect(); const H=r.height;
    const area=[...sec.querySelectorAll('img')].reduce((a,i)=>{const b=i.getBoundingClientRect();return a+b.width*b.height},0);
    return {id:sec.id||sec.className.replace('fst-','').slice(0,22), h:Math.round(H),
            imgArea:Math.round(area/1000)+'k', ratio:+(area/(1440*H)).toFixed(2),
            deadPx: Math.round(H - area/1440)};
  });
  return JSON.stringify(rows,null,0)})()`));
}finally{await fetch(`http://127.0.0.1:${DBG}/json/close/${tab.id}`).catch(()=>{});}
