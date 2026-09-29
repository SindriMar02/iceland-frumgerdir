# Colour engine handoff

Implemented the public entry point in `index.ts:1`: six colourants and a fixed white base (`pigment.ts:4`), spectral mixing (`pigment.ts:79`), D65 CIELAB and CIEDE2000 matching (`matcher.ts:6`, `matcher.ts:31`, `matcher.ts:63`), and reversible recipe codes (`kort.ts:27`, `kort.ts:40`). The existing `litir.ts` was read and left unchanged; its warning about estimated scanned colours still applies (`litir.ts:1`).

The engine is an illustrative preview, **not a calibrated paint formulation system** (`pigment.ts:1`). A dealer can recover the requested drops and product/gloss/pack indices, but converting that request into actual tinting-machine quantities requires Málning's calibration and the UI's index tables (`kort.ts:4`, `kort.ts:60`).

## Model and parameter provenance

At each of 31 wavelengths, 400–700 nm in 10 nm steps, the model adds pigment absorption **K** and scattering **S** to an always-present, highly scattering titanium-white surrogate. K removes light; S redirects it through the paint. The spectra and base coefficients are synthetic, not measured titanium dioxide or commercial colourant data (`pigment.ts:18`, `pigment.ts:54`, `pigment.ts:88`).

The optically thick Kubelka–Munk relation is `R∞ = 1 + q − sqrt(q² + 2q)`, where `q = K/S`. The implementation uses the mathematically equivalent reciprocal form to avoid cancellation. Dividing both mixed coefficients by total mixture volume would cancel in their ratio (`pigment.ts:88`, `pigment.ts:92`).

All coefficients in the following table were **chosen by eye/engineering judgement for typical tinting behaviour**, not fitted to measurements. With `E(λ,c,w) = 1 / (1 + exp((λ−c)/w))`, the model uses these absorption curves and constant scattering coefficients (`pigment.ts:54`, `pigment.ts:57`):

| Material | K(λ) | S | Code reference |
| --- | --- | --- | --- |
| White base | 0.0002 | 1 | `pigment.ts:88`, `pigment.ts:90` |
| Gult | 0.025 + 9 E(λ,495,12) | 0.18 | `pigment.ts:56`, `pigment.ts:62` |
| Rautt | 0.04 + 7 E(λ,590,14) + 2 E(λ,490,15) | 0.12 | `pigment.ts:56`, `pigment.ts:63` |
| Blátt | 0.04 + 8 (1−E(λ,565,17)) | 0.10 | `pigment.ts:56`, `pigment.ts:64` |
| Grænt | 0.08 + 7 E(λ,490,15) + 7 (1−E(λ,585,18)) | 0.14 | `pigment.ts:56`, `pigment.ts:65` |
| Umbra | 0.7 + 5 E(λ,580,65) | 0.20 | `pigment.ts:56`, `pigment.ts:66` |
| Svart | 12 at every wavelength | 0.04 | `pigment.ts:56`, `pigment.ts:67` |

One drop contributes 0.0125 relative pigment units to one fixed base unit; this is an interactive strength control, not millilitres. Missing drops mean zero, and each colourant permits 0–40 integer drops independently. Out-of-range, fractional and non-finite values throw `RangeError` (`pigment.ts:79`, `kort.ts:20`).

Yellow absorbs short wavelengths; blue absorbs long wavelengths; their overlapping low-absorption region produces green. Red also absorbs blue strongly, preserving a warm pink in white. Umbra's broad absorption decreases toward red; black's flat absorption stays neutral (`pigment.ts:62`, `selftest.ts:36`, `selftest.ts:40`, `selftest.ts:45`, `selftest.ts:48`). Concentrated drop-display hex values are separately chosen visual swatches, not spectrophotometer readings or inputs to the mixing calculation (`pigment.ts:4`, `pigment.ts:59`, `pigment.ts:90`).

The colour-matching functions and illuminant values are rounded standard tabulations, rather than tuned pigment parameters. References: [CIE 1931 2° observer dataset](https://cie.co.at/datatable/cie-1931-colour-matching-functions-2-degree-observer) and [CIE D65 dataset](https://cie.co.at/datatable/cie-standard-illuminant-d65). The embedded table samples these at 10 nm (`pigment.ts:18`).

Reflectance is integrated against D65 and the observer. Each XYZ channel is normalized so a flat unit reflector maps to D65 `[0.95047, 1, 1.08883]`, compensating for truncated tails and coarse sampling. This is an explicit approximation, useful for neutral greys. The common 10 nm integration factor cancels in normalization (`pigment.ts:70`, `pigment.ts:95`, `pigment.ts:97`).

The XYZ↔sRGB matrices, piecewise sRGB transfer functions and CIELAB transformation are standard colourimetric conversions, not visually tuned; see the [W3C colour-conversion reference](https://www.w3.org/TR/css-color-4/#color-conversion-code). This implementation uses rounded D65 matrix/white-point constants and keeps Lab relative to D65, without CSS Lab's D50 adaptation. Linear RGB is clipped to the display gamut, then encoded and rounded to bytes (`pigment.ts:70`, `pigment.ts:74`, `pigment.ts:99`, `matcher.ts:5`).

CIEDE2000 follows [Sharma, Wu and Dalal's implementation notes](https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/ciede2000noteCRNA.pdf), with all parametric weights equal to one. Matching sorts unrounded distances before returning one-decimal distances; exact ties retain card order. Labels use inclusive bounds: ≤2 `nakvaemur`, ≤5 `mjog-nalaegur`, ≤10 `nalaegur`, otherwise `fjarlaegur`. These labels are UI heuristics, not guarantees about real paint (`matcher.ts:30`, `matcher.ts:63`, `matcher.ts:72`).

## Recipe format and integration contract

Import runtime functions and types from `./index.ts`; the public barrel also exposes `KOPAL_LITIR` (`index.ts:1`). `srgbToLab` accepts byte-scale RGB and returns `[L*, a*, b*]`; `naestiLitur` accepts exactly `#RRGGBB`, with case-insensitive digits, and a nonnegative integer count, defaulting to three (`matcher.ts:5`, `matcher.ts:58`, `matcher.ts:63`).

The code alphabet is `0123456789ABCDEFGHJKMNPQRSTVWXYZ`. Its 12 symbols represent, most significant bits first: **8 zero padding bits**, six **6-bit** drop values in `LITEFNI` order, **6-bit vara**, **2-bit gljai**, **3-bit litrar**, and **5-bit checksum**. The checksum uses polynomial `x⁵+x²+1`, MSB-first, initial register 31 and final XOR 31 over exactly 47 payload bits. Only 52 meaningful bits enter Number arithmetic, within its exact integer range (`kort.ts:5`, `kort.ts:7`, `kort.ts:11`, `kort.ts:27`).

The parser requires the `MAL` prefix and 12 body symbols after removing whitespace/dashes. It accepts lowercase and body aliases O→0, I/L→1. It rejects bad checksums, nonzero padding, unknown symbols, wrong lengths, drops above 40, and pack indices above 5 (`kort.ts:40`, `kort.ts:53`, `kort.ts:61`).

Round-trip equality is **recipe-value equality**: omitted drop properties and explicit zero are equivalent; the decoder materializes all six drop keys. No sparse-key-presence information is stored. The model, colourant order and UI-owned product/gloss/pack index mappings need to remain stable for issued codes; this format contains no version or mapping data (`kort.ts:7`, `kort.ts:10`, `kort.ts:60`, `selftest.ts:26`).

Fixed examples, also checked against an independent BigInt polynomial-division calculation during development, are stored as selftest vectors (`selftest.ts:140`, `selftest.ts:143`):

| Recipe | Code | Evidence |
| --- | --- | --- |
| All zero | `MAL-0000-0000-000Y` | `selftest.ts:143` |
| All drops 40, vara 63, gljai 3, litrar 5 | `MAL-02H8-MA52-HZXC` | `selftest.ts:144` |
| Drops 1,2,3,4,5,6; vara 37; gljai 2; litrar 4 | `MAL-0022-1H0M-D5MF` | `selftest.ts:145` |

The checksum detects typos; it is not authentication and cannot reject every possible multiple-symbol corruption. The selftest covers every alternate base32 symbol at every position for the three fixed recipes, and checksum corruption for every generated recipe (`kort.ts:11`, `selftest.ts:156`, `selftest.ts:191`).

## Verification performed

Executed from this folder with Node **v24.15.0**, using plain type stripping. Assertion failures print a message and exit with status 1 (`selftest.ts:8`); successful execution prints the check count (`selftest.ts:198`). Final command and exact output, exit status 0:

```text
$ node selftest.ts
OK 21830 checks
```

Coverage comprises white base `#fdfdfd`; neutral black tints at all 40 strengths; green from yellow+blue at 2, 12 and 40 drops each; warm pale pink; warm brown; non-increasing displayed Lab lightness for every single-colourant step 0–40; invalid numeric inputs; and D65 Lab black/white/red sanity (`selftest.ts:31`, `selftest.ts:36`, `selftest.ts:40`, `selftest.ts:45`, `selftest.ts:48`, `selftest.ts:51`, `selftest.ts:60`).

All **34 published Sharma reference pairs** pass with absolute tolerance 0.00005, in both directions, plus identity checks. Source: [published supplementary test data](https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/dataNprograms/ciede2000testdata.txt). Matching checks cover white/dark nearest entries, every card colour matching itself, sorted results, decimal rounding, count handling, malformed hex and all label boundaries (`selftest.ts:72`, `selftest.ts:110`, `selftest.ts:116`).

Code checks cover min/max/asymmetric examples, forbidden decoded fields despite correct CRC, aliases, whitespace/case, symbol corruption, malformed input, and invalid encoder values. A test-only LCG seeded with `0x4d414c` generates **5,000 recipes**, checking semantic round-trip, canonical re-encoding, checksum rejection, deterministic in-range mixing, unchanged inputs, and unchanged mixed colour after decoding (`selftest.ts:139`, `selftest.ts:146`, `selftest.ts:166`, `selftest.ts:175`, `selftest.ts:180`).

Strict TypeScript validation of the barrel, engine and selftest passed using the existing repository compiler, with no emitted files or diagnostics. Command, exit status 0, empty stdout/stderr (`index.ts:1`, `selftest.ts:1`):

```sh
node ../../../../node_modules/typescript/bin/tsc --noEmit --strict --noUnusedLocals --noUnusedParameters --isolatedModules --allowImportingTsExtensions --verbatimModuleSyntax --target ES2022 --lib ES2022 --module ESNext --moduleResolution bundler --types node --skipLibCheck index.ts pigment.ts matcher.ts kort.ts selftest.ts
```

## not_checked

- Actual Málning colourant spectra, physical drop volumes, titanium-white formulation, wet/dry differences, substrate, film thickness, gloss and lighting-dependent appearance were not measured. Product/gloss/pack indices are preserved but do not change the preview (`pigment.ts:1`, `pigment.ts:54`, `pigment.ts:79`, `kort.ts:4`).
- Real Kópal paint-match accuracy and dealer/tinting-machine acceptance were not validated; the palette is estimated from a scan and the recipe coefficients are synthetic (`litir.ts:1`, `pigment.ts:1`, `kort.ts:4`).
- Browser/React integration, the complete Vite build and UI-owned index tables were not tested. The verification above compiles these files explicitly and runs the pure API through the selftest (`index.ts:1`, `selftest.ts:1`, `kort.ts:4`).
- Spectral convergence against finer sampling, out-of-gamut perceptual mapping, calibrated displays and an independent machine comparison of every embedded CIE table entry were not checked. Direct CSV retrieval was unavailable; dataset descriptions were consulted and rounded tabulations embedded (`pigment.ts:18`, `pigment.ts:70`, `pigment.ts:74`).
- The full combinatorial recipe space was not enumerated; 5,000 deterministic samples plus boundary fixtures were checked. Monotonicity is checked for single-colourant ramps, not all possible additions to arbitrary existing mixtures (`selftest.ts:51`, `selftest.ts:140`, `selftest.ts:180`).
