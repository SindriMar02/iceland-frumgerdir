import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
const source=fs.readFileSync('src/preview/bilamidstodin/useShowroomMotion.ts','utf8')
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText
function run({reduce=false,input='pointer'}={}){
 const effects=[],frames=new Map(),listeners=new Map();let count=0,observer,cleanup
 const node={top:1000,dataset:{},style:{removeProperty(k){delete this[k]}},getBoundingClientRect(){return {top:this.top+Number(this.style.transform?.match(/translateY\(([^p]+)/)?.[1]||0)}},animate(){count++;let cancelled=false;return {cancel(){if(!cancelled){count--;cancelled=true}}}}}
 const root={querySelectorAll(selector){return selector.includes('.bm-car')?[node]:[node]}}
 const media={matches:reduce,addEventListener(){},removeEventListener(){}}
 const exports={};const context={exports,require:()=>({useRef:v=>({current:v}),useEffect:fn=>effects.push(fn)}),matchMedia:()=>media,document:{documentElement:{dataset:{bmInput:input}}},window:{innerHeight:1000,addEventListener:(k,f)=>listeners.set(k,f),removeEventListener:k=>listeners.delete(k)},requestAnimationFrame:f=>{frames.set(1,f);return 1},cancelAnimationFrame:id=>frames.delete(id),MutationObserver:class{constructor(fn){observer=fn}observe(){}disconnect(){}}}
 vm.runInNewContext(compiled,context)
 exports.useShowroomMotion({current:root},'home','1',true);cleanup=effects[0]()
 const tick=()=>{for(const [id,f]of frames){frames.delete(id);f()}}
 tick();if(reduce){assert.equal(node.style.transform,undefined);assert.equal(count,0)}else{
  assert.equal(node.style.transform,'translateY(8px)');node.top=850;listeners.get('scroll')();tick();assert.equal(node.style.transform,'translateY(3.7142857142857144px)')
  // Repaint without scrolling must not feed the previous translation back into geometry.
  listeners.get('resize')();tick();assert.equal(node.style.transform,'translateY(3.7142857142857144px)')
  node.top=720;listeners.get('scroll')();tick();assert.equal(node.style.transform,undefined);assert.equal(node.style.opacity,undefined)
  node.top=1000;observer();tick();assert.equal(node.style.transform,undefined,'Read content must never re-hide')
 }
 listeners.get('keydown')();assert.equal(count,0,'Keyboard interrupts an in-flight arrival')
 if(input==='keyboard'||input==='history')assert.equal(count,0,'Keyboard and Back never animate route arrival')
 cleanup();assert.equal(count,0);assert.equal(frames.size,0);assert.equal(listeners.size,0)
}
run();run({reduce:true});run({input:'keyboard'});run({input:'history'})
console.log('PASS: position band, transform feedback, read permanence, reduced motion, keyboard/history entry and cleanup')
