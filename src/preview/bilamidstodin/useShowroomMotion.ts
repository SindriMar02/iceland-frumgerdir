import { useEffect, useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'

/** Position drives arrivals: fully readable by the lower third, never a timed curtain. */
export function useShowroomMotion(root:RefObject<HTMLElement|null>,route:string,content:string,ready:boolean){
 const previous=useRef<string|null>(null)
 useLayoutEffect(()=>{
  const el=root.current;if(!el||!ready)return
  const media=matchMedia('(prefers-reduced-motion: reduce)')
  let keyboard=false
  const key=()=>{keyboard=true};const pointer=()=>{keyboard=false}
  // Remember input modality across route changes; keyboard and history arrivals stay instant.
  const input=document.documentElement.dataset.bmInput
  const opening=previous.current===null
  const changed=previous.current!==route;previous.current=route
  const animations:Animation[]=[]
  if(changed&&!media.matches&&input!=='keyboard'&&input!=='history'){
   // One rare opening sequence. Routine route changes keep the shorter 240ms arrival.
   const portions:[string,number,number,number][]=[
    ['.bm-header .bm-logo, .bm-desktop-nav, .bm-header-actions',0,420,8],
    ['.bm-hero-location',60,440,12],
    ['.bm-hero h1',110,560,20],
    ['.bm-hero-copy > p',175,500,16],
    ['.bm-hero-copy > .bm-button, .bm-hero-hours',235,460,12],
    ['.bm-hero-showroom',130,620,20],
    ['.bm-section-head',275,500,16],
    ['.bm-needs',325,500,14],
    ['.bm-search-sticky, .bm-quick, .bm-desktop-filters',375,460,12],
    ['.bm-detail-top, .bm-gallery, .bm-service-page > div:first-child, .bm-about > h1, .bm-comparison > h1',70,520,16],
    ['.bm-detail-summary, .bm-form-panel, .bm-about > .bm-lead, .bm-compare-scroll',150,520,16],
   ]
   const visited=new Set<HTMLElement>()
   for(const [selector,delay,duration,distance] of portions){
    if(!opening&&selector.startsWith('.bm-header'))continue
    el.querySelectorAll<HTMLElement>(selector).forEach(node=>{
     if(visited.has(node)||typeof node.animate!=='function'||!node.getClientRects().length)return
     visited.add(node)
     animations.push(node.animate([
      {opacity:opening?0:.65,transform:`translateY(${opening?distance:8}px)`},
      {opacity:1,transform:'translateY(0)'}
     ],{duration:opening?duration:240,delay:opening?delay:Math.min(visited.size-1,4)*35,easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'}))
    })
   }
  }
  const pending=new Set<HTMLElement>();let frame=0
  const offsets=new WeakMap<HTMLElement,number>()
  const clear=(node:HTMLElement)=>{offsets.delete(node);node.style.removeProperty('opacity');node.style.removeProperty('transform')}
  const collect=()=>{el.querySelectorAll<HTMLElement>('.bm-car, .bm-sell-band h2, .bm-sell-options > a, .bm-detail-content > *, .bm-about-grid > *, .bm-steps > li').forEach(node=>{if(!node.dataset.bmRead)pending.add(node)})}
  const paint=()=>{
   frame=0
   const height=window.innerHeight
   const samples=[...pending].map(node=>({node,top:node.getBoundingClientRect().top-(offsets.get(node)||0)}))
   for(const {node,top} of samples){
    if(media.matches||keyboard||top<=height*.72){clear(node);node.dataset.bmRead='true';pending.delete(node);continue}
    const progress=Math.max(0,Math.min(1,(height-top)/(height*.28)))
    const offset=8*(1-progress);offsets.set(node,offset);node.style.opacity=String(.72+.28*progress);node.style.transform=`translateY(${offset}px)`
   }
  }
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint)}
  const onKey=()=>{key();animations.forEach(a=>a.cancel());pending.forEach(clear);pending.clear()}
  const preference=()=>{animations.forEach(a=>a.cancel());schedule()}
  const interrupt=()=>{animations.forEach(a=>a.cancel());schedule()}
  collect();schedule()
  const observer=new MutationObserver(()=>{collect();schedule()});observer.observe(el,{childList:true,subtree:true})
  window.addEventListener('wheel',interrupt,{passive:true});window.addEventListener('touchstart',interrupt,{passive:true});window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('keydown',onKey);window.addEventListener('pointerdown',pointer);media.addEventListener('change',preference)
  return()=>{observer.disconnect();cancelAnimationFrame(frame);pending.forEach(clear);animations.forEach(a=>a.cancel());window.removeEventListener('wheel',interrupt);window.removeEventListener('touchstart',interrupt);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);window.removeEventListener('keydown',onKey);window.removeEventListener('pointerdown',pointer);media.removeEventListener('change',preference)}
 },[root,route,content,ready])
 useEffect(()=>{
  const key=()=>{document.documentElement.dataset.bmInput='keyboard'}
  const pointer=()=>{document.documentElement.dataset.bmInput='pointer'}
  const history=()=>{document.documentElement.dataset.bmInput='history'}
  window.addEventListener('keydown',key);window.addEventListener('pointerdown',pointer);window.addEventListener('popstate',history)
  return()=>{window.removeEventListener('keydown',key);window.removeEventListener('pointerdown',pointer);window.removeEventListener('popstate',history);delete document.documentElement.dataset.bmInput}
 },[])
}
