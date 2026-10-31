# Brimborg motion

Every surface inherited from ÍSBAND / Íslyft keeps its implementation numbers (see `../islyft/MOTION.md`): Lenis lerp .125 on fine pointers, CustomEase `M0,0 C0.625,0.05 0,1 1,1` (named `bb`), masked character titles, line-faded body, clip-scale media, inner parallax, collage drift, item groups, buttons, brand split, filter grid, statement clip, heritage float, header edge colour, menu, sticky bar, rails. Only the rows below are new or changed.

| Surface | Trigger | Treatment | Reduced motion |
|---|---|---|---|
| Loader plate | first visit in a session | Logo mask opens 0.7s; slogan, counter and note fade up (.6s, .08 stagger at .35s); counter eases to 86% over 1.6s on its own clock, then to 100% in .5s only after fonts are ready, the hero picture is decoded and 1.7s have passed; mark and foot fade (.4s), plate lifts yPercent −100 over .9s from .2s; hero starts at .38s | no loader, no counter |
| Loader edge | with the plate | 3px teal bar, filled by the counter, rides the bottom of the plate up the screen | none |
| Header arrival | with the hero | `--iy` −26px → 0 and opacity, .9s at .35s; also on repeat visits (no loader) | static |
| Hero price | hero intro | Each digit is a 20-row strip parked on its value; yPercent from the digit's own offset to 0, 1.5s, .06 stagger from .5s | final digits |
| Chapter price | scroll, `top 90%` → `top 40%`, scrub .5 | Same roll, 1s, .07 stagger | final digits |
| Figures | scroll, `top 94%` → `top 58%`, scrub .4 | Count up to 791.640 / 650 / 3,2 / 558, comma decimals | final values |
| Wide frame | scroll, whole pass, scrub | Pan xPercent −4 → 4 over the system's vertical parallax and clip-scale reveal | static |
| Gallery rail | drag, arrows | The system rail (arrow step = one card + gap, drag threshold 6px) with clip-scale reveal per card | native scroll |
| Showroom card | scroll | System `data-fade` (y10 + opacity); today's row and open state read the Iceland clock (UTC) | same |
| Menu open | tap / key | Inherited slide and item stagger; a tap focuses the panel, only the keyboard focuses the first item (`_tools/focus-guard`, tracker installed by the page) | static |
