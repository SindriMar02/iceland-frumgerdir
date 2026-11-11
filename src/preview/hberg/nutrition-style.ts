export const NUTRITION_CSS = `
.hb-root .hb-pop:has(.hb-nutrition){width:min(1400px,100%)}
.hb-nutrition{min-width:0}
.hb-nutrition h2{margin:0}
.hb-nutTools{display:flex;gap:1rem;margin:1.5rem 0 1rem}
.hb-nutTools label{display:grid;gap:.4rem;flex:1;min-width:0}
.hb-nutTools input,.hb-nutTools select{font:inherit;font-size:16px;min-height:48px;width:100%;border:1px solid var(--c-lina);border-radius:var(--r);background:var(--c-bg);color:inherit;padding:.6rem .8rem}
.hb-nutTools .hb-nutSort{display:none}
.hb-nutChips{display:flex;flex-wrap:wrap;gap:.4rem}
.hb-nutChips button{min-height:44px;max-width:100%;border:1px solid var(--c-lina);border-radius:999px;background:none;color:inherit;font:inherit;padding:.5rem .9rem;cursor:pointer}
.hb-nutChips button[aria-pressed="true"]{background:var(--c-ink);color:var(--c-bg)}
.hb-nutTable{overflow:auto;max-height:64dvh;border:1px solid var(--c-lina);border-radius:var(--r);isolation:isolate}
.hb-nutTable table{width:100%;border-collapse:separate;border-spacing:0;font-size:.85rem;font-variant-numeric:tabular-nums}
.hb-nutTable th,.hb-nutTable td{padding:.55rem .65rem;box-shadow:inset 0 -1px 0 var(--c-lina);text-align:right;background:var(--c-bg)}
.hb-nutTable tbody tr:nth-child(even)>*{background:color-mix(in srgb,var(--c-el) 35%,var(--c-bg))}
.hb-nutTable thead th{position:sticky;top:0;z-index:2}
.hb-nutTable th:first-child{position:sticky;left:0;z-index:1;min-width:230px;max-width:300px;text-align:left}
.hb-nutTable thead th:first-child{z-index:3}
.hb-nutTable thead button{font:inherit;font-weight:600;min-height:44px;border:0;background:none;color:inherit;white-space:nowrap;padding:0;cursor:pointer}
.hb-nutTable .sorted,.hb-nutTable tbody tr:nth-child(even)>.sorted,.hb-nutCards .sorted{background:color-mix(in srgb,var(--c-gull) 18%,var(--c-bg))}
.hb-nutTable td{white-space:nowrap}
.hb-nutTable small{display:block;color:var(--c-ink-med);font-size:inherit}
.hb-nutProduct{display:flex;align-items:center;gap:.6rem;border:0;background:none;color:inherit;font:inherit;text-align:left;min-height:44px;padding:0;cursor:pointer;font-weight:500;overflow-wrap:anywhere}
.hb-nutThumb{width:44px;height:52px;flex:none;border-radius:8px;display:grid;place-items:center;padding:4px}
.hb-nutThumb img{width:100%;height:100%;object-fit:contain}
.hb-nutAdd .hb-sett{font-size:0;padding:0;min-width:44px;width:44px;min-height:44px;height:44px}
.hb-nutAdd .hb-sett span{font-size:22px}
.hb-nutCards{display:none}
.hb-root .hb-vTafla{max-width:none}
.hb-root .hb-vTafla td{text-align:right;font-variant-numeric:tabular-nums}
.hb-vTafla tr.sub th{padding-left:1.2rem;color:var(--c-ink-med)}
.hb-vTafla tr.sub td{color:var(--c-ink-med)}
.hb-nutCompare{display:inline-flex;align-items:center;min-height:44px;background:none;border:0;padding:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer;margin-bottom:1rem}
@media(max-width:760px){
 .hb-nutTable{display:none}
 .hb-nutTools{flex-direction:column}
 .hb-nutTools .hb-nutSort{display:grid}
 .hb-nutCards{display:grid;gap:.8rem}
 .hb-nutCards article{border:1px solid var(--c-lina);border-radius:var(--r);padding:.8rem;min-width:0}
 .hb-nutCardHead{display:flex;gap:.5rem;align-items:center;justify-content:space-between}
 .hb-nutCardHead .hb-nutProduct{min-width:0}
 .hb-nutCards dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.3rem;margin:.8rem 0 0;font-variant-numeric:tabular-nums}
 .hb-nutCards dl>div{padding:.5rem;border-bottom:1px solid var(--c-lina);min-width:0}
 .hb-nutCards dt{font-size:.8rem;color:var(--c-ink-med)}
 .hb-nutCards dd{margin:.2rem 0 0;font-size:.9rem;overflow-wrap:anywhere}
}
`
