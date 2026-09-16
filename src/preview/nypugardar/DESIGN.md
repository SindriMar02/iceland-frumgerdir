# DESIGN.md: Nýpugarðar landing (Kleif v1 patterns, 2026-09-16)

**Design read:** redesign (visual overhaul, content/IA/SEO/booking preserved) of a small
family guesthouse's landing page, for international Ring Road travellers planning a
night between Höfn and Jökulsárlón. Calm, image-led, glacier-plain language, built on
the Kleif v1 (White Desert engine) devices ported into React + GSAP ScrollTrigger.
Dials: VARIANCE 6 · MOTION 7 · DENSITY 3.

**The one-sentence concept (owner-tellable):** *You arrive on the view. The mist rises
off Mýrar, the page goes quiet, and the evening comes in with dinner.*

**Style-bleed guard.** Eyvindarholt (`03-prototypes/eyvindarholt/`) is the other Kleif
v1 transplant. Nothing shared with it or with Kleif beyond engine mechanics: NOT Khand,
Zodiak or Supreme; NOT graphite on white, fell green or brick; no condensed uppercase
monument, no grid overlay, no crosshair cursor, no card-flick, no rail.

## 1. Tokens (from her own photographs)

| role | value | source / use |
|---|---|---|
| night (ground) | **#15130F** | the dusk plate and the lit dining room; every section from the rooms down, html/body (iOS strip tint) |
| mist | **#E9EAE5** | the fog lying over the Mýrar flats in the hero frame; the ONE light ground (manifesto), what the fog plates dissolve into |
| ink | **#15130F** | text on mist (17:1) |
| silt | **#57554E** | secondary text on mist (6.3:1) |
| paper | **#F4EEE2** | text on night (15:1); body at .76 |
| ember | **#D97D3D** | low sun on the rust grass. ONE accent: primary CTA fill (night text on it 5.7:1), route line, figures on night. Never text on mist |
| ember-ink | **#9A4A1C** | the same ember, darkened, for the rare accent text on mist (5.2:1) |
| ice | **#B9CBD6** | glacier ice; data labels on night (9.7:1) |
| hair | rgba(244,238,226,.14) on night · rgba(21,19,15,.14) on mist |

Theme lock: one deliberate switch. Hero photo, then mist (manifesto), then the glacier
band photograph whose scrim resolves to night, then night to the end. The switch is carried
by the photograph, never by a flat colour cut.

Shape lock: square (radius ≤2px) everywhere, as the rooms page and booking bar already are.

## 2. Type (three faces, three jobs)

| role | face | spec |
|---|---|---|
| display + wordmark | **Erode** Light 300 / Regular 400 / Light Italic | wordmark `min(19rem, (100vw − 2·gutter) / 4.75)`, tracking −.01em, sentence case (Icelandic diacritics read in lowercase). h2 clamp(2.25rem, 5vw, 4rem)/1.08. Kickers Light Italic 1.25–1.5rem |
| body + UI | **Familjen Grotesk** 400/500/600 | 1rem–1.125rem / 1.6, 60ch |
| data | **Fragment Mono** 400 | 11–12px uppercase .16em: distances, times, counts only. Never as an eyebrow above a heading |

Measured: "Nýpugarðar" = 4.623em in Erode Light (fontTools). All three faces carry the
full Icelandic set (Á Ð É Í Ó Ú Ý Þ Æ Ö, checked).

## 3. Page anatomy

0. **Hero, 200svh** (Kleif hero): her largest frame (125645004, low sun, outlet glaciers on
   the horizon) + the existing hero film on wide fine pointers. Italic kicker top-left
   "A quiet guesthouse between Höfn and Jökulsárlón". **Nýpugarðar** centred across the
   bottom. Both inside one `h1`. Three alpha fog plates (far −10%, veil −42% at .5, near
   −80%), wrapper y +100svh, content drift −60svh, content blur 0→10px (fine pointers
   only), photo fades to mist.
   **Intro** (arrival): photo settles 1.06→1 over 2.2s; wordmark letters rise out of a
   mask, 1.4s cubic-bezier(.16,1,.3,1), 45ms stagger; kicker and nav fade in after.
   Skipped under reduced motion or when the page loads scrolled.
1. **Manifesto** (mist): italic kicker "Only the sounds of nature" + the text, Erode
   Light 2.625rem, first-line indent, mask-develop scrubbed with scroll (Kleif).
   Below: three data rows (rooms, cottages, check-in) and the booking card.
2. **Glacier band** (Kleif season, inset unclip): 125645011 in a 150svh band, clip
   1.25rem → 0 on desktop, scrim to night at the foot. Heading + body + three data items.
3. **Rooms** (night): heading, body, the existing RoomStrip (Godo prices, leadFor photos),
   link to the rooms page.
4. **Dinner and breakfast** (night): dining room frame unclipping, dinner text, the winter
   deck frame (the dining room's own windows), breakfast block with diets.
5. **Guests** (night): 8.8 + all seven Booking categories + QuoteRotator.
6. **Getting here** (night, Kleif journey): Route 1 drawn in ember between Jökulsárlón
   (west) and Höfn (east), the 4 km spur up to the farm. Distances, phone, email,
   address, facilities.
7. **Closing** (dusk frame) + honesty note + footer.

Fixed furniture: constant top bar (wordmark · anchors · language · Check availability),
ground swapped by the section under it (clear over the hero with its own scrim, mist glass
over mist, night glass elsewhere). Mobile: menu overlay + bottom CTA as before.

## 4. Motion table

| device | spec | why |
|---|---|---|
| intro | letters y 105%→0, 1.4s (.16,1,.3,1), 45ms stagger, 250ms lead; photo scale 1.06→1 2.2s; kicker/nav opacity .9s after 900ms | arrival |
| hero wrapper | y 0→+100svh, trigger hero top top → bottom top | the view holds while the mist rises |
| fog plates | y 100%→ −10/−42/−80%, same trigger; CSS drift 83/61/47s on the img | depth, mist lifting off the flats |
| content drift | y 0→−60svh | wordmark leaves before the mist closes |
| content blur | 0→10px, fine pointers only | focus pulls to the page |
| photo fade | opacity 0→1 mist overlay, top −8% → −52% | fog becomes the ground |
| manifesto | --mask-position −40→100, top 80% → bottom 60% | reading pace |
| band unclip | inset(0 1.25rem round 2px) → 0, top 80% → top 30%, ≥769px | the view widens |
| route | stroke draw, top 75% → top 35%; farm dot pops at 70% | the road to the farm |
| scrub | `true` on fine pointers, .35 on touch; `ignoreMobileResize` | iOS momentum |
| reveals | existing Reveal / MaskHeading / ClipImg (IO, resting state in markup) | |
| reduced motion | everything static, fog plates hidden, full mist-free render | |

## 5. Guards

- Prerender: every animated element renders at rest in the server HTML; arming happens in
  layout effects / GSAP after mount. No timed state baked.
- One writer per element (GSAP on wrappers, CSS drift on inner img, React on letters).
- Lenis stays fine-pointer only and feeds `ScrollTrigger.update`.
- No pins. No `window` scroll listeners.
- Anchors keep `scroll-mt`. Bottom CTA and menu unchanged.
