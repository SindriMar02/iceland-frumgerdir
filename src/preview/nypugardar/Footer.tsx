import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Copy, Lang } from './copy'
import { ADDRESS, EMAIL, FACEBOOK_URL, FARM_COORDS, PHONE, PHONE_HREF } from './data'
import { homePath, privacyPath, roomsPath, winterPath } from './paths'
import { LangToggle } from './Page'

/**
 * The site footer, the same on every page: the farm, how to reach it, the
 * pages, and the legal line.
 *
 * WHAT THE LAW WANTS HERE. Iceland's e-commerce act (lög nr. 30/2002, 8. gr.)
 * asks a business website to show its name, address, email, registration
 * (kennitala) and, when registered for VAT, its VSK number. The VSK number is
 * not shown yet because it has not been confirmed with the owner; add it to
 * `t.footer.legal` once it is. The privacy page is linked from every page.
 *
 * The SNDR credit is a launch gate ([[sndr-footer-credit-gate]]): the words
 * plus the wordmark, linking to https://sndrstudio.is, on every page.
 */

const HAIR = 'rgba(244,238,226,0.14)'
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4EEE2]'
const LABEL = 'font-fragment text-[11px] uppercase tracking-[0.16em] text-[#B9CBD6]'
const LINK = `-my-1 inline-block py-1 text-[15px] text-[#F4EEE2]/80 underline-offset-4 transition-colors duration-150 hover:text-[#F4EEE2] hover:underline ${FOCUS}`

const DIRECTIONS_HREF = `https://www.google.com/maps/dir/?api=1&destination=${FARM_COORDS.lat},${FARM_COORDS.lon}`

export default function Footer({
  t,
  lang,
  setLang,
  /** Room under the footer for the phone's sticky booking bar (home page). */
  barSpace = false,
}: {
  t: Copy
  lang: Lang
  setLang: (l: Lang) => void
  barSpace?: boolean
}) {
  const home = homePath(lang)
  const pages = [
    { to: `${home}#farm`, label: t.nav.farm },
    { to: roomsPath(lang), label: t.nav.rooms },
    { to: `${home}#dinner`, label: t.nav.dinner },
    { to: `${home}#info`, label: t.nav.info },
    { to: winterPath(lang), label: t.nav.winter },
    { to: `${home}#book`, label: t.footer.book },
  ]

  return (
    <footer
      className={`border-t bg-[#15130F] font-familjen text-[#F4EEE2] ${barSpace ? 'pb-24 md:pb-0' : ''}`}
      style={{ borderColor: HAIR }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-5 pb-12 pt-14 md:grid-cols-12 md:gap-8 md:px-8 md:pt-20">
        <div className="col-span-2 md:col-span-5">
          <Link to={home} className={`-my-1 inline-block py-1 font-erode text-4xl font-light tracking-tight md:text-5xl ${FOCUS}`}>
            Nýpugarðar
          </Link>
          <p className="mt-4 max-w-[34ch] leading-relaxed text-[#F4EEE2]/70">{t.footer.tagline}</p>
        </div>

        <div className="col-span-1 md:col-span-3">
          <h2 className={LABEL}>{t.footer.visit}</h2>
          <address className="mt-4 not-italic leading-relaxed text-[#F4EEE2]/80 [text-wrap:balance]">{ADDRESS}</address>
          <a href={DIRECTIONS_HREF} target="_blank" rel="noreferrer" className={`group mt-2 inline-flex items-center gap-1.5 ${LINK}`}>
            {t.footer.directions}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-px group-hover:translate-x-px" strokeWidth={1.5} aria-hidden="true" />
          </a>

          <h2 className={`mt-8 md:mt-10 ${LABEL}`}>{t.footer.contact}</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={PHONE_HREF} className={`${LINK} tabular-nums`}>{PHONE}</a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className={`${LINK} break-all`}>{EMAIL}</a>
            </li>
            <li>
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className={`group inline-flex items-center gap-1.5 ${LINK}`}>
                Facebook
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-px group-hover:translate-x-px" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label={t.footer.pages} className="col-span-1 md:col-span-3 md:col-start-10">
          <h2 className={LABEL}>{t.footer.pages}</h2>
          <ul className="mt-4 space-y-2">
            {pages.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className={LINK}>{p.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t" style={{ borderColor: HAIR }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 text-[13px] text-[#F4EEE2]/60 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-x-5 md:gap-y-2">
            <span className="[text-wrap:balance]">{t.footer.legal}</span>
            <div className="flex items-center justify-between gap-5 md:contents">
            <Link to={privacyPath(lang)} className={`-my-2 py-2 underline-offset-4 transition-colors duration-150 hover:text-[#F4EEE2] hover:underline ${FOCUS}`}>
              {t.privacy.title}
            </Link>
            <LangToggle lang={lang} setLang={setLang} t={t} />
            </div>
          </div>

          <a
            href="https://sndrstudio.is"
            target="_blank"
            rel="noopener"
            aria-label={t.footer.credit}
            data-logotype
            className={`sndr group -my-2 inline-flex items-center gap-2.5 self-start py-2 md:self-auto ${FOCUS}`}
          >
            <span aria-hidden="true">{t.footer.designedBy}</span>
            <span aria-hidden="true" className="sndr__mark font-fragment text-[13px] tracking-[0.08em] text-[#F4EEE2]/85 transition-colors duration-150 group-hover:text-[#F4EEE2]">
              SN<i className="not-italic text-[#D97D3D]">✦</i>DR
            </span>
            <span aria-hidden="true" className="sndr__studio font-fragment text-[10px] tracking-[0.22em]">STUDIO</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
