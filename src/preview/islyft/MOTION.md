# Íslyft motion — slice 3

All retained animated surfaces are **unchanged from ÍSBAND**. The complete Page block from `chromeRef` through the filter-refresh effect is byte-identical to the slice 1 transplant. CSS differs only in hexadecimal colour literals. No timing, easing, layout, breakpoint, radius or motion setting was changed. The `il` namespace was already transplanted before slice 1.

| Surface | Unchanged from ÍSBAND: implementation numbers |
|---|---|
| Global scroll / easing | Lenis lerp 0.125, fine-pointer only; native touch scroll. CustomEase `M0,0 C0.625,0.05 0,1 1,1`; CSS cubic-bezier(.625,.05,0,1). GSAP ticker drives Lenis; lagSmoothing(0). |
| Loader | Logo mask opens 0.7s; year/copy alpha 0.3s at 0.45s; panel yPercent −100 over 0.8s at 1.15s; hero starts at 1.3s. Session storage behavior unchanged. |
| Hero intro | Image 1.12→1 over 1.6s. Eyebrows y10/alpha over 0.8s, stagger .08 at .1. Characters y100→0 over .8s, stagger .018 at .15. Lede y14/alpha .8s at .55. CTA inset .7s, stagger .08 at .75. Caption alpha .6s at 1. |
| Hero scroll | Inner image y0→16%, scrub .15, top/top→bottom/top. Frame scale1→.8 from 40%/top→bottom/top, scrub .15. |
| Header / contact bar | Bar offset capped at38px; solid after60px; hide after320px and downward delta>4px; show upward delta>4px. CSS slide .55s. Dark plate clipped to section intersection; interval250ms. |
| Menu | Panel y−100%→0 over .8s. Items y12→0/alpha .4s, stagger .07, delay .3. Anchor scroll delay60ms. Existing scroll lock, inert and focus behavior unchanged. |
| Character titles | y100%→0, .8s, stagger .018; position-linked top100%→top86%, scrub true. |
| Body lines | y14→0/alpha, .8s, stagger .05; top100%→top84%, scrub true. |
| Eyebrows / fade elements | y10→0/alpha; linear, top100%→top84%, scrub true. |
| Media frames | inset20%→0 and scale1.1→1, .9s; top100%→top70%, scrub true. |
| Inner media parallax | y−8%→8%, top/bottom→bottom/top, linear scrub. |
| Item groups | Scale .85→1/alpha, .8s, stagger .08; top100%→top84%. |
| Buttons | Inset(0 50%)→0 at top99%→top84%. Hover letters translate−1.35em over .32s, per-letter delay6ms; surface transitions .3s. |
| Category / stock rails | Existing arrow step = first-card width + gap; native smooth scroll (auto under reduced motion). Mouse drag threshold6px; edge tolerance8px. Arrow opacity/shadow .25s. Category arrow rotation45° over .5s. |
| Brand split | Divider range14–86%, initial50%; easing factor .1, stop tolerance .05. Copy thresholds30/70. First reveal starts18%, then aims50% after380ms at intersection threshold .45. Keyboard step8%; tab targets80/20. Handle hover1.08 over .35s. |
| Filter/grid transitions | Framer layout; enter y16/alpha, exit alpha; .5s with [.625,.05,0,1]. ScrollTrigger refresh650ms after filter. Filter underline .45s; colour .25s. Card hover scale1.035 over1s; arrow translate2/−2px over .4s. |
| Service collage | Desktop ≥900px; drift24→−52, −28→44, −20→64; top/bottom→bottom/top. Emergency tile and its32→−40 drift are removed as instructed, not retimed. |
| Statement | Clip inset10%→0 during first .4 viewport height, held, back to10% during last .6 section height. quickTo .15s linear; round8px above inset .5. Link-cell hover background .3s. |
| History floats | Distances120,60,160,90,140; desktop multiplier1, phone .4. y .45×distance→−distance; scrub .55. Text y .35×72→−72 desktop, .35×28→−28 phone. |
| Quote band | Existing inner parallax; input border colour .25s. Form acknowledgement has no new animation. |
| Footer | Existing reveal attributes only; no new animation added. |
| Sticky controls | Reveal after hero frame bottom≤0; translate calc(100% +24px)→0 over .55s. Existing menu-open suppression and safe-area behavior. |
| Chat | Widget vendor script and inherited UI motion unchanged. Brand CSS accent receives blue through the existing token. Only answer content and quote-selection data wiring changed in slice 3. |
| Reduced motion | Existing JS still() guards; CSS transition/animation duration .01ms; statement clip none; native/auto scrolling as before. No testing shortcut changes this setting. |

Removed non-animated data displays: hour rows, status badges, emergency row, loan strip and VSK. The unused 60-second hours timer was removed with its state; it is not an animation timer. Every other retained timer and animation value is unchanged.
