export const openingFont='CabinetGrotesk-Variable'
export const openingSample='Bílamiðstöðin · ÞÍN LEIÐ. ÞINN BÍLL. ÁáÉéÍíÓóÚúÝýÐðÞþÆæÖö 0123456789'
export const openingWeights=[450,600]

/** Bound resource failures and remove every timer/listener on completion or cancellation. */
export function within(task:Promise<boolean>,milliseconds:number,signal:AbortSignal):Promise<boolean>{
 return new Promise(resolve=>{
  if(signal.aborted){resolve(false);return}
  let settled=false
  const finish=(value:boolean)=>{if(settled)return;settled=true;clearTimeout(timer);signal.removeEventListener('abort',cancel);resolve(value)}
  const cancel=()=>finish(false)
  const timer=setTimeout(cancel,milliseconds)
  signal.addEventListener('abort',cancel,{once:true})
  task.then(finish,cancel)
 })
}
export function minimumOpening(milliseconds:number,signal:AbortSignal):Promise<boolean>{
 return new Promise(resolve=>{
  if(signal.aborted){resolve(false);return}
  const finish=(value:boolean)=>{clearTimeout(timer);signal.removeEventListener('abort',cancel);resolve(value)}
  const cancel=()=>finish(false)
  const timer=setTimeout(()=>finish(true),milliseconds)
  signal.addEventListener('abort',cancel,{once:true})
 })
}
export function prepareFonts(fonts:Pick<FontFaceSet,'load'|'check'>|undefined,signal:AbortSignal,deadline=6000):Promise<boolean>{
 if(!fonts||signal.aborted)return Promise.resolve(false)
 const specs=[...openingWeights.map(weight=>`${weight} 16px "${openingFont}"`),'700 16px "ClashDisplay-Variable"']
 const task=Promise.resolve().then(()=>Promise.all(specs.map(spec=>fonts.load(spec,openingSample)))).then(faces=>faces.every(f=>f.length>0)&&specs.every(spec=>fonts.check(spec,openingSample)))
 return within(task,deadline,signal)
}
export async function prepareImage(url:string,signal:AbortSignal,deadline=4000):Promise<boolean>{
 if(signal.aborted)return false
 const image=new Image();image.decoding='async'
 const task=new Promise<boolean>(resolve=>{
  image.onload=()=>{if(image.decode)image.decode().then(()=>resolve(true),()=>resolve(false));else resolve(image.naturalWidth>0)}
  image.onerror=()=>resolve(false)
  image.src=url
 })
 const ready=await within(task,deadline,signal)
 image.onload=null;image.onerror=null
 return ready
}
