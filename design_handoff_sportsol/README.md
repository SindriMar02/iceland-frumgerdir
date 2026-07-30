# Sportsól — "Komdu í ljós" — design handoff

Redesign prototype for a two-location tanning salon (Sportsól ehf, Hamraborg/Kópavogur +
Hverafold/Grafarvogur). This package documents the shipped design system so it can be
reviewed, extended, or handed to another designer/engineer without re-deriving decisions
from the live code.

**Live prototype:** https://sindrimar02.github.io/iceland-frumgerdir/preview/sportsol/
**Source:** `iceland-redesigns` repo, `src/preview/sportsol/` (Page.tsx + data.ts)
**Client's current site (being redesigned):** https://sportsol.is

## What's in this package

- `foundations/colors.html` — full palette, all derived from the client's own logo fuchsia
- `foundations/type.html` — Cabinet Grotesk type scale + an Icelandic glyph stress-test
- `foundations/logo.html` — the original, unaltered logo asset on all three grounds it appears on
- `foundations/tokens.css` / `foundations/fonts.css` — shared CSS every component card imports
- `components/*.html` — one card per section: nav, buttons, price board (live toggle), plans,
  bed rail, infrared chapter, Frelsi gift card, FAQ, footer CTA
- `components/hero-uv.html` — **the signature moment**, a live faithful reproduction of the
  production hero: 14 UV tubes strike on load and hum forever

## The core idea

Their pricing is time-of-day based (a morning rate and a day rate), so the whole design
plays with light and dark rather than a generic hero-cards-testimonials template. The
landing page opens *inside the tanning room itself*: tubes flicker to life exactly like the
real fluorescent strike, then hum with irregular micro-flicker forever as pure ambience.
No timer, no interaction required — it's atmosphere, not a toy.

## Design decisions and why

- **Logo-first palette.** Every color on the page derives from the client's real logo
  (#F810F0, sampled directly from their asset). Nothing was invented; the brand told us
  the palette.
- **One accent hue.** Fuchsia only. Gold/coral exist purely as decorative gradient stops
  (weekend-offer strip, infrared glow, Frelsi card) — never as text or button fills.
- **Cabinet Grotesk, one family, four weights.** Two earlier directions (Britney Ultra,
  then Panchang) were tried and rejected by the client as too loud / not fitting — Cabinet
  Grotesk was the third and final choice specifically because it's calm enough to let the
  logo carry the personality.
- **Theme lock.** Light sections (verðskrá, áskrift, stofurnar, footer) all share the same
  sun-white ground; dark sections (hero, infrared, final CTA) share the same dusk ground.
  No section flips mid-scroll.
- **One radius system.** Every card shell is `2rem` outer / concentric inner (double-bezel:
  a tinted shell wrapping a lighter inner card). Every button is a full pill. No exceptions.

## Verified facts (do not invent new ones)

All copy and pricing below was checked against sportsol.is on 2026-07-04/05. If anything
changes on their end, re-verify before updating this package — do not extrapolate.

**Locations**
- Hamraborg 16, 200 Kópavogur — opened January 2026, brand-new beds
- Hverafold 1-3, 112 Reykjavík (Grafarvogur neighbourhood) — opened December 2024
- Phone 554 3799 · sportsol@sportsol.is · booking via Noona (noona.app/sportsol)

**Beds:** Luxura JEWEL (both locations), Luxura Vegaz (Hamraborg), Luxura X10 / X10 Túrbó
(Hverafold), standing bed (both), American M7 infrared (Hamraborg only, 15-minute sessions)

**Pricing (morning 10-14 / day from 14):** Vegaz/Túrbó/venjulegir 1.832-3.490 kr.;
JEWEL 1.910-4.290 kr.; standing 1.752-3.490 kr.; weekend offer 1.900 kr.;
infrared single sessions 1.490/1.980 kr. (all-day rate, included in subscription)

**Subscriptions:** 8.990 kr./mo (3-month notice, ≈299 kr./day — the hero's headline claim) ·
9.990 kr./mo (1-month notice, ≈330 kr./day) · infrared-only 4.990 kr./mo (3-month notice,
no access to standard beds)

**Frelsi (gift card):** pay 10.000 kr., get 12.500 kr. credit. Never expires. Both locations,
stacks with the weekend/morning offers.

## House rules for anyone extending this

- No em-dashes or en-dashes in visible copy (orthographic hyphens inside real Icelandic
  compounds are fine and required — e.g. "Varnar- og öryggisfyrirtæki").
- Never render a ð/þ word in `text-transform: uppercase` without checking the font's
  capital Eth/Thorn first — several fonts silently fall back to a bar-less "D".
- Every filled button needs real hover (`brightness`) and press (`scale(0.98)`) feedback;
  outline buttons need a background-tint hover. See `components/buttons.html`.
- One booking verb only: "Bóka tíma." Do not introduce a synonym anywhere on the page.
- The UV tube animation is ambience — resist the urge to gate it behind a click or add a
  timer. That was a previous direction (a 15-minute countdown sunbed section) that was
  explicitly removed in favour of this simpler, always-on approach.

## Open items

- The client has not yet been sent outreach — email draft lives in
  `iceland-redesigns/src/preview/companies.ts` under the `sportsol` entry.
- No production deploy target chosen yet (this is a GitHub Pages prototype, not client
  infrastructure).
