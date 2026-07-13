import { IMG } from './data'

/**
 * Pizzasmiðjan's loading screen - clones flatbakan/eldofninn Loading.tsx byte-for-byte (same
 * gating strategy, same markup), just the slice badge + heating caption swapped to this brand.
 */
const R = 54
const C = 2 * Math.PI * R

export default function PizzasmidjanLoading({ visible = true, progress }: { visible?: boolean; progress?: number }) {
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
        background: '#FFFFFF',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.7rem',
        opacity: visible ? 1 : 0,
        transform: visible || reduce ? 'none' : 'scale(1.06)',
        transformOrigin: '50% 46%',
        pointerEvents: visible ? 'auto' : 'none',
        transition: reduce ? 'opacity .35s ease' : 'opacity .62s ease, transform .72s cubic-bezier(.32,0,.22,1)',
        willChange: 'opacity, transform',
      }}
    >
      <style>{`
        .ps-load-core{position:relative;width:132px;height:132px;display:grid;place-items:center}
        .ps-load-glow{position:absolute;width:170%;height:170%;border-radius:50%;
          background:radial-gradient(circle,rgba(255,214,150,.4),rgba(255,190,110,0) 66%);
          animation:psLoadGlow 2.2s ease-in-out infinite}
        .ps-load-ring{position:absolute;inset:0}
        .ps-load-ring--spin{animation:psLoadSpin 1.05s linear infinite;transform-origin:66px 66px}
        .ps-load-badge{position:relative;width:78px;height:78px;border-radius:50%;background:#1C1712;
          display:grid;place-items:center;box-shadow:0 12px 30px -12px rgba(28,18,8,.65);
          animation:psLoadBadge 2.2s ease-in-out infinite}
        .ps-load-badge img{width:80%;height:80%;object-fit:contain;filter:brightness(0) invert(1)}
        .ps-load-cap{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:.7rem;font-weight:600;
          letter-spacing:.3em;text-transform:uppercase;color:rgba(28,18,8,.6);
          animation:psLoadCap 2.2s ease-in-out infinite}
        @keyframes psLoadGlow{0%,100%{opacity:.5;transform:scale(.95)}50%{opacity:.92;transform:scale(1.05)}}
        @keyframes psLoadBadge{0%,100%{transform:scale(.99)}50%{transform:scale(1.025)}}
        @keyframes psLoadCap{0%,100%{opacity:.5}50%{opacity:.85}}
        @keyframes psLoadSpin{to{transform:rotate(360deg)}}
        @media (prefers-reduced-motion:reduce){
          .ps-load-glow,.ps-load-badge,.ps-load-cap,.ps-load-ring--spin{animation:none}
        }
      `}</style>

      <div className="ps-load-core">
        <div className="ps-load-glow" />
        <svg className={determinate ? 'ps-load-ring' : 'ps-load-ring ps-load-ring--spin'}
          width="132" height="132" viewBox="0 0 132 132">
          <circle cx="66" cy="66" r={R} fill="none" stroke="rgba(28,18,8,.15)" strokeWidth="3" />
          <circle cx="66" cy="66" r={R} fill="none" stroke="#1C1712" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={dashoffset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '66px 66px', transition: 'stroke-dashoffset .4s ease' }} />
        </svg>
        <div className="ps-load-badge"><img src={IMG.logoBadge} alt="" draggable={false} /></div>
      </div>

      <div className="ps-load-cap">Hitum viðarofninn</div>
    </div>
  )
}
