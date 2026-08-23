# Rakararnir á Klapparstíg 40 — build brief

**Concept codename: `Ekkert eins` (nothing matches)**

> The shop is a room where no two chairs are alike, plants crowd every sill, a
> Christmas bulb-tree lives on a mint cabinet, rainbow flags stay up all year,
> and a hand-lettered card in the window says DROP INS WELCOME. It works
> because none of it matches. The site is built the same way: a warm, drawn
> collection of their own objects, held together by one gold arch.

---

## 1. Why this, and why not the last three

Three builds were rejected. All three failed the same way and the diagnosis
below drives every decision in this brief.

| Attempt | What it was | Why it failed |
|---|---|---|
| Lifandi glugginn | Sun-driven living window | Concept was interesting, skeleton underneath was still hero → split → cards → block |
| Porem transplant | Copied porembarbershop.nl | A transplanted layout reads as a template because it is one |
| Verðtaflan | Price board / catalogue index | Structure was genuinely fresh; the **flat green duotone on every image** drained it |

**Standing rule for this build:**

1. **No transplanted layout.** References supply *devices*, never a page shape.
2. **No duotone.** Photographs stay in natural colour. The last build proved a
   single-ink treatment flattens the whole page.
3. **Photography is never structural.** It is supporting evidence at modest
   size. Their nine photos measure 1.8-2.6 source px per CSS px at plate size
   and fall apart above that. Nothing full-bleed, nothing upscaled.
4. **The drawn language carries the page.** Verified on live sites, not from
   memory. The illustration-heavy brands measure like this at first paint:

   | Live site | Inline SVGs | Ground | Accent |
   |---|---|---|---|
   | [flamingoestate.com](https://flamingoestate.com) | 129 | `#FCFBF6` | olive `#45523E` |
   | [diasporaco.com](https://diasporaco.com) | 81 | `#FFFDF3` | green `#007E00` + magenta `#A40058` |
   | [yellowbirdsauce.com](https://yellowbirdsauce.com) | 65 | full field `#FFE845` | black line |
   | [graza.co](https://graza.co) | 36 | sand `#F6E6D9` | acid `#D1E030` + olive `#3C422E` |

   All four survive on drawn marks rather than photography, which is exactly
   Rakararnir's constraint. **yellowbirdsauce.com is the clearest case**: a full
   colour field, one big drawn mascot, and even the cookie banner drawn as a
   comic panel.

   > CORRECTION: an earlier draft cited littleamps.com. That domain is now
   > parked and for sale; the Mobbin capture is of a site that no longer exists.
   > Do not send Sindri there.

---

## 2. What is uniquely theirs

Everything below is verified from their own photographs or listings. This is the
raw material the design is made from, and none of it is available to any other
barbershop in Reykjavík.

- **The gold arched signwriting** on the corner glass: RAKARARNIR over
  KLAPPARSTÍGUR 40. Hand-painted, gilded, slightly worn.
- **The green corrugated iron building** with oxide-red roof and window frames.
  Classic old Reykjavík bárujárn, on a corner, all glass at street level.
- **DROP INS WELCOME** hand-lettered card in the window. Their own words, and
  the entire commercial proposition.
- **Rainbow flags in every windowsill, all year**, visible in both summer and
  winter photographs.
- **Plants everywhere**: barrel cactus, fern, fig, yucca.
- **Mismatched vintage furniture**: no two waiting chairs alike, a brown
  mid-century armchair beside a black Windsor beside a metal-framed one.
- **A real barber pole** turning in the corner window.
- **A white porcelain hydraulic chair** in the middle of the floor.
- **A vintage Icelandic bulb-tree** on a mint-green cabinet.
- **"Klappó"** — their own nickname for the street, used in their own posts.
- Two audiences: locals, and tourists a minute off Laugavegur.

---

## 3. Design tokens

### Colour — generous fields, not flat ink

The previous build failed by pushing everything through one green. This one uses
their colours **as full fields** (the Yellowbird / Faire device), with
photographs left in natural colour on top.

| Token | Value | Role |
|---|---|---|
| `--bone` | `#F4F1E8` | Warm paper ground, the default field |
| `--green` | `#3B5434` | Their corrugated iron. Full-field sections |
| `--green-deep` | `#233019` | Footer, deepest field |
| `--oxide` | `#A24E36` | Their window frames. One full field + all CTAs |
| `--gold` | `#B8892C` | The signwriting. The arch, rules, small marks only |
| `--ink` | `#1A1D14` | Body text on bone |
| `--chalk` | `#FAF8F2` | Text on green and oxide fields |
| `--sage` | `#8FA37C` | Drawn-mark secondary, quiet-hours grid |

**Field rhythm** down the page: bone → green → bone → oxide → bone → green-deep.
Never two coloured fields adjacent. Photographs appear only on bone.

### Type

| Role | Face | Notes |
|---|---|---|
| Display | **Bricolage Grotesque** | Already loaded. Warm, real character, variable width axis. Not a serif cliché, not a cold grotesk |
| Body | **Karla** | Already loaded. Humanist, warm, excellent at small sizes |
| Meta / prices / hours | **Space Mono** | Already loaded. Tabular figures, shop-ticket voice |

Zero new fonts. The gold arch is drawn artwork, not type, so it never competes
with the display face.

> **One thing to check on sight:** Bricolage is the single call here I would
> want your eye on before committing. If it reads too contemporary against the
> gilded arch, the fallback is Bitter (warm farmhouse slab, also loaded).

### Shape and spacing

- Radius **0 everywhere** except the drawn marks themselves and full-pill CTAs.
- Rules are `1.5px` gold on bone, `1px` chalk at 20% on coloured fields.
- Section padding `clamp(4rem, 9vw, 7rem)`.
- Max sheet width `1160px`.

---

## 4. The drawn language (Higgsfield)

This is the highest-leverage item in the brief and the thing that makes the page
unmistakably theirs. **Ten marks, one ink, one hand**, drawn from objects that
are actually in their shop.

1. Barber pole (the one in their window)
2. The white porcelain hydraulic chair
3. Barrel cactus in a terracotta pot
4. Fern
5. The green corrugated-iron house on its corner
6. Scissors and comb crossed
7. Shaving brush
8. The vintage bulb-tree
9. A small rainbow flag on a stick
10. A dog on the pavement (there is one in their own dusk photo)

**Spec for generation:** single-weight ink line, no shading, no colour fill,
slightly imperfect hand-drawn quality, transparent background, consistent stroke
weight across the whole set, drawn as if by the same person in one sitting.
Each one generated square, then cut out to transparent PNG.

**Where they are used**
- Section markers, replacing numbers and eyebrows entirely
- Between rows in the price list, in the margin
- As the bullet in every list
- Scattered at low opacity in the footer field
- One large (the house) as the map/location marker

**Cost:** ten cheap image generations, well inside the standing allowance.
Nothing else needs generating; the four existing plates stay as-is and the band
image is already at 4K.

---

## 5. Page plan, section by section

Eleven blocks. Every one names its component and its field colour.

| # | Block | Field | Content | Component / device |
|---|---|---|---|---|
| 1 | **Rail** | bone | Name, address, live OPIÐ/LOKAÐ, IS/EN | Hand-built. Sticky, 1 line |
| 2 | **Masthead** | bone | The gold arch large, `Engin tímapöntun. Þú gengur bara inn.`, address, phone | Hand-built. **Text Reveal (Mask)** on the claim only |
| 3 | **Drop-ins** | **green** | The DROP INS WELCOME story, their own sign reproduced, the 100% / 9 reviews figure | Hand-built. Drawn marks in margin |
| 4 | **Verðskrá** | bone | Six services, mono prices, honest placeholder note | **Scroll 01** — photo pins and swaps per service |
| 5 | **Stofan** | bone | The room: their real interior photos, natural colour | **Gallery Hover Carousel** *(your pick)* |
| 6 | **Rólegast** | bone | Quiet-hours grid, the dead-time offer | Hand-built table, sage/bone cells |
| 7 | **Öll velkomin** | **oxide** | Pride flags all year, in their own words | Hand-built. Drawn flag mark, their real photo |
| 8 | **Hornið** | bone | The building, address, map link, "Klappó" | Drawn house mark + their real building photo |
| 9 | **Ekkert eins** | bone | The mismatched chairs, plants, bulb-tree — the shop's character | **Interactive Image Gallery** *(your pick)* — scattered, blur-others-on-hover. Its randomised placement literally *is* the concept |
| 10 | **Á íslensku** | bone | Tourist phrase list, IS / EN / pronunciation | Hand-built 3-column ledger |
| 11 | **Footer** | green-deep | Hours, phone, socials, arch small, drawn marks at low opacity | Hand-built |

**Component notes — CORRECTED after reading the actual source**

Both picks were retrieved from 21st.dev and inspected. Neither ships as-is, and
one of them does not do what its description claims.

**Interactive Image Gallery (id 9181) — description is wrong.** It advertises a
"randomised, floating arrangement" where "each time the page loads, images and
text appear in different positions". The source contains no randomisation at
all: it is `flex flex-wrap justify-center items-center gap-8`, and the
`position?: string` field in its own interface is never read. The only real
behaviour is six lines of hover state:

```jsx
hoveredId && hoveredId !== item.id ? "blur-sm opacity-50" : "opacity-100"
```

Consequence for this brief: **the randomised scatter that makes block 9 the
literal expression of `Ekkert eins` does not exist and must be hand-written.**
Keep the blur-others-on-hover idea, write the scatter ourselves (seeded offsets
and slight rotations per item, stable across renders, collapsing to a plain
column under 760px and under reduced motion).

**Gallery Hover Carousel (id 5562) — real mechanic, heavy wrapper.** The useful
part is genuine and is about ten lines: the image is `h-full` and transitions to
`group-hover:h-1/2`, with a text panel fading up beneath it. Worth taking. What
comes with it is not: `next/image` and `next/link` (this is Vite), a bespoke
~300-line motion-based `Carousel` with its own context and drag handling,
`motion/react` instead of the repo's framer-motion, four npm dependencies, and
shadcn theme tokens (`bg-background`, `text-muted-foreground`, `text-primary`)
that do not exist here and render invisible.

**Decision: take the mechanics, write the components.** Roughly sixteen useful
lines across both. The repo already has horizontal-scroll-row patterns, so the
carousel wrapper is not needed.

- **Compare Slider (before/after)** stays **held back** until the shop supplies
  one real before/after pair. Add as block 5b that day.
- Any future 21st adoption: rewrite every theme token to this palette, scope
  global listeners, swap Next-isms, and read the source before trusting the
  description.

---

## 6. Motion

Restrained. A warm printed-feeling page that flies around contradicts itself.

- Section reveals: 10px rise + fade, IntersectionObserver + CSS transition.
  Never `whileInView`.
- The claim in block 2: word-mask rise, once, on load.
- Gallery hover states: the components' own physics, reduced-motion gated.
- Live status dot: slow pulse when open, static when closed.
- **No** scroll-jacking, **no** pinned heroes, **no** parallax, **no** Lenis.

---

## 7. Content and honesty rules

- **Bilingual IS/EN**, both written as originals. Auto-detect, persist, toggle
  in the rail.
- **Marked placeholder on screen in both languages:** all prices, the service
  list, the quiet-hours grid.
- **Never invented:** staff names, testimonials, customer quotes. The real
  "100% of 9 reviews" is shown as the real number with a link out.
- **Hours** print as Mon-Fri 10:00-18:00 but need owner confirmation before any
  email goes out.
- **Generated imagery is never presented as this shop.** Craft and material only.
  Identity-bearing images are their own photographs. Footer discloses the mix.
- **Never borrow the 1918-2017 heritage.** That was a different business.
- No em-dashes anywhere in customer copy. Icelandic gender agreement checked on
  every invented noun phrase.

---

## 8. Build order and gates

1. Generate the ten drawn marks, cut to transparent PNG, eyeball every one.
2. Lock tokens in code. Screenshot the masthead alone. **Gate: show Sindri
   before building further.**
3. Blocks 1-4, then screenshot. **Gate: show Sindri.**
4. Blocks 5-11.
5. Full QA sweep: contrast, tap targets, overflow desktop + mobile, alt text,
   reveals, reduced motion, image sharpness (every image ≥ 1.5 src px per CSS
   px), zero dashes, console clean.
6. `tsc` + eslint + `npm run build`, all exit 0, capture real exit codes.
7. Visual pass at 1440 and 390. The metrics passing is not the same as it
   looking good.

**Two gates before the whole page exists.** Three full builds have been rejected
at the end; this one gets checked at the masthead and again at the halfway mark.

---

## 9. Open items

- **No owner email exists.** Phone 551 3010 or a Facebook DM only. Standard
  outreach flow does not apply.
- Real prices, real service list, real quiet hours, staff names.
- One before/after pair unlocks the Compare Slider block.
- 21st.dev MCP disconnected this session; the two picked components are simple
  enough to rebuild by hand if it stays down.
- Assets already on disk at `public/rakararnir/` (13 files): nine real
  photographs, four generated plates, two of them 4K. Do not re-harvest.
