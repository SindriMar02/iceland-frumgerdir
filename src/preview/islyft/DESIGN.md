# Íslyft: “Lyftarar og önnur tæki”

A content transplant of `../isband/`, itself the Bílabúð Benna system. Slices 2 and 3 change copy, data bindings, photographs and colour values only. Same components, section order, classes, geometry, breakpoints and animation implementation. Chat now answers from the Íslyft harvest and carries named machines into the existing quote selector.

## What changed from ÍSBAND

| ÍSBAND | Íslyft |
|---|---|
| Red #E0123D surfaces, #B80E31 and #C40F35 darker shades | Blue #00538D; hover/frame shades #004574 and #004B80. White contrast 8.01:1, 9.98:1 and 9.06:1 respectively. No text-token darkening was needed. |
| Company red mark | Two-path blue #00538D / grey #A1A3A6 traced logo, white variant on dark plates. Grey is restricted to the non-text logo decoration; it is 2.53:1 on white and is not used as a text colour. |
| ÍSBAND wordmark | Íslyft SVG traced with potrace from the harvested 969×305 PNG. Top-left link still returns home. **Needs their vector before go-live.** Inherited logo sizing is unchanged under this slice's size restriction. |
| RAM hero and car claims | Linde E35–50 EVO warehouse image; “Lyftarar og önnur tæki”. Same hero layout. |
| Six category cards | Electric forklifts, diesel forklifts, telehandlers, work platforms, tractors and Sölutorg. Same six-card rail. |
| Jeep/RAM and Leapmotor split | Linde and Manitou. Same two plates, divider, slider, tabs and motion. |
| Hardcoded car-brand filters | Six machine-type buttons: all, forklifts (6), telehandlers (2), work platforms (2), tractors (2), other equipment (4). Same markup and classes. |
| New-car grid and published prices | 16 featured machines with real photographs/specifications; all prices null and “Fáðu tilboð”. E16–20 EVO replaces E35–50 EVO in the grid to avoid duplicating the hero image. |
| Loan strip | Removed. LOANS is an empty typed array; no financing claim or subsidy. |
| Eight used cars | Ten photographed Sölutorg units. The three photo-less records are excluded; “Öll söluskráin” still links to the full HTTPS portal. Known hours display as vinnustundir; null metadata is omitted without separators. |
| Workshop copy, hours and emergency tile | Published workshop/parts contact copy; phone CTA. Hours and emergency tile removed. No workshop form, rental or onsite-service claim. |
| Conversion statement and three package links | “Steinbock þjónustan.” / “Síðan 1972.” The oldest-service claim is attributed in the smaller existing text. Source history URL in existing small print. The same three link cells now point to history, parts and workshop directory. |
| Seven-point company chronology | Three supported entries: Steinbock 1972, Íslyft later (no year), John Deere agency 2017. Five existing float slots show distinct catalogue photographs with literal captions. |
| Opening-hours rows/status/emergency row | Five published departments, aligned address cells (empty if unknown), conditional phone fields. All hour/status/emergency renders removed. Two company addresses appear in the existing intro paragraph. |
| Test-drive band | “Fáðu tilboð”. Exactly the existing name, phone and selector fields, with selected machine key retained in the form. No email field because the source has none. Local-only acknowledgement, unchanged submit behavior. |
| Footer legal details including VSK | Íslyft legal name and kennitala; unknown VSK omitted. Harvest provenance and local-only notice replace the donor claims. |
| Menu hours / sticky test-drive label | Published sales phone / “Fáðu tilboð”. Existing menu and sticky controls retained. |

The existing class prefix is `il`, fonts `IlF`, with unchanged geometry and motion. Legacy identifiers such as `IMG.splitJeep`, `reynsluakstur` and `btn-red` remain internal contracts, not visible copy. Donor code comments are left unchanged where the slice only authorizes value edits.

## Contradictions and limits (harvest 28.10.2026)

1. 1972 belongs to Steinbock þjónustan, not Íslyft. Their history says Íslyft was established later; JSON-LD omits foundingDate. “Elsta” is their published claim, explicitly attributed, not independently verified.
2. Opening hours, emergency number, VSK and rental offering are unknown. No fallback facts from ÍSBAND are used.
3. Only Akureyri has a department-specific address in company.json. Other departments retain empty address cells, with no href when unknown, to preserve the donor column alignment. Headquarters location is not silently assigned to them.
4. The stock list contains units described as used or unused. The UI calls it Sölutorg; it is not labelled rental inventory. `u-6056`, `u-9086`, `u-8250` are excluded because usable photographs are absent.
5. The blank E60 page, two untitled products and duplicate-name MT 420 H records are not selected. Published specs and units are not corrected by guesswork.
6. Manufacturer-looking image provenance is inferred in the harvest. No assertion of exclusive photo ownership. All 45 photograph slots use distinct source files. PICKS.md records choices, alternatives and provenance; missing verified alternates are explicitly marked.
7. JSON-LD lists the ten represented catalogue brands. The Brand type still records all twelve agencies; SAMI/Sennebogen have no qualifying local models in the sample. No manufacturer catalogue was imported and no Sennebogen internal destination was invented.
8. Chat has been rewritten from the harvest, resolving all seven donor-brand errors. The literal root `tsc --noEmit` is not an application check because its config has no files.
9. The inherited pointer-open menu focuses its close button. Focus-guard results and any visual limits caused by longer copy are reported in SLICE-2-REPORT.md; no forbidden focus/layout changes were made.

10. Slice 3 photo-only correction could not meet every split text contrast threshold. Eleven environment candidates were rendered at 1440/390; measured failures are retained explicitly in SLICE-3-REPORT.md. No overlay or CSS change was authorized.
11. PICKS.md covers all 45 slots. Twenty-two slots lack two distinct verified alternatives; empty alternative panels are labelled instead of substituting another stock unit.

## Sources

`_docs/islyft-harvest-2026-10-28/`: CONTENT.md, company.json, brands.json, categories.json, models.json, stock.json, asset-manifest.json and logo/islyft_logo_gegns-8942cd59.png. Source sites: https://www.islyft.is/, https://www.islyft.is/um-okkur-2/, https://www.islyft.is/varahlutir-3/ and the HTTPS Sölutorg portal. Published record URLs are retained in data.ts. Source-to-section mapping and source-to-asset mapping are in `_docs/islyft-build-2026-10-28/`.

## Verification

See `_docs/islyft-build-2026-10-28/SLICE-3-REPORT.md` for four-width results, split pixel contrast, screenshots, chat transcript and focus check. No deployment or external form submission.
