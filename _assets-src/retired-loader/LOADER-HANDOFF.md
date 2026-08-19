# Handoff — the Áslaug Saja loading screen ("Undirskriftin")

Self-contained spec for the signature preloader / page-transition system on
`/preview/aslaugsaja`. Everything here is implemented and verified; constants marked
**[ref]** are read verbatim from juliencalot.com's own unminified bundle
(`cdn.jsdelivr.net/gh/moussamamadou/juliencalot-public` — cached at the session
scratchpad `jc-src/*.pretty.js`), not estimated.

## Concept

A black cover on which the artist's signing name, **"Saja"** (what she actually signs on the canvases), is handwritten
stroke by stroke (GSAP DrawSVGPlugin), with a zero-padded percentage counter
(`000%` → `100%`) bottom-centre. It is not just a boot splash: **the loader IS the
page transition** — every internal navigation re-covers the page, redraws the
signature (shorter), and uncovers. The reference does this with Swup; here it's a
view-state router.

## Files

| File | Role |
|---|---|
| `Signature.tsx` | **GENERATED, not hand-drawn.** "Saja" set in Hershey `scriptc` (Script Complex) — a true **single-stroke** calligraphic face where each glyph is stored as pen centrelines, not filled outlines. 13 paths (`data-sig-path`), viewBox 1576×930, `stroke:currentColor`, width 46, round caps. Public domain (Hershey, US NBS 1967). Regenerate from `scriptc.jhf`. |
| `motion.ts` | `signatureTimeline()` (draw scheduler), `FakeProgress` (counter algorithm), the three loader event names. |
| `Page.tsx` → `useLoaderRouter()` | The choreography: show / draw / swap view / hide, and the boot sequence. |

## DOM (two fixed layers)

```
<div z-99  class="dim">      black, opacity 0        ← dims the OLD page during a transition
<div z-100 class="cover">    black, clip-path box    ← holds signature + counter
  ├─ signature svg           white, ~min(72vw, 560px) wide, centred
  └─ counter span            "000%" · Anton 18px · tracking 0.36px · bottom-2.5rem, centred
```

## Choreography

### Boot (first load)
1. Cover is fully visible from first paint (`clip-path: inset(0%)`), page hidden behind it.
2. `FakeProgress.start()` + signature draw at multiplier **0.9 [ref]** (≈2.4s).
3. On draw complete → `FakeProgress.complete()` (counter lerps to 100).
4. Hide (below).

### Navigation (every internal link)
1. **Show**: cover wipes up from the bottom — `clip-path: inset(100% 0 0 0) → inset(0%)`,
   **0.4s power1.inOut [ref]**; dim fades to **opacity 0.25 over 0.75s [ref]** beneath it.
2. Signature redraws at multiplier **0.5 for about/contact, 0.6 for everything else [ref]**;
   counter runs again.
3. On complete: swap the view, `scrollTo(0,0)`, wait two rAFs (new view mounts its paused
   reveals), then hide.

### Hide (both cases) — this is what makes the site feel alive
`clip-path → inset(100% 0 0 0)` over **0.75s power2.inOut [ref]**, dim → 0 over 0.4s,
and it fires three events the whole page listens to:

| Event | When | Who plays |
|---|---|---|
| `asaja:loader-hidding:start` | t = 0 of the hide | grid/list image rises, split-line text, hero settle |
| `asaja:loader-hidding:middle` | t = +0.5s | (reserved — reference uses it for contact/legals) |
| `asaja:loader-hidding:end` | wipe complete | anything that must wait for full uncover |

Reveals **begin while the cover is still lifting** — content is already arriving as the
black leaves. Never sequence reveals after the hide completes; that half-second overlap
is the trick.

### Skip
Any `pointerdown`/`keydown` during boot sets `timeline.timeScale(7)`. Nobody is trapped.

## The counter is fake **[ref algorithm, verbatim]**

Not real loading progress — a performance of one:
1. rAF-increment by a random speed (**0.1–0.2/frame**) up to a random max (**35–70**).
2. Then ~1 tick per random second, capped at **80**.
3. On draw completion: `cur += (100 − cur) × 0.2 + 0.5` per frame until ≥ 99.9 → snap 100.

Format: `padStart(3,'0') + '%'` → `007%`, `043%`, `100%`.

## The draw scheduler (`signatureTimeline`)

Per stroke: `fromTo(path, {drawSVG:'0% 0%'}, {drawSVG:'0% 100%'})` at **absolute start
times with ~60% overlap** — stroke *i* starts at 60% of the previous stroke's duration,
so the pen "keeps moving". Duration per stroke ∝ its `getTotalLength()` share of the
total (min 0.08s), everything × the multiplier. Ease `sine.inOut`, every 4th stroke
`sine.out` (pen lift). This mirrors the reference's hand-tuned per-stroke schedule
(their j-dot 0/0.2 · j 0.05/0.7 · ca 0.45/0.65 …).

## Reduced motion

Multiplier drops to 0.15, show/hide durations ~0.2s, beats still fire (reveals elsewhere
collapse to near-instant). Verified: boot completes, navigation works, text ends at
opacity 1 / transform none.

## Gotchas (all hit, all verified)

- **DrawSVG signature**: computed style shows `stroke-dasharray: <pathLen>px, 0.1px` per
  path — that pair is how you *verify* DrawSVG is actually driving it.
- **Never verify the loader in a non-fronted headless tab** — background tabs get 1fps
  rAF, so the counter/lerp looks frozen and boot "never completes". `Page.bringToFront`
  first.
- The cover uses `clip-path` wipes, **not opacity fades** — the reference never crossfades
  its loader, it wipes. Keep it that way.
- `role="status"` on the cover during boot; `aria-hidden` after. Counter text lives in a
  real text node so screen readers get the progress.
- The signature must stay **white on pure black** (`#000` / `#fff`) — the two-ink rule of
  the whole design system.

## Why a single-stroke font, and what would be better

An **outline** face cannot be written by DrawSVG: its paths enclose the letterform, so
animating them traces the EDGE and reads as outlining, never as writing.

juliencalot.com solves this with a **mask sandwich** — a filled letterform wearing a
`<mask>` that contains a fat, crude centreline stroke; DrawSVG animates the mask stroke and
uncovers the real variable-width letterform. Verified in their source: `#mask-jcalot-j`,
`#mask-jcalot-ca`, … each a `stroke-width: 20–28` path with `fill:none`.

That needs one hand-drawn centreline per glyph. We could not derive those automatically —
four methods tried (per-column mean, skeleton longest-path, paired-contour medial axis,
full branch decomposition); the best left **23% of the letterform unrevealed**, and using a
different typeface's centreline as the mask left **32%** unrevealed. A single-stroke font
sidesteps the problem entirely: the glyph IS the centreline.

**The upgrade path, in order of quality:**
1. **Her real signature.** One photo on white paper with a black marker → vectorise
   (`vtracer` / `potrace` / Illustrator Image Trace) → if it traces to filled outlines,
   draw the centrelines over it in any vector editor and use the mask sandwich.
   NB: her signature cannot be lifted off the paintings — it is painted in the same colour
   and value as the surrounding brushwork and physically merges with it (surveyed all 124
   Apolloart works and 44 saja.is masters ≥2500px).
2. **Alex Brush + hand-drawn masks.** The elegant variable-width letterform is already
   extracted (fontTools → filled SVG paths); it only lacks 4 centreline strokes.
   Inkscape's *Trace Bitmap → Centerline* does this in one click.
3. **Current: Hershey single-stroke.** Monoline, no thick/thin, but genuinely calligraphic,
   correctly written in pen order, and zero hand-authoring.

## Tuning knobs (safe to adjust)

| Knob | Where | Current | Effect |
|---|---|---|---|
| Boot multiplier | `runSignature(0.9, …)` | 0.9 | overall boot draw length |
| Nav multipliers | `viewMult()` | 0.5 / 0.6 | transition length per destination |
| Skip speed | `timeScale(7)` | 7× | how hard input fast-forwards |
| Stroke overlap | `cursor += dur * 0.6` | 60% | pen continuity vs. legibility of strokes |
| Hide wipe | `0.75s power2.inOut` | [ref] | don't touch — beats are timed to it |
