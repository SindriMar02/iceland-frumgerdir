import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { Eydublad } from './eydublad'
import { PONTUN } from './forms'
import { PK, productBySlug } from './vorur'



export type PokaLina = { slug: string; magn: number }

const KEY = 'hb-poki'
const les = (): PokaLina[] => {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v.filter((x) => x && typeof x.slug === 'string' && Number.isFinite(x.magn) && x.magn > 0 && productBySlug(x.slug)) : []
  } catch { return [] }
}
let lines: PokaLina[] = typeof window === 'undefined' ? [] : les()
let opid = false
const subs = new Set<() => void>()
const vista = () => { try { sessionStorage.setItem(KEY, JSON.stringify(lines)) } catch {  } }
const emit = () => { vista(); subs.forEach((f) => f()) }
const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }

export const poki = {
  add(slug: string) {
    const i = lines.findIndex((l) => l.slug === slug)
    lines = i < 0 ? [...lines, { slug, magn: 1 }] : lines.map((l, j) => (j === i ? { ...l, magn: Math.min(999, l.magn + 1) } : l))
    emit()
  },
  set(slug: string, magn: number) {
    lines = magn <= 0 ? lines.filter((l) => l.slug !== slug) : lines.some((l) => l.slug === slug)
      ? lines.map((l) => (l.slug === slug ? { ...l, magn: Math.min(999, Math.floor(magn)) } : l))
      : [...lines, { slug, magn: Math.min(999, Math.floor(magn)) }]
    emit()
  },
  open(v: boolean) { opid = v; emit() },
  clear() { lines = []; emit() },
}

const snapLines = () => lines
const snapOpid = () => opid
export const usePoki = () => useSyncExternalStore(sub, snapLines, snapLines)
const useOpid = () => useSyncExternalStore(sub, snapOpid, snapOpid)

export const POKA_CSS = `
.hb-pokiH{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border:0;background:transparent;cursor:pointer;
  font:inherit;font-size:.92rem;color:inherit;min-height:44px;min-width:44px;padding:0 .2rem}
.hb-pokiH b{display:inline-grid;place-items:center;min-width:1.55rem;height:1.55rem;padding:0 .35rem;
  border-radius:999px;background:var(--c-gull);color:#172D4D;font-size:.8rem;font-weight:600;
  font-variant-numeric:tabular-nums;transition:transform .35s var(--ease)}
.hb-pokiH b.hopp{animation:hb-hopp .3s ease-out}
@keyframes hb-hopp{0%{transform:scale(1)}40%{transform:scale(1.2)}100%{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.hb-pokiH b.hopp{animation:none}}
@media (max-width:520px){.hb-pokiH .hb-pokiO{display:none}}

.hb-pokiBak{position:fixed;inset:0;z-index:80;background:rgba(16,32,56,.42);
  opacity:0;transition:opacity .2s ease-out;pointer-events:none}
.hb-pokiBak.on{transition-duration:.35s}
.hb-pokiBak{visibility:hidden}
.hb-pokiBak.on{opacity:1;pointer-events:auto;visibility:visible}

.hb-pokiBak:not(.on){transition:opacity .2s ease-out,visibility 0s .2s}
.hb-pokiS{position:fixed;top:0;right:0;bottom:0;z-index:81;width:min(30rem,100%);
  background:var(--c-bg);color:var(--c-ink);display:flex;flex-direction:column;
  transform:translateX(100%);transition:transform .45s var(--ease);visibility:hidden;
  overscroll-behavior:contain}
.hb-pokiS.on{transform:translateX(0);visibility:visible}

.hb-pokiS::after{content:'';position:absolute;left:0;right:0;top:100%;height:100lvh;background:inherit}

.hb-pokiS:not(.on){transition:transform .25s cubic-bezier(.4,0,1,1),visibility 0s .25s}
.hb-pokiT{display:flex;align-items:center;justify-content:space-between;gap:1rem;
  padding:calc(1rem + env(safe-area-inset-top)) var(--gut) 1rem;box-shadow:inset 0 -1px 0 var(--c-lina)}
.hb-pokiT h2{margin:0;font-family:var(--f-disp);font-weight:600;font-size:1.55rem;letter-spacing:-.02em}
.hb-pokiX{width:44px;height:44px;border:0;background:transparent;cursor:pointer;color:inherit;
  font-size:1.5rem;line-height:1;display:grid;place-items:center}
.hb-pokiB{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:1.2rem var(--gut) 2rem;-webkit-overflow-scrolling:touch}
.hb-pokiTomt{opacity:.75;margin:0 0 1rem}
.hb-pokiL{list-style:none;margin:0 0 1.2rem;padding:0}
.hb-pokiL li{display:grid;grid-template-columns:3.2rem minmax(0,1fr) auto;gap:.2rem .9rem;align-items:center;
  padding:.7rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.hb-pokiM{width:3.2rem;height:3.6rem;background:var(--grunnur,var(--c-el));display:flex;align-items:center;justify-content:center;padding:.3rem;border-radius:var(--r,0)}
.hb-pokiM img{height:100%;width:auto;max-width:100%;object-fit:contain}
.hb-pokiL small{display:block;font-size:.8rem;opacity:.7}
.hb-magn{display:inline-flex;align-items:center;box-shadow:inset 0 0 0 1px var(--c-lina)}
.hb-magn button{width:44px;height:44px;border:0;background:transparent;color:inherit;cursor:pointer;font-size:1.1rem}
.hb-magnN{width:3.2rem;height:44px;text-align:center;background:none;border:0;color:inherit;font:inherit;font-size:16px;font-weight:500;font-variant-numeric:tabular-nums}
@media (max-width:479px){.hb-pokiL li{grid-template-columns:3.2rem minmax(0,1fr)}.hb-pokiL li > .hb-magn{grid-column:2}}
.hb-villa{color:var(--c-rautt);font-size:.85rem;margin:0}
.hb-kvittun{background:var(--c-el);padding:1.1rem;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.84rem;white-space:pre-wrap;
  margin:1rem 0;line-height:1.5}
.hb-pokiF{padding:1rem var(--gut) calc(1rem + env(safe-area-inset-bottom));box-shadow:inset 0 1px 0 var(--c-lina)}
.hb-pokiF .hb-hnappur{width:100%;text-align:center;min-height:48px}
.hb-sett{display:inline-flex;align-items:center;gap:.45rem;border:0;cursor:pointer;font:inherit;
  font-size:.88rem;font-weight:500;min-height:44px;padding:0 .95rem;background:var(--c-ink);color:var(--c-bg);border-radius:999px;
  transition:background .15s ease-out,transform .12s ease-out}
.hb-sett:active{transform:scale(.97)}
.hb-sett.komid{background:var(--c-rautt)}
.hb-settM{display:inline-block;height:1.3em;overflow:hidden;line-height:1.3em}
.hb-settM > span{display:grid;transition:transform .35s var(--ease)}
.hb-settM > span.upp{transform:translateY(-1.3em)}
.hb-settM > span > span{height:1.3em;white-space:nowrap}

@keyframes hb-inn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.hb-pokiL li,.hb-villa,.hb-kvittun,.hb-pokiTomt,.hb-pokiB > p{
  animation:hb-inn .32s ease-out both;animation-delay:calc(var(--i,0) * .035s)}
@media (prefers-reduced-motion:reduce){.hb-settM > span{transition:none}
  .hb-pokiL li,.hb-villa,.hb-kvittun,.hb-pokiTomt,.hb-pokiB > p{animation-duration:.01s}}
@media (hover:hover) and (pointer:fine){.hb-sett:hover{background:var(--c-rautt)}}
`

export function PokaHnappur() {
  const l = usePoki()
  const n = l.reduce((a, x) => a + x.magn, 0)
  const [hopp, setHopp] = useState(false)
  const prev = useRef(n)
  useEffect(() => {
    if (n > prev.current) { setHopp(true); const t = window.setTimeout(() => setHopp(false), 320); prev.current = n; return () => window.clearTimeout(t) }
    prev.current = n
  }, [n])
  return (
    <button className="hb-pokiH" data-poki-opna="" onClick={() => poki.open(true)}
      aria-label={`Pöntunarlisti, ${n} ${n === 1 ? 'vara' : 'vörur'}`}>
      <span className="hb-pokiO">Pöntunarlisti</span>
      <b className={hopp ? 'hopp' : ''}>{n}</b>
    </button>
  )
}


export function SettIPoka({ slug }: { slug: string }) {
  const [komid, setKomid] = useState(false)
  const nafn = productBySlug(slug)?.name.is ?? slug
  useEffect(() => { if (!komid) return; const t = window.setTimeout(() => setKomid(false), 1400); return () => window.clearTimeout(t) }, [komid])
  return (
    <button type="button" className={`hb-sett${komid ? ' komid' : ''}`}
      onClick={() => { poki.add(slug); setKomid(true) }} aria-label={`Setja ${nafn} á pöntunarlistann`}>
      {}
      <span className="hb-settM"><span className={komid ? 'upp' : ''}>
        <span>+ Á listann</span><span aria-hidden={!komid}>Komið á listann</span>
      </span></span>
    </button>
  )
}

export function Poki() {
  const l = usePoki()
  const on = useOpid()
  const panel = useRef<HTMLDivElement | null>(null)
  const aftur = useRef<HTMLElement | null>(null)
  const [yfirfarid, setYfirfarid] = useState(false)
  const id = useId()

  

  useEffect(() => {
    if (!on) return
    aftur.current = document.activeElement as HTMLElement | null
    const lenis = (window as unknown as { __hbLenis?: { stop: () => void; start: () => void } }).__hbLenis
    lenis?.stop()
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    const t = window.setTimeout(() => (document.documentElement.dataset.input==='pointer'?panel.current:panel.current?.querySelector<HTMLElement>('.hb-pokiX'))?.focus({preventScroll:true}), 60)
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { poki.open(false); return }
      if (e.key !== 'Tab' || !panel.current) return
      const f = [...panel.current.querySelectorAll<HTMLElement>('button,a[href],input,textarea,select')]
        .filter((x) => !x.hasAttribute('disabled'))
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { e.preventDefault(); last.focus() }
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

  const rows = l.map((x) => ({ ...x, p: productBySlug(x.slug) })).filter((x) => x.p)
  const lina = rows.map((x) => ({ n: `${x.p!.name.is} (kassar)`, magn: x.magn }))
  const fjoldi = l.reduce((a, x) => a + x.magn, 0)

  return (
    <>
      <div className={`hb-pokiBak${on ? ' on' : ''}`} onClick={() => poki.open(false)} aria-hidden="true" />
      <div ref={panel} tabIndex={-1} className={`hb-pokiS${on ? ' on' : ''}`} role="dialog" aria-modal="true"
        aria-labelledby={`${id}-t`} data-lenis-prevent="">
        <div className="hb-pokiT">
          <h2 id={`${id}-t`}>Pöntunarlistinn þinn</h2>
          <button className="hb-pokiX" onClick={() => poki.open(false)} aria-label="Loka pöntunarlista">×</button>
        </div>
        <div className="hb-pokiB">
          {!yfirfarid && (
            <>
              {rows.length ? (
                <ul className="hb-pokiL">
                  {rows.map((x) => (
                    <li key={x.slug}>
                      <span className="hb-pokiM" style={{ ['--grunnur' as string]: x.p!.tint }}><img src={PK(x.slug, 'pack', 's')} alt="" width={46} height={52} /></span>
                      <span>{x.p!.name.is}<small>Kassar</small></span>
                      <span className="hb-magn">
                        <button type="button" onClick={() => poki.set(x.slug, x.magn - 1)} aria-label={`Færri ${x.p!.name.is}`}>−</button>
                        <MagnReitur slug={x.slug} nafn={x.p!.name.is} magn={x.magn} />
                        <button type="button" onClick={() => poki.set(x.slug, x.magn + 1)} aria-label={`Fleiri ${x.p!.name.is}`}>+</button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="hb-pokiTomt">
                  Listinn er tómur. Veldu „+ Á listann“ við vöru, eða hringdu í 565 6500.
                </p>
              )}
              <p className="hb-smatt" style={{ margin: '0 0 1.2rem' }}>
                Magn er fjöldi kassa. Fjöldi í kassa er ekki tilgreindur hér; H-Berg staðfestir pakkningar.
              </p>
            </>
          )}
          <Eydublad onEdit={() => setYfirfarid(false)} cfg={PONTUN} lina={lina} krefstLina formId={`${id}-f`} felaTakka
            onSkoda={() => { setYfirfarid(true); window.setTimeout(() => panel.current?.querySelector('.hb-pokiB')?.scrollTo(0, 0), 0) }} onNytt={() => { setYfirfarid(false); poki.clear() }} />
        </div>
        {!yfirfarid && (
          <div className="hb-pokiF">
            <button className="hb-hnappur" type="submit" form={`${id}-f`}>
              Skoða pöntunina{fjoldi ? ` (${fjoldi})` : ''}
            </button>
          </div>
        )}
      </div>
    </>
  )
}


function MagnReitur({ slug, nafn, magn }: { slug: string; nafn: string; magn: number }) {
  const [txt, setTxt] = useState<string | null>(null)
  return (
    <input className="hb-magnN" aria-label={`Magn ${nafn}`} inputMode="numeric" pattern="[0-9]*" value={txt ?? String(magn)}
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => {
        const s = e.target.value.replace(/\D/g, '').slice(0, 3)
        setTxt(s)
        if (s !== '' && Number(s) > 0) poki.set(slug, Number(s))
      }}
      onBlur={() => { if (txt !== null && txt !== '' && Number(txt) === 0) poki.set(slug, 0); setTxt(null) }} />
  )
}
