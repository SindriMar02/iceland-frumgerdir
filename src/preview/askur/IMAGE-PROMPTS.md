# Askur Pizzeria — assets

This is the first pizza-clone that reuses the client's OWN branding heavily, because Askur already
has good assets:

- **Logo** — their real monoline pictogram wordmark (`logo.png`, white-on-transparent) is used
  directly, not replaced with an in-code silhouette. In the nav it sits on the amber hero so it is
  CSS-filtered to near-black (`filter:brightness(0)`) to read against the orange; the footer uses the
  raw white version on dark.
- **Menu-card photos** — all 4 are real individual pizzas cropped from Askur's own overhead
  grid shot (`grid.webp`). Real pizzas of theirs; the topping match to each name is sensible, not
  guaranteed exact (same standard as Pizzasmiðjan).
- **Cinematic section** — the full overhead grid shot drives the Ken-Burns "Borðið dekkað" feature.
- **Story section** — their real interior photo (mountain mural + Edison bulbs, `interior.webp`).

## The one placeholder to disclose in outreach
The spinning **hero pizza** (whole + 8 slices) is the SAME shared Higgsfield-cut asset the sibling
pages use — it is NOT a photo of Askur's own pizza. The outreach email MUST say so plainly ("the
pizza spinning at the top is a placeholder, not your own pizza — we swap it the moment we get real
photos"), exactly like the Eldofninn / Pizzasmiðjan sends.

If Askur wants their own pizza spinning in that hero slot: it needs an overhead flatlay of one whole
pizza on the exact hero orange (`#F19C2C`) or a colour-matched background, then a clean 8-wedge cut
(see the flatbakan `recut_exact.py` pattern). Generate via the Higgsfield **web app** (Unlimited
toggle ON, Seedream 4.5) — never the MCP tool (always spends credits).

## The video question (Sindri asked for "images/videos")
The cinematic overhead-grid section uses a CSS Ken-Burns (slow scale/pan) on their real photo, which
reads as cinematic motion with zero video weight and zero generation cost. If you want an ACTUAL
moving-video hero (e.g. a slow push-in over the pizzas, or steam rising), that's a real video-gen
job: do it in the Higgsfield **web app** with an unlimited video model (Kling 3.0 on annual Ultra),
feed it one of their real stills, then import the result — do NOT call the video MCP tools (Seedance
−45 credits, Kling via MCP −6 to −30). Flag me the model + cost before any credit spend.
