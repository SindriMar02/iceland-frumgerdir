/**
 * Bílageirinn's loading screen — pure code, no media assets. Used two ways,
 * deliberately identical markup:
 *   1. As the route's Suspense fallback (App.tsx), while the page's JS chunk downloads.
 *      No progress is known yet, so the rule runs a slow ambient sweep instead of filling.
 *   2. As an overlay Page.tsx renders itself from the same instant, fading out only once
 *      the hero photo and fonts are actually ready AND a minimum display time has passed.
 *
 * Concept: the shop's measuring rule. The wordmark rises and settles onto one
 * amber line — a hairline rule with graduation ticks — and the line fills to
 * true with the REAL asset progress (an honest meter, not a decorative one).
 * Earlier versions used a generated draw-in video + photo backdrop; both are
 * gone: the video needed per-browser alpha encodes and its icon shipped at
 * 22% of frame height twice, and the photo read as murk under the vignette.
 * Type + one line is the same vocabulary the hero itself opens with.
 */
export default function BilageirinnLoading({
  visible = true,
  progress,
}: {
  visible?: boolean
  progress?: number
}) {
  const determinate = typeof progress === 'number'
  const p = determinate ? Math.max(0, Math.min(1, progress)) : 0
  const shown = determinate ? Math.max(0.08, p) : null
  const B = import.meta.env.BASE_URL
  const reduced = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  /* Two instances render this screen back-to-back (Suspense fallback ->
     Page overlay), and CSS animations restart on the second mount — the
     old video loader replayed its intro because of exactly this. So the
     indeterminate (fallback) instance shows only the calm ground + rule
     sweep, and the icon/wordmark choreography plays ONCE, in the Page
     overlay instance (the only one that passes real progress). */
  const full = determinate

  const TICKS = 21

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#0F0D0B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
      }}
    >
      <style>{`
        @font-face { font-family: 'CabinetGrotesk-Extrabold'; src: url('${B}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Extrabold.woff2') format('woff2'); font-weight: 800; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }

        .bgl-stage{display:flex;flex-direction:column;align-items:center;width:min(84vw,600px)}

        /* the mark materialises behind an amber alignment scan — the same
           scan vocabulary the hero opens with. The icon is revealed by a
           clip wipe whose leading edge the scan bar tracks exactly. */
        .bgl-icon-wrap{position:relative;margin-bottom:clamp(18px,2.6vw,28px)}
        .bgl-icon{display:block;height:clamp(64px,9vw,92px);width:auto;
          clip-path:inset(-8% 100% -8% 0);animation:bglWipe 0.95s cubic-bezier(0.65,0,0.35,1) 0.15s forwards}
        .bgl-scan{position:absolute;top:-14%;bottom:-14%;left:0;width:2px;background:#E8A23D;opacity:0;
          box-shadow:0 0 14px 1px rgba(232,162,61,0.55);
          animation:bglScan 0.95s cubic-bezier(0.65,0,0.35,1) 0.15s forwards}
        @keyframes bglWipe{to{clip-path:inset(-8% 0% -8% 0)}}
        @keyframes bglScan{0%{opacity:0;left:0}12%{opacity:1}88%{opacity:1}100%{opacity:0;left:100%}}

        /* wordmark rises out of a mask, same move as the hero headline */
        .bgl-mask{overflow:hidden;padding:0.14em 0.05em 0.08em}
        .bgl-word{display:block;transform:translateY(118%);animation:bglRise 0.75s cubic-bezier(0.22,1,0.36,1) 0.55s forwards;
          font-family:'CabinetGrotesk-Extrabold','Arial Black',sans-serif;font-weight:800;
          font-size:clamp(38px,6.4vw,64px);letter-spacing:-0.02em;color:#F3F0EA;line-height:1}
        @keyframes bglRise{to{transform:translateY(0)}}

        /* the measuring rule: one hairline, graduation ticks, amber fill */
        .bgl-rule{position:relative;margin-top:clamp(22px,3.4vw,34px);width:100%;height:14px;opacity:0;
          animation:bglIn 0.5s ease 0.95s forwards}
        .bgl-rule-track{position:absolute;left:0;right:0;top:6px;height:2px;background:rgba(243,240,234,0.12)}
        .bgl-rule-fill{position:absolute;left:0;right:0;top:6px;height:2px;background:#E8A23D;transform-origin:left}
        .bgl-rule-sweep{animation:bglSweep 1.4s cubic-bezier(0.65,0,0.35,1) infinite}
        .bgl-ticks{position:absolute;inset:0;display:flex;justify-content:space-between}
        .bgl-tick{width:1px;height:6px;margin-top:8px;background:rgba(243,240,234,0.28)}
        .bgl-tick.bgl-tick-major{height:14px;margin-top:0;background:rgba(243,240,234,0.4)}

        .bgl-tag{margin-top:clamp(16px,2.2vw,22px);opacity:0;animation:bglIn 0.5s ease 1.15s forwards;
          font-family:'Geist Mono',ui-monospace,monospace;font-weight:500;
          font-size:clamp(11px,1.3vw,13px);letter-spacing:0.26em;color:#A9A399;text-align:center}

        /* fallback instance: no intro to wait behind, show the rule at once */
        .bgl-lite .bgl-rule{animation-delay:0.05s}
        .bgl-lite .bgl-tag{animation-delay:0.15s}

        @keyframes bglIn{to{opacity:1}}
        @keyframes bglSweep{0%{transform:scaleX(0);transform-origin:left}
          45%{transform:scaleX(1);transform-origin:left}
          55%{transform:scaleX(1);transform-origin:right}
          100%{transform:scaleX(0);transform-origin:right}}

        @media (prefers-reduced-motion: reduce){
          .bgl-icon{animation:none;clip-path:none}
          .bgl-scan{animation:none;opacity:0}
          .bgl-word{animation:none;transform:none}
          .bgl-rule,.bgl-tag{animation:none;opacity:1}
          .bgl-rule-sweep{animation:none;transform:scaleX(1)}
        }
      `}</style>

      <div className={`bgl-stage${full ? '' : ' bgl-lite'}`}>
        {full && (
          <div className="bgl-icon-wrap">
            <img
              className="bgl-icon"
              src={`${B}preview/bilageirinn/icon-concept.png`}
              alt=""
              draggable={false}
            />
            <span className="bgl-scan" />
          </div>
        )}

        {full && (
          <div className="bgl-mask">
            <span className="bgl-word">Bílageirinn</span>
          </div>
        )}

        <div className="bgl-rule">
          <div className="bgl-ticks">
            {Array.from({ length: TICKS }, (_, i) => (
              <span key={i} className={`bgl-tick${i % 5 === 0 ? ' bgl-tick-major' : ''}`} />
            ))}
          </div>
          <div className="bgl-rule-track" />
          {determinate ? (
            <div
              className="bgl-rule-fill"
              style={{ transform: `scaleX(${reduced ? 1 : shown})`, transition: 'transform 0.35s ease' }}
            />
          ) : (
            <div className="bgl-rule-fill bgl-rule-sweep" />
          )}
        </div>

        <p className="bgl-tag">BÍLAÞJÓNUSTA · GRÓFIN 14A</p>
      </div>
    </div>
  )
}
