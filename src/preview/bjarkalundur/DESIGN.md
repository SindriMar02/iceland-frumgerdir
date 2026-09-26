# Design System: Hótel Bjarkalundur (v4, the Edelhaus board × the MRC scroll)

Locked 2026-09-26, replacing v3 ("Bandið"), which Sindri called a fall back into AI
templates. Sources: `_docs/BJARKALUNDUR-FACTS-2026-09-26.md` (every fact),
`_docs/bjarkalundur-harvest-2026-09-26/` (41 owner-uploaded Booking.com photos),
`_docs/teardowns/mrc-residences-2026-09-26/TEARDOWN.md` (the scroll), the Pinterest
"Edelhaus" alpine hotel board Sindri sent (the page order and type), and the studio's own
Fagravík stacked sheets (`memory: stacked-sheet-design-system`).

## 1. The one idea

**The house stands still and the page slides over it.** The film of the long white house
with its red band holds the first screen and never scrolls away; a rounded light grey sheet
rises over it and carries everything else. Full-bleed photographs of the lake and the valley
come back between the chapters, each one lagging its frame so the land feels deeper than
the page. The red of the house's band returns once, as a whole colour band for the people
who reopened it.

## 2. Atmosphere

Sleek, quiet, image-led. Variance 6, Motion 7, Density 4. Short sections: a headline, one
or two sentences, one action. The motion is weight, not spectacle: a heavy, slow wheel, lines
rising out of their masks, photographs settling into their frames. Nothing is pinned by
script; the sheet slides because the hero is `position: sticky`.

## 3. Colour

- **Ground** `#ECEBE8`: the sheet, cool light grey (Edelhaus), no warm cast.
- **Paper** `#F5F4F1`: cards, the history band, the notes on /gisting.
- **Ink** `#1C1D1A`: headings and primary text. **Text** `#3A3B37` body, **Mute** `#62645E`
  captions (4.9:1 on ground).
- **Band** `#5A1F18`: the red under the roof of the house, photographed (`v2/facade-sign`).
  Primary buttons, the owners band, the menu panel, focus rings, theme colour.
- **Dark** `#232421`: the footer and the iOS edge tint (`html:has(.bj3)`).
- On dark and on photographs: `#F5F4F1`, secondary at 78–90%.

## 4. Type

- **Display:** Nyght Serif Light / Light Italic (`public/fonts/nyght-serif`). Headings are
  two lines, roman over italic, the second line indented (`.stagger`) or centred. h2
  `clamp(2.5rem, 5.3vw, 5rem)`, line-height 1.02, tracking −0.015em. Hero name
  `clamp(3.1rem, 15.6vw, 11.5rem)`, one line, never wraps.
- **Body:** Finlandica Text variable, 1.02rem, line-height 1.65, 52ch max.
- **Eyebrow:** 0.72rem, 0.24em tracking, between two small diamonds. Used on five
  sections, not all: intro, stay, owners, food, and never on the reviews or history.
- Title syntax in `data.ts`: `Line one|*italic line*`.

## 5. Components

- **Pill** (999px): solid band, ink outline, light outline on photographs. `:active` 0.97.
- **Round link**: 54px circle arrow + label (Edelhaus). Fills on hover.
- **Text link**: 1px underline that shrinks away on hover (MRC).
- **Framed card**: paper, 14px radius, 12px inset photo, used once over the lake.
- **Accordion**: rows with a serif head and a plus that turns to a cross; the panel opens
  `grid-template-rows: 0fr → 1fr` (.6s), content fades up .12s later; closed panels are
  `inert`. Used for history years, practical info, and every room on /gisting.
- **Expanding strip**: four photo panels, each one room type with a photo the owner filed under
  it, linking to that room on /gisting; the active one grows to 3.4× (hover or focus);
  collapsed labels run vertically. Phones: a snap carousel at 76% width. "Öll herbergin" and
  "Bóka gistingu" sit under it, so the booking path never needs a trip back up.
- **Drift**: the 21st.dev Infinite Testimonials Scroller ported to CSS, three columns,
  pausable, off under reduced motion. Quotes sit between hairline rules, not in identical
  cards; short ones are set in the serif.
- **Header**: transparent over the hero, hides on the way down, returns solid on the way
  up (MRC). The centred name is hidden over the home film (the film has the big one).
- **Menu**: band red panel from the right, serif links rising in a stagger, focus trap,
  Esc, returns focus to the burger.
- **Footer**: dark, the name centred and large, three columns.

## 6. Layout

Home, in the board's order: film hero → intro (stagger title | body) → the lake, full
bleed, framed kayak card → rooms (icons + expanding strip) → cottages (text | large photo)
→ owners (MRC split band, 43.5% photo panel on band red) → food (one spread: the dining room
photograph leads, the Skip Jones quote and three short cards beside it) →
reviews drift → history (sticky archival photo | year accordion) → practical (accordion |
map) → the valley, full bleed, booking at the bottom (house rule) → footer.

/gisting and /umsagnir open on a still photograph hero (80svh) with the same sheet.
Max width 1360px, gutter `clamp(20px, 4.6vw, 72px)`, section rhythm
`clamp(96px, 12vw, 176px)`. Everything collapses to one column below 900px.

## 7. Motion

- **Scroll:** Lenis `lerp .1, wheelMultiplier .5` (MRC's weighted wheel), fine pointers
  only. Phones scroll natively (iOS rule).
- **Hero:** media drifts up at 1/13 of the scroll, tint .18 → .62 over 500px, copy gone by
  180px. The film plays only while the first screen can be seen. Name letters rise on load
  (CSS, 42ms stagger), inner-page titles rise on load (CSS).
- **Reveals, all scroll-tied (scrub):** headline lines rise out of their masks
  (92% → 60% of the viewport), copy lifts 34px, groups stagger, framed pictures settle
  1.15 → 1, full-bleed photos run the centred parallax (−7% → 7%), the kayak card rises
  faster than the lake behind it.
- **Pages:** View Transitions. The old page sinks (scale .965, .55s), the new one is
  uncovered from the bottom (clip-path, .95s); the header does not move. Back returns to
  the exact scroll position; `/gisting#room` lands on that room with it open.
- **Reduced motion:** no Lenis, no film (poster), no transforms; everything visible.

## 8. Banned here

Numbers strips, before/after sliders, invented facts, reworded or split reviews, photos
next to a room type the owner did not file them under (Booking `associated_rooms`), em and
en dashes, "við/okkur" in Sindri's voice (the hotel's voice may use "við"), a centred name
in the header over the home film, pinned empty scroll, Lenis on touch.

## 9. Assets

- `public/bjarkalundur/v3/`: `hero-loop.mp4` (1920×1080, 8.5s seamless loop, Kling 3.0 from
  the graded facade photo, clouds only) + 720p, posters; ten 4K Higgsfield upscales exported
  2560 + 1280: lake, valley, kayaks, window, lounge, piano, lomur, cottagebeds, cottage,
  dining.
- `public/bjarkalundur/v2/`: the Booking originals, manifest in the harvest folder.
