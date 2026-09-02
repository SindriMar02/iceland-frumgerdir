/**
 * 21st.dev prebuiltui/image-gallery — installed via the shadcn CLI, then made
 * into an actual component.
 *
 * WHAT SHIPPED FROM THE REGISTRY was a demo, not something reusable: six
 * hardcoded cdn.21st.dev URLs, an `Example()` export, two unused imports that
 * failed the typecheck, and — the dangerous one — an inline
 * `* { font-family: 'Poppins' }` with a Google Fonts @import. That selector is
 * unscoped, so rendering it anywhere on this site would have repainted every
 * page in Poppins.
 *
 * WHAT WAS KEPT is the mechanic, which is the good part: a flex row where each
 * panel is `flex-grow` and the hovered one expands over 500ms while its
 * neighbours give way.
 *
 * TWO DELIBERATE DEPARTURES, both forced by what this content is:
 *
 *   · the registry expands the hovered panel to `w-full`, crushing the others
 *     to a sliver. These five are a PALETTE — every one has to stay readable
 *     as colour even while one is open — so it grows to 2.2x instead.
 *   · the registry reveals its caption only on hover. Here the material's name
 *     IS the content, so the name never hides; the expansion buys the hex and
 *     the full still-life, which a narrow column crops away.
 *
 * The veil behind the label is an ellipse rather than a full-bleed scrim, and
 * its values are measured, not chosen: a flat scrim fixed the contrast by
 * bleaching every material back to beige, which is the one thing a colour
 * board cannot do. Re-measure whenever a texture, a label colour, or the
 * strip's height changes — the numbers of record are in the commit.
 */
import { Photo } from '@/preview/katrinisfeld/kit'

export interface GalleryItem {
  id: string
  name: string
  hex: string
  alt: string
  /** true where the material is dark enough to need cream type */
  dark?: boolean
}

/* The veil ellipse is re-solved whenever the cell's SHAPE changes, because
   its job is to cover the label and nothing else. Tuned for the full-width
   bands (92%/32%) it left the ends of the label outside the veil once the
   cells became columns, and Vínrautt measured 2.93 on its worst pixel —
   failing AA outright, since the accordion crop shows a brighter slice of
   that photograph than the wide band did. Widening it fixes that at the same
   alpha, which is the cheap direction: raising the alpha instead dims the
   material, and the material's colour is the content. */
const VEIL_DARK =
  'radial-gradient(ellipse 34% 150% at 50% 50%, rgb(0 0 0 / .70) 0%, rgb(0 0 0 / .52) 52%, rgb(0 0 0 / 0) 82%)'
const VEIL_LIGHT =
  'radial-gradient(ellipse 34% 150% at 50% 50%, rgb(243 239 232 / .80) 0%, rgb(243 239 232 / .54) 52%, rgb(243 239 232 / 0) 82%)'

export default function ImageGallery({ items }: { items: ReadonlyArray<GalleryItem> }) {
  return (
    /* VERTICAL, and condensed at rest. The registry lays its panels out as a
       ROW that expands in width; these are wide material photographs, and a
       narrow column crops a still-life down to a stripe of texture. Stacked
       instead, each row runs the full width and expands in HEIGHT, which is
       the axis the pictures actually have. At rest five rows share ~440px, so
       a row is about 88px — a strip, not a section — and the open row takes
       roughly 2.4x that. */
    <div className="flex flex-col md:h-[clamp(340px,30.6vw,440px)]">
      {items.map((it) => (
        <figure
          key={it.id}
          tabIndex={0}
          /* focus as well as hover: the registry component is pointer-only,
             which leaves the whole thing unreachable from a keyboard */
          className={[
            'group relative m-0 h-[132px] min-h-0 grow overflow-hidden outline-offset-[-3px]',
            'md:h-auto md:basis-0 md:hover:grow-[2.4] md:focus-visible:grow-[2.4]',
            'transition-[flex-grow] duration-500 ease-[cubic-bezier(.62,.05,.01,.99)]',
            'motion-reduce:transition-none',
            /* her global .ki-root picture > img rule sets height:auto and wins
               on specificity, so these have to be important to fill the cell */
            '[&_picture]:!block [&_picture]:!h-full [&_img]:!h-full [&_img]:!w-full [&_img]:!object-cover',
          ].join(' ')}
        >
          <Photo id={it.id} alt={it.alt} sizes="100vw" />

          <figcaption
            className="absolute inset-0 flex flex-row items-center justify-center gap-[clamp(12px,1.5vw,26px)]"
            style={{ color: it.dark ? '#F4EEE6' : '#231F1B' }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: it.dark ? VEIL_DARK : VEIL_LIGHT }}
            />
            <span className="relative font-[Sentient,Georgia,serif] text-[clamp(19px,1.74vw,25px)] font-light leading-none tracking-[.012em]">
              {it.name}
            </span>
            <span
              className={[
                'relative font-[GeistMono,ui-monospace,monospace] text-[clamp(10.5px,.76vw,11px)] tracking-[.2em]',
                'opacity-0 translate-x-[-6px] transition-[opacity,transform] duration-[420ms] ease-out',
                'md:group-hover:opacity-80 md:group-hover:translate-x-0',
                'md:group-focus-visible:opacity-80 md:group-focus-visible:translate-x-0',
                'max-md:opacity-80 max-md:translate-x-0',
                'motion-reduce:transition-none',
              ].join(' ')}
            >
              {it.hex.toUpperCase()}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
