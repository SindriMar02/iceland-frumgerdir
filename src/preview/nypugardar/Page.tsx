import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from "react";
import { Suspense, lazy } from "react";
import type Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Armchair,
  ChevronLeft,
  ChevronRight,
  CigaretteOff,
  Flower2,
  Footprints,
  Mail,
  MapPin,
  Pause,
  Phone,
  Play,
  SquareParking,
  Sparkles,
  UtensilsCrossed,
  Users,
  Wifi,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** One mark per facility, keyed off the exact strings in FACILITIES. Kept here
 *  rather than in data.ts so the content file stays free of components. */
const FACILITY_ICON: Record<string, LucideIcon> = {
  Restaurant: UtensilsCrossed,
  Bar: Wine,
  "Free WiFi": Wifi,
  "Free private parking": SquareParking,
  Garden: Flower2,
  Terrace: Armchair,
  Hiking: Footprints,
  "Family rooms": Users,
  "Non-smoking rooms": CigaretteOff,
};
import { Img } from "../../components/Img";
import { setThemeColor } from "../../lib/preview";
import {
  ADDRESS,
  DINNER_QUOTE,
  EMAIL,
  BREAKFAST,
  FACILITIES,
  IMG,
  NAV,
  PHONE,
  REVIEWS_URL,
  PHONE_HREF,
  FEATURED_IDS,
  QUOTES,
  SCORE,
  FACTS,
} from "./data";
import {
  bookingHref,
  bookingReady,
  GODO_ROOM_NAMES,
  GODO_ROOM_NAMES_IS,
  ROOM_SLEEPS,
  type GodoRoomKey,
} from "./godo";
import { STANDALONE, counterpart, roomsPath } from "./paths";
import { useStay, type Stay } from "./stay";
import {
  largest,
  leadFor,
  restFor,
  srcSet,
  type Photo,
} from "./photos";

/** Every photograph on the page goes out as a srcset across the widths that
 *  actually exist on disk, with a `sizes` hint so a phone never pulls a 2000w
 *  file for a tile it renders at 160px. The widths come from photos.ts, which
 *  is generated alongside the files themselves, so the two cannot drift. */
export function frame(p: Photo, sizes: string) {
  return { src: largest(p), srcSet: srcSet(p), sizes };
}

/**
 * What a gallery tile is a picture of. A photograph Booking has filed under a
 * room type is labelled with that room type's own name, because that is her
 * filing rather than our reading of the picture. Everything else gets its
 * category, and a bathroom two room types share is never called private.
 */
export function photoAlt(p: Photo, t: Copy, lang: Lang): string {
  if (p.cat === "bath")
    return p.shared ? t.gallery.alt.bathShared : t.gallery.alt.bathPrivate;
  if (p.room?.length)
    return lang === "is"
      ? GODO_ROOM_NAMES_IS[p.room[0]]
      : GODO_ROOM_NAMES[p.room[0]];
  return t.gallery.alt[p.cat as "land" | "house" | "table"];
}

/**
 * Everything left over once the room types and the featured frames have taken
 * their own photographs. Between these three and the seven room groups, all 43
 * of her photographs are on the page — each of them exactly once. Nothing she
 * owns sits unused in the repo, nothing on the page is filler from somewhere
 * else, and no picture is printed twice to fill a hole.
 */
export const GALLERY_REST = (
  [
    { key: "table", photos: restFor(["table"], FEATURED_IDS) },
    { key: "house", photos: restFor(["house"], FEATURED_IDS) },
    { key: "land", photos: restFor(["land"], FEATURED_IDS) },
  ] as const
).filter((g) => g.photos.length > 0);

/* Both of her dining-room frames and both house frames now run full width
 * higher up the page, so those two groups come out empty here. An empty group
 * still rendered its heading — a label with nothing under it, which reads as a
 * loading bug. Groups with no photographs left are dropped, and the whole
 * block goes with them if nothing survives. */

/** Explicit display order for the room table: cheapest first, cottages last,
 *  which is the order a guest scans for a price. */
export const ROOM_ORDER: GodoRoomKey[] = [
  'twinSharedEconomy',
  'doubleTwinShared',
  'double',
  'doubleTwinPrivate',
  'doublePrivateExtraBed',
  'cottage3',
  'familyCottage',
];
import { Link, useLocation } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import PRICES from './prices.json';
import { useLang } from './useLang';
import { COPY } from './copy';
import type { Copy, Lang } from './copy';
import BookingBar from "./BookingBar";
import Hero from "./Hero";
import RouteMap from "./RouteMap";
import Footer from "./Footer";
import { InsetBand, MaskDevelop } from "./Scenes";
import { loadMotion } from "./motion";

/* The catalogue's chrome (the "send prototype" tools at the top)
 * and the private company brief behind it are reachable ONLY through this
 * lazy import, and only when STANDALONE is false. In the client build that
 * constant is baked true at compile time, the branch is dead code, and
 * Rollup emits no chunk: the separation is enforced by the bundler, not by
 * discipline. tools/nypugardar-standalone-post.mjs greps the output to prove
 * it. */
const PreviewShell = STANDALONE ? null : lazy(() => import("./PreviewShell"));

/* ── Palette (from the farm's own photography — dusk sun, cabin lamplight, ice)
 * INK on GROUND ≈ 15:1 (AAA) · ACCENT on GROUND ≈ 5.5:1 (AA, large + labels)
 * GROUND text on ACCENT fill ≈ 5.5:1 (AA) — CTA labels are dark-on-amber. */
const GROUND = "#15130F"; // night has fallen, dinner is lit
export const ACCENT = "#D97D3D"; // dinner-table ember
export const HAIR = "rgba(244,238,226,0.14)";
export const BODY = "rgba(244,238,226,0.76)";
export const PAPER = "#F4EEE2";

export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** The reveal curve: slower into rest than EASE, so images settle rather than
 *  snap. Used only by the entrance reveals, never by hover states. */
export const EASE_SOFT = "cubic-bezier(0.16, 1, 0.3, 1)";
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4EEE2]";

/* ── Reveals are armed by JavaScript, never by markup.
 *
 * Every reveal on this page renders in its RESTING state first: fully
 * visible, no transform, no transition. Only once the page is actually
 * running in a browser does a layout effect (which fires before the first
 * paint, so there is no flash) hide the element and hand it to an observer.
 * Three reasons, each of which shipped as a bug somewhere:
 *   - the standalone build prerenders these pages to real HTML for the
 *     crawlers that do not run JavaScript; an inline opacity:0 in that HTML
 *     is a page of invisible text to them and to anyone whose script failed;
 *   - a server render and a client's first render must be byte-identical or
 *     React throws the prerendered tree away and rebuilds it from nothing;
 *   - a background tab never fires the observer, and content that is hidden
 *     until a callback runs is content that stays hidden.
 * useLayoutEffect warns on the server, so it is swapped for a plain effect
 * there, where it never runs anyway. */
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
type Phase = "static" | "hidden" | "shown";

/** Hide now, show when in view. The shared arming logic behind every reveal:
 *  if the element is already on screen it is shown a beat after paint, else
 *  an observer shows it as its leading edge arrives. Returns the phase. */
function useRevealPhase(
  ref: { current: HTMLElement | null },
  reduced: boolean,
  opts: { settle?: number; rootMargin?: string; threshold?: number } = {},
): Phase {
  const [phase, setPhase] = useState<Phase>("static");
  useIsoLayoutEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    setPhase("hidden");
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      const t = window.setTimeout(() => setPhase("shown"), opts.settle ?? 60);
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPhase("shown");
          io.disconnect();
        }
      },
      {
        rootMargin: opts.rootMargin ?? "0px 0px -9% 0px",
        threshold: opts.threshold ?? 0.15,
      },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
  return phase;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/* Adopted via 21st.dev "Zoomable Image" (id 20027): the engine underneath is
 * react-medium-image-zoom, a medium.com-style click-to-zoom. Every selector it
 * ships is scoped to [data-rmiz] attributes, so the global stylesheet import
 * cannot leak into the other previews. These overrides re-ink its white
 * overlay to the farm's night ground; injected once, by id. */
const ZOOM_CSS = `
.nyp-zoom [data-rmiz-modal-overlay="visible"] { background: rgba(21, 19, 15, 0.96); }
.nyp-zoom [data-rmiz-btn-unzoom] {
  background: rgba(244, 238, 226, 0.12); color: #F4EEE2;
  border-radius: 0; box-shadow: none;
}
/* The library's keyboard affordance is an 18px button; a thumb needs 44. */
[data-rmiz-btn-zoom] { width: 44px; height: 44px; }
/* The library ships transform .3s ease on the opening image. Plain ease is the
 * weak built-in and this is an ENTERING element, so it gets the strong
 * ease-out curve instead. */
.nyp-zoom [data-rmiz-modal-img] { transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1) !important; }
@media (prefers-reduced-motion: reduce) {
  /* Gentler, not zero: the movement goes, the fade stays, so the lightbox is
   * still legibly *arriving* rather than teleporting. A blanket
   * transition-duration:0.01ms would have killed the fade too
   * ([[redesign-craft-ledger]] #179). */
  .nyp-zoom [data-rmiz-modal-img] { transition-property: opacity !important; transition-duration: 0.2s !important; }
  .nyp-zoom [data-rmiz-modal-overlay] { transition-duration: 0.2s !important; }
}
`
function useZoomCss(enabled: boolean) {
  useEffect(() => {
    if (!enabled || document.getElementById("nyp-zoom-css")) return
    const el = document.createElement("style")
    el.id = "nyp-zoom-css"
    el.textContent = ZOOM_CSS
    document.head.appendChild(el)
  }, [enabled])
}

/* Safari 26 tints its status strip and home-indicator strip from html/body
 * background-color when no fixed element reaches that edge. The shared
 * catalogue shell's body is light, so the night ground goes onto html and
 * body themselves for as long as one of these pages is mounted, and comes
 * off again on the way out so it cannot follow a visitor to another preview.
 * (The standalone shell carries the same rule statically.) */
const PAGE_CSS = `html, body { background-color: #15130F; }`
export function usePageCss() {
  useIsoLayoutEffect(() => {
    if (document.getElementById("nyp-page-css")) return
    const el = document.createElement("style")
    el.id = "nyp-page-css"
    el.textContent = PAGE_CSS
    document.head.appendChild(el)
    return () => {
      el.remove()
    }
  }, [])
}

/* ── Reveal — IntersectionObserver on an untransformed wrapper; the failsafe is
 * gated by viewport position (never an unconditional timeout). */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const phase = useRevealPhase(ref, reduced);
  const style: CSSProperties | undefined =
    phase === "static"
      ? undefined
      : {
          opacity: phase === "shown" ? 1 : 0,
          transform:
            phase === "shown" ? "none" : `translateY(${Math.min(y, 16)}px)`,
          transition: `opacity 0.9s ${EASE_SOFT} ${delay}ms, transform 0.9s ${EASE_SOFT} ${delay}ms`,
        };
  return (
    <div
      ref={ref}
      className={className}
      style={style}
      data-show={phase !== "hidden"}
    >
      {children}
    </div>
  );
}

/* ── MaskHeading — a heading whose words rise out of a clipped line.
 *
 * The fade-up the rest of the page uses is right for a paragraph, which is
 * read as a block. A heading is read word by word, and this reveal follows
 * that: each word sits in its own overflow-hidden mask and slides up into
 * place with a 40ms stagger, so a two-line title arrives left to right, top
 * to bottom, the way the eye takes it. Transform only, one element per word,
 * no measurement, no font split, so it costs nothing and survives any
 * typeface and any line wrap. The masks carry a little padding below the
 * line box so descenders (g, y, p, ð) are never clipped at rest. Renders as
 * a plain heading until JavaScript arms it, like every reveal here. */
export function MaskHeading({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 40,
  style,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  style?: CSSProperties;
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const phase = useRevealPhase(ref, reduced, { settle: 80 });
  const words = text.split(" ");
  return (
    <Tag
      ref={ref as never}
      className={`text-balance ${className}`}
      style={style}
      data-show={phase !== "hidden"}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-baseline">
            <span
              className="inline-block"
              style={
                phase === "static"
                  ? undefined
                  : {
                      transform:
                        phase === "shown" ? "none" : "translateY(120%)",
                      transition: `transform 0.85s ${EASE_SOFT} ${delay + i * stagger}ms`,
                    }
              }
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ── Count — a figure that counts up to itself when it comes into view.
 *
 * Used for the one number this page is built around, the 8.8, and the six
 * category scores beside it. The final value is what is rendered in the
 * markup, so the prerender and any reader without JavaScript see the real
 * figure; the browser only zeroes it a moment before paint and then tweens
 * it back with a strong ease-out, writing straight to the text node so React
 * never re-renders for a frame. One second, once, never on hover. */
export function Count({
  value,
  decimals = 1,
  delay = 0,
  className = "",
  style,
}: {
  value: number;
  decimals?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLSpanElement>(null);
  const phase = useRevealPhase(ref, reduced, { settle: 120, threshold: 0.5 });
  const fmt = (n: number) => n.toFixed(decimals);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || phase === "static") return;
    if (phase === "hidden") {
      el.textContent = fmt(0);
      return;
    }
    let raf = 0;
    let start = 0;
    const dur = 1100;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start - delay) / dur);
      if (t < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      /* ease-out quart: fast off the mark, long settle onto the real figure */
      const e = 1 - Math.pow(1 - t, 4);
      el.textContent = fmt(value * e);
      if (t < 1) raf = requestAnimationFrame(tick);
      else el.textContent = fmt(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`} style={style}>
      {fmt(value)}
    </span>
  );
}

/* ── ClipImg — clip-path reveal for STANDALONE content photos only (explicit
 * aspect on the wrapper; the observer target never transforms itself). */
export function ClipImg({
  photo,
  sizes,
  alt,
  aspect,
  caption,
  delay = 0,
  className = "",
  imgClassName = "",
  zoom = false,
  hover = false,
  observe,
}: {
  photo: Photo;
  /** What width this tile actually renders at, per breakpoint. */
  sizes: string;
  alt: string;
  aspect: string;
  caption?: string;
  delay?: number;
  className?: string;
  imgClassName?: string;
  /** Click-to-zoom lightbox. On the rooms page only: a portrait photograph in
   *  a 4:3 tile loses half its frame, and the zoom is how a guest gets it
   *  back. The homepage tiles stay plain — narrative flow, not inventory. */
  zoom?: boolean;
  /** Answer the cursor with a slow swell. Implied by zoom; set explicitly for
   *  a tile that is a link rather than a lightbox. */
  hover?: boolean;
  /** Reveal when THIS element enters the viewport instead of the tile
   *  itself. The room strip passes its scroller: every card in it opens
   *  together, staggered, as the strip arrives, and a card the guest then
   *  drags into view is already a finished photograph. Measured before this
   *  existed: a card pulled in by four arrow clicks entered at 491 ms and was
   *  still clipped at 1.6 s. A gesture the guest makes must never be
   *  answered with an empty frame. */
  observe?: { current: HTMLElement | null };
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  /* Armed before first paint by a layout effect, never by markup: the
     prerendered HTML carries the photograph fully open. See useIsoLayoutEffect. */
  const [armed, setArmed] = useState(false);
  useIsoLayoutEffect(() => {
    if (!reduced) setArmed(true);
  }, [reduced]);

  /* WARM PASS. The reveal used to open a clip-path over an image the browser
     had not downloaded yet: the observer fires on a NEGATIVE margin, so by
     then the tile is already 15% on screen, while `loading="lazy"` had not
     necessarily even started the fetch. The result was a carefully eased
     1.15s wipe playing over an empty box, with the photograph popping in at
     the end. That pop is what reads as a glitch, and easing could never fix
     it because the easing was not what was wrong.
     So: a full screen ahead of the reveal, force the fetch and wait for the
     bitmap to be decodable. */
  useEffect(() => {
    if (reduced) { setReady(true); return; }
    const el = ref.current;
    if (!el) return;
    const img = el.querySelector("img");
    if (!img) { setReady(true); return; }
    const done = () => setReady(true);
    const warm = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        warm.disconnect();
        /* lazy stays the right default on a page this long; it just has to
           stop being lazy once the tile is nearly needed. */
        img.loading = "eager";
        if (img.complete && img.naturalWidth > 0) { done(); return; }
        if (typeof img.decode === "function") img.decode().then(done, done);
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      },
      /* A screen and a half of runway. At a fast flick 800px was still being
         overtaken, and a tile that has not decoded cannot reveal. Sideways
         too, for the room strip: a card clipped by its scroller is not
         intersecting, and it must be decoded before it is dragged into view. */
      { rootMargin: "1400px 1600px" },
    );
    warm.observe(el);
    return () => warm.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const el = observe?.current ?? ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      const t = window.setTimeout(() => setInView(true), 80);
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      /* Fire as the tile's leading edge crosses into view, not once it is
         already a sixth of the way up the screen. threshold 0.15 with a
         negative margin meant the wipe began when the photograph was well
         inside the viewport, so the reader watched it appear instead of
         watching it arrive. A hair of negative margin keeps it from firing
         on something still technically below the fold. */
      { rootMargin: "0px 0px -40px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, observe]);

  /* Belt and braces: a tile must never stay hidden because a decode never
     settled. If it has been in view for a second and a half, reveal it. */
  useEffect(() => {
    if (!inView || ready) return;
    const t = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(t);
  }, [inView, ready]);

  useZoomCss(zoom);

  const on = (inView && ready) || reduced;
  const img = (
        <Img
          {...frame(photo, sizes)}
          alt={alt}
          draggable={false}
          className={`h-full w-full object-cover ${imgClassName}`}
          style={
            reduced || !armed
              ? undefined
              : {
                  /* Two layers settle at two speeds: the wipe leads and the
                     zoom trails it, so the image lands like dusk settling
                     rather than a shutter opening. A third, brightness, used
                     to ride along; filter is the one property here that is
                     neither transform nor opacity, and on the rooms page it
                     was animating on 43 photographs at once. The other two
                     carry the reveal on their own. */
                  clipPath: on ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                  transform: on ? "scale(1) translateY(0)" : "scale(1.07) translateY(1.5%)",
                  transition: `clip-path 1.15s ${EASE_SOFT} ${delay}ms, transform 1.6s ${EASE_SOFT} ${delay}ms`,
                }
          }
        />
  );
  /* A clickable photograph answers the cursor: a slow 3.5% swell inside its
   * frame, on fine pointers only (Tailwind v4 gates hover: behind
   * @media (hover:hover)). The reveal owns the img's own transform, so the
   * hover lives one wrapper up. */
  const framed =
    zoom || hover ? (
      <div className="h-full w-full transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        {img}
      </div>
    ) : (
      img
    );
  return (
    <figure ref={ref} className={className}>
      <div className={`${aspect} group overflow-hidden rounded-sm`}>
        {zoom ? (
          <Zoom
            classDialog="nyp-zoom"
            zoomMargin={16}
            zoomImg={{ src: largest(photo), alt }}
          >
            {framed}
          </Zoom>
        ) : (
          framed
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4EEE2]/60">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ── Eyebrow — carries the evening-arc signature: mono label tinted by the sky
 * (--skyink) + a thin rule that fills as the section passes the viewport
 * centre band. --rule is written raw per frame in the single scroll callback. */
/** The two leaves the scroll callback writes to directly: the fill span gets
 *  its transform, the label span gets its ink. Never a CSS variable on an
 *  ancestor; see the note in the scroll callback. */
export type EyebrowRefs = { fill: HTMLSpanElement; label: HTMLSpanElement };

/** How far the rule has filled for an element at this viewport position. */
export const ruleProgress = (top: number, vh: number) =>
  clamp01((vh * 0.86 - top) / (vh * 0.52)).toFixed(4);

export function Eyebrow({
  label,
  register,
  reduced,
  className = "",
}: {
  label: string;
  register: (refs: EyebrowRefs) => () => void;
  reduced: boolean;
  className?: string;
}) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  useIsoLayoutEffect(() => {
    const fill = fillRef.current;
    const labelEl = labelRef.current;
    if (!fill || !labelEl) return;
    /* The rule renders full in the markup (no JavaScript, no scroll, a
       finished rule) and is set to its true scroll position here, before
       paint, so it never flashes from full to empty on load. */
    if (!reduced) {
      const vh = window.innerHeight || 800;
      fill.style.transform = `scaleX(${ruleProgress(fill.getBoundingClientRect().top, vh)})`;
    }
    return register({ fill, label: labelEl });
  }, [register, reduced]);
  return (
    <span className={`block ${className}`}>
      <span
        ref={labelRef}
        className="font-mono text-[11px] uppercase tracking-[0.24em]"
        style={{ color: "#B9CBD6" }}
      >
        {label}
      </span>
      <span className="mt-2.5 block h-[2px] w-28 rounded-full bg-[#F4EEE2]/15">
        <span
          ref={fillRef}
          className="block h-full w-full origin-left rounded-full bg-[#D97D3D]"
          style={{ transform: "scaleX(1)" }}
        />
      </span>
    </span>
  );
}

/* Language switch: a two-option toggle, EN and ÍS side by side, the current
 * language filled. Both options stay visible so the switch reads as a switch
 * at a glance, in either language. Colour and background change instantly on
 * press (a 150ms colour fade, no movement): it is a control, not a moment.
 *
 * On the client's own domain the other language is another ADDRESS, so the
 * inactive option is a real link: crawlers follow it to the Icelandic pages
 * and it works before any script has run. In the catalogue the language is a
 * remembered choice on one route, so the options are pressed-state buttons. */
export function LangToggle({
  lang,
  setLang,
  t,
  className = '',
  tone = 'light',
}: {
  lang: 'is' | 'en'
  setLang: (l: 'is' | 'en') => void
  t: (typeof COPY)['en']
  className?: string
  /** 'dark' = ink on the mist ground, for the landing bar over the manifesto. */
  tone?: 'light' | 'dark'
}) {
  const { pathname, hash } = useLocation()
  const dark = tone === 'dark'
  const ring = dark
    ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15130F]'
    : FOCUS
  const frame = dark ? 'border-[#15130F]/25' : 'border-[#F4EEE2]/25'
  const on = dark ? 'bg-[#15130F] text-[#E9EAE5]' : 'bg-[#F4EEE2] text-[#15130F]'
  const off = dark
    ? 'text-[#15130F]/65 hover:text-[#15130F]'
    : 'text-[#F4EEE2]/65 hover:text-[#F4EEE2]'
  const option = (l: Lang, label: string) => {
    const active = l === lang
    const cls = `grid h-7 min-w-[2.25rem] touch-manipulation place-items-center px-2 font-mono text-[11px] uppercase leading-none tracking-[0.14em] transition-colors duration-150 ease-out ${active ? on : off} ${ring}`
    const name = l === 'is' ? 'Íslenska' : 'English'
    if (STANDALONE) {
      return active ? (
        <span key={l} lang={l} aria-current="true" aria-label={name} className={cls}>{label}</span>
      ) : (
        <Link key={l} to={counterpart(pathname, hash, l)} hrefLang={l} lang={l} aria-label={name} className={cls}>{label}</Link>
      )
    }
    return (
      <button key={l} type="button" lang={l} aria-label={name} aria-pressed={active} onClick={() => setLang(l)} className={cls}>
        {label}
      </button>
    )
  }
  /* The visible box is 28px; the -my/py pair gives the row a 44px tap band
     without pushing the bar taller. */
  return (
    <div role="group" aria-label={t.langLabel} className={`-my-2 inline-flex py-2 ${className}`}>
      <span className={`inline-flex border p-px ${frame}`}>
        {option('en', 'EN')}
        {option('is', 'ÍS')}
      </span>
    </div>
  )
}

/* ── CTA — dark ink on amber (AA). */
/**
 * The per-room call to action in the room list.
 *
 * Verified live against Godo on 2026-08-25: passing `roomid` opens the booking
 * page on that one type, priced, with the guest's own nights already applied
 * (see the note in godo.ts). So this is a real shortcut, not a filter the guest
 * has to set again on the other side.
 *
 * Deliberately quiet. Seven of these sit in a row, and seven orange buttons
 * would shout down the one primary call to action at the top of the page and
 * turn a readable price list into a wall of chrome. A rule that fills on hover
 * is enough affordance next to a price, and the whole row is not made clickable
 * because the price and the photograph are worth reading without a cursor
 * suggesting they are a link.
 *
 * The accessible name carries the room, because "Book · Book · Book" seven
 * times is useless to anyone listing the links on a screen reader.
 */
export function RoomBookLink({
  room,
  name,
  stay,
  lang,
  t,
}: {
  room: GodoRoomKey;
  name: string;
  stay: Stay;
  lang: Lang;
  t: Copy;
}) {
  if (!bookingReady()) return null;
  const href = bookingHref({
    room,
    checkin: stay.checkin,
    checkout: stay.checkout,
    adults: stay.adults,
    children: stay.children,
    lang,
  });
  if (!href) return null;
  return (
    <a
      href={href}
      aria-label={`${t.cta.bookRoom} ${name}`}
      /* A quiet outline that commits on hover: the ember fills in from the
       * left (transform only, 260ms strong ease-out) and the label turns to
       * ink, so seven of these in a column read as buttons without seven
       * solid orange blocks shouting over the prices. Hover is gated to real
       * pointers; on touch the press scale is the feedback. 44px tall on a
       * phone for the thumb, 40px from md. */
      className={`group relative isolate inline-flex h-11 shrink-0 touch-manipulation items-center gap-2 overflow-hidden border border-[#D97D3D]/70 px-4 font-familjen text-[14px] font-medium tracking-[0.01em] text-[#F4EEE2] transition-[color,border-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] md:h-10 [@media(hover:hover)]:hover:border-[#D97D3D] [@media(hover:hover)]:hover:text-[#15130F] focus-visible:border-[#D97D3D] focus-visible:text-[#15130F] ${FOCUS}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[#D97D3D] transition-transform duration-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-focus-visible:scale-x-100 motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-x-100"
      />
      {t.cta.bookRoom}
      <ArrowUpRight
        className="h-4 w-4 text-[#D97D3D] transition-[transform,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-focus-visible:text-[#15130F] motion-reduce:transition-none [@media(hover:hover)]:group-hover:-translate-y-px [@media(hover:hover)]:group-hover:translate-x-0.5 [@media(hover:hover)]:group-hover:text-[#15130F]"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </a>
  );
}

export function BookLink({
  children,
  className = "",
  onClick,
  lang,
  stay,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  lang: Lang;
  /** The page's one copy of the dates (stay.ts). Every general call to action
      must carry it, or a guest who picked nights at the top is asked for them
      again on Godo — the exact failure the stay hook exists to prevent. */
  stay?: Stay;
}) {
  return bookingReady() ? (
    <a
      href={bookingHref(
        stay
          ? {
              lang,
              checkin: stay.checkin,
              checkout: stay.checkout,
              adults: stay.adults,
              children: stay.children,
            }
          : { lang },
      )!}
      onClick={onClick}
      className={`group inline-flex items-center gap-2 bg-[#D97D3D] py-2 pl-6 pr-2 font-supreme text-[15px] font-semibold text-[#15130F] transition-[transform,background-color] duration-[160ms] ease-out hover:bg-[#E68C4C] active:scale-[0.98] ${FOCUS} ${className}`}
    >
      {children}
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#15130F]/10 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-px">
        <ArrowUpRight
          className="h-4 w-4"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </span>
    </a>
  ) : (
    <span className={`inline-flex flex-col gap-1.5 ${className}`}>
      <button
        type="button"
        disabled
        className="inline-flex cursor-not-allowed items-center gap-2 border border-dashed px-6 py-3.5 font-supreme text-[15px] font-semibold"
        style={{
          borderColor: "rgba(217,125,61,0.55)",
          color: "rgba(217,125,61,0.85)",
        }}
      >
        {children}
      </button>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F4EEE2]/40">
        {COPY[lang].booking.placeholder}
      </span>
    </span>
  );
}

/**
 * Guest reviews, three at a time, rotating through every written review she has.
 *
 * WHAT "ALL OF THEM" MEANS HERE, PRECISELY. Booking lists 2,268 stays. Around
 * 840 of those are a score with no words attached, and a card with no sentence
 * in it is a blank card rather than a review — those are already represented on
 * this page, inside the 8.8 and inside the count above. The rotator therefore
 * carries every review that has words in it, roughly 1,100, and the line under
 * it states both numbers so nothing is quietly rounded.
 *
 * WHAT EACH GUEST LIKED, NOT WHAT THEY DID NOT. 807 of these reviews also
 * carry a "what could be better" note. Sindri's call on 2026-08-25 was to run
 * the praise only, which is why the payload does not even carry those strings
 * — a card that is nothing but a complaint is not a testimonial, and this
 * rotator sits on Bogga's own homepage. The consequence is stated rather than
 * hidden: 15 guests wrote only a criticism and cannot appear here at all, and
 * the line under the rotator points at Booking, where the unedited text and
 * every one of those 15 is one click away.
 *
 * LOADED IN TWO STAGES. The twenty-four curated quotes in data.ts render on
 * first paint, so the section is never empty and never waits on a network
 * round trip; the full file is ~1,100 records and is fetched only once the
 * section is within a screen of the viewport. A visitor who never scrolls this
 * far never downloads it.
 *
 * Auto-advance pauses on hover and on keyboard focus, and does not run at all
 * under prefers-reduced-motion — an unattended slideshow is exactly the kind of
 * motion that rule exists for. The controls are real buttons so the set is
 * reachable without waiting, and the live region is polite rather than
 * assertive so a screen reader is not interrupted mid-sentence by a timer.
 */

type Review = {
  /** What the guest liked. Never empty — see the note above. */
  t: string
  n: string
  c: string
  d: string
  s: number | null
  /** Set only on the curated seed, for the one review shown in translation. */
  note?: string | null
}

type ReviewFile = {
  written: number
  scoreOnly: number
  criticismOnly: number
  withCriticism: number
  reviews: Review[]
}

const PER_PAGE = 3

/** The curated twenty-four, in the shape the rotator uses for everything. */
const SEED: Review[] = QUOTES.map((q) => ({
  t: q.text,
  n: q.name,
  c: q.place,
  d: q.date,
  s: q.score,
  note: q.note,
}))

/* The swap dips to 0.38 rather than blanking: the stage should read as the
 * quotes being changed, not emptied ([[redesign-craft-ledger]] #209).
 *
 * A TRANSITION, NOT A KEYFRAME, AND NOT A KEYED REMOUNT. Both of those restart
 * from zero when a second step arrives mid-flight, which is exactly what the
 * step buttons invite. Measured on the keyframe version: two clicks 180ms
 * apart drove opacity up to 0.916 and then SNAPPED it back to 0.38 — a visible
 * stutter. Holding one element and transitioning its opacity means an
 * interrupted swap retargets from wherever it currently is. */

function QuoteRotator({ reduced, t }: { reduced: boolean; t: (typeof COPY)['en'] }) {
  const [full, setFull] = useState<ReviewFile | null>(null)
  const [page, setPage] = useState(0)
  const [held, setHeld] = useState(false)
  /* An explicit stop. Hover and focus already hold the timer, but content
   * that changes itself every seven seconds needs a control a reader can
   * SEE, and a screen-reader user hearing the live region turn over needs
   * one they can press. */
  const [paused, setPaused] = useState(false)
  /* false for exactly one frame after the quotes change: the stage dips, then
   * transitions back. Interrupting mid-dip retargets instead of restarting. */
  const [settled, setSettled] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    setSettled(false)
    /* Two frames: one to paint the dipped state, one to transition out of it.
     * A single rAF is coalesced with the state change in some browsers and the
     * dip never renders. */
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setSettled(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [page, reduced])

  /* Fetch the full set when the section is within a screen of the viewport.
   * rootMargin does the work: by the time the reader arrives the swap has
   * already happened, so the counter never visibly jumps under them. */
  useEffect(() => {
    const el = ref.current
    if (!el || full) return
    let cancelled = false
    const load = () => {
      import('./reviews.json')
        .then((m) => {
          if (!cancelled) setFull((m.default ?? m) as unknown as ReviewFile)
        })
        .catch(() => {
          /* Offline or a failed chunk: the twenty-four seeded reviews are
             already on screen, so there is nothing to fall back to. */
        })
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          load()
          io.disconnect()
        }
      },
      { rootMargin: '100% 0px' },
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
    }
  }, [full])

  /* Seed first — they are the strongest and they are already painted — then
   * everything else in Booking's own order, minus the seeded ones. */
  const pool = useMemo(() => {
    if (!full) return SEED
    const seen = new Set(SEED.map((s) => `${s.n}|${s.d}`))
    const rest = full.reviews.filter((r) => !seen.has(`${r.n}|${r.d}`))
    return [...SEED, ...rest]
  }, [full])

  const pages = Math.ceil(pool.length / PER_PAGE)

  useEffect(() => {
    if (reduced || held || paused || pages < 2) return
    const id = window.setInterval(() => setPage((p) => (p + 1) % pages), 7000)
    return () => window.clearInterval(id)
  }, [reduced, held, paused, pages])

  const start = page * PER_PAGE
  const shown = pool.slice(start, start + PER_PAGE)

  const step = (d: number) => setPage((p) => (p + d + pages) % pages)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHeld(true)}
      data-quote-rotator
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div
        aria-live="polite"
        className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8"
        style={
          reduced
            ? undefined
            : {
                opacity: settled ? 1 : 0.38,
                transform: settled ? "none" : "translateY(6px)",
                transition: `opacity 0.35s ${EASE}, transform 0.35s ${EASE}`,
              }
        }
      >
        {shown.map((q: Review) => (
          <blockquote
            key={`${q.n}|${q.d}|${q.t.slice(0, 24)}`}
            /* min-w-0: a grid column otherwise refuses to shrink below its
             * longest unbreakable token, and 20 of these reviews carry words
             * up to 61 characters — measured as 34px of horizontal page
             * scroll whenever one rotated in. */
            className="min-w-0 border-t pt-6"
            style={{ borderColor: HAIR }}
          >
            {/* pre-line, because plenty of these were written as stacked short
              * lines rather than sentences. Collapsing them and inserting full
              * stops would be editing somebody else's review. */}
            <p className="whitespace-pre-line leading-relaxed text-[#F4EEE2]/85 [overflow-wrap:anywhere]">“{q.t}”</p>
            <footer className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B9CBD6]">
              {q.n}
              {q.c ? `, ${q.c}` : ''}
              <span className="mt-1 block text-[#F4EEE2]/60">
                {q.d}
                {typeof q.s === 'number' ? (
                  <span style={{ color: ACCENT }}> · {q.s}/10</span>
                ) : null}
              </span>
              {q.note ? (
                <span className="mt-1 block text-[#F4EEE2]/60">
                  {t.reviews.translatedFromItalian}
                </span>
              ) : null}
            </footer>
          </blockquote>
        ))}
      </div>

      {/* Dots died with the sixth quote. At 368 sets a dot row is not a
        * control, it is wallpaper — so this is a step pair and a plain count of
        * where you are in the whole pile. */}
      {pages > 1 ? (
        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t.reviews.prevSet}
              className={`grid h-11 w-11 place-items-center border transition-[transform,border-color] duration-[160ms] ease-out hover:border-[#F4EEE2]/45 active:scale-[0.97] motion-reduce:active:scale-100 md:h-9 md:w-9 ${FOCUS}`}
              style={{ borderColor: HAIR, color: PAPER }}
            >
              <ArrowUpRight
                className="h-4 w-4 -rotate-[135deg]"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t.reviews.nextSet}
              className={`grid h-11 w-11 place-items-center border transition-[transform,border-color] duration-[160ms] ease-out hover:border-[#F4EEE2]/45 active:scale-[0.97] motion-reduce:active:scale-100 md:h-9 md:w-9 ${FOCUS}`}
              style={{ borderColor: HAIR, color: PAPER }}
            >
              <ArrowUpRight
                className="h-4 w-4 rotate-45"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
            {reduced ? null : (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                aria-label={paused ? t.reviews.resume : t.reviews.pause}
                className={`grid h-11 w-11 place-items-center border transition-[transform,border-color] duration-[160ms] ease-out hover:border-[#F4EEE2]/45 active:scale-[0.97] motion-reduce:active:scale-100 md:h-9 md:w-9 ${FOCUS}`}
                style={{ borderColor: HAIR, color: PAPER }}
              >
                {paused ? (
                  <Play className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <Pause className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                )}
              </button>
            )}
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#F4EEE2]/60 tabular-nums">
            {start + 1}-{Math.min(start + PER_PAGE, pool.length)} {t.reviews.of}{' '}
            {pool.length.toLocaleString('en-US')} {t.reviews.written}
          </p>
        </div>
      ) : null}
    </div>
  )
}

/* ── RoomStrip — every room type in one horizontal strip.
 *
 * Three cropped 4:3 tiles used to stand in for thirteen beds. Her room
 * photographs are 810x1080 phone portraits, and a 3:4 card is the one frame
 * that shows all of one without cropping, so the strip carries all seven
 * types at their true aspect, each with its name, what it sleeps, its lowest
 * nightly rate and its own booking link. The reader sees the whole inventory
 * from the homepage instead of a sample.
 *
 * Native scroll-snap, not a transform carousel: momentum, rubber-banding and
 * the back-swipe on iOS all stay the browser's, which no library reproduces
 * faithfully. On top of that, only what the browser lacks: drag-to-scroll
 * for a mouse (a trackpad already swipes natively), arrow keys on the focused
 * strip, and a live count. The keyboard and ARIA contract follows the 21st.dev
 * "Snap Carousel" (23559): role group, aria-roledescription carousel, a
 * described hint, arrow and Home/End keys, a polite live region.
 *
 * Deliberately NOT data-lenis-prevent: the catalogue's index.css gives that
 * attribute overscroll-behavior:contain, and on a strip with no vertical
 * overflow that would swallow the wheel and stop the page scrolling while
 * the cursor is over it. Lenis leaves purely horizontal gestures to the
 * browser on its own. */
function RoomStrip({
  t,
  lang,
  stay,
  reduced,
}: {
  t: Copy;
  lang: Lang;
  stay: Stay;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hintId = useId();
  const [at, setAt] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{
    x: number;
    left: number;
    moved: boolean;
    /** Last sample, for the release velocity (px per ms). */
    lastX: number;
    lastT: number;
    v: number;
  } | null>(null);
  const swallow = useRef(false);

  const cards = ROOM_ORDER.map((k) => ({
    k,
    photo: leadFor(k),
    price:
      (PRICES.rooms as Record<string, { from: number | null }>)[k]?.from ?? null,
    name: lang === "is" ? GODO_ROOM_NAMES_IS[k] : GODO_ROOM_NAMES[k],
  }));

  /* One card plus the gap: the distance the arrows move, and the divisor
     behind the live count. Read live so a resize cannot stale it. */
  const stepWidth = () => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  };
  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * stepWidth(), behavior: reduced ? "auto" : "smooth" });
  };
  const onScroll = () => {
    const el = ref.current;
    const w = stepWidth();
    if (!el || !w) return;
    const i = Math.max(0, Math.min(cards.length - 1, Math.round(el.scrollLeft / w)));
    setAt((p) => (p === i ? p : i));
  };
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "Home") { e.preventDefault(); ref.current?.scrollTo({ left: 0, behavior: reduced ? "auto" : "smooth" }); }
    else if (e.key === "End") { e.preventDefault(); ref.current?.scrollTo({ left: ref.current.scrollWidth, behavior: reduced ? "auto" : "smooth" }); }
  };

  /* Mouse drag. Listeners go on the window for the duration rather than
     capturing the pointer: pointer capture would retarget the click at the
     strip and every card link would go dead. A drag that moved swallows the
     click that follows it, so letting go over a card does not open it. */
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    drag.current = {
      x: e.clientX,
      left: el.scrollLeft,
      moved: false,
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
    };
    setDragging(true);
    const move = (ev: { clientX: number }) => {
      const d = drag.current;
      if (!d) return;
      const dx = ev.clientX - d.x;
      if (Math.abs(dx) > 6) d.moved = true;
      el.scrollLeft = d.left - dx;
      const now = performance.now();
      const dt = now - d.lastT;
      if (dt > 0) d.v = (ev.clientX - d.lastX) / dt;
      d.lastX = ev.clientX;
      d.lastT = now;
    };
    const up = () => {
      const d = drag.current;
      swallow.current = d?.moved ?? false;
      const v = d?.v ?? 0;
      drag.current = null;
      setDragging(false);
      /* A flick carries. The strip keeps moving in proportion to the release
         velocity and the snap catches it at the end, which is what a finger
         gets from the browser for free and a mouse otherwise never does. */
      if (Math.abs(v) > 0.25)
        el.scrollBy({ left: -v * 180, behavior: reduced ? "auto" : "smooth" });
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (!swallow.current) return;
    e.preventDefault();
    e.stopPropagation();
    swallow.current = false;
  };

  const btn = `grid h-11 w-11 place-items-center border transition-[transform,border-color] duration-[160ms] ease-out hover:border-[#F4EEE2]/45 active:scale-[0.97] motion-reduce:active:scale-100 md:h-9 md:w-9 ${FOCUS}`;

  return (
    <div className="mt-12">
      <div
        ref={ref}
        role="group"
        aria-roledescription="carousel"
        aria-label={t.rooms.stripLabel}
        aria-describedby={hintId}
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
        /* Snap is suspended for the length of a mouse drag, or the browser
           fights every pixel of it; it re-snaps to the nearest card on release. */
        style={{ scrollSnapType: dragging ? "none" : undefined }}
        className={`-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-8 md:gap-5 md:scroll-px-8 md:px-8 [@media(pointer:fine)]:cursor-grab ${dragging ? "select-none [@media(pointer:fine)]:cursor-grabbing" : ""} ${FOCUS}`}
      >
        {cards.map((c, i) => (
          <article
            key={c.k}
            aria-label={`${i + 1} ${t.reviews.of} ${cards.length}`}
            className="w-[70vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[262px]"
          >
            <Link
              to={`${roomsPath(lang)}#room-${c.k}`}
              aria-label={`${c.name}: ${t.rooms.openRoom}`}
              draggable={false}
              className={`block ${FOCUS}`}
            >
              {c.photo ? (
                <ClipImg
                  photo={c.photo}
                  sizes="(min-width: 1024px) 262px, (min-width: 768px) 30vw, (min-width: 640px) 42vw, 70vw"
                  alt={photoAlt(c.photo, t, lang)}
                  aspect="aspect-[3/4]"
                  delay={i * 60}
                  hover
                  observe={ref}
                />
              ) : null}
            </Link>
            <h3 className="mt-4 font-erode text-xl font-medium leading-[1.2] tracking-tight">
              {c.name}
            </h3>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#F4EEE2]/60">
              {t.price.sleeps} {ROOM_SLEEPS[c.k]}
            </p>
            <div
              className="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t pt-3"
              style={{ borderColor: HAIR }}
            >
              {typeof c.price === "number" ? (
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#F4EEE2]/60">
                  {t.price.from}{" "}
                  <span
                    className="font-erode text-2xl tracking-tight tabular-nums"
                    style={{ color: ACCENT }}
                  >
                    {c.price}
                  </span>{" "}
                  &euro; {t.price.perNight}
                </p>
              ) : (
                <span />
              )}
              <RoomBookLink room={c.k} name={c.name} stay={stay} lang={lang} t={t} />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => go(-1)} aria-label={t.rooms.prevRooms} className={btn} style={{ borderColor: HAIR, color: PAPER }}>
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={t.rooms.nextRooms} className={btn} style={{ borderColor: HAIR, color: PAPER }}>
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <p aria-live="polite" className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#F4EEE2]/60 tabular-nums">
          {at + 1} {t.reviews.of} {cards.length} · {t.rooms.stripLabel}
        </p>
        <span id={hintId} className="sr-only">{t.rooms.stripHint}</span>
      </div>
    </div>
  );
}

/* ── The landing page (redesign 2026-09-16, DESIGN.md) ─────────────────────
 *
 * Hero photograph, then the mist (manifesto, the one light ground), then the
 * glacier band whose scrim resolves to night, then night to the end. The bar
 * reads which of those three grounds is under it and takes that ground as its
 * own material; it never hides, never moves ([[mobile-chrome-standard]]). */
const MIST = "#E9EAE5";
const SILT = "#57554E";
const FOCUS_INK =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15130F]";
type NavGround = "clear" | "mist" | "night";

const H2 =
  "font-erode text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1.08] tracking-[-0.01em]";

export default function Page() {
  const [lang, setLang] = useLang();
  const t = COPY[lang];
  usePageCss();
  /* One stay for the whole page: the booking card writes it, the room strip
   * and every other booking link read it, so a guest who picked nights is
   * never asked for them again on Godo. */
  const { stay, setStay, today } = useStay();
  const reduced = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const navRowRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(72);
  const lenisRef = useRef<Lenis | null>(null);
  const [ground, setGround] = useState<NavGround>("clear");

  useEffect(() => {
    const el = navRowRef.current;
    if (!el) return;
    const measure = () => setNavHeight(el.getBoundingClientRect().height);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* Which ground is under the bar. A thin observer band just below the bar's
   * top edge; elements carrying data-nav report whether they cross it, and the
   * last one in document order wins. Anything unmarked is night. Not a scroll
   * listener, and it runs under reduced motion too: chrome state is not
   * motion. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-nav]"));
    const inBand = new Set<Element>();
    const pick = () => {
      let g: NavGround = "night";
      for (const el of els) if (inBand.has(el)) g = el.dataset.nav as NavGround;
      setGround(g);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target);
          else inBand.delete(e.target);
        }
        pick();
      },
      { rootMargin: `-${Math.round(navHeight / 2)}px 0px -92% 0px`, threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [navHeight]);

  useEffect(() => {
    if (!menuOpen) return;
    /* Fixed-body scroll lock, not overflow:hidden ([[mobile-chrome-standard]]). */
    const y = window.scrollY;
    const b = document.body.style;
    const prev = { position: b.position, top: b.top, left: b.left, right: b.right, width: b.width };
    b.position = "fixed";
    b.top = `-${y}px`;
    b.left = "0";
    b.right = "0";
    b.width = "100%";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      Object.assign(b, prev);
      window.scrollTo(0, y);
      lenisRef.current?.scrollTo(y, { immediate: true });
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  /* Close the overlay first, then scroll on the next frame; through Lenis when
   * it is alive, because .lenis cancels native smooth scrolling. */
  const handleNavLinkClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      requestAnimationFrame(() => {
        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, { offset: -navHeight, duration: 0.9 });
        } else {
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - navHeight,
            behavior: reduced ? "auto" : "smooth",
          });
        }
        window.history.replaceState(null, "", href);
      });
    },
    [reduced, navHeight],
  );

  /* Lenis on fine pointers only, never under reduced motion, never on a phone
   * ([[lenis-mobile-damage]]); dynamic import so a phone never downloads it.
   * It feeds ScrollTrigger, which drives every scroll scene on the page. */
  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let disposed = false;
    let lenis: Lenis | null = null;
    let raf = 0;
    Promise.all([import("lenis"), loadMotion()]).then(([{ default: L }, { ScrollTrigger }]) => {
      if (disposed) return;
      lenis = new L({ duration: 1.1 });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const loop = (time: number) => {
        lenis!.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    /* No document.title and no JSON-LD from here any more: both are written
     * into the prerendered head by tools/nypugardar-seo.mjs, and a runtime
     * copy used to overwrite the real title and publish a second, unguarded
     * set of facts. */
    setThemeColor(GROUND);
    const prevBodyBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = GROUND;
    return () => {
      document.body.style.backgroundColor = prevBodyBg;
    };
  }, []);

  /* The phone's sticky booking bar steps aside while the booking widget
   * itself is on screen: two "Check availability" buttons stacked on one
   * screen is the duplication the widget's placement exists to avoid. */
  const [widgetInView, setWidgetInView] = useState(false);
  useEffect(() => {
    const el = document.getElementById("stay");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setWidgetInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMist = ground === "mist" && !menuOpen;
  const clear = ground === "clear" && !menuOpen;
  const barInk = onMist ? "#15130F" : PAPER;
  const pastHero = ground !== "clear";
  const tr = reduced ? "none" : `background-color 0.22s ${EASE}, color 0.22s ${EASE}, opacity 0.22s ${EASE}`;

  return (
    <div
      ref={rootRef}
      lang={lang}
      className="min-h-screen overflow-x-clip font-familjen text-[#F4EEE2] antialiased"
      style={{ background: GROUND }}
    >
      {PreviewShell ? (
        <Suspense fallback={null}>
          <PreviewShell part="chrome" />
        </Suspense>
      ) : null}

      <a
        href="#farm"
        className="sr-only z-50 bg-[#D97D3D] px-4 py-3 font-semibold text-[#15130F] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {lang === "is" ? "Beint í efnið" : "Skip to content"}
      </a>

      {/* ── The bar. Two grounds cross-fading on opacity (a scrim for the hero
       * photograph, a solid glass otherwise), never a gradient hanging over
       * scrolled content ([[feedback-header-chrome-and-page-transitions]]). */}
      <nav
        className="fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)]"
        aria-label="Main"
        /* The ground colour lives on the fixed bar ITSELF, not only on the
         * inner layer: Safari samples the fixed element at the top edge to
         * tint the status strip, and a transparent bar left the strip night
         * above the mist section. Clear over the hero, where night is right. */
        style={{
          color: barInk,
          backgroundColor: clear ? "transparent" : menuOpen ? GROUND : onMist ? "rgba(233,234,229,0.9)" : "rgba(21,19,15,0.88)",
          transition: tr,
        }}
      >
        <span
          aria-hidden="true"
          /* Grounds and the small wordmark switch by CLASS, not inline
           * opacity: these are the bar's states over the hero, not hidden
           * content, and the prerender gate rightly rejects inline opacity:0. */
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-[#15130F]/55 to-[#15130F]/0 ${clear ? "opacity-100" : "opacity-0"}`}
          style={{ transition: tr }}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 backdrop-blur-[10px] ${clear ? "opacity-0" : "opacity-100"}`}
          style={{
            boxShadow: `0 1px 0 ${onMist ? "rgba(21,19,15,0.12)" : HAIR}`,
            transition: tr,
          }}
        />
        <div
          ref={navRowRef}
          className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8"
        >
          <a
            href="#top"
            onClick={(e) => handleNavLinkClick(e, "#top")}
            translate="no"
            className={`-my-2 py-2 font-erode text-xl font-light tracking-tight ${clear ? "opacity-0" : "opacity-100"} ${onMist ? FOCUS_INK : FOCUS}`}
            style={{ transition: tr }}
            tabIndex={clear ? -1 : undefined}
          >
            Nýpugarðar
          </a>
          <div className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={(e) => handleNavLinkClick(e, `#${n.id}`)}
                className={`-my-2 py-2 text-[14px] opacity-80 transition-opacity duration-200 hover:opacity-100 ${onMist ? FOCUS_INK : FOCUS}`}
              >
                {t.nav[n.id as keyof typeof t.nav]}
              </a>
            ))}
            <LangToggle lang={lang} setLang={setLang} t={t} tone={onMist ? "dark" : "light"} className="ml-1" />
          </div>
          <div className="flex items-center gap-2">
            {bookingReady() ? (
              <a
                href={bookingHref({ lang, checkin: stay.checkin, checkout: stay.checkout, adults: stay.adults, children: stay.children })!}
                className={`hidden bg-[#D97D3D] px-4 py-2.5 text-[14px] font-semibold text-[#15130F] transition-colors duration-200 hover:bg-[#E68C4C] active:scale-[0.98] sm:inline-block ${onMist ? FOCUS_INK : FOCUS}`}
              >
                {t.cta.check}
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={`-mr-2.5 flex h-11 w-11 touch-manipulation items-center justify-center md:hidden ${onMist ? FOCUS_INK : FOCUS}`}
            >
              <span aria-hidden="true" className="relative block h-4 w-6">
                {[0, 1].map((i) => (
                  <span
                    key={i}
                    className={`absolute left-0 block h-[2px] w-6 rounded-full ${i ? "bottom-0" : "top-0"}`}
                    style={{
                      background: menuOpen ? ACCENT : "currentColor",
                      transform: menuOpen
                        ? i ? "translateY(-7px) rotate(-45deg)" : "translateY(7px) rotate(45deg)"
                        : "none",
                      transition: reduced ? "none" : `transform 0.24s ${EASE}, background-color 0.24s ${EASE}`,
                    }}
                  />
                ))}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu overlay: a sibling of the bar, fixed to the real
       * viewport, below the bar's z-40 so the X stays on top of it. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-30 flex flex-col overscroll-contain md:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        style={{
          background: GROUND,
          paddingTop: navHeight,
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          /* Opens at 300ms, closes at 180ms: closing is the response and snaps.
           * Reduced motion keeps the fade and drops only the link movement. */
          transition: reduced
            ? menuOpen
              ? "opacity 0.15s ease-out, visibility 0s"
              : "opacity 0.15s ease-out, visibility 0s 0.15s"
            : menuOpen
              ? `opacity 0.3s ${EASE}, visibility 0s`
              : `opacity 0.18s ${EASE}, visibility 0s 0.18s`,
        }}
      >
        <nav className="flex flex-1 flex-col justify-center px-6" aria-label="Mobile">
          <ul className="space-y-1">
            {NAV.map((n, i) => (
              <li key={n.id} className="overflow-hidden">
                <a
                  href={`#${n.id}`}
                  onClick={(e) => handleNavLinkClick(e, `#${n.id}`)}
                  className={`block py-2 font-erode text-[clamp(2.5rem,13vw,4.5rem)] font-light leading-[1.1] tracking-tight text-[#F4EEE2] ${FOCUS}`}
                  style={{
                    transform: menuOpen || reduced ? "translateY(0%)" : "translateY(100%)",
                    transition: reduced ? "none" : `transform 0.3s ${EASE} ${menuOpen ? 40 + i * 35 : 0}ms`,
                  }}
                >
                  {t.nav[n.id as keyof typeof t.nav]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-6 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-4">
          <LangToggle lang={lang} setLang={setLang} t={t} className="mb-4" />
          <BookLink lang={lang} stay={stay} className="w-full justify-between py-3 text-base" onClick={() => setMenuOpen(false)}>
            {t.cta.check}
          </BookLink>
        </div>
      </div>

      <main id="top" className="relative">
        <Hero t={t} reduced={reduced} />

        {/* ── 1 · Manifesto: the mist ─────────────────────────────────── */}
        <section id="farm" data-nav="mist" className="scroll-mt-16 text-[#15130F]" style={{ background: MIST }}>
          <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 md:px-8 md:pb-36 md:pt-28">
            <div className="md:grid md:grid-cols-12 md:gap-x-3">
              <div className="md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">
                <p className="font-erode text-xl font-light italic md:text-2xl" style={{ color: SILT }}>
                  {t.manifesto.kicker}
                </p>
                <MaskDevelop reduced={reduced} className="mt-8 md:mt-10">
                  <p className="text-pretty font-erode text-[clamp(1.75rem,3.3vw,2.75rem)] font-light leading-[1.2] tracking-[-0.005em] md:[text-indent:25%]">
                    {t.manifesto.text}
                  </p>
                </MaskDevelop>
              </div>
            </div>

            <Reveal className="mt-16 md:mt-24">
              <dl className="grid gap-6 sm:grid-cols-3 sm:gap-x-3">
                {FACTS.map((f) => (
                  <div
                    key={f.key}
                    className="flex flex-col-reverse gap-1 border-t pt-4"
                    style={{ borderColor: "rgba(21,19,15,0.14)" }}
                  >
                    <dt className="text-[15px] leading-snug" style={{ color: SILT }}>
                      {t.facts[f.key]}
                    </dt>
                    <dd className="font-erode text-4xl font-light tabular-nums">{f.n}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* ── 2 · The glacier band (Kleif season, inset unclip) ────────── */}
        <InsetBand
          reduced={reduced}
          className="h-[115svh] md:h-[150svh]"
          style={{ background: MIST }}
          image={
            <>
              <Img
                {...frame(IMG.glacier, "100vw")}
                alt={t.band.alt}
                /* a 150svh band crops a 4:3 frame hard; keep the peaks and the lit flats, not the sky */
                className="absolute inset-0 h-full w-full object-cover object-[center_72%]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#15130F] via-[#15130F]/80 via-55% to-[#15130F]/0 to-95% md:via-[#15130F]/45 md:via-35% md:to-65%" />
            </>
          }
        >
          <div className="absolute inset-x-0 bottom-0 z-[1]">
            <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
              <MaskHeading text={t.band.heading} className={`max-w-3xl ${H2}`} />
              <Reveal delay={100}>
                {t.band.body.split("\n\n").map((para, i) => (
                <p key={i} className={`${i === 0 ? "mt-6" : "mt-4"} max-w-[58ch] text-lg leading-relaxed text-[#F4EEE2]/85`}>{para}</p>
              ))}
              </Reveal>
              <Reveal delay={180}>
                <ul className="mt-12 grid gap-6 border-t border-[#F4EEE2]/20 pt-8 sm:grid-cols-3">
                  {(
                    [
                      [t.band.auroraN, t.band.aurora],
                      [t.band.roadN, t.band.road],
                      [t.band.viewN, t.band.view],
                    ] as const
                  ).map(([n, label]) => (
                    <li key={label}>
                      <span className="block font-erode text-3xl font-light">{n}</span>
                      <span className="mt-1.5 block font-fragment text-[11px] uppercase tracking-[0.16em] text-[#B9CBD6]">
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </InsetBand>

        {/* ── 3 · Rooms ───────────────────────────────────────────────── */}
        <section id="rooms" className="scroll-mt-16">
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
            <MaskHeading text={t.rooms.heading} className={H2} />
            <Reveal delay={90}>
              <p className="mt-6 max-w-[54ch] text-lg leading-relaxed" style={{ color: BODY }}>
                {t.rooms.body}
              </p>
            </Reveal>
            <RoomStrip t={t} lang={lang} stay={stay} reduced={reduced} />
            <Reveal delay={120}>
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  to={roomsPath(lang)}
                  className={`group inline-flex items-center gap-2 border border-[#F4EEE2]/35 px-6 py-3 text-[15px] font-medium transition-[transform,border-color] duration-200 ease-out hover:border-[#F4EEE2]/70 active:scale-[0.98] ${FOCUS}`}
                >
                  {t.rooms.seeAll}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-y-px group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </Link>
                <p className="max-w-[44ch] text-[15px] leading-relaxed text-[#F4EEE2]/60">{t.rooms.seeAllNote}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 4 · Dinner and breakfast ────────────────────────────────── */}
        <section id="dinner" className="scroll-mt-16 border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
            <MaskHeading text={t.dinner.heading} className={H2} />
            <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-x-3">
              <ClipImg
                photo={IMG.dining}
                sizes="(min-width: 1024px) 700px, 92vw"
                alt={t.dinner.diningAlt}
                aspect="aspect-[1280/577]"
                caption={t.dinner.diningCaption}
                className="lg:col-span-8"
              />
              <div className="lg:col-span-4 lg:pl-6">
                <Reveal>
                  {t.dinner.intro.split("\n\n").map((para, i) => (
                  <p key={i} className={`${i === 0 ? "" : "mt-5 "}text-lg leading-relaxed`} style={{ color: BODY }}>{para}</p>
                ))}
                </Reveal>
                <Reveal delay={90}>
                  <p className="mt-5 leading-relaxed" style={{ color: BODY }}>{t.dinner.body}</p>
                </Reveal>
                <Reveal delay={160}>
                  <blockquote className="mt-10 border-t pt-6" style={{ borderColor: HAIR }}>
                    <p className="font-erode text-xl font-light italic leading-[1.4] text-[#F4EEE2]/90">
                      “{DINNER_QUOTE.text}”
                    </p>
                    <footer className="mt-4 font-fragment text-[11px] uppercase tracking-[0.16em] text-[#B9CBD6]">
                      {DINNER_QUOTE.name}, {DINNER_QUOTE.place}, {t.reviews.guestReviewOn}
                    </footer>
                  </blockquote>
                </Reveal>
              </div>
            </div>

            <div className="mt-20 grid gap-10 md:mt-28 md:grid-cols-12 md:items-center md:gap-x-3">
              <ClipImg
                photo={IMG.house}
                sizes="(min-width: 768px) 40vw, 92vw"
                alt={t.dinner.winterAlt}
                aspect="aspect-[3/2]"
                caption={t.dinner.winterCaption}
                className="md:col-span-5"
              />
              <div className="md:col-span-6 md:col-start-7">
                <MaskHeading as="h3" text={t.dinner.breakfastHeading} className="font-erode text-3xl font-light leading-[1.15] tracking-tight md:text-4xl" />
                <Reveal delay={80}>
                  <p className="mt-5 max-w-[46ch] leading-relaxed" style={{ color: BODY }}>{t.dinner.breakfastBody}</p>
                  <dl className="mt-8 space-y-4">
                    {(
                      [
                        [t.dinner.served, BREAKFAST.served],
                        [t.dinner.weCanCover, BREAKFAST.diets],
                      ] as const
                    ).map(([label, items]) => (
                      <div key={label} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t pt-4" style={{ borderColor: HAIR }}>
                        <dt className="w-32 shrink-0 font-fragment text-[11px] uppercase tracking-[0.16em] text-[#B9CBD6]">{label}</dt>
                        <dd className="text-[15px] text-[#F4EEE2]/85">
                          {items.map((b) => t.breakfast[b as keyof typeof t.breakfast] ?? b).join(", ")}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-7 text-[15px] leading-relaxed" style={{ color: BODY }}>
                    {t.dinner.toGoLead}{" "}
                    <span style={{ color: ACCENT }}>
                      {t.breakfast[BREAKFAST.toGo as keyof typeof t.breakfast] ?? BREAKFAST.toGo}
                    </span>
                    . {t.dinner.toGoTail}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5 · Guests ──────────────────────────────────────────────── */}
        <section id="reviews" className="scroll-mt-16 border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
            <h2 className="sr-only">{t.reviews.srHeading}</h2>
            <div className="grid items-end gap-10 md:grid-cols-[auto_1fr] md:gap-16">
              <Reveal>
                <p className="flex items-baseline gap-3">
                  <Count value={Number(SCORE.value)} className="font-erode text-[6rem] font-light leading-none text-[#F4EEE2] md:text-[8rem]" />
                  <span className="font-fragment text-sm uppercase tracking-[0.16em] text-[#B9CBD6]">{t.reviews.outOf}</span>
                </p>
                <p className="mt-3 font-fragment text-[12px] uppercase tracking-[0.16em] text-[#F4EEE2]/70">
                  “{t.reviews.scoreWord}”, {SCORE.count} {t.reviews.reviewsOn}
                </p>
              </Reveal>
              <Reveal delay={100}>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
                  {SCORE.categories.map((c, i) => (
                    <div key={c.label} className="flex flex-col-reverse border-t pt-3" style={{ borderColor: HAIR }}>
                      <dt className="mt-0.5 font-fragment text-[11px] uppercase tracking-[0.14em] text-[#F4EEE2]/60">
                        {t.scoreCats[c.label as keyof typeof t.scoreCats] ?? c.label}
                      </dt>
                      <dd className="font-erode text-2xl font-light" style={{ color: ACCENT }}>
                        <Count value={Number(c.n)} delay={120 + i * 60} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
            <QuoteRotator reduced={reduced} t={t} />
            <Reveal delay={140}>
              <p className="mt-10 max-w-[70ch] text-[15px] leading-relaxed text-[#F4EEE2]/60">
                {t.reviews.via}{" "}
                <a href={REVIEWS_URL} target="_blank" rel="noreferrer" className={`underline underline-offset-4 hover:text-[#F4EEE2]/80 ${FOCUS}`}>
                  Booking.com
                </a>
                {t.reviews.sourceNote}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── 6 · Getting here (Kleif journey) ────────────────────────── */}
        <section id="info" className="scroll-mt-16 border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
            <MaskHeading text={t.journey.heading} className={`max-w-3xl ${H2}`} />
            <Reveal delay={90}>
              <p className="mt-6 max-w-[58ch] text-lg leading-relaxed" style={{ color: BODY }}>{t.journey.body}</p>
            </Reveal>
            <div className="mt-16 md:mt-20">
              <RouteMap t={t} reduced={reduced} />
            </div>

            <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-2 md:gap-16">
              <div className="space-y-8">
                <Reveal>
                  <p className="font-fragment text-[11px] uppercase tracking-[0.16em] text-[#B9CBD6]">{t.info.callFarm}</p>
                  <a href={PHONE_HREF} className={`mt-2 inline-block font-erode text-5xl font-light transition-colors duration-200 hover:text-[#E68C4C] md:text-6xl ${FOCUS}`} style={{ color: ACCENT }}>
                    {PHONE}
                  </a>
                </Reveal>
                <Reveal delay={80}>
                  <p className="font-fragment text-[11px] uppercase tracking-[0.16em] text-[#B9CBD6]">{t.info.writeToUs}</p>
                  <a href={`mailto:${EMAIL}`} className={`-my-2 inline-flex items-center gap-3 py-2 text-xl text-[#F4EEE2]/90 underline-offset-4 hover:underline md:text-2xl ${FOCUS}`}>
                    <Mail className="h-5 w-5 text-[#B9CBD6]" strokeWidth={1.5} aria-hidden="true" />
                    {EMAIL}
                  </a>
                </Reveal>
                <Reveal delay={160}>
                  <p className="font-fragment text-[11px] uppercase tracking-[0.16em] text-[#B9CBD6]">{t.info.address}</p>
                  <p className="mt-2 flex items-start gap-3 text-xl text-[#F4EEE2]/90 md:text-2xl">
                    <MapPin className="mt-1.5 h-5 w-5 shrink-0 text-[#B9CBD6]" strokeWidth={1.5} aria-hidden="true" />
                    {ADDRESS}
                  </p>
                </Reveal>
              </div>
              <div>
                <Reveal delay={100}>
                  <p className="leading-relaxed" style={{ color: BODY }}>{t.info.bookDirect}</p>
                </Reveal>
                <Reveal delay={180}>
                  <p className="mt-10 font-fragment text-[11px] uppercase tracking-[0.16em] text-[#B9CBD6]">{t.info.onTheProperty}</p>
                  <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                    {FACILITIES.map((f) => {
                      const Icon = FACILITY_ICON[f] ?? Sparkles;
                      return (
                        <li key={f} className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} style={{ color: ACCENT }} aria-hidden="true" />
                          <span className="text-[15px] leading-tight text-[#F4EEE2]/80">
                            {t.facilities[f as keyof typeof t.facilities] ?? f}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7 · Closing ─────────────────────────────────────────────── */}
        <section id="book" className="relative flex min-h-[92svh] scroll-mt-16 items-end overflow-hidden">
          <Img {...frame(IMG.dusk, "100vw")} alt={t.closing.duskAlt} className="absolute inset-0 h-full w-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#15130F] via-[#15130F]/40 to-[#15130F]/10" />
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-40 text-center md:px-8 md:pb-28">
            <MaskHeading text={t.closing.heading} className={`mx-auto max-w-3xl ${H2}`} />
            <Reveal delay={140}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#F4EEE2]/85">{t.closing.body}</p>
            </Reveal>
            {/* The booking card lives here, by the footer, never under the
              * hero: the first scroll is for the place ([[booking-widget-at-the-bottom]]).
              * The bar CTA and the phone bottom bar stay reachable throughout. */}
            <Reveal delay={220}>
              <div className="mx-auto mt-10 max-w-5xl text-left">
                <BookingBar variant="card" t={t} lang={lang} stay={stay} onStay={setStay} today={today} />
              </div>
              <a
                href={PHONE_HREF}
                className={`mt-6 inline-flex items-center gap-2 py-2 text-[15px] text-[#F4EEE2]/85 underline-offset-4 hover:underline ${FOCUS}`}
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {t.cta.callFarm} {PHONE}
              </a>
            </Reveal>
          </div>
        </section>

      </main>

      <Footer t={t} lang={lang} setLang={setLang} barSpace />

      {/* Sticky mobile CTA: the booking path two taps away once the picture
       * has gone; hidden while the menu is open. */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t md:hidden"
        style={{
          borderColor: HAIR,
          background: "rgba(21,19,15,0.94)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          transform: pastHero && !menuOpen && !widgetInView ? "translateY(0)" : "translateY(110%)",
          transition: reduced ? "none" : `transform 0.3s ${EASE}`,
        }}
      >
        <div className="flex items-stretch gap-3 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          {bookingReady() ? (
            <a
              href={bookingHref({ lang, checkin: stay.checkin, checkout: stay.checkout, adults: stay.adults, children: stay.children })!}
              className={`flex flex-1 items-center justify-center gap-2 bg-[#D97D3D] px-4 py-3 text-[15px] font-semibold text-[#15130F] active:scale-[0.98] ${FOCUS}`}
            >
              {t.cta.check}
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
          ) : null}
          <a
            href={PHONE_HREF}
            aria-label={`${t.cta.callFarm}, ${PHONE}`}
            className={`flex w-14 items-center justify-center border border-[#F4EEE2]/35 ${FOCUS}`}
          >
            <Phone className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>

    </div>
  );
}
