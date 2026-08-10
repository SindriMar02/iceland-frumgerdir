import { useEffect, useRef, useState } from 'react'
import type Lenis from 'lenis'

/* ═════════════════════════════════════════════════════════════════════════
   Mobile navigation.

   The comma nav is the desktop chrome and it does fit at 390px, but it packs
   five Icelandic words into 227px at 12px — technically inside the viewport,
   practically unreadable and untappable. Below 760px it is replaced by a
   two-line mark that morphs into a cross, and a full-field panel.

   Kept in this page's language rather than a generic drawer: paper-white
   field, ink type, names set large, no pill, no rounded panel, no shadow.
   Items arrive with the same masked rise the rest of the page uses.

   Behaviour that is easy to get wrong and is handled here:
     · Lenis is stopped while the panel is open, or the page scrolls behind it
     · Escape closes, focus moves to the first link on open and back to the
       button on close, and Tab is trapped inside the panel
     · aria-expanded / aria-controls on the button, aria-hidden on the panel
       when closed, so it is not a keyboard trap for screen readers
     · 44px minimum tap target on the button and every link
     · under prefers-reduced-motion the panel appears with no wipe or stagger
   ═════════════════════════════════════════════════════════════════════════ */

export interface NavItem { id: string; label: string }

export function MobileNav({
  items, lenisRef,
}: { items: readonly NavItem[]; lenisRef: React.MutableRefObject<Lenis | null> }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const lenis = lenisRef.current
    if (open) lenis?.stop()
    else lenis?.start()

    if (!open) return

    // focus the first link once the panel is actually on screen
    const first = panelRef.current?.querySelector<HTMLAnchorElement>('a')
    first?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); return }
      if (e.key !== 'Tab') return
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>('a,button')
      if (!nodes || !nodes.length) return
      const list = Array.from(nodes)
      const idx = list.indexOf(document.activeElement as HTMLElement)
      if (e.shiftKey && idx <= 0) { e.preventDefault(); list[list.length - 1].focus() }
      else if (!e.shiftKey && idx === list.length - 1) { e.preventDefault(); list[0].focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, lenisRef])

  // release Lenis if this unmounts while open
  useEffect(() => () => { lenisRef.current?.start() }, [lenisRef])

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={`gk-burger${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-controls="gk-menu"
        aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden />
        <span aria-hidden />
      </button>

      <div
        id="gk-menu"
        ref={panelRef}
        className={`gk-menu${open ? ' is-open' : ''}`}
        aria-hidden={!open}
        {...(!open ? { inert: '' } : {})}
      >
        <nav aria-label="Valmynd">
          <ul>
            {items.map((n, i) => (
              <li key={n.id} style={{ '--i': i } as React.CSSProperties}>
                <a href={`#${n.id}`} onClick={() => setOpen(false)}>
                  <span>{n.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

export const MOBILE_NAV_CSS = `
.gk-burger{display:none}
.gk-menu{display:none}

@media (max-width:759px){
  .gk-nav{display:none}

  /* two hairlines that cross. 44px box, 22px marks, so the target is real
     while the mark stays light. currentColor so it inherits the chrome's
     white-over-hero / ink-over-page flip for free. */
  .gk-burger{
    display:block;position:relative;width:44px;height:44px;margin:-11px -12px -11px 0;
    padding:0;border:0;background:none;color:inherit;cursor:pointer;pointer-events:auto;z-index:60}
  .gk-burger span{
    position:absolute;left:11px;width:22px;height:1px;background:currentColor;
    transition:transform .5s cubic-bezier(.17,.84,.44,1),opacity .3s linear}
  .gk-burger span:nth-child(1){top:20px}
  .gk-burger span:nth-child(2){top:26px}
  .gk-burger.is-open span:nth-child(1){transform:translateY(3px) rotate(45deg)}
  .gk-burger.is-open span:nth-child(2){transform:translateY(-3px) rotate(-45deg)}
  .gk-burger.is-open{color:#111}

  /* the field wipes down from the top edge, the page never moves */
  .gk-menu{
    display:block;position:fixed;inset:0;z-index:50;background:#fff;
    clip-path:inset(0 0 100% 0);transition:clip-path .68s cubic-bezier(.17,.84,.44,1);
    visibility:hidden}
  .gk-menu.is-open{clip-path:inset(0 0 0 0);visibility:visible}

  .gk-menu nav{position:absolute;left:clamp(18px,3.4vw,52px);right:clamp(18px,3.4vw,52px);
    bottom:clamp(28px,9vw,64px)}
  .gk-menu ul{list-style:none;margin:0;padding:0}
  .gk-menu li{overflow:hidden}
  .gk-menu a{display:block;min-height:44px;padding:.22em 0;color:#111;text-decoration:none;
    font-size:clamp(2rem,11vw,3.2rem);line-height:1.14;letter-spacing:-.028em}
  /* the same masked rise the page uses, staggered by index */
  .gk-menu a>span{display:block;transform:translateY(110%);
    transition:transform .72s cubic-bezier(.17,.84,.44,1)}
  .gk-menu.is-open a>span{transform:none;transition-delay:calc(.14s + var(--i) * .055s)}
  .gk-menu a:focus-visible{outline:2px solid #111;outline-offset:4px}
}

@media (max-width:759px) and (prefers-reduced-motion:reduce){
  .gk-menu,.gk-menu.is-open{transition:none}
  .gk-menu a>span{transform:none;transition:none}
  .gk-burger span{transition:none}
}
`
