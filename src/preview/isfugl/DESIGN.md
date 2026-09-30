# Ísfugl /preview/isfugl: design tokens

Built 2026-09-30 on the Góa/noho/Katla transplant system ("90% same, 10% different").
Prototype for Ísfugl ehf. (kt 671087-1439). IS only. Not contacted.

## Gap this page fills

Their site has 79 recipes with no pictures, no cut or product photography, a professional 2014 shoot
sitting unused in the media library, and a printed promise ("Þú sérð frá hvaða Ísfuglsbónda kjötið
þitt kemur!") that the site cannot answer. The page answers it: pick a farm, see the family, their
photograph and the numbers on their own page; pick a cut, see the nutrition sheet; pick a recipe, get
ingredients, method and a shopping list.

## The 10% that changes

| Token | Value | Source |
| --- | --- | --- |
| Display | Alpino Bold | Ísfugl's own wordmark family, self-hosted in `public/fonts/isfugl` |
| Text | Author | pairs with Alpino on a weight axis, self-hosted |
| bg | `#E9DBC3` | kraft pack paper |
| el / el2 / el3 | `#DFCBA9` / `#D3BC94` / `#C4AA7E` | kraft steps |
| form | `#F6EFE1` | pale card and input ground |
| ink | `#1E1410` | warm near-black, 14:1 on bg |
| red (`--c-rautt`) | `#AD1122` | sampled from their logo |
| footer | `#1B1210` | near-black curtain |
| radius `--r` | `clamp(12px, 1.1vw, 20px)` | tiles and cards; pills stay 999px |
| Header | hanging logo tag, pill buttons | logo traced from their PNG (potrace), 127x140 |

## The 90% that stays (Góa/noho/Katla)

Lenis on fine pointers only, mask-rise reveals (`.isf-up`), ease `cubic-bezier(.17,.17,0,1)`, magnet
cursor (`Bendill`, hidden until first pointermove, gone on touch), cascade labels, header dropdowns,
pinned staggered carousel, footer curtain with slogan wave, matter-js physics stage, screensaver, loader.
Prefix `isf-`, engine handle `__isfLenis`.

## New sections

1. **Farm lookup** ("Hvaðan er fuglinn þinn?"): four round medallions rebuilt on the pattern of their own
   "Frá fjölskyldubúinu" badges, with their own portraits. Tablist with arrow keys. Numbers come from each
   farm's own page.
2. **Cuts** (Vörur): 22 cuts, swatch selector, popup with their real nutrition sheet.
3. **Recipes by cut**: 7 groups, popups with a bird filter, 79 recipe pages (ingredients, method).
4. **Innkaupalisti**: shopping list drawer, copy to clipboard. Nothing is sent or stored on a server.
5. **Sölustaðir**: their kraft map (pre-made transparent webp) beside region tabs.

## Imagery, honestly

- 39 real photographs from their media library and site (`public/isfugl/ph`).
- 79 recipe images and 22 cut images are **generated** (Higgsfield `gpt_image_2_5`, high, 2k), anchored to
  their own 2014 shoot as image references. They are stand-ins; `photoCredit` in `data.ts` says so.
  Replace with a real shoot before launch.

## Motion rules kept

Reveals enhance a visible default; all animation is transform/opacity except one deliberate, contained
exception: the sustainability strip animates `width` inside a `contain:layout` row (noho's signature
reveal, kept on purpose). Reduced motion: every transition/animation drops to 0.15s, reveals do not move.
Hover motion is gated behind `(hover:hover) and (pointer:fine)`. Drawer/popup exits are faster than enters.

## Accessibility notes

Dialogs are `role=dialog` `aria-modal`, Escape closes, Tab is trapped, focus returns to the trigger.
Keyboard open lands on the close button; pointer or touch open lands on the dialog (no stray ring).
Tablists have arrow keys. 44px touch targets. `aria-live` on farm text, stockist list, contact result.
