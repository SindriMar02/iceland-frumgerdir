# REFERENCE STUDY (full)

# Reference Study — Two Premium Playbooks for the Next Icelandic SMB Redesigns

How to use this doc: Sections A and B are the two source machines taken apart to the screw. Section C is what they share (the transferable "why it feels expensive"). Section D is the pick-and-mix menu you actually build from. Section E tells you which half of the doc to open depending on whether the candidate is a stay or a shop, plus the specific ways each one goes wrong. Everything is written to be lifted into a build, not admired.

---

## A. THE BUCKSSAUCE PLAYBOOK — premium single-brand ecommerce

**Essence:** a dark, warm "craft-workshop meets spec-sheet" shop that turns a $12 bottle into a hero object. The premium signal is *invented physical-product language + choreographed load-bearing motion + two-color discipline*, not budget. This is the template for any single-maker Icelandic product brand (wool, chocolate, skyr, knives, salt, beer, ceramics) with 1–10 SKUs.

### A1. Color — disciplined two-color + per-product accent
- Base: warm near-black espresso `#100B06`. Not cold luxury black — reads like grill smoke / butcher paper.
- Primary text + UI: parchment cream `#F5E4C7`. Cream and dark **invert constantly** (cream pills on dark, dark text on cream hang-tags).
- One deliberate pop: amber/gold on a single highlighted phrase per line (`"...ENDING BORING BBQ."` amber, rest cream).
- **The merchandising move:** each product sits on its **own full-bleed flavor-keyed background color** (mustard-gold, habanero-orange, cherry-red). Color itself does the selling as you scroll between products.
- Saturated warmth comes from *photography* (glazed dripping food, whole peppers/cherries), never from UI chrome.

**Iceland re-key:** espresso base + wool-cream, then per-product panels keyed to the material — natural wool greys/heather, oxidised-silver charcoal, rye/sourdough brown, birch-smoke, lava-rust, angelica-green.

### A2. Type — one characterful uppercase display, three treatments, over a quiet body
- Display: a custom-named characterful condiment-label sans ("PeperoncinoSansCustom"), **always uppercase**, weight 400, 24px labels → 52–60px H1/H2. It is the brand voice made visible.
- Three treatments carry the whole "designed not generated" feel:
  1. **Solid fill** (buttons, product names)
  2. **Giant OUTLINE / stroke-only** (section titles `WEAPON`, `REVIEWS`, hollow numerals `01`)
  3. **Arched-on-a-curve** (the "WHY BUCKS SAUCE" badge)
- Body: Inter Tight (400/500/700), deliberately quiet, for descriptions + tiny 16px tracked eyebrows.
- Dramatic size contrast: 16px eyebrow directly under a 40–60px display word.
- Signature detail: numerals set as **hollow outlined figures with a dashed measuring-tape rule** through them.

**Iceland re-key:** pull the display face from the owned library (Projekt Blackbird / Bricolage-class display with full Icelandic caps) + Inter Tight body. The outline + arched treatments alone make a page look art-directed. Use uppercase display sparingly enough that Icelandic diacritics stay legible.

### A3. The invented "physical object" design language (the real premium engine)
Every element belongs to one imagined physical catalog: **laminated hang-tags with two punched holes**, dashed spec-sheet borders, tape-measure rules, hollow ruler numerals, line-icon badges, a tone-on-tone antler pattern. It reads like a considered product catalog, not a web template.

**This is the single most transferable idea in the whole doc.** Invent ONE object language per brand and apply it to *everything* (nav, tags, dividers, numerals, testimonial cards, footer):
- Wool shop → knitting-chart grids, yarn swing-tickets, stitch-count numerals, needle-gauge rules.
- Jewelry → jeweler's-loupe circles, hallmark stamps, ring-size gauge.
- Bakery → order-ticket stubs, gram/weight spec labels, queue-number tags.
- Salt/seasoning → apothecary spec cards, mineral-assay stamps.

### A4. Motion system — nine choreographed, load-bearing moves (no autoplay video anywhere)
Motion is code/canvas/scroll-driven, which keeps it fast and dodges in-app-browser resize. The nine:

1. **Branded clip-path preloader.** Fixed `h-dvh z-9999` overlay with `clip-path:inset(0)`; stag logo on black, real cut-out ingredients floating in; a 3-dot loading keyframe; then a clip-path wipe reveals the hero. Sets tone before any content. (Use `100svh`, not `100vh`.)
2. **Floating produce on canvas.** Five `<canvas>` elements drift/bob real ingredient cut-outs, parallaxing around the bottle. Perpetual physics-y float, not static PNGs.
3. **Pinned spec-tag section.** GSAP ScrollTrigger **pin** (2,356px pin-spacer) holds a laminated hang-tag card while scroll swaps it through 4 claims (NO CORN SYRUP → NO SEED OILS → NO ADDITIVES → GLUTEN FREE); each state swaps icon + copy while photographic ingredients bleed in from the margins. Scroll scrubs a slideshow. **This is the banned-formula killer — the section IS the concept.**
4. **Giant hollow outline titles parallaxing behind a fixed pill nav.** Section titles scroll *under* the permanently floating nav → real editorial depth.
5. **Per-flavor color-panel product sequence.** Each sauce on its own full-height flavor-colored panel (bottle + line-art antlers halo + floating fruit); panel background + product crossfade as you move between flavors.
6. **Letter-spaced marquees** (`W H Y  B U C K S  S A U C E`, `B U I L T  O N  F I R E`).
7. **Ruler/tape-measure numbered slider** for "why us" proof points — giant outlined `01/02/03` on a dashed rule, circular prev/next arrows, punched hang-tag pill label. Replaces the banned 3-card grid.
8. **Testimonial slider** as tagged cards — reviewer name in a hang-tag pill, big quote glyph, tone-on-tone antler pattern.
9. **Micro-interactions.** Add-to-cart state machine ADD → ADDING → ADDED; slide-out cart drawer with friendly empty state; hamburger → full menu overlay with dimmed backdrop (`bg-background/65`).

### A5. Commerce mechanics (copy wholesale for any small-SKU shop)
- Each product gets a **full-height flavor-colored showcase panel** with dual CTA: solid "ADD TO CART $12.00" pill + outline "VIEW PRODUCT ↗" pill.
- PDP: benefit headline → spec list (TASTE PROFILE) → "PAIRS WITH" → 4 dietary badge icons → buy box (size selector 1/3/6-pack that **live-updates price** + qty stepper + add-to-cart) → long description → INGREDIENTS/NUTRITION **styled tabs with a real facts panel** → cross-sell row → bundle module.
- **Add-to-cart state machine** ADD → ADDING → ADDED.
- **Slide-out cart drawer:** `cart(0)` counter, friendly empty state ("ADD SOME SAUCE"), PROCEED TO CHECKOUT. Persisted client-side (Zustand → `localStorage 'cart-storage'`).
- **Checkout = hosted handoff** (Shopify signatures in markup). No on-site card entry. *Never rebuild a payment backend.*
- **Bundles for AOV:** 3-PACK / 6-PACK tab toggle, clear savings ($32 vs 3×$12).
- Trust stack: testimonial slider mixing customers + @-handle creators, an award mention, founder credibility ("20+ years / Chef Doug"), clean-label badges, newsletter ("JOIN THE BUCKS CLUB").
- **Design the boring parts:** ingredient list / nutrition / care label rendered as craft, with a cheeky headline ("PURE AF. SERIOUSLY"). Transparency = premium.

### A6. Copy voice
Irreverent, cocky, funny, opinionated small-maker — trash-talks the category but backs it with clean-label substance. Headlines are jokes with a claim inside ("THE BBQ SAUCE THAT MAKES OTHER SAUCES INSECURE", "CHOOSE YOUR WEAPON"). Second-person, short punchy fragments, heavy uppercase, zero corporate hedging. Reads like a person, not a brand deck — that *is* the authenticity play. Founder page as its own experience ("MEET CHEF DOUG": oversized outlined name, adjective marquee, one punchy origin paragraph).

### A7. Canonical section order (Bucks)
Preloader → fixed floating pill nav → hero product carousel (spotlight disc + arrows) → brand statement one-liner → **pinned spec-tag clean-label section** → "CHOOSE YOUR WEAPON" per-flavor showcase → "WHY BUCKS" arched badge + tape-measure slider → bundle module (3/6-pack toggle) → full-bleed lifestyle food photo → "REVIEWS" tagged slider → footer + newsletter.

---

## B. THE BALLENACABO PLAYBOOK — editorial hotel/guesthouse (the sleek-scroll reference)

**Essence:** a cream-and-ink, all-sans editorial site where a gated cinematic preloader, buttery Lenis inertia, word-by-word masked title reveals, and scrubbed image parallax turn ordinary photography into a slow, expensive mood film. Booking is a lightweight handoff. **Premium = pacing + restraint, not a pile of tricks.** (Source is actually the Ballena *restaurant*, Grupo Hunan — but the scroll craft is exactly the guesthouse reference class.)

### B1. The four-part motion system — deep, and buildable (all confirmed in the theme JS)

This is the heart of the "sleek feel" and the reason this section is the longest. It is framework-light and matches our stack.

**1) Lenis smooth scroll — the base layer, ~half the expensive feel.**
```js
const lenis = new Lenis({ lerp: 0.075, duration: 1.4 });
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);   // keep parallax frame-synced
```
Every scroll input is interpolated with heavy inertia; the page glides and eases to a stop instead of snapping. This alone does most of the work.

**2) Split-word masked title reveals on every h1/h2/h3.**
Wrap each word in an `overflow:hidden` mask span, start `yPercent:110` (hidden below the line), then on scroll the words rise into place one after another:
```js
// standard heading
gsap.to(words, {
  yPercent: 0, duration: 1, ease: 'power3.out', stagger: 0.04,
  scrollTrigger: { trigger: heading, start: 'top 92%', once: true }
});
// hero is the richer variant:
gsap.to(heroWords, { yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: { amount: 0.4 } });
```

**3) Two distinct image behaviors — by block type. This is the trick most builds miss.**
- (a) **Scrubbed parallax** on full-bleed hero / landscape / CTA bands: pre-scale the image to `1.15`, then drift it the whole time it's on screen — a fixed-background depth feel *without* `position:fixed`:
```js
gsap.fromTo(img, { yPercent: -8 }, {
  yPercent: 8, ease: 'none',
  scrollTrigger: { trigger: block, start: 'top bottom', end: 'bottom top', scrub: true }
});
```
- (b) **Scale-settle arrival** on all other photos: parent `overflow:hidden`, media `scale:1.05 → 1` on enter:
```js
gsap.fromTo(media, { scale: 1.05 }, {
  scale: 1, duration: 1.4, ease: 'power2.out',
  scrollTrigger: { trigger: frame, start: 'top 95%', once: true }
});
```
- Hero background additionally pushes in `scale 1.15 → 1` over 2s on load (`power2.out`).

**4) Swup page transitions — makes multi-page nav feel app-like.**
Swaps only `#main` with a CSS fade; persists block CSS via the head-plugin; scrolls to top; re-inits block scripts and rebuilds only `#main`-scoped ScrollTriggers; **waits for the new page's images to load (3s cap) before fading in** — never a half-loaded page; Lenis pauses during the swap. This is the single biggest "a real studio built it" upgrade over a normal WP/SPA for image-heavy multi-page stays (rooms / land / food / contact).

**Easing discipline unifies everything:** almost every tween is `power2/3/4-out`, and every CSS transition is the token `--transition: 0.3s cubic-bezier(0.16,1,0.3,1)` (expo-out — fast start, long slow finish = weight/quality). Consistent expo-out across the whole site is a cheap unifying premium signal.

**Note what is deliberately ABSENT:** no pinning, no horizontal-scroll hijack, no number counters, no crossfade carousels on the homepage. Restraint is the point.

### B2. The gated cinematic preloader (the signature "wow")
Full-viewport cream layer, centered logotype flanked by a two-word tagline split left/right. GSAP timeline: (1) the two tagline halves slide apart on X (±20px), (2) logo wrapper opens `width 4px → auto`, (3) logo text mask-reveals down (`yPercent -120 → 0`), hold 500ms, then everything slides back into its masks and the cream layer clip-paths away upward (`inset(0) → inset(100% 0 0 0)`). Fires a `preloaderComplete` event that **gates** the hero/header entrance, so the first three seconds are art-directed instead of a flash of unstyled content. Doubles as honest cover for loading big hero media. Cheap to build, hugely premium.

### B3. Color — warm natural, NOT dark luxury
- Base cream/bone `#F8F2E5`; ink `#03090D` (a very dark blue-black, not pure black).
- Three restrained naturalistic accents used *sparingly*: terracotta `#C2644F` (primary accent), sage `#779580`, dusty sky-blue `#83A9D0`; plus white, warm stone grey `#D3CFC5`, ink-at-38% `#03090D60` for hairlines.
- In practice the page is overwhelmingly **cream + ink**, earth tones as seasoning. High warmth, low saturation, sunlit. Deliberately avoids black+gold clichés.

**Iceland re-key:** keep cream base + ink discipline; swap the three accents for Icelandic-earth — wool-cream, basalt ink, moss green, glacier blue, lava rust.

### B4. Type — all-sans, no serif, premium via scale + spacing + restraint
- Display: a wide, refined, faintly Art-Deco geometric sans (Sweet Sans Pro), self-hosted.
- Body/UI: a clean humanist grotesque (TT Commons Pro), self-hosted.
- **Fluid ratio-locked scale:** `clamp()` + an "ideal container" unit drives `title-xl → title-l → title-m → title-sm → paragraph-l → eyebrow`, so titles stay proportionally huge and calm from phone to 1920px. Solves "headline too small on mobile / too huge on 4K" in one variable.
- **Signature move:** a tiny UPPERCASE tracked eyebrow above a very large mixed-case light/medium title. Maximum contrast, minimum shouting.
- Real licensed faces self-hosted via `@font-face` — the template tells are absent. Use our owned font library; skip the dark-luxury serif reflex entirely.

### B5. Section rhythm (use this instead of hero→cards→testimonials)
Repeating editorial band: **tiny tracked-caps eyebrow → oversized quiet title → one short lyrical paragraph → understated text-link CTA**, as alternating asymmetric text/image bands, with full-bleed parallax breathers between. Maps cleanly onto rooms / food / the land / the hosts.

Canonical order (Ballena): preloader → fixed header (logo + single BOOK NOW pill + hamburger→full-screen overlay) → full-bleed hero (drone photo, brand line) → editorial "concept" intro → menu/feature split with Swiper slider → **full-bleed parallax breather band** → two-column about beat → media-intro card grid (portrait crops routing to secondary journeys) → contact & location card (hours/phone/address/map + book-bar) → footer (newsletter + nav + brand-group credibility).

### B6. Booking = lightweight handoff (correct pattern for small hospitality)
- One persistent primary CTA: a **BOOK NOW pill in the fixed header**, present on every page/scroll position.
- It links out to the real engine (Ballena → OpenTable). The whole transaction (dates, party size, confirmation) happens off-site.
- Optional on-page **book-bar block** (fields + submit, GSAP staggered entrance) that feeds the same engine.
- Non-reservation conversions branch off explicitly: gift cards (hosted order page), events/contact (contact-form-7 with input masking + inline validation), footer newsletter (email + masked date field).
- **For a guesthouse:** keep the site as the mood piece; hand off to its channel manager / Beds24 / "request-to-book" form. Don't rebuild a booking backend.

### B7. Copy voice
Sensory, literary, unhurried — mood over information. Short declarative fragments and nature metaphors ("Shaped by sea. Grounded in land", "A reflection between sea and desert", "A meeting point, naturally"). Personifies the landscape; frames the stay as gathering/belonging, not amenities. Almost no hard-sell, no prices, no adjective-stacking. Confidence signalled by restraint. Only the footer switches to concrete credibility ("spanning 16 culinary concepts").

**Iceland re-key:** name the land's two forces, speak in calm sensory fragments, sell stillness and belonging rather than a room list.

---

## C. CROSS-CUTTING PRINCIPLES — why BOTH read premium

Regardless of loud (Bucks) or quiet (Ballena), the same nine levers do the work:

1. **A gated preloader that the whole site waits for.** Both open on a fixed overlay that clip-paths away and *gates* the first-fold entrance. The first 2–3 seconds are authored, not a flash of unstyled content. This is our standing "signature wow moment," and it doubles as honest cover for loading heavy media. Always `100svh`.

2. **Two-color discipline.** Bucks = espresso + cream; Ballena = cream + ink. Both add sparing accents (per-flavor panels / three earth tones). Disciplined two-color systems always read more expensive than rainbow UI.

3. **One characterful type system, huge size contrast, tiny tracked eyebrow over a giant title.** Both pair a distinctive display face with a quiet body, self-hosted/owned — no Google-Fonts default look. Bucks does it uppercase + outline/arched; Ballena does it wide-sans + fluid clamp scale.

4. **Photography does the selling; it is framed and revealed, never gridded as thumbnails.** Both are real, art-directed, no stock, no SVG stand-ins. Bucks = dark moody food; Ballena = aerial drone + tall portrait crops.

5. **Motion is code/scroll/canvas-driven, choreographed, and load-bearing — no autoplay hero video.** Every section IS an interaction (Bucks pin-swap / Ballena masked reveals), not a generic fade-up. Faster, more intentional, and dodges in-app-browser resize.

6. **Consistent easing = the invisible unifier.** Bucks leans on GSAP + CSS; Ballena standardizes on `power2/3/4-out` and the expo-out token `cubic-bezier(0.16,1,0.3,1)`. Pick one easing family and use it everywhere.

7. **Quiet, restrained hover/micro-interaction.** Underline-grow text links, explicit button state changes — never card-lift/scale-pop AI tells.

8. **Design the boring parts.** Nutrition tabs, hours, address, care labels — rendered with craft and (for Bucks) a confident headline. Signals obsessive detail.

9. **One committed brand idea, executed to the screw.** Bucks = the physical hang-tag catalog; Ballena = the "sea and desert" concept spine. Originality comes from committing to ONE idea across every element, not from a wild layout. This satisfies our "be the concept, not the template" and "no style bleed" rules simultaneously.

**Award refs confirm the split-register:** Graza (copy-as-design, one cutout — the cheapest wow) and Mana Yerba Mate (the site's energy IS the product) sit at the Bucks end; Omai Villas (full-bleed one-villa-per-moment carousel), NILS am See (calm self-revealing stacked narrative), Casona Sforza (sun-washed editorial stills) sit at the Ballena end. Son Daven's drag-to-reveal Summer↔Winter wipe is the one bespoke "gesture = value prop" move worth stealing for a four-season Icelandic stay. Polène proves the quiet-luxury end (black/white, product-rotation reveal) for a craft/material brand where the object is the story.

---

## D. THE REUSABLE MENU — pull from this per build

### D1. Section menu (mix, don't run all)
| # | Section | Best for | Build cost |
|---|---------|----------|-----------|
| S1 | Gated clip-path preloader (logo mask-reveal + tagline split, `preloaderComplete` gate) | BOTH — always | Low |
| S2 | Fixed floating pill nav / slim header, single primary CTA + hamburger→full overlay | BOTH | Low |
| S3 | Full-bleed hero, brand line, scale-in bg (`1.15→1`) + split-word title rise | BOTH | Low–Med |
| S4 | Hero product carousel on a spotlight disc + brand line-art halo (hero object) | Ecommerce | Med |
| S5 | Pinned spec-tag scroll-swap (3–4 provenance claims, icon + photo bleed) | Ecommerce (works for a stay's "why here") | High (GSAP pin) |
| S6 | Per-product flavor-color full-height panels, bg + product crossfade | Ecommerce | Med–High |
| S7 | Editorial eyebrow→giant title→lyrical para→text-link band (alternating asymmetric) | Guesthouse | Low |
| S8 | Full-bleed parallax breather band (scrubbed `-8→8`) | BOTH | Low |
| S9 | Ruler/tape-measure numbered slider (01/02/03 on dashed rule) for "why us" process | BOTH (replaces 3-card grid) | Med |
| S10 | Portrait media-card grid routing to secondary journeys (scale-settle reveal, quiet hover) | Guesthouse | Low |
| S11 | Bundle module (3/6-pack tab toggle, live price + savings) | Ecommerce | Med |
| S12 | Tagged testimonial slider (name in a hang-tag pill, brand-pattern bg, quote glyph) | BOTH | Med |
| S13 | Buy box: size selector live-updating price + qty stepper + add-to-cart state machine | Ecommerce | Med |
| S14 | Slide-out cart drawer, friendly empty state, hosted-checkout handoff | Ecommerce | Med |
| S15 | Contact & location card (hours/phone/address/map) + on-page book-bar handoff | Guesthouse | Low–Med |
| S16 | Founder/maker story as its own experience (outlined name, adjective marquee, one origin para) | BOTH | Low |
| S17 | Designed "boring parts" — ingredient/nutrition/care/assay in styled tabs + cheeky headline | Ecommerce | Low |
| S18 | Footer + newsletter (masked field, animated submit, credibility statement) | BOTH | Low |
| S19 | Letter-spaced running marquee (`W H Y  …`) | BOTH (use once) | Low |
| S20 | Drag-to-reveal state wipe (Summer↔Winter / season↔season) — one bespoke gesture = the value prop | Four-season stay | High |

### D2. Scroll-interaction menu (the motion primitives)
1. **Lenis inertia base** — `lerp 0.075, duration 1.4`, GSAP-ticker-driven, `lagSmoothing(0)`, bound to `ScrollTrigger.update`. The foundation for the whole "sleek" feel; add it first.
2. **Split-word masked title rise** — words in `overflow:hidden`, `yPercent 110→0`, `power3.out`, stagger `0.04`, `start:'top 92%'`, `once`. Hero variant: `power4.out`, `stagger.amount 0.4`.
3. **Scrubbed parallax** — pre-scale `1.15`, `yPercent -8→8`, `ease:'none'`, `scrub:true`, `start:'top bottom' end:'bottom top'`. Depth without `position:fixed`.
4. **Scale-settle arrival** — parent `overflow:hidden`, media `scale 1.05→1`, `power2.out`, `once`. Every non-parallax photo.
5. **Hero push-in** — bg `scale 1.15→1` over 2s on load, gated behind preloader.
6. **GSAP ScrollTrigger pin + scroll-swap** — pin one card, scrub through N states (icon + copy + margin photo). The concept-as-section move.
7. **Clip-path preloader wipe** — `inset(0) → inset(100% 0 0 0)`, fires a `complete` event that gates first-fold. `100svh`.
8. **Swup page transitions** — swap `#main`, wait for images (3s cap), fade in, rebuild scoped ScrollTriggers, pause Lenis during swap.
9. **Canvas float** — real cut-out assets drifting/bobbing (Bucks produce). Perpetual subtle motion for a hero object.
10. **Consistent easing token** — everything `power2/3/4-out` + CSS `--transition:0.3s cubic-bezier(0.16,1,0.3,1)`. Quiet hovers only.

**Portability note:** Lenis + GSAP ScrollTrigger + Swup + Swiper is framework-light and drops onto our stack. Framer-motion mount/state reveals are unreliable in the iceland-redesigns SPA (H1 stuck invisible) — drive reveals with GSAP ScrollTrigger or CSS transitions, per the standing rule. Every full-height overlay/hero uses `100svh` for in-app browsers.

---

## E. THE SPLIT — guesthouse/boutique-stay vs premium ecommerce

### E1. GUESTHOUSE / BOUTIQUE STAY — reach for the Ballena playbook

**Adopt:**
- The full **B1 motion recipe wholesale** — Lenis inertia + split-word masked title rises + the two image behaviors (scrubbed parallax on full-bleed land/exterior bands, scale-settle on everything else). This alone makes an Icelandic farm-stay feel premium.
- The **concept spine**: pick the stay's two defining forces ("between glacier and sea", "moss and lava", "midnight sun and long dark") and run it through hero line, eyebrows, and copy — originality without a wild layout.
- The **gated cinematic preloader** (basalt or cream) as the signature wow + honest media cover.
- **Cream + ink palette** re-keyed to Icelandic-earth accents; **all-sans, skip the serif reflex**; the **fluid ratio-locked clamp type scale**.
- **Editorial band rhythm** (S7) over hero→cards→testimonials; portrait media grid (S10) to route rooms/land/food/hosts; full-bleed parallax breathers (S8).
- **Swup** for the multi-page image-heavy site so navigating never shows a half-loaded page.
- **Booking = handoff** (channel manager / Beds24 / request-to-book), persistent header CTA + optional on-page book-bar.
- Optionally the **Son Daven drag-to-reveal** if the stay's pitch is genuinely seasonal.

**Traps to avoid:**
- Don't turn it loud. No per-product color panels, no cocky uppercase, no marquee overload — the register is stillness. One CTA.
- Don't reach for the dark+gold+serif "luxury" kit (banned reflex) — Ballena proves premium is cream+ink+all-sans+pacing.
- Don't AI-tell the hovers (card-lift/scale-pop). Underline-grow + expo-out only.
- Don't build a booking backend or fake availability — hand off.
- Don't leave the landing page sparse: "editorial calm" ≠ empty. One full page, big images, ~8–11 sections (partial-is-not-sparse rule).
- Don't autoplay a hero video (in-app resize + weight). Code/scroll motion over big drone stills reads more expensive.
- Verify the light: if the client's real photography isn't shot in good natural light, the whole register collapses — commission/select for golden-hour warmth before committing to this playbook (photography-led-always rule; no SVG stand-ins).

### E2. PREMIUM ECOMMERCE (single-brand, few SKUs) — reach for the Bucks playbook

**Adopt:**
- **Invent ONE physical-object design language** (D1's real premium engine) and apply it to every element — the biggest lever here.
- **Two-color base + per-product accent panels** (S6): let color merchandise as you scroll.
- **One characterful uppercase display in three treatments** (solid/outline/arched) over a quiet body.
- **Product as hero object** (S4): spotlight disc + brand line-art halo + floating real material cut-outs on canvas.
- **Pinned spec-tag scroll-swap** (S5) for provenance/clean-label claims — the banned-formula killer.
- **The full commerce kit**: buy box with live-price size selector + qty stepper, add-to-cart state machine, slide-out cart drawer with friendly empty state, **hosted-checkout handoff**, bundle module with pack toggle + clear savings.
- **Design the boring parts** (S17) with a confident headline; **founder/maker page** as its own experience (S16).
- **Opinionated, funny, human copy** — the authenticity that justifies the price.
- Cheaper end available (Graza): if budget/time is tight, win on **copy-as-design + one great product cutout** and skip the heavy canvas/WebGL — the wow can be language + one asset.

**Traps to avoid:**
- Don't let a few SKUs leave the page empty — the whole Bucks trick is filling a page around *one* object (hero disc, halo, floating cut-outs, per-flavor panel). Mana Yerba Mate and the 3D-can pattern solve exactly this.
- Don't skip the physical-object language — without it, dark+cream just looks like a dark template. The invented catalog IS the premium.
- Don't ship rainbow UI. Two colors + per-product accent; accents come from photography, not chrome.
- Don't render the design language with SVG stand-ins for the *product* — real, appetizing, material photography only.
- Don't wire on-site card entry — hand off to hosted checkout (Shopify/Stripe), and verify the signature/handoff on the **real deployed URL**, not localhost (base-path 404 rule).
- Watch style bleed: prefix all keyframes with the build slug, scope injected styles, palette via scoped vars — a shared SPA leaks global CSS between designs.
- Copy voice is load-bearing but risky in Icelandic — cocky bravado must read natural to a native, and grammar/diacritics in uppercase display must be verified. Strip em-dashes and AI-tell phrasing from all customer-facing copy.

---

### One-line decision rule
If the candidate sells a **feeling/place** → Ballena playbook (Section B): inertia + masked reveals + parallax + restraint, cream+ink, editorial bands, handoff booking. If it sells a **thing you take home** → Bucks playbook (Section A): invented object-language + hero-object staging + per-product color + pinned spec-swap + full commerce kit. Both open on a gated preloader, commit to two colors, one owned type system, real photography, and one idea executed to the screw.

---

{
 "teardowns": [
  {
   "site": "https://buckssauce.com/ — Bucks Sauce Co., small-batch gourmet BBQ/hot sauce (3 SKUs). Built by Buzzworthy Studio on Next.js + Prismic CMS, hosted on Vercel (behind a Vercel bot checkpoint). Motion via GSAP ScrollTrigger (pin-spacers) + HTML canvas for floating produce. Custom client-side cart (Zustand persisted to localStorage 'cart-storage') with a slide-out drawer and hosted-checkout handoff (Shopify signatures in markup). Analytics: Meta Pixel, GA4, LogRocket session replay.",
   "oneLineEssence": "A dark, warm, \"craft-workshop meets spec-sheet\" single-brand shop that turns a $12 sauce bottle into a premium hero object through a branded preloader, giant outlined display type parallaxing behind a floating pill nav, pinned scroll-swapped \"hang-tag\" claims, per-flavor color-themed product panels, and real cut-out produce floating on canvas — irreverent copy, obsessive detailing.",
   "colorImpression": "Warm near-black espresso base (body background #100B06 / rgb(16,11,6)) with a parchment-cream primary text and UI color (#F5E4C7 / rgb(245,228,199)). It reads dark-and-premium but NOT the cold black-and-gold luxury cliché — it's warm and appetizing, like grill smoke and butcher paper. The single deliberate pop is amber/gold used for highlighted phrases (e.g. \"ENDING BORING BBQ.\" in amber while the rest of the line stays cream). The big move is flavor-keyed color panels: each sauce showcase and bundle sits on a full-bleed background color tied to its flavor (mustard-gold for Pineapple Sriracha; the Habanero and Cherry panels shift to their own orange/red hues as you scroll/switch), so color itself does the merchandising. Cream and dark invert constantly (cream pills on dark, dark pills on cream tags), and food photography (glazed dripping wings, real peppers/cherries/pineapple) supplies the saturated warm accents. Effectively a disciplined two-color system (espresso + cream) plus per-flavor accent.",
   "typographyImpression": "Two-typeface system with extreme role contrast. DISPLAY: \"PeperoncinoSansCustom\" (a custom-named face — 'peperoncino' = chili) used for every headline, product name, button label, tag and numeral, ALWAYS UPPERCASE, weight 400, sizes from ~24px labels up to 52–60px H1/H2 (e.g. \"BUY A PACK\" at 60px). It's a chunky, slightly quirky, condiment-label sans with personality — not a neutral grotesk — and it's the brand's whole voice made visible. It appears in three treatments: solid fill, giant OUTLINE/stroke-only (section titles \"WEAPON\", \"CHOOSE YOUR WEAPON\", \"REVIEWS\", numerals \"01\") and ARCHED-on-a-curve (the \"WHY BUCKS SAUCE\" badge title). BODY: \"Inter Tight\" (tight modern grotesk, weights 400/500/700) for descriptions, taglines and small eyebrow labels — clean, neutral, high legibility, deliberately quiet so the display face carries all the character. Size contrast is dramatic: tiny 16px Inter Tight eyebrows (\"CHOOSE YOUR WEAPON\" label, \"REVIEWS\") sit under enormous 40–60px display words. Numerals are set as hollow outlined figures with a dashed measuring-tape rule through them.",
   "typographyImpression2": "",
   "scrollAndMotion": "This is the core of why it feels expensive; the motion is dense and choreographed, not decorative fade-ins:\n1) BRANDED PRELOADER / REVEAL — On first load a fixed full-viewport overlay (div.fixed.h-dvh.z-9999 with [clip-path:inset(0)]) shows the stag logo on black with real cut-out ingredients (habanero, cherry, garlic, pineapple) scattered and floating in; it then clip-path-wipes away to reveal the hero. A three-dot 'bucks-loading' keyframe animation runs during load. It sets the tone before any content.\n2) FLOATING PRODUCE ON CANVAS — Five <canvas> elements render the ingredient cut-outs (pineapple slices, peppers, cherries) that drift/bob continuously and parallax around the bottle in the hero and product panels — subtle perpetual motion, physics-y float rather than static PNGs.\n3) PINNED SPEC-TAG SECTION — A GSAP ScrollTrigger pin (a 2,356px-tall 'pin-spacer' wrapper) holds a laminated 'hang-tag' card in place while scroll swaps it through the four claims NO CORN SYRUP → NO SEED OILS → NO ADDITIVES → GLUTEN FREE; each state changes the line-icon and body copy while big photographic ingredients bleed in from the margins. Scroll is effectively 'scrubbing' a slideshow.\n4) GIANT OUTLINE TITLES PARALLAXING BEHIND A FIXED NAV — Section titles are set as huge hollow words ('WEAPON', 'REVIEWS', 'CHOOSE YOUR WEAPON') that scroll up behind a permanently fixed, floating pill nav (GET SAUCE / cart / menu), so the type slides under the chrome — a layered, editorial parallax feel with real depth.\n5) PER-FLAVOR COLOR-PANEL PRODUCT SEQUENCE — The 'CHOOSE YOUR WEAPON' section (~2,333px) presents each sauce on its own full-height flavor-colored panel with the bottle, line-art antlers drawn behind it, and floating fruit; as you move between flavors the panel background color and product crossfade — color-driven merchandising you scroll/arrow through.\n6) MARQUEES — Letter-spaced running-text marquees: 'W H Y  B U C K S  S A U C E' behind the why section and 'B U I L T  O N  F I R E' on the PDP scroll horizontally.\n7) RULER / TAPE-MEASURE SLIDER — The 'Why Bucks' proof points are a slider: a giant outlined numeral (01/02/03) sits on a dashed measuring-tape rule, with circular prev/next arrows and a punched hang-tag pill label (SMALL BATCHES / REAL INGREDIENTS / OH THIS?).\n8) TESTIMONIAL SLIDER — Reviews are an arrow-navigated carousel; each card has a tiled tone-on-tone antler pattern, a big quote glyph and the reviewer name in a hang-tag pill.\n9) MICRO-INTERACTIONS — Add-to-cart buttons cycle through explicit states ADD TO CART → ADDING → ADDED; pills/tags have hover states; the cart opens as a slide-out drawer ('Close cart', 'ADD SOME SAUCE' empty state, 'PROCEED TO CHECKOUT'); hamburger opens a full menu overlay with a dimmed backdrop (fixed h-dvh bg-background/65). No autoplaying video anywhere — all motion is code/canvas/scroll driven, which keeps it fast and intentional.",
   "whatMakesItPremium": [
    "A consistent, invented design LANGUAGE carried on every element: laminated 'hang-tags' with two punched holes, dashed spec-sheet borders, tape-measure rules, hollow ruler numerals, line-icon badges, and a tone-on-tone antler pattern — it reads like a considered physical product catalog, not a web template.",
    "Restraint in palette: essentially two warm colors (espresso + cream) with per-flavor accent panels and one amber highlight — disciplined two-color systems always read more expensive than rainbow UI.",
    "A custom, characterful display typeface ('Peperoncino') used ONLY uppercase, in three treatments (solid / giant-outline / arched), against a quiet Inter Tight body — the type does the branding and never looks like a Google-Fonts default.",
    "The product bottle is treated as a hero OBJECT: spotlight disc, line-art antlers halo, floating real produce cut-outs, flavor-colored stage — it elevates a $12 bottle to something photographed like a fragrance.",
    "Motion is choreographed and load-bearing (branded preloader, pinned scroll-swap, canvas float, parallax outline titles) instead of generic fade-up reveals — every section IS an interaction rather than a static block.",
    "Real, appetizing food photography (dripping glazed wings, whole peppers/cherries/pineapple) shot dark and moody — no stock, no SVG stand-ins.",
    "Obsessive detail density: even the nutrition facts and ingredient list are designed (INGREDIENTS/NUTRITION tabs, 'PURE AF. SERIOUSLY'), signaling craft and transparency.",
    "Confident, funny, opinionated copy that a big brand would never risk — personality reads as a small maker who cares, which is itself a premium/authenticity signal.",
    "Performance and polish: no janky autoplay video, fast Next.js/Vercel delivery, session-replay + pixel instrumentation — the invisible professionalism of a paid agency build (Buzzworthy Studio)."
   ],
   "transferableIdeas": [
    "Invent ONE physical-object design language and apply it everywhere. Bucks uses luggage/hang-tags, punched holes, dashed spec borders and ruler numerals. For an Icelandic wool shop: knitting-pattern chart grids, yarn-label swing tickets, stitch-count numerals; for jewelry: jeweler's loupe circles, hallmark stamps, ring-size gauge; for a bakery-shop: bakery-ticket stubs, weight/gram spec labels, order-number tags.",
    "Branded clip-path preloader that reveals the site: logo + floating hero ingredients (or wool skeins / gemstones / pastries) on a dark field, then wipes away. Cheap to build (CSS clip-path + a couple of drifting PNGs/canvas) and instantly sets a premium first impression — matches our 'signature wow moment' rule. Use 100svh not 100vh for the overlay (in-app browser rule).",
    "Two-color discipline + per-product accent panels. Pick a warm dark base + one cream, then give each hero product its OWN full-bleed background color keyed to the material (natural wool greys/heather, oxidised-silver charcoal, rye/sourdough browns). Let color do the merchandising as you scroll between products.",
    "One custom/characterful uppercase display face used in three treatments (solid, giant outline, arched-on-curve) over a quiet grotesk body — from our owned font library (e.g. Bricolage/Projekt-style display + Inter Tight). The outline + arched treatments alone make a page look designed, not generated.",
    "Pinned scroll-swap 'spec tag' section for provenance/claims — pin one card and scroll-swap through 3–4 proofs (100% íslensk ull / handunnið / lítil framleiðsla / sent frá verksmiðjunni), each with its own line-icon and a photographic material bleeding in from the edges. This is our banned-formula-killer: the section IS the concept.",
    "Treat the single product as a hero object on a stage: spotlight disc + brand line-art halo behind it + floating real material cut-outs (wool tufts, silver offcuts, flour dusting). Elevates a modest-priced item to editorial.",
    "Giant hollow section titles that scroll behind a fixed floating pill-nav for layered parallax depth — and a fixed 'GET / KAUPA' pill CTA + cart + menu that always floats top-right.",
    "Ruler/tape-measure numbered slider (01/02/03) for the 'why us' proof points instead of a 3-card grid — a distinctive, on-brand way to show process steps (dye → wash → knit → finish).",
    "Ecommerce pattern worth copying wholesale: explicit add-to-cart state machine (ADD → ADDING → ADDED), a slide-out cart drawer with a friendly empty state ('ADD SOME SAUCE' → e.g. 'Setja í körfu'), size/pack selector that live-updates price, and a bundle module with a 3-pack/6-pack tab toggle and clear savings ($32 vs 3×$12) — great for gift sets / wool bundles / pastry boxes.",
    "Design the boring parts: put the ingredient list, nutrition, care label or silver assay into styled tabs and give them a cheeky confident headline — transparency rendered as craft. (Bucks: 'PURE AF. SERIOUSLY'.)",
    "Founder/maker story page as its own experience ('MEET CHEF DOUG'): oversized outlined name, a marquee of adjectives (HOMEMADE · AWARD-WINNING · SMALL BATCHES), and one punchy origin paragraph — the small-maker authenticity that justifies premium pricing. Perfect for a Hvammstangi wool factory or a family bakery.",
    "Testimonial slider styled as tagged cards (name in a hang-tag pill, big quote glyph, tone-on-tone brand-pattern background) rather than a plain review grid.",
    "Keep it code/canvas/scroll-driven with NO autoplaying hero video — fast, intentional motion (GSAP pin + CSS + a light canvas float) reads more premium and performs better than heavy video, and dodges the in-app-browser resize issues."
   ],
   "commerceOrBookingMechanics": "Single-brand ecommerce, 3 SKUs, headless/custom (not a stock Shopify theme). PRODUCT RANGE: Crushed Pineapple Sriracha, Crushed Habanero Garlic, Crushed Cherry Garlic — each 16oz, $12.00 single. PRESENTATION: on the homepage each sauce gets a full-height flavor-colored showcase panel with bottle + tagline + dual CTA ('ADD TO CART $12.00' cream pill and 'VIEW PRODUCT ↗' outline pill). PDP (/shop/<slug>) has: hero product name + benefit headline, a TASTE PROFILE spec list, a 'PAIRS WITH' food list, four dietary badge icons (NO HFC / GLUTEN FREE / NO ADDITIVES / NO SEED OILS), a buy box with a 'Select size' selector (1 bottle 16oz / 3 PACK / 6 PACK) + quantity stepper + ADD TO CART (price updates by size), a long description, INGREDIENTS/NUTRITION tabs with a real nutrition-facts panel and full ingredient list, then cross-sell ('CHOOSE YOUR WEAPON' other flavors) and a bundle module. ADD-TO-CART: explicit state machine ADD TO CART → ADDING → ADDED. CART: slide-out drawer (header 'cart(0)' counter, 'Close cart', empty-state CTA 'ADD SOME SAUCE', 'PROCEED TO CHECKOUT'); cart persisted client-side in localStorage key 'cart-storage' (Zustand-style). CHECKOUT: hands off to a hosted checkout (Shopify signatures present in markup / 'checkout-button'); no on-site card entry. BUNDLES/SAVINGS: 'BUY A PACK — SAVE SOME BUCKS' with a 3 PACK / 6 PACK tab toggle and per-flavor arrow switcher; 3-pack $32.00 (vs 3×$12=$36). No visible subscription/subscribe-and-save. UPSELLS: cross-sell flavor row + bundle module repeated on home, PDP and about pages. TRUST SIGNALS: testimonial slider mixing customers and creators with @handles (Jason M., Kyle Seip/@castiron_kyle, The Heatbros, Captain Cooks, Trey M., Jeffrey R.), an award mention ('Philly Hot Sauce Fest 2026 — Best Sauce on a Philly Cheesesteak, 2nd Place'), founder credibility ('20+ years in kitchens', Chef Doug), dietary/clean-label badges, and a 'JOIN THE BUCKS CLUB' newsletter. Also /wholesale, /faq, /contact pages and Instagram/Facebook links.",
   "copyVoice": "Irreverent, cocky, funny, hyper-confident small-maker voice — trash-talks competitors and dares you to disagree, but backs it with clean-label substance. Headlines are jokes with a claim inside: 'THE BBQ SAUCE THAT MAKES OTHER SAUCES INSECURE', 'CHOOSE YOUR WEAPON', 'THE SAUCE THAT DIDN'T ESCAPE THE LAB', 'WE DON'T TALK ABOUT THE OLD SAUCE ANYMORE. It's still in the fridge. Nobody touches it. It knows what it did.' Product benefits are framed as attitude: 'Habanero Fire. Clean Burn. No Apologies.' Clean-label claims get personality: 'Sweet is fine. Sugar-lab sweet is not. So we left the high fructose corn syrup on the bottom shelf where it belongs'; 'If it reads like a chemistry project, it's not in this bottle'; 'PURE AF. SERIOUSLY'. Founder story leans into craft-nerd bravado with a wink: 'We hear ingredients the way musicians hear chords', 'he locked himself in the lab (a.k.a. his kitchen) like the RZA crafting beats', 'BUILT BY A GUY WHO TAKES SAUCE WAY TOO SERIOUSLY', 'official review: they all sucked'. Second-person, short punchy fragments, heavy uppercase, zero corporate hedging. It reads like a person, not a brand deck — which is the whole authenticity play.",
   "sectionsInOrder": [
    {
     "name": "Branded intro preloader / reveal",
     "purpose": "First-impression brand moment; masks load; sets dark warm tone",
     "layout": "Fixed full-viewport (h-dvh, z-9999) black stage: centered stag/BUCKS logo with real cut-out ingredients (habanero, cherry, garlic, pineapple) scattered around it",
     "notableInteraction": "Ingredients float/drift in on canvas; a 3-dot 'bucks-loading' keyframe runs; overlay then clip-path:inset wipes away to reveal the hero"
    },
    {
     "name": "Fixed floating pill nav (persistent)",
     "purpose": "Always-available brand + shop + cart access",
     "layout": "Antler logo top-left; top-right cluster of pill buttons: cream 'GET SAUCE' CTA, dark cart button with 'cart(0)' counter, dark hamburger menu. Sits over all content.",
     "notableInteraction": "Stays fixed while giant outline titles scroll behind it; hamburger opens full menu overlay with dimmed backdrop; cart opens slide-out drawer"
    },
    {
     "name": "Hero — product carousel",
     "purpose": "Lead statement + flagship product on a pedestal",
     "layout": "Giant uppercase Peperoncino H1 'THE BBQ SAUCE THAT MAKES OTHER SAUCES INSECURE'; dashed spec-divider with centered flavor label; bottle centered on a large gold spotlight disc; circular prev/next arrows to change flavor; floating produce cut-outs + a sunglasses mascot sticker; 'SHOP NOW' cream pill",
     "notableInteraction": "Flavor carousel (arrow nav swaps bottle + label); canvas produce floats/parallaxes around the bottle"
    },
    {
     "name": "Brand statement line",
     "purpose": "Positioning one-liner",
     "layout": "Centered short paragraph in outlined/light type: 'Our BBQ sauces use real, natural stuff like it's the 1800s. Slap it on anything you grill and act surprised when people think you can cook.'",
     "notableInteraction": "Scrolls up under the fixed nav (layered depth)"
    },
    {
     "name": "Pinned 'spec-tag' clean-label section",
     "purpose": "Communicate the four clean-label claims as proof",
     "layout": "A laminated cream hang-tag header plaque (two punched holes) reading the claim, over a dark card with a line-icon and body copy; large photographic ingredients (cherries, habanero, chili, tomato) bleed in from every margin",
     "notableInteraction": "GSAP ScrollTrigger PIN (2,356px pin-spacer): the card stays pinned while scroll swaps NO CORN SYRUP → NO SEED OILS → NO ADDITIVES → GLUTEN FREE, changing icon, copy and surrounding produce"
    },
    {
     "name": "'CHOOSE YOUR WEAPON' product showcase",
     "purpose": "Merchandise the 3 flavors individually with buy actions",
     "layout": "Giant hollow outline title behind the nav; then per-flavor full-height panel in a flavor-keyed background color (mustard-gold for Pineapple) with dashed border, product name, tagline, bottle with line-art antlers behind it, floating fruit, and dual pills 'ADD TO CART $12.00' + 'VIEW PRODUCT ↗'",
     "notableInteraction": "Scroll/arrow through flavors; panel background color + product crossfade per flavor; add-to-cart state machine ADD→ADDING→ADDED"
    },
    {
     "name": "'WHY BUCKS SAUCE' proof / process",
     "purpose": "Brand mission + 3 credibility points",
     "layout": "Arched badge-style title 'WHY BUCKS SAUCE'; an onion-with-a-face mascot sticker; two-tone mission line with '...ENDING BORING BBQ.' highlighted amber; then a ruler/tape-measure slider — giant outlined numeral (01/02/03) on a dashed measuring rule, circular arrows, and a punched hang-tag label (SMALL BATCHES / REAL INGREDIENTS / OH THIS?)",
     "notableInteraction": "Horizontal running-text marquee 'W H Y B U C K S S A U C E'; arrow-navigated numeral slider styled as a measuring tape"
    },
    {
     "name": "'BUY A PACK — SAVE SOME BUCKS' bundles",
     "purpose": "Drive higher AOV via multipacks",
     "layout": "3 PACK / 6 PACK tab toggle (active tab in a punched hang-tag pill); flavor-gold panel with three bottles lined up, mascot sticker, flavor-switch arrows, and a centered dark 'BUY NOW $32.00' pill",
     "notableInteraction": "Pack-size tab toggle + flavor arrow switcher; price updates ($32 3-pack vs 3×$12)"
    },
    {
     "name": "Lifestyle food-photo band",
     "purpose": "Appetite appeal / craving trigger",
     "layout": "Full-bleed dark moody photo of a glazed BBQ wing with sauce dripping",
     "notableInteraction": "Full-width imagery as a palate-cleanser between commerce and social proof"
    },
    {
     "name": "'REVIEWS' testimonial slider",
     "purpose": "Social proof from customers + creators",
     "layout": "Giant hollow outline 'REVIEWS'; a cream hang-tag pill showing the reviewer name between circular arrows; dark testimonial card with tone-on-tone tiled antler pattern, big quote glyph, quote headline in display type, and body with @handle bolded",
     "notableInteraction": "Arrow-navigated carousel cycling 6+ reviews (customers and @-handle creators)"
    },
    {
     "name": "Footer + 'JOIN THE BUCKS CLUB'",
     "purpose": "Newsletter capture, navigation, credibility",
     "layout": "Full snarling-buck logo in a bordered tile with social tiles (IG/FB); stacked display-type link list SHOP/WHOLESALE/ABOUT/FAQ/CONTACT with hairline dividers; newsletter heading + subcopy 'New flavors. Restocks. Fire recipes. Merch drops.'; dashed-pill email field with a dashed-circle arrow submit; copyright + 'Website by Buzzworthy' credit",
     "notableInteraction": "Email signup with animated circular submit; hover states on link rows"
    }
   ]
  },
  {
   "site": "ballenacabo.com — Ballena, a premium restaurant in San José del Cabo, Baja California Sur, Mexico (part of Grupo Hunan; NOTE: it is a fine-dining restaurant, not a hotel/resort as briefed — but the scroll craft is exactly the reference class wanted). Built on WordPress with a bespoke block theme called \"paisana\"; motion stack = Lenis smooth-scroll + GSAP/ScrollTrigger + Swup page transitions + Swiper.",
   "oneLineEssence": "A cream-and-ink, all-sans editorial site where a cinematic preloader, buttery Lenis inertia scroll, word-by-word title reveals, and scrubbed image parallax turn a restaurant's aerial-drone photography into a slow, expensive \"sea meets desert\" mood film — with booking handed off to OpenTable.",
   "sectionsInOrder": [
    {
     "name": "Preloader (cream overlay intro)",
     "purpose": "Set the tone before any content shows and mask asset loading; makes the first paint feel authored, not loaded",
     "layout": "Full-viewport cream (#F8F2E5) layer, centered logotype flanked by a two-word tagline split into a left half and a right half",
     "notableInteraction": "GSAP timeline: (1) the two tagline halves slide apart on X (±20px), (2) the logo wrapper opens from width 4px → auto, (3) logo text mask-reveals downward (yPercent -120 → 0). Holds 500ms, then exit slides all text back down out of its masks and the cream layer clip-paths away upward (inset 0 → inset(100% 0 0 0)). Fires a preloaderComplete event that GATES the hero/header entrance so the user actually sees the first-fold animation play."
    },
    {
     "name": "Fixed header / nav",
     "purpose": "Persistent wayfinding + the single conversion control (BOOK NOW)",
     "layout": "Slim bar: left logo (light/dark swap variants), right a hamburger toggle + a pill BOOK NOW button; opens a full-screen menu overlay",
     "notableInteraction": "Staggered entrance after preloader (logo y20, book-btn & toggle y-10). Hamburger opens a GSAP overlay menu — height 0→auto, nav links stagger opacity/y 20→0 (0.05 stagger), social block last; body overflow locked and Lenis paused while open; ESC and backdrop-click close. Nav: Home, Events, Menu, Gallery, Location, About."
    },
    {
     "name": "Hero",
     "purpose": "Immersive first impression; deliver the brand line over full-bleed signature imagery",
     "layout": "Full-bleed background (aerial DJI drone photo DJI_20251024194532_0039.jpg) with a large title-xl headline 'Shaped by sea. Grounded in land' and the tagline 'A reflection between sea and desert'",
     "notableInteraction": "Two-part hero timeline (delay 0.2 after preloader): background scales 1.15 → 1 over 2s (power2.out) for a slow settle/push-in; the headline is split into words, each wrapped in an overflow mask and animated yPercent 110 → 0, duration 1.2, power4.out, stagger amount 0.4 — the words rise into place one after another. On scroll the same bg gets the scrubbed parallax drift (see motion field)."
    },
    {
     "name": "Editorial intro — 'Sea and Desert'",
     "purpose": "State the concept and philosophy right after the hero; slow the reader down",
     "layout": "Asymmetric text-image / card-content pairing: small uppercase eyebrow 'SEA AND DESERT', big title-xl 'Ballena, where gathering comes naturally', short lyrical paragraph, and a text-link CTA ('explore more')",
     "notableInteraction": "Title uses the global split-word rise (yPercent 110→0, stagger 0.04, triggered at 'top 92%', plays once). The paired image is inside an overflow-hidden frame and scale-1.05→1 settles as it enters ('top 95%', power2.out, 1.4s)."
    },
    {
     "name": "Menu feature (split-content + slider)",
     "purpose": "Tease the food/menu as an experience, not a list",
     "layout": "Split two-column band, eyebrow 'Menu', title-m 'Flavors that hold the moment', evocative body copy, and an embedded image slider (Swiper); 'View Full Menu' link to /menu",
     "notableInteraction": "Swiper-driven gallery slider inside the split; titles split-reveal; images do the scale-settle reveal. Copy sample: 'The desert is not empty, it is pure life...'"
    },
    {
     "name": "Full-bleed parallax image band",
     "purpose": "Cinematic breather; sell atmosphere ('restaurant in nature')",
     "layout": "Edge-to-edge photograph with an overlaid title-m 'Where the kitchen moves with the landscape. Discover our restaurant in nature'",
     "notableInteraction": "This is a dedicated parallax block: the image is pre-scaled to 1.15 and scrubbed yPercent -8 → +8 as the section passes through the viewport (ease none, scrub true, trigger top-bottom → bottom-top) — a slow fixed-background drift that reads as depth."
    },
    {
     "name": "Two-column content-intro",
     "purpose": "Editorial 'about the place' beat between feature bands",
     "layout": "Left/right split — left holds an eyebrow, right holds a title-m + paragraph-l + a secondary (dark) button",
     "notableInteraction": "Standard split-word title reveal + image scale-settle; text link uses the house 'btn-secondary' underline/hover treatment with the 0.3s expo-out (cubic-bezier 0.16,1,0.3,1) transition."
    },
    {
     "name": "Media-intro card grid (Events / Gallery / Gift Cards / Menu teasers)",
     "purpose": "Route visitors to the secondary journeys without breaking the calm scroll",
     "layout": "A run of tall portrait image-cards (Events-1, O1A8961, Gift-Cards-1, menu.jpg), each a subheading + image + 'explore more' text link; portrait 823x1024-ish crops",
     "notableInteraction": "Each card image reveals with the scale 1.05→1 settle on enter; hover is a restrained link/underline move rather than card lift. Gallery page itself adds category filter buttons, a 9-item 'View More' expand, and a lightbox with 300ms staggered enter/exit."
    },
    {
     "name": "Contact & Location card",
     "purpose": "Convert the browser into a visitor: hours, phone, address, map",
     "layout": "card-content-box: eyebrow 'CONTACT AND LOCATION', title-sm 'A meeting point, naturally', hours (5:00 PM–11:00 PM; weekends 12:00–4:00 PM), phone +52 624 105 6635, address Camino Cabo Este, plus a map block",
     "notableInteraction": "Map block script + the standard reveal; a book-bar block (reservation bar: fields + submit, GSAP staggered entrance) feeds OpenTable."
    },
    {
     "name": "Footer",
     "purpose": "Newsletter capture + full nav + brand-group credibility",
     "layout": "Eyebrow 'NEWSLETTER' signup with a masked birthday field (MM/DD/YYYY) and validation, an eyebrow 'Navigation' link column, a large logotype, and the Grupo Hunan statement",
     "notableInteraction": "Client-side input masking + inline field validation (contact-form-7 backed). Footer copy: 'Driven by a passion for cuisine and genuine hospitality... spanning 16 culinary concepts.' Special-rotate hover on the footer button. © GRUPO HUNAN."
    }
   ],
   "scrollAndMotion": "Sleekness is a deliberate 4-part system, all confirmed in the theme JS (not inferred):\n\n1) LENIS SMOOTH SCROLL is the base layer and ~half the 'expensive' feel. `new Lenis({ lerp: 0.075, duration: 1.4 })` driven off the GSAP ticker with lagSmoothing(0); every scroll input is interpolated with heavy inertia so the page glides and eases to a stop instead of snapping. Lenis is bound to ScrollTrigger (lenis.on('scroll', ScrollTrigger.update)) so parallax stays frame-synced.\n\n2) SPLIT-WORD MASKED TITLE REVEALS on every h1/h2/h3. animations.js wraps each word in an overflow-mask span, sets it yPercent 110 (hidden below the line), then on ScrollTrigger start:'top 92%', once:true tweens yPercent 0, duration 1, power3.out, stagger 0.04 — words rise into the line one after another. Hero is a richer variant: duration 1.2, power4.out, stagger amount 0.4.\n\n3) TWO DISTINCT IMAGE BEHAVIOURS by block type: (a) SCRUBBED PARALLAX on hero-bg/full-image/card-content/image-cta: target pre-scaled 1.15 then fromTo yPercent -8→8, ease:'none', scrollTrigger start:'top bottom' end:'bottom top' scrub:true — slow opposite-direction drift for the whole time it's on screen, a fixed-background depth feel without position:fixed. (b) SCALE-SETTLE ARRIVAL on all other media: parent overflow:hidden, media scale 1.05 → 1 on enter (start:'top 95%', once, duration 1.4, power2.out); hero bg also pushes in 1.15→1 over 2s on load.\n\n4) SWUP PAGE TRANSITIONS make internal nav feel app-like: swaps only #main with a CSS fade, persists block CSS via head-plugin, scrolls to top, re-inits block scripts (paisana:reinit) and rebuilds only #main-scoped ScrollTriggers, and WAITS for the new page's images to load (3s cap) before fading in — never a half-loaded page; Lenis pauses during the swap.\n\nEasing discipline unifies it: almost everything is power2/3/4-out or the CSS token --transition:0.3s cubic-bezier(0.16,1,0.3,1) (expo-out) — fast start, long slow finish = weight and quality. Note what's ABSENT: no pinning, no horizontal-scroll hijack, no number counters, no crossfade carousels on the homepage. Premium here = inertia + masked reveals + slow parallax + restraint, not a pile of tricks.",
   "whatMakesItPremium": [
    "Motion-first, not decoration-first: the content is ordinary (a restaurant with photos) but Lenis inertia scroll + slow power4-out easing make every interaction feel weighted and deliberate — luxury is communicated through pacing",
    "Ruthless restraint: two dominant colours (cream + near-black ink), two sans fonts, one CTA (BOOK NOW), generous negative space, tiny tracked uppercase eyebrows over huge quiet titles — it never shouts",
    "A gated cinematic preloader that the whole site waits for (hero/header entrance only fire after preloaderComplete), so the first three seconds are art-directed instead of a flash of unstyled content",
    "Photography does the selling: full-bleed aerial drone shots and tall portrait crops with overflow-masked scale-settle reveals — images are treated as film frames, framed and revealed, never as thumbnails in a grid",
    "Fluid, ratio-locked typography (a clamp-based --size-font formula tied to an 'ideal container' width) so headline scale stays proportionally huge and consistent from mobile to 1920px",
    "App-like Swup transitions that wait for images before fading in — zero janky reloads, zero half-loaded pages, which reads as 'built by a real studio'",
    "Real licensed display typefaces self-hosted (Sweet Sans Pro + TT Commons Pro as .otf/.ttf), not Google-font defaults — the tells of a template are absent",
    "Copy written as mood, not marketing — abstract, sensory, slow — which signals confidence (a place that doesn't need to hard-sell)"
   ],
   "transferableIdeas": [
    "Adopt the whole motion recipe wholesale for a guesthouse — it is framework-light and matches our stack: Lenis (lerp ~0.075) for inertia scroll + GSAP ScrollTrigger for (a) split-word masked title rises at 'top 92%' and (b) two image treatments: scrubbed parallax (scale 1.15, yPercent -8→8, scrub) on full-bleed hero/landscape bands and scale-1.05→1 settle on all other photos. This alone will make an Icelandic farm-stay feel premium.",
    "Steal the 'sea and desert' concept spine: pick the guesthouse's two defining forces (e.g. 'between glacier and sea', 'moss and lava', 'midnight sun and long dark') and run it as the through-line — hero line, eyebrows, and copy voice. Gives originality without needing a wild layout (satisfies our 'be the concept, not the template' rule).",
    "Copy the gated cinematic preloader as the signature 'wow' moment: a cream (or basalt) overlay with the guesthouse name mask-revealing and a two-word tagline splitting apart, holding ~0.5s, then clip-pathing away to unveil a full-bleed Iceland photo — cheap to build, hugely premium, and it doubles as honest cover for loading big hero media.",
    "Reuse the palette architecture but re-key it to Iceland: keep the cream base + ink text discipline (#F8F2E5 / #03090D here) and swap the three naturalistic accents (terracotta/sage/dusty-blue) for Icelandic-earth tones — e.g. warm sheep-wool cream, basalt ink, moss green, glacier blue, lava rust. Two-colour dominance + sparing earthy accents = calm and expensive.",
    "Go all-sans and skip the dark-luxury serif reflex: pair an elegant wide display sans (their Sweet Sans Pro; from our library something like a refined geometric/Art-Deco sans) for big titles set with tracked uppercase eyebrows, over a clean humanist body sans (their TT Commons Pro). Proves 'premium' without the banned dark+gold+serif kit.",
    "Use the editorial section rhythm instead of hero→cards→testimonials: eyebrow (tiny tracked caps) → oversized quiet title → one short lyrical paragraph → understated text-link CTA, repeated as alternating asymmetric text/image bands with full-bleed parallax breathers between. Maps cleanly onto rooms, food, the land, the hosts.",
    "Adopt the fluid ratio-locked type formula (clamp + 'ideal container' unit) so headlines stay proportionally large and identical in feel across phones and desktop — solves the 'headline too small on mobile / too huge on 4K' problem in one variable.",
    "Model the booking flow on their handoff pattern: a persistent header CTA + a lightweight on-page booking bar that hands off to the real engine (they use OpenTable; a guesthouse would use its channel manager / Beds24 / a 'request to book' contact form). Keep the site as the mood piece and let a proven engine take the transaction — don't rebuild a booking backend.",
    "Borrow the Swup approach for multi-page guesthouse sites (rooms, the farm, food, contact): fade-swap #main and WAIT for images before revealing, so navigating between image-heavy pages never shows a half-loaded state — the single biggest 'feels like a studio built it' upgrade over a normal WP/SPA.",
    "Keep hover/interaction quiet: underline-grow text links and the 0.3s expo-out (cubic-bezier 0.16,1,0.3,1) transition token everywhere, NOT card-lift/scale-pop AI-tell hovers. Consistent expo-out easing across the whole site is a cheap unifying premium signal."
   ],
   "colorImpression": "Warm, natural, and quiet — a 'sea meets desert' palette, not a dark-luxury one. Base is a soft cream/bone (--color-1 #F8F2E5) with near-black ink for text and dark sections (--color-2 #03090D, a very dark blue-black rather than pure black). Three restrained naturalistic accents evoke the setting: terracotta/clay (--color-3 #C2644F, the primary accent), muted sage green (--color-4 #779580), and dusty sky-blue (--color-5 #83A9D0), plus pure white (#FFFFFF), a warm stone grey (#D3CFC5), and ink-at-38% for hairlines/muted text (#03090D60). In practice the page reads as overwhelmingly cream + ink with the earth tones used sparingly — high-warmth, low-saturation, sunlit. It deliberately avoids black+gold 'premium' clichés.",
   "typographyImpression": "All-sans, no serif anywhere — the premium feel comes from scale, spacing and restraint rather than serif 'elegance'. Two self-hosted licensed families via @font-face: DISPLAY = Sweet Sans Pro (weights Light→Heavy + Italic, .otf) — a wide, refined, faintly Art-Deco geometric sans carrying the oversized headlines; BODY/UI = TT Commons Pro (Lt→Blk + It, .ttf) — a clean humanist grotesque. Big size contrast via a fluid ratio-locked scale (title-xl → title-l → title-m → title-sm → paragraph-l → eyebrow) built on a clamp()+ideal-container formula, so titles stay proportionally huge and calm at every breakpoint. Signature move: a tiny UPPERCASE tracked eyebrow label above a very large mixed-case, light/medium-weight title — maximum contrast, minimum shouting, an editorial-magazine feel.",
   "commerceOrBookingMechanics": "Booking is a lightweight handoff to third parties, not a native engine (correct pattern for a small hospitality site). Path: (1) A persistent 'BOOK NOW' pill in the fixed header is the single primary CTA, present on every page/scroll position. (2) It links out to OpenTable (opentable.com.mx/r/ballena-reservations-san-jose-del-cabo, restref 1474057) — the whole reservation transaction (date/time/party size, confirmation) happens on OpenTable, not on the site. (3) There is also a 'book-bar' block (a reservation bar with fields + a submit button, GSAP staggered entrance) and references to an embedded OpenTable widget iframe (reservation/loader rid=1474057, wide theme), i.e. an on-page booking bar that feeds the same OpenTable engine. (4) A sister concept 'Casa Ballena' has its own OpenTable link, so the header CTA can route by venue. (5) Non-reservation conversions are separate and explicit: Gift Cards via a hosted giftup.app order page, an Events page + contact form (contact-form-7, with phone-number input masking and inline validation) for private-event enquiries, and a footer newsletter signup (email + masked MM/DD/YYYY birthday field). So the journey is: browse the mood/menu/gallery pages → the always-visible BOOK NOW (or the on-page book bar) hands you to OpenTable to complete; events/gift cards branch off to their own flows.",
   "copyVoice": "Sensory, literary, and unhurried — mood over information, closer to a poem or a chef's manifesto than restaurant marketing. Short declarative fragments and nature metaphors: 'A reflection between sea and desert', 'Shaped by sea. Grounded in land', 'Flavors that hold the moment', 'Where atmosphere is built through time and presence', 'A tide that moves through the plate', 'A meeting point, naturally'. It personifies the landscape ('The desert is not empty, it is pure life. It is the silence screaming, it is resistance made beautiful.') and frames dining as gathering and belonging ('Ballena, where gathering comes naturally', 'shared plates, and moments that linger'). Almost no hard-sell, no prices, no adjective-stacking hype; confidence is signalled by restraint. Only the footer switches to concrete brand-credibility register ('...spanning 16 culinary concepts'). For a guesthouse this voice translates directly: name the land's forces, speak in calm sensory fragments, sell belonging and stillness rather than amenities."
  }
 ],
 "refs": [
  {
   "refs": [
    {
     "name": "Son Daven (design resort hotel, Yaremche / Carpathians, Ukraine)",
     "url": "https://sondaven.com/en",
     "signature": "A drag-to-reveal Summer <-> Winter toggle: one full-bleed section that you physically drag horizontally to wipe the same Carpathian location between its summer state (rafting, waterfalls, festivals) and its winter state (Bukovel ski, snow), each side carrying its own photography, palette and copy.",
     "whyItWorks": "Verified Awwwards Site of the Month + Developer Award (Jun 2026). It converts the core promise of a four-season mountain resort into a gesture the visitor performs, so the value prop is felt rather than read; the manual drag also throttles the pace and lets the warm autumn/snow imagery be the hero instead of a text block. Confirmed live: active build-progress updates dated Jun-Jul 2026."
    },
    {
     "name": "Omai Villas (boutique villa collection, St Barth + Ibiza)",
     "url": "https://omaivillas.com",
     "signature": "A full-bleed villa carousel where each featured villa (Zile, Grey, Reva) crossfades edge-to-edge as you advance -- architecture photography fills the entire viewport with almost no chrome, one villa name and one image per 'moment'.",
     "whyItWorks": "Verified Awwwards Honorable Mention (Apr 2026). For a set of distinct standalone villas, giving each an uninterrupted full-screen frame lets the properties differentiate on atmosphere alone; the restraint (single image, minimal UI, warm natural light) reads as confidence and matches the understated-luxury positioning -- the same image-led editorial register as the ballenacabo family. Confirmed live: Zile and Grey bookable, Kaya/Reva flagged 'Opening Nov 2026'."
    },
    {
     "name": "NILS am See (adults-only boutique hotel, Lake Neusiedl, Austria)",
     "url": "https://www.nilsamsee.at/en",
     "signature": "An auto-cycling full-width hero that hands off into a vertically stacked, self-revealing narrative -- Restaurant Ankkuri, poolside, experiences -- where each block eases in with its own golden-hour image plus caption as you scroll, sequenced as a calm story rather than a dense card grid.",
     "whyItWorks": "Carries 2024-2025 design awards. The muted, natural-light photography and gentle reveal cadence enact the hotel's 'unwind' philosophy -- pacing sections as a slow sequence keeps the mood contemplative and lets the lakeside light carry the brand, the quietest and most minimalist of the four. Confirmed live: working booking + newsletter."
    },
    {
     "name": "Casona Sforza (eco-luxury boutique, Puerto Escondido, Mexico) -- aesthetic sibling, provenance caveat",
     "url": "https://www.casonasforza.com",
     "signature": "Sun-washed editorial scroll: large architectural stills of the vaulted beachfront building expand into lightbox galleries and slow carousels, sections easing in over warm neutral negative space, sea-and-desert imagery doing the talking with minimal type.",
     "whyItWorks": "INCLUDED WITH A CAVEAT, NOT AS A VERIFIED WEB-AWARD WINNER: I could not confirm any Awwwards/FWA recognition for this site -- its recognition is hospitality press / 'Best Boutique Hotel 2025 (MEXBEST)' for the property, not the website. I'm surfacing it because it is the purest aesthetic match to ballenacabo.com (which is itself the Ballena restaurant in Los Cabos, Grupo Hunan -- a restaurant, not a resort): warm, image-led, editorial, stillness over motion. Use it as a mood reference; drop it if you need every entry to carry a hard web-award credential. Confirmed live: active reservations + WhatsApp booking."
    }
   ]
  },
  {
   "refs": [
    {
     "name": "Mana Yerba Mate",
     "url": "https://en.manayerbamate.com/",
     "signature": "Awwwards Site of the Day (Mar 2023, score 8.03). The whole site is a scroll-driven 3D world: a 3D preloader/slider, bubbly liquid page transitions between flavors, colorful 3D can animations that spin and float as you scroll, and a playful Super-Mario-themed footer. Each flavor gets its own color universe rather than a spec sheet.",
     "whyItWorks": "It sells an energy drink by making the SITE feel energetic — the product's personality is the interaction model, not a claim in the copy. A single-SKU brand becomes a full experience because every scroll delivers motion and surprise, which is exactly the 'the page IS the concept' move for a bold food brand. The 3D can as hero also solves the buckssauce problem of one product needing to fill a whole page."
    },
    {
     "name": "Crescente Sicily",
     "url": "https://www.crescentesicily.com",
     "signature": "Awwwards Nominee + E-commerce Honors (Aug 2024, studio Ideology Creative). Signature moments: large animated banner text scrolling edge to edge, parallax layering of Sicilian pastry photography, kinetic type reveals, and 3D product visualizations that let you turn the confections. Framed as a 'sensorial journey' into the island's confectionery tradition.",
     "whyItWorks": "It fuses artisan heritage storytelling (traditional recipes, respect for history and nature) with modern kinetic type and 3D — proving 'premium + traditional' doesn't have to mean quiet or dusty. The oversized moving typography carries the brand voice while the parallax food photography does the appetite-appeal, a clean split of jobs worth stealing for any food/craft build. Strong model for a heritage Icelandic food brand that wants to feel contemporary."
    },
    {
     "name": "Graza",
     "url": "https://graza.co",
     "signature": "D&AD Graphite Pencil 2023 (Packaging Design; identity by Gander). The signature is COPY-AS-DESIGN: alliterative product system 'Drizzle / Sizzle / Frizzle' (finishing / everyday / high-heat), punchy one-word flavor descriptors ('Punchy', 'Mellow'), and radically honest headlines ('Olive oil the way it should be', 'Made by people who take olives very seriously') paired with the cartoon-olive squeeze bottle as hero.",
     "whyItWorks": "This is the purest buckssauce-family reference for VOICE: it wins on tone and naming, not heavy animation, so it shows that a bold single-brand food site can feel premium through confident writing and one strong illustrated product asset alone. It deliberately rejects faux-luxury heraldry for playful honesty — a useful antidote to the dark-gold-serif 'premium' reflex. Cheapest to emulate too, since the wow is language + one great product cutout, not a WebGL scene."
    },
    {
     "name": "Polène",
     "url": "https://www.polene-paris.com",
     "signature": "Awwwards Honorable Mention (Nov 2024). Signature is restraint at scale: a strict black-and-white palette, editorial full-bleed product photography, and slow, buttery custom transitions on Shopify Plus where the leather goods rotate and reveal their sculptural curves. Storytelling is carried by craftsmanship close-ups and material detail rather than loud copy.",
     "whyItWorks": "The quiet-luxury counterpoint to the three loud references — it proves the premium single-brand feel can also come from silence, negative space, and photography discipline. Worth including so the set spans both ends of the register: use Graza/Mana energy for a playful brand, Polène calm for a craft/jewelry brand where the material itself is the story. Its product-rotation reveal is a reusable pattern for any hero object (a jar, a ring, a bottle) that deserves to be turned in the hand."
    }
   ]
  }
 ]
}