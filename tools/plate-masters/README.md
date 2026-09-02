# Parallax depth plates — masters

`plate-mid.png` and `plate-front.png` are the alpha masters for the layered
opening on the home page. They live here rather than in `public/` because
nothing loads the PNG: the page serves `plate-*.avif` / `plate-*.webp`, and a
3.3 MB pair of unreferenced PNGs was shipping in the deploy.

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
