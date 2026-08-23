# Eyjatours — Claude Design handoff

**Goal of this pass: kill the template feel.** A working redesign already ships at
`/preview/eyjatours` (React + Tailwind v4 + Framer Motion). It is clean, on-brand and
WCAG-AA, but the *composition* still reads as a recognisable marketing-page skeleton
(hero → trust row → split → card grid → split → quotes → form → CTA). We want a single
art-directed pass that makes it feel **handcrafted and unmistakably this island**, not a
good template. Keep all the facts, assets and guardrails below; push the *form*.

Deliver a self-contained `Eyjatours.dc.html` (one file, inline CSS, real images via the
URLs below) that we can port back to React, the same way the bakery handoff came in.

---

## 1. The business (cold facts, all true)

- **Eyjatours** — puffin & volcano boat/land tours on **Heimaey, Vestmannaeyjar** (the
  Westman Islands), off Iceland's south coast.
- Small, **family-run ~12 years**. Owner & guide: **Einar Birgir Baldursson, "Ebbi"**,
  born and raised on the island.
- Audience: **international visitors** deciding whether to ferry over and book. **English-first.**
- Contact (verified, real): `eyjatours@eyjatours.is` · `+354 852 6939` ·
  **Básaskersbryggja 8** (at the harbour). Ferry: Herjólfur from Landeyjahöfn, ~35 min
  (`herjolfur.is`).
- Three tours: **Puffin & Volcano** (flagship, Apr–Sep) · **The Best of Vestmannaeyjar**
  (winter, Oct–Apr) · **The Viking Town** (short, all year). Each visits some of: the
  puffin cliffs, the 1973 Eldfell lava, the reconstructed Viking-age stone house, a taste
  of local food.

## 2. Brand assets

- **Logo (KEEP IT):** `public/eyjatours/brand/logo.png` — a white puffin badge over a
  half-disc scene (maroon volcano, sea-stacks, a teal/gold/coral "kite" wing) with a navy
  `EYJATOURS / VESTMANNAEYJAR` wordmark. Navy wordmark needs a light/frosted backing to
  read; the puffin and its colour-arc are a gift — use the arc as a recurring motif.
- **Palette (locked, AA-checked — reuse these exact hex):**
  - Deep ocean ink `#0C2A31` (primary dark ground) · raised `#0F353E` · lifted `#16505C`
  - Warm bone `#F3EFE4` (light ground) · card `#FBF8F0`
  - Text: on-dark `#EAF3F1`, muted-on-dark `#A2C0C0`; on-light `#13282C`, body `#3D4F51`
  - Accents (the "puffin spectrum"): coral `#E5573E` (decorative) / **`#EE6A4F` for any
    ink-text-on-coral fill** (AA 4.9) / coral-as-text-on-light `#BC3A22` / gold `#E0A53A`
    / teal `#39ADB4` · eruption ground maroon `#481D27`, lift `#6A2A33`.
- **Type:** **Familjen Grotesk** (display, characterful — exploit it) + **Hanken Grotesk**
  (body). Both already loaded. Push scale contrast hard; Familjen can go big and editorial.

## 3. Verified facts (do NOT invent or overstate)

- **1973 Eldfell eruption:** began ~01:55, **23 Jan 1973**, a fissure ~1 km from town;
  ~**5,300** islanders evacuated by fishing boat within hours; erupted ~**5 months**;
  ~300–400 buildings buried (about a third of the town); crews **pumped seawater** onto the
  lava (first full-scale attempt) and **saved the harbour** (lava stopped ~100 m short);
  island grew ~**2 km² / ~20% larger**; new ~**200 m** cone **Eldfell**; town dug back out
  and rebuilt → "**Pompeii of the North**" (Eldheimar museum).
- **Puffins:** ~**1.6 million** — phrase as "**one of the world's largest** Atlantic puffin
  colonies, often called the largest" (not a hard census). Season ~**mid-Apr to mid-Aug**,
  peak Jun–Jul. The **"pysja" puffling patrol**: each Aug–Sep islanders rescue stranded
  pufflings.
- **Surtsey:** UNESCO island born 1963–67, southwest of Heimaey; **landing forbidden**, seen
  from the water only.
- **Archipelago:** ~**15 uninhabited islands + ~30 skerries**; **Heimaey** the only inhabited
  one, pop ~**4,300**.

## 4. Vetted imagery (already screened — use these exact Unsplash IDs, they are honest)

Base URL `https://images.unsplash.com/<id>?q=80&w=2000&auto=format&fit=crop`.

| Slot | ID | Note |
|---|---|---|
| Hero (bright puffins, clifftop over sea) | `photo-1612564148954-59545876eaa0` | room for type |
| Moody puffins on a clifftop | `photo-1499597308780-f76e4f53c08a` | darker, dramatic |
| Single puffin portrait | `photo-1596482349369-14b1dd2ce0ae` | iconic |
| Dramatic basalt sea cliffs | `photo-1742514750207-83b3e38b75b0` | colony cliffs |
| Island harbour town under a peak | `photo-1671839308844-a2b488df9de5` | evokes Heimaey |
| Glowing lava (eruption chapter) | `photo-1617191979724-f755c6d83e01` | maroon section |
| RIB tour boat, cold water | `photo-1770828310731-809268662aa3` | the boat |
| Lone sea stack in the Atlantic | `photo-1772643465053-2581be059942` | archipelago/CTA |
| Skipper in the wheelhouse | `photo-1528582500408-f8eeefb9bc95` | "Meet Ebbi" (neutral) |

## 5. What exists now (keep the substance, rework the form)

Route `/preview/eyjatours`. Sections, top to bottom: frosted-pill nav (logo) · hero ·
4-fact trust band · intro split · **3 tours** (flagship feature + two cards) · **archipelago
illustrative map** (self-drawing route, clickable isles — our signature; keep & deepen) ·
**1973 eruption chapter** (count-ups on maroon) · Meet Ebbi split · 3-col reviews · plan +
**booking-request panel** (tour/date/guests → live ISK total → prefilled email) · final CTA.
The **booking panel and the archipelago map are load-bearing — keep their function.**

## 6. What reads as "template" — fix these

1. **Section rhythm is the standard funnel.** Three sections share the same 2-col
   image+text split (intro, flagship, Meet Ebbi). Break it: asymmetry, full-bleed editorial
   moments, overlapping/layered comps, one genuinely unconventional section.
2. **Generic components:** the 4-icon trust row, the 3-equal review cards, the standard tour
   card grid, eyebrow-over-headline on every section. Re-imagine at least the trust band and
   reviews into something designed, not stock.
3. **Hero is premium-but-common** (full-bleed photo, bottom-left text). Make it a *moment*:
   kinetic Familjen type, the logo's colour-arc as motion, layered puffin/cliff depth,
   unexpected composition.
4. **Motion is mostly fades.** Add a real signature beat (the archipelago map is the natural
   one — make it more spatial/immersive) and motivated micro-interactions.
5. **Typography is safe.** Familjen has personality — use dramatic scale jumps, an oversized
   editorial pull-quote, expressive numerals on the 1973 stats.

## 7. Hard guardrails (these override any creative urge)

- **Keep the real logo.** Don't redraw the brand.
- **Honesty:** NO "#1 on TripAdvisor" and NO "recommended by Rick Steves" (unverified). Puffin
  colony stays hedged ("one of the largest"). Prices and review quotes are **sample data,
  disclaimed in the footer** — keep them realistic, not fake-precise. 1973 facts must match
  Section 3.
- **No dashes.** Zero em-dash (—) or en-dash (–) anywhere a visitor can see (headlines,
  labels, body, buttons, the booking email subject). Use periods, commas, colons, hyphens.
- **WCAG AA.** Body ≥ 4.5:1, large ≥ 3:1. Any ink text on coral must use `#EE6A4F`, not
  `#E5573E`.
- **Motion must be compositor-only — NO scroll-jacking or pinned/scrubbed heroes** (the
  client rejected jitter). Use IntersectionObserver reveals, CSS entrances, transform/opacity.
  Hero content must never gate its visibility on a JS mount animation (start visible).
- **Mobile-first**, designed intentionally (not stacked desktop). One sticky "Book" CTA.
  Tap targets ≥ 44px. English-first; Icelandic only for place/product names (spelled
  correctly: Heimaey, Vestmannaeyjar, Stórhöfði, Eldfell, Surtsey, Básaskersbryggja).

## 8. Deliverable

One `Eyjatours.dc.html` (inline CSS, the image URLs above, the real logo), art-directed to
feel handcrafted. We port it back to the React page. Optimise for: *would a visitor remember
this island tomorrow?*
