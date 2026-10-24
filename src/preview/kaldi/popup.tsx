import { Fragment, useEffect, useId, useRef, useSyncExternalStore } from 'react'
import { Eydublad } from './eydublad'
import { KYNNING, SERMERKING } from './forms'
import { KATALOGUR } from './katalogur'
import { SettIPoka } from './poki'
import { CONTACT, LINU_NAFN, MYND, PK, PRODUCTS, productBySlug } from './vorur'

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
  | { k: 'kynning' }
  | { k: 'sermerking'; umbudir?: string; tilefni?: string }
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
.kd-popB{position:fixed;inset:0;z-index:84;background:rgba(20,12,8,.35);opacity:0;pointer-events:none;
  transition:opacity .45s var(--ease-popup)}
.kd-popB{visibility:hidden}
.kd-popB.opid{opacity:1;pointer-events:auto;visibility:visible}
.kd-popB:not(.opid){transition:opacity .45s var(--ease-popup),visibility 0s .45s}
.kd-pop{position:fixed;top:0;right:0;bottom:0;z-index:85;width:50vw;background:var(--c-bg);color:var(--c-ink);
  transform:translateX(100%);visibility:hidden;display:flex;flex-direction:column;
  transition:transform .6s var(--ease-popup),visibility 0s .6s}
.kd-pop.opid{transform:none;visibility:visible;transition:transform .6s var(--ease-popup),visibility 0s}
/* compact: the panel is the full screen, so the backdrop is dropped, and the
   panel is what touches Safari's bottom toolbar and tints it paper */
@media (max-width:991px){.kd-pop{width:100vw}.kd-popB{display:none}}
.kd-popT{display:flex;justify-content:space-between;align-items:center;gap:1rem;
  padding:calc(var(--gut) + env(safe-area-inset-top)) var(--gut) var(--gut)}
.kd-popX{width:max(2.5vw,44px);height:max(2.5vw,44px);border:0;background:var(--c-hdr);color:var(--c-hdr-t);cursor:pointer;
  display:grid;place-items:center;flex:none;border-radius:999px}
.kd-popS{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:0 var(--gut) calc(var(--gut) * 2 + env(safe-area-inset-bottom));
  -webkit-overflow-scrolling:touch}
.kd-popS .kd-mask > *{transform:translateY(105%);transition:transform .9s var(--ease);transition-delay:calc(.25s + var(--i,0) * .06s)}
.kd-pop.opid .kd-popS .kd-mask > *{transform:none}
.kd-vMynd{background:var(--grunnur,var(--c-el));aspect-ratio:4/3;position:relative;margin-bottom:1.6rem;display:flex;align-items:center;justify-content:center;gap:4%;padding:7% 6%}
.kd-vMynd img{height:100%;width:auto;max-width:48%;object-fit:contain;filter:drop-shadow(0 18px 24px rgba(28,18,12,.3))}
.kd-vMynd img + img{transform:rotate(5deg)}
.kd-vMynd.einn img{max-width:80%}
.kd-vMynd.ljos{aspect-ratio:auto;height:auto;padding:0}
.kd-vMynd.ljos img{width:100%;height:auto;max-width:100%;filter:none}
.kd-vDl{display:grid;grid-template-columns:auto 1fr;gap:.35rem 1.4rem;margin:1.4rem 0;font-variant-numeric:tabular-nums}
.kd-vDl dt{color:var(--c-ink-med)}
.kd-vDl dd{margin:0}
.kd-vAct{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}
.kd-vMerki{display:flex;gap:.4rem;flex-wrap:wrap;margin:0 0 1rem;padding:0;list-style:none}
.kd-vMerki li{padding:.15rem .7rem;border-radius:999px;background:var(--c-el2);font-size:.8rem;font-weight:500}
.kd-vMerki li.nytt{background:var(--c-gull)}
.kd-vTafla{width:100%;border-collapse:collapse;margin:0 0 1rem;max-width:34rem}
.kd-vTafla th,.kd-vTafla td{padding:.6rem .3rem;text-align:left;font-weight:400;box-shadow:inset 0 -1px 0 var(--c-lina)}
.kd-vTafla tr.hef th,.kd-vTafla tr.hef td{font-weight:600;color:var(--c-rautt)}
.kd-vTafla i{font-style:normal;display:inline-block;width:1.1em}
.kd-vMerkingar{display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0}
.kd-vMerkingar button{min-height:44px;padding:0 1.1rem;border:1.5px solid var(--c-lina);background:none;cursor:pointer;color:inherit;font-size:.9rem;font-weight:500;border-radius:999px}
.kd-vMerkingar button[aria-pressed="true"]{background:var(--c-ink);color:var(--c-bg);border-color:var(--c-ink)}
.kd-vMid{margin:0 0 1.4rem;background:#fff;border-radius:var(--r,0);overflow:hidden}
.kd-vMid img{width:100%;height:auto}
.kd-vLjos{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:1.6rem 0 0}
.kd-vLjos img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--r,0);background:var(--c-el)}
.kd-fLisi{list-style:none;margin:1.6rem 0 0;padding:0}
.kd-fLisi li{display:grid;grid-template-columns:3.6rem minmax(0,1fr) auto;gap:.9rem;align-items:center;
  padding:.7rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.kd-fLisi .kd-fM{width:3.6rem;height:4rem;background:var(--grunnur,var(--c-el));display:flex;align-items:center;justify-content:center;padding:.3rem;border-radius:var(--r,0)}
.kd-fLisi .kd-fM img{height:100%;width:auto;max-width:100%;object-fit:contain}
.kd-fLisi button.kd-nafn{border:0;background:none;padding:0;cursor:pointer;color:inherit;text-align:left;font:inherit;font-weight:500;line-height:1.3;min-height:44px;display:flex;align-items:center}
.kd-fLisi small{display:block;color:var(--c-ink-med);font-size:.8rem}
.kd-fLisi .kd-sett{min-height:40px;padding:0 .8rem;font-size:.82rem}
@media (max-width:479px){.kd-fLisi li{grid-template-columns:3rem minmax(0,1fr)}.kd-fLisi li > :last-child{grid-column:2}
  .kd-fLisi .kd-fM{width:3rem;height:3.4rem}}
.kd-verslun{list-style:none;margin:1.6rem 0 2rem;padding:0;display:grid;gap:.35rem}
.kd-verslun a{display:grid;gap:.15rem;padding:1rem 1.1rem;background:var(--c-el);border-radius:var(--r,0);min-height:44px;transition:background .25s var(--ease)}
.kd-verslun b{font-family:var(--f-disp);font-weight:400;font-size:1.5rem;line-height:1.1;letter-spacing:-.02em}
.kd-verslun span{font-size:.88rem;color:var(--c-ink-med)}
@media (hover:hover) and (pointer:fine){.kd-verslun a:hover{background:var(--c-el2)}}
.kd-pEgg{list-style:none;margin:1.4rem 0 2rem;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:.35rem}
.kd-pEgg li{background:var(--grunnur);border-radius:var(--r,0);aspect-ratio:3/4;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:.7rem .5rem .6rem}
.kd-pEgg img{height:78%;width:auto;max-width:100%;object-fit:contain;filter:drop-shadow(0 10px 14px rgba(28,18,12,.28))}
.kd-pEgg span{font-size:.8rem;font-weight:500;text-align:center;line-height:1.2}
.kd-vSpec{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.35rem;margin:1.4rem 0}
.kd-vSpec div{background:var(--c-el);border-radius:var(--r,0);padding:.8rem 1rem;display:grid;gap:.2rem}
.kd-vSpec small{color:var(--c-ink-med);font-size:.76rem}
.kd-vSpec b{font-family:var(--f-disp);font-weight:400;font-size:1.6rem;line-height:1.05;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
@media (max-width:479px){.kd-vSpec{grid-template-columns:1fr 1fr}}
.kd-hvarM{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:var(--r,0);margin:1.4rem 0 0;background:var(--c-el)}
.kd-opid{display:grid;grid-template-columns:auto 1fr;gap:.35rem 1.4rem;margin:1rem 0 0;font-variant-numeric:tabular-nums}
.kd-opid dt{color:var(--c-ink-med)}.kd-opid dd{margin:0}
`

const FLOKKUR_INN: Record<string, string> = {
  lager: 'Kaldi Ljós, Dökkur og Lite: bruggaðir eftir tékkneskri lagerhefð, gerjunartími fjórar vikur.',
  ol: 'Kaldi IPA að bandarískri fyrirmynd og Kaldi Tripel, belgískt öl með Abbey geri.',
  jol: 'Jóla Kaldi og Jóla Súkkulaði Porter fást fyrir jólin.',
  afengislaust: 'Áfengislaus Kaldi kom á markað í júní 2023, fyrsta áfengislausa varan frá Kalda.',
}

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

  /* a new subject inside an open panel (overview row -> product) starts at its top, the body lock stays */
  const efni = p ? JSON.stringify(p) : ''
  useEffect(() => { if (efni) panel.current?.querySelector('.kd-popS')?.scrollTo(0, 0) }, [efni])

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
    const kb = document.documentElement.getAttribute('data-input') === 'key'
    const t = window.setTimeout(() => (kb ? el.querySelector<HTMLElement>('.kd-popX') : el)?.focus({ preventScroll: true }), 60)
    el.querySelector('.kd-popS')?.scrollTo(0, 0)
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
      titill = v.name.is
      const nanar = [v.malt && ['Malt', v.malt], v.humlar && ['Humlar', v.humlar], v.ger && ['Ger', v.ger], v.gerjun && ['Gerjunartími', v.gerjun]].filter(Boolean) as [string, string][]
      const adrir = PRODUCTS.filter((x) => x.lina === v.lina && x.slug !== v.slug)
      body = (
        <>
          <div className="kd-vMynd kd-mask einn" style={{ ['--grunnur' as string]: v.tint }}>
            <img src={PK(v.slug, 'pack', 'm')} alt={`${v.name.is}, ${v.umbudir === 'dos' ? 'dós' : 'flaska'}`} width={400} height={1000} />
          </div>
          <div className="kd-mask"><p className="kd-merki" style={{ margin: 0 }}>{LINU_NAFN[v.lina]} · {v.umbudir === 'dos' ? 'Dós' : 'Flaska'}</p></div>
          <div className="kd-mask"><h2 className="kd-sub" style={{ ['--i' as string]: 1 }}>{v.name.is}</h2></div>
          <p className="kd-brod" style={{ margin: '1rem 0 0' }}>{v.lysing}</p>
          <div className="kd-vSpec">
            <div><small>Stíll</small><span>{v.stil}</span></div>
            <div><small>Styrkleiki</small><b>{v.abv ?? '–'}</b>{v.abvHeimild === 'midi' ? <small>Af miða</small> : !v.abv ? <small>Ekki gefið upp á vef</small> : null}</div>
            <div><small>Umbúðir</small><span>{v.umbudir === 'dos' ? 'Dós' : 'Flaska'}</span></div>
          </div>
          {v.merki?.length ? <ul className="kd-vMerki">{v.merki.map((m) => <li key={m}>{m}</li>)}</ul> : null}
          {nanar.length ? (
            <dl className="kd-vDl">{nanar.map(([k, x]) => <Fragment key={k}><dt>{k}</dt><dd>{x}</dd></Fragment>)}</dl>
          ) : null}
          <p className="kd-smatt" style={{ marginBottom: '1.4rem' }}>Ógerilsneyddur, án rotvarnarefna{v.slug === 'porter' ? '' : ' og án viðbætts sykurs'}. Bruggað úr vatni, möltuðu byggi, humlum og geri.{v.slug === 'porter' ? ' Súkkulaði Porter inniheldur Síríus súkkulaði.' : ''}</p>
          <div className="kd-vAct">
            <SettIPoka slug={v.slug} />
            <button type="button" className="kd-btn sc kd-casH" onClick={() => pop.open({ k: 'sermerking', umbudir: v.umbudir === 'dos' ? 'Dósir' : 'Flöskur' })}>Sérmerkja</button>
          </div>
          {adrir.length ? (
            <ul className="kd-fLisi" aria-label={`Fleiri í línunni ${LINU_NAFN[v.lina]}`}>
              {adrir.map((x) => (
                <li key={x.slug}>
                  <span className="kd-fM" style={{ ['--grunnur' as string]: x.tint }}><img src={PK(x.slug, 'pack', 's')} alt="" width={40} height={100} loading="lazy" /></span>
                  <span><button type="button" className="kd-nafn" onClick={() => pop.open({ k: 'vara', slug: x.slug })}>{x.name.is}</button><small>{x.stil}{x.abv ? `, ${x.abv}` : ''}</small></span>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )
    }
  } else if (c?.k === 'flokkur') {
    const f = KATALOGUR.find((x) => x.s === c.s)
    titill = f?.t ?? ''
    body = f ? (
      <>
        <div className="kd-mask"><p className="kd-merki" style={{ margin: 0 }}>{f.items.length} {f.items.length === 1 ? 'bjór' : 'bjórar'}</p></div>
        <div className="kd-mask"><h2 className="kd-disp" style={{ ['--i' as string]: 1 }}>{f.t}</h2></div>
        <div className="kd-mask" style={{ marginTop: '1rem' }}><p className="kd-brod" style={{ ['--i' as string]: 2 }}>{FLOKKUR_INN[f.s]}</p></div>
        <ul className="kd-fLisi">
          {f.items.map((v) => (
            <li key={v.slug}>
              <span className="kd-fM" style={{ ['--grunnur' as string]: v.tint }}><img src={PK(v.slug, 'pack', 's')} alt="" width={40} height={100} loading="lazy" /></span>
              <span>
                <button type="button" className="kd-nafn" onClick={() => pop.open({ k: 'vara', slug: v.slug })}>{v.name.is}</button>
                <small>{v.stil}{v.abv ? `, ${v.abv}` : ''}</small>
              </span>
              <SettIPoka slug={v.slug} />
            </li>
          ))}
        </ul>
      </>
    ) : null
  } else if (c?.k === 'hvar') {
    titill = 'Hvar fæst Kaldi'
    body = (
      <>
        <div className="kd-mask"><p className="kd-merki" style={{ margin: 0 }}>Hvar fæst Kaldi</p></div>
        <div className="kd-mask"><h2 className="kd-disp" style={{ ['--i' as string]: 1 }}>Í verksmiðjunni og Vínbúðunum</h2></div>
        <p className="kd-brod" style={{ marginTop: '1rem' }}>Frá 1. júlí 2022 er hægt að koma í verksmiðju Kalda á Árskógssandi og kaupa bjórinn beint frá framleiðanda. Kaldi fæst einnig í Vínbúðunum.</p>
        <img className="kd-hvarM" src={MYND('brugg2')} alt="Bruggsmiðjan Kaldi á Árskógssandi" width={1600} height={1200} loading="lazy" />
        <dl className="kd-opid">
          <dt>Staður</dt><dd><a href={CONTACT.mapHref} target="_blank" rel="noopener noreferrer">{CONTACT.address}, {CONTACT.postcode}</a></dd>
          <dt>Þri til fim</dt><dd>8 til 18</dd>
          <dt>Fös</dt><dd>8 til 20</dd>
          <dt>Sími</dt><dd><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></dd>
        </dl>
        <p className="kd-smatt" style={{ margin: '1.4rem 0 0' }}>Opnunartími eftir síðustu tilkynningu Kalda (sumar 2026). Árskógssandur er 12 km frá Dalvík og 35 km frá Akureyri. Áfengi er aðeins selt þeim sem hafa náð 20 ára aldri.</p>
      </>
    )
  } else if (c?.k === 'kynning') {
    titill = 'Kynningar'
    body = (
      <>
        <div className="kd-mask"><p className="kd-merki" style={{ margin: 0 }}>Fyrir hópa</p></div>
        <div className="kd-mask"><h2 className="kd-disp" style={{ ['--i' as string]: 1 }}>Kynning í Kalda</h2></div>
        <p className="kd-brod" style={{ marginTop: '1rem' }}>Í 60 mínútna kynningu er farið yfir sögu Kalda og þróun fyrirtækisins frá 2006, verksmiðjan skoðuð og bjórarnir smakkaðir beint af dælu.</p>
        <img className="kd-hvarM" src={MYND('salur')} alt="Salurinn í Bruggsmiðjunni Kalda" width={1100} height={692} loading="lazy" style={{ marginBottom: '1.6rem' }} />
        <Eydublad cfg={KYNNING} />
      </>
    )
  } else if (c?.k === 'sermerking') {
    titill = 'Sérmerking'
    body = (
      <>
        <div className="kd-mask"><p className="kd-merki" style={{ margin: 0 }}>Flöskur og dósir</p></div>
        <div className="kd-mask"><h2 className="kd-disp" style={{ ['--i' as string]: 1 }}>Sérmerktur Kaldi</h2></div>
        <p className="kd-brod" style={{ marginTop: '1rem' }}>Fyrir brúðkaupið, veisluna, fyrirtækið eða bara hvað sem er. Fyrirspurnin fer til Jóa á {CONTACT.emailSermerking}.</p>
        <div style={{ marginTop: '1.6rem' }}><Eydublad cfg={SERMERKING} key={`${c.umbudir ?? ''}${c.tilefni ?? ''}`} initial={{ vessel: c.umbudir ?? '', occasion: c.tilefni ?? '' }} /></div>
      </>
    )
  }

  return (
    <>
      <div className={`kd-popB${on ? ' opid' : ''}`} onClick={() => pop.close()} data-bendill="Loka" aria-hidden="true" />
      <div ref={panel} tabIndex={-1} className={`kd-pop${on ? ' opid' : ''}`} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`}
        data-lenis-prevent="">
        <div className="kd-popT">
          <span id={`${id}-t`} className="kd-merki" style={{ margin: 0 }}>{titill}</span>
          <button className="kd-popX" onClick={() => pop.close()} aria-label="Loka">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
        </div>
        <div className="kd-popS">{body}</div>
      </div>
    </>
  )
}
