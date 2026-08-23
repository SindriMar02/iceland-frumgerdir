#!/usr/bin/env python3
"""Turn marked signature boxes into REGISTERED loader frames.

Input : marks.json  — the JSON copied out of public/asaja/mark-signatures.html
        { "<work>": {"x0":..,"y0":..,"w":..,"h":..,"W":..,"H":..}, ... }
Output: public/asaja/flip/NNN.jpg  — one frame per marked work, cropped so that
        EVERY signature lands at the identical position and identical size in the
        frame. That registration is the whole point of the loader: the mark holds
        dead still while the painting behind it changes.

Run:  python3 _assets-src/signature/build-flip-frames.py marks.json
"""
import json, os, sys
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WORK = os.path.join(ROOT, 'public', 'asaja', 'work')
OUT = os.path.join(ROOT, 'public', 'asaja', 'flip')

# frame geometry — must match SignatureFlip.tsx's expectations
FW, FH = 1400, 900
# The signature occupies this fraction of the frame width, and its centre sits at
# (SIG_CX, SIG_CY). Those are NOT centre-of-frame: she signs near the edge of her
# canvases, so centring would push every crop outside the image. 0.87/0.90 is the
# placement solved to keep EVERY crop in-bounds, which is what makes the mark land
# in the identical spot on every frame instead of drifting.
SIG_W_FRAC = 0.18
SIG_CX, SIG_CY = 0.87, 0.90


def main(path):
    marks = json.load(open(path))
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):
        if f.endswith('.jpg'):
            os.remove(os.path.join(OUT, f))

    made = 0
    for name, m in sorted(marks.items()):
        hires = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'hires', f'{name}.jpg')
        src = hires if (m.get('hires') and os.path.exists(hires)) else os.path.join(WORK, f'{name}.jpg')
        if not os.path.exists(src):
            print(f'  skip {name}: no source image')
            continue
        im = Image.open(src).convert('RGB')
        # scale so the marked signature width becomes SIG_W_FRAC of the frame
        scale = (FW * SIG_W_FRAC) / max(1, m['w'])
        up_pre = scale
        # crop box in source pixels that maps to the frame
        cw, ch = FW / scale, FH / scale
        scx = m['x0'] + m['w'] / 2
        scy = m['y0'] + m['h'] / 2
        x0 = scx - cw * SIG_CX
        y0 = scy - ch * SIG_CY
        # SHIFT (never resize) to stay inside the painting: the signature keeps its
        # exact on-screen SIZE — the thing registration depends on — and only drifts
        # in position when it sits too near an edge to centre properly.
        x0 = max(0, min(x0, im.width - cw))
        y0 = max(0, min(y0, im.height - ch))
        box = (int(round(x0)), int(round(y0)), int(round(x0 + cw)), int(round(y0 + ch)))
        canvas = Image.new('RGB', (box[2] - box[0], box[3] - box[1]), (14, 14, 14))
        sx0, sy0 = max(0, box[0]), max(0, box[1])
        sx1, sy1 = min(im.width, box[2]), min(im.height, box[3])
        if sx1 > sx0 and sy1 > sy0:
            canvas.paste(im.crop((sx0, sy0, sx1, sy1)), (sx0 - box[0], sy0 - box[1]))
        out = canvas.resize((FW, FH), Image.LANCZOS)
        if up_pre > 1.2:   # counteract the softness of upscaling a small signature
            out = out.filter(ImageFilter.UnsharpMask(radius=1.6, percent=int(min(115, 45 * up_pre)), threshold=2))
        out.save(
            os.path.join(OUT, f'{made:03d}.jpg'), quality=86, optimize=True, progressive=True
        )
        clamped = abs(x0 - (scx - cw * SIG_CX)) > 2 or abs(y0 - (scy - ch * SIG_CY)) > 2
        flag = '' if up_pre <= 1.6 else ('  <-- SOFT' if up_pre > 2.8 else '  (ok)')
        print(f'  {name:24s} sig {m["w"]:4d}px  upscale {up_pre:4.1f}x'
              f'{"  OFF-CENTRE" if clamped else "  centred"}{flag}')
        made += 1
    print(f'wrote {made} registered frames to public/asaja/flip/')
    print(f'-> set FRAME_COUNT = {made} in src/preview/aslaugsaja/SignatureFlip.tsx')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'marks.json')
