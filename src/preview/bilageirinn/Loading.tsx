import { LOGO } from './data'

/**
 * Bílageirinn's loading screen. Used two ways, deliberately identical markup:
 *   1. As the route's Suspense fallback (App.tsx), while the page's JS chunk downloads.
 *      No progress is known yet, so the amber line runs a slow ambient sweep instead of filling.
 *   2. As an overlay Page.tsx renders itself from the same instant, fading out only once the
 *      hero photo, logo, and fonts are actually ready — so the reveal lands on an already-painted
 *      page instead of visitors watching the hero image pop in after the loader clears.
 *
 * Deliberately restrained, not a cinematic moment: the wordmark is the whole point, sitting on a
 * dark ground with a quiet amber glow and a low-opacity print of the shop's own "true line" photo
 * behind it (blurred toward the edges into the same near-black as the live page, so it reads as
 * atmosphere, not a second hero). The amber line under the logo is the site's own TrueLine motif,
 * reused here as the progress indicator instead of a generic spinner.
 */
export default function BilageirinnLoading({
  visible = true,
  progress,
  logoSrc = LOGO,
}: {
  visible?: boolean
  progress?: number
  /** Override for previewing a rebrand concept mark; defaults to the real logo. */
  logoSrc?: string
}) {
  const determinate = typeof progress === 'number'
  const p = determinate ? Math.max(0, Math.min(1, progress)) : 0
  const shown = determinate ? Math.max(0.08, p) : null
  const B = import.meta.env.BASE_URL

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#0D0E10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.55s ease',
      }}
    >
      <style>{`
        .bgl-bg{position:absolute;inset:0;background-image:url('${B}preview/bilageirinn/loading-bg.webp');
          background-size:cover;background-position:center;opacity:.28}
        .bgl-vignette{position:absolute;inset:0;
          background:radial-gradient(ellipse at center,rgba(13,14,16,0.25) 0%,rgba(13,14,16,0.82) 62%,#0D0E10 100%)}
        .bgl-glow{position:absolute;width:280px;height:280px;border-radius:50%;
          background:radial-gradient(circle,rgba(232,162,61,0.22),rgba(232,162,61,0) 68%);
          animation:bglGlow 2.6s ease-in-out infinite}
        .bgl-mark{position:relative;height:34px;width:auto;filter:brightness(0) invert(0.96)}
        .bgl-track{position:relative;margin-top:22px;width:120px;height:2px;background:rgba(243,240,234,0.14);overflow:hidden}
        .bgl-fill{position:absolute;inset:0;transform-origin:left;background:#E8A23D}
        .bgl-sweep{animation:bglSweep 1.5s cubic-bezier(0.65,0,0.35,1) infinite}
        @keyframes bglGlow{0%,100%{opacity:.55;transform:scale(.94)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes bglSweep{0%{transform:translateX(-100%)}55%{transform:translateX(100%)}100%{transform:translateX(100%)}}
        @media (prefers-reduced-motion: reduce){
          .bgl-glow{animation:none}
          .bgl-sweep{animation:none;transform:translateX(0);width:40%}
        }
      `}</style>

      <div className="bgl-bg" />
      <div className="bgl-vignette" />
      <div className="bgl-glow" />

      <img src={logoSrc} alt="Bílageirinn" className="bgl-mark" draggable={false} />

      <div className="bgl-track">
        {determinate ? (
          <div className="bgl-fill" style={{ transform: `scaleX(${shown})`, transition: 'transform 0.35s ease' }} />
        ) : (
          <div className="bgl-fill bgl-sweep" style={{ width: '40%' }} />
        )}
      </div>
    </div>
  )
}
