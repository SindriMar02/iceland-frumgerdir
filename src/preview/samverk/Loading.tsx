import { IMG } from './data'

/**
 * Loading curtain for the "Ljósbrot" concept — bright paper ground (glass itself is
 * colourless, so the whole page stays light/airy), a ring that fills in the real Samverk
 * brand blue, their real logo shown as-is (no filter needed — it's already blue-on-transparent,
 * reads cleanly on this light ground).
 */
const R = 54
const C = 2 * Math.PI * R

export default function SamverkLoading({ visible = true, progress }: { visible?: boolean; progress?: number }) {
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
        background: '#F7F9FB',
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
        .sv-load-core{position:relative;width:132px;height:132px;display:grid;place-items:center}
        .sv-load-glow{position:absolute;width:190%;height:190%;border-radius:50%;
          background:radial-gradient(circle,rgba(39,99,156,.16),rgba(39,99,156,0) 66%);
          animation:svLoadGlow 2.2s ease-in-out infinite}
        .sv-load-ring{position:absolute;inset:0}
        .sv-load-ring--spin{animation:svLoadSpin 1.05s linear infinite;transform-origin:66px 66px}
        .sv-load-badge{position:relative;width:78px;height:78px;display:grid;place-items:center;
          animation:svLoadBadge 2.2s ease-in-out infinite}
        .sv-load-badge img{width:100%;height:100%;object-fit:contain}
        .sv-load-cap{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:.7rem;font-weight:700;
          letter-spacing:.32em;text-transform:uppercase;color:rgba(16,24,32,.5);
          animation:svLoadCap 2.2s ease-in-out infinite}
        @keyframes svLoadGlow{0%,100%{opacity:.5;transform:scale(.95)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes svLoadBadge{0%,100%{transform:scale(.98)}50%{transform:scale(1.04)}}
        @keyframes svLoadCap{0%,100%{opacity:.5}50%{opacity:.9}}
        @keyframes svLoadSpin{to{transform:rotate(360deg)}}
        @media (prefers-reduced-motion:reduce){
          .sv-load-glow,.sv-load-badge,.sv-load-cap,.sv-load-ring--spin{animation:none}
        }
      `}</style>

      <div className="sv-load-core">
        <div className="sv-load-glow" />
        <svg className={determinate ? 'sv-load-ring' : 'sv-load-ring sv-load-ring--spin'}
          width="132" height="132" viewBox="0 0 132 132">
          <circle cx="66" cy="66" r={R} fill="none" stroke="rgba(16,24,32,.1)" strokeWidth="3" />
          <circle cx="66" cy="66" r={R} fill="none" stroke="#27639C" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={dashoffset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '66px 66px', transition: 'stroke-dashoffset .4s ease' }} />
        </svg>
        <div className="sv-load-badge"><img src={IMG.logo} alt="" draggable={false} /></div>
      </div>

      <div className="sv-load-cap">Slípum glerið</div>
    </div>
  )
}
