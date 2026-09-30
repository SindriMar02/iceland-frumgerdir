import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { UPPSKRIFTIR, type Uppskrift } from './uppskriftir'

/* Innkaupalistinn. The Góa drawer (a sweets bag, then Katla's trade order list)
   re-aimed at what a visitor to Ísfugl actually does with a recipe: buy what is in
   it. Add recipes from the finder or from a recipe's own page; the drawer shows
   each recipe's ingredients exactly as Ísfugl prints them (no quantities are
   added up or converted, so nothing is invented) and copies the whole list.
   Nothing is sent anywhere and nothing is stored. */

let ids: number[] = []
let opid = false
const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())
const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }

export const poki = {
  add(id: number) { if (!ids.includes(id)) { ids = [...ids, id]; emit() } },
  remove(id: number) { ids = ids.filter((x) => x !== id); emit() },
  has: (id: number) => ids.includes(id),
  open(v: boolean) { opid = v; emit() },
  clear() { ids = []; emit() },
}

const snapIds = () => ids
const snapOpid = () => opid
export const usePoki = () => useSyncExternalStore(sub, snapIds, snapIds)
const useOpid = () => useSyncExternalStore(sub, snapOpid, snapOpid)
const BY_ID = new Map(UPPSKRIFTIR.map((u) => [u.id, u]))

const textiListans = (l: Uppskrift[]) =>
  l.map((u) => [
    `${u.t}${u.fyrir ? ` (fyrir ${u.fyrir})` : ''}`,
    ...u.h.flatMap((h) => [...(h.h ? [`${h.h}:`] : []), ...h.efni.map((e) => `  ${e}`)]),
  ].join('\n')).join('\n\n')

export const POKA_CSS = `
.isf-pokiH{display:inline-flex;align-items:center;gap:.5rem;border:0;background:transparent;cursor:pointer;
  font:inherit;font-size:.92rem;color:inherit;min-height:44px;padding:0 .2rem}
.isf-pokiH b{display:inline-grid;place-items:center;min-width:1.55rem;height:1.55rem;padding:0 .35rem;
  border-radius:999px;background:var(--c-gull);color:#F6EFE1;font-size:.8rem;font-weight:600;
  font-variant-numeric:tabular-nums;transition:transform .35s var(--ease)}
.isf-pokiH b.hopp{animation:isf-hopp .3s ease-out}
@keyframes isf-hopp{0%{transform:scale(1)}40%{transform:scale(1.2)}100%{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.isf-pokiH b.hopp{animation:none}}
@media (max-width:520px){.isf-pokiH .isf-pokiO{display:none}}

.isf-pokiBak{position:fixed;inset:0;z-index:80;background:rgba(30,20,16,.5);
  opacity:0;transition:opacity .2s ease-out;pointer-events:none}
.isf-pokiBak.on{transition-duration:.35s}
.isf-pokiBak{visibility:hidden}
.isf-pokiBak.on{opacity:1;pointer-events:auto;visibility:visible}
/* an opacity:0 fixed layer still tints Safari's bottom toolbar; hidden only
   after the fade so the close still reads */
.isf-pokiBak:not(.on){transition:opacity .2s ease-out,visibility 0s .2s}
.isf-pokiS{position:fixed;top:0;right:0;bottom:0;z-index:81;width:min(30rem,100%);
  background:var(--c-bg);color:var(--c-ink);display:flex;flex-direction:column;
  transform:translateX(100%);transition:transform .45s var(--ease);visibility:hidden;
  overscroll-behavior:contain}
.isf-pokiS.on{transform:translateX(0);visibility:visible}
/* with the keyboard up iOS pans the visual viewport past the fixed drawer's
   bottom edge, and the page showed through there; carry the ground on down */
.isf-pokiS::after{content:'';position:absolute;left:0;right:0;top:100%;height:100lvh;background:inherit}
/* enter is deliberate (.45s, the page's own curve); exit is a system
   response and snaps back out in .25s */
.isf-pokiS:not(.on){transition:transform .25s cubic-bezier(.23,1,.32,1),visibility 0s .25s}
.isf-pokiS:focus{outline:none}
.isf-pokiT{display:flex;align-items:center;justify-content:space-between;gap:1rem;
  padding:calc(1rem + env(safe-area-inset-top)) var(--gut) 1rem;box-shadow:inset 0 -1px 0 var(--c-lina)}
.isf-pokiT h2{margin:0;font-family:var(--f-disp);font-size:1.45rem;font-weight:400;letter-spacing:-.02em}
.isf-pokiX{width:44px;height:44px;border:0;background:transparent;cursor:pointer;color:inherit;
  font-size:1.5rem;line-height:1;display:grid;place-items:center}
.isf-pokiB{flex:1;overflow-y:auto;padding:1.2rem var(--gut) 2rem;-webkit-overflow-scrolling:touch}
.isf-pokiTomt{margin:0 0 1rem;color:var(--c-ink-med)}
.isf-pokiL{list-style:none;margin:0 0 1.6rem;padding:0;display:grid;gap:.6rem}
.isf-pokiL li{background:var(--c-form);border-radius:var(--r,12px);padding:.9rem 1rem 1rem}
.isf-pokiR{display:flex;justify-content:space-between;align-items:flex-start;gap:.8rem}
.isf-pokiR b{display:block;font-family:var(--f-disp);font-weight:400;font-size:1.12rem;line-height:1.15;letter-spacing:-.01em}
.isf-pokiR small{display:block;color:var(--c-ink-med);font-size:.8rem;margin-top:.15rem}
.isf-pokiR button{width:44px;height:44px;margin:-.5rem -.6rem 0 0;border:0;background:transparent;color:inherit;cursor:pointer;font-size:1.2rem}
.isf-pokiE{margin:.5rem 0 0;padding:0;list-style:none;font-size:.9rem;line-height:1.45;columns:1}
.isf-pokiE li{background:none;border-radius:0;padding:.08rem 0;display:block}
.isf-pokiE li.h{font-weight:600;margin-top:.5rem}
.isf-pokiE li.h:first-child{margin-top:0}
.isf-pokiF{padding:1rem var(--gut) calc(1rem + env(safe-area-inset-bottom));box-shadow:inset 0 1px 0 var(--c-lina);display:flex;gap:.5rem}
.isf-pokiF .isf-hnappur{flex:1;text-align:center;min-height:48px}
.isf-pokiF .isf-hnappur.dauf{background:transparent;color:var(--c-ink);box-shadow:inset 0 0 0 1.5px var(--c-lina);flex:none}
.isf-sett{display:inline-flex;align-items:center;gap:.45rem;border:0;cursor:pointer;font:inherit;
  font-size:.88rem;font-weight:500;min-height:44px;padding:0 .95rem;background:var(--c-ink);color:var(--c-bg);
  transition:background .15s ease-out,transform .12s ease-out}
.isf-sett:active{transform:scale(.97)}
.isf-sett.komid{background:var(--c-rautt);color:#F6EFE1}
.isf-settM{display:inline-block;height:1.3em;overflow:hidden;line-height:1.3em}
.isf-settM > span{display:grid;transition:transform .35s var(--ease)}
.isf-settM > span.upp{transform:translateY(-1.3em)}
.isf-settM > span > span{height:1.3em;white-space:nowrap}
/* anything the drawer adds or reveals rises in instead of appearing */
@keyframes isf-inn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.isf-pokiL > li,.isf-pokiTomt{animation:isf-inn .32s ease-out both;animation-delay:calc(var(--i,0) * .035s)}
@media (prefers-reduced-motion:reduce){.isf-settM > span{transition:none}
  .isf-pokiL > li,.isf-pokiTomt{animation-duration:.01s}}
@media (hover:hover) and (pointer:fine){.isf-sett:hover{background:var(--c-rautt);color:#F6EFE1}}
`

export function PokaHnappur() {
  const l = usePoki()
  const n = l.length
  const [hopp, setHopp] = useState(false)
  const prev = useRef(n)
  useEffect(() => {
    if (n > prev.current) { setHopp(true); const t = window.setTimeout(() => setHopp(false), 320); prev.current = n; return () => window.clearTimeout(t) }
    prev.current = n
  }, [n])
  return (
    <button className="isf-pokiH" data-poki-opna="" onClick={() => poki.open(true)}
      aria-label={`Innkaupalisti, ${n} ${n === 1 ? 'uppskrift' : 'uppskriftir'}`}>
      <span className="isf-pokiO">Innkaupalisti</span>
      <b className={hopp ? 'hopp' : ''}>{n}</b>
    </button>
  )
}

/** The add control on a recipe. Says what it did for a moment after. */
export function SettIPoka({ id, n }: { id: number; n: string }) {
  const ilagi = usePoki().includes(id)
  const [komid, setKomid] = useState(false)
  useEffect(() => { if (!komid) return; const t = window.setTimeout(() => setKomid(false), 1400); return () => window.clearTimeout(t) }, [komid])
  return (
    <button type="button" className={`isf-sett${komid || ilagi ? ' komid' : ''}`}
      onClick={() => { if (ilagi) poki.remove(id); else { poki.add(id); setKomid(true) } }}
      aria-pressed={ilagi} aria-label={ilagi ? `Taka ${n} af innkaupalistanum` : `Setja ${n} á innkaupalistann`}>
      {/* the two labels share one slot and trade places vertically, so the
          confirmation slides in rather than blinking over the old text */}
      <span className="isf-settM"><span className={ilagi ? 'upp' : ''}>
        <span>+ Á listann</span><span aria-hidden={!ilagi}>{komid ? 'Komið á listann' : 'Á listanum'}</span>
      </span></span>
    </button>
  )
}

export function Poki() {
  const idl = usePoki()
  const on = useOpid()
  const panel = useRef<HTMLDivElement | null>(null)
  const aftur = useRef<HTMLElement | null>(null)
  const [afritad, setAfritad] = useState(false)
  const id = useId()
  const l = idl.map((i) => BY_ID.get(i)).filter((u): u is Uppskrift => !!u)

  useEffect(() => {
    if (!on) return
    aftur.current = document.activeElement as HTMLElement | null
    const lenis = (window as unknown as { __isfLenis?: { stop: () => void; start: () => void } }).__isfLenis
    lenis?.stop()
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    const kb = (document.activeElement as HTMLElement | null)?.matches?.(':focus-visible') === true
    const t = window.setTimeout(() => (kb ? panel.current?.querySelector<HTMLElement>('.isf-pokiX') : panel.current)?.focus({ preventScroll: true }), 60)
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { poki.open(false); return }
      if (e.key !== 'Tab' || !panel.current) return
      const f = [...panel.current.querySelectorAll<HTMLElement>('button,a[href],input,textarea,select')]
        .filter((x) => !x.hasAttribute('disabled'))
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', key)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', key)
      root.style.overflow = prevOverflow
      lenis?.start()
      aftur.current?.focus?.()
    }
  }, [on])

  const afrita = async () => {
    const txt = textiListans(l)
    try { await navigator.clipboard.writeText(txt) } catch {
      const ta = document.createElement('textarea')
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy') } catch { /* nothing more to try */ }
      ta.remove()
    }
    setAfritad(true); window.setTimeout(() => setAfritad(false), 1800)
  }

  return (
    <>
      <div className={`isf-pokiBak${on ? ' on' : ''}`} onClick={() => poki.open(false)} aria-hidden="true" />
      <div ref={panel} className={`isf-pokiS${on ? ' on' : ''}`} role="dialog" aria-modal="true"
        aria-labelledby={`${id}-t`} tabIndex={-1} data-lenis-prevent="">
        <div className="isf-pokiT">
          <h2 id={`${id}-t`}>Innkaupalistinn þinn</h2>
          <button className="isf-pokiX" onClick={() => poki.open(false)} aria-label="Loka innkaupalista">×</button>
        </div>
        <div className="isf-pokiB">
          {l.length ? (
            <ul className="isf-pokiL">
              {l.map((u, i) => (
                <li key={u.id} style={{ ['--i' as string]: i }}>
                  <div className="isf-pokiR">
                    <span><b>{u.t}</b><small>{u.fyrir ? `Fyrir ${u.fyrir}` : 'Fjöldi ekki gefinn upp'}</small></span>
                    <button type="button" onClick={() => poki.remove(u.id)} aria-label={`Taka ${u.t} af listanum`}>×</button>
                  </div>
                  <ul className="isf-pokiE">
                    {u.h.flatMap((h, hi) => [
                      ...(h.h ? [<li key={`h${hi}`} className="h">{h.h}</li>] : []),
                      ...h.efni.map((e, ei) => <li key={`${hi}-${ei}`}>{e}</li>),
                    ])}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="isf-pokiTomt">
              Listinn er tómur. Veldu „+ Á listann“ við uppskrift og hráefnin birtast hér, eins og Ísfugl skrifar þau.
            </p>
          )}
          <p className="isf-smatt" style={{ margin: 0 }}>
            Magn er ekki lagt saman: hver uppskrift stendur eins og hún er birt. Ekkert er sent og ekkert vistað.
          </p>
        </div>
        <div className="isf-pokiF">
          <button className="isf-hnappur" type="button" onClick={afrita} disabled={!l.length}
            style={l.length ? undefined : { opacity: .45, cursor: 'not-allowed' }}>
            {afritad ? 'Afritað' : 'Afrita listann'}
          </button>
          {l.length ? <button className="isf-hnappur dauf" type="button" onClick={() => poki.clear()}>Tæma</button> : null}
        </div>
      </div>
    </>
  )
}
