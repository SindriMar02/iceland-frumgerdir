import { useEffect, useId, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Home as House, Plus } from 'lucide-react'
import { IMG, ROOMS, ROOMS_PAGE, BOOKING_URL } from './data'
import type { Room } from './data'
import { PageHero, Photo, Title, inertIf, refreshSoon } from './shell'

/* /gisting, v4: every Godo room type as a row that folds open (the same
   0fr → 1fr grammar as the home page), grouped hotel / cottages, filtered
   by ?tegund= so a filtered list can be shared and survives back. */

export const ROOMS_CSS = `
.bj3 .rooms{padding:clamp(64px,8vw,120px) 0 var(--sec)}
.bj3 .rooms .bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 32px;margin-bottom:clamp(40px,5vw,72px)}
.bj3 .filters{display:flex;gap:8px;flex-wrap:wrap}
.bj3 .filters button{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid var(--line);
  font-size:.92rem;font-weight:520;white-space:nowrap;transition:background-color .25s ease,color .25s ease,border-color .25s ease}
.bj3 .filters button span{font-size:.78rem;color:var(--mute);font-variant-numeric:tabular-nums}
.bj3 .filters button:hover{border-color:var(--ink)}
.bj3 .filters button[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--on)}
.bj3 .filters button[aria-pressed="true"] span{color:rgba(245,244,241,.7)}
.bj3 .filters button:focus-visible{outline:2px solid var(--band);outline-offset:3px}
@media (max-width:767px){.bj3 .filters{flex-wrap:nowrap;overflow-x:auto;margin:0 calc(var(--gut) * -1);padding:2px var(--gut);scrollbar-width:none}.bj3 .filters::-webkit-scrollbar{display:none}}
.bj3 .rooms .count{font-size:.92rem;color:var(--mute)}

.bj3 .rgroup+.rgroup{margin-top:clamp(64px,8vw,112px)}
.bj3 .rgroup .t-h2{margin-bottom:clamp(20px,2.4vw,32px)}
.bj3 .rlist{border-top:1px solid var(--line)}
.bj3 .rrow{border-bottom:1px solid var(--line);scroll-margin-top:calc(90px + env(safe-area-inset-top))}
.bj3 .rrow h3{margin:0}
.bj3 .rbtn{all:unset;box-sizing:border-box;cursor:pointer;width:100%;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:clamp(16px,2.4vw,36px);padding:18px 0}
.bj3 .rbtn:focus-visible{outline:2px solid var(--band);outline-offset:4px}
.bj3 .rbtn .thumb{width:clamp(88px,10vw,148px);aspect-ratio:4/3;border-radius:10px;overflow:hidden;background:#DAD9D5;transition:transform .6s var(--ease)}
.bj3 .rbtn .thumb img{width:100%;height:100%;object-fit:cover;display:block}
.bj3 .rbtn .thumb.plain{display:grid;place-items:center;color:var(--mute)}
.bj3 .rbtn .name{display:grid;gap:4px}
.bj3 .rbtn .name b{font-family:var(--serif);font-weight:300;font-size:clamp(1.35rem,2.2vw,2.1rem);line-height:1.12;transition:transform .5s var(--ease)}
.bj3 .rbtn .name span{font-size:.92rem;color:var(--mute)}
@media (hover:hover) and (pointer:fine){.bj3 .rbtn:hover .name b{transform:translateX(6px)}}
.bj3 .rbtn i{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);transition:transform .5s var(--ease),background-color .3s,color .3s}
.bj3 .rbtn[aria-expanded="true"] i{transform:rotate(45deg);background:var(--ink);color:var(--on);border-color:var(--ink)}
.bj3 .rbtn[aria-expanded="true"] .thumb{transform:scale(.94)}
.bj3 .rpanel .acc-inner{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(24px,4vw,64px);padding:8px 0 clamp(32px,4vw,56px)}
.bj3 .gal .main{border-radius:var(--r)}
.bj3 .gal .main img{animation:bj3-fade .35s ease-out both}
.bj3 .gal .plain{aspect-ratio:4/3;border-radius:var(--r);background:var(--paper);display:grid;place-items:center;text-align:center;color:var(--mute)}
.bj3 .gal .plain strong{display:block;font-family:var(--serif);font-weight:300;font-size:2.4rem;color:var(--ink)}
.bj3 .thumbs{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.bj3 .thumbs button{all:unset;cursor:pointer;width:72px;height:54px;border-radius:8px;overflow:hidden;opacity:.55;transition:opacity .25s ease;outline-offset:2px}
.bj3 .thumbs button[aria-pressed="true"],.bj3 .thumbs button:hover{opacity:1}
.bj3 .thumbs button:focus-visible{outline:2px solid var(--band)}
.bj3 .thumbs img{width:100%;height:100%;object-fit:cover;display:block}
.bj3 .rdet{display:grid;align-content:start;gap:22px}
.bj3 .rdet .body{max-width:44ch}
.bj3 .rdet .note{font-size:.92rem;font-weight:560;color:var(--band)}
.bj3 .rdet .pill{justify-self:start}
@media (max-width:899px){.bj3 .rpanel .acc-inner{grid-template-columns:1fr}}
@media (max-width:520px){.bj3 .rbtn{grid-template-columns:auto minmax(0,1fr) auto;gap:14px}.bj3 .rbtn .thumb{width:76px}}

.bj3 .rnotes{margin-top:clamp(72px,9vw,128px);background:var(--paper);border-radius:var(--r);padding:clamp(28px,4vw,56px);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px 48px;align-items:center}
.bj3 .rnotes div{display:grid;gap:8px;color:var(--text)}
@media (max-width:767px){.bj3 .rnotes{grid-template-columns:1fr}}
.bj3 .rempty{display:grid;gap:16px;justify-items:start;padding:32px 0}
`

type FilterId = 'allt' | 'hotel' | 'sumarhus' | 'bad' | 'eldhus'
const match = (r: Room, f: FilterId) =>
  f === 'allt' || (f === 'hotel' && r.group === 'hotel') || (f === 'sumarhus' && r.group === 'sumarhus') ||
  (f === 'bad' && r.privateBath) || (f === 'eldhus' && r.kitchen)

function RoomRow({ r, initial }: { r: Room; initial: boolean }) {
  const [open, setOpen] = useState(initial)
  const [i, setI] = useState(0)
  const uid = useId()
  const pics = r.pics.map((k) => IMG[k])
  const L = ROOMS_PAGE.labels
  useEffect(() => { if (initial) setOpen(true) }, [initial])
  return (
    <article className="rrow" id={r.id}>
      <h3>
        <button type="button" className="rbtn" aria-expanded={open} aria-controls={`${uid}-p`} onClick={() => { setOpen((o) => !o); refreshSoon() }}>
          {pics.length
            ? <span className="thumb"><img src={pics[0].srcS ?? pics[0].src} alt="" width={148} height={111} loading="lazy" decoding="async" /></span>
            : <span className="thumb plain"><House size={22} strokeWidth={1.2} aria-hidden="true" /></span>}
          <span className="name"><b>{r.name}</b><span>{r.size} m² · {L.guests}: {r.guests}</span></span>
          <i aria-hidden="true"><Plus size={18} strokeWidth={1.4} /></i>
        </button>
      </h3>
      <div id={`${uid}-p`} className="acc-panel rpanel" data-open={open} role="region" aria-label={r.name} {...inertIf(!open)}>
        <div><div className="acc-inner">
          <div className="gal">
            {pics.length ? (
              <>
                <Photo key={i} pic={pics[i]} sizes="(max-width: 899px) 92vw, 52vw" ratio="4 / 3" className="main" />
                {pics.length > 1 && (
                  <div className="thumbs" role="group" aria-label={`Myndir: ${r.name}`}>
                    {pics.map((p, k) => (
                      <button key={p.src} type="button" aria-pressed={k === i} aria-label={`Mynd ${k + 1} af ${pics.length}`} onClick={() => setI(k)}>
                        <img src={p.srcS ?? p.src} alt="" width={72} height={54} loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="plain" role="img" aria-label={`${r.name}, ${r.size} fermetrar. Engin mynd enn.`}>
                <div><strong>{r.size} m²</strong><span>Mynd væntanleg</span></div>
              </div>
            )}
          </div>
          <div className="rdet">
            <p className="body">{r.text}</p>
            {r.note && <p className="note">{r.note}</p>}
            <dl className="facts">
              <dt>{L.size}</dt><dd>{r.size} m²</dd>
              <dt>{L.guests}</dt><dd>{r.guests}</dd>
              <dt>{L.beds}</dt><dd>{r.beds}</dd>
              <dt>{L.bath}</dt><dd>{r.bath}</dd>
            </dl>
            <a className="pill pill-solid" href={BOOKING_URL} target="_blank" rel="noreferrer" aria-label={`${ROOMS_PAGE.book}: ${r.name}`}>{ROOMS_PAGE.book}</a>
          </div>
        </div></div>
      </div>
    </article>
  )
}

export function Rooms() {
  const { hash } = useLocation()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const ids = ROOMS_PAGE.filters.map((x) => x.id)
  const q = params.get('tegund') ?? ''
  const target = hash.replace('#', '')
  const f = (ids.includes(q) ? q : 'allt') as FilterId
  /* the room hash rides along: clearing a filter that hid a deep-linked room must not lose it */
  const setF = (id: FilterId) => { navigate({ search: id === 'allt' ? '' : `?tegund=${id}`, hash }, { replace: true, preventScrollReset: true }); refreshSoon() }
  /* a deep link to a room the current filter hides clears the filter */
  useEffect(() => {
    const r = ROOMS.find((x) => x.id === target)
    if (r && !match(r, f)) setF('allt')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])
  const shown = useMemo(() => ROOMS.filter((r) => match(r, f)), [f])
  const groups = (['hotel', 'sumarhus'] as const)
    .map((g) => ({ g, list: shown.filter((r) => r.group === g) }))
    .filter((x) => x.list.length)
  const count = (id: FilterId) => ROOMS.filter((r) => match(r, id)).length
  const anyTarget = ROOMS.some((r) => r.id === target)
  return (
    <>
      <PageHero pic={IMG.window} title={ROOMS_PAGE.title} sub={ROOMS_PAGE.sub} id="bj3-rooms-h1" />
      <div className="over">
        <section className="rooms" aria-label="Herbergi og sumarhús">
          <div className="wrap">
            <div className="bar">
              <div className="filters" role="group" aria-label="Sía herbergi">
                {ROOMS_PAGE.filters.map((x) => (
                  <button key={x.id} type="button" aria-pressed={f === x.id} onClick={() => setF(x.id as FilterId)}>
                    {x.label}<span>{count(x.id as FilterId)}</span>
                  </button>
                ))}
              </div>
              <p className="count" role="status">{`Sýni ${ROOMS_PAGE.count(shown.length)}`}</p>
            </div>
            {groups.length === 0 && (
              <div className="rempty">
                <p>{ROOMS_PAGE.empty}</p>
                <button type="button" className="pill pill-ink" onClick={() => setF('allt')}>{ROOMS_PAGE.reset}</button>
              </div>
            )}
            {groups.map(({ g, list }) => (
              <div key={`${f}-${g}`} className="rgroup">
                <Title text={ROOMS_PAGE.groups[g]} className="t-h2" />
                <p className="sr">{ROOMS_PAGE.count(list.length)}</p>
                <div className="rlist rv-up">
                  {list.map((r) => <RoomRow key={r.id} r={r} initial={anyTarget && r.id === target} />)}
                </div>
              </div>
            ))}
            <aside className="rnotes rv-up" aria-label="Gott að vita">
              <div>
                <p>{ROOMS_PAGE.included}</p>
                <p>{ROOMS_PAGE.newCottages}</p>
                <p>{ROOMS_PAGE.prices}</p>
              </div>
              <a className="pill pill-solid" href={BOOKING_URL} target="_blank" rel="noreferrer">Bóka gistingu</a>
            </aside>
          </div>
        </section>
      </div>
    </>
  )
}
