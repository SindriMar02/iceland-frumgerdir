/** True Line's measuring rule is the seam of the opening shutter.
 * Brimborg Page.tsx:465-530 supplies the asset-ready handoff, not the branding. */
export default function BilageirinnLoading({ visible = true, progress = 0 }: { visible?: boolean; progress?: number }) {
  return (
    <div className={`bgl-loader ${visible ? '' : 'bgl-ready'}`} aria-hidden="true">
      <style>{`
        .bgl-loader{position:fixed;inset:0;z-index:100;pointer-events:auto}
        .bgl-ready{pointer-events:none}
        .bgl-half{position:absolute;left:0;right:0;height:50%;background:#0F0D0B;transition:transform 1.15s cubic-bezier(.23,1,.32,1)}
        .bgl-top{top:0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:40px}
        .bgl-bottom{bottom:0}
        .bgl-word{font-family:'Projekt Blackbird','Arial Black',sans-serif;text-transform:uppercase;color:#F3F0EA;font-size:clamp(34px,5.6vw,64px);line-height:1;letter-spacing:.02em;animation:bgl-arrive 1.1s cubic-bezier(.23,1,.32,1) both;transition:opacity .25s}
        .bgl-rule{position:absolute;top:50%;left:50%;width:min(78vw,360px);height:1px;transform:translateX(-50%);background:rgba(243,240,234,.14);transition:opacity .3s}
        .bgl-rule i{position:absolute;inset:0;background:#E8A23D;transform-origin:left;transition:transform .35s ease}
        .bgl-ticks{position:absolute;inset:0;display:flex;justify-content:space-between}
        .bgl-ticks b{width:1px;height:5px;margin-top:5px;background:rgba(243,240,234,.35)}
        .bgl-ready .bgl-top{transform:translateY(-100%)}
        .bgl-ready .bgl-bottom{transform:translateY(100%)}
        .bgl-ready .bgl-rule,.bgl-ready .bgl-word{opacity:0}
        @keyframes bgl-arrive{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @media(prefers-reduced-motion:reduce){.bgl-loader{display:none}}
      `}</style>
      <div className="bgl-half bgl-top"><span className="bgl-word">Bílageirinn</span></div>
      <div className="bgl-half bgl-bottom" />
      <div className="bgl-rule">
        <div className="bgl-ticks">{Array.from({ length: 5 }, (_, i) => <b key={i} />)}</div>
        <i style={{ transform: `scaleX(${Math.max(0.03, Math.min(1, progress))})` }} />
      </div>
    </div>
  )
}
