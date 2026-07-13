/**
 * SNDR Studio credit mark, shown on EVERY preview prototype's footer
 * (see PreviewFooter). Reuses the real Projekt Blackbird wordmark font
 * from the live sndr-studio site so it reads as the same signature
 * everywhere, not a generic text credit.
 */
const B = import.meta.env.BASE_URL

const CSS = `
@font-face {
  font-family: 'ProjektBlackbirdIS';
  src: url('${B}fonts/blackbird/ProjektBlackbirdIS.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
`

export function SndrBadge({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  const ink = dark ? 'rgba(255,255,255,0.72)' : 'rgba(23,23,23,0.72)'
  const ember = dark ? '#FF8A3D' : '#C4531B'
  return (
    <>
      <style>{CSS}</style>
      <a
        href="https://sndr-studio.pages.dev"
        target="_blank"
        rel="noreferrer"
        aria-label="Hannað af SNDR Studio"
        className={`inline-flex min-h-11 items-center gap-2 ${className}`}
      >
        <span
        style={{ fontFamily: "'ProjektBlackbirdIS', sans-serif", color: ink, fontSize: '15px', letterSpacing: '0.02em' }}
      >
          SN<span style={{ color: ember }}>✦</span>DR
        </span>
        <span
          style={{
            fontFamily: "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace",
            color: ink,
            fontSize: '10.5px',
            letterSpacing: '0.1em',
            opacity: 0.85,
          }}
        >
          STUDIO
        </span>
      </a>
    </>
  )
}
