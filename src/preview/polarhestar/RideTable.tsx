/**
 * Pólar Hestar — the short rides side by side, as a real HTML table.
 *
 * The ride cards are the way to browse; this is the way to compare: how long,
 * when it runs, from what age, what it costs this year and
 * next. A <table> with a caption and scoped headers, so a screen reader reads
 * it cell by cell and a search or answer engine can lift "which ride is
 * longest / cheapest / open in winter" straight out of it. Every cell comes
 * from the same CMS content as the cards, so the two cannot disagree.
 */
import { Link } from 'react-router-dom'
import { stegaClean } from '@sanity/client/stega'
import type { Lang } from './data'
import { useSiteContent } from './sanity'
import { monthsLabel } from './schedule'
import { ridePath } from './paths'

const INK = '#161B3C'
const BODY = '#3D4565'
const SLATE = '#57608A'
const CLAY_TX = '#2160A6'
const PAPER = '#F7FAFC'

const tri = (lang: Lang, is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)
const isk = (n: number, lang: Lang) =>
  lang === 'en'
    ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ISK'
    : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export function RideTable({ lang }: { lang: Lang }) {
  const { SHORT_TOURS, CHILD_DISCOUNT } = useSiteContent()
  const has2027 = SHORT_TOURS.some((t) => t.price2027)
  const caption = tri(lang, 'Stuttu reiðtúrarnir í samanburði', 'The short rides compared', 'Die kurzen Ausritte im Vergleich')
  const head = 'px-4 py-3 text-left align-bottom text-[0.68rem] font-semibold tracking-[0.12em] uppercase'

  return (
    <div>
      <h3 className="font-spectral text-[clamp(1.4rem,1rem+1.3vw,1.9rem)] leading-tight" style={{ color: INK }}>
        {tri(lang, 'Hvaða reiðtúr hentar mér?', 'Which short ride is right for me?', 'Welcher kurze Ausritt passt zu mir?')}
      </h3>
      <p className="mt-2 max-w-2xl font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
        {tri(
          lang,
          'Lengd, árstími, aldur og verð hvers reiðtúrs á einum stað.',
          'Length, season, age and price of every ride in one place.',
          'Dauer, Saison, Alter und Preis jedes Ausritts auf einen Blick.',
        )}
      </p>
      <div
        className="mt-5 overflow-x-auto rounded-2xl border"
        style={{ borderColor: '#1a20521a', background: PAPER }}
        role="region"
        aria-label={caption}
        tabIndex={0}
      >
        <table className="w-full min-w-[46rem] border-collapse font-hanken text-sm" style={{ color: BODY }}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr style={{ color: SLATE }}>
              <th scope="col" className={head}>{tri(lang, 'Reiðtúr', 'Ride', 'Ausritt')}</th>
              <th scope="col" className={head}>{tri(lang, 'Lengd', 'Duration', 'Dauer')}</th>
              <th scope="col" className={head}>{tri(lang, 'Árstími', 'Season', 'Saison')}</th>
              <th scope="col" className={head}>{tri(lang, 'Lágmarksaldur', 'Minimum age', 'Mindestalter')}</th>
              <th scope="col" className={`${head} text-right`}>{tri(lang, 'Verð 2026', 'Price 2026', 'Preis 2026')}</th>
              {has2027 && <th scope="col" className={`${head} text-right`}>{tri(lang, 'Verð 2027', 'Price 2027', 'Preis 2027')}</th>}
            </tr>
          </thead>
          <tbody>
            {SHORT_TOURS.map((t) => (
              <tr key={t.id} className="border-t" style={{ borderColor: '#1a20521a' }}>
                <th scope="row" className="px-4 py-3.5 text-left font-spectral text-base font-normal" style={{ color: INK }}>
                  <Link to={ridePath(t.id, lang)} className="underline-offset-4 hover:underline" style={{ color: CLAY_TX }}>
                    {stegaClean(t.name[lang])}
                  </Link>
                </th>
                {/* meta carries the month window too (sanity.ts); the season has its own column */}
                <td className="px-4 py-3.5 whitespace-nowrap">{stegaClean(t.meta[lang]).split(' · ')[0]}</td>
                <td className="px-4 py-3.5 whitespace-nowrap">{monthsLabel(t.months, lang)}</td>
                <td className="px-4 py-3.5 whitespace-nowrap">{tri(lang, `${t.minAge} ára`, `${t.minAge} years`, `${t.minAge} Jahre`)}</td>
                <td className="px-4 py-3.5 text-right whitespace-nowrap tabular-nums">{isk(t.price, lang)}</td>
                {has2027 && (
                  <td className="px-4 py-3.5 text-right whitespace-nowrap tabular-nums">
                    {t.price2027 ? isk(t.price2027, lang) : tri(lang, 'ekki birt', 'not published', 'noch offen')}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-hanken text-xs" style={{ color: SLATE }}>
        {tri(
          lang,
          `Börn 12 ára og yngri greiða ${isk(CHILD_DISCOUNT, lang)} minna. Verð eru á mann.`,
          `Children 12 and under pay ${isk(CHILD_DISCOUNT, lang)} less. Prices are per person.`,
          `Kinder bis 12 Jahre zahlen ${isk(CHILD_DISCOUNT, lang)} weniger. Preise pro Person.`,
        )}
      </p>
    </div>
  )
}
