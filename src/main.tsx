// Proof to the inline watchdog in index.html that the entry bundle really ran.
// It has to be a flag, not "is #root empty": the app's outer Suspense fallback
// is null, so a perfectly healthy page has an empty #root for as long as the
// route chunk takes to arrive. On a bad connection that is well over the
// watchdog's timeout, and it would accuse a page that is merely slow.
declare global {
  interface Window { __sndrAppBooted?: boolean }
}
window.__sndrAppBooted = true
// And if the watchdog already fired — a connection slow enough that the entry
// bundle itself took over eight seconds — take the message back down. It is a
// sibling of #root, so React would otherwise leave it sitting over the page.
document.getElementById('boot-fallback')?.remove()

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
