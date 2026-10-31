# Brimborg: "Polestar 5 er kominn"

A transplant of `../isband/` (itself the Bílabúð Benna system, then Íslyft). Same components, section order, classes, geometry, breakpoints and animation numbers; Brimborg's teal, logo, photographs and facts replace ÍSBAND's, and one new chapter (the Polestar 5) sits straight under the hero. Class prefix `bb`, fonts `BbF`, assets `public/brimborg/`. Dev: `brimborg-dev` on :5285. Route `/preview/brimborg`. Not deployed, not committed.

## What changed from ÍSBAND

| ÍSBAND | Brimborg |
|---|---|
| Red #E0123D surfaces, white text | Teal #00B6AD sampled from Brimborg's own mark. Teal is only 2.5:1 against white, so every teal surface carries INK text (about 8:1), the way Benni's yellow did. Hover shade #009F96. |
| Logo traced from a wordmark | Brimborg's mark (teal crescent with its dot, lettering) with NO background: the #231F20 badge was only the ground the white lettering sat on. Traced with potrace from the 267 px OG image (the sharpest file they publish; `_docs/brimborg-build-2026-10-31/trace-logo.py`): ink lettering for light grounds, white for dark. **Needs their real vector before go-live.** |
| RAM hero | Polestar 5 hero, Polestar's own press image, mirrored in the file so the car sits right and the copy sits on open road. Headline "Polestar 5 er kominn.", the price rolling in under it. |
| (none) | **Polestar 5 chapter** (`#polestar5`, dark): price as giant rolling digits, tags, a wide frame that pans, lease and three figures that count up, a five-picture gallery rail, and the Polestar Reykjavík showroom with a card (address, hours with today marked, open/closed state, phone, test-drive CTA that preselects the car). |
| Six type cards | Rafbílar, Jeppar, Sjö manna bílar, Sendibílar, Pallbílar, Notaðir bílar (Brimborg's own category names). Same rail. |
| Jeep og RAM \| Leapmotor split | Rafmagn \| Tengiltvinn: Polestar 4 on the coast (mirrored so the car is in the left half) against a Mazda CX-60 PHEV extended with its own mirrored scenery so the car sits in the right half. Brimborg's own nav has exactly these two categories. |
| 13 new-car lines | 12 model cards from the stock listings on nyirbilar.brimborg.is: price or offer, note, range, link to that car. One studio family: each cut-out levelled to a white ground, trimmed and re-placed on one 4:3 canvas, the "brimborg" badge painted out. |
| Loan strip | Lease strip: Polestar 5 from 791.640 kr. a month, 36 months. |
| 100 bílar used cars | Eight cars from notadir.brimborg.is. Photos keep Brimborg's own badge and plates. |
| Conversion workshop | Verkstæði Brimborgar: seven brands, Noona booking, hours, the emergency line. Pictures are stock cars from the used listing: Brimborg publishes no workshop photography. |
| "Breyttur bíll. Óbreytt ábyrgð." | "Rafbíllinn og hleðslan.": Bílorka fast-charging, charging stations for sale, the 400.000 kr. Orkusjóður grant. |
| Heritage 1998 | "Síðan 1964": founded as a specialist workshop, 60 years in 2024. Five float captions are literal (car names), not dated claims. |
| Four departments | Bíldshöfða 6, Bíldshöfða 8, workshop and parts, Akureyri, plus the emergency line. |
| Chat | Same widget, greeting and chips; **every question gets "Þú þarft að kaupa vefsíðuna af Sindra fyrir svarið."** No network, no facts. |
| Loader: logo mask + slogan | A light bar ignites across a black screen with the mark above it and one line below; when the fonts are ready and the hero picture is decoded the light flares and the screen parts along it like a shutter, spilling teal light, onto the hero. No counter, no progress bar. Replays with `?intro`. |

## Contradictions and limits (read 31.10.2026)

1. **Polestar 5 range.** The stock listing says "allt að 558 km" for this car; polestar.com says up to 678 km for the Dual motor. The page shows 558 km, labelled as the car in stock, and does not use 678.
2. **Polestar 5 price.** The live listing says 21.990.000 kr.; an older Brimborg page showed 21.690.000 kr. The page uses the live one. Recheck before anything is sent.
3. **polestar.com shows no ISK price** for the Polestar 5. The only public price is Brimborg's own stock listing.
4. **Showroom photo** shows a Polestar 2, not a 5. The caption names the space, not the car.
5. **Brimborg already has a chatbot, "Góa"**, on its site. The pitch cannot claim "no assistant".
6. **Hours.** Sales Mon 10–17, Tue–Thu 9–17, Fri 9–16:15; workshop and parts 7:45–17:00 Mon–Thu, 7:45–16:15 Fri; Akureyri sales Mon 9–17, Tue–Thu 8–17, Fri 8–16:15; all closed at weekends. The Akureyri row uses the main number 515 7000: no Akureyri number was read.
7. **Workshop pictures are not workshop pictures** (see table). The captions state facts only and do not describe the photo.
8. Stock photos are 716–1920 px wide, so a few cut-outs are soft on 2× screens. Used-car photos keep the Brimborg badge and number plates.
9. The traced logo is an approximation of a 190 px PNG.
10. The weekly Polestar 4 "Frá 9.790.000 kr." is the lowest of six stock listings, delivery January 2027.

## Sources

`_docs/brimborg-build-2026-10-31/`: `harvest/` (raw listing HTML, parsed `stock-all.json` and `used.json`, hours/workshop/about text, logo and press images), `build-assets.py` (harvest to `public/brimborg/*.webp`), `ACCEPTANCE.md`. Live sources: brimborg.is, nyirbilar.brimborg.is, notadir.brimborg.is, polestar.com/is-is/polestar-5 and /spaces/reykjavik-bildsofhoi.
