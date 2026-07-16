/**
 * Bílageirinn's loading screen. Used two ways, deliberately identical markup:
 *   1. As the route's Suspense fallback (App.tsx), while the page's JS chunk downloads.
 *      No progress is known yet, so the amber line runs a slow ambient sweep instead of filling.
 *   2. As an overlay Page.tsx renders itself from the same instant, fading out only once the
 *      hero photo and fonts are actually ready AND a minimum display time has passed — so it
 *      never flashes invisibly-fast on a quick connection (a real bug found on the first version
 *      of this screen: real assets load fast enough off a CDN that the gate could resolve before
 *      the mark ever painted).
 *
 * The icon is a cropped, background-removed still from a generated draw-in clip (or the video
 * itself, muted, ~1.5s, mix-blend-mode:screen so its black backdrop disappears seamlessly into
 * this screen's own dark ground — no visible box). The wordmark is real HTML type, not the
 * source clip's own baked-in text: the generated text had a broken þ ("Bílapjónusta" instead of
 * "Bílaþjónusta") — a real font with a real Unicode þ sidesteps that category of bug entirely,
 * and reads crisp at any size instead of soft/AI-mushy.
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
        transition: 'opacity 0.5s ease',
      }}
    >
      <style>{`
        @font-face { font-family: 'ClashDisplay-Bold'; src: url('${B}fonts/clash-display/fonts/ClashDisplay-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }

        .bgl-bg{position:absolute;inset:0;background-image:url('${B}preview/bilageirinn/loading-bg.webp');
          background-size:cover;background-position:center;opacity:.28}
        .bgl-vignette{position:absolute;inset:0;
          background:radial-gradient(ellipse at center,rgba(13,14,16,0.25) 0%,rgba(13,14,16,0.82) 62%,#0D0E10 100%)}
        .bgl-glow{position:absolute;width:240px;height:240px;border-radius:50%;
          background:radial-gradient(circle,rgba(232,162,61,0.14),rgba(232,162,61,0) 68%);
          animation:bglGlow 2.4s ease-in-out infinite}

        .bgl-icon-video{position:relative;height:88px;width:auto;mix-blend-mode:screen}
        .bgl-icon-still{position:relative;height:88px;width:auto;filter:brightness(0) invert(0.96)}

        .bgl-word{position:relative;margin-top:14px;text-align:center;opacity:0;transform:translateY(8px);
          animation:bglWordIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards;animation-delay:1.4s}
        .bgl-word-tag{position:relative;margin-top:2px;text-align:center;opacity:0;transform:translateY(6px);
          animation:bglWordIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards;animation-delay:1.55s}
        @keyframes bglWordIn{to{opacity:1;transform:translateY(0)}}

        .bgl-track{position:relative;margin-top:20px;width:110px;height:2px;background:rgba(243,240,234,0.14);overflow:hidden}
        .bgl-fill{position:absolute;inset:0;transform-origin:left;background:#E8A23D}
        .bgl-sweep{animation:bglSweep 1.4s cubic-bezier(0.65,0,0.35,1) infinite}
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

      {reduced ? (
        <img src={`${B}preview/bilageirinn/icon-concept.png`} alt="" className="bgl-icon-still" draggable={false} />
      ) : (
        <video className="bgl-icon-video" src={`${B}preview/bilageirinn/logo-draw.mp4`} autoPlay muted playsInline disablePictureInPicture />
      )}

      <p className="bgl-word" style={{ fontFamily: "'ClashDisplay-Bold', 'Arial Black', sans-serif", fontWeight: 700, fontSize: '25px', color: '#F3F0EA', letterSpacing: '-0.01em' }}>
        Bílageirinn
      </p>
      <p className="bgl-word-tag" style={{ fontFamily: "'Geist Mono', ui-monospace, monospace", fontWeight: 500, fontSize: '10px', letterSpacing: '0.2em', color: '#A9A399' }}>
        BÍLAÞJÓNUSTA
      </p>

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
