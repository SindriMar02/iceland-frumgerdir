# Samhentir: design brief (locked before building, 2026-10-14)

Route `/preview/samhentir` (+ `/velar`, `/velar/<9 families>`, `/atvinnugreinar/<8 industries>`, `/merkingar`,
`/thjonusta`, `/fyrirspurn`). Built on a copy of the Matvélar engine (Matvélar's files untouched).

**One idea:** *Ein lína, eitt hús.* One salmon fillet travels one drawn line and every station is something the
group sells: cutter (Samhentir), multihead weigher (Plastco), tray sealer with tray and film (Plastco), labeller and
label (Vörumerking, Plastco), case erector and carton (Samhentir, Formar), pallet wrapper and stretch film
(Samhentir, Plastco). The panel names the company that owns each step.

**Material:** one-colour print on white board, like their own white boxes printed in one blue.
- Board `#fafbfc` (page), paper `#fff` (cards), navy ink `#191847` (text, from their CSS), navy `#14133b` (footer),
  the one ink `#284195` (their logo blue): buttons, lit machine, panels, labels in the drawing, the closing block.
- Kraft (`#e4c89e` family) and salmon (`#f6a07a` family) exist only inside the drawing.
- Corners 2px everywhere (square, like board). Shadows only as a 1px ring plus at most an 8px blur.

**Type:** Martian Grotesk Standard 400/500/700 (text), Martian Grotesk Wide 500/700 (display: the width system Univers
is known for; Univers is their brand face), Martian Mono 400 (labels). All OFL, Icelandic glyphs checked. Display
letter-spacing floor -0.04em. Floors: body 15px, labels 12px, inputs 16px, tap targets 44px.

**Signature devices:**
- Hero: the flute field, a canvas cross-section of stacked corrugated board (liner, fluting, liner) in the one ink;
  layers drift, a few flutes ink themselves in full blue, the board presses flat under a fine pointer. Pause control.
- Divider: two squares of their mark meeting, one with the quarter-circle bite.
- The pinned line (engine 8.5): six stations, scrubbed camera, word swap, company badge, dot progress.
- Industries: a kraft carton with the blue band drops onto a pallet (engine 8.7).
- Close on their blue with the line field (engine 8.10) in white.

**Content rule:** their words (samhentir.is, plastco.is, vorumerking.is, formar.is, their 9 Oct 2026 article).
No prices, capacities or specs. Model names are Plastco's catalogue; makers named only where Plastco names them.
Fixes to their spelling are marked `[lagað]` in data.ts.

**The job:** one request with five ways in (packaging, new machine, machine in use, labels, not sure); each brief names
the department and inbox it goes to. Service carries Plastco's own fields (hardware/software, service contract and
number). Enquiry list for families, models and industry products. Nothing is sent from the prototype.

**Declared deviations from the engine:** light theme; flute field instead of streams; banner collapse is a transform
(the bar follows by the banner's measured height); dropdown and drawer enter with `@starting-style`; no Lenis.
