import { useEffect, useRef, useState } from 'react'
import { minimumOpening, prepareFonts, prepareImage } from './opening-assets'

export function useOpeningReady(attempt:number,loading:boolean,images:string[]){
 const [state,setState]=useState({attempt,ready:false})
 const foundation=useRef<Promise<boolean>>(Promise.resolve(false))
 const ready=state.attempt===attempt&&state.ready
 const imageKey=[...new Set(images)].join('\n')
 // Fonts begin while inventory is loading. Nothing waits for an offscreen lazy image.
 useEffect(()=>{
  const abort=new AbortController()
  setState({attempt,ready:false})
  foundation.current=Promise.all([prepareFonts(document.fonts,abort.signal),minimumOpening(1100,abort.signal)]).then(([fonts])=>fonts)
  return()=>abort.abort()
 },[attempt])
 useEffect(()=>{
  if(loading||ready)return
  const abort=new AbortController()
  Promise.all([foundation.current,...imageKey.split('\n').filter(Boolean).map(url=>prepareImage(url,abort.signal))]).then(([fonts])=>{
   if(abort.signal.aborted)return
   // A failed font gets a stable fallback, never a delayed swap after the reveal.
   document.documentElement.dataset.bmFonts=fonts?'ready':'fallback'
   setState({attempt,ready:true})
  })
  return()=>abort.abort()
 },[attempt,loading,ready,imageKey])
 return ready
}
