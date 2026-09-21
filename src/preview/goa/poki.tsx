import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from 'react'

/* Nammipokinn. On goa.is this is the trade order list: a candy spoon on each
   product adds it, and a form asks an existing customer for viðskiptanúmer or
   kennitala and a new one for company details, then sends it to Góa. No
   payment. This is the same flow, rebuilt as a drawer that follows the
   visitor around the page instead of a grey bar at the foot of it.

   In the preview nothing is sent. "Senda pöntun" shows the order exactly as
   it would reach pantanir@goa.is and says so. */

export type PokaLina = { nr: string; n: string; pk: string; magn: number }

let lines: PokaLina[] = []
let opid = false
const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())
const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }

export const poki = {
  add(v: { nr: string; n: string; pk: string }) {
    const i = lines.findIndex((l) => l.nr === v.nr)
    lines = i < 0 ? [...lines, { ...v, magn: 1 }] : lines.map((l, j) => (j === i ? { ...l, magn: l.magn + 1 } : l))
    emit()
  },
  set(nr: string, magn: number) {
    lines = magn <= 0 ? lines.filter((l) => l.nr !== nr) : lines.map((l) => (l.nr === nr ? { ...l, magn } : l))
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
.goa-pokiH{display:inline-flex;align-items:center;gap:.5rem;border:0;background:transparent;cursor:pointer;
  font:inherit;font-size:.92rem;color:inherit;min-height:44px;padding:0 .2rem}
.goa-pokiH b{display:inline-grid;place-items:center;min-width:1.55rem;height:1.55rem;padding:0 .35rem;
  border-radius:999px;background:var(--c-gull);color:#2D1105;font-size:.8rem;font-weight:600;
  font-variant-numeric:tabular-nums;transition:transform .35s var(--ease)}
.goa-pokiH b.hopp{animation:goa-hopp .3s ease-out}
@keyframes goa-hopp{0%{transform:scale(1)}40%{transform:scale(1.2)}100%{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.goa-pokiH b.hopp{animation:none}}
@media (max-width:520px){.goa-pokiH .goa-pokiO{display:none}}

.goa-pokiBak{position:fixed;inset:0;z-index:80;background:rgba(28,18,12,.42);
  opacity:0;transition:opacity .2s ease-out;pointer-events:none}
.goa-pokiBak.on{transition-duration:.35s}
.goa-pokiBak{visibility:hidden}
.goa-pokiBak.on{opacity:1;pointer-events:auto;visibility:visible}
/* an opacity:0 fixed layer still tints Safari's bottom toolbar; hidden only
   after the fade so the close still reads */
.goa-pokiBak:not(.on){transition:opacity .2s ease-out,visibility 0s .2s}
.goa-pokiS{position:fixed;top:0;right:0;bottom:0;z-index:81;width:min(30rem,100%);
  background:var(--c-bg);color:var(--c-ink);display:flex;flex-direction:column;
  transform:translateX(100%);transition:transform .45s var(--ease);visibility:hidden;
  overscroll-behavior:contain}
.goa-pokiS.on{transform:translateX(0);visibility:visible}
/* with the keyboard up iOS pans the visual viewport past the fixed drawer's
   bottom edge, and the page showed through there; carry the ground on down */
.goa-pokiS::after{content:'';position:absolute;left:0;right:0;top:100%;height:100lvh;background:inherit}
/* enter is deliberate (.45s, the page's own curve); exit is a system
   response and snaps back out in .25s */
.goa-pokiS:not(.on){transition:transform .25s cubic-bezier(.4,0,1,1),visibility 0s .25s}
.goa-pokiT{display:flex;align-items:center;justify-content:space-between;gap:1rem;
  padding:calc(1rem + env(safe-area-inset-top)) var(--gut) 1rem;box-shadow:inset 0 -1px 0 var(--c-lina)}
.goa-pokiT h2{margin:0;font-size:1.35rem;font-weight:600;letter-spacing:-.03em}
.goa-pokiX{width:44px;height:44px;border:0;background:transparent;cursor:pointer;color:inherit;
  font-size:1.5rem;line-height:1;display:grid;place-items:center}
.goa-pokiB{flex:1;overflow-y:auto;padding:1.2rem var(--gut) 2rem;-webkit-overflow-scrolling:touch}
.goa-pokiTomt{opacity:.75;margin:0 0 1rem}
.goa-pokiL{list-style:none;margin:0 0 1.6rem;padding:0}
.goa-pokiL li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.3rem 1rem;align-items:center;
  padding:.8rem 0;box-shadow:inset 0 -1px 0 var(--c-lina)}
.goa-pokiL small{display:block;font-size:.8rem;opacity:.7;font-variant-numeric:tabular-nums}
.goa-magn{display:inline-flex;align-items:center;box-shadow:inset 0 0 0 1px var(--c-lina)}
.goa-magn button{width:44px;height:44px;border:0;background:transparent;color:inherit;cursor:pointer;font-size:1.1rem}
.goa-magn span{min-width:2.2rem;text-align:center;font-variant-numeric:tabular-nums;font-weight:500}
.goa-form{display:grid;gap:.85rem}
.goa-form fieldset{border:0;margin:0 0 .3rem;padding:0;display:flex;gap:.5rem;flex-wrap:wrap}
.goa-form legend{font-weight:500;margin-bottom:.5rem;padding:0}
.goa-tegund{display:inline-flex;align-items:center;gap:.5rem;min-height:44px;padding:0 .9rem;cursor:pointer;
  box-shadow:inset 0 0 0 1px var(--c-lina);font-size:.95rem}
.goa-tegund:has(input:checked){box-shadow:inset 0 0 0 2px var(--c-rautt)}
.goa-tegund input{accent-color:var(--c-rautt);width:18px;height:18px;margin:0}
.goa-form label.goa-reitur{display:grid;gap:.3rem;font-size:.88rem}
.goa-form input[type=text],.goa-form input[type=email],.goa-form input[type=tel],.goa-form textarea{
  font:inherit;font-size:16px;color:inherit;background:var(--c-flotur);border:0;
  box-shadow:inset 0 -1px 0 var(--c-lina);padding:.75rem .8rem;border-radius:0;width:100%}
.goa-form textarea{min-height:5.5rem;resize:vertical}
.goa-form [aria-invalid=true]{box-shadow:inset 0 -2px 0 var(--c-rautt)}
.goa-villa{color:var(--c-rautt);font-size:.85rem;margin:0}
.goa-kvittun{background:var(--c-flotur);padding:1.1rem;font-family:inherit;font-size:.9rem;white-space:pre-wrap;
  font-variant-numeric:tabular-nums;margin:1rem 0;line-height:1.5}
.goa-pokiF{padding:1rem var(--gut) calc(1rem + env(safe-area-inset-bottom));box-shadow:inset 0 1px 0 var(--c-lina)}
.goa-pokiF .goa-hnappur{width:100%;text-align:center;min-height:48px}
.goa-sett{display:inline-flex;align-items:center;gap:.45rem;border:0;cursor:pointer;font:inherit;
  font-size:.88rem;font-weight:500;min-height:44px;padding:0 .95rem;background:var(--c-ink);color:var(--c-bg);
  transition:background .15s ease-out,transform .12s ease-out}
.goa-sett:active{transform:scale(.97)}
.goa-sett.komid{background:var(--c-rautt)}
.goa-settM{display:inline-block;height:1.3em;overflow:hidden;line-height:1.3em}
.goa-settM > span{display:grid;transition:transform .35s var(--ease)}
.goa-settM > span.upp{transform:translateY(-1.3em)}
.goa-settM > span > span{height:1.3em;white-space:nowrap}
/* anything the drawer adds, swaps or reveals rises in instead of appearing */
@keyframes goa-inn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.goa-pokiL li,.goa-form .goa-reitur,.goa-villa,.goa-kvittun,.goa-pokiTomt,.goa-pokiB > p{
  animation:goa-inn .32s ease-out both;animation-delay:calc(var(--i,0) * .035s)}
@media (prefers-reduced-motion:reduce){.goa-settM > span{transition:none}
  .goa-pokiL li,.goa-form .goa-reitur,.goa-villa,.goa-kvittun,.goa-pokiTomt,.goa-pokiB > p{animation-duration:.01s}}
@media (hover:hover) and (pointer:fine){.goa-sett:hover{background:var(--c-rautt)}}
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
    <button className="goa-pokiH" data-poki-opna="" onClick={() => poki.open(true)}
      aria-label={`Nammipoki, ${n} ${n === 1 ? 'vara' : 'vörur'}`}>
      <span className="goa-pokiO">Nammipoki</span>
      <b className={hopp ? 'hopp' : ''}>{n}</b>
    </button>
  )
}

/** The add control on a product. Says what it did for a moment after. */
export function SettIPoka({ v }: { v: { nr: string; n: string; pk: string } }) {
  const [komid, setKomid] = useState(false)
  useEffect(() => { if (!komid) return; const t = window.setTimeout(() => setKomid(false), 1400); return () => window.clearTimeout(t) }, [komid])
  return (
    <button type="button" className={`goa-sett${komid ? ' komid' : ''}`}
      onClick={() => { poki.add(v); setKomid(true) }} aria-label={`Setja ${v.n} í nammipoka`}>
      {/* the two labels share one slot and trade places vertically, so the
          confirmation slides in rather than blinking over the old text */}
      <span className="goa-settM"><span className={komid ? 'upp' : ''}>
        <span>+ Í pokann</span><span aria-hidden={!komid}>Komið í pokann</span>
      </span></span>
    </button>
  )
}

type Tegund = 'nuverandi' | 'nyr'
const REITIR: Record<Tegund, { k: string; t: string; type?: string; req?: boolean; auto?: string }[]> = {
  nuverandi: [
    { k: 'nr', t: 'Viðskiptanúmer eða kennitala', req: true },
    { k: 'netfang', t: 'Netfang', type: 'email', req: true, auto: 'email' },
  ],
  nyr: [
    { k: 'fyrirtaeki', t: 'Fyrirtæki', req: true, auto: 'organization' },
    { k: 'nafn', t: 'Nafn tengiliðs', req: true, auto: 'name' },
    { k: 'netfang', t: 'Netfang', type: 'email', req: true, auto: 'email' },
    { k: 'kt', t: 'Kennitala fyrirtækis', req: true },
    { k: 'heimili', t: 'Heimilisfang', req: true, auto: 'street-address' },
    { k: 'postnr', t: 'Póstnúmer', req: true, auto: 'postal-code' },
    { k: 'simi', t: 'Sími', type: 'tel', auto: 'tel' },
  ],
}

export function Poki() {
  const l = usePoki()
  const on = useOpid()
  const panel = useRef<HTMLDivElement | null>(null)
  const aftur = useRef<HTMLElement | null>(null)
  const [tegund, setTegund] = useState<Tegund>('nuverandi')
  const [gildi, setGildi] = useState<Record<string, string>>({})
  const [villur, setVillur] = useState<string[]>([])
  const [kvittun, setKvittun] = useState<string | null>(null)
  const id = useId()

  /* No inert here: the drawer is visibility:hidden when closed, which already
     removes it from the tab order and the accessibility tree, and toggling
     inert cost the first tap after opening on iOS Safari. */

  useEffect(() => {
    if (!on) return
    aftur.current = document.activeElement as HTMLElement | null
    const lenis = (window as unknown as { __goaLenis?: { stop: () => void; start: () => void } }).__goaLenis
    lenis?.stop()
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('.goa-pokiX')?.focus(), 60)
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

  const senda = (e: FormEvent) => {
    e.preventDefault()
    const vantar = REITIR[tegund].filter((r) => r.req && !(gildi[r.k] ?? '').trim()).map((r) => r.k)
    if (gildi.netfang && !/^\S+@\S+\.\S+$/.test(gildi.netfang)) vantar.push('netfang')
    setVillur(vantar)
    if (vantar.length) {
      /* put the cursor where the problem is, not just a red line somewhere below */
      const i = REITIR[tegund].findIndex((r) => vantar.includes(r.k))
      window.setTimeout(() => panel.current?.querySelectorAll<HTMLInputElement>('.goa-reitur input')[i]?.focus(), 0)
      return
    }
    if (!l.length) return
    const haus = REITIR[tegund].map((r) => `${r.t}: ${gildi[r.k] ?? ''}`).join('\n')
    const vorur = l.map((x) => `${String(x.magn).padStart(3)} × ${x.n} (${x.pk}), vörunr. ${x.nr}`).join('\n')
    setKvittun(
      `Til: pantanir@goa.is\nEfni: Pöntun, ${tegund === 'nyr' ? 'nýr viðskiptavinur' : 'núverandi viðskiptavinur'}\n\n` +
      `${haus}\n\n${vorur}` + (gildi.ath ? `\n\nAthugasemdir: ${gildi.ath}` : ''),
    )
  }

  const nyPontun = () => { setKvittun(null); setGildi({}); setVillur([]); poki.clear() }

  return (
    <>
      <div className={`goa-pokiBak${on ? ' on' : ''}`} onClick={() => poki.open(false)} aria-hidden="true" />
      <div ref={panel} className={`goa-pokiS${on ? ' on' : ''}`} role="dialog" aria-modal="true"
        aria-labelledby={`${id}-t`} data-lenis-prevent="">
        <div className="goa-pokiT">
          <h2 id={`${id}-t`}>Nammipokinn þinn</h2>
          <button className="goa-pokiX" onClick={() => poki.open(false)} aria-label="Loka nammipoka">×</button>
        </div>
        <div className="goa-pokiB">
          {kvittun ? (
            <>
              <p style={{ margin: 0, fontWeight: 500 }}>Svona berst pöntunin til Góu.</p>
              <pre className="goa-kvittun">{kvittun}</pre>
              <p className="goa-smatt">
                Þetta er frumgerð og ekkert var sent. Á tilbúnum vef fer pöntunin beint á
                pantanir@goa.is og afrit á netfangið sem pantað er á.
              </p>
            </>
          ) : (
            <>
              {l.length ? (
                <ul className="goa-pokiL">
                  {l.map((x) => (
                    <li key={x.nr}>
                      <span>{x.n}<small>{x.pk} · vörunr. {x.nr}</small></span>
                      <span className="goa-magn">
                        <button type="button" onClick={() => poki.set(x.nr, x.magn - 1)} aria-label={`Færri ${x.n}`}>−</button>
                        <span aria-live="polite">{x.magn}</span>
                        <button type="button" onClick={() => poki.set(x.nr, x.magn + 1)} aria-label={`Fleiri ${x.n}`}>+</button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="goa-pokiTomt">
                  Pokinn er tómur. Veldu „+ Í pokann“ við vöru í hillunni, eða skrifaðu beint á pantanir@goa.is.
                </p>
              )}
              <form className="goa-form" id={`${id}-f`} onSubmit={senda} noValidate>
                <fieldset>
                  <legend>Pöntun fyrir</legend>
                  {(['nuverandi', 'nyr'] as Tegund[]).map((t) => (
                    <label className="goa-tegund" key={t}>
                      <input type="radio" name={`${id}-teg`} checked={tegund === t}
                        onChange={() => { setTegund(t); setVillur([]) }} />
                      {t === 'nuverandi' ? 'Núverandi viðskiptavin' : 'Nýjan viðskiptavin'}
                    </label>
                  ))}
                </fieldset>
                {REITIR[tegund].map((r, i) => (
                  <label className="goa-reitur" key={`${tegund}-${r.k}`} style={{ ['--i' as string]: i }}>
                    {r.t}{r.req ? '' : ' (valfrjálst)'}
                    <input type={r.type ?? 'text'} autoComplete={r.auto} value={gildi[r.k] ?? ''}
                      aria-invalid={villur.includes(r.k)}
                      onChange={(e) => setGildi((g) => ({ ...g, [r.k]: e.target.value }))} />
                  </label>
                ))}
                <label className="goa-reitur">
                  Athugasemdir við pöntun (valfrjálst)
                  <textarea value={gildi.ath ?? ''} onChange={(e) => setGildi((g) => ({ ...g, ath: e.target.value }))} />
                </label>
                {villur.length ? <p className="goa-villa" role="alert">Fylltu út reitina sem eru merktir.</p> : null}
              </form>
            </>
          )}
        </div>
        <div className="goa-pokiF">
          {kvittun ? (
            <button className="goa-hnappur" onClick={nyPontun}>Byrja nýja pöntun</button>
          ) : (
            <button className="goa-hnappur" type="submit" form={`${id}-f`} disabled={!l.length}
              style={l.length ? undefined : { opacity: .45, cursor: 'not-allowed' }}>
              Senda pöntun{l.length ? ` (${l.reduce((a, x) => a + x.magn, 0)})` : ''}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
