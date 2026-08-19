# Faxi Bakery — asset work order

The page is finished; the content is not. Every hole on the page draws itself as a
labelled placeholder carrying the filename below, so nothing has to be tracked
separately. **Drop a file in `public/faxibakery/` with the exact name and it takes
over. No code change.**

Three states you will see on the page:

| On the page | Means |
|---|---|
| `● STAND-IN` corner tag | A stock frame is holding the composition. Replace it. |
| `● PHOTO NEEDED` + brief | Nothing exists yet. The brief is the shot. |
| `▶ FILM SLOT` + filename | A silent loop goes here. Poster shows until it lands. |

**Generate stills in the Higgsfield WEB APP (higgsfield.ai), model `Seedream 4.5`,
Unlimited toggle ON → 0 credits.** Do not use the Higgsfield MCP (it always bills).
Real Faxi photography beats a generated frame every time; generate only what cannot
be shot.

Mood throughout: bright, warm, airy modern-Nordic. Golden pastry, steam, the volcano
on the horizon, calm. Appetizing, photoreal, never staged-looking.

## Place — the terrain the page is built on

| File | Aspect | State | Prompt / shot brief |
|---|---|---|---|
| `exterior.jpg` | 3:1 | stand-in | The building from the road: Route 1 in the foreground, the café low and lit, Eyjafjallajökull rising behind it. Wide, late afternoon, a car in shot for scale. |
| `volcano-window.jpg` | 16:9 | stand-in | The view out the café window: the volcano and the green slopes, shot from a seat at the glass so the window frame is in it. Overcast is fine, calm is the point. |
| `dusk-road.jpg` | 3:1 | **needed** | Dusk from across Route 1: the café windows the only warm light in a blue landscape, headlights streaking past. Tripod, long exposure. |
| `terrace.jpg` | 3:2 | **needed** | Outdoor tables with the mountain line behind. Low sun, coffee cups on the table, nobody posing. |
| `seating.jpg` | 4:5 | **needed** | Interior seating: plants, warm wood, the window wall doing the work. From the door, mid-morning, real customers if they consent. |
| `kitchen.jpg` | 16:10 | **needed** | The open kitchen: hands shaping dough on a floured bench, flour in the air, the theatre customers actually watch. Tight, warm, no flash. |

## Film — three silent loops

No audio, no cuts, no titles. These autoplay muted and loop, and are skipped
entirely under reduced-motion. Ship `.mp4` (h.264); a `.webm` sibling is a bonus.

| File | Aspect | Spec | What happens |
|---|---|---|---|
| `video/window-view.mp4` | 16:9 | 12–20s, locked tripod, 1080p | Cloud shadow crossing the volcano, steam drifting up from a cup in the near corner of frame. Nothing else happens. That is the shot. |
| `video/oven.mp4` | 4:5 | 6–10s, handheld fine, 1080p | The tray comes out of the oven, steam lifts, a hand slides it onto the rack. Shoot a real batch, not a staged one. |
| `video/last-batch.mp4` | 3:1 | 15–25s, locked tripod, 1080p | The last light going off the mountain while the road keeps moving. Slow, wide, patient. |

## Food — the four on the "Out of the oven" board and the menu previews

| File | Aspect | State | Prompt / shot brief |
|---|---|---|---|
| `hero.jpg` | — | **done** | Single cinnamon roll, extreme close-up, plain warm cream ground. |
| `snudur.jpg` | 4:5 | stand-in | One roll, close, glaze still wet, soft crumb visible where it is pulled open. Warm natural light, shallow depth. |
| `snudur-tray.jpg` | 4:5 | **needed** | A tray of rolls leaving the oven, steam catching the light, the baker's arm in frame. (Poster for `video/oven.mp4`.) |
| `snudur-cream.jpg` | 4:5 | **needed** | Sourdough roll under cream cheese frosting, three-quarter angle, frosting still soft and slumping, one pulled apart beside it. |
| `samloka.jpg` | 4:5 | **needed** | The Faxi sub cut on the diagonal so the fill shows, on a board, on a real table by the window with the view soft behind it. |
| `hjonabandssaela.jpg` | 4:5 | **needed** | One slice of hjónabandssæla on a plain ceramic plate, crumb scattered, rustic, warm side light. |
| `croissant.jpg` | 4:5 | stand-in | Chocolate croissant, close, layers shattering, chocolate at the end. |
| `earlgrey.jpg` | 4:5 | stand-in | Thick Earl Grey cookie broken in half so the soft middle shows, on parchment. |
| `faxiballs.jpg` | 4:5 | **needed** | A small pile of chocolate-oat balls on a plate, coconut dusting, nothing styled. |
| `gf-cake.jpg` | 4:5 | **needed** | A slice of gluten-free berry cake on a plate in bright window light, berries visible in the crumb. |
| `pulledpork.jpg` | 4:5 | **needed** | Pulled pork sandwich on a board, melty, pickles visible at the edge. |
| `supa.jpg` | 4:5 | **needed** | Soup overhead, steam still visible, bread torn not sliced. Bright cozy light. |
| `kaffi.jpg` | 4:5 | **needed** | A cup on the wooden counter, crema intact, morning light across it. Shoot low. |
| `skyr.jpg` | 4:5 | **needed** | Skyr in a glass or bowl, berries on top, bright and clean against the wood. |

## Stand-ins that were removed, and why

Seven stock frames inherited from the first pass were showing the wrong subject and
have been dropped in favour of honest placeholders. Do not put them back: a Paris
street café standing in for Faxi's seating reads worse than an empty labelled slot.

- seating → was a Paris street café · terrace → was a crowded beer garden
- cream cheese roll → was blueberry muffins · happy marriage cake → was strawberry dessert cups
- Faxi balls → was stacked chocolate bars · pulled pork → was burger sliders
- the Faxi sub → was a white-background studio cutout

Note on the five stand-ins still in place: Unsplash's `plus`/`premium` photos carry a
watermark at hi-res, and the API endpoint that reports that flag is currently 404ing,
so they have not been machine-vetted. They are all destined for replacement anyway;
just do not ship one to a client without eyeballing it at full size first.
