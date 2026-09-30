import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { UPPSKRIFTIR, type Fugl, type Uppskrift } from './uppskriftir'
import { VORUR, type Vara } from './vorur'
import { HOPAR, BAEIR } from './data'
import { SettIPoka } from './poki'

/* The slide-over panels (§15 blog reader, §23 product popup, §6 "Popups" of
   _docs/noho-teardown.md): one shell, a 50vw panel from the right on desktop and
   full width on compact, sliding on custom-popup (.6,0,0,1). The backdrop carries
   the cursor word "Loka". noho's own popups had no Escape and no focus trap (a
   listed defect); these have both, and they lock the page with the fixed-body
   method the mobile chrome standard requires.

   Five kinds: one recipe (with the ingredients and method as Ísfugl prints them),
   one cut with the nutrition sheet, a group of recipes with a bird filter, the
   whole ingredient list, and a photograph from the shoot. */

export type PopState =
  | { k: 'uppskrift'; id: number; aftur?: PopState }
  | { k: 'hopur'; s: string; fugl?: Fugl | 'allt' }
  | { k: 'vara'; n: string }
  | { k: 'vorur'; fugl?: Fugl | 'allt' }
  | { k: 'mynd'; img: string; n: string; kafli: string }
  | { k: 'bar'; id: string }
  | null

let st: PopState = null
const subs = new Set<() => void>()
const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }
export const pop = {
  open(p: PopState) { st = p; subs.forEach((f) => f()) },
  close() { st = null; subs.forEach((f) => f()) },
}
const snap = () => st
const usePop = () => useSyncExternalStore(sub, snap, snap)

export const POP_CSS = `
.isf-popB{position:fixed;inset:0;z-index:84;background:rgba(30,20,16,.42);opacity:0;pointer-events:none;
  transition:opacity .45s var(--ease-popup)}
.isf-popB{visibility:hidden}
.isf-popB.opid{opacity:1;pointer-events:auto;visibility:visible}
.isf-popB:not(.opid){transition:opacity .45s var(--ease-popup),visibility 0s .45s}
.isf-pop{position:fixed;top:0;right:0;bottom:0;z-index:85;width:50vw;background:var(--c-bg);color:var(--c-ink);
  transform:translateX(100%);visibility:hidden;display:flex;flex-direction:column;
  transition:transform .6s var(--ease-popup),visibility 0s .6s}
.isf-pop.opid{transform:none;visibility:visible;transition:transform .6s var(--ease-popup),visibility 0s}
.isf-pop:focus{outline:none}
/* compact: the panel is the full screen, so the backdrop is dropped, and the
   panel is what touches Safari's bottom toolbar and tints it paper */
@media (max-width:991px){.isf-pop{width:100vw}.isf-popB{display:none}}
.isf-popT{display:flex;justify-content:space-between;align-items:center;gap:1rem;
  padding:calc(var(--gut) + env(safe-area-inset-top)) var(--gut) var(--gut)}
.isf-popT > div{display:flex;align-items:center;gap:.8rem;min-width:0}
.isf-popAft{border:0;background:none;cursor:pointer;color:var(--c-ink);font-weight:500;font-size:.9rem;min-height:44px;padding:0}
.isf-popX{width:max(2.5vw,44px);height:max(2.5vw,44px);border:0;background:var(--c-hdr);color:var(--c-hdr-t);cursor:pointer;
  display:grid;place-items:center;flex:none;border-radius:999px}
.isf-popS{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:0 var(--gut) calc(var(--gut) * 2 + env(safe-area-inset-bottom));
  -webkit-overflow-scrolling:touch}
.isf-popS .isf-mask > *{transform:translateY(105%);transition:transform .9s var(--ease);transition-delay:calc(.25s + var(--i,0) * .06s)}
.isf-pop.opid .isf-popS .isf-mask > *{transform:none}
.isf-rMynd{aspect-ratio:3/2;position:relative;margin-bottom:1.4rem;background:var(--c-el);border-radius:var(--r,14px);overflow:hidden}
.isf-rMynd img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.isf-vMynd{aspect-ratio:4/5;max-height:62svh;width:100%;position:relative;margin-bottom:1.4rem;background:var(--c-el);border-radius:var(--r,14px);overflow:hidden}
.isf-vMynd img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.isf-poph3{margin:1.8rem 0 .6rem;font-family:var(--f-disp);font-weight:400;font-size:1.25rem;letter-spacing:-.01em}
.isf-poph4{margin:1.1rem 0 .3rem;font-weight:600;font-size:.95rem}
.isf-efni{margin:0;padding:0;list-style:none;display:grid;gap:.05rem}
.isf-efni li{padding:.42rem 0;box-shadow:inset 0 -1px 0 var(--c-lina);line-height:1.4}
.isf-skref{margin:0;padding:0;list-style:none;counter-reset:s;display:grid;gap:.75rem}
.isf-skref li{counter-increment:s;display:grid;grid-template-columns:2rem 1fr;gap:.6rem;line-height:1.5;max-width:60ch}
.isf-skref li::before{content:counter(s);display:grid;place-items:center;width:2rem;height:2rem;border-radius:999px;
  background:var(--c-el2);font-weight:600;font-size:.85rem;font-variant-numeric:tabular-nums}
.isf-vAct{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center;margin-top:1.2rem}
.isf-naer{width:100%;border-collapse:collapse;margin:1rem 0;font-variant-numeric:tabular-nums}
.isf-naer th,.isf-naer td{text-align:left;padding:.5rem 0;box-shadow:inset 0 -1px 0 var(--c-lina);font-weight:400}
.isf-naer td{text-align:right;font-weight:500}
.isf-sia{display:flex;gap:.4rem;flex-wrap:wrap;margin:1.2rem 0 .4rem}
.isf-sia button{border:0;cursor:pointer;min-height:44px;padding:0 1rem;border-radius:999px;background:var(--c-form);color:var(--c-ink);font-weight:500;font-size:.9rem;
  transition:background .2s var(--ease),color .2s var(--ease)}
.isf-sia button[aria-pressed="true"]{background:var(--c-ink);color:var(--c-bg)}
.isf-fLisi{list-style:none;margin:1.2rem 0 0;padding:0}
.isf-fLisi li{display:grid;grid-template-columns:5.6rem minmax(0,1fr) auto;gap:.9rem;align-items:center;
  padding:.65rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.isf-fLisi .isf-fM{width:5.6rem;aspect-ratio:3/2;border-radius:10px;overflow:hidden;background:var(--c-el);display:block;border:0;padding:0;cursor:pointer}
.isf-fLisi .isf-fM img{width:100%;height:100%;object-fit:cover}
.isf-fLisi .isf-fT{border:0;background:none;padding:0;text-align:left;cursor:pointer;color:inherit;font:inherit;min-height:44px}
.isf-fLisi b{font-weight:500;display:block;line-height:1.25}
.isf-fLisi small{display:block;color:var(--c-ink-med);font-size:.8rem;font-variant-numeric:tabular-nums}
.isf-fLisi .isf-sett{min-height:40px;padding:0 .8rem;font-size:.82rem;justify-self:start;align-self:center;border-radius:999px}
.isf-fLisi.v li{grid-template-columns:3.6rem minmax(0,1fr) auto}
.isf-fLisi.v .isf-fM{width:3.6rem;aspect-ratio:1;border-radius:999px}
@media (max-width:479px){.isf-fLisi li{grid-template-columns:4.6rem minmax(0,1fr);row-gap:.2rem}.isf-fLisi li > :last-child{grid-column:2}
  .isf-fLisi.v li{grid-template-columns:3.2rem minmax(0,1fr)}.isf-fLisi.v .isf-fM{width:3.2rem}
  .isf-fLisi .isf-fM{width:4.6rem}}
.isf-ljos{aspect-ratio:auto;margin:0 0 1.2rem}
.isf-ljos img{width:100%;height:auto;max-height:74svh;object-fit:contain;border-radius:var(--r,14px);background:var(--c-el)}
`

const S = (p: string) => `${import.meta.env.BASE_URL}isfugl/${p}.webp`
const HOPUR = new Map(HOPAR.map((h) => [h.s, h]))
const BY_ID = new Map(UPPSKRIFTIR.map((u) => [u.id, u]))
const FUGL_T: Record<Fugl, string> = { kjuklingur: 'Kjúklingur', kalkunn: 'Kalkúnn' }
const KIND_T: Record<Vara['kind'], string> = { hreint: 'Aðeins kjöt', kryddad: 'Kryddað eða fyllt', fulleldad: 'Fulleldað', unnid: 'Með ábata' }
const tala = (n: number | null, e: string) => (n == null ? 'Ekki gefið upp' : `${String(n).replace('.', ',')} ${e}`)

function Sia({ v, set }: { v: Fugl | 'allt'; set: (f: Fugl | 'allt') => void }) {
  return (
    <div className="isf-sia" role="group" aria-label="Fugl">
      {(['allt', 'kjuklingur', 'kalkunn'] as const).map((f) => (
        <button key={f} aria-pressed={v === f} onClick={() => set(f)}>{f === 'allt' ? 'Allt' : FUGL_T[f]}</button>
      ))}
    </div>
  )
}

function Uppskriftin({ u }: { u: Uppskrift }) {
  const hopur = HOPUR.get(u.hopur)
  return (
    <>
      <div className="isf-rMynd isf-mask"><img src={S(`r/${u.id}`)} alt={`${u.t}, sviðsett mynd`} width={1100} height={733} /></div>
      <div className="isf-mask"><p className="isf-merki" style={{ margin: 0 }}>{FUGL_T[u.fugl]} · {hopur?.t}</p></div>
      <div className="isf-mask"><h2 className="isf-disp" style={{ ['--i' as string]: 1, fontSize: 'clamp(1.9rem,3vw,3rem)' }}>{u.t}</h2></div>
      <p className="isf-daufur" style={{ margin: '.6rem 0 0' }}>{u.fyrir ? `Fyrir ${u.fyrir}` : 'Fjöldi ekki gefinn upp'}</p>
      <div className="isf-vAct"><SettIPoka id={u.id} n={u.t} /></div>
      {u.h.map((h, i) => (
        <div key={i}>
          {h.efni.length ? (
            <>
              {h.h ? <h4 className="isf-poph4">{h.h}</h4> : <h3 className="isf-poph3">Hráefni</h3>}
              <ul className="isf-efni">{h.efni.map((e, j) => <li key={j}>{e}</li>)}</ul>
            </>
          ) : null}
          {h.adferd.length ? (
            <>
              <h3 className="isf-poph3">{h.h ? `Aðferð, ${h.h.toLowerCase()}` : 'Aðferð'}</h3>
              <ol className="isf-skref">{h.adferd.map((a, j) => <li key={j}>{a}</li>)}</ol>
            </>
          ) : null}
        </div>
      ))}
    </>
  )
}

export function Popup() {
  const p = usePop()
  const id = useId()
  const panel = useRef<HTMLDivElement | null>(null)
  const aftur = useRef<HTMLElement | null>(null)
  const on = p !== null
  const [sia, setSia] = useState<Fugl | 'allt'>('allt')
  /* keep the last content while the panel slides out */
  const sidast = useRef<PopState>(null)
  if (p) sidast.current = p
  const c = p ?? sidast.current

  useEffect(() => { if (p && (p.k === 'hopur' || p.k === 'vorur')) setSia(p.fugl ?? 'allt') }, [p])

  useEffect(() => {
    const el = panel.current
    if (!el || !on) return
    aftur.current = document.activeElement as HTMLElement | null
    const lenis = (window as unknown as { __isfLenis?: { stop: () => void; start: () => void; scrollTo: (y: number, o?: object) => void } }).__isfLenis
    lenis?.stop()
    /* fixed-body scroll lock (mobile chrome standard), restored instantly */
    const y = window.scrollY
    const b = document.body.style
    const prev = { position: b.position, top: b.top, width: b.width }
    b.position = 'fixed'; b.top = `-${y}px`; b.width = '100%'
    /* keyboard users land on the close button; a tap lands on the dialog itself,
       so no focus ring flashes on a phone */
    const kb = (document.activeElement as HTMLElement | null)?.matches?.(':focus-visible') === true
    const t = window.setTimeout(() => (kb ? el.querySelector<HTMLElement>('.isf-popX') : el)?.focus({ preventScroll: true }), 60)
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { pop.close(); return }
      if (e.key !== 'Tab') return
      const f = [...el.querySelectorAll<HTMLElement>('button,a[href],input')].filter((x) => !x.hasAttribute('disabled'))
      if (!f.length) return
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus() }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus() }
    }
    window.addEventListener('keydown', key)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', key)
      b.position = prev.position; b.top = prev.top; b.width = prev.width
      window.scrollTo(0, y)
      lenis?.scrollTo(y, { immediate: true })
      lenis?.start()
      aftur.current?.focus?.()
    }
  }, [on])

  /* a new panel opens scrolled to the top, also when one replaces another */
  useEffect(() => { panel.current?.querySelector('.isf-popS')?.scrollTo(0, 0) }, [c && JSON.stringify(c)])

  let titill = ''
  let body = null
  let til: PopState = null
  if (c?.k === 'uppskrift') {
    const u = BY_ID.get(c.id)
    if (u) { titill = 'Uppskrift'; body = <Uppskriftin u={u} />; til = c.aftur ?? null }
  } else if (c?.k === 'hopur') {
    const h = HOPUR.get(c.s)
    if (h) {
      const l = UPPSKRIFTIR.filter((u) => u.hopur === h.s && (sia === 'allt' || u.fugl === sia))
      titill = h.t
      body = (
        <>
          <div className="isf-mask"><p className="isf-merki" style={{ margin: 0 }}>{l.length} {l.length === 1 ? 'uppskrift' : 'uppskriftir'}</p></div>
          <div className="isf-mask"><h2 className="isf-disp" style={{ ['--i' as string]: 1 }}>{h.t}</h2></div>
          <div className="isf-mask" style={{ marginTop: '1rem' }}><p className="isf-brod" style={{ ['--i' as string]: 2 }}>{h.d}</p></div>
          <Sia v={sia} set={setSia} />
          <ul className="isf-fLisi">
            {l.map((u) => (
              <li key={u.id}>
                <button className="isf-fM" onClick={() => pop.open({ k: 'uppskrift', id: u.id, aftur: { k: 'hopur', s: h.s, fugl: sia } })} aria-label={`Opna ${u.t}`} tabIndex={-1}>
                  <img src={S(`t/${u.id}`)} alt="" width={360} height={240} loading="lazy" />
                </button>
                <button className="isf-fT" onClick={() => pop.open({ k: 'uppskrift', id: u.id, aftur: { k: 'hopur', s: h.s, fugl: sia } })}>
                  <b>{u.t}</b>
                  <small>{FUGL_T[u.fugl]}{u.fyrir ? ` · fyrir ${u.fyrir}` : ''}</small>
                </button>
                <SettIPoka id={u.id} n={u.t} />
              </li>
            ))}
          </ul>
        </>
      )
    }
  } else if (c?.k === 'vara') {
    const v = VORUR.find((x) => x.n === c.n)
    if (v) {
      titill = FUGL_T[v.fugl]
      const mynd = v.mynd
      body = (
        <>
          {mynd ? <div className="isf-vMynd isf-mask"><img src={S(`c/${mynd}`)} alt={`${v.n}, sviðsett mynd`} width={900} height={1125} /></div> : null}
          <div className="isf-mask"><p className="isf-merki" style={{ margin: 0 }}>{FUGL_T[v.fugl]} · {KIND_T[v.kind]}</p></div>
          <div className="isf-mask"><h2 className="isf-disp" style={{ ['--i' as string]: 1, fontSize: 'clamp(1.9rem,3vw,3rem)' }}>{v.n}</h2></div>
          <h3 className="isf-poph3">Næringargildi í 100 g</h3>
          <table className="isf-naer">
            <tbody>
              <tr><th scope="row">Orka</th><td>{v.kkal == null ? 'Ekki gefið upp' : `${v.kj ?? ''} kJ / ${v.kkal} kkal`}</td></tr>
              <tr><th scope="row">Prótein</th><td>{tala(v.prot, 'g')}</td></tr>
              <tr><th scope="row">Fita</th><td>{tala(v.fita, 'g')}</td></tr>
              <tr><th scope="row">Salt</th><td>{tala(v.salt, 'g')}</td></tr>
            </tbody>
          </table>
          <h3 className="isf-poph3">Innihald</h3>
          <p className="isf-brod">{v.inn || 'Ekki gefið upp'}</p>
          <div className="isf-vAct">
            <button className="isf-btn isf-casH" onClick={() => pop.open({ k: 'hopur', s: v.fugl === 'kalkunn' ? 'hakk' : 'bringur', fugl: v.fugl })}>Uppskriftir með {v.fugl === 'kalkunn' ? 'kalkún' : 'kjúklingi'}</button>
          </div>
          <p className="isf-smatt" style={{ marginTop: '1.2rem' }}>Innihald og næringargildi eru af isfugl.is (uppfært 2021). Myndin er sviðsett, ekki pakkning Ísfugls.</p>
        </>
      )
    }
  } else if (c?.k === 'vorur') {
    titill = 'Innihaldslýsingar'
    const l = VORUR.filter((v) => sia === 'allt' || v.fugl === sia)
    body = (
      <>
        <div className="isf-mask"><p className="isf-merki" style={{ margin: 0 }}>{l.length} vörur</p></div>
        <div className="isf-mask"><h2 className="isf-disp" style={{ ['--i' as string]: 1 }}>Innihaldslýsingar</h2></div>
        <div className="isf-mask" style={{ marginTop: '1rem' }}><p className="isf-brod" style={{ ['--i' as string]: 2 }}>Næringargildi í 100 g eins og þau standa á síðum Ísfugls.</p></div>
        <Sia v={sia} set={setSia} />
        <ul className="isf-fLisi v">
          {l.map((v) => (
            <li key={v.n}>
              <button className="isf-fM" onClick={() => pop.open({ k: 'vara', n: v.n })} aria-label={`Opna ${v.n}`} tabIndex={-1}>
                {v.mynd ? <img src={S(`ct/${v.mynd}`)} alt="" width={96} height={96} loading="lazy" /> : null}
              </button>
              <button className="isf-fT" onClick={() => pop.open({ k: 'vara', n: v.n })}>
                <b>{v.n}</b>
                <small>{v.kkal == null ? 'Næringargildi ekki gefið upp' : `${v.kkal} kkal · ${String(v.prot ?? '').replace('.', ',')} g prótein`} · {KIND_T[v.kind]}</small>
              </button>
              <span aria-hidden="true">↗</span>
            </li>
          ))}
        </ul>
      </>
    )
  } else if (c?.k === 'mynd') {
    titill = c.kafli
    body = (
      <>
        <figure className="isf-ljos"><img src={S(`ph/${c.img}`)} alt={c.n} /></figure>
        <div className="isf-mask"><p className="isf-merki" style={{ margin: 0 }}>{c.kafli}</p></div>
        <div className="isf-mask"><h2 className="isf-sub" style={{ ['--i' as string]: 1 }}>{c.n}</h2></div>
        <p className="isf-smatt" style={{ marginTop: '1rem' }}>Úr myndasafni Ísfugls á isfugl.is.</p>
      </>
    )
  } else if (c?.k === 'bar') {
    const b = BAEIR.find((x) => x.id === c.id)
    if (b) {
      titill = 'Bærinn'
      body = (
        <>
          <div className="isf-rMynd isf-mask"><img src={S(`ph/${b.mynd}`)} alt={b.n} width={1600} height={1067} /></div>
          <div className="isf-mask"><p className="isf-merki" style={{ margin: 0 }}>{b.stadur}</p></div>
          <div className="isf-mask"><h2 className="isf-disp" style={{ ['--i' as string]: 1 }}>{b.n}</h2></div>
          <p className="isf-brod" style={{ marginTop: '1rem' }}>{b.texti}</p>
          <div className="isf-vAct"><a className="isf-btn isf-casH" href={b.hlekkur} target="_blank" rel="noopener">Lesa á isfugl.is ↗</a></div>
        </>
      )
    }
  }

  return (
    <>
      <div className={`isf-popB${on ? ' opid' : ''}`} onClick={() => pop.close()} data-bendill="Loka" aria-hidden="true" />
      <div ref={panel} className={`isf-pop${on ? ' opid' : ''}`} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`}
        tabIndex={-1} data-lenis-prevent="">
        <div className="isf-popT">
          <div>
            {til ? <button className="isf-popAft" onClick={() => pop.open(til)}>← Til baka</button> : null}
            <span id={`${id}-t`} className="isf-merki" style={{ margin: 0 }}>{titill}</span>
          </div>
          <button className="isf-popX" onClick={() => pop.close()} aria-label="Loka">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
        </div>
        <div className="isf-popS">{body}</div>
      </div>
    </>
  )
}
