# Bílagallerí: showroom clarity

## Source and intent
User-authorized evolution of Claude's Bílás design, preserving its photographic showroom, Anton display and Space Grotesk UI. This is a product browsing experience: find, understand, compare and enquire. Source: `../bilas/Page.tsx`, measured desktop/mobile reference captures and motion probes in `_docs/bilagalleri-build-2026-09-30` and `04-platform/sndr-teardowns/teardowns/bilagalleri-bilas-reference-2026-09-30`. Verified reference: #0A0C10 canvas, #12151C surface, #F2F5F9 text, #9DA9BA secondary, 0.32/0.72/0/1 curve, 2600ms hero Ken Burns, 5500ms carousel. These are observed, not all retained.

## Changes chosen for this business
Their actual logo is red on white. Use red #BC262B in light mode, #FF999D on dark for accessible actions, with dark ink on pale red fills. The user requested removing the original white plate and blue border. Rebuilt the lettering as transparent SVG outlines using Times New Roman Regular as a visual match (not a confirmed original-font attribution). Header and footer inherit the accessible red theme accent, with identical glyphs on every platform and no font-loading dependency. Buyers browse on phones outdoors and at night: start with system theme, persistent manual override, system reset, no initial theme flash. Car photography stays unfiltered in both themes.

## Tokens
Light: ground #F5F6F7; surface #FFFFFF; ink #171B20; secondary #535D69; line #CDD2D8; accent #BC262B. Dark: ground #0A0C10; surface #14181E; ink #F2F5F9; secondary #B1BAC7; line #39414C; accent #FF999D. Sharp photo frames, 6px controls, 8px panels. No decorative shadows. Spacing 4/8/12/16/24/32/48/64.
Anton uppercase only on hero and chapter titles, 44–88px desktop, 38–48px mobile; no data or controls in display face. Space Grotesk 400/600, 16px inputs, tabular price and mileage. Both verified Icelandic glyphs from local font index.

## Layout and content
Compact hero pairs large type with one real vehicle and a linked vehicle caption. Search directly follows the compact introduction; phones omit the duplicate featured-car banner so available inventory follows the introduction directly. Inventory: persistent mobile search/filter bar; desktop core facets plus expandable advanced filters; 2 columns desktop, 1 on mobile. Photo, title/trim, price and VAT condition, year/km/fuel/transmission, drivetrain/seats, one sourced highlight. Cards don't hide specs on hover. Dedicated details keep gallery, identity, price, core facts and enquiry together. Group all equipment and preserve original seller notes.
Cash purchase and consignment have separate journeys. No financing calculator with invented rates, no fake live availability, no invented reviews. Snapshot date always visible; live stock needs licensed integration.

## Motion
Override generic skill randomness, decorative looping and pinned page sequences: user requests Bílás continuity and rapid shopping. Natural touch scrolling, constant mobile header and ink awning. Desktop-only Lenis lerp .2 with anchors; no wheel hijack in overlays. Hero introduction 500ms, editorial media shift limited to 24px and reversible with scroll; no hides/reveals on inventory. Buttons 140ms, overlays 220ms cubic-bezier(.32,.72,0,1), hover movement only on fine pointers. Reduced motion is plain rendered content, no smooth engine. Theme swaps immediately as one atomic token change, toggle thumb has interruptible transform. No color interpolation on html/body (Safari tint).

## Interaction and correctness
URL holds filters, sort, details and pagination. Browser Back restores filters and scroll. Saved vehicles persist locally, storage failure is non-fatal. Compare 2–3 vehicles with labelled rows; unavailable/missing facts say Ekki tilgreint. Native dialog focus containment, Escape, trigger focus restoration, fixed-body scroll lock. Exact min/max inputs; contradictions get visible feedback. Search folds Icelandic accents and supports explicit category/seats/drivetrain/price intents. No invisible zero-match filters. Every contact button identifies a real car; prototype form previews the request without sending and provides a deliberate original-site route.

## QA gates
320/375/390/768/1024/1440 in both themes; native Safari in dedicated simulator; keyboard, zoom, empty results, corrupt storage, share URLs, Back, image fallback, reduced motion, all dialogs. Run review-animations and web-design-guidelines. No deployment until explicitly requested.
