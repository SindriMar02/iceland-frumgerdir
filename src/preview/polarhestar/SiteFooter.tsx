/**
 * Pólar Hestar — the footer of the client's own site (STANDALONE only).
 *
 * The catalogue preview ends in PreviewFooter ("Prototype: a design concept,
 * not the company's real website") and PreviewChrome; the real site must show
 * neither. This footer carries what a guest and a crawler look for at the
 * bottom of a page: who and where (the same NAP as the schema), how to reach
 * the farm, the other pages, the licence, the two other languages as real
 * links (hreflang, so a crawler can walk from any page to its twin), and the
 * SNDR credit that is a launch gate on every client site.
 */
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, MapPin, Phone, Star } from 'lucide-react'
import { INSTAGRAM, TRIPADVISOR, type Lang } from './data'
import { useSiteContent } from './sanity'
import { LANGS, asset, bookPath, homePath, schedulePath, switchLangPath } from './paths'
import { useLocation } from 'react-router-dom'

const NIGHT = '#111530'
const ICE = '#9BD8F3'

const tri = (lang: Lang, is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)
const LANG_NAMES: Record<Lang, string> = { is: 'Íslenska', en: 'English', de: 'Deutsch' }
const LINK = 'rounded-sm underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9BD8F3]'

export function SiteFooter({ lang }: { lang: Lang }) {
  const { COPY, ADDRESS, EMAIL, PHONE_DISPLAY, PHONE_HREF, MAPS_HREF, FACEBOOK, SHORT_TOURS } = useSiteContent()
  const { pathname } = useLocation()
  const t = COPY[lang]
  const firstRide = SHORT_TOURS[0]?.id

  return (
    <footer lang={lang} className="ph-dark px-5 pt-14 pb-10 font-hanken md:px-8" style={{ background: NIGHT, color: 'rgba(255,255,255,0.72)' }}>
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link to={homePath(lang)} aria-label="Pólar Hestar">
            <img src={asset('polarhestar/logo.png')} alt="Pólar Hestar" width={522} height={294} loading="lazy" className="h-14 w-auto" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            {tri(
              lang,
              'Fjölskyldurekin hestaleiga á Grýtubakka við Eyjafjörð síðan 1985. Stuttir reiðtúrar allt árið og lengri ferðir um Norðurland.',
              'A family-run riding farm at Grýtubakki by Eyjafjörður since 1985. Short rides all year and long tours across North Iceland.',
              'Familiengeführter Reitbetrieb am Hof Grýtubakki am Eyjafjörður seit 1985. Kurze Ausritte ganzjährig und lange Touren durch Nordisland.',
            )}
          </p>
          <address className="mt-5 space-y-2 text-sm not-italic">
            <a href={MAPS_HREF} target="_blank" rel="noreferrer" className={`flex items-start gap-2.5 ${LINK}`}>
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ICE }} aria-hidden="true" />
              <span>{ADDRESS}</span>
            </a>
            <a href={PHONE_HREF} className={`flex items-center gap-2.5 ${LINK}`}>
              <Phone className="h-4 w-4 shrink-0" style={{ color: ICE }} aria-hidden="true" />
              <span className="tabular-nums">{PHONE_DISPLAY}</span>
            </a>
            <a href={`mailto:${EMAIL}`} className={`flex items-center gap-2.5 break-all ${LINK}`}>
              <Mail className="h-4 w-4 shrink-0" style={{ color: ICE }} aria-hidden="true" />
              <span>{EMAIL}</span>
            </a>
          </address>
        </div>

        <nav aria-label={tri(lang, 'Síður', 'Pages', 'Seiten')}>
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase" style={{ color: ICE }}>
            {tri(lang, 'Síður', 'Pages', 'Seiten')}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to={homePath(lang, '#ferdir')} className={LINK}>{tri(lang, 'Stuttar ferðir', 'Short rides', 'Kurze Ausritte')}</Link></li>
            <li><Link to={homePath(lang, '#lengri')} className={LINK}>{tri(lang, 'Lengri ferðir', 'Long tours', 'Lange Touren')}</Link></li>
            <li><Link to={schedulePath(lang)} className={LINK}>{tri(lang, 'Dagskrá og dagsetningar', 'Schedule and dates', 'Termine und Daten')}</Link></li>
            <li><Link to={firstRide ? bookPath(firstRide, lang) : homePath(lang, '#boka')} className={LINK}>{tri(lang, 'Bóka reiðtúr', 'Book a ride', 'Ritt buchen')}</Link></li>
            <li><Link to={homePath(lang, '#gott')} className={LINK}>{tri(lang, 'Gott að vita', 'Good to know', 'Gut zu wissen')}</Link></li>
            <li><Link to={homePath(lang, '#heimsokn')} className={LINK}>{t.nav.visit}</Link></li>
          </ul>
        </nav>

        <div>
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase" style={{ color: ICE }}>
            {tri(lang, 'Tungumál', 'Language', 'Sprache')}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {LANGS.map((code) => (
              <li key={code}>
                <Link
                  to={switchLangPath(pathname, code) ?? homePath(code)}
                  hrefLang={code}
                  lang={code}
                  aria-current={code === lang ? 'true' : undefined}
                  className={`${LINK} ${code === lang ? 'font-semibold text-white' : ''}`}
                >
                  {LANG_NAMES[code]}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-7 text-[0.72rem] font-semibold tracking-[0.16em] uppercase" style={{ color: ICE }}>
            {tri(lang, 'Finndu okkur', 'Find us', 'Folgen Sie uns')}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><a href={FACEBOOK} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 ${LINK}`}><Facebook className="h-4 w-4" aria-hidden="true" /> Facebook</a></li>
            <li><a href={INSTAGRAM} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 ${LINK}`}><Instagram className="h-4 w-4" aria-hidden="true" /> Instagram</a></li>
            <li><a href={TRIPADVISOR} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 ${LINK}`}><Star className="h-4 w-4" aria-hidden="true" /> Tripadvisor</a></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 border-t pt-6 text-xs md:flex-row md:items-center md:justify-between" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
        <p>© Pólar Hestar ehf. · {t.credAuthority}</p>
        <a
          href="https://sndrstudio.is"
          target="_blank"
          rel="noopener"
          aria-label={tri(lang, 'Hannað af SNDR Studio', 'Designed by SNDR Studio', 'Gestaltet von SNDR Studio')}
          data-logotype
          className={`inline-flex min-h-11 items-center gap-2 self-start md:self-auto ${LINK}`}
        >
          <span aria-hidden="true">{tri(lang, 'Hannað af', 'Designed by', 'Gestaltet von')}</span>
          <span aria-hidden="true" className="font-mono text-[13px] tracking-[0.08em] text-white/85">
            SN<i className="not-italic" style={{ color: '#FF8A3D' }}>✦</i>DR
          </span>
          <span aria-hidden="true" className="font-mono text-[10px] tracking-[0.22em]">STUDIO</span>
        </a>
      </div>
    </footer>
  )
}
