# ÍSBAND: "Breyttur bíll, óbreytt ábyrgð"

A transplant of the Bílabúð Benna design (`../benni/DESIGN.md`), re-aimed at ÍSBAND after
Benni declined on 2026-10-01. Per the reuse rule, the system is kept as it is:
- the same motion (Spyker numbers);
- the same Drivehub layout;
- the same section order;
- the same chat wiring.

ÍSBAND's own brand, photos and facts replace Benni's.

## What changed from Benni

| Benni | ÍSBAND |
|---|---|
| Yellow #FEE101, ink text on yellow | Red. The logo keeps the sampled #EC1840. Surfaces carrying white text use #E0123D (4.9:1 against white), because #EC1840 measures only 4.4:1. |
| Logo traced from their PNG | Logo traced with potrace from `isband_logo_300x85_2.jpg`, the only file they publish. It needs ÍSBAND's real vector before go-live. A white variant is used on dark plates. |
| Hero copy on the right, car on the left | Hero copy on the left, because the RAM 2500 stands on the right |
| KGM \| Porsche split | Jeep og RAM (their three converted Wranglers) \| Leapmotor (C10). Headline: "Á fjöll eða í bæinn." |
| Yellow statement: "Þetta byrjaði í grænum skúr" (1975) | Red statement: "Breyttur bíll. Óbreytt ábyrgð." This is the one thing only ÍSBAND can say: it is the only dealer that does its own conversions, so converted Jeep and RAM keep the factory warranty. Three package links sit under it. |
| Heritage: "Hálf öld í bílum" | Heritage: "Síðan 1998": Októ Þorgrímsson, Fiat Chrysler in 2016, Leapmotor in 2025 |
| Ten models, 4:3 lifestyle photos | Their own front page's 13 lines. Leapmotor uses the maker's cut-outs on white, one studio family with the floor shadow feathered at the canvas edge. Jeep, RAM and Fiat use lifestyle photos, ÍSBAND's own Icelandic shoots where they exist. |
| Single-column cards on mobile | Two columns under 640px, so 13 cars are not 5,600px of scroll |
| Used: notadir.benni.is | Used: 8 cars from the 100 bílar front page. 100 bílar is the sister company at Stekkjarbakki 4. The photos carry 100 bílar's own watermark. |
| Porsche 24/7 emergency number | Neyðarþjónusta 620 2391: weekdays 17–22, weekends and public holidays 10–20 |
| Lykill used-car loan line | Lykill Leapmotor loan line under the grid: T03 from 39.311 kr./month |

Class prefix `bn` became `ib`, so the two routes can never share styles. The fonts are copied to
`public/fonts/isband/`.

## Contradictions on their own sites (read 01.10.2026), and what the page uses

1. **Parts-shop hours.** The Þjónusta, Varahlutir and Hafa samband pages say 07:45. The
   sitewide footer says 08:00. The page uses 07:45, which three pages agree on.
2. **Parts-shop phone.** The footer and Hafa samband say 590 2332. The Varahlutir page says
   590 2323. The page uses 590 2332.
3. **100 bílar Saturdays.** isband.is says 11–14. 100bilar.is (Um okkur) says 12–14 and
   "Lokað á laugardögum á sumrin og í desember". The page uses 100 bílar's own page and shows
   the note.
4. **100 bílar address.** The Um okkur text says Stekkjarbakka 5, from its 2016 move story.
   The footer and staff block say Stekkjarbakka 4. The page uses 4.
5. **Leapmotor C10.** The product page says 600 hö, 81,9 kWh and 437 km. The Oct 2025 news
   says 598 hö. The page uses the product page.
6. **Leapmotor B05 Design.** The product page says 481 km and 67,6 kWh. The Aug 2026 news
   says 482 km and 67,1 kWh. The page uses the product page.
7. **Jeep Avenger.** The product title says "Mild Hybrid", but its spec table lists the
   energy source as "Plug-In Hybrid". The card says mild hybrid and names no plug.
8. **Wrangler Rubicon diff locks.** The product page says E-Loc®. The model page says
   Tru-Lok®. The card says "Driflæsingar að framan og aftan" and names no brand.

## Findings for the pitch (all seen on isband.is itself)

- The live site loads its header logo from `test.isband.is`, a staging host.
- The front page is a grid of 1600×505 banner PNGs with text and prices baked in. The HTML
  titles and prices are typed over them, so the two collide; "Leapmotor B03X" overlaps on both
  desktop and phone.
- The "Bæklingur 2026" header is part of the image, so it shrinks to illegible on a phone.
- The cookie bar offers only "Samþykkja", with no way to decline.
- The footer says © 2024. "Opnunartímar jól 2024" popup markup is still in every page.
- Contradictions 1–3 above (hours and phone numbers).

## Verification (2026-10-01)

- tsc and eslint are clean, and `tools/mobile-gate.mjs isband` passes.
- `npm run build` succeeds, and the route-favicons stamp lists 244 client pages with their own
  icons.
- In-app browser at 1440 and 375, top to bottom.
- Filters, and the category-to-filter jump with the clear pill.
- Chat routing against about 35 questions in Icelandic and English.
- The pane throttled rAF to about 2 fps, so the motion timing was not judged there. The code
  is Benni's, unchanged.

**Not done yet:**
- a native iOS Safari pass;
- a Codex audit;
- a deploy.
