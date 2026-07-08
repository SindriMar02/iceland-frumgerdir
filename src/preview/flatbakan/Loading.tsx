/**
 * Flatbakan's loading screen. Used two ways, deliberately with zero coordination between them
 * so the handoff is seamless:
 *   1. As the route's Suspense fallback (App.tsx) - shown while the page's JS chunk downloads.
 *      A plain, instant React swap once the chunk resolves.
 *   2. As an overlay rendered by Page.tsx itself, visible from that same instant and fading out
 *      only once Page.tsx's own fonts + hero image are actually ready (see Page.tsx's assetsReady
 *      effect). Because both render the exact same markup, the swap between (1) and (2) is
 *      visually invisible - it just keeps looking like the same screen a little longer.
 * No external assets (no image import, no dependency on the custom webfonts that are themselves
 * still loading) - this has to be free to paint the instant the JS bundle is parsed.
 */
export default function FlatbakanLoading({ visible = true }: { visible?: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: '#F19C2C', // exact hero orange - the fade-out reveals the real hero underneath
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity .6s ease',
      }}
    >
      <style>{`
        @keyframes fbLoadPulse{0%,100%{opacity:.4;transform:scale(.98)}50%{opacity:1;transform:scale(1)}}
        .fb-load-mark{animation:fbLoadPulse 1.7s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.fb-load-mark{animation:none;opacity:1}}
      `}</style>
      <div className="fb-load-mark" style={{
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        fontWeight: 800, fontSize: 'clamp(1.1rem,3.4vw,1.6rem)',
        letterSpacing: '.22em', textTransform: 'uppercase', color: '#1C1712',
      }}>
        Flatbakan
      </div>
    </div>
  )
}
