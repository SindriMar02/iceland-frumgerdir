/**
 * ROOMS & PHOTOS — /preview/nypugardar/herbergi
 *
 * The homepage used to carry every room band, the cottages and the full
 * gallery in one scroll, which put roughly seven screens of inventory between
 * the dinner story and the reviews. The inventory now lives here, whole, and
 * the homepage keeps a short section that sends people over.
 *
 * Composition, not a fork: every component and constant is imported from
 * Page.tsx and the shared modules, so the two pages cannot drift apart in
 * type or colour. The page has its OWN stay state and its own BookingBar at
 * the top, so every per-room Book link still carries the dates the guest
 * picked here ([[stay.ts]]: one copy of "when are you coming" per page).
 */

import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { setNoindex } from "../../lib/preview";
import { COPY, type Copy } from "./copy";
import { useLang } from "./useLang";
import { useStay } from "./stay";
import { useReducedMotion } from "framer-motion";
import BookingBar from "./BookingBar";
import PRICES from "./prices.json";
import { leadFor, galleryFor } from "./photos";
import { IMG, FEATURED_IDS, PHONE_HREF, CHECK_TIMES, HOUSE_RULES } from "./data";
import { GODO_ROOM_NAMES, GODO_ROOM_NAMES_IS, ROOM_SLEEPS } from "./godo";
import { STANDALONE, homePath } from "./paths";
import {
  Eyebrow, Reveal, ClipImg, MaskHeading, RoomBookLink, BookLink, LangToggle, photoAlt,
  usePageCss, ROOM_ORDER, GALLERY_REST, HAIR, BODY, ACCENT, FOCUS, PAPER,
} from "./Page";

export default function RoomsPage() {
  const [lang, setLang] = useLang();
  const t: Copy = COPY[lang];
  const reduced = useReducedMotion() ?? false;
  const { stay, setStay, today } = useStay();
  usePageCss();
  /* No scroll-driven rule fill on this page; the Eyebrow contract wants a
     register function, so it gets one that registers nothing. */
  const register = useMemo(() => () => () => {}, []);

  /* Catalogue only. On her own domain this page is the inventory and must be
     indexed; the standalone SEO injector writes the real robots tag. */
  useEffect(() => (STANDALONE ? undefined : setNoindex(true)), []);
  useEffect(() => {
    /* Body carries the page ink so Safari's own chrome and the zoom dialog's
     * top layer never flash the shared shell's light background. */
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#15130F";
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);
  useEffect(() => {
    document.title = lang === "is"
      ? "Herbergi og myndir · Nýpugarðar"
      : "Rooms & photos · Nýpugarðar";
  }, [lang]);

  return (
    <div
      className="min-h-screen font-supreme"
      style={{ background: "#15130F", color: PAPER }}
    >
      {/* top bar: the way back, the language, the phone */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{ borderColor: HAIR, background: "rgba(21,19,15,0.86)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
          <Link
            to={homePath(lang)}
            className={`-my-2 flex items-baseline gap-3 py-2 ${FOCUS}`}
          >
            <span aria-hidden="true" className="font-mono text-[13px]">&larr;</span>
            <span className="font-erode text-xl tracking-tight">Nýpugarðar</span>
          </Link>
          <div className="flex items-center gap-6">
            <LangToggle lang={lang} setLang={setLang} t={t} className="-my-3 py-3" />
            <a
              href={PHONE_HREF}
              className={`-my-2 hidden items-center gap-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4EEE2]/70 transition-colors duration-200 hover:text-[#F4EEE2] sm:inline-flex ${FOCUS}`}
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              893 1826
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* the page states its business, then the picker, then everything */}
        <section className="mx-auto max-w-6xl px-5 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24">
          <MaskHeading
            as="h1"
            text={t.rooms.heading}
            className="font-erode text-4xl font-medium leading-[1.14] tracking-tight md:text-6xl"
          />
          <Reveal delay={90}>
            <p className="mt-5 max-w-[56ch] leading-relaxed" style={{ color: BODY }}>
              {t.rooms.body}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-10">
              <BookingBar t={t} lang={lang} stay={stay} onStay={setStay} today={today} />
            </div>
          </Reveal>

          {/* Room index: one chip per type, cheapest first, carrying its from-
            * price — the price scan the old table did well, without the OTA
            * look. Jumps down a list seven bands long. */}
          <Reveal delay={220}>
            <nav aria-label={t.rooms.heading} className="mt-8 flex flex-wrap gap-2.5">
              {ROOM_ORDER.map((k) => {
                const price = (PRICES.rooms as Record<string, { from: number | null }>)[k]?.from
                return (
                  <a
                    key={k}
                    href={`#room-${k}`}
                    className={`inline-flex items-baseline gap-2 border px-3.5 py-3.5 [touch-action:manipulation] font-mono text-[11px] uppercase tracking-[0.12em] text-[#F4EEE2]/75 transition-colors duration-200 hover:border-[#F4EEE2]/45 hover:text-[#F4EEE2] md:py-2.5 ${FOCUS}`}
                    style={{ borderColor: HAIR }}
                  >
                    {t.rooms.short[k]}
                    {typeof price === 'number' ? (
                      <span style={{ color: ACCENT }}>{price}&euro;</span>
                    ) : null}
                  </a>
                )
              })}
            </nav>
          </Reveal>
        </section>

        <section className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-4 md:px-8 md:py-6">
            {/* ── ONE BAND PER ROOM TYPE ────────────────────────────────
              * Was a price TABLE (thumbnail, name, price, Book) sitting above
              * a gallery section that listed every one of these types AGAIN
              * with its own photos and its own Book link. Each room appeared
              * twice, so the page asked the reader to hold seven names in
              * their head across two screens, and the table read like an OTA
              * results list rather than somewhere to sleep.
              *
              * Now each type is stated once, with room to breathe: its own
              * photographs on one side, its name, price and booking on the
              * other, sides alternating so the eye has a rhythm to follow.
              * The gallery below keeps the farm and the landscape, and stops
              * repeating the rooms.
              *
              * No rule of its own up here: the section's border-t already owns
              * this gap, and the measured 144px double-rule void at the top of
              * this page came exactly from stacking a second one under it. */}
            <div>
              {ROOM_ORDER.map((k, idx) => {
                const price = (PRICES.rooms as Record<string, { from: number | null }>)[k]?.from
                const name = lang === 'is' ? GODO_ROOM_NAMES_IS[k] : GODO_ROOM_NAMES[k]
                const lead = leadFor(k)
                /* This type's other photographs, minus the lead and minus
                 * anything already running full-frame higher up the page. */
                const rest = galleryFor(k, FEATURED_IDS).filter((ph) => ph.id !== lead?.id).slice(0, 2)
                const flip = idx % 2 === 1
                return (
                  <div
                    key={k}
                    id={`room-${k}`}
                    className={`grid scroll-mt-14 items-center gap-8 border-b py-12 md:gap-14 md:py-16 ${
                      flip ? 'md:grid-cols-[0.85fr_1.15fr]' : 'md:grid-cols-[1.15fr_0.85fr]'
                    }`}
                    style={{ borderColor: HAIR }}
                  >
                    <div className={flip ? 'md:order-2' : ''}>
                      {lead ? (
                        <ClipImg
                          photo={lead}
                          sizes="(min-width: 768px) 52vw, 92vw"
                          alt={photoAlt(lead, t, lang)}
                          aspect="aspect-[4/3]"
                          zoom
                        />
                      ) : null}
                      {rest.length ? (
                        <div className="mt-3 grid grid-cols-2 gap-3 md:mt-4 md:gap-4">
                          {rest.map((ph, i) => (
                            <ClipImg
                              key={ph.id}
                              photo={ph}
                              sizes="(min-width: 768px) 26vw, 46vw"
                              alt={photoAlt(ph, t, lang)}
                              aspect="aspect-[4/3]"
                              delay={90 + i * 80}
                              zoom
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className={flip ? 'md:order-1' : ''}>
                      <MaskHeading
                        as="h3"
                        text={name}
                        className="font-erode text-2xl font-medium leading-[1.2] tracking-tight md:text-3xl"
                      />
                      <Reveal delay={70}>
                        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4EEE2]/60">
                          {t.price.sleeps} {ROOM_SLEEPS[k]}
                        </p>
                      </Reveal>
                      {typeof price === 'number' ? (
                        <Reveal delay={120}>
                          <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.14em] text-[#F4EEE2]/55">
                            {t.price.from}{' '}
                            <span
                              className="font-erode text-4xl tracking-tight tabular-nums md:text-5xl"
                              style={{ color: ACCENT }}
                            >
                              {price}
                            </span>{' '}
                            &euro; {t.price.perNight}
                          </p>
                        </Reveal>
                      ) : null}
                      <Reveal delay={170}>
                        <div className="mt-6">
                          <RoomBookLink room={k} name={name} stay={stay} lang={lang} t={t} />
                        </div>
                      </Reveal>
                    </div>
                  </div>
                )
              })}
              <p className="mt-8 max-w-[62ch] text-[15px] leading-relaxed text-[#F4EEE2]/60">
                {t.price.pricesNote}
              </p>
            </div>

            {/* Cottages */}
            <div className="mt-20 grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
              <div>
                <MaskHeading
                  as="h3"
                  text={t.rooms.cottagesHeading}
                  className="font-erode text-3xl font-medium leading-[1.16] tracking-tight md:text-4xl"
                />
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
                    <p className="max-w-[36ch] text-[15px] leading-relaxed text-[#F4EEE2]/60">
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
                  zoom
                />
                <ClipImg
                  photo={IMG.cottage2}
                  sizes="(min-width: 768px) 27vw, 44vw"
                  alt={t.rooms.cottage2Alt}
                  aspect="aspect-[3/4]"
                  caption={t.rooms.cottage2Caption}
                  delay={110}
                  zoom
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
                        <dd className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F4EEE2]/60">
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


        <section id="gallery" className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Eyebrow label={t.gallery.eyebrow} register={register} reduced={reduced} />
            <MaskHeading
              delay={60}
              text={t.gallery.heading}
              className="mt-6 font-erode text-4xl font-medium leading-[1.16] tracking-tight md:text-5xl"
            />
            <Reveal delay={90}>
              <p className="mt-5 max-w-[52ch] leading-relaxed" style={{ color: BODY }}>
                {t.gallery.body}
              </p>
            </Reveal>

            {/* The rooms are stated once, up in their own section. This is
              * the farm and the land around it, which is the other half of
              * what a guest is choosing. */}
            {GALLERY_REST.length ? (
              <div className="mt-14 border-t" style={{ borderColor: HAIR }} />
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
                      zoom
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* the way onward: book, or go back */}
        <section className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-14 md:px-8">
            <BookLink lang={lang} stay={stay}>{t.cta.check}</BookLink>
            <Link
              to={homePath(lang)}
              className={`-my-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4EEE2]/60 transition-colors duration-200 hover:text-[#F4EEE2] ${FOCUS}`}
            >
              &larr; {lang === "is" ? "Aftur á forsíðuna" : "Back to the front page"}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
