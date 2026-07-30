# Stitch prompt — paste this as your first message

---

You are designing a **single-page website** for **Sauðárkróksbakarí**, an Icelandic bakery founded in 1880 in Sauðárkrókur, North Iceland. The attached STITCH-HANDOFF.md contains every content string, palette token, constraint, and data item you need.

**Your job is to invent the entire visual experience from scratch.** Do not use any existing design I show you. Do not reach for a standard hero → cards → testimonials → CTA template. Build something that feels like it was made by one person who loves this bakery, not assembled from a UI kit.

---

## What to build

A complete HTML/CSS/JS single-page website (or React component — your choice). Include:

- All sections listed in the handoff: nav, hero, intro strip, product counter (horizontal scroll signature), heritage/history, cakes-to-order, reviews, find-us
- All copy exactly as written in Icelandic (it's already correct — do not translate or rewrite)
- All interactions: rotating ticker in hero, horizontal counter scroll, steam ornaments on hot items, animated open/closed badge, mobile sticky CTA bar, below-fold reveals
- Working anchors: `#bordid`, `#sagan`, `#finna`
- SVG abstract map with amber pin, NO real GPS coordinates anywhere

## What NOT to build

- **No photographs or real images** — use solid or gradient placeholder boxes at the correct aspect ratios (listed in the handoff)
- Do not use any icon library that requires installation (inline SVG only)
- Do not add any content not listed in the handoff

---

## The brief

**Mood:** The bakery has been on the same corner since 1880. The building burned in 1979 and was rebuilt. The oven is lit every morning before the town wakes up. You should be able to feel the warmth, the craft, the smell of bread, and the weight of 146 years in the design.

**Palette:** cream `#f6efe2`, paper `#efe4d0`, espresso ink `#2a1c12`, dark espresso `#3a2417`, warm brown `#8a4f1e`, brand amber `#e0892e`, amber text `#9c5413`, butter gold `#e8b95e`. No other hues.

**Type:**
- Display/headings: Young Serif (warm editorial serif) — use it at large sizes, it carries the 1880 weight
- Body: Hanken Grotesk (clean modern sans)
- Labels/stamps/mono: `font-family: ui-monospace, monospace` — tracking-wide, all-caps eyebrows

**The signature moment** is the product counter: on desktop, vertical scroll should smoothly drive a horizontal glide across 7 product cards — like walking slowly along the bakery display case. On mobile, it's a swipe carousel. The heading, progress bar, and item counter (01/07 etc.) float above the track.

**Break the template.** Make every section feel like it was considered on its own terms. Some ideas to explore (you don't have to use all of these):
- The hero could be type-led rather than image-led, with the `1880` year behaving as an architectural element
- The heritage timeline could be spatial or illustrated rather than a standard vertical list
- The stats could be typographically giant rather than card-grid
- The reviews could be editorial quote pull-outs rather than cards
- The find-us section could be bold and warm rather than utilitarian
- The navigation could have character — maybe a typeset logotype treatment rather than a utility bar

**Motion that earns its place:**
- Steam wisps on hot items (css animation, 3 strands, amber colored)
- Ticker that rotates "Ofninn er kveiktur / Snúðar beint úr ofninum / ..." in the hero
- Parallax on the hero image (scroll drives translateY, not opacity)
- Below-fold section reveals (IntersectionObserver + CSS transition, translateY 26px → 0, opacity 0 → 1)
- Animated pulse dot on the "open/closed" badge
- Animated `1880` progress/scroll bar in the counter section
- Smooth hover states on cards (lift + shadow + image zoom)

---

## Hard constraints (non-negotiable)

1. **No GPS coordinates** anywhere — no lat/lng in links, SVG text, data attributes. Map links use name+address search: `https://www.google.com/maps/search/?api=1&query=Sauðárkróksbakarí%2C%20Aðalgata%205%2C%20Sauðárkrókur`
2. **WCAG AA contrast** — all text 4.5:1 on its background (the palette is designed for this)
3. **No horizontal page overflow on mobile**
4. **Reduced motion** — all animations disabled/simplified under `prefers-reduced-motion: reduce`
5. **One `<h1>`** (hero), then `<h2>` per section — no skipping levels
6. **Min 44×44px touch targets**
7. Phone href: `tel:+3544555000`
8. Label sample data as `Sýnishorn` near prices and hours
9. Include a small `"Verð og tímar eru sýnishorn"` note near the product counter

---

## Technical approach (if React)

- Use synchronous passive `window.addEventListener('scroll', fn, { passive: true })` writing `element.style.transform` directly for scroll-driven effects — do NOT use Framer Motion `useScroll` (it stalls)
- Use `IntersectionObserver` for below-fold reveals — do NOT use Framer `whileInView`
- Pinned horizontal counter: outer section `height: 320vh`, inner wrapper `position: sticky; top: 0; height: 100vh; overflow: hidden`, track `display: flex` with `transform: translateX(...)` driven by scroll
- Gate the pinned behavior on `window.matchMedia('(min-width: 768px) and (pointer: fine)')` — touch/mobile gets `overflow-x-auto snap-x snap-mandatory` carousel
- Avoid `Date.now()` or `Math.random()` in scroll handlers

---

Start by designing the layout. Then build the HTML/CSS/JS. Ship one complete file.
