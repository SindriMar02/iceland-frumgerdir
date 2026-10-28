// Lifecycle-scoped version of _tools/focus-guard/focus-guard.js.
// Installed before route markup. Exact input-modality behavior, cleaned on unmount.
export function installFocusGuard() {
  const root = document.documentElement, previous = root.getAttribute('data-input')
  const set = (v: string) => { if (root.getAttribute('data-input') !== v) root.setAttribute('data-input',v) }
  const pointer = () => set('pointer')
  const key = (e: KeyboardEvent) => { if (!['Shift','Control','Alt','Meta'].includes(e.key)) set('key') }
  window.addEventListener('pointerdown',pointer,true); window.addEventListener('keydown',key,true)
  return () => { window.removeEventListener('pointerdown',pointer,true); window.removeEventListener('keydown',key,true); if (previous) root.setAttribute('data-input',previous); else root.removeAttribute('data-input') }
}
