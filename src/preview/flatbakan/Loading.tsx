import { IMG } from './data'

/**
 * Flatbakan's loading screen. Used two ways, deliberately with zero coordination between them
 * so the handoff is seamless (identical markup):
 *   1. As the route's Suspense fallback (App.tsx), while the page's JS chunk downloads. No
 *      progress is known yet, so the ring runs an indeterminate sweep.
 *   2. As an overlay Page.tsx renders itself, visible from that same instant and fading out only
 *      once Page.tsx confirms EVERYTHING a visitor sees on landing is actually ready - fonts, the
 *      hero pizza + backdrop images, the logo, AND the WebGL grain shader's first painted frame
 *      (see Page.tsx's assetsReady gate). Page passes a real `progress` 0..1, so the ring fills.
 *
 * The visual is built entirely from CSS + the brand's own oven-badge logo - no dependency on the
 * custom webfonts that are themselves still loading (the one text line uses a system font), so it
 * paints instantly. The warm radial pulse behind the dark badge reads as the stone oven heating.
 */
const R = 54
const C = 2 * Math.PI * R

export default function FlatbakanLoading({ visible = true, progress }: { visible?: boolean; progress?: number }) {
  const determinate = typeof progress === 'number'
  const p = determinate ? Math.max(0, Math.min(1, progress)) : 0
  // a minimum visible arc so the ring never looks empty/broken at the very start of a real load
  const shown = determinate ? Math.max(0.06, p) : 0.28
  const dashoffset = C * (1 - shown)

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: '#F19C2C', // exact hero orange - the fade reveals the real hero underneath
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.7rem',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity .5s ease',
      }}
    >
      <style>{`
        .fb-load-core{position:relative;width:132px;height:132px;display:grid;place-items:center}
        .fb-load-glow{position:absolute;width:170%;height:170%;border-radius:50%;
          background:radial-gradient(circle,rgba(255,224,158,.75),rgba(255,180,90,0) 66%);
          filter:blur(7px);animation:fbLoadGlow 2.2s ease-in-out infinite}
        .fb-load-ring{position:absolute;inset:0}
        .fb-load-ring--spin{animation:fbLoadSpin 1.05s linear infinite;transform-origin:66px 66px}
        .fb-load-badge{position:relative;width:78px;height:78px;border-radius:50%;background:#1C1712;
          display:grid;place-items:center;box-shadow:0 12px 30px -12px rgba(28,18,8,.65);
          animation:fbLoadBadge 2.2s ease-in-out infinite}
        .fb-load-badge img{width:80%;height:80%;object-fit:contain;filter:brightness(0) invert(1)}
        .fb-load-cap{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:.7rem;font-weight:600;
          letter-spacing:.3em;text-transform:uppercase;color:rgba(28,18,8,.6);
          animation:fbLoadCap 2.2s ease-in-out infinite}
        @keyframes fbLoadGlow{0%,100%{opacity:.5;transform:scale(.95)}50%{opacity:.92;transform:scale(1.05)}}
        @keyframes fbLoadBadge{0%,100%{transform:scale(.99)}50%{transform:scale(1.025)}}
        @keyframes fbLoadCap{0%,100%{opacity:.5}50%{opacity:.85}}
        @keyframes fbLoadSpin{to{transform:rotate(360deg)}}
        @media (prefers-reduced-motion:reduce){
          .fb-load-glow,.fb-load-badge,.fb-load-cap,.fb-load-ring--spin{animation:none}
        }
      `}</style>

      <div className="fb-load-core">
        <div className="fb-load-glow" />
        <svg className={determinate ? 'fb-load-ring' : 'fb-load-ring fb-load-ring--spin'}
          width="132" height="132" viewBox="0 0 132 132">
          <circle cx="66" cy="66" r={R} fill="none" stroke="rgba(28,18,8,.15)" strokeWidth="3" />
          <circle cx="66" cy="66" r={R} fill="none" stroke="#1C1712" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={dashoffset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '66px 66px', transition: 'stroke-dashoffset .4s ease' }} />
        </svg>
        <div className="fb-load-badge"><img src={IMG.logoBadge} alt="" draggable={false} /></div>
      </div>

      <div className="fb-load-cap">Hitum steinofninn</div>
    </div>
  )
}
