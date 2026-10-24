import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { Eydublad } from './eydublad'
import { PONTUN } from './forms'
import { PK, productBySlug } from './vorur'

/* Kútalistinn. Shops, cafés and hotels build one list while they browse,
   set a quantity per product, and send it as one finished message to the maker
   (sambo@sambo.is) instead of phoning round. Built on the drawer from the Góa
   build. No prices are shown because the maker' site publishes none (every price
   in their shop reads 0), and the quantities are a request, not an order:
   the maker confirms pack sizes and prices. The list is kept for the session.

   In the preview nothing is sent. "Skoða fyrirspurnina" shows the order exactly
   as it would reach the inbox and opens it in the visitor's mail program. */

export type PokaLina = { slug: string; magn: number }

const KEY = 'kd-poki'
const les = (): PokaLina[] => {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v.filter((x) => x && typeof x.slug === 'string' && Number.isFinite(x.magn) && x.magn > 0 && productBySlug(x.slug)) : []
  } catch { return [] }
}
let lines: PokaLina[] = typeof window === 'undefined' ? [] : les()
let opid = false
const subs = new Set<() => void>()
const vista = () => { try { sessionStorage.setItem(KEY, JSON.stringify(lines)) } catch { /* private mode */ } }
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
.kd-pokiH{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border:0;background:transparent;cursor:pointer;
  font:inherit;font-size:.92rem;color:inherit;min-height:44px;min-width:44px;padding:0 .2rem}
.kd-pokiH b{display:inline-grid;place-items:center;min-width:1.55rem;height:1.55rem;padding:0 .35rem;
  border-radius:999px;background:var(--c-gull);color:#1C130D;font-size:.8rem;font-weight:600;
  font-variant-numeric:tabular-nums;transition:transform .35s var(--ease)}
.kd-pokiH b.hopp{animation:kd-hopp .3s ease-out}
@keyframes kd-hopp{0%{transform:scale(1)}40%{transform:scale(1.2)}100%{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.kd-pokiH b.hopp{animation:none}}
@media (max-width:520px){.kd-pokiH .kd-pokiO{display:none}}

.kd-pokiBak{position:fixed;inset:0;z-index:80;background:rgba(20,12,8,.42);
  opacity:0;transition:opacity .2s ease-out;pointer-events:none}
.kd-pokiBak.on{transition-duration:.35s}
.kd-pokiBak{visibility:hidden}
.kd-pokiBak.on{opacity:1;pointer-events:auto;visibility:visible}
/* an opacity:0 fixed layer still tints Safari's bottom toolbar; hidden only
   after the fade so the close still reads */
.kd-pokiBak:not(.on){transition:opacity .2s ease-out,visibility 0s .2s}
.kd-pokiS{position:fixed;top:0;right:0;bottom:0;z-index:81;width:min(30rem,100%);
  background:var(--c-bg);color:var(--c-ink);display:flex;flex-direction:column;
  transform:translateX(100%);transition:transform .45s var(--ease);visibility:hidden;
  overscroll-behavior:contain}
.kd-pokiS.on{transform:translateX(0);visibility:visible}
/* with the keyboard up iOS pans the visual viewport past the fixed drawer's
   bottom edge, and the page showed through there; carry the ground on down */
.kd-pokiS::after{content:'';position:absolute;left:0;right:0;top:100%;height:100lvh;background:inherit}
/* enter is deliberate (.45s, the page's own curve); exit is a system
   response and snaps back out in .25s */
.kd-pokiS:not(.on){transition:transform .25s cubic-bezier(.4,0,1,1),visibility 0s .25s}
.kd-pokiT{display:flex;align-items:center;justify-content:space-between;gap:1rem;
  padding:calc(1rem + env(safe-area-inset-top)) var(--gut) 1rem;box-shadow:inset 0 -1px 0 var(--c-lina)}
.kd-pokiT h2{margin:0;font-family:var(--f-disp);font-weight:400;font-size:1.55rem;letter-spacing:-.02em}
.kd-pokiX{width:44px;height:44px;border:0;background:transparent;cursor:pointer;color:inherit;
  font-size:1.5rem;line-height:1;display:grid;place-items:center}
.kd-pokiB{flex:1;overflow-y:auto;padding:1.2rem var(--gut) 2rem;-webkit-overflow-scrolling:touch}
.kd-pokiTomt{opacity:.75;margin:0 0 1rem}
.kd-pokiL{list-style:none;margin:0 0 1.2rem;padding:0}
.kd-pokiL li{display:grid;grid-template-columns:3.2rem minmax(0,1fr) auto;gap:.2rem .9rem;align-items:center;
  padding:.7rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.kd-pokiM{width:3.2rem;height:3.6rem;background:var(--grunnur,var(--c-el));display:flex;align-items:center;justify-content:center;padding:.3rem;border-radius:var(--r,0)}
.kd-pokiM img{height:100%;width:auto;max-width:100%;object-fit:contain}
.kd-pokiL small{display:block;font-size:.8rem;opacity:.7}
.kd-magn{display:inline-flex;align-items:center;box-shadow:inset 0 0 0 1px var(--c-lina)}
.kd-magn button{width:44px;height:44px;border:0;background:transparent;color:inherit;cursor:pointer;font-size:1.1rem}
.kd-magnN{width:3.2rem;height:44px;text-align:center;background:none;border:0;color:inherit;font:inherit;font-size:16px;font-weight:500;font-variant-numeric:tabular-nums}
@media (max-width:479px){.kd-pokiL li{grid-template-columns:3.2rem minmax(0,1fr)}.kd-pokiL li > .kd-magn{grid-column:2}}
.kd-villa{color:var(--c-rautt);font-size:.85rem;margin:0}
.kd-kvittun{background:var(--c-el);padding:1.1rem;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.84rem;white-space:pre-wrap;
  margin:1rem 0;line-height:1.5}
.kd-pokiF{padding:1rem var(--gut) calc(1rem + env(safe-area-inset-bottom));box-shadow:inset 0 1px 0 var(--c-lina)}
.kd-pokiF .kd-hnappur{width:100%;text-align:center;min-height:48px}
.kd-sett{display:inline-flex;align-items:center;gap:.45rem;border:0;cursor:pointer;font:inherit;
  font-size:.88rem;font-weight:500;min-height:44px;padding:0 .95rem;background:var(--c-ink);color:var(--c-bg);border-radius:999px;
  transition:background .15s ease-out,transform .12s ease-out}
.kd-sett:active{transform:scale(.97)}
.kd-sett.komid{background:var(--c-rautt)}
.kd-settM{display:inline-block;height:1.3em;overflow:hidden;line-height:1.3em}
.kd-settM > span{display:grid;transition:transform .35s var(--ease)}
.kd-settM > span.upp{transform:translateY(-1.3em)}
.kd-settM > span > span{height:1.3em;white-space:nowrap}
/* anything the drawer adds, swaps or reveals rises in instead of appearing */
@keyframes kd-inn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.kd-pokiL li,.kd-villa,.kd-kvittun,.kd-pokiTomt,.kd-pokiB > p{
  animation:kd-inn .32s ease-out both;animation-delay:calc(var(--i,0) * .035s)}
@media (prefers-reduced-motion:reduce){.kd-settM > span{transition:none}
  .kd-pokiL li,.kd-villa,.kd-kvittun,.kd-pokiTomt,.kd-pokiB > p{animation-duration:.01s}}
@media (hover:hover) and (pointer:fine){.kd-sett:hover{background:var(--c-rautt)}}
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
    <button className="kd-pokiH" data-poki-opna="" onClick={() => poki.open(true)}
      aria-label={`Kútalisti, ${n} ${n === 1 ? 'kútur' : 'kútar'}`}>
      <span className="kd-pokiO">Kútalisti</span>
      <b className={hopp ? 'hopp' : ''}>{n}</b>
    </button>
  )
}

/** The add control on a product. Says what it did for a moment after. */
export function SettIPoka({ slug }: { slug: string }) {
  const [komid, setKomid] = useState(false)
  const nafn = productBySlug(slug)?.name.is ?? slug
  useEffect(() => { if (!komid) return; const t = window.setTimeout(() => setKomid(false), 1400); return () => window.clearTimeout(t) }, [komid])
  return (
    <button type="button" className={`kd-sett${komid ? ' komid' : ''}`}
      onClick={() => { poki.add(slug); setKomid(true) }} aria-label={`Setja ${nafn} á kútalistann`}>
      {/* the two labels share one slot and trade places vertically, so the
          confirmation slides in rather than blinking over the old text */}
      <span className="kd-settM"><span className={komid ? 'upp' : ''}>
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

  /* No inert here: the drawer is visibility:hidden when closed, which already
     removes it from the tab order and the accessibility tree, and toggling
     inert cost the first tap after opening on iOS Safari. */

  useEffect(() => {
    if (!on) return
    aftur.current = document.activeElement as HTMLElement | null
    const lenis = (window as unknown as { __sbLenis?: { stop: () => void; start: () => void } }).__sbLenis
    lenis?.stop()
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    const kb = document.documentElement.getAttribute('data-input') === 'key'
    const t = window.setTimeout(() => (kb ? panel.current?.querySelector<HTMLElement>('.kd-pokiX') : panel.current)?.focus({ preventScroll: true }), 60)
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

  const rows = l.map((x) => ({ ...x, p: productBySlug(x.slug) })).filter((x) => x.p)
  const lina = rows.map((x) => ({ n: x.p!.name.is, magn: x.magn }))
  const fjoldi = l.reduce((a, x) => a + x.magn, 0)

  return (
    <>
      <div className={`kd-pokiBak${on ? ' on' : ''}`} onClick={() => poki.open(false)} aria-hidden="true" />
      <div ref={panel} tabIndex={-1} className={`kd-pokiS${on ? ' on' : ''}`} role="dialog" aria-modal="true"
        aria-labelledby={`${id}-t`} data-lenis-prevent="">
        <div className="kd-pokiT">
          <h2 id={`${id}-t`}>Kútalistinn þinn</h2>
          <button className="kd-pokiX" onClick={() => poki.open(false)} aria-label="Loka kútalista">×</button>
        </div>
        <div className="kd-pokiB">
          {!yfirfarid && (
            <>
              {rows.length ? (
                <ul className="kd-pokiL">
                  {rows.map((x) => (
                    <li key={x.slug}>
                      <span className="kd-pokiM" style={{ ['--grunnur' as string]: x.p!.tint }}><img src={PK(x.slug, 'pack', 's')} alt="" width={46} height={52} /></span>
                      <span>{x.p!.name.is}<small>{x.p!.desc.is}</small></span>
                      <span className="kd-magn">
                        <button type="button" onClick={() => poki.set(x.slug, x.magn - 1)} aria-label={`Færri ${x.p!.name.is}`}>−</button>
                        <MagnReitur slug={x.slug} nafn={x.p!.name.is} magn={x.magn} />
                        <button type="button" onClick={() => poki.set(x.slug, x.magn + 1)} aria-label={`Fleiri ${x.p!.name.is}`}>+</button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="kd-pokiTomt">
                  Listinn er tómur. Veldu „+ Á listann“ við bjór, eða hringdu í 466 2505. Þú kaupir kúta og færð dælu með.
                </p>
              )}
              <p className="kd-smatt" style={{ margin: '0 0 1.2rem' }}>
                Fjöldi kúta er ósk, ekki pöntun. Kaldi staðfestir stærðir, afhendingu og dælu.
              </p>
            </>
          )}
          <Eydublad cfg={PONTUN} lina={lina} krefstLina formId={`${id}-f`} felaTakka
            onSkoda={() => { setYfirfarid(true); window.setTimeout(() => panel.current?.querySelector('.kd-pokiB')?.scrollTo(0, 0), 0) }} onNytt={() => { setYfirfarid(false); poki.clear() }} />
        </div>
        {!yfirfarid && (
          <div className="kd-pokiF">
            <button className="kd-hnappur" type="submit" form={`${id}-f`}>
              Skoða fyrirspurnina{fjoldi ? ` (${fjoldi})` : ''}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

/* typed quantity: edit freely, commit on blur; 0 removes the line, empty keeps it */
function MagnReitur({ slug, nafn, magn }: { slug: string; nafn: string; magn: number }) {
  const [txt, setTxt] = useState<string | null>(null)
  return (
    <input className="kd-magnN" aria-label={`Magn ${nafn}`} inputMode="numeric" pattern="[0-9]*" value={txt ?? String(magn)}
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => {
        const s = e.target.value.replace(/\D/g, '').slice(0, 3)
        setTxt(s)
        if (s !== '' && Number(s) > 0) poki.set(slug, Number(s))
      }}
      onBlur={() => { if (txt !== null && txt !== '' && Number(txt) === 0) poki.set(slug, 0); setTxt(null) }} />
  )
}
