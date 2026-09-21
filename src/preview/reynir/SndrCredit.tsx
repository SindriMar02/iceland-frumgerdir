/**
 * The SNDR Studio signature. Launch-blocking: every route's footer carries it,
 * the wordmark is a link to https://sndrstudio.is, and the credit itself lives
 * in the aria-label — the mark renders as SN✦DR, so the literal string "SNDR"
 * never appears in the page's text and a text search is not a valid check. The
 * anchor is.
 *
 * Structure copied from the shipped markup; only the faces and the palette are
 * this build's own. The shared SndrBadge is not reused here because it loads
 * Projekt Blackbird from public/fonts/, and the standalone Reynir build prunes
 * public/ to the bakery's own folder — the font would 404 on reynirbakari.is.
 * Lusitana is already on the page, and a serif signature suits it better than
 * a borrowed display face anyway.
 */
import { BODY, DISPLAY, EASE, FAINT, GOLD } from './tokens'
import type { Lang } from './data'

const STUDIO_URL = 'https://sndrstudio.is'

const CSS = `
.rb-sndr { display:inline-flex; align-items:baseline; gap:7px; text-decoration:none;
  padding:11px 0; margin:-11px 0; color:${FAINT};
  transition:color .25s ${EASE}; }
.rb-sndr:hover { color:rgba(243,234,211,.86); }
.rb-sndr:focus-visible { outline:1px solid rgba(238,211,170,.5); outline-offset:4px; border-radius:2px; }
.rb-sndr-mark { font-family:${DISPLAY}; font-size:14.5px; letter-spacing:.06em; line-height:1; }
.rb-sndr-star { color:${GOLD}; font-size:.78em; }
.rb-sndr-studio { font-family:${BODY}; font-size:10px; letter-spacing:.2em;
  text-transform:uppercase; opacity:.8; line-height:1; }
`

export function SndrCredit({ lang, className = '' }: { lang: Lang; className?: string }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <a
        className={`rb-sndr ${className}`}
        href={STUDIO_URL}
        target="_blank"
        rel="noopener"
        aria-label={lang === 'is' ? 'Hannað af SNDR Studio' : 'Designed by SNDR Studio'}
        /* a logotype: the 10px STUDIO lockup is exempt from the minimum body
           type size the mobile audit enforces */
        data-logotype
      >
        <span className="rb-sndr-mark" aria-hidden="true">
          SN<span className="rb-sndr-star">✦</span>DR
        </span>
        <span className="rb-sndr-studio" aria-hidden="true">Studio</span>
      </a>
    </>
  )
}
