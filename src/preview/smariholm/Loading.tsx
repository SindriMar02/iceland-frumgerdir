/**
 * Loading curtain for the Brynja concept — warm paper ground (this page is LIGHT, unlike
 * the recent dark clones), a ring that fills in rust-red then settles to amber-gold, and a
 * plain inline shield mark (no real Prolan logo worth preserving — it's a generic supplier
 * badge, not Smári Hólm's own identity, so a fresh mark is used instead, same call as the
 * pizza-series clones made for their in-code silhouette logos).
 */
const R = 54
const C = 2 * Math.PI * R

export default function SmariholmLoading({ visible = true, progress }: { visible?: boolean; progress?: number }) {
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
        background: '#F1ECE0',
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
        .sh-load-core{position:relative;width:132px;height:132px;display:grid;place-items:center}
        .sh-load-glow{position:absolute;width:190%;height:190%;border-radius:50%;
          background:radial-gradient(circle,rgba(168,55,27,.14),rgba(168,55,27,0) 66%);
          animation:shLoadGlow 2.2s ease-in-out infinite}
        .sh-load-ring{position:absolute;inset:0}
        .sh-load-ring--spin{animation:shLoadSpin 1.05s linear infinite;transform-origin:66px 66px}
        .sh-load-badge{position:relative;width:60px;height:60px;display:grid;place-items:center;
          animation:shLoadBadge 2.2s ease-in-out infinite}
        .sh-load-cap{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:.7rem;font-weight:700;
          letter-spacing:.32em;text-transform:uppercase;color:rgba(24,20,15,.55);
          animation:shLoadCap 2.2s ease-in-out infinite}
        @keyframes shLoadGlow{0%,100%{opacity:.5;transform:scale(.95)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes shLoadBadge{0%,100%{transform:scale(.98)}50%{transform:scale(1.04)}}
        @keyframes shLoadCap{0%,100%{opacity:.5}50%{opacity:.9}}
        @keyframes shLoadSpin{to{transform:rotate(360deg)}}
        @media (prefers-reduced-motion:reduce){
          .sh-load-glow,.sh-load-badge,.sh-load-cap,.sh-load-ring--spin{animation:none}
        }
      `}</style>

      <div className="sh-load-core">
        <div className="sh-load-glow" />
        <svg className={determinate ? 'sh-load-ring' : 'sh-load-ring sh-load-ring--spin'}
          width="132" height="132" viewBox="0 0 132 132">
          <circle cx="66" cy="66" r={R} fill="none" stroke="rgba(24,20,15,.12)" strokeWidth="3" />
          <circle cx="66" cy="66" r={R} fill="none" stroke="#A8371B" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={dashoffset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '66px 66px', transition: 'stroke-dashoffset .4s ease' }} />
        </svg>
        <div className="sh-load-badge">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M30 4 52 12v16c0 16-9.5 24.6-22 28C17.5 52.6 8 44 8 28V12L30 4Z" fill="#C98A2E" />
            <path d="M30 4 52 12v16c0 16-9.5 24.6-22 28V4Z" fill="#A8371B" fillOpacity=".85" />
          </svg>
        </div>
      </div>

      <div className="sh-load-cap">Brynjum bílinn</div>
    </div>
  )
}
