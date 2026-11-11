export const BROWSER_CSS = `
.hb-lines,.hb-browser{padding-inline:var(--page-gut,var(--gut));min-width:0}
.hb-lines>h2,.hb-browserHeading h2{margin:0 0 1rem}
.hb-lines>p,.hb-browserHeading>p{margin:0 0 2rem}
.hb-linesGrid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:clamp(.6rem,1.2vw,1.3rem)}
.hb-lineTile{grid-column:span 2;display:flex;flex-direction:column;position:relative;isolation:isolate;min-width:0;padding:0;border:0;border-radius:18px;overflow:hidden;color:#172D4D;text-align:left;cursor:pointer;transition:transform var(--motion-ui) var(--motion-out)}
.hb-lineTile:nth-child(5){grid-column:2/span 2}
.hb-lineTile::before{content:'';position:absolute;inset:0;background:#172D4D;opacity:0;pointer-events:none;z-index:-1;transition:opacity var(--motion-ui) var(--motion-out)}
.hb-lineArt{display:grid;place-items:center;aspect-ratio:1.4;width:100%;padding:1rem}
.hb-lineArt img{width:100%;height:100%;max-height:190px;object-fit:contain;transition:transform var(--motion-ui) var(--motion-out)}
.hb-lineText{display:flex;flex:1;flex-direction:column;gap:.65rem;padding:clamp(.8rem,1.4vw,1.4rem);background:#ffffffb8;width:100%}
.hb-lineCount{font-size:.8rem;font-variant-numeric:tabular-nums}
.hb-lineName{font-family:var(--f-disp);font-size:clamp(1.3rem,1.8vw,2rem);font-weight:700;line-height:1.06;letter-spacing:-.01em;overflow-wrap:anywhere}
.hb-lineDesc{font-size:.9rem;line-height:1.5;padding-bottom:.5rem}
.hb-linePill{display:flex;align-items:center;justify-content:space-between;gap:.4rem;min-height:44px;border:1px solid #172D4D;border-radius:999px;padding:.5rem .85rem;margin-top:auto;font-size:.85rem;font-weight:600}
.hb-browserHeading{max-width:55rem}
.hb-browserEyebrow{display:block;text-transform:uppercase;letter-spacing:.09em;font-size:.8rem;margin-bottom:1rem}
.hb-browserTools{display:grid;grid-template-columns:minmax(0,1fr) minmax(15rem,22rem);gap:1.1rem;align-items:end;border-block:1px solid var(--c-lina);padding-block:1.25rem}
.hb-browserChips,.hb-browserAvoid{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
.hb-browserChips button,.hb-browserAvoid button,.hb-browserSecondary{min-height:44px;border:1px solid var(--c-lina);border-radius:999px;background:transparent;color:inherit;font:inherit;font-size:.9rem;padding:.5rem .9rem;cursor:pointer}
.hb-browserChips button span{font-variant-numeric:tabular-nums;margin-left:.3rem;font-size:.8em}
.hb-browserChips button[aria-pressed=true],.hb-browserAvoid button[aria-pressed=true]{background:var(--c-ink);color:var(--c-bg);border-color:var(--c-ink)}
.hb-browserAvoid{grid-column:1/-1}
.hb-browserAvoid>span{margin-right:.3rem}
.hb-browserSearch{display:grid;gap:.4rem;font-size:.85rem}
.hb-browserSearch input{width:100%;min-width:0;min-height:48px;border:1px solid var(--c-lina);border-radius:8px;background:var(--c-form);color:inherit;font:inherit;font-size:16px;padding:.65rem .85rem}
.hb-browserStatus{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.5rem 1rem;padding-block:1rem}
.hb-browserStatus p{margin:0;font-variant-numeric:tabular-nums}
.hb-browserHint{font-size:.8rem;color:var(--c-ink-med)}
.hb-browserLayout{display:grid;grid-template-columns:minmax(0,1fr) minmax(19rem,.58fr);gap:clamp(1rem,2.5vw,3rem);align-items:start}
.hb-browserGrid{position:relative;display:grid;grid-template-columns:repeat(auto-fill,minmax(9.5rem,1fr));gap:1.25rem .8rem;align-items:stretch;min-width:0}
.hb-browserTile{min-width:0;display:flex;flex-direction:column;gap:.6rem;border:2px solid transparent;border-radius:12px;background:transparent;color:inherit;padding:.35rem;text-align:left;cursor:pointer;content-visibility:auto;contain-intrinsic-size:auto 330px;overflow-wrap:anywhere;transition:transform var(--motion-ui) var(--motion-out)}
.hb-browserTile[aria-selected=true]{border-color:var(--c-ink);background:var(--c-el)}
.hb-browserArt{position:relative;display:block;aspect-ratio:1;width:100%;border-radius:8px;overflow:hidden}
.hb-browserArt img{position:absolute;inset:10%;width:80%;height:80%;object-fit:contain;transition:transform var(--motion-ui) var(--motion-out)}
.hb-browserCheck{position:absolute;top:.5rem;right:.5rem;background:var(--c-ink);color:var(--c-bg);border-radius:50%;width:24px;height:24px;text-align:center;display:none}
.hb-browserTile[aria-selected=true] .hb-browserCheck{display:block}
.hb-browserName{font-weight:600;font-size:.95rem;line-height:1.35}
.hb-browserTile .hb-allergenBadges{display:flex;flex-wrap:wrap;gap:.25rem;font-size:.7rem;line-height:1.4}
.hb-browserTile .hb-allergenBadges>span{padding:.2rem .35rem;gap:.2rem}
.hb-browserTile .hb-allergenBadges svg{width:14px;height:14px;flex:none}
.hb-browserDetail{position:sticky;top:calc(var(--haus-h,70px) + 1rem);min-width:0;padding:1rem;border:1px solid var(--c-lina);border-radius:16px;background:var(--c-el)}
.hb-detailLayers{position:relative}
.hb-detailLayers>div{background:var(--c-el)}
.hb-detailArt{position:relative;aspect-ratio:1.9;border-radius:10px;overflow:hidden}
.hb-detailArt img{position:absolute;inset:6%;height:88%;width:88%;object-fit:contain}
.hb-detailLine{margin:.85rem 0 .4rem;font-size:.8rem}
.hb-browserDetail h3{font:700 clamp(1.4rem,2vw,2.2rem)/1.06 var(--f-disp);letter-spacing:-.01em;margin:0 0 .7rem;overflow-wrap:anywhere}
.hb-browserDetail p{font-size:.85rem;line-height:1.45}
.hb-detailAllergens{font-weight:500}
.hb-detailBasis{margin-bottom:.3rem}
.hb-browserDetail dl{margin:0;font-size:.85rem;font-variant-numeric:tabular-nums}
.hb-browserDetail dl>div{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.5rem;padding:.35rem 0;border-bottom:1px solid var(--c-lina)}
.hb-browserDetail dd{margin:0;text-align:right;overflow-wrap:anywhere}
.hb-browserLink{display:inline-flex;gap:.5rem;align-items:center;min-height:44px;padding:.4rem 0;border:0;background:none;color:inherit;text-decoration:underline;text-underline-offset:4px;cursor:pointer;font:inherit}
.hb-detailActions{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:.5rem}
.hb-detailActions .hb-sett{width:100%;min-height:48px;justify-content:center;font-size:.9rem;background:var(--c-ink);color:var(--c-bg);border-radius:999px}
.hb-browserDisclaimer{font-size:.78rem!important;line-height:1.5;color:var(--c-ink-med)}
@media(hover:hover) and (pointer:fine){
.hb-root .hb-lineTile:hover,.hb-root .hb-browserTile:hover{opacity:1}
.hb-lineTile:hover .hb-lineArt img{transform:translateY(-4px) scale(1.04)}
.hb-lineTile:hover::before{opacity:.08}
.hb-lineTile:hover .hb-linePill{background:#172D4D;color:#fff}
.hb-browserTile:hover .hb-browserArt img{transform:translateY(-3px) scale(1.04)}
}
.hb-root .hb-lineTile:active,.hb-root .hb-browserTile:active{scale:.98;transform:none}
@media(max-width:1199px) and (min-width:992px){.hb-browserGrid{grid-template-columns:repeat(auto-fill,minmax(8.5rem,1fr));gap:.8rem .4rem}.hb-browserLayout{grid-template-columns:minmax(0,1fr) minmax(18rem,.65fr)}}
@media(max-width:991px){
.hb-linesGrid{grid-template-columns:repeat(2,minmax(0,1fr))}
.hb-lineTile,.hb-lineTile:nth-child(5){grid-column:auto}
.hb-lineTile:last-child{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr}
.hb-lineArt{aspect-ratio:1.6}
.hb-lineText{padding:1rem}
.hb-browserLayout{display:block}
.hb-browserGrid{grid-template-columns:repeat(3,minmax(0,1fr))}
.hb-browserTools{grid-template-columns:minmax(0,1fr)}
/* Wrap chips deliberately: all choices stay visible and no discovery rail remains. */
.hb-browserChips{flex-wrap:wrap}
.hb-browserSearch{max-width:100%}
.hb-root .hb-pop.hb-productSheet{top:auto;bottom:0;width:100%;height:92dvh;max-height:92dvh;border-radius:20px 20px 0 0;transform:translateY(100%)}
.hb-root .hb-pop.hb-productSheet.opid{transform:none}
.hb-root .hb-popB.productSheet{display:block}
}
@media(max-width:599px){
.hb-browserGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem .35rem}
.hb-lineName{font-size:1.3rem}
.hb-lineText{padding:.75rem;gap:.5rem}
.hb-lineArt{aspect-ratio:1.1;padding:.7rem}
.hb-lineDesc{font-size:.8rem;line-height:1.45}
.hb-linePill{font-size:.75rem;padding:.5rem .6rem}
.hb-browserChips button,.hb-browserAvoid button{font-size:.8rem;padding:.5rem .7rem}
.hb-browserName{font-size:.85rem}
.hb-browserTile{contain-intrinsic-size:auto 290px}
}
.hb-scrollArrows{display:flex;justify-content:flex-end;align-items:center;gap:.5rem;margin:.5rem 0;font-size:.8rem}
.hb-scrollArrows[hidden]{display:none}
.hb-scrollArrows button{width:44px;height:44px;border:1px solid var(--c-lina);border-radius:50%;background:var(--c-bg);color:inherit;cursor:pointer;font-size:1.2rem}
/* Other data scrollers use wrapping or a visible, sized next item plus edge fades. */
.hb-root .hb-kortin{flex-wrap:wrap;overflow:visible;scroll-snap-type:none}
.hb-root .hb-nutTable,.hb-root .hb-allergenMatrix{overflow-x:auto;scrollbar-width:thin}
@media(max-width:760px){
.hb-root .hb-orderRail{mask-image:linear-gradient(90deg,transparent,#000 12px,#000 calc(100% - 22px),transparent);padding-inline:1rem 2rem;scrollbar-width:thin;scroll-snap-type:x proximity}
.hb-root .hb-orderRail button{max-width:72%;min-width:100px;white-space:normal;flex:0 0 40%;scroll-snap-align:start}
}
@media(prefers-reduced-motion:reduce){
.hb-root .hb-lineTile,.hb-root .hb-lineArt img,.hb-root .hb-lineTile::before,.hb-root .hb-browserTile,.hb-root .hb-browserArt img{transition:none!important;animation:none!important}
.hb-root .hb-lineTile:hover .hb-lineArt img,.hb-root .hb-browserTile:hover .hb-browserArt img{transform:none}
}

/* Claude 11-11: every section lands below the fixed header when jumped to. */
.hb-root section[id]{scroll-margin-top:calc(var(--haus-h,64px) + 1.25rem)}
@media(max-width:991px){.hb-browserTile[aria-selected=true]{border-color:transparent;background:transparent}.hb-browserTile[aria-selected=true] .hb-browserCheck{display:none}}
`
