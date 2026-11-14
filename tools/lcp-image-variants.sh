#!/bin/sh
# Smaller files for the images that load before the first paint on two home
# pages (reynirbakari.is, glacierview.is). 13 Nov 2026.
#
# WHY. Lighthouse's slow-4G model charges every byte that loads before the
# largest paint. Both pages spend that time on photographs far larger than a
# phone can show. Nothing here changes what anyone sees:
#
#   * RESIZED variants (Reynir's bun and menu frames) are only offered through
#     srcset, and the browser takes one at least as large as the slot in device
#     pixels. Desktop keeps the original file.
#   * TALL CROPS (Reynir's story plate, Nýpugarðar's hero, fog and glacier
#     band) are for full-bleed pictures on a portrait phone, where object-fit:
#     cover already throws away most of the width. The crop keeps the SAME
#     pixels at the SAME scale and drops only the sides the screen never shows,
#     so it is not a softer picture, it is a narrower file. The JPEG crops are
#     lossless (jpegtran, on MCU boundaries); the WebP crops are re-encoded.
#     Each crop is centred, because every one of these pictures is centred
#     horizontally (object-position 50%), and is wide enough for the widest box
#     the media query in the markup lets it into (see the notes in data.ts and
#     photos.ts).
#
# Needs ImageMagick 7 (magick), cwebp and jpegtran. Run from the repo root:
#   sh tools/lcp-image-variants.sh
set -eu
R=public/reynir
N=public/nypugardar

# ── Reynir: resized variants ────────────────────────────────────────────────
# $1 source, $2 width, $3 output, $4 quality. The quality is the one the source
# itself was saved at (found by re-encoding it until the size matched: the bun
# about 84, the menu frames about 88), so a variant is the same picture smaller
# and not a more compressed one.
resize() {
  magick "$1" -filter Lanczos -resize "$2x" png:- | cwebp -quiet -q "$4" -m 6 -alpha_q 100 -o "$3" -- -
}
for w in 480 640; do resize "$R/pistasiusnudur-v2.webp" $w "$R/pistasiusnudur-v2-$w.webp" 84; done
resize "$R/menu/lengjur.webp" 700 "$R/menu/lengjur-700.webp" 88
resize "$R/menu/lengjur.webp" 1100 "$R/menu/lengjur-1100.webp" 88
# bordid has no 1100: at this quality it is 194 kB against the 206 kB original.
resize "$R/menu/bordid.webp" 700 "$R/menu/bordid-700.webp" 88

# ── Reynir: the story plate, tall crop (2000x1335 → the middle 1256x1335) ───
magick "$R/gallery/gal-11.webp" -gravity center -crop 1256x1335+0+0 +repage png:- \
  | cwebp -quiet -q 84 -m 6 -o "$R/gallery/gal-11-tall.webp" -- -
magick "$R/gallery/gal-11.webp" -gravity center -crop 1256x1335+0+0 +repage -filter Lanczos -resize 1004x1067! png:- \
  | cwebp -quiet -q 84 -m 6 -o "$R/gallery/gal-11-tall-1004.webp" -- -

# ── Nýpugarðar: lossless tall crops of the JPEGs ────────────────────────────
# $1 id, $2 rendition width, $3 crop width, $4 height, $5 x offset (multiple of 16)
jcrop() {
  jpegtran -copy all -optimize -crop "$3x$4+$5+0" -outfile "$N/photos/$1-$2p.jpg" "$N/photos/$1-$2.jpg"
}
# hero, 16:9 → 4:5 or a touch wider
jcrop 125645004 640 288 360 176
jcrop 125645004 1280 576 720 352
jcrop 125645004 2000 912 1125 544
jcrop 125645004 2600 1192 1463 704
# glacier band, 4:3 → about 5:7
jcrop 125645011 480 256 360 112
jcrop 125645011 1100 588 825 256
jcrop 125645011 2000 1072 1500 464

# ── Nýpugarðar: fog plates, tall crops (16:9 → 4:5) ─────────────────────────
for layer in far veil near; do
  magick "$N/fog/$layer-960.webp" -gravity center -crop 432x540+0+0 +repage png:- \
    | cwebp -quiet -q 84 -m 6 -alpha_q 100 -exact -o "$N/fog/$layer-960p.webp" -- -
  magick "$N/fog/$layer-1920.webp" -gravity center -crop 864x1080+0+0 +repage png:- \
    | cwebp -quiet -q 84 -m 6 -alpha_q 100 -exact -o "$N/fog/$layer-1920p.webp" -- -
done

ls -l "$R"/pistasiusnudur-v2-*.webp "$R"/menu/lengjur-*.webp "$R"/menu/bordid-*.webp "$R"/gallery/gal-11-tall*.webp \
  "$N"/photos/*p.jpg "$N"/fog/*p.webp | awk '{printf "%8d  %s\n", $5, $9}'
