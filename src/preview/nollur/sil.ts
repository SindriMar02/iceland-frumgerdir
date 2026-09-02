/* Roofline of the hero photograph (nollur.is upload hrafn-01, 2560x1452), traced by
   hand from a gridded reference at 1-2% precision, using a constrained gradient scan for
   the two long straight fascia runs (apex to each corner) and manual points at every real
   corner: the canopy step, the roof's own front tip (with open sky between it and the
   shadowed wood tower — that tower's peak sits UNDER the roof's overhang and never
   touches sky, so it plays no part in the line), the golden tower, and a heavily
   smoothed mountain ridge (a per-pixel trace of a real hillside reads as a sawtooth from
   rock and tree texture; only a wide moving average reads as a ridge). Verified with a
   magenta overlay at 1400px and zoomed crops of both corners — 2026-09-02.
   The wordmark stands in the sky; the house is clipped to sit in front of it. */
export const SIL_RATIO = 1.7631
export const SIL: Array<[number, number]> = [[0,0.45],[0.05,0.445],[0.1,0.44],[0.14,0.43],[0.16,0.4],[0.171,0.376],[0.19,0.362],[0.21,0.345],[0.23,0.339],[0.246,0.337],[0.25,0.3],[0.253,0.252],[0.267,0.219],[0.278,0.2094],[0.289,0.2004],[0.3,0.1915],[0.311,0.1825],[0.322,0.1736],[0.333,0.1646],[0.344,0.155],[0.355,0.146],[0.366,0.1371],[0.377,0.1281],[0.388,0.1191],[0.399,0.1095],[0.41,0.0978],[0.421,0.0916],[0.432,0.0826],[0.443,0.073],[0.454,0.064],[0.465,0.0551],[0.476,0.0482],[0.487,0.0558],[0.498,0.0634],[0.509,0.0709],[0.52,0.0751],[0.531,0.0854],[0.542,0.0937],[0.553,0.1384],[0.564,0.1081],[0.575,0.1129],[0.586,0.1205],[0.597,0.1281],[0.608,0.1357],[0.619,0.1439],[0.63,0.1515],[0.641,0.1591],[0.652,0.1667],[0.663,0.2087],[0.674,0.2128],[0.685,0.2204],[0.696,0.2273],[0.707,0.2052],[0.718,0.2417],[0.729,0.2486],[0.735,0.251],[0.755,0.2495],[0.763,0.253],[0.775,0.248],[0.786,0.247],[0.79,0.32],[0.805,0.26],[0.8129,0.2588],[0.8207,0.2592],[0.8285,0.2574],[0.8363,0.2538],[0.8441,0.2472],[0.852,0.2401],[0.8598,0.2369],[0.8676,0.2343],[0.8754,0.2307],[0.8832,0.2277],[0.891,0.2246],[0.8988,0.2213],[0.9066,0.2202],[0.9145,0.221],[0.9223,0.2199],[0.9301,0.2213],[0.9379,0.2227],[0.9457,0.2216],[0.9535,0.2208],[0.9613,0.2178],[0.9691,0.2159],[0.975,0.214],[1,0.2]]
