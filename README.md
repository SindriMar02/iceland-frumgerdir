# Iceland Redesign Prototypes

Five interactive landing-page redesign concepts for Icelandic tourism businesses, built as a
single Vite + React + TypeScript app. Each prototype is a deliberately different creative
direction — these are **concept mockups for outreach**, not the businesses' real websites.

| Route | Business | Creative direction |
| --- | --- | --- |
| `/` | — | Gallery of all five prototypes |
| `/ice-tourism` | [icetourism.com](https://icetourism.com) | Arctic expedition · dark cinematic · glassmorphism |
| `/daeli-farm` | [daeli.is](https://daeli.is) | Warm countryside storybook · cream & moss |
| `/eldhestar` | [eldhestar.is](https://eldhestar.is) | Fire & hoofbeats · poster typography · ember |
| `/guesthouse-carina` | [guesthousecarina.is](https://guesthousecarina.is) | Boutique basecamp · direct-booking focus |
| `/gj-travel` | [gjtravel.is](https://gjtravel.is) | Legacy operator · Swiss-grid Nordic confidence |

**Stack:** React 18 · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide icons · React Router.
No backend. Images are Unsplash placeholder URLs with graceful gradient fallbacks.

## Run locally

```bash
npm install
npm run dev      # → http://localhost:5173
```

Other scripts:

```bash
npm run build    # type-checks (tsc -b) and builds to dist/
npm run lint     # eslint
npm run preview  # serve the production build locally
```

## Deploy

### Vercel

```bash
npm i -g vercel
vercel           # accept defaults — Vite is auto-detected
```

Or connect the repo at [vercel.com/new](https://vercel.com/new). So that deep links like
`/eldhestar` work on refresh, add a `vercel.json` rewrite (single-page app):

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Netlify

```bash
npm run build
# drag the dist/ folder onto https://app.netlify.com/drop
```

For deep links, add a `public/_redirects` file containing:

```
/*  /index.html  200
```

## Sharing a prototype with an owner

1. Deploy the app (above) — you get one URL, e.g. `https://your-site.vercel.app`.
2. Each prototype lives at its route: `https://your-site.vercel.app/eldhestar`, etc.
3. **Open the gallery (`/`) first**, then navigate to a prototype and press the floating
   **“Senda frumgerð”** button (bottom right). The modal contains, per company:
   - the preview-URL field — paste your deployed link once and every other prototype
     derives its own URL automatically (stored in your browser),
   - a suggested Icelandic subject line (copyable),
   - a full Icelandic outreach email (copyable, or open directly in your mail app).
4. Send the **direct route link** to the owner. Pages are mobile-first, so they look right
   on the owner's phone.

**Owner-safe by design:** the send button and the back-to-gallery chip only appear after
you've visited the gallery in the same browser session (or with `?tools` appended to any
URL). An owner opening their direct link sees a completely clean page — no outreach
tooling, no gallery of the other four pitches.

## Editing content

All company facts, card copy and the **Icelandic outreach emails** live in one file:

```
src/data/companies.ts
```

> The current email texts are drafts. If you have your own exact outreach emails, paste them
> over `emailSubject` / `emailBody` there — keep the `[HLEKKUR Á FRUMGERÐ]` placeholder where
> the preview link should be injected. The file header documents the tone rules the drafts
> follow (plural address, no bullet lists, an explicit no-pressure closing).

Page-level copy (headlines, sections, sample prices/reviews) lives in each page component under
`src/pages/`. Shared building blocks (preview modal, sticky mobile CTA, scroll reveals,
prototype disclaimers) are in `src/components/`.

## Honest-content note

All prices, review quotes and ratings in the prototypes are **illustrative samples**, clearly
disclaimed in each page footer ("Prototype only — redesign concept"). Replace them with real
data before any production use.
