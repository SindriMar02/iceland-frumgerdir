import { useEffect, useId, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Home as House, Plus } from 'lucide-react'
import { IMG, ROOMS, fitsParty, matchesRoomFilter as match } from './data'
import type { Room } from './data'
import { PageHero, Photo, Title, inertIf, refreshSoon } from './shell'
import { UpcomingCottages } from './Additions'
import { StayPicker, Stepper } from './StayPicker'
import { BookingDock } from './Dock'
import { prices } from './availability'
import { useSite } from './site'
import { LIST_ANCHOR, ROOM_SLUG, SECTION } from './paths'

/* /gisting and /en/rooms: the booking flow in reading order. The party sits above
   the list (it decides what fits), every Godo room type is a row that folds open
   (the same 0fr → 1fr grammar as the home page) with one "Velja" control, the
   calendar follows, and the dock ("Dvölin þín", Dock.tsx) floats over the page
   saying what is chosen and naming the next step. The list is filtered by
   ?tegund= so a filtered list can be shared and survives Back. */
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
.bj3 .filtered-room{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .6s var(--ease),opacity .4s}
.bj3 .filtered-room[data-visible="true"]{grid-template-rows:1fr;opacity:1}
.bj3 .filtered-room>div{overflow:hidden}
.bj3 .rlist{border-top:1px solid var(--line)}
.bj3 .rrow{border-bottom:1px solid var(--line);scroll-margin-top:calc(90px + env(safe-area-inset-top))}
.bj3 .rrow h3{margin:0;min-width:0}
.bj3 .rhead{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:clamp(12px,2vw,28px)}
.bj3 .rsel{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;min-width:96px;padding:0 18px;border-radius:999px;
  border:1px solid var(--ink);font-size:.92rem;font-weight:560;white-space:nowrap;transition:background-color .25s ease,color .25s ease,border-color .25s ease,transform .16s var(--ease)}
@media (hover:hover){.bj3 .rsel:not([aria-disabled="true"]):hover{background:var(--ink);color:var(--on)}}
.bj3 .rsel:active{transform:scale(.97)}
.bj3 .rsel[aria-pressed="true"]{background:var(--band);border-color:var(--band);color:var(--on)}
.bj3 .rsel[aria-disabled="true"]{cursor:default;border-color:var(--line);color:var(--mute)}
.bj3 .rsel:focus-visible{outline:2px solid var(--band);outline-offset:3px}
.bj3 .rrow[data-selected="true"] .rbtn .name b{color:var(--band)}
.bj3 .rrow[data-selected="true"] .rbtn .thumb{box-shadow:0 0 0 2px var(--band)}
.bj3 .rrow[data-fits="false"] .rbtn .thumb{opacity:.55;filter:grayscale(.6)}
.bj3 .rbtn .name .why{color:var(--band);font-weight:560}
.bj3 .party{display:flex;align-items:center;gap:8px 28px;flex-wrap:wrap}
.bj3 .party .step{gap:14px}
.bj3 .rooms{scroll-margin-top:calc(70px + env(safe-area-inset-top))}
/* phones: the whole row already opens on tap, so the plus gives its width to the name */
/* phones: the whole row already opens on tap, so the plus gives its width to the name,
   and "Velja" drops under the facts, lined up with the text (76px thumb + 14px gap) */
@media (max-width:520px){
  .bj3 .rhead{grid-template-columns:1fr;gap:0}
  .bj3 .rhead .rbtn{grid-template-columns:auto minmax(0,1fr);padding-bottom:10px}
  .bj3 .rhead .rbtn>i{display:none}
  .bj3 .rbtn .name b{font-size:1.3rem}
  .bj3 .rhead>.rsel{justify-self:start;margin:0 0 16px 90px;min-height:40px;padding:0 16px}
}
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
.bj3 .rbook{margin-top:clamp(72px,9vw,128px);scroll-margin-top:calc(80px + env(safe-area-inset-top));display:grid;gap:clamp(24px,3vw,40px)}
.bj3 .rbook .head{display:grid;gap:14px;max-width:60ch}
`

type FilterId = 'allt' | 'hotel' | 'sumarhus' | 'bad' | 'eldhus'

function RoomRow({ r, initial }: { r: Room; initial: boolean }) {
  const { t, lang, stay, setStay } = useSite()
  const [open, setOpen] = useState(initial)
  const [i, setI] = useState(0)
  const uid = useId()
  const pics = r.pics.map((k) => IMG[k])
  const c = t.rooms[r.id]
  const L = t.roomsPage.labels
  const chosen = stay.room === r.id
  const fits = fitsParty(r, stay.adults, stay.children)
  const party = stay.adults + stay.children
  /* the build-time snapshot's lowest bookable rate, only once Godo's keys exist */
  const from = prices?.currency === 'ISK' ? prices.rooms[r.id]?.from : null
  const fromText = typeof from === 'number' && from > 0 ? t.picker.from(String(from).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'is' ? '.' : ',')) : ''
  /* choosing is one tap; a second tap on the chosen row lets it go */
  const choose = () => { if (fits) setStay({ room: chosen ? null : r.id }) }
  const sel = (
    <button type="button" className="rsel" aria-pressed={chosen} aria-disabled={!fits || undefined} onClick={choose}
      aria-label={chosen ? t.dock.chosenAria(c.name) : t.dock.chooseAria(c.name)}>
      {chosen ? <><Check size={16} strokeWidth={2} aria-hidden="true" />{t.picker.selected}</> : t.picker.select}
    </button>
  )
  useEffect(() => { if (initial) setOpen(true) }, [initial])
  return (
    <article className="rrow" id={ROOM_SLUG[r.id][lang]} data-anchor={`room-${r.id}`} data-selected={chosen} data-fits={fits}>
      <div className="rhead">
      <h3>
        <button type="button" className="rbtn" aria-expanded={open} aria-controls={`${uid}-p`} onClick={() => { setOpen((o) => !o); refreshSoon() }}>
          {pics.length
            ? <span className="thumb"><img src={pics[0].srcS ?? pics[0].src} alt="" width={148} height={111} loading="lazy" decoding="async" /></span>
            : <span className="thumb plain"><House size={22} strokeWidth={1.2} aria-hidden="true" /></span>}
          <span className="name"><b>{c.name}</b><span>{r.size} m² · {L.guests}: {c.guests}{fromText ? ` · ${fromText}` : ''}</span>{!fits && <span className="why">{party > r.maxGuests ? t.picker.tooSmall(party) : t.picker.partyMismatch}</span>}</span>
          <i aria-hidden="true"><Plus size={18} strokeWidth={1.4} /></i>
        </button>
      </h3>
      {sel}
      </div>
      <div id={`${uid}-p`} className="acc-panel rpanel" data-open={open} role="region" aria-label={c.name} {...inertIf(!open)}>
        <div><div className="acc-inner">
          <div className="gal">
            {pics.length ? (
              <>
                <Photo key={i} pic={pics[i]} sizes="(max-width: 899px) 92vw, 52vw" ratio="4 / 3" className="main" />
                {pics.length > 1 && (
                  <div className="thumbs" role="group" aria-label={t.ui.pictures(c.name)}>
                    {pics.map((p, k) => (
                      <button key={p.src} type="button" aria-pressed={k === i} aria-label={t.ui.picture(k + 1, pics.length)} onClick={() => setI(k)}>
                        <img src={p.srcS ?? p.src} alt="" width={72} height={54} loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="plain" role="img" aria-label={t.ui.noPhoto(c.name, r.size)}>
                <div><strong>{r.size} m²</strong><span>{t.ui.photoComing}</span></div>
              </div>
            )}
          </div>
          <div className="rdet">
            <p className="body">{c.text}</p>
            {r.group === 'sumarhus' && <p className="note">{t.cottageDiscount}</p>}
            {r.noPower && <p className="note">{t.noPower}</p>}
            <dl className="facts">
              <dt>{L.size}</dt><dd>{r.size} m²</dd>
              <dt>{L.guests}</dt><dd>{c.guests}</dd>
              <dt>{L.beds}</dt><dd>{c.beds}</dd>
              <dt>{L.bath}</dt><dd>{c.bath}</dd>
            </dl>
            {sel}
          </div>
        </div></div>
      </div>
    </article>
  )
}

export function Rooms() {
  const { t, lang, stay, setStay } = useSite()
  const { hash } = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const ids = t.roomsPage.filters.map((x) => x.id)
  const q = params.get('tegund') ?? ''
  const slug = decodeURIComponent(hash.replace('#', ''))
  const target = Object.keys(ROOM_SLUG).find((k) => ROOM_SLUG[k][lang] === slug) ?? ''
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
    .map((g) => ({ g, list: ROOMS.filter((r) => r.group === g) }))

  const count = (id: FilterId) => ROOMS.filter((r) => match(r, id)).length
  const anyTarget = !!target
  return (
    <>
      <PageHero pic={IMG.window} title={t.roomsPage.title} sub={t.roomsPage.sub} id="bj3-rooms-h1" />
      <div className="over">
        <section className="rooms" id={LIST_ANCHOR[lang]} aria-label={t.meta.rooms.title.split(' | ')[0]}>
          <div className="wrap">
            <div className="bar">
              <div className="party" role="group" aria-label={t.dock.partyAria}>
                <Stepper label={t.booking.adults} value={stay.adults} min={1} max={5} onChange={(n) => setStay({ adults: n })} />
                <Stepper label={t.booking.children} value={stay.children} min={0} max={4} onChange={(n) => setStay({ children: n })} />
              </div>
              <div className="filters" role="group" aria-label={t.ui.filterAria}>
                {t.roomsPage.filters.map((x) => (
                  <button key={x.id} type="button" aria-pressed={f === x.id} onClick={() => setF(x.id as FilterId)}>
                    {x.label}<span>{count(x.id as FilterId)}</span>
                  </button>
                ))}
              </div>
              <p className="count" role="status">{t.ui.showing(t.roomsPage.count(shown.length))}</p>
            </div>
            {groups.length === 0 && (
              <div className="rempty">
                <p>{t.roomsPage.empty}</p>
                <button type="button" className="pill pill-ink" onClick={() => setF('allt')}>{t.roomsPage.reset}</button>
              </div>
            )}
            {groups.map(({ g, list }) => (
              <div key={g} className="rgroup">
                {g === 'sumarhus' && <UpcomingCottages compact />}
                <Title text={t.roomsPage.groups[g]} className="t-h2" />
                <p className="sr">{t.roomsPage.count(list.filter((r) => match(r, f)).length)}</p>
                <div className="rlist rv-up">
                  {list.map((r) => (
                    <div key={r.id} className="filtered-room" data-visible={match(r, f)} {...inertIf(!match(r, f))} aria-hidden={!match(r, f)}>
                      <div><RoomRow r={r} initial={anyTarget && r.id === target} /></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <aside className="rnotes rv-up" aria-label={t.faq.eyebrow}>
              <div>
                <p>{t.roomsPage.included}</p>
                <p>{t.roomsPage.newCottages}</p>
                <p>{t.roomsPage.prices}</p>
              </div>
            </aside>
            <section id={SECTION.booking[lang]} data-anchor="booking" className="rbook" aria-labelledby="bj3-rbook">
              <div className="head">
                <p className="eyebrow rv-up">{t.booking.eyebrow}</p>
                <Title id="bj3-rbook" text={t.booking.title} stagger />
                <p className="body rv-up">{t.booking.lede}</p>
              </div>
              <StayPicker guests={false} />
            </section>
          </div>
        </section>
      </div>
      <BookingDock placement="fixed" />
    </>
  )
}
