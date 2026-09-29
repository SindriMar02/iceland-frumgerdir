import { useEffect, useId, useRef, useSyncExternalStore } from 'react'
import { KATALOGUR, type KVara } from './katalogur'
import { SettIPoka } from './poki'

/* The slide-over panels (§15 blog reader, §23 product popup, §6 "Popups" of
   _docs/noho-teardown.md): one shell, a 50vw panel from the right on desktop
   and full width on compact, sliding on custom-popup (.6,0,0,1). The backdrop
   carries the cursor word "Loka". noho's own popups had no Escape and no
   focus trap (a listed defect); these have both, and they lock the page with
   the fixed-body method the mobile chrome standard requires.

   Two kinds: a single product (from the gallery strip and the product
   panels) and a whole category from Katla's catalogue (from the story
   carousel), which is where all 217 listings live. */

export type PopState =
  | { k: 'vara'; v: KVara; flokkur?: string; grunnur?: string }
  | { k: 'flokkur'; s: string }
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
.kat-popB{position:fixed;inset:0;z-index:84;background:rgba(42,22,20,.35);opacity:0;pointer-events:none;
  transition:opacity .45s var(--ease-popup)}
.kat-popB{visibility:hidden}
.kat-popB.opid{opacity:1;pointer-events:auto;visibility:visible}
.kat-popB:not(.opid){transition:opacity .45s var(--ease-popup),visibility 0s .45s}
.kat-pop{position:fixed;top:0;right:0;bottom:0;z-index:85;width:50vw;background:var(--c-bg);color:var(--c-ink);
  transform:translateX(100%);visibility:hidden;display:flex;flex-direction:column;
  transition:transform .6s var(--ease-popup),visibility 0s .6s}
.kat-pop.opid{transform:none;visibility:visible;transition:transform .6s var(--ease-popup),visibility 0s}
/* compact: the panel is the full screen, so the backdrop is dropped, and the
   panel is what touches Safari's bottom toolbar and tints it paper */
@media (max-width:991px){.kat-pop{width:100vw}.kat-popB{display:none}}
.kat-popT{display:flex;justify-content:space-between;align-items:center;gap:1rem;
  padding:calc(var(--gut) + env(safe-area-inset-top)) var(--gut) var(--gut)}
.kat-popX{width:max(2.5vw,44px);height:max(2.5vw,44px);border:0;background:var(--c-hdr);color:var(--c-hdr-t);cursor:pointer;
  display:grid;place-items:center;flex:none}
.kat-popS{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:0 var(--gut) calc(var(--gut) * 2 + env(safe-area-inset-bottom));
  -webkit-overflow-scrolling:touch}
.kat-popS .kat-mask > *{transform:translateY(105%);transition:transform .9s var(--ease);transition-delay:calc(.25s + var(--i,0) * .06s)}
.kat-pop.opid .kat-popS .kat-mask > *{transform:none}
.kat-vMynd{background:var(--grunnur,var(--c-el));aspect-ratio:4/3;position:relative;margin-bottom:1.6rem}
.kat-vMynd img{position:absolute;inset:10%;width:80%;height:80%;object-fit:contain;filter:drop-shadow(0 18px 24px rgba(28,18,12,.3))}
.kat-vDl{display:grid;grid-template-columns:auto 1fr;gap:.35rem 1.4rem;margin:1.4rem 0;font-variant-numeric:tabular-nums}
.kat-vDl dt{color:var(--c-ink-med)}
.kat-vDl dd{margin:0}
.kat-vAct{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}
.kat-fLisi{list-style:none;margin:1.6rem 0 0;padding:0}
.kat-fLisi li{display:grid;grid-template-columns:3.4rem minmax(0,1fr) auto;gap:.9rem;align-items:center;
  padding:.7rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.kat-fLisi .kat-fM{width:3.4rem;height:3.4rem;background:var(--c-el);display:grid;place-items:center;padding:.3rem}
.kat-fLisi .kat-fM img{max-height:100%;width:auto;object-fit:contain}
/* 186 of the 217 listings have no pack shot on file; the initial stands in
   so the row reads as set, not as an image that failed to load */
.kat-fLisi .kat-fM b{font-family:var(--f-disp);font-weight:400;font-size:1.6rem;line-height:1;color:var(--c-ink-max)}
.kat-fLisi b{font-weight:500;display:block;line-height:1.3}
.kat-fLisi small{display:block;color:var(--c-ink-med);font-size:.8rem;font-variant-numeric:tabular-nums}
.kat-fLisi small a{text-decoration:underline;text-underline-offset:2px}
.kat-fLisi .kat-sett{min-height:40px;padding:0 .8rem;font-size:.82rem}
@media (max-width:479px){.kat-fLisi li{grid-template-columns:2.8rem minmax(0,1fr)}.kat-fLisi li > :last-child{grid-column:2}
  .kat-fLisi .kat-fM{width:2.8rem;height:2.8rem}}
`

const FLOKKUR_INN: Record<string, string> = {
  blondur: 'Vöfflumix, íslenskar pönnsur, amerískar pönnukökur, súkkulaðikaka og baunasúpugrunnur.',
  dropar: 'Sjö bragðtegundir í 30 ml glösum, frá vanillu til appelsínu.',
  deig: 'Tilbúið smákökudeig í sex tegundum.',
  krydd: 'Kanill, karrí, lyftiduft, matarsódi, hjartarsalt, vanillusykur, púðursykur, glassúr, kakó og rasp.',
  salt: 'Borðsalt, sjávarsalt, gróft salt og Epsom salt.',
  bakari: 'Blöndur, marsípan, smjörlíki, ger, dropar og áhöld fyrir bakarí.',
  kjot: 'Krydd, kryddblöndur, marineringar, raspur og net fyrir kjötvinnslur.',
}

const S = (img: string) => `${import.meta.env.BASE_URL}katla/${img}.webp`
const PDF = (p: string) => (p.startsWith('http') ? p : `https://katla.is${encodeURI(p)}`)

export function Popup() {
  const p = usePop()
  const id = useId()
  const panel = useRef<HTMLDivElement | null>(null)
  const aftur = useRef<HTMLElement | null>(null)
  const on = p !== null
  /* keep the last content while the panel slides out */
  const sidast = useRef<PopState>(null)
  if (p) sidast.current = p
  const c = p ?? sidast.current

  useEffect(() => {
    const el = panel.current
    if (!el) return
    if (!on) return
    aftur.current = document.activeElement as HTMLElement | null
    const lenis = (window as unknown as { __katLenis?: { stop: () => void; start: () => void; scrollTo: (y: number, o?: object) => void } }).__katLenis
    lenis?.stop()
    /* fixed-body scroll lock (mobile chrome standard), restored instantly */
    const y = window.scrollY
    const b = document.body.style
    const prev = { position: b.position, top: b.top, width: b.width }
    b.position = 'fixed'; b.top = `-${y}px`; b.width = '100%'
    const t = window.setTimeout(() => el.querySelector<HTMLElement>('.kat-popX')?.focus(), 60)
    el.querySelector('.kat-popS')?.scrollTo(0, 0)
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

  let titill = ''
  let body = null
  if (c?.k === 'vara') {
    const v = c.v
    titill = v.n
    body = (
      <>
        {v.img ? (
          <div className="kat-vMynd kat-mask" style={{ ['--grunnur' as string]: c.grunnur }}>
            <img src={S(v.img)} alt={v.n} width={600} height={600} />
          </div>
        ) : null}
        <div className="kat-mask"><p className="kat-merki" style={{ margin: 0 }}>{c.flokkur ?? 'Katla'}</p></div>
        <div className="kat-mask"><h2 className="kat-sub" style={{ ['--i' as string]: 1 }}>{v.n}</h2></div>
        <dl className="kat-vDl">
          <dt>Pakkning</dt><dd>{v.pk || 'Eftir samkomulagi'}</dd>
          {v.nr ? <><dt>Vörunúmer</dt><dd>{v.nr}</dd></> : null}
        </dl>
        {v.d ? <p className="kat-brod" style={{ marginBottom: '1.4rem' }}>{v.d}</p> : null}
        <div className="kat-vAct">
          <SettIPoka v={v} />
          {v.pdf ? <a className="kat-nobg" href={PDF(v.pdf)} target="_blank" rel="noopener">Innihaldslýsing <i>↗</i></a> : null}
        </div>
      </>
    )
  } else if (c?.k === 'flokkur') {
    const f = KATALOGUR.find((x) => x.s === c.s)
    titill = f?.t ?? ''
    body = f ? (
      <>
        <div className="kat-mask"><p className="kat-merki" style={{ margin: 0 }}>{f.items.length} vörur</p></div>
        <div className="kat-mask"><h2 className="kat-disp" style={{ ['--i' as string]: 1 }}>{f.t}</h2></div>
        <div className="kat-mask" style={{ marginTop: '1rem' }}><p className="kat-brod" style={{ ['--i' as string]: 2 }}>{FLOKKUR_INN[f.s]}</p></div>
        <ul className="kat-fLisi">
          {f.items.map((v, i) => (
            <li key={`${v.nr}-${i}`}>
              <span className="kat-fM">{v.img ? <img src={S(v.img)} alt="" width={120} height={120} loading="lazy" /> : <b aria-hidden="true">{v.n[0]}</b>}</span>
              <span>
                <b>{v.n}</b>
                <small>
                  {v.pk}{v.nr ? ` · vörunr. ${v.nr}` : ''}
                  {v.pdf ? <> · <a href={PDF(v.pdf)} target="_blank" rel="noopener">innihald</a></> : null}
                </small>
              </span>
              <SettIPoka v={v} />
            </li>
          ))}
        </ul>
      </>
    ) : null
  }

  return (
    <>
      <div className={`kat-popB${on ? ' opid' : ''}`} onClick={() => pop.close()} data-bendill="Loka" aria-hidden="true" />
      <div ref={panel} className={`kat-pop${on ? ' opid' : ''}`} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`}
        data-lenis-prevent="">
        <div className="kat-popT">
          <span id={`${id}-t`} className="kat-merki" style={{ margin: 0 }}>{titill}</span>
          <button className="kat-popX" onClick={() => pop.close()} aria-label="Loka">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
        </div>
        <div className="kat-popS">{body}</div>
      </div>
    </>
  )
}
