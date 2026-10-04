# Matvélar og umbúðir: design brief (locked before building)

Route `/preview/matvelar` (+ `/velar`, `/velar/<9 families>`, `/thjonusta`, `/fyrirspurn`).

**System:** Deepbook (deepbook.tech teardown, clean-room code in `04-platform/sndr-teardowns`), re-aimed. Same fluid em root
(the page scales as one object), floating bar, SplitText line reveal, 5-leg pinned scene with scrubbed camera and
word swap, odometer counters, divider cubes, crate drop, hero streams canvas, line field closing section.
Not used: Lenis (the page scrolls natively on every device), Lottie, the paid fonts and every DeepBook artwork file.

**Brand layer (their own, from their logo):** slate `#576a7c` carries the panels and the footer (it is the colour of
their logo square), signal yellow `#ffdd00` is the yellow dot of their logo and the only accent: what moves, what to
press, the service banner. Black ground `#000`, bar `#1b1b1b`, hairline `#2a2f34`. White band for the trial section.

**Type:** Hubot Sans 400/500/600 (display and text) + Martian Mono 400 (labels). Both open licence, full Icelandic
checked on the shipped woff2 files. Floors: body 15px, mono labels 12px, inputs 16px, tap targets 44px.

**Artwork (ours):** isometric drawing kit `iso.ts`: a production line of five machines on one belt (grinder, brine
injector and tumbler, former, oven, packer) and a lug of cuts on a slab. Machines are white and steel (lit slate when
active). Everything edible is the one signal yellow, fresh or cooked, and drawn as a recognisable food (chicken legs,
mince, wet cuts, sausages, golden cutlets, a packed tray), never as discs or cubes: a yellow disc reads as a coin.
Roles are coloured by CSS only.

**Content rule:** their words. No prices, capacities or specs exist on their site, so none are shown. Each family page
carries the supplier paragraph as Matvélar wrote it. Stages are their own sentence ("frá forvinnslu með farsvélum,
hakkavélum og afþýðingu í gegnum marineringu með saltsprautum og tromlum … formun, brauðun, steikingu og frystingu …
pökkun ásamt pökkunarefni"). Machines their supplier paragraphs name but that have no page are "Fleira úr
vöruúrvalinu" chips that can go on the request.

**The job:** two doors on the first screen (new equipment or advice / machine in use), an enquiry list that carries
machines into one request, and a request that arrives as a finished brief (model, serial, fault, photo, or product,
task, throughput) the staff can answer from. Nothing is sent from the prototype: `mailto:` or copy.

**Declared deviations from the reference:** no Lenis; no banner marquee on phones (tap targets); reduced motion and
short landscape screens get the five stages as a plain list; one grouped dropdown (Vélar) in the bar; no preloader.
