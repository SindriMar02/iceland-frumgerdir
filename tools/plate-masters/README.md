# Parallax depth plates — masters

`emperador-mid.png` / `emperador-near.png` are the alpha masters for the two
marble layers in the hero parallax (`src/components/ui/parallax-scrolling`).
They live here rather than in `public/` because nothing loads the PNG: the
page serves `emperador-*.avif` / `emperador-*.webp`.

The alpha edge is fractal midpoint displacement (the standard terrain-
generation algorithm) rendered as a polygon and then Gaussian-blurred for a
real feather — NOT a sine wave. A fixed-period sine mask reads as a
repeating decorative scallop, a hand-drawn zigzag, not a stone edge; the
21st.dev reference's own layers are real photographic depth-cut mattes with
soft antialiased edges, which is the bar this is trying to hit without a
subject to rotoscope. `mid` and `near` share the same coarse displacement
pass (`SHARED` seed) so their macro silhouette stays coherent where the two
layers overlap, and diverge only in the fine-detail pass. Regenerate with `gen_masks.py` in this directory.

`plate-mid.png` and `plate-front.png` (below) are an OLDER, separate pair of
alpha masters for interior-photo vignettes, superseded by the marble plates
above for the current hero. They live here for the same reason — nothing
loads the PNG.

They are her own photographs, feathered — NOT cut out. The reference component
(21st.dev @osmosupply/parallax-scrolling) uses three registered 2000x1906
canvases where layer 1 is opaque, layer 2 is 50.4% transparent and layer 4 is
70.2% transparent: one backdrop plus two real cut-outs. Her portfolio is
single-plane interiors and cannot be cut that way — a background remover run
on the Súluhöfða kitchen returned a 99.7%-transparent fragment, because a room
has no subject to isolate. So these are alpha-vignetted instead, 24% and 21%
transparent, which gives overlapping planes with no hard rectangle edge.

Regenerate (from public/katrinisfeld, then move the PNGs back here):

    mk () { magick "$1" -resize 2000x^ -gravity center -crop "$3" +repage \
      \( -size "${3%%+*}" xc:black -fill white -draw "roundrectangle $4" -blur "0x$5" \) \
      -alpha off -compose CopyOpacity -composite "$2"; }
    mk p-skuggahverfi-0-2400.jpg plate-mid.png   2000x820+0+0 "90,60 1910,760 40,40" 70
    mk p-badherbergi-0-2400.jpg  plate-front.png 2000x900+0+0 "70,50 1930,850 40,40" 85
    cwebp -q 72 -alpha_q 90 plate-mid.png -o plate-mid.webp
    avifenc -q 46 -s 6 plate-mid.png plate-mid.avif
