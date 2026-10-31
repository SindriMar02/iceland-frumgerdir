# Brimborg motion

Every surface inherited from ÍSBAND / Íslyft keeps its implementation numbers (see `../islyft/MOTION.md`): Lenis lerp .125 on fine pointers, CustomEase `M0,0 C0.625,0.05 0,1 1,1` (named `bb`), masked character titles, line-faded body, clip-scale media, inner parallax, collage drift, item groups, buttons, brand split, filter grid, statement clip, heritage float, header edge colour, menu, sticky bar, rails. Only the rows below are new or changed.

| Surface | Trigger | Treatment | Reduced motion |
|---|---|---|---|
| Loader (first visit per session, `?intro` replays it) | page load | Black screen in two halves. A light bar ignites from the middle (scaleX 0 → 1, 1.15s from .15s) with a teal glow and a teal highlight that sweeps along it every 1.6s while waiting; the white mark settles above it (.9s from .7s) and one line, "Polestar 5 er kominn", below (.9s from .85s). The gate: fonts ready AND the hero picture decoded (guarded 3s / 3.5s) AND 2s elapsed. Then the bar flares (scaleY 2.6, .28s), the halves part along it (top yPercent −100, bottom +100, 1.15s from .3s, `bb` ease) spilling teal light on their own edges (`--spill` 1 → 0), the bar fades (.5s from .5s) and the hero intro starts at .62s | none, no loader |
| Header arrival | with the hero | `--iy` −26px → 0 and opacity, .9s at .35s; also on repeat visits (no loader) | static |
| Hero price | hero intro | Each digit is a 20-row strip parked on its value; yPercent from the digit's own offset to 0, 1.5s, .06 stagger from .5s | final digits |
| Chapter price | scroll, `top 90%` → `top 40%`, scrub .5 | Same roll, 1s, .07 stagger | final digits |
| Figures | scroll, `top 94%` → `top 58%`, scrub .4 | Count up to 791.640 / 650 / 3,2 / 558, comma decimals | final values |
| Wide frame | scroll, whole pass, scrub | Pan xPercent −4 → 4 over the system's vertical parallax and clip-scale reveal | static |
| Gallery rail | drag, arrows | The system rail (arrow step = one card + gap, drag threshold 6px) with clip-scale reveal per card | native scroll |
| Showroom card | scroll | System `data-fade` (y10 + opacity); today's row and open state read the Iceland clock (UTC) | same |
| Menu open | tap / key | Inherited slide and item stagger; a tap focuses the panel, only the keyboard focuses the first item (`_tools/focus-guard`, tracker installed by the page) | static |
