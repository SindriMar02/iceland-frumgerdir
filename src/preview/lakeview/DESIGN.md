# Iceland Lakeview Retreat — "AF LANDINU" (Of the land)

Design read: premium-consumer hospitality one-pager for a couple planning a
Golden Circle stay; cinematic image-led language in the Mirror House mindset,
structure entirely its own. Dials: VARIANCE 8 / MOTION 7 / DENSITY 3.

## The concept (one sentence to the owner)
Your cabin is a turf house sixty years later, a roof of moss the drone can
barely find, and the page plays that hide-and-reveal: it opens on the land,
then finds the house in it.

This is derived from THEIR material: the listing's own line "combines
Icelandic traditional housing with a modern elegance" is literally true (p21
aerial: the turf roof merges into the moss), and Architectural Digest
(July 2025, per the listing highlights) already certified the architecture.

## Landing (the Alrún concept, per Sindri's ask)
Preloader (REAL progress: hero film poster decode + fonts.ready, 1.1s floor /
2.4s cap, sessionStorage once, ?loader forces, never under reduced motion) →
reveal → full-bleed FILM hero with the large wordmark centred over it.
- Film: Kling 3.0 image-to-video from THEIR p06 arrival still. Locked-off
  camera, only the world moves: wind in the moor grass, light drifting on the
  lake, clouds. Palindrome loop, ~8-10s, poster = the real p06 still.
  Reduced-motion and save-data get the still. (Signature-asset authorization;
  report spend after.)
- Wordmark: LAKEVIEW in Cabinet Grotesk, clamp(48px, 11vw, 180px), centred,
  painted #F4F6F5 under mix-blend difference so the film re-inks it (the MH
  chrome trick is a shared foundation, not the signature).
- Sub-line + one CTA (Request to book). Max 4 hero text elements.

## Palette (sampled from their photos, 2026-08-04)
- `--lv-c`    #E9EDEE  lake-mist canvas (from p03/p06 sky-water lights)
- `--lv-ink`  #26221F  peat-timber ink (from p06 shadows)
- `--lv-moss` #8A6440  moss brown (from p06 #916644 / p03 #946B45)
- `--lv-gold` #C8964F  sunset-on-the-pool gold (from p03 #D0A161) — THE accent
- `--lv-lake` #5E7CA0  lake blue (from p06) — rationed second tone
- `--lv-night` #171A20 the aurora section ground (from p12 #1C1B1E)
Accent-text variant for AA on light canvas: #7A5525. No beige+brass family:
canvas is cool lake-mist, not cream.

## Type (from ~/Design fonts/, Icelandic coverage verified at build)
- Display: **Cabinet Grotesk** (700/500) — modern-warm geometry, turf-house
  modernism. Leading ≥1.12 on multi-line with Í/Á; .2em mask headroom.
- Body: **Author** (400/300) — humanist warmth, 1.6 leading.
- Facts/labels: **Basier Mono** — check-in, distances, review counts.

## Structure (10 sections, 4+ layout families)
1. Loader → FILM HERO (wordmark over film; sub + CTA)
2. Manifesto: "Torfbær, sextíu árum síðar." + AD credit line (honest, from
   the listing highlight) + p23 gable frame.
3. FINDING THE HOUSE — signature scroll device: pinned section opens
   full-bleed on p21's moss TEXTURE (zoomed in), scroll pulls back/scales the
   aerial out until the turf roof and path resolve; caption lands "Þakið er
   úr landinu." Clip+transform only, DPR-capped canvas not needed (single
   image transform scrub).
4. THE THREE WATERS — interactive triptych (the page's interaction class):
   Vatnið (lake, p06 crop) / Laugin (geothermal pool, p03; winter twin p24 on
   toggle) / Baðið (tub at the glass, p28 or p19). Hover (fine pointers) or
   tap swaps the live pane; the two idle panes compress (horizontal accordion,
   flex-basis transition). NO invented temperatures. Honest one-liners only.
5. Inside: p01 (bed + tub under the gable) full-bleed; p12 kitchen/fireplace;
   drift frames (Heklusýn spec, derived --dz).
6. Night: ground eases to --lv-night for ONE section (not a page-wide scrub —
   that is Mirror House's spine, not ours): p05 aurora from bed + Tom's
   review line. Ground returns after.
7. The Golden Circle: their real geography as a quiet list — Gullfoss /
   Geysir / Þingvellir "short drive" (their words), Kerið + Friðheimar (from
   guest reviews), 45 min from Reykjavík, 15 min from Selfoss. No invented
   distances.
8. Guests: 4.96 / 207 reviews / Top 5% (their badges); themes View 97 · Hot
   tub 72 · Location 64; quotes Kim (Apr 2026), Tom (Nov 2025), Lucie (Feb
   2026). Attribution exactly as Airbnb shows.
9. Booking: request-to-book demo (no card, price comes with the reply) →
   demoStore (keys lakeview_demo_*) → /preview/lakeview/stjornbord dashboard
   link in an owner-note.
10. Footer facts: host "Visiting Iceland" (Ómar), Superhost, 5 years,
   Úlfljótsvatn, check-in 15:00 / out 11:00. NO licence number (none
   displayed on the listing — do not invent).

## Motion identity (ONE per site): "waterline"
Images arrive by a rising waterline: clip-path inset from the bottom with a
soft feathered edge and a 2-3px settle ripple (translateY spring settle), and
blur falling away. Text rises through word masks (words, never chars). One
Lenis clock (wheel only, autoRaf false, woken by input events, never touch),
reads before writes, scrub reveals reversible. Reduced motion renders all.

## Guardrails
- Fact gate: every claim from the harvest JSON; grep claim words
  (fjölskyldu|síðan|ára reynsl|verðlaun) before QA. AD credit says exactly
  "Featured in Architectural Digest, July 2025" as the listing shows.
- Honest negatives available to the OWNER pitch, not on the page (wind noise,
  lukewarm winter pool).
- No em-dashes anywhere. Icelandic checked for gender agreement.
- a11y: AA everywhere incl. gold-on-mist (use #7A5525 text variant), focus
  visible, 44px targets, keyboard, `mh`-style focusin failsafe on scrubbed
  opacity.
- Page-scoped: all classes `lv-`, fluid unit --u on .lv-root only,
  page-local keyframes.
- noindex + JSON-LD LodgingBusiness + per-photo srcset (make -800 variants).
