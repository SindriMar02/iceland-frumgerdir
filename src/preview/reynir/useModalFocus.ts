import {useEffect, useRef} from 'react'

/** Focus, background isolation and restoration shared by both gallery views. */
export function useModalFocus(open: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!open || !dialog) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    const isolated: [HTMLElement, boolean][] = []
    let branch: HTMLElement = dialog
    while (branch.parentElement) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && sibling instanceof HTMLElement) {
          isolated.push([sibling, sibling.inert]); sibling.inert = true
        }
      }
      if (branch.parentElement === document.body) break
      branch = branch.parentElement
    }
    document.body.style.overflow = 'hidden'
    const controls = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]')).filter(el => el.getClientRects().length)
    ;(controls()[0] ?? dialog).focus()
    const key = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = controls(), first = items[0], last = items[items.length - 1]
      if (!first) { event.preventDefault(); dialog.focus(); return }
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }
    dialog.addEventListener('keydown', key)
    return () => {
      dialog.removeEventListener('keydown', key)
      isolated.forEach(([element, inert]) => { element.inert = inert })
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus()
    }
  }, [open])
  return ref
}
