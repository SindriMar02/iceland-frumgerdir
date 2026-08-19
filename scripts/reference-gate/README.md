# Reference transplant gate

Run BOTH the reference and the build through the same probe before claiming a
build follows a reference. Reading the reference's fonts and libraries out of
its DOM is not a transplant; comparing the two pages on measurable devices is.

    # one headless chrome, once
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
      --use-angle=swiftshader --enable-unsafe-swiftshader \
      --remote-debugging-port=9352 --user-data-dir=/tmp/ref-profile &

    URL=https://the-reference.com            node devices.mjs
    URL=http://localhost:5199/preview/<slug> node devices.mjs

`devices.mjs` reports image area per viewport, image count, computed heading
sizes, heading alignment spread, tables, and large background colours.
`deadzone.mjs` reports per-section "dead px" so you can see which sections are
dragging the ratio down instead of guessing.

The metric that matters most is **image area / (viewport width x page height)**.
It is what separates a photography-led page from a text page with photos in it.

Do not chase the number by packing content tighter or padding the page longer.
Match the picture SIZE and the surrounding air first; the ratio follows.
