/**
 * Reynir bakari — the location map card.
 *
 * Sits in the empty left column of the visit strip, opposite the address and
 * hours. Two locations, so the card carries a small segmented switch rather
 * than two maps: picking a location swaps the map and the "open in Maps" link.
 *
 * DARK TREATMENT: a stock Google Maps embed is bright white and would punch a
 * hole through this near-black page (the page is theme-locked dark). The iframe
 * is a cross-origin document so its own styles are unreachable, and dark map
 * tiles otherwise need the JS Maps API plus a billable key. The honest fix
 * without a key is a CSS filter on the iframe: invert then rotate the hue back
 * so land goes dark while the palette stays roughly correct. It is framed with
 * the same gold hairline and mat as the product photo elsewhere on the page, so
 * it reads as a deliberate plate rather than a pasted widget.
 *
 * The embed URL is the keyless maps.google.com/?output=embed form.
 */

import { useState } from 'react'
import type { Lang } from './data'
import { BODY, DIM, EASE, GOLD, GOLD_LIGHT, INK_DEEP, IVORY } from './tokens'

export interface MapLocation {
  /** Small label above the address, e.g. "Bakery and café". */
  label: string
  /** The address exactly as it is shown elsewhere on the page. */
  address: string
  /** Search string handed to Google Maps. */
  query: string
}

const MAP_CSS = `
  .rb-map { margin-top:clamp(26px,4vh,38px); }
  .rb-map-switch { display:flex; gap:6px; margin-bottom:12px; }
  .rb-map-tab { flex:1; min-height:44px; padding:10px 12px; cursor:pointer; font-family:${BODY};
    font-size:13px; letter-spacing:.04em; color:${DIM}; background:transparent;
    border:1px solid rgba(238,211,170,.16); border-radius:4px;
    transition:color .22s ${EASE}, border-color .22s ${EASE}, background .22s ${EASE}; }
  .rb-map-tab:hover { color:${IVORY}; border-color:rgba(238,211,170,.36); }
  .rb-map-tab[aria-selected="true"] { color:${GOLD_LIGHT}; border-color:${GOLD}; background:rgba(200,168,119,.09); }
  .rb-map-tab:focus-visible { outline:2px solid ${GOLD}; outline-offset:2px; }

  /* the plate: gold hairline, thin mat, concentric radii, soft lift */
  .rb-map-frame { position:relative; border:1px solid rgba(238,211,170,.22); border-radius:10px; padding:5px;
    background:linear-gradient(160deg, rgba(243,234,211,.06), rgba(243,234,211,.02));
    box-shadow:0 26px 56px -28px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.05); }
  .rb-map-inner { position:relative; border-radius:6px; overflow:hidden; background:${INK_DEEP}; aspect-ratio:4 / 3; }
  /* Inverting flips Google's warm POI pins to vivid blue, which fights the gold
     palette, so saturation is pulled almost out: the map reads as a monochrome
     printed plate instead of a colour widget parked on the page. */
  .rb-map-inner iframe { position:absolute; inset:0; width:100%; height:100%; border:0; display:block;
    filter:invert(1) hue-rotate(180deg) saturate(.14) brightness(.86) contrast(1.08); }
  /* tints the neutral tiles back toward the page's gold */
  .rb-map-inner::after { content:''; position:absolute; inset:0; pointer-events:none;
    background:rgba(200,168,119,.16); mix-blend-mode:soft-light; }

  .rb-map-meta { display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; margin-top:12px; }
  .rb-map-addr { font-size:13.5px; color:${DIM}; line-height:1.5; }
  .rb-map-open { margin-left:auto; font-size:13.5px; color:${GOLD_LIGHT}; text-decoration:none;
    display:inline-flex; align-items:center; gap:6px; padding:12.5px 2px;
    border-bottom:1px solid rgba(238,211,170,.32); transition:color .2s ${EASE}, border-color .2s ${EASE}; }
  .rb-map-open:hover { color:${IVORY}; border-bottom-color:${GOLD}; }
  .rb-map-open:focus-visible { outline:2px solid ${GOLD}; outline-offset:3px; border-radius:3px; }

  @media (max-width:620px) {
    .rb-map-meta { flex-direction:column; align-items:flex-start; gap:2px; }
    .rb-map-open { margin-left:0; }
    .rb-map-inner { aspect-ratio:3 / 2; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rb-map-tab, .rb-map-open { transition:none; }
  }
`

export default function MapCard({ lang, locations }: { lang: Lang; locations: MapLocation[] }) {
  const [active, setActive] = useState(0)
  const loc = locations[active] ?? locations[0]
  if (!loc) return null

  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(loc.query)}&z=15&output=embed&hl=${lang}`
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.query)}`

  return (
    <div className="rb-map">
      <style dangerouslySetInnerHTML={{ __html: MAP_CSS }} />

      {locations.length > 1 && (
        <div className="rb-map-switch" role="tablist" aria-label={lang === 'is' ? 'Veldu stað' : 'Choose a location'}>
          {locations.map((l, i) => (
            <button
              key={l.address}
              type="button"
              role="tab"
              aria-selected={i === active}
              className="rb-map-tab"
              onClick={() => setActive(i)}
            >
              {l.address.split(',')[0]}
            </button>
          ))}
        </div>
      )}

      <div className="rb-map-frame">
        <div className="rb-map-inner">
          <iframe
            // remount per location so the embed reloads rather than caching the first map
            key={loc.query}
            src={embed}
            title={`${lang === 'is' ? 'Kort' : 'Map'}: ${loc.address}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <div className="rb-map-meta">
        <span className="rb-map-addr">{loc.address}</span>
        <a className="rb-map-open" href={openUrl} target="_blank" rel="noreferrer">
          {lang === 'is' ? 'Opna í Google kortum' : 'Open in Google Maps'}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <path d="M3 1h7v7M10 1L1 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  )
}
