# Eldofninn — pending photos

The hero pizza (whole + 8-slice spin/explode animation, corner garnish) is intentionally the SAME
real photo flatbakan uses — reused unchanged per the brief ("keep the 3D pizza image"), since
recreating an equivalent clean 8-wedge flatlay is real photography work this pass skipped.

The 4 "Vinsælustu pizzurnar" menu cards currently all reuse that same hero photo as a placeholder
(see `data.ts` — `IMG.boltada/dodlada/sterka/peppada` all point at `pizza-whole.webp`). Replace them
with real shots of Eldofninn's actual named dishes before this goes out to the client.

**Do NOT generate via the Higgsfield MCP tool — it always spends credits.** Generate these in the
Higgsfield **web app** (higgsfield.ai) with the Unlimited toggle ON, model **Seedream 4.5** (4K,
photoreal, matches the hero's realism). Paste the resulting URLs back and they'll be imported free
via `media_import_url`.

Shoot list (overhead flatlay, same lighting/crop logic as the hero pizza so cards feel consistent —
warm wood-fired crust with leopard-spotting, shot from directly above on a plain dark surface):

1. **Eldofninn** (house special) — jalapeño, mixed olives, green peppercorn, pepper cheese melted
   through. File: `pizza-eldofninn.jpg`.
2. **Pepperóní Trio** — pepperoni, mushrooms, cream cheese dolloped between the pepperoni. File:
   `pizza-pepperoni-trio.jpg`.
3. **Hawaii Special** — ham, mushrooms, pineapple, classic golden-brown bake. File:
   `pizza-hawaii-special.jpg`.
4. **Vegetar** — plum tomatoes, peppers, red onion, mushrooms, cracked black pepper, no meat. File:
   `pizza-vegetar.jpg`.

Drop the 4 files into `public/img/eldofninn/`, then in `data.ts` point `IMG.boltada/dodlada/sterka/
peppada` at the new filenames (or rename the IMG keys to match — they're currently named after
flatbakan's originals, purely vestigial).
