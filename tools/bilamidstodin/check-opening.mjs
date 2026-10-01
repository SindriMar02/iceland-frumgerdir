import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
const compiled=ts.transpileModule(fs.readFileSync('src/preview/bilamidstodin/opening-assets.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText
const exports={}
const images=[]
vm.runInNewContext(compiled,{exports,Promise,setTimeout,clearTimeout,Image:class{constructor(){images.push(this)} decode(){return this.decoded}}})
const signal=new AbortController().signal
let release;const pending=new Promise(resolve=>release=resolve);const calls=[]
let finished=false
const fontReady=exports.prepareFonts({load:spec=>{calls.push(spec);return pending},check:()=>true},signal,1000).then(value=>{finished=true;return value})
await Promise.resolve();assert.equal(calls.length,3);assert.equal(finished,false,'Unloaded fonts must keep the gate closed')
release([{}]);assert.equal(await fontReady,true)
assert.equal(await exports.prepareFonts({load:async()=>[],check:()=>true},signal),false,'Missing faces must not pass')
assert.equal(await exports.prepareFonts({load:()=>{throw Error('offline')},check:()=>true},signal),false)
assert.equal(await exports.prepareFonts({load:()=>new Promise(()=>{}),check:()=>false},signal,5),false,'A stalled font needs a bounded fallback')
const abort=new AbortController();const cancelled=exports.minimumOpening(1000,abort.signal);abort.abort();assert.equal(await cancelled,false)
assert.equal(await exports.minimumOpening(5,signal),true)
let decode;const imageReady=exports.prepareImage('car.webp',signal,1000);images[0].decoded=new Promise(resolve=>decode=resolve)
images[0].onload();let imageFinished=false;imageReady.then(()=>imageFinished=true);await Promise.resolve();assert.equal(imageFinished,false,'Image decoding must finish before reveal')
decode();assert.equal(await imageReady,true);assert.equal(images[0].onload,null)
assert.equal(await exports.prepareImage('missing.webp',signal,5),false)
console.log('PASS: actual font faces, deferred loading, failure/deadline fallback, minimum duration, cancellation and image decode')
