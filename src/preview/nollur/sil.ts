/* RETIRED 2026-09-02. This traced the hero photo's roofline for a clip-path
   cutout behind the wordmark. Two rounds of that (a blind pixel scan, then a
   hand-corrected trace verified against a magenta overlay at every corner)
   still read as a bad cutout once live. The hero now uses Drangar's own
   pattern instead: the wordmark on plain ground, a waterline, a fixed-height
   photo band below it, no clip-path. Nothing in Page.tsx imports this file
   any more; kept only as the record of what was tried and why it was dropped.
   See [[nollur-build]]. */
export const SIL_RATIO = 1.7631
export const SIL: Array<[number, number]> = []
