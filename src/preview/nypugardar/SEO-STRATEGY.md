# Nýpugarðar (glacierview.is) — SEO / GEO / AEO strategy

Owner: Bogga. Deal: 9.900 kr/month. Live since 2026-09-18. Booking engine: Godo (direct,
own EUR prices) plus listings on Booking.com, HeyIceland, Guide to Iceland, Expedia,
Hotels.com, TripAdvisor. Written 2026-09-23, following `_docs/SEO-GROWTH-SYSTEM.md` and
`_docs/SEO-GEO-AEO-MASTER-2026-09-16.md`. Every fact below traces to the source code,
`_docs/NYPUGARDAR-FACT-CHECK-2026-09-16.md`, Bogga's own emails, or a dated live check —
anything else is marked UNVERIFIED.

---

## 1. Business overview

A family-run **working sheep farm** with a 13-unit guesthouse (11 rooms, two with a
shared bathroom, plus two cottages sleeping 3–4), on a low hill at Mýrar, Hornafjörður,
in south-east Iceland — 4 km off Route 1 (the Ring Road), 20 km from Höfn, about 50 km
from Jökulsárlón glacier lagoon. Registered company Nýpugarðar ehf. (kt. 510805-0380),
open all year **except Christmas/New Year** (the booking system shows no inventory
22–31 December — UNCONFIRMED with Bogga whether this is a deliberate closure or a sold
window; treated as closed in copy).

**What only this farm can credibly say**, because a machine or a travel writer cannot
get it anywhere else:
- It is a **working farm**, not a themed or staged "farm experience" hotel — no horses
  (Bogga confirmed 2026-08-21, contradicting the farm's own 2017 site and several
  aggregator listings that still say otherwise).
- **Dinner is a real evening menu, ordered on arrival, no advance booking** — not the
  "dinner buffet with lamb" that Booking.com's stale paragraph and several review sites
  still repeat. This is the single most valuable fact-correction opportunity on this
  site (see §7).
- **Reindeer visible on the land in winter** (from Bogga's own Booking.com photo, id
  10523758) — distinctive for Hornafjörður, where reindeer are the local wildlife story
  and sheep/horse farms elsewhere are not.
- **Measured drive times from the farm's own coordinates** (OSRM, not a straight line or
  someone else's estimate): Höfn 22 km/25 min, Þórbergssetur 37 km/40 min, Jökulsárlón
  car park 51 km/50 min, Diamond Beach 51 km/50 min, Fjallsárlón 61 km/60 min, Stokksnes
  33 km/40 min.
- **Direct EUR prices and live availability through Godo**, refreshed at every deploy —
  most small guesthouses in the area only show OTA prices.

## 2. Primary conversion goals

1. **Direct Godo booking** (per-room deep links, `roomid` + dates carried through) — the
   only paid conversion action on the site and the one that saves Bogga the OTA
   commission.
2. Phone call (+354 893 1826) or email (nypu@simnet.is) as a fallback, always visible but
   never pushed ahead of the booking flow.
3. Secondary/indirect: appearing correctly and consistently in Google's AI Overviews,
   ChatGPT, Perplexity and Claude answers to "where to stay near Jökulsárlón/Höfn" — a
   mention or citation is a lead even when the click lands on Booking.com instead,
   because Bogga is on every platform, but it should land on Godo.

There is no other product: no gift shop, no tours, no add-on to sell. Every page's job
is either to get someone to `/rooms/` and click Book, or to make Nýpugarðar the answer a
person or an AI assistant gives when asked about this stretch of the Ring Road.

## 3. Core services / product

Room types (Godo names, mirrored in `godo.ts` and `tools/nypugardar-seo.mjs`): Twin
shared economy · Double/Twin shared · Double · Double/Twin private bath · Double private
+ extra bed · Cottage (3) · Family Cottage (4). Current from-prices 87–149 EUR/night
(cached at build time from the Godo API, refreshed by `tools/nypugardar-prices.mjs`).
Dinner (menu, arrival-order, no price published). Breakfast (buffet + continental,
vegetarian/vegan/gluten-free, breakfast-to-go) — **inclusion is rate-dependent on
Booking.com (some rates include it, some charge ~18 EUR) and unconfirmed for Godo's own
direct rates** (open question, §12).

## 4. Important locations (the geography this site should own)

| Place | Distance/time from the farm | Source |
|---|---|---|
| Route 1 / Ring Road | 4 km | Booking.com, guest review |
| Höfn | 20 km headline / 22 km, 25 min measured | Bogga + OSRM |
| Þórbergssetur museum | ~37 km, 40 min | OSRM (Bogga said "~30 km") |
| Jökulsárlón glacier lagoon | ~50 km, 49–50 min | OSRM |
| Diamond Beach | 51 km, 50 min | OSRM |
| Fjallsárlón | 61 km, 60 min | OSRM |
| Stokksnes (Vestrahorn) | 33 km, 40 min | OSRM |
| Skaftafell / Vatnajökull NP west side | further west, not yet measured | — |
| Vík í Mýrdal | one full Ring Road leg west, ~2.5–3 h | not yet measured, UNVERIFIED |

The farm sits almost exactly between two of the most-searched stops on the south coast
(Jökulsárlón/Diamond Beach to the west, Höfn to the east), which is the site's strongest
structural asset for "where to stay" and "overnight stop" queries — confirmed by SERP
research (§9): most competing pages for this geography are aggregator lists, not single
properties with their own page.

## 5. Primary entities and relationships

- **Nýpugarðar ehf.** (LodgingBusiness → `BedAndBreakfast` in JSON-LD) — legal entity,
  taxID 510805-0380, address Nýpugarðar, 781 Höfn í Hornafirði, geo 64.261553,-15.438971.
- **Owner "Bogga"** and son "Birkir" — named in a guest review; not yet named anywhere on
  the site itself. An "about the farm" voice with a real name is a `smallPersonalSite`
  signal Google explicitly rewards (master doc §1) and currently unused here.
- **Region**: Hornafjörður / south-east Iceland / Vatnajökull National Park area.
- **Landmarks it sits between**: Jökulsárlón, Diamond Beach, Höfn, Þórbergssetur,
  Stokksnes, Fjallsárlón — each already a `Place` in `areaServed`.
- **Booking channels**: Godo (direct, primary), Booking.com, HeyIceland, Guide to
  Iceland, Expedia, Hotels.com, TripAdvisor (secondary, all `sameAs`/mentioned but not
  the target of a CTA).
- **Ferðamálastofa (ferdalag.is)** listing — already a `sameAs` and a real government
  tourism-board entity anchor, useful for Wikidata/entity work later.

## 6. Existing pages and what each targets (audit, live 2026-09-23)

Fetched via `https://glacierview.is/sitemap.xml` — 8 URLs, all `200`, all carrying
matched hreflang pairs (en ⇄ is) and `x-default` → English, per `tools/nypugardar-seo.mjs`.

| URL | Title | H1 | ~Words | Targets | Notes |
|---|---|---|---|---|---|
| `/` | Nýpugarðar \| Farm guesthouse between Höfn and Jökulsárlón | "A farm stay between Höfn and Jökulsárlón, with glaciers on the horizon" | ~1,800–2,000 | Brand + category + both anchor towns, general discovery, first click for every intent | Sections: farm, rooms (7 types), dinner, breakfast, reviews, location ("Just four kilometres off the Ring Road"), "Stay a little longer" (winter teaser) |
| `/rooms/` | Rooms, cottages and prices \| Nýpugarðar | "Eleven rooms and two cottages" | ~1,100–1,200 | Booking intent, room comparison | Carries the FAQPage schema (6 Q&A) and a second "Life at Nýpugarðar / the farm, the view and the table" block that duplicates some home-page material in a shorter form — acceptable (different intent, feeds the booking decision) but worth trimming if it grows further |
| `/winter/` | Winter at Nýpugarðar \| Daylight, roads and northern lights | "Winter on Mýrar" | ~1,100 | Winter/northern-lights intent, genuinely distinct informational content (daylight by month, road conditions, arriving after dark, breakfast-to-go for early tours) | No overlap worth fixing with home; home only teases it. This is the site's best AEO page — see §10 |
| `/privacy/` | Privacy \| Nýpugarðar | — | short | Policy only | Correctly excluded from LodgingBusiness schema (breadcrumb only) |
| `/is/` | Nýpugarðar \| Sveitagisting milli Hafnar og Jökulsárlóns | same structure, Icelandic | ~1,100–1,300 (extraction over-counted; treat as roughly matching EN) | Icelandic brand + category queries | Separate crawlable URL, not a toggle — correct per `multilingual-seo-separate-urls` |
| `/is/herbergi/` | Herbergi, sumarhús og verð \| Nýpugarðar | "Ellefu herbergi og tvö sumarhús" | ~1,200 | Icelandic booking intent | Same FAQ set, Icelandic |
| `/is/vetur/` | Veturinn á Nýpugörðum \| Birta, færð og norðurljós | "Veturinn á Mýrum" | ~1,100 | Icelandic winter/northern-lights intent | — |
| `/is/personuvernd/` | Persónuvernd \| Nýpugarðar | — | short | Policy | — |

**Cannibalisation check:** none found that needs fixing. EN/IS are separate URLs with
correct hreflang (not a toggle). Home vs. winter: home only has a short teaser section
and links out; winter owns the topic in depth. Home vs. rooms: rooms repeats some farm
atmosphere copy but its primary job (room comparison + FAQ + booking) is distinct enough
to leave alone.

**Missing pages**, i.e. real intents this site does not yet serve: a standalone
"where to stay near Jökulsárlón / Diamond Beach" page, a Ring-Road-stopover page, and any
German-language page (see §13 backlog).

## 7. Search Console snapshot (dated 2026-09-23, 4 days of data: 09-17 to 09-20)

Source: GSC export, 235 total impressions, 55 clicks-worth of rows, almost entirely
**brand and near-brand queries** — the property has essentially no non-brand visibility
yet, which is expected 4 days after a launch on a domain with `hostAge` still working
against it.

- Top queries by impressions: "guesthouse nypugardar" (25, pos 1.36, 5 clicks),
  "guesthouse nypugardar iceland" variants, "nýpugarðar" / "nýpugarðar guesthouse" (pos
  1.75–3.9) — all brand, all near position 1–4, decent CTR.
- **Two non-brand Icelandic queries already showing impressions with no clicks yet**:
  "gisting suðurland" (4 impressions, position **2.25**) and "gisting suðausturland" (2
  impressions, position 3) — genuinely promising, see backlog #1.
- A long tail of one-off impressions for **other guesthouses' names** ("giljur
  guesthouse", "setberg guesthouse", "jökla guesthouse", "siggi nobb guesthouse", etc.) —
  the page is being served for comparison/confusion searches, at poor positions
  (10–48). Not actionable directly, but confirms Google is already treating the site as
  part of the "Icelandic guesthouse" set.
- Generic category queries ("guesthouse iceland", "guest house in iceland", "iceland
  guesthouses") show impressions at position 2–5, which is surprisingly good for a
  4-day-old domain and is almost certainly the `www.` vs non-`www` page splitting
  clicks/impressions rather than genuine ranking strength — see technical issue #1.
- By page: `http://www.glacierview.is/` (189 impressions) and `http://glacierview.is/`
  (115 impressions) are tracked as **two separate pages** in Search Console, both
  `http://`, neither `https://`. `https://glacierview.is/` shows only 7 impressions.
  This needs a technical fix before any content work pays off fully (§14, technical #1).
- Country split: Iceland leads (70 impressions, 9 clicks), then Germany (22 impr, 4
  clicks, best CTR at 18%), Canada, Spain, Italy, USA (39 impressions, 1 click — worst
  CTR, likely OTA-saturated queries).

## 8. Priority keywords (from GSC + topic map, ranked by realistic near-term value)

1. `gisting suðurland` / `gisting suðausturland` — already position 2–3, Icelandic,
   zero clicks yet. Cheapest possible win: needs a reason to click, not a ranking fight.
2. `nýpugarðar` / `guesthouse nypugardar` (all spelling variants) — brand, already strong,
   just needs the technical www/https consolidation to stop splitting the signal.
3. `farm guesthouse Jökulsárlón` / `gisting nálægt Jökulsárlóni` — not yet in GSC (too new)
   but the single best-fit commercial phrase for the property; see SERP notes §9.
4. `where to stay near Diamond Beach` / `overnight Jökulsárlón` — high intent, currently
   owned by aggregators and Hali/Fosshotel/Brunnhóll, not Nýpugarðar.
5. `guesthouse Hornafjörður` / `gistiheimili Hornafirði` — regional category term, real
   competition from Lilja, Hólmur, Brunnhóll, Skálafell (§9).
6. `northern lights guesthouse south east Iceland` — winter page is already built for
   this; not yet indexed long enough to show impressions.
7. `dinner included farm stay Iceland` — a genuine differentiator query with visible
   competition (Efstidalur, Sólheimahjáleiga, Hólmur) but low volume.
8. `Ring Road overnight stop Höfn` / `Skaftafell to Höfn where to stay` — informational,
   winnable only with a dedicated page (not built yet).

## 9. Competitors / SERP notes (WebSearch used as proxy, 2026-09-23)

**"Nýpugarðar Höfn" (brand query):** glacierview.is did **not appear at all** in the
results actually returned. Hotels.com, Expedia, Facebook, Guide to Iceland,
Booking.com, Hoteles.com, KAYAK, HotelsCombined and IS-hotels.com filled every slot. One
of those results still describes the property as farming "about 700 sheep, 20 horses and
a dog" and "a dinner buffet with lamb" — both now contradicted by Bogga. **This is the
single clearest opportunity on this site**: the brand SERP is entirely OTA-owned, and the
OTAs are actively repeating facts Bogga has since corrected. Fixing this is a mention/GBP
problem, not a content problem — see backlog #2 and #3.

**"best guesthouse near Jökulsárlón glacier lagoon":** dominated by aggregator list pages
(Guide to Iceland, Expedia, Tripadvisor, Under Northern Skies, Let's Go To Iceland) naming
Lilja, Brunnhóll, Fosshotel Glacier Lagoon, Seljavellir, The Potato Storage, Kálfafellsstaður,
Gerði, Skálafell, Hali. Nýpugarðar is not named in any list found. **Realistic**: a single
well-built "where to stay near Jökulsárlón" page from Nýpugarðar itself cannot outrank
Guide to Iceland's list pages on authority, but it can rank for the more specific "farm
guesthouse near Jökulsárlón" and be the primary source these lists eventually cite or
link to once Bogga is in Ferðamálastofa/GBP properly.

**"where to stay near Höfn Ring Road overnight":** Hotel Höfn, Milk Factory, Höfn
Guesthouse (in town), Fosshotel Vatnajökull, Lilja, Arnanes Country Hotel dominate.
Nýpugarðar is 20 km further from Höfn than these but closer to Jökulsárlón — the site's
honest angle is "closer to the lagoon than Höfn's hotels, more atmosphere than a roadside
hotel," not competing head-on for "Höfn hotel."

**"farm stay guesthouse Hornafjörður":** direct competitors Lilja, Hólmur, Brunnhóll,
Skálafell all rank. Hólmur (also in Mýrar, very close by) is the nearest true peer —
family-run, on-site restaurant with glacier view, a petting-zoo of animals. Nýpugarðar's
differentiators against Hólmur specifically: no livestock-petting pitch (Nýpugarðar is a
working sheep farm, not a visitor farm), and Godo direct booking with live EUR prices,
which Hólmur's HeyIceland listing does not obviously offer at the same clarity.

**"gisting suðurland" (Icelandic, already ranking #2.25):** dominated by south.is
(regional DMO) and Booking.com's farm-holidays region page — both aggregators, not single
properties. This confirms the query is winnable for Nýpugarðar specifically because there
is no strong single-property competitor here, only directories; the position is already
good, the job is CTR (a better title/meta), not ranking.

**Diamond Beach / overnight near the lagoon:** Hali Country Hotel (13 km from Diamond
Beach) is the entrenched leader for "closest to Diamond Beach," genuinely closer than
Nýpugarðar (51 km). **Not realistic** for Nýpugarðar to compete on proximity to Diamond
Beach specifically — the honest angle is the Höfn–Jökulsárlón midpoint, not "closest to
the beach."

**Efstidalur Farm Hotel (Golden Circle, different region, used as a comparable in Godo's
own customer stories):** breakfast included direct-only, dinner NOT included, paid
separately. Useful comparable for how a farm hotel structures its food offer online — not
a competitor (different region) but a model for FAQ phrasing.

**Realistic-ranking verdict per topic:**

| Topic | Realistic? | Why |
|---|---|---|
| gisting suðurland / suðausturland | **Yes, already there** | Position 2–3, only DMO/aggregator competition |
| farm guesthouse Jökulsárlón | **Yes, medium-term** | Specific enough, few single-property competitors use this phrase |
| guesthouse Hornafjörður / Mýrar | **Yes** | Direct peers (Hólmur, Brunnhóll) rankable against with real differentiation |
| dinner included farm stay | **Yes, low volume** | Winnable but small |
| northern lights guesthouse SE Iceland | **Maybe** | Winter page is built; needs age + links |
| where to stay near Diamond Beach | **No, not as "closest"** | Hali genuinely closer; reposition as midpoint stop instead |
| best guesthouse Jökulsárlón (broad) | **No, not top spot** | Aggregator list pages own it; aim to be included in the list, not to outrank it |
| Ring Road overnight Vík–Höfn | **Maybe, needs a new page** | High informational volume, currently blog/aggregator-owned |

## 10. GEO / AEO prompt panel (10–15 prompts, WebSearch as proxy)

Checked monthly going forward. Current state (2026-09-23) is baseline: WebSearch (proxy
for what AI answer engines would fetch) surfaces **no mention of Nýpugarðar** for most of
these — the honest baseline is "not yet visible," which is expected four days post-launch.

1. "Where should I stay for one night between Skaftafell and Höfn?" — no mention.
2. "Farm guesthouse with dinner near Jökulsárlón" — no mention; Hólmur, Sólheimahjáleiga,
   Brunnhóll surfaced instead.
3. "Best place to see the northern lights near Vatnajökull" — no mention.
4. "Where can I stay near Jökulsárlón that isn't a hotel chain?" — no mention.
5. "Guesthouse between Höfn and Jökulsárlón" — no mention (this exact framing matches the
   site's own H1 and title — a fixable gap once indexed longer).
6. "Gisting milli Hafnar og Jökulsárlóns" (Icelandic) — not tested live, flag for next review.
7. "Farm stay Iceland with home-cooked dinner" — Efstidalur and Sólheimahjáleiga surfaced.
8. "Is Nýpugarðar a good place to stay?" — brand query; aggregators only (Tripadvisor,
   Expedia), site itself not cited.
9. "Does Nýpugarðar have horses?" — this is the fact-correction test: worth checking
   monthly, since the old "20 horses" claim is still live on multiple third-party pages.
10. "What is dinner like at Nýpugarðar?" — same fact-correction test for "buffet" vs
    "menu."
11. "How far is Nýpugarðar from Jökulsárlón?" — tests whether the measured 50 km/49 min
    figure gets picked up over the old Booking.com "47 km" figure.
12. "Where to stay near Diamond Beach on a budget" — competitive check against Hali,
    Stekkatún.
13. "Family-run guesthouse Hornafjörður" — direct-competitor check against Hólmur, Lilja.
14. "What's the weather/daylight like in Hornafjörður in December" — tests whether the
    winter page's daylight table gets cited for a genuinely well-covered informational
    query.
15. "Reindeer in south-east Iceland" — a low-competition, high-distinctiveness test; almost
    nothing else ties reindeer to a guesthouse stay.

**Sources most likely to be cited** for this cluster right now, per what actually
surfaced in the WebSearch proxy: Guide to Iceland, Tripadvisor, Booking.com/HeyIceland,
Under Northern Skies, Zigzag on Earth, South.is. None of these currently have corrected
facts about Nýpugarðar. Getting Bogga's corrected facts (no horses, dinner = menu, 50 km
not 47) onto even one of these (a corrected Booking.com listing, a Ferðamálastofa entry)
would move the needle for every AI engine that reads them, faster than the site's own
age can.

## 11. Ranked opportunity backlog

Scored on commercial value × realistic ranking chance × conversion fit × strategic/GEO
value (high/med/low each), per the growth-system framework. Season timing: **late
September 2026** — summer inventory is nearly sold, autumn/winter booking window is open
now, so winter-facing and "book direct for autumn/winter" work is timely; anything
built for the 2027 summer season should ship by spring.

| # | Item | Score | Type | Reason | Internal links | Timing |
|---|---|---|---|---|---|---|
| 1 | Fix the www/https split in Search Console (add both host variants + `https://` as verified properties, confirm 301s consolidate signal to one canonical form) | **High** | Technical, improve existing | GSC is currently splitting ~300 impressions across 3 host variants of the same page; this depresses every position and CTR number in §7 and is pure signal loss for zero cost | n/a | Now |
| 2 | Get Nýpugarðar's Google Business Profile claimed and filled out (category, all predefined services, 30+ own photos, correct facts) | **High** | New (off-page), not a page edit | Master doc: 79% of AI Mode hotel links go to the GBP, not the website. Right now the brand SERP is 100% OTA — a complete GBP is the fastest way onto that SERP at all | Home page could link "Find us on Google" once live | Now |
| 3 | Submit corrected facts to Booking.com's listing description (no horses, dinner is a menu not a buffet, distances) and ask Bogga to do the same on TripAdvisor/GTI where editable | **High** | Off-page correction | Directly targets the fact-propagation problem found in §9/§10 — third-party pages are the ones AI engines actually cite, and they currently carry wrong facts | — | Now |
| 4 | New page: "Where to stay between Skaftafell and Höfn" (Ring-Road overnight stopover, EN + IS) | **High** | New page | Real search volume (§9), currently owned by generic Ring Road blog posts, and Nýpugarðar's honest midpoint position is a genuine answer, not a stretch | Link from home's location section, from `/winter/` (winter driving context), and from `/rooms/` footer | Build before spring 2027 booking season starts (Nov–Dec); low cost |
| 5 | Add a named "About Bogga" section/page with a real photo and voice (who she is, how long the farm has been a guesthouse, what she'd tell a guest) | **Med-High** | New (small), improve existing | `smallPersonalSite` and named-owner signals are explicitly rewarded (master doc, content-quality memory); currently the site has zero named human anywhere | Link from home footer and rooms FAQ | Anytime, cheap |
| 6 | Rewrite the home + IS home meta description around "gisting suðurland" / "gisting suðausturland" phrasing to raise CTR on an already-good position | **Med** | Improve existing | Position 2.25–3 already; the job left is CTR, not ranking (§7–8) | — | Now, cheap |
| 7 | Fix the sitemap: replace `<changefreq>`/`<priority>` with real `<lastmod>` per route | **Med** | Technical, improve existing | Build standard v2 explicitly calls for lastmod, not changefreq/priority (`_docs/SEO-GEO-AEO-MASTER...md` §5); current `tools/nypugardar-seo.mjs` does the opposite | n/a | Next code pass |
| 8 | Ferðamálastofa entry verification + Wikidata item once RSK filing is confirmed current | **Med** | Off-page, new | Master doc: cheap, durable entity anchors; ferdalag.is listing already exists and is already a `sameAs` | — | Now (free) |
| 9 | Winter page: add a visible "book direct for autumn/winter" framing tied to the fact that near-term summer inventory is sold out (from `prices.json`/`avail.ts`) | **Med** | Improve existing | Turns a real inventory fact into a conversion nudge exactly when it's true (late Sept 2026) | Link from home hero | Now, time-sensitive |
| 10 | "Farm guesthouse near Jökulsárlón" as an explicit phrase in the home title/H1 area (currently "between Höfn and Jökulsárlón" — good but doesn't use "farm guesthouse near Jökulsárlón" verbatim) | **Med** | Improve existing | SERP research (§9) shows this exact phrase has little single-property competition | — | Next content pass |
| 11 | German-language page(s) (EN/IS/DE) | **Med** | New | GSC shows Germany as the #2 country by clicks with the best CTR (18%) of any country in the 4-day sample; Booking.com reviews include German guests | Would need its own hreflang set, following `multilingual-seo-separate-urls` | Only once EN/IS traffic is established — don't split effort yet |
| 12 | Confirm and publish whether breakfast is included on Godo's direct rates (open question §12) and state it plainly on `/rooms/` and in the FAQ | **Med** | Improve existing | Currently the site makes no inclusion claim at all — a specific, correct answer here is exactly the kind of "primary source for your own facts" win the content-quality memory calls for | — | As soon as Bogga answers |
| 13 | One YouTube video of the farm (property + place + defining amenity in the title) | **Low-Med** | Off-page, new | Master doc build standard: one video per property is a named, cheap mention-plan item | Embed or link from home | Whenever Bogga can film ~1 min of phone footage |
| 14 | Two to three earned text mentions (south.is/east.is regional DMO page, a local Höfn press piece, a partner page) | **Low-Med** | Off-page | Brand-mention correlation with AI citation is the single strongest lever in the master doc (ρ 0.66–0.74) and currently at zero for this property beyond OTAs | — | Ongoing outreach, not a build task |
| 15 | Expand the FAQ set on `/rooms/` with 2–3 of the GEO-panel questions that keep surfacing with no site answer ("does the farm have horses" as an explicit myth-correction FAQ, "how far is it really to Jökulsárlón") | **Low-Med** | Improve existing | Directly answers the fact-correction gap found in §9–10 in the page's own words, which is what AI crawlers read | — | Next content pass |
| 16 | Bing Places + Apple Business Connect claims | **Low** | Off-page | Cheap, already flagged as a launch-day item in the master doc; not yet confirmed done | — | Now, cheap |
| 17 | A short "is it worth staying at a farm vs. a hotel in Höfn" honest comparison paragraph on the home or a new page | **Low** | New (small) | Matches build-standard's "one honest worth-it answer" requirement; not yet present anywhere on the site | — | Low priority |
| 18 | Re-run `tools/nypugardar-prices.mjs` on a defined cadence (currently last verified 2026-08-30 per the fact-check doc) so JSON-LD prices don't go stale | **Low** | Technical maintenance | Wrong cached prices in schema is worse than none (per the seo.mjs file's own comment) | n/a | Recurring, monthly |
| 19 | Confirm whether the farm is actually closed 22–31 December or just sold out, and update copy/schema accordingly (open question, carried from the fact-check doc) | **Low-Med** | Improve existing | Currently the winter page and llms.txt both state "closed... Christmas and New Year" as fact from an inventory read, not a confirmed policy | — | Before December |
| 20 | ~~Add `<details>/<summary>` treatment check on the rooms-page FAQ~~ — **done in this pass**: verified at source, it is an always-visible `<dl>` list, not hidden, no action needed | — | Verified, closed | — | n/a | Closed 2026-09-23 |

## 12. Technical issues found

1. **www/https host splitting Search Console signal** (see backlog #1) — three page
   rows (`http://www.`, `http://`, `https://`) for what should be one canonical URL.
   Worth confirming the actual redirect chain live (curl -I on all three) before assuming
   this is just a GSC display quirk versus a real missing redirect.
2. **Sitemap uses `<changefreq>`/`<priority>` instead of `<lastmod>`** — contradicts the
   master doc's build standard v2 (§5) directly; `tools/nypugardar-seo.mjs` §"writeSitemap"
   needs a content-history-derived `lastmod` per route.
3. **No German or French pages**, and the build standard recommends them "where the
   property has the audience" — GSC's country data (Germany #2 by clicks, best CTR) is
   an early but real signal worth re-checking after a full month before committing to a
   German build (backlog #11).
4. **FAQ implementation checked at source (`RoomsPage.tsx` ~line 389): it is not
   `<details>/<summary>` at all, it is a plain always-visible `<dl>/<dt>/<dd>` list** —
   deliberately, per a comment in the file rejecting an accordion as "work for the reader
   and a keyboard trap to get wrong." This satisfies `faq-schema-dead-use-details` even
   more directly than `<details>` would: nothing is ever hidden behind a click, so every
   crawler (JS-executing or not) reads the full Q&A in the raw HTML. No action needed —
   corrected from an earlier draft of this file that had flagged it as unverified.
5. `openingHoursSpecification` was correctly dropped per the fact-check doc; confirmed
   absent from the live JSON-LD shape in `tools/nypugardar-seo.mjs`. No action needed.
6. `paymentAccepted: 'Credit card'` in schema — Booking.com's own live listing says "Cash"
   is the accepted payment there; unclear whether Godo direct bookings actually take a
   card. Low priority (flagged already in the fact-check doc), revisit once confirmed.

## 13. Schema state

`BedAndBreakfast` (not `Hotel` or `VacationRental` — correct per build standard, since
Hotel Center isn't in play) on every page except `/privacy/`, with address, geo to 6
decimals, `amenityFeature`, check-in/out, `sameAs` (Facebook, Booking.com, ferdalag.is),
`containsPlace` → 7 `HotelRoom` offers with live cached EUR prices and Godo deep links.
**No `AggregateRating`/`Review` node** — correct, matches `faq-schema-dead-use-details`
(self-serving ratings on your own domain are a guideline violation); the 8.8/2,289
Booking.com score is stated as text with a link instead. `FAQPage` (6 Q&A) sits only on
the rooms page, which is where the content lives — correct placement per the same memory.
`WebSite` node on the home page ties the alternate names together, added specifically to
stop Google reading "Nýpugarðar" and "Guesthouse Nypugardar" as two businesses.
`BreadcrumbList` on every page. Hreflang pairs (en/is) plus `x-default` → English on
every route via both `<link>` tags and sitemap `xhtml:link` alternates — correctly in one
place logically (both mirror each other, not conflicting).

## 14. Internal-link plan

- New "Skaftafell–Höfn stopover" page (backlog #4) gets links **in** from: home's
  location section, `/winter/` (a natural "planning a winter drive" moment), and the
  footer nav that already appears on every page. It links **out** to `/rooms/` (the
  booking decision) with a descriptive anchor ("see rooms and current prices"), never a
  bare "click here."
- "About Bogga" content (backlog #5) links in from the home page's farm section and from
  the rooms-page FAQ (the "can I book directly" question is a natural place to mention
  who's actually running the farm).
- The existing nav/footer link set (`/`, `/rooms/`, `/winter/`, `/privacy/`, language
  toggle) is already complete and consistent across all 8 routes — no changes needed
  there.
- Every new page must carry the same hreflang-pair pattern already established in
  `paths.ts`/`tools/nypugardar-seo.mjs` (`PRERENDER_ROUTES`, `STANDALONE_TITLES`) rather
  than being bolted on separately — that file is the single place that knows every route,
  by design, and should stay that way.

## 15. Change log

| Date | Change | Expected effect | Metric | Window |
|---|---|---|---|---|
| 2026-09-23 | Strategy file created (this document); no code changed | — | — | — |
| 2026-09-23 | **Window 1 (backlog #6).** Home meta descriptions rewritten to fit ~155 chars and name the region: EN "Farm guesthouse in South Iceland, 20 km from Höfn, about 50 km from Jökulsárlón. Glacier views, breakfast and dinner at the farm. Rated 8.8 on Booking.com."; IS "Sveitagisting á Suðausturlandi, …". Titles unchanged. Same deploy, hygiene only (not the measured change): sitemap now carries git-derived `lastmod` per page, `changefreq`/`priority` removed (backlog #7). | Higher CTR on generic queries where the home page already sits at position 2–3 with 0 clicks (09-17 to 09-22: "gisting suðurland", "gisting suðausturland", "guesthouse iceland", "guesthouse in iceland", "gästehaus island", "guesthouses islande") | GSC CTR per query for those queries plus brand queries, both home URLs. Compare per query, not per URL: Google is still moving impressions from the old `http://www.` address to `https://glacierview.is/` (redirects verified correct 2026-09-23), which will shift URL-level numbers on its own | 2026-09-23 → 2026-10-21 |

Backlog #1 closed 2026-09-23 without a change: all host variants 301 to `https://glacierview.is/` (curl-verified); the three GSC rows are launch-era URLs Google is still consolidating, not a missing redirect. Backlog #7 confirmed and fixed in window 1's deploy.

## 16. Open questions for the owner (Bogga)

Carried forward from `_docs/NYPUGARDAR-FACT-CHECK-2026-09-16.md` (still open) plus two
new ones from this pass:

1. Is the guesthouse actually **closed** over Christmas/New Year, or just sold out? The
   booking system shows zero inventory 22–31 December — worth a direct answer before the
   winter page states it as policy.
2. Does breakfast come included with her own **Godo direct rates**, or is it priced
   separately the way some Booking.com rates show it? (Backlog #12.)
3. Would she be willing to have a Booking.com listing correction made (no horses, dinner
   is a menu not a buffet) — either by Sindri drafting the edit for her to submit, or by
   her doing it directly? This is now the single highest-value item on the backlog and
   needs her sign-off, since it's her listing.
4. Is she open to a short "about Bogga" write-up and a real photo of herself for the
   site (backlog #5)? Needs her words, not invented ones, per
   `client-copy-from-their-own-words`.
5. Any interest in a one-minute phone-filmed video of the farm for a YouTube upload
   (backlog #13)? No production needed, just her phone.

## 17. Next review date

**2026-10-23** (one month out) — by then there should be a second GSC pull (30 days
instead of 4), a first read on whether backlog #1/#6 moved position or CTR, and enough
runway to decide whether the German-page question (backlog #11) is worth building.
