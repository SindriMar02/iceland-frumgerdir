import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import Lenis from "lenis";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import {
  ArrowUpRight,
  Armchair,
  CigaretteOff,
  Flower2,
  Footprints,
  Mail,
  MapPin,
  Phone,
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
import { companyEntry } from "./company";
import { PreviewChrome } from "../PreviewChrome";
import { PreviewFooter } from "../PreviewFooter";
import { Img } from "../../components/Img";
import { setThemeColor } from "../../lib/preview";
import {
  ADDRESS,
  DINNER_QUOTE,
  DISTANCES,
  EMAIL,
  FOOTNOTE,
  HOUSE_RULES,
  CHECK_TIMES,
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
  UNITS,
} from "./data";
import {
  bookingHref,
  bookingReady,
  GODO_ROOM_NAMES,
  GODO_ROOM_NAMES_IS,
  ROOM_SLEEPS,
  type GodoRoomKey,
} from "./godo";
import { useStay, type Stay } from "./stay";
import {
  galleryFor,
  largest,
  leadFor,
  restFor,
  src as photoSrc,
  srcSet,
  type Photo,
} from "./photos";

/** Every photograph on the page goes out as a srcset across the widths that
 *  actually exist on disk, with a `sizes` hint so a phone never pulls a 2000w
 *  file for a tile it renders at 160px. The widths come from photos.ts, which
 *  is generated alongside the files themselves, so the two cannot drift. */
function frame(p: Photo, sizes: string) {
  return { src: largest(p), srcSet: srcSet(p), sizes };
}

/**
 * What a gallery tile is a picture of. A photograph Booking has filed under a
 * room type is labelled with that room type's own name, because that is her
 * filing rather than our reading of the picture. Everything else gets its
 * category, and a bathroom two room types share is never called private.
 */
function photoAlt(p: Photo, t: Copy, lang: Lang): string {
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
const GALLERY_REST = (
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
const ROOM_ORDER: GodoRoomKey[] = [
  'twinSharedEconomy',
  'doubleTwinShared',
  'double',
  'doubleTwinPrivate',
  'doublePrivateExtraBed',
  'cottage3',
  'familyCottage',
];
import { useLang } from './useLang';
import PRICES from './prices.json';
import { COPY } from './copy';
import type { Copy, Lang } from './copy';
import BookingBar from "./BookingBar";

const company = companyEntry;

/* ── Palette (from the farm's own photography — dusk sun, cabin lamplight, ice)
 * INK on GROUND ≈ 15:1 (AAA) · ACCENT on GROUND ≈ 5.5:1 (AA, large + labels)
 * GROUND text on ACCENT fill ≈ 5.5:1 (AA) — CTA labels are dark-on-amber. */
const GROUND = "#15130F"; // night has fallen, dinner is lit
const ACCENT = "#D97D3D"; // dinner-table ember
const HAIR = "rgba(244,238,226,0.14)";
const BODY = "rgba(244,238,226,0.76)";
const PAPER = "#F4EEE2";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4EEE2]";

/* ── The evening arc: one scrollYProgress drives sky colour + eyebrow ink +
 * the section rule fills, all computed from the raw value in ONE callback. */
type Stop = [number, [number, number, number]];
const SKY_STOPS: Stop[] = [
  [0, [220, 228, 230]], // pale cold daylight (#DCE4E6)
  [0.55, [217, 125, 61]], // ember amber (#D97D3D)
  [1, [21, 19, 15]], // night = ground (#15130F), so the arc resolves seamlessly
];
const INK_STOPS: Stop[] = [
  [0, [185, 203, 214]], // glacier ice
  [0.5, [217, 125, 61]], // ember
  [1, [217, 125, 61]],
];
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
function atStops(stops: Stop[], v: number): string {
  const t = clamp01(v);
  let a = stops[0];
  let b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i][0] && t <= stops[i + 1][0]) {
      a = stops[i];
      b = stops[i + 1];
      break;
    }
  }
  const span = b[0] - a[0] || 1;
  const k = (t - a[0]) / span;
  const c = a[1].map((n, i) => Math.round(n + (b[1][i] - n) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/* ── Reveal — IntersectionObserver on an untransformed wrapper; the failsafe is
 * gated by viewport position (never an unconditional timeout). */
function Reveal({
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
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      const t = window.setTimeout(() => setShown(true), 60);
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -9% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  const style: CSSProperties | undefined = reduced
    ? undefined
    : {
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity 0.75s ${EASE} ${delay}ms, transform 0.75s ${EASE} ${delay}ms`,
      };
  return (
    <div
      ref={ref}
      className={className}
      style={style}
      data-show={shown || reduced}
    >
      {children}
    </div>
  );
}

/* ── ClipImg — clip-path reveal for STANDALONE content photos only (explicit
 * aspect on the wrapper; the observer target never transforms itself). */
function ClipImg({
  photo,
  sizes,
  alt,
  aspect,
  caption,
  delay = 0,
  className = "",
  imgClassName = "",
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
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      const t = window.setTimeout(() => setShown(true), 80);
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  const on = shown || reduced;
  return (
    <figure ref={ref} className={className}>
      <div className={`${aspect} overflow-hidden rounded-sm`}>
        <Img
          {...frame(photo, sizes)}
          alt={alt}
          className={`h-full w-full object-cover ${imgClassName}`}
          style={
            reduced
              ? undefined
              : {
                  clipPath: on ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                  transform: on ? "scale(1)" : "scale(1.06)",
                  transition: `clip-path 0.95s ${EASE} ${delay}ms, transform 1.25s ${EASE} ${delay}ms`,
                }
          }
        />
      </div>
      {caption ? (
        <figcaption className="mt-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#F4EEE2]/55">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ── Eyebrow — carries the evening-arc signature: mono label tinted by the sky
 * (--skyink) + a thin rule that fills as the section passes the viewport
 * centre band. --rule is written raw per frame in the single scroll callback. */
function Eyebrow({
  label,
  register,
  reduced,
  className = "",
}: {
  label: string;
  register: (el: HTMLSpanElement) => () => void;
  reduced: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return register(el);
  }, [register]);
  return (
    <span className={`block ${className}`}>
      <span
        className="font-mono text-[11px] uppercase tracking-[0.24em]"
        style={{ color: "var(--skyink, #B9CBD6)" }}
      >
        {label}
      </span>
      <span
        ref={ref}
        className="mt-2.5 block h-[2px] w-28 rounded-full bg-[#F4EEE2]/15"
      >
        <span
          className="block h-full w-full origin-left rounded-full bg-[#D97D3D]"
          style={{
            transform: reduced ? "scaleX(1)" : "scaleX(var(--rule, 0))",
          }}
        />
      </span>
    </span>
  );
}

/* Language switch. A single button, not a two-option segmented control: with
 * exactly two languages the current one is already visible in the page around
 * it, so the button names the language you would GET, which is the thing the
 * visitor is deciding. aria-label spells it out for screen readers. */
function LangToggle({
  lang,
  setLang,
  t,
  className = '',
}: {
  lang: 'is' | 'en'
  setLang: (l: 'is' | 'en') => void
  t: (typeof COPY)['en']
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'is' ? 'en' : 'is')}
      aria-label={t.switchTo}
      lang={lang === 'is' ? 'en' : 'is'}
      className={`font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/70 transition-colors duration-200 hover:text-[#F4EEE2] ${FOCUS} ${className}`}
    >
      {t.otherLangName}
    </button>
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
function RoomBookLink({
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
      /* py-3 on a phone, not for the look but for the thumb: the label itself
       * is only about 22px tall, which is half a tap target. The negative
       * margin keeps the row height where the design put it. */
      className={`group -my-2 inline-flex shrink-0 items-center gap-1.5 py-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#F4EEE2]/60 transition-colors duration-200 hover:text-[#F4EEE2] md:my-0 md:py-1 ${FOCUS}`}
    >
      <span className="relative py-1">
        {t.cta.bookRoom}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
          style={{ background: ACCENT }}
        />
      </span>
      <ArrowUpRight
        className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-px"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </a>
  );
}

function BookLink({
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
      className={`group inline-flex items-center gap-2 bg-[#D97D3D] py-2 pl-6 pr-2 font-supreme text-[15px] font-semibold text-[#15130F] transition-[transform,background-color] duration-200 ease-out hover:bg-[#E68C4C] active:scale-[0.98] ${FOCUS} ${className}`}
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

function QuoteRotator({ reduced, t }: { reduced: boolean; t: (typeof COPY)['en'] }) {
  const [full, setFull] = useState<ReviewFile | null>(null)
  const [page, setPage] = useState(0)
  const [held, setHeld] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
    if (reduced || held || pages < 2) return
    const id = window.setInterval(() => setPage((p) => (p + 1) % pages), 7000)
    return () => window.clearInterval(id)
  }, [reduced, held, pages])

  const start = page * PER_PAGE
  const shown = pool.slice(start, start + PER_PAGE)

  const step = (d: number) => setPage((p) => (p + d + pages) % pages)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div
        key={page}
        aria-live="polite"
        className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8"
        style={reduced ? undefined : { animation: `quoteIn 0.55s ${EASE} both` }}
      >
        {shown.map((q: Review) => (
          <blockquote
            key={`${q.n}|${q.d}|${q.t.slice(0, 24)}`}
            className="border-t pt-6"
            style={{ borderColor: HAIR }}
          >
            {/* pre-line, because plenty of these were written as stacked short
              * lines rather than sentences. Collapsing them and inserting full
              * stops would be editing somebody else's review. */}
            <p className="whitespace-pre-line leading-relaxed text-[#F4EEE2]/85">“{q.t}”</p>
            <footer className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B9CBD6]">
              {q.n}
              {q.c ? `, ${q.c}` : ''}
              <span className="mt-1 block text-[#F4EEE2]/45">
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
              className={`grid h-11 w-11 place-items-center border transition-colors duration-200 hover:border-[#F4EEE2]/45 md:h-9 md:w-9 ${FOCUS}`}
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
              className={`grid h-11 w-11 place-items-center border transition-colors duration-200 hover:border-[#F4EEE2]/45 md:h-9 md:w-9 ${FOCUS}`}
              style={{ borderColor: HAIR, color: PAPER }}
            >
              <ArrowUpRight
                className="h-4 w-4 rotate-45"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#F4EEE2]/45 tabular-nums">
            {start + 1}&ndash;{Math.min(start + PER_PAGE, pool.length)} {t.reviews.of}{' '}
            {pool.length.toLocaleString('en-US')} {t.reviews.written}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default function Page() {
  const [lang, setLang] = useLang();
  const t = COPY[lang];
  /* One stay for the whole page: the hero picker writes it, the room list reads
   * it, so "book this room" carries the nights the guest already chose. */
  const { stay, setStay, today } = useStay();
  const reduced = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const rules = useRef(new Set<HTMLSpanElement>());
  const [mounted, setMounted] = useState(false);
  const [barShown, setBarShown] = useState(false);
  const barRef = useRef(false);
  const { scrollYProgress } = useScroll();

  /* ── Mobile menu — hamburger state, measured nav height (so the overlay's
   * padding-top lines up under the real nav bar), body-scroll lock + Escape. */
  const [menuOpen, setMenuOpen] = useState(false);
  const navRowRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(84);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const el = navRowRef.current;
    if (!el) return;
    const measure = () => setNavHeight(el.getBoundingClientRect().height);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const register = useCallback((el: HTMLSpanElement) => {
    rules.current.add(el);
    return () => {
      rules.current.delete(el);
    };
  }, []);

  /* Close the overlay first, then hand off to the browser's smooth scroll on
   * the next frame — never both at once. */
  const handleNavLinkClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      /* One frame, so the mobile menu has released body overflow before we move. */
      requestAnimationFrame(() => {
        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;
        const lenis = lenisRef.current;
        if (lenis) {
          /* Negative offset clears the fixed nav so the section heading is not
           * left sitting underneath it on arrival. */
          lenis.scrollTo(target, { offset: -navHeight, duration: 1.2 });
        } else {
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - navHeight,
            behavior: reduced ? "auto" : "smooth",
          });
        }
        /* Keep the address bar honest without letting the browser jump. */
        window.history.replaceState(null, "", href);
      });
    },
    [reduced, navHeight],
  );

  /* The ONE signature: sky colour, eyebrow ink and every rule fill are derived
   * from the raw progress value inside this single callback — no sibling
   * useTransform .get() reads, no CSS transitions on scrubbed values. */
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty("--sky", atStops(SKY_STOPS, v));
    root.style.setProperty("--skyink", atStops(INK_STOPS, v));
    const vh = window.innerHeight || 800;
    rules.current.forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty(
        "--rule",
        clamp01((vh * 0.86 - r.top) / (vh * 0.52)).toFixed(4),
      );
    });
    if (!barRef.current && v > 0.02) {
      barRef.current = true;
      setBarShown(true);
    }
  });

  /* Lenis smooth scroll — skipped entirely under prefers-reduced-motion.
   * Held in a ref as well, because anchor clicks have to be routed through
   * Lenis by hand: index.css sets `.lenis { scroll-behavior: auto !important }`
   * for Lenis's whole mounted lifetime (deliberately, so the browser's own
   * easing does not fight Lenis's rAF loop). That also cancels the native
   * smooth scroll a plain `#id` link or scrollIntoView would rely on, so
   * without this the nav jumps instantly. */
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.1 });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) setBarShown(true);
    const t = window.setTimeout(() => setMounted(true), 40);
    return () => window.clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    document.title = "Nýpugarðar · Kvöldverðurinn á Mýrum";
    setThemeColor(GROUND);
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BedAndBreakfast",
      name: "Nýpugarðar",
      telephone: "+354 893 1826",
      email: EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Nýpugarðar",
        addressLocality: "Höfn í Hornafirði",
        postalCode: "781",
        addressCountry: "IS",
      },
      petsAllowed: false,
      checkinTime: "16:00",
      checkoutTime: "11:00",
    });
    document.head.appendChild(s);
    return () => {
      document.head.removeChild(s);
    };
  }, []);

  const on = mounted || reduced;
  const rise = (i: number): CSSProperties =>
    reduced
      ? {}
      : {
          opacity: on ? 1 : 0,
          transform: on ? "none" : "translateY(26px)",
          filter: on ? "none" : "blur(6px)",
          transition: `opacity 0.85s ${EASE} ${140 + i * 90}ms, transform 0.85s ${EASE} ${140 + i * 90}ms, filter 0.85s ${EASE} ${140 + i * 90}ms`,
        };

  return (
    <div
      ref={rootRef}
      lang="en"
      className="min-h-screen font-supreme text-[#F4EEE2] antialiased"
      style={
        {
          background: GROUND,
          "--sky": "#DCE4E6",
          "--skyink": "#B9CBD6",
        } as CSSProperties
      }
    >
      <PreviewChrome company={company} />

      {/* The sky band — a thin fixed atmosphere behind the headlines. Its colour
       * IS the evening: daylight blue at the top of the page, ember by dinner,
       * and exactly the ground colour by the final CTA, so it melts into night. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[44vh]"
        style={{
          background: "linear-gradient(to bottom, var(--sky), transparent)",
          opacity: 0.32,
        }}
      />

      {/* ── 1 · HERO — Arrival ─────────────────────────────────────────── */}
      {/* No explicit z-index here (z-auto): this box must NOT form its own
       * stacking context, or it would trap the nav bar inside it and drag
       * the whole hero above the mobile menu overlay along with it. Leaving
       * it z-auto lets the nav bar's own z-40 rank above the overlay while
       * the hero photo/copy (z-auto/5/10) stay ranked below it — see the
       * overlay's comment right after </header>. */}
      <header className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <Img
          {...frame(IMG.hero, "100vw")}
          alt={t.closing.heroAlt}
          fetchpriority="high"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
          style={
            reduced
              ? undefined
              : {
                  opacity: on ? 1 : 0,
                  transform: on ? "scale(1)" : "scale(1.05)",
                  transition: `opacity 1.4s ${EASE}, transform 2.2s ${EASE}`,
                }
          }
        />
        {/* Lighter than it looks it should be, on purpose. The hero frame is
         * her best photograph and the whole top two thirds of it is the light
         * on the ice; a scrim heavy enough to be safe everywhere turns that
         * into brown haze. The headline sits in the bottom third, where the
         * gradient is at full strength, so legibility is paid for down there
         * and the picture is left alone up here. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#15130F] via-[#15130F]/50 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-[5] h-40 bg-gradient-to-b from-[#15130F]/75 to-transparent"
        />

        <nav
          className="absolute inset-x-0 top-0 z-40"
          aria-label="Main"
          style={{
            background: menuOpen ? GROUND : "transparent",
            transition: reduced ? "none" : `background-color 0.3s ${EASE}`,
          }}
        >
          <div
            ref={navRowRef}
            className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8"
          >
            <a
              href="#top"
              className={`font-erode text-xl tracking-tight ${FOCUS}`}
            >
              Nýpugarðar
            </a>
            <div className="hidden items-center gap-7 md:flex">
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={(e) => handleNavLinkClick(e, `#${n.id}`)}
                  className={`font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/80 transition-colors duration-200 hover:text-[#F4EEE2] ${FOCUS}`}
                >
                  {t.nav[n.id as keyof typeof t.nav]}
                </a>
              ))}
              <LangToggle lang={lang} setLang={setLang} t={t} className="ml-2" />
            </div>
            {bookingReady() ? (
              <a
                href={bookingHref({
                  lang,
                  checkin: stay.checkin,
                  checkout: stay.checkout,
                  adults: stay.adults,
                  children: stay.children,
                })!}
                className={`hidden bg-[#D97D3D] px-4 py-2 text-[13px] font-semibold text-[#15130F] transition-colors duration-200 hover:bg-[#E68C4C] sm:inline-block ${FOCUS}`}
              >
                {t.cta.check}
              </a>
            ) : (
              <span
                className="hidden border border-dashed px-4 py-2 text-[13px] font-semibold sm:inline-block"
                style={{
                  borderColor: "rgba(217,125,61,0.55)",
                  color: "rgba(217,125,61,0.85)",
                }}
                title={t.booking.placeholder}
              >
                {t.cta.check}
              </span>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={`-mr-2.5 flex h-11 w-11 items-center justify-center md:hidden ${FOCUS}`}
            >
              <span aria-hidden="true" className="relative block h-4 w-6">
                <span
                  className="absolute left-0 top-0 block h-[2px] w-6 rounded-full"
                  style={{
                    background: menuOpen ? ACCENT : "#F4EEE2",
                    transform: menuOpen
                      ? "translateY(7px) rotate(45deg)"
                      : "translateY(0) rotate(0deg)",
                    transition: reduced
                      ? "none"
                      : `transform 0.3s ${EASE}, background-color 0.3s ${EASE}`,
                  }}
                />
                <span
                  className="absolute bottom-0 left-0 block h-[2px] w-6 rounded-full"
                  style={{
                    background: menuOpen ? ACCENT : "#F4EEE2",
                    transform: menuOpen
                      ? "translateY(-7px) rotate(-45deg)"
                      : "translateY(0) rotate(0deg)",
                    transition: reduced
                      ? "none"
                      : `transform 0.3s ${EASE}, background-color 0.3s ${EASE}`,
                  }}
                />
              </span>
            </button>
          </div>
        </nav>

        <div
          id="top"
          className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-28 md:px-8 md:pb-20 md:pt-0"
        >
          {/* Editorial split: the headline holds the left, the booking card sits
           * on the right at lg and above. Below that it stacks back under the
           * copy, which is the right order on a phone — read first, book second. */}
          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:items-end lg:gap-14">
            <div>
              <p
                lang="is"
                className="font-mono text-[11.5px] uppercase tracking-[0.26em] text-[#B9CBD6]"
                style={rise(0)}
              >
                {t.hero.eyebrow}
              </p>
              <h1
                className="mt-4 max-w-4xl font-erode text-[clamp(3.1rem,9vw,6.5rem)] font-medium leading-[1.16] tracking-tight"
                style={rise(1)}
              >
                Nýpugarðar
              </h1>
              <p
                className="mt-5 max-w-xl text-lg leading-relaxed text-[#F4EEE2]/85"
                style={rise(2)}
              >
                {t.hero.sub}
              </p>
              <div
                className="mt-8 flex flex-wrap items-center gap-4"
                style={rise(3)}
              >
                <a
                  href={PHONE_HREF}
                  className={`inline-flex items-center gap-2 border border-[#F4EEE2]/35 px-6 py-3.5 text-[15px] font-medium transition-colors duration-200 hover:border-[#F4EEE2]/70 ${FOCUS}`}
                >
                  <Phone
                    className="h-4 w-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {PHONE}
                </a>
              </div>
            </div>
            <BookingBar
              variant="card"
              className="mt-10 lg:mt-0"
              t={t}
              lang={lang}
              stay={stay}
              onStay={setStay}
              today={today}
            />
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay — a SIBLING of <header>, never nested inside
       * it or <nav>. It is `fixed`, so it always sizes to the real viewport
       * regardless of anything a scroll effect does to an ancestor (a
       * transform/backdrop-filter on an ancestor would otherwise become the
       * containing block for a fixed descendant and collapse it to zero).
       * z-30 sits below the nav bar's z-40 (header itself is z-auto, so it
       * can't drag the nav along with it) and above the hero photo/copy
       * (z-auto/z-5/z-10), so the nav row — solid background, hamburger
       * morphed into an X — stays visible and tappable on top of it while
       * the hero underneath is fully hidden. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-30 flex flex-col md:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        style={{
          background: GROUND,
          paddingTop: navHeight,
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          transition: reduced
            ? "none"
            : menuOpen
              ? `opacity 0.3s ${EASE}, visibility 0s`
              : `opacity 0.3s ${EASE}, visibility 0s 0.3s`,
        }}
      >
        <nav
          className="flex flex-1 flex-col justify-center px-6"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {NAV.map((n, i) => (
              <li key={n.id} className="overflow-hidden">
                <a
                  href={`#${n.id}`}
                  onClick={(e) => handleNavLinkClick(e, `#${n.id}`)}
                  className={`block py-2 font-erode text-[clamp(2.5rem,13vw,4.5rem)] font-medium leading-[1.1] tracking-tight text-[#F4EEE2] ${FOCUS}`}
                  style={{
                    transform:
                      menuOpen || reduced
                        ? "translateY(0%)"
                        : "translateY(100%)",
                    transition: reduced
                      ? "none"
                      : `transform 0.6s ${EASE} ${menuOpen ? 60 + i * 60 : 0}ms`,
                  }}
                >
                  {t.nav[n.id as keyof typeof t.nav]}
                </a>
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="mt-8 block h-[2px] w-16 origin-left rounded-full"
            style={{
              background: ACCENT,
              transform: menuOpen || reduced ? "scaleX(1)" : "scaleX(0)",
              transition: reduced
                ? "none"
                : `transform 0.5s ${EASE} ${menuOpen ? 60 + NAV.length * 60 : 0}ms`,
            }}
          />
        </nav>
        <div className="px-6 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-4">
          <LangToggle
            lang={lang}
            setLang={setLang}
            t={t}
            className="mb-5 block text-[13px]"
          />
          <BookLink
            lang={lang}
            stay={stay}
            className="w-full justify-center py-4 text-base"
            onClick={() => setMenuOpen(false)}
          >
            {t.cta.check}
          </BookLink>
        </div>
      </div>

      <main className="relative z-[1]">
        {/* ── 2 · THE FARM — sheep ─────────────────────────────────────── */}
        <section
          id="farm"
          className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32"
        >
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <Eyebrow
                label={t.farm.eyebrow}
                register={register}
                reduced={reduced}
              />
              <Reveal delay={60}>
                <h2 className="mt-6 font-erode text-4xl font-medium leading-[1.16] tracking-tight md:text-5xl">
                  {t.farm.heading}
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p
                  className="mt-6 max-w-[58ch] leading-relaxed"
                  style={{ color: BODY }}
                >
                  {t.farm.body}
                </p>
              </Reveal>
              <Reveal delay={220}>
                <dl
                  className="mt-10 grid grid-cols-2 gap-6 border-t pt-8"
                  style={{ borderColor: HAIR }}
                >
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/55">
                      {t.farm.guestsFull}
                    </dt>
                    <dd
                      className="mt-1 font-erode text-4xl"
                      style={{ color: ACCENT }}
                    >
                      24
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/55">
                      {t.farm.open}
                    </dt>
                    <dd
                      className="mt-1 font-erode text-4xl"
                      style={{ color: ACCENT }}
                    >
                      {t.farm.allYear}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>
            <ClipImg
              photo={IMG.reindeer}
              sizes="(min-width: 768px) 46vw, 92vw"
              alt={t.farm.reindeerAlt}
              aspect="aspect-[4/3]"
              caption={t.farm.reindeerCaption}
            />
          </div>
        </section>

        {/* ── 4 · GLACIER & SETTING ────────────────────────────────────── */}
        <section className="relative flex min-h-[86svh] items-end overflow-hidden">
          <Img
            {...frame(IMG.glacier, "100vw")}
            alt={t.hill.glacierAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#15130F] via-[#15130F]/55 to-[#15130F]/20"
          />
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-40 md:px-8 md:pb-20">
            <Eyebrow
              label={t.hill.eyebrow}
              register={register}
              reduced={reduced}
            />
            <Reveal delay={60}>
              <h2 className="mt-6 max-w-3xl font-erode text-4xl font-medium leading-[1.16] tracking-tight md:text-5xl">
                {t.hill.heading}
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 max-w-[60ch] leading-relaxed text-[#F4EEE2]/85">
                {t.hill.body}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <dl
                className="mt-10 grid grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-3"
                style={{ borderColor: "rgba(244,238,226,0.25)" }}
              >
                {DISTANCES.map((d) => (
                  <div key={t.distances[d.key as keyof typeof t.distances] ?? d.label}>
                    <dd className="font-erode text-3xl text-[#F4EEE2] md:text-4xl">
                      {d.n}
                    </dd>
                    <dt className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B9CBD6]">
                      {t.distances[d.key as keyof typeof t.distances] ?? d.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Glacier — secondary panel */}
        <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-28">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <ClipImg
              photo={IMG.ridge}
              sizes="(min-width: 768px) 46vw, 92vw"
              alt={t.hill.ridgeAlt}
              aspect="aspect-[4/3]"
              caption={t.hill.ridgeEyebrow}
            />
            <div>
              <Reveal>
                <h2 className="font-erode text-3xl font-medium leading-[1.16] tracking-tight md:text-4xl">
                  {t.place.heading}
                </h2>
              </Reveal>
              <Reveal delay={90}>
                <p
                  className="mt-5 max-w-[56ch] leading-relaxed"
                  style={{ color: BODY }}
                >
                  {t.place.body}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── 5 · ACCOMMODATION ────────────────────────────────────────── */}
        <section id="rooms" className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Eyebrow label={t.rooms.eyebrow} register={register} reduced={reduced} />
            <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-end">
              <Reveal>
                <h2 className="font-erode text-4xl font-medium leading-[1.16] tracking-tight md:text-5xl">
                  {t.rooms.heading}
                </h2>
              </Reveal>
              <Reveal delay={90}>
                <p
                  className="max-w-[52ch] leading-relaxed md:justify-self-end"
                  style={{ color: BODY }}
                >
                  {t.rooms.body}
                </p>
              </Reveal>
            </div>

            <Reveal delay={140}>
              <dl
                className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 md:grid-cols-4"
                style={{ borderColor: HAIR }}
              >
                {UNITS.map((u) => (
                  <div key={t.units[u.key as keyof typeof t.units] ?? u.label}>
                    <dd
                      className="font-erode text-5xl"
                      style={{ color: ACCENT }}
                    >
                      {u.n}
                    </dd>
                    <dt className="mt-2 max-w-[16ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-[#F4EEE2]/60">
                      {t.units[u.key as keyof typeof t.units] ?? u.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-14 border-t pt-10" style={{ borderColor: HAIR }}>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#F4EEE2]/55">
                  {t.price.roomTypes}
                </h3>
                <ul className="mt-6 flex flex-col">
                  {ROOM_ORDER.map((k) => {
                    const price = (PRICES.rooms as Record<string, { from: number | null }>)[k]
                      ?.from
                    const name = lang === 'is' ? GODO_ROOM_NAMES_IS[k] : GODO_ROOM_NAMES[k]
                    /* Her own photograph of this exact type, as she filed it on
                     * Booking — never a stand-in from a different room. */
                    const lead = leadFor(k)
                    return (
                      <li
                        key={k}
                        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b py-4"
                        style={{ borderColor: HAIR }}
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          {lead ? (
                            <Img
                              src={photoSrc(lead.id, 480)}
                              alt=""
                              aria-hidden="true"
                              className="h-14 w-20 shrink-0 rounded-sm object-cover sm:h-16 sm:w-24"
                            />
                          ) : null}
                          <div className="min-w-0">
                            <span className="block text-[15px] leading-snug text-[#F4EEE2]/85">
                              {name}
                            </span>
                            <span className="mt-1 block font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#F4EEE2]/45">
                              {t.price.sleeps} {ROOM_SLEEPS[k]}
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-6">
                          {typeof price === 'number' ? (
                            <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#F4EEE2]/55">
                              {t.price.from}{' '}
                              <span
                                className="font-erode text-2xl tracking-tight tabular-nums"
                                style={{ color: ACCENT }}
                              >
                                {price}
                              </span>{' '}
                              &euro; {t.price.perNight}
                            </span>
                          ) : null}
                          <RoomBookLink room={k} name={name} stay={stay} lang={lang} t={t} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-5 max-w-[62ch] text-[13px] leading-relaxed text-[#F4EEE2]/45">
                  {t.price.pricesNote}
                </p>
              </div>
            </Reveal>

            {/* Cottages */}
            <div className="mt-20 grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
              <div>
                <Reveal>
                  <h3 className="font-erode text-3xl font-medium leading-[1.16] tracking-tight md:text-4xl">
                    {t.rooms.cottagesHeading}
                  </h3>
                </Reveal>
                <Reveal delay={90}>
                  <p
                    className="mt-5 max-w-[52ch] leading-relaxed"
                    style={{ color: BODY }}
                  >
                    {t.rooms.cottagesBody}
                  </p>
                </Reveal>
                <Reveal delay={220}>
                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <BookLink lang={lang} stay={stay}>{t.cta.check}</BookLink>
                    <p className="text-sm text-[#F4EEE2]/55">
                      {t.cta.liveFromGodo}
                    </p>
                  </div>
                </Reveal>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                <ClipImg
                  photo={IMG.cottage1}
                  sizes="(min-width: 768px) 27vw, 44vw"
                  alt={t.rooms.cottage1Alt}
                  aspect="aspect-[3/4]"
                  caption={t.rooms.cottage1Caption}
                />
                <ClipImg
                  photo={IMG.cottage2}
                  sizes="(min-width: 768px) 27vw, 44vw"
                  alt={t.rooms.cottage2Alt}
                  aspect="aspect-[3/4]"
                  caption={t.rooms.cottage2Caption}
                  delay={110}
                />
              </div>
            </div>

            {/* Practical facts, pulled out of the cottage column so nobody scrolls
             * past them. The two times carry the weight because they are what
             * guests actually look up; the policies sit under as a plain list. */}
            <Reveal delay={80}>
              <div
                className="mt-20 border-t pt-10 md:mt-24 md:pt-12"
                style={{ borderColor: HAIR }}
              >
                <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#F4EEE2]/55">
                  {t.rooms.beforeYouCome}
                </h3>
                <div className="mt-8 grid gap-10 md:grid-cols-[auto_1fr] md:gap-20">
                  <dl className="flex gap-12 sm:gap-16">
                    {CHECK_TIMES.map((ct) => (
                      <div key={ct.key === "arrive" ? t.rooms.arrive : t.rooms.leave}>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4EEE2]/55">
                          {ct.key === "arrive" ? t.rooms.arrive : t.rooms.leave}
                        </dt>
                        <dd
                          className="mt-2 font-erode text-5xl leading-none tracking-tight tabular-nums md:text-6xl"
                          style={{ color: ACCENT }}
                        >
                          {ct.value}
                        </dd>
                        <dd className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F4EEE2]/45">
                          {ct.key === "arrive" ? t.rooms.until : t.rooms.from}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2 md:self-center">
                    {HOUSE_RULES.map((h) => (
                      <li key={t.rules[h.key as keyof typeof t.rules] ?? h.rule} className="flex items-baseline gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[0.45em] h-px w-4 shrink-0"
                          style={{ background: "rgba(244,238,226,0.3)" }}
                        />
                        <span className="text-[15px] leading-snug text-[#F4EEE2]/85">
                          {t.rules[h.key as keyof typeof t.rules] ?? h.rule}
                          {h.note ? (
                            <span className="text-[#F4EEE2]/50">
                              , {h.noteKey ? t.rules[h.noteKey as keyof typeof t.rules] : null}
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 6 · THE DINNER BUFFET — the signature offering ───────────── */}
        <section id="dinner" className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Eyebrow
              label={t.dinner.eyebrow}
              register={register}
              reduced={reduced}
            />
            <Reveal delay={60}>
              <h2 className="mt-6 max-w-3xl font-erode text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.16] tracking-tight">
                {t.dinner.heading}
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p
                className="mt-6 max-w-[62ch] text-lg leading-relaxed"
                style={{ color: BODY }}
              >
                {t.dinner.intro}
              </p>
            </Reveal>

            <ClipImg
              photo={IMG.dining}
              sizes="(min-width: 1200px) 1088px, 92vw"
              alt={t.dinner.diningAlt}
              aspect="aspect-[1280/577]"
              caption={t.dinner.diningCaption}
              className="mt-12"
            />

            <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-14">
              <Reveal>
                <blockquote>
                  <p className="font-erode text-2xl italic leading-[1.4] text-[#F4EEE2]/90 md:text-[1.7rem]">
                    “{DINNER_QUOTE.text}”
                  </p>
                  <footer
                    className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em]"
                    style={{ color: ACCENT }}
                  >
                    {DINNER_QUOTE.name}, {DINNER_QUOTE.place} · guest review on
                    Booking.com
                  </footer>
                </blockquote>
              </Reveal>
              <div>
                <Reveal delay={80}>
                  <p className="leading-relaxed" style={{ color: BODY }}>
                    {t.dinner.body}
                  </p>
                </Reveal>
                <Reveal delay={160}>
                  <div className="mt-7 flex flex-wrap gap-4">
                    <a
                      href={PHONE_HREF}
                      className={`inline-flex items-center gap-2 border border-[#F4EEE2]/35 px-5 py-3 text-[15px] font-medium transition-colors duration-200 hover:border-[#F4EEE2]/70 ${FOCUS}`}
                    >
                      <Phone
                        className="h-4 w-4"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      {PHONE}
                    </a>
                    <a
                      href={`mailto:${EMAIL}`}
                      className={`inline-flex items-center gap-2 border border-[#F4EEE2]/35 px-5 py-3 text-[15px] font-medium transition-colors duration-200 hover:border-[#F4EEE2]/70 ${FOCUS}`}
                    >
                      <Mail
                        className="h-4 w-4"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      {EMAIL}
                    </a>
                  </div>
                </Reveal>
                <ClipImg
                  photo={IMG.deck}
                  sizes="320px"
                  alt={t.dinner.deckAlt}
                  aspect="aspect-[3/4]"
                  caption={t.dinner.deckCaption}
                  delay={200}
                  className="mt-8 max-w-xs"
                />
              </div>
            </div>

            <Reveal delay={120}>
              <div className="mt-16 border-t pt-10 md:mt-20 md:pt-12" style={{ borderColor: HAIR }}>
                <div className="grid gap-10 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-14">
                  <ClipImg
                    photo={IMG.breakfast}
                    sizes="(min-width: 768px) 46vw, 92vw"
                    alt={t.dinner.breakfastAlt}
                    aspect="aspect-[4/3]"
                    caption={t.dinner.breakfastCaption}
                  />
                  <div>
                    <h3 className="font-erode text-2xl font-medium leading-[1.2] tracking-tight md:text-3xl">
                      {t.dinner.breakfastHeading}
                    </h3>
                    <p className="mt-4 max-w-[46ch] leading-relaxed" style={{ color: BODY }}>
                      {t.dinner.breakfastBody}
                    </p>
                    <dl className="mt-8 space-y-5">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t pt-4" style={{ borderColor: HAIR }}>
                        <dt className="w-32 shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4EEE2]/50">
                          {t.dinner.served}
                        </dt>
                        <dd className="text-[15px] text-[#F4EEE2]/85">
                          {BREAKFAST.served.map((b) => t.breakfast[b as keyof typeof t.breakfast] ?? b).join(' · ')}
                        </dd>
                      </div>
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t pt-4" style={{ borderColor: HAIR }}>
                        <dt className="w-32 shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4EEE2]/50">
                          {t.dinner.weCanCover}
                        </dt>
                        <dd className="text-[15px] text-[#F4EEE2]/85">
                          {BREAKFAST.diets.map((b) => t.breakfast[b as keyof typeof t.breakfast] ?? b).join(' · ')}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-7 text-[15px] leading-relaxed" style={{ color: BODY }}>
                      {t.dinner.toGoLead}{' '}
                      <span style={{ color: ACCENT }}>
                        {t.breakfast[BREAKFAST.toGo as keyof typeof t.breakfast] ?? BREAKFAST.toGo}
                      </span>
                      . {t.dinner.toGoTail}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 7 · SEASONS ──────────────────────────────────────────────── */}
        <section className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <h2 className="sr-only">{t.seasons.srHeading}</h2>
            <div className="grid gap-12 md:grid-cols-2 md:gap-0 md:divide-x md:divide-[#F4EEE2]/15">
              <Reveal className="md:pr-14">
                <h3 className="font-erode text-3xl font-medium leading-[1.16] tracking-tight">
                  {t.seasons.springHeading}
                </h3>
                <p
                  className="mt-4 max-w-[50ch] leading-relaxed"
                  style={{ color: BODY }}
                >
                  {t.seasons.springBody}
                </p>
                {/* The farm in green, against the snow on the other side of the
                  * divider. One column carrying a photograph and the other
                  * carrying nothing read as a layout that had lost an image. */}
                <ClipImg
                  photo={IMG.green}
                  sizes="(min-width: 768px) 46vw, 92vw"
                  alt={t.seasons.springAlt}
                  aspect="aspect-[3/2]"
                  caption={t.seasons.springCaption}
                  delay={140}
                  className="mt-8"
                />
              </Reveal>
              <Reveal delay={110} className="md:pl-14">
                <h3 className="font-erode text-3xl font-medium leading-[1.16] tracking-tight">
                  {t.seasons.winterHeading}
                </h3>
                <p
                  className="mt-4 max-w-[50ch] leading-relaxed"
                  style={{ color: BODY }}
                >
                  {t.seasons.winterBody}
                </p>
                {/* Her best winter frame, and it was sitting in IMG declared but
                  * never rendered — so the page said "winter" in words with no
                  * picture, while the photograph waited in the gallery among the
                  * thumbnails. It belongs here. */}
                <ClipImg
                  photo={IMG.house}
                  sizes="(min-width: 768px) 46vw, 92vw"
                  alt={t.seasons.winterAlt}
                  aspect="aspect-[3/2]"
                  caption={t.seasons.winterCaption}
                  delay={140}
                  className="mt-8"
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── 7b · THE FULL LIBRARY ────────────────────────────────────
         * Whatever the featured frames above did not use ends up here, grouped
         * the way a guest actually asks about a place: the rooms, the cottages,
         * the bathrooms, the table, the house, the land. All 43 photographs are
         * hers, and the room groups are labelled with the room type Booking has
         * each photo filed under, so a tile can be trusted as the room it says
         * it is. */}
        <section id="gallery" className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Eyebrow label={t.gallery.eyebrow} register={register} reduced={reduced} />
            <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-end">
              <Reveal>
                <h2 className="font-erode text-4xl font-medium leading-[1.16] tracking-tight md:text-5xl">
                  {t.gallery.heading}
                </h2>
              </Reveal>
              <Reveal delay={90}>
                <p className="max-w-[52ch] leading-relaxed md:justify-self-end" style={{ color: BODY }}>
                  {t.gallery.body}
                </p>
              </Reveal>
            </div>

            <h3
              className="mt-14 border-t pt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-[#F4EEE2]/55"
              style={{ borderColor: HAIR }}
            >
              {t.gallery.byRoom}
            </h3>

            {/* One row per bookable type, in the same order as the price list
             * above, carrying every photo Booking has filed under it — the
             * bedrooms and the bathroom that goes with them. A guest can point
             * at a row and know that is what arrives when they book it. */}
            {ROOM_ORDER.map((k) => {
              /* Minus this row's own thumbnail up in the price list, and minus
               * anything already running as a full frame higher up the page. */
              const shots = galleryFor(k, FEATURED_IDS);
              if (!shots.length) return null;
              return (
                <div key={k} className="mt-10">
                  {/* Same quiet link as the price list. Someone who has scrolled
                    * this far is looking at the photographs of one specific
                    * room, which is exactly the moment to let them book that
                    * room instead of sending them back up the page. */}
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#F4EEE2]/70">
                      {lang === "is" ? GODO_ROOM_NAMES_IS[k] : GODO_ROOM_NAMES[k]}
                      <span className="text-[#F4EEE2]/35">
                        {t.price.sleeps} {ROOM_SLEEPS[k]}
                      </span>
                    </p>
                    <RoomBookLink
                      room={k}
                      name={lang === "is" ? GODO_ROOM_NAMES_IS[k] : GODO_ROOM_NAMES[k]}
                      stay={stay}
                      lang={lang}
                      t={t}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
                    {shots.map((ph, i) => (
                      <ClipImg
                        key={ph.id}
                        photo={ph}
                        sizes="(min-width: 1024px) 17vw, (min-width: 640px) 30vw, 46vw"
                        alt={photoAlt(ph, t, lang)}
                        aspect="aspect-[3/4]"
                        /* Cap the stagger: a six-across row should ripple, not
                         * queue up behind half a second of delay. */
                        delay={Math.min(i, 5) * 70}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {GALLERY_REST.length ? (
              <h3
                className="mt-16 border-t pt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-[#F4EEE2]/55"
                style={{ borderColor: HAIR }}
              >
                {t.gallery.andTheRest}
              </h3>
            ) : null}

            {GALLERY_REST.map((g) => (
              <div key={g.key} className="mt-10">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#F4EEE2]/70">
                  {t.gallery.groups[g.key]}
                </p>
                {/* These three groups are landscape frames — a wide view of
                  * Mýrar cropped into a portrait tile throws away the half of
                  * the picture that is the reason for the picture. */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
                  {g.photos.map((ph, i) => (
                    <ClipImg
                      key={ph.id}
                      photo={ph}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 30vw, 46vw"
                      alt={photoAlt(ph, t, lang)}
                      aspect="aspect-[4/3]"
                      delay={Math.min(i, 3) * 70}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8 · REVIEWS ──────────────────────────────────────────────── */}
        <section
          id="reviews"
          className="border-t"
          style={{ borderColor: HAIR }}
        >
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Eyebrow label={t.reviews.eyebrow} register={register} reduced={reduced} />
            <h2 className="sr-only">{t.reviews.srHeading}</h2>
            <div className="mt-8 grid items-end gap-10 md:grid-cols-[auto_1fr] md:gap-16">
              <Reveal>
                <p className="flex items-baseline gap-3">
                  <span className="font-erode text-[6rem] leading-none text-[#F4EEE2] md:text-[8rem]">
                    {SCORE.value}
                  </span>
                  <span className="font-mono text-sm uppercase tracking-[0.18em] text-[#B9CBD6]">
                    / 10
                  </span>
                </p>
                <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.2em] text-[#F4EEE2]/70">
                  “{t.reviews.scoreWord}” · {SCORE.count} {t.reviews.reviewsOn}
                </p>
              </Reveal>
              <Reveal delay={100}>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                  {SCORE.categories.map((c) => (
                    <div
                      key={t.scoreCats[c.label as keyof typeof t.scoreCats] ?? c.label}
                      className="border-t pt-3"
                      style={{ borderColor: HAIR }}
                    >
                      <dd
                        className="font-erode text-2xl"
                        style={{ color: ACCENT }}
                      >
                        {c.n}
                      </dd>
                      <dt className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#F4EEE2]/55">
                        {t.scoreCats[c.label as keyof typeof t.scoreCats] ?? c.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <QuoteRotator reduced={reduced} t={t} />
            <Reveal delay={140}>
              <p className="mt-10 text-sm text-[#F4EEE2]/50">
                {t.reviews.srHeading} via{" "}
                <a
                  href={REVIEWS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={`underline underline-offset-4 hover:text-[#F4EEE2]/80 ${FOCUS}`}
                >
                  Booking.com
                </a>
                {t.reviews.sourceNote}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── 9 · PRACTICAL INFO ───────────────────────────────────────── */}
        <section id="info" className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Eyebrow label={t.info.eyebrow} register={register} reduced={reduced} />
            <Reveal delay={60}>
              <h2 className="mt-6 font-erode text-4xl font-medium leading-[1.16] tracking-tight md:text-5xl">
                {t.info.heading}
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
              <div className="space-y-8">
                <Reveal>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/55">
                    {t.info.callFarm}
                  </p>
                  <a
                    href={PHONE_HREF}
                    className={`mt-2 inline-block font-erode text-5xl transition-colors duration-200 hover:text-[#E68C4C] md:text-6xl ${FOCUS}`}
                    style={{ color: ACCENT }}
                  >
                    {PHONE}
                  </a>
                </Reveal>
                <Reveal delay={80}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/55">
                    {t.info.writeToUs}
                  </p>
                  <a
                    href={`mailto:${EMAIL}`}
                    className={`mt-2 inline-flex items-center gap-3 text-xl text-[#F4EEE2]/90 underline-offset-4 hover:underline md:text-2xl ${FOCUS}`}
                  >
                    <Mail
                      className="h-5 w-5 text-[#B9CBD6]"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    {EMAIL}
                  </a>
                </Reveal>
                <Reveal delay={160}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/55">
                    {t.info.address}
                  </p>
                  <p className="mt-2 flex items-start gap-3 text-xl text-[#F4EEE2]/90 md:text-2xl">
                    <MapPin
                      className="mt-1.5 h-5 w-5 shrink-0 text-[#B9CBD6]"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    {ADDRESS}
                  </p>
                </Reveal>
                <Reveal delay={220}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4EEE2]/55">
                    {t.info.onTheProperty}
                  </p>
                  <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                    {FACILITIES.map((f) => {
                      const Icon = FACILITY_ICON[f] ?? Sparkles
                      return (
                        <li key={f} className="flex items-center gap-2.5">
                          <Icon
                            className="h-4 w-4 shrink-0"
                            strokeWidth={1.5}
                            style={{ color: ACCENT }}
                            aria-hidden="true"
                          />
                          <span className="text-[14px] leading-tight text-[#F4EEE2]/80">{t.facilities[f as keyof typeof t.facilities] ?? f}</span>
                        </li>
                      )
                    })}
                  </ul>
                </Reveal>
              </div>
              <div>
                <Reveal delay={100}>
                  <p className="leading-relaxed" style={{ color: BODY }}>
                    {t.info.bookDirect}
                  </p>
                </Reveal>
                <Reveal delay={180}>
                  <ul
                    className="mt-8 space-y-2.5 border-t pt-7"
                    style={{ borderColor: HAIR }}
                  >
                    {DISTANCES.map((d) => (
                      <li
                        key={t.distances[d.key as keyof typeof t.distances] ?? d.label}
                        className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#F4EEE2]/65"
                      >
                        {d.n} · {t.distances[d.key as keyof typeof t.distances] ?? d.label}
                      </li>
                    ))}
                    <li className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#F4EEE2]/65">
                      {t.rules.openAllYear}
                    </li>
                  </ul>
                </Reveal>
                <Reveal delay={240}>
                  <p className="mt-8 text-sm text-[#F4EEE2]/60">
                    {t.footer.company}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10 · FINAL CTA — night ───────────────────────────────────── */}
        <section className="relative flex min-h-[92svh] items-end overflow-hidden">
          <Img
            {...frame(IMG.dusk, "100vw")}
            alt={t.seasons.duskAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#15130F] via-[#15130F]/40 to-transparent"
          />
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-40 text-center md:px-8 md:pb-28">
            <div className="mx-auto w-fit">
              <Eyebrow
                label={t.seasons.duskEyebrow}
                register={register}
                reduced={reduced}
              />
            </div>
            <Reveal delay={60}>
              <h2 className="mx-auto mt-6 max-w-3xl font-erode text-[clamp(2.6rem,6.5vw,4.6rem)] font-medium leading-[1.16] tracking-tight">
                {t.closing.heading}
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-[#F4EEE2]/85">
                {t.closing.body}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <BookLink lang={lang} stay={stay}>{t.closing.heading}</BookLink>
                <a
                  href={PHONE_HREF}
                  className={`inline-flex items-center gap-2 border border-[#F4EEE2]/35 px-6 py-3.5 text-[15px] font-medium transition-colors duration-200 hover:border-[#F4EEE2]/70 ${FOCUS}`}
                >
                  <Phone
                    className="h-4 w-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {PHONE}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Honesty note — required disclosure before the shared footer */}
        <section className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-4xl px-5 py-10 md:px-8">
            <p className="text-xs leading-relaxed text-[#F4EEE2]/60">
              {FOOTNOTE}
            </p>
          </div>
        </section>
      </main>

      {/* Sticky mobile CTA — the booking path stays two taps away, always.
       * Hidden while the full-screen menu is open so it doesn't double up
       * with the overlay's own "Check availability" button at the bottom. */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t md:hidden"
        style={{
          borderColor: HAIR,
          background: "rgba(21,19,15,0.94)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          transform:
            barShown && !menuOpen ? "translateY(0)" : "translateY(110%)",
          transition: reduced ? "none" : `transform 0.5s ${EASE}`,
        }}
      >
        <div className="flex items-stretch gap-3 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          {bookingReady() ? (
            <a
              href={bookingHref({
                lang,
                checkin: stay.checkin,
                checkout: stay.checkout,
                adults: stay.adults,
                children: stay.children,
              })!}
              className={`flex flex-1 items-center justify-center gap-2 bg-[#D97D3D] px-4 py-3 text-[15px] font-semibold text-[#15130F] active:scale-[0.98] ${FOCUS}`}
            >
              {t.cta.check}
              <ArrowUpRight
                className="h-4 w-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
          ) : (
            <span
              className="flex flex-1 items-center justify-center gap-2 border border-dashed px-4 py-3 text-[15px] font-semibold"
              style={{
                borderColor: "rgba(217,125,61,0.55)",
                color: "rgba(217,125,61,0.85)",
              }}
              title={t.booking.placeholder}
            >
              {t.cta.check}
            </span>
          )}
          <a
            href={PHONE_HREF}
            aria-label={`Call Nýpugarðar, ${PHONE}`}
            className={`flex w-14 items-center justify-center border border-[#F4EEE2]/35 ${FOCUS}`}
          >
            <Phone className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>

      <PreviewFooter company={company} />
    </div>
  );
}
