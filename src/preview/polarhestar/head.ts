/**
 * Pólar Hestar — what every route says about itself in the <head>: title,
 * meta description, canonical path. Pure functions, no React, so two callers
 * share one source:
 *
 *   - useHead.ts sets these in the browser (what Google sees after rendering,
 *     and what changes with the language switch), and
 *   - tools/polarhestar-seo.mjs bundles THIS file at build time and writes the
 *     English version into each route's static HTML, because WhatsApp,
 *     Messenger, iMessage and the AI crawlers read raw HTML and never run the
 *     app.
 *
 * Audit of 24 Oct 2026 (_docs/polarhestar-seo-audit-2026-10-24): home,
 * schedule and the four long tours still carried the gallery's Icelandic
 * "website prototypes" description and name-only titles. The five short rides
 * already had their own (shortTourText.ts) and are reused here unchanged.
 *
 * No year in any title or description on purpose: "since 1985" was Símon's
 * request so nothing needs a yearly edit.
 */
import { LONG_TOURS, SHORT_TOURS, type L3, type Lang } from './data'
import { shortTourDescription, shortTourTitle } from './shortTourText'

export interface HeadSpec {
  title: string
  description: string
  /** Path under /preview/polarhestar/, with a trailing slash ('' = home). */
  path: string
}

/** Fields of a long tour that the head needs (the CMS-merged tour has all of them). */
export interface TourFacts {
  id: string
  name: L3
  days: number
  ridingDays: number
  kmMin: number
  kmMax: number
  minAge: number
  priceEur: number
}

const tri = (lang: Lang, is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)
/** 2,750 in English, 2.750 in Icelandic and German. */
const num = (v: number, lang: Lang) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : '.')

const activeTours = () => LONG_TOURS.filter((t) => t.active !== false)

export function homeHead(lang: Lang): HeadSpec {
  const days = activeTours().map((t) => t.days)
  const lo = Math.min(...days)
  const hi = Math.max(...days)
  return {
    path: '',
    title: tri(
      lang,
      'Pólar Hestar · hestaferðir við Eyjafjörð',
      'Pólar Hestar · riding tours in North Iceland',
      'Pólar Hestar · Reittouren in Nordisland',
    ),
    description: tri(
      lang,
      `Hestaferðir á Norðurlandi frá árinu 1985: stuttir reiðtúrar frá einni klukkustund og ${lo}–${hi} daga ferðir frá Grýtubakka við Eyjafjörð, 30 mínútur frá Akureyri.`,
      `Horse riding tours in North Iceland since 1985: short rides from one hour and ${lo}–${hi} day tours from the family farm Grýtubakki, 30 minutes from Akureyri.`,
      `Reittouren in Nordisland seit 1985: kurze Ausritte ab einer Stunde und Touren von ${lo} bis ${hi} Tagen vom Hof Grýtubakki, 30 Minuten von Akureyri.`,
    ),
  }
}

export function scheduleHead(lang: Lang): HeadSpec {
  return {
    path: 'dagskra/',
    title: tri(
      lang,
      'Dagsetningar og laus pláss í hestaferðir | Pólar Hestar',
      'Horse riding tour dates and availability | Pólar Hestar',
      'Termine und Verfügbarkeit der Reittouren | Pólar Hestar',
    ),
    description: tri(
      lang,
      'Brottfarardagar og laus pláss í öllum lengri hestaferðum, ásamt árstíma stuttu reiðtúranna, frá Grýtubakka nálægt Akureyri.',
      'Departure dates and availability for every multi-day horse riding tour, plus the season of each short ride, from Grýtubakki farm near Akureyri.',
      'Abfahrtstermine und Verfügbarkeit aller mehrtägigen Reittouren sowie die Saison der kurzen Ausritte, ab Hof Grýtubakki bei Akureyri.',
    ),
  }
}

export function tourHead(t: TourFacts, lang: Lang): HeadSpec {
  const name = t.name[lang] || t.name.en
  const km = `${t.kmMin}–${t.kmMax}`
  const eur = num(t.priceEur, lang)
  const full = tri(
    lang,
    `${name}: ${t.days} daga hestaferð frá Grýtubakka, ${t.ridingDays} reiðdagar, ${km} km á dag, frá ${t.minAge} ára aldri. ${eur} evrur á mann, gisting og fullt fæði innifalin.`,
    `${name}: ${t.days}-day horse riding tour from Grýtubakki farm, ${t.ridingDays} riding days, ${km} km a day, from age ${t.minAge}. €${eur} per person, lodging and full board included.`,
    `${name}: ${t.days}-tägige Reittour ab Hof Grýtubakki, ${t.ridingDays} Reittage, ${km} km pro Tag, ab ${t.minAge} Jahren. ${eur} € pro Person, Unterkunft und Vollpension inklusive.`,
  )
  // a description longer than ~160 characters is cut in the results: drop the inclusion clause first
  const short = tri(
    lang,
    `${name}: ${t.days} daga hestaferð frá Grýtubakka, ${t.ridingDays} reiðdagar, ${km} km á dag, frá ${t.minAge} ára aldri. ${eur} evrur á mann.`,
    `${name}: ${t.days}-day horse riding tour from Grýtubakki farm, ${t.ridingDays} riding days, ${km} km a day, from age ${t.minAge}. €${eur} per person.`,
    `${name}: ${t.days}-tägige Reittour ab Hof Grýtubakki, ${t.ridingDays} Reittage, ${km} km pro Tag, ab ${t.minAge} Jahren. ${eur} € pro Person.`,
  )
  // a title longer than ~60 characters is cut in the results: drop the brand suffix first (the result shows the site name anyway)
  const titles = [
    tri(lang, `${name}: ${t.days} daga hestaferð | Pólar Hestar`, `${name}: ${t.days}-day riding tour | Pólar Hestar`, `${name}: ${t.days}-tägige Reittour | Pólar Hestar`),
    tri(lang, `${name}: ${t.days} daga hestaferð`, `${name}: ${t.days}-day riding tour`, `${name}: ${t.days}-tägige Reittour`),
    tri(lang, `${name} | Pólar Hestar`, `${name} | Pólar Hestar`, `${name} | Pólar Hestar`),
  ]
  return {
    path: `ferd/${t.id}/`,
    title: titles.find((x) => x.length <= 60) ?? titles[1],
    description: full.length <= 160 ? full : short,
  }
}

/** The short rides keep the title and description they already had (shortTourText.ts). */
export function rideHead(
  t: { id: string; name: L3; minAge: number; price: number },
  childDiscount: number,
  lang: Lang,
): HeadSpec {
  const name = t.name[lang] || t.name.en
  return {
    path: `reidtur/${t.id}/`,
    title: shortTourTitle(t.id, name, lang),
    description: shortTourDescription(t, Math.max(0, t.price - childDiscount), lang),
  }
}

/** Every route the stamp tool writes, in English, from the fallback content in data.ts. */
export function allStaticHeads(childDiscount = 2000): HeadSpec[] {
  return [
    homeHead('en'),
    scheduleHead('en'),
    ...SHORT_TOURS.map((t) => rideHead(t, childDiscount, 'en')),
    ...activeTours().map((t) => tourHead(t, 'en')),
  ]
}
