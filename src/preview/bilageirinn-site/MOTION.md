# True Line home · T1 motion

Locked colour/type/geometry stay in DESIGN.md. Existing Framer Motion and Lenis remain the engines; no extra animation dependency. Reference evidence and exceptions: `bilageirinn/ELEVATION.md`.

| Surface | Treatment | Touch / reduced motion |
|---|---|---|
| Intro | First session only; fonts.ready + hero decode + icon decode, 1.2s minimum, 4.5s fail-open. Real asset fraction fills the measuring rule. Two coal halves part vertically in 1.15s, True Line ease [.23,1,.32,1]. `?intro` replays. | Same on touch. Reduced: no overlay, no wait. |
| Header | Desktop `--iy` -26px → 0 with opacity over .9s as asset gate clears. Independent translate, no transformed fixed ancestor. | Opaque constant phone bar, no arrival motion. Reduced: immediate. |
| Hero | Original word masks, 1.2s settles, .05s stagger from .28s; amber line draws .8s. Background first decoded photograph remains full bleed. Cycle 6.5s dwell / 1.6s crossfade, all frames decoded before cycle, paused offscreen/hidden. Drift pauses behind intro. | Phone: first frame, no parallax/drift/cycle/scan. Reduced: immediate masks and static first frame. |
| Blocks / headings / reviews / facts | Stable outer wrapper drives inner opacity .12 → 1 and y24 → 0 over top 96% → top 72%. Position-tied and reversible. Facts never change numerical value. No count-up, marquee or quote rail. | Same 24px entry on touch; reduced: plain fully visible elements. |
| Images | Stable outer wrapper drives curtain inset-bottom 95% → 0 over top 96% → top 55%. Existing editorial parallax preserved; no new large drift. | Reduced: whole images immediately visible. |
| Services | Open rows always show all copy. Selected photo decodes before .6s opacity crossfade; dimensions never change. Desktop thumbnail strip, tap/focus/hover selection; nearest row updates reading state. | Phone: small whole-photo thumbnail per row and large first panel. Reduced: no photo tween. |
| Claims chapter | Scroll reads fixed step positions at 55% viewport; whole chapter numeral arrives y24/opacity over .7s on a step change. Links jump directly to each step. Original rail morphs bent → straight as rail traverses viewport; reversible. No pinning. | Same reading logic, stacked layout on phone. Reduced: rail already straight and whole step numeral immediate. |
| Story / thesis / craft / brands | Existing drawn True Line accents, stable block reveals and imagery; thesis bend remains tied to its existing source. One-shot accent draws are decorative only. | Reduced: static line and copy. |
| Workshop / map / contact / footer | Same position-tied block/curtain wrappers. Workshop caption static. Existing form interactions unchanged for T2. | Reduced: fully visible. |
| Menu | Opacity .3s open/.25s close and masked links .5s/.2s with stagger. Body fixed at saved position; closes on Escape, anchor, wide breakpoint. Pointer focuses panel; keyboard first link; Tab loops, Escape restores toggle. | Real-tap focus guard. Reduced: no transitions. |
| Actions | Existing pill sheen/press feedback; new photo selectors opacity/4px rise, hover limited to fine pointers. Chapter links underline active state. | Touch has pressed state and tap selection. Keyboard retains visible ring. |

Validation evidence: `bilageirinn/shots/checks.json`, `focus-guard-result.json`, REPORT-T1.md. Full-page captures are static evidence, not proof of motion; the JSON samples include actual forward/reverse rail path values and entry transforms.
