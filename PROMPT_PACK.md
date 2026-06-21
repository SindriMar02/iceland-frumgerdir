# Redesign Prompt Pack — portable, copy‑paste

A reusable set of prompts distilled from the Icelandic redesign work, generalized for any
new client website. Fill in the brief once, then paste the phases in order. Each block is
self‑contained. Default language is **Icelandic**; swap `[LANGUAGE]` if needed.

> How to use: paste **PROJECT BRIEF** first, then **Phase 1 (build)**. After it builds, run
> **Phase 2 (review)**, then **Phase 3 (implement fixes)**, then **Phase 4 (motion)**, then
> **Phase 5 (audit)**. The Originality, Usability, Honesty and Accessibility rules are
> standing rules — keep them in context the whole time.

---

## PROJECT BRIEF (fill this in)

```
PROJECT BRIEF
- Company / brand:
- Industry / category:
- Current website (for understanding only, do NOT copy):
- Primary conversion goal: [bookings / online sales / inquiries / visits / presentation]
- Who the customer is:
- Language (default Icelandic):
- Tech stack: [e.g. Vite + React 18 + TypeScript (strict) + Tailwind v4 + Framer Motion + lucide-react]
- Real facts to honor (verify, never invent): services/products, prices, opening hours,
  location, contact, story, any claims. If a fact is unverified, do not state it.
- Hosting / route: [where it lives, e.g. a single page at /]
```

---

## STANDING RULES (keep these in context for every phase)

### Originality (creative direction)
```
You are not building a website, you are creating a digital experience and a brand world.
Start from the STORY, not a template:
- What makes this business unique? What emotion should a visitor feel? What makes it
  memorable? What experience should the site create? The design must EMERGE from that.
The default template is BANNED unless there is an exceptionally strong reason: large hero →
feature cards → alternating sections → testimonials row → CTA footer.
Define, before coding, a unique creative direction:
- concept name · mood · audience · core business story · visual system (exact palette) ·
  type pairing/treatment · layout system · motion language · signature interaction ·
  primary conversion goal.
Do NOT reuse across projects: hero structure, section order, palette, typography treatment,
animation style, button style, card layout, navigation pattern, image treatment, scroll
behavior. If two sites feel like the same designer in the same week, push one much further.
Every site needs at least ONE memorable "wow" moment — a signature interaction or sequence.
Mobile is designed intentionally, not stacked desktop.
```

### Usability (creativity must never hurt the task)
```
Be bold with design, disciplined with usability. The site must still answer fast:
What is this? What do they offer? Why trust them? Where are they? How do I take the next
step (book / buy / contact / visit)? A first-time visitor must understand the offer within
~5 seconds and act within a couple of taps.
Include the practical sections the business needs: opening hours, booking/CTA, product grid
or menu, service overview, location/map-style section, contact, trust/reviews, about/story,
gallery, FAQs, delivery/pickup, pricing where appropriate.
Never hide practical info behind effects. No scroll hijacking, no long intro delays, no
hidden navigation, no motion that delays or blocks tapping. Tap targets ≥ 40px. Obvious nav.
For shops: clear product cards, visible prices, an obvious add-to-cart, a visible/understandable
cart, simple quantity controls, a clear checkout path. For bookings: an obvious, short booking flow.
```

### Honesty & content integrity
```
- Use the current site/research only to understand the business; do NOT copy it.
- Sample copy/prices/reviews are fine but must be disclaimed in the footer as a concept/prototype.
- Invent nothing: no fake awards, no unverifiable claims (e.g. "lab-tested", "made in X",
  "the best") unless verified, no guessed emails, no invented people/quotes presented as real.
- Images must match their captions. If no honest image exists for something, go photo-light
  (typographic/illustrative) rather than mislabel stock.
- Never insult or criticize the current website, in copy or in outreach.
```

### Accessibility & performance (standing)
```
- Respect prefers-reduced-motion: gate every infinite/looping animation; the signature must
  degrade gracefully (static) under reduced motion.
- Keyboard operable: focus-visible rings everywhere (visible colour), custom widgets get
  proper roles/ARIA and arrow-key/Home/End support.
- WCAG AA contrast (≥4.5:1 normal text); put a scrim behind text over photos; small accent-on-dark
  text needs a light enough tint.
- Semantic HTML: exactly one <h1>, an <h2> per section, <h3> for cards, honest alt text,
  aria-hidden on decorative icons/SVG.
- Performance: animate transform/opacity only (no layout-shifting animations); hero image
  eager + fetchpriority high + srcSet/sizes, everything else lazy; no oversized assets;
  smooth on desktop, tablet, mobile.
```

---

## PHASE 1 — BUILD (the base redesign prompt)

```
Act as an award-winning (Awwwards-level) Digital Art Director, conversion strategist, brand
designer and principal UX engineer. Build a jaw-dropping, single-page interactive redesign
for [COMPANY] ([INDUSTRY]). Use the current site only to understand the business, offer, tone
and customer — do not copy it. It should feel like a dramatic before/after: premium,
emotionally rich, trustworthy, conversion-focused, and unmistakably custom (not a template).

Stack: [STACK]. One self-contained page with its OWN unique creative direction (define the
concept name, palette in exact hex, type pairing/treatment, motion language, mood, signature
interaction) per the Originality rules.

Include the sections this business actually needs (per the Usability rules): a stunning hero
with a clear value proposition + primary CTA, a problem/experience hook, the core offer
(services / products / menu / experience), why-choose-us / trust signals, a
location/atmosphere section, reviews if appropriate, a strong final CTA, and the practical
info (hours, contact, prices where relevant). Add a mobile sticky CTA, tasteful
micro-interactions and scroll reveals, and a clear primary conversion path.

Requirements: mobile-first and excellent on phone/tablet/desktop; WCAG AA; clean, fast,
production-quality code; verified imagery that matches the copy (go photo-light where no
honest image exists); honest sample data disclaimed in a footer; all [LANGUAGE] copy correct
and natural and fact-checked against reality (invent nothing).

Before building, verify imagery: assemble a small contact sheet of candidate photos and
visually confirm each matches its slot (guessed image IDs are wrong ~half the time). Then
build. Do not just produce a plan — implement the page and make the build pass.
```

---

## PHASE 2 — MULTI‑AGENT REVIEW (5 director lenses)

> Run as five separate reviewers, or one reviewer evaluating through all five lenses. Output a
> structured, prioritized spec (findings per lens + concrete fixes). Be specific and honest.

```
Review [the page] to elevate it to "send to a real owner / launch for a paying client" quality,
through five director lenses. Return prioritized, concrete findings (not vague praise).

1) DESIGN DIRECTOR — originality, visual identity, hierarchy, typography, spacing, composition,
   art direction, visual storytelling, colour, premium feel; handcrafted vs template. Is it
   memorable? Is there a wow moment? Does it feel tailored to THIS company? Could it go further?

2) UX & CONVERSION DIRECTOR — customer journey, navigation, booking/shopping flow, CTA
   placement, mobile usability, trust signals, information hierarchy, decision-making. Can a
   user understand the offer in 5 seconds and act quickly? Anything confusing? Is beauty
   hurting usability?

3) COPY & LANGUAGE DIRECTOR ([LANGUAGE]) — grammar, spelling, punctuation, wording, CTA labels,
   nav labels, headings, product/service descriptions, tone. Natural [LANGUAGE], no
   English-style phrasing, no awkward translations, professional but human. If Icelandic, check
   typography for Í Á É Ó Ú Ý Þ Æ Ö Ð: letter-spacing, clipping, line-height, uppercase
   treatments, heading spacing.

4) TECHNICAL & PERFORMANCE DIRECTOR — code quality, responsiveness, component quality,
   accessibility, reduced-motion support, animation performance, image loading, route
   structure, console/build warnings, broken links, semantic HTML. Would I confidently ship this?

5) BRUTAL CLIENT — as the business owner receiving this: Am I impressed? Do I feel understood?
   Would I reply / want this live? Does anything feel fake or unfinished? Does it increase trust
   in my business? Be brutally honest.

Also define a DISTINCT motion language for this site (concept / scroll / transitions / hover /
signature) that does not resemble any sibling site, and a prioritized implementation plan.
```

---

## PHASE 3 — IMPLEMENT THE IMPROVEMENTS

```
Implement the review's plan and all the language corrections. Do NOT just write a report.
Fix weak layouts, copy, navigation, CTAs, typography, spacing, mobile, accessibility,
conversion, and visual inconsistencies. PRESERVE and strengthen the site's identity, concept
and visual language — do not genericize it. Keep the build green (strict types, no unused
code), keep all practical info and the conversion path, keep one <h1> and per-section <h2>,
keep [LANGUAGE] correct and accent-safe. If something can't be verified, soften or remove it
rather than assert it.
```

---

## PHASE 4 — MOTION & TRANSITION PASS

```
Give this site its OWN motion language (must not match any other site's). Define and implement:
motion concept · scroll behavior · transition style · hover style · interaction style ·
signature motion moment.
Motion should feel expensive, intentional, cinematic, fluid and responsive — not gimmicky,
distracting, repetitive or slow. Use it to tell the story: e.g. scroll-linked / masked
reveals, layered parallax, animated typography, sticky storytelling, smooth content
transitions, animated navigation, elegant hover systems, animated product/service cards,
depth, a motion-driven CTA.
Constraints: respect prefers-reduced-motion (gate infinite loops; degrade to static); keyboard
+ touch friendly; animate transform/opacity only; no layout shift; no scroll-jacking; nothing
that delays or blocks tapping; smooth on mobile. Implement with [your animation lib]; for
continuous scroll-linked effects prefer a manual passive scroll listener over throttle-prone
scroll-progress hooks, and IntersectionObserver for reveals.
```

---

## PHASE 5 — FINAL VALIDATION (gate before "done")

```
Before finishing, verify and fix:
- build passes; lint/typecheck clean
- all routes work; no broken links
- mobile responsive (real 375px check; no horizontal overflow)
- console/build warnings checked
- typography: [LANGUAGE] accents (Í Á É Ó Ú Ý Þ Æ Ö Ð) never clipped; open leading, normal
  tracking on display, no overflow-hidden over accented text
- animations smooth and reduced-motion safe
- accessibility: one <h1>, per-section <h2>, focus rings, contrast AA, tap targets ≥40px,
  keyboard-operable custom widgets
- honesty: sample data disclaimed; no invented/unverifiable claims; images match captions
- the design still feels original, premium, handcrafted, and easy to use
Then report: what was built, what changed, build/test results, and anything to verify manually.
```

---

## APPENDIX A — natural [LANGUAGE] CTA / label vocabulary (Icelandic)

```
Skoða nánar · Bóka tíma · Bóka ferð · Bóka borð · Senda fyrirspurn · Hafa samband ·
Skoða vörur · Bæta í körfu · Finna okkur · Opnunartími · Matseðill · Vörur · Þjónusta ·
Versla núna · Skoða matseðil · Panta · Plana heimsókn
Greeting: use the person's first name if known (e.g. "Sæl [Nafn]," / "Sæll [Nafn],"),
otherwise "Góðan dag,". Use normal Icelandic punctuation. Do NOT use em dashes (—).
```

## APPENDIX B — build & verification notes (lessons that saved time)

```
- Verify imagery BEFORE building: contact-sheet candidate photos and eyeball them; guessed
  stock IDs are wrong ~half the time. Photo-light beats a mismatched photo.
- If the preview environment throttles requestAnimationFrame (animations look stuck in
  screenshots), verify via the DOM instead: read h1/h2 text, scrollWidth (overflow at
  375/1280), computed colours, console errors. Force framer elements visible before a
  screenshot, and don't trust scrolled screenshots.
- For a load-bearing scroll-driven signature, use a MANUAL synchronous/passive scroll listener
  (works + verifiable) rather than a scroll-progress hook that may not update in the preview.
- One creative direction per page; reviewers + builders should each touch only their own files
  to avoid conflicts when run in parallel.
```

## APPENDIX C — outreach email recipe (optional, if cold-emailing an owner)

```
Kind, respectful, human, confident-but-humble, never pushy or salesy, never AI-obvious, never
insults the current site, no em dashes. Structure:
1. Greeting (name if known, else "Góðan dag,")
2. Short intro: who I am, that I design and build websites.
3. Genuine company-specific compliment (product/place/experience/story).
4. Why I'm reaching out: "Ég tók mér það bessaleyfi að setja saman litla frumgerð að nýrri
   vefsíðu fyrir ykkur."
5. The live preview link.
6. The goal (clearer info / better mobile / easier booking or buying / stronger first
   impression / more trust) — specific to them.
7. Low-pressure close: "Þetta er að sjálfsögðu alveg skuldbindingarlaust, en ef ykkur líst vel
   á hugmyndina væri mjög gaman að heyra frá ykkur."
8. Signature.
Only use a publicly found email (with source); never guess an address or a name.
```
