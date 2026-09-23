# Eyvík — "Five cottages, one ridge"

Built 2026-09-22 from Sindri's three boards (Armonia Excursions, ARCH.MONO/Echo, SAND beachwear) and the owners' own photos. Audit: `_docs/EYVIK-AUDIT-2026-09-22.md`, plan: `_docs/EYVIK-BUILD-PLAN-2026-09-22.md`.

## Tokens (sampled from their frames)
paper #EAE2D0 · sand #DCCEB2 · grass #9E7C4D · rust #9A542B · moss #34402A · moss-deep #242C1C · night #0A1A14 · ink #1D1A14 · mute #6E6553. Grain overlay on paper panels.

## Type
Sprat Condensed Light (caps display) · Instrument Serif Italic (one swash word per title, quotes) · Switzer (body, EYVÍK wordmark) · Fragment Mono (labels). Sprat's ² renders like a 2: use `<sup class="u">`.

## Structure
1 split-poster hero · 2 their Hekla line + spec · 3 ALONG THE RIDGE (replaced the day scrub 22.09 at Sindri's request): desktop pins and travels sideways through 6 panels on a sand-to-night gradient track, inner parallax + captions on containerAnimation, films play only on screen; phones stack with curtain reveals · 4 the five (Samara-style centred drawing A–E, per-cottage rating, reviews and its own guest's words) · 5 inside (board-1 uneven 3-up + plan) · 6 the tub (board-3 split) · 7 nearby in minutes (owners' maps) · 8 hosts next door, winter · 9 verbatim voices · 10 booking engine · footer.

## Motion (the Búðir kit, scrubbed)
Lenis lerp .1 on fine pointers only (`isTouch()` guard, mobile-gate pattern), wired to ScrollTrigger via the gsap ticker. Headlines: masked lines rise, stagger .14. Paragraphs (`.ev-lines`): SplitText lines, alternating ±110%. Photos (`.ev-peel`): clip-path curtain + scale 1.3→1. Big images (`.ev-par`): yPercent ±7 at scale 1.16. Hero: photo sinks, h1 lifts away. All reveals scrub over a short band (top 94% → top 60%), never timed. Reduced motion: gsap.matchMedia creates nothing; resting CSS is the finished page.

## Chrome: the header is the ridge
Transparent bar, paper colour, `mix-blend-mode:difference`, so it inverts over anything. Centre: a horizon line with the five cottages drawn on it, one per section (ridge, five, inside, nearby, book). The cottage for the section under the bar lights its windows, and its name sits below the line. A sun crosses above the row with page progress and becomes the moon after 80 %. Position-driven, never timed; the bar itself never moves. Under it: a colourless progressive blur (`.ev-veil`, a sibling so the blend survives) plus a sticky blur awning for the iOS status strip. Body background and theme-color follow the section under the bar, so Safari's strips match. Trade-off: lower contrast over busy mid-tone photos.

## Booking engine
`StayPicker.tsx`: five calendars from `availability.ts` (each cottage's Airbnb calendar, 22.09.2026), Airbnb's own per-night minimum, crossing refusal, booked night = legal checkout, undo, first free month. Exits: prefilled email to the owners, or the cottage's Airbnb with dates.

## Media
`public/eyvik/`: 8 Higgsfield 4K upscales of their photos (bytedance, 2 cr each), 3 Kling 3.0 pro loops (8.75 cr each; the sunrise clip was not used, it invented a contrail), 10-bit graph, CRF 22 High.
