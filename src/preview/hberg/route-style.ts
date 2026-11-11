export const ROUTE_CSS = `
@view-transition{navigation:auto}
::view-transition-old(root),::view-transition-new(root){animation-duration:260ms;animation-timing-function:ease-out}
.hb-pageHeader{padding:calc(var(--haus-h,100px) + 4rem) var(--page-gut,var(--gut)) 3rem}
.hb-pageHeader nav{display:flex;gap:.7rem;align-items:center;font-size:.85rem;margin-bottom:2.5rem}
.hb-pageHeader nav a{min-height:44px;display:inline-flex;align-items:center}
.hb-pageHeader h1{font-size:clamp(3rem,6.5vw,6rem);margin:0 0 1.2rem}
.hb-pageHeader p{margin:0;max-width:52ch}
.hb-route-products .hb-browser{padding-block:2.5rem 6rem}
.hb-root .hb-linesCompact{padding-block:0 1.5rem}
.hb-linesCompact>h2,.hb-linesCompact>p{display:none}
.hb-root .hb-linesCompact .hb-linesGrid{grid-template-columns:repeat(7,minmax(0,1fr));gap:.65rem}
.hb-root .hb-linesCompact .hb-lineTile{display:flex;grid-column:auto;grid-template-columns:none;text-decoration:none}
.hb-linesCompact .hb-lineArt{height:112px;aspect-ratio:auto;padding:.7rem}
.hb-linesCompact .hb-lineArt img{max-height:90px}
.hb-linesCompact .hb-lineText{padding:.75rem;gap:.4rem}
.hb-linesCompact .hb-lineName{font-size:clamp(1rem,1.35vw,1.35rem)}
.hb-linesCompact .hb-lineDesc,.hb-linesCompact .hb-linePill{display:none}
.hb-route-nutrition .hb-nutrition{padding:0 var(--page-gut,var(--gut)) 6rem}
.hb-route-nutrition .hb-nutTable{max-height:75dvh}
.hb-route-nutrition .hb-nutAdd .hb-sett{font-size:.75rem;width:auto;min-width:100px;padding:.5rem;white-space:nowrap}
.hb-route-nutrition .hb-nutAdd .hb-sett span{font-size:1rem}
.hb-teaser{padding:clamp(3rem,6vw,6rem) var(--page-gut,var(--gut));min-width:0}
.hb-teaser h2{margin:0 0 1rem;font-size:clamp(2.2rem,4.5vw,4.5rem)}
.hb-teaser>p{margin:0 0 2rem}
.hb-featured{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:1rem}
.hb-featured a{display:flex;flex-direction:column;gap:.8rem;min-width:0;text-decoration:none;font-size:.9rem}
.hb-featured a>span{display:grid;place-items:center;aspect-ratio:1;border-radius:12px;overflow:hidden}
.hb-featured img{width:85%;height:85%;object-fit:contain;transition:transform var(--motion-ui) var(--motion-out)}
.hb-featured b{line-height:1.4;overflow-wrap:anywhere}
.hb-teaserActions{display:flex;flex-wrap:wrap;gap:1rem;margin-top:2rem;align-items:center}
.hb-teaserActions a{min-height:48px;display:inline-flex;align-items:center;justify-content:center;gap:1rem;text-decoration:none}
.hb-root .hb-lineTile{text-decoration:none}
.hb-lineTile::before,.hb-featured a::before{display:none!important}
@media(hover:hover) and (pointer:fine){.hb-featured a:hover img{transform:translateY(-3%) scale(1.04)}}
@media(max-width:1100px){.hb-root .hb-linesCompact .hb-linesGrid{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media(max-width:991px){.hb-featured{grid-template-columns:repeat(4,minmax(0,1fr))}.hb-featured a:nth-child(n+5){display:none}}
@media(max-width:599px){
.hb-pageHeader{padding-top:calc(var(--haus-h,80px) + 2rem);padding-bottom:2rem}
.hb-pageHeader nav{margin-bottom:1.5rem}
.hb-root .hb-linesCompact .hb-linesGrid{grid-template-columns:repeat(2,minmax(0,1fr))}
.hb-root .hb-linesCompact .hb-lineTile{display:flex;flex-direction:row;align-items:center}
.hb-linesCompact .hb-lineArt{width:35%;height:88px;flex:none;padding:.3rem}
.hb-linesCompact .hb-lineText{min-width:0;align-self:stretch;justify-content:center;padding:.5rem}
.hb-linesCompact .hb-lineName{font-size:1rem}.hb-linesCompact .hb-lineCount{font-size:.7rem}
.hb-featured{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem .8rem}
}
@media(prefers-reduced-motion:reduce){
::view-transition-old(root),::view-transition-new(root){animation:none!important}
.hb-featured img{transition:none}.hb-featured a:hover img{transform:none}
}

/* Claude 11-11: subpages are one tight flow; the homepage section gap and the duplicate line row do not apply here. */
.hb-route-products,.hb-route-nutrition,.hb-route-products main,.hb-route-nutrition main{row-gap:0!important}
.hb-route-products .hb-linesCompact{display:none}
.hb-route-products .hb-pageHeader,.hb-route-nutrition .hb-pageHeader{padding-bottom:1.25rem}
.hb-route-products .hb-browser{padding-block:1rem 6rem}
`
