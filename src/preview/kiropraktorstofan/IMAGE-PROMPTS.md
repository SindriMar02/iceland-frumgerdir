# Image prompts: kiropraktorstofan ("Fyrsta leyfið")

No usable photography exists anywhere on kiropraktorstofan.is or elsewhere for this
practice (verified during the build). The page ships today with intentional
gradient/texture fallbacks (see `Plate` in `Page.tsx`) so it is fully readable and
complete with zero images. These three SIGNATURE plates are the only image slots on
the page. Abstract/sculptural imagery ONLY, no invented "clinic photos," no people's
faces, no readable text or logos in-frame. Generate at the exact filenames below and
drop them into `public/kiropraktorstofan/`; the `<img>` in each `Plate` will fade in
over the fallback automatically, no code changes needed.

Recommended model: Seedream 4.5 or Nano Banana Pro (unlimited web-app route), warm
photoreal / editorial-still-life direction, not illustration.

## 1. `leyfid-monument.jpg`: Kafli III, "Leyfið" (the licence, the monument moment)

Aspect ratio 4:3. Placement: centred plate in the Kafli III chapter head, on a deep
ink-blue ground (#1D3557 / #12233F).

Prompt: "A macro still life on a dark walnut desk in low warm side light: a single
sheet of heavy cream official paper, slightly curled at one corner, resting
half in shadow. On the paper, only the soft out-of-focus impression of an old
rubber ink stamp in deep prussian blue, no legible letters or numbers. A vintage
fountain pen rests diagonally across the near corner, its nib catching a thin
highlight. Warm desk-lamp light on one side, cool blue-black shadow on the
other. Shallow depth of field, archival document photography, no people, no
logos, no readable text anywhere in frame."

## 2. `1977-kyrralif.jpg`: Kafli II, "Stofan opnar" (the 1977 opening)

Aspect ratio 3:4. Placement: centred plate in the Kafli II chapter head, warm kraft
paper ground (#E7DCC0).

Prompt: "An archival-toned still life evoking 1977: a small brass door bell and a
blank paper name plate on a narrow varnished-wood reception desk, a black
rotary telephone handset just entering the frame at the edge, out of focus.
Warm Kodachrome-era colour grade, muted ochre and forest tones, soft natural
film grain, gentle vignette. No readable text on the name plate. No people."

## 3. `hendur-medferd.jpg`: Kafli IV, "Meðferðin" (the treatment, today)

Aspect ratio 4:5. Placement: centred plate in the Kafli IV chapter head, warm paper
ground (#FBF8EF / #F2ECDD).

Prompt: "An extreme close-up macro of a pair of hands, older but steady, resting
with quiet precision at the edge of a paper-covered treatment table. Warm
directional window light falls from the left across the linen and paper
texture, soft deep shadow to the right. No patient visible, no face in frame,
just the hands and the table's edge. Contemplative, clinical stillness, shallow
depth of field, true-to-life colour, no text, no logos."

## Notes for whoever generates these

- Keep the same warm/cool split across the set: #1 and #2 stay warm-toned
  (paper, brass, ochre), #1 sits on the one deliberately dark chapter so its own
  still life should read cooler (ink blue, not warm) to match that chapter's ground.
- None of these should look like stock "chiropractic clinic" photography. If a
  draft comes back looking like a treatment room, a spine model, or a smiling
  patient, it has drifted from the brief, regenerate.
- Once dropped in, spot-check at 375px and 1440px that the `Plate` crop (object-fit:
  cover) still reads correctly at each aspect ratio above.
