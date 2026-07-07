# Rakarastofa Björns og Kjartans — Job Brief

This file tells you what your job is and gives you every verified fact you need. It deliberately does
**not** tell you what the design should look like — palette, typography, layout, signature moment, all
of that is entirely yours to decide. Design it however you think is right.

---

## Your job

Redesign the website for this real, currently-operating barbershop in Selfoss, Iceland, as a
standalone prototype in this repo. It's a cold-outreach pitch — the owners haven't asked for this and
don't know it exists yet, so nothing gets sent to them until Sindri reviews and approves it.

Build a complete, real landing page (not a thin 3-4-section teaser) at:
- Route: `/preview/rakarastofa`
- Page: `src/preview/rakarastofa/Page.tsx`
- Data: `src/preview/rakarastofa/data.ts`

Register it the same way every other page in this repo is registered — add an entry to
`src/preview/companies.ts` (follow the existing `PreviewCompany` interface exactly) and a lazy route
import in `src/App.tsx`. Check a couple of sibling folders under `src/preview/` for the pattern before
you start; match this repo's existing conventions for shared components (`PreviewFooter`, the
reveal-on-scroll pattern, etc.) rather than reinventing infrastructure.

When you're done: `npm run lint && npm run build` must be clean, then `git add` only the files you
touched, commit, and `git push main` (auto-deploys to GitHub Pages in ~30s). Leave an Icelandic outreach
email draft in `companies.ts` — do not send it, that decision belongs to Sindri.

---

## The company — verified facts only

**Name:** Rakarastofa Björns og Kjartans
**Founded:** 1948, by Gísli Sigurðsson
**Current owners/staff (named on their own site):** Björn Ingi Gíslason, Kjartan Björnsson, Björn Daði
Björnsson (owners), plus Guðrún Þórhallsdóttir, "Mó", and Fannar Aron Hafsteinsson
**Address:** Austurvegur 4, 800 Selfoss (South Iceland)
**Phone:** 482-2244
**Email:** rakarastofa@gmail.com
**Hours (as published on their site):** Monday–Friday 9:00–17:00, Saturday 9:30–12:00, closed Sunday
**Booking:** they take bookings via Noona — https://noona.app/rakarastofabk
**Facebook:** ~2,572 likes (independent search finding — re-verify current count before using it)
**Possible second location:** independent search turned up a related/sister shop called **"Kjartan
Rakari"** at Unnubakki, Þorlákshöfn, and a directory listing for "Rakarastofa Björns og Kjartans
Miðgarði." I could not confirm from the primary site whether these are currently-active branches of the
same business or a separate related shop — call 482-2244 to confirm before stating anything about a
second location in the redesign.

No prices are published anywhere (not on the site, not found elsewhere). Don't invent any — if you want
a pricing section, label it as a sample/placeholder the way every other prototype in this repo does.

No customer reviews/testimonials are published on their own site. If you want a reviews section, the
same sample-and-disclose convention applies — don't fabricate real-sounding quotes attributed to real
people.

---

## Current website — what exists today

Live at `https://rakarastofan.is/` — a single-page, free WordPress.com site. This is the entire content,
verified by fetching the raw page source directly:

- Page title / header: "Rakarastofa Björns og Kjartans – Stofnuð 1948"
- Navigation: just "Home" — no other menu items, no sub-pages
- One CTA button: "Bóka tíma í klippingu" (linking to the Noona booking page above)
- One paragraph of body copy naming the location and all 6 staff members
- One line noting the 1948 founding and founder's name
- One photo (see below)
- A contact card: address, phone, email
- Hours
- Social share buttons (X/Facebook)
- Standard WordPress.com chrome: "A WordPress.com Website" footer credit, sign-up/log-in links,
  "Copy shortlink," "Report this content," and — oddly, for a barbershop homepage — a live WordPress.com
  **comment form** ("Loading Comments... Write a Comment... Email (Required) Name (Required) Website")

That's the whole site. No services list, no price list, no shop interior photos, no individual staff
photos, no map, no second page of any kind.

### The one photo on the site

The homepage's single photo is a genuine vintage black-and-white photograph — an older man in glasses
giving a small child a haircut, clearly decades old based on the print grain and decor visible in the
background. Filename metadata suggests it was uploaded from a Facebook post in 2018 and added to the
site in 2023. This is very likely a real historical photo of the shop's founding era (possibly Gísli
Sigurðsson himself, though that isn't stated anywhere, so don't claim it definitively as him). It's a
genuine, moving, non-stock asset tied to the real 1948 founding story — worth knowing this exists before
you decide whether/how to use imagery. It's saved locally at:
`/Users/sindri/Documents/Website redesign mockups/iceland-redesigns/src/preview/rakarastofa/reference/rakarastofa-hero-vintage.jpg`
(copy it there if it isn't already, from the source URL:
`https://rakarastofan.is/wp-content/uploads/2023/03/39086604_2526530124027605_8273819462801555456_n.jpg`)

### The current logo

Their current logo is saved locally for reference at:
`/Users/sindri/Documents/Website redesign mockups/iceland-redesigns/src/preview/rakarastofa/reference/rakarastofa-logo-current.jpg`
(source: `https://rakarastofan.is/wp-content/uploads/2020/09/cropped-rakarastofa-bogk-logo-2017-minni.jpg`)

Describing what it actually looks like, factually: a gray serif-font arched wordmark reading
"Rakarastofa," above large black outlined/drop-shadowed display lettering reading "Björns & Kjartans"
in a bold decorative typeface, with a small barber-pole clip-art icon next to the ampersand, the whole
thing framed inside a double-ruled rectangle border. Whether to keep any part of this, redraw it, or
replace it entirely is your call to make — this brief isn't telling you the answer, just what exists
today so you're working from the real thing and not a guess.

---

## Standing rules for this repo (process, not design)

These apply to every prototype in this project — not design instructions, just the guardrails:

1. **Honesty.** Don't invent facts that aren't in this brief — no fabricated reviews, no invented
   pricing presented as real, no staff details beyond the 6 names given, no claims about the Þorlákshöfn
   connection beyond what's stated above (unverified). If you add any sample/placeholder content
   (pricing, reviews), label it visibly as a sample, matching how other pages in this repo do it.
2. **Complete, not sparse.** Build a real, full landing page — this repo's standing bar is roughly
   8–11 sections, not a thin teaser.
3. **Imagery/credits.** If you want AI-generated imagery, do not call the Higgsfield MCP tools directly
   — they spend real credits even on "unlimited" models. Either ask Sindri to generate via the
   Higgsfield **web app** (Unlimited toggle on, zero cost) and hand you back a result URL, or source
   real photography, or design the page so it doesn't need to be photo-heavy at all.
4. **SEO baseline.** Same as every other page here: crawlable prerendered HTML, a sensible
   `LocalBusiness` JSON-LD block with the real NAP (name/address/phone) above, sensible
   `<title>`/meta description.
5. **Accessibility bar.** One `<h1>`, a real `<h2>` per section, computed (not eyeballed) AA contrast,
   `prefers-reduced-motion` support, visible focus states, 44px+ touch targets.
6. **Outreach stays a draft.** Write the Icelandic outreach email into `companies.ts` per this repo's
   existing tone/format convention (check a sibling entry) — do not send it.

That's everything factual. The design itself — direction, mood, palette, type, layout, whether or how
to use the vintage photo or the existing logo, whether there's a "signature moment" and what it is — is
entirely up to you.
