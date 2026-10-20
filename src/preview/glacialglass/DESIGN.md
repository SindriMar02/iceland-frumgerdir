# Design System: Glacial Glass Cabin — "Ein nótt" (Mirror House system)

Sindri, 2026-10-20: this cabin gets "the PERFECTED AND SAME END TO END design as
mirror house". So the spec is `../mirrorhouse/DESIGN.md`: tokens, type, dials
(VARIANCE 7 · MOTION 8 · DENSITY 3), the devices and every engineering rule. This
file records only what differs and why.

## Same, on purpose
- Scroll is one night: ice `#E9EFF3` → basalt `#0A121B`, the same six STOPS, one
  writer, `.gg-night` flips color-scheme and theme-color.
- Seam-reveal wordmark: a 1px rule draws, **GLACIAL** opens leftward and **GLASS**
  rightward out of it, expo.out 1.5s with the 26px outward push, chained off
  `gg:revealed` from the preloader.
- The film as a canvas frame sequence (121 frames), loaded unconditionally from a
  module-scope function 700ms after mount, `decode()` before a frame counts,
  14-wide pump, nearest-frame fallback, DPR cap 1.5, drift paused during the pin.
- Switzer + Fragment Mono, Aurora `#57BE8C` as the one accent.

## Different, and why
- **The film is a push-in, like Mirror House's.** Kling 3.0 PRO (1080p, sound off):
  start = their daylight shot of the mirror box on its ridge under Búrfell, end =
  their aurora photo of the same box from below. The camera pushes in, arcs to the
  glass and tilts up while day becomes aurora. Two earlier locked-off "view from
  the hot tub" runs were discarded (std mode = 720p, soft; and flat next to MH).
  Frame tiers: 828w phones, 1200w desktop, 1440w for screens ≥1400px.
- **Photos:** 28 Booking.com originals (2048px). The four full-bleed shots (hero,
  interior, evening, aurora) are 4K AI upscales served at 2560: the drift overscan
  paints the hero ~2400px wide on a big screen. srcset carries 800/1440/full.
- **The wordmark moves into the header.** GLACIAL is two letters longer than GLASS,
  so the LOCKUP is centred (not the seam). It rests in the sky band
  (`top: max(15svh, 96px)`), Switzer 300 not 200. With motion on it is
  `position: fixed`, and one scrubbed timeline carries it up and scales it to the
  header mark's own font size over 1.6x the distance (it drifts slower than the
  page), seam fading. It IS the header mark: the nav link in the centre column is
  transparent and only keeps the click target and name. No swap, nothing to jump.
- **Chrome legibility over photography.** Difference blending cancels on mid-grey
  (measured: the moor is ~100-130/255). While the hero photo or the film is under
  the header, the chrome is painted solid (basalt over the sky, near-white once a
  strong top scrim is past half), then hands back to the MH invert on the flat page.
- **Hero copy** at weight 400 with a soft shadow, a deeper bottom wash.
- **Honesty lines** from reviews: follow the hosts' directions, not the map pin;
  gravel track; 4x4 when it snows. No host name on the page. Airbnb 4.94/112 and
  Booking 9.1/32 shown separately. Never: "featured in Architectural Digest"
  (unverified), prices. The film is disclosed as generated in the footer.
