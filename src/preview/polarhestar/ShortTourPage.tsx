/**
 * Pólar Hestar — one short tour (/preview/polarhestar/reidtur/:id).
 *
 * The owners heard (17 Oct 2026) that their short tours are hard to find on
 * Google. On the front page the five rides share one section, so each one now
 * also has its own page: a title and description that say what and where
 * ("1-hour horse riding tour near Akureyri"), the owners' full tour text, the
 * facts, TouristTrip structured data, and a booking button that opens the
 * front-page form with this ride picked. Titles and descriptions come from
 * shortTourText.ts so the standalone build can prerender the same ones.
 */
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { stegaClean } from '@sanity/client/stega'
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { SiteFooter } from './SiteFooter'
import { useLang } from './lang'
import { STANDALONE, bookPath, homePath, linkHref, ridePath } from './paths'
import { setThemeColor } from '../../lib/preview'
import { SiteContentProvider, useSiteContent, altIs } from './sanity'
import { monthsLabel, type Lang } from './schedule'
import { SHORT_TOUR_NOTES, SHORT_TOUR_TEXT, shortTourDescription, shortTourTitle } from './shortTourText'
import { HorseRule } from './Horse'
import { useHead } from './useHead'

const MIST = '#EDF1F7'
const PAPER = '#F7FAFC'
const INK = '#161B3C'
const BODY = '#3D4565'
const CLAY_TX = '#2160A6'
const CLAY_FILL = '#202070'
const SLATE = '#57608A'
const NIGHT = '#111530'
const ICE = '#9BD8F3'

const LOGO = `${import.meta.env.BASE_URL}polarhestar/logo.png`
const LANGS: Lang[] = ['is', 'en', 'de']
const tri = (lang: Lang, is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)
const isk = (n: number, lang: Lang) =>
  lang === 'en'
    ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ISK'
    : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: PAPER, boxShadow: '0 1px 2px rgba(22,27,60,0.05)' }}>
      <p className="font-hanken text-[0.68rem] font-semibold tracking-[0.14em] uppercase" style={{ color: SLATE }}>{label}</p>
      <p className="mt-1 font-hanken text-base font-medium" style={{ color: INK }}>{value}</p>
    </div>
  )
}

function ShortTourInner() {
  const { id = '' } = useParams()
  const { SHORT_TOURS, EMAIL, PHONE_DISPLAY, PHONE_HREF, ADDRESS, MAPS_HREF, CHILD_DISCOUNT } = useSiteContent()
  const [lang, setLang] = useLang()
  const tour = SHORT_TOURS.find((t) => t.id === id)
  const others = SHORT_TOURS.filter((t) => t.id !== id)
  const childPrice = tour ? Math.max(0, tour.price - CHILD_DISCOUNT) : 0
  const name = tour ? stegaClean(tour.name[lang]) : ''
  const title = tour ? shortTourTitle(tour.id, name, lang) : 'Pólar Hestar'
  const description = tour ? shortTourDescription(tour, childPrice, lang) : ''
  const bookHref = bookPath(id, lang)

  useHead(tour ? { title, description } : null, lang)
  useEffect(() => {
    setThemeColor(MIST)
    document.documentElement.lang = lang
  }, [lang])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  // TouristTrip + breadcrumb, so search engines read the ride as a product with a price
  useEffect(() => {
    // the standalone site has these blocks in its static head (seo.ts), built from the same content
    if (STANDALONE || !tour) return
    const url = window.location.origin + window.location.pathname
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.text = JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name,
        description,
        url,
        touristType: tri(lang, 'Hestaferð', 'Horse riding', 'Reiten'),
        inLanguage: lang,
        provider: {
          '@type': 'LocalBusiness',
          name: 'Pólar Hestar',
          telephone: stegaClean(PHONE_DISPLAY),
          email: stegaClean(EMAIL),
          address: { '@type': 'PostalAddress', streetAddress: 'Grýtubakki II', addressLocality: 'Grenivík', postalCode: '616', addressCountry: 'IS' },
        },
        offers: {
          '@type': 'Offer',
          price: tour.price,
          priceCurrency: 'ISK',
          availability: 'https://schema.org/InStock',
          url,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Pólar Hestar', item: window.location.origin + linkHref(homePath(lang)) },
          { '@type': 'ListItem', position: 2, name: tri(lang, 'Stuttar ferðir', 'Short tours', 'Kurze Ausritte'), item: `${window.location.origin}${linkHref(homePath(lang))}#ferdir` },
          { '@type': 'ListItem', position: 3, name, item: url },
        ],
      },
    ])
    document.head.appendChild(el)
    return () => el.remove()
  }, [tour, name, description, lang, EMAIL, PHONE_DISPLAY])

  if (!tour) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-24 font-hanken" style={{ color: BODY }}>
        <p className="font-spectral text-2xl" style={{ color: INK }}>{tri(lang, 'Ferðin fannst ekki.', 'That tour was not found.', 'Diese Tour wurde nicht gefunden.')}</p>
        <Link to={homePath(lang, '#ferdir')} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: CLAY_TX }}>
          <ArrowLeft className="h-4 w-4" /> {tri(lang, 'Allar stuttar ferðir', 'All short tours', 'Alle kurzen Ausritte')}
        </Link>
      </main>
    )
  }

  const text = (SHORT_TOUR_TEXT[tour.id] ?? [tour.blurb]).map((p) => p[lang]).filter(Boolean)
  const facts: Array<[string, string]> = [
    // meta carries the month window too (sanity.ts); the season has its own fact
    [tri(lang, 'Lengd', 'Duration', 'Dauer'), tour.meta[lang].split(' · ')[0]],
    [tri(lang, 'Verð á mann 2026', 'Price per person 2026', 'Preis pro Person 2026'), isk(tour.price, lang)],
    [tri(lang, 'Börn 12 ára og yngri 2026', 'Children 12 and under 2026', 'Kinder bis 12 Jahre 2026'), isk(childPrice, lang)],
    // next year's list, once the farm has published it (Símon, 23 Oct 2026)
    ...(tour.price2027
      ? ([
          [tri(lang, 'Verð á mann 2027', 'Price per person 2027', 'Preis pro Person 2027'), isk(tour.price2027, lang)],
          [tri(lang, 'Börn 12 ára og yngri 2027', 'Children 12 and under 2027', 'Kinder bis 12 Jahre 2027'), isk(Math.max(0, tour.price2027 - CHILD_DISCOUNT), lang)],
        ] as Array<[string, string]>)
      : []),
    [tri(lang, 'Brottfarir', 'Departure times', 'Startzeiten'), tour.times?.length ? tour.times.join(', ') : tri(lang, 'Eftir samkomulagi', 'On request', 'Auf Anfrage')],
    [tri(lang, 'Árstími', 'Season', 'Saison'), monthsLabel(tour.months, lang)],
    [tri(lang, 'Reynsla', 'Riding level', 'Reiterfahrung'), tri(lang, 'Fyrir alla', 'All levels', 'Alle Erfahrungsstufen')],
    [tri(lang, 'Lágmarksaldur', 'Minimum age', 'Mindestalter'), tri(lang, `${tour.minAge} ára`, `${tour.minAge} years`, `${tour.minAge} Jahre`)],
    [tri(lang, 'Lágmarksfjöldi', 'Min. participants', 'Mind. Teilnehmer'), String(tour.minRiders)],
    [tri(lang, 'Hámarksþyngd', 'Weight limit', 'Gewichtslimit'), '95 kg'],
  ]

  return (
    <div lang={lang} style={{ background: MIST, color: BODY }} className="min-h-screen overflow-x-clip font-hanken antialiased">
      <style dangerouslySetInnerHTML={{ __html: `
        .ph-st-rise{animation:phStRise .7s cubic-bezier(.2,.7,.2,1) both}
        @keyframes phStRise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion: reduce){.ph-st-rise{animation:none}}
        @media (hover:hover) and (pointer:fine){.ph-st-card:hover img{transform:scale(1.04)}}
        .ph-st-card img{transition:transform .6s cubic-bezier(.2,.7,.2,1)}
      ` }} />

      <a href="#efni" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ color: INK }}>
        {tri(lang, 'Fara beint í efni', 'Skip to content', 'Zum Inhalt springen')}
      </a>
      <header className="sticky top-0 z-30 border-b backdrop-blur-md" style={{ background: `${MIST}e6`, borderColor: '#161B3C12' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <Link to={homePath(lang)} className="flex shrink-0 items-center gap-2" aria-label={tri(lang, 'Forsíða Pólar Hestar', 'Pólar Hestar home', 'Pólar-Hestar-Startseite')}>
            <img src={LOGO} alt="" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <div role="group" aria-label={tri(lang, 'Tungumál', 'Language', 'Sprache')} className="flex rounded-full border p-[3px] text-[0.72rem] font-semibold" style={{ borderColor: '#1a2a5e22' }}>
              {LANGS.map((code) => (
                <button key={code} type="button" onClick={() => setLang(code)} aria-pressed={lang === code} className="min-h-10 w-11 rounded-full uppercase tracking-[0.1em] transition-colors md:min-h-8 md:w-10" style={lang === code ? { background: INK, color: MIST } : { color: BODY }}>
                  {code}
                </button>
              ))}
            </div>
            <Link to={bookHref} className="hidden rounded-full px-4 py-2 text-sm font-semibold text-white sm:inline-flex" style={{ background: CLAY_FILL }}>
              {tri(lang, 'Bóka reiðtúr', 'Book this ride', 'Ritt buchen')}
            </Link>
          </div>
        </div>
      </header>

      <main id="efni">
        <section className="relative overflow-hidden" style={{ background: NIGHT }}>
          <img
            src={tour.pic.src}
            srcSet={tour.pic.srcSet}
            sizes="100vw"
            alt={altIs(lang, tour.pic.alt) ?? tri(lang, `${tour.name.is} (íslenskir hestar)`, `${tour.name.en} (Icelandic horses)`, `${tour.name.de} (Islandpferde)`)}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: tour.pic.pos }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(13,16,40,.3) 0%, rgba(13,16,40,.2) 35%, rgba(13,16,40,.88) 100%)' }} />
          <div className="relative z-10 mx-auto flex min-h-[72svh] w-full max-w-6xl flex-col justify-end px-5 pb-12 pt-24 md:px-8 md:pb-16">
            <nav aria-label={tri(lang, 'Brauðmolar', 'Breadcrumb', 'Seitenpfad')} className="ph-st-rise mb-6 text-sm text-white/85">
              <Link to={homePath(lang, '#ferdir')} className="inline-flex items-center gap-1.5 font-medium">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {tri(lang, 'Allar stuttar ferðir', 'All short tours', 'Alle kurzen Ausritte')}
              </Link>
            </nav>
            <p className="ph-st-rise text-[0.72rem] font-semibold tracking-[0.2em] uppercase" style={{ color: ICE, animationDelay: '60ms' }}>
              {tri(lang, 'Reiðtúr frá Grýtubakka', 'Horse riding from Grýtubakki', 'Reiten ab Grýtubakki')} · {tour.meta[lang]}
            </p>
            <h1 className="ph-st-rise mt-3 max-w-4xl text-balance font-spectral text-[clamp(2.4rem,1.4rem+4.6vw,4.4rem)] leading-[1.02] text-white" style={{ animationDelay: '120ms' }}>
              {tour.name[lang]}
            </h1>
            <p className="ph-st-rise mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg" style={{ animationDelay: '200ms' }}>
              {tri(
                lang,
                'Reiðtúr á íslenskum hestum við Eyjafjörð, 30 mínútna akstur frá Akureyri.',
                'A ride on Icelandic horses by Eyjafjörður, a 30-minute drive from Akureyri.',
                'Ein Ritt auf Islandpferden am Eyjafjörður, 30 Minuten von Akureyri.',
              )}
            </p>
            <div className="ph-st-rise mt-7 flex flex-wrap items-center gap-3" style={{ animationDelay: '280ms' }}>
              <Link to={bookHref} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold" style={{ background: MIST, color: INK }}>
                {tri(lang, 'Bóka þessa ferð', 'Book this ride', 'Diesen Ritt buchen')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-sm text-white/85">
                {isk(tour.price, lang)} {tri(lang, 'á mann', 'per person', 'pro Person')}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16" aria-label={tri(lang, 'Staðreyndir', 'Facts', 'Fakten')}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {facts.map(([l, v]) => <Fact key={l} label={l} value={v} />)}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 md:px-8 md:pb-24 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14" aria-labelledby="ph-st-about">
          <div>
            <h2 id="ph-st-about" className="font-spectral text-[clamp(1.7rem,1.2rem+1.8vw,2.4rem)] leading-tight" style={{ color: INK }}>
              {tri(lang, 'Um ferðina', 'About the ride', 'Über den Ritt')}
            </h2>
            <div className="mt-5 max-w-[65ch] space-y-4 text-[1.02rem] leading-relaxed" style={{ color: BODY }}>
              {text.map((p, i) => <p key={i}>{p}</p>)}
              {SHORT_TOUR_NOTES.map((n, i) => <p key={`n${i}`} className="text-[0.95rem]" style={{ color: SLATE }}>{n[lang]}</p>)}
            </div>
          </div>
          <aside className="self-start rounded-[24px] p-6 md:p-7 lg:sticky lg:top-24" style={{ background: PAPER, boxShadow: '0 1px 2px rgba(22,27,60,0.05), 0 18px 40px -28px rgba(22,27,60,0.35)' }}>
            <p className="flex items-start gap-3 font-hanken text-base font-semibold" style={{ color: INK }}>
              <Clock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: CLAY_TX }} aria-hidden="true" />
              {tri(lang, 'Mættu 30 mínútum fyrir brottför.', 'Please arrive 30 minutes prior to departure!', 'Bitte seien Sie 30 Minuten vor Beginn des Rittes auf dem Hof.')}
            </p>
            <a href={MAPS_HREF} className="mt-4 flex items-start gap-3 text-sm leading-relaxed" style={{ color: BODY }}>
              <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: CLAY_TX }} aria-hidden="true" />
              <span>
                {ADDRESS}
                <br />
                {tri(lang, 'Vegur 83 í átt að Grenivík', 'Road no 83 direction Grenivík', 'Straße 83 Richtung Grenivík')}
              </span>
            </a>
            <Link to={bookHref} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white" style={{ background: CLAY_FILL }}>
              {tri(lang, 'Bóka þessa ferð', 'Book this ride', 'Diesen Ritt buchen')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-5 space-y-2 border-t pt-5 text-sm" style={{ borderColor: '#161B3C14' }}>
              <a href={PHONE_HREF} className="flex items-center gap-2" style={{ color: INK }}>
                <Phone className="h-4 w-4" style={{ color: CLAY_TX }} aria-hidden="true" /> {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 break-all" style={{ color: INK }}>
                <Mail className="h-4 w-4 shrink-0" style={{ color: CLAY_TX }} aria-hidden="true" /> {EMAIL}
              </a>
            </div>
          </aside>
        </section>

        <section className="border-t px-5 py-14 md:py-20" style={{ borderColor: '#161B3C12', background: PAPER }} aria-labelledby="ph-st-more">
          <div className="mx-auto max-w-6xl md:px-3">
            <h2 id="ph-st-more" className="font-spectral text-[clamp(1.5rem,1.1rem+1.4vw,2rem)] leading-tight" style={{ color: INK }}>
              {tri(lang, 'Fleiri stuttar ferðir', 'More short rides', 'Weitere kurze Ausritte')}
            </h2>
            <ul className="mt-6 grid list-none grid-cols-2 gap-3 p-0 md:gap-4 lg:grid-cols-4">
              {others.map((o) => (
                <li key={o.id}>
                  <Link to={ridePath(o.id, lang)} className="ph-st-card group flex h-full flex-col overflow-hidden rounded-[20px] ring-1 ring-[#161B3C0f]" style={{ background: MIST }}>
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={o.pic.src} srcSet={o.pic.srcSet} sizes="(max-width: 640px) 100vw, 280px" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" style={{ objectPosition: o.pic.pos }} />
                    </div>
                    <div className="flex flex-1 flex-col p-3 md:p-4">
                      <span className="font-hanken text-xs" style={{ color: SLATE }}>{o.meta[lang]} · {isk(o.price, lang)}</span>
                      <span className="mt-1 font-spectral text-base leading-snug md:text-lg" style={{ color: INK }}>{o.name[lang]}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <HorseRule color={INK} line="#161B3C1f" />
            </div>
          </div>
        </section>
      </main>
      {STANDALONE ? <SiteFooter lang={lang} /> : <PreviewFooter company={companyEntry} verifiedContent />}
      {STANDALONE ? null : <PreviewChrome company={companyEntry} />}
    </div>
  )
}

export default function ShortTourPage() {
  return (
    <SiteContentProvider>
      <ShortTourInner />
    </SiteContentProvider>
  )
}
