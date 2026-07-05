# Higgsfield brief — K11 "turning on" hero video + stills

Goal: one 8-10 s, loopable, 16:9 (1920x1080) clip of the K11 Air Loft
in a pitch-dark room, LED seams flickering to life like fluorescent tubes.
It becomes the hero background. The site is already wired for it:
drop the file in as `uploads/k11.mp4` and tell Claude — it gets copied to
`assets/k11.mp4` and the CSS-staged ignition fades out automatically.

## Step 1 — generate the still first (image gen, then image-to-video)
AI video holds product geometry MUCH better when it starts from a locked
first frame. Generate the still, pick the best of 4, then animate it.

Image prompt (paste):
"Wide cinematic product photograph of a futuristic white tanning bed with
a closed clamshell canopy (KBL K11 Air Loft style) centered in a completely
dark showroom. Thin cool-white LED seam along the canopy edge, unlit.
Very low ambient light, deep plum-black room (#12051C), dark reflective
floor, faint volumetric haze, no people, no text, no windows.
Photorealistic, 35mm, f2.8, 8k."

Negative / avoid: people, hands, text, logos, extra machines, bright room,
windows, daylight.

## Step 2 — animate it (image-to-video, start frame = the still)
Video prompt (paste):
"Camera locked off, or an extremely slow 5% push-in. The room starts almost
black. At the 1 second mark the bed's LED seam flickers like an old
fluorescent tube: one failed strike, a stutter, then full ignition.
Soft magenta-pink light blooms from the seam, a thin reflection appears
on the dark floor, faint haze drifts. No people. The final 2 seconds are
completely steady and match the fully-lit state. Seamless loop."

Settings: 8-10 s · 1080p (or upscale pass) · highest bitrate MP4 (H.264)
· ideally under ~20 MB. Generate 3-4 takes, pick the one where the bed
geometry never warps.

## Why this reads as realistic
- Locked camera: AI artifacts live in camera motion. Darkness hides the rest.
- Flicker at ~1 s: the site syncs its own tube-strike and headline ignition
  to that beat, so the page and the film ignite together.
- Steady lit ending: lets the site hold the last frame or loop cleanly.
  (If the loop pops, Claude can hold the final frame instead of looping.)
- The site adds film grain + a darkening scrim on top, which masks
  compression and upscaling artifacts at full-bleed.

## Optional extra stills (image gen, same style family)
1. Macro detail of the lit LED seam edge (used in the K11 chapter).
2. 9:16 vertical crop of the hero still (mobile poster).
Keep them as ambience/product renders only — no fake salon interiors
presented as the real stofa, no AI people, no invented UI on the bed.

## Honesty guardrail
The clip illustrates the K11 product. Do not add on-screen claims inside
the video (text burned into AI video drifts and misspells). All copy stays
in HTML.
