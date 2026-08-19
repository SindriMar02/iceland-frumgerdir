# Mirror Lodge — „Landslagið klæðir húsið"

**Design read:** single-object premium glass cabin by Geysir for couples;
chrome/silver register, grotesk-led. Dials: VARIANCE 8 · MOTION 7 · DENSITY 3.
English-first prototype (their market; site is EN/DE/IS).

## Concept
A mirror-clad cabin has no colour of its own: **the landscape wears the
house**. Signature: THE MIRROR — a 320svh pinned frame (CSS sticky, no GSAP)
where the cabin's world wipes from snow to open land to aurora via
scroll-driven `clip-path: inset(right)`, all with their own photographs.
Identity device: the wordmark stands on its own true reflection
(scaleY(-1) + mask) in loader, hero and footer — the cladding, typographically.

## Tokens
| | |
|---|---|
| SILVER | `#F4F6F7` canvas |
| GRAPHITE | `#14181B` (15.2:1, AAA) |
| MOSS | `#3F6B5B` single accent (5.5:1, AA) |
| Display | Clash Display 200/300 |
| Text/UI | General Sans 300/400/500 |
| Ease | `cubic-bezier(.25,.9,.25,1)` |

Sharp corners, light theme, one accent — all locked. Distinct from ILL
(serif/dusk-blue/waterline) by register: grotesk/moss-green/mirror-wipe.

## Engine
Vanilla: ONE module-scope rAF (drift set + scrub set, read pass → write
pass), IO reveals, CSS sticky pin. Resting state visible; `.js` arms starts.

## Motion table
| element | motion | trigger |
|---|---|---|
| preloader wordmark + reflection | two-stop gradient fill by real decode progress, floor 1.1s / cap 2.4s, `ml_seen`, `?loader` | mount |
| hero wordmark | translateY 112%→0, 1.2s; reflection follows at +60ms | `ml:revealed` |
| hero sub | opacity+y, .9s, .75s delay | `ml:revealed` |
| hero photo | drift d=8, inset 11% | shared rAF |
| THE MIRROR layers | `clip-path inset(0 X% 0 0)` wipe, X 100→0 per segment | scroll progress in rAF |
| drift frames | −p·d% (9–11), `--dz = max(9%, d·1.35%)` | shared rAF |
| rise text | translateY 112%→0 in mask, 1s | IO 0.2 |
| facts / amenities / points | opacity + small offset, staggered | IO |
| gallery | ONE slow marquee, 60s linear, pauses on hover | CSS |
| gallery items | hover img scale 1.06 | hover |
| CTA | hover bg→MOSS, active press | hover/active |
| burger / sheet | X morph .45s; links stagger 55ms | click |

Reduced motion: no loader, no drift, mirror collapses to a static stacked
gallery (`position:static`, clip-path none), marquee becomes a wrapped grid.

## Sections (10)
Hero (photo + reflected wordmark) → statement → THE MIRROR pin → the cabin
(sticky copy + 3 frames) → skylight/aurora band → the place (Geysir) →
gallery marquee → request-to-book (2-night minimum, their own rule) → footer
with reflected wordmark → contacts.

## Honesty
All facts from mirrorlodge.com's own EN pages (25 m², 2 guests, glass walls +
skylight, electric blinds, hot tub, aurora window end-Aug to early-Apr,
min 2 nights, lower rate 3+, licence HG-00016971). No prices — they publish
none. No invented eruption times. Mirror-pin layers carry no season labels
because the photos' capture seasons are unverified.
