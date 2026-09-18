/**
 * WINTER — /winter, /is/vetur
 *
 * A short page for the half of the year the homepage only glances at. The
 * winter traveller asks a different set of questions than the summer one
 * (how dark, what are the roads doing, can we still reach Jökulsárlón, what
 * happens if we arrive after nine at night), and those answers are worth
 * their own address: they are what someone types into a search box in
 * November, and a section buried in a long homepage cannot rank for them.
 *
 * Hidden but not hidden, as asked: no slot in the main nav, one line in the
 * footer of every page, one link out of the dinner section, and its own
 * entry in the sitemap. Findable by a search engine and by anyone reading
 * the page, not shouted at the summer guest.
 *
 * Composition, not a fork, exactly as RoomsPage does it: every primitive
 * comes from Page.tsx, so the type scale, the reveal timing and the colours
 * cannot drift from the rest of the site. Every fact here is the farm's own
 * or a public Icelandic source; the daylight table is computed from the
 * farm's coordinates (see copy.ts). Nothing claims a specific date is open,
 * because the booking calendar is the only honest answer to that.
 */

import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Phone } from "lucide-react";
import { setNoindex } from "../../lib/preview";
import { COPY, type Copy } from "./copy";
import { useLang } from "./useLang";
import { useReducedMotion } from "framer-motion";
import Footer from "./Footer";
import { IMG, PHONE, PHONE_HREF } from "./data";
import { STANDALONE, homePath, roomsPath } from "./paths";
import {
  Eyebrow, Reveal, ClipImg, MaskHeading, LangToggle,
  usePageCss, HAIR, BODY, ACCENT, FOCUS, PAPER,
} from "./Page";

export default function WinterPage() {
  const [lang, setLang] = useLang();
  const t: Copy = COPY[lang];
  const reduced = useReducedMotion() ?? false;
  usePageCss();
  /* The Eyebrow contract wants a scroll register; this page has no scrubbed
     rule, so it gets one that registers nothing (as on the rooms page). */
  const register = useMemo(() => () => () => {}, []);

  /* Catalogue only: on her own domain this page must be indexed, and the
     standalone SEO injector writes the real robots tag. */
  useEffect(() => (STANDALONE ? undefined : setNoindex(true)), []);
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#15130F";
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);
  useEffect(() => {
    if (STANDALONE) return; /* the app sets the injected title */
    document.title = lang === "is"
      ? "Veturinn á Nýpugörðum · Nýpugarðar"
      : "Winter at Nýpugarðar · Nýpugarðar";
  }, [lang]);

  const w = t.winter;

  return (
    <div className="min-h-screen font-supreme" style={{ background: "#15130F", color: PAPER }}>
      {/* Same skip link the homepage carries: the header has three stops
          before the content starts. */}
      <a
        href="#winter-main"
        className="sr-only z-50 bg-[#D97D3D] px-4 py-3 font-semibold text-[#15130F] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {lang === "is" ? "Beint í efnið" : "Skip to content"}
      </a>

      <header
        className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{ borderColor: HAIR, background: "rgba(21,19,15,0.86)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
          <Link to={homePath(lang)} className={`-my-2 flex items-baseline gap-3 py-2 ${FOCUS}`}>
            <span aria-hidden="true" className="font-mono text-[13px]">&larr;</span>
            <span className="font-erode text-xl tracking-tight">Nýpugarðar</span>
          </Link>
          <div className="flex items-center gap-6">
            <LangToggle lang={lang} setLang={setLang} t={t} />
            <a
              href={PHONE_HREF}
              className={`-my-2 hidden items-center gap-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4EEE2]/70 transition-colors duration-200 hover:text-[#F4EEE2] sm:inline-flex ${FOCUS}`}
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              {PHONE}
            </a>
          </div>
        </div>
      </header>

      <main id="winter-main" className="scroll-mt-16">
        {/* What this page is, and the one photograph that says winter */}
        <section className="mx-auto max-w-6xl px-5 pb-14 pt-16 md:px-8 md:pb-20 md:pt-24">
          <Eyebrow label={w.eyebrow} register={register} reduced={reduced} />
          <MaskHeading
            as="h1"
            text={w.heading}
            className="mt-6 font-erode text-4xl font-medium leading-[1.14] tracking-tight md:text-6xl"
          />
          <Reveal delay={90}>
            <p className="mt-6 max-w-[60ch] text-[1.0625rem] leading-relaxed [text-wrap:pretty]" style={{ color: BODY }}>
              {w.intro}
            </p>
          </Reveal>
          <ClipImg
            photo={IMG.house}
            sizes="(min-width: 768px) min(72rem, 100vw - 4rem), 100vw"
            alt={t.dinner.winterAlt}
            aspect="16 / 9"
            delay={140}
            className="mt-12 md:mt-16"
          />
        </section>

        {/* Daylight: the number every winter guest is actually asking for */}
        <section className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <MaskHeading
              text={w.daylight.heading}
              className="font-erode text-3xl font-medium leading-[1.16] tracking-tight md:text-4xl"
            />
            <Reveal delay={80}>
              <div className="mt-10 overflow-x-auto">
                <table className="w-full min-w-[19rem] border-collapse text-left">
                  <caption className="sr-only">{w.daylight.heading}</caption>
                  <thead>
                    <tr>
                      {[w.daylight.cols.date, w.daylight.cols.rise, w.daylight.cols.set, w.daylight.cols.length].map((c, i) => (
                        <th
                          key={c}
                          scope="col"
                          className={`border-b pb-3 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-[#F4EEE2]/55 ${i === 0 ? "" : "text-right"} ${i === 3 ? "hidden sm:table-cell" : ""}`}
                          style={{ borderColor: HAIR }}
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {w.daylight.rows.map((r) => (
                      <tr key={r.date}>
                        <th
                          scope="row"
                          className="border-b py-4 pr-4 text-left text-[15px] font-normal leading-snug sm:pr-6"
                          style={{ borderColor: HAIR }}
                        >
                          {r.date}
                        </th>
                        <td className="border-b py-4 text-right font-mono text-[13px] tabular-nums text-[#F4EEE2]/75" style={{ borderColor: HAIR }}>
                          {r.rise}
                        </td>
                        <td className="border-b py-4 text-right font-mono text-[13px] tabular-nums text-[#F4EEE2]/75" style={{ borderColor: HAIR }}>
                          {r.set}
                        </td>
                        <td className="hidden border-b py-4 text-right font-mono text-[13px] tabular-nums sm:table-cell" style={{ borderColor: HAIR, color: ACCENT }}>
                          {r.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-[52ch] text-[13px] leading-relaxed text-[#F4EEE2]/50">
                {w.daylight.note}
              </p>
            </Reveal>
          </div>
        </section>

        {/* The questions themselves, open on the page: no accordion to click
            through, and no FAQPage markup (Google dropped it in 2026). */}
        <section className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <dl className="grid gap-x-14 gap-y-8 md:grid-cols-2 md:gap-y-10">
              {w.items.map((item, i) => (
                <Reveal key={item.q} delay={Math.min(i, 3) * 60}>
                  <div className="border-t pt-5" style={{ borderColor: HAIR }}>
                    <dt className="font-erode text-xl font-medium leading-[1.25] tracking-tight">
                      {item.q}
                    </dt>
                    <dd className="mt-3 max-w-[52ch] leading-relaxed [text-wrap:pretty]" style={{ color: BODY }}>
                      {item.a}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* Where to check the road before driving it */}
        <section className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <MaskHeading
              text={w.linksHeading}
              className="font-erode text-2xl font-medium leading-[1.18] tracking-tight md:text-3xl"
            />
            <ul className="mt-8 grid gap-px sm:grid-cols-3" style={{ background: "rgba(244,238,226,0.14)" }}>
              {w.links.map((l, i) => (
                <li key={l.href} className="bg-[#15130F]">
                  <Reveal delay={Math.min(i, 3) * 60}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`group flex h-full flex-col gap-2 p-6 transition-colors duration-200 [@media(hover:hover)]:hover:bg-[#1B1813] md:p-7 ${FOCUS}`}
                    >
                      <span className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
                        {l.label}
                        <ArrowUpRight
                          className="h-3.5 w-3.5 transition-transform duration-200 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:-translate-y-px [@media(hover:hover)]:group-hover:translate-x-0.5"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="text-[15px] leading-snug" style={{ color: BODY }}>{l.note}</span>
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Back into the site: rooms, then the calendar on the homepage */}
        <section className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <MaskHeading
              text={w.ctaHeading}
              className="font-erode text-3xl font-medium leading-[1.16] tracking-tight md:text-4xl"
            />
            <Reveal delay={80}>
              <p className="mt-5 max-w-[52ch] leading-relaxed" style={{ color: BODY }}>
                {w.ctaBody}
              </p>
            </Reveal>
            <Reveal delay={140}>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  to={roomsPath(lang)}
                  className={`inline-flex items-center gap-2 border px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 hover:bg-[#F4EEE2] hover:text-[#15130F] ${FOCUS}`}
                  style={{ borderColor: "rgba(244,238,226,0.45)" }}
                >
                  {t.nav.rooms}
                </Link>
                <Link
                  to={`${homePath(lang)}#book`}
                  className={`-my-2 py-2 font-mono text-[11px] uppercase tracking-[0.16em] underline-offset-4 transition-colors duration-200 hover:underline ${FOCUS}`}
                  style={{ color: ACCENT }}
                >
                  {t.footer.book}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer t={t} lang={lang} setLang={setLang} />
    </div>
  );
}
