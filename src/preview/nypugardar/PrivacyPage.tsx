/**
 * Nýpugarðar — the privacy page (/privacy, /is/personuvernd).
 *
 * The information duty of the GDPR (art. 13) and lög nr. 90/2018: who is
 * responsible, what is collected and why, how long it is kept, and where to
 * complain. Every statement about the website itself is checked against the
 * standalone build: no cookies, no browser storage (useLang stores nothing
 * when STANDALONE), no third-party embeds, fonts and map served from the site,
 * and Cloudflare Web Analytics, which is cookieless. If a tracker, an embed or
 * a form is ever added, this page must change in the same commit.
 *
 * The wording is a plain-language draft for the owner to approve; it is not
 * legal advice.
 */
import { Fragment, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { setNoindex } from "../../lib/preview";
import { COPY, type Copy } from "./copy";
import { useLang } from "./useLang";
import { STANDALONE, homePath } from "./paths";
import { EMAIL } from "./data";
import Footer from "./Footer";
import { LangToggle, usePageCss, BODY, HAIR, FOCUS, PAPER } from "./Page";

const LINK = `underline underline-offset-4 hover:text-[#F4EEE2] ${FOCUS}`;

/** Turns the email address and personuvernd.is in a paragraph into links. */
function linked(text: string): ReactNode {
  return text.split(/(nypu@simnet\.is|personuvernd\.is)/).map((part, i) =>
    part === EMAIL ? (
      <a key={i} href={`mailto:${EMAIL}`} className={LINK}>{part}</a>
    ) : part === "personuvernd.is" ? (
      <a key={i} href="https://www.personuvernd.is" target="_blank" rel="noreferrer" className={LINK}>{part}</a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export default function PrivacyPage() {
  const [lang, setLang] = useLang();
  const t: Copy = COPY[lang];
  usePageCss();

  useEffect(() => (STANDALONE ? undefined : setNoindex(true)), []);
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#15130F";
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);
  useEffect(() => {
    document.title = `${t.privacy.title} · Nýpugarðar`;
  }, [t]);

  return (
    <div className="min-h-screen font-familjen antialiased" style={{ background: "#15130F", color: PAPER }}>
      <header className="border-b" style={{ borderColor: HAIR }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
          <Link to={homePath(lang)} className={`-my-2 flex items-baseline gap-3 py-2 ${FOCUS}`}>
            <span aria-hidden="true" className="font-fragment text-[13px]">&larr;</span>
            <span className="font-erode text-xl tracking-tight">Nýpugarðar</span>
          </Link>
          <LangToggle lang={lang} setLang={setLang} t={t} className="-my-3 py-3" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-16 md:px-8 md:pb-32 md:pt-24">
        <div className="max-w-[65ch]">
          <h1 className="font-erode text-4xl font-light leading-[1.1] tracking-tight [text-wrap:balance] md:text-6xl">
            {t.privacy.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: BODY }}>{t.privacy.lead}</p>
          <p className="mt-4 font-fragment text-[11px] uppercase tracking-[0.16em] text-[#B9CBD6]">{t.privacy.updated}</p>

          <div className="mt-14 space-y-10">
            {t.privacy.sections.map((s) => (
              <section key={s.h} className="border-t pt-6" style={{ borderColor: HAIR }}>
                <h2 className="font-erode text-2xl font-light tracking-tight">{s.h}</h2>
                <p className="mt-3 leading-relaxed [text-wrap:pretty]" style={{ color: BODY }}>{linked(s.p)}</p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer t={t} lang={lang} setLang={setLang} />
    </div>
  );
}
