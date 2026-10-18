/* focus-guard (_tools/focus-guard): no focus ring after a tap or click; the README says why.
   Pairs with the focus-guard rule at the end of index.css. */
const root = document.documentElement
const set = (v: string) => { if (root.getAttribute('data-input') !== v) root.setAttribute('data-input', v) }
addEventListener('pointerdown', () => set('pointer'), true)
addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return
  set('key')
}, true)
export {}
