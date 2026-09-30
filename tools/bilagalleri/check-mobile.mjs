import {readFileSync} from 'node:fs'
import assert from 'node:assert/strict'
const ts=readFileSync('src/preview/bilagalleri/Page.tsx','utf8'),css=readFileSync('src/preview/bilagalleri/styles.css','utf8')
// Standalone route: the studio gate scans .tsx/.ts only, so it cannot see this CSS file.
assert.match(ts,/if\(media.matches\|\|isTouch\(\)\|\|!pointer.matches\)return/)
assert.match(ts,/const lenis=isTouch\(\)\?null:new Lenis/)
assert.match(css,/html,body\{background-color:var\(--bg-ground\)/)
assert.match(css,/env\(safe-area-inset-top\)/)
assert.match(css,/env\(safe-area-inset-bottom\)/)
assert.match(css,/\.bg-header\{position:fixed;inset:0 0 auto/)
assert.match(css,/\.bg-awning\{position:sticky;top:-100px;height:106px/)
assert(!/height:\s*100vh/.test(css));assert.match(css,/overflow-x:clip/)
assert.match(ts,/document.body.style.position='fixed'/)
assert.match(css,/prefers-reduced-motion:reduce/)
console.log('PASS: native touch scroll, constant header, top and bottom safe areas, matching html/body tint, awning, fixed-body dialog lock, reduced motion, no 100vh. Native Safari validation remains a separate gate.')
