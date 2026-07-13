import { IMG } from './data'

/**
 * Askur's loading screen — dark variant (their brand is black/white). Same gating strategy as the
 * sibling pages, but the overlay is near-black with their real white wordmark, so the load reads as
 * a dark curtain lifting onto the amber hero rather than a white one.
 */
const R = 54
const C = 2 * Math.PI * R

export default function AskurLoading({ visible = true, progress }: { visible?: boolean; progress?: number }) {
  const determinate = typeof progress === 'number'
  const p = determinate ? Math.max(0, Math.min(1, progress)) : 0
  const shown = determinate ? Math.max(0.06, p) : 0.28
  const dashoffset = C * (1 - shown)
  const reduce = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion:reduce)').matches

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: '#141210',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem',
        opacity: visible ? 1 : 0,
        transform: visible || reduce ? 'none' : 'scale(1.06)',
        transformOrigin: '50% 46%',
        pointerEvents: visible ? 'auto' : 'none',
        transition: reduce ? 'opacity .35s ease' : 'opacity .62s ease, transform .72s cubic-bezier(.32,0,.22,1)',
        willChange: 'opacity, transform',
      }}
    >
      <style>{`
        .ak-load-core{position:relative;width:132px;height:132px;display:grid;place-items:center}
        .ak-load-glow{position:absolute;width:190%;height:190%;border-radius:50%;
          background:radial-gradient(circle,rgba(241,156,44,.32),rgba(241,156,44,0) 66%);
          animation:akLoadGlow 2.2s ease-in-out infinite}
        .ak-load-ring{position:absolute;inset:0}
        .ak-load-ring--spin{animation:akLoadSpin 1.05s linear infinite;transform-origin:66px 66px}
        .ak-load-badge{position:relative;width:74px;height:74px;display:grid;place-items:center;
          animation:akLoadBadge 2.2s ease-in-out infinite}
        .ak-load-badge img{width:100%;height:100%;object-fit:contain}
        .ak-load-cap{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:.7rem;font-weight:600;
          letter-spacing:.34em;text-transform:uppercase;color:rgba(244,238,228,.5);
          animation:akLoadCap 2.2s ease-in-out infinite}
        @keyframes akLoadGlow{0%,100%{opacity:.5;transform:scale(.95)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes akLoadBadge{0%,100%{transform:scale(.99)}50%{transform:scale(1.03)}}
        @keyframes akLoadCap{0%,100%{opacity:.45}50%{opacity:.85}}
        @keyframes akLoadSpin{to{transform:rotate(360deg)}}
        @media (prefers-reduced-motion:reduce){
          .ak-load-glow,.ak-load-badge,.ak-load-cap,.ak-load-ring--spin{animation:none}
        }
      `}</style>

      <div className="ak-load-core">
        <div className="ak-load-glow" />
        <svg className={determinate ? 'ak-load-ring' : 'ak-load-ring ak-load-ring--spin'}
          width="132" height="132" viewBox="0 0 132 132">
          <circle cx="66" cy="66" r={R} fill="none" stroke="rgba(244,238,228,.13)" strokeWidth="3" />
          <circle cx="66" cy="66" r={R} fill="none" stroke="#F19C2C" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={dashoffset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '66px 66px', transition: 'stroke-dashoffset .4s ease' }} />
        </svg>
        <div className="ak-load-badge"><img src={IMG.logo} alt="" draggable={false} /></div>
      </div>

      <div className="ak-load-cap">Kveikjum í ofninum</div>
    </div>
  )
}
