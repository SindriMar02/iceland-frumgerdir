# DESIGN.md — Katrín Ísfeld, elevation pass

Redesign mode: **Preserve.** Her brand, palette, type and copy voice are
already right and stay exactly as they are. This locks tokens for an
elevation pass — new devices and missing content on top of what exists — not
a new visual language. Full research/direction writeup:
`_docs/KATRIN-DESIGN-PLAN-2026-09-02.md`. Two live references were dissected
for their DEVICES, not their look — see that file for the full measured data.

## Tokens (extracted from her own code — `facts.ts` / `Page.tsx`, unchanged)

```
--ki-ground  #EFEAE2   warm cream, page field
--ki-ink     #231F1B   near-black text
--ki-wine    #8C3A34   primary accent (selection, focus, CTAs)
--ki-copper  #C68A5E   secondary accent
--u          clamp(.44px, 100vw/1440, 1.15px)   fluid unit, already in use

headline/display font: Sentient (serif)
body/nav font: Archia
label/mono font: Geist Mono
```

**Do not introduce a new accent, a new font, or a new fluid-scale system.**
Anything that reads as "generic premium redesign palette" (beige+brass+
espresso as a fresh invention) is explicitly the wrong move here — this
palette is not a cliché to avoid, it's her real, already-approved brand.

## Stack discipline (matches her existing build, do not add dependencies)

Her current build is deliberately dependency-light: vanilla React + CSS +
IntersectionObserver-based reveals, no GSAP, no Lenis, no Framer Motion (see
[[lenis-mobile-damage]], [[gsap-splittext-clearprops-traps]] — she chose out
of that stack on purpose during the original build). **Keep it that way.**
Every device below is implemented in plain CSS transitions/custom properties
+ vanilla JS (rAF for continuous values, IntersectionObserver for reveals),
matching what's already in `kit.tsx`/`Page.tsx`. No new npm packages.

## Status, 2026-09-02 (commit 9b99595)

Built and verified: 1, 2, 3, 5, 6, 8. Deliberately skipped: 7. Blocked on
photography from Katrín: 4. Detail against each device below.

## Devices (numbered to match the plan doc, real parameters from the dissected references)

1. **Reveal-on-interaction photography** (from IDST idst.ae, live-measured).
   At rest each hero/project photo shows its own sampled dominant colour as
   a flat field (computed per-photo, not one shared greige like IDST — this
   is what performs Katrín's own "litheim" line). Cursor movement (desktop)
   or first tap (mobile, partial ~30-40% reveal) unveils the real photo.
   rAF-driven opacity/clip, not CSS-transitioned. `prefers-reduced-motion`:
   skip the veil, show the photo at rest, no exceptions.
2. **Colour-sampled thumbnails** (from IDST) — same mechanism as #1, applied
   to the project-index grid, sampled per-thumbnail.
3. **Project-hero pin-and-cover** (from OH Architecture, live-measured) —
   hero photo+title pins while the next section slides up over it; meta row
   stays visible at the pin boundary until covered. Project-detail pages
   only.
4. **Facade→interior crossfade** (from OH, real eased values:
   `cubic-bezier(.76,0,.24,1)`, .875–1s). **PARTLY SHIPPED as the card
   crossfade** — OH's mechanic is "one photograph crossfades to another on
   hover", and she already has a second photograph for most projects, so
   `CardFigure` runs it on photo[0]→photo[1] at 1s on `--ki-ease-cross`.
   The BEFORE/AFTER version of the same device still needs real
   before-photography from Katrín, plan doc §5.
5. **Motion-treated process section** — stage her EXISTING 4-step "Hvernig
   verkefni byrjar" copy (do not invent new steps) with real sequential
   reveal, inspired by OH's numbered-stage treatment.
6. **Condensing nav** (from OH's mechanic, Katrín's own type/case, not OH's
   uppercase MENU pill) — full nav collapses to a minimal state past hero.
7. **Progress-tied preloader** — **DELIBERATELY NOT BUILT.** OH needs one
   because its Webflow/GSAP/Lenis stack is 535 KB and its images stall; this
   build is 281 KB of JS with a measured 744ms LCP and already opens through
   a pure-CSS arch curtain that plays off the prerendered HTML before React
   parses. A progress bar here would be an animation waiting on nothing —
   inventing load weight in order to decorate it. Revisit only if a future
   device actually makes the page slow.
8. **Underline-hover + image-hover-zoom** on project-index cards (from OH,
   `.725s`/`.875s`, same custom eases as #4).

Real eases as CSS custom properties, add to whichever stylesheet already
holds `--ki-*` tokens:
```css
--ki-ease-primary: cubic-bezier(.83, 0, .17, 1);
--ki-ease-secondary: cubic-bezier(.16, 1, .3, 1);
--ki-ease-cross: cubic-bezier(.76, 0, .24, 1);
```

## What does NOT transplant (explicit boundary)

IDST's Kindheart script font, Manrope, its single-greige-field palette.
OH's PP Neue Montreal, uppercase display type, monochrome black/white
system, its literal "MENU" pill styling. None of it. Devices only.

## Mandatory gates on every device built

- `prefers-reduced-motion: reduce` → static, photo visible at rest, no
  exceptions, checked per-device not once globally.
- No new dependency added to `package.json` for any of the above.
- Re-run `node _ki-preflight.mjs` after each device lands — it must keep
  passing (26 routes, schema, accessibility, no catalogue leak).
- Before calling any device "done," verify it live in-browser (desktop +
  mobile), not just by reading the code.
