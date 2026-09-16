# PRODUCT.md: Nýpugarðar (glacierview.is)

The website for Nýpugarðar, a quiet family-run guesthouse on Mýrar in Hornafjörður,
south-east Iceland: eleven rooms (two sharing a bathroom) and two cottages, 4 km off
Route 1 between Höfn and Jökulsárlón, with dinner from the menu and breakfast in a
dining room facing the glacier. Signed client (Nýpugarðar ehf., Bogga).

- **Register:** brand / marketing. The landing page IS the product; the rooms page is
  the inventory. Booking itself happens in Godo (direct), deep-linked with the guest's
  dates.
- **Audience:** international Ring Road travellers planning a night between Höfn and the
  glacier lagoon, mostly on a phone, often mid-trip; and Bogga, who must recognise her
  own place in it. English default, Icelandic at /is/.
- **Job:** make the quiet, the view and the evening meal felt in one scroll, then route
  every intent to "Check availability" with dates carried through.
- **Scene:** a traveller in a rental car park at Jökulsárlón at 4 pm, grey light, one
  bar of signal, deciding where to sleep tonight.
- **System:** React + Vite + Tailwind v4, prerendered EN/IS routes, GSAP ScrollTrigger
  scenes, Lenis on fine pointers only. Visual system in `DESIGN.md` (Kleif v1 patterns,
  mist to night).
- **Honesty model:** every fact is Bogga's own word or re-verified
  (`_docs/NYPUGARDAR-FACT-CHECK-2026-09-16.md`). All photographs are hers. Guest reviews
  verbatim, never edited. No invented prices, sizes, animals or views.
- **Voice:** plain, warm, first person plural, short sentences, no dashes, no
  superlatives. Bogga's own asks lead: only the sounds of nature, quiet and peaceful.
- **Constraints:** noindex until launch; zero em dashes in prose; reduced motion gets a
  complete static page; mobile verified in the iOS Simulator.
