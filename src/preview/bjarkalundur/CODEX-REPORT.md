# Bjarkalundur v4.1 implementation report

30 October 2026. No commit, deployment, live API request, browser session, simulator or dev server.
All source edits are inside the allowed paths. The requested build generated its normal ignored
`dist-bjarkalundur` and `dist-bjarkalundur-server` outputs. Existing unrelated untracked files were left alone.

## Changes, by file and line

Paths below are relative to the repository root. Line references identify the start of each change.

| File:line | Change |
|---|---|
| `src/preview/bjarkalundur/copy.ts:101`, `:400` | Replaced the unsupported room count with eight kinds of stay in both languages. |
| `src/preview/bjarkalundur/copy.ts:110`, `:409` | Upcoming cottage title, sentence, six icon facts, drawing caption and spring 2027 status. |
| `src/preview/bjarkalundur/copy.ts:117`, `:416` | Six activities, factual descriptions, reception wording and drawing labels. |
| `src/preview/bjarkalundur/copy.ts:129`, `:428` | Picker labels, capacity explanations, sold-out state, kitchenette yes/no and ISK price formatting. |
| `src/preview/bjarkalundur/copy.ts:147`, `:446` | Owners, food, 2026 history and restaurant FAQ copy now qualifies daily opening by the hotel season. Opening FAQ at `:184` and `:483` states early November 2026 closure and 15 March 2027 reopening. |
| `src/preview/bjarkalundur/copy.ts:217`, `:516` | Booking instructions now include choosing a room on this page. Icelandic next-step caption at `:232`. |
| `src/preview/bjarkalundur/copy.ts:233`, `:532`, `:302`, `:601`, `:306`, `:605` | Consistent hotel season in calendar, campsite copy and footer. No campsite reopening date was inferred. |
| `src/preview/bjarkalundur/copy.ts:251`, `:550` | Shared bilingual cottage food discount, with booking confirmation email as proof. Rooms-page upcoming note at `:268` and `:567` now says spring 2027. |
| `src/preview/bjarkalundur/data.ts:184`, `:189` | Shared filter predicate and party-fit rule. The existing eight sizes, capacities and photo assignments at `:104` were already correct and were retained. The large cottage's four-adult limit comes from existing room copy. |
| `src/preview/bjarkalundur/availability.ts:3` | Optional eager JSON glob; no snapshot required. Inventory outside the horizon, missing room data and malformed digits are unknown rather than sold out. Stay checks exclude checkout. |
| `src/preview/bjarkalundur/StayOptions.tsx:10` | All eight options grouped by hotel/cottages, shared filter labels/predicate, FLIP transitions, type-owned photos or explicit placeholders, sizes, guests, beds, bath, kitchen, descriptive copy, discount and optional prices. Capacity and inventory disable cards without hiding them. |
| `src/preview/bjarkalundur/StayOptions.tsx:80` | Final informational upcoming cottage card. It has no selection control or Godo room ID. |
| `src/preview/bjarkalundur/StayPicker.tsx:36`, `:69`, `:71` | Container query now measures the calendar itself, protecting day-target width; dates wrap instead of truncating; clear control is at least 40px high. |
| `src/preview/bjarkalundur/StayPicker.tsx:84` | Sold-out nights, option grid/card states, clipped photo frames, upcoming card, summary and reduced-motion styles. |
| `src/preview/bjarkalundur/StayPicker.tsx:283` | Existing date click rules and party steppers retained; optional inventory disables unavailable arrivals/ranges but permits checkout on an unavailable night. With no eligible room types, the calendar remains usable and the cards explain party limits. |
| `src/preview/bjarkalundur/StayPicker.tsx:394` | Options follow the calendar/party. A complete, valid selection shows type, full dates, nights, adults/children and one booking link carrying that room ID to Godo. Invalidating the selection removes the booking action. |
| `src/preview/bjarkalundur/Additions.tsx:11` | Shared responsive drawing component: small asset at viewport widths up to 1024px, visible drawing captions and measured intrinsic dimensions. |
| `src/preview/bjarkalundur/Additions.tsx:23` | Upcoming section with 1.3-stroke Lucide fact icons, both sketches on home and a compact sketch on rooms. |
| `src/preview/bjarkalundur/Additions.tsx:47` | Activity icon row and six cards: assigned lake/kayak/valley photos, labelled mini golf/e-bike drawings, icon-only Grettislaug, existing Veiðikortið link. |
| `src/preview/bjarkalundur/Home.tsx:454`, `:489`, `:517` | Activities after the lake, upcoming cottages after existing cottages, discount in food. Booking remains at the foot of the page. |
| `src/preview/bjarkalundur/Rooms.tsx:35`, `:194` | Filtered catalogue rows animate with grid rows instead of unmounting abruptly. Hidden rows are inert and aria-hidden; room accordion state survives filtering. |
| `src/preview/bjarkalundur/Rooms.tsx:125`, `:189` | Cottage discount in room details and compact upcoming section before the cottage group. |
| `src/preview/bjarkalundur/shell.tsx:67` | Ground-colour drawing layouts, upcoming section, activity grid and icon row; narrow-phone calendar gutters. |
| `src/preview/bjarkalundur/shell.tsx:223`, `:740`, `:768`, `:796` | Language pills have 40px targets. Pointer menu opening focuses the container; keyboard opening focuses the first navigation link. Existing focus trap and return remain. |
| `src/preview/bjarkalundur/shell.tsx:472`, `:489`, `:495` | Left-to-right drawing wipe using the history cubic-bezier curve over 0.95 seconds, option entry fade stagger and activity icon stagger of 40ms. Existing masked titles, copy lifts, group staggers and photo settles reused. GSAP matchMedia owns cleanup and reduced motion. |
| `tools/bjarkalundur-prices.mjs:11`, `:25`, `:38`, `:94` | Mirrored room IDs; env/local-env key loading; sequential requests with timeout, 365-day horizon, lowest positive in-stock rate, ISK JSON and inventory digit strings. Partial failures are unknown; all failures preserve the old file; all-successful-zero-inventory results replace stale availability. Atomic file replacement and no credential/error-body logging. |
| `package.json:14` | Added only `prices:bjarkalundur`. |
| `src/preview/bjarkalundur/DESIGN.md:99` | Motion rows and section placement rationale, detailed below. |
| `src/preview/bjarkalundur/CODEX-REPORT.md:1` | This implementation and verification handoff. |

## Every DESIGN.md motion row added

- `DESIGN.md:103`: upcoming cottage titles, copy and fact icons.
- `DESIGN.md:104`: all drawings, including the picker, 0.95-second left-to-right wipe.
- `DESIGN.md:105`: activity titles/copy and staggered cards.
- `DESIGN.md:106`: activity icon row, 40ms stagger.
- `DESIGN.md:107`: activity and option photographs, scale 1.15 to 1.
- `DESIGN.md:108`: option entrance, 2px hover lift, red border/ring, 0.97 press.
- `DESIGN.md:109`: picker filter FLIP transitions and reduced-motion behavior.
- `DESIGN.md:110`: rooms catalogue filter grid-row transitions and inert hidden rows.
- `DESIGN.md:111`: booking summary and polite status announcement.

Placement rationale at `DESIGN.md:113`: activities directly follow the lake so the landscape and
activities read as one chapter before accommodation. The new cottage section follows the existing
cottages. Owners, food and later chapters retain their relative order. Booking remains last.

## Facts and their source lines

Meeting references below mean `../_docs/bjarkalundur-2026-10-30/MEETING-NOTES.md`.
The explicit user brief takes precedence where it deliberately softens dates or resolves authority.

| Fact used | Source |
|---|---|
| Eight current types and sizes 20, 14, 7, 22, 22, 24, 15, 11 m² | `godo.ts:32` through `:41`; retained `data.ts:104` inventory. This is a type count, never a main-house room count. |
| Guests, beds and bathrooms for each existing type | Existing IS `copy.ts:241` and EN `copy.ts:540`; capacities/kitchen flags and assigned photographs in `data.ts:104`. |
| Large cottage allows four adults plus one child | `copy.ts:248`, `:547`; prevents five adults selecting it. |
| Existing temporary electricity caveat | `data.ts:99`, `:111`, `:112` and existing `copy.ts:252`, `:551`. Retained pending owner/Godo reconciliation. |
| Six new cottages, 27 m², up to five guests, kitchenette, microwave, toilet and bath | Meeting `:18`, `:35`, `:37`, `:38`; repeated in the user's allowed facts. |
| Front veranda, excluded from quoted floor area | Meeting `:37`; no veranda area is published. |
| Not bookable, available spring 2027 | Meeting `:39`, `:56`; user explicitly instructs “spring 2027” instead of a May date. No room ID invented. |
| Hotel closed from early November 2026, reopening 15 March 2027 | Meeting `:53` through `:56`; user explicitly requests early November wording. |
| Cottage guests receive 10% off restaurant food by showing confirmation email | Meeting `:65`. No discount code or additional restriction invented. |
| Fishing species, Veiðikortið, hotel registration, 15 May to 15 September, 07:00 to 23:00 | Existing FAQ `copy.ts:191`, `:490`; link `data.ts:31`. |
| Kayaks on the lake | Meeting `:25`, `:119`; existing FAQ `copy.ts:191`. |
| Owner-built 18-hole mini golf | Meeting `:23`, confirmed `:119`. |
| Electric bikes | Meeting `:24`, corrected/confirmed `:119`. |
| Hiking up Vaðalfjöll | Existing FAQ `copy.ts:192`, `:491`. No new difficulty, duration or distance added. |
| Grettislaug in Reykhólar, 15-minute drive | Existing FAQ `copy.ts:193`, `:492`. |
| Kayak/e-bike prices unknown; reception wording | Explicit allowed facts in the user brief. No rental cost, mini golf cost or opening hours added. |
| New cottage images must be labelled drawings | Meeting `:68`; mini golf photo still expected at `:69`; provided drawing filenames in user brief. |
| Existing daily food hours | Existing food/owners/FAQ copy, now qualified by season; no new hours introduced. |
| Credentials belong only in a build-time script | Meeting `:143` through `:151`, and the supplied Nýpugarðar snapshot pattern. |

## Verification

- `npx tsc --noEmit -p .`: exit 0. Because the root config contains only references, also ran
  TypeScript's compiler API against every Bjarkalundur TS/TSX file using `tsconfig.app.json`
  options and `src/vite-env.d.ts`: **zero diagnostics**.
- `npx eslint src/preview/bjarkalundur`: exit 0, **zero errors, 14 warnings**. Remaining warnings
  are the existing mixed-export Fast Refresh pattern in StayPicker/shell and one unused disable
  in Page. No new warning in the new components.
- `npm run build:bjarkalundur`: passed client build, SSR build, all eight route prerenders,
  favicon guard, separation gate and indexability checks. Vite reports a chunk-size warning;
  the final JS chunk is 597.08 kB (198.39 kB gzip), and the postbuild reports domain-root favicon href warnings. No build configuration or postbuild
  was changed.
- Final static HTML assertions passed on IS/EN home and rooms: exactly eight option buttons,
  one upcoming card, spring status and discount, with no old room count or test fixture price.
- Missing-key execution with both key env vars explicitly empty printed
  `[bjarkalundur-prices] no keys, skipped`; exit 0, no output snapshot and no network call.
- In-memory tests passed for absent/unknown inventory, zero inventory, missing room records,
  horizon boundaries, checkout exclusivity, a sold-out night inside a stay, party limits and
  all eight room-specific Godo URLs (dates, adults, children, room ID, language).
- Executed the snapshot script inside a VM with an in-memory filesystem and mocked fetch:
  missing keys make zero requests; all failures make zero writes; partial failures omit
  inventory for failed rooms; all-sold-out successful responses produce fresh zero inventory;
  only positive in-stock rates contribute to the minimum; inventory strings have 365 digits.
  **No actual API calls were made, with real or fake keys.**
- A separate Vite SSR build with `write: false` confirmed a temporary test snapshot was included
  by the optional glob. The fixture was removed in `finally`. The final requested build runs
  without a snapshot. Test prices are not shipped.
- `git diff --check` passed. Greps checked old room counts, forbidden dash characters,
  first-person wording, ellipsis truncation, `clearProps`, `Intl`, daily-opening claims,
  handwritten month names, mask padding, target sizes and pointer/keyboard menu focus.
  No old count, dash in guest copy, `clearProps`, date `Intl` or CSS ellipsis remains in the
  changed surfaces. Existing dashes in two source comments are not guest copy. Icelandic
  “við” remains as a preposition and in attributed reviews; no first-person studio voice added.
- Measured supplied assets with `sips`: cottage drawings are **2048 × 1374**, small variants
  **1024 × 687**; activity drawings **2048 × 1529**, small variants **1024 × 765**.
  The brief's 2528 × 1696 dimensions differ from the actual exports, so markup uses actual sizes.

## Limits and browser handoff

No browser was run, as instructed. Chrome/Safari verification must cover both languages on home and
rooms: 320px and wider tap targets, two-month breakpoint, filter reflow and focus, selecting/changing
party and dates, matching Godo URL, language switching, Back/room anchors, all scroll reveals,
reduced motion, touch presses and text wrapping. Confirm the photo settle remains clipped to its
image frame. Live prices and current inventory cannot be verified until the real property keys arrive.
Snapshots are build-time data; Godo remains the final authority and the next-step caption stays visible.

Process ownership inspection (`ps`) and the pressure-level sysctl were denied by the sandbox.
`memory_pressure` worked, reporting 41% to 49% system-wide free during checks; this is not an
OS-enforced resource limit or a speedup claim. Initial VM samples showed swap-ins, so new heavy work
was deferred while source checks continued. Later samples settled to 0 to 8 swap-ins and zero
swap-outs per one-second sample. Checks/builds ran sequentially. No other session's processes were
controlled. All owned command sessions finished; no long-running resource needs a PID/port handoff.

## QUESTIONS for the owner

1. Which existing cottage types correspond to the handwritten 22 m², 24 m², 15 m² and 12 m²
   entries? Confirm capacities, kitchenettes, bathrooms and the current booking status of room
   118377. Until corrected in Godo, the supplied Godo-backed inventory remains authoritative.
2. Are the two small cottage types still temporarily without electricity? The note and existing
   Godo caveat differ; no unsupported correction has been made.
3. Does Godo already send the confirmation email, and who will add the agreed food-discount line?
   This task adds website copy only; it does not configure transactional email.
4. When will the hotel's API key and property key arrive? Confirm rates are supplied in ISK before
   publishing a real snapshot, and arrange the refresh schedule outside this static frontend.
5. Please supply the mini golf and e-bike photos when ready. Drawings remain visibly labelled.
6. Please confirm the new cottages' final opening once settled. The site intentionally says only
   spring 2027. Confirm the remaining bed arrangement if it should be described later.

No main-house room count, uncertain cottage totals, activity rental prices, mini golf hours or exact
new-cottage opening date was guessed. No domain, account, email or advertising action was taken.
