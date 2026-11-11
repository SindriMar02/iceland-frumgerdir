export const ORDER_CSS = `
.hb-pokiH{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border:0;background:transparent;cursor:pointer;font:inherit;font-size:.92rem;color:inherit;min-height:44px;min-width:44px;padding:0 .2rem}
.hb-pokiH b{display:inline-grid;place-items:center;min-width:1.55rem;height:1.55rem;padding:0 .35rem;border-radius:999px;background:var(--c-gull);color:#172D4D;font-size:.8rem;font-weight:700;font-variant-numeric:tabular-nums}
.hb-sett{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;border:0;cursor:pointer;font:inherit;font-size:.88rem;font-weight:500;min-height:44px;padding:.45rem .95rem;background:var(--c-ink);color:var(--c-bg);border-radius:999px;transition:none}
.hb-sett.komid{background:var(--c-rautt)}
.hb-pokiBak{position:fixed;inset:0;z-index:80;background:rgba(16,32,56,.42);opacity:0;visibility:hidden;transition:opacity var(--motion-ui) var(--motion-out),visibility 0s var(--motion-ui);pointer-events:none}
.hb-pokiBak.on{opacity:1;visibility:visible;pointer-events:auto;transition-delay:0s}
.hb-order{position:fixed;inset:0;top:var(--order-top,0px);height:var(--order-height,100dvh);z-index:81;max-width:1440px;margin-inline:auto;display:flex;flex-direction:column;background:var(--c-bg);color:var(--c-ink);opacity:0;transform:translateY(20px);visibility:hidden;transition:opacity var(--motion-ui) var(--motion-out),transform var(--motion-ui) var(--motion-out),visibility 0s var(--motion-ui);overscroll-behavior:contain;isolation:isolate}
.hb-order.on{opacity:1;transform:none;visibility:visible;transition-delay:0s}
.hb-order button,.hb-order input,.hb-order textarea,.hb-order select{font-family:inherit;font-size:16px;color:inherit}
.hb-order button{cursor:pointer;touch-action:manipulation;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}.hb-order button:active{background:color-mix(in srgb,var(--c-ink) 8%,transparent)}.hb-order .hb-hnappur:active{background:var(--c-rautt)}
.hb-order button:disabled{opacity:.45;cursor:default}
.hb-order .hb-hnappur{color:var(--c-btn-t)}
.hb-unit{display:flex;gap:2px;padding:3px;min-height:44px;box-sizing:border-box;border:1px solid var(--c-lina);border-radius:8px;background:var(--c-form)}
.hb-order .hb-unit button{min-height:44px;flex:1;border:0;border-radius:5px;background:transparent;padding:0 .75rem;font-size:15px;color:color-mix(in srgb,var(--c-ink) 70%,transparent);transition:none}
.hb-order .hb-unit button[aria-checked=true]{background:var(--c-ink);color:var(--c-bg)}
.hb-orderLines .hb-unit{flex:1;min-width:0}.hb-order .hb-orderLines .hb-unit button{padding:0 .35rem;min-width:0}
@media (prefers-reduced-motion:reduce){.hb-order .hb-unit button{transition:none}}
.hb-orderHead{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:calc(1rem + env(safe-area-inset-top)) 1.5rem 1rem;border-bottom:1px solid var(--c-lina);flex:none}
.hb-orderEyebrow{font-size:.8rem;color:var(--c-ink-med)}
.hb-orderHead h2{font-family:var(--f-disp);font-size:clamp(1.7rem,3vw,2.7rem);letter-spacing:-.01em;font-weight:800;line-height:1.1;margin:.15rem 0 0;overflow-wrap:anywhere}
.hb-orderIcon{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;flex:none;border:0;background:transparent;color:inherit;padding:0;font-size:1.7rem!important}
.hb-orderLayout{display:grid;grid-template-columns:164px minmax(0,1fr) 328px;flex:1;min-height:0}
.hb-orderLayout.is-details{grid-template-columns:minmax(0,1fr) 360px}
.hb-orderLayout.is-details:has(.hb-orderReceipt){grid-template-columns:minmax(0,1fr)}
.hb-orderRail{padding:1.25rem .75rem;overflow-y:auto;border-right:1px solid var(--c-lina);overscroll-behavior:contain}
.hb-orderRail button{display:block;text-align:left;background:none;border:0;min-height:44px;width:100%;padding:.6rem .75rem;line-height:1.2;overflow-wrap:anywhere}
.hb-orderMain{min-width:0;overflow-y:auto;overscroll-behavior:contain;padding:1.5rem 1.5rem calc(2rem + env(safe-area-inset-bottom));scroll-padding-top:1rem;-webkit-overflow-scrolling:touch}
.hb-orderIntro{font-size:1rem;line-height:1.45;max-width:65ch;margin-bottom:1.5rem}
.hb-orderIntro p{margin:0 0 .5rem}
.hb-orderIntro p + p{color:var(--c-ink-med)}
.hb-orderLink{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;min-height:44px;border:0;padding:.4rem .15rem;background:none;text-decoration:underline;text-underline-offset:3px;line-height:1.35;text-align:left;white-space:normal}
.hb-orderSearch{display:grid;gap:.4rem;margin-bottom:1.75rem}
.hb-orderSearch label{font-size:.9rem;font-weight:500}
.hb-orderSearch input{width:100%;min-height:48px;background:var(--c-form);border:1px solid var(--c-lina);border-radius:8px;padding:.7rem .9rem}
.hb-orderSearch button{justify-self:start;font-size:.9rem}
.hb-orderGroup{scroll-margin-top:1rem;margin:0 0 2rem}
.hb-orderGroup h3,.hb-orderForm h3,.hb-orderReceipt h3{font-family:var(--f-disp);font-weight:700;font-size:1.7rem;letter-spacing:-.01em;line-height:1.15;margin:0 0 1rem;overflow-wrap:anywhere}
.hb-orderGroup ul,.hb-orderLines,.hb-orderRemember ul{margin:0;padding:0;list-style:none}
.hb-orderRow{position:relative;display:grid;grid-template-columns:72px minmax(0,1fr) auto;align-items:center;gap:.8rem;padding:1rem 0;border-top:1px solid var(--c-lina)}
.hb-orderRow.has-order{background:color-mix(in srgb,var(--c-rautt) 5%,transparent)}
.hb-orderRow > img{width:72px;height:84px;object-fit:contain;border-radius:8px;padding:4px}
.hb-orderName{position:relative;min-width:0;padding-right:14px}
.hb-orderName strong,.hb-orderLines strong{display:block;font-size:1.06rem;font-weight:700;line-height:1.25;overflow-wrap:anywhere}
.hb-orderName small,.hb-orderLines small{display:block;font-size:.8rem;color:var(--c-ink-med);line-height:1.35;margin-top:.3rem}
.hb-orderTick{position:absolute;right:0;top:0;color:var(--c-rautt);font-size:.9rem}
.hb-orderTick > span{display:block;animation:hb-orderTick .25s ease-out}
@keyframes hb-orderTick{from{opacity:0}to{opacity:1}}
.hb-amountUnit{display:grid;gap:4px;width:300px;grid-template-columns:144px minmax(0,1fr);align-items:center;max-width:100%;flex:none}
.hb-magn{display:grid;grid-template-columns:44px minmax(0,1fr) 44px;min-height:44px;box-shadow:inset 0 0 0 1px var(--c-lina);border-radius:6px;background:var(--c-form);overflow:hidden}
.hb-magn button{width:44px;height:44px;border:0;background:transparent;color:inherit;font:inherit;font-size:1.1rem;cursor:pointer;padding:0}
.hb-magn:has(input:focus-visible){outline:2px solid var(--c-rautt);outline-offset:3px}
.hb-magnN{width:100%;min-width:0;height:44px;text-align:center;background:transparent;border:0;color:inherit;font:inherit;font-size:16px;font-weight:500;font-variant-numeric:tabular-nums;padding:0}
.hb-amountUnit select{min-height:44px;width:100%;border:1px solid var(--c-lina);background:var(--c-form);border-radius:6px;padding:.4rem .5rem;font-size:16px}
.hb-orderSlip{min-height:0;overflow:auto;border-left:1px solid var(--c-lina);background:var(--c-el);overscroll-behavior:contain}
.hb-orderSlipInner{padding:1.25rem;display:flex;flex-direction:column;gap:1rem}
.hb-orderSlipTitle{display:flex;align-items:center;justify-content:space-between;gap:.5rem}
.hb-orderSlipTitle h3{font-family:var(--f-disp);font-size:1.5rem;font-weight:700;letter-spacing:-.01em;margin:0;line-height:1.1}
.hb-orderLines li{display:grid;grid-template-columns:minmax(0,1fr) 44px;align-items:start;gap:.75rem .5rem;padding:1rem 0;border-top:1px solid var(--c-lina)}
.hb-orderLines .hb-amountUnit{grid-column:1 / -1;display:flex;width:100%;gap:.5rem}
.hb-orderLines .hb-magn{width:152px;flex:none}
.hb-orderLines select{min-width:0;flex:1}
.hb-orderBar{display:none}
.hb-orderNotice{font-size:.9rem;line-height:1.4;overflow-wrap:anywhere}
.hb-orderNotice:empty{display:none}
.hb-orderNotice button{display:block}
.hb-orderConfirm{border-block:1px solid var(--c-lina);padding:.5rem 0}
.hb-orderConfirm p{margin:.5rem 0}
.hb-orderConfirm button{margin-right:1rem}
.hb-orderForm{max-width:48rem;margin:0 auto;display:grid;gap:1rem}
.hb-orderForm > p{margin:0}
.hb-orderForm > button{justify-self:start}
.hb-orderFields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
.hb-orderFields label{display:grid;align-content:start;gap:.4rem;font-size:.9rem;font-weight:500;min-width:0}
.hb-orderFields input,.hb-orderFields textarea{width:100%;min-width:0;border:1px solid var(--c-lina);background:var(--c-form);padding:.75rem;min-height:48px;border-radius:6px;font-size:16px}
.hb-orderFields textarea{resize:vertical}
.hb-orderWide{grid-column:1 / -1}
.hb-orderError{font-size:.85rem;color:var(--c-ink);font-weight:700}
.hb-orderFields [aria-invalid="true"]{border:2px solid var(--c-rautt)}
.hb-orderCheck{display:flex;align-items:center;gap:.65rem;min-height:44px;font-size:1rem}
.hb-orderCheck input{width:22px;height:22px;flex:none;accent-color:var(--c-rautt)}
.hb-orderRemember{padding:1rem;background:var(--c-el);margin-bottom:1.5rem;border-radius:8px}
.hb-orderRemember .hb-hnappur{white-space:normal}
.hb-orderRemember li{display:flex;justify-content:space-between;align-items:center;gap:1rem;font-size:.9rem;border-bottom:1px solid var(--c-lina)}
.hb-orderRemember > button:last-child{font-size:.9rem}
.hb-orderReceipt{max-width:42rem;margin:1rem auto}
.hb-orderReceipt > span{font-size:2rem;color:var(--c-rautt)}
.hb-orderReceipt pre{font:inherit;font-size:.95rem;white-space:pre-wrap;overflow-wrap:anywhere;border-block:1px solid var(--c-lina);padding:1.5rem 0}
.hb-orderHelpBack{position:absolute;inset:0;z-index:4;background:rgba(16,32,56,.2);display:flex;justify-content:flex-end;align-items:flex-start;padding:6rem 2rem 2rem}
.hb-orderHelp{position:relative;width:25rem;max-width:100%;max-height:100%;overflow:auto;padding:1.5rem;background:var(--c-bg);box-shadow:0 12px 48px #10203830;border:1px solid var(--c-lina);border-radius:10px}
.hb-orderHelp > button{float:right;margin:-.75rem -.75rem 0 0}
.hb-orderHelp h3{font-family:var(--f-disp);font-weight:700;font-size:1.6rem;letter-spacing:-.01em;line-height:1.15;margin:0 2rem 1rem 0}
.hb-orderHelp p,.hb-orderHelp li{font-size:1rem;line-height:1.5}
.hb-orderSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media (min-width:1200px){.hb-order{inset:16px;top:calc(var(--order-top,0px) + 16px);height:calc(var(--order-height,100dvh) - 32px);border-radius:14px;overflow:hidden}}
@media (max-width:1100px) and (min-width:761px){.hb-orderLayout{grid-template-columns:132px minmax(0,1fr) 292px}.hb-orderMain{padding:1rem}.hb-orderRow{grid-template-columns:72px minmax(0,1fr)}.hb-orderRow > .hb-amountUnit{grid-column:2}.hb-orderSlipInner{padding:1rem}.hb-orderLines .hb-amountUnit{flex-wrap:wrap}.hb-orderLines select{flex-basis:100%}}
@media (max-width:760px){
.hb-orderHead{padding:calc(.65rem + env(safe-area-inset-top)) 1rem .65rem}.hb-orderEyebrow{font-size:.75rem}.hb-orderHead h2{font-size:1.8rem}
.hb-orderLayout,.hb-orderLayout.is-details{display:flex;flex-direction:column;position:relative;overflow:hidden}
.hb-orderRail{display:flex;flex:none;padding:.35rem .75rem;overflow-x:auto;overflow-y:hidden;border-right:0;border-bottom:1px solid var(--c-lina);gap:.5rem}
.hb-orderRail button{width:auto;white-space:nowrap;flex:none;padding:.5rem;font-size:.9rem}
.hb-orderMain{flex:1;min-height:0;padding:1rem 1rem calc(1rem + env(safe-area-inset-bottom))}
.hb-orderIntro{font-size:.95rem;margin-bottom:1rem}.hb-orderIntro button{font-size:inherit}
.hb-orderRow{grid-template-columns:72px minmax(0,1fr);gap:.6rem .8rem;padding:1rem 0}.hb-orderRow > .hb-amountUnit{grid-column:2;display:grid;grid-template-columns:minmax(0,1fr);width:100%;max-width:280px;gap:.5rem}.hb-orderRow .hb-magn{width:100%;flex:none}.hb-orderRow select{flex:1;min-width:92px;width:auto}
.hb-orderSlip{flex:none;height:56px;max-height:70%;overflow:hidden;border-left:0;border-top:1px solid var(--c-lina);transition:none;display:flex;flex-direction:column;padding-bottom:env(safe-area-inset-bottom);height:calc(56px + env(safe-area-inset-bottom))}
.hb-orderSlip.expanded{height:calc(var(--order-height,100dvh) * .64)}
.hb-orderBar{display:flex;align-items:center;justify-content:space-between;gap:1rem;min-height:56px;flex:none;width:100%;background:var(--c-ink);color:var(--c-bg)!important;border:0;text-align:left;padding:.75rem 1rem}
.hb-orderSlipInner{min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:1rem;visibility:hidden;flex:1}.expanded .hb-orderSlipInner{visibility:visible}
.hb-orderSlipTitle h3{font-size:1.4rem}.hb-orderFields{grid-template-columns:minmax(0,1fr)}
.hb-orderHelpBack{padding:0;align-items:flex-end}.hb-orderHelp{width:100%;max-height:85%;border-radius:14px 14px 0 0;padding:1.5rem 1rem calc(1rem + env(safe-area-inset-bottom))}
.hb-orderForm .hb-hnappur{width:100%;padding:.8rem 1rem;text-align:center;line-height:1.3}
}
@media (max-width:520px){.hb-pokiH .hb-pokiO{display:none}}
@media (prefers-reduced-motion:reduce){.hb-order,.hb-pokiBak,.hb-orderSlip,.hb-sett{transition:none;transform:none}.hb-orderTick > span{animation:none}}

.hb-orderHead{flex-wrap:wrap}.hb-orderSteps{display:flex;gap:.6rem;align-items:center}.hb-orderSteps button{display:flex;gap:.4rem;align-items:center;background:none;border:0;min-height:44px;padding:.35rem .5rem;font-size:.9rem;border-bottom:2px solid transparent}.hb-orderSteps button[aria-current=step]{border-color:var(--c-ink);font-weight:700;opacity:1}.hb-orderSteps button>span{display:grid;place-items:center;border:1px solid currentColor;border-radius:50%;width:24px;height:24px;flex:none}.hb-orderHead>.hb-orderIcon{margin-left:auto}
.hb-orderRail button[aria-current=location]{background:var(--c-ink);color:var(--c-bg);border-radius:6px;font-weight:700}.hb-orderCategoryCount{display:inline-grid;place-items:center;margin-left:.5rem;border:1px solid currentColor;border-radius:50%;min-width:22px;height:22px;font-size:.75rem}
.hb-orderSearchBox{position:relative}.hb-orderSearchBox input{padding-right:48px}.hb-orderSearchBox>.hb-orderIcon{position:absolute;right:2px;top:2px}.hb-orderSearchBox input::-webkit-search-cancel-button{-webkit-appearance:none}
.hb-orderName{display:grid;gap:.4rem}.hb-orderName .hb-allergenBadges{margin-top:.1rem}.hb-orderName .hb-allergenBadges>span{font-size:.7rem}.hb-orderTotals{margin:0;font-size:1rem;line-height:1.5;font-weight:700;font-variant-numeric:tabular-nums}.hb-orderEmpty{border:1px solid var(--c-lina);padding:1.25rem;border-radius:8px}
.hb-orderForm{gap:1.5rem}.hb-orderFields{gap:1.25rem}.hb-orderForm>.hb-hnappur{min-height:52px}.hb-orderValid{font-size:.9rem;font-weight:700}.hb-orderReceipt{width:100%;max-width:48rem;margin:1rem auto 2rem;line-height:1.6}.hb-orderReceipt>h3{font-size:2.2rem}.hb-orderReceiptSlip{margin:2rem 0;padding:1.5rem;background:var(--c-el);border:1px solid var(--c-lina);border-radius:10px}.hb-orderReceiptSlip h4{font-family:var(--f-disp);font-size:1.6rem;margin:0 0 1rem}.hb-orderReceiptSlip dl{margin:0 0 1.5rem}.hb-orderReceiptSlip dl>div{display:grid;grid-template-columns:10rem minmax(0,1fr);gap:.7rem;padding:.4rem 0}.hb-orderReceiptSlip dt{font-size:.9rem}.hb-orderReceiptSlip dd{margin:0;overflow-wrap:anywhere;font-weight:500}.hb-orderReceiptSlip ul{list-style:none;padding:0;margin:0}.hb-orderReceiptSlip li{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;padding:1rem 0;border-top:1px solid var(--c-lina)}.hb-orderReceiptSlip li strong{font-weight:500;line-height:1.4;overflow-wrap:anywhere}.hb-orderReceiptSlip li>span{white-space:nowrap;font-weight:700}.hb-orderReceipt summary{min-height:44px;cursor:pointer;padding:.5rem 0}
@media(max-width:1100px) and (min-width:761px){.hb-orderHead>div{flex:1}.hb-orderSteps{order:3;width:100%}}
@media(max-width:760px){.hb-orderHead>div{order:0}.hb-orderHead>.hb-orderIcon{order:1}.hb-orderSteps{order:2;width:100%;justify-content:space-between;gap:.2rem}.hb-orderSteps button{font-size:.8rem;gap:.3rem;padding:.2rem;flex:1;justify-content:center}.hb-orderReceiptSlip{padding:1rem}.hb-orderReceiptSlip dl>div{grid-template-columns:minmax(0,1fr);gap:.15rem}.hb-orderReceiptSlip li{flex-wrap:wrap;gap:.4rem}.hb-orderRow>.hb-amountUnit{grid-column:2}.hb-orderName{padding-right:12px}}

/* One phone bar (Claude 11-11): the order count toggle and Áfram share the footer; the separate bar and Loka go (× is in the header). */
.hb-orderFootCount{display:none}
@media (max-width:760px){
  .hb-orderBar{display:none!important}
  .hb-orderSlip:not(.expanded){height:0!important;border-top:0!important;padding-bottom:0!important}
  .hb-orderSlip.expanded{height:min(64dvh,calc(var(--order-height,100dvh) * .64))!important;border-top:1px solid var(--c-lina)!important}
  .hb-orderSlip{grid-template-rows:minmax(0,1fr)!important}
  .hb-orderSlip.expanded .hb-orderSlipBody{height:100%;min-height:0;display:flex;flex-direction:column}
  .hb-orderSlip.expanded .hb-orderSlipInner{visibility:visible;flex:1;min-height:0;overflow-y:auto}
  .hb-orderSlip{transition:height var(--motion-panel,.32s) var(--motion-out,ease-out)!important}
  .hb-orderFootHint,.hb-orderFootClose{display:none!important}
  .hb-orderFootCount{display:flex;align-items:center;gap:.5rem;min-height:48px;padding:0 .25rem;border:0;background:none;color:inherit;font-weight:600;font-size:1rem;margin-right:auto}
  .hb-orderFootCount span{transition:transform var(--motion-ui,.22s) var(--motion-out,ease-out)}
}
@media (max-width:380px){.hb-orderHead h2{font-size:1.45rem}.hb-orderHead>div{min-width:0;flex:1 1 0}}

`
