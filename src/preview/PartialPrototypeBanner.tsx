/**
 * Always-visible marker that a preview page is a PARTIAL concept prototype
 * (only the most important, flaw-fixing sections are built out).
 *
 * Rendered once per page. It is `fixed` + `pointer-events-none`, so it never
 * shifts layout, never intercepts clicks, and needs no coordination with each
 * page's own (often fixed) navigation. Theme-agnostic translucent styling reads
 * on both light and dark grounds.
 */
export function PartialPrototypeBanner({ label = 'Partial prototype' }: { label?: string }) {
  return (
    <div
      role="note"
      aria-label={`${label} — only the most important sections are built out`}
      className="pointer-events-none fixed bottom-3 right-3 z-[9999]"
    >
      <span
        className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium tracking-wide"
        style={{
          background: 'rgba(16,16,18,0.6)',
          color: 'rgba(245,245,245,0.94)',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 18px rgba(0,0,0,0.22)',
        }}
      >
        <span
          aria-hidden
          style={{ width: 6, height: 6, borderRadius: 999, background: '#5ec2c8', display: 'inline-block' }}
        />
        {label} · concept preview
      </span>
    </div>
  )
}
