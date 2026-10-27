import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { ASSETS } from './assets.gen'
import { Eydublad } from './eydublad'
import { STAERRA } from './forms'
import { KATALOGUR } from './katalogur'
import { langt, ofnaemisLina, skilmali, stutt } from './ofnaemi'
import { SettIPoka } from './poki'
import { ALLERGENS, PK, PRODUCTS, SHOPS, img, productBySlug } from './vorur'



export type PopState =
  | { k: 'vara'; slug: string }
  | { k: 'flokkur'; s: string }
  | { k: 'hvar' }
  | { k: 'staerra' }
  | { k: 'ofnaemi' }
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
.hb-popB{position:fixed;inset:0;z-index:84;background:rgba(16,32,56,.35);opacity:0;pointer-events:none;
  transition:opacity .45s var(--ease-popup)}
.hb-popB{visibility:hidden}
.hb-popB.opid{opacity:1;pointer-events:auto;visibility:visible}
.hb-popB:not(.opid){transition:opacity .45s var(--ease-popup),visibility 0s .45s}
.hb-pop{position:fixed;top:0;right:0;bottom:0;z-index:85;width:50vw;background:var(--c-bg);color:var(--c-ink);
  transform:translateX(100%);visibility:hidden;display:flex;flex-direction:column;
  transition:transform .6s var(--ease-popup),visibility 0s .6s}
.hb-pop.opid{transform:none;visibility:visible;transition:transform .6s var(--ease-popup),visibility 0s}

@media (max-width:991px){.hb-pop{width:100vw}.hb-popB{display:none}}
.hb-popT{display:flex;justify-content:space-between;align-items:center;gap:1rem;
  padding:calc(var(--gut) + env(safe-area-inset-top)) var(--gut) var(--gut)}
.hb-popX{width:max(2.5vw,44px);height:max(2.5vw,44px);border:0;background:var(--c-hdr);color:var(--c-hdr-t);cursor:pointer;
  display:grid;place-items:center;flex:none;border-radius:999px}
.hb-popS{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:0 var(--gut) calc(var(--gut) * 2 + env(safe-area-inset-bottom));
  -webkit-overflow-scrolling:touch}
.hb-popS .hb-mask > *{transform:translateY(105%);transition:transform .9s var(--ease);transition-delay:calc(.25s + var(--i,0) * .06s)}
.hb-pop.opid .hb-popS .hb-mask > *{transform:none}
.hb-vMynd{background:var(--grunnur,var(--c-el));aspect-ratio:4/3;position:relative;margin-bottom:1.6rem;display:flex;align-items:center;justify-content:center;gap:4%;padding:7% 6%}
.hb-vMynd img{height:100%;width:auto;max-width:48%;object-fit:contain;filter:drop-shadow(0 18px 24px rgba(28,18,12,.3))}
.hb-vMynd img + img{transform:rotate(5deg)}
.hb-vMynd.einn img{max-width:80%}
.hb-vMynd.ljos{aspect-ratio:auto;height:auto;padding:0}
.hb-vMynd.ljos img{width:100%;height:auto;max-width:100%;filter:none}
.hb-vDl{display:grid;grid-template-columns:auto 1fr;gap:.35rem 1.4rem;margin:1.4rem 0;font-variant-numeric:tabular-nums}
.hb-vDl dt{color:var(--c-ink-med)}
.hb-vDl dd{margin:0}
.hb-vAct{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}
.hb-vMerki{display:flex;gap:.4rem;flex-wrap:wrap;margin:0 0 1rem;padding:0;list-style:none}
.hb-vMerki li{padding:.15rem .7rem;border-radius:999px;background:var(--c-el2);font-size:.8rem;font-weight:500}
.hb-vMerki li.nytt{background:var(--c-gull)}
.hb-vTafla{width:100%;border-collapse:collapse;margin:0 0 1rem;max-width:34rem}
.hb-vTafla th,.hb-vTafla td{padding:.6rem .3rem;text-align:left;font-weight:400;box-shadow:inset 0 -1px 0 var(--c-lina)}
.hb-vTafla tr.hef th,.hb-vTafla tr.hef td{font-weight:600;color:var(--c-rautt)}
.hb-vTafla i{font-style:normal;display:inline-block;width:1.1em}
.hb-vMerkingar{display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0}
.hb-vMerkingar button{min-height:44px;padding:0 1.1rem;border:1.5px solid var(--c-lina);background:none;cursor:pointer;color:inherit;font-size:.9rem;font-weight:500;border-radius:999px}
.hb-vMerkingar button[aria-pressed="true"]{background:var(--c-ink);color:var(--c-bg);border-color:var(--c-ink)}
.hb-vMid{margin:0 0 1.4rem;background:#fff;border-radius:var(--r,0);overflow:hidden}
.hb-vMid img{width:100%;height:auto}
.hb-vLjos{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:1.6rem 0 0}
.hb-vLjos img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--r,0);background:var(--c-el)}
.hb-fLisi{list-style:none;margin:1.6rem 0 0;padding:0}
.hb-fLisi li{display:grid;grid-template-columns:3.6rem minmax(0,1fr) auto;gap:.9rem;align-items:center;
  padding:.7rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.hb-fLisi .hb-fM{width:3.6rem;height:4rem;background:var(--grunnur,var(--c-el));display:flex;align-items:center;justify-content:center;padding:.3rem;border-radius:var(--r,0)}
.hb-fLisi .hb-fM img{height:100%;width:auto;max-width:100%;object-fit:contain}
.hb-fLisi button.hb-nafn{border:0;background:none;padding:0;cursor:pointer;color:inherit;text-align:left;font:inherit;font-weight:500;line-height:1.3;min-height:44px;display:flex;align-items:center}
.hb-fLisi small{display:block;color:var(--c-ink-med);font-size:.8rem}
.hb-fLisi .hb-sett{min-height:40px;padding:0 .8rem;font-size:.82rem}
@media (max-width:479px){.hb-fLisi li{grid-template-columns:3rem minmax(0,1fr)}.hb-fLisi li > :last-child{grid-column:2}
  .hb-fLisi .hb-fM{width:3rem;height:3.4rem}}
.hb-verslun{list-style:none;margin:1.6rem 0 2rem;padding:0;display:grid;gap:.35rem}
.hb-verslun a{display:grid;gap:.15rem;padding:1rem 1.1rem;background:var(--c-el);border-radius:var(--r,0);min-height:44px;transition:background .25s var(--ease)}
.hb-verslun b{font-family:var(--f-disp);font-weight:400;font-size:1.5rem;line-height:1.1;letter-spacing:-.02em}
.hb-verslun span{font-size:.88rem;color:var(--c-ink-med)}
@media (hover:hover) and (pointer:fine){.hb-verslun a:hover{background:var(--c-el2)}}
.hb-pEgg{list-style:none;margin:1.4rem 0 2rem;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:.35rem}
.hb-pEgg li{background:var(--grunnur);border-radius:var(--r,0);aspect-ratio:3/4;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:.7rem .5rem .6rem}
.hb-pEgg img{height:78%;width:auto;max-width:100%;object-fit:contain;filter:drop-shadow(0 10px 14px rgba(28,18,12,.28))}
.hb-pEgg span{font-size:.8rem;font-weight:500;text-align:center;line-height:1.2}
.hb-matrix{overflow-x:auto;margin:1.4rem 0 1rem;-webkit-overflow-scrolling:touch;box-shadow:inset 0 0 0 1px var(--c-lina);border-radius:var(--r,0)}
.hb-matrix table{width:100%;min-width:36rem;border-collapse:collapse;font-size:.9rem}
.hb-matrix th,.hb-matrix td{padding:.5rem .6rem;text-align:center;white-space:nowrap;box-shadow:inset 0 -1px 0 var(--c-lina)}
.hb-matrix thead th{font-size:.74rem;letter-spacing:.06em;text-transform:capitalize;color:var(--c-ink-med);font-weight:500}
.hb-matrix thead th:first-child{position:sticky;left:0;z-index:2;background:var(--c-bg);box-shadow:inset 0 -1px 0 var(--c-lina),1px 0 0 var(--c-lina)}
.hb-matrix tbody th{z-index:1}
.hb-matrix tbody th{text-align:left;font-weight:500;position:sticky;left:0;background:var(--c-bg);box-shadow:inset 0 -1px 0 var(--c-lina),1px 0 0 var(--c-lina)}
.hb-matrix td.hef{font-weight:700;color:var(--c-rautt);background:color-mix(in srgb,var(--c-rautt) 7%,transparent)}
.hb-matrix td.oljost{color:var(--c-ink-max)}
`

const FLOKKUR_INN:Record<string,string>={}

export function Popup() {
  const p = usePop()
  const id = useId()
  const panel = useRef<HTMLDivElement | null>(null)
  const aftur = useRef<HTMLElement | null>(null)
  const [merki, setMerki] = useState<string | null>(null)
  const on = p !== null
  
  const sidast = useRef<PopState>(null)
  if (p) sidast.current = p
  const c = p ?? sidast.current

  useEffect(() => { setMerki(null) }, [c && c.k === 'vara' ? c.slug : null])

  
  const efni = p ? JSON.stringify(p) : ''
  useEffect(() => { if (efni) panel.current?.querySelector('.hb-popS')?.scrollTo(0, 0) }, [efni])

  useEffect(() => {
    const el = panel.current
    if (!el) return
    if (!on) return
    aftur.current = document.activeElement as HTMLElement | null
    const lenis = (window as unknown as { __hbLenis?: { stop: () => void; start: () => void; scrollTo: (y: number, o?: object) => void } }).__hbLenis
    lenis?.stop()
    
    const y = window.scrollY
    const b = document.body.style
    const prev = { position: b.position, top: b.top, width: b.width }
    b.position = 'fixed'; b.top = `-${y}px`; b.width = '100%'
    const t = window.setTimeout(() => (document.documentElement.dataset.input==='pointer'?el:el.querySelector<HTMLElement>('.hb-popX'))?.focus({preventScroll:true}), 60)
    el.querySelector('.hb-popS')?.scrollTo(0, 0)
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { pop.close(); return }
      if (e.key !== 'Tab') return
      const f = [...el.querySelectorAll<HTMLElement>('button,a[href],input,textarea,select')].filter((x) => !x.hasAttribute('disabled'))
      if (!f.length) return
      if (e.shiftKey && (document.activeElement === f[0] || document.activeElement === el)) { e.preventDefault(); f[f.length - 1].focus() }
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
    const v = productBySlug(c.slug)
    if (v) {
      const a = ASSETS[v.slug]
      titill = v.name.is
      const merkNafn: Record<string, string> = { ing: 'Innihaldslýsing', 'nf-eu': 'Næringargildi (ESB)', 'nf-us': 'Næringargildi (US)' }
      const merkimyndir = [v.labels.ing ? 'ing' : '', v.labels.nfEu ? 'nf-eu' : '', v.labels.nfUs ? 'nf-us' : ''].filter(Boolean)
      const dim = (m: string) => (m === 'ing' ? a?.ing : m === 'nf-eu' ? a?.nfEu : a?.nfUs)
      body = (
        <>
          <div className={`hb-vMynd hb-mask${a?.pack && a?.open ? '' : ' einn'}`} style={{ ['--grunnur' as string]: v.tint }}>
            {a?.pack ? <img src={PK(v.slug, 'pack', 'm')} alt={`${v.name.is}, pakkning`} width={a.pack[0]} height={a.pack[1]} />
              : a?.macros?.[0] ? <img src={img(v.slug, 'm1.webp')} alt={v.name.is} width={a.macros[0][0]} height={a.macros[0][1]} /> : null}
            {a?.pack && a?.open ? <img src={PK(v.slug, 'open', 'm')} alt={`${v.name.is}, opinn poki`} width={a.open[0]} height={a.open[1]} /> : null}
          </div>
          <div className="hb-mask"><p className="hb-merki" style={{ margin: 0 }}>H-Berg</p></div>
          <div className="hb-mask"><h2 className="hb-sub" style={{ ['--i' as string]: 1 }}>{v.name.is}</h2></div>
          <p className="hb-brod" style={{ margin: '1rem 0 0' }}>{v.desc.is}</p>
          {(v.isNew || v.madeToOrder || v.season) && (
            <ul className="hb-vMerki" style={{ marginTop: '1rem' }}>
              {v.isNew && <li className="nytt">Nýtt</li>}
              {v.madeToOrder && <li>Framleitt eftir pöntun</li>}
              {v.season === 'staerra' && <li>Stærri pakkningar</li>}
              {v.season === 'jol' && <li>Jól</li>}
            </ul>
          )}
          {v.weight ? <dl className="hb-vDl"><dt>Þyngd</dt><dd>{v.weight}</dd></dl> : null}
          <h3>Innihald</h3><p className="hb-brod">{v.ingredients || 'Ekki birt á vefnum. Staðfest á umbúðum.'}</p>
          <h3>Næringargildi í 100 g</h3>{!v.nutritionRows.length && <p>Ekki birt á vefnum.</p>}<table className="hb-vTafla"><tbody>{v.nutritionRows.map((r,i)=><tr key={i}><th scope="row">{r[0]}</th><td>{r[1]}</td></tr>)}</tbody></table>
          <a href={v.source} target="_blank" rel="noopener noreferrer">Heimild á hberg.is ↗</a>
          <h3 style={{ margin: '1.6rem 0 .6rem', fontWeight: 500 }}>Ofnæmisvaldar</h3>
          {v.allergens === null ? (
            <p className="hb-brod">Ofnæmisgögn eru óstaðfest. Staðfest á umbúðum.</p>
          ) : (
            <table className="hb-vTafla">
              <caption className="hb-sr" style={{ position: 'absolute', left: -9999 }}>Ofnæmisvaldar</caption>
              <tbody>
                {ALLERGENS.map((x) => {
                  const hef = v.allergens!.includes(x.id)
                  return (
                    <tr key={x.id} className={hef ? 'hef' : ''}>
                      <th scope="row">{langt(x.id)}</th>
                      <td><i aria-hidden="true">{hef ? '●' : '?'}</i> {hef ? 'Nefnt í innihaldi' : 'Óstaðfest, sjá umbúðir'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          {merkimyndir.length > 0 && (
            <div className="hb-vMerkingar" role="group" aria-label="Merkingar á umbúðum">
              {merkimyndir.map((m) => (
                <button key={m} type="button" aria-pressed={merki === m} onClick={() => setMerki(merki === m ? null : m)}>{merkNafn[m]}</button>
              ))}
            </div>
          )}
          {merki && dim(merki) ? (
            <div className="hb-vMid"><img src={img(v.slug, `${merki}.webp`)} width={dim(merki)![0]} height={dim(merki)![1]} alt={`${merkNafn[merki]}, ${v.name.is}. Mynd af miða á umbúðum.`} /></div>
          ) : null}
          <p className="hb-smatt" style={{ marginBottom: '1.4rem' }}>{skilmali}</p>
          <div className="hb-vAct">
            {v.madeToOrder
              ? <button type="button" className="hb-btn hb-casH" onClick={() => pop.open({ k: 'staerra' })}>Panta fyrir félag</button>
              : <SettIPoka slug={v.slug} />}
          </div>
          {a?.macros && a.macros.length > (v.hasPack ? 0 : 1) ? (
            <div className="hb-vLjos">
              {a.macros.map((m, i) => (!v.hasPack && i === 0 ? null : (
                <img key={i} src={img(v.slug, `m${i + 1}-s.webp`)} width={m[0]} height={m[1]} alt={`${v.name.is}, mynd ${i + 1}`} loading="lazy" />
              )))}
            </div>
          ) : null}
        </>
      )
    }
  } else if (c?.k === 'flokkur') {
    const f = KATALOGUR.find((x) => x.s === c.s)
    titill = f?.t ?? ''
    body = f ? (
      <>
        <div className="hb-mask"><p className="hb-merki" style={{ margin: 0 }}>{f.items.length} vörur</p></div>
        <div className="hb-mask"><h2 className="hb-disp" style={{ ['--i' as string]: 1 }}>{f.t}</h2></div>
        <div className="hb-mask" style={{ marginTop: '1rem' }}><p className="hb-brod" style={{ ['--i' as string]: 2 }}>{FLOKKUR_INN[f.s]}</p></div>
        <ul className="hb-fLisi">
          {f.items.map((v) => (
            <li key={v.slug}>
              <span className="hb-fM" style={{ ['--grunnur' as string]: v.tint }}>
                {v.hasPack ? <img src={PK(v.slug, 'pack', 's')} alt="" width={50} height={56} loading="lazy" /> : <b aria-hidden="true">{v.name.is[0]}</b>}
              </span>
              <span>
                <button type="button" className="hb-nafn" onClick={() => pop.open({ k: 'vara', slug: v.slug })}>{v.name.is}</button>
                <small>{ofnaemisLina(v)}</small>
              </span>
              {v.madeToOrder ? <button type="button" className="hb-sett" onClick={() => pop.open({ k: 'staerra' })}>Panta fyrir félag</button> : <SettIPoka slug={v.slug} />}
            </li>
          ))}
        </ul>
      </>
    ) : null
  } else if (c?.k === 'hvar') {
    titill = 'Hvar fæst H-Berg'
    body = (
      <>
        <div className="hb-mask"><p className="hb-merki" style={{ margin: 0 }}>Hvar fæst H-Berg</p></div>
        <div className="hb-mask"><h2 className="hb-disp" style={{ ['--i' as string]: 1 }}>Söluaðilar</h2></div>
        <p className="hb-brod" style={{ marginTop: '1rem' }}>Söluaðilar samkvæmt hberg.is. Ekki er tilgreint hvaða vörur fást á hverjum stað.</p>
        <ul className="hb-verslun">
          {SHOPS.map((s) => (
            <li key={s.name}>
              <a href={s.href} target="_blank" rel="noopener noreferrer"><b>{s.name}</b><span>{s.note.is}</span></a>
            </li>
          ))}
        </ul>
        <p className="hb-smatt" style={{ marginBottom: '2rem' }}>Hafðu samband við verslunina um úrval.</p>
        
      </>
    )
  } else if (c?.k === 'staerra') {
    titill='Stærri pakkningar'
    body=<><h2 className="hb-disp">Stærri pakkningar</h2><p className="hb-brod" style={{margin:'1.5rem 0'}}>H-Berg pakkar í stærri einingar fyrir matvælafyrirtæki, matsölustaði og stóreldhús. Spurðu okkur um pakkningar og magn.</p><Eydublad cfg={STAERRA}/></>
  } else if (c?.k === 'ofnaemi') {
    titill = 'Ofnæmisyfirlit'
    body = (
      <>
        <div className="hb-mask"><p className="hb-merki" style={{ margin: 0 }}>Allt á einum stað</p></div>
        <div className="hb-mask"><h2 className="hb-disp" style={{ ['--i' as string]: 1 }}>Ofnæmisyfirlit</h2></div>
        <p className="hb-brod" style={{ marginTop: '1rem' }}>● nefnt í innihaldi, ? óstaðfest. Staðfest á umbúðum.</p>
        <div className="hb-matrix" role="region" aria-label="Ofnæmisyfirlit, fletta til hliðar" tabIndex={0}>
          <table>
            <caption className="hb-sr" style={{ position: 'absolute', left: -9999 }}>Ofnæmisvaldar eftir vörum</caption>
            <thead>
              <tr><th scope="col" style={{ textAlign: 'left' }}>Vara</th>{ALLERGENS.map((x) => <th key={x.id} scope="col">{stutt(x.id)}</th>)}</tr>
            </thead>
            <tbody>
              {PRODUCTS.map((v) => (
                <tr key={v.slug}>
                  <th scope="row"><button type="button" className="hb-nobg" style={{ minHeight: 44 }} onClick={() => pop.open({ k: 'vara', slug: v.slug })}>{v.name.is}</button></th>
                  {ALLERGENS.map((x) => {
                    const hef = v.allergens?.includes(x.id)
                    return (
                      <td key={x.id} className={v.allergens === null ? 'oljost' : hef ? 'hef' : ''}>
                        <span aria-hidden="true">{v.allergens === null ? '?' : hef ? '●' : '?'}</span>
                        <span className="hb-sr" style={{ position: 'absolute', left: -9999 }}>{v.allergens === null ? 'ekki vitað' : hef ? 'inniheldur' : 'óstaðfest, staðfest á umbúðum'}</span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="hb-smatt">{skilmali}</p>
      </>
    )
  }

  return (
    <>
      <div className={`hb-popB${on ? ' opid' : ''}`} onClick={() => pop.close()} data-bendill="Loka" aria-hidden="true" />
      <div ref={panel} tabIndex={-1} className={`hb-pop${on ? ' opid' : ''}`} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`}
        data-lenis-prevent="">
        <div className="hb-popT">
          <span id={`${id}-t`} className="hb-merki" style={{ margin: 0 }}>{titill}</span>
          <button className="hb-popX" onClick={() => pop.close()} aria-label="Loka">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
        </div>
        <div className="hb-popS">{body}</div>
      </div>
    </>
  )
}
