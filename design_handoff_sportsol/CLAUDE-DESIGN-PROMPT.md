# Prompt for Claude Design — Sportsól total redesign

Copy everything below the line into Claude Design. Upload the video file first (see THE VIDEO section) and adjust its filename in the prompt if yours differs.

---

Act as an Awwwards-jury-level art director and creative developer. Completely redesign this landing page from scratch — you have full creative freedom on layout, motion language, and structure, but hard constraints on brand, facts, and honesty listed below. The result must be jaw-dropping: a page a small Icelandic business owner opens and immediately understands their business has been reimagined at a level they have never seen, with beautiful, purposeful animations throughout.

## The business

Sportsól is a tanning salon (sólbaðsstofa) with two brand-new locations in the Reykjavík capital area. Everything runs on modern equipment and online booking via Noona. The single conversion goal of the page: get people to book a session at https://noona.app/sportsol ("Bóka tíma" is the ONLY booking verb allowed, used everywhere).

Current live site being replaced: https://sportsol.is (a Shopify template where all offers are baked-in image banners in mismatched styles, unreadable on phones and invisible to Google). My previous prototype iteration: https://sindrimar02.github.io/iceland-frumgerdir/preview/sportsol/ — study it, keep what is strong (the UV-tube flicker concept tested extremely well), but you are not bound by it. Outdo it.

## THE VIDEO — the centerpiece

I have uploaded `sportsol-x10.mp4`: a 1080p, slow, cinematic showcase of the Luxura X10 tanning bed (slow camera movement around the machine, premium product-film feel). This is the only real footage we have, and it should be the visual crown of the page. Requirements:

- Use it BIG — as the full-bleed hero background or as a cinematic pinned/expanding showcase moment for the beds section. Not a small thumbnail in a card.
- `autoplay muted loop playsinline preload="metadata"` + a `poster` frame so the first paint is never black.
- Text placed over it must sit on a gradient scrim and hold WCAG AA contrast at every frame — assume the footage has both bright and dark passages.
- Respect `prefers-reduced-motion`: show the poster frame instead of autoplaying.
- Do not stretch 1080p beyond its quality: cap the rendered size or add a subtle darkening/grain treatment so upscaling artifacts never show.
- One tasteful idea worth exploring: the video plays inside a huge rounded "bed canopy" frame that expands to full-bleed as you scroll into it, then releases.

## Brand — non-negotiable

- Use the original logo file exactly as-is (neon-fuchsia palm logotype, `logo.png` in this project). Never recolor it, never redraw it as text, never place it on busy footage without a scrim.
- The whole palette derives from the logo's fuchsia #F810F0. Accent tones already computed for accessibility: #A6009F for small fuchsia text on light grounds (6.4:1), #B500AE for button fills behind white text (5.9:1), #FF6BF7 as the accent on dark grounds (8:1). One accent hue only. Warm gold/coral may appear ONLY inside decorative gradients, never as text or fills.
- Dark-ground world: deep plum #170623 / #12051C (the "UV room"). Light-ground world: warm sun-white #FFF8EE. Pick one theme rhythm and lock it; no random section flips.
- Typeface history, learn from it: Britney (fashion-didone) was rejected as "too much"; Panchang (wide techno) "did not fit". Cabinet Grotesk (current) was approved because it is calm and lets the logo carry the personality. You may keep Cabinet Grotesk or propose ONE alternative with the same discipline: a clean contemporary grotesk, never a display serif, never anything louder than the logo.

## The signature motion (evolve, don't discard)

The approved wow-moment concept: the landing opens as the UV room — vertical tanning-tube light bars strike to life with a realistic staggered fluorescent flicker (failed strike, stutter, full blaze), then keep humming forever with irregular per-tube micro-flickers. No timer, no click-gating — pure ambience. Reference implementation exists in the current prototype (steps() keyframes, per-tube delay/duration variance, will-change: opacity for cheap compositing, reduced-motion renders steady-on). Evolve this idea however you like — combine it with the X10 video, sync a tube-strike to the video reveal, let the hum subtly tint neighbouring content — but the fluorescent-strike realism and the always-on calm hum must survive. Do NOT bring back a session timer or countdown gimmick (explicitly removed in an earlier round).

Beyond the hero, every animation must be motivated (hierarchy, storytelling, feedback, or state change): scroll-triggered reveals with real choreography, price numbers that tick when they change, cards with genuine hover physics (lift + shadow response + press scale), and at least one more memorable scroll moment of your own invention. All motion honors prefers-reduced-motion. Never hijack or block scrolling.

## Exact content — use verbatim, invent nothing

All facts verified against sportsol.is on 2026-07-04/05. Copy is Icelandic; do not translate, do not add claims, no em-dashes anywhere (orthographic hyphens in compounds are fine). Never set ð/þ words in uppercase without verifying the font's capital Eth/Thorn.

**Contact:** 554 3799 · sportsol@sportsol.is · booking https://noona.app/sportsol

**Locations**
- Hamraborg 16, 200 Kópavogur — "Opnaði í janúar 2026 með splunkunýjum bekkjum" — Mán-fös 10:00-23:30, lau 12:00-22:00, sun 12:00-23:00 — beds: Luxura JEWEL, Luxura Vegaz, standandi bekkur, American M7 infrared
- Hverafold 1-3, 112 Reykjavík (Grafarvogur) — "Opnaði í desember 2024 með glænýjum bekkjum" — Mán-fös 10:00-23:00, lau 12:00-22:00, sun 12:00-23:00 — beds: Luxura JEWEL, Luxura X10, Luxura X10 Túrbó, standandi bekkur

**Verðskrá** (two-rate system: morgunverð kl. 10-14, dagverð frá kl. 14 — make this comparison genuinely delightful to explore; prices must be real HTML text, never images):
- Vegaz, Túrbó og venjulegir bekkir: 10 mín 1.832/2.290 kr · 15 mín 2.232/2.790 kr · 20 mín 2.792/3.490 kr
- JEWEL bekkir ("Djásnið frá Luxura"): 10 mín 1.910/2.390 kr · 15 mín 2.552/3.190 kr · 20 mín 3.432/4.290 kr
- Standandi bekkir: 7 mín 1.752/2.190 kr · 10 mín 1.832/2.290 kr · 15 mín 2.232/2.790 kr · 18 mín 2.792/3.490 kr
- Helgartilboð: 15 mínútur í Vegaz, Túrbó, standandi og venjulega bekki — 1.900 kr
- Infrared (sama verð allan daginn): 15 mín 1.490 kr · 20 mín 1.980 kr

**Áskrift** (the hero claim "Frá 299 kr. á dag" comes from the first plan):
- Áskrift 8.990 kr/mán, um 299 kr á dag, þriggja mánaða uppsagnarfrestur, 15 mín ljósatími eða infrared alla daga í báðum stofum (FEATURED)
- Áskrift styttri binding 9.990 kr/mán, um 330 kr á dag, eins mánaðar uppsagnarfrestur
- Infrared áskrift 4.990 kr/mán, um 166 kr á dag, þriggja mánaða uppsagnarfrestur, veitir ekki aðgang að hefðbundnum ljósabekkjum

**Frelsi:** greiðir 10.000 kr, færð 12.500 kr inneign. Rennur aldrei út. Gildir í báðum stofum og í alla bekki. Má nota með helgartilboði og morguntilboði.

**Bekkirnir (taglines):** Luxura JEWEL "Djásnið frá Luxura. Háþróuð ljósatækni og hámarksþægindi." · Luxura Vegaz "Nýr hágæða lúxusbekkur. Þú velur styrkleikann, Túrbó eða venjulegan." · Luxura X10 og X10 Túrbó "Mildur og þægilegur bekkur með stillanlegum styrkleika. Túrbó útgáfan er sú öflugri." (← this is the bed in the video, connect them) · Standandi bekkur "Hraður standandi tími þar sem þú stillir styrkleikann sjálf eða sjálfur." · American M7 infrared "Innrautt ljós, djúp og kraftmikil meðferð á aðeins 15 mínútum."

**Sólarkrem:** Tiki Tequila, Stardust, Pure Charm, Pro Tan Bodaciously Black — 7.900 kr hvert.

**Traust (um okkur):** Hreinlæti í fyrirrúmi (hver bekkur þrifinn og sótthreinsaður eftir hverja notkun) · Perur í toppstandi (skipt oftar en framleiðendur mæla með) · Allt til alls (hrein handklæði, make-up klútar, hárblásarar) · Ábyrg sólbaðsupplifun (árangur án þess að brenna).

## Quality bar and guardrails

- Mobile-first, flawless at 390px, sticky "Bóka tíma" bar on mobile, no horizontal overflow ever.
- WCAG AA minimum on every text/background pair, including over video.
- Semantic HTML: one h1, h2 per section, real buttons/links, focus-visible states that trace the element's own radius.
- SEO: descriptive Icelandic title + meta description ("sólbaðsstofa", "Kópavogi", "Grafarvogi"), LocalBusiness/TanningSalon JSON-LD for both locations, alt text everywhere.
- Performance: the video is the only heavy asset — everything else stays light; animate only transform/opacity; infinite animations must be compositor-cheap.
- Banned: em-dashes, AI-purple gradients, three-equal-card feature rows, fake testimonials or any invented data, timers/countdowns, scroll-hijacking, stock photos of generic tanned models (the video + designed light are the imagery).

Deliver the full page. Surprise me with the choreography — the bar is "the owner gasps."
