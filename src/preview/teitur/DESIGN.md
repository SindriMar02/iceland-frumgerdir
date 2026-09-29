# Design System: Teitur (Premier Limo structure on the Valecampus system)

Routes `/preview/teitur` (IS), `/preview/teitur/en`; request `/beidni` and `/en/request`; agencies `/ferdaskrifstofur` and `/en/agents`; staff queue `/stjornbord` and `/en/dashboard` (static designs, sample data).

## 1. Idea
**The request is the first thing you can do.** A white request card floats on the hero photograph (three tabs, underline inputs, one dark submit); below it, numbered bands on warm grey and white, staggered image cards, a fleet rail, five tall route tiles, a dark closing panel. Photography is Teitur's own, orange is used for actions only.

## 2. Tokens
- Ink `#221812` (warm charcoal, bar, footer, closing panel), paper `#FFFFFF`, band `#EEEAE4`, numeral `#B6AFA5` (decorative, aria-hidden), mute `#5F564E`.
- Orange `#E8620F` (their CSS): buttons with ink text (5.3:1), orange text on light `#B34509` (5.2:1), soft `#FBE3D3`. White on orange fails small text, so it is never used.
- Radii: 6 chips and buttons, 14 image and card, 16 panels, sheet radius `clamp(22px,3.6vw,52px)`.
- Type: Switzer 400/500/600. H1 `clamp(2.35rem,5vw,4.6rem)`, section titles `clamp(2rem,3.7vw,3.4rem)`, body 17px (16 on phones), labels 13 to 14px. Tracking -.035em on display.
- One lifted object: the request card (`0 22px 70px rgba(20,12,6,.34)`); no other shadows except the sample panel on the agent strip's photo (now removed).

## 3. Motion (Valecampus vocabulary, no library, no pin, no smooth scroll)
Masked line reveals .15s stagger, 1s `--ease`; fades `.6s` after `.45s`; 3% inset clip-path crop 1s on the hero and image cards; one plus or minus 15% drift on the three service cards (fine pointers only); white cover until the hero has loaded; stacked-sheet hero (desktop: sticky photo, sheets slide over; phones: photo, then a white sheet with the card). Content is visible by default: `tj-motion` (which hides things) is added only after the JS has run. Reduced motion is a plain branch.

## 4. House standards
Constant fixed glass bar + sticky awning (mobile chrome standard); body/html ink; `overflow-x:clip`; 44px targets; visible focus rings; one h1 per view; own raster favicon per route.

## 5. Not allowed here
No invented numbers (fleet total, prices, response times); no competitors named; no stock (`shutterstock_*` files skipped); no health details in the form; sample data always labelled.
