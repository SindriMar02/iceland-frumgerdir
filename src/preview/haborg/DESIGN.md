# Háborg fasteignasala: DESIGN.md (home page, 2026-09-28)

**Method:** the Fjárfesting build (`../fjarfesting/DESIGN.md`), a behaviour-for-behaviour
transplant of wild-ag.ch, re-aimed at Háborg. Same WebEd platform as Fjárfesting, so the
section map carries over one to one. Our own code, Háborg's own content, photos and brand.
Harvest: `03-prototypes/_harvest/haborg/MANIFEST.md`.

**The one idea:** Wild's gradient becomes **Háborg's navy**, and their logo's gold becomes the
second voice: logo subline, loader subline and the open-house cards. The loader draws their
H-of-towers mark, and the full-bleed frame before the contact form is their own building,
the tower at Grensásvegur 1.

## Tokens (changed from Fjárfesting)

| Token | Value | Source |
|---|---|---|
| `--m1` → `--m2` | #0B3253 → #2A5680 at 15deg | logo navy (app.css, 66 uses) |
| `--gold` / `--gold2` | #A68A46 / #CDB57A | "fasteignasala" in logo.jpg, sampled |
| `--band` | #ECEEF0 | cool band for the navy |
| `--ink` / `--mute` | #14202C / #5B6168 | navy-tinted dark, their grey #74787a darkened |
| `--rose` | #D8DFE6 | image placeholder |

Type and scale unchanged: Hanken Grotesk + Recia Italic. Logo wordmark is set in Hanken 500,
title case, like their own lowercase-geometric wordmark (not uppercased like Fjárfesting's).

## Deviations from the Fjárfesting page

| Section | Change | Why |
|---|---|---|
| Hero H1 + slogan | "Þverfagleg fasteignasala í fremstu röð." / "Háborg er í þína þágu." | their own lines, /starfsmenn Um okkur |
| Opin hús → **Nýtt á skrá** | 20 newest listings; the 2 open houses first, with a gold bar | only 2 open houses were scheduled; a 21-card open-house strip would be empty |
| Í sölu | 3 developments (Grásteinsmýri 3, Grensásvegur 1, Garðabraut 1), 37 of 51 listings | grouped from /soluskra |
| Loader masks | room below for the "g" descender; text starts 140% down | lowercase wordmark |
| Footer | "Aðild" column instead of kt./vsknr. | no kennitala or Facebook on their site |
| Prices | formatted by hand | `toLocaleString('is-IS')` falls back to English separators without Icelandic ICU |
