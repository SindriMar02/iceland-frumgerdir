# Design System: BYGG (Realevate design, re-aimed)

Routes `/preview/bygg` (Icelandic) and `/preview/bygg/en`. A multi-page site, like the reference: home, four collections
(Ásvellir 3–19, Bolholt 7–9, Fossvogsvegur 8–36, Asparlaut 1–5), About, Contact, Mín íbúð, Sales overview, 404.

## 0. Rule of precedence
Reference data outranks the design skills (memory `feedback-reference-data-outranks-design-skills`). This build is a 1:1
transplant of the Realevate clean-room rebuild (sndr-teardowns PR #1), so the devices below stay even where the taste
skills would ban them. Conflicts, decided in the reference's favour: centred home hero (variance rule), custom cursor
(drag ring and scroll-continue ring), pill "Næst" label, `Roslindale`-role serif on a light ground, "(Skrunaðu)" hint text.
What the skills changed: contrast fixes, real focus rings, one h1 per page, 44px targets, sentence-case Icelandic headings.

## 1. Visual Theme & Atmosphere
A printed spread that scales perfectly: every size is `vw × scale`, one 12-column grid, almost nothing fades. Text arrives as
masked lines, pictures open from their centre, pages slide over each other, the "Til sölu" picker shrinks the page under four
project cards, and at the bottom of a project you push into the next one. Density 4, variance 6, motion 8 (all set by the
reference). Idea in one sentence: **the buyer stays in one continuous surface from first render to enquiry, and BYGG keeps the
record** (the enquiry ledger and the sales overview are the 10% that is BYGG's).

## 2. Colour Palette & Roles
From bygg.is/css/bygg.css and the cladding in BYGG's own renders. One accent (the logo green), used only where the reference
uses white on colour.
- **BYGG Deep Teal** `#244244` home, About, Contact, drawer, form underlines, picker "Forsíða" tile ink (from their CSS)
- **Teal Mist** `#617778` muted copy on white (4.75:1, navy mixed toward white)
- **Logo Green** `#5AC1A6` the G in the logo; the overview's second bar and the "✦" of the credit only (2.2:1 on white, never text there)
- **Ásvellir Moss** `#33493D` / `#66776E` project 1 ground and muted (moss cladding)
- **Bolholt Bronze** `#4A4038` / `#79726C` project 2 (timber and graphite)
- **Fossvogur Slate** `#2D3F4B` / `#68757D` project 3 (the sky over the white terraced houses)
- **Asparlaut Rust** `#6B3A2E` / `#906B62` project 4 (the rust panels)
- **Picker Mist** `#E1E8E6`, **Transition Mist** `#DDE5E3`, **Thank-you Mint** `#BFE6DB`, **Alert** `#8B2E2E` (funnel stall, from the reference's error red)
White text on every project ground is ≥ 9:1.

## 3. Typography Rules (roles of the reference's three families)
- **Sans, everything: Albert Sans 400/500** (role of Google Sans 500). Line box kept at the reference's 105%/35% ascent/descent.
- **Editorial serif: Hedvig Letters Serif Regular** (role of Roslindale Display 300): gallery titles, quotes, CTA, drawer links, board titles.
- **Extended caps: Zalando Sans Expanded** (role of Monument Extended): the price chip and the sample tags.
- Credit wordmark: Projekt Blackbird (SNDR), letters S N D R only.
- All four files checked for Þ Ð Æ Ö and every acute (fontTools cmap): none missing. Self-hosted in `public/fonts/bygg/`.
- Scale unchanged from the reference (16 / 5.2 / 3.646 / 1.5 / 1.736 / 1.447 / 1.2vw). Fixed for Icelandic: no title-casing of
  headings, vertical picker names fitted to the panel by measured advance width, `text-wrap: balance` left off (masked lines).
- The BYGG logo is a stacked lockup, so the masthead uses its cropped wordmark at 7vw (the reference's wordmark is 14:1 at 20vw).

## 4. Component Stylings (reference, unchanged unless stated)
- **Dock:** outline "Til sölu" + filled burger; white-on-colour before the hero has grown, colour-on-white after.
- **Price chip:** four hairlines that draw in, Zalando caps. BYGG: "Frá 65,9 m.kr." plus a one-line source note. Never a BYGG price.
- **Picker tiles:** colour panel, house mark, vertical name, cover picture; hover glow.
- **Drawer:** clipped to the burger, rolling letters on links; BYGG adds phone, language switch, prototype note and credit.
- **Ledger (BYGG):** hairline rows, size numeral in the h3 scale, published price, sample availability bar tagged "Dæmi", underline link.
- **Sales overview (BYGG):** hairline blocks; demand bars, five-step funnel, seller table; every block carries "Dæmigögn".
- **Forms:** underline-only fields, two tabs, dial-code list with Iceland first, local-only submit; the thank-you card names where the enquiry would go.

## 5. Layout Principles
12 columns (8 tablet, 4 phone), padding 4.5vw, gap 2.601vw, all × scale (1 / 1.54 / 2.25, times min(1, 100svh/950)).
Home is one 100svh screen with no document scroll; project pages are stage, gallery, outro, break, ledger, facts, break, CTA, next.
`100svh` everywhere, never `100vh`. The engine never uses Lenis; touch keeps native scroll.

## 6. Motion & Interaction
Ported value for value (TEARDOWN modules 1, 5, 6, 8, 9, 10, 11, 12, 13, 14): heavy custom scroller on fine pointers only (lerp 0.042),
cold-load preloader (clip frames, odometer, wipe that becomes the hero), page intro on every arrival, picker with swap transition,
transitions A/B/C with the next-project image flying into the next hero, scroll-past-the-bottom ring, hero photo growing 20vw to
full bleed, −8° scroll-coupled slider, parallax breaks, scroll-expanding About card. Fixes: ScrollTrigger reads the window after the
scroll write (no proxy, so nothing outlives the route); iOS URL-bar resize ignored; reduced motion is a plain render branch.

## 7. Anti-Patterns (Banned)
No BYGG price (only sellers' asking prices, dated and labelled); no sample number without "Dæmi/Dæmigögn"; no testimonial, award or
figure BYGG has not published; no supplier, architect or competitor names in copy (sales agencies appear only as BYGG lists them);
no generated footage; no HMS rule or amount (link out); no guessed email; no dashes in copy; no "we".
