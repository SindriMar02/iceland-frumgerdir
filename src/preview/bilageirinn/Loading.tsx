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
 *
 * Rebrand-concept preview (logoVideoSrc): the generated draw-in video's own animated wordmark
 * looked bad (a stray glitch letter, a blown-out glow eating half the text) — so it's trimmed to
 * ONLY the clean car-icon draw (ends the instant the headlights finish lighting, before any text
 * appears in the source clip) and the wordmark is set as real HTML type, animated in ourselves
 * right as the video finishes. Crisp, on-brand, no AI-text mush.
 */
export default function BilageirinnLoading({
  visible = true,
  progress,
  logoSrc = LOGO,
  logoVideoSrc,
}: {
  visible?: boolean
  progress?: number
  /** Override for previewing a rebrand concept mark; defaults to the real logo. */
  logoSrc?: string
  /** Optional: a short (~1.8s) muted car-icon draw-in clip to play before the coded wordmark reveal. */
  logoVideoSrc?: string
}) {
  const determinate = typeof progress === 'number'
  const p = determinate ? Math.max(0, Math.min(1, progress)) : 0
  const shown = determinate ? Math.max(0.08, p) : null
  const B = import.meta.env.BASE_URL
  const reduced = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const showVideo = !!logoVideoSrc && !reduced

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
        @font-face { font-family: 'CabinetGrotesk-Black'; src: url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Black.woff2') format('woff2'); font-weight: 900; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }

        .bgl-bg{position:absolute;inset:0;background-image:url('${B}preview/bilageirinn/loading-bg.webp');
          background-size:cover;background-position:center;opacity:.28}
        .bgl-vignette{position:absolute;inset:0;
          background:radial-gradient(ellipse at center,rgba(13,14,16,0.25) 0%,rgba(13,14,16,0.82) 62%,#0D0E10 100%)}
        .bgl-glow{position:absolute;width:280px;height:280px;border-radius:50%;
          background:radial-gradient(circle,rgba(232,162,61,0.22),rgba(232,162,61,0) 68%);
          animation:bglGlow 2.6s ease-in-out infinite}
        .bgl-mark{position:relative;height:34px;width:auto;filter:brightness(0) invert(0.96)}

        .bgl-video{position:relative;height:78px;width:auto;mix-blend-mode:screen}

        .bgl-word{position:relative;margin-top:10px;text-align:center;opacity:0;transform:translateY(10px);
          animation:bglWordIn 0.65s cubic-bezier(0.22,1,0.36,1) forwards;animation-delay:1.75s}
        .bgl-word-tag{position:relative;margin-top:2px;text-align:center;opacity:0;transform:translateY(8px);
          animation:bglWordIn 0.55s cubic-bezier(0.22,1,0.36,1) forwards;animation-delay:1.95s}
        @keyframes bglWordIn{to{opacity:1;transform:translateY(0)}}

        .bgl-track{position:relative;margin-top:22px;width:120px;height:2px;background:rgba(243,240,234,0.14);overflow:hidden}
        .bgl-fill{position:absolute;inset:0;transform-origin:left;background:#E8A23D}
        .bgl-sweep{animation:bglSweep 1.5s cubic-bezier(0.65,0,0.35,1) infinite}
        @keyframes bglGlow{0%,100%{opacity:.55;transform:scale(.94)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes bglSweep{0%{transform:translateX(-100%)}55%{transform:translateX(100%)}100%{transform:translateX(100%)}}
        @media (prefers-reduced-motion: reduce){
          .bgl-glow{animation:none}
          .bgl-sweep{animation:none;transform:translateX(0);width:40%}
          .bgl-word, .bgl-word-tag{animation:none;opacity:1;transform:none}
        }
      `}</style>

      <div className="bgl-bg" />
      <div className="bgl-vignette" />
      <div className="bgl-glow" />

      {showVideo ? (
        <>
          <video className="bgl-video" src={logoVideoSrc} autoPlay muted playsInline disablePictureInPicture />
          <p className="bgl-word" style={{ fontFamily: "'CabinetGrotesk-Black', 'Arial Black', sans-serif", fontWeight: 900, fontSize: '26px', color: '#F3F0EA', letterSpacing: '-0.01em' }}>
            Bílageirinn
          </p>
          <p className="bgl-word-tag" style={{ fontFamily: "'Geist Mono', ui-monospace, monospace", fontWeight: 500, fontSize: '10px', letterSpacing: '0.2em', color: '#A9A399' }}>
            BÍLAÞJÓNUSTA
          </p>
        </>
      ) : (
        <img src={logoSrc} alt="Bílageirinn" className="bgl-mark" draggable={false} />
      )}

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
