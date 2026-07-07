# Ársól — Higgsfield image prompts (6 shots)

**Generate in the Higgsfield WEB APP only** (Seedream 4.5, **Unlimited toggle ON = 0 credits**).
Do NOT use the Higgsfield MCP — it always spends credits, even on unlimited models.

Drop the finished files into `public/arsol/` with the **exact filenames** below. Until they land the
page shows warm sunset-gradient placeholder frames, so it stays complete either way.

**Shared look for all six:** warm, bright, inviting — a small, clean, modern Icelandic tanning studio.
Warm sand / cream tones with a soft tangerine-to-coral sunset warmth; a whisper of the beds' UV glow is
fine but keep it warm, never cold clinical blue. Photoreal, natural soft light, shallow depth of field,
no text, no logos, no visible faces (or only softly out of focus). 16:9 unless noted.

| Filename | Aspect | Prompt |
|---|---|---|
| `hero-bed.jpg` | 4:3 | A modern LUXURA-style tanning bed, closed, in a clean minimalist salon room, warm morning light spilling across a sand-coloured wall, soft tangerine and coral reflections on the glossy white shell, calm and premium, a rolled fresh white towel resting on top, shallow depth of field, photoreal, inviting spa mood |
| `bed-x7.jpg` | 4:5 | Three-quarter view of a sleek modern LUXURA-style tanning bed in a bright clean studio, glossy white and silver shell with a subtle warm glow along the seam, warm sand wall behind, soft daylight, premium wellness product photography, vertical composition, photoreal |
| `bed-glow.jpg` | 3:2 | An open modern tanning bed seen from the foot, the tanning tubes glowing a warm amber-pink, gentle light washing over a clean white interior, cosy and premium not clinical, warm coral ambience, photoreal, shallow depth of field |
| `sauna.jpg` | 3:2 | Interior of a small infrared sauna cabin, warm honey-toned cedar wood panels, soft glowing infrared heaters, a folded towel on the bench, calm intimate wellness light, inviting and warm, photoreal, no people |
| `chair.jpg` | 3:2 | A modern black massage chair in a quiet calm corner of a small wellness studio, warm side light, a plant and a sand-coloured wall, soft shadows, relaxing premium mood, photoreal, no people |
| `interior.jpg` | 4:3 | Interior of a small welcoming Icelandic tanning studio reception, warm sand and cream tones, soft sunset-warm daylight through a window, clean minimal counter, a couple of plants, cosy and tidy, photoreal, no visible faces |

After the files are in `public/arsol/`: `npm run build` should stay green, then commit + push. The page
auto-swaps each gradient frame for the real photo as soon as its file exists — no code change needed.
