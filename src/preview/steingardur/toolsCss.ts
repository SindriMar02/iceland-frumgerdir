import { C } from './ui'

/* The form and tool look of the Ægir build, re-coloured (generated from aegir/Tools.tsx, then owned here). */
export const TOOLS_CSS_BASE = `
.stg-tool{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:calc(var(--col) * 2);align-items:start}
@media (max-width:900px){.stg-tool{grid-template-columns:minmax(0,1fr);gap:2.2rem}}
.stg-tool .inp>h3{margin-bottom:1.6rem}
/* on a phone the price panel sits below the inputs, so a slim live total rides
   under the floating header while the inputs are being changed */
.stg-tool .mini{display:none}
@media (max-width:900px){.stg-tool .mini{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;position:sticky;top:calc(3.448vw + 66px);z-index:5;
  margin:0 0 1.2rem;padding:.7em .9em;background:${C.green};color:#fff;border-radius:var(--rad);font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.05em}
  .stg-tool .mini b{font-size:clamp(18px,5vw,22px);font-weight:600;letter-spacing:-.01em;text-transform:none;font-variant-numeric:tabular-nums;white-space:nowrap}}
.stg-tool .out{position:sticky;top:calc(var(--band) / 2 + 3vw);border:1px solid ${C.hairline};border-radius:var(--rad);background:#fff;padding:calc(var(--col) * 1.4)}
.stg-band.white .stg-tool .out{background:${C.paper}}
@media (max-width:900px){.stg-tool .out{position:static}}
.stg-tool .out .stg-label{margin-bottom:.9rem}
.stg-tool .out .shot{aspect-ratio:3 / 2;overflow:hidden;border-radius:var(--rad);margin-bottom:1.1rem;background:#d8d4cf}
.stg-tool .out .shot img{width:100%;height:100%;object-fit:cover}
.stg-tool .sum{display:grid;gap:0;margin-bottom:1rem}
.stg-tool .sum div{display:flex;justify-content:space-between;gap:1rem;padding:.55em 0;border-top:1px solid ${C.hairline};font-size:var(--t-body)}
.stg-tool .sum dd{white-space:nowrap;font-variant-numeric:tabular-nums}
.stg-tool .total{display:flex;flex-direction:column;gap:.3em;padding:.9em 0 .4em;border-top:1px solid ${C.ink}}
.stg-tool .total small{font-size:var(--t-tag);letter-spacing:.04em;opacity:.7}
.stg-tool .fine{font-size:var(--t-tag);line-height:1.5;opacity:.72;margin-top:.7em}
.stg-tool .act{margin-top:1.4rem}
.stg-tool .act .stg-btn{width:100%}

.stg-field{display:block;border:0;margin:0 0 1.6rem;min-width:0}
.stg-field legend,.stg-field .lbl{display:block;font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.7em;padding:0}
.stg-field input[type="date"]{-webkit-appearance:none;appearance:none;min-width:0;max-width:100%;display:block}
.stg-field input[type=text],.stg-field input[type=tel],.stg-field input[type=email],.stg-field input[type="date"],.stg-field select,.stg-field textarea{
  width:100%;font:inherit;font-size:max(16px,var(--t-body));color:${C.ink};background:#fff;border:1px solid rgba(20,23,20,.3);border-radius:var(--rad);
  padding:.8em .9em;min-height:48px;-webkit-appearance:none;appearance:none}
.stg-band.white .stg-field input,.stg-band.white .stg-field select,.stg-band.white .stg-field textarea{background:${C.paper}}
.stg-field select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23141714' stroke-width='1.4'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .9em center;padding-right:2.4em}
.stg-field textarea{resize:vertical;line-height:1.5}
/* an iOS date field with its native look removed is a blank box until a date is
   chosen, so an empty one carries its own words */
.stg-field .datewrap{position:relative;display:block}
.stg-field .datewrap .ph{position:absolute;left:.9em;top:50%;transform:translateY(-50%);pointer-events:none;opacity:.55;font-size:max(16px,var(--t-body))}
.stg-field input:focus-visible,.stg-field select:focus-visible,.stg-field textarea:focus-visible{outline:2px solid ${C.green};outline-offset:2px}
.stg-field [aria-invalid="true"]{border-color:#b3261e}
.stg-field .hint,.stg-tool .hint,.stg-req .hint{font-size:var(--t-tag);line-height:1.5;opacity:.72;margin-top:.7em;max-width:56ch}
.stg-two{display:grid;grid-template-columns:1fr 1fr;gap:var(--col)}
@media (max-width:560px){.stg-two{grid-template-columns:1fr}}
.chips{display:flex;flex-wrap:wrap;gap:.5rem}
.stg-chip{font:inherit;font-size:var(--t-body);font-weight:500;color:${C.ink};background:transparent;border:1px solid rgba(20,23,20,.3);border-radius:var(--rad);
  min-height:44px;padding:.55em 1em;cursor:pointer;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.15;
  transition:background .3s,color .3s,border-color .3s;touch-action:manipulation}
.stg-chip small{font-size:var(--t-tag);opacity:.75;margin-top:.15em}
.stg-chip[aria-pressed="true"]{background:${C.green};border-color:${C.green};color:#fff}
.stg-chip:disabled{opacity:.32;cursor:not-allowed;text-decoration:line-through}
.stg-chip:focus-visible{outline:2px solid ${C.green};outline-offset:2px}
.chips.sizes{margin-top:.7rem}
.stg-tool .veisla{margin-top:.9rem;display:grid;gap:.9rem}
.stg-tool .veisla .row{display:grid;gap:.5rem}
.stg-stepper{display:inline-flex;align-items:center;border:1px solid rgba(20,23,20,.3);border-radius:var(--rad);background:#fff;max-width:100%}
.stg-band.white .stg-stepper{background:${C.paper}}
.stg-stepper button{width:46px;height:46px;display:grid;place-items:center;background:transparent;border:0;color:${C.ink};cursor:pointer;touch-action:manipulation;transition:background .3s,color .3s}
.stg-stepper button:disabled{opacity:.3;cursor:default}
.stg-stepper button:focus-visible{outline:2px solid ${C.green};outline-offset:-2px}
.stg-stepper input{width:4.2ch;min-width:0;text-align:center;font:inherit;font-size:max(16px,var(--t-body));font-variant-numeric:tabular-nums;border:0;background:transparent;color:${C.ink};padding:0;-moz-appearance:textfield;appearance:textfield}
.stg-stepper input::-webkit-outer-spin-button,.stg-stepper input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.stg-stepper input:focus-visible{outline:2px solid ${C.green};outline-offset:0}
.stg-stepper .u{font-size:var(--t-tag);opacity:.65;padding-right:.3em;margin-left:-.2em}
.stg-tool .items{list-style:none;margin-top:.5rem}
.stg-tool .items li{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.9em 0;border-top:1px solid ${C.hairline}}
.stg-tool .items li:first-child{border-top:0}
.stg-tool .items .nm{display:block;font-weight:600}
.stg-tool .items .sub{display:block;font-size:var(--t-tag);opacity:.7;line-height:1.45;margin-top:.15em;max-width:44ch}
@media (max-width:560px){.stg-tool .items li{align-items:flex-start;flex-direction:column;gap:.6rem}}
.stg-check{display:flex;gap:.8em;align-items:flex-start;margin:0 0 1rem;cursor:pointer;min-height:44px}
.stg-check input{width:22px;height:22px;margin-top:.15em;accent-color:${C.green};flex:none}
.stg-check span{font-size:var(--t-body);line-height:1.45}
.stg-loford{list-style:none;display:grid;gap:0;margin:0}
.stg-loford li{border-top:1px solid ${C.hairline};padding:1em 0 1.1em;font-size:var(--t-lead);line-height:1.4}
.stg-loford li:last-child{border-bottom:1px solid ${C.hairline}}

/* before / after */
.stg-ba .ba-tabs{margin-bottom:1.1rem}
.stg-band.dark .stg-chip{color:#fff;border-color:rgba(255,255,255,.45)}
.stg-band.dark .stg-chip[aria-pressed="true"]{background:#fff;color:${C.asphalt};border-color:#fff}
.stg-band.dark .stg-chip:focus-visible{outline-color:#fff}
.stg-ba .stage{position:relative;aspect-ratio:3 / 2;overflow:hidden;border-radius:var(--rad);background:#0f120f;touch-action:pan-y;user-select:none;-webkit-user-select:none}
.stg-ba .stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}
.stg-ba .stage .before{clip-path:inset(0 calc(100% - var(--pos)) 0 0)}
.stg-ba .tag{position:absolute;top:.8rem;z-index:3;font-size:var(--t-tag);font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#fff;background:rgba(26,30,27,.78);padding:.35em .7em;border-radius:var(--rad)}
.stg-ba .tag.l{left:.8rem}.stg-ba .tag.r{right:.8rem}
.stg-ba .bar{position:absolute;top:0;bottom:0;left:var(--pos);width:2px;margin-left:-1px;background:#fff;z-index:2;pointer-events:none}
.stg-ba .bar i{position:absolute;top:50%;left:50%;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:#fff;display:block}
.stg-ba .bar i:before,.stg-ba .bar i:after{content:'';position:absolute;top:50%;width:8px;height:8px;border-top:2px solid ${C.asphalt};border-left:2px solid ${C.asphalt}}
.stg-ba .bar i:before{left:12px;transform:translateY(-50%) rotate(-45deg)}
.stg-ba .bar i:after{right:12px;transform:translateY(-50%) rotate(135deg)}
.stg-ba .stage input[type=range]{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize;z-index:4;-webkit-appearance:none;appearance:none;touch-action:pan-y}
.stg-ba .stage:focus-within .bar i{outline:2px solid #fff;outline-offset:3px}
.stg-ba .cap{font-size:var(--t-tag);opacity:.78;margin-top:.8rem}

/* the request form */
.stg-req .tabs{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:calc(var(--col) * 1.6)}
.stg-req .tabs button{font:inherit;font-size:var(--t-body);font-weight:600;color:#fff;background:transparent;border:1px solid rgba(255,255,255,.45);border-radius:var(--rad);min-height:46px;padding:.6em 1.1em;cursor:pointer;transition:background .3s,color .3s;touch-action:manipulation}
.stg-req .tabs button[aria-selected="true"]{background:#fff;color:${C.asphalt};border-color:#fff}
.stg-req .tabs button:focus-visible{outline:2px solid #fff;outline-offset:3px}
.stg-req .cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:calc(var(--col) * 2);align-items:start}
@media (max-width:900px){.stg-req .cols{grid-template-columns:minmax(0,1fr);gap:1.6rem}}
.stg-req .stg-field legend,.stg-req .stg-field .lbl{opacity:.85}
.stg-req .stg-field input,.stg-req .stg-field select,.stg-req .stg-field textarea{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.4);color:#fff}
.stg-req .stg-field select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23ffffff' stroke-width='1.4'/%3E%3C/svg%3E")}
.stg-req .stg-field select option{color:${C.ink}}
.stg-req .stg-field input::placeholder,.stg-req .stg-field textarea::placeholder{color:rgba(255,255,255,.55)}
.stg-req .stg-field input:focus-visible,.stg-req .stg-field select:focus-visible,.stg-req .stg-field textarea:focus-visible{outline-color:#fff}
.stg-req .recap dl{margin:.9rem 0 .4rem;display:grid}
.stg-req .recap dl div{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.6fr);gap:1rem;padding:.6em 0;border-top:1px solid rgba(255,255,255,.22)}
.stg-req .recap dt{opacity:.7}
.stg-req .recap dd{overflow-wrap:anywhere}
.stg-req .stg-back{font-size:var(--t-label);text-transform:uppercase;letter-spacing:.06em;font-weight:600;text-decoration:underline;text-underline-offset:.25em;display:inline-block;padding:.7em 0;min-height:44px}
.stg-req .acts{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:.6rem}
.stg-req .acts .stg-btn{min-width:0;flex:1 1 14em;text-align:left}
.stg-req .acts button.stg-btn{font-family:inherit}
.stg-req .acts .stg-btn.ghostl{background:transparent;color:#fff;border-color:rgba(255,255,255,.6)}
.stg-req .acts .stg-btn.brand{background:#fff;color:${C.asphalt};border-color:#fff}
.stg-req .acts .stg-btn .lab{padding:1.05em 1.2em 1.1em;padding-right:3.4em}
.stg-req .err{color:#ffb4ab;font-size:var(--t-body);margin:.2rem 0 .6rem}
.stg-req .fine{font-size:var(--t-tag);opacity:.7;margin-top:1.1rem;line-height:1.5;max-width:52ch}
@media (hover:hover) and (pointer:fine){
  .stg-chip:not(:disabled):not([aria-pressed="true"]):hover{background:rgba(46,125,53,.09);border-color:${C.green}}
  .stg-band.dark .stg-chip:not([aria-pressed="true"]):hover{background:rgba(255,255,255,.12)}
  .stg-stepper button:not(:disabled):hover{background:${C.green};color:#fff}
  .stg-req .tabs button[aria-selected="false"]:hover{background:rgba(255,255,255,.12)}
  .stg-req .acts .stg-btn.ghostl:hover{background:#fff;color:${C.asphalt}}
  .stg-req .acts .stg-btn.brand:hover{background:transparent;color:#fff}
}
@media (prefers-reduced-motion:reduce){.stg-ba .bar{transition:none}}
`

