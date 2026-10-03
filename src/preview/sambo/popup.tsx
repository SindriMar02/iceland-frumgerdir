import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { ASSETS } from './assets.gen'
import { Eydublad } from './eydublad'
import { FJAROFLUN, STARF, VERSLUN } from './forms'
import { KATALOGUR } from './katalogur'
import { langt, ofnaemisLina, skilmali, stutt } from './ofnaemi'
import { SettIPoka } from './poki'
import { ALLERGENS, PK, PRODUCTS, SHOPS, img, productBySlug } from './vorur'

/* The slide-over panels (§15 blog reader, §23 product popup, §6 "Popups" of
   _docs/noho-teardown.md): one shell, a 50vw panel from the right on desktop
   and full width on compact, sliding on custom-popup (.6,0,0,1). The backdrop
   carries the cursor word "Loka". noho's own popups had no Escape and no
   focus trap (a listed defect); these have both, and they lock the page with
   the fixed-body method the mobile chrome standard requires.

   Kinds: a single product (the gallery strip and the product panels), a whole
   line from the carousel, the allergen overview, where to buy, the Easter
   fundraising order and the job application. */

export type PopState =
  | { k: 'vara'; slug: string }
  | { k: 'flokkur'; s: string }
  | { k: 'hvar' }
  | { k: 'fjarofloun' }
  | { k: 'starf' }
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
.sb-popB{position:fixed;inset:0;z-index:84;background:rgba(4,26,36,.35);opacity:0;pointer-events:none;
  transition:opacity .45s var(--ease-popup)}
.sb-popB{visibility:hidden}
.sb-popB.opid{opacity:1;pointer-events:auto;visibility:visible}
.sb-popB:not(.opid){transition:opacity .45s var(--ease-popup),visibility 0s .45s}
.sb-pop{position:fixed;top:0;right:0;bottom:0;z-index:85;width:50vw;background:var(--c-bg);color:var(--c-ink);
  transform:translateX(100%);visibility:hidden;display:flex;flex-direction:column;
  transition:transform .6s var(--ease-popup),visibility 0s .6s}
.sb-pop.opid{transform:none;visibility:visible;transition:transform .6s var(--ease-popup),visibility 0s}
/* compact: the panel is the full screen, so the backdrop is dropped, and the
   panel is what touches Safari's bottom toolbar and tints it paper */
@media (max-width:991px){.sb-pop{width:100vw}.sb-popB{display:none}}
.sb-popT{display:flex;justify-content:space-between;align-items:center;gap:1rem;
  padding:calc(var(--gut) + env(safe-area-inset-top)) var(--gut) var(--gut)}
.sb-popX{width:max(2.5vw,44px);height:max(2.5vw,44px);border:0;background:var(--c-hdr);color:var(--c-hdr-t);cursor:pointer;
  display:grid;place-items:center;flex:none;border-radius:999px}
.sb-popS{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:0 var(--gut) calc(var(--gut) * 2 + env(safe-area-inset-bottom));
  -webkit-overflow-scrolling:touch}
.sb-popS .sb-mask > *{transform:translateY(105%);transition:transform .9s var(--ease);transition-delay:calc(.25s + var(--i,0) * .06s)}
.sb-pop.opid .sb-popS .sb-mask > *{transform:none}
.sb-vMynd{background:var(--grunnur,var(--c-el));aspect-ratio:4/3;position:relative;margin-bottom:1.6rem;display:flex;align-items:center;justify-content:center;gap:4%;padding:7% 6%}
.sb-vMynd img{height:100%;width:auto;max-width:48%;object-fit:contain;filter:drop-shadow(0 18px 24px rgba(28,18,12,.3))}
.sb-vMynd img + img{transform:rotate(5deg)}
.sb-vMynd.einn img{max-width:80%}
.sb-vMynd.ljos{aspect-ratio:auto;height:auto;padding:0}
.sb-vMynd.ljos img{width:100%;height:auto;max-width:100%;filter:none}
.sb-vDl{display:grid;grid-template-columns:auto 1fr;gap:.35rem 1.4rem;margin:1.4rem 0;font-variant-numeric:tabular-nums}
.sb-vDl dt{color:var(--c-ink-med)}
.sb-vDl dd{margin:0}
.sb-vAct{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}
.sb-vMerki{display:flex;gap:.4rem;flex-wrap:wrap;margin:0 0 1rem;padding:0;list-style:none}
.sb-vMerki li{padding:.15rem .7rem;border-radius:999px;background:var(--c-el2);font-size:.8rem;font-weight:500}
.sb-vMerki li.nytt{background:var(--c-gull)}
.sb-vTafla{width:100%;border-collapse:collapse;margin:0 0 1rem;max-width:34rem}
.sb-vTafla th,.sb-vTafla td{padding:.6rem .3rem;text-align:left;font-weight:400;box-shadow:inset 0 -1px 0 var(--c-lina)}
.sb-vTafla tr.hef th,.sb-vTafla tr.hef td{font-weight:600;color:var(--c-rautt)}
.sb-vTafla i{font-style:normal;display:inline-block;width:1.1em}
.sb-vMerkingar{display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0}
.sb-vMerkingar button{min-height:44px;padding:0 1.1rem;border:1.5px solid var(--c-lina);background:none;cursor:pointer;color:inherit;font-size:.9rem;font-weight:500;border-radius:999px}
.sb-vMerkingar button[aria-pressed="true"]{background:var(--c-ink);color:var(--c-bg);border-color:var(--c-ink)}
.sb-vMid{margin:0 0 1.4rem;background:#fff;border-radius:var(--r,0);overflow:hidden}
.sb-vMid img{width:100%;height:auto}
.sb-vLjos{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:1.6rem 0 0}
.sb-vLjos img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--r,0);background:var(--c-el)}
.sb-fLisi{list-style:none;margin:1.6rem 0 0;padding:0}
.sb-fLisi li{display:grid;grid-template-columns:3.6rem minmax(0,1fr) auto;gap:.9rem;align-items:center;
  padding:.7rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.sb-fLisi .sb-fM{width:3.6rem;height:4rem;background:var(--grunnur,var(--c-el));display:flex;align-items:center;justify-content:center;padding:.3rem;border-radius:var(--r,0)}
.sb-fLisi .sb-fM img{height:100%;width:auto;max-width:100%;object-fit:contain}
.sb-fLisi button.sb-nafn{border:0;background:none;padding:0;cursor:pointer;color:inherit;text-align:left;font:inherit;font-weight:500;line-height:1.3;min-height:44px;display:flex;align-items:center}
.sb-fLisi small{display:block;color:var(--c-ink-med);font-size:.8rem}
.sb-fLisi .sb-sett{min-height:40px;padding:0 .8rem;font-size:.82rem}
@media (max-width:479px){.sb-fLisi li{grid-template-columns:3rem minmax(0,1fr)}.sb-fLisi li > :last-child{grid-column:2}
  .sb-fLisi .sb-fM{width:3rem;height:3.4rem}}
.sb-verslun{list-style:none;margin:1.6rem 0 2rem;padding:0;display:grid;gap:.35rem}
.sb-verslun a{display:grid;gap:.15rem;padding:1rem 1.1rem;background:var(--c-el);border-radius:var(--r,0);min-height:44px;transition:background .25s var(--ease)}
.sb-verslun b{font-family:var(--f-disp);font-weight:400;font-size:1.5rem;line-height:1.1;letter-spacing:-.02em}
.sb-verslun span{font-size:.88rem;color:var(--c-ink-med)}
@media (hover:hover) and (pointer:fine){.sb-verslun a:hover{background:var(--c-el2)}}
.sb-pEgg{list-style:none;margin:1.4rem 0 2rem;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:.35rem}
.sb-pEgg li{background:var(--grunnur);border-radius:var(--r,0);aspect-ratio:3/4;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:.7rem .5rem .6rem}
.sb-pEgg img{height:78%;width:auto;max-width:100%;object-fit:contain;filter:drop-shadow(0 10px 14px rgba(28,18,12,.28))}
.sb-pEgg span{font-size:.8rem;font-weight:500;text-align:center;line-height:1.2}
.sb-matrix{overflow-x:auto;margin:1.4rem 0 1rem;-webkit-overflow-scrolling:touch;box-shadow:inset 0 0 0 1px var(--c-lina);border-radius:var(--r,0)}
.sb-matrix table{width:100%;min-width:36rem;border-collapse:collapse;font-size:.9rem}
.sb-matrix th,.sb-matrix td{padding:.5rem .6rem;text-align:center;white-space:nowrap;box-shadow:inset 0 -1px 0 var(--c-lina)}
.sb-matrix thead th{font-size:.74rem;letter-spacing:.06em;text-transform:capitalize;color:var(--c-ink-med);font-weight:500}
.sb-matrix thead th:first-child{position:sticky;left:0;z-index:2;background:var(--c-bg);box-shadow:inset 0 -1px 0 var(--c-lina),1px 0 0 var(--c-lina)}
.sb-matrix tbody th{z-index:1}
.sb-matrix tbody th{text-align:left;font-weight:500;position:sticky;left:0;background:var(--c-bg);box-shadow:inset 0 -1px 0 var(--c-lina),1px 0 0 var(--c-lina)}
.sb-matrix td.hef{font-weight:700;color:var(--c-rautt);background:color-mix(in srgb,var(--c-rautt) 7%,transparent)}
.sb-matrix td.oljost{color:var(--c-ink-max)}
`

const FLOKKUR_INN: Record<string, string> = {
  lakkris: 'Lakkrískonfekt, gammeldags lakkrís, reimar, kremrúlla og súkkulaðihúðaður lakkrís.',
  sukkuladi: 'Þristur, Kúlusúkk, Olsen Olsen, Sæla, Sport lakkrís og fleira húðað súkkulaði.',
  mjukt: 'Mjúkir karamellubitar, sykurpúðar og kókosbollur.',
  volu: 'Völusælgæti: súkkulaðihúðaðir sykurpúðar og stangir.',
  season: 'Páskaegg og páskabolti eru framleidd eftir pöntun, Kærleikstré fyrir jólin.',
}

export function Popup() {
  const p = usePop()
  const id = useId()
  const panel = useRef<HTMLDivElement | null>(null)
  const aftur = useRef<HTMLElement | null>(null)
  const [merki, setMerki] = useState<string | null>(null)
  const on = p !== null
  /* keep the last content while the panel slides out */
  const sidast = useRef<PopState>(null)
  if (p) sidast.current = p
  const c = p ?? sidast.current

  useEffect(() => { setMerki(null) }, [c && c.k === 'vara' ? c.slug : null])

  /* a new subject inside an open panel (overview row -> product) starts at its top, the body lock stays */
  const efni = p ? JSON.stringify(p) : ''
  useEffect(() => { if (efni) panel.current?.querySelector('.sb-popS')?.scrollTo(0, 0) }, [efni])

  useEffect(() => {
    const el = panel.current
    if (!el) return
    if (!on) return
    aftur.current = document.activeElement as HTMLElement | null
    const lenis = (window as unknown as { __sbLenis?: { stop: () => void; start: () => void; scrollTo: (y: number, o?: object) => void } }).__sbLenis
    lenis?.stop()
    /* fixed-body scroll lock (mobile chrome standard), restored instantly */
    const y = window.scrollY
    const b = document.body.style
    const prev = { position: b.position, top: b.top, width: b.width }
    b.position = 'fixed'; b.top = `-${y}px`; b.width = '100%'
    const t = window.setTimeout(() => el.querySelector<HTMLElement>('.sb-popX')?.focus(), 60)
    el.querySelector('.sb-popS')?.scrollTo(0, 0)
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { pop.close(); return }
      if (e.key !== 'Tab') return
      const f = [...el.querySelectorAll<HTMLElement>('button,a[href],input,textarea,select')].filter((x) => !x.hasAttribute('disabled'))
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
    const v = productBySlug(c.slug)
    if (v) {
      const a = ASSETS[v.slug]
      titill = v.name.is
      const merkNafn: Record<string, string> = { ing: 'Innihaldslýsing', 'nf-eu': 'Næringargildi (ESB)', 'nf-us': 'Næringargildi (US)' }
      const merkimyndir = [v.labels.ing ? 'ing' : '', v.labels.nfEu ? 'nf-eu' : '', v.labels.nfUs ? 'nf-us' : ''].filter(Boolean)
      const dim = (m: string) => (m === 'ing' ? a?.ing : m === 'nf-eu' ? a?.nfEu : a?.nfUs)
      body = (
        <>
          <div className={`sb-vMynd sb-mask${a?.pack && a?.open ? '' : ' einn'}`} style={{ ['--grunnur' as string]: v.tint }}>
            {a?.pack ? <img src={PK(v.slug, 'pack', 'm')} alt={`${v.name.is}, pakkning`} width={a.pack[0]} height={a.pack[1]} />
              : a?.macros?.[0] ? <img src={img(v.slug, 'm1.webp')} alt={v.name.is} width={a.macros[0][0]} height={a.macros[0][1]} /> : null}
            {a?.pack && a?.open ? <img src={PK(v.slug, 'open', 'm')} alt={`${v.name.is}, opinn poki`} width={a.open[0]} height={a.open[1]} /> : null}
          </div>
          <div className="sb-mask"><p className="sb-merki" style={{ margin: 0 }}>{v.brand === 'sambo' ? 'Sambó' : 'Völusælgæti'}</p></div>
          <div className="sb-mask"><h2 className="sb-sub" style={{ ['--i' as string]: 1 }}>{v.name.is}</h2></div>
          <p className="sb-brod" style={{ margin: '1rem 0 0' }}>{v.desc.is}</p>
          {(v.isNew || v.madeToOrder || v.season) && (
            <ul className="sb-vMerki" style={{ marginTop: '1rem' }}>
              {v.isNew && <li className="nytt">Nýtt</li>}
              {v.madeToOrder && <li>Framleitt eftir pöntun</li>}
              {v.season === 'paskar' && <li>Páskar</li>}
              {v.season === 'jol' && <li>Jól</li>}
            </ul>
          )}
          {v.weight ? <dl className="sb-vDl"><dt>Þyngd</dt><dd>{v.weight}</dd></dl> : null}
          <h3 style={{ margin: '1.6rem 0 .6rem', fontWeight: 500 }}>Ofnæmisvaldar</h3>
          {v.allergens === null ? (
            <p className="sb-brod">Engin innihaldslýsing er á vef Kólus fyrir þessa vöru. Lestu umbúðirnar eða spurðu okkur.</p>
          ) : (
            <table className="sb-vTafla">
              <caption className="sb-sr" style={{ position: 'absolute', left: -9999 }}>Ofnæmisvaldar</caption>
              <tbody>
                {ALLERGENS.map((x) => {
                  const hef = v.allergens!.includes(x.id)
                  return (
                    <tr key={x.id} className={hef ? 'hef' : ''}>
                      <th scope="row">{langt(x.id)}</th>
                      <td><i aria-hidden="true">{hef ? '●' : '–'}</i> {hef ? 'Inniheldur' : 'Ekki feitletrað á miða'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          {merkimyndir.length > 0 && (
            <div className="sb-vMerkingar" role="group" aria-label="Merkingar á umbúðum">
              {merkimyndir.map((m) => (
                <button key={m} type="button" aria-pressed={merki === m} onClick={() => setMerki(merki === m ? null : m)}>{merkNafn[m]}</button>
              ))}
            </div>
          )}
          {merki && dim(merki) ? (
            <div className="sb-vMid"><img src={img(v.slug, `${merki}.webp`)} width={dim(merki)![0]} height={dim(merki)![1]} alt={`${merkNafn[merki]}, ${v.name.is}. Mynd af miða á umbúðum.`} /></div>
          ) : null}
          <p className="sb-smatt" style={{ marginBottom: '1.4rem' }}>{skilmali}</p>
          <div className="sb-vAct">
            {v.madeToOrder
              ? <button type="button" className="sb-btn sb-casH" onClick={() => pop.open({ k: 'fjarofloun' })}>Panta fyrir félag</button>
              : <SettIPoka slug={v.slug} />}
          </div>
          {a?.macros && a.macros.length > (v.hasPack ? 0 : 1) ? (
            <div className="sb-vLjos">
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
        <div className="sb-mask"><p className="sb-merki" style={{ margin: 0 }}>{f.items.length} vörur</p></div>
        <div className="sb-mask"><h2 className="sb-disp" style={{ ['--i' as string]: 1 }}>{f.t}</h2></div>
        <div className="sb-mask" style={{ marginTop: '1rem' }}><p className="sb-brod" style={{ ['--i' as string]: 2 }}>{FLOKKUR_INN[f.s]}</p></div>
        <ul className="sb-fLisi">
          {f.items.map((v) => (
            <li key={v.slug}>
              <span className="sb-fM" style={{ ['--grunnur' as string]: v.tint }}>
                {v.hasPack ? <img src={PK(v.slug, 'pack', 's')} alt="" width={50} height={56} loading="lazy" /> : <b aria-hidden="true">{v.name.is[0]}</b>}
              </span>
              <span>
                <button type="button" className="sb-nafn" onClick={() => pop.open({ k: 'vara', slug: v.slug })}>{v.name.is}</button>
                <small>{ofnaemisLina(v)}</small>
              </span>
              {v.madeToOrder ? <button type="button" className="sb-sett" onClick={() => pop.open({ k: 'fjarofloun' })}>Panta fyrir félag</button> : <SettIPoka slug={v.slug} />}
            </li>
          ))}
        </ul>
      </>
    ) : null
  } else if (c?.k === 'hvar') {
    titill = 'Hvar fæst Sambó'
    body = (
      <>
        <div className="sb-mask"><p className="sb-merki" style={{ margin: 0 }}>Hvar fæst Sambó</p></div>
        <div className="sb-mask"><h2 className="sb-disp" style={{ ['--i' as string]: 1 }}>Netverslanir</h2></div>
        <p className="sb-brod" style={{ marginTop: '1rem' }}>Vefverslun Kólus er í smíðum. Þangað til selja þessar netverslanir Sambó.</p>
        <ul className="sb-verslun">
          {SHOPS.map((s) => (
            <li key={s.name}>
              <a href={s.href} target="_blank" rel="noopener noreferrer"><b>{s.name}</b><span>{s.note.is}</span></a>
            </li>
          ))}
        </ul>
        <p className="sb-smatt" style={{ marginBottom: '2rem' }}>Netverslanir þriðja aðila: verð, birgðir og sending eru á þeirra ábyrgð. Listinn er frumgerð og Kólus þarf að staðfesta hann.</p>
        <Eydublad cfg={VERSLUN} />
      </>
    )
  } else if (c?.k === 'fjarofloun') {
    titill = 'Páskafjáröflun'
    const egg = ['paskaegg', 'paskaboltinn', 'thrista-paskaegg'].map((s) => productBySlug(s)!)
    body = (
      <>
        <div className="sb-mask"><p className="sb-merki" style={{ margin: 0 }}>Fyrir íþróttafélög og samtök</p></div>
        <div className="sb-mask"><h2 className="sb-disp" style={{ ['--i' as string]: 1 }}>Páskaegg og páskaboltar</h2></div>
        <p className="sb-brod" style={{ marginTop: '1rem' }}>Sambó páskaegg og páskaboltar eru kjörin fjáröflunarleið fyrir félög. Páskanammið er aðeins framleitt og selt eftir pöntun. Eggin koma í innsigluðum plastbakka sem rennt er inn í kassa.</p>
        <ul className="sb-pEgg">
          {egg.map((e) => (
            <li key={e.slug} style={{ ['--grunnur' as string]: e.tint }}>
              <img src={PK(e.slug, e.hasOpen ? 'open' : 'pack', 's')} alt="" width={120} height={150} loading="lazy" />
              <span>{e.name.is}</span>
            </li>
          ))}
        </ul>
        <Eydublad cfg={FJAROFLUN} />
      </>
    )
  } else if (c?.k === 'starf') {
    titill = 'Starfsumsókn'
    body = (
      <>
        <div className="sb-mask"><p className="sb-merki" style={{ margin: 0 }}>Kólus ehf.</p></div>
        <div className="sb-mask"><h2 className="sb-disp" style={{ ['--i' as string]: 1 }}>Starfsumsókn</h2></div>
        <div style={{ marginTop: '1.6rem' }}><Eydublad cfg={STARF} /></div>
      </>
    )
  } else if (c?.k === 'ofnaemi') {
    titill = 'Ofnæmisyfirlit'
    body = (
      <>
        <div className="sb-mask"><p className="sb-merki" style={{ margin: 0 }}>Allt á einum stað</p></div>
        <div className="sb-mask"><h2 className="sb-disp" style={{ ['--i' as string]: 1 }}>Ofnæmisyfirlit</h2></div>
        <p className="sb-brod" style={{ marginTop: '1rem' }}>● inniheldur, – ekki feitletrað á miða, ? engin innihaldslýsing á vef Kólus.</p>
        <div className="sb-matrix" role="region" aria-label="Ofnæmisyfirlit, fletta til hliðar" tabIndex={0}>
          <table>
            <caption className="sb-sr" style={{ position: 'absolute', left: -9999 }}>Ofnæmisvaldar eftir vörum</caption>
            <thead>
              <tr><th scope="col" style={{ textAlign: 'left' }}>Vara</th>{ALLERGENS.map((x) => <th key={x.id} scope="col">{stutt(x.id)}</th>)}</tr>
            </thead>
            <tbody>
              {PRODUCTS.map((v) => (
                <tr key={v.slug}>
                  <th scope="row"><button type="button" className="sb-nobg" style={{ minHeight: 44 }} onClick={() => pop.open({ k: 'vara', slug: v.slug })}>{v.name.is}</button></th>
                  {ALLERGENS.map((x) => {
                    const hef = v.allergens?.includes(x.id)
                    return (
                      <td key={x.id} className={v.allergens === null ? 'oljost' : hef ? 'hef' : ''}>
                        <span aria-hidden="true">{v.allergens === null ? '?' : hef ? '●' : '–'}</span>
                        <span className="sb-sr" style={{ position: 'absolute', left: -9999 }}>{v.allergens === null ? 'ekki vitað' : hef ? 'inniheldur' : 'ekki merkt'}</span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="sb-smatt">{skilmali}</p>
      </>
    )
  }

  return (
    <>
      <div className={`sb-popB${on ? ' opid' : ''}`} onClick={() => pop.close()} data-bendill="Loka" aria-hidden="true" />
      <div ref={panel} className={`sb-pop${on ? ' opid' : ''}`} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`}
        data-lenis-prevent="">
        <div className="sb-popT">
          <span id={`${id}-t`} className="sb-merki" style={{ margin: 0 }}>{titill}</span>
          <button className="sb-popX" onClick={() => pop.close()} aria-label="Loka">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
        </div>
        <div className="sb-popS">{body}</div>
      </div>
    </>
  )
}
