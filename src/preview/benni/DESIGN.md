# Bílabúð Benna: "Úr grænum skúr"

Route `/preview/benni`. Built 2026-09-29. Facts: `_docs/benni-harvest-2026-09-29/FACTS.md`
(a source URL and a quote for every line). Teardown: `_reference/spyker-teardown/TEARDOWN.md`.

## Story first

- **What makes them unique.** In 1975 Benedikt Eyjólfsson started repairing motorcycles in a
  green shed at Vagnhöfði 23. He won the Icelandic off-road championship three years running,
  and the company pioneered jeep modifications. In 1991 it put a car on the top of
  Hvannadalshnjúkur, and in 1996 it built the Xtremer. It has worked with Porsche since 2000.
  Today it holds the Porsche and KGM dealerships in one building at Krókháls 9.
  Their own line: *Sérfræðingar í bílum síðan 1975.*
- **Emotion.** The confidence of buying from specialists, and the car enthusiast's thrill,
  without dealership noise.
- **Memorable.** Two opposite makes under one roof. The luxury of Porsche and the ruggedness
  of KGM, joined by a single divider.
- **Audience.** Icelandic buyers of new and used cars: families after a jeep, Porsche
  enthusiasts, pickup owners, and service customers.
- **Primary conversion.** Test drive, or a call to the showroom (590 2000). Secondary:
  browsing the used-car list, service requests, and the assistant.
- **What their site does today.** benni.is is a hub of links. Cars, prices, used cars and
  booking live on four other sites with four different looks. The only contact route is a
  `mailto:` link, and the service address in it has a typo.

## References and what each gives

- **Pinterest "Drivehub" (layout).**
  - Contact bar above a dark car hero.
  - Header with logo left, links in the centre and a white pill CTA.
  - Hero headline left-aligned, with two buttons.
  - "Browse by vehicle type" rail with arrows and peeking cards.
  - Centred "Featured vehicles" grid.
- **spykercars.com (behaviour, scroll and feel).** Numbers are lifted from its bundle:

| # | Device | Spyker value | Here |
|---|---|---|---|
| D1 | Lenis | lerp .125, anchors | same, fine pointer only (`isTouch()` guard) |
| D2 | Preloader: logo clip reveal | inset(0 50% 0 50%) → 0, .7 | same, then the panel lifts yPercent -100 over .8s; once per session |
| D3 | Hero: media drift 2×8%, frame 1 → .8 from "40% top" | scrub .15 | same |
| D4 | Titles: masked characters, yPercent 100 → 0 | .8, stagger .018 | same, masks padded .18em so Á Í Ú are not clipped |
| D5 | Body: lines fade | .8, line stagger .05 | same |
| D6 | Media: clip from the centre at .6, picture 1.1 → 1 | .9 | inset(20%) → 0 + scale 1.1 → 1 |
| D7 | Items: scale .85 + fade | stagger .08 | same (hours rows, department cards) |
| D8 | Inner parallax | layer ±10%, 8% drift | same |
| D9 | Collage drift per ratio (px) | 56/-96, -28/44, 24/-52, -20/64, 32/-40 | same table, on the service collage |
| D10 | Statement band | inset(10%) → 0 over 40% vh, back over last 60% of height, quickTo .15 | same, Roman numeral eyebrow (MCMLXXV) |
| D11 | Heritage float | y .45s → -s, scrub .55; text .35m → -m, m 72/28 | same |
| D12 | Buttons | clip inset(0 50% 0 50%) → 0 .7; label chars roll .32 | same; 6ms char stagger |
| D13 | Header colour at the exact section edge | logo layers clipped with inset(Npx 0 0 0) | two header layers (light base, dark top); the dark one is clipped to exactly the dark band under it |
| D14 | Menu | panel yPercent -100 → 0 .8, links y12 stagger .07 | same |

**Declared deviations**
1. **Reveals follow scroll position, not a timer.** They are tied to a short scroll band
   (`scrub: true`), per the hard rule `scroll-reveals-must-be-position-tied`. Spyker plays
   them once on a timer. The curve, durations and staggers are unchanged; only what drives
   them differs. The hero intro is still timed, because it is the page opening, not a
   scroll event.
2. **Buttons are 46px tall, not 36px**, for touch targets.
3. **The header carries links and a CTA, where Spyker has only a logo and icons**, because a
   dealer needs navigation.
4. **The header plates turn solid after 60px** so the links stay readable over photography.
5. **No video.** Benni has no film; the statement band holds the 1975 workshop photo from
   their Saga page.

## Signature interaction and the wow moments

**Tvö umboð. Eitt hús.** A full-screen split: KGM on the left (a Rexton on a Reykjavík
street), Porsche on the right (a Macan, press image; the earlier showroom photo was dropped
because it showed a KGM sign). A yellow divider follows the cursor on desktop with easing,
drags on touch (plus KGM/Porsche tabs), and is a keyboard `role="slider"` (arrows, Home,
End). On first sight it sweeps 18% → 50%. Each side has only its name, the model line-up
and one link; the price lists were removed after Sindri's "too generic, could be cleaner".

**The yellow band.** Spyker's black statement block, recoloured in Benni's own logo yellow:
MCMLXXV, "Þetta byrjaði í grænum skúr", the 1975 workshop photo. The one moment that
could only belong to Benni.

## Visual system (revised after Sindri's review, 2026-09-29)

"Wayy too generic", "everything can look and feel cleaner", "font is a bit condensed":
- **Type:** one family, **Host Grotesk** (400/500/600, full Icelandic), sentence case,
  tracking -.04em on display, the Drivehub feel. New Title (compressed caps) is gone.
  h1 46–84px, h2 38–64px, statement up to 136px, body 16/1.6.
- **Colour:** ink #0C0C0B, white, stone #F3F2EE, line #E6E5E0, mute #62625C, yellow
  #FEE101 (logo). Yellow is used for the statement band, the Porsche emergency tile, the
  divider, the "open" chip, the sticky CTA and hover states.
- **Less:** no chips or pills in car cards, text tabs with an underline instead of pill
  filters, one-line captions, rows instead of cards for hours, no year grid, no chat icon
  in the header, the hero is one photo with one line of copy.
- **Hero:** the Cayenne slider export had a black gradient baked into its lower half and
  read as a broken image; replaced by the KGM Musso Grand press image at full resolution
  (5824px original), copy on the right over the mountain. On phones the photo takes the top
  two thirds and the copy sits on solid dark. The Cayenne image is kept in the grid, cropped
  above the gradient.
- **Logo:** their 500px PNG traced with potrace into two layers, `public/benni/logo.svg`.

## The assistant

This is our `<sndr-chat>` widget. A new `answerer` hook was added in
`04-platform/vaktin-receptionist/widget/sndr-chat.js`, copied to `vendor/`.

- **Where answers come from.** `chat.ts` matches the question against the SAME data module
  the page renders from. Icelandic diacritics are folded, and English questions get English
  answers.
- **Scope.** It covers hours with live open status, addresses, phone numbers, every model
  with its price, electric cars, cheapest models, test drives, used cars, the Lykill loan
  offer, service, parts, Nesdekk, the KGM warranty, modification packages, the Porsche
  emergency line and the story.
- **Refusals.** It refuses trade-in valuations, stock and delivery questions, and anything
  else not on the page, using the designed refusal with the phone number.
- **What it cannot do.** It has no model and no network, so it cannot invent and cannot be
  billed.
- **Tool chip.** The chip shows only where a lookup ran: the price list, or the clock for
  opening hours.
- **Look.** It is themed in Benni's colours. On phones the launcher is hidden and the sticky
  bar's "Spyrja" opens it.

## Choices where their sources disagree

- **Used-car email.** `notadir-bilar@benni.is` (benni.is) is used, not `notadir@benni.is`
  (the used-car site).
- **Service email.** `thjonusta@benni.is` (footer) is used, not the misspelt `vmmottaka@`.
- **Torres EVX prices.** The model page's 5.890.000 / 6.290.000 / 6.690.000 are used, not
  the pre-order form's figures. The note quotes "verð byggt á gengi í nóvember 2024".
- **Cayenne Electric.** Porsche's own page says "Verð: 16.950.000 kr." with no "frá", and
  that is printed.
- **KGM rename year and SsangYong start year.** The sources give different years, so no
  year is printed ("Áður SsangYong").
- **Porsche partnership.** Printed as "síðan 2000". Their "25 ár" was written in 2025.
- **Nesdekk.** Presented as their own site presents it: a separate booking, nine locations.
  No ownership claim.
- **Used-car snapshot.** The Torres EVX listing (10/2025 with 90.000 km) was left out.
  Cayenne E-Hybrid is labelled "Tengiltvinn" instead of the listed "Bensín".
- **Not printed at all:** staff portraits (no consent), the Porsche workshop press photo as
  "their" workshop (captioned generically), Sixt, the employee count, and the co-founder.

## Audits

- **Codex (gpt-6-astra, high, standard), code + facts, 2026-09-29:** verdict "block".
  Accepted and fixed: model-first chat routing (Porsche warranty now refuses, service and
  parts questions about a model go to service/parts, battery warranty no longer answers
  range), the chat no longer promises contact from the demo form, the form says it is not
  connected before entry, ScrollTrigger refresh after a filter change, menu makes the page
  inert and restores focus, split `aria-hidden` condition corrected, hours labelled as
  ordinary weekly hours. Declined: rewording "Með góðu viðhaldi má halda verðgildi
  bifreiðar betur um ókomin ár." (Benni's own sentence, grammatical, kept verbatim).
  Noted: service opens 07:45 on benni.is and 07:50 on Porsche's page; benni.is is used.
- **Codex iOS Simulator audit (iPhone 17 Pro, Safari):** see the build log.
