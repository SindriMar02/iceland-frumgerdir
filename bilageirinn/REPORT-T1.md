# True Line elevation · T1

Home only, complete. No commit, staging, deployment or T2 work. Preview remains at http://127.0.0.1:5311/. Original landing photograph, slogan, Blackbird/Archia/Geist pairing, warm palette, amber line, pills, services index and bending claims rail remain recognisable. Eight Dribbble images were downloaded and opened; sources, individual critiques and change rationale are in [ELEVATION.md](ELEVATION.md).

## Changes and evidence

Paths below are relative to the repository root.

| Change | Implementation |
|---|---|
| Measuring-rule loader now parts as two coal shutters; no tagline, extra scan or glow. Asset progress remains real. First session only, replay with `?intro`; reduced motion skips it. | `src/preview/bilageirinn-site/Loading.tsx:1`; gate `Page.tsx:2501` and `:2508`. Brimborg source `src/preview/brimborg/Page.tsx:465` and `:510`. |
| Desktop header arrives via `--iy`, phone bar remains opaque and still; full mobile focus lifecycle, background inert, focus loop and scroll lock. | `Page.tsx:469`; `site.css:9`. Brimborg `Page.tsx:483`; studio focus-guard. |
| Hero retains its composition; word-mask arrival now 1.2s. Cycle frames decode before cycling; drift waits for handoff, cycle pauses offscreen/hidden; phone parallax removed as specified by the locked design. | `Page.tsx:782`, `:828`. John Lawrie heading duration in research CODE-EVIDENCE.md, Brimborg asset handoff. |
| Position-tied reversible block reveals and image curtains with stable outer triggers. | `Page.tsx:254`, `:272`; motion inventory in `src/preview/bilageirinn-site/MOTION.md`. |
| Facts always show the correct static number; removed count-up implementation and dormant marquee CSS. | `Page.tsx:454`, `:1160`. |
| Services always expose descriptions at every width, with no expanding panels. Decoded crossfade, desktop photographic selector strip, individual mobile thumbnails. All copy uses INK. Selection never changes row geometry. | `Page.tsx:1228`; `site.css:15`. Dribbble 26238774 / 26023606 and ESR alignment. |
| New numbered repair chapter with direct step links and scroll-following current step. Existing rail remains reversible and straightens at completion. Existing paintwork image stays in place; no pretend before/after imagery. | `Page.tsx:1504`; `site.css:23`. Heritage Driven process, Dribbble EDS 23494148. |
| Hero rental overclaim removed in IS/EN; complete insurer entitlement, payment terms and renter responsibility placed in the rental step. | `translations.ts:60`, `:280`, `:330`; `data.ts:185`. Verified source `../03-prototypes/bilageirinn/content.mjs:920`. SEO description also drops the unconditional rental promise. |
| Reviews stay as still typography, with larger featured quotation and correct list children. This copied baseline already had still review markup: only unused marquee CSS remained. | `Page.tsx:1746`. |
| Workshop photography becomes an editorial figure with an honest illustrative-photo caption; body copy for location/hours uses INK; hours range wording follows language. Section rhythm tightened around services. | `Page.tsx:1814`; `site.css:14`, `:34`. Spyker craft and Brimborg image honesty. |

`DESIGN.md` token values remain unchanged. The inherited accepted hero scrim and pill CTAs are explicit exceptions to the studio's generic vocabulary ban, documented in ELEVATION.md. No new scrims or boxed content added.

## Before / after and full-page review

I opened the baseline images, every reference shot, all three whole-page captures/contact sheets, hero comparison pairs, claims views, loader/shutter and menu captures.

| Size | Before | After | Side by side | Whole home |
|---|---|---|---|---|
| 1440×900 | [Baseline](baseline-1440.png) | [Hero](shots/home-1440-hero.png) | [Pair](shots/pair-1440.jpg) | [Full home](shots/home-1440-full.png) |
| 1024×900 | No supplied 1024 baseline | [Hero](shots/home-1024-hero.png) | Not available | [Full home](shots/home-1024-full.png) |
| 390×844 | [Baseline](baseline-390.png) | [Hero](shots/home-390-hero.png) | [Pair](shots/pair-390.jpg) | [Full home](shots/home-390-full.png) |

Additional: [desktop claims](shots/home-1440-claims.png), [phone claims](shots/home-390-claims.png), [phone menu](shots/menu-390.png), [loader](shots/loader-1440.png), [shutter opening](shots/shutter-1440.png), [reduced-motion full home](shots/reduced-390-full.png). Contact sheets show consecutive 1800px sections, left to right: [1440](shots/contact-1440.jpg), [1024](shots/contact-1024.jpg), [390](shots/contact-390.jpg).

Full-page screenshots were taken after traversing the whole page so scroll-driven layers have entered. For capture only, the isolated context temporarily positions the header absolutely at page top, avoiding Chromium placing a fixed header at the current bottom scroll position in the full-page image; the style is immediately removed. Hero/menu screenshots use the actual fixed header. A still full-page image cannot represent each service's active photo or a reversible rail in every scroll position.

## Checks performed

- `npx vite build -c vite.bilageirinn.config.ts`: passed, final [build log](shots/build.log).
- Chromium through Claude's existing debug browser, one screenshot sweep worker. Short focus/map checks used disposable isolated contexts. All owned contexts closed; browser disconnected, never closed.
- [checks.json](shots/checks.json): zero console errors/warnings; no broken visible images. Document width exactly 1440 / 1024 / 390 at those viewport widths.
- Entry progress sampled at opacity `.12 → .727 → .12`, y `24 → 7.44 → 24`: reverse movement confirmed. Claim chapter `01 → 02 → 03 → 04 → 02`; SVG path reaches x=8 throughout at step four, then bends again on reverse.
- [interactions.json](shots/interactions.json): hero advances to a decoded booth image; all seven service row heights remain identical before/after selection; desktop and mobile logo return scrollY to 0; rapid open-close-open leaves exactly one menu and a fixed body.
- IS/EN text, rental terms, html language and saved language through reload pass. English hours use “to”, Icelandic uses “til”.
- Reduced motion at all three widths: no loader, header opacity 1, hero transform none, zero hidden headings/body/images. Lenis remains disabled under reduced motion and on touch.
- Real tap opens on the menu panel with no outline and no focused first link; Escape closes and returns focus to toggle; Enter opens on the first link. Safari-like prevented-mousedown variant passes the supplied checker assertions: [focus-guard-result.json](shots/focus-guard-result.json).
- The supplied `../_tools/focus-guard/check-menu.mjs` launches and closes Chrome. To honour the explicit existing-browser restriction, [focus-guard-check.mjs](focus-guard-check.mjs) is the same test with only launch/newPage/close changed to connect/owned context/disconnect. Run: `node bilageirinn/focus-guard-check.mjs http://127.0.0.1:5311/ 'button[aria-controls="bg-mobile-menu"]'`.

## not_checked / limits

- Actual iPhone/iOS Safari and physical touch hardware. Chromium mobile emulation and real protocol taps were checked; no simulator started.
- Google embedded map tiles remain blank in this environment. The iframe has normal dimensions, loads Google's embed URL and has an empty body here; the external Maps link and visible address remain. This is an observed limitation, not a passed map rendering check.
- Other twelve pages, real contact-form backend/delivery, final photo slots, client photography/video and production publication: explicitly T2. Existing mailto form remains unchanged.
- No slow-network asset-failure or timeout-injection run. First/repeat intro and reduced-motion bypass were exercised; timeout guard exists in source.
- No separate 1024 before screenshot was supplied; the 1440/390 baseline pairs are the before evidence.
- No independent Safari/Firefox or complete accessibility audit; menu keyboard/touch/focus and reduced motion were checked specifically.
- No general speedup claim. `memory_pressure` reported 38% free; process listing and kernel pressure-level query were denied by the sandbox. Ownership checked via listening sockets; no new browser, server, simulator or watch job started.

## Resource handoff

No long-running resources owned by this slice remain. Claude's Chrome PID 85735 on 9361 and static Vite preview PID 85780 on 5311 were reused and left running. Their start times were unavailable because `ps` was denied; ownership remains with Claude, as provided in the task. Do not terminate either. Existing preview restart command, if its owner needs it: `npx vite preview -c vite.bilageirinn.config.ts --host 127.0.0.1 --port 5311`. Rebuild before reload because it serves `dist-bilageirinn`.

Only allowed source/home documentation paths were edited. Build wrote the expressly requested `dist-bilageirinn` output. No other project files were edited, formatted, staged or committed. T1 stops here.
