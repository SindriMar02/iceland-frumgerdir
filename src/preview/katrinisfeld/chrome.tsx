/**
 * The site chrome: a fixed header that themes itself against whichever colour
 * band it is currently over, and a footer that is also the site's internal
 * link graph.
 *
 * THE BUG THIS FIXES: in the one-page build the nav links were simply
 * `display: none` below 640px with nothing put in their place, so on a phone
 * — where most of her visitors are — the header offered a wordmark and a
 * single "Hafa samband" and no way to reach anything else. A site with
 * twenty-six pages cannot navigate itself that way.
 *
 * The panel opens on click only. Opening a menu on hover and closing it on
 * blur is what makes a nav feel broken on touch: a tap fires hover, focus and
 * click in sequence and they cancel each other out.
 */
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { STUDIO, ADDRESS_LINE, HOURS_DAYS_IS } from './facts'
import { CATEGORIES } from './projects'
import { HOME, WORK, BRANDS_PATH, STUDIO_PATH, CONTACT_PATH, EN_PATH, category } from './paths'

const NAV = [
  { to: WORK, label: 'Verkefni' },
  { to: BRANDS_PATH, label: 'Ítalskar innréttingar' },
  { to: STUDIO_PATH, label: 'Stúdíóið' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="ki-nav">
        <Link className="ki-nav-mark" data-ki-chrome to={HOME}>KATRÍN&nbsp;ÍSFELD</Link>
        <nav className="ki-nav-links" aria-label="Aðalvalmynd">
          {NAV.map((n) => (
            <Link key={n.to} data-ki-chrome to={n.to} aria-current={pathname === n.to ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link className="ki-nav-cta" data-ki-chrome to={CONTACT_PATH}>Hafa samband</Link>
        <button
          type="button"
          className="ki-burger"
          data-ki-chrome
          aria-expanded={open}
          aria-controls="ki-panel"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="ki-burger-bars" aria-hidden="true"><i /><i /></span>
          <span className="ki-sr">{open ? 'Loka valmynd' : 'Opna valmynd'}</span>
        </button>
      </header>

      <div id="ki-panel" className={`ki-panel ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav aria-label="Valmynd">
          <Link to={HOME}>Forsíða</Link>
          <Link to={WORK}>Öll verkefni</Link>
          {(['innanhusshonnun', 'gistiheimili-og-hotel', 'atvinnuhusnaedi'] as const).map((c) => (
            <Link key={c} to={category(c)} className="ki-panel-sub">{CATEGORIES[c].nav}</Link>
          ))}
          <Link to={BRANDS_PATH}>Ítalskar innréttingar</Link>
          <Link to={STUDIO_PATH}>Stúdíóið</Link>
          <Link to={CONTACT_PATH}>Hafa samband</Link>
        </nav>
        <div className="ki-panel-foot">
          <a href={STUDIO.phoneHref}>{STUDIO.phoneDisplay}</a>
          <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
        </div>
      </div>
    </>
  )
}

export function Foot() {
  return (
    <footer className="ki-foot" data-ki-band="dark">
      <div className="ki-foot-grid">
        <div>
          <p className="ki-foot-mark">KATRÍN ÍSFELD</p>
          <p className="ki-foot-line">{STUDIO.role} · {STUDIO.name}</p>
          <p className="ki-foot-line">{ADDRESS_LINE}</p>
          <p className="ki-foot-line">
            <a href={STUDIO.phoneHref}>{STUDIO.phoneDisplay}</a> ·{' '}
            <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
          </p>
          <p className="ki-foot-line">Opnunartími {STUDIO.opens}–{STUDIO.closes} {HOURS_DAYS_IS}, eftir samkomulagi</p>
        </div>
        <nav aria-label="Verkefni">
          <p className="ki-foot-head">Verkefni</p>
          {(['innanhusshonnun', 'gistiheimili-og-hotel', 'atvinnuhusnaedi'] as const).map((c) => (
            <Link key={c} className="ki-foot-link" to={category(c)}>{CATEGORIES[c].nav}</Link>
          ))}
          <Link className="ki-foot-link" to={WORK}>Öll verkefni</Link>
        </nav>
        <nav aria-label="Stúdíóið">
          <p className="ki-foot-head">Stúdíóið</p>
          <Link className="ki-foot-link" to={BRANDS_PATH}>Ítalskar innréttingar</Link>
          <Link className="ki-foot-link" to={STUDIO_PATH}>Um Katrínu</Link>
          <Link className="ki-foot-link" to={CONTACT_PATH}>Hafa samband</Link>
          <Link className="ki-foot-link" to={EN_PATH} lang="en">In English</Link>
        </nav>
        <div>
          <p className="ki-foot-head">Fylgjast með</p>
          <a className="ki-foot-link" href={STUDIO.instagram} rel="me noopener" target="_blank">Instagram</a>
          <a className="ki-foot-link" href={STUDIO.facebook} rel="me noopener" target="_blank">Facebook</a>
          <a className="ki-foot-link" href={STUDIO.linkedin} rel="me noopener" target="_blank">LinkedIn</a>
        </div>
      </div>
      <p className="ki-foot-fine">
        © {STUDIO.founded}–2026 {STUDIO.name}. Allar verkefnaljósmyndir eru af eigin verkefnum
        Katrínar. Efnisreinarnar á forsíðunni eru myndgerðar efnisstúdíur í litum verkefnanna.
      </p>

      {/* The name is the last thing on the page and the largest thing on it.
          Two words in their own masks: each rises on the reveal sweep, and the
          pair drifts apart as the footer comes up, on the spread primitive the
          scroll engine already runs. */}
      <div className="ki-footwm ki-rv" data-ki-par="spread-in" aria-hidden="true">
        <span className="ki-footwm-word"><i>KATRÍN</i></span>
        <span className="ki-footwm-word"><i>ÍSFELD</i></span>
      </div>
    </footer>
  )
}
