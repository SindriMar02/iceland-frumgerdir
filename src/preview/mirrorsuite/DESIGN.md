# The Mirror Suite — „Speglaröðin við sjóinn"

**Design read:** ocean-front mirror suites for couples, West Iceland;
dark shoreline-at-dusk register, characterful grotesk. Dials:
VARIANCE 8 · MOTION 6 · DENSITY 3. English-first (their site is English-only).

## Concept
A row of mirror suites, fifty metres from Hvammsfjörður, each with its own
glass sauna and hot tub, named after the shore's flora. **Signature: THE ROW**
— four glass panels standing side by side like the suites themselves, a
flex-grow accordion that hands over its photograph on hover/focus/tap.
Second device: flora nameplates (Bearberry/Sortulyng · Gleymmerey/Gleym-mér-ei
· Arctic Thyme/Blóðberg) as engraved EN/IS pairs. The reviews card inverts to
bone to surface the 5.0 Google rating their booking page hides.

## Tokens
| | |
|---|---|
| DEEP | `#0F141C` canvas (dark, locked) |
| BONE | `#EEF0EA` text (14.9:1 AAA) |
| GLASS | `#8FBFB0` single accent (8.1:1) |
| Display | Bricolage Grotesque 200/300/500 |
| Text/UI | Switzer 300/400/500 |
| Ease | `cubic-bezier(.24,.9,.26,1)` |

Distinct from the other two builds in the batch: ILL = light/serif/waterline,
ML = light/chrome-grotesk/mirror-wipe, MS = dark/quirk-grotesk/accordion-row.

## Engine
Vanilla: one shared rAF drift loop (read→write, off-screen skipped), IO
reveals, flex-grow accordion (CSS transition on `flex`), CSS sticky copy.
No GSAP, no Lenis. Resting state visible; `.js` arms hidden starts.

## Motion table
| element | motion | trigger |
|---|---|---|
| preloader | wordmark gradient fill by real decode progress + sweeping horizon line, floor 1.1s / cap 2.4s, `ms_seen`, `?loader` | mount |
| hero lines | translateY 112%→0, 1.2s, 130ms stagger | `ms:revealed` |
| hero sub | opacity+y, .9s, .75s delay | `ms:revealed` |
| hero/pano media | drift d=8/12, `--dz` derived | shared rAF |
| THE ROW panels | flex 1→3.2, 1s; caption fades in at .2s; img hover scale 1.04 | hover/focus/click |
| row panels entry | opacity+y 26px, 80ms stagger | IO |
| rise text | translateY 112%→0 in mask, 1s | IO 0.2 |
| facts / amenities / nameplates | opacity + offset, staggered | IO |
| nameplate hover | border → GLASS, .4s | hover |
| CTA | hover bg→GLASS, active press | hover/active |
| burger / sheet | X morph; links stagger 55ms | click |

Reduced motion: no loader, no drift, accordion becomes a vertical stack of
static panels with captions visible, everything rests visible.

## Sections (11)
Hero → statement → THE ROW → the suite (sticky copy + frames) → panorama
band → the names (flora) → reviews (inverted card, 5.0/10 Google) → hosts →
request-to-book → footer horizon → contacts.

## Honesty
Facts from their own site/Lodgify/Google widget, dated in data.ts. Suite
names limited to the three VERIFIED ones; no total-unit count is claimed
anywhere because it is unverified. Panel captions describe only what each
photograph visibly shows (checked frame by frame). No prices. Hosts named
from their own about page. JSON-LD carries the verified 5.0/10 rating.
