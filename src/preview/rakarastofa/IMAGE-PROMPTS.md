# Rakarastofa — ONE hero image: the neon Barber Shop sign

**Generate in the Higgsfield WEB APP only** (Unlimited toggle ON = 0 credits). Do NOT use the MCP.

**Goal:** the neon "Barber Shop" sign from the reference photo, but isolated on a **pure solid black
background** (no barbershop interior, no window, no people). It's generated on black so the page can
**screen-blend** it — the site's own charcoal (#0C0B0A) becomes the exact background, with the neon
glowing over it and zero seam.

Save the result as **`public/rakarastofa/hero.jpg`**. That's the only generated image; the real 1948
photo (`heritage-1948.jpg`) is already in place.

## Best method — image-to-image from the reference (keeps the exact sign + legible text)
Upload the reference photo as the image input (use an edit model — **Nano Banana Pro / Nano Banana 2**,
or **Seedream 4.5**), aspect ratio **16:9**, with this prompt:

```
Keep this exact neon barbershop sign — the blue neon scissors, the blue neon cursive word "Barber", and the red neon block letters "SHOP" — completely unchanged. Replace the entire background with pure solid black (#000000). Remove the barbershop interior, the people, the window frame, the plant and all reflections. Isolate only the glowing neon sign, keeping its realistic glass tubes, mounts, chains and soft colored glow. Centered composition with generous black space around the sign. Photoreal, cinematic, high detail. No extra text.
```

## Alternative — text-to-image (if you'd rather not upload the reference)
Seedream 4.5, **16:9**:

```
A photorealistic neon barbershop sign glowing in the dark, isolated on a pure solid black background. At the top, an open pair of scissors in bright cyan-blue neon tubes. Below it, the word "Barber" in glowing blue neon cursive script. Below that, the word "SHOP" in bold red-pink neon block capital letters. Realistic glass neon tubes with visible mounts and hanging chains, soft colored glow and bloom around the letters. Centered, with generous empty black space around the sign. No window, no interior, no people, no reflections, no extra text. Photoreal, cinematic, high detail.
```

**Notes**
- Text in AI neon can garble — the image-to-image method is more reliable because it preserves the real
  sign. Generate a couple and pick the one with the cleanest "Barber" / "SHOP".
- Colours match the reference (blue + red). If you'd rather it read warmer/on-brand, say so and I'll adapt.
- Drop the file in `public/rakarastofa/hero.jpg` and ping me — I'll verify the screen-blend, fine-tune the
  hero text placement over the sign, and confirm the exact-background match.
