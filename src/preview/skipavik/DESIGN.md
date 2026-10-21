# Skipavík ehf. — DESIGN.md (prototype, 2026-10-21)

Route `/preview/skipavik` (Icelandic only). A re-aim of the Set engine (`../set/`, read only): the catalogue, material
list and staff queue keep their mechanics; content, tokens, logo and copy are Skipavík's. Every class is `skv-*`,
tokens live on `.skv`. Research and sources: `_docs/skipavik-2026-10-21/claude/REPORT.md`; photo provenance:
`_docs/skipavik-2026-10-21/claude/build/photo-map.tsv` (25 photos from skipavik.is, fetched 2026-10-21).

## 1. The idea in one line

**The slipway's published dimensions are the device.** 400 þungatonn, 8,6 m sleði, 27 m inni í húsi, set as
dimension lines (a hairline with end ticks) under the hero, and again as the large figure on any job card that has no
matching photo. Set's pipe ring stays only on the ring buttons.

## 2. Set → Skipavík mapping

| Set | Skipavík |
|---|---|
| 7 product families | 5 divisions: Dráttarbraut, Vélsmiðja Stykkishólmi, Vélsmiðja Grundartanga, Byggingar, Verslun |
| Products with SKU | Services (`req`, can go on a request) and published jobs (`D-`, `V-`, `G-`, `B-`, `S-` codes) |
| PDF chapter links per family | The division's own people and direct phones, as skipavik.is lists them |
| Efnislisti (qty, unit, delivery) | Verkbeiðni: one line per job, vessel name, registration no., length, tonnage, start date, place, photo |
| Yfirferð (sales queue) | Yfirferð (foreman queue); missing size/date/place flagged; sample rows labelled sýnigögn |
| Þjónusta accordion | Spurt og svarað (request contents, slipway capacity, Grundartangi, Víkurhverfi, opening hours) |
| Framleiðsla rail | Saga rail (their own um-okkur text: 1967/1975, 1977, 1986/2006, 1998/2005, Valtýr) |

## 3. Tokens (measured 2026-10-21)

- `--navy #0B436C`: logo colour (sampled from skipavik_logo.png); logo fill on light, fact figures.
- `--petrol #082F4D`: dark panels, footer, active rail card (white 13.78:1, copper on it 5.18:1).
- `--green #CF9253`: the copper of their header band (`preset1.css`, 26 uses). Accent only; never text on white (2.66:1);
  ink on copper 7.09:1. `--gdeep #8A5A2B` (5.87:1) if small copper text is ever needed.
- `--card #F2F0EC`, `--card2 #E6E3DD`: warm greys. Fonts: Set's Strichpunkt Sans + Switzer (self-hosted, Icelandic verified).

## 4. Honesty rules applied

- A job card shows a photo only when the photo shows that job or place; otherwise the key published figure
  (Baldur's tank, bulbous bows, Norðurál, Víkurhverfi).
- No life-raft service anywhere (licence returned Sept 2025). No founding year in the hero (1906/1907/1908/1967/1975 conflict).
- Víkurhverfi only as the municipality published it: LOI, 14–28 units, plan in public comment until 12 Nov 2026. No units, prices or availability.
- The "Málningarþjónusta" and Grundartangi workshop lines cite HEV minutes no. 202 (permits issued 16 Apr 2026).
- Nothing posts. Requests live in localStorage; the staff queue's other rows are sýnigögn.

## 5. Text fixes to their own copy (list for the client)

"almment" → "almennt", "tækju" → "tækjum", "Gaugstaðaskipinu" → "Gaukstaðaskipinu", "Skipamíðastöðin" → "Skipasmíðastöðin".

## 6. Motion

Set's engine, tightened: hero words 650 ms / 70 ms stagger, display masks 950 ms / 70 ms, loader about 2.5 s once per
session. Lenis on fine pointers only. Reduced motion: engine off. Review: `review-animations` approved 2026-10-21
after fixing the `dataset.setI` → `skvI` stagger regression from the prefix rename.
