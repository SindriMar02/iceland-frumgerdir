/**
 * "Dvölin þín": the one place that says what the guest has chosen so far, and the
 * one button that moves them on. Room, dates and party live in the shared stay
 * (site.tsx), so the rooms list, the calendar and this dock can never disagree.
 *
 * The button is never disabled. It always names the next step:
 *   no room yet        → Velja gistingu   (the list on the rooms page)
 *   room, no dates     → Velja dagsetningar (the calendar on this page)
 *   room + dates       → Bóka            (Godo, on that room, with dates + party)
 *   room can't take it → Velja aðra gistingu
 *   nobody type fits   → Bóka            (Godo without a room: it books several at once)
 * With dates but no room, a quiet second link opens Godo's full list for those dates.
 *
 * Placement: `fixed` on the rooms page (a floating bar on desktop, the phone's bottom
 * bar in place of the awning, back control included); `inline` under the calendar
 * at the foot of home.
 */
import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, House } from 'lucide-react'
import { IMG, ROOMS, fitsParty } from './data'
import { godoBookingUrl, nightsBetween } from './godo'
import { soldOut } from './availability'
import { fmtShort } from './StayPicker'
import { inertIf, useBack, useNavTo } from './shell'
import { useSite } from './site'
import { CAL_ANCHOR, LIST_ANCHOR, pathFor } from './paths'

export const DOCK_CSS = `
.bj3 .dock{color:var(--ink)}
.bj3 .dock-in{display:flex;align-items:center;justify-content:space-between;gap:16px 28px}
.bj3 .dock-stay{display:flex;align-items:center;gap:16px;min-width:0}
.bj3 .dock-thumb{flex:0 0 auto;width:64px;height:64px;border-radius:12px;overflow:hidden;background:var(--ground);display:grid;place-items:center;color:var(--mute)}
.bj3 .dock-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.bj3 .dock-text{display:grid;gap:2px;min-width:0;animation:bj3-fade .3s ease-out both}
.bj3 .dock-k{font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:var(--mute);margin:0}
.bj3 .dock-text strong{font-family:var(--serif);font-weight:300;font-size:1.3rem;line-height:1.15}
.bj3 .dock-text strong.dim{color:var(--mute)}
.bj3 .dock-text span{font-size:.9rem;color:var(--text)}
.bj3 .dock-text .dock-msg{color:var(--band);font-weight:560}
.bj3 .dock-act{display:flex;align-items:center;gap:20px;flex:0 0 auto}
.bj3 .dock-act .tlink{font-size:.88rem}
.bj3 .dock-go{display:inline-flex;align-items:center;gap:12px;min-height:52px;padding:0 10px 0 24px;border-radius:999px;background:var(--band);color:var(--on);
  font-weight:560;text-decoration:none;white-space:nowrap;transition:transform .2s var(--ease),background-color .25s}
.bj3 .dock-go i{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:rgba(245,244,241,.16);transition:transform .45s var(--ease)}
@media (hover:hover){.bj3 .dock-go:hover i{transform:translateX(3px)}}
.bj3 .dock-go:active{transform:scale(.97)}
.bj3 .dock-go:focus-visible{outline:2px solid var(--band);outline-offset:3px}
.bj3 .dock-back{display:none}

/* inline: a card under the calendar on home */
.bj3 .dock-inline{grid-column:1/-1;background:var(--ground);border-radius:var(--r);padding:16px 16px 16px 16px}

/* fixed: floats over the rooms page once the hero has gone */
.bj3 .dock-fixed{position:fixed;left:50%;bottom:20px;z-index:38;width:min(1100px,calc(100% - 40px));transform:translate(-50%,0);
  background:rgba(245,244,241,.94);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid var(--line);border-radius:20px;
  box-shadow:0 18px 50px -24px rgba(28,29,26,.35);padding:12px 12px 12px 12px;transition:transform .55s var(--ease),opacity .4s ease}
.bj3 .dock-fixed[data-on="false"]{transform:translate(-50%,calc(100% + 40px));opacity:0;pointer-events:none}
.bj3:has(.dock-fixed){padding-bottom:120px}

@media (max-width:767px){
  .bj3 .dock-fixed{left:0;right:0;bottom:0;width:auto;transform:none;border-radius:18px 18px 0 0;border-width:1px 0 0;
    padding:10px 12px calc(10px + env(safe-area-inset-bottom));box-shadow:0 -10px 30px -20px rgba(28,29,26,.4)}
  .bj3 .dock-fixed[data-on="false"]{transform:translateY(110%)}
  /* phones: the stay on one row (back + text), the next step full width under it */
  .bj3 .dock-in{gap:8px 10px;flex-wrap:wrap}
  .bj3 .dock-fixed .dock-stay{flex:1 1 calc(100% - 54px)}
  .bj3 .dock-fixed .dock-act{flex:1 1 100%}
  .bj3 .dock-fixed .dock-go{flex:1;justify-content:space-between}
  .bj3 .dock-fixed .dock-text .dock-disc{display:none}
  .bj3 .dock-back{display:grid;place-items:center;flex:0 0 44px;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);color:var(--ink)}
  .bj3 .dock-thumb,.bj3 .dock-k,.bj3 .dock-act .tlink{display:none}
  .bj3 .dock-text strong{font-size:1.02rem}
  .bj3 .dock-text span{font-size:.8rem}
  .bj3 .dock-go{min-height:48px;padding:0 6px 0 16px;gap:8px;font-size:.92rem}
  .bj3 .dock-go i{width:30px;height:30px}
  .bj3 .dock-inline .dock-thumb{display:grid;width:52px;height:52px}
  .bj3 .dock-inline .dock-in{flex-direction:column;align-items:stretch}
  .bj3 .dock-inline .dock-act{justify-content:space-between}
  .bj3 .dock-inline .dock-act .tlink{display:inline}
  .bj3 .dock-inline .dock-go{justify-content:space-between;flex:1}
}
@media (prefers-reduced-motion:reduce){
  .bj3 .dock-fixed,.bj3 .dock-go,.bj3 .dock-go i{transition:none}
  .bj3 .dock-text{animation:none}
}
`

export function BookingDock({ placement }: { placement: 'fixed' | 'inline' }) {
  const { t, lang, page, stay } = useSite()
  const navTo = useNavTo()
  const back = useBack()
  const [on, setOn] = useState(placement === 'inline')

  /* the floating bar waits until the hero has scrolled away */
  useEffect(() => {
    if (placement !== 'fixed') return
    let raf = 0
    const check = () => { raf = 0; setOn(window.scrollY > window.innerHeight * 0.55) }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check) }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [placement])

  const { checkin, checkout, adults, children } = stay
  const room = ROOMS.find((r) => r.id === stay.room) ?? null
  const dates = !!checkin && !!checkout
  const nights = dates ? nightsBetween(checkin, checkout) : 0
  const anyFits = ROOMS.some((r) => fitsParty(r, adults, children))
  const roomFits = !!room && fitsParty(room, adults, children)
  const roomFull = !!room && dates && soldOut(room.id, checkin, checkout)
  const c = room ? t.rooms[room.id] : null
  const pic = room?.pics[0] ? IMG[room.pics[0]] : null

  const listHref = `${pathFor(lang, 'rooms')}#${LIST_ANCHOR[lang]}`
  const calHref = `${pathFor(lang, page === 'home' ? 'home' : 'rooms')}#${CAL_ANCHOR[lang]}`
  const godo = (withRoom: boolean) => godoBookingUrl({
    checkin: dates ? checkin : null, checkout: dates ? checkout : null, adults, children,
    room: withRoom && room ? room.id : null, lang,
  })

  let label = t.dock.chooseRoom
  let href = listHref
  let external = false
  let msg = ''
  if (!anyFits) {
    msg = t.picker.group(adults + children)
    label = t.ui.book; href = godo(false); external = true
  } else if (room && (!roomFits || roomFull)) {
    msg = !roomFits ? t.picker.tooSmall(adults + children) : t.picker.soldOut
    label = t.dock.chooseOther
  } else if (room && dates) {
    label = t.ui.book; href = godo(true); external = true
  } else if (room) {
    label = t.dock.chooseDates; href = calHref
  }
  const seeAll = dates && !room && anyFits

  const when = dates ? `${fmtShort(checkin, t, lang)} → ${fmtShort(checkout, t, lang)} · ${nights} ${nights === 1 ? t.booking.night : t.booking.nights}` : t.dock.noDates
  const onGo = (e: MouseEvent<HTMLAnchorElement>) => { if (!external) navTo(href, e) }

  return (
    <div className={`dock dock-${placement}`} data-on={on} role="region" aria-label={t.dock.title} {...inertIf(!on)}>
      <div className="dock-in">
        {placement === 'fixed' && page !== 'home' && (
          <a className="dock-back" href={back.href} onClick={back.onClick} aria-label={t.ui.backAria}><ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" /></a>
        )}
        <div className="dock-stay">
          <span className="dock-thumb" aria-hidden="true">
            {pic ? <img src={pic.srcS ?? pic.src} alt="" width={64} height={64} loading="lazy" decoding="async" /> : <House size={22} strokeWidth={1.3} />}
          </span>
          {/* keyed on the choice so a change fades in instead of snapping */}
          <div className="dock-text" key={`${stay.room}|${checkin?.getTime()}|${checkout?.getTime()}|${adults}|${children}`} aria-live="polite">
            <p className="dock-k">{t.dock.title}</p>
            <strong className={c ? '' : 'dim'}>{c ? c.name : t.dock.noRoom}</strong>
            <span>{when} · {t.dock.guests(adults, children)}</span>
            {msg ? <span className="dock-msg">{msg}</span> : room?.group === 'sumarhus' ? <span className="dock-disc">{t.dock.discount}</span> : null}
          </div>
        </div>
        <div className="dock-act">
          {seeAll && <a className="tlink" href={godo(false)}>{t.dock.seeAll}</a>}
          <a className="dock-go" href={href} onClick={onGo} aria-label={room && external ? t.booking.roomFor(c?.name ?? '') : undefined}>
            {label}<i aria-hidden="true">{external ? <ArrowUpRight size={17} strokeWidth={1.5} /> : <ArrowRight size={17} strokeWidth={1.5} />}</i>
          </a>
        </div>
      </div>
    </div>
  )
}
