# Codex slice T1: elevate the True Line home (Bílageirinn). STOP after.

## What happened and what Sindri wants
Today a new Bílageirinn site was built on a different reference and Sindri rejected it: "you ruined the design ...
where's the landing page image ... it looks like generic slop." The design he wants is **True Line** (live:
https://sindrimar02.github.io/iceland-frumgerdir/preview/bilageirinn/). His words now: "take some inspiration from the
brimborg design to make the trueline build even better, look at some dribbble and awwwards mechanics sites and build
this to be truly perfect."

So: TRUE LINE STAYS TRUE LINE. Same full-bleed hero photo landing, same giant uppercase Projekt Blackbird headline,
amber line drawn under it, dark warm palette (DESIGN.md tokens), Archia body, Geist Mono chrome, pill CTAs, the
claims rail line that bends straight, the services index. You make it better, you do not replace it. If a visitor who
knew the old page would not recognise it in one second, you went too far.

## Where you work
`/Users/sindri/Documents/Website redesign mockups/iceland-redesigns` (-C). Write ONLY in:
`src/preview/bilageirinn-site/**`, `public/bilageirinn-pub/**`, `bilageirinn/**`, `vite.bilageirinn.config.ts`.
Other files in this repo have another session's uncommitted work (Pólar Hestar): never touch, format, stage or
commit anything else. Commit nothing. Claude copied True Line here verbatim: `src/preview/bilageirinn-site/Page.tsx`
renders identical to live (baseline screenshot `bilageirinn/baseline-1440.png`, `baseline-390.png`).
Build: `npx vite build -c vite.bilageirinn.config.ts` → `dist-bilageirinn/`, served at http://127.0.0.1:5311/ by
Claude's `vite preview` (static: rebuild, then reload). Browser: `puppeteer.connect({browserURL:'http://127.0.0.1:9361'})`
(Claude's Chrome, never `browser.close()`; open/close your own contexts).

## Read before you design (and cite what you take, with file:line)
1. True Line source + `src/preview/bilageirinn-site/DESIGN.md`, memory of what Sindri liked about it:
   `/Users/sindri/.claude/projects/-Users-sindri-Documents-Website-redesign-mockups/memory/bilageirinn-client.md`.
2. **Brimborg** (Sindri's named inspiration): code `src/preview/brimborg/`, live
   https://sindrimar02.github.io/iceland-frumgerdir/preview/brimborg/ , notes `../_docs/brimborg-build-2026-10-31/`
   (DESIGN.md, MOTION.md). Memory `brimborg-build-2026-10-31.md`. What made it premium: the loader that waits for
   `fonts.ready` + hero `img.decode()` then parts like a shutter, the header arriving on a `--iy` custom property,
   the digit roll, chapter structure, image handling. Take mechanics and craft, not its teal brand or car-dealer layout.
3. Awwwards research already done for this client: `../_docs/bilageirinn-2026-11-11/references/SHORTLIST.md` +
   `CODE-EVIDENCE.md` (Heritage Driven numbered process, John Lawrie heading reveal 1.2s expo.out / image parallax
   yPercent 15, Spyker craft storytelling, ESR alignment). Use as craft input only.
4. **Dribbble**: find 8+ shots for auto repair / body shop / car service / garage websites (dribbble.com search pages
   and shot pages are server rendered: curl with a browser User-Agent, save the shot images to
   `bilageirinn/refs/dribbble/`, OPEN and LOOK at each image). Note per shot what is worth taking (a section idea, a
   booking/claim UI, a service list treatment, a before/after) and what is template slop.
5. Studio rules: `../_docs/CODEX-HOSPITALITY-PLAYBOOK.md` §2 hard rules + banned vocabulary, and these memory rules:
   no marquees, no count-up numbers, no stacked announcement bars, no expand panels, no hover-only discovery,
   no generic icon-card grids, no contrast slogans, open menus highlight nothing (focus guard).

## Do
1. Write `bilageirinn/ELEVATION.md`: every change you will make, each with its source (Brimborg file:line, reference
   number, Dribbble shot path) and why it makes True Line better. Include the True Line parts that break current studio
   rules and must change: the reviews marquee (→ a still, typographic reviews block), the Facts CountUp (→ static
   numbers with a better reveal), and the hero proof row item "Bíll á meðan viðgerð stendur" (overclaim: replace with
   the verified rental wording from `../03-prototypes/bilageirinn/content.mjs` `rental` or drop it).
2. Implement it on the HOME only, motion included (no "later"). Expected scale: loader rebuilt on the Brimborg
   pattern but in True Line's language (the measuring rule fill stays the idea), header arrival, hero reveal and photo
   cycle polish, sharper section rhythm, one new signature moment per the references (e.g. a claim-process chapter or
   a before/after slider ready for real photos), better services index imagery, reviews and workshop sections.
   Keep the IS/EN toggle working.
3. Check: build clean, no console errors, 1440/1024/390 screenshots of the whole home (save to
   `bilageirinn/shots/`), LOOK at them next to the baselines, no sideways scroll, reduced motion shows everything,
   menu by real tap shows no focus ring (`node ../_tools/focus-guard/check-menu.mjs http://127.0.0.1:5311/ '<toggle>'`).
4. `bilageirinn/REPORT-T1.md`: what changed (file:line), before/after screenshot pairs, not_checked. STOP. The other
   12 pages, the real form and the photo slots are slice T2, not now.
